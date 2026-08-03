// ---------------------------------------------------------------------------
// main.js — bootstrap + wiring only. Builds the renderer/scene/camera once,
// instantiates every system, defines the fixed-step update order and the
// restart path (K6: no leaked listeners, lights or audio nodes).
// ---------------------------------------------------------------------------
import * as THREE from 'three';

import { SEED, RNG } from './core/rng.js';
import { TimeManager } from './core/time.js';
import { Input } from './core/input.js';
import { Loop, STEP } from './core/loop.js';
import { CollisionWorld } from './player/collision.js';
import { Controller } from './player/controller.js';
import { CameraRig } from './player/camera.js';
import { Viewmodel } from './weapon/viewmodel.js';
import { Sway } from './weapon/sway.js';
import { Motion } from './weapon/motion.js';
import { Recoil } from './weapon/recoil.js';
import { ADS } from './weapon/ads.js';
import { Reload, TUNING as RELOAD_TUNING } from './weapon/reload.js';
import { Fire, TUNING as FIRE_TUNING } from './weapon/fire.js';

const MAG_SIZE = FIRE_TUNING.MAG_SIZE;
import { Muzzle } from './fx/muzzle.js';
import { Impacts } from './fx/impacts.js';
import { Decals } from './fx/decals.js';
import { Shells } from './fx/shells.js';
import { Particles } from './fx/particles.js';
import { Shake } from './fx/shake.js';
import { AudioBus } from './audio/bus.js';
import { Guns } from './audio/guns.js';
import { ReloadAudio } from './audio/reload.js';
import { UIAudio } from './audio/ui.js';
import { EnemyManager } from './enemies/enemy.js';
import { AI } from './enemies/ai.js';
import { Spawner } from './enemies/spawner.js';
import { Ragdolls } from './enemies/ragdoll.js';
import { Level } from './world/level.js';
import { Props } from './world/props.js';
import { setupRenderer, setupLighting } from './world/lighting.js';
import { HUD } from './ui/hud.js';
import { Crosshair } from './ui/crosshair.js';
import { Hitmarker } from './ui/hitmarker.js';
import { Overlay, track } from './debug/overlay.js';
import { runSelfTest } from './debug/selftest.js';

// ---------------------------------------------------------------- boot ------
const app = document.getElementById('app');
const hudRoot = document.getElementById('hud');

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // P2
renderer.setSize(window.innerWidth, window.innerHeight);
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.02, 700);
camera.rotation.order = 'YXZ';
scene.add(camera);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --------------------------------------------------------------- context ----
const ctx = {
  scene, camera, renderer,
  rng: new RNG(SEED),
  time: new TimeManager(),
  input: new Input(),
  collision: new CollisionWorld(),
  targets: {
    solidList: [],
    register(m) { this.solidList.push(m); },
    unregister(m) { const i = this.solidList.indexOf(m); if (i >= 0) this.solidList.splice(i, 1); },
  },
  hp: 100,
  tmpMuzzle: new THREE.Vector3(),
  tmpPos: new THREE.Vector3(),
};

setupRenderer(renderer);
setupLighting(scene, track);

// viewmodel fill: the sunset backlights the gun into a silhouette — a warm,
// short-range camera-anchored key keeps the weapon readable without touching
// the world. Created once at boot, so restart leak counts stay flat.
const vmFill = new THREE.PointLight(0xffc07a, 1.6, 1.8, 2);
vmFill.position.set(0.28, 0.22, -0.25);
camera.add(vmFill);

ctx.level = new Level(scene, ctx.collision, ctx.targets, track);
ctx.props = new Props(scene, ctx.targets, ctx.rng);

ctx.controller = new Controller(ctx.collision,
  new THREE.Vector3(ctx.level.playerStart.x, 0, ctx.level.playerStart.z));
ctx.cameraRig = new CameraRig(camera);
ctx.viewmodel = new Viewmodel(camera);

ctx.sway = new Sway();
ctx.motion = new Motion();
ctx.recoil = new Recoil();
ctx.ads = new ADS();
ctx.reload = new Reload();
ctx.fire = new Fire(new THREE.Raycaster());

