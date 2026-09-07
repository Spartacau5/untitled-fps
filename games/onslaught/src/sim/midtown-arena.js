import { Vector3, MathUtils } from "three";
import { Arena, BoxCollider } from "./arena.js";
import { MIDTOWN } from "../data/midtown.js";
export class MidtownArena extends Arena {
  _build() {
    this.bounds = MIDTOWN.bounds;
    this.radius = 46;
    this.layout = MIDTOWN;
    for (const b of MIDTOWN.solids)
      this.boxes.push(
        new BoxCollider(b.x, b.z, b.w / 2, b.d / 2, 0, b.h, b.yaw),
      );
    for (const s of MIDTOWN.spawns)
      this.gates.push({
        pos: new Vector3(s.x, 0, s.z),
        dir: new Vector3(0, 0, s.z > 0 ? -1 : 1),
        activity: 0,
        open: 0,
        openHold: 0,
      });
  }
  groundHeight() {
    return 0;
  }
  resolveCircle(x, z, radius, y = 0, height = 1.8, step = 0.35) {
    [x, z] = super.resolveCircle(x, z, radius, y, height, step);
    return [
      MathUtils.clamp(x, -this.bounds.x + radius, this.bounds.x - radius),
      MathUtils.clamp(z, -this.bounds.z + radius, this.bounds.z - radius),
    ];
  }
}
