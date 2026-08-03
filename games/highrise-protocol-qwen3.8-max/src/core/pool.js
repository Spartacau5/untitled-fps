// ---------------------------------------------------------------------------
// core/pool.js — generic capped object pool (P1). Oldest-first reuse when the
// cap is hit, so hot loops never allocate and never leak.
// ---------------------------------------------------------------------------

export class Pool {
  constructor(create, cap = 64) {
    this.create = create;
    this.cap = cap;
    this.free = [];
    this.active = [];
    this.made = 0;
    this.reuses = 0;
  }

  acquire() {
    let o;
    if (this.free.length > 0) {
      o = this.free.pop();
    } else if (this.made < this.cap) {
      o = this.create(this.made);
      this.made++;
    } else {
      o = this.active.shift(); // oldest-first reuse
      this.reuses++;
    }
    this.active.push(o);
    return o;
  }

  release(o) {
    const i = this.active.indexOf(o);
    if (i >= 0) { this.active.splice(i, 1); this.free.push(o); }
  }

  forEach(fn) {
    // iterate a copy-free backwards so callbacks may release()
    for (let i = this.active.length - 1; i >= 0; i--) fn(this.active[i], i);
  }

  releaseAll() {
    while (this.active.length) this.free.push(this.active.pop());
  }

  stats() { return { active: this.active.length, cap: this.cap, reuses: this.reuses }; }
}
