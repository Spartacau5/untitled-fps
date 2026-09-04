# Phase 0 — Own the codebase (refactor + retheme)

Date: 2026-09-04
Scope: `games/onslaught/` (fork of `onslaught-fable-5.1`). The original stays untouched as a benchmark entry.

## Goal

Turn the shipped minified Vite bundle into a codebase we can build on for years, and give it a visual identity that is ours. Phase 0 changes no gameplay rules. Its acceptance test is: the game plays the same, the code is modular and readable, the simulation runs headless and deterministically, and the game looks like a different game.

Two of these choices exist purely to keep the multiplayer door open (Phases 4–5): a fixed-tick simulation with no rendering dependencies, and seeded randomness. They are cheap now and expensive later.

## Starting point

`src/main.js` is 28.9k lines. Lines 1–~23,826 are inlined Three.js **r170** (`REVISION = "170"`, includes `PMREMGenerator` and `RoundedBoxGeometry` from `three/addons` as `ks extends te`). The game is lines ~23,827–28,918 with minified identifiers. Class map (current name → role):

| Lines | Name | Role |
| --- | --- | --- |
| 22451 | `h0` | Input (pointer lock, keys, mouse deltas) |
| 22570 | `f0` | Audio (fully synthesized WebAudio: guns, impacts, music, spatial) |
| 23827 | `Nn` | GLSL noise library string |
| 23853 | `p0` | mulberry32 seeded RNG (used only by arena layout, seed 1337) |
| 23863 | `As` | Oriented box collider |
| 23885 | `m0` | Arena: materials, geometry build, gates, `groundHeight`, `resolveCircle`, `floorAt`, `raycast` |
| 24430 | `g0` | Sky shader (horizon/zenith/fog, nebula, stars, moon, aurora) |
| 24575–24722 | `Zo`, `x0`, `M0` | GPU particle buffers, shockwave rings, ParticleSystem |
| 25262 | `y0` | Tracers |
| 25356 | `S0` | Decals |
| 25451 | `E0` | Shell casings |
| 25543–25613 | `w0`, `T0`, `b0`, `A0` | Bloom down/up shaders, composite shader, PostFX pipeline |
| 25744 | `R0` | Player: movement, sprint/slide/crouch, camera, health, recoil springs |
| 26037–26399 | `tt`, `C0`, `P0`, `L0`, `D0`, `I0` | Viewmodel materials, gun mesh builders (AR/shotgun/DMR), MuzzleFlash |
| 26503 | `N0` | Weapon definition table (3 weapons) |
| 26686 | `z0` | Per-weapon runtime state (mag, reserve, cooldown, reload, bloom) |
| 26726 | `O0` | Weapons: fire/reload/ADS/switch logic **and** viewmodel animation |
| 27250 | `Ar` | Enemy definition table (runner/brute/spitter) |
| 27368, 27534 | `k0`, `Rr` | Enemy rig builder, enemy material with flash/dissolve shader |
| 27627 | `G0` | Enemies: spawn/AI/attack/projectiles/raycast/damage **and** instanced rendering |
| 28175 | `W0` | HUD (DOM) |
| 28355 | `X0` | Game: orchestration, waves, score, pickups, postfx driving, loop |

Everything is procedural: no textures, no models, no audio files. Look = palette + sky + post grade + fonts + strings.

## Design

### 1. Unbundle Three.js

Delete the inlined library. `import * as THREE from "three"` from npm, pinned to `three@0.170.0` so the shader chunk names (`#include <common>`, `<begin_vertex>`, `<map_fragment>`, `<emissivemap_fragment>`) patched via `onBeforeCompile` in the arena and enemy materials keep matching. `PMREMGenerator` is in core; `RoundedBoxGeometry` comes from `three/addons/geometries/RoundedBoxGeometry.js`. Vite resolves it; the portal build (`scripts/build.mjs`) copies `games/onslaught/dist/` output rather than raw source — see §7.

### 2. Module layout

