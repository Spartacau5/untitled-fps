// Fixed-timestep accumulator. The sim advances in exact `tick` slices no matter
// the display refresh rate; the renderer interpolates between the last two sim
// states using the returned alpha.
export class FixedLoop {
  constructor({ tick = 1 / 60, maxSteps = 5 } = {}) {
    this.tick = tick;
    this.maxSteps = maxSteps;
    this.accumulator = 0;
  }
  // frameDt: wall seconds since last frame. timeScale: 1 = realtime, <1 = slow-mo.
  // Calls stepFn(tick) zero or more times. Returns alpha in [0,1) for render interpolation.
  advance(frameDt, timeScale, stepFn) {
    this.accumulator += frameDt * timeScale;
    let steps = 0;
    while (this.accumulator >= this.tick && steps < this.maxSteps) {
      stepFn(this.tick);
      this.accumulator -= this.tick;
      steps++;
    }
    // Spiral-of-death guard: if we hit the cap, drop the backlog instead of
    // trying to catch up next frame.
    if (steps === this.maxSteps && this.accumulator >= this.tick)
      this.accumulator = this.accumulator % this.tick;
    return this.accumulator / this.tick;
  }
}
