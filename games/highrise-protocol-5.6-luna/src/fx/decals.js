import * as THREE from "three";
import { Pool } from "../core/pool.js";

export const TUNING = { maxDecals: 120, offset: 0.006, lifetime: 24 }; // units: count, meters, seconds

export class DecalSystem {
  constructor(scene) {
    this.scene = scene;
    this.pool = new Pool({ create: () => this.createDecal(), reset: (item) => this.reset(item), max: TUNING.maxDecals });
  }

  createDecal() {
    const mesh = new THREE.Mesh(new THREE.CircleGeometry(0.075, 7), new THREE.MeshBasicMaterial({ color: 0x1a2024, transparent: true, opacity: 0.72, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    mesh.visible = false;
    this.scene.add(mesh);
    return { mesh, active: false, life: 0 };
  }

  reset(item) { item.mesh.visible = false; item.life = 0; }

  spawn(point, normal, color = 0x1a2024, scale = 1) {
    const item = this.pool.acquire();
    item.mesh.visible = true;
    item.mesh.position.copy(point).addScaledVector(normal, TUNING.offset);
    item.mesh.material.color.set(color);
    item.mesh.scale.setScalar(scale);
    item.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal.clone().normalize());
    item.life = TUNING.lifetime;
    return item;
  }

  update(dt) {
    for (let index = this.pool.active.length - 1; index >= 0; index -= 1) {
      const item = this.pool.active[index];
      item.life -= dt;
      item.mesh.material.opacity = Math.min(0.74, item.life / 2.5);
      if (item.life <= 0) this.pool.release(item);
    }
  }
}
