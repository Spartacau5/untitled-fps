import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { World } from "../games/onslaught/src/sim/world.js";
import { GUN_GAME_LOADOUT } from "../games/onslaught/src/data/gun-game.js";
import { MIDTOWN } from "../games/onslaught/src/data/midtown.js";

const idle = { move: { x: 0, y: 0 }, switchTo: -1, wheel: 0 };
function setup() {
  const w = new World({
    mode: "ffa",
    seed: 19,
    noSpawn: true,
    loadout: ["rocket"],
    startKey: "rocket",
  });
  w.startRun();
  return w;
}
function ticks(w, n, input = idle) {
  for (let i = 0; i < n; i++) w.step(1 / 60, input);
}
function kill(w) {
  w.match.recordElimination("operator-1", "blue");
  w.match.update(1 / 60);
}
function respawn(w) {
  w.match.spawnShield = 0;
  w.onPlayerHit(1000, new Vector3());
  ticks(w, 183);
  assert.equal(w.player.dead, false);
}
test("fixed pistol start, one upgrade per kill, free arsenal at eight, fresh match resets", () => {
  const w = setup();
  assert.deepEqual(
    w.weapons.weapons.map((w) => w.def.key),
    GUN_GAME_LOADOUT,
  );
  assert.equal(w.weapons.weapon.def.key, "pistol");
  for (let kills = 0; kills < 8; kills++) {
    assert.equal(w.weapons.current, Math.min(kills, 7));
    assert.equal(w.match.freeSelection, false);
    for (const input of [{ switchTo: 7 }, { wheel: 1 }, { swapLast: true }]) {
      ticks(w, 60, { ...idle, ...input });
      assert.equal(w.weapons.current, Math.min(kills, 7));
    }
    kill(w);
  }
  assert.equal(w.match.freeSelection, true);
  ticks(w, 60, { ...idle, switchTo: 3 });
  assert.equal(w.weapons.weapon.def.key, "m4");
  respawn(w);
  assert.equal(w.weapons.weapon.def.key, "m4");
  w.startRun();
  assert.equal(w.weapons.weapon.def.key, "pistol");
  assert.equal(w.match.freeSelection, false);
});
test("promotion waits until shooting tick ends, refills earned gun and survives death", () => {
  const w = setup();
  w.weapons.weapons[1].mag = 0;
  w.match.recordElimination("operator-1", "blue");
  assert.equal(w.weapons.current, 0);
  w.match.update(1 / 60);
  assert.equal(w.weapons.current, 1);
  assert.equal(w.weapons.weapon.mag, w.weapons.weapon.def.magSize);
  respawn(w);
  assert.equal(w.weapons.current, 1);
  assert.equal(w.match.playerScore, 1);
});
test("human survives five rifle hits; the sixth is lethal; regeneration waits for cover", () => {
  const w = setup();
  w.match.spawnShield = 0;
  for (let i = 0; i < 5; i++) w.onPlayerHit(25, new Vector3());
  assert.equal(w.player.hp, 25);
  assert.equal(w.player.dead, false);
  ticks(w, 260);
  assert.equal(w.player.hp, 25);
  ticks(w, 70);
  assert.ok(w.player.hp > 60 && w.player.hp < 80);
  ticks(w, 180);
  assert.equal(w.player.hp, 150);
  for (let i = 0; i < 6; i++) w.onPlayerHit(25, new Vector3());
  assert.equal(w.player.dead, true);
});
test("spawn selection avoids both proximity and exposed nearby opponents", () => {
  const w = setup();
  const positions = [
    new Vector3(-22, 0, 30),
    new Vector3(22, 0, -30),
    new Vector3(0, 0, 0),
  ];
  w.player.pos.copy(positions[0]);
  w.enemies.list = positions
    .slice(1)
    .map((pos, i) => ({ pos, team: `operator-${i + 1}`, state: "chase" }));
  const seen = new Set();
  for (let i = 0; i < 10; i++) {
    const s = w.match.chooseSpawn("operator-6");
    assert.ok(s);
    seen.add(`${s.x},${s.z}`);
    for (const pos of positions) {
      const distance = Math.hypot(pos.x - s.x, pos.z - s.z);
      assert.ok(distance >= 10);
      if (distance < 18) {
        const origin = new Vector3(s.x, 1.45, s.z),
          dir = pos
            .clone()
            .add(new Vector3(0, 1.35, 0))
            .sub(origin);
        const range = dir.length();
        assert.ok(w.arena.raycast(origin, dir.normalize(), range));
      }
    }
  }
  assert.ok(seen.size > 1, "spawn history should rotate safe pockets");
});
test("unsafe player respawn waits, throttles retries, and recovers without losing stage", () => {
  const w = setup();
  kill(w);
  w.enemies.list = MIDTOWN.spawns.map((s, i) => ({
    pos: new Vector3(s.x, 0, s.z),
    team: `occupied-${i}`,
    state: "chase",
  }));
  w.player.damage(1000);
  w.deadT = 3;
  w.match.update(0.01);
  assert.equal(w.player.dead, true);
  assert.equal(w.match.awaitingSafeSpawn, true);
  w.enemies.clear();
  w.match.update(0.01);
  assert.equal(w.player.dead, true);
  w.match.update(0.26);
  assert.equal(w.player.dead, false);
  assert.equal(w.weapons.current, 1);
});
test("outer lanes cannot sustain a 35-metre standing sightline at any lateral position", () => {
  const w = setup();
  for (const side of [-1, 1])
    for (let x = 18; x <= 26.5; x += 0.25)
      for (let z = -34; z <= 0; z += 1) {
        const origin = new Vector3(side * x, 1.6, z);
        assert.ok(
          w.arena.raycast(origin, new Vector3(0, 0, 1), 35),
          `open lane x=${side * x}, z=${z}`,
        );
      }
});
test("marked steps and decks support the player's feet at their visible top height", () => {
  const w = setup();
  for (const b of MIDTOWN.solids.filter((b) =>
    ["step", "platform"].includes(b.kind),
  )) {
    w.player.reset();
    w.player.pos.set(b.x, b.h + 0.8, b.z);
    w.player.onGround = false;
    ticks(w, 60);
    assert.ok(
      Math.abs(w.player.pos.y - b.h) < 0.01,
      `${b.id} landing: ${w.player.pos.y}`,
    );
    assert.equal(w.player.onGround, true);
  }
});
test("normal jumps can climb each marked step and reach its raised deck", () => {
  const w = setup();
  for (const name of ["theater", "avenue", "plaza"]) {
    const step = MIDTOWN.solids.find((b) => b.id === `${name}-step`);
    const deck = MIDTOWN.solids.find((b) => b.id === `${name}-deck`);
    const direction = Math.sign(deck.z - step.z);
    w.player.reset();
    w.player.pos.set(step.x, 0, step.z - direction * 1.5);
    const input = {
      ...idle,
      move: { x: 0, y: 1 },
      yaw: direction > 0 ? Math.PI : 0,
      pitch: 0,
    };
    ticks(w, 1, { ...input, jump: true });
    ticks(w, 15, input);
    ticks(w, 45);
    assert.ok(
      Math.abs(w.player.pos.y - step.h) < 0.01,
      `${name} step inaccessible`,
    );
    ticks(w, 1, { ...input, jump: true });
    ticks(w, 27, input);
    ticks(w, 45);
    assert.ok(
      Math.abs(w.player.pos.y - deck.h) < 0.01,
      `${name} deck inaccessible at ${w.player.pos.toArray()}`,
    );
  }
});
