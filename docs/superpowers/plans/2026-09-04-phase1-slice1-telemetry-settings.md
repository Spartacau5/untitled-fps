# Phase 1 slice 1 — Run Telemetry + Persisted Settings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Resume status (2026-09-04):** Tasks 1–3 are implemented and committed (`4d335f7`, `66c3eb8`, `a25c93f`). **Start at Task 4.** Full context: `docs/superpowers/handoffs/2026-09-04-fable51-resume.md`. Do not redo Tasks 1–3.

**Goal:** Record every run's statistics in the sim, show them on the death screen with JSON export, and persist sensitivity/FOV/volume/shake settings behind a menu panel.

**Architecture:** `RunStats` (sim, pure) consumes the existing `World` event stream so telemetry is deterministic and headless. `Settings` (core) is a tiny localStorage-backed store; every consumer is presentation-side — the sim never reads settings. To make FOV and shake settings presentation-only, camera FOV and trauma shake move out of `Player` into `Game.presentGame`.

**Tech Stack:** ES modules, three@0.170, Vite 6, Node `node:test`, ESLint. Spec: `docs/superpowers/specs/2026-09-04-phase1-slice1-telemetry-settings-design.md`.

## Global Constraints

- `sim/` never imports from `render/`, `ui/`, `audio/`, `theme/`, never touches DOM/WebGL/audio, never reads settings (`npm run check:boundary` must stay clean).
- No balance/tuning value changes in this slice.
- Settings keys and ranges exactly: sensitivity 0.2–3 step 0.1 (default 1), fov 70–110 step 1 (default 80), master 0–1 step 0.05 (default 0.9), music 0–1 step 0.05 (default 1), sfx 0–1 step 0.05 (default 1), shake 0–1.5 step 0.1 (default 1).
- localStorage keys: `onslaught.settings.v1`, `onslaught.runs.v1` (cap 30 records).
- Enemy kind travels on event payloads as `kind`/`by`, never `type` (`World.emit` overwrites `type`).
- Commit after each task; run `npm test` before each commit. Never add Co-authored-by trailers.

---

### Task 1: Settings store — DONE (`4d335f7`)

**Files:**
- Create: `games/onslaught/src/core/settings.js`
- Test: `tests/settings.test.mjs`

**Interfaces:**
- Produces: `DEFAULTS`, `RANGES` (`{ key: { min, max, step } }`), `class Settings { constructor(storage?) ; get(key) ; set(key, value) ; onChange(fn) ; reset() ; all() }`, `STORAGE_KEY`.

- [ ] **Step 1: Failing test**

```js
// tests/settings.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { DEFAULTS, RANGES, STORAGE_KEY, Settings } from "../games/onslaught/src/core/settings.js";

const memStorage = (init = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k), _m: m };
};

test("defaults when storage is empty", () => {
  const s = new Settings(memStorage());
  assert.deepEqual(s.all(), DEFAULTS);
});
test("set clamps to range, snaps to step, persists and notifies", () => {
  const st = memStorage(), s = new Settings(st), seen = [];
  s.onChange((k, v) => seen.push([k, v]));
  s.set("fov", 500);
  s.set("sensitivity", 0.05);
  s.set("shake", 0.749);
  assert.equal(s.get("fov"), RANGES.fov.max);
  assert.equal(s.get("sensitivity"), RANGES.sensitivity.min);
  assert.equal(s.get("shake"), 0.7);
  assert.deepEqual(seen.map(([k]) => k), ["fov", "sensitivity", "shake"]);
  assert.deepEqual(new Settings(st).all(), s.all());
  assert.ok(st.getItem(STORAGE_KEY));
});
test("corrupt or partial storage falls back per key; unknown keys dropped", () => {
  assert.deepEqual(new Settings(memStorage({ [STORAGE_KEY]: "{nope" })).all(), DEFAULTS);
  const s = new Settings(memStorage({ [STORAGE_KEY]: JSON.stringify({ fov: 100, bogus: 1, music: "x" }) }));
  assert.equal(s.get("fov"), 100);
  assert.equal(s.get("music"), DEFAULTS.music);
  assert.equal(s.get("bogus"), undefined);
});
test("set with unknown key throws; reset restores defaults", () => {
  const s = new Settings(memStorage());
  assert.throws(() => s.set("nope", 1));
  s.set("fov", 95); s.reset();
  assert.deepEqual(s.all(), DEFAULTS);
});
test("works with no storage at all", () => {
  const s = new Settings(null);
  s.set("fov", 90);
  assert.equal(s.get("fov"), 90);
});
```

- [ ] **Step 2: Run, expect import failure** — `node --test tests/settings.test.mjs`

- [ ] **Step 3: Implement**

