import { buildDmrModel } from "./dmr.js";
import { buildFlameModel } from "./flame.js";
import { buildLmgModel } from "./lmg.js";
import { buildPistolModel } from "./pistol.js";
import { buildRifleModel } from "./rifle.js";
import { buildShotgunModel } from "./shotgun.js";
import { buildSmgModel } from "./smg.js";
import { buildSniperModel } from "./sniper.js";

// One builder per weapon key in data/weapons.js. Builders that mount a lens
// take the shared reticle material; the rest ignore the argument.
const BUILDERS = {
  ar: buildRifleModel,
  shotgun: buildShotgunModel,
  dmr: buildDmrModel,
  pistol: buildPistolModel,
  smg: buildSmgModel,
  lmg: buildLmgModel,
  sniper: buildSniperModel,
  flame: buildFlameModel,
};

export function hasWeaponModel(key) {
  return Object.prototype.hasOwnProperty.call(BUILDERS, key);
}

export function buildWeaponModel(key, lensMaterial) {
  const build = BUILDERS[key];
  if (!build) throw new Error(`no viewmodel for weapon "${key}"`);
  return build(lensMaterial);
}
