import { ENEMIES } from "../data/enemies.js";
import { WEAPONS } from "../data/weapons.js";
import {
  EV_DEAD,
  EV_HIT,
  EV_HURT,
  EV_KILL,
  EV_PICKUP,
  EV_PICKUP_EXPIRE,
  EV_RELOAD_STAGE,
  EV_SHOT,
  EV_SPAWN,
  EV_WAVE_CLEAR,
  EV_WAVE_START,
} from "./events.js";

const weaponRow = () => ({
  shots: 0,
  pellets: 0,
  hits: 0,
  headshots: 0,
  kills: 0,
  damage: 0,
  reloads: 0,
  timeHeldS: 0,
});
const enemyRow = () => ({
  spawned: 0,
  killed: 0,
  damageDealt: 0,
  hitsOnPlayer: 0,
});
const round = (x) => Math.round(x * 1000) / 1000;

// Pure per-run telemetry fed from the World event stream. Deterministic and
// headless, so a replay of the same seed produces the same summary.
export class RunStats {
  constructor() {
    this.reset();
  }
  reset() {
    this.weapons = {};
    for (const w of WEAPONS) this.weapons[w.key] = weaponRow();
    this.enemies = {};
    for (const k in ENEMIES) this.enemies[k] = enemyRow();
    ((this.waves = []),
      (this.pickups = { collected: 0, expired: 0 }),
      (this.lastHurt = null),
      (this.killedBy = null),
      (this.dead = !1),
      (this.elapsed = 0));
  }
  _cur(world) {
    return this.weapons[world.weapons.weapons[world.weapons.current].def.key];
  }
  tick(dt, world) {
    ((this.elapsed = world.elapsed), (this._cur(world).timeHeldS += dt));
  }
  record(ev, world) {
    switch (ev.type) {
      case EV_SHOT: {
        const w = this.weapons[ev.def.key];
        (w.shots++, (w.pellets += ev.def.pellets || 1));
        break;
      }
      case EV_HIT: {
        const w = this._cur(world);
        (w.hits++, ev.head && w.headshots++, (w.damage += ev.damage || 0));
        break;
      }
      case EV_KILL: {
        this._cur(world).kills++;
        const e = this.enemies[ev.enemy.type];
        e && e.killed++;
        break;
      }
      case EV_SPAWN: {
        const e = this.enemies[ev.kind];
        e && e.spawned++;
        break;
      }
      case EV_HURT: {
        const kind = ev.by === "spit" ? "spitter" : ev.by,
          e = this.enemies[kind];
        (e && ((e.damageDealt += ev.amount), e.hitsOnPlayer++),
          (this.lastHurt = {
            kind: ev.by,
            wave: world.wave,
            elapsed: world.elapsed,
          }));
        break;
      }
      case EV_DEAD:
        ((this.dead = !0), (this.killedBy = this.lastHurt));
        break;
      case EV_RELOAD_STAGE:
        ev.stage === "start" && this._cur(world).reloads++;
        break;
      case EV_PICKUP:
        this.pickups.collected++;
        break;
      case EV_PICKUP_EXPIRE:
        this.pickups.expired++;
        break;
      case EV_WAVE_START:
        this.waves.push({
          wave: ev.wave,
          count: ev.count,
          startedAt: world.elapsed,
          clearedAt: null,
          durationS: null,
        });
        break;
      case EV_WAVE_CLEAR: {
        const w = this.waves.find((x) => x.wave === ev.wave);
        w &&
          ((w.clearedAt = world.elapsed),
          (w.durationS = round(w.clearedAt - w.startedAt)));
        break;
      }
    }
  }
  summary() {
    let pellets = 0,
      hits = 0,
      heads = 0,
      dealt = 0,
      taken = 0;
    const weapons = {};
    for (const k in this.weapons) {
      const w = this.weapons[k];
      ((weapons[k] = {
        ...w,
        timeHeldS: round(w.timeHeldS),
        damage: round(w.damage),
      }),
        (pellets += w.pellets),
        (hits += w.hits),
        (heads += w.headshots),
        (dealt += w.damage));
    }
    for (const k in this.enemies) taken += this.enemies[k].damageDealt;
    return {
      elapsed: round(this.elapsed),
      result: this.dead ? "dead" : "alive",
      killedBy: this.killedBy ? { ...this.killedBy } : null,
      weapons,
      enemies: JSON.parse(JSON.stringify(this.enemies)),
      waves: this.waves.map((w) => ({ ...w })),
      pickups: { ...this.pickups },
      damageDealt: round(dealt),
      damageTaken: round(taken),
      accuracy: pellets ? round(hits / pellets) : 0,
      headshotRate: hits ? round(heads / hits) : 0,
    };
  }
}
