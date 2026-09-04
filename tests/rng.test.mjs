import { test } from "node:test";
import assert from "node:assert/strict";
import { RNG } from "../games/onslaught/src/core/rng.js";

test("same seed → same sequence", () => {
  const a = new RNG(42),
    b = new RNG(42);
  for (let i = 0; i < 1000; i++) assert.equal(a.float(), b.float());
});

test("range/int/pick/chance are in bounds", () => {
  const r = new RNG(7);
  for (let i = 0; i < 1000; i++) {
    const x = r.range(-2, 3);
    assert.ok(x >= -2 && x < 3);
    const n = r.int(5);
    assert.ok(Number.isInteger(n) && n >= 0 && n < 5);
    assert.ok(["a", "b"].includes(r.pick(["a", "b"])));
    assert.equal(typeof r.chance(0.5), "boolean");
  }
});

test("fork gives independent but deterministic streams", () => {
  const a = new RNG(1).fork("combat"),
    b = new RNG(1).fork("combat"),
    c = new RNG(1).fork("ai");
  assert.equal(a.float(), b.float());
  assert.notEqual(a.float(), c.float());
});
