import * as THREE from 'three';
import { CFG } from '../core/Config.js';
import { clamp, damp } from '../core/Easing.js';
import { Spring } from '../core/Spring.js';

// M1-M7: movement that flows like water. Sprint → slide → jump → ADS chain
// as one continuous motion. Spring-eased state transitions, no snaps.
export class Player {
  constructor(camera, input, god = false) {
    this.camera = camera;
    this.input = input;
    this.god = god;

    this.pos = new THREE.Vector3(0, 0, 0);      // feet
    this.vel = new THREE.Vector3();
    this.yaw = 0; this.pitch = 0;
    this.onGround = true;
    this.fallHeight = 0;
    this.landDip = 0;                            // camera+weapon sink on touchdown

    // state
    this.crouching = false;
    this.sprinting = false;
    this.tac = false;
    this.sliding = false;
    this.slideDir = new THREE.Vector3();
    this.lean = 0; this.leanTarget = 0;
    this.adsLevel = 0;                           // 0..1 (set by weapon)
    this.mantle = null;                           // {phase, t, from, over}
    this.lowHp = false;

    // springs / smoothing
    this.eyeH = new Spring(CFG.move.eyeStand, 260, 1.0);
    this.leanSpring = new Spring(0, 180, 0.9);
    this.cantSpring = new Spring(0, 120, 0.8);   // camera roll (slide)
    // FOV spring (reference: camera.js) — the zoom glides, kicks settle
    this.fovSpring = new Spring(CFG.ads.fovHip, CFG.ads.fov.k, CFG.ads.fov.zeta);
    // actual look deltas applied THIS frame (rad) — the camera leads, and
    // the weapon's look-lag springs are impulse-driven by these (sway.js)
    this.lookYawDelta = 0;
    this.lookPitchDelta = 0;
    this.pitchS = this.pitch;
    this.yawS = this.yaw;

    this.hp = CFG.player.maxHp;
    this.regenT = 0;
    this.radius = CFG.player.radius;
    this.height = CFG.move.standHeight;

    this._fwd = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._wish = new THREE.Vector3();
  }

  getEye() { return this.eyeSpringValue(); }
  eyeSpringValue() { return this.eyeH.value; }

  start() {
    this.pos.set(0, 0, 0);
    this.vel.set(0, 0, 0);
    this.yaw = 0; this.pitch = 0;
    this.hp = CFG.player.maxHp;
    this.regenT = 0;
    this.onGround = true;
    this.crouching = false; this.sprinting = false; this.tac = false;
    this.sliding = false; this.mantle = null;
    this.eyeH.set(CFG.move.eyeStand);
  }

  getForward(out) {
    out.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    return out;
  }
  getRight(out) {
    out.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    return out;
  }
  getEyePos(out) { return out.copy(this.pos).setY(this.pos.y + this.eyeH.value); }

  takeDamage(amount, dir) {
    if (this.god) return 0;
    const before = this.hp;
    this.hp = Math.max(0, this.hp - amount);
    this.regenT = 0;
    const d = before - this.hp;
    this.lowHp = this.hp < 30;
    return d;
  }

