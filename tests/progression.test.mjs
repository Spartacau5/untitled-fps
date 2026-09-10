import assert from "node:assert/strict";
import { test } from "node:test";
import {
  LOADOUT_SIZE,
  STARTER_LOADOUT,
  WEAPONS,
} from "../games/onslaught/src/data/weapons.js";

const STARTERS = STARTER_LOADOUT;
import {
  MAX_LEVEL,
  Progression,
  STORAGE_KEY,
  XP_HEAD_MULT,
  XP_STREAK_MAX,
  levelForXp,
  nextUnlock,
  streakMult,
  unlockLadder,
  unlocksBetween,
  xpForKill,
  xpForLevel,
  xpForWaveClear,
} from "../games/onslaught/src/core/progression.js";
import { ENEMIES } from "../games/onslaught/src/data/enemies.js";

// Runs a whole wave's worth of kills through the live path, the way the
// game does: one award per kill, one for the clear.
const playWave = (p, wave, kills, { xp = ENEMIES.runner.xp } = {}) => {
  for (let i = 0; i < kills; i++) p.award(xpForKill({ xp, streak: 1 }));
  p.award(xpForWaveClear(wave), { flush: true });
};

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
  // You deploy holding key 1. Always - it is derived from the loadout rather
  // than stored beside it, so there is no second value to drift out of sync.
  assert.equal(p.start, p.loadout[0]);
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
  while (p.level < 2) playWave(p, 4, 20, { xp: ENEMIES.brute.xp });
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

test("a kill pays what the enemy is worth, never what it scores", () => {
  const husk = xpForKill({ xp: ENEMIES.runner.xp });
  const gunship = xpForKill({ xp: ENEMIES.missileDrone.xp });
  assert.ok(husk > 0 && gunship > husk, "a gunship is worth more");
  // The two numbers are independent by design: the board ranks on score,
  // the armory pays on xp, and neither is derived from the other.
  for (const k of Object.keys(ENEMIES)) {
    const d = ENEMIES[k];
    assert.ok(d.xp > 0, `${k} is worth no xp`);
    assert.notEqual(d.xp, d.score, `${k} xp is just its score`);
  }
  assert.equal(xpForKill({}), 0);
  assert.equal(xpForKill({ xp: -20 }), 0);
});

test("headshots and multi-kills each carry their own multiplier", () => {
  const base = ENEMIES.runner.xp;
  const plain = xpForKill({ xp: base });
  const head = xpForKill({ xp: base, head: true });
  assert.equal(head, Math.round(base * XP_HEAD_MULT));
  assert.ok(head > plain, "aiming has to pay");
  // Streaks compound, and stack on top of a headshot.
  assert.equal(streakMult(1), 1);
  assert.ok(streakMult(5) > streakMult(2));
  assert.ok(xpForKill({ xp: base, streak: 5 }) > plain);
  assert.ok(
    xpForKill({ xp: base, head: true, streak: 5 }) >
      xpForKill({ xp: base, streak: 5 }),
    "the two multipliers are independent",
  );
  // Capped, so a long wave of husks cannot out-earn a hard one.
  assert.equal(streakMult(999), XP_STREAK_MAX);
  assert.equal(
    xpForKill({ xp: base, streak: 999 }),
    Math.round(base * XP_STREAK_MAX),
  );
});

test("the wave bonus is its own award and grows with the wave", () => {
  assert.equal(xpForWaveClear(0), 0);
  assert.ok(xpForWaveClear(1) > 0);
  for (let w = 1; w < 20; w++)
    assert.ok(
      xpForWaveClear(w + 1) > xpForWaveClear(w),
      `wave ${w + 1} must pay more than ${w}`,
    );
  // Deep waves are worth going for rather than a rounding error.
  assert.ok(xpForWaveClear(20) >= 10 * xpForWaveClear(2));
  assert.equal(xpForWaveClear(-4), 0);
});

test("xp lands as it is earned, not when the run ends", () => {
  const st = memStorage(),
    p = new Progression(st);
  p.beginRun();
  const seen = [];
  p.onChange((x) => seen.push(x.xp));
  const one = p.award(xpForKill({ xp: ENEMIES.runner.xp }));
  assert.ok(one.gained > 0, "a kill pays immediately");
  assert.ok(p.xp > 0, "and the profile already holds it");
  assert.ok(seen.length > 0, "listeners hear about it, so the bar moves");
  const afterKill = p.xp;
  // Ending the run reports the tally but must not pay a second time.
  const done = p.endRun();
  assert.equal(p.xp, afterKill, "endRun must not award anything");
  assert.equal(done.gained, afterKill);
});

test("a run that is never finished keeps everything it earned", () => {
  const st = memStorage();
  const p = new Progression(st);
  p.beginRun();
  // Nine waves of husks, then the tab closes: no endRun, no debrief.
  for (let w = 1; w <= 9; w++) playWave(p, w, 30);
  const banked = p.xp;
  assert.ok(banked > 0, "the run earned something");
  assert.equal(
    new Progression(st).xp,
    banked,
    "a fresh profile off the same storage has all of it",
  );
});

test("the run tally counts only the current run, and levels with it", () => {
  const st = memStorage(),
    p = new Progression(st);
  (p.beginRun(), playWave(p, 1, 40), p.endRun());
  p.beginRun();
  playWave(p, 2, 40);
  const second = p.endRun();
  assert.ok(second.gained > 0);
  assert.ok(
    second.gained < p.xp,
    "the tally is this run, not the profile total",
  );
  assert.equal(saved(st).xp, p.xp);
});

