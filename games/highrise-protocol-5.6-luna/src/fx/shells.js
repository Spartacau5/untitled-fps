import * as THREE from "three";
import { Pool } from "../core/pool.js";

export const TUNING = {
  maxShells: 50,
  radiusTop: 0.007,
  radiusBottom: 0.009,
  length: 0.034,
  gravity: 13,
  lifetime: 4.5,
  bounce: 0.44,
}; // units: count, meters, m/s2, seconds, ratio

export class ShellSystem {
  constructor(scene, rng, camera = null) {
    this.scene = scene;
    this.rng = rng;
    this.camera = camera;
    this.spawnQuaternion = new THREE.Quaternion();
    this.pool = new Pool({ create: () => this.createShell(), reset: (item) => this.reset(item), max: TUNING.maxShells });
  }

  createShell() {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(TUNING.radiusTop, TUNING.radiusBottom, TUNING.length, 8), new THREE.MeshStandardMaterial({ color: 0xc58a47, metalness: 0.86, roughness: 0.28 }));
    mesh.visible = false;
    this.scene.add(mesh);
    return { mesh, active: false, life: 0, velocity: new THREE.Vector3(), spin: new THREE.Vector3() };
  }

  reset(item) { item.mesh.visible = false; item.life = 0; item.velocity.set(0, 0, 0); item.spin.set(0, 0, 0); }

  spawn(position) {
    const item = this.pool.acquire();
    item.mesh.visible = true;
    item.mesh.position.copy(position);
    item.life = TUNING.lifetime;
    item.velocity.set(1.05 + this.rng.range(0, 0.35), this.rng.range(0.72, 1.02), this.rng.signed() * 0.22);
    if (this.camera) item.velocity.applyQuaternion(this.camera.getWorldQuaternion(this.spawnQuaternion));
    item.spin.set(this.rng.range(7, 13), this.rng.range(4, 9), this.rng.range(4, 10));
    return item;
  }

  update(dt) {
    for (let index = this.pool.active.length - 1; index >= 0; index -= 1) {
      const item = this.pool.active[index];
      item.life -= dt;
      item.velocity.y -= TUNING.gravity * dt;
      item.mesh.position.addScaledVector(item.velocity, dt);
      item.mesh.rotation.x += item.spin.x * dt;
      item.mesh.rotation.y += item.spin.y * dt;
      item.mesh.rotation.z += item.spin.z * dt;
      if (item.mesh.position.y < 0.035) {
        item.mesh.position.y = 0.035;
        item.velocity.y = Math.abs(item.velocity.y) * TUNING.bounce;
        item.velocity.x *= 0.78;
        item.velocity.z *= 0.78;
        item.spin.multiplyScalar(0.8);
      }
      if (item.life <= 0) this.pool.release(item);
    }
  }
}
