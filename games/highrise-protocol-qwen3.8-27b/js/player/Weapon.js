import * as THREE from 'three';
import { CFG } from '../core/Config.js';
import { rng } from '../core/PRNG.js';
import { Spring } from '../core/Spring.js';
import { clamp } from '../core/Easing.js';

// F1-F8 / A1-A4: the gun. Full-auto 700 RPM, 30-round mag, infinite reserve.
// Signature recoil: punchy per-shot kick, repeatable climb pattern, spring
// recovery. Shots land exactly where the dot points (A3).
export class Weapon {
  constructor({ camera, viewmodel, audio, env, raycaster, hooks }) {
    this.camera = camera;
    this.vm = viewmodel;
    this.audio = audio;
    this.env = env;
    this.raycaster = raycaster || new THREE.Raycaster();
    this.hooks = hooks; // { onShot, onShell, onMuzzle, onTracer, onReloadPhase, onReloadStart, onInspect }

    const w = CFG.weapon;
    this.w = w;
    this.mag = w.magSize;
    this.magFull = w.magSize;
    this.fireInterval = 60 / w.rpm;
    this.fireTimer = 0;
    this.shotsSinceReload = 0;
    this.heat = 0;
    this._dryT = 0;

    this.adsLevel = 0;
    // A1: buttery near-critical transition (reference: ads.js) — ~150 ms
    // hip<->ADS, smooth, no cut, no bounce.
    this.adsSpring = new Spring(0, CFG.ads.transition.k, CFG.ads.transition.zeta);
    this._wantADS = false;
    this.reloading = false;
    this.reloadTimer = 0;
    this.reloadDuration = 1.6; // must match viewmodel phase totals (0.5+0.6+0.5)
    this.overdrive = false;

    // R2: reload sounds are driven by viewmodel events (exact animation
    // beats) instead of time fractions — no more desync.
    this.vm.onEvent = (name) => this._vmEvent(name);

    // F2 camera (aim) recoil — impulse-driven, two decoupled layers
    // (reference: recoil.js). The view kick is WEAK and fast: a sharp
    // FAST component that mostly returns in ~120 ms, plus a SLOW residual
    // that drifts ~400 ms and ACCUMULATES over consecutive shots (climb).
    // The gun viewmodel absorbs the big visible kick, so the view stays
    // controllable — sustained fire climbs, release recovers.
    this.recPitchFast = new Spring(0, w.viewFast.k, w.viewFast.zeta);
    this.recPitchSlow = new Spring(0, w.viewSlow.k, w.viewSlow.zeta);
    this.recYawFast = new Spring(0, w.viewFast.k, w.viewFast.zeta);
    this.recYawSlow = new Spring(0, w.viewSlow.k, w.viewSlow.zeta);
    // R1: subtle camera roll that follows the weapon through reload phases
    this.rollSpring = new Spring(0, 140, 1.0);
    // climb bookkeeping: consecutive shots accumulate, 0.24s without fire
    // resets the pattern (reference: PATTERN_RESET)
    this._shots = 0;
    this._lastFireT = -10;
    this._t = 0;

    this._origin = new THREE.Vector3();
    this._dir = new THREE.Vector3();
    this._fwd = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._cone = new THREE.Vector3();
  }

  // total camera pitch kick (fast + slow layers) — exposed for debug/tests
  get recPitch() { return this.recPitchFast.value + this.recPitchSlow.value; }
  get recYaw() { return this.recYawFast.value + this.recYawSlow.value; }

  reset() {
    this.mag = this.magFull;
    this.fireTimer = 0;
    this.shotsSinceReload = 0;
    this.heat = 0;
    this.adsLevel = 0; this.adsSpring.set(0);
    this.reloading = false; this.reloadTimer = 0;
    this.recPitchFast.set(0); this.recPitchSlow.set(0);
    this.recYawFast.set(0); this.recYawSlow.set(0);
    this._shots = 0; this._lastFireT = -10;
    this.hooks.onMag && this.hooks.onMag(this.mag);
    this.vm.reload = null;
    this.vm.resetKick();
    if (this.playerRef) this.vm.resetFollow(this.playerRef.yaw, this.playerRef.pitch);
  }

