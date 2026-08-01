import * as THREE from "three";

export const TUNING = {
  worldHalfWidth: 28, // meters
  floorY: 0, // meters
  playerRadius: 0.38, // meters
  playerHeight: 1.75, // meters
};

export class CollisionWorld {
  constructor() {
    this.obstacles = [];
    this.bounds = TUNING.worldHalfWidth;
  }

  addBox(center, size, options = {}) {
    this.obstacles.push({
      center: center.clone(),
      half: size.clone().multiplyScalar(0.5),
      solid: options.solid !== false,
      low: Boolean(options.low),
    });
  }

  resolve(position, radius = TUNING.playerRadius) {
    position.x = THREE.MathUtils.clamp(position.x, -this.bounds + radius, this.bounds - radius);
    position.z = THREE.MathUtils.clamp(position.z, -this.bounds + radius, this.bounds - radius);
    for (const obstacle of this.obstacles) {
      if (!obstacle.solid) continue;
      const minX = obstacle.center.x - obstacle.half.x - radius;
      const maxX = obstacle.center.x + obstacle.half.x + radius;
      const minZ = obstacle.center.z - obstacle.half.z - radius;
      const maxZ = obstacle.center.z + obstacle.half.z + radius;
      if (position.x > minX && position.x < maxX && position.z > minZ && position.z < maxZ) {
        const pushX = Math.min(Math.abs(position.x - minX), Math.abs(maxX - position.x));
        const pushZ = Math.min(Math.abs(position.z - minZ), Math.abs(maxZ - position.z));
        if (pushX < pushZ) position.x += position.x < obstacle.center.x ? -pushX : pushX;
        else position.z += position.z < obstacle.center.z ? -pushZ : pushZ;
      }
    }
    position.y = Math.max(TUNING.floorY, position.y);
    return position;
  }
}
