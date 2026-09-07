# Midtown Crossing: gameplay prototype

Branch: `v3/midtown-hardpoint`. Based on main at `41cf3ea`, including the latest human hands, separate rifles, launcher reload and arena improvements. This branch defaults to the new mode. Use `?mode=horde` for the existing arena and waves.

## Direction and reference research

The target is a compact NYC tactical shooter, with a human player and armed robot opponents. The supplied TTK recording provides a useful visual direction: intimate corridors and corners, detailed forearms and weapons, fluorescent service lighting, red emergency accents, brick, pipes and door frames. This is a much more useful benchmark than adding more bloom or giant signs to an open arena.

The recording is a roughly 45-second edited sample. It does not establish match rules, damage values, exact movement timings, matchmaking, or networking. Its audio has not been perceptually assessed here. We should compare captured audio and gun animations directly in a later reference pass, rather than claim an exact match.

As checked on 7 September 2026, the [official TTK experience](https://www.roblox.com/games/120189115846709/TTK-Testing), by Sable Digital, has HARDPOINT in the title, while its description still calls the test FFA. It lists co-op PVE, story missions and team PVP as intended directions, and describes helmetcam and transparent-optic options. Those statements are not proof that every planned feature is implemented. The [developer forum announcement](https://devforum.roblox.com/t/ttk-our-very-early-tactical-fps/4664539) was discoverable, but its full text was blocked by verification in this environment.

Our proposed rules below are our own. The supplied overhead transit/depot image informs the connected three-lane structure, staggered central vehicles and broken sightlines. The new map is an original layout, not a reconstruction of COD geometry or a geographically exact Times Square survey.

## Playable now

- Solo hardpoint practice against a fixed maximum of three rifle robots.
- First to 120 objective points, with a six-minute time limit and a draw if tied.
- One point per uncontested second. Kills do not add objective points. Additional robots do not accelerate scoring.
- Broadway, Theater Walk and Seventh Avenue rotate every 45 seconds; the HUD shows the next point.
- Player respawn after three seconds, fresh ammunition and 1.5 seconds of damage protection. Spawn selection weighs distance, visibility and occupied positions.
- Robot reinforcements are spaced five seconds apart. They navigate to the objective, acquire visible targets with a reaction delay, fire three-round bursts and pause to reload.
- Position-based robot gun audio, with attenuation and filtering when cover blocks the sound source. This is synthesized prototype audio, not a finished sound library.
- Objective rings, a north-up minimap, match timer, side scores and a result screen.
- Original player health, movement, ADS, recoil, weapon handling, loadout, human hands and first-person weapon animation remain inherited from main.
- Practice does not award horde XP, post horde leaderboard scores, or write misleading horde run records.

## Map

![Original Midtown Crossing layout](midtown-layout.svg)

Playable footprint: 54 by 70 metres. Layout measurements are prototype choices, not measurements inferred from the reference.

| Route | Current composition | Intended firefights |
| --- | --- | --- |
| West: Theater Walk | Theater frontage, overhead canopy, service truck, kiosk | Close flanks, short visibility, identifiable theater entrance |
| Center: Broadway | Two offset buses, crosswalks, low planters | Cover-to-cover pushes and contested central control |
| East: Seventh Avenue | Hotel and shops, service vehicle, open sidewalk | Medium-range approach and alternate rotations |
| Cross-streets | Breaks in both building spines | Switch lanes without retracing all the way to spawn |

`src/data/midtown.js` is the shared source for playable solids, collision, navigation, objectives and minimap. The render view adds trim around that geometry. Buildings are closed blocks in this slice. Traversable shop interiors, stairs and a subway route are future layout changes, not already implemented features.

## Fidelity plan

1. **Playtest the layout first.** Check spawn safety, time to first contact, unfair long angles, flanking opportunities, and whether each rotation gives the player enough time. Test a complete victory, defeat, death/respawn, and pause/restart. Record play sessions in Cursor.
2. **Finish one representative section.** Produce the theater corner, crosswalk and one bus at the final visual standard. Use authored or properly licensed PBR assets with real scale, coherent texel density, trim sheets, worn edges and believable material response. Approve this section before rebuilding every building.
3. **Light for readability.** Establish overcast late afternoon with cool ambient light and localized warm storefronts. Add contact shadows and intentional light pools. Reserve bright signs for landmarks. Tune exposure around readable targets and weapons, with controlled post effects.
4. **Complete robot animation.** Replace the prototype forearm rifle and carried pose with an authored rig, clear aim alignment, foot planting, hit reactions, reloads and death animation. Preserve player weapon mechanics while improving visual transitions.
5. **Author the soundscape.** Compare the reference audio directly. Add licensed or original gun layers, mechanical handling, surface-dependent steps, near misses, indoor/outdoor tails, occlusion and short objective cues. Mix for positional readability and avoid constant loud ambience.
6. **Measure on target hardware.** Aim for a stable 60 FPS desktop baseline, then profile shadows, transparent effects, texture memory and draw calls. Mobile needs its own budget. No frame-rate or final-fidelity claim has been validated yet.
7. **Add online play as its own milestone.** Real teams require a server-authoritative simulation, prediction/reconciliation, interpolation, lag compensation, matchmaking and abuse controls. Local robots are not evidence that those systems exist.

We can pursue TTK-like polish, but procedural blockout geometry and synthesized effects alone will not produce GTA or AAA asset fidelity. This commit establishes match structure and spatial decisions to test before investing in the final assets.

## Local testing

In Cursor's terminal, from your repo folder:

```sh
git fetch origin
git switch --track origin/v3/midtown-hardpoint
npm ci
npm run dev
```

If you already have that local branch, use `git switch v3/midtown-hardpoint` and `git pull --ff-only` instead of creating it again. Commit or stash any local edits before switching branches if Git asks you to. Open the local URL printed by Vite.

- Default URL: hardpoint.
- `?nospawn`: explore the new layout without robots.
- `?god`: inspect fights without taking damage.
- `?mode=horde`: original survival mode.
- The existing Controls panel documents movement and weapons, plus the new objective rules.

## Verification and limits

- `npm test`: 138 passing tests, including nine new hardpoint tests covering navigation, collision/rays, scoring/contestation, time limit, respawn, line of sight, roster limits, deterministic playback and preservation of weapon definitions.
- `npm run build`: succeeds.
- Scene construction with a native canvas texture backend: finite geometry/transforms and no simulation mutation. This is not GPU rendering or visual QA.
- Browser playtesting here was blocked when the preview browser refused the local server with `ERR_BLOCKED_BY_CLIENT`. Actual visual quality, pointer-lock controls, live sound, performance, HUD layout and balance still need a browser playtest in Cursor.
- Updated the test command to discover `tests/*.test.mjs` explicitly, since this environment's Node 24 does not resolve `node --test tests/` as a directory test suite.