ctx.fx = {
  muzzle: new Muzzle(scene),
  decals: new Decals(scene, ctx.rng),
  shells: new Shells(scene),
  particles: new Particles(scene),
  shake: new Shake(),
};
ctx.fx.impacts = new Impacts(ctx);
ctx.fx.plateBreak = (p, dir) => ctx.fx.impacts.plateBreak(p, dir);
ctx.shake = ctx.fx.shake; // camera.js reads shake through ctx

ctx.audio = { bus: new AudioBus() };
ctx.audio.guns = new Guns(ctx.audio.bus, ctx.rng);
ctx.audio.reloadFns = new ReloadAudio(ctx.audio.bus, ctx.rng);
ctx.audio.ui = new UIAudio(ctx.audio.bus);
ctx.fx.shells.bind({ camera, rng: ctx.rng, playerPos: ctx.controller.pos, audio: ctx.audio });

ctx.ui = {
  hud: new HUD(hudRoot, ctx),
  crosshair: new Crosshair(hudRoot),
  hitmarker: new Hitmarker(hudRoot),
};
ctx.ui.hud._proj = (worldPos) => {
  const v = ctx.tmpPos.copy(worldPos).project(camera);
  if (v.z > 1) return null;
  return {
    x: (v.x * 0.5 + 0.5) * window.innerWidth,
    y: (-v.y * 0.5 + 0.5) * window.innerHeight,
  };
};

ctx.enemies = new EnemyManager(ctx);
ctx.ai = new AI(ctx);
ctx.spawner = new Spawner(ctx);
ctx.ragdolls = new Ragdolls(scene, ctx.collision);
ctx.overlay = new Overlay(ctx);

// ------------------------------------------------------------ game state ----
let wasSprinting = false;

function playerDamage(dmg, dir, sourcePos) {
  if (ctx.hp <= 0) return;
  ctx.hp = Math.max(0, ctx.hp - dmg);
  ctx.ui.hud.setHp(ctx.hp);
  ctx.fx.shake.dirKick(dir, dmg / 8);
  ctx.fx.shake.add(0.16 + dmg * 0.012);
  ctx.cameraRig.damageKick(dir, ctx.cameraRig.yaw);
  ctx.cameraRig.fovKick.impulse(-2.6);
  // directional arc: angle of attacker relative to view
  const dx = sourcePos.x - ctx.controller.pos.x;
  const dz = sourcePos.z - ctx.controller.pos.z;
  const yaw = ctx.cameraRig.yaw;
  const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
  const rx = Math.cos(yaw), rz = -Math.sin(yaw);
  ctx.ui.hud.damageArc(Math.atan2(dx * rx + dz * rz, dx * fx + dz * fz));
  if (ctx.hp <= 0) die();
}
ctx.playerDamage = playerDamage;

function die() {
  ctx.input.dead = true;
  ctx.audio.ui.death();
  ctx.time.hitStop(0.5, 0.2);
  ctx.fx.shake.add(0.7);
  ctx.ui.hud.showDeath(ctx.ui.hud.score, ctx.spawner.wave);
}

function startReload() {
  if (ctx.reload.locking) return;
  if (ctx.fire.mag <= 0 && ctx.fire.reserve <= 0) return;
  if (ctx.fire.mag >= MAG_SIZE) return;
  const tactical = ctx.fire.mag > 0;
  if (ctx.reload.start(tactical, ctx.fire.mag)) {
    ctx.viewmodel.magNew.visible = true;
    ctx.audio.ui.reloadStart();
  }
}

function handleReloadEvents(events) {
  for (const ev of events) {
    switch (ev) {
      case 'release': ctx.audio.reloadFns.release(); break;
      case 'eject': {
        ctx.audio.reloadFns.magOut();
        ctx.viewmodel.magOld.visible = false;
        ctx.viewmodel.getPortWorld(ctx.tmpMuzzle);
        ctx.fx.shells.ejectMag(ctx.tmpMuzzle, !ctx.reload.tactical);
        break;
      }
      case 'slam': ctx.audio.reloadFns.magIn(); break;
      case 'boltBack': ctx.audio.reloadFns.boltBack(); break;
      case 'boltHome': ctx.audio.reloadFns.boltHome(); break;
      case 'done': {
        const res = ctx.reload.resolveAmmo(ctx.fire.reserve);
        ctx.fire.mag = res.mag; ctx.fire.reserve = res.reserve;
        ctx.viewmodel.magOld.visible = true;
        ctx.viewmodel.magNew.visible = false;
        ctx.ui.hud.setAmmo(ctx.fire.mag, ctx.fire.reserve);
        break;
      }
    }
  }
}

