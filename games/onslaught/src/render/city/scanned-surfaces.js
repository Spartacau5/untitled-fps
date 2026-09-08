import {
  Texture,
  RepeatWrapping,
  SRGBColorSpace,
  NoColorSpace,
  LinearMipmapLinearFilter,
  Vector2,
} from "three";

// CC0 Poly Haven scans, shipped locally. No runtime asset-host dependency.
export const SCANNED_SURFACES = Object.freeze({
  asphalt: { metres: 3, normal: 0.45 },
  brick: { metres: 1.1, normal: 0.7 },
  concrete: { metres: 2, normal: 0.4 },
});
export async function fetchSurfaceTexture(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`Surface ${response.status}: ${url}`);
  const bitmap = await createImageBitmap(await response.blob(), {
    imageOrientation: "flipY",
    colorSpaceConversion: "none",
    premultiplyAlpha: "none",
  });
  const texture = new Texture(bitmap);
  texture.needsUpdate = true;
  return texture;
}

export async function loadDistrictArtwork(
  scene,
  { loadTexture = fetchSurfaceTexture } = {},
) {
  const targets = new Map();
  scene.traverse((object) => {
    const material = object.material,
      url = material?.userData.billboard;
    if (!url) return;
    if (!targets.has(url)) targets.set(url, new Set());
    targets.get(url).add(material);
  });
  return Promise.all(
    [...targets].map(async ([url, materials]) => {
      try {
        const texture = await loadTexture(url);
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = 4;
        for (const material of materials) {
          material.map = material.emissiveMap = texture;
          material.needsUpdate = true;
        }
        return { url, loaded: true };
      } catch (error) {
        return { url, loaded: false, reason: String(error) };
      }
    }),
  );
}

// Three concurrent families, sequential maps within each family. Commit a
// complete family atomically so a failed request keeps the usable baked tile.
export async function loadScannedSurfaces(
  scene,
  { loadTexture = fetchSurfaceTexture, onProgress = () => {} } = {},
) {
  const materials = new Map();
  scene.traverse((object) => {
    for (const material of [object.material].flat().filter(Boolean)) {
      const kind = material.userData.surface;
      if (!(kind in SCANNED_SURFACES)) continue;
      if (!materials.has(kind)) materials.set(kind, new Set());
      materials.get(kind).add(material);
    }
  });
  let completed = 0;
  const total = materials.size * 3;
  return Promise.all(
    [...materials].map(async ([kind, targets]) => {
      const textures = [];
      try {
        for (const channel of ["diff", "nor_gl", "rough"]) {
          const texture = await loadTexture(
            `/materials/midtown/${kind}-${channel}.jpg`,
          );
          texture.wrapS = texture.wrapT = RepeatWrapping;
          texture.generateMipmaps = true;
          texture.minFilter = LinearMipmapLinearFilter;
          texture.anisotropy = 4;
          texture.colorSpace =
            channel === "diff" ? SRGBColorSpace : NoColorSpace;
          texture.needsUpdate = true;
          textures.push(texture);
          onProgress(++completed / total);
        }
        for (const material of targets) {
          [material.map, material.normalMap, material.roughnessMap] = textures;
          material.bumpMap = null;
          material.normalScale = new Vector2().setScalar(
            SCANNED_SURFACES[kind].normal,
          );
          // The scan contains its own base colour. Preserve a restrained tint.
          material.color.lerp({ r: 1, g: 1, b: 1 }, 0.82);
          material.userData.scanned = true;
          material.needsUpdate = true;
        }
        return { kind, loaded: true };
      } catch (error) {
        for (const texture of textures) {
          texture.dispose();
          texture.image?.close?.();
        }
        completed += 3 - textures.length;
        onProgress(completed / total);
        return { kind, loaded: false, reason: String(error) };
      }
    }),
  );
}
