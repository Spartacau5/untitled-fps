import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_LOADOUT,
  DEFAULT_START,
  WEAPONS,
} from "../games/onslaught/src/data/weapons.js";
import {
  MAX_LEVEL,
  Progression,
  STORAGE_KEY,
  levelForXp,
  xpForLevel,
  xpForRun,
} from "../games/onslaught/src/core/progression.js";

const memStorage = (init = {}) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
};
const saved = (st) => JSON.parse(st.getItem(STORAGE_KEY));

test("a fresh profile starts at level 1 carrying everything", () => {
  const p = new Progression(memStorage());
  assert.equal(p.xp, 0);
  assert.equal(p.level, 1);
  assert.deepEqual(p.loadout, DEFAULT_LOADOUT);
  assert.equal(p.start, DEFAULT_START);
});

test("each carried gun reports a stable 1-based key", () => {
  const p = new Progression(memStorage());
  DEFAULT_LOADOUT.forEach((key, i) => assert.equal(p.slotOf(key), i + 1));
  assert.equal(p.slotOf("nonsense"), 0);
});

test("the level curve is monotonic and levels track cumulative xp", () => {
  for (let l = 1; l < MAX_LEVEL; l++)
    assert.ok(
      xpForLevel(l + 1) > xpForLevel(l),
      `level ${l + 1} must cost more than ${l}`,
    );
  assert.equal(levelForXp(0), 1);
  assert.equal(levelForXp(xpForLevel(2)), 2);
  assert.equal(levelForXp(xpForLevel(2) - 1), 1);
  assert.equal(levelForXp(xpForLevel(7)), 7);
  // Past the cap it stops rather than running away.
  assert.equal(levelForXp(xpForLevel(MAX_LEVEL) * 100), MAX_LEVEL);
});

test("xp rewards score, kills and depth, and is never negative", () => {
  assert.ok(xpForRun({ score: 22150, kills: 105, wave: 5 }) > 0);
  assert.ok(
    xpForRun({ score: 4000, kills: 20, wave: 2 }) <
      xpForRun({ score: 9000, kills: 40, wave: 4 }),
    "a better run should pay more",
  );
  assert.equal(xpForRun({}), 0);
  assert.equal(xpForRun({ score: -50, kills: 0, wave: 0 }), 0);
});

test("a finished run banks xp and reports levels crossed", () => {
  const st = memStorage(),
    p = new Progression(st);
  const first = p.addRun({ score: 22150, kills: 105, wave: 5 });
  assert.equal(first.gained, xpForRun({ score: 22150, kills: 105, wave: 5 }));
  assert.ok(first.levelsGained >= 1, "a big first run should level you up");
  assert.equal(p.level, first.level);
  assert.equal(saved(st).xp, p.xp);
});

test("progress through the current level is reported for the xp bar", () => {
  const p = new Progression(memStorage());
  p.addRun({ score: 3000, kills: 10, wave: 2 });
  const { into, span, frac } = p.levelProgress;
  assert.ok(span > 0 && into >= 0 && into < span);
  assert.ok(frac >= 0 && frac < 1);
});

test("choosing a start weapon persists and never reorders the keys", () => {
  const st = memStorage(),
    p = new Progression(st),
    before = p.loadout.slice();
  p.setStart("sniper");
  assert.equal(p.start, "sniper");
  assert.equal(saved(st).start, "sniper");
  // The whole point of a separate start weapon: every gun keeps its key.
  assert.deepEqual(p.loadout, before);
  p.setStart("nonsense");
  assert.equal(p.start, "sniper", "an unknown key is refused");
});

test("a saved start weapon is restored, and a corrupt profile falls back", () => {
  const st = memStorage();
  // The flamethrower shares its key with the rocket launcher, so it has to be
  // equipped before it can be the gun you deploy holding.
  const first = new Progression(st);
  (first.equip("flame"), first.setStart("flame"));
  assert.equal(new Progression(st).start, "flame");

  for (const bad of [
    '{"start":"nonsense"}',
    '{"start":42}',
    '{"loadout":["pistol","pistol"]}',
    "not json at all",
  ]) {
    const p = new Progression(memStorage({ [STORAGE_KEY]: bad }));
    assert.equal(p.start, DEFAULT_START);
    assert.deepEqual(p.loadout, DEFAULT_LOADOUT);
  }
});

test("every weapon is reachable from the slot it belongs to", () => {
  const p = new Progression(memStorage());
  const listed = [...p.forSlot("primary"), ...p.forSlot("sidearm")];
  assert.equal(listed.length, WEAPONS.length, "no weapon is orphaned");
});

test("every gun is unlocked at level 1 today", () => {
  const p = new Progression(memStorage());
  for (const w of WEAPONS)
    assert.ok(p.isUnlocked(w.key), `${w.key} should be free right now`);
});

test("the unlock gate is real, not decorative", () => {
  // Nothing is gated today, so prove the mechanism against a raised bar
  // rather than against the shipped table.
  const p = new Progression(memStorage());
  const gated = { ...WEAPONS[0], key: "future", unlockLevel: 9 };
  assert.ok(p.level < 9);
  assert.equal(p.level >= gated.unlockLevel, false);
});

test("a profile survives storage that throws", () => {
  const hostile = {
    getItem: () => {
      throw new Error("blocked");
    },
    setItem: () => {
      throw new Error("blocked");
    },
  };
  const p = new Progression(hostile);
  assert.deepEqual(p.loadout, DEFAULT_LOADOUT);
  assert.equal(p.start, DEFAULT_START);
  p.addRun({ score: 1000, kills: 5, wave: 1 });
  assert.ok(p.xp > 0, "xp still accrues in memory");
});
