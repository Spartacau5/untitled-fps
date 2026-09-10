import assert from "node:assert/strict";
import { test } from "node:test";
import { NAV_ENTER, NAV_EXIT } from "../games/onslaught/src/core/gamepad.js";
import { PadMenu } from "../games/onslaught/src/ui/pad-menu.js";

// _stickNav is pure state plus arithmetic - no DOM - so it can be driven
// directly. This is the part that decides whether the menu feels twitchy.
const nav = () => new PadMenu(null);
// move.y is flipped so forward is +1, so "down the list" is a negative y.
const push = (m, x, y) => m._stickNav({ x, y: -y });

test("a light lean does not walk the menu", () => {
  const m = nav();
  for (const v of [0.1, 0.3, NAV_ENTER - 0.02])
    assert.deepEqual(push(m, 0, v), { x: 0, y: 0 }, `${v} moved the menu`);
});

test("a firm push catches, and it takes a real release to let go", () => {
  const m = nav();
  assert.equal(push(m, 0, 0.9).y, 1, "a firm push has to catch");
  // The whole point of the hysteresis: easing back to just under the entry
  // threshold must NOT drop the direction, because re-entering fires another
  // step immediately and that is what made a held stick machine-gun a list.
  assert.equal(push(m, 0, NAV_ENTER - 0.05).y, 1, "it let go too easily");
  assert.equal(push(m, 0, NAV_EXIT + 0.05).y, 1, "still held");
  assert.equal(push(m, 0, NAV_EXIT - 0.05).y, 0, "a real release must let go");
  // And once released it needs the full push again, not the exit threshold.
  assert.equal(push(m, 0, NAV_EXIT + 0.1).y, 0, "re-caught below the entry");
  assert.equal(push(m, 0, 0.9).y, 1);
});

test("a stick hovering at the threshold does not rattle", () => {
  // The failure this exists to stop: with one threshold, a stick resting near
  // it flips on and off every frame and each flip is another step.
  const m = nav();
  push(m, 0, 0.9);
  let flips = 0,
    last = 1;
  for (let i = 0; i < 60; i++) {
    // Wobbling either side of the entry threshold, as a thumb actually does.
    const v = NAV_ENTER + Math.sin(i) * 0.06;
    const y = push(m, 0, v).y;
    if (y !== last) flips++;
    last = y;
  }
  assert.equal(flips, 0, `direction flipped ${flips} times while held steady`);
});

test("a diagonal picks a lane instead of firing both ways", () => {
  const m = nav();
  const d = push(m, 0.8, 0.75);
  assert.ok(
    (d.x === 0) !== (d.y === 0),
    `diagonal gave x ${d.x} and y ${d.y} - it must pick one`,
  );
  assert.equal(d.x, 1, "the axis it is leaning into further wins");
  // And it does not alternate as the stick wanders around the diagonal.
  let flips = 0,
    last = d;
  for (let i = 0; i < 40; i++) {
    const n = push(m, 0.8 + Math.sin(i) * 0.05, 0.75 + Math.cos(i) * 0.05);
    if (n.x !== last.x || n.y !== last.y) flips++;
    last = { ...n };
  }
  assert.equal(flips, 0, `the lane changed ${flips} times`);
});

test("letting go clears the latch, so the next push starts fresh", () => {
  const m = nav();
  push(m, 0, 0.9);
  assert.deepEqual(push(m, 0, 0), { x: 0, y: 0 });
  assert.equal(push(m, 0, -0.9).y, -1, "the other way works straight after");
});

test("the repeat is slow enough to stop on the row you wanted", () => {
  // Nine steps a second walks past anything in a list of eleven. This pins
  // the rate somewhere a person can actually stop on a target.
  const m = nav();
  const list = Array.from({ length: 12 }, (_, i) => ({
    focus() {
      m._at = i;
    },
  }));
  m.doc = { activeElement: null };
  m._at = -1;
  // Drive one second of a held direction through the repeat logic.
  let steps = 0;
  const realMove = m._move.bind(m);
  m._move = (l, d) => (steps++, realMove(l, d));
  m.targets = () => list;
  for (let i = 0; i < 60; i++)
    m.update({ move: { x: 0, y: -1 }, navX: 0, navY: 0 }, 1 / 60, {});
  assert.ok(steps >= 3, `only ${steps} steps in a second - too sluggish`);
  assert.ok(steps <= 7, `${steps} steps in a second - still too twitchy`);
});
