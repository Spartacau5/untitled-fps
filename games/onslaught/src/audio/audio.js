export function noiseBuffer(i, t) {
  const e = Math.floor(i.sampleRate * t),
    n = i.createBuffer(1, e, i.sampleRate),
    s = n.getChannelData(0);
  for (let r = 0; r < e; r++) s[r] = Math.random() * 2 - 1;
  return n;
}
export function reverbImpulse(i, t, e) {
  const n = Math.floor(i.sampleRate * t),
    s = i.createBuffer(2, n, i.sampleRate);
  for (let r = 0; r < 2; r++) {
    const a = s.getChannelData(r);
    for (let l = 0; l < n; l++) {
      const o = l / n,
        c = l % 1900 < 40 && l < 12e3 ? 0.6 : 0;
      a[l] =
        (Math.random() * 2 - 1 + c * (Math.random() * 2 - 1)) *
        Math.pow(1 - o, e) *
        (1 - Math.exp(-l / 300));
    }
  }
  return s;
}
export const midiToHz = (i) => 440 * Math.pow(2, (i - 69) / 12);
// Which existing chain each new weapon borrows, and how it is retuned.
// Pitch scales the resonant bands; gain trims the whole voice.
const GUN_VOICES = {
  pistol: { base: "ar", pitch: 1.22, gain: 0.78 },
  smg: { base: "ar", pitch: 1.12, gain: 0.62 },
  lmg: { base: "dmr", pitch: 0.94, gain: 0.92 },
  sniper: { base: "dmr", pitch: 0.72, gain: 1.35 },
  // The launch, not the blast: a low whoosh with very little crack.
  rocket: { base: "shotgun", pitch: 0.55, gain: 1.1 },
  // 5.56 out of a 14.5" barrel: a touch sharper and flatter than the VK-7.
  m4: { base: "ar", pitch: 1.05, gain: 0.9 },
  // 9mm, roller-delayed, suppressed-sounding next to the others.
  mp5: { base: "ar", pitch: 1.18, gain: 0.68 },
};

