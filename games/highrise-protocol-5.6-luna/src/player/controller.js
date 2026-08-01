import * as THREE from "three";
import { Spring, damp } from "../core/spring.js";
import { TUNING as COLLISION_TUNING } from "./collision.js";

export const TUNING = {
  walkSpeed: 4.8, // m/s
  sprintSpeed: 7.9, // m/s
  crouchSpeed: 2.65, // m/s
  acceleration: 18, // 1/s
  airAcceleration: 6, // 1/s
  friction: 12, // 1/s
  gravity: 17.5, // m/s^2
  jumpVelocity: 6.2, // m/s
  crouchHeight: 1.15, // meters
  standHeight: 1.72, // meters
  crouchTransition: 15, // spring Hz
};

export class PlayerController {
  constructor(collision) {
    this.collision = collision;
    this.position = new THREE.Vector3(0, 0, 17);
    this.velocity = new THREE.Vector3();
    this.desired = new THREE.Vector3();
    this.moveDirection = new THREE.Vector3();
    this.inputVector = new THREE.Vector3();
    this.forwardVector = new THREE.Vector3();
    this.rightVector = new THREE.Vector3();
    this.horizontalBefore = new THREE.Vector3();
    this.horizontalAfter = new THREE.Vector3();
    this.onGround = true;
    this.wasGrounded = true;
    this.fallSpeed = 0;
    this.fallDistance = 0;
    this.state = "walk";
    this.crouch = new Spring(0, TUNING.crouchTransition, 0.9);
    this.sprint = new Spring(0, 13, 0.88);
    this.height = new Spring(TUNING.standHeight, TUNING.crouchTransition, 0.92);
    this.landImpulse = 0;
    this.takeoffImpulse = 0;
    this.directionChangeImpulse = 0;
    this.strafe = 0;
    this.forward = 0;
    this.speed = 0;
  }

  update(dt, input, camera) {
    const crouchHeld = input.held("ControlLeft") || input.held("ControlRight");
    const sprintHeld = input.held("ShiftLeft") || input.held("ShiftRight");
    const movingInput = this.inputVector.set(
      (input.held("KeyD") ? 1 : 0) - (input.held("KeyA") ? 1 : 0),
      0,
      (input.held("KeyS") ? 1 : 0) - (input.held("KeyW") ? 1 : 0),
    );
    if (movingInput.lengthSq() > 1) movingInput.normalize();
    const sprintAllowed = sprintHeld && !crouchHeld && movingInput.z < 0 && movingInput.lengthSq() > 0;
    this.crouch.snap(crouchHeld ? 1 : 0);
    this.sprint.snap(sprintAllowed ? 1 : 0);
    this.crouch.update(dt);
    this.sprint.update(dt);
    this.height.target = TUNING.standHeight + (TUNING.crouchHeight - TUNING.standHeight) * this.crouch.value;
    this.height.update(dt);

    const speedTarget = this.sprint.value > 0.65 ? TUNING.sprintSpeed : (this.crouch.value > 0.45 ? TUNING.crouchSpeed : TUNING.walkSpeed);
    const yaw = camera.yaw;
    const forward = this.forwardVector.set(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = this.rightVector.set(Math.cos(yaw), 0, -Math.sin(yaw));
    this.desired.copy(forward).multiplyScalar(-movingInput.z).addScaledVector(right, movingInput.x);
    if (this.desired.lengthSq() > 0.001) this.desired.normalize().multiplyScalar(speedTarget);
    const horizontalBefore = this.horizontalBefore.set(this.velocity.x, 0, this.velocity.z);
    const response = this.onGround ? TUNING.acceleration : TUNING.airAcceleration;
    const hasInput = this.desired.lengthSq() > 0.001;
    const responseRate = hasInput ? response : TUNING.friction;
    this.velocity.x = damp(this.velocity.x, this.desired.x, responseRate, dt);
    this.velocity.z = damp(this.velocity.z, this.desired.z, responseRate, dt);
    const horizontalAfter = this.horizontalAfter.set(this.velocity.x, 0, this.velocity.z);
    this.directionChangeImpulse = horizontalAfter.sub(horizontalBefore).length() / Math.max(dt, 0.0001);

    if (input.pressed("Space") && this.onGround) {
      this.velocity.y = TUNING.jumpVelocity;
      this.onGround = false;
      this.takeoffImpulse = TUNING.jumpVelocity;
    } else {
      this.takeoffImpulse = damp(this.takeoffImpulse, 0, 16, dt);
    }
    if (!this.onGround) {
      this.velocity.y -= TUNING.gravity * dt;
      this.fallDistance += Math.max(0, -this.velocity.y * dt);
    }
    this.position.addScaledVector(this.velocity, dt);
    const groundBefore = this.onGround;
    this.collision.resolve(this.position, COLLISION_TUNING.playerRadius);
    this.onGround = this.position.y <= COLLISION_TUNING.floorY + 0.001 && this.velocity.y <= 0;
    if (!groundBefore && this.onGround) {
      this.landImpulse = THREE.MathUtils.clamp(this.fallDistance * 0.8 + Math.abs(this.velocity.y) * 0.08, 0.08, 1.3);
      this.fallDistance = 0;
      this.velocity.y = 0;
    } else {
      this.landImpulse = damp(this.landImpulse, 0, 12, dt);
    }
    if (this.onGround) this.velocity.y = 0;
    this.wasGrounded = this.onGround;

    this.moveDirection.copy(this.velocity);
    this.speed = Math.hypot(this.velocity.x, this.velocity.z);
    this.forward = THREE.MathUtils.clamp(movingInput.z * -1, -1, 1);
    this.strafe = movingInput.x;
    this.state = !this.onGround ? "air" : (this.sprint.value > 0.6 ? "sprint" : (this.crouch.value > 0.4 ? "crouch" : "walk"));
    return this;
  }

  get eyeHeight() { return this.height.value; }
  get adsSpreadMultiplier() { return this.crouch.value > 0.5 ? 0.8 : 1; }
}