  currentSpread() {
    const w = this.w;
    let s;
    if (this.adsLevel > 0.5) s = this.crouching ? w.spreadCrouchADS : w.spreadADS;
    else s = this.crouching ? w.spreadCrouchHip : w.spreadHip;
    // movement adds spread
    if (this.playerRef) {
      const spd = Math.hypot(this.playerRef.vel.x, this.playerRef.vel.z);
      s += Math.min(1.4, spd / 9) * w.spreadMoveAdd;
    }
    if (!this.onGroundRef) s *= w.spreadAirMul;
    // heat grows spread on sustained fire, overdrive tightens
    s += this.heat * 0.004;
    if (this.overdrive) s *= 0.6;
    return s;
  }
  // refs set each frame in update()
  crouching = false; onGroundRef = true; playerRef = null;

  startReload(tactical) {
    if (this.reloading || this.mag === this.magFull) return false;
    this.reloading = true;
    this.reloadDuration = tactical ? 1.1 : 1.6; // match viewmodel phases
    this.reloadTimer = 0;
    this.vm.startReload(tactical);
    this.hooks.onReloadStart && this.hooks.onReloadStart(tactical);
    return true;
  }

  // Viewmodel animation-beat → sound (R2/R4: pitched up in OVERDRIVE).
  _vmEvent(name) {
    const rp = this.overdrive ? 1.3 : 1;
    switch (name) {
      case 'magRelease': this.audio.magRelease(rp); break;
      case 'magEject':   this.audio.magEject(rp); break;
      case 'magInsert':  this.audio.magInsert(rp); break;
      case 'boltBack':   this.audio.boltBack(rp); break;
      case 'boltFwd':    this.audio.boltFwd(rp); break;
      case 'reloadDone': this.audio.reloadDone(rp); break;
    }
  }
  cancelReload() {
    if (!this.reloading) return;
    this.reloading = false;
    this.vm.cancelReload();
  }

  update(rawDt, dt, player) {
    const w = this.w;
    this.crouching = player.crouching;
    this.onGroundRef = player.onGround;
    this.playerRef = player;

    // ---- ADS (A1): hold RIGHT mouse button (DOM button 2) — springy
    // transition, alive in the hold. (button 1 = wheel/middle — not ADS)
    const inp = player.input;
    const wantADS = inp.mouseDown[2] && !this.reloading;
    if (wantADS !== this._wantADS) {
      if (wantADS && this.adsLevel < 0.5) { this.audio.adsIn(); this.vm.adsPulse = 1; }
      else if (!wantADS && this.adsLevel > 0.5) this.audio.adsOut();
    }
    this._wantADS = wantADS;
    this.adsSpring.target = wantADS ? 1 : 0;
    this.adsSpring.update(rawDt);
    this.adsLevel = this.adsSpring.value;
    player.adsLevel = this.adsLevel;

    // ---- reload timing (sounds fire from viewmodel animation beats) ----
    if (this.reloading) {
      this.reloadTimer += dt * (this.overdrive ? 1.3 : 1); // R4: faster in overdrive
      if (this.reloadTimer >= this.reloadDuration) {
        this.reloading = false;
        this.mag = this.magFull;
        this.shotsSinceReload = 0;
        this.hooks.onMag && this.hooks.onMag(this.mag);
      }
      // sprint cancels reload (R3) — viewmodel eases back smoothly
      if (player.sprinting || player.tac) {
        this.cancelReload();
      }
    }

    // ---- inspect (F7): I ----
    if (inp.key('KeyI') && this.inspectQueued === false) { this.inspectQueued = true; this.vm.startInspect(); this.hooks.onInspect && this.hooks.onInspect(); }
    if (!inp.key('KeyI')) this.inspectQueued = false;

    // ---- firing (F1): hold LMB ----
    this.fireTimer -= dt;
    const wantFire = inp.mouseDown[0];
    if (wantFire && !this.reloading && this.mag > 0 && this.fireTimer <= 0) {
      this.fire(player);
    } else if (wantFire && this.mag <= 0 && !this.reloading && this._dryT <= 0) {
      this._dryT = 0.3; this.audio.dryfire(); this.vm.dryfireBolt();
    }
    if (this._dryT > 0) this._dryT -= dt;

    // ---- reload trigger (R) ----
    if (inp.key('KeyR') && !this.reloading && this.mag < this.magFull) {
      this.startReload(this.mag > 0); // tactical if rounds remain
    }

    // heat decay
    this.heat = Math.max(0, this.heat - dt * 0.5);

    // ---- viewmodel ----
    this.vm.update(rawDt, dt, player, this.adsLevel, this.heat);

    // ---- camera recoil (F2): fast + slow layers, added on top of player ----
    this._t += dt;
    if (this._t - this._lastFireT > w.patternReset) this._shots = 0;
    this.recPitchFast.update(rawDt);
    this.recPitchSlow.update(rawDt);
    this.recYawFast.update(rawDt);
    this.recYawSlow.update(rawDt);
    this.camera.rotation.x += this.recPitchFast.value + this.recPitchSlow.value;
    this.camera.rotation.y += this.recYawFast.value + this.recYawSlow.value;

    // ---- R1: camera roll follows the weapon during reload ----
    let rollTarget = 0;
    if (this.reloading && this.vm.reload) {
      const ph = this.vm.reload.phase;
      rollTarget = ph === 1 ? -0.06 : ph === 2 ? 0.03 : 0.0;
    }
    this.rollSpring.target = rollTarget;
    this.rollSpring.update(rawDt);
    this.camera.rotation.z += this.rollSpring.value;
  }

