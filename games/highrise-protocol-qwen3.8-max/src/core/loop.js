// ---------------------------------------------------------------------------
// core/loop.js — fixed-step 120 Hz simulation, interpolated rendering (C7).
// Delta time clamped; time-scale applied by the single TimeManager (K4).
// ---------------------------------------------------------------------------

export const STEP = 1 / 120;       // Hz-120 fixed simulation step
export const MAX_FRAME_DT = 0.1;   // clamp: tab-switch / hitch protection
export const MAX_STEPS = 6;        // spiral-of-death guard

export class Loop {
  constructor({ time, input, update, render }) {
    this.time = time;
    this.input = input;
    this.update = update;   // (stepDt) — simulation
    this.render = render;   // (alpha)  — interpolated draw
    this.acc = 0;
    this.last = -1;
    this.paused = false;
    this._raf = 0;
    this.frameMs = 8;
    this.fps = 60;
    this._bound = (t) => this._frame(t);
  }

  start() { this.last = -1; this._raf = requestAnimationFrame(this._bound); }

  stop() { cancelAnimationFrame(this._raf); }

  setPaused(v) {
    if (this.paused === v) return;
    this.paused = v;
    if (!v) this.last = -1; // no giant dt on resume
  }

  _frame(now) {
    this._raf = requestAnimationFrame(this._bound);
    if (this.last < 0) { this.last = now; return; }
    let dtReal = (now - this.last) / 1000;
    this.last = now;
    if (dtReal > MAX_FRAME_DT) dtReal = MAX_FRAME_DT;   // K4 clamp
    if (dtReal <= 0) return;
    this.frameMs = this.frameMs * 0.92 + (dtReal * 1000) * 0.08;
    this.fps = this.fps * 0.95 + (1 / dtReal) * 0.05;

    if (this.paused) { this.render(1); return; }        // frozen frame, no sim

    const dtSim = this.time.update(dtReal);
    this.acc += dtSim;
    if (this.acc > STEP * MAX_STEPS) this.acc = STEP * MAX_STEPS;

    let n = Math.floor(this.acc / STEP + 1e-6);
    if (n > MAX_STEPS) n = MAX_STEPS;
    this.input.beginSteps(n);
    for (let i = 0; i < n; i++) {
      this.input.nextStep();
      this.update(STEP);
      this.acc -= STEP;
    }
    this.render(this.acc / STEP);
  }
}
