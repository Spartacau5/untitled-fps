import {
  DataTexture,
  MeshStandardMaterial,
  RepeatWrapping,
  LinearMipmapLinearFilter,
  LinearFilter,
} from "three";

const CACHE = new Map();
const TILE = { brick: 0.98, concrete: 1.5, asphalt: 2, stone: 1, metal: 0.5 };
function surfaceMaps(kind) {
  if (CACHE.has(kind)) return CACHE.get(kind);
  const size = 256,
    albedo = new Uint8Array(size * size * 4),
    relief = new Uint8Array(albedo.length);
  let seed = 8137;
  const random = () =>
    (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const grain = random(),
        u = x / size,
        v = y / size;
      let tone = 0.82 + grain * 0.16,
        height = 0.45 + grain * 0.12,
        rough = 0.94;
      if (kind === "brick") {
        const row = Math.floor(v * 12),
          bx = (u * 4 + (row % 2) * 0.5) % 1,
          by = (v * 12) % 1;
        const joint = bx < 0.025 || bx > 0.975 || by < 0.075 || by > 0.925;
        const variation =
          0.8 +
          Math.sin(Math.floor(u * 4 + (row % 2) * 0.5) * 7 + row * 19) * 0.14;
        tone = joint ? 0.51 : variation + grain * 0.15;
        height = joint ? 0.25 : 0.7 + grain * 0.04;
      } else if (kind === "concrete") {
        const joint = x < 2 || y < 2 || Math.abs(y - 128) < 1;
        tone = joint ? 0.52 : 0.83 + grain * 0.12;
        height = joint ? 0.28 : 0.65 + grain * 0.015;
      } else if (kind === "asphalt") {
        const wear =
          (Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 4) + 1) * 0.5;
        tone = 0.65 + grain * 0.24 + wear * 0.09;
        height = 0.45 + grain * 0.08;
        rough = 0.85 + wear * 0.12;
      } else if (kind === "metal") {
        tone = 0.87 + grain * 0.07 + Math.sin(x * 2.1) * 0.035;
        height = 0.5 + Math.sin(x * 2.1) * 0.006;
        rough = 0.62 + grain * 0.12;
      }
      const i = (y * size + x) * 4;
      albedo[i] = albedo[i + 1] = albedo[i + 2] = Math.round(tone * 255);
      albedo[i + 3] = relief[i + 3] = 255;
      relief[i] = Math.round(height * 255);
      relief[i + 1] = Math.round(rough * 255);
      relief[i + 2] = 0;
    }
  const texture = (data) => {
    const tex = new DataTexture(data, size, size);
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.generateMipmaps = true;
    tex.minFilter = LinearMipmapLinearFilter;
    tex.magFilter = LinearFilter;
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  };
  const maps = { map: texture(albedo), bumpMap: texture(relief) };
  maps.roughnessMap = maps.bumpMap;
  CACHE.set(kind, maps);
  return maps;
}

// Bake detail once into shared mipmapped tiles. The fragment shader is Three's
// unmodified PBR shader. Only metre-scaled UV projection is added to vertices.
export function streetMaterial(
  kind,
  color,
  { roughness = 1, metalness = 0 } = {},
) {
  if (!(kind in TILE)) throw new Error(`Unknown street material ${kind}`);
  const mat = new MeshStandardMaterial({
    color,
    roughness,
    metalness,
    ...surfaceMaps(kind),
    bumpScale: kind === "brick" ? 0.009 : kind === "metal" ? 0.001 : 0.006,
  });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      vec3 streetWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
      vec3 streetAxis = abs(normalize(mat3(modelMatrix) * normal));
      vec2 streetUV = (streetAxis.y > .7 ? streetWorld.xz : (streetAxis.x > streetAxis.z ? streetWorld.zy : streetWorld.xy)) / ${TILE[kind].toFixed(3)};
      #ifdef USE_MAP
        vMapUv = streetUV;
      #endif
      #ifdef USE_BUMPMAP
        vBumpMapUv = streetUV;
      #endif
      #ifdef USE_ROUGHNESSMAP
        vRoughnessMapUv = streetUV;
      #endif
    `,
    );
  };
  mat.customProgramCacheKey = () => `midtown-baked-v2-${kind}`;
  mat.userData.surface = kind;
  return mat;
}
