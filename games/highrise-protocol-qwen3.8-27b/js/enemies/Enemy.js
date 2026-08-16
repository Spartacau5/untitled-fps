import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { CFG } from '../core/Config.js';
import { rng } from '../core/PRNG.js';
import { Spring } from '../core/Spring.js';
import { clamp, damp } from '../core/Easing.js';
import { makeFabric, makeCamo, makeMetalPanel } from '../engine/Textures.js';

// E1/H: detailed tactical humanoids with a walk cycle. Flinch on hit (H3),
// physical ragdoll deaths (H5), heavy armor plates that fly off (E1).
//
// Anatomy: this.group (origin at feet, yaw = facing, bob/flinch offset,
// scalar scale = spawn ramp + flinch pulse)
//   └─ this.model (static pivot, holds the 6 ragdoll part groups)
//        ├─ torso  (Group @ hip 0.98) — capsule, tactical vest, pouches, pack
//        ├─ head   (Group @ 1.60)    — neck, masked face, helmet, visor
//        ├─ armL/armR (Group @ shoulder 1.45) — upper arm, elbow, forearm, hand
//        └─ legL/legR (Group @ hip 0.97) — thigh, knee + shin sub-group (knee bend)
// Front of the body is LOCAL +Z (the group's +Z faces the player via yaw).
//
// Materials & geometry are module-level caches — zero per-enemy allocation
// of GPU resources (26 enemies share the same buffers).
const STATS = CFG.enemy;

// ---- per-type look (silhouettes that read at distance, backlit sunset) ----
const LOOK = {
  rusher: {
    camo: ['#33362c', '#25281f', '#413d30', '#1d201b'],
    gear: '#26292e',
    width: 0.92, torsoW: 1.0,        // slim
    helmet: false, backpack: false, weapon: 'pipe',
    visor: 0xff3020, visorPos: [0, 0.055, 0.128],
    hunch: 0.10, armL: -0.25, armR: -0.35, armSwing: 0.35,
  },
  gunner: {
    camo: ['#4a4a3a', '#2e3230', '#5a5344', '#39402f'],
    gear: '#31353b',
    width: 1.0, torsoW: 1.06,
    helmet: true, backpack: true, weapon: 'rifle',
    visor: 0x40a0ff, visorPos: [0, 0.045, 0.148],
    hunch: 0.02, armL: -0.8, armR: -0.9, armSwing: 0.1,
  },
  heavy: {
    camo: ['#45484e', '#313439', '#565a61', '#26282d'],
    gear: '#3c4046',
    width: 1.12, torsoW: 1.24,       // wide
    helmet: true, big: true, backpack: true, weapon: 'rifle',
    visor: 0x40a0ff, visorPos: [0, 0.05, 0.168],
    hunch: 0.03, armL: -0.7, armR: -0.78, armSwing: 0.1,
  },
};

// ---- module-level caches ----
const _matCache = new Map();
const _geoCache = new Map();

function _mat(type, role) {
  const k = type + ':' + role;
  let m = _matCache.get(k);
  if (m) return m;
  const L = LOOK[type];
  switch (role) {
    case 'uniform':
      m = new THREE.MeshStandardMaterial({ map: makeCamo(L.camo), color: 0xffffff, roughness: 0.85, metalness: 0.0 });
      break;
    case 'gear':
      m = new THREE.MeshStandardMaterial({ map: makeFabric(L.gear), color: 0xd8dce2, roughness: 0.75, metalness: 0.05 });
      break;
    case 'skin': // masked face
      m = new THREE.MeshStandardMaterial({ map: makeFabric('#1e2126'), color: 0x9aa0a8, roughness: 0.8, metalness: 0.0 });
      break;
    case 'helmet':
      m = new THREE.MeshStandardMaterial({ map: makeMetalPanel(L.big ? '#5a616b' : '#454b54'), color: 0xffffff, roughness: 0.5, metalness: 0.6 });
      break;
    case 'metal': // weapons
      m = new THREE.MeshStandardMaterial({ map: makeMetalPanel('#4a4f57'), color: 0xffffff, roughness: 0.45, metalness: 0.75 });
      break;
    case 'plate':
      m = new THREE.MeshStandardMaterial({ map: makeMetalPanel('#9aa4b0'), color: 0xffffff, roughness: 0.3, metalness: 0.9 });
      break;
    case 'visor':
      m = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, emissive: new THREE.Color(L.visor), emissiveIntensity: 1.5, roughness: 0.4, metalness: 0.2 });
      break;
  }
  _matCache.set(k, m);
  return m;
}

