import * as THREE from "three";
import { Spring } from "../core/spring.js";

export const TUNING = {
  pitchFrequency: 6.2, // Hz, 40-60 ms kick with a long residual tail
  pitchDamping: 0.34, // ratio, under-damped for a readable sight kick
  yawFrequency: 6.4, // Hz
  yawDamping: 0.38, // ratio
  rollFrequency: 7.4, // Hz, sharp torque with a visible settle
  rollDamping: 0.34, // ratio
  punchFrequency: 6.8, // Hz
  punchDamping: 0.38, // ratio
  pitchImpulse: 5.8, // radians/second velocity impulse per round
  yawImpulse: 2.2, // radians/second velocity impulse per round
  rollImpulse: 1.8, // radians/second velocity impulse per round
  punchImpulse: -6.2, // meters/second velocity impulse per round
  cameraPitch: 0.0072, // radians, fast camera climb injected per hip-fire round
  cameraYaw: 0.0026, // radians, deterministic horizontal camera wander
  adsScale: 0.61, // 39 percent reduction; never zero
  crouchScale: 0.9, // crouch remains physical
};

export class WeaponRecoil {
  constructor(rng) {
    this.rng = rng;
    this.pitch = new Spring(0, TUNING.pitchFrequency, TUNING.pitchDamping);
    this.yaw = new Spring(0, TUNING.yawFrequency, TUNING.yawDamping);
    this.roll = new Spring(0, TUNING.rollFrequency, TUNING.rollDamping);
    this.punch = new Spring(0, TUNING.punchFrequency, TUNING.punchDamping);
    this.rotation = new THREE.Vector3();
    this.position = new THREE.Vector3();
    this.pose = { position: this.position, rotation: this.rotation };
    this.cameraKick = { pitch: 0, yaw: 0 };
    this.shots = 0;
  }

  fire(adsBlend = 0, crouchBlend = 0) {
    const stanceScale = (1 - adsBlend) + adsBlend * TUNING.adsScale;
    const scale = stanceScale * (1 - crouchBlend * (1 - TUNING.crouchScale));
    const patternRise = Math.min(1.35, 1 + this.shots * 0.012);
    const seededDrift = this.rng.signed() * 0.75 + Math.sin(this.shots * 0.73) * 0.25;
    // A fresh position impulse makes the sight leave target on the exact
    // fixed step of the shot; the velocity impulse below supplies the loose
    // spring recovery and the residual burst climb.
    this.pitch.value = Math.min(0.34, this.pitch.value + 0.034 * scale * patternRise);
    this.yaw.value = Math.max(-0.2, Math.min(0.2, this.yaw.value + 0.012 * scale * seededDrift));
    this.roll.value = Math.max(-0.16, Math.min(0.16, this.roll.value - 0.011 * scale * seededDrift));
    this.punch.value = Math.max(-0.22, Math.min(0.08, this.punch.value - 0.028 * scale));
    this.pitch.impulse(TUNING.pitchImpulse * scale * patternRise);
    this.yaw.impulse(TUNING.yawImpulse * scale * seededDrift);
    this.roll.impulse(-TUNING.rollImpulse * scale * seededDrift);
    this.punch.impulse(TUNING.punchImpulse * scale);
    this.cameraKick.pitch = TUNING.cameraPitch * scale * patternRise;
    this.cameraKick.yaw = TUNING.cameraYaw * scale * seededDrift;
    this.shots += 1;
    return this.cameraKick;
  }

  update(dt) {
    this.pitch.target = 0;
    this.yaw.target = 0;
    this.roll.target = 0;
    this.punch.target = 0;
    this.pitch.update(dt);
    this.yaw.update(dt);
    this.roll.update(dt);
    this.punch.update(dt);
    this.rotation.set(this.pitch.value, this.yaw.value, this.roll.value);
    this.position.set(0, 0, this.punch.value);
    return this;
  }

  resetBurst() { this.shots = 0; }
  reset() {
    this.pitch.set(0);
    this.yaw.set(0);
    this.roll.set(0);
    this.punch.set(0);
    this.shots = 0;
  }
  getPose() { return this.pose; }
  getDebug() { return { pitch: this.pitch.value, yaw: this.yaw.value, roll: this.roll.value, punch: this.punch.value, pitchVelocity: this.pitch.velocity, punchVelocity: this.punch.velocity, shots: this.shots }; }
}
