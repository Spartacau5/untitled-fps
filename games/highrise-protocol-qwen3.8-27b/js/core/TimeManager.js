// K4: time-scale math through ONE manager. hit-stop + OVERDRIVE + kill-cam
// can stack — never multiply ad hoc. The effective scale is computed as a
// single resolved product each frame from named, bounded factors.
export class TimeManager {
  constructor() {
    this.base = 1;
    this.hitStop = 1;      // ~0.1 during a kill hit-stop, eases back to 1
    this.hitStopTarget = 1;
    this.hitStopDur = 0;
    this.overdrive = 1;    // 0.85 during OVERDRIVE
    this.killcam = 1;      // slow-mo factor during kill-cam
    this.killcamTarget = 1;
    this.timeScale = 1;    // resolved
    this._t = 0;
  }
  // Trigger a kill hit-stop: world briefly at ~0.1x.
  triggerHitStop(scale = 0.1, dur = 0.06) {
    this.hitStop = scale;
    this.hitStopTarget = 1;
    this.hitStopDur = dur;
    this._t = 0;
  }
  setOverdrive(on) { this.overdrive = on ? 0.85 : 1; }
  setKillcam(scale) { this.killcam = scale; this.killcamTarget = scale; }
  update(rawDt) {
    // rawDt is the real, clamped frame delta.
    // Ease hit-stop back toward 1 quickly.
    if (this._t < this.hitStopDur) {
      this._t += rawDt;
    } else {
      this.hitStop = 1;
    }
    // smooth killcam scale
    if (this.killcam !== this.killcamTarget) {
      const step = (this.killcamTarget - this.killcam) * Math.min(1, rawDt * 6);
      this.killcam += step;
      if (Math.abs(this.killcam - this.killcamTarget) < 0.001) this.killcam = this.killcamTarget;
    }
    // Resolved product. Guard against NaN (K4).
    let s = this.base * this.hitStop * this.overdrive * this.killcam;
    if (!Number.isFinite(s) || s <= 0) s = 1;
    // clamp to a sane band
    if (s < 0.02) s = 0.02;
    if (s > 2) s = 2;
    this.timeScale = s;
    return s;
  }
  // Scaled delta for gameplay.
  scaled(rawDt) { return rawDt * this.timeScale; }
  reset() {
    this.base = 1; this.hitStop = 1; this.hitStopTarget = 1; this.hitStopDur = 0;
    this.overdrive = 1; this.killcam = 1; this.killcamTarget = 1; this.timeScale = 1; this._t = 0;
  }
}
