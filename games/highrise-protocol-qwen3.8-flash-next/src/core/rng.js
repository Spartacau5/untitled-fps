// C2: single seeded PRNG stream for ALL procedural generation + spawn logic.
export const SEED = 0xC0DA;

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  constructor(seed = SEED) { this.seed = seed >>> 0; this.reseed(); }
  reseed(s = this.seed) { this.seed = s >>> 0; this._f = mulberry32(this.seed); }
  next() { return this._f(); }
  range(a, b) { return a + (b - a) * this._f(); }
  int(n) { return Math.floor(this._f() * n); }
  pick(arr) { return arr[this.int(arr.length)]; }
  sign() { return this._f() < 0.5 ? -1 : 1; }
  gauss() {
    const u = Math.max(this._f(), 1e-9), v = this._f();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = this.int(i + 1); const t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
}

export const rng = new Rng();
