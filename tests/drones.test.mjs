import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { ENEMIES } from "../games/onslaught/src/data/enemies.js";
import {
  DRONE_WAVE,
  GUNSHIP_WAVE,
  composeWave,
} from "../games/onslaught/src/data/waves.js";
import { RNG } from "../games/onslaught/src/core/rng.js";
import { World } from "../games/onslaught/src/sim/world.js";

const idle = (over = {}) => ({
  move: { x: 0, y: 0 },
  fire: !1,
  fireHeld: !1,
  ads: !1,
  reload: !1,
  sprint: !1,
  jump: !1,
  crouch: !1,
  crouchPressed: !1,
  switchTo: -1,
  swapLast: !1,
  wheel: 0,
  ...over,
});

// A world with one flyer of the given type, dropped in and left to fly.
function airWorld(type, { dist = 24, seed = 7 } = {}) {
  const w = new World({ seed, noSpawn: !0 });
  w.startRun();
  const e = w.enemies.spawn(type, w.arena.gates[0], 1, w);
  e.state = "chase";
  e.pos.set(
    w.player.pos.x,
    w.player.pos.y + e.def.flyHeight,
    w.player.pos.z - dist,
  );
  w.drainEvents();
  return { w, e };
}

const step = (w, n, dt = 1 / 60) => {
  for (let i = 0; i < n; i++) w.step(dt, idle());
};

test("both drone types are flyers with a sphere hitbox, not a skeleton", () => {
  for (const key of ["drone", "missileDrone"]) {
    const d = ENEMIES[key];
    assert.equal(d.fly, true, `${key} should fly`);
    assert.equal(d.proportions, undefined, `${key} has no walking rig`);
    assert.ok(d.flyHeight > 2.5, `${key} must clear the barriers`);
    assert.ok(
      d.coreRadius > 0 && d.coreRadius < d.radius,
      `${key} needs a core inside its shell`,
    );
    assert.ok(d.hp > 0 && d.speed > 0 && d.score > 0);
  }
  // The gunship is the heavier, slower one; that is the whole contrast.
  assert.ok(ENEMIES.missileDrone.hp > ENEMIES.drone.hp);
  assert.ok(ENEMIES.missileDrone.speed < ENEMIES.drone.speed);
  assert.ok(ENEMIES.missileDrone.splashRadius > 0);
  assert.equal(ENEMIES.drone.splashRadius, undefined, "the wasp has no blast");
});

test("a wasp is a target you can actually hit at its own standoff", () => {
  // The hitbox the sim raycasts is radius * scale. The first pass made this
  // 0.34 m - a 0.68 m target at a 16 m standoff, which played as unhittable
  // rather than as hard to lead, so this pins the floor.
  const d = ENEMIES.drone;
  const hit = d.radius * d.scale;
  assert.ok(hit >= 0.5, `wasp hitbox is only ${hit.toFixed(2)}m`);
  // The angle it subtends at the range it holds, which is what a player is
  // actually asked to hit. Below about 3.5 degrees it stops being a fight.
  const subtend = 2 * Math.atan(hit / d.standoff) * (180 / Math.PI);
  assert.ok(
    subtend > 3.5,
    `only ${subtend.toFixed(1)} degrees wide at standoff`,
  );
  // Still the small one: a wasp must never read as a gunship.
  const g = ENEMIES.missileDrone;
  assert.ok(hit < g.radius * g.scale * 0.75, "the two must stay distinct");
});

test("a drone holds altitude instead of walking the ground", () => {
  const { w, e } = airWorld("drone");
  step(w, 180);
  const floor = w.arena.groundHeight(e.pos.x, e.pos.z);
  const height = e.pos.y - floor;
  assert.ok(
    Math.abs(height - e.def.flyHeight) < e.def.bobAmp + 0.5,
    `held ${height.toFixed(2)}m, wanted about ${e.def.flyHeight}`,
  );
  // And it is genuinely above the tallest cover it is meant to ignore.
  assert.ok(e.pos.y > 3.5);
});

