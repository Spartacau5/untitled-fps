import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AXIS,
  CURVE,
  DEADZONE,
  Gamepads,
  PAD,
  TRIGGER_POINT,
  applyDeadzone,
  lookCurve,
  padActive,
  readPad,
} from "../games/onslaught/src/core/gamepad.js";

// A gamepad the way the browser hands one over: 16 buttons as objects with
// pressed/value, 4 axes. Everything defaults to resting.
function pad(over = {}) {
  const buttons = Array.from({ length: 16 }, () => ({
    pressed: !1,
    value: 0,
  }));
  const axes = [0, 0, 0, 0];
  for (const [k, v] of Object.entries(over.buttons || {}))
    buttons[k] = typeof v === "number" ? { pressed: v > 0.5, value: v } : v;
  for (const [k, v] of Object.entries(over.axes || {})) axes[k] = v;
  return { connected: !0, mapping: "standard", buttons, axes };
}

test("a resting pad asks for nothing", () => {
  const s = readPad(pad());
  assert.deepEqual(s.move, { x: 0, y: -0 });
  assert.deepEqual(s.look, { x: 0, y: 0 });
  for (const k of ["ads", "fire", "sprint", "crouch", "jump", "reload"])
    assert.equal(s[k], false, `${k} fired at rest`);
  assert.equal(padActive(s), false);
});

test("the deadzone is radial, so a diagonal is not easier than a push", () => {
  // Just inside: nothing, whichever way it points.
  for (const [x, y] of [
    [DEADZONE * 0.9, 0],
    [0, DEADZONE * 0.9],
    [DEADZONE * 0.63, DEADZONE * 0.63],
  ])
    assert.equal(applyDeadzone(x, y).mag, 0, `${x},${y} leaked through`);
  // A square deadzone would pass this and fail the cardinal of the same
  // magnitude; a radial one treats them alike.
  const diag = applyDeadzone(0.2, 0.2).mag,
    card = applyDeadzone(Math.hypot(0.2, 0.2), 0).mag;
  assert.ok(Math.abs(diag - card) < 1e-9, "diagonal and cardinal must match");
});

test("the live range starts at zero rather than jumping to the deadzone", () => {
  const justOver = applyDeadzone(DEADZONE + 1e-4, 0);
  assert.ok(justOver.mag < 0.01, `first live step was ${justOver.mag}`);
  // And full deflection still reaches full.
  assert.ok(Math.abs(applyDeadzone(1, 0).mag - 1) < 1e-9);
});

test("the look curve keeps fine aim usable and full tilt fast", () => {
  // Half deflection has to cost much less than half the turn rate, or the
  // stick has no useful slow range at all.
  const half = lookCurve(0.5, 0);
  assert.ok(
    Math.abs(half.x) < 0.25,
    `half deflection gave ${half.x.toFixed(3)} of the rate`,
  );
  assert.ok(Math.abs(lookCurve(1, 0).x - 1) < 1e-9, "full tilt is full rate");
  // The curve shapes magnitude only: a 45 degree push stays at 45 degrees.
  const d = lookCurve(0.6, 0.6);
  assert.ok(Math.abs(d.x - d.y) < 1e-9, "the curve bent the direction");
  assert.equal(CURVE > 1, true);
});

test("sticks map to move and look, with forward the way the game means it", () => {
  // Pushing the left stick up reports -1 on a pad and has to mean forward.
  const up = readPad(pad({ axes: { [AXIS.LY]: -1 } }));
  assert.ok(up.move.y > 0.9, `pushing up gave move.y ${up.move.y}`);
  const right = readPad(pad({ axes: { [AXIS.LX]: 1 } }));
  assert.ok(right.move.x > 0.9);
  const look = readPad(pad({ axes: { [AXIS.RX]: 1, [AXIS.RY]: -1 } }));
  assert.ok(look.look.x > 0 && look.look.y < 0, "right stick drives look");
});

