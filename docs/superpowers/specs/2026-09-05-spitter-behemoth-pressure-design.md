# Phase 1 — Spitter pressure + Behemoth charge-slam

Date: 2026-09-05
Scope: `games/onslaught/` enemy combat only (`data/enemies.js`, `sim/enemies.js`, `sim/world.js` slam knock). Playtest logs (same seed, two runs, intentional wave-5 stop) plus player report: Behemoths are the easiest enemy; spitters under-pressure.

## Goal

Behemoths play as the heavy: they close a kite and the slam has to be answered. Spitters shoot often enough to punish standing still. Husks, player speed, wave counts, and the 9s break do not change.

## Evidence (do not retune from this)

- Behemoth: 6 spawned, 2 killed, **one slam hit per run** (exactly 34 damage). Walk speed **3.7** vs player walk **5.3** / sprint **7.7**. Slam plants, **0.7s** windup, damage only if dist `< range * 1.3` (**~3.6m**). Husks lunge; Behemoths do not. In 0.7s a sprint covers ~5m.
- Spitter: cooldown **2.4 × rng(0.8–1.25)** + **0.5s** windup + **0.4s** swing (~3s+ between shots). Orbit **14m**, fire if `< 28m`. Damage when they connect is already real (15–33 hits / 210–462 dmg); they just fire too rarely.

## Out of scope

- Wave composition, spawn interval, `maxAlive`, 9s break, pickup rate.
- Player move/sprint/slide/HP.
- Husk AI, HP, damage.
- Behemoth HP **640** and slam damage **34** (problem is landing, not the number).
- Spitter standoff **14**, `projSpeed` **26**, damage **14**, 28m fire gate, projectile lead.
- Charge-queue / one-Behemoth-at-a-time. Several may rush at once (wave 5 “heavy presence”). Revisit only if play says it is a mess.
- New meshes, shaders, or a dedicated charge VFX. Existing `EV_SLAM` / trauma / knock stay the presentation.
- Grenades, weapons, hitboxes (already fixed separately).

## 1. Behemoth — charge into slam

New sim state `"charge"` (brute only). View keeps interpolating pos/yaw/`moveBlend`; charge is a fast chase, slam still uses `attackLean`.

### Numbers (locked)

| Key | Value | Notes |
| --- | --- | --- |
| `speed` | 3.7 | Walk in chase, unchanged |
| `chargeSpeed` | 10 | Faster than sprint 7.7 |
| `chargeRange` | 16 | Start charge if cooldown ready and dist ≤ this |
| `slamCommit` | 5 | Leave charge → slam |
| `chargeMaxS` | 2.2 | Cap so a crate-loop cannot last forever |
| `slamRadius` | 6 | Ground shockwave, full **34** damage |
| `windup` | 0.4 | Was 0.7; charge is the long telegraph |
| `swing` | 0.9 | Unchanged |
| `cooldown` | 2.2 | Unchanged |
| `range` | 2.8 | Unused for slam hit; keep for data compat |
| `damage` | 34 | Unchanged |
| `hp` | 640 | Unchanged |

### Chase → charge

From `chase`, if `def.big` and `cooldown <= 0` and player not dead:

- dist ≤ `slamCommit` → `attack` (slam) immediately.
- else dist ≤ `chargeRange` → `charge` (`t = 0`).
- else keep walking at `speed`.

### Charge

- Steer and face the player every tick (track; no heading lock).
- Desired speed `chargeSpeed`. Reuse existing `_blocked` sidestep so crates do not eat the rush.
- `t >= chargeMaxS` or dist ≤ `slamCommit` → `attack` (slam). If timeout and dist > `slamRadius`, drop back to `chase` instead (whiff, short walk, then they try again).
- Player dies → `chase`.

### Slam (`attack`, `def.slam`)

- Yaw still lerps to the player (existing).
- **Lunge:** the husk windup shove (`vel` toward player in the last 0.12s of windup) also runs for `big`, with a stronger impulse so the shockwave travels with them instead of planting. Exact impulse is an implementation detail; must close ~1–2m during windup vs today’s full brake (`vel *= exp(-8*dt)` for the whole attack). Behemoths still slow vs chase, they do not skate at `chargeSpeed` through the slam.
- Hit: `dist < slamRadius` and `|Δy| < 1.8` → `onPlayerHit(34)`. No inner/outer falloff in this pass.
- `onSlam`: trauma unchanged; knock if `dist < slamRadius` (was `dist < 5`).
- Then `chase` with `cooldown` as today.

Husks keep `u < range * 1.3` and the existing small lunge. Do not change husk windup/range.

## 2. Spitter — fire more

| Key | From | To |
| --- | --- | --- |
| `cooldown` | 2.4 | **1.5** |
| `windup` | 0.5 | **0.35** |
| `swing` | 0.4 | 0.4 |
| `standoff` | 14 | 14 |
| `projSpeed` | 26 | 26 |
| `damage` | 14 | 14 |

Post-spit cooldown is still `cooldown * rng.range(0.8, 1.25)` (~1.2–1.9s). They still plant to spit (attack still damps velocity). 28m fire gate unchanged. No new aim logic.

## 3. Architecture

- All numbers live on `ENEMIES.brute` / `ENEMIES.spitter` in `data/enemies.js`. Sim reads `def.*`; no magic literals for the new radii/speeds.
- `Enemies.update` gains a `charge` branch next to `chase` / `attack`. No new event type.
- `World.onSlam(pos, dist)` knock threshold uses the slamming enemy’s `slamRadius` (pass it in, or pass the enemy). Trauma curve stays `1 - dist/14`.
- Presentation: no settings, no HUD copy. Determinism: `World.hash()` includes yaw/pos already; charge will change hashes vs old builds. Tests compare two runs of the **same** build.

## 4. Tests

Headless, `noSpawn: true`, god player. New file `tests/enemy-pressure.test.mjs` (or extend `tests/enemy-hitbox.test.mjs` only if it stays about facing/sac — prefer a new file).

- A Behemoth 12m from the player with `cooldown = 0` enters `charge` and closes faster than walk speed 3.7.
- At `dist <= slamCommit` it enters `attack`.
- Slam at **5.5m** hits; at **7m** misses. Husk at `range * 1.3 + 0.2` still misses.
- After a spit, spitter `cooldown` is in `[1.5*0.8, 1.5*1.25]`.
- Existing sim-determinism still passes (same seed, two worlds, equal hash + stats).

## 5. Acceptance (play)

Same seed `1936409692` if convenient. You should not be able to ignore a Behemoth by walking backward; sprint+slide at the right time still dodges the slam. Spitters lean and spit clearly more often. Download a run log: `enemies.brute.hitsOnPlayer` should not sit at 1 if you let them live; `enemies.spitter.hitsOnPlayer` should trend up vs 15–33 if you stand around. If slams land and 34 still feels like a slap, bump damage in a later pass — not this one.

## 6. Follow-ups (explicitly later)

- Standoff / projectile speed if spitters are still a rounding error after the fire-rate pass.
- Slam damage / HP if they connect and still feel soft.
- Serialize charges if stacked Behemoths are unfair rather than heavy.