  update(rawDt, dt, env) {
    const inp = this.input;
    const m = CFG.move;

    // ---- mouse look (camera LEADS: direct, no smoothing) ----
    const md = inp.readMouse();
    const sens = 0.0022 * (1 - this.adsLevel * (1 - CFG.ads.sensMulADS));
    const nyaw = this.yaw - md.x * sens;
    const npitch = clamp(this.pitch - md.y * sens, -1.45, 1.45);
    // record what the camera actually did this frame — the weapon's
    // look-lag springs trail these impulses (the gun is heavy, it follows)
    this.lookYawDelta = nyaw - this.yaw;
    this.lookPitchDelta = npitch - this.pitch;
    this.yaw = nyaw;
    this.pitch = npitch;

    // ---- mantle override ----
    if (this.mantle) {
      this._updateMantle(dt);
      this._collide(dt, env);
      this._applyCamera(rawDt, dt);
      this._regen(dt);
      return;
    }

    // ---- crouch (M4): hold Ctrl when not sprinting/sliding ----
    const wantCrouch = inp.key('ControlLeft') || inp.key('ControlRight');
    if (this.sliding && !wantCrouch) { /* keep sliding */ }
    const wasCrouch = this.crouching;
    if (!this.sprinting && !this.sliding) {
      this.crouching = wantCrouch;
    }
    if (this.crouching && !wasCrouch) { /* start crouch */ }
    // eye height target
    const eyeTarget = this.crouching ? m.eyeCrouch : m.eyeStand;
    this.eyeH.target = eyeTarget;

    // ---- slide start (M3): Ctrl while sprinting ----
    if (this.sprinting && wantCrouch && this.onGround && !this.sliding) {
      this.sliding = true;
      this.sprinting = false;
      this.crouching = true;
      // preserve sprint momentum, boost a bit
      this.getForward(this._fwd);
      this._wish.set(0, 0, 0);
      this._buildWish();
      if (this._wish.lengthSq() < 0.01) this._wish.copy(this._fwd);
      this._wish.normalize().multiplyScalar(m.slideSpeed);
      this.slideDir.copy(this._wish);
      this.cantSpring.set(-0.16);
      this.cantSpring.target = -0.16;
    }
    // exit slide
    if (this.sliding) {
      if (this.vel.length() < 1.5 || !wantCrouch) {
        this.sliding = false;
        this.cantSpring.target = 0;
      }
    }

    // ---- sprint / tac-sprint (M2) ----
    const shift = inp.key('ShiftLeft') || inp.key('ShiftRight');
    if (inp.consumeShiftDouble() && this.onGround && !this.crouching) {
      this.tac = true;
    }
    const wasSprint = this.sprinting;
    this.sprinting = shift && !this.crouching && !this.sliding && !this.mantle;
    if (this.sprinting && !wasSprint) {
      // FOV kick on sprint start (F6) — scaled to the stiffer FOV spring
      // so the kick stays visible
      this.fovSpring.addImpulse(12);
    }
    if (!shift) this.tac = false;

    // ---- jump / mantle (M6/M1) ----
    if (inp.key('Space') && this.onGround) {
      const ob = this._findMantleObstacle(env);
      if (ob && !this.sliding) {
        this._startMantle(ob);
      } else {
        this.vel.y = m.jumpVel;
        this.onGround = false;
        if (this.sliding) { /* slide-jump preserves momentum (M3) */ }
      }
    }

    // ---- build wish direction (WASD) ----
    this._buildWish();
    let speed = this.crouching ? m.walk * m.crouchMul : (this.tac ? m.tacSprint : this.sprinting ? m.sprint : m.walk);
    if (this.sliding) speed = 0;

    // ---- horizontal movement ----
    if (this.sliding) {
      // momentum slide: keep direction, slow friction (M3)
      this.vel.x += (this.slideDir.x - this.vel.x) * Math.min(1, m.slideFriction * dt);
      this.vel.z += (this.slideDir.z - this.vel.z) * Math.min(1, m.slideFriction * dt);
    } else if (this.onGround) {
      // ground: exponentially damp toward wish (friction + response)
      const targetVx = this._wish.x * speed;
      const targetVz = this._wish.z * speed;
      const resp = m.friction + (this._wish.lengthSq() > 0 ? 14 : 0);
      this.vel.x = damp(this.vel.x, targetVx, resp, dt);
      this.vel.z = damp(this.vel.z, targetVz, resp, dt);
    } else {
      // air control (M1)
      this.vel.x += (this._wish.x * speed - this.vel.x) * Math.min(1, m.airAccel * dt * m.airControl);
      this.vel.z += (this._wish.z * speed - this.vel.z) * Math.min(1, m.airAccel * dt * m.airControl);
    }

    // ---- gravity (M1) ----
    if (!this.onGround || this.vel.y < 0) {
      this.vel.y -= m.gravity * dt;
    }
    this.fallHeight = this.onGround ? 0 : this.fallHeight + Math.max(0, -this.vel.y) * dt;

    // ---- integrate ----
    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    this.pos.z += this.vel.z * dt;

    // ---- floor (M1 landing dip) ----
    let landed = false;
    if (this.pos.y <= 0) {
      if (!this.onGround && this.fallHeight > 0.4) {
        this.landDip = clamp(this.fallHeight * 0.4, 0, 0.35);
      }
      this.pos.y = 0;
      this.vel.y = 0;
      if (!this.onGround) landed = true;
      this.onGround = true;
    } else if (this.pos.y > 0.05) {
      this.onGround = false;
    }
    // decay landing dip
    this.landDip = damp(this.landDip, 0, 8, rawDt);

    // ---- colliders ----
    const topLanded = this._collide(dt, env);
    if (topLanded) {
      if (!this.onGround) this.landDip = 0.1;
      this.onGround = true;
    }

    // ---- lean (M5) ----
    const leanIn = (inp.key('KeyE') ? 1 : 0) + (inp.key('KeyQ') ? -1 : 0);
    let leanTarget = leanIn;
    if (leanTarget === 0 && this.adsLevel > 0.5) {
      leanTarget = this._autoPeek(env);
    }
    this.leanTarget = leanTarget;
    this.leanSpring.target = leanTarget * m.leanAmount;
    // cant target
    this.cantSpring.target = this.sliding ? -0.16 : (this.leanTarget * -m.leanTilt * 0.5);

    this._applyCamera(rawDt, dt);
    this._regen(dt);
  }

