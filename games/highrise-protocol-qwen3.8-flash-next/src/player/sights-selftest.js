// ============================================================================
// src/player/sights-selftest.js — A9 sight-line self-test (T key; main binds
// the key and passes ctx here). Three independent checks per FOV
// (75 / 65 / 55), fully functional WITHOUT pointer lock — the runner sets the
// camera orientation itself and restores it afterwards:
//
//  1. ray-alignment — casts the REAL gun ray (origin = camera world position,
//     dir = camera forward, zero spread so geometry alone is judged) 400 m
//     into ctx.world.raycastWorld, REQUIRES a hit, projects the actual hit
//     point through the camera to screen px and asserts |px − center| ≤ 1 px.
//     Projecting an anchor is not this test.
//  2. sight-projection — projects rearSightAnchor and frontSightAnchor world
//     positions; each must land within 2 px of screen center and the two
//     within 2 px of each other (they must visually stack).
//  3. sight-line-clearance — walks every viewmodel mesh's world-space
//     bounding box; for every corner CLOSER to the eye than rearSightAnchor,
//     the angular offset from the view axis must exceed 8° (failure names the
//     offending part and the worst angle). Also asserts stockRef is BEHIND
//     the camera (positive Z in camera space) — the A5 proof.
//
// The ADS pose is forced with weapon.forceAdsSolve(), which snaps the recoil
// springs + camera-recoil accumulators to zero before applying the pure
// geometry solve. Legitimate per the documented A9 contract: the checks are
// about the geometry solve, not the dynamics — and check 1 is pose-
// independent anyway because the bullet ray originates from camera center,
// never from the gun (A8).
// ============================================================================

import { Vector3, Quaternion, Euler, Box3 } from 'three';
import { state } from '../core/state.js';

const FOVS = [75, 65, 55];
const RAY_DIST = 400;
const CONE_DEG = 8;
const PX_RAY = 1;
const PX_ANCHOR = 2;

