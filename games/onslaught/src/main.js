(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) n(s);
  new MutationObserver((s) => {
    for (const r of s)
      if (r.type === "childList")
        for (const a of r.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && n(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(s) {
    const r = {};
    return (
      s.integrity && (r.integrity = s.integrity),
      s.referrerPolicy && (r.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === "use-credentials"
        ? (r.credentials = "include")
        : s.crossOrigin === "anonymous"
          ? (r.credentials = "omit")
          : (r.credentials = "same-origin"),
      r
    );
  }
  function n(s) {
    if (s.ep) return;
    s.ep = !0;
    const r = e(s);
    fetch(s.href, r);
  }
})();
/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */ const ya = "170",
  Yl = 0,
  Ya = 1,
  jl = 2,
  sl = 1,
  rl = 2,
  mn = 3,
  Fn = 0,
  Ce = 1,
  Ie = 2,
  In = 0,
  $n = 1,
  Mn = 2,
  ja = 3,
  Ka = 4,
  al = 5,
  Dn = 100,
  Kl = 101,
  $l = 102,
  Zl = 103,
  Jl = 104,
  Ql = 200,
  Pr = 201,
  tc = 202,
  ec = 203,
  Lr = 204,
  Dr = 205,
  nc = 206,
  ic = 207,
  sc = 208,
  rc = 209,
  ac = 210,
  oc = 211,
  lc = 212,
  cc = 213,
  hc = 214,
  Ur = 0,
  Ir = 1,
  Nr = 2,
  bi = 3,
  Fr = 4,
  zr = 5,
  Or = 6,
  Br = 7,
  ol = 0,
  uc = 1,
  dc = 2,
  _n = 0,
  fc = 1,
  pc = 2,
  mc = 3,
  gc = 4,
  vc = 5,
  _c = 6,
  xc = 7,
  ll = 300,
  Ai = 301,
  Ri = 302,
  kr = 303,
  Hr = 304,
  Vs = 306,
  Vr = 1e3,
  jn = 1001,
  Gr = 1002,
  ke = 1003,
  Mc = 1004,
  rs = 1005,
  Ne = 1006,
  js = 1007,
  Kn = 1008,
  yn = 1009,
  cl = 1010,
  hl = 1011,
  Qi = 1012,
  Sa = 1013,
  Jn = 1014,
  rn = 1015,
  Qn = 1016,
  Ea = 1017,
  wa = 1018,
  Ci = 1020,
  ul = 35902,
  dl = 1021,
  fl = 1022,
  tn = 1023,
  pl = 1024,
  ml = 1025,
  wi = 1026,
  Pi = 1027,
  Ta = 1028,
  ba = 1029,
  gl = 1030,
  Aa = 1031,
  Ra = 1033,
  Ls = 33776,
  Ds = 33777,
  Us = 33778,
  Is = 33779,
  Wr = 35840,
  qr = 35841,
  Xr = 35842,
  Yr = 35843,
  jr = 36196,
  Kr = 37492,
  $r = 37496,
  Zr = 37808,
  Jr = 37809,
  Qr = 37810,
  ta = 37811,
  ea = 37812,
  na = 37813,
  ia = 37814,
  sa = 37815,
  ra = 37816,
  aa = 37817,
  oa = 37818,
  la = 37819,
  ca = 37820,
  ha = 37821,
  Ns = 36492,
  ua = 36494,
  da = 36495,
  vl = 36283,
  fa = 36284,
  pa = 36285,
  ma = 36286,
  yc = 3200,
  _l = 3201,
  xl = 0,
  Sc = 1,
  Un = "",
  Xe = "srgb",
  Ui = "srgb-linear",
  Gs = "linear",
  Qt = "srgb",
  si = 7680,
  $a = 519,
  Ec = 512,
  wc = 513,
  Tc = 514,
  Ml = 515,
  bc = 516,
  Ac = 517,
  Rc = 518,
  Cc = 519,
  Za = 35044,
  gn = 35048,
  Ja = "300 es",
  vn = 2e3,
  Os = 2001;
class Ii {
  addEventListener(t, e) {
    this._listeners === void 0 && (this._listeners = {});
    const n = this._listeners;
    (n[t] === void 0 && (n[t] = []), n[t].indexOf(e) === -1 && n[t].push(e));
  }
  hasEventListener(t, e) {
    if (this._listeners === void 0) return !1;
    const n = this._listeners;
    return n[t] !== void 0 && n[t].indexOf(e) !== -1;
  }
  removeEventListener(t, e) {
    if (this._listeners === void 0) return;
    const s = this._listeners[t];
    if (s !== void 0) {
      const r = s.indexOf(e);
      r !== -1 && s.splice(r, 1);
    }
  }
  dispatchEvent(t) {
    if (this._listeners === void 0) return;
    const n = this._listeners[t.type];
    if (n !== void 0) {
      t.target = this;
      const s = n.slice(0);
      for (let r = 0, a = s.length; r < a; r++) s[r].call(this, t);
      t.target = null;
    }
  }
}
const ye = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "0a",
  "0b",
  "0c",
  "0d",
  "0e",
  "0f",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "1a",
  "1b",
  "1c",
  "1d",
  "1e",
  "1f",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "2a",
  "2b",
  "2c",
  "2d",
  "2e",
  "2f",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "3a",
  "3b",
  "3c",
  "3d",
  "3e",
  "3f",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "4a",
  "4b",
  "4c",
  "4d",
  "4e",
  "4f",
  "50",
  "51",
  "52",
  "53",
  "54",
  "55",
  "56",
  "57",
  "58",
  "59",
  "5a",
  "5b",
  "5c",
  "5d",
  "5e",
  "5f",
  "60",
  "61",
  "62",
  "63",
  "64",
  "65",
  "66",
  "67",
  "68",
  "69",
  "6a",
  "6b",
  "6c",
  "6d",
  "6e",
  "6f",
  "70",
  "71",
  "72",
  "73",
  "74",
  "75",
  "76",
  "77",
  "78",
  "79",
  "7a",
  "7b",
  "7c",
  "7d",
  "7e",
  "7f",
  "80",
  "81",
  "82",
  "83",
  "84",
  "85",
  "86",
  "87",
  "88",
  "89",
  "8a",
  "8b",
  "8c",
  "8d",
  "8e",
  "8f",
  "90",
  "91",
  "92",
  "93",
  "94",
  "95",
  "96",
  "97",
  "98",
  "99",
  "9a",
  "9b",
  "9c",
  "9d",
  "9e",
  "9f",
  "a0",
  "a1",
  "a2",
  "a3",
  "a4",
  "a5",
  "a6",
  "a7",
  "a8",
  "a9",
  "aa",
  "ab",
  "ac",
  "ad",
  "ae",
  "af",
  "b0",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
  "ba",
  "bb",
  "bc",
  "bd",
  "be",
  "bf",
  "c0",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "c9",
  "ca",
  "cb",
  "cc",
  "cd",
  "ce",
  "cf",
  "d0",
  "d1",
  "d2",
  "d3",
  "d4",
  "d5",
  "d6",
  "d7",
  "d8",
  "d9",
  "da",
  "db",
  "dc",
  "dd",
  "de",
  "df",
  "e0",
  "e1",
  "e2",
  "e3",
  "e4",
  "e5",
  "e6",
  "e7",
  "e8",
  "e9",
  "ea",
  "eb",
  "ec",
  "ed",
  "ee",
  "ef",
  "f0",
  "f1",
  "f2",
  "f3",
  "f4",
  "f5",
  "f6",
  "f7",
  "f8",
  "f9",
  "fa",
  "fb",
  "fc",
  "fd",
  "fe",
  "ff",
];
let Qa = 1234567;
const Ki = Math.PI / 180,
  ts = 180 / Math.PI;
function Ni() {
  const i = (Math.random() * 4294967295) | 0,
    t = (Math.random() * 4294967295) | 0,
    e = (Math.random() * 4294967295) | 0,
    n = (Math.random() * 4294967295) | 0;
  return (
    ye[i & 255] +
    ye[(i >> 8) & 255] +
    ye[(i >> 16) & 255] +
    ye[(i >> 24) & 255] +
    "-" +
    ye[t & 255] +
    ye[(t >> 8) & 255] +
    "-" +
    ye[((t >> 16) & 15) | 64] +
    ye[(t >> 24) & 255] +
    "-" +
    ye[(e & 63) | 128] +
    ye[(e >> 8) & 255] +
    "-" +
    ye[(e >> 16) & 255] +
    ye[(e >> 24) & 255] +
    ye[n & 255] +
    ye[(n >> 8) & 255] +
    ye[(n >> 16) & 255] +
    ye[(n >> 24) & 255]
  ).toLowerCase();
}
function Re(i, t, e) {
  return Math.max(t, Math.min(e, i));
}
function Ca(i, t) {
  return ((i % t) + t) % t;
}
function Pc(i, t, e, n, s) {
  return n + ((i - t) * (s - n)) / (e - t);
}
function Lc(i, t, e) {
  return i !== t ? (e - i) / (t - i) : 0;
}
function $i(i, t, e) {
  return (1 - e) * i + e * t;
}
function Dc(i, t, e, n) {
  return $i(i, t, 1 - Math.exp(-e * n));
}
function Uc(i, t = 1) {
  return t - Math.abs(Ca(i, t * 2) - t);
}
function Ic(i, t, e) {
  return i <= t
    ? 0
    : i >= e
      ? 1
      : ((i = (i - t) / (e - t)), i * i * (3 - 2 * i));
}
function Nc(i, t, e) {
  return i <= t
    ? 0
    : i >= e
      ? 1
      : ((i = (i - t) / (e - t)), i * i * i * (i * (i * 6 - 15) + 10));
}
function Fc(i, t) {
  return i + Math.floor(Math.random() * (t - i + 1));
}
function zc(i, t) {
  return i + Math.random() * (t - i);
}
function Oc(i) {
  return i * (0.5 - Math.random());
}
function Bc(i) {
  i !== void 0 && (Qa = i);
  let t = (Qa += 1831565813);
  return (
    (t = Math.imul(t ^ (t >>> 15), t | 1)),
    (t ^= t + Math.imul(t ^ (t >>> 7), t | 61)),
    ((t ^ (t >>> 14)) >>> 0) / 4294967296
  );
}
function kc(i) {
  return i * Ki;
}
function Hc(i) {
  return i * ts;
}
function Vc(i) {
  return (i & (i - 1)) === 0 && i !== 0;
}
function Gc(i) {
  return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2));
}
function Wc(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function qc(i, t, e, n, s) {
  const r = Math.cos,
    a = Math.sin,
    l = r(e / 2),
    o = a(e / 2),
    c = r((t + n) / 2),
    h = a((t + n) / 2),
    d = r((t - n) / 2),
    u = a((t - n) / 2),
    m = r((n - t) / 2),
    g = a((n - t) / 2);
  switch (s) {
    case "XYX":
      i.set(l * h, o * d, o * u, l * c);
      break;
    case "YZY":
      i.set(o * u, l * h, o * d, l * c);
      break;
    case "ZXZ":
      i.set(o * d, o * u, l * h, l * c);
      break;
    case "XZX":
      i.set(l * h, o * g, o * m, l * c);
      break;
    case "YXY":
      i.set(o * m, l * h, o * g, l * c);
      break;
    case "ZYZ":
      i.set(o * g, o * m, l * h, l * c);
      break;
    default:
      console.warn(
        "THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " +
          s,
      );
  }
}
function yi(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function we(i, t) {
  switch (t.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const jt = {
  DEG2RAD: Ki,
  RAD2DEG: ts,
  generateUUID: Ni,
  clamp: Re,
  euclideanModulo: Ca,
  mapLinear: Pc,
  inverseLerp: Lc,
  lerp: $i,
  damp: Dc,
  pingpong: Uc,
  smoothstep: Ic,
  smootherstep: Nc,
  randInt: Fc,
  randFloat: zc,
  randFloatSpread: Oc,
  seededRandom: Bc,
  degToRad: kc,
  radToDeg: Hc,
  isPowerOfTwo: Vc,
  ceilPowerOfTwo: Gc,
  floorPowerOfTwo: Wc,
  setQuaternionFromProperEuler: qc,
  normalize: we,
  denormalize: yi,
};
class It {
  constructor(t = 0, e = 0) {
    ((It.prototype.isVector2 = !0), (this.x = t), (this.y = e));
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  set(t, e) {
    return ((this.x = t), (this.y = e), this);
  }
  setScalar(t) {
    return ((this.x = t), (this.y = t), this);
  }
  setX(t) {
    return ((this.x = t), this);
  }
  setY(t) {
    return ((this.y = t), this);
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y);
  }
  copy(t) {
    return ((this.x = t.x), (this.y = t.y), this);
  }
  add(t) {
    return ((this.x += t.x), (this.y += t.y), this);
  }
  addScalar(t) {
    return ((this.x += t), (this.y += t), this);
  }
  addVectors(t, e) {
    return ((this.x = t.x + e.x), (this.y = t.y + e.y), this);
  }
  addScaledVector(t, e) {
    return ((this.x += t.x * e), (this.y += t.y * e), this);
  }
  sub(t) {
    return ((this.x -= t.x), (this.y -= t.y), this);
  }
  subScalar(t) {
    return ((this.x -= t), (this.y -= t), this);
  }
  subVectors(t, e) {
    return ((this.x = t.x - e.x), (this.y = t.y - e.y), this);
  }
  multiply(t) {
    return ((this.x *= t.x), (this.y *= t.y), this);
  }
  multiplyScalar(t) {
    return ((this.x *= t), (this.y *= t), this);
  }
  divide(t) {
    return ((this.x /= t.x), (this.y /= t.y), this);
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  applyMatrix3(t) {
    const e = this.x,
      n = this.y,
      s = t.elements;
    return (
      (this.x = s[0] * e + s[3] * n + s[6]),
      (this.y = s[1] * e + s[4] * n + s[7]),
      this
    );
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)),
      (this.y = Math.min(this.y, t.y)),
      this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)),
      (this.y = Math.max(this.y, t.y)),
      this
    );
  }
  clamp(t, e) {
    return (
      (this.x = Math.max(t.x, Math.min(e.x, this.x))),
      (this.y = Math.max(t.y, Math.min(e.y, this.y))),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = Math.max(t, Math.min(e, this.x))),
      (this.y = Math.max(t, Math.min(e, this.y))),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(t, Math.min(e, n)),
    );
  }
  floor() {
    return ((this.x = Math.floor(this.x)), (this.y = Math.floor(this.y)), this);
  }
  ceil() {
    return ((this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this);
  }
  round() {
    return ((this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this);
  }
  roundToZero() {
    return ((this.x = Math.trunc(this.x)), (this.y = Math.trunc(this.y)), this);
  }
  negate() {
    return ((this.x = -this.x), (this.y = -this.y), this);
  }
  dot(t) {
    return this.x * t.x + this.y * t.y;
  }
  cross(t) {
    return this.x * t.y - this.y * t.x;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Re(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x,
      n = this.y - t.y;
    return e * e + n * n;
  }
  manhattanDistanceTo(t) {
    return Math.abs(this.x - t.x) + Math.abs(this.y - t.y);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (
      (this.x += (t.x - this.x) * e),
      (this.y += (t.y - this.y) * e),
      this
    );
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n),
      (this.y = t.y + (e.y - t.y) * n),
      this
    );
  }
  equals(t) {
    return t.x === this.x && t.y === this.y;
  }
  fromArray(t, e = 0) {
    return ((this.x = t[e]), (this.y = t[e + 1]), this);
  }
  toArray(t = [], e = 0) {
    return ((t[e] = this.x), (t[e + 1] = this.y), t);
  }
  fromBufferAttribute(t, e) {
    return ((this.x = t.getX(e)), (this.y = t.getY(e)), this);
  }
  rotateAround(t, e) {
    const n = Math.cos(e),
      s = Math.sin(e),
      r = this.x - t.x,
      a = this.y - t.y;
    return (
      (this.x = r * n - a * s + t.x),
      (this.y = r * s + a * n + t.y),
      this
    );
  }
  random() {
    return ((this.x = Math.random()), (this.y = Math.random()), this);
  }
  *[Symbol.iterator]() {
    (yield this.x, yield this.y);
  }
}
class zt {
  constructor(t, e, n, s, r, a, l, o, c) {
    ((zt.prototype.isMatrix3 = !0),
      (this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
      t !== void 0 && this.set(t, e, n, s, r, a, l, o, c));
  }
  set(t, e, n, s, r, a, l, o, c) {
    const h = this.elements;
    return (
      (h[0] = t),
      (h[1] = s),
      (h[2] = l),
      (h[3] = e),
      (h[4] = r),
      (h[5] = o),
      (h[6] = n),
      (h[7] = a),
      (h[8] = c),
      this
    );
  }
  identity() {
    return (this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this);
  }
  copy(t) {
    const e = this.elements,
      n = t.elements;
    return (
      (e[0] = n[0]),
      (e[1] = n[1]),
      (e[2] = n[2]),
      (e[3] = n[3]),
      (e[4] = n[4]),
      (e[5] = n[5]),
      (e[6] = n[6]),
      (e[7] = n[7]),
      (e[8] = n[8]),
      this
    );
  }
  extractBasis(t, e, n) {
    return (
      t.setFromMatrix3Column(this, 0),
      e.setFromMatrix3Column(this, 1),
      n.setFromMatrix3Column(this, 2),
      this
    );
  }
  setFromMatrix4(t) {
    const e = t.elements;
    return (
      this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]),
      this
    );
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements,
      s = e.elements,
      r = this.elements,
      a = n[0],
      l = n[3],
      o = n[6],
      c = n[1],
      h = n[4],
      d = n[7],
      u = n[2],
      m = n[5],
      g = n[8],
      v = s[0],
      p = s[3],
      f = s[6],
      w = s[1],
      M = s[4],
      _ = s[7],
      L = s[2],
      R = s[5],
      A = s[8];
    return (
      (r[0] = a * v + l * w + o * L),
      (r[3] = a * p + l * M + o * R),
      (r[6] = a * f + l * _ + o * A),
      (r[1] = c * v + h * w + d * L),
      (r[4] = c * p + h * M + d * R),
      (r[7] = c * f + h * _ + d * A),
      (r[2] = u * v + m * w + g * L),
      (r[5] = u * p + m * M + g * R),
      (r[8] = u * f + m * _ + g * A),
      this
    );
  }
  multiplyScalar(t) {
    const e = this.elements;
    return (
      (e[0] *= t),
      (e[3] *= t),
      (e[6] *= t),
      (e[1] *= t),
      (e[4] *= t),
      (e[7] *= t),
      (e[2] *= t),
      (e[5] *= t),
      (e[8] *= t),
      this
    );
  }
  determinant() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      s = t[2],
      r = t[3],
      a = t[4],
      l = t[5],
      o = t[6],
      c = t[7],
      h = t[8];
    return (
      e * a * h - e * l * c - n * r * h + n * l * o + s * r * c - s * a * o
    );
  }
  invert() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      s = t[2],
      r = t[3],
      a = t[4],
      l = t[5],
      o = t[6],
      c = t[7],
      h = t[8],
      d = h * a - l * c,
      u = l * o - h * r,
      m = c * r - a * o,
      g = e * d + n * u + s * m;
    if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const v = 1 / g;
    return (
      (t[0] = d * v),
      (t[1] = (s * c - h * n) * v),
      (t[2] = (l * n - s * a) * v),
      (t[3] = u * v),
      (t[4] = (h * e - s * o) * v),
      (t[5] = (s * r - l * e) * v),
      (t[6] = m * v),
      (t[7] = (n * o - c * e) * v),
      (t[8] = (a * e - n * r) * v),
      this
    );
  }
  transpose() {
    let t;
    const e = this.elements;
    return (
      (t = e[1]),
      (e[1] = e[3]),
      (e[3] = t),
      (t = e[2]),
      (e[2] = e[6]),
      (e[6] = t),
      (t = e[5]),
      (e[5] = e[7]),
      (e[7] = t),
      this
    );
  }
  getNormalMatrix(t) {
    return this.setFromMatrix4(t).invert().transpose();
  }
  transposeIntoArray(t) {
    const e = this.elements;
    return (
      (t[0] = e[0]),
      (t[1] = e[3]),
      (t[2] = e[6]),
      (t[3] = e[1]),
      (t[4] = e[4]),
      (t[5] = e[7]),
      (t[6] = e[2]),
      (t[7] = e[5]),
      (t[8] = e[8]),
      this
    );
  }
  setUvTransform(t, e, n, s, r, a, l) {
    const o = Math.cos(r),
      c = Math.sin(r);
    return (
      this.set(
        n * o,
        n * c,
        -n * (o * a + c * l) + a + t,
        -s * c,
        s * o,
        -s * (-c * a + o * l) + l + e,
        0,
        0,
        1,
      ),
      this
    );
  }
  scale(t, e) {
    return (this.premultiply(Ks.makeScale(t, e)), this);
  }
  rotate(t) {
    return (this.premultiply(Ks.makeRotation(-t)), this);
  }
  translate(t, e) {
    return (this.premultiply(Ks.makeTranslation(t, e)), this);
  }
  makeTranslation(t, e) {
    return (
      t.isVector2
        ? this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1)
        : this.set(1, 0, t, 0, 1, e, 0, 0, 1),
      this
    );
  }
  makeRotation(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return (this.set(e, -n, 0, n, e, 0, 0, 0, 1), this);
  }
  makeScale(t, e) {
    return (this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this);
  }
  equals(t) {
    const e = this.elements,
      n = t.elements;
    for (let s = 0; s < 9; s++) if (e[s] !== n[s]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 9; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return (
      (t[e] = n[0]),
      (t[e + 1] = n[1]),
      (t[e + 2] = n[2]),
      (t[e + 3] = n[3]),
      (t[e + 4] = n[4]),
      (t[e + 5] = n[5]),
      (t[e + 6] = n[6]),
      (t[e + 7] = n[7]),
      (t[e + 8] = n[8]),
      t
    );
  }
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Ks = new zt();
function yl(i) {
  for (let t = i.length - 1; t >= 0; --t) if (i[t] >= 65535) return !0;
  return !1;
}
function Bs(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function Xc() {
  const i = Bs("canvas");
  return ((i.style.display = "block"), i);
}
const to = {};
function Yi(i) {
  i in to || ((to[i] = !0), console.warn(i));
}
function Yc(i, t, e) {
  return new Promise(function (n, s) {
    function r() {
      switch (i.clientWaitSync(t, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          s();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(r, e);
          break;
        default:
          n();
      }
    }
    setTimeout(r, e);
  });
}
function jc(i) {
  const t = i.elements;
  ((t[2] = 0.5 * t[2] + 0.5 * t[3]),
    (t[6] = 0.5 * t[6] + 0.5 * t[7]),
    (t[10] = 0.5 * t[10] + 0.5 * t[11]),
    (t[14] = 0.5 * t[14] + 0.5 * t[15]));
}
function Kc(i) {
  const t = i.elements;
  t[11] === -1
    ? ((t[10] = -t[10] - 1), (t[14] = -t[14]))
    : ((t[10] = -t[10]), (t[14] = -t[14] + 1));
}
const Xt = {
  enabled: !0,
  workingColorSpace: Ui,
  spaces: {},
  convert: function (i, t, e) {
    return (
      this.enabled === !1 ||
        t === e ||
        !t ||
        !e ||
        (this.spaces[t].transfer === Qt &&
          ((i.r = xn(i.r)), (i.g = xn(i.g)), (i.b = xn(i.b))),
        this.spaces[t].primaries !== this.spaces[e].primaries &&
          (i.applyMatrix3(this.spaces[t].toXYZ),
          i.applyMatrix3(this.spaces[e].fromXYZ)),
        this.spaces[e].transfer === Qt &&
          ((i.r = Ti(i.r)), (i.g = Ti(i.g)), (i.b = Ti(i.b)))),
      i
    );
  },
  fromWorkingColorSpace: function (i, t) {
    return this.convert(i, this.workingColorSpace, t);
  },
  toWorkingColorSpace: function (i, t) {
    return this.convert(i, t, this.workingColorSpace);
  },
  getPrimaries: function (i) {
    return this.spaces[i].primaries;
  },
  getTransfer: function (i) {
    return i === Un ? Gs : this.spaces[i].transfer;
  },
  getLuminanceCoefficients: function (i, t = this.workingColorSpace) {
    return i.fromArray(this.spaces[t].luminanceCoefficients);
  },
  define: function (i) {
    Object.assign(this.spaces, i);
  },
  _getMatrix: function (i, t, e) {
    return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ);
  },
  _getDrawingBufferColorSpace: function (i) {
    return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace;
  },
  _getUnpackColorSpace: function (i = this.workingColorSpace) {
    return this.spaces[i].workingColorSpaceConfig.unpackColorSpace;
  },
};
function xn(i) {
  return i < 0.04045
    ? i * 0.0773993808
    : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function Ti(i) {
  return i < 0.0031308 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
const eo = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
  no = [0.2126, 0.7152, 0.0722],
  io = [0.3127, 0.329],
  so = new zt().set(
    0.4123908,
    0.3575843,
    0.1804808,
    0.212639,
    0.7151687,
    0.0721923,
    0.0193308,
    0.1191948,
    0.9505322,
  ),
  ro = new zt().set(
    3.2409699,
    -1.5373832,
    -0.4986108,
    -0.9692436,
    1.8759675,
    0.0415551,
    0.0556301,
    -0.203977,
    1.0569715,
  );
Xt.define({
  [Ui]: {
    primaries: eo,
    whitePoint: io,
    transfer: Gs,
    toXYZ: so,
    fromXYZ: ro,
    luminanceCoefficients: no,
    workingColorSpaceConfig: { unpackColorSpace: Xe },
    outputColorSpaceConfig: { drawingBufferColorSpace: Xe },
  },
  [Xe]: {
    primaries: eo,
    whitePoint: io,
    transfer: Qt,
    toXYZ: so,
    fromXYZ: ro,
    luminanceCoefficients: no,
    outputColorSpaceConfig: { drawingBufferColorSpace: Xe },
  },
});
let ri;
class $c {
  static getDataURL(t) {
    if (/^data:/i.test(t.src) || typeof HTMLCanvasElement > "u") return t.src;
    let e;
    if (t instanceof HTMLCanvasElement) e = t;
    else {
      (ri === void 0 && (ri = Bs("canvas")),
        (ri.width = t.width),
        (ri.height = t.height));
      const n = ri.getContext("2d");
      (t instanceof ImageData
        ? n.putImageData(t, 0, 0)
        : n.drawImage(t, 0, 0, t.width, t.height),
        (e = ri));
    }
    return e.width > 2048 || e.height > 2048
      ? (console.warn(
          "THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",
          t,
        ),
        e.toDataURL("image/jpeg", 0.6))
      : e.toDataURL("image/png");
  }
  static sRGBToLinear(t) {
    if (
      (typeof HTMLImageElement < "u" && t instanceof HTMLImageElement) ||
      (typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement) ||
      (typeof ImageBitmap < "u" && t instanceof ImageBitmap)
    ) {
      const e = Bs("canvas");
      ((e.width = t.width), (e.height = t.height));
      const n = e.getContext("2d");
      n.drawImage(t, 0, 0, t.width, t.height);
      const s = n.getImageData(0, 0, t.width, t.height),
        r = s.data;
      for (let a = 0; a < r.length; a++) r[a] = xn(r[a] / 255) * 255;
      return (n.putImageData(s, 0, 0), e);
    } else if (t.data) {
      const e = t.data.slice(0);
      for (let n = 0; n < e.length; n++)
        e instanceof Uint8Array || e instanceof Uint8ClampedArray
          ? (e[n] = Math.floor(xn(e[n] / 255) * 255))
          : (e[n] = xn(e[n]));
      return { data: e, width: t.width, height: t.height };
    } else
      return (
        console.warn(
          "THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.",
        ),
        t
      );
  }
}
let Zc = 0;
class Sl {
  constructor(t = null) {
    ((this.isSource = !0),
      Object.defineProperty(this, "id", { value: Zc++ }),
      (this.uuid = Ni()),
      (this.data = t),
      (this.dataReady = !0),
      (this.version = 0));
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.images[this.uuid] !== void 0) return t.images[this.uuid];
    const n = { uuid: this.uuid, url: "" },
      s = this.data;
    if (s !== null) {
      let r;
      if (Array.isArray(s)) {
        r = [];
        for (let a = 0, l = s.length; a < l; a++)
          s[a].isDataTexture ? r.push($s(s[a].image)) : r.push($s(s[a]));
      } else r = $s(s);
      n.url = r;
    }
    return (e || (t.images[this.uuid] = n), n);
  }
}
function $s(i) {
  return (typeof HTMLImageElement < "u" && i instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement) ||
    (typeof ImageBitmap < "u" && i instanceof ImageBitmap)
    ? $c.getDataURL(i)
    : i.data
      ? {
          data: Array.from(i.data),
          width: i.width,
          height: i.height,
          type: i.data.constructor.name,
        }
      : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let Jc = 0;
class Pe extends Ii {
  constructor(
    t = Pe.DEFAULT_IMAGE,
    e = Pe.DEFAULT_MAPPING,
    n = jn,
    s = jn,
    r = Ne,
    a = Kn,
    l = tn,
    o = yn,
    c = Pe.DEFAULT_ANISOTROPY,
    h = Un,
  ) {
    (super(),
      (this.isTexture = !0),
      Object.defineProperty(this, "id", { value: Jc++ }),
      (this.uuid = Ni()),
      (this.name = ""),
      (this.source = new Sl(t)),
      (this.mipmaps = []),
      (this.mapping = e),
      (this.channel = 0),
      (this.wrapS = n),
      (this.wrapT = s),
      (this.magFilter = r),
      (this.minFilter = a),
      (this.anisotropy = c),
      (this.format = l),
      (this.internalFormat = null),
      (this.type = o),
      (this.offset = new It(0, 0)),
      (this.repeat = new It(1, 1)),
      (this.center = new It(0, 0)),
      (this.rotation = 0),
      (this.matrixAutoUpdate = !0),
      (this.matrix = new zt()),
      (this.generateMipmaps = !0),
      (this.premultiplyAlpha = !1),
      (this.flipY = !0),
      (this.unpackAlignment = 4),
      (this.colorSpace = h),
      (this.userData = {}),
      (this.version = 0),
      (this.onUpdate = null),
      (this.isRenderTargetTexture = !1),
      (this.pmremVersion = 0));
  }
  get image() {
    return this.source.data;
  }
  set image(t = null) {
    this.source.data = t;
  }
  updateMatrix() {
    this.matrix.setUvTransform(
      this.offset.x,
      this.offset.y,
      this.repeat.x,
      this.repeat.y,
      this.rotation,
      this.center.x,
      this.center.y,
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return (
      (this.name = t.name),
      (this.source = t.source),
      (this.mipmaps = t.mipmaps.slice(0)),
      (this.mapping = t.mapping),
      (this.channel = t.channel),
      (this.wrapS = t.wrapS),
      (this.wrapT = t.wrapT),
      (this.magFilter = t.magFilter),
      (this.minFilter = t.minFilter),
      (this.anisotropy = t.anisotropy),
      (this.format = t.format),
      (this.internalFormat = t.internalFormat),
      (this.type = t.type),
      this.offset.copy(t.offset),
      this.repeat.copy(t.repeat),
      this.center.copy(t.center),
      (this.rotation = t.rotation),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      this.matrix.copy(t.matrix),
      (this.generateMipmaps = t.generateMipmaps),
      (this.premultiplyAlpha = t.premultiplyAlpha),
      (this.flipY = t.flipY),
      (this.unpackAlignment = t.unpackAlignment),
      (this.colorSpace = t.colorSpace),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      (this.needsUpdate = !0),
      this
    );
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    if (!e && t.textures[this.uuid] !== void 0) return t.textures[this.uuid];
    const n = {
      metadata: { version: 4.6, type: "Texture", generator: "Texture.toJSON" },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(t).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment,
    };
    return (
      Object.keys(this.userData).length > 0 && (n.userData = this.userData),
      e || (t.textures[this.uuid] = n),
      n
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  transformUv(t) {
    if (this.mapping !== ll) return t;
    if ((t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1))
      switch (this.wrapS) {
        case Vr:
          t.x = t.x - Math.floor(t.x);
          break;
        case jn:
          t.x = t.x < 0 ? 0 : 1;
          break;
        case Gr:
          Math.abs(Math.floor(t.x) % 2) === 1
            ? (t.x = Math.ceil(t.x) - t.x)
            : (t.x = t.x - Math.floor(t.x));
          break;
      }
    if (t.y < 0 || t.y > 1)
      switch (this.wrapT) {
        case Vr:
          t.y = t.y - Math.floor(t.y);
          break;
        case jn:
          t.y = t.y < 0 ? 0 : 1;
          break;
        case Gr:
          Math.abs(Math.floor(t.y) % 2) === 1
            ? (t.y = Math.ceil(t.y) - t.y)
            : (t.y = t.y - Math.floor(t.y));
          break;
      }
    return (this.flipY && (t.y = 1 - t.y), t);
  }
  set needsUpdate(t) {
    t === !0 && (this.version++, (this.source.needsUpdate = !0));
  }
  set needsPMREMUpdate(t) {
    t === !0 && this.pmremVersion++;
  }
}
Pe.DEFAULT_IMAGE = null;
Pe.DEFAULT_MAPPING = ll;
Pe.DEFAULT_ANISOTROPY = 1;
class ee {
  constructor(t = 0, e = 0, n = 0, s = 1) {
    ((ee.prototype.isVector4 = !0),
      (this.x = t),
      (this.y = e),
      (this.z = n),
      (this.w = s));
  }
  get width() {
    return this.z;
  }
  set width(t) {
    this.z = t;
  }
  get height() {
    return this.w;
  }
  set height(t) {
    this.w = t;
  }
  set(t, e, n, s) {
    return ((this.x = t), (this.y = e), (this.z = n), (this.w = s), this);
  }
  setScalar(t) {
    return ((this.x = t), (this.y = t), (this.z = t), (this.w = t), this);
  }
  setX(t) {
    return ((this.x = t), this);
  }
  setY(t) {
    return ((this.y = t), this);
  }
  setZ(t) {
    return ((this.z = t), this);
  }
  setW(t) {
    return ((this.w = t), this);
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      case 3:
        this.w = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  copy(t) {
    return (
      (this.x = t.x),
      (this.y = t.y),
      (this.z = t.z),
      (this.w = t.w !== void 0 ? t.w : 1),
      this
    );
  }
  add(t) {
    return (
      (this.x += t.x),
      (this.y += t.y),
      (this.z += t.z),
      (this.w += t.w),
      this
    );
  }
  addScalar(t) {
    return ((this.x += t), (this.y += t), (this.z += t), (this.w += t), this);
  }
  addVectors(t, e) {
    return (
      (this.x = t.x + e.x),
      (this.y = t.y + e.y),
      (this.z = t.z + e.z),
      (this.w = t.w + e.w),
      this
    );
  }
  addScaledVector(t, e) {
    return (
      (this.x += t.x * e),
      (this.y += t.y * e),
      (this.z += t.z * e),
      (this.w += t.w * e),
      this
    );
  }
  sub(t) {
    return (
      (this.x -= t.x),
      (this.y -= t.y),
      (this.z -= t.z),
      (this.w -= t.w),
      this
    );
  }
  subScalar(t) {
    return ((this.x -= t), (this.y -= t), (this.z -= t), (this.w -= t), this);
  }
  subVectors(t, e) {
    return (
      (this.x = t.x - e.x),
      (this.y = t.y - e.y),
      (this.z = t.z - e.z),
      (this.w = t.w - e.w),
      this
    );
  }
  multiply(t) {
    return (
      (this.x *= t.x),
      (this.y *= t.y),
      (this.z *= t.z),
      (this.w *= t.w),
      this
    );
  }
  multiplyScalar(t) {
    return ((this.x *= t), (this.y *= t), (this.z *= t), (this.w *= t), this);
  }
  applyMatrix4(t) {
    const e = this.x,
      n = this.y,
      s = this.z,
      r = this.w,
      a = t.elements;
    return (
      (this.x = a[0] * e + a[4] * n + a[8] * s + a[12] * r),
      (this.y = a[1] * e + a[5] * n + a[9] * s + a[13] * r),
      (this.z = a[2] * e + a[6] * n + a[10] * s + a[14] * r),
      (this.w = a[3] * e + a[7] * n + a[11] * s + a[15] * r),
      this
    );
  }
  divide(t) {
    return (
      (this.x /= t.x),
      (this.y /= t.y),
      (this.z /= t.z),
      (this.w /= t.w),
      this
    );
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  setAxisAngleFromQuaternion(t) {
    this.w = 2 * Math.acos(t.w);
    const e = Math.sqrt(1 - t.w * t.w);
    return (
      e < 1e-4
        ? ((this.x = 1), (this.y = 0), (this.z = 0))
        : ((this.x = t.x / e), (this.y = t.y / e), (this.z = t.z / e)),
      this
    );
  }
  setAxisAngleFromRotationMatrix(t) {
    let e, n, s, r;
    const o = t.elements,
      c = o[0],
      h = o[4],
      d = o[8],
      u = o[1],
      m = o[5],
      g = o[9],
      v = o[2],
      p = o[6],
      f = o[10];
    if (
      Math.abs(h - u) < 0.01 &&
      Math.abs(d - v) < 0.01 &&
      Math.abs(g - p) < 0.01
    ) {
      if (
        Math.abs(h + u) < 0.1 &&
        Math.abs(d + v) < 0.1 &&
        Math.abs(g + p) < 0.1 &&
        Math.abs(c + m + f - 3) < 0.1
      )
        return (this.set(1, 0, 0, 0), this);
      e = Math.PI;
      const M = (c + 1) / 2,
        _ = (m + 1) / 2,
        L = (f + 1) / 2,
        R = (h + u) / 4,
        A = (d + v) / 4,
        C = (g + p) / 4;
      return (
        M > _ && M > L
          ? M < 0.01
            ? ((n = 0), (s = 0.707106781), (r = 0.707106781))
            : ((n = Math.sqrt(M)), (s = R / n), (r = A / n))
          : _ > L
            ? _ < 0.01
              ? ((n = 0.707106781), (s = 0), (r = 0.707106781))
              : ((s = Math.sqrt(_)), (n = R / s), (r = C / s))
            : L < 0.01
              ? ((n = 0.707106781), (s = 0.707106781), (r = 0))
              : ((r = Math.sqrt(L)), (n = A / r), (s = C / r)),
        this.set(n, s, r, e),
        this
      );
    }
    let w = Math.sqrt(
      (p - g) * (p - g) + (d - v) * (d - v) + (u - h) * (u - h),
    );
    return (
      Math.abs(w) < 0.001 && (w = 1),
      (this.x = (p - g) / w),
      (this.y = (d - v) / w),
      (this.z = (u - h) / w),
      (this.w = Math.acos((c + m + f - 1) / 2)),
      this
    );
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return (
      (this.x = e[12]),
      (this.y = e[13]),
      (this.z = e[14]),
      (this.w = e[15]),
      this
    );
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)),
      (this.y = Math.min(this.y, t.y)),
      (this.z = Math.min(this.z, t.z)),
      (this.w = Math.min(this.w, t.w)),
      this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)),
      (this.y = Math.max(this.y, t.y)),
      (this.z = Math.max(this.z, t.z)),
      (this.w = Math.max(this.w, t.w)),
      this
    );
  }
  clamp(t, e) {
    return (
      (this.x = Math.max(t.x, Math.min(e.x, this.x))),
      (this.y = Math.max(t.y, Math.min(e.y, this.y))),
      (this.z = Math.max(t.z, Math.min(e.z, this.z))),
      (this.w = Math.max(t.w, Math.min(e.w, this.w))),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = Math.max(t, Math.min(e, this.x))),
      (this.y = Math.max(t, Math.min(e, this.y))),
      (this.z = Math.max(t, Math.min(e, this.z))),
      (this.w = Math.max(t, Math.min(e, this.w))),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(t, Math.min(e, n)),
    );
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      (this.w = Math.floor(this.w)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      (this.w = Math.ceil(this.w)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      (this.w = Math.round(this.w)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = Math.trunc(this.x)),
      (this.y = Math.trunc(this.y)),
      (this.z = Math.trunc(this.z)),
      (this.w = Math.trunc(this.w)),
      this
    );
  }
  negate() {
    return (
      (this.x = -this.x),
      (this.y = -this.y),
      (this.z = -this.z),
      (this.w = -this.w),
      this
    );
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
  }
  lengthSq() {
    return (
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }
  length() {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
    );
  }
  manhattanLength() {
    return (
      Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w)
    );
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (
      (this.x += (t.x - this.x) * e),
      (this.y += (t.y - this.y) * e),
      (this.z += (t.z - this.z) * e),
      (this.w += (t.w - this.w) * e),
      this
    );
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n),
      (this.y = t.y + (e.y - t.y) * n),
      (this.z = t.z + (e.z - t.z) * n),
      (this.w = t.w + (e.w - t.w) * n),
      this
    );
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w;
  }
  fromArray(t, e = 0) {
    return (
      (this.x = t[e]),
      (this.y = t[e + 1]),
      (this.z = t[e + 2]),
      (this.w = t[e + 3]),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this.x),
      (t[e + 1] = this.y),
      (t[e + 2] = this.z),
      (t[e + 3] = this.w),
      t
    );
  }
  fromBufferAttribute(t, e) {
    return (
      (this.x = t.getX(e)),
      (this.y = t.getY(e)),
      (this.z = t.getZ(e)),
      (this.w = t.getW(e)),
      this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      (this.w = Math.random()),
      this
    );
  }
  *[Symbol.iterator]() {
    (yield this.x, yield this.y, yield this.z, yield this.w);
  }
}
class Qc extends Ii {
  constructor(t = 1, e = 1, n = {}) {
    (super(),
      (this.isRenderTarget = !0),
      (this.width = t),
      (this.height = e),
      (this.depth = 1),
      (this.scissor = new ee(0, 0, t, e)),
      (this.scissorTest = !1),
      (this.viewport = new ee(0, 0, t, e)));
    const s = { width: t, height: e, depth: 1 };
    n = Object.assign(
      {
        generateMipmaps: !1,
        internalFormat: null,
        minFilter: Ne,
        depthBuffer: !0,
        stencilBuffer: !1,
        resolveDepthBuffer: !0,
        resolveStencilBuffer: !0,
        depthTexture: null,
        samples: 0,
        count: 1,
      },
      n,
    );
    const r = new Pe(
      s,
      n.mapping,
      n.wrapS,
      n.wrapT,
      n.magFilter,
      n.minFilter,
      n.format,
      n.type,
      n.anisotropy,
      n.colorSpace,
    );
    ((r.flipY = !1),
      (r.generateMipmaps = n.generateMipmaps),
      (r.internalFormat = n.internalFormat),
      (this.textures = []));
    const a = n.count;
    for (let l = 0; l < a; l++)
      ((this.textures[l] = r.clone()),
        (this.textures[l].isRenderTargetTexture = !0));
    ((this.depthBuffer = n.depthBuffer),
      (this.stencilBuffer = n.stencilBuffer),
      (this.resolveDepthBuffer = n.resolveDepthBuffer),
      (this.resolveStencilBuffer = n.resolveStencilBuffer),
      (this.depthTexture = n.depthTexture),
      (this.samples = n.samples));
  }
  get texture() {
    return this.textures[0];
  }
  set texture(t) {
    this.textures[0] = t;
  }
  setSize(t, e, n = 1) {
    if (this.width !== t || this.height !== e || this.depth !== n) {
      ((this.width = t), (this.height = e), (this.depth = n));
      for (let s = 0, r = this.textures.length; s < r; s++)
        ((this.textures[s].image.width = t),
          (this.textures[s].image.height = e),
          (this.textures[s].image.depth = n));
      this.dispose();
    }
    (this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e));
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    ((this.width = t.width),
      (this.height = t.height),
      (this.depth = t.depth),
      this.scissor.copy(t.scissor),
      (this.scissorTest = t.scissorTest),
      this.viewport.copy(t.viewport),
      (this.textures.length = 0));
    for (let n = 0, s = t.textures.length; n < s; n++)
      ((this.textures[n] = t.textures[n].clone()),
        (this.textures[n].isRenderTargetTexture = !0));
    const e = Object.assign({}, t.texture.image);
    return (
      (this.texture.source = new Sl(e)),
      (this.depthBuffer = t.depthBuffer),
      (this.stencilBuffer = t.stencilBuffer),
      (this.resolveDepthBuffer = t.resolveDepthBuffer),
      (this.resolveStencilBuffer = t.resolveStencilBuffer),
      t.depthTexture !== null && (this.depthTexture = t.depthTexture.clone()),
      (this.samples = t.samples),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Sn extends Qc {
  constructor(t = 1, e = 1, n = {}) {
    (super(t, e, n), (this.isWebGLRenderTarget = !0));
  }
}
class El extends Pe {
  constructor(t = null, e = 1, n = 1, s = 1) {
    (super(null),
      (this.isDataArrayTexture = !0),
      (this.image = { data: t, width: e, height: n, depth: s }),
      (this.magFilter = ke),
      (this.minFilter = ke),
      (this.wrapR = jn),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1),
      (this.layerUpdates = new Set()));
  }
  addLayerUpdate(t) {
    this.layerUpdates.add(t);
  }
  clearLayerUpdates() {
    this.layerUpdates.clear();
  }
}
class th extends Pe {
  constructor(t = null, e = 1, n = 1, s = 1) {
    (super(null),
      (this.isData3DTexture = !0),
      (this.image = { data: t, width: e, height: n, depth: s }),
      (this.magFilter = ke),
      (this.minFilter = ke),
      (this.wrapR = jn),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1));
  }
}
class an {
  constructor(t = 0, e = 0, n = 0, s = 1) {
    ((this.isQuaternion = !0),
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._w = s));
  }
  static slerpFlat(t, e, n, s, r, a, l) {
    let o = n[s + 0],
      c = n[s + 1],
      h = n[s + 2],
      d = n[s + 3];
    const u = r[a + 0],
      m = r[a + 1],
      g = r[a + 2],
      v = r[a + 3];
    if (l === 0) {
      ((t[e + 0] = o), (t[e + 1] = c), (t[e + 2] = h), (t[e + 3] = d));
      return;
    }
    if (l === 1) {
      ((t[e + 0] = u), (t[e + 1] = m), (t[e + 2] = g), (t[e + 3] = v));
      return;
    }
    if (d !== v || o !== u || c !== m || h !== g) {
      let p = 1 - l;
      const f = o * u + c * m + h * g + d * v,
        w = f >= 0 ? 1 : -1,
        M = 1 - f * f;
      if (M > Number.EPSILON) {
        const L = Math.sqrt(M),
          R = Math.atan2(L, f * w);
        ((p = Math.sin(p * R) / L), (l = Math.sin(l * R) / L));
      }
      const _ = l * w;
      if (
        ((o = o * p + u * _),
        (c = c * p + m * _),
        (h = h * p + g * _),
        (d = d * p + v * _),
        p === 1 - l)
      ) {
        const L = 1 / Math.sqrt(o * o + c * c + h * h + d * d);
        ((o *= L), (c *= L), (h *= L), (d *= L));
      }
    }
    ((t[e] = o), (t[e + 1] = c), (t[e + 2] = h), (t[e + 3] = d));
  }
  static multiplyQuaternionsFlat(t, e, n, s, r, a) {
    const l = n[s],
      o = n[s + 1],
      c = n[s + 2],
      h = n[s + 3],
      d = r[a],
      u = r[a + 1],
      m = r[a + 2],
      g = r[a + 3];
    return (
      (t[e] = l * g + h * d + o * m - c * u),
      (t[e + 1] = o * g + h * u + c * d - l * m),
      (t[e + 2] = c * g + h * m + l * u - o * d),
      (t[e + 3] = h * g - l * d - o * u - c * m),
      t
    );
  }
  get x() {
    return this._x;
  }
  set x(t) {
    ((this._x = t), this._onChangeCallback());
  }
  get y() {
    return this._y;
  }
  set y(t) {
    ((this._y = t), this._onChangeCallback());
  }
  get z() {
    return this._z;
  }
  set z(t) {
    ((this._z = t), this._onChangeCallback());
  }
  get w() {
    return this._w;
  }
  set w(t) {
    ((this._w = t), this._onChangeCallback());
  }
  set(t, e, n, s) {
    return (
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._w = s),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  copy(t) {
    return (
      (this._x = t.x),
      (this._y = t.y),
      (this._z = t.z),
      (this._w = t.w),
      this._onChangeCallback(),
      this
    );
  }
  setFromEuler(t, e = !0) {
    const n = t._x,
      s = t._y,
      r = t._z,
      a = t._order,
      l = Math.cos,
      o = Math.sin,
      c = l(n / 2),
      h = l(s / 2),
      d = l(r / 2),
      u = o(n / 2),
      m = o(s / 2),
      g = o(r / 2);
    switch (a) {
      case "XYZ":
        ((this._x = u * h * d + c * m * g),
          (this._y = c * m * d - u * h * g),
          (this._z = c * h * g + u * m * d),
          (this._w = c * h * d - u * m * g));
        break;
      case "YXZ":
        ((this._x = u * h * d + c * m * g),
          (this._y = c * m * d - u * h * g),
          (this._z = c * h * g - u * m * d),
          (this._w = c * h * d + u * m * g));
        break;
      case "ZXY":
        ((this._x = u * h * d - c * m * g),
          (this._y = c * m * d + u * h * g),
          (this._z = c * h * g + u * m * d),
          (this._w = c * h * d - u * m * g));
        break;
      case "ZYX":
        ((this._x = u * h * d - c * m * g),
          (this._y = c * m * d + u * h * g),
          (this._z = c * h * g - u * m * d),
          (this._w = c * h * d + u * m * g));
        break;
      case "YZX":
        ((this._x = u * h * d + c * m * g),
          (this._y = c * m * d + u * h * g),
          (this._z = c * h * g - u * m * d),
          (this._w = c * h * d - u * m * g));
        break;
      case "XZY":
        ((this._x = u * h * d - c * m * g),
          (this._y = c * m * d - u * h * g),
          (this._z = c * h * g + u * m * d),
          (this._w = c * h * d + u * m * g));
        break;
      default:
        console.warn(
          "THREE.Quaternion: .setFromEuler() encountered an unknown order: " +
            a,
        );
    }
    return (e === !0 && this._onChangeCallback(), this);
  }
  setFromAxisAngle(t, e) {
    const n = e / 2,
      s = Math.sin(n);
    return (
      (this._x = t.x * s),
      (this._y = t.y * s),
      (this._z = t.z * s),
      (this._w = Math.cos(n)),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(t) {
    const e = t.elements,
      n = e[0],
      s = e[4],
      r = e[8],
      a = e[1],
      l = e[5],
      o = e[9],
      c = e[2],
      h = e[6],
      d = e[10],
      u = n + l + d;
    if (u > 0) {
      const m = 0.5 / Math.sqrt(u + 1);
      ((this._w = 0.25 / m),
        (this._x = (h - o) * m),
        (this._y = (r - c) * m),
        (this._z = (a - s) * m));
    } else if (n > l && n > d) {
      const m = 2 * Math.sqrt(1 + n - l - d);
      ((this._w = (h - o) / m),
        (this._x = 0.25 * m),
        (this._y = (s + a) / m),
        (this._z = (r + c) / m));
    } else if (l > d) {
      const m = 2 * Math.sqrt(1 + l - n - d);
      ((this._w = (r - c) / m),
        (this._x = (s + a) / m),
        (this._y = 0.25 * m),
        (this._z = (o + h) / m));
    } else {
      const m = 2 * Math.sqrt(1 + d - n - l);
      ((this._w = (a - s) / m),
        (this._x = (r + c) / m),
        (this._y = (o + h) / m),
        (this._z = 0.25 * m));
    }
    return (this._onChangeCallback(), this);
  }
  setFromUnitVectors(t, e) {
    let n = t.dot(e) + 1;
    return (
      n < Number.EPSILON
        ? ((n = 0),
          Math.abs(t.x) > Math.abs(t.z)
            ? ((this._x = -t.y), (this._y = t.x), (this._z = 0), (this._w = n))
            : ((this._x = 0), (this._y = -t.z), (this._z = t.y), (this._w = n)))
        : ((this._x = t.y * e.z - t.z * e.y),
          (this._y = t.z * e.x - t.x * e.z),
          (this._z = t.x * e.y - t.y * e.x),
          (this._w = n)),
      this.normalize()
    );
  }
  angleTo(t) {
    return 2 * Math.acos(Math.abs(Re(this.dot(t), -1, 1)));
  }
  rotateTowards(t, e) {
    const n = this.angleTo(t);
    if (n === 0) return this;
    const s = Math.min(1, e / n);
    return (this.slerp(t, s), this);
  }
  identity() {
    return this.set(0, 0, 0, 1);
  }
  invert() {
    return this.conjugate();
  }
  conjugate() {
    return (
      (this._x *= -1),
      (this._y *= -1),
      (this._z *= -1),
      this._onChangeCallback(),
      this
    );
  }
  dot(t) {
    return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w;
  }
  lengthSq() {
    return (
      this._x * this._x +
      this._y * this._y +
      this._z * this._z +
      this._w * this._w
    );
  }
  length() {
    return Math.sqrt(
      this._x * this._x +
        this._y * this._y +
        this._z * this._z +
        this._w * this._w,
    );
  }
  normalize() {
    let t = this.length();
    return (
      t === 0
        ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
        : ((t = 1 / t),
          (this._x = this._x * t),
          (this._y = this._y * t),
          (this._z = this._z * t),
          (this._w = this._w * t)),
      this._onChangeCallback(),
      this
    );
  }
  multiply(t) {
    return this.multiplyQuaternions(this, t);
  }
  premultiply(t) {
    return this.multiplyQuaternions(t, this);
  }
  multiplyQuaternions(t, e) {
    const n = t._x,
      s = t._y,
      r = t._z,
      a = t._w,
      l = e._x,
      o = e._y,
      c = e._z,
      h = e._w;
    return (
      (this._x = n * h + a * l + s * c - r * o),
      (this._y = s * h + a * o + r * l - n * c),
      (this._z = r * h + a * c + n * o - s * l),
      (this._w = a * h - n * l - s * o - r * c),
      this._onChangeCallback(),
      this
    );
  }
  slerp(t, e) {
    if (e === 0) return this;
    if (e === 1) return this.copy(t);
    const n = this._x,
      s = this._y,
      r = this._z,
      a = this._w;
    let l = a * t._w + n * t._x + s * t._y + r * t._z;
    if (
      (l < 0
        ? ((this._w = -t._w),
          (this._x = -t._x),
          (this._y = -t._y),
          (this._z = -t._z),
          (l = -l))
        : this.copy(t),
      l >= 1)
    )
      return ((this._w = a), (this._x = n), (this._y = s), (this._z = r), this);
    const o = 1 - l * l;
    if (o <= Number.EPSILON) {
      const m = 1 - e;
      return (
        (this._w = m * a + e * this._w),
        (this._x = m * n + e * this._x),
        (this._y = m * s + e * this._y),
        (this._z = m * r + e * this._z),
        this.normalize(),
        this
      );
    }
    const c = Math.sqrt(o),
      h = Math.atan2(c, l),
      d = Math.sin((1 - e) * h) / c,
      u = Math.sin(e * h) / c;
    return (
      (this._w = a * d + this._w * u),
      (this._x = n * d + this._x * u),
      (this._y = s * d + this._y * u),
      (this._z = r * d + this._z * u),
      this._onChangeCallback(),
      this
    );
  }
  slerpQuaternions(t, e, n) {
    return this.copy(t).slerp(e, n);
  }
  random() {
    const t = 2 * Math.PI * Math.random(),
      e = 2 * Math.PI * Math.random(),
      n = Math.random(),
      s = Math.sqrt(1 - n),
      r = Math.sqrt(n);
    return this.set(
      s * Math.sin(t),
      s * Math.cos(t),
      r * Math.sin(e),
      r * Math.cos(e),
    );
  }
  equals(t) {
    return (
      t._x === this._x &&
      t._y === this._y &&
      t._z === this._z &&
      t._w === this._w
    );
  }
  fromArray(t, e = 0) {
    return (
      (this._x = t[e]),
      (this._y = t[e + 1]),
      (this._z = t[e + 2]),
      (this._w = t[e + 3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this._x),
      (t[e + 1] = this._y),
      (t[e + 2] = this._z),
      (t[e + 3] = this._w),
      t
    );
  }
  fromBufferAttribute(t, e) {
    return (
      (this._x = t.getX(e)),
      (this._y = t.getY(e)),
      (this._z = t.getZ(e)),
      (this._w = t.getW(e)),
      this._onChangeCallback(),
      this
    );
  }
  toJSON() {
    return this.toArray();
  }
  _onChange(t) {
    return ((this._onChangeCallback = t), this);
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    (yield this._x, yield this._y, yield this._z, yield this._w);
  }
}
class b {
  constructor(t = 0, e = 0, n = 0) {
    ((b.prototype.isVector3 = !0), (this.x = t), (this.y = e), (this.z = n));
  }
  set(t, e, n) {
    return (
      n === void 0 && (n = this.z),
      (this.x = t),
      (this.y = e),
      (this.z = n),
      this
    );
  }
  setScalar(t) {
    return ((this.x = t), (this.y = t), (this.z = t), this);
  }
  setX(t) {
    return ((this.x = t), this);
  }
  setY(t) {
    return ((this.y = t), this);
  }
  setZ(t) {
    return ((this.z = t), this);
  }
  setComponent(t, e) {
    switch (t) {
      case 0:
        this.x = e;
        break;
      case 1:
        this.y = e;
        break;
      case 2:
        this.z = e;
        break;
      default:
        throw new Error("index is out of range: " + t);
    }
    return this;
  }
  getComponent(t) {
    switch (t) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + t);
    }
  }
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  copy(t) {
    return ((this.x = t.x), (this.y = t.y), (this.z = t.z), this);
  }
  add(t) {
    return ((this.x += t.x), (this.y += t.y), (this.z += t.z), this);
  }
  addScalar(t) {
    return ((this.x += t), (this.y += t), (this.z += t), this);
  }
  addVectors(t, e) {
    return (
      (this.x = t.x + e.x),
      (this.y = t.y + e.y),
      (this.z = t.z + e.z),
      this
    );
  }
  addScaledVector(t, e) {
    return (
      (this.x += t.x * e),
      (this.y += t.y * e),
      (this.z += t.z * e),
      this
    );
  }
  sub(t) {
    return ((this.x -= t.x), (this.y -= t.y), (this.z -= t.z), this);
  }
  subScalar(t) {
    return ((this.x -= t), (this.y -= t), (this.z -= t), this);
  }
  subVectors(t, e) {
    return (
      (this.x = t.x - e.x),
      (this.y = t.y - e.y),
      (this.z = t.z - e.z),
      this
    );
  }
  multiply(t) {
    return ((this.x *= t.x), (this.y *= t.y), (this.z *= t.z), this);
  }
  multiplyScalar(t) {
    return ((this.x *= t), (this.y *= t), (this.z *= t), this);
  }
  multiplyVectors(t, e) {
    return (
      (this.x = t.x * e.x),
      (this.y = t.y * e.y),
      (this.z = t.z * e.z),
      this
    );
  }
  applyEuler(t) {
    return this.applyQuaternion(ao.setFromEuler(t));
  }
  applyAxisAngle(t, e) {
    return this.applyQuaternion(ao.setFromAxisAngle(t, e));
  }
  applyMatrix3(t) {
    const e = this.x,
      n = this.y,
      s = this.z,
      r = t.elements;
    return (
      (this.x = r[0] * e + r[3] * n + r[6] * s),
      (this.y = r[1] * e + r[4] * n + r[7] * s),
      (this.z = r[2] * e + r[5] * n + r[8] * s),
      this
    );
  }
  applyNormalMatrix(t) {
    return this.applyMatrix3(t).normalize();
  }
  applyMatrix4(t) {
    const e = this.x,
      n = this.y,
      s = this.z,
      r = t.elements,
      a = 1 / (r[3] * e + r[7] * n + r[11] * s + r[15]);
    return (
      (this.x = (r[0] * e + r[4] * n + r[8] * s + r[12]) * a),
      (this.y = (r[1] * e + r[5] * n + r[9] * s + r[13]) * a),
      (this.z = (r[2] * e + r[6] * n + r[10] * s + r[14]) * a),
      this
    );
  }
  applyQuaternion(t) {
    const e = this.x,
      n = this.y,
      s = this.z,
      r = t.x,
      a = t.y,
      l = t.z,
      o = t.w,
      c = 2 * (a * s - l * n),
      h = 2 * (l * e - r * s),
      d = 2 * (r * n - a * e);
    return (
      (this.x = e + o * c + a * d - l * h),
      (this.y = n + o * h + l * c - r * d),
      (this.z = s + o * d + r * h - a * c),
      this
    );
  }
  project(t) {
    return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(
      t.projectionMatrix,
    );
  }
  unproject(t) {
    return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(
      t.matrixWorld,
    );
  }
  transformDirection(t) {
    const e = this.x,
      n = this.y,
      s = this.z,
      r = t.elements;
    return (
      (this.x = r[0] * e + r[4] * n + r[8] * s),
      (this.y = r[1] * e + r[5] * n + r[9] * s),
      (this.z = r[2] * e + r[6] * n + r[10] * s),
      this.normalize()
    );
  }
  divide(t) {
    return ((this.x /= t.x), (this.y /= t.y), (this.z /= t.z), this);
  }
  divideScalar(t) {
    return this.multiplyScalar(1 / t);
  }
  min(t) {
    return (
      (this.x = Math.min(this.x, t.x)),
      (this.y = Math.min(this.y, t.y)),
      (this.z = Math.min(this.z, t.z)),
      this
    );
  }
  max(t) {
    return (
      (this.x = Math.max(this.x, t.x)),
      (this.y = Math.max(this.y, t.y)),
      (this.z = Math.max(this.z, t.z)),
      this
    );
  }
  clamp(t, e) {
    return (
      (this.x = Math.max(t.x, Math.min(e.x, this.x))),
      (this.y = Math.max(t.y, Math.min(e.y, this.y))),
      (this.z = Math.max(t.z, Math.min(e.z, this.z))),
      this
    );
  }
  clampScalar(t, e) {
    return (
      (this.x = Math.max(t, Math.min(e, this.x))),
      (this.y = Math.max(t, Math.min(e, this.y))),
      (this.z = Math.max(t, Math.min(e, this.z))),
      this
    );
  }
  clampLength(t, e) {
    const n = this.length();
    return this.divideScalar(n || 1).multiplyScalar(
      Math.max(t, Math.min(e, n)),
    );
  }
  floor() {
    return (
      (this.x = Math.floor(this.x)),
      (this.y = Math.floor(this.y)),
      (this.z = Math.floor(this.z)),
      this
    );
  }
  ceil() {
    return (
      (this.x = Math.ceil(this.x)),
      (this.y = Math.ceil(this.y)),
      (this.z = Math.ceil(this.z)),
      this
    );
  }
  round() {
    return (
      (this.x = Math.round(this.x)),
      (this.y = Math.round(this.y)),
      (this.z = Math.round(this.z)),
      this
    );
  }
  roundToZero() {
    return (
      (this.x = Math.trunc(this.x)),
      (this.y = Math.trunc(this.y)),
      (this.z = Math.trunc(this.z)),
      this
    );
  }
  negate() {
    return ((this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this);
  }
  dot(t) {
    return this.x * t.x + this.y * t.y + this.z * t.z;
  }
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  setLength(t) {
    return this.normalize().multiplyScalar(t);
  }
  lerp(t, e) {
    return (
      (this.x += (t.x - this.x) * e),
      (this.y += (t.y - this.y) * e),
      (this.z += (t.z - this.z) * e),
      this
    );
  }
  lerpVectors(t, e, n) {
    return (
      (this.x = t.x + (e.x - t.x) * n),
      (this.y = t.y + (e.y - t.y) * n),
      (this.z = t.z + (e.z - t.z) * n),
      this
    );
  }
  cross(t) {
    return this.crossVectors(this, t);
  }
  crossVectors(t, e) {
    const n = t.x,
      s = t.y,
      r = t.z,
      a = e.x,
      l = e.y,
      o = e.z;
    return (
      (this.x = s * o - r * l),
      (this.y = r * a - n * o),
      (this.z = n * l - s * a),
      this
    );
  }
  projectOnVector(t) {
    const e = t.lengthSq();
    if (e === 0) return this.set(0, 0, 0);
    const n = t.dot(this) / e;
    return this.copy(t).multiplyScalar(n);
  }
  projectOnPlane(t) {
    return (Zs.copy(this).projectOnVector(t), this.sub(Zs));
  }
  reflect(t) {
    return this.sub(Zs.copy(t).multiplyScalar(2 * this.dot(t)));
  }
  angleTo(t) {
    const e = Math.sqrt(this.lengthSq() * t.lengthSq());
    if (e === 0) return Math.PI / 2;
    const n = this.dot(t) / e;
    return Math.acos(Re(n, -1, 1));
  }
  distanceTo(t) {
    return Math.sqrt(this.distanceToSquared(t));
  }
  distanceToSquared(t) {
    const e = this.x - t.x,
      n = this.y - t.y,
      s = this.z - t.z;
    return e * e + n * n + s * s;
  }
  manhattanDistanceTo(t) {
    return (
      Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z)
    );
  }
  setFromSpherical(t) {
    return this.setFromSphericalCoords(t.radius, t.phi, t.theta);
  }
  setFromSphericalCoords(t, e, n) {
    const s = Math.sin(e) * t;
    return (
      (this.x = s * Math.sin(n)),
      (this.y = Math.cos(e) * t),
      (this.z = s * Math.cos(n)),
      this
    );
  }
  setFromCylindrical(t) {
    return this.setFromCylindricalCoords(t.radius, t.theta, t.y);
  }
  setFromCylindricalCoords(t, e, n) {
    return (
      (this.x = t * Math.sin(e)),
      (this.y = n),
      (this.z = t * Math.cos(e)),
      this
    );
  }
  setFromMatrixPosition(t) {
    const e = t.elements;
    return ((this.x = e[12]), (this.y = e[13]), (this.z = e[14]), this);
  }
  setFromMatrixScale(t) {
    const e = this.setFromMatrixColumn(t, 0).length(),
      n = this.setFromMatrixColumn(t, 1).length(),
      s = this.setFromMatrixColumn(t, 2).length();
    return ((this.x = e), (this.y = n), (this.z = s), this);
  }
  setFromMatrixColumn(t, e) {
    return this.fromArray(t.elements, e * 4);
  }
  setFromMatrix3Column(t, e) {
    return this.fromArray(t.elements, e * 3);
  }
  setFromEuler(t) {
    return ((this.x = t._x), (this.y = t._y), (this.z = t._z), this);
  }
  setFromColor(t) {
    return ((this.x = t.r), (this.y = t.g), (this.z = t.b), this);
  }
  equals(t) {
    return t.x === this.x && t.y === this.y && t.z === this.z;
  }
  fromArray(t, e = 0) {
    return ((this.x = t[e]), (this.y = t[e + 1]), (this.z = t[e + 2]), this);
  }
  toArray(t = [], e = 0) {
    return ((t[e] = this.x), (t[e + 1] = this.y), (t[e + 2] = this.z), t);
  }
  fromBufferAttribute(t, e) {
    return (
      (this.x = t.getX(e)),
      (this.y = t.getY(e)),
      (this.z = t.getZ(e)),
      this
    );
  }
  random() {
    return (
      (this.x = Math.random()),
      (this.y = Math.random()),
      (this.z = Math.random()),
      this
    );
  }
  randomDirection() {
    const t = Math.random() * Math.PI * 2,
      e = Math.random() * 2 - 1,
      n = Math.sqrt(1 - e * e);
    return (
      (this.x = n * Math.cos(t)),
      (this.y = e),
      (this.z = n * Math.sin(t)),
      this
    );
  }
  *[Symbol.iterator]() {
    (yield this.x, yield this.y, yield this.z);
  }
}
const Zs = new b(),
  ao = new an();
class ti {
  constructor(
    t = new b(1 / 0, 1 / 0, 1 / 0),
    e = new b(-1 / 0, -1 / 0, -1 / 0),
  ) {
    ((this.isBox3 = !0), (this.min = t), (this.max = e));
  }
  set(t, e) {
    return (this.min.copy(t), this.max.copy(e), this);
  }
  setFromArray(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e += 3)
      this.expandByPoint($e.fromArray(t, e));
    return this;
  }
  setFromBufferAttribute(t) {
    this.makeEmpty();
    for (let e = 0, n = t.count; e < n; e++)
      this.expandByPoint($e.fromBufferAttribute(t, e));
    return this;
  }
  setFromPoints(t) {
    this.makeEmpty();
    for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
    return this;
  }
  setFromCenterAndSize(t, e) {
    const n = $e.copy(e).multiplyScalar(0.5);
    return (this.min.copy(t).sub(n), this.max.copy(t).add(n), this);
  }
  setFromObject(t, e = !1) {
    return (this.makeEmpty(), this.expandByObject(t, e));
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return (this.min.copy(t.min), this.max.copy(t.max), this);
  }
  makeEmpty() {
    return (
      (this.min.x = this.min.y = this.min.z = 1 / 0),
      (this.max.x = this.max.y = this.max.z = -1 / 0),
      this
    );
  }
  isEmpty() {
    return (
      this.max.x < this.min.x ||
      this.max.y < this.min.y ||
      this.max.z < this.min.z
    );
  }
  getCenter(t) {
    return this.isEmpty()
      ? t.set(0, 0, 0)
      : t.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  getSize(t) {
    return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min);
  }
  expandByPoint(t) {
    return (this.min.min(t), this.max.max(t), this);
  }
  expandByVector(t) {
    return (this.min.sub(t), this.max.add(t), this);
  }
  expandByScalar(t) {
    return (this.min.addScalar(-t), this.max.addScalar(t), this);
  }
  expandByObject(t, e = !1) {
    t.updateWorldMatrix(!1, !1);
    const n = t.geometry;
    if (n !== void 0) {
      const r = n.getAttribute("position");
      if (e === !0 && r !== void 0 && t.isInstancedMesh !== !0)
        for (let a = 0, l = r.count; a < l; a++)
          (t.isMesh === !0
            ? t.getVertexPosition(a, $e)
            : $e.fromBufferAttribute(r, a),
            $e.applyMatrix4(t.matrixWorld),
            this.expandByPoint($e));
      else
        (t.boundingBox !== void 0
          ? (t.boundingBox === null && t.computeBoundingBox(),
            as.copy(t.boundingBox))
          : (n.boundingBox === null && n.computeBoundingBox(),
            as.copy(n.boundingBox)),
          as.applyMatrix4(t.matrixWorld),
          this.union(as));
    }
    const s = t.children;
    for (let r = 0, a = s.length; r < a; r++) this.expandByObject(s[r], e);
    return this;
  }
  containsPoint(t) {
    return (
      t.x >= this.min.x &&
      t.x <= this.max.x &&
      t.y >= this.min.y &&
      t.y <= this.max.y &&
      t.z >= this.min.z &&
      t.z <= this.max.z
    );
  }
  containsBox(t) {
    return (
      this.min.x <= t.min.x &&
      t.max.x <= this.max.x &&
      this.min.y <= t.min.y &&
      t.max.y <= this.max.y &&
      this.min.z <= t.min.z &&
      t.max.z <= this.max.z
    );
  }
  getParameter(t, e) {
    return e.set(
      (t.x - this.min.x) / (this.max.x - this.min.x),
      (t.y - this.min.y) / (this.max.y - this.min.y),
      (t.z - this.min.z) / (this.max.z - this.min.z),
    );
  }
  intersectsBox(t) {
    return (
      t.max.x >= this.min.x &&
      t.min.x <= this.max.x &&
      t.max.y >= this.min.y &&
      t.min.y <= this.max.y &&
      t.max.z >= this.min.z &&
      t.min.z <= this.max.z
    );
  }
  intersectsSphere(t) {
    return (
      this.clampPoint(t.center, $e),
      $e.distanceToSquared(t.center) <= t.radius * t.radius
    );
  }
  intersectsPlane(t) {
    let e, n;
    return (
      t.normal.x > 0
        ? ((e = t.normal.x * this.min.x), (n = t.normal.x * this.max.x))
        : ((e = t.normal.x * this.max.x), (n = t.normal.x * this.min.x)),
      t.normal.y > 0
        ? ((e += t.normal.y * this.min.y), (n += t.normal.y * this.max.y))
        : ((e += t.normal.y * this.max.y), (n += t.normal.y * this.min.y)),
      t.normal.z > 0
        ? ((e += t.normal.z * this.min.z), (n += t.normal.z * this.max.z))
        : ((e += t.normal.z * this.max.z), (n += t.normal.z * this.min.z)),
      e <= -t.constant && n >= -t.constant
    );
  }
  intersectsTriangle(t) {
    if (this.isEmpty()) return !1;
    (this.getCenter(Bi),
      os.subVectors(this.max, Bi),
      ai.subVectors(t.a, Bi),
      oi.subVectors(t.b, Bi),
      li.subVectors(t.c, Bi),
      Tn.subVectors(oi, ai),
      bn.subVectors(li, oi),
      On.subVectors(ai, li));
    let e = [
      0,
      -Tn.z,
      Tn.y,
      0,
      -bn.z,
      bn.y,
      0,
      -On.z,
      On.y,
      Tn.z,
      0,
      -Tn.x,
      bn.z,
      0,
      -bn.x,
      On.z,
      0,
      -On.x,
      -Tn.y,
      Tn.x,
      0,
      -bn.y,
      bn.x,
      0,
      -On.y,
      On.x,
      0,
    ];
    return !Js(e, ai, oi, li, os) ||
      ((e = [1, 0, 0, 0, 1, 0, 0, 0, 1]), !Js(e, ai, oi, li, os))
      ? !1
      : (ls.crossVectors(Tn, bn),
        (e = [ls.x, ls.y, ls.z]),
        Js(e, ai, oi, li, os));
  }
  clampPoint(t, e) {
    return e.copy(t).clamp(this.min, this.max);
  }
  distanceToPoint(t) {
    return this.clampPoint(t, $e).distanceTo(t);
  }
  getBoundingSphere(t) {
    return (
      this.isEmpty()
        ? t.makeEmpty()
        : (this.getCenter(t.center),
          (t.radius = this.getSize($e).length() * 0.5)),
      t
    );
  }
  intersect(t) {
    return (
      this.min.max(t.min),
      this.max.min(t.max),
      this.isEmpty() && this.makeEmpty(),
      this
    );
  }
  union(t) {
    return (this.min.min(t.min), this.max.max(t.max), this);
  }
  applyMatrix4(t) {
    return this.isEmpty()
      ? this
      : (cn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t),
        cn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t),
        cn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t),
        cn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t),
        cn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t),
        cn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t),
        cn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t),
        cn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t),
        this.setFromPoints(cn),
        this);
  }
  translate(t) {
    return (this.min.add(t), this.max.add(t), this);
  }
  equals(t) {
    return t.min.equals(this.min) && t.max.equals(this.max);
  }
}
const cn = [
    new b(),
    new b(),
    new b(),
    new b(),
    new b(),
    new b(),
    new b(),
    new b(),
  ],
  $e = new b(),
  as = new ti(),
  ai = new b(),
  oi = new b(),
  li = new b(),
  Tn = new b(),
  bn = new b(),
  On = new b(),
  Bi = new b(),
  os = new b(),
  ls = new b(),
  Bn = new b();
function Js(i, t, e, n, s) {
  for (let r = 0, a = i.length - 3; r <= a; r += 3) {
    Bn.fromArray(i, r);
    const l =
        s.x * Math.abs(Bn.x) + s.y * Math.abs(Bn.y) + s.z * Math.abs(Bn.z),
      o = t.dot(Bn),
      c = e.dot(Bn),
      h = n.dot(Bn);
    if (Math.max(-Math.max(o, c, h), Math.min(o, c, h)) > l) return !1;
  }
  return !0;
}
const eh = new ti(),
  ki = new b(),
  Qs = new b();
class es {
  constructor(t = new b(), e = -1) {
    ((this.isSphere = !0), (this.center = t), (this.radius = e));
  }
  set(t, e) {
    return (this.center.copy(t), (this.radius = e), this);
  }
  setFromPoints(t, e) {
    const n = this.center;
    e !== void 0 ? n.copy(e) : eh.setFromPoints(t).getCenter(n);
    let s = 0;
    for (let r = 0, a = t.length; r < a; r++)
      s = Math.max(s, n.distanceToSquared(t[r]));
    return ((this.radius = Math.sqrt(s)), this);
  }
  copy(t) {
    return (this.center.copy(t.center), (this.radius = t.radius), this);
  }
  isEmpty() {
    return this.radius < 0;
  }
  makeEmpty() {
    return (this.center.set(0, 0, 0), (this.radius = -1), this);
  }
  containsPoint(t) {
    return t.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  distanceToPoint(t) {
    return t.distanceTo(this.center) - this.radius;
  }
  intersectsSphere(t) {
    const e = this.radius + t.radius;
    return t.center.distanceToSquared(this.center) <= e * e;
  }
  intersectsBox(t) {
    return t.intersectsSphere(this);
  }
  intersectsPlane(t) {
    return Math.abs(t.distanceToPoint(this.center)) <= this.radius;
  }
  clampPoint(t, e) {
    const n = this.center.distanceToSquared(t);
    return (
      e.copy(t),
      n > this.radius * this.radius &&
        (e.sub(this.center).normalize(),
        e.multiplyScalar(this.radius).add(this.center)),
      e
    );
  }
  getBoundingBox(t) {
    return this.isEmpty()
      ? (t.makeEmpty(), t)
      : (t.set(this.center, this.center), t.expandByScalar(this.radius), t);
  }
  applyMatrix4(t) {
    return (
      this.center.applyMatrix4(t),
      (this.radius = this.radius * t.getMaxScaleOnAxis()),
      this
    );
  }
  translate(t) {
    return (this.center.add(t), this);
  }
  expandByPoint(t) {
    if (this.isEmpty()) return (this.center.copy(t), (this.radius = 0), this);
    ki.subVectors(t, this.center);
    const e = ki.lengthSq();
    if (e > this.radius * this.radius) {
      const n = Math.sqrt(e),
        s = (n - this.radius) * 0.5;
      (this.center.addScaledVector(ki, s / n), (this.radius += s));
    }
    return this;
  }
  union(t) {
    return t.isEmpty()
      ? this
      : this.isEmpty()
        ? (this.copy(t), this)
        : (this.center.equals(t.center) === !0
            ? (this.radius = Math.max(this.radius, t.radius))
            : (Qs.subVectors(t.center, this.center).setLength(t.radius),
              this.expandByPoint(ki.copy(t.center).add(Qs)),
              this.expandByPoint(ki.copy(t.center).sub(Qs))),
          this);
  }
  equals(t) {
    return t.center.equals(this.center) && t.radius === this.radius;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const hn = new b(),
  tr = new b(),
  cs = new b(),
  An = new b(),
  er = new b(),
  hs = new b(),
  nr = new b();
class nh {
  constructor(t = new b(), e = new b(0, 0, -1)) {
    ((this.origin = t), (this.direction = e));
  }
  set(t, e) {
    return (this.origin.copy(t), this.direction.copy(e), this);
  }
  copy(t) {
    return (this.origin.copy(t.origin), this.direction.copy(t.direction), this);
  }
  at(t, e) {
    return e.copy(this.origin).addScaledVector(this.direction, t);
  }
  lookAt(t) {
    return (this.direction.copy(t).sub(this.origin).normalize(), this);
  }
  recast(t) {
    return (this.origin.copy(this.at(t, hn)), this);
  }
  closestPointToPoint(t, e) {
    e.subVectors(t, this.origin);
    const n = e.dot(this.direction);
    return n < 0
      ? e.copy(this.origin)
      : e.copy(this.origin).addScaledVector(this.direction, n);
  }
  distanceToPoint(t) {
    return Math.sqrt(this.distanceSqToPoint(t));
  }
  distanceSqToPoint(t) {
    const e = hn.subVectors(t, this.origin).dot(this.direction);
    return e < 0
      ? this.origin.distanceToSquared(t)
      : (hn.copy(this.origin).addScaledVector(this.direction, e),
        hn.distanceToSquared(t));
  }
  distanceSqToSegment(t, e, n, s) {
    (tr.copy(t).add(e).multiplyScalar(0.5),
      cs.copy(e).sub(t).normalize(),
      An.copy(this.origin).sub(tr));
    const r = t.distanceTo(e) * 0.5,
      a = -this.direction.dot(cs),
      l = An.dot(this.direction),
      o = -An.dot(cs),
      c = An.lengthSq(),
      h = Math.abs(1 - a * a);
    let d, u, m, g;
    if (h > 0)
      if (((d = a * o - l), (u = a * l - o), (g = r * h), d >= 0))
        if (u >= -g)
          if (u <= g) {
            const v = 1 / h;
            ((d *= v),
              (u *= v),
              (m = d * (d + a * u + 2 * l) + u * (a * d + u + 2 * o) + c));
          } else
            ((u = r),
              (d = Math.max(0, -(a * u + l))),
              (m = -d * d + u * (u + 2 * o) + c));
        else
          ((u = -r),
            (d = Math.max(0, -(a * u + l))),
            (m = -d * d + u * (u + 2 * o) + c));
      else
        u <= -g
          ? ((d = Math.max(0, -(-a * r + l))),
            (u = d > 0 ? -r : Math.min(Math.max(-r, -o), r)),
            (m = -d * d + u * (u + 2 * o) + c))
          : u <= g
            ? ((d = 0),
              (u = Math.min(Math.max(-r, -o), r)),
              (m = u * (u + 2 * o) + c))
            : ((d = Math.max(0, -(a * r + l))),
              (u = d > 0 ? r : Math.min(Math.max(-r, -o), r)),
              (m = -d * d + u * (u + 2 * o) + c));
    else
      ((u = a > 0 ? -r : r),
        (d = Math.max(0, -(a * u + l))),
        (m = -d * d + u * (u + 2 * o) + c));
    return (
      n && n.copy(this.origin).addScaledVector(this.direction, d),
      s && s.copy(tr).addScaledVector(cs, u),
      m
    );
  }
  intersectSphere(t, e) {
    hn.subVectors(t.center, this.origin);
    const n = hn.dot(this.direction),
      s = hn.dot(hn) - n * n,
      r = t.radius * t.radius;
    if (s > r) return null;
    const a = Math.sqrt(r - s),
      l = n - a,
      o = n + a;
    return o < 0 ? null : l < 0 ? this.at(o, e) : this.at(l, e);
  }
  intersectsSphere(t) {
    return this.distanceSqToPoint(t.center) <= t.radius * t.radius;
  }
  distanceToPlane(t) {
    const e = t.normal.dot(this.direction);
    if (e === 0) return t.distanceToPoint(this.origin) === 0 ? 0 : null;
    const n = -(this.origin.dot(t.normal) + t.constant) / e;
    return n >= 0 ? n : null;
  }
  intersectPlane(t, e) {
    const n = this.distanceToPlane(t);
    return n === null ? null : this.at(n, e);
  }
  intersectsPlane(t) {
    const e = t.distanceToPoint(this.origin);
    return e === 0 || t.normal.dot(this.direction) * e < 0;
  }
  intersectBox(t, e) {
    let n, s, r, a, l, o;
    const c = 1 / this.direction.x,
      h = 1 / this.direction.y,
      d = 1 / this.direction.z,
      u = this.origin;
    return (
      c >= 0
        ? ((n = (t.min.x - u.x) * c), (s = (t.max.x - u.x) * c))
        : ((n = (t.max.x - u.x) * c), (s = (t.min.x - u.x) * c)),
      h >= 0
        ? ((r = (t.min.y - u.y) * h), (a = (t.max.y - u.y) * h))
        : ((r = (t.max.y - u.y) * h), (a = (t.min.y - u.y) * h)),
      n > a ||
      r > s ||
      ((r > n || isNaN(n)) && (n = r),
      (a < s || isNaN(s)) && (s = a),
      d >= 0
        ? ((l = (t.min.z - u.z) * d), (o = (t.max.z - u.z) * d))
        : ((l = (t.max.z - u.z) * d), (o = (t.min.z - u.z) * d)),
      n > o || l > s) ||
      ((l > n || n !== n) && (n = l), (o < s || s !== s) && (s = o), s < 0)
        ? null
        : this.at(n >= 0 ? n : s, e)
    );
  }
  intersectsBox(t) {
    return this.intersectBox(t, hn) !== null;
  }
  intersectTriangle(t, e, n, s, r) {
    (er.subVectors(e, t), hs.subVectors(n, t), nr.crossVectors(er, hs));
    let a = this.direction.dot(nr),
      l;
    if (a > 0) {
      if (s) return null;
      l = 1;
    } else if (a < 0) ((l = -1), (a = -a));
    else return null;
    An.subVectors(this.origin, t);
    const o = l * this.direction.dot(hs.crossVectors(An, hs));
    if (o < 0) return null;
    const c = l * this.direction.dot(er.cross(An));
    if (c < 0 || o + c > a) return null;
    const h = -l * An.dot(nr);
    return h < 0 ? null : this.at(h / a, r);
  }
  applyMatrix4(t) {
    return (
      this.origin.applyMatrix4(t),
      this.direction.transformDirection(t),
      this
    );
  }
  equals(t) {
    return t.origin.equals(this.origin) && t.direction.equals(this.direction);
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
class Zt {
  constructor(t, e, n, s, r, a, l, o, c, h, d, u, m, g, v, p) {
    ((Zt.prototype.isMatrix4 = !0),
      (this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
      t !== void 0 && this.set(t, e, n, s, r, a, l, o, c, h, d, u, m, g, v, p));
  }
  set(t, e, n, s, r, a, l, o, c, h, d, u, m, g, v, p) {
    const f = this.elements;
    return (
      (f[0] = t),
      (f[4] = e),
      (f[8] = n),
      (f[12] = s),
      (f[1] = r),
      (f[5] = a),
      (f[9] = l),
      (f[13] = o),
      (f[2] = c),
      (f[6] = h),
      (f[10] = d),
      (f[14] = u),
      (f[3] = m),
      (f[7] = g),
      (f[11] = v),
      (f[15] = p),
      this
    );
  }
  identity() {
    return (this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
  }
  clone() {
    return new Zt().fromArray(this.elements);
  }
  copy(t) {
    const e = this.elements,
      n = t.elements;
    return (
      (e[0] = n[0]),
      (e[1] = n[1]),
      (e[2] = n[2]),
      (e[3] = n[3]),
      (e[4] = n[4]),
      (e[5] = n[5]),
      (e[6] = n[6]),
      (e[7] = n[7]),
      (e[8] = n[8]),
      (e[9] = n[9]),
      (e[10] = n[10]),
      (e[11] = n[11]),
      (e[12] = n[12]),
      (e[13] = n[13]),
      (e[14] = n[14]),
      (e[15] = n[15]),
      this
    );
  }
  copyPosition(t) {
    const e = this.elements,
      n = t.elements;
    return ((e[12] = n[12]), (e[13] = n[13]), (e[14] = n[14]), this);
  }
  setFromMatrix3(t) {
    const e = t.elements;
    return (
      this.set(
        e[0],
        e[3],
        e[6],
        0,
        e[1],
        e[4],
        e[7],
        0,
        e[2],
        e[5],
        e[8],
        0,
        0,
        0,
        0,
        1,
      ),
      this
    );
  }
  extractBasis(t, e, n) {
    return (
      t.setFromMatrixColumn(this, 0),
      e.setFromMatrixColumn(this, 1),
      n.setFromMatrixColumn(this, 2),
      this
    );
  }
  makeBasis(t, e, n) {
    return (
      this.set(
        t.x,
        e.x,
        n.x,
        0,
        t.y,
        e.y,
        n.y,
        0,
        t.z,
        e.z,
        n.z,
        0,
        0,
        0,
        0,
        1,
      ),
      this
    );
  }
  extractRotation(t) {
    const e = this.elements,
      n = t.elements,
      s = 1 / ci.setFromMatrixColumn(t, 0).length(),
      r = 1 / ci.setFromMatrixColumn(t, 1).length(),
      a = 1 / ci.setFromMatrixColumn(t, 2).length();
    return (
      (e[0] = n[0] * s),
      (e[1] = n[1] * s),
      (e[2] = n[2] * s),
      (e[3] = 0),
      (e[4] = n[4] * r),
      (e[5] = n[5] * r),
      (e[6] = n[6] * r),
      (e[7] = 0),
      (e[8] = n[8] * a),
      (e[9] = n[9] * a),
      (e[10] = n[10] * a),
      (e[11] = 0),
      (e[12] = 0),
      (e[13] = 0),
      (e[14] = 0),
      (e[15] = 1),
      this
    );
  }
  makeRotationFromEuler(t) {
    const e = this.elements,
      n = t.x,
      s = t.y,
      r = t.z,
      a = Math.cos(n),
      l = Math.sin(n),
      o = Math.cos(s),
      c = Math.sin(s),
      h = Math.cos(r),
      d = Math.sin(r);
    if (t.order === "XYZ") {
      const u = a * h,
        m = a * d,
        g = l * h,
        v = l * d;
      ((e[0] = o * h),
        (e[4] = -o * d),
        (e[8] = c),
        (e[1] = m + g * c),
        (e[5] = u - v * c),
        (e[9] = -l * o),
        (e[2] = v - u * c),
        (e[6] = g + m * c),
        (e[10] = a * o));
    } else if (t.order === "YXZ") {
      const u = o * h,
        m = o * d,
        g = c * h,
        v = c * d;
      ((e[0] = u + v * l),
        (e[4] = g * l - m),
        (e[8] = a * c),
        (e[1] = a * d),
        (e[5] = a * h),
        (e[9] = -l),
        (e[2] = m * l - g),
        (e[6] = v + u * l),
        (e[10] = a * o));
    } else if (t.order === "ZXY") {
      const u = o * h,
        m = o * d,
        g = c * h,
        v = c * d;
      ((e[0] = u - v * l),
        (e[4] = -a * d),
        (e[8] = g + m * l),
        (e[1] = m + g * l),
        (e[5] = a * h),
        (e[9] = v - u * l),
        (e[2] = -a * c),
        (e[6] = l),
        (e[10] = a * o));
    } else if (t.order === "ZYX") {
      const u = a * h,
        m = a * d,
        g = l * h,
        v = l * d;
      ((e[0] = o * h),
        (e[4] = g * c - m),
        (e[8] = u * c + v),
        (e[1] = o * d),
        (e[5] = v * c + u),
        (e[9] = m * c - g),
        (e[2] = -c),
        (e[6] = l * o),
        (e[10] = a * o));
    } else if (t.order === "YZX") {
      const u = a * o,
        m = a * c,
        g = l * o,
        v = l * c;
      ((e[0] = o * h),
        (e[4] = v - u * d),
        (e[8] = g * d + m),
        (e[1] = d),
        (e[5] = a * h),
        (e[9] = -l * h),
        (e[2] = -c * h),
        (e[6] = m * d + g),
        (e[10] = u - v * d));
    } else if (t.order === "XZY") {
      const u = a * o,
        m = a * c,
        g = l * o,
        v = l * c;
      ((e[0] = o * h),
        (e[4] = -d),
        (e[8] = c * h),
        (e[1] = u * d + v),
        (e[5] = a * h),
        (e[9] = m * d - g),
        (e[2] = g * d - m),
        (e[6] = l * h),
        (e[10] = v * d + u));
    }
    return (
      (e[3] = 0),
      (e[7] = 0),
      (e[11] = 0),
      (e[12] = 0),
      (e[13] = 0),
      (e[14] = 0),
      (e[15] = 1),
      this
    );
  }
  makeRotationFromQuaternion(t) {
    return this.compose(ih, t, sh);
  }
  lookAt(t, e, n) {
    const s = this.elements;
    return (
      ze.subVectors(t, e),
      ze.lengthSq() === 0 && (ze.z = 1),
      ze.normalize(),
      Rn.crossVectors(n, ze),
      Rn.lengthSq() === 0 &&
        (Math.abs(n.z) === 1 ? (ze.x += 1e-4) : (ze.z += 1e-4),
        ze.normalize(),
        Rn.crossVectors(n, ze)),
      Rn.normalize(),
      us.crossVectors(ze, Rn),
      (s[0] = Rn.x),
      (s[4] = us.x),
      (s[8] = ze.x),
      (s[1] = Rn.y),
      (s[5] = us.y),
      (s[9] = ze.y),
      (s[2] = Rn.z),
      (s[6] = us.z),
      (s[10] = ze.z),
      this
    );
  }
  multiply(t) {
    return this.multiplyMatrices(this, t);
  }
  premultiply(t) {
    return this.multiplyMatrices(t, this);
  }
  multiplyMatrices(t, e) {
    const n = t.elements,
      s = e.elements,
      r = this.elements,
      a = n[0],
      l = n[4],
      o = n[8],
      c = n[12],
      h = n[1],
      d = n[5],
      u = n[9],
      m = n[13],
      g = n[2],
      v = n[6],
      p = n[10],
      f = n[14],
      w = n[3],
      M = n[7],
      _ = n[11],
      L = n[15],
      R = s[0],
      A = s[4],
      C = s[8],
      S = s[12],
      y = s[1],
      P = s[5],
      z = s[9],
      U = s[13],
      H = s[2],
      k = s[6],
      G = s[10],
      q = s[14],
      O = s[3],
      et = s[7],
      K = s[11],
      nt = s[15];
    return (
      (r[0] = a * R + l * y + o * H + c * O),
      (r[4] = a * A + l * P + o * k + c * et),
      (r[8] = a * C + l * z + o * G + c * K),
      (r[12] = a * S + l * U + o * q + c * nt),
      (r[1] = h * R + d * y + u * H + m * O),
      (r[5] = h * A + d * P + u * k + m * et),
      (r[9] = h * C + d * z + u * G + m * K),
      (r[13] = h * S + d * U + u * q + m * nt),
      (r[2] = g * R + v * y + p * H + f * O),
      (r[6] = g * A + v * P + p * k + f * et),
      (r[10] = g * C + v * z + p * G + f * K),
      (r[14] = g * S + v * U + p * q + f * nt),
      (r[3] = w * R + M * y + _ * H + L * O),
      (r[7] = w * A + M * P + _ * k + L * et),
      (r[11] = w * C + M * z + _ * G + L * K),
      (r[15] = w * S + M * U + _ * q + L * nt),
      this
    );
  }
  multiplyScalar(t) {
    const e = this.elements;
    return (
      (e[0] *= t),
      (e[4] *= t),
      (e[8] *= t),
      (e[12] *= t),
      (e[1] *= t),
      (e[5] *= t),
      (e[9] *= t),
      (e[13] *= t),
      (e[2] *= t),
      (e[6] *= t),
      (e[10] *= t),
      (e[14] *= t),
      (e[3] *= t),
      (e[7] *= t),
      (e[11] *= t),
      (e[15] *= t),
      this
    );
  }
  determinant() {
    const t = this.elements,
      e = t[0],
      n = t[4],
      s = t[8],
      r = t[12],
      a = t[1],
      l = t[5],
      o = t[9],
      c = t[13],
      h = t[2],
      d = t[6],
      u = t[10],
      m = t[14],
      g = t[3],
      v = t[7],
      p = t[11],
      f = t[15];
    return (
      g *
        (+r * o * d -
          s * c * d -
          r * l * u +
          n * c * u +
          s * l * m -
          n * o * m) +
      v *
        (+e * o * m -
          e * c * u +
          r * a * u -
          s * a * m +
          s * c * h -
          r * o * h) +
      p *
        (+e * c * d -
          e * l * m -
          r * a * d +
          n * a * m +
          r * l * h -
          n * c * h) +
      f *
        (-s * l * h - e * o * d + e * l * u + s * a * d - n * a * u + n * o * h)
    );
  }
  transpose() {
    const t = this.elements;
    let e;
    return (
      (e = t[1]),
      (t[1] = t[4]),
      (t[4] = e),
      (e = t[2]),
      (t[2] = t[8]),
      (t[8] = e),
      (e = t[6]),
      (t[6] = t[9]),
      (t[9] = e),
      (e = t[3]),
      (t[3] = t[12]),
      (t[12] = e),
      (e = t[7]),
      (t[7] = t[13]),
      (t[13] = e),
      (e = t[11]),
      (t[11] = t[14]),
      (t[14] = e),
      this
    );
  }
  setPosition(t, e, n) {
    const s = this.elements;
    return (
      t.isVector3
        ? ((s[12] = t.x), (s[13] = t.y), (s[14] = t.z))
        : ((s[12] = t), (s[13] = e), (s[14] = n)),
      this
    );
  }
  invert() {
    const t = this.elements,
      e = t[0],
      n = t[1],
      s = t[2],
      r = t[3],
      a = t[4],
      l = t[5],
      o = t[6],
      c = t[7],
      h = t[8],
      d = t[9],
      u = t[10],
      m = t[11],
      g = t[12],
      v = t[13],
      p = t[14],
      f = t[15],
      w = d * p * c - v * u * c + v * o * m - l * p * m - d * o * f + l * u * f,
      M = g * u * c - h * p * c - g * o * m + a * p * m + h * o * f - a * u * f,
      _ = h * v * c - g * d * c + g * l * m - a * v * m - h * l * f + a * d * f,
      L = g * d * o - h * v * o - g * l * u + a * v * u + h * l * p - a * d * p,
      R = e * w + n * M + s * _ + r * L;
    if (R === 0)
      return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const A = 1 / R;
    return (
      (t[0] = w * A),
      (t[1] =
        (v * u * r -
          d * p * r -
          v * s * m +
          n * p * m +
          d * s * f -
          n * u * f) *
        A),
      (t[2] =
        (l * p * r -
          v * o * r +
          v * s * c -
          n * p * c -
          l * s * f +
          n * o * f) *
        A),
      (t[3] =
        (d * o * r -
          l * u * r -
          d * s * c +
          n * u * c +
          l * s * m -
          n * o * m) *
        A),
      (t[4] = M * A),
      (t[5] =
        (h * p * r -
          g * u * r +
          g * s * m -
          e * p * m -
          h * s * f +
          e * u * f) *
        A),
      (t[6] =
        (g * o * r -
          a * p * r -
          g * s * c +
          e * p * c +
          a * s * f -
          e * o * f) *
        A),
      (t[7] =
        (a * u * r -
          h * o * r +
          h * s * c -
          e * u * c -
          a * s * m +
          e * o * m) *
        A),
      (t[8] = _ * A),
      (t[9] =
        (g * d * r -
          h * v * r -
          g * n * m +
          e * v * m +
          h * n * f -
          e * d * f) *
        A),
      (t[10] =
        (a * v * r -
          g * l * r +
          g * n * c -
          e * v * c -
          a * n * f +
          e * l * f) *
        A),
      (t[11] =
        (h * l * r -
          a * d * r -
          h * n * c +
          e * d * c +
          a * n * m -
          e * l * m) *
        A),
      (t[12] = L * A),
      (t[13] =
        (h * v * s -
          g * d * s +
          g * n * u -
          e * v * u -
          h * n * p +
          e * d * p) *
        A),
      (t[14] =
        (g * l * s -
          a * v * s -
          g * n * o +
          e * v * o +
          a * n * p -
          e * l * p) *
        A),
      (t[15] =
        (a * d * s -
          h * l * s +
          h * n * o -
          e * d * o -
          a * n * u +
          e * l * u) *
        A),
      this
    );
  }
  scale(t) {
    const e = this.elements,
      n = t.x,
      s = t.y,
      r = t.z;
    return (
      (e[0] *= n),
      (e[4] *= s),
      (e[8] *= r),
      (e[1] *= n),
      (e[5] *= s),
      (e[9] *= r),
      (e[2] *= n),
      (e[6] *= s),
      (e[10] *= r),
      (e[3] *= n),
      (e[7] *= s),
      (e[11] *= r),
      this
    );
  }
  getMaxScaleOnAxis() {
    const t = this.elements,
      e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2],
      n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6],
      s = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
    return Math.sqrt(Math.max(e, n, s));
  }
  makeTranslation(t, e, n) {
    return (
      t.isVector3
        ? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1)
        : this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1),
      this
    );
  }
  makeRotationX(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return (this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this);
  }
  makeRotationY(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return (this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this);
  }
  makeRotationZ(t) {
    const e = Math.cos(t),
      n = Math.sin(t);
    return (this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
  }
  makeRotationAxis(t, e) {
    const n = Math.cos(e),
      s = Math.sin(e),
      r = 1 - n,
      a = t.x,
      l = t.y,
      o = t.z,
      c = r * a,
      h = r * l;
    return (
      this.set(
        c * a + n,
        c * l - s * o,
        c * o + s * l,
        0,
        c * l + s * o,
        h * l + n,
        h * o - s * a,
        0,
        c * o - s * l,
        h * o + s * a,
        r * o * o + n,
        0,
        0,
        0,
        0,
        1,
      ),
      this
    );
  }
  makeScale(t, e, n) {
    return (this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this);
  }
  makeShear(t, e, n, s, r, a) {
    return (this.set(1, n, r, 0, t, 1, a, 0, e, s, 1, 0, 0, 0, 0, 1), this);
  }
  compose(t, e, n) {
    const s = this.elements,
      r = e._x,
      a = e._y,
      l = e._z,
      o = e._w,
      c = r + r,
      h = a + a,
      d = l + l,
      u = r * c,
      m = r * h,
      g = r * d,
      v = a * h,
      p = a * d,
      f = l * d,
      w = o * c,
      M = o * h,
      _ = o * d,
      L = n.x,
      R = n.y,
      A = n.z;
    return (
      (s[0] = (1 - (v + f)) * L),
      (s[1] = (m + _) * L),
      (s[2] = (g - M) * L),
      (s[3] = 0),
      (s[4] = (m - _) * R),
      (s[5] = (1 - (u + f)) * R),
      (s[6] = (p + w) * R),
      (s[7] = 0),
      (s[8] = (g + M) * A),
      (s[9] = (p - w) * A),
      (s[10] = (1 - (u + v)) * A),
      (s[11] = 0),
      (s[12] = t.x),
      (s[13] = t.y),
      (s[14] = t.z),
      (s[15] = 1),
      this
    );
  }
  decompose(t, e, n) {
    const s = this.elements;
    let r = ci.set(s[0], s[1], s[2]).length();
    const a = ci.set(s[4], s[5], s[6]).length(),
      l = ci.set(s[8], s[9], s[10]).length();
    (this.determinant() < 0 && (r = -r),
      (t.x = s[12]),
      (t.y = s[13]),
      (t.z = s[14]),
      Ze.copy(this));
    const c = 1 / r,
      h = 1 / a,
      d = 1 / l;
    return (
      (Ze.elements[0] *= c),
      (Ze.elements[1] *= c),
      (Ze.elements[2] *= c),
      (Ze.elements[4] *= h),
      (Ze.elements[5] *= h),
      (Ze.elements[6] *= h),
      (Ze.elements[8] *= d),
      (Ze.elements[9] *= d),
      (Ze.elements[10] *= d),
      e.setFromRotationMatrix(Ze),
      (n.x = r),
      (n.y = a),
      (n.z = l),
      this
    );
  }
  makePerspective(t, e, n, s, r, a, l = vn) {
    const o = this.elements,
      c = (2 * r) / (e - t),
      h = (2 * r) / (n - s),
      d = (e + t) / (e - t),
      u = (n + s) / (n - s);
    let m, g;
    if (l === vn) ((m = -(a + r) / (a - r)), (g = (-2 * a * r) / (a - r)));
    else if (l === Os) ((m = -a / (a - r)), (g = (-a * r) / (a - r)));
    else
      throw new Error(
        "THREE.Matrix4.makePerspective(): Invalid coordinate system: " + l,
      );
    return (
      (o[0] = c),
      (o[4] = 0),
      (o[8] = d),
      (o[12] = 0),
      (o[1] = 0),
      (o[5] = h),
      (o[9] = u),
      (o[13] = 0),
      (o[2] = 0),
      (o[6] = 0),
      (o[10] = m),
      (o[14] = g),
      (o[3] = 0),
      (o[7] = 0),
      (o[11] = -1),
      (o[15] = 0),
      this
    );
  }
  makeOrthographic(t, e, n, s, r, a, l = vn) {
    const o = this.elements,
      c = 1 / (e - t),
      h = 1 / (n - s),
      d = 1 / (a - r),
      u = (e + t) * c,
      m = (n + s) * h;
    let g, v;
    if (l === vn) ((g = (a + r) * d), (v = -2 * d));
    else if (l === Os) ((g = r * d), (v = -1 * d));
    else
      throw new Error(
        "THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + l,
      );
    return (
      (o[0] = 2 * c),
      (o[4] = 0),
      (o[8] = 0),
      (o[12] = -u),
      (o[1] = 0),
      (o[5] = 2 * h),
      (o[9] = 0),
      (o[13] = -m),
      (o[2] = 0),
      (o[6] = 0),
      (o[10] = v),
      (o[14] = -g),
      (o[3] = 0),
      (o[7] = 0),
      (o[11] = 0),
      (o[15] = 1),
      this
    );
  }
  equals(t) {
    const e = this.elements,
      n = t.elements;
    for (let s = 0; s < 16; s++) if (e[s] !== n[s]) return !1;
    return !0;
  }
  fromArray(t, e = 0) {
    for (let n = 0; n < 16; n++) this.elements[n] = t[n + e];
    return this;
  }
  toArray(t = [], e = 0) {
    const n = this.elements;
    return (
      (t[e] = n[0]),
      (t[e + 1] = n[1]),
      (t[e + 2] = n[2]),
      (t[e + 3] = n[3]),
      (t[e + 4] = n[4]),
      (t[e + 5] = n[5]),
      (t[e + 6] = n[6]),
      (t[e + 7] = n[7]),
      (t[e + 8] = n[8]),
      (t[e + 9] = n[9]),
      (t[e + 10] = n[10]),
      (t[e + 11] = n[11]),
      (t[e + 12] = n[12]),
      (t[e + 13] = n[13]),
      (t[e + 14] = n[14]),
      (t[e + 15] = n[15]),
      t
    );
  }
}
const ci = new b(),
  Ze = new Zt(),
  ih = new b(0, 0, 0),
  sh = new b(1, 1, 1),
  Rn = new b(),
  us = new b(),
  ze = new b(),
  oo = new Zt(),
  lo = new an();
class Ee {
  constructor(t = 0, e = 0, n = 0, s = Ee.DEFAULT_ORDER) {
    ((this.isEuler = !0),
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._order = s));
  }
  get x() {
    return this._x;
  }
  set x(t) {
    ((this._x = t), this._onChangeCallback());
  }
  get y() {
    return this._y;
  }
  set y(t) {
    ((this._y = t), this._onChangeCallback());
  }
  get z() {
    return this._z;
  }
  set z(t) {
    ((this._z = t), this._onChangeCallback());
  }
  get order() {
    return this._order;
  }
  set order(t) {
    ((this._order = t), this._onChangeCallback());
  }
  set(t, e, n, s = this._order) {
    return (
      (this._x = t),
      (this._y = e),
      (this._z = n),
      (this._order = s),
      this._onChangeCallback(),
      this
    );
  }
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  copy(t) {
    return (
      (this._x = t._x),
      (this._y = t._y),
      (this._z = t._z),
      (this._order = t._order),
      this._onChangeCallback(),
      this
    );
  }
  setFromRotationMatrix(t, e = this._order, n = !0) {
    const s = t.elements,
      r = s[0],
      a = s[4],
      l = s[8],
      o = s[1],
      c = s[5],
      h = s[9],
      d = s[2],
      u = s[6],
      m = s[10];
    switch (e) {
      case "XYZ":
        ((this._y = Math.asin(Re(l, -1, 1))),
          Math.abs(l) < 0.9999999
            ? ((this._x = Math.atan2(-h, m)), (this._z = Math.atan2(-a, r)))
            : ((this._x = Math.atan2(u, c)), (this._z = 0)));
        break;
      case "YXZ":
        ((this._x = Math.asin(-Re(h, -1, 1))),
          Math.abs(h) < 0.9999999
            ? ((this._y = Math.atan2(l, m)), (this._z = Math.atan2(o, c)))
            : ((this._y = Math.atan2(-d, r)), (this._z = 0)));
        break;
      case "ZXY":
        ((this._x = Math.asin(Re(u, -1, 1))),
          Math.abs(u) < 0.9999999
            ? ((this._y = Math.atan2(-d, m)), (this._z = Math.atan2(-a, c)))
            : ((this._y = 0), (this._z = Math.atan2(o, r))));
        break;
      case "ZYX":
        ((this._y = Math.asin(-Re(d, -1, 1))),
          Math.abs(d) < 0.9999999
            ? ((this._x = Math.atan2(u, m)), (this._z = Math.atan2(o, r)))
            : ((this._x = 0), (this._z = Math.atan2(-a, c))));
        break;
      case "YZX":
        ((this._z = Math.asin(Re(o, -1, 1))),
          Math.abs(o) < 0.9999999
            ? ((this._x = Math.atan2(-h, c)), (this._y = Math.atan2(-d, r)))
            : ((this._x = 0), (this._y = Math.atan2(l, m))));
        break;
      case "XZY":
        ((this._z = Math.asin(-Re(a, -1, 1))),
          Math.abs(a) < 0.9999999
            ? ((this._x = Math.atan2(u, c)), (this._y = Math.atan2(l, r)))
            : ((this._x = Math.atan2(-h, m)), (this._y = 0)));
        break;
      default:
        console.warn(
          "THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " +
            e,
        );
    }
    return ((this._order = e), n === !0 && this._onChangeCallback(), this);
  }
  setFromQuaternion(t, e, n) {
    return (
      oo.makeRotationFromQuaternion(t),
      this.setFromRotationMatrix(oo, e, n)
    );
  }
  setFromVector3(t, e = this._order) {
    return this.set(t.x, t.y, t.z, e);
  }
  reorder(t) {
    return (lo.setFromEuler(this), this.setFromQuaternion(lo, t));
  }
  equals(t) {
    return (
      t._x === this._x &&
      t._y === this._y &&
      t._z === this._z &&
      t._order === this._order
    );
  }
  fromArray(t) {
    return (
      (this._x = t[0]),
      (this._y = t[1]),
      (this._z = t[2]),
      t[3] !== void 0 && (this._order = t[3]),
      this._onChangeCallback(),
      this
    );
  }
  toArray(t = [], e = 0) {
    return (
      (t[e] = this._x),
      (t[e + 1] = this._y),
      (t[e + 2] = this._z),
      (t[e + 3] = this._order),
      t
    );
  }
  _onChange(t) {
    return ((this._onChangeCallback = t), this);
  }
  _onChangeCallback() {}
  *[Symbol.iterator]() {
    (yield this._x, yield this._y, yield this._z, yield this._order);
  }
}
Ee.DEFAULT_ORDER = "XYZ";
class wl {
  constructor() {
    this.mask = 1;
  }
  set(t) {
    this.mask = ((1 << t) | 0) >>> 0;
  }
  enable(t) {
    this.mask |= (1 << t) | 0;
  }
  enableAll() {
    this.mask = -1;
  }
  toggle(t) {
    this.mask ^= (1 << t) | 0;
  }
  disable(t) {
    this.mask &= ~((1 << t) | 0);
  }
  disableAll() {
    this.mask = 0;
  }
  test(t) {
    return (this.mask & t.mask) !== 0;
  }
  isEnabled(t) {
    return (this.mask & ((1 << t) | 0)) !== 0;
  }
}
let rh = 0;
const co = new b(),
  hi = new an(),
  un = new Zt(),
  ds = new b(),
  Hi = new b(),
  ah = new b(),
  oh = new an(),
  ho = new b(1, 0, 0),
  uo = new b(0, 1, 0),
  fo = new b(0, 0, 1),
  po = { type: "added" },
  lh = { type: "removed" },
  ui = { type: "childadded", child: null },
  ir = { type: "childremoved", child: null };
class ne extends Ii {
  constructor() {
    (super(),
      (this.isObject3D = !0),
      Object.defineProperty(this, "id", { value: rh++ }),
      (this.uuid = Ni()),
      (this.name = ""),
      (this.type = "Object3D"),
      (this.parent = null),
      (this.children = []),
      (this.up = ne.DEFAULT_UP.clone()));
    const t = new b(),
      e = new Ee(),
      n = new an(),
      s = new b(1, 1, 1);
    function r() {
      n.setFromEuler(e, !1);
    }
    function a() {
      e.setFromQuaternion(n, void 0, !1);
    }
    (e._onChange(r),
      n._onChange(a),
      Object.defineProperties(this, {
        position: { configurable: !0, enumerable: !0, value: t },
        rotation: { configurable: !0, enumerable: !0, value: e },
        quaternion: { configurable: !0, enumerable: !0, value: n },
        scale: { configurable: !0, enumerable: !0, value: s },
        modelViewMatrix: { value: new Zt() },
        normalMatrix: { value: new zt() },
      }),
      (this.matrix = new Zt()),
      (this.matrixWorld = new Zt()),
      (this.matrixAutoUpdate = ne.DEFAULT_MATRIX_AUTO_UPDATE),
      (this.matrixWorldAutoUpdate = ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
      (this.matrixWorldNeedsUpdate = !1),
      (this.layers = new wl()),
      (this.visible = !0),
      (this.castShadow = !1),
      (this.receiveShadow = !1),
      (this.frustumCulled = !0),
      (this.renderOrder = 0),
      (this.animations = []),
      (this.userData = {}));
  }
  onBeforeShadow() {}
  onAfterShadow() {}
  onBeforeRender() {}
  onAfterRender() {}
  applyMatrix4(t) {
    (this.matrixAutoUpdate && this.updateMatrix(),
      this.matrix.premultiply(t),
      this.matrix.decompose(this.position, this.quaternion, this.scale));
  }
  applyQuaternion(t) {
    return (this.quaternion.premultiply(t), this);
  }
  setRotationFromAxisAngle(t, e) {
    this.quaternion.setFromAxisAngle(t, e);
  }
  setRotationFromEuler(t) {
    this.quaternion.setFromEuler(t, !0);
  }
  setRotationFromMatrix(t) {
    this.quaternion.setFromRotationMatrix(t);
  }
  setRotationFromQuaternion(t) {
    this.quaternion.copy(t);
  }
  rotateOnAxis(t, e) {
    return (hi.setFromAxisAngle(t, e), this.quaternion.multiply(hi), this);
  }
  rotateOnWorldAxis(t, e) {
    return (hi.setFromAxisAngle(t, e), this.quaternion.premultiply(hi), this);
  }
  rotateX(t) {
    return this.rotateOnAxis(ho, t);
  }
  rotateY(t) {
    return this.rotateOnAxis(uo, t);
  }
  rotateZ(t) {
    return this.rotateOnAxis(fo, t);
  }
  translateOnAxis(t, e) {
    return (
      co.copy(t).applyQuaternion(this.quaternion),
      this.position.add(co.multiplyScalar(e)),
      this
    );
  }
  translateX(t) {
    return this.translateOnAxis(ho, t);
  }
  translateY(t) {
    return this.translateOnAxis(uo, t);
  }
  translateZ(t) {
    return this.translateOnAxis(fo, t);
  }
  localToWorld(t) {
    return (this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld));
  }
  worldToLocal(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      t.applyMatrix4(un.copy(this.matrixWorld).invert())
    );
  }
  lookAt(t, e, n) {
    t.isVector3 ? ds.copy(t) : ds.set(t, e, n);
    const s = this.parent;
    (this.updateWorldMatrix(!0, !1),
      Hi.setFromMatrixPosition(this.matrixWorld),
      this.isCamera || this.isLight
        ? un.lookAt(Hi, ds, this.up)
        : un.lookAt(ds, Hi, this.up),
      this.quaternion.setFromRotationMatrix(un),
      s &&
        (un.extractRotation(s.matrixWorld),
        hi.setFromRotationMatrix(un),
        this.quaternion.premultiply(hi.invert())));
  }
  add(t) {
    if (arguments.length > 1) {
      for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
      return this;
    }
    return t === this
      ? (console.error(
          "THREE.Object3D.add: object can't be added as a child of itself.",
          t,
        ),
        this)
      : (t && t.isObject3D
          ? (t.removeFromParent(),
            (t.parent = this),
            this.children.push(t),
            t.dispatchEvent(po),
            (ui.child = t),
            this.dispatchEvent(ui),
            (ui.child = null))
          : console.error(
              "THREE.Object3D.add: object not an instance of THREE.Object3D.",
              t,
            ),
        this);
  }
  remove(t) {
    if (arguments.length > 1) {
      for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
      return this;
    }
    const e = this.children.indexOf(t);
    return (
      e !== -1 &&
        ((t.parent = null),
        this.children.splice(e, 1),
        t.dispatchEvent(lh),
        (ir.child = t),
        this.dispatchEvent(ir),
        (ir.child = null)),
      this
    );
  }
  removeFromParent() {
    const t = this.parent;
    return (t !== null && t.remove(this), this);
  }
  clear() {
    return this.remove(...this.children);
  }
  attach(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      un.copy(this.matrixWorld).invert(),
      t.parent !== null &&
        (t.parent.updateWorldMatrix(!0, !1), un.multiply(t.parent.matrixWorld)),
      t.applyMatrix4(un),
      t.removeFromParent(),
      (t.parent = this),
      this.children.push(t),
      t.updateWorldMatrix(!1, !0),
      t.dispatchEvent(po),
      (ui.child = t),
      this.dispatchEvent(ui),
      (ui.child = null),
      this
    );
  }
  getObjectById(t) {
    return this.getObjectByProperty("id", t);
  }
  getObjectByName(t) {
    return this.getObjectByProperty("name", t);
  }
  getObjectByProperty(t, e) {
    if (this[t] === e) return this;
    for (let n = 0, s = this.children.length; n < s; n++) {
      const a = this.children[n].getObjectByProperty(t, e);
      if (a !== void 0) return a;
    }
  }
  getObjectsByProperty(t, e, n = []) {
    this[t] === e && n.push(this);
    const s = this.children;
    for (let r = 0, a = s.length; r < a; r++)
      s[r].getObjectsByProperty(t, e, n);
    return n;
  }
  getWorldPosition(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      t.setFromMatrixPosition(this.matrixWorld)
    );
  }
  getWorldQuaternion(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      this.matrixWorld.decompose(Hi, t, ah),
      t
    );
  }
  getWorldScale(t) {
    return (
      this.updateWorldMatrix(!0, !1),
      this.matrixWorld.decompose(Hi, oh, t),
      t
    );
  }
  getWorldDirection(t) {
    this.updateWorldMatrix(!0, !1);
    const e = this.matrixWorld.elements;
    return t.set(e[8], e[9], e[10]).normalize();
  }
  raycast() {}
  traverse(t) {
    t(this);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++) e[n].traverse(t);
  }
  traverseVisible(t) {
    if (this.visible === !1) return;
    t(this);
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++) e[n].traverseVisible(t);
  }
  traverseAncestors(t) {
    const e = this.parent;
    e !== null && (t(e), e.traverseAncestors(t));
  }
  updateMatrix() {
    (this.matrix.compose(this.position, this.quaternion, this.scale),
      (this.matrixWorldNeedsUpdate = !0));
  }
  updateMatrixWorld(t) {
    (this.matrixAutoUpdate && this.updateMatrix(),
      (this.matrixWorldNeedsUpdate || t) &&
        (this.matrixWorldAutoUpdate === !0 &&
          (this.parent === null
            ? this.matrixWorld.copy(this.matrix)
            : this.matrixWorld.multiplyMatrices(
                this.parent.matrixWorld,
                this.matrix,
              )),
        (this.matrixWorldNeedsUpdate = !1),
        (t = !0)));
    const e = this.children;
    for (let n = 0, s = e.length; n < s; n++) e[n].updateMatrixWorld(t);
  }
  updateWorldMatrix(t, e) {
    const n = this.parent;
    if (
      (t === !0 && n !== null && n.updateWorldMatrix(!0, !1),
      this.matrixAutoUpdate && this.updateMatrix(),
      this.matrixWorldAutoUpdate === !0 &&
        (this.parent === null
          ? this.matrixWorld.copy(this.matrix)
          : this.matrixWorld.multiplyMatrices(
              this.parent.matrixWorld,
              this.matrix,
            )),
      e === !0)
    ) {
      const s = this.children;
      for (let r = 0, a = s.length; r < a; r++) s[r].updateWorldMatrix(!1, !0);
    }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string",
      n = {};
    e &&
      ((t = {
        geometries: {},
        materials: {},
        textures: {},
        images: {},
        shapes: {},
        skeletons: {},
        animations: {},
        nodes: {},
      }),
      (n.metadata = {
        version: 4.6,
        type: "Object",
        generator: "Object3D.toJSON",
      }));
    const s = {};
    ((s.uuid = this.uuid),
      (s.type = this.type),
      this.name !== "" && (s.name = this.name),
      this.castShadow === !0 && (s.castShadow = !0),
      this.receiveShadow === !0 && (s.receiveShadow = !0),
      this.visible === !1 && (s.visible = !1),
      this.frustumCulled === !1 && (s.frustumCulled = !1),
      this.renderOrder !== 0 && (s.renderOrder = this.renderOrder),
      Object.keys(this.userData).length > 0 && (s.userData = this.userData),
      (s.layers = this.layers.mask),
      (s.matrix = this.matrix.toArray()),
      (s.up = this.up.toArray()),
      this.matrixAutoUpdate === !1 && (s.matrixAutoUpdate = !1),
      this.isInstancedMesh &&
        ((s.type = "InstancedMesh"),
        (s.count = this.count),
        (s.instanceMatrix = this.instanceMatrix.toJSON()),
        this.instanceColor !== null &&
          (s.instanceColor = this.instanceColor.toJSON())),
      this.isBatchedMesh &&
        ((s.type = "BatchedMesh"),
        (s.perObjectFrustumCulled = this.perObjectFrustumCulled),
        (s.sortObjects = this.sortObjects),
        (s.drawRanges = this._drawRanges),
        (s.reservedRanges = this._reservedRanges),
        (s.visibility = this._visibility),
        (s.active = this._active),
        (s.bounds = this._bounds.map((l) => ({
          boxInitialized: l.boxInitialized,
          boxMin: l.box.min.toArray(),
          boxMax: l.box.max.toArray(),
          sphereInitialized: l.sphereInitialized,
          sphereRadius: l.sphere.radius,
          sphereCenter: l.sphere.center.toArray(),
        }))),
        (s.maxInstanceCount = this._maxInstanceCount),
        (s.maxVertexCount = this._maxVertexCount),
        (s.maxIndexCount = this._maxIndexCount),
        (s.geometryInitialized = this._geometryInitialized),
        (s.geometryCount = this._geometryCount),
        (s.matricesTexture = this._matricesTexture.toJSON(t)),
        this._colorsTexture !== null &&
          (s.colorsTexture = this._colorsTexture.toJSON(t)),
        this.boundingSphere !== null &&
          (s.boundingSphere = {
            center: s.boundingSphere.center.toArray(),
            radius: s.boundingSphere.radius,
          }),
        this.boundingBox !== null &&
          (s.boundingBox = {
            min: s.boundingBox.min.toArray(),
            max: s.boundingBox.max.toArray(),
          })));
    function r(l, o) {
      return (l[o.uuid] === void 0 && (l[o.uuid] = o.toJSON(t)), o.uuid);
    }
    if (this.isScene)
      (this.background &&
        (this.background.isColor
          ? (s.background = this.background.toJSON())
          : this.background.isTexture &&
            (s.background = this.background.toJSON(t).uuid)),
        this.environment &&
          this.environment.isTexture &&
          this.environment.isRenderTargetTexture !== !0 &&
          (s.environment = this.environment.toJSON(t).uuid));
    else if (this.isMesh || this.isLine || this.isPoints) {
      s.geometry = r(t.geometries, this.geometry);
      const l = this.geometry.parameters;
      if (l !== void 0 && l.shapes !== void 0) {
        const o = l.shapes;
        if (Array.isArray(o))
          for (let c = 0, h = o.length; c < h; c++) {
            const d = o[c];
            r(t.shapes, d);
          }
        else r(t.shapes, o);
      }
    }
    if (
      (this.isSkinnedMesh &&
        ((s.bindMode = this.bindMode),
        (s.bindMatrix = this.bindMatrix.toArray()),
        this.skeleton !== void 0 &&
          (r(t.skeletons, this.skeleton), (s.skeleton = this.skeleton.uuid))),
      this.material !== void 0)
    )
      if (Array.isArray(this.material)) {
        const l = [];
        for (let o = 0, c = this.material.length; o < c; o++)
          l.push(r(t.materials, this.material[o]));
        s.material = l;
      } else s.material = r(t.materials, this.material);
    if (this.children.length > 0) {
      s.children = [];
      for (let l = 0; l < this.children.length; l++)
        s.children.push(this.children[l].toJSON(t).object);
    }
    if (this.animations.length > 0) {
      s.animations = [];
      for (let l = 0; l < this.animations.length; l++) {
        const o = this.animations[l];
        s.animations.push(r(t.animations, o));
      }
    }
    if (e) {
      const l = a(t.geometries),
        o = a(t.materials),
        c = a(t.textures),
        h = a(t.images),
        d = a(t.shapes),
        u = a(t.skeletons),
        m = a(t.animations),
        g = a(t.nodes);
      (l.length > 0 && (n.geometries = l),
        o.length > 0 && (n.materials = o),
        c.length > 0 && (n.textures = c),
        h.length > 0 && (n.images = h),
        d.length > 0 && (n.shapes = d),
        u.length > 0 && (n.skeletons = u),
        m.length > 0 && (n.animations = m),
        g.length > 0 && (n.nodes = g));
    }
    return ((n.object = s), n);
    function a(l) {
      const o = [];
      for (const c in l) {
        const h = l[c];
        (delete h.metadata, o.push(h));
      }
      return o;
    }
  }
  clone(t) {
    return new this.constructor().copy(this, t);
  }
  copy(t, e = !0) {
    if (
      ((this.name = t.name),
      this.up.copy(t.up),
      this.position.copy(t.position),
      (this.rotation.order = t.rotation.order),
      this.quaternion.copy(t.quaternion),
      this.scale.copy(t.scale),
      this.matrix.copy(t.matrix),
      this.matrixWorld.copy(t.matrixWorld),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      (this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate),
      (this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate),
      (this.layers.mask = t.layers.mask),
      (this.visible = t.visible),
      (this.castShadow = t.castShadow),
      (this.receiveShadow = t.receiveShadow),
      (this.frustumCulled = t.frustumCulled),
      (this.renderOrder = t.renderOrder),
      (this.animations = t.animations.slice()),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      e === !0)
    )
      for (let n = 0; n < t.children.length; n++) {
        const s = t.children[n];
        this.add(s.clone());
      }
    return this;
  }
}
ne.DEFAULT_UP = new b(0, 1, 0);
ne.DEFAULT_MATRIX_AUTO_UPDATE = !0;
ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
const Je = new b(),
  dn = new b(),
  sr = new b(),
  fn = new b(),
  di = new b(),
  fi = new b(),
  mo = new b(),
  rr = new b(),
  ar = new b(),
  or = new b(),
  lr = new ee(),
  cr = new ee(),
  hr = new ee();
class Qe {
  constructor(t = new b(), e = new b(), n = new b()) {
    ((this.a = t), (this.b = e), (this.c = n));
  }
  static getNormal(t, e, n, s) {
    (s.subVectors(n, e), Je.subVectors(t, e), s.cross(Je));
    const r = s.lengthSq();
    return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
  }
  static getBarycoord(t, e, n, s, r) {
    (Je.subVectors(s, e), dn.subVectors(n, e), sr.subVectors(t, e));
    const a = Je.dot(Je),
      l = Je.dot(dn),
      o = Je.dot(sr),
      c = dn.dot(dn),
      h = dn.dot(sr),
      d = a * c - l * l;
    if (d === 0) return (r.set(0, 0, 0), null);
    const u = 1 / d,
      m = (c * o - l * h) * u,
      g = (a * h - l * o) * u;
    return r.set(1 - m - g, g, m);
  }
  static containsPoint(t, e, n, s) {
    return this.getBarycoord(t, e, n, s, fn) === null
      ? !1
      : fn.x >= 0 && fn.y >= 0 && fn.x + fn.y <= 1;
  }
  static getInterpolation(t, e, n, s, r, a, l, o) {
    return this.getBarycoord(t, e, n, s, fn) === null
      ? ((o.x = 0),
        (o.y = 0),
        "z" in o && (o.z = 0),
        "w" in o && (o.w = 0),
        null)
      : (o.setScalar(0),
        o.addScaledVector(r, fn.x),
        o.addScaledVector(a, fn.y),
        o.addScaledVector(l, fn.z),
        o);
  }
  static getInterpolatedAttribute(t, e, n, s, r, a) {
    return (
      lr.setScalar(0),
      cr.setScalar(0),
      hr.setScalar(0),
      lr.fromBufferAttribute(t, e),
      cr.fromBufferAttribute(t, n),
      hr.fromBufferAttribute(t, s),
      a.setScalar(0),
      a.addScaledVector(lr, r.x),
      a.addScaledVector(cr, r.y),
      a.addScaledVector(hr, r.z),
      a
    );
  }
  static isFrontFacing(t, e, n, s) {
    return (Je.subVectors(n, e), dn.subVectors(t, e), Je.cross(dn).dot(s) < 0);
  }
  set(t, e, n) {
    return (this.a.copy(t), this.b.copy(e), this.c.copy(n), this);
  }
  setFromPointsAndIndices(t, e, n, s) {
    return (this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[s]), this);
  }
  setFromAttributeAndIndices(t, e, n, s) {
    return (
      this.a.fromBufferAttribute(t, e),
      this.b.fromBufferAttribute(t, n),
      this.c.fromBufferAttribute(t, s),
      this
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    return (this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this);
  }
  getArea() {
    return (
      Je.subVectors(this.c, this.b),
      dn.subVectors(this.a, this.b),
      Je.cross(dn).length() * 0.5
    );
  }
  getMidpoint(t) {
    return t
      .addVectors(this.a, this.b)
      .add(this.c)
      .multiplyScalar(1 / 3);
  }
  getNormal(t) {
    return Qe.getNormal(this.a, this.b, this.c, t);
  }
  getPlane(t) {
    return t.setFromCoplanarPoints(this.a, this.b, this.c);
  }
  getBarycoord(t, e) {
    return Qe.getBarycoord(t, this.a, this.b, this.c, e);
  }
  getInterpolation(t, e, n, s, r) {
    return Qe.getInterpolation(t, this.a, this.b, this.c, e, n, s, r);
  }
  containsPoint(t) {
    return Qe.containsPoint(t, this.a, this.b, this.c);
  }
  isFrontFacing(t) {
    return Qe.isFrontFacing(this.a, this.b, this.c, t);
  }
  intersectsBox(t) {
    return t.intersectsTriangle(this);
  }
  closestPointToPoint(t, e) {
    const n = this.a,
      s = this.b,
      r = this.c;
    let a, l;
    (di.subVectors(s, n), fi.subVectors(r, n), rr.subVectors(t, n));
    const o = di.dot(rr),
      c = fi.dot(rr);
    if (o <= 0 && c <= 0) return e.copy(n);
    ar.subVectors(t, s);
    const h = di.dot(ar),
      d = fi.dot(ar);
    if (h >= 0 && d <= h) return e.copy(s);
    const u = o * d - h * c;
    if (u <= 0 && o >= 0 && h <= 0)
      return ((a = o / (o - h)), e.copy(n).addScaledVector(di, a));
    or.subVectors(t, r);
    const m = di.dot(or),
      g = fi.dot(or);
    if (g >= 0 && m <= g) return e.copy(r);
    const v = m * c - o * g;
    if (v <= 0 && c >= 0 && g <= 0)
      return ((l = c / (c - g)), e.copy(n).addScaledVector(fi, l));
    const p = h * g - m * d;
    if (p <= 0 && d - h >= 0 && m - g >= 0)
      return (
        mo.subVectors(r, s),
        (l = (d - h) / (d - h + (m - g))),
        e.copy(s).addScaledVector(mo, l)
      );
    const f = 1 / (p + v + u);
    return (
      (a = v * f),
      (l = u * f),
      e.copy(n).addScaledVector(di, a).addScaledVector(fi, l)
    );
  }
  equals(t) {
    return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c);
  }
}
const Tl = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  },
  Cn = { h: 0, s: 0, l: 0 },
  fs = { h: 0, s: 0, l: 0 };
function ur(i, t, e) {
  return (
    e < 0 && (e += 1),
    e > 1 && (e -= 1),
    e < 1 / 6
      ? i + (t - i) * 6 * e
      : e < 1 / 2
        ? t
        : e < 2 / 3
          ? i + (t - i) * 6 * (2 / 3 - e)
          : i
  );
}
class Pt {
  constructor(t, e, n) {
    return (
      (this.isColor = !0),
      (this.r = 1),
      (this.g = 1),
      (this.b = 1),
      this.set(t, e, n)
    );
  }
  set(t, e, n) {
    if (e === void 0 && n === void 0) {
      const s = t;
      s && s.isColor
        ? this.copy(s)
        : typeof s == "number"
          ? this.setHex(s)
          : typeof s == "string" && this.setStyle(s);
    } else this.setRGB(t, e, n);
    return this;
  }
  setScalar(t) {
    return ((this.r = t), (this.g = t), (this.b = t), this);
  }
  setHex(t, e = Xe) {
    return (
      (t = Math.floor(t)),
      (this.r = ((t >> 16) & 255) / 255),
      (this.g = ((t >> 8) & 255) / 255),
      (this.b = (t & 255) / 255),
      Xt.toWorkingColorSpace(this, e),
      this
    );
  }
  setRGB(t, e, n, s = Xt.workingColorSpace) {
    return (
      (this.r = t),
      (this.g = e),
      (this.b = n),
      Xt.toWorkingColorSpace(this, s),
      this
    );
  }
  setHSL(t, e, n, s = Xt.workingColorSpace) {
    if (((t = Ca(t, 1)), (e = Re(e, 0, 1)), (n = Re(n, 0, 1)), e === 0))
      this.r = this.g = this.b = n;
    else {
      const r = n <= 0.5 ? n * (1 + e) : n + e - n * e,
        a = 2 * n - r;
      ((this.r = ur(a, r, t + 1 / 3)),
        (this.g = ur(a, r, t)),
        (this.b = ur(a, r, t - 1 / 3)));
    }
    return (Xt.toWorkingColorSpace(this, s), this);
  }
  setStyle(t, e = Xe) {
    function n(r) {
      r !== void 0 &&
        parseFloat(r) < 1 &&
        console.warn(
          "THREE.Color: Alpha component of " + t + " will be ignored.",
        );
    }
    let s;
    if ((s = /^(\w+)\(([^\)]*)\)/.exec(t))) {
      let r;
      const a = s[1],
        l = s[2];
      switch (a) {
        case "rgb":
        case "rgba":
          if (
            (r =
              /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                l,
              ))
          )
            return (
              n(r[4]),
              this.setRGB(
                Math.min(255, parseInt(r[1], 10)) / 255,
                Math.min(255, parseInt(r[2], 10)) / 255,
                Math.min(255, parseInt(r[3], 10)) / 255,
                e,
              )
            );
          if (
            (r =
              /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                l,
              ))
          )
            return (
              n(r[4]),
              this.setRGB(
                Math.min(100, parseInt(r[1], 10)) / 100,
                Math.min(100, parseInt(r[2], 10)) / 100,
                Math.min(100, parseInt(r[3], 10)) / 100,
                e,
              )
            );
          break;
        case "hsl":
        case "hsla":
          if (
            (r =
              /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                l,
              ))
          )
            return (
              n(r[4]),
              this.setHSL(
                parseFloat(r[1]) / 360,
                parseFloat(r[2]) / 100,
                parseFloat(r[3]) / 100,
                e,
              )
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + t);
      }
    } else if ((s = /^\#([A-Fa-f\d]+)$/.exec(t))) {
      const r = s[1],
        a = r.length;
      if (a === 3)
        return this.setRGB(
          parseInt(r.charAt(0), 16) / 15,
          parseInt(r.charAt(1), 16) / 15,
          parseInt(r.charAt(2), 16) / 15,
          e,
        );
      if (a === 6) return this.setHex(parseInt(r, 16), e);
      console.warn("THREE.Color: Invalid hex color " + t);
    } else if (t && t.length > 0) return this.setColorName(t, e);
    return this;
  }
  setColorName(t, e = Xe) {
    const n = Tl[t.toLowerCase()];
    return (
      n !== void 0
        ? this.setHex(n, e)
        : console.warn("THREE.Color: Unknown color " + t),
      this
    );
  }
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  copy(t) {
    return ((this.r = t.r), (this.g = t.g), (this.b = t.b), this);
  }
  copySRGBToLinear(t) {
    return ((this.r = xn(t.r)), (this.g = xn(t.g)), (this.b = xn(t.b)), this);
  }
  copyLinearToSRGB(t) {
    return ((this.r = Ti(t.r)), (this.g = Ti(t.g)), (this.b = Ti(t.b)), this);
  }
  convertSRGBToLinear() {
    return (this.copySRGBToLinear(this), this);
  }
  convertLinearToSRGB() {
    return (this.copyLinearToSRGB(this), this);
  }
  getHex(t = Xe) {
    return (
      Xt.fromWorkingColorSpace(Se.copy(this), t),
      Math.round(Re(Se.r * 255, 0, 255)) * 65536 +
        Math.round(Re(Se.g * 255, 0, 255)) * 256 +
        Math.round(Re(Se.b * 255, 0, 255))
    );
  }
  getHexString(t = Xe) {
    return ("000000" + this.getHex(t).toString(16)).slice(-6);
  }
  getHSL(t, e = Xt.workingColorSpace) {
    Xt.fromWorkingColorSpace(Se.copy(this), e);
    const n = Se.r,
      s = Se.g,
      r = Se.b,
      a = Math.max(n, s, r),
      l = Math.min(n, s, r);
    let o, c;
    const h = (l + a) / 2;
    if (l === a) ((o = 0), (c = 0));
    else {
      const d = a - l;
      switch (((c = h <= 0.5 ? d / (a + l) : d / (2 - a - l)), a)) {
        case n:
          o = (s - r) / d + (s < r ? 6 : 0);
          break;
        case s:
          o = (r - n) / d + 2;
          break;
        case r:
          o = (n - s) / d + 4;
          break;
      }
      o /= 6;
    }
    return ((t.h = o), (t.s = c), (t.l = h), t);
  }
  getRGB(t, e = Xt.workingColorSpace) {
    return (
      Xt.fromWorkingColorSpace(Se.copy(this), e),
      (t.r = Se.r),
      (t.g = Se.g),
      (t.b = Se.b),
      t
    );
  }
  getStyle(t = Xe) {
    Xt.fromWorkingColorSpace(Se.copy(this), t);
    const e = Se.r,
      n = Se.g,
      s = Se.b;
    return t !== Xe
      ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`
      : `rgb(${Math.round(e * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
  }
  offsetHSL(t, e, n) {
    return (this.getHSL(Cn), this.setHSL(Cn.h + t, Cn.s + e, Cn.l + n));
  }
  add(t) {
    return ((this.r += t.r), (this.g += t.g), (this.b += t.b), this);
  }
  addColors(t, e) {
    return (
      (this.r = t.r + e.r),
      (this.g = t.g + e.g),
      (this.b = t.b + e.b),
      this
    );
  }
  addScalar(t) {
    return ((this.r += t), (this.g += t), (this.b += t), this);
  }
  sub(t) {
    return (
      (this.r = Math.max(0, this.r - t.r)),
      (this.g = Math.max(0, this.g - t.g)),
      (this.b = Math.max(0, this.b - t.b)),
      this
    );
  }
  multiply(t) {
    return ((this.r *= t.r), (this.g *= t.g), (this.b *= t.b), this);
  }
  multiplyScalar(t) {
    return ((this.r *= t), (this.g *= t), (this.b *= t), this);
  }
  lerp(t, e) {
    return (
      (this.r += (t.r - this.r) * e),
      (this.g += (t.g - this.g) * e),
      (this.b += (t.b - this.b) * e),
      this
    );
  }
  lerpColors(t, e, n) {
    return (
      (this.r = t.r + (e.r - t.r) * n),
      (this.g = t.g + (e.g - t.g) * n),
      (this.b = t.b + (e.b - t.b) * n),
      this
    );
  }
  lerpHSL(t, e) {
    (this.getHSL(Cn), t.getHSL(fs));
    const n = $i(Cn.h, fs.h, e),
      s = $i(Cn.s, fs.s, e),
      r = $i(Cn.l, fs.l, e);
    return (this.setHSL(n, s, r), this);
  }
  setFromVector3(t) {
    return ((this.r = t.x), (this.g = t.y), (this.b = t.z), this);
  }
  applyMatrix3(t) {
    const e = this.r,
      n = this.g,
      s = this.b,
      r = t.elements;
    return (
      (this.r = r[0] * e + r[3] * n + r[6] * s),
      (this.g = r[1] * e + r[4] * n + r[7] * s),
      (this.b = r[2] * e + r[5] * n + r[8] * s),
      this
    );
  }
  equals(t) {
    return t.r === this.r && t.g === this.g && t.b === this.b;
  }
  fromArray(t, e = 0) {
    return ((this.r = t[e]), (this.g = t[e + 1]), (this.b = t[e + 2]), this);
  }
  toArray(t = [], e = 0) {
    return ((t[e] = this.r), (t[e + 1] = this.g), (t[e + 2] = this.b), t);
  }
  fromBufferAttribute(t, e) {
    return (
      (this.r = t.getX(e)),
      (this.g = t.getY(e)),
      (this.b = t.getZ(e)),
      this
    );
  }
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    (yield this.r, yield this.g, yield this.b);
  }
}
const Se = new Pt();
Pt.NAMES = Tl;
let ch = 0;
class ns extends Ii {
  static get type() {
    return "Material";
  }
  get type() {
    return this.constructor.type;
  }
  set type(t) {}
  constructor() {
    (super(),
      (this.isMaterial = !0),
      Object.defineProperty(this, "id", { value: ch++ }),
      (this.uuid = Ni()),
      (this.name = ""),
      (this.blending = $n),
      (this.side = Fn),
      (this.vertexColors = !1),
      (this.opacity = 1),
      (this.transparent = !1),
      (this.alphaHash = !1),
      (this.blendSrc = Lr),
      (this.blendDst = Dr),
      (this.blendEquation = Dn),
      (this.blendSrcAlpha = null),
      (this.blendDstAlpha = null),
      (this.blendEquationAlpha = null),
      (this.blendColor = new Pt(0, 0, 0)),
      (this.blendAlpha = 0),
      (this.depthFunc = bi),
      (this.depthTest = !0),
      (this.depthWrite = !0),
      (this.stencilWriteMask = 255),
      (this.stencilFunc = $a),
      (this.stencilRef = 0),
      (this.stencilFuncMask = 255),
      (this.stencilFail = si),
      (this.stencilZFail = si),
      (this.stencilZPass = si),
      (this.stencilWrite = !1),
      (this.clippingPlanes = null),
      (this.clipIntersection = !1),
      (this.clipShadows = !1),
      (this.shadowSide = null),
      (this.colorWrite = !0),
      (this.precision = null),
      (this.polygonOffset = !1),
      (this.polygonOffsetFactor = 0),
      (this.polygonOffsetUnits = 0),
      (this.dithering = !1),
      (this.alphaToCoverage = !1),
      (this.premultipliedAlpha = !1),
      (this.forceSinglePass = !1),
      (this.visible = !0),
      (this.toneMapped = !0),
      (this.userData = {}),
      (this.version = 0),
      (this._alphaTest = 0));
  }
  get alphaTest() {
    return this._alphaTest;
  }
  set alphaTest(t) {
    (this._alphaTest > 0 != t > 0 && this.version++, (this._alphaTest = t));
  }
  onBeforeRender() {}
  onBeforeCompile() {}
  customProgramCacheKey() {
    return this.onBeforeCompile.toString();
  }
  setValues(t) {
    if (t !== void 0)
      for (const e in t) {
        const n = t[e];
        if (n === void 0) {
          console.warn(
            `THREE.Material: parameter '${e}' has value of undefined.`,
          );
          continue;
        }
        const s = this[e];
        if (s === void 0) {
          console.warn(
            `THREE.Material: '${e}' is not a property of THREE.${this.type}.`,
          );
          continue;
        }
        s && s.isColor
          ? s.set(n)
          : s && s.isVector3 && n && n.isVector3
            ? s.copy(n)
            : (this[e] = n);
      }
  }
  toJSON(t) {
    const e = t === void 0 || typeof t == "string";
    e && (t = { textures: {}, images: {} });
    const n = {
      metadata: {
        version: 4.6,
        type: "Material",
        generator: "Material.toJSON",
      },
    };
    ((n.uuid = this.uuid),
      (n.type = this.type),
      this.name !== "" && (n.name = this.name),
      this.color && this.color.isColor && (n.color = this.color.getHex()),
      this.roughness !== void 0 && (n.roughness = this.roughness),
      this.metalness !== void 0 && (n.metalness = this.metalness),
      this.sheen !== void 0 && (n.sheen = this.sheen),
      this.sheenColor &&
        this.sheenColor.isColor &&
        (n.sheenColor = this.sheenColor.getHex()),
      this.sheenRoughness !== void 0 &&
        (n.sheenRoughness = this.sheenRoughness),
      this.emissive &&
        this.emissive.isColor &&
        (n.emissive = this.emissive.getHex()),
      this.emissiveIntensity !== void 0 &&
        this.emissiveIntensity !== 1 &&
        (n.emissiveIntensity = this.emissiveIntensity),
      this.specular &&
        this.specular.isColor &&
        (n.specular = this.specular.getHex()),
      this.specularIntensity !== void 0 &&
        (n.specularIntensity = this.specularIntensity),
      this.specularColor &&
        this.specularColor.isColor &&
        (n.specularColor = this.specularColor.getHex()),
      this.shininess !== void 0 && (n.shininess = this.shininess),
      this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat),
      this.clearcoatRoughness !== void 0 &&
        (n.clearcoatRoughness = this.clearcoatRoughness),
      this.clearcoatMap &&
        this.clearcoatMap.isTexture &&
        (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid),
      this.clearcoatRoughnessMap &&
        this.clearcoatRoughnessMap.isTexture &&
        (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid),
      this.clearcoatNormalMap &&
        this.clearcoatNormalMap.isTexture &&
        ((n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid),
        (n.clearcoatNormalScale = this.clearcoatNormalScale.toArray())),
      this.dispersion !== void 0 && (n.dispersion = this.dispersion),
      this.iridescence !== void 0 && (n.iridescence = this.iridescence),
      this.iridescenceIOR !== void 0 &&
        (n.iridescenceIOR = this.iridescenceIOR),
      this.iridescenceThicknessRange !== void 0 &&
        (n.iridescenceThicknessRange = this.iridescenceThicknessRange),
      this.iridescenceMap &&
        this.iridescenceMap.isTexture &&
        (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid),
      this.iridescenceThicknessMap &&
        this.iridescenceThicknessMap.isTexture &&
        (n.iridescenceThicknessMap =
          this.iridescenceThicknessMap.toJSON(t).uuid),
      this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy),
      this.anisotropyRotation !== void 0 &&
        (n.anisotropyRotation = this.anisotropyRotation),
      this.anisotropyMap &&
        this.anisotropyMap.isTexture &&
        (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid),
      this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid),
      this.matcap &&
        this.matcap.isTexture &&
        (n.matcap = this.matcap.toJSON(t).uuid),
      this.alphaMap &&
        this.alphaMap.isTexture &&
        (n.alphaMap = this.alphaMap.toJSON(t).uuid),
      this.lightMap &&
        this.lightMap.isTexture &&
        ((n.lightMap = this.lightMap.toJSON(t).uuid),
        (n.lightMapIntensity = this.lightMapIntensity)),
      this.aoMap &&
        this.aoMap.isTexture &&
        ((n.aoMap = this.aoMap.toJSON(t).uuid),
        (n.aoMapIntensity = this.aoMapIntensity)),
      this.bumpMap &&
        this.bumpMap.isTexture &&
        ((n.bumpMap = this.bumpMap.toJSON(t).uuid),
        (n.bumpScale = this.bumpScale)),
      this.normalMap &&
        this.normalMap.isTexture &&
        ((n.normalMap = this.normalMap.toJSON(t).uuid),
        (n.normalMapType = this.normalMapType),
        (n.normalScale = this.normalScale.toArray())),
      this.displacementMap &&
        this.displacementMap.isTexture &&
        ((n.displacementMap = this.displacementMap.toJSON(t).uuid),
        (n.displacementScale = this.displacementScale),
        (n.displacementBias = this.displacementBias)),
      this.roughnessMap &&
        this.roughnessMap.isTexture &&
        (n.roughnessMap = this.roughnessMap.toJSON(t).uuid),
      this.metalnessMap &&
        this.metalnessMap.isTexture &&
        (n.metalnessMap = this.metalnessMap.toJSON(t).uuid),
      this.emissiveMap &&
        this.emissiveMap.isTexture &&
        (n.emissiveMap = this.emissiveMap.toJSON(t).uuid),
      this.specularMap &&
        this.specularMap.isTexture &&
        (n.specularMap = this.specularMap.toJSON(t).uuid),
      this.specularIntensityMap &&
        this.specularIntensityMap.isTexture &&
        (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid),
      this.specularColorMap &&
        this.specularColorMap.isTexture &&
        (n.specularColorMap = this.specularColorMap.toJSON(t).uuid),
      this.envMap &&
        this.envMap.isTexture &&
        ((n.envMap = this.envMap.toJSON(t).uuid),
        this.combine !== void 0 && (n.combine = this.combine)),
      this.envMapRotation !== void 0 &&
        (n.envMapRotation = this.envMapRotation.toArray()),
      this.envMapIntensity !== void 0 &&
        (n.envMapIntensity = this.envMapIntensity),
      this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity),
      this.refractionRatio !== void 0 &&
        (n.refractionRatio = this.refractionRatio),
      this.gradientMap &&
        this.gradientMap.isTexture &&
        (n.gradientMap = this.gradientMap.toJSON(t).uuid),
      this.transmission !== void 0 && (n.transmission = this.transmission),
      this.transmissionMap &&
        this.transmissionMap.isTexture &&
        (n.transmissionMap = this.transmissionMap.toJSON(t).uuid),
      this.thickness !== void 0 && (n.thickness = this.thickness),
      this.thicknessMap &&
        this.thicknessMap.isTexture &&
        (n.thicknessMap = this.thicknessMap.toJSON(t).uuid),
      this.attenuationDistance !== void 0 &&
        this.attenuationDistance !== 1 / 0 &&
        (n.attenuationDistance = this.attenuationDistance),
      this.attenuationColor !== void 0 &&
        (n.attenuationColor = this.attenuationColor.getHex()),
      this.size !== void 0 && (n.size = this.size),
      this.shadowSide !== null && (n.shadowSide = this.shadowSide),
      this.sizeAttenuation !== void 0 &&
        (n.sizeAttenuation = this.sizeAttenuation),
      this.blending !== $n && (n.blending = this.blending),
      this.side !== Fn && (n.side = this.side),
      this.vertexColors === !0 && (n.vertexColors = !0),
      this.opacity < 1 && (n.opacity = this.opacity),
      this.transparent === !0 && (n.transparent = !0),
      this.blendSrc !== Lr && (n.blendSrc = this.blendSrc),
      this.blendDst !== Dr && (n.blendDst = this.blendDst),
      this.blendEquation !== Dn && (n.blendEquation = this.blendEquation),
      this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha),
      this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha),
      this.blendEquationAlpha !== null &&
        (n.blendEquationAlpha = this.blendEquationAlpha),
      this.blendColor &&
        this.blendColor.isColor &&
        (n.blendColor = this.blendColor.getHex()),
      this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha),
      this.depthFunc !== bi && (n.depthFunc = this.depthFunc),
      this.depthTest === !1 && (n.depthTest = this.depthTest),
      this.depthWrite === !1 && (n.depthWrite = this.depthWrite),
      this.colorWrite === !1 && (n.colorWrite = this.colorWrite),
      this.stencilWriteMask !== 255 &&
        (n.stencilWriteMask = this.stencilWriteMask),
      this.stencilFunc !== $a && (n.stencilFunc = this.stencilFunc),
      this.stencilRef !== 0 && (n.stencilRef = this.stencilRef),
      this.stencilFuncMask !== 255 &&
        (n.stencilFuncMask = this.stencilFuncMask),
      this.stencilFail !== si && (n.stencilFail = this.stencilFail),
      this.stencilZFail !== si && (n.stencilZFail = this.stencilZFail),
      this.stencilZPass !== si && (n.stencilZPass = this.stencilZPass),
      this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite),
      this.rotation !== void 0 &&
        this.rotation !== 0 &&
        (n.rotation = this.rotation),
      this.polygonOffset === !0 && (n.polygonOffset = !0),
      this.polygonOffsetFactor !== 0 &&
        (n.polygonOffsetFactor = this.polygonOffsetFactor),
      this.polygonOffsetUnits !== 0 &&
        (n.polygonOffsetUnits = this.polygonOffsetUnits),
      this.linewidth !== void 0 &&
        this.linewidth !== 1 &&
        (n.linewidth = this.linewidth),
      this.dashSize !== void 0 && (n.dashSize = this.dashSize),
      this.gapSize !== void 0 && (n.gapSize = this.gapSize),
      this.scale !== void 0 && (n.scale = this.scale),
      this.dithering === !0 && (n.dithering = !0),
      this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
      this.alphaHash === !0 && (n.alphaHash = !0),
      this.alphaToCoverage === !0 && (n.alphaToCoverage = !0),
      this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0),
      this.forceSinglePass === !0 && (n.forceSinglePass = !0),
      this.wireframe === !0 && (n.wireframe = !0),
      this.wireframeLinewidth > 1 &&
        (n.wireframeLinewidth = this.wireframeLinewidth),
      this.wireframeLinecap !== "round" &&
        (n.wireframeLinecap = this.wireframeLinecap),
      this.wireframeLinejoin !== "round" &&
        (n.wireframeLinejoin = this.wireframeLinejoin),
      this.flatShading === !0 && (n.flatShading = !0),
      this.visible === !1 && (n.visible = !1),
      this.toneMapped === !1 && (n.toneMapped = !1),
      this.fog === !1 && (n.fog = !1),
      Object.keys(this.userData).length > 0 && (n.userData = this.userData));
    function s(r) {
      const a = [];
      for (const l in r) {
        const o = r[l];
        (delete o.metadata, a.push(o));
      }
      return a;
    }
    if (e) {
      const r = s(t.textures),
        a = s(t.images);
      (r.length > 0 && (n.textures = r), a.length > 0 && (n.images = a));
    }
    return n;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    ((this.name = t.name),
      (this.blending = t.blending),
      (this.side = t.side),
      (this.vertexColors = t.vertexColors),
      (this.opacity = t.opacity),
      (this.transparent = t.transparent),
      (this.blendSrc = t.blendSrc),
      (this.blendDst = t.blendDst),
      (this.blendEquation = t.blendEquation),
      (this.blendSrcAlpha = t.blendSrcAlpha),
      (this.blendDstAlpha = t.blendDstAlpha),
      (this.blendEquationAlpha = t.blendEquationAlpha),
      this.blendColor.copy(t.blendColor),
      (this.blendAlpha = t.blendAlpha),
      (this.depthFunc = t.depthFunc),
      (this.depthTest = t.depthTest),
      (this.depthWrite = t.depthWrite),
      (this.stencilWriteMask = t.stencilWriteMask),
      (this.stencilFunc = t.stencilFunc),
      (this.stencilRef = t.stencilRef),
      (this.stencilFuncMask = t.stencilFuncMask),
      (this.stencilFail = t.stencilFail),
      (this.stencilZFail = t.stencilZFail),
      (this.stencilZPass = t.stencilZPass),
      (this.stencilWrite = t.stencilWrite));
    const e = t.clippingPlanes;
    let n = null;
    if (e !== null) {
      const s = e.length;
      n = new Array(s);
      for (let r = 0; r !== s; ++r) n[r] = e[r].clone();
    }
    return (
      (this.clippingPlanes = n),
      (this.clipIntersection = t.clipIntersection),
      (this.clipShadows = t.clipShadows),
      (this.shadowSide = t.shadowSide),
      (this.colorWrite = t.colorWrite),
      (this.precision = t.precision),
      (this.polygonOffset = t.polygonOffset),
      (this.polygonOffsetFactor = t.polygonOffsetFactor),
      (this.polygonOffsetUnits = t.polygonOffsetUnits),
      (this.dithering = t.dithering),
      (this.alphaTest = t.alphaTest),
      (this.alphaHash = t.alphaHash),
      (this.alphaToCoverage = t.alphaToCoverage),
      (this.premultipliedAlpha = t.premultipliedAlpha),
      (this.forceSinglePass = t.forceSinglePass),
      (this.visible = t.visible),
      (this.toneMapped = t.toneMapped),
      (this.userData = JSON.parse(JSON.stringify(t.userData))),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  onBuild() {
    console.warn("Material: onBuild() has been removed.");
  }
}
class Zi extends ns {
  static get type() {
    return "MeshBasicMaterial";
  }
  constructor(t) {
    (super(),
      (this.isMeshBasicMaterial = !0),
      (this.color = new Pt(16777215)),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.specularMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new Ee()),
      (this.combine = ol),
      (this.reflectivity = 1),
      (this.refractionRatio = 0.98),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.fog = !0),
      this.setValues(t));
  }
  copy(t) {
    return (
      super.copy(t),
      this.color.copy(t.color),
      (this.map = t.map),
      (this.lightMap = t.lightMap),
      (this.lightMapIntensity = t.lightMapIntensity),
      (this.aoMap = t.aoMap),
      (this.aoMapIntensity = t.aoMapIntensity),
      (this.specularMap = t.specularMap),
      (this.alphaMap = t.alphaMap),
      (this.envMap = t.envMap),
      this.envMapRotation.copy(t.envMapRotation),
      (this.combine = t.combine),
      (this.reflectivity = t.reflectivity),
      (this.refractionRatio = t.refractionRatio),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      (this.wireframeLinecap = t.wireframeLinecap),
      (this.wireframeLinejoin = t.wireframeLinejoin),
      (this.fog = t.fog),
      this
    );
  }
}
const me = new b(),
  ps = new It();
class Ye {
  constructor(t, e, n = !1) {
    if (Array.isArray(t))
      throw new TypeError(
        "THREE.BufferAttribute: array should be a Typed Array.",
      );
    ((this.isBufferAttribute = !0),
      (this.name = ""),
      (this.array = t),
      (this.itemSize = e),
      (this.count = t !== void 0 ? t.length / e : 0),
      (this.normalized = n),
      (this.usage = Za),
      (this.updateRanges = []),
      (this.gpuType = rn),
      (this.version = 0));
  }
  onUploadCallback() {}
  set needsUpdate(t) {
    t === !0 && this.version++;
  }
  setUsage(t) {
    return ((this.usage = t), this);
  }
  addUpdateRange(t, e) {
    this.updateRanges.push({ start: t, count: e });
  }
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  copy(t) {
    return (
      (this.name = t.name),
      (this.array = new t.array.constructor(t.array)),
      (this.itemSize = t.itemSize),
      (this.count = t.count),
      (this.normalized = t.normalized),
      (this.usage = t.usage),
      (this.gpuType = t.gpuType),
      this
    );
  }
  copyAt(t, e, n) {
    ((t *= this.itemSize), (n *= e.itemSize));
    for (let s = 0, r = this.itemSize; s < r; s++)
      this.array[t + s] = e.array[n + s];
    return this;
  }
  copyArray(t) {
    return (this.array.set(t), this);
  }
  applyMatrix3(t) {
    if (this.itemSize === 2)
      for (let e = 0, n = this.count; e < n; e++)
        (ps.fromBufferAttribute(this, e),
          ps.applyMatrix3(t),
          this.setXY(e, ps.x, ps.y));
    else if (this.itemSize === 3)
      for (let e = 0, n = this.count; e < n; e++)
        (me.fromBufferAttribute(this, e),
          me.applyMatrix3(t),
          this.setXYZ(e, me.x, me.y, me.z));
    return this;
  }
  applyMatrix4(t) {
    for (let e = 0, n = this.count; e < n; e++)
      (me.fromBufferAttribute(this, e),
        me.applyMatrix4(t),
        this.setXYZ(e, me.x, me.y, me.z));
    return this;
  }
  applyNormalMatrix(t) {
    for (let e = 0, n = this.count; e < n; e++)
      (me.fromBufferAttribute(this, e),
        me.applyNormalMatrix(t),
        this.setXYZ(e, me.x, me.y, me.z));
    return this;
  }
  transformDirection(t) {
    for (let e = 0, n = this.count; e < n; e++)
      (me.fromBufferAttribute(this, e),
        me.transformDirection(t),
        this.setXYZ(e, me.x, me.y, me.z));
    return this;
  }
  set(t, e = 0) {
    return (this.array.set(t, e), this);
  }
  getComponent(t, e) {
    let n = this.array[t * this.itemSize + e];
    return (this.normalized && (n = yi(n, this.array)), n);
  }
  setComponent(t, e, n) {
    return (
      this.normalized && (n = we(n, this.array)),
      (this.array[t * this.itemSize + e] = n),
      this
    );
  }
  getX(t) {
    let e = this.array[t * this.itemSize];
    return (this.normalized && (e = yi(e, this.array)), e);
  }
  setX(t, e) {
    return (
      this.normalized && (e = we(e, this.array)),
      (this.array[t * this.itemSize] = e),
      this
    );
  }
  getY(t) {
    let e = this.array[t * this.itemSize + 1];
    return (this.normalized && (e = yi(e, this.array)), e);
  }
  setY(t, e) {
    return (
      this.normalized && (e = we(e, this.array)),
      (this.array[t * this.itemSize + 1] = e),
      this
    );
  }
  getZ(t) {
    let e = this.array[t * this.itemSize + 2];
    return (this.normalized && (e = yi(e, this.array)), e);
  }
  setZ(t, e) {
    return (
      this.normalized && (e = we(e, this.array)),
      (this.array[t * this.itemSize + 2] = e),
      this
    );
  }
  getW(t) {
    let e = this.array[t * this.itemSize + 3];
    return (this.normalized && (e = yi(e, this.array)), e);
  }
  setW(t, e) {
    return (
      this.normalized && (e = we(e, this.array)),
      (this.array[t * this.itemSize + 3] = e),
      this
    );
  }
  setXY(t, e, n) {
    return (
      (t *= this.itemSize),
      this.normalized && ((e = we(e, this.array)), (n = we(n, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      this
    );
  }
  setXYZ(t, e, n, s) {
    return (
      (t *= this.itemSize),
      this.normalized &&
        ((e = we(e, this.array)),
        (n = we(n, this.array)),
        (s = we(s, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      (this.array[t + 2] = s),
      this
    );
  }
  setXYZW(t, e, n, s, r) {
    return (
      (t *= this.itemSize),
      this.normalized &&
        ((e = we(e, this.array)),
        (n = we(n, this.array)),
        (s = we(s, this.array)),
        (r = we(r, this.array))),
      (this.array[t + 0] = e),
      (this.array[t + 1] = n),
      (this.array[t + 2] = s),
      (this.array[t + 3] = r),
      this
    );
  }
  onUpload(t) {
    return ((this.onUploadCallback = t), this);
  }
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  toJSON() {
    const t = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized,
    };
    return (
      this.name !== "" && (t.name = this.name),
      this.usage !== Za && (t.usage = this.usage),
      t
    );
  }
}
class bl extends Ye {
  constructor(t, e, n) {
    super(new Uint16Array(t), e, n);
  }
}
class Al extends Ye {
  constructor(t, e, n) {
    super(new Uint32Array(t), e, n);
  }
}
class he extends Ye {
  constructor(t, e, n) {
    super(new Float32Array(t), e, n);
  }
}
let hh = 0;
const We = new Zt(),
  dr = new ne(),
  pi = new b(),
  Oe = new ti(),
  Vi = new ti(),
  _e = new b();
class Le extends Ii {
  constructor() {
    (super(),
      (this.isBufferGeometry = !0),
      Object.defineProperty(this, "id", { value: hh++ }),
      (this.uuid = Ni()),
      (this.name = ""),
      (this.type = "BufferGeometry"),
      (this.index = null),
      (this.indirect = null),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.morphTargetsRelative = !1),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null),
      (this.drawRange = { start: 0, count: 1 / 0 }),
      (this.userData = {}));
  }
  getIndex() {
    return this.index;
  }
  setIndex(t) {
    return (
      Array.isArray(t)
        ? (this.index = new (yl(t) ? Al : bl)(t, 1))
        : (this.index = t),
      this
    );
  }
  setIndirect(t) {
    return ((this.indirect = t), this);
  }
  getIndirect() {
    return this.indirect;
  }
  getAttribute(t) {
    return this.attributes[t];
  }
  setAttribute(t, e) {
    return ((this.attributes[t] = e), this);
  }
  deleteAttribute(t) {
    return (delete this.attributes[t], this);
  }
  hasAttribute(t) {
    return this.attributes[t] !== void 0;
  }
  addGroup(t, e, n = 0) {
    this.groups.push({ start: t, count: e, materialIndex: n });
  }
  clearGroups() {
    this.groups = [];
  }
  setDrawRange(t, e) {
    ((this.drawRange.start = t), (this.drawRange.count = e));
  }
  applyMatrix4(t) {
    const e = this.attributes.position;
    e !== void 0 && (e.applyMatrix4(t), (e.needsUpdate = !0));
    const n = this.attributes.normal;
    if (n !== void 0) {
      const r = new zt().getNormalMatrix(t);
      (n.applyNormalMatrix(r), (n.needsUpdate = !0));
    }
    const s = this.attributes.tangent;
    return (
      s !== void 0 && (s.transformDirection(t), (s.needsUpdate = !0)),
      this.boundingBox !== null && this.computeBoundingBox(),
      this.boundingSphere !== null && this.computeBoundingSphere(),
      this
    );
  }
  applyQuaternion(t) {
    return (We.makeRotationFromQuaternion(t), this.applyMatrix4(We), this);
  }
  rotateX(t) {
    return (We.makeRotationX(t), this.applyMatrix4(We), this);
  }
  rotateY(t) {
    return (We.makeRotationY(t), this.applyMatrix4(We), this);
  }
  rotateZ(t) {
    return (We.makeRotationZ(t), this.applyMatrix4(We), this);
  }
  translate(t, e, n) {
    return (We.makeTranslation(t, e, n), this.applyMatrix4(We), this);
  }
  scale(t, e, n) {
    return (We.makeScale(t, e, n), this.applyMatrix4(We), this);
  }
  lookAt(t) {
    return (
      dr.lookAt(t),
      dr.updateMatrix(),
      this.applyMatrix4(dr.matrix),
      this
    );
  }
  center() {
    return (
      this.computeBoundingBox(),
      this.boundingBox.getCenter(pi).negate(),
      this.translate(pi.x, pi.y, pi.z),
      this
    );
  }
  setFromPoints(t) {
    const e = this.getAttribute("position");
    if (e === void 0) {
      const n = [];
      for (let s = 0, r = t.length; s < r; s++) {
        const a = t[s];
        n.push(a.x, a.y, a.z || 0);
      }
      this.setAttribute("position", new he(n, 3));
    } else {
      for (let n = 0, s = e.count; n < s; n++) {
        const r = t[n];
        e.setXYZ(n, r.x, r.y, r.z || 0);
      }
      (t.length > e.count &&
        console.warn(
          "THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.",
        ),
        (e.needsUpdate = !0));
    }
    return this;
  }
  computeBoundingBox() {
    this.boundingBox === null && (this.boundingBox = new ti());
    const t = this.attributes.position,
      e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      (console.error(
        "THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",
        this,
      ),
        this.boundingBox.set(
          new b(-1 / 0, -1 / 0, -1 / 0),
          new b(1 / 0, 1 / 0, 1 / 0),
        ));
      return;
    }
    if (t !== void 0) {
      if ((this.boundingBox.setFromBufferAttribute(t), e))
        for (let n = 0, s = e.length; n < s; n++) {
          const r = e[n];
          (Oe.setFromBufferAttribute(r),
            this.morphTargetsRelative
              ? (_e.addVectors(this.boundingBox.min, Oe.min),
                this.boundingBox.expandByPoint(_e),
                _e.addVectors(this.boundingBox.max, Oe.max),
                this.boundingBox.expandByPoint(_e))
              : (this.boundingBox.expandByPoint(Oe.min),
                this.boundingBox.expandByPoint(Oe.max)));
        }
    } else this.boundingBox.makeEmpty();
    (isNaN(this.boundingBox.min.x) ||
      isNaN(this.boundingBox.min.y) ||
      isNaN(this.boundingBox.min.z)) &&
      console.error(
        'THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
        this,
      );
  }
  computeBoundingSphere() {
    this.boundingSphere === null && (this.boundingSphere = new es());
    const t = this.attributes.position,
      e = this.morphAttributes.position;
    if (t && t.isGLBufferAttribute) {
      (console.error(
        "THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",
        this,
      ),
        this.boundingSphere.set(new b(), 1 / 0));
      return;
    }
    if (t) {
      const n = this.boundingSphere.center;
      if ((Oe.setFromBufferAttribute(t), e))
        for (let r = 0, a = e.length; r < a; r++) {
          const l = e[r];
          (Vi.setFromBufferAttribute(l),
            this.morphTargetsRelative
              ? (_e.addVectors(Oe.min, Vi.min),
                Oe.expandByPoint(_e),
                _e.addVectors(Oe.max, Vi.max),
                Oe.expandByPoint(_e))
              : (Oe.expandByPoint(Vi.min), Oe.expandByPoint(Vi.max)));
        }
      Oe.getCenter(n);
      let s = 0;
      for (let r = 0, a = t.count; r < a; r++)
        (_e.fromBufferAttribute(t, r),
          (s = Math.max(s, n.distanceToSquared(_e))));
      if (e)
        for (let r = 0, a = e.length; r < a; r++) {
          const l = e[r],
            o = this.morphTargetsRelative;
          for (let c = 0, h = l.count; c < h; c++)
            (_e.fromBufferAttribute(l, c),
              o && (pi.fromBufferAttribute(t, c), _e.add(pi)),
              (s = Math.max(s, n.distanceToSquared(_e))));
        }
      ((this.boundingSphere.radius = Math.sqrt(s)),
        isNaN(this.boundingSphere.radius) &&
          console.error(
            'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
            this,
          ));
    }
  }
  computeTangents() {
    const t = this.index,
      e = this.attributes;
    if (
      t === null ||
      e.position === void 0 ||
      e.normal === void 0 ||
      e.uv === void 0
    ) {
      console.error(
        "THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)",
      );
      return;
    }
    const n = e.position,
      s = e.normal,
      r = e.uv;
    this.hasAttribute("tangent") === !1 &&
      this.setAttribute("tangent", new Ye(new Float32Array(4 * n.count), 4));
    const a = this.getAttribute("tangent"),
      l = [],
      o = [];
    for (let C = 0; C < n.count; C++) ((l[C] = new b()), (o[C] = new b()));
    const c = new b(),
      h = new b(),
      d = new b(),
      u = new It(),
      m = new It(),
      g = new It(),
      v = new b(),
      p = new b();
    function f(C, S, y) {
      (c.fromBufferAttribute(n, C),
        h.fromBufferAttribute(n, S),
        d.fromBufferAttribute(n, y),
        u.fromBufferAttribute(r, C),
        m.fromBufferAttribute(r, S),
        g.fromBufferAttribute(r, y),
        h.sub(c),
        d.sub(c),
        m.sub(u),
        g.sub(u));
      const P = 1 / (m.x * g.y - g.x * m.y);
      isFinite(P) &&
        (v
          .copy(h)
          .multiplyScalar(g.y)
          .addScaledVector(d, -m.y)
          .multiplyScalar(P),
        p
          .copy(d)
          .multiplyScalar(m.x)
          .addScaledVector(h, -g.x)
          .multiplyScalar(P),
        l[C].add(v),
        l[S].add(v),
        l[y].add(v),
        o[C].add(p),
        o[S].add(p),
        o[y].add(p));
    }
    let w = this.groups;
    w.length === 0 && (w = [{ start: 0, count: t.count }]);
    for (let C = 0, S = w.length; C < S; ++C) {
      const y = w[C],
        P = y.start,
        z = y.count;
      for (let U = P, H = P + z; U < H; U += 3)
        f(t.getX(U + 0), t.getX(U + 1), t.getX(U + 2));
    }
    const M = new b(),
      _ = new b(),
      L = new b(),
      R = new b();
    function A(C) {
      (L.fromBufferAttribute(s, C), R.copy(L));
      const S = l[C];
      (M.copy(S),
        M.sub(L.multiplyScalar(L.dot(S))).normalize(),
        _.crossVectors(R, S));
      const P = _.dot(o[C]) < 0 ? -1 : 1;
      a.setXYZW(C, M.x, M.y, M.z, P);
    }
    for (let C = 0, S = w.length; C < S; ++C) {
      const y = w[C],
        P = y.start,
        z = y.count;
      for (let U = P, H = P + z; U < H; U += 3)
        (A(t.getX(U + 0)), A(t.getX(U + 1)), A(t.getX(U + 2)));
    }
  }
  computeVertexNormals() {
    const t = this.index,
      e = this.getAttribute("position");
    if (e !== void 0) {
      let n = this.getAttribute("normal");
      if (n === void 0)
        ((n = new Ye(new Float32Array(e.count * 3), 3)),
          this.setAttribute("normal", n));
      else for (let u = 0, m = n.count; u < m; u++) n.setXYZ(u, 0, 0, 0);
      const s = new b(),
        r = new b(),
        a = new b(),
        l = new b(),
        o = new b(),
        c = new b(),
        h = new b(),
        d = new b();
      if (t)
        for (let u = 0, m = t.count; u < m; u += 3) {
          const g = t.getX(u + 0),
            v = t.getX(u + 1),
            p = t.getX(u + 2);
          (s.fromBufferAttribute(e, g),
            r.fromBufferAttribute(e, v),
            a.fromBufferAttribute(e, p),
            h.subVectors(a, r),
            d.subVectors(s, r),
            h.cross(d),
            l.fromBufferAttribute(n, g),
            o.fromBufferAttribute(n, v),
            c.fromBufferAttribute(n, p),
            l.add(h),
            o.add(h),
            c.add(h),
            n.setXYZ(g, l.x, l.y, l.z),
            n.setXYZ(v, o.x, o.y, o.z),
            n.setXYZ(p, c.x, c.y, c.z));
        }
      else
        for (let u = 0, m = e.count; u < m; u += 3)
          (s.fromBufferAttribute(e, u + 0),
            r.fromBufferAttribute(e, u + 1),
            a.fromBufferAttribute(e, u + 2),
            h.subVectors(a, r),
            d.subVectors(s, r),
            h.cross(d),
            n.setXYZ(u + 0, h.x, h.y, h.z),
            n.setXYZ(u + 1, h.x, h.y, h.z),
            n.setXYZ(u + 2, h.x, h.y, h.z));
      (this.normalizeNormals(), (n.needsUpdate = !0));
    }
  }
  normalizeNormals() {
    const t = this.attributes.normal;
    for (let e = 0, n = t.count; e < n; e++)
      (_e.fromBufferAttribute(t, e),
        _e.normalize(),
        t.setXYZ(e, _e.x, _e.y, _e.z));
  }
  toNonIndexed() {
    function t(l, o) {
      const c = l.array,
        h = l.itemSize,
        d = l.normalized,
        u = new c.constructor(o.length * h);
      let m = 0,
        g = 0;
      for (let v = 0, p = o.length; v < p; v++) {
        l.isInterleavedBufferAttribute
          ? (m = o[v] * l.data.stride + l.offset)
          : (m = o[v] * h);
        for (let f = 0; f < h; f++) u[g++] = c[m++];
      }
      return new Ye(u, h, d);
    }
    if (this.index === null)
      return (
        console.warn(
          "THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.",
        ),
        this
      );
    const e = new Le(),
      n = this.index.array,
      s = this.attributes;
    for (const l in s) {
      const o = s[l],
        c = t(o, n);
      e.setAttribute(l, c);
    }
    const r = this.morphAttributes;
    for (const l in r) {
      const o = [],
        c = r[l];
      for (let h = 0, d = c.length; h < d; h++) {
        const u = c[h],
          m = t(u, n);
        o.push(m);
      }
      e.morphAttributes[l] = o;
    }
    e.morphTargetsRelative = this.morphTargetsRelative;
    const a = this.groups;
    for (let l = 0, o = a.length; l < o; l++) {
      const c = a[l];
      e.addGroup(c.start, c.count, c.materialIndex);
    }
    return e;
  }
  toJSON() {
    const t = {
      metadata: {
        version: 4.6,
        type: "BufferGeometry",
        generator: "BufferGeometry.toJSON",
      },
    };
    if (
      ((t.uuid = this.uuid),
      (t.type = this.type),
      this.name !== "" && (t.name = this.name),
      Object.keys(this.userData).length > 0 && (t.userData = this.userData),
      this.parameters !== void 0)
    ) {
      const o = this.parameters;
      for (const c in o) o[c] !== void 0 && (t[c] = o[c]);
      return t;
    }
    t.data = { attributes: {} };
    const e = this.index;
    e !== null &&
      (t.data.index = {
        type: e.array.constructor.name,
        array: Array.prototype.slice.call(e.array),
      });
    const n = this.attributes;
    for (const o in n) {
      const c = n[o];
      t.data.attributes[o] = c.toJSON(t.data);
    }
    const s = {};
    let r = !1;
    for (const o in this.morphAttributes) {
      const c = this.morphAttributes[o],
        h = [];
      for (let d = 0, u = c.length; d < u; d++) {
        const m = c[d];
        h.push(m.toJSON(t.data));
      }
      h.length > 0 && ((s[o] = h), (r = !0));
    }
    r &&
      ((t.data.morphAttributes = s),
      (t.data.morphTargetsRelative = this.morphTargetsRelative));
    const a = this.groups;
    a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
    const l = this.boundingSphere;
    return (
      l !== null &&
        (t.data.boundingSphere = {
          center: l.center.toArray(),
          radius: l.radius,
        }),
      t
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  copy(t) {
    ((this.index = null),
      (this.attributes = {}),
      (this.morphAttributes = {}),
      (this.groups = []),
      (this.boundingBox = null),
      (this.boundingSphere = null));
    const e = {};
    this.name = t.name;
    const n = t.index;
    n !== null && this.setIndex(n.clone(e));
    const s = t.attributes;
    for (const c in s) {
      const h = s[c];
      this.setAttribute(c, h.clone(e));
    }
    const r = t.morphAttributes;
    for (const c in r) {
      const h = [],
        d = r[c];
      for (let u = 0, m = d.length; u < m; u++) h.push(d[u].clone(e));
      this.morphAttributes[c] = h;
    }
    this.morphTargetsRelative = t.morphTargetsRelative;
    const a = t.groups;
    for (let c = 0, h = a.length; c < h; c++) {
      const d = a[c];
      this.addGroup(d.start, d.count, d.materialIndex);
    }
    const l = t.boundingBox;
    l !== null && (this.boundingBox = l.clone());
    const o = t.boundingSphere;
    return (
      o !== null && (this.boundingSphere = o.clone()),
      (this.drawRange.start = t.drawRange.start),
      (this.drawRange.count = t.drawRange.count),
      (this.userData = t.userData),
      this
    );
  }
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
const go = new Zt(),
  kn = new nh(),
  ms = new es(),
  vo = new b(),
  gs = new b(),
  vs = new b(),
  _s = new b(),
  fr = new b(),
  xs = new b(),
  _o = new b(),
  Ms = new b();
class Ut extends ne {
  constructor(t = new Le(), e = new Zi()) {
    (super(),
      (this.isMesh = !0),
      (this.type = "Mesh"),
      (this.geometry = t),
      (this.material = e),
      this.updateMorphTargets());
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      t.morphTargetInfluences !== void 0 &&
        (this.morphTargetInfluences = t.morphTargetInfluences.slice()),
      t.morphTargetDictionary !== void 0 &&
        (this.morphTargetDictionary = Object.assign(
          {},
          t.morphTargetDictionary,
        )),
      (this.material = Array.isArray(t.material)
        ? t.material.slice()
        : t.material),
      (this.geometry = t.geometry),
      this
    );
  }
  updateMorphTargets() {
    const e = this.geometry.morphAttributes,
      n = Object.keys(e);
    if (n.length > 0) {
      const s = e[n[0]];
      if (s !== void 0) {
        ((this.morphTargetInfluences = []), (this.morphTargetDictionary = {}));
        for (let r = 0, a = s.length; r < a; r++) {
          const l = s[r].name || String(r);
          (this.morphTargetInfluences.push(0),
            (this.morphTargetDictionary[l] = r));
        }
      }
    }
  }
  getVertexPosition(t, e) {
    const n = this.geometry,
      s = n.attributes.position,
      r = n.morphAttributes.position,
      a = n.morphTargetsRelative;
    e.fromBufferAttribute(s, t);
    const l = this.morphTargetInfluences;
    if (r && l) {
      xs.set(0, 0, 0);
      for (let o = 0, c = r.length; o < c; o++) {
        const h = l[o],
          d = r[o];
        h !== 0 &&
          (fr.fromBufferAttribute(d, t),
          a ? xs.addScaledVector(fr, h) : xs.addScaledVector(fr.sub(e), h));
      }
      e.add(xs);
    }
    return e;
  }
  raycast(t, e) {
    const n = this.geometry,
      s = this.material,
      r = this.matrixWorld;
    s !== void 0 &&
      (n.boundingSphere === null && n.computeBoundingSphere(),
      ms.copy(n.boundingSphere),
      ms.applyMatrix4(r),
      kn.copy(t.ray).recast(t.near),
      !(
        ms.containsPoint(kn.origin) === !1 &&
        (kn.intersectSphere(ms, vo) === null ||
          kn.origin.distanceToSquared(vo) > (t.far - t.near) ** 2)
      ) &&
        (go.copy(r).invert(),
        kn.copy(t.ray).applyMatrix4(go),
        !(n.boundingBox !== null && kn.intersectsBox(n.boundingBox) === !1) &&
          this._computeIntersections(t, e, kn)));
  }
  _computeIntersections(t, e, n) {
    let s;
    const r = this.geometry,
      a = this.material,
      l = r.index,
      o = r.attributes.position,
      c = r.attributes.uv,
      h = r.attributes.uv1,
      d = r.attributes.normal,
      u = r.groups,
      m = r.drawRange;
    if (l !== null)
      if (Array.isArray(a))
        for (let g = 0, v = u.length; g < v; g++) {
          const p = u[g],
            f = a[p.materialIndex],
            w = Math.max(p.start, m.start),
            M = Math.min(
              l.count,
              Math.min(p.start + p.count, m.start + m.count),
            );
          for (let _ = w, L = M; _ < L; _ += 3) {
            const R = l.getX(_),
              A = l.getX(_ + 1),
              C = l.getX(_ + 2);
            ((s = ys(this, f, t, n, c, h, d, R, A, C)),
              s &&
                ((s.faceIndex = Math.floor(_ / 3)),
                (s.face.materialIndex = p.materialIndex),
                e.push(s)));
          }
        }
      else {
        const g = Math.max(0, m.start),
          v = Math.min(l.count, m.start + m.count);
        for (let p = g, f = v; p < f; p += 3) {
          const w = l.getX(p),
            M = l.getX(p + 1),
            _ = l.getX(p + 2);
          ((s = ys(this, a, t, n, c, h, d, w, M, _)),
            s && ((s.faceIndex = Math.floor(p / 3)), e.push(s)));
        }
      }
    else if (o !== void 0)
      if (Array.isArray(a))
        for (let g = 0, v = u.length; g < v; g++) {
          const p = u[g],
            f = a[p.materialIndex],
            w = Math.max(p.start, m.start),
            M = Math.min(
              o.count,
              Math.min(p.start + p.count, m.start + m.count),
            );
          for (let _ = w, L = M; _ < L; _ += 3) {
            const R = _,
              A = _ + 1,
              C = _ + 2;
            ((s = ys(this, f, t, n, c, h, d, R, A, C)),
              s &&
                ((s.faceIndex = Math.floor(_ / 3)),
                (s.face.materialIndex = p.materialIndex),
                e.push(s)));
          }
        }
      else {
        const g = Math.max(0, m.start),
          v = Math.min(o.count, m.start + m.count);
        for (let p = g, f = v; p < f; p += 3) {
          const w = p,
            M = p + 1,
            _ = p + 2;
          ((s = ys(this, a, t, n, c, h, d, w, M, _)),
            s && ((s.faceIndex = Math.floor(p / 3)), e.push(s)));
        }
      }
  }
}
function uh(i, t, e, n, s, r, a, l) {
  let o;
  if (
    (t.side === Ce
      ? (o = n.intersectTriangle(a, r, s, !0, l))
      : (o = n.intersectTriangle(s, r, a, t.side === Fn, l)),
    o === null)
  )
    return null;
  (Ms.copy(l), Ms.applyMatrix4(i.matrixWorld));
  const c = e.ray.origin.distanceTo(Ms);
  return c < e.near || c > e.far
    ? null
    : { distance: c, point: Ms.clone(), object: i };
}
function ys(i, t, e, n, s, r, a, l, o, c) {
  (i.getVertexPosition(l, gs),
    i.getVertexPosition(o, vs),
    i.getVertexPosition(c, _s));
  const h = uh(i, t, e, n, gs, vs, _s, _o);
  if (h) {
    const d = new b();
    (Qe.getBarycoord(_o, gs, vs, _s, d),
      s && (h.uv = Qe.getInterpolatedAttribute(s, l, o, c, d, new It())),
      r && (h.uv1 = Qe.getInterpolatedAttribute(r, l, o, c, d, new It())),
      a &&
        ((h.normal = Qe.getInterpolatedAttribute(a, l, o, c, d, new b())),
        h.normal.dot(n.direction) > 0 && h.normal.multiplyScalar(-1)));
    const u = { a: l, b: o, c, normal: new b(), materialIndex: 0 };
    (Qe.getNormal(gs, vs, _s, u.normal), (h.face = u), (h.barycoord = d));
  }
  return h;
}
class te extends Le {
  constructor(t = 1, e = 1, n = 1, s = 1, r = 1, a = 1) {
    (super(),
      (this.type = "BoxGeometry"),
      (this.parameters = {
        width: t,
        height: e,
        depth: n,
        widthSegments: s,
        heightSegments: r,
        depthSegments: a,
      }));
    const l = this;
    ((s = Math.floor(s)), (r = Math.floor(r)), (a = Math.floor(a)));
    const o = [],
      c = [],
      h = [],
      d = [];
    let u = 0,
      m = 0;
    (g("z", "y", "x", -1, -1, n, e, t, a, r, 0),
      g("z", "y", "x", 1, -1, n, e, -t, a, r, 1),
      g("x", "z", "y", 1, 1, t, n, e, s, a, 2),
      g("x", "z", "y", 1, -1, t, n, -e, s, a, 3),
      g("x", "y", "z", 1, -1, t, e, n, s, r, 4),
      g("x", "y", "z", -1, -1, t, e, -n, s, r, 5),
      this.setIndex(o),
      this.setAttribute("position", new he(c, 3)),
      this.setAttribute("normal", new he(h, 3)),
      this.setAttribute("uv", new he(d, 2)));
    function g(v, p, f, w, M, _, L, R, A, C, S) {
      const y = _ / A,
        P = L / C,
        z = _ / 2,
        U = L / 2,
        H = R / 2,
        k = A + 1,
        G = C + 1;
      let q = 0,
        O = 0;
      const et = new b();
      for (let K = 0; K < G; K++) {
        const nt = K * P - U;
        for (let _t = 0; _t < k; _t++) {
          const Lt = _t * y - z;
          ((et[v] = Lt * w),
            (et[p] = nt * M),
            (et[f] = H),
            c.push(et.x, et.y, et.z),
            (et[v] = 0),
            (et[p] = 0),
            (et[f] = R > 0 ? 1 : -1),
            h.push(et.x, et.y, et.z),
            d.push(_t / A),
            d.push(1 - K / C),
            (q += 1));
        }
      }
      for (let K = 0; K < C; K++)
        for (let nt = 0; nt < A; nt++) {
          const _t = u + nt + k * K,
            Lt = u + nt + k * (K + 1),
            Y = u + (nt + 1) + k * (K + 1),
            it = u + (nt + 1) + k * K;
          (o.push(_t, Lt, it), o.push(Lt, Y, it), (O += 6));
        }
      (l.addGroup(m, O, S), (m += O), (u += q));
    }
  }
  copy(t) {
    return (
      super.copy(t),
      (this.parameters = Object.assign({}, t.parameters)),
      this
    );
  }
  static fromJSON(t) {
    return new te(
      t.width,
      t.height,
      t.depth,
      t.widthSegments,
      t.heightSegments,
      t.depthSegments,
    );
  }
}
function Li(i) {
  const t = {};
  for (const e in i) {
    t[e] = {};
    for (const n in i[e]) {
      const s = i[e][n];
      s &&
      (s.isColor ||
        s.isMatrix3 ||
        s.isMatrix4 ||
        s.isVector2 ||
        s.isVector3 ||
        s.isVector4 ||
        s.isTexture ||
        s.isQuaternion)
        ? s.isRenderTargetTexture
          ? (console.warn(
              "UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().",
            ),
            (t[e][n] = null))
          : (t[e][n] = s.clone())
        : Array.isArray(s)
          ? (t[e][n] = s.slice())
          : (t[e][n] = s);
    }
  }
  return t;
}
function Te(i) {
  const t = {};
  for (let e = 0; e < i.length; e++) {
    const n = Li(i[e]);
    for (const s in n) t[s] = n[s];
  }
  return t;
}
function dh(i) {
  const t = [];
  for (let e = 0; e < i.length; e++) t.push(i[e].clone());
  return t;
}
function Rl(i) {
  const t = i.getRenderTarget();
  return t === null
    ? i.outputColorSpace
    : t.isXRRenderTarget === !0
      ? t.texture.colorSpace
      : Xt.workingColorSpace;
}
const fh = { clone: Li, merge: Te };
var ph = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
  mh = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;
class pe extends ns {
  static get type() {
    return "ShaderMaterial";
  }
  constructor(t) {
    (super(),
      (this.isShaderMaterial = !0),
      (this.defines = {}),
      (this.uniforms = {}),
      (this.uniformsGroups = []),
      (this.vertexShader = ph),
      (this.fragmentShader = mh),
      (this.linewidth = 1),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.fog = !1),
      (this.lights = !1),
      (this.clipping = !1),
      (this.forceSinglePass = !0),
      (this.extensions = { clipCullDistance: !1, multiDraw: !1 }),
      (this.defaultAttributeValues = {
        color: [1, 1, 1],
        uv: [0, 0],
        uv1: [0, 0],
      }),
      (this.index0AttributeName = void 0),
      (this.uniformsNeedUpdate = !1),
      (this.glslVersion = null),
      t !== void 0 && this.setValues(t));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.fragmentShader = t.fragmentShader),
      (this.vertexShader = t.vertexShader),
      (this.uniforms = Li(t.uniforms)),
      (this.uniformsGroups = dh(t.uniformsGroups)),
      (this.defines = Object.assign({}, t.defines)),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      (this.fog = t.fog),
      (this.lights = t.lights),
      (this.clipping = t.clipping),
      (this.extensions = Object.assign({}, t.extensions)),
      (this.glslVersion = t.glslVersion),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    ((e.glslVersion = this.glslVersion), (e.uniforms = {}));
    for (const s in this.uniforms) {
      const a = this.uniforms[s].value;
      a && a.isTexture
        ? (e.uniforms[s] = { type: "t", value: a.toJSON(t).uuid })
        : a && a.isColor
          ? (e.uniforms[s] = { type: "c", value: a.getHex() })
          : a && a.isVector2
            ? (e.uniforms[s] = { type: "v2", value: a.toArray() })
            : a && a.isVector3
              ? (e.uniforms[s] = { type: "v3", value: a.toArray() })
              : a && a.isVector4
                ? (e.uniforms[s] = { type: "v4", value: a.toArray() })
                : a && a.isMatrix3
                  ? (e.uniforms[s] = { type: "m3", value: a.toArray() })
                  : a && a.isMatrix4
                    ? (e.uniforms[s] = { type: "m4", value: a.toArray() })
                    : (e.uniforms[s] = { value: a });
    }
    (Object.keys(this.defines).length > 0 && (e.defines = this.defines),
      (e.vertexShader = this.vertexShader),
      (e.fragmentShader = this.fragmentShader),
      (e.lights = this.lights),
      (e.clipping = this.clipping));
    const n = {};
    for (const s in this.extensions) this.extensions[s] === !0 && (n[s] = !0);
    return (Object.keys(n).length > 0 && (e.extensions = n), e);
  }
}
class Cl extends ne {
  constructor() {
    (super(),
      (this.isCamera = !0),
      (this.type = "Camera"),
      (this.matrixWorldInverse = new Zt()),
      (this.projectionMatrix = new Zt()),
      (this.projectionMatrixInverse = new Zt()),
      (this.coordinateSystem = vn));
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      this.matrixWorldInverse.copy(t.matrixWorldInverse),
      this.projectionMatrix.copy(t.projectionMatrix),
      this.projectionMatrixInverse.copy(t.projectionMatrixInverse),
      (this.coordinateSystem = t.coordinateSystem),
      this
    );
  }
  getWorldDirection(t) {
    return super.getWorldDirection(t).negate();
  }
  updateMatrixWorld(t) {
    (super.updateMatrixWorld(t),
      this.matrixWorldInverse.copy(this.matrixWorld).invert());
  }
  updateWorldMatrix(t, e) {
    (super.updateWorldMatrix(t, e),
      this.matrixWorldInverse.copy(this.matrixWorld).invert());
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Pn = new b(),
  xo = new It(),
  Mo = new It();
class Ue extends Cl {
  constructor(t = 50, e = 1, n = 0.1, s = 2e3) {
    (super(),
      (this.isPerspectiveCamera = !0),
      (this.type = "PerspectiveCamera"),
      (this.fov = t),
      (this.zoom = 1),
      (this.near = n),
      (this.far = s),
      (this.focus = 10),
      (this.aspect = e),
      (this.view = null),
      (this.filmGauge = 35),
      (this.filmOffset = 0),
      this.updateProjectionMatrix());
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      (this.fov = t.fov),
      (this.zoom = t.zoom),
      (this.near = t.near),
      (this.far = t.far),
      (this.focus = t.focus),
      (this.aspect = t.aspect),
      (this.view = t.view === null ? null : Object.assign({}, t.view)),
      (this.filmGauge = t.filmGauge),
      (this.filmOffset = t.filmOffset),
      this
    );
  }
  setFocalLength(t) {
    const e = (0.5 * this.getFilmHeight()) / t;
    ((this.fov = ts * 2 * Math.atan(e)), this.updateProjectionMatrix());
  }
  getFocalLength() {
    const t = Math.tan(Ki * 0.5 * this.fov);
    return (0.5 * this.getFilmHeight()) / t;
  }
  getEffectiveFOV() {
    return ts * 2 * Math.atan(Math.tan(Ki * 0.5 * this.fov) / this.zoom);
  }
  getFilmWidth() {
    return this.filmGauge * Math.min(this.aspect, 1);
  }
  getFilmHeight() {
    return this.filmGauge / Math.max(this.aspect, 1);
  }
  getViewBounds(t, e, n) {
    (Pn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      e.set(Pn.x, Pn.y).multiplyScalar(-t / Pn.z),
      Pn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
      n.set(Pn.x, Pn.y).multiplyScalar(-t / Pn.z));
  }
  getViewSize(t, e) {
    return (this.getViewBounds(t, xo, Mo), e.subVectors(Mo, xo));
  }
  setViewOffset(t, e, n, s, r, a) {
    ((this.aspect = t / e),
      this.view === null &&
        (this.view = {
          enabled: !0,
          fullWidth: 1,
          fullHeight: 1,
          offsetX: 0,
          offsetY: 0,
          width: 1,
          height: 1,
        }),
      (this.view.enabled = !0),
      (this.view.fullWidth = t),
      (this.view.fullHeight = e),
      (this.view.offsetX = n),
      (this.view.offsetY = s),
      (this.view.width = r),
      (this.view.height = a),
      this.updateProjectionMatrix());
  }
  clearViewOffset() {
    (this.view !== null && (this.view.enabled = !1),
      this.updateProjectionMatrix());
  }
  updateProjectionMatrix() {
    const t = this.near;
    let e = (t * Math.tan(Ki * 0.5 * this.fov)) / this.zoom,
      n = 2 * e,
      s = this.aspect * n,
      r = -0.5 * s;
    const a = this.view;
    if (this.view !== null && this.view.enabled) {
      const o = a.fullWidth,
        c = a.fullHeight;
      ((r += (a.offsetX * s) / o),
        (e -= (a.offsetY * n) / c),
        (s *= a.width / o),
        (n *= a.height / c));
    }
    const l = this.filmOffset;
    (l !== 0 && (r += (t * l) / this.getFilmWidth()),
      this.projectionMatrix.makePerspective(
        r,
        r + s,
        e,
        e - n,
        t,
        this.far,
        this.coordinateSystem,
      ),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert());
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      (e.object.fov = this.fov),
      (e.object.zoom = this.zoom),
      (e.object.near = this.near),
      (e.object.far = this.far),
      (e.object.focus = this.focus),
      (e.object.aspect = this.aspect),
      this.view !== null && (e.object.view = Object.assign({}, this.view)),
      (e.object.filmGauge = this.filmGauge),
      (e.object.filmOffset = this.filmOffset),
      e
    );
  }
}
const mi = -90,
  gi = 1;
class gh extends ne {
  constructor(t, e, n) {
    (super(),
      (this.type = "CubeCamera"),
      (this.renderTarget = n),
      (this.coordinateSystem = null),
      (this.activeMipmapLevel = 0));
    const s = new Ue(mi, gi, t, e);
    ((s.layers = this.layers), this.add(s));
    const r = new Ue(mi, gi, t, e);
    ((r.layers = this.layers), this.add(r));
    const a = new Ue(mi, gi, t, e);
    ((a.layers = this.layers), this.add(a));
    const l = new Ue(mi, gi, t, e);
    ((l.layers = this.layers), this.add(l));
    const o = new Ue(mi, gi, t, e);
    ((o.layers = this.layers), this.add(o));
    const c = new Ue(mi, gi, t, e);
    ((c.layers = this.layers), this.add(c));
  }
  updateCoordinateSystem() {
    const t = this.coordinateSystem,
      e = this.children.concat(),
      [n, s, r, a, l, o] = e;
    for (const c of e) this.remove(c);
    if (t === vn)
      (n.up.set(0, 1, 0),
        n.lookAt(1, 0, 0),
        s.up.set(0, 1, 0),
        s.lookAt(-1, 0, 0),
        r.up.set(0, 0, -1),
        r.lookAt(0, 1, 0),
        a.up.set(0, 0, 1),
        a.lookAt(0, -1, 0),
        l.up.set(0, 1, 0),
        l.lookAt(0, 0, 1),
        o.up.set(0, 1, 0),
        o.lookAt(0, 0, -1));
    else if (t === Os)
      (n.up.set(0, -1, 0),
        n.lookAt(-1, 0, 0),
        s.up.set(0, -1, 0),
        s.lookAt(1, 0, 0),
        r.up.set(0, 0, 1),
        r.lookAt(0, 1, 0),
        a.up.set(0, 0, -1),
        a.lookAt(0, -1, 0),
        l.up.set(0, -1, 0),
        l.lookAt(0, 0, 1),
        o.up.set(0, -1, 0),
        o.lookAt(0, 0, -1));
    else
      throw new Error(
        "THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " +
          t,
      );
    for (const c of e) (this.add(c), c.updateMatrixWorld());
  }
  update(t, e) {
    this.parent === null && this.updateMatrixWorld();
    const { renderTarget: n, activeMipmapLevel: s } = this;
    this.coordinateSystem !== t.coordinateSystem &&
      ((this.coordinateSystem = t.coordinateSystem),
      this.updateCoordinateSystem());
    const [r, a, l, o, c, h] = this.children,
      d = t.getRenderTarget(),
      u = t.getActiveCubeFace(),
      m = t.getActiveMipmapLevel(),
      g = t.xr.enabled;
    t.xr.enabled = !1;
    const v = n.texture.generateMipmaps;
    ((n.texture.generateMipmaps = !1),
      t.setRenderTarget(n, 0, s),
      t.render(e, r),
      t.setRenderTarget(n, 1, s),
      t.render(e, a),
      t.setRenderTarget(n, 2, s),
      t.render(e, l),
      t.setRenderTarget(n, 3, s),
      t.render(e, o),
      t.setRenderTarget(n, 4, s),
      t.render(e, c),
      (n.texture.generateMipmaps = v),
      t.setRenderTarget(n, 5, s),
      t.render(e, h),
      t.setRenderTarget(d, u, m),
      (t.xr.enabled = g),
      (n.texture.needsPMREMUpdate = !0));
  }
}
class Pl extends Pe {
  constructor(t, e, n, s, r, a, l, o, c, h) {
    ((t = t !== void 0 ? t : []),
      (e = e !== void 0 ? e : Ai),
      super(t, e, n, s, r, a, l, o, c, h),
      (this.isCubeTexture = !0),
      (this.flipY = !1));
  }
  get images() {
    return this.image;
  }
  set images(t) {
    this.image = t;
  }
}
class vh extends Sn {
  constructor(t = 1, e = {}) {
    (super(t, t, e), (this.isWebGLCubeRenderTarget = !0));
    const n = { width: t, height: t, depth: 1 },
      s = [n, n, n, n, n, n];
    ((this.texture = new Pl(
      s,
      e.mapping,
      e.wrapS,
      e.wrapT,
      e.magFilter,
      e.minFilter,
      e.format,
      e.type,
      e.anisotropy,
      e.colorSpace,
    )),
      (this.texture.isRenderTargetTexture = !0),
      (this.texture.generateMipmaps =
        e.generateMipmaps !== void 0 ? e.generateMipmaps : !1),
      (this.texture.minFilter = e.minFilter !== void 0 ? e.minFilter : Ne));
  }
  fromEquirectangularTexture(t, e) {
    ((this.texture.type = e.type),
      (this.texture.colorSpace = e.colorSpace),
      (this.texture.generateMipmaps = e.generateMipmaps),
      (this.texture.minFilter = e.minFilter),
      (this.texture.magFilter = e.magFilter));
    const n = {
        uniforms: { tEquirect: { value: null } },
        vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
        fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`,
      },
      s = new te(5, 5, 5),
      r = new pe({
        name: "CubemapFromEquirect",
        uniforms: Li(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: Ce,
        blending: In,
      });
    r.uniforms.tEquirect.value = e;
    const a = new Ut(s, r),
      l = e.minFilter;
    return (
      e.minFilter === Kn && (e.minFilter = Ne),
      new gh(1, 10, this).update(t, a),
      (e.minFilter = l),
      a.geometry.dispose(),
      a.material.dispose(),
      this
    );
  }
  clear(t, e, n, s) {
    const r = t.getRenderTarget();
    for (let a = 0; a < 6; a++) (t.setRenderTarget(this, a), t.clear(e, n, s));
    t.setRenderTarget(r);
  }
}
const pr = new b(),
  _h = new b(),
  xh = new zt();
class qn {
  constructor(t = new b(1, 0, 0), e = 0) {
    ((this.isPlane = !0), (this.normal = t), (this.constant = e));
  }
  set(t, e) {
    return (this.normal.copy(t), (this.constant = e), this);
  }
  setComponents(t, e, n, s) {
    return (this.normal.set(t, e, n), (this.constant = s), this);
  }
  setFromNormalAndCoplanarPoint(t, e) {
    return (this.normal.copy(t), (this.constant = -e.dot(this.normal)), this);
  }
  setFromCoplanarPoints(t, e, n) {
    const s = pr.subVectors(n, e).cross(_h.subVectors(t, e)).normalize();
    return (this.setFromNormalAndCoplanarPoint(s, t), this);
  }
  copy(t) {
    return (this.normal.copy(t.normal), (this.constant = t.constant), this);
  }
  normalize() {
    const t = 1 / this.normal.length();
    return (this.normal.multiplyScalar(t), (this.constant *= t), this);
  }
  negate() {
    return ((this.constant *= -1), this.normal.negate(), this);
  }
  distanceToPoint(t) {
    return this.normal.dot(t) + this.constant;
  }
  distanceToSphere(t) {
    return this.distanceToPoint(t.center) - t.radius;
  }
  projectPoint(t, e) {
    return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t));
  }
  intersectLine(t, e) {
    const n = t.delta(pr),
      s = this.normal.dot(n);
    if (s === 0)
      return this.distanceToPoint(t.start) === 0 ? e.copy(t.start) : null;
    const r = -(t.start.dot(this.normal) + this.constant) / s;
    return r < 0 || r > 1 ? null : e.copy(t.start).addScaledVector(n, r);
  }
  intersectsLine(t) {
    const e = this.distanceToPoint(t.start),
      n = this.distanceToPoint(t.end);
    return (e < 0 && n > 0) || (n < 0 && e > 0);
  }
  intersectsBox(t) {
    return t.intersectsPlane(this);
  }
  intersectsSphere(t) {
    return t.intersectsPlane(this);
  }
  coplanarPoint(t) {
    return t.copy(this.normal).multiplyScalar(-this.constant);
  }
  applyMatrix4(t, e) {
    const n = e || xh.getNormalMatrix(t),
      s = this.coplanarPoint(pr).applyMatrix4(t),
      r = this.normal.applyMatrix3(n).normalize();
    return ((this.constant = -s.dot(r)), this);
  }
  translate(t) {
    return ((this.constant -= t.dot(this.normal)), this);
  }
  equals(t) {
    return t.normal.equals(this.normal) && t.constant === this.constant;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
const Hn = new es(),
  Ss = new b();
class Pa {
  constructor(
    t = new qn(),
    e = new qn(),
    n = new qn(),
    s = new qn(),
    r = new qn(),
    a = new qn(),
  ) {
    this.planes = [t, e, n, s, r, a];
  }
  set(t, e, n, s, r, a) {
    const l = this.planes;
    return (
      l[0].copy(t),
      l[1].copy(e),
      l[2].copy(n),
      l[3].copy(s),
      l[4].copy(r),
      l[5].copy(a),
      this
    );
  }
  copy(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) e[n].copy(t.planes[n]);
    return this;
  }
  setFromProjectionMatrix(t, e = vn) {
    const n = this.planes,
      s = t.elements,
      r = s[0],
      a = s[1],
      l = s[2],
      o = s[3],
      c = s[4],
      h = s[5],
      d = s[6],
      u = s[7],
      m = s[8],
      g = s[9],
      v = s[10],
      p = s[11],
      f = s[12],
      w = s[13],
      M = s[14],
      _ = s[15];
    if (
      (n[0].setComponents(o - r, u - c, p - m, _ - f).normalize(),
      n[1].setComponents(o + r, u + c, p + m, _ + f).normalize(),
      n[2].setComponents(o + a, u + h, p + g, _ + w).normalize(),
      n[3].setComponents(o - a, u - h, p - g, _ - w).normalize(),
      n[4].setComponents(o - l, u - d, p - v, _ - M).normalize(),
      e === vn)
    )
      n[5].setComponents(o + l, u + d, p + v, _ + M).normalize();
    else if (e === Os) n[5].setComponents(l, d, v, M).normalize();
    else
      throw new Error(
        "THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " +
          e,
      );
    return this;
  }
  intersectsObject(t) {
    if (t.boundingSphere !== void 0)
      (t.boundingSphere === null && t.computeBoundingSphere(),
        Hn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld));
    else {
      const e = t.geometry;
      (e.boundingSphere === null && e.computeBoundingSphere(),
        Hn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld));
    }
    return this.intersectsSphere(Hn);
  }
  intersectsSprite(t) {
    return (
      Hn.center.set(0, 0, 0),
      (Hn.radius = 0.7071067811865476),
      Hn.applyMatrix4(t.matrixWorld),
      this.intersectsSphere(Hn)
    );
  }
  intersectsSphere(t) {
    const e = this.planes,
      n = t.center,
      s = -t.radius;
    for (let r = 0; r < 6; r++) if (e[r].distanceToPoint(n) < s) return !1;
    return !0;
  }
  intersectsBox(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) {
      const s = e[n];
      if (
        ((Ss.x = s.normal.x > 0 ? t.max.x : t.min.x),
        (Ss.y = s.normal.y > 0 ? t.max.y : t.min.y),
        (Ss.z = s.normal.z > 0 ? t.max.z : t.min.z),
        s.distanceToPoint(Ss) < 0)
      )
        return !1;
    }
    return !0;
  }
  containsPoint(t) {
    const e = this.planes;
    for (let n = 0; n < 6; n++) if (e[n].distanceToPoint(t) < 0) return !1;
    return !0;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}
function Ll() {
  let i = null,
    t = !1,
    e = null,
    n = null;
  function s(r, a) {
    (e(r, a), (n = i.requestAnimationFrame(s)));
  }
  return {
    start: function () {
      t !== !0 && e !== null && ((n = i.requestAnimationFrame(s)), (t = !0));
    },
    stop: function () {
      (i.cancelAnimationFrame(n), (t = !1));
    },
    setAnimationLoop: function (r) {
      e = r;
    },
    setContext: function (r) {
      i = r;
    },
  };
}
function Mh(i) {
  const t = new WeakMap();
  function e(l, o) {
    const c = l.array,
      h = l.usage,
      d = c.byteLength,
      u = i.createBuffer();
    (i.bindBuffer(o, u), i.bufferData(o, c, h), l.onUploadCallback());
    let m;
    if (c instanceof Float32Array) m = i.FLOAT;
    else if (c instanceof Uint16Array)
      l.isFloat16BufferAttribute ? (m = i.HALF_FLOAT) : (m = i.UNSIGNED_SHORT);
    else if (c instanceof Int16Array) m = i.SHORT;
    else if (c instanceof Uint32Array) m = i.UNSIGNED_INT;
    else if (c instanceof Int32Array) m = i.INT;
    else if (c instanceof Int8Array) m = i.BYTE;
    else if (c instanceof Uint8Array) m = i.UNSIGNED_BYTE;
    else if (c instanceof Uint8ClampedArray) m = i.UNSIGNED_BYTE;
    else
      throw new Error(
        "THREE.WebGLAttributes: Unsupported buffer data format: " + c,
      );
    return {
      buffer: u,
      type: m,
      bytesPerElement: c.BYTES_PER_ELEMENT,
      version: l.version,
      size: d,
    };
  }
  function n(l, o, c) {
    const h = o.array,
      d = o.updateRanges;
    if ((i.bindBuffer(c, l), d.length === 0)) i.bufferSubData(c, 0, h);
    else {
      d.sort((m, g) => m.start - g.start);
      let u = 0;
      for (let m = 1; m < d.length; m++) {
        const g = d[u],
          v = d[m];
        v.start <= g.start + g.count + 1
          ? (g.count = Math.max(g.count, v.start + v.count - g.start))
          : (++u, (d[u] = v));
      }
      d.length = u + 1;
      for (let m = 0, g = d.length; m < g; m++) {
        const v = d[m];
        i.bufferSubData(c, v.start * h.BYTES_PER_ELEMENT, h, v.start, v.count);
      }
      o.clearUpdateRanges();
    }
    o.onUploadCallback();
  }
  function s(l) {
    return (l.isInterleavedBufferAttribute && (l = l.data), t.get(l));
  }
  function r(l) {
    l.isInterleavedBufferAttribute && (l = l.data);
    const o = t.get(l);
    o && (i.deleteBuffer(o.buffer), t.delete(l));
  }
  function a(l, o) {
    if (
      (l.isInterleavedBufferAttribute && (l = l.data), l.isGLBufferAttribute)
    ) {
      const h = t.get(l);
      (!h || h.version < l.version) &&
        t.set(l, {
          buffer: l.buffer,
          type: l.type,
          bytesPerElement: l.elementSize,
          version: l.version,
        });
      return;
    }
    const c = t.get(l);
    if (c === void 0) t.set(l, e(l, o));
    else if (c.version < l.version) {
      if (c.size !== l.array.byteLength)
        throw new Error(
          "THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.",
        );
      (n(c.buffer, l, o), (c.version = l.version));
    }
  }
  return { get: s, remove: r, update: a };
}
class He extends Le {
  constructor(t = 1, e = 1, n = 1, s = 1) {
    (super(),
      (this.type = "PlaneGeometry"),
      (this.parameters = {
        width: t,
        height: e,
        widthSegments: n,
        heightSegments: s,
      }));
    const r = t / 2,
      a = e / 2,
      l = Math.floor(n),
      o = Math.floor(s),
      c = l + 1,
      h = o + 1,
      d = t / l,
      u = e / o,
      m = [],
      g = [],
      v = [],
      p = [];
    for (let f = 0; f < h; f++) {
      const w = f * u - a;
      for (let M = 0; M < c; M++) {
        const _ = M * d - r;
        (g.push(_, -w, 0), v.push(0, 0, 1), p.push(M / l), p.push(1 - f / o));
      }
    }
    for (let f = 0; f < o; f++)
      for (let w = 0; w < l; w++) {
        const M = w + c * f,
          _ = w + c * (f + 1),
          L = w + 1 + c * (f + 1),
          R = w + 1 + c * f;
        (m.push(M, _, R), m.push(_, L, R));
      }
    (this.setIndex(m),
      this.setAttribute("position", new he(g, 3)),
      this.setAttribute("normal", new he(v, 3)),
      this.setAttribute("uv", new he(p, 2)));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.parameters = Object.assign({}, t.parameters)),
      this
    );
  }
  static fromJSON(t) {
    return new He(t.width, t.height, t.widthSegments, t.heightSegments);
  }
}
var yh = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
  Sh = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
  Eh = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
  wh = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  Th = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
  bh = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
  Ah = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
  Rh = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
  Ch = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,
  Ph = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
  Lh = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
  Dh = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
  Uh = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
  Ih = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
  Nh = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
  Fh = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
  zh = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
  Oh = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
  Bh = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
  kh = `#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,
  Hh = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,
  Vh = `#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,
  Gh = `#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,
  Wh = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
  qh = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
  Xh = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,
  Yh = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
  jh = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
  Kh = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
  $h = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
  Zh = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
  Jh = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
  Qh = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,
  tu = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,
  eu = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
  nu = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
  iu = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
  su = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
  ru = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
  au = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
  ou = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
  lu = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
  cu = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
  hu = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
  uu = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
  du = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,
  fu = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,
  pu = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
  mu = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
  gu = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
  vu = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
  _u = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
  xu = `struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
  Mu = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
  yu = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
  Su = `#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
  Eu = `#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
  wu = `#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  Tu = `#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  bu = `#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
  Au = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
  Ru = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
  Cu = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
  Pu = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  Lu = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
  Du = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
  Uu = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
  Iu = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
  Nu = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  Fu = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
  zu = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  Ou = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
  Bu = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
  ku = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Hu = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Vu = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,
  Gu = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
  Wu = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
  qu = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
  Xu = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
  Yu = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
  ju = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
  Ku = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,
  $u = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
  Zu = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
  Ju = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
  Qu = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
  td = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
  ed = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
  nd = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,
  id = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
  sd = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
  rd = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
  ad = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
  od = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
  ld = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
  cd = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
  hd = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
  ud = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
  dd = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
  fd = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
  pd = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
  md = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
  gd = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  vd = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  _d = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
  xd = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;
const Md = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
  yd = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Sd = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  Ed = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  wd = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  Td = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  bd = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
  Ad = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
  Rd = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
  Cd = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,
  Pd = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
  Ld = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Dd = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  Ud = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  Id = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
  Nd = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Fd = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  zd = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Od = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
  Bd = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  kd = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
  Hd = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
  Vd = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Gd = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Wd = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
  qd = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Xd = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Yd = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  jd = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
  Kd = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  $d = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Zd = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
  Jd = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  Qd = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
  Bt = {
    alphahash_fragment: yh,
    alphahash_pars_fragment: Sh,
    alphamap_fragment: Eh,
    alphamap_pars_fragment: wh,
    alphatest_fragment: Th,
    alphatest_pars_fragment: bh,
    aomap_fragment: Ah,
    aomap_pars_fragment: Rh,
    batching_pars_vertex: Ch,
    batching_vertex: Ph,
    begin_vertex: Lh,
    beginnormal_vertex: Dh,
    bsdfs: Uh,
    iridescence_fragment: Ih,
    bumpmap_pars_fragment: Nh,
    clipping_planes_fragment: Fh,
    clipping_planes_pars_fragment: zh,
    clipping_planes_pars_vertex: Oh,
    clipping_planes_vertex: Bh,
    color_fragment: kh,
    color_pars_fragment: Hh,
    color_pars_vertex: Vh,
    color_vertex: Gh,
    common: Wh,
    cube_uv_reflection_fragment: qh,
    defaultnormal_vertex: Xh,
    displacementmap_pars_vertex: Yh,
    displacementmap_vertex: jh,
    emissivemap_fragment: Kh,
    emissivemap_pars_fragment: $h,
    colorspace_fragment: Zh,
    colorspace_pars_fragment: Jh,
    envmap_fragment: Qh,
    envmap_common_pars_fragment: tu,
    envmap_pars_fragment: eu,
    envmap_pars_vertex: nu,
    envmap_physical_pars_fragment: fu,
    envmap_vertex: iu,
    fog_vertex: su,
    fog_pars_vertex: ru,
    fog_fragment: au,
    fog_pars_fragment: ou,
    gradientmap_pars_fragment: lu,
    lightmap_pars_fragment: cu,
    lights_lambert_fragment: hu,
    lights_lambert_pars_fragment: uu,
    lights_pars_begin: du,
    lights_toon_fragment: pu,
    lights_toon_pars_fragment: mu,
    lights_phong_fragment: gu,
    lights_phong_pars_fragment: vu,
    lights_physical_fragment: _u,
    lights_physical_pars_fragment: xu,
    lights_fragment_begin: Mu,
    lights_fragment_maps: yu,
    lights_fragment_end: Su,
    logdepthbuf_fragment: Eu,
    logdepthbuf_pars_fragment: wu,
    logdepthbuf_pars_vertex: Tu,
    logdepthbuf_vertex: bu,
    map_fragment: Au,
    map_pars_fragment: Ru,
    map_particle_fragment: Cu,
    map_particle_pars_fragment: Pu,
    metalnessmap_fragment: Lu,
    metalnessmap_pars_fragment: Du,
    morphinstance_vertex: Uu,
    morphcolor_vertex: Iu,
    morphnormal_vertex: Nu,
    morphtarget_pars_vertex: Fu,
    morphtarget_vertex: zu,
    normal_fragment_begin: Ou,
    normal_fragment_maps: Bu,
    normal_pars_fragment: ku,
    normal_pars_vertex: Hu,
    normal_vertex: Vu,
    normalmap_pars_fragment: Gu,
    clearcoat_normal_fragment_begin: Wu,
    clearcoat_normal_fragment_maps: qu,
    clearcoat_pars_fragment: Xu,
    iridescence_pars_fragment: Yu,
    opaque_fragment: ju,
    packing: Ku,
    premultiplied_alpha_fragment: $u,
    project_vertex: Zu,
    dithering_fragment: Ju,
    dithering_pars_fragment: Qu,
    roughnessmap_fragment: td,
    roughnessmap_pars_fragment: ed,
    shadowmap_pars_fragment: nd,
    shadowmap_pars_vertex: id,
    shadowmap_vertex: sd,
    shadowmask_pars_fragment: rd,
    skinbase_vertex: ad,
    skinning_pars_vertex: od,
    skinning_vertex: ld,
    skinnormal_vertex: cd,
    specularmap_fragment: hd,
    specularmap_pars_fragment: ud,
    tonemapping_fragment: dd,
    tonemapping_pars_fragment: fd,
    transmission_fragment: pd,
    transmission_pars_fragment: md,
    uv_pars_fragment: gd,
    uv_pars_vertex: vd,
    uv_vertex: _d,
    worldpos_vertex: xd,
    background_vert: Md,
    background_frag: yd,
    backgroundCube_vert: Sd,
    backgroundCube_frag: Ed,
    cube_vert: wd,
    cube_frag: Td,
    depth_vert: bd,
    depth_frag: Ad,
    distanceRGBA_vert: Rd,
    distanceRGBA_frag: Cd,
    equirect_vert: Pd,
    equirect_frag: Ld,
    linedashed_vert: Dd,
    linedashed_frag: Ud,
    meshbasic_vert: Id,
    meshbasic_frag: Nd,
    meshlambert_vert: Fd,
    meshlambert_frag: zd,
    meshmatcap_vert: Od,
    meshmatcap_frag: Bd,
    meshnormal_vert: kd,
    meshnormal_frag: Hd,
    meshphong_vert: Vd,
    meshphong_frag: Gd,
    meshphysical_vert: Wd,
    meshphysical_frag: qd,
    meshtoon_vert: Xd,
    meshtoon_frag: Yd,
    points_vert: jd,
    points_frag: Kd,
    shadow_vert: $d,
    shadow_frag: Zd,
    sprite_vert: Jd,
    sprite_frag: Qd,
  },
  at = {
    common: {
      diffuse: { value: new Pt(16777215) },
      opacity: { value: 1 },
      map: { value: null },
      mapTransform: { value: new zt() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new zt() },
      alphaTest: { value: 0 },
    },
    specularmap: {
      specularMap: { value: null },
      specularMapTransform: { value: new zt() },
    },
    envmap: {
      envMap: { value: null },
      envMapRotation: { value: new zt() },
      flipEnvMap: { value: -1 },
      reflectivity: { value: 1 },
      ior: { value: 1.5 },
      refractionRatio: { value: 0.98 },
    },
    aomap: {
      aoMap: { value: null },
      aoMapIntensity: { value: 1 },
      aoMapTransform: { value: new zt() },
    },
    lightmap: {
      lightMap: { value: null },
      lightMapIntensity: { value: 1 },
      lightMapTransform: { value: new zt() },
    },
    bumpmap: {
      bumpMap: { value: null },
      bumpMapTransform: { value: new zt() },
      bumpScale: { value: 1 },
    },
    normalmap: {
      normalMap: { value: null },
      normalMapTransform: { value: new zt() },
      normalScale: { value: new It(1, 1) },
    },
    displacementmap: {
      displacementMap: { value: null },
      displacementMapTransform: { value: new zt() },
      displacementScale: { value: 1 },
      displacementBias: { value: 0 },
    },
    emissivemap: {
      emissiveMap: { value: null },
      emissiveMapTransform: { value: new zt() },
    },
    metalnessmap: {
      metalnessMap: { value: null },
      metalnessMapTransform: { value: new zt() },
    },
    roughnessmap: {
      roughnessMap: { value: null },
      roughnessMapTransform: { value: new zt() },
    },
    gradientmap: { gradientMap: { value: null } },
    fog: {
      fogDensity: { value: 25e-5 },
      fogNear: { value: 1 },
      fogFar: { value: 2e3 },
      fogColor: { value: new Pt(16777215) },
    },
    lights: {
      ambientLightColor: { value: [] },
      lightProbe: { value: [] },
      directionalLights: {
        value: [],
        properties: { direction: {}, color: {} },
      },
      directionalLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      directionalShadowMap: { value: [] },
      directionalShadowMatrix: { value: [] },
      spotLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          direction: {},
          distance: {},
          coneCos: {},
          penumbraCos: {},
          decay: {},
        },
      },
      spotLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      spotLightMap: { value: [] },
      spotShadowMap: { value: [] },
      spotLightMatrix: { value: [] },
      pointLights: {
        value: [],
        properties: { color: {}, position: {}, decay: {}, distance: {} },
      },
      pointLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {},
        },
      },
      pointShadowMap: { value: [] },
      pointShadowMatrix: { value: [] },
      hemisphereLights: {
        value: [],
        properties: { direction: {}, skyColor: {}, groundColor: {} },
      },
      rectAreaLights: {
        value: [],
        properties: { color: {}, position: {}, width: {}, height: {} },
      },
      ltc_1: { value: null },
      ltc_2: { value: null },
    },
    points: {
      diffuse: { value: new Pt(16777215) },
      opacity: { value: 1 },
      size: { value: 1 },
      scale: { value: 1 },
      map: { value: null },
      alphaMap: { value: null },
      alphaMapTransform: { value: new zt() },
      alphaTest: { value: 0 },
      uvTransform: { value: new zt() },
    },
    sprite: {
      diffuse: { value: new Pt(16777215) },
      opacity: { value: 1 },
      center: { value: new It(0.5, 0.5) },
      rotation: { value: 0 },
      map: { value: null },
      mapTransform: { value: new zt() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new zt() },
      alphaTest: { value: 0 },
    },
  },
  sn = {
    basic: {
      uniforms: Te([
        at.common,
        at.specularmap,
        at.envmap,
        at.aomap,
        at.lightmap,
        at.fog,
      ]),
      vertexShader: Bt.meshbasic_vert,
      fragmentShader: Bt.meshbasic_frag,
    },
    lambert: {
      uniforms: Te([
        at.common,
        at.specularmap,
        at.envmap,
        at.aomap,
        at.lightmap,
        at.emissivemap,
        at.bumpmap,
        at.normalmap,
        at.displacementmap,
        at.fog,
        at.lights,
        { emissive: { value: new Pt(0) } },
      ]),
      vertexShader: Bt.meshlambert_vert,
      fragmentShader: Bt.meshlambert_frag,
    },
    phong: {
      uniforms: Te([
        at.common,
        at.specularmap,
        at.envmap,
        at.aomap,
        at.lightmap,
        at.emissivemap,
        at.bumpmap,
        at.normalmap,
        at.displacementmap,
        at.fog,
        at.lights,
        {
          emissive: { value: new Pt(0) },
          specular: { value: new Pt(1118481) },
          shininess: { value: 30 },
        },
      ]),
      vertexShader: Bt.meshphong_vert,
      fragmentShader: Bt.meshphong_frag,
    },
    standard: {
      uniforms: Te([
        at.common,
        at.envmap,
        at.aomap,
        at.lightmap,
        at.emissivemap,
        at.bumpmap,
        at.normalmap,
        at.displacementmap,
        at.roughnessmap,
        at.metalnessmap,
        at.fog,
        at.lights,
        {
          emissive: { value: new Pt(0) },
          roughness: { value: 1 },
          metalness: { value: 0 },
          envMapIntensity: { value: 1 },
        },
      ]),
      vertexShader: Bt.meshphysical_vert,
      fragmentShader: Bt.meshphysical_frag,
    },
    toon: {
      uniforms: Te([
        at.common,
        at.aomap,
        at.lightmap,
        at.emissivemap,
        at.bumpmap,
        at.normalmap,
        at.displacementmap,
        at.gradientmap,
        at.fog,
        at.lights,
        { emissive: { value: new Pt(0) } },
      ]),
      vertexShader: Bt.meshtoon_vert,
      fragmentShader: Bt.meshtoon_frag,
    },
    matcap: {
      uniforms: Te([
        at.common,
        at.bumpmap,
        at.normalmap,
        at.displacementmap,
        at.fog,
        { matcap: { value: null } },
      ]),
      vertexShader: Bt.meshmatcap_vert,
      fragmentShader: Bt.meshmatcap_frag,
    },
    points: {
      uniforms: Te([at.points, at.fog]),
      vertexShader: Bt.points_vert,
      fragmentShader: Bt.points_frag,
    },
    dashed: {
      uniforms: Te([
        at.common,
        at.fog,
        {
          scale: { value: 1 },
          dashSize: { value: 1 },
          totalSize: { value: 2 },
        },
      ]),
      vertexShader: Bt.linedashed_vert,
      fragmentShader: Bt.linedashed_frag,
    },
    depth: {
      uniforms: Te([at.common, at.displacementmap]),
      vertexShader: Bt.depth_vert,
      fragmentShader: Bt.depth_frag,
    },
    normal: {
      uniforms: Te([
        at.common,
        at.bumpmap,
        at.normalmap,
        at.displacementmap,
        { opacity: { value: 1 } },
      ]),
      vertexShader: Bt.meshnormal_vert,
      fragmentShader: Bt.meshnormal_frag,
    },
    sprite: {
      uniforms: Te([at.sprite, at.fog]),
      vertexShader: Bt.sprite_vert,
      fragmentShader: Bt.sprite_frag,
    },
    background: {
      uniforms: {
        uvTransform: { value: new zt() },
        t2D: { value: null },
        backgroundIntensity: { value: 1 },
      },
      vertexShader: Bt.background_vert,
      fragmentShader: Bt.background_frag,
    },
    backgroundCube: {
      uniforms: {
        envMap: { value: null },
        flipEnvMap: { value: -1 },
        backgroundBlurriness: { value: 0 },
        backgroundIntensity: { value: 1 },
        backgroundRotation: { value: new zt() },
      },
      vertexShader: Bt.backgroundCube_vert,
      fragmentShader: Bt.backgroundCube_frag,
    },
    cube: {
      uniforms: {
        tCube: { value: null },
        tFlip: { value: -1 },
        opacity: { value: 1 },
      },
      vertexShader: Bt.cube_vert,
      fragmentShader: Bt.cube_frag,
    },
    equirect: {
      uniforms: { tEquirect: { value: null } },
      vertexShader: Bt.equirect_vert,
      fragmentShader: Bt.equirect_frag,
    },
    distanceRGBA: {
      uniforms: Te([
        at.common,
        at.displacementmap,
        {
          referencePosition: { value: new b() },
          nearDistance: { value: 1 },
          farDistance: { value: 1e3 },
        },
      ]),
      vertexShader: Bt.distanceRGBA_vert,
      fragmentShader: Bt.distanceRGBA_frag,
    },
    shadow: {
      uniforms: Te([
        at.lights,
        at.fog,
        { color: { value: new Pt(0) }, opacity: { value: 1 } },
      ]),
      vertexShader: Bt.shadow_vert,
      fragmentShader: Bt.shadow_frag,
    },
  };
sn.physical = {
  uniforms: Te([
    sn.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: new zt() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: new zt() },
      clearcoatNormalScale: { value: new It(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: new zt() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: new zt() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: new zt() },
      sheen: { value: 0 },
      sheenColor: { value: new Pt(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: new zt() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: new zt() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: new zt() },
      transmissionSamplerSize: { value: new It() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: new zt() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: new Pt(0) },
      specularColor: { value: new Pt(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: new zt() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: new zt() },
      anisotropyVector: { value: new It() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: new zt() },
    },
  ]),
  vertexShader: Bt.meshphysical_vert,
  fragmentShader: Bt.meshphysical_frag,
};
const Es = { r: 0, b: 0, g: 0 },
  Vn = new Ee(),
  tf = new Zt();
function ef(i, t, e, n, s, r, a) {
  const l = new Pt(0);
  let o = r === !0 ? 0 : 1,
    c,
    h,
    d = null,
    u = 0,
    m = null;
  function g(w) {
    let M = w.isScene === !0 ? w.background : null;
    return (
      M && M.isTexture && (M = (w.backgroundBlurriness > 0 ? e : t).get(M)),
      M
    );
  }
  function v(w) {
    let M = !1;
    const _ = g(w);
    _ === null ? f(l, o) : _ && _.isColor && (f(_, 1), (M = !0));
    const L = i.xr.getEnvironmentBlendMode();
    (L === "additive"
      ? n.buffers.color.setClear(0, 0, 0, 1, a)
      : L === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a),
      (i.autoClear || M) &&
        (n.buffers.depth.setTest(!0),
        n.buffers.depth.setMask(!0),
        n.buffers.color.setMask(!0),
        i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil)));
  }
  function p(w, M) {
    const _ = g(M);
    _ && (_.isCubeTexture || _.mapping === Vs)
      ? (h === void 0 &&
          ((h = new Ut(
            new te(1, 1, 1),
            new pe({
              name: "BackgroundCubeMaterial",
              uniforms: Li(sn.backgroundCube.uniforms),
              vertexShader: sn.backgroundCube.vertexShader,
              fragmentShader: sn.backgroundCube.fragmentShader,
              side: Ce,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
            }),
          )),
          h.geometry.deleteAttribute("normal"),
          h.geometry.deleteAttribute("uv"),
          (h.onBeforeRender = function (L, R, A) {
            this.matrixWorld.copyPosition(A.matrixWorld);
          }),
          Object.defineProperty(h.material, "envMap", {
            get: function () {
              return this.uniforms.envMap.value;
            },
          }),
          s.update(h)),
        Vn.copy(M.backgroundRotation),
        (Vn.x *= -1),
        (Vn.y *= -1),
        (Vn.z *= -1),
        _.isCubeTexture &&
          _.isRenderTargetTexture === !1 &&
          ((Vn.y *= -1), (Vn.z *= -1)),
        (h.material.uniforms.envMap.value = _),
        (h.material.uniforms.flipEnvMap.value =
          _.isCubeTexture && _.isRenderTargetTexture === !1 ? -1 : 1),
        (h.material.uniforms.backgroundBlurriness.value =
          M.backgroundBlurriness),
        (h.material.uniforms.backgroundIntensity.value = M.backgroundIntensity),
        h.material.uniforms.backgroundRotation.value.setFromMatrix4(
          tf.makeRotationFromEuler(Vn),
        ),
        (h.material.toneMapped = Xt.getTransfer(_.colorSpace) !== Qt),
        (d !== _ || u !== _.version || m !== i.toneMapping) &&
          ((h.material.needsUpdate = !0),
          (d = _),
          (u = _.version),
          (m = i.toneMapping)),
        h.layers.enableAll(),
        w.unshift(h, h.geometry, h.material, 0, 0, null))
      : _ &&
        _.isTexture &&
        (c === void 0 &&
          ((c = new Ut(
            new He(2, 2),
            new pe({
              name: "BackgroundMaterial",
              uniforms: Li(sn.background.uniforms),
              vertexShader: sn.background.vertexShader,
              fragmentShader: sn.background.fragmentShader,
              side: Fn,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
            }),
          )),
          c.geometry.deleteAttribute("normal"),
          Object.defineProperty(c.material, "map", {
            get: function () {
              return this.uniforms.t2D.value;
            },
          }),
          s.update(c)),
        (c.material.uniforms.t2D.value = _),
        (c.material.uniforms.backgroundIntensity.value = M.backgroundIntensity),
        (c.material.toneMapped = Xt.getTransfer(_.colorSpace) !== Qt),
        _.matrixAutoUpdate === !0 && _.updateMatrix(),
        c.material.uniforms.uvTransform.value.copy(_.matrix),
        (d !== _ || u !== _.version || m !== i.toneMapping) &&
          ((c.material.needsUpdate = !0),
          (d = _),
          (u = _.version),
          (m = i.toneMapping)),
        c.layers.enableAll(),
        w.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function f(w, M) {
    (w.getRGB(Es, Rl(i)), n.buffers.color.setClear(Es.r, Es.g, Es.b, M, a));
  }
  return {
    getClearColor: function () {
      return l;
    },
    setClearColor: function (w, M = 1) {
      (l.set(w), (o = M), f(l, o));
    },
    getClearAlpha: function () {
      return o;
    },
    setClearAlpha: function (w) {
      ((o = w), f(l, o));
    },
    render: v,
    addToRenderList: p,
  };
}
function nf(i, t) {
  const e = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    n = {},
    s = u(null);
  let r = s,
    a = !1;
  function l(y, P, z, U, H) {
    let k = !1;
    const G = d(U, z, P);
    (r !== G && ((r = G), c(r.object)),
      (k = m(y, U, z, H)),
      k && g(y, U, z, H),
      H !== null && t.update(H, i.ELEMENT_ARRAY_BUFFER),
      (k || a) &&
        ((a = !1),
        _(y, P, z, U),
        H !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.get(H).buffer)));
  }
  function o() {
    return i.createVertexArray();
  }
  function c(y) {
    return i.bindVertexArray(y);
  }
  function h(y) {
    return i.deleteVertexArray(y);
  }
  function d(y, P, z) {
    const U = z.wireframe === !0;
    let H = n[y.id];
    H === void 0 && ((H = {}), (n[y.id] = H));
    let k = H[P.id];
    k === void 0 && ((k = {}), (H[P.id] = k));
    let G = k[U];
    return (G === void 0 && ((G = u(o())), (k[U] = G)), G);
  }
  function u(y) {
    const P = [],
      z = [],
      U = [];
    for (let H = 0; H < e; H++) ((P[H] = 0), (z[H] = 0), (U[H] = 0));
    return {
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: P,
      enabledAttributes: z,
      attributeDivisors: U,
      object: y,
      attributes: {},
      index: null,
    };
  }
  function m(y, P, z, U) {
    const H = r.attributes,
      k = P.attributes;
    let G = 0;
    const q = z.getAttributes();
    for (const O in q)
      if (q[O].location >= 0) {
        const K = H[O];
        let nt = k[O];
        if (
          (nt === void 0 &&
            (O === "instanceMatrix" &&
              y.instanceMatrix &&
              (nt = y.instanceMatrix),
            O === "instanceColor" && y.instanceColor && (nt = y.instanceColor)),
          K === void 0 || K.attribute !== nt || (nt && K.data !== nt.data))
        )
          return !0;
        G++;
      }
    return r.attributesNum !== G || r.index !== U;
  }
  function g(y, P, z, U) {
    const H = {},
      k = P.attributes;
    let G = 0;
    const q = z.getAttributes();
    for (const O in q)
      if (q[O].location >= 0) {
        let K = k[O];
        K === void 0 &&
          (O === "instanceMatrix" && y.instanceMatrix && (K = y.instanceMatrix),
          O === "instanceColor" && y.instanceColor && (K = y.instanceColor));
        const nt = {};
        ((nt.attribute = K),
          K && K.data && (nt.data = K.data),
          (H[O] = nt),
          G++);
      }
    ((r.attributes = H), (r.attributesNum = G), (r.index = U));
  }
  function v() {
    const y = r.newAttributes;
    for (let P = 0, z = y.length; P < z; P++) y[P] = 0;
  }
  function p(y) {
    f(y, 0);
  }
  function f(y, P) {
    const z = r.newAttributes,
      U = r.enabledAttributes,
      H = r.attributeDivisors;
    ((z[y] = 1),
      U[y] === 0 && (i.enableVertexAttribArray(y), (U[y] = 1)),
      H[y] !== P && (i.vertexAttribDivisor(y, P), (H[y] = P)));
  }
  function w() {
    const y = r.newAttributes,
      P = r.enabledAttributes;
    for (let z = 0, U = P.length; z < U; z++)
      P[z] !== y[z] && (i.disableVertexAttribArray(z), (P[z] = 0));
  }
  function M(y, P, z, U, H, k, G) {
    G === !0
      ? i.vertexAttribIPointer(y, P, z, H, k)
      : i.vertexAttribPointer(y, P, z, U, H, k);
  }
  function _(y, P, z, U) {
    v();
    const H = U.attributes,
      k = z.getAttributes(),
      G = P.defaultAttributeValues;
    for (const q in k) {
      const O = k[q];
      if (O.location >= 0) {
        let et = H[q];
        if (
          (et === void 0 &&
            (q === "instanceMatrix" &&
              y.instanceMatrix &&
              (et = y.instanceMatrix),
            q === "instanceColor" && y.instanceColor && (et = y.instanceColor)),
          et !== void 0)
        ) {
          const K = et.normalized,
            nt = et.itemSize,
            _t = t.get(et);
          if (_t === void 0) continue;
          const Lt = _t.buffer,
            Y = _t.type,
            it = _t.bytesPerElement,
            vt = Y === i.INT || Y === i.UNSIGNED_INT || et.gpuType === Sa;
          if (et.isInterleavedBufferAttribute) {
            const ct = et.data,
              At = ct.stride,
              Dt = et.offset;
            if (ct.isInstancedInterleavedBuffer) {
              for (let kt = 0; kt < O.locationSize; kt++)
                f(O.location + kt, ct.meshPerAttribute);
              y.isInstancedMesh !== !0 &&
                U._maxInstanceCount === void 0 &&
                (U._maxInstanceCount = ct.meshPerAttribute * ct.count);
            } else
              for (let kt = 0; kt < O.locationSize; kt++) p(O.location + kt);
            i.bindBuffer(i.ARRAY_BUFFER, Lt);
            for (let kt = 0; kt < O.locationSize; kt++)
              M(
                O.location + kt,
                nt / O.locationSize,
                Y,
                K,
                At * it,
                (Dt + (nt / O.locationSize) * kt) * it,
                vt,
              );
          } else {
            if (et.isInstancedBufferAttribute) {
              for (let ct = 0; ct < O.locationSize; ct++)
                f(O.location + ct, et.meshPerAttribute);
              y.isInstancedMesh !== !0 &&
                U._maxInstanceCount === void 0 &&
                (U._maxInstanceCount = et.meshPerAttribute * et.count);
            } else
              for (let ct = 0; ct < O.locationSize; ct++) p(O.location + ct);
            i.bindBuffer(i.ARRAY_BUFFER, Lt);
            for (let ct = 0; ct < O.locationSize; ct++)
              M(
                O.location + ct,
                nt / O.locationSize,
                Y,
                K,
                nt * it,
                (nt / O.locationSize) * ct * it,
                vt,
              );
          }
        } else if (G !== void 0) {
          const K = G[q];
          if (K !== void 0)
            switch (K.length) {
              case 2:
                i.vertexAttrib2fv(O.location, K);
                break;
              case 3:
                i.vertexAttrib3fv(O.location, K);
                break;
              case 4:
                i.vertexAttrib4fv(O.location, K);
                break;
              default:
                i.vertexAttrib1fv(O.location, K);
            }
        }
      }
    }
    w();
  }
  function L() {
    C();
    for (const y in n) {
      const P = n[y];
      for (const z in P) {
        const U = P[z];
        for (const H in U) (h(U[H].object), delete U[H]);
        delete P[z];
      }
      delete n[y];
    }
  }
  function R(y) {
    if (n[y.id] === void 0) return;
    const P = n[y.id];
    for (const z in P) {
      const U = P[z];
      for (const H in U) (h(U[H].object), delete U[H]);
      delete P[z];
    }
    delete n[y.id];
  }
  function A(y) {
    for (const P in n) {
      const z = n[P];
      if (z[y.id] === void 0) continue;
      const U = z[y.id];
      for (const H in U) (h(U[H].object), delete U[H]);
      delete z[y.id];
    }
  }
  function C() {
    (S(), (a = !0), r !== s && ((r = s), c(r.object)));
  }
  function S() {
    ((s.geometry = null), (s.program = null), (s.wireframe = !1));
  }
  return {
    setup: l,
    reset: C,
    resetDefaultState: S,
    dispose: L,
    releaseStatesOfGeometry: R,
    releaseStatesOfProgram: A,
    initAttributes: v,
    enableAttribute: p,
    disableUnusedAttributes: w,
  };
}
function sf(i, t, e) {
  let n;
  function s(c) {
    n = c;
  }
  function r(c, h) {
    (i.drawArrays(n, c, h), e.update(h, n, 1));
  }
  function a(c, h, d) {
    d !== 0 && (i.drawArraysInstanced(n, c, h, d), e.update(h, n, d));
  }
  function l(c, h, d) {
    if (d === 0) return;
    t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, h, 0, d);
    let m = 0;
    for (let g = 0; g < d; g++) m += h[g];
    e.update(m, n, 1);
  }
  function o(c, h, d, u) {
    if (d === 0) return;
    const m = t.get("WEBGL_multi_draw");
    if (m === null) for (let g = 0; g < c.length; g++) a(c[g], h[g], u[g]);
    else {
      m.multiDrawArraysInstancedWEBGL(n, c, 0, h, 0, u, 0, d);
      let g = 0;
      for (let v = 0; v < d; v++) g += h[v] * u[v];
      e.update(g, n, 1);
    }
  }
  ((this.setMode = s),
    (this.render = r),
    (this.renderInstances = a),
    (this.renderMultiDraw = l),
    (this.renderMultiDrawInstances = o));
}
function rf(i, t, e, n) {
  let s;
  function r() {
    if (s !== void 0) return s;
    if (t.has("EXT_texture_filter_anisotropic") === !0) {
      const A = t.get("EXT_texture_filter_anisotropic");
      s = i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else s = 0;
    return s;
  }
  function a(A) {
    return !(
      A !== tn &&
      n.convert(A) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT)
    );
  }
  function l(A) {
    const C =
      A === Qn &&
      (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
    return !(
      A !== yn &&
      n.convert(A) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) &&
      A !== rn &&
      !C
    );
  }
  function o(A) {
    if (A === "highp") {
      if (
        i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision >
          0 &&
        i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision >
          0
      )
        return "highp";
      A = "mediump";
    }
    return A === "mediump" &&
      i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision >
        0 &&
      i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision >
        0
      ? "mediump"
      : "lowp";
  }
  let c = e.precision !== void 0 ? e.precision : "highp";
  const h = o(c);
  h !== c &&
    (console.warn(
      "THREE.WebGLRenderer:",
      c,
      "not supported, using",
      h,
      "instead.",
    ),
    (c = h));
  const d = e.logarithmicDepthBuffer === !0,
    u = e.reverseDepthBuffer === !0 && t.has("EXT_clip_control"),
    m = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),
    g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    v = i.getParameter(i.MAX_TEXTURE_SIZE),
    p = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),
    f = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    w = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),
    M = i.getParameter(i.MAX_VARYING_VECTORS),
    _ = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),
    L = g > 0,
    R = i.getParameter(i.MAX_SAMPLES);
  return {
    isWebGL2: !0,
    getMaxAnisotropy: r,
    getMaxPrecision: o,
    textureFormatReadable: a,
    textureTypeReadable: l,
    precision: c,
    logarithmicDepthBuffer: d,
    reverseDepthBuffer: u,
    maxTextures: m,
    maxVertexTextures: g,
    maxTextureSize: v,
    maxCubemapSize: p,
    maxAttributes: f,
    maxVertexUniforms: w,
    maxVaryings: M,
    maxFragmentUniforms: _,
    vertexTextures: L,
    maxSamples: R,
  };
}
function af(i) {
  const t = this;
  let e = null,
    n = 0,
    s = !1,
    r = !1;
  const a = new qn(),
    l = new zt(),
    o = { value: null, needsUpdate: !1 };
  ((this.uniform = o),
    (this.numPlanes = 0),
    (this.numIntersection = 0),
    (this.init = function (d, u) {
      const m = d.length !== 0 || u || n !== 0 || s;
      return ((s = u), (n = d.length), m);
    }),
    (this.beginShadows = function () {
      ((r = !0), h(null));
    }),
    (this.endShadows = function () {
      r = !1;
    }),
    (this.setGlobalState = function (d, u) {
      e = h(d, u, 0);
    }),
    (this.setState = function (d, u, m) {
      const g = d.clippingPlanes,
        v = d.clipIntersection,
        p = d.clipShadows,
        f = i.get(d);
      if (!s || g === null || g.length === 0 || (r && !p)) r ? h(null) : c();
      else {
        const w = r ? 0 : n,
          M = w * 4;
        let _ = f.clippingState || null;
        ((o.value = _), (_ = h(g, u, M, m)));
        for (let L = 0; L !== M; ++L) _[L] = e[L];
        ((f.clippingState = _),
          (this.numIntersection = v ? this.numPlanes : 0),
          (this.numPlanes += w));
      }
    }));
  function c() {
    (o.value !== e && ((o.value = e), (o.needsUpdate = n > 0)),
      (t.numPlanes = n),
      (t.numIntersection = 0));
  }
  function h(d, u, m, g) {
    const v = d !== null ? d.length : 0;
    let p = null;
    if (v !== 0) {
      if (((p = o.value), g !== !0 || p === null)) {
        const f = m + v * 4,
          w = u.matrixWorldInverse;
        (l.getNormalMatrix(w),
          (p === null || p.length < f) && (p = new Float32Array(f)));
        for (let M = 0, _ = m; M !== v; ++M, _ += 4)
          (a.copy(d[M]).applyMatrix4(w, l),
            a.normal.toArray(p, _),
            (p[_ + 3] = a.constant));
      }
      ((o.value = p), (o.needsUpdate = !0));
    }
    return ((t.numPlanes = v), (t.numIntersection = 0), p);
  }
}
function of(i) {
  let t = new WeakMap();
  function e(a, l) {
    return (l === kr ? (a.mapping = Ai) : l === Hr && (a.mapping = Ri), a);
  }
  function n(a) {
    if (a && a.isTexture) {
      const l = a.mapping;
      if (l === kr || l === Hr)
        if (t.has(a)) {
          const o = t.get(a).texture;
          return e(o, a.mapping);
        } else {
          const o = a.image;
          if (o && o.height > 0) {
            const c = new vh(o.height);
            return (
              c.fromEquirectangularTexture(i, a),
              t.set(a, c),
              a.addEventListener("dispose", s),
              e(c.texture, a.mapping)
            );
          } else return null;
        }
    }
    return a;
  }
  function s(a) {
    const l = a.target;
    l.removeEventListener("dispose", s);
    const o = t.get(l);
    o !== void 0 && (t.delete(l), o.dispose());
  }
  function r() {
    t = new WeakMap();
  }
  return { get: n, dispose: r };
}
class La extends Cl {
  constructor(t = -1, e = 1, n = 1, s = -1, r = 0.1, a = 2e3) {
    (super(),
      (this.isOrthographicCamera = !0),
      (this.type = "OrthographicCamera"),
      (this.zoom = 1),
      (this.view = null),
      (this.left = t),
      (this.right = e),
      (this.top = n),
      (this.bottom = s),
      (this.near = r),
      (this.far = a),
      this.updateProjectionMatrix());
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      (this.left = t.left),
      (this.right = t.right),
      (this.top = t.top),
      (this.bottom = t.bottom),
      (this.near = t.near),
      (this.far = t.far),
      (this.zoom = t.zoom),
      (this.view = t.view === null ? null : Object.assign({}, t.view)),
      this
    );
  }
  setViewOffset(t, e, n, s, r, a) {
    (this.view === null &&
      (this.view = {
        enabled: !0,
        fullWidth: 1,
        fullHeight: 1,
        offsetX: 0,
        offsetY: 0,
        width: 1,
        height: 1,
      }),
      (this.view.enabled = !0),
      (this.view.fullWidth = t),
      (this.view.fullHeight = e),
      (this.view.offsetX = n),
      (this.view.offsetY = s),
      (this.view.width = r),
      (this.view.height = a),
      this.updateProjectionMatrix());
  }
  clearViewOffset() {
    (this.view !== null && (this.view.enabled = !1),
      this.updateProjectionMatrix());
  }
  updateProjectionMatrix() {
    const t = (this.right - this.left) / (2 * this.zoom),
      e = (this.top - this.bottom) / (2 * this.zoom),
      n = (this.right + this.left) / 2,
      s = (this.top + this.bottom) / 2;
    let r = n - t,
      a = n + t,
      l = s + e,
      o = s - e;
    if (this.view !== null && this.view.enabled) {
      const c = (this.right - this.left) / this.view.fullWidth / this.zoom,
        h = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
      ((r += c * this.view.offsetX),
        (a = r + c * this.view.width),
        (l -= h * this.view.offsetY),
        (o = l - h * this.view.height));
    }
    (this.projectionMatrix.makeOrthographic(
      r,
      a,
      l,
      o,
      this.near,
      this.far,
      this.coordinateSystem,
    ),
      this.projectionMatrixInverse.copy(this.projectionMatrix).invert());
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      (e.object.zoom = this.zoom),
      (e.object.left = this.left),
      (e.object.right = this.right),
      (e.object.top = this.top),
      (e.object.bottom = this.bottom),
      (e.object.near = this.near),
      (e.object.far = this.far),
      this.view !== null && (e.object.view = Object.assign({}, this.view)),
      e
    );
  }
}
const Si = 4,
  yo = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
  Yn = 20,
  mr = new La(),
  So = new Pt();
let gr = null,
  vr = 0,
  _r = 0,
  xr = !1;
const Xn = (1 + Math.sqrt(5)) / 2,
  vi = 1 / Xn,
  Eo = [
    new b(-Xn, vi, 0),
    new b(Xn, vi, 0),
    new b(-vi, 0, Xn),
    new b(vi, 0, Xn),
    new b(0, Xn, -vi),
    new b(0, Xn, vi),
    new b(-1, 1, -1),
    new b(1, 1, -1),
    new b(-1, 1, 1),
    new b(1, 1, 1),
  ];
class ga {
  constructor(t) {
    ((this._renderer = t),
      (this._pingPongRenderTarget = null),
      (this._lodMax = 0),
      (this._cubeSize = 0),
      (this._lodPlanes = []),
      (this._sizeLods = []),
      (this._sigmas = []),
      (this._blurMaterial = null),
      (this._cubemapMaterial = null),
      (this._equirectMaterial = null),
      this._compileMaterial(this._blurMaterial));
  }
  fromScene(t, e = 0, n = 0.1, s = 100) {
    ((gr = this._renderer.getRenderTarget()),
      (vr = this._renderer.getActiveCubeFace()),
      (_r = this._renderer.getActiveMipmapLevel()),
      (xr = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1),
      this._setSize(256));
    const r = this._allocateTargets();
    return (
      (r.depthBuffer = !0),
      this._sceneToCubeUV(t, n, s, r),
      e > 0 && this._blur(r, 0, 0, e),
      this._applyPMREM(r),
      this._cleanup(r),
      r
    );
  }
  fromEquirectangular(t, e = null) {
    return this._fromTexture(t, e);
  }
  fromCubemap(t, e = null) {
    return this._fromTexture(t, e);
  }
  compileCubemapShader() {
    this._cubemapMaterial === null &&
      ((this._cubemapMaterial = bo()),
      this._compileMaterial(this._cubemapMaterial));
  }
  compileEquirectangularShader() {
    this._equirectMaterial === null &&
      ((this._equirectMaterial = To()),
      this._compileMaterial(this._equirectMaterial));
  }
  dispose() {
    (this._dispose(),
      this._cubemapMaterial !== null && this._cubemapMaterial.dispose(),
      this._equirectMaterial !== null && this._equirectMaterial.dispose());
  }
  _setSize(t) {
    ((this._lodMax = Math.floor(Math.log2(t))),
      (this._cubeSize = Math.pow(2, this._lodMax)));
  }
  _dispose() {
    (this._blurMaterial !== null && this._blurMaterial.dispose(),
      this._pingPongRenderTarget !== null &&
        this._pingPongRenderTarget.dispose());
    for (let t = 0; t < this._lodPlanes.length; t++)
      this._lodPlanes[t].dispose();
  }
  _cleanup(t) {
    (this._renderer.setRenderTarget(gr, vr, _r),
      (this._renderer.xr.enabled = xr),
      (t.scissorTest = !1),
      ws(t, 0, 0, t.width, t.height));
  }
  _fromTexture(t, e) {
    (t.mapping === Ai || t.mapping === Ri
      ? this._setSize(
          t.image.length === 0
            ? 16
            : t.image[0].width || t.image[0].image.width,
        )
      : this._setSize(t.image.width / 4),
      (gr = this._renderer.getRenderTarget()),
      (vr = this._renderer.getActiveCubeFace()),
      (_r = this._renderer.getActiveMipmapLevel()),
      (xr = this._renderer.xr.enabled),
      (this._renderer.xr.enabled = !1));
    const n = e || this._allocateTargets();
    return (
      this._textureToCubeUV(t, n),
      this._applyPMREM(n),
      this._cleanup(n),
      n
    );
  }
  _allocateTargets() {
    const t = 3 * Math.max(this._cubeSize, 112),
      e = 4 * this._cubeSize,
      n = {
        magFilter: Ne,
        minFilter: Ne,
        generateMipmaps: !1,
        type: Qn,
        format: tn,
        colorSpace: Ui,
        depthBuffer: !1,
      },
      s = wo(t, e, n);
    if (
      this._pingPongRenderTarget === null ||
      this._pingPongRenderTarget.width !== t ||
      this._pingPongRenderTarget.height !== e
    ) {
      (this._pingPongRenderTarget !== null && this._dispose(),
        (this._pingPongRenderTarget = wo(t, e, n)));
      const { _lodMax: r } = this;
      (({
        sizeLods: this._sizeLods,
        lodPlanes: this._lodPlanes,
        sigmas: this._sigmas,
      } = lf(r)),
        (this._blurMaterial = cf(r, t, e)));
    }
    return s;
  }
  _compileMaterial(t) {
    const e = new Ut(this._lodPlanes[0], t);
    this._renderer.compile(e, mr);
  }
  _sceneToCubeUV(t, e, n, s) {
    const l = new Ue(90, 1, e, n),
      o = [1, -1, 1, 1, 1, 1],
      c = [1, 1, 1, -1, -1, -1],
      h = this._renderer,
      d = h.autoClear,
      u = h.toneMapping;
    (h.getClearColor(So), (h.toneMapping = _n), (h.autoClear = !1));
    const m = new Zi({
        name: "PMREM.Background",
        side: Ce,
        depthWrite: !1,
        depthTest: !1,
      }),
      g = new Ut(new te(), m);
    let v = !1;
    const p = t.background;
    p
      ? p.isColor && (m.color.copy(p), (t.background = null), (v = !0))
      : (m.color.copy(So), (v = !0));
    for (let f = 0; f < 6; f++) {
      const w = f % 3;
      w === 0
        ? (l.up.set(0, o[f], 0), l.lookAt(c[f], 0, 0))
        : w === 1
          ? (l.up.set(0, 0, o[f]), l.lookAt(0, c[f], 0))
          : (l.up.set(0, o[f], 0), l.lookAt(0, 0, c[f]));
      const M = this._cubeSize;
      (ws(s, w * M, f > 2 ? M : 0, M, M),
        h.setRenderTarget(s),
        v && h.render(g, l),
        h.render(t, l));
    }
    (g.geometry.dispose(),
      g.material.dispose(),
      (h.toneMapping = u),
      (h.autoClear = d),
      (t.background = p));
  }
  _textureToCubeUV(t, e) {
    const n = this._renderer,
      s = t.mapping === Ai || t.mapping === Ri;
    s
      ? (this._cubemapMaterial === null && (this._cubemapMaterial = bo()),
        (this._cubemapMaterial.uniforms.flipEnvMap.value =
          t.isRenderTargetTexture === !1 ? -1 : 1))
      : this._equirectMaterial === null && (this._equirectMaterial = To());
    const r = s ? this._cubemapMaterial : this._equirectMaterial,
      a = new Ut(this._lodPlanes[0], r),
      l = r.uniforms;
    l.envMap.value = t;
    const o = this._cubeSize;
    (ws(e, 0, 0, 3 * o, 2 * o), n.setRenderTarget(e), n.render(a, mr));
  }
  _applyPMREM(t) {
    const e = this._renderer,
      n = e.autoClear;
    e.autoClear = !1;
    const s = this._lodPlanes.length;
    for (let r = 1; r < s; r++) {
      const a = Math.sqrt(
          this._sigmas[r] * this._sigmas[r] -
            this._sigmas[r - 1] * this._sigmas[r - 1],
        ),
        l = Eo[(s - r - 1) % Eo.length];
      this._blur(t, r - 1, r, a, l);
    }
    e.autoClear = n;
  }
  _blur(t, e, n, s, r) {
    const a = this._pingPongRenderTarget;
    (this._halfBlur(t, a, e, n, s, "latitudinal", r),
      this._halfBlur(a, t, n, n, s, "longitudinal", r));
  }
  _halfBlur(t, e, n, s, r, a, l) {
    const o = this._renderer,
      c = this._blurMaterial;
    a !== "latitudinal" &&
      a !== "longitudinal" &&
      console.error(
        "blur direction must be either latitudinal or longitudinal!",
      );
    const h = 3,
      d = new Ut(this._lodPlanes[s], c),
      u = c.uniforms,
      m = this._sizeLods[n] - 1,
      g = isFinite(r) ? Math.PI / (2 * m) : (2 * Math.PI) / (2 * Yn - 1),
      v = r / g,
      p = isFinite(r) ? 1 + Math.floor(h * v) : Yn;
    p > Yn &&
      console.warn(
        `sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Yn}`,
      );
    const f = [];
    let w = 0;
    for (let A = 0; A < Yn; ++A) {
      const C = A / v,
        S = Math.exp((-C * C) / 2);
      (f.push(S), A === 0 ? (w += S) : A < p && (w += 2 * S));
    }
    for (let A = 0; A < f.length; A++) f[A] = f[A] / w;
    ((u.envMap.value = t.texture),
      (u.samples.value = p),
      (u.weights.value = f),
      (u.latitudinal.value = a === "latitudinal"),
      l && (u.poleAxis.value = l));
    const { _lodMax: M } = this;
    ((u.dTheta.value = g), (u.mipInt.value = M - n));
    const _ = this._sizeLods[s],
      L = 3 * _ * (s > M - Si ? s - M + Si : 0),
      R = 4 * (this._cubeSize - _);
    (ws(e, L, R, 3 * _, 2 * _), o.setRenderTarget(e), o.render(d, mr));
  }
}
function lf(i) {
  const t = [],
    e = [],
    n = [];
  let s = i;
  const r = i - Si + 1 + yo.length;
  for (let a = 0; a < r; a++) {
    const l = Math.pow(2, s);
    e.push(l);
    let o = 1 / l;
    (a > i - Si ? (o = yo[a - i + Si - 1]) : a === 0 && (o = 0), n.push(o));
    const c = 1 / (l - 2),
      h = -c,
      d = 1 + c,
      u = [h, h, d, h, d, d, h, h, d, d, h, d],
      m = 6,
      g = 6,
      v = 3,
      p = 2,
      f = 1,
      w = new Float32Array(v * g * m),
      M = new Float32Array(p * g * m),
      _ = new Float32Array(f * g * m);
    for (let R = 0; R < m; R++) {
      const A = ((R % 3) * 2) / 3 - 1,
        C = R > 2 ? 0 : -1,
        S = [
          A,
          C,
          0,
          A + 2 / 3,
          C,
          0,
          A + 2 / 3,
          C + 1,
          0,
          A,
          C,
          0,
          A + 2 / 3,
          C + 1,
          0,
          A,
          C + 1,
          0,
        ];
      (w.set(S, v * g * R), M.set(u, p * g * R));
      const y = [R, R, R, R, R, R];
      _.set(y, f * g * R);
    }
    const L = new Le();
    (L.setAttribute("position", new Ye(w, v)),
      L.setAttribute("uv", new Ye(M, p)),
      L.setAttribute("faceIndex", new Ye(_, f)),
      t.push(L),
      s > Si && s--);
  }
  return { lodPlanes: t, sizeLods: e, sigmas: n };
}
function wo(i, t, e) {
  const n = new Sn(i, t, e);
  return (
    (n.texture.mapping = Vs),
    (n.texture.name = "PMREM.cubeUv"),
    (n.scissorTest = !0),
    n
  );
}
function ws(i, t, e, n, s) {
  (i.viewport.set(t, e, n, s), i.scissor.set(t, e, n, s));
}
function cf(i, t, e) {
  const n = new Float32Array(Yn),
    s = new b(0, 1, 0);
  return new pe({
    name: "SphericalGaussianBlur",
    defines: {
      n: Yn,
      CUBEUV_TEXEL_WIDTH: 1 / t,
      CUBEUV_TEXEL_HEIGHT: 1 / e,
      CUBEUV_MAX_MIP: `${i}.0`,
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: s },
    },
    vertexShader: Da(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
    blending: In,
    depthTest: !1,
    depthWrite: !1,
  });
}
function To() {
  return new pe({
    name: "EquirectangularToCubeUV",
    uniforms: { envMap: { value: null } },
    vertexShader: Da(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
    blending: In,
    depthTest: !1,
    depthWrite: !1,
  });
}
function bo() {
  return new pe({
    name: "CubemapToCubeUV",
    uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } },
    vertexShader: Da(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
    blending: In,
    depthTest: !1,
    depthWrite: !1,
  });
}
function Da() {
  return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
function hf(i) {
  let t = new WeakMap(),
    e = null;
  function n(l) {
    if (l && l.isTexture) {
      const o = l.mapping,
        c = o === kr || o === Hr,
        h = o === Ai || o === Ri;
      if (c || h) {
        let d = t.get(l);
        const u = d !== void 0 ? d.texture.pmremVersion : 0;
        if (l.isRenderTargetTexture && l.pmremVersion !== u)
          return (
            e === null && (e = new ga(i)),
            (d = c ? e.fromEquirectangular(l, d) : e.fromCubemap(l, d)),
            (d.texture.pmremVersion = l.pmremVersion),
            t.set(l, d),
            d.texture
          );
        if (d !== void 0) return d.texture;
        {
          const m = l.image;
          return (c && m && m.height > 0) || (h && m && s(m))
            ? (e === null && (e = new ga(i)),
              (d = c ? e.fromEquirectangular(l) : e.fromCubemap(l)),
              (d.texture.pmremVersion = l.pmremVersion),
              t.set(l, d),
              l.addEventListener("dispose", r),
              d.texture)
            : null;
        }
      }
    }
    return l;
  }
  function s(l) {
    let o = 0;
    const c = 6;
    for (let h = 0; h < c; h++) l[h] !== void 0 && o++;
    return o === c;
  }
  function r(l) {
    const o = l.target;
    o.removeEventListener("dispose", r);
    const c = t.get(o);
    c !== void 0 && (t.delete(o), c.dispose());
  }
  function a() {
    ((t = new WeakMap()), e !== null && (e.dispose(), (e = null)));
  }
  return { get: n, dispose: a };
}
function uf(i) {
  const t = {};
  function e(n) {
    if (t[n] !== void 0) return t[n];
    let s;
    switch (n) {
      case "WEBGL_depth_texture":
        s =
          i.getExtension("WEBGL_depth_texture") ||
          i.getExtension("MOZ_WEBGL_depth_texture") ||
          i.getExtension("WEBKIT_WEBGL_depth_texture");
        break;
      case "EXT_texture_filter_anisotropic":
        s =
          i.getExtension("EXT_texture_filter_anisotropic") ||
          i.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
          i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
        break;
      case "WEBGL_compressed_texture_s3tc":
        s =
          i.getExtension("WEBGL_compressed_texture_s3tc") ||
          i.getExtension("MOZ_WEBGL_compressed_texture_s3tc") ||
          i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
        break;
      case "WEBGL_compressed_texture_pvrtc":
        s =
          i.getExtension("WEBGL_compressed_texture_pvrtc") ||
          i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
        break;
      default:
        s = i.getExtension(n);
    }
    return ((t[n] = s), s);
  }
  return {
    has: function (n) {
      return e(n) !== null;
    },
    init: function () {
      (e("EXT_color_buffer_float"),
        e("WEBGL_clip_cull_distance"),
        e("OES_texture_float_linear"),
        e("EXT_color_buffer_half_float"),
        e("WEBGL_multisampled_render_to_texture"),
        e("WEBGL_render_shared_exponent"));
    },
    get: function (n) {
      const s = e(n);
      return (
        s === null &&
          Yi("THREE.WebGLRenderer: " + n + " extension not supported."),
        s
      );
    },
  };
}
function df(i, t, e, n) {
  const s = {},
    r = new WeakMap();
  function a(d) {
    const u = d.target;
    u.index !== null && t.remove(u.index);
    for (const g in u.attributes) t.remove(u.attributes[g]);
    for (const g in u.morphAttributes) {
      const v = u.morphAttributes[g];
      for (let p = 0, f = v.length; p < f; p++) t.remove(v[p]);
    }
    (u.removeEventListener("dispose", a), delete s[u.id]);
    const m = r.get(u);
    (m && (t.remove(m), r.delete(u)),
      n.releaseStatesOfGeometry(u),
      u.isInstancedBufferGeometry === !0 && delete u._maxInstanceCount,
      e.memory.geometries--);
  }
  function l(d, u) {
    return (
      s[u.id] === !0 ||
        (u.addEventListener("dispose", a),
        (s[u.id] = !0),
        e.memory.geometries++),
      u
    );
  }
  function o(d) {
    const u = d.attributes;
    for (const g in u) t.update(u[g], i.ARRAY_BUFFER);
    const m = d.morphAttributes;
    for (const g in m) {
      const v = m[g];
      for (let p = 0, f = v.length; p < f; p++) t.update(v[p], i.ARRAY_BUFFER);
    }
  }
  function c(d) {
    const u = [],
      m = d.index,
      g = d.attributes.position;
    let v = 0;
    if (m !== null) {
      const w = m.array;
      v = m.version;
      for (let M = 0, _ = w.length; M < _; M += 3) {
        const L = w[M + 0],
          R = w[M + 1],
          A = w[M + 2];
        u.push(L, R, R, A, A, L);
      }
    } else if (g !== void 0) {
      const w = g.array;
      v = g.version;
      for (let M = 0, _ = w.length / 3 - 1; M < _; M += 3) {
        const L = M + 0,
          R = M + 1,
          A = M + 2;
        u.push(L, R, R, A, A, L);
      }
    } else return;
    const p = new (yl(u) ? Al : bl)(u, 1);
    p.version = v;
    const f = r.get(d);
    (f && t.remove(f), r.set(d, p));
  }
  function h(d) {
    const u = r.get(d);
    if (u) {
      const m = d.index;
      m !== null && u.version < m.version && c(d);
    } else c(d);
    return r.get(d);
  }
  return { get: l, update: o, getWireframeAttribute: h };
}
function ff(i, t, e) {
  let n;
  function s(u) {
    n = u;
  }
  let r, a;
  function l(u) {
    ((r = u.type), (a = u.bytesPerElement));
  }
  function o(u, m) {
    (i.drawElements(n, m, r, u * a), e.update(m, n, 1));
  }
  function c(u, m, g) {
    g !== 0 && (i.drawElementsInstanced(n, m, r, u * a, g), e.update(m, n, g));
  }
  function h(u, m, g) {
    if (g === 0) return;
    t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, m, 0, r, u, 0, g);
    let p = 0;
    for (let f = 0; f < g; f++) p += m[f];
    e.update(p, n, 1);
  }
  function d(u, m, g, v) {
    if (g === 0) return;
    const p = t.get("WEBGL_multi_draw");
    if (p === null) for (let f = 0; f < u.length; f++) c(u[f] / a, m[f], v[f]);
    else {
      p.multiDrawElementsInstancedWEBGL(n, m, 0, r, u, 0, v, 0, g);
      let f = 0;
      for (let w = 0; w < g; w++) f += m[w] * v[w];
      e.update(f, n, 1);
    }
  }
  ((this.setMode = s),
    (this.setIndex = l),
    (this.render = o),
    (this.renderInstances = c),
    (this.renderMultiDraw = h),
    (this.renderMultiDrawInstances = d));
}
function pf(i) {
  const t = { geometries: 0, textures: 0 },
    e = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
  function n(r, a, l) {
    switch ((e.calls++, a)) {
      case i.TRIANGLES:
        e.triangles += l * (r / 3);
        break;
      case i.LINES:
        e.lines += l * (r / 2);
        break;
      case i.LINE_STRIP:
        e.lines += l * (r - 1);
        break;
      case i.LINE_LOOP:
        e.lines += l * r;
        break;
      case i.POINTS:
        e.points += l * r;
        break;
      default:
        console.error("THREE.WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function s() {
    ((e.calls = 0), (e.triangles = 0), (e.points = 0), (e.lines = 0));
  }
  return {
    memory: t,
    render: e,
    programs: null,
    autoReset: !0,
    reset: s,
    update: n,
  };
}
function mf(i, t, e) {
  const n = new WeakMap(),
    s = new ee();
  function r(a, l, o) {
    const c = a.morphTargetInfluences,
      h =
        l.morphAttributes.position ||
        l.morphAttributes.normal ||
        l.morphAttributes.color,
      d = h !== void 0 ? h.length : 0;
    let u = n.get(l);
    if (u === void 0 || u.count !== d) {
      let y = function () {
        (C.dispose(), n.delete(l), l.removeEventListener("dispose", y));
      };
      var m = y;
      u !== void 0 && u.texture.dispose();
      const g = l.morphAttributes.position !== void 0,
        v = l.morphAttributes.normal !== void 0,
        p = l.morphAttributes.color !== void 0,
        f = l.morphAttributes.position || [],
        w = l.morphAttributes.normal || [],
        M = l.morphAttributes.color || [];
      let _ = 0;
      (g === !0 && (_ = 1), v === !0 && (_ = 2), p === !0 && (_ = 3));
      let L = l.attributes.position.count * _,
        R = 1;
      L > t.maxTextureSize &&
        ((R = Math.ceil(L / t.maxTextureSize)), (L = t.maxTextureSize));
      const A = new Float32Array(L * R * 4 * d),
        C = new El(A, L, R, d);
      ((C.type = rn), (C.needsUpdate = !0));
      const S = _ * 4;
      for (let P = 0; P < d; P++) {
        const z = f[P],
          U = w[P],
          H = M[P],
          k = L * R * 4 * P;
        for (let G = 0; G < z.count; G++) {
          const q = G * S;
          (g === !0 &&
            (s.fromBufferAttribute(z, G),
            (A[k + q + 0] = s.x),
            (A[k + q + 1] = s.y),
            (A[k + q + 2] = s.z),
            (A[k + q + 3] = 0)),
            v === !0 &&
              (s.fromBufferAttribute(U, G),
              (A[k + q + 4] = s.x),
              (A[k + q + 5] = s.y),
              (A[k + q + 6] = s.z),
              (A[k + q + 7] = 0)),
            p === !0 &&
              (s.fromBufferAttribute(H, G),
              (A[k + q + 8] = s.x),
              (A[k + q + 9] = s.y),
              (A[k + q + 10] = s.z),
              (A[k + q + 11] = H.itemSize === 4 ? s.w : 1)));
        }
      }
      ((u = { count: d, texture: C, size: new It(L, R) }),
        n.set(l, u),
        l.addEventListener("dispose", y));
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      o.getUniforms().setValue(i, "morphTexture", a.morphTexture, e);
    else {
      let g = 0;
      for (let p = 0; p < c.length; p++) g += c[p];
      const v = l.morphTargetsRelative ? 1 : 1 - g;
      (o.getUniforms().setValue(i, "morphTargetBaseInfluence", v),
        o.getUniforms().setValue(i, "morphTargetInfluences", c));
    }
    (o.getUniforms().setValue(i, "morphTargetsTexture", u.texture, e),
      o.getUniforms().setValue(i, "morphTargetsTextureSize", u.size));
  }
  return { update: r };
}
function gf(i, t, e, n) {
  let s = new WeakMap();
  function r(o) {
    const c = n.render.frame,
      h = o.geometry,
      d = t.get(o, h);
    if (
      (s.get(d) !== c && (t.update(d), s.set(d, c)),
      o.isInstancedMesh &&
        (o.hasEventListener("dispose", l) === !1 &&
          o.addEventListener("dispose", l),
        s.get(o) !== c &&
          (e.update(o.instanceMatrix, i.ARRAY_BUFFER),
          o.instanceColor !== null && e.update(o.instanceColor, i.ARRAY_BUFFER),
          s.set(o, c))),
      o.isSkinnedMesh)
    ) {
      const u = o.skeleton;
      s.get(u) !== c && (u.update(), s.set(u, c));
    }
    return d;
  }
  function a() {
    s = new WeakMap();
  }
  function l(o) {
    const c = o.target;
    (c.removeEventListener("dispose", l),
      e.remove(c.instanceMatrix),
      c.instanceColor !== null && e.remove(c.instanceColor));
  }
  return { update: r, dispose: a };
}
class Dl extends Pe {
  constructor(t, e, n, s, r, a, l, o, c, h = wi) {
    if (h !== wi && h !== Pi)
      throw new Error(
        "DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat",
      );
    (n === void 0 && h === wi && (n = Jn),
      n === void 0 && h === Pi && (n = Ci),
      super(null, s, r, a, l, o, h, n, c),
      (this.isDepthTexture = !0),
      (this.image = { width: t, height: e }),
      (this.magFilter = l !== void 0 ? l : ke),
      (this.minFilter = o !== void 0 ? o : ke),
      (this.flipY = !1),
      (this.generateMipmaps = !1),
      (this.compareFunction = null));
  }
  copy(t) {
    return (super.copy(t), (this.compareFunction = t.compareFunction), this);
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      this.compareFunction !== null &&
        (e.compareFunction = this.compareFunction),
      e
    );
  }
}
const Ul = new Pe(),
  Ao = new Dl(1, 1),
  Il = new El(),
  Nl = new th(),
  Fl = new Pl(),
  Ro = [],
  Co = [],
  Po = new Float32Array(16),
  Lo = new Float32Array(9),
  Do = new Float32Array(4);
function Fi(i, t, e) {
  const n = i[0];
  if (n <= 0 || n > 0) return i;
  const s = t * e;
  let r = Ro[s];
  if ((r === void 0 && ((r = new Float32Array(s)), (Ro[s] = r)), t !== 0)) {
    n.toArray(r, 0);
    for (let a = 1, l = 0; a !== t; ++a) ((l += e), i[a].toArray(r, l));
  }
  return r;
}
function ge(i, t) {
  if (i.length !== t.length) return !1;
  for (let e = 0, n = i.length; e < n; e++) if (i[e] !== t[e]) return !1;
  return !0;
}
function ve(i, t) {
  for (let e = 0, n = t.length; e < n; e++) i[e] = t[e];
}
function Ws(i, t) {
  let e = Co[t];
  e === void 0 && ((e = new Int32Array(t)), (Co[t] = e));
  for (let n = 0; n !== t; ++n) e[n] = i.allocateTextureUnit();
  return e;
}
function vf(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1f(this.addr, t), (e[0] = t));
}
function _f(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) &&
      (i.uniform2f(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y));
  else {
    if (ge(e, t)) return;
    (i.uniform2fv(this.addr, t), ve(e, t));
  }
}
function xf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
      (i.uniform3f(this.addr, t.x, t.y, t.z),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z));
  else if (t.r !== void 0)
    (e[0] !== t.r || e[1] !== t.g || e[2] !== t.b) &&
      (i.uniform3f(this.addr, t.r, t.g, t.b),
      (e[0] = t.r),
      (e[1] = t.g),
      (e[2] = t.b));
  else {
    if (ge(e, t)) return;
    (i.uniform3fv(this.addr, t), ve(e, t));
  }
}
function Mf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
      (i.uniform4f(this.addr, t.x, t.y, t.z, t.w),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z),
      (e[3] = t.w));
  else {
    if (ge(e, t)) return;
    (i.uniform4fv(this.addr, t), ve(e, t));
  }
}
function yf(i, t) {
  const e = this.cache,
    n = t.elements;
  if (n === void 0) {
    if (ge(e, t)) return;
    (i.uniformMatrix2fv(this.addr, !1, t), ve(e, t));
  } else {
    if (ge(e, n)) return;
    (Do.set(n), i.uniformMatrix2fv(this.addr, !1, Do), ve(e, n));
  }
}
function Sf(i, t) {
  const e = this.cache,
    n = t.elements;
  if (n === void 0) {
    if (ge(e, t)) return;
    (i.uniformMatrix3fv(this.addr, !1, t), ve(e, t));
  } else {
    if (ge(e, n)) return;
    (Lo.set(n), i.uniformMatrix3fv(this.addr, !1, Lo), ve(e, n));
  }
}
function Ef(i, t) {
  const e = this.cache,
    n = t.elements;
  if (n === void 0) {
    if (ge(e, t)) return;
    (i.uniformMatrix4fv(this.addr, !1, t), ve(e, t));
  } else {
    if (ge(e, n)) return;
    (Po.set(n), i.uniformMatrix4fv(this.addr, !1, Po), ve(e, n));
  }
}
function wf(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1i(this.addr, t), (e[0] = t));
}
function Tf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) &&
      (i.uniform2i(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y));
  else {
    if (ge(e, t)) return;
    (i.uniform2iv(this.addr, t), ve(e, t));
  }
}
function bf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
      (i.uniform3i(this.addr, t.x, t.y, t.z),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z));
  else {
    if (ge(e, t)) return;
    (i.uniform3iv(this.addr, t), ve(e, t));
  }
}
function Af(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
      (i.uniform4i(this.addr, t.x, t.y, t.z, t.w),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z),
      (e[3] = t.w));
  else {
    if (ge(e, t)) return;
    (i.uniform4iv(this.addr, t), ve(e, t));
  }
}
function Rf(i, t) {
  const e = this.cache;
  e[0] !== t && (i.uniform1ui(this.addr, t), (e[0] = t));
}
function Cf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y) &&
      (i.uniform2ui(this.addr, t.x, t.y), (e[0] = t.x), (e[1] = t.y));
  else {
    if (ge(e, t)) return;
    (i.uniform2uiv(this.addr, t), ve(e, t));
  }
}
function Pf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z) &&
      (i.uniform3ui(this.addr, t.x, t.y, t.z),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z));
  else {
    if (ge(e, t)) return;
    (i.uniform3uiv(this.addr, t), ve(e, t));
  }
}
function Lf(i, t) {
  const e = this.cache;
  if (t.x !== void 0)
    (e[0] !== t.x || e[1] !== t.y || e[2] !== t.z || e[3] !== t.w) &&
      (i.uniform4ui(this.addr, t.x, t.y, t.z, t.w),
      (e[0] = t.x),
      (e[1] = t.y),
      (e[2] = t.z),
      (e[3] = t.w));
  else {
    if (ge(e, t)) return;
    (i.uniform4uiv(this.addr, t), ve(e, t));
  }
}
function Df(i, t, e) {
  const n = this.cache,
    s = e.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s));
  let r;
  (this.type === i.SAMPLER_2D_SHADOW
    ? ((Ao.compareFunction = Ml), (r = Ao))
    : (r = Ul),
    e.setTexture2D(t || r, s));
}
function Uf(i, t, e) {
  const n = this.cache,
    s = e.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
    e.setTexture3D(t || Nl, s));
}
function If(i, t, e) {
  const n = this.cache,
    s = e.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
    e.setTextureCube(t || Fl, s));
}
function Nf(i, t, e) {
  const n = this.cache,
    s = e.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
    e.setTexture2DArray(t || Il, s));
}
function Ff(i) {
  switch (i) {
    case 5126:
      return vf;
    case 35664:
      return _f;
    case 35665:
      return xf;
    case 35666:
      return Mf;
    case 35674:
      return yf;
    case 35675:
      return Sf;
    case 35676:
      return Ef;
    case 5124:
    case 35670:
      return wf;
    case 35667:
    case 35671:
      return Tf;
    case 35668:
    case 35672:
      return bf;
    case 35669:
    case 35673:
      return Af;
    case 5125:
      return Rf;
    case 36294:
      return Cf;
    case 36295:
      return Pf;
    case 36296:
      return Lf;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Df;
    case 35679:
    case 36299:
    case 36307:
      return Uf;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return If;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return Nf;
  }
}
function zf(i, t) {
  i.uniform1fv(this.addr, t);
}
function Of(i, t) {
  const e = Fi(t, this.size, 2);
  i.uniform2fv(this.addr, e);
}
function Bf(i, t) {
  const e = Fi(t, this.size, 3);
  i.uniform3fv(this.addr, e);
}
function kf(i, t) {
  const e = Fi(t, this.size, 4);
  i.uniform4fv(this.addr, e);
}
function Hf(i, t) {
  const e = Fi(t, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, e);
}
function Vf(i, t) {
  const e = Fi(t, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, e);
}
function Gf(i, t) {
  const e = Fi(t, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, e);
}
function Wf(i, t) {
  i.uniform1iv(this.addr, t);
}
function qf(i, t) {
  i.uniform2iv(this.addr, t);
}
function Xf(i, t) {
  i.uniform3iv(this.addr, t);
}
function Yf(i, t) {
  i.uniform4iv(this.addr, t);
}
function jf(i, t) {
  i.uniform1uiv(this.addr, t);
}
function Kf(i, t) {
  i.uniform2uiv(this.addr, t);
}
function $f(i, t) {
  i.uniform3uiv(this.addr, t);
}
function Zf(i, t) {
  i.uniform4uiv(this.addr, t);
}
function Jf(i, t, e) {
  const n = this.cache,
    s = t.length,
    r = Ws(e, s);
  ge(n, r) || (i.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== s; ++a) e.setTexture2D(t[a] || Ul, r[a]);
}
function Qf(i, t, e) {
  const n = this.cache,
    s = t.length,
    r = Ws(e, s);
  ge(n, r) || (i.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== s; ++a) e.setTexture3D(t[a] || Nl, r[a]);
}
function tp(i, t, e) {
  const n = this.cache,
    s = t.length,
    r = Ws(e, s);
  ge(n, r) || (i.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== s; ++a) e.setTextureCube(t[a] || Fl, r[a]);
}
function ep(i, t, e) {
  const n = this.cache,
    s = t.length,
    r = Ws(e, s);
  ge(n, r) || (i.uniform1iv(this.addr, r), ve(n, r));
  for (let a = 0; a !== s; ++a) e.setTexture2DArray(t[a] || Il, r[a]);
}
function np(i) {
  switch (i) {
    case 5126:
      return zf;
    case 35664:
      return Of;
    case 35665:
      return Bf;
    case 35666:
      return kf;
    case 35674:
      return Hf;
    case 35675:
      return Vf;
    case 35676:
      return Gf;
    case 5124:
    case 35670:
      return Wf;
    case 35667:
    case 35671:
      return qf;
    case 35668:
    case 35672:
      return Xf;
    case 35669:
    case 35673:
      return Yf;
    case 5125:
      return jf;
    case 36294:
      return Kf;
    case 36295:
      return $f;
    case 36296:
      return Zf;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Jf;
    case 35679:
    case 36299:
    case 36307:
      return Qf;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return tp;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return ep;
  }
}
class ip {
  constructor(t, e, n) {
    ((this.id = t),
      (this.addr = n),
      (this.cache = []),
      (this.type = e.type),
      (this.setValue = Ff(e.type)));
  }
}
class sp {
  constructor(t, e, n) {
    ((this.id = t),
      (this.addr = n),
      (this.cache = []),
      (this.type = e.type),
      (this.size = e.size),
      (this.setValue = np(e.type)));
  }
}
class rp {
  constructor(t) {
    ((this.id = t), (this.seq = []), (this.map = {}));
  }
  setValue(t, e, n) {
    const s = this.seq;
    for (let r = 0, a = s.length; r !== a; ++r) {
      const l = s[r];
      l.setValue(t, e[l.id], n);
    }
  }
}
const Mr = /(\w+)(\])?(\[|\.)?/g;
function Uo(i, t) {
  (i.seq.push(t), (i.map[t.id] = t));
}
function ap(i, t, e) {
  const n = i.name,
    s = n.length;
  for (Mr.lastIndex = 0; ;) {
    const r = Mr.exec(n),
      a = Mr.lastIndex;
    let l = r[1];
    const o = r[2] === "]",
      c = r[3];
    if ((o && (l = l | 0), c === void 0 || (c === "[" && a + 2 === s))) {
      Uo(e, c === void 0 ? new ip(l, i, t) : new sp(l, i, t));
      break;
    } else {
      let d = e.map[l];
      (d === void 0 && ((d = new rp(l)), Uo(e, d)), (e = d));
    }
  }
}
class Fs {
  constructor(t, e) {
    ((this.seq = []), (this.map = {}));
    const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
    for (let s = 0; s < n; ++s) {
      const r = t.getActiveUniform(e, s),
        a = t.getUniformLocation(e, r.name);
      ap(r, a, this);
    }
  }
  setValue(t, e, n, s) {
    const r = this.map[e];
    r !== void 0 && r.setValue(t, n, s);
  }
  setOptional(t, e, n) {
    const s = e[n];
    s !== void 0 && this.setValue(t, n, s);
  }
  static upload(t, e, n, s) {
    for (let r = 0, a = e.length; r !== a; ++r) {
      const l = e[r],
        o = n[l.id];
      o.needsUpdate !== !1 && l.setValue(t, o.value, s);
    }
  }
  static seqWithValue(t, e) {
    const n = [];
    for (let s = 0, r = t.length; s !== r; ++s) {
      const a = t[s];
      a.id in e && n.push(a);
    }
    return n;
  }
}
function Io(i, t, e) {
  const n = i.createShader(t);
  return (i.shaderSource(n, e), i.compileShader(n), n);
}
const op = 37297;
let lp = 0;
function cp(i, t) {
  const e = i.split(`
`),
    n = [],
    s = Math.max(t - 6, 0),
    r = Math.min(t + 6, e.length);
  for (let a = s; a < r; a++) {
    const l = a + 1;
    n.push(`${l === t ? ">" : " "} ${l}: ${e[a]}`);
  }
  return n.join(`
`);
}
const No = new zt();
function hp(i) {
  Xt._getMatrix(No, Xt.workingColorSpace, i);
  const t = `mat3( ${No.elements.map((e) => e.toFixed(4))} )`;
  switch (Xt.getTransfer(i)) {
    case Gs:
      return [t, "LinearTransferOETF"];
    case Qt:
      return [t, "sRGBTransferOETF"];
    default:
      return (
        console.warn("THREE.WebGLProgram: Unsupported color space: ", i),
        [t, "LinearTransferOETF"]
      );
  }
}
function Fo(i, t, e) {
  const n = i.getShaderParameter(t, i.COMPILE_STATUS),
    s = i.getShaderInfoLog(t).trim();
  if (n && s === "") return "";
  const r = /ERROR: 0:(\d+)/.exec(s);
  if (r) {
    const a = parseInt(r[1]);
    return (
      e.toUpperCase() +
      `

` +
      s +
      `

` +
      cp(i.getShaderSource(t), a)
    );
  } else return s;
}
function up(i, t) {
  const e = hp(t);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,
    "}",
  ].join(`
`);
}
function dp(i, t) {
  let e;
  switch (t) {
    case fc:
      e = "Linear";
      break;
    case pc:
      e = "Reinhard";
      break;
    case mc:
      e = "Cineon";
      break;
    case gc:
      e = "ACESFilmic";
      break;
    case _c:
      e = "AgX";
      break;
    case xc:
      e = "Neutral";
      break;
    case vc:
      e = "Custom";
      break;
    default:
      (console.warn("THREE.WebGLProgram: Unsupported toneMapping:", t),
        (e = "Linear"));
  }
  return (
    "vec3 " + i + "( vec3 color ) { return " + e + "ToneMapping( color ); }"
  );
}
const Ts = new b();
function fp() {
  Xt.getLuminanceCoefficients(Ts);
  const i = Ts.x.toFixed(4),
    t = Ts.y.toFixed(4),
    e = Ts.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,
    "	return dot( weights, rgb );",
    "}",
  ].join(`
`);
}
function pp(i) {
  return [
    i.extensionClipCullDistance
      ? "#extension GL_ANGLE_clip_cull_distance : require"
      : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : "",
  ].filter(ji).join(`
`);
}
function mp(i) {
  const t = [];
  for (const e in i) {
    const n = i[e];
    n !== !1 && t.push("#define " + e + " " + n);
  }
  return t.join(`
`);
}
function gp(i, t) {
  const e = {},
    n = i.getProgramParameter(t, i.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < n; s++) {
    const r = i.getActiveAttrib(t, s),
      a = r.name;
    let l = 1;
    (r.type === i.FLOAT_MAT2 && (l = 2),
      r.type === i.FLOAT_MAT3 && (l = 3),
      r.type === i.FLOAT_MAT4 && (l = 4),
      (e[a] = {
        type: r.type,
        location: i.getAttribLocation(t, a),
        locationSize: l,
      }));
  }
  return e;
}
function ji(i) {
  return i !== "";
}
function zo(i, t) {
  const e =
    t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
  return i
    .replace(/NUM_DIR_LIGHTS/g, t.numDirLights)
    .replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights)
    .replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps)
    .replace(/NUM_SPOT_LIGHT_COORDS/g, e)
    .replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights)
    .replace(/NUM_POINT_LIGHTS/g, t.numPointLights)
    .replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights)
    .replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows)
    .replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps)
    .replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows)
    .replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function Oo(i, t) {
  return i
    .replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes)
    .replace(
      /UNION_CLIPPING_PLANES/g,
      t.numClippingPlanes - t.numClipIntersection,
    );
}
const vp = /^[ \t]*#include +<([\w\d./]+)>/gm;
function va(i) {
  return i.replace(vp, xp);
}
const _p = new Map();
function xp(i, t) {
  let e = Bt[t];
  if (e === void 0) {
    const n = _p.get(t);
    if (n !== void 0)
      ((e = Bt[n]),
        console.warn(
          'THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',
          t,
          n,
        ));
    else throw new Error("Can not resolve #include <" + t + ">");
  }
  return va(e);
}
const Mp =
  /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Bo(i) {
  return i.replace(Mp, yp);
}
function yp(i, t, e, n) {
  let s = "";
  for (let r = parseInt(t); r < parseInt(e); r++)
    s += n
      .replace(/\[\s*i\s*\]/g, "[ " + r + " ]")
      .replace(/UNROLLED_LOOP_INDEX/g, r);
  return s;
}
function ko(i) {
  let t = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return (
    i.precision === "highp"
      ? (t += `
#define HIGH_PRECISION`)
      : i.precision === "mediump"
        ? (t += `
#define MEDIUM_PRECISION`)
        : i.precision === "lowp" &&
          (t += `
#define LOW_PRECISION`),
    t
  );
}
function Sp(i) {
  let t = "SHADOWMAP_TYPE_BASIC";
  return (
    i.shadowMapType === sl
      ? (t = "SHADOWMAP_TYPE_PCF")
      : i.shadowMapType === rl
        ? (t = "SHADOWMAP_TYPE_PCF_SOFT")
        : i.shadowMapType === mn && (t = "SHADOWMAP_TYPE_VSM"),
    t
  );
}
function Ep(i) {
  let t = "ENVMAP_TYPE_CUBE";
  if (i.envMap)
    switch (i.envMapMode) {
      case Ai:
      case Ri:
        t = "ENVMAP_TYPE_CUBE";
        break;
      case Vs:
        t = "ENVMAP_TYPE_CUBE_UV";
        break;
    }
  return t;
}
function wp(i) {
  let t = "ENVMAP_MODE_REFLECTION";
  if (i.envMap)
    switch (i.envMapMode) {
      case Ri:
        t = "ENVMAP_MODE_REFRACTION";
        break;
    }
  return t;
}
function Tp(i) {
  let t = "ENVMAP_BLENDING_NONE";
  if (i.envMap)
    switch (i.combine) {
      case ol:
        t = "ENVMAP_BLENDING_MULTIPLY";
        break;
      case uc:
        t = "ENVMAP_BLENDING_MIX";
        break;
      case dc:
        t = "ENVMAP_BLENDING_ADD";
        break;
    }
  return t;
}
function bp(i) {
  const t = i.envMapCubeUVHeight;
  if (t === null) return null;
  const e = Math.log2(t) - 2,
    n = 1 / t;
  return {
    texelWidth: 1 / (3 * Math.max(Math.pow(2, e), 7 * 16)),
    texelHeight: n,
    maxMip: e,
  };
}
function Ap(i, t, e, n) {
  const s = i.getContext(),
    r = e.defines;
  let a = e.vertexShader,
    l = e.fragmentShader;
  const o = Sp(e),
    c = Ep(e),
    h = wp(e),
    d = Tp(e),
    u = bp(e),
    m = pp(e),
    g = mp(r),
    v = s.createProgram();
  let p,
    f,
    w = e.glslVersion
      ? "#version " +
        e.glslVersion +
        `
`
      : "";
  (e.isRawShaderMaterial
    ? ((p = [
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        g,
      ].filter(ji).join(`
`)),
      p.length > 0 &&
        (p += `
`),
      (f = [
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        g,
      ].filter(ji).join(`
`)),
      f.length > 0 &&
        (f += `
`))
    : ((p = [
        ko(e),
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        g,
        e.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
        e.batching ? "#define USE_BATCHING" : "",
        e.batchingColor ? "#define USE_BATCHING_COLOR" : "",
        e.instancing ? "#define USE_INSTANCING" : "",
        e.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
        e.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
        e.useFog && e.fog ? "#define USE_FOG" : "",
        e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
        e.map ? "#define USE_MAP" : "",
        e.envMap ? "#define USE_ENVMAP" : "",
        e.envMap ? "#define " + h : "",
        e.lightMap ? "#define USE_LIGHTMAP" : "",
        e.aoMap ? "#define USE_AOMAP" : "",
        e.bumpMap ? "#define USE_BUMPMAP" : "",
        e.normalMap ? "#define USE_NORMALMAP" : "",
        e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        e.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
        e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        e.anisotropy ? "#define USE_ANISOTROPY" : "",
        e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        e.specularMap ? "#define USE_SPECULARMAP" : "",
        e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        e.metalnessMap ? "#define USE_METALNESSMAP" : "",
        e.alphaMap ? "#define USE_ALPHAMAP" : "",
        e.alphaHash ? "#define USE_ALPHAHASH" : "",
        e.transmission ? "#define USE_TRANSMISSION" : "",
        e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        e.mapUv ? "#define MAP_UV " + e.mapUv : "",
        e.alphaMapUv ? "#define ALPHAMAP_UV " + e.alphaMapUv : "",
        e.lightMapUv ? "#define LIGHTMAP_UV " + e.lightMapUv : "",
        e.aoMapUv ? "#define AOMAP_UV " + e.aoMapUv : "",
        e.emissiveMapUv ? "#define EMISSIVEMAP_UV " + e.emissiveMapUv : "",
        e.bumpMapUv ? "#define BUMPMAP_UV " + e.bumpMapUv : "",
        e.normalMapUv ? "#define NORMALMAP_UV " + e.normalMapUv : "",
        e.displacementMapUv
          ? "#define DISPLACEMENTMAP_UV " + e.displacementMapUv
          : "",
        e.metalnessMapUv ? "#define METALNESSMAP_UV " + e.metalnessMapUv : "",
        e.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + e.roughnessMapUv : "",
        e.anisotropyMapUv
          ? "#define ANISOTROPYMAP_UV " + e.anisotropyMapUv
          : "",
        e.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + e.clearcoatMapUv : "",
        e.clearcoatNormalMapUv
          ? "#define CLEARCOAT_NORMALMAP_UV " + e.clearcoatNormalMapUv
          : "",
        e.clearcoatRoughnessMapUv
          ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + e.clearcoatRoughnessMapUv
          : "",
        e.iridescenceMapUv
          ? "#define IRIDESCENCEMAP_UV " + e.iridescenceMapUv
          : "",
        e.iridescenceThicknessMapUv
          ? "#define IRIDESCENCE_THICKNESSMAP_UV " + e.iridescenceThicknessMapUv
          : "",
        e.sheenColorMapUv
          ? "#define SHEEN_COLORMAP_UV " + e.sheenColorMapUv
          : "",
        e.sheenRoughnessMapUv
          ? "#define SHEEN_ROUGHNESSMAP_UV " + e.sheenRoughnessMapUv
          : "",
        e.specularMapUv ? "#define SPECULARMAP_UV " + e.specularMapUv : "",
        e.specularColorMapUv
          ? "#define SPECULAR_COLORMAP_UV " + e.specularColorMapUv
          : "",
        e.specularIntensityMapUv
          ? "#define SPECULAR_INTENSITYMAP_UV " + e.specularIntensityMapUv
          : "",
        e.transmissionMapUv
          ? "#define TRANSMISSIONMAP_UV " + e.transmissionMapUv
          : "",
        e.thicknessMapUv ? "#define THICKNESSMAP_UV " + e.thicknessMapUv : "",
        e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
        e.vertexColors ? "#define USE_COLOR" : "",
        e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        e.vertexUv1s ? "#define USE_UV1" : "",
        e.vertexUv2s ? "#define USE_UV2" : "",
        e.vertexUv3s ? "#define USE_UV3" : "",
        e.pointsUvs ? "#define USE_POINTS_UV" : "",
        e.flatShading ? "#define FLAT_SHADED" : "",
        e.skinning ? "#define USE_SKINNING" : "",
        e.morphTargets ? "#define USE_MORPHTARGETS" : "",
        e.morphNormals && e.flatShading === !1
          ? "#define USE_MORPHNORMALS"
          : "",
        e.morphColors ? "#define USE_MORPHCOLORS" : "",
        e.morphTargetsCount > 0
          ? "#define MORPHTARGETS_TEXTURE_STRIDE " + e.morphTextureStride
          : "",
        e.morphTargetsCount > 0
          ? "#define MORPHTARGETS_COUNT " + e.morphTargetsCount
          : "",
        e.doubleSided ? "#define DOUBLE_SIDED" : "",
        e.flipSided ? "#define FLIP_SIDED" : "",
        e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        e.shadowMapEnabled ? "#define " + o : "",
        e.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
        e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
        "uniform mat4 modelMatrix;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform mat4 viewMatrix;",
        "uniform mat3 normalMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        "#ifdef USE_INSTANCING",
        "	attribute mat4 instanceMatrix;",
        "#endif",
        "#ifdef USE_INSTANCING_COLOR",
        "	attribute vec3 instanceColor;",
        "#endif",
        "#ifdef USE_INSTANCING_MORPH",
        "	uniform sampler2D morphTexture;",
        "#endif",
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "#ifdef USE_UV1",
        "	attribute vec2 uv1;",
        "#endif",
        "#ifdef USE_UV2",
        "	attribute vec2 uv2;",
        "#endif",
        "#ifdef USE_UV3",
        "	attribute vec2 uv3;",
        "#endif",
        "#ifdef USE_TANGENT",
        "	attribute vec4 tangent;",
        "#endif",
        "#if defined( USE_COLOR_ALPHA )",
        "	attribute vec4 color;",
        "#elif defined( USE_COLOR )",
        "	attribute vec3 color;",
        "#endif",
        "#ifdef USE_SKINNING",
        "	attribute vec4 skinIndex;",
        "	attribute vec4 skinWeight;",
        "#endif",
        `
`,
      ].filter(ji).join(`
`)),
      (f = [
        ko(e),
        "#define SHADER_TYPE " + e.shaderType,
        "#define SHADER_NAME " + e.shaderName,
        g,
        e.useFog && e.fog ? "#define USE_FOG" : "",
        e.useFog && e.fogExp2 ? "#define FOG_EXP2" : "",
        e.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
        e.map ? "#define USE_MAP" : "",
        e.matcap ? "#define USE_MATCAP" : "",
        e.envMap ? "#define USE_ENVMAP" : "",
        e.envMap ? "#define " + c : "",
        e.envMap ? "#define " + h : "",
        e.envMap ? "#define " + d : "",
        u ? "#define CUBEUV_TEXEL_WIDTH " + u.texelWidth : "",
        u ? "#define CUBEUV_TEXEL_HEIGHT " + u.texelHeight : "",
        u ? "#define CUBEUV_MAX_MIP " + u.maxMip + ".0" : "",
        e.lightMap ? "#define USE_LIGHTMAP" : "",
        e.aoMap ? "#define USE_AOMAP" : "",
        e.bumpMap ? "#define USE_BUMPMAP" : "",
        e.normalMap ? "#define USE_NORMALMAP" : "",
        e.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        e.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        e.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        e.anisotropy ? "#define USE_ANISOTROPY" : "",
        e.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        e.clearcoat ? "#define USE_CLEARCOAT" : "",
        e.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        e.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        e.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        e.dispersion ? "#define USE_DISPERSION" : "",
        e.iridescence ? "#define USE_IRIDESCENCE" : "",
        e.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        e.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        e.specularMap ? "#define USE_SPECULARMAP" : "",
        e.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        e.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        e.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        e.metalnessMap ? "#define USE_METALNESSMAP" : "",
        e.alphaMap ? "#define USE_ALPHAMAP" : "",
        e.alphaTest ? "#define USE_ALPHATEST" : "",
        e.alphaHash ? "#define USE_ALPHAHASH" : "",
        e.sheen ? "#define USE_SHEEN" : "",
        e.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        e.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        e.transmission ? "#define USE_TRANSMISSION" : "",
        e.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        e.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        e.vertexTangents && e.flatShading === !1 ? "#define USE_TANGENT" : "",
        e.vertexColors || e.instancingColor || e.batchingColor
          ? "#define USE_COLOR"
          : "",
        e.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        e.vertexUv1s ? "#define USE_UV1" : "",
        e.vertexUv2s ? "#define USE_UV2" : "",
        e.vertexUv3s ? "#define USE_UV3" : "",
        e.pointsUvs ? "#define USE_POINTS_UV" : "",
        e.gradientMap ? "#define USE_GRADIENTMAP" : "",
        e.flatShading ? "#define FLAT_SHADED" : "",
        e.doubleSided ? "#define DOUBLE_SIDED" : "",
        e.flipSided ? "#define FLIP_SIDED" : "",
        e.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        e.shadowMapEnabled ? "#define " + o : "",
        e.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
        e.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        e.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
        e.decodeVideoTextureEmissive
          ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE"
          : "",
        e.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "",
        e.reverseDepthBuffer ? "#define USE_REVERSEDEPTHBUF" : "",
        "uniform mat4 viewMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        e.toneMapping !== _n ? "#define TONE_MAPPING" : "",
        e.toneMapping !== _n ? Bt.tonemapping_pars_fragment : "",
        e.toneMapping !== _n ? dp("toneMapping", e.toneMapping) : "",
        e.dithering ? "#define DITHERING" : "",
        e.opaque ? "#define OPAQUE" : "",
        Bt.colorspace_pars_fragment,
        up("linearToOutputTexel", e.outputColorSpace),
        fp(),
        e.useDepthPacking ? "#define DEPTH_PACKING " + e.depthPacking : "",
        `
`,
      ].filter(ji).join(`
`))),
    (a = va(a)),
    (a = zo(a, e)),
    (a = Oo(a, e)),
    (l = va(l)),
    (l = zo(l, e)),
    (l = Oo(l, e)),
    (a = Bo(a)),
    (l = Bo(l)),
    e.isRawShaderMaterial !== !0 &&
      ((w = `#version 300 es
`),
      (p =
        [
          m,
          "#define attribute in",
          "#define varying out",
          "#define texture2D texture",
        ].join(`
`) +
        `
` +
        p),
      (f =
        [
          "#define varying in",
          e.glslVersion === Ja
            ? ""
            : "layout(location = 0) out highp vec4 pc_fragColor;",
          e.glslVersion === Ja ? "" : "#define gl_FragColor pc_fragColor",
          "#define gl_FragDepthEXT gl_FragDepth",
          "#define texture2D texture",
          "#define textureCube texture",
          "#define texture2DProj textureProj",
          "#define texture2DLodEXT textureLod",
          "#define texture2DProjLodEXT textureProjLod",
          "#define textureCubeLodEXT textureLod",
          "#define texture2DGradEXT textureGrad",
          "#define texture2DProjGradEXT textureProjGrad",
          "#define textureCubeGradEXT textureGrad",
        ].join(`
`) +
        `
` +
        f)));
  const M = w + p + a,
    _ = w + f + l,
    L = Io(s, s.VERTEX_SHADER, M),
    R = Io(s, s.FRAGMENT_SHADER, _);
  (s.attachShader(v, L),
    s.attachShader(v, R),
    e.index0AttributeName !== void 0
      ? s.bindAttribLocation(v, 0, e.index0AttributeName)
      : e.morphTargets === !0 && s.bindAttribLocation(v, 0, "position"),
    s.linkProgram(v));
  function A(P) {
    if (i.debug.checkShaderErrors) {
      const z = s.getProgramInfoLog(v).trim(),
        U = s.getShaderInfoLog(L).trim(),
        H = s.getShaderInfoLog(R).trim();
      let k = !0,
        G = !0;
      if (s.getProgramParameter(v, s.LINK_STATUS) === !1)
        if (((k = !1), typeof i.debug.onShaderError == "function"))
          i.debug.onShaderError(s, v, L, R);
        else {
          const q = Fo(s, L, "vertex"),
            O = Fo(s, R, "fragment");
          console.error(
            "THREE.WebGLProgram: Shader Error " +
              s.getError() +
              " - VALIDATE_STATUS " +
              s.getProgramParameter(v, s.VALIDATE_STATUS) +
              `

Material Name: ` +
              P.name +
              `
Material Type: ` +
              P.type +
              `

Program Info Log: ` +
              z +
              `
` +
              q +
              `
` +
              O,
          );
        }
      else
        z !== ""
          ? console.warn("THREE.WebGLProgram: Program Info Log:", z)
          : (U === "" || H === "") && (G = !1);
      G &&
        (P.diagnostics = {
          runnable: k,
          programLog: z,
          vertexShader: { log: U, prefix: p },
          fragmentShader: { log: H, prefix: f },
        });
    }
    (s.deleteShader(L), s.deleteShader(R), (C = new Fs(s, v)), (S = gp(s, v)));
  }
  let C;
  this.getUniforms = function () {
    return (C === void 0 && A(this), C);
  };
  let S;
  this.getAttributes = function () {
    return (S === void 0 && A(this), S);
  };
  let y = e.rendererExtensionParallelShaderCompile === !1;
  return (
    (this.isReady = function () {
      return (y === !1 && (y = s.getProgramParameter(v, op)), y);
    }),
    (this.destroy = function () {
      (n.releaseStatesOfProgram(this),
        s.deleteProgram(v),
        (this.program = void 0));
    }),
    (this.type = e.shaderType),
    (this.name = e.shaderName),
    (this.id = lp++),
    (this.cacheKey = t),
    (this.usedTimes = 1),
    (this.program = v),
    (this.vertexShader = L),
    (this.fragmentShader = R),
    this
  );
}
let Rp = 0;
class Cp {
  constructor() {
    ((this.shaderCache = new Map()), (this.materialCache = new Map()));
  }
  update(t) {
    const e = t.vertexShader,
      n = t.fragmentShader,
      s = this._getShaderStage(e),
      r = this._getShaderStage(n),
      a = this._getShaderCacheForMaterial(t);
    return (
      a.has(s) === !1 && (a.add(s), s.usedTimes++),
      a.has(r) === !1 && (a.add(r), r.usedTimes++),
      this
    );
  }
  remove(t) {
    const e = this.materialCache.get(t);
    for (const n of e)
      (n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code));
    return (this.materialCache.delete(t), this);
  }
  getVertexShaderID(t) {
    return this._getShaderStage(t.vertexShader).id;
  }
  getFragmentShaderID(t) {
    return this._getShaderStage(t.fragmentShader).id;
  }
  dispose() {
    (this.shaderCache.clear(), this.materialCache.clear());
  }
  _getShaderCacheForMaterial(t) {
    const e = this.materialCache;
    let n = e.get(t);
    return (n === void 0 && ((n = new Set()), e.set(t, n)), n);
  }
  _getShaderStage(t) {
    const e = this.shaderCache;
    let n = e.get(t);
    return (n === void 0 && ((n = new Pp(t)), e.set(t, n)), n);
  }
}
class Pp {
  constructor(t) {
    ((this.id = Rp++), (this.code = t), (this.usedTimes = 0));
  }
}
function Lp(i, t, e, n, s, r, a) {
  const l = new wl(),
    o = new Cp(),
    c = new Set(),
    h = [],
    d = s.logarithmicDepthBuffer,
    u = s.vertexTextures;
  let m = s.precision;
  const g = {
    MeshDepthMaterial: "depth",
    MeshDistanceMaterial: "distanceRGBA",
    MeshNormalMaterial: "normal",
    MeshBasicMaterial: "basic",
    MeshLambertMaterial: "lambert",
    MeshPhongMaterial: "phong",
    MeshToonMaterial: "toon",
    MeshStandardMaterial: "physical",
    MeshPhysicalMaterial: "physical",
    MeshMatcapMaterial: "matcap",
    LineBasicMaterial: "basic",
    LineDashedMaterial: "dashed",
    PointsMaterial: "points",
    ShadowMaterial: "shadow",
    SpriteMaterial: "sprite",
  };
  function v(S) {
    return (c.add(S), S === 0 ? "uv" : `uv${S}`);
  }
  function p(S, y, P, z, U) {
    const H = z.fog,
      k = U.geometry,
      G = S.isMeshStandardMaterial ? z.environment : null,
      q = (S.isMeshStandardMaterial ? e : t).get(S.envMap || G),
      O = q && q.mapping === Vs ? q.image.height : null,
      et = g[S.type];
    S.precision !== null &&
      ((m = s.getMaxPrecision(S.precision)),
      m !== S.precision &&
        console.warn(
          "THREE.WebGLProgram.getParameters:",
          S.precision,
          "not supported, using",
          m,
          "instead.",
        ));
    const K =
        k.morphAttributes.position ||
        k.morphAttributes.normal ||
        k.morphAttributes.color,
      nt = K !== void 0 ? K.length : 0;
    let _t = 0;
    (k.morphAttributes.position !== void 0 && (_t = 1),
      k.morphAttributes.normal !== void 0 && (_t = 2),
      k.morphAttributes.color !== void 0 && (_t = 3));
    let Lt, Y, it, vt;
    if (et) {
      const Jt = sn[et];
      ((Lt = Jt.vertexShader), (Y = Jt.fragmentShader));
    } else
      ((Lt = S.vertexShader),
        (Y = S.fragmentShader),
        o.update(S),
        (it = o.getVertexShaderID(S)),
        (vt = o.getFragmentShaderID(S)));
    const ct = i.getRenderTarget(),
      At = i.state.buffers.depth.getReversed(),
      Dt = U.isInstancedMesh === !0,
      kt = U.isBatchedMesh === !0,
      ce = !!S.map,
      Wt = !!S.matcap,
      de = !!q,
      F = !!S.aoMap,
      Ve = !!S.lightMap,
      Ht = !!S.bumpMap,
      Vt = !!S.normalMap,
      Tt = !!S.displacementMap,
      re = !!S.emissiveMap,
      wt = !!S.metalnessMap,
      T = !!S.roughnessMap,
      x = S.anisotropy > 0,
      B = S.clearcoat > 0,
      $ = S.dispersion > 0,
      Q = S.iridescence > 0,
      j = S.sheen > 0,
      St = S.transmission > 0,
      ht = x && !!S.anisotropyMap,
      pt = B && !!S.clearcoatMap,
      qt = B && !!S.clearcoatNormalMap,
      st = B && !!S.clearcoatRoughnessMap,
      mt = Q && !!S.iridescenceMap,
      bt = Q && !!S.iridescenceThicknessMap,
      Rt = j && !!S.sheenColorMap,
      gt = j && !!S.sheenRoughnessMap,
      Gt = !!S.specularMap,
      Ot = !!S.specularColorMap,
      ie = !!S.specularIntensityMap,
      D = St && !!S.transmissionMap,
      lt = St && !!S.thicknessMap,
      X = !!S.gradientMap,
      Z = !!S.alphaMap,
      ft = S.alphaTest > 0,
      ut = !!S.alphaHash,
      Nt = !!S.extensions;
    let ue = _n;
    S.toneMapped &&
      (ct === null || ct.isXRRenderTarget === !0) &&
      (ue = i.toneMapping);
    const Me = {
      shaderID: et,
      shaderType: S.type,
      shaderName: S.name,
      vertexShader: Lt,
      fragmentShader: Y,
      defines: S.defines,
      customVertexShaderID: it,
      customFragmentShaderID: vt,
      isRawShaderMaterial: S.isRawShaderMaterial === !0,
      glslVersion: S.glslVersion,
      precision: m,
      batching: kt,
      batchingColor: kt && U._colorsTexture !== null,
      instancing: Dt,
      instancingColor: Dt && U.instanceColor !== null,
      instancingMorph: Dt && U.morphTexture !== null,
      supportsVertexTextures: u,
      outputColorSpace:
        ct === null
          ? i.outputColorSpace
          : ct.isXRRenderTarget === !0
            ? ct.texture.colorSpace
            : Ui,
      alphaToCoverage: !!S.alphaToCoverage,
      map: ce,
      matcap: Wt,
      envMap: de,
      envMapMode: de && q.mapping,
      envMapCubeUVHeight: O,
      aoMap: F,
      lightMap: Ve,
      bumpMap: Ht,
      normalMap: Vt,
      displacementMap: u && Tt,
      emissiveMap: re,
      normalMapObjectSpace: Vt && S.normalMapType === Sc,
      normalMapTangentSpace: Vt && S.normalMapType === xl,
      metalnessMap: wt,
      roughnessMap: T,
      anisotropy: x,
      anisotropyMap: ht,
      clearcoat: B,
      clearcoatMap: pt,
      clearcoatNormalMap: qt,
      clearcoatRoughnessMap: st,
      dispersion: $,
      iridescence: Q,
      iridescenceMap: mt,
      iridescenceThicknessMap: bt,
      sheen: j,
      sheenColorMap: Rt,
      sheenRoughnessMap: gt,
      specularMap: Gt,
      specularColorMap: Ot,
      specularIntensityMap: ie,
      transmission: St,
      transmissionMap: D,
      thicknessMap: lt,
      gradientMap: X,
      opaque:
        S.transparent === !1 && S.blending === $n && S.alphaToCoverage === !1,
      alphaMap: Z,
      alphaTest: ft,
      alphaHash: ut,
      combine: S.combine,
      mapUv: ce && v(S.map.channel),
      aoMapUv: F && v(S.aoMap.channel),
      lightMapUv: Ve && v(S.lightMap.channel),
      bumpMapUv: Ht && v(S.bumpMap.channel),
      normalMapUv: Vt && v(S.normalMap.channel),
      displacementMapUv: Tt && v(S.displacementMap.channel),
      emissiveMapUv: re && v(S.emissiveMap.channel),
      metalnessMapUv: wt && v(S.metalnessMap.channel),
      roughnessMapUv: T && v(S.roughnessMap.channel),
      anisotropyMapUv: ht && v(S.anisotropyMap.channel),
      clearcoatMapUv: pt && v(S.clearcoatMap.channel),
      clearcoatNormalMapUv: qt && v(S.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: st && v(S.clearcoatRoughnessMap.channel),
      iridescenceMapUv: mt && v(S.iridescenceMap.channel),
      iridescenceThicknessMapUv: bt && v(S.iridescenceThicknessMap.channel),
      sheenColorMapUv: Rt && v(S.sheenColorMap.channel),
      sheenRoughnessMapUv: gt && v(S.sheenRoughnessMap.channel),
      specularMapUv: Gt && v(S.specularMap.channel),
      specularColorMapUv: Ot && v(S.specularColorMap.channel),
      specularIntensityMapUv: ie && v(S.specularIntensityMap.channel),
      transmissionMapUv: D && v(S.transmissionMap.channel),
      thicknessMapUv: lt && v(S.thicknessMap.channel),
      alphaMapUv: Z && v(S.alphaMap.channel),
      vertexTangents: !!k.attributes.tangent && (Vt || x),
      vertexColors: S.vertexColors,
      vertexAlphas:
        S.vertexColors === !0 &&
        !!k.attributes.color &&
        k.attributes.color.itemSize === 4,
      pointsUvs: U.isPoints === !0 && !!k.attributes.uv && (ce || Z),
      fog: !!H,
      useFog: S.fog === !0,
      fogExp2: !!H && H.isFogExp2,
      flatShading: S.flatShading === !0,
      sizeAttenuation: S.sizeAttenuation === !0,
      logarithmicDepthBuffer: d,
      reverseDepthBuffer: At,
      skinning: U.isSkinnedMesh === !0,
      morphTargets: k.morphAttributes.position !== void 0,
      morphNormals: k.morphAttributes.normal !== void 0,
      morphColors: k.morphAttributes.color !== void 0,
      morphTargetsCount: nt,
      morphTextureStride: _t,
      numDirLights: y.directional.length,
      numPointLights: y.point.length,
      numSpotLights: y.spot.length,
      numSpotLightMaps: y.spotLightMap.length,
      numRectAreaLights: y.rectArea.length,
      numHemiLights: y.hemi.length,
      numDirLightShadows: y.directionalShadowMap.length,
      numPointLightShadows: y.pointShadowMap.length,
      numSpotLightShadows: y.spotShadowMap.length,
      numSpotLightShadowsWithMaps: y.numSpotLightShadowsWithMaps,
      numLightProbes: y.numLightProbes,
      numClippingPlanes: a.numPlanes,
      numClipIntersection: a.numIntersection,
      dithering: S.dithering,
      shadowMapEnabled: i.shadowMap.enabled && P.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: ue,
      decodeVideoTexture:
        ce &&
        S.map.isVideoTexture === !0 &&
        Xt.getTransfer(S.map.colorSpace) === Qt,
      decodeVideoTextureEmissive:
        re &&
        S.emissiveMap.isVideoTexture === !0 &&
        Xt.getTransfer(S.emissiveMap.colorSpace) === Qt,
      premultipliedAlpha: S.premultipliedAlpha,
      doubleSided: S.side === Ie,
      flipSided: S.side === Ce,
      useDepthPacking: S.depthPacking >= 0,
      depthPacking: S.depthPacking || 0,
      index0AttributeName: S.index0AttributeName,
      extensionClipCullDistance:
        Nt &&
        S.extensions.clipCullDistance === !0 &&
        n.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw:
        ((Nt && S.extensions.multiDraw === !0) || kt) &&
        n.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: n.has(
        "KHR_parallel_shader_compile",
      ),
      customProgramCacheKey: S.customProgramCacheKey(),
    };
    return (
      (Me.vertexUv1s = c.has(1)),
      (Me.vertexUv2s = c.has(2)),
      (Me.vertexUv3s = c.has(3)),
      c.clear(),
      Me
    );
  }
  function f(S) {
    const y = [];
    if (
      (S.shaderID
        ? y.push(S.shaderID)
        : (y.push(S.customVertexShaderID), y.push(S.customFragmentShaderID)),
      S.defines !== void 0)
    )
      for (const P in S.defines) (y.push(P), y.push(S.defines[P]));
    return (
      S.isRawShaderMaterial === !1 &&
        (w(y, S), M(y, S), y.push(i.outputColorSpace)),
      y.push(S.customProgramCacheKey),
      y.join()
    );
  }
  function w(S, y) {
    (S.push(y.precision),
      S.push(y.outputColorSpace),
      S.push(y.envMapMode),
      S.push(y.envMapCubeUVHeight),
      S.push(y.mapUv),
      S.push(y.alphaMapUv),
      S.push(y.lightMapUv),
      S.push(y.aoMapUv),
      S.push(y.bumpMapUv),
      S.push(y.normalMapUv),
      S.push(y.displacementMapUv),
      S.push(y.emissiveMapUv),
      S.push(y.metalnessMapUv),
      S.push(y.roughnessMapUv),
      S.push(y.anisotropyMapUv),
      S.push(y.clearcoatMapUv),
      S.push(y.clearcoatNormalMapUv),
      S.push(y.clearcoatRoughnessMapUv),
      S.push(y.iridescenceMapUv),
      S.push(y.iridescenceThicknessMapUv),
      S.push(y.sheenColorMapUv),
      S.push(y.sheenRoughnessMapUv),
      S.push(y.specularMapUv),
      S.push(y.specularColorMapUv),
      S.push(y.specularIntensityMapUv),
      S.push(y.transmissionMapUv),
      S.push(y.thicknessMapUv),
      S.push(y.combine),
      S.push(y.fogExp2),
      S.push(y.sizeAttenuation),
      S.push(y.morphTargetsCount),
      S.push(y.morphAttributeCount),
      S.push(y.numDirLights),
      S.push(y.numPointLights),
      S.push(y.numSpotLights),
      S.push(y.numSpotLightMaps),
      S.push(y.numHemiLights),
      S.push(y.numRectAreaLights),
      S.push(y.numDirLightShadows),
      S.push(y.numPointLightShadows),
      S.push(y.numSpotLightShadows),
      S.push(y.numSpotLightShadowsWithMaps),
      S.push(y.numLightProbes),
      S.push(y.shadowMapType),
      S.push(y.toneMapping),
      S.push(y.numClippingPlanes),
      S.push(y.numClipIntersection),
      S.push(y.depthPacking));
  }
  function M(S, y) {
    (l.disableAll(),
      y.supportsVertexTextures && l.enable(0),
      y.instancing && l.enable(1),
      y.instancingColor && l.enable(2),
      y.instancingMorph && l.enable(3),
      y.matcap && l.enable(4),
      y.envMap && l.enable(5),
      y.normalMapObjectSpace && l.enable(6),
      y.normalMapTangentSpace && l.enable(7),
      y.clearcoat && l.enable(8),
      y.iridescence && l.enable(9),
      y.alphaTest && l.enable(10),
      y.vertexColors && l.enable(11),
      y.vertexAlphas && l.enable(12),
      y.vertexUv1s && l.enable(13),
      y.vertexUv2s && l.enable(14),
      y.vertexUv3s && l.enable(15),
      y.vertexTangents && l.enable(16),
      y.anisotropy && l.enable(17),
      y.alphaHash && l.enable(18),
      y.batching && l.enable(19),
      y.dispersion && l.enable(20),
      y.batchingColor && l.enable(21),
      S.push(l.mask),
      l.disableAll(),
      y.fog && l.enable(0),
      y.useFog && l.enable(1),
      y.flatShading && l.enable(2),
      y.logarithmicDepthBuffer && l.enable(3),
      y.reverseDepthBuffer && l.enable(4),
      y.skinning && l.enable(5),
      y.morphTargets && l.enable(6),
      y.morphNormals && l.enable(7),
      y.morphColors && l.enable(8),
      y.premultipliedAlpha && l.enable(9),
      y.shadowMapEnabled && l.enable(10),
      y.doubleSided && l.enable(11),
      y.flipSided && l.enable(12),
      y.useDepthPacking && l.enable(13),
      y.dithering && l.enable(14),
      y.transmission && l.enable(15),
      y.sheen && l.enable(16),
      y.opaque && l.enable(17),
      y.pointsUvs && l.enable(18),
      y.decodeVideoTexture && l.enable(19),
      y.decodeVideoTextureEmissive && l.enable(20),
      y.alphaToCoverage && l.enable(21),
      S.push(l.mask));
  }
  function _(S) {
    const y = g[S.type];
    let P;
    if (y) {
      const z = sn[y];
      P = fh.clone(z.uniforms);
    } else P = S.uniforms;
    return P;
  }
  function L(S, y) {
    let P;
    for (let z = 0, U = h.length; z < U; z++) {
      const H = h[z];
      if (H.cacheKey === y) {
        ((P = H), ++P.usedTimes);
        break;
      }
    }
    return (P === void 0 && ((P = new Ap(i, y, S, r)), h.push(P)), P);
  }
  function R(S) {
    if (--S.usedTimes === 0) {
      const y = h.indexOf(S);
      ((h[y] = h[h.length - 1]), h.pop(), S.destroy());
    }
  }
  function A(S) {
    o.remove(S);
  }
  function C() {
    o.dispose();
  }
  return {
    getParameters: p,
    getProgramCacheKey: f,
    getUniforms: _,
    acquireProgram: L,
    releaseProgram: R,
    releaseShaderCache: A,
    programs: h,
    dispose: C,
  };
}
function Dp() {
  let i = new WeakMap();
  function t(a) {
    return i.has(a);
  }
  function e(a) {
    let l = i.get(a);
    return (l === void 0 && ((l = {}), i.set(a, l)), l);
  }
  function n(a) {
    i.delete(a);
  }
  function s(a, l, o) {
    i.get(a)[l] = o;
  }
  function r() {
    i = new WeakMap();
  }
  return { has: t, get: e, remove: n, update: s, dispose: r };
}
function Up(i, t) {
  return i.groupOrder !== t.groupOrder
    ? i.groupOrder - t.groupOrder
    : i.renderOrder !== t.renderOrder
      ? i.renderOrder - t.renderOrder
      : i.material.id !== t.material.id
        ? i.material.id - t.material.id
        : i.z !== t.z
          ? i.z - t.z
          : i.id - t.id;
}
function Ho(i, t) {
  return i.groupOrder !== t.groupOrder
    ? i.groupOrder - t.groupOrder
    : i.renderOrder !== t.renderOrder
      ? i.renderOrder - t.renderOrder
      : i.z !== t.z
        ? t.z - i.z
        : i.id - t.id;
}
function Vo() {
  const i = [];
  let t = 0;
  const e = [],
    n = [],
    s = [];
  function r() {
    ((t = 0), (e.length = 0), (n.length = 0), (s.length = 0));
  }
  function a(d, u, m, g, v, p) {
    let f = i[t];
    return (
      f === void 0
        ? ((f = {
            id: d.id,
            object: d,
            geometry: u,
            material: m,
            groupOrder: g,
            renderOrder: d.renderOrder,
            z: v,
            group: p,
          }),
          (i[t] = f))
        : ((f.id = d.id),
          (f.object = d),
          (f.geometry = u),
          (f.material = m),
          (f.groupOrder = g),
          (f.renderOrder = d.renderOrder),
          (f.z = v),
          (f.group = p)),
      t++,
      f
    );
  }
  function l(d, u, m, g, v, p) {
    const f = a(d, u, m, g, v, p);
    m.transmission > 0
      ? n.push(f)
      : m.transparent === !0
        ? s.push(f)
        : e.push(f);
  }
  function o(d, u, m, g, v, p) {
    const f = a(d, u, m, g, v, p);
    m.transmission > 0
      ? n.unshift(f)
      : m.transparent === !0
        ? s.unshift(f)
        : e.unshift(f);
  }
  function c(d, u) {
    (e.length > 1 && e.sort(d || Up),
      n.length > 1 && n.sort(u || Ho),
      s.length > 1 && s.sort(u || Ho));
  }
  function h() {
    for (let d = t, u = i.length; d < u; d++) {
      const m = i[d];
      if (m.id === null) break;
      ((m.id = null),
        (m.object = null),
        (m.geometry = null),
        (m.material = null),
        (m.group = null));
    }
  }
  return {
    opaque: e,
    transmissive: n,
    transparent: s,
    init: r,
    push: l,
    unshift: o,
    finish: h,
    sort: c,
  };
}
function Ip() {
  let i = new WeakMap();
  function t(n, s) {
    const r = i.get(n);
    let a;
    return (
      r === void 0
        ? ((a = new Vo()), i.set(n, [a]))
        : s >= r.length
          ? ((a = new Vo()), r.push(a))
          : (a = r[s]),
      a
    );
  }
  function e() {
    i = new WeakMap();
  }
  return { get: t, dispose: e };
}
function Np() {
  const i = {};
  return {
    get: function (t) {
      if (i[t.id] !== void 0) return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = { direction: new b(), color: new Pt() };
          break;
        case "SpotLight":
          e = {
            position: new b(),
            direction: new b(),
            color: new Pt(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0,
          };
          break;
        case "PointLight":
          e = { position: new b(), color: new Pt(), distance: 0, decay: 0 };
          break;
        case "HemisphereLight":
          e = { direction: new b(), skyColor: new Pt(), groundColor: new Pt() };
          break;
        case "RectAreaLight":
          e = {
            color: new Pt(),
            position: new b(),
            halfWidth: new b(),
            halfHeight: new b(),
          };
          break;
      }
      return ((i[t.id] = e), e);
    },
  };
}
function Fp() {
  const i = {};
  return {
    get: function (t) {
      if (i[t.id] !== void 0) return i[t.id];
      let e;
      switch (t.type) {
        case "DirectionalLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new It(),
          };
          break;
        case "SpotLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new It(),
          };
          break;
        case "PointLight":
          e = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new It(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3,
          };
          break;
      }
      return ((i[t.id] = e), e);
    },
  };
}
let zp = 0;
function Op(i, t) {
  return (
    (t.castShadow ? 2 : 0) -
    (i.castShadow ? 2 : 0) +
    (t.map ? 1 : 0) -
    (i.map ? 1 : 0)
  );
}
function Bp(i) {
  const t = new Np(),
    e = Fp(),
    n = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1,
        numSpotMaps: -1,
        numLightProbes: -1,
      },
      ambient: [0, 0, 0],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotLightMap: [],
      spotShadow: [],
      spotShadowMap: [],
      spotLightMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: [],
      numSpotLightShadowsWithMaps: 0,
      numLightProbes: 0,
    };
  for (let c = 0; c < 9; c++) n.probe.push(new b());
  const s = new b(),
    r = new Zt(),
    a = new Zt();
  function l(c) {
    let h = 0,
      d = 0,
      u = 0;
    for (let S = 0; S < 9; S++) n.probe[S].set(0, 0, 0);
    let m = 0,
      g = 0,
      v = 0,
      p = 0,
      f = 0,
      w = 0,
      M = 0,
      _ = 0,
      L = 0,
      R = 0,
      A = 0;
    c.sort(Op);
    for (let S = 0, y = c.length; S < y; S++) {
      const P = c[S],
        z = P.color,
        U = P.intensity,
        H = P.distance,
        k = P.shadow && P.shadow.map ? P.shadow.map.texture : null;
      if (P.isAmbientLight) ((h += z.r * U), (d += z.g * U), (u += z.b * U));
      else if (P.isLightProbe) {
        for (let G = 0; G < 9; G++)
          n.probe[G].addScaledVector(P.sh.coefficients[G], U);
        A++;
      } else if (P.isDirectionalLight) {
        const G = t.get(P);
        if ((G.color.copy(P.color).multiplyScalar(P.intensity), P.castShadow)) {
          const q = P.shadow,
            O = e.get(P);
          ((O.shadowIntensity = q.intensity),
            (O.shadowBias = q.bias),
            (O.shadowNormalBias = q.normalBias),
            (O.shadowRadius = q.radius),
            (O.shadowMapSize = q.mapSize),
            (n.directionalShadow[m] = O),
            (n.directionalShadowMap[m] = k),
            (n.directionalShadowMatrix[m] = P.shadow.matrix),
            w++);
        }
        ((n.directional[m] = G), m++);
      } else if (P.isSpotLight) {
        const G = t.get(P);
        (G.position.setFromMatrixPosition(P.matrixWorld),
          G.color.copy(z).multiplyScalar(U),
          (G.distance = H),
          (G.coneCos = Math.cos(P.angle)),
          (G.penumbraCos = Math.cos(P.angle * (1 - P.penumbra))),
          (G.decay = P.decay),
          (n.spot[v] = G));
        const q = P.shadow;
        if (
          (P.map &&
            ((n.spotLightMap[L] = P.map),
            L++,
            q.updateMatrices(P),
            P.castShadow && R++),
          (n.spotLightMatrix[v] = q.matrix),
          P.castShadow)
        ) {
          const O = e.get(P);
          ((O.shadowIntensity = q.intensity),
            (O.shadowBias = q.bias),
            (O.shadowNormalBias = q.normalBias),
            (O.shadowRadius = q.radius),
            (O.shadowMapSize = q.mapSize),
            (n.spotShadow[v] = O),
            (n.spotShadowMap[v] = k),
            _++);
        }
        v++;
      } else if (P.isRectAreaLight) {
        const G = t.get(P);
        (G.color.copy(z).multiplyScalar(U),
          G.halfWidth.set(P.width * 0.5, 0, 0),
          G.halfHeight.set(0, P.height * 0.5, 0),
          (n.rectArea[p] = G),
          p++);
      } else if (P.isPointLight) {
        const G = t.get(P);
        if (
          (G.color.copy(P.color).multiplyScalar(P.intensity),
          (G.distance = P.distance),
          (G.decay = P.decay),
          P.castShadow)
        ) {
          const q = P.shadow,
            O = e.get(P);
          ((O.shadowIntensity = q.intensity),
            (O.shadowBias = q.bias),
            (O.shadowNormalBias = q.normalBias),
            (O.shadowRadius = q.radius),
            (O.shadowMapSize = q.mapSize),
            (O.shadowCameraNear = q.camera.near),
            (O.shadowCameraFar = q.camera.far),
            (n.pointShadow[g] = O),
            (n.pointShadowMap[g] = k),
            (n.pointShadowMatrix[g] = P.shadow.matrix),
            M++);
        }
        ((n.point[g] = G), g++);
      } else if (P.isHemisphereLight) {
        const G = t.get(P);
        (G.skyColor.copy(P.color).multiplyScalar(U),
          G.groundColor.copy(P.groundColor).multiplyScalar(U),
          (n.hemi[f] = G),
          f++);
      }
    }
    (p > 0 &&
      (i.has("OES_texture_float_linear") === !0
        ? ((n.rectAreaLTC1 = at.LTC_FLOAT_1), (n.rectAreaLTC2 = at.LTC_FLOAT_2))
        : ((n.rectAreaLTC1 = at.LTC_HALF_1), (n.rectAreaLTC2 = at.LTC_HALF_2))),
      (n.ambient[0] = h),
      (n.ambient[1] = d),
      (n.ambient[2] = u));
    const C = n.hash;
    (C.directionalLength !== m ||
      C.pointLength !== g ||
      C.spotLength !== v ||
      C.rectAreaLength !== p ||
      C.hemiLength !== f ||
      C.numDirectionalShadows !== w ||
      C.numPointShadows !== M ||
      C.numSpotShadows !== _ ||
      C.numSpotMaps !== L ||
      C.numLightProbes !== A) &&
      ((n.directional.length = m),
      (n.spot.length = v),
      (n.rectArea.length = p),
      (n.point.length = g),
      (n.hemi.length = f),
      (n.directionalShadow.length = w),
      (n.directionalShadowMap.length = w),
      (n.pointShadow.length = M),
      (n.pointShadowMap.length = M),
      (n.spotShadow.length = _),
      (n.spotShadowMap.length = _),
      (n.directionalShadowMatrix.length = w),
      (n.pointShadowMatrix.length = M),
      (n.spotLightMatrix.length = _ + L - R),
      (n.spotLightMap.length = L),
      (n.numSpotLightShadowsWithMaps = R),
      (n.numLightProbes = A),
      (C.directionalLength = m),
      (C.pointLength = g),
      (C.spotLength = v),
      (C.rectAreaLength = p),
      (C.hemiLength = f),
      (C.numDirectionalShadows = w),
      (C.numPointShadows = M),
      (C.numSpotShadows = _),
      (C.numSpotMaps = L),
      (C.numLightProbes = A),
      (n.version = zp++));
  }
  function o(c, h) {
    let d = 0,
      u = 0,
      m = 0,
      g = 0,
      v = 0;
    const p = h.matrixWorldInverse;
    for (let f = 0, w = c.length; f < w; f++) {
      const M = c[f];
      if (M.isDirectionalLight) {
        const _ = n.directional[d];
        (_.direction.setFromMatrixPosition(M.matrixWorld),
          s.setFromMatrixPosition(M.target.matrixWorld),
          _.direction.sub(s),
          _.direction.transformDirection(p),
          d++);
      } else if (M.isSpotLight) {
        const _ = n.spot[m];
        (_.position.setFromMatrixPosition(M.matrixWorld),
          _.position.applyMatrix4(p),
          _.direction.setFromMatrixPosition(M.matrixWorld),
          s.setFromMatrixPosition(M.target.matrixWorld),
          _.direction.sub(s),
          _.direction.transformDirection(p),
          m++);
      } else if (M.isRectAreaLight) {
        const _ = n.rectArea[g];
        (_.position.setFromMatrixPosition(M.matrixWorld),
          _.position.applyMatrix4(p),
          a.identity(),
          r.copy(M.matrixWorld),
          r.premultiply(p),
          a.extractRotation(r),
          _.halfWidth.set(M.width * 0.5, 0, 0),
          _.halfHeight.set(0, M.height * 0.5, 0),
          _.halfWidth.applyMatrix4(a),
          _.halfHeight.applyMatrix4(a),
          g++);
      } else if (M.isPointLight) {
        const _ = n.point[u];
        (_.position.setFromMatrixPosition(M.matrixWorld),
          _.position.applyMatrix4(p),
          u++);
      } else if (M.isHemisphereLight) {
        const _ = n.hemi[v];
        (_.direction.setFromMatrixPosition(M.matrixWorld),
          _.direction.transformDirection(p),
          v++);
      }
    }
  }
  return { setup: l, setupView: o, state: n };
}
function Go(i) {
  const t = new Bp(i),
    e = [],
    n = [];
  function s(h) {
    ((c.camera = h), (e.length = 0), (n.length = 0));
  }
  function r(h) {
    e.push(h);
  }
  function a(h) {
    n.push(h);
  }
  function l() {
    t.setup(e);
  }
  function o(h) {
    t.setupView(e, h);
  }
  const c = {
    lightsArray: e,
    shadowsArray: n,
    camera: null,
    lights: t,
    transmissionRenderTarget: {},
  };
  return {
    init: s,
    state: c,
    setupLights: l,
    setupLightsView: o,
    pushLight: r,
    pushShadow: a,
  };
}
function kp(i) {
  let t = new WeakMap();
  function e(s, r = 0) {
    const a = t.get(s);
    let l;
    return (
      a === void 0
        ? ((l = new Go(i)), t.set(s, [l]))
        : r >= a.length
          ? ((l = new Go(i)), a.push(l))
          : (l = a[r]),
      l
    );
  }
  function n() {
    t = new WeakMap();
  }
  return { get: e, dispose: n };
}
class zl extends ns {
  static get type() {
    return "MeshDepthMaterial";
  }
  constructor(t) {
    (super(),
      (this.isMeshDepthMaterial = !0),
      (this.depthPacking = yc),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      this.setValues(t));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.depthPacking = t.depthPacking),
      (this.map = t.map),
      (this.alphaMap = t.alphaMap),
      (this.displacementMap = t.displacementMap),
      (this.displacementScale = t.displacementScale),
      (this.displacementBias = t.displacementBias),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      this
    );
  }
}
class Hp extends ns {
  static get type() {
    return "MeshDistanceMaterial";
  }
  constructor(t) {
    (super(),
      (this.isMeshDistanceMaterial = !0),
      (this.map = null),
      (this.alphaMap = null),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      this.setValues(t));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.map = t.map),
      (this.alphaMap = t.alphaMap),
      (this.displacementMap = t.displacementMap),
      (this.displacementScale = t.displacementScale),
      (this.displacementBias = t.displacementBias),
      this
    );
  }
}
const Vp = `void main() {
	gl_Position = vec4( position, 1.0 );
}`,
  Gp = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;
function Wp(i, t, e) {
  let n = new Pa();
  const s = new It(),
    r = new It(),
    a = new ee(),
    l = new zl({ depthPacking: _l }),
    o = new Hp(),
    c = {},
    h = e.maxTextureSize,
    d = { [Fn]: Ce, [Ce]: Fn, [Ie]: Ie },
    u = new pe({
      defines: { VSM_SAMPLES: 8 },
      uniforms: {
        shadow_pass: { value: null },
        resolution: { value: new It() },
        radius: { value: 4 },
      },
      vertexShader: Vp,
      fragmentShader: Gp,
    }),
    m = u.clone();
  m.defines.HORIZONTAL_PASS = 1;
  const g = new Le();
  g.setAttribute(
    "position",
    new Ye(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3),
  );
  const v = new Ut(g, u),
    p = this;
  ((this.enabled = !1),
    (this.autoUpdate = !0),
    (this.needsUpdate = !1),
    (this.type = sl));
  let f = this.type;
  this.render = function (R, A, C) {
    if (
      p.enabled === !1 ||
      (p.autoUpdate === !1 && p.needsUpdate === !1) ||
      R.length === 0
    )
      return;
    const S = i.getRenderTarget(),
      y = i.getActiveCubeFace(),
      P = i.getActiveMipmapLevel(),
      z = i.state;
    (z.setBlending(In),
      z.buffers.color.setClear(1, 1, 1, 1),
      z.buffers.depth.setTest(!0),
      z.setScissorTest(!1));
    const U = f !== mn && this.type === mn,
      H = f === mn && this.type !== mn;
    for (let k = 0, G = R.length; k < G; k++) {
      const q = R[k],
        O = q.shadow;
      if (O === void 0) {
        console.warn("THREE.WebGLShadowMap:", q, "has no shadow.");
        continue;
      }
      if (O.autoUpdate === !1 && O.needsUpdate === !1) continue;
      s.copy(O.mapSize);
      const et = O.getFrameExtents();
      if (
        (s.multiply(et),
        r.copy(O.mapSize),
        (s.x > h || s.y > h) &&
          (s.x > h &&
            ((r.x = Math.floor(h / et.x)),
            (s.x = r.x * et.x),
            (O.mapSize.x = r.x)),
          s.y > h &&
            ((r.y = Math.floor(h / et.y)),
            (s.y = r.y * et.y),
            (O.mapSize.y = r.y))),
        O.map === null || U === !0 || H === !0)
      ) {
        const nt = this.type !== mn ? { minFilter: ke, magFilter: ke } : {};
        (O.map !== null && O.map.dispose(),
          (O.map = new Sn(s.x, s.y, nt)),
          (O.map.texture.name = q.name + ".shadowMap"),
          O.camera.updateProjectionMatrix());
      }
      (i.setRenderTarget(O.map), i.clear());
      const K = O.getViewportCount();
      for (let nt = 0; nt < K; nt++) {
        const _t = O.getViewport(nt);
        (a.set(r.x * _t.x, r.y * _t.y, r.x * _t.z, r.y * _t.w),
          z.viewport(a),
          O.updateMatrices(q, nt),
          (n = O.getFrustum()),
          _(A, C, O.camera, q, this.type));
      }
      (O.isPointLightShadow !== !0 && this.type === mn && w(O, C),
        (O.needsUpdate = !1));
    }
    ((f = this.type), (p.needsUpdate = !1), i.setRenderTarget(S, y, P));
  };
  function w(R, A) {
    const C = t.update(v);
    (u.defines.VSM_SAMPLES !== R.blurSamples &&
      ((u.defines.VSM_SAMPLES = R.blurSamples),
      (m.defines.VSM_SAMPLES = R.blurSamples),
      (u.needsUpdate = !0),
      (m.needsUpdate = !0)),
      R.mapPass === null && (R.mapPass = new Sn(s.x, s.y)),
      (u.uniforms.shadow_pass.value = R.map.texture),
      (u.uniforms.resolution.value = R.mapSize),
      (u.uniforms.radius.value = R.radius),
      i.setRenderTarget(R.mapPass),
      i.clear(),
      i.renderBufferDirect(A, null, C, u, v, null),
      (m.uniforms.shadow_pass.value = R.mapPass.texture),
      (m.uniforms.resolution.value = R.mapSize),
      (m.uniforms.radius.value = R.radius),
      i.setRenderTarget(R.map),
      i.clear(),
      i.renderBufferDirect(A, null, C, m, v, null));
  }
  function M(R, A, C, S) {
    let y = null;
    const P =
      C.isPointLight === !0 ? R.customDistanceMaterial : R.customDepthMaterial;
    if (P !== void 0) y = P;
    else if (
      ((y = C.isPointLight === !0 ? o : l),
      (i.localClippingEnabled &&
        A.clipShadows === !0 &&
        Array.isArray(A.clippingPlanes) &&
        A.clippingPlanes.length !== 0) ||
        (A.displacementMap && A.displacementScale !== 0) ||
        (A.alphaMap && A.alphaTest > 0) ||
        (A.map && A.alphaTest > 0))
    ) {
      const z = y.uuid,
        U = A.uuid;
      let H = c[z];
      H === void 0 && ((H = {}), (c[z] = H));
      let k = H[U];
      (k === void 0 &&
        ((k = y.clone()), (H[U] = k), A.addEventListener("dispose", L)),
        (y = k));
    }
    if (
      ((y.visible = A.visible),
      (y.wireframe = A.wireframe),
      S === mn
        ? (y.side = A.shadowSide !== null ? A.shadowSide : A.side)
        : (y.side = A.shadowSide !== null ? A.shadowSide : d[A.side]),
      (y.alphaMap = A.alphaMap),
      (y.alphaTest = A.alphaTest),
      (y.map = A.map),
      (y.clipShadows = A.clipShadows),
      (y.clippingPlanes = A.clippingPlanes),
      (y.clipIntersection = A.clipIntersection),
      (y.displacementMap = A.displacementMap),
      (y.displacementScale = A.displacementScale),
      (y.displacementBias = A.displacementBias),
      (y.wireframeLinewidth = A.wireframeLinewidth),
      (y.linewidth = A.linewidth),
      C.isPointLight === !0 && y.isMeshDistanceMaterial === !0)
    ) {
      const z = i.properties.get(y);
      z.light = C;
    }
    return y;
  }
  function _(R, A, C, S, y) {
    if (R.visible === !1) return;
    if (
      R.layers.test(A.layers) &&
      (R.isMesh || R.isLine || R.isPoints) &&
      (R.castShadow || (R.receiveShadow && y === mn)) &&
      (!R.frustumCulled || n.intersectsObject(R))
    ) {
      R.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse, R.matrixWorld);
      const U = t.update(R),
        H = R.material;
      if (Array.isArray(H)) {
        const k = U.groups;
        for (let G = 0, q = k.length; G < q; G++) {
          const O = k[G],
            et = H[O.materialIndex];
          if (et && et.visible) {
            const K = M(R, et, S, y);
            (R.onBeforeShadow(i, R, A, C, U, K, O),
              i.renderBufferDirect(C, null, U, K, R, O),
              R.onAfterShadow(i, R, A, C, U, K, O));
          }
        }
      } else if (H.visible) {
        const k = M(R, H, S, y);
        (R.onBeforeShadow(i, R, A, C, U, k, null),
          i.renderBufferDirect(C, null, U, k, R, null),
          R.onAfterShadow(i, R, A, C, U, k, null));
      }
    }
    const z = R.children;
    for (let U = 0, H = z.length; U < H; U++) _(z[U], A, C, S, y);
  }
  function L(R) {
    R.target.removeEventListener("dispose", L);
    for (const C in c) {
      const S = c[C],
        y = R.target.uuid;
      y in S && (S[y].dispose(), delete S[y]);
    }
  }
}
const qp = {
  [Ur]: Ir,
  [Nr]: Or,
  [Fr]: Br,
  [bi]: zr,
  [Ir]: Ur,
  [Or]: Nr,
  [Br]: Fr,
  [zr]: bi,
};
function Xp(i, t) {
  function e() {
    let D = !1;
    const lt = new ee();
    let X = null;
    const Z = new ee(0, 0, 0, 0);
    return {
      setMask: function (ft) {
        X !== ft && !D && (i.colorMask(ft, ft, ft, ft), (X = ft));
      },
      setLocked: function (ft) {
        D = ft;
      },
      setClear: function (ft, ut, Nt, ue, Me) {
        (Me === !0 && ((ft *= ue), (ut *= ue), (Nt *= ue)),
          lt.set(ft, ut, Nt, ue),
          Z.equals(lt) === !1 && (i.clearColor(ft, ut, Nt, ue), Z.copy(lt)));
      },
      reset: function () {
        ((D = !1), (X = null), Z.set(-1, 0, 0, 0));
      },
    };
  }
  function n() {
    let D = !1,
      lt = !1,
      X = null,
      Z = null,
      ft = null;
    return {
      setReversed: function (ut) {
        if (lt !== ut) {
          const Nt = t.get("EXT_clip_control");
          lt
            ? Nt.clipControlEXT(Nt.LOWER_LEFT_EXT, Nt.ZERO_TO_ONE_EXT)
            : Nt.clipControlEXT(Nt.LOWER_LEFT_EXT, Nt.NEGATIVE_ONE_TO_ONE_EXT);
          const ue = ft;
          ((ft = null), this.setClear(ue));
        }
        lt = ut;
      },
      getReversed: function () {
        return lt;
      },
      setTest: function (ut) {
        ut ? ct(i.DEPTH_TEST) : At(i.DEPTH_TEST);
      },
      setMask: function (ut) {
        X !== ut && !D && (i.depthMask(ut), (X = ut));
      },
      setFunc: function (ut) {
        if ((lt && (ut = qp[ut]), Z !== ut)) {
          switch (ut) {
            case Ur:
              i.depthFunc(i.NEVER);
              break;
            case Ir:
              i.depthFunc(i.ALWAYS);
              break;
            case Nr:
              i.depthFunc(i.LESS);
              break;
            case bi:
              i.depthFunc(i.LEQUAL);
              break;
            case Fr:
              i.depthFunc(i.EQUAL);
              break;
            case zr:
              i.depthFunc(i.GEQUAL);
              break;
            case Or:
              i.depthFunc(i.GREATER);
              break;
            case Br:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          Z = ut;
        }
      },
      setLocked: function (ut) {
        D = ut;
      },
      setClear: function (ut) {
        ft !== ut && (lt && (ut = 1 - ut), i.clearDepth(ut), (ft = ut));
      },
      reset: function () {
        ((D = !1), (X = null), (Z = null), (ft = null), (lt = !1));
      },
    };
  }
  function s() {
    let D = !1,
      lt = null,
      X = null,
      Z = null,
      ft = null,
      ut = null,
      Nt = null,
      ue = null,
      Me = null;
    return {
      setTest: function (Jt) {
        D || (Jt ? ct(i.STENCIL_TEST) : At(i.STENCIL_TEST));
      },
      setMask: function (Jt) {
        lt !== Jt && !D && (i.stencilMask(Jt), (lt = Jt));
      },
      setFunc: function (Jt, je, on) {
        (X !== Jt || Z !== je || ft !== on) &&
          (i.stencilFunc(Jt, je, on), (X = Jt), (Z = je), (ft = on));
      },
      setOp: function (Jt, je, on) {
        (ut !== Jt || Nt !== je || ue !== on) &&
          (i.stencilOp(Jt, je, on), (ut = Jt), (Nt = je), (ue = on));
      },
      setLocked: function (Jt) {
        D = Jt;
      },
      setClear: function (Jt) {
        Me !== Jt && (i.clearStencil(Jt), (Me = Jt));
      },
      reset: function () {
        ((D = !1),
          (lt = null),
          (X = null),
          (Z = null),
          (ft = null),
          (ut = null),
          (Nt = null),
          (ue = null),
          (Me = null));
      },
    };
  }
  const r = new e(),
    a = new n(),
    l = new s(),
    o = new WeakMap(),
    c = new WeakMap();
  let h = {},
    d = {},
    u = new WeakMap(),
    m = [],
    g = null,
    v = !1,
    p = null,
    f = null,
    w = null,
    M = null,
    _ = null,
    L = null,
    R = null,
    A = new Pt(0, 0, 0),
    C = 0,
    S = !1,
    y = null,
    P = null,
    z = null,
    U = null,
    H = null;
  const k = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
  let G = !1,
    q = 0;
  const O = i.getParameter(i.VERSION);
  O.indexOf("WebGL") !== -1
    ? ((q = parseFloat(/^WebGL (\d)/.exec(O)[1])), (G = q >= 1))
    : O.indexOf("OpenGL ES") !== -1 &&
      ((q = parseFloat(/^OpenGL ES (\d)/.exec(O)[1])), (G = q >= 2));
  let et = null,
    K = {};
  const nt = i.getParameter(i.SCISSOR_BOX),
    _t = i.getParameter(i.VIEWPORT),
    Lt = new ee().fromArray(nt),
    Y = new ee().fromArray(_t);
  function it(D, lt, X, Z) {
    const ft = new Uint8Array(4),
      ut = i.createTexture();
    (i.bindTexture(D, ut),
      i.texParameteri(D, i.TEXTURE_MIN_FILTER, i.NEAREST),
      i.texParameteri(D, i.TEXTURE_MAG_FILTER, i.NEAREST));
    for (let Nt = 0; Nt < X; Nt++)
      D === i.TEXTURE_3D || D === i.TEXTURE_2D_ARRAY
        ? i.texImage3D(lt, 0, i.RGBA, 1, 1, Z, 0, i.RGBA, i.UNSIGNED_BYTE, ft)
        : i.texImage2D(
            lt + Nt,
            0,
            i.RGBA,
            1,
            1,
            0,
            i.RGBA,
            i.UNSIGNED_BYTE,
            ft,
          );
    return ut;
  }
  const vt = {};
  ((vt[i.TEXTURE_2D] = it(i.TEXTURE_2D, i.TEXTURE_2D, 1)),
    (vt[i.TEXTURE_CUBE_MAP] = it(
      i.TEXTURE_CUBE_MAP,
      i.TEXTURE_CUBE_MAP_POSITIVE_X,
      6,
    )),
    (vt[i.TEXTURE_2D_ARRAY] = it(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1)),
    (vt[i.TEXTURE_3D] = it(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1)),
    r.setClear(0, 0, 0, 1),
    a.setClear(1),
    l.setClear(0),
    ct(i.DEPTH_TEST),
    a.setFunc(bi),
    Ht(!1),
    Vt(Ya),
    ct(i.CULL_FACE),
    F(In));
  function ct(D) {
    h[D] !== !0 && (i.enable(D), (h[D] = !0));
  }
  function At(D) {
    h[D] !== !1 && (i.disable(D), (h[D] = !1));
  }
  function Dt(D, lt) {
    return d[D] !== lt
      ? (i.bindFramebuffer(D, lt),
        (d[D] = lt),
        D === i.DRAW_FRAMEBUFFER && (d[i.FRAMEBUFFER] = lt),
        D === i.FRAMEBUFFER && (d[i.DRAW_FRAMEBUFFER] = lt),
        !0)
      : !1;
  }
  function kt(D, lt) {
    let X = m,
      Z = !1;
    if (D) {
      ((X = u.get(lt)), X === void 0 && ((X = []), u.set(lt, X)));
      const ft = D.textures;
      if (X.length !== ft.length || X[0] !== i.COLOR_ATTACHMENT0) {
        for (let ut = 0, Nt = ft.length; ut < Nt; ut++)
          X[ut] = i.COLOR_ATTACHMENT0 + ut;
        ((X.length = ft.length), (Z = !0));
      }
    } else X[0] !== i.BACK && ((X[0] = i.BACK), (Z = !0));
    Z && i.drawBuffers(X);
  }
  function ce(D) {
    return g !== D ? (i.useProgram(D), (g = D), !0) : !1;
  }
  const Wt = {
    [Dn]: i.FUNC_ADD,
    [Kl]: i.FUNC_SUBTRACT,
    [$l]: i.FUNC_REVERSE_SUBTRACT,
  };
  ((Wt[Zl] = i.MIN), (Wt[Jl] = i.MAX));
  const de = {
    [Ql]: i.ZERO,
    [Pr]: i.ONE,
    [tc]: i.SRC_COLOR,
    [Lr]: i.SRC_ALPHA,
    [ac]: i.SRC_ALPHA_SATURATE,
    [sc]: i.DST_COLOR,
    [nc]: i.DST_ALPHA,
    [ec]: i.ONE_MINUS_SRC_COLOR,
    [Dr]: i.ONE_MINUS_SRC_ALPHA,
    [rc]: i.ONE_MINUS_DST_COLOR,
    [ic]: i.ONE_MINUS_DST_ALPHA,
    [oc]: i.CONSTANT_COLOR,
    [lc]: i.ONE_MINUS_CONSTANT_COLOR,
    [cc]: i.CONSTANT_ALPHA,
    [hc]: i.ONE_MINUS_CONSTANT_ALPHA,
  };
  function F(D, lt, X, Z, ft, ut, Nt, ue, Me, Jt) {
    if (D === In) {
      v === !0 && (At(i.BLEND), (v = !1));
      return;
    }
    if ((v === !1 && (ct(i.BLEND), (v = !0)), D !== al)) {
      if (D !== p || Jt !== S) {
        if (
          ((f !== Dn || _ !== Dn) &&
            (i.blendEquation(i.FUNC_ADD), (f = Dn), (_ = Dn)),
          Jt)
        )
          switch (D) {
            case $n:
              i.blendFuncSeparate(
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
              );
              break;
            case Mn:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case ja:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Ka:
              i.blendFuncSeparate(i.ZERO, i.SRC_COLOR, i.ZERO, i.SRC_ALPHA);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", D);
              break;
          }
        else
          switch (D) {
            case $n:
              i.blendFuncSeparate(
                i.SRC_ALPHA,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
              );
              break;
            case Mn:
              i.blendFunc(i.SRC_ALPHA, i.ONE);
              break;
            case ja:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Ka:
              i.blendFunc(i.ZERO, i.SRC_COLOR);
              break;
            default:
              console.error("THREE.WebGLState: Invalid blending: ", D);
              break;
          }
        ((w = null),
          (M = null),
          (L = null),
          (R = null),
          A.set(0, 0, 0),
          (C = 0),
          (p = D),
          (S = Jt));
      }
      return;
    }
    ((ft = ft || lt),
      (ut = ut || X),
      (Nt = Nt || Z),
      (lt !== f || ft !== _) &&
        (i.blendEquationSeparate(Wt[lt], Wt[ft]), (f = lt), (_ = ft)),
      (X !== w || Z !== M || ut !== L || Nt !== R) &&
        (i.blendFuncSeparate(de[X], de[Z], de[ut], de[Nt]),
        (w = X),
        (M = Z),
        (L = ut),
        (R = Nt)),
      (ue.equals(A) === !1 || Me !== C) &&
        (i.blendColor(ue.r, ue.g, ue.b, Me), A.copy(ue), (C = Me)),
      (p = D),
      (S = !1));
  }
  function Ve(D, lt) {
    D.side === Ie ? At(i.CULL_FACE) : ct(i.CULL_FACE);
    let X = D.side === Ce;
    (lt && (X = !X),
      Ht(X),
      D.blending === $n && D.transparent === !1
        ? F(In)
        : F(
            D.blending,
            D.blendEquation,
            D.blendSrc,
            D.blendDst,
            D.blendEquationAlpha,
            D.blendSrcAlpha,
            D.blendDstAlpha,
            D.blendColor,
            D.blendAlpha,
            D.premultipliedAlpha,
          ),
      a.setFunc(D.depthFunc),
      a.setTest(D.depthTest),
      a.setMask(D.depthWrite),
      r.setMask(D.colorWrite));
    const Z = D.stencilWrite;
    (l.setTest(Z),
      Z &&
        (l.setMask(D.stencilWriteMask),
        l.setFunc(D.stencilFunc, D.stencilRef, D.stencilFuncMask),
        l.setOp(D.stencilFail, D.stencilZFail, D.stencilZPass)),
      re(D.polygonOffset, D.polygonOffsetFactor, D.polygonOffsetUnits),
      D.alphaToCoverage === !0
        ? ct(i.SAMPLE_ALPHA_TO_COVERAGE)
        : At(i.SAMPLE_ALPHA_TO_COVERAGE));
  }
  function Ht(D) {
    y !== D && (D ? i.frontFace(i.CW) : i.frontFace(i.CCW), (y = D));
  }
  function Vt(D) {
    (D !== Yl
      ? (ct(i.CULL_FACE),
        D !== P &&
          (D === Ya
            ? i.cullFace(i.BACK)
            : D === jl
              ? i.cullFace(i.FRONT)
              : i.cullFace(i.FRONT_AND_BACK)))
      : At(i.CULL_FACE),
      (P = D));
  }
  function Tt(D) {
    D !== z && (G && i.lineWidth(D), (z = D));
  }
  function re(D, lt, X) {
    D
      ? (ct(i.POLYGON_OFFSET_FILL),
        (U !== lt || H !== X) && (i.polygonOffset(lt, X), (U = lt), (H = X)))
      : At(i.POLYGON_OFFSET_FILL);
  }
  function wt(D) {
    D ? ct(i.SCISSOR_TEST) : At(i.SCISSOR_TEST);
  }
  function T(D) {
    (D === void 0 && (D = i.TEXTURE0 + k - 1),
      et !== D && (i.activeTexture(D), (et = D)));
  }
  function x(D, lt, X) {
    X === void 0 && (et === null ? (X = i.TEXTURE0 + k - 1) : (X = et));
    let Z = K[X];
    (Z === void 0 && ((Z = { type: void 0, texture: void 0 }), (K[X] = Z)),
      (Z.type !== D || Z.texture !== lt) &&
        (et !== X && (i.activeTexture(X), (et = X)),
        i.bindTexture(D, lt || vt[D]),
        (Z.type = D),
        (Z.texture = lt)));
  }
  function B() {
    const D = K[et];
    D !== void 0 &&
      D.type !== void 0 &&
      (i.bindTexture(D.type, null), (D.type = void 0), (D.texture = void 0));
  }
  function $() {
    try {
      i.compressedTexImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Q() {
    try {
      i.compressedTexImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function j() {
    try {
      i.texSubImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function St() {
    try {
      i.texSubImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function ht() {
    try {
      i.compressedTexSubImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function pt() {
    try {
      i.compressedTexSubImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function qt() {
    try {
      i.texStorage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function st() {
    try {
      i.texStorage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function mt() {
    try {
      i.texImage2D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function bt() {
    try {
      i.texImage3D.apply(i, arguments);
    } catch (D) {
      console.error("THREE.WebGLState:", D);
    }
  }
  function Rt(D) {
    Lt.equals(D) === !1 && (i.scissor(D.x, D.y, D.z, D.w), Lt.copy(D));
  }
  function gt(D) {
    Y.equals(D) === !1 && (i.viewport(D.x, D.y, D.z, D.w), Y.copy(D));
  }
  function Gt(D, lt) {
    let X = c.get(lt);
    X === void 0 && ((X = new WeakMap()), c.set(lt, X));
    let Z = X.get(D);
    Z === void 0 && ((Z = i.getUniformBlockIndex(lt, D.name)), X.set(D, Z));
  }
  function Ot(D, lt) {
    const Z = c.get(lt).get(D);
    o.get(lt) !== Z &&
      (i.uniformBlockBinding(lt, Z, D.__bindingPointIndex), o.set(lt, Z));
  }
  function ie() {
    (i.disable(i.BLEND),
      i.disable(i.CULL_FACE),
      i.disable(i.DEPTH_TEST),
      i.disable(i.POLYGON_OFFSET_FILL),
      i.disable(i.SCISSOR_TEST),
      i.disable(i.STENCIL_TEST),
      i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),
      i.blendEquation(i.FUNC_ADD),
      i.blendFunc(i.ONE, i.ZERO),
      i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO),
      i.blendColor(0, 0, 0, 0),
      i.colorMask(!0, !0, !0, !0),
      i.clearColor(0, 0, 0, 0),
      i.depthMask(!0),
      i.depthFunc(i.LESS),
      a.setReversed(!1),
      i.clearDepth(1),
      i.stencilMask(4294967295),
      i.stencilFunc(i.ALWAYS, 0, 4294967295),
      i.stencilOp(i.KEEP, i.KEEP, i.KEEP),
      i.clearStencil(0),
      i.cullFace(i.BACK),
      i.frontFace(i.CCW),
      i.polygonOffset(0, 0),
      i.activeTexture(i.TEXTURE0),
      i.bindFramebuffer(i.FRAMEBUFFER, null),
      i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
      i.bindFramebuffer(i.READ_FRAMEBUFFER, null),
      i.useProgram(null),
      i.lineWidth(1),
      i.scissor(0, 0, i.canvas.width, i.canvas.height),
      i.viewport(0, 0, i.canvas.width, i.canvas.height),
      (h = {}),
      (et = null),
      (K = {}),
      (d = {}),
      (u = new WeakMap()),
      (m = []),
      (g = null),
      (v = !1),
      (p = null),
      (f = null),
      (w = null),
      (M = null),
      (_ = null),
      (L = null),
      (R = null),
      (A = new Pt(0, 0, 0)),
      (C = 0),
      (S = !1),
      (y = null),
      (P = null),
      (z = null),
      (U = null),
      (H = null),
      Lt.set(0, 0, i.canvas.width, i.canvas.height),
      Y.set(0, 0, i.canvas.width, i.canvas.height),
      r.reset(),
      a.reset(),
      l.reset());
  }
  return {
    buffers: { color: r, depth: a, stencil: l },
    enable: ct,
    disable: At,
    bindFramebuffer: Dt,
    drawBuffers: kt,
    useProgram: ce,
    setBlending: F,
    setMaterial: Ve,
    setFlipSided: Ht,
    setCullFace: Vt,
    setLineWidth: Tt,
    setPolygonOffset: re,
    setScissorTest: wt,
    activeTexture: T,
    bindTexture: x,
    unbindTexture: B,
    compressedTexImage2D: $,
    compressedTexImage3D: Q,
    texImage2D: mt,
    texImage3D: bt,
    updateUBOMapping: Gt,
    uniformBlockBinding: Ot,
    texStorage2D: qt,
    texStorage3D: st,
    texSubImage2D: j,
    texSubImage3D: St,
    compressedTexSubImage2D: ht,
    compressedTexSubImage3D: pt,
    scissor: Rt,
    viewport: gt,
    reset: ie,
  };
}
function Wo(i, t, e, n) {
  const s = Yp(n);
  switch (e) {
    case dl:
      return i * t;
    case pl:
      return i * t;
    case ml:
      return i * t * 2;
    case Ta:
      return ((i * t) / s.components) * s.byteLength;
    case ba:
      return ((i * t) / s.components) * s.byteLength;
    case gl:
      return ((i * t * 2) / s.components) * s.byteLength;
    case Aa:
      return ((i * t * 2) / s.components) * s.byteLength;
    case fl:
      return ((i * t * 3) / s.components) * s.byteLength;
    case tn:
      return ((i * t * 4) / s.components) * s.byteLength;
    case Ra:
      return ((i * t * 4) / s.components) * s.byteLength;
    case Ls:
    case Ds:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case Us:
    case Is:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case qr:
    case Yr:
      return (Math.max(i, 16) * Math.max(t, 8)) / 4;
    case Wr:
    case Xr:
      return (Math.max(i, 8) * Math.max(t, 8)) / 2;
    case jr:
    case Kr:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 8;
    case $r:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Zr:
      return Math.floor((i + 3) / 4) * Math.floor((t + 3) / 4) * 16;
    case Jr:
      return Math.floor((i + 4) / 5) * Math.floor((t + 3) / 4) * 16;
    case Qr:
      return Math.floor((i + 4) / 5) * Math.floor((t + 4) / 5) * 16;
    case ta:
      return Math.floor((i + 5) / 6) * Math.floor((t + 4) / 5) * 16;
    case ea:
      return Math.floor((i + 5) / 6) * Math.floor((t + 5) / 6) * 16;
    case na:
      return Math.floor((i + 7) / 8) * Math.floor((t + 4) / 5) * 16;
    case ia:
      return Math.floor((i + 7) / 8) * Math.floor((t + 5) / 6) * 16;
    case sa:
      return Math.floor((i + 7) / 8) * Math.floor((t + 7) / 8) * 16;
    case ra:
      return Math.floor((i + 9) / 10) * Math.floor((t + 4) / 5) * 16;
    case aa:
      return Math.floor((i + 9) / 10) * Math.floor((t + 5) / 6) * 16;
    case oa:
      return Math.floor((i + 9) / 10) * Math.floor((t + 7) / 8) * 16;
    case la:
      return Math.floor((i + 9) / 10) * Math.floor((t + 9) / 10) * 16;
    case ca:
      return Math.floor((i + 11) / 12) * Math.floor((t + 9) / 10) * 16;
    case ha:
      return Math.floor((i + 11) / 12) * Math.floor((t + 11) / 12) * 16;
    case Ns:
    case ua:
    case da:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
    case vl:
    case fa:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 8;
    case pa:
    case ma:
      return Math.ceil(i / 4) * Math.ceil(t / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${e} format.`);
}
function Yp(i) {
  switch (i) {
    case yn:
    case cl:
      return { byteLength: 1, components: 1 };
    case Qi:
    case hl:
    case Qn:
      return { byteLength: 2, components: 1 };
    case Ea:
    case wa:
      return { byteLength: 2, components: 4 };
    case Jn:
    case Sa:
    case rn:
      return { byteLength: 4, components: 1 };
    case ul:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
function jp(i, t, e, n, s, r, a) {
  const l = t.has("WEBGL_multisampled_render_to_texture")
      ? t.get("WEBGL_multisampled_render_to_texture")
      : null,
    o =
      typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent),
    c = new It(),
    h = new WeakMap();
  let d;
  const u = new WeakMap();
  let m = !1;
  try {
    m =
      typeof OffscreenCanvas < "u" &&
      new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {}
  function g(T, x) {
    return m ? new OffscreenCanvas(T, x) : Bs("canvas");
  }
  function v(T, x, B) {
    let $ = 1;
    const Q = wt(T);
    if (
      ((Q.width > B || Q.height > B) && ($ = B / Math.max(Q.width, Q.height)),
      $ < 1)
    )
      if (
        (typeof HTMLImageElement < "u" && T instanceof HTMLImageElement) ||
        (typeof HTMLCanvasElement < "u" && T instanceof HTMLCanvasElement) ||
        (typeof ImageBitmap < "u" && T instanceof ImageBitmap) ||
        (typeof VideoFrame < "u" && T instanceof VideoFrame)
      ) {
        const j = Math.floor($ * Q.width),
          St = Math.floor($ * Q.height);
        d === void 0 && (d = g(j, St));
        const ht = x ? g(j, St) : d;
        return (
          (ht.width = j),
          (ht.height = St),
          ht.getContext("2d").drawImage(T, 0, 0, j, St),
          console.warn(
            "THREE.WebGLRenderer: Texture has been resized from (" +
              Q.width +
              "x" +
              Q.height +
              ") to (" +
              j +
              "x" +
              St +
              ").",
          ),
          ht
        );
      } else
        return (
          "data" in T &&
            console.warn(
              "THREE.WebGLRenderer: Image in DataTexture is too big (" +
                Q.width +
                "x" +
                Q.height +
                ").",
            ),
          T
        );
    return T;
  }
  function p(T) {
    return T.generateMipmaps;
  }
  function f(T) {
    i.generateMipmap(T);
  }
  function w(T) {
    return T.isWebGLCubeRenderTarget
      ? i.TEXTURE_CUBE_MAP
      : T.isWebGL3DRenderTarget
        ? i.TEXTURE_3D
        : T.isWebGLArrayRenderTarget || T.isCompressedArrayTexture
          ? i.TEXTURE_2D_ARRAY
          : i.TEXTURE_2D;
  }
  function M(T, x, B, $, Q = !1) {
    if (T !== null) {
      if (i[T] !== void 0) return i[T];
      console.warn(
        "THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" +
          T +
          "'",
      );
    }
    let j = x;
    if (
      (x === i.RED &&
        (B === i.FLOAT && (j = i.R32F),
        B === i.HALF_FLOAT && (j = i.R16F),
        B === i.UNSIGNED_BYTE && (j = i.R8)),
      x === i.RED_INTEGER &&
        (B === i.UNSIGNED_BYTE && (j = i.R8UI),
        B === i.UNSIGNED_SHORT && (j = i.R16UI),
        B === i.UNSIGNED_INT && (j = i.R32UI),
        B === i.BYTE && (j = i.R8I),
        B === i.SHORT && (j = i.R16I),
        B === i.INT && (j = i.R32I)),
      x === i.RG &&
        (B === i.FLOAT && (j = i.RG32F),
        B === i.HALF_FLOAT && (j = i.RG16F),
        B === i.UNSIGNED_BYTE && (j = i.RG8)),
      x === i.RG_INTEGER &&
        (B === i.UNSIGNED_BYTE && (j = i.RG8UI),
        B === i.UNSIGNED_SHORT && (j = i.RG16UI),
        B === i.UNSIGNED_INT && (j = i.RG32UI),
        B === i.BYTE && (j = i.RG8I),
        B === i.SHORT && (j = i.RG16I),
        B === i.INT && (j = i.RG32I)),
      x === i.RGB_INTEGER &&
        (B === i.UNSIGNED_BYTE && (j = i.RGB8UI),
        B === i.UNSIGNED_SHORT && (j = i.RGB16UI),
        B === i.UNSIGNED_INT && (j = i.RGB32UI),
        B === i.BYTE && (j = i.RGB8I),
        B === i.SHORT && (j = i.RGB16I),
        B === i.INT && (j = i.RGB32I)),
      x === i.RGBA_INTEGER &&
        (B === i.UNSIGNED_BYTE && (j = i.RGBA8UI),
        B === i.UNSIGNED_SHORT && (j = i.RGBA16UI),
        B === i.UNSIGNED_INT && (j = i.RGBA32UI),
        B === i.BYTE && (j = i.RGBA8I),
        B === i.SHORT && (j = i.RGBA16I),
        B === i.INT && (j = i.RGBA32I)),
      x === i.RGB && B === i.UNSIGNED_INT_5_9_9_9_REV && (j = i.RGB9_E5),
      x === i.RGBA)
    ) {
      const St = Q ? Gs : Xt.getTransfer($);
      (B === i.FLOAT && (j = i.RGBA32F),
        B === i.HALF_FLOAT && (j = i.RGBA16F),
        B === i.UNSIGNED_BYTE && (j = St === Qt ? i.SRGB8_ALPHA8 : i.RGBA8),
        B === i.UNSIGNED_SHORT_4_4_4_4 && (j = i.RGBA4),
        B === i.UNSIGNED_SHORT_5_5_5_1 && (j = i.RGB5_A1));
    }
    return (
      (j === i.R16F ||
        j === i.R32F ||
        j === i.RG16F ||
        j === i.RG32F ||
        j === i.RGBA16F ||
        j === i.RGBA32F) &&
        t.get("EXT_color_buffer_float"),
      j
    );
  }
  function _(T, x) {
    let B;
    return (
      T
        ? x === null || x === Jn || x === Ci
          ? (B = i.DEPTH24_STENCIL8)
          : x === rn
            ? (B = i.DEPTH32F_STENCIL8)
            : x === Qi &&
              ((B = i.DEPTH24_STENCIL8),
              console.warn(
                "DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.",
              ))
        : x === null || x === Jn || x === Ci
          ? (B = i.DEPTH_COMPONENT24)
          : x === rn
            ? (B = i.DEPTH_COMPONENT32F)
            : x === Qi && (B = i.DEPTH_COMPONENT16),
      B
    );
  }
  function L(T, x) {
    return p(T) === !0 ||
      (T.isFramebufferTexture && T.minFilter !== ke && T.minFilter !== Ne)
      ? Math.log2(Math.max(x.width, x.height)) + 1
      : T.mipmaps !== void 0 && T.mipmaps.length > 0
        ? T.mipmaps.length
        : T.isCompressedTexture && Array.isArray(T.image)
          ? x.mipmaps.length
          : 1;
  }
  function R(T) {
    const x = T.target;
    (x.removeEventListener("dispose", R),
      C(x),
      x.isVideoTexture && h.delete(x));
  }
  function A(T) {
    const x = T.target;
    (x.removeEventListener("dispose", A), y(x));
  }
  function C(T) {
    const x = n.get(T);
    if (x.__webglInit === void 0) return;
    const B = T.source,
      $ = u.get(B);
    if ($) {
      const Q = $[x.__cacheKey];
      (Q.usedTimes--,
        Q.usedTimes === 0 && S(T),
        Object.keys($).length === 0 && u.delete(B));
    }
    n.remove(T);
  }
  function S(T) {
    const x = n.get(T);
    i.deleteTexture(x.__webglTexture);
    const B = T.source,
      $ = u.get(B);
    (delete $[x.__cacheKey], a.memory.textures--);
  }
  function y(T) {
    const x = n.get(T);
    if (
      (T.depthTexture && (T.depthTexture.dispose(), n.remove(T.depthTexture)),
      T.isWebGLCubeRenderTarget)
    )
      for (let $ = 0; $ < 6; $++) {
        if (Array.isArray(x.__webglFramebuffer[$]))
          for (let Q = 0; Q < x.__webglFramebuffer[$].length; Q++)
            i.deleteFramebuffer(x.__webglFramebuffer[$][Q]);
        else i.deleteFramebuffer(x.__webglFramebuffer[$]);
        x.__webglDepthbuffer && i.deleteRenderbuffer(x.__webglDepthbuffer[$]);
      }
    else {
      if (Array.isArray(x.__webglFramebuffer))
        for (let $ = 0; $ < x.__webglFramebuffer.length; $++)
          i.deleteFramebuffer(x.__webglFramebuffer[$]);
      else i.deleteFramebuffer(x.__webglFramebuffer);
      if (
        (x.__webglDepthbuffer && i.deleteRenderbuffer(x.__webglDepthbuffer),
        x.__webglMultisampledFramebuffer &&
          i.deleteFramebuffer(x.__webglMultisampledFramebuffer),
        x.__webglColorRenderbuffer)
      )
        for (let $ = 0; $ < x.__webglColorRenderbuffer.length; $++)
          x.__webglColorRenderbuffer[$] &&
            i.deleteRenderbuffer(x.__webglColorRenderbuffer[$]);
      x.__webglDepthRenderbuffer &&
        i.deleteRenderbuffer(x.__webglDepthRenderbuffer);
    }
    const B = T.textures;
    for (let $ = 0, Q = B.length; $ < Q; $++) {
      const j = n.get(B[$]);
      (j.__webglTexture &&
        (i.deleteTexture(j.__webglTexture), a.memory.textures--),
        n.remove(B[$]));
    }
    n.remove(T);
  }
  let P = 0;
  function z() {
    P = 0;
  }
  function U() {
    const T = P;
    return (
      T >= s.maxTextures &&
        console.warn(
          "THREE.WebGLTextures: Trying to use " +
            T +
            " texture units while this GPU supports only " +
            s.maxTextures,
        ),
      (P += 1),
      T
    );
  }
  function H(T) {
    const x = [];
    return (
      x.push(T.wrapS),
      x.push(T.wrapT),
      x.push(T.wrapR || 0),
      x.push(T.magFilter),
      x.push(T.minFilter),
      x.push(T.anisotropy),
      x.push(T.internalFormat),
      x.push(T.format),
      x.push(T.type),
      x.push(T.generateMipmaps),
      x.push(T.premultiplyAlpha),
      x.push(T.flipY),
      x.push(T.unpackAlignment),
      x.push(T.colorSpace),
      x.join()
    );
  }
  function k(T, x) {
    const B = n.get(T);
    if (
      (T.isVideoTexture && Tt(T),
      T.isRenderTargetTexture === !1 &&
        T.version > 0 &&
        B.__version !== T.version)
    ) {
      const $ = T.image;
      if ($ === null)
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but no image data found.",
        );
      else if ($.complete === !1)
        console.warn(
          "THREE.WebGLRenderer: Texture marked for update but image is incomplete",
        );
      else {
        Y(B, T, x);
        return;
      }
    }
    e.bindTexture(i.TEXTURE_2D, B.__webglTexture, i.TEXTURE0 + x);
  }
  function G(T, x) {
    const B = n.get(T);
    if (T.version > 0 && B.__version !== T.version) {
      Y(B, T, x);
      return;
    }
    e.bindTexture(i.TEXTURE_2D_ARRAY, B.__webglTexture, i.TEXTURE0 + x);
  }
  function q(T, x) {
    const B = n.get(T);
    if (T.version > 0 && B.__version !== T.version) {
      Y(B, T, x);
      return;
    }
    e.bindTexture(i.TEXTURE_3D, B.__webglTexture, i.TEXTURE0 + x);
  }
  function O(T, x) {
    const B = n.get(T);
    if (T.version > 0 && B.__version !== T.version) {
      it(B, T, x);
      return;
    }
    e.bindTexture(i.TEXTURE_CUBE_MAP, B.__webglTexture, i.TEXTURE0 + x);
  }
  const et = { [Vr]: i.REPEAT, [jn]: i.CLAMP_TO_EDGE, [Gr]: i.MIRRORED_REPEAT },
    K = {
      [ke]: i.NEAREST,
      [Mc]: i.NEAREST_MIPMAP_NEAREST,
      [rs]: i.NEAREST_MIPMAP_LINEAR,
      [Ne]: i.LINEAR,
      [js]: i.LINEAR_MIPMAP_NEAREST,
      [Kn]: i.LINEAR_MIPMAP_LINEAR,
    },
    nt = {
      [Ec]: i.NEVER,
      [Cc]: i.ALWAYS,
      [wc]: i.LESS,
      [Ml]: i.LEQUAL,
      [Tc]: i.EQUAL,
      [Rc]: i.GEQUAL,
      [bc]: i.GREATER,
      [Ac]: i.NOTEQUAL,
    };
  function _t(T, x) {
    if (
      (x.type === rn &&
        t.has("OES_texture_float_linear") === !1 &&
        (x.magFilter === Ne ||
          x.magFilter === js ||
          x.magFilter === rs ||
          x.magFilter === Kn ||
          x.minFilter === Ne ||
          x.minFilter === js ||
          x.minFilter === rs ||
          x.minFilter === Kn) &&
        console.warn(
          "THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.",
        ),
      i.texParameteri(T, i.TEXTURE_WRAP_S, et[x.wrapS]),
      i.texParameteri(T, i.TEXTURE_WRAP_T, et[x.wrapT]),
      (T === i.TEXTURE_3D || T === i.TEXTURE_2D_ARRAY) &&
        i.texParameteri(T, i.TEXTURE_WRAP_R, et[x.wrapR]),
      i.texParameteri(T, i.TEXTURE_MAG_FILTER, K[x.magFilter]),
      i.texParameteri(T, i.TEXTURE_MIN_FILTER, K[x.minFilter]),
      x.compareFunction &&
        (i.texParameteri(T, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE),
        i.texParameteri(T, i.TEXTURE_COMPARE_FUNC, nt[x.compareFunction])),
      t.has("EXT_texture_filter_anisotropic") === !0)
    ) {
      if (
        x.magFilter === ke ||
        (x.minFilter !== rs && x.minFilter !== Kn) ||
        (x.type === rn && t.has("OES_texture_float_linear") === !1)
      )
        return;
      if (x.anisotropy > 1 || n.get(x).__currentAnisotropy) {
        const B = t.get("EXT_texture_filter_anisotropic");
        (i.texParameterf(
          T,
          B.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(x.anisotropy, s.getMaxAnisotropy()),
        ),
          (n.get(x).__currentAnisotropy = x.anisotropy));
      }
    }
  }
  function Lt(T, x) {
    let B = !1;
    T.__webglInit === void 0 &&
      ((T.__webglInit = !0), x.addEventListener("dispose", R));
    const $ = x.source;
    let Q = u.get($);
    Q === void 0 && ((Q = {}), u.set($, Q));
    const j = H(x);
    if (j !== T.__cacheKey) {
      (Q[j] === void 0 &&
        ((Q[j] = { texture: i.createTexture(), usedTimes: 0 }),
        a.memory.textures++,
        (B = !0)),
        Q[j].usedTimes++);
      const St = Q[T.__cacheKey];
      (St !== void 0 &&
        (Q[T.__cacheKey].usedTimes--, St.usedTimes === 0 && S(x)),
        (T.__cacheKey = j),
        (T.__webglTexture = Q[j].texture));
    }
    return B;
  }
  function Y(T, x, B) {
    let $ = i.TEXTURE_2D;
    ((x.isDataArrayTexture || x.isCompressedArrayTexture) &&
      ($ = i.TEXTURE_2D_ARRAY),
      x.isData3DTexture && ($ = i.TEXTURE_3D));
    const Q = Lt(T, x),
      j = x.source;
    e.bindTexture($, T.__webglTexture, i.TEXTURE0 + B);
    const St = n.get(j);
    if (j.version !== St.__version || Q === !0) {
      e.activeTexture(i.TEXTURE0 + B);
      const ht = Xt.getPrimaries(Xt.workingColorSpace),
        pt = x.colorSpace === Un ? null : Xt.getPrimaries(x.colorSpace),
        qt =
          x.colorSpace === Un || ht === pt ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      (i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY),
        i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha),
        i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment),
        i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, qt));
      let st = v(x.image, !1, s.maxTextureSize);
      st = re(x, st);
      const mt = r.convert(x.format, x.colorSpace),
        bt = r.convert(x.type);
      let Rt = M(x.internalFormat, mt, bt, x.colorSpace, x.isVideoTexture);
      _t($, x);
      let gt;
      const Gt = x.mipmaps,
        Ot = x.isVideoTexture !== !0,
        ie = St.__version === void 0 || Q === !0,
        D = j.dataReady,
        lt = L(x, st);
      if (x.isDepthTexture)
        ((Rt = _(x.format === Pi, x.type)),
          ie &&
            (Ot
              ? e.texStorage2D(i.TEXTURE_2D, 1, Rt, st.width, st.height)
              : e.texImage2D(
                  i.TEXTURE_2D,
                  0,
                  Rt,
                  st.width,
                  st.height,
                  0,
                  mt,
                  bt,
                  null,
                )));
      else if (x.isDataTexture)
        if (Gt.length > 0) {
          Ot &&
            ie &&
            e.texStorage2D(i.TEXTURE_2D, lt, Rt, Gt[0].width, Gt[0].height);
          for (let X = 0, Z = Gt.length; X < Z; X++)
            ((gt = Gt[X]),
              Ot
                ? D &&
                  e.texSubImage2D(
                    i.TEXTURE_2D,
                    X,
                    0,
                    0,
                    gt.width,
                    gt.height,
                    mt,
                    bt,
                    gt.data,
                  )
                : e.texImage2D(
                    i.TEXTURE_2D,
                    X,
                    Rt,
                    gt.width,
                    gt.height,
                    0,
                    mt,
                    bt,
                    gt.data,
                  ));
          x.generateMipmaps = !1;
        } else
          Ot
            ? (ie && e.texStorage2D(i.TEXTURE_2D, lt, Rt, st.width, st.height),
              D &&
                e.texSubImage2D(
                  i.TEXTURE_2D,
                  0,
                  0,
                  0,
                  st.width,
                  st.height,
                  mt,
                  bt,
                  st.data,
                ))
            : e.texImage2D(
                i.TEXTURE_2D,
                0,
                Rt,
                st.width,
                st.height,
                0,
                mt,
                bt,
                st.data,
              );
      else if (x.isCompressedTexture)
        if (x.isCompressedArrayTexture) {
          Ot &&
            ie &&
            e.texStorage3D(
              i.TEXTURE_2D_ARRAY,
              lt,
              Rt,
              Gt[0].width,
              Gt[0].height,
              st.depth,
            );
          for (let X = 0, Z = Gt.length; X < Z; X++)
            if (((gt = Gt[X]), x.format !== tn))
              if (mt !== null)
                if (Ot) {
                  if (D)
                    if (x.layerUpdates.size > 0) {
                      const ft = Wo(gt.width, gt.height, x.format, x.type);
                      for (const ut of x.layerUpdates) {
                        const Nt = gt.data.subarray(
                          (ut * ft) / gt.data.BYTES_PER_ELEMENT,
                          ((ut + 1) * ft) / gt.data.BYTES_PER_ELEMENT,
                        );
                        e.compressedTexSubImage3D(
                          i.TEXTURE_2D_ARRAY,
                          X,
                          0,
                          0,
                          ut,
                          gt.width,
                          gt.height,
                          1,
                          mt,
                          Nt,
                        );
                      }
                      x.clearLayerUpdates();
                    } else
                      e.compressedTexSubImage3D(
                        i.TEXTURE_2D_ARRAY,
                        X,
                        0,
                        0,
                        0,
                        gt.width,
                        gt.height,
                        st.depth,
                        mt,
                        gt.data,
                      );
                } else
                  e.compressedTexImage3D(
                    i.TEXTURE_2D_ARRAY,
                    X,
                    Rt,
                    gt.width,
                    gt.height,
                    st.depth,
                    0,
                    gt.data,
                    0,
                    0,
                  );
              else
                console.warn(
                  "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()",
                );
            else
              Ot
                ? D &&
                  e.texSubImage3D(
                    i.TEXTURE_2D_ARRAY,
                    X,
                    0,
                    0,
                    0,
                    gt.width,
                    gt.height,
                    st.depth,
                    mt,
                    bt,
                    gt.data,
                  )
                : e.texImage3D(
                    i.TEXTURE_2D_ARRAY,
                    X,
                    Rt,
                    gt.width,
                    gt.height,
                    st.depth,
                    0,
                    mt,
                    bt,
                    gt.data,
                  );
        } else {
          Ot &&
            ie &&
            e.texStorage2D(i.TEXTURE_2D, lt, Rt, Gt[0].width, Gt[0].height);
          for (let X = 0, Z = Gt.length; X < Z; X++)
            ((gt = Gt[X]),
              x.format !== tn
                ? mt !== null
                  ? Ot
                    ? D &&
                      e.compressedTexSubImage2D(
                        i.TEXTURE_2D,
                        X,
                        0,
                        0,
                        gt.width,
                        gt.height,
                        mt,
                        gt.data,
                      )
                    : e.compressedTexImage2D(
                        i.TEXTURE_2D,
                        X,
                        Rt,
                        gt.width,
                        gt.height,
                        0,
                        gt.data,
                      )
                  : console.warn(
                      "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()",
                    )
                : Ot
                  ? D &&
                    e.texSubImage2D(
                      i.TEXTURE_2D,
                      X,
                      0,
                      0,
                      gt.width,
                      gt.height,
                      mt,
                      bt,
                      gt.data,
                    )
                  : e.texImage2D(
                      i.TEXTURE_2D,
                      X,
                      Rt,
                      gt.width,
                      gt.height,
                      0,
                      mt,
                      bt,
                      gt.data,
                    ));
        }
      else if (x.isDataArrayTexture)
        if (Ot) {
          if (
            (ie &&
              e.texStorage3D(
                i.TEXTURE_2D_ARRAY,
                lt,
                Rt,
                st.width,
                st.height,
                st.depth,
              ),
            D)
          )
            if (x.layerUpdates.size > 0) {
              const X = Wo(st.width, st.height, x.format, x.type);
              for (const Z of x.layerUpdates) {
                const ft = st.data.subarray(
                  (Z * X) / st.data.BYTES_PER_ELEMENT,
                  ((Z + 1) * X) / st.data.BYTES_PER_ELEMENT,
                );
                e.texSubImage3D(
                  i.TEXTURE_2D_ARRAY,
                  0,
                  0,
                  0,
                  Z,
                  st.width,
                  st.height,
                  1,
                  mt,
                  bt,
                  ft,
                );
              }
              x.clearLayerUpdates();
            } else
              e.texSubImage3D(
                i.TEXTURE_2D_ARRAY,
                0,
                0,
                0,
                0,
                st.width,
                st.height,
                st.depth,
                mt,
                bt,
                st.data,
              );
        } else
          e.texImage3D(
            i.TEXTURE_2D_ARRAY,
            0,
            Rt,
            st.width,
            st.height,
            st.depth,
            0,
            mt,
            bt,
            st.data,
          );
      else if (x.isData3DTexture)
        Ot
          ? (ie &&
              e.texStorage3D(
                i.TEXTURE_3D,
                lt,
                Rt,
                st.width,
                st.height,
                st.depth,
              ),
            D &&
              e.texSubImage3D(
                i.TEXTURE_3D,
                0,
                0,
                0,
                0,
                st.width,
                st.height,
                st.depth,
                mt,
                bt,
                st.data,
              ))
          : e.texImage3D(
              i.TEXTURE_3D,
              0,
              Rt,
              st.width,
              st.height,
              st.depth,
              0,
              mt,
              bt,
              st.data,
            );
      else if (x.isFramebufferTexture) {
        if (ie)
          if (Ot) e.texStorage2D(i.TEXTURE_2D, lt, Rt, st.width, st.height);
          else {
            let X = st.width,
              Z = st.height;
            for (let ft = 0; ft < lt; ft++)
              (e.texImage2D(i.TEXTURE_2D, ft, Rt, X, Z, 0, mt, bt, null),
                (X >>= 1),
                (Z >>= 1));
          }
      } else if (Gt.length > 0) {
        if (Ot && ie) {
          const X = wt(Gt[0]);
          e.texStorage2D(i.TEXTURE_2D, lt, Rt, X.width, X.height);
        }
        for (let X = 0, Z = Gt.length; X < Z; X++)
          ((gt = Gt[X]),
            Ot
              ? D && e.texSubImage2D(i.TEXTURE_2D, X, 0, 0, mt, bt, gt)
              : e.texImage2D(i.TEXTURE_2D, X, Rt, mt, bt, gt));
        x.generateMipmaps = !1;
      } else if (Ot) {
        if (ie) {
          const X = wt(st);
          e.texStorage2D(i.TEXTURE_2D, lt, Rt, X.width, X.height);
        }
        D && e.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, mt, bt, st);
      } else e.texImage2D(i.TEXTURE_2D, 0, Rt, mt, bt, st);
      (p(x) && f($), (St.__version = j.version), x.onUpdate && x.onUpdate(x));
    }
    T.__version = x.version;
  }
  function it(T, x, B) {
    if (x.image.length !== 6) return;
    const $ = Lt(T, x),
      Q = x.source;
    e.bindTexture(i.TEXTURE_CUBE_MAP, T.__webglTexture, i.TEXTURE0 + B);
    const j = n.get(Q);
    if (Q.version !== j.__version || $ === !0) {
      e.activeTexture(i.TEXTURE0 + B);
      const St = Xt.getPrimaries(Xt.workingColorSpace),
        ht = x.colorSpace === Un ? null : Xt.getPrimaries(x.colorSpace),
        pt =
          x.colorSpace === Un || St === ht ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      (i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, x.flipY),
        i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, x.premultiplyAlpha),
        i.pixelStorei(i.UNPACK_ALIGNMENT, x.unpackAlignment),
        i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, pt));
      const qt = x.isCompressedTexture || x.image[0].isCompressedTexture,
        st = x.image[0] && x.image[0].isDataTexture,
        mt = [];
      for (let Z = 0; Z < 6; Z++)
        (!qt && !st
          ? (mt[Z] = v(x.image[Z], !0, s.maxCubemapSize))
          : (mt[Z] = st ? x.image[Z].image : x.image[Z]),
          (mt[Z] = re(x, mt[Z])));
      const bt = mt[0],
        Rt = r.convert(x.format, x.colorSpace),
        gt = r.convert(x.type),
        Gt = M(x.internalFormat, Rt, gt, x.colorSpace),
        Ot = x.isVideoTexture !== !0,
        ie = j.__version === void 0 || $ === !0,
        D = Q.dataReady;
      let lt = L(x, bt);
      _t(i.TEXTURE_CUBE_MAP, x);
      let X;
      if (qt) {
        Ot &&
          ie &&
          e.texStorage2D(i.TEXTURE_CUBE_MAP, lt, Gt, bt.width, bt.height);
        for (let Z = 0; Z < 6; Z++) {
          X = mt[Z].mipmaps;
          for (let ft = 0; ft < X.length; ft++) {
            const ut = X[ft];
            x.format !== tn
              ? Rt !== null
                ? Ot
                  ? D &&
                    e.compressedTexSubImage2D(
                      i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                      ft,
                      0,
                      0,
                      ut.width,
                      ut.height,
                      Rt,
                      ut.data,
                    )
                  : e.compressedTexImage2D(
                      i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                      ft,
                      Gt,
                      ut.width,
                      ut.height,
                      0,
                      ut.data,
                    )
                : console.warn(
                    "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()",
                  )
              : Ot
                ? D &&
                  e.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                    ft,
                    0,
                    0,
                    ut.width,
                    ut.height,
                    Rt,
                    gt,
                    ut.data,
                  )
                : e.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                    ft,
                    Gt,
                    ut.width,
                    ut.height,
                    0,
                    Rt,
                    gt,
                    ut.data,
                  );
          }
        }
      } else {
        if (((X = x.mipmaps), Ot && ie)) {
          X.length > 0 && lt++;
          const Z = wt(mt[0]);
          e.texStorage2D(i.TEXTURE_CUBE_MAP, lt, Gt, Z.width, Z.height);
        }
        for (let Z = 0; Z < 6; Z++)
          if (st) {
            Ot
              ? D &&
                e.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                  0,
                  0,
                  0,
                  mt[Z].width,
                  mt[Z].height,
                  Rt,
                  gt,
                  mt[Z].data,
                )
              : e.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                  0,
                  Gt,
                  mt[Z].width,
                  mt[Z].height,
                  0,
                  Rt,
                  gt,
                  mt[Z].data,
                );
            for (let ft = 0; ft < X.length; ft++) {
              const Nt = X[ft].image[Z].image;
              Ot
                ? D &&
                  e.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                    ft + 1,
                    0,
                    0,
                    Nt.width,
                    Nt.height,
                    Rt,
                    gt,
                    Nt.data,
                  )
                : e.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                    ft + 1,
                    Gt,
                    Nt.width,
                    Nt.height,
                    0,
                    Rt,
                    gt,
                    Nt.data,
                  );
            }
          } else {
            Ot
              ? D &&
                e.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                  0,
                  0,
                  0,
                  Rt,
                  gt,
                  mt[Z],
                )
              : e.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                  0,
                  Gt,
                  Rt,
                  gt,
                  mt[Z],
                );
            for (let ft = 0; ft < X.length; ft++) {
              const ut = X[ft];
              Ot
                ? D &&
                  e.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                    ft + 1,
                    0,
                    0,
                    Rt,
                    gt,
                    ut.image[Z],
                  )
                : e.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + Z,
                    ft + 1,
                    Gt,
                    Rt,
                    gt,
                    ut.image[Z],
                  );
            }
          }
      }
      (p(x) && f(i.TEXTURE_CUBE_MAP),
        (j.__version = Q.version),
        x.onUpdate && x.onUpdate(x));
    }
    T.__version = x.version;
  }
  function vt(T, x, B, $, Q, j) {
    const St = r.convert(B.format, B.colorSpace),
      ht = r.convert(B.type),
      pt = M(B.internalFormat, St, ht, B.colorSpace),
      qt = n.get(x),
      st = n.get(B);
    if (((st.__renderTarget = x), !qt.__hasExternalTextures)) {
      const mt = Math.max(1, x.width >> j),
        bt = Math.max(1, x.height >> j);
      Q === i.TEXTURE_3D || Q === i.TEXTURE_2D_ARRAY
        ? e.texImage3D(Q, j, pt, mt, bt, x.depth, 0, St, ht, null)
        : e.texImage2D(Q, j, pt, mt, bt, 0, St, ht, null);
    }
    (e.bindFramebuffer(i.FRAMEBUFFER, T),
      Vt(x)
        ? l.framebufferTexture2DMultisampleEXT(
            i.FRAMEBUFFER,
            $,
            Q,
            st.__webglTexture,
            0,
            Ht(x),
          )
        : (Q === i.TEXTURE_2D ||
            (Q >= i.TEXTURE_CUBE_MAP_POSITIVE_X &&
              Q <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z)) &&
          i.framebufferTexture2D(i.FRAMEBUFFER, $, Q, st.__webglTexture, j),
      e.bindFramebuffer(i.FRAMEBUFFER, null));
  }
  function ct(T, x, B) {
    if ((i.bindRenderbuffer(i.RENDERBUFFER, T), x.depthBuffer)) {
      const $ = x.depthTexture,
        Q = $ && $.isDepthTexture ? $.type : null,
        j = _(x.stencilBuffer, Q),
        St = x.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT,
        ht = Ht(x);
      (Vt(x)
        ? l.renderbufferStorageMultisampleEXT(
            i.RENDERBUFFER,
            ht,
            j,
            x.width,
            x.height,
          )
        : B
          ? i.renderbufferStorageMultisample(
              i.RENDERBUFFER,
              ht,
              j,
              x.width,
              x.height,
            )
          : i.renderbufferStorage(i.RENDERBUFFER, j, x.width, x.height),
        i.framebufferRenderbuffer(i.FRAMEBUFFER, St, i.RENDERBUFFER, T));
    } else {
      const $ = x.textures;
      for (let Q = 0; Q < $.length; Q++) {
        const j = $[Q],
          St = r.convert(j.format, j.colorSpace),
          ht = r.convert(j.type),
          pt = M(j.internalFormat, St, ht, j.colorSpace),
          qt = Ht(x);
        B && Vt(x) === !1
          ? i.renderbufferStorageMultisample(
              i.RENDERBUFFER,
              qt,
              pt,
              x.width,
              x.height,
            )
          : Vt(x)
            ? l.renderbufferStorageMultisampleEXT(
                i.RENDERBUFFER,
                qt,
                pt,
                x.width,
                x.height,
              )
            : i.renderbufferStorage(i.RENDERBUFFER, pt, x.width, x.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function At(T, x) {
    if (x && x.isWebGLCubeRenderTarget)
      throw new Error(
        "Depth Texture with cube render targets is not supported",
      );
    if (
      (e.bindFramebuffer(i.FRAMEBUFFER, T),
      !(x.depthTexture && x.depthTexture.isDepthTexture))
    )
      throw new Error(
        "renderTarget.depthTexture must be an instance of THREE.DepthTexture",
      );
    const $ = n.get(x.depthTexture);
    (($.__renderTarget = x),
      (!$.__webglTexture ||
        x.depthTexture.image.width !== x.width ||
        x.depthTexture.image.height !== x.height) &&
        ((x.depthTexture.image.width = x.width),
        (x.depthTexture.image.height = x.height),
        (x.depthTexture.needsUpdate = !0)),
      k(x.depthTexture, 0));
    const Q = $.__webglTexture,
      j = Ht(x);
    if (x.depthTexture.format === wi)
      Vt(x)
        ? l.framebufferTexture2DMultisampleEXT(
            i.FRAMEBUFFER,
            i.DEPTH_ATTACHMENT,
            i.TEXTURE_2D,
            Q,
            0,
            j,
          )
        : i.framebufferTexture2D(
            i.FRAMEBUFFER,
            i.DEPTH_ATTACHMENT,
            i.TEXTURE_2D,
            Q,
            0,
          );
    else if (x.depthTexture.format === Pi)
      Vt(x)
        ? l.framebufferTexture2DMultisampleEXT(
            i.FRAMEBUFFER,
            i.DEPTH_STENCIL_ATTACHMENT,
            i.TEXTURE_2D,
            Q,
            0,
            j,
          )
        : i.framebufferTexture2D(
            i.FRAMEBUFFER,
            i.DEPTH_STENCIL_ATTACHMENT,
            i.TEXTURE_2D,
            Q,
            0,
          );
    else throw new Error("Unknown depthTexture format");
  }
  function Dt(T) {
    const x = n.get(T),
      B = T.isWebGLCubeRenderTarget === !0;
    if (x.__boundDepthTexture !== T.depthTexture) {
      const $ = T.depthTexture;
      if ((x.__depthDisposeCallback && x.__depthDisposeCallback(), $)) {
        const Q = () => {
          (delete x.__boundDepthTexture,
            delete x.__depthDisposeCallback,
            $.removeEventListener("dispose", Q));
        };
        ($.addEventListener("dispose", Q), (x.__depthDisposeCallback = Q));
      }
      x.__boundDepthTexture = $;
    }
    if (T.depthTexture && !x.__autoAllocateDepthBuffer) {
      if (B)
        throw new Error(
          "target.depthTexture not supported in Cube render targets",
        );
      At(x.__webglFramebuffer, T);
    } else if (B) {
      x.__webglDepthbuffer = [];
      for (let $ = 0; $ < 6; $++)
        if (
          (e.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer[$]),
          x.__webglDepthbuffer[$] === void 0)
        )
          ((x.__webglDepthbuffer[$] = i.createRenderbuffer()),
            ct(x.__webglDepthbuffer[$], T, !1));
        else {
          const Q = T.stencilBuffer
              ? i.DEPTH_STENCIL_ATTACHMENT
              : i.DEPTH_ATTACHMENT,
            j = x.__webglDepthbuffer[$];
          (i.bindRenderbuffer(i.RENDERBUFFER, j),
            i.framebufferRenderbuffer(i.FRAMEBUFFER, Q, i.RENDERBUFFER, j));
        }
    } else if (
      (e.bindFramebuffer(i.FRAMEBUFFER, x.__webglFramebuffer),
      x.__webglDepthbuffer === void 0)
    )
      ((x.__webglDepthbuffer = i.createRenderbuffer()),
        ct(x.__webglDepthbuffer, T, !1));
    else {
      const $ = T.stencilBuffer
          ? i.DEPTH_STENCIL_ATTACHMENT
          : i.DEPTH_ATTACHMENT,
        Q = x.__webglDepthbuffer;
      (i.bindRenderbuffer(i.RENDERBUFFER, Q),
        i.framebufferRenderbuffer(i.FRAMEBUFFER, $, i.RENDERBUFFER, Q));
    }
    e.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function kt(T, x, B) {
    const $ = n.get(T);
    (x !== void 0 &&
      vt(
        $.__webglFramebuffer,
        T,
        T.texture,
        i.COLOR_ATTACHMENT0,
        i.TEXTURE_2D,
        0,
      ),
      B !== void 0 && Dt(T));
  }
  function ce(T) {
    const x = T.texture,
      B = n.get(T),
      $ = n.get(x);
    T.addEventListener("dispose", A);
    const Q = T.textures,
      j = T.isWebGLCubeRenderTarget === !0,
      St = Q.length > 1;
    if (
      (St ||
        ($.__webglTexture === void 0 && ($.__webglTexture = i.createTexture()),
        ($.__version = x.version),
        a.memory.textures++),
      j)
    ) {
      B.__webglFramebuffer = [];
      for (let ht = 0; ht < 6; ht++)
        if (x.mipmaps && x.mipmaps.length > 0) {
          B.__webglFramebuffer[ht] = [];
          for (let pt = 0; pt < x.mipmaps.length; pt++)
            B.__webglFramebuffer[ht][pt] = i.createFramebuffer();
        } else B.__webglFramebuffer[ht] = i.createFramebuffer();
    } else {
      if (x.mipmaps && x.mipmaps.length > 0) {
        B.__webglFramebuffer = [];
        for (let ht = 0; ht < x.mipmaps.length; ht++)
          B.__webglFramebuffer[ht] = i.createFramebuffer();
      } else B.__webglFramebuffer = i.createFramebuffer();
      if (St)
        for (let ht = 0, pt = Q.length; ht < pt; ht++) {
          const qt = n.get(Q[ht]);
          qt.__webglTexture === void 0 &&
            ((qt.__webglTexture = i.createTexture()), a.memory.textures++);
        }
      if (T.samples > 0 && Vt(T) === !1) {
        ((B.__webglMultisampledFramebuffer = i.createFramebuffer()),
          (B.__webglColorRenderbuffer = []),
          e.bindFramebuffer(i.FRAMEBUFFER, B.__webglMultisampledFramebuffer));
        for (let ht = 0; ht < Q.length; ht++) {
          const pt = Q[ht];
          ((B.__webglColorRenderbuffer[ht] = i.createRenderbuffer()),
            i.bindRenderbuffer(i.RENDERBUFFER, B.__webglColorRenderbuffer[ht]));
          const qt = r.convert(pt.format, pt.colorSpace),
            st = r.convert(pt.type),
            mt = M(
              pt.internalFormat,
              qt,
              st,
              pt.colorSpace,
              T.isXRRenderTarget === !0,
            ),
            bt = Ht(T);
          (i.renderbufferStorageMultisample(
            i.RENDERBUFFER,
            bt,
            mt,
            T.width,
            T.height,
          ),
            i.framebufferRenderbuffer(
              i.FRAMEBUFFER,
              i.COLOR_ATTACHMENT0 + ht,
              i.RENDERBUFFER,
              B.__webglColorRenderbuffer[ht],
            ));
        }
        (i.bindRenderbuffer(i.RENDERBUFFER, null),
          T.depthBuffer &&
            ((B.__webglDepthRenderbuffer = i.createRenderbuffer()),
            ct(B.__webglDepthRenderbuffer, T, !0)),
          e.bindFramebuffer(i.FRAMEBUFFER, null));
      }
    }
    if (j) {
      (e.bindTexture(i.TEXTURE_CUBE_MAP, $.__webglTexture),
        _t(i.TEXTURE_CUBE_MAP, x));
      for (let ht = 0; ht < 6; ht++)
        if (x.mipmaps && x.mipmaps.length > 0)
          for (let pt = 0; pt < x.mipmaps.length; pt++)
            vt(
              B.__webglFramebuffer[ht][pt],
              T,
              x,
              i.COLOR_ATTACHMENT0,
              i.TEXTURE_CUBE_MAP_POSITIVE_X + ht,
              pt,
            );
        else
          vt(
            B.__webglFramebuffer[ht],
            T,
            x,
            i.COLOR_ATTACHMENT0,
            i.TEXTURE_CUBE_MAP_POSITIVE_X + ht,
            0,
          );
      (p(x) && f(i.TEXTURE_CUBE_MAP), e.unbindTexture());
    } else if (St) {
      for (let ht = 0, pt = Q.length; ht < pt; ht++) {
        const qt = Q[ht],
          st = n.get(qt);
        (e.bindTexture(i.TEXTURE_2D, st.__webglTexture),
          _t(i.TEXTURE_2D, qt),
          vt(
            B.__webglFramebuffer,
            T,
            qt,
            i.COLOR_ATTACHMENT0 + ht,
            i.TEXTURE_2D,
            0,
          ),
          p(qt) && f(i.TEXTURE_2D));
      }
      e.unbindTexture();
    } else {
      let ht = i.TEXTURE_2D;
      if (
        ((T.isWebGL3DRenderTarget || T.isWebGLArrayRenderTarget) &&
          (ht = T.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
        e.bindTexture(ht, $.__webglTexture),
        _t(ht, x),
        x.mipmaps && x.mipmaps.length > 0)
      )
        for (let pt = 0; pt < x.mipmaps.length; pt++)
          vt(B.__webglFramebuffer[pt], T, x, i.COLOR_ATTACHMENT0, ht, pt);
      else vt(B.__webglFramebuffer, T, x, i.COLOR_ATTACHMENT0, ht, 0);
      (p(x) && f(ht), e.unbindTexture());
    }
    T.depthBuffer && Dt(T);
  }
  function Wt(T) {
    const x = T.textures;
    for (let B = 0, $ = x.length; B < $; B++) {
      const Q = x[B];
      if (p(Q)) {
        const j = w(T),
          St = n.get(Q).__webglTexture;
        (e.bindTexture(j, St), f(j), e.unbindTexture());
      }
    }
  }
  const de = [],
    F = [];
  function Ve(T) {
    if (T.samples > 0) {
      if (Vt(T) === !1) {
        const x = T.textures,
          B = T.width,
          $ = T.height;
        let Q = i.COLOR_BUFFER_BIT;
        const j = T.stencilBuffer
            ? i.DEPTH_STENCIL_ATTACHMENT
            : i.DEPTH_ATTACHMENT,
          St = n.get(T),
          ht = x.length > 1;
        if (ht)
          for (let pt = 0; pt < x.length; pt++)
            (e.bindFramebuffer(
              i.FRAMEBUFFER,
              St.__webglMultisampledFramebuffer,
            ),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + pt,
                i.RENDERBUFFER,
                null,
              ),
              e.bindFramebuffer(i.FRAMEBUFFER, St.__webglFramebuffer),
              i.framebufferTexture2D(
                i.DRAW_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + pt,
                i.TEXTURE_2D,
                null,
                0,
              ));
        (e.bindFramebuffer(
          i.READ_FRAMEBUFFER,
          St.__webglMultisampledFramebuffer,
        ),
          e.bindFramebuffer(i.DRAW_FRAMEBUFFER, St.__webglFramebuffer));
        for (let pt = 0; pt < x.length; pt++) {
          if (
            (T.resolveDepthBuffer &&
              (T.depthBuffer && (Q |= i.DEPTH_BUFFER_BIT),
              T.stencilBuffer &&
                T.resolveStencilBuffer &&
                (Q |= i.STENCIL_BUFFER_BIT)),
            ht)
          ) {
            i.framebufferRenderbuffer(
              i.READ_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0,
              i.RENDERBUFFER,
              St.__webglColorRenderbuffer[pt],
            );
            const qt = n.get(x[pt]).__webglTexture;
            i.framebufferTexture2D(
              i.DRAW_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0,
              i.TEXTURE_2D,
              qt,
              0,
            );
          }
          (i.blitFramebuffer(0, 0, B, $, 0, 0, B, $, Q, i.NEAREST),
            o === !0 &&
              ((de.length = 0),
              (F.length = 0),
              de.push(i.COLOR_ATTACHMENT0 + pt),
              T.depthBuffer &&
                T.resolveDepthBuffer === !1 &&
                (de.push(j),
                F.push(j),
                i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, F)),
              i.invalidateFramebuffer(i.READ_FRAMEBUFFER, de)));
        }
        if (
          (e.bindFramebuffer(i.READ_FRAMEBUFFER, null),
          e.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
          ht)
        )
          for (let pt = 0; pt < x.length; pt++) {
            (e.bindFramebuffer(
              i.FRAMEBUFFER,
              St.__webglMultisampledFramebuffer,
            ),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + pt,
                i.RENDERBUFFER,
                St.__webglColorRenderbuffer[pt],
              ));
            const qt = n.get(x[pt]).__webglTexture;
            (e.bindFramebuffer(i.FRAMEBUFFER, St.__webglFramebuffer),
              i.framebufferTexture2D(
                i.DRAW_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + pt,
                i.TEXTURE_2D,
                qt,
                0,
              ));
          }
        e.bindFramebuffer(
          i.DRAW_FRAMEBUFFER,
          St.__webglMultisampledFramebuffer,
        );
      } else if (T.depthBuffer && T.resolveDepthBuffer === !1 && o) {
        const x = T.stencilBuffer
          ? i.DEPTH_STENCIL_ATTACHMENT
          : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [x]);
      }
    }
  }
  function Ht(T) {
    return Math.min(s.maxSamples, T.samples);
  }
  function Vt(T) {
    const x = n.get(T);
    return (
      T.samples > 0 &&
      t.has("WEBGL_multisampled_render_to_texture") === !0 &&
      x.__useRenderToTexture !== !1
    );
  }
  function Tt(T) {
    const x = a.render.frame;
    h.get(T) !== x && (h.set(T, x), T.update());
  }
  function re(T, x) {
    const B = T.colorSpace,
      $ = T.format,
      Q = T.type;
    return (
      T.isCompressedTexture === !0 ||
        T.isVideoTexture === !0 ||
        (B !== Ui &&
          B !== Un &&
          (Xt.getTransfer(B) === Qt
            ? ($ !== tn || Q !== yn) &&
              console.warn(
                "THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.",
              )
            : console.error(
                "THREE.WebGLTextures: Unsupported texture color space:",
                B,
              ))),
      x
    );
  }
  function wt(T) {
    return (
      typeof HTMLImageElement < "u" && T instanceof HTMLImageElement
        ? ((c.width = T.naturalWidth || T.width),
          (c.height = T.naturalHeight || T.height))
        : typeof VideoFrame < "u" && T instanceof VideoFrame
          ? ((c.width = T.displayWidth), (c.height = T.displayHeight))
          : ((c.width = T.width), (c.height = T.height)),
      c
    );
  }
  ((this.allocateTextureUnit = U),
    (this.resetTextureUnits = z),
    (this.setTexture2D = k),
    (this.setTexture2DArray = G),
    (this.setTexture3D = q),
    (this.setTextureCube = O),
    (this.rebindTextures = kt),
    (this.setupRenderTarget = ce),
    (this.updateRenderTargetMipmap = Wt),
    (this.updateMultisampleRenderTarget = Ve),
    (this.setupDepthRenderbuffer = Dt),
    (this.setupFrameBufferTexture = vt),
    (this.useMultisampledRTT = Vt));
}
function Kp(i, t) {
  function e(n, s = Un) {
    let r;
    const a = Xt.getTransfer(s);
    if (n === yn) return i.UNSIGNED_BYTE;
    if (n === Ea) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === wa) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === ul) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === cl) return i.BYTE;
    if (n === hl) return i.SHORT;
    if (n === Qi) return i.UNSIGNED_SHORT;
    if (n === Sa) return i.INT;
    if (n === Jn) return i.UNSIGNED_INT;
    if (n === rn) return i.FLOAT;
    if (n === Qn) return i.HALF_FLOAT;
    if (n === dl) return i.ALPHA;
    if (n === fl) return i.RGB;
    if (n === tn) return i.RGBA;
    if (n === pl) return i.LUMINANCE;
    if (n === ml) return i.LUMINANCE_ALPHA;
    if (n === wi) return i.DEPTH_COMPONENT;
    if (n === Pi) return i.DEPTH_STENCIL;
    if (n === Ta) return i.RED;
    if (n === ba) return i.RED_INTEGER;
    if (n === gl) return i.RG;
    if (n === Aa) return i.RG_INTEGER;
    if (n === Ra) return i.RGBA_INTEGER;
    if (n === Ls || n === Ds || n === Us || n === Is)
      if (a === Qt)
        if (((r = t.get("WEBGL_compressed_texture_s3tc_srgb")), r !== null)) {
          if (n === Ls) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === Ds) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === Us) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Is) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else return null;
      else if (((r = t.get("WEBGL_compressed_texture_s3tc")), r !== null)) {
        if (n === Ls) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === Ds) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === Us) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Is) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
    if (n === Wr || n === qr || n === Xr || n === Yr)
      if (((r = t.get("WEBGL_compressed_texture_pvrtc")), r !== null)) {
        if (n === Wr) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === qr) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === Xr) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === Yr) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
    if (n === jr || n === Kr || n === $r)
      if (((r = t.get("WEBGL_compressed_texture_etc")), r !== null)) {
        if (n === jr || n === Kr)
          return a === Qt ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === $r)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
            : r.COMPRESSED_RGBA8_ETC2_EAC;
      } else return null;
    if (
      n === Zr ||
      n === Jr ||
      n === Qr ||
      n === ta ||
      n === ea ||
      n === na ||
      n === ia ||
      n === sa ||
      n === ra ||
      n === aa ||
      n === oa ||
      n === la ||
      n === ca ||
      n === ha
    )
      if (((r = t.get("WEBGL_compressed_texture_astc")), r !== null)) {
        if (n === Zr)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
            : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === Jr)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
            : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === Qr)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
            : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === ta)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
            : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === ea)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
            : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === na)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
            : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === ia)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
            : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === sa)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
            : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === ra)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
            : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === aa)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
            : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === oa)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
            : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === la)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
            : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === ca)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
            : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === ha)
          return a === Qt
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
            : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
    if (n === Ns || n === ua || n === da)
      if (((r = t.get("EXT_texture_compression_bptc")), r !== null)) {
        if (n === Ns)
          return a === Qt
            ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
            : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === ua) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === da) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
    if (n === vl || n === fa || n === pa || n === ma)
      if (((r = t.get("EXT_texture_compression_rgtc")), r !== null)) {
        if (n === Ns) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === fa) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === pa) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === ma) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
    return n === Ci ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: e };
}
class $p extends Ue {
  constructor(t = []) {
    (super(), (this.isArrayCamera = !0), (this.cameras = t));
  }
}
class xe extends ne {
  constructor() {
    (super(), (this.isGroup = !0), (this.type = "Group"));
  }
}
const Zp = { type: "move" };
class yr {
  constructor() {
    ((this._targetRay = null), (this._grip = null), (this._hand = null));
  }
  getHandSpace() {
    return (
      this._hand === null &&
        ((this._hand = new xe()),
        (this._hand.matrixAutoUpdate = !1),
        (this._hand.visible = !1),
        (this._hand.joints = {}),
        (this._hand.inputState = { pinching: !1 })),
      this._hand
    );
  }
  getTargetRaySpace() {
    return (
      this._targetRay === null &&
        ((this._targetRay = new xe()),
        (this._targetRay.matrixAutoUpdate = !1),
        (this._targetRay.visible = !1),
        (this._targetRay.hasLinearVelocity = !1),
        (this._targetRay.linearVelocity = new b()),
        (this._targetRay.hasAngularVelocity = !1),
        (this._targetRay.angularVelocity = new b())),
      this._targetRay
    );
  }
  getGripSpace() {
    return (
      this._grip === null &&
        ((this._grip = new xe()),
        (this._grip.matrixAutoUpdate = !1),
        (this._grip.visible = !1),
        (this._grip.hasLinearVelocity = !1),
        (this._grip.linearVelocity = new b()),
        (this._grip.hasAngularVelocity = !1),
        (this._grip.angularVelocity = new b())),
      this._grip
    );
  }
  dispatchEvent(t) {
    return (
      this._targetRay !== null && this._targetRay.dispatchEvent(t),
      this._grip !== null && this._grip.dispatchEvent(t),
      this._hand !== null && this._hand.dispatchEvent(t),
      this
    );
  }
  connect(t) {
    if (t && t.hand) {
      const e = this._hand;
      if (e) for (const n of t.hand.values()) this._getHandJoint(e, n);
    }
    return (this.dispatchEvent({ type: "connected", data: t }), this);
  }
  disconnect(t) {
    return (
      this.dispatchEvent({ type: "disconnected", data: t }),
      this._targetRay !== null && (this._targetRay.visible = !1),
      this._grip !== null && (this._grip.visible = !1),
      this._hand !== null && (this._hand.visible = !1),
      this
    );
  }
  update(t, e, n) {
    let s = null,
      r = null,
      a = null;
    const l = this._targetRay,
      o = this._grip,
      c = this._hand;
    if (t && e.session.visibilityState !== "visible-blurred") {
      if (c && t.hand) {
        a = !0;
        for (const v of t.hand.values()) {
          const p = e.getJointPose(v, n),
            f = this._getHandJoint(c, v);
          (p !== null &&
            (f.matrix.fromArray(p.transform.matrix),
            f.matrix.decompose(f.position, f.rotation, f.scale),
            (f.matrixWorldNeedsUpdate = !0),
            (f.jointRadius = p.radius)),
            (f.visible = p !== null));
        }
        const h = c.joints["index-finger-tip"],
          d = c.joints["thumb-tip"],
          u = h.position.distanceTo(d.position),
          m = 0.02,
          g = 0.005;
        c.inputState.pinching && u > m + g
          ? ((c.inputState.pinching = !1),
            this.dispatchEvent({
              type: "pinchend",
              handedness: t.handedness,
              target: this,
            }))
          : !c.inputState.pinching &&
            u <= m - g &&
            ((c.inputState.pinching = !0),
            this.dispatchEvent({
              type: "pinchstart",
              handedness: t.handedness,
              target: this,
            }));
      } else
        o !== null &&
          t.gripSpace &&
          ((r = e.getPose(t.gripSpace, n)),
          r !== null &&
            (o.matrix.fromArray(r.transform.matrix),
            o.matrix.decompose(o.position, o.rotation, o.scale),
            (o.matrixWorldNeedsUpdate = !0),
            r.linearVelocity
              ? ((o.hasLinearVelocity = !0),
                o.linearVelocity.copy(r.linearVelocity))
              : (o.hasLinearVelocity = !1),
            r.angularVelocity
              ? ((o.hasAngularVelocity = !0),
                o.angularVelocity.copy(r.angularVelocity))
              : (o.hasAngularVelocity = !1)));
      l !== null &&
        ((s = e.getPose(t.targetRaySpace, n)),
        s === null && r !== null && (s = r),
        s !== null &&
          (l.matrix.fromArray(s.transform.matrix),
          l.matrix.decompose(l.position, l.rotation, l.scale),
          (l.matrixWorldNeedsUpdate = !0),
          s.linearVelocity
            ? ((l.hasLinearVelocity = !0),
              l.linearVelocity.copy(s.linearVelocity))
            : (l.hasLinearVelocity = !1),
          s.angularVelocity
            ? ((l.hasAngularVelocity = !0),
              l.angularVelocity.copy(s.angularVelocity))
            : (l.hasAngularVelocity = !1),
          this.dispatchEvent(Zp)));
    }
    return (
      l !== null && (l.visible = s !== null),
      o !== null && (o.visible = r !== null),
      c !== null && (c.visible = a !== null),
      this
    );
  }
  _getHandJoint(t, e) {
    if (t.joints[e.jointName] === void 0) {
      const n = new xe();
      ((n.matrixAutoUpdate = !1),
        (n.visible = !1),
        (t.joints[e.jointName] = n),
        t.add(n));
    }
    return t.joints[e.jointName];
  }
}
const Jp = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`,
  Qp = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;
class t0 {
  constructor() {
    ((this.texture = null),
      (this.mesh = null),
      (this.depthNear = 0),
      (this.depthFar = 0));
  }
  init(t, e, n) {
    if (this.texture === null) {
      const s = new Pe(),
        r = t.properties.get(s);
      ((r.__webglTexture = e.texture),
        (e.depthNear != n.depthNear || e.depthFar != n.depthFar) &&
          ((this.depthNear = e.depthNear), (this.depthFar = e.depthFar)),
        (this.texture = s));
    }
  }
  getMesh(t) {
    if (this.texture !== null && this.mesh === null) {
      const e = t.cameras[0].viewport,
        n = new pe({
          vertexShader: Jp,
          fragmentShader: Qp,
          uniforms: {
            depthColor: { value: this.texture },
            depthWidth: { value: e.z },
            depthHeight: { value: e.w },
          },
        });
      this.mesh = new Ut(new He(20, 20), n);
    }
    return this.mesh;
  }
  reset() {
    ((this.texture = null), (this.mesh = null));
  }
  getDepthTexture() {
    return this.texture;
  }
}
class e0 extends Ii {
  constructor(t, e) {
    super();
    const n = this;
    let s = null,
      r = 1,
      a = null,
      l = "local-floor",
      o = 1,
      c = null,
      h = null,
      d = null,
      u = null,
      m = null,
      g = null;
    const v = new t0(),
      p = e.getContextAttributes();
    let f = null,
      w = null;
    const M = [],
      _ = [],
      L = new It();
    let R = null;
    const A = new Ue();
    A.viewport = new ee();
    const C = new Ue();
    C.viewport = new ee();
    const S = [A, C],
      y = new $p();
    let P = null,
      z = null;
    ((this.cameraAutoUpdate = !0),
      (this.enabled = !1),
      (this.isPresenting = !1),
      (this.getController = function (Y) {
        let it = M[Y];
        return (
          it === void 0 && ((it = new yr()), (M[Y] = it)),
          it.getTargetRaySpace()
        );
      }),
      (this.getControllerGrip = function (Y) {
        let it = M[Y];
        return (
          it === void 0 && ((it = new yr()), (M[Y] = it)),
          it.getGripSpace()
        );
      }),
      (this.getHand = function (Y) {
        let it = M[Y];
        return (
          it === void 0 && ((it = new yr()), (M[Y] = it)),
          it.getHandSpace()
        );
      }));
    function U(Y) {
      const it = _.indexOf(Y.inputSource);
      if (it === -1) return;
      const vt = M[it];
      vt !== void 0 &&
        (vt.update(Y.inputSource, Y.frame, c || a),
        vt.dispatchEvent({ type: Y.type, data: Y.inputSource }));
    }
    function H() {
      (s.removeEventListener("select", U),
        s.removeEventListener("selectstart", U),
        s.removeEventListener("selectend", U),
        s.removeEventListener("squeeze", U),
        s.removeEventListener("squeezestart", U),
        s.removeEventListener("squeezeend", U),
        s.removeEventListener("end", H),
        s.removeEventListener("inputsourceschange", k));
      for (let Y = 0; Y < M.length; Y++) {
        const it = _[Y];
        it !== null && ((_[Y] = null), M[Y].disconnect(it));
      }
      ((P = null),
        (z = null),
        v.reset(),
        t.setRenderTarget(f),
        (m = null),
        (u = null),
        (d = null),
        (s = null),
        (w = null),
        Lt.stop(),
        (n.isPresenting = !1),
        t.setPixelRatio(R),
        t.setSize(L.width, L.height, !1),
        n.dispatchEvent({ type: "sessionend" }));
    }
    ((this.setFramebufferScaleFactor = function (Y) {
      ((r = Y),
        n.isPresenting === !0 &&
          console.warn(
            "THREE.WebXRManager: Cannot change framebuffer scale while presenting.",
          ));
    }),
      (this.setReferenceSpaceType = function (Y) {
        ((l = Y),
          n.isPresenting === !0 &&
            console.warn(
              "THREE.WebXRManager: Cannot change reference space type while presenting.",
            ));
      }),
      (this.getReferenceSpace = function () {
        return c || a;
      }),
      (this.setReferenceSpace = function (Y) {
        c = Y;
      }),
      (this.getBaseLayer = function () {
        return u !== null ? u : m;
      }),
      (this.getBinding = function () {
        return d;
      }),
      (this.getFrame = function () {
        return g;
      }),
      (this.getSession = function () {
        return s;
      }),
      (this.setSession = async function (Y) {
        if (((s = Y), s !== null)) {
          if (
            ((f = t.getRenderTarget()),
            s.addEventListener("select", U),
            s.addEventListener("selectstart", U),
            s.addEventListener("selectend", U),
            s.addEventListener("squeeze", U),
            s.addEventListener("squeezestart", U),
            s.addEventListener("squeezeend", U),
            s.addEventListener("end", H),
            s.addEventListener("inputsourceschange", k),
            p.xrCompatible !== !0 && (await e.makeXRCompatible()),
            (R = t.getPixelRatio()),
            t.getSize(L),
            s.renderState.layers === void 0)
          ) {
            const it = {
              antialias: p.antialias,
              alpha: !0,
              depth: p.depth,
              stencil: p.stencil,
              framebufferScaleFactor: r,
            };
            ((m = new XRWebGLLayer(s, e, it)),
              s.updateRenderState({ baseLayer: m }),
              t.setPixelRatio(1),
              t.setSize(m.framebufferWidth, m.framebufferHeight, !1),
              (w = new Sn(m.framebufferWidth, m.framebufferHeight, {
                format: tn,
                type: yn,
                colorSpace: t.outputColorSpace,
                stencilBuffer: p.stencil,
              })));
          } else {
            let it = null,
              vt = null,
              ct = null;
            p.depth &&
              ((ct = p.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24),
              (it = p.stencil ? Pi : wi),
              (vt = p.stencil ? Ci : Jn));
            const At = {
              colorFormat: e.RGBA8,
              depthFormat: ct,
              scaleFactor: r,
            };
            ((d = new XRWebGLBinding(s, e)),
              (u = d.createProjectionLayer(At)),
              s.updateRenderState({ layers: [u] }),
              t.setPixelRatio(1),
              t.setSize(u.textureWidth, u.textureHeight, !1),
              (w = new Sn(u.textureWidth, u.textureHeight, {
                format: tn,
                type: yn,
                depthTexture: new Dl(
                  u.textureWidth,
                  u.textureHeight,
                  vt,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  void 0,
                  it,
                ),
                stencilBuffer: p.stencil,
                colorSpace: t.outputColorSpace,
                samples: p.antialias ? 4 : 0,
                resolveDepthBuffer: u.ignoreDepthValues === !1,
              })));
          }
          ((w.isXRRenderTarget = !0),
            this.setFoveation(o),
            (c = null),
            (a = await s.requestReferenceSpace(l)),
            Lt.setContext(s),
            Lt.start(),
            (n.isPresenting = !0),
            n.dispatchEvent({ type: "sessionstart" }));
        }
      }),
      (this.getEnvironmentBlendMode = function () {
        if (s !== null) return s.environmentBlendMode;
      }),
      (this.getDepthTexture = function () {
        return v.getDepthTexture();
      }));
    function k(Y) {
      for (let it = 0; it < Y.removed.length; it++) {
        const vt = Y.removed[it],
          ct = _.indexOf(vt);
        ct >= 0 && ((_[ct] = null), M[ct].disconnect(vt));
      }
      for (let it = 0; it < Y.added.length; it++) {
        const vt = Y.added[it];
        let ct = _.indexOf(vt);
        if (ct === -1) {
          for (let Dt = 0; Dt < M.length; Dt++)
            if (Dt >= _.length) {
              (_.push(vt), (ct = Dt));
              break;
            } else if (_[Dt] === null) {
              ((_[Dt] = vt), (ct = Dt));
              break;
            }
          if (ct === -1) break;
        }
        const At = M[ct];
        At && At.connect(vt);
      }
    }
    const G = new b(),
      q = new b();
    function O(Y, it, vt) {
      (G.setFromMatrixPosition(it.matrixWorld),
        q.setFromMatrixPosition(vt.matrixWorld));
      const ct = G.distanceTo(q),
        At = it.projectionMatrix.elements,
        Dt = vt.projectionMatrix.elements,
        kt = At[14] / (At[10] - 1),
        ce = At[14] / (At[10] + 1),
        Wt = (At[9] + 1) / At[5],
        de = (At[9] - 1) / At[5],
        F = (At[8] - 1) / At[0],
        Ve = (Dt[8] + 1) / Dt[0],
        Ht = kt * F,
        Vt = kt * Ve,
        Tt = ct / (-F + Ve),
        re = Tt * -F;
      if (
        (it.matrixWorld.decompose(Y.position, Y.quaternion, Y.scale),
        Y.translateX(re),
        Y.translateZ(Tt),
        Y.matrixWorld.compose(Y.position, Y.quaternion, Y.scale),
        Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),
        At[10] === -1)
      )
        (Y.projectionMatrix.copy(it.projectionMatrix),
          Y.projectionMatrixInverse.copy(it.projectionMatrixInverse));
      else {
        const wt = kt + Tt,
          T = ce + Tt,
          x = Ht - re,
          B = Vt + (ct - re),
          $ = ((Wt * ce) / T) * wt,
          Q = ((de * ce) / T) * wt;
        (Y.projectionMatrix.makePerspective(x, B, $, Q, wt, T),
          Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert());
      }
    }
    function et(Y, it) {
      (it === null
        ? Y.matrixWorld.copy(Y.matrix)
        : Y.matrixWorld.multiplyMatrices(it.matrixWorld, Y.matrix),
        Y.matrixWorldInverse.copy(Y.matrixWorld).invert());
    }
    this.updateCamera = function (Y) {
      if (s === null) return;
      let it = Y.near,
        vt = Y.far;
      (v.texture !== null &&
        (v.depthNear > 0 && (it = v.depthNear),
        v.depthFar > 0 && (vt = v.depthFar)),
        (y.near = C.near = A.near = it),
        (y.far = C.far = A.far = vt),
        (P !== y.near || z !== y.far) &&
          (s.updateRenderState({ depthNear: y.near, depthFar: y.far }),
          (P = y.near),
          (z = y.far)),
        (A.layers.mask = Y.layers.mask | 2),
        (C.layers.mask = Y.layers.mask | 4),
        (y.layers.mask = A.layers.mask | C.layers.mask));
      const ct = Y.parent,
        At = y.cameras;
      et(y, ct);
      for (let Dt = 0; Dt < At.length; Dt++) et(At[Dt], ct);
      (At.length === 2
        ? O(y, A, C)
        : y.projectionMatrix.copy(A.projectionMatrix),
        K(Y, y, ct));
    };
    function K(Y, it, vt) {
      (vt === null
        ? Y.matrix.copy(it.matrixWorld)
        : (Y.matrix.copy(vt.matrixWorld),
          Y.matrix.invert(),
          Y.matrix.multiply(it.matrixWorld)),
        Y.matrix.decompose(Y.position, Y.quaternion, Y.scale),
        Y.updateMatrixWorld(!0),
        Y.projectionMatrix.copy(it.projectionMatrix),
        Y.projectionMatrixInverse.copy(it.projectionMatrixInverse),
        Y.isPerspectiveCamera &&
          ((Y.fov = ts * 2 * Math.atan(1 / Y.projectionMatrix.elements[5])),
          (Y.zoom = 1)));
    }
    ((this.getCamera = function () {
      return y;
    }),
      (this.getFoveation = function () {
        if (!(u === null && m === null)) return o;
      }),
      (this.setFoveation = function (Y) {
        ((o = Y),
          u !== null && (u.fixedFoveation = Y),
          m !== null && m.fixedFoveation !== void 0 && (m.fixedFoveation = Y));
      }),
      (this.hasDepthSensing = function () {
        return v.texture !== null;
      }),
      (this.getDepthSensingMesh = function () {
        return v.getMesh(y);
      }));
    let nt = null;
    function _t(Y, it) {
      if (((h = it.getViewerPose(c || a)), (g = it), h !== null)) {
        const vt = h.views;
        m !== null &&
          (t.setRenderTargetFramebuffer(w, m.framebuffer),
          t.setRenderTarget(w));
        let ct = !1;
        vt.length !== y.cameras.length && ((y.cameras.length = 0), (ct = !0));
        for (let Dt = 0; Dt < vt.length; Dt++) {
          const kt = vt[Dt];
          let ce = null;
          if (m !== null) ce = m.getViewport(kt);
          else {
            const de = d.getViewSubImage(u, kt);
            ((ce = de.viewport),
              Dt === 0 &&
                (t.setRenderTargetTextures(
                  w,
                  de.colorTexture,
                  u.ignoreDepthValues ? void 0 : de.depthStencilTexture,
                ),
                t.setRenderTarget(w)));
          }
          let Wt = S[Dt];
          (Wt === void 0 &&
            ((Wt = new Ue()),
            Wt.layers.enable(Dt),
            (Wt.viewport = new ee()),
            (S[Dt] = Wt)),
            Wt.matrix.fromArray(kt.transform.matrix),
            Wt.matrix.decompose(Wt.position, Wt.quaternion, Wt.scale),
            Wt.projectionMatrix.fromArray(kt.projectionMatrix),
            Wt.projectionMatrixInverse.copy(Wt.projectionMatrix).invert(),
            Wt.viewport.set(ce.x, ce.y, ce.width, ce.height),
            Dt === 0 &&
              (y.matrix.copy(Wt.matrix),
              y.matrix.decompose(y.position, y.quaternion, y.scale)),
            ct === !0 && y.cameras.push(Wt));
        }
        const At = s.enabledFeatures;
        if (At && At.includes("depth-sensing")) {
          const Dt = d.getDepthInformation(vt[0]);
          Dt && Dt.isValid && Dt.texture && v.init(t, Dt, s.renderState);
        }
      }
      for (let vt = 0; vt < M.length; vt++) {
        const ct = _[vt],
          At = M[vt];
        ct !== null && At !== void 0 && At.update(ct, it, c || a);
      }
      (nt && nt(Y, it),
        it.detectedPlanes &&
          n.dispatchEvent({ type: "planesdetected", data: it }),
        (g = null));
    }
    const Lt = new Ll();
    (Lt.setAnimationLoop(_t),
      (this.setAnimationLoop = function (Y) {
        nt = Y;
      }),
      (this.dispose = function () {}));
  }
}
const Gn = new Ee(),
  n0 = new Zt();
function i0(i, t) {
  function e(p, f) {
    (p.matrixAutoUpdate === !0 && p.updateMatrix(), f.value.copy(p.matrix));
  }
  function n(p, f) {
    (f.color.getRGB(p.fogColor.value, Rl(i)),
      f.isFog
        ? ((p.fogNear.value = f.near), (p.fogFar.value = f.far))
        : f.isFogExp2 && (p.fogDensity.value = f.density));
  }
  function s(p, f, w, M, _) {
    f.isMeshBasicMaterial || f.isMeshLambertMaterial
      ? r(p, f)
      : f.isMeshToonMaterial
        ? (r(p, f), d(p, f))
        : f.isMeshPhongMaterial
          ? (r(p, f), h(p, f))
          : f.isMeshStandardMaterial
            ? (r(p, f), u(p, f), f.isMeshPhysicalMaterial && m(p, f, _))
            : f.isMeshMatcapMaterial
              ? (r(p, f), g(p, f))
              : f.isMeshDepthMaterial
                ? r(p, f)
                : f.isMeshDistanceMaterial
                  ? (r(p, f), v(p, f))
                  : f.isMeshNormalMaterial
                    ? r(p, f)
                    : f.isLineBasicMaterial
                      ? (a(p, f), f.isLineDashedMaterial && l(p, f))
                      : f.isPointsMaterial
                        ? o(p, f, w, M)
                        : f.isSpriteMaterial
                          ? c(p, f)
                          : f.isShadowMaterial
                            ? (p.color.value.copy(f.color),
                              (p.opacity.value = f.opacity))
                            : f.isShaderMaterial && (f.uniformsNeedUpdate = !1);
  }
  function r(p, f) {
    ((p.opacity.value = f.opacity),
      f.color && p.diffuse.value.copy(f.color),
      f.emissive &&
        p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),
      f.map && ((p.map.value = f.map), e(f.map, p.mapTransform)),
      f.alphaMap &&
        ((p.alphaMap.value = f.alphaMap), e(f.alphaMap, p.alphaMapTransform)),
      f.bumpMap &&
        ((p.bumpMap.value = f.bumpMap),
        e(f.bumpMap, p.bumpMapTransform),
        (p.bumpScale.value = f.bumpScale),
        f.side === Ce && (p.bumpScale.value *= -1)),
      f.normalMap &&
        ((p.normalMap.value = f.normalMap),
        e(f.normalMap, p.normalMapTransform),
        p.normalScale.value.copy(f.normalScale),
        f.side === Ce && p.normalScale.value.negate()),
      f.displacementMap &&
        ((p.displacementMap.value = f.displacementMap),
        e(f.displacementMap, p.displacementMapTransform),
        (p.displacementScale.value = f.displacementScale),
        (p.displacementBias.value = f.displacementBias)),
      f.emissiveMap &&
        ((p.emissiveMap.value = f.emissiveMap),
        e(f.emissiveMap, p.emissiveMapTransform)),
      f.specularMap &&
        ((p.specularMap.value = f.specularMap),
        e(f.specularMap, p.specularMapTransform)),
      f.alphaTest > 0 && (p.alphaTest.value = f.alphaTest));
    const w = t.get(f),
      M = w.envMap,
      _ = w.envMapRotation;
    (M &&
      ((p.envMap.value = M),
      Gn.copy(_),
      (Gn.x *= -1),
      (Gn.y *= -1),
      (Gn.z *= -1),
      M.isCubeTexture &&
        M.isRenderTargetTexture === !1 &&
        ((Gn.y *= -1), (Gn.z *= -1)),
      p.envMapRotation.value.setFromMatrix4(n0.makeRotationFromEuler(Gn)),
      (p.flipEnvMap.value =
        M.isCubeTexture && M.isRenderTargetTexture === !1 ? -1 : 1),
      (p.reflectivity.value = f.reflectivity),
      (p.ior.value = f.ior),
      (p.refractionRatio.value = f.refractionRatio)),
      f.lightMap &&
        ((p.lightMap.value = f.lightMap),
        (p.lightMapIntensity.value = f.lightMapIntensity),
        e(f.lightMap, p.lightMapTransform)),
      f.aoMap &&
        ((p.aoMap.value = f.aoMap),
        (p.aoMapIntensity.value = f.aoMapIntensity),
        e(f.aoMap, p.aoMapTransform)));
  }
  function a(p, f) {
    (p.diffuse.value.copy(f.color),
      (p.opacity.value = f.opacity),
      f.map && ((p.map.value = f.map), e(f.map, p.mapTransform)));
  }
  function l(p, f) {
    ((p.dashSize.value = f.dashSize),
      (p.totalSize.value = f.dashSize + f.gapSize),
      (p.scale.value = f.scale));
  }
  function o(p, f, w, M) {
    (p.diffuse.value.copy(f.color),
      (p.opacity.value = f.opacity),
      (p.size.value = f.size * w),
      (p.scale.value = M * 0.5),
      f.map && ((p.map.value = f.map), e(f.map, p.uvTransform)),
      f.alphaMap &&
        ((p.alphaMap.value = f.alphaMap), e(f.alphaMap, p.alphaMapTransform)),
      f.alphaTest > 0 && (p.alphaTest.value = f.alphaTest));
  }
  function c(p, f) {
    (p.diffuse.value.copy(f.color),
      (p.opacity.value = f.opacity),
      (p.rotation.value = f.rotation),
      f.map && ((p.map.value = f.map), e(f.map, p.mapTransform)),
      f.alphaMap &&
        ((p.alphaMap.value = f.alphaMap), e(f.alphaMap, p.alphaMapTransform)),
      f.alphaTest > 0 && (p.alphaTest.value = f.alphaTest));
  }
  function h(p, f) {
    (p.specular.value.copy(f.specular),
      (p.shininess.value = Math.max(f.shininess, 1e-4)));
  }
  function d(p, f) {
    f.gradientMap && (p.gradientMap.value = f.gradientMap);
  }
  function u(p, f) {
    ((p.metalness.value = f.metalness),
      f.metalnessMap &&
        ((p.metalnessMap.value = f.metalnessMap),
        e(f.metalnessMap, p.metalnessMapTransform)),
      (p.roughness.value = f.roughness),
      f.roughnessMap &&
        ((p.roughnessMap.value = f.roughnessMap),
        e(f.roughnessMap, p.roughnessMapTransform)),
      f.envMap && (p.envMapIntensity.value = f.envMapIntensity));
  }
  function m(p, f, w) {
    ((p.ior.value = f.ior),
      f.sheen > 0 &&
        (p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),
        (p.sheenRoughness.value = f.sheenRoughness),
        f.sheenColorMap &&
          ((p.sheenColorMap.value = f.sheenColorMap),
          e(f.sheenColorMap, p.sheenColorMapTransform)),
        f.sheenRoughnessMap &&
          ((p.sheenRoughnessMap.value = f.sheenRoughnessMap),
          e(f.sheenRoughnessMap, p.sheenRoughnessMapTransform))),
      f.clearcoat > 0 &&
        ((p.clearcoat.value = f.clearcoat),
        (p.clearcoatRoughness.value = f.clearcoatRoughness),
        f.clearcoatMap &&
          ((p.clearcoatMap.value = f.clearcoatMap),
          e(f.clearcoatMap, p.clearcoatMapTransform)),
        f.clearcoatRoughnessMap &&
          ((p.clearcoatRoughnessMap.value = f.clearcoatRoughnessMap),
          e(f.clearcoatRoughnessMap, p.clearcoatRoughnessMapTransform)),
        f.clearcoatNormalMap &&
          ((p.clearcoatNormalMap.value = f.clearcoatNormalMap),
          e(f.clearcoatNormalMap, p.clearcoatNormalMapTransform),
          p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),
          f.side === Ce && p.clearcoatNormalScale.value.negate())),
      f.dispersion > 0 && (p.dispersion.value = f.dispersion),
      f.iridescence > 0 &&
        ((p.iridescence.value = f.iridescence),
        (p.iridescenceIOR.value = f.iridescenceIOR),
        (p.iridescenceThicknessMinimum.value = f.iridescenceThicknessRange[0]),
        (p.iridescenceThicknessMaximum.value = f.iridescenceThicknessRange[1]),
        f.iridescenceMap &&
          ((p.iridescenceMap.value = f.iridescenceMap),
          e(f.iridescenceMap, p.iridescenceMapTransform)),
        f.iridescenceThicknessMap &&
          ((p.iridescenceThicknessMap.value = f.iridescenceThicknessMap),
          e(f.iridescenceThicknessMap, p.iridescenceThicknessMapTransform))),
      f.transmission > 0 &&
        ((p.transmission.value = f.transmission),
        (p.transmissionSamplerMap.value = w.texture),
        p.transmissionSamplerSize.value.set(w.width, w.height),
        f.transmissionMap &&
          ((p.transmissionMap.value = f.transmissionMap),
          e(f.transmissionMap, p.transmissionMapTransform)),
        (p.thickness.value = f.thickness),
        f.thicknessMap &&
          ((p.thicknessMap.value = f.thicknessMap),
          e(f.thicknessMap, p.thicknessMapTransform)),
        (p.attenuationDistance.value = f.attenuationDistance),
        p.attenuationColor.value.copy(f.attenuationColor)),
      f.anisotropy > 0 &&
        (p.anisotropyVector.value.set(
          f.anisotropy * Math.cos(f.anisotropyRotation),
          f.anisotropy * Math.sin(f.anisotropyRotation),
        ),
        f.anisotropyMap &&
          ((p.anisotropyMap.value = f.anisotropyMap),
          e(f.anisotropyMap, p.anisotropyMapTransform))),
      (p.specularIntensity.value = f.specularIntensity),
      p.specularColor.value.copy(f.specularColor),
      f.specularColorMap &&
        ((p.specularColorMap.value = f.specularColorMap),
        e(f.specularColorMap, p.specularColorMapTransform)),
      f.specularIntensityMap &&
        ((p.specularIntensityMap.value = f.specularIntensityMap),
        e(f.specularIntensityMap, p.specularIntensityMapTransform)));
  }
  function g(p, f) {
    f.matcap && (p.matcap.value = f.matcap);
  }
  function v(p, f) {
    const w = t.get(f).light;
    (p.referencePosition.value.setFromMatrixPosition(w.matrixWorld),
      (p.nearDistance.value = w.shadow.camera.near),
      (p.farDistance.value = w.shadow.camera.far));
  }
  return { refreshFogUniforms: n, refreshMaterialUniforms: s };
}
function s0(i, t, e, n) {
  let s = {},
    r = {},
    a = [];
  const l = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function o(w, M) {
    const _ = M.program;
    n.uniformBlockBinding(w, _);
  }
  function c(w, M) {
    let _ = s[w.id];
    _ === void 0 &&
      (g(w), (_ = h(w)), (s[w.id] = _), w.addEventListener("dispose", p));
    const L = M.program;
    n.updateUBOMapping(w, L);
    const R = t.render.frame;
    r[w.id] !== R && (u(w), (r[w.id] = R));
  }
  function h(w) {
    const M = d();
    w.__bindingPointIndex = M;
    const _ = i.createBuffer(),
      L = w.__size,
      R = w.usage;
    return (
      i.bindBuffer(i.UNIFORM_BUFFER, _),
      i.bufferData(i.UNIFORM_BUFFER, L, R),
      i.bindBuffer(i.UNIFORM_BUFFER, null),
      i.bindBufferBase(i.UNIFORM_BUFFER, M, _),
      _
    );
  }
  function d() {
    for (let w = 0; w < l; w++) if (a.indexOf(w) === -1) return (a.push(w), w);
    return (
      console.error(
        "THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.",
      ),
      0
    );
  }
  function u(w) {
    const M = s[w.id],
      _ = w.uniforms,
      L = w.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, M);
    for (let R = 0, A = _.length; R < A; R++) {
      const C = Array.isArray(_[R]) ? _[R] : [_[R]];
      for (let S = 0, y = C.length; S < y; S++) {
        const P = C[S];
        if (m(P, R, S, L) === !0) {
          const z = P.__offset,
            U = Array.isArray(P.value) ? P.value : [P.value];
          let H = 0;
          for (let k = 0; k < U.length; k++) {
            const G = U[k],
              q = v(G);
            typeof G == "number" || typeof G == "boolean"
              ? ((P.__data[0] = G),
                i.bufferSubData(i.UNIFORM_BUFFER, z + H, P.__data))
              : G.isMatrix3
                ? ((P.__data[0] = G.elements[0]),
                  (P.__data[1] = G.elements[1]),
                  (P.__data[2] = G.elements[2]),
                  (P.__data[3] = 0),
                  (P.__data[4] = G.elements[3]),
                  (P.__data[5] = G.elements[4]),
                  (P.__data[6] = G.elements[5]),
                  (P.__data[7] = 0),
                  (P.__data[8] = G.elements[6]),
                  (P.__data[9] = G.elements[7]),
                  (P.__data[10] = G.elements[8]),
                  (P.__data[11] = 0))
                : (G.toArray(P.__data, H),
                  (H += q.storage / Float32Array.BYTES_PER_ELEMENT));
          }
          i.bufferSubData(i.UNIFORM_BUFFER, z, P.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function m(w, M, _, L) {
    const R = w.value,
      A = M + "_" + _;
    if (L[A] === void 0)
      return (
        typeof R == "number" || typeof R == "boolean"
          ? (L[A] = R)
          : (L[A] = R.clone()),
        !0
      );
    {
      const C = L[A];
      if (typeof R == "number" || typeof R == "boolean") {
        if (C !== R) return ((L[A] = R), !0);
      } else if (C.equals(R) === !1) return (C.copy(R), !0);
    }
    return !1;
  }
  function g(w) {
    const M = w.uniforms;
    let _ = 0;
    const L = 16;
    for (let A = 0, C = M.length; A < C; A++) {
      const S = Array.isArray(M[A]) ? M[A] : [M[A]];
      for (let y = 0, P = S.length; y < P; y++) {
        const z = S[y],
          U = Array.isArray(z.value) ? z.value : [z.value];
        for (let H = 0, k = U.length; H < k; H++) {
          const G = U[H],
            q = v(G),
            O = _ % L,
            et = O % q.boundary,
            K = O + et;
          ((_ += et),
            K !== 0 && L - K < q.storage && (_ += L - K),
            (z.__data = new Float32Array(
              q.storage / Float32Array.BYTES_PER_ELEMENT,
            )),
            (z.__offset = _),
            (_ += q.storage));
        }
      }
    }
    const R = _ % L;
    return (R > 0 && (_ += L - R), (w.__size = _), (w.__cache = {}), this);
  }
  function v(w) {
    const M = { boundary: 0, storage: 0 };
    return (
      typeof w == "number" || typeof w == "boolean"
        ? ((M.boundary = 4), (M.storage = 4))
        : w.isVector2
          ? ((M.boundary = 8), (M.storage = 8))
          : w.isVector3 || w.isColor
            ? ((M.boundary = 16), (M.storage = 12))
            : w.isVector4
              ? ((M.boundary = 16), (M.storage = 16))
              : w.isMatrix3
                ? ((M.boundary = 48), (M.storage = 48))
                : w.isMatrix4
                  ? ((M.boundary = 64), (M.storage = 64))
                  : w.isTexture
                    ? console.warn(
                        "THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.",
                      )
                    : console.warn(
                        "THREE.WebGLRenderer: Unsupported uniform value type.",
                        w,
                      ),
      M
    );
  }
  function p(w) {
    const M = w.target;
    M.removeEventListener("dispose", p);
    const _ = a.indexOf(M.__bindingPointIndex);
    (a.splice(_, 1), i.deleteBuffer(s[M.id]), delete s[M.id], delete r[M.id]);
  }
  function f() {
    for (const w in s) i.deleteBuffer(s[w]);
    ((a = []), (s = {}), (r = {}));
  }
  return { bind: o, update: c, dispose: f };
}
class r0 {
  constructor(t = {}) {
    const {
      canvas: e = Xc(),
      context: n = null,
      depth: s = !0,
      stencil: r = !1,
      alpha: a = !1,
      antialias: l = !1,
      premultipliedAlpha: o = !0,
      preserveDrawingBuffer: c = !1,
      powerPreference: h = "default",
      failIfMajorPerformanceCaveat: d = !1,
      reverseDepthBuffer: u = !1,
    } = t;
    this.isWebGLRenderer = !0;
    let m;
    if (n !== null) {
      if (
        typeof WebGLRenderingContext < "u" &&
        n instanceof WebGLRenderingContext
      )
        throw new Error(
          "THREE.WebGLRenderer: WebGL 1 is not supported since r163.",
        );
      m = n.getContextAttributes().alpha;
    } else m = a;
    const g = new Uint32Array(4),
      v = new Int32Array(4);
    let p = null,
      f = null;
    const w = [],
      M = [];
    ((this.domElement = e),
      (this.debug = { checkShaderErrors: !0, onShaderError: null }),
      (this.autoClear = !0),
      (this.autoClearColor = !0),
      (this.autoClearDepth = !0),
      (this.autoClearStencil = !0),
      (this.sortObjects = !0),
      (this.clippingPlanes = []),
      (this.localClippingEnabled = !1),
      (this._outputColorSpace = Xe),
      (this.toneMapping = _n),
      (this.toneMappingExposure = 1));
    const _ = this;
    let L = !1,
      R = 0,
      A = 0,
      C = null,
      S = -1,
      y = null;
    const P = new ee(),
      z = new ee();
    let U = null;
    const H = new Pt(0);
    let k = 0,
      G = e.width,
      q = e.height,
      O = 1,
      et = null,
      K = null;
    const nt = new ee(0, 0, G, q),
      _t = new ee(0, 0, G, q);
    let Lt = !1;
    const Y = new Pa();
    let it = !1,
      vt = !1;
    const ct = new Zt(),
      At = new Zt(),
      Dt = new b(),
      kt = new ee(),
      ce = {
        background: null,
        fog: null,
        environment: null,
        overrideMaterial: null,
        isScene: !0,
      };
    let Wt = !1;
    function de() {
      return C === null ? O : 1;
    }
    let F = n;
    function Ve(E, I) {
      return e.getContext(E, I);
    }
    try {
      const E = {
        alpha: !0,
        depth: s,
        stencil: r,
        antialias: l,
        premultipliedAlpha: o,
        preserveDrawingBuffer: c,
        powerPreference: h,
        failIfMajorPerformanceCaveat: d,
      };
      if (
        ("setAttribute" in e &&
          e.setAttribute("data-engine", `three.js r${ya}`),
        e.addEventListener("webglcontextlost", Z, !1),
        e.addEventListener("webglcontextrestored", ft, !1),
        e.addEventListener("webglcontextcreationerror", ut, !1),
        F === null)
      ) {
        const I = "webgl2";
        if (((F = Ve(I, E)), F === null))
          throw Ve(I)
            ? new Error(
                "Error creating WebGL context with your selected attributes.",
              )
            : new Error("Error creating WebGL context.");
      }
    } catch (E) {
      throw (console.error("THREE.WebGLRenderer: " + E.message), E);
    }
    let Ht,
      Vt,
      Tt,
      re,
      wt,
      T,
      x,
      B,
      $,
      Q,
      j,
      St,
      ht,
      pt,
      qt,
      st,
      mt,
      bt,
      Rt,
      gt,
      Gt,
      Ot,
      ie,
      D;
    function lt() {
      ((Ht = new uf(F)),
        Ht.init(),
        (Ot = new Kp(F, Ht)),
        (Vt = new rf(F, Ht, t, Ot)),
        (Tt = new Xp(F, Ht)),
        Vt.reverseDepthBuffer && u && Tt.buffers.depth.setReversed(!0),
        (re = new pf(F)),
        (wt = new Dp()),
        (T = new jp(F, Ht, Tt, wt, Vt, Ot, re)),
        (x = new of(_)),
        (B = new hf(_)),
        ($ = new Mh(F)),
        (ie = new nf(F, $)),
        (Q = new df(F, $, re, ie)),
        (j = new gf(F, Q, $, re)),
        (Rt = new mf(F, Vt, T)),
        (st = new af(wt)),
        (St = new Lp(_, x, B, Ht, Vt, ie, st)),
        (ht = new i0(_, wt)),
        (pt = new Ip()),
        (qt = new kp(Ht)),
        (bt = new ef(_, x, B, Tt, j, m, o)),
        (mt = new Wp(_, j, Vt)),
        (D = new s0(F, re, Vt, Tt)),
        (gt = new sf(F, Ht, re)),
        (Gt = new ff(F, Ht, re)),
        (re.programs = St.programs),
        (_.capabilities = Vt),
        (_.extensions = Ht),
        (_.properties = wt),
        (_.renderLists = pt),
        (_.shadowMap = mt),
        (_.state = Tt),
        (_.info = re));
    }
    lt();
    const X = new e0(_, F);
    ((this.xr = X),
      (this.getContext = function () {
        return F;
      }),
      (this.getContextAttributes = function () {
        return F.getContextAttributes();
      }),
      (this.forceContextLoss = function () {
        const E = Ht.get("WEBGL_lose_context");
        E && E.loseContext();
      }),
      (this.forceContextRestore = function () {
        const E = Ht.get("WEBGL_lose_context");
        E && E.restoreContext();
      }),
      (this.getPixelRatio = function () {
        return O;
      }),
      (this.setPixelRatio = function (E) {
        E !== void 0 && ((O = E), this.setSize(G, q, !1));
      }),
      (this.getSize = function (E) {
        return E.set(G, q);
      }),
      (this.setSize = function (E, I, V = !0) {
        if (X.isPresenting) {
          console.warn(
            "THREE.WebGLRenderer: Can't change size while VR device is presenting.",
          );
          return;
        }
        ((G = E),
          (q = I),
          (e.width = Math.floor(E * O)),
          (e.height = Math.floor(I * O)),
          V === !0 && ((e.style.width = E + "px"), (e.style.height = I + "px")),
          this.setViewport(0, 0, E, I));
      }),
      (this.getDrawingBufferSize = function (E) {
        return E.set(G * O, q * O).floor();
      }),
      (this.setDrawingBufferSize = function (E, I, V) {
        ((G = E),
          (q = I),
          (O = V),
          (e.width = Math.floor(E * V)),
          (e.height = Math.floor(I * V)),
          this.setViewport(0, 0, E, I));
      }),
      (this.getCurrentViewport = function (E) {
        return E.copy(P);
      }),
      (this.getViewport = function (E) {
        return E.copy(nt);
      }),
      (this.setViewport = function (E, I, V, W) {
        (E.isVector4 ? nt.set(E.x, E.y, E.z, E.w) : nt.set(E, I, V, W),
          Tt.viewport(P.copy(nt).multiplyScalar(O).round()));
      }),
      (this.getScissor = function (E) {
        return E.copy(_t);
      }),
      (this.setScissor = function (E, I, V, W) {
        (E.isVector4 ? _t.set(E.x, E.y, E.z, E.w) : _t.set(E, I, V, W),
          Tt.scissor(z.copy(_t).multiplyScalar(O).round()));
      }),
      (this.getScissorTest = function () {
        return Lt;
      }),
      (this.setScissorTest = function (E) {
        Tt.setScissorTest((Lt = E));
      }),
      (this.setOpaqueSort = function (E) {
        et = E;
      }),
      (this.setTransparentSort = function (E) {
        K = E;
      }),
      (this.getClearColor = function (E) {
        return E.copy(bt.getClearColor());
      }),
      (this.setClearColor = function () {
        bt.setClearColor.apply(bt, arguments);
      }),
      (this.getClearAlpha = function () {
        return bt.getClearAlpha();
      }),
      (this.setClearAlpha = function () {
        bt.setClearAlpha.apply(bt, arguments);
      }),
      (this.clear = function (E = !0, I = !0, V = !0) {
        let W = 0;
        if (E) {
          let N = !1;
          if (C !== null) {
            const rt = C.texture.format;
            N = rt === Ra || rt === Aa || rt === ba;
          }
          if (N) {
            const rt = C.texture.type,
              dt =
                rt === yn ||
                rt === Jn ||
                rt === Qi ||
                rt === Ci ||
                rt === Ea ||
                rt === wa,
              xt = bt.getClearColor(),
              Mt = bt.getClearAlpha(),
              Ct = xt.r,
              Ft = xt.g,
              yt = xt.b;
            dt
              ? ((g[0] = Ct),
                (g[1] = Ft),
                (g[2] = yt),
                (g[3] = Mt),
                F.clearBufferuiv(F.COLOR, 0, g))
              : ((v[0] = Ct),
                (v[1] = Ft),
                (v[2] = yt),
                (v[3] = Mt),
                F.clearBufferiv(F.COLOR, 0, v));
          } else W |= F.COLOR_BUFFER_BIT;
        }
        (I && (W |= F.DEPTH_BUFFER_BIT),
          V &&
            ((W |= F.STENCIL_BUFFER_BIT),
            this.state.buffers.stencil.setMask(4294967295)),
          F.clear(W));
      }),
      (this.clearColor = function () {
        this.clear(!0, !1, !1);
      }),
      (this.clearDepth = function () {
        this.clear(!1, !0, !1);
      }),
      (this.clearStencil = function () {
        this.clear(!1, !1, !0);
      }),
      (this.dispose = function () {
        (e.removeEventListener("webglcontextlost", Z, !1),
          e.removeEventListener("webglcontextrestored", ft, !1),
          e.removeEventListener("webglcontextcreationerror", ut, !1),
          pt.dispose(),
          qt.dispose(),
          wt.dispose(),
          x.dispose(),
          B.dispose(),
          j.dispose(),
          ie.dispose(),
          D.dispose(),
          St.dispose(),
          X.dispose(),
          X.removeEventListener("sessionstart", Ba),
          X.removeEventListener("sessionend", ka),
          zn.stop());
      }));
    function Z(E) {
      (E.preventDefault(),
        console.log("THREE.WebGLRenderer: Context Lost."),
        (L = !0));
    }
    function ft() {
      (console.log("THREE.WebGLRenderer: Context Restored."), (L = !1));
      const E = re.autoReset,
        I = mt.enabled,
        V = mt.autoUpdate,
        W = mt.needsUpdate,
        N = mt.type;
      (lt(),
        (re.autoReset = E),
        (mt.enabled = I),
        (mt.autoUpdate = V),
        (mt.needsUpdate = W),
        (mt.type = N));
    }
    function ut(E) {
      console.error(
        "THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",
        E.statusMessage,
      );
    }
    function Nt(E) {
      const I = E.target;
      (I.removeEventListener("dispose", Nt), ue(I));
    }
    function ue(E) {
      (Me(E), wt.remove(E));
    }
    function Me(E) {
      const I = wt.get(E).programs;
      I !== void 0 &&
        (I.forEach(function (V) {
          St.releaseProgram(V);
        }),
        E.isShaderMaterial && St.releaseShaderCache(E));
    }
    this.renderBufferDirect = function (E, I, V, W, N, rt) {
      I === null && (I = ce);
      const dt = N.isMesh && N.matrixWorld.determinant() < 0,
        xt = Wl(E, I, V, W, N);
      Tt.setMaterial(W, dt);
      let Mt = V.index,
        Ct = 1;
      if (W.wireframe === !0) {
        if (((Mt = Q.getWireframeAttribute(V)), Mt === void 0)) return;
        Ct = 2;
      }
      const Ft = V.drawRange,
        yt = V.attributes.position;
      let Yt = Ft.start * Ct,
        se = (Ft.start + Ft.count) * Ct;
      (rt !== null &&
        ((Yt = Math.max(Yt, rt.start * Ct)),
        (se = Math.min(se, (rt.start + rt.count) * Ct))),
        Mt !== null
          ? ((Yt = Math.max(Yt, 0)), (se = Math.min(se, Mt.count)))
          : yt != null &&
            ((Yt = Math.max(Yt, 0)), (se = Math.min(se, yt.count))));
      const ae = se - Yt;
      if (ae < 0 || ae === 1 / 0) return;
      ie.setup(N, W, xt, V, Mt);
      let De,
        Kt = gt;
      if (
        (Mt !== null && ((De = $.get(Mt)), (Kt = Gt), Kt.setIndex(De)),
        N.isMesh)
      )
        W.wireframe === !0
          ? (Tt.setLineWidth(W.wireframeLinewidth * de()), Kt.setMode(F.LINES))
          : Kt.setMode(F.TRIANGLES);
      else if (N.isLine) {
        let Et = W.linewidth;
        (Et === void 0 && (Et = 1),
          Tt.setLineWidth(Et * de()),
          N.isLineSegments
            ? Kt.setMode(F.LINES)
            : N.isLineLoop
              ? Kt.setMode(F.LINE_LOOP)
              : Kt.setMode(F.LINE_STRIP));
      } else
        N.isPoints
          ? Kt.setMode(F.POINTS)
          : N.isSprite && Kt.setMode(F.TRIANGLES);
      if (N.isBatchedMesh)
        if (N._multiDrawInstances !== null)
          Kt.renderMultiDrawInstances(
            N._multiDrawStarts,
            N._multiDrawCounts,
            N._multiDrawCount,
            N._multiDrawInstances,
          );
        else if (Ht.get("WEBGL_multi_draw"))
          Kt.renderMultiDraw(
            N._multiDrawStarts,
            N._multiDrawCounts,
            N._multiDrawCount,
          );
        else {
          const Et = N._multiDrawStarts,
            ln = N._multiDrawCounts,
            $t = N._multiDrawCount,
            Ke = Mt ? $.get(Mt).bytesPerElement : 1,
            ii = wt.get(W).currentProgram.getUniforms();
          for (let Fe = 0; Fe < $t; Fe++)
            (ii.setValue(F, "_gl_DrawID", Fe), Kt.render(Et[Fe] / Ke, ln[Fe]));
        }
      else if (N.isInstancedMesh) Kt.renderInstances(Yt, ae, N.count);
      else if (V.isInstancedBufferGeometry) {
        const Et = V._maxInstanceCount !== void 0 ? V._maxInstanceCount : 1 / 0,
          ln = Math.min(V.instanceCount, Et);
        Kt.renderInstances(Yt, ae, ln);
      } else Kt.render(Yt, ae);
    };
    function Jt(E, I, V) {
      E.transparent === !0 && E.side === Ie && E.forceSinglePass === !1
        ? ((E.side = Ce),
          (E.needsUpdate = !0),
          ss(E, I, V),
          (E.side = Fn),
          (E.needsUpdate = !0),
          ss(E, I, V),
          (E.side = Ie))
        : ss(E, I, V);
    }
    ((this.compile = function (E, I, V = null) {
      (V === null && (V = E),
        (f = qt.get(V)),
        f.init(I),
        M.push(f),
        V.traverseVisible(function (N) {
          N.isLight &&
            N.layers.test(I.layers) &&
            (f.pushLight(N), N.castShadow && f.pushShadow(N));
        }),
        E !== V &&
          E.traverseVisible(function (N) {
            N.isLight &&
              N.layers.test(I.layers) &&
              (f.pushLight(N), N.castShadow && f.pushShadow(N));
          }),
        f.setupLights());
      const W = new Set();
      return (
        E.traverse(function (N) {
          if (!(N.isMesh || N.isPoints || N.isLine || N.isSprite)) return;
          const rt = N.material;
          if (rt)
            if (Array.isArray(rt))
              for (let dt = 0; dt < rt.length; dt++) {
                const xt = rt[dt];
                (Jt(xt, V, N), W.add(xt));
              }
            else (Jt(rt, V, N), W.add(rt));
        }),
        M.pop(),
        (f = null),
        W
      );
    }),
      (this.compileAsync = function (E, I, V = null) {
        const W = this.compile(E, I, V);
        return new Promise((N) => {
          function rt() {
            if (
              (W.forEach(function (dt) {
                wt.get(dt).currentProgram.isReady() && W.delete(dt);
              }),
              W.size === 0)
            ) {
              N(E);
              return;
            }
            setTimeout(rt, 10);
          }
          Ht.get("KHR_parallel_shader_compile") !== null
            ? rt()
            : setTimeout(rt, 10);
        });
      }));
    let je = null;
    function on(E) {
      je && je(E);
    }
    function Ba() {
      zn.stop();
    }
    function ka() {
      zn.start();
    }
    const zn = new Ll();
    (zn.setAnimationLoop(on),
      typeof self < "u" && zn.setContext(self),
      (this.setAnimationLoop = function (E) {
        ((je = E), X.setAnimationLoop(E), E === null ? zn.stop() : zn.start());
      }),
      X.addEventListener("sessionstart", Ba),
      X.addEventListener("sessionend", ka),
      (this.render = function (E, I) {
        if (I !== void 0 && I.isCamera !== !0) {
          console.error(
            "THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.",
          );
          return;
        }
        if (L === !0) return;
        if (
          (E.matrixWorldAutoUpdate === !0 && E.updateMatrixWorld(),
          I.parent === null &&
            I.matrixWorldAutoUpdate === !0 &&
            I.updateMatrixWorld(),
          X.enabled === !0 &&
            X.isPresenting === !0 &&
            (X.cameraAutoUpdate === !0 && X.updateCamera(I),
            (I = X.getCamera())),
          E.isScene === !0 && E.onBeforeRender(_, E, I, C),
          (f = qt.get(E, M.length)),
          f.init(I),
          M.push(f),
          At.multiplyMatrices(I.projectionMatrix, I.matrixWorldInverse),
          Y.setFromProjectionMatrix(At),
          (vt = this.localClippingEnabled),
          (it = st.init(this.clippingPlanes, vt)),
          (p = pt.get(E, w.length)),
          p.init(),
          w.push(p),
          X.enabled === !0 && X.isPresenting === !0)
        ) {
          const rt = _.xr.getDepthSensingMesh();
          rt !== null && Ys(rt, I, -1 / 0, _.sortObjects);
        }
        (Ys(E, I, 0, _.sortObjects),
          p.finish(),
          _.sortObjects === !0 && p.sort(et, K),
          (Wt =
            X.enabled === !1 ||
            X.isPresenting === !1 ||
            X.hasDepthSensing() === !1),
          Wt && bt.addToRenderList(p, E),
          this.info.render.frame++,
          it === !0 && st.beginShadows());
        const V = f.state.shadowsArray;
        (mt.render(V, E, I),
          it === !0 && st.endShadows(),
          this.info.autoReset === !0 && this.info.reset());
        const W = p.opaque,
          N = p.transmissive;
        if ((f.setupLights(), I.isArrayCamera)) {
          const rt = I.cameras;
          if (N.length > 0)
            for (let dt = 0, xt = rt.length; dt < xt; dt++) {
              const Mt = rt[dt];
              Va(W, N, E, Mt);
            }
          Wt && bt.render(E);
          for (let dt = 0, xt = rt.length; dt < xt; dt++) {
            const Mt = rt[dt];
            Ha(p, E, Mt, Mt.viewport);
          }
        } else
          (N.length > 0 && Va(W, N, E, I), Wt && bt.render(E), Ha(p, E, I));
        (C !== null &&
          (T.updateMultisampleRenderTarget(C), T.updateRenderTargetMipmap(C)),
          E.isScene === !0 && E.onAfterRender(_, E, I),
          ie.resetDefaultState(),
          (S = -1),
          (y = null),
          M.pop(),
          M.length > 0
            ? ((f = M[M.length - 1]),
              it === !0 && st.setGlobalState(_.clippingPlanes, f.state.camera))
            : (f = null),
          w.pop(),
          w.length > 0 ? (p = w[w.length - 1]) : (p = null));
      }));
    function Ys(E, I, V, W) {
      if (E.visible === !1) return;
      if (E.layers.test(I.layers)) {
        if (E.isGroup) V = E.renderOrder;
        else if (E.isLOD) E.autoUpdate === !0 && E.update(I);
        else if (E.isLight) (f.pushLight(E), E.castShadow && f.pushShadow(E));
        else if (E.isSprite) {
          if (!E.frustumCulled || Y.intersectsSprite(E)) {
            W && kt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(At);
            const dt = j.update(E),
              xt = E.material;
            xt.visible && p.push(E, dt, xt, V, kt.z, null);
          }
        } else if (
          (E.isMesh || E.isLine || E.isPoints) &&
          (!E.frustumCulled || Y.intersectsObject(E))
        ) {
          const dt = j.update(E),
            xt = E.material;
          if (
            (W &&
              (E.boundingSphere !== void 0
                ? (E.boundingSphere === null && E.computeBoundingSphere(),
                  kt.copy(E.boundingSphere.center))
                : (dt.boundingSphere === null && dt.computeBoundingSphere(),
                  kt.copy(dt.boundingSphere.center)),
              kt.applyMatrix4(E.matrixWorld).applyMatrix4(At)),
            Array.isArray(xt))
          ) {
            const Mt = dt.groups;
            for (let Ct = 0, Ft = Mt.length; Ct < Ft; Ct++) {
              const yt = Mt[Ct],
                Yt = xt[yt.materialIndex];
              Yt && Yt.visible && p.push(E, dt, Yt, V, kt.z, yt);
            }
          } else xt.visible && p.push(E, dt, xt, V, kt.z, null);
        }
      }
      const rt = E.children;
      for (let dt = 0, xt = rt.length; dt < xt; dt++) Ys(rt[dt], I, V, W);
    }
    function Ha(E, I, V, W) {
      const N = E.opaque,
        rt = E.transmissive,
        dt = E.transparent;
      (f.setupLightsView(V),
        it === !0 && st.setGlobalState(_.clippingPlanes, V),
        W && Tt.viewport(P.copy(W)),
        N.length > 0 && is(N, I, V),
        rt.length > 0 && is(rt, I, V),
        dt.length > 0 && is(dt, I, V),
        Tt.buffers.depth.setTest(!0),
        Tt.buffers.depth.setMask(!0),
        Tt.buffers.color.setMask(!0),
        Tt.setPolygonOffset(!1));
    }
    function Va(E, I, V, W) {
      if ((V.isScene === !0 ? V.overrideMaterial : null) !== null) return;
      f.state.transmissionRenderTarget[W.id] === void 0 &&
        (f.state.transmissionRenderTarget[W.id] = new Sn(1, 1, {
          generateMipmaps: !0,
          type:
            Ht.has("EXT_color_buffer_half_float") ||
            Ht.has("EXT_color_buffer_float")
              ? Qn
              : yn,
          minFilter: Kn,
          samples: 4,
          stencilBuffer: r,
          resolveDepthBuffer: !1,
          resolveStencilBuffer: !1,
          colorSpace: Xt.workingColorSpace,
        }));
      const rt = f.state.transmissionRenderTarget[W.id],
        dt = W.viewport || P;
      rt.setSize(dt.z, dt.w);
      const xt = _.getRenderTarget();
      (_.setRenderTarget(rt),
        _.getClearColor(H),
        (k = _.getClearAlpha()),
        k < 1 && _.setClearColor(16777215, 0.5),
        _.clear(),
        Wt && bt.render(V));
      const Mt = _.toneMapping;
      _.toneMapping = _n;
      const Ct = W.viewport;
      if (
        (W.viewport !== void 0 && (W.viewport = void 0),
        f.setupLightsView(W),
        it === !0 && st.setGlobalState(_.clippingPlanes, W),
        is(E, V, W),
        T.updateMultisampleRenderTarget(rt),
        T.updateRenderTargetMipmap(rt),
        Ht.has("WEBGL_multisampled_render_to_texture") === !1)
      ) {
        let Ft = !1;
        for (let yt = 0, Yt = I.length; yt < Yt; yt++) {
          const se = I[yt],
            ae = se.object,
            De = se.geometry,
            Kt = se.material,
            Et = se.group;
          if (Kt.side === Ie && ae.layers.test(W.layers)) {
            const ln = Kt.side;
            ((Kt.side = Ce),
              (Kt.needsUpdate = !0),
              Ga(ae, V, W, De, Kt, Et),
              (Kt.side = ln),
              (Kt.needsUpdate = !0),
              (Ft = !0));
          }
        }
        Ft === !0 &&
          (T.updateMultisampleRenderTarget(rt), T.updateRenderTargetMipmap(rt));
      }
      (_.setRenderTarget(xt),
        _.setClearColor(H, k),
        Ct !== void 0 && (W.viewport = Ct),
        (_.toneMapping = Mt));
    }
    function is(E, I, V) {
      const W = I.isScene === !0 ? I.overrideMaterial : null;
      for (let N = 0, rt = E.length; N < rt; N++) {
        const dt = E[N],
          xt = dt.object,
          Mt = dt.geometry,
          Ct = W === null ? dt.material : W,
          Ft = dt.group;
        xt.layers.test(V.layers) && Ga(xt, I, V, Mt, Ct, Ft);
      }
    }
    function Ga(E, I, V, W, N, rt) {
      (E.onBeforeRender(_, I, V, W, N, rt),
        E.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse, E.matrixWorld),
        E.normalMatrix.getNormalMatrix(E.modelViewMatrix),
        N.onBeforeRender(_, I, V, W, E, rt),
        N.transparent === !0 && N.side === Ie && N.forceSinglePass === !1
          ? ((N.side = Ce),
            (N.needsUpdate = !0),
            _.renderBufferDirect(V, I, W, N, E, rt),
            (N.side = Fn),
            (N.needsUpdate = !0),
            _.renderBufferDirect(V, I, W, N, E, rt),
            (N.side = Ie))
          : _.renderBufferDirect(V, I, W, N, E, rt),
        E.onAfterRender(_, I, V, W, N, rt));
    }
    function ss(E, I, V) {
      I.isScene !== !0 && (I = ce);
      const W = wt.get(E),
        N = f.state.lights,
        rt = f.state.shadowsArray,
        dt = N.state.version,
        xt = St.getParameters(E, N.state, rt, I, V),
        Mt = St.getProgramCacheKey(xt);
      let Ct = W.programs;
      ((W.environment = E.isMeshStandardMaterial ? I.environment : null),
        (W.fog = I.fog),
        (W.envMap = (E.isMeshStandardMaterial ? B : x).get(
          E.envMap || W.environment,
        )),
        (W.envMapRotation =
          W.environment !== null && E.envMap === null
            ? I.environmentRotation
            : E.envMapRotation),
        Ct === void 0 &&
          (E.addEventListener("dispose", Nt),
          (Ct = new Map()),
          (W.programs = Ct)));
      let Ft = Ct.get(Mt);
      if (Ft !== void 0) {
        if (W.currentProgram === Ft && W.lightsStateVersion === dt)
          return (qa(E, xt), Ft);
      } else
        ((xt.uniforms = St.getUniforms(E)),
          E.onBeforeCompile(xt, _),
          (Ft = St.acquireProgram(xt, Mt)),
          Ct.set(Mt, Ft),
          (W.uniforms = xt.uniforms));
      const yt = W.uniforms;
      return (
        ((!E.isShaderMaterial && !E.isRawShaderMaterial) ||
          E.clipping === !0) &&
          (yt.clippingPlanes = st.uniform),
        qa(E, xt),
        (W.needsLights = Xl(E)),
        (W.lightsStateVersion = dt),
        W.needsLights &&
          ((yt.ambientLightColor.value = N.state.ambient),
          (yt.lightProbe.value = N.state.probe),
          (yt.directionalLights.value = N.state.directional),
          (yt.directionalLightShadows.value = N.state.directionalShadow),
          (yt.spotLights.value = N.state.spot),
          (yt.spotLightShadows.value = N.state.spotShadow),
          (yt.rectAreaLights.value = N.state.rectArea),
          (yt.ltc_1.value = N.state.rectAreaLTC1),
          (yt.ltc_2.value = N.state.rectAreaLTC2),
          (yt.pointLights.value = N.state.point),
          (yt.pointLightShadows.value = N.state.pointShadow),
          (yt.hemisphereLights.value = N.state.hemi),
          (yt.directionalShadowMap.value = N.state.directionalShadowMap),
          (yt.directionalShadowMatrix.value = N.state.directionalShadowMatrix),
          (yt.spotShadowMap.value = N.state.spotShadowMap),
          (yt.spotLightMatrix.value = N.state.spotLightMatrix),
          (yt.spotLightMap.value = N.state.spotLightMap),
          (yt.pointShadowMap.value = N.state.pointShadowMap),
          (yt.pointShadowMatrix.value = N.state.pointShadowMatrix)),
        (W.currentProgram = Ft),
        (W.uniformsList = null),
        Ft
      );
    }
    function Wa(E) {
      if (E.uniformsList === null) {
        const I = E.currentProgram.getUniforms();
        E.uniformsList = Fs.seqWithValue(I.seq, E.uniforms);
      }
      return E.uniformsList;
    }
    function qa(E, I) {
      const V = wt.get(E);
      ((V.outputColorSpace = I.outputColorSpace),
        (V.batching = I.batching),
        (V.batchingColor = I.batchingColor),
        (V.instancing = I.instancing),
        (V.instancingColor = I.instancingColor),
        (V.instancingMorph = I.instancingMorph),
        (V.skinning = I.skinning),
        (V.morphTargets = I.morphTargets),
        (V.morphNormals = I.morphNormals),
        (V.morphColors = I.morphColors),
        (V.morphTargetsCount = I.morphTargetsCount),
        (V.numClippingPlanes = I.numClippingPlanes),
        (V.numIntersection = I.numClipIntersection),
        (V.vertexAlphas = I.vertexAlphas),
        (V.vertexTangents = I.vertexTangents),
        (V.toneMapping = I.toneMapping));
    }
    function Wl(E, I, V, W, N) {
      (I.isScene !== !0 && (I = ce), T.resetTextureUnits());
      const rt = I.fog,
        dt = W.isMeshStandardMaterial ? I.environment : null,
        xt =
          C === null
            ? _.outputColorSpace
            : C.isXRRenderTarget === !0
              ? C.texture.colorSpace
              : Ui,
        Mt = (W.isMeshStandardMaterial ? B : x).get(W.envMap || dt),
        Ct =
          W.vertexColors === !0 &&
          !!V.attributes.color &&
          V.attributes.color.itemSize === 4,
        Ft = !!V.attributes.tangent && (!!W.normalMap || W.anisotropy > 0),
        yt = !!V.morphAttributes.position,
        Yt = !!V.morphAttributes.normal,
        se = !!V.morphAttributes.color;
      let ae = _n;
      W.toneMapped &&
        (C === null || C.isXRRenderTarget === !0) &&
        (ae = _.toneMapping);
      const De =
          V.morphAttributes.position ||
          V.morphAttributes.normal ||
          V.morphAttributes.color,
        Kt = De !== void 0 ? De.length : 0,
        Et = wt.get(W),
        ln = f.state.lights;
      if (it === !0 && (vt === !0 || E !== y)) {
        const Ge = E === y && W.id === S;
        st.setState(W, E, Ge);
      }
      let $t = !1;
      W.version === Et.__version
        ? ((Et.needsLights && Et.lightsStateVersion !== ln.state.version) ||
            Et.outputColorSpace !== xt ||
            (N.isBatchedMesh && Et.batching === !1) ||
            (!N.isBatchedMesh && Et.batching === !0) ||
            (N.isBatchedMesh &&
              Et.batchingColor === !0 &&
              N.colorTexture === null) ||
            (N.isBatchedMesh &&
              Et.batchingColor === !1 &&
              N.colorTexture !== null) ||
            (N.isInstancedMesh && Et.instancing === !1) ||
            (!N.isInstancedMesh && Et.instancing === !0) ||
            (N.isSkinnedMesh && Et.skinning === !1) ||
            (!N.isSkinnedMesh && Et.skinning === !0) ||
            (N.isInstancedMesh &&
              Et.instancingColor === !0 &&
              N.instanceColor === null) ||
            (N.isInstancedMesh &&
              Et.instancingColor === !1 &&
              N.instanceColor !== null) ||
            (N.isInstancedMesh &&
              Et.instancingMorph === !0 &&
              N.morphTexture === null) ||
            (N.isInstancedMesh &&
              Et.instancingMorph === !1 &&
              N.morphTexture !== null) ||
            Et.envMap !== Mt ||
            (W.fog === !0 && Et.fog !== rt) ||
            (Et.numClippingPlanes !== void 0 &&
              (Et.numClippingPlanes !== st.numPlanes ||
                Et.numIntersection !== st.numIntersection)) ||
            Et.vertexAlphas !== Ct ||
            Et.vertexTangents !== Ft ||
            Et.morphTargets !== yt ||
            Et.morphNormals !== Yt ||
            Et.morphColors !== se ||
            Et.toneMapping !== ae ||
            Et.morphTargetsCount !== Kt) &&
          ($t = !0)
        : (($t = !0), (Et.__version = W.version));
      let Ke = Et.currentProgram;
      $t === !0 && (Ke = ss(W, I, N));
      let ii = !1,
        Fe = !1,
        zi = !1;
      const oe = Ke.getUniforms(),
        en = Et.uniforms;
      if (
        (Tt.useProgram(Ke.program) && ((ii = !0), (Fe = !0), (zi = !0)),
        W.id !== S && ((S = W.id), (Fe = !0)),
        ii || y !== E)
      ) {
        (Tt.buffers.depth.getReversed()
          ? (ct.copy(E.projectionMatrix),
            jc(ct),
            Kc(ct),
            oe.setValue(F, "projectionMatrix", ct))
          : oe.setValue(F, "projectionMatrix", E.projectionMatrix),
          oe.setValue(F, "viewMatrix", E.matrixWorldInverse));
        const En = oe.map.cameraPosition;
        (En !== void 0 &&
          En.setValue(F, Dt.setFromMatrixPosition(E.matrixWorld)),
          Vt.logarithmicDepthBuffer &&
            oe.setValue(
              F,
              "logDepthBufFC",
              2 / (Math.log(E.far + 1) / Math.LN2),
            ),
          (W.isMeshPhongMaterial ||
            W.isMeshToonMaterial ||
            W.isMeshLambertMaterial ||
            W.isMeshBasicMaterial ||
            W.isMeshStandardMaterial ||
            W.isShaderMaterial) &&
            oe.setValue(F, "isOrthographic", E.isOrthographicCamera === !0),
          y !== E && ((y = E), (Fe = !0), (zi = !0)));
      }
      if (N.isSkinnedMesh) {
        (oe.setOptional(F, N, "bindMatrix"),
          oe.setOptional(F, N, "bindMatrixInverse"));
        const Ge = N.skeleton;
        Ge &&
          (Ge.boneTexture === null && Ge.computeBoneTexture(),
          oe.setValue(F, "boneTexture", Ge.boneTexture, T));
      }
      N.isBatchedMesh &&
        (oe.setOptional(F, N, "batchingTexture"),
        oe.setValue(F, "batchingTexture", N._matricesTexture, T),
        oe.setOptional(F, N, "batchingIdTexture"),
        oe.setValue(F, "batchingIdTexture", N._indirectTexture, T),
        oe.setOptional(F, N, "batchingColorTexture"),
        N._colorsTexture !== null &&
          oe.setValue(F, "batchingColorTexture", N._colorsTexture, T));
      const Oi = V.morphAttributes;
      if (
        ((Oi.position !== void 0 ||
          Oi.normal !== void 0 ||
          Oi.color !== void 0) &&
          Rt.update(N, V, Ke),
        (Fe || Et.receiveShadow !== N.receiveShadow) &&
          ((Et.receiveShadow = N.receiveShadow),
          oe.setValue(F, "receiveShadow", N.receiveShadow)),
        W.isMeshGouraudMaterial &&
          W.envMap !== null &&
          ((en.envMap.value = Mt),
          (en.flipEnvMap.value =
            Mt.isCubeTexture && Mt.isRenderTargetTexture === !1 ? -1 : 1)),
        W.isMeshStandardMaterial &&
          W.envMap === null &&
          I.environment !== null &&
          (en.envMapIntensity.value = I.environmentIntensity),
        Fe &&
          (oe.setValue(F, "toneMappingExposure", _.toneMappingExposure),
          Et.needsLights && ql(en, zi),
          rt && W.fog === !0 && ht.refreshFogUniforms(en, rt),
          ht.refreshMaterialUniforms(
            en,
            W,
            O,
            q,
            f.state.transmissionRenderTarget[E.id],
          ),
          Fs.upload(F, Wa(Et), en, T)),
        W.isShaderMaterial &&
          W.uniformsNeedUpdate === !0 &&
          (Fs.upload(F, Wa(Et), en, T), (W.uniformsNeedUpdate = !1)),
        W.isSpriteMaterial && oe.setValue(F, "center", N.center),
        oe.setValue(F, "modelViewMatrix", N.modelViewMatrix),
        oe.setValue(F, "normalMatrix", N.normalMatrix),
        oe.setValue(F, "modelMatrix", N.matrixWorld),
        W.isShaderMaterial || W.isRawShaderMaterial)
      ) {
        const Ge = W.uniformsGroups;
        for (let En = 0, wn = Ge.length; En < wn; En++) {
          const Xa = Ge[En];
          (D.update(Xa, Ke), D.bind(Xa, Ke));
        }
      }
      return Ke;
    }
    function ql(E, I) {
      ((E.ambientLightColor.needsUpdate = I),
        (E.lightProbe.needsUpdate = I),
        (E.directionalLights.needsUpdate = I),
        (E.directionalLightShadows.needsUpdate = I),
        (E.pointLights.needsUpdate = I),
        (E.pointLightShadows.needsUpdate = I),
        (E.spotLights.needsUpdate = I),
        (E.spotLightShadows.needsUpdate = I),
        (E.rectAreaLights.needsUpdate = I),
        (E.hemisphereLights.needsUpdate = I));
    }
    function Xl(E) {
      return (
        E.isMeshLambertMaterial ||
        E.isMeshToonMaterial ||
        E.isMeshPhongMaterial ||
        E.isMeshStandardMaterial ||
        E.isShadowMaterial ||
        (E.isShaderMaterial && E.lights === !0)
      );
    }
    ((this.getActiveCubeFace = function () {
      return R;
    }),
      (this.getActiveMipmapLevel = function () {
        return A;
      }),
      (this.getRenderTarget = function () {
        return C;
      }),
      (this.setRenderTargetTextures = function (E, I, V) {
        ((wt.get(E.texture).__webglTexture = I),
          (wt.get(E.depthTexture).__webglTexture = V));
        const W = wt.get(E);
        ((W.__hasExternalTextures = !0),
          (W.__autoAllocateDepthBuffer = V === void 0),
          W.__autoAllocateDepthBuffer ||
            (Ht.has("WEBGL_multisampled_render_to_texture") === !0 &&
              (console.warn(
                "THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided",
              ),
              (W.__useRenderToTexture = !1))));
      }),
      (this.setRenderTargetFramebuffer = function (E, I) {
        const V = wt.get(E);
        ((V.__webglFramebuffer = I),
          (V.__useDefaultFramebuffer = I === void 0));
      }),
      (this.setRenderTarget = function (E, I = 0, V = 0) {
        ((C = E), (R = I), (A = V));
        let W = !0,
          N = null,
          rt = !1,
          dt = !1;
        if (E) {
          const Mt = wt.get(E);
          if (Mt.__useDefaultFramebuffer !== void 0)
            (Tt.bindFramebuffer(F.FRAMEBUFFER, null), (W = !1));
          else if (Mt.__webglFramebuffer === void 0) T.setupRenderTarget(E);
          else if (Mt.__hasExternalTextures)
            T.rebindTextures(
              E,
              wt.get(E.texture).__webglTexture,
              wt.get(E.depthTexture).__webglTexture,
            );
          else if (E.depthBuffer) {
            const yt = E.depthTexture;
            if (Mt.__boundDepthTexture !== yt) {
              if (
                yt !== null &&
                wt.has(yt) &&
                (E.width !== yt.image.width || E.height !== yt.image.height)
              )
                throw new Error(
                  "WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.",
                );
              T.setupDepthRenderbuffer(E);
            }
          }
          const Ct = E.texture;
          (Ct.isData3DTexture ||
            Ct.isDataArrayTexture ||
            Ct.isCompressedArrayTexture) &&
            (dt = !0);
          const Ft = wt.get(E).__webglFramebuffer;
          (E.isWebGLCubeRenderTarget
            ? (Array.isArray(Ft[I]) ? (N = Ft[I][V]) : (N = Ft[I]), (rt = !0))
            : E.samples > 0 && T.useMultisampledRTT(E) === !1
              ? (N = wt.get(E).__webglMultisampledFramebuffer)
              : Array.isArray(Ft)
                ? (N = Ft[V])
                : (N = Ft),
            P.copy(E.viewport),
            z.copy(E.scissor),
            (U = E.scissorTest));
        } else
          (P.copy(nt).multiplyScalar(O).floor(),
            z.copy(_t).multiplyScalar(O).floor(),
            (U = Lt));
        if (
          (Tt.bindFramebuffer(F.FRAMEBUFFER, N) && W && Tt.drawBuffers(E, N),
          Tt.viewport(P),
          Tt.scissor(z),
          Tt.setScissorTest(U),
          rt)
        ) {
          const Mt = wt.get(E.texture);
          F.framebufferTexture2D(
            F.FRAMEBUFFER,
            F.COLOR_ATTACHMENT0,
            F.TEXTURE_CUBE_MAP_POSITIVE_X + I,
            Mt.__webglTexture,
            V,
          );
        } else if (dt) {
          const Mt = wt.get(E.texture),
            Ct = I || 0;
          F.framebufferTextureLayer(
            F.FRAMEBUFFER,
            F.COLOR_ATTACHMENT0,
            Mt.__webglTexture,
            V || 0,
            Ct,
          );
        }
        S = -1;
      }),
      (this.readRenderTargetPixels = function (E, I, V, W, N, rt, dt) {
        if (!(E && E.isWebGLRenderTarget)) {
          console.error(
            "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.",
          );
          return;
        }
        let xt = wt.get(E).__webglFramebuffer;
        if ((E.isWebGLCubeRenderTarget && dt !== void 0 && (xt = xt[dt]), xt)) {
          Tt.bindFramebuffer(F.FRAMEBUFFER, xt);
          try {
            const Mt = E.texture,
              Ct = Mt.format,
              Ft = Mt.type;
            if (!Vt.textureFormatReadable(Ct)) {
              console.error(
                "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.",
              );
              return;
            }
            if (!Vt.textureTypeReadable(Ft)) {
              console.error(
                "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.",
              );
              return;
            }
            I >= 0 &&
              I <= E.width - W &&
              V >= 0 &&
              V <= E.height - N &&
              F.readPixels(I, V, W, N, Ot.convert(Ct), Ot.convert(Ft), rt);
          } finally {
            const Mt = C !== null ? wt.get(C).__webglFramebuffer : null;
            Tt.bindFramebuffer(F.FRAMEBUFFER, Mt);
          }
        }
      }),
      (this.readRenderTargetPixelsAsync = async function (
        E,
        I,
        V,
        W,
        N,
        rt,
        dt,
      ) {
        if (!(E && E.isWebGLRenderTarget))
          throw new Error(
            "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.",
          );
        let xt = wt.get(E).__webglFramebuffer;
        if ((E.isWebGLCubeRenderTarget && dt !== void 0 && (xt = xt[dt]), xt)) {
          const Mt = E.texture,
            Ct = Mt.format,
            Ft = Mt.type;
          if (!Vt.textureFormatReadable(Ct))
            throw new Error(
              "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.",
            );
          if (!Vt.textureTypeReadable(Ft))
            throw new Error(
              "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.",
            );
          if (I >= 0 && I <= E.width - W && V >= 0 && V <= E.height - N) {
            Tt.bindFramebuffer(F.FRAMEBUFFER, xt);
            const yt = F.createBuffer();
            (F.bindBuffer(F.PIXEL_PACK_BUFFER, yt),
              F.bufferData(F.PIXEL_PACK_BUFFER, rt.byteLength, F.STREAM_READ),
              F.readPixels(I, V, W, N, Ot.convert(Ct), Ot.convert(Ft), 0));
            const Yt = C !== null ? wt.get(C).__webglFramebuffer : null;
            Tt.bindFramebuffer(F.FRAMEBUFFER, Yt);
            const se = F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE, 0);
            return (
              F.flush(),
              await Yc(F, se, 4),
              F.bindBuffer(F.PIXEL_PACK_BUFFER, yt),
              F.getBufferSubData(F.PIXEL_PACK_BUFFER, 0, rt),
              F.deleteBuffer(yt),
              F.deleteSync(se),
              rt
            );
          } else
            throw new Error(
              "THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.",
            );
        }
      }),
      (this.copyFramebufferToTexture = function (E, I = null, V = 0) {
        E.isTexture !== !0 &&
          (Yi(
            "WebGLRenderer: copyFramebufferToTexture function signature has changed.",
          ),
          (I = arguments[0] || null),
          (E = arguments[1]));
        const W = Math.pow(2, -V),
          N = Math.floor(E.image.width * W),
          rt = Math.floor(E.image.height * W),
          dt = I !== null ? I.x : 0,
          xt = I !== null ? I.y : 0;
        (T.setTexture2D(E, 0),
          F.copyTexSubImage2D(F.TEXTURE_2D, V, 0, 0, dt, xt, N, rt),
          Tt.unbindTexture());
      }),
      (this.copyTextureToTexture = function (E, I, V = null, W = null, N = 0) {
        E.isTexture !== !0 &&
          (Yi(
            "WebGLRenderer: copyTextureToTexture function signature has changed.",
          ),
          (W = arguments[0] || null),
          (E = arguments[1]),
          (I = arguments[2]),
          (N = arguments[3] || 0),
          (V = null));
        let rt, dt, xt, Mt, Ct, Ft, yt, Yt, se;
        const ae = E.isCompressedTexture ? E.mipmaps[N] : E.image;
        (V !== null
          ? ((rt = V.max.x - V.min.x),
            (dt = V.max.y - V.min.y),
            (xt = V.isBox3 ? V.max.z - V.min.z : 1),
            (Mt = V.min.x),
            (Ct = V.min.y),
            (Ft = V.isBox3 ? V.min.z : 0))
          : ((rt = ae.width),
            (dt = ae.height),
            (xt = ae.depth || 1),
            (Mt = 0),
            (Ct = 0),
            (Ft = 0)),
          W !== null
            ? ((yt = W.x), (Yt = W.y), (se = W.z))
            : ((yt = 0), (Yt = 0), (se = 0)));
        const De = Ot.convert(I.format),
          Kt = Ot.convert(I.type);
        let Et;
        (I.isData3DTexture
          ? (T.setTexture3D(I, 0), (Et = F.TEXTURE_3D))
          : I.isDataArrayTexture || I.isCompressedArrayTexture
            ? (T.setTexture2DArray(I, 0), (Et = F.TEXTURE_2D_ARRAY))
            : (T.setTexture2D(I, 0), (Et = F.TEXTURE_2D)),
          F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL, I.flipY),
          F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL, I.premultiplyAlpha),
          F.pixelStorei(F.UNPACK_ALIGNMENT, I.unpackAlignment));
        const ln = F.getParameter(F.UNPACK_ROW_LENGTH),
          $t = F.getParameter(F.UNPACK_IMAGE_HEIGHT),
          Ke = F.getParameter(F.UNPACK_SKIP_PIXELS),
          ii = F.getParameter(F.UNPACK_SKIP_ROWS),
          Fe = F.getParameter(F.UNPACK_SKIP_IMAGES);
        (F.pixelStorei(F.UNPACK_ROW_LENGTH, ae.width),
          F.pixelStorei(F.UNPACK_IMAGE_HEIGHT, ae.height),
          F.pixelStorei(F.UNPACK_SKIP_PIXELS, Mt),
          F.pixelStorei(F.UNPACK_SKIP_ROWS, Ct),
          F.pixelStorei(F.UNPACK_SKIP_IMAGES, Ft));
        const zi = E.isDataArrayTexture || E.isData3DTexture,
          oe = I.isDataArrayTexture || I.isData3DTexture;
        if (E.isRenderTargetTexture || E.isDepthTexture) {
          const en = wt.get(E),
            Oi = wt.get(I),
            Ge = wt.get(en.__renderTarget),
            En = wt.get(Oi.__renderTarget);
          (Tt.bindFramebuffer(F.READ_FRAMEBUFFER, Ge.__webglFramebuffer),
            Tt.bindFramebuffer(F.DRAW_FRAMEBUFFER, En.__webglFramebuffer));
          for (let wn = 0; wn < xt; wn++)
            (zi &&
              F.framebufferTextureLayer(
                F.READ_FRAMEBUFFER,
                F.COLOR_ATTACHMENT0,
                wt.get(E).__webglTexture,
                N,
                Ft + wn,
              ),
              E.isDepthTexture
                ? (oe &&
                    F.framebufferTextureLayer(
                      F.DRAW_FRAMEBUFFER,
                      F.COLOR_ATTACHMENT0,
                      wt.get(I).__webglTexture,
                      N,
                      se + wn,
                    ),
                  F.blitFramebuffer(
                    Mt,
                    Ct,
                    rt,
                    dt,
                    yt,
                    Yt,
                    rt,
                    dt,
                    F.DEPTH_BUFFER_BIT,
                    F.NEAREST,
                  ))
                : oe
                  ? F.copyTexSubImage3D(Et, N, yt, Yt, se + wn, Mt, Ct, rt, dt)
                  : F.copyTexSubImage2D(
                      Et,
                      N,
                      yt,
                      Yt,
                      se + wn,
                      Mt,
                      Ct,
                      rt,
                      dt,
                    ));
          (Tt.bindFramebuffer(F.READ_FRAMEBUFFER, null),
            Tt.bindFramebuffer(F.DRAW_FRAMEBUFFER, null));
        } else
          oe
            ? E.isDataTexture || E.isData3DTexture
              ? F.texSubImage3D(Et, N, yt, Yt, se, rt, dt, xt, De, Kt, ae.data)
              : I.isCompressedArrayTexture
                ? F.compressedTexSubImage3D(
                    Et,
                    N,
                    yt,
                    Yt,
                    se,
                    rt,
                    dt,
                    xt,
                    De,
                    ae.data,
                  )
                : F.texSubImage3D(Et, N, yt, Yt, se, rt, dt, xt, De, Kt, ae)
            : E.isDataTexture
              ? F.texSubImage2D(
                  F.TEXTURE_2D,
                  N,
                  yt,
                  Yt,
                  rt,
                  dt,
                  De,
                  Kt,
                  ae.data,
                )
              : E.isCompressedTexture
                ? F.compressedTexSubImage2D(
                    F.TEXTURE_2D,
                    N,
                    yt,
                    Yt,
                    ae.width,
                    ae.height,
                    De,
                    ae.data,
                  )
                : F.texSubImage2D(F.TEXTURE_2D, N, yt, Yt, rt, dt, De, Kt, ae);
        (F.pixelStorei(F.UNPACK_ROW_LENGTH, ln),
          F.pixelStorei(F.UNPACK_IMAGE_HEIGHT, $t),
          F.pixelStorei(F.UNPACK_SKIP_PIXELS, Ke),
          F.pixelStorei(F.UNPACK_SKIP_ROWS, ii),
          F.pixelStorei(F.UNPACK_SKIP_IMAGES, Fe),
          N === 0 && I.generateMipmaps && F.generateMipmap(Et),
          Tt.unbindTexture());
      }),
      (this.copyTextureToTexture3D = function (
        E,
        I,
        V = null,
        W = null,
        N = 0,
      ) {
        return (
          E.isTexture !== !0 &&
            (Yi(
              "WebGLRenderer: copyTextureToTexture3D function signature has changed.",
            ),
            (V = arguments[0] || null),
            (W = arguments[1] || null),
            (E = arguments[2]),
            (I = arguments[3]),
            (N = arguments[4] || 0)),
          Yi(
            'WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.',
          ),
          this.copyTextureToTexture(E, I, V, W, N)
        );
      }),
      (this.initRenderTarget = function (E) {
        wt.get(E).__webglFramebuffer === void 0 && T.setupRenderTarget(E);
      }),
      (this.initTexture = function (E) {
        (E.isCubeTexture
          ? T.setTextureCube(E, 0)
          : E.isData3DTexture
            ? T.setTexture3D(E, 0)
            : E.isDataArrayTexture || E.isCompressedArrayTexture
              ? T.setTexture2DArray(E, 0)
              : T.setTexture2D(E, 0),
          Tt.unbindTexture());
      }),
      (this.resetState = function () {
        ((R = 0), (A = 0), (C = null), Tt.reset(), ie.reset());
      }),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this }),
        ));
  }
  get coordinateSystem() {
    return vn;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(t) {
    this._outputColorSpace = t;
    const e = this.getContext();
    ((e.drawingBufferColorspace = Xt._getDrawingBufferColorSpace(t)),
      (e.unpackColorSpace = Xt._getUnpackColorSpace()));
  }
}
class Ua {
  constructor(t, e = 25e-5) {
    ((this.isFogExp2 = !0),
      (this.name = ""),
      (this.color = new Pt(t)),
      (this.density = e));
  }
  clone() {
    return new Ua(this.color, this.density);
  }
  toJSON() {
    return {
      type: "FogExp2",
      name: this.name,
      color: this.color.getHex(),
      density: this.density,
    };
  }
}
class zs extends ne {
  constructor() {
    (super(),
      (this.isScene = !0),
      (this.type = "Scene"),
      (this.background = null),
      (this.environment = null),
      (this.fog = null),
      (this.backgroundBlurriness = 0),
      (this.backgroundIntensity = 1),
      (this.backgroundRotation = new Ee()),
      (this.environmentIntensity = 1),
      (this.environmentRotation = new Ee()),
      (this.overrideMaterial = null),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this }),
        ));
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      t.background !== null && (this.background = t.background.clone()),
      t.environment !== null && (this.environment = t.environment.clone()),
      t.fog !== null && (this.fog = t.fog.clone()),
      (this.backgroundBlurriness = t.backgroundBlurriness),
      (this.backgroundIntensity = t.backgroundIntensity),
      this.backgroundRotation.copy(t.backgroundRotation),
      (this.environmentIntensity = t.environmentIntensity),
      this.environmentRotation.copy(t.environmentRotation),
      t.overrideMaterial !== null &&
        (this.overrideMaterial = t.overrideMaterial.clone()),
      (this.matrixAutoUpdate = t.matrixAutoUpdate),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      this.fog !== null && (e.object.fog = this.fog.toJSON()),
      this.backgroundBlurriness > 0 &&
        (e.object.backgroundBlurriness = this.backgroundBlurriness),
      this.backgroundIntensity !== 1 &&
        (e.object.backgroundIntensity = this.backgroundIntensity),
      (e.object.backgroundRotation = this.backgroundRotation.toArray()),
      this.environmentIntensity !== 1 &&
        (e.object.environmentIntensity = this.environmentIntensity),
      (e.object.environmentRotation = this.environmentRotation.toArray()),
      e
    );
  }
}
class a0 extends Pe {
  constructor(t = null, e = 1, n = 1, s, r, a, l, o, c = ke, h = ke, d, u) {
    (super(null, a, l, o, c, h, s, r, d, u),
      (this.isDataTexture = !0),
      (this.image = { data: t, width: e, height: n }),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1));
  }
}
class fe extends Ye {
  constructor(t, e, n, s = 1) {
    (super(t, e, n),
      (this.isInstancedBufferAttribute = !0),
      (this.meshPerAttribute = s));
  }
  copy(t) {
    return (super.copy(t), (this.meshPerAttribute = t.meshPerAttribute), this);
  }
  toJSON() {
    const t = super.toJSON();
    return (
      (t.meshPerAttribute = this.meshPerAttribute),
      (t.isInstancedBufferAttribute = !0),
      t
    );
  }
}
const _i = new Zt(),
  qo = new Zt(),
  bs = [],
  Xo = new ti(),
  o0 = new Zt(),
  Gi = new Ut(),
  Wi = new es();
class _a extends Ut {
  constructor(t, e, n) {
    (super(t, e),
      (this.isInstancedMesh = !0),
      (this.instanceMatrix = new fe(new Float32Array(n * 16), 16)),
      (this.instanceColor = null),
      (this.morphTexture = null),
      (this.count = n),
      (this.boundingBox = null),
      (this.boundingSphere = null));
    for (let s = 0; s < n; s++) this.setMatrixAt(s, o0);
  }
  computeBoundingBox() {
    const t = this.geometry,
      e = this.count;
    (this.boundingBox === null && (this.boundingBox = new ti()),
      t.boundingBox === null && t.computeBoundingBox(),
      this.boundingBox.makeEmpty());
    for (let n = 0; n < e; n++)
      (this.getMatrixAt(n, _i),
        Xo.copy(t.boundingBox).applyMatrix4(_i),
        this.boundingBox.union(Xo));
  }
  computeBoundingSphere() {
    const t = this.geometry,
      e = this.count;
    (this.boundingSphere === null && (this.boundingSphere = new es()),
      t.boundingSphere === null && t.computeBoundingSphere(),
      this.boundingSphere.makeEmpty());
    for (let n = 0; n < e; n++)
      (this.getMatrixAt(n, _i),
        Wi.copy(t.boundingSphere).applyMatrix4(_i),
        this.boundingSphere.union(Wi));
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      this.instanceMatrix.copy(t.instanceMatrix),
      t.morphTexture !== null && (this.morphTexture = t.morphTexture.clone()),
      t.instanceColor !== null &&
        (this.instanceColor = t.instanceColor.clone()),
      (this.count = t.count),
      t.boundingBox !== null && (this.boundingBox = t.boundingBox.clone()),
      t.boundingSphere !== null &&
        (this.boundingSphere = t.boundingSphere.clone()),
      this
    );
  }
  getColorAt(t, e) {
    e.fromArray(this.instanceColor.array, t * 3);
  }
  getMatrixAt(t, e) {
    e.fromArray(this.instanceMatrix.array, t * 16);
  }
  getMorphAt(t, e) {
    const n = e.morphTargetInfluences,
      s = this.morphTexture.source.data.data,
      r = n.length + 1,
      a = t * r + 1;
    for (let l = 0; l < n.length; l++) n[l] = s[a + l];
  }
  raycast(t, e) {
    const n = this.matrixWorld,
      s = this.count;
    if (
      ((Gi.geometry = this.geometry),
      (Gi.material = this.material),
      Gi.material !== void 0 &&
        (this.boundingSphere === null && this.computeBoundingSphere(),
        Wi.copy(this.boundingSphere),
        Wi.applyMatrix4(n),
        t.ray.intersectsSphere(Wi) !== !1))
    )
      for (let r = 0; r < s; r++) {
        (this.getMatrixAt(r, _i),
          qo.multiplyMatrices(n, _i),
          (Gi.matrixWorld = qo),
          Gi.raycast(t, bs));
        for (let a = 0, l = bs.length; a < l; a++) {
          const o = bs[a];
          ((o.instanceId = r), (o.object = this), e.push(o));
        }
        bs.length = 0;
      }
  }
  setColorAt(t, e) {
    (this.instanceColor === null &&
      (this.instanceColor = new fe(
        new Float32Array(this.instanceMatrix.count * 3).fill(1),
        3,
      )),
      e.toArray(this.instanceColor.array, t * 3));
  }
  setMatrixAt(t, e) {
    e.toArray(this.instanceMatrix.array, t * 16);
  }
  setMorphAt(t, e) {
    const n = e.morphTargetInfluences,
      s = n.length + 1;
    this.morphTexture === null &&
      (this.morphTexture = new a0(
        new Float32Array(s * this.count),
        s,
        this.count,
        Ta,
        rn,
      ));
    const r = this.morphTexture.source.data.data;
    let a = 0;
    for (let c = 0; c < n.length; c++) a += n[c];
    const l = this.geometry.morphTargetsRelative ? 1 : 1 - a,
      o = s * t;
    ((r[o] = l), r.set(n, o + 1));
  }
  updateMorphTargets() {}
  dispose() {
    return (
      this.dispatchEvent({ type: "dispose" }),
      this.morphTexture !== null &&
        (this.morphTexture.dispose(), (this.morphTexture = null)),
      this
    );
  }
}
class qs extends Le {
  constructor(t = 1, e = 32, n = 0, s = Math.PI * 2) {
    (super(),
      (this.type = "CircleGeometry"),
      (this.parameters = {
        radius: t,
        segments: e,
        thetaStart: n,
        thetaLength: s,
      }),
      (e = Math.max(3, e)));
    const r = [],
      a = [],
      l = [],
      o = [],
      c = new b(),
      h = new It();
    (a.push(0, 0, 0), l.push(0, 0, 1), o.push(0.5, 0.5));
    for (let d = 0, u = 3; d <= e; d++, u += 3) {
      const m = n + (d / e) * s;
      ((c.x = t * Math.cos(m)),
        (c.y = t * Math.sin(m)),
        a.push(c.x, c.y, c.z),
        l.push(0, 0, 1),
        (h.x = (a[u] / t + 1) / 2),
        (h.y = (a[u + 1] / t + 1) / 2),
        o.push(h.x, h.y));
    }
    for (let d = 1; d <= e; d++) r.push(d, d + 1, 0);
    (this.setIndex(r),
      this.setAttribute("position", new he(a, 3)),
      this.setAttribute("normal", new he(l, 3)),
      this.setAttribute("uv", new he(o, 2)));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.parameters = Object.assign({}, t.parameters)),
      this
    );
  }
  static fromJSON(t) {
    return new qs(t.radius, t.segments, t.thetaStart, t.thetaLength);
  }
}
class ei extends Le {
  constructor(
    t = 1,
    e = 1,
    n = 1,
    s = 32,
    r = 1,
    a = !1,
    l = 0,
    o = Math.PI * 2,
  ) {
    (super(),
      (this.type = "CylinderGeometry"),
      (this.parameters = {
        radiusTop: t,
        radiusBottom: e,
        height: n,
        radialSegments: s,
        heightSegments: r,
        openEnded: a,
        thetaStart: l,
        thetaLength: o,
      }));
    const c = this;
    ((s = Math.floor(s)), (r = Math.floor(r)));
    const h = [],
      d = [],
      u = [],
      m = [];
    let g = 0;
    const v = [],
      p = n / 2;
    let f = 0;
    (w(),
      a === !1 && (t > 0 && M(!0), e > 0 && M(!1)),
      this.setIndex(h),
      this.setAttribute("position", new he(d, 3)),
      this.setAttribute("normal", new he(u, 3)),
      this.setAttribute("uv", new he(m, 2)));
    function w() {
      const _ = new b(),
        L = new b();
      let R = 0;
      const A = (e - t) / n;
      for (let C = 0; C <= r; C++) {
        const S = [],
          y = C / r,
          P = y * (e - t) + t;
        for (let z = 0; z <= s; z++) {
          const U = z / s,
            H = U * o + l,
            k = Math.sin(H),
            G = Math.cos(H);
          ((L.x = P * k),
            (L.y = -y * n + p),
            (L.z = P * G),
            d.push(L.x, L.y, L.z),
            _.set(k, A, G).normalize(),
            u.push(_.x, _.y, _.z),
            m.push(U, 1 - y),
            S.push(g++));
        }
        v.push(S);
      }
      for (let C = 0; C < s; C++)
        for (let S = 0; S < r; S++) {
          const y = v[S][C],
            P = v[S + 1][C],
            z = v[S + 1][C + 1],
            U = v[S][C + 1];
          ((t > 0 || S !== 0) && (h.push(y, P, U), (R += 3)),
            (e > 0 || S !== r - 1) && (h.push(P, z, U), (R += 3)));
        }
      (c.addGroup(f, R, 0), (f += R));
    }
    function M(_) {
      const L = g,
        R = new It(),
        A = new b();
      let C = 0;
      const S = _ === !0 ? t : e,
        y = _ === !0 ? 1 : -1;
      for (let z = 1; z <= s; z++)
        (d.push(0, p * y, 0), u.push(0, y, 0), m.push(0.5, 0.5), g++);
      const P = g;
      for (let z = 0; z <= s; z++) {
        const H = (z / s) * o + l,
          k = Math.cos(H),
          G = Math.sin(H);
        ((A.x = S * G),
          (A.y = p * y),
          (A.z = S * k),
          d.push(A.x, A.y, A.z),
          u.push(0, y, 0),
          (R.x = k * 0.5 + 0.5),
          (R.y = G * 0.5 * y + 0.5),
          m.push(R.x, R.y),
          g++);
      }
      for (let z = 0; z < s; z++) {
        const U = L + z,
          H = P + z;
        (_ === !0 ? h.push(H, H + 1, U) : h.push(H + 1, H, U), (C += 3));
      }
      (c.addGroup(f, C, _ === !0 ? 1 : 2), (f += C));
    }
  }
  copy(t) {
    return (
      super.copy(t),
      (this.parameters = Object.assign({}, t.parameters)),
      this
    );
  }
  static fromJSON(t) {
    return new ei(
      t.radiusTop,
      t.radiusBottom,
      t.height,
      t.radialSegments,
      t.heightSegments,
      t.openEnded,
      t.thetaStart,
      t.thetaLength,
    );
  }
}
class Ji extends ei {
  constructor(t = 1, e = 1, n = 32, s = 1, r = !1, a = 0, l = Math.PI * 2) {
    (super(0, t, e, n, s, r, a, l),
      (this.type = "ConeGeometry"),
      (this.parameters = {
        radius: t,
        height: e,
        radialSegments: n,
        heightSegments: s,
        openEnded: r,
        thetaStart: a,
        thetaLength: l,
      }));
  }
  static fromJSON(t) {
    return new Ji(
      t.radius,
      t.height,
      t.radialSegments,
      t.heightSegments,
      t.openEnded,
      t.thetaStart,
      t.thetaLength,
    );
  }
}
class Ia extends Le {
  constructor(t = [], e = [], n = 1, s = 0) {
    (super(),
      (this.type = "PolyhedronGeometry"),
      (this.parameters = { vertices: t, indices: e, radius: n, detail: s }));
    const r = [],
      a = [];
    (l(s),
      c(n),
      h(),
      this.setAttribute("position", new he(r, 3)),
      this.setAttribute("normal", new he(r.slice(), 3)),
      this.setAttribute("uv", new he(a, 2)),
      s === 0 ? this.computeVertexNormals() : this.normalizeNormals());
    function l(w) {
      const M = new b(),
        _ = new b(),
        L = new b();
      for (let R = 0; R < e.length; R += 3)
        (m(e[R + 0], M), m(e[R + 1], _), m(e[R + 2], L), o(M, _, L, w));
    }
    function o(w, M, _, L) {
      const R = L + 1,
        A = [];
      for (let C = 0; C <= R; C++) {
        A[C] = [];
        const S = w.clone().lerp(_, C / R),
          y = M.clone().lerp(_, C / R),
          P = R - C;
        for (let z = 0; z <= P; z++)
          z === 0 && C === R
            ? (A[C][z] = S)
            : (A[C][z] = S.clone().lerp(y, z / P));
      }
      for (let C = 0; C < R; C++)
        for (let S = 0; S < 2 * (R - C) - 1; S++) {
          const y = Math.floor(S / 2);
          S % 2 === 0
            ? (u(A[C][y + 1]), u(A[C + 1][y]), u(A[C][y]))
            : (u(A[C][y + 1]), u(A[C + 1][y + 1]), u(A[C + 1][y]));
        }
    }
    function c(w) {
      const M = new b();
      for (let _ = 0; _ < r.length; _ += 3)
        ((M.x = r[_ + 0]),
          (M.y = r[_ + 1]),
          (M.z = r[_ + 2]),
          M.normalize().multiplyScalar(w),
          (r[_ + 0] = M.x),
          (r[_ + 1] = M.y),
          (r[_ + 2] = M.z));
    }
    function h() {
      const w = new b();
      for (let M = 0; M < r.length; M += 3) {
        ((w.x = r[M + 0]), (w.y = r[M + 1]), (w.z = r[M + 2]));
        const _ = p(w) / 2 / Math.PI + 0.5,
          L = f(w) / Math.PI + 0.5;
        a.push(_, 1 - L);
      }
      (g(), d());
    }
    function d() {
      for (let w = 0; w < a.length; w += 6) {
        const M = a[w + 0],
          _ = a[w + 2],
          L = a[w + 4],
          R = Math.max(M, _, L),
          A = Math.min(M, _, L);
        R > 0.9 &&
          A < 0.1 &&
          (M < 0.2 && (a[w + 0] += 1),
          _ < 0.2 && (a[w + 2] += 1),
          L < 0.2 && (a[w + 4] += 1));
      }
    }
    function u(w) {
      r.push(w.x, w.y, w.z);
    }
    function m(w, M) {
      const _ = w * 3;
      ((M.x = t[_ + 0]), (M.y = t[_ + 1]), (M.z = t[_ + 2]));
    }
    function g() {
      const w = new b(),
        M = new b(),
        _ = new b(),
        L = new b(),
        R = new It(),
        A = new It(),
        C = new It();
      for (let S = 0, y = 0; S < r.length; S += 9, y += 6) {
        (w.set(r[S + 0], r[S + 1], r[S + 2]),
          M.set(r[S + 3], r[S + 4], r[S + 5]),
          _.set(r[S + 6], r[S + 7], r[S + 8]),
          R.set(a[y + 0], a[y + 1]),
          A.set(a[y + 2], a[y + 3]),
          C.set(a[y + 4], a[y + 5]),
          L.copy(w).add(M).add(_).divideScalar(3));
        const P = p(L);
        (v(R, y + 0, w, P), v(A, y + 2, M, P), v(C, y + 4, _, P));
      }
    }
    function v(w, M, _, L) {
      (L < 0 && w.x === 1 && (a[M] = w.x - 1),
        _.x === 0 && _.z === 0 && (a[M] = L / 2 / Math.PI + 0.5));
    }
    function p(w) {
      return Math.atan2(w.z, -w.x);
    }
    function f(w) {
      return Math.atan2(-w.y, Math.sqrt(w.x * w.x + w.z * w.z));
    }
  }
  copy(t) {
    return (
      super.copy(t),
      (this.parameters = Object.assign({}, t.parameters)),
      this
    );
  }
  static fromJSON(t) {
    return new Ia(t.vertices, t.indices, t.radius, t.details);
  }
}
class Na extends Ia {
  constructor(t = 1, e = 0) {
    const n = [1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1],
      s = [
        0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2,
      ];
    (super(n, s, t, e),
      (this.type = "OctahedronGeometry"),
      (this.parameters = { radius: t, detail: e }));
  }
  static fromJSON(t) {
    return new Na(t.radius, t.detail);
  }
}
class ni extends Le {
  constructor(
    t = 1,
    e = 32,
    n = 16,
    s = 0,
    r = Math.PI * 2,
    a = 0,
    l = Math.PI,
  ) {
    (super(),
      (this.type = "SphereGeometry"),
      (this.parameters = {
        radius: t,
        widthSegments: e,
        heightSegments: n,
        phiStart: s,
        phiLength: r,
        thetaStart: a,
        thetaLength: l,
      }),
      (e = Math.max(3, Math.floor(e))),
      (n = Math.max(2, Math.floor(n))));
    const o = Math.min(a + l, Math.PI);
    let c = 0;
    const h = [],
      d = new b(),
      u = new b(),
      m = [],
      g = [],
      v = [],
      p = [];
    for (let f = 0; f <= n; f++) {
      const w = [],
        M = f / n;
      let _ = 0;
      f === 0 && a === 0
        ? (_ = 0.5 / e)
        : f === n && o === Math.PI && (_ = -0.5 / e);
      for (let L = 0; L <= e; L++) {
        const R = L / e;
        ((d.x = -t * Math.cos(s + R * r) * Math.sin(a + M * l)),
          (d.y = t * Math.cos(a + M * l)),
          (d.z = t * Math.sin(s + R * r) * Math.sin(a + M * l)),
          g.push(d.x, d.y, d.z),
          u.copy(d).normalize(),
          v.push(u.x, u.y, u.z),
          p.push(R + _, 1 - M),
          w.push(c++));
      }
      h.push(w);
    }
    for (let f = 0; f < n; f++)
      for (let w = 0; w < e; w++) {
        const M = h[f][w + 1],
          _ = h[f][w],
          L = h[f + 1][w],
          R = h[f + 1][w + 1];
        ((f !== 0 || a > 0) && m.push(M, _, R),
          (f !== n - 1 || o < Math.PI) && m.push(_, L, R));
      }
    (this.setIndex(m),
      this.setAttribute("position", new he(g, 3)),
      this.setAttribute("normal", new he(v, 3)),
      this.setAttribute("uv", new he(p, 2)));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.parameters = Object.assign({}, t.parameters)),
      this
    );
  }
  static fromJSON(t) {
    return new ni(
      t.radius,
      t.widthSegments,
      t.heightSegments,
      t.phiStart,
      t.phiLength,
      t.thetaStart,
      t.thetaLength,
    );
  }
}
class Di extends Le {
  constructor(t = 1, e = 0.4, n = 12, s = 48, r = Math.PI * 2) {
    (super(),
      (this.type = "TorusGeometry"),
      (this.parameters = {
        radius: t,
        tube: e,
        radialSegments: n,
        tubularSegments: s,
        arc: r,
      }),
      (n = Math.floor(n)),
      (s = Math.floor(s)));
    const a = [],
      l = [],
      o = [],
      c = [],
      h = new b(),
      d = new b(),
      u = new b();
    for (let m = 0; m <= n; m++)
      for (let g = 0; g <= s; g++) {
        const v = (g / s) * r,
          p = (m / n) * Math.PI * 2;
        ((d.x = (t + e * Math.cos(p)) * Math.cos(v)),
          (d.y = (t + e * Math.cos(p)) * Math.sin(v)),
          (d.z = e * Math.sin(p)),
          l.push(d.x, d.y, d.z),
          (h.x = t * Math.cos(v)),
          (h.y = t * Math.sin(v)),
          u.subVectors(d, h).normalize(),
          o.push(u.x, u.y, u.z),
          c.push(g / s),
          c.push(m / n));
      }
    for (let m = 1; m <= n; m++)
      for (let g = 1; g <= s; g++) {
        const v = (s + 1) * m + g - 1,
          p = (s + 1) * (m - 1) + g - 1,
          f = (s + 1) * (m - 1) + g,
          w = (s + 1) * m + g;
        (a.push(v, p, w), a.push(p, f, w));
      }
    (this.setIndex(a),
      this.setAttribute("position", new he(l, 3)),
      this.setAttribute("normal", new he(o, 3)),
      this.setAttribute("uv", new he(c, 2)));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.parameters = Object.assign({}, t.parameters)),
      this
    );
  }
  static fromJSON(t) {
    return new Di(t.radius, t.tube, t.radialSegments, t.tubularSegments, t.arc);
  }
}
class le extends ns {
  static get type() {
    return "MeshStandardMaterial";
  }
  constructor(t) {
    (super(),
      (this.isMeshStandardMaterial = !0),
      (this.defines = { STANDARD: "" }),
      (this.color = new Pt(16777215)),
      (this.roughness = 1),
      (this.metalness = 0),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.emissive = new Pt(0)),
      (this.emissiveIntensity = 1),
      (this.emissiveMap = null),
      (this.bumpMap = null),
      (this.bumpScale = 1),
      (this.normalMap = null),
      (this.normalMapType = xl),
      (this.normalScale = new It(1, 1)),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.roughnessMap = null),
      (this.metalnessMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new Ee()),
      (this.envMapIntensity = 1),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.flatShading = !1),
      (this.fog = !0),
      this.setValues(t));
  }
  copy(t) {
    return (
      super.copy(t),
      (this.defines = { STANDARD: "" }),
      this.color.copy(t.color),
      (this.roughness = t.roughness),
      (this.metalness = t.metalness),
      (this.map = t.map),
      (this.lightMap = t.lightMap),
      (this.lightMapIntensity = t.lightMapIntensity),
      (this.aoMap = t.aoMap),
      (this.aoMapIntensity = t.aoMapIntensity),
      this.emissive.copy(t.emissive),
      (this.emissiveMap = t.emissiveMap),
      (this.emissiveIntensity = t.emissiveIntensity),
      (this.bumpMap = t.bumpMap),
      (this.bumpScale = t.bumpScale),
      (this.normalMap = t.normalMap),
      (this.normalMapType = t.normalMapType),
      this.normalScale.copy(t.normalScale),
      (this.displacementMap = t.displacementMap),
      (this.displacementScale = t.displacementScale),
      (this.displacementBias = t.displacementBias),
      (this.roughnessMap = t.roughnessMap),
      (this.metalnessMap = t.metalnessMap),
      (this.alphaMap = t.alphaMap),
      (this.envMap = t.envMap),
      this.envMapRotation.copy(t.envMapRotation),
      (this.envMapIntensity = t.envMapIntensity),
      (this.wireframe = t.wireframe),
      (this.wireframeLinewidth = t.wireframeLinewidth),
      (this.wireframeLinecap = t.wireframeLinecap),
      (this.wireframeLinejoin = t.wireframeLinejoin),
      (this.flatShading = t.flatShading),
      (this.fog = t.fog),
      this
    );
  }
}
class Fa extends ne {
  constructor(t, e = 1) {
    (super(),
      (this.isLight = !0),
      (this.type = "Light"),
      (this.color = new Pt(t)),
      (this.intensity = e));
  }
  dispose() {}
  copy(t, e) {
    return (
      super.copy(t, e),
      this.color.copy(t.color),
      (this.intensity = t.intensity),
      this
    );
  }
  toJSON(t) {
    const e = super.toJSON(t);
    return (
      (e.object.color = this.color.getHex()),
      (e.object.intensity = this.intensity),
      this.groundColor !== void 0 &&
        (e.object.groundColor = this.groundColor.getHex()),
      this.distance !== void 0 && (e.object.distance = this.distance),
      this.angle !== void 0 && (e.object.angle = this.angle),
      this.decay !== void 0 && (e.object.decay = this.decay),
      this.penumbra !== void 0 && (e.object.penumbra = this.penumbra),
      this.shadow !== void 0 && (e.object.shadow = this.shadow.toJSON()),
      this.target !== void 0 && (e.object.target = this.target.uuid),
      e
    );
  }
}
class Ol extends Fa {
  constructor(t, e, n) {
    (super(t, n),
      (this.isHemisphereLight = !0),
      (this.type = "HemisphereLight"),
      this.position.copy(ne.DEFAULT_UP),
      this.updateMatrix(),
      (this.groundColor = new Pt(e)));
  }
  copy(t, e) {
    return (super.copy(t, e), this.groundColor.copy(t.groundColor), this);
  }
}
const Sr = new Zt(),
  Yo = new b(),
  jo = new b();
class Bl {
  constructor(t) {
    ((this.camera = t),
      (this.intensity = 1),
      (this.bias = 0),
      (this.normalBias = 0),
      (this.radius = 1),
      (this.blurSamples = 8),
      (this.mapSize = new It(512, 512)),
      (this.map = null),
      (this.mapPass = null),
      (this.matrix = new Zt()),
      (this.autoUpdate = !0),
      (this.needsUpdate = !1),
      (this._frustum = new Pa()),
      (this._frameExtents = new It(1, 1)),
      (this._viewportCount = 1),
      (this._viewports = [new ee(0, 0, 1, 1)]));
  }
  getViewportCount() {
    return this._viewportCount;
  }
  getFrustum() {
    return this._frustum;
  }
  updateMatrices(t) {
    const e = this.camera,
      n = this.matrix;
    (Yo.setFromMatrixPosition(t.matrixWorld),
      e.position.copy(Yo),
      jo.setFromMatrixPosition(t.target.matrixWorld),
      e.lookAt(jo),
      e.updateMatrixWorld(),
      Sr.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse),
      this._frustum.setFromProjectionMatrix(Sr),
      n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
      n.multiply(Sr));
  }
  getViewport(t) {
    return this._viewports[t];
  }
  getFrameExtents() {
    return this._frameExtents;
  }
  dispose() {
    (this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose());
  }
  copy(t) {
    return (
      (this.camera = t.camera.clone()),
      (this.intensity = t.intensity),
      (this.bias = t.bias),
      (this.radius = t.radius),
      this.mapSize.copy(t.mapSize),
      this
    );
  }
  clone() {
    return new this.constructor().copy(this);
  }
  toJSON() {
    const t = {};
    return (
      this.intensity !== 1 && (t.intensity = this.intensity),
      this.bias !== 0 && (t.bias = this.bias),
      this.normalBias !== 0 && (t.normalBias = this.normalBias),
      this.radius !== 1 && (t.radius = this.radius),
      (this.mapSize.x !== 512 || this.mapSize.y !== 512) &&
        (t.mapSize = this.mapSize.toArray()),
      (t.camera = this.camera.toJSON(!1).object),
      delete t.camera.matrix,
      t
    );
  }
}
const Ko = new Zt(),
  qi = new b(),
  Er = new b();
class l0 extends Bl {
  constructor() {
    (super(new Ue(90, 1, 0.5, 500)),
      (this.isPointLightShadow = !0),
      (this._frameExtents = new It(4, 2)),
      (this._viewportCount = 6),
      (this._viewports = [
        new ee(2, 1, 1, 1),
        new ee(0, 1, 1, 1),
        new ee(3, 1, 1, 1),
        new ee(1, 1, 1, 1),
        new ee(3, 0, 1, 1),
        new ee(1, 0, 1, 1),
      ]),
      (this._cubeDirections = [
        new b(1, 0, 0),
        new b(-1, 0, 0),
        new b(0, 0, 1),
        new b(0, 0, -1),
        new b(0, 1, 0),
        new b(0, -1, 0),
      ]),
      (this._cubeUps = [
        new b(0, 1, 0),
        new b(0, 1, 0),
        new b(0, 1, 0),
        new b(0, 1, 0),
        new b(0, 0, 1),
        new b(0, 0, -1),
      ]));
  }
  updateMatrices(t, e = 0) {
    const n = this.camera,
      s = this.matrix,
      r = t.distance || n.far;
    (r !== n.far && ((n.far = r), n.updateProjectionMatrix()),
      qi.setFromMatrixPosition(t.matrixWorld),
      n.position.copy(qi),
      Er.copy(n.position),
      Er.add(this._cubeDirections[e]),
      n.up.copy(this._cubeUps[e]),
      n.lookAt(Er),
      n.updateMatrixWorld(),
      s.makeTranslation(-qi.x, -qi.y, -qi.z),
      Ko.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse),
      this._frustum.setFromProjectionMatrix(Ko));
  }
}
class Zn extends Fa {
  constructor(t, e, n = 0, s = 2) {
    (super(t, e),
      (this.isPointLight = !0),
      (this.type = "PointLight"),
      (this.distance = n),
      (this.decay = s),
      (this.shadow = new l0()));
  }
  get power() {
    return this.intensity * 4 * Math.PI;
  }
  set power(t) {
    this.intensity = t / (4 * Math.PI);
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t, e) {
    return (
      super.copy(t, e),
      (this.distance = t.distance),
      (this.decay = t.decay),
      (this.shadow = t.shadow.clone()),
      this
    );
  }
}
class c0 extends Bl {
  constructor() {
    (super(new La(-5, 5, 5, -5, 0.5, 500)),
      (this.isDirectionalLightShadow = !0));
  }
}
class kl extends Fa {
  constructor(t, e) {
    (super(t, e),
      (this.isDirectionalLight = !0),
      (this.type = "DirectionalLight"),
      this.position.copy(ne.DEFAULT_UP),
      this.updateMatrix(),
      (this.target = new ne()),
      (this.shadow = new c0()));
  }
  dispose() {
    this.shadow.dispose();
  }
  copy(t) {
    return (
      super.copy(t),
      (this.target = t.target.clone()),
      (this.shadow = t.shadow.clone()),
      this
    );
  }
}
class Xs extends Le {
  constructor() {
    (super(),
      (this.isInstancedBufferGeometry = !0),
      (this.type = "InstancedBufferGeometry"),
      (this.instanceCount = 1 / 0));
  }
  copy(t) {
    return (super.copy(t), (this.instanceCount = t.instanceCount), this);
  }
  toJSON() {
    const t = super.toJSON();
    return (
      (t.instanceCount = this.instanceCount),
      (t.isInstancedBufferGeometry = !0),
      t
    );
  }
}
typeof __THREE_DEVTOOLS__ < "u" &&
  __THREE_DEVTOOLS__.dispatchEvent(
    new CustomEvent("register", { detail: { revision: ya } }),
  );
typeof window < "u" &&
  (window.__THREE__
    ? console.warn("WARNING: Multiple instances of Three.js being imported.")
    : (window.__THREE__ = ya));
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
function Hl(i, t = !1) {
  const e = i[0].index !== null,
    n = new Set(Object.keys(i[0].attributes)),
    s = new Set(Object.keys(i[0].morphAttributes)),
    r = {},
    a = {},
    l = i[0].morphTargetsRelative,
    o = new Le();
  let c = 0;
  for (let h = 0; h < i.length; ++h) {
    const d = i[h];
    let u = 0;
    if (e !== (d.index !== null))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.",
        ),
        null
      );
    for (const m in d.attributes) {
      if (!n.has(m))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              h +
              '. All geometries must have compatible attributes; make sure "' +
              m +
              '" attribute exists among all geometries, or in none of them.',
          ),
          null
        );
      (r[m] === void 0 && (r[m] = []), r[m].push(d.attributes[m]), u++);
    }
    if (u !== n.size)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ". Make sure all geometries have the same number of attributes.",
        ),
        null
      );
    if (l !== d.morphTargetsRelative)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
            h +
            ". .morphTargetsRelative must be consistent throughout all geometries.",
        ),
        null
      );
    for (const m in d.morphAttributes) {
      if (!s.has(m))
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              h +
              ".  .morphAttributes must be consistent throughout all geometries.",
          ),
          null
        );
      (a[m] === void 0 && (a[m] = []), a[m].push(d.morphAttributes[m]));
    }
    if (t) {
      let m;
      if (e) m = d.index.count;
      else if (d.attributes.position !== void 0)
        m = d.attributes.position.count;
      else
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index " +
              h +
              ". The geometry must have either an index or a position attribute",
          ),
          null
        );
      (o.addGroup(c, m, h), (c += m));
    }
  }
  if (e) {
    let h = 0;
    const d = [];
    for (let u = 0; u < i.length; ++u) {
      const m = i[u].index;
      for (let g = 0; g < m.count; ++g) d.push(m.getX(g) + h);
      h += i[u].attributes.position.count;
    }
    o.setIndex(d);
  }
  for (const h in r) {
    const d = $o(r[h]);
    if (!d)
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
            h +
            " attribute.",
        ),
        null
      );
    o.setAttribute(h, d);
  }
  for (const h in a) {
    const d = a[h][0].length;
    if (d === 0) break;
    ((o.morphAttributes = o.morphAttributes || {}),
      (o.morphAttributes[h] = []));
    for (let u = 0; u < d; ++u) {
      const m = [];
      for (let v = 0; v < a[h].length; ++v) m.push(a[h][v][u]);
      const g = $o(m);
      if (!g)
        return (
          console.error(
            "THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the " +
              h +
              " morphAttribute.",
          ),
          null
        );
      o.morphAttributes[h].push(g);
    }
  }
  return o;
}
function $o(i) {
  let t,
    e,
    n,
    s = -1,
    r = 0;
  for (let c = 0; c < i.length; ++c) {
    const h = i[c];
    if ((t === void 0 && (t = h.array.constructor), t !== h.array.constructor))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.",
        ),
        null
      );
    if ((e === void 0 && (e = h.itemSize), e !== h.itemSize))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.",
        ),
        null
      );
    if ((n === void 0 && (n = h.normalized), n !== h.normalized))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.",
        ),
        null
      );
    if ((s === -1 && (s = h.gpuType), s !== h.gpuType))
      return (
        console.error(
          "THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes.",
        ),
        null
      );
    r += h.count * e;
  }
  const a = new t(r),
    l = new Ye(a, e, n);
  let o = 0;
  for (let c = 0; c < i.length; ++c) {
    const h = i[c];
    if (h.isInterleavedBufferAttribute) {
      const d = o / e;
      for (let u = 0, m = h.count; u < m; u++)
        for (let g = 0; g < e; g++) {
          const v = h.getComponent(u, g);
          l.setComponent(u + d, g, v);
        }
    } else a.set(h.array, o);
    o += h.count * e;
  }
  return (s !== void 0 && (l.gpuType = s), l);
}
const Xi = new b();
function qe(i, t, e, n, s, r) {
  const a = (2 * Math.PI * s) / 4,
    l = Math.max(r - 2 * s, 0),
    o = Math.PI / 4;
  (Xi.copy(t), (Xi[n] = 0), Xi.normalize());
  const c = (0.5 * a) / (a + l),
    h = 1 - Xi.angleTo(i) / o;
  return Math.sign(Xi[e]) === 1 ? h * c : l / (a + l) + c + c * (1 - h);
}
class ks extends te {
  constructor(t = 1, e = 1, n = 1, s = 2, r = 0.1) {
    if (
      ((s = s * 2 + 1),
      (r = Math.min(t / 2, e / 2, n / 2, r)),
      super(1, 1, 1, s, s, s),
      s === 1)
    )
      return;
    const a = this.toNonIndexed();
    ((this.index = null),
      (this.attributes.position = a.attributes.position),
      (this.attributes.normal = a.attributes.normal),
      (this.attributes.uv = a.attributes.uv));
    const l = new b(),
      o = new b(),
      c = new b(t, e, n).divideScalar(2).subScalar(r),
      h = this.attributes.position.array,
      d = this.attributes.normal.array,
      u = this.attributes.uv.array,
      m = h.length / 6,
      g = new b(),
      v = 0.5 / s;
    for (let p = 0, f = 0; p < h.length; p += 3, f += 2)
      switch (
        (l.fromArray(h, p),
        o.copy(l),
        (o.x -= Math.sign(o.x) * v),
        (o.y -= Math.sign(o.y) * v),
        (o.z -= Math.sign(o.z) * v),
        o.normalize(),
        (h[p + 0] = c.x * Math.sign(l.x) + o.x * r),
        (h[p + 1] = c.y * Math.sign(l.y) + o.y * r),
        (h[p + 2] = c.z * Math.sign(l.z) + o.z * r),
        (d[p + 0] = o.x),
        (d[p + 1] = o.y),
        (d[p + 2] = o.z),
        Math.floor(p / m))
      ) {
        case 0:
          (g.set(1, 0, 0),
            (u[f + 0] = qe(g, o, "z", "y", r, n)),
            (u[f + 1] = 1 - qe(g, o, "y", "z", r, e)));
          break;
        case 1:
          (g.set(-1, 0, 0),
            (u[f + 0] = 1 - qe(g, o, "z", "y", r, n)),
            (u[f + 1] = 1 - qe(g, o, "y", "z", r, e)));
          break;
        case 2:
          (g.set(0, 1, 0),
            (u[f + 0] = 1 - qe(g, o, "x", "z", r, t)),
            (u[f + 1] = qe(g, o, "z", "x", r, n)));
          break;
        case 3:
          (g.set(0, -1, 0),
            (u[f + 0] = 1 - qe(g, o, "x", "z", r, t)),
            (u[f + 1] = 1 - qe(g, o, "z", "x", r, n)));
          break;
        case 4:
          (g.set(0, 0, 1),
            (u[f + 0] = 1 - qe(g, o, "x", "y", r, t)),
            (u[f + 1] = 1 - qe(g, o, "y", "x", r, e)));
          break;
        case 5:
          (g.set(0, 0, -1),
            (u[f + 0] = qe(g, o, "x", "y", r, t)),
            (u[f + 1] = 1 - qe(g, o, "y", "x", r, e)));
          break;
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
  xa = new b(0.38, 0.72, 0.58).normalize();
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
      (this._tmp = new b()),
      this._build());
  }
  _materials() {
    const t = this.timeUniform;
    this.mats = {
      wall: new le({ color: 4607322, roughness: 0.65, metalness: 0.2 }),
      dark: new le({ color: 3488580, roughness: 0.75, metalness: 0.1 }),
      pillar: new le({ color: 4080976, roughness: 0.6, metalness: 0.25 }),
      crate: new le({ color: 4475733, roughness: 0.7, metalness: 0.2 }),
      barrier: new le({ color: 4870491, roughness: 0.6, metalness: 0.25 }),
      emCyan: new le({
        color: 0,
        emissive: 4644095,
        emissiveIntensity: 1.5,
        roughness: 1,
        metalness: 0,
      }),
      emCyanDim: new le({
        color: 0,
        emissive: 2792640,
        emissiveIntensity: 0.8,
        roughness: 1,
        metalness: 0,
      }),
      emOrange: new le({
        color: 0,
        emissive: 16738842,
        emissiveIntensity: 1.6,
        roughness: 1,
        metalness: 0,
      }),
      emWhite: new le({
        color: 0,
        emissive: 16773853,
        emissiveIntensity: 1.2,
        roughness: 1,
        metalness: 0,
      }),
    };
    const e = new le({ color: 3818064, roughness: 0.5, metalness: 0.3 });
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
      n = new He(240, 240, 1, 1);
    n.rotateX(-Math.PI / 2);
    const s = new Ut(n, e.floor);
    ((s.receiveShadow = !0), t.add(s));
    const r = new ei(7, 8.5, 0.5, 8, 1, !1);
    r.rotateY(Math.PI / 8);
    const a = new Ut(r, e.pillar);
    ((a.position.y = 0.25),
      (a.receiveShadow = !0),
      (a.castShadow = !0),
      t.add(a));
    const l = new Di(7.05, 0.05, 6, 8);
    (l.rotateX(Math.PI / 2), l.rotateY(Math.PI / 8));
    const o = new Ut(l, e.emCyan);
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
          const it = new te(1.3, Be + 0.6, 1.6);
          (it.translate(Y, (Be + 0.6) / 2, 0),
            this._place(it, k, G, q),
            c.push(it));
          const vt = new te(0.12, Be - 1.5, 0.08);
          (vt.translate(Y + (Y < 0 ? 0.66 : -0.66), (Be - 1.5) / 2 + 0.4, -0.8),
            this._place(vt, k, G, q),
            u.push(vt));
        }
        const O = new te(8.1, 1.6, 1.6);
        (O.translate(0, Be - 0.2, 0), this._place(O, k, G, q), c.push(O));
        const et = new te(5.6, 0.12, 0.08);
        (et.translate(0, Be - 1.05, -0.8),
          this._place(et, k, G, q),
          u.push(et));
        const K = new te(8.2, Be + 1, 8);
        (K.translate(0, (Be + 1) / 2, 4.6), this._place(K, k, G, q), m.push(K));
        const nt = this._makePortal();
        (nt.position.set(
          Math.cos(U) * (be + 0.2),
          3.9,
          Math.sin(U) * (be + 0.2),
        ),
          (nt.rotation.y = q),
          t.add(nt));
        const _t = new b(-Math.cos(U), 0, -Math.sin(U)),
          Lt = new Zn(16738850, 40, 26, 2);
        (Lt.position.set(
          Math.cos(U) * (be - 2.2),
          3.2,
          Math.sin(U) * (be - 2.2),
        ),
          t.add(Lt),
          this.gates.push({
            pos: new b(Math.cos(U) * (be - 1.4), 0, Math.sin(U) * (be - 1.4)),
            dir: _t,
            mat: nt.material,
            light: Lt,
            activity: 0,
            angle: U,
          }));
      } else {
        const O = new te(9.7, Be, 1.2);
        (O.translate(0, Be / 2, 0), this._place(O, k, G, q), c.push(O));
        for (const _t of [-3.2, 3.2]) {
          const Lt = new te(0.5, Be, 0.4);
          (Lt.translate(_t, Be / 2, -0.7),
            this._place(Lt, k, G, q),
            m.push(Lt));
        }
        const et = new te(9.5, 0.09, 0.06);
        (et.translate(0, 3.6, -0.63), this._place(et, k, G, q), h.push(et));
        const K = new te(9.5, 0.06, 0.06);
        (K.translate(0, 0.35, -0.63), this._place(K, k, G, q), d.push(K));
        const nt = new te(9.5, 0.05, 0.06);
        (nt.translate(0, 8.4, -0.63), this._place(nt, k, G, q), d.push(nt));
      }
    }
    const v = (z, U, H = !0) => {
      if (!z.length) return;
      const k = new Ut(Hl(z, !1), U);
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
        G = new te(1.7, 10, 1.7);
      (G.translate(H, 5, k), p.push(G));
      const q = new te(2.1, 0.5, 2.1);
      (q.translate(H, 10.1, k), p.push(q));
      const O = new te(2.3, 0.35, 2.3);
      (O.translate(H, 0.17, k), p.push(O));
      for (const et of [1.4, 6.8]) {
        const K = new te(1.82, 0.12, 1.82);
        (K.translate(H, et, k), f.push(K));
      }
      (this.boxes.push(new As(H, k, 0.85, 0.85, 0, 10, 0)),
        this.boxes.push(new As(H, k, 1.15, 1.15, 0, 0.35, 0)));
    }
    v(p, e.pillar);
    for (let z = 0; z < 4; z++) {
      const U = (z / 4) * Math.PI * 2 + Math.PI / 4,
        H = new Zn(10475775, 28, 40, 2);
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
        et = new ks(O, 2.1, 0.55, 2, 0.06);
      (et.translate(0, 1.05, 0), this._place(et, k, G, q), w.push(et));
      const K = new te(O - 0.6, 0.06, 0.04);
      (K.translate(0, 2, -0.29), this._place(K, k, G, q), M.push(K));
      const nt = new te(O - 0.6, 0.06, 0.04);
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
        et = new ks(q[0], q[1], q[2], 2, 0.05);
      (et.translate(0, q[1] / 2, 0), this._place(et, H, k, O), _.push(et));
      const K = new te(q[0] * 0.7, 0.05, 0.03);
      (K.translate(0, q[1] * 0.72, -q[2] / 2 - 0.005),
        this._place(K, H, k, O),
        L.push(K));
      const nt = new te(q[0] * 0.7, 0.05, 0.03);
      (nt.translate(0, q[1] * 0.72, q[2] / 2 + 0.005),
        this._place(nt, H, k, O),
        L.push(nt),
        this.boxes.push(new As(H, k, q[0] / 2, q[2] / 2, 0, q[1], O)),
        A++);
    }
    (v(_, e.crate), v(L, (this.rng() > 0.5, e.emCyanDim), !1));
    const S = new kl(13622527, 3.6);
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
    const y = new Ol(5927072, 3025448, 1.9);
    t.add(y);
    const P = new Zn(6222591, 30, 30, 2);
    (P.position.set(0, 5, 0),
      t.add(P),
      (this.centerLight = P),
      (t.fog = new Ua(1055276, 0.008)));
  }
  _place(t, e, n, s) {
    const r = new Zt().makeRotationY(s).setPosition(e, 0, n);
    t.applyMatrix4(r);
  }
  _makePortal() {
    const t = new He(6.4, 7.6),
      e = new pe({
        transparent: !0,
        depthWrite: !1,
        side: Ie,
        blending: Mn,
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
    return (this.portalMats.push(e), new Ut(t, e));
  }
  _buildHexTop() {
    const t = new qs(6.9, 8);
    (t.rotateX(-Math.PI / 2), t.rotateY(Math.PI / 8));
    const e = new pe({
        transparent: !0,
        depthWrite: !1,
        blending: Mn,
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
      n = new Ut(t, e);
    ((n.position.y = 0.515), this.scene.add(n));
  }
  _buildHologram() {
    const t = new xe(),
      e = [this.mats.emCyan, this.mats.emCyanDim, this.mats.emWhite];
    for (let s = 0; s < 3; s++) {
      const r = new Ut(new Di(1.1 + s * 0.55, 0.035, 8, 64), e[s]);
      ((r.rotation.x = Math.PI / 2 + (s - 1) * 0.5), t.add(r));
    }
    const n = new Ut(new Na(0.45, 0), this.mats.emWhite);
    (t.add(n), t.position.set(0, 4.8, 0), this.scene.add(t), (this.holo = t));
  }
  groundHeight(t, e) {
    const n = Math.hypot(t, e);
    return 0.5 * jt.clamp((8.5 - n) / 1.5, 0, 1);
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
          point: new b(t.x + e.x * s, t.y + e.y * s, t.z + e.z * s),
          normal: new b(r, a, l),
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
  const t = new ni(700, 48, 24),
    e = new pe({
      side: Ce,
      depthWrite: !1,
      fog: !1,
      uniforms: {
        uTime: { value: 0 },
        uMoonDir: { value: i.clone().normalize() },
        uHorizon: { value: new Pt(660516) },
        uZenith: { value: new Pt(132106) },
        uFog: { value: new Pt(461588) },
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
    n = new Ut(t, e);
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
    const n = new He(1, 1),
      s = new Xs();
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
        aPos: new fe(this.pos, 3),
        aVel: new fe(this.vel, 3),
        aTime: new fe(this.time, 2),
        aSize: new fe(this.size, 2),
        aColor: new fe(this.color, 4),
        aMisc: new fe(this.misc, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(gn), s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = t), (this.uTime = { value: 0 }));
    const r = new pe({
      uniforms: { uTime: this.uTime },
      vertexShader: v0,
      fragmentShader: _0,
      transparent: !0,
      depthWrite: !1,
      depthTest: !0,
      blending: e ? Mn : $n,
    });
    ((this.mesh = new Ut(s, r)),
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
    const e = new He(1, 1);
    e.rotateX(-Math.PI / 2);
    const n = new Xs();
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
        aPos: new fe(this.pos, 3),
        aTime: new fe(this.time, 2),
        aParams: new fe(this.params, 2),
        aColor: new fe(this.color, 3),
      }));
    for (const r in this.attrs)
      (this.attrs[r].setUsage(gn), n.setAttribute(r, this.attrs[r]));
    ((n.instanceCount = t), (this.uTime = { value: 0 }));
    const s = new pe({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      blending: Mn,
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
    ((this.mesh = new Ut(n, s)),
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
      a = new b();
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
      a = new b(),
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
      a = new b(),
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
      s = new b();
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
    const n = new He(1, 1, 1, 1),
      s = new Xs();
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
        aStart: new fe(this.start, 3),
        aEnd: new fe(this.end, 3),
        aTime: new fe(this.time, 3),
        aColor: new fe(this.color, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(gn), s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = e), (this.uTime = { value: 0 }));
    const r = new pe({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      blending: Mn,
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
    ((this.mesh = new Ut(s, r)),
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
    const n = new He(1, 1),
      s = new Xs();
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
        aPos: new fe(this.pos, 3),
        aQuat: new fe(this.quat, 4),
        aInfo: new fe(this.info, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(gn), s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = e), (this.uTime = { value: 0 }));
    const r = new pe({
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
    ((this.mesh = new Ut(s, r)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 5),
      t.add(this.mesh),
      (this._q = new an()),
      (this._q2 = new an()),
      (this._z = new b(0, 0, 1)));
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
    const n = new ei(0.0045, 0.0045, 0.028, 8);
    n.rotateZ(Math.PI / 2);
    const s = new le({ color: 16777215, metalness: 1, roughness: 0.28 });
    ((this.mesh = new _a(n, s, e)),
      this.mesh.instanceMatrix.setUsage(gn),
      (this.mesh.frustumCulled = !1),
      (this.mesh.castShadow = !1));
    for (let r = 0; r < e; r++) this.mesh.setColorAt(r, new Pt(14266954));
    ((this.n = e), (this.items = []));
    for (let r = 0; r < e; r++)
      this.items.push({
        active: !1,
        p: new b(),
        v: new b(),
        rot: new Ee(),
        av: new b(),
        life: 0,
        scale: 1,
        bounced: !1,
      });
    ((this.head = 0),
      (this._m = new Zt()),
      (this._q = new an()),
      (this._s = new b()),
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
      n === "shotgun" ? new Pt(13380138) : new Pt(14266954),
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
    const e = t.getDrawingBufferSize(new It());
    ((this.w = Math.max(2, e.x)),
      (this.h = Math.max(2, e.y)),
      (this.sceneRT = new Sn(this.w, this.h, {
        type: Qn,
        samples: 4,
        depthBuffer: !0,
        stencilBuffer: !1,
        minFilter: Ne,
        magFilter: Ne,
      })),
      (this.mipCount = 6),
      (this.mips = []));
    for (let s = 0; s < this.mipCount; s++)
      this.mips.push(
        new Sn(Math.max(1, this.w >> (s + 1)), Math.max(1, this.h >> (s + 1)), {
          type: Qn,
          depthBuffer: !1,
          minFilter: Ne,
          magFilter: Ne,
        }),
      );
    const n = new Le();
    (n.setAttribute("position", new he([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3)),
      (this.quad = new Ut(n, null)),
      (this.quad.frustumCulled = !1),
      (this.quadScene = new zs()),
      this.quadScene.add(this.quad),
      (this.quadCam = new La(-1, 1, 1, -1, 0, 1)),
      (this.downMat = new pe({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new It() },
          uThreshold: { value: 1.3 },
          uKnee: { value: 0.6 },
          uPrefilter: { value: 0 },
        },
        vertexShader: wr,
        fragmentShader: w0,
        depthTest: !1,
        depthWrite: !1,
      })),
      (this.upMat = new pe({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new It() },
          uScale: { value: 1 },
        },
        vertexShader: wr,
        fragmentShader: T0,
        depthTest: !1,
        depthWrite: !1,
        blending: al,
        blendSrc: Pr,
        blendDst: Pr,
        blendEquation: Dn,
      })),
      (this.u = {
        tScene: { value: null },
        tBloom: { value: null },
        uRes: { value: new It(this.w, this.h) },
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
      (this.compMat = new pe({
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
const Ln = (i, t, e, n) => jt.damp(i, t, e, n);
class R0 {
  constructor(t) {
    ((this.arena = t),
      (this.pos = new b(0, 0.5, 4)),
      (this.vel = new b()),
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
      (this.localVel = new b()),
      (this.moveInput = new It()),
      (this.ads = 0),
      (this.adsFov = 60),
      (this.moveMult = 1),
      (this.fov = 80),
      (this.events = []),
      (this.camPos = new b()),
      (this.camQuat = new an()),
      (this.forward = new b(0, 0, -1)),
      (this.right = new b(1, 0, 0)),
      (this._euler = new Ee(0, 0, 0, "YXZ")),
      (this._wish = new b()),
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
      const K = jt.lerp(1, this.adsFov / 80, this.ads),
        nt = 0.0021 * e.sensitivity * K;
      ((this.yaw -= e.dx * nt), (this.pitch -= e.dy * nt));
    }
    this.pitch = jt.clamp(this.pitch, -1.5, 1.5);
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
      const K = m.lengthSq() > 0.1 ? m : new b(c, 0, h),
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
      (f *= jt.lerp(1, 0.62 * this.moveMult, this.ads)),
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
        const K = jt.clamp(-w / 14, 0.15, 1);
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
      (this.landDip = jt.clamp(this.landDip, -0.35, 0.2)),
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
      et = jt.lerp(O, this.adsFov, this.ads);
    this.fov = Ln(this.fov, et, 18, t);
  }
}
const tt = {
  metal: new le({ color: 4014409, roughness: 0.38, metalness: 0.9 }),
  metalDark: new le({ color: 1711394, roughness: 0.46, metalness: 0.92 }),
  metalLight: new le({ color: 6054508, roughness: 0.32, metalness: 0.92 }),
  polymer: new le({ color: 1118741, roughness: 0.84, metalness: 0.1 }),
  polymer2: new le({ color: 1974566, roughness: 0.72, metalness: 0.2 }),
  accent: new le({
    color: 0,
    emissive: 6222591,
    emissiveIntensity: 1.4,
    roughness: 0.5,
    metalness: 0,
  }),
  orange: new le({
    color: 0,
    emissive: 16742938,
    emissiveIntensity: 1.4,
    roughness: 0.5,
    metalness: 0,
  }),
  white: new le({
    color: 0,
    emissive: 16777215,
    emissiveIntensity: 4,
    roughness: 0.5,
    metalness: 0,
  }),
  glove: new le({ color: 1776672, roughness: 0.9, metalness: 0.05 }),
  sleeve: new le({ color: 2369325, roughness: 0.95, metalness: 0.02 }),
  tube: new le({ color: 1711394, roughness: 0.46, metalness: 0.92, side: Ie }),
};
function ot(i, t, e, n, s = 0, r = 0, a = 0, l = 0) {
  const o = l > 0 ? new ks(i, t, e, 2, l) : new te(i, t, e),
    c = new Ut(o, n);
  return (c.position.set(s, r, a), c);
}
function Ae(i, t, e, n, s = 0, r = 0, a = 0, l = "z", o = 18, c = !1) {
  const h = new ei(i, t, e, o, 1, c);
  l === "z" ? h.rotateX(Math.PI / 2) : l === "x" && h.rotateZ(Math.PI / 2);
  const d = new Ut(h, n);
  return (d.position.set(s, r, a), d);
}
function Ma(i, t, e, n, s) {
  const r = new Ut(new ni(i, 12, 10), t);
  return (r.position.set(e, n, s), r);
}
function Vl(i, t, e, n, s) {
  const r = new b(...i),
    a = new b(...t),
    l = r.distanceTo(a),
    o = new ei(n, e, l, 14),
    c = new Ut(o, s),
    h = a.clone().sub(r).normalize();
  return (
    c.quaternion.setFromUnitVectors(new b(0, 1, 0), h),
    c.position.copy(r).lerp(a, 0.5),
    c
  );
}
function Gl(i, t, e, n, s, r) {
  const a = new Di(i, t, 8, 24),
    l = new Ut(a, e);
  return (l.position.set(n, s, r), l);
}
function za(i, t = -0.3) {
  const e = new xe();
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
  const e = new xe();
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
  const t = new xe(),
    e = {};
  (t.add(ot(0.068, 0.07, 0.25, tt.metal, 0, 0.035, -0.03, 0.008)),
    t.add(ot(0.062, 0.056, 0.17, tt.metalDark, 0, -0.025, 0, 0.006)),
    t.add(ot(0.024, 0.012, 0.25, tt.metalDark, 0, 0.076, -0.03)));
  for (let h = 0; h < 7; h++)
    t.add(ot(0.026, 0.005, 0.012, tt.metal, 0, 0.084, 0.07 - h * 0.03));
  (t.add(ot(0.03, 0.018, 0.02, tt.metalLight, 0, 0.05, -0.15)),
    t.add(ot(0.002, 0.008, 0.06, tt.accent, 0.0355, 0.03, -0.05)),
    t.add(ot(0.002, 0.008, 0.06, tt.accent, -0.0355, 0.03, -0.05)));
  const n = new xe();
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
  ((e.muzzle = new ne()),
    e.muzzle.position.set(0, 0.034, -0.805),
    t.add(e.muzzle));
  const l = ot(0.03, 0.026, 0.05, tt.metalLight, 0, 0.058, 0.1);
  (t.add(l),
    (e.bolt = l),
    (e.boltRest = 0.1),
    (e.boltTravel = 0.045),
    (e.eject = new ne()),
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
  const c = new Ut(new qs(0.0195, 36), i);
  return (
    c.position.set(0, 0.122, -0.068),
    (c.renderOrder = 5),
    t.add(c),
    (e.lens = c),
    (e.sight = new ne()),
    e.sight.position.set(0, 0.122, -0.068),
    t.add(e.sight),
    (e.adsOffset = new b(0, -0.122, -0.2)),
    (e.hipOffset = new b(0.165, -0.165, -0.31)),
    (e.hipRot = new Ee(0, 0.035, 0.02)),
    (e.handR = za([0.004, -0.11, 0.09])),
    t.add(e.handR),
    (e.handL = Oa([-0.002, -0.006, -0.3], [-0.13, -0.33, -0.02])),
    t.add(e.handL),
    (e.handLRest = e.handL.position.clone()),
    { group: t, parts: e }
  );
}
function P0() {
  const i = new xe(),
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
    (t.muzzle = new ne()),
    t.muzzle.position.set(0, 0.06, -0.755),
    i.add(t.muzzle));
  const e = new xe();
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
    (t.sight = new ne()),
    t.sight.position.set(0, 0.081, -0.1),
    i.add(t.sight),
    (t.adsOffset = new b(0, -0.081, -0.14)),
    (t.hipOffset = new b(0.17, -0.18, -0.3)),
    (t.hipRot = new Ee(0, 0.04, 0.03)),
    (t.eject = new ne()),
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
  const i = new xe(),
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
  ((t.muzzle = new ne()),
    t.muzzle.position.set(0, 0.036, -1.115),
    i.add(t.muzzle));
  const e = new xe();
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
  const a = new xe();
  return (
    a.position.set(0, 0.048, 0.03),
    a.add(Ae(0.006, 0.006, 0.045, tt.metalLight, 0.055, 0, 0, "x")),
    a.add(Ma(0.011, tt.metalLight, 0.08, 0, 0)),
    i.add(a),
    (t.bolt = a),
    (t.boltRest = 0.03),
    (t.boltTravel = 0.07),
    (t.eject = new ne()),
    t.eject.position.set(0.04, 0.05, 0),
    i.add(t.eject),
    i.add(ot(0.016, 0.012, 0.03, tt.metalDark, 0, 0.082, -0.76)),
    i.add(ot(0.0045, 0.024, 0.0045, tt.metalDark, 0, 0.099, -0.76)),
    i.add(Ma(0.0028, tt.white, 0, 0.1115, -0.76)),
    i.add(Ae(0.0175, 0.0175, 0.02, tt.tube, 0, 0.105, -0.76, "z", 24, !0)),
    i.add(ot(0.032, 0.012, 0.03, tt.metalDark, 0, 0.078, -0.17)),
    i.add(ot(0.014, 0.024, 0.016, tt.metalDark, 0, 0.094, -0.17)),
    i.add(Gl(0.0125, 0.0025, tt.metalDark, 0, 0.1115, -0.17)),
    (t.sight = new ne()),
    t.sight.position.set(0, 0.1115, -0.17),
    i.add(t.sight),
    (t.adsOffset = new b(0, -0.1115, -0.08)),
    (t.hipOffset = new b(0.16, -0.165, -0.28)),
    (t.hipRot = new Ee(0, 0.03, 0.02)),
    (t.handR = za([0.004, -0.115, 0.085])),
    i.add(t.handR),
    (t.handL = Oa([-0.002, -0.01, -0.4], [-0.13, -0.34, -0.1])),
    i.add(t.handL),
    (t.handLRest = t.handL.position.clone()),
    { group: i, parts: t }
  );
}
function D0() {
  return new pe({
    transparent: !0,
    depthWrite: !1,
    side: Ie,
    uniforms: {
      uSightPos: { value: new b() },
      uSightFwd: { value: new b(0, 0, -1) },
      uColor: { value: new Pt(1, 0.12, 0.08) },
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
const Jo = new b(),
  Qo = new b();
function U0(i, t, e) {
  (t.getWorldPosition(Jo),
    t.getWorldDirection(Qo),
    i.uniforms.uSightPos.value.copy(Jo),
    i.uniforms.uSightFwd.value.copy(Qo).negate(),
    (i.uniforms.uTime.value = e));
}
class I0 {
  constructor() {
    ((this.group = new xe()),
      (this.uniforms = {
        uLife: { value: 1 },
        uSeed: { value: 0 },
        uIntensity: { value: 1 },
        uColor: { value: new Pt(1, 0.6, 0.2) },
      }));
    const t = new pe({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: Mn,
        side: Ie,
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
      e = new pe({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: Mn,
        side: Ie,
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
      n = new He(1, 1);
    (n.rotateY(Math.PI / 2), n.translate(0, 0, -0.5));
    const s = new Ut(n, t),
      r = new Ut(n, t);
    r.rotation.z = Math.PI / 2;
    const a = new Ut(n, t);
    ((a.rotation.z = Math.PI / 4), a.scale.set(1, 0.7, 0.8));
    const l = new Ut(new He(1, 1), e);
    ((l.position.z = -0.02),
      (this.planes = [s, r, a]),
      (this.disc = l),
      (this.inner = new xe()),
      this.inner.add(s, r, a, l),
      this.group.add(this.inner),
      (this.light = new Zn(16752704, 0, 3, 2)),
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
  Wn = jt.damp,
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
  Tr = new b(0.07, -0.085, 0.02),
  br = new b(-0.42, 0.55, 0.3),
  F0 = new b(0, -0.075, 0.37);
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
      (this.rig = new xe()),
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
      (this.swayPos = new b()),
      (this.swayPosV = new b()),
      (this.swayRot = new b()),
      (this.swayRotV = new b()),
      (this.kickPos = new b()),
      (this.kickPosV = new b()),
      (this.kickRot = new b()),
      (this.kickRotV = new b()),
      (this.moveOff = new b()),
      (this.moveRot = new b()),
      (this.animPos = new b()),
      (this.animRot = new b()),
      (this._v = new b()),
      (this._v2 = new b()),
      (this._v3 = new b()),
      (this._up = new b()),
      (this.time = 0),
      (this.player = null),
      (this.muzzleWorld = new b()));
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
    let a = jt.lerp(n.spreadHip, n.spreadAds, s) + e.bloom * (1 - s * 0.5) + r;
    return (
      n.pellets > 1 &&
        (a += jt.lerp(n.pelletSpread, n.pelletSpreadAds, s) * 0.6),
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
    ((this.ads = jt.clamp(this.ads + ((h ? 1 : -1) * t) / a.adsTime, 0, 1)),
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
          (u > 1 ? jt.lerp(n.pelletSpread, n.pelletSpreadAds, r) : d) *
          Math.sqrt(Math.random()),
        _ = Math.random() * Math.PI * 2,
        L = new b()
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
    return jt.lerp(n.spreadHip, n.spreadAds, s) + e.bloom * (1 - s * 0.5) + r;
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
      u = jt.lerp(0.012, 0.022, h) * d,
      m = jt.lerp(0.0028, 0.0055, h) * d;
    ((this.swayRotV.y += -e.dx * u),
      (this.swayRotV.x += -e.dy * u),
      (this.swayRotV.z += e.dx * u * 0.35),
      (this.swayPosV.x += -e.dx * m),
      (this.swayPosV.y += e.dy * m * 0.6));
    const g = jt.lerp(180, 90, h),
      v = 2 * Math.sqrt(g) * jt.lerp(0.8, 0.55, h),
      p = jt.lerp(230, 120, h),
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
        jt.clamp(-w.y * 0.004, -0.03, 0.03) * M,
        7,
        t,
      )),
      (this.moveOff.z = Wn(this.moveOff.z, w.z * 0.004 * M, 7, t)),
      (this.moveRot.z = Wn(this.moveRot.z, -w.x * 0.012 * M, 7, t)),
      (this.moveRot.x = Wn(
        this.moveRot.x,
        jt.clamp(w.y * 0.012, -0.08, 0.08) * M,
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
      (t.x = jt.clamp(t.x + e.x * r, -a, a)),
      (t.y = jt.clamp(t.y + e.y * r, -a, a)),
      (t.z = jt.clamp(t.z + e.z * r, -a, a)));
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
  Rs = jt.damp,
  B0 = new Zt().makeScale(0, 0, 0),
  Cs = 128;
function Ps(i, t, e) {
  let n = t - i;
  for (; n > Math.PI;) n -= Math.PI * 2;
  for (; n < -Math.PI;) n += Math.PI * 2;
  return i + n * e;
}
function k0(i) {
  const t = (M, _, L, R) => {
      const A = new ne();
      return (A.position.set(_, L, R), M.add(A), A);
    },
    e = new ne(),
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
      const y = new ks(M, _, L, 2, S);
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
      const A = new Ji(0.06, 0.3, 6);
      (A.rotateX(-0.9 + (R - 2) * 0.15),
        A.rotateZ((R - 2) * 0.3),
        A.translate(
          (R - 2) * 0.12,
          i.torso[1] * 0.85 + Math.abs(R - 2) * -0.04,
          i.torso[2] / 2 + 0.08,
        ),
        M.push(A));
    }
    p(r, Hl(M, !1), "body");
    const _ = new Ji(0.05, 0.22, 6);
    (_.rotateZ(0.9), _.translate(-i.armW * 0.9, 0.08, 0), p(l, _, "body"));
    const L = new Ji(0.05, 0.22, 6);
    (L.rotateZ(-0.9), L.translate(i.armW * 0.9, 0.08, 0), p(o, L, "body"));
  }
  if (i.sac) {
    const M = new ni(0.2, 12, 10);
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
const Ei = new b(),
  H0 = new b(),
  V0 = new b();
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
      (this._v = new b()),
      (this._v2 = new b()),
      (this._v3 = new b()),
      (this._headC = new b()),
      (this._a = new b()),
      (this._b = new b()));
  }
  _buildType(t) {
    const e = k0(t.proportions),
      n = new Float32Array(Cs),
      s = new Float32Array(Cs),
      r = Rr(
        new le({ color: t.bodyColor, roughness: 0.55, metalness: 0.55 }),
        this.uTime,
        !1,
      ),
      a = Rr(
        new le({
          color: 0,
          emissive: new Pt(t.glow[0], t.glow[1], t.glow[2]),
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
        h = new fe(n, 1),
        d = new fe(s, 1);
      (h.setUsage(gn),
        d.setUsage(gn),
        o.geom.setAttribute("aFlash", h),
        o.geom.setAttribute("aDissolve", d));
      const u = new _a(o.geom, c ? a : r, Cs);
      (u.instanceMatrix.setUsage(gn),
        (u.frustumCulled = !1),
        (u.castShadow = !c),
        (u.receiveShadow = !c),
        (u.count = 0),
        (u.customDepthMaterial = Rr(
          new zl({ depthPacking: _l }),
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
    const t = new ni(0.17, 12, 10),
      e = new le({
        color: 1127185,
        emissive: 5635942,
        emissiveIntensity: 4.5,
        roughness: 0.4,
      });
    ((this.projMesh = new _a(t, e, 64)),
      this.projMesh.instanceMatrix.setUsage(gn),
      (this.projMesh.frustumCulled = !1),
      (this.projMesh.count = 0),
      this.scene.add(this.projMesh),
      (this.projectiles = []));
    for (let n = 0; n < 64; n++)
      this.projectiles.push({
        active: !1,
        pos: new b(),
        vel: new b(),
        life: 0,
        dmg: 10,
        owner: null,
      });
    this._pm = new Zt();
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
        pos: new b(
          e.pos.x + r * l + e.dir.x * nn(0, 1.5),
          0,
          e.pos.z + a * l + e.dir.z * nn(0, 1.5),
        ),
        vel: new b(),
        kb: new b(),
        push: new b(),
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
            point: new b(t.x + e.x * w, t.y + e.y * w, t.z + e.z * w),
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
      const a = jt.clamp(s.pos.y, e.pos.y + 0.3, e.pos.y + 1.65),
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
          (o.dissolve = jt.clamp((o.t - 0.35) / 0.8, 0, 1)),
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
  Cr = jt.damp,
  q0 = new b(0, 1, 0);
class X0 {
  constructor(t) {
    this.canvas = t;
    const e = new URLSearchParams(location.search);
    ((this.debug = e.has("debug")),
      (this.noSpawn = e.has("nospawn")),
      (this.god = e.has("god")));
    const n = new r0({
      canvas: t,
      antialias: !1,
      powerPreference: "high-performance",
      stencil: !1,
      alpha: !1,
    });
    (n.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)),
      n.setSize(window.innerWidth, window.innerHeight, !1),
      (n.toneMapping = _n),
      (n.shadowMap.enabled = !0),
      (n.shadowMap.type = rl),
      (n.autoClear = !1),
      n.setClearColor(0, 1),
      (this.renderer = n),
      (this.scene = new zs()),
      (this.weaponScene = new zs()));
    const s = window.innerWidth / window.innerHeight;
    ((this.camera = new Ue(80, s, 0.08, 1200)),
      (this.weaponCamera = new Ue(56, s, 0.012, 8)),
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
    const r = new kl(12571903, 1.8);
    (r.position.copy(xa).multiplyScalar(10),
      this.weaponScene.add(r),
      this.weaponScene.add(r.target),
      this.weaponScene.add(new Ol(2768230, 723208, 1.1)));
    const a = new Zn(6222591, 1.2, 4, 2);
    (a.position.set(-0.6, -0.3, -0.6),
      this.weaponCamera.add(a),
      (this.muzzleLight = new Zn(16752704, 0, 20, 2)),
      this.scene.add(this.muzzleLight),
      (this.impactLight = new Zn(16760960, 0, 9, 2)),
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
      (this._v = new b()),
      (this._v2 = new b()),
      (this._q = new an()),
      (this._e = new Ee()),
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
    const t = new ga(this.renderer),
      e = new zs();
    e.add(new Ut(this.sky.mesh.geometry, this.sky.mesh.material));
    const n = new Ut(new He(600, 600), new Zi({ color: 461069 }));
    ((n.rotation.x = -Math.PI / 2), (n.position.y = -0.5), e.add(n));
    const s = new Ut(
      new Di(38, 1.2, 8, 64),
      new Zi({ color: new Pt(0.3, 1.2, 1.6) }),
    );
    ((s.rotation.x = Math.PI / 2), (s.position.y = 3.4), e.add(s));
    for (const a of this.arena.gates) {
      const l = new Ut(
        new ni(2.5, 12, 8),
        new Zi({ color: new Pt(2.2, 0.8, 0.2) }),
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
    const t = new xe(),
      e = new Ut(new te(0.55, 0.36, 0.38), this.arena.mats.crate);
    ((e.castShadow = !0), t.add(e));
    for (const s of [-0.16, 0.16]) {
      const r = new Ut(new te(0.06, 0.37, 0.39), this.arena.mats.emCyan);
      ((r.position.x = s), t.add(r));
    }
    const n = new Ut(new te(0.3, 0.02, 0.2), this.arena.mats.emWhite);
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
    const n = this.renderer.getDrawingBufferSize(new It());
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
            jt.clamp(
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
    (this.player.addTrauma(jt.clamp(1 - e / 14, 0, 0.8)),
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
        (Math.tan(a) / Math.tan(jt.degToRad(this.camera.fov / 2))) *
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
