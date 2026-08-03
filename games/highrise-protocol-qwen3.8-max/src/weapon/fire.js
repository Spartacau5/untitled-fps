// ---------------------------------------------------------------------------
// weapon/fire.js — full-auto raycast fire. Accumulator-timed (F1), never
// frame-locked. Bullets always leave from camera center along forward with
// the current spread cone, so dot, ray and decal always agree (A3).
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { clamp } from '../core/spring.js';

export const TUNING = {
  RPM: 700,               // F1
  MAG_SIZE: 30,
  RESERVE: 270,           // generous
  DMG_BODY: 34,
  DMG_LIMB: 26,
  DMG_HEAD: 150,          // headshot one-shots light targets (E3)
  SPREAD_HIP: 0.036,      // rad (~2 deg)
  SPREAD_ADS: 0.0055,     // tight
  SPREAD_CROUCH_MULT: 0.7,// crouch tightest (M3/F2)
  SPREAD_MOVE: 0.02,      // extra while moving
  SPREAD_BLOOM: 0.011,    // per recoil bloom unit
  RANGE: 300,
  RELOAD_AUTO: true,      // empty mag auto-starts reload
};

const _dir = new THREE.Vector3();
const _right = new THREE.Vector3();
const _up = new THREE.Vector3();
const _origin = new THREE.Vector3();

export class Fire {
  constructor(raycaster) {
    this.raycaster = raycaster;
    this.mag = TUNING.MAG_SIZE;
    this.reserve = TUNING.RESERVE;
    this.acc = 0;
    this.firing = false;
  }

  reset() { this.mag = TUNING.MAG_SIZE; this.reserve = TUNING.RESERVE; this.acc = 0; this.firing = false; }

  currentSpread(ctx) {
    const T = TUNING;
    const ads = ctx.ads.value;
    let s = T.SPREAD_HIP + (T.SPREAD_ADS - T.SPREAD_HIP) * ads;
    s *= 1 - (1 - T.SPREAD_CROUCH_MULT) * ctx.controller.crouchAmt.value;
    s += T.SPREAD_MOVE * clamp(ctx.controller.speedH / 6.3, 0, 1) * (1 - ads * 0.6);
    s += T.SPREAD_BLOOM * ctx.recoil.spreadBloom();
    return s;
  }

  update(dt, input, ctx) {
    const T = TUNING;
    const wantsFire = input.fireHeld && input.locked && !input.dead;
    this.firing = false;
    if (ctx.reload.locking) { this.acc = 0; return; }       // R3: locked during reload

    if (!wantsFire || this.mag <= 0) { this.acc = 0; return; }

    const interval = 60 / T.RPM;                            // F1: accumulator
    this.acc += dt;
    let guard = 0;
    while (this.acc >= interval && this.mag > 0 && guard++ < 4) {
      this.acc -= interval;
      this._shoot(ctx);
    }
    if (this.mag <= 0 && T.RELOAD_AUTO && this.reserve > 0) {
      ctx.reload.start(false, 0);
      ctx.ui.hud.flashAmmo();
    }
  }

  _shoot(ctx) {
    const T = TUNING;
    this.mag--;
    this.firing = true;

    // spread cone around camera forward (A3)
    const spread = this.currentSpread(ctx);
    ctx.cameraRig.forward(_dir);
    _right.set(1, 0, 0).applyQuaternion(ctx.cameraRig.camera.quaternion);
    _up.set(0, 1, 0).applyQuaternion(ctx.cameraRig.camera.quaternion);
    const r = spread * Math.sqrt(ctx.rng.next());
    const th = ctx.rng.next() * Math.PI * 2;
    _dir.addScaledVector(_right, Math.cos(th) * r).addScaledVector(_up, Math.sin(th) * r).normalize();
    ctx.cameraRig.worldPos(_origin);

    // raycast: enemies + world solids in one query
    this.raycaster.set(_origin, _dir);
    this.raycaster.far = T.RANGE;
    const hits = this.raycaster.intersectObjects(ctx.targets.solidList, false);
    const hit = hits.length ? hits[0] : null;

    ctx.viewmodel.getMuzzleWorld(ctx.tmpMuzzle);
    const endPoint = hit ? hit.point : _origin.clone().addScaledVector(_dir, T.RANGE);

    if (hit) {
      const ud = hit.object.userData;
      if (ud.enemy) {
        const dmg = ud.part === 'head' ? T.DMG_HEAD : (ud.part === 'limb' ? T.DMG_LIMB : T.DMG_BODY);
        const res = ud.enemy.hit(ud.part, dmg, _dir, hit.point, ctx, ud.plate);
        ctx.fx.impacts.blood(hit.point);
        ctx.ui.hitmarker.show(res.died ? 'kill' : 'hit', res.headshot);
        ctx.ui.hud.damageNumber(hit.point, dmg, res.headshot);
        ctx.audio.guns.hit(res.died, res.headshot);
        if (res.died) {
          ctx.time.hitStop();                             // F4: 2-3 frames at ~0.1x
          ctx.enemies.kill(ud.enemy, hit.point, _dir);    // ragdoll + deregister
          ctx.ui.hud.killFeed(ud.enemy, res.headshot);
        }
        ctx.ui.hud.addScore(res.score);
      } else {
        ctx.fx.impacts.spawn(hit, ud.surface || 'concrete', _dir);
      }
    }

    ctx.fx.muzzle.flash(ctx.tmpMuzzle, endPoint);
    ctx.fx.particles.smoke(ctx.tmpMuzzle, _dir, ctx.rng); // F5 powder wisps
    ctx.fx.shells.eject(ctx);
    ctx.recoil.fire(ctx.ads.value, ctx.controller.crouchAmt.value, ctx.rng);
    ctx.shake.add(0.05);                                    // F7 micro shake
    ctx.audio.guns.playerShot();
    ctx.ui.hud.ammoPunch();
    ctx.ui.crosshair.fireImpulse();
  }
}
