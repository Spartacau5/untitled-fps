import assert from "node:assert/strict";
import { test } from "node:test";
import { captureRun } from "../games/onslaught/src/core/run-record.js";
import { GAME_VERSION } from "../games/onslaught/src/data/version.js";
import { RunStats } from "../games/onslaught/src/sim/stats.js";

const world = (over = {}) => ({
  stats: new RunStats(),
  wave: 6,
  score: 28975,
  kills: 136,
  ...over,
});

test("captureRun stores score, wave, and an explicit quit result", () => {
  const rec = captureRun({
    world: world(),
    seed: 1947580233,
    startedAt: "2026-09-06T00:19:43.236Z",
    endedAt: "2026-09-06T00:29:25.536Z",
    settings: { fov: 94 },
    result: "quit",
  });
  assert.equal(rec.v, 1);
  assert.equal(rec.game, GAME_VERSION);
  assert.equal(rec.seed, 1947580233);
  assert.equal(rec.summary.result, "quit");
  assert.equal(rec.summary.wave, 6);
  assert.equal(rec.summary.score, 28975);
  assert.equal(rec.summary.kills, 136);
  assert.equal(rec.settings.fov, 94);
});

test("captureRun keeps a death result distinct from a pause quit", () => {
  const rec = captureRun({
    world: world({ wave: 7, score: 40900, kills: 184 }),
    seed: 42,
    startedAt: "a",
    endedAt: "b",
    settings: {},
    result: "dead",
  });
  assert.equal(rec.summary.result, "dead");
  assert.equal(rec.summary.score, 40900);
});