```js
// games/onslaught/src/core/settings.js
export const STORAGE_KEY = "onslaught.settings.v1";
export const DEFAULTS = { sensitivity: 1, fov: 80, master: 0.9, music: 1, sfx: 1, shake: 1 };
export const RANGES = {
  sensitivity: { min: 0.2, max: 3, step: 0.1 },
  fov: { min: 70, max: 110, step: 1 },
  master: { min: 0, max: 1, step: 0.05 },
  music: { min: 0, max: 1, step: 0.05 },
  sfx: { min: 0, max: 1, step: 0.05 },
  shake: { min: 0, max: 1.5, step: 0.1 },
};
const snap = (key, v) => {
  const r = RANGES[key], c = Math.min(r.max, Math.max(r.min, v));
  return +(Math.round((c - r.min) / r.step) * r.step + r.min).toFixed(4);
};
// Persisted user preferences. Presentation-only: the sim never reads these.
export class Settings {
  constructor(storage = typeof localStorage === "undefined" ? null : localStorage) {
    this.storage = storage; this.listeners = []; this.values = { ...DEFAULTS };
    let raw = null;
    try { raw = storage && storage.getItem(STORAGE_KEY); } catch { raw = null; }
    if (raw) {
      let parsed = null;
      try { parsed = JSON.parse(raw); } catch { parsed = null; }
      if (parsed && typeof parsed === "object")
        for (const k in DEFAULTS) typeof parsed[k] === "number" && Number.isFinite(parsed[k]) && (this.values[k] = snap(k, parsed[k]));
    }
  }
  all() { return { ...this.values }; }
  get(key) { return this.values[key]; }
  set(key, value) {
    if (!(key in DEFAULTS)) throw new Error(`Unknown setting: ${key}`);
    const v = snap(key, +value);
    if (v === this.values[key]) return v;
    this.values[key] = v; this._save();
    for (const fn of this.listeners) fn(key, v, this.values);
    return v;
  }
  reset() { for (const k in DEFAULTS) this.set(k, DEFAULTS[k]); }
  onChange(fn) { this.listeners.push(fn); return () => { this.listeners = this.listeners.filter((f) => f !== fn); }; }
  _save() { try { this.storage && this.storage.setItem(STORAGE_KEY, JSON.stringify(this.values)); } catch { /* quota or private mode: keep in memory */ } }
}
```

- [ ] **Step 4: Pass** — `node --test tests/settings.test.mjs` → 5 pass.
- [ ] **Step 5: Commit** — `git add games/onslaught/src/core/settings.js tests/settings.test.mjs && git commit -m "Settings store with localStorage persistence"`

---

### Task 2: RunStats in the sim — DONE (`66c3eb8`)

**Files:**
- Create: `games/onslaught/src/sim/stats.js`
- Modify: `games/onslaught/src/sim/events.js` (add `EV_PICKUP_EXPIRE`, document `EV_HIT.damage`, `EV_HURT.by`), `games/onslaught/src/sim/world.js` (own `stats`, emit expire, annotate hurt), `games/onslaught/src/sim/enemies.js` (`damage` payload gets `damage: e`; `onPlayerHit(..., o)` already passes the enemy), `tests/sim-determinism.test.mjs`
- Test: `tests/stats.test.mjs`

**Interfaces:**
- Produces: `class RunStats { reset(); record(ev, world); tick(dt, world); summary() }`; `World.stats`; events `EV_PICKUP_EXPIRE = "pickupExpire"`; `EV_HIT.damage:number`; `EV_HURT.by: "runner"|"brute"|"spitter"|"spit"`.
- Consumes: `World.emit`, `World.startRun`, `World.step`.

- [ ] **Step 1: Failing test**

