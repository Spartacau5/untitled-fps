import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BANDS,
  DEFAULT_START,
  WEAPONS,
} from "../games/onslaught/src/data/weapons.js";

const STARTERS = ["pistol", "ar", "dmr"];
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

test("a fresh profile carries three guns, not the whole roster", () => {
  const p = new Progression(memStorage());
  assert.equal(p.xp, 0);
  assert.equal(p.level, 1);
  assert.deepEqual(p.loadout, STARTERS);
  assert.equal(p.start, DEFAULT_START);
});

test("each carried gun reports a stable 1-based key", () => {
  const p = new Progression(memStorage());
  p.loadout.forEach((key, i) => assert.equal(p.slotOf(key), i + 1));
  assert.equal(p.slotOf("nonsense"), 0);
  // A gun you have not unlocked is not on any key.
  assert.equal(p.slotOf("sniper"), 0);
});

test("unlocking a band appends a key without moving the ones you had", () => {
  const p = new Progression(memStorage());
  const before = p.loadout.slice();
  while (p.level < 2) p.addRun({ kills: 60, wave: 4 });
  assert.deepEqual(p.loadout.slice(0, 3), before, "keys 1-3 never move");
  assert.equal(p.loadout.length, 4);
  assert.equal(p.loadout[3], "smg");
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

test("xp comes from kills and depth, and ignores score entirely", () => {
  assert.ok(xpForRun({ kills: 105, wave: 5 }) > 0);
  assert.ok(
    xpForRun({ kills: 20, wave: 2 }) < xpForRun({ kills: 40, wave: 4 }),
    "a better run should pay more",
  );
  // Score is what the daily board competes on; it must not also buy unlocks.
  assert.equal(
    xpForRun({ kills: 40, wave: 4, score: 0 }),
    xpForRun({ kills: 40, wave: 4, score: 999999 }),
  );
  // Deeper waves pay progressively more, not a flat rate.
  const w2 = xpForRun({ kills: 0, wave: 2 });
  const w4 = xpForRun({ kills: 0, wave: 4 });
  assert.ok(w4 > 2 * w2, "wave bonus should escalate with depth");
  assert.equal(xpForRun({}), 0);
  assert.equal(xpForRun({ kills: -5, wave: -3 }), 0);
});

test("a finished run banks xp and reports levels crossed", () => {
  const st = memStorage(),
    p = new Progression(st);
  const first = p.addRun({ kills: 105, wave: 5 });
  assert.equal(first.gained, xpForRun({ kills: 105, wave: 5 }));
  assert.ok(first.levelsGained >= 1, "a big first run should level you up");
  assert.equal(p.level, first.level);
  assert.equal(saved(st).xp, p.xp);
});

test("progress through the current level is reported for the xp bar", () => {
  const p = new Progression(memStorage());
  p.addRun({ kills: 10, wave: 2 });
  const { into, span, frac } = p.levelProgress;
  assert.ok(span > 0 && into >= 0 && into < span);
  assert.ok(frac >= 0 && frac < 1);
});

test("choosing a start weapon persists and never reorders the keys", () => {
  const st = memStorage(),
    p = new Progression(st),
    before = p.loadout.slice();
  p.setStart("dmr");
  assert.equal(p.start, "dmr");
  assert.equal(saved(st).start, "dmr");
  // The whole point of a separate start weapon: every gun keeps its key.
  assert.deepEqual(p.loadout, before);
  p.setStart("nonsense");
  assert.equal(p.start, "dmr", "an unknown key is refused");
  p.setStart("sniper");
  assert.equal(p.start, "dmr", "a gun you have not unlocked is refused");
});

test("a saved start weapon is restored, and a corrupt profile falls back", () => {
  const st = memStorage();
  const first = new Progression(st);
  first.setStart("pistol");
  assert.equal(new Progression(st).start, "pistol");

  for (const bad of [
    '{"start":"nonsense"}',
    '{"start":42}',
    '{"loadout":["pistol","pistol"]}',
    "not json at all",
  ]) {
    const p = new Progression(memStorage({ [STORAGE_KEY]: bad }));
    assert.equal(p.start, DEFAULT_START);
    assert.deepEqual(p.loadout, STARTERS);
  }
});

test("every weapon is reachable from the slot it belongs to", () => {
  const p = new Progression(memStorage());
  const listed = [...p.forSlot("primary"), ...p.forSlot("sidearm")];
  assert.equal(listed.length, WEAPONS.length, "no weapon is orphaned");
});

test("only the three starters are unlocked at level 1", () => {
  const p = new Progression(memStorage());
  for (const w of WEAPONS)
    assert.equal(
      p.isUnlocked(w.key),
      STARTERS.includes(w.key),
      `${w.key} unlocked at level 1?`,
    );
});

test("the roster opens in the intended order as levels arrive", () => {
  const order = ["smg", "shotgun", "lmg", "sniper", "rocket"];
  const p = new Progression(memStorage());
  const seen = [];
  let guard = 0;
  while (p.loadout.length < BANDS.length && guard++ < 200) {
    const before = p.loadout.slice();
    p.addRun({ kills: 90, wave: 6 });
    for (const k of p.loadout) if (!before.includes(k)) seen.push(k);
  }
  assert.deepEqual(seen, order, "bands must open in ladder order");
  assert.ok(guard < 30, `should not be a grind, took ${guard} runs`);
});

test("bands are gated by level, and their guns by their own", () => {
  const p = new Progression(memStorage());
  // A band that has not opened contributes no key at all.
  assert.equal(p.loadout.includes("sniper"), false);
  // And a variant inside an open band still waits for its own level.
  assert.equal(p.isUnlocked("ar"), true);
  assert.equal(p.isUnlocked("m4"), false);
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
  assert.deepEqual(p.loadout, STARTERS);
  assert.equal(p.start, DEFAULT_START);
  p.addRun({ kills: 5, wave: 1 });
  assert.ok(p.xp > 0, "xp still accrues in memory");
});
