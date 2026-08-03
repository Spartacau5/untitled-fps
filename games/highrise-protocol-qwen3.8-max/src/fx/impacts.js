// ---------------------------------------------------------------------------
// fx/impacts.js — surface-reactive impact FX (F6): concrete dust, metal
// sparks, wood splinters, drywall puffs, blood. Decals pooled separately.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

const _n = new THREE.Vector3();

export class Impacts {
  constructor(ctx) {
    this.ctx = ctx;
  }

  _worldNormal(hit, out) {
    if (!hit.face) { out.set(0, 1, 0); return out; }
    out.copy(hit.face.normal);
    out.transformDirection(hit.object.matrixWorld);
    return out;
  }

  // point, hit (three intersection), surface tag, incoming dir
  spawn(hit, surface, dir) {
    const ctx = this.ctx;
    const rng = ctx.rng;
    const p = hit.point;
    this._worldNormal(hit, _n);

    switch (surface) {
      case 'metal': {
        const k = rng.int(5, 8);
        for (let i = 0; i < k; i++) {
          ctx.fx.particles.spawn({
            x: p.x, y: p.y, z: p.z,
            vx: _n.x * rng.range(1, 5) + rng.gauss() * 2.5 - dir.x * 1.5,
            vy: _n.y * rng.range(1, 5) + rng.gauss() * 2.5 + rng.range(0.5, 2),
            vz: _n.z * rng.range(1, 5) + rng.gauss() * 2.5 - dir.z * 1.5,
            life: rng.range(0.16, 0.34), size: rng.range(0.008, 0.016),
            grav: -9, drag: 0.6, r: 1.0, g: rng.range(0.55, 0.8), b: 0.2,
          }, true);
        }
        ctx.fx.decals.spawn(p, _n, rng);
        break;
      }
      case 'wood': {
        const k = rng.int(5, 8);
        for (let i = 0; i < k; i++) {
          ctx.fx.particles.spawn({
            x: p.x, y: p.y, z: p.z,
            vx: _n.x * rng.range(1, 3.5) + rng.gauss() * 1.6,
            vy: _n.y * rng.range(1, 3.5) + rng.range(0.5, 2.2),
            vz: _n.z * rng.range(1, 3.5) + rng.gauss() * 1.6,
            life: rng.range(0.3, 0.55), size: rng.range(0.012, 0.03),
            grav: -11, drag: 1.2, r: 0.45, g: 0.32, b: 0.2,
          }, false);
        }
        ctx.fx.decals.spawn(p, _n, rng);
        break;
      }
      case 'drywall': {
        this._dust(p, _n, dir, 0.85, 0.83, 0.8, 8);
        ctx.fx.decals.spawn(p, _n, rng);
        break;
      }
      case 'sheet': {
        this._dust(p, _n, dir, 0.8, 0.8, 0.82, 4);
        if (this.ctx.props) this.ctx.props.hitSheet(hit.object);
        break;
      }
      default: { // concrete
        this._dust(p, _n, dir, 0.62, 0.58, 0.54, 9);
        ctx.fx.decals.spawn(p, _n, rng);
        break;
      }
    }
  }

  _dust(p, n, dir, r, g, b, count) {
    const ctx = this.ctx, rng = ctx.rng;
    for (let i = 0; i < count; i++) {
      ctx.fx.particles.spawn({
        x: p.x, y: p.y, z: p.z,
        vx: n.x * rng.range(0.4, 1.8) + rng.gauss() * 0.9 - dir.x * 0.6,
        vy: n.y * rng.range(0.4, 1.8) + rng.range(0.2, 1.1),
        vz: n.z * rng.range(0.4, 1.8) + rng.gauss() * 0.9 - dir.z * 0.6,
        life: rng.range(0.35, 0.7), size: rng.range(0.02, 0.05),
        grav: -2.2, drag: 2.6, r, g, b,
      }, false);
    }
  }

  // Heavy armor plate shatters: bright metal shards + dust (E1).
  plateBreak(p, dir) {
    const ctx = this.ctx, rng = ctx.rng;
    for (let i = 0; i < 10; i++) {
      ctx.fx.particles.spawn({
        x: p.x, y: p.y, z: p.z,
        vx: -dir.x * rng.range(1.5, 4) + rng.gauss() * 2.4,
        vy: rng.range(0.8, 3.4),
        vz: -dir.z * rng.range(1.5, 4) + rng.gauss() * 2.4,
        life: rng.range(0.3, 0.6), size: rng.range(0.02, 0.05),
        grav: -12, drag: 1.0, r: 0.5, g: 0.52, b: 0.42,
      }, false);
    }
    for (let i = 0; i < 5; i++) {
      ctx.fx.particles.spawn({
        x: p.x, y: p.y, z: p.z,
        vx: rng.gauss() * 3, vy: rng.range(1, 3.5), vz: rng.gauss() * 3,
        life: rng.range(0.15, 0.3), size: rng.range(0.01, 0.02),
        grav: -8, drag: 0.5, r: 1, g: 0.75, b: 0.35,
      }, true);
    }
  }

  blood(p) {
    const ctx = this.ctx, rng = ctx.rng;
    const k = rng.int(6, 9);
    for (let i = 0; i < k; i++) {
      ctx.fx.particles.spawn({
        x: p.x, y: p.y, z: p.z,
        vx: rng.gauss() * 2.6, vy: rng.range(0.5, 2.6), vz: rng.gauss() * 2.6,
        life: rng.range(0.25, 0.45), size: rng.range(0.014, 0.03),
        grav: -12, drag: 1.0, r: 0.55, g: 0.05, b: 0.05,
      }, false);
    }
  }
}
