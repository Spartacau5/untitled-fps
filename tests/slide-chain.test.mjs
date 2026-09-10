import assert from "node:assert/strict";
import { test } from "node:test";
import { Vector3 } from "three";
import { World } from "../games/onslaught/src/sim/world.js";

const input = (over = {}) => ({
  move: { x: 0, y: 0 },
  fire: !1,
  fireHeld: !1,
  ads: !1,
  reload: !1,
  sprint: !1,
  jump: !1,
  crouch: !1,
  crouchPressed: !1,
  switchTo: -1,
  swapLast: !1,
  wheel: 0,
  ...over,
});

const DT = 1 / 60;
// Face whichever way has the most room to sprint into. Without this the
// harness measures how far it is to the nearest barrier rather than anything
// about the input chain - the first run of these tests had the player hit a
// wall four frames into the jump and stop dead at 0 m/s.
function clearHeading(w) {
  let best = 0,
    bestDist = -1;
  for (let i = 0; i < 24; i++) {
    const yaw = (i / 24) * Math.PI * 2;
    const dir = new Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const hit = w.arena.raycast(w.player.camPos, dir, 45);
    const d = hit ? hit.dist : 45;
    if (d > bestDist) ((bestDist = d), (best = yaw));
  }
  w.player.yaw = best;
  return bestDist;
}

const run = () => {
  const w = new World({ seed: 1, noSpawn: !0 });
  w.startRun();
  const room = clearHeading(w);
  assert.ok(room > 18, `only ${room.toFixed(1)}m of clear ground to sprint`);
  return w;
};
// Forward at a sprint. `move.y` is the forward axis the player reads.
const sprintFwd = (over = {}) =>
  input({ move: { x: 0, y: 1 }, sprint: !0, ...over });

// Get up to sprint speed on the ground.
function windUp(w, ticks = 60) {
  for (let i = 0; i < ticks; i++) w.step(DT, sprintFwd());
  return w;
}

// Sprint, jump, then press crouch `delay` seconds into the jump, holding it
// from then on. Returns whether a slide ever came out, and when.
function jumpThenCrouch(delay, { hold = true, seconds = 3 } = {}) {
  const w = windUp(run());
  w.step(DT, sprintFwd({ jump: !0 }));
  let t = 0,
    pressed = !1,
    slid = !1,
    slideAt = 0,
    peakSpeed = 0;
  for (let i = 0; i < seconds * 60 && !slid; i++) {
    t += DT;
    const press = !pressed && t >= delay;
    if (press) pressed = !0;
    w.step(
      DT,
      sprintFwd({
        crouchPressed: press,
        crouch: press || (hold && pressed),
      }),
    );
    if (w.player.sliding) ((slid = !0), (slideAt = t));
    peakSpeed = Math.max(peakSpeed, w.player.speed);
  }
  return { slid, slideAt, peakSpeed, w };
}

test("one crouch press anywhere in a jump still lands the slide", () => {
  // A sprint jump is airborne for roughly two thirds of a second. Press
  // crouch at any point in it - on the way up, at the apex, on the way down -
  // and the slide has to come out on touchdown. Before buffering, only a
  // press that happened to fall on the exact landing tick did anything, which
  // is why it felt like you had to mash the key.
  for (const delay of [0.02, 0.1, 0.2, 0.3, 0.4, 0.5]) {
    const r = jumpThenCrouch(delay);
    assert.ok(r.slid, `no slide when crouch came ${delay}s into the jump`);
  }
});

test("a single press is one slide, not a slide every frame it could be", () => {
  const w = windUp(run());
  w.step(DT, sprintFwd({ jump: !0 }));
  let slides = 0,
    was = !1;
  for (let i = 0; i < 180; i++) {
    // Press once, ten frames in, then just hold.
    const press = i === 10;
    w.step(DT, sprintFwd({ crouchPressed: press, crouch: press || i >= 10 }));
    (!was && w.player.sliding && slides++, (was = w.player.sliding));
  }
  assert.equal(slides, 1, `one press produced ${slides} slides`);
});

test("the slide still carries the speed that makes the chain worth doing", () => {
  const r = jumpThenCrouch(0.15);
  assert.ok(r.slid);
  // Sprint is 7.7; a slide launches at max(10.5, speed + 3).
  assert.ok(
    r.peakSpeed > 9.5,
    `slide only reached ${r.peakSpeed.toFixed(1)} m/s`,
  );
});

test("crouch alone never becomes a slide", () => {
  // Walking, not sprinting: holding crouch has to crouch, full stop.
  const w = run();
  for (let i = 0; i < 40; i++) w.step(DT, input({ move: { x: 0, y: 1 } }));
  for (let i = 0; i < 60; i++)
    w.step(
      DT,
      input({ move: { x: 0, y: 1 }, crouchPressed: i === 0, crouch: !0 }),
    );
  assert.equal(w.player.sliding, false, "a walk must not slide");
  assert.equal(w.player.crouch, true, "it must crouch instead");
});

test("a crouch pressed and long forgotten does not slide later", () => {
  // Press crouch standing still, release, then sprint. The stale press must
  // not fire a slide the moment speed arrives.
  const w = run();
  w.step(DT, input({ crouchPressed: !0, crouch: !0 }));
  for (let i = 0; i < 30; i++) w.step(DT, input({ crouch: !0 }));
  for (let i = 0; i < 90; i++) {
    w.step(DT, sprintFwd());
    assert.equal(w.player.sliding, false, "a stale press slid at tick " + i);
  }
});

test("stepping off a ledge while walking does not slide on landing", () => {
  // The speed gate, not the sprint gate: a fall is airborne long enough that
  // sprintRecent alone would let a walk through.
  const w = run();
  for (let i = 0; i < 40; i++) w.step(DT, input({ move: { x: 0, y: 1 } }));
  w.player.pos.y += 4;
  w.player.onGround = !1;
  for (let i = 0; i < 120; i++)
    w.step(
      DT,
      input({ move: { x: 0, y: 1 }, crouchPressed: i === 0, crouch: !0 }),
    );
  assert.equal(w.player.sliding, false, "a walking drop must not slide");
});

test("the sprint-jump-slide chain is deterministic", () => {
  const play = () => {
    const w = windUp(run());
    w.step(DT, sprintFwd({ jump: !0 }));
    for (let i = 0; i < 200; i++)
      w.step(
        DT,
        sprintFwd({ crouchPressed: i === 12, crouch: i >= 12, jump: i === 60 }),
      );
    const p = w.player;
    return [p.pos.x, p.pos.y, p.pos.z, p.vel.x, p.vel.z, p.slideT]
      .map((n) => n.toFixed(6))
      .join(",");
  };
  assert.equal(play(), play());
});
