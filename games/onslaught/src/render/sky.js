import { BackSide, Color, Mesh, ShaderMaterial, SphereGeometry } from "three";
import { NOISE_GLSL } from "./shaders/noise.glsl.js";

export function createSky(i) {
  const t = new SphereGeometry(700, 48, 24),
    e = new ShaderMaterial({
      side: BackSide,
      depthWrite: !1,
      fog: !1,
      uniforms: {
        uTime: { value: 0 },
        uMoonDir: { value: i.clone().normalize() },
        uHorizon: { value: new Color(660516) },
        uZenith: { value: new Color(132106) },
        uFog: { value: new Color(461588) },
      },
      vertexShader: `
      varying vec3 vWorldPos;
      void main(){
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
      fragmentShader: `
      uniform float uTime; uniform vec3 uMoonDir; uniform vec3 uHorizon; uniform vec3 uZenith; uniform vec3 uFog;
      varying vec3 vWorldPos;
      ${NOISE_GLSL}
      void main(){
        vec3 d = normalize(vWorldPos - cameraPosition);
        float h = d.y;
        // base gradient
        vec3 col = mix(uHorizon, uZenith, pow(clamp(h, 0.0, 1.0), 0.45));
        col = mix(uFog, col, smoothstep(-0.05, 0.12, h));
        // nebula
        float n = fbm3(d * 2.2 + vec3(0.0, uTime * 0.004, 0.0));
        float n2 = fbm3(d * 5.0 - vec3(uTime * 0.003, 0.0, 0.0));
        float neb = smoothstep(0.42, 0.75, n) * smoothstep(0.0, 0.35, h);
        vec3 nebCol = mix(vec3(0.30, 0.08, 0.45), vec3(0.05, 0.35, 0.5), n2) * 0.55;
        col += nebCol * neb * (0.6 + 0.4 * n2);
        // stars
        vec3 sp = d * 90.0;
        vec3 cell = floor(sp);
        vec3 rnd = hash33(cell);
        float starDist = length(fract(sp) - rnd);
        float has = step(0.86, hash31(cell + 7.1));
        float tw = 0.65 + 0.35 * sin(uTime * (1.5 + rnd.z * 3.0) + rnd.x * 6.28);
        float star = has * smoothstep(0.12, 0.0, starDist) * tw * smoothstep(0.0, 0.25, h);
        vec3 starCol = mix(vec3(0.8, 0.9, 1.0), vec3(1.0, 0.85, 0.7), rnd.y);
        col += starCol * star * (1.0 + 2.5 * step(0.97, rnd.z));
        // moon
        float m = dot(d, uMoonDir);
        float disc = smoothstep(0.99700, 0.99760, m);
        vec3 t1 = normalize(cross(uMoonDir, vec3(0.0, 1.0, 0.0)));
        vec3 t2 = cross(uMoonDir, t1);
        vec2 mc = vec2(dot(d, t1), dot(d, t2)) / 0.075;
        float craters = fbm2(mc * 3.0 + 4.0);
        float craters2 = noise2(mc * 9.0);
        float shade = 0.55 + 0.45 * clamp(mc.x * 1.2 + 0.4, -1.0, 1.0);
        vec3 moonCol = vec3(1.0, 0.93, 0.82) * (0.55 + 0.6 * craters - 0.25 * smoothstep(0.55, 0.75, craters2)) * shade;
        float limb = 1.0 - smoothstep(0.7, 1.0, length(mc));
        col = mix(col, moonCol * 1.9 * (0.6 + 0.4 * limb), disc);
        float glow = exp(-(1.0 - m) * 320.0) * 0.9 + exp(-(1.0 - m) * 45.0) * 0.22;
        col += vec3(0.9, 0.85, 0.75) * glow;
        // aurora
        float band = exp(-pow((h - 0.30) * 5.5, 2.0));
        float an = fbm3(vec3(d.xz * 2.5, uTime * 0.06));
        float curtain = 0.5 + 0.5 * sin(d.x * 14.0 + an * 9.0 + uTime * 0.25);
        curtain *= 0.5 + 0.5 * sin(d.z * 9.0 - an * 5.0 - uTime * 0.17);
        vec3 aurCol = mix(vec3(0.05, 0.9, 0.45), vec3(0.2, 0.35, 1.0), clamp((h - 0.2) * 3.0, 0.0, 1.0));
        col += aurCol * band * curtain * smoothstep(0.35, 0.75, an) * 0.55;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    }),
    n = new Mesh(t, e);
  return (
    (n.frustumCulled = !1),
    (n.renderOrder = -10),
    {
      mesh: n,
      update: (s) => {
        e.uniforms.uTime.value = s;
      },
    }
  );
}
