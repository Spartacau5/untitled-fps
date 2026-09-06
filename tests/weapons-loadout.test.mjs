import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import {
  DEFAULT_LOADOUT,
  DEFAULT_START,
  WEAPONS,
} from "../games/onslaught/src/data/weapons.js";
import { resolveLoadout } from "../games/onslaught/src/sim/weapons.js";
import { World } from "../games/onslaught/src/sim/world.js";

const keys = (w) => w.weapons.weapons.map((s) => s.def.key);

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

test("every weapon carries the fields the sim reads", () => {
  for (const w of WEAPONS) {
    assert.ok(w.key && w.name && w.class, `${w.key} is missing a name`);
    assert.ok(
      w.slot === "primary" || w.slot === "sidearm",
      `${w.key} has no valid slot`,
    );
    assert.equal(typeof w.unlockLevel, "number", `${w.key} unlockLevel`);
    assert.ok(w.rpm > 0 && w.damage > 0, `${w.key} does no damage`);
    assert.ok(w.magSize > 0 && w.reserve > 0, `${w.key} has no ammo`);
    // Cone weapons trace no ray, so they need a cone instead of a falloff-only
    // profile; everything else must declare an action for the between-shots
    // animation to key off.
    if (w.fire === "cone")
      assert.ok(w.coneRange > 0 && w.coneAngle > 0, `${w.key} has no cone`);
    else
      assert.ok(
        ["eject", "pump", "bolt", "none"].includes(w.action),
        `${w.key} has an unknown action "${w.action}"`,
      );
  }
});

test("weapon keys are unique", () => {
  const seen = new Set();
  for (const w of WEAPONS) {
    assert.ok(!seen.has(w.key), `duplicate weapon key ${w.key}`);
    seen.add(w.key);
  }
});

test("the default loadout carries every gun, each on its own key", () => {
  const picked = resolveLoadout(DEFAULT_LOADOUT);
  assert.equal(picked.length, WEAPONS.length);
  // Key order is the table order, and must be stable: a gun that moves keys
  // between builds breaks the player's muscle memory.
  assert.deepEqual(
    picked.map((w) => w.key),
    WEAPONS.map((w) => w.key),
  );
});

test("the starting weapon selects a slot without reordering the keys", () => {
  const w = new World({ seed: 1, startKey: "sniper" });
  w.startRun();
  assert.equal(w.weapons.weapon.def.key, "sniper");
  // Every other gun is still where it was.
  assert.deepEqual(keys(w), WEAPONS.map((x) => x.key));
});

test("an unknown or missing start weapon falls back to the first slot", () => {
  for (const bad of [null, "nonsense", undefined]) {
    const w = new World({ seed: 1, startKey: bad });
    w.startRun();
    assert.equal(w.weapons.startIndex, 0);
    assert.equal(w.weapons.weapon.def.key, DEFAULT_LOADOUT[0]);
  }
  assert.ok(WEAPONS.some((x) => x.key === DEFAULT_START));
});

test("resolveLoadout drops unknown keys and never leaves you empty-handed", () => {
  assert.deepEqual(
    resolveLoadout(["sniper", "nonsense", "pistol"]).map((w) => w.key),
    ["sniper", "pistol"],
  );
  for (const bad of [null, [], ["nonsense"], undefined])
    assert.deepEqual(
      resolveLoadout(bad).map((w) => w.key),
      DEFAULT_LOADOUT,
    );
});

test("a world carries exactly the loadout it was given, in slot order", () => {
  const w = new World({ seed: 1, loadout: ["lmg", "pistol"] });
  w.startRun();
  assert.deepEqual(keys(w), ["lmg", "pistol"]);
  assert.equal(w.weapons.weapon.def.key, "lmg");
});

test("setLoadout swaps the carried guns between runs", () => {
  const w = new World({ seed: 1 });
  w.startRun();
  w.setLoadout(["flame", "pistol"]);
  w.startRun();
  assert.deepEqual(keys(w), ["flame", "pistol"]);
});