```js
// tests/stats.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { RunStats } from "../games/onslaught/src/sim/stats.js";

const world = (over = {}) => ({ elapsed: 10, wave: 1, score: 0, kills: 0, player: { dead: false }, weapons: { current: 0, weapons: [{ def: { key: "ar" } }, { def: { key: "shotgun" } }, { def: { key: "dmr" } }] }, ...over });

test("counts shots, pellets, hits, headshots, damage per weapon and computes accuracy", () => {
  const s = new RunStats(), w = world();
  s.record({ type: "shot", def: { key: "ar", pellets: 1 }, index: 0 }, w);
  s.record({ type: "shot", def: { key: "ar", pellets: 1 }, index: 0 }, w);
  s.record({ type: "hit", kind: "runner", head: true, killed: true, damage: 40 }, w);
  s.record({ type: "kill", enemy: { type: "runner" }, head: true, points: 150 }, w);
  const o = s.summary();
  assert.equal(o.weapons.ar.shots, 2); assert.equal(o.weapons.ar.pellets, 2);
  assert.equal(o.weapons.ar.hits, 1); assert.equal(o.weapons.ar.headshots, 1);
  assert.equal(o.weapons.ar.kills, 1); assert.equal(o.weapons.ar.damage, 40);
  assert.equal(o.enemies.runner.killed, 1);
  assert.equal(o.accuracy, 0.5); assert.equal(o.headshotRate, 1);
  assert.equal(o.damageDealt, 40);
});
test("damage taken is attributed by kind and the killer is recorded", () => {
  const s = new RunStats(), w = world({ wave: 3, elapsed: 42.5 });
  s.record({ type: "hurt", amount: 12, by: "runner" }, w);
  s.record({ type: "hurt", amount: 14, by: "spit" }, w);
  s.record({ type: "hurt", amount: 34, by: "brute" }, w);
  s.record({ type: "dead" }, w);
  const o = s.summary();
  assert.equal(o.damageTaken, 60);
  assert.equal(o.enemies.runner.damageDealt, 12); assert.equal(o.enemies.spitter.damageDealt, 14); assert.equal(o.enemies.brute.hitsOnPlayer, 1);
  assert.deepEqual(o.killedBy, { kind: "brute", wave: 3, elapsed: 42.5 });
  assert.equal(o.result, "dead");
});
test("waves record start, clear and duration; spawns, pickups, reloads counted", () => {
  const s = new RunStats();
  s.record({ type: "waveStart", wave: 1, count: 11 }, world({ elapsed: 4 }));
  s.record({ type: "spawn", kind: "runner" }, world());
  s.record({ type: "reloadStage", stage: "start" }, world());
  s.record({ type: "reloadStage", stage: "magOut" }, world());
  s.record({ type: "pickup" }, world());
  s.record({ type: "pickupExpire" }, world());
  s.record({ type: "waveClear", wave: 1, bonus: 250 }, world({ elapsed: 30 }));
  s.record({ type: "waveStart", wave: 2, count: 17 }, world({ elapsed: 39 }));
  const o = s.summary();
  assert.deepEqual(o.waves[0], { wave: 1, count: 11, startedAt: 4, clearedAt: 30, durationS: 26 });
  assert.deepEqual(o.waves[1], { wave: 2, count: 17, startedAt: 39, clearedAt: null, durationS: null });
  assert.equal(o.enemies.runner.spawned, 1);
  assert.equal(o.weapons.ar.reloads, 1);
  assert.deepEqual(o.pickups, { collected: 1, expired: 1 });
});
test("tick accumulates elapsed and time held on the current weapon; reset zeroes", () => {
  const s = new RunStats();
  s.tick(0.5, world({ weapons: { current: 2, weapons: [{ def: { key: "ar" } }, { def: { key: "shotgun" } }, { def: { key: "dmr" } }] } }));
  assert.equal(s.summary().weapons.dmr.timeHeldS, 0.5);
  s.reset();
  assert.equal(s.summary().weapons.dmr.timeHeldS, 0);
  assert.equal(s.summary().waves.length, 0);
});
```

- [ ] **Step 2: Run, expect import failure** — `node --test tests/stats.test.mjs`

- [ ] **Step 3: Implement `sim/stats.js`**

