import assert from "node:assert/strict";
import { test } from "node:test";
import { Input } from "../games/onslaught/src/core/input.js";
import { PAD, SPRINT_DROP } from "../games/onslaught/src/core/gamepad.js";

// Input attaches DOM listeners, so it needs a canvas-shaped stub and a global
// document/window to construct. Nothing here touches rendering.
function makeInput() {
  const noop = () => {};
  const el = { addEventListener: noop, requestPointerLock: noop };
  globalThis.document ||= { addEventListener: noop, pointerLockElement: null };
  globalThis.window ||= { addEventListener: noop };
  const input = new Input(el);
  const gp = {
    connected: !0,
    mapping: "standard",
    buttons: Array.from({ length: 16 }, () => ({ pressed: !1, value: 0 })),
    axes: [0, 0, 0, 0],
  };
  input.pad.nav = { getGamepads: () => [gp] };
  const set = (spec = {}) => {
    gp.buttons = gp.buttons.map(() => ({ pressed: !1, value: 0 }));
    gp.axes = [0, 0, 0, 0];
    for (const [i, v] of Object.entries(spec.buttons || {}))
      gp.buttons[i] = { pressed: v > 0.5, value: v };
    for (const [i, v] of Object.entries(spec.axes || {})) gp.axes[i] = v;
  };
  // One render frame plus the tick that consumes its edges.
  const frame = (spec, dt = 1 / 60) => {
    set(spec);
    input.pollPad(dt);
    const f = input.frame();
    (input.endTick(), input.endFrame());
    return f;
  };
  return { input, frame, set };
}

const FWD = { axes: { 1: -1 } }; // left stick pushed forward
const L3 = (over = {}) => ({
  axes: { ...FWD.axes, ...(over.axes || {}) },
  buttons: { [PAD.L3]: 1, ...(over.buttons || {}) },
});

test("L3 toggles sprint on, and it stays on while you hold forward", () => {
  const { frame } = makeInput();
  assert.equal(frame(FWD).sprint, false, "not sprinting to begin with");
  assert.equal(frame(L3()).sprint, true, "L3 turns it on");
  // Released the button, still sprinting - that is what a toggle means.
  for (let i = 0; i < 30; i++)
    assert.equal(frame(FWD).sprint, true, `dropped on frame ${i}`);
});

test("a second press turns it off", () => {
  const { frame } = makeInput();
  frame(L3());
  assert.equal(frame(FWD).sprint, true);
  // The button has to come up before it can go down again.
  assert.equal(frame(L3()).sprint, false, "second press turns it off");
  assert.equal(frame(FWD).sprint, false);
});

test("sprint survives jump and crouch, because that is the slide chain", () => {
  const { frame } = makeInput();
  frame(L3());
  assert.equal(
    frame({ ...FWD, buttons: { [PAD.CROSS]: 1 } }).sprint,
    true,
    "jumping must not cancel the toggle",
  );
  assert.equal(
    frame({ ...FWD, buttons: { [PAD.R3]: 1 } }).sprint,
    true,
    "crouching must not cancel it either - it starts the slide",
  );
  assert.equal(frame(FWD).sprint, true, "and it is still on afterwards");
});

test("sprint drops on the things that mean you have stopped sprinting", () => {
  for (const [name, spec] of [
    ["firing", { ...FWD, buttons: { [PAD.R2]: 0.9 } }],
    ["aiming", { ...FWD, buttons: { [PAD.L2]: 0.9 } }],
    ["letting go of the stick", {}],
    ["backing up", { axes: { 1: 1 } }],
    ["strafing only", { axes: { 0: 1 } }],
  ]) {
    const { frame } = makeInput();
    frame(L3());
    assert.equal(frame(FWD).sprint, true, `${name}: setup failed`);
    assert.equal(frame(spec).sprint, false, `${name} should drop sprint`);
    // And it stays off until asked for again.
    assert.equal(frame(FWD).sprint, false, `${name}: came back on its own`);
  }
});

test("easing off slightly does not cancel the toggle", () => {
  const { frame } = makeInput();
  frame(L3());
  // Still clearly asking to go forward, just not at full tilt.
  assert.equal(frame({ axes: { 1: -(SPRINT_DROP + 0.35) } }).sprint, true);
});

test("aim sensitivity blends in as the sight comes up", () => {
  const { input, frame } = makeInput();
  ((input.padSensitivity = 2), (input.padAdsSensitivity = 0.5));
  // dx is cleared by endFrame, so read it before that: run the poll directly
  // rather than through a whole frame.
  const measure = (ads) => {
    input.adsAmount = ads;
    input.dx = 0;
    input.pollPad(1 / 60);
    const v = Math.abs(input.dx);
    input.endFrame();
    return v;
  };
  input.pad.nav.getGamepads()[0].axes[2] = 1;
  const hip = measure(0),
    aimed = measure(1),
    half = measure(0.5);
  assert.ok(hip > aimed, "aimed look must be slower than hipfire here");
  assert.ok(
    half < hip && half > aimed,
    "and the change is blended, not a step",
  );
  // The two are genuinely independent numbers.
  input.padAdsSensitivity = 2;
  assert.ok(
    Math.abs(measure(1) - hip) < hip * 0.01,
    "matching the settings should match the speed",
  );
});

test("Options raises a pause the game can consume, once", () => {
  const { input, frame } = makeInput();
  assert.equal(input.padPause, false);
  frame({ buttons: { [PAD.OPTIONS]: 1 } });
  assert.equal(input.padPause, true, "the press has to be seen");
  // The Game clears it; holding must not raise it again.
  input.padPause = !1;
  frame({ buttons: { [PAD.OPTIONS]: 1 } });
  assert.equal(input.padPause, false, "holding re-triggered the pause");
  frame({});
  frame({ buttons: { [PAD.OPTIONS]: 1 } });
  assert.equal(input.padPause, true, "a fresh press works again");
});

test("unplugging the pad drops the sprint toggle with it", () => {
  const { input, frame } = makeInput();
  frame(L3());
  assert.equal(frame(FWD).sprint, true);
  input.pad.nav = { getGamepads: () => [] };
  const f = frame(FWD);
  (assert.equal(f.sprint, false), assert.equal(input.padSprint, false));
});
