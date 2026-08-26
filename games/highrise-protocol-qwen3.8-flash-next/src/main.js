// HIGHRISE PROTOCOL — integration layer: loop, phase machine, wave director,
// OVERDRIVE, killcam, god mode, restart hygiene, debug overlay.
import * as THREE from 'three';

import { rng, SEED } from './core/rng.js';
import { time } from './core/time.js';
import { bus } from './core/bus.js';
import { state } from './core/state.js';
import { input } from './core/input.js';
import { shake } from './core/shake.js';
import { quality } from './core/quality.js';
import { Spring } from './core/spring.js';

import { init as initWorld } from './world/world.js';
import { init as initAudio } from './audio/audio.js';
import { init as initFx } from './fx/fx.js';
import { init as initPost } from './post/post.js';
import { init as initController } from './player/controller.js';
import { init as initWeapon } from './player/weapon.js';
import { init as initEnemies } from './ai/enemies.js';
import { init as initUi } from './ui/ui.js';
import { runSightsSelfTest } from './player/sights-selftest.js';

// ---------- renderer / scenes / cameras ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(quality.dpr());
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.08, 600);

const vmScene = new THREE.Scene();
const vmCamera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 12);
vmScene.add(new THREE.HemisphereLight(0xffd9b0, 0x2a3242, 1.15));
const vmKey = new THREE.DirectionalLight(0xffc890, 2.2);
vmKey.position.set(-0.4, 1.2, 1.6);
vmScene.add(vmKey);
const vmMuzzleLight = new THREE.PointLight(0xffb066, 0, 2.4, 2);
vmScene.add(vmMuzzleLight);

// Warm key + cool bounce (G1)
const sun = new THREE.DirectionalLight(0xffb56b, 3.1);
sun.position.set(-60, 26, -80);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -40; sun.shadow.camera.right = 40;
sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 220;
sun.shadow.bias = -0.0006;
scene.add(sun);
scene.add(sun.target);
const bounce = new THREE.HemisphereLight(0x37455e, 0x2b2018, 0.85);
scene.add(bounce);
scene.fog = new THREE.FogExp2(0x5a4636, 0.011);

const ctx = { renderer, scene, camera, vmScene, vmCamera, sun, debug: { hooks: [] } };

// ---------- boot modules (contract init order) ----------
ctx.world = initWorld(ctx);
ctx.fx = initFx(ctx);
ctx.post = initPost(ctx);
ctx.audio = initAudio(ctx);
ctx.controller = initController(ctx);
ctx.weapon = initWeapon(ctx);
ctx.enemies = initEnemies(ctx);
ctx.ui = initUi(ctx);

const MATCH_SECONDS = 420; // sun dips over the course of a match (G1)
const matchClock = { t: 0 };

// ---------- director state ----------
const dir = {
  betweenWaves: 0,      // breather countdown
  pendingTally: null,
  killcamT: 0,
  killcamFocus: null,
  camSave: { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), fov: 75 },
  hitFlashT: 0,
  odFlashT: 0,
  musicT: 0,
};

function startMatch(god) {
  state.godmode = !!god;
  rng.reseed(SEED);
  state.reset(true);
  time.reset();
  shake.reset();
  matchClock.t = 0;
  dir.betweenWaves = 0; dir.pendingTally = null; dir.killcamT = 0; dir.killcamFocus = null;
  ctx.enemies.clearAll();
  ctx.fx.clearForWave();
  ctx.controller.reset(ctx.world.playerStart);
  ctx.weapon.reset?.();
  ctx.world.resetProps?.();
  state.phase = 'playing';
  bus.emit('game:phase', { phase: 'playing' });
  ctx.ui.refreshGodBadge();
  queueWave(1, 2.2);
  input.requestLock(document.body);
}

const waveQueue = { next: 0, armed: false };
function queueWave(n, delay) {
  waveQueue.next = n;
  waveQueue.armed = true;
  dir.betweenWaves = delay;
}
function launchWave(n) {
  state.wave = n;
  state.waveActive = true;
  ctx.fx.clearForWave(); // H6
  ctx.enemies.spawnWave(n);
  bus.emit('wave:start', { n });
  ctx.ui.banner(`WAVE ${n}`, 'HOSTILES INBOUND');
}

