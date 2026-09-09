import { MathUtils, Vector3 } from "three";
import { ARENA_RADIUS } from "../data/tuning.js";
import { EV_EXPLOSION, EV_PROJECTILE_HIT, EV_SPIT } from "./events.js";

export const MAX_PROJECTILES = 64;

// Enemy projectiles. Pure: a fixed pool of records; the view instances them.
//
// Three kinds share one pool because they share almost everything - travel,
// the player capsule test, the wall test - and differ only in how they are
// launched and what happens on impact:
//   "spit"    lobbed, falls under gravity, hits on contact (spitter)
//   "bolt"    flat and fast, no drop, hits on contact (wasp drone)
//   "missile" slower, no drop, blast radius on impact (hornet gunship)
export class Projectiles {
  constructor(arena) {
    ((this.arena = arena), (this.list = []), (this._v = new Vector3()));
    for (let n = 0; n < MAX_PROJECTILES; n++)
      this.list.push({
        active: !1,
        pos: new Vector3(),
        vel: new Vector3(),
        life: 0,
        dmg: 10,
        owner: null,
        kind: "spit",
        drop: 5,
        splash: 0,
        splashMin: 0.35,
      });
  }
  clear() {
    for (const t of this.list) t.active = !1;
  }
  fire(enemy, headY, player, world) {
    const s = this.list.find((h) => !h.active);
    if (!s) return;
    const t = enemy,
      r = -Math.sin(t.yaw),
      a = -Math.cos(t.yaw);
    ((s.active = !0),
      (s.life = 3.5),
      (s.dmg = t.def.damage),
      (s.owner = t),
      (s.kind = "spit"),
      (s.drop = 5),
      (s.splash = 0),
      s.pos.set(
        t.pos.x + r * 0.4,
        t.pos.y + headY * t.scale - 0.1,
        t.pos.z + a * 0.4,
      ));
    const l = this._v.set(player.pos.x, player.pos.y + 1.1, player.pos.z),
      c = l.distanceTo(s.pos) / t.def.projSpeed;
    (l.addScaledVector(player.vel, c * 0.7),
      s.vel.subVectors(l, s.pos).normalize().multiplyScalar(t.def.projSpeed),
      (s.vel.y += 5 * c * 0.5),
      world.emit(EV_SPIT, { pos: s.pos.clone() }));
  }
  // A flat, fast round from a drone. Aimed where the player will be rather
  // than where they are, but only weakly: fully leading a 62 m/s bolt would be
  // unavoidable, and the drone's job is to make you move, not to delete you.
  fireBolt(enemy, player, world) {
    const s = this.list.find((h) => !h.active);
    if (!s) return;
    ((s.active = !0),
      (s.life = 2.5),
      (s.dmg = enemy.def.damage),
      (s.owner = enemy),
      (s.kind = "bolt"),
      (s.drop = 0),
      (s.splash = 0),
      s.pos.copy(enemy.pos));
    const aim = this._v.set(player.pos.x, player.pos.y + 1.1, player.pos.z),
      lead = aim.distanceTo(s.pos) / enemy.def.projSpeed;
    (aim.addScaledVector(player.vel, lead * 0.45),
      s.vel
        .subVectors(aim, s.pos)
        .normalize()
        .multiplyScalar(enemy.def.projSpeed),
      world.emit(EV_SPIT, { pos: s.pos.clone(), kind: "bolt" }));
  }
  // The gunship's missile. Slow enough to see and step away from; the blast is
  // the threat, not the impact.
  fireMissile(enemy, player, world) {
    const s = this.list.find((h) => !h.active);
    if (!s) return;
    ((s.active = !0),
      (s.life = 5),
      (s.dmg = enemy.def.damage),
      (s.owner = enemy),
      (s.kind = "missile"),
      (s.drop = 0),
      (s.splash = enemy.def.splashRadius),
      (s.splashMin = enemy.def.splashMin),
      s.pos.copy(enemy.pos));
    const aim = this._v.set(player.pos.x, player.pos.y + 0.9, player.pos.z),
      lead = aim.distanceTo(s.pos) / enemy.def.projSpeed;
    (aim.addScaledVector(player.vel, lead * 0.5),
      s.vel
        .subVectors(aim, s.pos)
        .normalize()
        .multiplyScalar(enemy.def.projSpeed),
      world.emit(EV_SPIT, { pos: s.pos.clone(), kind: "missile" }));
  }
  // A missile detonating. The blast hurts the player and nothing else: enemies
  // are deliberately immune, because a gunship that could clear its own wave
  // would be a gift rather than a threat.
  _detonate(s, player, world) {
    const dx = player.pos.x - s.pos.x,
      dy = player.pos.y + 0.9 - s.pos.y,
      dz = player.pos.z - s.pos.z,
      dist = Math.hypot(dx, dy, dz);
    if (dist < s.splash && !player.dead) {
      const falloff = 1 - (1 - s.splashMin) * (dist / s.splash);
      world.onPlayerHit(s.dmg * falloff, s.pos, null);
    }
    (world.onSlam(s.pos, dist, s.splash),
      world.emit(EV_EXPLOSION, {
        point: s.pos.clone(),
        radius: s.splash,
        def: null,
      }));
  }
  update(t, e, world) {
    for (const s of this.list) {
      if (!s.active) continue;
      ((s.life -= t), (s.vel.y -= s.drop * t), s.pos.addScaledVector(s.vel, t));
      let r = !1;
      const a = MathUtils.clamp(s.pos.y, e.pos.y + 0.3, e.pos.y + 1.65),
        l = s.pos.x - e.pos.x,
        o = s.pos.y - a,
        c = s.pos.z - e.pos.z;
      if (
        (l * l + o * o + c * c < 0.42 &&
          !e.dead &&
          // A splash round deals nothing on contact: _detonate below is what
          // hurts, and paying twice for a direct hit would make the missile
          // far deadlier than its numbers say.
          (s.splash > 0 ||
            world.onPlayerHit(s.dmg, s.owner ? s.owner.pos : s.pos, null),
          (r = !0)),
        !r)
      )
        if (
          s.pos.y < this.arena.groundHeight(s.pos.x, s.pos.z) + 0.15 ||
          Math.hypot(s.pos.x, s.pos.z) > ARENA_RADIUS - 0.4 ||
          s.life <= 0
        )
          r = !0;
        else
          for (const h of this.arena.boxes) {
            if (s.pos.y < h.y0 || s.pos.y > h.y1) continue;
            const [d, u] = h.toLocal(s.pos.x, s.pos.z);
            if (Math.abs(d) < h.hx + 0.15 && Math.abs(u) < h.hz + 0.15) {
              r = !0;
              break;
            }
          }
      if (r) {
        s.active = !1;
        // A missile that runs out of life mid-air still goes off; that is
        // what a missile does, and a silent despawn would read as a bug.
        s.splash > 0
          ? this._detonate(s, e, world)
          : world.emit(EV_PROJECTILE_HIT, {
              pos: s.pos.clone(),
              kind: s.kind,
            });
      }
    }
  }
}