```
games/onslaught/
  index.html
  vite.config.js
  src/
    main.js                  bootstrap: build Game, top-level error banner
    core/
      loop.js                fixed-tick accumulator + render alpha
      rng.js                 RNG class (mulberry32), named streams
      input.js               h0
      mathx.js               damp/lerp/angle helpers (il, J, nn, pn, Cr, Rs, Wn, Ln, Ps, el, Mi)
    data/
      weapons.js             N0 table
      enemies.js             Ar table
      waves.js               wave composition formula (from X0.startWave)
      tuning.js              player constants (hp 500, speeds, regen), pickup odds, streak rules
    sim/                     NO rendering, NO DOM, NO audio. May import three math only.
      arena.js               As, collision/geometry data, gates, groundHeight/resolveCircle/floorAt/raycast
      player.js              R0 minus camera-shake presentation
      weapons.js             z0 + fire/reload/ADS/switch state machine from O0
      enemies.js             G0 minus _buildType/_render/_buildProjectiles mesh code; Ar consumers
      projectiles.js         spitter projectiles (currently inside G0)
      world.js               ties the above together: step(dt, inputFrame) → emits events
      events.js              event types (shot, hit, kill, hurt, wave, pickup, step, land…)
    render/
      renderer.js            WebGLRenderer, cameras, resize, PMREM environment
      sky.js                 g0
      arena-view.js          m0 materials + mesh build + hologram + portal mats
      enemy-view.js          k0, Rr, instanced meshes, per-frame pose from sim state
      weapon-view.js         tt, C0, P0, L0, D0, I0, viewmodel animation from O0
      fx/particles.js        Zo, x0, M0
      fx/tracers.js          y0
      fx/decals.js           S0
      fx/shells.js           E0
      postfx.js              A0 + w0/T0/b0
      shaders/noise.glsl.js  Nn
    audio/
      audio.js               f0 (split into synth/guns/music in a later phase)
    ui/
      hud.js                 W0
      style.css
    theme/
      theme.js               palette, sky uniforms, grade defaults, enemy colors, CSS vars, strings
    game/
      game.js                X0 orchestration: owns sim World, render views, audio, HUD; routes sim events to presentation
```

Identifiers are renamed to real names throughout (`b`→`THREE.Vector3`, `le`→`THREE.MeshStandardMaterial`, `X0`→`Game`, `R0`→`Player`, …). No file over ~600 lines; `O0`, `G0`, `X0`, `f0` are split as listed.

**Boundary rule.** `sim/` and `data/` may import only `three` math (`Vector3`, `Quaternion`, `Euler`, `Matrix4`, `MathUtils`), `core/`, and each other. Never `Scene`, `Mesh`, `Material`, `document`, `window`, `performance`, or `audio/`. Enforced by `scripts/check-sim-boundary.mjs` (greps imports; runs in `npm test`).

**Where the seams are hardest and what we accept in Phase 0:**

- `O0` Weapons: ammo/cooldown/reload timers/spread/recoil impulses → `sim/weapons.js`. Viewmodel springs, bolt/pump/mag animation, muzzle flash → `render/weapon-view.js`, which reads weapon state and consumes `shot`/`reload-stage` events. The reload timeline is currently one interleaved function; it becomes a data-driven stage list in sim with the view animating between stages.
- `G0` Enemies: AI/physics/attacks stay in sim with plain `{pos, yaw, state, t, phase, moveBlend, flash, dissolve…}` records. `enemy-view.js` poses the rig per frame from those records. Hit-flash and dissolve are already scalar fields, so this seam is clean.
- `R0` Player: camera position/quaternion are computed in sim from yaw/pitch/eye/bob (they are gameplay-relevant for aiming). Trauma shake and roll remain in sim as numbers; the view applies them. Look rotation is applied at render rate (see §3).

### 3. Fixed-tick simulation