// ---------- damage / death / regen (D6) ----------
bus.on('player:damage', ({ amount, from }) => {
  if (state.phase !== 'playing' || state.godmode) return;
  state.hp = Math.max(0, state.hp - amount);
  state.noDamageFor = 0;
  dir.hitFlashT = 1;
  shake.add(3, 0.55);
  shake.kickRecenter(from ? Math.sign((from.x - camera.position.x)) : 1);
  ctx.post.setDamageFlash(1);
  if (state.hp <= 0) killPlayer();
});

function killPlayer() {
  state.phase = 'dead';
  bus.emit('game:phase', { phase: 'dead' });
  bus.emit('player:died');
  input.exitLock();
}

// ---------- combo / OVERDRIVE (D2) ----------
const COMBO_WINDOW = 4;
bus.on('kill', ({ enemy, headshot, point }) => {
  state.kills++;
  const now = time.elapsed;
  const c = state.combo;
  if (now - c.lastKillAt <= COMBO_WINDOW) c.count++; else c.count = 1;
  c.lastKillAt = now;
  if (c.count > c.best) c.best = c.count;
  const base = 100 + (headshot ? 100 : 0);
  state.score += base * Math.max(1, c.count);
  bus.emit('score', { delta: base * c.count, headshot });
  bus.emit('combo', { count: c.count });
  if (c.count >= 5 && !state.overdrive.active && state.overdrive.cooldownLeft <= 0) startOverdrive();
  // last kill of a wave → killcam (D4)
  if (state.waveActive && ctx.enemies.aliveCount() === 0) {
    beginKillcam(enemy, now);
  }
});

function startOverdrive() {
  state.overdrive.active = true;
  state.overdrive.timeLeft = 6;
  time.setOverdrive(true);
  bus.emit('overdrive:start');
}
function endOverdrive() {
  state.overdrive.active = false;
  state.overdrive.cooldownLeft = 14;
  time.setOverdrive(false);
  bus.emit('overdrive:end');
}

// ---------- killcam (D4) ----------
function beginKillcam(enemy, now) {
  dir.killcamT = 1.5;
  dir.killcamFocus = enemy;
  state.killcam = true;
  time.setKillcamScale(0.55);
  dir.camSave.pos.copy(camera.position);
  dir.camSave.quat.copy(camera.quaternion);
  dir.camSave.fov = camera.fov;
}

function endKillcam() {
  state.killcam = false;
  dir.killcamT = 0;
  time.setKillcamScale(1);
  camera.position.copy(dir.camSave.pos);
  camera.quaternion.copy(dir.camSave.quat);
  camera.fov = dir.camSave.fov;
  camera.updateProjectionMatrix();
}
function updateKillcam(rawDt) {
  dir.killcamT -= rawDt;
  const target = dir.killcamFocus?.deathPoint || dir.killcamFocus?.pos || camera.position;
  const t = 1 - Math.max(0, dir.killcamT) / 1.5;
  const ang = t * Math.PI * 0.9 + 0.6;
  const r = 3.4;
  camera.position.set(
    target.x + Math.cos(ang) * r,
    target.y + 1.6 + Math.sin(t * Math.PI) * 0.7,
    target.z + Math.sin(ang) * r,
  );
  camera.lookAt(target.x, target.y + 0.9, target.z);
  camera.fov = 50 + 25 * (t * t * (3 - 2 * t)); // ease-in-out back to wide for snap
  camera.updateProjectionMatrix();
  if (dir.killcamT <= 0) endKillcam();
}

