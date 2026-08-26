// M1-M7 — first-person movement machine (Controller agent).
// Owns: yaw/pitch springs, ground/air physics vs world.bounds, gravity+jump+air control (M1),
// sprint/tac-sprint (M2), momentum slide (M3), crouch (M4), lean + auto-peek (M5), two-phase
// mantle (M6), wall-bump ray (F7), landing dip + shake consumption (F6), FOV composition
// (base + ADS + sprint kick + hit/land), footstep/dust bus events, D6 no-damage bookkeeping.
// Writes state.move.* and ctx.camera pose every frame.
// C5/M7: every transition runs through a damped spring or a named easing — crouch-slide-lean-ADS
// combinations blend, never snap or fight each other.
// P1: zero per-frame allocation — all vector math on hoisted scratch; the wall-bump ray is an
// analytic slab-vs-AABB test against a cache built once at init (cheaper than Raycaster churn;
// world.raycastWorld is only called from auto-peek, throttled to ~8 Hz while ADS near cover).
import { Euler, Vector3, Box3, Matrix4, MathUtils } from 'three';
import { input } from '../core/input.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { shake } from '../core/shake.js';
import { time } from '../core/time.js';
import { Spring } from '../core/spring.js';
import * as E from '../core/easings.js';

// ------------------------------------------------------------------ tuning
const GRAVITY = -22;             // m/s^2 (spec)
const JUMP_V = 7.0;              // ~1.1 m apex — CoD-fast
const WALK_SPEED = 5.2;          // M1 base
const CROUCH_SPEED = 2.6;        // M4 half speed
const SPRINT_SPEED = 7.3;        // M2
const TAC_SPEED = 8.4;           // M2 tac-sprint
const ACCEL_GND = 16;            // ease-out accel toward wish velocity (exp approach)
const FRICTION = 13;             // ease-out decay to rest, no input
const ACCEL_AIR = 5;             // M1 air control: reduced accel, horizontal preserved
const SLIDE_TIME = 0.9;          // M3 duration
const SLIDE_ENTER_SPEED = 4.8;   // must be at ~sprint to break into a slide
const SLIDE_KEEP = 0.92;         // M3 initial velocity retention
const SLIDE_JUMP_KEEP = 0.6;     // M3 slide-jump preserves 60 % horizontal momentum
const SLIDE_DUST_STEP = 0.14;    // 'slide:dust' cadence (s)
const MANTLE_TIME = 0.45;        // M6 total vault
const MANTLE_A = 0.4;            // phase A share: rise + push-in, easeOutCubic
const MANTLE_TOP_MIN = 0.95;     // qualifying tops: hip…chest
const MANTLE_TOP_MAX = 1.62;
const MANTLE_REACH = 1.35;       // face distance to trigger
const EYE_STAND = 1.7;
const EYE_CROUCH = 1.1;          // M4 0.6 m drop (k=400 ζ=1 ≈ 200 ms critical)
const PLAYER_RADIUS = 0.35;
const STEP_UP = 0.45;            // steppable height; shrinks with crouch (collider 1.7→1.1)
const BASE_FOV = 75;             // A6: 75 → 55 via ADS blend
const ADS_FOV_SPAN = -20;
const TAC_BUDGET = 4.5;          // tac-sprint window (s of continued sprinting)
const STRIDE_MIN = 1.7;          // footstep spacing (m): walk…
const STRIDE_MAX = 2.3;          // …top speed
const WALL_RANGE = 0.72;         // F7 forward bump-ray length
const PEEK_RANGE = 7.0;          // M5 auto-peek LOS distance
const PEEK_COVER_DIST = 1.6;     // M5 "next to cover"
const PEEK_INTERVAL = 0.12;      // re-decide at ~8 Hz — bounds raycastWorld churn
const LEAN_OFFSET = 0.45;        // M5 lateral offset (m)
const LEAN_ROLL = 8 * Math.PI / 180;
const SLIDE_CANT = -4 * Math.PI / 180;
const MOUSE_SENS = 0.0032;       // rad/px (~0.18°/px) at input.sensitivity = 1
const PITCH_LIMIT = 1.484;       // ±85°
const COVER_BLOCK_H = 1.1;       // cover props treated as body-height blockers (no top in contract)
const MAX_BOXES = 640;

// ---------------------------------------------------------------- scratch (hoisted; never per-frame)
const scratchEye = new Vector3();
const scratchFwd = new Vector3();
const scratchDust = new Vector3();
const scratchPeekEye = new Vector3();
const scratchPeekDir = new Vector3();
const eulerOut = new Euler(0, 0, 0, 'YXZ');
const footPayload = { surface: 'concrete', speed: 0 };
const dustPayload = { point: scratchDust };   // fx reads synchronously (bus is sync)

function fin(v, d) { return Number.isFinite(v) ? v : d; }

