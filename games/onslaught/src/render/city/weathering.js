import { DataTexture, RepeatWrapping, LinearFilter } from "three";

let mask;
export function districtWeatherMask() {
  if (mask) return mask;
  const size = 256,
    bytes = new Uint8Array(size * size * 4);
  // Periodic functions make a seamless, slowly varying world-space mask.
  // All the noise work happens once on CPU, not in every shaded fragment.
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const u = (x / size) * Math.PI * 2,
        v = (y / size) * Math.PI * 2;
      const broad =
        (Math.sin(u * 3 + Math.cos(v * 2)) +
          Math.cos(v * 5 - u * 2) +
          Math.sin(u * 7 + v * 4)) /
        3;
      const i = (y * size + x) * 4;
      bytes[i] = Math.round(140 + broad * 95);
      bytes[i + 1] = Math.round(
        Math.max(0, Math.min(1, (broad - 0.15) * 2.4)) * 255,
      );
      bytes[i + 2] = 0;
      bytes[i + 3] = 255;
    }
  mask = new DataTexture(bytes, size, size);
  mask.wrapS = mask.wrapT = RepeatWrapping;
  mask.magFilter = mask.minFilter = LinearFilter;
  mask.needsUpdate = true;
  return mask;
}

export function weatherStreet(material) {
  const compile = material.onBeforeCompile,
    cacheKey = material.customProgramCacheKey.bind(material);
  material.onBeforeCompile = (shader) => {
    compile(shader);
    shader.uniforms.uDistrictWeather = { value: districtWeatherMask() };
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vDistrictPosition;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvDistrictPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform sampler2D uDistrictWeather; varying vec3 vDistrictPosition;",
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        vec2 weather = texture2D(uDistrictWeather, vDistrictPosition.xz / 64.0).rg;
        diffuseColor.rgb *= mix(0.76, 1.04, weather.r) * (1.0 - weather.g * 0.16);`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.19, weather.g * 0.85);`,
      );
  };
  material.customProgramCacheKey = () => `${cacheKey()}-weather-v6`;
  material.userData.weathered = true;
  return material;
}
