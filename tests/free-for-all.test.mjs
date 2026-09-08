import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { World } from "../games/onslaught/src/sim/world.js";
import { FFA } from "../games/onslaught/src/sim/free-for-all.js";
import { tapeFrame } from "./helpers/input-tape.mjs";

const idle = {
  move: { x: 0, y: 0 },
  fire: false,
  fireHeld: false,
  ads: false,
  reload: false,
  sprint: false,
  jump: false,
  crouch: false,
  crouchPressed: false,
  switchTo: -1,
  swapLast: false,
  wheel: 0,
};
const setup = (options = {}) => {
  const w = new World({ mode: "ffa", seed: 19, ...options });
  w.startRun();
  w.match.update(1);
  w.drainEvents();
  return w;
};
function tick(w, frames) {
  for (let i = 0; i < frames; i++) {
    w.step(1 / 60, idle);
    w.drainEvents();
  }
}
function eliminate(w, actor, killer = "blue") {
  actor.shield = 0;
  return w.enemies.damage(
    { enemy: actor, point: actor.pos.clone(), head: true },
    120,
    new Vector3(1, 0, 0),
    { key: "test", kbForce: 0.1 },
    w,
    { team: killer, player: killer === "blue" },
  );
}
test("FFA creates six independent bots and shares only immutable navigation occupancy", () => {
  const w = setup();
  assert.equal(w.enemies.alive, 6);
  assert.equal(w.match.standings.length, 7);
  assert.equal(new Set(w.enemies.list.map((e) => e.team)).size, 6);
  assert.ok(w.enemies.list.every((e) => e.team !== "blue" && e.hp === 100));
  assert.equal(w.player.hp, 100);
  for (const flow of w.match.navigation) assert.equal(flow.open, w.flow.open);
  assert.notEqual(w.match.navigation[0].dist, w.match.navigation[1].dist);
});
test("bot-on-bot and player kills accrue to individual identities exactly once", () => {
  const w = setup(),
    [first, second, third] = w.enemies.list;
  eliminate(w, second, first.team);
  eliminate(w, second, first.team);
  assert.equal(w.match.standings[1].kills, 1);
  assert.equal(w.match.standings[2].deaths, 1);
  assert.equal(w.kills, 0);
  assert.ok(!w.drainEvents().some((event) => event.type === "hit"));
  eliminate(w, third);
  assert.equal(w.match.standings[0].kills, 1);
  assert.equal(w.kills, 1);
  assert.equal(third.headless, false);
});
test("human death credits the lethal bot, then respawns with a fresh loadout", () => {
  const w = setup({ god: false });
  const attacker = w.enemies.list[0];
  w.match.spawnShield = 0;
  w.onPlayerHit(100, attacker.pos, attacker);
  w.step(1 / 60, idle);
  assert.equal(w.match.standings[1].kills, 1);
  assert.equal(w.match.deaths, 1);
  assert.equal(w.match.standings[0].deaths, 1);
  w.noSpawn = true;
  w.enemies.clear();
  tick(w, 182);
  assert.equal(w.player.dead, false);
  assert.equal(w.player.hp, 100);
  assert.equal(w.weapons.weapon.mag, w.weapons.weapon.def.magSize);
  assert.equal(w._lastAttacker, null);
});
test("spawn shields reject damage and player shooting forfeits protection", () => {
  const w = setup(),
    target = w.enemies.list[0];
  target.shield = 1;
  w.enemies.damage(
    { enemy: target, point: target.pos, head: false },
    120,
    new Vector3(),
    { kbForce: 0 },
    w,
  );
  assert.equal(target.hp, 100);
  w.onPlayerHit(100, target.pos, target);
  assert.equal(w.player.hp, 100);
  w.weapons.fire(w.weapons.weapon, w.player, w);
  assert.equal(w.match.spawnShield, 0);
});
test("competitor scores survive actor respawns and restart clears the entire board", () => {
  const w = setup({ god: true }),
    victim = w.enemies.list[0];
  const id = victim.id,
    identity = victim.team;
  eliminate(w, victim);
  tick(w, 240);
  const replacement = w.enemies.list.find(
    (e) => e.team === identity && e.state !== "die",
  );
  assert.ok(replacement);
  assert.notEqual(replacement.id, id);
  assert.equal(w.match.standings[1].deaths, 1);
  w.startRun();
  assert.ok(
    w.match.standings.every((entry) => entry.kills === 0 && entry.deaths === 0),
  );
});
test("kill and time limits use individual kills; equal leading kills draw", () => {
  const w = setup({ noSpawn: true });
  for (let i = 0; i < FFA.target; i++)
    w.match.recordElimination("operator-1", "blue");
  assert.equal(w.match.result, "VICTORY");
  assert.equal(w.match.winner, "YOU");
  const before = w.hash();
  tick(w, 10);
  assert.equal(w.hash(), before);
  const tie = setup({ noSpawn: true });
  tie.match.recordElimination("operator-2", "blue");
  tie.match.recordElimination("operator-2", "operator-1");
  tie.match.time = FFA.duration;
  tie.match.checkEnd();
  assert.equal(tie.match.result, "DRAW");
  const loss = setup({ noSpawn: true });
  loss.match.recordElimination("blue", "operator-4");
  loss.match.time = FFA.duration;
  loss.match.checkEnd();
  assert.equal(loss.match.result, "DEFEAT");
  assert.equal(loss.match.leaderboard[0].name, "BISHOP");
});
test("all operators can fight each other while the human idles", () => {
  const w = setup({ god: true });
  tick(w, 3600);
  const kills = w.match.standings
    .slice(1)
    .reduce((sum, entry) => sum + entry.kills, 0);
  assert.ok(kills > 4, `expected bot combat, observed ${kills} kills`);
  assert.equal(w.kills, 0);
  assert.ok(w.enemies.alive <= 6);
  assert.equal(
    kills,
    w.match.standings.reduce((sum, entry) => sum + entry.deaths, 0),
  );
});
test("same-seed FFA recordings replay identically after restart", () => {
  const w = setup();
  const replay = () => {
    w.startRun();
    for (let i = 0; i < 2400; i++) {
      w.step(1 / 60, tapeFrame(i, w));
      w.drainEvents();
    }
    return [w.hash(), w.match.leaderboard];
  };
  assert.deepEqual(replay(), replay());
});
