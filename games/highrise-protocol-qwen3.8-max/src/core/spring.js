// ---------------------------------------------------------------------------
// core/spring.js — spring-damper primitives + easing library (C6, C7)
// All springs integrate at the fixed 120 Hz step => frame-rate independent.
// Slightly under-damped by design (zeta < 1): AAA means overshoot + settle.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

export const TUNING = {
  NAN_GUARD: true,          // K4: springs must never emit NaN
  MIN_STIFFNESS: 0.001,     // guard against degenerate tuning
};

export function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
export function lerp(a, b, t) { return a + (b - a) * t; }
export function damp(a, b, lambda, dt) { return lerp(b, a, Math.exp(-lambda * dt)); }
// S3: soft clamp — eases into the limit (tanh knee), never a hard stop.
export function softClamp(x, limit) { return limit * Math.tanh(x / limit); }

export class Spring {
  constructor(k, d, value = 0) {
    this.k = Math.max(k, TUNING.MIN_STIFFNESS);
    this.d = d;
    this.value = value;
    this.target = value;
    this.vel = 0;
  }
  set(v) { this.value = v; this.target = v; this.vel = 0; return this; }
  snapTo(v) { this.value = v; return this; }
  impulse(j) { this.vel += j; return this; }
  update(dt) {
    const a = this.k * (this.target - this.value) - this.d * this.vel;
    this.vel += a * dt;
    this.value += this.vel * dt;
    if (TUNING.NAN_GUARD && !Number.isFinite(this.value)) {
      this.value = this.target; this.vel = 0;
    }
    return this.value;
  }
}

export class Spring3 {
  constructor(k, d, x = 0, y = 0, z = 0) {
    this.k = Math.max(k, TUNING.MIN_STIFFNESS);
    this.d = d;
    this.value = new THREE.Vector3(x, y, z);
    this.target = new THREE.Vector3(x, y, z);
    this.vel = new THREE.Vector3();
  }
  set(x, y, z) { this.value.set(x, y, z); this.target.set(x, y, z); this.vel.set(0, 0, 0); return this; }
  impulseVec(v) { this.vel.add(v); return this; }
  impulse(x, y, z) { this.vel.x += x; this.vel.y += y; this.vel.z += z; return this; }
  update(dt) {
    const v = this.value, t = this.target, w = this.vel;
    w.x += (this.k * (t.x - v.x) - this.d * w.x) * dt;
    w.y += (this.k * (t.y - v.y) - this.d * w.y) * dt;
    w.z += (this.k * (t.z - v.z) - this.d * w.z) * dt;
    v.x += w.x * dt; v.y += w.y * dt; v.z += w.z * dt;
    if (TUNING.NAN_GUARD && (!Number.isFinite(v.x) || !Number.isFinite(v.y) || !Number.isFinite(v.z))) {
      v.copy(t); w.set(0, 0, 0);
    }
    return this.value;
  }
}

// --- Easing library (C6: nothing linear in the visible build) --------------
export const Ease = {
  linear: (t) => t, // only used inside spring blends, never for visible motion
  inQuad: (t) => t * t,
  outQuad: (t) => t * (2 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 + (--t) * t * t,
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 + (--t) * (2 * t) * (-2 * t + 2) / 2),
  outBack: (t) => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  outBackBig: (t) => { const c = 2.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};

// --- Keyframed timeline with per-segment easing (reload choreography) -------
// tracks: { channelName: [ [t, value, easeFn?], ... ] } sorted by t.
export class Timeline {
  constructor(tracks) { this.tracks = tracks; }
  duration() {
    let d = 0;
    for (const k in this.tracks) d = Math.max(d, this.tracks[k][this.tracks[k].length - 1][0]);
    return d;
  }
  sample(t, out) {
    for (const name in this.tracks) {
      const keys = this.tracks[name];
      let v = keys[0][1];
      if (t >= keys[keys.length - 1][0]) {
        v = keys[keys.length - 1][1];
      } else {
        for (let i = 0; i < keys.length - 1; i++) {
          const a = keys[i], b = keys[i + 1];
          if (t >= a[0] && t <= b[0]) {
            const span = Math.max(b[0] - a[0], 1e-6);
            const ease = b[2] || Ease.inOutCubic;
            v = lerp(a[1], b[1], ease(clamp((t - a[0]) / span, 0, 1)));
            break;
          }
        }
      }
      out[name] = v;
    }
    return out;
  }
}
