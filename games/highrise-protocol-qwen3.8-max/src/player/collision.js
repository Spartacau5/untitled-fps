// ---------------------------------------------------------------------------
// player/collision.js — AABB world: entity movement + slab raycast.
// World geometry is boxes, so physics AABBs and render meshes agree exactly.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

export class CollisionWorld {
  constructor() {
    this.boxes = []; // {min:Vector3, max:Vector3, tag}
  }

  addBox(cx, cy, cz, sx, sy, sz, tag = 'solid') {
    this.boxes.push({
      min: new THREE.Vector3(cx - sx / 2, cy - sy / 2, cz - sz / 2),
      max: new THREE.Vector3(cx + sx / 2, cy + sy / 2, cz + sz / 2),
      tag,
    });
  }

  // pos = feet center. Mutates pos, zeroes velocity axes on block.
  moveAABB(pos, hx, hz, height, vel, dt) {
    const out = { ground: false, wall: false };

    // X axis
    pos.x += vel.x * dt;
    for (const b of this.boxes) {
      if (pos.y + height <= b.min.y + 0.02 || pos.y >= b.max.y - 0.02) continue;
      if (pos.x + hx > b.min.x && pos.x - hx < b.max.x &&
          pos.z + hz > b.min.z && pos.z - hz < b.max.z) {
        pos.x = (vel.x > 0) ? b.min.x - hx : b.max.x + hx;
        vel.x = 0; out.wall = true;
      }
    }
    // Z axis
    pos.z += vel.z * dt;
    for (const b of this.boxes) {
      if (pos.y + height <= b.min.y + 0.02 || pos.y >= b.max.y - 0.02) continue;
      if (pos.x + hx > b.min.x && pos.x - hx < b.max.x &&
          pos.z + hz > b.min.z && pos.z - hz < b.max.z) {
        pos.z = (vel.z > 0) ? b.min.z - hz : b.max.z + hz;
        vel.z = 0; out.wall = true;
      }
    }
    // Y axis
    pos.y += vel.y * dt;
    for (const b of this.boxes) {
      if (pos.x + hx > b.min.x && pos.x - hx < b.max.x &&
          pos.z + hz > b.min.z && pos.z - hz < b.max.z) {
        if (pos.y < b.max.y && pos.y + height > b.min.y) {
          if (vel.y <= 0 && pos.y > b.max.y - 0.6) {
            pos.y = b.max.y; vel.y = 0; out.ground = true;
          } else if (vel.y > 0 && pos.y + height < b.min.y + 0.6) {
            pos.y = b.min.y - height; vel.y = 0;
          }
        }
      }
    }
    // World floor (slab top is y=0)
    if (pos.y <= 0) { pos.y = 0; if (vel.y < 0) vel.y = 0; out.ground = true; }
    return out;
  }

  // Slab raycast vs all boxes. Returns {dist, point, normal, box} or null.
  raycast(origin, dir, maxDist) {
    let best = null;
    const invX = 1 / (dir.x || 1e-9), invY = 1 / (dir.y || 1e-9), invZ = 1 / (dir.z || 1e-9);
    for (const b of this.boxes) {
      let t1 = (b.min.x - origin.x) * invX, t2 = (b.max.x - origin.x) * invX;
      let tmin = Math.min(t1, t2), tmax = Math.max(t1, t2);
      t1 = (b.min.y - origin.y) * invY; t2 = (b.max.y - origin.y) * invY;
      tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2));
      t1 = (b.min.z - origin.z) * invZ; t2 = (b.max.z - origin.z) * invZ;
      tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2));
      if (tmax < 0 || tmin > tmax || tmin > maxDist) continue;
      const t = tmin >= 0 ? tmin : tmax;
      if (t < 0 || t > maxDist) continue;
      if (!best || t < best.dist) {
        const p = new THREE.Vector3().copy(origin).addScaledVector(dir, t);
        const n = new THREE.Vector3();
        const eps = 0.002;
        if (Math.abs(p.x - b.min.x) < eps) n.set(-1, 0, 0);
        else if (Math.abs(p.x - b.max.x) < eps) n.set(1, 0, 0);
        else if (Math.abs(p.y - b.min.y) < eps) n.set(0, -1, 0);
        else if (Math.abs(p.y - b.max.y) < eps) n.set(0, 1, 0);
        else if (Math.abs(p.z - b.min.z) < eps) n.set(0, 0, -1);
        else n.set(0, 0, 1);
        best = { dist: t, point: p, normal: n, box: b };
      }
    }
    return best;
  }

  // Cheap horizontal push-out for enemies (feet position, radius r).
  pushOut(pos, r, height = 1.6) {
    for (const b of this.boxes) {
      if (pos.y + height <= b.min.y || pos.y >= b.max.y) continue;
      const cx = Math.max(b.min.x, Math.min(pos.x, b.max.x));
      const cz = Math.max(b.min.z, Math.min(pos.z, b.max.z));
      const dx = pos.x - cx, dz = pos.z - cz;
      const d2 = dx * dx + dz * dz;
      if (d2 < r * r) {
        const d = Math.sqrt(d2) || 1e-5;
        const push = (r - d) / d;
        pos.x += dx * push; pos.z += dz * push;
      }
    }
  }
}
