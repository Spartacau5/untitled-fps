# Handoff — resume Phase 1 slice 1 at Task 4

**For Fable 5.1.** Read this first. Do not redesign. Do not restart Phase 0 or Phase 1 slice 1. Do not retune combat. Implement the remaining plan tasks exactly.

**Paste-this prompt**

> Continue Phase 1 slice 1 of untitled-fps from Task 4. Spec: `docs/superpowers/specs/2026-09-04-phase1-slice1-telemetry-settings-design.md`. Plan: `docs/superpowers/plans/2026-09-04-phase1-slice1-telemetry-settings.md`. Handoff: `docs/superpowers/handoffs/2026-09-04-fable51-resume.md`. Tasks 1–3 are committed. Start at Task 4 (settings panel), then Task 5 (run log / death screen), then Task 6 (README). Do not change balance values. Do not import presentation into `sim/`. Origin is `https://github.com/Spartacau5/untitled-fps.git` — never push to `upstream` (Alesha’s bench-portal). The menu already has CALLSIGN (`#player-name`) and TOP OPERATORS (`#leaderboard`) plus `/api/leaderboard` — keep those when adding SETTINGS.

---

## Where we are

| Item | State |
| --- | --- |
| Phase 0 (own the codebase, sim/view split, theme, Vite, determinism) | **Done** |
| Phase 1 slice 1 spec + plan | **Done and committed** |
| Task 1 Settings store | **Done** `4d335f7` |
| Task 2 RunStats in the sim | **Done** `66c3eb8` |
| Task 3 FOV/shake → presentation; settings wired | **Done** `a25c93f` (browser verify of Task 3 was interrupted — re-check while doing Task 4) |
| Task 4 Settings panel UI | **Not started — start here** |
| Leaderboard + Vercel deploy (outside Fable slice) | **Shipped** — keep `#player-name`, `#leaderboard`, `api/leaderboard.js` |
| Task 5 Run log, death-screen summary, downloads | **Not started** |
| Task 6 README | **Not started** |
| HEAD | `a25c93f` on local branch `phase0-own-the-codebase`, tracking `origin/main` |
| Working tree | Clean at handoff write-time |

Dev: `npm run dev` from repo root (Vite for `games/onslaught`, often port 5173). Tests: `npm test` (lint + sim boundary + `tests/**/*.test.mjs`).

---

## Repo (do not get this wrong)

