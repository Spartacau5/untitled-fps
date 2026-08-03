// ---------------------------------------------------------------------------
// fx/muzzle.js — muzzle flash sprites + one pooled dynamic light (P3) +
// faint tracers (F5). Light visibly licks the nearest pillar for 1-2 frames.
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Pool } from '../core/pool.js';
import { damp } from '../core/spring.js';

const FLASH_LIFE = 0.045;   // ~2-3 frames
const TRACER_LIFE = 0.065;

function flashTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 62);
  grad.addColorStop(0, 'rgba(255,245,210,1)');
  grad.addColorStop(0.22, 'rgba(255,190,90,0.9)');
  grad.addColorStop(0.55, 'rgba(255,120,30,0.28)');
  grad.addColorStop(1, 'rgba(255,80,10,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  // spikes
  g.globalCompositeOperation = 'lighter';
  g.translate(64, 64);
  for (let i = 0; i < 4; i++) {
    g.rotate(Math.PI / 4 + (i * Math.PI) / 2);
    const lg = g.createLinearGradient(0, 0, 58, 0);
    lg.addColorStop(0, 'rgba(255,230,160,0.85)');
    lg.addColorStop(1, 'rgba(255,150,40,0)');
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(0, -3.5); g.lineTo(58, 0); g.lineTo(0, 3.5);
    g.closePath(); g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Muzzle {
  constructor(scene) {
    this._tex = flashTexture();
    this.light = new THREE.PointLight(0xffc26b, 0, 10, 1.8);
    scene.add(this.light);
    this._lightT = 0;

    this.flashes = new Pool(() => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({
        map: this._tex, transparent: true, blending: THREE.AdditiveBlending,
        depthWrite: false, opacity: 0,
      }));
      s.visible = false;
      scene.add(s);
      return { sprite: s, life: 0 };
    }, 5);

    this.tracers = new Pool(() => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.0055, 0.0055, 1),
        new THREE.MeshBasicMaterial({
          color: 0xffd9a0, transparent: true, opacity: 0,
          blending: THREE.AdditiveBlending, depthWrite: false,
        })
      );
      m.visible = false;
      scene.add(m);
      return { mesh: m, life: 0 };
    }, 14);
    this._dir = new THREE.Vector3();
    this._z = new THREE.Vector3(0, 0, 1);
  }

  flash(pos, endPoint, scale = 1, enemy = false) {
    const f = this.flashes.acquire();
    f.life = FLASH_LIFE;
    f.sprite.visible = true;
    f.sprite.position.copy(pos);
    f.sprite.material.rotation = Math.random() * Math.PI * 2;
    f.sprite.scale.setScalar((enemy ? 0.5 : 0.62 + Math.random() * 0.25) * scale);
    f.sprite.material.opacity = enemy ? 0.8 : 1;

    if (!enemy) {
      this.light.position.copy(pos);
      this.light.intensity = 9;
      this._lightT = 0.03;
    }
    // tracer
    if (endPoint) {
      const tr = this.tracers.acquire();
      const mesh = tr.mesh;
      tr.life = TRACER_LIFE;
      mesh.visible = true;
      this._dir.subVectors(endPoint, pos);
      const len = this._dir.length();
      if (len > 0.5) {
        this._dir.normalize();
        mesh.position.copy(pos).addScaledVector(this._dir, len * 0.5);
        mesh.scale.set(1, 1, len);
        mesh.quaternion.setFromUnitVectors(this._z, this._dir);
        mesh.material.opacity = enemy ? 0.16 : 0.22;
      }
    }
  }

  update(dt) {
    this._lightT -= dt;
    if (this._lightT <= 0) this.light.intensity = damp(this.light.intensity, 0, 55, dt);
    this.flashes.forEach((f) => {
      f.life -= dt;
      if (f.life <= 0) { f.sprite.visible = false; this.flashes.release(f); }
    });
    this.tracers.forEach((tr) => {
      tr.life -= dt;
      tr.mesh.material.opacity = Math.max(tr.life / TRACER_LIFE, 0) * 0.22;
      if (tr.life <= 0) { tr.mesh.visible = false; this.tracers.release(tr); }
    });
  }

  reset() {
    this.flashes.forEach((f) => { f.sprite.visible = false; });
    this.tracers.forEach((t) => { t.mesh.visible = false; });
    this.flashes.releaseAll();
    this.tracers.releaseAll();
    this.light.intensity = 0;
  }
}
