import assert from "node:assert/strict";
import { test } from "node:test";
import {
  Progression,
  xpForWaveClear,
} from "../games/onslaught/src/core/progression.js";
import { LOADOUT_SIZE, WEAPONS } from "../games/onslaught/src/data/weapons.js";
import { mountArmory } from "../games/onslaught/src/ui/armory.js";

// Levelling, the way the game does it: award as you go.
const levelTo = (p, level) => {
  for (let w = 1; p.level < level && w < 400; w++) p.award(xpForWaveClear(w));
};

const memStorage = (init = {}) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
};

// Enough of an element to render into and to hand a click back through. The
// panel's job is a string and a click handler, so that is what is stubbed:
// anything more would be testing a DOM implementation rather than the armory.
function el(classes = []) {
  const set = new Set(classes);
  return {
    innerHTML: "",
    classList: {
      add: (c) => set.add(c),
      remove: (c) => set.delete(c),
      contains: (c) => set.has(c),
      toggle: (c, on) => (on ? set.add(c) : set.delete(c)),
    },
    _handlers: {},
    addEventListener(type, fn) {
      (this._handlers[type] || (this._handlers[type] = [])).push(fn);
    },
    fire(type, e) {
      for (const fn of this._handlers[type] || []) fn(e);
    },
  };
}

function mount() {
  const progression = new Progression(memStorage());
  const body = el(),
    panel = el(["hidden"]),
    menuMain = el(),
    btnOpen = el(),
    btnBack = el();
  const changes = [];
  const armory = mountArmory(
    progression,
    { body, panel, menuMain, btnOpen, btnBack },
    (loadout, start) => changes.push([loadout, start]),
  );
  // A click on a control, addressed by its data attributes rather than by
  // hit-testing a layout that does not exist here.
  const click = (dataset) =>
    body.fire("click", {
      target: { closest: () => ({ dataset, disabled: false }) },
    });
  return { progression, body, panel, menuMain, armory, changes, click };
}

test("the armory renders a rail of exactly three keys plus the whole roster", () => {
  const { armory, body, progression } = mount();
  armory.render();
  const slots = body.innerHTML.match(/data-act="slot"/g) || [];
  assert.equal(slots.length, LOADOUT_SIZE, "one rail button per key");
  const picks = body.innerHTML.match(/data-act="equip"/g) || [];
  assert.equal(picks.length, WEAPONS.length, "every gun has a card");
  // The three you carry are named on the rail, and the locked ones are marked.
  for (const key of progression.loadout) {
    const w = WEAPONS.find((x) => x.key === key);
    assert.ok(body.innerHTML.includes(w.name), `${key} missing from the panel`);
  }
  assert.ok(body.innerHTML.includes("LOCKED · LEVEL 5"), "the sniper is gated");
  // No unrendered template holes.
  assert.equal(body.innerHTML.includes("undefined"), false);
  assert.equal(body.innerHTML.includes("[object Object]"), false);
});

test("picking a key then a gun swaps that key, and only that key", () => {
  const { armory, progression, click, changes } = mount();
  armory.render();
  // Level up far enough to have something to swap in.
  levelTo(progression, 3);
  const before = progression.loadout.slice();
  (click({ act: "slot", slot: "1" }), click({ act: "equip", key: "smg" }));
  assert.deepEqual(progression.loadout, [before[0], "smg", before[2]]);
  assert.equal(progression.loadout.length, LOADOUT_SIZE);
  assert.ok(changes.length > 0, "the game is told what changed");
  assert.deepEqual(changes.at(-1)[0], progression.loadout);
});

test("a locked gun cannot be equipped from the panel", () => {
  const { armory, progression, click } = mount();
  armory.render();
  const before = progression.loadout.slice();
  click({ act: "equip", key: "sniper" });
  assert.deepEqual(progression.loadout, before);
});

test("a carried gun moves to the key you have selected", () => {
  const { armory, progression, click } = mount();
  armory.render();
  const before = progression.loadout.slice();
  // Select key 1, then tap the gun sitting on key 3: they trade places. This
  // is the only way to choose what you deploy holding, so it has to work.
  (click({ act: "slot", slot: "0" }), click({ act: "equip", key: before[2] }));
  assert.equal(progression.loadout[0], before[2]);
  assert.equal(progression.loadout[2], before[0]);
  assert.equal(new Set(progression.loadout).size, 3, "never a duplicate");
});

test("tapping a gun already on the selected key changes nothing", () => {
  const { armory, progression, click } = mount();
  armory.render();
  const before = progression.loadout.slice();
  (click({ act: "slot", slot: "1" }), click({ act: "equip", key: before[1] }));
  assert.deepEqual(progression.loadout, before);
});

test("the rail shows key 1 as the gun you deploy holding", () => {
  const { armory, progression, body, click } = mount();
  armory.render();
  assert.ok(body.innerHTML.includes("SPAWN"), "key 1 has to say so");
  assert.ok(
    body.innerHTML.includes("KEY 1 IS WHAT YOU DEPLOY HOLDING"),
    "and the panel has to explain why",
  );
  // There is no separate spawn control any more: the key order is the choice,
  // so moving a gun to key 1 is how you pick what you start with.
  assert.equal(body.innerHTML.includes("DEPLOY WITH THIS"), false);
  assert.equal(body.innerHTML.includes("DEPLOYS WITH"), false);
  const wasThird = progression.loadout[2];
  (click({ act: "slot", slot: "0" }), click({ act: "equip", key: wasThird }));
  assert.equal(progression.loadout[0], wasThird);
  assert.equal(progression.start, wasThird);
});

test("guns the last run opened are flagged until the next deploy", () => {
  const { armory, progression, body } = mount();
  levelTo(progression, 2);
  armory.setFresh(["smg"]);
  armory.render();
  assert.ok(body.innerHTML.includes("NEW · UNLOCKED"));
  // Equipping it clears the flag: it is no longer something to go and find.
  armory.setFresh([]);
  armory.render();
  assert.equal(body.innerHTML.includes("NEW · UNLOCKED"), false);
});

test("opening and closing the panel swaps it with the menu", () => {
  const { armory, panel, menuMain } = mount();
  assert.equal(armory.isOpen(), false);
  armory.open();
  assert.equal(armory.isOpen(), true);
  assert.equal(menuMain.classList.contains("hidden"), true);
  armory.close();
  assert.equal(armory.isOpen(), false);
  assert.equal(menuMain.classList.contains("hidden"), false);
  assert.equal(panel.classList.contains("hidden"), true);
});
