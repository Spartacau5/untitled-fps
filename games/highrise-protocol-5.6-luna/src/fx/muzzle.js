import * as THREE from "three";
import { Pool } from "../core/pool.js";

export const TUNING = {
  maxFlashes: 8,
  life: 0.065,
  flashSize: 0.055,
  lightLife: 0.05,
  lightDistance: 0.48,
  lightIntensity: 0.22,
}; // units: count, seconds, meters, intensity

export class MuzzleFX {
  constructor(scene, camera = null) {
    this.scene = scene;
    this.camera = camera;
    this.cameraWorldPosition = new THREE.Vector3();
    this.effectPosition = new THREE.Vector3();
    this.flashTexture = this.createFlashTexture();
    this.pool = new Pool({ create: () => this.createFlash(), reset: (item) => this.reset(item), max: TUNING.maxFlashes });
    this.light = new THREE.PointLight(0xffb25c, 0, TUNING.lightDistance, 2.2);
    scene.add(this.light);
    this.lightLife = 0;
  }

  createFlashTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 220, 1)");
    gradient.addColorStop(0.2, "rgba(255, 218, 112, 0.95)");
    gradient.addColorStop(0.55, "rgba(255, 150, 35, 0.42)");
    gradient.addColorStop(1, "rgba(255, 110, 20, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  createFlash() {
    // A camera-facing sprite keeps the muzzle flash readable without a
    // near-camera cone whose projected sides can become a giant polygon.
    const mesh = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this.flashTexture,
      color: 0xffb04c,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
    }));
    mesh.scale.set(TUNING.flashSize, TUNING.flashSize, 1);
    mesh.renderOrder = 20;
    mesh.visible = false;
    this.scene.add(mesh);
    return { mesh, active: false, life: 0, size: TUNING.flashSize };
  }

  reset(item) { item.mesh.visible = false; item.life = 0; item.size = TUNING.flashSize; item.mesh.scale.setScalar(TUNING.flashSize); }

  flash(position, direction) {
    const item = this.pool.acquire();
    item.mesh.visible = true;
    let effectPosition = position;
    let distance = 0.8;
    if (this.camera) {
      this.camera.getWorldPosition(this.cameraWorldPosition);
      distance = position.distanceTo(this.cameraWorldPosition);
      this.effectPosition.copy(position);
      // Guard malformed presentation pivots without detaching valid muzzle FX
      // from the animated rifle.
      if (!Number.isFinite(distance) || distance < 0.16 || distance > 1.8) {
        this.effectPosition.set(0, -0.02, -0.62);
        this.camera.localToWorld(this.effectPosition);
        distance = 0.62;
      }
      effectPosition = this.effectPosition;
    }
    item.mesh.position.copy(effectPosition);
    const flashSize = THREE.MathUtils.clamp(distance * 0.105, 0.025, TUNING.flashSize);
    item.size = flashSize;
    item.mesh.scale.set(flashSize, flashSize, 1);
    this.light.distance = THREE.MathUtils.clamp(distance * 1.2, 0.2, TUNING.lightDistance);
    item.life = TUNING.life;
    this.light.position.copy(effectPosition);
    this.light.intensity = 0;
    this.lightLife = TUNING.lightLife;
  }

  update(dt) {
    for (let index = this.pool.active.length - 1; index >= 0; index -= 1) {
      const item = this.pool.active[index];
      item.life -= dt;
      item.mesh.material.opacity = Math.max(0, item.life / TUNING.life) * 0.92;
      item.mesh.scale.setScalar(item.size * (0.75 + (1 - item.life / TUNING.life) * 0.5));
      if (item.life <= 0) this.pool.release(item);
    }
    this.lightLife -= dt;
    this.light.intensity = Math.max(0, this.lightLife / TUNING.lightLife) * TUNING.lightIntensity;
  }
}
