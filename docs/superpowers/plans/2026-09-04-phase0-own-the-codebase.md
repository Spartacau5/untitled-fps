# Phase 0 — Own the Codebase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `games/onslaught/src/main.js` (a 28.9k-line minified Vite bundle) into a modular, readable, deterministic codebase with a fixed-tick simulation that runs headless, and retheme it as "Sunbaked Brutalist" — with no gameplay rule changes.

**Architecture:** Delete the inlined Three.js and import `three@0.170.0`; rename minified identifiers with an AST-based script; cut the game into `core/ data/ sim/ render/ audio/ ui/ theme/ game/` modules where `sim/` has no rendering/DOM/audio dependency; run the sim at a fixed 60 Hz with seeded RNG streams; centralize every color, light, grade value, font and string in `theme/theme.js`.

**Tech Stack:** Vite 6, three@0.170.0, ESLint 9 (`no-undef` only), acorn (one-off refactor script), lil-gui (debug panel), Node 24 for headless tests, Prettier.

Spec: `docs/superpowers/specs/2026-09-04-phase0-own-the-codebase-design.md`

## Global Constraints

- `three` pinned to exactly `0.170.0` (bundle `REVISION = "170"`; `onBeforeCompile` chunk names must match).
- `sim/` and `data/` import only `three` math (`Vector3`, `Vector2`, `Quaternion`, `Euler`, `Matrix4`, `MathUtils`), `core/`, and each other. Never `Scene`, `Mesh`, `Material`, `document`, `window`, `performance`, `audio/`.
- No `Math.random` under `sim/`.
- Simulation tick `TICK = 1 / 60`; max 5 steps per frame.
- Game title is the placeholder constant `GAME_TITLE = "UNTITLED ARENA"`; kicker `PROVING GROUND // SITE 04`; subtitle `HOLD THE LINE`.
- Weapon and enemy names, and all numeric gameplay values in `data/*`, stay byte-identical to the original tables.
- No file over ~600 lines after Task 3.
- Commit messages: plain message only; **never** add `Co-authored-by` trailers.
- Run all commands from repo root `c:\Users\asa34\Documents\Game Dev\bench-portal` in PowerShell (use `;` not `&&`).
- Verification after every task: `npm run dev` serving `http://localhost:5173/`, page title `ONSLAUGHT` (until Task 4, then `UNTITLED ARENA`), zero console errors, `window.game.state === "menu"`.

---

## Identifier map (used by Tasks 2 and 3)

Minified Three.js names used by the game section. Derived by scanning declarations in the library section against uses in the game section; hints come from `this.isXxx = !0` / `this.type = "Xxx"` / constant values in r170's `constants.js` order.

| Minified | Three.js | Minified | Three.js |
| --- | --- | --- | --- |
| `b` | `Vector3` | `It` | `Vector2` |
| `an` | `Quaternion` | `Ee` | `Euler` |
| `Zt` | `Matrix4` | `Pt` | `Color` |
| `jt` | `MathUtils` | `ne` | `Object3D` |
| `xe` | `Group` | `zs` | `Scene` |
| `Ut` | `Mesh` | `_a` | `InstancedMesh` |
| `le` | `MeshStandardMaterial` | `Zi` | `MeshBasicMaterial` |
| `pe` | `ShaderMaterial` | `zl` | `MeshDepthMaterial` |
| `Le` | `BufferGeometry` | `Xs` | `InstancedBufferGeometry` |
| `Ye` | `BufferAttribute` | `he` | `Float32BufferAttribute` |
| `fe` | `InstancedBufferAttribute` | `te` | `BoxGeometry` |
| `He` | `PlaneGeometry` | `ni` | `SphereGeometry` |
| `ei` | `CylinderGeometry` | `Ji` | `ConeGeometry` |
| `Di` | `TorusGeometry` | `qs` | `CircleGeometry` |
| `Na` | `OctahedronGeometry` | `Ue` | `PerspectiveCamera` |
| `La` | `OrthographicCamera` | `r0` | `WebGLRenderer` |
| `Sn` | `WebGLRenderTarget` | `ga` | `PMREMGenerator` |
| `Zn` | `PointLight` | `kl` | `DirectionalLight` |
| `Ol` | `HemisphereLight` | `Ua` | `FogExp2` |
| `gn` (35048) | `DynamicDrawUsage` | `Qn` (1016) | `HalfFloatType` |
| `Ne` (1006) | `LinearFilter` | `Ce` (1) | `BackSide` |
| `Ie` (2) | `DoubleSide` | `Fn` (0) | `FrontSide` |
| `$n` (1) | `NormalBlending` | `Mn` (2) | `AdditiveBlending` |
| `al` (5) | `CustomBlending` | `Dn` (100) | `AddEquation` |
| `Pr` (201) | `OneFactor` | `rl` (2) | `PCFSoftShadowMap` |
| `_n` (0) | `NoToneMapping` | `_l` (3201) | `RGBADepthPacking` |

Addons (defined in the game half of the file, lines ~23562–23826, delete and import instead):

| Minified | Import |
| --- | --- |
| `Hl` | `mergeGeometries` from `three/addons/utils/BufferGeometryUtils.js` |
| `$o`, `Xi`, `qe` | internals of the above two — delete |
| `ks` | `RoundedBoxGeometry` from `three/addons/geometries/RoundedBoxGeometry.js` |

**Gotcha:** several short names also occur as GLSL locals inside template strings (`b` in `aces()`, `an` in the sky aurora, `hc`, `mc`, `fp`, `fr`) and as property names (`.hp`). Renaming must be done on JS `Identifier` AST nodes only — never regex on the raw text.

Game-section renames (Task 3):

| Minified | New name | Minified | New name |
| --- | --- | --- | --- |
| `h0` | `Input` | `f0` | `Audio` |
| `u0` | `noiseBuffer` | `d0` | `reverbImpulse` |
| `xi` | `midiToHz` | `Nn` | `NOISE_GLSL` |
| `p0` | `mulberry32` | `As` | `BoxCollider` |
| `m0` | `Arena` | `g0` | `createSky` |
| `be` | `ARENA_RADIUS` | `Be` | `WALL_HEIGHT` |
| `xa` | `SUN_DIR` | `Zo` | `ParticleBuffer` |
| `x0` | `RingSystem` | `M0` | `ParticleSystem` |
| `v0` / `_0` | `PARTICLE_VERT` / `PARTICLE_FRAG` | `J` | `rand` |
| `y0` | `Tracers` | `S0` | `Decals` |
| `E0` | `Shells` | `w0` / `T0` / `b0` | `BLOOM_DOWN_FRAG` / `BLOOM_UP_FRAG` / `COMPOSITE_FRAG` |
| `wr` | `FULLSCREEN_VERT` | `A0` | `PostFX` |
| `Ln` | `damp4` | `R0` | `Player` |
| `tt` | `VIEWMODEL_MATS` | `ot` / `Ae` / `Ma` / `Vl` / `Gl` / `za` / `Oa` | `box` / `rbox` / `cyl` / `ring` / `cone` / `makeHand` / `makeLeftHand` |
| `C0` | `buildGunBase` | `P0` / `L0` / `D0` | `buildRifleModel` / `buildShotgunModel` / `buildDmrModel` |
| `Jo` / `U0` | `_tmpV` / `applyFlashTransform` | `I0` | `MuzzleFlash` |
| `tl` | `DEG` | `pn` | `rand` |
| `Wn` | `damp` | `el` | `smooth01` |
| `Mi` | `easeOutCubic` | `N0` | `WEAPONS` |
| `Tr` / `br` / `F0` | `VM_HIP_OFFSET` / `VM_SPRINT_OFFSET` / `VM_ADS_OFFSET` | `z0` | `WeaponState` |
| `O0` | `Weapons` | `Ar` | `ENEMIES` |
| `nn` | `rand` | `Rs` | `damp` |
| `B0` | `ZERO_MATRIX` | `Cs` | `MAX_PER_TYPE` |
| `Ps` | `lerpAngle` | `k0` | `buildEnemyRig` |
| `Rr` | `makeEnemyMaterial` | `Ei` / `H0` / `V0` | `_rayTmp` / `_capA` / `_capB` |
| `Hs` | `raySphere` | `nl` | `rayCapsule` |
| `G0` | `Enemies` | `W0` | `HUD` |
| `il` | `rand` | `Cr` | `damp` |
| `q0` | `UP` | `X0` | `Game` |
| `Y0` | `canvas` | | |

(`J`, `pn`, `nn`, `il` are four copies of the same `rand(a,b)`; `Wn`, `Rs`, `Cr` are three aliases of `MathUtils.damp`. They collapse into one export each in `core/mathx.js`.)

---

### Task 1: Tooling — three, ESLint, test script

**Files:**
- Modify: `package.json`
- Create: `eslint.config.js`

**Interfaces:**
- Produces: `npm run lint` (ESLint `no-undef` over `games/onslaught/src`), `npm test` (runs lint; later tasks append checks).

- [ ] **Step 1: Install dependencies**

```powershell
npm install --save-exact three@0.170.0
npm install --save-dev eslint@9 globals lil-gui acorn acorn-walk
```
Expected: `package.json` gains `"three": "0.170.0"` under `dependencies`; devDependencies gain `eslint`, `globals`, `lil-gui`, `acorn`, `acorn-walk`.

- [ ] **Step 2: Create `eslint.config.js`**

```js
import globals from "globals";

export default [
  {
    files: ["games/onslaught/src/**/*.js", "scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "off",
    },
  },
];
```

- [ ] **Step 3: Add scripts to `package.json`**

Replace the `scripts` block with:
```json
"scripts": {
  "dev": "vite --config games/onslaught/vite.config.js",
  "build:game": "vite build --config games/onslaught/vite.config.js",
  "build": "node scripts/build.mjs",
  "serve": "python3 -m http.server 4176 --directory dist",
  "dev:portal": "npm run build && npm run serve",
  "lint": "eslint games/onslaught/src",
  "test": "npm run lint",
  "deploy:cloudflare": "npm run build && npx wrangler@4 pages deploy dist --project-name bench-portal --branch main"
}
```

- [ ] **Step 4: Run lint on the current bundle**

Run: `npm run lint`
Expected: exit 0 (the bundle is self-contained; `no-undef` finds nothing). If it reports `__THREE_DEVTOOLS__` as undefined, add `"__THREE_DEVTOOLS__": "readonly"` to `globals` in the config; it disappears in Task 2 anyway.

- [ ] **Step 5: Verify dev server still boots**

