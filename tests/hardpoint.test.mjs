import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { World } from "../games/onslaught/src/sim/world.js";
import { MIDTOWN, HARDPOINT } from "../games/onslaught/src/data/midtown.js";
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
function world(options = {}) {
  const w = new World({
    mode: "hardpoint",
    seed: 7,
    noSpawn: true,
    ...options,
  });
  w.startRun();
  w.drainEvents();
  return w;
}
function bot(w, x, z) {
  const e = w.enemies.spawn(
    "runner",
    { pos: new Vector3(x, 0, z), dir: new Vector3(0, 0, 1) },
    1,
    w,
  );
  Object.assign(e, {
    state: "chase",
    tactical: true,
    reaction: 0,
    rounds: 18,
    burst: 0,
    cooldown: 0,
  });
  e.pos.set(x, 0, z);
  e.prevPos.copy(e.pos);
  return e;
}

test("every spawn and all three lanes connect to every hardpoint", () => {
  const w = world();
  for (const p of MIDTOWN.objectives) {
    w.flow.update(p.x, p.z);
    for (const s of MIDTOWN.spawns) {
      const cell = w.flow.cellOf(s.x, s.z);
      assert.equal(w.flow.open[cell], 1);
      assert.ok(w.flow.dist[cell] < 0x7fffffff, `${s.x},${s.z} -> ${p.id}`);
    }
  }
});
test("rectangular corners have no ghost circular wall, and bullets meet visible solids", () => {
  const w = world();
  assert.deepEqual(w.arena.resolveCircle(25, 33, 0.4), [25, 33]);
  assert.equal(
    w.arena.raycast(new Vector3(25, 1.5, 29), new Vector3(0, 0, 1), 5),
    null,
  );
  const hit = w.arena.raycast(
    new Vector3(0, 1.5, 0),
    new Vector3(-1, 0, 0),
    30,
  );
  assert.ok(hit && Math.abs(hit.dist - 8.5) < 1e-6);
  const ground = w.arena.raycast(
    new Vector3(0, 2, 0),
    new Vector3(0, -1, 0),
    10,
  );
  assert.equal(ground.point.y, 0);
});
test("only uncontested occupation scores; kills and multiple robots do not multiply points", () => {
  const w = world();
  w.player.pos.set(0, 0, 0);
  for (let i = 0; i < 121; i++) w.match.update(1 / 60);
  assert.equal(w.match.playerScore, 2);
  const e = bot(w, 1, 0);
  bot(w, -1, 0);
  for (let i = 0; i < 121; i++) w.match.update(1 / 60);
  assert.equal(w.match.owner, "contested");
  assert.equal(w.match.playerScore, 2);
  assert.equal(w.match.robotScore, 0);
  w.player.pos.set(0, 0, 20);
  for (let i = 0; i < 121; i++) w.match.update(1 / 60);
  assert.equal(w.match.robotScore, 2);
  w.onKill(e, false);
  assert.equal(w.match.playerScore, 2);
});
test("hardpoint rotates on schedule and match score cap freezes the simulation", () => {
  const w = world();
  w.match.time = 44.99;
  w.match.update(0.02);
  assert.equal(w.match.point.id, "B");
  w.player.pos.set(-22, 0, 3);
  w.match.playerScore = HARDPOINT.target - 1;
  for (let i = 0; i < 61; i++) w.match.update(1 / 60);
  assert.equal(w.match.result, "VICTORY");
  const hash = w.hash();
  w.step(1, idle);
  assert.equal(w.hash(), hash);
});
test("time limit resolves a tie and losing score", () => {
  for (const [score, result] of [
    [0, "DRAW"],
    [5, "DEFEAT"],
  ]) {
    const w = world();
    w.match.robotScore = score;
    w.match.time = 359.99;
    w.match.update(0.02);
    assert.equal(w.match.result, result);
  }
});
test("death respawns with ammo and a camera at the chosen spawn, without ending the match", () => {
  const w = world();
  w.match.spawnShield = 0;
  w.onPlayerHit(1000, new Vector3());
  for (let i = 0; i < 182; i++) w.step(1 / 60, idle);
  assert.equal(w.player.dead, false);
  assert.equal(w.match.deaths, 1);
  assert.equal(w.match.finished, false);
  assert.equal(w.player.hp, w.player.maxHp);
  assert.equal(w.weapons.weapon.mag, w.weapons.weapon.def.magSize);
  assert.ok(w.player.camPos.distanceTo(w.player.prevCamPos) < 0.1);
  assert.equal(w.wave, 0);
  assert.equal(w.slowmoRequest, 0);
});
test("rifle units require line of sight and a reaction delay before firing", () => {
  const w = world();
  w.match.spawnShield = 0;
  w.player.pos.set(-20, 0, 0);
  w.player.camPos.set(-20, 1.64, 0);
  const e = bot(w, -5, 0);
  for (let i = 0; i < 90; i++) w.enemies.update(1 / 60, w.player, w);
  assert.equal(w.drainEvents().filter((e) => e.type === "botShot").length, 0);
  e.pos.set(0, 0, 0);
  w.player.pos.set(5, 0, 0);
  w.player.camPos.set(5, 1.64, 0);
  e.reaction = 0;
  e.cooldown = 0;
  for (let i = 0; i < 20; i++) w.enemies.update(1 / 60, w.player, w);
  assert.equal(w.drainEvents().filter((e) => e.type === "botShot").length, 0);
  for (let i = 0; i < 30; i++) w.enemies.update(1 / 60, w.player, w);
  assert.ok(w.drainEvents().some((e) => e.type === "botShot"));
});
test("fixed roster remains capped, navigates to the objective and replays deterministically", () => {
  const run = () => {
    const w = world({ noSpawn: false });
    w.player.dead = true;
    for (let i = 0; i < 3600; i++) {
      w.deadT = -100;
      w.step(1 / 60, idle);
      w.drainEvents();
      assert.ok(w.enemies.alive <= HARDPOINT.bots);
    }
    assert.ok(w.match.robotScore > 5, "robots must reach and hold the point");
    return w.hash();
  };
  assert.equal(run(), run());
});
test("new mode preserves weapon and player tuning from horde", () => {
  const a = world(),
    b = new World({ seed: 7 });
  b.startRun();
  assert.deepEqual(a.weapons.loadout, b.weapons.loadout);
  assert.equal(a.player.maxHp, b.player.maxHp);
  const run = () => {
    const w = world({ noSpawn: false });
    for (let i = 0; i < 2400; i++) {
      w.step(1 / 60, tapeFrame(i, w));
      w.drainEvents();
    }
    return w.hash();
  };
  assert.equal(run(), run());
});
