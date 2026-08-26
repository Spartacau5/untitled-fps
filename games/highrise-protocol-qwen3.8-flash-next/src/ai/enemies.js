// §9 E1-E3 enemy AI + §5 H3/H4/H5 enemy-side feedback.
// Types: rusher (pipe lunges, no gun), gunner (cover → lean-out bursts), heavy (plates).
// Loop: advance → claim free cover → reaction delay 0.25–0.5 s → peek (spring lean) →
//       2–4 shot bursts → push on 'reload:start'/'shot:dry'/hp<35% (E2) → flank if camped.
// Death H5: ragdoll tumble (impulse + angular + bounces vs floor/bounds/cover cylinders),
//       persists 5 s then sinks ease-in-out 1.2 s leaving blood decals; capped by quality.
// Body facing convention: forward = local -Z; yaw = atan2(-dx, -dz) toward the target.
// All animation spring/eased (C5); all randomness from seeded rng (C2); zero per-frame alloc.
import { Vector3, BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { rng } from '../core/rng.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { Spring } from '../core/spring.js';
import { quality } from '../core/quality.js';
import * as E from '../core/easings.js';
import { buildBody, resetPose } from './body.js';

const TYPES = {
  rusher: { hp: 70, speed: 4.4, melee: 22, burst: null, dmg: 0 },
  gunner: { hp: 100, speed: 2.6, melee: 0, burst: [2, 4], dmg: 8 },
  heavy: { hp: 260, speed: 1.45, melee: 0, burst: [2, 2], dmg: 13 },
};
const ENEMY_CAP = 20;                       // pooled enemy instances (contract)

// ---- module-level bus wiring (K6: survives re-init, never double-binds) ----
let pushCue = 0;                            // seconds of aggression from the last cue
let cuesBound = false;
function bindCues() {
  if (cuesBound) return;
  cuesBound = true;
  bus.on('reload:start', () => { pushCue = Math.max(pushCue, 4); });   // they HEAR the mag (E2)
  bus.on('shot:dry', () => { pushCue = Math.max(pushCue, 4); });       // dry click = feed or die
}

export function init(ctx) {
  const world = ctx.world;
  const fx = ctx.fx;
  const audio = ctx.audio;
  const ctrl = ctx.controller;
  bindCues();

  // ---------- hoisted scratch ----------
  const OPT_ALL = { allHits: true };              // E3: continue through thin surfaces
  const _dir = new Vector3();
  const _side = new Vector3();
  const _perp = new Vector3();
  const _to = new Vector3();
  const _tmp = new Vector3();
  const _tmp2 = new Vector3();
  const _muzzle = new Vector3();
  const _tracerOpts = { enemy: true };
  const _pt = new Vector3();
  const _normal = new Vector3(0, 1, 0);
  const UP = new Vector3(0, 1, 0);

  const bounds = world.bounds;
  const cover = world.cover || [];

  // ---------- state ----------
  const living = [];        // live enemies (weapon hit-resolution reads this)
  const ragdolls = [];      // dead bodies still simulated (H5)
  const hitList = [];       // live hit proxies for raycast collection (world.hitMeshes alt)
  let lastRagdoll = null;
  let time0 = 0;            // elapsed for hit-stamp windows

  // ---------- enemy instance pool (cap 20, per contract) ----------
  const free = { rusher: [], gunner: [], heavy: [] };
  let created = 0;
  let nextId = 1;

  function makeRecord(type) {
    const e = {
      id: nextId++, type, spec: TYPES[type],
      hp: 0, maxHp: 0, alive: false, st: 'advance', stT: 0, thinkT: 0,
      pos: new Vector3(), vel: new Vector3(),
      yaw: 0, faceSpr: new Spring(0, 45, 1),
      cover: null, targetPos: new Vector3(), hasTarget: false,
      slideN: new Vector3(), blocked: false,
      pushT: 0, flankSide: 1, leanT: 0, reactT: 0,
      burstLeft: 0, shotT: 0, shotGap: 0.11,
      lungeCd: 0, lungeT: 0, windupT: 0, swingT: 0, swingHit: false,
      staggerT: 0, bloodT: 0, gaitPhase: rng.range(0, 6.283), speed01: 0, moveSpeed: 0,
      // flinch + pose springs (H3 / C5)
      fSpineX: new Spring(0, 70, 0.36), fSpineZ: new Spring(0, 70, 0.36),
      fNeckX: new Spring(0, 90, 0.4), fNeckZ: new Spring(0, 90, 0.4),
      fArmLX: new Spring(0, 100, 0.42), fArmRX: new Spring(0, 100, 0.42),
      fLegLX: new Spring(0, 100, 0.42), fLegRX: new Spring(0, 100, 0.42),
      lean: new Spring(0, 42, 0.85), aim: new Spring(0, 34, 0.95),
      crouch: new Spring(0, 40, 0.8), recoil: new Spring(0, 130, 0.5),
      scarf: new Spring(0, 30, 0.4),
      hitStamps: new Float32Array(5), hitIdx: 0,
      // ragdoll (H5)
      deathPoint: new Vector3(), deadT: 0, sinkT: 0,
      angVel: new Vector3(), tumble: new Vector3(), grounded: false, settled: false,
      from: new Vector3(),       // persistent muzzle position for bus events
      body: null, platesLeft: 0,
    };
    e.body = buildBody(e, type);
    world.enemiesGroup.add(e.body.root);
    return e;
  }

  function zero(sp) { sp.snap(0); sp.set(0); }

  function acquire(type) {
    let e = free[type].pop();
    if (!e) {
      if (created >= ENEMY_CAP) return null;
      e = makeRecord(type);
      created++;
    }
    const s = e.spec;
    e.hp = s.hp; e.maxHp = s.hp;
    e.alive = true; e.st = 'advance'; e.stT = 0; e.thinkT = rng.range(0, 0.1);
    e.vel.set(0, 0, 0);
    e.cover = null; e.hasTarget = false; e.blocked = false; e.moveSpeed = 0;
    e.slideN.set(0, 0, 0);
    e.pushT = 0; e.flankSide = rng.sign(); e.leanT = 0; e.reactT = 0;
    e.burstLeft = 0; e.shotT = rng.range(0.3, 0.9); e.shotGap = 0.11;
    e.lungeCd = rng.range(1, 2.5); e.lungeT = 0; e.windupT = 0; e.swingT = 0; e.swingHit = false;
    e.staggerT = 0; e.bloodT = 0; e.speed01 = 0;
    e.deadT = 0; e.sinkT = 0; e.settled = false; e.grounded = false;
    e.tumble.set(0, 0, 0); e.angVel.set(0, 0, 0);
    e.hitStamps.fill(-9); e.hitIdx = 0;
    resetPose(e.body);
    e.body.root.visible = true;
    e.platesLeft = e.body.plates.length;
    zero(e.lean); zero(e.aim); zero(e.crouch); zero(e.recoil); zero(e.scarf);
    zero(e.fSpineX); zero(e.fSpineZ); zero(e.fNeckX); zero(e.fNeckZ);
    zero(e.fArmLX); zero(e.fArmRX); zero(e.fLegLX); zero(e.fLegRX);
    living.push(e);
    return e;
  }

  function release(e) {
    if (e.cover) { if (e.cover.taken === e) e.cover.taken = null; e.cover = null; }
    e.alive = false;
    e.body.root.visible = false;
    const q = free[e.type];
    if (q.length < ENEMY_CAP) q.push(e);
  }

  // current enemy hit proxies (live bodies only) — for world.hitMeshes()/weapon raycasts
  function hitMeshes() {
    hitList.length = 0;
    for (let i = 0; i < living.length; i++) {
      const prox = living[i].body.hitMeshes;
      for (let j = 0; j < prox.length; j++) hitList.push(prox[j]);
    }
    return hitList;
  }

  function dropRagdoll(e) {
    const i = ragdolls.indexOf(e);
    if (i >= 0) ragdolls.splice(i, 1);
    release(e);
  }

  // ---------- pooled armour-plate debris (E1) ----------
  const debrisGeo = new BoxGeometry(0.18, 0.25, 0.05);
  const debrisMat = new MeshStandardMaterial({ color: 0x6d737c, roughness: 0.42, metalness: 0.8 });
  const DEBRIS_CAP = 24;
  const dFree = [];
  const dLive = [];
  function spawnDebris(point, dir) {
    let d = dFree.pop();
    if (!d) {
      if (dLive.length >= DEBRIS_CAP) d = dLive.shift();            // oldest-first (P1)
      else {
        const m = new Mesh(debrisGeo, debrisMat);
        m.castShadow = true;
        d = { mesh: m, vel: new Vector3(), av: new Vector3(), t: 0 };
      }
    }
    d.mesh.visible = true;
    d.mesh.position.copy(point);
    d.mesh.rotation.set(rng.range(0, 3), rng.range(0, 3), rng.range(0, 3));
    d.mesh.scale.setScalar(1);
    d.vel.copy(dir).multiplyScalar(rng.range(2.4, 4.2));
    d.vel.y = rng.range(2.2, 4.0);
    d.av.set(rng.range(-9, 9), rng.range(-9, 9), rng.range(-9, 9));
    d.t = 0;
    world.scene.add(d.mesh);
    dLive.push(d);
  }
  function updateDebris(dt) {
    for (let i = dLive.length - 1; i >= 0; i--) {
      const d = dLive[i];
      d.t += dt;
      if (d.t > 2.6) {
        world.scene.remove(d.mesh);
        d.mesh.visible = false;
        dLive.splice(i, 1);
        dFree.push(d);
        continue;
      }
      const m = d.mesh;
      d.vel.y -= 14 * dt;
      m.position.addScaledVector(d.vel, dt);
      m.rotation.x += d.av.x * dt;
      m.rotation.y += d.av.y * dt;
      m.rotation.z += d.av.z * dt;
      const fl = bounds.floorY + 0.028;
      if (m.position.y < fl) {
        m.position.y = fl;
        if (d.vel.y < -1.1) {                        // concrete bounce + tinkle of spin
          d.vel.y = -d.vel.y * 0.35;
          d.vel.x *= 0.6; d.vel.z *= 0.6;
          d.av.multiplyScalar(0.5);
        } else {
          d.vel.y = 0;
          const fr = Math.max(0, 1 - dt * 5);        // slide-out
          d.vel.x *= fr; d.vel.z *= fr;
          d.av.multiplyScalar(Math.max(0, 1 - dt * 6));
        }
      }
      if (d.t > 2.0) m.scale.setScalar(Math.max(0.001, 1 - E.easeInCubic((d.t - 2.0) / 0.6)));
    }
  }

  // ---------- camped-player tracking (E2 flank cue, 0.25 s samples) ----------
  const HIST = 24;                                   // ~5.75 s of motion history
  const hPos = [];
  for (let i = 0; i < HIST; i++) hPos.push(new Vector3());
  const hMoved = new Float32Array(HIST);
  let hIdx = 0, hFilled = 0, sampleT = 0, campedUntil = -99;

  function trackPlayer(t) {
    const p = state.move.pos;
    const cur = hPos[hIdx];
    hMoved[hIdx] = hFilled > 0 ? cur.distanceTo(p) : 0;
    cur.copy(p);
    hIdx = (hIdx + 1) % HIST;
    if (hFilled < HIST) hFilled++;
    if (hFilled === HIST) {
      let total = 0;
      for (let i = 0; i < HIST; i++) total += hMoved[i];
      if (total / 5.75 < 0.8) campedUntil = t + 6;   // avg speed < 0.8 m/s for ~5 s
    }
  }

  // ---------- helpers ----------
  function wrapPi(a) {
    while (a > Math.PI) a -= Math.PI * 2;
    while (a < -Math.PI) a += Math.PI * 2;
    return a;
  }

  // yaw with forward = local -Z facing (x, z)
  function faceTowards(e, x, z) {
    const ty = Math.atan2(x - e.pos.x, z - e.pos.z) + Math.PI;
    const d = wrapPi(ty - e.yaw);
    if (Math.abs(d) > 0.03) {
      e.yaw += d;                          // continuous yaw for the spring
      e.faceSpr.target = e.yaw;
    }
  }

  function nearestFreeCover(e, px, pz, flank) {
    _side.set(-(e.pos.z - pz), 0, e.pos.x - px);
    const sl = _side.length() || 1;
    _side.multiplyScalar(1 / sl);                    // lateral axis around the player
    let best = null, bestScore = Infinity;
    for (let i = 0; i < cover.length; i++) {
      const c = cover[i];
      if (c.taken && c.taken !== e) continue;
      _tmp.set(c.pos.x - e.pos.x, 0, c.pos.z - e.pos.z);
      let score = _tmp.length();
      _tmp2.set(c.pos.x - px, 0, c.pos.z - pz);
      const dPl = _tmp2.length();
      if (dPl < 7) score += (7 - dPl) * 6;           // too close to player = bad cover
      if (dPl > 26) score += (dPl - 26) * 2;         // don't retreat across the map
      if (flank && dPl > 1e-3) {
        _tmp2.multiplyScalar(1 / dPl);
        const lateral = Math.abs(_tmp2.dot(_side));  // prefer perpendicular pockets
        score *= 1.5 - lateral * 0.95;
      }
      if (score < bestScore) { bestScore = score; best = c; }
    }
    return best;
  }

  function freeCover(e) {
    if (e.cover) { if (e.cover.taken === e) e.cover.taken = null; e.cover = null; }
  }

  function claimCover(e, c, px, pz) {
    freeCover(e);
    if (c) {
      c.taken = e;
      e.cover = c;
      e.targetPos.copy(c.pos);
    } else {
      // no free cover: hold a standoff ring offset to the flank side
      const a = Math.atan2(e.pos.x - px, e.pos.z - pz) + e.flankSide * 0.55;
      const r = e.type === 'heavy' ? 13 : 10;
      e.targetPos.set(
        Math.min(bounds.maxX - 1.5, Math.max(bounds.minX + 1.5, px + Math.sin(a) * r)),
        0,
        Math.min(bounds.maxZ - 1.5, Math.max(bounds.minZ + 1.5, pz + Math.cos(a) * r)),
      );
    }
    e.hasTarget = true;
  }

  function startPeek(e) {
    e.st = 'peek'; e.stT = 0;
    e.reactT = rng.range(0.25, 0.5);                 // reaction delay (E2)
    e.shotGap = (e.pushT > 0 ? 0.08 : 0.11) + rng.range(0, 0.05);
  }

  function beginBurst(e) {
    const b = e.spec.burst;
    e.burstLeft = b[0] + rng.int(b[1] - b[0] + 1);   // 2–4 shots, 3–5 while pushing
    if (e.pushT > 0) e.burstLeft++;
    e.st = 'fire'; e.stT = 0;
    e.shotT = 0.05;
  }

  // ---------- enemy fire: cone-scaled accuracy, LOS via raycastWorld (E3) ----------
  function fireShot(e) {
    const muzzle = e.body.muzzle;
    if (!muzzle) return;
    muzzle.getWorldPosition(_muzzle);
    e.from.copy(_muzzle);
    const eye = ctrl.getEye(_tmp2) || _tmp2;              // contract: getEye() -> Vector3
    const lead = Math.min(0.22, eye.distanceTo(_muzzle) * 0.018);
    const px = eye.x + state.move.vel.x * lead;
    const py = eye.y + Math.max(0, state.move.vel.y) * lead * 0.5;
    const pz = eye.z + state.move.vel.z * lead;

    _dir.set(px - _muzzle.x, py - _muzzle.y, pz - _muzzle.z);
    const distM = _dir.length() || 1;
    _dir.multiplyScalar(1 / distM);

    // accuracy: base + wave scaling + close-range bonus; crouch hides you (M4/D6)
    let acc = e.type === 'heavy' ? 0.5 : 0.46;
    acc += state.wave * 0.022;
    acc += Math.max(0, 14 - distM) * 0.028;
    if (e.pushT > 0) acc += 0.1;
    if (state.move.crouch) acc -= 0.08;

    // LOS through the world: solid blockers stop the round; thin cover (E3) degrades
    const hits = world.raycastWorld(_muzzle, _dir, distM + 4, OPT_ALL);
    let solid = -1, thix = -1, surf = 'concrete';
    if (hits) {
      for (let i = 0; i < hits.length; i++) {
        const h = hits[i];
        if (h.enemy || !h.surface) continue;         // bodies (live or dead) never block AI fire
        const s = h.surface;
        if (s === 'drywall' || s === 'sheeting' || s === 'glass') {
          if (thix < 0) thix = h.dist;              // first thin layer along the path
          if (world.glassBreak && s === 'glass') world.glassBreak(h.object);
        } else {
          solid = h.dist;
          _pt.copy(h.point);
          surf = s;
          if (h.normal) _normal.copy(h.normal); else _normal.set(0, 1, 0);
          break;
        }
      }
    }
    if (solid >= 0 && thix >= 0 && thix < solid) acc -= 0.07;   // shooting THROUGH thin cover
    acc = Math.min(0.88, Math.max(0.12, acc));
    const hit = rng.next() < acc;

    if (hit) _to.set(px, py, pz);
    else {                                           // miss: gaussian perpendicular scatter
      _side.crossVectors(_dir, UP).normalize();
      _perp.crossVectors(_side, _dir);
      const g = (1 - acc) * distM * 0.16;
      _to.set(px, py, pz)
        .addScaledVector(_side, rng.gauss() * g)
        .addScaledVector(_perp, rng.gauss() * g * 0.7);
    }
    const reached = hit && (solid < 0 || solid >= distM * 0.97);
    if (solid >= 0 && solid < distM * 1.05) {
      _to.copy(_pt);                                 // tracer dies on the blocker
      if (fx) fx.impact(_pt, _normal, surf, 0.7);
    } else if (!reached) {
      _to.addScaledVector(_dir, 5);                  // miss flies past the player
    }
    if (fx) {
      fx.tracer(_muzzle, _to, _tracerOpts);   // F8: near-miss sonic-crack probe
      if (rng.next() < 0.5) fx.muzzleSmoke(_muzzle, _dir);
    }
    bus.emit('enemy:shot', { from: e.from, dist: distM });   // audio positions via this
    if (reached) {
      // main applies hp/godmode; `from` must outlive the frame → fresh clone (rare)
      bus.emit('player:damage', {
        amount: e.spec.dmg + state.wave * 0.35,
        from: new Vector3(_muzzle.x, _muzzle.y, _muzzle.z),
      });
    }
    e.recoil.impulse(e.type === 'heavy' ? 3.2 : 2.2);
  }

  // ---------- death + ragdoll (H5) ----------
  function die(e, dir, point, headshot) {
    e.alive = false;
    e.st = 'dead'; e.deadT = 0; e.sinkT = 0; e.settled = false; e.grounded = false;
    e.deathPoint.copy(point);                        // killcam reads this (contract w/ main)
    freeCover(e);
    const i = living.indexOf(e);
    if (i >= 0) living.splice(i, 1);
    // bullet-direction impulse + pop up; oversized for headshots (H4)
    const kick = headshot ? 6.4 : 3.6;
    e.vel.copy(dir).multiplyScalar(kick);
    e.vel.x += rng.range(-0.8, 0.8);
    e.vel.z += rng.range(-0.8, 0.8);
    e.vel.y = rng.range(1.6, 3.2) + (headshot ? 1.2 : 0);
    e.angVel.set(rng.range(-6, 6) - dir.z * 3, rng.range(-3, 3), rng.range(-6, 6) + dir.x * 3);
    e.fSpineX.set(rng.range(-1.3, -0.3)); e.fSpineZ.set(rng.range(-0.5, 0.5));
    e.fNeckX.set(rng.range(-0.7, 0.7)); e.fNeckZ.set(rng.range(-0.7, 0.7));
    e.fArmLX.set(rng.range(-1.4, 1.4)); e.fArmRX.set(rng.range(-1.4, 1.4));
    e.fLegLX.set(rng.range(-1.2, 1.2)); e.fLegRX.set(rng.range(-1.2, 1.2));
    e.aim.set(0); e.lean.set(0); e.crouch.set(0);
    ragdolls.push(e);
    lastRagdoll = e;
    const cap = quality.flags.ragdollCap || 8;
    while (ragdolls.length > cap) dropRagdoll(ragdolls[0]);   // replace oldest (H5)
    if (fx) {
      fx.killBlood(point, dir);
      fx.bloodHit(point, dir, e.maxHp, headshot);
    }
    if (audio) audio.bodyFall(_tmp.copy(state.move.pos).distanceTo(e.pos));
  }

  function updateRagdoll(e, dt) {
    e.deadT += dt;
    const b = e.body;
    b.root.visible = true;
    e.vel.y -= 24 * dt;
    e.pos.addScaledVector(e.vel, dt);
    const fy = bounds.floorY;
    if (e.pos.y <= fy) {
      e.pos.y = fy;
      if (e.vel.y < -1.4) {                            // bounce off concrete
        e.vel.y = -e.vel.y * 0.32;
        e.vel.x *= 0.55; e.vel.z *= 0.55;
        e.angVel.multiplyScalar(0.45);
        e.grounded = false;
      } else {
        e.vel.y = 0;
        e.grounded = true;
        const fr = Math.max(0, 1 - dt * 4.5);          // slide/roll a few meters
        e.vel.x *= fr; e.vel.z *= fr;
        e.angVel.multiplyScalar(Math.max(0, 1 - dt * 5));
      }
    } else e.grounded = false;
    // bounds bounce
    const R = 0.45;
    if (e.pos.x < bounds.minX + R) { e.pos.x = bounds.minX + R; e.vel.x = Math.abs(e.vel.x) * 0.4; }
    if (e.pos.x > bounds.maxX - R) { e.pos.x = bounds.maxX - R; e.vel.x = -Math.abs(e.vel.x) * 0.4; }
    if (e.pos.z < bounds.minZ + R) { e.pos.z = bounds.minZ + R; e.vel.z = Math.abs(e.vel.z) * 0.4; }
    if (e.pos.z > bounds.maxZ - R) { e.pos.z = bounds.maxZ - R; e.vel.z = -Math.abs(e.vel.z) * 0.4; }
    // cheap cylinder bounce off cover props (pillars/crates = the tumble's obstacles)
    for (let i = 0; i < cover.length; i++) {
      const c = cover[i];
      const r = (c.radius || 0.5) + 0.3;
      const dx = e.pos.x - c.pos.x, dz = e.pos.z - c.pos.z;
      const d2 = dx * dx + dz * dz;
      if (d2 < r * r && d2 > 1e-6 && e.pos.y < fy + 1.6) {
        const d = Math.sqrt(d2), nx = dx / d, nz = dz / d;
        e.pos.x = c.pos.x + nx * r;
        e.pos.z = c.pos.z + nz * r;
        const vn = e.vel.x * nx + e.vel.z * nz;
        if (vn < 0) {
          e.vel.x -= 1.5 * vn * nx; e.vel.z -= 1.5 * vn * nz;
          e.angVel.z += vn * 2;
        }
      }
    }
    e.tumble.x += e.angVel.x * dt;
    e.tumble.y += e.angVel.y * dt;
    e.tumble.z += e.angVel.z * dt;
    if (!e.settled && e.grounded && e.vel.lengthSq() < 0.4 && e.angVel.lengthSq() < 1.2) {
      e.settled = true;
      if (fx) fx.bodyBlood(e.pos);                     // pool forms where it rests
    }
    let sinkY = 0;
    if (e.deadT > 5) {                                 // persist 5 s, then sink 1.2 s (H5)
      e.sinkT += dt;
      const k = E.clamp01(e.sinkT / 1.2);
      sinkY = -E.easeInOutQuart(k) * 2.4;              // ease-in-out into the floor
      if (k >= 1) { dropRagdoll(e); return; }
    }
    b.root.position.set(e.pos.x, e.pos.y + sinkY, e.pos.z);
    b.root.rotation.set(e.tumble.x, e.yaw + e.tumble.y, e.tumble.z, 'YXZ');
    e.fSpineX.update(dt); e.fSpineZ.update(dt); e.fNeckX.update(dt); e.fNeckZ.update(dt);
    e.fArmLX.update(dt); e.fArmRX.update(dt); e.fLegLX.update(dt); e.fLegRX.update(dt);
    b.spine.rotation.x = e.fSpineX.value;
    b.spine.rotation.z = e.fSpineZ.value;
    b.neck.rotation.x = e.fNeckX.value;
    b.neck.rotation.z = e.fNeckZ.value;
    b.armL.shoulder.rotation.x = e.fArmLX.value;
    b.armR.shoulder.rotation.x = e.fArmRX.value;
    b.legL.hip.rotation.x = e.fLegLX.value;
    b.legR.hip.rotation.x = e.fLegRX.value;
    b.hips.position.y = 0.92 * (1 - E.easeOutCubic(E.clamp01(e.deadT / 0.55)));
    if (b.scarfTail) b.scarfTail.rotation.x = 1.4;
  }

  // ---------- AI think (staggered: each enemy thinks once per 0.1 s slice) ----------
  function think(e, t) {
    const p = state.move.pos;
    const dx = p.x - e.pos.x, dz = p.z - e.pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    e.moveSpeed = 0;
    if (state.hp < state.maxHp * 0.35 && e.pushT < 1.5) e.pushT = 1.5;   // E2: low prey
    if (e.st !== 'windup' && e.st !== 'swing') faceTowards(e, p.x, p.z);

    if (e.type === 'rusher') {
      if (e.st !== 'windup' && e.st !== 'swing') {
        let sp = e.spec.speed * (e.pushT > 0 ? 1.25 : 1);
        if (e.lungeCd <= 0 && dist < 8 && dist > 2.6 && e.lungeT <= 0) {   // lunge <8 m
          e.lungeT = 0.55; e.lungeCd = rng.range(2.2, 3.6);
          e.fSpineX.impulse(2.4);                          // dip out of the lunge start
        }
        if (e.lungeT > 0) sp *= 1.55;
        e.moveSpeed = sp;
        e.targetPos.set(p.x, 0, p.z);
        e.hasTarget = true;
        if (dist < 2.3 && e.staggerT <= 0) {               // melee range → telegraph
          e.st = 'windup'; e.stT = 0; e.windupT = 0.5;
        }
      } else {
        e.moveSpeed = e.st === 'windup' ? 0.35 : 0;
      }
      return;
    }

    // gunner / heavy
    if (e.pushT > 0) {
      freeCover(e);                                        // push: abandon cover, beeline
      _to.set(e.pos.x - p.x, 0, e.pos.z - p.z);
      const l = _to.length() || 1;
      const want = e.type === 'heavy' ? 7 : 8.5;
      e.targetPos.set(p.x + _to.x / l * want, 0, p.z + _to.z / l * want);
      e.hasTarget = true;
      e.moveSpeed = e.spec.speed * 1.35;
      if (e.st !== 'fire' && e.burstLeft <= 0 && e.shotT <= 0) beginBurst(e);
      return;
    }
    if (e.st === 'advance') {
      claimCover(e, nearestFreeCover(e, p.x, p.z, t < campedUntil), p.x, p.z);
      e.st = 'move'; e.stT = 0;
    }
    if (e.st === 'move') {
      e.moveSpeed = e.spec.speed;
      _tmp.set(e.targetPos.x - e.pos.x, 0, e.targetPos.z - e.pos.z);
      if (_tmp.lengthSq() < 0.6 || e.stT > 7) {
        e.st = 'hold'; e.stT = 0;
        e.leanT = rng.range(0.3, 1.4);
      }
    } else if (e.st === 'hold') {
      e.leanT -= 0.1;
      if (e.leanT <= 0 && dist < (e.type === 'heavy' ? 24 : 26)) startPeek(e);
    } else if (e.st === 'peek') {
      if (e.stT > e.reactT) beginBurst(e);
    }
    if (e.st === 'peek' || e.st === 'fire') faceTowards(e, p.x, p.z);
  }

  // ---------- steering: knee + chest probes, slide around pillars ----------
  function steer(e, tx, tz) {
    e.blocked = false;
    const probe = 0.85 + e.speed01 * 0.7;
    _dir.set(tx, 0, tz).normalize();
    let hit = null;
    for (let lvl = 0; lvl < 2; lvl++) {                    // 0 = knee 0.55, 1 = chest 1.3
      _tmp.set(e.pos.x, e.pos.y + (lvl ? 1.3 : 0.55), e.pos.z);
      const hits = world.raycastWorld(_tmp, _dir, probe);
      if (hits) {
        for (let i = 0; i < hits.length; i++) {
          const h = hits[i];
          if (h.enemy) continue;
          if (!hit || h.dist < hit.dist) hit = h;
        }
      }
      if (hit) break;
    }
    if (!hit || !hit.normal) return _dir;
    e.blocked = true;
    const n = hit.normal;
    const dn = n.x * _dir.x + n.z * _dir.z;
    let sx = _dir.x - n.x * dn, sz = _dir.z - n.z * dn;    // tangent projection → slide
    const sl2 = Math.sqrt(sx * sx + sz * sz);
    if (sl2 < 0.05) { sx = -_dir.z; sz = _dir.x; }         // head-on → commit sideways
    else { sx /= sl2; sz /= sl2; }
    const held = e.slideN.x * sx + e.slideN.z * sz;        // keep one direction (no zigzag)
    if (held > -0.2) { e.slideN.set(sx, 0, sz); return e.slideN; }
    return e.slideN;
  }
  function meleeClear(e) {
    const p = state.move.pos;
    _dir.set(p.x - e.pos.x, (p.y + 1.6) - (e.pos.y + 1.3), p.z - e.pos.z);
    const d = _dir.length() || 1;
    _dir.multiplyScalar(1 / d);
    _pt.copy(e.pos); _pt.y = e.pos.y + 1.3; _pt.addScaledVector(_dir, 0.55);
    const hits = world.raycastWorld(_pt, _dir, d - 0.55);
    const h = hits && hits[0];
    return !h || !!h.enemy;   // own body or nothing → the swing connects
  }
  // ---------- live-enemy frame update ----------
  function updateEnemy(e, dt) {
    const p = state.move.pos;
    const dx = p.x - e.pos.x, dz = p.z - e.pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const detail = dist < 28;                       // anim-detail cull (E1 perf)
    e.stT += dt;
    if (e.pushT > 0) e.pushT -= dt;
    if (e.lungeCd > 0) e.lungeCd -= dt;
    if (e.lungeT > 0) e.lungeT -= dt;
    if (e.staggerT > 0) e.staggerT -= dt;
    if (e.shotT > 0 && e.burstLeft <= 0) e.shotT -= dt;

    // ---- melee / fire machines ----
    if (e.st === 'windup') {
      e.windupT -= dt;
      if (e.windupT <= 0) { e.st = 'swing'; e.stT = 0; e.swingT = 0.22; e.swingHit = false; }
    } else if (e.st === 'swing') {
      if (!e.swingHit && e.stT > 0.11) {
        e.swingHit = true;
        if (dist < 2.7 && meleeClear(e)) {                // dodgeable by stepping back; blocked by cover (D6)
          bus.emit('player:damage', {
            amount: e.spec.melee,
            from: new Vector3(e.pos.x, e.pos.y + 1.3, e.pos.z),
          });
          e.fSpineX.impulse(-3.4);                         // follow-through
        } else {
          e.fSpineX.impulse(-1.2);                         // whiff past the player
        }
      }
      e.swingT -= dt;
      if (e.swingT <= 0) { e.st = 'advance'; e.stT = 0; }
    } else if (e.st === 'fire') {
      if (e.burstLeft > 0) {
        e.shotT -= dt;
        if (e.shotT <= 0) { fireShot(e); e.burstLeft--; e.shotT = e.shotGap; }
      } else if (e.stT > 0.45) {
        if (e.pushT > 0) beginBurst(e);
        else {
          e.leanT = rng.range(0.4, 1.1);
          if (rng.next() < (e.type === 'heavy' ? 0.08 : 0.25)) { e.st = 'advance'; e.stT = 0; }
          else { e.st = 'hold'; e.stT = 0; }
        }
      }
    }

    // ---- move with steering ----
    const sp = e.moveSpeed * (e.staggerT > 0 ? 0.25 : 1);
    let mx = 0, mz = 0;
    if (sp > 0.05 && e.hasTarget) {
      let tx = e.targetPos.x - e.pos.x, tz = e.targetPos.z - e.pos.z;
      const td = Math.sqrt(tx * tx + tz * tz) || 1;
      tx /= td; tz /= td;
      const s = steer(e, tx, tz);
      mx = s.x * sp; mz = s.z * sp;
    } else {
      e.slideN.multiplyScalar(Math.max(0, 1 - dt * 4));    // decay slide commitment
    }
    e.vel.x = mx; e.vel.z = mz;
    e.pos.x = Math.min(bounds.maxX - 0.5, Math.max(bounds.minX + 0.5, e.pos.x + mx * dt));
    e.pos.z = Math.min(bounds.maxZ - 0.5, Math.max(bounds.minZ + 0.5, e.pos.z + mz * dt));
    const spd = Math.sqrt(mx * mx + mz * mz);
    e.speed01 += (E.easeOutCubic(Math.min(1, spd / 6)) - e.speed01) * Math.min(1, dt * 8);

    // ---- blood trail while wounded (H1) ----
    if (detail && e.hp < e.maxHp * 0.4) {
      e.bloodT -= dt;
      if (e.bloodT <= 0 && spd > 0.5) {
        e.bloodT = rng.range(0.2, 0.45);
        if (fx) fx.bloodHit(_to.set(e.pos.x, bounds.floorY + 0.03, e.pos.z), UP, 2, false);
      }
    }

    // ---- springs ----
    e.faceSpr.update(dt);
    e.lean.update(dt); e.aim.update(dt); e.crouch.update(dt); e.recoil.update(dt);
    e.scarf.update(dt);
    e.fSpineX.update(dt); e.fSpineZ.update(dt); e.fNeckX.update(dt); e.fNeckZ.update(dt);
    e.fArmLX.update(dt); e.fArmRX.update(dt); e.fLegLX.update(dt); e.fLegRX.update(dt);

    // pose targets
    e.lean.set((e.st === 'peek' || e.st === 'fire') && e.cover ? 1 : 0);
    e.aim.set((e.st === 'peek' && e.stT > e.reactT * 0.5) || e.st === 'fire' || e.pushT > 0 ? 1 : 0);
    e.crouch.set(e.st === 'windup' ? 1 : 0);

    // ---- root transform (+ spring lean out from the cover side) ----
    const b = e.body;
    let ox = 0, oz = 0;
    if (e.cover && (e.st === 'peek' || e.st === 'fire')) {
      ox = e.cover.side.x * 0.55 * e.lean.value;
      oz = e.cover.side.z * 0.55 * e.lean.value;
    }
    b.root.position.set(e.pos.x + ox, e.pos.y, e.pos.z + oz);
    b.root.rotation.y = e.faceSpr.value;

    // ---- procedural gait: sine drive shaped by named easings (C5), speed-scaled ----
    e.gaitPhase += dt * (2.4 + spd * 2.4);
    const raw = Math.sin(e.gaitPhase);
    const sw = Math.sign(raw) * E.easeOutQuad(Math.abs(raw));
    const mv = Math.min(1, spd / (e.spec.speed + 0.01));
    if (!detail) { b.hips.position.y = 0.92; return; }     // far = static-ish, root only
    const run = e.type === 'rusher' || e.pushT > 0;
    const ampA = (e.type === 'heavy' ? 0.68 : run ? 1.05 : 0.6) * mv;
    const ampL = (e.type === 'heavy' ? 0.55 : 0.78) * mv;
    const bob = (0.5 - 0.5 * Math.cos(e.gaitPhase * 2)) * 0.045 * mv * (e.type === 'heavy' ? 1.6 : 1);
    const gArm = sw * ampA, gLeg = sw * ampL;

    b.hips.position.y = 0.92 + bob - e.crouch.value * 0.22;
    b.hips.rotation.y = -sw * 0.09 * mv;                   // pelvis counter-rotation
    b.spine.rotation.y = sw * 0.12 * mv;
    const leanF = e.type === 'rusher' ? 0.3 : (e.type === 'heavy' ? 0.06 : 0.12);
    const wind = e.st === 'windup' ? E.easeInCubic(E.clamp01(1 - e.windupT / 0.5)) : 0;
    b.spine.rotation.x = leanF * mv + wind * 0.28 + e.fSpineX.value - e.recoil.value * 0.06;
    b.spine.rotation.z = e.fSpineZ.value;
    b.neck.rotation.x = e.fNeckX.value - leanF * 0.7 * mv;
    b.neck.rotation.z = e.fNeckZ.value;

    // arms: gait swing blended into ADS-ish rifle raise / pipe windup→chop
    const a = e.aim.value;
    let sLx = gArm, sRx = -gArm;
    let eL = 0.25 + Math.max(0, -sw) * 0.35 * mv, eR = 0.25;
    if (e.type === 'rusher') {
      eR = 0.9 - gArm * 0.3;
      if (e.st === 'windup') {
        sRx = -2.25 * wind; eR = 0.55 + 0.5 * wind; sLx = -0.6 * wind;   // pipe raised back
      } else if (e.st === 'swing') {
        const w = E.easeOutQuint(E.clamp01(e.stT / 0.22));               // fast chop down
        sRx = -2.25 + 3.6 * w; eR = 1.05 - 0.85 * w; sLx = -0.5;
      }
    } else {
      const rs = -1.32 + e.recoil.value * 0.12;              // rifle shoulder raise
      const re = 1.02 - e.recoil.value * 0.1;
      sLx = sLx * (1 - a) + (-1.18) * a;                     // left arm under the barrel
      sRx = sRx * (1 - a) + rs * a;
      eL = eL * (1 - a) + 1.12 * a;
      eR = eR * (1 - a) + re * a;
    }
    b.armL.shoulder.rotation.x = sLx + e.fArmLX.value;
    b.armR.shoulder.rotation.x = sRx + e.fArmRX.value;
    b.armL.elbow.rotation.x = eL;
    b.armR.elbow.rotation.x = eR;

    b.legL.hip.rotation.x = -gLeg + e.fLegLX.value;
    b.legR.hip.rotation.x = gLeg + e.fLegRX.value;
    const kn = e.type === 'heavy' ? 1.35 : 1.1;              // heavy: stiff slow stomp
    const kAdd = e.type === 'heavy' ? 0.14 : 0.08;
    b.legL.knee.rotation.x = Math.max(0, gLeg) * kn + kAdd;
    b.legR.knee.rotation.x = Math.max(0, -gLeg) * kn + kAdd;

    if (b.scarfTail) {
      e.scarf.set(-spd * 0.1 - (e.st === 'swing' ? 0.5 : 0));
      b.scarfTail.rotation.x = 1.35 + e.scarf.value;
      b.scarfTail.rotation.z = Math.sin(e.gaitPhase * 0.5) * 0.14 * mv;
    }
  }

  // ---------- soft separation (think-rate; n ≤ 16) ----------
  function separate() {
    for (let i = 0; i < living.length; i++) {
      const a = living[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < living.length; j++) {
        const b = living[j];
        if (!b.alive) continue;
        const dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < 0.64 && d2 > 1e-5) {
          const d = Math.sqrt(d2), push = (0.8 - d) * 0.25;
          const nx = dx / d, nz = dz / d;
          a.pos.x -= nx * push; a.pos.z -= nz * push;
          b.pos.x += nx * push; b.pos.z += nz * push;
        }
      }
    }
  }

  // ---------- damage model (H3 flinch / H4 headshot / E1 plates) ----------
  function popPlate(e, point, dir) {
    const plates = e.body.plates;
    let best = -1, bestD = 0.5;
    for (let i = 0; i < plates.length; i++) {
      const pl = plates[i];
      if (!pl.alive) continue;
      pl.mesh.getWorldPosition(_tmp2);
      const d = _tmp2.distanceTo(point);
      if (d < bestD) { bestD = d; best = i; }
    }
    if (best < 0) return;                                  // no plate nearby: nothing to pop
    const pl = plates[best];
    pl.hits++;
    pl.mesh.getWorldPosition(_tmp);
    if (pl.hits >= 2 || e.hp < e.maxHp * 0.6) {            // detach rule (E1)
      pl.alive = false;
      pl.mesh.visible = false;
      e.platesLeft--;
      if (fx) {
        _to.copy(dir).multiplyScalar(-1);                  // sparks back toward the shooter
        fx.impact(_tmp, _to, 'metal', 1.2);
      }
      _to.copy(dir).addScaledVector(UP, 0.7);
      spawnDebris(_tmp, _to);                              // pooled plate flies + bounces
    } else {
      if (fx) fx.impact(_tmp, dir, 'metal', 0.8);          // first hit: spark, plate holds
    }
  }

  /** @returns true if this hit killed the enemy (headshot check internal). */
  function applyHit(e, part, dmg, point, dir) {
    if (!e || !e.alive) return false;
    e.hitStamps[e.hitIdx] = time0;                         // sustained-fire window
    e.hitIdx = (e.hitIdx + 1) % 5;

    // directional flinch (H3): push the hit bone + spine ALONG the bullet's local axes.
    // facing: forward(-Z) in world = (-sinY, -cosY); right(+X) = (cosY, -sinY)
    const sY = Math.sin(e.yaw), cY = Math.cos(e.yaw);
    const dotF = -(dir.x * sY + dir.z * cY);               // + = bullet runs with facing (rear hit)
    const dotR = dir.x * cY - dir.z * sY;                  // + = pushed toward enemy's right
    const s = Math.min(1.6, dmg * 0.09 + 0.5);
    // rotation.x negative = top tips forward(-Z): rear hit bends them forward, front hit back
    e.fSpineX.impulse(-dotF * s * 1.5);
    e.fSpineZ.impulse(-dotR * s);                          // rotation.z + = top to the left
    e.fNeckX.impulse(-dotF * s * 0.9);
    e.fNeckZ.impulse(-dotR * s * 0.7);
    if (part === 'limb') {
      const armHit = point.y - e.pos.y > (e.type === 'heavy' ? 1.2 : 1.02);
      const rightSide = (point.x - e.pos.x) * cY - (point.z - e.pos.z) * sY > 0;
      const imp = -dotF * (armHit ? 2.4 : 2.0) * s;
      if (armHit) (rightSide ? e.fArmRX : e.fArmLX).impulse(imp);
      else (rightSide ? e.fLegRX : e.fLegLX).impulse(imp);
    }

    if (dmg >= 34 && part !== 'head') {                    // heavy hit → stagger (H3)
      e.staggerT = 0.5;
      e.fSpineX.impulse(3.4);                              // bend BACK, spring snaps back
    }
    let recent = 0;
    for (let i = 0; i < 5; i++) if (time0 - e.hitStamps[i] < 1.1) recent++;
    if (recent >= 4) {                                     // sustained fire → off balance
      e.fSpineX.impulse(1.3);
      e.fNeckX.impulse(1.1);
    }

    if (part === 'head') {                                 // H4: one-shot, big burst
      die(e, dir, point, true);
      return true;
    }

    if (e.type === 'heavy') {
      if (part === 'chest') popPlate(e, point, dir);
      const gone = e.body.plates.length - e.platesLeft;
      if (gone < 4) dmg *= 0.15;                           // armour absorbs (E1)
    }
    if (part === 'limb') dmg *= 0.65;
    else if (part === 'pelvis') dmg *= 0.9;

    e.hp -= dmg;
    if (fx) fx.bloodHit(point, dir, dmg, false);
    if (e.hp <= 0) { die(e, dir, point, false); return true; }
    return false;
  }

  // ---------- wave composition + seeded perimeter spawns (D1) ----------
  function composition(n) {
    const count = Math.min(16, 4 + n * 2);
    const out = [];
    if (n <= 1) { for (let i = 0; i < count; i++) out.push('rusher'); return out; }
    if (n >= 4) {
      const heavies = Math.min(2, 1 + Math.floor((n - 4) / 2));
      for (let i = 0; i < heavies; i++) out.push('heavy');
    }
    const rest = count - out.length;
    let gunners = Math.round(rest * (n === 2 ? 0.4 : Math.min(0.62, 0.45 + (n - 3) * 0.05)));
    if (n >= 6) gunners = Math.min(gunners + 1, Math.max(0, rest - 2));   // pairs still have rushers
    for (let i = 0; i < gunners; i++) out.push('gunner');
    while (out.length < count) out.push('rusher');
    return rng.shuffle(out);
  }

  function spawnPoint(px, pz, out) {
    const ix = bounds.minX + 2.5, ax = bounds.maxX - 2.5;
    const iz = bounds.minZ + 2.5, az = bounds.maxZ - 2.5;
    const mx = (ix + ax) / 2, mz = (iz + az) / 2;
    const AX = [ix, ax, ix, ax, mx, mx, ix, ax];          // corners + edge midpoints
    const AZ = [iz, iz, az, az, iz, az, mz, mz];
    let bestX = mx, bestZ = mz, bestD = -1;
    for (let tries = 0; tries < 6; tries++) {
      const k = rng.int(8);
      const jx = Math.min(ax, Math.max(ix, AX[k] + rng.range(-1.6, 1.6)));
      const jz = Math.min(az, Math.max(iz, AZ[k] + rng.range(-1.6, 1.6)));
      const d = Math.hypot(jx - px, jz - pz);
      if (d >= 18) { out.set(jx, bounds.floorY, jz); return out; }
      if (d > bestD) { bestD = d; bestX = jx; bestZ = jz; }
    }
    out.set(bestX, bounds.floorY, bestZ);                  // farthest anchor found
    return out;
  }

  function spawnWave(n) {
    const list = composition(n);
    const p = state.move.pos;
    for (let i = 0; i < list.length; i++) {
      let e = acquire(list[i]);
      if (!e && ragdolls.length) { dropRagdoll(ragdolls[0]); e = acquire(list[i]); } // reclaim sinking bodies
      if (!e) break;
      spawnPoint(p.x, p.z, _to);
      e.pos.set(_to.x, bounds.floorY, _to.z);
      e.from.copy(e.pos);
      e.yaw = Math.atan2(p.x - _to.x, p.z - _to.z) + Math.PI;
      e.faceSpr.snap(e.yaw); e.faceSpr.set(e.yaw);
      e.body.root.position.copy(e.pos);
      e.body.root.rotation.y = e.yaw;
      e.leanT = rng.range(0.6, 2.2);
    }
  }

  function clearAll() {
    for (let i = living.length - 1; i >= 0; i--) release(living[i]);
    living.length = 0;
    for (let i = ragdolls.length - 1; i >= 0; i--) release(ragdolls[i]);
    ragdolls.length = 0;
    lastRagdoll = null;
    campedUntil = -99; hFilled = 0; hIdx = 0; sampleT = 0;
    hMoved.fill(0);
    for (let i = dLive.length - 1; i >= 0; i--) {
      world.scene.remove(dLive[i].mesh);
      dLive[i].mesh.visible = false;
      dFree.push(dLive[i]);
    }
    dLive.length = 0;
    pushCue = 0;
  }

  // ---------- module update ----------
  function update(dt, elapsed) {
    time0 = elapsed;
    if (!(dt > 0)) return;
    if (pushCue > 0) {                                     // heard cues → aggression (E2)
      for (let i = 0; i < living.length; i++) {
        const e = living[i];
        e.pushT = Math.max(e.pushT, e.type === 'rusher' ? pushCue * 0.8 : pushCue);
      }
      pushCue = 0;
    }
    sampleT += dt;
    if (sampleT >= 0.25) { sampleT = 0; trackPlayer(elapsed); }
    for (let i = living.length - 1; i >= 0; i--) {
      const e = living[i];
      if (!e.alive) continue;
      e.thinkT -= dt;
      if (e.thinkT <= 0) {
        e.thinkT = 0.1;
        think(e, elapsed);
        if (living.length > 1) separate();
      }
      updateEnemy(e, dt);
    }
    for (let i = ragdolls.length - 1; i >= 0; i--) updateRagdoll(ragdolls[i], dt);
    updateDebris(dt);
  }

  return {
    update,
    spawnWave,
    aliveCount: () => living.length,
    living: () => living,
    clearAll,
    applyHit,
    hitMeshes,                        // extra (world/weapon raycast collection)
    get lastRagdoll() { return lastRagdoll; },
    ragdollCount: () => ragdolls.length,
  };
}
