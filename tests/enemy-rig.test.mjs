import assert from "node:assert/strict";
import { test } from "node:test";
import { Quaternion, Vector3 } from "three";
import { ENEMIES } from "../games/onslaught/src/data/enemies.js";
import {
  buildEnemyRig,
  EnemyView,
} from "../games/onslaught/src/render/enemy-view.js";
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

// Hinge limits. An elbow folds forward and a knee folds backward, and with
// front = -Z on a rig whose limbs hang down that means elbow.rotation.x >= 0
// and knee.rotation.x <= 0 -- always, for every blend of walk, idle, charge
// and attack. Getting these backwards is what put the robots' hands behind
// their backs, so pin them: sync() is pure Object3D work and runs headless
// against a stub scene.
test("elbows and knees only fold the way a joint can fold", () => {
  const view = new EnemyView({ add() {} });
  const projectiles = { list: [] };
  const base = (type) => ({
    id: 1,
    type,
    def: ENEMIES[type],
    scale: 1,
    squash: 0,
    pos: new Vector3(),
    prevPos: new Vector3(),
    vel: new Vector3(),
    yaw: 0,
    prevYaw: 0,
    phase: 0,
    moveBlend: 1,
    attackLean: 0,
    state: "chase",
    t: 0,
    flash: 0,
    dissolve: 0,
    headless: false,
    toppleX: 0,
    toppleZ: 0,
  });
  for (const k of types) {
    const def = ENEMIES[k];
    for (let i = 0; i <= 24; i++) {
      const cases = [
        { phase: (i / 24) * Math.PI * 2 },
        { phase: (i / 24) * Math.PI * 2, moveBlend: 0 },
        {
          state: "attack",
          moveBlend: 0.2,
          t: (i / 24) * (def.windup + def.swing),
          attackLean: -0.3 + (i / 24) * 0.85,
        },
        {
          vel: new Vector3(0, 0, -(def.chargeSpeed || def.speed)),
          attackLean: -0.15,
        },
      ];
      for (const over of cases) {
        const e = Object.assign(base(k), over);
        view.sync({ list: [e] }, projectiles, 1, i * 0.13);
        const n = view.types[k].rig.n;
        for (const j of ["elL", "elR"])
          assert.ok(
            n[j].rotation.x >= 0,
            `${k} ${j} hyperextended to ${n[j].rotation.x.toFixed(2)}`,
          );
        for (const j of ["knL", "knR"])
          assert.ok(
            n[j].rotation.x <= 0,
            `${k} ${j} hyperextended to ${n[j].rotation.x.toFixed(2)}`,
          );
      }
    }
  }
});

// The whole complaint was "why are the hands at the back of the body". A unit
// flagged armsForward reaches: both wrists stay in front of its own shoulders
// for the entire walk cycle.
test("an armsForward unit keeps its hands in front of its shoulders", () => {
  const reachers = types.filter((k) => ENEMIES[k].proportions.armsForward);
  assert.ok(reachers.length, "no armsForward type to check");
  const view = new EnemyView({ add() {} });
  for (const k of reachers) {
    const p = ENEMIES[k].proportions;
    for (let i = 0; i < 12; i++) {
      view.sync(
        {
          list: [
            {
              id: 1,
              type: k,
              def: ENEMIES[k],
              scale: 1,
              squash: 0,
              pos: new Vector3(),
              prevPos: new Vector3(),
              vel: new Vector3(),
              yaw: 0,
              prevYaw: 0,
              phase: (i / 12) * Math.PI * 2,
              moveBlend: 1,
              attackLean: 0,
              state: "chase",
              t: 0,
              flash: 0,
              dissolve: 0,
              headless: false,
              toppleX: 0,
              toppleZ: 0,
            },
          ],
        },
        { list: [] },
        1,
        0,
      );
      const n = view.types[k].rig.n;
      for (const [sh, el] of [
        ["shL", "elL"],
        ["shR", "elR"],
      ]) {
        const wrist = n[el].localToWorld(new Vector3(0, -p.armLL, 0));
        const shoulder = n[sh].getWorldPosition(new Vector3());
        assert.ok(
          wrist.z < shoulder.z,
          `${k} ${el} wrist is ${(wrist.z - shoulder.z).toFixed(2)} behind the shoulder (front is -Z)`,
        );
      }
    }
  }
});
