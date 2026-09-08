import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  BoxGeometry,
  Mesh,
  Scene,
  Texture,
  ShaderLib,
  SRGBColorSpace,
  NoColorSpace,
} from "three";
import { streetMaterial } from "../games/onslaught/src/render/city/surface-materials.js";
import {
  loadScannedSurfaces,
  loadDistrictArtwork,
} from "../games/onslaught/src/render/city/scanned-surfaces.js";
import { weatherStreet } from "../games/onslaught/src/render/city/weathering.js";
import { shopInteriorMaterial } from "../games/onslaught/src/render/city/shop-interiors.js";
import {
  districtReflectionScene,
  DISTRICT_LOOK,
} from "../games/onslaught/src/render/city/district-look.js";
import { createSky } from "../games/onslaught/src/render/sky.js";
import { frameSummary } from "../games/onslaught/src/ui/frame-meter.js";

function sceneWithSurfaces() {
  const scene = new Scene();
  for (const kind of ["brick", "asphalt", "concrete", "brick"])
    scene.add(
      new Mesh(
        new BoxGeometry(),
        weatherStreet(streetMaterial(kind, 0x808080)),
      ),
    );
  return scene;
}
test("scans share texture storage, respect colour spaces, and preserve weather UVs", async () => {
  const scene = sceneWithSurfaces(),
    progress = [];
  let requests = 0,
    active = 0,
    peak = 0;
  const results = await loadScannedSurfaces(scene, {
    loadTexture: async () => {
      requests++;
      active++;
      peak = Math.max(peak, active);
      await Promise.resolve();
      active--;
      return new Texture();
    },
    onProgress: (p) => progress.push(p),
  });
  assert.equal(requests, 9);
  assert.ok(peak <= 3);
  assert.ok(results.every((r) => r.loaded));
  assert.equal(progress.at(-1), 1);
  assert.ok(progress.every((p, i) => i === 0 || p >= progress[i - 1]));
  assert.equal(scene.children[0].material.map, scene.children[3].material.map);
  for (const object of scene.children) {
    const m = object.material;
    assert.equal(m.map.colorSpace, SRGBColorSpace);
    assert.equal(m.normalMap.colorSpace, NoColorSpace);
    assert.equal(m.roughnessMap.colorSpace, NoColorSpace);
    assert.equal(m.bumpMap, null);
    const shader = {
      vertexShader: ShaderLib.standard.vertexShader,
      fragmentShader: ShaderLib.standard.fragmentShader,
      uniforms: {},
    };
    m.onBeforeCompile(shader);
    assert.match(shader.vertexShader, /vNormalMapUv = streetUV/);
    assert.match(shader.vertexShader, /vDistrictPosition/);
    assert.match(shader.fragmentShader, /roughnessFactor = mix/);
    assert.ok(shader.uniforms.uDistrictWeather.value.isDataTexture);
  }
});
test("a missing normal map keeps the whole fallback family and frees partial assets", async () => {
  const scene = sceneWithSurfaces(),
    original = scene.children[0].material.map;
  let disposed = false;
  const result = await loadScannedSurfaces(scene, {
    loadTexture: async (url) => {
      if (url.includes("brick-nor")) throw new Error("offline");
      const texture = new Texture();
      if (url.includes("brick-diff"))
        texture.addEventListener("dispose", () => {
          disposed = true;
        });
      return texture;
    },
  });
  assert.equal(result.find((r) => r.kind === "brick").loaded, false);
  assert.equal(scene.children[0].material.map, original);
  assert.equal(scene.children[0].material.userData.scanned, undefined);
  assert.equal(disposed, true);
  assert.equal(result.find((r) => r.kind === "asphalt").loaded, true);
});
test("billboard art loads once and updates both colour and emission; failure preserves card", async () => {
  const scene = sceneWithSurfaces();
  for (const o of scene.children)
    o.material.userData.billboard = "/ads/after-hours-v6.jpg";
  let calls = 0;
  const loadTexture = async () => {
    calls++;
    return new Texture();
  };
  await loadDistrictArtwork(scene, { loadTexture });
  assert.equal(calls, 1);
  const map = scene.children[0].material.map;
  assert.equal(scene.children[3].material.map, map);
  assert.equal(scene.children[0].material.emissiveMap, map);
  const result = await loadDistrictArtwork(scene, {
    loadTexture: async () => {
      throw new Error("missing");
    },
  });
  assert.equal(result[0].loaded, false);
  assert.equal(scene.children[0].material.map, map);
});
test("district sky stays inside camera range and reflection proxy remains small", () => {
  const sky = createSky(DISTRICT_LOOK.sun, {
    radius: 210,
    palette: DISTRICT_LOOK.sky,
    clouds: 0.68,
  });
  // Worst legal corner + sky radius remains within the 260 m world far plane.
  assert.ok(
    sky.mesh.geometry.parameters.radius + Math.hypot(27, 35, 3.5) < 260,
  );
  const proxy = districtReflectionScene();
  assert.ok(proxy.scene.children.length <= 28);
  proxy.scene.updateMatrixWorld(true);
  proxy.scene.traverse((o) =>
    assert.ok(o.matrixWorld.elements.every(Number.isFinite)),
  );
  proxy.dispose();
});
test("shop room projection retains standard lighting and uses finite central rays", () => {
  const mat = shopInteriorMaterial();
  const shader = {
    vertexShader: ShaderLib.standard.vertexShader,
    fragmentShader: ShaderLib.standard.fragmentShader,
  };
  mat.onBeforeCompile(shader);
  assert.match(shader.fragmentShader, /vec3 safeRay = mix/);
  assert.match(shader.fragmentShader, /totalEmissiveRadiance \+= roomColor/);
  assert.match(shader.fragmentShader, /#include <lights_fragment_begin>/);
  assert.equal(mat.transparent, false);
});
test("frame diagnostics retain long stalls rather than the simulation's 50 ms cap", () => {
  const s = frameSummary([16, 16, 16, 200]);
  assert.equal(s.p95, 200);
  assert.ok(s.fps < 20);
  assert.deepEqual(frameSummary([]), { fps: 0, p95: 0 });
});
test("bundled fidelity assets match provenance hashes and stay within download budget", () => {
  const root = new URL("../games/onslaught/public/", import.meta.url);
  const manifest = JSON.parse(
    readFileSync(new URL("materials/midtown/manifest.json", root), "utf8"),
  );
  let bytes = 0;
  assert.equal(manifest.assets.length, 10);
  for (const asset of manifest.assets) {
    const path = new URL(asset.path, root),
      buffer = readFileSync(path);
    assert.equal(
      createHash("sha256").update(buffer).digest("hex"),
      asset.sha256,
      asset.path,
    );
    assert.equal(statSync(path).size, asset.bytes);
    assert.equal(
      buffer.readUInt16BE(0),
      0xffd8,
      `${asset.path} must be a JPEG`,
    );
    bytes += asset.bytes;
  }
  assert.ok(bytes < 3 * 1024 * 1024, `asset pack: ${bytes} bytes`);
});