```js
import { ENEMIES } from "../data/enemies.js";
import { WEAPONS } from "../data/weapons.js";
import { EV_DEAD, EV_HIT, EV_HURT, EV_KILL, EV_PICKUP, EV_PICKUP_EXPIRE, EV_RELOAD_STAGE, EV_SHOT, EV_SPAWN, EV_WAVE_CLEAR, EV_WAVE_START } from "./events.js";

const weaponRow = () => ({ shots: 0, pellets: 0, hits: 0, headshots: 0, kills: 0, damage: 0, reloads: 0, timeHeldS: 0 });
const enemyRow = () => ({ spawned: 0, killed: 0, damageDealt: 0, hitsOnPlayer: 0 });
const round = (x) => Math.round(x * 1000) / 1000;

// Pure per-run telemetry fed from the World event stream. Deterministic and
// headless, so a replay produces the same summary.
export class RunStats {
  constructor() { this.reset(); }
  reset() {
    this.weapons = {}; for (const w of WEAPONS) this.weapons[w.key] = weaponRow();
    this.enemies = {}; for (const k in ENEMIES) this.enemies[k] = enemyRow();
    this.waves = []; this.pickups = { collected: 0, expired: 0 };
    this.lastHurt = null; this.killedBy = null; this.dead = false; this.elapsed = 0;
  }
  _cur(world) { return this.weapons[world.weapons.weapons[world.weapons.current].def.key]; }
  tick(dt, world) { this.elapsed = world.elapsed; this._cur(world).timeHeldS += dt; }
  record(ev, world) {
    switch (ev.type) {
      case EV_SHOT: { const w = this.weapons[ev.def.key]; w.shots++; w.pellets += ev.def.pellets || 1; break; }
      case EV_HIT: { const w = this._cur(world); w.hits++; ev.head && w.headshots++; w.damage += ev.damage || 0; break; }
      case EV_KILL: { this._cur(world).kills++; const e = this.enemies[ev.enemy.type]; e && e.killed++; break; }
      case EV_SPAWN: { const e = this.enemies[ev.kind]; e && e.spawned++; break; }
      case EV_HURT: {
        const kind = ev.by === "spit" ? "spitter" : ev.by, e = this.enemies[kind];
        e && ((e.damageDealt += ev.amount), e.hitsOnPlayer++);
        this.lastHurt = { kind: ev.by, wave: world.wave, elapsed: world.elapsed }; break;
      }
      case EV_DEAD: this.dead = true; this.killedBy = this.lastHurt; break;
      case EV_RELOAD_STAGE: ev.stage === "start" && this._cur(world).reloads++; break;
      case EV_PICKUP: this.pickups.collected++; break;
      case EV_PICKUP_EXPIRE: this.pickups.expired++; break;
      case EV_WAVE_START: this.waves.push({ wave: ev.wave, count: ev.count, startedAt: world.elapsed, clearedAt: null, durationS: null }); break;
      case EV_WAVE_CLEAR: { const w = this.waves.find((x) => x.wave === ev.wave); w && ((w.clearedAt = world.elapsed), (w.durationS = round(w.clearedAt - w.startedAt))); break; }
    }
  }
  summary() {
    let pellets = 0, hits = 0, heads = 0, dealt = 0, taken = 0;
    const weapons = {};
    for (const k in this.weapons) { const w = this.weapons[k]; weapons[k] = { ...w, timeHeldS: round(w.timeHeldS), damage: round(w.damage) }; pellets += w.pellets; hits += w.hits; heads += w.headshots; dealt += w.damage; }
    for (const k in this.enemies) taken += this.enemies[k].damageDealt;
    return {
      elapsed: round(this.elapsed), result: this.dead ? "dead" : "alive", killedBy: this.killedBy,
      weapons, enemies: JSON.parse(JSON.stringify(this.enemies)), waves: this.waves.map((w) => ({ ...w })),
      pickups: { ...this.pickups }, damageDealt: round(dealt), damageTaken: round(taken),
      accuracy: pellets ? round(hits / pellets) : 0, headshotRate: hits ? round(heads / hits) : 0,
    };
  }
}
```

- [ ] **Step 4: Wire into the sim**

`sim/events.js`: add `export const EV_PICKUP_EXPIRE = "pickupExpire";` and update comments: `EV_HIT // { point, dir, head, killed, kind, damage }`, `EV_HURT // { amount, angle, by }`.

`sim/enemies.js` `damage(t, e, n, s, world)`: add `damage: e,` to the `EV_HIT` payload.

`sim/world.js`:
- import `RunStats` and `EV_HURT`, `EV_PICKUP_EXPIRE`; constructor: `(this.stats = new RunStats()), (this._hurtBy = null)`.
- `emit(type, data)`: after `data.type = type` → `this.stats.record(data, this)` then push.
- `startRun()`: add `this.stats.reset()` before `this.weapons._ammo(this)`.
- `step()`: after the systems, `this.stats.tick(dt, this)`; in the player-event forwarding loop, before push: `ev.type === EV_HURT && (ev.by = this._hurtBy)`, then `this.stats.record(ev, this)` (player events bypass `emit`).
- `onPlayerHit(t, e, n)`: first line `this._hurtBy = n ? n.type : "spit";`.
- `updatePickups`: in the removal branch, `n.life > 0 ? (…existing…) : this.emit(EV_PICKUP_EXPIRE, {})`.

`tests/sim-determinism.test.mjs`: `run()` returns `stats: w.stats.summary()`; first test adds `assert.deepEqual(a.stats, b.stats)` and `assert.ok(a.stats.weapons.ar.shots > 0)`.

- [ ] **Step 5: Pass** — `npm test` → all green, boundary OK.
- [ ] **Step 6: Commit** — `git commit -am "RunStats: deterministic per-run telemetry in the sim"` (add new files first).

---

### Task 3: FOV and shake move to presentation; settings wired to input, audio, camera — DONE (`a25c93f`)

**Files:**
- Modify: `games/onslaught/src/sim/player.js` (remove `fov`, remove `H/k/G` shake from `_euler`), `games/onslaught/src/game/game.js`, `games/onslaught/src/audio/audio.js` (`setVolumes`), `games/onslaught/src/core/input.js` (no change to API; sensitivity assigned by Game)

**Interfaces:**
- Consumes: `Settings` (Task 1).
- Produces: `Game.settings`, `Game.camFov`, `Audio.setVolumes({master, music, sfx})`, `Audio.musicVol/sfxVol`.

