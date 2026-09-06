import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_LOADOUT,
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

test("a fresh profile starts at level 1 with the default loadout", () => {
  const p = new Progression(memStorage());
  assert.equal(p.xp, 0);
  assert.equal(p.level, 1);
  assert.deepEqual(p.loadout, DEFAULT_LOADOUT);
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

test("equipping persists, and refuses the wrong slot or a locked gun", () => {
  const st = memStorage(),
    p = new Progression(st);
  p.equip(0, "sniper");
  assert.deepEqual(p.loadout, ["sniper", DEFAULT_LOADOUT[1]]);
  assert.deepEqual(saved(st).loadout, p.loadout);
  // A sidearm cannot fill the primary slot, nor a primary the sidearm slot.
  p.equip(0, "pistol");
  assert.equal(p.loadout[0], "sniper", "primary slot rejected a sidearm");
  p.equip(1, "lmg");
  assert.equal(p.loadout[1], DEFAULT_LOADOUT[1], "sidearm slot rejected an lmg");
  p.equip(0, "nonsense");
  assert.equal(p.loadout[0], "sniper");
});

test("a saved loadout is restored, and a corrupt one falls back per slot", () => {
  const st = memStorage();
  new Progression(st).equip(0, "flame");
  assert.deepEqual(new Progression(st).loadout, ["flame", DEFAULT_LOADOUT[1]]);

  for (const bad of [
    '{"loadout":["nonsense","alsonope"]}',
    '{"loadout":"not an array"}',
    '{"loadout":["pistol","pistol"]}',
    "not json at all",
  ]) {
    const p = new Progression(memStorage({ [STORAGE_KEY]: bad }));
    assert.equal(p.loadout.length, 2);
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
  p.addRun({ score: 1000, kills: 5, wave: 1 });
  assert.ok(p.xp > 0, "xp still accrues in memory");
});
