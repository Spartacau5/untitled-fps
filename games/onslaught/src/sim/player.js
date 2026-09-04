import { Euler, MathUtils, Quaternion, Vector2, Vector3 } from "three";
import { damp4 } from "../core/mathx.js";

export class Player {
  constructor(t) {
    ((this.arena = t),
      (this.pos = new Vector3(0, 0.5, 4)),
      (this.vel = new Vector3()),
      (this.yaw = Math.PI),
      (this.pitch = 0),
      (this.radius = 0.4),
      (this.height = 1.8),
      (this.eyeStand = 1.64),
      (this.eyeCrouch = 1.08),
      (this.eye = 1.64),
      (this.onGround = !0),
      (this.crouch = !1),
      (this.sliding = !1),
      (this.slideT = 0),
      (this.sprinting = !1),
      (this.sprintBlock = 0),
      (this.sprintBlend = 0),
      (this.slideBlend = 0),
      (this.hp = 500),
      (this.maxHp = 500),
      (this.regenDelay = 0),
      (this.dead = !1),
      (this.bobPhase = 0),
      (this.bobAmt = 0),
      (this.stepDist = 0),
      (this.landDip = 0),
      (this.landVel = 0),
      (this.recoilP = 0),
      (this.recoilPV = 0),
      (this.recoilY = 0),
      (this.recoilYV = 0),
      (this.trauma = 0),
      (this.roll = 0),
      (this.speed = 0),
      (this.localVel = new Vector3()),
      (this.moveInput = new Vector2()),
      (this.ads = 0),
      (this.adsFov = 60),
      (this.moveMult = 1),
      (this.fov = 80),
      (this.events = []),
      (this.camPos = new Vector3()),
      (this.camQuat = new Quaternion()),
      // Pose from the previous sim tick; the renderer interpolates prev→current.
      (this.prevCamPos = new Vector3()),
      (this.prevCamQuat = new Quaternion()),
      (this.forward = new Vector3(0, 0, -1)),
      (this.right = new Vector3(1, 0, 0)),
      (this._euler = new Euler(0, 0, 0, "YXZ")),
      (this._prevEuler = new Euler(0, 0, 0, "YXZ")),
      (this._wish = new Vector3()),
      (this.hurtFlash = 0),
      (this.time = 0));
  }
  reset() {
    (this.pos.set(0, 0.5, 4),
      this.vel.set(0, 0, 0),
      (this.yaw = Math.PI),
      (this.pitch = 0),
      (this.hp = this.maxHp),
      (this.dead = !1),
      (this.regenDelay = 0),
      (this.trauma = 0),
      (this.recoilP = this.recoilY = this.recoilPV = this.recoilYV = 0),
      (this.sliding = !1),
      (this.crouch = !1),
      (this.sprinting = !1),
      (this.hurtFlash = 0));
    this._euler.set(this.pitch, this.yaw, 0, "YXZ");
    this._prevEuler.copy(this._euler);
    this.camQuat.setFromEuler(this._euler);
    this.prevCamQuat.copy(this.camQuat);
    this.camPos.set(this.pos.x, this.pos.y + this.eye, this.pos.z);
    this.prevCamPos.copy(this.camPos);
  }
  // Mouse look runs once per render frame (not per tick) so aim has no added
  // latency. The delta is applied to both the current and previous camera
  // pose so interpolation only smooths bob/recoil, never the aim itself.
  applyLook(input) {
    if (this.dead) return;
    const K = MathUtils.lerp(1, this.adsFov / 80, this.ads),
      nt = 0.0021 * input.sensitivity * K,
      dYaw = -input.dx * nt,
      pitch0 = this.pitch;
    this.yaw += dYaw;
    this.pitch = MathUtils.clamp(this.pitch - input.dy * nt, -1.5, 1.5);
    const dPitch = this.pitch - pitch0;
    ((this._euler.x += dPitch),
      (this._euler.y += dYaw),
      (this._prevEuler.x += dPitch),
      (this._prevEuler.y += dYaw),
      this.camQuat.setFromEuler(this._euler),
      this.prevCamQuat.setFromEuler(this._prevEuler),
      this.forward.set(0, 0, -1).applyQuaternion(this.camQuat),
      this.right.set(1, 0, 0).applyQuaternion(this.camQuat));
  }
  addRecoil(t, e, n) {
    ((this.pitch += t * n),
      (this.recoilPV += t * (1 - n) * 55),
      (this.recoilYV += e * 55));
  }
  addTrauma(t) {
    this.trauma = Math.min(1, this.trauma + t);
  }
  knock(t, e) {
    ((this.vel.x += t.x * e),
      (this.vel.z += t.z * e),
      (this.vel.y += e * 0.25),
      (this.onGround = !1));
  }
  damage(t, e) {
    if (this.dead) return;
    ((this.hp -= t),
      (this.regenDelay = 4.2),
      this.addTrauma(Math.min(0.7, 0.25 + t / 50)),
      (this.hurtFlash = 1));
    let n = 0;
    if (e) {
      const s = e.x - this.pos.x,
        r = e.z - this.pos.z;
      n = Math.atan2(s, -r) + this.yaw;
    }
    (this.events.push({ type: "hurt", amount: t, angle: n }),
      this.hp <= 0 &&
        ((this.hp = 0), (this.dead = !0), this.events.push({ type: "dead" })));
  }
  update(t, e, n) {
    this.time = n;
    const s = this.events;
    (this.prevCamPos.copy(this.camPos),
      this.prevCamQuat.copy(this.camQuat),
      this._prevEuler.copy(this._euler));
    // A headless/replayed input frame carries absolute look angles; the live
    // game applies look per frame via applyLook and leaves these undefined.
    typeof e.yaw === "number" && (this.yaw = e.yaw);
    typeof e.pitch === "number" && (this.pitch = e.pitch);
    this.pitch = MathUtils.clamp(this.pitch, -1.5, 1.5);
    const r = this.dead ? 0 : e.move.y,
      a = this.dead ? 0 : e.move.x;
    this.moveInput.set(a, r);
    const l = Math.sin(this.yaw),
      o = Math.cos(this.yaw),
      c = -l,
      h = -o,
      d = o,
      u = -l,
      m = this._wish.set(c * r + d * a, 0, h * r + u * a);
    (m.lengthSq() > 1 && m.normalize(),
      (this.sprintBlock = Math.max(0, this.sprintBlock - t)));
    const v =
      e.sprint &&
      r > 0.5 &&
      this.sprintBlock <= 0 &&
      this.ads < 0.2 &&
      !this.crouch &&
      !this.dead;
    this.sprinting = v && !this.sliding;
    const p = e.crouch;
    if (!this.sliding && this.sprinting && this.onGround && e.crouchPressed) {
      ((this.sliding = !0), (this.slideT = 0.95), (this.sprinting = !1));
      const K = m.lengthSq() > 0.1 ? m : new Vector3(c, 0, h),
        nt = Math.max(10.5, this.speed + 3);
      ((this.vel.x = K.x * nt),
        (this.vel.z = K.z * nt),
        s.push({ type: "slide" }));
    }
    if (this.sliding) {
      this.slideT -= t;
      const K = Math.hypot(this.vel.x, this.vel.z);
      (this.slideT <= 0 || K < 2.6) && (this.sliding = !1);
    }
    this.crouch =
      (p && !this.sliding && !this.sprinting && !this.dead) || this.sliding;
    let f = 5.3;
    if (
      (this.sprinting && (f = 7.7),
      this.crouch && !this.sliding && (f = 2.8),
      (f *= MathUtils.lerp(1, 0.62 * this.moveMult, this.ads)),
      this.onGround)
    ) {
      if (this.sliding) {
        const K = Math.exp(-2.4 * t);
        ((this.vel.x *= K),
          (this.vel.z *= K),
          (this.vel.x += m.x * 3 * t),
          (this.vel.z += m.z * 3 * t));
      } else {
        const K = m.x * f,
          nt = m.z * f,
          _t = m.lengthSq() > 0.01 ? 11 : 14;
        ((this.vel.x = damp4(this.vel.x, K, _t, t)),
          (this.vel.z = damp4(this.vel.z, nt, _t, t)));
      }
      !this.dead &&
        e.jump &&
        ((this.vel.y = 7.9),
        (this.onGround = !1),
        this.sliding &&
          ((this.sliding = !1), (this.vel.x *= 1.05), (this.vel.z *= 1.05)),
        s.push({ type: "jump" }));
    } else {
      const nt = this.vel.x * m.x + this.vel.z * m.z,
        _t = Math.max(0, Math.min(16 * t, f - nt));
      ((this.vel.x += m.x * _t), (this.vel.z += m.z * _t));
      const Lt = Math.exp(-0.25 * t);
      ((this.vel.x *= Lt), (this.vel.z *= Lt));
    }
    ((this.vel.y -= (this.vel.y < 0 ? 30 : 24) * t),
      (this.vel.y = Math.max(this.vel.y, -40)));
    const w = this.vel.y;
    ((this.pos.x += this.vel.x * t),
      (this.pos.z += this.vel.z * t),
      (this.pos.y += this.vel.y * t));
    const M = this.crouch ? 1.2 : this.height,
      [_, L] = this.arena.resolveCircle(
        this.pos.x,
        this.pos.z,
        this.radius,
        this.pos.y,
        M,
        0.35,
      );
    if (_ !== this.pos.x || L !== this.pos.z) {
      const K = _ - this.pos.x,
        nt = L - this.pos.z,
        _t = Math.hypot(K, nt);
      if (_t > 1e-6) {
        const Lt = (this.vel.x * K + this.vel.z * nt) / _t;
        Lt < 0 &&
          ((this.vel.x -= (K / _t) * Lt), (this.vel.z -= (nt / _t) * Lt));
      }
      ((this.pos.x = _), (this.pos.z = L));
    }
    const R = this.arena.floorAt(
        this.pos.x,
        this.pos.z,
        this.radius,
        this.pos.y,
      ),
      A = this.onGround;
    if (this.pos.y <= R + 0.001) {
      if (
        this.vel.y <= 0 &&
        ((this.pos.y = R), (this.vel.y = 0), (this.onGround = !0), !A)
      ) {
        const K = MathUtils.clamp(-w / 14, 0.15, 1);
        ((this.landVel -= K * 2.2), s.push({ type: "land", strength: K }));
      }
    } else this.pos.y > R + 0.02 && (this.onGround = !1);
    ((this.speed = Math.hypot(this.vel.x, this.vel.z)),
      this.localVel.set(
        this.vel.x * d + this.vel.z * u,
        this.vel.y,
        -(this.vel.x * c + this.vel.z * h),
      ),
      this.dead ||
        ((this.regenDelay -= t),
        this.regenDelay <= 0 &&
          this.hp < this.maxHp &&
          (this.hp = Math.min(this.maxHp, this.hp + 120 * t))),
      (this.hurtFlash = Math.max(0, this.hurtFlash - t * 2.5)),
      (this.eye = damp4(
        this.eye,
        this.crouch ? this.eyeCrouch : this.eyeStand,
        16,
        t,
      )));
    const C = this.onGround && this.speed > 0.6 && !this.sliding;
    if (C) {
      const K = this.sprinting ? 12.5 : 8.8;
      ((this.bobPhase += t * K * Math.min(1, this.speed / 4)),
        (this.stepDist += this.speed * t));
      const nt = this.sprinting ? 2.7 : this.crouch ? 1.6 : 2.15;
      this.stepDist > nt &&
        ((this.stepDist = 0), s.push({ type: "step", sprint: this.sprinting }));
    }
    this.bobAmt = damp4(
      this.bobAmt,
      C ? Math.min(1, this.speed / 4.5) : 0,
      10,
      t,
    );
    const S = (this.sprinting ? 1.7 : 1) * (1 - this.ads * 0.75),
      y = Math.sin(this.bobPhase) * 0.016 * this.bobAmt * S,
      P = Math.sin(this.bobPhase * 2) * 0.011 * this.bobAmt * S;
    ((this.landVel += (-this.landDip * 160 - this.landVel * 15) * t),
      (this.landDip += this.landVel * t),
      (this.landDip = MathUtils.clamp(this.landDip, -0.35, 0.2)),
      (this.recoilPV += (-this.recoilP * 110 - this.recoilPV * 17) * t),
      (this.recoilP += this.recoilPV * t),
      (this.recoilYV += (-this.recoilY * 110 - this.recoilYV * 17) * t),
      (this.recoilY += this.recoilYV * t),
      (this.trauma = Math.max(0, this.trauma - t * 1.5)));
    const z = this.trauma * this.trauma,
      U = n * 30,
      H = z * 0.045 * (Math.sin(U * 1.1) * 0.6 + Math.sin(U * 2.3 + 1) * 0.4),
      k = z * 0.045 * (Math.sin(U * 0.9 + 2) * 0.6 + Math.sin(U * 2.7) * 0.4),
      G = z * 0.03 * Math.sin(U * 1.7 + 0.5),
      q =
        -this.moveInput.x * 0.012 * (1 - this.ads * 0.6) -
        this.localVel.x * 0.0025 +
        (this.sliding ? 0.07 : 0);
    ((this.roll = damp4(this.roll, q, 9, t)),
      (this.sprintBlend = damp4(
        this.sprintBlend,
        this.sprinting ? 1 : 0,
        10,
        t,
      )),
      (this.slideBlend = damp4(this.slideBlend, this.sliding ? 1 : 0, 10, t)),
      this.camPos.set(
        this.pos.x + d * y,
        this.pos.y + this.eye + P + this.landDip * 0.5,
        this.pos.z + u * y,
      ),
      this._euler.set(
        this.pitch + this.recoilP + this.landDip * 0.9 + H,
        this.yaw + this.recoilY + k,
        this.roll + G,
        "YXZ",
      ),
      this.camQuat.setFromEuler(this._euler),
      this.forward.set(0, 0, -1).applyQuaternion(this.camQuat),
      this.right.set(1, 0, 0).applyQuaternion(this.camQuat));
    const O = 80 + this.sprintBlend * 6 + this.slideBlend * 9,
      et = MathUtils.lerp(O, this.adsFov, this.ads);
    this.fov = damp4(this.fov, et, 18, t);
  }
}
