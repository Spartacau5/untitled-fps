// ---------------------------------------------------------------------------
// fx/shake.js — layered-noise camera shake (F7). Trauma decays; offsets are
// sums of sines at irrational frequency ratios — never random jitter.
// ---------------------------------------------------------------------------
import { clamp, damp } from '../core/spring.js';

export const TUNING = {
  DECAY: 1.9,            // trauma decay per second
  POS_AMP: 0.045,        // m at trauma=1
  ROT_AMP: 0.032,        // rad at trauma=1
  DIR_KICK: 2.6,         // directional damage kick spring rate
  DIR_K: 150, DIR_D: 18,
};

// fixed phase table (seeded constant — identical every run, C3)
const FX = [13.1, 17.7, 23.9, 31.3];
const FY = [11.7, 19.3, 25.1, 29.7];
const FZ = [15.3, 21.1, 27.7, 33.1];
const PH = [0.0, 1.3, 2.9, 4.2, 0.7, 2.2, 3.6, 5.1];

export class Shake {
  constructor() {
    this.trauma = 0;
    this.t = 0;
    this._kickX = 0; this._kickY = 0; this._kickZ = 0;
    this._out = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 };
  }

  reset() { this.trauma = 0; this.t = 0; this._kickX = this._kickY = this._kickZ = 0; }

  add(amount) { this.trauma = clamp(this.trauma + amount, 0, 1); }

  // directional damage kick (F7): dir = normalized direction FROM the attacker
  dirKick(dir, strength = 1) {
    this._kickX = -dir.x * 0.05 * strength;
    this._kickY = -dir.y * 0.03 * strength;
    this._kickZ = -dir.z * 0.05 * strength;
  }

  update(dt) {
    this.t += dt;
    this.trauma = Math.max(0, this.trauma - TUNING.DECAY * dt);
    const k = Math.exp(-TUNING.DIR_K * dt * 0.4);
    this._kickX *= k; this._kickY *= k; this._kickZ *= k;
  }

  sample() {
    const s = this.trauma * this.trauma; // quadratic falloff: subtle -> strong
    const t = this.t;
    const o = this._out;
    let x = 0, y = 0, z = 0;
    for (let i = 0; i < 4; i++) {
      x += Math.sin(t * FX[i] + PH[i]) * (0.5 + 0.5 / (i + 1));
      y += Math.sin(t * FY[i] + PH[i + 4]) * (0.5 + 0.5 / (i + 1));
      z += Math.sin(t * FZ[i] + PH[i] * 1.7) * (0.4 + 0.4 / (i + 1));
    }
    o.x = x * 0.25 * TUNING.POS_AMP * s + this._kickX;
    o.y = y * 0.25 * TUNING.POS_AMP * s + this._kickY;
    o.z = z * 0.25 * TUNING.POS_AMP * s + this._kickZ;
    o.rx = y * 0.3 * TUNING.ROT_AMP * s;
    o.ry = z * 0.3 * TUNING.ROT_AMP * s;
    o.rz = x * 0.22 * TUNING.ROT_AMP * s;
    return o;
  }
}