Run: `npm run dev` (background), open `http://localhost:5173/`, confirm title `ONSLAUGHT`, `DEPLOY` button, no console errors. Stop the server.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json eslint.config.js
git commit -m "Add three@0.170.0, ESLint no-undef, and lint/test scripts for the Onslaught fork"
```

---

### Task 2: Unbundle Three.js and rename its identifiers

**Files:**
- Modify: `games/onslaught/src/main.js` (delete lines 1–22450 and the addon block `function Hl` … end of `class ks`; prepend imports; AST rename)
- Create (outside repo, do not commit): `$env:TEMP\onslaught-rename.mjs`

**Interfaces:**
- Produces: `main.js` that starts with `import { … } from "three"` and uses real Three.js names. All game code otherwise byte-identical.

- [ ] **Step 1: Write the AST rename script to `$env:TEMP\onslaught-rename.mjs`**

```js
// Usage: node onslaught-rename.mjs <file> <map.json>
// Renames JS Identifier nodes (not member properties, not object keys) per the map.
// Refuses to run if a mapped name appears in a declaration position (shadowing).
import { readFileSync, writeFileSync } from "node:fs";
import * as acorn from "acorn";
import * as walk from "acorn-walk";

const [file, mapFile] = process.argv.slice(2);
const src = readFileSync(file, "utf8");
const map = JSON.parse(readFileSync(mapFile, "utf8"));
const ast = acorn.parse(src, { ecmaVersion: 2023, sourceType: "module" });

const edits = [];
const declared = [];
const skip = new Set(); // node starts to skip (property keys, non-computed member props)

walk.full(ast, (node) => {
  if (node.type === "MemberExpression" && !node.computed) skip.add(node.property.start);
  if (node.type === "Property" && !node.computed && !node.shorthand) skip.add(node.key.start);
  if ((node.type === "MethodDefinition" || node.type === "PropertyDefinition") && !node.computed) skip.add(node.key.start);
  if (node.type === "VariableDeclarator" && node.id.type === "Identifier" && map[node.id.name]) declared.push(`${node.id.name}@${node.id.start}`);
  if ((node.type === "FunctionDeclaration" || node.type === "ClassDeclaration") && node.id && map[node.id.name]) declared.push(`${node.id.name}@${node.id.start}`);
});
walk.full(ast, (node) => {
  if (node.type === "Identifier" && map[node.name] && !skip.has(node.start)) edits.push([node.start, node.end, map[node.name]]);
});

