import { MeshStandardMaterial } from "three";

// Opaque box-projected room illusion: storefronts gain view-dependent depth
// without transparent sorting, interior geometry, or additional light sources.
export function shopInteriorMaterial() {
  const mat = new MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.24,
    metalness: 0.12,
  });
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec2 roomUv; varying vec3 roomEye;",
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vec3 roomWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vec3 roomNormal = normalize(mat3(modelMatrix) * normal);
        vec3 roomTangent = normalize(vec3(roomNormal.z, 0.001, -roomNormal.x));
        vec3 eyeVector = cameraPosition - roomWorld;
        roomEye = vec3(dot(eyeVector, roomTangent), eyeVector.y, dot(eyeVector, roomNormal));
        roomUv = uv;`,
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec2 roomUv; varying vec3 roomEye;",
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        vec3 roomOrigin = vec3(roomUv * 2.0 - 1.0, 0.999);
        vec3 roomRay = normalize(vec3(-roomEye.xy / max(abs(roomEye.z), 0.1), -1.35));
        // Epsilon preserves sign and makes rays through the exact centre finite.
        vec3 safeRay = mix(vec3(0.00001), roomRay, step(vec3(0.00001), abs(roomRay)));
        vec3 farHit = (sign(safeRay) - roomOrigin) / safeRay;
        float roomT = min(min(farHit.x, farHit.y), farHit.z);
        vec3 roomPoint = roomOrigin + roomT * roomRay;
        vec3 roomColor = vec3(0.26, 0.20, 0.13);
        if (abs(roomPoint.x) > 0.995) roomColor *= 0.7;
        if (roomPoint.y < -0.995) {
          float tile = mod(floor(roomPoint.x * 7.0) + floor(roomPoint.z * 7.0), 2.0);
          roomColor = mix(vec3(0.12, 0.11, 0.09), vec3(0.28, 0.25, 0.18), tile);
        } else if (roomPoint.y > 0.995) {
          roomColor = vec3(0.34, 0.29, 0.20);
          float lamp = (1.0 - smoothstep(0.10, 0.16, abs(roomPoint.x))) * step(-0.7, roomPoint.z);
          roomColor += vec3(1.4, 0.95, 0.44) * lamp;
        } else if (roomPoint.z < -0.995) {
          float shelf = 1.0 - smoothstep(0.025, 0.045, abs(fract((roomPoint.y + 1.0) * 2.0) - 0.1));
          float product = step(0.25, fract(roomPoint.x * 8.0)) * step(0.45, fract(roomPoint.y * 2.0));
          roomColor = mix(roomColor, vec3(0.10, 0.13, 0.12), product * 0.65);
          roomColor = mix(roomColor, vec3(0.48, 0.36, 0.19), shelf);
        }
        float roomAO = clamp((1.0 - abs(roomPoint.x)) * 3.0, 0.25, 1.0);
        roomColor *= mix(0.6, 1.0, roomAO);
        diffuseColor.rgb = roomColor;`,
      )
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance += roomColor * 0.38;",
      );
  };
  mat.customProgramCacheKey = () => "midtown-shop-interior-v6";
  mat.userData.interior = true;
  return mat;
}