export function init(ctx) {
  const camera = ctx.camera;
  const world = ctx.world || {};
  const bounds = world.bounds || { minX: -22, maxX: 22, minZ: -17, maxZ: 17, floorY: 0 };
  const mantles = Array.isArray(world.mantles) ? world.mantles : [];
  const cover = Array.isArray(world.cover) ? world.cover : [];

  // ------------------------------------------------------------- sim state
  const pos = new Vector3();                 // feet position
  const vel = new Vector3();                 // m/s; y = vertical
  let grounded = true;
  let fallSpeed = 0;                         // positive-down at touchdown
  let sprintingPrev = false;                 // slide gate reads last frame's sprint (Ctrl kills it same frame)
  let tacLeft = 0;                           // tac-sprint breath window
  let slideOn = false, slideT = 0, slideDustT = 0;
  let slideSide = -1;                        // cant direction (±1), fixed at entry
  const slideV0 = new Vector3();
  let mantleOn = false, mantleT = 0;
  let spaceWas = false;
  let bobPhase = 0;                          // strides (fractional); integer crossings → footstep
  let strideEmitted = 0;
  let peekTimer = 0;
  let peekDir = 0;                           // committed auto-peek side: -1 | 0 | +1
  const mP0 = new Vector3(), mP1 = new Vector3(), mP2 = new Vector3(), mPrev = new Vector3();

  // ------------------------------------------------------------- springs (M7: nothing snaps)
  const yawS = new Spring(0, 10000, 1);       // mouse look: spring-owned but ~60 ms settle — crisp (M1)
  const pitchS = new Spring(0, 10000, 1);
  const eyeS = new Spring(EYE_STAND, 400, 1);          // M4 crouch drop
  const leanS = new Spring(0, 90, 0.9);                // M5 Q/E
  const peekS = new Spring(0, 90, 0.85);               // M5 auto-peek
  const slideAmtS = new Spring(0, 110, 1);             // slide pose blend
  const sprintAmtS = new Spring(0, 55, 1);             // (tac)sprint pose blend
  const tacAmtS = new Spring(0, 80, 1);                // tac-sprint pose blend
  const airAmtS = new Spring(0, 120, 1);               // airborne blend (spread)
  const landS = new Spring(0, 55, 1);                  // landing dip impulse → decay
  const wallS = new Spring(0, 140, 1);                 // F7 wall-bump blend
  const fovS = new Spring(BASE_FOV, 140, 1);           // composed FOV
  const fovKickS = new Spring(0, 60, 1);               // sprint/tac FOV kick (+5 / +7.5), consumed by compose
  const handS = new Spring(0, 160, 1);                 // M6 hand-plant (weapon offscreen)

  // ------------------------------------------------------------- static AABB cache (F7 wall ray)
  // One-shot init: world-space AABB per surface mesh (per-instance for InstancedMesh).
  // Rotated boxes are enclosed conservatively — fine for a proximity bump test.
  const bMinX = new Float64Array(MAX_BOXES), bMaxX = new Float64Array(MAX_BOXES);
  const bMinY = new Float64Array(MAX_BOXES), bMaxY = new Float64Array(MAX_BOXES);
  const bMinZ = new Float64Array(MAX_BOXES), bMaxZ = new Float64Array(MAX_BOXES);
  let nBoxes = 0;
  {
    const tmpBox = new Box3();
    const tmpMat = new Matrix4();
    const im = new Matrix4();                      // per-instance matrix scratch
    const addBoxFrom = (mesh, mat) => {
      if (nBoxes >= MAX_BOXES || !mesh || !mesh.geometry) return;
      const geo = mesh.geometry;
      if (!geo.boundingBox) geo.computeBoundingBox();
      if (!geo.boundingBox) return;
      tmpBox.copy(geo.boundingBox).applyMatrix4(mat);
      if (tmpBox.isEmpty()) return;
      bMinX[nBoxes] = tmpBox.min.x; bMaxX[nBoxes] = tmpBox.max.x;
      bMinY[nBoxes] = tmpBox.min.y; bMaxY[nBoxes] = tmpBox.max.y;
      bMinZ[nBoxes] = tmpBox.min.z; bMaxZ[nBoxes] = tmpBox.max.z;
      nBoxes++;
    };
    const collect = (mesh) => {
      if (!mesh || mesh.isCamera || mesh.isLight) return;
      if (mesh.isInstancedMesh) {
        mesh.updateWorldMatrix(true, false);
        for (let i = 0; i < mesh.count && nBoxes < MAX_BOXES; i++) {
          mesh.getMatrixAt(i, im);                 // im: Matrix4 scratch
          tmpMat.copy(mesh.matrixWorld).multiply(im);
          addBoxFrom(mesh, tmpMat);
        }
      } else if (mesh.isMesh) {
        mesh.updateWorldMatrix(true, false);
        addBoxFrom(mesh, mesh.matrixWorld);
      }
    };
    const src = world.surfaces;
    if (Array.isArray(src)) for (let i = 0; i < src.length; i++) collect(src[i]);
    else if (src && typeof src.traverse === 'function') src.traverse(collect);
  }

  /** Nearest hit distance of an analytic forward ray vs the AABB cache, or -1. Zero alloc. */
  function wallDist(ox, oy, oz, dx, dy, dz, maxD) {
    let best = -1;
    for (let i = 0; i < nBoxes; i++) {
      let tmin = 0, tmax = maxD, skip = false;
      let a, b, t;
      if (Math.abs(dx) < 1e-8) { if (ox < bMinX[i] || ox > bMaxX[i]) skip = true; }
      else {
        a = (bMinX[i] - ox) / dx; b = (bMaxX[i] - ox) / dx;
        if (a > b) { t = a; a = b; b = t; }
        if (a > tmin) tmin = a; if (b < tmax) tmax = b;
      }
      if (!skip) {
        if (Math.abs(dy) < 1e-8) { if (oy < bMinY[i] || oy > bMaxY[i]) skip = true; }
        else {
          a = (bMinY[i] - oy) / dy; b = (bMaxY[i] - oy) / dy;
          if (a > b) { t = a; a = b; b = t; }
          if (a > tmin) tmin = a; if (b < tmax) tmax = b;
        }
      }
      if (!skip) {
        if (Math.abs(dz) < 1e-8) { if (oz < bMinZ[i] || oz > bMaxZ[i]) skip = true; }
        else {
          a = (bMinZ[i] - oz) / dz; b = (bMaxZ[i] - oz) / dz;
          if (a > b) { t = a; a = b; b = t; }
          if (a > tmin) tmin = a; if (b < tmax) tmax = b;
        }
      }
      if (!skip && tmax >= tmin && tmax > 0) {
        const hit = tmin > 0 ? tmin : 1e-6;
        if (hit < maxD && (best < 0 || hit < best)) best = hit;
      }
    }
    return best;
  }

  function mantleTop(r) {
    const c = r && r.min && r.min.center, h = r && r.min && r.min.half;
    return c && h ? fin(r.top, c.y + h.y) : 0;
  }

  /** Support floor under (x,z): arena floor plus landable mantle tops within reach. */
  function supportY(x, z, feetY, stH) {
    let s = bounds.floorY;
    for (let i = 0; i < mantles.length; i++) {
      const r = mantles[i];
      const c = r && r.min && r.min.center, h = r && r.min && r.min.half;
      if (!c || !h) continue;
      if (x < c.x - h.x || x > c.x + h.x || z < c.z - h.z || z > c.z + h.z) continue;
      const top = mantleTop(r);
      if (top <= feetY + stH + 0.001 && top > s) s = top;
    }
    return s;
  }

  /** Push out of solid props: too-tall mantle boxes + cover blockers. Crouch shrink feeds stH. */
  function collideProps(stH) {
    for (let i = 0; i < mantles.length; i++) {
      const r = mantles[i];
      const c = r && r.min && r.min.center, h = r && r.min && r.min.half;
      if (!c || !h) continue;
      const top = mantleTop(r);
      if (top <= pos.y + stH || pos.y >= top - 0.02) continue;   // steppable / standing on it
      const rx = h.x + PLAYER_RADIUS, rz = h.z + PLAYER_RADIUS;
      const dxp = pos.x - c.x, dzp = pos.z - c.z;
      const ox = rx - Math.abs(dxp), oz = rz - Math.abs(dzp);
      if (ox <= 0 || oz <= 0) continue;
      const sx = dxp >= 0 ? 1 : -1, sz = dzp >= 0 ? 1 : -1;
      if (ox < oz) {
        pos.x = c.x + sx * rx;
        if (sx * vel.x > 0) vel.x = 0;
      } else {
        pos.z = c.z + sz * rz;
        if (sz * vel.z > 0) vel.z = 0;
      }
    }
    // cover props (pillars/crates/drywall) as radial blockers while feet are below their top
    for (let i = 0; i < cover.length; i++) {
      const cv = cover[i];
      if (!cv || !cv.pos) continue;
      const rad = fin(cv.radius, 0.5) + PLAYER_RADIUS;
      if (pos.y > cv.pos.y + COVER_BLOCK_H) continue;             // above it — walk over/past
      const dxp = pos.x - cv.pos.x, dzp = pos.z - cv.pos.z;
      const d2 = dxp * dxp + dzp * dzp;
      if (d2 >= rad * rad) continue;
      const d = Math.sqrt(d2) || 1e-4;
      const nx = dxp / d, nz = dzp / d;
      pos.x = cv.pos.x + nx * rad;
      pos.z = cv.pos.z + nz * rad;
      const vn = vel.x * nx + vel.z * nz;
      if (vn < 0) { vel.x -= vn * nx; vel.z -= vn * nz; }
    }
  }

  /** Nearest qualifying mantle region within reach ahead of facing (M6), else -1.
   *  minSpeed gates the jump-trigger (must be moving); prompts pass 0. */
  function findMantle(fx, fz, speed, minSpeed) {
    if (speed < (minSpeed === undefined ? 1.2 : minSpeed)) return -1;
    let best = -1, bestGap = MANTLE_REACH + 0.001;
    for (let i = 0; i < mantles.length; i++) {
      const r = mantles[i];
      const c = r && r.min && r.min.center, h = r && r.min && r.min.half;
      if (!c || !h) continue;
      const top = mantleTop(r);
      if (top < MANTLE_TOP_MIN || top > MANTLE_TOP_MAX) continue;
      const dxp = c.x - pos.x, dzp = c.z - pos.z;
      const dist = Math.hypot(dxp, dzp);
      const facing = dist > 1e-4 ? (dxp * fx + dzp * fz) / dist : 0;
      if (facing < 0.35) continue;                                 // must be roughly ahead
      const ext = Math.abs(fx) * h.x + Math.abs(fz) * h.z;         // box extent along facing
      const gap = dist - ext;
      if (gap < -0.4 || gap > MANTLE_REACH) continue;
      if (gap < bestGap) { bestGap = gap; best = i; }
    }
    return best;
  }

  function beginMantle(idx) {
    const r = mantles[idx];
    const c = r.min.center, h = r.min.half;
    const top = mantleTop(r);
    let ex = c.x - pos.x, ez = c.z - pos.z;
    const el = Math.hypot(ex, ez) || 1;
    ex /= el; ez /= el;
    const ext = Math.abs(ex) * h.x + Math.abs(ez) * h.z;
    mP0.copy(pos);
    mP2.set(c.x + ex * (ext + 0.62), top, c.z + ez * (ext + 0.62));    // land just past the ledge
    mP1.set((mP0.x + mP2.x) * 0.5, Math.max(mP0.y, top) + 1.05, (mP0.z + mP2.z) * 0.5); // arc over
    mantleOn = true;
    mantleT = 0;
    slideAmtS.set(0); // slide (if any) is subsumed by the vault pose
    vel.set(0, 0, 0);
    sprintAmtS.set(0); tacAmtS.set(0); sprintingPrev = false; tacLeft = 0;
    if (slideOn) endSlide();
    bus.emit('mantle:start', null);
  }

  function beginSlide(rightX, rightZ) {
    slideOn = true;
    slideT = 0;
    slideDustT = 0;
    slideAmtS.set(1);
    tacLeft = 0;
    slideV0.set(vel.x * SLIDE_KEEP, 0, vel.z * SLIDE_KEEP);
    // cant toward the velocity's lateral component; deterministic fallbacks, never rng
    const lat = vel.x * rightX + vel.z * rightZ;
    slideSide = Math.abs(lat) > 0.3 ? (lat >= 0 ? 1 : -1) : (input.strafe !== 0 ? input.strafe : -1);
    bus.emit('slide:start', null);
  }

  function endSlide() {
    if (!slideOn) return;
    slideOn = false;
    slideAmtS.set(0);
    bus.emit('slide:end', null);
  }

  /** M1/F6: touchdown bookkeeping — dip impulse scaled by fall speed + tier-1 shake. */
  function touchdown(speed) {
    const fs = Math.max(0, fin(speed, 0));
    fallSpeed = fs;
    if (fs > 2.2) {
      const dip = Math.min(1, fs / 13);
      landS.snap(0);
      landS.vel += dip * 10;                                     // magnitude from fall speed; spring decays
      shake.add(1, dip * 0.1);                                   // F6: landing dip + micro-shake
    }
  }

  // ------------------------------------------------------------- tac-sprint (input.js double-taps)
  const offTacSprint = bus.on('input:tacsprint', () => { tacLeft = TAC_BUDGET; });

  // ------------------------------------------------------------- camera write
  // Composition order (fixed): yaw(world) → pitch(local) → lean/cant roll → shake → recoil.
  function applyCamera(yaw, pitch, roll, latOff, bobY, dipY) {
    camera.position.set(
      pos.x + Math.cos(yaw) * latOff,
      pos.y + eyeS.value + bobY + dipY,
      pos.z - Math.sin(yaw) * latOff,
    );
    eulerOut.set(pitch, yaw, roll, 'YXZ');
    camera.quaternion.setFromEuler(eulerOut);
  }

  // ------------------------------------------------------------- helpers
  function eyeNorm() { return E.clamp01((EYE_STAND - eyeS.value) / (EYE_STAND - EYE_CROUCH)); }
  function crouchActive() { return eyeS.value < EYE_STAND - 0.25; }
  function stepHeight() { return STEP_UP - 0.2 * eyeNorm(); }   // M4: shrunk collider climbs less

  /** M2: ADS out of tac-sprint is slower (weapon multiplies its ADS rate by this). */
  function adsRateMod() {
    return 1 - 0.45 * tacAmtS.value - 0.15 * sprintAmtS.value * (1 - tacAmtS.value);
  }

  /** D2/§7: combined spread multiplier — all factors continuous spring blends (no snap). */
  function spreadScale() {
    const adsB = E.clamp01(fin(state.ads.blend, 0));
    const cr = eyeNorm();
    const speed01 = E.clamp01(Math.hypot(vel.x, vel.z) / TAC_SPEED);
    let s = 1;
    s *= 1 + speed01 * 0.8;                                   // moving: ×(1..1.8)
    s *= 1 - 0.65 * adsB;                                     // ADS: ×0.35
    s *= 1 - cr * (0.2 + 0.25 * adsB);                        // crouch ×0.8, +ADS ×0.55 (tightest)
    s *= 1 + 1.6 * sprintAmtS.value * (1 - slideAmtS.value);  // sprint ×2.6
    s *= 1 + 1.2 * slideAmtS.value;                           // slide ×2.2
    s *= 1 + airAmtS.value;                                   // airborne ×2
    return s;
  }

  // ------------------------------------------------------------- update
  function update(dt, elapsed) {
    dt = Math.max(0, fin(dt, 0));
    const mouse = input.consumeMouse();                        // exactly once per frame (M1)
    const playing = state.phase === 'playing' && !state.killcam;

    // ---- look: targets advance only while playing; springs always settle.
    // Mouse deltas are consumed even when paused so nothing dumps on resume (K3).
    const sens = MOUSE_SENS * fin(input.sensitivity, 1);
    if (playing && input.locked && input.enabled !== false) {
      yawS.target -= fin(mouse.x, 0) * sens;
      pitchS.target = MathUtils.clamp(pitchS.target - fin(mouse.y, 0) * sens, -PITCH_LIMIT, PITCH_LIMIT);
    }
    // M1: mouse look is applied 1:1 — a spring here reads as mouse lag
    // (CoD crispness = zero filter on aim). Springs stay for body motion.
    yawS.value = yawS.target; yawS.vel = 0;
    pitchS.value = pitchS.target; pitchS.vel = 0;
    const yaw = yawS.value, pitch = pitchS.value;

    // facing basis (scalar — no Vector3 churn; Euler YXZ forward)
    const sinY = Math.sin(yaw), cosY = Math.cos(yaw);
    const fwdX = -sinY, fwdZ = -cosY;
    const rightX = cosY, rightZ = -sinY;

    const spaceDown = input.down('Space') && input.enabled !== false && state.phase === 'playing';
    const spaceEdge = spaceDown && !spaceWas;
    spaceWas = spaceDown;

    const adsB = E.clamp01(fin(state.ads.blend, 0));
    const crouchKey = input.down('ControlLeft') || input.down('ControlRight');
    const sprintKey = input.down('ShiftLeft') || input.down('ShiftRight');
    const fIn = input.enabled !== false ? input.forward : 0;
    const sIn = input.enabled !== false ? input.strafe : 0;
    let hspeed = Math.hypot(vel.x, vel.z);

    if (mantleOn && playing) {
      // ------------------------------------------------ M6: two-phase eased vault, inputs cancelled
      mantleT += dt;
      const raw = E.clamp01(mantleT / MANTLE_TIME);
      const earlyOut = spaceEdge && raw > 0.7;                     // jump-interrupt late in the vault
      let s;
      if (earlyOut) s = 1;
      else if (raw < MANTLE_A) s = MANTLE_A * E.easeOutCubic(raw / MANTLE_A);
      else s = MANTLE_A + (1 - MANTLE_A) * E.easeInOutCubic((raw - MANTLE_A) / (1 - MANTLE_A));
      mPrev.copy(pos);
      const u = 1 - s, uu = u * u, ss = s * s;
      pos.set(
        uu * mP0.x + 2 * u * s * mP1.x + ss * mP2.x,             // quadratic bezier past the AABB
        uu * mP0.y + 2 * u * s * mP1.y + ss * mP2.y,
        uu * mP0.z + 2 * u * s * mP1.z + ss * mP2.z,
      );
      const inv = dt > 1e-5 ? 1 / dt : 0;
      vel.set((pos.x - mPrev.x) * inv * 0.2, 0, (pos.z - mPrev.z) * inv * 0.2);
      // hand-plant: peaks through phase A, releases across early phase B → state.move.mantleHand
      handS.set(raw < 0.45 ? E.easeOutCubic(raw / 0.45) : 1 - E.easeInOutCubic(E.clamp01((raw - 0.45) / 0.35)));
      if (raw >= 1 || earlyOut) {
        mantleOn = false;
        handS.set(0);
        vel.set(fwdX * 3.4, 0, fwdZ * 3.4);                      // exit momentum — no dead frame
        landS.snap(0); landS.vel += 4.5;                         // small dip at landing
        shake.add(1, 0.03);
        grounded = true;
        if (spaceEdge) { vel.y = JUMP_V; grounded = false; }
      }
    } else if (playing && dt > 0) {
      // ------------------------------------------------ M2: sprint / tac-sprint
      const wantSprint = sprintKey && fIn > 0.25 && !crouchKey && grounded && adsB < 0.06 && !state.ads.hold;
      if (!wantSprint) tacLeft = 0;
      const tacs = wantSprint && tacLeft > 0;
      if (tacs) tacLeft = Math.max(0, tacLeft - dt);
      sprintAmtS.set(wantSprint || slideOn ? 1 : 0);
      tacAmtS.set(tacs ? 1 : 0);

      // ------------------------------------------------ M3: slide trigger (Ctrl while sprinting)
      if (!slideOn && crouchKey && (wantSprint || sprintingPrev) && grounded && hspeed > SLIDE_ENTER_SPEED) {
        beginSlide(rightX, rightZ);
      }
      sprintingPrev = wantSprint || slideOn;

      // eye target: crouch height while crouched or sliding
      eyeS.set(crouchKey || slideOn ? EYE_CROUCH : EYE_STAND);

      // ------------------------------------------------ horizontal motion
      if (slideOn) {
        slideT += dt;
        const k = E.clamp01(slideT / SLIDE_TIME);
        const decay = 1 - E.easeOutQuad(k);                      // friction ease-out: fast bleed → glide
        vel.x = slideV0.x * decay;
        vel.z = slideV0.z * decay;
        slideDustT += dt;
        if (slideDustT >= SLIDE_DUST_STEP && hspeed > 1.5) {
          slideDustT = 0;
          scratchDust.set(pos.x - vel.x * 0.1, pos.y + 0.07, pos.z - vel.z * 0.1);
          bus.emit('slide:dust', dustPayload);                   // integrator wires fx dust + audio slide()
        }
        if (spaceEdge && grounded) {                             // M3 slide-jump: 60 % momentum kept
          vel.x *= SLIDE_JUMP_KEEP;
          vel.z *= SLIDE_JUMP_KEEP;
          vel.y = JUMP_V;
          endSlide();
        } else if (slideT >= SLIDE_TIME || !crouchKey || !grounded) {
          endSlide();
        }
      } else {
        let wx = fwdX * fIn + rightX * sIn;
        let wz = fwdZ * fIn + rightZ * sIn;
        const wl = Math.hypot(wx, wz);
        if (wl > 1) { wx /= wl; wz /= wl; }
        let maxSpeed = WALK_SPEED;
        if (tacs) maxSpeed = TAC_SPEED;
        else if (wantSprint) maxSpeed = SPRINT_SPEED;
        else if (crouchKey) maxSpeed = CROUCH_SPEED;
        if (wl > 0.05) {                                         // ease-out accel to wish·maxSpeed
          const kk = grounded ? ACCEL_GND : ACCEL_AIR;           // air: same steering, weak accel
          const f = 1 - Math.exp(-kk * dt);
          vel.x += (wx * maxSpeed - vel.x) * f;
          vel.z += (wz * maxSpeed - vel.z) * f;
        } else if (grounded) {                                   // friction to rest
          const f = 1 - Math.exp(-FRICTION * dt);
          vel.x -= vel.x * f;
          vel.z -= vel.z * f;
        }
        // ------------------------------------------------ M1 jump / M6 mantle (mantle priority)
        if (spaceEdge && grounded) {
          const mi = findMantle(fwdX, fwdZ, hspeed);
          if (mi >= 0) beginMantle(mi);
          else {
            vel.y = JUMP_V;
            tacLeft = 0;
            sprintAmtS.set(0); tacAmtS.set(0); sprintingPrev = false;
          }
        }
      }

      // ------------------------------------------------ integrate + gravity
      vel.y += GRAVITY * dt;
      if (vel.y < -80) vel.y = -80;
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
      pos.z += vel.z * dt;

      // arena bounds (parapet clamp)
      const x0 = bounds.minX + PLAYER_RADIUS, x1 = bounds.maxX - PLAYER_RADIUS;
      const z0 = bounds.minZ + PLAYER_RADIUS, z1 = bounds.maxZ - PLAYER_RADIUS;
      if (pos.x < x0) { pos.x = x0; if (vel.x < 0) vel.x = 0; }
      if (pos.x > x1) { pos.x = x1; if (vel.x > 0) vel.x = 0; }
      if (pos.z < z0) { pos.z = z0; if (vel.z < 0) vel.z = 0; }
      if (pos.z > z1) { pos.z = z1; if (vel.z > 0) vel.z = 0; }
      const stH = stepHeight();
      collideProps(stH);

      // ------------------------------------------------ ground / landing (M1 dip)
      // supportY only returns tops within step height of the feet, so pos.y <= sup means either a
      // touchdown (possibly penetrated by a fast frame) or a steppable ledge climb.
      const sup = supportY(pos.x, pos.z, pos.y, stH);
      if (vel.y <= 0.01 && pos.y <= sup + 0.02) {
        if (!grounded) touchdown(-vel.y);                        // impulse from real fall speed
        const climb = sup - pos.y;
        if (climb > 0.05) pos.y += climb * Math.min(1, 16 * dt); // smooth step-up, no 1-frame pop
        else pos.y = sup;
        vel.y = 0; grounded = true;
      } else {
        if (grounded) { grounded = false; if (slideOn) endSlide(); }  // slid/walked off a ledge
        fallSpeed = Math.max(0, -vel.y);
      }
      airAmtS.set(grounded ? 0 : 1);
      if (grounded) fallSpeed = 0;

      // ------------------------------------------------ head-bob phase + footsteps (M1)
      hspeed = Math.hypot(vel.x, vel.z);
      if (grounded && !slideOn && hspeed > 0.6) {        // slide emits dust/slide sfx, not steps
        const stride = MathUtils.lerp(STRIDE_MIN, STRIDE_MAX, E.clamp01(hspeed / TAC_SPEED));
        bobPhase += (hspeed / stride) * dt;
        const steps = Math.floor(bobPhase);
        if (steps !== strideEmitted) {
          strideEmitted = steps;
          footPayload.speed = hspeed;
          bus.emit('footstep', footPayload);                     // audio: surface 'concrete'
        }
      }

      // ------------------------------------------------ M5: manual lean Q/E (suppressed in slide)
      leanS.set(slideOn || mantleOn ? 0 : (input.down('KeyE') ? 1 : 0) - (input.down('KeyQ') ? 1 : 0));

      // ------------------------------------------------ M5: auto-peek — ADS next to cover, LOS blocked
      const standing = !crouchKey && !slideOn && grounded;
      if (adsB > 0.55 && leanS.target === 0 && standing && cover.length > 0 &&
        typeof world.raycastWorld === 'function') {
        peekTimer -= dt;
        if (peekTimer <= 0) {
          peekTimer = PEEK_INTERVAL;
          let ci = -1, cd = PEEK_COVER_DIST;
          for (let i = 0; i < cover.length; i++) {
            const cv = cover[i];
            if (!cv || !cv.pos) continue;
            const d = Math.hypot(cv.pos.x - pos.x, cv.pos.z - pos.z);
            if (d < cd) { cd = d; ci = i; }
          }
          if (ci >= 0) {
            const cp = Math.cos(pitch);
            scratchPeekEye.copy(camera.position);
            scratchPeekDir.set(-sinY * cp, Math.sin(pitch), -cosY * cp);
            const hits = world.raycastWorld(scratchPeekEye, scratchPeekDir, PEEK_RANGE);
            if (hits && hits.length > 0 && hits[0].dist < PEEK_RANGE) {
              const cv = cover[ci];
              let side = cv.side
                ? (cv.side.x * rightX + cv.side.z * rightZ >= 0 ? 1 : -1)
                : ((pos.x - cv.pos.x) * rightX + (pos.z - cv.pos.z) * rightZ >= 0 ? 1 : -1);
              // lean toward the OPEN side: verify with one offset cast, else try the other, else none
              let found = 0;
              for (let attempt = 0; attempt < 2 && !found; attempt++) {
                scratchPeekEye.copy(camera.position);
                scratchPeekEye.x += rightX * side * 0.5;
                scratchPeekEye.z += rightZ * side * 0.5;
                const alt = world.raycastWorld(scratchPeekEye, scratchPeekDir, PEEK_RANGE);
                if (!alt || alt.length === 0 || alt[0].dist >= PEEK_RANGE) found = side;
                else side = -side;
              }
              peekDir = found;
            } else peekDir = 0;
          } else peekDir = 0;
        }
      } else {
        peekDir = 0;
        peekTimer = 0;
      }
      peekS.set(leanS.target === 0 ? peekDir : 0);

      // ------------------------------------------------ F7: wall-bump (analytic forward ray, chest height)
      const cp = Math.cos(pitch);
      const tHit = wallDist(camera.position.x, pos.y + 1.0, camera.position.z,
        -sinY * cp, Math.sin(pitch), -cosY * cp, WALL_RANGE);
      wallS.set(tHit > 0 ? E.easeOutQuad(1 - tHit / WALL_RANGE) : 0);
    } else {
      // paused / menu / dead / tally: decay poses, hold last aim — never a snap out of a run
      sprintAmtS.set(0); tacAmtS.set(0); leanS.set(0); peekS.set(0); wallS.set(0);
      tacLeft = 0; sprintingPrev = false;
      if (slideOn && slideT > SLIDE_TIME) endSlide();            // don't hold a finished slide across pause
    }

    // ------------------------------------------------ springs settle (every frame, M7)
    leanS.update(dt); peekS.update(dt);
    slideAmtS.update(dt); sprintAmtS.update(dt); tacAmtS.update(dt); airAmtS.update(dt);
    landS.update(dt); wallS.update(dt); eyeS.update(dt); handS.update(dt);

    const slideAmt = slideAmtS.value;
    const leanEff = MathUtils.clamp(leanS.value + peekS.value * (1 - Math.min(1, Math.abs(leanS.value))), -1, 1);
    const landNorm = E.clamp01(landS.value * 2.5);

    // ------------------------------------------------ pose → camera (killcam: main owns the camera)
    hspeed = Math.hypot(vel.x, vel.z);
    // head bob: small sine layered into position + roll, scaled by speed, suppressed in ADS/slide/air
    const bobGate = grounded && !mantleOn ? (1 - adsB) * (1 - slideAmt) * (1 - airAmtS.value) : 0;
    const bobAmp = (0.014 + 0.02 * E.clamp01(hspeed / SPRINT_SPEED) + 0.008 * tacAmtS.value)
      * bobGate * (1 - 0.45 * eyeNorm());
    const bob2 = bobPhase * Math.PI * 2;
    const bobY = Math.sin(bob2) * bobAmp;
    const bobX = Math.cos(bob2) * bobAmp * 0.4;
    const rollSway = Math.sin(bobPhase * Math.PI) * (0.006 + 0.014 * sprintAmtS.value + 0.01 * tacAmtS.value) * bobGate;
    const roll = leanEff * LEAN_ROLL + SLIDE_CANT * slideAmt * slideSide + rollSway + shake.roll + fin(state.recoilRoll, 0);
    const dipY = -0.18 * landNorm;                               // landing camera sink
    const latOff = LEAN_OFFSET * leanEff + bobX;
    // sprint/tac FOV kick spring (per assignment: state.move.fovSprint feeds fov compose)
    fovKickS.set((5 * sprintAmtS.value + 2.5 * tacAmtS.value) * (1 - 0.5 * slideAmt));
    fovKickS.update(dt);
    const fovHit = shake.fov + 2 * landNorm;

    if (!state.killcam) {
      applyCamera(
        yaw + shake.yaw + fin(state.recoilYaw, 0),
        pitch + shake.pitch + fin(state.recoilPitch, 0),
        roll, latOff, bobY, dipY,
      );

      // ---- FOV compose (contract): base + ads(-20)*blend + sprint kick(+5) + hit/land kick.
      // Weapon owns state.ads.blend (+ optional state.ads.fovTarget); controller owns final set.
      const adsFovT = fin(state.ads.fovTarget, BASE_FOV + ADS_FOV_SPAN);
      fovS.set(BASE_FOV + (adsFovT - BASE_FOV) * adsB + fovKickS.value + fovHit);
      fovS.update(dt);
      const fov = MathUtils.clamp(fovS.value, 40, 110);
      if (Math.abs(camera.fov - fov) > 1e-4) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
    // ---- F6: consume shake AFTER composing (next frame sees fresh noise; time is scaled dt)
    shake.update(dt, Number.isFinite(elapsed) ? elapsed : time.elapsed);

    // ---- D6: no-damage timer + regen bookkeeping (main applies damage; godmode pins hp)
    if (state.phase === 'playing') {
      state.noDamageFor = fin(state.noDamageFor, 0) + dt;
      if (state.godmode) {
        state.hp = state.maxHp;
      } else if (state.noDamageFor > 4 && state.hp < state.maxHp) {
        state.hp = Math.min(state.maxHp, state.hp + 18 * dt);
      }
    }

    // ------------------------------------------------ publish state.move every frame
    const mv = state.move;
    mv.pos.copy(pos);
    mv.vel.copy(vel);
    mv.yaw = yaw;
    mv.pitch = pitch;
    mv.sprint = sprintAmtS.value > 0.5 && tacAmtS.value < 0.5;
    mv.tacsprint = tacAmtS.value > 0.5;
    mv.slide = slideOn;
    mv.crouch = crouchActive();
    mv.airborne = !grounded && !mantleOn;
    mv.mantle = mantleOn;
    mv.onGround = grounded;
    mv.speed = hspeed;
    mv.speed01 = E.clamp01(hspeed / TAC_SPEED);
    mv.fallSpeed = fallSpeed;
    mv.lean = leanEff;
    mv.camY = eyeS.value;
    mv.landImpulse = landNorm;                                   // weapon decays its own viewmodel sink from this
    mv.wallBump = wallS.value;                                   // F7
    mv.autoPeek = peekS.value;                                   // M5
    mv.mantleHand = handS.value;                                 // M6 (weapon ducks the viewmodel)
    mv.fovSprint = fovKickS.value;                               // +5 run / +7.5 tac kick (consumed by compose)
    mv.fovHit = fovHit;
    mv.adsRateMod = adsRateMod();
    mv.colliderHeight = eyeS.value;                              // M4 shrink for world ray/step checks
    mv.sprintAmt = sprintAmtS.value;
    mv.tacAmt = tacAmtS.value;
    mv.slideAmt = slideAmt;
    mv.crouchAmt = eyeNorm();
    mv.airAmt = airAmtS.value;
    mv.slideSide = slideSide;
  }

  // ------------------------------------------------------------- reset
  function reset(spawnPos) {
    const sp = spawnPos || world.playerStart;
    if (sp) pos.set(fin(sp.x, 0), fin(sp.y, bounds.floorY), fin(sp.z, 0));
    else pos.set(0, bounds.floorY, 0);
    vel.set(0, 0, 0);
    grounded = true; fallSpeed = 0;
    slideOn = false; slideT = 0; slideDustT = 0; slideSide = -1;
    mantleOn = false; mantleT = 0;
    sprintingPrev = false; tacLeft = 0;
    spaceWas = false; bobPhase = 0; strideEmitted = 0;
    peekDir = 0; peekTimer = 0;
    yawS.snap(0); pitchS.snap(0); eyeS.snap(EYE_STAND);
    leanS.snap(0); peekS.snap(0); slideAmtS.snap(0); sprintAmtS.snap(0);
    tacAmtS.snap(0); airAmtS.snap(0); landS.snap(0); wallS.snap(0);
    fovS.snap(BASE_FOV); fovKickS.snap(0); handS.snap(0);
    applyCamera(0, 0, 0, 0, 0, 0);
    camera.fov = BASE_FOV;
    camera.updateProjectionMatrix();
  }

  const api = {
    update,
    reset,
    dispose() { offTacSprint(); },                   // K6: listener hygiene across restarts
    getEye() { return scratchEye.copy(camera.position); },
    getFwd() { return camera.getWorldDirection(scratchFwd); },
    spreadScale,
    adsRateMod,
    mantleAvailable() {
      return !mantleOn && !slideOn && grounded &&
        findMantle(-Math.sin(yawS.value), -Math.cos(yawS.value), Math.hypot(vel.x, vel.z), 0) >= 0;
    },
    // additions the assignment/weapon contract names (weapon may also read state.move fields):
    get inSlide() { return slideOn; },        // slide-ADS blend: weapon must not break the slide
    get inMantle() { return mantleOn; },
    get crouchAmount() { return eyeNorm(); },
  };

  reset(world.playerStart);
  return api;
}
