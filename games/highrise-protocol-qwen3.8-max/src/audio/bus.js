// ---------------------------------------------------------------------------
// audio/bus.js — ONE master bus: gain -> soft-clip -> compressor (F8, K1).
// AudioContext created only after a user gesture. Sustained combat never
// distorts thanks to the tanh soft-clip stage.
// ---------------------------------------------------------------------------

export const TUNING = {
  MASTER_GAIN: 0.82,
  MAX_VOICES: 30,       // voice budget: drop new low-priority sounds beyond this
};

export class AudioBus {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.voices = 0;
    this.ready = false;
  }

  // Must be called from a user gesture (K1). Synthetic events (test harness)
  // carry no activation — creating the context then logs a browser warning,
  // so we refuse until a real activation exists.
  ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return true; }
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return false;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = TUNING.MASTER_GAIN;

    // soft clip curve
    const shaper = this.ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    const k = Math.tanh(1.6);
    for (let i = 0; i < 1024; i++) {
      const x = (i / 1023) * 2 - 1;
      curve[i] = Math.tanh(x * 1.6) / k;
    }
    shaper.curve = curve;
    shaper.oversample = '2x';

    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.knee.value = 18;
    comp.ratio.value = 5;
    comp.attack.value = 0.002;
    comp.release.value = 0.14;

    this.master.connect(shaper);
    shaper.connect(comp);
    comp.connect(this.ctx.destination);

    // precomputed white-noise buffer (reused by every noise voice)
    const len = this.ctx.sampleRate * 1.5;
    this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuf.getChannelData(0);
    let s = 0x9e3779b9;
    for (let i = 0; i < len; i++) {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), s | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      data[i] = (((t ^ (t >>> 14)) >>> 0) / 2147483648) - 1;
    }
    this.ready = true;
    return true;
  }

  suspend() { if (this.ctx && this.ctx.state === 'running') this.ctx.suspend(); }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  now() { return this.ctx ? this.ctx.currentTime : 0; }

  // Voice budget check: returns true if a voice may start.
  allow(priority = 1) {
    if (!this.ready) return false;
    if (this.voices >= TUNING.MAX_VOICES && priority < 2) return false;
    this.voices++;
    return true;
  }

  _track(node, dur) {
    const t = setTimeout(() => { this.voices = Math.max(0, this.voices - 1); }, (dur + 0.1) * 1000);
    if (t.unref) t.unref();
  }

  // --- voice builders ---------------------------------------------------------
  // Filtered noise burst with a decaying envelope.
  noise({ dur = 0.1, type = 'bandpass', f0 = 1000, f1 = 0, q = 1, gain = 0.3, at = 0, priority = 1 }) {
    if (!this.allow(priority)) return;
    const c = this.ctx, t0 = c.currentTime + at;
    const src = c.createBufferSource();
    src.buffer = this.noiseBuf;
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(Math.max(f0, 20), t0);
    if (f1 > 0) f.frequency.exponentialRampToValueAtTime(Math.max(f1, 20), t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    src.connect(f); f.connect(g); g.connect(this.master);
    src.start(t0, Math.random());
    src.stop(t0 + dur + 0.05);
    this._track(src, dur + at);
  }

  // Pitched oscillator sweep with envelope.
  osc({ type = 'sine', f0 = 440, f1 = 0, dur = 0.1, gain = 0.3, at = 0, priority = 1, curve = 'exp' }) {
    if (!this.allow(priority)) return;
    const c = this.ctx, t0 = c.currentTime + at;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(f0, 1), t0);
    if (f1 > 0) {
      if (curve === 'exp') o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), t0 + dur);
      else o.frequency.linearRampToValueAtTime(Math.max(f1, 1), t0 + dur);
    }
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    o.connect(g); g.connect(this.master);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
    this._track(o, dur + at);
  }
}
