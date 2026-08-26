// E1: procedural humanoid body for enemies — primitives parented as parts.
// Shared geometry cache (built once), per-enemy materials with seeded jitter (C2).
// Hit proxies: head (2× sphere → H4 one-shot), chest, pelvis, 4 limbs.
// Each hit mesh carries userData {enemy, part:'head'|'chest'|'pelvis'|'limb'}.
import {
  Group, Mesh, Object3D,
  SphereGeometry, BoxGeometry, CylinderGeometry,
  MeshStandardMaterial, MeshBasicMaterial, Color,
} from 'three';
import { rng } from '../core/rng.js';

// Geometry is baked around part pivots: meshes offset so limb groups rotate at
// shoulder/elbow/hip/knee. Body facing axis is -Z (three convention).
const G = {
  head: new SphereGeometry(0.115, 12, 10).scale(1, 1.14, 0.98),
  torso: new BoxGeometry(0.44, 0.55, 0.26),
  pelvis: new BoxGeometry(0.40, 0.24, 0.26),
  upperArm: new BoxGeometry(0.11, 0.30, 0.11),
  foreArm: new BoxGeometry(0.10, 0.28, 0.10),
  hand: new SphereGeometry(0.055, 8, 6),
  thigh: new BoxGeometry(0.15, 0.46, 0.17),
  shin: new BoxGeometry(0.13, 0.42, 0.15),
  foot: new BoxGeometry(0.13, 0.09, 0.27),
  // tactical gear
  vest: new BoxGeometry(0.46, 0.34, 0.30),
  belt: new BoxGeometry(0.42, 0.08, 0.28),
  pack: new BoxGeometry(0.30, 0.26, 0.12),
  // rifle prop (barrel along -Z)
  rBody: new BoxGeometry(0.055, 0.09, 0.42),
  rBarrel: new CylinderGeometry(0.017, 0.017, 0.36, 8).rotateX(Math.PI / 2),
  rMag: new BoxGeometry(0.04, 0.13, 0.07),
  rStock: new BoxGeometry(0.05, 0.09, 0.20),
  rSight: new BoxGeometry(0.02, 0.035, 0.05),
  // pipe (rusher weapon)
  pipe: new CylinderGeometry(0.026, 0.026, 0.62, 8).rotateX(Math.PI / 2),
  pipeTape: new CylinderGeometry(0.031, 0.031, 0.10, 8).rotateX(Math.PI / 2),
  // rusher scarf
  scarfBand: new BoxGeometry(0.26, 0.075, 0.23),
  scarfTail: new BoxGeometry(0.09, 0.26, 0.022),
  // gunner visor dot
  visor: new BoxGeometry(0.10, 0.028, 0.02),
  // heavy armor plates (removable, ≥6 per heavy)
  plateChest: new BoxGeometry(0.19, 0.26, 0.055),
  plateAbd: new BoxGeometry(0.28, 0.16, 0.05),
  plateBack: new BoxGeometry(0.28, 0.30, 0.05),
  plateShoulder: new BoxGeometry(0.15, 0.09, 0.27),
  // hit proxies — invisible render, raycast targets
  hitHead: new SphereGeometry(0.17, 8, 6),
  hitChest: new BoxGeometry(0.54, 0.66, 0.40),
  hitPelvis: new BoxGeometry(0.48, 0.34, 0.34),
  hitArm: new BoxGeometry(0.22, 0.82, 0.24),
  hitLeg: new BoxGeometry(0.27, 0.95, 0.30),
};

// Shared non-rendering proxy material: colorWrite/depthWrite off keeps the mesh
// raycastable while contributing zero pixels (P1: one material for all proxies).
export const PROXY_MAT = new MeshStandardMaterial({
  colorWrite: false, depthWrite: false,
});

function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

function proxy(geo, part, enemy, x = 0, y = 0, z = 0) {
  const m = new Mesh(geo, PROXY_MAT);
  m.position.set(x, y, z);
  m.castShadow = false;
  m.userData = { enemy, part };
  return m;
}

