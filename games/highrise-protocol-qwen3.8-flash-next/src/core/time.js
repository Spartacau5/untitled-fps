// K4: ONE time-scale manager. hit-stop + OVERDRIVE + kill-cam compose here only.
class TimeManager {
  constructor() {
    this.raw = 0;
    this.scaled = 0;
    this.elapsed = 0;      // world-simulated seconds (restart resets)
    this.paused = false;
    this.overdrive = false;
    this.killcam = 1;
    this._hsT = 0; this._hsDur = 0; this._hsFactor = 0.1;
  }
  reset() {
    this.raw = 0; this.scaled = 0; this.elapsed = 0;
    this.paused = false; this.overdrive = false; this.killcam = 1;
    this._hsT = 0; this._hsDur = 0;
  }
  /** H2: 2–3 frame hit-stop at ~0.1x on every kill. */
  requestHitstop(dur = 0.055, factor = 0.1) {
    if (dur >= this._hsT) { this._hsT = dur; this._hsDur = dur; this._hsFactor = factor; }
  }
  setOverdrive(on) { this.overdrive = !!on; }
  setKillcamScale(s) { this.killcam = Number.isFinite(s) ? s : 1; }
  /** Composed scale, NaN-guarded, clamped to [0, 1]. */
  scale() {
    if (this.paused) return 0;
    let s = this.killcam;
    if (this.overdrive) s *= 0.85;
    if (this._hsT > 0) s *= this._hsFactor;
    if (!Number.isFinite(s)) return 1;
    return Math.max(0, Math.min(1, s));
  }
  /** Called once per rAF with unmodified clock delta. Returns dt for world sim. */
  update(rawDt) {
    const d = Number.isFinite(rawDt) ? Math.min(Math.max(rawDt, 0), 0.05) : 0; // tab-switch clamp
    this.raw = d;
    if (this._hsT > 0) this._hsT = Math.max(0, this._hsT - d); // hit-stop drains on REAL time
    this.scaled = d * this.scale();
    this.elapsed += this.scaled;
    return this.scaled;
  }
  /** Real (unscaled) seconds since hit-stop started, for UI timing. */
  get inHitstop() { return this._hsT > 0; }
}
export const time = new TimeManager();