export class Audio {
  constructor() {
    ((this.ctx = null),
      (this.ready = !1),
      (this.musicOn = !0),
      (this.ambienceOn = !0),
      (this.masterVol = 0.9),
      (this.musicVol = 1),
      (this.sfxVol = 1),
      (this.voiceGain = 1),
      (this.intensity = 0),
      (this.listenerPos = [0, 0, 0]),
      (this.listenerFwd = [0, 0, -1]),
      (this.listenerRight = [1, 0, 0]),
      (this.lastGrowl = 0),
      (this.lastEnemyHit = 0),
      (this._nextBeat = 0),
      (this._beat = 0),
      (this._heartT = 0));
  }
  init() {
    if (this.ready) return;
    const t = new (window.AudioContext || window.webkitAudioContext)({
      latencyHint: "interactive",
    });
    ((this.ctx = t),
      (this.master = t.createGain()),
      (this.master.gain.value = 0.9),
      (this.comp = t.createDynamicsCompressor()),
      (this.comp.threshold.value = -16),
      (this.comp.knee.value = 14),
      (this.comp.ratio.value = 5),
      (this.comp.attack.value = 0.002),
      (this.comp.release.value = 0.18),
      this.master.connect(this.comp),
      this.comp.connect(t.destination),
      (this.dry = t.createGain()),
      (this.dry.gain.value = 1),
      this.dry.connect(this.master),
      (this.reverb = t.createConvolver()),
      (this.reverb.buffer = reverbImpulse(t, 0.95, 3.4)),
      (this.revGain = t.createGain()),
      (this.revGain.gain.value = 0.28),
      this.reverb.connect(this.revGain),
      this.revGain.connect(this.master),
      (this.musicBus = t.createGain()),
      (this.musicBus.gain.value = 0.32),
      this.musicBus.connect(this.master),
      (this.musicLP = t.createBiquadFilter()),
      (this.musicLP.type = "lowpass"),
      (this.musicLP.frequency.value = 4e3),
      this.musicLP.connect(this.musicBus),
      (this.noiseBuf = noiseBuffer(t, 2)),
      (this.ready = !0),
      this._applyVolumes(),
      this._startAmbience(),
      (this._nextBeat = t.currentTime + 0.1));
  }
  // User volume settings, 0–1 each. Safe to call before init().
  setVolumes({ master, music, sfx }) {
    (master !== undefined && (this.masterVol = 0.9 * master),
      music !== undefined && (this.musicVol = music),
      sfx !== undefined && (this.sfxVol = sfx),
      this._applyVolumes());
  }
  _applyVolumes() {
    if (!this.ready) return;
    ((this.master.gain.value = this.masterVol),
      (this.dry.gain.value = this.sfxVol),
      (this.revGain.gain.value = 0.28 * this.sfxVol),
      this.ambBus &&
        (this.ambBus.gain.value = this.ambienceOn ? this.sfxVol : 0));
  }
  resume() {
    this.ctx && this.ctx.state === "suspended" && this.ctx.resume();
  }
  // Called when a run ends. Everything the match was driving — the music
  // layers, the low-health heartbeat and any tail still ringing out in the
  // reverb — is cut here, so a finished session cannot keep making noise on
  // the game-over screen. Ambience is left alone: it belongs to the city, not
  // to the run, and it is the same bed the first menu plays.
  endSession() {
    ((this.intensity = 0), (this._heartT = 0));
    if (!this.ready) return;
    const t = this.ctx.currentTime;
    (this.musicBus.gain.cancelScheduledValues(t),
      this.musicBus.gain.setTargetAtTime(0, t, 0.08),
      this.revGain.gain.cancelScheduledValues(t),
      this.revGain.gain.setTargetAtTime(0, t, 0.12),
      // Let the tank refill once the tail it was holding has been cut, so the
      // next run starts with its reverb intact even without beginSession().
      this.revGain.gain.setTargetAtTime(0.28 * this.sfxVol, t + 0.7, 0.15),
      (this._beat = 0),
      (this._nextBeat = t + 0.1));
  }
  // Restores the buses endSession() ducked. Called when a new run starts.
  beginSession() {
    if (!this.ready) return;
    const t = this.ctx.currentTime;
    (this.musicBus.gain.cancelScheduledValues(t),
      this.revGain.gain.cancelScheduledValues(t),
      this.revGain.gain.setTargetAtTime(0.28 * this.sfxVol, t, 0.05),
      (this._nextBeat = t + 0.1));
  }
  get now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }
  setListener(t, e, n) {
    ((this.listenerPos = t), (this.listenerFwd = e), (this.listenerRight = n));
  }
  spatial(t, e = 6, n = 60) {
    const s = t[0] - this.listenerPos[0],
      r = t[1] - this.listenerPos[1],
      a = t[2] - this.listenerPos[2],
      l = Math.sqrt(s * s + r * r + a * a),
      o = (Math.max(0, 1 - Math.max(0, l - e) / (n - e)) * e) / Math.max(e, l),
      c = this.listenerRight,
      h = l > 0.01 ? Math.max(-1, Math.min(1, (s * c[0] + a * c[2]) / l)) : 0;
    return { gain: o, pan: h * 0.8 };
  }
  _voice(
    t,
    e,
    n,
    { gain: s = 1, attack: r = 0.002, decay: a = 0.1, pan: l = 0, send: o = 0 },
  ) {
    const c = this.ctx,
      h = c.createGain();
    (h.gain.setValueAtTime(1e-4, t),
      h.gain.linearRampToValueAtTime(s * this.voiceGain, t + r),
      h.gain.exponentialRampToValueAtTime(1e-4, t + r + a),
      n.connect(h));
    let d = h;
    if (l !== 0) {
      const u = c.createStereoPanner();
      ((u.pan.value = l), h.connect(u), (d = u));
    }
    if ((d.connect(this.dry), o > 0)) {
      const u = c.createGain();
      ((u.gain.value = o), d.connect(u), u.connect(this.reverb));
    }
    return h;
  }
  noise(
    t,
    {
      type: e = "bandpass",
      freq: n = 1e3,
      freqEnd: s = null,
      Q: r = 1,
      gain: a = 1,
      attack: l = 0.002,
      decay: o = 0.1,
      pan: c = 0,
      send: h = 0,
      rate: d = 1,
    },
  ) {
    if (!this.ready) return;
    const u = this.ctx,
      m = u.createBufferSource();
    ((m.buffer = this.noiseBuf), (m.loop = !0), (m.playbackRate.value = d));
    const g = u.createBiquadFilter();
    ((g.type = e),
      (g.Q.value = r),
      g.frequency.setValueAtTime(n, t),
      s && g.frequency.exponentialRampToValueAtTime(Math.max(20, s), t + l + o),
      m.connect(g),
      this._voice(t, l + o, g, {
        gain: a,
        attack: l,
        decay: o,
        pan: c,
        send: h,
      }),
      m.start(t, Math.random() * 1.5),
      m.stop(t + l + o + 0.05));
  }
  tone(
    t,
    {
      type: e = "sine",
      freq: n = 440,
      freqEnd: s = null,
      gain: r = 0.5,
      attack: a = 0.002,
      decay: l = 0.1,
      pan: o = 0,
      send: c = 0,
      detune: h = 0,
    },
  ) {
    if (!this.ready) return;
    const u = this.ctx.createOscillator();
    ((u.type = e),
      (u.detune.value = h),
      u.frequency.setValueAtTime(n, t),
      s && u.frequency.exponentialRampToValueAtTime(Math.max(10, s), t + a + l),
      this._voice(t, a + l, u, {
        gain: r,
        attack: a,
        decay: l,
        pan: o,
        send: c,
      }),
      u.start(t),
      u.stop(t + a + l + 0.05));
  }
  gunshot(key) {
    if (!this.ready) return;
    if (key === "flame") return this.flameLoop();
    // New weapons borrow the closest existing synthesis chain, retuned by
    // pitch and weight. The chain's fixed high-frequency crack stays put,
    // which is what keeps them recognisable as the same family of gun.
    const voice = GUN_VOICES[key] || { base: key, pitch: 1, gain: 1 };
    const t = voice.base,
      e = this.now,
      n = (0.94 + Math.random() * 0.12) * voice.pitch;
    this.voiceGain = voice.gain;
    this._gunshotBody(t, e, n);
    this.voiceGain = 1;
  }
  // Rocket blast: a low body you feel, a mid crack, and a long tail.
  explosion(at) {
    if (!this.ready) return;
    const sp = this.spatial(at, 26, 90),
      e = this.now,
      gain = Math.max(0.15, sp.gain);
    (this.tone(e, {
      type: "sine",
      freq: 82,
      freqEnd: 24,
      gain: 1.5 * gain,
      decay: 0.55,
      pan: sp.pan,
      send: 0.7,
    }),
      this.noise(e, {
        type: "lowpass",
        freq: 900,
        freqEnd: 120,
        gain: 1.3 * gain,
        decay: 0.5,
        pan: sp.pan,
        send: 0.8,
      }),
      this.noise(e, {
        type: "highpass",
        freq: 2600,
        gain: 0.7 * gain,
        decay: 0.05,
        pan: sp.pan,
      }),
      this.noise(e, {
        type: "bandpass",
        freq: 420,
        Q: 0.5,
        gain: 0.8 * gain,
        decay: 1.4,
        pan: sp.pan,
        send: 0.9,
      }));
  }
  // One short filtered puff per sim tick. At the incinerator's rate these
  // overlap into a continuous roar without a looping source to manage.
  flameLoop() {
    const e = this.now;
    (this.noise(e, {
      type: "bandpass",
      freq: 620 + Math.random() * 260,
      Q: 0.7,
      gain: 0.16,
      decay: 0.16,
      send: 0.35,
    }),
      this.noise(e, {
        type: "highpass",
        freq: 4200,
        gain: 0.05,
        decay: 0.06,
      }),
      this.noise(e, {
        type: "lowpass",
        freq: 200,
        freqEnd: 90,
        gain: 0.12,
        decay: 0.22,
        send: 0.4,
      }));
  }
  _gunshotBody(t, e, n) {
    t === "ar"
      ? (this.noise(e, {
          type: "highpass",
          freq: 3500,
          gain: 0.9,
          decay: 0.012,
        }),
        this.noise(e, {
          type: "bandpass",
          freq: 1500 * n,
          Q: 0.6,
          gain: 0.75,
          decay: 0.08,
          send: 0.35,
        }),
        this.noise(e, {
          type: "lowpass",
          freq: 600,
          freqEnd: 150,
          gain: 0.55,
          decay: 0.22,
          send: 0.5,
        }),
        this.tone(e, {
          type: "sine",
          freq: 150 * n,
          freqEnd: 42,
          gain: 0.85,
          decay: 0.11,
        }),
        this.tone(e, {
          type: "square",
          freq: 700,
          freqEnd: 120,
          gain: 0.18,
          decay: 0.025,
        }))
      : t === "shotgun"
        ? (this.noise(e, {
            type: "highpass",
            freq: 2500,
            gain: 1,
            decay: 0.02,
          }),
          this.noise(e, {
            type: "bandpass",
            freq: 900 * n,
            Q: 0.5,
            gain: 1,
            decay: 0.17,
            send: 0.45,
          }),
          this.noise(e, {
            type: "lowpass",
            freq: 350,
            freqEnd: 80,
            gain: 1,
            decay: 0.38,
            send: 0.55,
          }),
          this.tone(e, {
            type: "sine",
            freq: 95 * n,
            freqEnd: 32,
            gain: 1.25,
            decay: 0.24,
          }),
          this.tone(e, {
            type: "triangle",
            freq: 240,
            freqEnd: 55,
            gain: 0.45,
            decay: 0.09,
          }))
        : t === "dmr" &&
          (this.noise(e, {
            type: "highpass",
            freq: 3e3,
            gain: 1,
            decay: 0.018,
          }),
          this.noise(e, {
            type: "highpass",
            freq: 1400,
            gain: 0.8,
            decay: 0.05,
            send: 0.5,
          }),
          this.noise(e, {
            type: "bandpass",
            freq: 650 * n,
            Q: 0.6,
            gain: 0.85,
            decay: 0.15,
            send: 0.65,
          }),
          this.noise(e, {
            type: "lowpass",
            freq: 280,
            freqEnd: 70,
            gain: 0.8,
            decay: 0.45,
            send: 0.7,
          }),
          this.tone(e, {
            type: "sine",
            freq: 115 * n,
            freqEnd: 36,
            gain: 1.15,
            decay: 0.2,
          }),
          this.noise(e + 0.07, {
            type: "bandpass",
            freq: 2200,
            Q: 2,
            gain: 0.25,
            decay: 0.03,
          }),
          this.noise(e + 0.13, {
            type: "bandpass",
            freq: 1800,
            Q: 2,
            gain: 0.2,
            decay: 0.03,
          }));
  }
  dryFire() {
    const t = this.now;
    (this.noise(t, {
      type: "bandpass",
      freq: 2400,
      Q: 3,
      gain: 0.35,
      decay: 0.03,
    }),
      this.tone(t, {
        type: "square",
        freq: 900,
        freqEnd: 300,
        gain: 0.08,
        decay: 0.03,
      }));
  }
  click(t = 1, e = 2e3) {
    const n = this.now;
    (this.noise(n, {
      type: "bandpass",
      freq: e,
      Q: 2.5,
      gain: 0.35 * t,
      decay: 0.035,
    }),
      this.tone(n, {
        type: "triangle",
        freq: e * 0.4,
        freqEnd: e * 0.2,
        gain: 0.08 * t,
        decay: 0.03,
      }));
  }
  magOut() {
    const t = this.now;
    (this.noise(t, {
      type: "bandpass",
      freq: 1200,
      Q: 1.5,
      gain: 0.4,
      decay: 0.05,
    }),
      this.noise(t + 0.05, {
        type: "lowpass",
        freq: 900,
        gain: 0.3,
        decay: 0.12,
      }));
  }
  magIn() {
    const t = this.now;
    (this.noise(t, { type: "lowpass", freq: 700, gain: 0.5, decay: 0.08 }),
      this.tone(t, {
        type: "sine",
        freq: 180,
        freqEnd: 60,
        gain: 0.35,
        decay: 0.07,
      }),
      this.noise(t + 0.03, {
        type: "bandpass",
        freq: 2600,
        Q: 3,
        gain: 0.3,
        decay: 0.03,
      }));
  }
  bolt() {
    const t = this.now;
    (this.noise(t, {
      type: "bandpass",
      freq: 2e3,
      Q: 2,
      gain: 0.45,
      decay: 0.04,
    }),
      this.noise(t + 0.09, {
        type: "bandpass",
        freq: 1500,
        Q: 2,
        gain: 0.5,
        decay: 0.05,
      }),
      this.tone(t + 0.09, {
        type: "square",
        freq: 400,
        freqEnd: 120,
        gain: 0.1,
        decay: 0.04,
      }));
  }
  pump() {
    const t = this.now;
    (this.noise(t, {
      type: "bandpass",
      freq: 1300,
      Q: 1.5,
      gain: 0.5,
      decay: 0.06,
    }),
      this.noise(t + 0.13, {
        type: "bandpass",
        freq: 1700,
        Q: 1.5,
        gain: 0.55,
        decay: 0.06,
      }),
      this.tone(t + 0.13, {
        type: "triangle",
        freq: 320,
        freqEnd: 90,
        gain: 0.15,
        decay: 0.05,
      }));
  }
  shellIn() {
    const t = this.now;
    (this.noise(t, {
      type: "bandpass",
      freq: 1900,
      Q: 3,
      gain: 0.35,
      decay: 0.03,
    }),
      this.tone(t + 0.01, {
        type: "sine",
        freq: 260,
        freqEnd: 120,
        gain: 0.15,
        decay: 0.05,
      }));
  }
  weaponSwitch() {
    const t = this.now;
    (this.noise(t, {
      type: "bandpass",
      freq: 900,
      Q: 1,
      gain: 0.3,
      decay: 0.08,
    }),
      this.noise(t + 0.18, {
        type: "bandpass",
        freq: 2200,
        Q: 2,
        gain: 0.35,
        decay: 0.04,
      }));
  }
  hitmarker(t = !1) {
    const e = this.now;
    (this.tone(e, {
      type: "sine",
      freq: t ? 2600 : 1900,
      freqEnd: t ? 1800 : 1400,
      gain: 0.32,
      decay: 0.045,
    }),
      this.noise(e, { type: "highpass", freq: 5e3, gain: 0.18, decay: 0.02 }));
  }
  kill(t = !1) {
    const e = this.now;
    (this.tone(e, {
      type: "sine",
      freq: t ? 1320 : 990,
      gain: 0.3,
      decay: 0.07,
    }),
      this.tone(e + 0.06, {
        type: "sine",
        freq: t ? 1980 : 1480,
        gain: 0.3,
        decay: 0.12,
      }),
      this.noise(e, { type: "highpass", freq: 4e3, gain: 0.15, decay: 0.05 }));
  }
  impactWorld(t) {
    const e = this.spatial(t, 4, 40);
    if (e.gain < 0.02) return;
    const n = this.now;
    (this.noise(n, {
      type: "bandpass",
      freq: 2500 + Math.random() * 2e3,
      Q: 1.2,
      gain: 0.35 * e.gain,
      decay: 0.05,
      pan: e.pan,
      send: 0.3,
    }),
      this.tone(n, {
        type: "triangle",
        freq: 500 + Math.random() * 400,
        freqEnd: 150,
        gain: 0.08 * e.gain,
        decay: 0.05,
        pan: e.pan,
      }));
  }
  impactFlesh(t) {
    const e = this.spatial(t, 5, 40);
    if (e.gain < 0.02) return;
    const n = this.now;
    (this.noise(n, {
      type: "lowpass",
      freq: 900,
      freqEnd: 200,
      gain: 0.45 * e.gain,
      decay: 0.09,
      pan: e.pan,
      send: 0.2,
    }),
      this.tone(n, {
        type: "sine",
        freq: 200,
        freqEnd: 60,
        gain: 0.25 * e.gain,
        decay: 0.08,
        pan: e.pan,
      }));
  }
  // Keep the gameplay event API; these are now robot motor/diagnostic cues.
  enemyGrowl(position, heavy = false) {
    if (!this.ready) return;
    const now = this.now;
    if (now - this.lastGrowl < 0.28) return;
    this.lastGrowl = now;
    const { gain, pan } = this.spatial(position, 6, 50);
    if (gain < 0.03) return;
    this.tone(now, {
      type: "triangle",
      freq: heavy ? 145 : 480,
      freqEnd: heavy ? 85 : 260,
      gain: gain * 0.16,
      attack: 0.015,
      decay: heavy ? 0.48 : 0.25,
      pan,
      send: 0.16,
    });
    this.noise(now, {
      type: "bandpass",
      freq: heavy ? 700 : 1500,
      Q: 5,
      gain: gain * 0.12,
      attack: 0.01,
      decay: 0.16,
      pan,
    });
    this.tone(now + 0.055, {
      type: "sine",
      freq: heavy ? 380 : 980,
      freqEnd: heavy ? 250 : 720,
      gain: gain * 0.065,
      decay: 0.1,
      pan,
    });
  }
  enemyDeath(position, heavy = false) {
    if (!this.ready) return;
    const { gain, pan } = this.spatial(position, 6, 60);
    if (gain < 0.02) return;
    const now = this.now;
    this.noise(now, {
      type: "highpass",
      freq: 2200,
      gain: gain * 0.38,
      decay: 0.09,
      pan,
      send: 0.15,
    });
    this.tone(now, {
      type: "triangle",
      freq: heavy ? 230 : 670,
      freqEnd: 38,
      gain: gain * 0.2,
      decay: heavy ? 0.55 : 0.32,
      pan,
    });
    for (let i = 0; i < 3; i++)
      this.noise(now + 0.08 + i * 0.09, {
        type: "bandpass",
        freq: 900 + i * 740,
        Q: 7,
        gain: gain * (0.18 - i * 0.035),
        decay: 0.055,
        pan,
        send: 0.14,
      });
    this.tone(now + 0.04, {
      type: "sine",
      freq: heavy ? 80 : 130,
      freqEnd: 35,
      gain: gain * 0.3,
      decay: 0.18,
      pan,
    });
  }
  bruteSlam(t) {
    const e = this.spatial(t, 8, 70),
      n = this.now;
    (this.tone(n, {
      type: "sine",
      freq: 70,
      freqEnd: 25,
      gain: 1 * Math.max(0.3, e.gain),
      decay: 0.45,
      pan: e.pan,
      send: 0.6,
    }),
      this.noise(n, {
        type: "lowpass",
        freq: 500,
        freqEnd: 80,
        gain: 0.8 * Math.max(0.3, e.gain),
        decay: 0.5,
        pan: e.pan,
        send: 0.6,
      }));
  }
  spit(t) {
    const e = this.spatial(t, 6, 50);
    if (e.gain < 0.02) return;
    const n = this.now;
    (this.noise(n, {
      type: "bandpass",
      freq: 600,
      freqEnd: 2400,
      Q: 2,
      gain: 0.4 * e.gain,
      attack: 0.03,
      decay: 0.2,
      pan: e.pan,
      send: 0.3,
    }),
      this.tone(n, {
        type: "sawtooth",
        freq: 220,
        freqEnd: 880,
        gain: 0.12 * e.gain,
        attack: 0.03,
        decay: 0.18,
        pan: e.pan,
      }));
  }
  splash(t) {
    const e = this.spatial(t, 5, 40);
    if (e.gain < 0.02) return;
    const n = this.now;
    this.noise(n, {
      type: "bandpass",
      freq: 1200,
      freqEnd: 300,
      Q: 1,
      gain: 0.5 * e.gain,
      decay: 0.2,
      pan: e.pan,
      send: 0.4,
    });
  }
  playerHurt(t) {
    const e = this.now,
      n = Math.min(1, 0.4 + t / 40);
    (this.tone(e, {
      type: "sine",
      freq: 80,
      freqEnd: 30,
      gain: 0.9 * n,
      decay: 0.25,
    }),
      this.noise(e, {
        type: "lowpass",
        freq: 700,
        freqEnd: 100,
        gain: 0.5 * n,
        decay: 0.25,
        send: 0.3,
      }),
      this.noise(e, {
        type: "highpass",
        freq: 5e3,
        gain: 0.25 * n,
        decay: 0.03,
      }));
  }
  heartbeat() {
    const t = this.now;
    (this.tone(t, {
      type: "sine",
      freq: 55,
      freqEnd: 35,
      gain: 0.7,
      decay: 0.12,
    }),
      this.tone(t + 0.22, {
        type: "sine",
        freq: 50,
        freqEnd: 30,
        gain: 0.5,
        decay: 0.12,
      }));
  }
  footstep(t = 1) {
    const e = this.now;
    (this.noise(e, {
      type: "bandpass",
      freq: 250 + Math.random() * 150,
      Q: 0.8,
      gain: 0.2 * t,
      decay: 0.07,
    }),
      this.noise(e, {
        type: "highpass",
        freq: 3e3,
        gain: 0.05 * t,
        decay: 0.03,
      }));
  }
  land(t) {
    const e = this.now;
    (this.noise(e, { type: "lowpass", freq: 500, gain: 0.5 * t, decay: 0.12 }),
      this.tone(e, {
        type: "sine",
        freq: 90,
        freqEnd: 40,
        gain: 0.5 * t,
        decay: 0.12,
      }));
  }
  jump() {
    this.noise(this.now, {
      type: "bandpass",
      freq: 500,
      Q: 0.7,
      gain: 0.15,
      decay: 0.08,
    });
  }
  slide() {
    const t = this.now;
    this.noise(t, {
      type: "bandpass",
      freq: 700,
      freqEnd: 250,
      Q: 0.6,
      gain: 0.35,
      attack: 0.03,
      decay: 0.55,
    });
  }
  pickup() {
    const t = this.now;
    [880, 1320, 1760].forEach((e, n) =>
      this.tone(t + n * 0.06, {
        type: "sine",
        freq: e,
        gain: 0.25,
        decay: 0.12,
      }),
    );
  }
  waveStart() {
    if (!this.ready || !this.ambienceOn) return;
    const t = this.now;
    (this.tone(t, {
      type: "sawtooth",
      freq: 110,
      freqEnd: 55,
      gain: 0.5,
      attack: 0.05,
      decay: 0.9,
      send: 0.7,
    }),
      this.tone(t + 0.3, {
        type: "square",
        freq: 165,
        freqEnd: 82,
        gain: 0.25,
        attack: 0.05,
        decay: 0.8,
        send: 0.7,
      }),
      this.noise(t, {
        type: "lowpass",
        freq: 400,
        freqEnd: 60,
        gain: 0.6,
        attack: 0.05,
        decay: 1,
        send: 0.6,
      }));
  }
  waveClear() {
    if (!this.ready || !this.ambienceOn) return;
    const t = this.now;
    [57, 64, 69, 76].forEach((e, n) => {
      (this.tone(t + n * 0.12, {
        type: "triangle",
        freq: midiToHz(e),
        gain: 0.35,
        attack: 0.01,
        decay: 0.5,
        send: 0.6,
      }),
        this.tone(t + n * 0.12, {
          type: "sine",
          freq: midiToHz(e + 12),
          gain: 0.15,
          attack: 0.01,
          decay: 0.4,
          send: 0.6,
        }));
    });
  }
  gameOver() {
    const t = this.now;
    (this.tone(t, {
      type: "sawtooth",
      freq: 110,
      freqEnd: 40,
      gain: 0.6,
      attack: 0.1,
      decay: 2.5,
      send: 0.8,
    }),
      this.noise(t, {
        type: "lowpass",
        freq: 800,
        freqEnd: 60,
        gain: 0.5,
        attack: 0.1,
        decay: 2,
        send: 0.7,
      }));
  }
  _startAmbience() {
    const ctx = this.ctx;
    const bus = ctx.createGain();
    bus.gain.value = this.ambienceOn ? this.sfxVol : 0;
    bus.connect(this.master);
    this.ambBus = bus;
    // Quiet, continuously modulated road wash and ventilation. Everything
    // routes through the existing ambience toggle, SFX slider and master.
    const wash = ctx.createBufferSource();
    wash.buffer = this.noiseBuf;
    wash.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    const level = ctx.createGain();
    level.gain.value = 0.085;
    const motion = ctx.createOscillator();
    motion.frequency.value = 0.055;
    const motionDepth = ctx.createGain();
    motionDepth.gain.value = 0.023;
    motion.connect(motionDepth);
    motionDepth.connect(level.gain);
    wash.connect(filter);
    filter.connect(level);
    level.connect(bus);
    wash.start();
    motion.start();
    this.ambGain = level;
    for (const frequency of [60, 120.3]) {
      const motor = ctx.createOscillator();
      motor.type = "sine";
      motor.frequency.value = frequency;
      const gain = ctx.createGain();
      gain.gain.value = 0.014;
      motor.connect(gain);
      gain.connect(bus);
      motor.start();
    }
  }
  _mtone(
    t,
    {
      type: e = "sine",
      freq: n = 110,
      freqEnd: s = null,
      gain: r = 0.3,
      attack: a = 0.005,
      decay: l = 0.2,
      filter: o = null,
    },
  ) {
    const c = this.ctx,
      h = c.createOscillator();
    ((h.type = e),
      h.frequency.setValueAtTime(n, t),
      s && h.frequency.exponentialRampToValueAtTime(s, t + a + l));
    const d = c.createGain();
    if (
      (d.gain.setValueAtTime(1e-4, t),
      d.gain.linearRampToValueAtTime(r, t + a),
      d.gain.exponentialRampToValueAtTime(1e-4, t + a + l),
      o)
    ) {
      const u = c.createBiquadFilter();
      ((u.type = "lowpass"),
        (u.frequency.value = o),
        h.connect(u),
        u.connect(d));
    } else h.connect(d);
    (d.connect(this.musicLP), h.start(t), h.stop(t + a + l + 0.05));
  }
  _mnoise(
    t,
    { freq: e = 6e3, gain: n = 0.1, decay: s = 0.03, type: r = "highpass" },
  ) {
    const a = this.ctx,
      l = a.createBufferSource();
    ((l.buffer = this.noiseBuf), (l.loop = !0));
    const o = a.createBiquadFilter();
    ((o.type = r), (o.frequency.value = e));
    const c = a.createGain();
    (c.gain.setValueAtTime(n, t),
      c.gain.exponentialRampToValueAtTime(1e-4, t + s),
      l.connect(o),
      o.connect(c),
      c.connect(this.musicLP),
      l.start(t, Math.random()),
      l.stop(t + s + 0.05));
  }
  update(t, e) {
    if (!this.ready) return;
    const n = this.ctx;
    e < 0.35 &&
      e > 0 &&
      ((this._heartT -= t),
      this._heartT <= 0 && (this.heartbeat(), (this._heartT = 0.75 + e)));
    const r = 60 / 132 / 2,
      a = this.musicOn
        ? this.intensity >= 2
          ? 0.34
          : this.intensity === 1
            ? 0.2
            : 0.08
        : 0;
    (this.musicBus.gain.setTargetAtTime(a * this.musicVol, n.currentTime, 0.5),
      this.musicLP.frequency.setTargetAtTime(
        e < 0.35 ? 600 : 4500,
        n.currentTime,
        0.4,
      ));
    const l = [45, 45, 45, 48, 45, 45, 43, 40, 45, 45, 45, 48, 50, 48, 43, 41];
    for (; this._nextBeat < n.currentTime + 0.25;) {
      const o = this._nextBeat,
        c = this._beat,
        h = this.intensity;
      if (h >= 1)
        if (
          (c % 2 === 0 &&
            this._mtone(o, {
              type: "sine",
              freq: 160,
              freqEnd: 38,
              gain: h >= 2 ? 0.9 : 0.55,
              decay: 0.22,
            }),
          h >= 2)
        ) {
          (this._mnoise(o, {
            freq: 7e3,
            gain: c % 2 === 1 ? 0.12 : 0.05,
            decay: 0.035,
          }),
            c % 8 === 4 &&
              this._mnoise(o, {
                freq: 1800,
                gain: 0.25,
                decay: 0.12,
                type: "bandpass",
              }));
          const d = l[c % 16];
          (this._mtone(o, {
            type: "sawtooth",
            freq: midiToHz(d),
            gain: 0.28,
            attack: 0.01,
            decay: r * 0.9,
            filter: 900,
          }),
            this._mtone(o, {
              type: "square",
              freq: midiToHz(d - 12),
              gain: 0.12,
              attack: 0.01,
              decay: r * 0.8,
              filter: 500,
            }),
            c % 32 === 0 &&
              [69, 72, 76].forEach((u, m) =>
                this._mtone(o + m * 0.02, {
                  type: "triangle",
                  freq: midiToHz(u),
                  gain: 0.12,
                  attack: 0.05,
                  decay: 1.6,
                  filter: 3e3,
                }),
              ));
        } else
          c % 16 === 0 &&
            this._mtone(o, {
              type: "triangle",
              freq: midiToHz(45),
              gain: 0.25,
              attack: 0.1,
              decay: 1.8,
              filter: 800,
            });
      ((this._nextBeat += r), this._beat++);
    }
  }
}