test("the triggers are analog, with a bite point short of the slack", () => {
  assert.equal(readPad(pad({ buttons: { [PAD.R2]: 0.2 } })).fire, false);
  assert.equal(readPad(pad({ buttons: { [PAD.R2]: 0.9 } })).fire, true);
  assert.equal(readPad(pad({ buttons: { [PAD.L2]: 0.9 } })).ads, true);
  // The raw pull is kept, for anything later that wants the analog value.
  assert.equal(readPad(pad({ buttons: { [PAD.R2]: 0.62 } })).r2, 0.62);
  assert.ok(TRIGGER_POINT > 0.1 && TRIGGER_POINT < 0.6);
});

test("the requested layout is the layout", () => {
  const bound = (index, field) =>
    assert.equal(
      readPad(pad({ buttons: { [index]: 1 } }))[field],
      true,
      `button ${index} should be ${field}`,
    );
  // Sprint on L3 and crouch on R3, held rather than toggled.
  (bound(PAD.L3, "sprint"), bound(PAD.R3, "crouch"));
  // Jump on the bottom face button, which is A on Xbox and Cross on
  // PlayStation - the same index on both, so this is one binding.
  bound(PAD.CROSS, "jump");
  (bound(PAD.SQUARE, "reload"), bound(PAD.CIRCLE, "swapLast"));
  (bound(PAD.L1, "prevGun"), bound(PAD.R1, "nextGun"));
});

test("anything at all counts as the pad being in someone's hands", () => {
  assert.equal(padActive(readPad(pad())), false);
  // Below the deadzone is still nobody holding it.
  assert.equal(
    padActive(readPad(pad({ axes: { [AXIS.LX]: DEADZONE * 0.5 } }))),
    false,
  );
  assert.equal(padActive(readPad(pad({ axes: { [AXIS.LX]: 0.8 } }))), true);
  assert.equal(padActive(readPad(pad({ buttons: { [PAD.CROSS]: 1 } }))), true);
});

test("buttons arrive as levels and come out as edges", () => {
  let held = !1;
  const pads = new Gamepads({
    getGamepads: () => [pad({ buttons: { [PAD.CROSS]: held ? 1 : 0 } })],
  });
  pads.poll();
  assert.equal(pads.edge("jump"), false);
  held = !0;
  pads.poll();
  assert.equal(pads.edge("jump"), true, "the press has to be an edge");
  pads.poll();
  assert.equal(pads.edge("jump"), false, "holding must not re-fire");
  held = !1;
  pads.poll();
  pads.poll();
  held = !0;
  pads.poll();
  assert.equal(pads.edge("jump"), true, "a second press fires again");
});

test("the pad in someone's hands wins over one sitting on a desk", () => {
  const idle = pad();
  const live = pad({ axes: { [AXIS.LX]: 0.9 } });
  const pads = new Gamepads({ getGamepads: () => [idle, live] });
  pads.poll();
  assert.equal(pads.index, 1, "it should latch onto the one being used");
  assert.ok(pads.state.move.x > 0.8);
  // And it stays there rather than flipping back the moment they let go.
  live.axes[AXIS.LX] = 0;
  pads.poll();
  assert.equal(pads.index, 1);
});

test("no pad, no browser, no crash", () => {
  for (const nav of [
    null,
    {},
    { getGamepads: () => null },
    {
      getGamepads: () => {
        throw new Error("not focused");
      },
    },
    { getGamepads: () => [null, undefined] },
  ]) {
    const pads = new Gamepads(nav);
    const s = pads.poll();
    (assert.equal(pads.connected, false), assert.equal(padActive(s), false));
  }
});

test("a connected but untouched pad still reports as connected", () => {
  // So the UI can say a controller is plugged in before anyone moves it.
  const pads = new Gamepads({ getGamepads: () => [pad()] });
  pads.poll();
  (assert.equal(pads.connected, true), assert.equal(pads.active, false));
});

test("the d-pad picks a weapon slot, once per press", () => {
  let down = !1;
  const pads = new Gamepads({
    getGamepads: () => [pad({ buttons: { [PAD.DPAD_UP]: down ? 1 : 0 } })],
  });
  pads.poll();
  assert.equal(pads.slotEdge(), -1);
  down = !0;
  pads.poll();
  assert.equal(pads.slotEdge(), 1, "up is the middle slot");
  pads.poll();
  assert.equal(pads.slotEdge(), -1, "holding must not keep switching");
});
