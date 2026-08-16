import * as THREE from 'three';

// G1/G4/G5: cinematic golden-hour lighting.
// Warm key sun + cool bounce, sun sprite, lens flare, volumetric shafts,
// dust motes. The sun dips slowly over the match so shadows crawl (G4).
export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);

    // Ambient sky bounce (cool sky / warm dusk ground) — lifted so shadowed
    // faces read as twilight instead of black (AAA contrast, not black crush)
    this.hemi = new THREE.HemisphereLight(0x8fa8d0, 0x4a3020, 0.85);
    this.group.add(this.hemi);

    // City glow fill: warm bounce from the lit window walls (low, opposite
    // the sun) — keeps shadowed prop faces readable and rim-lit at sunset.
    this.cityGlow = new THREE.DirectionalLight(0xff9a55, 0.35);
    this.cityGlow.position.set(-45, 8, -45);
    this.group.add(this.cityGlow);
    this.group.add(this.cityGlow.target);
    this.cityGlow.target.position.set(0, 0, 0);

    // G1: physically-plausible warm key sun
    this.sun = new THREE.DirectionalLight(0xffd9a0, 2.6);
    this.sun.position.set(60, 34, 20);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 220;
    const s = 60;
    this.sun.shadow.camera.left = -s;
    this.sun.shadow.camera.right = s;
    this.sun.shadow.camera.top = s;
    this.sun.shadow.camera.bottom = -s;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.02;
    this.group.add(this.sun);
    this.group.add(this.sun.target);
    this.sun.target.position.set(0, 0, 0);

    // Cool bounce fill from opposite side
    this.bounce = new THREE.DirectionalLight(0x5a70a0, 0.4);
    this.bounce.position.set(-40, 20, -30);
    this.group.add(this.bounce);

    this._buildSunSprite();
    this._buildLensFlare();
    this._buildShafts();
    this._buildDust();

    this.elapsed = 0;
    this.matchDur = 300;      // seconds for the full sun dip
    this._baseElev = 0.32;    // radians-ish altitude factor
    this._baseAzim = 0.4;
  }

  _buildSunSprite() {
    // Large warm sun disc drawn as a radial-gradient sprite, additive.
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255,240,210,1)');
    grd.addColorStop(0.2, 'rgba(255,210,150,0.9)');
    grd.addColorStop(0.5, 'rgba(255,170,90,0.35)');
    grd.addColorStop(1, 'rgba(255,150,60,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({
      map: tex, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
      transparent: true, opacity: 0.95,
    });
    this.sunSprite = new THREE.Sprite(mat);
    this.sunSprite.scale.set(70, 70, 1);
    this.scene.add(this.sunSprite);
  }

  _buildLensFlare() {
    // Fake lens flare: a couple of small additive sprites along the sun-camera axis.
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,220,170,0.9)');
    grd.addColorStop(0.4, 'rgba(255,180,110,0.4)');
    grd.addColorStop(1, 'rgba(255,150,80,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    this.flare = [];
    for (let i = 0; i < 3; i++) {
      const m = new THREE.SpriteMaterial({ map: tex, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true, opacity: 0.25 });
      const s = new THREE.Sprite(m);
      const sc = 6 - i * 1.5;
      s.scale.set(sc, sc, 1);
      this.scene.add(s);
      this.flare.push({ sprite: s, t: 0.25 + i * 0.3 });
    }
  }

  _buildShafts() {
    // G4: volumetric light shafts — additive gradient planes angled like sun rays.
    const c = document.createElement('canvas');
    c.width = 64; c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0, 'rgba(255,210,150,0.0)');
    grd.addColorStop(0.5, 'rgba(255,210,150,0.35)');
    grd.addColorStop(1, 'rgba(255,210,150,0.0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 256);
    const tex = new THREE.CanvasTexture(c);
    this.shafts = [];
    const spots = [
      { x: -14, z: -8, ry: 0.4 }, { x: 12, z: -16, ry: -0.3 }, { x: 22, z: 10, ry: 0.9 }, { x: -20, z: 16, ry: 1.6 },
    ];
    for (const sp of spots) {
      const geo = new THREE.PlaneGeometry(10, 26);
      const mat = new THREE.MeshBasicMaterial({
        map: tex, transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, side: THREE.DoubleSide, opacity: 0.5,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(sp.x, 8, sp.z);
      m.rotation.y = sp.ry;
      m.rotation.z = 0.5;
      this.scene.add(m);
      this.shafts.push(m);
    }
  }

  _buildDust() {
    // G4: dust motes floating in the beams.
    const N = 350;
    const pos = new Float32Array(N * 3);
    this.dustSeed = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 1] = Math.random() * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 70;
      this.dustSeed[i * 2] = Math.random() * 100;
      this.dustSeed[i * 2 + 1] = 0.2 + Math.random() * 0.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffdca8, size: 0.05, transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    this.dust = new THREE.Points(geo, mat);
    this.scene.add(this.dust);
    this.dustN = N;
  }

  update(dt, time) {
    this.elapsed += dt;
    // G4: sun dips slowly over the match — long shadows crawl.
    const p = Math.min(1, this.elapsed / this.matchDur);
    const elev = this._baseElev * (1 - p * 0.45);      // lowering
    const azim = this._baseAzim + p * 0.5;
    const r = 90;
    const x = Math.cos(elev) * Math.cos(azim) * r;
    const y = Math.sin(elev) * r + 6;
    const z = Math.cos(elev) * Math.sin(azim) * r;
    this.sun.position.set(x, y, z);
    // warmer + dimmer as it sets
    const warm = 1 - p * 0.3;
    this.sun.intensity = 2.6 * warm;
    this.sun.color.setHSL(0.08 - p * 0.02, 0.8, 0.62);
    this.hemi.intensity = 0.95 * warm;
    // city windows grow in presence as the sun dips
    this.cityGlow.intensity = 0.4 + 0.35 * p;

    // Sun sprite follows sun direction, far out.
    this.sunSprite.position.copy(this.sun.position).multiplyScalar(1.6).setY(Math.max(20, this.sun.position.y));
    // Lens flare along sun direction (screen-space-ish fade)
    const dir = this.sun.position.clone().normalize();
    for (const f of this.flare) {
      f.sprite.position.copy(dir).multiplyScalar(120 * f.t).add(new THREE.Vector3(0, 4, 0));
      f.sprite.material.opacity = 0.25 * warm * (1 - p * 0.3);
    }
    // Dust drift
    const pos = this.dust.geometry.attributes.position.array;
    const t = time;
    for (let i = 0; i < this.dustN; i++) {
      const s = this.dustSeed[i * 2];
      const sp = this.dustSeed[i * 2 + 1];
      pos[i * 3] += Math.sin(t * 0.3 + s) * 0.002 + 0.003;
      pos[i * 3 + 1] += Math.cos(t * 0.2 + s) * 0.001;
      if (pos[i * 3] > 35) pos[i * 3] = -35;
      if (pos[i * 3 + 1] < 0) pos[i * 3 + 1] = 16;
    }
    this.dust.geometry.attributes.position.needsUpdate = true;
  }

  dispose() {
    this.scene.remove(this.group, this.sunSprite);
    for (const f of this.flare) this.scene.remove(f.sprite);
    for (const s of this.shafts) this.scene.remove(s);
    this.scene.remove(this.dust);
  }
}
