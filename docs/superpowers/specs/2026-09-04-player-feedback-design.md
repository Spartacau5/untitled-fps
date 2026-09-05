# Player feedback form

Date: 2026-09-04
Scope: shared `#menu` (intro, pause, death). Not in the HUD while playing. Mobile touch controls are out of scope.

## Goal

Let testers send written feedback from any menu. Store it where the leaderboard already lives (Upstash Redis in production, `.data/feedback.json` locally).

## UI

- Secondary **PROVIDE FEEDBACK** control on `#menu` (same overlay for intro / pause / K.I.A.).
- Opens a small panel: optional name (prefilled from `#player-name`), required textarea (max 2000 chars).
- SEND posts JSON; CANCEL / success returns to the menu. Typing must not move the player (existing INPUT/TEXTAREA skip).
- Sunbaked paper/ink/orange. Must not replace DEPLOY/RESUME.

## API

- `POST /api/feedback` `{ name?, message }` → `{ ok: true }`. Public. Empty message rejected.
- `GET /api/feedback` returns newest-first list.
  - Redis (production): requires `x-feedback-token` or `Authorization: Bearer` matching `FEEDBACK_ADMIN_TOKEN`. Missing token → 401.
  - File backend (local): no token required.
- Keep the newest 200 notes. Sanitize name like the callsign (empty allowed). Strip other punctuation. No HTML.

## Out

- Touch / mobile controls.
- Email, Slack, or a public feedback wall.
- New database product (Neon, Vercel Postgres).

## Read the inbox

```bash
curl -s https://untitled-fps.vercel.app/api/feedback -H "x-feedback-token: $FEEDBACK_ADMIN_TOKEN"
```

Set `FEEDBACK_ADMIN_TOKEN` on Vercel (and locally if you want GET locked). Redis URL/token are the same as the leaderboard.
