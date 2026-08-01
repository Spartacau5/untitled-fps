# Bench Portal

Static catalog for playable browser-game benchmarks.

- Cloudflare Pages: <https://bench-portal.pages.dev>
- GitHub Pages: <https://alesha-pro.github.io/bench-portal/>

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

Cloudflare is connected to the GitHub `main` branch and deploys automatically.
For a manual fallback deployment, run `npm run deploy:cloudflare`.