/** Seeded per-enemy material palette: dark fatigues + skin + gear. */
function makeMats(type) {
  const baseHex = rng.pick([0x3a4036, 0x37402f, 0x40382f, 0x363b40, 0x413a30]);
  const base = new Color(baseHex);
  const fat = base.clone().multiplyScalar(rng.range(0.85, 1.15));
  const pant = fat.clone().multiplyScalar(rng.range(0.68, 0.82));
  const gear = fat.clone().multiplyScalar(rng.range(0.45, 0.6));
  const mats = {
    skin: new MeshStandardMaterial({ color: new Color(0xb98a68).multiplyScalar(rng.range(0.85, 1.12)), roughness: 0.72 }),
    cloth: new MeshStandardMaterial({ color: fat, roughness: 0.9 }),
    pants: new MeshStandardMaterial({ color: pant, roughness: 0.92 }),
    gear: new MeshStandardMaterial({ color: gear, roughness: 0.8 }),
    metal: new MeshStandardMaterial({ color: new Color(0x5a5f66).multiplyScalar(rng.range(0.8, 1.1)), roughness: 0.45, metalness: 0.75 }),
  };
  if (type === 'rusher') {
    mats.accent = new MeshStandardMaterial({ color: new Color(0x9e2b22).multiplyScalar(rng.range(0.85, 1.1)), roughness: 0.9 });
    mats.jacket = mats.cloth;
  } else if (type === 'gunner') {
    mats.jacket = new MeshStandardMaterial({ color: pant.clone().multiplyScalar(0.75), roughness: 0.78 });
    mats.visor = new MeshBasicMaterial({ color: 0xff5a3c, toneMapped: false });
  } else {
    // heavy: dark jacket + armour plates in slightly brighter steel
    mats.jacket = new MeshStandardMaterial({ color: new Color(0x2e3238).multiplyScalar(rng.range(0.85, 1.1)), roughness: 0.8 });
    mats.plate = new MeshStandardMaterial({ color: new Color(0x6d737c).multiplyScalar(rng.range(0.9, 1.08)), roughness: 0.4, metalness: 0.8 });
  }
  return mats;
}

/** Attach the rifle prop to the right hand; returns muzzle anchor. */
function buildRifle(hand, mats) {
  const gun = new Group();
  gun.add(mesh(G.rBody, mats.metal, 0, 0.02, -0.10));
  gun.add(mesh(G.rBarrel, mats.metal, 0, 0.02, -0.42));
  gun.add(mesh(G.rMag, mats.gear, 0, -0.08, -0.06));
  gun.add(mesh(G.rStock, mats.gear, 0, -0.005, 0.16));
  gun.add(mesh(G.rSight, mats.gear, 0, 0.075, -0.12));
  const muzzle = new Object3D();
  muzzle.position.set(0, 0.02, -0.60);
  gun.add(muzzle);
  hand.add(gun);
  return muzzle;
}

