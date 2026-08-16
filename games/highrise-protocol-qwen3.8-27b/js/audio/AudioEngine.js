// K1/F8: WebAudio only after first gesture. ONE master bus with soft clip so
// full combat never distorts. All sounds are procedural synth (C1, no assets).
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.ready = false;
    this.master = null;
    this.musicBus = null;
    this.sfxBus = null;
    this.muffleFilter = null;
    this._noiseBuf = null;
    this._longNoise = null;
    this._duck = 0;
    this.muffled = 0; // 0..1
    this.heartbeatT = 0;
    this.lowHp = false;
  }

  // Must be called from a user gesture (K1).
  init() {
    if (this.ready) { this.ctx.resume?.(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.ctx.resume?.();
    // master bus
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    // soft clip
    this.shaper = this.ctx.createWaveShaper();
    this.shaper.curve = this._softClipCurve(3);
    this.shaper.oversample = '2x';
    // gentle limiter
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -12;
    this.comp.knee.value = 12;
    this.comp.ratio.value = 4;
    this.comp.attack.value = 0.003;
    this.comp.release.value = 0.15;
    // muffle (lowpass) for low HP
    this.muffleFilter = this.ctx.createBiquadFilter();
    this.muffleFilter.type = 'lowpass';
    this.muffleFilter.frequency.value = 20000;

    this.master.connect(this.shaper);
    this.shaper.connect(this.comp);
    this.comp.connect(this.muffleFilter);
    this.muffleFilter.connect(this.ctx.destination);

    // buses
    this.sfxBus = this.ctx.createGain();
    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = 0.5;
    this.sfxBus.connect(this.master);
    this.musicBus.connect(this.master);

    // spatial tail: procedural impulse response → convolver. SFX route a
    // fraction of their output through the "wet" bus so shots, mags and
    // bolts get a rooftop-sounding reverb tail.
    this.wetBus = this.ctx.createGain();
    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this._makeIR(0.7, 2.6);
    const rg = this.ctx.createGain(); rg.gain.value = 0.32;
    this.wetBus.connect(this.reverb);
    this.reverb.connect(rg);
    rg.connect(this.master);

    this._noiseBuf = this._makeNoise(0.5);
    this._longNoise = this._makeNoise(2.0);
    this.ready = true;
  }

  // Route a gain node to the dry SFX bus and (optionally) the reverb tail.
  _route(g, wet = 0.25) {
    g.connect(this.sfxBus);
    if (wet > 0) {
      const w = this.ctx.createGain(); w.gain.value = wet;
      g.connect(w); w.connect(this.wetBus);
    }
  }

  // Procedural impulse response: early reflections + decaying noise wash.
  _makeIR(dur, decayPow) {
    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * dur);
    const buf = this.ctx.createBuffer(2, len, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decayPow) * 0.4;
      }
      // early reflections: a handful of small spikes in the first 5%
      for (let r = 0; r < 10; r++) {
        const at = Math.floor(Math.random() * len * 0.05);
        d[at] += (Math.random() * 2 - 1) * 0.3 * Math.random();
      }
    }
    return buf;
  }

  _softClipCurve(k) {
    const n = 1024, curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = Math.tanh(k * x) / Math.tanh(k);
    }
    return curve;
  }
  _makeNoise(dur) {
    const len = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  now() { return this.ctx ? this.ctx.currentTime : 0; }

  _src(buf, loop = false) {
    const s = this.ctx.createBufferSource();
    s.buffer = buf; s.loop = loop;
    return s;
  }

  // ---- F8: layered 5.56 report. Crack + pop + body thump, shot-to-shot
  // variation, and a rooftop reverb tail through the wet bus. ----
  gunshot(pitch = 1.0, vol = 1.0) {
    if (!this.ready) return;
    const t = this.now();
    const j = 0.92 + Math.random() * 0.16; // per-shot jitter so no two shots match
    // 1) supersonic crack — bright noise, 2ms attack, 45ms decay
    const crack = this._src(this._noiseBuf);
    const cf = this.ctx.createBiquadFilter(); cf.type = 'bandpass';
    cf.frequency.setValueAtTime(3800 * pitch * j, t);
    cf.frequency.exponentialRampToValueAtTime(1600 * pitch, t + 0.04);
    cf.Q.value = 0.9;
    const cg = this.ctx.createGain();
    cg.gain.setValueAtTime(0.0001, t);
    cg.gain.exponentialRampToValueAtTime(0.55 * vol, t + 0.002);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    crack.connect(cf);
    crack.start(t); crack.stop(t + 0.06);
    this._route(cg, 0.5);
    // 2) pop — the muzzle "thwack"
    const pop = this._src(this._noiseBuf);
    const pf = this.ctx.createBiquadFilter(); pf.type = 'bandpass'; pf.frequency.value = 950 * pitch * j; pf.Q.value = 1.4;
    const pg = this.ctx.createGain();
    pg.gain.setValueAtTime(0.0001, t);
    pg.gain.exponentialRampToValueAtTime(0.4 * vol, t + 0.003);
    pg.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    pop.connect(pf);
    pop.start(t); pop.stop(t + 0.08);
    this._route(pg, 0.3);
    // 3) body — pitch-dropping sine, the weight of the report
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150 * pitch * j, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    const og = this.ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.85 * vol, t + 0.004);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    osc.connect(og);
    osc.start(t); osc.stop(t + 0.22);
    this._route(og, 0.35);
    // 4) mid thud — chest feel
    const mid = this.ctx.createOscillator();
    mid.type = 'triangle';
    mid.frequency.setValueAtTime(95 * j, t);
    mid.frequency.exponentialRampToValueAtTime(55, t + 0.07);
    const mg = this.ctx.createGain();
    mg.gain.setValueAtTime(0.0001, t);
    mg.gain.exponentialRampToValueAtTime(0.4 * vol, t + 0.003);
    mg.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    mid.connect(mg);
    mid.start(t); mid.stop(t + 0.12);
    this._route(mg, 0.2);
    // duck music slightly under gunfire (D5)
    this._duck = Math.min(1, this._duck + 0.4);
  }

  // Distant enemy weapon report — quieter, duller, more reverb
  enemyShot(vol = 0.6) {
    if (!this.ready) return;
    const t = this.now();
    const j = 0.8 + Math.random() * 0.3;
    const crack = this._src(this._noiseBuf);
    const cf = this.ctx.createBiquadFilter(); cf.type = 'bandpass';
    cf.frequency.setValueAtTime(2600 * j, t);
    cf.frequency.exponentialRampToValueAtTime(900, t + 0.05);
    cf.Q.value = 0.8;
    const cg = this.ctx.createGain();
    cg.gain.setValueAtTime(0.0001, t);
    cg.gain.exponentialRampToValueAtTime(0.16 * vol, t + 0.002);
    cg.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    crack.connect(cf);
    crack.start(t); crack.stop(t + 0.08);
    this._route(cg, 0.7);
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(110 * j, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.16);
    const og = this.ctx.createGain();
    og.gain.setValueAtTime(0.0001, t);
    og.gain.exponentialRampToValueAtTime(0.3 * vol, t + 0.004);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(og);
    osc.start(t); osc.stop(t + 0.26);
    this._route(og, 0.7);
  }

  // Sonic crack from near-miss bullets
  nearMiss() {
    if (!this.ready) return;
    const t = this.now();
    const s = this._src(this._noiseBuf);
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = 2.0;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    s.connect(f); f.connect(g); g.connect(this.sfxBus);
    s.start(t); s.stop(t + 0.1);
  }

  // H2: hit tick / kill thock
  hitTick(headshot = false) {
    if (!this.ready) return;
    const t = this.now();
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    const f0 = headshot ? 1400 : 900;
    osc.frequency.setValueAtTime(f0, t);
    osc.frequency.exponentialRampToValueAtTime(f0 * 0.6, t + 0.05);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(headshot ? 0.5 : 0.3, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    osc.connect(g); g.connect(this.sfxBus);
    osc.start(t); osc.stop(t + 0.08);
    if (headshot) {
      // wet crack
      const s = this._src(this._noiseBuf);
      const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 1;
      const wg = this.ctx.createGain();
      wg.gain.setValueAtTime(0.35, t);
      wg.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      s.connect(f); f.connect(wg); wg.connect(this.sfxBus);
      s.start(t); s.stop(t + 0.1);
    }
  }

  killThock() {
    if (!this.ready) return;
    const t = this.now();
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.18);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.6, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g); g.connect(this.sfxBus);
    osc.start(t); osc.stop(t + 0.25);
    // body thud
    const s = this._src(this._noiseBuf);
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0.4, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    s.connect(f); f.connect(g2); g2.connect(this.sfxBus);
    s.start(t); s.stop(t + 0.14);
  }

  // ---- Reload sounds (R2), driven by viewmodel events so they land exactly
  // on the animation beats. R4: pitch up during OVERDRIVE. ----

  // Ratchet: mag catch released — two quick low ticks
  magRelease(pitch = 1) {
    this._click(950 * pitch, 0.14, 0.016, 0.12);
    this._click(700 * pitch, 0.1, 0.014, 0.12, 0.022);
  }
  // Mag pops out and falls — soft thump + descending metal rattle
  magEject(pitch = 1) {
    if (!this.ready) return;
    const t = this.now();
    const thump = this.ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(130 * pitch, t);
    thump.frequency.exponentialRampToValueAtTime(65, t + 0.05);
    const tg = this.ctx.createGain();
    tg.gain.setValueAtTime(0.0001, t);
    tg.gain.exponentialRampToValueAtTime(0.3, t + 0.003);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    thump.connect(tg); thump.start(t); thump.stop(t + 0.09);
    this._route(tg, 0.15);
    // rattle: three small descending metal pings as the mag tumbles
    [0, 0.07, 0.15].forEach((d, i) => {
      this._ping((1500 - i * 320) * pitch, 0.07 - i * 0.015, 0.05, 0.12, d + 0.04);
    });
  }
  // Fresh mag slams home — the signature "chak": sharp noise bite + steel ping + thump
  magInsert(pitch = 1) {
    if (!this.ready) return;
    const t = this.now();
    const bite = this._src(this._noiseBuf);
    const bf = this.ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = 1250 * pitch; bf.Q.value = 2.2;
    const bg = this.ctx.createGain();
    bg.gain.setValueAtTime(0.0001, t);
    bg.gain.exponentialRampToValueAtTime(0.55, t + 0.003);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    bite.connect(bf);
    bite.start(t); bite.stop(t + 0.07);
    this._route(bg, 0.12);
    this._ping(860 * pitch, 0.26, 0.09, 0.1, 0.004);
    const thump = this.ctx.createOscillator();
    thump.type = 'sine';
    thump.frequency.setValueAtTime(165 * pitch, t);
    thump.frequency.exponentialRampToValueAtTime(85, t + 0.05);
    const tg = this.ctx.createGain();
    tg.gain.setValueAtTime(0.0001, t);
    tg.gain.exponentialRampToValueAtTime(0.4, t + 0.002);
    tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    thump.connect(tg); thump.start(t); thump.stop(t + 0.1);
    this._route(tg, 0.12);
  }
  // Bolt carrier pulled back — slide "shk" ending in a dull clunk
  boltBack(pitch = 1) {
    if (!this.ready) return;
    const t = this.now();
    const s = this._src(this._noiseBuf);
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(750 * pitch, t);
    f.frequency.exponentialRampToValueAtTime(380 * pitch, t + 0.09);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    s.connect(f); f.connect(g);
    s.start(t); s.stop(t + 0.12);
    this._route(g, 0.1);
    this._click(420 * pitch, 0.3, 0.03, 0.12, 0.1);
  }
  // Bolt slams forward — sharp clack + high steel ping
  boltFwd(pitch = 1, vol = 1) {
    this._click(1600 * pitch, 0.4 * vol, 0.012, 0.1);
    this._ping(2250 * pitch, 0.2 * vol, 0.07, 0.1, 0.006);
    this._click(300 * pitch, 0.22 * vol, 0.03, 0.12, 0.004);
  }
  // Bolt release after rack — small ratchet tick
  reloadDone(pitch = 1) { this._click(1150 * pitch, 0.12, 0.02, 0.1); }
  // Empty chamber: bolt slams forward on its own
  dryfireBolt(pitch = 1) { this.boltFwd(pitch, 0.55); this._click(700, 0.12, 0.02, 0.1, 0.03); }

  _click(freq, vol, dur, wet = 0.15, delay = 0) {
    if (!this.ready) return;
    const t = this.now() + delay;
    const s = this._src(this._noiseBuf);
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 3;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g);
    s.start(t); s.stop(t + dur + 0.02);
    this._route(g, wet);
  }
  // Short metallic ping (sine with fast decay + a harmonic)
  _ping(freq, vol, dur, wet = 0.15, delay = 0) {
    if (!this.ready) return;
    const t = this.now() + delay;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.92, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    osc.start(t); osc.stop(t + dur + 0.02);
    this._route(g, wet);
    // inharmonic partial for the "steel" character
    const o2 = this.ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = freq * 2.76;
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(vol * 0.3, t + 0.002);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.5);
    o2.connect(g2);
    o2.start(t); o2.stop(t + dur * 0.5 + 0.02);
    this._route(g2, wet);
  }

  // F4: metallic tinkle on shell bounce
  shellTinkle() {
    if (!this.ready) return;
    const t = this.now();
    const freq = 2600 + Math.random() * 1800;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    osc.connect(g); g.connect(this.sfxBus);
    osc.start(t); osc.stop(t + 0.16);
  }

  dryfire() { this.dryfireBolt(1); }
  uiClick() { this._click(1400, 0.15, 0.03); }

  // ADS engage: soft cloth/mechanical swoosh up + optic seating click
  adsIn() {
    if (!this.ready) return;
    const t = this.now();
    const s = this._src(this._noiseBuf);
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.9;
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(950, t + 0.09);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    s.connect(f); f.connect(g);
    s.start(t); s.stop(t + 0.14);
    this._route(g, 0.2);
    this._click(1900, 0.08, 0.012, 0.1, 0.05);
  }
  // ADS release: click first, then a softer downward swoosh
  adsOut() {
    if (!this.ready) return;
    this._click(1400, 0.07, 0.012, 0.1, 0.0);
    const t = this.now();
    const s = this._src(this._noiseBuf);
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.9;
    f.frequency.setValueAtTime(800, t);
    f.frequency.exponentialRampToValueAtTime(250, t + 0.1);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.035);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
    s.connect(f); f.connect(g);
    s.start(t); s.stop(t + 0.15);
    this._route(g, 0.2);
  }

  damageThump() {
    if (!this.ready) return;
    const t = this.now();
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.7, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(g); g.connect(this.sfxBus);
    osc.start(t); osc.stop(t + 0.32);
  }

  // D2/D3: stings
  overdriveSting() {
    if (!this.ready) return;
    const t = this.now();
    const notes = [440, 660, 880, 1320];
    notes.forEach((n, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = n;
      const g = this.ctx.createGain();
      const st = t + i * 0.04;
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.2, st + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.3);
      const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 4000;
      osc.connect(f); f.connect(g); g.connect(this.sfxBus);
      osc.start(st); osc.stop(st + 0.32);
    });
  }
  multikillSting() {
    if (!this.ready) return;
    const t = this.now();
    [520, 780].forEach((n, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = n;
      const g = this.ctx.createGain();
      const st = t + i * 0.05;
      g.gain.setValueAtTime(0.0001, st);
      g.gain.exponentialRampToValueAtTime(0.25, st + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, st + 0.2);
      const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 3000;
      osc.connect(f); f.connect(g); g.connect(this.sfxBus);
      osc.start(st); osc.stop(st + 0.22);
    });
  }
  waveStartSting() {
    if (!this.ready) return;
    const t = this.now();
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.4);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2000;
    osc.connect(f); f.connect(g); g.connect(this.sfxBus);
    osc.start(t); osc.stop(t + 0.62);
  }

  // W2: ambient bed — distant city hum + wind under everything. Loops quietly.
  startAmbient() {
    if (!this.ready || this._ambientStarted) return;
    this._ambientStarted = true;
    const ctx = this.ctx;
    // wind: looped noise through a slowly-modulated lowpass
    const wind = this._src(this._longNoise, true);
    const wf = ctx.createBiquadFilter(); wf.type = 'bandpass'; wf.frequency.value = 400; wf.Q.value = 0.5;
    const wg = ctx.createGain(); wg.gain.value = 0.05;
    wind.connect(wf); wf.connect(wg); wg.connect(this.musicBus);
    wind.start();
    // LFO on wind filter for gusts
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.08;
    const lfoG = ctx.createGain(); lfoG.gain.value = 220;
    lfo.connect(lfoG); lfoG.connect(wf.frequency); lfo.start();
    // city hum: low filtered noise, very quiet
    const hum = this._src(this._longNoise, true);
    const hf = ctx.createBiquadFilter(); hf.type = 'lowpass'; hf.frequency.value = 120;
    const hg = ctx.createGain(); hg.gain.value = 0.03;
    hum.connect(hf); hf.connect(hg); hg.connect(this.musicBus);
    hum.start();
    this._ambientNodes = [wind, lfo, hum, wf, hf, wg, hg, lfoG];
  }

  // F8: low-HP heartbeat, driven each frame
  update(dt) {
    if (!this.ready) return;
    // muffle at low HP
    const target = this.lowHp ? 1 : 0;
    this.muffled += (target - this.muffled) * Math.min(1, dt * 4);
    if (this.muffleFilter) {
      this.muffleFilter.frequency.value = 20000 * (1 - this.muffled) + 900 * this.muffled;
    }
    // duck music under gunfire
    if (this.musicBus) {
      this._duck *= Math.exp(-dt * 5);
      const g = 1 - this._duck * 0.45;
      this.musicBus.gain.value += (g * 0.5 - this.musicBus.gain.value) * Math.min(1, dt * 8);
    }
    // heartbeat
    if (this.lowHp) {
      this.heartbeatT -= dt;
      if (this.heartbeatT <= 0) {
        this.heartbeatT = 0.9;
        this._thump(0.5);
        setTimeout(() => this._thump(0.35), 160);
      }
    }
  }
  _thump(vol) {
    if (!this.ready) return;
    const t = this.now();
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.18);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc.connect(g); g.connect(this.sfxBus);
    osc.start(t); osc.stop(t + 0.24);
  }

  setLowHp(on) { this.lowHp = on; if (on) this.heartbeatT = 0; }
  pause() { this.ctx && this.ctx.suspend?.(); }
  resume() { this.ctx && this.ctx.resume?.(); }
  dispose() { this.ctx && this.ctx.close?.(); this.ctx = null; this.ready = false; }
}
