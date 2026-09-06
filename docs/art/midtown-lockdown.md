# Midtown / Lockdown: Times Square art pass

This branch replaces the original fantasy arena presentation with a grounded,
Times Square-inspired district. It is a playable art pass, not a surveyed street
reconstruction or a claim of GTA-level photorealism.

## What changed

- Original perimeter walls become masonry storefronts and recessed service bays.
- A Manhattan skyline, a narrow stacked-billboard tower, Broadway signage,
  distant yellow cabs, traffic signals and street lighting establish location.
- Plaza paving, asphalt strips, crossings, drainage and a granite center replace
  glowing floors and holograms. Original cover becomes municipal barriers,
  steel sign supports and electrical utility cases.
- Local canvas textures supply architectural windows, paving, shutters and
  fictional billboard campaigns. Assets need no runtime image host or API key.
- Sun/sky, atmospheric haze, color grading and reflections suit the city.
  The environment map captures the actual district once at initialization.
- Existing enemy rigs receive alloy armor, servo joints, cooling fins and battery
  packs. Presentation labels identify pursuit, breach and suppression units.
- Robot servo and shutdown cues replace growls. A procedural traffic/ventilation
  bed replaces the original ambience; outdoor reverb is shorter. Gun firing
  events, cadence, recoil and handling timing are preserved.
- Human hands and the existing weapon geometry are retained, with reduced
  decorative emissive accents.

## Gameplay preservation

No files in `sim/`, `data/`, or `core/` changed. Wall, gate-block, pillar, barrier
and crate meshes retain the corresponding original positions and dimensions.
The central platform retains its original geometry. Flush road markings are
visual only. Skyline, vehicles and street furniture are outside the playable
boundary. Gameplay still uses the original waves, damage, spawn points,
movement and hitboxes. Enemy API/type names in run logs remain unchanged.

## Run locally

Commit or stash local work before switching branches.

```sh
git fetch origin
git switch v2/visual-audio-overhaul
git pull --ff-only
npm ci
npm run dev
```

Open the Vite address. Append `?debug&god&nospawn&seed=42` for an empty-arena
walkthrough, or `?debug&god&seed=42` to inspect robot combat. Debug mode starts
with ambience and music disabled; use N and M to enable them, or play normally
to evaluate the sound mix. Press Escape to check pause/settings/debrief flows.

## Checks and remaining review

- `npm test`: all 52 existing tests pass, including deterministic simulation,
  wall collisions, head/body hitboxes and enemy pressure behavior.
- `npm run build`: succeeds. Vite still reports its main-chunk size advisory.
- Additional local Node/native-canvas scene-construction check: all geometry and
  robot transforms are finite; six gates and all three robot rigs build; scene
  creation/update do not mutate the simulation hash.
- Scene check measured 158 mesh objects (including instanced enemy parts), about
  98k source vertices and 32 textures. Estimated uncompressed texture footprint
  with mipmaps is 86 MiB, excluding shadows, environment and postprocessing.
  These are resource counts, not a measured browser FPS result.
- Browser visual and audio playtesting was blocked because the available preview
  browser could not reach the local server. No screenshot or listening QA is
  claimed. Review readability, billboard exposure, material scale, robot hit
  feedback, the sound mix and performance on your local GPU before merging.

## Asset direction for the next pass

The first pass uses procedural geometry and original code-drawn textures.
Higher fidelity will require authored facade detail, calibrated material maps,
rigged character/weapon assets and recorded urban ambience. Billboards are
fictional graphic campaigns. Street layout remains the original circular arena
by design; the surrounding city is evocative rather than geographically exact.

## Capture-driven correction (2026-09-06)

The user's screenshots and sampled recording frames show underexposed weapon
surfaces, repetitive/blocky architecture and excessive hit-flash/color-fringing.
The next commit addresses the immediate readability issues:

- Give the first-person weapon a neutral RoomEnvironment reflection map while
  retaining the city reflection capture for world objects.
- Attach the weapon key light and its target to the weapon camera; improve
  local fill and hemisphere light without changing the weapon pose or recoil.
- Reduce robot full-body hit whitening and dissolve glow, world muzzle-light
  intensity, firing screen flash and movement blur/color-fringing.
- Match ranged-projectile trails to the suppression unit's blue presentation.

This is a targeted correction, not a solution to the larger art-quality gap.
Architecture and billboard variety, storefront depth, physically credible
materials and authored robot assets remain the next substantial work.
Actual appearance still needs a new local capture; no local browser rendering
or audio listening was possible in this environment.
