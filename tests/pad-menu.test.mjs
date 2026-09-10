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

// --- A fake DOM, because the rest of this is geometry -------------------
//
// Spatial navigation is a decision about rectangles, so the tests lay out
// real ones. These coordinates are measured off the live deploy screen at
// 1890x925 with a level-7 profile - the exact layout in the bug report - so
// what is asserted here is what a player actually has under the stick.
const DEPLOY_SCREEN = [
  ["player-name", 276, 277, 268, 37],
  ["lo-1", 276, 355, 85, 55],
  ["lo-2", 367, 355, 85, 55],
  ["lo-3", 459, 355, 85, 55],
  ["lo-4", 276, 416, 85, 55],
  ["lo-5", 367, 416, 85, 55],
  ["lo-6", 459, 416, 85, 55],
  ["lo-7", 276, 477, 85, 55],
  ["lo-8", 367, 477, 85, 55],
  ["lo-9", 459, 477, 85, 55],
  ["lo-10", 276, 538, 85, 55],
  ["btn-armory", 276, 671, 268, 32],
  ["btn-start", 804, 451, 242, 61],
  ["btn-controls", 750, 534, 125, 32],
  ["btn-settings", 885, 534, 101, 32],
  ["btn-feedback", 996, 534, 104, 32],
  ["tab-daily", 1306, 260, 151, 28],
  ["tab-winners", 1463, 260, 151, 28],
];

function screen(rows = DEPLOY_SCREEN) {
  const doc = { activeElement: null, byId: new Map() };
  const els = rows.map(([id, x, y, w, h]) => {
    const classes = new Set();
    const el = {
      id,
      tagName: id === "player-name" ? "INPUT" : "BUTTON",
      type: id === "player-name" ? "text" : "",
      clicks: 0,
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c),
      },
      getBoundingClientRect: () => ({
        x,
        y,
        left: x,
        top: y,
        width: w,
        height: h,
        right: x + w,
        bottom: y + h,
      }),
      focus() {
        doc.activeElement = el;
      },
      blur() {
        doc.activeElement = null;
      },
      click() {
        el.clicks++;
      },
    };
    doc.byId.set(id, el);
    return el;
  });
  doc.getElementById = (id) => doc.byId.get(id) || null;
  const m = new PadMenu(doc);
  m.targets = () => els;
  // A press, resolved and released, so the next one is a fresh edge rather
  // than a repeat.
  const press = (dx, dy, edges = {}) => {
    m.update({ move: { x: 0, y: 0 }, navX: dx, navY: dy }, 1 / 60, edges);
    m.update({ move: { x: 0, y: 0 }, navX: 0, navY: 0 }, 1 / 60, {});
    return doc.activeElement && doc.activeElement.id;
  };
  const at = (id) => {
    doc.activeElement = doc.byId.get(id);
    return doc.activeElement;
  };
  return { m, doc, els, press, at, lit: () => m.lit && m.lit.id };
}

test("the first press lands on the primary action, not the name field", () => {
  // player-name is first in the document and cannot be typed into with a
  // pad, so starting there made the opening press look like it did nothing.
  const { press } = screen();
  assert.equal(press(0, 1), "btn-start");
});

test("down inside the loadout grid goes down a row, not along the document", () => {
  // The bug: the grid is three wide but walked as a flat list, so "down"
  // from the first cell went to the cell on its right.
  const { press, at } = screen();
  at("lo-1");
  assert.equal(press(0, 1), "lo-4", "down must stay in the same column");
  assert.equal(press(0, 1), "lo-7");
  at("lo-2");
  assert.equal(press(0, 1), "lo-5");
  at("lo-3");
  assert.equal(press(0, 1), "lo-6");
});

test("across the loadout grid moves one cell, and stops at the edge", () => {
  const { press, at } = screen();
  at("lo-1");
  assert.equal(press(1, 0), "lo-2");
  assert.equal(press(1, 0), "lo-3");
  at("lo-1");
  // Nothing to the left of the first column: focus holds rather than
  // wrapping round to the far side of the screen.
  assert.equal(press(-1, 0), "lo-1");
});

