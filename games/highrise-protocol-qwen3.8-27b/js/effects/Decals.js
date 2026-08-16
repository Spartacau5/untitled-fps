import * as THREE from 'three';
import { rng } from '../core/PRNG.js';

// F5/H6: decals — bullet holes + blood. K5: z-fighting avoided with
// polygonOffset + micro-offset. Blood accumulates through the wave, cleared
// between waves, capped oldest-first (H6).
function radialTex(inner, outer, ring = 0.55) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, inner);
  grd.addColorStop(ring, inner);
  grd.addColorStop(1, outer);
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
// blood: irregular blob
function bloodTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 64, 64);
  for (let i = 0; i < 9; i++) {
    const x = 32 + (rng.next() - 0.5) * 26;
    const y = 32 + (rng.next() - 0.5) * 26;
    const r = rng.range(4, 15);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(90,4,6,0.9)');
    grd.addColorStop(0.7, 'rgba(70,3,5,0.6)');
    grd.addColorStop(1, 'rgba(60,2,4,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function holeTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 64, 64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 30);
  grd.addColorStop(0, 'rgba(15,14,12,0.95)');
  grd.addColorStop(0.25, 'rgba(30,28,24,0.8)');
  grd.addColorStop(0.5, 'rgba(120,116,108,0.25)'); // scorch ring
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

class DecalPool {
  constructor(scene, tex, count, size, transparent = true) {
    this.scene = scene;
    this.count = count;
    this.geo = new THREE.PlaneGeometry(size, size);
    this.mat = new THREE.MeshBasicMaterial({
      map: tex, transparent, depthWrite: false, depthTest: true,
      polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
    });
    this.mesh = new THREE.InstancedMesh(this.geo, this.mat, count);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.raycast = () => {};
    this.mesh.userData.decal = true;
    this.slot = [];           // ordered slots for oldest-first
    this._dummy = new THREE.Object3D();
    scene.add(this.mesh);
  }
  place(point, normal, rotY = 0) {
    const i = this.slot.length < this.count ? this.slot.length : this.slot[0]; // reuse oldest
    if (this.slot.length === this.count) { this.slot.push(this.slot.shift()); }
    else this.slot.push(i);
    // orient plane to face normal (billboard toward normal)
    this._dummy.position.copy(point).addScaledVector(normal, 0.012); // K5 micro-offset
    const up = new THREE.Vector3(0, 1, 0);
    if (Math.abs(normal.y) > 0.9) {
      this._dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    } else {
      const look = new THREE.Matrix4().lookAt(point, point.clone().add(normal), up);
      this._dummy.quaternion.setFromRotationMatrix(look);
    }
    const s = rng.range(0.7, 1.3);
    this._dummy.scale.set(s, s, 1);
    this._dummy.rotation.z = rotY;
    this._dummy.updateMatrix();
    this.mesh.setMatrixAt(i, this._dummy.matrix);
    this.mesh.count = this.slot.length;
    this.mesh.instanceMatrix.needsUpdate = true;
    return i;
  }
  clear() {
    this.slot.length = 0;
    this.mesh.count = 0;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
  dispose() { this.scene.remove(this.mesh); this.mesh.dispose(); }
}

export class Decals {
  constructor(scene, maxBlood) {
    this.scene = scene;
    this.blood = new DecalPool(scene, bloodTex(), maxBlood, 0.5);
    this.holes = new DecalPool(scene, holeTex(), 80, 0.22);
  }
  addBlood(point, normal) { this.blood.place(point, normal); }
  addHole(point, normal) { this.holes.place(point, normal); }
  clearBlood() { this.blood.clear(); }
  clearAll() { this.blood.clear(); this.holes.clear(); }
  activeBlood() { return this.blood.slot.length; }
  dispose() { this.blood.dispose(); this.holes.dispose(); }
}
