import { Vector3 } from "three";
import { damp, lerpAngle, rayCapsule } from "../core/mathx.js";
import { Enemies } from "./enemies.js";
import { PATROLS } from "../data/midtown.js";

const RIFLE = { key: "operator-rifle", damage: 25, kbForce: 0.15 };
export class TacticalEnemies extends Enemies {
  constructor(arena, rng) {
    super(arena, rng);
    this.eye = new Vector3();
    this.sight = new Vector3();
    this.targetPoint = new Vector3();
  }
  update(dt, player, world) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i];
      e.prevPos.copy(e.pos);
      e.prevYaw = e.yaw;
      e.flash = Math.max(0, e.flash - dt * 9);
      e.shotFlash = Math.max(0, (e.shotFlash || 0) - dt);
      e.squash = Math.max(0, e.squash - dt * 1.4);
      e.kb.multiplyScalar(Math.exp(-6 * dt));
      e.shield = Math.max(0, (e.shield || 0) - dt);
      if (e.state === "die") {
        e.t += dt;
        const fall = 1 - (1 - Math.min(1, e.t / 0.5)) ** 3;
        e.toppleX = e.toppleTX * fall;
        e.toppleZ = e.toppleTZ * fall;
        e.dissolve = Math.min(1, Math.max(0, (e.t - 0.8) / 1.2));
        if (e.t > 2) this.list.splice(i, 1);
        continue;
      }
      if (e.state === "spawn") {
        e.t += dt;
        e.dissolve = Math.max(0, 1 - e.t / 0.7);
        if (e.t >= 0.7) e.state = "chase";
        continue;
      }
      const origin = this.eye.set(e.pos.x, e.pos.y + 1.35, e.pos.z);
      // Perception runs at 8 Hz, staggered by slot. Locomotion stays at 60 Hz.
      e.thinkT = (e.thinkT ?? e.slot * 0.02) - dt;
      if (e.thinkT <= 0) {
        e.thinkT = 0.125;
        let best = 32,
          seen = null;
        const consider = (actor, point, offset) => {
          this.sight
            .copy(point)
            .addScaledVector(TacticalEnemies.up, offset)
            .sub(origin);
          const distance = this.sight.length();
          if (
            distance < best &&
            !this.arena.raycast(origin, this.sight.normalize(), distance)
          ) {
            best = distance;
            seen = actor;
          }
        };
        for (const actor of this.list)
          if (
            actor !== e &&
            actor.state === "chase" &&
            actor.team !== e.team &&
            actor.shield <= 0
          )
            consider(actor, actor.pos, 1.25);
        if (e.team !== "blue" && !player.dead && world.match.spawnShield <= 0)
          consider(player, player.camPos, -0.3);
        if (seen !== e.seen) e.reaction = 0;
        e.seen = seen;
      }
      const seen = e.seen;
      const valid = seen && !seen.dead && seen.state !== "die";
      const point = valid
        ? this.targetPoint
            .copy(seen === player ? player.camPos : seen.pos)
            .addScaledVector(TacticalEnemies.up, seen === player ? -0.3 : 1.25)
        : null;
      const target = valid
        ? { id: seen === player ? 0 : seen.id, point }
        : null;
      const best = point ? point.distanceTo(origin) : 32;
      e.targetId = target?.id ?? null;
      e.reaction = target ? e.reaction + dt : 0;
      e.cooldown -= dt;
      e.reloadT = Math.max(0, e.reloadT - dt);
      const engaged = target && e.reaction >= 0.38 + (e.slot % 3) * 0.09;
      if (engaged && e.cooldown <= 0 && e.reloadT <= 0) {
        const end = target.point
          .clone()
          .add(
            new Vector3(
              this.rng.range(-1, 1),
              this.rng.range(-0.65, 0.65),
              this.rng.range(-1, 1),
            ).multiplyScalar(0.18 + best * 0.019 + e.moveBlend * 0.1),
          );
        const dir = end.sub(origin).normalize();
        const wall = this.arena.raycast(origin, dir, 60);
        const hit = this.raycast(origin, dir, wall ? wall.dist : 60, e);
        let distance = wall ? wall.dist : 60;
        let victim = hit?.enemy;
        if (hit) distance = hit.t;
        // Resolve the nearest body, not just the intended target. FFA includes everyone.
        const human = player.dead
          ? -1
          : rayCapsule(
              origin,
              dir,
              player.pos.clone().add(new Vector3(0, player.radius, 0)),
              player.pos.clone().add(new Vector3(0, player.eye, 0)),
              player.radius,
            );
        if (human >= 0 && human < distance) {
          distance = human;
          victim = null;
          if (e.team !== "blue") world.onPlayerHit(RIFLE.damage, origin, e);
        } else if (victim)
          this.damage(hit, RIFLE.damage, dir, RIFLE, world, {
            team: e.team,
            player: false,
          });
        world.emit("botShot", {
          origin: origin.clone(),
          end: origin.clone().addScaledVector(dir, distance),
          team: e.team,
        });
        e.shotFlash = 0.075;
        e.shield = 0;
        e.rounds--;
        e.burst++;
        if (e.rounds <= 0) {
          e.reloadT = 2.4;
          e.rounds = 18;
          world.emit("botReload", { pos: e.pos.clone() });
        }
        e.cooldown = e.reloadT > 0 ? e.reloadT : e.burst >= 3 ? 0.65 : 0.13;
        if (e.burst >= 3) e.burst = 0;
      }
      const route = PATROLS[e.patrol],
        waypoint = route[e.waypoint];
      if (Math.hypot(e.pos.x - waypoint[0], e.pos.z - waypoint[1]) < 1.5) {
        if (
          e.waypoint + e.patrolDir < 0 ||
          e.waypoint + e.patrolDir >= route.length
        )
          e.patrolDir *= -1;
        e.waypoint += e.patrolDir;
      }
      const flow = world.match.navigation[e.slot],
        goal = route[e.waypoint];
      flow.update(goal[0], goal[1]);
      let dir = flow.dirAt(e.pos.x, e.pos.z);
      let vx = dir ? dir[0] * 3.8 : 0,
        vz = dir ? dir[1] * 3.8 : 0;
      if (target) {
        const dx = target.point.x - e.pos.x,
          dz = target.point.z - e.pos.z;
        const distance = Math.hypot(dx, dz) || 1;
        const side = Math.sin(world.elapsed * 0.85 + e.slot * 2.1) > 0 ? 1 : -1;
        // Short lateral peeks, close distance only at range, back off to reload.
        const advance =
          e.reloadT > 0 ? -2.2 : distance > 18 ? 2 : distance < 7 ? -1 : 0;
        vx = (dx * advance + dz * side * 1.15) / distance;
        vz = (dz * advance - dx * side * 1.15) / distance;
        e.aimPitch = Math.atan2(target.point.y - origin.y, distance);
      } else e.aimPitch = 0;
      for (const other of this.list) {
        if (other === e || other.state === "die") continue;
        const dx = e.pos.x - other.pos.x,
          dz = e.pos.z - other.pos.z,
          d = Math.hypot(dx, dz);
        if (d > 0.001 && d < 1) {
          vx += (dx / d) * (1 - d) * 3;
          vz += (dz / d) * (1 - d) * 3;
        }
      }
      e.vel.x = damp(e.vel.x, vx, 8, dt);
      e.vel.z = damp(e.vel.z, vz, 8, dt);
      const aim = target?.point.clone().sub(origin);
      const face = aim
        ? Math.atan2(-aim.x, -aim.z)
        : dir
          ? Math.atan2(-dir[0], -dir[1])
          : e.yaw;
      e.yaw = lerpAngle(e.yaw, face, 1 - Math.exp(-9 * dt));
      [e.pos.x, e.pos.z] = this.arena.resolveCircle(
        e.pos.x + (e.vel.x + e.kb.x) * dt,
        e.pos.z + (e.vel.z + e.kb.z) * dt,
        e.radius,
        0,
        2,
        0,
      );
      const speed = Math.hypot(e.vel.x, e.vel.z);
      e.moveBlend = damp(e.moveBlend, Math.min(1, speed / 3.8), 8, dt);
      e.phase += e.pos.distanceTo(e.prevPos) * 5.1;
      e.headBob = Math.abs(Math.sin(e.phase)) * 0.025 * e.moveBlend;
      e.stepDistance += e.pos.distanceTo(e.prevPos);
      if (e.stepDistance > 1.5) {
        e.stepDistance = 0;
        world.emit("botStep", { pos: e.pos.clone() });
      }
      e.attackLean = 0;
      e.pos.y = 0;
    }
  }
  static up = new Vector3(0, 1, 0);
}