function _geo(key, build) {
  let e = _geoCache.get(key);
  if (!e) { e = build(); _geoCache.set(key, e); }
  return e;
}

// ---- geometry builders (transformed primitives → one merged geometry) ----
function _gBox(a, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (rx) g.rotateX(rx);
  if (ry) g.rotateY(ry);
  if (rz) g.rotateZ(rz);
  g.translate(x, y, z);
  a.push(g);
}
function _gCyl(a, rt, rb, len, x, y, z, rx = 0, ry = 0, rz = 0, seg = 10) {
  const g = new THREE.CylinderGeometry(rt, rb, len, seg);
  if (rz) g.rotateZ(rz);
  if (ry) g.rotateY(ry);
  if (rx) g.rotateX(rx);
  g.translate(x, y, z);
  a.push(g);
}
function _gCap(a, r, len, x, y, z, rx = 0) {
  const g = new THREE.CapsuleGeometry(r, len, 4, 10);
  if (rx) g.rotateX(rx);
  g.translate(x, y, z);
  a.push(g);
}
function _gSph(a, r, x, y, z, ws = 10, hs = 8) {
  const g = new THREE.SphereGeometry(r, ws, hs);
  g.translate(x, y, z);
  a.push(g);
}
function _merge(arr) {
  const g = mergeGeometries(arr, false);
  for (const x of arr) x.dispose();
  return g;
}

// leg: thigh/knee (mesh 1) + shin&boot (mesh 2, pivots at knee). Uniform camo
// throughout (camo boots read better than flat black at distance).
function _legGeo(type) {
  return _geo('leg:' + type, () => {
    const w = LOOK[type].width;
    const thigh = [], lower = [];
    _gCap(thigh, 0.09 * w + 0.015, 0.26, 0, -0.22, 0);          // thigh
    _gSph(thigh, 0.075 * w + 0.012, 0, -0.44, 0.015);           // knee
    _gCap(lower, 0.075 * w + 0.005, 0.22, 0, -0.18, 0);         // shin
    _gBox(lower, 0.14, 0.1, 0.2, 0, -0.44, 0.04);               // boot body
    _gBox(lower, 0.14, 0.07, 0.09, 0, -0.465, 0.15);            // toe
    _gBox(lower, 0.15, 0.035, 0.22, 0, -0.365, 0.04);           // cuff
    return { thigh: _merge(thigh), lower: _merge(lower) };
  });
}

// torso: uniform capsule + shoulders | gear vest, pouches, straps, belt, pack
function _torsoGeo(type) {
  return _geo('torso:' + type, () => {
    const L = LOOK[type], tw = L.torsoW;
    const uniform = [], gear = [];
    _gCap(uniform, 0.2 * tw + 0.02, 0.3, 0, 0.3, 0);            // torso
    _gSph(uniform, 0.085 * tw + 0.012, 0.26 * tw, 0.47, 0);     // shoulder L
    _gSph(uniform, 0.085 * tw + 0.012, -0.26 * tw, 0.47, 0);    // shoulder R
    _gCyl(uniform, 0.06, 0.07, 0.09, 0, 0.57, 0);               // neck
    // tactical vest (front = +z)
    _gBox(gear, 0.44 * tw, 0.42, 0.32, 0, 0.32, 0.015);
    _gBox(gear, 0.15, 0.13, 0.05, 0.11 * tw, 0.42, 0.175);      // chest panels
    _gBox(gear, 0.15, 0.13, 0.05, -0.11 * tw, 0.42, 0.175);
    for (const px of [-0.13, 0, 0.13])                          // mag pouches
      _gBox(gear, 0.1, 0.12, 0.06, px * tw, 0.2, 0.19);
    _gBox(gear, 0.09, 0.26, 0.05, 0.15 * tw, 0.42, 0.15, 0, 0, 0.12);   // straps
    _gBox(gear, 0.09, 0.26, 0.05, -0.15 * tw, 0.42, 0.15, 0, 0, -0.12);
    _gBox(gear, 0.4 * tw, 0.07, 0.3, 0, 0.06, 0);               // belt
    _gBox(gear, 0.06, 0.14, 0.1, 0.24 * tw, 0.2, 0);            // side rigs
    _gBox(gear, 0.06, 0.14, 0.1, -0.24 * tw, 0.2, 0);
    if (L.backpack) {
      _gBox(gear, 0.3, 0.36, 0.13, 0, 0.32, -0.21);
      _gBox(gear, 0.08, 0.14, 0.06, 0.1, 0.24, -0.3);
      _gBox(gear, 0.08, 0.14, 0.06, -0.1, 0.24, -0.3);
    }
    return { uniform: _merge(uniform), gear: _merge(gear) };
  });
}

