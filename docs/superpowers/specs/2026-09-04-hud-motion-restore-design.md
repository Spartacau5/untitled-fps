# HUD motion restore (Fable feel, Sunbaked skin)

Date: 2026-09-04
Scope: `games/onslaught/src/style.css` (and `hud.js` only if hitmarker timing needs a tweak).

## Goal

Bring back the original Onslaught HUD **motion and feedback** (crosshair, hitmarkers, score pops, ammo/HP punch) while keeping our Sunbaked Brutalist **skin**: orange accent, paper panels, Barlow / Big Shoulders, menu + leaderboard + callsign.

## Source of truth

Playable original: `games/onslaught-fable-5.1/` (CSS in `assets/index-AaIZvbbG.css`). Alesha’s master has no newer Onslaught — do not merge `upstream/main`.

## In

- White crosshair and hitmarker ticks with a black halo (CoD read on bright floor and sky).
- Kill / headshot hitmarker **glow** using `--accent` / `--warn` (not flat fill).
- Score, ammo, and stat numbers: accent glow shadow like Fable’s cyan glow, recolored.
- `+points` popups: white + dark halo, head/kill/bonus tints from our tokens; keep the existing `popup` keyframes.
- HP fill: gradient + glow, low-HP danger; keep the paper card around the vitals block.
- Active weapon slot glow. Damage-direction wedge drop-shadow.
- Feed slide-in already exists; restore head-feed tint.

## Out

- `sim/`, collision, weapon tables, settings, leaderboard markup, menu paper card, fonts, cyan/Orbitron.
- Git merge of Alesha’s catalog.

## Acceptance

Side-by-side with `onslaught-fable-5.1`: hitting an enemy shows a glowing X that punches on kill; `+N` floats up; score/ammo still feel “lit.” Palette is orange/ink/paper, not cyan.
