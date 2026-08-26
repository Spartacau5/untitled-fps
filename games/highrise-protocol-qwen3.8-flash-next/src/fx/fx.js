// HIGHRISE PROTOCOL — FX module (F4, F5, H1, H5/H6 decals, P1 pooling, W2 paper).
// One InstancedMesh per particle archetype, oldest-first pooled slots, zero per-frame
// allocation (all scratch hoisted), caps + particleScale from quality.flags.
import * as THREE from 'three';
import { rng } from '../core/rng.js';
import { bus } from '../core/bus.js';
import { Pool } from '../core/pool.js';
import { quality } from '../core/quality.js';
import { shake } from '../core/shake.js';
import { state } from '../core/state.js';
import * as E from '../core/easings.js';
import {
  softCircle, puffBlob, streakTex, tracerTex, paperTex,
  bulletHoleTex, dingTex, crackTex, gypsumTex, woodHoleTex, tearTex, bloodTex, pinholeTex,
} from './textures.js';

// ------------------------------------------------------------------ scratch
const _m4 = new THREE.Matrix4();
const _mZero = new THREE.Matrix4().makeScale(0, 0, 0);
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _v1 = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _v3 = new THREE.Vector3();
const _v4 = new THREE.Vector3();
const _s = new THREE.Vector3();
const _col = new THREE.Color();
const UP = new THREE.Vector3(0, 1, 0);
const AX = new THREE.Vector3(1, 0, 0);
const AYZ = new THREE.Vector3(0, 0, 1);