- `core/loop.js`: accumulator at `TICK = 1/60`. Each frame: gather input, run `world.step(TICK, inputFrame)` zero or more times (max 5 to avoid spiral of death), then render with `alpha = acc / TICK`.
- Mouse look (yaw/pitch) is applied every frame, before stepping, so aim latency does not depend on tick phase. Movement, firing, AI, projectiles, waves all step at fixed rate. Fire-rate timers become tick-based.
- Interpolation: player camera and enemy root transforms keep `prev` and `curr`; the view blends by `alpha`. Everything else (particles, tracers, decals) is already time-parameterized on the GPU and just reads wall time. This is enough for smoothness at 120–144 Hz displays; full snapshot interpolation arrives with networking.
- Slow-mo (`timeScale`, used on death and wave clear) becomes a sim-rate multiplier on the accumulator, not a per-frame dt scale.

### 4. Seeded randomness

`core/rng.js` exports `class RNG` (mulberry32, from `p0`) with `float()`, `range(a,b)`, `int(n)`, `pick(arr)`, `chance(p)`. `sim/world.js` owns named streams created from one run seed: `rng.layout` (arena), `rng.combat` (spread, pellet cones, enemy spawn types/positions, pickup drops, AI steer bias), `rng.ai`. Rule: no `Math.random` anywhere under `sim/`. `render/` and `audio/` may use `Math.random` for purely cosmetic jitter. Run seed comes from the URL (`?seed=`) or `Date.now()`, and is shown on the death screen so a run can be replayed.

### 5. Theme: Sunbaked Brutalist

Harsh midday desert light on poured concrete and sand. Blood-orange accents on bone-white. Long hard shadows. Enemies are matte tar-black silhouettes with a single hot ember core. All values live in `theme/theme.js`; nothing else hardcodes a color.

**Sky** (`render/sky.js`): delete nebula, stars, aurora, moon. Keep the gradient and fog band. Add a sun disc + corona along `uSunDir`, and a dust band near the horizon using the existing `fbm2`.
- horizon `#EADFCB`, zenith `#6E9BC4`, fog `#D8CBB3`, sun `#FFF1D6`.

**Lighting** (`render/renderer.js`): `DirectionalLight` warm `#FFF0D8` intensity 3.2 from `uSunDir` with shadows (already enabled, `PCFSoft`), `HemisphereLight` sky `#8FB3D9` / ground `#B89C72` 0.9. PMREM environment regenerated from the new sky. Remove the cyan fill lights in the weapon scene; replace with warm key + cool sky fill.

**Arena materials** (`render/arena-view.js`): concrete `#9A9184`, dark `#6B655C`, pillar `#B3AA9A`, crate `#C7A36B`, barrier `#D9D2C5`. Emissive `emCyan`/`emCyanDim` → `accentHot` `#FF5A1F` (intensity 1.4) and `accentDim` `#B23A10`; `emOrange` → `hazard` `#FFB020`; `emWhite` stays as `#FFF4E0`. Gates become orange heat-shimmer portals (same portal shader, recolored). Extend the floor's procedural noise (`onBeforeCompile` grime pass) to walls and pillars so flat concrete reads under hard light: this is the one non-trivial visual task.

**Enemies** (`data/enemies.js` via theme): runner body `#14100E` glow `#FF6A00`; brute body `#1A120E` glow `#FF2A00`; spitter body `#201A14` glow `#C8FF3A` (acid stays green-yellow so the ranged threat remains distinguishable). Projectile and splash colors follow spitter glow.

**Post grade** (`render/postfx.js` defaults): exposure 1.15, saturation 0.95, contrast 1.14, vignette 0.18, grain 0.02, CA 0.002, bloom 0.08 with threshold 1.6 / knee 0.5. The shadow tint `vec3(0.93,1.0,1.1)` becomes a theme uniform `uShadowTint` = `(1.04, 0.98, 0.92)` (warm). Damage overlay stays red.

**FX**: tracer default `[1, 0.85, 0.6]`, muzzle flash colors unchanged (already warm), impact sparks warm white, pickup burst `accentHot`, ambient drifting motes become pale dust (`#E8DCC4`, alpha low).