function restart() {
  track.restarts++;
  // dynamic world cleanup — pooled objects return home, no leaks (K6)
  ctx.enemies.reset();
  ctx.ragdolls.reset();
  ctx.fx.decals.reset();
  ctx.fx.shells.reset();
  ctx.fx.muzzle.reset();
  ctx.fx.particles.reset();
  ctx.fx.shake.reset();
  ctx.props.reset();
  for (const c of ctx.level.coverPoints) { c.taken = false; c.by = null; }
  // systems reset
  ctx.rng.reset(SEED);
  ctx.sway.reset(); ctx.motion.reset(); ctx.recoil.reset(); ctx.ads.reset();
  ctx.reload.reset(); ctx.fire.reset();
  ctx.viewmodel.resetPose();
  ctx.viewmodel.magOld.visible = true;
  ctx.viewmodel.magNew.visible = false;
  ctx.controller.pos.set(ctx.level.playerStart.x, 0, ctx.level.playerStart.z);
  ctx.controller.vel.set(0, 0, 0);
  ctx.cameraRig.yaw = 0; ctx.cameraRig.pitch = -0.03;
  ctx.cameraRig.fovSpring.set(75); ctx.cameraRig.fovKick.set(0);
  ctx.cameraRig.landDip.set(0); ctx.cameraRig.dmgPitch.set(0); ctx.cameraRig.lean.set(0);
  ctx.hp = 100;
  ctx.input.dead = false;
  ctx.ai.reset();
  ctx.spawner.reset();
  ctx.ui.hud.reset(0, 100, ctx.fire.mag, ctx.fire.reserve);
  ctx.ui.hud.setAmmo(ctx.fire.mag, ctx.fire.reserve);
  ctx.spawner.startFirstWave();
  // pointer lock was released by death — ask for re-entry cleanly
  ctx.ui.hud.showPause('CLICK TO RE-DEPLOY');
}

// ---------------------------------------------------------------- input -----
ctx.input.attach(renderer.domElement);

ctx.input.onGesture(() => {
  ctx.audio.bus.ensure();      // K1: AudioContext only after user gesture
  ctx.ui.hud.dismissHint();
});

renderer.domElement.addEventListener('mousedown', () => {
  if (!ctx.input.locked && !ctx.input.dead) ctx.input.requestLock();
});
ctx.ui.hud.el.overlay.addEventListener('mousedown', () => {
  if (!ctx.input.dead && !ctx.input.locked) ctx.input.requestLock();
});

ctx.input.onLock((locked) => {
  if (locked) {
    ctx.audio.bus.resume();
    ctx.loop.setPaused(false);
    ctx.ui.hud.hideOverlay();
    ctx.spawner.startFirstWave();
  } else if (ctx.input.started && !ctx.input.dead) {
    hudPause();
  }
});

function hudPause() {
  ctx.loop.setPaused(true);       // K3: pause overlay, never a freeze
  ctx.ui.hud.showPause('CLICK TO RESUME');
  ctx.audio.bus.suspend();
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && ctx.input.locked) document.exitPointerLock();
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Backquote') ctx.overlay.toggle();
  if (e.code === 'KeyT') runSelfTest(ctx);           // A4: works without lock
  if (e.code === 'KeyR' && ctx.input.locked && !ctx.input.dead) startReload();
  if (e.code === 'Enter' && ctx.input.dead) restart();
});

// ----------------------------------------------------------------- loop -----
ctx.controller.onLand((fall) => {
  ctx.cameraRig.land(fall);
  ctx.motion.landHit(fall);
  ctx.fx.shake.add(Math.min(0.3, fall * 0.02));
  ctx.audio.ui.land(fall);
});
ctx.controller.onStep((alt) => ctx.audio.ui.step(alt));

