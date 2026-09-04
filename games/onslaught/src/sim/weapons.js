import { MathUtils, Vector3 } from "three";
import { DEG, damp, smooth01 } from "../core/mathx.js";
import { WEAPONS } from "../data/weapons.js";
import {
  EV_AMMO,
  EV_DRY_FIRE,
  EV_EJECT,
  EV_PUMP,
  EV_RELOAD_STAGE,
  EV_SHOT,
  EV_SWITCH,
} from "./events.js";

// Per-weapon gameplay state. Viewmodel animation (bolt travel, mag/hand pose,
// springs) lives in render/weapon-view.js and is derived from this each frame.
export class WeaponState {
  constructor(t) {
    ((this.def = t),
      (this.mag = t.magSize),
      (this.reserve = t.reserve),
      (this.cooldown = 0),
      (this.reload = null),
      (this.bloom = 0),
      (this.burst = 0),
      (this.lastShot = -10),
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
      (this.lastShot = -10),
      (this.pumping = !1),
      (this.boltDelayT = -1));
  }
}

export class Weapons {
  constructor(rng) {
    ((this.rng = rng),
      (this.weapons = WEAPONS.map((r) => new WeaponState(r))),
      (this.current = 0),
      (this.lastWeapon = 1),
      (this.switching = null),
      (this.ads = 0),
      (this.adsSmooth = 0),
      (this.sprintBlend = 0),
      (this.time = 0),
      (this._up = new Vector3()));
  }
  get weapon() {
    return this.weapons[this.current];
  }
  resetAll(world) {
    for (const t of this.weapons) t.reset();
    ((this.switching = null),
      (this.ads = 0),
      (this.adsSmooth = 0),
      (this.sprintBlend = 0),
      this.selectImmediate(0, world, !0));
  }
  // `quiet` marks a programmatic select (run start) vs. a player switch.
  selectImmediate(t, world, quiet = !1) {
    ((this.current = t),
      world && world.emit(EV_SWITCH, { index: t, quiet }));
  }
  _ammo(world) {
    const t = this.weapon;
    world.emit(EV_AMMO, {
      mag: t.mag,
      reserve: t.reserve,
      magSize: t.def.magSize,
    });
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
  update(t, e, n, s, world) {
    this.time = s;
    const r = this.weapon,
      a = r.def;
    ((r.cooldown -= t), (r.bloom = Math.max(0, r.bloom - a.bloomDecay * t)));
    let o = e.switchTo;
    (e.wheel !== 0 && (o = (this.current + (e.wheel > 0 ? 1 : 2)) % 3),
      e.swapLast && (o = this.lastWeapon),
      o >= 0 &&
        o !== this.current &&
        !this.switching &&
        !n.dead &&
        this.startSwitch(o, world),
      this.switching && this.updateSwitch(t, world),
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
      h = e.ads && c;
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
        e.reload &&
        !r.reloading &&
        !this.switching &&
        r.mag < a.magSize &&
        r.reserve > 0 &&
        !r.pumping &&
        this.startReload(r, world),
      r.reloading && this.updateReload(r, t, e, world),
      r.pumping &&
        ((r.pumpT += t),
        !r.pumpSounded &&
          r.pumpT > 0.1 &&
          ((r.pumpSounded = !0), world.emit(EV_PUMP, {})),
        !r.pumpShell &&
          r.pumpT > 0.2 &&
          ((r.pumpShell = !0), world.emit(EV_EJECT, { shell: a.shell })),
        r.pumpT >= a.pumpTime && (r.pumping = !1)),
      r.boltDelayT >= 0 &&
        ((r.boltDelayT -= t),
        r.boltDelayT < 0 &&
          world.emit(EV_EJECT, { shell: a.shell, bolt: !0 })));
    const d = e.fireHeld,
      u = e.fire;
    (d || u) && n.sprinting && (n.sprintBlock = a.sprintOut + 0.1);
    !r.reloading &&
      !this.switching &&
      r.cooldown <= 0 &&
      !n.sprinting &&
      this.sprintBlend < 0.45 &&
      !r.pumping &&
      !n.dead &&
      ((a.auto && d) || u) &&
      (r.mag > 0
        ? this.fire(r, n, world)
        : u &&
          (world.emit(EV_DRY_FIRE, {}),
          r.reserve > 0 && this.startReload(r, world)));
  }
  fire(t, e, world) {
    const n = t.def;
    // During sustained fire, carry the small negative remainder so the fixed
    // tick doesn't quantize the rpm (75 ms on a 16.7 ms tick would become
    // 83 ms). A remainder older than one tick means the trigger was released.
    const carry = t.cooldown < 0 && t.cooldown > -0.02 ? t.cooldown : 0;
    ((t.mag -= 1), (t.cooldown = carry + 60 / n.rpm));
    const s = this.time - t.lastShot;
    ((t.burst = s > 0.32 ? 0 : t.burst + 1), (t.lastShot = this.time));
    const r = this.adsSmooth,
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
          Math.sqrt(this.rng.float()),
        _ = this.rng.float() * Math.PI * 2,
        L = new Vector3()
          .copy(o)
          .addScaledVector(c, M * Math.cos(_))
          .addScaledVector(h, M * Math.sin(_))
          .normalize();
      world.fireRay(l, L, n, f % n.tracerEvery === 0);
    }
    const m = n.pattern
        ? n.pattern[Math.min(t.burst, n.pattern.length - 1)]
        : 0,
      g =
        n.recoilPitch *
        DEG *
        this.rng.range(0.85, 1.15) *
        (1 - r * n.adsRecoilReduce),
      v = n.recoilYaw * DEG * (m + this.rng.range(-0.6, 0.6)) * (1 - r * 0.3);
    (e.addRecoil(g, v, n.recoilPermanent), e.addTrauma(n.trauma));
    (world.emit(EV_SHOT, { def: n, index: this.current, ads: r }),
      n.key === "ar"
        ? world.emit(EV_EJECT, { shell: n.shell })
        : n.key === "shotgun"
          ? ((t.pumping = !0),
            (t.pumpT = 0),
            (t.pumpSounded = !1),
            (t.pumpShell = !1))
          : n.key === "dmr" && (t.boltDelayT = n.boltDelay),
      (e.sprintBlock = Math.max(e.sprintBlock, 0.25)),
      this._ammo(world));
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
  startSwitch(t, world) {
    const e = this.weapon;
    (e.reloading && ((e.reload = null), e.reset(), this._ammo(world)),
      (e.pumping = !1),
      (this.switching = { to: t, t: 0, phase: "down" }));
  }
  updateSwitch(t, world) {
    const e = this.switching;
    e.t += t;
    if (e.phase === "down") {
      const s = this.weapon.def.switchTime * 0.4;
      e.t >= s &&
        ((this.lastWeapon = this.current),
        this.selectImmediate(e.to, world),
        (e.phase = "up"),
        (e.t = 0));
    } else {
      const s = this.weapon.def.switchTime * 0.6;
      e.t >= s && (this.switching = null);
    }
  }
  startReload(t, world) {
    (t.def.key === "shotgun"
      ? (t.reload = {
          t: 0,
          phase: "intro",
          shellT: 0,
          cancel: !1,
          wasEmpty: t.mag === 0,
          loaded: !1,
        })
      : (t.reload = { t: 0, dur: t.def.reloadTime, s1: !1, s2: !1, s3: !1 }),
      world.emit(EV_RELOAD_STAGE, { stage: "start", key: t.def.key }));
  }
  updateReload(t, e, n, world) {
    const s = t.reload,
      r = t.def;
    if (r.key === "shotgun") {
      s.t += e;
      if (s.phase === "intro")
        s.t >= r.reloadIntro && ((s.phase = "shells"), (s.shellT = 0));
      else if (s.phase === "shells") {
        (n.fire && t.mag > 0 && (s.cancel = !0), (s.shellT += e));
        const m = s.shellT / r.reloadTime;
        (!s.loaded &&
          m >= 0.5 &&
          ((s.loaded = !0),
          t.mag++,
          t.reserve--,
          world.emit(EV_RELOAD_STAGE, { stage: "shellIn" }),
          this._ammo(world)),
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
      } else s.t >= r.reloadOutro && (t.reload = null);
      return;
    }
    s.t += e;
    const l = s.t / s.dur;
    if (
      (!s.s1 && l > 0.16 && ((s.s1 = !0), world.emit(EV_RELOAD_STAGE, { stage: "magOut" })),
      !s.s2 && l > 0.6 && ((s.s2 = !0), world.emit(EV_RELOAD_STAGE, { stage: "magIn" })),
      !s.s3 && l > 0.82 && ((s.s3 = !0), world.emit(EV_RELOAD_STAGE, { stage: "bolt" })),
      l >= 1)
    ) {
      const u = Math.min(r.magSize - t.mag, t.reserve);
      ((t.mag += u), (t.reserve -= u), (t.reload = null), this._ammo(world));
    }
  }
}
