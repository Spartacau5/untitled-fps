export class TimeManager {
  constructor() {
    this.scale = 1;
    this.hitStopRemaining = 0;
    this.slowMo = 1;
    this.paused = false;
  }

  triggerHitStop(duration = 0.045, scale = 0.1) {
    this.hitStopRemaining = Math.max(this.hitStopRemaining, duration);
    this.slowMo = Math.min(this.slowMo, scale);
  }

  setPaused(value) { this.paused = Boolean(value); }

  step(realDt) {
    if (this.paused) return 0;
    const dt = Math.min(0.05, Math.max(0, realDt));
    if (this.hitStopRemaining > 0) {
      this.hitStopRemaining -= dt;
      if (this.hitStopRemaining <= 0) this.slowMo = 1;
    }
    this.scale = this.slowMo;
    return dt * this.scale;
  }
}
