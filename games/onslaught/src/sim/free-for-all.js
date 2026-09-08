import { TeamDeathmatch } from "./team-deathmatch.js";
import { TDM } from "../data/midtown.js";
import { MIDTOWN } from "../data/midtown.js";
import { Vector3 } from "three";
import {
  GUN_GAME_FREE_KILLS,
  GUN_GAME_LOADOUT,
  MATCH_HEALTH,
} from "../data/gun-game.js";

export const OPERATOR_NAMES = [
  "WARDEN",
  "ROOK",
  "NOMAD",
  "BISHOP",
  "VIPER",
  "GHOST",
];
export const FFA = {
  bots: 6,
  target: TDM.target,
  duration: TDM.duration,
  respawn: TDM.respawn,
};

// A stable competitor identity survives respawn. Actor ids do not.
export class FreeForAll extends TeamDeathmatch {
  reset() {
    super.reset();
    this.gunGame = true;
    this.gunStage = 0;
    this.freeSelection = false;
    this.awaitingSafeSpawn = false;
    this.nextPlayerSpawnTry = 0;
    this.spawnRng = this.world.rng.fork("match-spawns");
    this.spawnHistory = new Map();
    this.world.weapons.startIndex = 0;
    this.world.weapons.selectImmediate(0, this.world, true);
    this.standings = [
      { id: "blue", name: "YOU", kills: 0, deaths: 0 },
      ...OPERATOR_NAMES.map((name, i) => ({
        id: `operator-${i + 1}`,
        name,
        kills: 0,
        deaths: 0,
      })),
    ];
    this.slots = this.standings.slice(1).map((entry, i) => ({
      team: entry.id,
      due: 0.15 + i * 0.12,
      actor: null,
    }));
  }
  get leaderboard() {
    return [...this.standings].sort(
      (a, b) =>
        b.kills - a.kills ||
        a.deaths - b.deaths ||
        this.standings.indexOf(a) - this.standings.indexOf(b),
    );
  }
  placePlayer() {
    if (this.time < this.nextPlayerSpawnTry) return false;
    this.world.player.maxHp = MATCH_HEALTH;
    this.world.player.groundedCombat = true;
    if (!super.placePlayer()) {
      this.awaitingSafeSpawn = true;
      this.nextPlayerSpawnTry = this.time + 0.25;
      return false;
    }
    this.awaitingSafeSpawn = false;
    // Parent respawn resets ammunition using startIndex. Preserve free choice
    // after mastery; before it, respawn with the earned stage, never the pistol.
    this.world.weapons.startIndex = this.freeSelection
      ? this.world.weapons.current
      : this.gunStage;
    this.world._lastAttacker = null;
    return true;
  }
  chooseSpawn(identity = "blue") {
    const w = this.world;
    const threats = w.enemies.list.filter(
      (actor) => actor.state !== "die" && actor.team !== identity,
    );
    if (identity !== "blue" && !w.player.dead) threats.push(w.player);
    const candidates = [],
      origin = new Vector3(),
      direction = new Vector3();
    for (let i = 0; i < MIDTOWN.spawns.length; i++) {
      const spawn = MIDTOWN.spawns[i],
        cell = w.flow.cellOf(spawn.x, spawn.z);
      if (cell < 0 || !w.flow.open[cell]) continue;
      origin.set(spawn.x, 1.45, spawn.z);
      let nearest = 40,
        exposure = 0,
        unsafe = false;
      for (const threat of threats) {
        const distance = Math.hypot(
          threat.pos.x - spawn.x,
          threat.pos.z - spawn.z,
        );
        nearest = Math.min(nearest, distance);
        if (distance < 10) {
          unsafe = true;
          break;
        }
        direction.set(
          threat.pos.x - spawn.x,
          threat.pos.y + 1.35 - origin.y,
          threat.pos.z - spawn.z,
        );
        const range = direction.length();
        if (!w.arena.raycast(origin, direction.normalize(), range)) {
          if (distance < 18) {
            unsafe = true;
            break;
          }
          exposure += Math.max(0, 35 - distance) * 1.3 + 6;
        }
      }
      if (unsafe) continue;
      const used = this.spawnHistory.get(i);
      const recent =
        used === undefined ? 0 : Math.max(0, 16 - (this.time - used)) * 1.4;
      candidates.push({ spawn, i, score: nearest - exposure - recent });
    }
    if (!candidates.length) return null; // Wait for a safe pocket, never force a nearby spawn.
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates
      .filter((candidate) => candidate.score >= candidates[0].score - 7)
      .slice(0, 4);
    const selected = best[this.spawnRng.int(best.length)];
    this.spawnHistory.set(selected.i, this.time);
    return selected.spawn;
  }
  update(dt) {
    super.update(dt);
    // Run after the shooting tick, so a lethal pellet cannot swap the model
    // before the old weapon emits its shot, shell and recoil events.
    const stage = Math.min(this.playerScore, GUN_GAME_LOADOUT.length - 1);
    if (stage > this.gunStage) {
      this.gunStage = stage;
      const weapons = this.world.weapons;
      weapons.switching = null;
      weapons.weapons[stage].reset();
      weapons.ads = weapons.adsSmooth = 0;
      weapons.startIndex = stage;
      weapons.selectImmediate(stage, this.world);
      weapons._ammo(this.world);
      this.world.emit("gunPromotion", { stage, name: weapons.weapon.def.name });
    }
    if (!this.freeSelection && this.playerScore >= GUN_GAME_FREE_KILLS) {
      this.freeSelection = true;
      this.world.emit("gunMastery", {});
    }
  }
  recordElimination(victim, killer) {
    if (this.finished) return;
    const fallen = this.standings.find((entry) => entry.id === victim);
    const scorer = this.standings.find((entry) => entry.id === killer);
    if (!fallen) return;
    fallen.deaths++;
    if (scorer && scorer !== fallen) scorer.kills++;
    this.playerScore = this.standings[0].kills;
    this.robotScore = Math.max(
      ...this.standings.slice(1).map((entry) => entry.kills),
    );
    this.deaths = this.standings[0].deaths;
    this.checkEnd();
  }
  checkEnd() {
    if (this.finished || !this.standings) return;
    const ranked = this.leaderboard;
    if (ranked[0].kills < FFA.target && this.time < FFA.duration) return;
    this.finished = true;
    const leaders = ranked.filter((entry) => entry.kills === ranked[0].kills);
    this.result =
      leaders.length > 1
        ? "DRAW"
        : leaders[0].id === "blue"
          ? "VICTORY"
          : "DEFEAT";
    this.winner = leaders.length > 1 ? null : leaders[0].name;
    this.world.emit("matchEnd", { result: this.result, winner: this.winner });
  }
}
