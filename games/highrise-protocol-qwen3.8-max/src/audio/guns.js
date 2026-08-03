// ---------------------------------------------------------------------------
// audio/guns.js — layered synth gunshot (F8): click attack + low thump +
// short room tail. Distinct distant enemy report. Hit/kill/headshot confirms.
// ---------------------------------------------------------------------------

export class Guns {
  constructor(bus, rng) {
    this.bus = bus;
    this.rng = rng;
  }

  playerShot() {
    const b = this.bus, r = this.rng;
    if (!b.ready) return;
    const j = r.range(0.94, 1.06); // per-shot variation
    // 1. click attack
    b.noise({ dur: 0.022, type: 'highpass', f0: 3200 * j, gain: 0.5, priority: 2 });
    // 2. crack body
    b.noise({ dur: 0.085, type: 'bandpass', f0: 950 * j, f1: 320, q: 0.9, gain: 0.6, priority: 2 });
    // 3. low thump
    b.osc({ type: 'triangle', f0: 165 * j, f1: 44, dur: 0.12, gain: 0.95, priority: 2 });
    // 4. short room tail
    b.noise({ dur: 0.2, type: 'lowpass', f0: 520, f1: 180, gain: 0.16, priority: 0 });
  }

  enemyShot(dist) {
    const b = this.bus, r = this.rng;
    if (!b.ready) return;
    const g = Math.max(0.12, 0.5 - dist * 0.012);
    const j = r.range(0.9, 1.1);
    b.osc({ type: 'triangle', f0: 120 * j, f1: 40, dur: 0.14, gain: g, priority: 0 });
    b.noise({ dur: 0.16, type: 'bandpass', f0: 500 * j, f1: 200, q: 0.8, gain: g * 0.7, priority: 0 });
  }

  hit(killed, headshot) {
    const b = this.bus;
    if (!b.ready) return;
    if (killed) {
      // deep confirm "thock"
      b.osc({ type: 'sine', f0: 250, f1: 88, dur: 0.07, gain: 0.55, priority: 2 });
      b.noise({ dur: 0.03, type: 'highpass', f0: 2400, gain: 0.3, priority: 2 });
      if (headshot) b.osc({ type: 'sine', f0: 2450, f1: 1900, dur: 0.09, gain: 0.34, priority: 2, at: 0.02 });
    } else {
      // crisp tick
      b.osc({ type: 'square', f0: headshot ? 2500 : 1900, f1: headshot ? 2100 : 1650,
        dur: 0.028, gain: headshot ? 0.32 : 0.22, priority: 2 });
    }
  }
}
