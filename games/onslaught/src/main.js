import {
  Vector3,
  Vector2,
  Quaternion,
  Euler,
  Matrix4,
  Color,
  MathUtils,
  Object3D,
  Group,
  Scene,
  Mesh,
  InstancedMesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  ShaderMaterial,
  MeshDepthMaterial,
  BufferGeometry,
  InstancedBufferGeometry,
  BufferAttribute,
  Float32BufferAttribute,
  InstancedBufferAttribute,
  BoxGeometry,
  PlaneGeometry,
  SphereGeometry,
  CylinderGeometry,
  ConeGeometry,
  TorusGeometry,
  CircleGeometry,
  OctahedronGeometry,
  PerspectiveCamera,
  OrthographicCamera,
  WebGLRenderer,
  WebGLRenderTarget,
  PMREMGenerator,
  PointLight,
  DirectionalLight,
  HemisphereLight,
  FogExp2,
  DynamicDrawUsage,
  HalfFloatType,
  LinearFilter,
  BackSide,
  DoubleSide,
  FrontSide,
  NormalBlending,
  AdditiveBlending,
  CustomBlending,
  AddEquation,
  OneFactor,
  PCFSoftShadowMap,
  NoToneMapping,
  RGBADepthPacking,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

class h0 {
  constructor(t) {
    ((this.canvas = t),
      (this.keys = new Set()),
      (this.pressed = new Set()),
      (this.mouseDown = [!1, !1, !1]),
      (this.mousePressed = [!1, !1, !1]),
      (this.dx = 0),
      (this.dy = 0),
      (this.wheel = 0),
      (this.locked = !1),
      (this.sensitivity = 1),
      (this.onLockChange = null),
      (this.onKeyDown = null),
      window.addEventListener("keydown", (e) => {
        e.repeat ||
          (this.keys.add(e.code),
          this.pressed.add(e.code),
          this.onKeyDown && this.onKeyDown(e.code),
          [
            "Space",
            "Tab",
            "KeyW",
            "KeyA",
            "KeyS",
            "KeyD",
            "ShiftLeft",
          ].includes(e.code) && e.preventDefault());
      }),
      window.addEventListener("keyup", (e) => this.keys.delete(e.code)),
      window.addEventListener("blur", () => {
        (this.keys.clear(), (this.mouseDown = [!1, !1, !1]));
      }),
      t.addEventListener("mousedown", (e) => {
        this.locked &&
          ((this.mouseDown[e.button] = !0),
          (this.mousePressed[e.button] = !0),
          e.preventDefault());
      }),
      window.addEventListener("mouseup", (e) => {
        this.mouseDown[e.button] = !1;
      }),
      window.addEventListener("contextmenu", (e) => e.preventDefault()),
      window.addEventListener("mousemove", (e) => {
        this.locked && ((this.dx += e.movementX), (this.dy += e.movementY));
      }),
      window.addEventListener(
        "wheel",
        (e) => {
          this.locked && (this.wheel += Math.sign(e.deltaY));
        },
        { passive: !0 },
      ),
      document.addEventListener("pointerlockchange", () => {
        ((this.locked = document.pointerLockElement === t),
          this.locked || (this.keys.clear(), (this.mouseDown = [!1, !1, !1])),
          this.onLockChange && this.onLockChange(this.locked));
      }),
      document.addEventListener("pointerlockerror", () => {
        this.onLockChange && this.onLockChange(!1);
      }));
  }
  lock() {
    try {
      const t = this.canvas.requestPointerLock({ unadjustedMovement: !0 });
      t &&
        t.catch &&
        t.catch(() => {
          try {
            this.canvas.requestPointerLock();
          } catch {}
        });
    } catch {
      try {
        this.canvas.requestPointerLock();
      } catch {}
    }
  }
  unlock() {
    document.pointerLockElement && document.exitPointerLock();
  }
  key(t) {
    return this.keys.has(t);
  }
  justPressed(t) {
    return this.pressed.has(t);
  }
  endFrame() {
    (this.pressed.clear(),
      (this.mousePressed = [!1, !1, !1]),
      (this.dx = 0),
      (this.dy = 0),
      (this.wheel = 0));
  }
}
function u0(i, t) {
  const e = Math.floor(i.sampleRate * t),
    n = i.createBuffer(1, e, i.sampleRate),
    s = n.getChannelData(0);
  for (let r = 0; r < e; r++) s[r] = Math.random() * 2 - 1;
  return n;
}
function d0(i, t, e) {
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
const xi = (i) => 440 * Math.pow(2, (i - 69) / 12);
class f0 {
  constructor() {
    ((this.ctx = null),
      (this.ready = !1),
      (this.musicOn = !0),
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
      (this.reverb.buffer = d0(t, 1.8, 2.6)),
      (this.revGain = t.createGain()),
      (this.revGain.gain.value = 0.55),
      this.reverb.connect(this.revGain),
      this.revGain.connect(this.master),
      (this.musicBus = t.createGain()),
      (this.musicBus.gain.value = 0.32),
      this.musicBus.connect(this.master),
      (this.musicLP = t.createBiquadFilter()),
      (this.musicLP.type = "lowpass"),
      (this.musicLP.frequency.value = 4e3),
      this.musicLP.connect(this.musicBus),
      (this.noiseBuf = u0(t, 2)),
      (this.ready = !0),
      this._startAmbience(),
      (this._nextBeat = t.currentTime + 0.1));
  }
  resume() {
    this.ctx && this.ctx.state === "suspended" && this.ctx.resume();
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
      h.gain.linearRampToValueAtTime(s, t + r),
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
  gunshot(t) {
    if (!this.ready) return;
    const e = this.now,
      n = 0.94 + Math.random() * 0.12;
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
  enemyGrowl(t, e = !1) {
    const n = this.now;
    if (n - this.lastGrowl < 0.28) return;
    this.lastGrowl = n;
    const s = this.spatial(t, 6, 50);
    if (s.gain < 0.03) return;
    const r = e ? 55 : 85 + Math.random() * 40;
    (this.tone(n, {
      type: "sawtooth",
      freq: r,
      freqEnd: r * 0.7,
      gain: (e ? 0.5 : 0.28) * s.gain,
      attack: 0.05,
      decay: e ? 0.7 : 0.4,
      pan: s.pan,
      send: 0.5,
    }),
      this.tone(n, {
        type: "square",
        freq: r * 1.5,
        freqEnd: r * 0.9,
        gain: 0.08 * s.gain,
        attack: 0.05,
        decay: 0.35,
        pan: s.pan,
        send: 0.4,
        detune: 12,
      }),
      this.noise(n, {
        type: "bandpass",
        freq: 400,
        Q: 1,
        gain: 0.2 * s.gain,
        attack: 0.03,
        decay: 0.3,
        pan: s.pan,
      }));
  }
  enemyDeath(t, e = !1) {
    const n = this.spatial(t, 6, 60);
    if (n.gain < 0.02) return;
    const s = this.now;
    (this.noise(s, {
      type: "lowpass",
      freq: e ? 1600 : 2400,
      freqEnd: 120,
      gain: (e ? 0.9 : 0.55) * n.gain,
      decay: e ? 0.6 : 0.35,
      pan: n.pan,
      send: 0.5,
    }),
      this.tone(s, {
        type: "sawtooth",
        freq: e ? 90 : 160,
        freqEnd: 30,
        gain: 0.35 * n.gain,
        decay: e ? 0.5 : 0.3,
        pan: n.pan,
        send: 0.4,
      }),
      this.tone(s, {
        type: "sine",
        freq: e ? 70 : 110,
        freqEnd: 28,
        gain: 0.5 * n.gain,
        decay: 0.25,
        pan: n.pan,
      }));
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
    const t = this.now;
    [57, 64, 69, 76].forEach((e, n) => {
      (this.tone(t + n * 0.12, {
        type: "triangle",
        freq: xi(e),
        gain: 0.35,
        attack: 0.01,
        decay: 0.5,
        send: 0.6,
      }),
        this.tone(t + n * 0.12, {
          type: "sine",
          freq: xi(e + 12),
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
    const t = this.ctx,
      e = t.createGain();
    ((e.gain.value = 0.11), e.connect(this.master));
    const n = t.createBiquadFilter();
    ((n.type = "lowpass"),
      (n.frequency.value = 180),
      n.connect(e),
      [55, 55.6, 82.4].forEach((c, h) => {
        const d = t.createOscillator();
        ((d.type = h === 2 ? "triangle" : "sawtooth"), (d.frequency.value = c));
        const u = t.createGain();
        ((u.gain.value = h === 2 ? 0.3 : 0.5),
          d.connect(u),
          u.connect(n),
          d.start());
      }));
    const s = t.createBufferSource();
    ((s.buffer = this.noiseBuf), (s.loop = !0));
    const r = t.createBiquadFilter();
    ((r.type = "bandpass"), (r.frequency.value = 400), (r.Q.value = 0.5));
    const a = t.createGain();
    a.gain.value = 0.05;
    const l = t.createOscillator();
    l.frequency.value = 0.07;
    const o = t.createGain();
    ((o.gain.value = 250),
      l.connect(o),
      o.connect(r.frequency),
      l.start(),
      s.connect(r),
      r.connect(a),
      a.connect(this.master),
      s.start(),
      (this.ambGain = e));
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
    (this.musicBus.gain.setTargetAtTime(a, n.currentTime, 0.5),
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
            freq: xi(d),
            gain: 0.28,
            attack: 0.01,
            decay: r * 0.9,
            filter: 900,
          }),
            this._mtone(o, {
              type: "square",
              freq: xi(d - 12),
              gain: 0.12,
              attack: 0.01,
              decay: r * 0.8,
              filter: 500,
            }),
            c % 32 === 0 &&
              [69, 72, 76].forEach((u, m) =>
                this._mtone(o + m * 0.02, {
                  type: "triangle",
                  freq: xi(u),
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
              freq: xi(45),
              gain: 0.25,
              attack: 0.1,
              decay: 1.8,
              filter: 800,
            });
      ((this._nextBeat += r), this._beat++);
    }
  }
}
const Nn = `
float hash11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float hash31(vec3 p3){ p3 = fract(p3 * 0.1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }
vec3 hash33(vec3 p3){ p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
float noise2(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y);
}
float noise3(vec3 p){
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x), mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x), mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y), f.z);
}
float fbm2(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise2(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
float fbm3(vec3 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise3(p); p = p * 2.03 + vec3(1.7, 9.2, 3.1); a *= 0.5; } return v; }
`,
  // ---------------------------------------------------------------------------
  // ONSLAUGHT GAME CODE
  // Everything above this comment is bundled Three.js. Edit from here down:
  // arena, weapons, enemies, HUD, audio, postfx, and the Game class.
  // ---------------------------------------------------------------------------
  be = 36,
  Be = 9,
  xa = new Vector3(0.38, 0.72, 0.58).normalize();
function p0(i) {
  return function () {
    ((i |= 0), (i = (i + 1831565813) | 0));
    let t = Math.imul(i ^ (i >>> 15), 1 | i);
    return (
      (t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t),
      ((t ^ (t >>> 14)) >>> 0) / 4294967296
    );
  };
}
class As {
  constructor(t, e, n, s, r, a, l) {
    ((this.cx = t),
      (this.cz = e),
      (this.hx = n),
      (this.hz = s),
      (this.y0 = r),
      (this.y1 = a),
      (this.yaw = l),
      (this.c = Math.cos(l)),
      (this.s = Math.sin(l)),
      (this.r = Math.hypot(n, s)));
  }
  toLocal(t, e) {
    const n = t - this.cx,
      s = e - this.cz;
    return [n * this.c + s * this.s, -n * this.s + s * this.c];
  }
  toWorldDir(t, e) {
    return [t * this.c - e * this.s, t * this.s + e * this.c];
  }
}
class m0 {
  constructor(t) {
    ((this.scene = t),
      (this.radius = be),
      (this.boxes = []),
      (this.gates = []),
      (this.timeUniform = { value: 0 }),
      (this.portalMats = []),
      (this.rng = p0(1337)),
      (this._tmp = new Vector3()),
      this._build());
  }
  _materials() {
    const t = this.timeUniform;
    this.mats = {
      wall: new MeshStandardMaterial({
        color: 4607322,
        roughness: 0.65,
        metalness: 0.2,
      }),
      dark: new MeshStandardMaterial({
        color: 3488580,
        roughness: 0.75,
        metalness: 0.1,
      }),
      pillar: new MeshStandardMaterial({
        color: 4080976,
        roughness: 0.6,
        metalness: 0.25,
      }),
      crate: new MeshStandardMaterial({
        color: 4475733,
        roughness: 0.7,
        metalness: 0.2,
      }),
      barrier: new MeshStandardMaterial({
        color: 4870491,
        roughness: 0.6,
        metalness: 0.25,
      }),
      emCyan: new MeshStandardMaterial({
        color: 0,
        emissive: 4644095,
        emissiveIntensity: 1.5,
        roughness: 1,
        metalness: 0,
      }),
      emCyanDim: new MeshStandardMaterial({
        color: 0,
        emissive: 2792640,
        emissiveIntensity: 0.8,
        roughness: 1,
        metalness: 0,
      }),
      emOrange: new MeshStandardMaterial({
        color: 0,
        emissive: 16738842,
        emissiveIntensity: 1.6,
        roughness: 1,
        metalness: 0,
      }),
      emWhite: new MeshStandardMaterial({
        color: 0,
        emissive: 16773853,
        emissiveIntensity: 1.2,
        roughness: 1,
        metalness: 0,
      }),
    };
    const e = new MeshStandardMaterial({
      color: 3818064,
      roughness: 0.5,
      metalness: 0.3,
    });
    ((e.onBeforeCompile = (n) => {
      ((n.uniforms.uTime = t),
        (n.vertexShader = n.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWPos;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
          )),
        (n.fragmentShader = n.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWPos; uniform float uTime;
${Nn}`,
          )
          .replace(
            "#include <map_fragment>",
            `
          #include <map_fragment>
          vec2 fp = vWPos.xz;
          float fr = length(fp);
          vec2 tile = fp / 3.0;
          vec2 tg = abs(fract(tile) - 0.5);
          float gap = smoothstep(0.462, 0.48, max(tg.x, tg.y));
          vec2 sg = abs(fract(tile * 3.0) - 0.5);
          float sub = smoothstep(0.47, 0.49, max(sg.x, sg.y)) * (1.0 - gap);
          float wear = noise2(fp * 0.7) * 0.6 + noise2(fp * 4.0) * 0.4;
          float grime = smoothstep(0.35, 0.75, fbm2(fp * 0.35 + 3.0));
          vec2 cellId = floor(tile);
          float cellVar = hash21(cellId) * 0.25;
          diffuseColor.rgb *= (0.8 + 0.4 * wear + cellVar) * (1.0 - 0.35 * sub) * (1.0 - 0.45 * grime);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.015, 0.018, 0.025), gap);
          float ring = smoothstep(0.12, 0.0, abs(fr - (ARENA_RADIUS - 0.9)));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.02), ring);
        `.replace("ARENA_RADIUS", be.toFixed(1)),
          )
          .replace(
            "#include <roughnessmap_fragment>",
            `
          #include <roughnessmap_fragment>
          roughnessFactor = clamp(roughnessFactor * (0.75 + 0.5 * wear) + gap * 0.4 + grime * 0.3, 0.05, 1.0);
        `,
          )
          .replace(
            "#include <emissivemap_fragment>",
            `
          #include <emissivemap_fragment>
          float pulse = 0.5 + 0.5 * sin(fr * 0.55 - uTime * 2.2);
          pulse = pulse * pulse * pulse;
          float ripple = smoothstep(0.9, 1.0, 1.0 - abs(fract(fr * 0.08 - uTime * 0.07) - 0.5) * 2.0);
          totalEmissiveRadiance += vec3(0.15, 0.75, 1.0) * gap * (0.05 + 0.25 * pulse + 0.3 * ripple);
          totalEmissiveRadiance += vec3(0.2, 0.8, 1.0) * ring * 1.0;
          totalEmissiveRadiance += vec3(1.0, 0.45, 0.15) * smoothstep(0.985, 1.0, hash21(cellId + 0.5)) * (1.0 - gap) * (0.5 + 0.5 * sin(uTime * 3.0 + hash21(cellId) * 20.0)) * 0.35;
        `,
          )));
    }),
      (e.customProgramCacheKey = () => "arenaFloor"),
      (this.mats.floor = e));
  }
  _build() {
    this._materials();
    const t = this.scene,
      e = this.mats,
      n = new PlaneGeometry(240, 240, 1, 1);
    n.rotateX(-Math.PI / 2);
    const s = new Mesh(n, e.floor);
    ((s.receiveShadow = !0), t.add(s));
    const r = new CylinderGeometry(7, 8.5, 0.5, 8, 1, !1);
    r.rotateY(Math.PI / 8);
    const a = new Mesh(r, e.pillar);
    ((a.position.y = 0.25),
      (a.receiveShadow = !0),
      (a.castShadow = !0),
      t.add(a));
    const l = new TorusGeometry(7.05, 0.05, 6, 8);
    (l.rotateX(Math.PI / 2), l.rotateY(Math.PI / 8));
    const o = new Mesh(l, e.emCyan);
    ((o.position.y = 0.5),
      t.add(o),
      this._buildHexTop(),
      this._buildHologram());
    const c = [],
      h = [],
      d = [],
      u = [],
      m = [],
      g = 24;
    for (let z = 0; z < g; z++) {
      const U = (z / g) * Math.PI * 2,
        H = z % 4 === 2,
        k = Math.cos(U) * (be + 0.6),
        G = Math.sin(U) * (be + 0.6),
        q = -U + Math.PI / 2;
      if (H) {
        for (const Y of [-3.4, 3.4]) {
          const it = new BoxGeometry(1.3, Be + 0.6, 1.6);
          (it.translate(Y, (Be + 0.6) / 2, 0),
            this._place(it, k, G, q),
            c.push(it));
          const vt = new BoxGeometry(0.12, Be - 1.5, 0.08);
          (vt.translate(Y + (Y < 0 ? 0.66 : -0.66), (Be - 1.5) / 2 + 0.4, -0.8),
            this._place(vt, k, G, q),
            u.push(vt));
        }
        const O = new BoxGeometry(8.1, 1.6, 1.6);
        (O.translate(0, Be - 0.2, 0), this._place(O, k, G, q), c.push(O));
        const et = new BoxGeometry(5.6, 0.12, 0.08);
        (et.translate(0, Be - 1.05, -0.8),
          this._place(et, k, G, q),
          u.push(et));
        const K = new BoxGeometry(8.2, Be + 1, 8);
        (K.translate(0, (Be + 1) / 2, 4.6), this._place(K, k, G, q), m.push(K));
        const nt = this._makePortal();
        (nt.position.set(
          Math.cos(U) * (be + 0.2),
          3.9,
          Math.sin(U) * (be + 0.2),
        ),
          (nt.rotation.y = q),
          t.add(nt));
        const _t = new Vector3(-Math.cos(U), 0, -Math.sin(U)),
          Lt = new PointLight(16738850, 40, 26, 2);
        (Lt.position.set(
          Math.cos(U) * (be - 2.2),
          3.2,
          Math.sin(U) * (be - 2.2),
        ),
          t.add(Lt),
          this.gates.push({
            pos: new Vector3(
              Math.cos(U) * (be - 1.4),
              0,
              Math.sin(U) * (be - 1.4),
            ),
            dir: _t,
            mat: nt.material,
            light: Lt,
            activity: 0,
            angle: U,
          }));
      } else {
        const O = new BoxGeometry(9.7, Be, 1.2);
        (O.translate(0, Be / 2, 0), this._place(O, k, G, q), c.push(O));
        for (const _t of [-3.2, 3.2]) {
          const Lt = new BoxGeometry(0.5, Be, 0.4);
          (Lt.translate(_t, Be / 2, -0.7),
            this._place(Lt, k, G, q),
            m.push(Lt));
        }
        const et = new BoxGeometry(9.5, 0.09, 0.06);
        (et.translate(0, 3.6, -0.63), this._place(et, k, G, q), h.push(et));
        const K = new BoxGeometry(9.5, 0.06, 0.06);
        (K.translate(0, 0.35, -0.63), this._place(K, k, G, q), d.push(K));
        const nt = new BoxGeometry(9.5, 0.05, 0.06);
        (nt.translate(0, 8.4, -0.63), this._place(nt, k, G, q), d.push(nt));
      }
    }
    const v = (z, U, H = !0) => {
      if (!z.length) return;
      const k = new Mesh(mergeGeometries(z, !1), U);
      return ((k.castShadow = H), (k.receiveShadow = H), t.add(k), k);
    };
    (v(c, e.wall),
      v(m, e.dark),
      v(h, e.emCyan, !1),
      v(d, e.emCyanDim, !1),
      v(u, e.emOrange, !1));
    const p = [],
      f = [];
    for (let z = 0; z < 8; z++) {
      const U = (z / 8) * Math.PI * 2 + Math.PI / 8,
        H = Math.cos(U) * 19,
        k = Math.sin(U) * 19,
        G = new BoxGeometry(1.7, 10, 1.7);
      (G.translate(H, 5, k), p.push(G));
      const q = new BoxGeometry(2.1, 0.5, 2.1);
      (q.translate(H, 10.1, k), p.push(q));
      const O = new BoxGeometry(2.3, 0.35, 2.3);
      (O.translate(H, 0.17, k), p.push(O));
      for (const et of [1.4, 6.8]) {
        const K = new BoxGeometry(1.82, 0.12, 1.82);
        (K.translate(H, et, k), f.push(K));
      }
      (this.boxes.push(new As(H, k, 0.85, 0.85, 0, 10, 0)),
        this.boxes.push(new As(H, k, 1.15, 1.15, 0, 0.35, 0)));
    }
    v(p, e.pillar);
    for (let z = 0; z < 4; z++) {
      const U = (z / 4) * Math.PI * 2 + Math.PI / 4,
        H = new PointLight(10475775, 28, 40, 2);
      (H.position.set(Math.cos(U) * 27, 6.5, Math.sin(U) * 27), t.add(H));
    }
    v(f, e.emCyan, !1);
    const w = [],
      M = [];
    for (let z = 0; z < 8; z++) {
      const U = (z / 8) * Math.PI * 2,
        H = z % 2 === 0 ? 12.5 : 26,
        k = Math.cos(U) * H,
        G = Math.sin(U) * H,
        q = -U + Math.PI / 2,
        O = z % 2 === 0 ? 4.2 : 5.5,
        et = new RoundedBoxGeometry(O, 2.1, 0.55, 2, 0.06);
      (et.translate(0, 1.05, 0), this._place(et, k, G, q), w.push(et));
      const K = new BoxGeometry(O - 0.6, 0.06, 0.04);
      (K.translate(0, 2, -0.29), this._place(K, k, G, q), M.push(K));
      const nt = new BoxGeometry(O - 0.6, 0.06, 0.04);
      (nt.translate(0, 2, 0.29),
        this._place(nt, k, G, q),
        M.push(nt),
        this.boxes.push(new As(k, G, O / 2, 0.28, 0, 2.1, q)));
    }
    (v(w, e.barrier), v(M, e.emOrange, !1));
    const _ = [],
      L = [],
      R = [
        [1.6, 1.6, 1.6],
        [1.2, 1.2, 1.2],
        [2.4, 1.2, 1.2],
        [1.3, 1.3, 1.3],
        [2, 1, 1.4],
      ];
    let A = 0,
      C = 0;
    for (; A < 16 && C < 400;) {
      C++;
      const z = 9 + this.rng() * 22,
        U = this.rng() * Math.PI * 2,
        H = Math.cos(U) * z,
        k = Math.sin(U) * z;
      let G = !0;
      for (const _t of this.gates)
        Math.hypot(H - _t.pos.x, k - _t.pos.z) < 7 && (G = !1);
      for (const _t of this.boxes)
        Math.hypot(H - _t.cx, k - _t.cz) < _t.r + 2.4 && (G = !1);
      if (!G) continue;
      const q = R[Math.floor(this.rng() * R.length)],
        O = this.rng() * Math.PI,
        et = new RoundedBoxGeometry(q[0], q[1], q[2], 2, 0.05);
      (et.translate(0, q[1] / 2, 0), this._place(et, H, k, O), _.push(et));
      const K = new BoxGeometry(q[0] * 0.7, 0.05, 0.03);
      (K.translate(0, q[1] * 0.72, -q[2] / 2 - 0.005),
        this._place(K, H, k, O),
        L.push(K));
      const nt = new BoxGeometry(q[0] * 0.7, 0.05, 0.03);
      (nt.translate(0, q[1] * 0.72, q[2] / 2 + 0.005),
        this._place(nt, H, k, O),
        L.push(nt),
        this.boxes.push(new As(H, k, q[0] / 2, q[2] / 2, 0, q[1], O)),
        A++);
    }
    (v(_, e.crate), v(L, (this.rng() > 0.5, e.emCyanDim), !1));
    const S = new DirectionalLight(13622527, 3.6);
    (S.position.copy(xa).multiplyScalar(90),
      (S.castShadow = !0),
      S.shadow.mapSize.set(2048, 2048),
      (S.shadow.camera.left = -44),
      (S.shadow.camera.right = 44),
      (S.shadow.camera.top = 44),
      (S.shadow.camera.bottom = -44),
      (S.shadow.camera.near = 20),
      (S.shadow.camera.far = 180),
      (S.shadow.bias = -6e-4),
      (S.shadow.normalBias = 0.03),
      (S.shadow.radius = 3),
      t.add(S),
      t.add(S.target),
      (this.sun = S));
    const y = new HemisphereLight(5927072, 3025448, 1.9);
    t.add(y);
    const P = new PointLight(6222591, 30, 30, 2);
    (P.position.set(0, 5, 0),
      t.add(P),
      (this.centerLight = P),
      (t.fog = new FogExp2(1055276, 0.008)));
  }
  _place(t, e, n, s) {
    const r = new Matrix4().makeRotationY(s).setPosition(e, 0, n);
    t.applyMatrix4(r);
  }
  _makePortal() {
    const t = new PlaneGeometry(6.4, 7.6),
      e = new ShaderMaterial({
        transparent: !0,
        depthWrite: !1,
        side: DoubleSide,
        blending: AdditiveBlending,
        uniforms: { uTime: this.timeUniform, uActivity: { value: 0 } },
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uTime; uniform float uActivity; varying vec2 vUv;
        ${Nn}
        void main(){
          vec2 p = (vUv - 0.5) * vec2(6.4, 7.6) / 3.4;
          float r = length(p);
          float ang = atan(p.y, p.x);
          float n = fbm3(vec3(p * 1.6 + vec2(0.0, -uTime * 0.6), uTime * 0.25));
          float swirl = 0.5 + 0.5 * sin(ang * 3.0 + r * 7.0 - uTime * 3.5 + n * 5.0);
          float core = smoothstep(1.05, 0.15, r);
          float veins = smoothstep(0.45, 0.6, noise3(vec3(p * 4.0, uTime * 0.8 + n)));
          vec3 col = mix(vec3(0.9, 0.18, 0.03), vec3(1.0, 0.65, 0.2), n) * (0.35 + 0.65 * swirl) * core;
          col += vec3(1.0, 0.5, 0.15) * veins * core * 0.6;
          col += vec3(1.0, 0.85, 0.6) * smoothstep(0.35, 0.0, r) * (0.3 + uActivity);
          float rimA = smoothstep(0.08, 0.0, abs(r - 1.02)) * 0.9;
          col += vec3(1.0, 0.45, 0.12) * rimA;
          col *= 0.35 + uActivity * 0.8 + 0.08 * sin(uTime * 9.0);
          float a = core + rimA;
          gl_FragColor = vec4(col * a, a);
        }
      `,
      });
    return (this.portalMats.push(e), new Mesh(t, e));
  }
  _buildHexTop() {
    const t = new CircleGeometry(6.9, 8);
    (t.rotateX(-Math.PI / 2), t.rotateY(Math.PI / 8));
    const e = new ShaderMaterial({
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        uniforms: { uTime: this.timeUniform },
        vertexShader:
          "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uTime; varying vec3 vP;
        ${Nn}
        float hexDist(vec2 p){ p = abs(p); return max(dot(p, normalize(vec2(1.0, 1.73))), p.x); }
        vec4 hexCoords(vec2 uv){ vec2 r = vec2(1.0, 1.73); vec2 h = r * 0.5; vec2 a = mod(uv, r) - h; vec2 b = mod(uv - h, r) - h; vec2 gv = dot(a, a) < dot(b, b) ? a : b; float y = 0.5 - hexDist(gv); vec2 id = uv - gv; return vec4(gv, id); }
        void main(){
          vec2 p = vP.xz;
          float rr = length(p);
          vec4 hc = hexCoords(p * 1.1);
          float edge = smoothstep(0.07, 0.0, 0.5 - hexDist(hc.xy));
          float wave = pow(0.5 + 0.5 * sin(rr * 1.4 - uTime * 2.5), 3.0);
          float flick = smoothstep(0.75, 1.0, noise2(hc.zw * 0.35 + uTime * 0.5));
          vec3 col = vec3(0.2, 0.85, 1.0) * (edge * (0.1 + wave * 0.4) + flick * 0.15);
          col += vec3(0.6, 0.95, 1.0) * smoothstep(0.35, 0.0, rr) * (0.4 + 0.3 * sin(uTime * 2.0));
          float a = clamp(edge * 0.9 + flick * 0.5, 0.0, 1.0) * smoothstep(7.0, 6.2, rr);
          gl_FragColor = vec4(col * a, a);
        }
      `,
      }),
      n = new Mesh(t, e);
    ((n.position.y = 0.515), this.scene.add(n));
  }
  _buildHologram() {
    const t = new Group(),
      e = [this.mats.emCyan, this.mats.emCyanDim, this.mats.emWhite];
    for (let s = 0; s < 3; s++) {
      const r = new Mesh(new TorusGeometry(1.1 + s * 0.55, 0.035, 8, 64), e[s]);
      ((r.rotation.x = Math.PI / 2 + (s - 1) * 0.5), t.add(r));
    }
    const n = new Mesh(new OctahedronGeometry(0.45, 0), this.mats.emWhite);
    (t.add(n), t.position.set(0, 4.8, 0), this.scene.add(t), (this.holo = t));
  }
  groundHeight(t, e) {
    const n = Math.hypot(t, e);
    return 0.5 * MathUtils.clamp((8.5 - n) / 1.5, 0, 1);
  }
  resolveCircle(t, e, n, s = 0, r = 1.8, a = 0.35) {
    for (const c of this.boxes) {
      if (s >= c.y1 - a || s + r <= c.y0) continue;
      const h = t - c.cx,
        d = e - c.cz;
      if (h * h + d * d > (c.r + n) * (c.r + n)) continue;
      const [u, m] = c.toLocal(t, e),
        g = c.hx + n - Math.abs(u),
        v = c.hz + n - Math.abs(m);
      if (g <= 0 || v <= 0) continue;
      let p = 0,
        f = 0;
      g < v ? (p = g * Math.sign(u || 1)) : (f = v * Math.sign(m || 1));
      const [w, M] = c.toWorldDir(p, f);
      ((t += w), (e += M));
    }
    const l = Math.hypot(t, e),
      o = be - n - 0.3;
    return (l > o && ((t *= o / l), (e *= o / l)), [t, e]);
  }
  floorAt(t, e, n, s) {
    let r = this.groundHeight(t, e);
    for (const a of this.boxes) {
      if (a.y1 > s + 0.35) continue;
      const [l, o] = a.toLocal(t, e);
      Math.abs(l) <= a.hx + n * 0.6 &&
        Math.abs(o) <= a.hz + n * 0.6 &&
        (r = Math.max(r, a.y1));
    }
    return r;
  }
  raycast(t, e, n) {
    let s = n,
      r = 0,
      a = 1,
      l = 0,
      o = !1;
    if (e.y < -1e-6) {
      const c = -t.y / e.y;
      if (c > 0 && c < s) {
        const h = t.x + e.x * c,
          d = t.z + e.z * c;
        if (Math.hypot(h, d) < 8.5) {
          const m = (0.5 - t.y) / e.y,
            g = Math.hypot(t.x + e.x * m, t.z + e.z * m);
          if (m > 0 && g < 7) ((s = m), (r = 0), (a = 1), (l = 0), (o = !0));
          else {
            const v = (0.25 - t.y) / e.y;
            v > 0 && v < s && ((s = v), (r = 0), (a = 1), (l = 0), (o = !0));
          }
        } else ((s = c), (r = 0), (a = 1), (l = 0), (o = !0));
      }
    }
    for (const c of this.boxes) {
      const [h, d] = c.toLocal(t.x, t.z),
        u = e.x * c.c + e.z * c.s,
        m = -e.x * c.s + e.z * c.c;
      let g = 0,
        v = s,
        p = -1,
        f = !0;
      const w = [
        [h, u, c.hx],
        [t.y - (c.y0 + c.y1) / 2, e.y, (c.y1 - c.y0) / 2],
        [d, m, c.hz],
      ];
      for (let M = 0; M < 3 && f; M++) {
        const [_, L, R] = w[M];
        if (Math.abs(L) < 1e-8) {
          Math.abs(_) > R && (f = !1);
          continue;
        }
        let A = (-R - _) / L,
          C = (R - _) / L;
        if (A > C) {
          const S = A;
          ((A = C), (C = S));
        }
        (A > g && ((g = A), (p = M)), C < v && (v = C), g > v && (f = !1));
      }
      if (!(!f || p < 0 || g <= 0 || g >= s))
        if (((s = g), (o = !0), p === 1))
          ((r = 0), (a = e.y > 0 ? -1 : 1), (l = 0));
        else {
          const M = p === 0 ? -Math.sign(u) : -Math.sign(m),
            [_, L] = p === 0 ? c.toWorldDir(M, 0) : c.toWorldDir(0, M);
          ((r = _), (a = 0), (l = L));
        }
    }
    {
      const c = e.x * e.x + e.z * e.z;
      if (c > 1e-8) {
        const h = 2 * (t.x * e.x + t.z * e.z),
          d = t.x * t.x + t.z * t.z - be * be,
          u = h * h - 4 * c * d;
        if (u > 0) {
          const m = (-h + Math.sqrt(u)) / (2 * c);
          if (m > 0 && m < s) {
            const g = t.y + e.y * m;
            if (g > 0 && g < Be + 1) {
              ((s = m), (o = !0));
              const v = t.x + e.x * m,
                p = t.z + e.z * m,
                f = Math.hypot(v, p);
              ((r = -v / f), (a = 0), (l = -p / f));
            }
          }
        }
      }
    }
    return o
      ? {
          dist: s,
          point: new Vector3(t.x + e.x * s, t.y + e.y * s, t.z + e.z * s),
          normal: new Vector3(r, a, l),
        }
      : null;
  }
  update(t, e) {
    ((this.timeUniform.value = t),
      this.holo &&
        ((this.holo.rotation.y += e * 0.4),
        (this.holo.children[0].rotation.z += e * 0.7),
        (this.holo.children[1].rotation.x += e * 0.5),
        (this.holo.children[2].rotation.y -= e * 0.9),
        (this.holo.position.y = 4.8 + Math.sin(t * 0.8) * 0.2)));
    for (const n of this.gates)
      ((n.activity = Math.max(0, n.activity - e * 1.2)),
        (n.mat.uniforms.uActivity.value = n.activity),
        (n.light.intensity =
          40 + n.activity * 120 + Math.sin(t * 7 + n.angle) * 6));
    this.centerLight.intensity = 26 + Math.sin(t * 2) * 6;
  }
}
function g0(i) {
  const t = new SphereGeometry(700, 48, 24),
    e = new ShaderMaterial({
      side: BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: {
        uTime: { value: 0 },
        uMoonDir: { value: i.clone().normalize() },
        uHorizon: { value: new Color(660516) },
        uZenith: { value: new Color(132106) },
        uFog: { value: new Color(461588) },
      },
      vertexShader: `
      varying vec3 vWorldPos;
      void main(){
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
      fragmentShader: `
      uniform float uTime; uniform vec3 uMoonDir; uniform vec3 uHorizon; uniform vec3 uZenith; uniform vec3 uFog;
      varying vec3 vWorldPos;
      ${Nn}
      void main(){
        vec3 d = normalize(vWorldPos - cameraPosition);
        float h = d.y;
        // base gradient
        vec3 col = mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.45));
        col = mix(uFog, col, smoothstep(-0.05, 0.12, h));
        // nebula
        float n = fbm3(d * 2.2 + vec3(0.0, uTime * 0.004, 0.0));
        float n2 = fbm3(d * 5.0 - vec3(uTime * 0.003, 0.0, 0.0));
        float neb = smoothstep(0.42, 0.75, n) * smoothstep(0.0, 0.35, h);
        vec3 nebCol = mix(vec3(0.30, 0.08, 0.45), vec3(0.05, 0.35, 0.5), n2) * 0.55;
        col += nebCol * neb * (0.6 + 0.4 * n2);
        // stars
        vec3 sp = d * 90.0;
        vec3 cell = floor(sp);
        vec3 rnd = hash33(cell);
        float starDist = length(fract(sp) - rnd);
        float has = step(0.86, hash31(cell + 7.1));
        float tw = 0.65 + 0.35 * sin(uTime * (1.5 + rnd.z * 3.0) + rnd.x * 6.28);
        float star = has * smoothstep(0.12, 0.0, starDist) * tw * smoothstep(0.0, 0.25, h);
        vec3 starCol = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.85, 0.7), rnd.y);
        col += starCol * star * (1.0 + 2.5 * step(0.97, rnd.z));
        // moon
        float m = dot(d, uMoonDir);
        float disc = smoothstep(0.99700, 0.99760, m);
        vec3 t1 = normalize(cross(uMoonDir, vec3(0.0, 1.0, 0.0)));
        vec3 t2 = cross(uMoonDir, t1);
        vec2 mc = vec2(dot(d, t1), dot(d, t2)) / 0.075;
        float craters = fbm2(mc * 3.0 + 4.0);
        float craters2 = noise2(mc * 9.0);
        float shade = 0.55 + 0.45 * clamp(mc.x * 1.2 + 0.4, -1.0, 1.0);
        vec3 moonCol = vec3(1.0, 0.93, 0.82) * (0.55 + 0.6 * craters - 0.25 * smoothstep(0.55, 0.75, craters2)) * shade;
        float limb = 1.0 - smoothstep(0.7, 1.0, length(mc));
        col = mix(col, moonCol * 1.9 * (0.6 + 0.4 * limb), disc);
        float glow = exp(-(1.0 - m) * 320.0) * 0.9 + exp(-(1.0 - m) * 45.0) * 0.22;
        col += vec3(0.9, 0.85, 0.75) * glow;
        // aurora
        float band = exp(-pow((h - 0.30) * 5.5, 2.0));
        float an = fbm3(vec3(d.xz * 2.5, uTime * 0.06));
        float curtain = 0.5 + 0.5 * sin(d.x * 14.0 + an * 9.0 + uTime * 0.25);
        curtain *= 0.5 + 0.5 * sin(d.z * 9.0 - an * 5.0 - uTime * 0.17);
        vec3 aurCol = mix(vec3(0.05, 0.9, 0.45), vec3(0.2, 0.35, 1.0), clamp((h - 0.2) * 3.0, 0.0, 1.0));
        col += aurCol * band * curtain * smoothstep(0.35, 0.75, an) * 0.55;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    }),
    n = new Mesh(t, e);
  return (
    (n.frustumCulled = !1),
    (n.renderOrder = -10),
    {
      mesh: n,
      update: (s) => {
        e.uniforms.uTime.value = s;
      },
    }
  );
}
const v0 = `
attribute vec3 aPos; attribute vec3 aVel; attribute vec2 aTime; attribute vec2 aSize; attribute vec4 aColor; attribute vec4 aMisc;
uniform float uTime;
varying vec2 vUv; varying vec4 vColor; varying float vType; varying float vLife; varying float vSeed;
void main(){
  float t = uTime - aTime.x;
  float life = aTime.y;
  float f = t / max(life, 1e-4);
  vUv = uv; vColor = aColor; vType = aMisc.z; vLife = f; vSeed = fract(aTime.x * 13.37);
  if (t < 0.0 || f > 1.0 || life <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float g = aMisc.x; float k = max(aMisc.y, 0.001); float type = aMisc.z; float extra = aMisc.w;
  vec3 grav = vec3(0.0, -g, 0.0);
  float e = exp(-k * t);
  vec3 p = aPos + (grav / k) * t + (aVel - grav / k) * (1.0 - e) / k;
  vec3 v = grav / k + (aVel - grav / k) * e;
  if (p.y < 0.02) { p.y = 0.02; }
  float size = mix(aSize.x, aSize.y, f);
  vec4 viewPos = viewMatrix * vec4(p, 1.0);
  vec2 offset;
  if (type < 0.5) {
    vec3 vv = (viewMatrix * vec4(v, 0.0)).xyz;
    vec2 d2 = vv.xy; float len = length(d2);
    vec2 axis = len > 1e-4 ? d2 / len : vec2(1.0, 0.0);
    vec2 perp = vec2(-axis.y, axis.x);
    float L = size * (1.0 + extra * len);
    offset = axis * (position.x * L) + perp * (position.y * size);
  } else {
    float ang = extra * t + aTime.x * 7.0;
    float c = cos(ang), s = sin(ang);
    vec2 q = position.xy * size;
    offset = vec2(q.x * c - q.y * s, q.x * s + q.y * c);
  }
  viewPos.xy += offset;
  gl_Position = projectionMatrix * viewPos;
}
`,
  _0 = `
varying vec2 vUv; varying vec4 vColor; varying float vType; varying float vLife; varying float vSeed;
${Nn}
void main(){
  vec2 uv = vUv - 0.5;
  float a;
  vec3 col = vColor.rgb * vColor.a;
  if (vType < 0.5) {
    float dx = abs(uv.x) * 2.0; float dy = abs(uv.y) * 2.0;
    a = 1.0 - smoothstep(0.0, 1.0, dy); a *= a; a *= 1.0 - smoothstep(0.5, 1.0, dx);
    a *= 1.0 - smoothstep(0.5, 1.0, vLife);
  } else if (vType < 1.5) {
    float r = length(uv) * 2.0;
    float n = fbm2(uv * 3.0 + vSeed * 10.0 + vec2(0.0, vLife * 0.6));
    a = smoothstep(1.0, 0.1, r + n * 0.6) * (0.55 + 0.45 * n);
    a *= (1.0 - smoothstep(0.25, 1.0, vLife)) * smoothstep(0.0, 0.08, vLife);
    col *= 0.65 + 0.35 * n;
  } else {
    float r = length(uv) * 2.0;
    a = exp(-r * r * 5.0) + 0.2 * smoothstep(1.0, 0.0, r);
    a *= 1.0 - smoothstep(0.55, 1.0, vLife);
  }
  gl_FragColor = vec4(col, a);
}
`;
class Zo {
  constructor(t, e) {
    const n = new PlaneGeometry(1, 1),
      s = new InstancedBufferGeometry();
    (s.setIndex(n.index),
      s.setAttribute("position", n.attributes.position),
      s.setAttribute("uv", n.attributes.uv),
      (this.n = t),
      (this.head = 0),
      (this.dirty = !1),
      (this.pos = new Float32Array(t * 3)),
      (this.vel = new Float32Array(t * 3)),
      (this.time = new Float32Array(t * 2)),
      (this.size = new Float32Array(t * 2)),
      (this.color = new Float32Array(t * 4)),
      (this.misc = new Float32Array(t * 4)),
      (this.attrs = {
        aPos: new InstancedBufferAttribute(this.pos, 3),
        aVel: new InstancedBufferAttribute(this.vel, 3),
        aTime: new InstancedBufferAttribute(this.time, 2),
        aSize: new InstancedBufferAttribute(this.size, 2),
        aColor: new InstancedBufferAttribute(this.color, 4),
        aMisc: new InstancedBufferAttribute(this.misc, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(DynamicDrawUsage),
        s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = t), (this.uTime = { value: 0 }));
    const r = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      vertexShader: v0,
      fragmentShader: _0,
      transparent: !0,
      depthWrite: !1,
      depthTest: !0,
      blending: e ? AdditiveBlending : NormalBlending,
    });
    ((this.mesh = new Mesh(s, r)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = e ? 20 : 19));
  }
  emit(t, e, n, s, r, a, l, o, c, h, d, u, m, g, v, p, f, w) {
    const M = this.head;
    ((this.head = (M + 1) % this.n),
      (this.dirty = !0),
      (this.pos[M * 3] = t),
      (this.pos[M * 3 + 1] = e),
      (this.pos[M * 3 + 2] = n),
      (this.vel[M * 3] = s),
      (this.vel[M * 3 + 1] = r),
      (this.vel[M * 3 + 2] = a),
      (this.time[M * 2] = l),
      (this.time[M * 2 + 1] = o),
      (this.size[M * 2] = c),
      (this.size[M * 2 + 1] = h),
      (this.color[M * 4] = d),
      (this.color[M * 4 + 1] = u),
      (this.color[M * 4 + 2] = m),
      (this.color[M * 4 + 3] = g),
      (this.misc[M * 4] = v),
      (this.misc[M * 4 + 1] = p),
      (this.misc[M * 4 + 2] = f),
      (this.misc[M * 4 + 3] = w));
  }
  flush(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
class x0 {
  constructor(t) {
    const e = new PlaneGeometry(1, 1);
    e.rotateX(-Math.PI / 2);
    const n = new InstancedBufferGeometry();
    (n.setIndex(e.index),
      n.setAttribute("position", e.attributes.position),
      n.setAttribute("uv", e.attributes.uv),
      (this.n = t),
      (this.head = 0),
      (this.dirty = !1),
      (this.pos = new Float32Array(t * 3)),
      (this.time = new Float32Array(t * 2)),
      (this.params = new Float32Array(t * 2)),
      (this.color = new Float32Array(t * 3)),
      (this.attrs = {
        aPos: new InstancedBufferAttribute(this.pos, 3),
        aTime: new InstancedBufferAttribute(this.time, 2),
        aParams: new InstancedBufferAttribute(this.params, 2),
        aColor: new InstancedBufferAttribute(this.color, 3),
      }));
    for (const r in this.attrs)
      (this.attrs[r].setUsage(DynamicDrawUsage),
        n.setAttribute(r, this.attrs[r]));
    ((n.instanceCount = t), (this.uTime = { value: 0 }));
    const s = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      blending: AdditiveBlending,
      vertexShader: `
        attribute vec3 aPos; attribute vec2 aTime; attribute vec2 aParams; attribute vec3 aColor; uniform float uTime;
        varying vec2 vUv; varying float vF; varying vec3 vColor; varying float vThick;
        void main(){
          float f = (uTime - aTime.x) / max(aTime.y, 1e-4);
          vUv = uv; vF = f; vColor = aColor; vThick = aParams.y;
          if (f < 0.0 || f > 1.0 || aTime.y <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
          float ease = 1.0 - pow(1.0 - f, 2.5);
          float R = aParams.x * ease;
          vec3 p = aPos + vec3(position.x * R * 2.0, 0.04, position.z * R * 2.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv; varying float vF; varying vec3 vColor; varying float vThick;
        void main(){
          float r = length(vUv - 0.5) * 2.0;
          float ring = smoothstep(vThick, 0.0, abs(r - 0.92)) + 0.35 * smoothstep(0.92, 0.5, r) * smoothstep(0.0, 0.5, r);
          float a = ring * (1.0 - vF) * (1.0 - vF);
          gl_FragColor = vec4(vColor * a * 2.0, a);
        }`,
    });
    ((this.mesh = new Mesh(n, s)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 18));
  }
  emit(t, e, n, s, r, a, l, o, c, h) {
    const d = this.head;
    ((this.head = (d + 1) % this.n),
      (this.dirty = !0),
      (this.pos[d * 3] = t),
      (this.pos[d * 3 + 1] = e),
      (this.pos[d * 3 + 2] = n),
      (this.time[d * 2] = s),
      (this.time[d * 2 + 1] = r),
      (this.params[d * 2] = a),
      (this.params[d * 2 + 1] = l),
      (this.color[d * 3] = o),
      (this.color[d * 3 + 1] = c),
      (this.color[d * 3 + 2] = h));
  }
  flush(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
const J = (i, t) => i + Math.random() * (t - i);
class M0 {
  constructor(t) {
    ((this.add = new Zo(8e3, !0)),
      (this.alpha = new Zo(2e3, !1)),
      (this.rings = new x0(48)),
      t.add(this.add.mesh, this.alpha.mesh, this.rings.mesh),
      (this.t = 0),
      (this._ambT = 0));
  }
  update(t, e, n) {
    for (this.t = t, this._ambT += e; this._ambT > 0.05;) {
      this._ambT -= 0.05;
      const s = Math.random() * Math.PI * 2,
        r = J(2, 22),
        a = n.x + Math.cos(s) * r,
        l = n.z + Math.sin(s) * r,
        o = Math.random() > 0.35;
      this.add.emit(
        a,
        J(0.2, 6),
        l,
        J(-0.3, 0.3),
        J(0.05, 0.3),
        J(-0.3, 0.3),
        t,
        J(5, 9),
        J(0.02, 0.05),
        J(0.02, 0.05),
        o ? 0.4 : 1,
        o ? 0.9 : 0.5,
        o ? 1 : 0.15,
        0.9,
        -0.02,
        0.6,
        2,
        0,
      );
    }
    (this.add.flush(t), this.alpha.flush(t), this.rings.flush(t));
  }
  randomInCone(t, e, n) {
    const s = J(-1, 1),
      r = J(-1, 1),
      a = J(-1, 1);
    return (n.set(t.x + s * e, t.y + r * e, t.z + a * e).normalize(), n);
  }
  impactSparks(t, e, n = 14, s = 1) {
    const r = this.t,
      a = new Vector3();
    for (let l = 0; l < n; l++) {
      this.randomInCone(e, 0.9, a);
      const o = J(2.5, 9) * s,
        c = Math.random() > 0.6;
      this.add.emit(
        t.x,
        t.y,
        t.z,
        a.x * o + e.x,
        a.y * o + 1.5,
        a.z * o + e.z,
        r,
        J(0.2, 0.6),
        J(0.015, 0.03),
        0.005,
        1,
        c ? 0.85 : 0.6,
        c ? 0.5 : 0.2,
        J(3, 6),
        14,
        J(1.5, 3),
        0,
        0.05,
      );
    }
    this.add.emit(
      t.x + e.x * 0.03,
      t.y + e.y * 0.03,
      t.z + e.z * 0.03,
      0,
      0,
      0,
      r,
      0.07,
      0.35 * s,
      0.5 * s,
      1,
      0.85,
      0.6,
      5,
      0,
      1,
      2,
      0,
    );
    for (let l = 0; l < 3; l++)
      (this.randomInCone(e, 0.7, a),
        this.alpha.emit(
          t.x + e.x * 0.05,
          t.y + e.y * 0.05,
          t.z + e.z * 0.05,
          a.x * J(0.6, 1.4),
          a.y * J(0.6, 1.4) + 0.4,
          a.z * J(0.6, 1.4),
          r,
          J(0.6, 1.1),
          J(0.12, 0.2),
          J(0.5, 0.8),
          0.55,
          0.52,
          0.48,
          0.55,
          -0.6,
          3.5,
          1,
          J(-2, 2),
        ));
  }
  fleshBurst(t, e, n = !1, s = [1, 0.42, 0.1]) {
    const r = this.t,
      a = new Vector3(),
      l = n ? 26 : 14;
    for (let o = 0; o < l; o++) {
      a.set(J(-1, 1), J(-0.6, 1), J(-1, 1)).normalize();
      const c = J(1.5, 6) * (n ? 1.5 : 1);
      this.add.emit(
        t.x,
        t.y,
        t.z,
        e.x * 2.5 + a.x * c,
        1.5 + a.y * c,
        e.z * 2.5 + a.z * c,
        r,
        J(0.4, 0.9),
        J(0.04, 0.09),
        0.01,
        s[0],
        s[1],
        s[2],
        J(3, 6),
        16,
        J(1, 2.5),
        2,
        0,
      );
    }
    for (let o = 0; o < (n ? 10 : 5); o++) {
      a.set(J(-1, 1), J(-0.5, 1), J(-1, 1)).normalize();
      const c = J(3, 8);
      this.add.emit(
        t.x,
        t.y,
        t.z,
        e.x * 2 + a.x * c,
        1 + a.y * c,
        e.z * 2 + a.z * c,
        r,
        J(0.25, 0.5),
        J(0.02, 0.04),
        0.005,
        s[0],
        s[1] * 0.8,
        s[2],
        4,
        14,
        1.5,
        0,
        0.04,
      );
    }
    this.add.emit(
      t.x,
      t.y,
      t.z,
      0,
      0,
      0,
      r,
      0.08,
      0.3,
      0.55,
      s[0],
      s[1] + 0.3,
      s[2] + 0.2,
      6,
      0,
      1,
      2,
      0,
    );
    for (let o = 0; o < 2; o++)
      this.alpha.emit(
        t.x,
        t.y,
        t.z,
        J(-0.6, 0.6),
        J(0.3, 0.9),
        J(-0.6, 0.6),
        r,
        J(0.5, 0.9),
        0.15,
        0.6,
        0.15,
        0.06,
        0.02,
        0.7,
        -0.4,
        3,
        1,
        J(-2, 2),
      );
  }
  deathBurst(t, e, n = 1, s = !1) {
    const r = this.t,
      a = new Vector3(),
      l = Math.floor(50 * n);
    for (let o = 0; o < l; o++) {
      a.set(J(-1, 1), J(-0.2, 1), J(-1, 1)).normalize();
      const c = J(2, 9) * n;
      this.add.emit(
        t.x,
        t.y + J(0, 1.2 * n),
        t.z,
        a.x * c,
        a.y * c + 2,
        a.z * c,
        r,
        J(0.6, 1.6),
        J(0.03, 0.1) * n,
        0.01,
        e[0],
        e[1],
        e[2],
        J(3, 7),
        J(6, 14),
        J(0.8, 2),
        2,
        0,
      );
    }
    for (let o = 0; o < Math.floor(12 * n); o++) {
      a.set(J(-1, 1), J(0, 1), J(-1, 1)).normalize();
      const c = J(4, 12) * n;
      this.add.emit(
        t.x,
        t.y + J(0.3, 1.4 * n),
        t.z,
        a.x * c,
        a.y * c,
        a.z * c,
        r,
        J(0.3, 0.6),
        J(0.02, 0.05),
        0.005,
        1,
        0.8,
        0.5,
        5,
        14,
        1.5,
        0,
        0.05,
      );
    }
    for (let o = 0; o < Math.floor(6 * n); o++)
      this.alpha.emit(
        t.x + J(-0.3, 0.3),
        t.y + J(0.3, 1.3 * n),
        t.z + J(-0.3, 0.3),
        J(-0.8, 0.8),
        J(0.4, 1.4),
        J(-0.8, 0.8),
        r,
        J(0.9, 1.6),
        0.3 * n,
        1.2 * n,
        0.12,
        0.05,
        0.02,
        0.8,
        -0.5,
        2.5,
        1,
        J(-1.5, 1.5),
      );
    (this.add.emit(
      t.x,
      t.y + 0.9 * n,
      t.z,
      0,
      0,
      0,
      r,
      0.14,
      1.2 * n,
      2.2 * n,
      e[0],
      e[1] + 0.25,
      e[2] + 0.2,
      4,
      0,
      1,
      2,
      0,
    ),
      s &&
        this.add.emit(
          t.x,
          t.y + 1.6 * n,
          t.z,
          0,
          0,
          0,
          r,
          0.2,
          0.5,
          1.4,
          1,
          0.9,
          0.7,
          6,
          0,
          1,
          2,
          0,
        ),
      this.rings.emit(t.x, 0.05, t.z, r, 0.6, 2.2 * n, 0.35, e[0], e[1], e[2]));
  }
  slamWave(t, e) {
    const n = this.t;
    (this.rings.emit(t.x, 0.05, t.z, n, 0.7, e, 0.3, 1, 0.45, 0.15),
      this.rings.emit(
        t.x,
        0.05,
        t.z,
        n + 0.08,
        0.6,
        e * 0.7,
        0.4,
        1,
        0.7,
        0.4,
      ));
    for (let s = 0; s < 40; s++) {
      const r = Math.random() * Math.PI * 2,
        a = J(3, 8);
      this.add.emit(
        t.x,
        0.1,
        t.z,
        Math.cos(r) * a,
        J(1, 5),
        Math.sin(r) * a,
        n,
        J(0.4, 1),
        J(0.03, 0.07),
        0.01,
        1,
        0.5,
        0.15,
        5,
        12,
        1.5,
        2,
        0,
      );
    }
    for (let s = 0; s < 10; s++) {
      const r = Math.random() * Math.PI * 2;
      this.alpha.emit(
        t.x + Math.cos(r) * 0.5,
        0.2,
        t.z + Math.sin(r) * 0.5,
        Math.cos(r) * 3,
        1.2,
        Math.sin(r) * 3,
        n,
        J(0.8, 1.4),
        0.4,
        1.6,
        0.35,
        0.3,
        0.25,
        0.7,
        -0.3,
        3,
        1,
        J(-1, 1),
      );
    }
  }
  muzzleSmoke(t, e, n = 1) {
    const s = this.t;
    for (let r = 0; r < Math.ceil(2 * n); r++)
      this.alpha.emit(
        t.x,
        t.y,
        t.z,
        e.x * J(1, 2.5) + J(-0.3, 0.3),
        e.y * J(1, 2.5) + 0.6,
        e.z * J(1, 2.5) + J(-0.3, 0.3),
        s,
        J(0.5, 1) * n,
        0.08,
        J(0.35, 0.6) * n,
        0.5,
        0.48,
        0.45,
        0.45,
        -0.4,
        4,
        1,
        J(-3, 3),
      );
  }
  spawnFx(t, e) {
    const n = this.t;
    for (let s = 0; s < 24; s++) {
      const r = Math.random() * Math.PI * 2,
        a = J(0.2, 1);
      this.add.emit(
        t.x + Math.cos(r) * a,
        J(0, 0.3),
        t.z + Math.sin(r) * a,
        0,
        J(1.5, 4),
        0,
        n,
        J(0.6, 1.2),
        J(0.03, 0.06),
        0.01,
        e[0],
        e[1],
        e[2],
        4,
        -1,
        1.2,
        2,
        0,
      );
    }
    this.rings.emit(t.x, 0.05, t.z, n, 0.8, 1.8, 0.35, e[0], e[1], e[2]);
  }
  trail(t, e, n = 0.12) {
    this.add.emit(
      t.x,
      t.y,
      t.z,
      J(-0.3, 0.3),
      J(-0.3, 0.3),
      J(-0.3, 0.3),
      this.t,
      J(0.2, 0.4),
      n,
      0.01,
      e[0],
      e[1],
      e[2],
      4,
      0,
      2,
      2,
      0,
    );
  }
  splash(t, e) {
    const n = this.t,
      s = new Vector3();
    for (let r = 0; r < 18; r++) {
      s.set(J(-1, 1), J(0.2, 1), J(-1, 1)).normalize();
      const a = J(2, 6);
      this.add.emit(
        t.x,
        t.y,
        t.z,
        s.x * a,
        s.y * a,
        s.z * a,
        n,
        J(0.4, 0.8),
        J(0.04, 0.08),
        0.01,
        e[0],
        e[1],
        e[2],
        4,
        12,
        1.5,
        2,
        0,
      );
    }
    this.add.emit(
      t.x,
      t.y,
      t.z,
      0,
      0,
      0,
      n,
      0.1,
      0.6,
      1.2,
      e[0],
      e[1],
      e[2],
      5,
      0,
      1,
      2,
      0,
    );
  }
  pickupBurst(t) {
    const e = this.t;
    for (let n = 0; n < 30; n++) {
      const s = Math.random() * Math.PI * 2,
        r = J(1, 3);
      this.add.emit(
        t.x,
        t.y + 0.3,
        t.z,
        Math.cos(s) * r,
        J(2, 5),
        Math.sin(s) * r,
        e,
        J(0.5, 1),
        0.05,
        0.01,
        0.4,
        0.95,
        1,
        5,
        8,
        1.5,
        2,
        0,
      );
    }
  }
}
class y0 {
  constructor(t, e = 160) {
    const n = new PlaneGeometry(1, 1, 1, 1),
      s = new InstancedBufferGeometry();
    (s.setIndex(n.index),
      s.setAttribute("position", n.attributes.position),
      s.setAttribute("uv", n.attributes.uv),
      (this.n = e),
      (this.head = 0),
      (this.dirty = !1),
      (this.start = new Float32Array(e * 3)),
      (this.end = new Float32Array(e * 3)),
      (this.time = new Float32Array(e * 3)),
      (this.color = new Float32Array(e * 4)),
      (this.attrs = {
        aStart: new InstancedBufferAttribute(this.start, 3),
        aEnd: new InstancedBufferAttribute(this.end, 3),
        aTime: new InstancedBufferAttribute(this.time, 3),
        aColor: new InstancedBufferAttribute(this.color, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(DynamicDrawUsage),
        s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = e), (this.uTime = { value: 0 }));
    const r = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      blending: AdditiveBlending,
      vertexShader: `
        attribute vec3 aStart; attribute vec3 aEnd; attribute vec3 aTime; attribute vec4 aColor;
        uniform float uTime;
        varying vec2 vUv; varying vec4 vColor; varying float vFade;
        void main(){
          float t = uTime - aTime.x;
          vec3 seg = aEnd - aStart;
          float total = length(seg);
          float speed = total / max(aTime.y, 1e-4);
          float headD = t * speed;
          float trail = aTime.z;
          vUv = uv; vColor = aColor; vFade = 1.0;
          if (t < 0.0 || headD > total + trail || aTime.y <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
          vec3 dir = seg / max(total, 1e-4);
          float h = min(headD, total);
          float tl = clamp(headD - trail, 0.0, total);
          vec3 head = aStart + dir * h;
          vec3 tail = aStart + dir * tl;
          vec3 p = mix(tail, head, uv.x);
          vec3 toCam = cameraPosition - p;
          vec3 side = normalize(cross(dir, toCam));
          p += side * (uv.y - 0.5) * aColor.w;
          vFade = 1.0 - smoothstep(total, total + trail, headD);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv; varying vec4 vColor; varying float vFade;
        void main(){
          float w = 1.0 - abs(vUv.y - 0.5) * 2.0;
          float core = pow(w, 4.0);
          float along = smoothstep(0.0, 0.35, vUv.x) * (0.4 + 0.6 * smoothstep(0.35, 1.0, vUv.x));
          float headGlow = smoothstep(0.85, 1.0, vUv.x) * w;
          vec3 col = vColor.rgb * (core * 2.5 + w * 0.6 + headGlow * 3.0) * along;
          gl_FragColor = vec4(col * vFade, (core + 0.3 * w) * along * vFade);
        }`,
    });
    ((this.mesh = new Mesh(s, r)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 21),
      t.add(this.mesh));
  }
  fire(t, e, n, s = 320, r = 0.035, a = 4, l = [1, 0.8, 0.45]) {
    const o = this.head;
    ((this.head = (o + 1) % this.n), (this.dirty = !0));
    const c = t.distanceTo(e);
    ((this.start[o * 3] = t.x),
      (this.start[o * 3 + 1] = t.y),
      (this.start[o * 3 + 2] = t.z),
      (this.end[o * 3] = e.x),
      (this.end[o * 3 + 1] = e.y),
      (this.end[o * 3 + 2] = e.z),
      (this.time[o * 3] = n),
      (this.time[o * 3 + 1] = c / s),
      (this.time[o * 3 + 2] = a),
      (this.color[o * 4] = l[0]),
      (this.color[o * 4 + 1] = l[1]),
      (this.color[o * 4 + 2] = l[2]),
      (this.color[o * 4 + 3] = r));
  }
  update(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
class S0 {
  constructor(t, e = 320) {
    const n = new PlaneGeometry(1, 1),
      s = new InstancedBufferGeometry();
    (s.setIndex(n.index),
      s.setAttribute("position", n.attributes.position),
      s.setAttribute("uv", n.attributes.uv),
      (this.n = e),
      (this.head = 0),
      (this.dirty = !1),
      (this.pos = new Float32Array(e * 3)),
      (this.quat = new Float32Array(e * 4)),
      (this.info = new Float32Array(e * 4)),
      (this.attrs = {
        aPos: new InstancedBufferAttribute(this.pos, 3),
        aQuat: new InstancedBufferAttribute(this.quat, 4),
        aInfo: new InstancedBufferAttribute(this.info, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(DynamicDrawUsage),
        s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = e), (this.uTime = { value: 0 }));
    const r = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      vertexShader: `
        attribute vec3 aPos; attribute vec4 aQuat; attribute vec4 aInfo; uniform float uTime;
        varying vec2 vUv; varying float vType; varying float vAge; varying float vSeed;
        vec3 qrot(vec4 q, vec3 v){ return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
        void main(){
          vUv = uv; vType = aInfo.z; vAge = uTime - aInfo.y; vSeed = aInfo.w;
          if (aInfo.x <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
          vec3 p = aPos + qrot(aQuat, position * aInfo.x);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv; varying float vType; varying float vAge; varying float vSeed;
        ${Nn}
        void main(){
          vec2 c = vUv - 0.5; float r = length(c) * 2.0;
          float n = noise2(c * 10.0 + vSeed * 40.0);
          float fade = 1.0 - smoothstep(40.0, 60.0, vAge);
          vec3 col; float a;
          if (vType < 0.5) {
            float hole = smoothstep(0.45 + n * 0.15, 0.15, r);
            float scorch = smoothstep(1.0, 0.25, r + n * 0.35) * 0.8;
            col = mix(vec3(0.07, 0.065, 0.06), vec3(0.005), hole);
            a = max(hole, scorch);
          } else {
            float n2 = fbm2(c * 5.0 + vSeed * 13.0);
            float body = smoothstep(1.0, 0.2, r + n2 * 0.5);
            float hot = smoothstep(0.75, 0.35, r + n2 * 0.4) * exp(-vAge * 0.9);
            col = mix(vec3(0.03, 0.025, 0.02), vec3(1.0, 0.45, 0.1) * 3.0, hot);
            a = body * 0.85;
          }
          gl_FragColor = vec4(col, a * fade);
        }`,
    });
    ((this.mesh = new Mesh(s, r)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 5),
      t.add(this.mesh),
      (this._q = new Quaternion()),
      (this._q2 = new Quaternion()),
      (this._z = new Vector3(0, 0, 1)));
  }
  add(t, e, n, s, r) {
    const a = this.head;
    ((this.head = (a + 1) % this.n),
      (this.dirty = !0),
      this._q.setFromUnitVectors(this._z, e),
      this._q2.setFromAxisAngle(this._z, Math.random() * Math.PI * 2),
      this._q.multiply(this._q2),
      (this.pos[a * 3] = t.x + e.x * 0.012),
      (this.pos[a * 3 + 1] = t.y + e.y * 0.012),
      (this.pos[a * 3 + 2] = t.z + e.z * 0.012),
      (this.quat[a * 4] = this._q.x),
      (this.quat[a * 4 + 1] = this._q.y),
      (this.quat[a * 4 + 2] = this._q.z),
      (this.quat[a * 4 + 3] = this._q.w),
      (this.info[a * 4] = n),
      (this.info[a * 4 + 1] = r),
      (this.info[a * 4 + 2] = s),
      (this.info[a * 4 + 3] = Math.random()));
  }
  update(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
class E0 {
  constructor(t, e = 64) {
    const n = new CylinderGeometry(0.0045, 0.0045, 0.028, 8);
    n.rotateZ(Math.PI / 2);
    const s = new MeshStandardMaterial({
      color: 16777215,
      metalness: 1,
      roughness: 0.28,
    });
    ((this.mesh = new InstancedMesh(n, s, e)),
      this.mesh.instanceMatrix.setUsage(DynamicDrawUsage),
      (this.mesh.frustumCulled = !1),
      (this.mesh.castShadow = !1));
    for (let r = 0; r < e; r++) this.mesh.setColorAt(r, new Color(14266954));
    ((this.n = e), (this.items = []));
    for (let r = 0; r < e; r++)
      this.items.push({
        active: !1,
        p: new Vector3(),
        v: new Vector3(),
        rot: new Euler(),
        av: new Vector3(),
        life: 0,
        scale: 1,
        bounced: !1,
      });
    ((this.head = 0),
      (this._m = new Matrix4()),
      (this._q = new Quaternion()),
      (this._s = new Vector3()),
      t.add(this.mesh),
      (this.onBounce = null));
  }
  eject(t, e, n) {
    const s = this.items[this.head];
    ((this.head = (this.head + 1) % this.n),
      (s.active = !0),
      s.p.copy(t),
      s.v.copy(e),
      (s.life = 5),
      (s.bounced = !1),
      s.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      s.av.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
      ),
      (s.scale = n === "shotgun" ? 2.2 : n === "dmr" ? 1.5 : 1));
    const r = this.items.indexOf(s);
    (this.mesh.setColorAt(
      r,
      n === "shotgun" ? new Color(13380138) : new Color(14266954),
    ),
      (this.mesh.instanceColor.needsUpdate = !0));
  }
  update(t, e) {
    for (let n = 0; n < this.n; n++) {
      const s = this.items[n];
      if (!s.active) {
        (this._m.makeScale(0, 0, 0), this.mesh.setMatrixAt(n, this._m));
        continue;
      }
      if (((s.life -= t), s.life <= 0)) {
        ((s.active = !1),
          this._m.makeScale(0, 0, 0),
          this.mesh.setMatrixAt(n, this._m));
        continue;
      }
      ((s.v.y -= 22 * t), s.p.addScaledVector(s.v, t));
      const r = e ? e(s.p.x, s.p.z) : 0;
      (s.p.y < r + 0.006 &&
        ((s.p.y = r + 0.006),
        Math.abs(s.v.y) > 0.6
          ? ((s.v.y *= -0.38),
            (s.v.x *= 0.55),
            (s.v.z *= 0.55),
            s.av.multiplyScalar(0.4),
            !s.bounced &&
              this.onBounce &&
              (this.onBounce(s.p), (s.bounced = !0)))
          : (s.v.set(0, 0, 0),
            s.av.set(0, 0, 0),
            (s.rot.x = 0),
            (s.rot.z = 0))),
        (s.rot.x += s.av.x * t),
        (s.rot.y += s.av.y * t),
        (s.rot.z += s.av.z * t));
      const a = s.scale * (s.life < 0.6 ? s.life / 0.6 : 1);
      (this._q.setFromEuler(s.rot),
        this._s.set(a, a, a),
        this._m.compose(s.p, this._q, this._s),
        this.mesh.setMatrixAt(n, this._m));
    }
    this.mesh.instanceMatrix.needsUpdate = !0;
  }
}
const w0 = `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uThreshold; uniform float uKnee; uniform float uPrefilter;
varying vec2 vUv;
vec3 pf(vec3 c){
  float br = max(c.r, max(c.g, c.b));
  float soft = clamp(br - uThreshold + uKnee, 0.0, 2.0 * uKnee);
  soft = soft * soft / (4.0 * uKnee + 1e-4);
  float contrib = max(soft, br - uThreshold) / max(br, 1e-4);
  return c * contrib;
}
vec3 S(vec2 o){ vec3 c = texture2D(tSrc, vUv + o * uTexel).rgb; return uPrefilter > 0.5 ? pf(min(c, vec3(60.0))) : c; }
void main(){
  vec3 a = S(vec2(-2.0,-2.0)), b = S(vec2(0.0,-2.0)), c = S(vec2(2.0,-2.0));
  vec3 d = S(vec2(-2.0, 0.0)), e = S(vec2(0.0, 0.0)), f = S(vec2(2.0, 0.0));
  vec3 g = S(vec2(-2.0, 2.0)), h = S(vec2(0.0, 2.0)), i = S(vec2(2.0, 2.0));
  vec3 j = S(vec2(-1.0,-1.0)), k = S(vec2(1.0,-1.0)), l = S(vec2(-1.0, 1.0)), m = S(vec2(1.0, 1.0));
  vec3 col = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  gl_FragColor = vec4(col, 1.0);
}`,
  T0 = `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uScale;
varying vec2 vUv;
void main(){
  vec2 t = uTexel * uScale;
  vec3 s = texture2D(tSrc, vUv + vec2(-t.x, -t.y)).rgb + texture2D(tSrc, vUv + vec2(0.0, -t.y)).rgb * 2.0 + texture2D(tSrc, vUv + vec2(t.x, -t.y)).rgb
         + texture2D(tSrc, vUv + vec2(-t.x, 0.0)).rgb * 2.0 + texture2D(tSrc, vUv).rgb * 4.0 + texture2D(tSrc, vUv + vec2(t.x, 0.0)).rgb * 2.0
         + texture2D(tSrc, vUv + vec2(-t.x, t.y)).rgb + texture2D(tSrc, vUv + vec2(0.0, t.y)).rgb * 2.0 + texture2D(tSrc, vUv + vec2(t.x, t.y)).rgb;
  gl_FragColor = vec4(s / 16.0, 1.0);
}`,
  b0 = `
uniform sampler2D tScene; uniform sampler2D tBloom; uniform vec2 uRes; uniform float uTime;
uniform float uBloom; uniform float uExposure; uniform float uCA; uniform float uVignette; uniform float uGrain;
uniform float uDamage; uniform float uFlash; uniform float uSat; uniform float uContrast; uniform float uRadial; uniform float uDesat;
varying vec2 vUv;
vec3 aces(vec3 x){ const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14; return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0); }
vec3 srgb(vec3 c){ return mix(12.92 * c, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec3 fetch(vec2 uv, vec2 caDir){ return vec3(texture2D(tScene, uv + caDir).r, texture2D(tScene, uv).g, texture2D(tScene, uv - caDir).b); }
void main(){
  vec2 uv = vUv; vec2 c = uv - 0.5; float r2 = dot(c, c);
  float ca = uCA * (0.35 + 2.5 * r2);
  vec2 caDir = c * ca;
  vec3 col;
  if (uRadial > 0.001) {
    float w = uRadial * smoothstep(0.01, 0.3, r2);
    col = vec3(0.0);
    for (int i = 0; i < 7; i++) { float s = 1.0 - w * float(i) / 7.0; col += fetch(0.5 + c * s, caDir); }
    col /= 7.0;
  } else {
    col = fetch(uv, caDir);
  }
  vec3 bloom = texture2D(tBloom, uv).rgb;
  col += bloom * uBloom;
  col *= uExposure;
  float edge = smoothstep(0.05, 0.55, r2 * 2.0);
  float lum = dot(col, vec3(0.3, 0.59, 0.11));
  vec3 dmg = vec3(lum) * vec3(1.3, 0.2, 0.15) + vec3(0.22, 0.0, 0.0) * (0.75 + 0.25 * sin(uTime * 9.0));
  col = mix(col, dmg, clamp(uDamage * edge, 0.0, 1.0));
  col = aces(col);
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uSat * (1.0 - uDesat));
  col = (col - 0.5) * uContrast + 0.5;
  col = mix(col, col * vec3(0.93, 1.0, 1.1), (1.0 - l) * 0.35);
  col *= 1.0 - uVignette * smoothstep(0.12, 0.95, r2 * 2.6);
  col += (hash(uv * uRes + fract(uTime) * 100.0) - 0.5) * uGrain;
  col += uFlash;
  gl_FragColor = vec4(srgb(clamp(col, 0.0, 1.0)), 1.0);
}`,
  wr =
    "varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }";
class A0 {
  constructor(t) {
    this.renderer = t;
    const e = t.getDrawingBufferSize(new Vector2());
    ((this.w = Math.max(2, e.x)),
      (this.h = Math.max(2, e.y)),
      (this.sceneRT = new WebGLRenderTarget(this.w, this.h, {
        type: HalfFloatType,
        samples: 4,
        depthBuffer: !0,
        stencilBuffer: !1,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
      })),
      (this.mipCount = 6),
      (this.mips = []));
    for (let s = 0; s < this.mipCount; s++)
      this.mips.push(
        new WebGLRenderTarget(
          Math.max(1, this.w >> (s + 1)),
          Math.max(1, this.h >> (s + 1)),
          {
            type: HalfFloatType,
            depthBuffer: !1,
            minFilter: LinearFilter,
            magFilter: LinearFilter,
          },
        ),
      );
    const n = new BufferGeometry();
    (n.setAttribute(
      "position",
      new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
    ),
      (this.quad = new Mesh(n, null)),
      (this.quad.frustumCulled = !1),
      (this.quadScene = new Scene()),
      this.quadScene.add(this.quad),
      (this.quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1)),
      (this.downMat = new ShaderMaterial({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new Vector2() },
          uThreshold: { value: 1.3 },
          uKnee: { value: 0.6 },
          uPrefilter: { value: 0 },
        },
        vertexShader: wr,
        fragmentShader: w0,
        depthTest: !1,
        depthWrite: !1,
      })),
      (this.upMat = new ShaderMaterial({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new Vector2() },
          uScale: { value: 1 },
        },
        vertexShader: wr,
        fragmentShader: T0,
        depthTest: !1,
        depthWrite: !1,
        blending: CustomBlending,
        blendSrc: OneFactor,
        blendDst: OneFactor,
        blendEquation: AddEquation,
      })),
      (this.u = {
        tScene: { value: null },
        tBloom: { value: null },
        uRes: { value: new Vector2(this.w, this.h) },
        uTime: { value: 0 },
        uBloom: { value: 0.14 },
        uExposure: { value: 1.45 },
        uCA: { value: 0.004 },
        uVignette: { value: 0.28 },
        uGrain: { value: 0.035 },
        uDamage: { value: 0 },
        uFlash: { value: 0 },
        uSat: { value: 1.12 },
        uContrast: { value: 1.08 },
        uRadial: { value: 0 },
        uDesat: { value: 0 },
      }),
      (this.compMat = new ShaderMaterial({
        uniforms: this.u,
        vertexShader: wr,
        fragmentShader: b0,
        depthTest: !1,
        depthWrite: !1,
      })));
  }
  setSize(t, e) {
    ((this.w = Math.max(2, t)),
      (this.h = Math.max(2, e)),
      this.sceneRT.setSize(this.w, this.h));
    for (let n = 0; n < this.mipCount; n++)
      this.mips[n].setSize(
        Math.max(1, this.w >> (n + 1)),
        Math.max(1, this.h >> (n + 1)),
      );
    this.u.uRes.value.set(this.w, this.h);
  }
  _pass(t, e) {
    ((this.quad.material = t),
      this.renderer.setRenderTarget(e),
      this.renderer.render(this.quadScene, this.quadCam));
  }
  render(t, e, n, s, r) {
    const a = this.renderer;
    ((this.u.uTime.value = r),
      a.setRenderTarget(this.sceneRT),
      a.clear(!0, !0, !1),
      a.render(t, e),
      n && (a.clearDepth(), a.render(n, s)));
    let l = this.sceneRT,
      o = this.w,
      c = this.h;
    for (let h = 0; h < this.mipCount; h++)
      ((this.downMat.uniforms.tSrc.value = l.texture),
        this.downMat.uniforms.uTexel.value.set(1 / o, 1 / c),
        (this.downMat.uniforms.uPrefilter.value = h === 0 ? 1 : 0),
        this._pass(this.downMat, this.mips[h]),
        (l = this.mips[h]),
        (o = l.width),
        (c = l.height));
    for (let h = this.mipCount - 2; h >= 0; h--) {
      const d = this.mips[h + 1];
      ((this.upMat.uniforms.tSrc.value = d.texture),
        this.upMat.uniforms.uTexel.value.set(1 / d.width, 1 / d.height),
        this._pass(this.upMat, this.mips[h]));
    }
    ((this.u.tScene.value = this.sceneRT.texture),
      (this.u.tBloom.value = this.mips[0].texture),
      this._pass(this.compMat, null));
  }
}
const Ln = (i, t, e, n) => MathUtils.damp(i, t, e, n);
class R0 {
  constructor(t) {
    ((this.arena = t),
      (this.pos = new Vector3(0, 0.5, 4)),
      (this.vel = new Vector3()),
      (this.yaw = Math.PI),
      (this.pitch = 0),
      (this.radius = 0.4),
      (this.height = 1.8),
      (this.eyeStand = 1.64),
      (this.eyeCrouch = 1.08),
      (this.eye = 1.64),
      (this.onGround = !0),
      (this.crouch = !1),
      (this.sliding = !1),
      (this.slideT = 0),
      (this.sprinting = !1),
      (this.sprintBlock = 0),
      (this.sprintBlend = 0),
      (this.slideBlend = 0),
      (this.hp = 500),
      (this.maxHp = 500),
      (this.regenDelay = 0),
      (this.dead = !1),
      (this.bobPhase = 0),
      (this.bobAmt = 0),
      (this.stepDist = 0),
      (this.landDip = 0),
      (this.landVel = 0),
      (this.recoilP = 0),
      (this.recoilPV = 0),
      (this.recoilY = 0),
      (this.recoilYV = 0),
      (this.trauma = 0),
      (this.roll = 0),
      (this.speed = 0),
      (this.localVel = new Vector3()),
      (this.moveInput = new Vector2()),
      (this.ads = 0),
      (this.adsFov = 60),
      (this.moveMult = 1),
      (this.fov = 80),
      (this.events = []),
      (this.camPos = new Vector3()),
      (this.camQuat = new Quaternion()),
      (this.forward = new Vector3(0, 0, -1)),
      (this.right = new Vector3(1, 0, 0)),
      (this._euler = new Euler(0, 0, 0, "YXZ")),
      (this._wish = new Vector3()),
      (this.hurtFlash = 0),
      (this.time = 0));
  }
  reset() {
    (this.pos.set(0, 0.5, 4),
      this.vel.set(0, 0, 0),
      (this.yaw = Math.PI),
      (this.pitch = 0),
      (this.hp = this.maxHp),
      (this.dead = !1),
      (this.regenDelay = 0),
      (this.trauma = 0),
      (this.recoilP = this.recoilY = this.recoilPV = this.recoilYV = 0),
      (this.sliding = !1),
      (this.crouch = !1),
      (this.sprinting = !1),
      (this.hurtFlash = 0));
  }
  addRecoil(t, e, n) {
    ((this.pitch += t * n),
      (this.recoilPV += t * (1 - n) * 55),
      (this.recoilYV += e * 55));
  }
  addTrauma(t) {
    this.trauma = Math.min(1, this.trauma + t);
  }
  knock(t, e) {
    ((this.vel.x += t.x * e),
      (this.vel.z += t.z * e),
      (this.vel.y += e * 0.25),
      (this.onGround = !1));
  }
  damage(t, e) {
    if (this.dead) return;
    ((this.hp -= t),
      (this.regenDelay = 4.2),
      this.addTrauma(Math.min(0.7, 0.25 + t / 50)),
      (this.hurtFlash = 1));
    let n = 0;
    if (e) {
      const s = e.x - this.pos.x,
        r = e.z - this.pos.z;
      n = Math.atan2(s, -r) + this.yaw;
    }
    (this.events.push({ type: "hurt", amount: t, angle: n }),
      this.hp <= 0 &&
        ((this.hp = 0), (this.dead = !0), this.events.push({ type: "dead" })));
  }
  update(t, e, n) {
    this.time = n;
    const s = this.events;
    if (!this.dead) {
      const K = MathUtils.lerp(1, this.adsFov / 80, this.ads),
        nt = 0.0021 * e.sensitivity * K;
      ((this.yaw -= e.dx * nt), (this.pitch -= e.dy * nt));
    }
    this.pitch = MathUtils.clamp(this.pitch, -1.5, 1.5);
    const r = this.dead ? 0 : (e.key("KeyW") ? 1 : 0) - (e.key("KeyS") ? 1 : 0),
      a = this.dead ? 0 : (e.key("KeyD") ? 1 : 0) - (e.key("KeyA") ? 1 : 0);
    this.moveInput.set(a, r);
    const l = Math.sin(this.yaw),
      o = Math.cos(this.yaw),
      c = -l,
      h = -o,
      d = o,
      u = -l,
      m = this._wish.set(c * r + d * a, 0, h * r + u * a);
    (m.lengthSq() > 1 && m.normalize(),
      (this.sprintBlock = Math.max(0, this.sprintBlock - t)));
    const v =
      (e.key("ShiftLeft") || e.key("ShiftRight")) &&
      r > 0.5 &&
      this.sprintBlock <= 0 &&
      this.ads < 0.2 &&
      !this.crouch &&
      !this.dead;
    this.sprinting = v && !this.sliding;
    const p = e.key("KeyC") || e.key("ControlLeft");
    if (
      !this.sliding &&
      this.sprinting &&
      this.onGround &&
      (e.justPressed("KeyC") || e.justPressed("ControlLeft"))
    ) {
      ((this.sliding = !0), (this.slideT = 0.95), (this.sprinting = !1));
      const K = m.lengthSq() > 0.1 ? m : new Vector3(c, 0, h),
        nt = Math.max(10.5, this.speed + 3);
      ((this.vel.x = K.x * nt),
        (this.vel.z = K.z * nt),
        s.push({ type: "slide" }));
    }
    if (this.sliding) {
      this.slideT -= t;
      const K = Math.hypot(this.vel.x, this.vel.z);
      (this.slideT <= 0 || K < 2.6) && (this.sliding = !1);
    }
    this.crouch =
      (p && !this.sliding && !this.sprinting && !this.dead) || this.sliding;
    let f = 5.3;
    if (
      (this.sprinting && (f = 7.7),
      this.crouch && !this.sliding && (f = 2.8),
      (f *= MathUtils.lerp(1, 0.62 * this.moveMult, this.ads)),
      this.onGround)
    ) {
      if (this.sliding) {
        const K = Math.exp(-2.4 * t);
        ((this.vel.x *= K),
          (this.vel.z *= K),
          (this.vel.x += m.x * 3 * t),
          (this.vel.z += m.z * 3 * t));
      } else {
        const K = m.x * f,
          nt = m.z * f,
          _t = m.lengthSq() > 0.01 ? 11 : 14;
        ((this.vel.x = Ln(this.vel.x, K, _t, t)),
          (this.vel.z = Ln(this.vel.z, nt, _t, t)));
      }
      !this.dead &&
        e.justPressed("Space") &&
        ((this.vel.y = 7.9),
        (this.onGround = !1),
        this.sliding &&
          ((this.sliding = !1), (this.vel.x *= 1.05), (this.vel.z *= 1.05)),
        s.push({ type: "jump" }));
    } else {
      const nt = this.vel.x * m.x + this.vel.z * m.z,
        _t = Math.max(0, Math.min(16 * t, f - nt));
      ((this.vel.x += m.x * _t), (this.vel.z += m.z * _t));
      const Lt = Math.exp(-0.25 * t);
      ((this.vel.x *= Lt), (this.vel.z *= Lt));
    }
    ((this.vel.y -= (this.vel.y < 0 ? 30 : 24) * t),
      (this.vel.y = Math.max(this.vel.y, -40)));
    const w = this.vel.y;
    ((this.pos.x += this.vel.x * t),
      (this.pos.z += this.vel.z * t),
      (this.pos.y += this.vel.y * t));
    const M = this.crouch ? 1.2 : this.height,
      [_, L] = this.arena.resolveCircle(
        this.pos.x,
        this.pos.z,
        this.radius,
        this.pos.y,
        M,
        0.35,
      );
    if (_ !== this.pos.x || L !== this.pos.z) {
      const K = _ - this.pos.x,
        nt = L - this.pos.z,
        _t = Math.hypot(K, nt);
      if (_t > 1e-6) {
        const Lt = (this.vel.x * K + this.vel.z * nt) / _t;
        Lt < 0 &&
          ((this.vel.x -= (K / _t) * Lt), (this.vel.z -= (nt / _t) * Lt));
      }
      ((this.pos.x = _), (this.pos.z = L));
    }
    const R = this.arena.floorAt(
        this.pos.x,
        this.pos.z,
        this.radius,
        this.pos.y,
      ),
      A = this.onGround;
    if (this.pos.y <= R + 0.001) {
      if (
        this.vel.y <= 0 &&
        ((this.pos.y = R), (this.vel.y = 0), (this.onGround = !0), !A)
      ) {
        const K = MathUtils.clamp(-w / 14, 0.15, 1);
        ((this.landVel -= K * 2.2), s.push({ type: "land", strength: K }));
      }
    } else this.pos.y > R + 0.02 && (this.onGround = !1);
    ((this.speed = Math.hypot(this.vel.x, this.vel.z)),
      this.localVel.set(
        this.vel.x * d + this.vel.z * u,
        this.vel.y,
        -(this.vel.x * c + this.vel.z * h),
      ),
      this.dead ||
        ((this.regenDelay -= t),
        this.regenDelay <= 0 &&
          this.hp < this.maxHp &&
          (this.hp = Math.min(this.maxHp, this.hp + 120 * t))),
      (this.hurtFlash = Math.max(0, this.hurtFlash - t * 2.5)),
      (this.eye = Ln(
        this.eye,
        this.crouch ? this.eyeCrouch : this.eyeStand,
        16,
        t,
      )));
    const C = this.onGround && this.speed > 0.6 && !this.sliding;
    if (C) {
      const K = this.sprinting ? 12.5 : 8.8;
      ((this.bobPhase += t * K * Math.min(1, this.speed / 4)),
        (this.stepDist += this.speed * t));
      const nt = this.sprinting ? 2.7 : this.crouch ? 1.6 : 2.15;
      this.stepDist > nt &&
        ((this.stepDist = 0), s.push({ type: "step", sprint: this.sprinting }));
    }
    this.bobAmt = Ln(this.bobAmt, C ? Math.min(1, this.speed / 4.5) : 0, 10, t);
    const S = (this.sprinting ? 1.7 : 1) * (1 - this.ads * 0.75),
      y = Math.sin(this.bobPhase) * 0.016 * this.bobAmt * S,
      P = Math.sin(this.bobPhase * 2) * 0.011 * this.bobAmt * S;
    ((this.landVel += (-this.landDip * 160 - this.landVel * 15) * t),
      (this.landDip += this.landVel * t),
      (this.landDip = MathUtils.clamp(this.landDip, -0.35, 0.2)),
      (this.recoilPV += (-this.recoilP * 110 - this.recoilPV * 17) * t),
      (this.recoilP += this.recoilPV * t),
      (this.recoilYV += (-this.recoilY * 110 - this.recoilYV * 17) * t),
      (this.recoilY += this.recoilYV * t),
      (this.trauma = Math.max(0, this.trauma - t * 1.5)));
    const z = this.trauma * this.trauma,
      U = n * 30,
      H = z * 0.045 * (Math.sin(U * 1.1) * 0.6 + Math.sin(U * 2.3 + 1) * 0.4),
      k = z * 0.045 * (Math.sin(U * 0.9 + 2) * 0.6 + Math.sin(U * 2.7) * 0.4),
      G = z * 0.03 * Math.sin(U * 1.7 + 0.5),
      q =
        -this.moveInput.x * 0.012 * (1 - this.ads * 0.6) -
        this.localVel.x * 0.0025 +
        (this.sliding ? 0.07 : 0);
    ((this.roll = Ln(this.roll, q, 9, t)),
      (this.sprintBlend = Ln(this.sprintBlend, this.sprinting ? 1 : 0, 10, t)),
      (this.slideBlend = Ln(this.slideBlend, this.sliding ? 1 : 0, 10, t)),
      this.camPos.set(
        this.pos.x + d * y,
        this.pos.y + this.eye + P + this.landDip * 0.5,
        this.pos.z + u * y,
      ),
      this._euler.set(
        this.pitch + this.recoilP + this.landDip * 0.9 + H,
        this.yaw + this.recoilY + k,
        this.roll + G,
        "YXZ",
      ),
      this.camQuat.setFromEuler(this._euler),
      this.forward.set(0, 0, -1).applyQuaternion(this.camQuat),
      this.right.set(1, 0, 0).applyQuaternion(this.camQuat));
    const O = 80 + this.sprintBlend * 6 + this.slideBlend * 9,
      et = MathUtils.lerp(O, this.adsFov, this.ads);
    this.fov = Ln(this.fov, et, 18, t);
  }
}
const tt = {
  metal: new MeshStandardMaterial({
    color: 4014409,
    roughness: 0.38,
    metalness: 0.9,
  }),
  metalDark: new MeshStandardMaterial({
    color: 1711394,
    roughness: 0.46,
    metalness: 0.92,
  }),
  metalLight: new MeshStandardMaterial({
    color: 6054508,
    roughness: 0.32,
    metalness: 0.92,
  }),
  polymer: new MeshStandardMaterial({
    color: 1118741,
    roughness: 0.84,
    metalness: 0.1,
  }),
  polymer2: new MeshStandardMaterial({
    color: 1974566,
    roughness: 0.72,
    metalness: 0.2,
  }),
  accent: new MeshStandardMaterial({
    color: 0,
    emissive: 6222591,
    emissiveIntensity: 1.4,
    roughness: 0.5,
    metalness: 0,
  }),
  orange: new MeshStandardMaterial({
    color: 0,
    emissive: 16742938,
    emissiveIntensity: 1.4,
    roughness: 0.5,
    metalness: 0,
  }),
  white: new MeshStandardMaterial({
    color: 0,
    emissive: 16777215,
    emissiveIntensity: 4,
    roughness: 0.5,
    metalness: 0,
  }),
  glove: new MeshStandardMaterial({
    color: 1776672,
    roughness: 0.9,
    metalness: 0.05,
  }),
  sleeve: new MeshStandardMaterial({
    color: 2369325,
    roughness: 0.95,
    metalness: 0.02,
  }),
  tube: new MeshStandardMaterial({
    color: 1711394,
    roughness: 0.46,
    metalness: 0.92,
    side: DoubleSide,
  }),
};
function ot(i, t, e, n, s = 0, r = 0, a = 0, l = 0) {
  const o =
      l > 0 ? new RoundedBoxGeometry(i, t, e, 2, l) : new BoxGeometry(i, t, e),
    c = new Mesh(o, n);
  return (c.position.set(s, r, a), c);
}
function Ae(i, t, e, n, s = 0, r = 0, a = 0, l = "z", o = 18, c = !1) {
  const h = new CylinderGeometry(i, t, e, o, 1, c);
  l === "z" ? h.rotateX(Math.PI / 2) : l === "x" && h.rotateZ(Math.PI / 2);
  const d = new Mesh(h, n);
  return (d.position.set(s, r, a), d);
}
function Ma(i, t, e, n, s) {
  const r = new Mesh(new SphereGeometry(i, 12, 10), t);
  return (r.position.set(e, n, s), r);
}
function Vl(i, t, e, n, s) {
  const r = new Vector3(...i),
    a = new Vector3(...t),
    l = r.distanceTo(a),
    o = new CylinderGeometry(n, e, l, 14),
    c = new Mesh(o, s),
    h = a.clone().sub(r).normalize();
  return (
    c.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), h),
    c.position.copy(r).lerp(a, 0.5),
    c
  );
}
function Gl(i, t, e, n, s, r) {
  const a = new TorusGeometry(i, t, 8, 24),
    l = new Mesh(a, e);
  return (l.position.set(n, s, r), l);
}
function za(i, t = -0.3) {
  const e = new Group();
  (e.add(ot(0.05, 0.085, 0.052, tt.glove, 0.004, 0, 0.026, 0.014)),
    e.add(ot(0.05, 0.072, 0.028, tt.glove, 0, -0.012, -0.022, 0.01)));
  for (let n = 0; n < 4; n++)
    e.add(ot(0.05, 0.014, 0.03, tt.glove, 0, 0.02 - n * 0.017, -0.026, 0.005));
  return (
    e.add(ot(0.018, 0.045, 0.02, tt.glove, -0.03, 0.03, 0.01, 0.006)),
    e.add(Vl([0.01, -0.05, 0.05], [0.11, -0.3, 0.38], 0.036, 0.055, tt.sleeve)),
    e.position.set(i[0], i[1], i[2]),
    (e.rotation.x = t),
    e
  );
}
function Oa(i, t = [-0.13, -0.34, 0.24]) {
  const e = new Group();
  (e.add(ot(0.05, 0.048, 0.088, tt.glove, -0.004, -0.032, 0, 0.014)),
    e.add(ot(0.02, 0.06, 0.084, tt.glove, 0.03, -0.004, 0, 0.008)));
  for (let n = 0; n < 4; n++)
    e.add(
      ot(0.016, 0.028, 0.017, tt.glove, 0.036, 0.025, -0.03 + n * 0.02, 0.005),
    );
  return (
    e.add(ot(0.02, 0.05, 0.028, tt.glove, -0.034, -0.002, 0.02, 0.007)),
    e.add(Vl([-0.01, -0.05, 0.02], t, 0.036, 0.055, tt.sleeve)),
    e.position.set(i[0], i[1], i[2]),
    e
  );
}
function C0(i) {
  const t = new Group(),
    e = {};
  (t.add(ot(0.068, 0.07, 0.25, tt.metal, 0, 0.035, -0.03, 0.008)),
    t.add(ot(0.062, 0.056, 0.17, tt.metalDark, 0, -0.025, 0, 0.006)),
    t.add(ot(0.024, 0.012, 0.25, tt.metalDark, 0, 0.076, -0.03)));
  for (let h = 0; h < 7; h++)
    t.add(ot(0.026, 0.005, 0.012, tt.metal, 0, 0.084, 0.07 - h * 0.03));
  (t.add(ot(0.03, 0.018, 0.02, tt.metalLight, 0, 0.05, -0.15)),
    t.add(ot(0.002, 0.008, 0.06, tt.accent, 0.0355, 0.03, -0.05)),
    t.add(ot(0.002, 0.008, 0.06, tt.accent, -0.0355, 0.03, -0.05)));
  const n = new Group();
  n.position.set(0, -0.05, -0.02);
  const s = ot(0.04, 0.17, 0.07, tt.polymer2, 0, -0.085, 0.008, 0.005);
  ((s.rotation.x = 0.13), n.add(s));
  const r = ot(0.043, 0.012, 0.074, tt.metalDark, 0, -0.17, 0.03);
  ((r.rotation.x = 0.13),
    n.add(r),
    n.add(ot(0.041, 0.004, 0.071, tt.orange, 0, -0.06, 0.006)),
    t.add(n),
    (e.mag = n),
    (e.magRest = n.position.clone()));
  const a = ot(0.032, 0.105, 0.046, tt.polymer, 0, -0.1, 0.078, 0.007);
  ((a.rotation.x = -0.32),
    t.add(a),
    t.add(ot(0.006, 0.02, 0.008, tt.metalLight, 0, -0.06, 0.035)),
    t.add(ot(0.004, 0.004, 0.06, tt.metalDark, 0, -0.072, 0.03)),
    t.add(Ae(0.017, 0.017, 0.2, tt.metalDark, 0, 0.022, 0.2)),
    t.add(ot(0.046, 0.085, 0.13, tt.polymer, 0, 0, 0.31, 0.008)),
    t.add(ot(0.05, 0.11, 0.025, tt.polymer2, 0, -0.004, 0.375, 0.006)),
    t.add(ot(0.056, 0.058, 0.3, tt.polymer2, 0, 0.034, -0.31, 0.008)));
  for (let h = 0; h < 9; h++)
    t.add(ot(0.062, 0.005, 0.012, tt.metalDark, 0, 0.065, -0.18 - h * 0.03));
  for (let h = 0; h < 5; h++)
    (t.add(ot(0.002, 0.02, 0.028, tt.metalDark, 0.029, 0.03, -0.22 - h * 0.04)),
      t.add(
        ot(0.002, 0.02, 0.028, tt.metalDark, -0.029, 0.03, -0.22 - h * 0.04),
      ));
  (t.add(ot(0.002, 0.005, 0.2, tt.accent, 0.0292, 0.048, -0.31)),
    t.add(Ae(0.011, 0.011, 0.3, tt.metal, 0, 0.034, -0.6)),
    t.add(Ae(0.015, 0.015, 0.03, tt.metalDark, 0, 0.034, -0.48)),
    t.add(Ae(0.016, 0.0145, 0.07, tt.metalDark, 0, 0.034, -0.77)));
  for (let h = 0; h < 3; h++)
    t.add(ot(0.036, 0.004, 0.008, tt.polymer, 0, 0.034, -0.75 - h * 0.015));
  ((e.muzzle = new Object3D()),
    e.muzzle.position.set(0, 0.034, -0.805),
    t.add(e.muzzle));
  const l = ot(0.03, 0.026, 0.05, tt.metalLight, 0, 0.058, 0.1);
  (t.add(l),
    (e.bolt = l),
    (e.boltRest = 0.1),
    (e.boltTravel = 0.045),
    (e.eject = new Object3D()),
    e.eject.position.set(0.04, 0.045, -0.03),
    t.add(e.eject),
    t.add(ot(0.03, 0.02, 0.05, tt.metalDark, 0, 0.093, -0.07, 0.004)),
    t.add(ot(0.012, 0.012, 0.014, tt.metalDark, 0, 0.108, -0.055)));
  const o = Ae(0.02, 0.02, 0.036, tt.tube, 0, 0.122, -0.07, "z", 28, !0);
  (t.add(o),
    t.add(
      Ae(0.0225, 0.0225, 0.006, tt.metalDark, 0, 0.122, -0.089, "z", 28, !0),
    ),
    t.add(
      Ae(0.0225, 0.0225, 0.006, tt.metalDark, 0, 0.122, -0.051, "z", 28, !0),
    ),
    t.add(ot(0.008, 0.006, 0.012, tt.orange, 0, 0.104, -0.075)));
  const c = new Mesh(new CircleGeometry(0.0195, 36), i);
  return (
    c.position.set(0, 0.122, -0.068),
    (c.renderOrder = 5),
    t.add(c),
    (e.lens = c),
    (e.sight = new Object3D()),
    e.sight.position.set(0, 0.122, -0.068),
    t.add(e.sight),
    (e.adsOffset = new Vector3(0, -0.122, -0.2)),
    (e.hipOffset = new Vector3(0.165, -0.165, -0.31)),
    (e.hipRot = new Euler(0, 0.035, 0.02)),
    (e.handR = za([0.004, -0.11, 0.09])),
    t.add(e.handR),
    (e.handL = Oa([-0.002, -0.006, -0.3], [-0.13, -0.33, -0.02])),
    t.add(e.handL),
    (e.handLRest = e.handL.position.clone()),
    { group: t, parts: e }
  );
}
function P0() {
  const i = new Group(),
    t = {};
  (i.add(ot(0.058, 0.088, 0.24, tt.metal, 0, 0.022, -0.02, 0.008)),
    i.add(ot(0.062, 0.04, 0.12, tt.metalDark, 0, -0.02, 0, 0.006)),
    i.add(ot(0.002, 0.03, 0.08, tt.metalDark, 0.0295, 0.03, -0.02)),
    i.add(ot(0.002, 0.006, 0.09, tt.orange, -0.0295, 0.04, -0.03)),
    i.add(Ae(0.0125, 0.0125, 0.62, tt.metalDark, 0, 0.06, -0.43)),
    i.add(Ae(0.0115, 0.0115, 0.52, tt.metal, 0, 0.014, -0.38)),
    i.add(Ae(0.015, 0.015, 0.024, tt.metalDark, 0, 0.014, -0.65)),
    i.add(ot(0.03, 0.062, 0.02, tt.metalDark, 0, 0.037, -0.6)),
    i.add(Ae(0.0145, 0.0145, 0.04, tt.metalLight, 0, 0.06, -0.73)),
    (t.muzzle = new Object3D()),
    t.muzzle.position.set(0, 0.06, -0.755),
    i.add(t.muzzle));
  const e = new Group();
  (e.position.set(0, 0.014, -0.34),
    e.add(ot(0.05, 0.052, 0.16, tt.polymer2, 0, 0, 0, 0.01)));
  for (let a = 0; a < 5; a++)
    e.add(ot(0.054, 0.006, 0.01, tt.metalDark, 0, 0, -0.06 + a * 0.03));
  (i.add(e), (t.pump = e), (t.pumpRest = -0.34), (t.pumpTravel = 0.085));
  const n = ot(0.05, 0.1, 0.25, tt.polymer, 0, -0.018, 0.255, 0.01);
  ((n.rotation.x = 0.06),
    i.add(n),
    i.add(ot(0.056, 0.12, 0.03, tt.polymer2, 0, -0.03, 0.38, 0.006)),
    i.add(ot(0.04, 0.008, 0.16, tt.orange, 0, 0.04, 0.24)));
  const s = ot(0.035, 0.1, 0.05, tt.polymer, 0, -0.09, 0.085, 0.007);
  ((s.rotation.x = -0.35),
    i.add(s),
    i.add(ot(0.006, 0.02, 0.008, tt.metalLight, 0, -0.055, 0.04)),
    i.add(ot(0.004, 0.004, 0.06, tt.metalDark, 0, -0.066, 0.04)),
    i.add(ot(0.012, 0.012, 0.03, tt.metalDark, 0, 0.072, -0.7)),
    i.add(Ma(0.005, tt.white, 0, 0.081, -0.7)),
    i.add(ot(0.022, 0.01, 0.024, tt.metalDark, 0, 0.07, -0.1)));
  const r = Gl(0.0095, 0.0018, tt.metalDark, 0, 0.081, -0.1);
  return (
    i.add(r),
    i.add(ot(0.003, 0.012, 0.004, tt.metalDark, 0.0128, 0.078, -0.1)),
    i.add(ot(0.003, 0.012, 0.004, tt.metalDark, -0.0128, 0.078, -0.1)),
    (t.sight = new Object3D()),
    t.sight.position.set(0, 0.081, -0.1),
    i.add(t.sight),
    (t.adsOffset = new Vector3(0, -0.081, -0.14)),
    (t.hipOffset = new Vector3(0.17, -0.18, -0.3)),
    (t.hipRot = new Euler(0, 0.04, 0.03)),
    (t.eject = new Object3D()),
    t.eject.position.set(0.035, 0.03, -0.03),
    i.add(t.eject),
    (t.handR = za([0.004, -0.1, 0.1], -0.35)),
    i.add(t.handR),
    (t.handL = Oa([-0.002, -0.028, 0], [-0.12, -0.33, 0.28])),
    e.add(t.handL),
    (t.handLRest = t.handL.position.clone()),
    { group: i, parts: t }
  );
}
function L0() {
  const i = new Group(),
    t = {};
  (i.add(ot(0.07, 0.09, 0.32, tt.metal, 0, 0.02, -0.05, 0.008)),
    i.add(ot(0.024, 0.012, 0.32, tt.metalDark, 0, 0.071, -0.05)));
  for (let l = 0; l < 9; l++)
    i.add(ot(0.026, 0.005, 0.012, tt.metal, 0, 0.079, 0.08 - l * 0.032));
  (i.add(ot(0.064, 0.05, 0.15, tt.metalDark, 0, -0.03, 0.02, 0.006)),
    i.add(ot(0.002, 0.01, 0.12, tt.orange, 0.0355, 0.03, -0.06)),
    i.add(ot(0.002, 0.01, 0.12, tt.orange, -0.0355, 0.03, -0.06)),
    i.add(ot(0.064, 0.068, 0.38, tt.polymer2, 0, 0.032, -0.41, 0.008)));
  for (let l = 0; l < 8; l++)
    (i.add(ot(0.002, 0.03, 0.02, tt.metalDark, 0.033, 0.03, -0.28 - l * 0.04)),
      i.add(
        ot(0.002, 0.03, 0.02, tt.metalDark, -0.033, 0.03, -0.28 - l * 0.04),
      ),
      i.add(ot(0.03, 0.002, 0.02, tt.metalDark, 0, -0.003, -0.28 - l * 0.04)));
  (i.add(ot(0.002, 0.004, 0.3, tt.accent, 0.0332, 0.055, -0.4)),
    i.add(Ae(0.013, 0.013, 0.48, tt.metalDark, 0, 0.036, -0.82)),
    i.add(Ae(0.022, 0.019, 0.1, tt.metalDark, 0, 0.036, -1.06)));
  for (let l = 0; l < 4; l++)
    i.add(ot(0.05, 0.005, 0.01, tt.polymer, 0, 0.036, -1.03 - l * 0.018));
  ((t.muzzle = new Object3D()),
    t.muzzle.position.set(0, 0.036, -1.115),
    i.add(t.muzzle));
  const e = new Group();
  e.position.set(0, -0.04, -0.15);
  const n = ot(0.042, 0.13, 0.1, tt.metalDark, 0, -0.065, 0.006, 0.005);
  ((n.rotation.x = 0.1), e.add(n));
  const s = ot(0.045, 0.012, 0.104, tt.metal, 0, -0.13, 0.02);
  ((s.rotation.x = 0.1),
    e.add(s),
    i.add(e),
    (t.mag = e),
    (t.magRest = e.position.clone()));
  const r = ot(0.034, 0.105, 0.05, tt.polymer, 0, -0.1, 0.07, 0.007);
  ((r.rotation.x = -0.3),
    i.add(r),
    i.add(ot(0.006, 0.02, 0.008, tt.metalLight, 0, -0.06, 0.03)),
    i.add(ot(0.004, 0.004, 0.06, tt.metalDark, 0, -0.075, 0.03)),
    i.add(ot(0.05, 0.11, 0.3, tt.polymer, 0, -0.012, 0.29, 0.01)),
    i.add(ot(0.046, 0.032, 0.15, tt.polymer2, 0, 0.06, 0.27, 0.008)),
    i.add(ot(0.056, 0.125, 0.03, tt.polymer2, 0, -0.02, 0.445, 0.006)));
  const a = new Group();
  return (
    a.position.set(0, 0.048, 0.03),
    a.add(Ae(0.006, 0.006, 0.045, tt.metalLight, 0.055, 0, 0, "x")),
    a.add(Ma(0.011, tt.metalLight, 0.08, 0, 0)),
    i.add(a),
    (t.bolt = a),
    (t.boltRest = 0.03),
    (t.boltTravel = 0.07),
    (t.eject = new Object3D()),
    t.eject.position.set(0.04, 0.05, 0),
    i.add(t.eject),
    i.add(ot(0.016, 0.012, 0.03, tt.metalDark, 0, 0.082, -0.76)),
    i.add(ot(0.0045, 0.024, 0.0045, tt.metalDark, 0, 0.099, -0.76)),
    i.add(Ma(0.0028, tt.white, 0, 0.1115, -0.76)),
    i.add(Ae(0.0175, 0.0175, 0.02, tt.tube, 0, 0.105, -0.76, "z", 24, !0)),
    i.add(ot(0.032, 0.012, 0.03, tt.metalDark, 0, 0.078, -0.17)),
    i.add(ot(0.014, 0.024, 0.016, tt.metalDark, 0, 0.094, -0.17)),
    i.add(Gl(0.0125, 0.0025, tt.metalDark, 0, 0.1115, -0.17)),
    (t.sight = new Object3D()),
    t.sight.position.set(0, 0.1115, -0.17),
    i.add(t.sight),
    (t.adsOffset = new Vector3(0, -0.1115, -0.08)),
    (t.hipOffset = new Vector3(0.16, -0.165, -0.28)),
    (t.hipRot = new Euler(0, 0.03, 0.02)),
    (t.handR = za([0.004, -0.115, 0.085])),
    i.add(t.handR),
    (t.handL = Oa([-0.002, -0.01, -0.4], [-0.13, -0.34, -0.1])),
    i.add(t.handL),
    (t.handLRest = t.handL.position.clone()),
    { group: i, parts: t }
  );
}
function D0() {
  return new ShaderMaterial({
    transparent: !0,
    depthWrite: !1,
    side: DoubleSide,
    uniforms: {
      uSightPos: { value: new Vector3() },
      uSightFwd: { value: new Vector3(0, 0, -1) },
      uColor: { value: new Color(1, 0.12, 0.08) },
      uDotRadius: { value: 0.00115 },
      uTime: { value: 0 },
      uBright: { value: 1 },
    },
    vertexShader: `
      varying vec3 vWorldPos; varying vec3 vNormal; varying vec2 vUv;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz; vNormal = normalize(mat3(modelMatrix) * normal); vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform vec3 uSightPos; uniform vec3 uSightFwd; uniform vec3 uColor; uniform float uDotRadius; uniform float uTime; uniform float uBright;
      varying vec3 vWorldPos; varying vec3 vNormal; varying vec2 vUv;
      void main(){
        float s = dot(uSightPos - cameraPosition, uSightFwd);
        vec3 dotPos = cameraPosition + uSightFwd * s;
        float d = length(vWorldPos - dotPos);
        float dotA = smoothstep(uDotRadius, uDotRadius * 0.45, d);
        float glow = exp(-d * d / (uDotRadius * uDotRadius * 9.0)) * 0.55;
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fres = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 3.0);
        vec2 c = vUv - 0.5; float r = length(c) * 2.0;
        float edge = smoothstep(0.82, 1.0, r);
        vec3 tint = vec3(0.25, 0.45, 0.75) * 0.10 + fres * vec3(0.3, 0.5, 0.8) * 0.45;
        float alpha = 0.2 + fres * 0.35 + edge * 0.55;
        vec3 col = tint * (1.0 - edge * 0.7);
        float flick = 0.92 + 0.08 * sin(uTime * 70.0);
        col += uColor * (dotA * 9.0 + glow * 2.5) * flick * uBright;
        gl_FragColor = vec4(col, clamp(alpha + dotA, 0.0, 1.0));
      }`,
  });
}
const Jo = new Vector3(),
  Qo = new Vector3();
function U0(i, t, e) {
  (t.getWorldPosition(Jo),
    t.getWorldDirection(Qo),
    i.uniforms.uSightPos.value.copy(Jo),
    i.uniforms.uSightFwd.value.copy(Qo).negate(),
    (i.uniforms.uTime.value = e));
}
class I0 {
  constructor() {
    ((this.group = new Group()),
      (this.uniforms = {
        uLife: { value: 1 },
        uSeed: { value: 0 },
        uIntensity: { value: 1 },
        uColor: { value: new Color(1, 0.6, 0.2) },
      }));
    const t = new ShaderMaterial({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        side: DoubleSide,
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uLife; uniform float uSeed; uniform float uIntensity; uniform vec3 uColor; varying vec2 vUv;
        ${Nn}
        void main(){
          float u = vUv.x; float v = (vUv.y - 0.5) * 2.0;
          float n = noise2(vec2(u * 5.0 + uSeed * 10.0, v * 3.0 + uSeed * 3.0));
          float n2 = noise2(vec2(u * 12.0 - uSeed * 7.0, v * 6.0));
          float width = (1.0 - u * 0.85) * (0.45 + 0.7 * n) * (1.0 - uLife * 0.5);
          float shape = smoothstep(width, width * 0.25, abs(v));
          float len = 1.0 - smoothstep(0.45 + n * 0.5, 1.0, u);
          float core = smoothstep(width * 0.7, 0.0, abs(v)) * (1.0 - u) * (0.7 + 0.6 * n2);
          vec3 col = mix(uColor, vec3(1.0, 0.95, 0.8), core);
          float a = shape * len * (1.0 - uLife) * (0.7 + 0.3 * n2);
          gl_FragColor = vec4(col * uIntensity * (1.0 + core * 3.0) * a, a);
        }`,
      }),
      e = new ShaderMaterial({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        side: DoubleSide,
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uLife; uniform float uSeed; uniform float uIntensity; uniform vec3 uColor; varying vec2 vUv;
        void main(){
          vec2 c = vUv - 0.5; float r = length(c) * 2.0; float ang = atan(c.y, c.x);
          float spikes = 0.55 + 0.45 * sin(ang * 7.0 + uSeed * 20.0) * sin(ang * 3.0 - uSeed * 9.0);
          float a = smoothstep(1.0, 0.05, r / (0.45 + 0.55 * spikes)) * (1.0 - uLife);
          vec3 col = mix(uColor, vec3(1.0, 0.95, 0.85), smoothstep(0.6, 0.0, r));
          gl_FragColor = vec4(col * uIntensity * (1.0 + smoothstep(0.5, 0.0, r) * 3.0) * a, a);
        }`,
      }),
      n = new PlaneGeometry(1, 1);
    (n.rotateY(Math.PI / 2), n.translate(0, 0, -0.5));
    const s = new Mesh(n, t),
      r = new Mesh(n, t);
    r.rotation.z = Math.PI / 2;
    const a = new Mesh(n, t);
    ((a.rotation.z = Math.PI / 4), a.scale.set(1, 0.7, 0.8));
    const l = new Mesh(new PlaneGeometry(1, 1), e);
    ((l.position.z = -0.02),
      (this.planes = [s, r, a]),
      (this.disc = l),
      (this.inner = new Group()),
      this.inner.add(s, r, a, l),
      this.group.add(this.inner),
      (this.light = new PointLight(16752704, 0, 3, 2)),
      (this.light.position.z = -0.05),
      this.group.add(this.light),
      (this.group.visible = !1),
      (this.timer = 0),
      (this.duration = 0.06),
      (this.intensity = 0));
  }
  fire(t) {
    ((this.group.visible = !0),
      (this.timer = 0),
      (this.duration = t.duration || 0.06),
      (this.uniforms.uSeed.value = Math.random()),
      (this.uniforms.uIntensity.value = t.intensity || 1.6),
      this.uniforms.uColor.value.setRGB(t.color[0], t.color[1], t.color[2]));
    const e = 0.8 + Math.random() * 0.45,
      n = t.length * e,
      s = t.width * e;
    for (const r of this.planes) r.scale.set(1, s, n);
    (this.planes[2].scale.set(1, s * 0.7, n * 0.8),
      this.disc.scale.set(s * 1.4, s * 1.4, 1),
      (this.inner.rotation.z = Math.random() * Math.PI * 2),
      (this.peakLight = t.light || 14),
      (this.light.intensity = this.peakLight),
      (this.intensity = 1));
  }
  update(t) {
    if (!this.group.visible) {
      this.intensity = 0;
      return;
    }
    this.timer += t;
    const e = Math.min(1, this.timer / this.duration);
    ((this.uniforms.uLife.value = e),
      (this.light.intensity = this.peakLight * (1 - e)),
      (this.intensity = 1 - e),
      e >= 1 && ((this.group.visible = !1), (this.intensity = 0)));
  }
}
const tl = Math.PI / 180,
  pn = (i, t) => i + Math.random() * (t - i),
  Wn = MathUtils.damp,
  el = (i) => i * i * (3 - 2 * i),
  Mi = (i) => 1 - Math.pow(1 - Math.min(1, Math.max(0, i)), 3),
  N0 = [
    {
      key: "ar",
      name: "VK-7 ASSAULT RIFLE",
      mode: "FULL AUTO",
      auto: !0,
      rpm: 800,
      damage: 26,
      headMult: 2,
      magSize: 30,
      reserve: 240,
      reloadTime: 1.85,
      adsTime: 0.2,
      adsFov: 58,
      moveMult: 1,
      pellets: 1,
      spreadHip: 0.024,
      spreadAds: 0.0022,
      spreadMove: 0.02,
      bloomPerShot: 0.0032,
      bloomMax: 0.026,
      bloomDecay: 0.09,
      recoilPitch: 0.62,
      recoilYaw: 0.42,
      adsRecoilReduce: 0.35,
      recoilPermanent: 0.42,
      pattern: [
        0, 0.1, 0.25, 0.45, 0.6, 0.6, 0.4, 0.1, -0.2, -0.5, -0.7, -0.7, -0.5,
        -0.2, 0.1, 0.4, 0.6, 0.5, 0.2, 0,
      ],
      kickBack: 0.032,
      kickUp: 0.006,
      kickPitch: 0.024,
      kickYaw: 0.007,
      kickRoll: 0.014,
      trauma: 0.055,
      weight: 0.4,
      tracer: [1, 0.82, 0.5],
      tracerWidth: 0.035,
      tracerEvery: 1,
      falloffStart: 28,
      falloffEnd: 60,
      falloffMin: 0.6,
      kbForce: 1.1,
      flash: {
        length: 0.42,
        width: 0.2,
        color: [1, 0.62, 0.22],
        intensity: 1.7,
        duration: 0.055,
        light: 12,
      },
      sound: "ar",
      shell: "ar",
      boltAnimTime: 0.07,
      sprintOut: 0.18,
      switchTime: 0.42,
      smoke: 0.5,
    },
    {
      key: "shotgun",
      name: "HAMMER-12 SHOTGUN",
      mode: "PUMP ACTION",
      auto: !1,
      rpm: 95,
      damage: 15,
      headMult: 1.5,
      magSize: 8,
      reserve: 48,
      reloadTime: 0.46,
      reloadIntro: 0.32,
      reloadOutro: 0.32,
      adsTime: 0.24,
      adsFov: 64,
      moveMult: 1.05,
      pellets: 9,
      pelletSpread: 0.052,
      pelletSpreadAds: 0.036,
      spreadHip: 0.01,
      spreadAds: 0,
      spreadMove: 0.01,
      bloomPerShot: 0,
      bloomMax: 0,
      bloomDecay: 1,
      recoilPitch: 3.4,
      recoilYaw: 1,
      adsRecoilReduce: 0.3,
      recoilPermanent: 0.45,
      pattern: null,
      kickBack: 0.115,
      kickUp: 0.02,
      kickPitch: 0.095,
      kickYaw: 0.02,
      kickRoll: 0.045,
      trauma: 0.26,
      weight: 0.6,
      tracer: [1, 0.7, 0.35],
      tracerWidth: 0.02,
      tracerEvery: 3,
      falloffStart: 7,
      falloffEnd: 22,
      falloffMin: 0.12,
      kbForce: 3.2,
      flash: {
        length: 0.7,
        width: 0.36,
        color: [1, 0.55, 0.18],
        intensity: 2.2,
        duration: 0.075,
        light: 24,
      },
      sound: "shotgun",
      shell: "shotgun",
      pumpTime: 0.6,
      sprintOut: 0.22,
      switchTime: 0.48,
      smoke: 2,
    },
    {
      key: "dmr",
      name: "LONGSHOT DMR",
      mode: "SEMI AUTO",
      auto: !1,
      rpm: 250,
      damage: 96,
      headMult: 2.6,
      magSize: 15,
      reserve: 60,
      reloadTime: 2.35,
      adsTime: 0.3,
      adsFov: 42,
      moveMult: 0.9,
      pellets: 1,
      spreadHip: 0.032,
      spreadAds: 6e-4,
      spreadMove: 0.03,
      bloomPerShot: 0.004,
      bloomMax: 0.02,
      bloomDecay: 0.06,
      recoilPitch: 2.7,
      recoilYaw: 0.9,
      adsRecoilReduce: 0.25,
      recoilPermanent: 0.45,
      pattern: null,
      kickBack: 0.09,
      kickUp: 0.015,
      kickPitch: 0.075,
      kickYaw: 0.015,
      kickRoll: 0.03,
      trauma: 0.18,
      weight: 0.85,
      tracer: [0.6, 0.9, 1],
      tracerWidth: 0.05,
      tracerEvery: 1,
      falloffStart: 100,
      falloffEnd: 200,
      falloffMin: 0.8,
      kbForce: 4,
      flash: {
        length: 0.75,
        width: 0.3,
        color: [1, 0.75, 0.35],
        intensity: 2,
        duration: 0.07,
        light: 22,
      },
      sound: "dmr",
      shell: "dmr",
      boltAnimTime: 0.16,
      boltDelay: 0.06,
      sprintOut: 0.25,
      switchTime: 0.55,
      smoke: 1.2,
    },
  ],
  Tr = new Vector3(0.07, -0.085, 0.02),
  br = new Vector3(-0.42, 0.55, 0.3),
  F0 = new Vector3(0, -0.075, 0.37);
class z0 {
  constructor(t, e) {
    ((this.def = t),
      (this.model = e),
      (this.mag = t.magSize),
      (this.reserve = t.reserve),
      (this.cooldown = 0),
      (this.reload = null),
      (this.bloom = 0),
      (this.burst = 0),
      (this.lastShot = -10),
      (this.boltT = 0),
      (this.pumpT = 0),
      (this.pumping = !1),
      (this.pumpSounded = !1),
      (this.pumpShell = !1),
      (this.boltDelayT = -1));
  }
  get reloading() {
    return this.reload !== null;
  }
  reset() {
    ((this.mag = this.def.magSize),
      (this.reserve = this.def.reserve),
      (this.cooldown = 0),
      (this.reload = null),
      (this.bloom = 0),
      (this.burst = 0),
      (this.boltT = 0),
      (this.pumping = !1),
      (this.boltDelayT = -1));
    const t = this.model.parts;
    (t.mag &&
      (t.mag.position.copy(t.magRest),
      t.mag.rotation.set(0, 0, 0),
      (t.mag.visible = !0)),
      t.handL && t.handLRest && t.handL.position.copy(t.handLRest),
      t.pump && (t.pump.position.z = t.pumpRest));
  }
}
class O0 {
  constructor(t, e, n) {
    ((this.audio = e),
      (this.cb = n),
      (this.cam = t),
      (this.rig = new Group()),
      t.add(this.rig),
      (this.redDotMat = D0()));
    const s = [C0(this.redDotMat), P0(), L0()];
    this.weapons = N0.map((r, a) => new z0(r, s[a]));
    for (const r of this.weapons)
      (this.rig.add(r.model.group), (r.model.group.visible = !1));
    ((this.current = 0),
      (this.lastWeapon = 1),
      (this.weapons[0].model.group.visible = !0),
      (this.flash = new I0()),
      this.weapons[0].model.parts.muzzle.add(this.flash.group),
      (this.switching = null),
      (this.ads = 0),
      (this.adsSmooth = 0),
      (this.sprintBlend = 0),
      (this.swayPos = new Vector3()),
      (this.swayPosV = new Vector3()),
      (this.swayRot = new Vector3()),
      (this.swayRotV = new Vector3()),
      (this.kickPos = new Vector3()),
      (this.kickPosV = new Vector3()),
      (this.kickRot = new Vector3()),
      (this.kickRotV = new Vector3()),
      (this.moveOff = new Vector3()),
      (this.moveRot = new Vector3()),
      (this.animPos = new Vector3()),
      (this.animRot = new Vector3()),
      (this._v = new Vector3()),
      (this._v2 = new Vector3()),
      (this._v3 = new Vector3()),
      (this._up = new Vector3()),
      (this.time = 0),
      (this.player = null),
      (this.muzzleWorld = new Vector3()));
  }
  get weapon() {
    return this.weapons[this.current];
  }
  resetAll() {
    for (const t of this.weapons) t.reset();
    ((this.switching = null),
      (this.ads = 0),
      (this.adsSmooth = 0),
      this.swayPos.set(0, 0, 0),
      this.swayPosV.set(0, 0, 0),
      this.swayRot.set(0, 0, 0),
      this.swayRotV.set(0, 0, 0),
      this.kickPos.set(0, 0, 0),
      this.kickPosV.set(0, 0, 0),
      this.kickRot.set(0, 0, 0),
      this.kickRotV.set(0, 0, 0),
      this.animPos.set(0, 0, 0),
      this.animRot.set(0, 0, 0),
      this.selectImmediate(0));
  }
  selectImmediate(t) {
    ((this.weapon.model.group.visible = !1),
      this.weapon.model.parts.muzzle.remove(this.flash.group),
      (this.current = t),
      (this.weapon.model.group.visible = !0),
      this.weapon.model.parts.muzzle.add(this.flash.group),
      this.cb.onWeaponChange && this.cb.onWeaponChange());
  }
  onLand(t) {
    ((this.swayPosV.y -= t * 0.75),
      (this.swayRotV.x -= t * 3.2),
      (this.swayRotV.z += pn(-1, 1) * t * 0.8));
  }
  onJump() {
    ((this.swayPosV.y += 0.28), (this.swayRotV.x += 0.9));
  }
  getSpread(t) {
    const e = this.weapon,
      n = e.def,
      s = this.adsSmooth,
      r =
        Math.min(t.speed / 7, 1.2) * n.spreadMove * (1 - s * 0.7) +
        (t.onGround ? 0 : 0.02 * (1 - s * 0.5));
    let a =
      MathUtils.lerp(n.spreadHip, n.spreadAds, s) + e.bloom * (1 - s * 0.5) + r;
    return (
      n.pellets > 1 &&
        (a += MathUtils.lerp(n.pelletSpread, n.pelletSpreadAds, s) * 0.6),
      a
    );
  }
  update(t, e, n, s) {
    ((this.time = s), (this.player = n));
    const r = this.weapon,
      a = r.def,
      l = r.model.parts;
    ((r.cooldown -= t), (r.bloom = Math.max(0, r.bloom - a.bloomDecay * t)));
    for (const g of this.weapons)
      g.boltT = Math.max(0, g.boltT - t / (g.def.boltAnimTime || 0.1));
    let o = -1;
    (e.justPressed("Digit1") && (o = 0),
      e.justPressed("Digit2") && (o = 1),
      e.justPressed("Digit3") && (o = 2),
      e.wheel !== 0 && (o = (this.current + (e.wheel > 0 ? 1 : 2)) % 3),
      e.justPressed("KeyQ") && (o = this.lastWeapon),
      o >= 0 &&
        o !== this.current &&
        !this.switching &&
        !n.dead &&
        this.startSwitch(o),
      this.switching && this.updateSwitch(t),
      (this.sprintBlend = Wn(
        this.sprintBlend,
        n.sprinting ? 1 : 0,
        n.sprinting ? 9 : 13,
        t,
      )));
    const c =
        !n.sprinting &&
        !r.reloading &&
        !this.switching &&
        !n.dead &&
        !n.sliding,
      h = e.mouseDown[2] && c;
    ((this.ads = MathUtils.clamp(
      this.ads + ((h ? 1 : -1) * t) / a.adsTime,
      0,
      1,
    )),
      (this.adsSmooth = el(this.ads)),
      (n.ads = this.adsSmooth),
      (n.adsFov = a.adsFov),
      (n.moveMult = a.moveMult),
      !n.dead &&
        e.justPressed("KeyR") &&
        !r.reloading &&
        !this.switching &&
        r.mag < a.magSize &&
        r.reserve > 0 &&
        !r.pumping &&
        this.startReload(r),
      r.reloading && this.updateReload(r, t, e),
      r.pumping &&
        ((r.pumpT += t),
        !r.pumpSounded &&
          r.pumpT > 0.1 &&
          ((r.pumpSounded = !0), this.audio.pump()),
        !r.pumpShell &&
          r.pumpT > 0.2 &&
          ((r.pumpShell = !0), this.ejectShell(r)),
        r.pumpT >= a.pumpTime && (r.pumping = !1)),
      r.boltDelayT >= 0 &&
        ((r.boltDelayT -= t),
        r.boltDelayT < 0 && (this.ejectShell(r), (r.boltT = 1))));
    const d = e.mouseDown[0],
      u = e.mousePressed[0];
    ((d || u) && n.sprinting && (n.sprintBlock = a.sprintOut + 0.1),
      !r.reloading &&
        !this.switching &&
        r.cooldown <= 0 &&
        !n.sprinting &&
        this.sprintBlend < 0.45 &&
        !r.pumping &&
        !n.dead &&
        ((a.auto && d) || u) &&
        (r.mag > 0
          ? this.fire(r, n)
          : u && (this.audio.dryFire(), r.reserve > 0 && this.startReload(r))),
      this.updatePose(t, e, n, s),
      this.cam.updateMatrixWorld(!0),
      l.muzzle.getWorldPosition(this.muzzleWorld),
      l.lens && U0(this.redDotMat, l.sight, s),
      this.flash.update(t));
  }
  fire(t, e) {
    const n = t.def;
    (t.model.parts, t.mag--, (t.cooldown = 60 / n.rpm));
    const s = this.time - t.lastShot;
    ((t.burst = s > 0.32 ? 0 : t.burst + 1), (t.lastShot = this.time));
    const r = this.adsSmooth,
      a = this.muzzleWorld.clone(),
      l = e.camPos.clone(),
      o = e.forward,
      c = e.right,
      h = this._up.copy(c).cross(o),
      d = this.getSpreadForShot(e);
    t.bloom = Math.min(n.bloomMax, t.bloom + n.bloomPerShot);
    const u = n.pellets;
    for (let f = 0; f < u; f++) {
      const M =
          (u > 1 ? MathUtils.lerp(n.pelletSpread, n.pelletSpreadAds, r) : d) *
          Math.sqrt(Math.random()),
        _ = Math.random() * Math.PI * 2,
        L = new Vector3()
          .copy(o)
          .addScaledVector(c, M * Math.cos(_))
          .addScaledVector(h, M * Math.sin(_))
          .normalize();
      this.cb.fireRay(l, L, n, a, f % n.tracerEvery === 0);
    }
    const m = n.pattern
        ? n.pattern[Math.min(t.burst, n.pattern.length - 1)]
        : 0,
      g = n.recoilPitch * tl * pn(0.85, 1.15) * (1 - r * n.adsRecoilReduce),
      v = n.recoilYaw * tl * (m + pn(-0.6, 0.6)) * (1 - r * 0.3);
    (e.addRecoil(g, v, n.recoilPermanent), e.addTrauma(n.trauma));
    const p = 1 - r * 0.4;
    ((this.kickPos.z += n.kickBack * p),
      (this.kickPos.y += n.kickUp * p),
      (this.kickRot.x += n.kickPitch * p * pn(0.8, 1.2)),
      (this.kickRot.y += pn(-1, 1) * n.kickYaw),
      (this.kickRot.z += pn(-1, 1) * n.kickRoll * p),
      this.flash.fire(n.flash),
      this.cb.muzzleSmoke(a, o, n.smoke),
      this.audio.gunshot(n.sound),
      n.key === "ar"
        ? ((t.boltT = 1), this.ejectShell(t))
        : n.key === "shotgun"
          ? ((t.pumping = !0),
            (t.pumpT = 0),
            (t.pumpSounded = !1),
            (t.pumpShell = !1))
          : n.key === "dmr" && (t.boltDelayT = n.boltDelay),
      (e.sprintBlock = Math.max(e.sprintBlock, 0.25)),
      this.cb.onAmmoChange());
  }
  getSpreadForShot(t) {
    const e = this.weapon,
      n = e.def,
      s = this.adsSmooth,
      r =
        Math.min(t.speed / 7, 1.2) * n.spreadMove * (1 - s * 0.7) +
        (t.onGround ? 0 : 0.02 * (1 - s * 0.5));
    return (
      MathUtils.lerp(n.spreadHip, n.spreadAds, s) + e.bloom * (1 - s * 0.5) + r
    );
  }
  ejectShell(t) {
    const e = t.model.parts,
      n = this.player;
    if (!n) return;
    e.eject.getWorldPosition(this._v);
    const s = this._up.copy(n.right).cross(n.forward),
      r = this._v2
        .copy(n.right)
        .multiplyScalar(pn(1.6, 2.6))
        .addScaledVector(s, pn(1.3, 2.2))
        .addScaledVector(n.forward, pn(-0.4, 0.2))
        .add(n.vel);
    this.cb.ejectShell(this._v, r, t.def.shell);
  }
  startSwitch(t) {
    const e = this.weapon;
    (e.reloading && ((e.reload = null), e.reset(), this.cb.onAmmoChange()),
      (e.pumping = !1),
      (this.switching = { to: t, t: 0, phase: "down" }));
  }
  updateSwitch(t) {
    const e = this.switching;
    e.t += t;
    const n = this.weapon;
    if (e.phase === "down") {
      const s = n.def.switchTime * 0.4,
        r = Mi(e.t / s);
      (this.animPos.set(0.04 * r, -0.28 * r, 0.02 * r),
        this.animRot.set(-0.7 * r, 0.15 * r, 0.25 * r),
        e.t >= s &&
          ((this.lastWeapon = this.current),
          this.selectImmediate(e.to),
          this.audio.weaponSwitch(),
          (e.phase = "up"),
          (e.t = 0)));
    } else {
      const s = this.weapon.def.switchTime * 0.6,
        r = 1 - Mi(e.t / s);
      (this.animPos.set(0.04 * r, -0.28 * r, 0.02 * r),
        this.animRot.set(-0.7 * r, 0.15 * r, 0.25 * r),
        e.t >= s &&
          ((this.switching = null),
          this.animPos.set(0, 0, 0),
          this.animRot.set(0, 0, 0)));
    }
  }
  startReload(t) {
    t.def.key === "shotgun"
      ? ((t.reload = {
          t: 0,
          phase: "intro",
          shellT: 0,
          cancel: !1,
          wasEmpty: t.mag === 0,
          loaded: !1,
        }),
        this.audio.click(0.5, 1200))
      : ((t.reload = { t: 0, dur: t.def.reloadTime, s1: !1, s2: !1, s3: !1 }),
        this.audio.click(0.6, 1500));
  }
  updateReload(t, e, n) {
    const s = t.reload,
      r = t.def,
      a = t.model.parts;
    if (r.key === "shotgun") {
      s.t += e;
      let u = 1;
      if (s.phase === "intro")
        ((u = Mi(s.t / r.reloadIntro)),
          s.t >= r.reloadIntro && ((s.phase = "shells"), (s.shellT = 0)));
      else if (s.phase === "shells") {
        (n.mousePressed[0] && t.mag > 0 && (s.cancel = !0), (s.shellT += e));
        const m = s.shellT / r.reloadTime,
          g = Math.sin(Math.min(1, m) * Math.PI);
        (a.handL.position.copy(a.handLRest).lerp(F0, g),
          !s.loaded &&
            m >= 0.5 &&
            ((s.loaded = !0),
            t.mag++,
            t.reserve--,
            this.audio.shellIn(),
            this.cb.onAmmoChange()),
          m >= 1 &&
            ((s.shellT = 0),
            (s.loaded = !1),
            (t.mag >= r.magSize || t.reserve <= 0 || s.cancel) &&
              ((s.phase = "outro"),
              (s.t = 0),
              s.wasEmpty &&
                ((t.pumping = !0),
                (t.pumpT = 0),
                (t.pumpSounded = !1),
                (t.pumpShell = !0)))));
      } else if (
        ((u = 1 - Mi(s.t / r.reloadOutro)),
        a.handL.position.copy(a.handLRest),
        s.t >= r.reloadOutro)
      ) {
        ((t.reload = null),
          this.animPos.set(0, 0, 0),
          this.animRot.set(0, 0, 0));
        return;
      }
      (this.animPos.set(0.03 * u, -0.03 * u, 0.01 * u),
        this.animRot.set(0.12 * u, -0.2 * u, 0.55 * u));
      return;
    }
    s.t += e;
    const l = s.t / s.dur,
      o = Math.sin(Math.min(1, l) * Math.PI);
    (this.animPos.set(-0.015 * o, -0.05 * o, 0.015 * o),
      this.animRot.set(-0.28 * o, 0.2 * o, -0.5 * o));
    let c = 0,
      h = !0,
      d = 0;
    if (l >= 0.15 && l < 0.42) {
      const u = Mi((l - 0.15) / 0.27);
      ((c = -0.3 * u), (d = -0.5 * u));
    } else if (l >= 0.42 && l < 0.5) ((h = !1), (c = -0.3));
    else if (l >= 0.5 && l < 0.76) {
      const u = 1 - Mi((l - 0.5) / 0.26);
      ((c = -0.3 * u), (d = -0.25 * u));
    }
    if (
      (a.mag.position.set(a.magRest.x, a.magRest.y + c, a.magRest.z + c * 0.35),
      (a.mag.rotation.x = d),
      (a.mag.visible = h),
      a.handL && a.handLRest)
    ) {
      const u = l > 0.08 && l < 0.82,
        m = u ? a.mag.position.x - 0.01 : a.handLRest.x,
        g = u ? a.mag.position.y - 0.09 : a.handLRest.y,
        v = u ? a.mag.position.z + 0.03 : a.handLRest.z,
        p = 1 - Math.exp(-22 * e);
      ((a.handL.position.x += (m - a.handL.position.x) * p),
        (a.handL.position.y += (g - a.handL.position.y) * p),
        (a.handL.position.z += (v - a.handL.position.z) * p));
    }
    if (
      (l > 0.8 && l < 0.9 && (t.boltT = 1),
      !s.s1 && l > 0.16 && ((s.s1 = !0), this.audio.magOut()),
      !s.s2 && l > 0.6 && ((s.s2 = !0), this.audio.magIn()),
      !s.s3 && l > 0.82 && ((s.s3 = !0), this.audio.bolt()),
      l >= 1)
    ) {
      const u = Math.min(r.magSize - t.mag, t.reserve);
      ((t.mag += u),
        (t.reserve -= u),
        (t.reload = null),
        this.animPos.set(0, 0, 0),
        this.animRot.set(0, 0, 0),
        a.mag.position.copy(a.magRest),
        a.mag.rotation.set(0, 0, 0),
        (a.mag.visible = !0),
        this.cb.onAmmoChange());
    }
  }
  updatePose(t, e, n, s) {
    const r = this.weapon,
      a = r.def,
      l = r.model.parts,
      o = this.adsSmooth,
      c = el(this.sprintBlend),
      h = a.weight,
      d = 1 - o * 0.88,
      u = MathUtils.lerp(0.012, 0.022, h) * d,
      m = MathUtils.lerp(0.0028, 0.0055, h) * d;
    ((this.swayRotV.y += -e.dx * u),
      (this.swayRotV.x += -e.dy * u),
      (this.swayRotV.z += e.dx * u * 0.35),
      (this.swayPosV.x += -e.dx * m),
      (this.swayPosV.y += e.dy * m * 0.6));
    const g = MathUtils.lerp(180, 90, h),
      v = 2 * Math.sqrt(g) * MathUtils.lerp(0.8, 0.55, h),
      p = MathUtils.lerp(230, 120, h),
      f = 2 * Math.sqrt(p) * 0.7;
    (this._spring(this.swayRot, this.swayRotV, g, v, t, 0.16),
      this._spring(this.swayPos, this.swayPosV, p, f, t, 0.07),
      this._spring(
        this.kickRot,
        this.kickRotV,
        330,
        2 * Math.sqrt(330) * 0.55,
        t,
        0.5,
      ),
      this._spring(
        this.kickPos,
        this.kickPosV,
        330,
        2 * Math.sqrt(330) * 0.6,
        t,
        0.25,
      ));
    const w = n.localVel,
      M = 1 - o * 0.8;
    ((this.moveOff.x = Wn(this.moveOff.x, -w.x * 0.0055 * M, 7, t)),
      (this.moveOff.y = Wn(
        this.moveOff.y,
        MathUtils.clamp(-w.y * 0.004, -0.03, 0.03) * M,
        7,
        t,
      )),
      (this.moveOff.z = Wn(this.moveOff.z, w.z * 0.004 * M, 7, t)),
      (this.moveRot.z = Wn(this.moveRot.z, -w.x * 0.012 * M, 7, t)),
      (this.moveRot.x = Wn(
        this.moveRot.x,
        MathUtils.clamp(w.y * 0.012, -0.08, 0.08) * M,
        7,
        t,
      )),
      (this.moveRot.y = Wn(this.moveRot.y, -w.x * 0.006 * M, 7, t)));
    const _ = n.bobPhase,
      L = n.bobAmt * (n.sprinting ? 2.4 : 1) * (1 - o * 0.9),
      R = Math.sin(_) * 0.011 * L,
      A = Math.sin(_ * 2) * 0.007 * L - 0.002 * L,
      C = Math.sin(_) * 0.02 * L,
      S = Math.cos(_ * 2) * 0.008 * L,
      y = a.key === "dmr" ? 0.0012 : 4e-4,
      P =
        Math.sin(s * 0.9) * 0.0012 * (1 - o * 0.6) + o * Math.sin(s * 1.3) * y,
      z = Math.sin(s * 1.5) * 9e-4 * (1 - o * 0.6) + o * Math.cos(s * 0.9) * y,
      U = this._v.copy(l.hipOffset).lerp(l.adsOffset, o),
      H = l.hipRot,
      k =
        U.x +
        Tr.x * c +
        this.swayPos.x +
        this.moveOff.x +
        R +
        P +
        this.kickPos.x +
        this.animPos.x,
      G =
        U.y +
        Tr.y * c +
        this.swayPos.y +
        this.moveOff.y +
        A +
        z +
        this.kickPos.y +
        this.animPos.y,
      q =
        U.z +
        Tr.z * c +
        this.swayPos.z +
        this.moveOff.z +
        this.kickPos.z +
        this.animPos.z,
      O =
        H.x * (1 - o) +
        br.x * c +
        this.swayRot.x +
        this.moveRot.x +
        S +
        this.kickRot.x +
        this.animRot.x,
      et =
        H.y * (1 - o) +
        br.y * c +
        this.swayRot.y +
        this.moveRot.y +
        this.kickRot.y +
        this.animRot.y,
      K =
        H.z * (1 - o) +
        br.z * c +
        this.swayRot.z +
        this.moveRot.z +
        C +
        this.kickRot.z +
        this.animRot.z;
    if (
      (this.rig.position.set(k, G, q),
      this.rig.rotation.set(O, et, K),
      l.bolt && (l.bolt.position.z = l.boltRest + r.boltT * l.boltTravel),
      l.pump)
    )
      if (r.pumping) {
        const nt = Math.min(1, r.pumpT / a.pumpTime);
        l.pump.position.z = l.pumpRest + Math.sin(nt * Math.PI) * l.pumpTravel;
      } else l.pump.position.z = l.pumpRest;
    l.lens && (this.redDotMat.uniforms.uBright.value = 0.7 + o * 0.5);
  }
  _spring(t, e, n, s, r, a) {
    ((e.x += (-n * t.x - s * e.x) * r),
      (e.y += (-n * t.y - s * e.y) * r),
      (e.z += (-n * t.z - s * e.z) * r),
      (t.x = MathUtils.clamp(t.x + e.x * r, -a, a)),
      (t.y = MathUtils.clamp(t.y + e.y * r, -a, a)),
      (t.z = MathUtils.clamp(t.z + e.z * r, -a, a)));
  }
}
const Ar = {
    runner: {
      key: "runner",
      name: "HUSK",
      hp: 72,
      speed: 6.6,
      scale: 1,
      damage: 12,
      range: 1.9,
      cooldown: 1.05,
      windup: 0.3,
      swing: 0.5,
      score: 100,
      radius: 0.36,
      mass: 1,
      glow: [1, 0.36, 0.08],
      bodyColor: 1709079,
      ranged: !1,
      big: !1,
      slam: !1,
      proportions: {
        torso: [0.42, 0.5, 0.26],
        hips: [0.34, 0.2, 0.24],
        head: 0.24,
        armW: 0.11,
        armUL: 0.32,
        armLL: 0.34,
        legW: 0.14,
        legUL: 0.42,
        legLL: 0.44,
        shoulder: 0.27,
        lean: 0.38,
        armsForward: !0,
      },
    },
    brute: {
      key: "brute",
      name: "BEHEMOTH",
      hp: 640,
      speed: 3.7,
      scale: 1.72,
      damage: 34,
      range: 2.8,
      cooldown: 2.2,
      windup: 0.7,
      swing: 0.9,
      score: 400,
      radius: 0.64,
      mass: 6,
      glow: [1, 0.16, 0.04],
      bodyColor: 1511695,
      ranged: !1,
      big: !0,
      slam: !0,
      proportions: {
        torso: [0.62, 0.56, 0.38],
        hips: [0.44, 0.22, 0.3],
        head: 0.24,
        armW: 0.19,
        armUL: 0.4,
        armLL: 0.44,
        legW: 0.21,
        legUL: 0.4,
        legLL: 0.42,
        shoulder: 0.38,
        lean: 0.22,
        armsForward: !1,
        spikes: !0,
      },
    },
    spitter: {
      key: "spitter",
      name: "SPITTER",
      hp: 120,
      speed: 4.4,
      scale: 1.1,
      damage: 14,
      range: 0,
      cooldown: 2.4,
      windup: 0.5,
      swing: 0.4,
      score: 200,
      radius: 0.38,
      mass: 1.5,
      glow: [0.3, 1, 0.35],
      bodyColor: 1251861,
      ranged: !0,
      big: !1,
      slam: !1,
      standoff: 14,
      projSpeed: 26,
      proportions: {
        torso: [0.4, 0.46, 0.3],
        hips: [0.34, 0.2, 0.26],
        head: 0.26,
        armW: 0.1,
        armUL: 0.3,
        armLL: 0.3,
        legW: 0.13,
        legUL: 0.4,
        legLL: 0.42,
        shoulder: 0.26,
        lean: 0.48,
        armsForward: !1,
        sac: !0,
      },
    },
  },
  nn = (i, t) => i + Math.random() * (t - i),
  Rs = MathUtils.damp,
  B0 = new Matrix4().makeScale(0, 0, 0),
  Cs = 128;
function Ps(i, t, e) {
  let n = t - i;
  for (; n > Math.PI;) n -= Math.PI * 2;
  for (; n < -Math.PI;) n += Math.PI * 2;
  return i + n * e;
}
function k0(i) {
  const t = (M, _, L, R) => {
      const A = new Object3D();
      return (A.position.set(_, L, R), M.add(A), A);
    },
    e = new Object3D(),
    n = i.legUL + i.legLL + 0.06,
    s = t(e, 0, n, 0),
    r = t(s, 0, i.hips[1] * 0.45, 0),
    a = t(r, 0, i.torso[1] + 0.02, 0),
    l = t(r, -i.shoulder, i.torso[1] - 0.06, 0),
    o = t(r, i.shoulder, i.torso[1] - 0.06, 0),
    c = t(l, 0, -i.armUL, 0),
    h = t(o, 0, -i.armUL, 0),
    d = t(s, -i.hips[0] * 0.3, -i.hips[1] * 0.3, 0),
    u = t(s, i.hips[0] * 0.3, -i.hips[1] * 0.3, 0),
    m = t(d, 0, -i.legUL, 0),
    g = t(u, 0, -i.legUL, 0),
    v = [],
    p = (M, _, L) => v.push({ node: M, geom: _, kind: L }),
    f = (M, _, L, R, A, C, S = 0.02) => {
      const y = new RoundedBoxGeometry(M, _, L, 2, S);
      return (y.translate(R, A, C), y);
    };
  if (
    (p(s, f(i.hips[0], i.hips[1], i.hips[2], 0, 0, 0), "body"),
    p(
      r,
      f(i.torso[0], i.torso[1], i.torso[2], 0, i.torso[1] / 2, 0, 0.04),
      "body",
    ),
    p(
      r,
      f(
        i.torso[0] * 0.34,
        i.torso[1] * 0.36,
        0.05,
        0,
        i.torso[1] * 0.56,
        -i.torso[2] / 2 - 0.005,
        0.012,
      ),
      "glow",
    ),
    p(
      r,
      f(
        i.torso[0] * 0.7,
        0.03,
        0.03,
        0,
        i.torso[1] * 0.2,
        -i.torso[2] / 2 - 0.005,
        0.008,
      ),
      "glow",
    ),
    p(
      l,
      f(
        i.armW * 1.6,
        i.armW * 1.1,
        i.armW * 1.6,
        -i.armW * 0.25,
        0.04,
        0,
        0.02,
      ),
      "body",
    ),
    p(
      o,
      f(i.armW * 1.6, i.armW * 1.1, i.armW * 1.6, i.armW * 0.25, 0.04, 0, 0.02),
      "body",
    ),
    p(a, f(i.head, i.head * 1.05, i.head, 0, i.head * 0.55, 0, 0.045), "head"),
    p(
      a,
      f(
        i.head * 0.76,
        i.head * 0.16,
        0.03,
        0,
        i.head * 0.66,
        -i.head / 2 - 0.008,
        0.006,
      ),
      "headGlow",
    ),
    p(l, f(i.armW, i.armUL, i.armW, 0, -i.armUL / 2, 0), "body"),
    p(o, f(i.armW, i.armUL, i.armW, 0, -i.armUL / 2, 0), "body"),
    p(c, f(i.armW * 0.9, i.armLL, i.armW * 0.9, 0, -i.armLL / 2, 0), "body"),
    p(h, f(i.armW * 0.9, i.armLL, i.armW * 0.9, 0, -i.armLL / 2, 0), "body"),
    p(
      c,
      f(i.armW * 0.55, 0.12, i.armW * 0.55, 0, -i.armLL - 0.04, 0, 0.01),
      "glow",
    ),
    p(
      h,
      f(i.armW * 0.55, 0.12, i.armW * 0.55, 0, -i.armLL - 0.04, 0, 0.01),
      "glow",
    ),
    p(d, f(i.legW, i.legUL, i.legW, 0, -i.legUL / 2, 0), "body"),
    p(u, f(i.legW, i.legUL, i.legW, 0, -i.legUL / 2, 0), "body"),
    p(m, f(i.legW * 0.85, i.legLL, i.legW * 0.85, 0, -i.legLL / 2, 0), "body"),
    p(g, f(i.legW * 0.85, i.legLL, i.legW * 0.85, 0, -i.legLL / 2, 0), "body"),
    p(
      m,
      f(i.legW, 0.08, i.legW * 1.7, 0, -i.legLL - 0.01, -i.legW * 0.35, 0.015),
      "body",
    ),
    p(
      g,
      f(i.legW, 0.08, i.legW * 1.7, 0, -i.legLL - 0.01, -i.legW * 0.35, 0.015),
      "body",
    ),
    i.spikes)
  ) {
    const M = [];
    for (let R = 0; R < 5; R++) {
      const A = new ConeGeometry(0.06, 0.3, 6);
      (A.rotateX(-0.9 + (R - 2) * 0.15),
        A.rotateZ((R - 2) * 0.3),
        A.translate(
          (R - 2) * 0.12,
          i.torso[1] * 0.85 + Math.abs(R - 2) * -0.04,
          i.torso[2] / 2 + 0.08,
        ),
        M.push(A));
    }
    p(r, mergeGeometries(M, !1), "body");
    const _ = new ConeGeometry(0.05, 0.22, 6);
    (_.rotateZ(0.9), _.translate(-i.armW * 0.9, 0.08, 0), p(l, _, "body"));
    const L = new ConeGeometry(0.05, 0.22, 6);
    (L.rotateZ(-0.9), L.translate(i.armW * 0.9, 0.08, 0), p(o, L, "body"));
  }
  if (i.sac) {
    const M = new SphereGeometry(0.2, 12, 10);
    (M.scale(1, 1.3, 0.9),
      M.translate(0, i.torso[1] * 0.55, i.torso[2] / 2 + 0.12),
      p(r, M, "glow"));
  }
  const w = n + i.hips[1] * 0.45 + i.torso[1] + 0.02 + i.head * 0.55;
  return {
    root: e,
    n: {
      hips: s,
      torso: r,
      neck: a,
      shL: l,
      shR: o,
      elL: c,
      elR: h,
      legL: d,
      legR: u,
      knL: m,
      knR: g,
    },
    parts: v,
    hipH: n,
    headY: w,
    torsoTop: n + i.hips[1] * 0.45 + i.torso[1],
    torsoBot: n - i.hips[1] * 0.5,
  };
}
function Rr(i, t, e, n = !1) {
  return (
    (i.onBeforeCompile = (s) => {
      ((s.uniforms.uTime = t),
        (s.vertexShader = s.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
attribute float aFlash; attribute float aDissolve; varying float vFlash; varying float vDissolve; varying vec3 vWPos;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
        vFlash = aFlash; vDissolve = aDissolve;
        #ifdef USE_INSTANCING
          vWPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
        #else
          vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #endif`,
          )),
        (s.fragmentShader = s.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
varying float vFlash; varying float vDissolve; varying vec3 vWPos; uniform float uTime;
${Nn}`,
          )
          .replace(
            "#include <clipping_planes_fragment>",
            `#include <clipping_planes_fragment>
        float dn = noise3(vWPos * 5.0 + vec3(0.0, uTime * 0.2, 0.0)) * 0.7 + noise3(vWPos * 17.0) * 0.3;
        float dEdge = vDissolve * 1.2 - 0.1;
        if (dn < dEdge) discard;
        float dBurn = smoothstep(dEdge + 0.14, dEdge, dn) * step(0.001, vDissolve);`,
          )),
        n ||
          (s.fragmentShader = s.fragmentShader.replace(
            "#include <emissivemap_fragment>",
            `#include <emissivemap_fragment>
        ${e ? "totalEmissiveRadiance *= 0.75 + 0.35 * sin(uTime * 6.0 + vWPos.x * 3.0 + vWPos.z * 2.0);" : ""}
        totalEmissiveRadiance += vec3(1.0, 0.45, 0.12) * dBurn * 7.0;
        totalEmissiveRadiance += vec3(1.0, 0.95, 0.9) * vFlash * 3.0;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), vFlash * 0.85);`,
          )));
    }),
    (i.customProgramCacheKey = () =>
      "enemy_" + (n ? "depth" : e ? "glow" : "body")),
    i
  );
}
const Ei = new Vector3(),
  H0 = new Vector3(),
  V0 = new Vector3();
function Hs(i, t, e, n) {
  Ei.subVectors(i, e);
  const s = Ei.dot(t),
    r = Ei.dot(Ei) - n * n;
  if (r > 0 && s > 0) return -1;
  const a = s * s - r;
  if (a < 0) return -1;
  const l = -s - Math.sqrt(a);
  return l < 0 ? 0 : l;
}
function nl(i, t, e, n, s) {
  let r = -1;
  const a = Hs(i, t, e, s);
  a >= 0 && (r = a);
  const l = Hs(i, t, n, s);
  l >= 0 && (r < 0 || l < r) && (r = l);
  const o = H0.subVectors(n, e),
    c = o.length();
  if (c < 1e-5) return r;
  o.multiplyScalar(1 / c);
  const h = V0.subVectors(i, e),
    d = t.dot(o),
    u = h.dot(o),
    m = t.x - o.x * d,
    g = t.y - o.y * d,
    v = t.z - o.z * d,
    p = h.x - o.x * u,
    f = h.y - o.y * u,
    w = h.z - o.z * u,
    M = m * m + g * g + v * v;
  if (M < 1e-8) return r;
  const _ = 2 * (m * p + g * f + v * w),
    L = p * p + f * f + w * w - s * s,
    R = _ * _ - 4 * M * L;
  if (R < 0) return r;
  const A = (-_ - Math.sqrt(R)) / (2 * M);
  if (A < 0) return r;
  const C = u + A * d;
  return (C < 0 || C > c || ((r < 0 || A < r) && (r = A)), r);
}
class G0 {
  constructor(t, e, n, s, r) {
    ((this.scene = t),
      (this.arena = e),
      (this.particles = n),
      (this.audio = s),
      (this.cb = r),
      (this.uTime = { value: 0 }),
      (this.list = []),
      (this.types = {}),
      (this.nextId = 1));
    for (const a in Ar) this._buildType(Ar[a]);
    (this._buildProjectiles(),
      (this._v = new Vector3()),
      (this._v2 = new Vector3()),
      (this._v3 = new Vector3()),
      (this._headC = new Vector3()),
      (this._a = new Vector3()),
      (this._b = new Vector3()));
  }
  _buildType(t) {
    const e = k0(t.proportions),
      n = new Float32Array(Cs),
      s = new Float32Array(Cs),
      r = Rr(
        new MeshStandardMaterial({
          color: t.bodyColor,
          roughness: 0.55,
          metalness: 0.55,
        }),
        this.uTime,
        !1,
      ),
      a = Rr(
        new MeshStandardMaterial({
          color: 0,
          emissive: new Color(t.glow[0], t.glow[1], t.glow[2]),
          emissiveIntensity: 2.2,
          roughness: 0.6,
          metalness: 0,
        }),
        this.uTime,
        !0,
      ),
      l = [];
    for (const o of e.parts) {
      const c = o.kind === "glow" || o.kind === "headGlow",
        h = new InstancedBufferAttribute(n, 1),
        d = new InstancedBufferAttribute(s, 1);
      (h.setUsage(DynamicDrawUsage),
        d.setUsage(DynamicDrawUsage),
        o.geom.setAttribute("aFlash", h),
        o.geom.setAttribute("aDissolve", d));
      const u = new InstancedMesh(o.geom, c ? a : r, Cs);
      (u.instanceMatrix.setUsage(DynamicDrawUsage),
        (u.frustumCulled = !1),
        (u.castShadow = !c),
        (u.receiveShadow = !c),
        (u.count = 0),
        (u.customDepthMaterial = Rr(
          new MeshDepthMaterial({ depthPacking: RGBADepthPacking }),
          this.uTime,
          !1,
          !0,
        )),
        this.scene.add(u),
        l.push({ mesh: u, part: o, fa: h, da: d }));
    }
    this.types[t.key] = { def: t, rig: e, meshes: l, flash: n, dissolve: s };
  }
  _buildProjectiles() {
    const t = new SphereGeometry(0.17, 12, 10),
      e = new MeshStandardMaterial({
        color: 1127185,
        emissive: 5635942,
        emissiveIntensity: 4.5,
        roughness: 0.4,
      });
    ((this.projMesh = new InstancedMesh(t, e, 64)),
      this.projMesh.instanceMatrix.setUsage(DynamicDrawUsage),
      (this.projMesh.frustumCulled = !1),
      (this.projMesh.count = 0),
      this.scene.add(this.projMesh),
      (this.projectiles = []));
    for (let n = 0; n < 64; n++)
      this.projectiles.push({
        active: !1,
        pos: new Vector3(),
        vel: new Vector3(),
        life: 0,
        dmg: 10,
        owner: null,
      });
    this._pm = new Matrix4();
  }
  get alive() {
    let t = 0;
    for (const e of this.list) e.state !== "die" && t++;
    return t;
  }
  clear() {
    this.list.length = 0;
    for (const t of this.projectiles) t.active = !1;
  }
  spawn(t, e, n = 1) {
    const s = Ar[t];
    this.types[t];
    const r = -e.dir.z,
      a = e.dir.x,
      l = nn(-2.4, 2.4),
      o = s.scale * nn(0.92, 1.08),
      c = {
        id: this.nextId++,
        type: t,
        def: s,
        scale: o,
        radius: s.radius * (o / s.scale),
        pos: new Vector3(
          e.pos.x + r * l + e.dir.x * nn(0, 1.5),
          0,
          e.pos.z + a * l + e.dir.z * nn(0, 1.5),
        ),
        vel: new Vector3(),
        kb: new Vector3(),
        push: new Vector3(),
        yaw: Math.atan2(-e.dir.x, -e.dir.z),
        hp: s.hp * n,
        maxHp: s.hp * n,
        state: "spawn",
        t: 0,
        phase: Math.random() * 6,
        moveBlend: 0,
        flash: 0,
        dissolve: 1,
        squash: 0,
        headless: !1,
        toppleX: 0,
        toppleZ: 0,
        toppleTX: 0,
        toppleTZ: 0,
        sink: 0,
        attackDone: !1,
        cooldown: nn(0.4, 1.2),
        steerBias: Math.random() > 0.5 ? 1 : -1,
        blockedT: 0,
        growlT: nn(0.5, 3),
        lunge: 0,
        attackLean: 0,
        headBob: 0,
      };
    return (
      (c.pos.y = this.arena.groundHeight(c.pos.x, c.pos.z)),
      this.list.push(c),
      this.particles.spawnFx(c.pos, s.glow),
      this.audio.enemyGrowl([c.pos.x, c.pos.y, c.pos.z], s.big),
      c
    );
  }
  raycast(t, e, n) {
    let s = null;
    for (const r of this.list) {
      if (r.state === "die") continue;
      const a = this.types[r.type].rig,
        l = r.def.proportions,
        o = r.scale,
        c = -Math.sin(r.yaw),
        h = -Math.cos(r.yaw),
        d = r.pos.x,
        u = r.pos.z;
      Ei.set(d, r.pos.y + a.hipH * o, u);
      const m = Hs(t, e, Ei, a.headY * o * 0.75);
      if (m < 0 || m > n) continue;
      const g = 0.2 * o * r.moveBlend;
      this._headC.set(
        d + c * g,
        r.pos.y + a.headY * o - 0.04 * o * r.moveBlend + r.headBob,
        u + h * g,
      );
      const v = Hs(t, e, this._headC, l.head * 0.64 * o);
      (this._a.set(d, r.pos.y + a.torsoBot * o, u),
        this._b.set(
          d + c * g * 0.7,
          r.pos.y + a.torsoTop * o,
          u + h * g * 0.7,
        ));
      const p = nl(
        t,
        e,
        this._a,
        this._b,
        Math.max(l.torso[0], l.torso[2]) * 0.52 * o,
      );
      (this._a.set(d, r.pos.y + 0.08, u),
        this._b.set(d, r.pos.y + a.torsoBot * o, u));
      const f = nl(t, e, this._a, this._b, l.hips[0] * 0.5 * o);
      let w = -1,
        M = !1;
      (v >= 0 && ((w = v), (M = !0)),
        p >= 0 && (w < 0 || p < w - 0.02) && ((w = p), (M = !1)),
        f >= 0 && (w < 0 || f < w) && ((w = f), (M = !1)),
        !(w < 0 || w > n) &&
          (!s || w < s.t) &&
          (s = {
            enemy: r,
            t: w,
            head: M,
            point: new Vector3(t.x + e.x * w, t.y + e.y * w, t.z + e.z * w),
          }));
    }
    return s;
  }
  damage(t, e, n, s) {
    const r = t.enemy;
    if (r.state === "die") return { killed: !1 };
    ((r.hp -= e), (r.flash = 1), (r.squash = Math.min(0.22, r.squash + 0.1)));
    const a = s.kbForce / r.def.mass;
    return (
      (r.kb.x += n.x * a),
      (r.kb.z += n.z * a),
      r.state === "spawn" && ((r.state = "chase"), (r.dissolve = 0)),
      this.particles.fleshBurst(t.point, n, t.head, r.def.glow),
      this.audio.impactFlesh([t.point.x, t.point.y, t.point.z]),
      r.hp <= 0 ? (this.kill(r, n, t.head, s), { killed: !0 }) : { killed: !1 }
    );
  }
  kill(t, e, n, s) {
    ((t.state = "die"),
      (t.t = 0),
      (t.headless = n),
      (t.dissolve = 0),
      (t.attackLean = 0));
    const r = -Math.sin(t.yaw),
      a = -Math.cos(t.yaw),
      l = e.x * r + e.z * a;
    ((t.toppleTX = (l < 0 ? 1 : -1) * (Math.PI / 2) * nn(0.85, 1)),
      (t.toppleTZ = nn(-0.5, 0.5)));
    const o = ((s ? s.kbForce : 2) * 1.6) / t.def.mass;
    ((t.kb.x += e.x * o),
      (t.kb.z += e.z * o),
      this.particles.deathBurst(t.pos, t.def.glow, t.scale, n),
      this.audio.enemyDeath([t.pos.x, t.pos.y, t.pos.z], t.def.big),
      this.cb.onKill(t, n));
  }
  _fireProjectile(t, e) {
    const n = this.types[t.type].rig,
      s = this.projectiles.find((h) => !h.active);
    if (!s) return;
    const r = -Math.sin(t.yaw),
      a = -Math.cos(t.yaw);
    ((s.active = !0),
      (s.life = 3.5),
      (s.dmg = t.def.damage),
      (s.owner = t),
      s.pos.set(
        t.pos.x + r * 0.4,
        t.pos.y + n.headY * t.scale - 0.1,
        t.pos.z + a * 0.4,
      ));
    const l = this._v.set(e.pos.x, e.pos.y + 1.1, e.pos.z),
      c = l.distanceTo(s.pos) / t.def.projSpeed;
    (l.addScaledVector(e.vel, c * 0.7),
      s.vel.subVectors(l, s.pos).normalize().multiplyScalar(t.def.projSpeed),
      (s.vel.y += 5 * c * 0.5),
      this.audio.spit([s.pos.x, s.pos.y, s.pos.z]),
      this.particles.splash(s.pos, [0.4, 1, 0.4]));
  }
  _updateProjectiles(t, e) {
    let n = 0;
    for (const s of this.projectiles) {
      if (!s.active) continue;
      ((s.life -= t),
        (s.vel.y -= 5 * t),
        s.pos.addScaledVector(s.vel, t),
        this.particles.trail(s.pos, [0.35, 1, 0.4], 0.16));
      let r = !1;
      const a = MathUtils.clamp(s.pos.y, e.pos.y + 0.3, e.pos.y + 1.65),
        l = s.pos.x - e.pos.x,
        o = s.pos.y - a,
        c = s.pos.z - e.pos.z;
      if (
        (l * l + o * o + c * c < 0.42 &&
          !e.dead &&
          (this.cb.playerHit(s.dmg, s.owner ? s.owner.pos : s.pos, null),
          (r = !0)),
        !r)
      )
        if (
          s.pos.y < this.arena.groundHeight(s.pos.x, s.pos.z) + 0.15 ||
          Math.hypot(s.pos.x, s.pos.z) > be - 0.4 ||
          s.life <= 0
        )
          r = !0;
        else
          for (const h of this.arena.boxes) {
            if (s.pos.y < h.y0 || s.pos.y > h.y1) continue;
            const [d, u] = h.toLocal(s.pos.x, s.pos.z);
            if (Math.abs(d) < h.hx + 0.15 && Math.abs(u) < h.hz + 0.15) {
              r = !0;
              break;
            }
          }
      if (r) {
        ((s.active = !1),
          this.particles.splash(s.pos, [0.4, 1, 0.4]),
          this.audio.splash([s.pos.x, s.pos.y, s.pos.z]));
        continue;
      }
      (this._pm.makeTranslation(s.pos.x, s.pos.y, s.pos.z),
        this.projMesh.setMatrixAt(n++, this._pm));
    }
    ((this.projMesh.count = n),
      (this.projMesh.instanceMatrix.needsUpdate = !0));
  }
  update(t, e, n) {
    this.uTime.value = n;
    const s = this.list,
      r = this.arena,
      a = e.pos;
    for (const l of s) l.push.set(0, 0, 0);
    for (let l = 0; l < s.length; l++) {
      const o = s[l];
      if (o.state !== "die")
        for (let c = l + 1; c < s.length; c++) {
          const h = s[c];
          if (h.state === "die") continue;
          const d = o.pos.x - h.pos.x,
            u = o.pos.z - h.pos.z,
            m = (o.radius + h.radius) * 1.15,
            g = d * d + u * u;
          if (g > m * m || g < 1e-6) continue;
          const v = Math.sqrt(g),
            p = (m - v) / m,
            f = d / v,
            w = u / v,
            M = o.def.mass,
            _ = h.def.mass;
          ((o.push.x += f * p * (_ / (M + _)) * 2),
            (o.push.z += w * p * (_ / (M + _)) * 2),
            (h.push.x -= f * p * (M / (M + _)) * 2),
            (h.push.z -= w * p * (M / (M + _)) * 2));
        }
    }
    for (let l = s.length - 1; l >= 0; l--) {
      const o = s[l],
        c = o.def;
      ((o.flash = Math.max(0, o.flash - t * 9)),
        (o.squash = Math.max(0, o.squash - t * 1.4)),
        o.kb.multiplyScalar(Math.exp(-6 * t)));
      const h = a.x - o.pos.x,
        d = a.z - o.pos.z,
        u = Math.hypot(h, d) || 0.001,
        m = Math.atan2(-h, -d);
      if (o.state === "spawn")
        ((o.t += t),
          (o.dissolve = Math.max(0, 1 - o.t / 0.7)),
          (o.yaw = Ps(o.yaw, m, 1 - Math.exp(-4 * t))),
          o.t >= 0.7 && ((o.state = "chase"), (o.dissolve = 0)));
      else if (o.state === "chase") {
        let v = h / u,
          p = d / u,
          f = c.speed;
        if (((o.cooldown -= t), c.ranged)) {
          if (!(u > c.standoff + 3))
            if (u < c.standoff - 4) ((v = -v), (p = -p), (f *= 0.75));
            else {
              const R = -p * o.steerBias,
                A = v * o.steerBias;
              ((v = R), (p = A), (f *= 0.55));
            }
          o.cooldown <= 0 &&
            u < 28 &&
            !e.dead &&
            ((o.state = "attack"), (o.t = 0), (o.attackDone = !1));
        } else
          u < c.range &&
            o.cooldown <= 0 &&
            !e.dead &&
            ((o.state = "attack"), (o.t = 0), (o.attackDone = !1));
        const w = o.pos.x + v * (o.radius + 1),
          M = o.pos.z + p * (o.radius + 1);
        if (this._blocked(w, M, o.radius)) {
          const R = -p * o.steerBias,
            A = v * o.steerBias;
          ((v = v * 0.25 + R), (p = p * 0.25 + A));
          const C = Math.hypot(v, p) || 1;
          ((v /= C),
            (p /= C),
            (o.blockedT += t),
            o.blockedT > 0.9 && ((o.steerBias *= -1), (o.blockedT = 0)));
        } else o.blockedT = Math.max(0, o.blockedT - t);
        const _ = v * f + o.push.x * 4,
          L = p * f + o.push.z * 4;
        ((o.vel.x = Rs(o.vel.x, _, 5, t)),
          (o.vel.z = Rs(o.vel.z, L, 5, t)),
          (o.yaw = Ps(
            o.yaw,
            Math.atan2(-o.vel.x, -o.vel.z),
            1 - Math.exp(-7 * t),
          )),
          (c.ranged || u < 6) && (o.yaw = Ps(o.yaw, m, 1 - Math.exp(-7 * t))),
          (o.growlT -= t),
          o.growlT < 0 &&
            ((o.growlT = nn(3, 9)),
            this.audio.enemyGrowl([o.pos.x, o.pos.y, o.pos.z], c.big)),
          (o.attackLean = Rs(o.attackLean, 0, 8, t)));
      } else if (o.state === "attack") {
        ((o.t += t), (o.yaw = Ps(o.yaw, m, 1 - Math.exp(-12 * t))));
        const v = Math.exp(-8 * t);
        if (((o.vel.x *= v), (o.vel.z *= v), c.ranged))
          ((o.attackLean = o.t < c.windup ? -0.35 * (o.t / c.windup) : 0.4),
            !o.attackDone &&
              o.t >= c.windup &&
              ((o.attackDone = !0), this._fireProjectile(o, e)),
            o.t >= c.windup + c.swing &&
              ((o.state = "chase"),
              (o.cooldown = c.cooldown * nn(0.8, 1.25)),
              (o.attackLean = 0)));
        else {
          if (
            (o.t < c.windup
              ? ((o.attackLean = -0.3 * (o.t / c.windup)),
                !c.big &&
                  o.t > c.windup - 0.12 &&
                  ((o.vel.x += (h / u) * 40 * t),
                  (o.vel.z += (d / u) * 40 * t)))
              : (o.attackLean = 0.55),
            !o.attackDone && o.t >= c.windup)
          ) {
            o.attackDone = !0;
            const p = u < c.range * 1.3 && Math.abs(e.pos.y - o.pos.y) < 1.8;
            (c.slam &&
              (this.particles.slamWave(o.pos, 4),
              this.audio.bruteSlam([o.pos.x, o.pos.y, o.pos.z]),
              this.cb.slam(o.pos, u)),
              p && !e.dead && this.cb.playerHit(c.damage, o.pos, o));
          }
          o.t >= c.windup + c.swing &&
            ((o.state = "chase"), (o.cooldown = c.cooldown));
        }
      } else if (o.state === "die") {
        o.t += t;
        const v = 1 - Math.pow(1 - Math.min(1, o.t / 0.5), 3);
        ((o.toppleX = o.toppleTX * v),
          (o.toppleZ = o.toppleTZ * v),
          (o.dissolve = MathUtils.clamp((o.t - 0.35) / 0.8, 0, 1)),
          o.t > 0.5 && (o.sink += t * 0.4));
        const p = Math.exp(-4 * t);
        if (((o.vel.x *= p), (o.vel.z *= p), o.t > 1.25)) {
          s.splice(l, 1);
          continue;
        }
      }
      if (o.state !== "die" || o.t < 0.5) {
        ((o.pos.x += (o.vel.x + o.kb.x) * t),
          (o.pos.z += (o.vel.z + o.kb.z) * t));
        const [v, p] = r.resolveCircle(o.pos.x, o.pos.z, o.radius, 0, 2, 0);
        ((o.pos.x = v), (o.pos.z = p));
      }
      o.pos.y = r.groundHeight(o.pos.x, o.pos.z) - o.sink;
      const g = Math.hypot(o.vel.x, o.vel.z);
      ((o.moveBlend = Rs(
        o.moveBlend,
        o.state === "chase" ? Math.min(1, g / (c.speed * 0.6)) : 0,
        8,
        t,
      )),
        (o.phase +=
          t * (c.big ? 6 : 10) * (0.3 + 0.9 * Math.min(1, g / c.speed))),
        (o.headBob =
          Math.abs(Math.sin(o.phase)) * 0.05 * o.scale * o.moveBlend));
    }
    (this._updateProjectiles(t, e), this._render());
  }
  _blocked(t, e, n) {
    if (Math.hypot(t, e) > be - n - 0.5) return !0;
    for (const s of this.arena.boxes) {
      if (s.y1 < 0.5) continue;
      const [r, a] = s.toLocal(t, e);
      if (Math.abs(r) < s.hx + n && Math.abs(a) < s.hz + n) return !0;
    }
    return !1;
  }
  _render() {
    for (const t in this.types) {
      const e = this.types[t],
        n = e.rig,
        s = n.n,
        r = e.def.proportions;
      let a = 0;
      for (const l of this.list) {
        if (l.type !== t || a >= Cs) continue;
        const o = l.scale,
          c = l.squash;
        (n.root.position.copy(l.pos),
          n.root.rotation.set(l.toppleX, l.yaw, l.toppleZ),
          n.root.scale.set(o * (1 + c * 0.6), o * (1 - c), o * (1 + c * 0.6)));
        const h = l.phase,
          d = l.moveBlend,
          u = Math.sin(h) * 0.95 * d,
          m = Math.sin(h + Math.PI) * 0.95 * d;
        ((s.legL.rotation.x = u),
          (s.legR.rotation.x = m),
          (s.knL.rotation.x = Math.max(0, -Math.sin(h - 0.9)) * 1.2 * d + 0.1),
          (s.knR.rotation.x =
            Math.max(0, -Math.sin(h + Math.PI - 0.9)) * 1.2 * d + 0.1),
          (s.hips.position.y =
            n.hipH + Math.abs(Math.sin(h)) * 0.06 * d - (1 - d) * 0.02),
          (s.hips.rotation.y = Math.sin(h) * 0.14 * d),
          (s.torso.rotation.x = r.lean * d + l.attackLean + 0.08),
          (s.torso.rotation.y = -Math.sin(h) * 0.16 * d),
          (s.neck.rotation.x = -r.lean * 0.75 * d - l.attackLean * 0.6));
        let g = 0,
          v = 0;
        if (l.state === "attack") {
          const p = l.def;
          ((g = Math.min(1, l.t / p.windup)),
            (v = l.t > p.windup ? Math.min(1, (l.t - p.windup) / 0.25) : 0));
        }
        (r.armsForward
          ? ((s.shL.rotation.x =
              -1.35 + Math.sin(h + Math.PI) * 0.35 * d - g * 1.2 + v * 1.8),
            (s.shR.rotation.x =
              -1.35 + Math.sin(h) * 0.35 * d - g * 1.2 + v * 1.8),
            (s.shL.rotation.z = 0.25 + g * 0.6 - v * 0.5),
            (s.shR.rotation.z = -0.25 - g * 0.6 + v * 0.5),
            (s.elL.rotation.x = -0.45 - g * 0.8 + v * 0.6),
            (s.elR.rotation.x = -0.45 - g * 0.8 + v * 0.6))
          : ((s.shL.rotation.x =
              Math.sin(h + Math.PI) * 0.7 * d - 0.2 - g * 2.3 + v * 2.6),
            (s.shR.rotation.x =
              Math.sin(h) * 0.7 * d - 0.2 - g * 2.3 + v * 2.6),
            (s.shL.rotation.z = 0.35 + g * 0.4 - v * 0.6),
            (s.shR.rotation.z = -0.35 - g * 0.4 + v * 0.6),
            (s.elL.rotation.x = -0.6 - g * 0.5),
            (s.elR.rotation.x = -0.6 - g * 0.5)),
          n.root.updateMatrixWorld(!0));
        for (const p of e.meshes) {
          const f =
            l.headless &&
            (p.part.kind === "head" || p.part.kind === "headGlow");
          p.mesh.setMatrixAt(a, f ? B0 : p.part.node.matrixWorld);
        }
        ((e.flash[a] = l.flash), (e.dissolve[a] = l.dissolve), a++);
      }
      for (const l of e.meshes)
        ((l.mesh.count = a),
          (l.mesh.instanceMatrix.needsUpdate = !0),
          (l.fa.needsUpdate = !0),
          (l.da.needsUpdate = !0));
    }
  }
}
class W0 {
  constructor() {
    const t = (e) => document.getElementById(e);
    ((this.el = {
      hud: t("hud"),
      crosshair: t("crosshair"),
      hitmarker: t("hitmarker"),
      dmg: t("dmg-indicators"),
      hpFill: t("hp-fill"),
      wave: t("st-wave"),
      enemies: t("st-enemies"),
      kills: t("st-kills"),
      wpnName: t("wpn-name"),
      ammoMag: t("ammo-mag"),
      ammoRes: t("ammo-res"),
      slots: [t("slot-1"), t("slot-2"), t("slot-3")],
      fireMode: t("fire-mode"),
      score: t("score"),
      feed: t("feed"),
      banner: t("banner"),
      bannerMain: t("banner-main"),
      bannerSub: t("banner-sub"),
      hint: t("hint"),
      popups: t("popups"),
      lowhp: t("lowhp"),
      menu: t("menu"),
      btnStart: t("btn-start"),
      menuStats: t("menu-stats"),
      title: document.querySelector(".title"),
      subtitle: document.querySelector(".subtitle"),
    }),
      (this.cache = {}),
      (this.hmT = 0),
      (this.hmOpacity = 0),
      (this.bannerT = 0),
      (this.hintT = 0),
      (this.w = window.innerWidth),
      (this.h = window.innerHeight),
      window.addEventListener("resize", () => {
        ((this.w = window.innerWidth), (this.h = window.innerHeight));
      }));
  }
  _set(t, e, n) {
    this.cache[t] !== n && ((this.cache[t] = n), (e.textContent = n));
  }
  show(t) {
    this.el.hud.classList.toggle("hidden", !t);
  }
  showMenu(
    t,
    e = "ONSLAUGHT",
    n = "DEPLOY",
    s = null,
    r = "HOLD THE LINE AGAINST THE SWARM",
  ) {
    (this.el.menu.classList.toggle("hidden", !t),
      t &&
        ((this.el.title.textContent = e),
        (this.el.btnStart.textContent = n),
        (this.el.subtitle.textContent = r),
        s
          ? ((this.el.menuStats.innerHTML = s),
            this.el.menuStats.classList.remove("hidden"))
          : this.el.menuStats.classList.add("hidden")));
  }
  setCrosshair(t, e) {
    const n = t.toFixed(1) + "px";
    this.cache.gap !== n &&
      ((this.cache.gap = n), this.el.crosshair.style.setProperty("--gap", n));
    const s = e ? "1" : "0";
    this.cache.chv !== s &&
      ((this.cache.chv = s), (this.el.crosshair.style.opacity = s));
  }
  hitmarker(t) {
    const e = this.el.hitmarker;
    ((e.className = "hitmarker " + t),
      (this.hmOpacity = 1),
      (e.style.opacity = "1"),
      (this.hmT = t === "hit" ? 0.1 : 0.2),
      (e.style.transform = t === "hit" ? "scale(1)" : "scale(1.4)"));
  }
  setAmmo(t, e, n) {
    (this._set("mag", this.el.ammoMag, String(t)),
      this._set("res", this.el.ammoRes, String(e)));
    const s =
      "ammo-mag" +
      (t === 0
        ? " empty"
        : t <= Math.max(1, Math.floor(n * 0.25))
          ? " low"
          : "");
    this.cache.magCls !== s &&
      ((this.cache.magCls = s), (this.el.ammoMag.className = s));
  }
  setWeapon(t, e, n) {
    (this._set("wname", this.el.wpnName, t),
      this._set("wmode", this.el.fireMode, e),
      this.el.slots.forEach((s, r) => s.classList.toggle("active", r === n)));
  }
  setHealth(t, e) {
    const n = Math.max(0, Math.min(1, t / e)),
      s = (n * 100).toFixed(1) + "%";
    this.cache.hp !== s &&
      ((this.cache.hp = s),
      (this.el.hpFill.style.width = s),
      this.el.hpFill.classList.toggle("low", n < 0.35),
      (this.el.lowhp.style.opacity =
        n < 0.5 ? String((1 - n * 2) * 0.85) : "0"));
  }
  setStats(t, e, n, s) {
    (this._set("wave", this.el.wave, String(t)),
      this._set("en", this.el.enemies, String(e)),
      this._set("kills", this.el.kills, String(n)),
      this._set("score", this.el.score, s.toLocaleString("en-US")));
  }
  banner(t, e, n, s = !1) {
    ((this.el.bannerMain.textContent = t),
      (this.el.bannerSub.textContent = e),
      this.el.bannerMain.classList.toggle("danger", s),
      this.el.banner.classList.add("show"),
      (this.bannerT = n));
  }
  hint(t, e = !1, n = 2) {
    ((this.el.hint.textContent = t),
      this.el.hint.classList.toggle("warn", e),
      this.el.hint.classList.add("show"),
      (this.hintT = n));
  }
  popup(t, e, n, s = "") {
    const r = document.createElement("div");
    ((r.className = "popup " + s),
      (r.textContent = t),
      (r.style.left = e - this.w / 2 + "px"),
      (r.style.top = n - this.h / 2 + "px"),
      this.el.popups.appendChild(r),
      setTimeout(() => r.remove(), 950));
  }
  feed(t, e = "") {
    const n = document.createElement("div");
    for (
      n.className = "feed-item " + e,
        n.textContent = t,
        this.el.feed.prepend(n);
      this.el.feed.children.length > 6;
    )
      this.el.feed.lastChild.remove();
    setTimeout(() => {
      ((n.style.transition = "opacity 0.5s"),
        (n.style.opacity = "0"),
        setTimeout(() => n.remove(), 500));
    }, 3500);
  }
  damageFrom(t) {
    const e = document.createElement("div");
    ((e.className = "dmg-ind"),
      (e.style.transform = `rotate(${t}rad)`),
      this.el.dmg.appendChild(e),
      setTimeout(() => {
        ((e.style.transition = "opacity 0.4s"),
          (e.style.opacity = "0"),
          setTimeout(() => e.remove(), 400));
      }, 500));
  }
  update(t) {
    (this.hmT > 0
      ? (this.hmT -= t)
      : this.hmOpacity > 0 &&
        ((this.hmOpacity = Math.max(0, this.hmOpacity - t * 7)),
        (this.el.hitmarker.style.opacity = String(this.hmOpacity))),
      this.bannerT > 0 &&
        ((this.bannerT -= t),
        this.bannerT <= 0 && this.el.banner.classList.remove("show")),
      this.hintT > 0 &&
        ((this.hintT -= t),
        this.hintT <= 0 && this.el.hint.classList.remove("show")));
  }
}
const il = (i, t) => i + Math.random() * (t - i),
  Cr = MathUtils.damp,
  q0 = new Vector3(0, 1, 0);
class X0 {
  constructor(t) {
    this.canvas = t;
    const e = new URLSearchParams(location.search);
    ((this.debug = e.has("debug")),
      (this.noSpawn = e.has("nospawn")),
      (this.god = e.has("god")));
    const n = new WebGLRenderer({
      canvas: t,
      antialias: !1,
      powerPreference: "high-performance",
      stencil: !1,
      alpha: !1,
    });
    (n.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)),
      n.setSize(window.innerWidth, window.innerHeight, !1),
      (n.toneMapping = NoToneMapping),
      (n.shadowMap.enabled = !0),
      (n.shadowMap.type = PCFSoftShadowMap),
      (n.autoClear = !1),
      n.setClearColor(0, 1),
      (this.renderer = n),
      (this.scene = new Scene()),
      (this.weaponScene = new Scene()));
    const s = window.innerWidth / window.innerHeight;
    ((this.camera = new PerspectiveCamera(80, s, 0.08, 1200)),
      (this.weaponCamera = new PerspectiveCamera(56, s, 0.012, 8)),
      this.scene.add(this.camera),
      this.weaponScene.add(this.weaponCamera),
      (this.input = new h0(t)),
      (this.audio = new f0()),
      (this.hud = new W0()),
      (this.arena = new m0(this.scene)),
      (this.sky = g0(xa)),
      this.scene.add(this.sky.mesh),
      (this.particles = new M0(this.scene)),
      (this.tracers = new y0(this.scene)),
      (this.decals = new S0(this.scene)),
      (this.shells = new E0(this.scene)),
      (this.shells.onBounce = (l) => {
        const o = this.audio.spatial([l.x, l.y, l.z], 3, 14);
        o.gain > 0.05 && this.audio.click(0.3 * o.gain, 4200);
      }),
      (this.player = new R0(this.arena)),
      (this.weapons = new O0(this.weaponCamera, this.audio, {
        fireRay: (l, o, c, h, d) => this.fireRay(l, o, c, h, d),
        ejectShell: (l, o, c) => this.shells.eject(l, o, c),
        muzzleSmoke: (l, o, c) => this.particles.muzzleSmoke(l, o, c),
        onAmmoChange: () => this.syncAmmo(),
        onWeaponChange: () => this.syncWeapon(),
      })),
      (this.enemies = new G0(
        this.scene,
        this.arena,
        this.particles,
        this.audio,
        {
          playerHit: (l, o, c) => this.onPlayerHit(l, o, c),
          onKill: (l, o) => this.onKill(l, o),
          slam: (l, o) => this.onSlam(l, o),
        },
      )),
      (this.postfx = new A0(n)));
    const r = new DirectionalLight(12571903, 1.8);
    (r.position.copy(xa).multiplyScalar(10),
      this.weaponScene.add(r),
      this.weaponScene.add(r.target),
      this.weaponScene.add(new HemisphereLight(2768230, 723208, 1.1)));
    const a = new PointLight(6222591, 1.2, 4, 2);
    (a.position.set(-0.6, -0.3, -0.6),
      this.weaponCamera.add(a),
      (this.muzzleLight = new PointLight(16752704, 0, 20, 2)),
      this.scene.add(this.muzzleLight),
      (this.impactLight = new PointLight(16760960, 0, 9, 2)),
      this.scene.add(this.impactLight),
      this._setupEnvironment(),
      this._buildPickupProto(),
      (this.state = "menu"),
      (this.time = 0),
      (this.last = performance.now()),
      (this.timeScale = 1),
      (this.slowmo = 0),
      (this.score = 0),
      (this.kills = 0),
      (this.streak = 0),
      (this.lastKillT = -10),
      (this.wave = 0),
      (this.waveActive = !1),
      (this.breakT = 0),
      (this.queue = []),
      (this.spawnTimer = 0),
      (this.maxAlive = 10),
      (this.spawnInterval = 1),
      (this.pickups = []),
      (this.deadT = 0),
      (this.hurtFx = 0),
      (this.lastHitSound = -1),
      (this.fps = 60),
      (this.startTime = 0),
      (this._v = new Vector3()),
      (this._v2 = new Vector3()),
      (this._q = new Quaternion()),
      (this._e = new Euler()),
      this.hud.el.btnStart.addEventListener("click", () => this.start()),
      (this.input.onLockChange = (l) => {
        !l && this.state === "playing" && !this.debug && this.pause();
      }),
      (this.input.onKeyDown = (l) => this.onKey(l)),
      window.addEventListener("resize", () => this.resize()),
      document.addEventListener("visibilitychange", () => {
        this.last = performance.now();
      }),
      (window.game = this),
      this.syncWeapon(),
      this.syncAmmo(),
      this.debug &&
        setTimeout(() => {
          (this.start(), (this.input.locked = !0));
        }, 300),
      (this._raf = (l) => {
        (requestAnimationFrame(this._raf), this.loop(l));
      }),
      requestAnimationFrame(this._raf));
  }
  _setupEnvironment() {
    const t = new PMREMGenerator(this.renderer),
      e = new Scene();
    e.add(new Mesh(this.sky.mesh.geometry, this.sky.mesh.material));
    const n = new Mesh(
      new PlaneGeometry(600, 600),
      new MeshBasicMaterial({ color: 461069 }),
    );
    ((n.rotation.x = -Math.PI / 2), (n.position.y = -0.5), e.add(n));
    const s = new Mesh(
      new TorusGeometry(38, 1.2, 8, 64),
      new MeshBasicMaterial({ color: new Color(0.3, 1.2, 1.6) }),
    );
    ((s.rotation.x = Math.PI / 2), (s.position.y = 3.4), e.add(s));
    for (const a of this.arena.gates) {
      const l = new Mesh(
        new SphereGeometry(2.5, 12, 8),
        new MeshBasicMaterial({ color: new Color(2.2, 0.8, 0.2) }),
      );
      (l.position.set(a.pos.x, 3.5, a.pos.z), e.add(l));
    }
    const r = t.fromScene(e, 0.04, 0.1, 1500);
    ((this.scene.environment = r.texture),
      (this.weaponScene.environment = r.texture),
      (this.scene.environmentIntensity = 0.8),
      (this.weaponScene.environmentIntensity = 0.9),
      t.dispose());
  }
  _buildPickupProto() {
    const t = new Group(),
      e = new Mesh(new BoxGeometry(0.55, 0.36, 0.38), this.arena.mats.crate);
    ((e.castShadow = !0), t.add(e));
    for (const s of [-0.16, 0.16]) {
      const r = new Mesh(
        new BoxGeometry(0.06, 0.37, 0.39),
        this.arena.mats.emCyan,
      );
      ((r.position.x = s), t.add(r));
    }
    const n = new Mesh(
      new BoxGeometry(0.3, 0.02, 0.2),
      this.arena.mats.emWhite,
    );
    ((n.position.y = 0.19), t.add(n), (this.pickupProto = t));
  }
  start() {
    if ((this.audio.init(), this.audio.resume(), this.state === "paused")) {
      ((this.state = "playing"),
        this.hud.showMenu(!1),
        this.debug || this.input.lock(),
        (this.last = performance.now()));
      return;
    }
    (this.resetGame(),
      (this.state = "playing"),
      this.hud.showMenu(!1),
      this.hud.show(!0),
      this.debug || this.input.lock(),
      (this.last = performance.now()),
      this.hud.banner("DEPLOYING", "HOLD THE ARENA", 2.5),
      (this.audio.intensity = 1),
      (this.breakT = 4),
      (this.waveActive = !1),
      (this.wave = 0));
  }
  pause() {
    ((this.state = "paused"),
      this.hud.showMenu(
        !0,
        "PAUSED",
        "RESUME",
        null,
        `WAVE ${this.wave} · SCORE ${this.score.toLocaleString("en-US")}`,
      ));
  }
  resetGame() {
    (this.player.reset(), this.weapons.resetAll(), this.enemies.clear());
    for (const t of this.pickups) this.scene.remove(t.mesh);
    ((this.pickups.length = 0),
      (this.score = 0),
      (this.kills = 0),
      (this.streak = 0),
      (this.queue.length = 0),
      (this.slowmo = 0),
      (this.timeScale = 1),
      (this.deadT = 0),
      (this.startTime = this.time),
      (this.postfx.u.uDesat.value = 0),
      this.syncAmmo(),
      this.syncWeapon());
  }
  onDeath() {
    ((this.state = "dead"),
      (this.deadT = 0),
      this.audio.gameOver(),
      (this.audio.intensity = 0),
      this.hud.banner("K.I.A.", "THE SWARM OVERRAN THE ARENA", 6, !0),
      (this.slowmo = 2.5));
  }
  onKey(t) {
    (t === "KeyM" &&
      ((this.audio.musicOn = !this.audio.musicOn),
      this.hud.hint(this.audio.musicOn ? "MUSIC ON" : "MUSIC OFF")),
      t === "BracketLeft" &&
        ((this.input.sensitivity = Math.max(
          0.2,
          +(this.input.sensitivity - 0.1).toFixed(2),
        )),
        this.hud.hint("SENSITIVITY " + this.input.sensitivity.toFixed(1))),
      t === "BracketRight" &&
        ((this.input.sensitivity = Math.min(
          3,
          +(this.input.sensitivity + 0.1).toFixed(2),
        )),
        this.hud.hint("SENSITIVITY " + this.input.sensitivity.toFixed(1))),
      t === "Escape" && this.debug && this.state === "playing" && this.pause());
  }
  resize() {
    const t = window.innerWidth,
      e = window.innerHeight;
    (this.renderer.setSize(t, e, !1),
      (this.camera.aspect = t / e),
      this.camera.updateProjectionMatrix(),
      (this.weaponCamera.aspect = t / e),
      this.weaponCamera.updateProjectionMatrix());
    const n = this.renderer.getDrawingBufferSize(new Vector2());
    this.postfx.setSize(n.x, n.y);
  }
  syncAmmo() {
    const t = this.weapons.weapon;
    this.hud.setAmmo(t.mag, t.reserve, t.def.magSize);
  }
  syncWeapon() {
    const t = this.weapons.weapon;
    (this.hud.setWeapon(t.def.name, t.def.mode, this.weapons.current),
      this.syncAmmo());
  }
  project(t, e, n) {
    const s = this._v.set(t, e, n).project(this.camera);
    return s.z > 1
      ? null
      : {
          x: (s.x * 0.5 + 0.5) * window.innerWidth,
          y: (-s.y * 0.5 + 0.5) * window.innerHeight,
        };
  }
  fireRay(t, e, n, s, r) {
    const l = this.enemies.raycast(t, e, 240),
      o = this.arena.raycast(t, e, l ? l.t : 240),
      c = this.time;
    let h;
    if (l && (!o || l.t < o.dist)) {
      const d =
          1 -
          (1 - n.falloffMin) *
            MathUtils.clamp(
              (l.t - n.falloffStart) / (n.falloffEnd - n.falloffStart),
              0,
              1,
            ),
        u = n.damage * d * (l.head ? n.headMult : 1),
        m = this.enemies.damage(l, u, e, n);
      ((h = l.point),
        this.hud.hitmarker(m.killed ? (l.head ? "head" : "kill") : "hit"),
        c - this.lastHitSound > 0.03 &&
          ((this.lastHitSound = c),
          m.killed ? this.audio.kill(l.head) : this.audio.hitmarker(l.head)));
    } else if (o) {
      h = o.point;
      const d = n.key === "dmr";
      (this.decals.add(
        o.point,
        o.normal,
        il(0.09, 0.14) * (d ? 1.5 : n.key === "shotgun" ? 0.8 : 1),
        0,
        c,
      ),
        this.particles.impactSparks(
          o.point,
          o.normal,
          d ? 26 : n.key === "shotgun" ? 5 : 12,
          d ? 1.5 : 1,
        ),
        c - this.lastHitSound > 0.03 &&
          ((this.lastHitSound = c),
          this.audio.impactWorld([o.point.x, o.point.y, o.point.z])),
        this.impactLight.position.copy(o.point).addScaledVector(o.normal, 0.25),
        (this.impactLight.intensity = d ? 60 : 30));
    } else h = t.clone().addScaledVector(e, 240);
    r &&
      this.tracers.fire(
        s,
        h,
        c,
        n.key === "dmr" ? 520 : 360,
        n.tracerWidth,
        n.key === "dmr" ? 9 : 4.5,
        n.tracer,
      );
  }
  onPlayerHit(t, e, n) {
    this.player.dead ||
      (this.god && (t = 0),
      this.player.damage(t, e),
      n &&
        (this._v.subVectors(this.player.pos, n.pos),
        (this._v.y = 0),
        this._v.normalize(),
        this.player.knock(this._v, n.def.big ? 7 : 2.2)),
      this.hud.setHealth(this.player.hp, this.player.maxHp));
  }
  onSlam(t, e) {
    (this.player.addTrauma(MathUtils.clamp(1 - e / 14, 0, 0.8)),
      e < 5 &&
        (this._v.subVectors(this.player.pos, t),
        (this._v.y = 0),
        this._v.normalize(),
        this.player.knock(this._v, 5)));
  }
  onKill(t, e) {
    this.kills++;
    const n = this.time;
    ((this.streak = n - this.lastKillT < 1.8 ? this.streak + 1 : 1),
      (this.lastKillT = n));
    const s = Math.min(4, 1 + (this.streak - 1) * 0.25);
    let r = Math.round(t.def.score * s) + (e ? 50 : 0);
    this.score += r;
    const a = this.project(t.pos.x, t.pos.y + 1.75 * t.scale, t.pos.z);
    (a &&
      this.hud.popup(
        "+" + r + (e ? " HEADSHOT" : ""),
        a.x,
        a.y,
        e ? "head" : "kill",
      ),
      this.hud.feed(
        `${t.def.name} ${e ? "HEADSHOT" : "DOWN"}`,
        e ? "head" : "",
      ),
      this.streak >= 3 &&
        this.streak % 3 === 0 &&
        (this.hud.feed(`${this.streak}x STREAK  ×${s.toFixed(2)}`, "wave"),
        this.hud.popup(
          `${this.streak}x STREAK`,
          window.innerWidth / 2,
          window.innerHeight * 0.36,
          "bonus",
        )),
      (t.def.big || Math.random() < 0.13) && this.spawnPickup(t.pos),
      this._v.set(t.pos.x, this.arena.groundHeight(t.pos.x, t.pos.z), t.pos.z),
      this.decals.add(this._v, q0, 1.5 * t.scale, 1, n));
  }
  startWave(t) {
    ((this.wave = t), (this.waveActive = !0));
    const e = Math.min(6 + t * 5 + Math.floor(t * t * 0.45), 130),
      n = t >= 3 ? 1 + Math.floor((t - 3) / 2) + (t % 5 === 0 ? 2 : 0) : 0,
      s = t >= 2 ? Math.floor(e * 0.18) : 0,
      r = [];
    for (let a = 0; a < e; a++) r.push("runner");
    for (let a = 0; a < s; a++) r[Math.floor(Math.random() * e)] = "spitter";
    for (let a = 0; a < n; a++) r[Math.floor(il(e * 0.2, e * 0.9))] = "brute";
    ((this.queue = r.reverse()),
      (this.maxAlive = Math.min(14 + t * 4, 64)),
      (this.spawnInterval = Math.max(0.2, 1.1 - t * 0.06)),
      (this.spawnTimer = 1),
      this.hud.banner(
        "WAVE " + t,
        t % 5 === 0 ? "HEAVY PRESENCE DETECTED" : e + " HOSTILES INBOUND",
        3.2,
        t % 5 === 0,
      ),
      this.hud.feed("WAVE " + t + " STARTED", "wave"),
      this.audio.waveStart(),
      (this.audio.intensity = 2));
    for (const a of this.arena.gates) a.activity = 1.2;
  }
  updateWaves(t) {
    if (this.noSpawn) return;
    if (!this.waveActive) {
      ((this.breakT -= t), this.breakT <= 0 && this.startWave(this.wave + 1));
      return;
    }
    this.spawnTimer -= t;
    const e = this.enemies.alive;
    if (this.queue.length && e < this.maxAlive && this.spawnTimer <= 0) {
      const n = 1 + Math.floor(Math.random() * Math.min(3, this.wave));
      for (let s = 0; s < n && this.queue.length; s++) {
        const r = this.arena.gates,
          a = r[Math.floor(Math.random() * r.length)];
        (this.enemies.spawn(this.queue.pop(), a, 1 + (this.wave - 1) * 0.07),
          (a.activity = 1.2));
      }
      this.spawnTimer = this.spawnInterval;
    }
    !this.queue.length && e === 0 && this.waveCleared();
  }
  waveCleared() {
    ((this.waveActive = !1), (this.breakT = 9));
    const t = 250 * this.wave;
    ((this.score += t),
      this.hud.banner(
        "WAVE " + this.wave + " CLEARED",
        "+" + t + " BONUS  ·  REINFORCEMENTS IN 9s",
        4,
      ),
      this.hud.feed("WAVE " + this.wave + " CLEARED  +" + t, "wave"),
      this.audio.waveClear(),
      (this.audio.intensity = 1),
      (this.slowmo = 1.3));
    for (const e of this.weapons.weapons)
      e.reserve = Math.min(e.def.reserve * 2, e.reserve + e.def.magSize * 2);
    this.syncAmmo();
  }
  spawnPickup(t) {
    const e = this.pickupProto.clone(),
      n = this.arena.groundHeight(t.x, t.z);
    (e.position.set(t.x, n + 0.35, t.z),
      this.scene.add(e),
      this.pickups.push({
        mesh: e,
        life: 28,
        t: Math.random() * 6,
        baseY: n + 0.35,
      }));
  }
  updatePickups(t) {
    for (let e = this.pickups.length - 1; e >= 0; e--) {
      const n = this.pickups[e];
      ((n.t += t),
        (n.life -= t),
        (n.mesh.rotation.y += t * 1.2),
        (n.mesh.position.y = n.baseY + Math.sin(n.t * 3) * 0.07),
        (n.mesh.visible = n.life > 5 || Math.sin(n.t * 12) > 0));
      const s = Math.hypot(
        n.mesh.position.x - this.player.pos.x,
        n.mesh.position.z - this.player.pos.z,
      );
      if (
        n.life <= 0 ||
        (s < 1.35 &&
          Math.abs(n.mesh.position.y - this.player.pos.y) < 2 &&
          !this.player.dead)
      ) {
        if (n.life > 0) {
          for (const r of this.weapons.weapons)
            r.reserve = Math.min(
              r.def.reserve * 2,
              r.reserve + r.def.magSize * (r === this.weapons.weapon ? 2 : 1),
            );
          (this.syncAmmo(),
            this.hud.feed("AMMO RESUPPLY", "wave"),
            this.hud.hint("AMMO RESUPPLIED"),
            this.audio.pickup(),
            this.particles.pickupBurst(n.mesh.position));
        }
        (this.scene.remove(n.mesh), this.pickups.splice(e, 1));
      }
    }
  }
  loop(t) {
    let e = Math.min(0.05, (t - this.last) / 1e3);
    ((this.last = t),
      e <= 0 && (e = 1e-4),
      (this.fps = Cr(this.fps, 1 / e, 2, e)),
      (this.slowmo = Math.max(0, this.slowmo - e)),
      (this.timeScale = Cr(this.timeScale, this.slowmo > 0 ? 0.28 : 1, 7, e)));
    const n = e * this.timeScale;
    this.time += n;
    const s = this.time;
    (this.state === "playing" || this.state === "dead"
      ? this.updateGame(n, e)
      : this.updateIdle(n, e),
      this.arena.update(s, n),
      this.sky.update(s),
      this.particles.update(s, n, this.camera.position),
      this.tracers.update(s),
      this.decals.update(s),
      this.shells.update(n, (r, a) => this.arena.groundHeight(r, a)),
      (this.impactLight.intensity *= Math.exp(-28 * e)),
      this.hud.update(e),
      this.audio.setListener(
        [
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z,
        ],
        [this.player.forward.x, 0, this.player.forward.z],
        [this.player.right.x, 0, this.player.right.z],
      ),
      this.audio.update(
        e,
        this.state === "playing" ? this.player.hp / this.player.maxHp : 1,
      ),
      this.render(),
      this.input.endFrame());
  }
  updateIdle(t, e) {
    if (this.state === "menu" || this.state === "over") {
      const n = this.time * 0.07;
      (this.camera.position.set(
        Math.cos(n) * 26,
        7.5 + Math.sin(this.time * 0.3) * 1.2,
        Math.sin(n) * 26,
      ),
        this.camera.lookAt(0, 2.5, 0),
        (this.camera.fov = Cr(this.camera.fov, 62, 4, e)),
        this.camera.updateProjectionMatrix(),
        this.player.forward
          .set(0, 0, -1)
          .applyQuaternion(this.camera.quaternion),
        this.player.right.set(1, 0, 0).applyQuaternion(this.camera.quaternion),
        this.enemies.update(t, this.player, this.time),
        (this.postfx.u.uDamage.value = 0),
        (this.postfx.u.uRadial.value = 0),
        (this.postfx.u.uCA.value = 0.004),
        (this.postfx.u.uFlash.value = 0));
    }
  }
  updateGame(t, e) {
    const n = this.player,
      s = this.input;
    n.update(t, s, this.time);
    for (const h of n.events)
      h.type === "jump"
        ? (this.audio.jump(), this.weapons.onJump())
        : h.type === "land"
          ? (this.audio.land(h.strength),
            this.weapons.onLand(h.strength),
            n.addTrauma(h.strength * 0.12))
          : h.type === "step"
            ? this.audio.footstep(h.sprint ? 1.25 : 0.85)
            : h.type === "slide"
              ? this.audio.slide()
              : h.type === "hurt"
                ? (this.hud.damageFrom(h.angle),
                  this.audio.playerHurt(h.amount),
                  (this.hurtFx = 1))
                : h.type === "dead" && this.onDeath();
    if (
      ((n.events.length = 0),
      (this.hurtFx = Math.max(0, this.hurtFx - e * 2.2)),
      this.camera.position.copy(n.camPos),
      this.camera.quaternion.copy(n.camQuat),
      n.dead)
    ) {
      this.deadT += e;
      const h = Math.min(1, this.deadT / 1.4);
      if (
        ((this.camera.position.y -= h * 1.05),
        this._e.set(-h * 0.35, 0, h * 0.55),
        this._q.setFromEuler(this._e),
        this.camera.quaternion.multiply(this._q),
        this.deadT > 3.2 && this.state === "dead")
      ) {
        ((this.state = "over"), this.input.unlock());
        const d = Math.floor(this.time - this.startTime);
        (this.hud.showMenu(
          !0,
          "K.I.A.",
          "REDEPLOY",
          `WAVE ${this.wave} REACHED<br>${this.kills} KILLS · ${this.score.toLocaleString("en-US")} POINTS<br>${d}s SURVIVED`,
          "THE SWARM PREVAILS",
        ),
          this.hud.show(!1));
      }
    }
    ((this.camera.fov = n.fov),
      this.camera.updateProjectionMatrix(),
      this.weaponCamera.position.copy(this.camera.position),
      this.weaponCamera.quaternion.copy(this.camera.quaternion),
      this.weapons.update(t, s, n, this.time),
      this.enemies.update(t, n, this.time),
      n.dead || (this.updateWaves(t), this.updatePickups(t)));
    const r = this.weapons.flash.intensity;
    (this.muzzleLight.position.copy(this.weapons.muzzleWorld),
      (this.muzzleLight.intensity =
        r * this.weapons.weapon.def.flash.light * 3.5));
    const a = this.weapons.getSpread(n),
      l =
        (Math.tan(a) / Math.tan(MathUtils.degToRad(this.camera.fov / 2))) *
          (window.innerHeight / 2) +
        5;
    if (
      (this.hud.setCrosshair(
        l,
        this.weapons.adsSmooth < 0.45 &&
          !n.dead &&
          this.weapons.sprintBlend < 0.6,
      ),
      this.hud.setHealth(n.hp, n.maxHp),
      this.hud.setStats(
        this.wave,
        this.enemies.alive + this.queue.length,
        this.kills,
        this.score,
      ),
      this.state === "playing")
    ) {
      const h = this.weapons.weapon;
      h.mag === 0 && h.reserve > 0 && !h.reloading
        ? this.hud.hint("RELOAD  [R]", !0, 0.2)
        : h.mag === 0 &&
          h.reserve === 0 &&
          this.hud.hint("NO AMMO  ·  SWITCH WEAPON", !0, 0.2);
    }
    const o = this.postfx.u,
      c = n.hp / n.maxHp;
    ((o.uDamage.value = Math.pow(1 - c, 1.7) * 0.85 + this.hurtFx * 0.4),
      (o.uCA.value =
        0.0035 + this.hurtFx * 0.02 + r * 0.012 + n.trauma * n.trauma * 0.03),
      (o.uRadial.value = n.slideBlend * 0.5 + n.sprintBlend * 0.12),
      (o.uFlash.value = r * 0.03),
      (o.uExposure.value = 1.45 + this.weapons.adsSmooth * 0.06),
      (o.uDesat.value = n.dead ? Math.min(1, this.deadT / 2.5) : 0));
  }
  render() {
    this.postfx.render(
      this.scene,
      this.camera,
      this.state === "playing" ||
        this.state === "dead" ||
        this.state === "paused"
        ? this.weaponScene
        : null,
      this.weaponCamera,
      this.time,
    );
  }
}
const Y0 = document.getElementById("game");
try {
  new X0(Y0);
} catch (i) {
  console.error(i);
  const t = document.createElement("div");
  ((t.style.cssText =
    "position:fixed;left:20px;top:20px;color:#f66;font:14px monospace;z-index:99;white-space:pre-wrap;max-width:90vw"),
    (t.textContent = "Failed to start: " + (i && i.stack ? i.stack : i)),
    document.body.appendChild(t));
}
