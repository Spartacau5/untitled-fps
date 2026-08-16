import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng, PRNG } from '../core/PRNG.js';
import {
  makeConcrete, makeWood, makeMetal, makeDrywall, makeConcreteNormal,
  makeRoofFloor, makeMetalPanel, makeHazard, makeWindowGrid, makeGlow,
} from './Textures.js';

// G2/Section 1: the unfinished top floor — now a full heli-deck: rooftop
// concrete, water tank, spinning HVAC units, antenna masts with blinking
// aviation beacons, satellite dish, pipe runs, crate/barrel clusters, jersey
// barriers, access hatch, detailed pillars, a 3-layer parallax city with
// lit windows, drifting clouds, a pale moon and an occasional airplane.
// Everything is procedural; static prop geometry is merged per material.
//
// Exposes (contract — do not break):
//   colliders      — AABBs for player physics {min,max}
//   shootables     — {mesh, box, type, alive, color} for bullet interaction
//   waistObstacles — {box} for mantle prompts
//   sheeting       — animated planes (W1)
//   glassShardMeshes / bucketMeshes / drywallMeshes / palletMeshes / rebarMeshes / papers
//   floor, city, sky, group
export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.colliders = [];
    this.shootables = [];
    this.waistObstacles = [];
    this.sheeting = [];
    this.glassShardMeshes = [];
    this.bucketMeshes = [];
    this.drywallMeshes = [];
    this.palletMeshes = [];
    this.rebarMeshes = [];
    this.group = new THREE.Group();
    scene.add(this.group);
    this._tex = {
      concrete: makeConcrete('#8b8781', [3, 3]),
      bump: makeConcreteNormal(),
      wood: makeWood(),
      metal: makeMetal(),
      drywall: makeDrywall(),
    };
    this._mats = {
      concrete: new THREE.MeshStandardMaterial({ map: this._tex.concrete, bumpMap: this._tex.bump, bumpScale: 0.02, roughness: 0.95, metalness: 0.0 }),
      // G2: detailed rooftop floor (seams, cracks, oil stains, hazard stripe, grate)
      floor: new THREE.MeshStandardMaterial({ map: makeRoofFloor(), bumpMap: this._tex.bump, bumpScale: 0.02, roughness: 0.98, metalness: 0.0 }),
      wood: new THREE.MeshStandardMaterial({ map: this._tex.wood, roughness: 0.85, metalness: 0.0 }),
      metal: new THREE.MeshStandardMaterial({ map: this._tex.metal, roughness: 0.5, metalness: 0.85 }),
      drywall: new THREE.MeshStandardMaterial({ map: this._tex.drywall, roughness: 0.9, metalness: 0.0, side: THREE.DoubleSide }),
      // new prop materials
      panel: new THREE.MeshStandardMaterial({ map: makeMetalPanel('#9aa1ab'), roughness: 0.55, metalness: 0.75 }),
      steel: new THREE.MeshStandardMaterial({ map: makeMetal('#787f89'), roughness: 0.45, metalness: 0.85 }),
      dark: new THREE.MeshStandardMaterial({ map: makeMetalPanel('#2a2d33'), roughness: 0.6, metalness: 0.5 }),
      hazard: new THREE.MeshStandardMaterial({ map: makeHazard(), roughness: 0.7, metalness: 0.1, side: THREE.DoubleSide }),
      beacon: new THREE.MeshStandardMaterial({ color: 0x2a0808, emissive: 0xff2a1a, emissiveIntensity: 2.5, roughness: 0.4, metalness: 0.2 }),
    };
    // per-frame animated bits (filled by build())
    this._fans = [];      // HVAC blade meshes (rotate)
    this._beacons = [];   // { mat, phase } blinking glow sprites
    this._clouds = [];    // { sp, speed } drifting sprites
    this._plane = null;   // airplane state
    this._pillarPos = []; // jittered pillar positions (captured in _buildPillars)
    this._cityBeacons = []; // tops of the tallest city buildings
    this._steelParts = [];  // shared static-steel geometry (pipes, masts, rims, steps)
  }

  addBoxCollider(cx, cy, cz, sx, sy, sz) {
    this.colliders.push({
      min: new THREE.Vector3(cx - sx / 2, cy - sy / 2, cz - sz / 2),
      max: new THREE.Vector3(cx + sx / 2, cy + sy / 2, cz + sz / 2),
    });
  }

  registerShootable(mesh, type, color = null) {
    const box = new THREE.Box3().setFromObject(mesh);
    this.shootables.push({ mesh, box, type, color, alive: true, hp: type === 'drywall' || type === 'sheet' ? 3 : 1 });
  }

  build() {
    this._buildSky();
    this._buildFloor();
    this._buildCity();
    this._buildPillars();
    this._buildRebar();
    this._buildPallets();
    this._buildDrywall();
    this._buildBuckets();
    this._buildGlass();
    this._buildSheeting();
    this._buildMantleObstacles();
    this._buildPapers();
    // ---- new heli-deck props (all decorative; appended after every
    // gameplay-relevant rng consumer so existing placements stay put) ----
    this._buildWaterTank();
    this._buildHVAC();
    this._buildSteel();
    this._buildBarrels();   // appends rim geometry to _steelParts
    this._buildBeacons();   // needs _cityBeacons (set in _buildCity)
    this._buildDish();
    this._buildCrates();
    this._buildJersey();
    this._buildHatch();     // appends step geometry to _steelParts
    this._mergeSteel();     // after every _steelParts consumer
    this._buildPillarDetails();
    this._buildSkyFX();
  }

  // W2: papers occasionally gusting across the floor.
  _buildPapers() {
    this.papers = [];
    const geo = new THREE.PlaneGeometry(0.22, 0.3);
    for (let i = 0; i < 5; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: 0xf2efe6, side: THREE.DoubleSide, roughness: 0.9, transparent: true, opacity: 0.95 });
      const m = new THREE.Mesh(geo, mat);
      m.castShadow = false;
      this._resetPaper(m, true);
      this.group.add(m);
      this.papers.push({ mesh: m, vx: 0, vz: 0, spin: 0, active: false, timer: rng.range(2, 10) });
    }
  }
  _resetPaper(m, initial) {
    // spawn at a random edge, low to the ground
    const edge = rng.int(0, 3);
    const t = rng.range(-30, 30);
    const pos = [ [-32, t], [32, t], [t, -32], [t, 32] ][edge];
    m.position.set(pos[0], 0.06, pos[1]);
    m.rotation.set(rng.range(-0.4, 0.4), rng.next() * 6, rng.range(-0.4, 0.4));
  }
  updatePapers(t, dt) {
    if (dt > 0.05) dt = 0.05;
    const gust = 0.5 + 0.5 * Math.sin(t * 0.3) + 0.3 * Math.sin(t * 0.9);
    for (const p of this.papers) {
      if (!p.active) {
        p.timer -= dt;
        if (p.timer <= 0 && gust > 0.9) {
          p.active = true;
          const ang = rng.range(0, Math.PI * 2);
          p.vx = Math.cos(ang) * rng.range(3, 6);
          p.vz = Math.sin(ang) * rng.range(3, 6);
          p.spin = rng.range(-6, 6);
        }
        continue;
      }
      // drift with wind + flutter
      p.mesh.position.x += (p.vx + Math.sin(t * 2 + p.mesh.position.y) * 1.5) * dt * gust;
      p.mesh.position.z += (p.vz + Math.cos(t * 1.7) * 1.5) * dt * gust;
      p.mesh.position.y = 0.06 + Math.abs(Math.sin(t * 6 + p.mesh.position.x)) * 0.15;
      p.mesh.rotation.z += p.spin * dt;
      p.mesh.rotation.x = Math.sin(t * 5) * 0.4;
      // out of bounds → recycle
      if (Math.abs(p.mesh.position.x) > 40 || Math.abs(p.mesh.position.z) > 40) {
        p.active = false;
        p.timer = rng.range(3, 12);
        this._resetPaper(p.mesh);
      }
    }
  }

  _buildSky() {
    // Gradient sunset dome.
    const geo = new THREE.SphereGeometry(300, 32, 16);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color(0x2a3550) },
        mid: { value: new THREE.Color(0xff9a5a) },
        bot: { value: new THREE.Color(0xffd9a0) },
      },
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        uniform vec3 top; uniform vec3 mid; uniform vec3 bot; varying vec3 vP;
        void main(){
          float h = normalize(vP).y;
          vec3 c = mix(bot, mid, smoothstep(0.0, 0.25, h));
          c = mix(c, top, smoothstep(0.15, 0.7, h));
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    const sky = new THREE.Mesh(geo, mat);
    this.scene.add(sky);
    this.sky = sky;
  }

  _buildFloor() {
    const geo = new THREE.PlaneGeometry(140, 140);
    const floor = new THREE.Mesh(geo, this._mats.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);
    this.floor = floor;

    // Perimeter low wall so the floor reads as a building edge.
    const wallMat = this._mats.concrete;
    const mk = (cx, cz, sx, sz) => {
      const g = new THREE.BoxGeometry(sx, 12, sz);
      const m = new THREE.Mesh(g, wallMat);
      m.position.set(cx, 6, cz);
      m.castShadow = true; m.receiveShadow = true;
      this.group.add(m);
      // don't collide (player is walled in by glass railings conceptually) — keep as backdrop
    };
    mk(0, -70, 140, 2);
    mk(0, 70, 140, 2);
    mk(-70, 0, 2, 140);
    mk(70, 0, 2, 140);
  }

  // 3-layer parallax city with emissive window grids. Merged per layer
  // (1 draw call each). The 4 tallest buildings get aviation beacons.
  // NOTE: the first block below re-burns the EXACT shared-rng consumption of
  // the previous (single-layer) city so every downstream rng consumer
  // (pillar jitter, bucket colors, sheeting phase, paper timers) keeps the
  // identical values as before — the new city content itself uses its own
  // seeded sub-stream (crng) and cannot perturb the game layout.
  _buildCity() {
    {
      // legacy consumption burn — keep the shared stream bit-identical
      for (let i = 0; i < 40; i++) {
        rng.range(-0.05, 0.05);
        rng.range(150, 240);
        rng.range(30, 110);
        rng.range(18, 40);
        rng.range(18, 40);
      }
      for (let y = 8; y < 256; y += 14) {
        for (let x = 6; x < 128; x += 12) {
          if (rng.chance(0.5)) rng.chance(0.7);
        }
      }
    }
    const crng = new PRNG(0xC17A); // city-only seeded sub-stream
    const cityGroup = new THREE.Group();
    const layers = [
      { n: 14, rMin: 120, rMax: 170, hMin: 40, hMax: 90, inten: 0.9, cols: 8, rows: 24 }, // near
      { n: 16, rMin: 180, rMax: 230, hMin: 30, hMax: 70, inten: 0.6, cols: 6, rows: 17 }, // mid
      { n: 18, rMin: 240, rMax: 280, hMin: 25, hMax: 60, inten: 0.4, cols: 5, rows: 12 }, // far
    ];
    const tallest = [];
    for (const L of layers) {
      const win = makeWindowGrid(L.cols, L.rows, 0.45);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x11151d, emissive: 0xffffff, emissiveMap: win, emissiveIntensity: L.inten,
        roughness: 0.9, metalness: 0.1,
      });
      const geos = [];
      for (let i = 0; i < L.n; i++) {
        const ang = (i / L.n) * Math.PI * 2 + crng.range(-0.12, 0.12);
        const rad = crng.range(L.rMin, L.rMax);
        const h = crng.range(L.hMin, L.hMax);
        const w = crng.range(16, 34), d = crng.range(16, 34);
        const bx = Math.cos(ang) * rad, bz = Math.sin(ang) * rad;
        const g = new THREE.BoxGeometry(w, h, d);
        g.translate(bx, h / 2 - 12, bz);
        geos.push(g);
        tallest.push({ x: bx, z: bz, top: h - 12, h });
      }
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), mat);
      for (const g of geos) g.dispose();
      cityGroup.add(mesh);
    }
    tallest.sort((a, b) => b.h - a.h);
    this._cityBeacons = tallest.slice(0, 4).map((b) => [b.x, b.top + 0.9, b.z]);
    this.scene.add(cityGroup);
    this.city = cityGroup;
  }

  _buildPillars() {
    // Concrete pillars in a rough grid — main cover.
    this._pillarPos = [];
    const px = [-18, -6, 6, 18];
    const pz = [-18, -6, 6, 18];
    for (const x of px) {
      for (const z of pz) {
        if (Math.abs(x) < 3 && Math.abs(z) < 3) continue; // keep spawn clear
        const jitter = rng.range(-1.5, 1.5);
        const g = new THREE.BoxGeometry(1.6, 12, 1.6);
        const m = new THREE.Mesh(g, this._mats.concrete);
        m.position.set(x + jitter * 0.3, 6, z + jitter * 0.3);
        m.castShadow = true; m.receiveShadow = true;
        this.group.add(m);
        this.addBoxCollider(x, 6, z, 1.6, 12, 1.6);
        this._pillarPos.push({ x: x + jitter * 0.3, z: z + jitter * 0.3 });
      }
    }
  }

  _buildRebar() {
    // Bundles of rebar — instanced thin cylinders. Sparks stream off these (F5).
    const count = 90;
    const geo = new THREE.CylinderGeometry(0.03, 0.03, 3.2, 6);
    const mat = new THREE.MeshStandardMaterial({ color: 0x5a4030, roughness: 0.6, metalness: 0.8 });
    const inst = new THREE.InstancedMesh(geo, mat, count);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      // group rebar into a few bundles
      const bundle = rng.int(0, 5);
      const bx = [-26, 26, -26, 26, 0, 0][bundle];
      const bz = [12, 12, -12, -12, 28, -28][bundle];
      dummy.position.set(bx + rng.range(-0.6, 0.6), 1.6, bz + rng.range(-0.6, 0.6));
      dummy.rotation.set(rng.range(-0.1, 0.1), 0, rng.range(-0.1, 0.1));
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    inst.castShadow = true;
    this.group.add(inst);
    this.rebarMeshes.push(inst);
  }

  _buildPallets() {
    const mk = (x, z, stack = 1, rot = 0) => {
      for (let i = 0; i < stack; i++) {
        const g = new THREE.BoxGeometry(2.2, 0.2, 1.2);
        const m = new THREE.Mesh(g, this._mats.wood);
        m.position.set(x, 0.1 + i * 0.22, z);
        m.rotation.y = rot;
        m.castShadow = true; m.receiveShadow = true;
        this.group.add(m);
        this.palletMeshes.push(m);
        if (i === stack - 1) this.registerShootable(m, 'wood');
      }
      this.addBoxCollider(x, 0.1 + stack * 0.11, z, 2.2, stack * 0.22, 1.2);
    };
    mk(-13, 12, 2, 0.3); mk(13, -12, 3, -0.2); mk(22, 6, 2, 0.1);
    mk(-22, -6, 2, 0.5); mk(6, 22, 3, 0); mk(-8, -24, 2, -0.4);
    // some as waist-high mantle obstacles
    mk(2, -3, 4, 0);
  }

  _buildDrywall() {
    // Stacked drywall panels — shoot-through thin cover (E3).
    const spots = [
      { x: -3, z: 10, ry: 0.2, stack: 4 },
      { x: 10, z: 3, ry: -0.4, stack: 3 },
      { x: -12, z: -14, ry: 0.8, stack: 5 },
      { x: 16, z: 16, ry: -0.2, stack: 3 },
    ];
    for (const s of spots) {
      const g = new THREE.BoxGeometry(3.2, 1.2, 0.08);
      for (let i = 0; i < s.stack; i++) {
        const m = new THREE.Mesh(g, this._mats.drywall);
        m.position.set(s.x, 0.1 + i * 0.12, s.z);
        m.rotation.y = s.ry;
        m.castShadow = true; m.receiveShadow = true;
        this.group.add(m);
        this.drywallMeshes.push(m);
        if (i === Math.floor(s.stack / 2)) this.registerShootable(m, 'drywall');
      }
      this.addBoxCollider(s.x, 0.1 + s.stack * 0.06, s.z, 3.2, s.stack * 0.12, 0.2);
    }
  }

  _buildBuckets() {
    // Paint buckets that burst with a colored puff (F5).
    const colors = [0xff3b30, 0x34c759, 0x0a84ff, 0xffd60a, 0xff9500];
    const spots = [[-5, 6], [8, -8], [-16, 2], [14, 12], [4, 16], [-10, -8], [20, -4], [-24, 8]];
    for (const [x, z] of spots) {
      const color = rng.pick(colors);
      const g = new THREE.CylinderGeometry(0.28, 0.34, 0.6, 16);
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.2 }));
      m.position.set(x, 0.3, z);
      m.castShadow = true; m.receiveShadow = true;
      this.group.add(m);
      this.bucketMeshes.push(m);
      this.registerShootable(m, 'bucket', color);
      this.addBoxCollider(x, 0.3, z, 0.6, 0.6, 0.6);
    }
  }

  _buildGlass() {
    // Glass panes that shatter into physical shards (F5).
    const spots = [
      { x: -20, z: 0, ry: Math.PI / 2 },
      { x: 20, z: 0, ry: Math.PI / 2 },
      { x: 0, z: -20, ry: 0 },
      { x: -6, z: 18, ry: 0.4 },
    ];
    for (const s of spots) {
      const g = new THREE.PlaneGeometry(2.4, 3.2);
      const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
        color: 0x9fd8ff, transparent: true, opacity: 0.28, roughness: 0.05, metalness: 0.1,
        side: THREE.DoubleSide, envMapIntensity: 1,
      }));
      m.position.set(s.x, 1.8, s.z);
      m.rotation.y = s.ry;
      this.group.add(m);
      this.registerShootable(m, 'glass');
      // frame
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.1, 0.1),
        this._mats.metal
      );
      frame.position.set(s.x, 0.1, s.z);
      frame.rotation.y = s.ry;
      this.group.add(frame);
    }
  }

  _buildSheeting() {
    // W1: plastic sheeting sways in wind and reacts to bullets.
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = 'rgba(180,220,255,0.35)';
    g.fillRect(0, 0, 64, 64);
    g.strokeStyle = 'rgba(255,255,255,0.25)';
    for (let i = 0; i < 64; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 64); g.stroke(); }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    const spots = [
      { x: 12, z: -20, ry: 0, w: 8, h: 6 },
      { x: -16, z: 18, ry: Math.PI / 2, w: 6, h: 5 },
      { x: 24, z: 4, ry: Math.PI / 2, w: 7, h: 6 },
    ];
    for (const s of spots) {
      const geo = new THREE.PlaneGeometry(s.w, s.h, 8, 6);
      const mat = new THREE.MeshStandardMaterial({
        map: tex, transparent: true, opacity: 0.4, roughness: 0.3, metalness: 0.0,
        side: THREE.DoubleSide, alphaTest: 0.02,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(s.x, s.h / 2 + 0.2, s.z);
      m.rotation.y = s.ry;
      m.castShadow = false;
      this.group.add(m);
      this.registerShootable(m, 'sheet');
      this.sheeting.push({ mesh: m, base: geo.attributes.position.array.slice(), phase: rng.next() * 10, amp: rng.range(0.15, 0.35) });
    }
  }

  _buildMantleObstacles() {
    // Waist-high obstacles for Space-mantle (M6).
    const spots = [
      { x: 4, z: -1, sx: 2.4, sz: 0.8 },
      { x: -8, z: 6, sx: 2.0, sz: 0.8 },
      { x: 10, z: 8, sx: 0.8, sz: 2.4 },
    ];
    for (const s of spots) {
      const h = 1.0;
      const g = new THREE.BoxGeometry(s.sx, h, s.sz);
      const m = new THREE.Mesh(g, this._mats.concrete);
      m.position.set(s.x, h / 2, s.z);
      m.castShadow = true; m.receiveShadow = true;
      this.group.add(m);
      this.addBoxCollider(s.x, h / 2, s.z, s.sx, h, s.sz);
      this.waistObstacles.push({ box: new THREE.Box3().setFromObject(m) });
      this.registerShootable(m, 'concrete');
    }
  }

  // ================= geometry helpers (transformed primitive accumulator) =================
  _box(arr, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
    const g = new THREE.BoxGeometry(w, h, d);
    if (rx) g.rotateX(rx);
    if (ry) g.rotateY(ry);
    if (rz) g.rotateZ(rz);
    g.translate(x, y, z);
    arr.push(g);
  }
  _cyl(arr, rt, rb, len, x, y, z, rx = 0, ry = 0, rz = 0, seg = 10) {
    const g = new THREE.CylinderGeometry(rt, rb, len, seg);
    if (rz) g.rotateZ(rz);
    if (ry) g.rotateY(ry);
    if (rx) g.rotateX(rx);
    g.translate(x, y, z);
    arr.push(g);
  }
  _torus(arr, R, r, x, y, z, rx = 0, ry = 0, rz = 0) {
    const g = new THREE.TorusGeometry(R, r, 8, 18);
    if (rz) g.rotateZ(rz);
    if (ry) g.rotateY(ry);
    if (rx) g.rotateX(rx);
    g.translate(x, y, z);
    arr.push(g);
  }
  _sph(arr, r, x, y, z) {
    const g = new THREE.SphereGeometry(r, 10, 8);
    g.translate(x, y, z);
    arr.push(g);
  }
  // Merge accumulated geometries into one mesh with the given material.
  _merge(arr, mat) {
    const merged = mergeGeometries(arr, false);
    const m = new THREE.Mesh(merged, mat);
    this.group.add(m);
    for (const g of arr) g.dispose();
    return m;
  }

  // ================= new heli-deck props =================

  // Iconic rooftop water tank in the (-52,-52) corner: legs, braces, body,
  // cone roof, access ladder. One merged mesh + 1 collider.
  _buildWaterTank() {
    const x = -52, z = -52;
    const p = [];
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      this._cyl(p, 0.09, 0.12, 1.7, x + Math.cos(a) * 1.85, 0.85, z + Math.sin(a) * 1.85, 0, 0, 0, 8);
    }
    for (let i = 0; i < 3; i++) {
      const a1 = (i / 3) * Math.PI * 2, a2 = a1 + Math.PI / 3;
      const dx = Math.cos(a2) - Math.cos(a1), dz = Math.sin(a2) - Math.sin(a1);
      const mx = x + (Math.cos(a1) + Math.cos(a2)) / 2 * 1.85;
      const mz = z + (Math.sin(a1) + Math.sin(a2)) / 2 * 1.85;
      this._box(p, Math.hypot(dx, dz) + 0.2, 0.05, 0.05, mx, 0.55, mz, 0, Math.atan2(-dz, dx), 0);
    }
    this._cyl(p, 2.2, 2.2, 2.2, x, 2.7, z, 0, 0, 0, 20);          // body
    this._cyl(p, 2.3, 2.3, 0.14, x, 3.77, z, 0, 0, 0, 20);          // top ring
    this._cyl(p, 0.06, 2.3, 1.3, x, 4.45, z, 0, 0, 0, 20);          // cone roof
    const lx = x + 2.32;                                            // ladder
    this._box(p, 0.05, 3.6, 0.05, lx - 0.25, 1.8, z);
    this._box(p, 0.05, 3.6, 0.05, lx + 0.25, 1.8, z);
    for (let i = 0; i < 8; i++) this._box(p, 0.55, 0.04, 0.04, lx, 0.4 + i * 0.45, z);
    const m = this._merge(p, this._mats.panel);
    m.castShadow = true; m.receiveShadow = true;
    this.addBoxCollider(x, 1.9, z, 4.8, 3.8, 4.8);
  }

  // Three HVAC units along the south wall with rotating fan blades.
  _buildHVAC() {
    const body = [], grille = [];
    const spots = [[30, 63], [38, 63], [46, 63]];
    for (const [x, z] of spots) {
      this._box(body, 2.4, 2.0, 2.0, x, 1.0, z);          // main unit (front = -z)
      this._box(body, 2.0, 0.5, 1.6, x, 2.25, z);         // top section
      this._cyl(body, 0.25, 0.25, 0.4, x + 0.6, 2.7, z - 0.3, 0, 0, 0, 10); // exhaust
      this._box(body, 0.5, 0.5, 5.0, x, 1.9, 66.8);       // duct to the wall
      this._box(grille, 1.75, 1.75, 0.06, x, 1.05, z - 1.0);  // fan frame
      this._torus(grille, 0.72, 0.06, x, 1.05, z - 1.04, 0, Math.PI, 0);
      // fan blades — own mesh so it can spin around its hub
      const b = [];
      for (let k = 0; k < 4; k++) {
        const g = new THREE.BoxGeometry(1.2, 0.22, 0.03);
        g.translate(0.44, 0, 0);
        g.rotateZ(k * Math.PI / 2 + 0.4);
        b.push(g);
      }
      const merged = mergeGeometries(b, false);
      const bm = new THREE.Mesh(merged, this._mats.steel);
      for (const g of b) g.dispose();
      bm.position.set(x, 1.05, z - 1.07);
      this.group.add(bm);
      this._fans.push({ node: bm, speed: rng.range(1.8, 3.4) });
    }
    const m1 = this._merge(body, this._mats.panel);
    m1.castShadow = true; m1.receiveShadow = true;
    this._merge(grille, this._mats.dark);
    for (const [x, z] of spots) this.addBoxCollider(x, 1.0, z, 2.4, 2.5, 2.0);
  }

  // All static steel in one merged mesh: wall pipe runs with flanges, valve,
  // supports; the big antenna mast + small radio mast; tank feed pipe.
  _buildSteel() {
    const s = this._steelParts;
    // north wall (z=-70): three horizontal runs
    this._cyl(s, 0.13, 0.13, 132, 0, 1.9, -68.8, 0, 0, Math.PI / 2, 10);
    this._cyl(s, 0.09, 0.09, 132, 0, 1.45, -68.8, 0, 0, Math.PI / 2, 10);
    this._cyl(s, 0.07, 0.07, 92, 13, 1.1, -68.8, 0, 0, Math.PI / 2, 10);
    for (const y of [1.9, 1.45, 1.1]) for (const fx of [-30, 10, 50])
      this._cyl(s, 0.19, 0.19, 0.06, fx, y, -68.8, 0, 0, Math.PI / 2, 10);
    this._cyl(s, 0.13, 0.13, 1.5, 66, 1.15, -68.8);          // elbow drop
    this._cyl(s, 0.09, 0.09, 1.05, 64.5, 0.95, -68.8);
    // valve on the middle run
    this._cyl(s, 0.05, 0.05, 0.34, -20, 1.45, -68.5, Math.PI / 2, 0, 0, 8);
    this._torus(s, 0.16, 0.03, -20, 1.45, -68.32, 0, Math.PI / 2, 0);
    for (const sx of [-60, -30, 0, 30, 60]) this._box(s, 0.08, 1.9, 0.08, sx, 0.95, -69.3);
    // west wall (x=-70): verticals
    this._cyl(s, 0.1, 0.1, 6, -69, 3, -30);
    this._cyl(s, 0.08, 0.08, 4.5, -69, 2.25, 20);
    this._cyl(s, 0.15, 0.15, 0.06, -69, 2.2, -30);
    this._cyl(s, 0.13, 0.13, 0.06, -69, 1.6, 20);
    // tank feed pipe (tank at -52,-52 → west wall)
    this._cyl(s, 0.12, 0.12, 17.5, -60.5, 2.5, -52, 0, 0, Math.PI / 2, 10);
    this._cyl(s, 0.18, 0.18, 0.06, -53.5, 2.5, -52, 0, 0, Math.PI / 2, 10);
    // main antenna mast (52,52), h≈10: 4 leaning legs + cross bars
    const mx = 52, mz = 52;
    for (const [ox, oz] of [[0.45, 0.45], [-0.45, 0.45], [0.45, -0.45], [-0.45, -0.45]])
      this._cyl(s, 0.05, 0.07, 10, mx + ox, 5, mz + oz, oz * 0.04, 0, ox * 0.04, 8);
    for (const h of [2.5, 5, 7.5, 9.5]) {
      this._box(s, 1.15, 0.07, 0.07, mx, h, mz);
      this._box(s, 0.07, 0.07, 1.15, mx, h, mz);
    }
    // small radio mast (56,-30), h≈6
    const rx = 56, rz = -30;
    for (const [ox, oz] of [[0.4, 0.3], [-0.4, 0.3], [0, -0.45]])
      this._cyl(s, 0.04, 0.06, 6, rx + ox, 3, rz + oz, oz * 0.05, 0, ox * 0.05, 8);
    this._box(s, 0.9, 0.05, 0.05, rx, 4.2, rz);
    this._box(s, 0.05, 0.05, 0.9, rx, 4.2, rz);
  }
  _mergeSteel() {
    const m = this._merge(this._steelParts, this._mats.steel);
    m.castShadow = true;
  }

  // Blinking aviation beacons: merged red spheres + one glow sprite each
  // (sprites blink with different phases in update()).
  _buildBeacons() {
    const spheres = [];
    const glowTex = makeGlow('rgba(255,40,30,1)');
    const positions = [
      [52, 10.45, 52],   // main mast top
      [56, 6.25, -30],   // small mast top
      ...this._cityBeacons, // 4 tallest city buildings
    ];
    for (const [x, y, z] of positions) {
      this._sph(spheres, 0.13, x, y, z);
      const mat = new THREE.SpriteMaterial({
        map: glowTex, color: 0xff3520, transparent: true, opacity: 0.8,
        depthWrite: false, blending: THREE.AdditiveBlending,
      });
      const sp = new THREE.Sprite(mat);
      sp.scale.set(3.0, 3.0, 1);
      sp.position.set(x, y + 0.08, z);
      this.group.add(sp);
      this._beacons.push({ mat, phase: rng.next() * Math.PI * 2 });
    }
    this._merge(spheres, this._mats.beacon);
  }

  // Satellite dish on a column near the east wall.
  _buildDish() {
    const x = 64, z = -24;
    const solid = [];
    this._box(solid, 0.5, 0.08, 0.5, x, 0.04, z);                 // base plate
    this._cyl(solid, 0.12, 0.16, 2.6, x, 1.3, z);                 // column
    this._cyl(solid, 0.03, 0.03, 0.8, x, 3.25, z - 0.15, 0.55, 0, 0, 6); // feed arm
    this._sph(solid, 0.09, x, 3.58, z - 0.42);                    // feed tip
    const m1 = this._merge(solid, this._mats.panel);
    m1.castShadow = true; m1.receiveShadow = true;
    // dish bowl (double-sided so the concave face reads)
    const bowl = new THREE.SphereGeometry(1.15, 16, 10, 0, Math.PI * 2, Math.PI * 0.58, Math.PI * 0.42);
    bowl.rotateX(-0.7);
    bowl.translate(x, 2.85, z);
    const bm = new THREE.Mesh(bowl, new THREE.MeshStandardMaterial({
      map: makeMetalPanel('#a8adb5'), roughness: 0.5, metalness: 0.8, side: THREE.DoubleSide,
    }));
    bm.castShadow = true;
    this.group.add(bm);
  }

  // Crate clusters (shootable 'crate') — one shootable crate per cluster +
  // decorative stacked crates merged together.
  _crateFrame(arr, x, y, z, ry, s) {
    const hw = s / 2;
    for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const lx = sx * (hw - 0.04), lz = sz * (hw - 0.04);
      const wx = x + lx * Math.cos(ry) + lz * Math.sin(ry);
      const wz = z - lx * Math.sin(ry) + lz * Math.cos(ry);
      this._box(arr, 0.11, s + 0.04, 0.11, wx, y, wz, 0, ry, 0);
    }
  }
  _cratePair(x, y, z, ry) {
    const body = [], fr = [];
    this._box(body, 1.4, 1.4, 1.4, x, y, z, 0, ry, 0);
    this._crateFrame(fr, x, y, z, ry, 1.4);
    const bm = this._merge(body, this._mats.wood);
    const fm = this._merge(fr, this._mats.dark);
    bm.castShadow = true; bm.receiveShadow = true; fm.castShadow = true;
    return bm;
  }
  _buildCrates() {
    const dWood = [], dFrame = [];
    const a = this._cratePair(-36, 0.7, 18, 0.3);
    this._box(dWood, 1.4, 1.4, 1.4, -36, 2.1, 18, 0, 0.62, 0);
    this._crateFrame(dFrame, -36, 2.1, 18, 0.62, 1.4);
    const b = this._cratePair(38, 0.7, -34, -0.4);
    const c = this._cratePair(-44, 0.7, -28, 0.1);
    this._box(dWood, 1.4, 1.4, 1.4, -45.7, 0.7, -29.5, 0, 0.9, 0);
    this._crateFrame(dFrame, -45.7, 0.7, -29.5, 0.9, 1.4);
    const m1 = this._merge(dWood, this._mats.wood);
    m1.castShadow = true; m1.receiveShadow = true;
    const m2 = this._merge(dFrame, this._mats.dark);
    m2.castShadow = true;
    for (const crate of [a, b, c]) this.registerShootable(crate, 'crate');
    // one collider per cluster
    this.addBoxCollider(-36, 1.4, 18, 3.2, 2.8, 3.2);
    this.addBoxCollider(38, 0.7, -34, 2.0, 1.4, 2.0);
    this.addBoxCollider(-44.8, 0.7, -28.7, 3.6, 1.4, 2.8);
  }

  // Steel barrels (shootable 'barrel'); rims join the shared steel merge.
  _buildBarrels() {
    const spots = [
      [-34.6, 19.6],   // cluster A
      [39.4, -35.4],   // cluster B
      [37.4, -32.8],   // cluster B
      [-42.9, -29.6],  // cluster C
    ];
    spots.forEach(([x, z]) => {
      const bodyGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.05, 14);
      bodyGeo.translate(x, 0.55, z);
      const body = new THREE.Mesh(bodyGeo, this._mats.steel);
      body.castShadow = true; body.receiveShadow = true;
      this.group.add(body);
      this.registerShootable(body, 'barrel');
      this._torus(this._steelParts, 0.43, 0.035, x, 0.25, z);
      this._torus(this._steelParts, 0.43, 0.035, x, 0.88, z);
    });
    // hazard band on one barrel (open cylinder, slightly proud of the body)
    const band = new THREE.CylinderGeometry(0.435, 0.435, 0.28, 14, 1, true);
    band.translate(spots[0][0], 0.55, spots[0][1]);
    const bm = new THREE.Mesh(band, this._mats.hazard);
    this.group.add(bm);
  }

  // Jersey barriers — stacked boxes (chamfer illusion) + hazard end caps.
  _buildJersey() {
    const con = [], hz = [];
    const spots = [[0, 44, 0], [-34, -32, Math.PI / 2], [46, 20, 0]];
    for (const [x, z, ry] of spots) {
      this._box(con, 2.4, 0.55, 0.5, x, 0.275, z, 0, ry, 0);
      this._box(con, 2.0, 0.45, 0.42, x, 0.775, z, 0, ry, 0);
      for (const s of [1, -1]) {
        const ex = (2.0 / 2 + 0.02) * s;
        const wx = x + ex * Math.cos(ry), wz = z - ex * Math.sin(ry);
        this._box(hz, 0.06, 0.45, 0.44, wx, 0.775, wz, 0, ry, 0);
      }
      this.addBoxCollider(x, 0.5, z, 2.4, 1.0, 0.55);
    }
    const m1 = this._merge(con, this._mats.concrete);
    m1.castShadow = true; m1.receiveShadow = true;
    this._merge(hz, this._mats.hazard);
  }

  // Access hatch by the west wall: concrete base, hinged metal lid left open,
  // two steps (steps join the shared steel merge).
  _buildHatch() {
    const x = -63, z = 8;
    const baseGeo = new THREE.BoxGeometry(1.8, 0.3, 1.4);
    baseGeo.translate(x, 0.15, z);
    const bm = new THREE.Mesh(baseGeo, this._mats.concrete);
    bm.castShadow = true; bm.receiveShadow = true;
    this.group.add(bm);
    // lid: geometry offset so its -x edge is the hinge pivot
    const lidGeo = new THREE.BoxGeometry(1.5, 0.06, 1.2);
    lidGeo.translate(0.75, 0.3, 0);
    const hinge = new THREE.Group();
    hinge.position.set(x - 0.78, 0.32, z);
    hinge.rotation.z = 0.5; // propped open
    const lm = new THREE.Mesh(lidGeo, this._mats.panel);
    lm.castShadow = true;
    hinge.add(lm);
    this.group.add(hinge);
    this._box(this._steelParts, 0.4, 0.05, 0.5, x + 1.1, 0.2, z);
    this._box(this._steelParts, 0.35, 0.05, 0.45, x + 1.45, 0.12, z);
    this.addBoxCollider(x, 0.4, z, 2.2, 0.8, 1.6);
  }

  // Detail pass on 5 existing pillars: base plinth, cracked cap slabs,
  // dark stain streaks; two pillars get a rooftop AC condenser on top.
  _buildPillarDetails() {
    const con = [], dark = [];
    const idx = [0, 3, 6, 9, 12];
    for (const i of idx) {
      const p = this._pillarPos[i];
      if (!p) continue;
      this._box(con, 2.3, 0.6, 2.3, p.x, 0.3, p.z);                    // plinth
      this._box(con, 1.9, 0.3, 1.9,
        p.x + rng.range(-0.08, 0.08), 12.15, p.z + rng.range(-0.08, 0.08),
        rng.range(-0.06, 0.06), 0, rng.range(-0.06, 0.06));            // cap slab
      this._box(dark, 0.9, 0.12, 1.0,
        p.x + rng.range(-0.3, 0.3), 12.34, p.z + rng.range(-0.3, 0.3),
        rng.range(-0.4, 0.4), 0, rng.range(-0.4, 0.4));                // broken piece
      this._box(dark, 0.7, 0.1, 0.8,
        p.x + rng.range(-0.35, 0.35), 12.3, p.z + rng.range(-0.35, 0.35),
        0, 0, rng.range(0.3, 1.2));
      this._box(dark, 0.35, 3.5, 0.02, p.x + 0.82, 9.5, p.z + rng.range(-0.3, 0.3)); // stain streak
    }
    const m1 = this._merge(con, this._mats.concrete);
    m1.castShadow = true; m1.receiveShadow = true;
    this._merge(dark, this._mats.dark);
    // AC condensers on top of two pillars
    const cond = [];
    for (const i of [0, 9]) {
      const p = this._pillarPos[i];
      if (!p) continue;
      this._box(cond, 1.2, 0.8, 1.0, p.x, 12.4, p.z);
      this._torus(cond, 0.3, 0.05, p.x + 0.62, 12.4, p.z, 0, Math.PI / 2, 0);
    }
    const m2 = this._merge(cond, this._mats.panel);
    m2.castShadow = true;
  }

  // Sky effects: drifting clouds, pale moon (opposite the sun), occasional
  // airplane crossing. Lives in its own scene group so dispose() removes it.
  _buildSkyFX() {
    const fx = new THREE.Group();
    this.skyfx = fx;
    this.scene.add(fx);
    // clouds
    const cloudTex = this._makeCloudTex();
    for (let i = 0; i < 4; i++) {
      const mat = new THREE.SpriteMaterial({
        map: cloudTex, color: 0xffc9a3, transparent: true, opacity: rng.range(0.1, 0.2),
        depthWrite: false,
      });
      const sp = new THREE.Sprite(mat);
      const s = rng.range(30, 80);
      sp.scale.set(s, s * rng.range(0.28, 0.42), 1);
      sp.position.set(rng.range(-150, 150), rng.range(25, 45), rng.range(-260, -90));
      fx.add(sp);
      this._clouds.push({ sp, speed: rng.range(0.4, 1.1) });
    }
    // moon — opposite side from the sun (sun azim ≈ 0.3 → moon ≈ 2.7)
    const moon = new THREE.Sprite(new THREE.SpriteMaterial({
      map: this._makeMoonTex(), transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false,
    }));
    moon.scale.set(16, 16, 1);
    moon.position.set(Math.cos(2.7) * 250, 70, Math.sin(2.7) * 250);
    fx.add(moon);
    // airplane: small bright dot + faint trail; flies an arc ~30s, rests
    const plane = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlow('rgba(255,255,255,1)'), color: 0xffffff, transparent: true, opacity: 0.9,
      depthWrite: false, toneMapped: false,
    }));
    plane.scale.set(1.6, 1.6, 1);
    plane.visible = false;
    const trail = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlow('rgba(255,255,255,0.5)'), color: 0xdfe8ff, transparent: true, opacity: 0.22,
      depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false,
    }));
    trail.scale.set(14, 0.7, 1);
    trail.visible = false;
    fx.add(plane, trail);
    this._plane = {
      plane, trail, active: false, t: 0, dur: 30,
      gapIdx: 0, gapT: rng.range(4, 15),
      gaps: [35, 25, 45, 55, 30, 40], // fixed sequence → deterministic regardless of fps
      startAng: rng.range(0, Math.PI * 2), span: rng.range(1.4, 2.0),
    };
  }
  _makeCloudTex() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    const g = c.getContext('2d');
    for (let i = 0; i < 3; i++) {
      const x = 40 + rng.next() * 176, y = 45 + rng.next() * 40, r = 34 + rng.next() * 44;
      const grd = g.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, 'rgba(255,255,255,0.85)');
      grd.addColorStop(0.55, 'rgba(255,255,255,0.4)');
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grd;
      g.fillRect(0, 0, 256, 128);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  _makeMoonTex() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 10, 64, 64, 62);
    grd.addColorStop(0, 'rgba(235,238,245,1)');
    grd.addColorStop(0.78, 'rgba(224,228,240,0.92)');
    grd.addColorStop(1, 'rgba(220,224,238,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    g.fillStyle = 'rgba(186,192,208,0.45)';
    for (let i = 0; i < 7; i++) {
      g.beginPath();
      g.arc(34 + rng.next() * 60, 34 + rng.next() * 60, 3 + rng.next() * 6, 0, 7);
      g.fill();
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // Per-frame animation (wired into the game loop). t = seconds, dt = real dt.
  update(t, dt) {
    if (dt > 0.05) dt = 0.05;
    // HVAC fan blades
    for (const f of this._fans) f.node.rotation.z += f.speed * dt;
    // beacons: ~1.4s blink, different phase per beacon
    for (const b of this._beacons) {
      const p = 0.5 + 0.5 * Math.sin(t * 4.4 + b.phase);
      b.mat.opacity = 0.12 + 0.88 * p * p * p;
    }
    // clouds drift on +x, wrap
    for (const c of this._clouds) {
      c.sp.position.x += c.speed * dt;
      if (c.sp.position.x > 170) c.sp.position.x = -170;
    }
    // airplane
    const pl = this._plane;
    if (!pl) return;
    if (pl.active) {
      pl.t += dt;
      if (pl.t >= pl.dur) {
        pl.active = false;
        pl.t = 0;
        pl.plane.visible = false;
        pl.trail.visible = false;
        pl.gapT = pl.gaps[pl.gapIdx % pl.gaps.length];
        pl.gapIdx++;
        return;
      }
      const u = pl.t / pl.dur;
      const a = pl.startAng + u * pl.span;
      const y = 35 + 22 * Math.sin(u * Math.PI);
      pl.plane.position.set(Math.cos(a) * 240, y, Math.sin(a) * 240);
      // trail lags a beat behind along the same arc
      const u2 = Math.max(0, u - 0.014);
      const a2 = pl.startAng + u2 * pl.span;
      pl.trail.position.set(Math.cos(a2) * 240, 35 + 22 * Math.sin(u2 * Math.PI), Math.sin(a2) * 240);
    } else {
      pl.gapT -= dt;
      if (pl.gapT <= 0) {
        pl.active = true;
        pl.t = 0;
        pl.plane.visible = true;
        pl.trail.visible = true;
      }
    }
  }

  getRaycastTargets() {
    if (!this._targets) {
      this._targets = [];
      this.group.traverse((o) => { if (o.isMesh) this._targets.push(o); });
    }
    return this._targets;
  }

  findShootable(mesh) {
    for (const s of this.shootables) if (s.mesh === mesh) return s;
    return null;
  }

  destroyShootable(mesh) {
    const s = this.findShootable(mesh);
    if (s) { s.alive = false; }
  }

  // Animate sheeting sway (W1). t = time.
  updateSheets(t, gust = 1) {
    for (const s of this.sheeting) {
      const pos = s.mesh.geometry.attributes.position;
      const base = s.base;
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        const wave = Math.sin(t * 1.5 + s.phase + x * 0.4) * s.amp * (0.5 + 0.5 * (y + s.mesh.geometry.parameters.height / 2) / s.mesh.geometry.parameters.height);
        pos.setZ(i, wave * gust);
      }
      pos.needsUpdate = true;
      s.mesh.geometry.computeVertexNormals();
    }
  }

  dispose() {
    this.scene.remove(this.group);
    this.scene.remove(this.sky, this.city, this.skyfx);
    this.colliders = [];
    this.shootables = [];
  }
}