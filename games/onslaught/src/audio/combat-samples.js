// Near-perspective firearm recordings mastered into compact dry reports.
// Every ballistic family has two different discharges, not pitch-only variants.
const families = ["pistol", "smg", "rifle", "lmg", "marksman", "sniper", "shotgun"];
export const RECORDED_SFX = Object.freeze(Object.fromEntries([
  ...families.flatMap((family) => [family + "-a", family + "-b"]),
  "launcher", "mag-out", "mag-in", "bolt", "click",
  "hit", "hit-head", "kill", "kill-head",
].map((key) => [key, `/audio/${key}.wav?v=modern2`])));

const voice = (family, gain, lowpass = 16000, rate = 1) =>
  ({ keys: [family + "-a", family + "-b"], gain, lowpass, rate });
export const COMBAT_PROFILES = Object.freeze({
  pistol: voice("pistol", 0.82),
  smg: voice("smg", 0.67, 15000),
  mp5: voice("smg", 0.64, 12500, 1.025),
  ar: voice("rifle", 0.87),
  m4: voice("rifle", 0.87),
  dmr: voice("marksman", 0.96),
  lmg: voice("lmg", 0.9, 15000),
  sniper: voice("sniper", 1.0),
  shotgun: voice("shotgun", 0.96),
  rocket: { keys: ["launcher"], gain: 0.96, rate: 1, lowpass: 12000 },
});
