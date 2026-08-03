// ---------------------------------------------------------------------------
// debug/selftest.js — T key (A4). Headless aim-alignment check: for FOV
// 75 / 65 / 55 cast the gun ray from camera center, project the hit point to
// screen space, assert within 1 px of center, log PASS/FAIL per FOV.
// Works without pointer lock — it never touches input state.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

const _origin = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _pt = new THREE.Vector3();

export function runSelfTest(ctx) {
  const cam = ctx.cameraRig.camera;
  const prevFov = cam.fov;
  const w = ctx.renderer.domElement.clientWidth;
  const h = ctx.renderer.domElement.clientHeight;
  const cx = w / 2, cy = h / 2;
  console.log('[SELFTEST] aim-alignment check — seed 0xC0DA');

  for (const fov of [75, 65, 55]) {
    cam.fov = fov;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld(true);
    cam.matrixWorldInverse.copy(cam.matrixWorld).invert();

    _origin.setFromMatrixPosition(cam.matrixWorld);
    _dir.set(0, 0, -1).applyQuaternion(cam.quaternion).normalize();
    ctx.fire.raycaster.set(_origin, _dir);
    ctx.fire.raycaster.far = 300;
    const hits = ctx.fire.raycaster.intersectObjects(ctx.targets.solidList, false);

    if (!hits.length) {
      console.log(`[SELFTEST] FOV ${fov}: SKIP (no geometry along boresight)`);
      continue;
    }
    console.log(`[SELFTEST] FOV ${fov}: cam ${_origin.x.toFixed(2)},${_origin.y.toFixed(2)},${_origin.z.toFixed(2)} dir ${_dir.x.toFixed(2)},${_dir.y.toFixed(2)},${_dir.z.toFixed(2)} hit@${hits[0].distance.toFixed(2)}`);
    _pt.copy(hits[0].point).project(cam);
    const sx = (_pt.x * 0.5 + 0.5) * w;
    const sy = (-_pt.y * 0.5 + 0.5) * h;
    const err = Math.hypot(sx - cx, sy - cy);
    const pass = err <= 1.0;
    console.log(`[SELFTEST] FOV ${fov}: ${pass ? 'PASS' : 'FAIL'} — hit ${hits[0].point.x.toFixed(2)},${hits[0].point.y.toFixed(2)},${hits[0].point.z.toFixed(2)} | screen error ${err.toFixed(3)} px`);
  }

  cam.fov = prevFov;
  cam.updateProjectionMatrix();
}
