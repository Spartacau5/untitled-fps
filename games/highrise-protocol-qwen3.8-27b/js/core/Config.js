// Central tuning values for gunfeel / movement / balance.
// Tuning lives here so iteration is fast and consistent.
export const CFG = {
  // Weapon (F1)
  weapon: {
    name: 'MK-77',
    rpm: 700,                 // full-auto
    magSize: 30,
    damage: 34,               // body
    headMult: 6,              // H4: headshot one-shot-ish (34*6 = 204 > any hp)
    projectileSpeed: 220,     // m/s (hitscan but used for tracer lifetime)
    // F2 camera (aim) recoil — impulse-driven, two decoupled layers
    // (ported from the qwen3.8-max reference: recoil.js):
    //  (1) FAST layer: sharp kick, ~75% of it returns in ~120 ms
    //  (2) SLOW layer: residual drift ~400 ms that ACCUMULATES over
    //      consecutive shots (climb) — sustained fire leaves the aim
    //      off-target and the player fights it back down
    // The view kick is WEAK — the gun viewmodel absorbs the big visible
    // kick (vmKick/fireKick below), so the view stays controllable.
    viewKick: 1.55,           // rad/s total impulse per shot, split fast/slow
    viewFast: { k: 900, zeta: 0.833 },   // zeta~0.83: returns ~75% in ~120 ms
    viewSlow: { k: 55, zeta: 0.708 },    // zeta~0.71: residual drifts ~400 ms
    viewYawWander: 0.55,      // seeded gaussian horizontal wander fraction
    patternReset: 0.24,       // s without fire before the climb counter resets
    climbPerShot: 0.32,       // extra slow-layer impulse per consecutive shot
    climbMax: 3.0,
    firstShotMul: 1.6,        // viewmodel kick: first shot after reload is heavier
    adsRecoilFloor: 0.55,     // ADS reduces recoil ~45% max — never flattens it
    crouchRecoilReduce: 0.15,
    globalRecoilFloor: 0.45,  // hardest floor across all stances combined
    // F2 spread (cone, radians) — hip wide, ADS tight, crouch tighter
    spreadHip: 0.010,
    spreadADS: 0.0016,
    spreadCrouchADS: 0.0010,
    spreadCrouchHip: 0.007,
    spreadMoveAdd: 0.012,     // added while moving
    spreadAirMul: 2.2,
    // viewmodel kick
    vmKick: 0.16,
    vmRecoil: 0.035,
  },

  // ADS (A1) — buttery near-critical transition (reference: ads.js):
  // ~150 ms hip<->ADS, smooth, no cut, no bounce. Sensitivity scales with
  // zoom. FOV rides a spring so the zoom glides (reference: camera.js).
  ads: {
    fovHip: 75,
    fovADS: 55,
    transition: { k: 210, zeta: 0.966 },  // ~150 ms, near-critical
    // FOV rides a STIFF spring so the zoom tracks the pose blend in step
    // (~150 ms, no lag, no bounce). The solved reticle cannot drift, so a
    // fast FOV is safe — it moves the frame, never the aim.
    fov: { k: 400, zeta: 1.0 },
    sensMulADS: 0.72,                     // sensitivity scales with zoom
  },

  // LOOK-LAG INERTIA (reference: sway.js) — the core of a "normal" view.
  // The camera leads directly; the WEAPON is a heavy object that trails:
  // raw mouse delta feeds underdamped springs (zeta < 1 => overshoot +
  // micro-bounce), so a flick drags the gun behind with character. A
  // separate softer spring whips the muzzle, the gun banks into turns,
  // and a positional mass-shift sells weight. In ADS the springs get
  // stiffer/damped and amplitude scales DOWN to a hard 30% floor —
  // the sight trails and catches up faster, motion may shrink, never die.
  lookLag: {
    yaw:    { k: 900,  zeta: 0.517, impulse: 30, gain: 1.25, max: 0.13 }, // settle ~200 ms, ~7.5 deg
    pitch:  { k: 1250, zeta: 0.594, impulse: 24, gain: 0.95, max: 0.08 },
    muzzle: { k: 330,  zeta: 0.550, impulse: 13, gain: 0.6,  max: 0.055 }, // barrel whip
    roll:   { k: 72,   zeta: 0.736, rateGain: 0.055, max: 0.095, rateSmooth: 16 }, // bank into turn
    pos:    { k: 520,  zeta: 0.592, gainX: 0.10, gainY: 0.05 }, // mass shift (m per rad of drag)
    adsFloor: 0.30,       // sway amplitude floor in ADS — never 0
    adsKMul: 0.30,        // stiffness rises in ADS (tighter, faster catch-up)
    adsDMul: 0.45,        // damping rises in ADS
  },

  // Movement (M*)
  move: {
    walk: 6.0,
    sprint: 9.2,
    tacSprint: 11.5,
    crouchMul: 0.5,
    airControl: 0.62,
    groundAccel: 10,
    airAccel: 3.2,
    friction: 9,
    gravity: 22,
    jumpVel: 8.2,
    slideSpeed: 12.5,
    slideFriction: 3.5,
    crouchHeight: 1.4,
    standHeight: 1.8,
    eyeStand: 1.62,
    eyeCrouch: 1.0,
    crouchTime: 0.2,
    leanAmount: 0.55,
    leanTilt: 0.10,
    fovKickSprint: 5,
  },

  // Player
  player: {
    maxHp: 100,
    regenDelay: 4.0,
    regenRate: 22,
    radius: 0.42,
  },

  // Enemies (E1)
  enemy: {
    rusher: { hp: 40, speed: 5.2, damage: 12, range: 1.6, melee: true, color: 0x8a4b3a, score: 100 },
    gunner: { hp: 60, speed: 2.4, damage: 8, range: 26, fireRate: 1.4, color: 0x3a5a8a, score: 150 },
    heavy:  { hp: 160, speed: 1.6, damage: 22, range: 20, armor: 3, color: 0x6a6f78, score: 300 },
    reactionTime: 0.5,
  },

  // Waves (D1)
  waves: {
    firstWave: 6,
    growth: 3,                // enemies added per wave (roughly)
    maxEnemies: 40,
    breakTime: 4.0,           // breather between waves
    spawnInterval: 0.25,      // seconds between trickle spawns
  },

  // Action systems (D2)
  action: {
    comboWindow: 4.0,
    overdriveChain: 5,
    overdriveTime: 6.0,
    overdriveCooldown: 8.0,
  },

  // Performance (P1)
  perf: {
    maxBlood: 4000,
    maxDust: 1500,
    maxSparks: 1200,
    maxShells: 60,
    maxDecals: 120,
    maxRagdolls: 12,
    maxTracers: 60,
    maxDamageNumbers: 60,
    pixelRatioCap: 2,
  },

  // Quality (G3)
  quality: {
    low: false,
  },
};