  // F2: impulse-driven view kick (reference: recoil.js). The camera kick is
  // small and fast — the gun viewmodel does the heavy visible work. Con-
  // secutive shots accumulate CLIMB in the slow layer, so sustained fire
  // leaves the aim (and with it the red dot + bullets) off-target; release
  // recovers to the held direction in ~0.4 s.
  fire(player) {
    const w = this.w;
    this.mag--;
    this.hooks.onMag && this.hooks.onMag(this.mag);
    this.fireTimer = this.fireInterval;
    this.shotsSinceReload++;
    this.heat = Math.min(1, this.heat + 0.08);

    const first = this.shotsSinceReload === 1;
    const sideSign = rng.sign();
    // stance scaling: ADS/crouch reduce, floors keep at least punch
    let scale = 1 - (1 - w.adsRecoilFloor) * this.adsLevel;
    scale *= 1 - w.crouchRecoilReduce * (this.crouching ? 1 : 0);
    scale = Math.max(scale, w.globalRecoilFloor);
    // pattern continuity: consecutive shots accumulate climb
    const climb = Math.min(this._shots * w.climbPerShot, w.climbMax);
    const wander = rng.gauss() * w.viewYawWander;
    const vk = w.viewKick * scale;
    // (1) rotational kick: split fast/slow, seeded horizontal wander
    this.recPitchFast.addImpulse(vk * 0.72);
    this.recPitchSlow.addImpulse(vk * 0.28 + climb * 0.18);
    this.recYawFast.addImpulse(vk * wander * 0.5);
    this.recYawSlow.addImpulse(vk * wander * 0.22);
    this._shots++;
    this._lastFireT = this._t;
    this.vm.fireKick(first, sideSign, this.adsLevel);

    // F4/F6
    this.hooks.onMuzzle && this.hooks.onMuzzle(this.camera);

    // ---- A3: ray from camera center along forward with spread cone ----
    this.camera.getWorldDirection(this._fwd);
    this._origin.copy(this.camera.position);
    // spread cone
    const spread = this.currentSpread();
    if (spread > 0.0001) {
      this._up.set(0, 1, 0).applyQuaternion(this.camera.quaternion);
      this._right.set(1, 0, 0).applyQuaternion(this.camera.quaternion);
      const ang = rng.next() * Math.PI * 2;
      const r = Math.sqrt(rng.next()) * spread;
      this._cone.copy(this._fwd)
        .addScaledVector(this._right, Math.cos(ang) * r)
        .addScaledVector(this._up, Math.sin(ang) * r)
        .normalize();
    } else {
      this._cone.copy(this._fwd);
    }
    this._dir.copy(this._cone);

    // raycast (with thin-cover penetration, E3)
    const hit = this.raycastWithPenetration(this._origin, this._dir);

    // tracer
    const muzzle = new THREE.Vector3();
    this.vm.muzzleWorld(muzzle);
    const end = hit.point ? hit.point.clone() : this._origin.clone().addScaledVector(this._dir, 60);
    this.hooks.onTracer && this.hooks.onTracer(muzzle, end, hit);
    // shell
    this.hooks.onShell && this.hooks.onShell(muzzle, this._dir);

    // audio + shake
    this.audio.gunshot(1.0, 1.0);
    this.hooks.onShot && this.hooks.onShot({ origin: this._origin, dir: this._dir, hit, spread, mag: this.mag, first });
  }

