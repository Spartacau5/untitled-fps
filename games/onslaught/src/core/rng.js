// mulberry32: small, fast, good enough for gameplay. Deterministic across JS engines.
export function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashLabel(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++)
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

export class RNG {
  constructor(seed) {
    this.seed = seed >>> 0;
    this._next = mulberry32(this.seed);
  }
  float() {
    return this._next();
  }
  range(a, b) {
    return a + this._next() * (b - a);
  }
  int(n) {
    return Math.floor(this._next() * n);
  }
  pick(arr) {
    return arr[Math.floor(this._next() * arr.length)];
  }
  chance(p) {
    return this._next() < p;
  }
  fork(label) {
    return new RNG((this.seed ^ hashLabel(label)) >>> 0);
  }
}

export function parseSeed(search) {
  const s = new URLSearchParams(search).get("seed");
  if (s !== null && s !== "" && Number.isFinite(+s)) return +s >>> 0;
  return (Date.now() % 4294967296) >>> 0;
}