// ---------- wave completion ----------
function checkWaveEnd() {
  if (!state.waveActive || dir.killcamT > 0 || dir.pendingTally) return;
  if (ctx.enemies.aliveCount() === 0 && time.elapsed > 1) {
    state.waveActive = false;
    const a = state.accuracy;
    const stats = {
      wave: state.wave,
      accuracy: a.fired ? (a.hit / a.fired) * 100 : 100,
      headshots: a.hit ? (a.headshots / a.hit) * 100 : 0,
      kills: state.kills,
      bestCombo: state.combo.best,
      score: state.score,
    };
    a.fired = 0; a.hit = 0; a.headshots = 0;
    bus.emit('wave:cleared', { n: state.wave, stats });
    dir.pendingTally = stats;
    dir.betweenWaves = 0; // tally shown first, then countdown
  }
}

// ---------- keys: T self-test, L quality, ` debug, Escape pause ----------
let debugVisible = false;
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyT' && !e.repeat) {
    const st = document.getElementById('selftest');
    if (st && !st.classList.contains('hidden')) st.classList.add('hidden');
    else runSightsSelfTest(ctx);
  }
  if (e.code === 'KeyL' && !e.repeat) quality.toggle();
  if (e.code === 'Backquote' && !e.repeat) {
    debugVisible = !debugVisible;
    ctx.ui.setDebugVisible?.(debugVisible);
  }
  if (e.code === 'Escape') {
    if (state.phase === 'playing') pauseGame();
  }
  if (e.code === 'KeyR' && !e.repeat && state.phase === 'playing') ctx.weapon.reload?.();
});

function pauseGame() {
  state.phase = 'paused';
  time.paused = true;
  bus.emit('game:phase', { phase: 'paused' });
  input.exitLock();
}
function resumeGame() {
  if (state.phase !== 'paused') return;
  time.paused = false;
  state.phase = 'playing';
  bus.emit('game:phase', { phase: 'playing' });
  input.requestLock(document.body);
}

bus.on('pointerlock', (locked) => {
  if (!locked && state.phase === 'playing') pauseGame();
});

bus.on('pointerlock:error', () => { if (state.phase === 'playing') pauseGame(); });
ctx.ui.bindScreens({
  onStart: (god) => { ctx.audio.unlock(); startMatch(god); },
  onResume: () => resumeGame(),
  onQuit: () => toMenu(),
  onRetry: () => toMenu(),
});
function toMenu() {
  state.phase = 'menu';
  time.paused = false;
  time.reset();
  ctx.enemies.clearAll();
  ctx.fx.clearForWave();
  bus.emit('game:phase', { phase: 'menu' });
}

// ---------- tab visibility (P2/K4) ----------
document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.phase === 'playing') pauseGame();
});

// ---------- resize ----------
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = vmCamera.aspect = w / h;
  camera.updateProjectionMatrix();
  vmCamera.updateProjectionMatrix();
  renderer.setPixelRatio(quality.dpr());
  renderer.setSize(w, h);
  ctx.post.resize?.(w, h, quality.dpr());
});

// ---------- main loop ----------
const clock = { last: performance.now() };
const fps = { frames: 0, t: 0, value: 60 };
const scratch = new THREE.Vector3();

