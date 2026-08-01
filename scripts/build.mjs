import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const gamesRoot = path.join(root, "games");
const output = path.join(root, "dist");

const entries = await readdir(gamesRoot, { withFileTypes: true });
const games = [];

for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const manifestPath = path.join(gamesRoot, entry.name, "game.json");
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    throw new Error(`Invalid or missing manifest: games/${entry.name}/game.json`, { cause: error });
  }
  if (manifest.slug !== entry.name) throw new Error(`Manifest slug must match folder: ${entry.name}`);
  if (!manifest.title) throw new Error(`Manifest title is required: ${entry.name}`);
  games.push({ ...manifest, path: `./games/${entry.name}/` });
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all([
  cp(path.join(root, "index.html"), path.join(output, "index.html")),
  cp(path.join(root, "styles.css"), path.join(output, "styles.css")),
  cp(path.join(root, "src"), path.join(output, "src"), { recursive: true }),
  cp(gamesRoot, path.join(output, "games"), { recursive: true }),
  writeFile(path.join(output, ".nojekyll"), ""),
  writeFile(path.join(output, "games.json"), `${JSON.stringify(games, null, 2)}\n`),
]);

console.log(`Built bench-portal with ${games.length} game(s).`);
