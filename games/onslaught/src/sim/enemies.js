import {
  Color,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshDepthMaterial,
  MeshStandardMaterial,
  RGBADepthPacking,
  SphereGeometry,
  Vector3,
} from "three";
import {
  _rayTmp,
  damp,
  lerpAngle,
  rayCapsule,
  raySphere,
} from "../core/mathx.js";
import { ENEMIES, MAX_PER_TYPE } from "../data/enemies.js";
import { ARENA_RADIUS } from "../data/tuning.js";
import { buildEnemyRig, makeEnemyMaterial } from "../render/enemy-view.js";

export const ZERO_MATRIX = new Matrix4().makeScale(0, 0, 0);
export class Enemies {
  constructor(t, e, n, s, r, rng) {
    ((this.scene = t),
      (this.arena = e),
      (this.particles = n),
      (this.audio = s),
      (this.cb = r),
      (this.rng = rng),
      (this.uTime = { value: 0 }),
      (this.list = []),
      (this.types = {}),
      (this.nextId = 1));
    for (const a in ENEMIES) this._buildType(ENEMIES[a]);
    (this._buildProjectiles(),
      (this._v = new Vector3()),
      (this._v2 = new Vector3()),
      (this._v3 = new Vector3()),
      (this._headC = new Vector3()),
      (this._a = new Vector3()),
      (this._b = new Vector3()));
  }
  _buildType(t) {
    const e = buildEnemyRig(t.proportions),
      n = new Float32Array(MAX_PER_TYPE),
      s = new Float32Array(MAX_PER_TYPE),
      r = makeEnemyMaterial(
        new MeshStandardMaterial({
          color: t.bodyColor,
          roughness: 0.55,
          metalness: 0.55,
        }),
        this.uTime,
        !1,
      ),
      a = makeEnemyMaterial(
        new MeshStandardMaterial({
          color: 0,
          emissive: new Color(t.glow[0], t.glow[1], t.glow[2]),
          emissiveIntensity: 2.2,
          roughness: 0.6,
          metalness: 0,
        }),
        this.uTime,
        !0,
      ),
      l = [];
    for (const o of e.parts) {
      const c = o.kind === "glow" || o.kind === "headGlow",
        h = new InstancedBufferAttribute(n, 1),
        d = new InstancedBufferAttribute(s, 1);
      (h.setUsage(DynamicDrawUsage),
        d.setUsage(DynamicDrawUsage),
        o.geom.setAttribute("aFlash", h),
        o.geom.setAttribute("aDissolve", d));
      const u = new InstancedMesh(o.geom, c ? a : r, MAX_PER_TYPE);
      (u.instanceMatrix.setUsage(DynamicDrawUsage),
        (u.frustumCulled = !1),
        (u.castShadow = !c),
        (u.receiveShadow = !c),
        (u.count = 0),
        (u.customDepthMaterial = makeEnemyMaterial(
          new MeshDepthMaterial({ depthPacking: RGBADepthPacking }),
          this.uTime,
          !1,
          !0,
        )),
        this.scene.add(u),
        l.push({ mesh: u, part: o, fa: h, da: d }));
    }
    this.types[t.key] = { def: t, rig: e, meshes: l, flash: n, dissolve: s };
  }
  _buildProjectiles() {
    const t = new SphereGeometry(0.17, 12, 10),
      e = new MeshStandardMaterial({
        color: 1127185,
        emissive: 5635942,
        emissiveIntensity: 4.5,
        roughness: 0.4,
      });
    ((this.projMesh = new InstancedMesh(t, e, 64)),
      this.projMesh.instanceMatrix.setUsage(DynamicDrawUsage),
      (this.projMesh.frustumCulled = !1),
      (this.projMesh.count = 0),
      this.scene.add(this.projMesh),
      (this.projectiles = []));
    for (let n = 0; n < 64; n++)
      this.projectiles.push({
        active: !1,
        pos: new Vector3(),
        vel: new Vector3(),
        life: 0,
        dmg: 10,
        owner: null,
      });
    this._pm = new Matrix4();
  }
  get alive() {
    let t = 0;
    for (const e of this.list) e.state !== "die" && t++;
    return t;
  }
  clear() {
    this.list.length = 0;
    for (const t of this.projectiles) t.active = !1;
  }
  spawn(t, e, n = 1) {
    const s = ENEMIES[t];
    this.types[t];
    const r = -e.dir.z,
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
        vel: new Vector3(),
        kb: new Vector3(),
        push: new Vector3(),
        yaw: Math.atan2(-e.dir.x, -e.dir.z),
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
      this.list.push(c),
      this.particles.spawnFx(c.pos, s.glow),
      this.audio.enemyGrowl([c.pos.x, c.pos.y, c.pos.z], s.big),
      c
    );
  }
  raycast(t, e, n) {
    let s = null;
    for (const r of this.list) {
      if (r.state === "die") continue;
      const a = this.types[r.type].rig,
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
  damage(t, e, n, s) {
    const r = t.enemy;
    if (r.state === "die") return { killed: !1 };
    ((r.hp -= e), (r.flash = 1), (r.squash = Math.min(0.22, r.squash + 0.1)));
    const a = s.kbForce / r.def.mass;
    return (
      (r.kb.x += n.x * a),
      (r.kb.z += n.z * a),
      r.state === "spawn" && ((r.state = "chase"), (r.dissolve = 0)),
      this.particles.fleshBurst(t.point, n, t.head, r.def.glow),
      this.audio.impactFlesh([t.point.x, t.point.y, t.point.z]),
      r.hp <= 0 ? (this.kill(r, n, t.head, s), { killed: !0 }) : { killed: !1 }
    );
  }
  kill(t, e, n, s) {
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
    ((t.kb.x += e.x * o),
      (t.kb.z += e.z * o),
      this.particles.deathBurst(t.pos, t.def.glow, t.scale, n),
      this.audio.enemyDeath([t.pos.x, t.pos.y, t.pos.z], t.def.big),
      this.cb.onKill(t, n));
  }
  _fireProjectile(t, e) {
    const n = this.types[t.type].rig,
      s = this.projectiles.find((h) => !h.active);
    if (!s) return;
    const r = -Math.sin(t.yaw),
      a = -Math.cos(t.yaw);
    ((s.active = !0),
      (s.life = 3.5),
      (s.dmg = t.def.damage),
      (s.owner = t),
      s.pos.set(
        t.pos.x + r * 0.4,
        t.pos.y + n.headY * t.scale - 0.1,
        t.pos.z + a * 0.4,
      ));
    const l = this._v.set(e.pos.x, e.pos.y + 1.1, e.pos.z),
      c = l.distanceTo(s.pos) / t.def.projSpeed;
    (l.addScaledVector(e.vel, c * 0.7),
      s.vel.subVectors(l, s.pos).normalize().multiplyScalar(t.def.projSpeed),
      (s.vel.y += 5 * c * 0.5),
      this.audio.spit([s.pos.x, s.pos.y, s.pos.z]),
      this.particles.splash(s.pos, [0.4, 1, 0.4]));
  }
  _updateProjectiles(t, e) {
    let n = 0;
    for (const s of this.projectiles) {
      if (!s.active) continue;
      ((s.life -= t),
        (s.vel.y -= 5 * t),
        s.pos.addScaledVector(s.vel, t),
        this.particles.trail(s.pos, [0.35, 1, 0.4], 0.16));
      let r = !1;
      const a = MathUtils.clamp(s.pos.y, e.pos.y + 0.3, e.pos.y + 1.65),
        l = s.pos.x - e.pos.x,
        o = s.pos.y - a,
        c = s.pos.z - e.pos.z;
      if (
        (l * l + o * o + c * c < 0.42 &&
          !e.dead &&
          (this.cb.playerHit(s.dmg, s.owner ? s.owner.pos : s.pos, null),
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
        ((s.active = !1),
          this.particles.splash(s.pos, [0.4, 1, 0.4]),
          this.audio.splash([s.pos.x, s.pos.y, s.pos.z]));
        continue;
      }
      (this._pm.makeTranslation(s.pos.x, s.pos.y, s.pos.z),
        this.projMesh.setMatrixAt(n++, this._pm));
    }
    ((this.projMesh.count = n),
      (this.projMesh.instanceMatrix.needsUpdate = !0));
  }
  update(t, e, n) {
    this.uTime.value = n;
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
            this.audio.enemyGrowl([o.pos.x, o.pos.y, o.pos.z], c.big)),
          (o.attackLean = damp(o.attackLean, 0, 8, t)));
      } else if (o.state === "attack") {
        ((o.t += t), (o.yaw = lerpAngle(o.yaw, m, 1 - Math.exp(-12 * t))));
        const v = Math.exp(-8 * t);
        if (((o.vel.x *= v), (o.vel.z *= v), c.ranged))
          ((o.attackLean = o.t < c.windup ? -0.35 * (o.t / c.windup) : 0.4),
            !o.attackDone &&
              o.t >= c.windup &&
              ((o.attackDone = !0), this._fireProjectile(o, e)),
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
              (this.particles.slamWave(o.pos, 4),
              this.audio.bruteSlam([o.pos.x, o.pos.y, o.pos.z]),
              this.cb.slam(o.pos, u)),
              p && !e.dead && this.cb.playerHit(c.damage, o.pos, o));
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
    (this._updateProjectiles(t, e), this._render());
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
  _render() {
    for (const t in this.types) {
      const e = this.types[t],
        n = e.rig,
        s = n.n,
        r = e.def.proportions;
      let a = 0;
      for (const l of this.list) {
        if (l.type !== t || a >= MAX_PER_TYPE) continue;
        const o = l.scale,
          c = l.squash;
        (n.root.position.copy(l.pos),
          n.root.rotation.set(l.toppleX, l.yaw, l.toppleZ),
          n.root.scale.set(o * (1 + c * 0.6), o * (1 - c), o * (1 + c * 0.6)));
        const h = l.phase,
          d = l.moveBlend,
          u = Math.sin(h) * 0.95 * d,
          m = Math.sin(h + Math.PI) * 0.95 * d;
        ((s.legL.rotation.x = u),
          (s.legR.rotation.x = m),
          (s.knL.rotation.x = Math.max(0, -Math.sin(h - 0.9)) * 1.2 * d + 0.1),
          (s.knR.rotation.x =
            Math.max(0, -Math.sin(h + Math.PI - 0.9)) * 1.2 * d + 0.1),
          (s.hips.position.y =
            n.hipH + Math.abs(Math.sin(h)) * 0.06 * d - (1 - d) * 0.02),
          (s.hips.rotation.y = Math.sin(h) * 0.14 * d),
          (s.torso.rotation.x = r.lean * d + l.attackLean + 0.08),
          (s.torso.rotation.y = -Math.sin(h) * 0.16 * d),
          (s.neck.rotation.x = -r.lean * 0.75 * d - l.attackLean * 0.6));
        let g = 0,
          v = 0;
        if (l.state === "attack") {
          const p = l.def;
          ((g = Math.min(1, l.t / p.windup)),
            (v = l.t > p.windup ? Math.min(1, (l.t - p.windup) / 0.25) : 0));
        }
        (r.armsForward
          ? ((s.shL.rotation.x =
              -1.35 + Math.sin(h + Math.PI) * 0.35 * d - g * 1.2 + v * 1.8),
            (s.shR.rotation.x =
              -1.35 + Math.sin(h) * 0.35 * d - g * 1.2 + v * 1.8),
            (s.shL.rotation.z = 0.25 + g * 0.6 - v * 0.5),
            (s.shR.rotation.z = -0.25 - g * 0.6 + v * 0.5),
            (s.elL.rotation.x = -0.45 - g * 0.8 + v * 0.6),
            (s.elR.rotation.x = -0.45 - g * 0.8 + v * 0.6))
          : ((s.shL.rotation.x =
              Math.sin(h + Math.PI) * 0.7 * d - 0.2 - g * 2.3 + v * 2.6),
            (s.shR.rotation.x =
              Math.sin(h) * 0.7 * d - 0.2 - g * 2.3 + v * 2.6),
            (s.shL.rotation.z = 0.35 + g * 0.4 - v * 0.6),
            (s.shR.rotation.z = -0.35 - g * 0.4 + v * 0.6),
            (s.elL.rotation.x = -0.6 - g * 0.5),
            (s.elR.rotation.x = -0.6 - g * 0.5)),
          n.root.updateMatrixWorld(!0));
        for (const p of e.meshes) {
          const f =
            l.headless &&
            (p.part.kind === "head" || p.part.kind === "headGlow");
          p.mesh.setMatrixAt(a, f ? ZERO_MATRIX : p.part.node.matrixWorld);
        }
        ((e.flash[a] = l.flash), (e.dissolve[a] = l.dissolve), a++);
      }
      for (const l of e.meshes)
        ((l.mesh.count = a),
          (l.mesh.instanceMatrix.needsUpdate = !0),
          (l.fa.needsUpdate = !0),
          (l.da.needsUpdate = !0));
    }
  }
}