- [ ] **Step 1: Player** — delete `(this.fov = 80),` (constructor) and the three trailing lines computing `O`, `et`, `this.fov`; delete `z`, `U`, `H`, `k`, `G` and change the euler to `this._euler.set(this.pitch + this.recoilP + this.landDip * 0.9, this.yaw + this.recoilY, this.roll, "YXZ")`. `trauma` decay stays.

- [ ] **Step 2: Audio** — in constructor add `(this.musicVol = 1), (this.sfxVol = 1), (this.masterVol = 0.9)`; in `init()` after the gains are created call `this._applyVolumes()`; add:

```js
setVolumes({ master, music, sfx }) {
  (master !== undefined && (this.masterVol = 0.9 * master), music !== undefined && (this.musicVol = music), sfx !== undefined && (this.sfxVol = sfx), this._applyVolumes());
}
_applyVolumes() {
  if (!this.ready) return;
  ((this.master.gain.value = this.masterVol), (this.dry.gain.value = this.sfxVol), (this.revGain.gain.value = 0.55 * this.sfxVol));
}
```
and in `update()` change the music target to `a * this.musicVol`. Check the `ready` flag name in `init()` and use the same one.

- [ ] **Step 3: Game** —
  - import `Settings` from `../core/settings.js`; constructor (before `Input`): `this.settings = new Settings();` after `Input`/`Audio` exist:
  ```js
  this.camFov = this.settings.get("fov");
  const applySetting = (k, v) => {
    k === "sensitivity" && (this.input.sensitivity = v);
    (k === "master" || k === "music" || k === "sfx") && this.audio.setVolumes({ [k]: v });
  };
  for (const k in this.settings.all()) applySetting(k, this.settings.get(k));
  this.settings.onChange(applySetting);
  ```
  - `onKey`: the `[`/`]` handlers become `this.settings.set("sensitivity", this.settings.get("sensitivity") ∓ 0.1)` and hint `SENSITIVITY ${this.settings.get("sensitivity").toFixed(1)}`.
  - `presentGame`: replace `(this.camera.fov = n.fov)` with FOV + shake:
  ```js
  const base = this.settings.get("fov"),
    hip = base + n.sprintBlend * 6 + n.slideBlend * 9,
    target = MathUtils.lerp(hip, W.weapon.def.adsFov * (base / 80), n.ads);
  this.camFov = damp(this.camFov, target, 18, frameDt);
  this.camera.fov = this.camFov;
  const z = n.trauma * n.trauma * this.settings.get("shake"), U = this.time * 30;
  if (z > 0) {
    this._e.set(
      z * 0.045 * (Math.sin(U * 1.1) * 0.6 + Math.sin(U * 2.3 + 1) * 0.4),
      z * 0.045 * (Math.sin(U * 0.9 + 2) * 0.6 + Math.sin(U * 2.7) * 0.4),
      z * 0.03 * Math.sin(U * 1.7 + 0.5), "YXZ");
    this._q.setFromEuler(this._e); this.camera.quaternion.multiply(this._q);
  }
  ```
  Apply the shake before the death-tilt block so ordering matches the old euler (shake, then death tilt). `damp` is already imported from `core/mathx.js`.
  - Crosshair math already uses `this.camera.fov`; leave it.

- [ ] **Step 4: Verify** — `npm test` green (the seed-1 hash changes vs. the previous build; both runs within the build still match). Browser `?debug&god&seed=42`: `game.settings.set("fov", 110)` widens the view; `game.settings.set("shake", 0)` then `game.world.player.addTrauma(1)` → no wobble; `game.settings.set("master", 0)` silences; reload → `game.settings.all()` persisted.
- [ ] **Step 5: Commit** — `git commit -am "Settings drive sensitivity, volumes, FOV and shake; FOV and shake move to presentation"`

---

### Task 4: Settings panel UI

**Files:**
- Create: `games/onslaught/src/ui/settings-panel.js`
- Modify: `games/onslaught/index.html` (button + panel markup), `games/onslaught/src/style.css`, `games/onslaught/src/ui/hud.js` (`btnSettings`, `settings` els), `games/onslaught/src/game/game.js` (mount; Escape closes panel first)

**Interfaces:**
- Produces: `mountSettingsPanel(settings, els) → { open(), close(), isOpen() }` where `els = { panel, btnOpen, rows, btnBack, btnReset }`.
- Consumes: `Settings`, `DEFAULTS`, `RANGES`.

- [ ] **Step 1: Markup** — in `index.html` after `<button id="btn-start" …>`:

```html
<button id="btn-settings" class="btn-secondary">SETTINGS</button>
<div id="settings" class="settings hidden">
  <div class="settings-title">SETTINGS</div>
  <div id="settings-rows" class="settings-rows"></div>
  <div class="settings-actions">
    <button id="btn-settings-reset" class="btn-secondary">RESET DEFAULTS</button>
    <button id="btn-settings-back" class="btn-secondary">BACK</button>
  </div>
</div>
```

