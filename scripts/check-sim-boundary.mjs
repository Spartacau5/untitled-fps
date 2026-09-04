// Enforces the sim/view boundary: nothing under sim/, data/ or core/ may import
// rendering, audio, UI or DOM-dependent code, and sim/ + data/ may not touch
// browser globals or Math.random. The simulation must run headless in Node.
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve("games/onslaught/src");
const simDirs = ["sim", "data", "core"].map((d) => path.join(root, d));
const allowedThree = new Set([
  "Vector2",
  "Vector3",
  "Quaternion",
  "Euler",
  "Matrix4",
  "MathUtils",
  "Ray",
  "Box3",
  "Sphere",
]);
const forbiddenGlobals =
  /\b(document|window|performance\.now|requestAnimationFrame|AudioContext|localStorage)\b/;
let bad = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) {
      walk(p);
      continue;
    }
    if (!p.endsWith(".js")) continue;
    const src = readFileSync(p, "utf8");
    const rel = path.relative(root, p).replace(/\\/g, "/");
    for (const m of src.matchAll(
      /import\s+(?:\{([^}]*)\}|\*\s+as\s+\w+|\w+)\s+from\s+"([^"]+)"/g,
    )) {
      const names = (m[1] || "")
        .split(",")
        .map((s) => s.trim().split(/\s+as\s+/)[0])
        .filter(Boolean);
      const from = m[2];
      if (from === "three") {
        for (const n of names)
          if (!allowedThree.has(n)) {
            console.error(`${rel}: imports THREE.${n} (not math)`);
            bad++;
          }
        if (!m[1]) {
          console.error(`${rel}: namespace import of three not allowed in sim`);
          bad++;
        }
      } else if (
        /\.\.\/(render|audio|ui|game|theme|debug)\//.test(from) ||
        /^\.\.?\/(render|audio|ui|game|theme|debug)\//.test(from)
      ) {
        console.error(`${rel}: imports ${from}`);
        bad++;
      } else if (from.startsWith("three/")) {
        console.error(`${rel}: imports ${from}`);
        bad++;
      }
    }
    if (rel.startsWith("sim/") || rel.startsWith("data/")) {
      const g = forbiddenGlobals.exec(src);
      if (g) {
        console.error(`${rel}: uses ${g[1]}`);
        bad++;
      }
      if (/Math\.random/.test(src)) {
        console.error(`${rel}: uses Math.random`);
        bad++;
      }
    }
  }
}
for (const d of simDirs) walk(d);
if (bad) {
  console.error(`${bad} boundary violation(s)`);
  process.exit(1);
}
console.log("sim boundary OK");
