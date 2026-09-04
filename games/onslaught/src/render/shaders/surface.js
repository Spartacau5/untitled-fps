import { NOISE_GLSL } from "./noise.glsl.js";

// World-space concrete wear for flat procedural geometry under hard light.
// streaks: vertical rain/dust streaking strength (walls 1.0, floors 0.0).
export function applySurfaceGrime(
  material,
  { scale = 0.35, streaks = 1.0, key = "grime" } = {},
) {
  const s = scale.toFixed(3);
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWPos; varying vec3 vWNrm;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvWNrm = normalize(mat3(modelMatrix) * normal);",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec3 vWPos; varying vec3 vWNrm;\n${NOISE_GLSL}`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        // pick the two world axes that best span this face
        vec3 an = abs(vWNrm);
        vec2 p = an.y > 0.7 ? vWPos.xz : (an.x > an.z ? vWPos.zy : vWPos.xy);
        float wear = noise2(p * ${s} * 2.0) * 0.6 + noise2(p * ${s} * 11.0) * 0.4;
        float stain = smoothstep(0.4, 0.8, fbm2(p * ${s} + 7.0));
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