- [ ] **Step 2: Panel module**

```js
// games/onslaught/src/ui/settings-panel.js
import { DEFAULTS, RANGES } from "../core/settings.js";
const LABELS = { sensitivity: ["SENSITIVITY", (v) => v.toFixed(1)], fov: ["FIELD OF VIEW", (v) => v.toFixed(0) + "°"], master: ["MASTER VOLUME", (v) => Math.round(v * 100) + "%"], music: ["MUSIC", (v) => Math.round(v * 100) + "%"], sfx: ["EFFECTS", (v) => Math.round(v * 100) + "%"], shake: ["SCREEN SHAKE", (v) => Math.round(v * 100) + "%"] };
export function mountSettingsPanel(settings, els) {
  const inputs = {};
  for (const key in DEFAULTS) {
    const r = RANGES[key], [label, fmt] = LABELS[key], row = document.createElement("label");
    row.className = "settings-row";
    row.innerHTML = `<span class="settings-k">${label}</span><input type="range" min="${r.min}" max="${r.max}" step="${r.step}"><span class="settings-v"></span>`;
    const input = row.querySelector("input"), val = row.querySelector(".settings-v");
    const show = (v) => { input.value = String(v); val.textContent = fmt(v); };
    show(settings.get(key));
    input.addEventListener("input", () => show(settings.set(key, +input.value)));
    els.rows.appendChild(row); inputs[key] = show;
  }
  settings.onChange((k, v) => inputs[k] && inputs[k](v));
  const open = () => { els.panel.classList.remove("hidden"); els.menuMain.classList.add("hidden"); };
  const close = () => { els.panel.classList.add("hidden"); els.menuMain.classList.remove("hidden"); };
  els.btnOpen.addEventListener("click", open);
  els.btnBack.addEventListener("click", close);
  els.btnReset.addEventListener("click", () => settings.reset());
  return { open, close, isOpen: () => !els.panel.classList.contains("hidden") };
}
```
Wrap the existing `.title-kicker` … `.menu-foot` children (everything in `.menu-inner` except `#settings`) in `<div id="menu-main">` so the panel replaces the menu body instead of stacking under it.

- [ ] **Step 3: HUD + Game** — `hud.js` `el` gains `btnSettings: t("btn-settings"), settings: t("settings"), settingsRows: t("settings-rows"), settingsBack: t("btn-settings-back"), settingsReset: t("btn-settings-reset"), menuMain: t("menu-main")`. In `Game` constructor after HUD/settings exist:
```js
this.settingsPanel = mountSettingsPanel(this.settings, { panel: this.hud.el.settings, rows: this.hud.el.settingsRows, btnOpen: this.hud.el.btnSettings, btnBack: this.hud.el.settingsBack, btnReset: this.hud.el.settingsReset, menuMain: this.hud.el.menuMain });
```
`onKey`: `t === "Escape" && this.settingsPanel.isOpen() ? this.settingsPanel.close() : (existing Escape handling)`. `start()` closes the panel if open.

- [ ] **Step 4: Style** — in `style.css` after `.menu-stats`:

```css
.btn-secondary { margin-top: 10px; padding: 8px 18px; background: transparent; color: var(--paper); border: 1px solid rgba(245, 238, 225, 0.35); font: 600 14px/1 var(--font-ui); letter-spacing: 0.14em; cursor: pointer; }
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
.settings { width: min(520px, 90vw); margin: 0 auto; text-align: left; }
.settings-title { font: 900 28px/1 var(--font-title); letter-spacing: 0.06em; margin-bottom: 14px; color: var(--paper); }
.settings-row { display: grid; grid-template-columns: 150px 1fr 60px; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid rgba(245, 238, 225, 0.12); font: 600 13px/1 var(--font-ui); letter-spacing: 0.12em; color: var(--paper); }
.settings-v { text-align: right; font-variant-numeric: tabular-nums; color: var(--accent); }
.settings-row input[type="range"] { -webkit-appearance: none; appearance: none; height: 2px; background: rgba(245, 238, 225, 0.3); outline: none; }
.settings-row input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 18px; background: var(--accent); border: 0; cursor: pointer; }
.settings-row input[type="range"]::-moz-range-thumb { width: 14px; height: 18px; background: var(--accent); border: 0; border-radius: 0; cursor: pointer; }
.settings-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px; }
```
Match the color tokens to the existing `.btn-start`/`.menu-stats` rules when editing (read them first; the values above are the HUD tokens already in `:root`).

- [ ] **Step 4: Verify** — `npm run dev`, main menu → SETTINGS → sliders move values live, BACK returns, ESC closes; pause (ESC in game with `?debug`) → SETTINGS works there too; reload keeps values.
- [ ] **Step 5: Commit** — `git add -A games/onslaught && git commit -m "Settings panel on the menu and pause overlay"`

---

