# Bench Portal

Static catalog for playable browser-game benchmarks.

## Local preview

```bash
npm run build
npm run serve
```

Open <http://127.0.0.1:4176>.

## Add a game

1. Create `games/<slug>/` with a self-contained `index.html` and relative asset paths.
2. Add `games/<slug>/game.json`.
3. Run `npm run build` to validate the manifest and regenerate the catalog.

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22`
