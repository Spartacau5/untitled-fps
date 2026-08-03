// ---------------------------------------------------------------------------
// player/camera.js — look, FOV, shake, lean, landing dip.
// The camera LEADS; the weapon follows (see weapon/sway.js).
// Interpolated: prev/current captured per fixed step, slerped at render.
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Spring, clamp } from '../core/spring.js';

export const TUNING = {
  SENS: 0.0021,          // rad/px base
  PITCH_MAX: 1.45,       // rad
  FOV_HIP: 75,
  FOV_ADS: 55,
  FOV_K: 90, FOV_D: 17,  // FOV spring: smooth zoom, kicks settle
  LEAN_K: 160, LEAN_D: 22,
  LEAN_ANGLE: 0.07,      // rad
  LEAN_OFFSET: 0.24,     // m lateral
  LAND_DIP_K: 180, LAND_DIP_D: 14, LAND_DIP_GAIN: 0.006, // rad per m/s fall
  SHAKE_POS: 0.05,       // m * trauma^2
  SHAKE_ROT: 0.035,      // rad * trauma^2
};

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.yaw = 0;         // face the arena (-z)
    this.pitch = -0.03;
    this.fovSpring = new Spring(TUNING.FOV_K, TUNING.FOV_D, TUNING.FOV_HIP);
    this.fovKick = new Spring(220, 24, 0);
    this.lean = new Spring(TUNING.LEAN_K, TUNING.LEAN_D, 0);
    this.landDip = new Spring(TUNING.LAND_DIP_K, TUNING.LAND_DIP_D, 0);
    this.dmgPitch = new Spring(140, 18, 0);
    this._pos = new THREE.Vector3();
    this._prevPos = new THREE.Vector3();
    this._quat = new THREE.Quaternion();
    this._prevQuat = new THREE.Quaternion();
    this._euler = new THREE.Euler(0, 0, 0, 'YXZ');
    this._fwd = new THREE.Vector3();
    this.eye = 1.62;
  }

  land(fallSpeed) {
    this.landDip.impulse(Math.min(fallSpeed, 16) * TUNING.LAND_DIP_GAIN * 60);
  }

  damageKick(dir /* world dir of incoming damage */, yaw) {
    // directional pitch/roll nudge
    const fromSide = Math.sin(yaw) * dir.x + Math.cos(yaw) * dir.z;
    this.dmgPitch.impulse(-1.4);
    this.lean.impulse(fromSide * 2.0);
  }

  update(dt, input, ctx) {
    const T = TUNING;
    // --- look -----------------------------------------------------------------
    if (input.locked && !input.dead) {
      const m = input.mousePerStep();
      const sens = T.SENS * ctx.ads.sensScale();
      this.yaw -= m.dx * sens;
      this.pitch = clamp(this.pitch - m.dy * sens, -T.PITCH_MAX, T.PITCH_MAX);
    }
    // --- lean -------------------------------------------------------------------
    let leanTarget = 0;
    if (input.locked && !input.dead) {
      if (input.down('KeyQ')) leanTarget += 1;
      if (input.down('KeyE')) leanTarget -= 1;
    }
    this.lean.target = leanTarget; this.lean.update(dt);
    // --- FOV ----------------------------------------------------------------------
    const ctrl = ctx.controller;
    const fovBase = T.FOV_HIP + (T.FOV_ADS - T.FOV_HIP) * ctx.ads.fovAmt();
    const sprintFov = 5.2 * ctrl.sprintAmt.value + 2.5 * (ctrl.sliding ? 1 : 0);
    this.fovSpring.target = fovBase + sprintFov;
    this.fovSpring.update(dt);
    this.fovKick.update(dt);
    this.dmgPitch.update(dt);
    this.landDip.update(dt);
    // --- shake (layered noise from fx/shake.js, F7) ---------------------------------
    const sh = ctx.shake.sample();
    // --- capture state ------------------------------------------------------------
    this._prevPos.copy(this._pos);
    this._prevQuat.copy(this._quat);

    this.eye = ctrl.eye;
    // lateral lean offset applied in camera-local right direction
    const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
    this._pos.set(
      ctrl.pos.x + rx * this.lean.value * T.LEAN_OFFSET + sh.x,
      ctrl.pos.y + this.eye + sh.y + this.landDip.value * 0.35,
      ctrl.pos.z + rz * this.lean.value * T.LEAN_OFFSET + sh.z
    );

    const recoil = ctx.recoil.viewKick();
    this._euler.set(
      this.pitch + recoil.pitch + this.landDip.value + this.dmgPitch.value + sh.rx,
      this.yaw + recoil.yaw + sh.ry,
      recoil.roll + this.lean.value * -T.LEAN_ANGLE + ctx.reload.cameraRoll() + sh.rz
    );
    this._quat.setFromEuler(this._euler);

    const fov = this.fovSpring.value + this.fovKick.value;
    if (Math.abs(this.camera.fov - fov) > 0.001) {
      this.camera.fov = clamp(fov, 30, 100);
      this.camera.updateProjectionMatrix();
    }
  }

  // Interpolated apply at render.
  apply(alpha) {
    this.camera.position.lerpVectors(this._prevPos, this._pos, alpha);
    this.camera.quaternion.slerpQuaternions(this._prevQuat, this._quat, alpha);
  }

  forward(out) { return out.set(0, 0, -1).applyQuaternion(this.camera.quaternion); }
  worldPos(out) { return out.copy(this.camera.position); }
}
