import * as THREE from 'three';
import { CFG } from '../core/Config.js';
import { rng } from '../core/PRNG.js';
import { ParticleSystem, ShellEjector } from './Particles.js';
import { Decals } from './Decals.js';
import { Tracers } from './Tracers.js';
import { MuzzleFlash } from './MuzzleFlash.js';
import { makeGlow } from '../engine/Textures.js';

function softTex(color) {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, color);
  grd.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
  g.fillStyle = grd;
  g.fillRect(0, 0, 32, 32);
  const t = new THREE.CanvasTexture(c);
  return t;
}

// H/F: the impact-flesh feedback hub. Blood spray, mist, droplets, world
// impacts, decals, tracers, muzzle flash, shells, damage numbers.
export class EffectsManager {
  constructor(scene, camera, hud) {
    this.scene = scene;
    this.camera = camera;
    this.hud = hud;

    const quad = new THREE.PlaneGeometry(0.06, 0.06);
    const quadBig = new THREE.PlaneGeometry(0.2, 0.2);
    const box = new THREE.BoxGeometry(0.03, 0.03, 0.09);
    const glassGeo = new THREE.TetrahedronGeometry(0.03);
    const shellGeo = new THREE.BoxGeometry(0.02, 0.05, 0.02);

    this.blood = new ParticleSystem(scene, quad, new THREE.MeshBasicMaterial({ map: softTex('rgba(120,6,10,0.9)'), transparent: true, depthWrite: false, side: THREE.DoubleSide }), CFG.perf.maxBlood);
    this.mist = new ParticleSystem(scene, quadBig, new THREE.MeshBasicMaterial({ map: softTex('rgba(90,4,8,0.5)'), transparent: true, depthWrite: false, side: THREE.DoubleSide }), 400);
    this.dust = new ParticleSystem(scene, quadBig, new THREE.MeshBasicMaterial({ map: softTex('rgba(180,170,150,0.5)'), transparent: true, depthWrite: false, side: THREE.DoubleSide }), CFG.perf.maxDust);
    this.sparks = new ParticleSystem(scene, quad, new THREE.MeshBasicMaterial({ map: softTex('rgba(255,220,120,1)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), CFG.perf.maxSparks);
    this.smoke = new ParticleSystem(scene, quadBig, new THREE.MeshBasicMaterial({ map: softTex('rgba(120,120,120,0.4)'), transparent: true, depthWrite: false, side: THREE.DoubleSide }), 300);
    this.splinters = new ParticleSystem(scene, box, new THREE.MeshStandardMaterial({ color: 0x9a7a4a, roughness: 0.8 }), 300);
    this.glass = new ParticleSystem(scene, glassGeo, new THREE.MeshBasicMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.8, side: THREE.DoubleSide }), 300);
    this.shells = new ShellEjector(scene, shellGeo, new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.3 }), CFG.perf.maxShells);
    this.decals = new Decals(scene, CFG.perf.maxDecals);
    this.tracers = new Tracers(scene, CFG.perf.maxTracers);
    this.muzzle = new MuzzleFlash(scene, makeGlow('rgba(255,220,150,1)'));
    this.dmgNums = new DamageNumbers(this.layer(), CFG.perf.maxDamageNumbers, camera);
    this._v = new THREE.Vector3();
  }
  layer() { return this.hud ? this.hud.el('score-fly') : document.body; }

  // H1: directional blood spray from hit point away from the bullet.
  bloodHit(point, normal, bulletDir, isHead) {
    const n = isHead ? 34 : 16;
    for (let i = 0; i < n; i++) {
      const spread = 0.6;
      const v = this._v.copy(bulletDir).multiplyScalar(rng.range(2, 6))
        .addScaledVector(normal, rng.range(1, 3))
        .add(new THREE.Vector3(rng.gauss() * spread, rng.gauss() * spread, rng.gauss() * spread));
      this.blood.spawn(point.x, point.y, point.z, {
        vx: v.x, vy: v.y, vz: v.z,
        life: rng.range(0.4, 1.0), size: rng.range(0.03, 0.09) * (isHead ? 1.4 : 1),
        gravity: 9, drag: 1.2, color: isHead ? 0x7a0508 : 0x6a0406,
      });
    }
    // mist puffs (H1)
    for (let i = 0; i < (isHead ? 5 : 2); i++) {
      const v = this._v.copy(bulletDir).multiplyScalar(rng.range(0.5, 1.5)).addScaledVector(normal, rng.range(0.5, 1.5));
      this.mist.spawn(point.x, point.y, point.z, { vx: v.x, vy: v.y, vz: v.z, life: rng.range(0.5, 1.1), size: rng.range(0.3, 0.6), drag: 2.0, color: 0x5a0406 });
    }
    // H1: blood decal on the surface
    this.decals.addBlood(point, normal);
  }

