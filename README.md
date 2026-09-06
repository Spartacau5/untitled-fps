# Untitled Arena

## Credits

The base game is **Onslaught** by [alesha-pro](https://github.com/alesha-pro), originally generated with Fable 5.1, from [github.com/alesha-pro/bench-portal](https://github.com/alesha-pro/bench-portal).

This repo is a fork of that catalog, stripped down to a single game. I am building on top of Onslaught; I did not write the original arena FPS.

---

Browser arena FPS. Placeholder title **UNTITLED ARENA**. Horde waves in a Times Square-inspired ring, eight guns, sprint / slide / ADS, and a top-5 all-time leaderboard.

Live: [untitled-fps.vercel.app](https://untitled-fps.vercel.app)

`games/onslaught-fable-5.1/` is a frozen copy of the original one-shot build, kept for before/after comparison. It is not part of the production build — open that folder on its own if you want the pristine version.

## Local development

```bash
npm install
npm run dev
```

Vite serves the game at [http://localhost:5173](http://localhost:5173). Query flags:

- `?debug` — auto-start, skip pointer lock, lil-gui grade panel
- `?god` — no damage
- `?nospawn` — empty arena
- `?seed=<n>` — replay a specific run

Settings (sensitivity, FOV, volumes, shake) persist in `localStorage["onslaught.settings.v1"]`; finished runs accumulate in `onslaught.runs.v1` (last 30) and can be downloaded from the death screen for balance analysis. XP, level and the chosen loadout live in `onslaught.profile.v1`.

Other commands:

```bash
npm test              # lint, sim/view boundary check, unit tests
npm run build         # Vite → dist/ (game at /)
npm run serve         # python http.server on dist/ at :4176
```

The leaderboard API is the same locally as in production: Vite proxies `/api/leaderboard` during `npm run dev`. Local scores write to `.data/leaderboard.json`.

## Architecture

`games/onslaught/src/` is split so the simulation can run headless in Node:

| Path | Role |
| --- | --- |
| `sim/` | Pure game step. Arena, player, weapons, enemies, projectiles, stats. No DOM, WebGL, audio, or theme. |
| `data/` | Tuning tables (weapons, enemies, waves). Same rules as `sim/`. |
| `core/` | RNG, fixed-step loop, input, settings store. Math-only Three.js types allowed. |
| `render/` `ui/` `audio/` `theme/` | Presentation. The `Game` shell ticks the world and plays back the event stream. |

Advance the world with `World.step(dt, inputFrame)`. Side effects come out as events (`EV_HIT`, `EV_KILL`, …). `World.hash()` plus `tests/sim-determinism.test.mjs` lock a seeded run.

`scripts/check-sim-boundary.mjs` (via `npm run check:boundary` / `npm test`) fails the build if `sim/`, `data/`, or `core/` import presentation code, browser globals, or `Math.random`. Settings live in presentation so they cannot change what a seed produces.

## Armory and progression

You carry one **primary** and one **sidearm**, bound to keys 1 and 2. ARMORY on
the menu picks them; the choice persists and is recorded on the run.

| Slot | Guns |
| --- | --- |
| Primary | VK-7 assault rifle, Hammer-12 shotgun, Longshot DMR, Overwatch LMG, Meridian sniper, Cinder-6 incinerator |
| Sidearm | Sidewinder 9 pistol, Wasp-9 SMG |

Every gun is `unlockLevel: 0` in `src/data/weapons.js` — free right now. Runs pay
XP (`src/core/progression.js`) and levels are shown in the armory; raising a
gun's `unlockLevel` turns the gate on without touching the screen.

Weapons are data plus a viewmodel: an entry in `src/data/weapons.js` and a
builder in `src/render/weapons/` registered in that folder's `index.js`. Guns
that fire a stream rather than a ray set `fire: "cone"` and are resolved by
`World.fireCone`.

## Billboards

`src/render/city/ads.js` is the one file to edit for the signage: the campaign
list, the tower stack, shop names and the news ticker, with the format
documented at the top. Panels can carry a `motion` (`pulse`, `sweep`,
`flicker`, `scroll`) driven by `src/render/shaders/led.js`.

To use your own artwork, drop a PNG or JPG in `games/onslaught/public/ads/` and
point a campaign's `image` at it (e.g. `"ads/my-poster.png"`). The folder ships
empty; a missing file falls back to the drawn board.

## Seeded runs and leaderboard

Every match starts from an integer seed (`?seed=` or the clock). The same seed replays the same layout, spawns, and combat stream.

On death the client POSTs `{ name, score, kills, wave, elapsed, seed }` to `/api/leaderboard`. GET returns the top 5 by score, then kills. The store keeps 50 runs; the menu shows five.

- **Local / Vite:** file backend at `.data/leaderboard.json`
- **Vercel:** Redis when the env vars below are set, otherwise the function has no durable store

Callsign is typed in `#player-name` on the menu. The board renders in `#leaderboard`.

## Player feedback

Intro, pause, and death share one menu. **PROVIDE FEEDBACK** opens a panel (optional name, long message) and `POST`s to `/api/feedback`.

- **Local / Vite:** `.data/feedback.json`. `GET /api/feedback` lists notes (newest first).
- **Vercel:** same Redis as the leaderboard. `GET` requires `FEEDBACK_ADMIN_TOKEN` (header `x-feedback-token` or `Authorization: Bearer …`).

```bash
curl -s https://untitled-fps.vercel.app/api/feedback -H "x-feedback-token: $FEEDBACK_ADMIN_TOKEN"
```

Add `FEEDBACK_ADMIN_TOKEN` in the Vercel project env (any long secret). Without it, production GET stays locked so the inbox is not public.

## Leaderboard env vars (Upstash Redis)

On Vercel, connect an Upstash Redis / KV store to the project so production persists the board. Either pair works:

| URL | Token |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | `UPSTASH_REDIS_REST_TOKEN` |
| `KV_REST_API_URL` | `KV_REST_API_TOKEN` |

Redeploy after connecting so the function sees the vars. Local play does not need Redis.

Production layout: static game at `/`, API at `/api/leaderboard` (`api/leaderboard.js`).
