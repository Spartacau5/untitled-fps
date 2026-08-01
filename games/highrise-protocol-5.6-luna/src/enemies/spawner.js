import * as THREE from "three";
import { Enemy } from "./enemy.js?v=20260802-1";
import { EnemyAI } from "./ai.js?v=20260801-2";

export const TUNING = {
  initialBreather: 1.2, // seconds
  waveBreather: 3.2, // seconds
  baseCount: 4, // enemies
  addedPerWave: 2, // enemies
  maxActive: 18, // enemies
};

export class EnemySpawner {
  constructor(scene, collision, rng, callbacks) {
    this.scene = scene;
    this.collision = collision;
    this.rng = rng;
    this.callbacks = callbacks;
    this.ai = new EnemyAI();
    this.enemies = [];
    this.wave = 0;
    this.score = 0;
    this.breather = TUNING.initialBreather;
    this.waveStarting = true;
    this.lastWaveClear = false;
    this.cloneEnemyVisual = callbacks.cloneEnemyVisual || null;
    this.enemyAnimations = callbacks.enemyAnimations || [];
  }

  update(dt, context) {
    if (this.waveStarting) {
      this.breather -= dt;
      if (this.breather <= 0) {
        this.waveStarting = false;
        this.startWave();
      }
    }
    for (let i = this.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.enemies[i];
      enemy.update(dt, this.ai, context);
      if (enemy.dead) {
        enemy.dispose();
        this.enemies.splice(i, 1);
      }
    }
    if (!this.waveStarting && this.enemies.length === 0) {
      this.waveStarting = true;
      this.breather = TUNING.waveBreather;
      this.callbacks.onBreather?.(this.wave + 1);
    }
  }

  startWave() {
    this.wave += 1;
    const count = Math.min(TUNING.maxActive, TUNING.baseCount + (this.wave - 1) * TUNING.addedPerWave);
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + this.rng.range(-0.24, 0.24);
      const radius = this.rng.range(11, 20);
      const position = new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      const typeRoll = this.rng.next();
      const type = this.wave >= 2 && typeRoll > 0.78 ? "heavy" : (typeRoll > 0.48 ? "gunner" : "rusher");
      const enemy = new Enemy(type, position, this.rng.next(), {
        onDeath: (deadEnemy, result) => this.callbacks.onDeath?.(deadEnemy, result),
        onPlateBreak: (heavy, plate) => this.callbacks.onPlateBreak?.(heavy, plate),
        visualAsset: this.cloneEnemyVisual?.() || null,
        visualAnimations: this.enemyAnimations,
      });
      this.enemies.push(enemy);
      this.scene.add(enemy.group);
    }
    this.callbacks.onWave?.(this.wave, count);
  }

  getRaycastables() {
    const result = [];
    for (const enemy of this.enemies) result.push(...enemy.hitboxes);
    return result;
  }

  fillRaycastables(target) {
    for (const enemy of this.enemies) for (const hitbox of enemy.hitboxes) target.push(hitbox);
  }

  reset() {
    for (const enemy of this.enemies) enemy.dispose();
    this.enemies.length = 0;
    this.wave = 0;
    this.breather = TUNING.initialBreather;
    this.waveStarting = true;
  }

  findEnemyFromHit(object) { return object?.userData?.enemy || null; }
  setEnemyAsset(cloneEnemyVisual, animations = []) {
    this.cloneEnemyVisual = cloneEnemyVisual;
    this.enemyAnimations = animations;
    for (const enemy of this.enemies) enemy.attachVisualAsset(this.cloneEnemyVisual?.(), this.enemyAnimations);
  }
  get activeCount() { return this.enemies.length; }
}
