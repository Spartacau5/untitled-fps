# Midtown Gun Game

Branch: `v5/midtown-gun-game`, based on the v4 FFA/operator pass.

## Rules

Offline free for all: one human and six independent operator bots. First to 40 kills, or the most kills after eight minutes, wins. Equal leading totals draw.

| Human kills | Equipped weapon |
| --- | --- |
| 0 | Pistol |
| 1 | SMG |
| 2 | Shotgun |
| 3 | M4 |
| 4 | DMR |
| 5 | LMG |
| 6 | Sniper, slot 7 |
| 7 | Rocket launcher, slot 8 |
| 8+ | Free choice with 1–8, wheel, Q or mobile weapon control |

Eight weapons give seven upgrades from the starting pistol. Kill eight grants arsenal mastery rather than a ninth weapon. Death preserves the earned stage; after mastery it preserves the selected weapon. Respawns refill ammunition. Restarting resets the ladder. Saved armory selections cannot bypass progression. Bots retain their existing rifle combat behavior.

## Survivability

Human health is 150, up from 100. Current 25-damage bot rifle hits therefore require six hits to kill at full health. This is custom tuning inspired by a more forgiving military-shooter rhythm, not an exact recreation of any COD ruleset. Health regenerates at 45 HP/s after 4.5 seconds without damage. Bot health remains 100. Low-health and damage tint are reduced so targets remain easier to read while taking fire.

## Map and respawns

Eight alternating construction screens interrupt the two outer lanes, leaving passages beside them. Six jumpable solids form three step/deck pairs: Theater Walk, Seventh Avenue and the south plaza. Deck heights are 1.1, 1.1 and 1.6 metres. Their visible top surfaces share the collision manifest. Original building spines and cross-streets remain connected.

There are 26 candidate spawn pockets. A spawn is rejected within 10 metres of a live opponent, or within 18 metres with direct sight to one. Farther exposure and recent usage reduce its score; a seeded choice among the best candidates prevents a fixed spawn order. Both the human and bots count as threats. If no pocket is safe, respawning waits and retries every quarter-second. Brief spawn protection still ends on firing.

See [the map plan](midtown-layout.svg) for cover, decks and spawn positions.

## Sights and framing

- LMG: larger rear aperture and a taller front post, aligned on the aiming axis. A geometric ray test verifies the front post is visible through the rear sight.
- Sniper: clear circular scope view with fine crosshairs at settled ADS. It uses the existing zoomed world render, without an extra render target. The viewmodel returns during transitions, reload and weapon switching. The objective glass is nearly transparent during transitions.
- Sniper and launcher: adjusted stock/optic placement and continuous near-plane framing over rotated weapon bounds. The guard covers sprint, switch, recoil and reload poses, including the rear of the launcher.

## Validation and limits

Regression checks cover the kill ladder, locked controls, mastery and respawn persistence, health/regeneration, safe-spawn waiting/recovery, connected navigation, interrupted outer-lane sightlines, normal jumps onto all three decks, LMG sight clearance, and animated sniper/launcher geometry. The full suite also exercises deterministic replay, bot-on-bot combat and street coverage.

New cover is merged into existing material batches. Scope ADS reuses the world camera. Spawn safety runs only at spawn attempts, with throttled retries; there are no new per-frame pathfinding fields or dynamic lights.

GPU frame rate and the final sight picture still need local browser playtesting. Headless geometry and simulation checks cannot establish visual polish or responsiveness on the player's hardware. This pass does not replace the procedural operators or synthesized audio with production assets.

Local test: `git fetch origin`, `git switch v5/midtown-gun-game`, `npm install`, then `npm run dev`. Check all eight promotions, sustained bot fire, step/deck jumps, and sniper/launcher reloads while turning. `?god` permits a damage-free gun-ladder run; `?nospawn` permits a quiet map walkthrough.
