import { Vector3 } from "three";
import { MIDTOWN, TDM } from "../data/midtown.js";
import { FlowField } from "./flowfield.js";

export class TeamDeathmatch {
  constructor(world) {
    this.world = world;
    this.navigation = Array.from(
      { length: TDM.allies + TDM.enemies },
      () => new FlowField(world.arena),
    );
    this.reset();
  }
  reset() {
    this.playerScore = 0;
    this.robotScore = 0;
    this.deaths = 0;
    this.time = 0;
    this.finished = false;
    this.result = null;
    this.spawnShield = 1.5;
    this.slots = Array.from({ length: TDM.allies + TDM.enemies }, (_, i) => ({
      team: i < TDM.allies ? "blue" : "red",
      due: 0.35 + i * 0.2,
      actor: null,
    }));
    for (const f of this.navigation || []) f.reset();
  }
  get timeLeft() {
    return Math.max(0, TDM.duration - this.time);
  }
  chooseSpawn(team = "blue") {
    const w = this.world;
    const threats = w.enemies.list
      .filter((e) => e.state !== "die" && e.team !== team)
      .map((e) => e.pos);
    if (team === "red" && !w.player.dead) threats.push(w.player.pos);
    let best = MIDTOWN.spawns[team === "blue" ? 0 : 5],
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
      score += (team === "blue" ? s.z : -s.z) * 0.2;
      const occupied = [
        ...w.enemies.list.filter((e) => e.state !== "die").map((e) => e.pos),
        ...(!w.player.dead ? [w.player.pos] : []),
      ];
      for (const pos of occupied)
        if (Math.hypot(pos.x - s.x, pos.z - s.z) < 3) score -= 30;
      if (score > bestScore) {
        bestScore = score;
        best = s;
      }
    }
    return best;
  }
  placePlayer() {
    const p = this.world.player,
      s = this.chooseSpawn("blue");
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
  recordElimination(victimTeam) {
    if (this.finished) return;
    if (victimTeam === "blue") this.robotScore++;
    else this.playerScore++;
    this.checkEnd();
  }
  checkEnd() {
    if (
      this.finished ||
      (this.playerScore < TDM.target &&
        this.robotScore < TDM.target &&
        this.time < TDM.duration)
    )
      return;
    this.finished = true;
    this.result =
      this.playerScore === this.robotScore
        ? "DRAW"
        : this.playerScore > this.robotScore
          ? "VICTORY"
          : "DEFEAT";
    this.world.emit("matchEnd", { result: this.result });
  }
  update(dt) {
    if (this.finished) return;
    const w = this.world;
    this.time = Math.min(TDM.duration, this.time + dt);
    this.spawnShield = Math.max(0, this.spawnShield - dt);
    if (w.player.dead && w.deadT >= TDM.respawn) {
      this.placePlayer();
      w.deadT = 0;
      w.weapons.resetAll(w);
      w.weapons._ammo(w);
      w.emit("respawn", {});
    }
    if (!w.noSpawn)
      for (let i = 0; i < this.slots.length; i++) {
        const slot = this.slots[i];
        if (slot.actor?.state === "die") {
          slot.actor = null;
          slot.due = this.time + TDM.botRespawn;
        }
        if (slot.actor || this.time < slot.due) continue;
        const s = this.chooseSpawn(slot.team);
        const e = w.enemies.spawn(
          "runner",
          {
            pos: new Vector3(s.x, 0, s.z),
            dir: new Vector3(0, 0, s.z > 0 ? -1 : 1),
          },
          1,
          w,
        );
        Object.assign(e, {
          team: slot.team,
          slot: i,
          tactical: true,
          hp: 100,
          maxHp: 100,
          scale: 1,
          radius: 0.36,
          reaction: 0,
          burst: 0,
          rounds: 18,
          reloadT: 0,
          shotFlash: 0,
          stepDistance: 0,
          patrol: i % 3,
          waypoint: s.z > 0 ? 4 : 0,
          patrolDir: s.z > 0 ? -1 : 1,
          targetId: null,
          navTime: 0,
          shield: 1.5,
        });
        e.pos.set(s.x, 0, s.z);
        e.prevPos.copy(e.pos);
        slot.actor = e;
      }
    this.checkEnd();
  }
}