export function runSightsSelfTest(ctx) {
  const camera = ctx.camera;
  const weapon = ctx.weapon;
  const results = [];

  const dom = document.getElementById('selftest');
  if (dom) {
    dom.classList.remove('hidden');
    dom.textContent = '';
  }

  // ---- save live camera state for a clean restore
  const savedFov = camera.fov;
  const savedPos = camera.position.clone();
  const savedQuat = camera.quaternion.clone();

  // scratch
  const fwd = new Vector3();
  const eye = new Vector3();
  const hitPt = new Vector3();
  const corner = new Vector3();
  const qInv = new Quaternion();
  const box = new Box3();
  const opt = { allHits: false };
  const dir = new Vector3();

  // Eye position: the live camera's (never below the deck). Aim 10° down so
  // the straight-ahead ray reliably strikes the arena floor within 400 m —
  // check 1 requires a REAL hit; no pointer lock is involved (A9).
  eye.copy(camera.position);
  if (!Number.isFinite(eye.y) || eye.y < 0.5) {
    if (ctx.world && ctx.world.playerStart) eye.copy(ctx.world.playerStart).setY(state.move.camY || 1.7);
    else eye.set(0, 1.7, 0);
  }
  const pitch = new Euler(-10 * Math.PI / 180, 0, 0, 'YXZ');

  const el = ctx.renderer && ctx.renderer.domElement ? ctx.renderer.domElement : null;
  const W = el && el.clientWidth ? el.clientWidth : window.innerWidth;
  const H = el && el.clientHeight ? el.clientHeight : window.innerHeight;
  const cx = W / 2, cy = H / 2;

  function projectPx(v3, out) {
    out.copy(v3).project(camera);
    out.x = (out.x * 0.5 + 0.5) * W;
    out.y = (1 - (out.y * 0.5 + 0.5)) * H;
    return out;
  }

  for (let f = 0; f < FOVS.length; f++) {
    const fov = FOVS[f];
    camera.fov = fov;
    camera.position.copy(eye);
    camera.quaternion.setFromEuler(pitch);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld(true);
    weapon.forceAdsSolve();
    camera.getWorldPosition(eye);            // authoritative world eye pos
    camera.getWorldDirection(fwd);

    // ============ 1. ray alignment (real ray → real hit → px) ============
    {
      let ok = false, note = 'world.raycastWorld missing';
      if (ctx.world && ctx.world.raycastWorld) {
        dir.copy(fwd);
        const hits = ctx.world.raycastWorld(eye, dir, RAY_DIST, opt);
        if (hits && hits.length) {
          hitPt.copy(hits[0].point);
          projectPx(hitPt, corner);          // corner as scratch px
          const d = Math.max(Math.abs(corner.x - cx), Math.abs(corner.y - cy));
          ok = d <= PX_RAY;
          note = `off-center ${d.toFixed(2)} px — hit ${hits[0].surface || 'body'} @ ${(hits[0].dist || 0).toFixed(1)} m`;
        } else {
          note = 'no world hit within 400 m';
        }
      }
      results.push({ check: 'ray-alignment', fov, ok, note });
      console.log(`${ok ? 'PASS' : 'FAIL'} ray-alignment fov=${fov} — ${note}`);
    }

    // ================= 2. sight projection (anchors stack) ===============
    {
      const pr = projectPx(weapon.rearSightAnchor.getWorldPosition(corner), hitPt);
      const pf = projectPx(weapon.frontSightAnchor.getWorldPosition(corner), dir);
      const dr = Math.max(Math.abs(pr.x - cx), Math.abs(pr.y - cy));
      const df = Math.max(Math.abs(pf.x - cx), Math.abs(pf.y - cy));
      const dd = Math.max(Math.abs(pr.x - pf.x), Math.abs(pr.y - pf.y));
      const ok = dr <= PX_ANCHOR && df <= PX_ANCHOR && dd <= PX_ANCHOR;
      const note = `rear ${dr.toFixed(2)} px · front ${df.toFixed(2)} px · stack ${dd.toFixed(2)} px`;
      results.push({ check: 'sight-projection', fov, ok, note });
      console.log(`${ok ? 'PASS' : 'FAIL'} sight-projection fov=${fov} — ${note}`);
    }

    // ========== 3. sight-line clearance + stock behind the eye ==========
    {
      camera.getWorldQuaternion(qInv).invert();               // world → camera
      const rearCam = hitPt.copy(weapon.rearSightAnchor.getWorldPosition(corner)).sub(eye).applyQuaternion(qInv);
      const rearDist = rearCam.length();                       // = eye relief by solve
      let worstAng = Infinity, worstPart = '';
      weapon.group.updateWorldMatrix(true, true);
      weapon.group.traverse((obj) => {
        if (!obj.isMesh || !obj.visible) return;
        box.setFromObject(obj);
        if (box.isEmpty()) return;
        for (let i = 0; i < 8; i++) {
          corner.set(
            i & 1 ? box.max.x : box.min.x,
            i & 2 ? box.max.y : box.min.y,
            i & 4 ? box.max.z : box.min.z
          ).sub(eye).applyQuaternion(qInv);                    // → camera space
          const d = corner.length();
          if (d >= rearDist || d < 1e-6) continue;             // only NEARER than rear sight
          const cosA = -corner.z / d;                          // angle from view axis (-Z)
          if (cosA > Math.cos(CONE_DEG * Math.PI / 180)) {     // inside ±8° cone → violation
            const ang = Math.acos(Math.min(1, cosA)) * 180 / Math.PI;
            if (ang < worstAng) {
              worstAng = ang;
              worstPart = obj.name || (obj.parent && obj.parent.name) || 'unnamed';
            }
          }
        }
      });
      const clearanceOk = worstAng === Infinity;
      // stock rearmost point must be BEHIND the camera (camera-space z > 0)
      const stockCam = dir.copy(weapon.stockRef.getWorldPosition(corner)).sub(eye).applyQuaternion(qInv);
      const stockOk = stockCam.z > 0;
      const ok = clearanceOk && stockOk;
      let note = '';
      if (clearanceOk) note = `all nearer geometry outside ±${CONE_DEG}°`;
      else note += `VIOLATION: ${worstPart} @ ${worstAng.toFixed(1)}°`;
      note += ` · stock z=${stockCam.z >= 0 ? '+' : ''}${stockCam.z.toFixed(3)} m ${stockOk ? '(behind eye)' : '(NOT behind eye)'}`;
      results.push({ check: 'sight-line-clearance', fov, ok, note });
      console.log(`${ok ? 'PASS' : 'FAIL'} sight-line-clearance fov=${fov} — ${note}`);
    }
  }

  // ---- restore live camera exactly as found
  camera.fov = savedFov;
  camera.position.copy(savedPos);
  camera.quaternion.copy(savedQuat);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  // ---- colored DOM report into #selftest
  if (dom) {
    const allOk = results.every((r) => r.ok);
    const head = document.createElement('div');
    head.className = allOk ? 'ok' : 'bad';
    head.textContent = allOk ? 'ADS SELF-TEST: ALL PASS' : 'ADS SELF-TEST: FAILURES';
    dom.appendChild(head);
    for (const r of results) {
      const row = document.createElement('div');
      row.className = r.ok ? 'ok' : 'bad';
      row.textContent = `${r.ok ? 'PASS' : 'FAIL'}  ${r.check}  fov=${r.fov}  ${r.note}`;
      dom.appendChild(row);
    }
  }
  return results;
}
