// ---------------------------------------------------------------------------
// fx/particles.js — instanced particles (P1): zero per-frame allocations,
// hard caps, swap-compaction. Two meshes: opaque dust/debris + additive
// sparks/embers.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

const MAX_OPAQUE = 384;
const MAX_ADD = 160;

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _c = new THREE.Color();

function makeStore(cap) {
  return {
    cap, n: 0,
    px: new Float32Array(cap), py: new Float32Array(cap), pz: new Float32Array(cap),
    vx: new Float32Array(cap), vy: new Float32Array(cap), vz: new Float32Array(cap),
    life: new Float32Array(cap), maxLife: new Float32Array(cap),
    size: new Float32Array(cap), grav: new Float32Array(cap),
    cr: new Float32Array(cap), cg: new Float32Array(cap), cb: new Float32Array(cap),
    drag: new Float32Array(cap), grow: new Float32Array(cap),
  };
}

export class Particles {
  constructor(scene) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    this.opaque = new THREE.InstancedMesh(geo,
      new THREE.MeshBasicMaterial({ transparent: false }), MAX_OPAQUE);
    this.add = new THREE.InstancedMesh(geo,
      new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), MAX_ADD);
    for (const mesh of [this.opaque, this.add]) {
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.frustumCulled = false;
      mesh.count = 0;
      scene.add(mesh);
    }
    this.stOpaque = makeStore(MAX_OPAQUE);
    this.stAdd = makeStore(MAX_ADD);
    this._tint = new THREE.Color(1, 1, 1);
  }

  spawn(opts, additive = false) {
    const st = additive ? this.stAdd : this.stOpaque;
    let i;
    if (st.n < st.cap) { i = st.n++; }
    else { i = 0; } // reuse slot 0..cap round-robin style under pressure
    if (st.n >= st.cap) i = (this._rr = ((this._rr || 0) + 1) % st.cap);
    st.px[i] = opts.x; st.py[i] = opts.y; st.pz[i] = opts.z;
    st.vx[i] = opts.vx; st.vy[i] = opts.vy; st.vz[i] = opts.vz;
    st.life[i] = 0; st.maxLife[i] = opts.life;
    st.size[i] = opts.size; st.grav[i] = opts.grav ?? -9.8;
    st.cr[i] = opts.r; st.cg[i] = opts.g; st.cb[i] = opts.b;
    st.drag[i] = opts.drag ?? 1.5;
    st.grow[i] = opts.grow ?? 0;
  }

  // F5 smoke wisp: slow, rising, expanding, fading to haze
  smoke(p, dir, rng) {
    for (let i = 0; i < 2; i++) {
      this.spawn({
        x: p.x + rng.gauss() * 0.015, y: p.y + rng.gauss() * 0.015, z: p.z + rng.gauss() * 0.015,
        vx: dir.x * 0.5 + rng.gauss() * 0.22, vy: 0.35 + rng.range(0, 0.3), vz: dir.z * 0.5 + rng.gauss() * 0.22,
        life: rng.range(0.45, 0.8), size: rng.range(0.02, 0.035),
        grav: 0.5, drag: 2.8, grow: 3.2, r: 0.42, g: 0.4, b: 0.37,
      }, false);
    }
  }

  update(dt) {
    this._updateStore(this.stOpaque, this.opaque, dt, false);
    this._updateStore(this.stAdd, this.add, dt, true);
  }

  _updateStore(st, mesh, dt, additive) {
    let n = st.n;
    for (let i = 0; i < n; i++) {
      st.life[i] += dt;
      if (st.life[i] >= st.maxLife[i] || st.py[i] < -0.5) {
        // swap-remove with the last
        const j = --n;
        if (i !== j) {
          st.px[i] = st.px[j]; st.py[i] = st.py[j]; st.pz[i] = st.pz[j];
          st.vx[i] = st.vx[j]; st.vy[i] = st.vy[j]; st.vz[i] = st.vz[j];
          st.life[i] = st.life[j]; st.maxLife[i] = st.maxLife[j];
          st.size[i] = st.size[j]; st.grav[i] = st.grav[j];
          st.cr[i] = st.cr[j]; st.cg[i] = st.cg[j]; st.cb[i] = st.cb[j];
          st.drag[i] = st.drag[j]; st.grow[i] = st.grow[j];
        }
        i--;
        continue;
      }
      const dr = 1 - Math.min(st.drag[i] * dt, 0.9);
      st.vx[i] *= dr; st.vz[i] *= dr;
      st.vy[i] = st.vy[i] * dr + st.grav[i] * dt;
      st.px[i] += st.vx[i] * dt; st.py[i] += st.vy[i] * dt; st.pz[i] += st.vz[i] * dt;
      if (st.py[i] < 0.005 && st.grav[i] < 0) { st.py[i] = 0.005; st.vy[i] *= -0.25; }
    }
    st.n = n;
    mesh.count = n;
    for (let i = 0; i < n; i++) {
      const fade = 1 - st.life[i] / st.maxLife[i];
      const growF = 1 + st.grow[i] * (1 - fade);
      const sz = st.size[i] * growF * (additive ? fade : 0.4 + 0.6 * fade);
      _p.set(st.px[i], st.py[i], st.pz[i]);
      _s.set(sz, sz, sz);
      _m.compose(_p, _q, _s);
      mesh.setMatrixAt(i, _m);
      _c.setRGB(st.cr[i] * fade + (additive ? 0 : (1 - fade) * 0.25),
        st.cg[i] * fade + (additive ? 0 : (1 - fade) * 0.22),
        st.cb[i] * fade + (additive ? 0 : (1 - fade) * 0.2));
      mesh.setColorAt(i, _c);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  reset() { this.stOpaque.n = 0; this.stAdd.n = 0; this.opaque.count = 0; this.add.count = 0; }
  stats() { return this.stOpaque.n + this.stAdd.n; }
}
