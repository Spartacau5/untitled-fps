import { AdditiveBlending, Color, ShaderMaterial } from "three";
import { NOISE_GLSL } from "./shaders/noise.glsl.js";

// Spawn-portal surface. This was a canvas gradient, which could not hold up at
// this size: an 8-bit ramp stretched over a 7 m doorway posterises into visible
// rings, and a static bitmap on a quad reads as a decal taped over the opening
// no matter how it is coloured.
//
// Doing it in the fragment shader fixes all three failings at once. The falloff
// is evaluated per pixel so there is no banding, domain-warped noise gives it
// motion so it reads as a volume rather than a picture, and the intensity is
// faded out before the quad's own border so the rectangle never shows against
// the door frame. The core is deliberately pushed past the grade's bloom
// threshold (1.6) so the existing post chain throws the halo and the light
// spills into the street on its own.
export function createPortalMaterial(seed = 0) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uOpen: { value: 0 },
      uSeed: { value: seed },
      uGain: { value: 0.72 },
      uEdge: { value: new Color(0.46, 0.1, 0.02) },
      uMid: { value: new Color(1.05, 0.3, 0.04) },
      uCore: { value: new Color(1.75, 0.86, 0.34) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime; uniform float uOpen; uniform float uSeed;
      uniform float uGain;
      uniform vec3 uEdge; uniform vec3 uMid; uniform vec3 uCore;
      varying vec2 vUv;
      ${NOISE_GLSL}
      void main(){
        vec2 p = vUv - 0.5;
        // Squashed slightly so the falloff follows the doorway's proportions
        // instead of hanging a circle in a tall rectangle.
        float d = length(vec2(p.x * 1.22, p.y * 0.90));

        // Two vertically-stretched, domain-warped layers rising at different
        // rates. The parallax between them is what gives the opening depth; a
        // single low-frequency layer just looks like a smooth gradient.
        vec2 q1 = vec2(p.x * 6.5, p.y * 3.2 - uTime * 0.40) + uSeed;
        vec2 q2 = vec2(p.x * 11.5, p.y * 5.6 - uTime * 0.72) + uSeed * 1.7;
        // One octave is plenty for a displacement field; spending a full fbm
        // here tripled the hash lookups per fragment for no visible gain.
        float warp = noise2(q1 * 0.7 + uTime * 0.09);
        float w = mix(fbm2(q1 + warp * 1.5), fbm2(q2 + warp * 0.9), 0.42);

        // Flat enough to carry light all the way to the jambs. A tight
        // falloff left a blob hanging in a black rectangle, which is what made
        // it read as a decal instead of a filled opening.
        float body = smoothstep(1.02, 0.06, d);
        float core = smoothstep(0.30, 0.02, d);
        float i = (0.26 + body * 0.92) * mix(0.40, 1.44, w) + core * 0.30;

        // Feathered well inside the quad: the glow has to meet the jambs as
        // light, not as a cut rectangle.
        i *= smoothstep(0.5, 0.37, abs(p.x)) * smoothstep(0.5, 0.42, abs(p.y));

        vec3 col = mix(uEdge, uMid, smoothstep(0.20, 0.90, i));
        col = mix(col, uCore, smoothstep(1.28, 2.10, i));

        // Ordered-ish dither: the falloff is smooth enough that an 8-bit
        // framebuffer would band it again without this.
        float dith = (hash21(gl_FragCoord.xy + uTime) - 0.5) / 255.0;

        gl_FragColor = vec4(col * i * uOpen * uGain + dith, 1.0);
      }
    `,
  });
}
