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
  SphereGeometry,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { lerpAngle } from "../core/mathx.js";
import { ENEMIES } from "../data/enemies.js";
import { rigMetrics } from "../sim/enemies.js";

const CAPACITY = 12; // Six living operators plus their fading corpse generation.
const HIDDEN = new Matrix4().makeScale(0, 0, 0);
const PALETTE = [
  0x727464, 0x737b7b, 0x958672, 0x657064, 0x7d776d, 0x69747c,
].map((c) => new Color(c));

// Original procedural stand-in, explicitly not a photogrammetry or mocap asset.
// Human proportion skeleton, cloth sleeves/trousers, carrier, skin, helmet and
// shouldered rifle. Each bone/material batch is instanced across all six bots.
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
    kinds.get(kind).push(geometry.toNonIndexed());
    geometry.dispose();
  };
  const box = (node, kind, w, h, d, x, y, z) =>
    add(node, kind, new BoxGeometry(w, h, d).translate(x, y, z));
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
  box(torso, "kit", 0.36, 0.35, 0.09, 0, 0.27, -0.145);
  box(torso, "kit", 0.32, 0.32, 0.085, 0, 0.27, 0.145);
  for (const side of [-1, 1]) {
    box(torso, "kit", 0.065, 0.25, 0.3, side * 0.14, 0.4, 0);
    box(hips, "dark", 0.19, 0.055, 0.3, side * 0.1, 0.04, 0);
    box(torso, "kit", 0.095, 0.16, 0.08, side * 0.105, 0.18, -0.225);
    box(hips, "kit", 0.095, 0.16, 0.12, side * 0.21, -0.05, 0.015);
    box(torso, "dark", 0.045, 0.13, 0.04, side * 0.13, 0.34, -0.209);
  }
  oval(neck, "skin", 0, p.head * 0.55, 0, 0.107, 0.139, 0.108);
  oval(neck, "dark", 0, 0.083, -0.055, 0.099, 0.072, 0.075); // balaclava
  oval(neck, "kit", 0, 0.22, 0.008, 0.136, 0.089, 0.139);
  box(neck, "dark", 0.2, 0.035, 0.018, 0, 0.157, -0.108); // eye protection
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
  for (const foot of [ankL, ankR])
    oval(foot, "dark", 0, 0.08, -0.046, 0.081, 0.08, 0.142);
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
      kit: material(0x777263, 0.91),
      dark: material(0x353632, 0.83),
      skin: material(0xb58b73, 0.78),
      weapon: material(0x555854, 0.56, 0.3),
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
        mesh.setColorAt(
          i,
          part.kind === "cloth" ? PALETTE[i % 6] : OperatorView.white,
        );
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
        Math.abs(Math.sin(phase)) * 0.018 * move -
        fall * 0.65;
      rig.hips.rotation.set(
        dying ? actor.toppleX : 0,
        0,
        dying ? actor.toppleZ : Math.sin(phase) * 0.015 * move,
      );
      rig.torso.rotation.set(
        Math.min(0.18, Math.max(-0.18, actor.aimPitch || 0)),
        0,
        0,
      );
      rig.neck.rotation.set(
        0,
        actor.targetId == null ? Math.sin(phase * 0.3) * 0.12 : 0,
        0,
      );
      // Stride follows distance, with bent swing knee and level planted boot.
      const forward =
        -Math.sin(actor.yaw) * actor.vel.x - Math.cos(actor.yaw) * actor.vel.z;
      const side =
        Math.cos(actor.yaw) * actor.vel.x - Math.sin(actor.yaw) * actor.vel.z;
      for (const [leg, knee, foot, sign] of [
        [rig.legL, rig.knL, rig.ankL, 1],
        [rig.legR, rig.knR, rig.ankR, -1],
      ]) {
        const swing = Math.sin(phase) * sign;
        leg.rotation.set(
          dying ? 0.12 : swing * 0.43 * move * Math.sign(forward || 1),
          0,
          dying ? sign * 0.1 : swing * side * 0.055,
        );
        knee.rotation.x = dying ? -0.23 : -Math.max(0, swing) * 0.75 * move;
        foot.rotation.x = dying ? 0 : -leg.rotation.x - knee.rotation.x;
      }
      const recoil = (actor.shotFlash || 0) * 0.7,
        reload = actor.reloadT > 0;
      rig.shR.rotation.set(0.6 + recoil, 0, -0.2);
      rig.elR.rotation.set(1.05, 0, 0);
      rig.shL.rotation.set(reload ? 0.3 : 1.0 + recoil, 0, 0.3);
      rig.elL.rotation.set(
        reload ? 1.4 + Math.sin(actor.reloadT * 6) * 0.15 : 0.7,
        0,
        0,
      );
      if (dying) {
        rig.shL.rotation.x = 0.2;
        rig.shR.rotation.x = 0.3;
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
        if (part.kind === "cloth")
          part.mesh.setColorAt(index, PALETTE[actor.slot % 6]);
      }
      index++;
    }
    for (const part of this.parts) {
      part.mesh.count = index;
      part.mesh.instanceMatrix.needsUpdate = true;
      if (part.kind === "cloth") part.mesh.instanceColor.needsUpdate = true;
    }
  }
  static white = new Color(0xffffff);
}