// ------------------------------------------------------------------ instanced particle buffer
// Fixed array of particle records; live set is parts[0..n). Swap-kill keeps it compact.
class IBuf {
  constructor(scene, geo, mat, cap) {
    this.cap = cap;
    this.limit = cap; // runtime clamp (quality:change), never above cap
    this.n = 0;
    this.mesh = new THREE.InstancedMesh(geo, mat, cap);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.matrixAutoUpdate = false;
    for (let i = 0; i < cap; i++) {
      this.mesh.setMatrixAt(i, _mZero);
      this.mesh.setColorAt(i, _col.setRGB(1, 1, 1));
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
    scene.add(this.mesh);
    this.parts = new Array(cap);
    for (let i = 0; i < cap; i++) {
      this.parts[i] = {
        pos: new THREE.Vector3(), vel: new THREE.Vector3(), axis: new THREE.Vector3(),
        quat: new THREE.Quaternion(), obj: null,
        age: 0, life: 1, s0: 0.1, s1: 0.2,
        r: 1, g: 1, b: 1, flick: 0, angSpd: 0, bounces: 0, extra: 0,
      };
    }
  }
  /** Grab a slot: fresh if under (runtime-clamped) cap, else recycle the oldest. */
  spawn() {
    const cap = this.limit < this.cap ? this.limit : this.cap;
    if (this.n < cap) { const p = this.parts[this.n++]; p.age = 0; return p; } // age reset: swap-kill parks dead slots at n
    let worst = 0, wv = -1;
    for (let i = 0; i < this.n; i++) {
      const t = this.parts[i].age / this.parts[i].life;
      if (t > wv) { wv = t; worst = i; }
    }
    const p = this.parts[worst];
    p.age = 0;
    return p;
  }
  setLimit(c) { this.limit = Math.min(c, this.cap); }
  kill(i) {
    this.n--;
    const t = this.parts[i];
    this.parts[i] = this.parts[this.n];
    this.parts[this.n] = t;
  }
  /** Hide instances beyond the live window and flag uploads. Call after the update pass. */
  end() {
    if (this.n < this.prevN) {
      for (let i = this.n; i < this.prevN; i++) this.mesh.setMatrixAt(i, _mZero);
    }
    this.prevN = this.n;
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
  clear() { this.n = 0; this.end(); }
}

// ------------------------------------------------------------------ decal buffer
// Instanced quads oriented to the surface normal, polygonOffset -2 (K5 z-fight guard),
// oldest-first Pool reuse when a variant bucket is exhausted.
class DecalBuf {
  constructor(scene, geo, textures, totalCap) {
    this.textures = textures;
    this.per = Math.max(1, Math.ceil(totalCap / textures.length));
    this.meshes = [];
    this.pools = [];
    for (let v = 0; v < textures.length; v++) {
      const mat = new THREE.MeshBasicMaterial({
        map: textures[v], transparent: true, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, // K5
      });
      const mesh = new THREE.InstancedMesh(geo, mat, this.per);
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      mesh.matrixAutoUpdate = false;
      for (let j = 0; j < this.per; j++) {
        mesh.setMatrixAt(j, _mZero);
        mesh.setColorAt(j, _col.setRGB(1, 1, 1));
      }
      scene.add(mesh);
      const pool = new Pool(
        () => ({ idx: 0, meshIdx: v, live: false, pos: new THREE.Vector3(), quat: new THREE.Quaternion(), mesh }),
        this.per,
        (slot) => {
          slot.mesh.setMatrixAt(slot.idx, _mZero);
          slot.mesh.instanceMatrix.needsUpdate = true;
        },
      );
      // pre-seed exactly one slot per instance index (zero lazy allocation)
      for (let j = 0; j < this.per; j++) {
        const slot = { idx: j, meshIdx: v, live: false, pos: new THREE.Vector3(), quat: new THREE.Quaternion(), mesh };
        pool.free.push(slot);
      }
      this.meshes.push(mesh);
      this.pools.push(pool);
    }
  }
  acquire(variant, pos, quat, sx, sy, color, owner = null) {
    const mesh = this.meshes[variant];
    const pool = this.pools[variant];
    const slot = pool.acquire();
    slot.pos.copy(pos);
    slot.quat.copy(quat);
    slot.mesh = mesh;
    slot.meshIdx = variant;
    slot.owner = owner; // growers watch this: a stolen slot stops writing
    _m4.compose(pos, quat, _s.set(sx, sy, 1));
    mesh.setMatrixAt(slot.idx, _m4);
    mesh.setColorAt(slot.idx, color);
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    return slot;
  }
  liveCount() {
    let c = 0;
    for (let i = 0; i < this.pools.length; i++) c += this.pools[i].live.length;
    return c;
  }
  releaseAll() { for (let i = 0; i < this.pools.length; i++) this.pools[i].releaseAll(); }
  /** Runtime cap clamp (quality:change); instance meshes keep the high-preset ceiling. */
  setCap(total) {
    const per = Math.max(1, Math.ceil(total / this.pools.length));
    for (let i = 0; i < this.pools.length; i++) this.pools[i].cap = Math.min(per, this.per);
  }
}

// ================================================================== init
export function init(ctx) {
  const scene = ctx.scene;

  // ---------- textures (baked once, seeded) ----------
  const texSoft = softCircle();
  const texPuff = puffBlob();
  const texStreak = streakTex();
  const texTracer = tracerTex();
  const texPaper = paperTex();
  const texDing = dingTex();
  const texCrack = crackTex();
  const texGypsum = gypsumTex();
  const texWood = woodHoleTex();
  const texTear = tearTex();
  const texPin = pinholeTex();
  const texHoles = [bulletHoleTex(4), bulletHoleTex(6), bulletHoleTex(8)];
  const texBloods = [bloodTex(0), bloodTex(1), bloodTex(2), bloodTex(3)];

  // ---------- shared materials ----------
  const addBl = THREE.AdditiveBlending;
  // additive quads opt out of fog: FogExp2 would mix warm haze into their color and then
  // additive-blend it — bright ghosts at distance; fog:false keeps them clean
  const matDust = new THREE.MeshBasicMaterial({ map: texPuff, transparent: true, blending: addBl, depthWrite: false, fog: false });
  const matSmoke = new THREE.MeshBasicMaterial({ map: texSoft, transparent: true, blending: addBl, depthWrite: false, fog: false });
  const matMist = new THREE.MeshBasicMaterial({ map: texPuff, transparent: true, blending: addBl, depthWrite: false, fog: false });
  const matSpark = new THREE.MeshBasicMaterial({ map: texStreak, transparent: true, blending: addBl, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const matEmber = new THREE.MeshBasicMaterial({ map: texSoft, transparent: true, blending: addBl, depthWrite: false, fog: false });
  const matTracer = new THREE.MeshBasicMaterial({ map: texTracer, transparent: true, blending: addBl, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const matDrop = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
  const matShard = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, side: THREE.DoubleSide, fog: false });
  const matChips = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const matPaper = new THREE.MeshBasicMaterial({ map: texPaper, transparent: true, side: THREE.DoubleSide });
  const matShell = new THREE.MeshBasicMaterial({ color: 0xb3873a });

  // ---------- geometries ----------
  const geoQuad = new THREE.PlaneGeometry(1, 1);
  const geoSphere = new THREE.SphereGeometry(0.5, 6, 4);
  const geoChip = new THREE.BoxGeometry(1, 0.22, 0.16);
  const geoShell = new THREE.CylinderGeometry(0.5, 0.5, 1.6, 6);
  geoShell.rotateZ(Math.PI / 2); // brass axis lies along X at rest

  // allocated at the HIGH preset ceiling; quality:change clamps them at runtime
  const bufDust = new IBuf(scene, geoQuad, matDust, 240);
  const bufSmoke = new IBuf(scene, geoQuad, matSmoke, 112);
  const bufMist = new IBuf(scene, geoQuad, matMist, 64);
  const bufSpark = new IBuf(scene, geoQuad, matSpark, 200);
  const bufEmber = new IBuf(scene, geoQuad, matEmber, 64);
  const bufDrop = new IBuf(scene, geoSphere, matDrop, 128);
  const bufShard = new IBuf(scene, geoQuad, matShard, 96);
  const bufChips = new IBuf(scene, geoChip, matChips, 128);
  const bufPaper = new IBuf(scene, geoQuad, matPaper, 12);
  const bufTracer = new IBuf(scene, geoQuad, matTracer, 40);

  // ONE pooled dynamic light for explosions (P3)
  const boomLight = new THREE.PointLight(0xffa254, 0, 18, 2);
  boomLight.visible = false;
  scene.add(boomLight);
  const boom = { t: 99, peak: 0 };

  // ---------- decal pools (H6 caps; ceiling-sized, clamped on quality:change) ----------
  const bulletDecals = new DecalBuf(scene, geoQuad, texHoles, 256);
  const bloodDecals = new DecalBuf(scene, geoQuad, texBloods, 224);
  const specialDecals = {
    ding: new DecalBuf(scene, geoQuad, [texDing], 64),
    crack: new DecalBuf(scene, geoQuad, [texCrack], 64),
    gypsum: new DecalBuf(scene, geoQuad, [texGypsum], 64),
    wood: new DecalBuf(scene, geoQuad, [texWood], 64),
    tear: new DecalBuf(scene, geoQuad, [texTear], 64),
    pin: new DecalBuf(scene, geoQuad, [texPin], 64),
  };

  // growing dark pools under corpses (H5); capped, oldest evicted
  const growers = [];
  const GROW_CAP = 8;

  let nearMissCooldown = 0; // 'tracer:nearmiss' emission cap: 3/s

  // ---------- shells: fixed ring of records, oldest-first reuse ----------
  const shellCap = 24; // high-preset ceiling; clamped at runtime
  let shellLimit = Math.min(quality.flags.shellCap || shellCap, shellCap);
  const shellMesh = new THREE.InstancedMesh(geoShell, matShell, shellCap);
  shellMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  shellMesh.frustumCulled = false;
  shellMesh.matrixAutoUpdate = false;
  for (let i = 0; i < shellCap; i++) shellMesh.setMatrixAt(i, _mZero);
  scene.add(shellMesh);
  const shellsLive = new Array(shellCap);
  for (let i = 0; i < shellCap; i++) {
    shellsLive[i] = {
      pos: new THREE.Vector3(), vel: new THREE.Vector3(), quat: new THREE.Quaternion(),
      axis: new THREE.Vector3(), restQuat: new THREE.Quaternion(),
      age: 0, life: 1, ang: 0, bounces: 0, landed: false, used: false,
    };
  }

  // ---------- ambient state ----------
  let clock = 0;
  const windPhaseA = rng.range(0, Math.PI * 2);
  const windPhaseB = rng.range(0, Math.PI * 2);
  const wind = new THREE.Vector3();
  let paperTimer = rng.range(4, 8);
  const glassEnergy = new Map(); // glass pane object -> accumulated impact energy (clearable per match)
  const _nmPayload = { intensity: 0 };
  const _metalPayload = { point: new THREE.Vector3() };

  const _fallbackBounds = { minX: -22, maxX: 22, minZ: -17, maxZ: 17, floorY: 0 };
  const bounds = () => ctx.world?.bounds || _fallbackBounds;
  const pc = (n) => Math.max(1, Math.round(n * (quality.flags.particleScale || 1) * (state.overdrive.active ? 1.2 : 1)));

  /** Clamp every pool to the current quality preset (auto-degrade may flip this at runtime). */
  function applyQualityCaps() {
    const f = quality.flags;
    bufDust.setLimit(Math.round(240 * (f.particleScale || 1)));
    bufSmoke.setLimit(Math.round(112 * (f.particleScale || 1)));
    bufMist.setLimit(Math.round(64 * (f.particleScale || 1)));
    bufSpark.setLimit(Math.round(200 * (f.particleScale || 1)));
    bufEmber.setLimit(Math.round(64 * (f.particleScale || 1)));
    bufDrop.setLimit(Math.round(128 * (f.particleScale || 1)));
    bufShard.setLimit(Math.round(96 * (f.particleScale || 1)));
    bufChips.setLimit(Math.round(128 * (f.particleScale || 1)));
    bufTracer.setLimit(f.tracerCap || 40);
    bulletDecals.setCap(f.decalCap || 256);
    bloodDecals.setCap(f.bloodCap || 224);
    for (const k in specialDecals) specialDecals[k].setCap(Math.max(16, (f.decalCap || 256) >> 2));
    shellLimit = Math.min(f.shellCap || 24, shellCap);
  }
  applyQualityCaps();
  bus.on('quality:change', applyQualityCaps);

  // ---------- helpers ----------
  /** Quaternion of a decal plane whose +Z lies on the surface normal, spun about it. */
  function orientDecalQuat(nx, ny, nz, spin) {
    _v1.set(nx, ny, nz);
    if (_v1.lengthSq() < 1e-8) _v1.copy(UP);
    _v1.normalize();
    _q.setFromUnitVectors(AYZ, _v1);
    _q2.setFromAxisAngle(_v1, spin);
    _q.premultiply(_q2);
    return _q;
  }

  function placeDecal(db, variant, point, normal, scale, color, flatOnUp = false, owner = null) {
    const spin = rng.range(0, Math.PI * 2);
    if (flatOnUp) {
      _v3.copy(point);
      const q = orientDecalQuat(0, 1, 0, spin);
      return db.acquire(variant, _v3, q, scale * rng.range(0.85, 1.2), scale * rng.range(0.85, 1.2), color, owner);
    }
    _v1.copy(normal);
    if (_v1.lengthSq() < 1e-8) _v1.copy(UP);
    _v1.normalize();
    _v3.copy(point).addScaledVector(_v1, 0.02); // micro-offset off the surface (K5)
    const q = orientDecalQuat(_v1.x, _v1.y, _v1.z, spin);
    return db.acquire(variant, _v3, q, scale * rng.range(0.85, 1.2), scale * rng.range(0.85, 1.2), color, owner);
  }

  function tint(buf, p, i, a) {
    buf.mesh.setColorAt(i, _col.setRGB(p.r * a, p.g * a, p.b * a));
  }

  /** Random direction clustered around `base`, result normalized into p.vel (caller scales). */
  function coneVel(p, base, spread) {
    _v4.set(rng.gauss(), rng.gauss(), rng.gauss()).multiplyScalar(spread).add(base);
    if (_v4.lengthSq() < 1e-8) _v4.copy(base);
    p.vel.copy(_v4).normalize();
  }

  function spawnChip(point, n, r, g, b, vMin, vMax, lifeMax) {
    const p = bufChips.spawn();
    p.pos.copy(point).addScaledVector(n, rng.range(0.01, 0.05));
    coneVel(p, n, 1);
    p.vel.multiplyScalar(rng.range(vMin, vMax));
    p.vel.y += rng.range(0.6, 2.4);
    p.age = 0; p.life = rng.range(0.9, lifeMax);
    p.s0 = rng.range(0.02, 0.05);
    p.quat.setFromAxisAngle(_v4.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize(), rng.range(0, Math.PI));
    p.axis.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize();
    p.angSpd = rng.range(-12, 12);
    p.bounces = 0;
    p.r = r; p.g = g; p.b = b;
  }

  // ==================================================================
  //  F5 — surface-routed impacts
  // ==================================================================
  /** Optional 5th arg `object` = hit mesh: paint bucket userData.paintColor, glass pane
   *  energy accumulation → world.glassBreak. */
  function impact(point, normal, surface, energy = 1, object = null) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
    _v1.copy(normal);
    if (_v1.lengthSq() < 1e-8) _v1.set(0, 1, 0);
    _v1.normalize();
    switch (surface) {
      case 'metal': impactMetal(point, _v1, energy); break;
      case 'wood': impactWood(point, _v1, energy); break;
      case 'glass': impactGlass(point, _v1, energy, object); break;
      case 'drywall': impactDrywall(point, _v1, energy); break;
      case 'sheeting': impactSheeting(point, _v1); break;
      case 'paint': impactPaint(point, _v1, object); break;
      case 'body': break; // flesh is bloodHit's job (H1)
      default: impactConcrete(point, _v1, energy);
    }
  }

  function impactConcrete(point, n, energy) {
    const nd = pc(5 + energy * 2);
    for (let i = 0; i < nd; i++) {
      const p = bufDust.spawn();
      p.pos.copy(point).addScaledVector(n, rng.range(0.02, 0.1));
      coneVel(p, n, 0.9);
      p.vel.multiplyScalar(rng.range(0.8, 2.4) * energy);
      p.vel.y += rng.range(0.4, 1.4);
      p.age = 0; p.life = rng.range(0.5, 0.95);
      p.s0 = rng.range(0.04, 0.09); p.s1 = rng.range(0.32, 0.62);
      const g = rng.range(0.5, 0.62);
      p.r = g + 0.03; p.g = g; p.b = g - 0.04;
    }
    const nch = pc(3 + energy);
    for (let i = 0; i < nch; i++) spawnChip(point, n, 0.55, 0.52, 0.48, 0.9, 3.2, 1.6);
    _col.setRGB(0.5, 0.48, 0.45);
    placeDecal(bulletDecals, rng.int(texHoles.length), point, n, rng.range(0.1, 0.16) * (0.85 + energy * 0.2), _col);
  }

  function impactMetal(point, n, energy) {
    // white-hot sparks bursting off, then streaming sideways (wind, §1)
    const ns = pc(8 + energy * 3);
    for (let i = 0; i < ns; i++) {
      const p = bufSpark.spawn();
      p.pos.copy(point).addScaledVector(n, 0.02);
      coneVel(p, n, 1.15);
      p.vel.multiplyScalar(rng.range(3, 8) * energy);
      p.vel.y = Math.abs(p.vel.y) * rng.range(0.2, 1) + rng.range(0.2, 1.6);
      p.age = 0; p.life = rng.range(0.25, 0.55);
      p.s0 = rng.range(0.05, 0.09); p.s1 = 0.012;
      p.r = 1; p.g = rng.range(0.8, 0.95); p.b = rng.range(0.45, 0.7);
    }
    if (rng.next() < 0.4) {
      // a lingering spark stream sliding tangentially along the metal
      _v2.set(rng.gauss(), rng.gauss() * 0.3, rng.gauss()).normalize();
      _v2.addScaledVector(n, -_v2.dot(n)).normalize();
      for (let i = 0; i < 4; i++) {
        const p = bufSpark.spawn();
        p.pos.copy(point).addScaledVector(n, 0.01);
        p.vel.copy(_v2).multiplyScalar(rng.range(2.5, 5)).addScaledVector(n, rng.range(0.2, 0.8));
        p.age = i * 0.05; p.life = rng.range(0.4, 0.75);
        p.s0 = 0.05; p.s1 = 0.01;
        p.r = 1; p.g = 0.88; p.b = 0.55;
      }
    }
    _col.setRGB(0.9, 0.9, 0.95);
    placeDecal(specialDecals.ding, 0, point, n, rng.range(0.07, 0.11), _col);
    _metalPayload.point.copy(point);
    bus.emit('impact:metal', _metalPayload);
  }

  function impactWood(point, n, energy) {
    const ns = pc(4 + energy * 2);
    for (let i = 0; i < ns; i++) spawnChip(point, n, 0.52, 0.36, 0.2, 2.5, 6, 2.4);
    for (let i = 0; i < pc(3); i++) {
      const p = bufDust.spawn();
      p.pos.copy(point).addScaledVector(n, rng.range(0.02, 0.08));
      coneVel(p, n, 0.8);
      p.vel.multiplyScalar(rng.range(0.8, 2));
      p.age = 0; p.life = rng.range(0.4, 0.7);
      p.s0 = rng.range(0.03, 0.06); p.s1 = rng.range(0.2, 0.4);
      p.r = 0.55; p.g = 0.4; p.b = 0.24;
    }
    _col.setRGB(0.75, 0.6, 0.42);
    placeDecal(specialDecals.wood, 0, point, n, rng.range(0.1, 0.15), _col);
  }

  function impactGlass(point, n, energy, object) {
    _col.setRGB(0.85, 0.92, 0.96);
    placeDecal(specialDecals.crack, 0, point, n, rng.range(0.12, 0.2) * (0.8 + energy * 0.3), _col);
    const ns = pc(5 + energy * 2);
    for (let i = 0; i < ns; i++) {
      const p = bufShard.spawn();
      p.pos.copy(point).addScaledVector(n, rng.range(0, 0.05));
      coneVel(p, n, 1.2);
      p.vel.multiplyScalar(rng.range(1.4, 4));
      p.vel.y += rng.range(0.5, 2);
      p.age = 0; p.life = rng.range(1.2, 2);
      p.s0 = rng.range(0.02, 0.06);
      p.quat.setFromAxisAngle(_v4.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize(), rng.range(0, Math.PI));
      p.axis.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize();
      p.angSpd = rng.range(-9, 9);
      p.bounces = 0;
      p.r = 0.8; p.g = 0.9; p.b = 0.98;
    }
    for (let i = 0; i < pc(2); i++) {
      const p = bufDust.spawn();
      p.pos.copy(point);
      coneVel(p, n, 0.5);
      p.vel.multiplyScalar(rng.range(0.4, 1.2));
      p.age = 0; p.life = rng.range(0.35, 0.6);
      p.s0 = 0.04; p.s1 = rng.range(0.16, 0.3);
      p.r = 0.75; p.g = 0.85; p.b = 0.9;
    }
    if (object && object.isObject3D) {
      const e = (glassEnergy.get(object) || 0) + energy;
      if (e >= 6) {
        glassEnergy.delete(object);
        ctx.world?.glassBreak?.(object); // world handles the full-pane burst
      } else {
        glassEnergy.set(object, e); // decals keep accumulating until it gives way
      }
    }
  }

  function impactDrywall(point, n, energy) {
    for (let i = 0; i < pc(9 + energy * 2); i++) {
      const p = bufDust.spawn();
      p.pos.copy(point).addScaledVector(n, rng.range(0.03, 0.12));
      coneVel(p, n, 1.1);
      p.vel.multiplyScalar(rng.range(0.7, 2.2));
      p.vel.y += rng.range(0.3, 1);
      p.age = 0; p.life = rng.range(0.7, 1.2);
      p.s0 = rng.range(0.06, 0.12); p.s1 = rng.range(0.5, 0.95);
      p.r = 0.93; p.g = 0.92; p.b = 0.86;
    }
    for (let i = 0; i < pc(3); i++) spawnChip(point, n, 0.9, 0.88, 0.82, 0.6, 2, 1.4);
    _col.setRGB(0.9, 0.88, 0.8);
    placeDecal(specialDecals.gypsum, 0, point, n, rng.range(0.16, 0.24), _col);
    _col.setRGB(0.6, 0.58, 0.55);
    _v2.copy(point).addScaledVector(n, -0.16); // thin-pass exit marker just behind the panel
    _v3.set(-n.x, -n.y, -n.z);
    placeDecal(specialDecals.pin, 0, _v2, _v3, 0.07, _col);
  }

  function impactSheeting(point, n) {
    ctx.world?.sheetingHit?.(point); // W1 ripple impulse
    _col.setRGB(0.95, 0.95, 0.92);
    placeDecal(specialDecals.tear, 0, point, n, rng.range(0.05, 0.09), _col);
    for (let i = 0; i < pc(2); i++) {
      const p = bufDust.spawn();
      p.pos.copy(point);
      coneVel(p, n, 0.4);
      p.vel.multiplyScalar(rng.range(0.3, 0.8));
      p.age = 0; p.life = rng.range(0.3, 0.5);
      p.s0 = 0.03; p.s1 = rng.range(0.12, 0.22);
      p.r = 0.85; p.g = 0.85; p.b = 0.8;
    }
  }

  function impactPaint(point, n, object) {
    const uc = object?.userData?.paintColor ?? object?.userData?.color;
    if (typeof uc === 'number') _col.setHex(uc); // setHex lands in working (linear) space
    else _col.setRGB(rng.range(0.6, 1), rng.range(0.4, 0.9), rng.range(0.2, 0.6));
    const pr = _col.r, pg = _col.g, pb = _col.b;
    for (let i = 0; i < pc(12); i++) {
      const p = bufDust.spawn();
      p.pos.copy(point).addScaledVector(n, rng.range(0.02, 0.1));
      coneVel(p, n, 1.2);
      p.vel.multiplyScalar(rng.range(1, 3));
      p.age = 0; p.life = rng.range(0.5, 1);
      p.s0 = rng.range(0.04, 0.1); p.s1 = rng.range(0.3, 0.7);
      p.r = pr; p.g = pg; p.b = pb;
    }
    _col.setRGB(pr * 0.9, pg * 0.9, pb * 0.9);
    placeDecal(bloodDecals, rng.int(texBloods.length), point, n, rng.range(0.2, 0.32), _col);
  }

  // ==================================================================
  //  H1 — blood
  // ==================================================================
  /** Directional spray bursting AWAY along the bullet vector (+up bias), mist puffs,
   *  droplets that arc and land as decals. Headshot = bigger, wetter, darker (H4). */
  function bloodHit(point, bulletDir, dmg = 10, headshot = false) {
    if (!point || !bulletDir || !Number.isFinite(point.x) || !Number.isFinite(bulletDir.x)) return;
    _v1.copy(bulletDir);
    if (_v1.lengthSq() < 1e-8) _v1.set(0, 1, 0);
    _v1.normalize();
    _v1.y += 0.35;
    _v1.normalize();
    const dark = headshot ? 0.68 : 1;
    const nd = pc((headshot ? 16 : 7) + dmg * 0.3);
    for (let i = 0; i < nd; i++) {
      const p = bufDrop.spawn();
      p.pos.copy(point);
      coneVel(p, _v1, headshot ? 0.75 : 0.55);
      p.vel.multiplyScalar(rng.range(2, 5.2) * (headshot ? 1.35 : 1));
      p.age = 0; p.life = rng.range(0.6, 1.15);
      p.s0 = rng.range(0.014, 0.03) * (headshot ? 1.5 : 1);
      p.r = 0.5 * dark; p.g = 0.045 * dark; p.b = 0.04 * dark;
    }
    const nm = pc(headshot ? 4 : 2);
    for (let i = 0; i < nm; i++) {
      const p = bufMist.spawn();
      p.pos.copy(point).addScaledVector(_v1, rng.range(0.05, 0.3));
      p.vel.copy(_v1).multiplyScalar(rng.range(0.8, 2.2));
      p.vel.x += rng.gauss() * 0.4; p.vel.z += rng.gauss() * 0.4; p.vel.y += rng.range(0.2, 0.9);
      p.age = 0; p.life = rng.range(0.45, 0.8);
      p.s0 = rng.range(0.08, 0.14) * (headshot ? 1.6 : 1); p.s1 = rng.range(0.5, 0.9) * (headshot ? 1.4 : 1);
      p.r = 0.5 * dark; p.g = 0.06 * dark; p.b = 0.05 * dark;
    }
  }

  /** Oversized burst + floor splat on execution (H4). */
  function killBlood(point, dir) {
    bloodHit(point, dir, 26, true);
    const b = bounds();
    _v1.set(point.x, b.floorY + 0.012, point.z);
    _col.setRGB(0.42, 0.045, 0.04);
    placeDecal(bloodDecals, rng.int(texBloods.length), _v1, UP, rng.range(0.85, 1.2), _col, true);
  }

  /** Dark pool that grows in place under a corpse (H5), oldest evicted past GROW_CAP. */
  function bodyBlood(corpsePos) {
    if (growers.length >= GROW_CAP) growers.shift();
    _col.setRGB(0.34, 0.04, 0.035);
    _v1.set(corpsePos.x, bounds().floorY + 0.012, corpsePos.z);
    const g = { slot: null, t: 0, dur: 4.5, from: 0.2, to: rng.range(1.25, 1.6) };
    g.slot = placeDecal(bloodDecals, 0, _v1, UP, 0.2, _col, true, g);
    growers.push(g);
  }

  // ==================================================================
  //  F4 — tracers / shells / muzzle smoke · explosions
  // ==================================================================
  function tracer(from, to, opts) {
    if (!from || !to || !Number.isFinite(from.x) || !Number.isFinite(to.x)) return;
    const p = bufTracer.spawn(); // fresh slot, or oldest-first recycle at cap
    const od = state.overdrive.active && !opts?.enemy;
    p.life = opts?.glow ? 0.09 : 0.065; // ~60 ms, ease-out shrink in update
    p.s0 = od ? 0.09 : 0.055; p.s1 = 0.006;
    p.extra = od ? 1 : 0;
    if (typeof opts?.color === 'number') _col.setHex(opts.color);
    else if (opts?.color) _col.copy(opts.color);
    else if (opts?.enemy) _col.setRGB(1, 0.5, 0.22);
    else _col.setRGB(1, 0.82, 0.5);
    const boost = (opts?.glow || od) ? 1.8 : 1;
    p.r = _col.r * boost; p.g = _col.g * boost; p.b = _col.b * boost;
    const ti = p.obj || (p.obj = { from: new THREE.Vector3(), to: new THREE.Vector3(), enemy: false, nearMissed: false });
    ti.from.copy(from); ti.to.copy(to);
    ti.enemy = !!opts?.enemy; ti.nearMissed = false;
  }

  /** F4: brass shell casing with bounce physics + tumble, 'shell:land' tinkle cue. */
  function shell(from, ejectDir) {
    if (!from || !ejectDir || !Number.isFinite(from.x)) return;
    let rec = null, oldest = null, ov = -1;
    for (let i = 0; i < shellLimit; i++) {
      const s = shellsLive[i];
      if (!s.used) { rec = s; break; }
      const t = s.age / s.life;
      if (t > ov) { ov = t; oldest = s; }
    }
    if (!rec) rec = oldest; // oldest-first steal
    rec.used = true;
    rec.pos.copy(from);
    _v1.copy(ejectDir);
    if (_v1.lengthSq() < 1e-8) _v1.set(1, 0.4, 0);
    _v1.normalize();
    rec.vel.copy(_v1).multiplyScalar(rng.range(2.4, 4));
    rec.vel.y += rng.range(1.6, 3.2);
    rec.age = 0; rec.life = 2.8;
    rec.bounces = 0; rec.landed = false;
    rec.quat.setFromAxisAngle(_v4.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize(), rng.range(0, Math.PI));
    rec.axis.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize();
    rec.ang = rng.range(14, 26) * rng.sign();
    rec.restQuat.setFromAxisAngle(UP, rng.range(0, Math.PI * 2));
  }

  /** Soft dark-warm puffs drifting up and back with the wind (F4 wisps). */
  function muzzleSmoke(from, dir) {
    if (!from || !dir) return;
    _v1.copy(dir);
    if (_v1.lengthSq() < 1e-8) _v1.set(0, 0, -1);
    _v1.normalize();
    const n = pc(2);
    for (let i = 0; i < n; i++) {
      const p = bufSmoke.spawn();
      p.pos.copy(from).addScaledVector(_v1, rng.range(0, 0.08));
      p.vel.copy(_v1).multiplyScalar(-rng.range(0.3, 0.8));
      p.vel.y += rng.range(0.4, 0.9);
      p.vel.x += rng.gauss() * 0.25; p.vel.z += rng.gauss() * 0.25;
      p.age = 0; p.life = rng.range(0.7, 1.3);
      p.s0 = rng.range(0.03, 0.06); p.s1 = rng.range(0.28, 0.5);
      const g = rng.range(0.14, 0.2);
      p.r = g + 0.06; p.g = g + 0.02; p.b = g;
    }
  }

  function explosion(point, radius = 4) {
    if (!point || !Number.isFinite(point.x)) return;
    const R = Math.max(1, radius);
    const fb = bufSmoke.spawn();
    fb.pos.copy(point);
    fb.vel.set(0, rng.range(0.4, 0.9), 0);
    fb.age = 0; fb.life = 0.4;
    fb.s0 = R * 0.25; fb.s1 = R * 1.9;
    fb.r = 1.6; fb.g = 0.75; fb.b = 0.28;
    for (let i = 0; i < pc(6); i++) {
      const p = bufDust.spawn();
      _v4.set(rng.gauss(), rng.gauss() * 0.5 + 0.3, rng.gauss()).normalize();
      p.pos.copy(point).addScaledVector(_v4, R * 0.2);
      coneVel(p, UP, 1.1);
      p.vel.multiplyScalar(R * rng.range(0.5, 1.4));
      p.age = 0; p.life = rng.range(0.8, 1.5);
      p.s0 = R * 0.12; p.s1 = R * rng.range(0.5, 0.95);
      const g = rng.range(0.28, 0.42);
      p.r = g + 0.08; p.g = g; p.b = g - 0.05;
    }
    for (let i = 0; i < pc(9); i++) {
      const a = (i / 9) * Math.PI * 2 + rng.range(-0.25, 0.25);
      const p = bufSmoke.spawn();
      p.pos.copy(point);
      p.pos.x += Math.cos(a) * R * 0.3; p.pos.z += Math.sin(a) * R * 0.3; p.pos.y += 0.2;
      p.vel.set(Math.cos(a) * R * 2.2, rng.range(0.8, 2.2), Math.sin(a) * R * 2.2);
      p.age = 0; p.life = rng.range(0.9, 1.4);
      p.s0 = R * 0.2; p.s1 = R * 0.85;
      const g = rng.range(0.16, 0.26);
      p.r = g + 0.1; p.g = g; p.b = g * 0.85;
    }
    for (let i = 0; i < pc(14); i++) {
      const p = bufSpark.spawn();
      p.pos.copy(point);
      _v1.set(rng.gauss(), 0.9, rng.gauss()).normalize();
      coneVel(p, _v1, 1.1);
      p.vel.multiplyScalar(rng.range(6, 16));
      p.age = 0; p.life = rng.range(0.4, 0.85);
      p.s0 = 0.09; p.s1 = 0.015;
      p.r = 1; p.g = 0.7; p.b = 0.3;
    }
    for (let i = 0; i < pc(10); i++) {
      const p = bufEmber.spawn();
      _v4.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize();
      p.pos.copy(point).addScaledVector(_v4, R * 0.3);
      coneVel(p, UP, 1.1);
      p.vel.multiplyScalar(rng.range(1.5, 4));
      p.vel.y += rng.range(2, 5);
      p.age = 0; p.life = rng.range(1.2, 2.2);
      p.s0 = rng.range(0.03, 0.07); p.s1 = 0.01;
      p.r = 1; p.g = rng.range(0.35, 0.55); p.b = 0.12;
      p.flick = rng.range(10, 20);
    }
    for (let i = 0; i < pc(8); i++) {
      _v2.set(rng.gauss(), 1.6, rng.gauss()).normalize(); // up-biased debris cone (_v2: spawnChip's coneVel owns _v4)
      spawnChip(point, _v2, 0.35, 0.32, 0.3, 3, 9, 2);
    }
    boomLight.position.copy(point); // ONE reused light (P3)
    boomLight.visible = true;
    boom.t = 0;
    boom.peak = 26 + R * 14;
    shake.add(2, 0.35);
  }

  // ==================================================================
  //  W2 — paper · generic decal · wave hygiene
  // ==================================================================
  function paperGust() {
    const b = bounds();
    const p = bufPaper.spawn();
    const edge = rng.int(4);
    if (edge === 0) p.pos.set(rng.range(b.minX, b.maxX), rng.range(0.2, 1.4), b.minZ + 0.5);
    else if (edge === 1) p.pos.set(rng.range(b.minX, b.maxX), rng.range(0.2, 1.4), b.maxZ - 0.5);
    else if (edge === 2) p.pos.set(b.minX + 0.5, rng.range(0.2, 1.4), rng.range(b.minZ, b.maxZ));
    else p.pos.set(b.maxX - 0.5, rng.range(0.2, 1.4), rng.range(b.minZ, b.maxZ));
    _v1.set((b.minX + b.maxX) * 0.5 - p.pos.x, 0, (b.minZ + b.maxZ) * 0.5 - p.pos.z).normalize();
    p.vel.copy(_v1).multiplyScalar(rng.range(1.6, 3.2));
    p.vel.y = rng.range(0.2, 0.7);
    p.age = 0; p.life = rng.range(4, 7);
    p.s0 = rng.range(0.14, 0.22);
    p.quat.setFromAxisAngle(_v4.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize(), rng.range(0, Math.PI));
    p.axis.set(rng.gauss(), rng.gauss(), rng.gauss()).normalize();
    p.angSpd = rng.range(2, 6) * rng.sign();
    p.flick = rng.range(0, Math.PI * 2);
    p.r = 0.85; p.g = 0.82; p.b = 0.74;
  }

  /** Contract-level pooled decal: kind 'bullet' | 'blood', optional color (hex or THREE.Color). */
  function decal(point, normal, kind, scale = 0.15, color = null) {
    if (!point || !Number.isFinite(point.x)) return;
    if (color) {
      if (typeof color === 'number') _col.setHex(color);
      else _col.copy(color);
    } else if (kind === 'blood') {
      _col.setRGB(0.48, 0.05, 0.042);
    } else {
      _col.setRGB(0.5, 0.48, 0.45);
    }
    const db = kind === 'blood' ? bloodDecals : bulletDecals;
    placeDecal(db, rng.int(kind === 'blood' ? 4 : 3), point, normal, scale, _col);
  }

  /** H6: fresh floor every wave — release decals/blood, retire live particles. */
  function clearForWave() {
    bulletDecals.releaseAll();
    bloodDecals.releaseAll();
    for (const k in specialDecals) specialDecals[k].releaseAll();
    growers.length = 0;
    bufDust.clear(); bufSmoke.clear(); bufMist.clear(); bufSpark.clear();
    bufEmber.clear(); bufDrop.clear(); bufShard.clear(); bufChips.clear();
    bufPaper.clear(); bufTracer.clear();
    for (let i = 0; i < shellsLive.length; i++) {
      if (shellsLive[i].used) { shellsLive[i].used = false; shellMesh.setMatrixAt(i, _mZero); }
    }
    shellMesh.instanceMatrix.needsUpdate = true;
    boomLight.visible = false;
    boomLight.intensity = 0;
    boom.t = 99;
  }
  // live counts for the debug overlay (§P4)
  function stats() {
    let shellsN = 0;
    for (let i = 0; i < shellsLive.length; i++) if (shellsLive[i].used) shellsN++;
    const live = {
      particles: bufDust.n + bufSmoke.n + bufMist.n + bufSpark.n + bufEmber.n +
        bufDrop.n + bufShard.n + bufChips.n + bufPaper.n,
      decals: bulletDecals.liveCount() + specialDecals.gypsum.liveCount() + specialDecals.wood.liveCount() +
        specialDecals.ding.liveCount() + specialDecals.crack.liveCount() + specialDecals.tear.liveCount() +
        specialDecals.pin.liveCount(),
      blood: bloodDecals.liveCount(),
      tracers: bufTracer.n,
      shells: shellsN,
    };
    // contract wants {live:{...}}; main.js debug reads flat keys — expose both, no self-ref
    return { live, particles: live.particles, decals: live.decals, blood: live.blood, tracers: live.tracers, shells: live.shells };
  }

  // ==================================================================
  //  per-frame sim
  // ==================================================================
  function update(dt) {
    if (!(dt > 0)) return;
    clock += dt;

    // wind is a character (§1): layered seeded sinusoidal gusts
    wind.set(
      Math.sin(clock * 0.31 + windPhaseA) * 0.55 + Math.sin(clock * 0.083 + windPhaseB) * 0.35,
      0,
      Math.sin(clock * 0.24 + windPhaseB) * 0.5 + Math.sin(clock * 0.11 + windPhaseA) * 0.3,
    ).multiplyScalar(1 + 0.5 * Math.sin(clock * 0.53));

    const camQ = ctx.camera.quaternion;
    const camP = ctx.camera.position;
    const floorY = bounds().floorY;

    // ---- dust puffs: billboard, grow ease-out, additive fade ----
    {
      const buf = bufDust;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.multiplyScalar(1 - 2.6 * dt);
        p.pos.addScaledVector(p.vel, dt).addScaledVector(wind, 0.5 * dt);
        p.pos.y += dt * 0.15; // slight buoyancy
        const a = (1 - E.easeInQuad(t)) * 0.9;
        _s.setScalar(p.s0 + (p.s1 - p.s0) * E.easeOutQuad(t));
        _m4.compose(p.pos, camQ, _s);
        buf.mesh.setMatrixAt(i, _m4);
        tint(buf, p, i, a);
      }
      buf.end();
    }

    // ---- smoke / fireball billboards ----
    {
      const buf = bufSmoke;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.multiplyScalar(1 - 1.6 * dt);
        p.pos.addScaledVector(p.vel, dt).addScaledVector(wind, 0.7 * dt);
        p.pos.y += dt * 0.35;
        const a = Math.pow(1 - t, 1.6);
        _s.setScalar(p.s0 + (p.s1 - p.s0) * E.easeOutQuint(t));
        _m4.compose(p.pos, camQ, _s);
        buf.mesh.setMatrixAt(i, _m4);
        tint(buf, p, i, a);
      }
      buf.end();
    }

    // ---- blood mist ----
    {
      const buf = bufMist;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.multiplyScalar(1 - 4 * dt);
        p.pos.addScaledVector(p.vel, dt);
        const a = (1 - E.easeInQuad(t)) * 0.85;
        _s.setScalar(p.s0 + (p.s1 - p.s0) * E.easeOutCubic(t));
        _m4.compose(p.pos, camQ, _s);
        buf.mesh.setMatrixAt(i, _m4);
        tint(buf, p, i, a);
      }
      buf.end();
    }

    // ---- sparks: gravity + strong sideways wind drift, velocity-aligned streak quads ----
    {
      const buf = bufSpark;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.y -= 9.8 * dt;
        p.vel.addScaledVector(wind, 2.4 * dt); // streams sideways off rebar (§1)
        p.vel.multiplyScalar(1 - 1.2 * dt);
        p.pos.addScaledVector(p.vel, dt);
        if (p.pos.y <= floorY + 0.02) { buf.kill(i); i--; continue; } // burnt out on contact
        const sp = p.vel.length();
        if (sp > 1e-4) _v2.copy(p.vel).multiplyScalar(1 / sp); else _v2.copy(UP);
        _v3.copy(camP).sub(p.pos);
        if (_v3.lengthSq() < 1e-6) _v3.set(0, 0, 1);
        _v3.normalize();
        _v4.crossVectors(_v2, _v3);
        if (_v4.lengthSq() < 1e-6) _v4.copy(AX);
        _v4.normalize();
        _v3.crossVectors(_v4, _v2).normalize();
        _q.setFromRotationMatrix(_m4.makeBasis(_v4, _v2, _v3));
        const w = p.s0 + (p.s1 - p.s0) * t;
        _s.set(w, 0.03 + sp * 0.05, 1);
        _m4.compose(p.pos, _q, _s);
        buf.mesh.setMatrixAt(i, _m4);
        tint(buf, p, i, 1 - E.easeInCubic(t) * 0.8);
      }
      buf.end();
    }