test("the weapon wheel wraps around any loadout size", () => {
  for (const size of [1, 2, 3, WEAPONS.length]) {
    const w = new World({
      seed: 1,
      loadout: DEFAULT_LOADOUT.slice(0, size),
    });
    w.startRun();
    const seen = [];
    for (let i = 0; i < size * 2; i++) {
      w.weapons.switching = null;
      w.weapons.update(1 / 60, idle({ wheel: 1 }), w.player, 0, w);
      // A switch runs down-then-up; finish it so the next tick can start one.
      for (let t = 0; t < 120 && w.weapons.switching; t++)
        w.weapons.updateSwitch(1 / 60, w);
      seen.push(w.weapons.current);
    }
    // Scrolling forward visits every slot and comes back round.
    assert.deepEqual(seen.slice(0, size).sort(), [...Array(size).keys()]);
    assert.deepEqual(seen.slice(0, size), seen.slice(size));
  }
});

test("a slot key past the end of the loadout is ignored", () => {
  const w = new World({ seed: 1, loadout: ["ar", "pistol"] });
  w.startRun();
  w.weapons.update(1 / 60, idle({ switchTo: 5 }), w.player, 0, w);
  assert.equal(w.weapons.switching, null, "slot 3 should not start a switch");
  assert.equal(w.weapons.current, 0);
});

// --- flamethrower cone -----------------------------------------------------

// Drops an enemy at a fixed offset from the player and aims the camera down
// -Z, which is the player's default facing after reset().
function coneWorld(offset) {
  const w = new World({ seed: 5, loadout: ["flame", "pistol"], noSpawn: !0 });
  w.startRun();
  const gate = w.arena.gates[0];
  const e = w.enemies.spawn("runner", gate, 1, w);
  e.state = "chase";
  e.pos.set(
    w.player.pos.x + offset.x,
    w.player.pos.y + offset.y,
    w.player.pos.z + offset.z,
  );
  w.drainEvents();
  return { w, e };
}

const AIM = new Vector3(0, 0, -1);

test("the cone burns what is in front of it", () => {
  const { w, e } = coneWorld({ x: 0, y: 0, z: -4 });
  const before = e.hp;
  w.fireCone(w.player.camPos, AIM, w.weapons.weapon.def);
  assert.ok(e.hp < before, "an enemy 4 m dead ahead should take damage");
});

test("the cone does not reach behind you or past its range", () => {
  for (const off of [
    { x: 0, y: 0, z: 4 }, // directly behind
    { x: 0, y: 0, z: -40 }, // far beyond coneRange
    { x: 9, y: 0, z: -1 }, // wide of the cone
  ]) {
    const { w, e } = coneWorld(off);
    const before = e.hp;
    w.fireCone(w.player.camPos, AIM, w.weapons.weapon.def);
    assert.equal(e.hp, before, `should have missed ${JSON.stringify(off)}`);
  }
});

test("the cone falls off with distance", () => {
  const near = coneWorld({ x: 0, y: 0, z: -2 }),
    far = coneWorld({ x: 0, y: 0, z: -9 });
  const def = near.w.weapons.weapon.def;
  const dmg = (c) => {
    const before = c.e.hp;
    c.w.fireCone(c.w.player.camPos, AIM, def);
    return before - c.e.hp;
  };
  const a = dmg(near),
    b = dmg(far);
  assert.ok(a > 0 && b > 0, "both should burn");
  assert.ok(b < a, "the far target should take less");
});

test("the cone hits several enemies at once and is deterministic", () => {
  const build = () => {
    const w = new World({
      seed: 5,
      loadout: ["flame", "pistol"],
      noSpawn: !0,
    });
    w.startRun();
    const gate = w.arena.gates[0];
    for (const dx of [-1, 0, 1]) {
      const e = w.enemies.spawn("runner", gate, 1, w);
      e.state = "chase";
      e.pos.set(w.player.pos.x + dx, w.player.pos.y, w.player.pos.z - 5);
    }
    w.drainEvents();
    w.fireCone(w.player.camPos, AIM, w.weapons.weapon.def);
    return w.enemies.list.map((e) => e.hp.toFixed(4)).join(",");
  };
  const first = build();
  assert.equal(first.split(",").length, 3);
  assert.ok(
    first.split(",").every((hp) => +hp < 72),
    "all three should be burning",
  );
  assert.equal(first, build(), "same inputs, same damage");
});
