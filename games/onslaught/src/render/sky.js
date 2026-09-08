import { BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from "three";
import { NOISE_GLSL } from "./shaders/noise.glsl.js";
import { theme } from "../theme/theme.js";

export function createSky(
  sunDir,
  { radius = 700, palette = theme.sky, clouds = 0 } = {},
) {
  const geo = new SphereGeometry(radius, 32, 16);
  const mat = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uSunDir: { value: sunDir.clone().normalize() },
      uHorizon: { value: new Color(palette.horizon) },
      uZenith: { value: new Color(palette.zenith) },
      uFog: { value: new Color(palette.fog) },
      uSun: { value: new Color(palette.sun) },
      uDust: { value: new Color(palette.dust) },
      uClouds: { value: clouds },
    },
    vertexShader: `
      varying vec3 vWorldPos;
      void main(){
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime; uniform vec3 uSunDir; uniform float uClouds;
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
        if (uClouds > 0.0) {
          float cloud = smoothstep(0.38, 0.7, fbm2(d.xz / (max(h, 0.08) + 0.35) * 2.0 + uTime * 0.0015));
          col = mix(col, uHorizon * 0.92, cloud * uClouds * smoothstep(0.02, 0.3, h));
        }
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
  return {
    mesh,
    update: (t) => {
      mat.uniforms.uTime.value = t;
    },
  };
}