function update(dt) {
  // player + weapon ----------------------------------------------------------
  ctx.controller.update(dt, ctx.input, ctx.cameraRig.yaw);
  ctx.ads.update(dt, ctx.input);
  const relEvents = ctx.reload.update(dt, ctx.controller, ctx.viewmodel);
  handleReloadEvents(relEvents);
  ctx.cameraRig.update(dt, ctx.input, ctx);

  const m = ctx.input.mousePerStep();
  ctx.sway.update(dt, m.dx, m.dy, 0.0021 * ctx.ads.sensScale(), ctx.ads.swayScale(), ctx.ads.value);
  ctx.motion.update(dt, ctx.controller, ctx.ads.bobScale(), ctx.ads.breatheScale());
  ctx.recoil.update(dt);
  ctx.viewmodel.update(dt, ctx);
  ctx.fire.update(dt, ctx.input, ctx);

  // sprint FOV kick on transition (F7)
  if (ctx.controller.sprinting && !wasSprinting) ctx.cameraRig.fovKick.impulse(3.2);
  wasSprinting = ctx.controller.sprinting;

  // enemies --------------------------------------------------------------------
  ctx.ai.update(dt, ctx.enemies.list);
  ctx.enemies.update(dt);
  ctx.spawner.update(dt);

  // fx ---------------------------------------------------------------------------
  ctx.fx.muzzle.update(dt);
  ctx.fx.particles.update(dt);
  ctx.fx.decals.update(dt);
  ctx.fx.shells.update(dt);
  ctx.fx.shake.update(dt);
  ctx.props.update(dt);
  ctx.ragdolls.update(dt);

  // audio + ui ---------------------------------------------------------------------
  ctx.audio.ui.heartbeat(dt, ctx.hp);
  ctx.ui.crosshair.update(dt, ctx);
  ctx.ui.hitmarker.update(dt);
  ctx.ui.hud.reloadProgress(ctx.reload.locking
    ? ctx.reload.t / (ctx.reload.tactical ? RELOAD_TUNING.TACTICAL_TIME : RELOAD_TUNING.EMPTY_TIME) : 0);
  ctx.ui.hud.setAmmo(ctx.fire.mag, ctx.fire.reserve);
  ctx.overlay.update(dt);
}

function render(alpha) {
  ctx.cameraRig.apply(alpha);
  ctx.viewmodel.compose(alpha);
  renderer.render(scene, camera);
}

ctx.loop = new Loop({
  time: ctx.time,
  input: ctx.input,
  update,
  render,
});

// initial HUD state
ctx.ui.hud.reset(0, 100, ctx.fire.mag, ctx.fire.reserve);
ctx.ui.hud.setAmmo(ctx.fire.mag, ctx.fire.reserve);
ctx.ui.hud.setWave(1);

ctx.loop.start();

// debug hook for the headless test harness + manual inspection (P4)
window.__HIGHRISE = {
  ctx, restart, track,
  // harness-only: simulate pointer-lock acquisition without a real gesture
  debugStart() {
    ctx.input.locked = true;
    ctx.input.started = true;
    ctx.loop.setPaused(false);
    ctx.ui.hud.dismissHint();
    ctx.spawner.startFirstWave();
  },
  // harness-only: advance sim deterministically, bypassing rAF timing.
  // camera/viewmodel matrices are always applied so aim + self-test stay
  // valid; the WebGL submit only happens when doRender is set.
  debugStep(n, alpha = 1, doRender = false) {
    for (let i = 0; i < n; i++) {
      ctx.input.beginSteps(1);
      ctx.input.nextStep();
      update(STEP);
      // mirror the real loop's per-frame apply+compose so the viewmodel's
      // prev/cur interpolation buffers stay in lockstep (compose swaps them)
      ctx.cameraRig.apply(alpha);
      ctx.viewmodel.compose(alpha);
    }
    scene.updateMatrixWorld(); // keep raycasts valid without a WebGL submit
    if (doRender) renderer.render(scene, camera);
  },
};
