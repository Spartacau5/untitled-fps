// ---------------------------------------------------------------------------
// enemies/ragdoll.js — physical deaths (E4): bodies burst into ballistic
// parts that tumble over geometry, persist a few seconds, then fade away.
// Hard cap via pool — oldest ragdoll replaced first (P1).
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Pool } from '../core/pool.js';
import { ENEMY_TYPES } from './enemy.js';

const TUNING = {
  CAP: 8,
  LIFE: 5.5,          // s visible
  FADE: 1.4,          // s fade-out
  GRAVITY: 17,
  RESTITUTION: 0.34,
  FRICTION: 0.72,
};

// part layout: [x, y, z, w, h, d, matIndex]
const PARTS = [
  [0, 1.58, 0, 0.27, 0.29, 0.27, 0],        // head
  [0, 1.14, 0, 0.46, 0.58, 0.27, 0],        // torso
  [0, 0.76, 0, 0.4, 0.2, 0.25, 1],          // hips
  [-0.31, 1.12, 0, 0.13, 0.54, 0.13, 1],    // arm L
  [0.31, 1.12, 0, 0.13, 0.54, 0.13, 1],     // arm R
  [-0.12, 0.36, 0, 0.16, 0.7, 0.16, 1],     // leg L
  [0.12, 0.36, 0, 0.16, 0.7, 0.16, 1],      // leg R
];

export class Ragdolls {
  constructor(scene, collision) {
    this.collision = collision;
    this.pool = new Pool(() => {
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.8, transparent: true });
      const limbMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.85, transparent: true });
      const parts = PARTS.map((p) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(p[3], p[4], p[5]), p[6] === 0 ? bodyMat : limbMat);
        mesh.castShadow = true;
        mesh.visible = false;
        scene.add(mesh);
        return {
          mesh, half: Math.max(p[3], p[4], p[5]) * 0.5,
          pos: new THREE.Vector3(), vel: new THREE.Vector3(),
          ang: new THREE.Vector3(),
        };
      });
      return { parts, bodyMat, limbMat, life: 0, active: false };
    }, TUNING.CAP);
  }

  spawn(pos, yaw, type, impulseDir) {
    const cfg = ENEMY_TYPES[type];
    const r = this.pool.acquire();
    r.life = 0; r.active = true;
    r.bodyMat.color.setHex(cfg.body); r.limbMat.color.setHex(cfg.limb);
    r.bodyMat.opacity = 1; r.limbMat.opacity = 1;
    const s = cfg.scale;
    const fwdX = -Math.sin(yaw), fwdZ = -Math.cos(yaw);
    for (let i = 0; i < PARTS.length; i++) {
      const def = PARTS[i], part = r.parts[i];
      part.mesh.visible = true;
      part.mesh.scale.setScalar(s);
      // local offset rotated by yaw
      const ox = def[0], oz = def[2];
      const rx = ox * Math.cos(yaw) + oz * Math.sin(yaw);
      const rz = -ox * Math.sin(yaw) + oz * Math.cos(yaw);
      part.pos.set(pos.x + rx * s, def[1] * s, pos.z + rz * s);
      // death impulse: away from damage direction + upward spray
      const kick = 1.6 + Math.random() * 1.8;
      part.vel.set(
        -impulseDir.x * kick + (Math.random() - 0.5) * 2.2 - fwdX * 0.8,
        1.4 + Math.random() * 2.4,
        -impulseDir.z * kick + (Math.random() - 0.5) * 2.2 - fwdZ * 0.8
      );
      part.ang.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
      part.mesh.rotation.set(Math.random() * 0.5, yaw, Math.random() * 0.5);
    }
  }

  update(dt) {
    const T = TUNING;
    this.pool.forEach((r) => {
      if (!r.active) return;
      r.life += dt;
      let fade = 1;
      if (r.life > T.LIFE) {
        fade = 1 - (r.life - T.LIFE) / T.FADE;
        if (fade <= 0) {
          for (const p of r.parts) p.mesh.visible = false;
          r.active = false;
          this.pool.release(r);
          return;
        }
        r.bodyMat.opacity = fade; r.limbMat.opacity = fade;
      }
      for (const p of r.parts) {
        p.vel.y -= T.GRAVITY * dt;
        p.pos.addScaledVector(p.vel, dt);
        const floor = p.half * 0.6;
        if (p.pos.y < floor) {
          p.pos.y = floor;
          if (p.vel.y < 0) {
            p.vel.y *= -T.RESTITUTION;
            p.vel.x *= T.FRICTION; p.vel.z *= T.FRICTION;
            p.ang.multiplyScalar(0.65);
            if (Math.abs(p.vel.y) < 0.4) p.vel.y = 0;
          }
        }
        // keep on the slab
        if (p.pos.x > 21) { p.pos.x = 21; p.vel.x *= -0.4; }
        if (p.pos.x < -21) { p.pos.x = -21; p.vel.x *= -0.4; }
        if (p.pos.z > 14) { p.pos.z = 14; p.vel.z *= -0.4; }
        if (p.pos.z < -14) { p.pos.z = -14; p.vel.z *= -0.4; }
        p.mesh.position.copy(p.pos);
        p.mesh.rotation.x += p.ang.x * dt;
        p.mesh.rotation.y += p.ang.y * dt;
        p.mesh.rotation.z += p.ang.z * dt;
        p.ang.multiplyScalar(1 - 0.8 * dt);
      }
    });
  }

  reset() {
    this.pool.forEach((r) => { for (const p of r.parts) p.mesh.visible = false; r.active = false; });
    this.pool.releaseAll();
  }

  stats() { return this.pool.stats().active; }
}
