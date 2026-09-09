// How far the sniper's optic has taken over the view, 0..1.
//
// The rifle already zooms hard on ADS (adsFov 20), but nothing marked it as
// looking through glass: the model stayed in frame and the view was a plain
// crop of the world. This drives the optic overlay.
//
// It is deliberately not a threshold. Latching the scope on at some ADS value
// makes it snap, and fading it linearly from zero blacks the screen out while
// the rifle is still coming up, so it is remapped to close over the last part
// of the blend and smoothed at both ends.
//
// Reloading, switching and death drop it outright. All three hide the rifle
// while the optic is up, and riding the ADS decay in those cases would swallow
// the first fraction of the reload animation and then pop the gun back. The
// overlay carries a short opacity transition so this reads as a fade, not a
// cut - which matters more now an empty magazine reloads on its own.
export function scopeAmount(weapons, player) {
  if (!weapons || !player) return 0;
  if (weapons.weapon.def.key !== "sniper" || player.dead) return 0;
  if (weapons.switching || weapons.weapon.reloading) return 0;
  const t = (weapons.adsSmooth - 0.55) / 0.45;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}
