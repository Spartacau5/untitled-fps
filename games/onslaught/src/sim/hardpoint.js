import { Vector3 } from "three";
import { MIDTOWN, HARDPOINT } from "../data/midtown.js";

// Solo objective practice. A side earns one point per uncontested second;
// numbers on the point never accelerate scoring. Kills do not win the match.
export class Hardpoint {
  constructor(world) {
    this.world = world;
    this.reset();
  }
  reset() {
    this.playerScore = 0;
    this.robotScore = 0;
    this.deaths = 0;
    this.time = 0;
    this.index = 0;
    this.owner = "neutral";
    this.finished = false;
    this.result = null;
    this.spawnShield = 1.5;
    this.reinforceT = 2;
    this._fraction = 0;
    this.announced = -1;
  }
  get point() {
    return MIDTOWN.objectives[this.index];
  }
  get next() {
    return MIDTOWN.objectives[(this.index + 1) % MIDTOWN.objectives.length];
  }
  get rotationLeft() {
    return HARDPOINT.rotation - (this.time % HARDPOINT.rotation);
  }
  get timeLeft() {
    return Math.max(0, HARDPOINT.duration - this.time);
  }
  contains(pos) {
    const p = this.point;
    return (
      Math.hypot(pos.x - p.x, pos.z - p.z) < p.radius && Math.abs(pos.y) < 1
    );
  }
  chooseSpawn(forPlayer = false) {
    const w = this.world;
    const threats = forPlayer
      ? w.enemies.list.filter((e) => e.state !== "die").map((e) => e.pos)
      : w.player.dead
        ? []
        : [w.player.pos];
    let best = forPlayer ? MIDTOWN.spawns[0] : MIDTOWN.spawns[5],
      bestScore = -Infinity;
    for (const s of MIDTOWN.spawns) {
      let score = 100;
      const origin = new Vector3(s.x, 1.5, s.z);
      for (const t of threats) {
        const dir = new Vector3(t.x - s.x, 0, t.z - s.z),
          d = dir.length();
        score = Math.min(
          score,
          d - (w.arena.raycast(origin, dir.normalize(), d) ? 0 : 55),
        );
      }
      // Prefer own end on ties, without ignoring threats there.
      score += (forPlayer ? s.z : -s.z) * 0.02;
      for (const e of w.enemies.list)
        if (e.state !== "die" && Math.hypot(e.pos.x - s.x, e.pos.z - s.z) < 3)
          score -= 30;
      if (score > bestScore) {
        bestScore = score;
        best = s;
      }
    }
    return best;
  }
  placePlayer() {
    const p = this.world.player,
      s = this.chooseSpawn(true);
    p.reset();
    p.pos.set(s.x, 0, s.z);
    p.yaw = s.yaw;
    p._euler.set(0, p.yaw, 0, "YXZ");
    p._prevEuler.copy(p._euler);
    p.camQuat.setFromEuler(p._euler);
    p.prevCamQuat.copy(p.camQuat);
    p.camPos.set(s.x, p.eye, s.z);
    p.prevCamPos.copy(p.camPos);
    p.forward.set(0, 0, -1).applyQuaternion(p.camQuat);
    p.right.set(1, 0, 0).applyQuaternion(p.camQuat);
    this.spawnShield = 1.5;
  }
  update(dt) {
    if (this.finished) return;
    const w = this.world;
    this.time = Math.min(HARDPOINT.duration, this.time + dt);
    this.spawnShield = Math.max(0, this.spawnShield - dt);
    const index =
      Math.floor(this.time / HARDPOINT.rotation) % MIDTOWN.objectives.length;
    if (index !== this.index) {
      this.index = index;
      this._fraction = 0;
    }
    if (this.announced !== Math.floor(this.time / HARDPOINT.rotation)) {
      this.announced = Math.floor(this.time / HARDPOINT.rotation);
      w.emit("objective", { point: this.point, next: this.next });
    }
    if (w.player.dead && w.deadT >= HARDPOINT.respawn) {
      this.deaths++;
      this.placePlayer();
      w.deadT = 0;
      w.weapons.resetAll(w);
      w.weapons._ammo(w);
      w.emit("respawn", {});
    }
    if (!w.noSpawn) {
      this.reinforceT -= dt;
      if (w.enemies.alive < HARDPOINT.bots && this.reinforceT <= 0) {
        const s = this.chooseSpawn();
        const e = w.enemies.spawn(
          "runner",
          {
            pos: new Vector3(s.x, 0, s.z),
            dir: new Vector3(0, 0, s.z > 0 ? -1 : 1),
          },
          1,
          w,
        );
        // Fixed roster, human-size bodies, no wave multipliers or boss health.
        e.pos.set(s.x, 0, s.z);
        e.prevPos.copy(e.pos);
        e.tactical = true;
        e.hp = e.maxHp = 100;
        e.scale = 1;
        e.radius = 0.36;
        e.reaction = 0;
        e.burst = 0;
        e.rounds = 18;
        this.reinforceT = HARDPOINT.botRespawn;
      }
    }
    const human = !w.player.dead && this.contains(w.player.pos);
    const robots = w.enemies.list.some(
      (e) => e.state !== "die" && e.state !== "spawn" && this.contains(e.pos),
    );
    const owner = human
      ? robots
        ? "contested"
        : "player"
      : robots
        ? "robots"
        : "neutral";
    if (owner !== this.owner) this._fraction = 0;
    this.owner = owner;
    if (owner === "player" || owner === "robots") {
      this._fraction += dt;
      while (this._fraction >= 1) {
        this._fraction -= 1;
        if (owner === "player") this.playerScore++;
        else this.robotScore++;
      }
    }
    if (
      this.playerScore >= HARDPOINT.target ||
      this.robotScore >= HARDPOINT.target ||
      this.time >= HARDPOINT.duration
    ) {
      this.finished = true;
      this.result =
        this.playerScore === this.robotScore
          ? "DRAW"
          : this.playerScore > this.robotScore
            ? "VICTORY"
            : "DEFEAT";
      w.emit("matchEnd", { result: this.result });
    }
  }
}
