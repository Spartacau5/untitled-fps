// ---------------------------------------------------------------------------
// enemies/enemy.js — three procedural humanoid types with personality (E1):
// Rusher (fast melee), Gunner (cover + suppressive fire), Heavy (armor
// plates that visibly fly off before health damage). Shared geometry cache;
// hit reactions are directional flinch springs (E3).
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Spring3, damp } from '../core/spring.js';

export const ENEMY_TYPES = {
  rusher: { speed: 5.6, hp: 68, radius: 0.34, scale: 1.0, score: 100,
    body: 0x4a2b2b, limb: 0x2c2023, accent: 0xff5040 },
  gunner: { speed: 3.4, hp: 92, radius: 0.36, scale: 1.04, score: 150,
    body: 0x2f3a46, limb: 0x232a33, accent: 0x5fa8ff },
  heavy: { speed: 1.7, hp: 175, radius: 0.48, scale: 1.26, score: 300,
    body: 0x3e4531, limb: 0x2a2e24, accent: 0xffb454, plates: 4 },
};

let GEO = null;
function geos() {
  if (GEO) return GEO;
  GEO = {
    head: new THREE.BoxGeometry(0.27, 0.29, 0.27),
    visor: new THREE.BoxGeometry(0.23, 0.07, 0.02),
    torso: new THREE.BoxGeometry(0.46, 0.58, 0.27),
    hips: new THREE.BoxGeometry(0.4, 0.2, 0.25),
    arm: new THREE.BoxGeometry(0.13, 0.54, 0.13),
    leg: new THREE.BoxGeometry(0.16, 0.7, 0.16),
    gun: new THREE.BoxGeometry(0.06, 0.08, 0.46),
    plate: new THREE.BoxGeometry(0.21, 0.26, 0.05),
  };
  return GEO;
}

export class Enemy {
  constructor(type, scene, rng) {
    this.type = type;
    this.cfg = ENEMY_TYPES[type];
    this.rng = rng;
    this.hp = this.cfg.hp;
    this.dead = false;
    this.pos = new THREE.Vector3();
    this.yaw = 0; this._yawTarget = 0;
    this.phase = rng.next() * Math.PI * 2;
    this.flinch = new Spring3(240, 20, 0, 0, 0);
    this._flinchRot = 0;
    this.speedMult = 1;
    // AI state
    this.state = 'spawn'; this.stateT = 0;
    this.cover = null; this.reactionT = 0; this.burstLeft = 0; this.shotT = 0;
    this.meleeCd = 0; this.pushing = false; this.flanking = false;
    this._build(scene);
  }