### Task 5: Run log, death-screen summary, downloads

**Files:**
- Create: `games/onslaught/src/core/runlog.js`, `games/onslaught/src/data/version.js`
- Modify: `games/onslaught/src/ui/hud.js` (`runSummary(record)`), `games/onslaught/index.html` (`#run-summary`, two buttons), `games/onslaught/src/style.css`, `games/onslaught/src/game/game.js`
- Test: `tests/runlog.test.mjs`

**Interfaces:**
- Produces: `RunLog { constructor(storage?, cap = 30); append(record); list(); clear() }`, `RUNS_KEY = "onslaught.runs.v1"`, `GAME_VERSION = "0.1.0"`, `hud.runSummary(record)`, `Game.lastRun`.

- [ ] **Step 1: Failing test**

```js
// tests/runlog.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import { RUNS_KEY, RunLog } from "../games/onslaught/src/core/runlog.js";
const mem = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: (k) => m.delete(k) }; };
test("append keeps the newest `cap` records, newest first, and persists", () => {
  const st = mem(), log = new RunLog(st, 3);
  for (let i = 1; i <= 5; i++) log.append({ seed: i });
  assert.deepEqual(log.list().map((r) => r.seed), [5, 4, 3]);
  assert.deepEqual(new RunLog(st, 3).list().map((r) => r.seed), [5, 4, 3]);
  assert.ok(st.getItem(RUNS_KEY));
  log.clear(); assert.deepEqual(log.list(), []);
});
test("tolerates corrupt storage and missing storage", () => {
  const st = mem(); st.setItem(RUNS_KEY, "[");
  assert.deepEqual(new RunLog(st).list(), []);
  const log = new RunLog(null); log.append({ seed: 1 }); assert.equal(log.list().length, 1);
});
```

- [ ] **Step 2: Implement**

```js
// games/onslaught/src/core/runlog.js
export const RUNS_KEY = "onslaught.runs.v1";
// Local history of finished runs so balance decisions can use many runs.
export class RunLog {
  constructor(storage = typeof localStorage === "undefined" ? null : localStorage, cap = 30) {
    this.storage = storage; this.cap = cap; this.records = [];
    try { const raw = storage && storage.getItem(RUNS_KEY); const p = raw && JSON.parse(raw); Array.isArray(p) && (this.records = p); } catch { this.records = []; }
  }
  list() { return this.records.slice(); }
  append(record) { this.records.unshift(record); this.records.length > this.cap && (this.records.length = this.cap); this._save(); }
  clear() { this.records = []; this._save(); }
  _save() { try { this.storage && this.storage.setItem(RUNS_KEY, JSON.stringify(this.records)); } catch { /* quota: keep in memory */ } }
}
```
`data/version.js`: `export const GAME_VERSION = "0.1.0";`

- [ ] **Step 3: Markup + HUD** — in `index.html` inside `#menu-main` after `#menu-stats`:
```html
<div id="run-summary" class="run-summary hidden"></div>
<div id="run-actions" class="run-actions hidden">
  <button id="btn-dl-run" class="btn-secondary">DOWNLOAD RUN LOG</button>
  <button id="btn-dl-all" class="btn-secondary">DOWNLOAD ALL RUNS</button>
</div>
```
`hud.js`: add els `runSummary: t("run-summary"), runActions: t("run-actions"), btnDlRun: t("btn-dl-run"), btnDlAll: t("btn-dl-all")`; `showMenu` hides `runSummary`/`runActions` unless `runSummary(record)` was called for this menu; add:
```js
runSummary(record) {
  const s = record.summary, pct = (x) => Math.round(x * 100) + "%", secs = (x) => x == null ? "—" : x.toFixed(0) + "s";
  const weapons = Object.entries(s.weapons).filter(([, w]) => w.shots > 0).map(([k, w]) => `<tr><td>${k.toUpperCase()}</td><td>${pct(w.pellets ? w.hits / w.pellets : 0)}</td><td>${w.kills}</td><td>${secs(w.timeHeldS)}</td></tr>`).join("");
  const enemies = Object.entries(s.enemies).filter(([, e]) => e.spawned > 0).map(([k, e]) => `<tr><td>${k.toUpperCase()}</td><td>${e.killed}/${e.spawned}</td><td>${Math.round(e.damageDealt)}</td></tr>`).join("");
  const waves = s.waves.map((w) => `<tr><td>W${w.wave}</td><td>${w.count}</td><td>${secs(w.durationS)}</td></tr>`).join("");
  this.el.runSummary.innerHTML = `
    <div class="rs-head">ACCURACY ${pct(s.accuracy)} · HEADSHOTS ${pct(s.headshotRate)} · DAMAGE TAKEN ${Math.round(s.damageTaken)}${s.killedBy ? ` · KILLED BY ${s.killedBy.kind.toUpperCase()}` : ""}</div>
    <div class="rs-grid">
      <table><thead><tr><th>WEAPON</th><th>ACC</th><th>KILLS</th><th>HELD</th></tr></thead><tbody>${weapons}</tbody></table>
      <table><thead><tr><th>HOSTILE</th><th>KILLED</th><th>DMG TO YOU</th></tr></thead><tbody>${enemies}</tbody></table>
      <table><thead><tr><th>WAVE</th><th>COUNT</th><th>TIME</th></tr></thead><tbody>${waves}</tbody></table>
    </div>`;
  this.el.runSummary.classList.remove("hidden"); this.el.runActions.classList.remove("hidden");
}
```
In `showMenu`, at the top: `this.el.runSummary.classList.add("hidden"); this.el.runActions.classList.add("hidden");` (the `over` transition calls `showMenu` then `runSummary`).

