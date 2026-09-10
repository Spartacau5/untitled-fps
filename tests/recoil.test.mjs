import assert from "node:assert/strict";
import { test } from "node:test";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";
import { World } from "../games/onslaught/src/sim/world.js";

const DEG = 180 / Math.PI;
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
const by = (k) => WEAPONS.find((w) => w.key === k);
const DT = 1 / 60;

// Hold the trigger down with one gun and report where the aim ended up.
// `pitch` is the part that stays - the climb a player has to pull against -
// and `wander` is how far the horizontal strayed at its worst.
function magDump(key, { ads = !1, shots = null } = {}) {
  const w = new World({ seed: 4, noSpawn: !0, loadout: [key], startKey: key });
  w.startRun();
  const p = w.player,
    def = by(key);
  const want = shots ?? def.magSize;
  const startPitch = p.pitch;
  let fired = 0,
    maxYaw = 0,
    lastMag = w.weapons.weapon.mag;
  for (let i = 0; i < 60 * 30 && fired < want; i++) {
    w.step(DT, input({ fire: !0, fireHeld: !0, ads }));
    const mag = w.weapons.weapon.mag;
    if (mag < lastMag) ((fired += lastMag - mag), (lastMag = mag));
    maxYaw = Math.max(maxYaw, Math.abs(p.recoilY));
    if (w.weapons.weapon.reloading) break;
  }
  return {
    fired,
    pitch: (p.pitch - startPitch) * DEG,
    wander: maxYaw * DEG,
  };
}

const AUTOS = ["mp5", "m4", "smg", "ar", "lmg"];

test("an automatic climbs enough over a magazine to need pulling down", () => {
  for (const key of AUTOS) {
    const r = magDump(key);
    assert.ok(r.fired > by(key).magSize * 0.8, `${key}: only fired ${r.fired}`);
    // Before this pass the whole roster sat under eight degrees a magazine,
    // which is close enough to nothing that holding one on target took no
    // skill. Six is the floor now, and that is the forgiving gun.
    assert.ok(
      r.pitch > 5,
      `${key}: only ${r.pitch.toFixed(1)} deg of permanent climb per mag`,
    );
    // And not so much that it is unusable rather than difficult.
    assert.ok(r.pitch < 45, `${key}: ${r.pitch.toFixed(1)} deg is a joke`);
  }
});

test("the automatics are ordered by how hard they are to hold", () => {
  // Character, not exact numbers: this is the thing a player learns, and it
  // has to stay true when the values get nudged.
  const perSecond = (k) => {
    const d = by(k);
    return d.recoilPitch * d.recoilPermanent * (d.rpm / 60);
  };
  assert.ok(perSecond("mp5") < perSecond("m4"), "the MP5 is the forgiving one");
  assert.ok(perSecond("m4") < perSecond("ar"), "the M4 is the tamer rifle");
  assert.ok(perSecond("ar") > perSecond("lmg"), "the rifle climbs fastest");
  // The SMG kicks least per shot and wanders most, which is its whole
  // identity: lethal close, a handful at range.
  const perShot = (k) => by(k).recoilPitch * by(k).recoilPermanent;
  assert.ok(perShot("smg") < perShot("ar"), "smallest per-shot kick");
  assert.ok(
    by("smg").recoilYaw > by("ar").recoilYaw &&
      by("smg").recoilYaw > by("lmg").recoilYaw,
    "and the widest horizontal wander",
  );
});

test("every automatic wanders horizontally, on its own learnable shape", () => {
  for (const key of AUTOS) {
    const r = magDump(key, { shots: 20 });
    assert.ok(
      r.wander > 0.3,
      `${key}: only ${r.wander.toFixed(2)} deg of horizontal - nothing to learn`,
    );
    // The pattern is what makes it learnable rather than random: a fixed
    // shape walked one step per shot, the same every time.
    const pat = by(key).pattern;
    assert.ok(pat && pat.length >= 12, `${key} has no recoil pattern`);
    assert.ok(
      Math.max(...pat) > 0.15 && Math.min(...pat) < -0.15,
      `${key}'s pattern only pulls one way`,
    );
  }
});

test("aiming down the sights genuinely helps", () => {
  for (const key of AUTOS) {
    const hip = magDump(key, { shots: 20 }).pitch;
    const aimed = magDump(key, { shots: 20, ads: !0 }).pitch;
    assert.ok(
      aimed < hip * 0.95,
      `${key}: ${aimed.toFixed(1)} aimed against ${hip.toFixed(1)} hip - ADS buys nothing`,
    );
    assert.ok(by(key).adsRecoilReduce > 0.2);
  }
});

test("two quick marksman shots fight you", () => {
  // The specific ask. A DMR is semi-auto, so the challenge is not a magazine
  // climbing - it is that the second shot of a fast pair is not where the
  // first one was.
  const w = new World({
    seed: 4,
    noSpawn: !0,
    loadout: ["dmr"],
    startKey: "dmr",
  });
  w.startRun();
  const p = w.player;
  const aimAt = () => (p.pitch + p.recoilP) * DEG;
  const before = aimAt();
  w.step(DT, input({ fire: !0, fireHeld: !0 }));
  const afterOne = aimAt();
  assert.ok(
    afterOne - before > 1.5,
    `one shot moved the aim ${(afterOne - before).toFixed(2)} deg`,
  );
  // Fire again as soon as the action allows. The spring has shed only part of
  // the first shot by then, so the two stack.
  let waited = 0;
  while (!w.weapons.canFire?.(w.weapons.weapon) && waited < 60) {
    w.step(DT, input({ fireHeld: !0 }));
    waited++;
    if (w.weapons.weapon.cooldown <= 0) break;
  }
  w.step(DT, input({ fire: !0, fireHeld: !0 }));
  const afterTwo = aimAt();
  assert.ok(
    afterTwo > afterOne,
    `the second shot did not add: ${afterOne.toFixed(2)} then ${afterTwo.toFixed(2)}`,
  );
  // Permanent climb per shot, which is what stops a double tap landing twice
  // in the same place without a correction.
  const d = by("dmr");
  assert.ok(
    d.recoilPitch * d.recoilPermanent > 1.5,
    `only ${(d.recoilPitch * d.recoilPermanent).toFixed(2)} deg stays per shot`,
  );
});

test("the launcher and the flamethrower are left alone", () => {
  // One is a single shot you commit to, the other has no point of impact to
  // pull off target, so recoil mastery means nothing for either.
  assert.equal(by("rocket").recoilPitch, 4.2);
  assert.equal(by("rocket").recoilPermanent, 0.5);
  assert.equal(by("flame").recoilPitch, 0.12);
  assert.equal(by("flame").recoilPermanent, 0.15);
  // And the flamethrower stays the calmest thing in the game to hold.
  const perSecond = (k) =>
    by(k).recoilPitch * by(k).recoilPermanent * (by(k).rpm / 60);
  for (const k of AUTOS)
    assert.ok(perSecond("flame") < perSecond(k), `flame kicks more than ${k}`);
});

test("recoil stays deterministic", () => {
  const run = () => {
    const r = magDump("ar", { shots: 25 });
    return `${r.pitch.toFixed(6)}/${r.wander.toFixed(6)}`;
  };
  assert.equal(run(), run());
});