  _build(scene) {
    const g = geos(), cfg = this.cfg;
    const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.body, roughness: 0.75, metalness: 0.1 });
    const limbMat = new THREE.MeshStandardMaterial({ color: cfg.limb, roughness: 0.85, metalness: 0.05 });
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x111111, emissive: cfg.accent, emissiveIntensity: 1.6, roughness: 0.4,
    });
    const plateMat = new THREE.MeshStandardMaterial({ color: 0x565b4a, roughness: 0.5, metalness: 0.6 });

    const root = new THREE.Group();
    const tag = (mesh, part) => { mesh.userData = { enemy: this, part }; this.hitMeshes.push(mesh); };
    this.hitMeshes = [];

    const torso = new THREE.Mesh(g.torso, bodyMat); torso.position.y = 1.14;
    const hips = new THREE.Mesh(g.hips, limbMat); hips.position.y = 0.76;
    const head = new THREE.Mesh(g.head, bodyMat); head.position.y = 1.58;
    head.scale.setScalar(1.35); // E3: generous head hitbox (2x-ish volume)
    const visor = new THREE.Mesh(g.visor, accentMat); visor.position.set(0, 1.60, -0.17);
    tag(head, 'head'); tag(torso, 'body'); tag(hips, 'body');

    const armL = new THREE.Mesh(g.arm, limbMat); armL.position.set(-0.31, 1.12, 0);
    const armR = new THREE.Mesh(g.arm, limbMat); armR.position.set(0.31, 1.12, 0);
    tag(armL, 'limb'); tag(armR, 'limb');
    const legL = new THREE.Mesh(g.leg, limbMat); legL.position.set(-0.12, 0.36, 0);
    const legR = new THREE.Mesh(g.leg, limbMat); legR.position.set(0.12, 0.36, 0);
    tag(legL, 'limb'); tag(legR, 'limb');

    this.armL = armL; this.armR = armR; this.legL = legL; this.legR = legR; this.torso = torso;
    root.add(torso, hips, head, visor, armL, armR, legL, legR);

    // gun + muzzle tip for gunner/heavy
    if (this.type !== 'rusher') {
      const gun = new THREE.Mesh(g.gun, new THREE.MeshStandardMaterial({ color: 0x181a1e, roughness: 0.4, metalness: 0.7 }));
      gun.position.set(0.3, 1.18, -0.28);
      tag(gun, 'limb');
      root.add(gun);
      this.gunTip = new THREE.Object3D();
      this.gunTip.position.set(0.3, 1.2, -0.55);
      root.add(this.gunTip);
    }

    // Heavy armor plates (E1): fly off under fire before health damage.
    this.plates = [];
    if (cfg.plates) {
      const slots = [
        [0, 1.24, -0.17, 0], [-0.14, 1.02, -0.16, 0.1], [0.14, 1.02, -0.16, -0.1], [0, 1.12, 0.17, Math.PI],
      ];
      for (let i = 0; i < cfg.plates; i++) {
        const p = new THREE.Mesh(g.plate, plateMat.clone());
        const s = slots[i];
        p.position.set(s[0], s[1], s[2]);
        p.rotation.y = s[3];
        p.userData = { enemy: this, part: 'armor', plate: this.plates.length };
        root.add(p);
        this.hitMeshes.push(p);
        this.plates.push({ mesh: p, hp: 32 });
      }
    }

    root.scale.setScalar(cfg.scale);
    root.traverse((o) => { if (o.isMesh) { o.castShadow = true; } });
    this.group = root;
    scene.add(root);
  }

  get eyeHeight() { return 1.58 * this.cfg.scale; }

  gunTipWorld(out) {
    if (this.gunTip) return this.gunTip.getWorldPosition(out);
    return out.set(this.pos.x, this.pos.y + this.eyeHeight * 0.8, this.pos.z);
  }

  // Returns {died, headshot, score, armored}
  hit(part, dmg, dir, point, ctx, plateIdx) {
    if (this.dead) return { died: false, headshot: false, score: 0 };
    const headshot = part === 'head';

    // Heavy plates absorb everything except headshots (E1)
    if (this.plates.length > 0 && !headshot) {
      let plate = (typeof plateIdx === 'number') ? this.plates[plateIdx] : null;
      if (!plate || !plate.mesh.visible) plate = this.plates.find((p) => p.mesh.visible);
      if (plate) {
        plate.hp -= dmg;
        this.flinch.impulse(-dir.x * 0.9, 0.4, -dir.z * 0.9);
        if (plate.hp <= 0) {
          plate.mesh.visible = false;
          ctx.fx.plateBreak(point || this.pos, dir);
          ctx.audio.reloadFns.plateClank(this.pos.distanceTo(ctx.controller.pos));
        }
        return { died: false, headshot: false, score: 0, armored: true };
      }
    }

    this.hp -= dmg;
    // directional flinch (E3); heavier stagger on headshots
    const k = headshot ? 2.6 : 1.4;
    this.flinch.impulse(-dir.x * k, headshot ? 1.2 : 0.5, -dir.z * k);
    if (headshot) this._flinchRot = (this.rng.next() - 0.5) * 0.5;

    if (this.hp <= 0) {
      this.dead = true;
      return {
        died: true, headshot,
        score: this.cfg.score + (headshot ? 50 : 0),
      };
    }
    return { died: false, headshot, score: 0 };
  }

  // dt fixed step. Animation: gait on phase clock, flinch spring, yaw ease.
  update(dt) {
    if (this.dead) return;
    const cfg = this.cfg;
    this.flinch.update(dt);
    this._flinchRot = damp(this._flinchRot, 0, 8, dt);
    this.yaw = damp(this.yaw, this._yawTarget, 10, dt);

    const moving = this._moving ? 1 : 0;
    this.phase += dt * (2.2 + this._speedNow * 0.9);
    const s = Math.sin(this.phase) * moving;
    this.legL.rotation.x = s * 0.85;
    this.legR.rotation.x = -s * 0.85;
    this.armL.rotation.x = -s * 0.6;
    this.armR.rotation.x = s * 0.45;

    const fl = this.flinch.value;
    this.group.position.set(
      this.pos.x + fl.x,
      Math.max(0, fl.y) + (moving ? Math.abs(Math.cos(this.phase)) * 0.04 : 0),
      this.pos.z + fl.z
    );
    this.group.rotation.set(0, this.yaw, this._flinchRot);
    // spawn-in scale animation
    if (this.state === 'spawn') {
      const t = Math.min(this.stateT / 0.45, 1);
      const e = 1 - Math.pow(1 - t, 3);
      this.group.scale.setScalar(cfg.scale * (0.2 + 0.8 * e));
    } else {
      this.group.scale.setScalar(cfg.scale);
    }
  }

  dispose(scene) {
    scene.remove(this.group);
  }
}

// ---------------------------------------------------------------------------
// EnemyManager — registry: spawning, hitbox registration, death handling.
// ---------------------------------------------------------------------------
export class EnemyManager {
  constructor(ctx) {
    this.ctx = ctx;
    this.list = [];
  }

  reset() {
    for (const e of this.list) {
      e.dispose(this.ctx.scene);
      for (const m of e.hitMeshes) this.ctx.targets.unregister(m);
    }
    this.list.length = 0;
  }

  spawn(type) {
    const ctx = this.ctx;
    const e = new Enemy(type, ctx.scene, ctx.rng);
    const sp = ctx.level.randomSpawn(ctx.rng);
    e.pos.set(sp.x, 0, sp.z);
    e._yawTarget = Math.atan2(-(ctx.controller.pos.x - sp.x), -(ctx.controller.pos.z - sp.z));
    for (const m of e.hitMeshes) ctx.targets.register(m);
    this.list.push(e);
    return e;
  }

  kill(e, point, dir) {
    const ctx = this.ctx;
    ctx.level.releaseCover(e);
    ctx.ragdolls.spawn(e.pos, e.yaw, e.type, dir);
    e.dispose(ctx.scene);
    for (const m of e.hitMeshes) ctx.targets.unregister(m);
    const i = this.list.indexOf(e);
    if (i >= 0) this.list.splice(i, 1);
  }

  update(dt) {
    for (const e of this.list) e.update(dt);
  }
}