  // Raycast against world + enemies. Thin cover (drywall/sheet) penetrates
  // with reduced damage (E3). Returns the closest solid hit (or thin-cover
  // chain ending at a solid).
  raycastWithPenetration(origin, dir) {
    const ray = this.raycaster;
    ray.set(origin, dir);
    ray.far = 120;
    const worldTargets = this.env.getRaycastTargets();
    let damageMul = 1.0;
    let lastThin = null;
    let curO = origin, curD = dir;
    for (let pen = 0; pen < 3; pen++) {
      ray.set(curO, curD);
      // world
      const worldHits = ray.intersectObjects(worldTargets, false);
      // enemies
      let enemyHit = null;
      if (this.enemies) {
        for (const e of this.enemies) {
          if (!e.alive) continue;
          const eh = e.raycast(ray);
          if (eh && (!enemyHit || eh.distance < enemyHit.distance)) enemyHit = eh;
        }
      }
      // pick closest
      let best = null, bestType = 'concrete', bestColor = null, bestMesh = null, bestEnemy = null, bestPart = null, bestDist = Infinity;
      if (worldHits.length > 0 && worldHits[0].distance < bestDist) {
        bestDist = worldHits[0].distance;
        const wh = worldHits[0];
        best = wh;
        bestMesh = wh.object;
        // classify by userData
        const sh = this.env.findShootable(wh.object);
        if (sh) { bestType = sh.type; bestColor = sh.color; }
        else bestType = 'concrete';
      }
      if (enemyHit && enemyHit.distance < bestDist) {
        bestDist = enemyHit.distance;
        best = { point: enemyHit.point, normal: enemyHit.normal, distance: enemyHit.distance, object: enemyHit.mesh };
        bestEnemy = enemyHit.enemy;
        bestPart = enemyHit.part;
        bestType = 'enemy';
      }
      if (!best) return { point: null, miss: true, damageMul };
      const point = best.point;
      const normal = best.normal || new THREE.Vector3(0, 1, 0);

      // enemy hit: stop
      if (bestType === 'enemy') {
        return { point, normal, enemy: bestEnemy, part: bestPart, damageMul, isEnemy: true };
      }
      // thin cover: penetrate
      if (bestType === 'drywall' || bestType === 'sheet') {
        lastThin = { point, normal, type: bestType, color: bestColor };
        damageMul *= 0.6;
        curO = point.clone().addScaledVector(dir, 0.05);
        curD = dir.clone();
        continue;
      }
      // solid: stop
      return { point, normal, type: bestType, color: bestColor, mesh: bestMesh, damageMul, isEnemy: false };
    }
    return { point: lastThin ? lastThin.point : null, normal: lastThin ? lastThin.normal : new THREE.Vector3(0, 1, 0), type: lastThin ? lastThin.type : 'concrete', color: lastThin ? lastThin.color : null, damageMul, isEnemy: false };
  }

