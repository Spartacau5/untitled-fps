export const SEED = 0xC0DA;

export class RNG {
  constructor(seed = SEED) {
    this.seed = seed >>> 0;
    this.state = this.seed || 0x9e3779b9;
  }

  next() {
    let x = this.state >>> 0;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.state = x >>> 0;
    return this.state / 0x100000000;
  }

  signed() { return this.next() * 2 - 1; }
  range(min, max) { return min + (max - min) * this.next(); }
  int(min, max) { return Math.floor(this.range(min, max + 1)); }
  pick(list) { return list[Math.floor(this.next() * list.length)]; }
  fork(salt = 0) { return new RNG((this.seed ^ salt ^ this.state) >>> 0); }
}
