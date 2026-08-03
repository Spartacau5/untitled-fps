// ---------------------------------------------------------------------------
// player/controller.js — movement state machine: walk / sprint / crouch /
// slide / air. Quake-style accelerate/friction => liquid, no velocity snaps.
// Emits footstep phase clock + landing events that drive weapon motion.
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Spring } from '../core/spring.js';

export const TUNING = {
  WALK: 6.3,           // m/s target walk speed
  SPRINT: 9.4,         // m/s
  CROUCH: 3.1,         // m/s
  SLIDE_ENTER: 6.5,    // min speed to enter a slide
  SLIDE_SPEED: 10.2,   // initial slide speed
  SLIDE_TIME: 0.85,    // s
  ACCEL_GROUND: 46,    // m/s^2
  ACCEL_AIR: 9.5,      // air control
  FRICTION: 11.0,      // ground friction 1/s
  JUMP: 5.7,           // m/s
  GRAVITY: 15.5,       // m/s^2
  HALF_X: 0.34,        // collider half extents
  HALF_Z: 0.34,
  HEIGHT_STAND: 1.8,
  HEIGHT_CROUCH: 1.22,
  EYE_STAND: 1.62,
  EYE_CROUCH: 0.98,
  EYE_SLIDE: 0.86,
  CROUCH_K: 130, CROUCH_D: 20,   // ~200ms smooth drop (M3), slightly under-damped
  SPRINT_K: 60,  SPRINT_D: 14,
  STRIDE: 2.1,           // m per full stride cycle (drives bob clock, S6)
};

export class Controller {
  constructor(collision, spawn) {
    this.collision = collision;
    this.pos = spawn.clone();
    this.vel = new THREE.Vector3();
    this.onGround = true;
    this.sprinting = false;
    this.crouching = false;
    this.sliding = false;
    this.slideT = 0;
    this.slideDir = new THREE.Vector3();
    this.height = TUNING.HEIGHT_STAND;
    this.eye = TUNING.EYE_STAND;
    this.phase = 0;             // footstep clock (radians)
    this.speedH = 0;
    this.velFwd = 0; this.velLat = 0;
    this.accFwd = 0; this.accLat = 0;
    this._prevFwd = 0; this._prevLat = 0;
    this.crouchAmt = new Spring(TUNING.CROUCH_K, TUNING.CROUCH_D, 0);
    this.sprintAmt = new Spring(TUNING.SPRINT_K, TUNING.SPRINT_D, 0);
    this._landCbs = [];
    this._stepCbs = [];
    this._wasGround = true;
    this._prevVy = 0;
    this._lastStep = 0;
  }

  onLand(cb) { this._landCbs.push(cb); }
  onStep(cb) { this._stepCbs.push(cb); }

  get moving() { return this.speedH > 0.4; }

