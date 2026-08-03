// ---------------------------------------------------------------------------
// core/rng.js — single seeded PRNG (C3). Seed 0xC0DA. Two runs look identical.
// mulberry32: small, fast, good distribution for gameplay use.
// ---------------------------------------------------------------------------

export const SEED = 0xC0DA;

export class RNG {
  constructor(seed = SEED) { this.reset(seed); }

  reset(seed = SEED) {
    this.s = seed >>> 0;
    this.count = 0;
  }

  next() {
    this.s = (this.s + 0x6D2B79F5) >>> 0;
    let t = this.s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    this.count++;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(a, b) { return a + (b - a) * this.next(); }
  int(a, b) { return a + Math.floor(this.next() * (b - a + 1)); } // inclusive
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  chance(p) { return this.next() < p; }
  sign() { return this.next() < 0.5 ? -1 : 1; }
  gauss() { return (this.next() + this.next() + this.next()) / 1.5 - 1; } // ~[-1,1] bell
}