if (declared.length && !process.argv.includes("--allow-declarations")) {
  console.error("Mapped names are declared in this file (shadowing?):\n" + declared.join("\n"));
  process.exit(1);
}
edits.sort((a, b) => b[0] - a[0]);
let out = src;
for (const [s, e, r] of edits) out = out.slice(0, s) + r + out.slice(e);
writeFileSync(file, out);
console.log(`${edits.length} identifiers renamed`);
```

- [ ] **Step 2: Write the Three.js map to `$env:TEMP\three-map.json`**

```json
{"b":"Vector3","It":"Vector2","an":"Quaternion","Ee":"Euler","Zt":"Matrix4","Pt":"Color","jt":"MathUtils","ne":"Object3D","xe":"Group","zs":"Scene","Ut":"Mesh","_a":"InstancedMesh","le":"MeshStandardMaterial","Zi":"MeshBasicMaterial","pe":"ShaderMaterial","zl":"MeshDepthMaterial","Le":"BufferGeometry","Xs":"InstancedBufferGeometry","Ye":"BufferAttribute","he":"Float32BufferAttribute","fe":"InstancedBufferAttribute","te":"BoxGeometry","He":"PlaneGeometry","ni":"SphereGeometry","ei":"CylinderGeometry","Ji":"ConeGeometry","Di":"TorusGeometry","qs":"CircleGeometry","Na":"OctahedronGeometry","Ue":"PerspectiveCamera","La":"OrthographicCamera","r0":"WebGLRenderer","Sn":"WebGLRenderTarget","ga":"PMREMGenerator","Zn":"PointLight","kl":"DirectionalLight","Ol":"HemisphereLight","Ua":"FogExp2","gn":"DynamicDrawUsage","Qn":"HalfFloatType","Ne":"LinearFilter","Ce":"BackSide","Ie":"DoubleSide","Fn":"FrontSide","$n":"NormalBlending","Mn":"AdditiveBlending","al":"CustomBlending","Dn":"AddEquation","Pr":"OneFactor","rl":"PCFSoftShadowMap","_n":"NoToneMapping","_l":"RGBADepthPacking","Hl":"mergeGeometries","ks":"RoundedBoxGeometry"}
```

- [ ] **Step 3: Cut the library out of `main.js`**

Find the two anchors in the file: the line `class h0 {` (Input; currently line 22451) and the line `function Hl(i, t = !1) {` (currently 23562) through the closing `}` of `class ks extends te {` (the line before `const Nn = \``, currently 23826). Delete lines 1 to the line before `class h0 {`, and delete from `function Hl(` through the line before `const Nn = \``. Use a small Node one-off (paths absolute):

```js
// $env:TEMP\onslaught-cut.mjs
import { readFileSync, writeFileSync } from "node:fs";
const f = process.argv[2];
const L = readFileSync(f, "utf8").split("\n");
const a = L.findIndex((l) => l.startsWith("class h0 {"));
const h = L.findIndex((l) => l.startsWith("function Hl(i, t = !1) {"));
const n = L.findIndex((l) => l.startsWith("const Nn = `"));
if (a < 0 || h < 0 || n < 0 || !(a < h && h < n)) throw new Error(`anchors ${a} ${h} ${n}`);
const out = [...L.slice(a, h), ...L.slice(n)];
writeFileSync(f, out.join("\n"));
console.log(`kept ${out.length} lines`);
```
Run: `node $env:TEMP\onslaught-cut.mjs games\onslaught\src\main.js`
Expected: `kept ~6200 lines`.

- [ ] **Step 4: Run the rename**

Run: `node $env:TEMP\onslaught-rename.mjs games\onslaught\src\main.js $env:TEMP\three-map.json`
Expected: `~450 identifiers renamed`, exit 0. If it exits 1 listing declarations, inspect each `name@offset`: it is a local that happens to share a minified name. Rename that local by hand to something unique first (e.g. `b` → `bLocal`), then rerun.

- [ ] **Step 5: Prepend imports**

Insert at the top of `main.js`:
```js
import {
  Vector3, Vector2, Quaternion, Euler, Matrix4, Color, MathUtils, Object3D, Group, Scene,
  Mesh, InstancedMesh, MeshStandardMaterial, MeshBasicMaterial, ShaderMaterial, MeshDepthMaterial,
  BufferGeometry, InstancedBufferGeometry, BufferAttribute, Float32BufferAttribute, InstancedBufferAttribute,
  BoxGeometry, PlaneGeometry, SphereGeometry, CylinderGeometry, ConeGeometry, TorusGeometry, CircleGeometry, OctahedronGeometry,
  PerspectiveCamera, OrthographicCamera, WebGLRenderer, WebGLRenderTarget, PMREMGenerator,
  PointLight, DirectionalLight, HemisphereLight, FogExp2,
  DynamicDrawUsage, HalfFloatType, LinearFilter, BackSide, DoubleSide, FrontSide,
  NormalBlending, AdditiveBlending, CustomBlending, AddEquation, OneFactor, PCFSoftShadowMap, NoToneMapping, RGBADepthPacking,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
```

- [ ] **Step 6: Lint for undefined names**

Run: `npm run lint`
Expected: exit 0. Any `'Xy' is not defined` means a library identifier was missed by the map: look up its definition in the original bundle (`git show HEAD:games/onslaught/src/main.js | Select-String "^class Xy |^  Xy = |^const Xy"`), add it to the map and the import list, rerun Steps 4–6.

- [ ] **Step 7: Format and boot**

Run: `npx prettier --write games/onslaught/src/main.js; npm run dev`
Open `http://localhost:5173/`, click nothing; confirm no console errors and `window.game.renderer.getContext().constructor.name === "WebGL2RenderingContext"` via devtools. Then append `?debug&god` to the URL: the game auto-starts; confirm enemies spawn and take damage for 30 s. Stop the server.

- [ ] **Step 8: Commit**

```powershell
git add games/onslaught/src/main.js
git commit -m "Unbundle Three.js from the Onslaught fork: import three@0.170.0 and restore real identifiers"
```

---

### Task 3: Rename game identifiers and split into modules

**Files:**
- Modify then delete: `games/onslaught/src/main.js` (becomes the bootstrap only)
- Create: everything under `games/onslaught/src/` listed in the layout below
- Modify: `games/onslaught/index.html` (script src unchanged: `./src/main.js`)

**Interfaces:**
- Produces the module graph every later task edits. Exact exports per file are in the table.

Layout and contents (source ranges are by anchor since line numbers shift):

| File | Moves in (by current name) | Exports |
| --- | --- | --- |
| `core/mathx.js` | `rand` (collapse `J`,`pn`,`nn`,`il`), `damp` (= `MathUtils.damp`; collapse `Wn`,`Rs`,`Cr`), `damp4` (`Ln`), `lerpAngle` (`Ps`), `smooth01` (`el`), `easeOutCubic` (`Mi`), `DEG` (`tl`), `raySphere` (`Hs`), `rayCapsule` (`nl`) + their temp vectors | all of those |
| `core/input.js` | `class h0` | `Input` |
| `core/rng.js` | `p0` | `mulberry32` (replaced by `RNG` in Task 8) |
| `render/shaders/noise.glsl.js` | `Nn` | `NOISE_GLSL` |
| `audio/audio.js` | `u0`, `d0`, `xi`, `class f0` | `Audio` |
| `data/weapons.js` | `N0`, `Tr`, `br`, `F0` | `WEAPONS`, `VM_HIP_OFFSET`, `VM_SPRINT_OFFSET`, `VM_ADS_OFFSET` |
| `data/enemies.js` | `Ar`, `Cs` | `ENEMIES`, `MAX_PER_TYPE` |
| `data/tuning.js` | `be`, `Be`, `xa` | `ARENA_RADIUS`, `WALL_HEIGHT`, `SUN_DIR` |
| `sim/arena.js` | `class As`, `class m0` (whole class for now; view code is carved out in Task 10) | `BoxCollider`, `Arena` |
| `sim/player.js` | `class R0` | `Player` |
| `sim/weapons.js` | `class z0`, `class O0` (whole; carved in Task 10) | `WeaponState`, `Weapons` |
| `sim/enemies.js` | `class G0`, `B0` (whole; carved in Task 10) | `Enemies` |
| `render/sky.js` | `g0` | `createSky` |
| `render/fx/particles.js` | `v0`, `_0`, `class Zo`, `class x0`, `class M0` | `ParticleSystem` |
| `render/fx/tracers.js` | `class y0` | `Tracers` |
| `render/fx/decals.js` | `class S0` | `Decals` |
| `render/fx/shells.js` | `class E0` | `Shells` |
| `render/postfx.js` | `w0`, `T0`, `b0`, `wr`, `class A0` | `PostFX` |
| `render/weapon-view.js` | `tt`, `ot`, `Ae`, `Ma`, `Vl`, `Gl`, `za`, `Oa`, `C0`, `P0`, `L0`, `D0`, `Jo`, `U0`, `class I0` | `buildRifleModel`, `buildShotgunModel`, `buildDmrModel`, `MuzzleFlash`, `VIEWMODEL_MATS` |
| `render/enemy-view.js` | `k0`, `Rr` | `buildEnemyRig`, `makeEnemyMaterial` |
| `ui/hud.js` | `class W0` | `HUD` |
| `game/game.js` | `q0`, `class X0` | `Game` |
| `main.js` | the trailing bootstrap (`const Y0 = document.getElementById("game"); try { new X0(Y0) } …`) | — |

- [ ] **Step 1: Rename game identifiers in place**

Write `$env:TEMP\game-map.json` from the "Game-section renames" table above (all pairs, e.g. `{"h0":"Input","f0":"Audio", …, "X0":"Game","Y0":"canvas"}`). For the four `rand` aliases and three `damp` aliases, map each to the same target name (`"J":"rand","pn":"rand","nn":"rand","il":"rand","Wn":"damp","Rs":"damp","Cr":"damp"`).

Run: `node $env:TEMP\onslaught-rename.mjs games\onslaught\src\main.js $env:TEMP\game-map.json --allow-declarations`
Expected: `~1400 identifiers renamed`.

Then delete the now-duplicate declarations by hand: keep one `const rand = (i, t) => i + Math.random() * (t - i);` and one `const damp = MathUtils.damp;`, remove the other three/two.

Run: `npm run lint; npm run dev` → boots, `?debug&god` plays 30 s. Commit:
```powershell
git add games/onslaught/src/main.js
git commit -m "Rename Onslaught game identifiers to descriptive names"
```

- [ ] **Step 2: Cut classes into files**

For each row of the layout table, create the file, paste the moved declarations verbatim, add `export` to each top-level declaration listed under Exports, and add imports at the top: named Three.js imports it needs (run `npm run lint` — every `'X' is not defined` is either a Three.js name → import from `"three"`, or a game symbol → import from the file that exports it per the table). Cross-file dependencies to expect:

- `sim/arena.js` imports `NOISE_GLSL`, `mulberry32`, `ARENA_RADIUS`, `WALL_HEIGHT`, `SUN_DIR`, `mergeGeometries`, `rand`.
- `render/sky.js` imports `NOISE_GLSL`.
- `render/fx/particles.js` imports `NOISE_GLSL`, `rand`.
- `render/weapon-view.js` imports `RoundedBoxGeometry`, `rand`.
- `sim/weapons.js` imports `WEAPONS`, `VM_*_OFFSET`, `buildRifleModel`, `buildShotgunModel`, `buildDmrModel`, `MuzzleFlash`, `damp`, `smooth01`, `easeOutCubic`, `DEG`, `rand`.
- `render/enemy-view.js` imports `NOISE_GLSL`, `MAX_PER_TYPE`.
- `sim/enemies.js` imports `ENEMIES`, `MAX_PER_TYPE`, `buildEnemyRig`, `makeEnemyMaterial`, `raySphere`, `rayCapsule`, `lerpAngle`, `damp`, `rand`, `ARENA_RADIUS`.
- `game/game.js` imports every system class plus `damp`, `rand`, `SUN_DIR`, `ARENA_RADIUS`.
- `main.js` becomes exactly:

```js
import { Game } from "./game/game.js";

const canvas = document.getElementById("game");
try {
  new Game(canvas);
} catch (err) {
  console.error(err);
  const box = document.createElement("div");
  box.style.cssText =
    "position:fixed;left:20px;top:20px;color:#f66;font:14px monospace;z-index:99;white-space:pre-wrap;max-width:90vw";
  box.textContent = "Failed to start: " + (err && err.stack ? err.stack : err);
  document.body.appendChild(box);
}
```

- [ ] **Step 3: Lint until clean**

Run: `npm run lint`
Expected: exit 0. Iterate imports until it is.

- [ ] **Step 4: Check file sizes**

Run: `Get-ChildItem -Recurse games\onslaught\src -Filter *.js | ForEach-Object { "$((Get-Content $_.FullName | Measure-Object -Line).Lines) $($_.FullName)" } | Sort-Object -Descending`
Expected: `audio/audio.js` (~1000), `sim/arena.js` (~550), `sim/enemies.js` (~550), `sim/weapons.js` (~530), `game/game.js` (~650), `render/fx/particles.js` (~540) are the largest. `audio.js` and `game.js` exceed 600; split `audio.js` into `audio/audio.js` (bus, spatial, `update`, listener) and `audio/synth.js` (all the `gunshot`/`impact*`/`enemy*`/music methods moved to functions taking the bus) only if a clean seam is obvious; otherwise leave and note it in the commit message. `game.js` is split in Task 10.

- [ ] **Step 5: Boot and play**

Run: `npm run dev`, open `/?debug&god`, play 60 s: fire all three weapons, reload, ADS, sprint, slide, kill a Behemoth, reach wave 2. Zero console errors. Stop server.

- [ ] **Step 6: Commit**

```powershell
git add games/onslaught/src
git commit -m "Split Onslaught into core/data/sim/render/audio/ui/game modules"
```

---

### Task 4: Theme module, fonts, title, HUD restyle

**Files:**
- Create: `games/onslaught/src/theme/theme.js`
- Modify: `games/onslaught/index.html` (fonts, copy), `games/onslaught/src/ui/style.css`, `games/onslaught/src/ui/hud.js` (`showMenu` defaults), `games/onslaught/src/main.js` (apply CSS vars)

**Interfaces:**
- Produces: `theme` object (below). Later tasks read `theme.sky`, `theme.lights`, `theme.arena`, `theme.enemies`, `theme.fx`, `theme.grade`, `theme.ui`, `theme.strings`.

- [ ] **Step 1: Create `theme/theme.js`**

```js
// Single source of truth for the game's look. Nothing else hardcodes a color.
// Colors are hex numbers for Three.js and CSS strings for the DOM.
export const GAME_TITLE = "UNTITLED ARENA";

export const theme = {
  strings: {
    title: GAME_TITLE,
    kicker: "PROVING GROUND // SITE 04",
    subtitle: "HOLD THE LINE",
    deploy: "DEPLOY",
    deployingBanner: ["DEPLOYING", "HOLD THE ARENA"],
    footer: "THREE.JS · WEBGL2 · CUSTOM GLSL PIPELINE · PROCEDURAL AUDIO",
  },
  sky: {
    horizon: 0xeadfcb,
    zenith: 0x6e9bc4,
    fog: 0xd8cbb3,
    sun: 0xfff1d6,
    dust: 0xe0d2b8,
  },
  lights: {
    sun: { color: 0xfff0d8, intensity: 3.2 },
    hemi: { sky: 0x8fb3d9, ground: 0xb89c72, intensity: 0.9 },
    fog: { color: 0xd8cbb3, density: 0.0035 },
    gate: { color: 0xff5a1f, intensity: 40 },
    perimeter: { color: 0xffc98a, intensity: 10 },
    weaponKey: { color: 0xfff0d8, intensity: 2.2 },
    weaponHemi: { sky: 0x8fb3d9, ground: 0xb89c72, intensity: 1.0 },
    weaponFill: { color: 0xffd9b0, intensity: 0.6 },
    envIntensity: { world: 0.7, weapon: 0.8 },
  },
  arena: {
    concrete: 0x9a9184,
    dark: 0x6b655c,
    pillar: 0xb3aa9a,
    crate: 0xc7a36b,
    barrier: 0xd9d2c5,
    floor: 0x8f8778,
    accentHot: 0xff5a1f,
    accentDim: 0xb23a10,
    hazard: 0xffb020,
    white: 0xfff4e0,
    // GLSL vec3 literals for shaders that bake colors in
    accentHotVec: "vec3(1.0, 0.353, 0.122)",
    hazardVec: "vec3(1.0, 0.69, 0.125)",
  },
  enemies: {
    runner: { body: 0x14100e, glow: [1.0, 0.42, 0.0] },
    brute: { body: 0x1a120e, glow: [1.0, 0.16, 0.0] },
    spitter: { body: 0x201a14, glow: [0.78, 1.0, 0.23] },
  },
  fx: {
    tracer: [1, 0.85, 0.6],
    sparks: [1, 0.92, 0.8],
    pickup: [1, 0.35, 0.12],
    dust: [0.91, 0.86, 0.77],
    dustAlpha: 0.35,
  },
  grade: {
    exposure: 1.15,
    saturation: 0.95,
    contrast: 1.14,
    vignette: 0.18,
    grain: 0.02,
    chromatic: 0.002,
    bloom: 0.08,
    bloomThreshold: 1.6,
    bloomKnee: 0.5,
    shadowTint: [1.04, 0.98, 0.92],
  },
  ui: {
    ink: "#141210",
    paper: "rgba(245, 238, 225, 0.86)",
    dim: "rgba(20, 18, 16, 0.6)",
    accent: "#ff5a1f",
    warn: "#d9771b",
    danger: "#b8231c",
    fontUi: '"Barlow Condensed", "Arial Narrow", Arial, sans-serif',
    fontTitle: '"Big Shoulders Stencil Text", "Impact", "Arial Black", sans-serif',
  },
};

export function applyThemeCss(root = document.documentElement) {
  const u = theme.ui;
  root.style.setProperty("--ui", u.ink);
  root.style.setProperty("--paper", u.paper);
  root.style.setProperty("--dim", u.dim);
  root.style.setProperty("--accent", u.accent);
  root.style.setProperty("--warn", u.warn);
  root.style.setProperty("--danger", u.danger);
  root.style.setProperty("--font-ui", u.fontUi);
  root.style.setProperty("--font-title", u.fontTitle);
}

export function applyThemeStrings(doc = document) {
  const s = theme.strings;
  doc.title = s.title;
  const set = (sel, text) => {
    const el = doc.querySelector(sel);
    if (el) el.textContent = text;
  };
  set(".title-kicker", s.kicker);
  set(".title", s.title);
  set(".subtitle", s.subtitle);
  set("#btn-start", s.deploy);
  set(".menu-foot", s.footer);
}
```

- [ ] **Step 2: Wire it in `main.js`**

Add before `new Game(canvas)`:
```js
import { applyThemeCss, applyThemeStrings } from "./theme/theme.js";
applyThemeCss();
applyThemeStrings();
```

- [ ] **Step 3: Fonts and copy in `index.html`**

Replace the Google Fonts `<link>` with:
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Big+Shoulders+Stencil+Text:wght@800;900&display=swap" rel="stylesheet">
```
Change `<title>ONSLAUGHT</title>` to `<title>UNTITLED ARENA</title>`, `<h1 class="title">ONSLAUGHT</h1>` to `UNTITLED ARENA`, the kicker to `PROVING GROUND // SITE 04`, and the subtitle to `HOLD THE LINE` (the JS also sets these; the HTML is the no-JS fallback).

- [ ] **Step 4: `hud.js` menu defaults**

In `HUD.showMenu(t, e = "ONSLAUGHT", n = "DEPLOY", s = null, r = "HOLD THE LINE AGAINST THE SWARM")` replace the default parameter values with `theme.strings.title`, `theme.strings.deploy`, `theme.strings.subtitle` (import `theme`). In `game.js` `start()`, replace `this.hud.banner("DEPLOYING", "HOLD THE ARENA", 2.5)` with `this.hud.banner(...theme.strings.deployingBanner, 2.5)`.

- [ ] **Step 5: Restyle `style.css`**

Replace the `:root` block with:
```css
:root {
  --ui: #141210;
  --paper: rgba(245, 238, 225, 0.86);
  --dim: rgba(20, 18, 16, 0.6);
  --accent: #ff5a1f;
  --warn: #d9771b;
  --danger: #b8231c;
  --font-ui: "Barlow Condensed", "Arial Narrow", Arial, sans-serif;
  --font-title: "Big Shoulders Stencil Text", "Impact", "Arial Black", sans-serif;
}
```
Then apply these rule changes (remove every `text-shadow` and glow `box-shadow`; panels get paper backgrounds):

```css
html, body { background: #d8cbb3; }
.ch-line { background: #141210; box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85); }
.ch-dot { background: #141210; box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85); }
.hitmarker .hm { background: #141210; box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.85); }
.hitmarker.kill .hm { background: var(--accent); box-shadow: none; }
.hitmarker.head .hm { background: var(--warn); box-shadow: none; }
.hud-bl, .hud-br, .hud-tr { background: var(--paper); padding: 14px 18px; border-left: 4px solid var(--accent); }
.hud-br, .hud-tr { border-left: 0; border-right: 4px solid var(--accent); }
.hp-label, .stat-k, .wpn-name, .fire-mode { color: var(--dim); }
.hp-bar { background: rgba(20, 18, 16, 0.12); border: 1px solid rgba(20, 18, 16, 0.4); transform: none; }
.hp-fill { background: var(--ui); box-shadow: none; }
.hp-fill.low { background: var(--danger); box-shadow: none; }
.stat-v, .ammo-mag, .ammo-res, .score, .banner-main, .popup { text-shadow: none; }
.ammo-mag.low { color: var(--warn); }
.ammo-mag.empty { color: var(--danger); }
.ammo-res { color: var(--dim); }
.slot { border: 1px solid rgba(20, 18, 16, 0.35); color: var(--dim); }
.slot.active { border-color: var(--accent); color: var(--accent); box-shadow: none; background: rgba(255, 90, 31, 0.12); }
.feed-item { background: var(--paper); color: var(--ui); border-right: 3px solid var(--accent); }
.feed-item.head { border-right-color: var(--warn); color: var(--ui); }
.feed-item.wave { border-right-color: var(--danger); color: var(--ui); }
.banner-main { color: #141210; background: var(--paper); display: inline-block; padding: 6px 28px; }
.banner-main.danger { color: var(--danger); text-shadow: none; }
.banner-sub { color: #141210; }
.hint { color: #141210; text-shadow: none; background: var(--paper); display: inline-block; padding: 4px 16px; left: 50%; right: auto; transform: translateX(-50%); }
.hint.warn { color: var(--danger); }
.popup { color: #141210; text-shadow: 0 0 0 transparent; }
.popup.head { color: var(--warn); }
.popup.kill { color: var(--accent); }
.popup.bonus { color: var(--accent); }
.menu { background: radial-gradient(ellipse at 50% 40%, rgba(234, 223, 203, 0.55), rgba(216, 203, 179, 0.92)); }
.menu-inner { border: 2px solid #141210; background: var(--paper); backdrop-filter: none; box-shadow: 12px 12px 0 #141210; }
.title-kicker { color: var(--accent); }
.title { background: none; -webkit-background-clip: initial; background-clip: initial; color: #141210; filter: none; }
.subtitle { color: var(--dim); }
.btn-start { color: #f5eee1; background: #141210; clip-path: none; box-shadow: 6px 6px 0 var(--accent); }
.btn-start:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--accent); }
.controls { color: var(--dim); }
.controls b { color: #141210; }
.menu-stats { color: var(--accent); }
.menu-foot { color: var(--dim); }
```
(Append these after the existing rules so they override; then delete the now-dead original glow declarations so the file stays readable.)

- [ ] **Step 6: Boot, screenshot menu, play 30 s**

Run: `npm run dev`. Menu shows new fonts, black title on paper card, orange accent. `document.title === "UNTITLED ARENA"`. Play with `?debug&god`: HUD panels readable. Note the 3D world is still the old cyan night — expected until Task 5.

- [ ] **Step 7: Commit**

```powershell
git add games/onslaught
git commit -m "Add theme module and restyle HUD/menu: Sunbaked Brutalist type, paper panels, placeholder title"
```

---

### Task 5: Sky rewrite, sun lighting, PMREM

**Files:**
- Modify: `games/onslaught/src/render/sky.js` (replace shader), `games/onslaught/src/sim/arena.js` (light block in `_build`), `games/onslaught/src/game/game.js` (weapon-scene lights, `_setupEnvironment`, env intensities)

**Interfaces:**
- Consumes: `theme.sky`, `theme.lights`, `SUN_DIR`.
- Produces: `createSky(sunDir)` → `{ mesh, update(t) }` (same shape as before).

- [ ] **Step 1: Replace `createSky` in `render/sky.js`**

```js
import { SphereGeometry, ShaderMaterial, Mesh, Color, BackSide } from "three";
import { NOISE_GLSL } from "./shaders/noise.glsl.js";
import { theme } from "../theme/theme.js";

export function createSky(sunDir) {
  const geo = new SphereGeometry(700, 48, 24);
  const mat = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uSunDir: { value: sunDir.clone().normalize() },
      uHorizon: { value: new Color(theme.sky.horizon) },
      uZenith: { value: new Color(theme.sky.zenith) },
      uFog: { value: new Color(theme.sky.fog) },
      uSun: { value: new Color(theme.sky.sun) },
      uDust: { value: new Color(theme.sky.dust) },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main(){
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime; uniform vec3 uSunDir;
      uniform vec3 uHorizon; uniform vec3 uZenith; uniform vec3 uFog; uniform vec3 uSun; uniform vec3 uDust;
      varying vec3 vWorldPos;
      ${NOISE_GLSL}
      void main(){
        vec3 d = normalize(vWorldPos - cameraPosition);
        float h = d.y;
        // bleached midday gradient: white-hot horizon, pale blue zenith
        vec3 col = mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.55));
        col = mix(uFog, col, smoothstep(-0.04, 0.10, h));
        // dust band hugging the horizon, drifting slowly
        float band = exp(-pow(max(h, 0.0) * 9.0, 1.6));
        float dn = fbm2(vec2(atan(d.z, d.x) * 3.0 + uTime * 0.01, h * 12.0));
        col = mix(col, uDust, band * (0.35 + 0.45 * dn));
        // sun disc + corona (HDR values so bloom picks it up)
        float m = dot(d, uSunDir);
        float disc = smoothstep(0.9993, 0.9996, m);
        float corona = exp(-(1.0 - m) * 260.0) * 1.6 + exp(-(1.0 - m) * 28.0) * 0.35;
        col += uSun * corona;
        col = mix(col, uSun * 6.0, disc);
        // slight haze brightening toward the sun near the horizon
        col += uHorizon * 0.15 * pow(max(m, 0.0), 6.0) * band;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const mesh = new Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return { mesh, update: (t) => { mat.uniforms.uTime.value = t; } };
}
```

- [ ] **Step 2: Sun direction**

In `data/tuning.js` change `SUN_DIR` to `new Vector3(0.55, 0.62, 0.35).normalize()` (higher sun → shorter, harder shadows than the old moon).

- [ ] **Step 3: Arena lights**

In `sim/arena.js` `_build`, locate the block that creates the `DirectionalLight(13622527, 3.6)`, `HemisphereLight(5927072, 3025448, 1.9)`, center `PointLight(6222591, 30, 30, 2)`, and `scene.fog = new FogExp2(1055276, 0.008)`. Replace with:
```js
const sun = new DirectionalLight(theme.lights.sun.color, theme.lights.sun.intensity);
sun.position.copy(SUN_DIR).multiplyScalar(90);
sun.castShadow = true;
// keep the existing shadow camera/mapSize configuration lines that follow in the original block
t.add(sun, sun.target);
this.sun = sun;
const hemi = new HemisphereLight(theme.lights.hemi.sky, theme.lights.hemi.ground, theme.lights.hemi.intensity);
t.add(hemi);
t.fog = new FogExp2(theme.lights.fog.color, theme.lights.fog.density);
```
Delete the center cyan `PointLight` and its `this.centerLight` reference (grep `centerLight` in `arena.js` `update` and remove that line too). The four perimeter `PointLight(10475775, 28, 40, 2)` become `new PointLight(theme.lights.perimeter.color, theme.lights.perimeter.intensity, 40, 2)`. The gate `PointLight(16738850, 40, 26, 2)` becomes `new PointLight(theme.lights.gate.color, theme.lights.gate.intensity, 26, 2)`.

- [ ] **Step 4: Weapon-scene lights and environment in `game.js`**

Replace `new DirectionalLight(12571903, 1.8)` / `new HemisphereLight(2768230, 723208, 1.1)` / `new PointLight(6222591, 1.2, 4, 2)` with the `theme.lights.weaponKey`, `weaponHemi`, `weaponFill` values. In `_setupEnvironment`, the ground plane `MeshBasicMaterial({ color: 461069 })` becomes `theme.arena.floor`; the ring `Color(0.3, 1.2, 1.6)` becomes `new Color(theme.arena.accentHot).multiplyScalar(1.4)`; the gate spheres `Color(2.2, 0.8, 0.2)` stay (orange). Set `scene.environmentIntensity = theme.lights.envIntensity.world` and `weaponScene.environmentIntensity = theme.lights.envIntensity.weapon`.

- [ ] **Step 5: Boot and compare**

Run: `npm run dev`. Menu camera orbit shows a bright bleached sky with a sun; ground lit warm with hard shadows from pillars. Screenshot to `$env:TEMP\task5-menu.png`. Play 30 s with `?debug&god`: nothing renders black; the weapon viewmodel is lit from above-right.

- [ ] **Step 6: Commit**

```powershell
git add games/onslaught/src
git commit -m "Retheme sky and lighting: midday sun, dust horizon, warm key light, sunlit PMREM"
```

---

### Task 6: Arena palette, wall grime, gate recolor

**Files:**
- Modify: `games/onslaught/src/sim/arena.js` (`_materials`, `_buildHexTop`, `_makePortal`)
- Create: `games/onslaught/src/render/shaders/surface.js`

**Interfaces:**
- Produces: `applySurfaceGrime(material, { scale, streaks })` — patches a `MeshStandardMaterial` via `onBeforeCompile` with world-space wear.

- [ ] **Step 1: Create `render/shaders/surface.js`**

```js
import { NOISE_GLSL } from "./noise.glsl.js";

// World-space concrete wear for flat procedural geometry under hard light.
// streaks: vertical rain/dust streaking strength (walls 1.0, floors 0.0).
export function applySurfaceGrime(material, { scale = 0.35, streaks = 1.0, key = "grime" } = {}) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWPos; varying vec3 vWNrm;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWNrm = normalize(mat3(modelMatrix) * normal);",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", `#include <common>\nvarying vec3 vWPos; varying vec3 vWNrm;\n${NOISE_GLSL}`)
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        // pick the two world axes that best span this face
        vec3 an = abs(vWNrm);
        vec2 p = an.y > 0.7 ? vWPos.xz : (an.x > an.z ? vWPos.zy : vWPos.xy);
        float wear = noise2(p * ${scale.toFixed(3)} * 2.0) * 0.6 + noise2(p * ${scale.toFixed(3)} * 11.0) * 0.4;
        float stain = smoothstep(0.4, 0.8, fbm2(p * ${scale.toFixed(3)} + 7.0));
        float streak = ${streaks.toFixed(3)} * (1.0 - an.y) * smoothstep(0.35, 0.9, fbm2(vec2(p.x * 2.5, p.y * 0.25 + 3.0))) * smoothstep(1.0, 0.0, fract(vWPos.y * 0.11));
        // formwork seams every 2.4 units on walls
        float seam = (1.0 - an.y) * smoothstep(0.03, 0.0, abs(fract(vWPos.y / 2.4) - 0.5) - 0.47);
        diffuseColor.rgb *= (0.86 + 0.28 * wear) * (1.0 - 0.28 * stain) * (1.0 - 0.22 * streak) * (1.0 - 0.35 * seam);`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor * (0.8 + 0.4 * wear) + stain * 0.2, 0.05, 1.0);`,
      );
  };
  material.customProgramCacheKey = () => key;
  return material;
}
```

- [ ] **Step 2: Recolor `_materials`**

Replace the hex literals with `theme.arena.*`: `wall: concrete`, `dark`, `pillar`, `crate`, `barrier`; `emCyan` → `emissive: theme.arena.accentHot, emissiveIntensity: 1.4`; `emCyanDim` → `theme.arena.accentDim, 0.8`; `emOrange` → `theme.arena.hazard, 1.6`; `emWhite` → `theme.arena.white, 1.2`. Keep the material keys (`emCyan` etc.) so callers don't change, but add a comment `// name is historical; color comes from theme`. Then:
```js
applySurfaceGrime(this.mats.wall, { scale: 0.3, streaks: 1.0, key: "grimeWall" });
applySurfaceGrime(this.mats.dark, { scale: 0.3, streaks: 0.8, key: "grimeDark" });
applySurfaceGrime(this.mats.pillar, { scale: 0.45, streaks: 1.0, key: "grimePillar" });
applySurfaceGrime(this.mats.barrier, { scale: 0.6, streaks: 0.4, key: "grimeBarrier" });
```
Floor material base color `3818064` → `theme.arena.floor`. In the floor shader, replace `vec3(0.015, 0.018, 0.025)` (gap) with `vec3(0.06, 0.05, 0.045)`, and the three emissive lines: `vec3(0.15, 0.75, 1.0)` → `${theme.arena.accentHotVec}` scaled by `0.35`, `vec3(0.2, 0.8, 1.0) * ring * 1.0` → `${theme.arena.accentHotVec} * ring * 0.6`, keep the third (already orange). These are template-string edits; interpolate `theme.arena.accentHotVec`.