test("the three panels are reachable sideways, the way they look", () => {
  const { press, at } = screen();
  // Right out of the loadout column reaches the centre panel...
  at("lo-9");
  assert.equal(press(1, 0), "btn-start");
  // ...and right again reaches the contest panel on the far side.
  assert.equal(press(1, 0), "tab-daily");
  assert.equal(press(1, 0), "tab-winners");
  // Left comes back the same way.
  at("btn-start");
  assert.ok(
    press(-1, 0).startsWith("lo-"),
    "left out of the centre has to reach a gun",
  );
});

test("DEPLOY is one press from its own row of buttons", () => {
  // It used to be eleven presses back up through the loadout grid to reach a
  // gun, and the row under DEPLOY was only reachable in document order.
  const { press, at } = screen();
  at("btn-start");
  const down = press(0, 1);
  assert.ok(
    ["btn-controls", "btn-settings", "btn-feedback"].includes(down),
    `down from DEPLOY went to ${down}`,
  );
  assert.equal(press(1, 0), "btn-feedback");
  assert.equal(press(-1, 0), "btn-settings");
  assert.equal(press(-1, 0), "btn-controls");
});

test("up and down are not the same thing as left and right", () => {
  // The two axes used to call the identical list walk, which is most of why
  // it felt wrong under the hand.
  const { m, at, doc } = screen();
  at("lo-5");
  const list = m.targets();
  const go = (dx, dy) => {
    doc.activeElement = doc.byId.get("lo-5");
    m._move(list, dx, dy);
    return doc.activeElement.id;
  };
  const seen = new Set([go(0, -1), go(0, 1), go(-1, 0), go(1, 0)]);
  assert.equal(seen.size, 4, `four directions gave ${seen.size} results`);
  assert.deepEqual([...seen].sort(), ["lo-2", "lo-4", "lo-6", "lo-8"]);
});

test("the highlight is a class, and only ever on one thing", () => {
  // The whole visible half of the bug: focus moved but nothing lit up,
  // because :focus-visible does not fire for a gamepad and most of these
  // controls had no focus rule at all. The pad stamps its own class now.
  const { press, doc, els, lit } = screen();
  press(0, 1);
  assert.equal(lit(), "btn-start");
  assert.ok(
    doc.byId.get("btn-start").classList.contains("pad-focus"),
    "the focused control is not marked",
  );
  press(0, 1);
  assert.equal(
    els.filter((e) => e.classList.contains("pad-focus")).length,
    1,
    "the highlight has to move, not accumulate",
  );
});

test("leaving the menu puts the highlight out", () => {
  const { m, press, els } = screen();
  press(0, 1);
  m.blur();
  assert.equal(
    els.filter((e) => e.classList.contains("pad-focus")).length,
    0,
    "a lit button was left behind",
  );
  assert.equal(m.lit, null);
});

test("a panel closing under the highlight does not leave it stranded", () => {
  const { m, doc, els } = screen();
  m.update({ move: { x: 0, y: 0 }, navX: 0, navY: 1 }, 1 / 60, {});
  const gone = m.lit;
  // What an overlay opening looks like from here: a different target list.
  m.targets = () => els.slice(0, 3);
  doc.activeElement = null;
  m.update({ move: { x: 0, y: 0 }, navX: 0, navY: 0 }, 1 / 60, {});
  assert.equal(
    gone.classList.contains("pad-focus"),
    false,
    "the old highlight is still lit on a control that is gone",
  );
});

test("confirm presses the thing that is highlighted", () => {
  const { m, doc, press } = screen();
  press(0, 1);
  const on = doc.activeElement;
  m.update({ move: { x: 0, y: 0 }, navX: 0, navY: 0 }, 1 / 60, { confirm: !0 });
  assert.equal(on.clicks, 1, "confirm did not click the focused control");
});

test("the repeat is slow enough to stop on the row you wanted", () => {
  // Nine steps a second walks past anything in a list of eleven. This pins
  // the rate somewhere a person can actually stop on a target.
  const { m } = screen();
  let steps = 0;
  const realMove = m._move.bind(m);
  m._move = (l, dx, dy) => (steps++, realMove(l, dx, dy));
  for (let i = 0; i < 60; i++)
    m.update({ move: { x: 0, y: -1 }, navX: 0, navY: 0 }, 1 / 60, {});
  assert.ok(steps >= 3, `only ${steps} steps in a second - too sluggish`);
  assert.ok(steps <= 7, `${steps} steps in a second - still too twitchy`);
});
