import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { ENEMIES } from "../games/onslaught/src/data/enemies.js";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";
import { World } from "../games/onslaught/src/sim/world.js";

const input = (over = {}) => ({
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
const DT = 1 / 60;
const by = (key) => WEAPONS.find((w) => w.key === key);

// Face whichever way has room to sprint into, so a measurement is of the gun
// and not of the nearest barrier.
function clearHeading(w) {
  let best = 0,
    bestDist = -1;
  for (let i = 0; i < 24; i++) {
    const yaw = (i / 24) * Math.PI * 2;
    const hit = w.arena.raycast(
      w.player.camPos,
      new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)),
      45,
    );
    const d = hit ? hit.dist : 45;
    if (d > bestDist) ((bestDist = d), (best = yaw));
  }
  w.player.yaw = best;
  return bestDist;
}

// Top sprint speed actually reached while carrying `key`.
function sprintSpeed(key) {
  const w = new World({ seed: 1, noSpawn: !0, loadout: [key], startKey: key });
  w.startRun();
  clearHeading(w);
  let peak = 0;
  for (let i = 0; i < 90; i++) {
    w.step(DT, input({ move: { x: 0, y: 1 }, sprint: !0 }));
    peak = Math.max(peak, w.player.speed);
  }
  return peak;
}

test("every gun carries a movement multiplier, in the intended order", () => {
  const mult = (k) => by(k).moveMult;
  // Lightest to heaviest, exactly as briefed. Marksman and sniper share a
  // bucket; so do the launcher and the flamethrower.
  assert.ok(mult("pistol") > mult("smg"), "a sidearm beats an SMG");
  assert.ok(mult("smg") > mult("ar"), "an SMG beats a rifle");
  assert.ok(mult("ar") > mult("dmr"), "a rifle beats a marksman");
  assert.ok(mult("dmr") > mult("rocket"), "a marksman beats a launcher");
  assert.equal(mult("dmr"), mult("sniper"), "marksman and sniper share");
  assert.equal(mult("rocket"), mult("flame"), "launcher and flame share");
  // Same-class guns move alike, so picking the M4 over the VK-7 is about the
  // gun and never about a hidden speed tax.
  assert.equal(mult("ar"), mult("m4"));
  assert.equal(mult("smg"), mult("mp5"));
  for (const w of WEAPONS)
    assert.ok(w.moveMult > 0.5 && w.moveMult < 1.5, `${w.key} is off the map`);
});

test("the spread is felt but never punishing", () => {
  const all = WEAPONS.map((w) => w.moveMult);
  const lightest = Math.max(...all),
    heaviest = Math.min(...all);
  // Wide enough to notice.
  assert.ok(lightest / heaviest > 1.1, "no perceptible difference at all");
  // Narrow enough that the heavy guns are still fun to move with. The brief
  // was explicitly fluid over heavy.
  assert.ok(
    lightest / heaviest < 1.25,
    `a ${((lightest / heaviest - 1) * 100).toFixed(0)}% spread is too punishing`,
  );
  // And the rifle sits in the middle, so the game's old pace is the reference
  // rather than the ceiling.
  assert.equal(by("ar").moveMult, 1);
});

test("the weight is felt while hipfiring, which is most of the game", () => {
  // The bug this fixes: moveMult used to live inside the ADS term alone, so
  // every gun moved identically unless you were aiming.
  const light = sprintSpeed("pistol"),
    heavy = sprintSpeed("rocket");
  assert.ok(
    light > heavy + 0.5,
    `pistol ${light.toFixed(2)} vs launcher ${heavy.toFixed(2)} - no difference`,
  );
  assert.ok(
    Math.abs(light / heavy - by("pistol").moveMult / by("rocket").moveMult) <
      0.02,
    "the speeds should track the multipliers",
  );
});

test("no weapon can leave you unable to break away from the swarm", () => {
  // The floor that matters. A launcher that cannot outrun a husk is not a
  // heavy weapon, it is a death sentence.
  const slowest = Math.min(...WEAPONS.map((w) => w.moveMult));
  for (const key of WEAPONS.filter((w) => w.moveMult === slowest).map(
    (w) => w.key,
  )) {
    const speed = sprintSpeed(key);
    assert.ok(
      speed > ENEMIES.runner.speed,
      `${key} sprints at ${speed.toFixed(2)}, slower than a husk's ${ENEMIES.runner.speed}`,
    );
  }
});

test("the slide chain still works with the heaviest gun in the game", () => {
  // The other floor. The slide needs a real run-up, so a weapon heavy enough
  // to drop under that threshold would silently delete the movement tech the
  // whole game is built around.
  for (const key of ["pistol", "ar", "sniper", "rocket", "flame", "lmg"]) {
    const w = new World({
      seed: 1,
      noSpawn: !0,
      loadout: [key],
      startKey: key,
    });
    w.startRun();
    const room = clearHeading(w);
    assert.ok(room > 18, "the harness needs open ground");
    const sprint = () => input({ move: { x: 0, y: 1 }, sprint: !0 });
    for (let i = 0; i < 60; i++) w.step(DT, sprint());
    w.step(DT, { ...sprint(), jump: !0 });
    let slid = !1,
      peak = 0;
    for (let i = 0; i < 150 && !slid; i++) {
      w.step(DT, {
        ...sprint(),
        crouchPressed: i === 8,
        crouch: i >= 8,
      });
      ((peak = Math.max(peak, w.player.speed)),
        (slid = slid || w.player.sliding));
    }
    assert.ok(slid, `${key} could not sprint-jump-slide`);
    assert.ok(peak > 9, `${key} slid at only ${peak.toFixed(1)} m/s`);
  }
});

test("aiming costs the same proportion whatever you hold", () => {
  // The weight is applied to the base speed now, so folding it into the ADS
  // term as well would square it and a sniper would crawl. Two guns three
  // buckets apart must keep the same ratio aimed as they do hipfiring.
  const strafe = (key, ads) => {
    const w = new World({
      seed: 1,
      noSpawn: !0,
      loadout: [key],
      startKey: key,
    });
    w.startRun();
    clearHeading(w);
    // Settled speed, not peak. Sights come up at a different rate on every
    // gun, so a peak taken across the ramp measures how slowly the sight
    // rises rather than how fast the player ends up moving - which read as
    // the launcher being quicker than the pistol.
    for (let i = 0; i < 150; i++)
      w.step(DT, input({ move: { x: 0, y: 1 }, ads }));
    return w.player.speed;
  };
  const hipRatio = strafe("pistol", !1) / strafe("rocket", !1);
  const adsRatio = strafe("pistol", !0) / strafe("rocket", !0);
  assert.ok(
    Math.abs(hipRatio - adsRatio) < 0.05,
    `hip ${hipRatio.toFixed(3)} vs ads ${adsRatio.toFixed(3)} - the weight is being applied twice`,
  );
});