  // H6: blood pool under a body.
  bloodPool(point, normal) {
    for (let i = 0; i < 6; i++) {
      const o = new THREE.Vector3(rng.range(-0.3, 0.3), 0, rng.range(-0.3, 0.3));
      this.decals.addBlood(point.clone().add(o), normal);
    }
  }

  // F5: world impact — dust, sparks (rebar/metal), splinters (wood), glass, bucket.
  worldImpact(point, normal, type, color) {
    this.decals.addHole(point, normal);
    if (type === 'wood') {
      for (let i = 0; i < 8; i++) this.splinters.spawn(point.x, point.y, point.z, { vx: (rng.gauss() + normal.x * 3) * 2, vy: Math.abs(rng.gauss()) * 3 + 1, vz: (rng.gauss() + normal.z * 3) * 2, life: rng.range(0.4, 0.9), size: rng.range(0.5, 1.2), gravity: 12, drag: 1, color: 0x9a7a4a, spin: rng.range(-15, 15) });
      for (let i = 0; i < 4; i++) this.dust.spawn(point.x, point.y, point.z, { vx: normal.x * 2 + rng.gauss(), vy: 1 + rng.gauss(), vz: normal.z * 2 + rng.gauss(), life: 0.6, size: rng.range(0.2, 0.4), drag: 2, color: 0xcbb89a });
    } else if (type === 'metal' || type === 'rebar') {
      for (let i = 0; i < 14; i++) this.sparks.spawn(point.x, point.y, point.z, { vx: (rng.gauss() * 3 + normal.x * 5), vy: Math.abs(rng.gauss()) * 4 + 2, vz: (rng.gauss() * 3 + normal.z * 5), life: rng.range(0.2, 0.5), size: rng.range(0.03, 0.07), gravity: 14, drag: 0.5, color: 0xffd080, spin: 20 });
      for (let i = 0; i < 3; i++) this.dust.spawn(point.x, point.y, point.z, { vx: normal.x, vy: 1, vz: normal.z, life: 0.5, size: 0.2, drag: 2, color: 0x999 });
    } else if (type === 'glass') {
      for (let i = 0; i < 20; i++) this.glass.spawn(point.x, point.y, point.z, { vx: (rng.gauss() * 4 + normal.x * 3), vy: Math.abs(rng.gauss()) * 3, vz: (rng.gauss() * 4 + normal.z * 3), life: rng.range(0.5, 1.2), size: rng.range(0.6, 1.5), gravity: 12, drag: 0.3, color: 0xbfe8ff, spin: rng.range(-20, 20) });
    } else if (type === 'bucket') {
      const c = new THREE.Color(color ?? 0xff3b30);
      for (let i = 0; i < 30; i++) this.dust.spawn(point.x, point.y + 0.2, point.z, { vx: (rng.gauss() * 3 + normal.x * 3), vy: Math.abs(rng.gauss()) * 4 + 2, vz: (rng.gauss() * 3 + normal.z * 3), life: rng.range(0.6, 1.4), size: rng.range(0.3, 0.6), drag: 1.5, color: c.getHex(), spin: 0 });
    } else if (type === 'drywall' || type === 'sheet') {
      // gypsum dust (E3)
      const col = type === 'sheet' ? 0xbcd4f0 : 0xcfc8bc;
      for (let i = 0; i < 12; i++) this.dust.spawn(point.x, point.y, point.z, { vx: (rng.gauss() * 2 + normal.x * 3), vy: Math.abs(rng.gauss()) * 2 + 1, vz: (rng.gauss() * 2 + normal.z * 3), life: rng.range(0.5, 1.0), size: rng.range(0.2, 0.5), drag: 2, color: col });
    } else {
      // concrete
      for (let i = 0; i < 6; i++) this.dust.spawn(point.x, point.y, point.z, { vx: (rng.gauss() + normal.x * 3) * 2, vy: Math.abs(rng.gauss()) * 2 + 1, vz: (rng.gauss() + normal.z * 3) * 2, life: 0.7, size: rng.range(0.15, 0.35), drag: 2, color: 0xa8a29a });
    }
  }

