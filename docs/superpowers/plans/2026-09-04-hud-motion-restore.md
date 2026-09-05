# HUD Motion Restore Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore Fable Onslaught HUD motion (crosshair, hitmarkers, score/ammo punch) while keeping Sunbaked skin.

**Architecture:** CSS-only in `games/onslaught/src/style.css`. Tokens stay `--accent` / `--warn` / `--danger`. Do not touch `sim/` or the menu/leaderboard.

**Tech Stack:** Existing HUD DOM + `style.css`.

## Global Constraints

- No merge of `upstream/main`.
- No cyan, no Orbitron/Rajdhani.
- Keep paper cards on HUD corners and the menu.
- `npm test` must still pass.

---

## Task 1: Restore combat HUD chrome motion

**Files:** `games/onslaught/src/style.css`

- [ ] Crosshair / hitmarker: white ticks, `box-shadow: 0 0 4px #000`. Kill: `--accent` + glow. Head: `--warn` + glow.
- [ ] Damage wedge: restore `filter: drop-shadow`.
- [ ] HP fill: accent→paper gradient + glow; `.low` danger gradient.
- [ ] `.stat-v`, `.ammo-mag`, `.score`: `text-shadow` using accent at ~35–40% alpha.
- [ ] `.slot.active`: accent box-shadow glow (keep fill if it still reads).
- [ ] `.popup`: white + dark text-shadow; `.head` / `.kill` / `.bonus` use tokens.
- [ ] `.feed-item.head`: warn color on text like Fable.
- [ ] `.banner-main`: keep paper card; add a light accent text-shadow so WAVE banners punch.
- [ ] `npm test`
- [ ] Browser: `?god&nospawn` then a real wave — confirm hitmarker glow, `+N` popup, score readable.
