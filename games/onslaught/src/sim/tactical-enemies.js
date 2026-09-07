import { Vector3 } from "three";
import { damp, lerpAngle, rayCapsule } from "../core/mathx.js";
import { Enemies } from "./enemies.js";

// Fixed-roster rifle units. Navigate to the objective, acquire only with a
// clear ray, pause to aim, fire a burst, reload, then resume the objective.
export class TacticalEnemies extends Enemies {
  update(dt, player, world) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i];
      e.prevPos.copy(e.pos);
      e.prevYaw = e.yaw;
      e.flash = Math.max(0, e.flash - dt * 9);
      e.squash = Math.max(0, e.squash - dt * 1.4);
      e.kb.multiplyScalar(Math.exp(-6 * dt));
      if (e.state === "die") {
        e.t += dt;
        const fall = 1 - (1 - Math.min(1, e.t / 0.5)) ** 3;
        e.toppleX = e.toppleTX * fall;
        e.toppleZ = e.toppleTZ * fall;
        e.dissolve = Math.min(1, Math.max(0, (e.t - 0.35) / 0.8));
        if (e.t > 1.25) this.list.splice(i, 1);
        continue;
      }
      if (e.state === "spawn") {
        e.t += dt;
        e.dissolve = Math.max(0, 1 - e.t / 0.7);
        if (e.t >= 0.7) e.state = "chase";
        continue;
      }
      const origin = new Vector3(e.pos.x, e.pos.y + 1.35, e.pos.z);
      const aim = player.camPos
        .clone()
        .add(new Vector3(0, -0.35, 0))
        .sub(origin);
      const distance = aim.length();
      const visible =
        !player.dead &&
        distance < 27 &&
        !this.arena.raycast(origin, aim.clone().normalize(), distance);
      e.reaction = visible ? e.reaction + dt : 0;
      e.cooldown -= dt;
      const engaged = visible && e.reaction >= 0.65;
      if (engaged && e.cooldown <= 0) {
        // Seeded angular error, tested against the actual player capsule.
        const target = player.camPos
          .clone()
          .add(
            new Vector3(
              this.rng.range(-1, 1),
              this.rng.range(-0.8, 0.3),
              this.rng.range(-1, 1),
            ).multiplyScalar(0.5 + distance * 0.035),
          );
        const dir = target.sub(origin).normalize();
        const a = player.pos.clone().add(new Vector3(0, player.radius, 0));
        const b = player.pos.clone().add(new Vector3(0, player.eye, 0));
        const hit = rayCapsule(origin, dir, a, b, player.radius);
        const wall = this.arena.raycast(origin, dir, 50);
        const end = wall ? wall.point : origin.clone().addScaledVector(dir, 50);
        if (hit >= 0 && (!wall || hit < wall.dist)) {
          end.copy(origin).addScaledVector(dir, hit);
          world.onPlayerHit(20, origin, e);
        }
        world.emit("botShot", { origin, end: end.clone() });
        e.rounds--;
        e.burst++;
        e.cooldown = e.rounds <= 0 ? 2.4 : e.burst >= 3 ? 1.2 : 0.16;
        if (e.rounds <= 0) e.rounds = 18;
        if (e.burst >= 3) e.burst = 0;
      }
      const point = world.match.point;
      let dir = world.flow.dirAt(e.pos.x, e.pos.z);
      const onPoint =
        Math.hypot(e.pos.x - point.x, e.pos.z - point.z) < point.radius * 0.7;
      if (onPoint || engaged) dir = null;
      let vx = dir ? dir[0] * 3.8 : 0,
        vz = dir ? dir[1] * 3.8 : 0;
      // Body separation prevents units occupying one identical firing position.
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
      const face = visible
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
      e.phase += dt * (1 + speed * 2);
      e.headBob = Math.abs(Math.sin(e.phase)) * 0.025 * e.moveBlend;
      e.attackLean = 0;
      e.pos.y = 0;
    }
  }
}
