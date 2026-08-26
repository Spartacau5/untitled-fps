// C5: every animation is a spring or a named easing. Linear lerp is a defect.
// Damped-spring integrator: k = stiffness, zeta = damping ratio (1 = critical, <1 = overshoot).
// NaN-guarded (K4), fixed-substep semi-implicit Euler for stability at high k.

export class Spring {
  constructor(value = 0, k = 140, zeta = 1) {
    this.value = value; this.target = value; this.vel = 0;
    this.k = k; this.zeta = zeta;
  }
  set(t) { this.target = t; return this; }
  snap(x) { this.value = x; this.target = x; this.vel = 0; return this; }
  impulse(dv) { this.vel += dv; return this; }
  update(dt) {
    let x = this.value, v = this.vel; const t = this.target;
    if (!Number.isFinite(x) || !Number.isFinite(v)) { x = Number.isFinite(t) ? t : 0; v = 0; }
    const w = Math.sqrt(Math.max(this.k, 0));
    const c = 2 * this.zeta * w;
    let rem = Math.min(dt, 0.05);
    while (rem > 1e-5) {
      const h = Math.min(rem, 1 / 240);
      v += (-w * w * (x - t) - c * v) * h;
      x += v * h;
      rem -= h;
    }
    this.value = x; this.vel = v;
    return this;
  }
}

export class Spring3 {
  constructor(x = 0, y = 0, z = 0, k = 140, zeta = 1) {
    this.sx = new Spring(x, k, zeta);
    this.sy = new Spring(y, k, zeta);
    this.sz = new Spring(z, k, zeta);
  }
  set(x, y, z) { this.sx.set(x); this.sy.set(y); this.sz.set(z); return this; }
  snap(x, y, z) { this.sx.snap(x); this.sy.snap(y); this.sz.snap(z); return this; }
  impulse(dx, dy, dz) { this.sx.impulse(dx); this.sy.impulse(dy); this.sz.impulse(dz); return this; }
  update(dt) { this.sx.update(dt); this.sy.update(dt); this.sz.update(dt); return this; }
  get value() { return { x: this.sx.value, y: this.sy.value, z: this.sz.value }; }
  applyTo(vec3) { vec3.set(this.sx.value, this.sy.value, this.sz.value); return vec3; }
}