- [ ] **Step 4: Game** — imports `RunLog`, `GAME_VERSION`; constructor `this.runLog = new RunLog(); this.lastRun = null; this.runStartedAt = null;` `start()` (fresh run branch) sets `this.runStartedAt = new Date().toISOString()`. In `handleEvent` `EV_DEAD` → `onDeath()` additionally:
```js
this.lastRun = { v: 1, game: GAME_VERSION, seed: this.seed, startedAt: this.runStartedAt, endedAt: new Date().toISOString(), settings: this.settings.all(), summary: { ...this.world.stats.summary(), wave: this.world.wave, score: this.world.score, kills: this.world.kills } };
this.runLog.append(this.lastRun);
```
In `stepGame`'s `over` transition after `hud.showMenu(...)`: `this.lastRun && this.hud.runSummary(this.lastRun)`. Wire buttons in the constructor:
```js
const download = (name, data) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };
const stamp = () => new Date().toISOString().replace(/[-:]/g, "").slice(0, 13);
this.hud.el.btnDlRun.addEventListener("click", () => this.lastRun && download(`run-${this.seed}-${stamp()}.json`, this.lastRun));
this.hud.el.btnDlAll.addEventListener("click", () => download(`runs-${stamp()}.json`, this.runLog.list()));
```
Remove the old `menu-stats` line-based death text? Keep it (wave/kills/score/time/seed headline) — `runSummary` adds the detail below.

- [ ] **Step 5: Style**
```css
.run-summary { margin-top: 14px; font: 500 12px/1.5 var(--font-ui); letter-spacing: 0.08em; color: var(--paper); text-align: left; width: min(720px, 92vw); }
.rs-head { color: var(--accent); margin-bottom: 8px; }
.rs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.rs-grid table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
.rs-grid th { text-align: left; font-weight: 700; color: rgba(245, 238, 225, 0.6); border-bottom: 1px solid rgba(245, 238, 225, 0.25); padding: 2px 4px; }
.rs-grid td { padding: 2px 4px; border-bottom: 1px solid rgba(245, 238, 225, 0.1); }
.run-actions { display: flex; gap: 10px; justify-content: center; }
```

- [ ] **Step 6: Verify** — `npm test` green. Browser `?debug&seed=42` (no god): die; death screen shows headline + three tables; DOWNLOAD RUN LOG saves valid JSON with `summary.weapons.ar.shots > 0`; `JSON.parse(localStorage["onslaught.runs.v1"]).length` grows per run; REDEPLOY hides the summary.
- [ ] **Step 7: Commit** — `git add -A games/onslaught tests && git commit -m "Run log: death-screen telemetry summary, JSON download, local run history"`

---

### Task 6: Docs

**Files:**
- Modify: `README.md` (Onslaught dev workspace section)

- [ ] **Step 1:** Add under the flags bullet: `- Settings (sensitivity, FOV, volumes, shake) persist in \`localStorage["onslaught.settings.v1"]\`; finished runs accumulate in \`onslaught.runs.v1\` (last 30) and can be downloaded from the death screen for balance analysis.`
- [ ] **Step 2:** `git commit -am "Document settings persistence and run logs"`

---

## Self-review

- Spec §1 → Task 2; §2 → Task 5; §3 → Tasks 1, 3; §4 → Task 4; §5 files all appear; §6 tests → Tasks 1, 2, 5 + browser steps in 3, 4, 5.
- Names used consistently: `Settings.get/set/all/onChange/reset`, `RunStats.record/tick/summary/reset`, `World.stats`, `EV_PICKUP_EXPIRE`, `EV_HURT.by`, `EV_HIT.damage`, `Audio.setVolumes`, `hud.runSummary`, `mountSettingsPanel(settings, els)`, `RunLog.append/list/clear`, `GAME_VERSION`.
- Hash note: Task 3 changes the seed-1 hash relative to Phase 0 builds (shake removed from `camQuat` → fire origin/direction differ). Tests compare within a build, so this is expected and not a determinism regression.