test("a drone closes to its standoff and then orbits rather than landing on you", () => {
  const { w, e } = airWorld("drone", { dist: 40 });
  step(w, 420);
  const plan = Math.hypot(e.pos.x - w.player.pos.x, e.pos.z - w.player.pos.z);
  assert.ok(
    plan > e.def.standoff - 9 && plan < e.def.standoff + 12,
    `sat at ${plan.toFixed(1)}m, wanted near ${e.def.standoff}`,
  );
  // Never within melee reach: a flyer you cannot escape has no counterplay.
  assert.ok(plan > 4, `closed to ${plan.toFixed(1)}m`);
});

test("a wasp drone fires bolts that fly flat and hurt on contact", () => {
  const { w } = airWorld("drone", { dist: 14 });
  const before = w.player.hp;
  step(w, 600);
  assert.ok(w.player.hp < before, "it should have landed something");
  // Bolts do not arc: the pool's drop is zero for that kind.
  const bolt = w.projectiles.list.find((p) => p.kind === "bolt");
  if (bolt) assert.equal(bolt.drop, 0);
});

test("a gunship gets a missile away and it reaches the player", () => {
  const w = new World({ seed: 11, noSpawn: !0 });
  w.startRun();
  const g = w.enemies.spawn("missileDrone", w.arena.gates[0], 1, w);
  g.state = "chase";
  g.pos.set(
    w.player.pos.x,
    w.player.pos.y + g.def.flyHeight,
    w.player.pos.z - 16,
  );
  w.drainEvents();
  const playerHp = w.player.hp;
  let launched = !1;
  for (let i = 0; i < 900 && w.player.hp === playerHp; i++) {
    w.step(1 / 60, idle());
    launched ||= w.projectiles.list.some((p) => p.active && p.splash > 0);
  }
  assert.ok(launched, "it should have fired something with a blast on it");
  assert.ok(w.player.hp < playerHp, "and the blast must reach the player");
});

test("a missile blast hurts the player and leaves the swarm untouched", () => {
  const w = new World({ seed: 11, noSpawn: !0 });
  w.startRun();
  const def = ENEMIES.missileDrone;
  // A husk standing in the middle of the blast, closer than the player.
  const husk = w.enemies.spawn("runner", w.arena.gates[0], 1, w);
  husk.state = "chase";
  husk.pos.set(w.player.pos.x + 0.5, w.player.pos.y, w.player.pos.z);
  const huskHp = husk.hp,
    playerHp = w.player.hp;
  w.drainEvents();
  const p = w.projectiles.list[0];
  ((p.active = !1),
    (p.kind = "missile"),
    (p.dmg = def.damage),
    (p.splash = def.splashRadius),
    (p.splashMin = def.splashMin),
    p.pos.set(w.player.pos.x + 0.5, w.player.pos.y + 0.9, w.player.pos.z));
  w.projectiles._detonate(p, w.player, w);
  assert.ok(w.player.hp < playerHp, "the player is what the blast is for");
  // The immunity is deliberate: a gunship that could clear its own wave would
  // be a gift, not a threat.
  assert.equal(husk.hp, huskHp, "the swarm must not be caught in it");
  assert.equal(husk.state, "chase", "and must not be staggered by it either");
});

test("splash damage falls off with distance and misses entirely past the radius", () => {
  const def = ENEMIES.missileDrone;
  const at = (dist) => {
    const w = new World({ seed: 3, noSpawn: !0 });
    w.startRun();
    const p = w.projectiles.list[0];
    ((p.active = !1),
      (p.kind = "missile"),
      (p.dmg = def.damage),
      (p.splash = def.splashRadius),
      (p.splashMin = def.splashMin),
      p.pos.set(w.player.pos.x + dist, w.player.pos.y + 0.9, w.player.pos.z));
    const before = w.player.hp;
    w.projectiles._detonate(p, w.player, w);
    return before - w.player.hp;
  };
  const near = at(0.2),
    mid = at(def.splashRadius * 0.7),
    out = at(def.splashRadius + 1);
  assert.ok(near > 0, "point blank must hurt");
  assert.ok(
    mid > 0 && mid < near,
    "the edge should sting less than the centre",
  );
  assert.equal(out, 0, "past the radius is a clean miss");
});