// head: neck + masked face (+ mask band for helmetless rusher) | helmet gear
function _headGeo(type) {
  return _geo('head:' + type, () => {
    const L = LOOK[type];
    const head = [], gear = [];
    _gCyl(head, 0.055, 0.065, 0.1, 0, -0.03, 0);                // neck
    _gSph(head, 0.125, 0, 0.07, 0, 12, 10);                     // head
    _gBox(head, 0.14, 0.07, 0.1, 0, 0.0, 0.05);                 // jaw
    if (L.helmet) {
      const r = L.big ? 0.165 : 0.145;
      const dome = new THREE.SphereGeometry(r, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55);
      dome.translate(0, 0.07, 0);
      gear.push(dome);
      _gBox(gear, r * 1.8, 0.02, r * 1.1, 0, 0.075, r * 0.72);  // brow brim
      _gBox(gear, r * 1.7, 0.1, 0.06, 0, 0.05, -r * 0.7);       // rear guard
      if (L.big) {
        _gBox(gear, 0.05, 0.1, 0.12, 0.16, 0.05, 0);            // ear guards
        _gBox(gear, 0.05, 0.1, 0.12, -0.16, 0.05, 0);
      }
    } else {
      // rusher: bald top, dark mask band across the face
      _gBox(head, 0.17, 0.08, 0.05, 0, 0.05, 0.1);
    }
    return { head: _merge(head), gear: gear.length ? _merge(gear) : null };
  });
}

// emissive visor strip (separate mesh — must glow)
function _visorGeo(type) {
  return _geo('visor:' + type, () => {
    const v = [];
    if (type === 'rusher') {
      _gBox(v, 0.13, 0.032, 0.025, 0, 0, 0);
    } else {
      _gBox(v, 0.14, 0.045, 0.03, 0, 0, 0);
      _gBox(v, 0.1, 0.012, 0.02, 0, -0.034, 0.006);
    }
    return _merge(v);
  });
}

function _armGeo(type) {
  return _geo('arm:' + type, () => {
    const w = LOOK[type].width;
    const u = [];
    _gCap(u, 0.06 * w + 0.012, 0.16, 0, -0.13, 0);              // upper arm
    _gSph(u, 0.055 * w + 0.008, 0, -0.26, 0);                   // elbow
    _gCap(u, 0.055 * w + 0.008, 0.14, 0, -0.38, 0);             // forearm
    _gSph(u, 0.05 * w + 0.012, 0, -0.5, 0);                     // hand
    return _merge(u);
  });
}

