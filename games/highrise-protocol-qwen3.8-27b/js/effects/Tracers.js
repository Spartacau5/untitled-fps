import * as THREE from 'three';
import { rng } from '../core/PRNG.js';

// F4: tracers — bright additive lines from muzzle to impact, quick fade.
// OVERDRIVE tints them (D2).
export class Tracers {
  constructor(scene, max) {
    this.scene = scene;
    this.max = max;
    this.items = [];
    for (let i = 0; i < max; i++) {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
      const mat = new THREE.LineBasicMaterial({
        color: 0xffd080, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      line.frustumCulled = false;
      line.visible = false;
      scene.add(line);
      this.items.push({ line, life: 0, max: 0.06, active: false, color: new THREE.Color(0xffd080) });
    }
    this.idx = 0;
    this.overdrive = false;
  }
  fire(from, to, color = 0xffd080) {
    const it = this.items[this.idx];
    this.idx = (this.idx + 1) % this.max;
    const pos = it.line.geometry.attributes.position.array;
    pos[0] = from.x; pos[1] = from.y; pos[2] = from.z;
    pos[3] = to.x; pos[4] = to.y; pos[5] = to.z;
    // tiny jitter for life
    pos[3] += rng.range(-0.02, 0.02); pos[4] += rng.range(-0.02, 0.02);
    it.line.geometry.attributes.position.needsUpdate = true;
    it.life = it.max = 0.05 + rng.range(0, 0.03);
    it.active = true;
    it.line.visible = true;
    it.color.set(this.overdrive ? 0x8affff : color);
    it.line.material.color.copy(it.color);
    it.line.material.opacity = 1;
  }
  update(dt) {
    for (const it of this.items) {
      if (!it.active) continue;
      it.life -= dt;
      if (it.life <= 0) { it.active = false; it.line.visible = false; it.line.material.opacity = 0; continue; }
      it.line.material.opacity = (it.life / it.max) * (this.overdrive ? 0.95 : 0.7);
    }
  }
  clear() { for (const it of this.items) { it.active = false; it.line.visible = false; it.line.material.opacity = 0; } }
  dispose() { for (const it of this.items) this.scene.remove(it.line); }
}
