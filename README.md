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

## Onslaught dev workspace

`games/onslaught` is the actively developed game (Vite + ES modules, unbundled Three.js).

- `npm run dev` — Vite dev server at <http://localhost:5173>. Flags: `?debug` (auto-start, no pointer lock, lil-gui grade panel), `?god`, `?nospawn`, `?seed=<n>`.
- `npm test` — ESLint, sim/view boundary check, unit tests and the headless determinism test.
- `npm run build` — builds every Vite-based game, then assembles `dist/`.

Layout: `src/sim/` is the pure simulation (no DOM, WebGL or audio; runs under Node), `src/render/`, `src/ui/` and `src/audio/` present it, and `src/game/game.js` wires the two through `World.step(dt, inputFrame)` and the event stream it emits. `scripts/check-sim-boundary.mjs` enforces the seam.

## Add a game

1. Create `games/<slug>/` with a self-contained `index.html` and relative asset paths, or a Vite project with a `vite.config.js` (its `dist/` is what ships).
2. Add `games/<slug>/game.json`.
3. Run `npm run build` to validate the manifest and regenerate the catalog.

Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22`

Cloudflare is connected to the GitHub `main` branch and deploys automatically.
For a manual fallback deployment, run `npm run deploy:cloudflare`.
