import { MathUtils, Vector3 } from "three";
import { RNG } from "../core/rng.js";
import { composeWave } from "../data/waves.js";
import { Arena } from "./arena.js";
import { Enemies } from "./enemies.js";
import {
  EV_DEAD,
  EV_HURT,
  EV_IMPACT,
  EV_KILL,
  EV_LAND,
  EV_PICKUP,
  EV_PICKUP_EXPIRE,
  EV_TRACER,
  EV_WAVE_CLEAR,
  EV_WAVE_START,
} from "./events.js";
import { Player } from "./player.js";
import { Projectiles } from "./projectiles.js";
import { RunStats } from "./stats.js";
import { Weapons } from "./weapons.js";

// The whole game simulation. Math only: no DOM, no WebGL, no audio. Advanced
// with step(dt, inputFrame); side effects come out as events for the Game to
// present. Runs identically in the browser and under node.
export class World {
  constructor({ seed = 1, god = !1, noSpawn = !1 } = {}) {
    ((this.seed = seed),
      (this.god = god),
      (this.noSpawn = noSpawn),
      (this.rng = new RNG(seed)),
      (this.arena = new Arena(this.rng.fork("layout"))),
      (this.player = new Player(this.arena)),
      (this.weapons = new Weapons(this.rng.fork("combat"))),
      (this.enemies = new Enemies(this.arena, this.rng.fork("ai"))),
      (this.projectiles = new Projectiles(this.arena)),
      (this.waveRng = this.rng.fork("waves")),
      (this.stats = new RunStats()),
      (this._hurtBy = null),
      (this.events = []),
      (this.time = 0),
      (this.startTime = 0),
      (this.slowmoRequest = 0),
      (this.score = 0),
      (this.kills = 0),
      (this.streak = 0),
      (this.lastKillT = -10),
      (this.wave = 0),
      (this.waveActive = !1),
      (this.breakT = 0),
      (this.queue = []),
      (this.spawnTimer = 0),
      (this.maxAlive = 10),
      (this.spawnInterval = 1),
      (this.pickups = []),
      (this.nextPickupId = 1),
      (this.deadT = 0),
      (this._v = new Vector3()));
  }
  emit(type, data) {
    ((data.type = type), this.stats.record(data, this), this.events.push(data));
  }
  drainEvents() {
    const e = this.events;
    return ((this.events = []), e);
  }
  // Begin (or restart) a run. Re-forks the per-run streams so a replay from
  // the same seed is identical. The layout stream is not reset: the arena is
  // built once.
  startRun() {
    ((this.rng = new RNG(this.seed)),
      (this.weapons.rng = this.rng.fork("combat")),
      (this.enemies.rng = this.rng.fork("ai")),
      (this.waveRng = this.rng.fork("waves")),
      this.player.reset(),
      this.weapons.resetAll(this),
      this.enemies.clear(),
      this.projectiles.clear(),
      (this.pickups.length = 0),
      (this.score = 0),
      (this.kills = 0),
      (this.streak = 0),
      (this.lastKillT = -10),
      (this.queue.length = 0),
      (this.deadT = 0),
      (this.startTime = this.time),
      (this.breakT = 4),
      (this.waveActive = !1),
      (this.wave = 0),
      (this.slowmoRequest = 0),
      (this._hurtBy = null),
      this.stats.reset(),
      this.weapons._ammo(this));
  }
  get elapsed() {
    return this.time - this.startTime;
  }
  step(dt, input) {
    this.time += dt;
    // Systems see run-relative time so a replay started later in the same
    // World (menu → play → die → redeploy) evolves identically.
    const p = this.player,
      t = this.elapsed;
    (p.update(dt, input, t),
      this.weapons.update(dt, input, p, t, this),
      this.enemies.update(dt, p, this),
      this.projectiles.update(dt, p, this),
      p.dead
        ? (this.deadT += dt)
        : (this.updateWaves(dt), this.updatePickups(dt)),
      this.arena.update(dt),
      this.stats.tick(dt, this));
    // Player events are gameplay-relevant too (landing shakes the camera),
    // then forwarded to the presentation layer. They bypass emit(), so the
    // stats recorder is fed here; hurt events are tagged with their source.
    for (const ev of p.events) {
      (ev.type === EV_LAND && p.addTrauma(ev.strength * 0.12),
        ev.type === EV_DEAD && (this.slowmoRequest = 2.5),
        ev.type === EV_HURT && (ev.by = this._hurtBy),
        this.stats.record(ev, this),
        this.events.push(ev));
    }
    p.events.length = 0;
  }
  // Menu/idle: only the ambient systems run so the diorama keeps moving.
  stepIdle(dt) {
    ((this.time += dt),
      this.enemies.update(dt, this.player, this),
      this.projectiles.update(dt, this.player, this),
      this.arena.update(dt));
  }
  fireRay(t, e, n, tracer) {
    const l = this.enemies.raycast(t, e, 240),
      o = this.arena.raycast(t, e, l ? l.t : 240);
    let h;
    if (l && (!o || l.t < o.dist)) {
      const d =
          1 -
          (1 - n.falloffMin) *
            MathUtils.clamp(
              (l.t - n.falloffStart) / (n.falloffEnd - n.falloffStart),
              0,
              1,
            ),
        u = n.damage * d * (l.head ? n.headMult : 1);
      (this.enemies.damage(l, u, e, n, this), (h = l.point));
    } else if (o)
      ((h = o.point),
        this.emit(EV_IMPACT, { point: o.point, normal: o.normal, def: n }));
    else h = t.clone().addScaledVector(e, 240);
    tracer && this.emit(EV_TRACER, { end: h, def: n });
  }
  // n is the attacking enemy, or null for a spitter projectile.
  onPlayerHit(t, e, n) {
    if (this.player.dead) return;
    ((this._hurtBy = n ? n.type : "spit"),
      this.god && (t = 0),
      this.player.damage(t, e),
      n &&
        (this._v.subVectors(this.player.pos, n.pos),
        (this._v.y = 0),
        this._v.normalize(),
        this.player.knock(this._v, n.def.big ? 7 : 2.2)));
  }
  onSlam(t, e, n = 5) {
    (this.player.addTrauma(MathUtils.clamp(1 - e / 14, 0, 0.8)),
      e < n &&
        (this._v.subVectors(this.player.pos, t),
        (this._v.y = 0),
        this._v.normalize(),
        this.player.knock(this._v, 5)));
  }
  onKill(t, e) {
    this.kills++;
    const n = this.elapsed;
    ((this.streak = n - this.lastKillT < 1.8 ? this.streak + 1 : 1),
      (this.lastKillT = n));
    const s = Math.min(4, 1 + (this.streak - 1) * 0.25),
      r = Math.round(t.def.score * s) + (e ? 50 : 0);
    ((this.score += r),
      this.emit(EV_KILL, {
        enemy: t,
        head: e,
        points: r,
        streak: this.streak,
        mult: s,
        groundY: this.arena.groundHeight(t.pos.x, t.pos.z),
      }),
      (t.def.big || this.waveRng.chance(0.13)) && this.spawnPickup(t.pos));
  }
  startWave(t) {
    ((this.wave = t), (this.waveActive = !0));
    const w = composeWave(t, this.waveRng);
    ((this.queue = w.queue),
      (this.maxAlive = w.maxAlive),
      (this.spawnInterval = w.spawnInterval),
      (this.spawnTimer = 1),
      this.emit(EV_WAVE_START, {
        wave: t,
        count: w.count,
        heavy: w.heavy,
        banner: w.banner,
      }));
    for (const a of this.arena.gates) a.activity = 1.2;
  }
  updateWaves(t) {
    if (this.noSpawn) return;
    if (!this.waveActive) {
      ((this.breakT -= t), this.breakT <= 0 && this.startWave(this.wave + 1));
      return;
    }
    this.spawnTimer -= t;
    const e = this.enemies.alive;
    if (this.queue.length && e < this.maxAlive && this.spawnTimer <= 0) {
      const n = 1 + this.waveRng.int(Math.min(3, this.wave));
      for (let s = 0; s < n && this.queue.length; s++) {
        const a = this.waveRng.pick(this.arena.gates);
        (this.enemies.spawn(
          this.queue.pop(),
          a,
          1 + (this.wave - 1) * 0.07,
          this,
        ),
          (a.activity = 1.2));
      }
      this.spawnTimer = this.spawnInterval;
    }
    !this.queue.length && e === 0 && this.waveCleared();
  }
  waveCleared() {
    ((this.waveActive = !1), (this.breakT = 9));
    const t = 250 * this.wave;
    ((this.score += t),
      (this.slowmoRequest = Math.max(this.slowmoRequest, 1.3)));
    for (const e of this.weapons.weapons)
      e.reserve = Math.min(e.def.reserve * 2, e.reserve + e.def.magSize * 2);
    (this.weapons._ammo(this),
      this.emit(EV_WAVE_CLEAR, { wave: this.wave, bonus: t }));
  }
  spawnPickup(t) {
    const n = this.arena.groundHeight(t.x, t.z);
    this.pickups.push({
      id: this.nextPickupId++,
      pos: new Vector3(t.x, n + 0.35, t.z),
      life: 28,
      t: this.waveRng.float() * 6,
      baseY: n + 0.35,
      visible: !0,
    });
  }
  updatePickups(t) {
    const p = this.player;
    for (let e = this.pickups.length - 1; e >= 0; e--) {
      const n = this.pickups[e];
      ((n.t += t),
        (n.life -= t),
        (n.pos.y = n.baseY + Math.sin(n.t * 3) * 0.07),
        (n.visible = n.life > 5 || Math.sin(n.t * 12) > 0));
      const s = Math.hypot(n.pos.x - p.pos.x, n.pos.z - p.pos.z);
      if (
        n.life <= 0 ||
        (s < 1.35 && Math.abs(n.pos.y - p.pos.y) < 2 && !p.dead)
      ) {
        if (n.life > 0) {
          for (const r of this.weapons.weapons)
            r.reserve = Math.min(
              r.def.reserve * 2,
              r.reserve + r.def.magSize * (r === this.weapons.weapon ? 2 : 1),
            );
          (this.weapons._ammo(this),
            this.emit(EV_PICKUP, { pos: n.pos.clone() }));
        } else this.emit(EV_PICKUP_EXPIRE, {});
        this.pickups.splice(e, 1);
      }
    }
  }
  // Order-independent digest of the gameplay state, for determinism tests.
  hash() {
    let h = 2166136261;
    const mix = (x) => {
      // FNV-1a over the float's rounded fixed-point representation.
      const v = Math.round(x * 1e4) | 0;
      for (let i = 0; i < 4; i++) {
        h ^= (v >>> (i * 8)) & 255;
        h = Math.imul(h, 16777619);
      }
    };
    const p = this.player;
    (mix(p.pos.x),
      mix(p.pos.y),
      mix(p.pos.z),
      mix(p.hp),
      mix(this.score),
      mix(this.kills),
      mix(this.wave),
      mix(this.elapsed));
    for (const e of this.enemies.list)
      (mix(e.pos.x), mix(e.pos.z), mix(e.hp), mix(e.yaw));
    for (const w of this.weapons.weapons) (mix(w.mag), mix(w.reserve));
    return (h >>> 0).toString(16).padStart(8, "0");
  }
}