- [ ] **Step 3: Hex top and portal**

In `_buildHexTop`, replace `vec3(0.2, 0.85, 1.0)` and `vec3(0.6, 0.95, 1.0)` with `${theme.arena.accentHotVec}` and `${theme.arena.hazardVec}`. In `_makePortal`, the portal shader already uses warm colors (`vec3(1.0, 0.85, 0.6)`, `vec3(1.0, 0.45, 0.12)`); leave it. Its `light` intensity math in `update` (`40 + activity * 120`) reads `theme.lights.gate.intensity` as the base: `theme.lights.gate.intensity + n.activity * 120 + …`.

- [ ] **Step 4: Boot and inspect**

Run: `npm run dev`. Walls show formwork seams and streaking, floor is warm concrete with orange seams, pillars have wear; no shader compile errors in console (a bad chunk replace shows as `THREE.WebGLProgram: Shader Error`). Screenshot to `$env:TEMP\task6-arena.png`.

- [ ] **Step 5: Commit**

```powershell
git add games/onslaught/src
git commit -m "Retheme arena: concrete palette, procedural wall grime and formwork seams, orange accents"
```

---

### Task 7: Enemy palette, FX colors, post grade, debug panel

**Files:**
- Modify: `games/onslaught/src/data/enemies.js`, `games/onslaught/src/render/postfx.js`, `games/onslaught/src/render/fx/particles.js`, `games/onslaught/src/render/fx/tracers.js`, `games/onslaught/src/game/game.js`
- Create: `games/onslaught/src/debug/panel.js`

