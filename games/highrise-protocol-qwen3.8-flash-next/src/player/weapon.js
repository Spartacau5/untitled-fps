// ============================================================================
// src/player/weapon.js — HIGHRISE PROTOCOL viewmodel weapon (spec §4 F1-F8,
// §6 R1-R4, §7 A1-A9). THE critical module.
//
// Construction law (A1): barrel axis = -Z at group rest, stock at +Z behind,
// muzzle far -Z. Cylinder/box geometry is baked (pre-rotated + translated at
// build time) so every live mesh sits at identity transform — there is never
// a corrective 90° rotation hack.
//
// ADS (A3) is SOLVED, never hand-tuned. In camera space the weapon's rest
// frame already has its sight axis on -Z with up = +Y, so the unique solved
// orientation that puts (front − rear) on the view axis, rolled upright, is
// weaponQuat_cam = identity; the solved position places rearSightAnchor at
// real eye relief (9 cm) in front of the eye:
//     pos_cam = (0, 0, -EYE_RELIEF) - rearSightAnchor_local
// Both anchors then project dead-center at ANY world FOV by construction;
// the stock (local z ≈ +0.42) lands at camera-space z ≈ +0.25 — BEHIND the
// eye (A5) — and nothing nearer than the rear glass enters the ±8° cone
// (every rear-of-sight part hangs at least 4.4 cm off-axis → >28°).
// Hip↔ADS is a full-transform lerp+slerp through easeInOut over 150 ms
// (A4/A6); recoil rides ON TOP of the blend, so the rest solve never drifts.
//
// RECOIL (F2, deterministic, documented): a 30-shot repeatable array is
// generated ONCE from the seeded rng stream — per-shot pitch punch climbs
// 1.2° → 4.5° (the learnable pattern); yaw drifts in alternating 4–7-shot
// segments of 0.45°..1.6° plus ±0.04° gaussian jitter. Two layers:
//  1. WEAPON VISUAL: per-shot velocity impulses into zero-target springs
//     (k=120 ζ=0.6 → punchy overshoot settle, C5). A unit-mass spring hit by
//     velocity v0 swings to ≈v0/ω then decays; shots arrive every Δt=0.086 s
//     (ω·Δt≈0.95 rad) so each punch lands on the tail of the previous one —
//     the displacement follows the cumulative pattern with snappy transients.
//     IMP_W = 7 rad/s per rad of pattern → 1.6°–6.5° punch per shot.
//  2. CAMERA CLIMB: scalar accumulators gain CAM_SHARE (0.35) × pattern per
//     shot — ≈0.4°..1.6°/shot, the classic ~25–30° climb over a full mag the
//     player fights. Tracking springs (k=110 ζ=0.9) follow the accumulators
//     so aim rises in punchy steps; 0.6 s after the trigger releases the
//     accumulators ease back to 0 and aim recenters. The weapon INHERITS
//     this climb through the camera transform (its pose is composed FROM
//     ctx.camera), so the solved sight line stays collinear with the pitched
//     view axis at all times; the extra rp/ry punches ride on top as the gun
//     visibly fighting in the hands — exactly what the A9 rest contract
//     zeroes out.
//
// CAMERA APPLICATION (integrator ruling): the weapon NEVER touches
// ctx.camera or state.move angles. It publishes the ABSOLUTE current recoil
// spring values into state.recoilPitch / state.recoilYaw / state.recoilRoll
// (radians) every frame; the controller NaN-guards and adds them to the
// final camera angles and does not zero them — decay lives entirely in the
// weapon's own climb springs, so the net after recovery is exactly 0 (no
// aim drift). state.recoilRoll carries the R1 reload camera roll (the
// vmCamera inherits it by replicating the world camera transform). First
// shot 1.6× heavier; ADS ×0.6, crouch ×0.8, sprint ×1.3.
//
// SELF-TEST CONTRACT (A9): forceAdsSolve() snaps every recoil spring and
// accumulator to zero, then applies the pure geometry solve for one frame.
// The test checks the geometry solve, not the dynamics, so zeroing recoil is
// its honest contract; test 1 (ray alignment) is pose-independent anyway —
// the bullet ray comes from camera center + spread cone, never from the gun.
// ============================================================================

import {
  Group, Object3D, Mesh, BoxGeometry, CylinderGeometry, SphereGeometry,
  TorusGeometry, PlaneGeometry, MeshStandardMaterial, MeshBasicMaterial,
  Vector3, Quaternion, Euler,
  AmbientLight, DirectionalLight, PointLight,
  CanvasTexture, AdditiveBlending, DoubleSide,
} from 'three';
import { rng } from '../core/rng.js';
import { Spring, Spring3 } from '../core/spring.js';
import { time } from '../core/time.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { input } from '../core/input.js';
import { shake } from '../core/shake.js';
import * as E from '../core/easings.js';

const DEG = Math.PI / 180;

// -- tuning -----------------------------------------------------------------
const RPM = 700;
const SHOT_INT = 60 / RPM;              // F1: 0.0857 s cadence
const MAG_SIZE = 30;
const BODY_DMG = 34;                    // §5: limb ×0.85 here, head 2× in enemies
const PEN_REDUCE = 0.55;                // E3: drywall/sheeting energy pass-through
const EYE_RELIEF = 0.09;                // A3 point 2: 9 cm real eye relief
const ADS_TIME = 0.15;                  // A6: 150 ms easeInOut each way
const FOV_VM = 55;                      // A5b: viewmodel fov FIXED, never tracks world
const FOV_WORLD = 75;                   // A6: world fov 75 → 55 in sync (controller composes)
const FOV_WORLD_ADS = 55;
const SPREAD_HIP = 2.2;                 // F3/A8 base cone, degrees
const SPREAD_ADS = 0.4;
const SPREAD_BLOOM = 0.55;              // +deg per shot, ease-out decay
const OVERDRIVE_SPREAD = 0.75;          // D2: tighter spread during OVERDRIVE
const RELOAD = { p0: 0.60, p1: 0.65, p2: 0.75 };  // R2 phase durations → 2.0 s total
const RELOAD_ABORT = 0.25;              // R3: quick eased return
const INSPECT_T = 2.8;                  // F7: inspect sequence length
const IMP_W = 7;                        // pattern rad → visual spring velocity
const IMP_TR_Z = 0.21;                  // kick-back: v0/(kΔt) = 2 cm sustained (F2)
const IMP_TR_Y = 0.062;                 // rise: ≈6 mm sustained + transients
const RECOIL_K = 120, RECOIL_Z = 0.6;   // weapon visual springs (spec: k~120 ζ0.6)
const CAM_K = 110, CAM_Z = 0.9;         // camera climb tracking (smoother)
const FIRST_MULT = 1.6;                 // F2: first shot heavier
const CAM_SHARE = 0.35;                 // fraction of pattern the camera absorbs

