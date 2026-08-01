import * as THREE from "three";
import { FixedLoop } from "./core/loop.js";
import { TimeManager } from "./core/time.js";
import { Input } from "./core/input.js?v=20260801-10";
import { RNG, SEED } from "./core/rng.js";
import { CollisionWorld } from "./player/collision.js";
import { PlayerController } from "./player/controller.js";
import { CameraController } from "./player/camera.js?v=20260801-2";
import { WeaponSway } from "./weapon/sway.js?v=20260802-1";
import { WeaponMotion } from "./weapon/motion.js?v=20260802-1";
import { WeaponRecoil } from "./weapon/recoil.js?v=20260801-7";
import { WeaponADS } from "./weapon/ads.js";
import { ReloadTimeline } from "./weapon/reload.js";
import { FireController, TUNING as FIRE_TUNING } from "./weapon/fire.js?v=20260802-2";
import { WeaponViewmodel } from "./weapon/viewmodel.js?v=20260801-94";
import { AssetLibrary, attachAssets } from "./assets/asset-loader.js?v=20260801-17";
import { EnemySpawner } from "./enemies/spawner.js?v=20260802-1";
import { RagdollManager } from "./enemies/ragdoll.js";
import { ParticleSystem } from "./fx/particles.js";
import { DecalSystem } from "./fx/decals.js";
import { ShellSystem } from "./fx/shells.js?v=20260801-3";
import { MuzzleFX } from "./fx/muzzle.js?v=20260801-11";
import { ImpactFX } from "./fx/impacts.js?v=20260802-1";
import { ShakeFX } from "./fx/shake.js";
import { AudioBus } from "./audio/bus.js";
import { GunAudio } from "./audio/guns.js";
import { ReloadAudio } from "./audio/reload.js";
import { UIAudio } from "./audio/ui.js";
import { HUD } from "./ui/hud.js?v=20260802-1";
import { Level } from "./world/level.js";
import { WorldProps } from "./world/props.js?v=20260802-1";
import { buildLighting } from "./world/lighting.js";
import { DebugOverlay } from "./debug/overlay.js?v=20260801-2";
import { runAimAlignmentSelfTest } from "./debug/selftest.js";
import { updateTelemetry } from "./debug/telemetry.js";
const container = document.querySelector("#game");
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
container.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.035, 100);
scene.add(camera);
const rng = new RNG(SEED);
const time = new TimeManager();
const input = new Input(renderer.domElement);
const hud = new HUD(container, rng);
const debugRoot = hud.root.querySelector("#debug") || (() => { const node = document.createElement("div"); node.id = "debug"; hud.root.appendChild(node); return node; })();
const debug = new DebugOverlay(debugRoot);
const audioBus = new AudioBus();
const gunAudio = new GunAudio(audioBus);
const reloadAudio = new ReloadAudio(audioBus);
const uiAudio = new UIAudio(audioBus);
const collision = new CollisionWorld();
const level = new Level(scene, collision);
const props = new WorldProps(scene, collision, rng);
buildLighting(scene);
renderer.shadowMap.autoUpdate = false;
renderer.shadowMap.needsUpdate = true;
const player = new PlayerController(collision);
const cameraController = new CameraController(camera);
camera.position.set(player.position.x, player.position.y + player.eyeHeight, player.position.z);
camera.rotation.set(cameraController.pitch, cameraController.yaw, 0);
cameraController.currentPosition.copy(camera.position);
cameraController.previousPosition.copy(camera.position);
cameraController.currentRotation.set(cameraController.pitch, cameraController.yaw, 0);
cameraController.previousRotation.copy(cameraController.currentRotation);
camera.updateMatrixWorld(true);
const particles = new ParticleSystem(scene);
const decals = new DecalSystem(scene);
const shells = new ShellSystem(scene, rng, camera);
const muzzle = new MuzzleFX(scene, camera);
const impacts = new ImpactFX({ particles, decals, rng });
const shake = new ShakeFX(cameraController);
const ragdolls = new RagdollManager(scene);
const motion = new WeaponMotion();
const sway = new WeaponSway();
const recoil = new WeaponRecoil(rng);
const ads = new WeaponADS();
const reload = new ReloadTimeline();
const weapon = new WeaponViewmodel(camera, { motion, sway, recoil, reload });
const assetLibrary = new AssetLibrary();
const raycastables = [];
let spawner;
let dead = false;
let health = 100;
let damageFlash = 0;
let pointerLockEver = false;
const muzzlePosition = new THREE.Vector3();
const shellPosition = new THREE.Vector3();
const defaultNormal = new THREE.Vector3(0, 1, 0);
const tracers = [];
const plateDebris = [];
let worldTime = 0;
let restartCount = 0;
const fireContext = { player, adsBlend: 0, reloadActive: false };
const enemyContext = { player, reloadActive: false, onEnemyDamage: handlePlayerDamage, onEnemyFire: handleEnemyFire };
const hudState = { health: 100, ammo: FIRE_TUNING.magazineSize, reserve: FIRE_TUNING.reserveAmmo, wave: 0, speed: 0, firing: false, adsBlend: 0, damageFlash: 0 };
const debugState = { fps: 0, frameMs: 0, drawCalls: 0, triangles: 0, ai: 0, particles: 0, ragdolls: 0, particlePool: "", decalPool: "", shellPool: "", timeScale: 1, restartCount: 0, adsBlend: 0, adsFloor: 0.32, bobFloor: 0.25, breathFloor: 0.35, sway: null, recoil: null };
window.__highriseState = { playerSpeed: 0, sprint: 0, crouch: 0, ads: 0, sway: { x: 0, y: 0, z: 0 }, motion: { x: 0, y: 0, z: 0 }, final: { x: 0, y: 0, z: 0 }, recoil: { pitch: 0, yaw: 0, roll: 0, punch: 0, shots: 0 }, camera: { x: 0, y: 0, z: 0, pitch: 0, yaw: 0, roll: 0 }, input: { left: false, right: false, pointerButtons: 0, pointerSeen: false, failed: false, locked: false }, assets: { weapon: false, enemy: false, weaponAnimations: 0, enemyAnimations: 0, error: "" } };
function getHitNormal(hit, fallback = defaultNormal) {
  if (!hit?.face) return fallback;
  return hit.face.normal.clone().transformDirection(hit.object.matrixWorld).normalize();
}
function spawnTracer(shot, start = shot.origin) {
  const end = shot.hit?.point || shot.origin.clone().addScaledVector(shot.direction, 34);
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffd28a, transparent: true, opacity: 0.58, blending: THREE.AdditiveBlending }));
  scene.add(line);
  tracers.push({ line, life: 0.045 });
  if (tracers.length > 18) {
    const oldest = tracers.shift();
    oldest.line.geometry.dispose();
    oldest.line.material.dispose();
    scene.remove(oldest.line);
  }
}
function handleEnemyDeath(enemy, result) {
  ragdolls.spawn(enemy, result.direction || new THREE.Vector3());
  gunAudio.kill();
  shake.hit(result.headshot ? 0.05 : 0.032);
  hud.showHit({ kill: true, damage: result.headshot ? 52 : 26, headshot: result.headshot });
  hud.addFeed(`${result.headshot ? "HEADSHOT" : "TARGET DOWN"} / ${enemy.type.toUpperCase()}`, true);
  hud.addScore(result.headshot ? 250 : (enemy.type === "heavy" ? 300 : 100));
  time.triggerHitStop(result.headshot ? 0.055 : 0.045, 0.1);
}

