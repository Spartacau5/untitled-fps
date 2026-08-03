// ---------------------------------------------------------------------------
// fx/decals.js — pooled bullet decals (F6). Polygon offset kills z-fighting;
// oldest-first reuse under the cap (P1). Slow fade so walls clean up gently.
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Pool } from '../core/pool.js';

const MAX = 48;
const LIFE = 14;         // s before fade-out starts
const FADE = 3;          // s to fade

function decalTextures() {
  const out = [];
  for (let v = 0; v < 3; v++) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    g.translate(32, 32);
    // dark core
    g.fillStyle = 'rgba(20,18,16,0.92)';
    g.beginPath(); g.arc(0, 0, 7 + v * 2, 0, Math.PI * 2); g.fill();
    // speckle ring
    g.fillStyle = 'rgba(28,25,22,0.55)';
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + v;
      const r = 11 + ((i * 7 + v * 13) % 9);
      g.beginPath(); g.arc(Math.cos(a) * r, Math.sin(a) * r, 1.2 + (i % 3), 0, Math.PI * 2); g.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    out.push(tex);
  }
  return out;
}

export class Decals {
  constructor(scene, rng) {
    this._tex = decalTextures();
    this._zAxis = new THREE.Vector3(0, 0, 1);
    this._q = new THREE.Quaternion();
    this._qRoll = new THREE.Quaternion();
    this._n = new THREE.Vector3();
    this.pool = new Pool(() => {
      const mat = new THREE.MeshBasicMaterial({
        map: this._tex[0], transparent: true, depthWrite: false,
        polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4,
        opacity: 0.9,
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.11), mat);
      mesh.visible = false;
      mesh.renderOrder = 2;
      scene.add(mesh);
      return { mesh, life: 0 };
    }, MAX);
    this._scene = scene;
  }

  spawn(point, normal, rng) {
    if (!normal) return;
    const d = this.pool.acquire();
    d.life = 0;
    const mesh = d.mesh;
    mesh.visible = true;
    mesh.material.map = this._tex[rng.int(0, 2)];
    mesh.material.opacity = 0.9;
    this._n.copy(normal);
    // orient plane to surface normal with a random roll about that normal
    this._q.setFromUnitVectors(this._zAxis, this._n);
    this._qRoll.setFromAxisAngle(this._n, rng.next() * Math.PI * 2);
    mesh.quaternion.copy(this._qRoll).multiply(this._q);
    mesh.position.copy(point).addScaledVector(this._n, 0.006);
    const s = 0.8 + rng.next() * 0.6;
    mesh.scale.setScalar(s);
  }

  update(dt) {
    this.pool.forEach((d) => {
      d.life += dt;
      if (d.life > LIFE) {
        const f = 1 - (d.life - LIFE) / FADE;
        if (f <= 0) { d.mesh.visible = false; this.pool.release(d); return; }
        d.mesh.material.opacity = 0.9 * f;
      }
    });
  }

  reset() {
    this.pool.forEach((d) => { d.mesh.visible = false; });
    this.pool.releaseAll();
  }
}
