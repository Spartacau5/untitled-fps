// ---------------------------------------------------------------------------
// weapon/sway.js — ★★★ LOOK-LAG INERTIA: THE CORE FILE ★★★
//
// Raw mouse delta feeds spring-dampers that offset the weapon's position and
// rotation. Snap the mouse -> the weapon trails, eases in with a slight
// overshoot and settles (S1-S5). The camera leads; the weapon is a heavy
// object that follows and catches up.
//
// Tuning lives HERE and only here. Impulses are applied per fixed step, so
// behaviour is identical at 60 / 144 / 240 Hz (K5, C7).
// ---------------------------------------------------------------------------
import { Spring, softClamp, damp, clamp } from '../core/spring.js';

export const TUNING = {
  // -- yaw drag (horizontal, largest travel) ---------------------------------
  YAW_K: 900,           // N/m equivalent — settle ~200 ms
  YAW_D: 31,            // zeta ~0.52: clear overshoot + micro-bounce (S4)
  YAW_IMPULSE: 30,      // mouse-rad -> spring velocity
  YAW_GAIN: 1.25,       // spring value -> displayed weapon yaw
  YAW_MAX: 0.13,        // rad, soft-clamped travel limit (~7.5 deg)

  // -- pitch drag (vertical, tighter) -----------------------------------------
  PITCH_K: 1250,
  PITCH_D: 42,          // zeta ~0.59
  PITCH_IMPULSE: 24,
  PITCH_GAIN: 0.95,
  PITCH_MAX: 0.08,      // ~4.5 deg

  // -- roll: weapon banks into the turn like an arm resisting rotation (S2) ---
  ROLL_K: 72,
  ROLL_D: 12.5,         // under-damped: banking settles with character
  ROLL_RATE_GAIN: 0.055,// rad of bank per rad/s of turn rate
  ROLL_MAX: 0.095,
  RATE_SMOOTH: 16,      // turn-rate lowpass lambda

  // -- sight-tip lag / barrel whip (S5): muzzle travels further than the stock
  MUZZLE_K: 330,
  MUZZLE_D: 20,         // softer than the main drag => visible whip on flicks
  MUZZLE_IMPULSE: 13,
  MUZZLE_GAIN: 0.6,
  MUZZLE_MAX: 0.055,

  // -- positional drag (weapon shifts opposite the turn, sells mass) ----------
  POS_K: 520,
  POS_D: 27,
  POS_GAIN_X: 0.10,     // m of shift per rad of yaw drag
  POS_GAIN_Y: 0.05,     // m of shift per rad of pitch drag
};

export class Sway {
  constructor() {
    this.yaw = new Spring(TUNING.YAW_K, TUNING.YAW_D, 0);
    this.pitch = new Spring(TUNING.PITCH_K, TUNING.PITCH_D, 0);
    this.muzzle = new Spring(TUNING.MUZZLE_K, TUNING.MUZZLE_D, 0);
    this.roll = new Spring(TUNING.ROLL_K, TUNING.ROLL_D, 0);
    this.posX = new Spring(TUNING.POS_K, TUNING.POS_D, 0);
    this.rate = 0; // smoothed turn rate (rad/s)
    this.out = { yaw: 0, pitch: 0, roll: 0, muzzle: 0, x: 0, y: 0 };
    this.yaw.target = 0; this.pitch.target = 0; this.muzzle.target = 0;
    this.posX.target = 0; this.roll.target = 0;
  }

  reset() {
    this.yaw.set(0); this.pitch.set(0); this.muzzle.set(0);
    this.roll.set(0); this.posX.set(0); this.rate = 0;
  }

  // dt: fixed step. mdx/mdy: mouse pixels for this step. sens: rad/px.
  // scale: ADS sway multiplier — hard-floored upstream (S13, K7), never 0.
  // ads: 0..1 blend — S14: same springs, but damping/stiffness rise in ADS so
  // the sight trails and catches up faster and tighter, never absent.
  update(dt, mdx, mdy, sens, scale, ads = 0) {
    const T = TUNING;
    const kMul = 1 + 0.30 * ads;
    const dMul = 1 + 0.45 * ads;
    this.yaw.k = T.YAW_K * kMul;   this.yaw.d = T.YAW_D * dMul;
    this.pitch.k = T.PITCH_K * kMul; this.pitch.d = T.PITCH_D * dMul;
    this.muzzle.k = T.MUZZLE_K * kMul; this.muzzle.d = T.MUZZLE_D * dMul;
    const lookYaw = -mdx * sens;   // camera yaw delta this step (rad)
    const lookPitch = -mdy * sens; // camera pitch delta this step (rad)

    // S1: impulse-driven lag. Fast flick => big impulse => dramatic drag;
    // slow tracking => tiny impulses => near-imperceptible drift.
    this.yaw.impulse(lookYaw * T.YAW_IMPULSE);
    this.pitch.impulse(lookPitch * T.PITCH_IMPULSE);
    this.muzzle.impulse(lookYaw * T.MUZZLE_IMPULSE + lookPitch * T.MUZZLE_IMPULSE * 0.6);

    // smoothed turn rate drives roll-into-turn
    const instRate = Math.abs(lookYaw) > 1e-7 ? lookYaw / dt : 0;
    this.rate = damp(this.rate, clamp(instRate, -30, 30), T.RATE_SMOOTH, dt);
    this.roll.target = softClamp(-this.rate * T.ROLL_RATE_GAIN, T.ROLL_MAX);

    this.yaw.update(dt); this.pitch.update(dt); this.muzzle.update(dt);
    this.roll.update(dt);

    // positional mass-shift follows the drag springs
    this.posX.target = -this.yaw.value * T.POS_GAIN_X;
    this.posX.update(dt);

    // S3: soft clamp (tanh knee) — drag eases into the limit, never a hard stop.
    // ADS scales amplitude but is floored so the weapon never turns to stone (K7).
    const o = this.out;
    o.yaw = -softClamp(this.yaw.value, T.YAW_MAX) * T.YAW_GAIN * scale;
    o.pitch = -softClamp(this.pitch.value, T.PITCH_MAX) * T.PITCH_GAIN * scale;
    o.roll = this.roll.value * scale;
    o.muzzle = -softClamp(this.muzzle.value, T.MUZZLE_MAX) * T.MUZZLE_GAIN * scale;
    o.x = this.posX.value * scale;
    o.y = -Math.abs(this.pitch.value) * T.POS_GAIN_Y * scale;
  }

  // P4/K7: live values for the debug overlay.
  debug() {
    return {
      yaw: this.yaw.value.toFixed(4), yawV: this.yaw.vel.toFixed(3),
      pitch: this.pitch.value.toFixed(4), roll: this.roll.value.toFixed(4),
      muzzle: this.muzzle.value.toFixed(4), rate: this.rate.toFixed(2),
    };
  }
}
