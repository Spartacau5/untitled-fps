import * as THREE from 'three';
import { rng } from '../core/PRNG.js';

// P1: instanced particle system. Preallocated typed arrays, zero per-frame
// allocation in the hot loop. Active particles are compacted to [0,count) each
// frame so the InstancedMesh draws only what's alive. Used for blood, dust,
// sparks, smoke, splinters, glass.
export class ParticleSystem {
  constructor(scene, geo, mat, max) {
    this.scene = scene;
    this.max = max;
    this.mesh = new THREE.InstancedMesh(geo, mat, max);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.castShadow = false;
    this.mesh.count = 0;
    // ensure instanceColor buffer exists (so setColorAt is valid)
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3), 3);
    this.mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

    this.pos = new Float32Array(max * 3);
    this.vel = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max);
    this.size = new Float32Array(max);
    this.gravity = new Float32Array(max);
    this.drag = new Float32Array(max);
    this.spin = new Float32Array(max);
    this.rot = new Float32Array(max);
    this.active = new Uint8Array(max);
    this.free = [];
    for (let i = max - 1; i >= 0; i--) this.free.push(i);
    this._dummy = new THREE.Object3D();
    this._c = new THREE.Color();
    this.activeCount = 0;
  }

  spawn(x, y, z, o = {}) {
    let i;
    if (this.free.length > 0) {
      i = this.free.pop();
    } else {
      // oldest-first reuse (P1)
      i = 0; let lo = Infinity;
      for (let k = 0; k < this.max; k++) if (this.active[k] && this.life[k] < lo) { lo = this.life[k]; i = k; }
      if (!this.active[i]) return;
    }
    this.active[i] = 1;
    this.pos[i * 3] = x; this.pos[i * 3 + 1] = y; this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = o.vx ?? 0; this.vel[i * 3 + 1] = o.vy ?? 0; this.vel[i * 3 + 2] = o.vz ?? 0;
    this.life[i] = o.life ?? 0.5;
    this.maxLife[i] = this.life[i];
    this.size[i] = o.size ?? 0.05;
    this.gravity[i] = o.gravity ?? 0;
    this.drag[i] = o.drag ?? 0;
    this.spin[i] = o.spin ?? 0;
    this.rot[i] = rng.next() * Math.PI * 2;
    this._c.set(o.color ?? 0xffffff);
    this.col[i * 3] = this._c.r; this.col[i * 3 + 1] = this._c.g; this.col[i * 3 + 2] = this._c.b;
    this.activeCount++;
  }

  _kill(i) {
    if (!this.active[i]) return;
    this.active[i] = 0;
    this.free.push(i);
    this.activeCount--;
  }

  update(dt) {
    if (dt > 0.05) dt = 0.05;
    const d = this._dummy;
    const m = this.mesh;
    const colArr = m.instanceColor.array;
    let count = 0;
    for (let i = 0; i < this.max; i++) {
      if (!this.active[i]) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this._kill(i); continue; }
      this.vel[i * 3 + 1] -= this.gravity[i] * dt;
      if (this.drag[i]) {
        const f = Math.max(0, 1 - this.drag[i] * dt);
        this.vel[i * 3] *= f; this.vel[i * 3 + 1] *= f; this.vel[i * 3 + 2] *= f;
      }
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.rot[i] += this.spin[i] * dt;
      const t = this.life[i] / this.maxLife[i];
      const s = this.size[i] * (0.3 + 0.7 * t);
      d.position.set(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]);
      d.rotation.set(this.rot[i], this.rot[i] * 1.3, 0);
      d.scale.setScalar(s);
      d.updateMatrix();
      m.setMatrixAt(count, d.matrix);
      colArr[count * 3] = this.col[i * 3];
      colArr[count * 3 + 1] = this.col[i * 3 + 1];
      colArr[count * 3 + 2] = this.col[i * 3 + 2];
      count++;
    }
    m.count = count;
    m.instanceMatrix.needsUpdate = true;
    m.instanceColor.needsUpdate = true;
  }

  clear() {
    for (let i = 0; i < this.max; i++) this.active[i] = 0;
    this.free.length = 0;
    for (let i = this.max - 1; i >= 0; i--) this.free.push(i);
    this.mesh.count = 0;
    this.activeCount = 0;
  }
  dispose() { this.scene.remove(this.mesh); this.mesh.dispose(); }
}

// F4: physical shell ejection — brass casings bounce on concrete, metallic
// tinkles via onBounce callback.
export class ShellEjector extends ParticleSystem {
  constructor(scene, geo, mat, max) {
    super(scene, geo, mat, max);
    this.onBounce = null;
    this._bounces = [];
  }
  eject(x, y, z, dirX, dirZ) {
    const spread = rng.range(-0.5, 0.5);
    const vx = (dirZ + spread) * rng.range(2.5, 4.5);
    const vz = (-dirX + spread) * rng.range(2.5, 4.5);
    const vy = rng.range(2.0, 3.4);
    this.spawn(x, y, z, {
      vx, vy, vz, life: rng.range(1.2, 2.0), size: rng.range(0.03, 0.045),
      gravity: 22, drag: 0.2, spin: rng.range(-20, 20), color: 0xd4af37,
    });
  }
  update(dt) {
    if (dt > 0.05) dt = 0.05;
    const d = this._dummy;
    const m = this.mesh;
    const colArr = m.instanceColor.array;
    let count = 0;
    this._bounces.length = 0;
    for (let i = 0; i < this.max; i++) {
      if (!this.active[i]) continue;
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this._kill(i); continue; }
      this.vel[i * 3 + 1] -= 22 * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      this.rot[i] += this.spin[i] * dt;
      if (this.pos[i * 3 + 1] < 0.02) {
        this.pos[i * 3 + 1] = 0.02;
        if (Math.abs(this.vel[i * 3 + 1]) > 0.6) {
          this.vel[i * 3 + 1] *= -0.4;
          this.vel[i * 3] *= 0.7; this.vel[i * 3 + 2] *= 0.7;
          this.spin[i] *= 0.5;
          this._bounces.push(this.pos[i * 3], this.pos[i * 3 + 2]);
        } else {
          this.vel[i * 3 + 1] = 0; this.vel[i * 3] *= 0.85; this.vel[i * 3 + 2] *= 0.85;
        }
      }
      const s = this.size[i];
      d.position.set(this.pos[i * 3], this.pos[i * 3 + 1], this.pos[i * 3 + 2]);
      d.rotation.set(this.rot[i], 0, this.rot[i] * 0.5);
      d.scale.setScalar(s);
      d.updateMatrix();
      m.setMatrixAt(count, d.matrix);
      colArr[count * 3] = this.col[i * 3];
      colArr[count * 3 + 1] = this.col[i * 3 + 1];
      colArr[count * 3 + 2] = this.col[i * 3 + 2];
      count++;
    }
    m.count = count;
    m.instanceMatrix.needsUpdate = true;
    m.instanceColor.needsUpdate = true;
    return this._bounces; // [x,z,...] pairs for tinkles
  }
}
