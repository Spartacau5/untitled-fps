import assert from "node:assert/strict";
import { test } from "node:test";
import { Scene, MeshStandardMaterial, ShaderLib } from "three";
import { MidtownView } from "../games/onslaught/src/render/midtown-view.js";
import { streetMaterial } from "../games/onslaught/src/render/city/surface-materials.js";
import { EnemyView } from "../games/onslaught/src/render/enemy-view.js";
import { World } from "../games/onslaught/src/sim/world.js";
import {
  OperatorView,
  buildOperatorRig,
} from "../games/onslaught/src/render/operator-view.js";

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
test("street tiles use standard PBR fragments, mipmaps and shared texture storage", () => {
  for (const kind of ["brick", "concrete", "asphalt", "stone", "metal"]) {
    const m = streetMaterial(kind, 0x888888);
    const s = {
      vertexShader: ShaderLib.standard.vertexShader,
      fragmentShader: ShaderLib.standard.fragmentShader,
    };
    m.onBeforeCompile(s);
    assert.match(s.vertexShader, /vMapUv = streetUV/);
    assert.equal(s.fragmentShader, ShaderLib.standard.fragmentShader);
    assert.ok(m.map.generateMipmaps);
    assert.equal(m.map.image.width, 256);
    assert.equal(m.map, streetMaterial(kind, 0x777777).map);
    assert.equal(m.bumpMap, m.roughnessMap);
  }
});
test("walkable street strips cover the map exactly once at collision height", () => {
  const view = Object.create(MidtownView.prototype);
  view.mats = Object.fromEntries(
    [
      "asphalt",
      "floor",
      "limestone",
      "frame",
      "brushed",
      "paint",
      "yellow",
    ].map((name) => [name, new MeshStandardMaterial()]),
  );
  view.batches = new Map();
  view.scene = new Scene();
  view._ground();
  const ground = view.scene.children.filter(
    (mesh) => mesh.name === "midtown-ground",
  );
  assert.equal(ground.length, 5);
  for (let x = -26.75; x < 27; x += 0.5) {
    assert.equal(
      ground.filter(
        (mesh) => x > mesh.userData.span[0] && x < mesh.userData.span[1],
      ).length,
      1,
    );
  }
  for (const mesh of ground) {
    assert.equal(mesh.position.y, 0);
    assert.equal(mesh.geometry.parameters.height, 110);
    assert.equal(mesh.castShadow, false);
    assert.equal(mesh.receiveShadow, true);
  }
});
test("operators share human hitbox metrics and have no emissive robot materials", () => {
  const world = new World({ mode: "ffa" });
  world.startRun();
  world.match.update(1);
  const rig = buildOperatorRig();
  assert.deepEqual(rig.metrics, world.enemies.metrics.runner);
  const view = new OperatorView(new Scene());
  assert.ok(view.parts.length < 50);
  for (const [kind, material] of Object.entries(view.materials))
    if (kind !== "flash") assert.equal(material.emissive.getHex(), 0);
  assert.ok(view.parts.every((part) => part.mesh.instanceColor));
  const hash = world.hash();
  for (const actor of world.enemies.list) {
    actor.reloadT = 1;
    actor.moveBlend = 1;
    actor.vel.set(1, 0, 2);
  }
  view.sync(world.enemies, world.projectiles, 0.5, 0);
  for (const part of view.parts) {
    assert.equal(part.mesh.count, 6);
    assert.ok([...part.mesh.instanceMatrix.array].every(Number.isFinite));
  }
  assert.equal(world.hash(), hash);
  const victim = world.enemies.list[0];
  victim.state = "die";
  victim.t = 0.5;
  victim.toppleX = 1.3;
  view.sync(world.enemies, world.projectiles, 1, 1);
  for (const part of view.parts)
    assert.ok([...part.mesh.instanceMatrix.array].every(Number.isFinite));
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
