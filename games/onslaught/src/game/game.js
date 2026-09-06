import {
  BoxGeometry,
  Color,
  DirectionalLight,
  Euler,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  NoToneMapping,
  PCFSoftShadowMap,
  PMREMGenerator,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Quaternion,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Audio } from "../audio/audio.js";
import { Input } from "../core/input.js";
import { FixedLoop } from "../core/loop.js";
import { UP, damp, rand } from "../core/mathx.js";
import { parseSeed } from "../core/rng.js";
import { Progression } from "../core/progression.js";
import { Settings } from "../core/settings.js";
import { captureRun } from "../core/run-record.js";
import { RunLog } from "../core/runlog.js";
import { SUN_DIR } from "../data/tuning.js";
import { theme } from "../theme/theme.js";
import { ArenaView } from "../render/arena-view.js";
import { EnemyView } from "../render/enemy-view.js";
import { Decals } from "../render/fx/decals.js";
import { ParticleSystem } from "../render/fx/particles.js";
import { Shells } from "../render/fx/shells.js";
import { Tracers } from "../render/fx/tracers.js";
import { PostFX } from "../render/postfx.js";
import { createSky } from "../render/sky.js";
import { WeaponView } from "../render/weapon-view.js";
import * as EV from "../sim/events.js";
import { World } from "../sim/world.js";
import { HUD } from "../ui/hud.js";
import { mountFeedback } from "../ui/feedback.js";
import { mountArmory } from "../ui/armory.js";
import { mountControls } from "../ui/controls.js";
import { mountSettingsPanel } from "../ui/settings-panel.js";
import { Telemetry } from "../ui/telemetry.js";
import {
  applyAssignedCallsign,
  fetchBoard,
  loadPlayerName,
  markPlayed,
  renderBoard,
  savePlayerName,
  submitRun as postRun,
} from "../ui/leaderboard.js";

// Graphics tiers, indexed by the `quality` setting. Render scale is capped
// rather than fixed, so a 1x display never renders above its own resolution.
const QUALITY_TIERS = [
  { pixelRatio: 1, samples: 0, shadow: 1024, enemyShadows: !1 },
  { pixelRatio: 1.25, samples: 2, shadow: 2048, enemyShadows: !0 },
  { pixelRatio: 1.5, samples: 4, shadow: 2048, enemyShadows: !0 },
];