// simplified AR, forward = +z, origin near the grip (merged, one material)
function _rifleGeo(type) {
  return _geo('rifle:' + type, () => {
    const s = type === 'heavy' ? 1.1 : 1.0;
    const m = [];
    _gBox(m, 0.065, 0.095, 0.34, 0, 0, 0.08);                   // receiver
    _gBox(m, 0.055, 0.07, 0.2, 0, -0.005, 0.32);                // handguard
    _gCyl(m, 0.018, 0.018, 0.2, 0, 0.005, 0.55, Math.PI / 2);   // barrel
    _gCyl(m, 0.024, 0.024, 0.05, 0, 0.005, 0.68, Math.PI / 2);  // muzzle
    _gBox(m, 0.05, 0.1, 0.16, 0, -0.015, -0.12);                // stock
    _gBox(m, 0.04, 0.07, 0.03, 0, -0.03, -0.2);                 // buttpad
    _gBox(m, 0.045, 0.15, 0.075, 0, -0.1, 0.12, 0.12);          // magazine
    _gBox(m, 0.04, 0.085, 0.05, 0, -0.09, 0.0, -0.35);          // grip
    _gBox(m, 0.035, 0.05, 0.12, 0, 0.075, 0.06);                // carry handle
    _gBox(m, 0.015, 0.03, 0.02, 0, 0.1, 0.12);                  // rear iron
    const g = _merge(m);
    g.scale(s, s, s);
    return g;
  });
}

// rusher's pipe: origin at the grip, body extends down (-y)
function _pipeGeo() {
  return _geo('pipe', () => {
    const p = [];
    _gCyl(p, 0.028, 0.032, 0.78, 0, -0.36, 0);
    _gBox(p, 0.05, 0.09, 0.05, 0, 0.02, 0);                     // grip collar
    _gCyl(p, 0.034, 0.034, 0.05, 0, -0.76, 0);                  // heavy tip
    return _merge(p);
  });
}

function _plateGeo() {
  return _geo('plate', () => {
    const p = [];
    _gBox(p, 0.42, 0.2, 0.05, 0, 0, 0);
    _gBox(p, 0.42, 0.03, 0.055, 0, 0.09, 0);                    // upper lip
    return _merge(p);
  });
}

// module-level temps — zero allocation in the per-frame hot path
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _v4 = new THREE.Vector3();
const _v5 = new THREE.Vector3();
const _v6 = new THREE.Vector3();
const _v7 = new THREE.Vector3();
const _v8 = new THREE.Vector3();
const _v9 = new THREE.Vector3();
const _q1 = new THREE.Quaternion();

function _mesh(geo, mat, part) {
  const m = new THREE.Mesh(geo, mat);
  m.userData.part = part;
  return m;
}

export class Enemy {
  constructor(scene, type, pos) {
    this.scene = scene;
    this.type = type;
    this.stat = STATS[type];
    this.group = new THREE.Group();
    this.pos = new THREE.Vector3().copy(pos);
    this.group.position.copy(pos);
    this.vel = new THREE.Vector3();
    this.hp = this.stat.hp;
    this.armor = type === 'heavy' ? this.stat.armor : 0;
    this.alive = true;
    this.dead = false;
    this.deathT = 0;
    this.sinkT = 0;
    this.ragdoll = false;
    this.flinchAmt = new Spring(0, 200, 1.0);
    this.flinchDir = new THREE.Vector3(1, 0, 0);
    this.stagger = 0;
    this.reactionT = 0;         // E2 reaction delay
    this.hasSeenPlayer = false;
    this.fireCooldown = rng.range(0.3, 1.2);
    this.strafeDir = rng.sign();
    this.strafeT = 0;
    this.state = 'spawn';
    this.spawnT = 0;
    this.plates = [];           // heavy armor plates
    this.plateFly = [];
    this.bobT = rng.next() * 10;
    // walk-cycle state
    this.gaitPhase = rng.next() * Math.PI * 2;
    this.gaitAmp = 0;
    this._build();
    this._parts = [];
    this.group.traverse(o => { if (o.isMesh) { o.castShadow = true; this._parts.push(o); } });
    scene.add(this.group);
  }

