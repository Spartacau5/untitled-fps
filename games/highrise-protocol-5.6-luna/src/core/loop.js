export class FixedLoop {
  constructor({ fixedHz = 120, update, render, time }) {
    this.fixedDt = 1 / fixedHz;
    this.update = update;
    this.render = render;
    this.time = time;
    this.accumulator = 0;
    this.previous = performance.now() / 1000;
    this.running = false;
    this.frame = this.frame.bind(this);
    this.stepCount = 0;
    this.frameMs = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.previous = performance.now() / 1000;
    requestAnimationFrame(this.frame);
  }

  frame(nowMs) {
    if (!this.running) return;
    const now = nowMs / 1000;
    const realDt = Math.min(0.05, Math.max(0, now - this.previous));
    this.previous = now;
    this.frameMs = realDt * 1000;
    this.accumulator += realDt;
    let steps = 0;
    while (this.accumulator >= this.fixedDt && steps < 8) {
      const dt = this.time.step(this.fixedDt);
      this.update(dt, this.fixedDt);
      this.accumulator -= this.fixedDt;
      steps += 1;
      this.stepCount += 1;
    }
    if (steps === 8) this.accumulator = 0;
    this.render(this.accumulator / this.fixedDt, realDt);
    requestAnimationFrame(this.frame);
  }

  stop() { this.running = false; }
}
