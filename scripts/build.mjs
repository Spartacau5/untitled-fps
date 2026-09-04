import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gamesRoot = path.join(root, "games");
const output = path.join(root, "dist");
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");

// Folders that are dev-only inside a game directory and never shipped.
const DEV_ONLY = new Set(["node_modules", "dist", ".vite", "vite.config.js"]);

const entries = await readdir(gamesRoot, { withFileTypes: true });
const games = [];

for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const dir = path.join(gamesRoot, entry.name);
  const manifestPath = path.join(dir, "game.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid or missing manifest: games/${entry.name}/game.json`, { cause: error });
  }
  if (manifest.slug !== entry.name) throw new Error(`Manifest slug must match folder: ${entry.name}`);
  if (!manifest.title) throw new Error(`Manifest title is required: ${entry.name}`);

  // Vite-based games are built first; their dist/ is what ships.
  const viteConfig = path.join(dir, "vite.config.js");
  const isVite = existsSync(viteConfig);
  if (isVite) {
    console.log(`Building ${entry.name} with Vite…`);
    execFileSync(process.execPath, [viteBin, "build", "--config", viteConfig], { stdio: "inherit", cwd: dir });
  }
  games.push({ ...manifest, path: `./games/${entry.name}/`, isVite });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  cp(path.join(root, "index.html"), path.join(output, "index.html")),
  cp(path.join(root, "styles.css"), path.join(output, "styles.css")),
  cp(path.join(root, "src"), path.join(output, "src"), { recursive: true }),
  ...games.map(async (game) => {
    const src = path.join(gamesRoot, game.slug);
    const dest = path.join(output, "games", game.slug);
    if (game.isVite) {
      await cp(path.join(src, "dist"), dest, { recursive: true });
      await cp(path.join(src, "game.json"), path.join(dest, "game.json"));
    } else {
      await cp(src, dest, {
        recursive: true,
        filter: (p) => !DEV_ONLY.has(path.basename(p)),
      });
    }
  }),
  writeFile(path.join(output, ".nojekyll"), ""),
  writeFile(
    path.join(output, "games.json"),
    `${JSON.stringify(games.map(({ isVite, ...game }) => game), null, 2)}\n`,
  ),
]);

console.log(`Built bench-portal with ${games.length} game(s).`);
