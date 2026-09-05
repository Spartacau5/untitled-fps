import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { World } from "../games/onslaught/src/sim/world.js";

const dt = 1 / 60;

function wrapPi(a) {
  let x = a;
  while (x > Math.PI) x -= Math.PI * 2;
  while (x < -Math.PI) x += Math.PI * 2;
  return x;
}

function spawnSpitter(w, x, z, yaw = 0) {
  const e = w.enemies.spawn(
    "spitter",
    { pos: { x, z }, dir: { x: 0, z: 1 } },
    1,
    w,
  );
  e.pos.set(x, 0, z);
  e.prevPos.copy(e.pos);
  e.yaw = yaw;
  e.prevYaw = yaw;
  e.state = "chase";
  e.dissolve = 0;
  e.cooldown = 99;
  return e;
}

test("an orbiting spitter faces its strafe, not locked onto the player", () => {
  const w = new World({ seed: 1, noSpawn: true, god: true });
  w.startRun();
  const e = spawnSpitter(w, 0, 0, 0);
  e.cooldown = 99;
  e.steerBias = 1;
  w.player.pos.set(0, 1.2, -14);
  for (let i = 0; i < 180; i++) w.enemies.update(dt, w.player, w);
  const toPlayer = Math.atan2(
    -(w.player.pos.x - e.pos.x),
    -(w.player.pos.z - e.pos.z),
  );
  const toMove = Math.atan2(-e.vel.x, -e.vel.z);
  const faceMove = Math.abs(wrapPi(e.yaw - toMove));
  const facePlayer = Math.abs(wrapPi(e.yaw - toPlayer));
  assert.ok(
    faceMove < 0.45,
    `yaw should follow the strafe (err ${faceMove.toFixed(2)} rad, yaw ${e.yaw.toFixed(2)}, move ${toMove.toFixed(2)})`,
  );
  assert.ok(
    facePlayer > 0.8,
    `should not stare at the player while orbiting (err ${facePlayer.toFixed(2)} rad)`,
  );
  const speed = Math.hypot(e.vel.x, e.vel.z);
  assert.ok(speed > 0.4, "should still be strafing around the standoff");
});

test("a spitter that reverses also turns its body", () => {
  const w = new World({ seed: 1, noSpawn: true, god: true });
  w.startRun();
  const e = spawnSpitter(w, 0, 0, 0);
  e.cooldown = 99;
  e.steerBias = 1;
  w.player.pos.set(0, 1.2, -14);
  for (let i = 0; i < 120; i++) w.enemies.update(dt, w.player, w);
  const yawLeft = e.yaw;
  e.steerBias = -1;
  for (let i = 0; i < 90; i++) w.enemies.update(dt, w.player, w);
  const turned = Math.abs(wrapPi(e.yaw - yawLeft));
  assert.ok(
    turned > 1.2,
    `body should yaw into the new strafe (turned ${turned.toFixed(2)} rad)`,
  );
  const toMove = Math.atan2(-e.vel.x, -e.vel.z);
  assert.ok(
    Math.abs(wrapPi(e.yaw - toMove)) < 0.5,
    "after the reverse, yaw should match the new heading",
  );
});

test("a side-on shot that hits the spitter sac still counts", () => {
  const w = new World({ seed: 1, noSpawn: true, god: true });
  w.startRun();
  const e = spawnSpitter(w, 0, 0, 0);
  e.moveBlend = 0;
  const origin = new Vector3(5, 1.15, 0.34);
  const dir = new Vector3(-1, 0, 0);
  const hit = w.enemies.raycast(origin, dir, 40);
  assert.ok(hit, "sac / side silhouette should be inside the hitbox");
  assert.equal(hit.enemy, e);
});

test("a frontal shot still hits, and a wide miss still misses", () => {
  const w = new World({ seed: 1, noSpawn: true, god: true });
  w.startRun();
  spawnSpitter(w, 0, 0, 0);
  const hit = w.enemies.raycast(
    new Vector3(0, 1.1, -5),
    new Vector3(0, 0, 1),
    40,
  );
  assert.ok(hit, "frontal torso/head should still connect");
  const miss = w.enemies.raycast(
    new Vector3(5, 1.15, 2.2),
    new Vector3(-1, 0, 0),
    40,
  );
  assert.equal(miss, null);
});
