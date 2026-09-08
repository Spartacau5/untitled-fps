# Midtown Crossing: FFA, operators and startup fixes

Branch: `v4/midtown-ffa-operators`, based on `v3/midtown-tdm-fidelity`.

## Rules and combat

- One human and six independent bots. Every other competitor is hostile.
- Individual kills and deaths, live seven-person leaderboard and final standings. Competitor names survive actor respawns. No online multiplayer or horde leaderboard submissions.
- First to 40 kills, eight-minute limit, equal leading kill totals draw. Death count sorts equal scores for display without breaking a tied match result.
- Three-second respawns, exposure-aware spawn placement, 1.5-second protection that ends on firing.
- FFA human health is 100 rather than 500. Walk/sprint are 4.3/6.2 m/s. Slides last 0.55 seconds with a 6.4 m/s entry cap. Health regeneration is 22 HP/s after the existing 4.2-second delay.
- More vertical recoil, less random lateral recoil and camera trauma. Removed sprint/slide radial blur in FFA. Retained the weapon definition damage, cadence, ADS and magazine system.
- The default VK-7 rifle selection becomes the existing M4A1 model in FFA without overwriting the saved profile. Armory selections remain available.
- Bots scan at a staggered 8 Hz, fire aimed bursts, strafe, manage engagement distance and retreat during reloads. Navigation and movement still run deterministically at the fixed simulation rate.

## Character and sound presentation

The FFA renderer uses an original procedural human skeleton with fabric-shaped limbs, helmet, visible skin, balaclava, plate carrier, pouches, gloves, knee pads, boots and a shouldered carbine. Distance-driven strides, articulated knees/ankles, arm reload poses, recoil, muzzle flashes and collapse poses replace the robot rig. All six operators share instanced geometry. Corpses retain their heads and do not burst into glowing robot fragments.

Player impacts use small non-emissive dust/fabric particles. Kill confirmation is shorter and less musical. Rifle/pistol-family reports use layered muzzle crack, pressure body and delayed street reflection; bot reports retain distance panning and occlusion filtering. Deaths use a body/gear fall cue instead of robot shutdown sounds. These are original synthesized effects, not licensed field recordings or copied COD/XDefiant audio.

## Rendering and startup

- Replaced procedural fragment noise and custom normal calculations with shared 256px mipmapped albedo, height and roughness tiles on Three's standard PBR fragment shader. Vertex-stage projection maintains metre-scale texture density. This removes the old asphalt/concrete shader path, including its reserved `patch` variable.
- Five adjacent ground strips meet at collision height y=0. Removed overlapping pavement boxes and cross-street sidewalk layers. Lane paint, drains and curb details retain small explicit depth separation. Camera clipping range is tighter for the compact district.
- Softer stone/brick/paint colors and lower painted-metal reflectivity reduce white trim and black vehicle surfaces.
- Skipped unused legacy pavement/shutter texture generation. All bot navigation fields share one static occupancy bake, with independent distance fields.
- Removed the background weapon-construction timer that could run during opening combat. Carried weapons now prepare incrementally behind the loading screen before shader compilation.
- Replaced the six-face full-city environment capture with one small neutral reflection scene shared by city and weapons. Instancing colors are allocated before compile; operator shadows and post processing receive a loading-screen render.
- Structural geometry casts city shadows; tiny trim and markings do not. No change to the existing selectable graphics tiers.

## Validation and limits

151 automated tests pass, including FFA scoring, kill credit, respawn identity, spawn shields, AI-versus-AI combat, match limits, deterministic replay, ground coverage, texture reuse, finite poses and the existing horde regression suite. Production build passes.

Local Node/native-canvas CPU checks, same environment and map, compared the previous branch with this pass. Timing ranges cover two FFA samples during the pass; object counts reflect the final scene:

| Check | Previous TDM | FFA pass |
| --- | ---: | ---: |
| Scene mesh objects | 211 | 100 |
| Shadow-casting mesh objects | 154 | 34 |
| World/roster construction | 51 ms | 33-35 ms |
| City construction | 479 ms | 211-355 ms |
| Character renderer construction | 48 ms | 8-18 ms |

These timings are indicative CPU samples, not browser loading time or FPS benchmarks. The cloud browser refused the local preview with `ERR_BLOCKED_BY_CLIENT`. GPU shader output, perceived animation/sound quality and first-seconds frame times remain unverified here. Geometry/data tests are not a substitute for that playtest.

This is not yet TTK realism. Remaining production work is asset-driven: licensed or original rigged operator meshes, authored directional locomotion/aim/reload/death clips, high-quality material scans, more convincing storefront interiors and props, recorded firearm/handling/footstep libraries, and a measured lighting/mix review on target hardware. No external character, texture or audio downloads are required for this branch to run.

## Test in Cursor

With local edits saved on your existing branch:

```sh
git fetch origin
git switch --track origin/v4/midtown-ffa-operators
npm ci
npm run dev
```

If the branch already exists locally, switch to it and use `git pull --ff-only`. Open Vite's printed URL. Useful flags: `?nospawn` for street inspection, `?god` for uninterrupted bot observation, `?mode=horde` for the original game.

Check a cold reload and the first ten seconds on the same graphics tier as before. Walk both sidewalks and crosswalks, inspect the two buses, switch every carried weapon, watch operators fight without your intervention, then test a kill/death/respawn cycle and the leaderboard. Record the reference angle and desktop resolution so the next art iteration can be compared fairly.

![Midtown FFA layout](midtown-layout.svg)