  _build() {
    const type = this.type;
    const L = LOOK[type];
    const w = L.width;
    const matU = _mat(type, 'uniform');
    const matG = _mat(type, 'gear');
    const matH = _mat(type, 'helmet');
    const matM = _mat(type, 'metal');
    const matV = _mat(type, 'visor');
    const matS = _mat(type, 'skin');

    this.model = new THREE.Group();
    this.group.add(this.model);
    const M = this.model;

    // ---- legs (pivot at hip; shin sub-group pivots at knee) ----
    const LG = _legGeo(type);
    const legX = 0.13 * w;
    const mkLeg = (side) => {
      const g = new THREE.Group();
      g.position.set(side * legX, 0.97, 0);
      g.add(_mesh(LG.thigh, matU, 'limb'));
      const shin = new THREE.Group();
      shin.position.set(0, -0.46, 0);
      shin.add(_mesh(LG.lower, matU, 'limb'));
      g.add(shin);
      return [g, shin];
    };
    [this.legL, this.shinL] = mkLeg(1);
    [this.legR, this.shinR] = mkLeg(-1);
    M.add(this.legL, this.legR);

    // ---- torso (pivot at hip) ----
    const TG = _torsoGeo(type);
    this.torso = new THREE.Group();
    this.torso.position.set(0, 0.98, 0);
    this.torso.add(_mesh(TG.uniform, matU, 'body'));
    this.torso.add(_mesh(TG.gear, matG, 'body'));
    M.add(this.torso);

    // heavy armor plates (E1) — ride the torso, fly off on pop
    if (type === 'heavy') {
      const matP = _mat(type, 'plate');
      for (let i = 0; i < this.stat.armor; i++) {
        const plate = new THREE.Mesh(_plateGeo(), matP);
        plate.position.set(0, 0.34 - i * 0.19, 0.2);
        plate.userData.plate = i;
        this.torso.add(plate);
        this.plates.push(plate);
      }
    }

    // ---- head (pivot at the neck base, ~1.60) ----
    const HG = _headGeo(type);
    this.head = new THREE.Group();
    this.head.position.set(0, 1.6, 0);
    this.head.add(_mesh(HG.head, matS, 'head'));
    if (HG.gear) this.head.add(_mesh(HG.gear, matH, 'head'));
    const visor = _mesh(_visorGeo(type), matV, 'head');
    const vp = L.visorPos;
    visor.position.set(vp[0], vp[1], vp[2]);
    this.head.add(visor);
    M.add(this.head);

    // ---- arms (pivot at shoulder, ~1.45) ----
    const AG = _armGeo(type);
    const armX = 0.29 * w;
    this.armL = new THREE.Group();
    this.armL.position.set(armX, 1.45, 0);
    this.armL.add(_mesh(AG, matU, 'limb'));
    this.armR = new THREE.Group();
    this.armR.position.set(-armX, 1.45, 0);
    this.armR.add(_mesh(AG, matU, 'limb'));
    M.add(this.armL, this.armR);

    // ---- weapon pinned to armR (ragdoll carries it) ----
    this._armLBase = L.armL;
    this._armRBase = L.armR;
    this._armSwing = L.armSwing;
    if (L.weapon === 'rifle') {
      const rifle = _mesh(_rifleGeo(type), matM, 'body');
      rifle.position.set(0, -0.42, 0.04);
      // cancel the arm's forward pitch so the rifle runs ~level, slight dip,
      // diagonal across the chest
      rifle.rotation.set(-this._armRBase - 0.12, -0.4, 0);
      this.armR.add(rifle);
    } else {
      const pipe = _mesh(_pipeGeo(), matM, 'limb');
      pipe.position.set(0, -0.5, 0.02);
      pipe.rotation.x = 1.15;
      this.armR.add(pipe);
      this.pipe = pipe;
      this._pipeBase = 1.15;
    }

    // base pose
    this.armL.rotation.x = this._armLBase;
    this.armR.rotation.x = this._armRBase;
    this.torso.rotation.x = L.hunch;
    this._hunch = L.hunch;
  }

  // H3: directional flinch (group-level offset + scale pulse, applied in update).
  flinch(part, dir, heavy) {
    this.flinchAmt.addImpulse(heavy ? 0.6 : 0.3);
    this.flinchDir.copy(dir);
    if (heavy) this.stagger = 0.5;
  }

  // E1: armor plate flies off with sparks before health damage.
  popPlate(plateIdx, impactDir) {
    const plate = this.plates[plateIdx];
    if (!plate || plate.userData.gone) return false;
    plate.userData.gone = true;
    this.armor--;
    // detach: give it world velocity
    const wp = plate.getWorldPosition(_v9);
    this.scene.add(plate); // reparent to scene for physics
    plate.position.copy(wp);
    this.plateFly.push({
      mesh: plate,
      vel: new THREE.Vector3(impactDir.x * 4 + rng.range(-2, 2), rng.range(3, 6), impactDir.z * 4 + rng.range(-2, 2)),
      rot: new THREE.Vector3(rng.range(-10, 10), rng.range(-10, 10), rng.range(-10, 10)),
    });
    return true;
  }

