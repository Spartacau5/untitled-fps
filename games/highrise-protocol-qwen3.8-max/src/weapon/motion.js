// ---------------------------------------------------------------------------
// weapon/motion.js — ★ movement-driven weapon motion layers ★
// Walk bob on a footstep phase clock (S6), strafe swing/bank (S7), accel
// inertia (S8), sprint pose + pump (S9), jump/land (S10), breathing (S11).
// Every layer is spring-driven or eased; amplitudes scale smoothly so speed
// changes never pop. Output is consumed by viewmodel.js composition (S12).
// ---------------------------------------------------------------------------
import { Spring, clamp, damp } from '../core/spring.js';

export const TUNING = {
  // walk bob (figure-8 driven by footstep phase, not raw time)
  BOB_X: 0.0165,        // m lateral
  BOB_Y: 0.0115,        // m vertical
  BOB_ROLL: 0.015,      // rad
  BOB_PITCH: 0.0055,    // rad
  SPRINT_BOB: 2.0,      // bob multiplier at full sprint
  AMP_K: 40, AMP_D: 12, // amplitude smoother => continuity through speed changes

  // strafe swing/bank (own spring, lags start/stop)
  STRAFE_K: 85, STRAFE_D: 12.5,
  STRAFE_GAIN: 0.0085,  // m of swing per m/s lateral velocity
  STRAFE_ROLL: 0.011,   // rad bank per m/s

  // accel/decel inertia push
  ACCEL_K: 130, ACCEL_D: 16,
  ACCEL_GAIN: 0.0011,   // pitch rad per m/s^2
  ACCEL_Z: 0.0016,      // z push m per m/s^2

  // sprint pose
  SPRINT_K: 42, SPRINT_D: 11.5,   // fully animated in/out, never a cut
  SPRINT_Y: -0.055,     // lowered
  SPRINT_Z: 0.03,       // pulled back slightly
  SPRINT_YAW: -0.34,    // canted out
  SPRINT_ROLL: 0.15,
  SPRINT_PUMP: 0.022,   // arms pumping with the footstep clock

  // jump / land
  LAND_K: 170, LAND_D: 13,        // under-damped: dip + ease-out overshoot
  LAND_GAIN: 0.012,     // impulse per m/s of fall speed
  JUMP_LIFT: 0.02,      // slight rise while airborne

  // idle breathing sway (multi-frequency Lissajous, never one visible sine)
  BREATH: 0.0052,       // m
  TREMOR: 0.00055,      // m, high-freq micro tremor (kept visible in ADS)

  STRAFE_X_BIAS: 0.6,   // how much strafe swings vs shifts
};

export class Motion {
  constructor() {
    this.amp = new Spring(TUNING.AMP_K, TUNING.AMP_D, 0);
    this.strafe = new Spring(TUNING.STRAFE_K, TUNING.STRAFE_D, 0);
    this.strafeRoll = new Spring(TUNING.STRAFE_K * 0.8, TUNING.STRAFE_D, 0);
    this.accel = new Spring(TUNING.ACCEL_K, TUNING.ACCEL_D, 0);
    this.sprint = new Spring(TUNING.SPRINT_K, TUNING.SPRINT_D, 0);
    this.land = new Spring(TUNING.LAND_K, TUNING.LAND_D, 0);
    this.air = new Spring(90, 16, 0);
    this.t = 0;
    this._smoothFwdAcc = 0;
    this.out = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 };
  }

  reset() {
    this.amp.set(0); this.strafe.set(0); this.strafeRoll.set(0);
    this.accel.set(0); this.sprint.set(0); this.land.set(0); this.air.set(0);
    this.t = 0; this._smoothFwdAcc = 0;
  }

  landHit(fallSpeed) {
    this.land.impulse(Math.min(fallSpeed, 17) * TUNING.LAND_GAIN * 60);
  }

  // dt fixed step. ctrl: Controller. bobScale/breatheScale: ADS-floored (K7).
  update(dt, ctrl, bobScale, breatheScale) {
    const T = TUNING;
    this.t += dt;

    // S6: amplitude tracks speed through a spring => fully continuous.
    const moveAmt = clamp(ctrl.speedH / 6.3, 0, 1.6);
    this.amp.target = moveAmt * (1 + (T.SPRINT_BOB - 1) * ctrl.sprintAmt.value);
    this.amp.update(dt);

    // S9: sprint blend spring — transitions fully animated, never a cut.
    this.sprint.target = ctrl.sprinting || ctrl.sliding ? 1 : 0;
    this.sprint.update(dt);
    const sp = this.sprint.value;

    // S7: strafe swing/bank with its own spring; lags on start/stop.
    this.strafe.target = -ctrl.velLat * T.STRAFE_GAIN;
    this.strafeRoll.target = -ctrl.velLat * T.STRAFE_ROLL;
    this.strafe.update(dt); this.strafeRoll.update(dt);

    // S8: accel/decel inertia — distinct push on start, stop and reversal.
    this._smoothFwdAcc = damp(this._smoothFwdAcc, clamp(ctrl.accFwd, -40, 40), 22, dt);
    this.accel.target = -this._smoothFwdAcc * T.ACCEL_GAIN;
    this.accel.update(dt);

    // S10: land dip (impulse spring, ease-out overshoot) + airborne lift.
    this.land.update(dt);
    this.air.target = ctrl.onGround ? 0 : T.JUMP_LIFT;
    this.air.update(dt);

    // S6: figure-8 bob on the footstep phase clock.
    const ph = ctrl.phase;
    const amp = this.amp.value * bobScale;
    const bobX = Math.sin(ph) * T.BOB_X * amp;
    const bobY = -Math.abs(Math.cos(ph)) * T.BOB_Y * amp * 2 + T.BOB_Y * amp;
    const bobRoll = Math.sin(ph) * T.BOB_ROLL * amp;
    const bobPitch = Math.sin(ph * 2 + 0.6) * T.BOB_PITCH * amp;

    // S9 sprint pump, synced to the same clock.
    const pump = Math.sin(ph) * T.SPRINT_PUMP * sp;
    const pumpY = -Math.abs(Math.cos(ph)) * T.SPRINT_PUMP * 0.8 * sp;

    // S11: breathing sway — layered Lissajous, never a single visible loop.
    const t = this.t;
    const br = T.BREATH * breatheScale;
    const bx = br * (Math.sin(t * 0.83) + 0.55 * Math.sin(t * 1.91 + 1.2));
    const by = br * (0.9 * Math.sin(t * 0.61 + 0.7) + 0.5 * Math.sin(t * 1.37));
    // micro tremor: two irrational-ratio sines read as organic hand shake
    const tr = T.TREMOR * breatheScale;
    const tx = tr * (Math.sin(t * 11.3) + Math.sin(t * 17.77 + 2.1));
    const ty = tr * (Math.sin(t * 9.7 + 1.0) + Math.sin(t * 15.13));

    const o = this.out;
    o.x = bobX + this.strafe.value + bx + tx + pump * 0.35;
    o.y = bobY + pumpY + by + ty + this.air.value - this.land.value;
    o.z = -this._smoothFwdAcc * T.ACCEL_Z * 0.02 + sp * T.SPRINT_Z + this.land.value * 0.6;
    o.rx = bobPitch + this.accel.value - this.land.value * 1.4;
    o.ry = sp * T.SPRINT_YAW;
    o.rz = bobRoll + this.strafeRoll.value + sp * T.SPRINT_ROLL;
    return o;
  }
}
