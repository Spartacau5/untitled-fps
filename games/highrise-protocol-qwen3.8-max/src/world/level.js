// ---------------------------------------------------------------------------
// world/level.js — unfinished top floor of a high-rise at sunset (Section 8).
// Concrete slab, pillar grid, parapets, stair core, cover props. Every solid
// registers as both a collider and a raycast target; cover & spawn points
// feed the AI. Procedural canvas concrete textures — no external assets.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

export const TUNING = {
  SLAB_X: 46, SLAB_Z: 32,
  PARAPET_H: 1.05, PARAPET_T: 0.32,
  PILLAR_H: 3.8, PILLAR_W: 1.1,
};

function concreteTexture(base = '#7b766e', seams = true) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  // speckle noise
  let s = 987654;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < 5200; i++) {
    const v = rnd();
    g.fillStyle = v > 0.5 ? `rgba(255,250,240,${(v - 0.5) * 0.12})` : `rgba(20,18,16,${(0.5 - v) * 0.16})`;
    g.fillRect(rnd() * 512, rnd() * 512, 1 + rnd() * 2.2, 1 + rnd() * 2.2);
  }
  // blotches
  for (let i = 0; i < 26; i++) {
    const x = rnd() * 512, y = rnd() * 512, r = 18 + rnd() * 60;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(40,36,32,${0.04 + rnd() * 0.05})`);
    grad.addColorStop(1, 'rgba(40,36,32,0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  if (seams) {
    g.strokeStyle = 'rgba(30,27,24,0.5)';
    g.lineWidth = 2.5;
    for (let i = 0; i <= 4; i++) {
      g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, 512); g.stroke();
      g.beginPath(); g.moveTo(0, i * 128); g.lineTo(512, i * 128); g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export class Level {
  constructor(scene, collision, targets, track) {
    this.scene = scene;
    this.collision = collision;
    this.targets = targets;
    this.coverPoints = [];
    this.spawnPoints = [];
    this._build();
  }

  _solid(mesh, surface = 'concrete') {
    mesh.userData.surface = surface;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.targets.register(mesh);
    return mesh;
  }

  _box(w, h, d, mat, x, y, z, surface) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    this._solid(m, surface);
    this.collision.addBox(x, y, z, w, h, d);
    return m;
  }

  _build() {
    const T = TUNING;
    const floorTex = concreteTexture('#7b766e', true);
    floorTex.repeat.set(6, 4);
    const pillarTex = concreteTexture('#837d74', false);
    const matFloor = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.92, metalness: 0.02 });
    const matPillar = new THREE.MeshStandardMaterial({ map: pillarTex, roughness: 0.88, metalness: 0.03 });
    const matParapet = new THREE.MeshStandardMaterial({ color: 0x6d665c, roughness: 0.9 });
    const matDark = new THREE.MeshStandardMaterial({ color: 0x4a453e, roughness: 0.85 });

    // slab (top of box at y=0)
    this._box(T.SLAB_X, 0.5, T.SLAB_Z, matFloor, 0, -0.25, 0, 'concrete');

    // parapets
    const px = T.SLAB_X / 2 - T.PARAPET_T / 2;
    const pz = T.SLAB_Z / 2 - T.PARAPET_T / 2;
    this._box(T.SLAB_X, T.PARAPET_H, T.PARAPET_T, matParapet, 0, T.PARAPET_H / 2, -pz, 'concrete');
    this._box(T.SLAB_X, T.PARAPET_H, T.PARAPET_T, matParapet, 0, T.PARAPET_H / 2, pz, 'concrete');
    this._box(T.PARAPET_T, T.PARAPET_H, T.SLAB_Z - T.PARAPET_T * 2, matParapet, -px, T.PARAPET_H / 2, 0, 'concrete');
    this._box(T.PARAPET_T, T.PARAPET_H, T.SLAB_Z - T.PARAPET_T * 2, matParapet, px, T.PARAPET_H / 2, 0, 'concrete');

    // pillar grid (3x2) + rebar sticks on top
    const rebarMat = new THREE.MeshStandardMaterial({ color: 0x6e4a33, roughness: 0.6, metalness: 0.75 });
    const rebarGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.85, 5);
    const pillars = [];
    for (const x of [-12, 0, 12]) {
      for (const z of [-6, 6]) {
        this._box(T.PILLAR_W, T.PILLAR_H, T.PILLAR_W, matPillar, x, T.PILLAR_H / 2, z, 'concrete');
        pillars.push([x, z]);
        for (let i = 0; i < 4; i++) {
          const r = new THREE.Mesh(rebarGeo, rebarMat);
          const ox = (i % 2 === 0 ? -1 : 1) * 0.28;
          const oz = (i < 2 ? -1 : 1) * 0.28;
          r.position.set(x + ox, T.PILLAR_H + 0.4, z + oz);
          r.rotation.set((i - 1.5) * 0.09, 0, (i - 1.5) * 0.12);
          this._solid(r, 'metal');
        }
        // cover points around each pillar
        for (const [cx, cz] of [[x - 1.5, z], [x + 1.5, z], [x, z - 1.5], [x, z + 1.5]]) {
          this.coverPoints.push({ x: cx, z: cz, taken: false, by: null });
        }
      }
    }

    // stair core landmark
    this._box(3.2, 3.3, 3.2, matPillar, 18, 1.65, -11.5, 'concrete');
    this._box(1.4, 2.1, 0.14, matDark, 18, 1.05, -9.85, 'metal'); // door

    // cover props -------------------------------------------------------------
    // pallet stack
    this._box(1.3, 0.9, 1.3, new THREE.MeshStandardMaterial({ color: 0x8a6a44, roughness: 0.9 }), -7, 0.45, -2.5, 'wood');
    this.coverPoints.push({ x: -7, z: -1.2, taken: false, by: null }, { x: -5.6, z: -2.5, taken: false, by: null });
    // drywall stack
    this._box(2.5, 1.15, 0.9, new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.95 }), 6.5, 0.575, 3.5, 'drywall');
    this.coverPoints.push({ x: 6.5, z: 2.3, taken: false, by: null }, { x: 5.0, z: 3.5, taken: false, by: null });
    // concrete barriers
    this._box(2.2, 0.95, 0.5, matParapet, 2, 0.475, -8, 'concrete');
    this._box(2.2, 0.95, 0.5, matParapet, -3.5, 0.475, 8.5, 'concrete');
    this.coverPoints.push({ x: 2, z: -6.9, taken: false, by: null }, { x: -3.5, z: 7.4, taken: false, by: null });
    // partial partition wall
    this._box(3.2, 2.5, 0.14, new THREE.MeshStandardMaterial({ color: 0xd6d1c4, roughness: 0.95 }), -14, 1.25, 8, 'drywall');

    // spawn points (perimeter, inside the parapets)
    this.spawnPoints = [
      { x: -19.5, z: -12.5 }, { x: 19.5, z: -12.5 },
      { x: -19.5, z: 12.5 }, { x: 19.5, z: 12.5 },
      { x: -0.5, z: -13.2 }, { x: 0.5, z: 13.2 },
    ];
    this.playerStart = { x: 0, y: 0, z: 10.5 };
  }

  randomSpawn(rng, playerPos) {
    // prefer spawns far from the player
    const far = playerPos
      ? this.spawnPoints.filter((s) => Math.hypot(s.x - playerPos.x, s.z - playerPos.z) > 13)
      : this.spawnPoints;
    const list = far.length ? far : this.spawnPoints;
    return list[Math.floor(rng.next() * list.length)];
  }

  claimCover(fromPos, playerPos, enemy) {
    // cheapest insertion-cost cover point between the enemy and the player
    let best = null, bestCost = Infinity;
    for (const c of this.coverPoints) {
      if (c.taken) continue;
      const dE = Math.hypot(c.x - fromPos.x, c.z - fromPos.z);
      const dP = Math.hypot(c.x - playerPos.x, c.z - playerPos.z);
      if (dP < 4) continue; // never camp on top of the player
      const cost = dE + dP * 0.7;
      if (cost < bestCost) { bestCost = cost; best = c; }
    }
    if (best) { best.taken = true; best.by = enemy; }
    return best ? { stand: { x: best.x, z: best.z }, ref: best } : null;
  }

  releaseCover(e) {
    for (const c of this.coverPoints) if (c.by === e) { c.taken = false; c.by = null; }
  }
}
