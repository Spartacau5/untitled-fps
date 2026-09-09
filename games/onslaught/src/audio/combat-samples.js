// Historic USC/Sunset Editorial recordings, trimmed offline. See public/audio
// for exact provenance. Profiles are designed mixes, not eight unique guns.
export const RECORDED_SFX = Object.freeze(Object.fromEntries([
  "pistol", "rifle-a", "rifle-b", "marksman-a", "marksman-b", "shotgun",
  "launcher", "mag-out", "mag-in", "bolt", "click",
].map((key) => [key, `/audio/${key}.wav`])));

export const COMBAT_PROFILES = Object.freeze({
  pistol: { keys: ["pistol"], gain: 0.82, rate: 1.08, lowpass: 14000 },
  smg: { keys: ["pistol"], gain: 0.57, rate: 1.2, lowpass: 10500 },
  mp5: { keys: ["pistol"], gain: 0.54, rate: 1.16, lowpass: 9000 },
  ar: { keys: ["rifle-a", "rifle-b"], gain: 0.87, rate: 1.02, lowpass: 15500 },
  m4: { keys: ["rifle-a", "rifle-b"], gain: 0.84, rate: 1.08, lowpass: 15000 },
  dmr: { keys: ["marksman-a", "marksman-b"], gain: 0.96, rate: 1.01, lowpass: 14000 },
  lmg: { keys: ["rifle-a", "rifle-b"], gain: 0.94, rate: 0.9, lowpass: 11000 },
  sniper: { keys: ["marksman-a", "marksman-b"], gain: 1.05, rate: 0.85, lowpass: 13500 },
  shotgun: { keys: ["shotgun"], gain: 0.96, rate: 1, lowpass: 12500 },
  rocket: { keys: ["launcher"], gain: 0.91, rate: 0.9, lowpass: 7000 },
});
