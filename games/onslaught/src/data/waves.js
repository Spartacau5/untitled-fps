// Wave composition. Pure: same wave number + same rng stream → same queue.
export function composeWave(wave, rng) {
  const t = wave,
    count = Math.min(6 + t * 5 + Math.floor(t * t * 0.45), 130),
    brutes =
      t >= 3 ? 1 + Math.floor((t - 3) / 2) + (t % 5 === 0 ? 2 : 0) : 0,
    spitters = t >= 2 ? Math.floor(count * 0.18) : 0,
    queue = [];
  for (let a = 0; a < count; a++) queue.push("runner");
  for (let a = 0; a < spitters; a++) queue[rng.int(count)] = "spitter";
  for (let a = 0; a < brutes; a++)
    queue[Math.floor(rng.range(count * 0.2, count * 0.9))] = "brute";
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