**Interfaces:**
- Produces: `mountDebugPanel(game)` — lil-gui bound to `game.postfx.u` and `theme.grade`.

- [ ] **Step 1: Enemy colors from theme**

In `data/enemies.js`, import `theme` and set for each type: `bodyColor: theme.enemies.<key>.body`, `glow: theme.enemies.<key>.glow`. All other numbers unchanged.

- [ ] **Step 2: Post grade defaults and shadow tint uniform**

In `render/postfx.js`, the `this.u` defaults become:
```js
uBloom: { value: theme.grade.bloom },
uExposure: { value: theme.grade.exposure },
uCA: { value: theme.grade.chromatic },
uVignette: { value: theme.grade.vignette },
uGrain: { value: theme.grade.grain },
uSat: { value: theme.grade.saturation },
uContrast: { value: theme.grade.contrast },
uShadowTint: { value: new Vector3(...theme.grade.shadowTint) },
```
`downMat` uniforms: `uThreshold: { value: theme.grade.bloomThreshold }`, `uKnee: { value: theme.grade.bloomKnee }`. In `COMPOSITE_FRAG`, add `uniform vec3 uShadowTint;` and replace `col = mix(col, col * vec3(0.93, 1.0, 1.1), (1.0 - l) * 0.35);` with `col = mix(col, col * uShadowTint, (1.0 - l) * 0.35);`.

In `game.js` `updateGame`, the lines that set `o.uExposure.value = 1.45 + …` and `o.uCA.value = .0035 + …` use theme values as the base: `theme.grade.exposure + this.weapons.adsSmooth * 0.06` and `theme.grade.chromatic + …`. In `updateIdle`, `uCA.value = .004` → `theme.grade.chromatic`.

- [ ] **Step 3: FX colors**

`render/fx/tracers.js` `fire(...)` default color `[1, .8, .45]` → `theme.fx.tracer`. In `render/fx/particles.js` `ParticleSystem.update`, the ambient mote emit uses `o ? .4 : 1, o ? .9 : .5, o ? 1 : .15` for color — replace with `theme.fx.dust[0], theme.fx.dust[1], theme.fx.dust[2]` and the alpha `.9` argument with `theme.fx.dustAlpha`. `impactSparks` color literal → `theme.fx.sparks`; `pickupBurst` color literal → `theme.fx.pickup`. In `game.js` the muzzle `PointLight(16752704, …)` and impact `PointLight(16760960, …)` stay (already warm).

- [ ] **Step 4: Debug panel**

```js
// debug/panel.js
import GUI from "lil-gui";
import { theme } from "../theme/theme.js";

export function mountDebugPanel(game) {
  const gui = new GUI({ title: "grade" });
  const u = game.postfx.u;
  gui.add(u.uExposure, "value", 0.4, 3, 0.01).name("exposure");
  gui.add(u.uSat, "value", 0, 2, 0.01).name("saturation");
  gui.add(u.uContrast, "value", 0.5, 2, 0.01).name("contrast");
  gui.add(u.uVignette, "value", 0, 1, 0.01).name("vignette");
  gui.add(u.uGrain, "value", 0, 0.2, 0.001).name("grain");
  gui.add(u.uBloom, "value", 0, 0.6, 0.005).name("bloom");
  gui.add(game.postfx.downMat.uniforms.uThreshold, "value", 0.5, 4, 0.05).name("bloom threshold");
  gui.add(game.renderer, "toneMappingExposure", 0.2, 3, 0.01).name("renderer exposure");
  const sun = game.arena.sun;
  if (sun) gui.add(sun, "intensity", 0, 8, 0.05).name("sun");
  gui.add({ dump: () => console.log(JSON.stringify({ exposure: u.uExposure.value, saturation: u.uSat.value, contrast: u.uContrast.value, vignette: u.uVignette.value, grain: u.uGrain.value, bloom: u.uBloom.value }, null, 2)) }, "dump").name("log values");
  gui.domElement.style.zIndex = "50";
  return gui;
}
```
Note: `game.js` sets `uExposure` every frame from `theme.grade.exposure`; when the panel is mounted, read from a mutable `game.grade` copy instead. Add in `Game` constructor: `this.grade = { ...theme.grade };` and use `this.grade.exposure` / `this.grade.chromatic` in `updateGame`/`updateIdle`; the panel binds `game.grade, "exposure"` instead of `u.uExposure` for that one control.

In `main.js`: `if (new URLSearchParams(location.search).has("debug")) import("./debug/panel.js").then((m) => m.mountDebugPanel(window.game));`

- [ ] **Step 5: Boot, tune, screenshot**

Run: `npm run dev`, open `/?debug&god`. Enemies are near-black with orange cores; spitter core green-yellow. Grade is warm, bright, low bloom. Adjust sliders until the image reads well, then update `theme.grade` with the dumped values. Screenshots to `$env:TEMP\task7-{menu,wave,ads,death}.png`.

- [ ] **Step 6: Commit**

```powershell
git add games/onslaught/src package.json package-lock.json
git commit -m "Retheme enemies and FX, warm post grade with theme-driven defaults, lil-gui debug panel"
```

---

### Task 8: Seeded RNG streams

**Files:**
- Modify: `games/onslaught/src/core/rng.js`, `games/onslaught/src/sim/arena.js`, `games/onslaught/src/sim/weapons.js`, `games/onslaught/src/sim/enemies.js`, `games/onslaught/src/game/game.js`, `games/onslaught/src/core/mathx.js`
- Create: `tests/rng.test.mjs`

