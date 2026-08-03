// ---------------------------------------------------------------------------
// weapon/recoil.js — ★ impulse-driven recoil, three decoupled layers (F2) ★
// (1) rotational kick: pitch up + seeded yaw wander
// (2) positional punch: weapon slams back along its own axis
// (3) roll snap: small torque, never a pure vertical elevator
// Each layer recovers on its own spring at its own rate (F2b). Sustained fire
// ACCUMULATES: fast spring + slow spring split so long bursts leave the gun
// genuinely off-target and the player fights it back down (F2a, F2d).
// Camera kick and viewmodel kick are separate coupled layers (F2).
// ---------------------------------------------------------------------------
import { Spring, clamp } from '../core/spring.js';

export const TUNING = {
  // -- view (camera) kick: weaker than the gun, coupled ---------------------
  VIEW_KICK: 1.55,        // rad/s total impulse per shot, split fast/slow
  VIEW_FAST_K: 900, VIEW_FAST_D: 50,   // zeta~0.83: returns ~75% in ~120 ms
  VIEW_SLOW_K: 55,  VIEW_SLOW_D: 10.5, // zeta~0.71: residual drifts ~400 ms
  VIEW_YAW_WANDER: 0.55,  // seeded horizontal wander fraction
  // -- gun rotational kick ----------------------------------------------------
  GUN_KICK: 5.2,          // rad/s pitch impulse (gun kicks HARDER than view)
  GUN_PITCH_K: 520, GUN_PITCH_D: 30,   // slight overshoot on recovery
  GUN_YAW_K: 460, GUN_YAW_D: 28,
  // -- gun positional punch (back into the shoulder) ---------------------------
  PUNCH: 3.4,             // m/s impulse along gun axis
  PUNCH_K: 430, PUNCH_D: 27,
  // -- roll snap -----------------------------------------------------------------
  ROLL_SNAP: 2.0,         // rad/s, sign alternates with seeded jitter
  ROLL_K: 380, ROLL_D: 25,
  // -- pattern ---------------------------------------------------------------------
  PATTERN_RESET: 0.24,    // s without fire before the climb pattern resets
  CLIMB_PER_SHOT: 0.32,   // extra slow-spring impulse per consecutive shot
  CLIMB_MAX: 3.0,
  BLOOM_PER_SHOT: 0.9,
  BLOOM_K: 60, BLOOM_D: 14,
  ADS_FLOOR: 0.55,        // S15/F2c: ADS may reduce, NEVER flatten recoil
  CROUCH_REDUCE: 0.15,
  GLOBAL_FLOOR: 0.45,     // hardest floor across all stances combined
};

export class Recoil {
  constructor() {
    const T = TUNING;
    this.vFast = new Spring(T.VIEW_FAST_K, T.VIEW_FAST_D, 0);
    this.vSlow = new Spring(T.VIEW_SLOW_K, T.VIEW_SLOW_D, 0);
    this.vYawFast = new Spring(T.VIEW_FAST_K, T.VIEW_FAST_D, 0);
    this.vYawSlow = new Spring(T.VIEW_SLOW_K, T.VIEW_SLOW_D, 0);
    this.gPitch = new Spring(T.GUN_PITCH_K, T.GUN_PITCH_D, 0);
    this.gYaw = new Spring(T.GUN_YAW_K, T.GUN_YAW_D, 0);
    this.gPunch = new Spring(T.PUNCH_K, T.PUNCH_D, 0);
    this.gRoll = new Spring(T.ROLL_K, T.ROLL_D, 0);
    this.bloom = new Spring(T.BLOOM_K, T.BLOOM_D, 0);
    this.shots = 0;
    this._lastFireT = -10;
    this._time = 0;
    this._rollSign = 1;
    this._kick = { pitch: 0, yaw: 0, roll: 0 };
  }

  reset() {
    for (const s of [this.vFast, this.vSlow, this.vYawFast, this.vYawSlow,
      this.gPitch, this.gYaw, this.gPunch, this.gRoll, this.bloom]) s.set(0);
    this.shots = 0; this._lastFireT = -10; this._rollSign = 1;
  }

  // Per-shot impulse injection (F2a). adsAmt/crouchAmt in [0,1]. rng seeded.
  fire(adsAmt, crouchAmt, rng) {
    const T = TUNING;
    this._time0();
    // S15/F2c: recoil scales DOWN in ADS, never out. Enforce the floors.
    let scale = 1 - (1 - T.ADS_FLOOR) * adsAmt;
    scale *= 1 - T.CROUCH_REDUCE * crouchAmt;
    scale = Math.max(scale, T.GLOBAL_FLOOR);

    // F2d pattern continuity: consecutive shots accumulate climb.
    const consecutive = this.shots;
    const climb = Math.min(consecutive * T.CLIMB_PER_SHOT, T.CLIMB_MAX);
    const vk = T.VIEW_KICK * scale;

    // (1) rotational kick: deterministic vertical climb + seeded yaw wander
    const wander = rng.gauss() * T.VIEW_YAW_WANDER;
    this.vFast.impulse(vk * 0.72);
    this.vSlow.impulse(vk * 0.28 + climb * 0.18);
    this.vYawFast.impulse(vk * wander * 0.5);
    this.vYawSlow.impulse(vk * wander * 0.22);

    // gun layers kick harder than the view
    const gk = T.GUN_KICK * (0.55 + 0.45 * scale);
    this.gPitch.impulse(gk * (0.92 + rng.next() * 0.16));
    this.gYaw.impulse(gk * wander * 0.35);

    // (2) positional punch back along the bore axis
    this.gPunch.impulse(T.PUNCH * (0.6 + 0.4 * scale) * (0.9 + rng.next() * 0.2));

    // (3) roll snap, alternating with jitter — the gun twists, never elevates
    this._rollSign = rng.chance(0.72) ? -this._rollSign : this._rollSign;
    this.gRoll.impulse(T.ROLL_SNAP * this._rollSign * (0.7 + rng.next() * 0.5));

    this.bloom.impulse(T.BLOOM_PER_SHOT);
    this.shots++;
    this._lastFireT = this._time;
  }

  _time0() { /* kept for clarity: time advanced in update */ }

  update(dt) {
    const T = TUNING;
    this._time += dt;
    if (this._time - this._lastFireT > T.PATTERN_RESET) this.shots = 0;
    for (const s of [this.vFast, this.vSlow, this.vYawFast, this.vYawSlow,
      this.gPitch, this.gYaw, this.gPunch, this.gRoll, this.bloom]) s.update(dt);
    const k = this._kick;
    k.pitch = this.vFast.value + this.vSlow.value;
    k.yaw = this.vYawFast.value + this.vYawSlow.value;
    k.roll = this.gRoll.value * 0.06; // faint roll bleeds into the view
  }

  // Camera-side kick (applied in camera.js) — separate from gun kick (F2).
  viewKick() { return this._kick; }

  // Gun-side transform deltas (applied in viewmodel.js).
  gunKick() {
    return {
      pitch: this.gPitch.value,
      yaw: this.gYaw.value,
      z: this.gPunch.value * 0.016,   // m of visible slam-back
      roll: this.gRoll.value,
    };
  }

  spreadBloom() { return clamp(this.bloom.value, 0, 2.2); }
}
