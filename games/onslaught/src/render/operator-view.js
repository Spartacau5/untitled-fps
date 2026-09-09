import {
  BoxGeometry,
  CapsuleGeometry,
  Color,
  CylinderGeometry,
  DynamicDrawUsage,
  InstancedMesh,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Matrix4,
  Object3D,
  Quaternion,
  SphereGeometry,
  Vector3,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { lerpAngle } from "../core/mathx.js";
import { ENEMIES } from "../data/enemies.js";
import { rigMetrics } from "../sim/enemies.js";

const CAPACITY = 12; // Six living operators plus their fading corpse generation.
const HIDDEN = new Matrix4().makeScale(0, 0, 0);
const PALETTE = [
  0x727464, 0x737b7b, 0x958672, 0x657064, 0x7d776d, 0x69747c,
].map((c) => new Color(c));
// A small authored wardrobe palette gives the six free-for-all operators a
// readable silhouette without team-colour outlines or expensive unique meshes.
// Instance colours keep this at one draw per rig part.
const KIT_PALETTE = [
  0x5e625f, 0x6b6256, 0x4f5a56, 0x756b5e, 0x555b63, 0x68645c,
].map((c) => new Color(c));
const DARK_PALETTE = [
  0x202427, 0x252728, 0x1d2427, 0x2a2926, 0x20242b, 0x282725,
].map((c) => new Color(c));
const SKIN_PALETTE = [
  0xa6755f, 0xc08d70, 0x8f604d, 0xb68167, 0xd09b7b, 0x9f6d58,
].map((c) => new Color(c));
const WEAPON_PALETTE = [
  0x464b49, 0x4c4a45, 0x3d4746, 0x514b44, 0x42474e, 0x4a4742,
].map((c) => new Color(c));

// Two-bone reach in the joint parent's space. Reused temporaries keep six
// operators' grip/foot constraints allocation-free during the frame loop.
const down = new Vector3(0, -1, 0),
  reach = new Vector3(),
  bend = new Vector3(),
  elbow = new Vector3(),
  lower = new Vector3(),
  boneRotation = new Quaternion(),
  targetPoint = new Vector3(),
  pole = new Vector3();
function reachJoint(
  upper,
  hinge,
  target,
  upperLength,
  lowerLength,
  bendToward,
) {
  reach.copy(target).sub(upper.position);
  const distance = Math.max(
    0.001,
    Math.min(reach.length(), upperLength + lowerLength - 0.0001),
  );
  reach.normalize();
  const along =
    (upperLength ** 2 - lowerLength ** 2 + distance ** 2) / (2 * distance);
  bend
    .copy(bendToward)
    .addScaledVector(reach, -bendToward.dot(reach))
    .normalize();
  elbow
    .copy(reach)
    .multiplyScalar(along)
    .addScaledVector(
      bend,
      Math.sqrt(Math.max(0, upperLength ** 2 - along ** 2)),
    );
  upper.quaternion.setFromUnitVectors(down, lower.copy(elbow).normalize());
  lower.copy(reach).multiplyScalar(distance).sub(elbow).normalize();
  boneRotation.setFromUnitVectors(down, lower);
  hinge.quaternion.copy(upper.quaternion).invert().multiply(boneRotation);
}

// Authored operator rig: human proportion skeleton, cloth sleeves/trousers,
// carrier, skin, helmet and shouldered rifle. Each bone/material batch is
// instanced across all six bots so visual fidelity does not multiply draw cost.
export function buildOperatorRig() {
  const p = ENEMIES.runner.proportions,
    metrics = rigMetrics(p);
  const joint = (parent, x, y, z) => {
    const node = new Object3D();
    node.position.set(x, y, z);
    parent.add(node);
    return node;
  };
  const root = new Object3D(),
    hips = joint(root, 0, metrics.hipH, 0);
  const torso = joint(hips, 0, p.hips[1] * 0.45, 0);
  const neck = joint(torso, 0, p.torso[1] + 0.02, 0);
  const shL = joint(torso, -p.shoulder, p.torso[1] - 0.06, 0);
  const shR = joint(torso, p.shoulder, p.torso[1] - 0.06, 0);
  const elL = joint(shL, 0, -p.armUL, 0),
    elR = joint(shR, 0, -p.armUL, 0);
  const legL = joint(hips, -0.105, -0.06, 0),
    legR = joint(hips, 0.105, -0.06, 0);
  const knL = joint(legL, 0, -p.legUL, 0),
    knR = joint(legR, 0, -p.legUL, 0);
  const ankL = joint(knL, 0, -p.legLL, 0),
    ankR = joint(knR, 0, -p.legLL, 0);
  const groups = new Map();
  const add = (node, kind, geometry) => {
    if (!groups.has(node)) groups.set(node, new Map());
    const kinds = groups.get(node);
    if (!kinds.has(kind)) kinds.set(kind, []);
    kinds
      .get(kind)
      .push(geometry.index ? geometry.toNonIndexed() : geometry.clone());
    geometry.dispose();
  };
  const box = (node, kind, w, h, d, x, y, z, bevel = 0) =>
    add(
      node,
      kind,
      (bevel
        ? new RoundedBoxGeometry(w, h, d, 1, bevel)
        : new BoxGeometry(w, h, d)
      ).translate(x, y, z),
    );
  const oval = (node, kind, x, y, z, sx, sy, sz) =>
    add(
      node,
      kind,
      new SphereGeometry(1, 10, 8).scale(sx, sy, sz).translate(x, y, z),
    );
  const limb = (node, length, radius, lower = false) => {
    add(
      node,
      "cloth",
      new CapsuleGeometry(
        radius,
        Math.max(0.01, length - radius * 2),
        3,
        8,
      ).translate(0, -length / 2, 0),
    );
    // Soft fold at elbow/knee, not an exposed mechanical joint.
    oval(
      node,
      "cloth",
      0,
      lower ? -0.1 : -length + 0.06,
      0,
      radius * 1.05,
      radius * 0.65,
      radius * 1.04,
    );
  };
  oval(hips, "cloth", 0, 0, 0, 0.185, 0.14, 0.125);
  oval(torso, "cloth", 0, 0.24, 0, 0.225, 0.26, 0.145);
  box(torso, "kit", 0.36, 0.35, 0.09, 0, 0.27, -0.145, 0.022);
  box(torso, "kit", 0.32, 0.32, 0.085, 0, 0.27, 0.145, 0.025);
  // Sewn webbing and pouch lids break up the carrier's broad surfaces while
  // remaining merged into the same torso/material instance batches.
  for (let row = 0; row < 3; row++)
    box(torso, "kit", 0.29, 0.017, 0.012, 0, 0.27 + row * 0.045, -0.196);
  for (const side of [-1, 1]) {
    box(torso, "kit", 0.065, 0.25, 0.3, side * 0.14, 0.4, 0);
    box(hips, "dark", 0.19, 0.055, 0.3, side * 0.1, 0.04, 0);
    box(torso, "kit", 0.095, 0.16, 0.08, side * 0.105, 0.18, -0.225, 0.009);
    box(torso, "kit", 0.1, 0.035, 0.018, side * 0.105, 0.25, -0.267, 0.004);
    box(hips, "kit", 0.095, 0.16, 0.12, side * 0.21, -0.05, 0.015, 0.013);
    box(torso, "dark", 0.045, 0.13, 0.04, side * 0.13, 0.34, -0.209);
    box(torso, "dark", 0.04, 0.022, 0.014, side * 0.14, 0.435, -0.156);
  }
  oval(neck, "skin", 0, 0.025, 0, 0.061, 0.055, 0.063);
  oval(neck, "skin", 0, p.head * 0.55, 0, 0.107, 0.139, 0.108);
  oval(neck, "skin", 0, 0.143, -0.104, 0.022, 0.027, 0.022);
  oval(neck, "dark", 0, 0.083, -0.055, 0.099, 0.072, 0.075); // balaclava
  oval(neck, "kit", 0, 0.22, 0.008, 0.136, 0.089, 0.139);
  box(neck, "dark", 0.2, 0.035, 0.018, 0, 0.157, -0.108); // eye protection
  box(neck, "kit", 0.041, 0.04, 0.018, 0, 0.241, -0.117, 0.005); // helmet mount
  box(neck, "dark", 0.012, 0.016, 0.108, -0.115, 0.09, -0.06); // headset boom
  for (const side of [-1, 1])
    oval(neck, "dark", side * 0.121, 0.139, 0.006, 0.023, 0.05, 0.04);
  for (const arm of [shL, shR]) limb(arm, p.armUL, 0.073);
  for (const arm of [elL, elR]) {
    limb(arm, p.armLL, 0.062, true);
    oval(arm, "dark", 0, -p.armLL - 0.025, -0.008, 0.046, 0.068, 0.045);
  }
  for (const leg of [legL, legR]) limb(leg, p.legUL, 0.095);
  for (const knee of [knL, knR]) {
    limb(knee, p.legLL, 0.071, true);
    oval(knee, "kit", 0, -0.07, -0.07, 0.066, 0.088, 0.028);
  }
  for (const foot of [ankL, ankR]) {
    oval(foot, "dark", 0, 0.08, -0.046, 0.081, 0.08, 0.142);
    box(foot, "dark", 0.146, 0.026, 0.235, 0, 0.017, -0.047, 0.012);
    box(foot, "dark", 0.072, 0.09, 0.023, 0, 0.13, -0.081, 0.008);
  }
  const rifle = joint(torso, 0.075, 0.3, -0.39);
  box(rifle, "weapon", 0.055, 0.09, 0.25, 0, 0, 0);
  box(rifle, "dark", 0.053, 0.085, 0.22, 0, -0.01, 0.2);
  box(rifle, "weapon", 0.048, 0.067, 0.24, 0, 0.004, -0.245);
  box(rifle, "dark", 0.041, 0.15, 0.065, 0, -0.1, -0.015);
  box(rifle, "dark", 0.04, 0.1, 0.055, 0, -0.085, 0.073);
  const barrel = new CylinderGeometry(0.011, 0.011, 0.16, 8);
  barrel.rotateX(Math.PI / 2);
  barrel.translate(0, 0.013, -0.44);
  add(rifle, "weapon", barrel);
  box(rifle, "dark", 0.055, 0.038, 0.065, 0, 0.065, 0.01);
  for (let rib = 0; rib < 5; rib++) {
    box(rifle, "weapon", 0.052, 0.009, 0.016, 0, 0.043, -0.14 - rib * 0.04);
    box(rifle, "dark", 0.051, 0.018, 0.022, 0, 0.002, -0.15 - rib * 0.04);
  }
  oval(rifle, "flash", 0, 0.013, -0.54, 0.026, 0.022, 0.075);
  const parts = [];
  for (const [node, kinds] of groups)
    for (const [kind, geometries] of kinds) {
      const geometry = mergeGeometries(geometries, false);
      for (const g of geometries) g.dispose();
      parts.push({ node, kind, geometry });
    }
  return {
    root,
    hips,
    torso,
    neck,
    shL,
    shR,
    elL,
    elR,
    legL,
    legR,
    knL,
    knR,
    ankL,
    ankR,
    rifle,
    parts,
    metrics,
  };
}

export class OperatorView {
  constructor(scene) {
    this.rig = buildOperatorRig();
    const material = (color, roughness, metalness = 0) =>
      new MeshStandardMaterial({ color, roughness, metalness });
    this.materials = {
      cloth: material(0xffffff, 0.96),
      kit: material(0xffffff, 0.91),
      dark: material(0xffffff, 0.83),
      skin: material(0xffffff, 0.78),
      weapon: material(0xffffff, 0.56, 0.3),
      flash: new MeshBasicMaterial({ color: 0xffe6b5 }),
    };
    this.parts = this.rig.parts.map((part) => {
      const mesh = new InstancedMesh(
        part.geometry,
        this.materials[part.kind],
        CAPACITY,
      );
      mesh.instanceMatrix.setUsage(DynamicDrawUsage);
      mesh.frustumCulled = false;
      mesh.count = 0;
      mesh.castShadow = mesh.receiveShadow = part.kind !== "flash";
      // Allocate the shader's instancing-color variant before warmup, not on spawn.
      for (let i = 0; i < CAPACITY; i++)
        mesh.setColorAt(i, OperatorView.partColor(part.kind, i));
      scene.add(mesh);
      return { ...part, mesh };
    });
  }
  setShadows(enabled) {
    for (const part of this.parts)
      part.mesh.castShadow = enabled && part.kind !== "flash";
  }
  prepareWarmup() {
    this.rig.root.updateMatrixWorld(true);
    for (const part of this.parts) {
      part.mesh.setMatrixAt(0, part.node.matrixWorld);
      part.mesh.instanceMatrix.needsUpdate = true;
      part.mesh.count = 1;
    }
  }
  finishWarmup() {
    for (const part of this.parts) part.mesh.count = 0;
  }
  sync(enemies, projectiles, alpha) {
    const rig = this.rig;
    let index = 0;
    for (const actor of enemies.list) {
      if (index >= CAPACITY || actor.type !== "runner") continue;
      const move = actor.moveBlend,
        phase = actor.phase,
        dying = actor.state === "die";
      const fall = dying ? Math.min(1, actor.t / 0.65) : 0;
      rig.root.position.lerpVectors(actor.prevPos, actor.pos, alpha);
      rig.root.rotation.set(0, lerpAngle(actor.prevYaw, actor.yaw, alpha), 0);
      rig.hips.position.y =
        rig.metrics.hipH -
        (0.045 + Math.abs(Math.sin(phase)) * 0.008) * move -
        fall * 0.65;
      rig.hips.rotation.set(
        dying ? actor.toppleX : 0,
        0,
        dying ? actor.toppleZ : Math.sin(phase) * 0.015 * move,
      );
      // Stride follows distance, with bent swing knee and a small human lean.
      const forward =
          -Math.sin(actor.yaw) * actor.vel.x -
          Math.cos(actor.yaw) * actor.vel.z,
        side =
          Math.cos(actor.yaw) * actor.vel.x - Math.sin(actor.yaw) * actor.vel.z;
      const target =
        actor.targetId == null
          ? null
          : enemies.list.find((candidate) => candidate.id === actor.targetId);
      const lookYaw = target
        ? Math.atan2(
            -(target.pos.x - actor.pos.x),
            -(target.pos.z - actor.pos.z),
          )
        : actor.yaw;
      const lookDelta = Math.atan2(
        Math.sin(lookYaw - actor.yaw),
        Math.cos(lookYaw - actor.yaw),
      );
      const strideLean = Math.max(-0.08, Math.min(0.08, forward * 0.018));
      rig.torso.rotation.set(
        Math.min(0.18, Math.max(-0.18, actor.aimPitch || 0)) + strideLean,
        Math.max(-0.07, Math.min(0.07, side * -0.012)),
        Math.max(-0.05, Math.min(0.05, side * 0.018)),
      );
      rig.neck.rotation.set(
        0,
        target
          ? Math.max(-0.28, Math.min(0.28, lookDelta))
          : Math.sin(phase * 0.3) * 0.12,
        0,
      );
      // Drive ankles along a ground-level stance and raised recovery arc.
      // Solving back to the hips keeps the stance foot grounded while knees
      // bend, including backward and lateral movement.
      const speed = Math.hypot(forward, side);
      const forwardRatio = speed > 0.1 ? forward / speed : 1;
      const sideRatio = speed > 0.1 ? side / speed : 0;
      for (const [leg, knee, foot, sign] of [
        [rig.legL, rig.knL, rig.ankL, 1],
        [rig.legR, rig.knR, rig.ankR, -1],
      ]) {
        if (dying) {
          leg.rotation.set(0.12, 0, sign * 0.1);
          knee.rotation.set(-0.23, 0, 0);
          foot.rotation.set(0, 0, 0);
          continue;
        }
        const swing = Math.sin(phase) * sign;
        const travel = Math.cos(phase) * sign * 0.22 * move;
        targetPoint.set(
          leg.position.x - sideRatio * travel,
          -rig.hips.position.y + Math.max(0, swing) ** 1.4 * 0.105 * move,
          forwardRatio * travel,
        );
        // Target is specified in root space, so remove pelvis sway before IK.
        targetPoint.applyQuaternion(
          boneRotation.copy(rig.hips.quaternion).invert(),
        );
        reachJoint(
          leg,
          knee,
          targetPoint,
          ENEMIES.runner.proportions.legUL,
          ENEMIES.runner.proportions.legLL,
          pole.set(sign * 0.1, 0, -1),
        );
        foot.quaternion
          .copy(rig.hips.quaternion)
          .multiply(leg.quaternion)
          .multiply(knee.quaternion)
          .invert();
      }
      const recoil = (actor.shotFlash || 0) * 0.7,
        reload = actor.reloadT > 0;
      rig.rifle.rotation.set(-recoil * 0.1, 0, reload ? -0.16 : 0);
      rig.rifle.position.z = -0.39 + recoil * 0.035;
      rig.rifle.updateMatrix();
      targetPoint.set(0, -0.11, 0.073).applyMatrix4(rig.rifle.matrix);
      reachJoint(
        rig.shR,
        rig.elR,
        targetPoint,
        ENEMIES.runner.proportions.armUL,
        ENEMIES.runner.proportions.armLL + 0.025,
        pole.set(1, -1, 0),
      );
      // The support hand moves to the magazine during reload, then rejoins
      // the fore-end; the trigger hand follows the receiver through recoil.
      targetPoint
        .set(
          0,
          reload ? -0.18 + Math.sin(actor.reloadT * 6) * 0.035 : -0.02,
          reload ? -0.015 : -0.17,
        )
        .applyMatrix4(rig.rifle.matrix);
      reachJoint(
        rig.shL,
        rig.elL,
        targetPoint,
        ENEMIES.runner.proportions.armUL,
        ENEMIES.runner.proportions.armLL + 0.025,
        pole.set(-1, -1, 0),
      );
      if (dying) {
        rig.shL.rotation.set(0.2, 0, 0.3);
        rig.shR.rotation.set(0.3, 0, -0.2);
        rig.elL.rotation.set(0.7, 0, 0);
        rig.elR.rotation.set(0.7, 0, 0);
      }
      // Corpses collapse, then sink over their final half-second, no robot dissolve.
      if (dying) rig.root.position.y -= Math.max(0, actor.t - 1.5) * 0.8;
      rig.root.updateMatrixWorld(true);
      for (const part of this.parts) {
        part.mesh.setMatrixAt(
          index,
          part.kind === "flash" && (!(actor.shotFlash > 0) || dying)
            ? HIDDEN
            : part.node.matrixWorld,
        );
        part.mesh.setColorAt(
          index,
          OperatorView.partColor(part.kind, actor.slot),
        );
      }
      index++;
    }
    for (const part of this.parts) {
      part.mesh.count = index;
      part.mesh.instanceMatrix.needsUpdate = true;
      part.mesh.instanceColor.needsUpdate = true;
    }
  }
  static white = new Color(0xffffff);
  static partColor(kind, slot = 0) {
    const i = Math.abs(slot | 0) % 6;
    if (kind === "cloth") return PALETTE[i];
    if (kind === "kit") return KIT_PALETTE[i];
    if (kind === "dark") return DARK_PALETTE[i];
    if (kind === "skin") return SKIN_PALETTE[i];
    if (kind === "weapon") return WEAPON_PALETTE[i];
    return OperatorView.white;
  }
}
