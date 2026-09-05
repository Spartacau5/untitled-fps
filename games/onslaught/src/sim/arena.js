import { MathUtils, Vector3 } from "three";
import { ARENA_RADIUS, WALL_HEIGHT } from "../data/tuning.js";

export class BoxCollider {
  constructor(t, e, n, s, r, a, l) {
    ((this.cx = t),
      (this.cz = e),
      (this.hx = n),
      (this.hz = s),
      (this.y0 = r),
      (this.y1 = a),
      (this.yaw = l),
      (this.c = Math.cos(l)),
      (this.s = Math.sin(l)),
      (this.r = Math.hypot(n, s)));
  }
  // Inverse of Three.js makeRotationY: local X/Z from a world XZ offset.
  toLocal(t, e) {
    const n = t - this.cx,
      s = e - this.cz;
    return [n * this.c - s * this.s, n * this.s + s * this.c];
  }
  toWorldDir(t, e) {
    return [t * this.c + e * this.s, -t * this.s + e * this.c];
  }
}

// Pure arena: colliders, spawn gates and the random crate layout. No meshes,
// no lights — render/arena-view.js builds the visible arena from this.
export class Arena {
  constructor(rng) {
    ((this.radius = ARENA_RADIUS),
      (this.boxes = []),
      (this.gates = []),
      (this.crates = []),
      (this.rng = rng),
      this._build());
  }
  _build() {
    // Spawn gates sit in every fourth wall segment of the 24-segment ring.
    const g = 24;
    for (let z = 0; z < g; z++) {
      const U = (z / g) * Math.PI * 2;
      if (z % 4 !== 2) continue;
      this.gates.push({
        pos: new Vector3(
          Math.cos(U) * (ARENA_RADIUS - 1.4),
          0,
          Math.sin(U) * (ARENA_RADIUS - 1.4),
        ),
        dir: new Vector3(-Math.cos(U), 0, -Math.sin(U)),
        activity: 0,
        angle: U,
      });
    }
    // Eight pillars on a ring.
    for (let z = 0; z < 8; z++) {
      const U = (z / 8) * Math.PI * 2 + Math.PI / 8,
        H = Math.cos(U) * 19,
        k = Math.sin(U) * 19;
      (this.boxes.push(new BoxCollider(H, k, 0.85, 0.85, 0, 10, 0)),
        this.boxes.push(new BoxCollider(H, k, 1.15, 1.15, 0, 0.35, 0)));
    }
    // Eight barriers, alternating inner/outer radius.
    for (let z = 0; z < 8; z++) {
      const U = (z / 8) * Math.PI * 2,
        H = z % 2 === 0 ? 12.5 : 26,
        k = Math.cos(U) * H,
        G = Math.sin(U) * H,
        q = -U + Math.PI / 2,
        O = z % 2 === 0 ? 4.2 : 5.5;
      this.boxes.push(new BoxCollider(k, G, O / 2, 0.28, 0, 2.1, q));
    }
    // Perimeter: one collider per visible wall segment so the player meets
    // the mesh, not a circle that stops 0.7 m in front of it. Gate slots
    // keep a gap; jambs match the view's ±3.4 posts.
    for (let z = 0; z < g; z++) {
      const U = (z / g) * Math.PI * 2,
        k = Math.cos(U) * (ARENA_RADIUS + 0.6),
        G = Math.sin(U) * (ARENA_RADIUS + 0.6),
        q = -U + Math.PI / 2,
        c = Math.cos(q),
        s = Math.sin(q);
      if (z % 4 === 2) {
        for (const side of [-3.4, 3.4])
          this.boxes.push(
            new BoxCollider(
              k + c * side,
              G - s * side,
              1.3 / 2,
              1.6 / 2,
              0,
              WALL_HEIGHT + 0.6,
              q,
            ),
          );
        this.boxes.push(
          new BoxCollider(
            k + s * 4.6,
            G + c * 4.6,
            8.2 / 2,
            8 / 2,
            0,
            WALL_HEIGHT + 1,
            q,
          ),
        );
      } else
        this.boxes.push(
          new BoxCollider(k, G, 9.7 / 2, 1.2 / 2, 0, WALL_HEIGHT, q),
        );
    }
    // Sixteen random crates from the layout stream.
    const R = [
      [1.6, 1.6, 1.6],
      [1.2, 1.2, 1.2],
      [2.4, 1.2, 1.2],
      [1.3, 1.3, 1.3],
      [2, 1, 1.4],
    ];
    let A = 0,
      C = 0;
    for (; A < 16 && C < 400; ) {
      C++;
      const z = 9 + this.rng.float() * 22,
        U = this.rng.float() * Math.PI * 2,
        H = Math.cos(U) * z,
        k = Math.sin(U) * z;
      let G = !0;
      for (const _t of this.gates)
        Math.hypot(H - _t.pos.x, k - _t.pos.z) < 7 && (G = !1);
      for (const _t of this.boxes)
        Math.hypot(H - _t.cx, k - _t.cz) < _t.r + 2.4 && (G = !1);
      if (!G) continue;
      const q = R[Math.floor(this.rng.float() * R.length)],
        O = this.rng.float() * Math.PI;
      (this.crates.push({ x: H, z: k, size: q, yaw: O }),
        this.boxes.push(new BoxCollider(H, k, q[0] / 2, q[2] / 2, 0, q[1], O)),
        A++);
    }
  }
  groundHeight(t, e) {
    const n = Math.hypot(t, e);
    return 0.5 * MathUtils.clamp((8.5 - n) / 1.5, 0, 1);
  }
  resolveCircle(t, e, n, s = 0, r = 1.8, a = 0.35) {
    // Several passes: resolving one box can shove you into another, and a
    // single axis push at a corner can leave you overlapping the slab.
    for (let pass = 0; pass < 3; pass++) {
      for (const c of this.boxes) {
        // Capsule must overlap the box in Y. Skip side collision when feet
        // are within a step of the top of a vaultable box (crates ≤1.6 m,
        // plinths) so a jump can clear them. Barriers and walls sit at 2.1 m+
        // and stay solid even from the hex pad.
        if (s + r <= c.y0 || s >= c.y1) continue;
        if (c.y1 <= 1.7 + 1e-4 && s >= c.y1 - a) continue;
        const h = t - c.cx,
          d = e - c.cz;
        if (h * h + d * d > (c.r + n) * (c.r + n)) continue;
        const [u, m] = c.toLocal(t, e),
          g = c.hx + n - Math.abs(u),
          v = c.hz + n - Math.abs(m);
        if (g <= 0 || v <= 0) continue;
        let p = 0,
          f = 0;
        g < v ? (p = g * Math.sign(u || 1)) : (f = v * Math.sign(m || 1));
        const [w, M] = c.toWorldDir(p, f);
        ((t += w), (e += M));
      }
    }
    const l = Math.hypot(t, e),
      o = ARENA_RADIUS + 4 - n;
    return (l > o && ((t *= o / l), (e *= o / l)), [t, e]);
  }
  floorAt(t, e, n, s) {
    let r = this.groundHeight(t, e);
    for (const a of this.boxes) {
      if (a.y1 > s + 0.35) continue;
      const [l, o] = a.toLocal(t, e);
      Math.abs(l) <= a.hx + n * 0.6 &&
        Math.abs(o) <= a.hz + n * 0.6 &&
        (r = Math.max(r, a.y1));
    }
    return r;
  }
  raycast(t, e, n) {
    let s = n,
      r = 0,
      a = 1,
      l = 0,
      o = !1;
    if (e.y < -1e-6) {
      const c = -t.y / e.y;
      if (c > 0 && c < s) {
        const h = t.x + e.x * c,
          d = t.z + e.z * c;
        if (Math.hypot(h, d) < 8.5) {
          const m = (0.5 - t.y) / e.y,
            g = Math.hypot(t.x + e.x * m, t.z + e.z * m);
          if (m > 0 && g < 7) ((s = m), (r = 0), (a = 1), (l = 0), (o = !0));
          else {
            const v = (0.25 - t.y) / e.y;
            v > 0 && v < s && ((s = v), (r = 0), (a = 1), (l = 0), (o = !0));
          }
        } else ((s = c), (r = 0), (a = 1), (l = 0), (o = !0));
      }
    }
    for (const c of this.boxes) {
      const [h, d] = c.toLocal(t.x, t.z),
        u = e.x * c.c - e.z * c.s,
        m = e.x * c.s + e.z * c.c;
      let g = 0,
        v = s,
        p = -1,
        f = !0;
      const w = [
        [h, u, c.hx],
        [t.y - (c.y0 + c.y1) / 2, e.y, (c.y1 - c.y0) / 2],
        [d, m, c.hz],
      ];
      for (let M = 0; M < 3 && f; M++) {
        const [_, L, R] = w[M];
        if (Math.abs(L) < 1e-8) {
          Math.abs(_) > R && (f = !1);
          continue;
        }
        let A = (-R - _) / L,
          C = (R - _) / L;
        if (A > C) {
          const S = A;
          ((A = C), (C = S));
        }
        (A > g && ((g = A), (p = M)), C < v && (v = C), g > v && (f = !1));
      }
      if (!(!f || p < 0 || g <= 0 || g >= s))
        if (((s = g), (o = !0), p === 1))
          ((r = 0), (a = e.y > 0 ? -1 : 1), (l = 0));
        else {
          const M = p === 0 ? -Math.sign(u) : -Math.sign(m),
            [_, L] = p === 0 ? c.toWorldDir(M, 0) : c.toWorldDir(0, M);
          ((r = _), (a = 0), (l = L));
        }
    }
    {
      const c = e.x * e.x + e.z * e.z;
      if (c > 1e-8) {
        const h = 2 * (t.x * e.x + t.z * e.z),
          d = t.x * t.x + t.z * t.z - ARENA_RADIUS * ARENA_RADIUS,
          u = h * h - 4 * c * d;
        if (u > 0) {
          const m = (-h + Math.sqrt(u)) / (2 * c);
          if (m > 0 && m < s) {
            const g = t.y + e.y * m;
            if (g > 0 && g < WALL_HEIGHT + 1) {
              ((s = m), (o = !0));
              const v = t.x + e.x * m,
                p = t.z + e.z * m,
                f = Math.hypot(v, p);
              ((r = -v / f), (a = 0), (l = -p / f));
            }
          }
        }
      }
    }
    return o
      ? {
          dist: s,
          point: new Vector3(t.x + e.x * s, t.y + e.y * s, t.z + e.z * s),
          normal: new Vector3(r, a, l),
        }
      : null;
  }
  // Gate activity is sim state (spawns raise it); the view reads it for glow.
  update(dt) {
    for (const n of this.gates)
      n.activity = Math.max(0, n.activity - dt * 1.2);
  }
}