  // Take damage. Returns {dmg, headshot, killed}.
  damage(amount, isHead, impactDir) {
    if (!this.alive) return null;
    this.hasSeenPlayer = true;
    // Heavy: armor absorbs until plates gone (E1)
    if (this.armor > 0 && !isHead) {
      const idx = this.stat.armor - this.armor;
      if (idx < this.plates.length && !this.plates[idx].userData.gone) {
        this.popPlate(idx, impactDir);
        return { dmg: 0, absorbed: true, headshot: false, killed: false };
      }
    }
    const mult = isHead ? CFG.weapon.headMult : 1;
    const dmg = amount * mult;
    this.hp -= dmg;
    this.flinch(isHead ? 'head' : 'body', impactDir, isHead || dmg > 40);
    if (this.hp <= 0) {
      this.die(impactDir, isHead);
      return { dmg, headshot: isHead, killed: true };
    }
    return { dmg, headshot: isHead, killed: false };
  }

  die(impactDir, isHead) {
    this.alive = false;
    this.dead = true;
    this.deathT = 0;
    // H4: extra ragdoll impulse on headshot
    const imp = isHead ? 7 : 4;
    this.ragdoll = true;
    // convert each of the 6 part groups to a free body (children — visor,
    // weapon, shin — ride along)
    const parts = [this.torso, this.head, this.armL, this.armR, this.legL, this.legR];
    this.bodies = [];
    for (const p of parts) {
      const wp = p.getWorldPosition(_v9);
      const wrot = p.getWorldQuaternion(_q1);
      this.scene.add(p);
      p.position.copy(wp);
      p.quaternion.copy(wrot);
      this.bodies.push({
        mesh: p,
        vel: new THREE.Vector3(impactDir.x * imp * 0.5 + rng.range(-2, 2), rng.range(2, 5) + (isHead ? 3 : 0), impactDir.z * imp * 0.5 + rng.range(-2, 2)),
        rot: new THREE.Vector3(rng.range(-8, 8), rng.range(-8, 8), rng.range(-8, 8)),
      });
    }
    this.group.visible = false;
    // remaining armor plates fly off
    for (let i = 0; i < this.plates.length; i++) {
      if (!this.plates[i].userData.gone) {
        const wp = this.plates[i].getWorldPosition(_v9);
        this.scene.add(this.plates[i]);
        this.plateFly.push({ mesh: this.plates[i], vel: new THREE.Vector3(rng.range(-4, 4), rng.range(3, 6), rng.range(-4, 4)), rot: new THREE.Vector3(8, 8, 8) });
        void wp;
      }
    }
  }

  // H5: ragdoll physics for a few seconds, then sink away.
  updateRagdoll(dt) {
    this.deathT += dt;
    const sinkStart = 5.0;
    const sinkEnd = 8.0;
    const step = (b) => {
      b.vel.y -= 22 * dt;
      b.mesh.position.addScaledVector(b.vel, dt);
      b.mesh.rotation.x += b.rot.x * dt;
      b.mesh.rotation.y += b.rot.y * dt;
      b.mesh.rotation.z += b.rot.z * dt;
      if (b.mesh.position.y < 0.15) {
        b.mesh.position.y = 0.15;
        b.vel.y *= -0.3;
        b.vel.x *= 0.6; b.vel.z *= 0.6;
        b.rot.multiplyScalar(0.5);
      }
      // sink away (fade + shrink)
      if (this.deathT > sinkStart) {
        const p = clamp((this.deathT - sinkStart) / (sinkEnd - sinkStart), 0, 1);
        const s = 1 - p;
        b.mesh.scale.setScalar(Math.max(0.01, s));
        b.mesh.position.y = Math.max(0.02, b.mesh.position.y - p * 0.5);
      }
    };
    for (const b of this.bodies) step(b);
    for (const b of this.plateFly) step(b);
    // done?
    if (this.deathT > sinkEnd) this.destroyed = true;
  }

