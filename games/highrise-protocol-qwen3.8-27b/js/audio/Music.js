// D5: procedural layered soundtrack — kick, hats, bass pulse, pad.
// Intensity ramps with wave number, active enemy count and combo state;
// drops to a low pad between waves. Lookahead scheduler (standard WebAudio).
export class Music {
  constructor(audio) {
    this.audio = audio;
    this.intensity = 0;        // 0..1
    this.betweenWaves = true;
    this.bpm = 100;
    this.step = 0;             // 16th-note step
    this.nextNoteTime = 0;
    this.timer = null;
    this.padOscs = [];
    this.padGain = null;
    this.chordStep = 0;
    this.chords = [
      [110, 164.81, 220],     // A
      [87.31, 130.81, 174.61],// F
      [98, 146.83, 196],      // G
      [73.42, 110, 146.83],   // D
    ];
  }

  start() {
    if (!this.audio.ready || this.timer) return;
    this.nextNoteTime = this.audio.now() + 0.1;
    this._startPad();
    this.timer = setInterval(() => this._schedule(), 25);
  }
  stop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this._stopPad();
  }
  setIntensity(v) { this.intensity = Math.max(0, Math.min(1, v)); }
  setBetweenWaves(b) { this.betweenWaves = b; }

  _startPad() {
    const ctx = this.audio.ctx;
    if (!ctx) return;
    this.padGain = ctx.createGain();
    this.padGain.gain.value = 0.0;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    this.padGain.connect(f); f.connect(this.audio.musicBus);
    this.padFilter = f;
    this._setChord(0);
  }
  _stopPad() {
    if (this.padGain) { this.padGain.disconnect(); this.padGain = null; }
    for (const o of this.padOscs) { try { o.stop(); } catch (e) {} o.disconnect(); }
    this.padOscs = [];
  }
  _setChord(i) {
    const ctx = this.audio.ctx;
    if (!ctx || !this.padGain) return;
    for (const o of this.padOscs) { try { o.stop(); } catch (e) {} o.disconnect(); }
    this.padOscs = [];
    const chord = this.chords[i % this.chords.length];
    for (const freq of chord) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = freq;
      o.detune.value = (Math.random() - 0.5) * 8;
      const g = ctx.createGain(); g.gain.value = 0.12;
      o.connect(g); g.connect(this.padGain);
      o.start();
      this.padOscs.push(o);
    }
  }

  _schedule() {
    const ctx = this.audio.ctx;
    if (!ctx) return;
    // pad intensity follows overall intensity
    if (this.padGain) {
      const target = this.betweenWaves ? 0.15 : 0.08 + this.intensity * 0.14;
      this.padGain.gain.value += (target - this.padGain.gain.value) * 0.05;
    }
    const spb = 60 / this.bpm / 4; // 16th
    while (this.nextNoteTime < ctx.currentTime + 0.12) {
      this._playStep(this.step, this.nextNoteTime);
      this.nextNoteTime += spb;
      this.step = (this.step + 1) % 32;
      // change chord every 2 bars (32 steps)
      if (this.step === 0) this._setChord(++this.chordStep);
    }
  }

  _playStep(step, t) {
    const i = this.intensity;
    const inCombat = !this.betweenWaves;
    // KICK: beat 1 & 3 (steps 0, 8, 16, 24) when in combat
    if (inCombat && i > 0.25 && (step === 0 || step === 8 || (i > 0.5 && step === 16) || (i > 0.8 && step === 24))) {
      this._kick(t, 0.5 + i * 0.4);
    }
    // between waves: a soft kick each bar
    if (this.betweenWaves && step === 0) this._kick(t, 0.2);
    // HATS: off-beats when intense
    if (inCombat && i > 0.5 && (step % 4 === 2)) this._hat(t, 0.08 + i * 0.1);
    if (inCombat && i > 0.8 && (step % 2 === 1)) this._hat(t, 0.05, true);
    // BASS pulse on 1 & 3
    if (inCombat && (step === 0 || step === 16)) {
      const chord = this.chords[this.chordStep % this.chords.length];
      this._bass(t, chord[0], 0.3 + i * 0.3);
    }
  }

  _kick(t, vol) {
    const ctx = this.audio.ctx;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    o.connect(g); g.connect(this.audio.musicBus);
    o.start(t); o.stop(t + 0.24);
  }
  _hat(t, vol, open = false) {
    const ctx = this.audio.ctx;
    const s = ctx.createBufferSource();
    s.buffer = this.audio._noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 8000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (open ? 0.12 : 0.04));
    s.connect(f); f.connect(g); g.connect(this.audio.musicBus);
    s.start(t); s.stop(t + (open ? 0.14 : 0.06));
  }
  _bass(t, freq, vol) {
    const ctx = this.audio.ctx;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = freq;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(f); f.connect(g); g.connect(this.audio.musicBus);
    o.start(t); o.stop(t + 0.28);
  }

  update(dt) {
    // bpm follows intensity
    const target = this.betweenWaves ? 90 : 108 + this.intensity * 40;
    this.bpm += (target - this.bpm) * Math.min(1, dt * 0.5);
  }
}
