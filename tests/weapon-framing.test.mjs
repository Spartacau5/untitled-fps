import assert from "node:assert/strict";
import { test } from "node:test";
import { Box3, PerspectiveCamera, Raycaster, Vector3 } from "three";
import { World } from "../games/onslaught/src/sim/world.js";
import { WeaponView } from "../games/onslaught/src/render/weapon-view.js";
import { buildWeaponModel } from "../games/onslaught/src/render/weapons/index.js";
import { makeRedDotMaterial } from "../games/onslaught/src/render/weapons/kit.js";
import { isScoped } from "../games/onslaught/src/render/weapons/framing.js";

test("sniper and launcher solids remain ahead of near plane through animated poses", () => {
  for (const key of ["sniper", "rocket"]) {
    const w = new World({ noSpawn: true, loadout: [key], startKey: key });
    const cam = new PerspectiveCamera(56, 16 / 9, 0.02, 8);
    const view = new WeaponView(cam, [key]);
    const box = new Box3();
    for (const pose of ["hip", "ads", "sprint", "reload", "kick", "switch"]) {
      w.weapons.adsSmooth = pose === "ads" || pose === "kick" ? 1 : 0;
      w.weapons.sprintBlend = pose === "sprint" ? 1 : 0;
      for (let frame = 0; frame <= 60; frame++) {
        w.weapons.weapon.reload =
          pose === "reload" ? { t: frame / 60, dur: 1 } : null;
        w.weapons.switching =
          pose === "switch"
            ? {
                phase: "down",
                t: (frame / 60) * w.weapons.weapon.def.switchTime * 0.4,
              }
            : null;
        if (pose === "kick") view.kickPos.z = 0.12;
        view.sync(
          w.weapons,
          w.player,
          { dx: Math.sin(frame) * 3, dy: Math.cos(frame) * 3 },
          1 / 60,
          frame / 60,
        );
        view.model.group.traverse((mesh) => {
          if (!mesh.isMesh || !mesh.visible) return;
          for (let parent = mesh; parent; parent = parent.parent)
            if (
              [view.parts.handL, view.parts.handR, view.flash.group].includes(
                parent,
              )
            )
              return;
          box.setFromObject(mesh);
          assert.ok(
            box.max.z <= -0.079,
            `${key} ${pose} frame ${frame}: rear=${box.max.z}`,
          );
        });
      }
    }
  }
});
test("LMG front post aligns with the rear aperture and is visible through it", () => {
  const model = buildWeaponModel("lmg", makeRedDotMaterial());
  model.group.position.copy(model.parts.adsOffset);
  model.group.updateMatrixWorld(true);
  const front = model.parts.frontSight.getWorldPosition(new Vector3());
  assert.ok(Math.abs(front.x) < 0.001 && Math.abs(front.y) < 0.001);
  const ray = new Raycaster(new Vector3(), new Vector3(0, 0, -1), 0.02, 3);
  const hits = ray.intersectObject(model.group, true);
  assert.ok(hits.length);
  assert.equal(
    hits[0].object,
    model.parts.frontSight,
    "receiver or handle obscures front post",
  );
});
test("sniper sight appears only after ADS settles and clears during reload, switch and death", () => {
  const w = new World({ noSpawn: true, loadout: ["sniper"] });
  assert.equal(isScoped(w.weapons, w.player), false);
  w.weapons.adsSmooth = 1;
  assert.equal(isScoped(w.weapons, w.player), true);
  w.weapons.weapon.reload = { t: 0, dur: 1 };
  assert.equal(isScoped(w.weapons, w.player), false);
  w.weapons.weapon.reload = null;
  w.weapons.switching = { phase: "down" };
  assert.equal(isScoped(w.weapons, w.player), false);
  w.weapons.switching = null;
  w.player.dead = true;
  assert.equal(isScoped(w.weapons, w.player), false);
});
