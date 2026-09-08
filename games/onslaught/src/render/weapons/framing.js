import { Box3, Vector3 } from "three";

// Model-space solid bounds, computed once. Forearms intentionally continue
// behind the eye below the viewport, so they are excluded from gun framing.
export function solidBounds(model) {
  const result = new Box3(),
    part = new Box3();
  model.group.updateMatrixWorld(true);
  model.group.traverse((mesh) => {
    if (!mesh.isMesh) return;
    for (let parent = mesh; parent; parent = parent.parent)
      if (parent === model.parts.handL || parent === model.parts.handR) return;
    mesh.geometry.computeBoundingBox();
    part.copy(mesh.geometry.boundingBox).applyMatrix4(mesh.matrixWorld);
    result.union(part);
  });
  return result;
}
const corner = new Vector3();
// Continuous camera-space guard over eight box corners. Covers the complete
// pitch/yaw/roll pose, including kick and reload, without moving the aim ray.
export function keepGunInFront(rig, bounds, clearance = 0.08) {
  let rear = -Infinity;
  for (let bits = 0; bits < 8; bits++) {
    corner.set(
      bits & 1 ? bounds.max.x : bounds.min.x,
      bits & 2 ? bounds.max.y : bounds.min.y,
      bits & 4 ? bounds.max.z : bounds.min.z,
    );
    corner
      .multiply(rig.scale)
      .applyQuaternion(rig.quaternion)
      .add(rig.position);
    rear = Math.max(rear, corner.z);
  }
  const retreat = Math.max(0, rear + clearance);
  rig.position.z -= retreat;
  return retreat;
}
export function isScoped(weapons, player) {
  return (
    weapons.weapon.def.key === "sniper" &&
    weapons.adsSmooth >= 0.9 &&
    !weapons.switching &&
    !weapons.weapon.reloading &&
    !player.dead
  );
}
