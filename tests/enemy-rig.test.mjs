import assert from "node:assert/strict";
import { test } from "node:test";
import { Quaternion, Vector3 } from "three";
import { ENEMIES } from "../games/onslaught/src/data/enemies.js";
import { buildEnemyRig } from "../games/onslaught/src/render/enemy-view.js";
import { rigMetrics } from "../games/onslaught/src/sim/enemies.js";

// The rig is plain Three.js Object3Ds, so it can be posed and measured
// headlessly. What matters here is that presentation changes stay
// presentation: data/enemies.js `proportions` is shared with the sim's
// rigMetrics(), which is where hitboxes come from.

const types = Object.keys(ENEMIES);
const rigs = Object.fromEntries(
  types.map((k) => [k, buildEnemyRig(ENEMIES[k].proportions)]),
);

test("every rig exposes the nodes sync() poses", () => {
  for (const k of types) {
    const n = rigs[k].n;
    for (const node of [
      "hips",
      "torso",
      "neck",
      "shL",
      "shR",
      "elL",
      "elR",
      "legL",
      "legR",
      "knL",
      "knR",
      "ankL",
      "ankR",
    ])
      assert.ok(n[node], `${k} rig has no ${node}`);
  }
});

test("the rig reports the same metrics the sim derives hitboxes from", () => {
  for (const k of types) {
    const fromSim = rigMetrics(ENEMIES[k].proportions);
    for (const key of Object.keys(fromSim))
      assert.equal(
        rigs[k][key],
        fromSim[key],
        `${k}.${key} drifted from the sim`,
      );
  }
});

// The ankle joint was added by moving the foot geometry off the knee node and
// onto a new node beneath it. At rest that must be a no-op: if it is not, the
// robots' feet have silently moved relative to the ground they stand on.
test("adding the ankle joint did not move the feet at rest", () => {
  for (const k of types) {
    const rig = rigs[k],
      p = ENEMIES[k].proportions;
    rig.root.updateMatrixWorld(true);
    const knee = new Vector3(),
      ankle = new Vector3();
    rig.n.knL.getWorldPosition(knee);
    rig.n.ankL.getWorldPosition(ankle);
    // Before the refactor the foot was baked into the knee node at
    // y = -legLL - 0.01. It is now baked at y = -0.01 on an ankle node one
    // shin below the knee, which puts it in exactly the same place -- as long
    // as the ankle sits precisely one shin down.
    assert.ok(
      Math.abs(knee.y - ankle.y - p.legLL) < 1e-9,
      `${k}: ankle is ${(knee.y - ankle.y).toFixed(4)} below the knee, expected ${p.legLL}`,
    );
  }
});

test("a levelled ankle keeps the foot flatter than the shin it hangs from", () => {
  const rig = rigs.runner,
    n = rig.n;
  // Mid-stride: swing the leg forward and bend the knee, then apply the same
  // levelling sync() uses.
  const leg = 0.8,
    knee = 0.5;
  n.legL.rotation.x = leg;
  n.knL.rotation.x = knee;
  n.ankL.rotation.x = -(leg + knee) * 0.72;
  rig.root.updateMatrixWorld(true);
  // World pitch of the foot vs the shin: down-axis of each node.
  const down = new Vector3(0, -1, 0);
  const shinDir = down
    .clone()
    .applyQuaternion(n.knL.getWorldQuaternion(new Quaternion()));
  const footDir = down
    .clone()
    .applyQuaternion(n.ankL.getWorldQuaternion(new Quaternion()));
  assert.ok(
    Math.abs(footDir.z) < Math.abs(shinDir.z),
    "the foot should be pitched less than the shin, not more",
  );
});
