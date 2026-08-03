// ---------------------------------------------------------------------------
// enemies/ai.js — behavior loop (E2): spawn -> advance using cover -> peek /
// fire with reaction delay -> push when the player reloads or is low HP ->
// flank when the player camps. Rushers chase and lunge; Heaves plod forward.
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { clamp } from '../core/spring.js';

const _dir = new THREE.Vector3();
const _eye = new THREE.Vector3();
const _pEye = new THREE.Vector3();
const _tmp = new THREE.Vector3();

export class AI {
  constructor(ctx) {
    this.ctx = ctx;
    this._campT = 0;
    this._campPos = new THREE.Vector3();
    this._campDist = 0;
    this._flanker = null;
  }

  reset() { this._campT = 0; this._campDist = 0; this._flanker = null; }

  losClear(from, to) {
    _dir.subVectors(to, from);
    const dist = _dir.length();
    if (dist < 0.5) return true;
    _dir.divideScalar(dist);
    const hit = this.ctx.collision.raycast(from, _dir, dist);
    return !hit || hit.dist > dist - 0.4;
  }

  update(dt, enemies) {
    const ctx = this.ctx;
    const player = ctx.controller;
    _pEye.set(player.pos.x, player.pos.y + player.eye, player.pos.z);

    // --- camp detection (E2 flank) -------------------------------------------
    this._campT += dt;
    if (this._campT > 0.5) {
      this._campT = 0;
      const d = this._campPos.distanceTo(player.pos);
      this._campDist = this._campDist * 0.82 + d * 0.18;
      this._campPos.copy(player.pos);
      if (this._campDist < 0.55 && !this._flanker) {
        // player has barely moved: send one enemy wide
        const candidates = enemies.filter((e) => !e.dead && e.type !== 'heavy');
        if (candidates.length) {
          this._flanker = candidates[candidates.length - 1];
          this._flanker.flanking = true;
          const side = ctx.rng.chance(0.5) ? 1 : -1;
          this._flanker.flankPoint = this._flankTarget(_pEye, side);
        }
      }
      if (this._campDist > 2.5 && this._flanker) {
        this._flanker.flanking = false; this._flanker = null;
      }
    }

    const playerWeak = ctx.reload.locking || ctx.hp < 35; // E2: push on reload/low

    for (const e of enemies) {
      if (e.dead) continue;
      e.stateT += dt;
      e._moving = false;
      e._speedNow = 0;
      switch (e.type) {
        case 'rusher': this._rusher(dt, e, _pEye, playerWeak); break;
        case 'gunner': this._gunner(dt, e, _pEye, playerWeak); break;
        case 'heavy': this._heavy(dt, e, _pEye); break;
      }
      e.meleeCd = Math.max(0, e.meleeCd - dt);
    }
    // separation: enemies never stack
    for (let i = 0; i < enemies.length; i++) {
      const a = enemies[i];
      if (a.dead) continue;
      for (let j = i + 1; j < enemies.length; j++) {
        const b = enemies[j];
        if (b.dead) continue;
        const minD = a.cfg.radius + b.cfg.radius + 0.15;
        _tmp.subVectors(a.pos, b.pos);
        const d = Math.hypot(_tmp.x, _tmp.z);
        if (d < minD && d > 1e-4) {
          const push = (minD - d) / d * 0.5;
          a.pos.x += _tmp.x * push; a.pos.z += _tmp.z * push;
          b.pos.x -= _tmp.x * push; b.pos.z -= _tmp.z * push;
        }
      }
    }
  }

  _flankTarget(playerPos, side) {
    const ctx = this.ctx;
    const ang = Math.atan2(-playerPos.x, -playerPos.z) + side * 1.2;
    return {
      x: playerPos.x + Math.sin(ang) * 9 * -1,
      z: playerPos.z + Math.cos(ang) * 9 * -1,
    };
  }

