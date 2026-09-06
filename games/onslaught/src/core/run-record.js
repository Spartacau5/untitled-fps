import { GAME_VERSION } from "../data/version.js";

export function captureRun({
  world,
  seed,
  startedAt,
  endedAt,
  settings,
  result,
}) {
  return {
    v: 1,
    game: GAME_VERSION,
    seed,
    loadout: (world.weapons ? world.weapons.loadout : []).map((w) => w.key),
    startedAt,
    endedAt,
    settings,
    summary: {
      ...world.stats.summary(),
      result,
      wave: world.wave,
      score: world.score,
      kills: world.kills,
    },
  };
}
