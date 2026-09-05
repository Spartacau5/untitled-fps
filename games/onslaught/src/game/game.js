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
import { Audio } from "../audio/audio.js";
import { Input } from "../core/input.js";
import { FixedLoop } from "../core/loop.js";
import { UP, damp, rand } from "../core/mathx.js";
import { parseSeed } from "../core/rng.js";
import { Settings } from "../core/settings.js";
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
import { mountSettingsPanel } from "../ui/settings-panel.js";
import {
  fetchBoard,
  loadPlayerName,
  renderBoard,
  savePlayerName,
  submitRun as postRun,
} from "../ui/leaderboard.js";

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
    this.world = new World({
      seed: this.seed,
      god: this.god,
      noSpawn: e.has("nospawn"),
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
      (this.weaponView = new WeaponView(this.weaponCamera)),
      (this.pickupMeshes = new Map()),
      (this.postfx = new PostFX(n)));
    const r = new DirectionalLight(
      theme.lights.weaponKey.color,
      theme.lights.weaponKey.intensity,
    );
    (r.position.copy(SUN_DIR).multiplyScalar(10),
      this.weaponScene.add(r),
      this.weaponScene.add(r.target),
      this.weaponScene.add(
        new HemisphereLight(
          theme.lights.weaponHemi.sky,
          theme.lights.weaponHemi.ground,
          theme.lights.weaponHemi.intensity,
        ),
      ));
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
      })),
      (this._runPosted = !1),
      this.hud.el.playerName &&
        (this.hud.el.playerName.value = loadPlayerName()),
      this._refreshBoard(),
      this.hud.el.btnStart.addEventListener("click", () => this.start()),
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
        (k === "master" || k === "music" || k === "sfx") &&
          this.audio.setVolumes({ [k]: v }));
    };
    for (const k in this.settings.all()) apply(k, this.settings.get(k));
    this.settings.onChange(apply);
  }
  _playerName() {
    const typed = this.hud.el.playerName && this.hud.el.playerName.value;
    return savePlayerName(typed || loadPlayerName() || "OPERATOR");
  }
  _refreshBoard() {
    fetchBoard()
      .then((data) =>
        renderBoard(this.hud.el.leaderboard, data, this._playerName()),
      )
      .catch(() =>
        renderBoard(
          this.hud.el.leaderboard,
          { entries: [] },
          this._playerName(),
        ),
      );
  }
  async _submitRun() {
    if (this._runPosted) return;
    this._runPosted = true;
    const w = this.world;
    try {
      const data = await postRun({
        name: this._playerName(),
        score: w.score,
        kills: w.kills,
        wave: w.wave,
        elapsed: w.elapsed,
        seed: this.seed,
      });
      renderBoard(this.hud.el.leaderboard, data, this._playerName());
    } catch {
      this._refreshBoard();
    }
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
    const t = new PMREMGenerator(this.renderer),
      e = new Scene();
    e.add(new Mesh(this.sky.mesh.geometry, this.sky.mesh.material));
    const n = new Mesh(
      new PlaneGeometry(600, 600),
      new MeshBasicMaterial({ color: theme.arena.floor }),
    );
    ((n.rotation.x = -Math.PI / 2), (n.position.y = -0.5), e.add(n));
    const s = new Mesh(
      new TorusGeometry(38, 1.2, 8, 64),
      new MeshBasicMaterial({
        color: new Color(theme.arena.accentHot).multiplyScalar(1.4),
      }),
    );
    ((s.rotation.x = Math.PI / 2), (s.position.y = 3.4), e.add(s));
    for (const a of this.world.arena.gates) {
      const l = new Mesh(
        new SphereGeometry(2.5, 12, 8),
        new MeshBasicMaterial({ color: new Color(2.2, 0.8, 0.2) }),
      );
      (l.position.set(a.pos.x, 3.5, a.pos.z), e.add(l));
    }
    const r = t.fromScene(e, 0.04, 0.1, 1500);
    ((this.scene.environment = r.texture),
      (this.weaponScene.environment = r.texture),
      (this.scene.environmentIntensity = theme.lights.envIntensity.world),
      (this.weaponScene.environmentIntensity =
        theme.lights.envIntensity.weapon),
      t.dispose());
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
  start() {
    this.settingsPanel && this.settingsPanel.close();
    if ((this.audio.init(), this.audio.resume(), this.state === "paused")) {
      ((this.state = "playing"),
        this.hud.showMenu(!1),
        this.debug || this.input.lock(),
        (this.last = performance.now()));
      return;
    }
    (this.resetGame(),
      (this._runPosted = !1),
      this._playerName(),
      (this.state = "playing"),
      this.hud.showMenu(!1),
      this.hud.show(!0),
      this.debug || this.input.lock(),
      (this.last = performance.now()),
      this.hud.banner(...theme.strings.deployingBanner, 2.5),
      (this.audio.intensity = 1));
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
      ));
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
      this._submitRun());
  }
  onKey(t) {
    if (t === "Escape" && this.settingsPanel && this.settingsPanel.isOpen()) {
      this.settingsPanel.close();
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
      case EV.EV_HURT:
        (H.damageFrom(h.angle),
          A.playerHurt(h.amount),
          (this.hurtFx = 1),
          H.setHealth(n.hp, n.maxHp));
        break;
      case EV.EV_DEAD:
        this.onDeath();
        break;
      // weapons
      case EV.EV_SHOT:
        (this.weaponView.onEvent(h, w.weapons),
          this.particles.muzzleSmoke(
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
          H.feed(`${t.def.name} ${e ? "HEADSHOT" : "DOWN"}`, e ? "head" : ""),
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
      ((this.state = "over"), this.input.unlock());
      const d = Math.floor(w.elapsed);
      (this.hud.showMenu(
        !0,
        "K.I.A.",
        "REDEPLOY",
        `WAVE ${w.wave} REACHED<br>${w.kills} KILLS · ${w.score.toLocaleString("en-US")} POINTS<br>${d}s SURVIVED<br>SEED ${this.seed}`,
        "THE SWARM PREVAILS",
      ),
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
      p.active && this.particles.trail(p.pos, [0.35, 1, 0.4], 0.16);
    const r = this.weaponView.flash.intensity;
    (this.muzzleLight.position.copy(this.weaponView.muzzleWorld),
      (this.muzzleLight.intensity = r * W.weapon.def.flash.light * 3.5));
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
        this.hurtFx * 0.02 +
        r * 0.012 +
        n.trauma * n.trauma * 0.03),
      (o.uRadial.value = n.slideBlend * 0.5 + n.sprintBlend * 0.12),
      (o.uFlash.value = r * 0.03),
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
