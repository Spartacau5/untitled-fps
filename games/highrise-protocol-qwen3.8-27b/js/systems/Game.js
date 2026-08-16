import * as THREE from 'three';
import { CFG } from '../core/Config.js';
import { rng, SEED } from '../core/PRNG.js';
import { TimeManager } from '../core/TimeManager.js';
import { Renderer } from '../engine/Renderer.js';
import { Lighting } from '../engine/Lighting.js';
import { Environment } from '../engine/Environment.js';
import { Player } from '../player/Player.js';
import { Input } from '../player/Input.js';
import { WeaponViewmodel } from '../player/WeaponViewmodel.js';
import { Weapon } from '../player/Weapon.js';
import { EnemyManager } from '../enemies/EnemyManager.js';
import { EffectsManager } from '../effects/EffectsManager.js';
import { CameraShake } from '../effects/CameraShake.js';
import { AudioEngine } from '../audio/AudioEngine.js';
import { Music } from '../audio/Music.js';
import { HUD } from '../hud/HUD.js';
import { StartScreen } from '../hud/StartScreen.js';
import { DebugOverlay } from '../hud/DebugOverlay.js';
import { clamp, damp } from '../core/Easing.js';

export class Game {
  constructor() {
    this.state = 'start';      // start | playing | paused | dead
    this.renderer = new Renderer(document.getElementById('canvas-host'));
    this.scene = this.renderer.scene;
    this.camera = this.renderer.camera;

    this.audio = new AudioEngine();
    this.music = new Music(this.audio);
    this.time = new TimeManager();
    this.shake = new CameraShake();

    this.env = new Environment(this.scene);
    this.env.build();
    this.lighting = new Lighting(this.scene);
    // the viewmodel pass renders the gun with the vmCamera (layer 1) —
    // lights must be enabled on layer 1 or the gun renders unlit
    this.lighting.group.traverse((o) => { if (o.isLight) o.layers.enable(1); });

    this.input = new Input(this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();

    this.god = false;
    this.player = new Player(this.camera, this.input, this.god);
    this.vm = new WeaponViewmodel(this.scene, this.camera);
    this.fx = null; // created after hud
    this.hud = new HUD(document.getElementById('hud'));
    this.fx = new EffectsManager(this.scene, this.camera, this.hud);

    this.weapon = new Weapon({
      camera: this.camera, viewmodel: this.vm, audio: this.audio,
      env: this.env, raycaster: this.raycaster,
      hooks: {
        onMuzzle: (cam) => this.fx.muzzleFlash(cam, this.vm),
        onTracer: (f, t, h) => this.fx.tracer(f, t, h),
        onShell: (m, d) => this.fx.shellEject(m, d),
        onShot: (info) => this._onShot(info),
        onMag: (mag) => this.hud.punchAmmo(mag),
        // onReloadStart: mag-release sound now comes from the viewmodel beat
      },
    });
    this.enemyMgr = new EnemyManager(this.scene, this.env, this.raycaster);

    this.debug = new DebugOverlay();
    this.startScreen = new StartScreen((god, hudOn) => this.startMatch(god, hudOn));

    // game state
    this.wave = 0;
    this.combat = false;
    this.score = 0;
    this.kills = 0;
    this.shotsFired = 0;
    this.shotsHit = 0;
    this.headshots = 0;
    this.combo = 0;
    this.bestCombo = 0;
    this.lastKillT = 99;
    this.multikillT = 99;
    this.multikillCount = 0;
    this.overdrive = 0;          // remaining seconds
    this.overdriveCd = 0;
    this.breatherT = 0;
    this.hudOn = true;           // menu toggle: hide the whole HUD layer
    this.playerCampedT = 0;
    this.lastPlayerPos = new THREE.Vector3();
    this.elapsed = 0;

    this._wireFXCallbacks();
    this._wireInput();
    this._wireVisibility();
    this._bindLoop = this.loop.bind(this);
  }

  _wireFXCallbacks() {
    const fx = {
      playerVulnerable: false,
      playerCamped: false,
      damagePlayer: (dmg, dir) => this._onPlayerDamage(dmg, dir),
      enemyReport: (from, to) => this.audio.enemyShot(0.5),
      nearMiss: () => this.audio.nearMiss(),
      bloodPool: (p, n) => this.fx.bloodPool(p, n),
    };
    this._fxcb = fx;
  }

  _wireInput() {
    // K3: pointer lock + pause
    document.addEventListener('pointerlockchange', () => {
      const locked = document.pointerLockElement === this.renderer.domElement;
      if (locked) {
        if (this.state === 'paused') { this.state = 'playing'; this._hidePause(); this.audio.resume(); this.music && null; }
      } else {
        if (this.state === 'playing') { this.state = 'paused'; this._showPause(); this.audio.pause(); }
      }
    });
    this._pauseResume = () => {
      if (this.state === 'paused') this.input.requestLock();
    };
    document.getElementById('pause-screen').addEventListener('click', this._pauseResume);
    // backtick debug
    this._onKey = (e) => {
      if (e.code === 'Backquote') this.debug.toggle();
      if (e.code === 'KeyT' && this.state === 'playing') {
        // A4 self-test: solved ADS pose, sight anchor + dot must sit on
        // the exact frame center at FOV 75/65/55 (works w/o pointer lock)
        const res = this.weapon.runSelfTest();
        this._showSelfTest(res);
      }
    };
    window.addEventListener('keydown', this._onKey);
    // death restart
    document.getElementById('btn-restart').addEventListener('click', () => { this._restart(); });
  }

  _wireVisibility() {
    // P2: tab-visibility pauses simulation and audio cleanly.
    this._onVis = () => {
      if (document.hidden) {
        if (this.state === 'playing') { this.state = 'paused'; this._showPause(); this.audio.pause(); }
      }
    };
    document.addEventListener('visibilitychange', this._onVis);
  }

  _showPause() { document.getElementById('pause-screen').classList.remove('hidden'); }
  _hidePause() { document.getElementById('pause-screen').classList.add('hidden'); }

  _showSelfTest(res) {
    const el = document.getElementById('selftest');
    el.classList.remove('hidden');
    const tag = (c) => `<span class="${c.pass ? 'pass' : 'fail'}">${c.pass ? 'PASS' : 'FAIL'}</span>`;
    el.innerHTML = res.map(r =>
      `<div class="${r.pass ? 'pass' : 'fail'}">FOV ${r.fov} — ray ${tag(r.ray)} ${r.ray.detail} · ` +
      `sight ${tag(r.sight)} ${r.sight.detail} · clearance ${tag(r.clear)}${r.clear.detail ? ' — ' + r.clear.detail : ''}</div>`
    ).join('');
    clearTimeout(this._stT);
    this._stT = setTimeout(() => el.classList.add('hidden'), 8000);
  }

  startMatch(god, hudOn = true) {
    this.god = god;
    this.hudOn = hudOn;
    this.audio.init();               // K1: from user gesture
    this.player.god = god;
    this.hud.setGod(god);
    if (hudOn) this.hud.show(); else this.hud.hide();
    this.startScreen.hide();
    this.state = 'playing';
    this._resetMatch();
    this.input.requestLock();
    this.audio.startAmbient();   // W2: city hum + wind bed
    this.music.start();
    this._startWave(1);
  }

  _resetMatch() {
    this.wave = 0; this.combat = false; this.score = 0; this.kills = 0;
    this.shotsFired = 0; this.shotsHit = 0; this.headshots = 0;
    this.combo = 0; this.bestCombo = 0; this.lastKillT = 99; this.multikillT = 99; this.multikillCount = 0;
    this.overdrive = 0; this.overdriveCd = 0; this.breatherT = 0;
    this.player.start();
    this.weapon.reset();
    this.enemyMgr.reset();
    this.fx.clearAll();
    this.time.reset();
    this.shake.reset();
    this.hud.scoreTarget = 0; this.hud.scoreDisplay = 0;
    this.hud.hideCombo();
  }

  _restart() {
    document.getElementById('death-screen').classList.add('hidden');
    this.state = 'start';
    this._resetMatch();
    this.startScreen.show();
  }

  _startWave(n) {
    this.wave = n;
    this.combat = true;
    this.hud.setWave(n);
    this.hud.showWaveBanner(n, this.wave === 1 ? 'GET READY' : 'PUSH IN');
    this.audio.waveStartSting();
    this.enemyMgr.spawnWave(n);
    this.fx.clearWave();   // H6: clear blood between waves
    this.music.setBetweenWaves(false);
    this.breatherT = 0;
  }

  _onWaveCleared() {
    this.combat = false;
    // straight to the breather — no tally card, no kill-cam
    this.breatherT = CFG.waves.breakTime;
    this.music.setBetweenWaves(true);
  }

  // ---- Weapon shot hook ----
  _onShot(info) {
    this.shotsFired++;
    this.shake.micro();
    this.renderer.punchCA(0.006, 0.1);
    const hit = info.hit;
    if (hit && !hit.miss) {
      if (hit.isEnemy) {
        const enemy = hit.enemy;
        if (!enemy || !enemy.alive) return;   // already down
        const isHead = hit.part === 'head';
        const dmg = this.weapon.w.damage * hit.damageMul;
        this.shotsHit++;
        const result = enemy.damage(dmg, isHead, info.dir);
        if (!result) return;
        // H1: blood
        this.fx.bloodHit(hit.point, hit.normal, info.dir, isHead);
        // H2: feedback stack
        this.audio.hitTick(isHead);
        this.hud.hitMarker(result.killed, isHead);
        this.fx.damageNumber(hit.point, result.dmg, isHead);
        if (result.killed) {
          this._onKill(enemy, isHead);
          // H2: hit-stop on every kill
          this.time.triggerHitStop(0.1, 0.06);
          this.renderer.punchCA(0.012, 0.12);
        }
      } else {
        // world impact
        if (hit.type === 'glass' && hit.mesh) {
          this._shatterGlass(hit.mesh);
          this.env.destroyShootable(hit.mesh);
        } else if (hit.type === 'bucket' && hit.mesh) {
          this.fx.worldImpact(hit.point, hit.normal, 'bucket', hit.color);
          this.env.destroyShootable(hit.mesh);
          hit.mesh.visible = false;
        } else {
          // E3: drywall/sheet are shoot-through (penetration handled by weapon);
          // only spawn the puff here, never destroy.
          this.fx.worldImpact(hit.point, hit.normal, hit.type, hit.color);
        }
      }
    }
  }

  _shatterGlass(mesh) {
    // F5: glass panes shatter into physical shards
    const p = new THREE.Vector3();
    mesh.getWorldPosition(p);
    const n = new THREE.Vector3(0, 0, 1).applyQuaternion(mesh.quaternion);
    this.fx.worldImpact(p, n, 'glass', null);
    mesh.visible = false;
  }

  _onKill(enemy, isHead) {
    this.kills++;
    if (isHead) this.headshots++;
    const base = enemy.stat.score;
    const bonus = isHead ? 50 : 0;
    const pts = base + bonus;
    this.score += pts;
    this.hud.addScore(pts);
    this.audio.killThock();
    this.hud.killFeed(enemy.type.toUpperCase() + (isHead ? ' (HEADSHOT)' : ''), isHead, pts);
    this.fx.damageNumber(enemy.pos.clone().setY(1.6), pts, isHead);

    // D2: combo
    this.lastKillT = 0;
    if (this.combo > 0) this.combo++; else this.combo = 1;
    this.bestCombo = Math.max(this.bestCombo, this.combo);
    if (this.combo >= 2) this.hud.showCombo(this.combo);

    // D2: OVERDRIVE at 5-chain
    if (this.combo >= CFG.action.overdriveChain && this.overdriveCd <= 0 && this.overdrive <= 0) {
      this._triggerOverdrive();
    }

    // D3: multikill
    this.multikillCount++;
    this.multikillT = 0;
    const names = { 2: 'DOUBLE KILL', 3: 'TRIPLE KILL', 4: 'QUAD KILL', 5: 'RAMPAGE' };
    const key = Math.min(5, this.multikillCount);
    if (key >= 2) { this.hud.showMultikill(names[key]); this.audio.multikillSting(); }
  }

  _triggerOverdrive() {
    this.overdrive = CFG.action.overdriveTime;
    this.overdriveCd = CFG.action.overdriveTime + CFG.action.overdriveCooldown;
    this.time.setOverdrive(true);
    this.weapon.overdrive = true;
    this.fx.overdrive(true);
    this.audio.overdriveSting();
  }
  _endOverdrive() {
    this.time.setOverdrive(false);
    this.weapon.overdrive = false;
    this.fx.overdrive(false);
  }

  // ---- Player damage ----
  _onPlayerDamage(dmg, dir) {
    const d = this.player.takeDamage(dmg, dir);
    if (d > 0) {
      // F6: strong directional shake
      this.shake.damage(dir);
      this.renderer.punchCA(0.01, 0.15);
      this.audio.damageThump();
      // U2: damage direction indicator
      const ang = Math.atan2(dir.x, dir.z);
      this.hud.damageDirection(ang);
      this.hud.hitVignetteFlash();
      // F6: FOV-kick on getting hit
      this._dmgFlash = 0.6;
      this.player.fovSpring.addImpulse(5);
      if (this.player.hp <= 0) this._onDeath();
    }
  }

  _onDeath() {
    if (this.god) return;
    this.state = 'dead';
    this.input.exitLock();
    this.audio.pause();
    this.hud.hide();
    const acc = this.shotsFired > 0 ? Math.round((this.shotsHit / this.shotsFired) * 100) : 0;
    document.getElementById('death-stats').innerHTML =
      `<div>Wave reached: <b>${this.wave}</b></div><div>Score: <b>${this.score}</b></div><div>Accuracy: <b>${acc}%</b></div><div>Kills: <b>${this.kills}</b></div>`;
    document.getElementById('death-screen').classList.remove('hidden');
  }

  // ---- Main loop ----
  loop() {
    requestAnimationFrame(this._bindLoop);
    const now = performance.now();
    if (this._lastT === undefined) this._lastT = now;
    let rawDt = (now - this._lastT) / 1000;
    this._lastT = now;
    if (rawDt > 0.05) rawDt = 0.05;   // K4: clamp delta
    if (rawDt <= 0) rawDt = 0.016;

    this.debug.frame(rawDt);

    if (this.state === 'playing') {
      // K4: one time manager resolves the scale
      const scale = this.time.update(rawDt);
      const dt = this.time.scaled(rawDt);
      this._updatePlaying(dt, rawDt);
    } else {
      // idle: still animate lighting & environment subtly on menus
      this.elapsed += rawDt;
      this.lighting.update(rawDt, this.elapsed);
      this.env.update(this.elapsed, rawDt);
      this.env.updateSheets(this.elapsed);
    }

    // render
    this.renderer.update(rawDt);
    this.renderer.gradeFrame({
      time: this.elapsed,
      damage: this._dmgFlash,
      overdrive: this.overdrive > 0 ? clamp(this.overdrive / CFG.action.overdriveTime, 0, 1) : 0,
      motion: this._turnSpeed,
      heat: this.weapon ? this.weapon.heat : 0,   // F4: barrel heat shimmer
    });
    this._dmgFlash = Math.max(0, (this._dmgFlash || 0) - rawDt * 3);
    this.renderer.render();

    // debug
    this.debug.set(this._debugData());
  }

  _updatePlaying(dt, rawDt) {
    this.elapsed += dt;

    // ---- player ----
    this.player.update(rawDt, dt, this.env);
    // camped detection (E2)
    const moved = this.player.pos.distanceTo(this.lastPlayerPos);
    if (moved < 0.05) this.playerCampedT += dt; else this.playerCampedT = 0;
    this.lastPlayerPos.copy(this.player.pos);
    this._fxcb.playerCamped = this.playerCampedT > 5;
    this._fxcb.playerVulnerable = this.weapon.reloading || this.player.hp < 30;

    // turn speed for motion blur (G3)
    const md = this.input.readMouse; // consumed in player already; use yaw delta approx
    this._turnSpeed = clamp(Math.abs(this.player.vel.x) * 0.02 + Math.abs(this.player.vel.z) * 0.02, 0, 1);

    // ---- weapon ----
    this.weapon.update(rawDt, dt, this.player);

    // ---- enemies ----
    this.enemyMgr.enemies = this.enemyMgr.active.concat(this.enemyMgr.ragdolls);
    this.weapon.enemies = this.enemyMgr.active;
    this.enemyMgr.update(dt, this.player, this._fxcb);

    // ---- fx ----
    this.fx.update(dt);
    // shell tinkle
    this.fx.consumeShellBounces(() => this.audio.shellTinkle());

    // ---- environment / lighting ----
    const gust = 1 + Math.sin(this.elapsed * 0.5) * 0.4;
    this.env.update(this.elapsed, dt);        // fans, beacons, clouds, plane
    this.env.updateSheets(this.elapsed, gust);
    this.env.updatePapers(this.elapsed, dt);   // W2
    this.lighting.update(dt, this.elapsed);

    // ---- shake applied to camera ----
    this.shake.update(rawDt);
    this.camera.position.add(this.shake.offset);
    this.camera.rotation.x += this.shake.rot.x;
    this.camera.rotation.y += this.shake.rot.y;
    this.camera.rotation.z += this.shake.rot.z;

    // ---- audio ----
    this.audio.setLowHp(this.player.lowHp);
    this.audio.update(rawDt);
    this.music.update(rawDt);

    // ---- combo / overdrive timers ----
    this.lastKillT += dt;
    if (this.lastKillT > CFG.action.comboWindow) {
      if (this.combo > 0 && this.combo < CFG.action.overdriveChain) this.hud.hideCombo();
      this.combo = 0;
    }
    this.multikillT += dt;
    if (this.multikillT > 1.5) this.multikillCount = 0;
    if (this.overdriveCd > 0) this.overdriveCd -= dt;
    if (this.overdrive > 0) {
      this.overdrive -= dt;
      this.hud.setOverdriveFill(1 - this.overdrive / CFG.action.overdriveTime);
      if (this.overdrive <= 0) { this._endOverdrive(); this.hud.hideCombo(); }
    }

    // ---- wave logic ----
    this._updateWave(dt);

    // ---- HUD ----
    const spread = this.weapon.currentSpread();
    const gap = 8 + spread * 900;
    this.hud.updateCrosshair(gap, 1 - Math.min(1, this.player.adsLevel) * 0.9);
    this.hud.setHp(this.player.hp, CFG.player.maxHp, this.god);
    this.hud.setEnemies(this.enemyMgr.activeCount);
    this.hud.update(rawDt);
    this.hud.updateLowHp(rawDt, this.player.hp);
    this.audio.setLowHp(this.player.lowHp);
    // U3: contextual mantle prompt
    if (this.player.canMantle(this.env)) this.hud.showPrompt('[SPACE] MANTLE');
    else this.hud.hidePrompt();

    // damage flash for grade
    if (this._dmgFlash < 0.5 && this.player.hp < 30) this._dmgFlash = Math.max(this._dmgFlash, 0.2);
  }

  _updateWave(dt) {
    if (this.combat) {
      const active = this.enemyMgr.activeCount;
      if (active === 0) {
        this._onWaveCleared();
      }
    } else {
      // breather
      this.breatherT -= dt;
      if (this.breatherT <= 0) {
        this._startWave(this.wave + 1);
      }
    }
  }

  _debugData() {
    return {
      drawCalls: this.renderer.drawCalls,
      particles: this.fx.stats().particles,
      shells: this.fx.stats().shells,
      decals: this.fx.stats().decals,
      ragdolls: this.enemyMgr.ragdolls.length,
      ai: this.enemyMgr.active.length,
      tracers: 0,
      poolUtil: Math.round((this.fx.stats().particles / CFG.perf.maxBlood) * 100) + '%',
      timeScale: this.time.timeScale.toFixed(2),
      fov: this.camera.fov.toFixed(0),
      quality: CFG.quality.low ? 'low' : 'high',
    };
  }

  // K6: full teardown for restart (no leaks across restarts).
  dispose() {
    window.removeEventListener('keydown', this._onKey);
    document.removeEventListener('visibilitychange', this._onVis);
    this.input.dispose();
    this.startScreen.dispose();
    this.fx.dispose();
    this.enemyMgr.reset();
    this.env.dispose();
    this.lighting.dispose();
    this.renderer.dispose();
    this.audio.dispose();
  }
}