    // ---- embers: buoyant, flickering ----
    {
      const buf = bufEmber;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.y += (2.4 - p.vel.length() * 0.25) * dt;
        p.vel.addScaledVector(wind, 1.4 * dt);
        p.vel.multiplyScalar(1 - 0.9 * dt);
        p.pos.addScaledVector(p.vel, dt);
        const a = (1 - t) * (0.72 + 0.28 * Math.sin(p.age * p.flick));
        _s.setScalar(p.s0 + (p.s1 - p.s0) * E.easeOutQuad(t));
        _m4.compose(p.pos, camQ, _s);
        buf.mesh.setMatrixAt(i, _m4);
        tint(buf, p, i, a);
      }
      buf.end();
    }

    // ---- blood droplets: arc under gravity, splat to decal on landing (H1) ----
    {
      const buf = bufDrop;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.y -= 11 * dt;
        p.pos.addScaledVector(p.vel, dt);
        if (p.pos.y <= floorY + 0.015 && p.vel.y < 0) {
          _v3.set(p.pos.x, floorY + 0.012, p.pos.z);
          _col.setRGB(p.r * 0.95, p.g, p.b);
          placeDecal(bloodDecals, rng.int(texBloods.length), _v3, UP,
            rng.range(0.07, 0.16) * (1 + p.s0 * 40), _col, true);
          buf.kill(i); i--; continue;
        }
        _s.setScalar(p.s0);
        _m4.compose(p.pos, camQ, _s);
        buf.mesh.setMatrixAt(i, _m4);
        buf.mesh.setColorAt(i, _col.setRGB(p.r, p.g, p.b));
      }
      buf.end();
    }

    // ---- glass shards: spinning physics, one floor bounce, shrink out ----
    {
      const buf = bufShard;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.y -= 9.8 * dt;
        p.pos.addScaledVector(p.vel, dt);
        if (p.pos.y <= floorY + 0.01 && p.vel.y < 0) {
          if (p.bounces >= 1) { p.vel.set(0, 0, 0); p.angSpd *= 0.2; }
          else {
            p.bounces++;
            p.vel.y *= -0.35; p.vel.x *= 0.6; p.vel.z *= 0.6;
          }
          p.pos.y = floorY + 0.01;
        }
        p.quat.premultiply(_q2.setFromAxisAngle(p.axis, p.angSpd * dt));
        const k = t > 0.8 ? 1 - E.easeInCubic((t - 0.8) / 0.2) : 1;
        _s.setScalar(p.s0 * k);
        _m4.compose(p.pos, p.quat, _s);
        buf.mesh.setMatrixAt(i, _m4);
        buf.mesh.setColorAt(i, _col.setRGB(p.r, p.g, p.b));
      }
      buf.end();
    }

    // ---- chips / splinters / debris: gravity, bounces, shrink out ----
    {
      const buf = bufChips;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.y -= 9.8 * dt;
        p.pos.addScaledVector(p.vel, dt);
        if (p.pos.y <= floorY + 0.012 && p.vel.y < 0) {
          p.pos.y = floorY + 0.012;
          if (p.bounces < 2) {
            p.bounces++;
            p.vel.y *= -0.3;
            p.vel.multiplyScalar(0.55);
          } else p.vel.set(0, 0, 0);
        }
        p.quat.premultiply(_q2.setFromAxisAngle(p.axis, p.angSpd * dt));
        const k = t > 0.75 ? 1 - E.easeInQuad((t - 0.75) / 0.25) : 1;
        _s.setScalar(p.s0 * k);
        _m4.compose(p.pos, p.quat, _s);
        buf.mesh.setMatrixAt(i, _m4);
        buf.mesh.setColorAt(i, _col.setRGB(p.r, p.g, p.b));
      }
      buf.end();
    }

    // ---- paper: flutter + tumble across the floor (W2) ----
    {
      const buf = bufPaper;
      const b = bounds();
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { buf.kill(i); i--; continue; }
        p.vel.y -= 3.2 * dt; // light — flutters down slowly
        p.vel.x += (wind.x * 1.8 - p.vel.x * 0.35) * dt;
        p.vel.z += (wind.z * 1.8 - p.vel.z * 0.35) * dt;
        p.vel.y += Math.sin(p.age * 5 + p.flick) * 0.9 * dt; // slip-flutter oscillation
        p.pos.addScaledVector(p.vel, dt);
        if (p.pos.y < floorY + 0.02) {
          p.pos.y = floorY + 0.02 + Math.abs(Math.sin(p.age * 6)) * 0.05;
          if (p.vel.y < 0) p.vel.y *= -0.2;
        }
        if (p.pos.x < b.minX || p.pos.x > b.maxX || p.pos.z < b.minZ || p.pos.z > b.maxZ) {
          buf.kill(i); i--; continue;
        }
        p.quat.premultiply(_q2.setFromAxisAngle(p.axis, p.angSpd * dt));
        const k = t > 0.85 ? 1 - E.easeInQuad((t - 0.85) / 0.15) : 1;
        _s.setScalar(p.s0 * k);
        _m4.compose(p.pos, p.quat, _s);
        buf.mesh.setMatrixAt(i, _m4);
        buf.mesh.setColorAt(i, _col.setRGB(p.r * k, p.g * k, p.b * k));
      }
      buf.end();
    }

    // ---- tracers: stretched camera-facing beams, ease-out shrink-out, near-miss probe ----
    nearMissCooldown = Math.max(0, nearMissCooldown - dt);
    {
      const buf = bufTracer;
      for (let i = 0; i < buf.n; i++) {
        const p = buf.parts[i];
        p.age += dt;
        const t = E.clamp01(p.age / p.life);
        if (t >= 1) { buf.kill(i); i--; continue; }
        const ti = p.obj;
        // nearest approach of enemy tracers to the player head → sonic crack cue (3/s cap)
        if (ti.enemy && !ti.nearMissed && nearMissCooldown <= 0 && state.phase === 'playing') {
          _v1.copy(ti.to).sub(ti.from);
          const len2 = _v1.lengthSq();
          if (len2 > 1e-6) {
            _v2.copy(state.move.pos); _v2.y += 1.6;
            _v3.copy(_v2).sub(ti.from);
            let s = _v3.dot(_v1) / len2;
            s = s < 0 ? 0 : s > 1 ? 1 : s;
            _v4.copy(ti.from).addScaledVector(_v1, s);
            const d = _v4.distanceTo(_v2);
            if (d < 1.6) {
              ti.nearMissed = true;
              nearMissCooldown = 1 / 3;
              _nmPayload.intensity = Math.min(1, 0.35 + (1 - d / 1.6) * 0.65);
              bus.emit('tracer:nearmiss', _nmPayload);
            }
          }
        }
        const k = E.easeOutQuad(t);
        const a = 1 - k;
        _v1.copy(ti.to).sub(ti.from);
        const full = _v1.length();
        const L = full > 1e-4 ? full * (1 - k * 0.55) : 0;
        if (L < 1e-3 || a <= 0) { buf.kill(i); i--; continue; }
        _v1.multiplyScalar(1 / full); // unit from→to
        _v4.copy(ti.to).addScaledVector(_v1, -L * 0.5); // tail-anchored mid point
        _v3.copy(camP).sub(_v4);
        if (_v3.lengthSq() < 1e-6) _v3.set(0, 0, 1);
        _v3.normalize();
        _v2.crossVectors(_v1, _v3);
        if (_v2.lengthSq() < 1e-6) _v2.copy(AX);
        _v2.normalize();
        _v3.crossVectors(_v2, _v1).normalize();
        _q.setFromRotationMatrix(_m4.makeBasis(_v2, _v1, _v3));
        const w = p.s0 + (p.s1 - p.s0) * k;
        _s.set(w, L, 1);
        _m4.compose(_v4, _q, _s);
        buf.mesh.setMatrixAt(i, _m4);
        tint(buf, p, i, a);
      }
      buf.end();
    }

    // ---- shells: bounce vs floor + arena bounds, tumble, land → bus tinkle ----
    {
      let anyLive = false;
      for (let i = 0; i < shellsLive.length; i++) {
        const s = shellsLive[i];
        if (!s.used) continue;
        anyLive = true;
        s.age += dt;
        const t = s.age / s.life;
        if (t >= 1) { s.used = false; shellMesh.setMatrixAt(i, _mZero); continue; }
        if (!s.landed) {
          s.vel.y -= 9.8 * dt;
          s.pos.addScaledVector(s.vel, dt);
          const b = bounds();
          if (s.pos.x < b.minX || s.pos.x > b.maxX) { s.pos.x = Math.min(Math.max(s.pos.x, b.minX), b.maxX); s.vel.x *= -0.4; }
          if (s.pos.z < b.minZ || s.pos.z > b.maxZ) { s.pos.z = Math.min(Math.max(s.pos.z, b.minZ), b.maxZ); s.vel.z *= -0.4; }
          if (s.pos.y <= floorY + 0.012 && s.vel.y < 0) {
            s.pos.y = floorY + 0.012;
            s.bounces++;
            s.vel.y *= -0.42;
            s.vel.x *= 0.6; s.vel.z *= 0.6;
            s.ang *= 0.55;
            if (s.bounces >= 3 || Math.abs(s.vel.y) < 0.4) {
              s.landed = true;
              s.vel.set(0, 0, 0);
              s.age = Math.max(s.age, s.life * 0.5); // rest, then shrink away
              bus.emit('shell:land', null); // audio tinkle (F4)
            }
          }
          s.quat.premultiply(_q2.setFromAxisAngle(s.axis, s.ang * dt));
        }
        const k = t > 0.8 ? 1 - E.easeInQuad((t - 0.8) / 0.2) : 1;
        _s.setScalar(0.024 * k);
        _m4.compose(s.pos, s.landed ? s.restQuat : s.quat, _s);
        shellMesh.setMatrixAt(i, _m4);
      }
      if (anyLive) shellMesh.instanceMatrix.needsUpdate = true;
    }

    // ---- explosion light: exponential decay (C5, never a linear ramp) ----
    if (boom.t < 0.6) {
      boom.t += dt;
      boomLight.intensity = boom.peak * Math.exp(-boom.t * 7);
      if (boom.t >= 0.6) { boomLight.visible = false; boomLight.intensity = 0; boom.t = 99; }
    }

    // ---- growing corpse pools (H5) — owner token guards stolen slots ----
    for (let i = growers.length - 1; i >= 0; i--) {
      const g = growers[i];
      if (g.slot.owner !== g) { growers.splice(i, 1); continue; } // decal pool stole our slot
      if (g.t >= g.dur) continue;
      g.t = Math.min(g.dur, g.t + dt);
      const sc = g.from + (g.to - g.from) * E.easeOutQuint(g.t / g.dur);
      _s.set(sc, sc, 1);
      _m4.compose(g.slot.pos, g.slot.quat, _s);
      g.slot.mesh.setMatrixAt(g.slot.idx, _m4);
      g.slot.mesh.instanceMatrix.needsUpdate = true;
    }

    // ---- ambient paper gust timer (W2) ----
    if (state.phase === 'playing') {
      paperTimer -= dt;
      if (paperTimer <= 0) {
        paperTimer = rng.range(6, 13);
        paperGust();
        if (rng.next() < 0.3) paperGust();
      }
    }
  }

  // env explosions arrive over the bus too (§8 catalog)
  const offExplosion = bus.on('explosion', (e) => { if (e && e.point) explosion(e.point, e.radius || 4); });
  void offExplosion;

  return {
    update, impact, bloodHit, killBlood, bodyBlood, decal, tracer, shell,
    muzzleSmoke, explosion, paperGust, clearForWave, stats,
    resetGlass() { glassEnergy.clear(); },
  };
}
