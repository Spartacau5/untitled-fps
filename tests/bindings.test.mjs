import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BINDINGS,
  Input,
  WEAPON_SLOT_CODES,
} from "../games/onslaught/src/core/input.js";

// frame() reads BINDINGS and the how-to-play screen renders BINDINGS, so the
// two can only agree. These tests guard the table itself: a binding with no
// displayable glyph would render as an empty row, and a code claimed by two
// bindings would fire two actions from one key.

// Input's constructor touches window/document; frame() only touches its own
// fields, so call it against a plain object instead of building a DOM.
const frameWith = ({ keys = [], pressed = [], wheel = 0 } = {}) =>
  Input.prototype.frame.call({
    keys: new Set(keys),
    pressed: new Set(pressed),
    mouseDown: [false, false, false],
    mousePressed: [false, false, false],
    wheel,
  });

test("every binding renders at least one key glyph", () => {
  for (const b of BINDINGS) {
    const caps = b.caps || b.codes || [];
    assert.ok(caps.length > 0, `${b.id} has nothing to draw`);
    assert.ok(b.label, `${b.id} has no label`);
    assert.ok(b.group, `${b.id} has no group`);
  }
});

test("no key code is claimed by two bindings", () => {
  const owner = new Map();
  for (const b of BINDINGS)
    for (const code of b.codes || []) {
      assert.equal(
        owner.get(code),
        undefined,
        `${code} is bound to both ${owner.get(code)} and ${b.id}`,
      );
      owner.set(code, b.id);
    }
});

test("movement codes drive the movement axes", () => {
  assert.deepEqual(frameWith({ keys: ["KeyW"] }).move, { x: 0, y: 1 });
  assert.deepEqual(frameWith({ keys: ["KeyS"] }).move, { x: 0, y: -1 });
  assert.deepEqual(frameWith({ keys: ["KeyD"] }).move, { x: 1, y: 0 });
  assert.deepEqual(frameWith({ keys: ["KeyA"] }).move, { x: -1, y: 0 });
  // Opposing keys cancel rather than sticking to whichever was read last.
  assert.deepEqual(frameWith({ keys: ["KeyW", "KeyS"] }).move, { x: 0, y: 0 });
});

test("either shift sprints and either crouch key crouches", () => {
  assert.equal(frameWith({ keys: ["ShiftLeft"] }).sprint, true);
  assert.equal(frameWith({ keys: ["ShiftRight"] }).sprint, true);
  assert.equal(frameWith({ keys: ["KeyC"] }).crouch, true);
  assert.equal(frameWith({ keys: ["ControlLeft"] }).crouch, true);
  assert.equal(frameWith({ pressed: ["KeyC"] }).crouchPressed, true);
});

test("weapon slot codes map to slot indices in order", () => {
  WEAPON_SLOT_CODES.forEach((code, i) => {
    assert.equal(frameWith({ pressed: [code] }).switchTo, i);
  });
  assert.equal(frameWith().switchTo, -1);
});

test("edge-triggered actions only fire on press, not while held", () => {
  assert.equal(frameWith({ pressed: ["KeyR"] }).reload, true);
  assert.equal(frameWith({ keys: ["KeyR"] }).reload, false);
  assert.equal(frameWith({ pressed: ["Space"] }).jump, true);
  assert.equal(frameWith({ keys: ["Space"] }).jump, false);
  assert.equal(frameWith({ pressed: ["KeyQ"] }).swapLast, true);
});

test("the frame shape the sim reads is unchanged", () => {
  assert.deepEqual(Object.keys(frameWith()).sort(), [
    "ads",
    "crouch",
    "crouchPressed",
    "fire",
    "fireHeld",
    "jump",
    "move",
    "reload",
    "sprint",
    "swapLast",
    "switchTo",
    "wheel",
  ]);
});
