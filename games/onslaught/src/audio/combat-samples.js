// Authored FPS reports, preserving their designer's stereo layers and tails.
export const AUDIO_MIX_VERSION = "designed-fps-3";
const familyKeys = (family) =>
  ["a", "b", "c"].map((v) => `game-${family}-${v}`);
export const FOOTSTEP_KEYS = Object.freeze({
  boots: Array.from({ length: 8 }, (_, i) => `step-boots-${i}`),
  wood: Array.from({ length: 4 }, (_, i) => `step-wood-${i}`),
  metal: Array.from({ length: 4 }, (_, i) => `step-metal-${i}`),
});
export const RECORDED_SFX = Object.freeze(
  Object.fromEntries(
    [
      ...["pistol", "minigun", "rifle", "shotgun", "rlauncher"].flatMap(
        familyKeys,
      ),
      ...FOOTSTEP_KEYS.boots,
      ...FOOTSTEP_KEYS.wood,
      ...FOOTSTEP_KEYS.metal,
      "game-dry",
      "game-switch",
      "game-mag-out",
      "game-mag-in",
      "game-bolt",
      "hit",
      "hit-head",
      "kill",
      "kill-head",
    ].map((key) => [key, `/audio/${key}.wav?v=${AUDIO_MIX_VERSION}`]),
  ),
);

const voice = (family, gain, rate = 1) => ({
  keys: familyKeys(family),
  gain,
  lowpass: 18000,
  rate,
  groupLimit: 3,
});
export const COMBAT_PROFILES = Object.freeze({
  pistol: voice("pistol", 0.83),
  smg: voice("minigun", 0.66, 1.12),
  mp5: voice("minigun", 0.64, 1.14),
  ar: voice("minigun", 0.86),
  m4: voice("minigun", 0.86),
  dmr: voice("rifle", 0.88, 1.08),
  lmg: voice("minigun", 0.91, 0.87),
  sniper: voice("rifle", 0.98, 0.96),
  shotgun: voice("shotgun", 0.91),
  rocket: voice("rlauncher", 0.88),
});