  updatePlateFly(dt) {
    for (const b of this.plateFly) {
      b.vel.y -= 22 * dt;
      b.mesh.position.addScaledVector(b.vel, dt);
      b.mesh.rotation.x += b.rot.x * dt;
      b.mesh.rotation.y += b.rot.y * dt;
      b.mesh.rotation.z += b.rot.z * dt;
      if (b.mesh.position.y < 0.05) {
        b.mesh.position.y = 0.05;
        b.vel.y *= -0.3; b.vel.x *= 0.6; b.vel.z *= 0.6;
        b.rot.multiplyScalar(0.5);
      }
    }
  }

  // E2: AI loop — spawn → advance → peek/fire → push when player vulnerable.
  // (AI logic unchanged from the box-man; only visuals were added below.)
  update(dt, playerPos, playerVulnerable, env, playerCamped) {
    if (this.ragdoll) { this.updateRagdoll(dt); this.updatePlateFly(dt); return; }
    if (!this.alive) return;
    this.updatePlateFly(dt);

    _v1.copy(playerPos).sub(this.pos);
    _v1.y = 0;
    const dist = _v1.length();
    _v2.copy(_v1).normalize(); // dir to player

    // spawn ramp-in
    if (this.state === 'spawn') {
      this.spawnT += dt;
      const p = clamp(this.spawnT / 0.6, 0, 1);
      this.group.scale.setScalar(p);
      if (p >= 1) { this.state = 'advance'; this.reactionT = this.stat.reactionTime ?? CFG.enemy.reactionTime; }
      return;
    }

    // reaction delay before engaging (E2)
    if (!this.hasSeenPlayer) {
      this.reactionT -= dt;
    }

    this.bobT += dt;
    this.flinchAmt.update(dt);
    if (this.stagger > 0) this.stagger -= dt;

    const spd = this.stat.speed * (this.stagger > 0 ? 0.4 : 1);
    const move = _v3;
    move.set(0, 0, 0);

    const lunging = this.type === 'rusher' && dist < 6;

    if (this.type === 'rusher') {
      // charge and melee (E1)
      if (dist > this.stat.range) {
        move.copy(_v2);
        // lunge
        if (lunging) move.multiplyScalar(1.4);
      } else {
        // melee swing
        this._meleeSwing(dt);
        move.set(0, 0, 0);
      }
    } else {
      // gunner / heavy: keep range, strafe, take cover
      const ideal = this.type === 'gunner' ? 14 : 10;
      if (dist > ideal + 3) move.copy(_v2);
      else if (dist < ideal - 3) move.copy(_v2).multiplyScalar(-0.6);
      else {
        // strafe
        this.strafeT -= dt;
        if (this.strafeT <= 0) { this.strafeT = rng.range(0.8, 1.8); this.strafeDir = rng.sign(); }
        _v4.set(-_v2.z, 0, _v2.x);
        move.copy(_v4).multiplyScalar(this.strafeDir);
      }
      // push aggressively when player vulnerable (E2)
      if (playerVulnerable && dist > 4) move.addScaledVector(_v2, 1.2);
      // flank if player camped (E2)
      if (playerCamped && dist < 20) {
        _v4.set(-_v2.z, 0, _v2.x);
        move.addScaledVector(_v4, this.strafeDir * 1.5);
      }
      // fire with cooldown
      this.fireCooldown -= dt;
      if (this.hasSeenPlayer && this.reactionT <= 0 && this.fireCooldown <= 0 && dist < this.stat.range) {
        this._fireAt(playerPos);
        this.fireCooldown = (this.stat.fireRate ?? 1.2) * rng.range(0.8, 1.3);
      }
    }

    // apply movement with simple wall avoidance
    const step = spd * dt;
    _v5.copy(this.pos).addScaledVector(move, step);
    if (!this._blocked(_v5, env)) {
      this.pos.x = _v5.x;
      this.pos.z = _v5.z;
    } else {
      // slide along
      _v6.copy(this.pos); _v6.z = _v5.z;
      _v7.copy(this.pos); _v7.x = _v5.x;
      if (!this._blocked(_v6, env)) { this.pos.x = _v6.x; }
      else if (!this._blocked(_v7, env)) { this.pos.z = _v7.z; }
    }
    this.pos.y = 0;

    // face player (visual, with flinch offset in facing)
    _v8.copy(_v2).addScaledVector(this.flinchDir, this.flinchAmt.value);
    const targetYaw = Math.atan2(_v8.x, _v8.z);
    let dy = targetYaw - this.group.rotation.y;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    this.group.rotation.y += dy * Math.min(1, dt * 8);

    // ---- walk cycle (visual only; smoothed, never snaps) ----
    const moving = move.lengthSq() > 0.01;
    const speedNow = moving ? spd * move.length() : 0;
    this.gaitPhase += dt * (speedNow * 1.6) * (lunging ? 1.25 : 1);
    this.gaitAmp = damp(this.gaitAmp, moving ? (lunging ? 1.15 : 1) : 0, 7, dt);
    const swing = Math.sin(this.gaitPhase);
    const amp = this.gaitAmp;
    const idle = 1 - Math.min(1, amp);
    const breath = Math.sin(this.bobT * 3.1416); // ~0.5 Hz breathing

    // legs: antiphase about the hip, knees bend on the trailing leg
    const legAmp = 0.45 * amp;
    this.legL.rotation.x = swing * legAmp;
    this.legR.rotation.x = -swing * legAmp;
    this.shinL.rotation.x = Math.max(0, swing) * 0.5 * amp;
    this.shinR.rotation.x = Math.max(0, -swing) * 0.5 * amp;

    // arms: antiphase with legs (weapon arms pump much less)
    const armAmp = this._armSwing * amp;
    this.armL.rotation.x = this._armLBase - swing * armAmp + Math.sin(this.bobT * 1.7) * 0.02 * idle;
    this.armR.rotation.x = this._armRBase - swing * armAmp * 0.35 + Math.sin(this.bobT * 1.7 + 1.0) * 0.02 * idle;

    // torso: roll with the stride, lean with speed, breath when idle
    this.torso.rotation.z = swing * 0.04 * amp;
    this.torso.rotation.x = this._hunch + 0.06 * Math.min(1, speedNow / 6) * amp + breath * 0.015 * idle;
    this.torso.position.y = 0.98 + breath * 0.008 * idle;
    this.head.rotation.x = breath * 0.012 * idle;

    // walk bob + transient flinch render offset (does not accumulate into pos)
    const bobY = moving ? Math.abs(Math.sin(this.bobT * 6)) * 0.06 : 0;
    const fo = this.flinchAmt.value * 0.15;
    this.group.position.set(
      this.pos.x + this.flinchDir.x * fo,
      this.pos.y + bobY,
      this.pos.z + this.flinchDir.z * fo
    );
    this.group.scale.setScalar(1 + this.flinchAmt.value * 0.05);
  }

