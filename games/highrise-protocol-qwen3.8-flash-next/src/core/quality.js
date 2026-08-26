import { bus } from './bus.js';

// G3/P2: quality presets, DPR clamp, auto-degrade if frame budget threatened.
class Quality {
  constructor() {
    this.mode = 'high';
    this.auto = true;
    this.fpsAvg = 60;
    this.flags = {};
    this.apply();
  }
  dpr() { return Math.min(window.devicePixelRatio || 1, 2); }
  apply() {
    const low = this.mode === 'low';
    this.flags = {
      bloom: !low,
      grade: true,
      vignette: !low,
      ca: !low,
      grain: !low,
      smear: !low,
      godrays: !low,
      motes: !low,
      shadows: !low,
      particleScale: low ? 0.45 : 1,
      decalCap: low ? 96 : 256,
      bloodCap: low ? 96 : 224,
      tracerCap: low ? 20 : 40,
      shellCap: low ? 12 : 24,
      ragdollCap: low ? 4 : 8,
    };
  }
  set(m) {
    if (m === this.mode) return;
    this.mode = m; this.apply();
    bus.emit('quality:change', m);
  }
  toggle() { this.auto = false; this.set(this.mode === 'high' ? 'low' : 'high'); }
  tick(fps) {
    this.fpsAvg = this.fpsAvg * 0.95 + fps * 0.05;
    if (this.auto && this.mode === 'high' && this.fpsAvg < 45) this.set('low');
  }
}
export const quality = new Quality();
