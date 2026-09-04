# Phase 1, slice 1 — Run telemetry + persisted settings

Date: 2026-09-04
Scope: `games/onslaught/`. Phase 1 is "nail the core loop": tune from playtest data, remove friction. This slice builds the instruments; balance changes come in later slices once runs have been recorded.

## Goal

After a run dies, the player sees what happened (per-weapon accuracy, what killed them, how long each wave took) and can download the run as JSON. Runs also accumulate locally so balance decisions can be made from many runs, not memory. Sensitivity, FOV, volumes and screen-shake persist across sessions and are editable from a settings panel on the menu.

No gameplay tuning in this slice. The one intentional gameplay-adjacent change is that camera shake no longer perturbs the aim ray (see §3).

## 1. Run statistics (`sim/stats.js`)

`RunStats` is a pure recorder owned by `World`. It is fed from the same event stream the presentation consumes, so it needs no new hooks in the systems and it runs headless.

```js
class RunStats {
  constructor()                 // zeroed
  reset()                       // called by World.startRun()
  record(ev, world)             // called by World.emit() for every event
  tick(dt, world)               // per step: elapsed, time-in-ADS, wave duration
  summary()                     // plain JSON-able object, see below
}
```

`summary()`:

```js
{
  elapsed, wave, score, kills, result: "dead" | "alive",
  killedBy: { kind, wave, elapsed } | null,
  weapons: { ar: { shots, pellets, hits, headshots, kills, damage, reloads, timeHeldS }, shotgun: {…}, dmr: {…} },
  enemies: { runner: { spawned, killed, damageDealt, hitsOnPlayer }, brute: {…}, spitter: {…} },
  waves: [{ wave, count, startedAt, clearedAt | null, durationS | null, deathsNear: … }],  // one per started wave
  pickups: { spawned, collected, expired },
  damageTaken, damageDealt, accuracy /* hits / pellets */, headshotRate
}
```

Event → stat mapping: `shot` → shots++, pellets += def.pellets, timeHeld tracked by `weapons.current`; `hit` → hits++ (+headshots), damage from `EV_HIT.damage` (added to the payload); `kill` → kills per weapon (current weapon) and per enemy kind; `hurt` → damageTaken and per-kind `damageDealt` (payload gains `by: kind`); `dead` → killedBy from the last `hurt`; `spawn` → spawned per kind; `waveStart`/`waveClear` → waves timeline; `reloadStage: start` → reloads; `pickup` → collected, expiry tracked in `World.updatePickups` via a new `pickupExpire` event.

Payload additions in the sim: `EV_HIT.damage`, `EV_HURT.by` (enemy kind or `"spit"`), new `EV_PICKUP_EXPIRE`.

`World.hash()` is unchanged. The determinism test additionally asserts that `stats.summary()` is identical across two runs of the same seed.

## 2. Run log (presentation)

On `EV_DEAD`, `Game` builds a run record:

```js
{ v: 1, game: GAME_VERSION, seed, startedAt: ISO, settings: {…}, summary: world.stats.summary() }
```

- Death screen (`hud.showMenu` on state `over`) gets a compact stats block rendered by `hud.runSummary(record)`: headline (wave, kills, score, time, seed), per-weapon rows (accuracy %, kills), per-enemy rows (damage dealt to you), killer, wave durations. HUD style, monospace numbers.
- A `DOWNLOAD RUN LOG` button on the death screen saves `run-<seed>-<yyyymmdd-hhmm>.json` via a Blob URL.
- The last 30 records are kept in `localStorage["onslaught.runs.v1"]` (`core/runlog.js`: `append(record)`, `list()`, `clear()`, capped, tolerant of quota errors). A `DOWNLOAD ALL RUNS` button on the death screen exports the array. Nothing reads the history in-game yet; it exists so balance work has a dataset.

`GAME_VERSION` lives in `data/version.js` and is bumped by hand.

## 3. Settings (`core/settings.js`)

```js
export const DEFAULTS = { sensitivity: 1, fov: 80, master: 0.9, music: 1, sfx: 1, shake: 1 };
export class Settings {
  constructor(storage = localStorage)   // injectable for tests
  get(key) / set(key, value)            // clamps to RANGES, saves, notifies
  onChange(fn)                          // fn(key, value, all)
  reset()
}
```

Persisted at `localStorage["onslaught.settings.v1"]`. Unknown keys ignored, missing keys defaulted, parse errors → defaults.

