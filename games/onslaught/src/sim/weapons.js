import { Group, MathUtils, Vector3 } from "three";
import { DEG, damp, easeOutCubic, rand, smooth01 } from "../core/mathx.js";
import {
  VM_ADS_OFFSET,
  VM_HIP_OFFSET,
  VM_SPRINT_OFFSET,
  WEAPONS,
} from "../data/weapons.js";
import {
  MuzzleFlash,
  buildDmrModel,
  buildRifleModel,
  buildShotgunModel,
  makeRedDotMaterial,
  updateRedDot,
} from "../render/weapon-view.js";

export class WeaponState {
  constructor(t, e) {
    ((this.def = t),
      (this.model = e),
      (this.mag = t.magSize),
      (this.reserve = t.reserve),
      (this.cooldown = 0),
      (this.reload = null),
      (this.bloom = 0),
      (this.burst = 0),
      (this.lastShot = -10),
      (this.boltT = 0),
      (this.pumpT = 0),
      (this.pumping = !1),
      (this.pumpSounded = !1),
      (this.pumpShell = !1),
      (this.boltDelayT = -1));
  }
  get reloading() {
    return this.reload !== null;
  }
  reset() {
    ((this.mag = this.def.magSize),
      (this.reserve = this.def.reserve),
      (this.cooldown = 0),
      (this.reload = null),
      (this.bloom = 0),
      (this.burst = 0),
      (this.boltT = 0),
      (this.pumping = !1),
      (this.boltDelayT = -1));
    const t = this.model.parts;
    (t.mag &&
      (t.mag.position.copy(t.magRest),
      t.mag.rotation.set(0, 0, 0),
      (t.mag.visible = !0)),
      t.handL && t.handLRest && t.handL.position.copy(t.handLRest),
      t.pump && (t.pump.position.z = t.pumpRest));
  }
}
export class Weapons {
  constructor(t, e, n) {
    ((this.audio = e),
      (this.cb = n),
      (this.cam = t),
      (this.rig = new Group()),
      t.add(this.rig),
      (this.redDotMat = makeRedDotMaterial()));
    const s = [
      buildRifleModel(this.redDotMat),
      buildShotgunModel(),
      buildDmrModel(),
    ];
    this.weapons = WEAPONS.map((r, a) => new WeaponState(r, s[a]));
    for (const r of this.weapons)
      (this.rig.add(r.model.group), (r.model.group.visible = !1));
    ((this.current = 0),
      (this.lastWeapon = 1),
      (this.weapons[0].model.group.visible = !0),
      (this.flash = new MuzzleFlash()),
      this.weapons[0].model.parts.muzzle.add(this.flash.group),
      (this.switching = null),
      (this.ads = 0),
      (this.adsSmooth = 0),
      (this.sprintBlend = 0),
      (this.swayPos = new Vector3()),
      (this.swayPosV = new Vector3()),
      (this.swayRot = new Vector3()),
      (this.swayRotV = new Vector3()),
      (this.kickPos = new Vector3()),
      (this.kickPosV = new Vector3()),
      (this.kickRot = new Vector3()),
      (this.kickRotV = new Vector3()),
      (this.moveOff = new Vector3()),
      (this.moveRot = new Vector3()),
      (this.animPos = new Vector3()),
      (this.animRot = new Vector3()),
      (this._v = new Vector3()),
      (this._v2 = new Vector3()),
      (this._v3 = new Vector3()),
      (this._up = new Vector3()),
      (this.time = 0),
      (this.player = null),
      (this.muzzleWorld = new Vector3()));
  }
  get weapon() {
    return this.weapons[this.current];
  }
  resetAll() {
    for (const t of this.weapons) t.reset();
    ((this.switching = null),
      (this.ads = 0),
      (this.adsSmooth = 0),
      this.swayPos.set(0, 0, 0),
      this.swayPosV.set(0, 0, 0),
      this.swayRot.set(0, 0, 0),
      this.swayRotV.set(0, 0, 0),
      this.kickPos.set(0, 0, 0),
      this.kickPosV.set(0, 0, 0),
      this.kickRot.set(0, 0, 0),
      this.kickRotV.set(0, 0, 0),
      this.animPos.set(0, 0, 0),
      this.animRot.set(0, 0, 0),
      this.selectImmediate(0));
  }
  selectImmediate(t) {
    ((this.weapon.model.group.visible = !1),
      this.weapon.model.parts.muzzle.remove(this.flash.group),
      (this.current = t),
      (this.weapon.model.group.visible = !0),
      this.weapon.model.parts.muzzle.add(this.flash.group),
      this.cb.onWeaponChange && this.cb.onWeaponChange());
  }
  onLand(t) {
    ((this.swayPosV.y -= t * 0.75),
      (this.swayRotV.x -= t * 3.2),
      (this.swayRotV.z += rand(-1, 1) * t * 0.8));
  }
  onJump() {
    ((this.swayPosV.y += 0.28), (this.swayRotV.x += 0.9));
  }
  getSpread(t) {
    const e = this.weapon,
      n = e.def,
      s = this.adsSmooth,
      r =
        Math.min(t.speed / 7, 1.2) * n.spreadMove * (1 - s * 0.7) +
        (t.onGround ? 0 : 0.02 * (1 - s * 0.5));
    let a =
      MathUtils.lerp(n.spreadHip, n.spreadAds, s) + e.bloom * (1 - s * 0.5) + r;
    return (
      n.pellets > 1 &&
        (a += MathUtils.lerp(n.pelletSpread, n.pelletSpreadAds, s) * 0.6),
      a
    );
  }
  update(t, e, n, s) {
    ((this.time = s), (this.player = n));
    const r = this.weapon,
      a = r.def,
      l = r.model.parts;
    ((r.cooldown -= t), (r.bloom = Math.max(0, r.bloom - a.bloomDecay * t)));
    for (const g of this.weapons)
      g.boltT = Math.max(0, g.boltT - t / (g.def.boltAnimTime || 0.1));
    let o = -1;
    (e.justPressed("Digit1") && (o = 0),
      e.justPressed("Digit2") && (o = 1),
      e.justPressed("Digit3") && (o = 2),
      e.wheel !== 0 && (o = (this.current + (e.wheel > 0 ? 1 : 2)) % 3),
      e.justPressed("KeyQ") && (o = this.lastWeapon),
      o >= 0 &&
        o !== this.current &&
        !this.switching &&
        !n.dead &&
        this.startSwitch(o),
      this.switching && this.updateSwitch(t),
      (this.sprintBlend = damp(
        this.sprintBlend,
        n.sprinting ? 1 : 0,
        n.sprinting ? 9 : 13,
        t,
      )));
    const c =
        !n.sprinting &&
        !r.reloading &&
        !this.switching &&
        !n.dead &&
        !n.sliding,
      h = e.mouseDown[2] && c;
    ((this.ads = MathUtils.clamp(
      this.ads + ((h ? 1 : -1) * t) / a.adsTime,
      0,
      1,
    )),
      (this.adsSmooth = smooth01(this.ads)),
      (n.ads = this.adsSmooth),
      (n.adsFov = a.adsFov),
      (n.moveMult = a.moveMult),
      !n.dead &&
        e.justPressed("KeyR") &&
        !r.reloading &&
        !this.switching &&
        r.mag < a.magSize &&
        r.reserve > 0 &&
        !r.pumping &&
        this.startReload(r),
      r.reloading && this.updateReload(r, t, e),
      r.pumping &&
        ((r.pumpT += t),
        !r.pumpSounded &&
          r.pumpT > 0.1 &&
          ((r.pumpSounded = !0), this.audio.pump()),
        !r.pumpShell &&
          r.pumpT > 0.2 &&
          ((r.pumpShell = !0), this.ejectShell(r)),
        r.pumpT >= a.pumpTime && (r.pumping = !1)),
      r.boltDelayT >= 0 &&
        ((r.boltDelayT -= t),
        r.boltDelayT < 0 && (this.ejectShell(r), (r.boltT = 1))));
    const d = e.mouseDown[0],
      u = e.mousePressed[0];
    ((d || u) && n.sprinting && (n.sprintBlock = a.sprintOut + 0.1),
      !r.reloading &&
        !this.switching &&
        r.cooldown <= 0 &&
        !n.sprinting &&
        this.sprintBlend < 0.45 &&
        !r.pumping &&
        !n.dead &&
        ((a.auto && d) || u) &&
        (r.mag > 0
          ? this.fire(r, n)
          : u && (this.audio.dryFire(), r.reserve > 0 && this.startReload(r))),
      this.updatePose(t, e, n, s),
      this.cam.updateMatrixWorld(!0),
      l.muzzle.getWorldPosition(this.muzzleWorld),
      l.lens && updateRedDot(this.redDotMat, l.sight, s),
      this.flash.update(t));
  }
  fire(t, e) {
    const n = t.def;
    (t.model.parts, t.mag--, (t.cooldown = 60 / n.rpm));
    const s = this.time - t.lastShot;
    ((t.burst = s > 0.32 ? 0 : t.burst + 1), (t.lastShot = this.time));
    const r = this.adsSmooth,
      a = this.muzzleWorld.clone(),
      l = e.camPos.clone(),
      o = e.forward,
      c = e.right,
      h = this._up.copy(c).cross(o),
      d = this.getSpreadForShot(e);
    t.bloom = Math.min(n.bloomMax, t.bloom + n.bloomPerShot);
    const u = n.pellets;
    for (let f = 0; f < u; f++) {
      const M =
          (u > 1 ? MathUtils.lerp(n.pelletSpread, n.pelletSpreadAds, r) : d) *
          Math.sqrt(Math.random()),
        _ = Math.random() * Math.PI * 2,
        L = new Vector3()
          .copy(o)
          .addScaledVector(c, M * Math.cos(_))
          .addScaledVector(h, M * Math.sin(_))
          .normalize();
      this.cb.fireRay(l, L, n, a, f % n.tracerEvery === 0);
    }
    const m = n.pattern
        ? n.pattern[Math.min(t.burst, n.pattern.length - 1)]
        : 0,
      g = n.recoilPitch * DEG * rand(0.85, 1.15) * (1 - r * n.adsRecoilReduce),
      v = n.recoilYaw * DEG * (m + rand(-0.6, 0.6)) * (1 - r * 0.3);
    (e.addRecoil(g, v, n.recoilPermanent), e.addTrauma(n.trauma));
    const p = 1 - r * 0.4;
    ((this.kickPos.z += n.kickBack * p),
      (this.kickPos.y += n.kickUp * p),
      (this.kickRot.x += n.kickPitch * p * rand(0.8, 1.2)),
      (this.kickRot.y += rand(-1, 1) * n.kickYaw),
      (this.kickRot.z += rand(-1, 1) * n.kickRoll * p),
      this.flash.fire(n.flash),
      this.cb.muzzleSmoke(a, o, n.smoke),
      this.audio.gunshot(n.sound),
      n.key === "ar"
        ? ((t.boltT = 1), this.ejectShell(t))
        : n.key === "shotgun"
          ? ((t.pumping = !0),
            (t.pumpT = 0),
            (t.pumpSounded = !1),
            (t.pumpShell = !1))
          : n.key === "dmr" && (t.boltDelayT = n.boltDelay),
      (e.sprintBlock = Math.max(e.sprintBlock, 0.25)),
      this.cb.onAmmoChange());
  }
  getSpreadForShot(t) {
    const e = this.weapon,
      n = e.def,
      s = this.adsSmooth,
      r =
        Math.min(t.speed / 7, 1.2) * n.spreadMove * (1 - s * 0.7) +
        (t.onGround ? 0 : 0.02 * (1 - s * 0.5));
    return (
      MathUtils.lerp(n.spreadHip, n.spreadAds, s) + e.bloom * (1 - s * 0.5) + r
    );
  }
  ejectShell(t) {
    const e = t.model.parts,
      n = this.player;
    if (!n) return;
    e.eject.getWorldPosition(this._v);
    const s = this._up.copy(n.right).cross(n.forward),
      r = this._v2
        .copy(n.right)
        .multiplyScalar(rand(1.6, 2.6))
        .addScaledVector(s, rand(1.3, 2.2))
        .addScaledVector(n.forward, rand(-0.4, 0.2))
        .add(n.vel);
    this.cb.ejectShell(this._v, r, t.def.shell);
  }
  startSwitch(t) {
    const e = this.weapon;
    (e.reloading && ((e.reload = null), e.reset(), this.cb.onAmmoChange()),
      (e.pumping = !1),
      (this.switching = { to: t, t: 0, phase: "down" }));
  }
  updateSwitch(t) {
    const e = this.switching;
    e.t += t;
    const n = this.weapon;
    if (e.phase === "down") {
      const s = n.def.switchTime * 0.4,
        r = easeOutCubic(e.t / s);
      (this.animPos.set(0.04 * r, -0.28 * r, 0.02 * r),
        this.animRot.set(-0.7 * r, 0.15 * r, 0.25 * r),
        e.t >= s &&
          ((this.lastWeapon = this.current),
          this.selectImmediate(e.to),
          this.audio.weaponSwitch(),
          (e.phase = "up"),
          (e.t = 0)));
    } else {
      const s = this.weapon.def.switchTime * 0.6,
        r = 1 - easeOutCubic(e.t / s);
      (this.animPos.set(0.04 * r, -0.28 * r, 0.02 * r),
        this.animRot.set(-0.7 * r, 0.15 * r, 0.25 * r),
        e.t >= s &&
          ((this.switching = null),
          this.animPos.set(0, 0, 0),
          this.animRot.set(0, 0, 0)));
    }
  }
  startReload(t) {
    t.def.key === "shotgun"
      ? ((t.reload = {
          t: 0,
          phase: "intro",
          shellT: 0,
          cancel: !1,
          wasEmpty: t.mag === 0,
          loaded: !1,
        }),
        this.audio.click(0.5, 1200))
      : ((t.reload = { t: 0, dur: t.def.reloadTime, s1: !1, s2: !1, s3: !1 }),
        this.audio.click(0.6, 1500));
  }
  updateReload(t, e, n) {
    const s = t.reload,
      r = t.def,
      a = t.model.parts;
    if (r.key === "shotgun") {
      s.t += e;
      let u = 1;
      if (s.phase === "intro")
        ((u = easeOutCubic(s.t / r.reloadIntro)),
          s.t >= r.reloadIntro && ((s.phase = "shells"), (s.shellT = 0)));
      else if (s.phase === "shells") {
        (n.mousePressed[0] && t.mag > 0 && (s.cancel = !0), (s.shellT += e));
        const m = s.shellT / r.reloadTime,
          g = Math.sin(Math.min(1, m) * Math.PI);
        (a.handL.position.copy(a.handLRest).lerp(VM_ADS_OFFSET, g),
          !s.loaded &&
            m >= 0.5 &&
            ((s.loaded = !0),
            t.mag++,
            t.reserve--,
            this.audio.shellIn(),
            this.cb.onAmmoChange()),
          m >= 1 &&
            ((s.shellT = 0),
            (s.loaded = !1),
            (t.mag >= r.magSize || t.reserve <= 0 || s.cancel) &&
              ((s.phase = "outro"),
              (s.t = 0),
              s.wasEmpty &&
                ((t.pumping = !0),
                (t.pumpT = 0),
                (t.pumpSounded = !1),
                (t.pumpShell = !0)))));
      } else if (
        ((u = 1 - easeOutCubic(s.t / r.reloadOutro)),
        a.handL.position.copy(a.handLRest),
        s.t >= r.reloadOutro)
      ) {
        ((t.reload = null),
          this.animPos.set(0, 0, 0),
          this.animRot.set(0, 0, 0));
        return;
      }
      (this.animPos.set(0.03 * u, -0.03 * u, 0.01 * u),
        this.animRot.set(0.12 * u, -0.2 * u, 0.55 * u));
      return;
    }
    s.t += e;
    const l = s.t / s.dur,
      o = Math.sin(Math.min(1, l) * Math.PI);
    (this.animPos.set(-0.015 * o, -0.05 * o, 0.015 * o),
      this.animRot.set(-0.28 * o, 0.2 * o, -0.5 * o));
    let c = 0,
      h = !0,
      d = 0;
    if (l >= 0.15 && l < 0.42) {
      const u = easeOutCubic((l - 0.15) / 0.27);
      ((c = -0.3 * u), (d = -0.5 * u));
    } else if (l >= 0.42 && l < 0.5) ((h = !1), (c = -0.3));
    else if (l >= 0.5 && l < 0.76) {
      const u = 1 - easeOutCubic((l - 0.5) / 0.26);
      ((c = -0.3 * u), (d = -0.25 * u));
    }
    if (
      (a.mag.position.set(a.magRest.x, a.magRest.y + c, a.magRest.z + c * 0.35),
      (a.mag.rotation.x = d),
      (a.mag.visible = h),
      a.handL && a.handLRest)
    ) {
      const u = l > 0.08 && l < 0.82,
        m = u ? a.mag.position.x - 0.01 : a.handLRest.x,
        g = u ? a.mag.position.y - 0.09 : a.handLRest.y,
        v = u ? a.mag.position.z + 0.03 : a.handLRest.z,
        p = 1 - Math.exp(-22 * e);
      ((a.handL.position.x += (m - a.handL.position.x) * p),
        (a.handL.position.y += (g - a.handL.position.y) * p),
        (a.handL.position.z += (v - a.handL.position.z) * p));
    }
    if (
      (l > 0.8 && l < 0.9 && (t.boltT = 1),
      !s.s1 && l > 0.16 && ((s.s1 = !0), this.audio.magOut()),
      !s.s2 && l > 0.6 && ((s.s2 = !0), this.audio.magIn()),
      !s.s3 && l > 0.82 && ((s.s3 = !0), this.audio.bolt()),
      l >= 1)
    ) {
      const u = Math.min(r.magSize - t.mag, t.reserve);
      ((t.mag += u),
        (t.reserve -= u),
        (t.reload = null),
        this.animPos.set(0, 0, 0),
        this.animRot.set(0, 0, 0),
        a.mag.position.copy(a.magRest),
        a.mag.rotation.set(0, 0, 0),
        (a.mag.visible = !0),
        this.cb.onAmmoChange());
    }
  }
  updatePose(t, e, n, s) {
    const r = this.weapon,
      a = r.def,
      l = r.model.parts,
      o = this.adsSmooth,
      c = smooth01(this.sprintBlend),
      h = a.weight,
      d = 1 - o * 0.88,
      u = MathUtils.lerp(0.012, 0.022, h) * d,
      m = MathUtils.lerp(0.0028, 0.0055, h) * d;
    ((this.swayRotV.y += -e.dx * u),
      (this.swayRotV.x += -e.dy * u),
      (this.swayRotV.z += e.dx * u * 0.35),
      (this.swayPosV.x += -e.dx * m),
      (this.swayPosV.y += e.dy * m * 0.6));
    const g = MathUtils.lerp(180, 90, h),
      v = 2 * Math.sqrt(g) * MathUtils.lerp(0.8, 0.55, h),
      p = MathUtils.lerp(230, 120, h),
      f = 2 * Math.sqrt(p) * 0.7;
    (this._spring(this.swayRot, this.swayRotV, g, v, t, 0.16),
      this._spring(this.swayPos, this.swayPosV, p, f, t, 0.07),
      this._spring(
        this.kickRot,
        this.kickRotV,
        330,
        2 * Math.sqrt(330) * 0.55,
        t,
        0.5,
      ),
      this._spring(
        this.kickPos,
        this.kickPosV,
        330,
        2 * Math.sqrt(330) * 0.6,
        t,
        0.25,
      ));
    const w = n.localVel,
      M = 1 - o * 0.8;
    ((this.moveOff.x = damp(this.moveOff.x, -w.x * 0.0055 * M, 7, t)),
      (this.moveOff.y = damp(
        this.moveOff.y,
        MathUtils.clamp(-w.y * 0.004, -0.03, 0.03) * M,
        7,
        t,
      )),
      (this.moveOff.z = damp(this.moveOff.z, w.z * 0.004 * M, 7, t)),
      (this.moveRot.z = damp(this.moveRot.z, -w.x * 0.012 * M, 7, t)),
      (this.moveRot.x = damp(
        this.moveRot.x,
        MathUtils.clamp(w.y * 0.012, -0.08, 0.08) * M,
        7,
        t,
      )),
      (this.moveRot.y = damp(this.moveRot.y, -w.x * 0.006 * M, 7, t)));
    const _ = n.bobPhase,
      L = n.bobAmt * (n.sprinting ? 2.4 : 1) * (1 - o * 0.9),
      R = Math.sin(_) * 0.011 * L,
      A = Math.sin(_ * 2) * 0.007 * L - 0.002 * L,
      C = Math.sin(_) * 0.02 * L,
      S = Math.cos(_ * 2) * 0.008 * L,
      y = a.key === "dmr" ? 0.0012 : 4e-4,
      P =
        Math.sin(s * 0.9) * 0.0012 * (1 - o * 0.6) + o * Math.sin(s * 1.3) * y,
      z = Math.sin(s * 1.5) * 9e-4 * (1 - o * 0.6) + o * Math.cos(s * 0.9) * y,
      U = this._v.copy(l.hipOffset).lerp(l.adsOffset, o),
      H = l.hipRot,
      k =
        U.x +
        VM_HIP_OFFSET.x * c +
        this.swayPos.x +
        this.moveOff.x +
        R +
        P +
        this.kickPos.x +
        this.animPos.x,
      G =
        U.y +
        VM_HIP_OFFSET.y * c +
        this.swayPos.y +
        this.moveOff.y +
        A +
        z +
        this.kickPos.y +
        this.animPos.y,
      q =
        U.z +
        VM_HIP_OFFSET.z * c +
        this.swayPos.z +
        this.moveOff.z +
        this.kickPos.z +
        this.animPos.z,
      O =
        H.x * (1 - o) +
        VM_SPRINT_OFFSET.x * c +
        this.swayRot.x +
        this.moveRot.x +
        S +
        this.kickRot.x +
        this.animRot.x,
      et =
        H.y * (1 - o) +
        VM_SPRINT_OFFSET.y * c +
        this.swayRot.y +
        this.moveRot.y +
        this.kickRot.y +
        this.animRot.y,
      K =
        H.z * (1 - o) +
        VM_SPRINT_OFFSET.z * c +
        this.swayRot.z +
        this.moveRot.z +
        C +
        this.kickRot.z +
        this.animRot.z;
    if (
      (this.rig.position.set(k, G, q),
      this.rig.rotation.set(O, et, K),
      l.bolt && (l.bolt.position.z = l.boltRest + r.boltT * l.boltTravel),
      l.pump)
    )
      if (r.pumping) {
        const nt = Math.min(1, r.pumpT / a.pumpTime);
        l.pump.position.z = l.pumpRest + Math.sin(nt * Math.PI) * l.pumpTravel;
      } else l.pump.position.z = l.pumpRest;
    l.lens && (this.redDotMat.uniforms.uBright.value = 0.7 + o * 0.5);
  }
  _spring(t, e, n, s, r, a) {
    ((e.x += (-n * t.x - s * e.x) * r),
      (e.y += (-n * t.y - s * e.y) * r),
      (e.z += (-n * t.z - s * e.z) * r),
      (t.x = MathUtils.clamp(t.x + e.x * r, -a, a)),
      (t.y = MathUtils.clamp(t.y + e.y * r, -a, a)),
      (t.z = MathUtils.clamp(t.z + e.z * r, -a, a)));
  }
}
