// ---------------------------------------------------------------------------
// audio/ui.js — hit feedback, low-HP heartbeat, wave banner, death sting.
// Heartbeat: lub-dub sine thumps, interval tightens with HP (F8).
// ---------------------------------------------------------------------------
import { clamp } from '../core/spring.js';

export class UIAudio {
  constructor(bus) {
    this.bus = bus;
    this._beatT = 0;
    this.enabled = true;
  }

  reset() { this._beatT = 0; }

  heartbeat(dt, hp) {
    if (!this.enabled || !this.bus.ready) return;
    if (hp >= 35 || hp <= 0) { this._beatT = 0; return; }
    this._beatT -= dt;
    if (this._beatT <= 0) {
      const urgency = 1 - clamp(hp / 35, 0, 1);
      this._beatT = 1.05 - urgency * 0.4;
      const g = 0.28 + urgency * 0.3;
      this.bus.osc({ type: 'sine', f0: 58, f1: 40, dur: 0.11, gain: g, priority: 1 });
      this.bus.osc({ type: 'sine', f0: 52, f1: 36, dur: 0.1, gain: g * 0.8, priority: 1, at: 0.24 });
    }
  }

  playerHurt() {
    this.bus.noise({ dur: 0.09, type: 'lowpass', f0: 700, f1: 200, gain: 0.4, priority: 2 });
    this.bus.osc({ type: 'sine', f0: 180, f1: 70, dur: 0.12, gain: 0.3, priority: 2 });
  }

  waveBanner() {
    this.bus.noise({ dur: 0.42, type: 'lowpass', f0: 220, f1: 1400, gain: 0.28, priority: 2 });
    this.bus.osc({ type: 'sine', f0: 90, f1: 160, dur: 0.35, gain: 0.2, priority: 2 });
  }

  death() {
    this.bus.osc({ type: 'sine', f0: 220, f1: 55, dur: 0.9, gain: 0.4, priority: 2 });
    this.bus.noise({ dur: 0.7, type: 'lowpass', f0: 900, f1: 120, gain: 0.25, priority: 2 });
  }

  reloadStart() {
    this.bus.noise({ dur: 0.03, type: 'highpass', f0: 3000, gain: 0.14, priority: 1 });
  }

  land(strength) {
    const g = Math.min(0.34, 0.08 + strength * 0.02);
    this.bus.noise({ dur: 0.13, type: 'lowpass', f0: 320, f1: 110, gain: g, priority: 1 });
  }

  step(alt) {
    if (!this.bus.ready) return;
    this.bus.noise({
      dur: 0.045, type: 'lowpass', f0: alt ? 240 : 210, f1: 90,
      gain: 0.05, priority: 0,
    });
  }
}
