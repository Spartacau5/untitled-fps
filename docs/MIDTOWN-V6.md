# V6: fidelity foundation

Branch: `v6/fidelity-overhaul`, based on `v5/midtown-gun-game` at `9db0856`.

This first v6 delivery changes the NYC environment and rendering. Gun Game, six bots, weapon progression, 150 player health, safe spawns and the collision layout remain the v5 rules. Production operator/weapon assets, mocap and recorded audio are still subsequent milestones; this environment pass is not a claim of TTK or AAA parity.

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

## Measured here

Headless scene construction with a real Canvas implementation, same desktop configuration:

| Static district | v5 | v6 |
| --- | ---: | ---: |
| Meshes | 86 | 57 |
| Vertices | 205,964 | 209,559 |
| Shadow-casting meshes | 11 | 11 |

These exclude operator instances, weapons and effects. Fewer meshes means fewer district draw submissions, not a measured FPS claim. Downloaded fidelity images are budgeted below 3 MiB; decoded GPU storage for these images is approximately 56 MiB including mipmaps. Existing textures, render targets and geometry are additional.

Automated checks cover partial-load cleanup, fallback preservation, colour spaces, shared textures, weathering integration, asset integrity/download budget, finite reflection geometry, sky clipping range and raw frame diagnostics. The existing Gun Game, spawn, jumping, weapon framing and deterministic simulation checks remain required.

The cloud browser could not open localhost (`ERR_BLOCKED_BY_CLIENT`). GPU shader compilation, final lighting, reflection accuracy and frame time must therefore be validated locally. Reflection probes are approximate and are not screen-space or ray-traced reflections. Operators, weapon models and sound remain interim assets.

## Playtest

```bash
git fetch origin
git switch v6/fidelity-overhaul
npm install
npm run dev
```

Open the Vite URL with `?perf`. For a quiet inspection use `?nospawn&perf`. Check the first minute of a cold load, glance across storefronts from several angles, inspect the brick scale and road normal maps, then play a full match. Record the performance overlay along with any hitch or visual artifact. Vercel Preview can host this branch without promoting it to production.