  _blocked(pos, env) {
    const r = 0.5;
    for (const c of env.colliders) {
      if (pos.x > c.min.x - r && pos.x < c.max.x + r && pos.z > c.min.z - r && pos.z < c.max.z + r && c.max.y > 0.4) {
        return true;
      }
    }
    return false;
  }

  _meleeSwing(dt) {
    if (this.pipe) {
      this.pipe.rotation.x = this._pipeBase + Math.sin(this.bobT * 10) * 0.6;
    }
  }

  _fireAt(playerPos) {
    // muzzle flash light + event
    this._firing = 0.1;
    if (this.onFire) this.onFire(this.pos, playerPos);
  }

  // Raycast against this enemy's parts.
  raycast(raycaster) {
    const meshes = this._parts;
    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) return null;
    const h = hits[0];
    return {
      enemy: this,
      point: h.point,
      normal: h.face ? h.face.normal.clone().transformDirection(h.object.matrixWorld) : new THREE.Vector3(0, 1, 0),
      part: h.object.userData.part || 'body',
      distance: h.distance,
      mesh: h.object,
    };
  }

  dispose() {
    // remove group + any reparented bodies/plates
    this.scene.remove(this.group);
    for (const b of this.bodies || []) this.scene.remove(b.mesh);
    for (const b of this.plateFly || []) this.scene.remove(b.mesh);
  }
}
