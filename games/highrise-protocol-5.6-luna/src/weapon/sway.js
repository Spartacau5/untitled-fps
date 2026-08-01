import * as THREE from "three";
import { Spring, Vec3Spring, softClamp } from "../core/spring.js";

export const TUNING = {
  yawFrequency: 8.2, // Hz, hip look drag — lower = the rifle trails the view longer
  pitchFrequency: 9.4, // Hz, hip look drag
  rollFrequency: 7.2, // Hz, turn bank
  yawDamping: 0.68, // ratio, intentionally under-damped for a visible settle
  pitchDamping: 0.72, // ratio
  rollDamping: 0.64, // ratio
  yawImpulse: 1.85, // radians/second velocity impulse per normalized flick
  pitchImpulse: 1.25, // radians/second velocity impulse per normalized flick
  rollImpulse: 0.95, // radians/second velocity impulse per normalized flick
  yawTravel: 0.19, // meters at the sight tip
  pitchTravel: 0.125, // meters at the sight tip
  positionFrequency: 9.2, // Hz
  positionDamping: 0.7, // ratio
  maxYaw: 0.23, // radians
  maxPitch: 0.16, // radians
  maxRoll: 0.13, // radians
  adsMotionFloor: 0.26, // never lower than 26 percent
  maxInputResponse: 0.78, // normalized response to a hard flick
};

export class WeaponSway {
  constructor() {
    this.yaw = new Spring(0, TUNING.yawFrequency, TUNING.yawDamping);
    this.pitch = new Spring(0, TUNING.pitchFrequency, TUNING.pitchDamping);
    this.roll = new Spring(0, TUNING.rollFrequency, TUNING.rollDamping);
    this.position = new Vec3Spring(new THREE.Vector3(), TUNING.positionFrequency, TUNING.positionDamping);
    this.positionTarget = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.pose = { position: this.position.value, rotation: this.rotation };
    this.lastDelta = new THREE.Vector2();
    this.adsMotionScale = 1;
  }

  update(dt, mouseDelta, adsBlend) {
    this.adsMotionScale = Math.max(TUNING.adsMotionFloor, 1 - adsBlend * (1 - TUNING.adsMotionFloor));
    const adsTightness = 1 + adsBlend * 0.72;
    this.yaw.frequency = TUNING.yawFrequency * adsTightness;
    this.pitch.frequency = TUNING.pitchFrequency * adsTightness;
    this.roll.frequency = TUNING.rollFrequency * adsTightness;
    this.position.frequency = TUNING.positionFrequency * adsTightness;
    this.yaw.damping = TUNING.yawDamping + adsBlend * 0.12;
    this.pitch.damping = TUNING.pitchDamping + adsBlend * 0.1;
    this.roll.damping = TUNING.rollDamping + adsBlend * 0.12;
    this.position.damping = TUNING.positionDamping + adsBlend * 0.1;

    const dx = mouseDelta.dx || 0;
    const dy = mouseDelta.dy || 0;
    const responseX = Math.tanh(Math.abs(dx) * 0.052) * Math.sign(dx) * TUNING.maxInputResponse;
    const responseY = Math.tanh(Math.abs(dy) * 0.06) * Math.sign(dy) * TUNING.maxInputResponse;
    const scale = this.adsMotionScale;
    this.yaw.impulse(-responseX * TUNING.yawImpulse * 9.0 * scale);
    this.pitch.impulse(responseY * TUNING.pitchImpulse * 8.0 * scale);
    this.roll.impulse(-responseX * TUNING.rollImpulse * 8.0 * scale);
    this.lastDelta.set(dx, dy);

    this.yaw.target = 0;
    this.pitch.target = 0;
    this.roll.target = 0;
    this.yaw.update(dt);
    this.pitch.update(dt);
    this.roll.update(dt);
    this.yaw.value = softClamp(this.yaw.value, TUNING.maxYaw * scale, 0.8);
    this.pitch.value = softClamp(this.pitch.value, TUNING.maxPitch * scale, 0.8);
    this.roll.value = softClamp(this.roll.value, TUNING.maxRoll * scale, 0.8);

    this.positionTarget.set(
      this.yaw.value * TUNING.yawTravel,
      -this.pitch.value * TUNING.pitchTravel,
      Math.abs(this.yaw.value) * -0.035,
    );
    this.position.target.copy(this.positionTarget);
    this.position.update(dt);
    this.rotation.set(this.pitch.value, this.yaw.value, this.roll.value);
    return this;
  }

  getPose() { return this.pose; }
  getDebug() {
    return {
      yaw: this.yaw.value,
      pitch: this.pitch.value,
      roll: this.roll.value,
      lagX: this.position.value.x,
      lagY: this.position.value.y,
      floor: this.adsMotionScale,
    };
  }
}
