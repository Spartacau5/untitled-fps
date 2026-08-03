// ---------------------------------------------------------------------------
// core/time.js — ONE time-scale manager (K4). Hit-stop and slow-mo route
// through here exclusively. Nothing else in the codebase scales dt ad hoc.
// ---------------------------------------------------------------------------
import { damp } from './spring.js';

export const TUNING = {
  HITSTOP_SCALE: 0.1,    // F4: ~2-3 frames of near-freeze on kill
  HITSTOP_TIME: 0.05,    // s, real time
  RECOVER_RATE: 14,      // ease-back speed toward 1.0 after a stop
  MIN_SCALE: 0.05,
};

export class TimeManager {
  constructor() {
    this.scale = 1;
    this._stopT = 0;
    this._stopScale = TUNING.HITSTOP_SCALE;
  }

  // Request a hit-stop. Overlapping calls extend / deepen it.
  hitStop(duration = TUNING.HITSTOP_TIME, scale = TUNING.HITSTOP_SCALE) {
    this._stopT = Math.max(this._stopT, duration);
    this._stopScale = Math.min(this._stopScale, scale);
  }

  // Returns simulation dt for this real frame.
  update(dtReal) {
    if (this._stopT > 0) {
      this._stopT -= dtReal;
      this.scale = damp(this.scale, this._stopScale, 80, dtReal);
      if (this._stopT <= 0) this._stopScale = TUNING.HITSTOP_SCALE;
    } else {
      this.scale = damp(this.scale, 1, TUNING.RECOVER_RATE, dtReal);
    }
    if (this.scale < TUNING.MIN_SCALE) this.scale = TUNING.MIN_SCALE;
    return dtReal * this.scale;
  }
}