function frame() {
  requestAnimationFrame(frame);
  const now = performance.now();
  let rawDt = (now - clock.last) / 1000;
  clock.last = now;
  if (!Number.isFinite(rawDt)) rawDt = 0;
  rawDt = Math.min(rawDt, 0.05);

  // fps meter + auto-degrade
  fps.frames++; fps.t += rawDt;
  if (fps.t >= 0.5) { fps.value = fps.frames / fps.t; fps.frames = 0; fps.t = 0; quality.tick(fps.value); }

  const dt = time.update(rawDt);
  const el = time.elapsed;

  if (state.phase === 'playing') {
    if (dt > 0) {
      matchClock.t += dt;
      // sun dip over match (G1/G4)
      const k = Math.min(1, matchClock.t / MATCH_SECONDS);
      ctx.world.update(dt, el, k);
      ctx.controller.update(dt, el);
      ctx.weapon.update(dt, el);
      ctx.enemies.update(dt, el);
      ctx.fx.update(dt, el);
      // regen (D6) — bookkeeping lives in controller.update (single owner)
      // overdrive timing
      const od = state.overdrive;
      if (od.active) { od.timeLeft -= dt; if (od.timeLeft <= 0) endOverdrive(); }
      else if (od.cooldownLeft > 0) od.cooldownLeft -= dt;
      // killcam or normal camera ownership
      if (dir.killcamT > 0) updateKillcam(rawDt);
      checkWaveEnd();
      // breather / tally flow
      if (dir.pendingTally) {
        ctx.ui.tally(dir.pendingTally);   // D7: overlay card — game keeps running
        dir.pendingTally = null;
        queueWave(state.wave + 1, 5.5);   // D1: next wave after the breather
      } else if (waveQueue.armed) {
        dir.betweenWaves -= dt;
        if (dir.betweenWaves <= 0) {
          waveQueue.armed = false;
          launchWave(waveQueue.next);
        }
      }
      state.enemyAlive = ctx.enemies.aliveCount();
      // music intensity at 4 Hz
      dir.musicT -= dt;
      if (dir.musicT <= 0) {
        dir.musicT = 0.25;
        bus.emit('music:intensity', { wave: state.wave, enemies: state.enemyAlive, combo: state.combo.count, between: !state.waveActive });
      }
      // combo window expiry HUD
      if (state.combo.count > 0 && time.elapsed - state.combo.lastKillAt > COMBO_WINDOW) state.combo.count = 0;
    }
  } else {
    // menu/pause: keep world ambient alive but frozen player sim
    ctx.world.update?.(rawDt * 0.2, el);
    ctx.fx.update?.(rawDt * 0.2, el);
  }

  ctx.ui.update?.(rawDt);
  ctx.post.update?.(rawDt, el);
  ctx.audio.update?.(rawDt, el);
  ctx.post.render?.();

  if (debugVisible) updateDebug(rawDt);
}

let dbgAcc = 0;
function updateDebug(rawDt) {
  dbgAcc += rawDt;
  if (dbgAcc < 0.25) return;
  dbgAcc = 0;
  const info = renderer.info;
  const fx = ctx.fx.stats?.() || {};
  const wp = ctx.weapon.stats?.() || {};
  ctx.ui.debug?.([
    `HIGHRISE PROTOCOL · seed 0x${SEED.toString(16).toUpperCase()}`,
    `fps ${fps.value.toFixed(0)}  frame ${(rawDt * 1000).toFixed(1)}ms  timeScale ${time.scale().toFixed(2)}`,
    `draws ${info.render.calls}  tris ${info.render.triangles}`,
    `particles ${fx.particles ?? '-'}  decals ${fx.decals ?? '-'}  blood ${fx.blood ?? '-'}  tracers ${fx.tracers ?? '-'}  shells ${fx.shells ?? '-'}`,
    `ragdolls ${wp.ragdolls ?? ctx.enemies.ragdollCount?.() ?? '-'}  ai ${state.enemyAlive}/${(ctx.enemies.maxEnemies ?? 16)}`,
    `mag ${state.mag}  wave ${state.wave}  score ${state.score}  combo x${state.combo.count}`,
    `quality ${quality.mode} (auto:${quality.auto ? 'on' : 'off'})  dpr ${renderer.getPixelRatio().toFixed(2)}`,
  ].join('\n'));
}

requestAnimationFrame(frame);

// menu idle camera: slow orbit over the floor for the start screen
(function menuCam() {
  const t0 = performance.now();
  (function tick() {
    if (state.phase === 'menu') {
      const a = (performance.now() - t0) / 40000;
      camera.position.set(Math.cos(a) * 14, 3.2 + Math.sin(a * 2) * 0.4, Math.sin(a) * 11);
      camera.lookAt(0, 1.6, 0);
    }
    requestAnimationFrame(tick);
  })();
})();

export { ctx };

// Debug/test surface (used by P4 overlay and automated verification)
window.__game = ctx;
window.__state = state;
window.__bus = bus;
window.__input = input;
window.__time = time;