  _buildWish() {
    const inp = this.input;
    this.getForward(this._fwd);
    this.getRight(this._right);
    this._wish.set(0, 0, 0);
    if (inp.key('KeyW')) this._wish.add(this._fwd);
    if (inp.key('KeyS')) this._wish.sub(this._fwd);
    if (inp.key('KeyD')) this._wish.add(this._right);
    if (inp.key('KeyA')) this._wish.sub(this._right);
    if (this._wish.lengthSq() > 0) this._wish.normalize();
  }

  // U3: contextual mantle prompt availability.
  canMantle(env) {
    if (this.mantle || !this.onGround) return false;
    return !!this._findMantleObstacle(env);
  }

  _findMantleObstacle(env) {
    // waist-high obstacle in front, within reach
    this.getForward(this._fwd);
    const eye = this.getEyePos(new THREE.Vector3());
    for (const o of env.waistObstacles) {
      const c = o.box.getCenter(new THREE.Vector3());
      const toC = c.clone().sub(this.pos);
      toC.y = 0;
      const dist = toC.length();
      if (dist > 2.2 || dist < 0.3) continue;
      // must be roughly in front
      const dir = toC.clone().normalize();
      if (dir.dot(this._fwd) < 0.5) continue;
      // waist height: top of box between 0.7 and 1.4
      if (o.box.max.y < 0.7 || o.box.max.y > 1.5) continue;
      return o;
    }
    return null;
  }

  _startMantle(ob) {
    const c = ob.box.getCenter(new THREE.Vector3());
    this.getForward(this._fwd);
    const dir = new THREE.Vector3(c.x - this.pos.x, 0, c.z - this.pos.z).normalize();
    this.mantle = {
      phase: 1, t: 0,
      from: this.pos.clone(),
      over: new THREE.Vector3(c.x, ob.box.max.y + 0.1, c.z),
      dir,
      dur1: 0.18, dur2: 0.22,
      dip: 0.0,
    };
    this.vel.set(0, 0, 0);
    this.onGround = false;
  }

  _updateMantle(dt) {
    const mn = this.mantle;
    mn.t += dt;
    if (mn.phase === 1) {
      // move to front of obstacle, dip camera
      const p = Math.min(1, mn.t / mn.dur1);
      const e = 1 - (1 - p) * (1 - p); // easeOut
      this.pos.x = mn.from.x + mn.dir.x * 0.7 * e;
      this.pos.z = mn.from.z + mn.dir.z * 0.7 * e;
      this.pos.y = mn.from.y + Math.sin(p * Math.PI) * 0.1; // slight crouch
      mn.dip = Math.sin(p * Math.PI) * 0.25;
      if (p >= 1) { mn.phase = 2; mn.t = 0; }
    } else {
      // push up and over
      const p = Math.min(1, mn.t / mn.dur2);
      const e = p * p * (3 - 2 * p); // smoothstep
      const targetX = mn.from.x + mn.dir.x * 1.1;
      const targetZ = mn.from.z + mn.dir.z * 1.1;
      this.pos.x = mn.from.x + (targetX - mn.from.x) * e;
      this.pos.z = mn.from.z + (targetZ - mn.from.z) * e;
      const topY = mn.over.y;
      this.pos.y = mn.from.y + (topY - mn.from.y) * e;
      mn.dip = Math.sin(p * Math.PI) * 0.2;
      if (p >= 1) {
        this.pos.y = Math.max(0, this.pos.y);
        this.vel.y = 0;
        this.onGround = this.pos.y <= 0.05;
        this.mantle = null;
      }
    }
  }

