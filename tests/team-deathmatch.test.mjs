import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { World } from "../games/onslaught/src/sim/world.js";
import { MIDTOWN, TDM, PATROLS } from "../games/onslaught/src/data/midtown.js";
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
const weapon = { key: "test", kbForce: 0, damage: 120 };
function world(options = {}) {
  const w = new World({ mode: "tdm", seed: 7, noSpawn: true, ...options });
  w.startRun();
  w.drainEvents();
  return w;
}
function tick(w, n = 1) {
  for (let i = 0; i < n; i++) {
    w.step(1 / 60, idle);
    w.drainEvents();
  }
}
function bot(w, team, x, z) {
  const e = w.enemies.spawn(
    "runner",
    { pos: new Vector3(x, 0, z), dir: new Vector3(0, 0, 1) },
    1,
    w,
  );
  Object.assign(e, {
    team,
    state: "chase",
    tactical: true,
    reaction: 0,
    rounds: 18,
    burst: 0,
    cooldown: 0,
    shield: 0,
    slot: 0,
    patrol: 0,
    waypoint: 0,
    patrolDir: 1,
    reloadT: 0,
    stepDistance: 0,
  });
  e.pos.set(x, 0, z);
  e.prevPos.copy(e.pos);
  return e;
}
function damage(w, e, byPlayer = true, team = "blue") {
  return w.enemies.damage(
    { enemy: e, point: e.pos.clone(), head: false },
    120,
    new Vector3(1, 0, 0),
    weapon,
    w,
    { team, player: byPlayer },
  );
}

test("all spawns and patrol waypoints are connected without capture points", () => {
  const w = world();
  assert.equal(MIDTOWN.objectives, undefined);
  for (const route of PATROLS)
    for (const [x, z] of route) {
      w.flow.update(x, z);
      for (const s of MIDTOWN.spawns) {
        const cell = w.flow.cellOf(s.x, s.z);
        assert.ok(w.flow.open[cell]);
        assert.ok(w.flow.dist[cell] < 0x7fffffff);
      }
    }
});
test("3v3 roster consists of a human, two allies and three opponents", () => {
  const w = world({ noSpawn: false });
  tick(w, 90);
  assert.equal(w.enemies.list.filter((e) => e.team === "blue").length, 2);
  assert.equal(w.enemies.list.filter((e) => e.team === "red").length, 3);
});
test("standing anywhere never scores and there are no objective events", () => {
  const w = world();
  w.player.pos.set(0, 0, 0);
  for (let i = 0; i < 3600; i++) {
    w.step(1 / 60, idle);
    assert.ok(!w.drainEvents().some((e) => e.type === "objective"));
  }
  assert.equal(w.match.playerScore, 0);
  assert.equal(w.match.robotScore, 0);
  assert.equal(w.wave, 0);
});
test("player and allied kills count once; AI kills do not award player kills or hitmarkers", () => {
  const w = world(),
    red = bot(w, "red", 0, 0);
  damage(w, red);
  assert.equal(w.match.playerScore, 1);
  assert.equal(w.kills, 1);
  damage(w, red);
  assert.equal(w.match.playerScore, 1);
  const red2 = bot(w, "red", 2, 0);
  w.drainEvents();
  damage(w, red2, false);
  assert.equal(w.match.playerScore, 2);
  assert.equal(w.kills, 1);
  assert.ok(!w.drainEvents().some((e) => e.type === "hit"));
  const ally = bot(w, "blue", 5, 0);
  damage(w, ally, false, "red");
  assert.equal(w.match.robotScore, 1);
});
test("friendly fire and spawn protection do not cause damage or false hitmarkers", () => {
  const w = world(),
    ally = bot(w, "blue", 0, 0),
    red = bot(w, "red", 4, 0);
  w.drainEvents();
  damage(w, ally);
  assert.equal(ally.hp, 72);
  assert.ok(!w.drainEvents().some((e) => e.type === "hit"));
  red.shield = 1;
  damage(w, red);
  assert.equal(red.hp, 72);
  w.match.spawnShield = 0;
  w.onPlayerHit(20, ally.pos, ally);
  assert.equal(w.player.hp, w.player.maxHp);
});
test("death gives the opposing team one point and respawns the player", () => {
  const w = world();
  w.match.spawnShield = 0;
  w.onPlayerHit(1000, new Vector3());
  tick(w);
  assert.equal(w.match.robotScore, 1);
  assert.equal(w.match.deaths, 1);
  tick(w, 182);
  assert.equal(w.player.dead, false);
  assert.equal(w.player.hp, w.player.maxHp);
  assert.equal(w.match.robotScore, 1);
  assert.equal(w.weapons.weapon.mag, w.weapons.weapon.def.magSize);
  assert.equal(w.slowmoRequest, 0);
});
test("score limit and time limit resolve matches, with no further simulation", () => {
  const w = world();
  for (let i = 0; i < TDM.target; i++) w.match.recordElimination("red");
  assert.equal(w.match.result, "VICTORY");
  const hash = w.hash();
  tick(w, 10);
  assert.equal(w.hash(), hash);
  const tie = world();
  tie.match.time = TDM.duration - 0.01;
  tie.match.update(0.02);
  assert.equal(tie.match.result, "DRAW");
  const loss = world();
  loss.match.robotScore = 3;
  loss.match.time = TDM.duration - 0.01;
  loss.match.update(0.02);
  assert.equal(loss.match.result, "DEFEAT");
});
test("roster respawns and AI fights without requiring the player to find a point", () => {
  const w = world({ noSpawn: false, god: true });
  tick(w, 90);
  const e = w.enemies.list.find((e) => e.team === "red");
  e.shield = 0;
  damage(w, e);
  tick(w, 240);
  assert.equal(
    w.enemies.list.filter((e) => e.team === "red" && e.state !== "die").length,
    3,
  );
  tick(w, 3600);
  assert.ok(
    w.match.playerScore + w.match.robotScore > 1,
    "AI teams must encounter each other",
  );
  assert.ok(w.enemies.alive <= 5);
});
test("same-seed TDM replays and restarts are deterministic, preserving player gun tuning", () => {
  const w = world({ noSpawn: false }),
    horde = new World({ seed: 7 });
  horde.startRun();
  assert.deepEqual(w.weapons.loadout, horde.weapons.loadout);
  assert.equal(w.player.maxHp, horde.player.maxHp);
  const run = () => {
    w.startRun();
    for (let i = 0; i < 2400; i++) {
      w.step(1 / 60, tapeFrame(i, w));
      w.drainEvents();
    }
    return w.hash();
  };
  assert.equal(run(), run());
});
