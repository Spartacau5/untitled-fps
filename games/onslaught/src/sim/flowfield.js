import { ARENA_RADIUS } from "../data/tuning.js";

// Breadth-first flow field over the arena floor.
//
// Local steering - probe ahead, sidestep if blocked - has local minima by
// construction: behind a pillar every forward heading is worse than standing
// still, so an enemy oscillates until the player moves and changes the
// gradient. No amount of whisker tuning removes that, it only shrinks the set
// of geometry that triggers it.
//
// The arena is small, static and known, so the honest fix is a real distance
// field. A BFS out from the player's cell gives every open cell its true
// walking distance, and an enemy just steps to whichever neighbour is closer.
// Dead ends cost nothing because the flood already went around them.
//
// Deterministic: integer BFS over a fixed grid, no randomness, no clock.
const CELL = 0.5;
// Cell clearance. Generous enough that the small enemies fit through the gaps
// the geometry intends; body-sized separation is still the collision code's
// job, not the planner's.
const CLEARANCE = 0.4;
const UNREACHABLE = 0x7fffffff;

// 8-way so diagonal gaps are usable; the ordinals are checked against their
// two cardinals so nothing cuts a corner through solid geometry.
const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export class FlowField {
  constructor(arena, cell = CELL) {
    this.cell = cell;
    this.origin = -(ARENA_RADIUS + 1);
    this.n = Math.ceil(((ARENA_RADIUS + 1) * 2) / cell);
    const total = this.n * this.n;
    this.open = new Uint8Array(total);
    this.dist = new Int32Array(total);
    this.queue = new Int32Array(total);
    this.srcCell = -1;
    this._bake(arena);
  }
  // A new run must not inherit the previous run's flood, or a replay from the
  // same seed can start from a different field than the original did.
  reset() {
    this.srcCell = -1;
  }
  // Static geometry, so passability is computed once when the arena is built.
  _bake(arena) {
    const { n, cell, origin } = this;
    const limit = ARENA_RADIUS - CLEARANCE - 0.5;
    for (let gz = 0; gz < n; gz++) {
      const z = origin + (gz + 0.5) * cell;
      for (let gx = 0; gx < n; gx++) {
        const x = origin + (gx + 0.5) * cell;
        let ok = Math.hypot(x, z) < limit;
        if (ok)
          for (const b of arena.boxes) {
            if (b.y1 < 0.5) continue;
            const [lx, lz] = b.toLocal(x, z);
            if (
              Math.abs(lx) < b.hx + CLEARANCE &&
              Math.abs(lz) < b.hz + CLEARANCE
            ) {
              ok = false;
              break;
            }
          }
        this.open[gz * n + gx] = ok ? 1 : 0;
      }
    }
  }
  _gx(x) {
    return Math.floor((x - this.origin) / this.cell);
  }
  cellOf(x, z) {
    const gx = this._gx(x),
      gz = this._gx(z);
    if (gx < 0 || gz < 0 || gx >= this.n || gz >= this.n) return -1;
    return gz * this.n + gx;
  }
  // Nearest open cell to a point, so a target standing inside geometry (or
  // just past the clearance margin) still seeds a usable field.
  _nearestOpen(x, z) {
    const start = this.cellOf(x, z);
    if (start >= 0 && this.open[start]) return start;
    const gx0 = this._gx(x),
      gz0 = this._gx(z);
    for (let r = 1; r <= 8; r++)
      for (let dz = -r; dz <= r; dz++)
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
          const gx = gx0 + dx,
            gz = gz0 + dz;
          if (gx < 0 || gz < 0 || gx >= this.n || gz >= this.n) continue;
          const i = gz * this.n + gx;
          if (this.open[i]) return i;
        }
    return -1;
  }
  // Reflood only when the target has actually changed cell. At a 0.5 m grid
  // that is a handful of times a second even when sprinting.
  update(x, z) {
    const src = this._nearestOpen(x, z);
    if (src < 0 || src === this.srcCell) return;
    this.srcCell = src;
    const { n, dist, open, queue } = this;
    dist.fill(UNREACHABLE);
    dist[src] = 0;
    queue[0] = src;
    let head = 0,
      tail = 1;
    while (head < tail) {
      const cur = queue[head++],
        cx = cur % n,
        cz = (cur - cx) / n,
        next = dist[cur] + 1;
      for (let k = 0; k < 8; k++) {
        const gx = cx + NEIGHBOURS[k][0],
          gz = cz + NEIGHBOURS[k][1];
        if (gx < 0 || gz < 0 || gx >= n || gz >= n) continue;
        const i = gz * n + gx;
        if (!open[i] || dist[i] <= next) continue;
        // Diagonals need both cardinals clear or they clip a corner.
        if (k >= 4 && (!open[cz * n + gx] || !open[gz * n + cx])) continue;
        dist[i] = next;
        queue[tail++] = i;
      }
    }
  }
  // Unit vector toward the neighbouring cell closest to the target, or null
  // when the caller is somewhere the flood never reached.
  dirAt(x, z) {
    const { n, dist } = this;
    const here = this._nearestOpen(x, z);
    if (here < 0 || dist[here] === UNREACHABLE) return null;
    const cx = here % n,
      cz = (here - cx) / n;
    let best = dist[here],
      bx = 0,
      bz = 0;
    for (let k = 0; k < 8; k++) {
      const gx = cx + NEIGHBOURS[k][0],
        gz = cz + NEIGHBOURS[k][1];
      if (gx < 0 || gz < 0 || gx >= n || gz >= n) continue;
      const i = gz * n + gx;
      if (dist[i] >= best) continue;
      if (k >= 4 && (!this.open[cz * n + gx] || !this.open[gz * n + cx]))
        continue;
      ((best = dist[i]), (bx = NEIGHBOURS[k][0]), (bz = NEIGHBOURS[k][1]));
    }
    if (!bx && !bz) return null;
    // Steer at the centre of that cell rather than along the grid axis, which
    // keeps the path off the lattice and stops the shuffle between two cells.
    const tx = this.origin + (cx + bx + 0.5) * this.cell,
      tz = this.origin + (cz + bz + 0.5) * this.cell;
    const dx = tx - x,
      dz = tz - z,
      len = Math.hypot(dx, dz) || 1;
    return [dx / len, dz / len];
  }
}
