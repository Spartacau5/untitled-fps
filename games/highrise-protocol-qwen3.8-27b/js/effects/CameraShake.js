import * as THREE from 'three';

// F6: camera shake tiers — micro (firing), medium (nearby explosion),
// strong directional (taking damage). Layered sine noise, never random jitter.
// Exposes offset (Vector3) and rotation (Euler) to add to the camera.
export class CameraShake {
  constructor() {
    this.energy = 0;
    this.dir = new THREE.Vector3(0, 0, 0);   // directional bias (damage)
    this.dirAmt = 0;
    this.t = 0;
    // prebaked phases so the noise is smooth & deterministic
    this._p = [0.3, 1.7, 2.9, 4.1, 0.9, 2.2, 3.5, 5.0];
    this.offset = new THREE.Vector3();
    this.rot = new THREE.Euler();
  }
  // add shake energy (0..~2). Higher = bigger.
  add(amount, dir = null) {
    this.energy = Math.min(2.5, this.energy + amount);
    if (dir) {
      this.dir.copy(dir).normalize();
      this.dirAmt = Math.min(1, this.dirAmt + amount * 0.6);
    }
  }
  // quick micro shake for firing
  micro() { this.add(0.05); }
  explosion() { this.add(0.5); }
  damage(dir) { this.add(0.9, dir); }
  update(dt) {
    if (dt > 0.05) dt = 0.05;
    this.t += dt;
    // decay
    this.energy *= Math.exp(-dt * 6.5);
    this.dirAmt *= Math.exp(-dt * 5.0);
    if (this.energy < 0.0005) this.energy = 0;
    if (this.dirAmt < 0.0005) this.dirAmt = 0;

    const e = this.energy;
    const t = this.t;
    // layered sines = smooth pseudo-noise
    const n1 = Math.sin(t * 27.0 + this._p[0]) * 0.5 + Math.sin(t * 41.0 + this._p[1]) * 0.3 + Math.sin(t * 63.0 + this._p[2]) * 0.2;
    const n2 = Math.sin(t * 33.0 + this._p[3]) * 0.5 + Math.sin(t * 47.0 + this._p[4]) * 0.3 + Math.sin(t * 59.0 + this._p[5]) * 0.2;
    const n3 = Math.sin(t * 29.0 + this._p[6]) * 0.5 + Math.sin(t * 53.0 + this._p[7]) * 0.3 + Math.sin(t * 67.0 + this._p[0]) * 0.2;
    const amp = e * 0.06;
    this.offset.set(n1 * amp, n2 * amp, n3 * amp);
    // directional push for damage
    if (this.dirAmt > 0) {
      this.offset.addScaledVector(this.dir, this.dirAmt * 0.05);
    }
    this.rot.set(n2 * e * 0.02, n3 * e * 0.02, n1 * e * 0.015);
  }
  reset() { this.energy = 0; this.dirAmt = 0; this.offset.set(0, 0, 0); this.rot.set(0, 0, 0); }
}
