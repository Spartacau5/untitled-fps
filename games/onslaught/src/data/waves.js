// Wave composition. Pure: same wave number + same rng stream → same queue.

// Air support arrives late and stays a minority. The point of a flyer is that
// it changes where you look, not that it replaces the swarm - a wave of drones
// would be a different game, and the ground pressure is what makes looking up
// cost something.
export const DRONE_WAVE = 8;
export const GUNSHIP_WAVE = 12;

export function composeWave(wave, rng) {
  const t = wave,
    count = Math.min(6 + t * 5 + Math.floor(t * t * 0.45), 130),
    brutes = t >= 3 ? 1 + Math.floor((t - 3) / 2) + (t % 5 === 0 ? 2 : 0) : 0,
    spitters = t >= 2 ? Math.floor(count * 0.18) : 0,
    // One on its debut, so the wave it arrives in is where you learn what a
    // wasp is rather than where you are overwhelmed by four. Then one more
    // every third wave, capped low: they are meant to change where you look,
    // and the ground swarm is still what kills you.
    drones =
      t >= DRONE_WAVE ? Math.min(5, 1 + Math.floor((t - DRONE_WAVE) / 3)) : 0,
    // Same idea, slower still. One gunship is already a reason to move.
    gunships =
      t >= GUNSHIP_WAVE
        ? Math.min(3, 1 + Math.floor((t - GUNSHIP_WAVE) / 5))
        : 0,
    queue = [];
  for (let a = 0; a < count; a++) queue.push("runner");
  for (let a = 0; a < spitters; a++) queue[rng.int(count)] = "spitter";
  for (let a = 0; a < brutes; a++)
    queue[Math.floor(rng.range(count * 0.2, count * 0.9))] = "brute";
  // Drones are written last and over the back half of the queue, so a wave
  // opens on the ground and the sky arrives once the player is committed.
  for (let a = 0; a < drones; a++)
    queue[Math.floor(rng.range(count * 0.35, count * 0.95))] = "drone";
  for (let a = 0; a < gunships; a++)
    queue[Math.floor(rng.range(count * 0.5, count * 0.95))] = "missileDrone";
  const heavy = t % 5 === 0;
  return {
    queue: queue.reverse(),
    count,
    heavy,
    maxAlive: Math.min(14 + t * 4, 64),
    spawnInterval: Math.max(0.2, 1.1 - t * 0.06),
    banner: [
      "WAVE " + t,
      heavy ? "HEAVY PRESENCE DETECTED" : count + " HOSTILES INBOUND",
      heavy,
    ],
  };
}
