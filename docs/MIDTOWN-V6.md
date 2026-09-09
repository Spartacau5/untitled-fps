# V6: fidelity foundation

Branch: `v6/fidelity-overhaul`, based on `v5/midtown-gun-game` at `9db0856`.

V6 upgrades the NYC environment, authored operator rigs, first-person hands/materials and combat audio. Gun Game, six bots, weapon progression, 150 player health, safe spawns and the collision layout remain the v5 rules. This is an incremental fidelity pass, not a claim of TTK or AAA parity. Production character assets and mocap remain future work.

## Art direction

Damp late afternoon: cool sky fill, restrained warm sunlight, darker street canyons and warm storefront interiors. Scanned asphalt, weathered brick and concrete replace synthetic surface detail after asset warmup. Brickwork is scaled to individual bricks; diffuse colour, normal relief and roughness use separate correctly configured textures. A shared baked weather mask breaks up pavement tiling and creates patches of smoother damp asphalt with a single extra texture lookup.

Opaque storefronts now use box-projected interiors: shelves, ceiling lights and tiled floors shift with the player's view. This gives a depth cue without transparent geometry or per-shop lights. These are visual interiors, not accessible rooms.

New rooftop water tanks, elevated traffic signals, wall conduit, subway identity signs and asphalt repairs add district detail. Ground decals and decorative trim add no invisible blockers. The existing contact shadows are merged into one material batch.

An original photographic After Hours poster replaces the text-only Broadway billboard. [Artwork provenance and prompt](art/v6-billboard.md). [Scanned material sources and license](../games/onslaught/public/materials/midtown/README.md).

## Rendering and loading

- The Midtown sky sphere is now within the 260 m world camera range. Previously its 700 m radius placed it outside that range.
- The reflection environment is baked once from a 26-object street proxy: sky, ground, building silhouettes, shop strips and billboard panels. It does not render the full district into six cubemap faces or update during play.
- Material files and the billboard load before shader warmup. Scans share texture storage across variants. A failed family keeps its existing baked material. Downloads have finite timeouts.
- Colour grading reduces grain and chromatic distortion. Sun direction and sky agree. Existing dynamic-light count is unchanged.
- `?perf` displays frame rate, the 95th-percentile frame interval, draw submissions and texture count. It uses raw frame intervals, so long stalls are not hidden by the simulation's 50 ms clamp. It is local-only diagnostic UI.

## Operator, weapon and recorded-audio pass

Operators now have rounded carriers and pouches, webbing, helmet/headset details, shaped boots and rifle furniture. Separate cloth, equipment and skin palettes no longer multiply already-dark material colours. Two-bone arm constraints keep hands on the rifle grips through recoil and reload; leg constraints keep stance ankles at floor level and raise recovery steps. These are authored procedural characters and motion, not scanned humans or mocap. Their existing hitboxes and aiming rules are unchanged.

First-person support fingers wrap at their joints. Static hand pieces are merged by material into three meshes per hand. Gloves and polymer use non-metallic standard PBR, metals use restrained environment response, and wear follows bevel curvature instead of artificial radial stripes. Rounded parts use fewer subdivisions. Existing LMG sights, sniper scope masking and animated sniper/launcher near-plane guards remain covered by their regression tests.

After listening feedback, the first historical gunshot bank was replaced with 14 clips from seven firearm recordings in the Free Firearm Sound Library, four remastered handling clips, an original launcher effect and four original hit/kill ticks. The 23-clip bank totals 377,844 bytes. Each ballistic family has two separate discharges, fast onsets, offline body reinforcement and shortened tails. Master compression preserves more attack; player reverb and bot volume are reduced. The bank still loads with two workers and per-file deadlines, falls back individually, and limits recorded voices to 24 with explicit cleanup. Recorded bot reports remain filtered when occluded. Source details and limitations are in [the audio credits](../games/onslaught/public/audio/README.md). Footsteps, world impacts and ambience remain synthesized.

## Measured here

Headless scene construction with a real Canvas implementation, same desktop configuration:

| Static district | v5 | v6 |
| --- | ---: | ---: |
| Meshes | 86 | 57 |
| Vertices | 205,964 | 209,559 |
| Shadow-casting meshes | 11 | 11 |

These exclude operator instances, weapons and effects. Fewer meshes means fewer district draw submissions, not a measured FPS claim. Downloaded fidelity images are budgeted below 3 MiB; decoded GPU storage for these images is approximately 56 MiB including mipmaps. Existing textures, render targets and geometry are additional.

Automated checks cover partial-load cleanup, fallback preservation, colour spaces, shared textures, weathering integration, asset integrity/download budget, finite reflection geometry, sky clipping range and raw frame diagnostics. The existing Gun Game, spawn, jumping, weapon framing and deterministic simulation checks remain required.

Operator rendering remains 26 instanced part/material batches, now 6,808 triangles per operator. Each first-person hand uses three meshes (2,540 trigger-hand / 3,836 support-hand triangles). These are geometry counts, not hardware FPS measurements.

Validation includes grip/stance constraints, geometry budgets, audio integrity, onset/tail energy, fallback isolation, voice priorities, spatial filtering and session cleanup. The audio preview also checks real weapon cadence and stop/change cancellation. Automated checks do not establish perceived sound quality.

The cloud browser again could not open localhost (`ERR_BLOCKED_BY_CLIENT`) for the operator/audio pass. GPU shader compilation, final lighting, reflection accuracy, perceived audio balance and frame time must therefore be validated locally. Reflection probes are approximate and are not screen-space or ray-traced reflections. Operators and weapon models remain authored procedural assets.

## Playtest

```bash
git fetch origin
git switch v6/fidelity-overhaul
npm install
npm run dev
```

Open the Vite URL with `?perf`. For a quiet inspection use `?nospawn&perf`. Check the first minute of a cold load, glance across storefronts from several angles, inspect the brick scale and road normal maps, then play a full match. Record the performance overlay along with any hitch or visual artifact. Vercel Preview can host this branch without promoting it to production.

For this pass, inspect operators strafing/backpedaling and reloading, compare all eight gun reports, and check LMG/sniper ADS plus sniper/launcher framing while moving and reloading. Test once with an audio file blocked to confirm that its fallback still fires; listen for excessive mix compression during a six-bot exchange. A local playtest is still required before judging whether the fidelity target has been reached.

For audio-only iteration, open `/audio-lab.html` on your local or branch-preview host. It shares the game's Audio class and weapon cadence, with single-shot, burst, reload, bot-exchange and hit/kill buttons. The production build includes this page.
