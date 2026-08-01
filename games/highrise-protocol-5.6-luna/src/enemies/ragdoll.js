import * as THREE from "three";
import { Pool } from "../core/pool.js";

export const TUNING = { maxRagdolls: 8, lifetime: 6, gravity: 12 }; // units: count, seconds, m/s2

export class RagdollManager {
  constructor(scene) {
    this.scene = scene;
    this.pool = new Pool({ create: () => this.createRagdoll(), reset: (item) => this.reset(item), max: TUNING.maxRagdolls });
  }

  createRagdoll() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0x17242b, roughness: 0.86, metalness: 0.12 });
    for (let i = 0; i < 5; i += 1) {
      const part = new THREE.Mesh(new THREE.BoxGeometry(0.18 + (i === 0 ? 0.22 : 0), 0.28 + (i === 0 ? 0.42 : 0), 0.2), material);
      part.castShadow = true;
      group.add(part);
    }
    group.visible = false;
    this.scene.add(group);
    return { group, active: false, life: 0, velocity: new THREE.Vector3(), spin: new THREE.Vector3(), visual: null };
  }

  reset(item) {
    if (item.visual) {
      item.group.remove(item.visual);
      item.visual.visible = false;
      item.visual = null;
    }
    item.group.children.forEach((child) => { child.visible = true; });
    item.group.visible = false;
    item.life = 0;
    item.velocity.set(0, 0, 0);
    item.spin.set(0, 0, 0);
  }

  spawn(enemy, direction = new THREE.Vector3()) {
    const ragdoll = this.pool.acquire();
    ragdoll.group.visible = true;
    ragdoll.group.position.copy(enemy.group.position);
    ragdoll.group.rotation.copy(enemy.group.rotation);
    ragdoll.life = TUNING.lifetime;
    ragdoll.velocity.set(direction.x * 2.2, 2.6, direction.z * 2.2);
    ragdoll.spin.set(2.3, 1.7, 1.4);
    if (enemy.visualRoot) {
      ragdoll.group.children.forEach((child) => { child.visible = false; });
      ragdoll.visual = enemy.visualRoot;
      ragdoll.visual.visible = true;
      ragdoll.visual.position.set(0, 0, 0);
      ragdoll.visual.rotation.set(0, 0, 0);
      ragdoll.group.add(ragdoll.visual);
    }
    const offsets = [[0, 1.12, 0], [0, 1.82, 0], [-0.28, 1.1, 0], [0.28, 1.1, 0], [0, 0.32, 0]];
    for (let index = 0; index < offsets.length; index += 1) ragdoll.group.children[index].position.set(...offsets[index]);
  }

  update(dt) {
    for (let index = this.pool.active.length - 1; index >= 0; index -= 1) {
      const item = this.pool.active[index];
      item.life -= dt;
      item.velocity.y -= TUNING.gravity * dt;
      item.group.position.addScaledVector(item.velocity, dt);
      item.group.rotation.x += item.spin.x * dt;
      item.group.rotation.y += item.spin.y * dt;
      item.group.rotation.z += item.spin.z * dt;
      if (item.group.position.y < 0) {
        item.group.position.y = 0;
        item.velocity.y *= -0.22;
        item.velocity.x *= 0.78;
        item.velocity.z *= 0.78;
        item.spin.multiplyScalar(0.88);
      }
      if (item.life <= 0) this.pool.release(item);
    }
  }
}
