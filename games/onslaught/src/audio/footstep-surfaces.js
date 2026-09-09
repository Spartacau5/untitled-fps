import { MIDTOWN } from "../data/midtown.js";

const roofs = MIDTOWN.solids
  .filter((solid) => solid.kind === "bus")
  .map((solid) => ({
    ...solid,
    cos: Math.cos(solid.yaw),
    sin: Math.sin(solid.yaw),
  }));

// Feet positions, not camera positions. Stone decks use the concrete bank.
export function footstepSurface(position) {
  for (const roof of roofs) {
    if (Math.abs(position.y - roof.h) > 0.15) continue;
    const dx = position.x - roof.x,
      dz = position.z - roof.z;
    if (
      Math.abs(dx * roof.cos - dz * roof.sin) <= roof.w / 2 + 0.05 &&
      Math.abs(dx * roof.sin + dz * roof.cos) <= roof.d / 2 + 0.05
    )
      return "metal";
  }
  return "boots";
}
