// ---------------------------------------------------------------------------
// fx/shells.js — physically simulated shell ejection + reload mag ejection
// (F5, R2). Brass tumbles, bounces off concrete with metallic tinkles,
// then fades. Pooled with a hard cap.
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Pool } from '../core/pool.js';

const TUNING = {
  CAP: 26,
  MAG_CAP: 4,
  GRAVITY: 16.5,
  RESTITUTION: 0.42,
  FRICTION: 0.72,
  LIFE: 7.0,
  FADE: 1.2,
  TINK_SPEED: 1.4,     // min impact speed for a sound
};

export class Shells {
  constructor(scene) {
    const brassMat = () => new THREE.MeshStandardMaterial({
      color: 0xc9a24f, metalness: 0.9, roughness: 0.35, transparent: true,
    });
    this.pool = new Pool(() => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.0085, 0.021, 0.0085), brassMat());
      mesh.castShadow = false;
      mesh.visible = false;
      scene.add(mesh);
      return { mesh, pos: new THREE.Vector3(), vel: new THREE.Vector3(),
        ang: new THREE.Vector3(), life: 0, bounced: false };
    }, TUNING.CAP);

    this.magPool = new Pool(() => {
      const g = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.155, 0.062),
        new THREE.MeshStandardMaterial({ color: 0x2c3038, metalness: 0.7, roughness: 0.45, transparent: true }));
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.03, 0.064),
        new THREE.MeshStandardMaterial({ color: 0x17191d, metalness: 0.6, roughness: 0.55, transparent: true }));
      base.position.y = -0.08;
      g.add(body, base);
      g.visible = false;
      scene.add(g);
      return { mesh: g, pos: new THREE.Vector3(), vel: new THREE.Vector3(),
        ang: new THREE.Vector3(), life: 0, bounced: false };
    }, TUNING.MAG_CAP);

    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._fwd = new THREE.Vector3();
    this._cam = null;
    this._audio = null;
    this._rng = null;
    this._playerPos = null;
  }

  bind({ camera, audio, rng, playerPos }) {
    this._cam = camera; this._audio = audio; this._rng = rng; this._playerPos = playerPos;
  }

  eject(ctx) {
    const s = this.pool.acquire();
    ctx.viewmodel.getPortWorld(s.pos);
    const rng = this._rng;
    this._camBasis();
    s.vel.copy(this._right).multiplyScalar(1.5 + rng.next() * 0.9)
      .addScaledVector(this._up, 1.1 + rng.next() * 0.7)
      .addScaledVector(this._fwd, -0.2 + rng.next() * 0.25);
    s.ang.set(rng.range(-14, 14), rng.range(-14, 14), rng.range(-14, 14));
    s.life = 0; s.bounced = false;
    s.mesh.visible = true;
    s.mesh.material.opacity = 1;
  }

  ejectMag(worldPos, bigSpin) {
    const m = this.magPool.acquire();
    m.pos.copy(worldPos);
    const rng = this._rng;
    this._camBasis();
    m.vel.copy(this._right).multiplyScalar(-(0.9 + rng.next() * 0.5))   // flies off left (R2.1)
      .addScaledVector(this._up, 0.7 + rng.next() * 0.5)
      .addScaledVector(this._fwd, -0.4);
    m.ang.set(rng.range(-9, 9) * (bigSpin ? 1.4 : 1), rng.range(-9, 9), rng.range(-9, 9));
    m.life = 0; m.bounced = false;
    m.mesh.visible = true;
    for (const c of m.mesh.children) c.material.opacity = 1;
  }

  _camBasis() {
    this._right.set(1, 0, 0).applyQuaternion(this._cam.quaternion);
    this._up.set(0, 1, 0).applyQuaternion(this._cam.quaternion);
    this._fwd.set(0, 0, -1).applyQuaternion(this._cam.quaternion);
  }

  _integrate(o, dt, scale) {
    const T = TUNING;
    o.life += dt;
    o.vel.y -= T.GRAVITY * dt;
    o.pos.addScaledVector(o.vel, dt);
    const ground = 0.01 * scale;
    if (o.pos.y < ground) {
      o.pos.y = ground;
      if (o.vel.y < 0) {
        const impact = -o.vel.y;
        o.vel.y *= -T.RESTITUTION;
        o.vel.x *= T.FRICTION; o.vel.z *= T.FRICTION;
        o.ang.multiplyScalar(0.6);
        if (!o.bounced && impact > T.TINK_SPEED && this._audio) {
          o.bounced = true;
          const d = o.pos.distanceTo(this._playerPos);
          if (scale > 2) this._audio.reloadFns.magClatter(d);
          else if (this._rng.chance(0.7)) this._audio.reloadFns.shellTink(d);
        }
      }
    }
    o.mesh.position.copy(o.pos);
    o.mesh.rotation.x += o.ang.x * dt;
    o.mesh.rotation.y += o.ang.y * dt;
    o.mesh.rotation.z += o.ang.z * dt;
    // fade at end of life
    const fade = 1 - Math.max(0, (o.life - (T.LIFE - T.FADE)) / T.FADE);
    if (fade < 1) {
      if (scale > 2) for (const c of o.mesh.children) c.material.opacity = fade;
      else o.mesh.material.opacity = fade;
    }
    if (o.life >= T.LIFE) {
      o.mesh.visible = false;
      return true;
    }
    return false;
  }

  update(dt) {
    this.pool.forEach((s) => { if (this._integrate(s, dt, 1)) this.pool.release(s); });
    this.magPool.forEach((m) => { if (this._integrate(m, dt, 6)) this.magPool.release(m); });
  }

  reset() {
    this.pool.forEach((s) => { s.mesh.visible = false; });
    this.magPool.forEach((m) => { m.mesh.visible = false; });
    this.pool.releaseAll();
    this.magPool.releaseAll();
  }

  stats() { return { shells: this.pool.active.length, mags: this.magPool.active.length }; }
}
