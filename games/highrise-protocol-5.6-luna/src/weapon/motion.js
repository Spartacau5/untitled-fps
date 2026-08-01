import * as THREE from "three";
import { Spring, Vec3Spring, damp, softClamp } from "../core/spring.js";

export const TUNING = {
  bobSpeed: 1.82, // phase cycles per second at walking pace
  bobAmplitude: 0.036, // meters
  bobSideAmplitude: 0.025, // meters
  bobRoll: 0.062, // radians
  strafeSwing: 0.052, // meters
  strafeRoll: 0.085, // radians
  breathFrequency: 0.19, // cycles per second
  breathAmplitude: 0.0095, // meters
  sprintDrop: 0.17, // meters
  sprintCant: -0.32, // radians
  sprintPump: 0.048, // meters
  adsBobFloor: 0.2, // never lower than 20 percent
  adsBreathFloor: 0.3, // never lower than 30 percent
};

export class WeaponMotion {
  constructor() {
    this.phase = 0;
    this.breathPhase = 0;
    this.position = new Vec3Spring(new THREE.Vector3(), 9.8, 0.74);
    this.rotation = new Vec3Spring(new THREE.Vector3(), 8.8, 0.7);
    this.positionTarget = new THREE.Vector3();
    this.rotationTarget = new THREE.Vector3();
    this.pose = { position: this.position.value, rotation: this.rotation.value };
    this.accelKick = new Spring(0, 8.8, 0.62);
    this.strafe = new Spring(0, 7.2, 0.68);
    this.sprintPose = new Spring(0, 12.5, 0.86);
    this.previousSpeed = 0;
    this.previousStrafe = 0;
    this.sprintFovKick = 0;
    this.debugBob = 0;
  }

  update(dt, player, adsBlend) {
    const speedRatio = THREE.MathUtils.clamp(player.speed / 7.9, 0, 1.2);
    const moving = THREE.MathUtils.clamp(player.speed / 2.8, 0, 1);
    const bobScale = Math.max(TUNING.adsBobFloor, 1 - adsBlend * (1 - TUNING.adsBobFloor));
    const breathScale = Math.max(TUNING.adsBreathFloor, 1 - adsBlend * (1 - TUNING.adsBreathFloor));
    const sprint = player.sprint.value;
    this.phase += dt * TUNING.bobSpeed * (0.32 + speedRatio * 0.92) * Math.PI * 2;
    this.breathPhase += dt * TUNING.breathFrequency * Math.PI * 2;
    this.sprintPose.target = sprint;
    this.sprintPose.update(dt);
    this.sprintFovKick = this.sprintPose.value * 5;

    const foot = Math.sin(this.phase);
    const footFigure8 = Math.sin(this.phase * 2 + 0.42);
    const breathX = Math.sin(this.breathPhase) + Math.sin(this.breathPhase * 2.37 + 1.1) * 0.34;
    const breathY = Math.cos(this.breathPhase * 0.87 + 0.4) + Math.sin(this.breathPhase * 1.91) * 0.22;
    const strideY = (footFigure8 * 0.55 + foot * 0.22) * TUNING.bobAmplitude * moving * bobScale;
    const strideX = Math.cos(this.phase) * TUNING.bobSideAmplitude * moving * bobScale;
    const targetStrafe = -player.strafe * (1 - adsBlend * 0.65);
    this.strafe.target = targetStrafe;
    this.strafe.update(dt);
    const accelerationKick = THREE.MathUtils.clamp((player.directionChangeImpulse - 2.5) * 0.005, -0.048, 0.048);
    this.accelKick.target = accelerationKick;
    this.accelKick.update(dt);
    const pump = Math.sin(this.phase + 0.7) * TUNING.sprintPump * this.sprintPose.value;

    this.positionTarget.set(
      strideX + breathX * TUNING.breathAmplitude * breathScale + this.strafe.value * TUNING.strafeSwing,
      strideY + breathY * TUNING.breathAmplitude * 0.7 * breathScale - TUNING.sprintDrop * this.sprintPose.value + pump,
      this.accelKick.value * -0.7,
    );
    this.rotationTarget.set(
      -foot * 0.022 * moving * bobScale + breathY * 0.004 * breathScale,
      this.strafe.value * -0.018,
      -foot * TUNING.bobRoll * moving * bobScale + this.strafe.value * TUNING.strafeRoll + this.sprintPose.value * TUNING.sprintCant,
    );
    this.position.target.copy(this.positionTarget);
    this.rotation.target.copy(this.rotationTarget);
    this.position.update(dt);
    this.rotation.update(dt);
    this.previousSpeed = player.speed;
    this.previousStrafe = player.strafe;
    this.debugBob = strideY;
    return this;
  }

  getPose() { return this.pose; }
}
