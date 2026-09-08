import { TeamDeathmatch } from "./team-deathmatch.js";
import { TDM } from "../data/midtown.js";

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
    this.world.player.maxHp = 100;
    this.world.player.groundedCombat = true;
    super.placePlayer();
    this.world._lastAttacker = null;
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