// sight line geometry (group-local): rear glass z=+0.075, dot z=-0.02, both
// on the optical axis at rail height y=0.105; barrel axis y=0 parallel below.
const SIGHT_Y = 0.105;
const REAR_LOCAL = new Vector3(0, SIGHT_Y, 0.075);
const FRONT_LOCAL = new Vector3(0, SIGHT_Y, -0.02);
const MAG_HOME = new Vector3(0, -0.008, -0.030);
const FRESH_OFF = new Vector3(-0.20, -0.342, 0);   // below-left mag start

export function init(ctx) {
  const { vmScene, scene, camera, vmCamera } = ctx;

  // ---- viewmodel camera: own near plane + FIXED fov (A5b)
  vmCamera.near = 0.01;
  vmCamera.far = 12;
  vmCamera.fov = FOV_VM;
  vmCamera.aspect = camera.aspect;
  vmCamera.updateProjectionMatrix();

  // ---- shared runtime state fields (writers per CONTRACT.md)
  state.ads.fovVm = FOV_VM;
  if (!state.crosshair) state.crosshair = { gap: 10, alpha: 1 };
  // camera-recoil channel (integrator ruling): absolute radian offsets the
  // controller adds to final camera angles every frame; weapon owns decay.
  state.recoilPitch = 0; state.recoilYaw = 0; state.recoilRoll = 0;

  // ---- vmScene needs its own lights (the sun lives only in the world scene)
  const key = new DirectionalLight(0xfff0dd, 1.7);
  key.position.set(0.45, 1.1, 0.55);
  const amb = new AmbientLight(0x51607a, 0.7);
  const rim = new DirectionalLight(0xffa860, 0.35);
  rim.position.set(-0.8, -0.2, -0.6);
  vmScene.add(key, amb, rim);

  // ================================================================ mesh ===
  // M4/AR-47 hybrid from grouped primitives. A1: everything baked along -Z;
  // no live mesh carries a corrective rotation.
  const gunmetal = new MeshStandardMaterial({ color: 0x24272c, roughness: 0.45, metalness: 0.65 });
  const bluing = new MeshStandardMaterial({ color: 0x17181b, roughness: 0.35, metalness: 0.8 });
  const barrelMat = new MeshStandardMaterial({ color: 0x17181b, roughness: 0.35, metalness: 0.8 }); // dedicated → heat emissive (F4)
  const polymer = new MeshStandardMaterial({ color: 0x2b2a26, roughness: 0.75, metalness: 0.05 });
  const furniture = new MeshStandardMaterial({ color: 0x1f201d, roughness: 0.8, metalness: 0.05 });
  const magmetal = new MeshStandardMaterial({ color: 0x2d2f26, roughness: 0.55, metalness: 0.5 });
  const glassMat = new MeshBasicMaterial({ color: 0x88b4cc, transparent: true, opacity: 0.07, side: DoubleSide, depthWrite: false });
  const dotMat = new MeshBasicMaterial({ color: 0xff2d24 });

  const X_AXIS = new Vector3(1, 0, 0);
  const ZED = new Quaternion().setFromAxisAngle(X_AXIS, -Math.PI / 2);  // cylinder +Y → -Z
  const _tq = new Quaternion();
  const _te = new Euler();
  function cyl(rt, rb, len, mat, x, y, z, tilt = 0, open = false) {
    const g = new CylinderGeometry(rt, rb, len, 18, 1, open);
    if (tilt) g.applyQuaternion(_tq.setFromAxisAngle(X_AXIS, tilt));
    g.applyQuaternion(ZED);
    g.translate(x, y, z);
    return new Mesh(g, mat);
  }
  function box(w, h, d, mat, x, y, z, eul = null) {
    const g = new BoxGeometry(w, h, d);
    if (eul) g.applyQuaternion(_tq.setFromEuler(_te.set(eul[0], eul[1], eul[2])));
    g.translate(x, y, z);
    return new Mesh(g, mat);
  }
  function named(mesh, name) { mesh.name = name; return mesh; }

  const group = new Group();
  group.name = 'viewmodel';

  // receiver + top rail
  group.add(named(box(0.046, 0.062, 0.30, gunmetal, 0, 0.020, 0.050), 'receiver'));
  group.add(named(box(0.020, 0.010, 0.24, bluing, 0, 0.056, 0.010), 'topRail'));
  // tapered handguard: two segments receding toward -Z, hugging the barrel
  group.add(named(cyl(0.024, 0.029, 0.20, polymer, 0, 0.005, -0.200), 'handguard'));
  group.add(named(cyl(0.020, 0.024, 0.050, polymer, 0, 0.005, -0.325), 'handguardTip'));
  group.add(named(box(0.018, 0.020, 0.020, bluing, 0, 0.018, -0.315), 'gasBlock'));   // gas block
  // barrel + flash hider — muzzle far -Z; barrel axis y=0 (below sight line)
  const barrel = named(cyl(0.0105, 0.011, 0.120, barrelMat, 0, 0, -0.405), 'barrel');
  group.add(barrel);
  group.add(named(cyl(0.014, 0.013, 0.038, bluing, 0, 0, -0.462), 'flashHider'));
  // buffer tube + stock + butt pad — +Z behind; the rearmost point ends up
  // BEHIND THE EYE in ADS (A5), so it never blocks the sight line.
  group.add(named(cyl(0.018, 0.018, 0.130, gunmetal, 0, 0.010, 0.255), 'bufferTube'));
  group.add(named(box(0.050, 0.100, 0.115, furniture, 0, -0.030, 0.335), 'stock'));
  group.add(named(box(0.052, 0.110, 0.018, furniture, 0, -0.030, 0.401), 'stockPad'));
  // pistol grip (baked rake) + trigger guard
  group.add(named(box(0.030, 0.095, 0.045, furniture, 0, -0.070, 0.110, [0.28, 0, 0]), 'grip'));
  group.add(named(box(0.008, 0.006, 0.055, gunmetal, 0, -0.028, 0.045), 'triggerGuard'));

  // magazine — two separate Object3D groups (R2): the live mag that ejects
  // and a fresh mag that rises + slams in; purely local animation, no physics.
  function makeMag() {
    const g = new Group();
    g.add(box(0.028, 0.075, 0.058, magmetal, 0, -0.048, 0.000, [-0.10, 0, 0]));
    g.add(box(0.026, 0.060, 0.052, magmetal, 0, -0.108, -0.014, [-0.30, 0, 0]));  // curved segment
    return g;
  }
  const magMesh = makeMag();
  magMesh.name = 'magMesh';
  magMesh.position.copy(MAG_HOME);
  group.add(magMesh);
  const magFresh = makeMag();
  magFresh.name = 'magFresh';
  magFresh.visible = false;
  magFresh.position.copy(MAG_HOME).add(FRESH_OFF);
  group.add(magFresh);

  // charging handle — racks in reload phase 3 and during inspect (R2/F7)
  const CHARGE_Z = 0.150;
  const chargeHandle = named(box(0.034, 0.016, 0.070, gunmetal, 0.028, 0.048, CHARGE_Z), 'chargeHandle');
  group.add(chargeHandle);

  // RED DOT optic (A7): thin circular housing (open-ended so the world stays
  // visible through it), completely clear window, small emissive red dot.
  // Both sight anchors sit on the optical axis (A2).
  const optic = new Group();
  optic.position.y = SIGHT_Y;
  optic.name = 'optic';
  // ~34 mm lens diameter, 60 mm tube — a real micro red-dot, so the housing
  // frames the target instead of eating the frame (A7).
  optic.add(named(cyl(0.017, 0.017, 0.060, gunmetal, 0, 0, 0.010, 0, true), 'opticHood')); // z ∈ [-0.020, 0.040]
  const ringGeo = new TorusGeometry(0.017, 0.0022, 8, 28);
  const ringR = new Mesh(ringGeo, gunmetal); ringR.position.z = 0.040; ringR.name = 'ringRear';
  const ringF = new Mesh(ringGeo, gunmetal); ringF.position.z = -0.020; ringF.name = 'ringFront';
  optic.add(ringR, ringF);
  const winGeo = new PlaneGeometry(0.032, 0.032);
  const winR = new Mesh(winGeo, glassMat); winR.position.z = 0.040; winR.name = 'glassRear';   // rear glass (eye side)
  const winF = new Mesh(winGeo, glassMat); winF.position.z = -0.020; winF.name = 'glassFront';  // front glass
  optic.add(winR, winF);
  const dot = new Mesh(new SphereGeometry(0.0016, 10, 8), dotMat);
  dot.name = 'reticleDot';
  dot.position.set(0, 0, -0.02);            // → local (0, SIGHT_Y, -0.02) == FRONT_LOCAL
  optic.add(dot);
  group.add(optic);
  // optic mount — kept short (z < rear glass) so it can never join the cone
  group.add(named(box(0.020, 0.028, 0.045, gunmetal, 0, 0.055, 0.010), 'opticMount'));

  // named anchors (A2)
  const rearSightAnchor = new Object3D();
  rearSightAnchor.position.copy(REAR_LOCAL);
  rearSightAnchor.name = 'rearSightAnchor';
  const frontSightAnchor = new Object3D();
  frontSightAnchor.position.copy(FRONT_LOCAL);
  frontSightAnchor.name = 'frontSightAnchor';
  const muzzleAnchor = new Object3D();
  muzzleAnchor.position.set(0, 0, -0.480);
  muzzleAnchor.name = 'muzzleAnchor';
  const stockRef = new Object3D();
  stockRef.position.set(0, -0.030, 0.415);  // rearmost point (+Z cam-space in ADS)
  stockRef.name = 'stockRef';
  group.add(rearSightAnchor, frontSightAnchor, muzzleAnchor, stockRef);

  // muzzle flash quad (F4): additive screen-facing sprite at the muzzle
  const flashTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g2 = c.getContext('2d');
    const grd = g2.createRadialGradient(32, 32, 2, 32, 32, 30);
    grd.addColorStop(0, 'rgba(255,250,225,1)');
    grd.addColorStop(0.35, 'rgba(255,190,90,0.85)');
    grd.addColorStop(1, 'rgba(255,120,30,0)');
    g2.fillStyle = grd;
    g2.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();
  const flashMat = new MeshBasicMaterial({ map: flashTex, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0 });
  const flash = new Mesh(new PlaneGeometry(0.17, 0.17), flashMat);
  flash.position.set(0, 0, -0.492);
  flash.name = 'muzzleFlash';
  group.add(flash);

  // heat shimmer billboard (F4) at the barrel tip
  const shimmerMat = new MeshBasicMaterial({ color: 0xffd9a8, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0 });
  const shimmer = new Mesh(new PlaneGeometry(0.13, 0.03), shimmerMat);
  shimmer.position.set(0, 0.012, -0.50);
  shimmer.name = 'heatShimmer';
  group.add(shimmer);

  vmScene.add(group);

  // world muzzle light (F4/G5: licks the nearest pillar): ONE reused
  // PointLight in the world scene, ~2 frames per shot (P3 budget).
  const muzzleLight = new PointLight(0xffb066, 0, 14, 2);
  muzzleLight.name = 'muzzleLight';
  scene.add(muzzleLight);
  let lightOnAt = -9;

  // ================================================== recoil pattern (F2) ===
  // 30-shot repeatable array from the seeded stream — identical every run.
  const PAT = MAG_SIZE;
  const patP = new Float32Array(PAT);   // rad per-shot pitch punch (climb)
  const patY = new Float32Array(PAT);   // rad per-shot yaw drift
  {
    let seg = rng.sign();
    let segLeft = 4 + rng.int(3);
    for (let i = 0; i < PAT; i++) {
      patP[i] = (1.2 + 3.3 * (i / (PAT - 1))) * DEG;                    // 1.2° → 4.5°
      if (segLeft-- <= 0) { seg = -seg; segLeft = 4 + rng.int(3); }     // alternating segments
      patY[i] = seg * (0.45 + 1.15 * rng.next()) * DEG + rng.gauss() * 0.04 * DEG;
    }
  }
  // weapon visual springs (zero-target, impulse driven)
  const rp = new Spring(0, RECOIL_K, RECOIL_Z);
  const ry = new Spring(0, RECOIL_K, RECOIL_Z);
  const rr = new Spring(0, 150, 0.45);                         // roll twitch
  const rtr = new Spring3(0, 0, 0, RECOIL_K, RECOIL_Z);        // translation kick
  // camera climb: accumulators + tracking springs
  let climbP = 0, climbY = 0;
  const rcp = new Spring(0, CAM_K, CAM_Z);
  const rcy = new Spring(0, CAM_K, CAM_Z);
  function zeroRecoil() {
    rp.snap(0); ry.snap(0); rr.snap(0); rtr.snap(0, 0, 0);
    rcp.snap(0); rcy.snap(0);
    climbP = 0; climbY = 0;
    state.recoilPitch = 0; state.recoilYaw = 0; state.recoilRoll = 0;
  }

  // ================================================================ state ===
  let blend = 0;          // raw 0..1 ADS blend (eased on output, A6)
  let blendE = 0;         // eased blend — published as state.ads.blend
  let fireCd = 0, dryCd = 0, smokeCd = 0;
  let patternIdx = 0, lastShotClock = -9;
  let heat = 0, bloom = 0, flashTimer = 0;
  let recoilMultNow = 1;
  let bobPhase = 0, tacPhase = 0;
  const bA = rng.range(0, 6.283), bB = rng.range(0, 6.283);    // breathing noise phases

  const reload = { active: false, tactical: false, t: 0, total: 0, phase: -1, abort: false, abortT: 0, envAtAbort: 0, slamDone: false };
  const insp = { active: false, t: 0 };
  let overdrive = false;
  bus.on('overdrive:start', () => { overdrive = true; });
  bus.on('overdrive:end', () => { overdrive = false; });

  // ---- scratch (zero per-frame allocation — P1)
  const _cp = new Vector3(), _cq = new Quaternion();
  const _v1 = new Vector3(), _v2 = new Vector3(), _v3 = new Vector3(), _v4 = new Vector3();
  const _hipP = new Vector3(), _adsP = new Vector3(), _pos = new Vector3();
  const _hipQ = new Quaternion(), _adsQ = new Quaternion(), _q = new Quaternion(), _qr = new Quaternion();
  const _e = new Euler(), _IDENT = new Quaternion();
  const _rayO = new Vector3(), _rayD = new Vector3();
  const _tracerA = new Vector3(), _tracerB = new Vector3();
  const _opt = { allHits: true };
  const _tracerGlow = { glow: true };
  const _shotEv = { ads: false, enemy: false };
  const _hitEv = { kill: false, headshot: false };
  const _dmgEv = { point: null, dmg: 0, headshot: false };
  const _killEv = { enemy: null, headshot: false, point: null };
  const _rlEv = { tactical: false };
  const _phEv = { phase: 0 };
  const _fr = { origin: new Vector3(), dir: new Vector3() };
  const _wm = { pos: new Vector3(), quat: new Quaternion() };
  const _st = {};
  const _inspOff = { x: 0, y: 0, z: 0, pitch: 0, yaw: 0, roll: 0 };
  let prevR = false, prevI = false;

  const ctrl = () => ctx.controller;
  function spreadScale() {
    const c = ctrl();
    return c && typeof c.spreadScale === 'function' ? c.spreadScale() : 1;
  }
  function adsRateMod() {
    const c = ctrl();
    return c && typeof c.adsRateMod === 'function' ? c.adsRateMod() : 1;
  }

  // ============================================================ fire path ===
  function canFire() {
    return state.phase === 'playing' && !state.killcam && !reload.active &&
      state.mag > 0 && fireCd <= 0 && input.enabled;
  }

  // current cone (deg): hip↔ADS base × crouch-ADS 0.7, + controller movement
  // scale (M4/D2), + firing bloom (F3), × OVERDRIVE 0.75 (D2)
  function spreadDeg() {
    const tight = (state.move.crouch && blendE > 0.5) ? 0.7 : 1;
    const od = overdrive ? OVERDRIVE_SPREAD : 1;
    return ((SPREAD_HIP + (SPREAD_ADS - SPREAD_HIP) * blendE) * tight * spreadScale() + bloom) * od;
  }

  // A8: camera forward rotated into the spread cone (seeded, uniform disk)
  function spreadDir(dir) {
    const rad = spreadDeg() * DEG;
    if (rad <= 1e-5) return dir;
    _q.copy(camera.getWorldQuaternion(_cq)).invert();
    _v2.set(1, 0, 0).applyQuaternion(_q);            // camera right, world
    _v3.set(0, 1, 0).applyQuaternion(_q);            // camera up, world
    const ang = Math.sqrt(rng.next()) * rad;
    const th = rng.range(0, Math.PI * 2);
    dir.addScaledVector(_v2, Math.cos(th) * Math.tan(ang));
    dir.addScaledVector(_v3, Math.sin(th) * Math.tan(ang));
    return dir.normalize();
  }

  function doFire() {
    // ---- F1: mag, cadence, counters, heat, bloom
    state.mag--;
    state.lastShotAt = time.elapsed;
    if (time.elapsed - lastShotClock > 0.6) patternIdx = 0;   // burst reset → learnable
    lastShotClock = time.elapsed;
    fireCd = SHOT_INT;
    state.accuracy.fired++;
    heat = Math.min(1, heat + 0.035);                   // F4: ~20 shots → shimmer
    bloom += SPREAD_BLOOM;

    // ---- F2: pattern impulses + camera climb
    const first = patternIdx === 0;
    const m = recoilMultNow * (first ? FIRST_MULT : 1);
    const P = patP[patternIdx] * m;
    const Y = patY[patternIdx] * m;
    rp.impulse(P * IMP_W);
    ry.impulse(Y * IMP_W);
    rr.impulse(rng.sign() * 0.30 * m);
    rtr.sz.impulse(IMP_TR_Z * m);
    rtr.sy.impulse(IMP_TR_Y * m);
    rtr.sx.impulse((Y >= 0 ? 1 : -1) * 0.06 * m);
    climbP += P * CAM_SHARE;
    climbY += Y * CAM_SHARE;
    patternIdx = (patternIdx + 1) % PAT;

    shake.add(1, 0.055);                              // F6 micro tier
    _shotEv.ads = blendE > 0.5;
    bus.emit('shot:fire', _shotEv);

    // ---- F4: flash sprite + 2-frame world light near the muzzle line
    group.updateWorldMatrix(true, false);
    flashTimer = 0.045;
    flash.rotation.z = rng.range(0, Math.PI * 2);
    flash.scale.setScalar(rng.range(0.75, 1.25));
    camera.getWorldPosition(_v1);
    camera.getWorldDirection(_v2);
    muzzleLight.position.copy(_v1).addScaledVector(_v2, 0.5);
    muzzleLight.position.y -= 0.1;
    lightOnAt = time.elapsed;

    // ---- shells: weapon-right + up eject at the muzzle anchor (F4)
    muzzleAnchor.getWorldPosition(_tracerA);
    _v3.set(1, 0.65, 0.2).applyQuaternion(group.quaternion).normalize();
    if (ctx.fx) ctx.fx.shell(_tracerA, _v3);

    // ---- muzzle smoke wisps, throttled
    smokeCd -= SHOT_INT;
    if (smokeCd <= 0) {
      smokeCd = 0.16;
      if (ctx.fx) {
        muzzleAnchor.getWorldPosition(_tracerB);
        _v4.set(0, 0, -1).applyQuaternion(group.quaternion);
        ctx.fx.muzzleSmoke(_tracerB, _v4);
      }
    }

    resolveShot();
  }

  // A8 + §5 H2/H4 + E3: bullet ray from CAMERA CENTER (never from the gun)
  function resolveShot() {
    camera.getWorldPosition(_rayO);
    camera.getWorldDirection(_rayD);
    spreadDir(_rayD);

    // E3: allHits — pass through thin layers, reducing energy, to the blocker
    const hits = ctx.world && ctx.world.raycastWorld
      ? ctx.world.raycastWorld(_rayO, _rayD, 400, _opt)
      : null;
    let target = null, energy = 1;
    if (hits && hits.length) {
      let i = 0;
      while (i < hits.length && i < 4) {
        const h = hits[i];
        if (h.surface === 'drywall' || h.surface === 'sheeting') {
          if (ctx.fx) ctx.fx.impact(h.point, h.normal, h.surface, energy * 0.5);
          if (h.surface === 'sheeting' && ctx.world.sheetingHit) ctx.world.sheetingHit(h.point);
          energy *= PEN_REDUCE;
          i++;
          continue;
        }
        if (h.surface === 'glass' && ctx.world.glassBreak) {
          if (ctx.world.glassBreak(h.object)) { energy *= 0.6; i++; continue; }   // F5 shards
        }
        break;
      }
      if (i < hits.length) target = hits[i];
    }

    // tracer from the muzzle anchor to the hit point (or 80 m downrange)
    muzzleAnchor.getWorldPosition(_tracerA);
    if (target) _tracerB.copy(target.point);
    else _tracerB.copy(_rayO).addScaledVector(_rayD, 80);
    if (ctx.fx) ctx.fx.tracer(_tracerA, _tracerB, overdrive ? _tracerGlow : undefined);

    if (!target) return;
    if (target.enemy && ctx.enemies) {
      const headshot = target.part === 'head';
      const limb = target.part === 'limb';
      const dmg = BODY_DMG * energy * (limb ? 0.85 : 1);   // H4 head 2× one-shot: enemies side
      const killed = ctx.enemies.applyHit
        ? !!ctx.enemies.applyHit(target.enemy, target.part, dmg, target.point, _rayD)
        : false;
      state.accuracy.hit++;
      if (headshot) state.accuracy.headshots++;
      if (ctx.fx) ctx.fx.bloodHit(target.point, _rayD, dmg * (headshot ? 2 : 1), headshot);
      _dmgEv.point = target.point; _dmgEv.dmg = dmg; _dmgEv.headshot = headshot;
      bus.emit('hit:damage', _dmgEv);
      _hitEv.kill = killed; _hitEv.headshot = headshot;
      bus.emit('hit:marker', _hitEv);
      if (killed) {
        _killEv.enemy = target.enemy; _killEv.headshot = headshot; _killEv.point = target.point;
        bus.emit('kill', _killEv);
        time.requestHitstop(0.05, 0.1);                    // H2: 2–3 frame hit-stop punch
        shake.add(1, 0.25);
      }
    } else if (ctx.fx) {
      ctx.fx.impact(target.point, target.normal, target.surface, energy);
    }
  }

  /** A8 public ray: camera-center origin + spread-perturbed dir (snapshot). */
  function fireRay() {
    camera.getWorldPosition(_fr.origin);
    camera.getWorldDirection(_fr.dir);
    spreadDir(_fr.dir);
    return _fr;
  }

  // ======================================================== reload (R1-R4) ===
  // R1 drop/tilt envelope: eased rise (0.14 s) → hold → eased fall (0.35 s)
  function reloadEnvOf(t, total) {
    const rise = E.easeOutCubic(E.clamp01(t / 0.14));
    const fall = 1 - E.easeInCubic(E.clamp01((t - (total - 0.35)) / 0.35));
    return Math.min(rise, fall);
  }

  function startReload(tactical) {
    if (reload.active) return;
    const mv = state.move;
    if (mv.sprint && mv.speed01 > 0.55) return;          // can't start while sprinting
    reload.active = true;
    reload.tactical = tactical;
    reload.t = 0;
    reload.phase = 0;
    reload.abort = false;
    reload.abortT = 0;
    reload.slamDone = false;
    reload.total = RELOAD.p0 + RELOAD.p1 + (tactical ? 0 : RELOAD.p2);  // R3
    insp.active = false;
    state.reload.active = true;
    state.reload.t = 0;
    state.reload.total = reload.total;
    state.reload.phase = 0;
    state.reload.tactical = tactical;
    _rlEv.tactical = tactical;
    bus.emit('reload:start', _rlEv);
    _phEv.phase = 0;
    bus.emit('reload:phase', _phEv);
  }

  function resetMags() {
    magMesh.visible = true;
    magMesh.position.copy(MAG_HOME);
    magMesh.rotation.set(0, 0, 0);
    magFresh.visible = false;
    magFresh.position.copy(MAG_HOME).add(FRESH_OFF);
    chargeHandle.position.z = CHARGE_Z;
  }

  function finishReload(aborted) {
    reload.active = false;
    reload.phase = -1;
    resetMags();
    state.reload.active = false;
    state.reload.phase = -1;
    state.reload.t = 0;
    state.reload.camRoll = 0;
    if (!aborted) state.mag = MAG_SIZE;                  // R3: tactical keeps chambered round
    _rlEv.tactical = reload.tactical;
    bus.emit(aborted ? 'reload:abort' : 'reload:end', _rlEv);
    if (!aborted) bus.emit('player:reloaded', _rlEv);    // E2 push cue for enemies
  }

  // advances choreography; returns the R1 pose envelope 0..1
  function updateReload(dt) {
    if (!reload.active) return 0;
    const mul = overdrive ? 1.3 : 1;                     // R4: OVERDRIVE → 30 % faster
    if (reload.abort) {
      reload.abortT += dt * mul;
      const p = E.clamp01(reload.abortT / RELOAD_ABORT);
      const env = reload.envAtAbort * (1 - E.easeInOutCubic(p));   // R3 quick eased return
      state.reload.t = p;
      if (p >= 1) finishReload(true);
      return env;
    }
    if (state.move.sprint && state.move.speed01 > 0.55) {         // R3: sprint cancels
      reload.abort = true;
      reload.abortT = 0;
      reload.envAtAbort = reloadEnvOf(reload.t, reload.total);
      return reload.envAtAbort;
    }
    reload.t += dt * mul;
    const t = reload.t;
    const d1 = RELOAD.p0, d2 = RELOAD.p0 + RELOAD.p1;
    const ph = (!reload.tactical && t >= d2) ? 2 : (t >= d1 ? 1 : 0);
    if (ph !== reload.phase) {
      reload.phase = ph;
      state.reload.phase = ph;
      _phEv.phase = ph;
      bus.emit('reload:phase', _phEv);                   // R2: audio stings bus-driven
      if (ph === 1) { magMesh.visible = false; magFresh.visible = true; }
    }
    state.reload.t = E.clamp01(t / reload.total);

    const p0 = E.clamp01(t / d1);
    const p1 = E.clamp01((t - d1) / RELOAD.p1);
    const p2 = E.clamp01((t - d2) / RELOAD.p2);

    // phase 0 — mag release + empty mag flies off left-down out of view (R2.1)
    if (ph === 0) {
      const e = E.easeInQuad(p0);
      magMesh.visible = true;
      magMesh.position.set(MAG_HOME.x - 0.26 * e, MAG_HOME.y - 0.42 * e, MAG_HOME.z + 0.10 * e);
      magMesh.rotation.z = 0.7 * e;
      magMesh.rotation.x = -0.5 * e;
    }
    // phase 1 — fresh mag rises from below-left, slams in with overshoot
    // (easeOutBack); at seat time the live mag takes over and the impact
    // nudges the weapon up with a spring impulse (R2.2).
    if (ph >= 1) {
      const e = E.easeOutBack(Math.min(1, p1 * 1.12), 2.2);
      magFresh.visible = p1 < 1;
      magFresh.position.set(
        MAG_HOME.x + FRESH_OFF.x * (1 - e),
        MAG_HOME.y + FRESH_OFF.y * (1 - e),
        MAG_HOME.z
      );
      if (p1 >= 1) {
        magMesh.visible = true;
        magMesh.position.copy(MAG_HOME);
        magMesh.rotation.set(0, 0, 0);
        magFresh.visible = false;
        if (!reload.slamDone) {
          reload.slamDone = true;
          rtr.sy.impulse(0.5);                           // weapon nudges up from the slam
        }
      }
    }
    // phase 2 — charging handle racks back, holds, snaps forward (R2.3)
    if (ph === 2) {
      let rack = 0;
      if (p2 < 0.32) rack = E.easeOutQuint(p2 / 0.32);
      else if (p2 < 0.52) rack = 1;
      else if (p2 < 0.68) rack = 1 - E.easeInCubic((p2 - 0.52) / 0.16);
      chargeHandle.position.z = CHARGE_Z + 0.035 * rack;
    }
    if (t >= reload.total) finishReload(false);
    return reloadEnvOf(Math.min(t, reload.total), reload.total);
  }

  // ====================================================== inspect (F7) ======
  // Eased sequence: roll out → tilt → charging-handle flick → back.
  function updateInspect(dt) {
    const o = _inspOff;
    o.x = o.y = o.z = o.pitch = o.yaw = o.roll = 0;
    if (!insp.active) return;
    if (!reload.active) chargeHandle.position.z = CHARGE_Z;
    insp.t += dt;
    const u = insp.t / INSPECT_T;
    const G0 = 0.10, G1 = 0.16, G2 = 0.26, G3 = 0.86;   // eased gates
    let env;
    if (u < G0) env = E.easeOutCubic(u / G0);
    else if (u < G3) env = 1;
    else env = 1 - E.easeInOutCubic((u - G3) / (1 - G3));
    o.x = -0.06 * env;                                   // toward screen center
    o.y = 0.06 * env;                                    // lifted into view
    o.z = 0.10 * env;                                    // closer
    o.roll = 0.45 * env * E.easeInOutCubic(E.clamp01((u - G0) / (G1 - G0)));
    o.yaw = 0.30 * env;                                  // tilt
    o.pitch = -0.12 * env - 0.16 * env * E.easeInOutQuart(E.clamp01((u - G1) / (G2 - G1)));
    if (u > G1 && u < G2 && !reload.active) {            // charging-handle flick
      const f = (u - G1) / (G2 - G1);
      const rack = f < 0.35 ? E.easeOutQuint(f / 0.35) : f < 0.55 ? 1 : 1 - E.easeInCubic((f - 0.55) / 0.45);
      chargeHandle.position.z = CHARGE_Z + 0.030 * rack;
    }
    if (insp.t >= INSPECT_T) insp.active = false;
  }

  // ======================================================== A3 ADS solve ====
  /** Test hook (A9): snaps recoil springs + accumulators to zero, then
   *  applies the pure geometry solve for one frame. Legitimate because the
   *  check is about the solve, not the dynamics (see header). */
  function forceAdsSolve() {
    zeroRecoil();
    bloom = 0;
    camera.getWorldPosition(_cp);
    camera.getWorldQuaternion(_cq);
    _pos.set(0, 0, -EYE_RELIEF).sub(REAR_LOCAL);
    group.quaternion.copy(_cq);
    group.position.copy(_cp).add(_v1.copy(_pos).applyQuaternion(_cq));
    group.updateWorldMatrix(true, true);
    vmCamera.position.copy(_cp);
    vmCamera.quaternion.copy(_cq);
    vmCamera.fov = FOV_VM;
    vmCamera.aspect = camera.aspect;
    vmCamera.updateProjectionMatrix();
  }

  // ================================================================ loop ====
  function update(dt, elapsed) {
    camera.getWorldPosition(_cp);
    camera.getWorldQuaternion(_cq);

    // vmCamera replicates the world camera transform EXACTLY; its fov is
    // fixed at FOV_VM (A5b) — the decoupling is deliberate: the sight line
    // is solved, so world FOV changes cannot move the aiming point.
    vmCamera.position.copy(_cp);
    vmCamera.quaternion.copy(_cq);
    if (vmCamera.aspect !== camera.aspect) {
      vmCamera.aspect = camera.aspect;
      vmCamera.updateProjectionMatrix();
    }

    const playing = state.phase === 'playing' && !state.killcam;

    // ---- key edges: R reload (§6), I inspect (F7). Main owns the T binding.
    const rDown = playing && input.down('KeyR');
    if (rDown && !prevR && state.mag < MAG_SIZE) startReload(state.mag > 0);
    prevR = rDown;
    const iDown = playing && input.down('KeyI');
    if (iDown && !prevI && !reload.active) { insp.active = true; insp.t = 0; }
    prevI = iDown;

    // ---- ADS blend (A6): ~150 ms easeInOut each way (rate hookable); firing
    // stays available at any point of the transition.
    const adsHold = playing && !!input.rmb;
    state.ads.hold = adsHold;
    const rate = dt * (1 / ADS_TIME) * adsRateMod();
    blend = adsHold ? Math.min(1, blend + rate) : Math.max(0, blend - rate);
    blendE = E.easeInOutCubic(blend);
    state.ads.blend = blendE;
    state.ads.fovTarget = FOV_WORLD + (FOV_WORLD_ADS - FOV_WORLD) * blendE;

    // ---- firing (F1)
    fireCd -= dt;
    dryCd -= dt;
    recoilMultNow =
      (1 - 0.4 * blendE) *               // ADS ×0.6 at full blend (A6)
      (state.move.crouch ? 0.8 : 1) *    // crouch ×0.8
      (state.move.sprint ? 1.3 : 1);     // sprint ×1.3
    state.firing = false;
    if (playing && input.lmb) {
      if (insp.active && !reload.active) insp.active = false;    // shooting cancels inspect
      if (canFire()) { doFire(); state.firing = true; }
      else if (state.mag <= 0 && !reload.active && dryCd <= 0) {
        dryCd = 0.55;
        bus.emit('shot:dry', undefined);           // F1: dry click only, no auto-reload
      }
    }

    // ---- springs, bloom (ease-out decay), heat cooling
    rp.update(dt); ry.update(dt); rr.update(dt); rtr.update(dt);
    bloom = Math.max(0, bloom - (bloom * 6.5 + 1.2) * dt);
    heat = Math.max(0, heat - dt * (heat > 0.35 ? 0.18 : 0.10));   // F4 cool (gain 0.035/shot > cool at 700rpm → shimmer reachable)

    // ---- camera climb: track accumulators; recover after trigger release
    if (time.elapsed - lastShotClock > 0.6) {
      const rec = Math.exp(-dt * 5.5);
      climbP *= rec; climbY *= rec;
    }
    rcp.set(climbP); rcy.set(climbY);
    rcp.update(dt); rcy.update(dt);
    // publish ABSOLUTE current offsets (integrator ruling — controller adds
    // these to the final camera angles; weapon owns the decay, so after
    // recovery every channel returns to exactly 0 → no aim drift).
    state.recoilPitch = rcp.value;
    state.recoilYaw = rcy.value;
    // climb already reached ctx.camera this frame via the controller, and
    // the weapon pose is composed FROM the camera transform, so the sight
    // line follows the pitched aim automatically — nothing to re-apply.

    // ---- choreography envelopes
    updateInspect(dt);
    const rEnv = updateReload(dt);
    state.reload.camRoll = rEnv;                    // 0..1 eased (R1), opt-in for world cam

    // ---- HIP pose (A4), camera space: base offset right/low, ~4° canted
    // roll inward, muzzle slightly down + all F7 layers:
    const mv = state.move;
    const sp01 = mv.speed01 || 0;
    bobPhase += dt * (3.5 + 9 * sp01);
    tacPhase += dt * 3.4 * (1 + sp01 * 0.35);
    _hipP.set(
      0.20
        + Math.sin(bobPhase) * 0.011 * (0.25 + sp01)                 // run bob
        + Math.cos(bobPhase * 2) * 0.003 * sp01
        + _inspOff.x,
      -0.19
        + Math.sin(bobPhase * 2) * 0.008 * (0.2 + sp01)
        - (mv.crouch ? 0.030 : 0)                                    // crouch lower
        - (mv.slide ? 0.045 : 0)
        - (mv.sprint ? 0.050 : 0)                                    // sprint lowers
        - (mv.landImpulse || 0) * 0.07                               // landing dip sink
        + (mv.tacsprint ? Math.sin(tacPhase * Math.PI * 2) * 0.038 : 0)  // F7 arm pump
        + _inspOff.y,
      -0.42
        + (mv.wallBump || 0) * 0.05                                  // wall-bump push-in
        + (mv.sprint ? 0.030 : 0)
        + (mv.tacsprint ? Math.cos(tacPhase * Math.PI * 2) * 0.020 : 0)
        + _inspOff.z
    );
    // idle breathing sway (slow sine + detune), suppressed in ADS (A6)
    const breathe = (1 - 0.85 * blendE) * (1 - 0.5 * sp01);
    _hipP.x += (Math.sin(elapsed * 0.62 + bA) * 0.0042 + Math.sin(elapsed * 1.13 + bB) * 0.0022) * breathe;
    _hipP.y += (Math.sin(elapsed * 0.47 + bB) * 0.0034 + Math.sin(elapsed * 0.97 + bA) * 0.0016) * breathe;
    // reload drop/tilt inward toward the camera (R1)
    _hipP.y -= 0.16 * rEnv;
    _hipP.x -= 0.06 * rEnv;
    _hipP.z += 0.07 * rEnv;
    const hipPitch = -0.09                                           // muzzle angled down (A4)
      - (mv.sprint ? 0.30 : 0)
      - (mv.slide ? 0.12 : 0)
      + (mv.tacsprint ? Math.sin(tacPhase * Math.PI * 2) * 0.13 : 0)
      + 0.24 * rEnv
      + _inspOff.pitch;
    const hipYaw = 0.05
      + (mv.sprint ? 0.12 : 0)
      - (mv.lean || 0) * 0.05
      + _inspOff.yaw;
    const hipRoll = 0.07                                             // ~4° canted inward
      - (mv.slide ? 10 * DEG : 0)                                    // slide cant −10°
      + (mv.sprint ? 0.26 : 0)
      + (mv.lean || 0) * 0.05
      - 0.34 * rEnv
      + _inspOff.roll;
    _e.set(hipPitch, hipYaw, hipRoll);
    _hipQ.setFromEuler(_e);

    // ---- ADS SOLVED pose (A3): identity orientation (upright, sight axis on
    // the view axis) + translation putting rearSightAnchor exactly at eye relief.
    _adsP.set(0, 0, -EYE_RELIEF).sub(REAR_LOCAL);
    _adsQ.copy(_IDENT);

    // ---- full-transform blend (A4) + recoil ON TOP of the solve
    _pos.lerpVectors(_hipP, _adsP, blendE);
    _q.copy(_hipQ).slerp(_adsQ, blendE);
    // camera-space rotation: per-shot punch springs ONLY. The cumulative
    // climb reaches the gun through the camera transform itself — the
    // controller adds state.recoilPitch/Yaw to the camera, and the weapon
    // pose is composed FROM ctx.camera. Re-adding climbP here would double
    // the climb and point the dot above where the camera-center bullet ray
    // goes.
    _e.set(rp.value, ry.value, rr.value);
    _q.premultiply(_qr.setFromEuler(_e));

    // weapon world transform = camera transform ∘ camera-space pose
    group.quaternion.copy(_cq).multiply(_q);
    group.position.copy(_cp).add(_v1.copy(_pos).applyQuaternion(_cq));

    // R1: reload camera roll rides the SAME absolute channel (controller
    // adds it to the world camera; vmCamera replicates the world camera
    // transform, so the viewmodel roll follows for free — eased, ~2.5° max,
    // exactly 0 outside reloads).
    state.recoilRoll = rEnv * 2.5 * DEG;

    group.updateWorldMatrix(true, true);

    // ---- flash / world light / heat visuals (F4)
    if (flashTimer > 0) {
      flashTimer -= dt;
      flashMat.opacity = Math.max(0, flashTimer / 0.045);
    } else if (flashMat.opacity !== 0) {
      flashMat.opacity = 0;
    }
    const lightAge = time.elapsed - lightOnAt;
    muzzleLight.intensity = lightAge >= 0 && lightAge < 0.05 ? 26 * (1 - lightAge / 0.05) : 0;

    barrelMat.emissive.setRGB(heat * 1.15, heat * 0.34, heat * 0.06);   // barrel heat glow
    if (heat > 0.6) {
      shimmerMat.opacity = ((heat - 0.6) / 0.4) * (0.09 + 0.05 * Math.sin(elapsed * 29));
      shimmer.scale.set(1 + 0.18 * Math.sin(elapsed * 23), 1 + 0.1 * Math.cos(elapsed * 17), 1);
    } else if (shimmerMat.opacity !== 0) {
      shimmerMat.opacity = 0;
    }

    // ---- crosshair (F3): gap in px from the angular cone at WORLD fov;
    // blooms firing/moving, tightens still, fades fully in ADS.
    const hpx = (ctx.renderer && ctx.renderer.domElement ? ctx.renderer.domElement.clientHeight : window.innerHeight) * 0.5;
    const pxPerRad = hpx / Math.tan(camera.fov * DEG * 0.5);
    state.crosshair.gap = Math.max(2, spreadDeg() * DEG * pxPerRad + 4);
    state.crosshair.alpha = (1 - blendE) * (playing ? 1 : 0);
  }

  // ============================================================ public API ==
  return {
    group,
    rearSightAnchor,
    frontSightAnchor,
    muzzleAnchor,
    stockRef,
    update,
    canFire,
    tryFire() { if (canFire() && input.lmb) doFire(); },
    fireRay,
    recoilKickWorld() {
      return _v4.set(rtr.sx.value, rtr.sy.value, rtr.sz.value);
    },
    adsBlend: () => blendE,
    worldMuzzle() {
      group.updateWorldMatrix(true, false);
      muzzleAnchor.getWorldPosition(_wm.pos);
      _wm.quat.copy(group.quaternion);
      return _wm;
    },
    reload() {
      if (state.phase === 'playing' && state.mag < MAG_SIZE) startReload(state.mag > 0);
    },
    inspect() {
      if (!reload.active && state.phase === 'playing') { insp.active = true; insp.t = 0; }
    },
    reset() {
      zeroRecoil();
      blendE = 0; heat = 0; bloom = 0; flashTimer = 0;
      patternIdx = 0; lastShotClock = -9;
      bobPhase = 0; tacPhase = 0;
      reload.active = false; reload.t = 0; reload.phase = -1; reload.abort = false;
      insp.active = false;
      state.reload.active = false; state.reload.phase = -1;
      state.ads.blend = 0; state.ads.hold = false;
      magMesh.visible = true; magFresh.visible = false;
      magMesh.position.copy(MAG_HOME);
      magFresh.position.copy(MAG_HOME).add(FRESH_OFF);
    },
    zeroRecoil,
    stats() {
      _st.heat = heat;
      _st.spreadDeg = spreadDeg();
      _st.bloom = bloom;
      _st.patternIdx = patternIdx;
      _st.adsBlend = blendE;
      _st.reloading = reload.active;
      _st.reloadTactical = reload.tactical;
      _st.mag = state.mag;
      _st.inspecting = insp.active;
      _st.climbPitch = climbP;
      return _st;
    },
    // A9 test hook — see header for the recoil-zeroed contract.
    forceAdsSolve,
    recoilPatternPitch: patP,
    recoilPatternYaw: patY,
  };
}
