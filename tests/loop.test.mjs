import { test } from "node:test";
import assert from "node:assert/strict";
import { FixedLoop } from "../games/onslaught/src/core/loop.js";

test("steps exactly tick-sized slices and returns alpha", () => {
  const loop = new FixedLoop({ tick: 0.01, maxSteps: 5 });
  const dts = [];
  const alpha = loop.advance(0.025, 1, (dt) => dts.push(dt));
  assert.deepEqual(dts, [0.01, 0.01]);
  assert.ok(Math.abs(alpha - 0.5) < 1e-9);
});

test("caps steps per frame and drops the remainder", () => {
  const loop = new FixedLoop({ tick: 0.01, maxSteps: 3 });
  let n = 0;
  loop.advance(1.0, 1, () => n++);
  assert.equal(n, 3);
  assert.ok(loop.accumulator < 0.01);
});

test("timeScale slows the simulation, not the tick size", () => {
  const loop = new FixedLoop({ tick: 0.01 });
  let n = 0;
  loop.advance(0.02, 0.5, () => n++);
  assert.equal(n, 1);
});
