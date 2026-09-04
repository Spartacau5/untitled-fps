import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { World } from "../games/onslaught/src/sim/world.js";
import { tapeFrame } from "./helpers/input-tape.mjs";

// Steps a World headless for `ticks` and digests a state sample every second.
// The World's own hash() is a cheap end-state digest; this test also hashes
// the trajectory so a divergence mid-run cannot converge back by accident.
function run(seed, ticks) {
  const w = new World({ seed });
  w.startRun();
  const h = createHash("sha256");
  const eventCounts = {};
  for (let i = 0; i < ticks; i++) {
    w.step(1 / 60, tapeFrame(i, w));
    for (const ev of w.drainEvents())
      eventCounts[ev.type] = (eventCounts[ev.type] || 0) + 1;
    if (i % 60 === 0) {
      const p = w.player;
      h.update(
        `${p.pos.x.toFixed(6)},${p.pos.y.toFixed(6)},${p.pos.z.toFixed(6)},${p.hp},${w.wave},${w.score},${w.kills},${w.weapons.weapon.mag},${w.enemies.list.length};`,
      );
      for (const e of w.enemies.list)
        h.update(
          `${e.type}:${e.pos.x.toFixed(5)},${e.pos.z.toFixed(5)},${e.hp.toFixed(3)},${e.state};`,
        );
    }
  }
  return {
    hash: h.digest("hex"),
    endHash: w.hash(),
    wave: w.wave,
    kills: w.kills,
    eventCounts,
  };
}

test("world runs headless for 60 s and is deterministic per seed", () => {
  const a = run(1, 3600),
    b = run(1, 3600);
  (assert.equal(a.hash, b.hash),
    assert.equal(a.endHash, b.endHash),
    assert.ok(a.wave >= 1, "a wave should have started"),
    assert.ok(a.kills > 0, "scripted fire should kill something"));
});

test("the sim exercises every major event path", () => {
  const { eventCounts: c } = run(1, 3600);
  for (const k of [
    "shot",
    "tracer",
    "hit",
    "impact",
    "kill",
    "spawn",
    "waveStart",
    "reloadStage",
    "switch",
    "ammo",
    "jump",
    "land",
    "step",
  ])
    assert.ok(c[k] > 0, `expected at least one "${k}" event`);
});

test("different seeds diverge", () => {
  assert.notEqual(run(1, 1800).hash, run(2, 1800).hash);
});

test("startRun replays identically from the same seed", () => {
  const w = new World({ seed: 7 });
  const play = () => {
    w.startRun();
    for (let i = 0; i < 900; i++)
      (w.step(1 / 60, tapeFrame(i, w)), w.drainEvents());
    return w.hash();
  };
  assert.equal(play(), play());
});
