// C2: Single seeded PRNG for ALL procedural generation and spawn logic.
// Seed 0xC0DA — two runs look identical.
export const SEED = 0xC0DA;

// mulberry32 — fast, deterministic, good distribution for a game.
export class PRNG {
  constructor(seed = SEED) {
    this.seed = seed >>> 0;
    this.state = this.seed >>> 0;
  }
  reset(seed = this.seed) {
    this.seed = seed >>> 0;
    this.state = this.seed >>> 0;
  }
  // Float in [0, 1)
  next() {
    this.state = (this.state + 0x6D2B79F5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  // Float in [min, max)
  range(min, max) { return min + (max - min) * this.next(); }
  // Integer in [min, max] inclusive
  int(min, max) { return Math.floor(this.range(min, max + 1)); }
  pick(arr) { return arr[this.int(0, arr.length - 1)]; }
  chance(p) { return this.next() < p; }
  sign() { return this.next() < 0.5 ? -1 : 1; }
  // Approx gaussian via sum of uniforms (central limit), centered 0
  gauss() {
    return (this.next() + this.next() + this.next() + this.next() - 2) * 0.5;
  }
}

// One shared instance — the ONLY randomness source in the game.
export const rng = new PRNG(SEED);
