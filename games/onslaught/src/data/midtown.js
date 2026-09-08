// Original compact NYC layout, in metres. Shared by collision, navigation,
// map display and art: every playable solid has exactly one source of truth.
const block = (id, kind, x, z, w, d, h, yaw = 0) => ({
  id,
  kind,
  x,
  z,
  w,
  d,
  h,
  yaw,
});
export const MIDTOWN = {
  name: "MIDTOWN CROSSING",
  bounds: { x: 27, z: 35 },
  solids: [
    block("west-edge", "facade", -28, 0, 2, 72, 14),
    block("east-edge", "facade", 28, 0, 2, 72, 16),
    block("north-edge", "facade", 0, -36, 58, 2, 12),
    block("south-edge", "facade", 0, 36, 58, 2, 12),
    ...[-1, 1].flatMap((side) =>
      [-28, -2, 26].map((z) =>
        block(`lamp-${side}-${z}`, "lamp", side * 26.1, z, 0.26, 0.26, 4.6),
      ),
    ),
    // Two broken spines make three lanes; the gaps are cross-streets.
    block("theater", "theater", -13, -18, 9, 16, 8),
    block("deli", "shop", -13, 3, 9, 12, 5),
    block("stage-door", "shop", -13, 23, 9, 12, 6),
    block("hotel", "shop", 13, -22, 9, 10, 9),
    block("newsstand", "shop", 13, -3, 9, 14, 4),
    block("arcade", "shop", 13, 21, 9, 16, 7),
    block("uptown-bus", "bus", -2.7, -7, 2.7, 10.5, 3.1, -0.22),
    block("downtown-bus", "bus", 3.2, 8, 2.7, 10.5, 3.1, -0.22),
    // Full-height spawn baffles prevent direct base-to-base fire.
    block("north-baffle", "service", 0, -27, 7, 2, 3),
    block("south-baffle", "service", 0, 27, 7, 2, 3),
    // Alternating screens leave a 3.5 m passage and break standing sightlines.
    ...[-25, -9, 9, 25].flatMap((z, i) => [
      block(`west-screen-${i}`, "hoarding", i % 2 ? -20.5 : -24, z, 6, 1.6, 3),
      block(`east-screen-${i}`, "hoarding", i % 2 ? 24 : 20.5, z, 6, 1.6, 3),
    ]),
    block("theater-step", "step", -20, -15, 2.8, 1.2, 0.55),
    block("theater-deck", "platform", -20, -18, 2.8, 4, 1.1),
    block("avenue-step", "step", 23, 14, 2.8, 1.2, 0.55),
    block("avenue-deck", "platform", 23, 17, 3, 4, 1.1),
    block("plaza-step", "step", 5, 20.7, 2.8, 1.3, 0.8),
    block("plaza-deck", "platform", 5, 23, 3, 3, 1.6),
    block("east-planter", "planter", 21, -18, 3.4, 1.5, 1.15),
    block("plaza-cover", "planter", 0, 18, 3.6, 1.4, 1.15),
    block("north-cover", "planter", 4, -18, 3.6, 1.4, 1.15),
  ],
  spawns: [
    { x: -5, z: 31, yaw: 0 },
    { x: 6, z: 31, yaw: 0 },
    { x: -22, z: 30, yaw: 0 },
    { x: 22, z: 30, yaw: 0 },
    { x: -5, z: -31, yaw: Math.PI },
    { x: 6, z: -31, yaw: Math.PI },
    { x: -22, z: -30, yaw: Math.PI },
    { x: 22, z: -30, yaw: Math.PI },
    { x: -25, z: -18, yaw: 0 },
    { x: -19, z: -29, yaw: 0 },
    { x: -25, z: -3, yaw: Math.PI },
    { x: -19, z: 12, yaw: 0 },
    { x: -25, z: 20, yaw: Math.PI },
    { x: -19, z: 32, yaw: Math.PI },
    { x: 25, z: -19, yaw: 0 },
    { x: 19, z: -29, yaw: 0 },
    { x: 19, z: -3, yaw: Math.PI },
    { x: 25, z: 3, yaw: 0 },
    { x: 19, z: 18, yaw: Math.PI },
    { x: 25, z: 32, yaw: Math.PI },
    { x: -6, z: -22, yaw: 0 },
    { x: 6, z: -12, yaw: 0 },
    { x: -6, z: 11, yaw: Math.PI },
    { x: 7, z: 28, yaw: Math.PI },
    { x: -5, z: 0, yaw: Math.PI / 2 },
    { x: 6, z: 1, yaw: -Math.PI / 2 },
  ],
};
export const TDM = {
  duration: 480,
  target: 40,
  respawn: 3,
  botRespawn: 3,
  allies: 2,
  enemies: 3,
};
// Three connected patrol circuits. Bots investigate their lane until they
// acquire a visible opponent, rather than tracking players through walls.
export const PATROLS = [
  [
    [-22, -29],
    [-25, -15],
    [-25, 1],
    [-19, 14],
    [-22, 28],
  ],
  [
    [-5, -30],
    [-5, -17],
    [3, -1],
    [-3, 14],
    [-5, 30],
  ],
  [
    [22, -29],
    [25, -15],
    [20, 0],
    [19, 17],
    [22, 28],
  ],
];
