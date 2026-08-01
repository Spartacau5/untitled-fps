import { damp } from "../core/spring.js";

export const TUNING = {
  rusherSpeed: 3.5, // m/s
  gunnerSpeed: 1.65, // m/s
  heavySpeed: 1.1, // m/s
  reactionDelay: 0.85, // seconds
  fireRange: 18, // meters
  meleeRange: 1.55, // meters
  minimumPlayerDistance: 1.25, // meters, keeps enemy body outside the player camera
  flankDistance: 7, // meters
};

export class EnemyAI {
  update(dt, enemy, context) {
    if (enemy.dead) return;
    const toPlayer = enemy.toPlayer.copy(context.player.position).sub(enemy.group.position);
    const distance = Math.max(0.001, toPlayer.length());
    const direction = enemy.aiDirection.copy(toPlayer).multiplyScalar(1 / distance);
    const desired = enemy.aiDesired.set(0, 0, 0);
    const pressure = context.player.health < 42 || context.reloadActive;
    const strafePhase = enemy.phase * 0.71 + enemy.seedOffset;
    if (enemy.type === "rusher") {
      desired.copy(direction).multiplyScalar(pressure ? TUNING.rusherSpeed * 1.16 : TUNING.rusherSpeed);
    } else if (enemy.type === "gunner") {
      if (distance > TUNING.fireRange * 0.72 || pressure) desired.copy(direction).multiplyScalar(TUNING.gunnerSpeed);
      desired.x += Math.cos(strafePhase) * 0.62;
      desired.z += Math.sin(strafePhase) * 0.62;
    } else {
      if (distance > 11 || pressure) desired.copy(direction).multiplyScalar(TUNING.heavySpeed);
      desired.x += Math.sin(strafePhase * 0.5) * 0.24;
    }
    if (distance < TUNING.flankDistance && !pressure) {
      desired.x += Math.cos(strafePhase) * 0.8;
      desired.z += Math.sin(strafePhase) * 0.8;
    }
    // Keep the attack readable: enemies can threaten the player at melee
    // range, but never walk through the camera and fill the view with a mesh.
    if (distance < TUNING.minimumPlayerDistance) desired.copy(direction).multiplyScalar(-1);
    if (desired.lengthSq() > 0.001) desired.normalize().multiplyScalar(enemy.speed);
    enemy.velocity.x = damp(enemy.velocity.x, desired.x, enemy.type === "rusher" ? 6.5 : 4.2, dt);
    enemy.velocity.z = damp(enemy.velocity.z, desired.z, enemy.type === "rusher" ? 6.5 : 4.2, dt);
    if (enemy.type === "rusher" && distance < TUNING.meleeRange) {
      enemy.attackCooldown -= dt;
      if (enemy.attackCooldown <= 0) {
        enemy.attackCooldown = 1.8;
        context.onEnemyDamage?.(4, direction);
      }
    } else if (enemy.type !== "rusher" && distance < TUNING.fireRange && enemy.reactionTimer <= 0) {
      enemy.attackCooldown -= dt;
      if (enemy.attackCooldown <= 0) {
        enemy.attackCooldown = enemy.type === "heavy" ? 2.2 : 1.65;
        context.onEnemyFire?.(enemy, direction);
      }
    } else {
      enemy.reactionTimer -= dt;
    }
  }
}