export function buildBody(enemy, type) {
  const prox = [];                           // hit proxies (for dead-body filtering)
  const mats = makeMats(type);
  const root = new Group();                 // origin at feet, rotation.y = facing
  const hips = new Object3D(); hips.position.y = 0.92; root.add(hips);
  const spine = new Object3D(); spine.position.y = 0.12; hips.add(spine);   // waist lean pivot
  const pelvisMesh = mesh(G.pelvis, mats.pants, 0, -0.02, 0); hips.add(pelvisMesh);
  const belt = mesh(G.belt, mats.gear, 0, 0.10, 0); hips.add(belt);
  const torso = mesh(G.torso, type === 'rusher' ? mats.cloth : mats.jacket, 0, 0.275, 0); spine.add(torso);
  const vest = mesh(G.vest, mats.gear, 0, 0.33, 0.02); spine.add(vest);
  const pack = mesh(G.pack, mats.gear, 0, 0.34, -0.19); spine.add(pack);

  // ---- arms: shoulder → upperArm, elbow → forearm+hand -------------------
  const arm = (side) => {                   // side: -1 left, +1 right
    const shoulder = new Object3D();
    shoulder.position.set(side * 0.275, 0.50, 0);
    shoulder.rotation.z = side * 0.07;
    spine.add(shoulder);
    shoulder.add(mesh(G.upperArm, mats.cloth, 0, -0.15, 0));
    const elbow = new Object3D(); elbow.position.y = -0.30; shoulder.add(elbow);
    elbow.add(mesh(G.foreArm, mats.cloth, 0, -0.14, 0));
    const hand = new Object3D(); hand.position.y = -0.28; elbow.add(hand);
    hand.add(mesh(G.hand, mats.skin, 0, -0.02, 0));
    return { shoulder, elbow, hand };
  };
  const armL = arm(-1);
  const armR = arm(1);

  // ---- legs: hip → thigh, knee → shin, ankle → foot ----------------------
  const leg = (side) => {
    const hip = new Object3D();
    hip.position.set(side * 0.11, -0.04, 0);
    hips.add(hip);
    hip.add(mesh(G.thigh, mats.pants, 0, -0.23, 0));
    const knee = new Object3D(); knee.position.y = -0.46; hip.add(knee);
    knee.add(mesh(G.shin, mats.pants, 0, -0.21, 0));
    const ankle = new Object3D(); ankle.position.y = -0.42; knee.add(ankle);
    const foot = mesh(G.foot, mats.gear, 0, -0.02, -0.06); ankle.add(foot);
    return { hip, knee, ankle };
  };
  const legL = leg(-1);
  const legR = leg(1);

  // ---- head ---------------------------------------------------------------
  const neck = new Object3D(); neck.position.y = 0.585; spine.add(neck);
  const head = new Object3D(); neck.add(head);
  head.add(mesh(G.head, mats.skin, 0, 0.115, 0));

  // ---- hit proxies (children of bones so flinch moves the hitbox) ---------
  const px = (geo, part, bone, x, y, z) => {
    const m = proxy(geo, part, enemy, x, y, z);
    bone.add(m);
    prox.push(m);
    return m;
  };
  px(G.hitHead, 'head', neck, 0, 0.115, 0);
  px(G.hitChest, 'chest', spine, 0, 0.30, 0);
  px(G.hitPelvis, 'pelvis', hips, 0, -0.02, 0);
  px(G.hitArm, 'limb', armL.shoulder, 0, -0.28, 0);
  px(G.hitArm, 'limb', armR.shoulder, 0, -0.28, 0);
  px(G.hitLeg, 'limb', legL.hip, 0, -0.45, 0);
  px(G.hitLeg, 'limb', legR.hip, 0, -0.45, 0);

  const body = {
    root, hips, spine, torso, vest, pack, neck, head,
    armL, armR, legL, legR, mats, type,
    muzzle: null, pipe: null, scarfTail: null, plates: [], hitMeshes: prox,
  };

  // ---- type personality ----------------------------------------------------
  if (type === 'rusher') {
    // forward-leaning run pose, red scarf, pipe in hand, no gun
    const band = mesh(G.scarfBand, mats.accent, 0, 0.565, 0); spine.add(band);
    const tail = mesh(G.scarfTail, mats.accent, 0.05, 0.44, 0.115);
    spine.add(tail); body.scarfTail = tail;
    const pipe = mesh(G.pipe, mats.metal, 0, -0.05, -0.20);
    pipe.rotation.x = 0.5;
    armR.hand.add(pipe);
    armR.hand.add(mesh(G.pipeTape, mats.gear, 0, -0.04, -0.05));
    body.pipe = pipe;
  } else if (type === 'gunner') {
    // rifle held, upright alert pose, emissive visor dot
    body.muzzle = buildRifle(armR.hand, mats);
    const visor = new Mesh(G.visor, mats.visor);
    visor.position.set(0, 0.125, -0.105);
    visor.castShadow = false;
    head.add(visor);
    body.visor = visor;
  } else {
    // heavy: bulkier, shoulder plates + chest/abdomen/back armour
    root.scale.setScalar(1.18);
    const P = (geo, mat, x, y, z, rx, ry, rz, bone) => {
      const m = mesh(geo, mat, x, y, z);
      m.rotation.set(rx || 0, ry || 0, rz || 0);
      m.userData = { enemy, part: 'chest', plate: true };
      bone.add(m);
      body.plates.push({ mesh: m, hits: 0, alive: true });
      return m;
    };
    const pm = mats.plate;
    P(G.plateChest, pm, -0.105, 0.34, -0.165, 0, 0.06, 0.05, spine);
    P(G.plateChest, pm, 0.105, 0.34, -0.165, 0, -0.06, -0.05, spine);
    P(G.plateAbd, pm, 0, 0.13, -0.16, 0, 0, 0, spine);
    P(G.plateBack, pm, 0, 0.33, 0.165, 0, 0, 0, spine);
    P(G.plateShoulder, pm, -0.30, 0.50, 0, 0, 0, 0.22, spine);
    P(G.plateShoulder, pm, 0.30, 0.50, 0, 0, 0, -0.22, spine);
    body.muzzle = buildRifle(armR.hand, mats);
  }
  return body;
}

/** Reset all pose bones to neutral (pool reuse). */
export function resetPose(body) {
  const { root, hips, spine, neck, armL, armR, legL, legR } = body;
  root.rotation.set(0, 0, 0);                            // clear ragdoll tumble
  hips.rotation.set(0, 0, 0); hips.position.set(0, 0.92, 0);
  spine.rotation.set(0, 0, 0);
  neck.rotation.set(0, 0, 0);
  armL.shoulder.rotation.set(0, 0, -0.07); armL.elbow.rotation.set(0, 0, 0);
  armR.shoulder.rotation.set(0, 0, 0.07); armR.elbow.rotation.set(0, 0, 0);
  armL.hand.rotation.set(0, 0, 0); armR.hand.rotation.set(0, 0, 0);
  legL.hip.rotation.set(0, 0, 0); legL.knee.rotation.set(0, 0, 0);
  legR.hip.rotation.set(0, 0, 0); legR.knee.rotation.set(0, 0, 0);
  for (const p of body.plates) { p.hits = 0; p.alive = true; p.mesh.visible = true; }
}