  update(dt, input, yaw) {
    const T = TUNING;
    // --- intent -------------------------------------------------------------
    let ix = 0, iy = 0;
    if (input.locked && !input.dead) {
      ix = (input.down('KeyD') ? 1 : 0) - (input.down('KeyA') ? 1 : 0);
      iy = (input.down('KeyW') ? 1 : 0) - (input.down('KeyS') ? 1 : 0);
    }
    this.crouching = input.locked && !input.dead &&
      (input.down('KeyC') || input.down('ControlLeft') || input.down('ControlRight'));
    const wantSprint = input.down('ShiftLeft') && iy > 0 && !this.crouching && !input.adsHeld;

    // --- slide (crouch while sprinting with speed) ---------------------------
    if (!this.sliding && this.crouching && this.sprinting && this.speedH > T.SLIDE_ENTER && this.onGround) {
      this.sliding = true; this.slideT = T.SLIDE_TIME;
      const s = Math.max(this.speedH, T.SLIDE_SPEED);
      const f = this._forward(yaw);
      this.slideDir.set(f.x, 0, f.z).multiplyScalar(s);
    }
    if (this.sliding) {
      this.slideT -= dt;
      if (this.slideT <= 0 || this.speedH < 2.2 || !this.crouching) this.sliding = false;
    }
    this.sprinting = wantSprint && !this.sliding;

    // --- wish direction ------------------------------------------------------
    const f = this._forward(yaw), r = this._right(yaw);
    let wx = f.x * iy + r.x * ix, wz = f.z * iy + r.z * ix;
    const wl = Math.hypot(wx, wz);
    if (wl > 1) { wx /= wl; wz /= wl; }

    const maxSpeed = this.sliding ? 0 : (this.crouching ? T.CROUCH : (this.sprinting ? T.SPRINT : T.WALK));

    // --- friction ------------------------------------------------------------
    if (this.onGround && !this.sliding) {
      const sp = Math.hypot(this.vel.x, this.vel.z);
      if (sp > 0.01) {
        const drop = sp * T.FRICTION * dt;
        const scale = Math.max(sp - drop, 0) / sp;
        this.vel.x *= scale; this.vel.z *= scale;
      } else { this.vel.x = 0; this.vel.z = 0; }
    }

    // --- acceleration ----------------------------------------------------------
    if (this.sliding) {
      // slide: committed direction, bleeding off smoothly
      const s = Math.max(this.slideT / T.SLIDE_TIME, 0);
      this.vel.x = this.slideDir.x * s;
      this.vel.z = this.slideDir.z * s;
    } else {
      const accel = this.onGround ? T.ACCEL_GROUND : T.ACCEL_AIR;
      const cur = this.vel.x * wx + this.vel.z * wz;
      const add = Math.min(accel * dt, Math.max(maxSpeed - cur, 0));
      this.vel.x += wx * add; this.vel.z += wz * add;
    }

    // --- jump / gravity --------------------------------------------------------
    if (input.locked && !input.dead && input.consume('Space') && this.onGround && !this.sliding) {
      this.vel.y = T.JUMP;
      this.onGround = false;
    }
    if (!this.onGround) this.vel.y -= T.GRAVITY * dt;

    // --- integrate + collide -----------------------------------------------------
    const crouchTarget = (this.crouching || this.sliding) ? 1 : 0;
    this.crouchAmt.target = crouchTarget; this.crouchAmt.update(dt);
    this.sprintAmt.target = this.sprinting ? 1 : 0; this.sprintAmt.update(dt);
    const cA = this.crouchAmt.value;
    this.height = T.HEIGHT_STAND - (T.HEIGHT_STAND - T.HEIGHT_CROUCH) * cA;
    this.eye = (this.sliding ? T.EYE_SLIDE : T.EYE_STAND - (T.EYE_STAND - T.EYE_CROUCH) * cA);

    this._prevVy = this.vel.y;
    this._wasGround = this.onGround;
    const res = this.collision.moveAABB(this.pos, T.HALF_X, T.HALF_Z, this.height, this.vel, dt);
    this.onGround = res.ground;

    // landing event (S10): scaled by fall speed
    if (!this._wasGround && this.onGround && this._prevVy < -3.5) {
      for (const cb of this._landCbs) cb(-this._prevVy);
    }

    // --- local velocities + accelerations (feed motion.js, S7/S8) ---------------
    this.speedH = Math.hypot(this.vel.x, this.vel.z);
    this.velFwd = this.vel.x * f.x + this.vel.z * f.z;
    this.velLat = this.vel.x * r.x + this.vel.z * r.z;
    this.accFwd = (this.velFwd - this._prevFwd) / dt;
    this.accLat = (this.velLat - this._prevLat) / dt;
    this._prevFwd = this.velFwd; this._prevLat = this.velLat;

    // --- footstep phase clock (S6): driven by distance, continuous -------------
    const strideRate = this.onGround ? this.speedH / T.STRIDE : 0;
    this.phase += strideRate * Math.PI * 2 * dt;
    const step = Math.floor(this.phase / Math.PI);
    if (step !== this._lastStep && this.onGround && this.speedH > 1.5) {
      this._lastStep = step;
      for (const cb of this._stepCbs) cb(step % 2 === 0);
    }
  }

  _forward(yaw) { return { x: -Math.sin(yaw), z: -Math.cos(yaw) }; }
  _right(yaw) { return { x: Math.cos(yaw), z: -Math.sin(yaw) }; }
}
