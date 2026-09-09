// Gameplay stats only. Body/glow colors live in theme.enemies and are read by
// render/enemy-view.js, so the sim stays free of presentation imports.
//
// `score` and `xp` are deliberately two numbers, not one scaled from the other.
// Score is what the daily leaderboard ranks you on; xp is what buys guns. They
// answer to different pressures - a board wants spectacle to pay, progression
// wants a steady clip - so tuning one must never drag the other with it.
export const ENEMIES = {
  runner: {
    key: "runner",
    name: "HUSK",
    hp: 72,
    // Faster than the player's 5.3 walk so they still force movement, but far
    // enough under the 7.7 sprint that breaking contact is a real option.
    speed: 6.0,
    scale: 1,
    damage: 12,
    range: 1.9,
    cooldown: 1.05,
    windup: 0.3,
    swing: 0.5,
    score: 100,
    xp: 10,
    radius: 0.36,
    mass: 1,
    ranged: !1,
    big: !1,
    slam: !1,
    proportions: {
      torso: [0.42, 0.5, 0.26],
      hips: [0.34, 0.2, 0.24],
      head: 0.24,
      armW: 0.11,
      armUL: 0.32,
      armLL: 0.34,
      legW: 0.14,
      legUL: 0.42,
      legLL: 0.44,
      shoulder: 0.27,
      lean: 0.38,
      armsForward: !0,
    },
  },
  brute: {
    key: "brute",
    name: "BEHEMOTH",
    hp: 640,
    speed: 3.7,
    scale: 1.72,
    damage: 34,
    range: 2.8,
    cooldown: 2.2,
    windup: 0.4,
    swing: 0.9,
    chargeSpeed: 10,
    chargeRange: 16,
    slamCommit: 5,
    chargeMaxS: 2.2,
    slamRadius: 6,
    score: 400,
    xp: 35,
    radius: 0.64,
    mass: 6,
    ranged: !1,
    big: !0,
    slam: !0,
    proportions: {
      torso: [0.62, 0.56, 0.38],
      hips: [0.44, 0.22, 0.3],
      head: 0.24,
      armW: 0.19,
      armUL: 0.4,
      armLL: 0.44,
      legW: 0.21,
      legUL: 0.4,
      legLL: 0.42,
      shoulder: 0.38,
      lean: 0.22,
      armsForward: !1,
      spikes: !0,
    },
  },
  spitter: {
    key: "spitter",
    name: "SPITTER",
    hp: 120,
    speed: 4.4,
    scale: 1.1,
    damage: 14,
    range: 0,
    cooldown: 1.5,
    windup: 0.35,
    swing: 0.4,
    score: 200,
    xp: 18,
    radius: 0.38,
    mass: 1.5,
    ranged: !0,
    big: !1,
    slam: !1,
    standoff: 14,
    projSpeed: 26,
    proportions: {
      torso: [0.4, 0.46, 0.3],
      hips: [0.34, 0.2, 0.26],
      head: 0.26,
      armW: 0.1,
      armUL: 0.3,
      armLL: 0.3,
      legW: 0.13,
      legUL: 0.4,
      legLL: 0.42,
      shoulder: 0.26,
      lean: 0.48,
      armsForward: !1,
      sac: !0,
    },
  },
  // --- flyers ---------------------------------------------------------------
  // Drones do not walk, so `proportions` is absent and the rig fields with it.
  // What they carry instead: `fly` (the sim keeps them at flyHeight above the
  // ground and steers them over low cover), a sphere hitbox of `radius`, and a
  // core the size of `coreRadius` that counts as a headshot.
  //
  // The gunner arrives at wave 8. Quick and hard to lead - the answer to a
  // player who has learned to hold a lane at head height and never look up. It
  // fires a flat, fast bolt in short bursts, so it punishes standing still
  // without deleting anyone who moves.
  //
  // Sized up from its first pass: at radius 0.34 it was a 0.68 m target at a
  // 16 m standoff, which was not "hard to lead" so much as hard to touch. The
  // hitbox is radius * scale, so this is 0.58 m - roughly triple the
  // cross-section, and still barely a third of the gunship's.
  drone: {
    key: "drone",
    name: "WASP DRONE",
    hp: 90,
    speed: 9.2,
    scale: 1.25,
    damage: 9,
    range: 0,
    cooldown: 2.1,
    windup: 0.28,
    swing: 0.5,
    score: 250,
    xp: 22,
    radius: 0.46,
    coreRadius: 0.23,
    mass: 0.8,
    ranged: !0,
    big: !1,
    slam: !1,
    fly: !0,
    // High enough to clear every barrier and read against the sky, low enough
    // that a hipfire flick can still reach it.
    flyHeight: 4.6,
    bobAmp: 0.35,
    bobRate: 2.4,
    // Circles this far out rather than closing: a flyer that touches you has
    // no counterplay, and the whole point is that you have to look up.
    standoff: 16,
    strafe: 1.35,
    projSpeed: 62,
    burst: 3,
    burstGap: 0.11,
  },
  // The wave 12 answer to players who ignore the gunners: slower, tougher, and
  // it lobs a missile whose blast only hurts you. Enemies are deliberately
  // immune to it - a drone that could clear its own wave would be a gift, not
  // a threat.
  missileDrone: {
    key: "missileDrone",
    name: "HORNET GUNSHIP",
    hp: 340,
    speed: 5.4,
    scale: 1.55,
    damage: 26,
    range: 0,
    cooldown: 3.4,
    windup: 0.55,
    swing: 0.7,
    score: 550,
    xp: 45,
    radius: 0.62,
    coreRadius: 0.3,
    mass: 2.4,
    ranged: !0,
    big: !0,
    slam: !1,
    fly: !0,
    flyHeight: 6.2,
    bobAmp: 0.22,
    bobRate: 1.5,
    standoff: 20,
    strafe: 0.8,
    projSpeed: 21,
    missile: !0,
    // Small enough that the blast is a reason to move, not an unavoidable tax.
    splashRadius: 3.6,
    splashMin: 0.35,
  },
};
export const MAX_PER_TYPE = 128;
