import assert from "node:assert/strict";
import { test } from "node:test";
import { Progression } from "../games/onslaught/src/core/progression.js";
import { LOADOUT_SIZE, WEAPONS } from "../games/onslaught/src/data/weapons.js";
import { mountArmory } from "../games/onslaught/src/ui/armory.js";

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
  while (progression.level < 3) progression.addRun({ kills: 90, wave: 6 });
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

test("tapping a gun you already carry selects its key rather than swapping", () => {
  const { armory, progression, body, click } = mount();
  armory.render();
  const carried = progression.loadout[2];
  click({ act: "equip", key: carried });
  assert.deepEqual(progression.loadout[2], carried, "nothing moved");
  assert.ok(body.innerHTML.includes("KEY 3 IS SELECTED"));
});

test("the spawn button walks the three keys and never leaves the loadout", () => {
  const { armory, progression, click } = mount();
  armory.render();
  const seen = new Set();
  for (let i = 0; i < LOADOUT_SIZE + 1; i++) {
    click({ act: "start-cycle" });
    assert.ok(
      progression.loadout.includes(progression.start),
      "you must deploy holding something you carry",
    );
    seen.add(progression.start);
  }
  assert.equal(seen.size, LOADOUT_SIZE, "it visits every key");
});

test("guns the last run opened are flagged until the next deploy", () => {
  const { armory, progression, body } = mount();
  while (progression.level < 2) progression.addRun({ kills: 60, wave: 4 });
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
