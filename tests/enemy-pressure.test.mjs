import assert from "node:assert/strict";
import { test } from "node:test";
import { ENEMIES } from "../games/onslaught/src/data/enemies.js";
import { World } from "../games/onslaught/src/sim/world.js";

const dt = 1 / 60;

function spawn(w, type, x, z) {
  const e = w.enemies.spawn(
    type,
    { pos: { x, z }, dir: { x: 0, z: 1 } },
    1,
    w,
  );
  e.pos.set(x, 0, z);
  e.prevPos.copy(e.pos);
  e.vel.set(0, 0, 0);
  e.state = "chase";
  e.dissolve = 0;
  e.cooldown = 0;
  return e;
}

function distXZ(a, b) {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

function resolveMelee(w, e) {
  e.state = "attack";
  e.t = e.def.windup - dt * 0.5;
  e.attackDone = !1;
  w.enemies.update(dt, w.player, w);
}

test("a Behemoth in charge range rushes instead of walking", () => {
  const w = new World({ seed: 1, noSpawn: true, god: true });
  w.startRun();
  w.player.pos.set(0, 0.5, 0);
  const e = spawn(w, "brute", 0, 12);
  for (let i = 0; i < 45; i++) w.enemies.update(dt, w.player, w);
  assert.equal(e.state, "charge");
  const speed = Math.hypot(e.vel.x, e.vel.z);
  assert.ok(
    speed > e.def.speed + 1,
    `charge should outrun the walk (speed ${speed.toFixed(2)} vs walk ${e.def.speed})`,
  );
  assert.ok(distXZ(e.pos, w.player.pos) < 12, "should close the gap");
});

test("a charging Behemoth slams once it reaches commit range", () => {
  const w = new World({ seed: 1, noSpawn: true, god: true });
  w.startRun();
  w.player.pos.set(0, 0.5, 0);
  const e = spawn(w, "brute", 0, 5.4);
  e.state = "charge";
  e.t = 0.2;
  for (let i = 0; i < 60; i++) {
    w.enemies.update(dt, w.player, w);
    if (e.state === "attack") break;
  }
  assert.equal(e.state, "attack");
});

test("a Behemoth slam hits at 5.5m and misses at 7m", () => {
  const w = new World({ seed: 1, noSpawn: true });
  w.startRun();
  w.player.pos.set(0, 0.5, 0);
  const hp = w.player.hp;
  const e = spawn(w, "brute", 0, 5.5);
  resolveMelee(w, e);
  assert.ok(e.attackDone, "slam should resolve");
  assert.equal(w.player.hp, hp - e.def.damage);

  w.player.hp = hp;
  w.player.dead = !1;
  const far = spawn(w, "brute", 0, 7);
  resolveMelee(w, far);
  assert.ok(far.attackDone);
  assert.equal(w.player.hp, hp);
});

test("a Husk still misses just outside its melee reach", () => {
  const w = new World({ seed: 1, noSpawn: true });
  w.startRun();
  w.player.pos.set(0, 0.5, 0);
  const hp = w.player.hp;
  const e = spawn(w, "runner", 0, ENEMIES.runner.range * 1.3 + 0.2);
  resolveMelee(w, e);
  assert.ok(e.attackDone);
  assert.equal(w.player.hp, hp);
});

test("a spitter reloads on the shorter cooldown after a spit", () => {
  const w = new World({ seed: 1, noSpawn: true, god: true });
  w.startRun();
  w.player.pos.set(0, 1.2, 8);
  const e = spawn(w, "spitter", 0, 0);
  e.state = "attack";
  e.t = e.def.windup + e.def.swing - dt * 0.5;
  e.attackDone = !0;
  w.enemies.update(dt, w.player, w);
  assert.equal(e.state, "chase");
  assert.ok(
    e.cooldown >= 1.5 * 0.8 - 1e-6 && e.cooldown <= 1.5 * 1.25 + 1e-6,
    `cooldown ${e.cooldown} should be 1.5 × [0.8, 1.25]`,
  );
});
