// ---------------------------------------------------------------------------
// enemies/spawner.js — escalating waves (E5). Deterministic composition from
// the seeded RNG (C3). Breather between waves; banner slam handled by HUD.
// ---------------------------------------------------------------------------

export const TUNING = {
  MAX_ALIVE: 12,
  SPAWN_GAP: 0.75,      // s between individual spawns
  BREATHER: 6.0,        // s between waves
};

export class Spawner {
  constructor(ctx) {
    this.ctx = ctx;
    this.reset();
  }

  reset() {
    this.wave = 0;
    this.queue = [];
    this.spawnT = 0;
    this.breatherT = 0;
    this.state = 'idle'; // idle | spawning | combat | breather
  }

  startFirstWave() {
    if (this.state !== 'idle') return;
    this._nextWave();
  }

  _compose(n) {
    const rng = this.ctx.rng;
    const list = [];
    // heavier from the very first wave: more pressure, faster escalation
    const rushers = Math.min(4 + n, 10);
    const gunners = Math.min(2 + Math.floor(n * 0.8), 7);
    const heavies = Math.min(1 + Math.floor((n - 1) / 2), 4);
    for (let i = 0; i < rushers; i++) list.push('rusher');
    for (let i = 0; i < gunners; i++) list.push('gunner');
    for (let i = 0; i < heavies; i++) list.push('heavy');
    // seeded shuffle
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(rng.next() * (i + 1));
      const t = list[i]; list[i] = list[j]; list[j] = t;
    }
    return list;
  }

  _nextWave() {
    this.wave++;
    this.queue = this._compose(this.wave);
    this.state = 'spawning';
    this.spawnT = 0.4;
    this.ctx.ui.hud.waveBanner(this.wave);
    this.ctx.audio.ui.waveBanner();
  }

  aliveCount() {
    return this.ctx.enemies.list.filter((e) => !e.dead).length;
  }

  update(dt) {
    const ctx = this.ctx;
    switch (this.state) {
      case 'spawning': {
        this.spawnT -= dt;
        if (this.spawnT <= 0 && this.queue.length && this.aliveCount() < TUNING.MAX_ALIVE) {
          this.spawnT = TUNING.SPAWN_GAP;
          const type = this.queue.shift();
          ctx.enemies.spawn(type);
        }
        if (!this.queue.length) this.state = 'combat';
        break;
      }
      case 'combat': {
        if (this.aliveCount() === 0) {
          this.state = 'breather';
          this.breatherT = TUNING.BREATHER;
        }
        break;
      }
      case 'breather': {
        this.breatherT -= dt;
        if (this.breatherT <= 0) this._nextWave();
        break;
      }
    }
  }
}
