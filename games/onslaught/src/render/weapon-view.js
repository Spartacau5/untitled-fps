import { Group, MathUtils, Vector3 } from "three";
import { damp, easeOutCubic, rand, smooth01 } from "../core/mathx.js";
import {
  VM_ADS_OFFSET,
  VM_HIP_OFFSET,
  VM_SPRINT_OFFSET,
} from "../data/weapons.js";
import { EV_EJECT, EV_JUMP, EV_LAND, EV_SHOT } from "../sim/events.js";
import { buildWeaponModel } from "./weapons/index.js";
import { MuzzleFlash, makeRedDotMaterial, updateRedDot } from "./weapons/kit.js";

// First-person viewmodel. Reads sim Weapons/Player state each frame and derives
// the pose; reacts to sim events for kicks, flash and bolt motion. Owns every
// spring and animation value — none of this feeds back into the sim.
export class WeaponView {
  constructor(cam, loadout, startIndex = 0) {
    ((this.cam = cam),
      (this.rig = new Group()),
      cam.add(this.rig),
      (this.redDotMat = makeRedDotMaterial()),
      // Models are built on first use and kept, so switching loadouts between
      // runs never rebuilds a gun the player already carried.
      (this.built = new Map()),
      (this.models = []),
      (this.shown = 0),
      (this.flash = new MuzzleFlash()),
      (this.boltT = []),
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
      (this.reloadPose = 0),
      (this._v = new Vector3()),
      (this._up = new Vector3()),
      (this.muzzleWorld = new Vector3()));
    this.setLoadout(loadout, startIndex);
  }
  // Build one gun's viewmodel and keep it. A gun is 60-90 meshes, so building
  // all eight up front put 749 meshes in the weapon scene when only 89 of them
  // are ever visible -- paid for at load, in geometry allocation and in every
  // frame's scene traversal. Models are built on first selection instead, and
  // warmed in the background once the game is running.
  _build(key) {
    if (this.built.has(key)) return this.built.get(key);
    const model = buildWeaponModel(key, this.redDotMat);
    // Opt every solid part into the weapon scene's shadow map. The lens and
    // the flash quads are transparent and would only smear.
    model.group.traverse((o) => {
      if (o.isMesh && o !== model.parts.lens)
        (o.castShadow = !0), (o.receiveShadow = !0);
    });
    (this.built.set(key, model),
      this.rig.add(model.group),
      (model.group.visible = !1));
    return model;
  }
  // Build any gun not yet made. Called from an idle callback after the first
  // frames, so switching to a gun for the first time mid-fight never hitches.
  warm() {
    for (const key of this.keys) this._build(key);
  }
  // Point the rig at a set of weapon keys, in slot order. Called once at
  // construction and again whenever the armory changes what is carried.
  setLoadout(keys, startIndex = 0) {
    const wanted = keys && keys.length ? keys : ["ar"];
    this.flash.group.parent && this.flash.group.parent.remove(this.flash.group);
    for (const m of this.models) if (m) m.group.visible = !1;
    // Slots hold null until the gun in them is first selected.
    ((this.keys = wanted.slice()),
      (this.models = wanted.map(() => null)),
      (this.shown = Math.min(Math.max(0, startIndex), wanted.length - 1)),
      (this.models[this.shown] = this._build(wanted[this.shown])));
    ((this.boltT = this.models.map(() => 0)),
      (this.model.group.visible = !0),
      this.parts.muzzle.add(this.flash.group),
      this._restParts(this.parts));
  }
  get model() {
    return this.models[this.shown];
  }
  get parts() {
    return this.model.parts;
  }
  _show(i) {
    this.models[i] || (this.models[i] = this._build(this.keys[i]));
    (this.model.parts.muzzle.remove(this.flash.group),
      (this.model.group.visible = !1),
      (this.shown = i),
      (this.model.group.visible = !0),
      this.model.parts.muzzle.add(this.flash.group),
      this._restParts(this.model.parts));
  }
  _restParts(t) {
    (t.mag &&
      (t.mag.position.copy(t.magRest),
      t.mag.rotation.set(0, 0, 0),
      (t.mag.visible = !0)),
      t.handL && t.handLRest && t.handL.position.copy(t.handLRest),
      t.pump && (t.pump.position.z = t.pumpRest));
  }
  reset() {
    for (const v of [
      this.swayPos,
      this.swayPosV,
      this.swayRot,
      this.swayRotV,
      this.kickPos,
      this.kickPosV,
      this.kickRot,
      this.kickRotV,
      this.animPos,
      this.animRot,
    ])
      v.set(0, 0, 0);
    this.boltT.fill(0);
    for (const m of this.models) if (m) this._restParts(m.parts);
  }
  // World position of the current weapon's ejection port.
  ejectWorld(out) {
    return this.parts.eject.getWorldPosition(out);
  }
  onEvent(ev, sim) {
    if (ev.type === EV_SHOT) {
      const n = ev.def,
        p = 1 - ev.ads * 0.4;
      ((this.kickPos.z += n.kickBack * p),
        (this.kickPos.y += n.kickUp * p),
        (this.kickRot.x += n.kickPitch * p * rand(0.8, 1.2)),
        (this.kickRot.y += rand(-1, 1) * n.kickYaw),
        (this.kickRot.z += rand(-1, 1) * n.kickRoll * p),
        this.flash.fire(n.flash),
        n.action === "eject" && (this.boltT[ev.index] = 1));
    } else if (ev.type === EV_EJECT) ev.bolt && (this.boltT[sim.current] = 1);
    else if (ev.type === EV_LAND)
      ((this.swayPosV.y -= ev.strength * 0.75),
        (this.swayRotV.x -= ev.strength * 3.2),
        (this.swayRotV.z += rand(-1, 1) * ev.strength * 0.8));
    else if (ev.type === EV_JUMP)
      ((this.swayPosV.y += 0.28), (this.swayRotV.x += 0.9));
  }
  sync(sim, player, input, dt, time) {
    this.shown !== sim.current && this._show(sim.current);
    for (let i = 0; i < this.boltT.length; i++)
      this.boltT[i] = Math.max(
        0,
        this.boltT[i] - dt / (sim.weapons[i].def.boltAnimTime || 0.1),
      );
    const w = sim.weapon;
    // Sprinting tucks the gun far out of frame, which used to swallow the
    // reload animation whole — players could not tell the reload had started.
    // Ease the sprint pose out for the duration of the reload so the hands
    // stay on screen; the sim already allows reloading at a full sprint.
    this.reloadPose = damp(this.reloadPose, w.reloading ? 1 : 0, 13, dt);
    (this._animSwitch(sim),
      w.reloading ? this._animReload(w, dt) : this._restParts(this.parts),
      w.reloading || sim.switching || this.animPos.set(0, 0, 0),
      w.reloading || sim.switching || this.animRot.set(0, 0, 0),
      this._pose(sim, player, input, dt, time),
      this.cam.updateMatrixWorld(!0),
      this.parts.muzzle.getWorldPosition(this.muzzleWorld),
      this.parts.lens && updateRedDot(this.redDotMat, this.parts.sight, time),
      this.flash.update(dt));
  }
  _animSwitch(sim) {
    const e = sim.switching;
    if (!e) return;
    const s = sim.weapon.def.switchTime * (e.phase === "down" ? 0.4 : 0.6),
      r =
        e.phase === "down" ? easeOutCubic(e.t / s) : 1 - easeOutCubic(e.t / s);
    (this.animPos.set(0.04 * r, -0.28 * r, 0.02 * r),
      this.animRot.set(-0.7 * r, 0.15 * r, 0.25 * r));
  }
  _animReload(t, e) {
    const s = t.reload,
      r = t.def,
      a = this.parts;
    if (r.reload === "shells") {
      let u = 1;
      if (s.phase === "intro") u = easeOutCubic(s.t / r.reloadIntro);
      else if (s.phase === "shells") {
        const m = s.shellT / r.reloadTime,
          g = Math.sin(Math.min(1, m) * Math.PI);
        a.handL.position.copy(a.handLRest).lerp(VM_ADS_OFFSET, g);
      } else
        ((u = 1 - easeOutCubic(s.t / r.reloadOutro)),
          a.handL.position.copy(a.handLRest));
      (this.animPos.set(0.03 * u, -0.03 * u, 0.01 * u),
        this.animRot.set(0.12 * u, -0.2 * u, 0.55 * u));
      return;
    }
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
    l > 0.8 && l < 0.9 && (this.boltT[this.shown] = 1);
  }
  _pose(sim, n, e, t, s) {
    const r = sim.weapon,
      a = r.def,
      l = this.parts,
      o = sim.adsSmooth,
      c = smooth01(sim.sprintBlend) * (1 - this.reloadPose),
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
      y = a.adsFov <= 45 ? 0.0012 : 4e-4,
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
      // Slide travel. A gun with `slideLock` holds it fully rearward while the
      // magazine is empty, the way a pistol locks open on the last round --
      // and because the sim only refills the magazine at the very end of a
      // reload, the slide stays back through the whole reload and snaps
      // forward as the fresh mag seats, which is exactly right.
      l.bolt &&
        (l.bolt.position.z =
          l.boltRest +
          Math.max(
            this.boltT[this.shown],
            l.slideLock && r.mag === 0 ? 1 : 0,
          ) *
            l.boltTravel),
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