Ranges: sensitivity 0.2–3 (step 0.1), fov 70–110 (step 1), master/music/sfx 0–1 (step 0.05), shake 0–1.5 (step 0.1).

Consumers (all presentation-side; the sim never reads settings):

- **sensitivity** → `Input.sensitivity`. `[`/`]` hotkeys now write through `settings.set` so the panel and the hotkeys stay in sync.
- **fov** → camera FOV is moved out of the sim. `Player` stops owning `fov`; `Game.presentGame` computes `base + sprintBlend*6 + slideBlend*9`, lerps toward `weapons.weapon.def.adsFov * (base/80)` by `player.ads`, and damps at 18/s with `frameDt`. `Player.applyLook` keeps its `adsFov/80` sensitivity scale (that is aim behaviour, not FOV). ADS FOV scales with base FOV so a 110-FOV player still gets the same relative zoom.
- **shake** → the trauma shake (`H`, `k`, `G` in `Player.update`) is removed from `camQuat`. `Player.trauma` stays in the sim (it still drives knockback feel via `addTrauma` callers and postfx CA). `Game.presentGame` computes the same three sinusoids from `player.trauma` and `this.time`, scales by `settings.shake`, and multiplies the interpolated camera quaternion. Consequence: the fire ray no longer wobbles with trauma. Recoil (`recoilP/recoilY`) stays in the sim and still affects aim.
- **master / music / sfx** → `Audio.setVolumes({ master, music, sfx })`: `master.gain = 0.9*master`; music and SFX get a scalar the existing code multiplies in — `musicBus` target in `update()` becomes `a * this.musicVol`; `dry.gain = this.sfxVol`, `revGain.gain = 0.55 * this.sfxVol`. `M` still toggles `musicOn`.

## 4. Settings panel (UI)

A `SETTINGS` button under `DEPLOY`/`RESUME` on the shared `#menu` overlay (so it is reachable from the main menu and pause). It toggles `#settings`, a panel inside `.menu-inner` with six labelled `<input type="range">` rows and the live value, plus `RESET DEFAULTS` and `BACK`. Rows apply immediately on `input`. Styled with the existing HUD tokens (`--paper`, `--accent`, `--font-ui`); the range thumb is a square accent block to match the brutalist HUD. `Escape` while the panel is open closes the panel instead of resuming.

`ui/settings-panel.js` owns the DOM: `mountSettingsPanel(settings, hud)`; it reads `DEFAULTS`/ranges from `core/settings.js` so adding a setting is one table entry.

## 5. Files

- New: `sim/stats.js`, `core/settings.js`, `core/runlog.js`, `ui/settings-panel.js`, `data/version.js`, `tests/stats.test.mjs`, `tests/settings.test.mjs`
- Modified: `sim/world.js` (owns `stats`, `EV_PICKUP_EXPIRE`, `EV_HURT.by`), `sim/enemies.js` + `sim/projectiles.js` (pass `by`), `sim/weapons.js`/`world.fireRay` (`EV_HIT.damage`), `sim/player.js` (drop fov + shake from camera), `sim/events.js`, `game/game.js` (settings wiring, fov/shake in presentation, run record, death screen), `ui/hud.js` (`runSummary`), `index.html`, `style.css`, `audio/audio.js` (`setVolumes`), `core/input.js` (sensitivity from settings), `tests/sim-determinism.test.mjs` (stats equality), `README.md` (settings + run log notes)

## 6. Testing

- `tests/stats.test.mjs`: feed a scripted event sequence, assert counts, accuracy, killer, wave durations; `reset()` zeroes.
- `tests/settings.test.mjs`: in-memory storage; defaults, clamping, persistence round-trip, corrupt JSON → defaults, unknown keys ignored.
- Determinism test: `summary()` equal across two seed-1 runs; the shake change must not alter the hash between the two runs of the same build (it will change the hash vs. the previous build — expected, tests compare within a build).
- Browser: play to death with `?debug&seed=42`; death screen shows the stats block; both download buttons produce valid JSON; reload → settings persist; FOV slider visibly changes the view; shake 0 → no camera wobble on brute slam while recoil still kicks; volume sliders audible.

## Out of scope

Balance changes, telemetry overlay while playing, controller support, pause-menu redesign beyond the settings button, reading run history in-game, cloud upload of logs.
