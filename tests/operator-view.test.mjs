import assert from "node:assert/strict";
import { test } from "node:test";
import { Quaternion, Scene, Vector3 } from "three";
import { OperatorView } from "../games/onslaught/src/render/operator-view.js";
import {
  makeLeftHand,
  makeRightHand,
  VIEWMODEL_MATS,
} from "../games/onslaught/src/render/weapons/kit.js";

const actor = () => ({
  id: 1,
  type: "runner",
  slot: 0,
  pos: new Vector3(),
  prevPos: new Vector3(),
  vel: new Vector3(0, 0, -4),
  yaw: 0,
  prevYaw: 0,
  moveBlend: 1,
  phase: 0,
  state: "chase",
  t: 0,
  shotFlash: 0,
  reloadT: 0,
  toppleX: 0.7,
  toppleZ: 0.3,
});

test("operator stance ankles stay grounded and boots level through forward/backward/strafe cycles", () => {
  const view = new OperatorView(new Scene()),
    a = actor();
  for (const velocity of [
    [0, 0, -4],
    [0, 0, 4],
    [4, 0, 0],
    [-3, 0, -3],
  ]) {
    a.vel.set(...velocity);
    for (let frame = 0; frame <= 64; frame++) {
      a.phase = (frame / 64) * Math.PI * 2;
      view.sync({ list: [a] }, null, 1);
      for (const [foot, sign] of [
        [view.rig.ankL, 1],
        [view.rig.ankR, -1],
      ]) {
        const height = foot.getWorldPosition(new Vector3()).y;
        assert.ok(height >= -0.002, `boot penetrates the floor: ${height}`);
        if (Math.sin(a.phase) * sign <= 0)
          assert.ok(Math.abs(height) < 0.002, `stance boot floats: ${height}`);
        const up = new Vector3(0, 1, 0).applyQuaternion(
          foot.getWorldQuaternion(new Quaternion()),
        );
        assert.ok(up.y > 0.999, "grounded boot tilts with the shin");
      }
    }
  }
});

test("operator grip endpoints follow the rifle through aim, recoil and reload", () => {
  const view = new OperatorView(new Scene()),
    a = actor();
  for (let frame = 0; frame <= 32; frame++) {
    a.phase = frame * 0.2;
    a.aimPitch = Math.sin(frame) * 0.18;
    a.shotFlash = frame % 2 ? 0.06 : 0;
    a.reloadT = frame > 16 ? (frame - 16) * 0.08 : 0;
    view.sync({ list: [a] }, null, 1);
    const reload = a.reloadT > 0;
    for (const [joint, grip] of [
      [view.rig.elR, [0, -0.11, 0.073]],
      [
        view.rig.elL,
        [
          0,
          reload ? -0.18 + Math.sin(a.reloadT * 6) * 0.035 : -0.02,
          reload ? -0.015 : -0.17,
        ],
      ],
    ]) {
      const hand = joint.localToWorld(new Vector3(0, -0.365, 0));
      const target = view.rig.rifle.localToWorld(new Vector3(...grip));
      assert.ok(
        hand.distanceTo(target) < 0.002,
        "hand loses contact with its grip",
      );
    }
  }
});

test("operator palettes do not multiply dark material tints and batches stay bounded", () => {
  const scene = new Scene(),
    view = new OperatorView(scene);
  const actors = Array.from({ length: 14 }, (_, i) => ({
    ...actor(),
    slot: i,
    id: i,
  }));
  actors[1].state = "die";
  actors[1].t = 1;
  view.sync({ list: actors }, null, 1);
  assert.ok(view.parts.length <= 26);
  assert.ok(
    view.parts.reduce(
      (n, p) => n + p.geometry.attributes.position.count / 3,
      0,
    ) < 7500,
  );
  for (const part of view.parts) {
    assert.equal(part.mesh.count, 12);
    if (part.kind !== "flash") {
      assert.equal(part.mesh.material.color.getHex(), 0xffffff);
      assert.equal(part.mesh.material.vertexColors, false);
    }
    assert.ok([...part.mesh.instanceMatrix.array].every(Number.isFinite));
  }
});

test("sculpted viewmodel hands use three static batches and standard material programs", () => {
  for (const build of [makeLeftHand, makeRightHand]) {
    const hand = build([0.03, -0.1, -0.2]);
    assert.equal(hand.children.length, 3);
    for (const mesh of hand.children) {
      assert.ok(mesh.isMesh);
      assert.ok(
        [...mesh.geometry.attributes.position.array].every(Number.isFinite),
      );
    }
  }
  for (const material of Object.values(VIEWMODEL_MATS))
    assert.equal(material.isMeshPhysicalMaterial, undefined);
});
