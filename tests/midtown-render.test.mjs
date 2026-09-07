import assert from "node:assert/strict";
import { test } from "node:test";
import { Scene, MeshStandardMaterial, ShaderLib } from "three";
import { MidtownView } from "../games/onslaught/src/render/midtown-view.js";
import { streetMaterial } from "../games/onslaught/src/render/city/surface-materials.js";
import { EnemyView } from "../games/onslaught/src/render/enemy-view.js";
import { World } from "../games/onslaught/src/sim/world.js";

test("beveled and flat street props can share a merged material batch", () => {
  const v = Object.create(MidtownView.prototype);
  v.mats = { paint: new MeshStandardMaterial() };
  v.batches = new Map();
  v.scene = new Scene();
  v._box(2, 2, 3, 0, 1, 0, v.mats.paint);
  v._box(0.05, 2, 3, 3, 1, 0, v.mats.paint);
  v._flush();
  assert.equal(v.scene.children.length, 1);
  assert.ok(
    [...v.scene.children[0].geometry.attributes.position.array].every(
      Number.isFinite,
    ),
  );
});
test("street materials inject metre-scaled height and roughness into standard shaders", () => {
  for (const kind of ["brick", "concrete", "asphalt", "stone", "metal"]) {
    const m = streetMaterial(kind, 0x888888);
    const s = {
      vertexShader: ShaderLib.standard.vertexShader,
      fragmentShader: ShaderLib.standard.fragmentShader,
    };
    m.onBeforeCompile(s);
    assert.match(s.vertexShader, /vStreetPos/);
    assert.match(s.fragmentShader, /surfaceGradient/);
    assert.match(s.fragmentShader, /roughnessFactor=clamp\(streetRough/);
  }
});
test("TDM robot meshes carry team colors and finite rifle poses", () => {
  const w = new World({ mode: "tdm" });
  w.startRun();
  w.match.update(1.5);
  const scene = new Scene(),
    view = new EnemyView(scene, { tactical: true });
  const before = w.hash();
  view.sync(w.enemies, w.projectiles, 1, 0);
  assert.equal(w.hash(), before);
  const body = view.types.runner.meshes.find(
    (m) => m.part.kind === "body",
  ).mesh;
  assert.ok(body.instanceColor);
  assert.notDeepEqual(
    [...body.instanceColor.array.slice(0, 3)],
    [...body.instanceColor.array.slice(6, 9)],
  );
  for (const m of view.types.runner.meshes)
    assert.ok([...m.mesh.instanceMatrix.array].every(Number.isFinite));
});
