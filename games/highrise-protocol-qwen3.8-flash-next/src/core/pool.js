// P1: generic pooled objects with hard caps; oldest-first reuse when exhausted.
export class Pool {
  constructor(factory, cap, resetFn = null) {
    this.factory = factory;
    this.cap = cap;
    this.resetFn = resetFn;
    this.free = [];
    this.live = [];
    this.peak = 0;
    this.steals = 0;
  }
  acquire() {
    if (this.live.length >= this.cap) {
      const victim = this.live.shift();       // oldest first
      this.steals++;
      if (this.resetFn) this.resetFn(victim);
      victim._inPool = false;
      this.live.push(victim);
      victim._last = victim;
      return victim;
    }
    const o = this.free.length ? this.free.pop() : this.factory();
    o._inPool = false;
    this.live.push(o);
    if (this.live.length > this.peak) this.peak = this.live.length;
    return o;
  }
  release(o) {
    if (o._inPool) return;
    o._inPool = true;
    const i = this.live.indexOf(o);
    if (i >= 0) this.live.splice(i, 1);
    if (this.resetFn) this.resetFn(o);
    this.free.push(o);
  }
  releaseAll() { while (this.live.length) this.release(this.live[this.live.length - 1]); }
  get stats() { return `${this.live.length}/${this.cap}${this.peak !== this.cap ? '' : ''}`; }
}
