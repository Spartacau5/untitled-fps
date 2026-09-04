// Simulation → presentation event types. The sim never touches audio, HUD,
// particles or meshes; it pushes these onto `world.events` and the Game drains
// them once per frame. Player events reuse the same strings the Player pushes.

// player
export const EV_JUMP = "jump";
export const EV_LAND = "land"; // { strength }
export const EV_STEP = "step"; // { sprint }
export const EV_SLIDE = "slide";
export const EV_HURT = "hurt"; // { amount, angle, by: enemy kind | "spit" }
export const EV_DEAD = "dead";

// weapons
export const EV_SHOT = "shot"; // { def, index }
export const EV_TRACER = "tracer"; // { end, def }
export const EV_HIT = "hit"; // { point, dir, head, killed, kind, damage }
export const EV_IMPACT = "impact"; // { point, normal, def }
export const EV_DRY_FIRE = "dryFire";
export const EV_EJECT = "eject"; // { shell }
export const EV_PUMP = "pump";
export const EV_RELOAD_STAGE = "reloadStage"; // { stage }
export const EV_SWITCH = "switch"; // { index }
export const EV_AMMO = "ammo"; // { mag, reserve, magSize }

// enemies
// `type` is reserved for the event name, so enemy types travel as `kind`.
export const EV_SPAWN = "spawn"; // { pos, kind, big }
export const EV_GROWL = "growl"; // { pos, big }
export const EV_KILL = "kill"; // { enemy, head, points, streak, mult }
export const EV_SLAM = "slam"; // { pos, dist }
export const EV_SPIT = "spit"; // { pos }
export const EV_PROJECTILE_HIT = "projectileHit"; // { pos }

// match flow
export const EV_WAVE_START = "waveStart"; // { wave, count, heavy }
export const EV_WAVE_CLEAR = "waveClear"; // { wave, bonus }
export const EV_PICKUP = "pickup"; // { pos }
export const EV_PICKUP_EXPIRE = "pickupExpire";
