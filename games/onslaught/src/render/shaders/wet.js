import { NOISE_GLSL } from "./noise.glsl.js";

// Damp ground.
//
// A tiled texture repeats thirty times across the plaza, and no amount of
// detail inside one tile hides that. This works in world space instead, at a
// scale much larger than the tile, so it breaks the repeat and adds the thing
// a wet city street actually does: puddles that go dark, go smooth, and mirror
// the lights above them.
//
// Roughness is doing the work, not colour. Water on stone is not blue, it is
// the same stone at a fraction of the roughness, which is what lets the
// environment probe -- the one that captured the billboards -- show up in it.
export function applyWetGround(
  material,
  { scale = 0.035, wetness = 0.55, key = "wet" } = {},
) {
  const s = scale.toFixed(4),
    w = wetness.toFixed(3);
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWetPos;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvWetPos = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec3 vWetPos;\n${NOISE_GLSL}`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        vec2 wp = vWetPos.xz;
        // Two scales: broad damp areas, and smaller pools inside them. Both
        // far larger than the texture tile, which is what breaks the repeat.
        float broad = fbm2(wp * ${s});
        float pools = fbm2(wp * ${s} * 4.3 + 21.7);
        // A hard-ish edge, because a puddle has a rim; a soft gradient reads
        // as haze on the lens rather than water on the ground.
        float wet = smoothstep(0.52, 0.66, broad * 0.65 + pools * 0.35) * ${w};
        // Standing water darkens what is under it.
        diffuseColor.rgb *= 1.0 - wet * 0.42;`,
      )
      // Roughness last, so it overrides the map rather than being overridden.
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.075, wet);`,
      );
  };
  // Without a distinct key three.js shares one compiled program between
  // materials with the same signature.
  material.customProgramCacheKey = () => key;
  return material;
}
