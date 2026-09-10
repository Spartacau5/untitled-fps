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
import { Progression, xpForKill, xpForWaveClear } from "../core/progression.js";
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
import { DirectRenderer } from "../render/direct-renderer.js";
import { TouchInput } from "../core/touch-input.js";
import { mountTouchControls } from "../ui/touch-controls.js";
import { createSky } from "../render/sky.js";
import { WeaponView } from "../render/weapon-view.js";
import { scopeAmount } from "../render/scope.js";
import * as EV from "../sim/events.js";
import { World } from "../sim/world.js";
import { HUD } from "../ui/hud.js";
import { mountFeedback } from "../ui/feedback.js";
import { mountArmory } from "../ui/armory.js";
import { mountControls, renderControlSummary } from "../ui/controls.js";
import { STARTER_LOADOUT, WEAPONS } from "../data/weapons.js";
import { loadoutIcon } from "../ui/weapon-icons.js";
import { mountSettingsPanel } from "../ui/settings-panel.js";
import { Telemetry } from "../ui/telemetry.js";
import {
  applyAssignedCallsign,
  fetchBoard,
  loadPlayerName,
  markPlayed,
  mountContestTabs,
  renderBoard,
  savePlayerName,
  submitRun as postRun,
} from "../ui/leaderboard.js";

// Graphics tiers, indexed by the `quality` setting. Render scale is capped
// rather than fixed, so a 1x display never renders above its own resolution.
// The bed the menu and the loading reveal play under. The scheduler is silent
// below 1; a fight raises it to 2.
const MENU_MUSIC = 1;

// Stick aim assist. Looking slows to ASSIST_SLOWDOWN of its rate when the
// crosshair sits on a body, easing back to full at the edge of a bubble
// ASSIST_BUBBLE times the angle that body subtends. Nothing beyond
// ASSIST_RANGE counts - at that distance you are lining up a shot, not
// tracking, and slowing the look would just feel like drag.
const ASSIST_SLOWDOWN = 0.55;
const ASSIST_BUBBLE = 2.6;
const ASSIST_RANGE = 55;

const QUALITY_TIERS = [
  { pixelRatio: 1, samples: 0, shadow: 1024, enemyShadows: !1 },
  { pixelRatio: 1.25, samples: 2, shadow: 2048, enemyShadows: !0 },
  { pixelRatio: 1.5, samples: 4, shadow: 2048, enemyShadows: !0 },
];