// Presentation shell: owns the renderer, cameras, views, FX, audio and HUD.
// All gameplay lives in sim/world.js; this class feeds it input frames and
// turns its events and state into pixels and sound.
export class Game {
  constructor(t) {
    this.canvas = t;
    const e = new URLSearchParams(location.search);
    ((this.debug = e.has("debug")), (this.god = e.has("god")));
    // Mutable copy so the debug panel can tune the grade live.
    this.grade = { ...theme.grade };
    this.seed = parseSeed(location.search);
    this.progression = new Progression();
    this.world = new World({
      seed: this.seed,
      god: this.god,
      noSpawn: e.has("nospawn"),
      loadout: this.progression.loadout,
      startKey: this.progression.start,
    });
    const n = new WebGLRenderer({
      canvas: t,
      antialias: !1,
      powerPreference: "high-performance",
      stencil: !1,
      alpha: !1,
    });
    (n.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)),
      n.setSize(window.innerWidth, window.innerHeight, !1),
      (n.toneMapping = NoToneMapping),
      (n.shadowMap.enabled = !0),
      (n.shadowMap.type = PCFSoftShadowMap),
      (n.autoClear = !1),
      n.setClearColor(0, 1),
      (this.renderer = n),
      (this.scene = new Scene()),
      (this.weaponScene = new Scene()));
    const s = window.innerWidth / window.innerHeight;
    ((this.camera = new PerspectiveCamera(80, s, 0.08, 1200)),
      (this.weaponCamera = new PerspectiveCamera(56, s, 0.012, 8)),
      this.scene.add(this.camera),
      this.weaponScene.add(this.weaponCamera),
      (this.input = new Input(t)),
      (this.audio = new Audio()),
      // Build the audio graph at load, not on the DEPLOY click. A context may
      // be constructed without a gesture - it just starts suspended - and
      // constructing one costs tens of milliseconds. Only resume() needs the
      // gesture, and that is free.
      this.audio.init(),
      this.debug && ((this.audio.musicOn = !1), (this.audio.ambienceOn = !1)),
      (this.hud = new HUD()),
      (this.arenaView = new ArenaView(this.scene, this.world.arena)),
      (this.sky = createSky(SUN_DIR)),
      this.scene.add(this.sky.mesh),
      (this.particles = new ParticleSystem(this.scene)),
      (this.tracers = new Tracers(this.scene)),
      (this.decals = new Decals(this.scene)),
      (this.shells = new Shells(this.scene)),
      (this.shells.onBounce = (l) => {
        const o = this.audio.spatial([l.x, l.y, l.z], 3, 14);
        o.gain > 0.05 && this.audio.click(0.3 * o.gain, 4200);
      }),
      (this.enemyView = new EnemyView(this.scene)),
      (this.weaponView = new WeaponView(
        this.weaponCamera,
        this.progression.loadout,
        this.world.weapons.startIndex,
      )),
      (this.pickupMeshes = new Map()),
      (this.postfx = new PostFX(n)));
    const r = new DirectionalLight(
      theme.lights.weaponKey.color,
      theme.lights.weaponKey.intensity,
    );
    // Keep the weapon key in camera space so turning toward a dark facade
    // does not lose the receiver, sight and human-hand silhouettes.
    r.position.set(-2, 3, 2);
    r.target.position.set(0, -0.2, -1);
    // Self-shadowing on the viewmodel. Without it the hands, magwell and
    // trigger guard have no contact darkening and the gun reads as one flat
    // object. A tight frustum is enough: the subject is under a metre across
    // and sits a fixed distance from the camera.
    r.castShadow = true;
    r.shadow.mapSize.width = r.shadow.mapSize.height = 1024;
    Object.assign(r.shadow.camera, {
      left: -0.7,
      right: 0.7,
      top: 0.7,
      bottom: -0.7,
      near: 0.05,
      far: 6,
    });
    r.shadow.bias = -0.0012;
    r.shadow.normalBias = 0.006;
    r.shadow.camera.updateProjectionMatrix();
    this.weaponCamera.add(r, r.target);
    this.weaponScene.add(
      new HemisphereLight(
        theme.lights.weaponHemi.sky,
        theme.lights.weaponHemi.ground,
        theme.lights.weaponHemi.intensity,
      ),
    );
    const a = new PointLight(
      theme.lights.weaponFill.color,
      theme.lights.weaponFill.intensity,
      4,
      2,
    );
    (a.position.set(-0.6, -0.3, -0.6),
      this.weaponCamera.add(a),
      (this.muzzleLight = new PointLight(16752704, 0, 20, 2)),
      this.scene.add(this.muzzleLight),
      (this.impactLight = new PointLight(16760960, 0, 9, 2)),
      this.scene.add(this.impactLight),
      this._setupEnvironment(),
      this._buildPickupProto(),
      (this.state = "menu"),
      (this.time = 0),
      (this.last = performance.now()),
      (this.timeScale = 1),
      (this.slowmo = 0),
      (this.hurtFx = 0),
      (this.lastHitSound = -1),
      (this.fps = 60),
      (this.fixed = new FixedLoop({ tick: 1 / 60, maxSteps: 5 })),
      (this._v = new Vector3()),
      (this._v2 = new Vector3()),
      (this._q = new Quaternion()),
      (this._e = new Euler()),
      this._bindSettings(),
      (this.settingsPanel = mountSettingsPanel(this.settings, {
        panel: this.hud.el.settings,
        rows: this.hud.el.settingsRows,
        btnOpen: this.hud.el.btnSettings,
        btnBack: this.hud.el.settingsBack,
        btnReset: this.hud.el.settingsReset,
        menuMain: this.hud.el.menuMain,
        note: this.hud.el.settingsNote,
      })),
      // Raw-input support is only known once the pointer actually locks, so
      // the panel is told when that resolves rather than being asked up front.
      (this.input.onRawInput = (raw) =>
        this.settingsPanel && this.settingsPanel.setRawInput(raw)),
      (this.armoryPanel = mountArmory(
        this.progression,
        {
          panel: this.hud.el.armoryPanel,
          body: this.hud.el.armoryBody,
          btnOpen: this.hud.el.btnArmory,
          btnBack: this.hud.el.armoryBack,
          menuMain: this.hud.el.menuMain,
        },
        (loadout, startKey) => this._applyLoadout(loadout, startKey),
      )),
      (this.controlsPanel = mountControls({
        panel: this.hud.el.controlsPanel,
        body: this.hud.el.controlsBody,
        btnOpen: this.hud.el.btnControls,
        btnBack: this.hud.el.controlsBack,
        summary: this.hud.el.controlsSummary,
        menuMain: this.hud.el.menuMain,
      })),
      (this.runLog = new RunLog()),
      (this.telemetry = new Telemetry()),
      (this.lastRun = null),
      (this.runStartedAt = null),
      (this._runPosted = !1),
      (this.runId = ""),
      this.hud.el.playerName &&
        (this.hud.el.playerName.value = loadPlayerName()),
      // Build the guns the player did not deploy with once the page is idle:
      // off the load path, but done well before anyone presses a number key.
      this._warmViewmodels(),
      this.hud.setContest(Date.now()),
      this.hud.setSlots(this.world.weapons.weapons.length),
      this._renderLoadoutStrip(),
      this._refreshBoard(),
      this.hud.el.btnStart.addEventListener("click", () => this.start()),
      this.hud.el.btnRestart &&
        this.hud.el.btnRestart.addEventListener("click", () =>
          this.restartFromPause(),
        ),
      this.hud.el.btnExitMenu &&
        this.hud.el.btnExitMenu.addEventListener("click", () =>
          this.exitToMenu(),
        ),
      (() => {
        const download = (name, data) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(
            new Blob([JSON.stringify(data, null, 2)], {
              type: "application/json",
            }),
          );
          a.download = name;
          a.click();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        };
        const stamp = () =>
          new Date().toISOString().replace(/[-:]/g, "").slice(0, 13);
        this.hud.el.btnDlRun.addEventListener(
          "click",
          () =>
            this.lastRun &&
            download(`run-${this.seed}-${stamp()}.json`, this.lastRun),
        );
        this.hud.el.btnDlAll.addEventListener("click", () =>
          download(`runs-${stamp()}.json`, this.runLog.list()),
        );
      })(),
      mountFeedback(() =>
        this.hud.el.playerName ? this.hud.el.playerName.value : "",
      ),
      (this.input.onLockChange = (l) => {
        !l && this.state === "playing" && !this.debug && this.pause();
      }),
      (this.input.onKeyDown = (l) => this.onKey(l)),
      window.addEventListener("resize", () => this.resize()),
      document.addEventListener("visibilitychange", () => {
        this.last = performance.now();
        if (document.visibilityState === "hidden") this._flushRun();
      }),
      window.addEventListener("pagehide", () => {
        (this._flushRun(),
          this.telemetry.end(this.state, this.world ? this.world.wave : 0));
      }),
      (window.game = this),
      this.syncWeapon(),
      this.debug &&
        setTimeout(() => {
          (this.start(), (this.input.locked = !0));
        }, 300),
      (this._raf = (l) => {
        (requestAnimationFrame(this._raf), this.loop(l));
      }),
      requestAnimationFrame(this._raf));
  }
  // Persisted preferences. Every consumer is presentation-side; FOV and shake
  // are read each frame in presentGame, the rest are pushed on change.
  _bindSettings() {
    this.settings = new Settings();
    this.camFov = this.settings.get("fov");
    const apply = (k, v) => {
      (k === "sensitivity" && (this.input.sensitivity = v),
        k === "quality" && this._applyQuality(v),
        (k === "master" || k === "music" || k === "sfx") &&
          this.audio.setVolumes({ [k]: v }));
    };
    for (const k in this.settings.all()) apply(k, this.settings.get(k));
    this.settings.onChange(apply);
  }
  // Three levers, in the order they cost frames: how many pixels are shaded,
  // how many samples each one takes, and how big the sun's shadow map is.
  // Everything else about the look is unchanged, so dropping quality trades
  // sharpness for framerate rather than turning the art off.
  _applyQuality(level) {
    const tier = QUALITY_TIERS[Math.round(level)] || QUALITY_TIERS[2];
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, tier.pixelRatio),
    );
    this.postfx && this.postfx.setSamples(tier.samples);
    this.enemyView && this.enemyView.setShadows(tier.enemyShadows);
    const sun = this.arenaView && this.arenaView.sun;
    if (sun && sun.shadow.mapSize.width !== tier.shadow) {
      (sun.shadow.mapSize.setScalar(tier.shadow),
        sun.shadow.map && (sun.shadow.map.dispose(), (sun.shadow.map = null)));
    }
    // setPixelRatio alone does not resize the drawing buffer.
    this.resize();
  }
  _playerName() {
    const typed = this.hud.el.playerName && this.hud.el.playerName.value;
    return savePlayerName(typed || loadPlayerName() || "OPERATOR");
  }
  _refreshBoard() {
    fetchBoard()
      .then((data) => this._applyBoard(data))
      .catch(() =>
        renderBoard(
          this.hud.el.leaderboard,
          { entries: [], visitors: 0, players: 0 },
          this._playerName(),
        ),
      );
  }
  // The prize clock only needs to be legible, not smooth: half a second is
  // well inside the smallest unit it ever shows.
  _tickContest(dt) {
    this._contestT = (this._contestT || 0) - dt;
    if (this._contestT > 0) return;
    ((this._contestT = 0.5), this.hud.setContest(Date.now()));
  }
  _applyBoard(data) {
    applyAssignedCallsign(this.hud.el.playerName, data.callsign);
    renderBoard(this.hud.el.leaderboard, data, this._playerName());
  }
  _markPlayed() {
    markPlayed()
      .then((data) => this._applyBoard(data))
      .catch(() => {});
  }
  _newRunId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${this.seed}-${Date.now()}`;
  }
  _flushRun() {
    if (this.state === "menu" || !this.runId) return;
    this._submitRun({ keepalive: true });
    if (this._abandonSent) return;
    this._abandonSent = true;
    this.telemetry.run(
      captureRun({
        world: this.world,
        seed: this.seed,
        startedAt: this.runStartedAt,
        endedAt: new Date().toISOString(),
        settings: this.settings.all(),
        result: "abandoned",
      }),
      this.runId,
      true,
    );
  }
  async _submitRun(opts = {}) {
    if (!this.runId || this.state === "menu") return;
    if (this._runPosted && !opts.keepalive) return;
    const w = this.world;
    const entry = {
      name: this._playerName(),
      score: w.score,
      kills: w.kills,
      wave: w.wave,
      elapsed: w.elapsed,
      seed: this.seed,
      runId: this.runId,
    };
    if (opts.keepalive) {
      postRun(entry, { keepalive: true }).catch(() => {});
      return;
    }
    if (opts.final) this._runPosted = true;
    try {
      const data = await postRun(entry);
      this._applyBoard(data);
    } catch {
      if (opts.final) this._runPosted = false;
      this._refreshBoard();
    }
  }
  async _endLiveRun(result) {
    if (!this.runId) return;
    this.lastRun = captureRun({
      world: this.world,
      seed: this.seed,
      startedAt: this.runStartedAt,
      endedAt: new Date().toISOString(),
      settings: this.settings.all(),
      result,
    });
    this.runLog.append(this.lastRun);
    this.telemetry.run(this.lastRun, this.runId);
    // Bank the XP before the board round-trip, so a failed POST cannot cost
    // the player their progress.
    this.lastXp = this.progression.addRun(this.lastRun.summary);
    (this.armoryPanel && this.armoryPanel.render(), this._renderLoadoutStrip());
    this.lastXp.levelsGained > 0 &&
      this.hud.hint(`LEVEL ${this.lastXp.level} REACHED`, !1, 3);
    await this._submitRun({ final: true });
    this.runId = "";
  }
  // Compatibility accessors for the debug panel and console poking.
  get player() {
    return this.world.player;
  }
  get weapons() {
    return this.world.weapons;
  }
  get enemies() {
    return this.world.enemies;
  }
  get arena() {
    return this.world.arena;
  }
  _setupEnvironment() {
    // Capture the district itself once so steel and glass reflect buildings,
    // billboard colors and the sky instead of the original orange arena ring.
    const generator = new PMREMGenerator(this.renderer);
    // fromScene captures from the world origin, which here is a point on the
    // ground plane and inside the granite plinth: the lower half of the
    // capture was the underside of the floor, so every metal surface in the
    // game reflected a dark hemisphere. Drop the scene to put the capture at
    // roughly eye height instead.
    const CAPTURE_Y = 3.2;
    this.scene.position.y = -CAPTURE_Y;
    this.scene.updateMatrixWorld(true);
    const environment = generator.fromScene(this.scene, 0.06, 0.1, 1200);
    this.scene.position.y = 0;
    this.scene.updateMatrixWorld(true);
    this.scene.environment = environment.texture;
    // The city capture is intentionally dark between the tall buildings.
    // A separate neutral reflection rig keeps high-metalness weapon surfaces
    // readable without brightening or flattening the entire world.
    const weaponRoom = new RoomEnvironment();
    const weaponEnvironment = generator.fromScene(weaponRoom, 0.08);
    this.weaponScene.environment = weaponEnvironment.texture;
    weaponRoom.dispose();
    this.scene.environmentIntensity = theme.lights.envIntensity.world;
    this.weaponScene.environmentIntensity = theme.lights.envIntensity.weapon;
    generator.dispose();
  }
  _buildPickupProto() {
    const mats = this.arenaView.mats,
      t = new Group(),
      e = new Mesh(new BoxGeometry(0.55, 0.36, 0.38), mats.crate);
    ((e.castShadow = !0), t.add(e));
    for (const s of [-0.16, 0.16]) {
      const r = new Mesh(new BoxGeometry(0.06, 0.37, 0.39), mats.emCyan);
      ((r.position.x = s), t.add(r));
    }
    const n = new Mesh(new BoxGeometry(0.3, 0.02, 0.2), mats.emWhite);
    ((n.position.y = 0.19), t.add(n), (this.pickupProto = t));
  }
  // The armory changed what the player carries. The sim rebuilds its weapon
  // states and the viewmodel rebuilds its rig; both are safe between runs
  // because startRun() re-forks the combat RNG stream.
  _applyLoadout(loadout, startKey) {
    (this.world.setLoadout(loadout, startKey),
      this.weaponView.setLoadout(loadout, this.world.weapons.startIndex),
      this.weaponView.reset(),
      this.world.weapons._ammo(this.world),
      this.world.drainEvents(),
      this.hud.setSlots(this.world.weapons.weapons.length),
      this._renderLoadoutStrip());
  }
  // Deferred so it never lands inside the first frames. requestIdleCallback
  // is not in every browser, so fall back to a timeout.
  _warmViewmodels() {
    const warm = () => this.weaponView.warm();
    typeof requestIdleCallback === "function"
      ? requestIdleCallback(warm, { timeout: 4000 })
      : setTimeout(warm, 1200);
  }
  _renderLoadoutStrip() {
    const el = this.hud.el.loadoutStrip;
    if (!el) return;
    // Too many guns to name them all on the deploy screen: show which one you
    // start on, and how many keys are live.
    const l = this.world.weapons.loadout,
      start = l[this.world.weapons.startIndex];
    el.innerHTML =
      `<span><b>${this.world.weapons.startIndex + 1}</b> ${start.name}</span>` +
      `<span class="loadout-sep">·</span>` +
      `<span>KEYS <b>1&ndash;${l.length}</b> CARRIED</span>`;
  }
  start() {
    this.settingsPanel && this.settingsPanel.close();
    this.armoryPanel && this.armoryPanel.close();
    this.controlsPanel && this.controlsPanel.close();
    this.hud.setPauseActions(false);
    if ((this.audio.init(), this.audio.resume(), this.state === "paused")) {
      ((this.state = "playing"),
        this.hud.showMenu(!1),
        this.debug || this.input.lock(),
        (this.last = performance.now()));
      return;
    }
    (this.audio.beginSession(),
      this.resetGame(),
      (this._runPosted = !1),
      (this.runStartedAt = new Date().toISOString()),
      (this.runId = this._newRunId()),
      (this._abandonSent = !1),
      this._playerName(),
      (this.state = "playing"),
      this.hud.showMenu(!1),
      this.hud.show(!0),
      this.debug || this.input.lock(),
      (this.last = performance.now()),
      this.hud.banner(...theme.strings.deployingBanner, 2.5),
      (this.audio.intensity = 1),
      this._markPlayed());
  }
  pause() {
    const w = this.world;
    ((this.state = "paused"),
      this.hud.showMenu(
        !0,
        "PAUSED",
        "RESUME",
        null,
        `WAVE ${w.wave} · SCORE ${w.score.toLocaleString("en-US")}`,
      ),
      this.hud.setPauseActions(true),
      this._submitRun());
  }
  async restartFromPause() {
    if (this.state !== "paused") return;
    await this._endLiveRun("quit");
    this.state = "menu";
    this.audio.endSession();
    this.hud.setPauseActions(false);
    this.start();
  }
  async exitToMenu() {
    if (this.state !== "paused") return;
    await this._endLiveRun("quit");
    this.state = "menu";
    this.audio.endSession();
    this.world.endRun();
    this.input.unlock();
    this.hud.setPauseActions(false);
    this.hud.showMenu(!0);
    this.hud.show(!1);
  }
  resetGame() {
    (this.world.startRun(),
      this.weaponView.reset(),
      this._syncPickups(),
      (this.slowmo = 0),
      (this.timeScale = 1),
      (this.postfx.u.uDesat.value = 0),
      this.handleEvents(this.world.drainEvents()),
      this.syncWeapon());
  }
  onDeath() {
    ((this.state = "dead"),
      this.audio.gameOver(),
      (this.audio.intensity = 0),
      this.hud.banner("K.I.A.", "THE SWARM OVERRAN THE ARENA", 6, !0),
      this._endLiveRun("dead"));
  }
  onKey(t) {
    if (t === "Escape" && this.settingsPanel && this.settingsPanel.isOpen()) {
      this.settingsPanel.close();
      return;
    }
    if (t === "Escape" && this.controlsPanel && this.controlsPanel.isOpen()) {
      this.controlsPanel.close();
      return;
    }
    if (t === "Escape" && this.armoryPanel && this.armoryPanel.isOpen()) {
      this.armoryPanel.close();
      return;
    }
    // H opens how-to-play from the menu or pause. Mid-run it would need a
    // pause first, so it is ignored while the pointer is locked.
    if (t === "KeyH" && this.controlsPanel && this.state !== "playing") {
      (this.settingsPanel && this.settingsPanel.close(),
        this.armoryPanel && this.armoryPanel.close(),
        this.controlsPanel.toggle());
      return;
    }
    (t === "KeyM" &&
      ((this.audio.musicOn = !this.audio.musicOn),
      this.hud.hint(this.audio.musicOn ? "MUSIC ON" : "MUSIC OFF")),
      t === "KeyN" &&
        ((this.audio.ambienceOn = !this.audio.ambienceOn),
        this.audio.setVolumes({}),
        this.hud.hint(this.audio.ambienceOn ? "AMBIENT ON" : "AMBIENT OFF")),
      (t === "BracketLeft" || t === "BracketRight") &&
        (this.settings.set(
          "sensitivity",
          this.settings.get("sensitivity") + (t === "BracketLeft" ? -0.1 : 0.1),
        ),
        this.hud.hint(
          "SENSITIVITY " + this.settings.get("sensitivity").toFixed(1),
        )),
      t === "Escape" && this.debug && this.state === "playing" && this.pause());
  }
  resize() {
    const t = window.innerWidth,
      e = window.innerHeight;
    (this.renderer.setSize(t, e, !1),
      (this.camera.aspect = t / e),
      this.camera.updateProjectionMatrix(),
      (this.weaponCamera.aspect = t / e),
      this.weaponCamera.updateProjectionMatrix());
    const n = this.renderer.getDrawingBufferSize(new Vector2());
    this.postfx.setSize(n.x, n.y);
  }
  syncWeapon() {
    const t = this.world.weapons.weapon;
    (this.hud.setWeapon(t.def.name, t.def.mode, this.world.weapons.current),
      this.hud.setAmmo(t.mag, t.reserve, t.def.magSize));
  }
  project(t, e, n) {
    const s = this._v.set(t, e, n).project(this.camera);
    return s.z > 1
      ? null
      : {
          x: (s.x * 0.5 + 0.5) * window.innerWidth,
          y: (-s.y * 0.5 + 0.5) * window.innerHeight,
        };
  }
  // ---- sim events → audio / FX / HUD ----------------------------------------
  handleEvents(list) {
    for (const ev of list) this.handleEvent(ev);
  }
  handleEvent(h) {
    const w = this.world,
      n = w.player,
      c = this.time,
      A = this.audio,
      H = this.hud;
    switch (h.type) {
      // player
      case EV.EV_JUMP:
        (A.jump(), this.weaponView.onEvent(h, w.weapons));
        break;
      case EV.EV_LAND:
        (A.land(h.strength), this.weaponView.onEvent(h, w.weapons));
        break;
      case EV.EV_STEP:
        A.footstep(h.sprint ? 1.25 : 0.85);
        break;
      case EV.EV_SLIDE:
        A.slide();
        break;
      case EV.EV_HURT: {
        (H.damageFrom(h.angle), A.playerHurt(h.amount), (this.hurtFx = 1));
        // A melee blow needs to land, not just tick the health bar down: the
        // camera takes a kick, the viewmodel is shoved with it, and sparks
        // come off the point of contact.
        //
        // Two things this got wrong first time round. The sim reports the
        // bearing to the attacker relative to the player's own facing
        // (player.js hurt()), so the yaw has to come back off to get a world
        // direction -- rotating it by the camera on top sprayed the sparks
        // somewhere arbitrary. And the burst was wide, fast and a metre out,
        // which washed the screen white and hid the robot that threw the
        // punch. That robot is the whole point, so the burst is now small,
        // slow, and below the sight line.
        if (h.by !== "spit") {
          const bearing = h.angle - n.yaw;
          this._v.set(Math.sin(bearing), 0, -Math.cos(bearing));
          this._v2
            .copy(n.camPos)
            .addScaledVector(this._v, 0.55)
            .setY(n.camPos.y - 0.26);
          // Spray back towards the player, away from the attacker.
          this.particles.impactSparks(this._v2, this._v.negate(), 5, 0.34);
          // The sim already adds trauma scaled by damage; this is the extra
          // snap that says the hit was physical, not a health tick.
          n.addTrauma(0.16);
          this.weaponView.kickPos.z += 0.05;
          this.weaponView.kickRot.x += 0.09;
          this.weaponView.swayRotV.z += rand(-1, 1) * 2.2;
        }
        H.setHealth(n.hp, n.maxHp);
        break;
      }
      case EV.EV_DEAD:
        this.onDeath();
        break;
      // weapons
      case EV.EV_SHOT:
        (this.weaponView.onEvent(h, w.weapons),
          // A stream weapon emits no tracer and leaves no impact, so the jet
          // is the only thing that shows the player where the damage went.
          h.def.fire === "cone"
            ? this.particles.flameJet(
                this.weaponView.muzzleWorld,
                n.forward,
                h.def.coneRange,
                h.def.coneAngle,
              )
            : this.particles.muzzleSmoke(
                this.weaponView.muzzleWorld,
                n.forward,
                h.def.smoke,
              ),
          A.gunshot(h.def.sound));
        break;
      case EV.EV_TRACER: {
        const d = h.def.key === "dmr";
        this.tracers.fire(
          this.weaponView.muzzleWorld,
          h.end,
          c,
          d ? 520 : 360,
          h.def.tracerWidth,
          d ? 9 : 4.5,
          h.def.tracer,
        );
        break;
      }
      case EV.EV_EXPLOSION: {
        // Fly the rocket out to where it landed before the blast goes off.
        // The sim traced it instantly; over this arena that is about a sixth
        // of a second of flight, and showing it keeps the weapon reading as a
        // rocket rather than a very loud laser.
        (this.tracers.fire(
          this.weaponView.muzzleWorld,
          h.point,
          c,
          38,
          0.09,
          6,
          [1, 0.7, 0.3],
        ),
          this.particles.explosion(h.point, h.radius),
          this.decals.add(h.point, UP, h.radius * 0.45, 0, c),
          this.impactLight.position.copy(h.point).setY(h.point.y + 0.6),
          (this.impactLight.intensity = 150),
          A.explosion([h.point.x, h.point.y, h.point.z]));
        break;
      }
      case EV.EV_IMPACT: {
        const d = h.def.key === "dmr",
          sg = h.def.key === "shotgun";
        (this.decals.add(
          h.point,
          h.normal,
          rand(0.09, 0.14) * (d ? 1.5 : sg ? 0.8 : 1),
          0,
          c,
        ),
          this.particles.impactSparks(
            h.point,
            h.normal,
            d ? 26 : sg ? 5 : 12,
            d ? 1.5 : 1,
          ),
          c - this.lastHitSound > 0.03 &&
            ((this.lastHitSound = c),
            A.impactWorld([h.point.x, h.point.y, h.point.z])),
          this.impactLight.position
            .copy(h.point)
            .addScaledVector(h.normal, 0.25),
          (this.impactLight.intensity = d ? 60 : 30));
        break;
      }
      case EV.EV_HIT: {
        const glow = theme.enemies[h.kind].glow;
        (this.particles.fleshBurst(h.point, h.dir, h.head, glow),
          A.impactFlesh([h.point.x, h.point.y, h.point.z]),
          H.hitmarker(h.killed ? (h.head ? "head" : "kill") : "hit"),
          c - this.lastHitSound > 0.03 &&
            ((this.lastHitSound = c),
            h.killed ? A.kill(h.head) : A.hitmarker(h.head)));
        break;
      }
      case EV.EV_DRY_FIRE:
        A.dryFire();
        break;
      case EV.EV_EJECT: {
        (this.weaponView.onEvent(h, w.weapons),
          this.weaponView.ejectWorld(this._v));
        const s = this._v2.copy(n.right).cross(n.forward),
          v = new Vector3()
            .copy(n.right)
            .multiplyScalar(rand(1.6, 2.6))
            .addScaledVector(s, rand(1.3, 2.2))
            .addScaledVector(n.forward, rand(-0.4, 0.2))
            .add(n.vel);
        this.shells.eject(this._v, v, h.shell);
        break;
      }
      case EV.EV_PUMP:
        A.pump();
        break;
      case EV.EV_RELOAD_STAGE:
        h.stage === "start"
          ? h.key === "shotgun"
            ? A.click(0.5, 1200)
            : A.click(0.6, 1500)
          : h.stage === "magOut"
            ? A.magOut()
            : h.stage === "magIn"
              ? A.magIn()
              : h.stage === "bolt"
                ? A.bolt()
                : h.stage === "shellIn" && A.shellIn();
        break;
      case EV.EV_SWITCH:
        (h.quiet || A.weaponSwitch(), this.syncWeapon());
        break;
      case EV.EV_AMMO:
        H.setAmmo(h.mag, h.reserve, h.magSize);
        break;
      // enemies
      case EV.EV_SPAWN:
        (this.particles.spawnFx(h.pos, theme.enemies[h.kind].glow),
          A.enemyGrowl([h.pos.x, h.pos.y, h.pos.z], h.big));
        break;
      case EV.EV_GROWL:
        A.enemyGrowl([h.pos.x, h.pos.y, h.pos.z], h.big);
        break;
      case EV.EV_SLAM:
        (this.particles.slamWave(h.pos, 4),
          A.bruteSlam([h.pos.x, h.pos.y, h.pos.z]));
        break;
      case EV.EV_SPIT:
        (A.spit([h.pos.x, h.pos.y, h.pos.z]),
          this.particles.splash(h.pos, [0.4, 1, 0.4]));
        break;
      case EV.EV_PROJECTILE_HIT:
        (this.particles.splash(h.pos, [0.4, 1, 0.4]),
          A.splash([h.pos.x, h.pos.y, h.pos.z]));
        break;
      case EV.EV_KILL: {
        const t = h.enemy,
          e = h.head,
          glow = theme.enemies[t.type].glow;
        (this.particles.deathBurst(t.pos, glow, t.scale, e),
          A.enemyDeath([t.pos.x, t.pos.y, t.pos.z], t.def.big));
        const a = this.project(t.pos.x, t.pos.y + 1.75 * t.scale, t.pos.z);
        (a &&
          H.popup(
            "+" + h.points + (e ? " HEADSHOT" : ""),
            a.x,
            a.y,
            e ? "head" : "kill",
          ),
          H.feed(
            `${theme.enemies[t.type].name} ${e ? "HEADSHOT" : "DISABLED"}`,
            e ? "head" : "",
          ),
          h.streak >= 3 &&
            h.streak % 3 === 0 &&
            (H.feed(`${h.streak}x STREAK  ×${h.mult.toFixed(2)}`, "wave"),
            H.popup(
              `${h.streak}x STREAK`,
              window.innerWidth / 2,
              window.innerHeight * 0.36,
              "bonus",
            )),
          this._v.set(t.pos.x, h.groundY, t.pos.z),
          this.decals.add(this._v, UP, 1.5 * t.scale, 1, c));
        break;
      }
      // match flow
      case EV.EV_WAVE_START: {
        const [title, sub, danger] = h.banner;
        (H.banner(title, sub, 3.2, danger),
          H.feed("WAVE " + h.wave + " STARTED", "wave"),
          A.waveStart(),
          (A.intensity = 2));
        break;
      }
      case EV.EV_WAVE_CLEAR:
        (H.banner(
          "WAVE " + h.wave + " CLEARED",
          "+" + h.bonus + " BONUS  ·  REINFORCEMENTS IN 9s",
          4,
        ),
          H.feed("WAVE " + h.wave + " CLEARED  +" + h.bonus, "wave"),
          A.waveClear(),
          (A.intensity = 1));
        break;
      case EV.EV_PICKUP:
        (H.feed("AMMO RESUPPLY", "wave"),
          H.hint("AMMO RESUPPLIED"),
          A.pickup(),
          this.particles.pickupBurst(h.pos));
        break;
    }
  }
  // Pickup records → meshes (added/removed by id, posed from sim state).
  _syncPickups() {
    const live = this.world.pickups,
      m = this.pickupMeshes;
    for (const p of live) {
      let mesh = m.get(p.id);
      (mesh ||
        ((mesh = this.pickupProto.clone()),
        this.scene.add(mesh),
        m.set(p.id, mesh)),
        mesh.position.copy(p.pos),
        (mesh.rotation.y = p.t * 1.2),
        (mesh.visible = p.visible));
    }
    if (m.size !== live.length)
      for (const [id, mesh] of m)
        live.some((p) => p.id === id) ||
          (this.scene.remove(mesh), m.delete(id));
  }
  loop(t) {
    let frameDt = Math.min(0.05, (t - this.last) / 1e3);
    this.last = t;
    frameDt <= 0 && (frameDt = 1e-4);
    ((this.fps = damp(this.fps, 1 / frameDt, 2, frameDt)),
      (this.slowmo = Math.max(0, this.slowmo - frameDt)),
      (this.timeScale = damp(
        this.timeScale,
        this.slowmo > 0 ? 0.28 : 1,
        7,
        frameDt,
      )));
    // Look is applied per frame for aim latency; movement/combat step at a
    // fixed rate and the renderer interpolates between the last two ticks.
    const w = this.world,
      playing = this.state === "playing" || this.state === "dead";
    playing && w.player.applyLook(this.input);
    const alpha = this.fixed.advance(frameDt, this.timeScale, (dt) => {
      this.time += dt;
      playing ? this.stepGame(dt) : this.stepIdle(dt);
      this.input.endTick();
    });
    (w.slowmoRequest > 0 &&
      ((this.slowmo = Math.max(this.slowmo, w.slowmoRequest)),
      (w.slowmoRequest = 0)),
      this.handleEvents(w.drainEvents()),
      playing
        ? this.presentGame(alpha, frameDt)
        : this.presentIdle(alpha, frameDt));
    // FX are frame-rate driven but still honour slow-mo.
    const s = this.time,
      fxDt = frameDt * this.timeScale,
      n = w.player;
    (this.arenaView.update(s, fxDt),
      this.sky.update(s),
      this.particles.update(s, fxDt, this.camera.position),
      this.tracers.update(s),
      this.decals.update(s),
      this.shells.update(fxDt, (r, a) => w.arena.groundHeight(r, a)),
      (this.impactLight.intensity *= Math.exp(-28 * frameDt)),
      this.hud.update(frameDt),
      this._tickContest(frameDt),
      this.audio.setListener(
        [
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z,
        ],
        [n.forward.x, 0, n.forward.z],
        [n.right.x, 0, n.right.z],
      ),
      this.audio.update(frameDt, this.state === "playing" ? n.hp / n.maxHp : 1),
      this.render(),
      this.input.endFrame());
  }
  // ---- menu / game-over diorama ------------------------------------------
  stepIdle(dt) {
    (this.state === "menu" || this.state === "over") && this.world.stepIdle(dt);
  }
  presentIdle(alpha, frameDt) {
    const w = this.world;
    if (this.state === "menu" || this.state === "over") {
      const n = this.time * 0.07;
      (this.camera.position.set(
        Math.cos(n) * 26,
        7.5 + Math.sin(this.time * 0.3) * 1.2,
        Math.sin(n) * 26,
      ),
        this.camera.lookAt(0, 2.5, 0),
        (this.camera.fov = damp(this.camera.fov, 62, 4, frameDt)),
        this.camera.updateProjectionMatrix(),
        w.player.forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion),
        w.player.right.set(1, 0, 0).applyQuaternion(this.camera.quaternion),
        (this.postfx.u.uDamage.value = 0),
        (this.postfx.u.uRadial.value = 0),
        (this.postfx.u.uCA.value = this.grade.chromatic),
        (this.postfx.u.uFlash.value = 0));
    }
    (this.enemyView.sync(w.enemies, w.projectiles, alpha, this.time),
      this._syncPickups());
  }
  // ---- match: fixed-rate simulation step ----------------------------------
  stepGame(dt) {
    const w = this.world;
    w.step(dt, this.input.frame());
    if (w.player.dead && w.deadT > 3.2 && this.state === "dead") {
      ((this.state = "over"),
        this.input.unlock(),
        this.audio.endSession(),
        w.endRun());
      const d = Math.floor(w.elapsed);
      (this.hud.showMenu(
        !0,
        "K.I.A.",
        "REDEPLOY",
        `WAVE ${w.wave} REACHED<br>${w.kills} KILLS · ${w.score.toLocaleString("en-US")} POINTS<br>${d}s SURVIVED<br>SEED ${this.seed}`,
        "THE SWARM PREVAILS",
      ),
        this.hud.setPauseActions(false),
        this.lastRun && this.hud.runSummary(this.lastRun),
        this.hud.show(!1));
    }
  }
  // ---- match: per-frame presentation ---------------------------------------
  presentGame(alpha, frameDt) {
    const w = this.world,
      n = w.player,
      W = w.weapons;
    this.hurtFx = Math.max(0, this.hurtFx - frameDt * 2.2);
    (this.camera.position.lerpVectors(n.prevCamPos, n.camPos, alpha),
      this.camera.quaternion.slerpQuaternions(n.prevCamQuat, n.camQuat, alpha));
    // Trauma shake, scaled by the user's setting. Purely visual: the sim's
    // camQuat (and so the fire ray) never carries it.
    const z = n.trauma * n.trauma * this.settings.get("shake");
    if (z > 0) {
      const U = this.time * 30;
      (this._e.set(
        z * 0.045 * (Math.sin(U * 1.1) * 0.6 + Math.sin(U * 2.3 + 1) * 0.4),
        z * 0.045 * (Math.sin(U * 0.9 + 2) * 0.6 + Math.sin(U * 2.7) * 0.4),
        z * 0.03 * Math.sin(U * 1.7 + 0.5),
        "YXZ",
      ),
        this._q.setFromEuler(this._e),
        this.camera.quaternion.multiply(this._q));
    }
    if (n.dead) {
      const h = Math.min(1, w.deadT / 1.4);
      ((this.camera.position.y -= h * 1.05),
        this._e.set(-h * 0.35, 0, h * 0.55),
        this._q.setFromEuler(this._e),
        this.camera.quaternion.multiply(this._q));
    }
    // FOV: user base, widened by sprint/slide, pulled to the weapon's ADS FOV
    // (scaled so the relative zoom is the same at any base FOV).
    const base = this.settings.get("fov"),
      hipFov = base + n.sprintBlend * 6 + n.slideBlend * 9,
      targetFov = MathUtils.lerp(
        hipFov,
        W.weapon.def.adsFov * (base / 80),
        n.ads,
      );
    ((this.camFov = damp(this.camFov, targetFov, 18, frameDt)),
      (this.camera.fov = this.camFov),
      this.camera.updateProjectionMatrix(),
      this.weaponCamera.position.copy(this.camera.position),
      this.weaponCamera.quaternion.copy(this.camera.quaternion),
      this.enemyView.sync(w.enemies, w.projectiles, alpha, this.time),
      this._syncPickups(),
      this.weaponView.sync(W, n, this.input, frameDt, this.time));
    for (const p of w.projectiles.list)
      p.active && this.particles.trail(p.pos, theme.enemies.spitter.glow, 0.16);
    const r = this.weaponView.flash.intensity;
    (this.muzzleLight.position.copy(this.weaponView.muzzleWorld),
      (this.muzzleLight.intensity = r * W.weapon.def.flash.light * 0.85));
    const a = W.getSpread(n),
      l =
        (Math.tan(a) / Math.tan(MathUtils.degToRad(this.camera.fov / 2))) *
          (window.innerHeight / 2) +
        5;
    if (
      (this.hud.setCrosshair(
        l,
        W.adsSmooth < 0.45 && !n.dead && W.sprintBlend < 0.6,
      ),
      this.hud.setHealth(n.hp, n.maxHp),
      this.hud.setStats(
        w.wave,
        w.enemies.alive + w.queue.length,
        w.kills,
        w.score,
      ),
      this.state === "playing")
    ) {
      const h = W.weapon;
      h.mag === 0 && h.reserve > 0 && !h.reloading
        ? this.hud.hint("RELOAD  [R]", !0, 0.2)
        : h.mag === 0 &&
          h.reserve === 0 &&
          this.hud.hint("NO AMMO  ·  SWITCH WEAPON", !0, 0.2);
    }
    const o = this.postfx.u,
      c = n.hp / n.maxHp;
    ((o.uDamage.value = Math.pow(1 - c, 1.7) * 0.85 + this.hurtFx * 0.4),
      (o.uCA.value =
        this.grade.chromatic +
        this.hurtFx * 0.002 +
        n.trauma * n.trauma * 0.003),
      (o.uRadial.value = n.slideBlend * 0.1 + n.sprintBlend * 0.025),
      (o.uFlash.value = r * 0.008),
      (o.uExposure.value = this.grade.exposure + W.adsSmooth * 0.06),
      (o.uDesat.value = n.dead ? Math.min(1, w.deadT / 2.5) : 0));
  }
  render() {
    this.postfx.render(
      this.scene,
      this.camera,
      this.state === "playing" ||
        this.state === "dead" ||
        this.state === "paused"
        ? this.weaponScene
        : null,
      this.weaponCamera,
      this.time,
    );
  }
}