  muzzleFlash(camera, vm) {
    const p = new THREE.Vector3();
    vm.muzzleWorld(p);
    this.muzzle.flash(p, rng.next() * 6);
    // muzzle smoke wisps (F4)
    for (let i = 0; i < 3; i++) {
      this.smoke.spawn(p.x, p.y, p.z, { vx: -rng.range(0.2, 0.6) + rng.gauss(), vy: rng.range(0.3, 0.8), vz: -rng.range(0.2, 0.6) + rng.gauss(), life: rng.range(0.8, 1.6), size: rng.range(0.3, 0.6), drag: 1.5, color: 0x888 });
    }
  }

  shellEject(muzzle, dir) {
    // eject to the right of the muzzle
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    const p = muzzle.clone().addScaledVector(right, 0.1);
    this.shells.eject(p.x, p.y, p.z, dir.x, dir.z);
  }

  tracer(from, to, hit) {
    const isHead = hit && hit.part === 'head';
    this.tracers.fire(from, to, isHead ? 0xff6060 : 0xffd080);
  }

  // H2: damage number pop.
  damageNumber(point, amount, isHead) {
    this.dmgNums.spawn(point, amount, isHead);
  }

  overdrive(on) { this.tracers.overdrive = on; }

  // shell bounce tinkles (F4)
  consumeShellBounces(cb) {
    const b = this._lastBounces || [];
    this._lastBounces = [];
    if (b.length) { for (let i = 0; i < b.length; i += 2) cb(b[i], b[i + 1]); }
  }

  update(dt) {
    this.blood.update(dt);
    this.mist.update(dt);
    this.dust.update(dt);
    this.sparks.update(dt);
    this.smoke.update(dt);
    this.splinters.update(dt);
    this.glass.update(dt);
    this._lastBounces = this.shells.update(dt) || [];
    this.decals && null;
    this.tracers.update(dt);
    this.muzzle.update(dt);
    this.dmgNums.update(dt);
  }

  // H6: clear blood decals between waves.
  clearWave() { this.decals.clearBlood(); }
  clearAll() { this.decals.clearAll(); this.dmgNums.clear(); }

  stats() {
    return {
      particles: this.blood.activeCount + this.dust.activeCount + this.sparks.activeCount + this.smoke.activeCount + this.splinters.activeCount + this.glass.activeCount + this.mist.activeCount,
      shells: this.shells.activeCount,
      decals: this.decals.activeBlood(),
    };
  }

  dispose() {
    [this.blood, this.mist, this.dust, this.sparks, this.smoke, this.splinters, this.glass, this.shells].forEach(p => p.dispose());
    this.decals.dispose();
    this.tracers.dispose();
    this.muzzle.dispose();
    this.dmgNums.dispose();
  }
}

// H2/D7: DOM damage numbers that pop off enemies with ease-out scale/fade.
class DamageNumbers {
  constructor(layer, max, camera) {
    this.max = max;
    this.cam = camera;
    this.layer = layer || document.body;
    this.items = [];
    this.idx = 0;
    for (let i = 0; i < max; i++) {
      const d = document.createElement('div');
      d.className = 'score-fly';
      d.style.display = 'none';
      this.layer.appendChild(d);
      this.items.push({ el: d, active: false, t: 0, life: 0.7, x: 0, y: 0 });
    }
  }
  spawn(point, amount, isHead) {
    const it = this.items[this.idx];
    this.idx = (this.idx + 1) % this.max;
    if (!this.cam) return;
    const p = point.clone().project(this.cam);
    const x = (p.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-p.y * 0.5 + 0.5) * window.innerHeight;
    it.el.style.display = 'block';
    it.el.textContent = Math.round(amount) + (isHead ? ' ✦' : '');
    it.el.style.color = isHead ? '#ff5a5a' : '#ffce7a';
    it.el.style.fontSize = (isHead ? 26 : 18) + 'px';
    it.x = x; it.y = y;
    it.t = 0; it.life = 0.7; it.active = true;
    it.el.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) scale(0.4)`;
    it.el.style.opacity = '1';
  }
  update(dt) {
    for (const it of this.items) {
      if (!it.active) continue;
      it.t += dt;
      const p = it.t / it.life;
      if (p >= 1) { it.active = false; it.el.style.display = 'none'; continue; }
      const e = 1 - Math.pow(1 - p, 3); // easeOut
      const scale = 0.4 + 0.9 * (p < 0.2 ? p / 0.2 : 1); // pop
      const y = it.y - e * 40;
      it.el.style.transform = `translate(${it.x}px, ${y}px) translate(-50%,-50%) scale(${scale})`;
      it.el.style.opacity = String(1 - Math.max(0, p - 0.6) / 0.4);
    }
  }
  clear() { for (const it of this.items) { it.active = false; it.el.style.display = 'none'; } }
  dispose() { for (const it of this.items) it.el.remove(); }
}