// Presentation shell: owns the renderer, cameras, views, FX, audio and HUD.
// All gameplay lives in sim/world.js; this class feeds it input frames and
// turns its events and state into pixels and sound.
export class Game {
  constructor(t, { mobile = false, PostFX } = {}) {
    this.mobile = mobile;
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
      // ?wave=8 starts there; ?only=brute fills the wave with one enemy type.
      // Both are for looking at something without playing up to it. ?air is
      // kept as the drone alias because it is already in use.
      firstWave: Number(e.get("wave")) || 1,
      onlyType: e.has("air") ? "drone" : e.get("only"),
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
    (n.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5)),
      n.setSize(window.innerWidth, window.innerHeight, !1),
      (n.toneMapping = NoToneMapping),
      (n.shadowMap.enabled = !mobile),
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
      (this.input = mobile ? new TouchInput() : new Input(t)),
      (this.audio = new Audio()),
      // Build the audio graph at load, not on the DEPLOY click. A context may
      // be constructed without a gesture - it just starts suspended - and
      // constructing one costs tens of milliseconds. Only resume() needs the
      // gesture, and that is free.
      this.audio.init(),
      this.debug && ((this.audio.musicOn = !1), (this.audio.ambienceOn = !1)),
      (this.hud = new HUD()),
      (this.arenaView = new ArenaView(this.scene, this.world.arena, {
        mobile,
      })),
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
        { mobile },
      )),
      (this.pickupMeshes = new Map()),
      (this.postfx = mobile ? new DirectRenderer(n) : new PostFX(n)));
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
    r.castShadow = !mobile;
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
    const a = mobile
      ? new Group()
      : new PointLight(
          theme.lights.weaponFill.color,
          theme.lights.weaponFill.intensity,
          4,
          2,
        );
    (a.position.set(-0.6, -0.3, -0.6),
      this.weaponCamera.add(a),
      (this.muzzleLight = mobile
        ? Object.assign(new Group(), { intensity: 0 })
        : new PointLight(16752704, 0, 20, 2)),
      this.scene.add(this.muzzleLight),
      (this.impactLight = mobile
        ? Object.assign(new Group(), { intensity: 0 })
        : new PointLight(16760960, 0, 9, 2)),
      this.scene.add(this.impactLight),
      !mobile && this._setupEnvironment(),
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
      // Scratch for the heavy-unit health bars: a look direction and the
      // camera basis, kept off the per-frame allocation path.
      (this._bv = new Vector3()),
      (this._bv2 = new Vector3()),
      (this._bright = new Vector3()),
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
        menuMain: this.hud.el.menuGrid,
        note: this.hud.el.settingsNote,
        mobile,
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
          menuMain: this.hud.el.menuGrid,
        },
        (loadout, startKey) => this._applyLoadout(loadout, startKey),
      )),
      (this.controlsPanel = mountControls({
        panel: this.hud.el.controlsPanel,
        body: this.hud.el.controlsBody,
        btnOpen: this.hud.el.btnControls,
        btnBack: this.hud.el.controlsBack,
        summary: this.hud.el.controlsSummary,
        mobile,
        menuMain: this.hud.el.menuGrid,
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
      (this.contestTabs = mountContestTabs(this.hud.el.menuRight, {
        winnersEl: this.hud.el.winnersBoard,
      })),
      // The rank strip is on from the first frame the boot reveal shows. Any
      // change to the profile - a banked run, an armory pick - redraws it.
      this.hud.setRank(this.progression),
      this.hud.showRank(!0),
      this.progression.onChange(() => this.hud.setRank(this.progression)),
      (this._freshGuns = new Set()),
      this.hud.setMenuMode("deploy"),
      this._renderLoadout(),
      this.hud.el.loadoutCards &&
        this.hud.el.loadoutCards.addEventListener("click", (e) => {
          const card = e.target.closest("[data-key]");
          if (!card || card.disabled) return;
          const key = card.dataset.key;
          this.progression.pick(key);
          this._freshGuns && this._freshGuns.delete(key);
          this._applyLoadout(this.progression.loadout, this.progression.start);
          this.armoryPanel && this.armoryPanel.render();
        }),
      this.hud.el.loadoutFresh &&
        this.hud.el.loadoutFresh.addEventListener(
          "click",
          () => this.armoryPanel && this.armoryPanel.open(),
        ),
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
      // Autoplay policy holds the context suspended until the player interacts.
      // Waking on the first gesture anywhere means the menu has sound as soon
      // as they touch the page, rather than staying silent until DEPLOY.
      window.addEventListener("pointerdown", () => this.audio.resume(), {
        once: true,
      }),
      window.addEventListener("keydown", () => this.audio.resume(), {
        once: true,
      }),
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
      }));
    if (mobile) this.touchControls = mountTouchControls(this.input, this);
  }
  // Compile every program the opening frames will need, up front.
  //
  // three links a program the first time it is used, and reading back the link
  // status blocks until the driver is done. Left lazy, that lands as one
  // multi-second freeze on the first rendered frame. compileAsync goes through
  // KHR_parallel_shader_compile, so the driver links on its own threads while
  // the page keeps painting - which is what lets the loading bar actually move.
  async warmup(onProgress) {
    const step = (v, label) => onProgress && onProgress(v, label);
    try {
      (step(0.5, "COMPILING CITY SHADERS"),
        await this.renderer.compileAsync(this.scene, this.camera));
      (step(0.82, "COMPILING WEAPON SHADERS"),
        await this.renderer.compileAsync(this.weaponScene, this.weaponCamera));
    } catch {
      // Best effort. A driver without the extension just pays the old cost on
      // the first frames rather than failing to start.
    }
    step(0.96, "STARTING");
  }
  // Held back until warmup resolves so nothing renders mid-compile.
  startLoop() {
    ((this.last = performance.now()),
      // The music scheduler emits nothing below intensity 1, so a menu left at
      // 0 got ambience only and the music arrived late, on DEPLOY. It comes up
      // with the reveal now; the wave handlers still take it to 2 in a fight.
      this.audio.resume(),
      (this.audio.intensity = MENU_MUSIC),
      requestAnimationFrame(this._raf));
  }
  // Persisted preferences. Every consumer is presentation-side; FOV and shake
  // are read each frame in presentGame, the rest are pushed on change.
  _bindSettings() {
    this.settings = new Settings();
    this.camFov = this.settings.get("fov");
    const apply = (k, v) => {
      (k === "sensitivity" && (this.input.sensitivity = v),
        k === "padSensitivity" && (this.input.padSensitivity = v),
        k === "padAdsSensitivity" && (this.input.padAdsSensitivity = v),
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
    const tier = this.mobile
      ? QUALITY_TIERS[0]
      : QUALITY_TIERS[Math.round(level)] || QUALITY_TIERS[2];
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
    this.contestTabs && this.contestTabs.setWinners(data.winners);
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
    // Nothing to bank here any more: every kill and wave clear already paid
    // out while the run was happening, which is the point - a tab closed at
    // wave nine keeps wave nine's XP. This only tallies what that came to.
    this.lastXp = this.progression.endRun();
    // Guns this run opened stay flagged in the armory until the next deploy.
    // They are not equipped for you - three keys is three keys - so the mark
    // is an invitation to go and make room for one.
    this._freshGuns = new Set(this.lastXp.unlocks.map((r) => r.key));
    (this.armoryPanel && this.armoryPanel.setFresh(this._freshGuns),
      this.armoryPanel && this.armoryPanel.render(),
      this._renderLoadout(),
      this.hud.setRank(this.progression, {
        levelUp: this.lastXp.levelsGained > 0,
      }));
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
      this._renderLoadout());
  }
  // Bank XP the instant it is earned and react to anything it crossed. The
  // rank strip redraws on its own through progression.onChange; what this
  // adds is the moment - a level landing mid-run should be something you
  // notice while playing, not a line you read on the debrief.
  _awardXp(amount, opts) {
    if (!(amount > 0)) return null;
    const got = this.progression.award(amount, opts);
    if (got.levelsGained > 0) {
      (this.hud.setRank(this.progression, { levelUp: !0 }),
        this.hud.feed(`LEVEL ${got.level} REACHED`, "wave"),
        this.hud.popup(
          `LEVEL ${got.level}`,
          window.innerWidth / 2,
          window.innerHeight * 0.3,
          "bonus",
        ));
      for (const r of got.unlocks) this.hud.feed(`${r.label} UNLOCKED`, "wave");
    }
    return got;
  }
  // Deferred so it never lands inside the first frames. requestIdleCallback
  // is not in every browser, so fall back to a timeout.
  _warmViewmodels() {
    const warm = () => this.weaponView.warm();
    typeof requestIdleCallback === "function"
      ? requestIdleCallback(warm, { timeout: 4000 })
      : setTimeout(warm, 1200);
  }
  // The OPERATOR panel: every gun in the roster as an icon tile. Carried ones
  // light up with their key badge; locked ones show a lock silhouette and
  // refuse clicks. Names and classes stay out of the way - the art is the
  // label. Beneath the grid, the next unlock so the ladder still reads.
  _renderLoadout() {
    const cards = this.hud.el.loadoutCards,
      nextEl = this.hud.el.loadoutNext;
    if (!cards) return;
    const l = this.world.weapons.loadout,
      startKey = l[this.world.weapons.startIndex]?.key,
      roster = WEAPONS.slice().sort((a, b) => {
        const byLevel = (a.unlockLevel || 0) - (b.unlockLevel || 0);
        if (byLevel) return byLevel;
        const ai = STARTER_LOADOUT.indexOf(a.key),
          bi = STARTER_LOADOUT.indexOf(b.key);
        if (ai >= 0 || bi >= 0)
          return (ai >= 0 ? ai : 99) - (bi >= 0 ? bi : 99);
        return a.name.localeCompare(b.name);
      });
    cards.innerHTML = roster
      .map((w) => {
        const locked = !this.progression.isUnlocked(w.key),
          slot = this.progression.slotOf(w.key),
          selected = slot > 0,
          isNew = !!(this._freshGuns && this._freshGuns.has(w.key)),
          starts = selected && w.key === startKey,
          cls =
            "lo-card" +
            (selected ? " is-on" : "") +
            (starts ? " is-spawn" : "") +
            (locked ? " is-locked" : "") +
            (isNew ? " is-new" : "");
        const label = locked
          ? `${w.name} · LOCKED · LEVEL ${w.unlockLevel}`
          : selected
            ? `${w.name} · KEY ${slot}${starts ? " · SPAWN" : ""}`
            : `${w.name} · AVAILABLE`;
        return `<button type="button" class="${cls}" data-key="${w.key}" aria-label="${label}" aria-pressed="${selected}"${
          locked ? " disabled" : ""
        }>${loadoutIcon(w.key, { slot, locked })}${
          isNew ? `<span class="lo-tag">NEW</span>` : ""
        }</button>`;
      })
      .join("");
    // Guns the last run opened that are not yet on a key. The tiles already
    // flash NEW; this banner is the loud "go pick one" nudge.
    const waiting = [...(this._freshGuns || [])].filter(
      (k) => !this.progression.isEquipped(k),
    );
    const freshEl = this.hud.el.loadoutFresh;
    if (freshEl) {
      freshEl.classList.toggle("hidden", waiting.length === 0);
      if (waiting.length)
        freshEl.innerHTML = `<span class="lo-fresh-k">${waiting.length} NEW ${
          waiting.length === 1 ? "GUN" : "GUNS"
        }</span><span class="lo-fresh-v">${waiting
          .map((k) => {
            const w = this.progression.unlocked.find((x) => x.key === k);
            return w ? w.name : k;
          })
          .join(" · ")}</span><span class="lo-fresh-a">TAP TO EQUIP</span>`;
    }
    const next = this.progression.nextUnlock();
    if (nextEl)
      nextEl.innerHTML = next
        ? `<span class="lo-next-k">NEXT UNLOCK</span><span class="lo-next-v">${next.label} <b>${next.klass}</b></span><span class="lo-next-l">LEVEL ${next.level}</span>`
        : `<span class="lo-next-k">ROSTER</span><span class="lo-next-v">EVERY GUN UNLOCKED</span>`;
    renderControlSummary(this.hud.el.controlsSummary, {
      carried: l.length,
      mobile: this.mobile,
    });
  }
  start() {
    if (this.mobile && !this.touchControls.enter()) return;
    this.settingsPanel && this.settingsPanel.close();
    this.armoryPanel && this.armoryPanel.close();
    this.controlsPanel && this.controlsPanel.close();
    this.hud.setPauseActions(false);
    if ((this.audio.init(), this.audio.resume(), this.state === "paused")) {
      ((this.state = "playing"),
        this.hud.showMenu(!1),
        (!this.debug || this.mobile) && this.input.lock(),
        (this.last = performance.now()));
      return;
    }
    (this.audio.beginSession(),
      (this.input.padSprint = !1),
      this.progression.beginRun(),
      (this._freshGuns = new Set()),
      this.armoryPanel && this.armoryPanel.setFresh(this._freshGuns),
      this._renderLoadout(),
      this.resetGame(),
      (this._runPosted = !1),
      (this.runStartedAt = new Date().toISOString()),
      (this.runId = this._newRunId()),
      (this._abandonSent = !1),
      this._playerName(),
      (this.state = "playing"),
      this.hud.showMenu(!1),
      this.hud.show(!0),
      (!this.debug || this.mobile) && this.input.lock(),
      (this.last = performance.now()),
      this.hud.banner(...theme.strings.deployingBanner, 2.5),
      (this.audio.intensity = 1),
      this._markPlayed());
  }
  pause() {
    if (this.mobile) this.input.unlock();
    const w = this.world;
    ((this.state = "paused"),
      this.hud.setMenuMode("paused"),
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
    this.hud.setMenuMode("deploy");
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
    if (this.mobile) this.input.unlock();
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
  // Health bars over the heavy units. Only the brute carries one: a husk
  // dies to a burst, and a bar over every body in a wave of 130 would be a
  // wall of them - but a 640 hp target you are emptying a magazine into has
  // no other way of telling you how far along you are.
  //
  // The Game owns the camera, so projection and culling happen here and the
  // HUD is handed finished screen-space entries.
  _syncEnemyBars() {
    const out = this._barEntries || (this._barEntries = []);
    out.length = 0;
    // Nothing to draw between runs, and a stale bar left hanging over the
    // menu would be worse than none.
    if (this.state !== "playing") {
      this.hud.setEnemyBars(out);
      return;
    }
    const cam = this.camera.position,
      metrics = this.world.enemies.metrics;
    for (const e of this.world.enemies.list) {
      if (!e.def.big || e.state === "die" || e.state === "spawn") continue;
      const top = e.pos.y + metrics[e.type].headY * e.scale;
      const dx = e.pos.x - cam.x,
        dy = top - cam.y,
        dz = e.pos.z - cam.z,
        dist = Math.hypot(dx, dy, dz);
      // Far enough away that the bar would be a smear, or so close it is
      // behind you: either way, skip before paying for a projection.
      if (dist > 70 || dist < 0.6) continue;
      const at = this.project(e.pos.x, top, e.pos.z);
      if (!at) continue;
      // A bar visible through a facade would be an aimbot. The arena raycast
      // is the same one the guns use, so cover means cover.
      this._bv.set(dx / dist, dy / dist, dz / dist);
      const wall = this.world.arena.raycast(cam, this._bv, dist - 0.35);
      if (wall) continue;
      // Width in pixels for a fixed world width, so the bar shrinks with
      // distance the way the body does. Measured by projecting a point one
      // metre along the camera's right vector at the same depth, which gets
      // fov and aspect right without duplicating the projection maths.
      this.camera.matrixWorld.extractBasis(this._bright, this._bv, this._bv2);
      const off = this.project(
        e.pos.x + this._bright.x,
        top + this._bright.y,
        e.pos.z + this._bright.z,
      );
      if (!off) continue;
      const pxPerMetre = Math.abs(off.x - at.x);
      // Clamped so it stays legible across the arena without ever dominating
      // the screen when one is in your face.
      const width = Math.max(38, Math.min(108, pxPerMetre * 1.05 * e.scale));
      // Sit it above the head so it never covers what you are shooting at,
      // but clamp the gap in PIXELS rather than metres. A fixed world offset
      // is a fixed offset on the model and a wildly varying one on screen -
      // 65 px adrift at seven metres against 22 px at eighteen - which reads
      // as the bar coming loose from the body it belongs to.
      const gap = Math.max(12, Math.min(28, pxPerMetre * 0.3 * e.scale));
      out.push({
        x: at.x,
        y: at.y - gap,
        w: width,
        frac: Math.max(0, Math.min(1, e.hp / e.maxHp)),
      });
      // A handful is all a screen can carry; nearest win because the list is
      // walked in spawn order and the cap is generous.
      if (out.length >= 8) break;
    }
    this.hud.setEnemyBars(out);
  }
  // Options on PlayStation, Menu on Xbox. Pauses and unpauses, so a pad
  // player never has to reach for the keyboard mid-run.
  //
  // Unlike Escape this does not drop the pointer lock, which matters: coming
  // back needs a lock, and a lock needs a user gesture the browser will not
  // accept from a gamepad. Keeping it means resume is instant.
  _padMenu() {
    if (!this.input.padPause) return;
    this.input.padPause = !1;
    if (this.state === "playing") this.pause();
    else if (this.state === "paused") this.start();
  }
  // Stick aim assist, the cheap half: slow the look down while the crosshair
  // is near something worth shooting. No magnetism - nothing moves the aim for
  // you, it only gets easier to hold still - so it cannot fight a player who
  // knows where they are pointing.
  //
  // Lives here rather than in the sim because it is an input-feel concern and
  // needs the camera and the enemy list, and because a mouse must never get
  // it: nobody asked for their aim to be touched.
  _aimAssist() {
    const input = this.input;
    if (!input.pad || !input.pad.connected) {
      input.aimAssist = 1;
      return;
    }
    const cam = this.camera;
    (cam.getWorldDirection(this._bv), this._bv.normalize());
    const from = cam.position;
    let best = 1;
    for (const e of this.world.enemies.list) {
      if (e.state === "die" || e.state === "spawn") continue;
      const m = this.world.enemies.metrics[e.type];
      // Aim at the middle of the body, which is what a player tracks.
      const tx = e.pos.x - from.x,
        ty = (e.fly ? e.pos.y : e.pos.y + m.torsoTop * e.scale * 0.6) - from.y,
        tz = e.pos.z - from.z;
      const dist = Math.hypot(tx, ty, tz);
      if (dist < 1 || dist > ASSIST_RANGE) continue;
      const along =
        (tx * this._bv.x + ty * this._bv.y + tz * this._bv.z) / dist;
      if (along <= 0) continue;
      // How far off the crosshair sits, as a multiple of the angle the body
      // subtends. Under 1 is on the target; the bubble reaches a bit past it.
      const half = Math.asin(Math.min(0.9, Math.max(e.def.radius, 0.5) / dist));
      const off = Math.acos(Math.min(1, along)) / (half * ASSIST_BUBBLE);
      if (off >= 1) continue;
      // Full slowdown dead on, easing back to none at the edge of the bubble.
      const t = off * off * (3 - 2 * off);
      best = Math.min(best, ASSIST_SLOWDOWN + (1 - ASSIST_SLOWDOWN) * t);
    }
    input.aimAssist = best;
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
        //
        // Only the player's own rocket carries a def, and only it gets the
        // tracer: an incoming drone missile has already flown its arc as a
        // projectile, so drawing a line from the player's muzzle to the blast
        // would say it came from them.
        (h.def &&
          this.tracers.fire(
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
        // Paid now, not at the debrief. Nothing is written to storage on
        // the kill path - progression.award batches that itself.
        this._awardXp(xpForKill({ xp: t.def.xp, head: e, streak: h.streak }));
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
      case EV.EV_WAVE_CLEAR: {
        // The wave bonus is its own thing, growing with the wave, and it is
        // worth saying out loud - it is the one XP award big enough to read
        // as a reward rather than as a trickle.
        const waveXp = xpForWaveClear(h.wave);
        (this._awardXp(waveXp, { flush: !0 }),
          H.feed(`+${waveXp} XP  ·  WAVE ${h.wave} BONUS`, "wave"),
          H.banner(
            "WAVE " + h.wave + " CLEARED",
            "+" + h.bonus + " BONUS  ·  REINFORCEMENTS IN 9s",
            4,
          ),
          H.feed("WAVE " + h.wave + " CLEARED  +" + h.bonus, "wave"),
          A.waveClear(),
          (A.intensity = 1));
        break;
      }
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
    // Pad first: it writes into the same dx/dy the mouse does, so the look
    // below picks both up in one go. The slowdown is computed from the frame
    // just rendered, which is the one the player is reacting to, and has to
    // land before pollPad because that is what reads it.
    //
    // Polled in every state, not just while playing: Options has to be able
    // to unpause, and nothing else runs during a pause.
    (playing && this._aimAssist(),
      (this.input.adsAmount = playing ? w.weapons.adsSmooth : 0),
      this.input.pollPad && this.input.pollPad(frameDt),
      this._padMenu(),
      playing && w.player.applyLook(this.input));
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
      (this.hud.setMenuMode("dead"),
        this.hud.showMenu(
          !0,
          "K.I.A.",
          "REDEPLOY",
          `WAVE ${w.wave} · ${w.kills} KILLS · ${d}s<br><b>${w.score.toLocaleString("en-US")}</b> POINTS`,
          "THE SWARM PREVAILS",
        ),
        this.hud.setPauseActions(false),
        this.lastXp && this.hud.xpAward(this.lastXp, this.lastXp.unlocks),
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
      this.hud.setScope(scopeAmount(W, n)),
      this.hud.setStats(
        w.wave,
        w.enemies.alive + w.queue.length,
        w.kills,
        w.score,
      ),
      this._syncEnemyBars(),
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
