import assert from "node:assert/strict";
import { test } from "node:test";
import { RNG } from "../games/onslaught/src/core/rng.js";
import { Arena, BoxCollider } from "../games/onslaught/src/sim/arena.js";

test("a jump-height capsule still collides with the inner barriers", () => {
  const arena = new Arena(new RNG(1).fork("layout"));
  // Inner barrier at angle 0 sits at (12.5, 0), 2.1 m tall. Standing on the
  // hex pad and jumping used to skip this collider once feet cleared 1.75 m.
  const [x, z] = arena.resolveCircle(12.5, 0, 0.4, 1.8, 1.8, 0.35);
  assert.ok(
    Math.hypot(x - 12.5, z) > 0.4,
    `expected an ejection from inside the barrier, got (${x}, ${z})`,
  );
});

test("crate-height boxes are vaultable once feet reach the top", () => {
  const arena = new Arena(new RNG(1).fork("layout"));
  arena.boxes.push(new BoxCollider(0, 0, 0.6, 0.6, 0, 1.2, 0));
  // Jump apex is ~1.3 m. At y=0.9 the 1.2 m crate is within the 0.35 m step,
  // so side collision should drop and the player can go over.
  const [x, z] = arena.resolveCircle(0, 0, 0.4, 0.9, 1.8, 0.35);
  assert.ok(
    Math.hypot(x, z) < 0.05,
    `crate should not side-push at jump height, got (${x}, ${z})`,
  );
});

test("crate-height boxes still block walking", () => {
  const arena = new Arena(new RNG(1).fork("layout"));
  arena.boxes.push(new BoxCollider(0, 0, 0.6, 0.6, 0, 1.2, 0));
  const [x, z] = arena.resolveCircle(0, 0, 0.4, 0, 1.8, 0.35);
  assert.ok(
    Math.hypot(x, z) > 0.4,
    `expected an ejection from inside the crate, got (${x}, ${z})`,
  );
});

test("low pillar bases remain step-uppable", () => {
  const arena = new Arena(new RNG(1).fork("layout"));
  const ang = Math.PI / 8,
    cx = 19 * Math.cos(ang),
    cz = 19 * Math.sin(ang),
    // On the 0.35 m plinth, outside the shaft (0.85 + radius 0.4 = 1.25).
    ox = cx + Math.cos(ang) * 1.4,
    oz = cz + Math.sin(ang) * 1.4;
  const [x, z] = arena.resolveCircle(ox, oz, 0.4, 0.2, 1.8, 0.35);
  assert.ok(
    Math.hypot(x - ox, z - oz) < 0.05,
    `plinth should not side-push, moved ${Math.hypot(x - ox, z - oz).toFixed(3)}`,
  );
});

test("toLocal inverts Three.js makeRotationY", () => {
  const yaw = Math.PI / 4,
    box = new BoxCollider(10, 20, 2.75, 0.28, 0, 2.1, yaw),
    c = Math.cos(yaw),
    s = Math.sin(yaw),
    // Mesh +Z (local thickness) in world: (s, c)
    [lx, lz] = box.toLocal(10 + s * 2, 20 + c * 2);
  assert.ok(Math.abs(lx) < 1e-9, `expected local X ~0, got ${lx}`);
  assert.ok(Math.abs(lz - 2) < 1e-9, `expected local Z ~2, got ${lz}`);
});

test("open ground beside a diagonal barrier is not a ghost wall", () => {
  const arena = new Arena(new RNG(1).fork("layout")),
    U = Math.PI / 4,
    H = 26,
    cx = Math.cos(U) * H,
    cz = Math.sin(U) * H,
    q = -U + Math.PI / 2,
    ox = cx + Math.sin(q) * 2,
    oz = cz + Math.cos(q) * 2,
    [x, z] = arena.resolveCircle(ox, oz, 0.4, 0, 1.8, 0.35);
  assert.ok(
    Math.hypot(x - ox, z - oz) < 0.05,
    `ghost wall pushed ${Math.hypot(x - ox, z - oz).toFixed(3)} from (${ox.toFixed(2)}, ${oz.toFixed(2)}) to (${x.toFixed(2)}, ${z.toFixed(2)})`,
  );
});

test("the diagonal barrier still blocks its visible slab", () => {
  const arena = new Arena(new RNG(1).fork("layout")),
    U = Math.PI / 4,
    H = 26,
    cx = Math.cos(U) * H,
    cz = Math.sin(U) * H,
    [x, z] = arena.resolveCircle(cx, cz, 0.4, 0, 1.8, 0.35);
  assert.ok(
    Math.hypot(x - cx, z - cz) > 0.4,
    `expected an ejection from inside the barrier, got (${x}, ${z})`,
  );
});

test("outer wall collides at the mesh, not a circle in empty space", () => {
  const arena = new Arena(new RNG(1).fork("layout"));
  // 1 m inside the visual inner face (~r=36); player radius 0.4 → free.
  const [x, z] = arena.resolveCircle(35.0, 0, 0.4, 0, 1.8, 0.35);
  assert.ok(
    Math.hypot(x - 35, z) < 0.05,
    `empty ring in front of the wall pushed ${Math.hypot(x - 35, z).toFixed(3)}`,
  );
  // Overlapping the inner half of the slab should eject back into the arena.
  const [x2, z2] = arena.resolveCircle(35.85, 0, 0.4, 0, 1.8, 0.35);
  assert.ok(
    x2 < 35.85 && x2 > 34.8,
    `expected inward ejection from the perimeter slab, got (${x2}, ${z2})`,
  );
});