  _moveTo(e, tx, tz, dt, speed) {
    const dx = tx - e.pos.x, dz = tz - e.pos.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.12) return true;
    const s = Math.min(speed, d / dt);
    e.pos.x += (dx / d) * s * dt;
    e.pos.z += (dz / d) * s * dt;
    this.ctx.collision.pushOut(e.pos, e.cfg.radius, 1.5 * e.cfg.scale);
    e._yawTarget = Math.atan2(-dx, -dz);
    e._moving = true;
    e._speedNow = s;
    return false;
  }

  _playerDist(e, pEye) {
    return Math.hypot(pEye.x - e.pos.x, pEye.z - e.pos.z);
  }

  _rusher(dt, e, pEye, playerWeak) {
    const ctx = this.ctx;
    const d = this._playerDist(e, pEye);
    if (e.state === 'spawn' && e.stateT > 0.45) { e.state = 'chase'; e.stateT = 0; }
    if (e.state === 'chase') {
      const speed = e.cfg.speed * (playerWeak ? 1.25 : 1);
      this._moveTo(e, pEye.x, pEye.z, dt, speed);
      if (d < 1.9 && e.meleeCd <= 0) { e.state = 'windup'; e.stateT = 0; }
    } else if (e.state === 'windup') {
      e._yawTarget = Math.atan2(-(pEye.x - e.pos.x), -(pEye.z - e.pos.z));
      if (e.stateT > 0.24) {
        e.state = 'lunge'; e.stateT = 0;
        if (d < 2.6) {
          ctx.playerDamage(14, _dir.set(pEye.x - e.pos.x, 0, pEye.z - e.pos.z).normalize(), e.pos);
          ctx.audio.ui.playerHurt();
        }
        e.meleeCd = 1.15;
      }
    } else if (e.state === 'lunge' && e.stateT > 0.3) {
      e.state = 'chase';
    }
  }

  _gunner(dt, e, pEye, playerWeak) {
    const ctx = this.ctx;
    const d = this._playerDist(e, pEye);
    _eye.set(e.pos.x, e.pos.y + e.eyeHeight, e.pos.z);

    if (e.state === 'spawn' && e.stateT > 0.45) {
      e.state = 'advance'; e.stateT = 0;
      e.cover = ctx.level.claimCover(e.pos, pEye, e);
    }

    if (e.flanking && e.flankPoint) {
      if (this._moveTo(e, e.flankPoint.x, e.flankPoint.z, dt, e.cfg.speed)) {
        e.flanking = false; e.pushing = true;
      }
      return;
    }

    switch (e.state) {
      case 'advance': {
        const target = e.cover ? e.cover.stand : { x: pEye.x, z: pEye.z };
        if (this._moveTo(e, target.x, target.z, dt, e.cfg.speed)) {
          e.state = 'settle'; e.stateT = 0;
        }
        break;
      }
      case 'settle': {
        // E2: push when the player reloads or is low
        if (playerWeak && d > 5) { e.state = 'advance'; e.cover = null; e.pushing = true; break; }
        if (e.pushing) {
          if (d > 8) { this._moveTo(e, pEye.x, pEye.z, dt, e.cfg.speed); break; }
          e.state = 'peek'; e.stateT = 0; e.reactionT = ctx.rng.range(0.2, 0.45);
          break;
        }
        if (e.stateT > ctx.rng.range(0.5, 1.2)) { e.state = 'peek'; e.stateT = 0; e.reactionT = ctx.rng.range(0.25, 0.6); }
        break;
      }
      case 'peek': {
        e._yawTarget = Math.atan2(-(pEye.x - e.pos.x), -(pEye.z - e.pos.z));
        e.reactionT -= dt;
        if (e.reactionT <= 0 && this.losClear(_eye, _pEye)) {
          e.state = 'fire'; e.stateT = 0;
          e.burstLeft = ctx.rng.int(3, 5); e.shotT = 0;
        } else if (e.stateT > 1.8) { e.state = 'settle'; e.stateT = 0; }
        break;
      }
      case 'fire': {
        e._yawTarget = Math.atan2(-(pEye.x - e.pos.x), -(pEye.z - e.pos.z));
        e.shotT -= dt;
        if (e.shotT <= 0 && e.burstLeft > 0) {
          e.shotT = 0.15;
          e.burstLeft--;
          this._enemyShot(e, d, _eye, _pEye);
        }
        if (e.burstLeft <= 0) { e.state = 'settle'; e.stateT = 0; }
        break;
      }
    }
  }

  _heavy(dt, e, pEye) {
    const ctx = this.ctx;
    const d = this._playerDist(e, pEye);
    _eye.set(e.pos.x, e.pos.y + e.eyeHeight, e.pos.z);
    if (e.state === 'spawn' && e.stateT > 0.45) { e.state = 'advance'; e.stateT = 0; }
    if (e.state === 'advance') {
      if (d > 7.5) this._moveTo(e, pEye.x, pEye.z, dt, e.cfg.speed);
      else { e.state = 'fire'; e.stateT = 0; e.burstLeft = 0; e.shotT = 0.6; }
    } else if (e.state === 'fire') {
      e._yawTarget = Math.atan2(-(pEye.x - e.pos.x), -(pEye.z - e.pos.z));
      e.shotT -= dt;
      if (e.shotT <= 0) {
        e.shotT = 0.55;
        this._enemyShot(e, d, _eye, _pEye, 0.34); // heavy is slow but steady
      }
      if (d > 10) { e.state = 'advance'; }
    }
  }

  // One enemy projectile attempt: accuracy vs distance + player speed.
  _enemyShot(e, dist, eye, pEye, accBonus = 0) {
    const ctx = this.ctx;
    ctx.fx.muzzle.flash(e.gunTipWorld(_tmp), null, 1, true);
    ctx.audio.guns.enemyShot(dist);
    const movePenalty = clamp(ctx.controller.speedH / 12, 0, 0.3);
    const acc = clamp(0.62 - dist * 0.022 - movePenalty + accBonus, 0.08, 0.85);
    if (ctx.rng.next() < acc) {
      const dmg = e.type === 'heavy' ? 11 : 7;
      _dir.subVectors(pEye, eye).normalize();
      ctx.playerDamage(dmg, _dir, e.pos);
      ctx.audio.ui.playerHurt();
    }
  }
}
