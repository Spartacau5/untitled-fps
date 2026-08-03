// ---------------------------------------------------------------------------
// world/props.js — set dressing: pallet slats, paint buckets, rebar bundles,
// swaying plastic sheeting (reacts to bullets), drifting dust motes, rubble.
// The sheeting and motes are what make the air feel alive in the sunset.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

const SHEET_AMP = 0.034;
const MOTE_COUNT = 220;

export class Props {
  constructor(scene, targets, rng) {
    this.scene = scene;
    this.sheets = [];
    this._buildPalletDetail();
    this._buildBuckets(targets, rng);
    this._buildRebar(targets);
    this._buildRubble(rng);
    this._buildSheets(targets);
    this._buildMotes(rng);
    this.t = 0;
  }

  _buildPalletDetail() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x96734a, roughness: 0.92 });
    const slat = new THREE.BoxGeometry(1.3, 0.035, 0.14);
    const g = new THREE.Group();
    for (let layer = 0; layer < 3; layer++) {
      const y = 0.16 + layer * 0.3;
      for (let i = 0; i < 5; i++) {
        const m = new THREE.Mesh(slat, mat);
        m.position.set(0, y, -0.52 + i * 0.26);
        m.rotation.y = layer % 2 ? Math.PI / 2 : 0;
        m.castShadow = true;
        g.add(m);
      }
    }
    g.position.set(-7, 0, -2.5);
    this.scene.add(g);
  }

  _buildBuckets(targets, rng) {
    const geo = new THREE.CylinderGeometry(0.155, 0.135, 0.3, 12);
    const colors = [0xe8e4da, 0x3f6fb5, 0xb03a2e, 0xd9a520];
    for (let i = 0; i < 4; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.6, metalness: 0.25 });
      const b = new THREE.Mesh(geo, mat);
      if (i === 3) { // tipped bucket
        b.position.set(-2.35, 0.14, 6.35);
        b.rotation.set(0, rng.next() * 3, Math.PI / 2 - 0.18);
        // paint spill
        const spill = new THREE.Mesh(
          new THREE.CircleGeometry(0.42, 14),
          new THREE.MeshStandardMaterial({ color: 0xc9971e, roughness: 0.5 })
        );
        spill.rotation.x = -Math.PI / 2;
        spill.position.set(-2.0, 0.012, 6.5);
        this.scene.add(spill);
      } else {
        const a = (i / 3) * Math.PI * 1.2 + 0.4;
        b.position.set(-3.2 + Math.cos(a) * 0.42, 0.15, 5.9 + Math.sin(a) * 0.4);
      }
      b.castShadow = true;
      b.userData.surface = 'metal';
      this.scene.add(b);
      targets.register(b);
    }
  }

  _buildRebar(targets) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x7a5238, roughness: 0.55, metalness: 0.8 });
    const geo = new THREE.CylinderGeometry(0.016, 0.016, 3.4, 6);
    for (let i = 0; i < 9; i++) {
      const r = new THREE.Mesh(geo, mat);
      const row = Math.floor(i / 3);
      r.position.set(10 + (i % 3) * 0.05 - 0.05, 0.025 + row * 0.035, -12 + (i % 3) * 0.055);
      r.rotation.z = Math.PI / 2;
      r.rotation.y = 0.06;
      r.castShadow = true;
      r.userData.surface = 'metal';
      this.scene.add(r);
      targets.register(r);
    }
  }

  _buildRubble(rng) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x76706a, roughness: 0.95 });
    const geo = new THREE.BoxGeometry(1, 1, 1);
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(geo, mat);
      const s = 0.07 + rng.next() * 0.2;
      m.scale.set(s, s * (0.5 + rng.next() * 0.6), s);
      m.position.set(rng.range(-20, 20), s * 0.24, rng.range(-13, 13));
      m.rotation.y = rng.next() * Math.PI;
      m.castShadow = true;
      this.scene.add(m);
    }
  }

  _buildSheets(targets) {
    const mkSheet = (x, y, z, rotY) => {
      const geo = new THREE.PlaneGeometry(1.95, 2.5, 6, 8);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xcfd8de, roughness: 0.4, metalness: 0.05,
        transparent: true, opacity: 0.44, side: THREE.DoubleSide, depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotY;
      mesh.userData.surface = 'sheet';
      mesh.renderOrder = 1;
      this.scene.add(mesh);
      targets.register(mesh);
      const base = geo.attributes.position.array.slice();
      const sheet = { mesh, geo, base, ripple: 0, seed: this.sheets.length * 2.7 };
      this.sheets.push(sheet);
      // hanging rod
      const rod = new THREE.Mesh(
        new THREE.CylinderGeometry(0.013, 0.013, 2.3, 6),
        new THREE.MeshStandardMaterial({ color: 0x6e4a33, roughness: 0.6, metalness: 0.7 })
      );
      rod.rotation.z = Math.PI / 2;
      rod.rotation.y = rotY;
      rod.position.set(x, y + 1.26, z);
      this.scene.add(rod);
    };
    mkSheet(-12, 1.95, 0, Math.PI / 2);
    mkSheet(15.6, 1.95, -7.5, 0);
  }

  _buildMotes(rng) {
    const pos = new Float32Array(MOTE_COUNT * 3);
    this._moteVel = new Float32Array(MOTE_COUNT * 3);
    for (let i = 0; i < MOTE_COUNT; i++) {
      pos[i * 3] = rng.range(-21, 21);
      pos[i * 3 + 1] = rng.range(0.2, 4.2);
      pos[i * 3 + 2] = rng.range(-14, 14);
      this._moteVel[i * 3] = rng.range(-0.06, 0.1);
      this._moteVel[i * 3 + 1] = rng.range(-0.02, 0.02);
      this._moteVel[i * 3 + 2] = rng.range(-0.04, 0.04);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffd9a0, size: 0.022, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    this.motes = new THREE.Points(geo, mat);
    this.motes.frustumCulled = false;
    this.scene.add(this.motes);
  }

  // Bullet hit on a sheet: kick a ripple (Section 8: reacts to bullets).
  hitSheet(mesh) {
    for (const s of this.sheets) if (s.mesh === mesh) s.ripple = 1;
  }

  update(dt) {
    this.t += dt;
    const t = this.t;
    // sheeting sway: wind gusts + bullet ripples, pinned at the top edge
    const wind = 0.55 + 0.3 * Math.sin(t * 0.33) + 0.15 * Math.sin(t * 0.71 + 1.4);
    for (const s of this.sheets) {
      s.ripple = Math.max(0, s.ripple - dt * 1.6);
      const pos = s.geo.attributes.position;
      const arr = pos.array, base = s.base;
      const amp = SHEET_AMP * wind + s.ripple * 0.16;
      for (let i = 0; i < arr.length; i += 3) {
        const bx = base[i], by = base[i + 1];
        const pin = 1 - (by + 1.25) / 2.5 * 0.85; // top edge nearly fixed
        arr[i + 2] = (Math.sin(t * 1.35 + by * 2.1 + bx * 1.4 + s.seed)
          + 0.5 * Math.sin(t * 2.3 + by * 3.3 + s.seed * 1.7)) * amp * pin;
        arr[i] = bx + Math.sin(t * 0.9 + by * 1.7 + s.seed) * amp * 0.3 * pin;
      }
      pos.needsUpdate = true;
      s.geo.computeVertexNormals();
    }
    // dust motes drifting through the light
    const mp = this.motes.geometry.attributes.position;
    const ma = mp.array, mv = this._moteVel;
    for (let i = 0; i < MOTE_COUNT; i++) {
      ma[i * 3] += mv[i * 3] * dt * 6;
      ma[i * 3 + 1] += (mv[i * 3 + 1] + Math.sin(t * 0.5 + i) * 0.008) * dt * 6;
      ma[i * 3 + 2] += mv[i * 3 + 2] * dt * 6;
      if (ma[i * 3] > 21.5) ma[i * 3] = -21.5; else if (ma[i * 3] < -21.5) ma[i * 3] = 21.5;
      if (ma[i * 3 + 1] > 4.4) ma[i * 3 + 1] = 0.2; else if (ma[i * 3 + 1] < 0.15) ma[i * 3 + 1] = 4.3;
      if (ma[i * 3 + 2] > 14.5) ma[i * 3 + 2] = -14.5; else if (ma[i * 3 + 2] < -14.5) ma[i * 3 + 2] = 14.5;
    }
    mp.needsUpdate = true;
  }

  reset() {
    for (const s of this.sheets) s.ripple = 0;
  }
}