test("a killed drone falls out of the sky and is cleaned up", () => {
  const { w, e } = airWorld("drone");
  step(w, 60);
  const wasAt = e.pos.y;
  w.enemies.kill(e, new Vector3(0, 0, -1), !1, { kbForce: 2 }, w);
  assert.equal(e.state, "die");
  step(w, 30);
  assert.ok(e.pos.y < wasAt, `stayed up at ${e.pos.y.toFixed(2)}`);
  step(w, 120);
  assert.equal(
    w.enemies.list.includes(e),
    false,
    "the wreck should be gone, not parked in the list",
  );
});

test("a drone can be shot: the shell registers, the core is a headshot", () => {
  const { w, e } = airWorld("drone", { dist: 12 });
  step(w, 10);
  const from = new Vector3(
    w.player.pos.x,
    w.player.pos.y + 1.6,
    w.player.pos.z,
  );
  const core = new Vector3().subVectors(e.pos, from).normalize();
  const hit = w.enemies.raycast(from, core, 240);
  assert.ok(hit, "a ray straight at the hull must connect");
  assert.equal(hit.enemy, e);
  assert.equal(hit.head, true, "dead centre is the core");
  // Aim between the core and the shell, derived from the actual radii and
  // range rather than a constant - the drone has been resized once already,
  // and a hardcoded offset silently stops testing anything when it changes.
  const range = e.pos.distanceTo(from);
  const shellR = e.def.radius * e.scale,
    coreR = e.def.coreRadius * e.scale;
  const lateral = (coreR + shellR) / 2;
  const edge = new Vector3()
    .subVectors(e.pos, from)
    .normalize()
    .addScaledVector(new Vector3(0, 1, 0), lateral / range)
    .normalize();
  const graze = w.enemies.raycast(from, edge, 240);
  assert.ok(graze, "the shell is wider than the core");
  assert.equal(graze.head, false, "outside the core is not a headshot");
  // And past the shell entirely, nothing.
  const miss = new Vector3()
    .subVectors(e.pos, from)
    .normalize()
    .addScaledVector(new Vector3(0, 1, 0), (shellR * 1.6) / range)
    .normalize();
  assert.equal(w.enemies.raycast(from, miss, 240), null, "a clean miss");
});

test("drones join the roster on the waves they are meant to", () => {
  const kinds = (wave) => {
    const q = composeWave(wave, new RNG(wave * 7 + 1)).queue;
    return new Set(q);
  };
  for (let w = 1; w < DRONE_WAVE; w++)
    assert.equal(kinds(w).has("drone"), false, `wave ${w} is too early`);
  assert.equal(kinds(DRONE_WAVE).has("drone"), true);
  for (let w = 1; w < GUNSHIP_WAVE; w++)
    assert.equal(kinds(w).has("missileDrone"), false, `wave ${w} too early`);
  assert.equal(kinds(GUNSHIP_WAVE).has("missileDrone"), true);
  // They stay a minority of the wave, not the wave itself.
  const late = composeWave(20, new RNG(5)).queue;
  const air = late.filter((k) => k === "drone" || k === "missileDrone").length;
  assert.ok(
    air > 0 && air / late.length < 0.15,
    `air was ${air}/${late.length}`,
  );
});

test("wave composition stays deterministic with drones in it", () => {
  const one = composeWave(14, new RNG(99)).queue.join(",");
  const two = composeWave(14, new RNG(99)).queue.join(",");
  assert.equal(one, two);
});