test("a level crossed mid-run is reported on the award that crossed it", () => {
  const p = new Progression(memStorage());
  p.beginRun();
  let crossing = null;
  for (let i = 0; i < 4000 && !crossing; i++) {
    const got = p.award(xpForKill({ xp: ENEMIES.brute.xp, head: true }));
    if (got.levelsGained > 0) crossing = got;
  }
  assert.ok(crossing, "kills alone must be able to level you");
  assert.equal(crossing.level, 2);
  assert.deepEqual(
    crossing.unlocks.map((r) => r.key),
    ["smg"],
    "so the game can say what just opened, while you are still playing",
  );
});

test("a run that levels you reports what it opened, ready to render", () => {
  const p = new Progression(memStorage());
  p.beginRun();
  // Eight waves, deep enough to cross at least one gate.
  for (let w = 1; w <= 8; w++) playWave(p, w, 40, { xp: ENEMIES.brute.xp });
  const award = p.endRun();
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
  // A run that earns nothing opens nothing.
  (p.beginRun(), assert.deepEqual(p.endRun().unlocks, []));
});

test("the profile answers for its own next unlock", () => {
  const p = new Progression(memStorage());
  assert.deepEqual(p.nextUnlock(), nextUnlock(1));
  while (p.level < 3) playWave(p, 4, 20, { xp: ENEMIES.brute.xp });
  assert.equal(p.nextUnlock().level, 4);
});

test("the kill path does not write to storage on every kill", () => {
  let writes = 0;
  const m = new Map();
  const st = {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => (writes++, m.set(k, String(v))),
    removeItem: (k) => m.delete(k),
  };
  const p = new Progression(st);
  p.beginRun();
  // A wave of 130 husks. A synchronous localStorage write per kill is a
  // stall in the middle of a firefight, which is the whole reason award()
  // batches; what it must never do is lose the xp.
  const before = writes;
  for (let i = 0; i < 130; i++) p.award(xpForKill({ xp: 1 }));
  assert.ok(writes - before < 30, `${writes - before} writes for 130 kills`);
  assert.ok(p.xp >= 130, "every kill still counted");
  // And a wave clear always flushes, so nothing is left unsaved for long.
  p.award(xpForWaveClear(3), { flush: true });
  assert.equal(saved(st).xp, p.xp);
});

test("progress through the current level is reported for the xp bar", () => {
  const p = new Progression(memStorage());
  p.award(xpForWaveClear(2));
  const { into, span, frac } = p.levelProgress;
  assert.ok(span > 0 && into >= 0 && into < span);
  assert.ok(frac >= 0 && frac < 1);
});

test("the gun you deploy holding is whatever sits on key 1", () => {
  const st = memStorage(),
    p = new Progression(st);
  assert.equal(p.start, p.loadout[0]);
  // Reordering the keys moves the spawn gun with them, because the two are
  // the same fact stated once instead of twice.
  const wasSecond = p.loadout[1];
  p.equip(wasSecond, 0);
  (assert.equal(p.loadout[0], wasSecond), assert.equal(p.start, wasSecond));
  // Never persisted, so no save can carry a stale spawn gun forward.
  assert.equal("start" in saved(st), false);
});

test("editing the loadout can never leave you deploying on key 3", () => {
  // The bug this replaced: equipping over the gun that was deploying moved
  // the spawn to that key, so a couple of swaps could silently leave a run
  // starting on the third weapon.
  const p = new Progression(memStorage());
  while (p.level < 4) p.award(xpForWaveClear(p.level * 4));
  for (const w of p.unlocked)
    for (const at of [2, 1, 0, 2]) {
      p.equip(w.key, at);
      assert.equal(
        p.start,
        p.loadout[0],
        `deploying on ${p.start} with ${p.loadout} on the keys`,
      );
    }
});

test("a corrupt or outdated profile falls back to the starters", () => {
  for (const bad of [
    '{"start":"nonsense"}',
    '{"start":42}',
    '{"loadout":["pistol","pistol"]}',
    "not json at all",
  ]) {
    const p = new Progression(memStorage({ [STORAGE_KEY]: bad }));
    assert.deepEqual(p.loadout, STARTERS);
    // An older save still carrying a `start` field is ignored rather than
    // honoured, so nobody is stranded on a stale spawn gun.
    assert.equal(p.start, STARTERS[0]);
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
    playWave(p, 6, 40, { xp: ENEMIES.brute.xp });
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

test("pick fills the next key, and a carried gun jumps to key 1", () => {
  const p = new Progression(memStorage());
  // Unlock the SMG so the deploy roster can take it.
  p.award(xpForLevel(2));
  assert.equal(p.isUnlocked("smg"), true);
  const starters = p.loadout.slice();
  p.pick("smg");
  assert.equal(p.loadout[0], "smg");
  assert.equal(p.loadout[1], starters[1]);
  assert.equal(p.loadout[2], starters[2]);
  // Key 1 is the spawn, so picking a benched gun onto it makes it the spawn.
  assert.equal(p.start, "smg");
  // Second pick lands on key 2.
  p.award(xpForLevel(3) - p.xp);
  assert.equal(p.isUnlocked("shotgun"), true);
  p.pick("shotgun");
  assert.equal(p.loadout[1], "shotgun");
  assert.equal(p.loadout[0], "smg");
  // Clicking a gun you already carry moves it to key 1, which is what
  // "deploy holding this" means now.
  const carried = p.loadout.slice();
  p.pick(carried[2]);
  assert.equal(p.loadout[0], carried[2]);
  assert.equal(p.start, carried[2]);
  assert.equal(new Set(p.loadout).size, 3, "and never duplicates a gun");
  // Locked guns stay out.
  const before = p.loadout.slice();
  p.pick("sniper");
  assert.deepEqual(p.loadout, before);
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
  assert.equal(p.start, STARTERS[0]);
  p.award(xpForWaveClear(1));
  assert.ok(p.xp > 0, "xp still accrues in memory");
});
