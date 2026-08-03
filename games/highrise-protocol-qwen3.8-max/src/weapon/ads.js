// ---------------------------------------------------------------------------
// weapon/ads.js — aim-down-sights transition + the anti-"stone gun" floors.
// ADS is the PRECISE pole, never the FROZEN pole (S13-S17, K7):
// amplitudes scale DOWN with hard non-zero floors, damping goes UP via the
// tighter springs upstream, and recoil keeps at least ADS_FLOOR of its punch.
// ---------------------------------------------------------------------------
import { Spring, lerp, clamp } from '../core/spring.js';

export const TUNING = {
  TRANS_K: 210,         // ~150 ms hip<->ADS (A1), snappy, no cut
  TRANS_D: 28,          // zeta ~0.97 — buttery, near-critical
  SENS_SCALE: 0.72,     // sensitivity scales with zoom (A1)
  // ---- HARD FLOORS (K7). Motion may shrink, it may NEVER die. ---------------
  FLOOR_SWAY: 0.30,     // S13: look-lag keeps ~30% of hip travel
  FLOOR_BOB: 0.25,      // S13: walk bob keeps ~25%
  FLOOR_BREATHE: 0.35,  // S13: breathing keeps ~35% — sight picture lives
  FLOOR_RECOIL: 0.55,   // S15: recoil reduced ~45% max (also in recoil.js)
};

export class ADS {
  constructor() {
    this.amt = new Spring(TUNING.TRANS_K, TUNING.TRANS_D, 0);
    this.held = false;
  }

  reset() { this.amt.set(0); this.held = false; }

  update(dt, input) {
    this.held = input.adsHeld && !input.dead;
    this.amt.target = this.held ? 1 : 0;
    this.amt.update(dt);
    return this.amt.value;
  }

  get value() { return this.amt.value; }

  // All getters are clamp()-ed to their floors: no tuning path can zero them.
  swayScale() { return clamp(lerp(1, TUNING.FLOOR_SWAY, this.amt.value), TUNING.FLOOR_SWAY, 1); }
  bobScale() { return clamp(lerp(1, TUNING.FLOOR_BOB, this.amt.value), TUNING.FLOOR_BOB, 1); }
  breatheScale() { return clamp(lerp(1, TUNING.FLOOR_BREATHE, this.amt.value), TUNING.FLOOR_BREATHE, 1); }
  recoilScale() { return clamp(lerp(1, TUNING.FLOOR_RECOIL, this.amt.value), TUNING.FLOOR_RECOIL, 1); }
  sensScale() { return lerp(1, TUNING.SENS_SCALE, this.amt.value); }
  fovAmt() { return this.amt.value; }

  debug() {
    return `ads=${this.amt.value.toFixed(3)} sway=${this.swayScale().toFixed(2)} ` +
      `bob=${this.bobScale().toFixed(2)} breathe=${this.breatheScale().toFixed(2)} ` +
      `recoil=${this.recoilScale().toFixed(2)}`;
  }
}
