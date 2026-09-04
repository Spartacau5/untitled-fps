import { MathUtils, Vector3 } from "three";
import {
  _rayTmp,
  damp,
  lerpAngle,
  rayCapsule,
  raySphere,
} from "../core/mathx.js";
import { ENEMIES } from "../data/enemies.js";
import { ARENA_RADIUS } from "../data/tuning.js";
import { EV_GROWL, EV_HIT, EV_KILL, EV_SLAM, EV_SPAWN } from "./events.js";

// Rig heights derived from an enemy's proportions. Shared by the sim (hitboxes)
// and the view (skeleton) so both agree on where the head and torso are.
export function rigMetrics(i) {
  const hipH = i.legUL + i.legLL + 0.06;
  return {
    hipH,
    headY: hipH + i.hips[1] * 0.45 + i.torso[1] + 0.02 + i.head * 0.55,
    torsoTop: hipH + i.hips[1] * 0.45 + i.torso[1],
    torsoBot: hipH - i.hips[1] * 0.5,
  };
}

// Pure enemy simulation: spawning, steering, attacks, hitboxes, death timing.
// Emits events on `world` instead of touching particles/audio/meshes.
export class Enemies {
  constructor(arena, rng) {
    ((this.arena = arena),
      (this.rng = rng),
      (this.list = []),
      (this.metrics = {}),
      (this.nextId = 1));
    for (const a in ENEMIES)
      this.metrics[a] = rigMetrics(ENEMIES[a].proportions);
    ((this._v = new Vector3()),
      (this._headC = new Vector3()),
      (this._a = new Vector3()),
      (this._b = new Vector3()));
  }
  get alive() {
    let t = 0;
    for (const e of this.list) e.state !== "die" && t++;
    return t;
  }
  clear() {
    this.list.length = 0;
  }
  spawn(t, e, n = 1, world) {
    const s = ENEMIES[t],
      r = -e.dir.z,
      a = e.dir.x,
      l = this.rng.range(-2.4, 2.4),
      o = s.scale * this.rng.range(0.92, 1.08),
      c = {
        id: this.nextId++,
        type: t,
        def: s,
        scale: o,
        radius: s.radius * (o / s.scale),
        pos: new Vector3(
          e.pos.x + r * l + e.dir.x * this.rng.range(0, 1.5),
          0,
          e.pos.z + a * l + e.dir.z * this.rng.range(0, 1.5),
        ),
        prevPos: new Vector3(),
        vel: new Vector3(),
        kb: new Vector3(),
        push: new Vector3(),
        yaw: Math.atan2(-e.dir.x, -e.dir.z),
        prevYaw: Math.atan2(-e.dir.x, -e.dir.z),
        hp: s.hp * n,
        maxHp: s.hp * n,
        state: "spawn",
        t: 0,
        phase: this.rng.float() * 6,
        moveBlend: 0,
        flash: 0,
        dissolve: 1,
        squash: 0,
        headless: !1,
        toppleX: 0,
        toppleZ: 0,
        toppleTX: 0,
        toppleTZ: 0,
        sink: 0,
        attackDone: !1,
        cooldown: this.rng.range(0.4, 1.2),
        steerBias: this.rng.chance(0.5) ? 1 : -1,
        blockedT: 0,
        growlT: this.rng.range(0.5, 3),
        lunge: 0,
        attackLean: 0,
        headBob: 0,
      };
    return (
      (c.pos.y = this.arena.groundHeight(c.pos.x, c.pos.z)),
      c.prevPos.copy(c.pos),
      this.list.push(c),
      world && world.emit(EV_SPAWN, { pos: c.pos.clone(), kind: t, big: s.big }),
      c
    );
  }
  raycast(t, e, n) {
    let s = null;
    for (const r of this.list) {
      if (r.state === "die") continue;
      const a = this.metrics[r.type],
        l = r.def.proportions,
        o = r.scale,
        c = -Math.sin(r.yaw),
        h = -Math.cos(r.yaw),
        d = r.pos.x,
        u = r.pos.z;
      _rayTmp.set(d, r.pos.y + a.hipH * o, u);
      const m = raySphere(t, e, _rayTmp, a.headY * o * 0.75);
      if (m < 0 || m > n) continue;
      const g = 0.2 * o * r.moveBlend;
      this._headC.set(
        d + c * g,
        r.pos.y + a.headY * o - 0.04 * o * r.moveBlend + r.headBob,
        u + h * g,
      );
      const v = raySphere(t, e, this._headC, l.head * 0.64 * o);
      (this._a.set(d, r.pos.y + a.torsoBot * o, u),
        this._b.set(
          d + c * g * 0.7,
          r.pos.y + a.torsoTop * o,
          u + h * g * 0.7,
        ));
      const p = rayCapsule(
        t,
        e,
        this._a,
        this._b,
        Math.max(l.torso[0], l.torso[2]) * 0.52 * o,
      );
      (this._a.set(d, r.pos.y + 0.08, u),
        this._b.set(d, r.pos.y + a.torsoBot * o, u));
      const f = rayCapsule(t, e, this._a, this._b, l.hips[0] * 0.5 * o);
      let w = -1,
        M = !1;
      (v >= 0 && ((w = v), (M = !0)),
        p >= 0 && (w < 0 || p < w - 0.02) && ((w = p), (M = !1)),
        f >= 0 && (w < 0 || f < w) && ((w = f), (M = !1)),
        !(w < 0 || w > n) &&
          (!s || w < s.t) &&
          (s = {
            enemy: r,
            t: w,
            head: M,
            point: new Vector3(t.x + e.x * w, t.y + e.y * w, t.z + e.z * w),
          }));
    }
    return s;
  }
  damage(t, e, n, s, world) {
    const r = t.enemy;
    if (r.state === "die") return { killed: !1 };
    ((r.hp -= e), (r.flash = 1), (r.squash = Math.min(0.22, r.squash + 0.1)));
    const a = s.kbForce / r.def.mass;
    ((r.kb.x += n.x * a),
      (r.kb.z += n.z * a),
      r.state === "spawn" && ((r.state = "chase"), (r.dissolve = 0)));
    const killed = r.hp <= 0;
    return (
      world.emit(EV_HIT, {
        point: t.point,
        dir: n,
        head: t.head,
        killed,
        kind: r.type,
      }),
      killed && this.kill(r, n, t.head, s, world),
      { killed }
    );
  }
  kill(t, e, n, s, world) {
    ((t.state = "die"),
      (t.t = 0),
      (t.headless = n),
      (t.dissolve = 0),
      (t.attackLean = 0));
    const r = -Math.sin(t.yaw),
      a = -Math.cos(t.yaw),
      l = e.x * r + e.z * a;
    ((t.toppleTX = (l < 0 ? 1 : -1) * (Math.PI / 2) * this.rng.range(0.85, 1)),
      (t.toppleTZ = this.rng.range(-0.5, 0.5)));
    const o = ((s ? s.kbForce : 2) * 1.6) / t.def.mass;
    ((t.kb.x += e.x * o), (t.kb.z += e.z * o), world.onKill(t, n));
  }
  update(t, e, world) {
    const s = this.list,
      r = this.arena,
      a = e.pos;
    for (const l of s) l.push.set(0, 0, 0);
    for (let l = 0; l < s.length; l++) {
      const o = s[l];
      if (o.state !== "die")
        for (let c = l + 1; c < s.length; c++) {
          const h = s[c];
          if (h.state === "die") continue;
          const d = o.pos.x - h.pos.x,
            u = o.pos.z - h.pos.z,
            m = (o.radius + h.radius) * 1.15,
            g = d * d + u * u;
          if (g > m * m || g < 1e-6) continue;
          const v = Math.sqrt(g),
            p = (m - v) / m,
            f = d / v,
            w = u / v,
            M = o.def.mass,
            _ = h.def.mass;
          ((o.push.x += f * p * (_ / (M + _)) * 2),
            (o.push.z += w * p * (_ / (M + _)) * 2),
            (h.push.x -= f * p * (M / (M + _)) * 2),
            (h.push.z -= w * p * (M / (M + _)) * 2));
        }
    }
    for (let l = s.length - 1; l >= 0; l--) {
      const o = s[l],
        c = o.def;
      (o.prevPos.copy(o.pos), (o.prevYaw = o.yaw));
      ((o.flash = Math.max(0, o.flash - t * 9)),
        (o.squash = Math.max(0, o.squash - t * 1.4)),
        o.kb.multiplyScalar(Math.exp(-6 * t)));
      const h = a.x - o.pos.x,
        d = a.z - o.pos.z,
        u = Math.hypot(h, d) || 0.001,
        m = Math.atan2(-h, -d);
      if (o.state === "spawn")
        ((o.t += t),
          (o.dissolve = Math.max(0, 1 - o.t / 0.7)),
          (o.yaw = lerpAngle(o.yaw, m, 1 - Math.exp(-4 * t))),
          o.t >= 0.7 && ((o.state = "chase"), (o.dissolve = 0)));
      else if (o.state === "chase") {
        let v = h / u,
          p = d / u,
          f = c.speed;
        if (((o.cooldown -= t), c.ranged)) {
          if (!(u > c.standoff + 3))
            if (u < c.standoff - 4) ((v = -v), (p = -p), (f *= 0.75));
            else {
              const R = -p * o.steerBias,
                A = v * o.steerBias;
              ((v = R), (p = A), (f *= 0.55));
            }
          o.cooldown <= 0 &&
            u < 28 &&
            !e.dead &&
            ((o.state = "attack"), (o.t = 0), (o.attackDone = !1));
        } else
          u < c.range &&
            o.cooldown <= 0 &&
            !e.dead &&
            ((o.state = "attack"), (o.t = 0), (o.attackDone = !1));
        const w = o.pos.x + v * (o.radius + 1),
          M = o.pos.z + p * (o.radius + 1);
        if (this._blocked(w, M, o.radius)) {
          const R = -p * o.steerBias,
            A = v * o.steerBias;
          ((v = v * 0.25 + R), (p = p * 0.25 + A));
          const C = Math.hypot(v, p) || 1;
          ((v /= C),
            (p /= C),
            (o.blockedT += t),
            o.blockedT > 0.9 && ((o.steerBias *= -1), (o.blockedT = 0)));
        } else o.blockedT = Math.max(0, o.blockedT - t);
        const _ = v * f + o.push.x * 4,
          L = p * f + o.push.z * 4;
        ((o.vel.x = damp(o.vel.x, _, 5, t)),
          (o.vel.z = damp(o.vel.z, L, 5, t)),
          (o.yaw = lerpAngle(
            o.yaw,
            Math.atan2(-o.vel.x, -o.vel.z),
            1 - Math.exp(-7 * t),
          )),
          (c.ranged || u < 6) &&
            (o.yaw = lerpAngle(o.yaw, m, 1 - Math.exp(-7 * t))),
          (o.growlT -= t),
          o.growlT < 0 &&
            ((o.growlT = this.rng.range(3, 9)),
            world.emit(EV_GROWL, { pos: o.pos.clone(), big: c.big })),
          (o.attackLean = damp(o.attackLean, 0, 8, t)));
      } else if (o.state === "attack") {
        ((o.t += t), (o.yaw = lerpAngle(o.yaw, m, 1 - Math.exp(-12 * t))));
        const v = Math.exp(-8 * t);
        if (((o.vel.x *= v), (o.vel.z *= v), c.ranged))
          ((o.attackLean = o.t < c.windup ? -0.35 * (o.t / c.windup) : 0.4),
            !o.attackDone &&
              o.t >= c.windup &&
              ((o.attackDone = !0),
              world.projectiles.fire(o, this.metrics[o.type].headY, e, world)),
            o.t >= c.windup + c.swing &&
              ((o.state = "chase"),
              (o.cooldown = c.cooldown * this.rng.range(0.8, 1.25)),
              (o.attackLean = 0)));
        else {
          if (
            (o.t < c.windup
              ? ((o.attackLean = -0.3 * (o.t / c.windup)),
                !c.big &&
                  o.t > c.windup - 0.12 &&
                  ((o.vel.x += (h / u) * 40 * t),
                  (o.vel.z += (d / u) * 40 * t)))
              : (o.attackLean = 0.55),
            !o.attackDone && o.t >= c.windup)
          ) {
            o.attackDone = !0;
            const p = u < c.range * 1.3 && Math.abs(e.pos.y - o.pos.y) < 1.8;
            (c.slam &&
              (world.emit(EV_SLAM, { pos: o.pos.clone(), dist: u }),
              world.onSlam(o.pos, u)),
              p && !e.dead && world.onPlayerHit(c.damage, o.pos, o));
          }
          o.t >= c.windup + c.swing &&
            ((o.state = "chase"), (o.cooldown = c.cooldown));
        }
      } else if (o.state === "die") {
        o.t += t;
        const v = 1 - Math.pow(1 - Math.min(1, o.t / 0.5), 3);
        ((o.toppleX = o.toppleTX * v),
          (o.toppleZ = o.toppleTZ * v),
          (o.dissolve = MathUtils.clamp((o.t - 0.35) / 0.8, 0, 1)),
          o.t > 0.5 && (o.sink += t * 0.4));
        const p = Math.exp(-4 * t);
        if (((o.vel.x *= p), (o.vel.z *= p), o.t > 1.25)) {
          s.splice(l, 1);
          continue;
        }
      }
      if (o.state !== "die" || o.t < 0.5) {
        ((o.pos.x += (o.vel.x + o.kb.x) * t),
          (o.pos.z += (o.vel.z + o.kb.z) * t));
        const [v, p] = r.resolveCircle(o.pos.x, o.pos.z, o.radius, 0, 2, 0);
        ((o.pos.x = v), (o.pos.z = p));
      }
      o.pos.y = r.groundHeight(o.pos.x, o.pos.z) - o.sink;
      const g = Math.hypot(o.vel.x, o.vel.z);
      ((o.moveBlend = damp(
        o.moveBlend,
        o.state === "chase" ? Math.min(1, g / (c.speed * 0.6)) : 0,
        8,
        t,
      )),
        (o.phase +=
          t * (c.big ? 6 : 10) * (0.3 + 0.9 * Math.min(1, g / c.speed))),
        (o.headBob =
          Math.abs(Math.sin(o.phase)) * 0.05 * o.scale * o.moveBlend));
    }
  }
  _blocked(t, e, n) {
    if (Math.hypot(t, e) > ARENA_RADIUS - n - 0.5) return !0;
    for (const s of this.arena.boxes) {
      if (s.y1 < 0.5) continue;
      const [r, a] = s.toLocal(t, e);
      if (Math.abs(r) < s.hx + n && Math.abs(a) < s.hz + n) return !0;
    }
    return !1;
  }
}