**HUD** (`ui/style.css`): panels are translucent bone `rgba(245,238,225,.86)` with `#141210` ink; `--accent #FF5A1F`, `--warn #D9771B`, `--danger #B8231C`. Fonts: `Barlow Condensed` 500/600/700 for UI, `Big Shoulders Stencil Text` 800/900 for title, score and ammo. Layout unchanged; glows removed (drop `text-shadow` halos, use solid 2px rules and hard offsets instead). Crosshair and hitmarker: black core with 1px white outline for contrast on bright ground.

**Strings** (`theme/theme.js`): `GAME_TITLE = "UNTITLED ARENA"` as an explicit placeholder constant; kicker `PROVING GROUND // SITE 04`; subtitle `HOLD THE LINE`. Weapon and enemy names stay as-is in Phase 0 (they are one-line data edits when the name is chosen).

### 6. Bootstrap and debug

`main.js` reads `?debug ?god ?nospawn ?seed=`. `?debug` also mounts a lil-gui panel bound to theme grade values and `data/tuning.js` so the theme can be tuned live during recording. `window.game` stays exposed.

### 7. Build and portal integration

- `npm run dev` → Vite at 5173 (unchanged).
- `npm run build:game` → `vite build` into `games/onslaught/dist/` (hashed assets, sourcemaps).
- `scripts/build.mjs`: for a game folder containing `vite.config.js`, copy its `dist/` as the portal entry instead of the source folder; `game.json` is read from the source folder. `npm run build` runs `build:game` first.
- `npm test` → `check-sim-boundary` + `sim:test` (§8).

### 8. Verification

1. **Boots clean**: dev server, zero console errors, menu renders, `window.game.state === "menu"`.
2. **Plays**: `?debug&seed=1` auto-starts; run 90 s of scripted input in the browser; waves 1–2 spawn, kills register, HUD updates, death screen shows the seed.
3. **Headless determinism** (`scripts/sim-test.mjs`, Node): construct `sim/world.js` with seed 1 and a scripted input tape (move, look, fire, reload, switch), step 3,600 ticks, hash player/enemy/weapon state; run twice, hashes must match. This proves the sim has no DOM/render dependency and no unseeded randomness. It is the gate for Phase 4.
4. **Boundary**: `check-sim-boundary` passes.
5. **Visual**: side-by-side screenshots (menu, mid-wave, ADS, death) against the original; the fork must be unmistakably a different game while geometry and layout stay identical.
6. **Feel parity**: recoil, ADS time, movement speed, TTK per enemy unchanged — checked by keeping `data/*` values byte-identical to the original tables and confirming the sim-test hash is stable across the refactor once fixed-tick lands (tick-rate change is the one intentional numeric difference).

### 9. Work order (each step ships, each is a possible daily post)

| # | Step | Visible on video? |
| --- | --- | --- |
| 1 | Unbundle Three.js, rename identifiers, split into files (no behavior change) | No — but "29k lines → 30 files" is a good before/after post |
| 2 | `theme.js` + new fonts + new title/kicker + HUD restyle | Yes |
| 3 | Sky rewrite + sun lighting + PMREM | Yes (biggest visual jump) |
| 4 | Arena palette + wall grime shader + gate recolor | Yes |
| 5 | Enemy palette + FX colors + post grade | Yes |
| 6 | Seeded RNG streams, seed on death screen | Yes (replay the same run twice) |
| 7 | Fixed-tick loop + interpolation | Marginal (show frame-time graph) |
| 8 | Sim/view seams in Weapons and Enemies, boundary check | No |
| 9 | Headless sim test passing in Node | Yes ("the game runs with no screen") |
| 10 | Vite build in portal pipeline, publish | Yes |

Steps 2–5 can be interleaved with 1 as needed to keep a visible change landing daily.

## Out of scope for Phase 0

New weapons, enemies, maps, perks, settings menu, controller support, audio redesign, any networking. Enemy/weapon renames wait for the game name.
