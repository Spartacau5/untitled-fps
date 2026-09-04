import { MathUtils, Vector3 } from "three";
import { ARENA_RADIUS } from "../data/tuning.js";
import { EV_PROJECTILE_HIT, EV_SPIT } from "./events.js";

export const MAX_PROJECTILES = 64;

// Spitter projectiles. Pure: a fixed pool of records; the view instances them.
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
  update(t, e, world) {
    for (const s of this.list) {
      if (!s.active) continue;
      ((s.life -= t), (s.vel.y -= 5 * t), s.pos.addScaledVector(s.vel, t));
      let r = !1;
      const a = MathUtils.clamp(s.pos.y, e.pos.y + 0.3, e.pos.y + 1.65),
        l = s.pos.x - e.pos.x,
        o = s.pos.y - a,
        c = s.pos.z - e.pos.z;
      if (
        (l * l + o * o + c * c < 0.42 &&
          !e.dead &&
          (world.onPlayerHit(s.dmg, s.owner ? s.owner.pos : s.pos, null),
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
      r &&
        ((s.active = !1),
        world.emit(EV_PROJECTILE_HIT, { pos: s.pos.clone() }));
    }
  }
}
