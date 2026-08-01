import * as THREE from "three";

export function runAimAlignmentSelfTest(camera, width = window.innerWidth, height = window.innerHeight) {
  camera.updateMatrixWorld(true);
  const originalFov = camera.fov;
  const origin = camera.getWorldPosition(new THREE.Vector3());
  const direction = camera.getWorldDirection(new THREE.Vector3());
  const point = origin.clone().addScaledVector(direction, 10);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const results = [];
  for (const fov of [75, 65, 55]) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    const projected = point.clone().project(camera);
    const px = Math.abs(projected.x * width * 0.5);
    const py = Math.abs(projected.y * height * 0.5);
    const pass = px <= 1 && py <= 1;
    results.push({ fov, pass, px, py, ray: raycaster.ray.direction.clone() });
    console.info(`[A4] FOV ${fov}: ${pass ? "PASS" : "FAIL"} (${px.toFixed(3)}px, ${py.toFixed(3)}px)`);
  }
  camera.fov = originalFov;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return results;
}