  _autoPeek(env) {
    // M5: standing close to cover while ADS → auto-lean around the corner.
    if (this.vel.length() > 0.5) return 0;
    this.getForward(this._fwd);
    this.getRight(this._right);
    const check = (side) => {
      // probe a point slightly to `side`
      const probe = this.pos.clone().addScaledVector(this._right, side * 0.7);
      for (const c of env.colliders) {
        if (probe.x > c.min.x && probe.x < c.max.x && probe.z > c.min.z && probe.z < c.max.z && c.max.y > 0.5) {
          return true;
        }
      }
      return false;
    };
    const left = check(-1);
    const right = check(1);
    if (left && !right) return 1;    // wall on left → peek right
    if (right && !left) return -1;   // wall on right → peek left
    return 0;
  }

  _collide(dt, env) {
    let landedTop = false;
    // M4: collider shrinks when crouched so low cover protects
    const h = this.crouching ? CFG.move.crouchHeight : CFG.move.standHeight;
    const r = this.radius * (this.crouching ? 0.85 : 1);
    for (const c of env.colliders) {
      const px = this.pos.x, pz = this.pos.z, py = this.pos.y;
      // closest point on the box to player (xz)
      const cx = clamp(px, c.min.x, c.max.x);
      const cz = clamp(pz, c.min.z, c.max.z);
      const dx = px - cx, dz = pz - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < r * r) {
        // standing on top?
        if (py >= c.max.y - 0.15 && py <= c.max.y + 0.4 && this.vel.y <= 0.5) {
          // land on top
          if (py < c.max.y) {
            this.pos.y = c.max.y;
            if (this.vel.y < -2) this.landDip = 0.1;
            this.vel.y = 0;
            landedTop = true;
          }
        } else if (py + h > c.min.y) {
          // push out horizontally
          const d = Math.sqrt(d2);
          if (d > 1e-4) {
            const push = r - d;
            this.pos.x += (dx / d) * push;
            this.pos.z += (dz / d) * push;
          } else {
            // center inside: push along min axis
            const toLeft = px - c.min.x, toRight = c.max.x - px;
            const toFront = pz - c.min.z, toBack = c.max.z - pz;
            const m = Math.min(toLeft, toRight, toFront, toBack);
            if (m === toLeft) this.pos.x = c.min.x - r;
            else if (m === toRight) this.pos.x = c.max.x + r;
            else if (m === toFront) this.pos.z = c.min.z - r;
            else this.pos.z = c.max.z + r;
          }
        }
      }
    }
    return landedTop;
  }

  _applyCamera(rawDt, dt) {
    const m = CFG.move;
    // springs (use rawDt so recovery feels real-time)
    this.eyeH.update(rawDt);
    this.leanSpring.update(rawDt);
    this.cantSpring.update(rawDt);
    // FOV: base 75, sprint +5, ADS → 55
    const sprintFov = this.sprinting ? 5 : 0;
    const fovTarget = THREE.MathUtils.lerp(CFG.ads.fovHip, CFG.ads.fovADS, this.adsLevel) + sprintFov;
    this.fovSpring.target = fovTarget;
    this.fovSpring.update(rawDt);
    this.camera.fov = this.fovSpring.value;
    this.camera.updateProjectionMatrix();

    // eye position
    const leanOff = this.leanSpring.value;
    this.getForward(this._fwd);
    this.getRight(this._right);
    this.camera.position.copy(this.pos);
    this.camera.position.y = this.pos.y + this.eyeH.value - this.landDip - (this.mantle ? this.mantle.dip * 0.3 : 0);
    this.camera.position.addScaledVector(this._right, leanOff);
    this.camera.position.addScaledVector(this._fwd, this.crouching ? 0 : 0);

    // orientation
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.camera.rotation.z = this.cantSpring.value;

    // ADS micro-breathing — a held aim is alive, not a locked tripod
    // (only over the last 30% of the ADS transition)
    const ab = Math.max(0, (this.adsLevel - 0.7) / 0.3);
    if (ab > 0) {
      if (this.camT === undefined) this.camT = 0;
      this.camT += rawDt;
      const t = this.camT;
      this.camera.position.x += Math.sin(t * 0.8) * 0.004 * ab;
      this.camera.position.y += Math.cos(t * 1.1) * 0.003 * ab;
      this.camera.rotation.z += Math.sin(t * 0.6) * 0.0007 * ab;
    }
  }

  _regen(dt) {
    if (this.god) { this.hp = CFG.player.maxHp; this.lowHp = false; return; }
    this.regenT += dt;
    if (this.regenT > CFG.player.regenDelay && this.hp < CFG.player.maxHp) {
      this.hp = Math.min(CFG.player.maxHp, this.hp + CFG.player.regenRate * dt);
    }
    this.lowHp = this.hp < 30;
  }
}
