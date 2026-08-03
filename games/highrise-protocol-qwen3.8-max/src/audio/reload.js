// ---------------------------------------------------------------------------
// audio/reload.js — the reload Foley, synced to the timeline events (R2):
// release click, mag-out, mag-in thunk, bolt rack. Plus shell tinkles and
// ejected-mag clatter with distance attenuation.
// ---------------------------------------------------------------------------

export class ReloadAudio {
  constructor(bus, rng) {
    this.bus = bus;
    this.rng = rng;
  }

  release() { // phase 1 start: mag release click
    this.bus.noise({ dur: 0.028, type: 'highpass', f0: 2600, gain: 0.3, priority: 2 });
    this.bus.osc({ type: 'square', f0: 720, f1: 500, dur: 0.03, gain: 0.16, priority: 2 });
  }

  magOut() {
    this.bus.noise({ dur: 0.09, type: 'bandpass', f0: 640, f1: 260, q: 1.2, gain: 0.3, priority: 2 });
  }

  magIn() { // the slam: solid thunk
    const j = this.rng.range(0.95, 1.05);
    this.bus.osc({ type: 'sine', f0: 195 * j, f1: 68, dur: 0.085, gain: 0.8, priority: 2 });
    this.bus.noise({ dur: 0.035, type: 'highpass', f0: 1800, gain: 0.35, priority: 2 });
  }

  boltBack() {
    this.bus.noise({ dur: 0.045, type: 'bandpass', f0: 2400, f1: 1200, q: 7, gain: 0.4, priority: 2 });
    this.bus.osc({ type: 'square', f0: 1250, f1: 800, dur: 0.03, gain: 0.14, priority: 2 });
  }

  boltHome() { // metallic clack
    this.bus.noise({ dur: 0.04, type: 'bandpass', f0: 1900, f1: 900, q: 8, gain: 0.5, priority: 2 });
    this.bus.osc({ type: 'square', f0: 900, f1: 620, dur: 0.035, gain: 0.2, priority: 2 });
  }

  shellTink(dist) {
    const g = Math.max(0.02, 0.2 - dist * 0.01);
    this.bus.osc({ type: 'sine', f0: this.rng.range(3800, 4700), f1: 3000, dur: 0.05, gain: g, priority: 0 });
  }

  magClatter(dist) {
    const g = Math.max(0.04, 0.34 - dist * 0.012);
    this.bus.noise({ dur: 0.07, type: 'bandpass', f0: 900, f1: 400, q: 2, gain: g, priority: 0 });
    this.bus.osc({ type: 'sine', f0: 240, f1: 110, dur: 0.06, gain: g * 0.9, priority: 0 });
  }

  plateClank(dist) {
    const g = Math.max(0.05, 0.4 - dist * 0.013);
    this.bus.noise({ dur: 0.06, type: 'bandpass', f0: 1700, f1: 700, q: 5, gain: g, priority: 1 });
    this.bus.osc({ type: 'triangle', f0: 520, f1: 180, dur: 0.09, gain: g * 0.8, priority: 1 });
  }
}
