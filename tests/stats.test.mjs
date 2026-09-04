import assert from "node:assert/strict";
import { test } from "node:test";
import { RunStats } from "../games/onslaught/src/sim/stats.js";

const weapons = (current = 0) => ({
  current,
  weapons: [
    { def: { key: "ar" } },
    { def: { key: "shotgun" } },
    { def: { key: "dmr" } },
  ],
});
const world = (over = {}) => ({
  elapsed: 10,
  wave: 1,
  weapons: weapons(),
  ...over,
});

test("counts shots, pellets, hits, headshots, damage per weapon and computes accuracy", () => {
  const s = new RunStats(),
    w = world();
  s.record({ type: "shot", def: { key: "ar", pellets: 1 }, index: 0 }, w);
  s.record({ type: "shot", def: { key: "ar", pellets: 1 }, index: 0 }, w);
  s.record(
    { type: "hit", kind: "runner", head: true, killed: true, damage: 40 },
    w,
  );
  s.record({ type: "kill", enemy: { type: "runner" }, head: true }, w);
  const o = s.summary();
  assert.equal(o.weapons.ar.shots, 2);
  assert.equal(o.weapons.ar.pellets, 2);
  assert.equal(o.weapons.ar.hits, 1);
  assert.equal(o.weapons.ar.headshots, 1);
  assert.equal(o.weapons.ar.kills, 1);
  assert.equal(o.weapons.ar.damage, 40);
  assert.equal(o.enemies.runner.killed, 1);
  assert.equal(o.accuracy, 0.5);
  assert.equal(o.headshotRate, 1);
  assert.equal(o.damageDealt, 40);
});

test("damage taken is attributed by kind and the killer is recorded", () => {
  const s = new RunStats(),
    w = world({ wave: 3, elapsed: 42.5 });
  s.record({ type: "hurt", amount: 12, by: "runner" }, w);
  s.record({ type: "hurt", amount: 14, by: "spit" }, w);
  s.record({ type: "hurt", amount: 34, by: "brute" }, w);
  s.record({ type: "dead" }, w);
  const o = s.summary();
  assert.equal(o.damageTaken, 60);
  assert.equal(o.enemies.runner.damageDealt, 12);
  assert.equal(o.enemies.spitter.damageDealt, 14);
  assert.equal(o.enemies.brute.hitsOnPlayer, 1);
  assert.deepEqual(o.killedBy, { kind: "brute", wave: 3, elapsed: 42.5 });
  assert.equal(o.result, "dead");
});

test("waves record start, clear and duration; spawns, pickups, reloads counted", () => {
  const s = new RunStats();
  s.record({ type: "waveStart", wave: 1, count: 11 }, world({ elapsed: 4 }));
  s.record({ type: "spawn", kind: "runner" }, world());
  s.record({ type: "reloadStage", stage: "start" }, world());
  s.record({ type: "reloadStage", stage: "magOut" }, world());
  s.record({ type: "pickup" }, world());
  s.record({ type: "pickupExpire" }, world());
  s.record({ type: "waveClear", wave: 1, bonus: 250 }, world({ elapsed: 30 }));
  s.record({ type: "waveStart", wave: 2, count: 17 }, world({ elapsed: 39 }));
  const o = s.summary();
  assert.deepEqual(o.waves[0], {
    wave: 1,
    count: 11,
    startedAt: 4,
    clearedAt: 30,
    durationS: 26,
  });
  assert.deepEqual(o.waves[1], {
    wave: 2,
    count: 17,
    startedAt: 39,
    clearedAt: null,
    durationS: null,
  });
  assert.equal(o.enemies.runner.spawned, 1);
  assert.equal(o.weapons.ar.reloads, 1);
  assert.deepEqual(o.pickups, { collected: 1, expired: 1 });
});

test("tick accumulates elapsed and time held on the current weapon; reset zeroes", () => {
  const s = new RunStats();
  s.tick(0.5, world({ elapsed: 0.5, weapons: weapons(2) }));
  assert.equal(s.summary().weapons.dmr.timeHeldS, 0.5);
  assert.equal(s.summary().elapsed, 0.5);
  s.reset();
  assert.equal(s.summary().weapons.dmr.timeHeldS, 0);
  assert.equal(s.summary().waves.length, 0);
  assert.equal(s.summary().result, "alive");
});
