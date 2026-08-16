import * as THREE from 'three';
import { makeGlow } from '../engine/Textures.js';

// F4/G5: muzzle flash sprite + 1-2 frame dynamic light that licks nearby
// geometry, plus lingering smoke wisps. The light is one of the few dynamic
// lights (P3).
export class MuzzleFlash {
  constructor(scene, glowTex = null) {
    this.scene = scene;
    this.tex = glowTex || makeGlow('rgba(255,220,150,1)');
    // sprite
    const mat = new THREE.SpriteMaterial({
      map: this.tex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0,
    });
    this.sprite = new THREE.Sprite(mat);
    this.sprite.visible = false;
    scene.add(this.sprite);
    // dynamic light (P3: one of the few)
    this.light = new THREE.PointLight(0xffc060, 0, 14, 2);
    this.light.visible = false;
    scene.add(this.light);
    this.timer = 0;
    this.intensity = 0;
  }
  // flash at a world position, with a random rotation/scale for variety
  flash(pos, rotZ = 0) {
    this.timer = 0.045;
    this.intensity = 6 + Math.random() * 4;
    this.sprite.position.copy(pos);
    const s = 0.4 + Math.random() * 0.3;
    this.sprite.scale.set(s * 1.4, s, 1);
    this.sprite.material.rotation = rotZ + Math.random() * 0.6;
    this.sprite.material.opacity = 1;
    this.sprite.visible = true;
    this.light.position.copy(pos);
    this.light.intensity = this.intensity;
    this.light.visible = true;
  }
  update(dt) {
    if (this.timer > 0) {
      this.timer -= dt;
      if (this.timer <= 0) {
        this.sprite.visible = false;
        this.sprite.material.opacity = 0;
        this.light.visible = false;
        this.light.intensity = 0;
      } else {
        this.sprite.material.opacity = this.timer / 0.045;
        this.light.intensity = this.intensity * (this.timer / 0.045);
      }
    }
  }
  dispose() {
    this.scene.remove(this.sprite, this.light);
    this.sprite.material.dispose();
  }
}