function handlePlateBreak(enemy, plate) {
  const worldPosition = plate.getWorldPosition(new THREE.Vector3());
  // plate.userData.enemy is circular, and Object3D.clone() JSON-serializes
  // userData, so the shard must be built as a fresh mesh instead of a clone.
  const shard = new THREE.Mesh(plate.geometry, plate.material.clone());
  shard.castShadow = true;
  shard.position.copy(worldPosition);
  shard.quaternion.copy(enemy.group.quaternion);
  scene.add(shard);
  plateDebris.push({ mesh: shard, velocity: new THREE.Vector3(rng.signed() * 2, 2.2, rng.signed() * 2), life: 1.6, spin: new THREE.Vector3(5, 4, 3) });
  gunAudio.plate();
  impacts.hit(worldPosition, new THREE.Vector3(0, 1, 0), "metal");
  hud.addFeed("ARMOR PLATE BROKEN");
}

function handlePlayerDamage(amount, direction) {
  if (dead) return;
  health = Math.max(0, health - amount);
  damageFlash = 1;
  hud.showDamage(direction);
  shake.damage(Math.min(0.14, amount * 0.008), direction);
  if (health <= 0) {
    dead = true;
    reload.cancel();
    hud.showDeath(true);
    hud.setPaused(false);
    document.exitPointerLock?.();
  }
}

