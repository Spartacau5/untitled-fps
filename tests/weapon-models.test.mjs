import assert from "node:assert/strict";
import { test } from "node:test";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";
import {
  buildWeaponModel,
  hasWeaponModel,
} from "../games/onslaught/src/render/weapons/index.js";
import { makeRedDotMaterial } from "../games/onslaught/src/render/weapons/kit.js";

// The gun builders are pure Three.js object graphs -- no DOM, no WebGL -- so
// the whole viewmodel contract can be checked headlessly. Every one of these
// caught something during the build.

const lens = makeRedDotMaterial();
const models = WEAPONS.map((w) => [w, buildWeaponModel(w.key, lens)]);

test("every weapon in the table has a viewmodel", () => {
  for (const w of WEAPONS)
    assert.ok(hasWeaponModel(w.key), `${w.key} has no builder`);
});

test("every model provides the anchors the viewmodel drives", () => {
  for (const [w, { group, parts }] of models) {
    assert.ok(group.children.length > 4, `${w.key} is nearly empty`);
    for (const anchor of ["muzzle", "eject", "sight"])
      assert.ok(parts[anchor], `${w.key} has no ${anchor}`);
    for (const vec of ["adsOffset", "hipOffset", "hipRot"])
      assert.ok(parts[vec], `${w.key} has no ${vec}`);
    for (const hand of ["handR", "handL", "handLRest"])
      assert.ok(parts[hand], `${w.key} has no ${hand}`);
  }
});

// The bug this exists to prevent: the sniper's scope sat 0.10 m BEHIND the
// camera at full ADS, so aiming showed the inside of the tube. The three
// original guns all land their aiming point a quarter-metre in front.
test("aiming puts the sight in front of the camera, not behind it", () => {
  for (const [w, { parts }] of models) {
    const z = parts.sight.position.z + parts.adsOffset.z;
    assert.ok(
      z < -0.15 && z > -0.42,
      `${w.key} aims at z=${z.toFixed(3)}; expected between -0.15 and -0.42`,
    );
  }
});

test("aiming centres the sight on the screen axis", () => {
  for (const [w, { parts }] of models) {
    const x = parts.sight.position.x + parts.adsOffset.x,
      y = parts.sight.position.y + parts.adsOffset.y;
    assert.ok(Math.abs(x) < 0.01, `${w.key} aims off-centre in x: ${x}`);
    assert.ok(Math.abs(y) < 0.01, `${w.key} aims off-centre in y: ${y}`);
  }
});

test("the hip pose holds the gun down and to the right, in front", () => {
  for (const [w, { parts }] of models) {
    const h = parts.hipOffset;
    assert.ok(h.x > 0.05 && h.x < 0.3, `${w.key} hip x=${h.x}`);
    assert.ok(h.y < 0 && h.y > -0.35, `${w.key} hip y=${h.y}`);
    assert.ok(h.z < -0.15 && h.z > -0.7, `${w.key} hip z=${h.z}`);
  }
});

test("the muzzle is ahead of the sight, and inside the camera's far plane", () => {
  for (const [w, { parts }] of models) {
    assert.ok(
      parts.muzzle.position.z < parts.sight.position.z,
      `${w.key}'s muzzle is not in front of its sight`,
    );
    // The weapon camera's far plane is 8 m; anything beyond would clip.
    const reach = Math.abs(parts.muzzle.position.z + parts.hipOffset.z);
    assert.ok(reach < 8, `${w.key} reaches ${reach} m`);
  }
});

test("moving parts declare the rest and travel the animation needs", () => {
  for (const [w, { parts }] of models) {
    if (parts.bolt) {
      assert.equal(typeof parts.boltRest, "number", `${w.key} boltRest`);
      assert.ok(parts.boltTravel > 0, `${w.key} boltTravel`);
    }
    if (parts.pump) {
      assert.equal(typeof parts.pumpRest, "number", `${w.key} pumpRest`);
      assert.ok(parts.pumpTravel > 0, `${w.key} pumpTravel`);
    }
    // The magazine animation reads magRest unconditionally, so a gun with a
    // mag must have one.
    if (parts.mag) assert.ok(parts.magRest, `${w.key} has a mag but no magRest`);
  }
});

test("weapons that reload by magazine have a magazine to drop", () => {
  for (const [w, { parts }] of models)
    if (w.reload !== "shells")
      assert.ok(parts.mag, `${w.key} reloads by mag but has no mag part`);
});

test("guns that cycle an action have a part to move", () => {
  for (const [w, { parts }] of models) {
    if (w.action === "pump") assert.ok(parts.pump, `${w.key} has no pump`);
    if (w.action === "bolt") assert.ok(parts.bolt, `${w.key} has no bolt`);
  }
});

test("no geometry lands at a non-finite position", () => {
  for (const [w, { group }] of models)
    group.traverse((o) => {
      const { x, y, z } = o.position;
      assert.ok(
        Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z),
        `${w.key} has a part at a non-finite position`,
      );
    });
});
