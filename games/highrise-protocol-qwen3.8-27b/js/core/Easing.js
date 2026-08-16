// C5: Every animation uses proper easing or springs. No linear lerps.
// t is expected in [0,1]; out of range is clamped.
export const Easing = {
  linear: t => t,
  easeOutQuad: t => 1 - (1 - t) * (1 - t),
  easeInQuad: t => t * t,
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInCubic: t => t * t * t,
  easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeOutQuart: t => 1 - Math.pow(1 - t, 4),
  easeInQuart: t => t * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  easeOutQuint: t => 1 - Math.pow(1 - t, 5),
  easeInOutQuint: t => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
  easeOutSine: t => Math.sin(t * Math.PI * 0.5),
  easeInSine: t => 1 - Math.cos(t * Math.PI * 0.5),
  easeInOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2,
  // Snappy overshoot for impacts (back). s controls overshoot amount.
  easeOutBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  easeInBack: t => { const c1 = 1.70158, c3 = c1 + 1; return c3 * t * t * t - c1 * t * t; },
  easeInOutBack: t => {
    const c1 = 1.70158, c2 = c1 * 1.525;
    return t < 0.5 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  easeOutExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInExpo: t => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeInOutExpo: t => (t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2),
  // damped sine for ripples
  easeOutElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  // damped spring decay: 1 - e^(-k t) * cos(w t)
  damped: (t, k = 4, w = 12) => 1 - Math.exp(-k * t) * Math.cos(w * t),
  clamp01: t => (t < 0 ? 0 : t > 1 ? 1 : t),
};

// Interpolate with an easing curve.
export function lerpEase(a, b, t, ease = Easing.easeOutCubic) {
  return a + (b - a) * ease(Easing.clamp01(t));
}
export function lerp(a, b, t) { return a + (b - a) * t; }
export function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
// Soft clamp — eases into the limit (tanh knee), never a hard stop.
export function softClamp(x, limit) { return limit * Math.tanh(x / limit); }
export function clamp01(v) { return clamp(v, 0, 1); }
// Framerate-independent damping (exponential).
export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}
