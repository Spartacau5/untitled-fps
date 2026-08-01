import * as THREE from "three";
import { Pool } from "../core/pool.js";

export const TUNING = { maxParticles: 260, gravity: 2.4, drag: 0.82 }; // units: count, m/s2, ratio

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.pool = new Pool({ create: () => this.createParticle(), reset: (item) => this.reset(item), max: TUNING.maxParticles });
  }

  createParticle() {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.045, 5, 4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }));
    mesh.visible = false;
    this.scene.add(mesh);
    return { mesh, active: false, life: 0, maxLife: 0, velocity: new THREE.Vector3(), gravity: TUNING.gravity, size: 1 };
  }

  reset(item) { item.mesh.visible = false; item.life = 0; item.velocity.set(0, 0, 0); item.mesh.scale.setScalar(1); }

  spawn(position, color, size = 1, velocity = new THREE.Vector3(), life = 0.35, gravity = TUNING.gravity) {
    const item = this.pool.acquire();
    item.mesh.visible = true;
    item.mesh.position.copy(position);
    item.mesh.material.color.set(color);
    item.mesh.material.opacity = 0.82;
    item.mesh.scale.setScalar(size);
    item.size = size;
    item.life = life;
    item.maxLife = life;
    item.velocity.copy(velocity);
    item.gravity = gravity;
    return item;
  }

  burst(position, color, count, spread, size, life, rng) {
    for (let i = 0; i < count; i += 1) {
      const velocity = new THREE.Vector3(rng.signed() * spread, rng.range(0.1, spread), rng.signed() * spread);
      this.spawn(position, color, rng.range(size * 0.55, size * 1.15), velocity, rng.range(life * 0.65, life * 1.2));
    }
  }

  update(dt) {
    for (let index = this.pool.active.length - 1; index >= 0; index -= 1) {
      const item = this.pool.active[index];
      item.life -= dt;
      item.velocity.y -= item.gravity * dt;
      item.velocity.multiplyScalar(Math.max(0, 1 - TUNING.drag * dt));
      item.mesh.position.addScaledVector(item.velocity, dt);
      item.mesh.material.opacity = Math.max(0, item.life / item.maxLife) * 0.82;
      item.mesh.scale.setScalar(item.size || 1);
      if (item.life <= 0) this.pool.release(item);
    }
  }
}
