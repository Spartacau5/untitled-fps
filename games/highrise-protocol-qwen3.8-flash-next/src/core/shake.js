// F6: layered noise camera shake, consumed by controller + weapon kick.
import { rng } from './rng.js';

class Shake {
  constructor() {
    this.yaw = 0; this.pitch = 0; this.roll = 0; this.fov = 0;
    this.recenter = 0;                  // impulse pushing aim off (getting hit)
    this._trauma = 0;                  // 0..1
    this._seedA = rng.range(0, 100); this._seedB = rng.range(0, 100);
  }
  reset() { this.yaw = this.pitch = this.roll = this.fov = this.recenter = 0; this._trauma = 0; }
  /** tier: 1 = micro (firing), 2 = medium (near explosion), 3 = strong directional (damage) */
  add(tier, amount) { this._trauma = Math.min(1, this._trauma + tier * amount); }
  kickRecenter(dir) { this.recenter = dir; }
  update(dt, t) {
    this._trauma = Math.max(0, this._trauma - dt * 2.2);
    const s = this._trauma * this._trauma;      // trauma^2 → gentle at low doses
    const n1 = Math.sin(t * 22.3 + this._seedA) * Math.sin(t * 9.7 + this._seedB);
    const n2 = Math.sin(t * 17.1 + this._seedB) * Math.sin(t * 7.3 + this._seedA);
    const n3 = Math.sin(t * 31.7 + this._seedA * 2);
    this.yaw = n1 * 0.02 * s;
    this.pitch = n2 * 0.017 * s;
    this.roll = n3 * 0.011 * s;
    this.fov = s * 4;
    this.recenter *= Math.max(0, 1 - dt * 6);
    if (!Number.isFinite(this.recenter)) this.recenter = 0;
  }
}
export const shake = new Shake();