function handleShot(shot) {
  gunAudio.shot();
  const cameraKick = recoil.fire(ads.blend, player.crouch.value);
  cameraController.addRecoil(cameraKick.pitch, cameraKick.yaw);
  shake.fire(0.014 + (1 - ads.blend) * 0.006, new THREE.Vector3(-shot.direction.x * 0.3, 0.8, 0));
  weapon.getMuzzleWorldPosition(muzzlePosition);
  muzzle.flash(muzzlePosition, shot.direction);
  weapon.getEjectionWorldPosition(shellPosition, ads.blend);
  shells.spawn(shellPosition);
  particles.spawn(muzzlePosition, 0x536066, 0.72, new THREE.Vector3(rng.signed() * 0.08, 0.16, rng.signed() * 0.08), 0.42, -0.25);
  spawnTracer(shot, muzzlePosition);
  if (!shot.hit) return;
  const enemy = spawner.findEnemyFromHit(shot.hit.object);
  if (enemy) {
    const result = enemy.takeDamage(26, shot.hitZone, shot.direction);
    const normal = getHitNormal(shot.hit, shot.direction.clone().negate());
    impacts.hit(shot.hit.point, normal, result.plate ? "metal" : "flesh");
    if (result.plate) return;
    gunAudio.hit();
    hud.showHit({ damage: result.damage, headshot: result.headshot, kill: result.killed });
    hud.addScore(Math.round(result.damage));
    if (!result.killed) hud.addFeed(`${result.headshot ? "HEAD" : "BODY"} HIT / ${Math.round(result.damage)}`);
  } else {
    impacts.hit(shot.hit.point, getHitNormal(shot.hit), shot.hit.object.userData.surface || "concrete");
  }
}

function startReload() {
  if (dead || reload.active || fire.ammo >= FIRE_TUNING.magazineSize || fire.reserve <= 0) return;
  reload.start(fire.ammo, FIRE_TUNING.magazineSize);
  reloadAudio.magRelease();
}

function handleEnemyFire(enemy, direction) {
  gunAudio.enemyReport();
  const amount = enemy.type === "heavy" ? 1.4 : 0.8;
  handlePlayerDamage(amount, new THREE.Vector3(direction.x * 0.7, direction.y * 0.3, direction.z * 0.7));
}

const fire = new FireController({
  camera,
  rng,
  raycastables,
  onShot: handleShot,
  onReload: startReload,
  onDry: () => gunAudio.dry(),
});
input.onMouseUp = (button) => {
  if (button !== 0) return;
  fire.stop();
  recoil.resetBurst();
};

spawner = new EnemySpawner(scene, collision, rng, {
  onWave: (wave) => { hud.showWave(wave); uiAudio.wave(); },
  onBreather: () => hud.addFeed("NEXT WAVE INCOMING"),
  onDeath: handleEnemyDeath,
  onPlateBreak: handlePlateBreak,
  cloneEnemyVisual: () => assetLibrary.cloneEnemy(),
  enemyAnimations: assetLibrary.enemyAnimations,
});

attachAssets(assetLibrary, { weapon, spawner, state: window.__highriseState, hud });

function resetRun() {
  restartCount += 1;
  dead = false;
  health = 100;
  damageFlash = 0;
  player.position.set(0, 0, 17);
  player.velocity.set(0, 0, 0);
  cameraController.yaw = 0;
  cameraController.pitch = -0.055;
  cameraController.resetRecoil();
  recoil.reset();
  fire.reset();
  reload.cancel();
  spawner.reset();
  hud.showDeath(false);
  hud.showWave(0);
}

input.onFirstInput = () => { audioBus.ensure(); hud.hideHint(); time.setPaused(false); };
input.onPointerLockChange = (locked) => {
  if (locked) {
    pointerLockEver = true;
    time.setPaused(false);
    hud.setPaused(false);
    audioBus.setSuspended(false);
  } else if (pointerLockEver && !input.pointerLockFailed && !dead) {
    time.setPaused(true);
    hud.setPaused(true);
    audioBus.setSuspended(true);
  }
};

time.setPaused(true);

document.addEventListener("visibilitychange", () => {
  const hidden = document.visibilityState === "hidden";
  if (hidden) { time.setPaused(true); audioBus.setSuspended(true); }
  else if (!pointerLockEver || input.pointerLocked) { time.setPaused(false); audioBus.setSuspended(false); }
});