  // A4: SELF-TEST — three independent checks, each run at FOV 75/65/55:
  //  (1) RAY ALIGNMENT — cast the gun ray into the REAL world, take the
  //      actual hit point, project it, assert within 1 px of the exact
  //      screen center.
  //  (2) SIGHT PROJECTION — rearSightAnchor (the eye point) within 2 px of
  //      center AND frontSightAnchor (front glass) within 2 px of it: the
  //      two sight planes must stack on the aim line.
  //  (3) SIGHT-LINE CLEARANCE — for every viewmodel bounding-box corner
  //      closer to the camera than the rear sight, assert its angular
  //      offset from the view axis exceeds 8° (no solid geometry in the
  //      sight line), and assert the weapon's rearmost point (the stock)
  //      is BEHIND the camera. Failures name the offending part + angle.
  // Holds the SOLVED ADS pose; nothing is hidden during the test. If a
  // check fails, the ADS solve / eye relief is wrong — fix the solve,
  // never "correct" it by biasing the raycast or the decal position.
  runSelfTest() {
    const results = [];
    const sPos = this.camera.position.clone();
    const sQuat = this.camera.quaternion.clone();
    const sFov = this.camera.fov;
    // neutral camera, straight ahead (spawn at eye height)
    this.camera.position.set(0, 1.6, 0);
    this.camera.quaternion.identity();
    this.camera.up.set(0, 1, 0);
    this.vm.holdADSForTest();
    for (const fov of [75, 65, 55]) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
      this.camera.updateMatrixWorld(true);
      const ray = this._selfTestRay();
      const sight = this._selfTestSight();
      const clear = this._selfTestClearance();
      const pass = ray.pass && sight.pass && clear.pass;
      results.push({ fov, ray, sight, clear, pass });
      console.log(`[SELF-TEST] FOV ${fov}: ray ${ray.pass ? 'PASS' : 'FAIL'} ${ray.detail} | sight ${sight.pass ? 'PASS' : 'FAIL'} ${sight.detail} | clearance ${clear.pass ? 'PASS' : 'FAIL'}${clear.detail ? ' ' + clear.detail : ''} => ${pass ? 'PASS' : 'FAIL'}`);
    }
    // restore
    this.camera.fov = sFov;
    this.camera.quaternion.copy(sQuat);
    this.camera.position.copy(sPos);
    this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld(true);
    return results;
  }
  // (1) the real gun ray into the real world, hit point projected to screen
  _selfTestRay() {
    this.camera.getWorldDirection(this._fwd);
    const origin = this.camera.position.clone();
    const hit = this.raycastWithPenetration(origin, this._fwd.clone());
    if (!hit || !hit.point) return { pass: false, detail: 'no world hit on the gun ray' };
    const dist = hit.point.distanceTo(origin);
    const err = this._centerErr(hit.point.clone());
    return { pass: err <= 1.0, detail: `${err.toFixed(2)}px @ ${dist.toFixed(0)}m` };
  }
  // (2) rear + front sight anchors must project onto the frame center
  _selfTestSight() {
    const c = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const rp = this._screenPos(this.vm.rearSightAnchor.getWorldPosition(new THREE.Vector3()));
    const fp = this._screenPos(this.vm.frontSightAnchor.getWorldPosition(new THREE.Vector3()));
    const rearErr = rp.distanceTo(c);
    const frontErr = fp.distanceTo(c);
    const stack = rp.distanceTo(fp);
    const pass = rearErr <= 2 && frontErr <= 2 && stack <= 2;
    return { pass, detail: `rear ${rearErr.toFixed(2)}px front ${frontErr.toFixed(2)}px stack ${stack.toFixed(2)}px` };
  }
  // (3) nothing solid in the sight line closer than the rear sight; the
  // stock's rearmost point must be behind the camera
  _selfTestClearance() {
    const LIMIT = THREE.MathUtils.degToRad(8);
    const camQ = this.camera.quaternion.clone().invert();
    const camPos = this.camera.position;
    const rearCam = this.vm.rearSightAnchor.getWorldPosition(new THREE.Vector3())
      .sub(camPos).applyQuaternion(camQ);
    const corner = new THREE.Vector3();
    const issues = [];
    let rearmostZ = -Infinity, rearmostPart = '';
    for (const part of this.vm.sightParts) {
      if (!part.geometry.boundingBox) part.geometry.computeBoundingBox();
      const box = part.geometry.boundingBox;
      for (let i = 0; i < 8; i++) {
        corner.set(
          (i & 1) ? box.max.x : box.min.x,
          (i & 2) ? box.max.y : box.min.y,
          (i & 4) ? box.max.z : box.min.z
        );
        part.localToWorld(corner);
        const cam = corner.sub(camPos).applyQuaternion(camQ);
        if (cam.z > rearmostZ) { rearmostZ = cam.z; rearmostPart = part.name; }
        if (cam.z > rearCam.z) { // closer to the eye than the rear sight
          const ang = Math.atan2(Math.hypot(cam.x, cam.y), -cam.z);
          if (ang < LIMIT) issues.push(`${part.name} @ ${THREE.MathUtils.radToDeg(ang).toFixed(1)}°`);
        }
      }
    }
    const stockBehind = rearmostZ > 0;
    let detail = '';
    if (issues.length > 0) detail = `in sight line: ${issues.slice(0, 3).join(', ')}${issues.length > 3 ? '…' : ''}`;
    else if (!stockBehind) detail = `rearmost point (${rearmostPart}) ${rearmostZ.toFixed(3)}m — in front of the eye`;
    return { pass: issues.length === 0 && stockBehind, detail };
  }
  // screen position (px) of a world point
  _screenPos(worldPoint) {
    const v = worldPoint.project(this.camera);
    return new THREE.Vector2(
      (v.x * 0.5 + 0.5) * window.innerWidth,
      (-v.y * 0.5 + 0.5) * window.innerHeight
    );
  }
  // screen distance (px) of a world point from the exact frame center
  _centerErr(worldPoint) {
    const p = this._screenPos(worldPoint);
    return p.distanceTo(new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2));
  }
}