**Interfaces:**
- Produces: `class RNG { constructor(seed); float(); range(a,b); int(n); pick(arr); chance(p); fork(label) }`, `parseSeed(search) → number`.

- [ ] **Step 1: Write the failing test `tests/rng.test.mjs`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { RNG } from "../games/onslaught/src/core/rng.js";

test("same seed → same sequence", () => {
  const a = new RNG(42), b = new RNG(42);
  for (let i = 0; i < 1000; i++) assert.equal(a.float(), b.float());
});
test("range/int/pick/chance are in bounds", () => {
  const r = new RNG(7);
  for (let i = 0; i < 1000; i++) {
    const x = r.range(-2, 3); assert.ok(x >= -2 && x < 3);
    const n = r.int(5); assert.ok(Number.isInteger(n) && n >= 0 && n < 5);
    assert.ok(["a", "b"].includes(r.pick(["a", "b"])));
    assert.equal(typeof r.chance(0.5), "boolean");
  }
});
test("fork gives independent but deterministic streams", () => {
  const a = new RNG(1).fork("combat"), b = new RNG(1).fork("combat"), c = new RNG(1).fork("ai");
  assert.equal(a.float(), b.float());
  assert.notEqual(a.float(), c.float());
});
```
Add to `package.json` scripts: `"test": "npm run lint && node --test tests/"`.

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/`
Expected: FAIL — `RNG` is not exported.

- [ ] **Step 3: Implement `core/rng.js`**

```js
// mulberry32: small, fast, good enough for gameplay. Deterministic across JS engines.
function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashLabel(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}

export class RNG {
  constructor(seed) {
    this.seed = seed >>> 0;
    this._next = mulberry32(this.seed);
  }
  float() { return this._next(); }
  range(a, b) { return a + this._next() * (b - a); }
  int(n) { return Math.floor(this._next() * n); }
  pick(arr) { return arr[Math.floor(this._next() * arr.length)]; }
  chance(p) { return this._next() < p; }
  fork(label) { return new RNG((this.seed ^ hashLabel(label)) >>> 0); }
}

export function parseSeed(search) {
  const s = new URLSearchParams(search).get("seed");
  if (s !== null && s !== "" && Number.isFinite(+s)) return (+s) >>> 0;
  return (Date.now() % 4294967296) >>> 0;
}
```
Keep the old `mulberry32` export name for one commit (`export { mulberry32 }`) until arena is switched below.

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: lint clean, 3 tests pass.

- [ ] **Step 5: Thread streams through the sim**

- `game/game.js` constructor: `this.seed = parseSeed(location.search); this.rng = new RNG(this.seed);` and pass `this.rng.fork("layout")` to `new Arena(scene, rng)`, `this.rng.fork("combat")` to `new Weapons(..., rng)`, `this.rng.fork("ai")` to `new Enemies(..., rng)`. `resetGame()` re-creates `this.rng` and re-forks the combat/ai streams (`this.weapons.rng = …; this.enemies.rng = …`) so every run from the same seed is identical; the arena layout stream is not reset (geometry is built once).
- `sim/arena.js`: constructor takes `rng`; `this.rng = rng` replaces `mulberry32(1337)`; call sites `this.rng()` → `this.rng.float()`.
- `sim/weapons.js`: every `rand(a, b)` and `Math.random()` inside fire/spread/pellet/recoil logic → `this.rng.range(a, b)` / `this.rng.float()`. Viewmodel jitter (muzzle flash scale/rotation in `MuzzleFlash.fire`) may keep `Math.random()` — it is in `render/`.
- `sim/enemies.js`: `rand(...)`/`Math.random()` in `spawn`, AI steer bias, growl timers, `_fireProjectile` → `this.rng`.
- `game/game.js` `startWave` (spitter/brute placement, spawn counts, gate pick), `onKill` (pickup drop `Math.random() < .13`), `spawnPickup` → `this.rng.fork("waves")` stored as `this.waveRng` (reset with the others).
- `core/mathx.js`: keep `rand` for render/audio use only.

- [ ] **Step 6: Show the seed**

In `game.js` where the death menu is built (`hud.showMenu(!0, "K.I.A.", "REDEPLOY", \`WAVE … ${d}s SURVIVED\`, …)`), append `<br>SEED ${this.seed}` to the stats HTML.

- [ ] **Step 7: Verify determinism by eye**

Run: `npm run dev`, open `/?debug&god&nospawn` twice in two tabs with `&seed=5`. `window.game.seed === 5` in both. Remove `nospawn`, keep `seed=5`, stand still in both tabs for 20 s: the first wave's enemy types and gates match between tabs (movement diverges later because input timing differs — expected until Task 9).

- [ ] **Step 8: Grep guard**

Run: `Select-String -Path games\onslaught\src\sim\*.js -Pattern "Math\.random"`
Expected: no output.

- [ ] **Step 9: Commit**

```powershell
git add games/onslaught/src tests package.json
git commit -m "Seeded RNG streams for layout, combat, AI and waves; seed shown on death screen"
```

---

### Task 9: Fixed-tick loop with interpolation

**Files:**
- Create: `games/onslaught/src/core/loop.js`, `tests/loop.test.mjs`
- Modify: `games/onslaught/src/game/game.js` (`loop`, `updateGame`, `updateIdle`, `render`), `games/onslaught/src/sim/player.js`, `games/onslaught/src/sim/enemies.js`, `games/onslaught/src/render/enemy-view.js` (after Task 10 the pose code lives there; in this task it is still `Enemies._render`)

**Interfaces:**
- Produces: `class FixedLoop { constructor({ tick = 1/60, maxSteps = 5 }); advance(frameDt, timeScale, stepFn) → alpha }`.
- Sim objects expose `prevPos`/`pos` (enemies) and `prevCamPos`/`camPos`, `prevCamQuat`/`camQuat` (player) for interpolation.

- [ ] **Step 1: Failing test `tests/loop.test.mjs`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { FixedLoop } from "../games/onslaught/src/core/loop.js";