This clone used to be Alesha Pro’s [alesha-pro/bench-portal](https://github.com/alesha-pro/bench-portal). **It is no longer the push target.**

- `origin` → `https://github.com/Spartacau5/untitled-fps.git` (owner: Arpit / Spartacau5). **Push here.**
- `upstream` → `https://github.com/alesha-pro/bench-portal.git` **fetch only**. Push URL is `DISABLE`. Never push there. Never open PRs against Alesha unless the user asks.

Local branch name is still `phase0-own-the-codebase`; GitHub `main` already has this history. Keep committing on the current branch (it tracks `origin/main`).

---

## What the project is

A fork of Onslaught inside `games/onslaught/`. Goal: nail **single-player** first, multiplayer later. Placeholder title **UNTITLED ARENA**. Visual identity: **Sunbaked Brutalist** (`theme/theme.js`, Barlow Condensed + Big Shoulders Stencil Text). Owner is building this for a daily social series; it must not look like the original repo.

Architecture: `sim/` is math-only (no DOM/WebGL/audio/theme/settings). `Game` is the presentation shell. Fixed 60 Hz tick, seeded RNG, `World.hash()` + `tests/sim-determinism.test.mjs`. Boundary: `npm run check:boundary`.

We are **not** developing the other portal games.

---

## Phase 1 slice 1 — decisions already locked

Do not re-brainstorm these.

- Run length: **unknown** until we have data. No wave-curve / Behemoth / pickup-rate tuning in this slice.
- Telemetry shape: **death-screen summary + downloadable per-run JSON**, plus last 30 runs in localStorage. No live overlay.
- This slice’s player-facing friction: **persisted settings** (sensitivity, FOV, master/music/sfx, shake). Not a pause-menu redesign beyond a SETTINGS button. Death-screen stats are part of telemetry (Task 5), not a separate product.
- Settings UI: **SETTINGS panel** on the shared `#menu` overlay (main menu and pause), HUD-style sliders. Not hotkeys-only, not lil-gui.
- Shake does **not** rotate the sim camera / fire ray. Recoil still does. Trauma stays in the sim for postfx; `Game.presentGame` applies visual shake × `settings.shake`.
- Game name stays a placeholder.

Spec: `docs/superpowers/specs/2026-09-04-phase1-slice1-telemetry-settings-design.md`

Plan: `docs/superpowers/plans/2026-09-04-phase1-slice1-telemetry-settings.md`

---

## What Tasks 1–3 already shipped (do not redo)

**Task 1** — `games/onslaught/src/core/settings.js`, `tests/settings.test.mjs`

- `DEFAULTS` / `RANGES` / `STORAGE_KEY = "onslaught.settings.v1"`
- `Settings`: `get` `set` `all` `onChange` `reset`, injectable storage, clamp+snap, corrupt JSON → defaults

**Task 2** — `games/onslaught/src/sim/stats.js`, wired in `world.js`

- `World.stats` is a `RunStats`; `emit()` records; player events (hurt/dead/land/…) bypass `emit` and are recorded in `step()`
- `EV_HIT.damage`, `EV_HURT.by` (`enemy.type` or `"spit"`), `EV_PICKUP_EXPIRE`
- `onPlayerHit` sets `this._hurtBy` before `player.damage`
- Tests: `tests/stats.test.mjs`; determinism test asserts `stats.summary()` equal across two seed-1 runs

**Task 3** — presentation consumes settings

- `Game._bindSettings()` creates `Settings`, sets `camFov`, pushes sensitivity → `Input`, volumes → `Audio.setVolumes`
- `[` `]` write `settings.set("sensitivity", …)`
- `Player` no longer owns `fov`; trauma sinusoids removed from `camQuat`
- `presentGame`: FOV from `settings.fov` + sprint/slide + ADS (`adsFov * (base/80)`), damped; shake from `player.trauma` × `settings.shake` multiplied onto camera quaternion **before** death tilt
- `Audio.setVolumes({ master, music, sfx })`: `master.gain = 0.9 * master`; music target `a * musicVol`; dry/revGain scaled by sfx

**Not verified in browser** (session was paused): live FOV slider feel, shake 0 vs recoil, volume sliders, localStorage round-trip after reload. Verify while building Task 4.

---

## Task 4 — do this next

Settings panel on the menu. Plan section **Task 4** has the markup, `mountSettingsPanel`, CSS tokens, Escape-closes-panel-first behavior.

Intended files:

- Create `games/onslaught/src/ui/settings-panel.js`
- Modify `index.html` (wrap menu body in `#menu-main`, add SETTINGS button + `#settings` panel)
- Modify `style.css`, `ui/hud.js`, `game/game.js`

`els` for `mountSettingsPanel(settings, els)`: `panel`, `rows`, `btnOpen`, `btnBack`, `btnReset`, `menuMain`.

Hotkeys `[` `]` already persist via Task 3; the panel must stay in sync through `settings.onChange`.

---

## Task 5 after that

`core/runlog.js` (`onslaught.runs.v1`, cap 30), `data/version.js` (`GAME_VERSION = "0.1.0"`), `hud.runSummary(record)`, death-screen DOWNLOAD RUN LOG / DOWNLOAD ALL RUNS, `Game.lastRun` built on `EV_DEAD`. Tests: `tests/runlog.test.mjs`. Keep the existing menu-stats headline (wave/kills/score/time/seed); the three tables go below.

---

## Task 6

README note: settings persist in `onslaught.settings.v1`; runs in `onslaught.runs.v1`.

---

## Constraints the next session must keep

- `sim/` never reads settings and never imports render/ui/audio/theme.
- No balance number changes.
- Enemy kind on events is `kind` / `by`, never `type` (`World.emit` overwrites `type`).
- Commit after each task; `npm test` before commit; no `Co-authored-by` trailers.
- Follow executing-plans / the written Task 4–6 steps. Do not invent a new settings UX.

---

## Later (not this slice)

Do **not** implement these while finishing slice 1 Tasks 4–6.

Phase 1 after slice 1: pause-menu polish, richer death UX if still needed, then **balance from the JSON logs** (wave curve, Behemoth, spitters, 9s break, pickups), then threat readability. Phases 2+ (feel, content, netcode) wait until the loop is fun.

### Gameplay tweaks (parked — do not ship in Tasks 4–6)

**Spitters must shoot more / feel ruthless.** Right now ranged hostiles do not pressure enough. Spitter `cooldown` is **2.4s** in `data/enemies.js`, then multiplied by `rng.range(0.8, 1.25)` after each spit (~1.9–3.0s between shots) plus **0.5s windup**. They only start an attack if `cooldown <= 0` and distance `< 28`; they orbit at `standoff: 14`. Intent: raise fire rate (and/or shorten windup / loosen the 28m gate) so standing still is punished. Exact numbers wait for playtests + run logs — do not invent a new rate in the settings/telemetry slice. File: `games/onslaught/src/data/enemies.js` (`spitter.cooldown`, `windup`) and `sim/enemies.js` (ranged attack gate).

### Wishlist — grenade power-up (discussed 2026-09-04, not a spec)

**Pitch:** Throwable grenade with splash damage. First real power-up; current pickups are ammo only.

**Already in the game:** `World.streak` (1.8s window, score multiplier, HUD every 3 kills). Ammo crate on brute kill or `waveRng.chance(0.13)`. No explosives, no equipment slot, no `G` bind.

**Earn (leaning: hybrid):** streak is the reliable grant (every N kills in the existing streak window → 1 nade). Rare world crate is the bailout so a sloppy run still sees the toy. Do not replace ammo crates.

**Hold (leaning: max 1):** earning another while you already have one is wasted (or only refreshes). Panic button, not a stockpile.

**Still unresolved:** N and crate rate; cook vs instant fuse; throw bind (`G`); self-damage; splash vs brutes.

**Build with Fable 5.1 after slice 1.** Write a real spec when that slice starts. Do not invent numbers or ship this during Tasks 4–6.

---

## Session log (2026-09-04)

1. User asked to start Phase 1. Brainstormed: run length unknown → instrument first; death summary + JSON log; settings only for friction; SETTINGS panel (not lil-gui).
2. Spec committed `a386f7e`. Plan committed `c289ad2`.
3. Implemented Tasks 1–3; paused before Task 4 so a model switch would not redesign the panel.
4. User asked whether we were committing to Alesha’s GitHub. We were not (local only). User created `Spartacau5/untitled-fps`. Remotes retargeted; current history pushed to **origin/main**.
5. This handoff written so Fable 5.1 resumes at Task 4.
