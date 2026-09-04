// Deterministic scripted input: cycles through moving, strafing, aiming,
// sprinting and crouching while firing, with periodic reloads, jumps and
// weapon switches. Look tracks the nearest live enemy when there is one (a
// pure function of world state) and sweeps otherwise, so identical worlds
// see identical input and the tape actually lands shots.
export function tapeFrame(tick, world) {
  const t = tick / 60;
  const phase = Math.floor(t / 5) % 6;
  let yaw = Math.PI + Math.sin(t * 0.7) * 1.2,
    pitch = Math.sin(t * 0.3) * 0.15;
  if (world) {
    const p = world.player;
    let best = null,
      bd = 1 / 0;
    for (const e of world.enemies.list) {
      if (e.state === "die" || e.state === "spawn") continue;
      const d = Math.hypot(e.pos.x - p.pos.x, e.pos.z - p.pos.z);
      d < bd && ((bd = d), (best = e));
    }
    if (best) {
      const dx = best.pos.x - p.pos.x,
        dz = best.pos.z - p.pos.z,
        dy = best.pos.y + 1.0 * best.scale - p.camPos.y;
      ((yaw = Math.atan2(-dx, -dz)), (pitch = Math.atan2(dy, bd)));
    }
  }
  return {
    move: {
      x: phase === 1 ? 1 : phase === 3 ? -1 : 0,
      y: phase === 0 || phase === 4 ? 1 : 0,
    },
    yaw,
    pitch,
    fire: tick % 4 === 0 && phase !== 5,
    fireHeld: phase !== 5,
    ads: phase === 2,
    reload: tick % 600 === 0 && tick > 0,
    sprint: phase === 4,
    jump: tick % 300 === 0 && tick > 0,
    crouch: phase === 5,
    crouchPressed: tick % 300 === 150,
    switchTo: tick % 900 === 0 && tick > 0 ? Math.floor(t / 15) % 3 : -1,
    swapLast: !1,
    wheel: 0,
  };
}
