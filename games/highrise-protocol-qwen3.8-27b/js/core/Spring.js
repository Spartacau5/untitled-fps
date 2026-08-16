// C5: Spring-damper systems for recoil recovery, viewmodel, HUD.
// Semi-implicit Euler integration; guarded against NaN (K4).
export class Spring {
  // value + velocity, stiffness (omega^2), damping ratio zeta
  constructor(value = 0, stiffness = 220, zeta = 1.0, target = 0) {
    this.value = value;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.zeta = zeta;
    this.target = target;
  }
  set(v, vel = 0) { this.value = v; this.velocity = vel; this.target = v; }
  addImpulse(impulse) { this.velocity += impulse; }
  // Update with dt (seconds). Returns current value.
  // Substeps to ≤1/60s so the feel is identical at any frame rate (K4/C5).
  update(dt) {
    if (!Number.isFinite(dt) || dt <= 0) return this.value;
    // clamp dt to avoid explosion after tab switch (K4)
    if (dt > 0.05) dt = 0.05;
    const w = Math.sqrt(this.stiffness);
    const c = 2 * this.zeta * w;
    let rem = dt;
    while (rem > 0) {
      const d = rem > (1 / 60) ? (1 / 60) : rem;
      const x = this.value - this.target;
      const a = -this.stiffness * x - c * this.velocity;
      this.velocity += a * d;
      this.value += this.velocity * d;
      rem -= d;
    }
    // NaN guard (K4)
    if (!Number.isFinite(this.value)) { this.value = this.target; this.velocity = 0; }
    if (!Number.isFinite(this.velocity)) { this.velocity = 0; }
    return this.value;
  }
  // Critical damping helper
  critical() { this.zeta = 1.0; return this; }
}

// 2D spring (two coupled 1D springs) for camera offsets / weapon XY.
export class Spring2 {
  constructor(x = 0, y = 0, stiffness = 220, zeta = 1.0) {
    this.x = new Spring(x, stiffness, zeta);
    this.y = new Spring(y, stiffness, zeta);
  }
  set(x, y) { this.x.set(x); this.y.set(y); }
  update(dt) { this.x.update(dt); this.y.update(dt); return this; }
  impulse(ix, iy) { this.x.addImpulse(ix); this.y.addImpulse(iy); }
}