window.addEventListener("resize", () => {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function updateDebug(dt) {
  if (!debug.visible) return;
  debugState.fps = 1000 / Math.max(1, loop.frameMs);
  debugState.frameMs = loop.frameMs;
  debugState.drawCalls = renderer.info.render.calls;
  debugState.triangles = renderer.info.render.triangles;
  debugState.ai = spawner.activeCount;
  debugState.particles = particles.pool.activeCount;
  debugState.ragdolls = ragdolls.pool.activeCount;
  debugState.particlePool = `${particles.pool.activeCount}/${particles.pool.size}`;
  debugState.decalPool = `${decals.pool.activeCount}/${decals.pool.size}`;
  debugState.shellPool = `${shells.pool.activeCount}/${shells.pool.size}`;
  debugState.timeScale = time.scale;
  debugState.restartCount = restartCount;
  debugState.adsBlend = ads.blend;
  debugState.adsFloor = ads.multipliers.lookLag;
  debugState.bobFloor = ads.multipliers.bob;
  debugState.breathFloor = ads.multipliers.breath;
  debugState.sway = sway.getDebug();
  debugState.sway.poseX = weapon.finalPosition.x;
  debugState.sway.poseY = weapon.finalPosition.y;
  debugState.recoil = recoil.getDebug();
  debug.update(dt, debugState);
}

function update(dt, fixedDt) {
  if (input.pressed("Backquote")) debug.toggle();
  if (input.pressed("KeyT")) runAimAlignmentSelfTest(camera);
  if (dead) {
    if (input.pressed("Enter")) resetRun();
    hudState.health = health;
    hudState.ammo = fire.ammo;
    hudState.reserve = fire.reserve;
    hudState.wave = spawner.wave;
    hudState.speed = 0;
    hudState.firing = false;
    hudState.adsBlend = ads.blend;
    hudState.damageFlash = damageFlash;
    hud.update(dt, hudState);
    updateDebug(dt);
    input.endFixedStep();
    return;
  }
  const mouseDelta = input.consumeMouse();
  ads.update(dt, input.mouseHeld(2));
  cameraController.applyMouse(mouseDelta, ads.blend);
  player.update(dt, input, cameraController);
  if (reload.active && player.sprint.value > 0.64) reload.cancel();
  fire.raycastables.length = 0;
  fire.raycastables.push(...level.raycastables, ...props.raycastables);
  spawner.fillRaycastables(fire.raycastables);
  fireContext.adsBlend = ads.blend;
  fireContext.reloadActive = reload.active;
  fire.update(dt, input, fireContext);
  reload.update(dt);
  for (const event of reload.consumeEvents()) {
    weapon.triggerReloadEvent(event);
    if (event === "magRelease") reloadAudio.magRelease();
    if (event === "magEject") reloadAudio.magEject();
    if (event === "magInsert") reloadAudio.magInsert();
    if (event === "handleRack") reloadAudio.handleRack();
    if (event === "abort") reloadAudio.abort();
    if (event === "complete") fire.completeReload();
  }
  motion.update(dt, player, ads.blend);
  sway.update(dt, mouseDelta, ads.blend);
  recoil.update(dt);
  weapon.update(dt, { player, adsBlend: ads.blend });
  cameraController.update(dt, player, ads.blend, motion);
  updateTelemetry(window.__highriseState, player, ads, sway, motion, weapon, recoil, camera, input);
  player.health = health;
  enemyContext.reloadActive = reload.active;
  spawner.update(dt, enemyContext);
  ragdolls.update(dt);
  particles.update(dt);
  decals.update(dt);
  shells.update(dt);
  muzzle.update(dt);
  worldTime += dt;
  props.update(dt, worldTime);
  for (let tracerIndex = tracers.length - 1; tracerIndex >= 0; tracerIndex -= 1) {
    const tracer = tracers[tracerIndex];
    tracer.life -= dt;
    tracer.line.material.opacity = Math.max(0, tracer.life / 0.045) * 0.58;
    if (tracer.life <= 0) {
      tracer.line.geometry.dispose();
      tracer.line.material.dispose();
      scene.remove(tracer.line);
      tracers.splice(tracerIndex, 1);
    }
  }
  for (let debrisIndex = plateDebris.length - 1; debrisIndex >= 0; debrisIndex -= 1) {
    const debris = plateDebris[debrisIndex];
    debris.life -= dt;
    debris.velocity.y -= 10 * dt;
    debris.mesh.position.addScaledVector(debris.velocity, dt);
    debris.mesh.rotation.x += debris.spin.x * dt;
    debris.mesh.rotation.y += debris.spin.y * dt;
    debris.mesh.rotation.z += debris.spin.z * dt;
    if (debris.mesh.position.y < 0.02) { debris.mesh.position.y = 0.02; debris.velocity.y *= -0.26; debris.velocity.multiplyScalar(0.8); }
    if (debris.life <= 0) { debris.mesh.geometry.dispose(); debris.mesh.material.dispose(); scene.remove(debris.mesh); plateDebris.splice(debrisIndex, 1); }
  }
  damageFlash = Math.max(0, damageFlash - dt * 4.5);
  uiAudio.heartbeat(dt, health < 32);
  hudState.health = health;
  hudState.ammo = fire.ammo;
  hudState.reserve = fire.reserve;
  hudState.wave = spawner.wave;
  hudState.speed = player.speed;
  hudState.firing = input.mouseHeld(0);
  hudState.adsBlend = ads.blend;
  hudState.damageFlash = damageFlash;
  hud.update(dt, hudState);
  updateDebug(dt);
  input.endFixedStep();
}
function render(alpha) {
  cameraController.render(alpha);
  weapon.render(alpha);
  renderer.render(scene, camera);
}

const loop = new FixedLoop({ fixedHz: 120, update, render, time });
loop.start();
