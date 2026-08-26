// src/audio/audio.js — HIGHRISE PROTOCOL audio (F8, R2/R4 stings, D5 music, K1, W2).
// Everything is procedural WebAudio synthesis. K1: NO AudioContext and ZERO audio
// nodes exist until unlock() is called from the START gesture (main wires this).
// Signal chain: sfx/music/amb -> sum -> muffleLP (D6 low-HP) -> busGain ->
// DynamicsCompressor (soft clip, thr -14, ratio 12) -> makeup -> destination.
// Music ducking: musicGain lowered by setDucking(x) + gunfire recency (D5).
// D5 scheduler: 16-step lookahead off AudioContext.currentTime driven by update(dt)
// (no setInterval). Overdrive pitch-up ×1.15 on reload mechanics (R4).
import { bus } from '../core/bus.js';
import { rng } from '../core/rng.js';
import { state } from '../core/state.js';
import { Spring } from '../core/spring.js';
import * as E from '../core/easings.js';

const clamp = (v, a, b) => (Number.isFinite(v) ? (v < a ? a : v > b ? b : v) : a);
const clamp01 = (v) => (Number.isFinite(v) ? E.clamp01(v) : 0); // NaN-proof 0..1 gate for external input

export function init(ctx) {
  // ---------- audio graph (all null until unlock) ----------
  let ac = null;
  let noise = null;                 // white-noise AudioBuffer
  let sum, muffle, busG, comp, makeup;              // sum -> muffle -> busG -> comp -> makeup -> dest
  let sfxIn, musicBus, musicG, ambIn;               // domain buses
  let windG, windF, humG;                           // W2 ambient bed (persistent)
  let padA1, padA2, padB1, padB2, padC1, padC2, padSub; // D5 pad voices (persistent)
  let padF, padG, droneO, droneF, droneG;
  let slideSrc, slideF, slideG;                     // slide cloth rasp (persistent, gated)

  // ---------- module state ----------
  let od = false;                    // OVERDRIVE active (R4 pitch + music layer)
  let duckHit = 0, duckExt = 0;      // gunfire-recency + external ducking levels
  let hbT = 0;                       // heartbeat accumulator
  let lastFoot = -1, lastTink = -1, lastCrack = -1;
  let slideReleaseAt = 0;            // ac time when rasp should fade out
  let suspended = false;
  const duckS = new Spring(0, 26, 1.0);
  const muffleS = new Spring(20000, 6, 1.1);
  const padBoostS = new Spring(0, 8, 1.3);      // wave-cleared swell
  const intenS = new Spring(0, 4, 1.0);         // music intensity ramp (C5, no raw lerp)
  let hasL = false;
  let lx = 0, ly = 0, lz = 0, fx = 0, fz = -1;

  // music scheduler state
  const mus = {
    next: 0, step: 0, bar: 0, inten: 0, target: 0,
  };
  // Am - F - C - G-ish loop (roots Hz, triad semitones).
  const PROG = [
    { r: 110.0, t: [0, 3, 7] },
    { r: 87.31, t: [0, 4, 7] },
    { r: 130.81, t: [0, 4, 7] },
    { r: 98.0, t: [0, 4, 7] },
  ];
  const riffs = []; // 4 seeded 16-step bass patterns (-1 rest, else semitone offset)
  const ARP = [];   // od arp note order (indices into triad)

  // ---------- tiny helpers ----------
  const now = () => ac.currentTime;
  const mk = (v) => { const x = ac.createGain(); x.gain.value = v; return x; };
  const reap = (nodes) => { for (let i = 0; i < nodes.length; i++) { try { nodes[i].disconnect(); } catch (_) { /* already gone */ } } };

  function noiseSrc(t0, dur, rate) {
    const s = ac.createBufferSource();
    s.buffer = noise; s.loop = true;
    if (rate) s.playbackRate.value = rate;
    s.start(t0, rng.range(0, 1.6));
    s.stop(t0 + dur);
    return s;
  }

  /** Amp envelope node: silence -> peak (exp attack) -> silence (exp decay). */
  function amp(t0, atk, peak, dur) {
    const x = mk(1e-4);
    const p = x.gain;
    p.setValueAtTime(1e-4, t0);
    p.exponentialRampToValueAtTime(Math.max(peak, 1e-3), t0 + Math.max(atk, 0.001));
    p.exponentialRampToValueAtTime(1e-4, t0 + Math.max(atk, 0.001) + dur);
    return x;
  }

  /** One-shot filtered noise burst with sweep. f1 set => freq ramps f0->f1. */
  function noiseVoice(t0, dur, dest, o) {
    const s = noiseSrc(t0, dur + 0.03, o.rate);
    const bq = ac.createBiquadFilter();
    bq.type = o.filter || 'lowpass';
    bq.Q.value = o.q || 0.8;
    bq.frequency.setValueAtTime(o.f0, t0);
    if (o.f1) bq.frequency.exponentialRampToValueAtTime(Math.max(o.f1, 20), t0 + dur);
    const a = amp(t0, o.atk || 0.002, o.peak, dur);
    s.connect(bq).connect(a).connect(dest);
    s.onended = () => reap([s, bq, a]);
    return a;
  }

  /** One-shot oscillator tone with exponential pitch sweep f0->f1. */
  function toneVoice(t0, dur, dest, type, f0, f1, peak, atk, filt) {
    const o = ac.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(Math.max(f0, 1), t0);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1 || f0, 1), t0 + dur * 0.85);
    let tail = o;
    const list = [o];
    if (filt) {
      const bq = ac.createBiquadFilter();
      bq.type = filt.type || 'lowpass';
      bq.frequency.value = filt.f;
      bq.Q.value = filt.q || 1;
      o.connect(bq); tail = bq; list.push(bq);
    }
    const a = amp(t0, atk == null ? 0.003 : atk, peak, dur);
    tail.connect(a).connect(dest);
    o.onended = () => reap(list.concat([a]));
    o.start(t0); o.stop(t0 + dur + 0.05);
    return a;
  }

  // positional node cleanup must survive ac.suspend() (currentTime freezes):
  // queue for flush on wall-clock time as well as onended.
  const pendingReap = [];
  function posDest(dist, pan) {
    const g = mk(clamp(1 / (1 + dist * 0.045), 0.06, 1));
    const p = ac.createStereoPanner ? ac.createStereoPanner() : null;
    const cleanupAt = now() + 1.6;
    if (p) { p.pan.value = clamp(pan || 0, -1, 1); g.connect(p).connect(sfxIn); }
    else g.connect(sfxIn);
    const nodes = p ? [g, p] : [g];
    const entry = { nodes, at: performance.now() + 1600, done: false };
    pendingReap.push(entry);
    // self-cleanup via a silent source (fast path when context runs)
    const s = ac.createBufferSource();
    s.buffer = noise; s.loop = false;
    const mute = mk(0);
    s.connect(mute).connect(sum); // wired (silent) so 'ended' fires reliably
    s.onended = () => { if (entry.done) return; entry.done = true; reap(nodes.concat([mute])); };
    s.start(cleanupAt);
    return g; // voices feed the attenuator; g -> p -> sfxIn
  }

  // =========================================================
  // unlock — FIRST gesture only (K1). Builds the whole graph.
  // =========================================================
  function unlock() {
    if (ac) { if (ac.state === 'suspended') ac.resume().catch(nope); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return; // audio unavailable; every entry point below guards on ac
    ac = new AC({ latencyHint: 'interactive' });
    if (ac.state === 'suspended') ac.resume().catch(nope);

    // master chain
    sum = mk(1);
    muffle = ac.createBiquadFilter();
    muffle.type = 'lowpass';
    muffle.frequency.value = 20000; muffle.Q.value = 0.7;
    busG = mk(0.9);
    comp = ac.createDynamicsCompressor();          // F8/K1 soft clip
    comp.threshold.value = -14; comp.knee.value = 8;
    comp.ratio.value = 12; comp.attack.value = 0.003; comp.release.value = 0.16;
    makeup = mk(1.5);
    sum.connect(muffle).connect(busG).connect(comp).connect(makeup).connect(ac.destination);

    sfxIn = mk(1); sfxIn.connect(sum);
    musicG = mk(0.85); musicG.connect(sum);         // duck point
    musicBus = mk(1); musicBus.connect(musicG);
    ambIn = mk(0.8); ambIn.connect(sum);

    // noise buffer (2 s, seeded)
    const n = Math.floor(ac.sampleRate * 2);
    noise = ac.createBuffer(1, n, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = rng.range(-1, 1);

    // seeded bass riffs + arp order
    for (let r = 0; r < 4; r++) {
      const a = new Int8Array(16);
      for (let s = 0; s < 16; s++) {
        const q = rng.next();
        a[s] = s === 0 ? 0 : q < 0.42 ? -1 : q < 0.62 ? 0 : q < 0.78 ? 12 : q < 0.9 ? 7 : 0;
      }
      riffs.push(a);
    }
    for (let s = 0; s < 16; s++) ARP.push(s % 4 === 3 ? rng.int(3) : (s >> 1) % 3);

    // W2 ambient bed: wind (filtered noise + slow LFOs) + city hum (2 drones)
    const w = noiseSrc(0, 1e9, 1);
    windF = ac.createBiquadFilter();
    windF.type = 'bandpass'; windF.frequency.value = 500; windF.Q.value = 0.6;
    windG = mk(0.03);
    w.connect(windF).connect(windG).connect(ambIn);
    const lfo1 = ac.createOscillator(); lfo1.frequency.value = 0.09;
    const lfo1g = mk(0.018); lfo1.connect(lfo1g).connect(windG.gain);
    const lfo2 = ac.createOscillator(); lfo2.frequency.value = 0.05;
    const lfo2g = mk(220); lfo2.connect(lfo2g).connect(windF.frequency);
    lfo1.start(); lfo2.start();

    humG = mk(0.028);
    const h1 = ac.createOscillator(); h1.type = 'sawtooth'; h1.frequency.value = 51.7;
    const h2 = ac.createOscillator(); h2.type = 'sawtooth'; h2.frequency.value = 52.6;
    const hLP = ac.createBiquadFilter(); hLP.type = 'lowpass'; hLP.frequency.value = 120; hLP.Q.value = 0.5;
    h1.connect(hLP); h2.connect(hLP); hLP.connect(humG).connect(ambIn);
    h1.start(); h2.start();

    // D5 pad: detuned saw pair per triad tone + sub, through lowpass
    padF = ac.createBiquadFilter(); padF.type = 'lowpass'; padF.frequency.value = 380; padF.Q.value = 1.1;
    padG = mk(0.0); padF.connect(padG).connect(musicBus);
    const mkPair = (f, det) => {
      const a = ac.createOscillator(); a.type = 'sawtooth'; a.frequency.value = f; a.detune.value = -det;
      const b = ac.createOscillator(); b.type = 'sawtooth'; b.frequency.value = f; b.detune.value = det;
      a.connect(padF); b.connect(padF); a.start(); b.start();
      return [a, b];
    };
    [padA1, padA2] = mkPair(110, 6);
    [padB1, padB2] = mkPair(110 * 1.1892, 7);
    [padC1, padC2] = mkPair(110 * 1.4983, 5);
    padSub = ac.createOscillator(); padSub.type = 'sawtooth'; padSub.frequency.value = 55;
    padSub.connect(padF); padSub.start();

    droneO = ac.createOscillator(); droneO.type = 'sawtooth'; droneO.frequency.value = 55;
    droneF = ac.createBiquadFilter(); droneF.type = 'lowpass'; droneF.frequency.value = 150;
    droneG = mk(0); droneO.connect(droneF).connect(droneG).connect(musicBus); droneO.start();

    // slide rasp source (gated by slideG)
    slideSrc = noiseSrc(0, 1e9, 1.1);
    slideF = ac.createBiquadFilter(); slideF.type = 'bandpass'; slideF.frequency.value = 2300; slideF.Q.value = 0.9;
    slideG = mk(0);
    slideSrc.connect(slideF).connect(slideG).connect(sfxIn);

    mus.next = ac.currentTime + 0.08;
    setChord(0);
  }
  const nope = () => { /* context already closed/resumed */ };

  // =========================================================
  // SFX voices (F8)
  // =========================================================
  function gunShot(t0, dest, ads, pitch) {
    const p = pitch || 1;
    // click attack (~2 ms, HP filtered)
    noiseVoice(t0, 0.004, dest, { filter: 'highpass', f0: 4400 * p, peak: ads ? 0.7 : 0.95 });
    // low-end thump 150 -> 40
    toneVoice(t0, ads ? 0.12 : 0.10, dest, 'sine', 150 * p, 40 * p, ads ? 0.95 : 0.8, 0.004);
    // short room tail, 2 variants + pitch jitter
    const j = rng.range(0.94, 1.07);
    if (rng.int(2) === 0) {
      noiseVoice(t0 + 0.005, 0.20, dest, { filter: 'bandpass', f0: 1250 * j * p, q: 1.1, peak: ads ? 0.2 : 0.3, atk: 0.012 });
    } else {
      noiseVoice(t0 + 0.005, 0.30, dest, { filter: 'lowpass', f0: 2100 * j, f1: 520, q: 0.6, peak: ads ? 0.22 : 0.32, atk: 0.014 });
    }
    if (ads) noiseVoice(t0 + 0.004, 0.06, dest, { filter: 'lowpass', f0: 900, peak: 0.35, atk: 0.004 }); // ADS: darker body
  }

  function enemyReport(dist, pan) {
    const t0 = now() + 0.002;
    const att = clamp(1 / (1 + dist * 0.05), 0.12, 0.9);
    const dest = posDest(dist, pan);
    noiseVoice(t0, 0.006, dest, { filter: 'bandpass', f0: 2600 * rng.range(0.9, 1.1), q: 1.2, peak: 0.75 * att });
    toneVoice(t0, 0.13, dest, 'sine', 118, 34, 0.9 * att, 0.004);
    noiseVoice(t0 + 0.006, 0.34, dest, { filter: 'lowpass', f0: 1350 * rng.range(0.9, 1.1), f1: 420, q: 0.7, peak: 0.4 * att, atk: 0.016 });
  }

  function crack(intensity) {
    const t0 = now() + 0.001;
    if (t0 - lastCrack < 0.05) return; lastCrack = t0;
    const i = clamp01(intensity == null ? 1 : intensity);
    // short high-band snap; Doppler-ish pitch drop, brighter+faster the closer
    const dop = rng.range(0.92, 0.99) - 0.06 * i;
    noiseVoice(t0, 0.016 + 0.02 * (1 - i), sfxIn, { filter: 'bandpass', f0: (4800 + 2600 * i) * dop, q: 2.8, peak: 0.18 + 0.55 * i });
    noiseVoice(t0 + 0.001, 0.05, sfxIn, { filter: 'highpass', f0: 3200 * dop, f1: 1500 * dop, peak: 0.1 + 0.22 * i });
  }

  function reloadTrio() { return od ? 1.15 : 1; } // R4: pitched ~15% up during OVERDRIVE

  function magOutFn() {
    const t0 = now() + 0.002, p = reloadTrio();
    noiseVoice(t0, 0.012, sfxIn, { filter: 'highpass', f0: 3200 * p, peak: 0.5 });
    toneVoice(t0, 0.04, sfxIn, 'square', 1500 * p, 900 * p, 0.14, 0.002, { type: 'bandpass', f: 1400 * p, q: 3 });
  }
  function magInFn() {
    const t0 = now() + 0.002, p = reloadTrio();
    noiseVoice(t0, 0.07, sfxIn, { filter: 'lowpass', f0: 1100 * p, f1: 380, q: 0.9, peak: 0.42, atk: 0.002 });
    toneVoice(t0, 0.1, sfxIn, 'sine', 95 * p, 46 * p, 0.55, 0.003);
    toneVoice(t0 + 0.012, 0.03, sfxIn, 'square', 700 * p, 500 * p, 0.1, 0.002, { type: 'bandpass', f: 900 * p, q: 2 });
  }
  function rackFn() {
    const t0 = now() + 0.002, p = reloadTrio();
    toneVoice(t0, 0.022, sfxIn, 'square', 2450 * p, 2300 * p, 0.22, 0.001, { type: 'bandpass', f: 2600 * p, q: 5 });
    toneVoice(t0 + 0.018, 0.026, sfxIn, 'square', 2050 * p, 1900 * p, 0.2, 0.001, { type: 'bandpass', f: 2250 * p, q: 5 });
    noiseVoice(t0, 0.005, sfxIn, { filter: 'highpass', f0: 5200 * p, peak: 0.4 });
    noiseVoice(t0 + 0.018, 0.005, sfxIn, { filter: 'highpass', f0: 4400 * p, peak: 0.32 });
  }

  function tickBlip(kill) {
    const t0 = now() + 0.002;
    if (kill) {
      toneVoice(t0, 0.09, sfxIn, 'sine', 640, 420, 0.3, 0.002);
      noiseVoice(t0, 0.012, sfxIn, { filter: 'highpass', f0: 5000, peak: 0.24 });
    } else {
      toneVoice(t0, 0.035, sfxIn, 'square', 1950, 1850, 0.16, 0.001, { type: 'bandpass', f: 2200, q: 2 });
    }
  }
  function wetCrack() {
    const t0 = now() + 0.002;
    noiseVoice(t0, 0.09, sfxIn, { filter: 'bandpass', f0: 4200 * rng.range(0.9, 1.1), f1: 780, q: 1.6, peak: 0.5, atk: 0.002 });
    toneVoice(t0, 0.07, sfxIn, 'sine', 480, 220, 0.3, 0.002);
  }
  function fleshThud(dmg) {
    const t0 = now() + 0.002;
    const k = clamp01(dmg / 60);
    noiseVoice(t0, 0.05, sfxIn, { filter: 'lowpass', f0: 520, peak: 0.1 + 0.12 * k });
    toneVoice(t0, 0.06, sfxIn, 'sine', 125, 68, 0.12 + 0.12 * k, 0.003);
  }
  function bodyFall(dist) {
    const t0 = now() + 0.002;
    const dest = posDest(dist || 4, 0);
    toneVoice(t0, 0.16, dest, 'sine', 120, 44, 0.6, 0.004);
    noiseVoice(t0 + 0.02, 0.14, dest, { filter: 'lowpass', f0: 800, f1: 300, peak: 0.24, atk: 0.01 });
  }
  function tinkle() {
    const t0 = now() + 0.002;
    if (t0 - lastTink < 0.04) return; lastTink = t0;
    const parts = 2 + rng.int(2);
    for (let i = 0; i < parts; i++) {
      const f = rng.range(2300, 4900) * (1 - i * 0.12);
      toneVoice(t0 + i * rng.range(0.004, 0.02), 0.12 + 0.1 * rng.next(), sfxIn, rng.next() < 0.5 ? 'sine' : 'triangle', f, f * 0.97, 0.06, 0.001);
    }
  }
  function glassBreak() {
    const t0 = now() + 0.002;
    noiseVoice(t0, 0.06, sfxIn, { filter: 'bandpass', f0: 3400, q: 5, peak: 0.3 });
    for (let i = 0; i < 4; i++) {
      toneVoice(t0 + rng.range(0.01, 0.22), 0.16 + 0.2 * rng.next(), sfxIn, 'triangle', rng.range(2800, 5600), rng.range(2400, 4200), 0.05, 0.002);
    }
  }
  function explodeAt(dist) {
    const t0 = now() + 0.002;
    const att = clamp(1 / (1 + (dist || 0) * 0.035), 0.15, 1);
    toneVoice(t0, 0.6, sfxIn, 'sine', 80, 24, 0.95 * att, 0.006);                 // sub sweep
    noiseVoice(t0, 0.85, sfxIn, { filter: 'lowpass', f0: 1400, f1: 110, q: 0.8, peak: 0.6 * att, atk: 0.004 }); // body
    toneVoice(t0 + 0.02, 0.35, sfxIn, 'square', 60, 30, 0.2 * att, 0.01, { type: 'lowpass', f: 200, q: 1 });
    for (let i = 0; i < 5; i++) { // debris rattle tail
      toneVoice(t0 + rng.range(0.35, 1.15), 0.09 + 0.12 * rng.next(), sfxIn, rng.next() < 0.5 ? 'square' : 'triangle', rng.range(900, 3400), rng.range(500, 1800), 0.05 * att, 0.002);
    }
  }
  const SURF = {
    concrete: { filter: 'lowpass', f0: 1300, q: 0.7, peak: 0.11 },
    metal: { filter: 'bandpass', f0: 1900, q: 1.4, peak: 0.1 },
    wood: { filter: 'bandpass', f0: 680, q: 1.1, peak: 0.12 },
    drywall: { filter: 'lowpass', f0: 900, q: 0.6, peak: 0.08 },
    sheeting: { filter: 'bandpass', f0: 2600, q: 0.9, peak: 0.06 },
    glass: { filter: 'bandpass', f0: 3200, q: 2.2, peak: 0.07 },
    paint: { filter: 'lowpass', f0: 1500, q: 0.7, peak: 0.1 },
    body: { filter: 'lowpass', f0: 380, q: 0.6, peak: 0.1 },
  };
  function footTap(surface, speed) {
    const t0 = now() + 0.002;
    if (t0 - lastFoot < 0.09) return; lastFoot = t0;
    const s = SURF[surface] || SURF.concrete;
    const k = 0.35 + 0.75 * clamp01(speed == null ? 1 : speed);
    noiseVoice(t0, 0.055, sfxIn, { filter: s.filter, f0: s.f0 * rng.range(0.9, 1.1), q: s.q, peak: s.peak * k, atk: 0.003 });
    toneVoice(t0, 0.04, sfxIn, 'sine', 90, 55, 0.07 * k, 0.003);
  }
  function slideStart() {
    if (!ac) return;
    const t = now() + 0.002;
    slideG.gain.cancelScheduledValues(t);
    slideG.gain.setValueAtTime(Math.max(slideG.gain.value, 1e-4), t);
    slideG.gain.exponentialRampToValueAtTime(0.14, t + 0.06);
    slideReleaseAt = t + 0.85;
  }
  function slideEnd() {
    if (!ac) return;
    const t = now() + 0.002;
    slideG.gain.cancelScheduledValues(t);
    slideG.gain.setValueAtTime(Math.max(slideG.gain.value, 1e-4), t);
    slideG.gain.exponentialRampToValueAtTime(1e-4, t + 0.16);
    slideReleaseAt = 0;
  }
  function mantleWhoosh() {
    const t0 = now() + 0.002;
    noiseVoice(t0, 0.26, sfxIn, { filter: 'bandpass', f0: 480, f1: 1300, q: 0.8, peak: 0.14, atk: 0.05 });
    toneVoice(t0 + 0.02, 0.14, sfxIn, 'sine', 140, 90, 0.1, 0.04);
  }
  function hurtThud() {
    const t0 = now() + 0.001;
    noiseVoice(t0, 0.18, sfxIn, { filter: 'bandpass', f0: 240, f1: 130, q: 1.4, peak: 0.3, atk: 0.006 });
    toneVoice(t0, 0.22, sfxIn, 'sine', 100, 46, 0.35, 0.005);
  }

  // ---------- UI / action stings (D1, D3, R) ----------
  function bannerSting(kind) {
    const t = now() + 0.005;
    const low = kind === 'gameover' ? 0.5 : 1;
    toneVoice(t, 0.45 * low, sfxIn, 'sawtooth', 100 * low, 640 * low, 0.05, 0.4, { type: 'lowpass', f: 1400, q: 2 }); // riser into slam
    const hit = t + 0.42 * low;
    toneVoice(hit, 0.3, sfxIn, 'sine', 95, 30, 0.85, 0.004);
    noiseVoice(hit, 0.22, sfxIn, { filter: 'lowpass', f0: 1600, f1: 220, q: 0.7, peak: 0.34, atk: 0.003 });
  }
  function comboPopFn(n) {
    const t0 = now() + 0.002;
    const f = 392 * Math.pow(2, clamp(n == null ? 1 : n, 1, 12) / 12);
    toneVoice(t0, 0.11, sfxIn, 'triangle', f * 1.5, f, 0.14, 0.002);
    toneVoice(t0, 0.05, sfxIn, 'sine', f, f * 0.9, 0.1, 0.002);
  }
  function announceSting(kind) {
    const t0 = now() + 0.003;
    if (kind === 'double' || kind === 'triple') {
      const seq = kind === 'double' ? [660, 880] : [523, 659, 784];
      for (let i = 0; i < seq.length; i++) {
        toneVoice(t0 + i * 0.075, 0.09, sfxIn, 'square', seq[i], seq[i] * 0.99, 0.12, 0.002, { type: 'bandpass', f: seq[i] * 1.5, q: 2 });
      }
    } else { // rampage: riser + chord stab
      toneVoice(t0, 0.35, sfxIn, 'sawtooth', 120, 900, 0.06, 0.3, { type: 'lowpass', f: 1800, q: 3 });
      const f = [220, 261.6, 329.6, 440];
      for (let i = 0; i < f.length; i++) {
        toneVoice(t0 + 0.34, 0.3, sfxIn, 'sawtooth', f[i], f[i] * 0.97, 0.09, 0.004, { type: 'lowpass', f: 2400, q: 1 });
      }
      noiseVoice(t0 + 0.34, 0.12, sfxIn, { filter: 'highpass', f0: 3000, peak: 0.2 });
    }
  }
  function overdriveSting(on) {
    const t0 = now() + 0.004;
    if (on) {
      toneVoice(t0, 0.5, sfxIn, 'sawtooth', 80, 980, 0.09, 0.45, { type: 'lowpass', f: 2600, q: 4 });
      toneVoice(t0 + 0.45, 0.5, sfxIn, 'sine', 130, 38, 0.8, 0.005);
      noiseVoice(t0 + 0.45, 0.25, sfxIn, { filter: 'bandpass', f0: 2200, f1: 700, q: 1.2, peak: 0.25 });
    } else {
      toneVoice(t0, 0.4, sfxIn, 'sawtooth', 600, 70, 0.08, 0.01, { type: 'lowpass', f: 900, q: 2 });
      noiseVoice(t0, 0.3, sfxIn, { filter: 'lowpass', f0: 1800, f1: 300, peak: 0.12, atk: 0.01 });
    }
  }
  function gameOverDrone() {
    const t0 = now() + 0.005;
    toneVoice(t0, 2.4, sfxIn, 'sawtooth', 165, 38, 0.3, 0.02, { type: 'lowpass', f: 700, q: 1.5 });
    toneVoice(t0 + 0.01, 2.4, sfxIn, 'sawtooth', 164, 37, 0.28, 0.02, { type: 'lowpass', f: 500, q: 1.5 });
    toneVoice(t0 + 0.1, 1.8, sfxIn, 'sine', 82, 24, 0.35, 0.05);
  }
  function waveClearedSwell() {
    padBoostS.snap(1); padBoostS.set(0); // spike, then spring-decays to 0 in update (C5)
    const t0 = now() + 0.01;
    toneVoice(t0, 0.7, musicBus, 'sine', 440, 554.4, 0.05, 0.25, { type: 'lowpass', f: 1600, q: 1 });
  }

  // =========================================================
  // D5 music scheduler (16-step, ~120 ms lookahead, dt-driven)
  // =========================================================
  function setChord(bar) {
    const c = PROG[bar];
    const f = (i) => c.r * Math.pow(2, c.t[i] / 12);
    const t = now();
    padA1.frequency.setTargetAtTime(f(0), t, 0.15); padA2.frequency.setTargetAtTime(f(0), t, 0.15);
    padB1.frequency.setTargetAtTime(f(1), t, 0.15); padB2.frequency.setTargetAtTime(f(1), t, 0.15);
    padC1.frequency.setTargetAtTime(f(2), t, 0.15); padC2.frequency.setTargetAtTime(f(2), t, 0.15);
    padSub.frequency.setTargetAtTime(c.r * 0.5, t, 0.15);
    droneO.frequency.setTargetAtTime(c.r * 0.5, t, 0.2);
  }
  function musicActive() {
    return state.phase === 'playing' && (state.waveActive || od);
  }
  function scheduleStep(step, t, sd) {
    const i = mus.inten, n = i / 10;
    const active = musicActive();
    if (step === 0) setChord(mus.bar);
    if (!active) return;
    // kick
    if (step === 0 || step === 8 || (i >= 6 && (step === 6 || step === 14)) || (i >= 8 && step === 10)) {
      toneVoice(t, 0.14, musicBus, 'sine', 135 + 25 * n, 38, 0.55, 0.002);
      noiseVoice(t, 0.008, musicBus, { filter: 'highpass', f0: 2200, peak: 0.12 });
    }
    // hats: 16ths at high intensity, 8ths lower
    const hatEvery = i >= 4 ? 1 : i >= 2 ? 2 : 4;
    if (step % hatEvery === 0) {
      const open = od && step % 4 === 2;
      noiseVoice(t, open ? 0.11 : 0.025, musicBus, { filter: 'highpass', f0: 6800 + 900 * n, peak: (step % 4 === 2 ? 0.09 : 0.05) * (0.5 + n) });
    }
    // bass pulse following seeded riff root
    const riff = riffs[mus.bar];
    const deg = riff[step];
    if (deg >= 0 && (i >= 1 || step % 4 === 0)) {
      const root = PROG[mus.bar].r * 0.5;
      toneVoice(t, sd * 1.6, musicBus, 'sawtooth', root * Math.pow(2, deg / 12), root * Math.pow(2, deg / 12) * 0.995,
        0.3 + 0.14 * n, 0.004, { type: 'lowpass', f: 220 + 480 * n + (od ? 500 : 0), q: 3 });
    }
    // OVERDRIVE lead arp
    if (od) {
      const c = PROG[mus.bar];
      const note = c.t[ARP[step]] * 2 + 24;
      toneVoice(t, 0.07, musicBus, 'square', PROG[mus.bar].r * 2 * Math.pow(2, note / 12), PROG[mus.bar].r * 2 * Math.pow(2, note / 12) * 0.99,
        0.05, 0.002, { type: 'bandpass', f: 2800, q: 2 });
    }
  }
  function musicTick() {
    const t = now();
    if (mus.next < t - 0.25) mus.next = t + 0.04; // post-suspend catch-up
    const bpm = 88 + mus.inten * 4;               // D5/D1: 88 -> 128
    const sd = 60 / bpm / 4;
    let guard = 0;
    while (mus.next < t + 0.12 && guard++ < 16) {
      scheduleStep(mus.step, Math.max(mus.next, t + 0.001), sd);
      mus.step++;
      if (mus.step >= 16) { mus.step = 0; mus.bar = (mus.bar + 1) % 4; }
      mus.next += sd;
    }
  }

  // =========================================================
  // update(dt, elapsed) — springs, heartbeat, muffle, ducking, scheduler
  // =========================================================
  function update(dt) {
    if (!ac) return;
    const d = Number.isFinite(dt) ? clamp(dt, 0, 0.05) : 0; // K4 clamp; audio runs on real time
    // wall-clock reap flush (runs even while the context is suspended)
    if (pendingReap.length) {
      const t = performance.now();
      for (let i = pendingReap.length - 1; i >= 0; i--) {
        const en = pendingReap[i];
        if (t >= en.at) {
          pendingReap.splice(i, 1);
          if (!en.done) { en.done = true; reap(en.nodes); }
        }
      }
    }
    if (ac.state !== 'running') return;

    // intensity ramp via spring (music ramps with events, C5)
    intenS.set(mus.target); intenS.update(d);
    mus.inten = clamp(intenS.value, 0, 12);
    const n = mus.inten / 10;

    // pad / drone mix (pad -> drone as intensity rises; low pad between waves)
    const padWant = (musicActive() ? 0.05 + 0.05 * n : 0.03) + 0.05 * padBoostS.value;
    padG.gain.setTargetAtTime(padWant, ac.currentTime, 0.25);
    padF.frequency.setTargetAtTime(320 + 1500 * n + (od ? 700 : 0), ac.currentTime, 0.3);
    droneG.gain.setTargetAtTime(musicActive() ? 0.006 + 0.02 * n : 0.004, ac.currentTime, 0.3);
    padBoostS.update(d);

    // ducking (D5): gunfire recency + external setDucking
    duckHit *= Math.exp(-d * 5);
    duckExt *= Math.exp(-d * 3.5);
    duckS.set(clamp01(duckHit + duckExt));
    duckS.update(d);
    musicG.gain.setTargetAtTime(0.85 * (1 - 0.55 * clamp01(duckS.value)), ac.currentTime, 0.05);

    // D6: low-HP muffle (eases out on regen) + heartbeat rate from hp
    const lowK = clamp01((30 - state.hp) / 30);
    muffleS.set(state.phase === 'playing' || state.phase === 'paused' ? 12000 * Math.pow(0.055, E.easeInOutCubic(lowK)) : 20000);
    muffleS.update(d);
    muffle.frequency.value = clamp(muffleS.value, 180, 20000);
    windG.gain.value = 0.03 + 0.02 * lowK;

    if (lowK > 0.02 && state.phase === 'playing' && !state.godmode) {
      hbT += d;
      const period = 1.15 - 0.6 * E.easeOutQuad(lowK); // faster beat as hp drops
      if (hbT >= period) {
        hbT = 0;
        const t0 = now() + 0.005;
        toneVoice(t0, 0.11, sfxIn, 'sine', 58, 34, 0.5 * lowK, 0.006);
        toneVoice(t0 + 0.14, 0.09, sfxIn, 'sine', 52, 32, 0.32 * lowK, 0.006);
      }
    } else hbT = 0;

    // slide rasp auto-release if no 'slide:end' arrives
    if (slideReleaseAt && now() > slideReleaseAt) slideEnd();

    musicTick();
  }

  // =========================================================
  // positional + ducking setters
  // =========================================================
  function setListener(pos, fwd) {
    if (pos && Number.isFinite(pos.x)) {
      lx = pos.x; ly = pos.y || 0; lz = pos.z; hasL = true;
      if (fwd && Number.isFinite(fwd.x)) {
        fx = fwd.x; fz = fwd.z;
        const m = Math.hypot(fx, fz);
        if (m > 1e-6) { fx /= m; fz /= m; } else { fx = 0; fz = -1; }
      } else { fx = 0; fz = -1; }
    }
  }
  function azimuthPan(from) {
    if (!from || !hasL || !Number.isFinite(from.x) || !Number.isFinite(from.z)) return 0;
    const dx = from.x - lx, dz = from.z - lz;
    const dist = Math.hypot(dx, dz) || 1;
    // right = fwd x up
    return clamp((dx * -fz + dz * fx) / dist, -1, 1);
  }
  function distTo(pos, fallback) {
    if (pos && hasL && Number.isFinite(pos.x) && Number.isFinite(pos.y) && Number.isFinite(pos.z))
      return Math.hypot(pos.x - lx, pos.y - ly, pos.z - lz);
    return fallback == null ? 8 : fallback;
  }
  function setDucking(x01) { duckExt = clamp01(x01 == null ? 0 : x01); }

  function gunBurstDuck(level) { duckHit = Math.min(1, duckHit + level); }

  // =========================================================
  // public API (contract signatures)
  // =================================================--------
  const api = {
    unlock, update, setDucking, setListener,
    shot(o) {
      if (!ac) return;
      if (o && o.enemy) { api.enemyShot(o.dist == null ? 8 : o.dist); return; }
      const t0 = now() + 0.002;
      gunShot(t0, sfxIn, !!(o && o.ads), rng.range(0.965, 1.035));
      gunBurstDuck(0.55);
    },
    enemyShot(dist, from) {
      if (!ac) return;
      enemyReport(dist == null ? distTo(from, 10) : dist, azimuthPan(from || null));
      gunBurstDuck(0.3);
    },
    dryFire() {
      if (!ac) return;
      const t0 = now() + 0.002;
      toneVoice(t0, 0.014, sfxIn, 'square', 1100, 850, 0.14, 0.001);
      noiseVoice(t0, 0.004, sfxIn, { filter: 'highpass', f0: 3800, peak: 0.18 });
    },
    magOut: magOutFn, magIn: magInFn, rack: rackFn,
    hitmarker(kill) { if (ac) tickBlip(kill); },
    headshot() { if (ac) wetCrack(); },
    flesh(dmg) { if (ac) fleshThud(dmg == null ? 30 : dmg); },
    bodyFall(dist) { if (ac) bodyFall(dist); },
    shellLand() { if (ac) tinkle(); },
    glass() { if (ac) glassBreak(); },
    explode(d) { if (ac) explodeAt(d); gunBurstDuck(0.6); },
    crack(intensity) { if (ac) crack(intensity); },
    footsteps(surface, speed) { if (ac) footTap(surface, speed); },
    slide() { if (ac) slideStart(); },
    slideEnd() { slideEnd(); },
    mantle() { if (ac) mantleWhoosh(); },
    banner(kind) { if (ac) bannerSting(kind); },
    comboPop(n) { if (ac) comboPopFn(n); },
    announce(kind) { if (ac) announceSting(kind); },
    waveCleared() { if (ac) waveClearedSwell(); },
    setIntensity(v) { mus.target = clamp(v == null ? 0 : v, 0, 10); },
    overdriveStart() { if (!od) { od = true; overdriveSting(true); } },
    overdriveEnd() { if (od) { od = false; overdriveSting(false); } },
  };

  // =========================================================
  // bus wiring (canonical drivers — guard until unlock)
  // =========================================================
  bus.on('shot:fire', (e) => api.shot(e || {}));
  bus.on('shot:dry', () => api.dryFire());
  bus.on('enemy:shot', (e) => { if (ac) api.enemyShot(e && e.dist != null ? e.dist : distTo(e && e.from, 12), e && e.from); });
  bus.on('reload:phase', (e) => {
    if (!ac) return;
    const p = e && e.phase;
    if (p === 0) magOutFn(); else if (p === 1) magInFn(); else if (p === 2) rackFn();
  });
  bus.on('hit:marker', (e) => {
    if (!ac) return;
    if (e && e.headshot) wetCrack(); else tickBlip(e && e.kill);
  });
  bus.on('explosion', (e) => { if (ac) explodeAt(distTo(e && e.point, 10)); });
  bus.on('shell:land', () => { if (ac) tinkle(); });
  bus.on('glass:break', () => { if (ac) glassBreak(); });
  bus.on('mantle:start', () => { if (ac) mantleWhoosh(); });
  bus.on('footstep', (e) => { if (ac) footTap(e && e.surface, e && e.speed); });
  bus.on('slide:start', () => { if (ac) slideStart(); });
  bus.on('slide:end', () => { if (ac) slideEnd(); });
  bus.on('tracer:nearmiss', (e) => { if (ac) crack(e && e.intensity != null ? e.intensity : 1); });
  bus.on('player:damage', () => { if (ac) hurtThud(); });
  bus.on('player:died', () => {
    mus.target = 0;
    if (ac) gameOverDrone();
  });
  bus.on('wave:start', () => { if (ac) bannerSting('wave'); });
  bus.on('wave:cleared', () => { if (ac) waveClearedSwell(); });
  bus.on('combo', (e) => {
    if (!ac) return;
    const c = e && e.count || 0;
    if (c <= 0) return;
    comboPopFn(c);
    if (c === 2) announceSting('double');
    else if (c === 3) announceSting('triple');
    else if (c >= 4) announceSting('rampage');
    mus.target = clamp(mus.target + 0.8, 0, 10);
  });
  bus.on('music:intensity', (e) => {
    if (!e) return;
    const w = e.wave || 0, en = e.enemies || 0, cb = e.combo || 0;
    mus.target = clamp(w * 1.3 + Math.min(en, 8) * 0.75 + Math.min(cb, 5) * 0.5, 0, 10);
  });
  bus.on('overdrive:start', () => api.overdriveStart());
  bus.on('overdrive:end', () => api.overdriveEnd());
  bus.on('game:phase', (e) => {
    const ph = e && e.phase;
    if (ph === 'menu') { mus.target = 0; if (od) { od = false; } }
    else if (ph === 'paused') { if (ac && ac.state === 'running') ac.suspend().then(() => { suspended = true; }).catch(nope); }
    else if (ph === 'playing' && suspended) { suspended = false; if (ac) ac.resume().catch(nope); mus.next = ac.currentTime + 0.06; }
  });

  // P2/K4: tab hide -> clean suspend; show -> resume (scheduler catches up in musicTick)
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) {
      if (ac.state === 'running') ac.suspend().then(() => { suspended = true; }).catch(nope);
    } else if ((suspended || ac.state === 'suspended') && state.phase !== 'paused') {
      // stay silent while the pause overlay is up; game:phase 'playing' resumes
      ac.resume().then(() => { suspended = false; mus.next = ac.currentTime + 0.06; }).catch(nope);
    }
  });

  return api;
}
