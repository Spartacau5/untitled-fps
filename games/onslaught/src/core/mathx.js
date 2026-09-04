import { MathUtils, Vector3 } from "three";

export const rand = (i, t) => i + Math.random() * (t - i);
export const damp4 = (i, t, e, n) => MathUtils.damp(i, t, e, n);
export const DEG = Math.PI / 180;
export const damp = MathUtils.damp;
export const smooth01 = (i) => i * i * (3 - 2 * i);
export const easeOutCubic = (i) =>
  1 - Math.pow(1 - Math.min(1, Math.max(0, i)), 3);
export function lerpAngle(i, t, e) {
  let n = t - i;
  for (; n > Math.PI;) n -= Math.PI * 2;
  for (; n < -Math.PI;) n += Math.PI * 2;
  return i + n * e;
}
export const _rayTmp = new Vector3();
export const _capA = new Vector3();
export const _capB = new Vector3();
export function raySphere(i, t, e, n) {
  _rayTmp.subVectors(i, e);
  const s = _rayTmp.dot(t),
    r = _rayTmp.dot(_rayTmp) - n * n;
  if (r > 0 && s > 0) return -1;
  const a = s * s - r;
  if (a < 0) return -1;
  const l = -s - Math.sqrt(a);
  return l < 0 ? 0 : l;
}
export function rayCapsule(i, t, e, n, s) {
  let r = -1;
  const a = raySphere(i, t, e, s);
  a >= 0 && (r = a);
  const l = raySphere(i, t, n, s);
  l >= 0 && (r < 0 || l < r) && (r = l);
  const o = _capA.subVectors(n, e),
    c = o.length();
  if (c < 1e-5) return r;
  o.multiplyScalar(1 / c);
  const h = _capB.subVectors(i, e),
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
export const UP = new Vector3(0, 1, 0);
