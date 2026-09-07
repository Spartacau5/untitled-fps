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
    block("west-truck", "service", -22, -8, 2.5, 5, 2.6),
    block("west-kiosk", "kiosk", -23, 14, 2.2, 3, 2.4),
    block("east-van", "service", 22, 6, 2.7, 5.5, 2.8),
    block("east-planter", "planter", 21, -18, 3.4, 1.5, 1.15),
    block("plaza-cover", "planter", 0, 18, 3.6, 1.4, 1.15),
    block("north-cover", "planter", 4, -18, 3.6, 1.4, 1.15),
  ],
  objectives: [
    { id: "A", name: "BROADWAY", x: 0, z: 0, radius: 3.4 },
    { id: "B", name: "THEATER WALK", x: -22, z: 3, radius: 3.4 },
    { id: "C", name: "SEVENTH AVE", x: 22, z: -6, radius: 3.4 },
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
  ],
};
export const HARDPOINT = {
  duration: 360,
  target: 120,
  rotation: 45,
  respawn: 3,
  bots: 3,
  botRespawn: 5,
};