test("steps exactly tick-sized slices and returns alpha", () => {
  const loop = new FixedLoop({ tick: 0.01, maxSteps: 5 });
  const dts = [];
  const alpha = loop.advance(0.025, 1, (dt) => dts.push(dt));
  assert.deepEqual(dts, [0.01, 0.01]);
  assert.ok(Math.abs(alpha - 0.5) < 1e-9);
});
test("caps steps per frame and drops the remainder", () => {
  const loop = new FixedLoop({ tick: 0.01, maxSteps: 3 });
  let n = 0;
  loop.advance(1.0, 1, () => n++);
  assert.equal(n, 3);
  assert.ok(loop.accumulator < 0.01);
});
test("timeScale slows the simulation, not the tick size", () => {
  const loop = new FixedLoop({ tick: 0.01 });
  let n = 0;
  loop.advance(0.02, 0.5, () => n++);
  assert.equal(n, 1);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `node --test tests/` → FAIL, module not found.

- [ ] **Step 3: Implement `core/loop.js`**

```js
export class FixedLoop {
  constructor({ tick = 1 / 60, maxSteps = 5 } = {}) {
    this.tick = tick;
    this.maxSteps = maxSteps;
    this.accumulator = 0;
  }
  // frameDt: wall seconds since last frame. timeScale: 1 = realtime, <1 = slow-mo.
  // Calls stepFn(tick) zero or more times. Returns alpha in [0,1) for render interpolation.
  advance(frameDt, timeScale, stepFn) {
    this.accumulator += frameDt * timeScale;
    let steps = 0;
    while (this.accumulator >= this.tick && steps < this.maxSteps) {
      stepFn(this.tick);
      this.accumulator -= this.tick;
      steps++;
    }
    if (steps === this.maxSteps && this.accumulator >= this.tick) this.accumulator = this.accumulator % this.tick;
    return this.accumulator / this.tick;
  }
}
```

- [ ] **Step 4: Tests pass**

Run: `npm test` → 6 tests pass.

- [ ] **Step 5: Rewire `Game.loop`**

Current shape (after Task 3 renames):
```js
loop(t) {
  let e = Math.min(.05, (t - this.last) / 1e3); this.last = t; …
  this.timeScale = damp(this.timeScale, this.slowmo > 0 ? .28 : 1, 7, e);
  const n = e * this.timeScale; this.time += n;
  (this.state === "playing" || this.state === "dead") ? this.updateGame(n, e) : this.updateIdle(n, e);
  …fx updates with (s, n)… this.render(); this.input.endFrame();
}
```
Becomes:
```js
loop(t) {
  let frameDt = Math.min(0.05, (t - this.last) / 1000);
  this.last = t;
  if (frameDt <= 0) frameDt = 1e-4;
  this.fps = damp(this.fps, 1 / frameDt, 2, frameDt);
  this.slowmo = Math.max(0, this.slowmo - frameDt);
  this.timeScale = damp(this.timeScale, this.slowmo > 0 ? 0.28 : 1, 7, frameDt);

  // look is applied per frame for aim latency; movement/combat step at fixed rate
  const playing = this.state === "playing" || this.state === "dead";
  if (playing) this.player.applyLook(this.input);

  const alpha = this.fixed.advance(frameDt, this.timeScale, (dt) => {
    this.time += dt;
    if (playing) this.stepGame(dt); else this.stepIdle(dt);
    this.input.endTick();
  });

  if (playing) this.presentGame(alpha, frameDt); else this.presentIdle(alpha, frameDt);
  const s = this.time;
  this.arena.update(s, frameDt); this.sky.update(s); this.particles.update(s, frameDt, this.camera.position);
  this.tracers.update(s); this.decals.update(s); this.shells.update(frameDt, (x, z) => this.arena.groundHeight(x, z));
  this.impactLight.intensity *= Math.exp(-28 * frameDt);
  this.hud.update(frameDt);
  this.audio.setListener(…unchanged…); this.audio.update(frameDt, …unchanged…);
  this.render();
  this.input.endFrame();
}
```
with `this.fixed = new FixedLoop()` in the constructor. Split the existing `updateGame(n, e)` into:
- `stepGame(dt)`: everything that mutates sim state — `player.update(dt, input, time)` (minus look), player events → audio/hud/weapons, `weapons.update`, `enemies.update`, `updateWaves`, `updatePickups`, death timer. Uses `dt`.
- `presentGame(alpha, frameDt)`: camera from interpolated player pose, weapon camera copy, muzzle light, crosshair spread, HUD sets, postfx uniform driving, hurtFx decay, death camera tilt. Uses `frameDt`.
Same split for `updateIdle` → `stepIdle` (enemies.update for the menu diorama) / `presentIdle` (orbit camera, postfx idle values).

- [ ] **Step 6: Input per tick vs per frame**

`Input` gains `endTick()` that clears `pressed` and `mousePressed` (edge-triggered keys are consumed by the sim), while `endFrame()` clears only `dx`, `dy`, `wheel`. Because `applyLook` consumes `dx/dy` per frame, set `input.dx = input.dy = 0` at the end of `applyLook`. Weapon switch via wheel is read in `stepGame`: move `wheel` clearing into `endTick()` as well.

- [ ] **Step 7: Interpolation state**

- `sim/player.js`: split `update` — new `applyLook(input)` does the yaw/pitch mouse lines (`this.yaw -= e.dx * nt; this.pitch -= e.dy * nt; clamp`). At the start of `update(dt, …)`, `this.prevCamPos.copy(this.camPos); this.prevCamQuat.copy(this.camQuat);`. Add both fields in the constructor and `reset`.
- `sim/enemies.js`: each enemy record gets `prevPos: new Vector3()`, `prevYaw`. At the top of the per-enemy loop in `update`: `o.prevPos.copy(o.pos); o.prevYaw = o.yaw;`. `spawn` initializes `prevPos` to `pos`.
- Rendering: `Enemies._render(alpha)` uses `root.position.lerpVectors(l.prevPos, l.pos, alpha)` and `lerpAngle(l.prevYaw, l.yaw, alpha)`. `Game.presentGame` sets `camera.position.lerpVectors(player.prevCamPos, player.camPos, alpha)` and `camera.quaternion.slerpQuaternions(player.prevCamQuat, player.camQuat, alpha)`. Since look is applied per frame but `camQuat` is only rebuilt in `player.update`, `applyLook` must also recompute `camQuat` from the new yaw/pitch (extract the existing camera-quaternion lines into `player.updateCameraPose()` and call it from both).

- [ ] **Step 8: Tick-based timers**

Weapon `cooldown`, `reload` timelines, `boltT`, `pumpT` already subtract `dt`; with fixed `dt` they are deterministic. Confirm no code path uses `performance.now()` or wall-clock inside `sim/`: `Select-String -Path games\onslaught\src\sim\*.js -Pattern "performance\.now|Date\.now"` → no output.

- [ ] **Step 9: Play test**

Run: `npm run dev`, `/?debug&god`. Movement and aim feel unchanged; at 144 Hz (or with `chrome://flags` forcing 30 Hz throttling via DevTools Performance → CPU 6× slowdown) enemies and camera move smoothly without 60 Hz stepping. Slow-mo on wave clear still works. Fire rate unchanged (VK-7 800 rpm ≈ 13.3 shots/s: hold fire for 3 s, mag 30 → empties in ~2.25 s).

- [ ] **Step 10: Commit**

```powershell
git add games/onslaught/src tests
git commit -m "Fixed 60 Hz simulation tick with per-frame look and interpolated camera/enemy transforms"
```

---

### Task 10: Sim/view seams and boundary check

**Files:**
- Create: `games/onslaught/src/sim/world.js`, `games/onslaught/src/sim/events.js`, `games/onslaught/src/render/arena-view.js`, `games/onslaught/src/sim/projectiles.js`, `scripts/check-sim-boundary.mjs`
- Modify: `games/onslaught/src/sim/arena.js`, `games/onslaught/src/sim/weapons.js`, `games/onslaught/src/sim/enemies.js`, `games/onslaught/src/render/enemy-view.js`, `games/onslaught/src/render/weapon-view.js`, `games/onslaught/src/game/game.js`

**Interfaces:**
- Produces: `class World { constructor({ seed, arena }); step(dt, inputFrame); events: Event[]; player; weapons; enemies; projectiles; arena; time; wave; score; kills }` — no THREE scene objects inside.
- `events.js` exports string constants: `EV_SHOT, EV_HIT, EV_KILL, EV_HURT, EV_DEAD, EV_RELOAD_STAGE, EV_SWITCH, EV_JUMP, EV_LAND, EV_STEP, EV_SLIDE, EV_WAVE_START, EV_WAVE_CLEAR, EV_PICKUP, EV_SPAWN, EV_PROJECTILE_HIT, EV_SLAM`.
- `inputFrame` shape: `{ move: {x, y}, yaw, pitch, fire, fireHeld, ads, reload, sprint, jump, crouch, switchTo (-1|0|1|2), wheel }`.

- [ ] **Step 1: Boundary check script `scripts/check-sim-boundary.mjs`**

```js
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve("games/onslaught/src");
const simDirs = ["sim", "data", "core"].map((d) => path.join(root, d));
const allowedThree = new Set(["Vector2", "Vector3", "Quaternion", "Euler", "Matrix4", "MathUtils", "Ray", "Box3", "Sphere"]);
const forbiddenGlobals = /\b(document|window|performance\.now|requestAnimationFrame|AudioContext|localStorage)\b/;
let bad = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!p.endsWith(".js")) continue;
    const src = readFileSync(p, "utf8");
    const rel = path.relative(root, p).replace(/\\/g, "/");
    for (const m of src.matchAll(/import\s+(?:\{([^}]*)\}|\*\s+as\s+\w+|\w+)\s+from\s+"([^"]+)"/g)) {
      const names = (m[1] || "").split(",").map((s) => s.trim().split(/\s+as\s+/)[0]).filter(Boolean);
      const from = m[2];
      if (from === "three") {
        for (const n of names) if (!allowedThree.has(n)) { console.error(`${rel}: imports THREE.${n} (not math)`); bad++; }
        if (!m[1]) { console.error(`${rel}: namespace import of three not allowed in sim`); bad++; }
      } else if (/\.\.\/(render|audio|ui|game|theme|debug)\//.test(from) || /^\.\.?\/(render|audio|ui|game|theme|debug)\//.test(from)) {
        console.error(`${rel}: imports ${from}`); bad++;
      } else if (from.startsWith("three/")) { console.error(`${rel}: imports ${from}`); bad++; }
    }
    if (rel.startsWith("sim/") || rel.startsWith("data/")) {
      const g = forbiddenGlobals.exec(src);
      if (g) { console.error(`${rel}: uses ${g[1]}`); bad++; }
      if (/Math\.random/.test(src)) { console.error(`${rel}: uses Math.random`); bad++; }
    }
  }
}
for (const d of simDirs) walk(d);
if (bad) { console.error(`${bad} boundary violation(s)`); process.exit(1); }
console.log("sim boundary OK");
```
Add to `package.json`: `"check:boundary": "node scripts/check-sim-boundary.mjs"` and make `"test": "npm run lint && npm run check:boundary && node --test tests/"`. Note `core/input.js` legitimately uses `document`/`window`; the check only applies the globals rule to `sim/` and `data/`, and `core/` is checked for imports only.

Run: `npm run check:boundary` → expect many violations (this is the to-do list for the task).

- [ ] **Step 2: Arena split**

`sim/arena.js` keeps: `BoxCollider`, and `Arena` reduced to `constructor(rng)`, `boxes`, `gates` (as `{pos, dir, activity, angle}` — no `mat`, no `light`), `groundHeight`, `resolveCircle`, `floorAt`, `raycast`, `update(time, dt)` (only `activity` decay). The geometry placement loop that today builds both `BoxGeometry` meshes and `BoxCollider`s is split: sim keeps a pure `layout()` that returns a list of `{kind: "wall"|"dark"|"pillar"|…, box: [cx, cz, hx, hz, y0, y1, yaw] , size: [w,h,d], offset: [x,y,z]}` records plus colliders; `render/arena-view.js` `buildArenaMeshes(scene, layout, theme)` consumes those records to make geometry, materials (`_materials`, `applySurfaceGrime`), portal meshes, hex top, hologram, and lights. `ArenaView.update(time, gates)` drives portal `uActivity` and gate light intensity from `gates[i].activity`. `Game` owns both: `this.arena = world.arena; this.arenaView = new ArenaView(scene, this.arena.layout, …)`.

- [ ] **Step 3: Enemies split**

`sim/enemies.js`: remove `_buildType`, `_render`, `_buildProjectiles`, `_updateProjectiles`, `types[*].meshes`, `uTime`. Keep the rig *measurements* needed by `raycast` (`hipH`, `headY`, `torsoBot`, `torsoTop`) by moving `buildEnemyRig`'s numeric proportions into a pure `rigMetrics(proportions)` in `sim/enemies.js`; the Object3D rig builder stays in `render/enemy-view.js` and calls the same `rigMetrics`. Projectiles move to `sim/projectiles.js` (`class Projectiles { constructor(arena, rng); fire(fromEnemy, player); update(dt, player, cb) }`) with hit callbacks emitting `EV_PROJECTILE_HIT` and `EV_SPLASH` events instead of calling `particles`/`audio`. `render/enemy-view.js` gets `class EnemyView { constructor(scene); sync(enemiesSim, alpha, time) }` containing the old `_buildType` and `_render` (pose interpolation from Task 9), plus `projectileMesh` sync.

- [ ] **Step 4: Weapons split**

`sim/weapons.js` keeps `WeaponState` and a `Weapons` class with: `current`, `weapon`, `weapons[]`, `adsTarget`, `sprintBlend` inputs, `update(dt, input, player, time)` covering fire cadence, spread/bloom, recoil impulses (calls `player.addRecoil`), reload stage machine (emits `EV_RELOAD_STAGE {stage}`), switching (emits `EV_SWITCH`), `getSpread(player)`, `resetAll`. Firing emits `EV_SHOT { origin, dir, def, tracer }` and the hit resolution stays in `world.js` (`fireRay`), which emits `EV_HIT`/`EV_KILL`/`EV_IMPACT`. `render/weapon-view.js` gets `class WeaponView { constructor(weaponCamera); sync(weaponsSim, player, alpha, time); onEvent(ev) }` with the viewmodel springs, bob, ADS blend, bolt/pump/mag animations, muzzle flash, and `muzzleWorld`. Shell ejection and muzzle smoke are triggered by `WeaponView.onEvent(EV_SHOT)`.

- [ ] **Step 5: `sim/world.js`**

```js
import { RNG } from "../core/rng.js";
import { Arena } from "./arena.js";
import { Player } from "./player.js";
import { Weapons } from "./weapons.js";
import { Enemies } from "./enemies.js";
import { Projectiles } from "./projectiles.js";
import { composeWave } from "../data/waves.js";
import * as EV from "./events.js";

export class World {
  constructor({ seed }) {
    this.seed = seed >>> 0;
    this.rng = new RNG(this.seed);
    this.arena = new Arena(this.rng.fork("layout"));
    this.player = new Player(this.arena);
    this.weapons = new Weapons(this.rng.fork("combat"));
    this.enemies = new Enemies(this.arena, this.rng.fork("ai"));
    this.projectiles = new Projectiles(this.arena);
    this.waveRng = this.rng.fork("waves");
    this.events = [];
    this.time = 0; this.wave = 0; this.waveActive = false; this.breakT = 4; this.queue = [];
    this.spawnTimer = 0; this.maxAlive = 10; this.spawnInterval = 1;
    this.score = 0; this.kills = 0; this.streak = 0; this.lastKillT = -10;
    this.pickups = []; this.slowmoRequest = 0;
  }
  emit(type, data) { this.events.push({ type, ...data }); }
  step(dt, input) {
    this.time += dt;
    const p = this.player;
    p.update(dt, input, this.time);
    for (const e of p.events) this.emit(e.type, e); // hurt/dead/jump/land/step/slide
    p.events.length = 0;
    this.weapons.update(dt, input, p, this.time, this);
    this.enemies.update(dt, p, this.time, this);
    this.projectiles.update(dt, p, this);
    if (!p.dead) { this.updateWaves(dt); this.updatePickups(dt); }
  }
  // fireRay, onPlayerHit, onSlam, onKill, startWave, updateWaves, waveCleared, spawnPickup, updatePickups
  // move here verbatim from game.js, replacing this.hud/this.audio/this.particles/this.decals/this.tracers
  // calls with this.emit(EV.*, {...}) carrying the same arguments.
}
```
`data/waves.js` exports `composeWave(wave, rng) → { queue: string[], maxAlive, spawnInterval, banner: [main, sub, danger] }` containing the exact formula from `startWave` (`6 + t*5 + floor(t*t*.45)` capped 130, brute/spitter counts, `maxAlive = min(14 + 4t, 64)`, `spawnInterval = max(.2, 1.1 - .06t)`).

- [ ] **Step 6: `Game` becomes presentation + orchestration**

`game/game.js` constructs `this.world = new World({ seed })`, builds all views/audio/HUD, and in `loop` calls `world.step(dt, this.input.frame())` inside the fixed loop, then drains `world.events` each frame through `this.handleEvent(ev)` — a `switch` that maps each `EV_*` to the exact `hud`/`audio`/`particles`/`decals`/`tracers`/`shells`/`shake`/`postfx` calls that used to sit inline in `Game`. `Input.frame()` returns the `inputFrame` object from current key state (`move`, `fire = mousePressed[0]`, `fireHeld = mouseDown[0]`, `ads = mouseDown[2]`, `reload = justPressed("KeyR")`, `sprint`, `jump = justPressed("Space")`, `crouch = key("KeyC")`, `switchTo` from `Digit1..3`, `wheel`). `game.js` should now be under 600 lines; if not, move `handleEvent` into `game/presenter.js`.

- [ ] **Step 7: Boundary and tests**

Run: `npm test` → lint clean, `sim boundary OK`, 6 tests pass.

- [ ] **Step 8: Play test**

`/?debug&god` 90 s: all three weapons fire with tracers, decals, sparks and sounds; reload animations play; enemies spawn, chase, attack, die with dissolve; spitter projectiles hit and splash; wave clears with banner, bonus ammo and slow-mo; pickups drop and collect; death → K.I.A. menu with seed. Zero console errors.

- [ ] **Step 9: Commit**

```powershell
git add games/onslaught/src scripts/check-sim-boundary.mjs package.json
git commit -m "Separate simulation from presentation: World steps headless, views sync from state, events drive FX/audio/HUD"
```

---

### Task 11: Headless determinism test

**Files:**
- Create: `tests/sim-determinism.test.mjs`, `tests/helpers/input-tape.mjs`

**Interfaces:**
- Consumes: `World` from Task 10, `inputFrame` shape.

- [ ] **Step 1: Input tape helper `tests/helpers/input-tape.mjs`**

```js
// Deterministic scripted input: 60 s of moving, looking, firing, reloading, switching.
export function tapeFrame(tick) {
  const t = tick / 60;
  const phase = Math.floor(t / 5) % 6;
  return {
    move: { x: phase === 1 ? 1 : phase === 3 ? -1 : 0, y: phase === 0 || phase === 4 ? 1 : 0 },
    yaw: Math.PI + Math.sin(t * 0.7) * 1.2,
    pitch: Math.sin(t * 0.3) * 0.15,
    fire: tick % 4 === 0 && phase !== 5,
    fireHeld: phase !== 5,
    ads: phase === 2,
    reload: tick % 600 === 0 && tick > 0,
    sprint: phase === 4,
    jump: tick % 300 === 0 && tick > 0,
    crouch: phase === 5,
    switchTo: tick % 900 === 0 && tick > 0 ? Math.floor(t / 15) % 3 : -1,
    wheel: 0,
  };
}
```

- [ ] **Step 2: Failing test `tests/sim-determinism.test.mjs`**

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { World } from "../games/onslaught/src/sim/world.js";
import { tapeFrame } from "./helpers/input-tape.mjs";

function run(seed, ticks) {
  const w = new World({ seed });
  w.startRun();
  const h = createHash("sha256");
  for (let i = 0; i < ticks; i++) {
    w.step(1 / 60, tapeFrame(i));
    w.events.length = 0;
    if (i % 60 === 0) {
      const p = w.player;
      h.update(`${p.pos.x.toFixed(6)},${p.pos.y.toFixed(6)},${p.pos.z.toFixed(6)},${p.hp},${w.wave},${w.score},${w.kills},${w.weapons.weapon.mag},${w.enemies.list.length};`);
      for (const e of w.enemies.list) h.update(`${e.type}:${e.pos.x.toFixed(5)},${e.pos.z.toFixed(5)},${e.hp.toFixed(3)},${e.state};`);
    }
  }
  return { hash: h.digest("hex"), wave: w.wave, kills: w.kills, alive: w.player.hp > 0 };
}

test("world runs headless for 60 s and is deterministic per seed", () => {
  const a = run(1, 3600), b = run(1, 3600);
  assert.equal(a.hash, b.hash);
  assert.ok(a.wave >= 1, "a wave should have started");
  assert.ok(a.kills > 0, "scripted fire should kill something");
});
test("different seeds diverge", () => {
  assert.notEqual(run(1, 1800).hash, run(2, 1800).hash);
});
```
`World.startRun()` is the headless equivalent of `Game.start()`'s sim part: `resetGame` state, `breakT = 4`, `waveActive = false`, `wave = 0`. Add it to `World` and have `Game.start()` call it.

- [ ] **Step 3: Run, expect failure or import error**

Run: `node --test tests/sim-determinism.test.mjs`
Expected first-run failures reveal remaining impurities: `ReferenceError: document is not defined` (a view import leaked into sim) or `Math.random` non-determinism (hash mismatch). Fix each at the source in `sim/` — never by stubbing globals in the test.

- [ ] **Step 4: Pass**

Run: `npm test` → all tests pass; determinism test completes in < 5 s (if slower, the sim is doing per-tick allocation in hot loops — acceptable for Phase 0, note it).

- [ ] **Step 5: Commit**

```powershell
git add tests
git commit -m "Headless determinism test: World steps 60 s in Node with a scripted input tape and hashes identically per seed"
```

---

### Task 12: Vite build in the portal pipeline

**Files:**
- Modify: `scripts/build.mjs`, `games/onslaught/vite.config.js`, `package.json`, `README.md`

**Interfaces:**
- Produces: `npm run build` → `dist/games/onslaught/` contains the Vite output (hashed `assets/`), `dist/games.json` lists both `onslaught` and `onslaught-fable-5.1`.

- [ ] **Step 1: `vite.config.js` output**

Already sets `outDir: "dist"`, `base: "./"`, `sourcemap: true`. Add `build.target: "es2022"` and `build.assetsInlineLimit: 0`.

- [ ] **Step 2: `scripts/build.mjs`**

After the manifest loop, before copying, run Vite builds for any game with a `vite.config.js`:
```js
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
// … inside the for loop, after validating the manifest:
const viteConfig = path.join(gamesRoot, entry.name, "vite.config.js");
if (existsSync(viteConfig)) {
  execFileSync(process.execPath, [path.join(root, "node_modules", "vite", "bin", "vite.js"), "build", "--config", viteConfig], { stdio: "inherit" });
}
```
Replace the single `cp(gamesRoot, …)` with a per-game copy:
```js
...games.map((game) => {
  const src = path.join(gamesRoot, game.slug);
  const built = path.join(src, "dist");
  const from = existsSync(path.join(src, "vite.config.js")) ? built : src;
  return cp(from, path.join(output, "games", game.slug), {
    recursive: true,
    filter: (p) => !["node_modules", "dist", ".vite", "vite.config.js"].includes(path.basename(p)) || p === built,
  });
}),
```
(`game.json` is read from `src` above, so the built folder does not need it, but copy it too: `cp(path.join(src, "game.json"), path.join(output, "games", game.slug, "game.json"))`.)

- [ ] **Step 3: Build and serve**

Run: `npm run build; npm run serve` (background). Open `http://127.0.0.1:4176/` → 15 cards including "Onslaught / DEV" whose link opens `./games/onslaught/`; the game boots from hashed assets with no 404s in the network tab. Stop the server.

- [ ] **Step 4: README**

Under "Local preview" add:
```
## Onslaught dev workspace

- `npm run dev` — Vite dev server for `games/onslaught` at http://localhost:5173 (`?debug&god&seed=1` for tuning)
- `npm test` — lint, sim boundary check, unit + headless determinism tests
- `npm run build` — builds every Vite-based game, then assembles `dist/`
```

- [ ] **Step 5: Commit**

```powershell
git add scripts/build.mjs games/onslaught/vite.config.js package.json README.md
git commit -m "Build Vite-based games in the portal pipeline; document the Onslaught dev workflow"
```

---

## Self-review against the spec

- §1 Unbundle → Task 2. §2 Layout + boundary rule + hardest seams → Tasks 3, 10. §3 Fixed tick, per-frame look, interpolation, slow-mo via accumulator → Task 9. §4 Seeded RNG streams, seed on death screen, `?seed=` → Task 8. §5 Theme (sky, lighting, arena, enemies, grade, FX, HUD, strings) → Tasks 4–7. §6 Debug flags + lil-gui → Task 7. §7 Build/portal → Task 12. §8 Verification 1–4 → per-task boot checks, Task 11, Task 10 boundary; §8.5 screenshots → Tasks 5–7; §8.6 feel parity → Global Constraints (data tables unchanged) + Task 9 fire-rate check.
- Type consistency: `RNG.fork(label)`, `World.step(dt, inputFrame)`, `World.startRun()`, `FixedLoop.advance(frameDt, timeScale, stepFn) → alpha`, `Input.frame()/endTick()/endFrame()`, `Player.applyLook(input)/updateCameraPose()`, `EnemyView.sync(enemiesSim, alpha, time)`, `WeaponView.sync(weaponsSim, player, alpha, time)/onEvent(ev)`, `ArenaView.update(time, gates)`, `composeWave(wave, rng)`, `applySurfaceGrime(material, opts)`, `mountDebugPanel(game)` are used with the same names and arities wherever referenced.
- Spec deviation to flag: the spec puts `Arena` in `sim/` with view code carved out; Task 3 moves the whole class first and Task 10 carves it, so `npm run check:boundary` does not exist until Task 10 (intentional — introducing it earlier would fail by design).
