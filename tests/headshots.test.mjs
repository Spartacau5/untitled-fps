import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { ENEMIES } from "../games/onslaught/src/data/enemies.js";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";
import { rigMetrics } from "../games/onslaught/src/sim/enemies.js";
import { HEAD_SCORE_MULT, World } from "../games/onslaught/src/sim/world.js";

// Sweeps a grid of rays over a body from a player-height eye and reports what
// fraction of the hits that land come back flagged as head. This is the only
// honest way to ask "can you headshot this thing" - the hitboxes are built
// from proportions at runtime, so reading the numbers off the data tells you
// nothing about whether one shape swallows another.
function reach(type, dist = 10) {
  const w = new World({ seed: 5, noSpawn: !0 });
  w.startRun();
  const e = w.enemies.spawn(type, w.arena.gates[0], 1, w);
  ((e.state = "chase"),
    (e.moveBlend = 0),
    (e.headBob = 0),
    (e.scale = ENEMIES[type].scale),
    (e.yaw = Math.PI));
  const P = w.player.pos;
  e.pos.set(P.x, w.arena.groundHeight(P.x, P.z), P.z + dist);
  if (e.fly) e.pos.y += e.def.flyHeight;
  const eye = new Vector3(P.x, P.y + 1.6, P.z);
  const m = w.enemies.metrics[type];
  const top = e.fly
    ? e.pos.y + e.def.radius * e.scale
    : e.pos.y + m.headY * e.scale + 0.6;
  const wide = (e.fly ? e.def.radius : 1.2) * e.scale;
  let hits = 0,
    heads = 0;
  for (let iy = 0; iy <= 120; iy++)
    for (let ix = -30; ix <= 30; ix++) {
      const dir = new Vector3(
        e.pos.x + (wide * ix) / 30 - eye.x,
        e.pos.y + ((top - e.pos.y) * iy) / 120 - eye.y,
        e.pos.z - eye.z,
      ).normalize();
      const hit = w.enemies.raycast(eye, dir, 240);
      if (!hit) continue;
      (hits++, hit.head && heads++);
    }
  return { hits, heads, frac: hits ? heads / hits : 0 };
}

const WALKERS = Object.keys(ENEMIES).filter((k) => !ENEMIES[k].fly);
const FLYERS = Object.keys(ENEMIES).filter((k) => ENEMIES[k].fly);

test("every walking enemy can actually be headshot", () => {
  for (const type of WALKERS) {
    const r = reach(type);
    assert.ok(r.hits > 100, `${type}: only ${r.hits} rays connected at all`);
    // The brute used to be exactly zero - its torso capsule's top cap reached
    // 3.20 m while its head sphere ended at 3.17 m, so the torso enclosed the
    // head and the nearest-surface tie-break picked the torso every time. It
    // could not be headshot by anyone, ever, and nothing caught it because
    // nothing had ever asked.
    assert.ok(
      r.frac > 0.04,
      `${type}: only ${(r.frac * 100).toFixed(1)}% of hits are heads`,
    );
  }
});

test("a torso capsule never towers over the head it sits under", () => {
  for (const type of WALKERS) {
    const d = ENEMIES[type],
      p = d.proportions,
      o = d.scale,
      m = rigMetrics(p);
    const torsoR = Math.max(p.torso[0], p.torso[2]) * 0.52 * o;
    const headTop = (m.headY + p.head * 0.64) * o;
    // The capsule's surface, not its segment: a capsule reaches its own radius
    // past each end. Whatever the segment does, the shell has to stop below
    // the top of the head or the head is unreachable.
    assert.ok(
      m.torsoTop * o < headTop,
      `${type}: torso surface at ${(m.torsoTop * o).toFixed(2)}m is not under the head top ${headTop.toFixed(2)}m`,
    );
    assert.ok(torsoR > 0);
  }
});

test("a drone is all body, however precisely you hit it", () => {
  for (const type of FLYERS) {
    const r = reach(type);
    assert.ok(r.hits > 100, `${type} could not be hit at all`);
    assert.equal(
      r.heads,
      0,
      `${type} paid a head bonus on ${r.heads} of ${r.hits} hits`,
    );
  }
});

test("a headshot does more damage on every gun that is meant to reward one", () => {
  // Damage already multiplies per weapon; this pins that the table means it.
  const rewarding = WEAPONS.filter((w) => w.headMult > 1);
  assert.ok(rewarding.length >= WEAPONS.length - 3, "most guns should reward");
  for (const w of WEAPONS)
    assert.ok(w.headMult >= 1, `${w.key} punishes a headshot`);
  // The two that do not are the ones with no single point of impact.
  for (const w of WEAPONS.filter((x) => x.headMult === 1))
    assert.ok(
      w.fire === "cone" || w.blastRadius > 0,
      `${w.key} has no headMult but is a normal gun`,
    );
});

test("a headshot kill scores a multiple, not a flat tip", () => {
  const kill = (head) => {
    const w = new World({ seed: 2, noSpawn: !0 });
    w.startRun();
    const e = w.enemies.spawn("brute", w.arena.gates[0], 1, w);
    w.drainEvents();
    const before = w.score;
    w.onKill(e, head);
    w.drainEvents();
    return w.score - before;
  };
  const body = kill(!1),
    head = kill(!0);
  assert.ok(body > 0);
  assert.equal(head, Math.round(body * HEAD_SCORE_MULT));
  // The point of the change: the bonus has to scale with what you dropped.
  // A flat tip was half a husk and an eighth of a brute, so the harder the
  // target the less a better shot was worth.
  const huskBody = (() => {
    const w = new World({ seed: 2, noSpawn: !0 });
    w.startRun();
    const e = w.enemies.spawn("runner", w.arena.gates[0], 1, w);
    w.drainEvents();
    const before = w.score;
    w.onKill(e, !0);
    w.drainEvents();
    return w.score - before;
  })();
  assert.ok(
    head - body > huskBody - Math.round(huskBody / HEAD_SCORE_MULT),
    "a brute's headshot bonus must exceed a husk's",
  );
});
