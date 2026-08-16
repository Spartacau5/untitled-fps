import * as THREE from 'three';
import { CFG } from '../core/Config.js';
import { rng } from '../core/PRNG.js';
import { Enemy } from './Enemy.js';

// E2/D1: wave spawning, enemy fire, ragdoll capping, "they heard you reload".
export class EnemyManager {
  constructor(scene, env, raycaster) {
    this.scene = scene;
    this.env = env;
    this.raycaster = raycaster;
    this.enemies = [];
    this.active = [];      // alive & not ragdoll
    this.ragdolls = [];    // dead bodies
    this._spawnQueue = [];
    this._spawnTimer = 0;
    this.lastKill = null;
    this.lastKillT = -10;
  }

  reset() {
    for (const e of this.enemies) e.dispose();
    this.enemies = []; this.active = []; this.ragdolls = [];
    this._spawnQueue = []; this.lastKill = null;
  }

  // D1: spawn a wave of enemies around the perimeter.
  spawnWave(waveNum) {
    const w = CFG.waves;
    const count = Math.min(w.maxEnemies, Math.round(w.firstWave + (waveNum - 1) * w.growth));
    for (let i = 0; i < count; i++) {
      // deterministic perimeter placement
      const ang = (i / count) * Math.PI * 2 + rng.range(-0.3, 0.3);
      const rad = rng.range(22, 32);
      const pos = new THREE.Vector3(Math.cos(ang) * rad, 0, Math.sin(ang) * rad);
      // pick type by wave
      let type = 'rusher';
      const r = rng.next();
      if (waveNum >= 2 && r > 0.7) type = 'gunner';
      if (waveNum >= 3 && r > 0.85) type = 'heavy';
      if (waveNum === 1 && r > 0.85) type = 'gunner';
      this._spawnQueue.push({ type, pos });
    }
    // trickle in over time
    this._spawnTimer = 0;
  }

  get activeCount() { return this.active.length + this._spawnQueue.length; }

  update(dt, player, fx) {
    const pPos = new THREE.Vector3(player.pos.x, 1.2, player.pos.z);
    const playerVulnerable = (fx && fx.playerVulnerable) || false;
    const playerCamped = (fx && fx.playerCamped) || false;

    // spawn from queue (trickle)
    if (this._spawnQueue.length > 0) {
      this._spawnTimer -= dt;
      if (this._spawnTimer <= 0 && this.active.length < CFG.waves.maxEnemies) {
        this._spawnTimer = CFG.waves.spawnInterval;
        const s = this._spawnQueue.shift();
        const e = new Enemy(this.scene, s.type, s.pos);
        e.onFire = (from, to) => this._enemyFire(e, from, to, player, fx);
        this.enemies.push(e);
        this.active.push(e);
      }
    }

    // update alive
    for (const e of this.active) {
      e.update(dt, pPos, playerVulnerable, this.env, playerCamped);
      // E1: rusher melee
      if (e.type === 'rusher' && e.alive) {
        const d = e.pos.distanceTo(new THREE.Vector3(player.pos.x, 0, player.pos.z));
        if (d < e.stat.range) {
          e._meleeCd = (e._meleeCd || 0) - dt;
          if (e._meleeCd <= 0) {
            e._meleeCd = 1.0;
            e.lunge = 0.3;
            const dir = new THREE.Vector3(player.pos.x - e.pos.x, 0, player.pos.z - e.pos.z).normalize();
            if (fx && fx.damagePlayer) fx.damagePlayer(e.stat.damage, dir);
          }
        }
      }
    }

    // handle deaths → move to ragdolls, cap
    for (let i = this.active.length - 1; i >= 0; i--) {
      const e = this.active[i];
      if (e.dead) {
        this.active.splice(i, 1);
        this.ragdolls.push(e);
        this.lastKill = e;
        this.lastKillT = 0;
        // H6: blood pool under body
        if (fx && fx.bloodPool) fx.bloodPool(e.pos.clone().setY(0.01), new THREE.Vector3(0, 1, 0));
        // cap ragdolls (H5): replace oldest
        if (this.ragdolls.length > CFG.perf.maxRagdolls) {
          const old = this.ragdolls.shift();
          old.dispose();
          this.enemies = this.enemies.filter(x => x !== old);
        }
      }
    }
    // update ragdolls, remove destroyed
    for (let i = this.ragdolls.length - 1; i >= 0; i--) {
      const e = this.ragdolls[i];
      e.update(dt, pPos, playerVulnerable, this.env, playerCamped);
      if (e.destroyed) {
        e.dispose();
        this.ragdolls.splice(i, 1);
        this.enemies = this.enemies.filter(x => x !== e);
      }
    }
    this.lastKillT += dt;

    // expose for weapon raycast
    this.enemiesForRaycast = this.active;
    return this;
  }

  // E2: enemy hitscan at player with inaccuracy.
  _enemyFire(enemy, from, to, player, fx) {
    if (fx && fx.enemyReport) fx.enemyReport(from, to);
    // inaccuracy
    const spread = 0.12;
    const dir = to.clone().sub(from.clone().setY(1.3));
    dir.normalize();
    // add random offset
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(dir, up).normalize();
    const off = (rng.next() - 0.5) * spread + (rng.next() - 0.5) * spread * 0.5;
    dir.addScaledVector(right, off).normalize();
    const origin = from.clone().setY(1.3);
    const ray = this.raycaster;
    ray.set(origin, dir);
    ray.far = 120;
    // blocked by world?
    const hits = ray.intersectObjects(this.env.getRaycastTargets(), false);
    const playerDist = origin.distanceTo(new THREE.Vector3(player.pos.x, 1.2, player.pos.z));
    let blocked = hits.length > 0 && hits[0].distance < playerDist;
    if (!blocked) {
      // check if close to player (hit) — within 0.5
      const end = origin.clone().addScaledVector(dir, playerDist);
      const pd = end.distanceTo(new THREE.Vector3(player.pos.x, 1.2, player.pos.z));
      if (pd < 0.6) {
        const dmg = enemy.stat.damage;
        if (fx && fx.damagePlayer) fx.damagePlayer(dmg, dir);
        return;
      }
    }
    // near miss
    if (fx && fx.nearMiss) fx.nearMiss();
  }

}
