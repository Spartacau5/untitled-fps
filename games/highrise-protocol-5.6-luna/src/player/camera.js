import * as THREE from "three";
import { Spring, damp, softClamp } from "../core/spring.js";

export const TUNING = {
  sensitivity: 0.00205, // radians per mouse pixel
  pitchLimit: 1.48, // radians
  baseFov: 75, // degrees
  adsFov: 55, // degrees
  cameraHeight: 1.72, // meters
  landingDip: 0.055, // radians
  shakeRecovery: 12, // 1/s
  recoilFastHz: 8.4, // Hz, crisp per-round camera kick
  recoilFastDamping: 0.68, // ratio
  recoilResidualHz: 2.45, // Hz, long burst climb tail
  recoilResidualDamping: 0.9, // ratio
  recoilYawHz: 5.6, // Hz
  recoilYawDamping: 0.76, // ratio
};

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.yaw = 0;
    this.pitch = -0.055;
    this.adsBlend = 0;
    this.fov = new Spring(TUNING.baseFov, 14, 0.9);
    this.roll = new Spring(0, 13, 0.84);
    this.dip = new Spring(0, 11, 0.83);
    this.recoilFast = new Spring(0, TUNING.recoilFastHz, TUNING.recoilFastDamping);
    this.recoilResidual = new Spring(0, TUNING.recoilResidualHz, TUNING.recoilResidualDamping);
    this.recoilYaw = new Spring(0, TUNING.recoilYawHz, TUNING.recoilYawDamping);
    this.shake = new THREE.Vector3();
    this.shakeVelocity = new THREE.Vector3();
    this.shakeTarget = new THREE.Vector3();
    this.shakeDelta = new THREE.Vector3();
    this.noiseTime = 0;
    this.lookDirection = new THREE.Vector3();
    this.forward = new THREE.Vector3();
    this.previousPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    this.previousRotation = new THREE.Vector3();
    this.currentRotation = new THREE.Vector3();
    this.camera.rotation.order = "YXZ";
  }

  applyMouse(delta, adsBlend) {
    const sensitivity = TUNING.sensitivity * (1 - adsBlend * 0.42);
    this.yaw -= delta.dx * sensitivity;
    this.pitch -= delta.dy * sensitivity;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -TUNING.pitchLimit, TUNING.pitchLimit);
  }

  addShake(amount, direction = new THREE.Vector3(0, 0, 0)) {
    this.shakeTarget.x += direction.x * amount;
    this.shakeTarget.y += direction.y * amount;
    this.shakeTarget.z += amount * 0.35;
  }

  addRecoil(pitch, yaw) {
    this.recoilFast.value = THREE.MathUtils.clamp(this.recoilFast.value + pitch * 0.72, 0, 0.075);
    this.recoilFast.impulse(pitch * 24);
    this.recoilResidual.value = THREE.MathUtils.clamp(this.recoilResidual.value + pitch * 0.28, 0, 0.055);
    this.recoilResidual.impulse(pitch * 2.4);
    this.recoilYaw.value = THREE.MathUtils.clamp(this.recoilYaw.value + yaw, -0.045, 0.045);
    this.recoilYaw.impulse(yaw * 10);
  }

  update(dt, player, adsBlend, motion) {
    this.adsBlend = adsBlend;
    this.fov.target = TUNING.baseFov + (TUNING.adsFov - TUNING.baseFov) * adsBlend + (motion?.sprintFovKick || 0);
    this.fov.update(dt);
    this.dip.target = -(player.landImpulse * TUNING.landingDip) + player.takeoffImpulse * 0.004;
    this.dip.update(dt);
    this.recoilFast.target = 0;
    this.recoilResidual.target = 0;
    this.recoilYaw.target = 0;
    this.recoilFast.update(dt);
    this.recoilResidual.update(dt);
    this.recoilYaw.update(dt);
    this.shakeTarget.multiplyScalar(Math.exp(-TUNING.shakeRecovery * dt));
    this.shakeDelta.copy(this.shakeTarget).sub(this.shake);
    this.shakeVelocity.addScaledVector(this.shakeDelta, 160 * dt);
    this.shakeVelocity.multiplyScalar(Math.max(0, 1 - 14 * dt));
    this.shake.addScaledVector(this.shakeVelocity, dt);
    this.noiseTime += dt;
    const microX = Math.sin(this.noiseTime * 29.3) * 0.0012 + Math.sin(this.noiseTime * 47.1) * 0.0007;
    const microY = Math.cos(this.noiseTime * 31.7) * 0.0011;
    this.previousPosition.copy(this.currentPosition);
    this.previousRotation.copy(this.currentRotation);
    this.currentPosition.set(player.position.x, player.position.y + player.eyeHeight, player.position.z);
    this.currentRotation.set(
      this.pitch + this.dip.value + this.recoilFast.value + this.recoilResidual.value + this.shake.y + microY,
      this.yaw + this.recoilYaw.value + this.shake.x + microX,
      softClamp(this.roll.value + this.shake.z, 0.12, 0.7),
    );
    this.camera.position.copy(this.currentPosition);
    this.camera.rotation.set(this.currentRotation.x, this.currentRotation.y, this.currentRotation.z);
    this.camera.fov = this.fov.value;
    this.camera.updateProjectionMatrix();
    this.camera.getWorldDirection(this.forward);
    return this;
  }

  setLean(value) { this.roll.target = value; }
  resetRecoil() {
    this.recoilFast.set(0);
    this.recoilResidual.set(0);
    this.recoilYaw.set(0);
  }
  render(alpha) {
    const t = THREE.MathUtils.clamp(alpha, 0, 1);
    const eased = t * t * (3 - 2 * t);
    this.camera.position.set(
      this.previousPosition.x + (this.currentPosition.x - this.previousPosition.x) * eased,
      this.previousPosition.y + (this.currentPosition.y - this.previousPosition.y) * eased,
      this.previousPosition.z + (this.currentPosition.z - this.previousPosition.z) * eased,
    );
    this.camera.rotation.set(
      this.previousRotation.x + (this.currentRotation.x - this.previousRotation.x) * eased,
      this.previousRotation.y + (this.currentRotation.y - this.previousRotation.y) * eased,
      this.previousRotation.z + (this.currentRotation.z - this.previousRotation.z) * eased,
    );
    this.camera.updateMatrixWorld();
  }
  getAimOrigin(target = new THREE.Vector3()) { return target.copy(this.camera.getWorldPosition(new THREE.Vector3())); }
  getAimDirection(target = new THREE.Vector3()) { return this.camera.getWorldDirection(target).normalize(); }
}
