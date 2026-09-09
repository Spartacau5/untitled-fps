import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_START,
  LOADOUT_SIZE,
  STARTER_LOADOUT,
  WEAPONS,
} from "../games/onslaught/src/data/weapons.js";

const STARTERS = STARTER_LOADOUT;
import {
  MAX_LEVEL,
  Progression,
  STORAGE_KEY,
  levelForXp,
  nextUnlock,
  unlockLadder,
  unlocksBetween,
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

test("an unlock widens the pool without touching the three you carry", () => {
  const p = new Progression(memStorage());
  const before = p.loadout.slice();
  const poolBefore = p.unlocked.length;
  while (p.level < 2) p.addRun({ kills: 60, wave: 4 });
  // This is the whole point of the three-slot model: earning a gun is an
  // invitation to swap, never a fourth key that arrives on its own.
  assert.deepEqual(p.loadout, before, "the loadout is left alone");
  assert.equal(p.loadout.length, LOADOUT_SIZE);
  assert.ok(p.unlocked.length > poolBefore, "but the pool it draws from grew");
  assert.ok(p.isUnlocked("smg"));
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

test("a run that levels you reports what it opened, ready to render", () => {
  const p = new Progression(memStorage());
  // Enough to cross at least one gate in one go.
  const award = p.addRun({ kills: 400, wave: 8 });
  assert.ok(award.levelsGained > 0);
  assert.ok(award.unlocks.length > 0, "crossing a gate must open something");
  assert.deepEqual(
    award.unlocks.map((r) => r.key),
    unlocksBetween(1, award.level).map((r) => r.key),
  );
  // Every rung carries what the debrief prints, so the HUD needs no lookup.
  for (const r of award.unlocks) {
    assert.equal(r.kind, "weapon");
    assert.ok(r.label && r.klass && r.level > 1);
  }
  // A run that changes nothing opens nothing.
  assert.deepEqual(p.addRun({ kills: 0, wave: 0 }).unlocks, []);
});

test("the profile answers for its own next unlock", () => {
  const p = new Progression(memStorage());
  assert.deepEqual(p.nextUnlock(), nextUnlock(1));
  while (p.level < 3) p.addRun({ kills: 60, wave: 4 });
  assert.equal(p.nextUnlock().level, 4);
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
  while (seen.length < order.length && guard++ < 200) {
    const before = p.unlocked.map((w) => w.key);
    p.addRun({ kills: 90, wave: 6 });
    for (const w of p.unlocked)
      if (!before.includes(w.key) && order.includes(w.key)) seen.push(w.key);
  }
  assert.deepEqual(seen, order, "the pool must open in ladder order");
  assert.ok(guard < 30, `should not be a grind, took ${guard} runs`);
  // However far it runs, the number of keys never moves.
  assert.equal(p.loadout.length, LOADOUT_SIZE);
});

test("each gun is gated by its own level, and the pool reflects it", () => {
  const p = new Progression(memStorage());
  assert.equal(p.isUnlocked("ar"), true);
  assert.equal(p.isUnlocked("m4"), false, "a later rifle waits its turn");
  assert.equal(p.isUnlocked("sniper"), false);
  assert.deepEqual(
    p.unlocked.map((w) => w.key).sort(),
    STARTERS.slice().sort(),
    "the level 1 pool is exactly the three starters",
  );
  assert.equal(p.unlockLevelOf("sniper"), 5);
});

test("equipping refuses locked guns and swaps rather than duplicates", () => {
  const p = new Progression(memStorage());
  const before = p.loadout.slice();
  p.equip("sniper", 0);
  assert.deepEqual(p.loadout, before, "a locked gun cannot be carried");
  // Moving a gun you already carry onto another key trades the two, so the
  // loadout can be reordered without ever holding the same rifle twice.
  p.equip(before[2], 0);
  assert.equal(p.loadout[0], before[2]);
  assert.equal(p.loadout[2], before[0]);
  assert.equal(new Set(p.loadout).size, LOADOUT_SIZE, `dupes: ${p.loadout}`);
});

test("the unlock ladder lists every gate once, in level order", () => {
  const ladder = unlockLadder();
  const levels = ladder.map((r) => r.level);
  assert.deepEqual(
    levels,
    levels.slice().sort((a, b) => a - b),
  );
  // Every rung is a gun now - there is no band step, because a band no longer
  // owns a key - and every gated gun is on it exactly once.
  const gated = WEAPONS.filter((w) => (w.unlockLevel || 1) > 1);
  assert.equal(ladder.length, gated.length);
  for (const r of ladder) assert.equal(r.kind, "weapon");
  assert.equal(new Set(ladder.map((r) => r.key)).size, ladder.length);
  for (const w of gated)
    assert.ok(
      ladder.some((r) => r.key === w.key && r.level === w.unlockLevel),
      `${w.key} missing from the ladder`,
    );
  // Nothing you already have is advertised as something still to earn.
  assert.equal(
    ladder.some((r) => r.level <= 1),
    false,
  );
  for (const k of STARTERS)
    assert.equal(
      ladder.some((r) => r.key === k),
      false,
    );
});

test("nextUnlock names the very next thing a player will earn", () => {
  const first = nextUnlock(1);
  assert.equal(first.kind, "weapon");
  assert.equal(first.key, "smg");
  assert.equal(first.level, 2);
  // It carries enough to render a teaser without a second lookup.
  assert.ok(first.label && first.klass);
  const top = Math.max(...unlockLadder().map((r) => r.level));
  assert.equal(nextUnlock(top), null, "it runs out rather than looping");
  assert.equal(nextUnlock(MAX_LEVEL), null);
});

test("unlocksBetween reports exactly what a run's level-ups opened", () => {
  assert.deepEqual(unlocksBetween(1, 1), []);
  const one = unlocksBetween(1, 2);
  assert.equal(one.length, 1);
  assert.equal(one[0].key, "smg");
  assert.deepEqual(
    unlocksBetween(2, 4).map((r) => r.key),
    ["shotgun", "lmg"],
  );
  // A run that crosses several levels at once lists them all, in order.
  assert.deepEqual(
    unlocksBetween(1, 5).map((r) => r.key),
    ["smg", "shotgun", "lmg", "sniper"],
  );
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
