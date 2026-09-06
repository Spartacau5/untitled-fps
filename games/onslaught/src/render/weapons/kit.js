import {
  AdditiveBlending,
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { rand } from "../../core/mathx.js";
import { NOISE_GLSL } from "../shaders/noise.glsl.js";

// Shared viewmodel kit: the materials every gun is made of, the handful of
// primitives the builders assemble, the gloved hands, and the two effects
// that live on the muzzle and the optic. Individual guns live beside this
// file; each exports one build*Model() returning { group, parts }.

export const VIEWMODEL_MATS = {
  metal: new MeshStandardMaterial({
    color: 4014409,
    roughness: 0.38,
    metalness: 0.9,
  }),
  metalDark: new MeshStandardMaterial({
    color: 1711394,
    roughness: 0.46,
    metalness: 0.92,
  }),
  metalLight: new MeshStandardMaterial({
    color: 6054508,
    roughness: 0.32,
    metalness: 0.92,
  }),
  polymer: new MeshStandardMaterial({
    color: 1118741,
    roughness: 0.84,
    metalness: 0.1,
  }),
  polymer2: new MeshStandardMaterial({
    color: 1974566,
    roughness: 0.72,
    metalness: 0.2,
  }),
  accent: new MeshStandardMaterial({
    color: 0,
    emissive: 6222591,
    emissiveIntensity: 0.2,
    roughness: 0.5,
    metalness: 0,
  }),
  orange: new MeshStandardMaterial({
    color: 0,
    emissive: 16742938,
    emissiveIntensity: 0.2,
    roughness: 0.5,
    metalness: 0,
  }),
  white: new MeshStandardMaterial({
    color: 0,
    emissive: 16777215,
    emissiveIntensity: 0.7,
    roughness: 0.5,
    metalness: 0,
  }),
  glove: new MeshStandardMaterial({
    color: 1776672,
    roughness: 0.9,
    metalness: 0.05,
  }),
  sleeve: new MeshStandardMaterial({
    color: 2369325,
    roughness: 0.95,
    metalness: 0.02,
  }),
  tube: new MeshStandardMaterial({
    color: 1711394,
    roughness: 0.46,
    metalness: 0.92,
    side: DoubleSide,
  }),
};
export function box(i, t, e, n, s = 0, r = 0, a = 0, l = 0) {
  const o =
      l > 0 ? new RoundedBoxGeometry(i, t, e, 2, l) : new BoxGeometry(i, t, e),
    c = new Mesh(o, n);
  return (c.position.set(s, r, a), c);
}
export function cyl(i, t, e, n, s = 0, r = 0, a = 0, l = "z", o = 18, c = !1) {
  const h = new CylinderGeometry(i, t, e, o, 1, c);
  l === "z" ? h.rotateX(Math.PI / 2) : l === "x" && h.rotateZ(Math.PI / 2);
  const d = new Mesh(h, n);
  return (d.position.set(s, r, a), d);
}
export function sphere(i, t, e, n, s) {
  const r = new Mesh(new SphereGeometry(i, 12, 10), t);
  return (r.position.set(e, n, s), r);
}
export function tube(i, t, e, n, s) {
  const r = new Vector3(...i),
    a = new Vector3(...t),
    l = r.distanceTo(a),
    o = new CylinderGeometry(n, e, l, 14),
    c = new Mesh(o, s),
    h = a.clone().sub(r).normalize();
  return (
    c.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), h),
    c.position.copy(r).lerp(a, 0.5),
    c
  );
}
export function torus(i, t, e, n, s, r) {
  const a = new TorusGeometry(i, t, 8, 24),
    l = new Mesh(a, e);
  return (l.position.set(n, s, r), l);
}
export function makeRightHand(i, t = -0.3) {
  const e = new Group();
  (e.add(box(0.05, 0.085, 0.052, VIEWMODEL_MATS.glove, 0.004, 0, 0.026, 0.014)),
    e.add(
      box(0.05, 0.072, 0.028, VIEWMODEL_MATS.glove, 0, -0.012, -0.022, 0.01),
    ));
  for (let n = 0; n < 4; n++)
    e.add(
      box(
        0.05,
        0.014,
        0.03,
        VIEWMODEL_MATS.glove,
        0,
        0.02 - n * 0.017,
        -0.026,
        0.005,
      ),
    );
  return (
    e.add(
      box(0.018, 0.045, 0.02, VIEWMODEL_MATS.glove, -0.03, 0.03, 0.01, 0.006),
    ),
    e.add(
      tube(
        [0.01, -0.05, 0.05],
        [0.11, -0.3, 0.38],
        0.036,
        0.055,
        VIEWMODEL_MATS.sleeve,
      ),
    ),
    e.position.set(i[0], i[1], i[2]),
    (e.rotation.x = t),
    e
  );
}
export function makeLeftHand(i, t = [-0.13, -0.34, 0.24]) {
  const e = new Group();
  (e.add(
    box(0.05, 0.048, 0.088, VIEWMODEL_MATS.glove, -0.004, -0.032, 0, 0.014),
  ),
    e.add(
      box(0.02, 0.06, 0.084, VIEWMODEL_MATS.glove, 0.03, -0.004, 0, 0.008),
    ));
  for (let n = 0; n < 4; n++)
    e.add(
      box(
        0.016,
        0.028,
        0.017,
        VIEWMODEL_MATS.glove,
        0.036,
        0.025,
        -0.03 + n * 0.02,
        0.005,
      ),
    );
  return (
    e.add(
      box(0.02, 0.05, 0.028, VIEWMODEL_MATS.glove, -0.034, -0.002, 0.02, 0.007),
    ),
    e.add(tube([-0.01, -0.05, 0.02], t, 0.036, 0.055, VIEWMODEL_MATS.sleeve)),
    e.position.set(i[0], i[1], i[2]),
    e
  );
}
export function makeRedDotMaterial() {
  return new ShaderMaterial({
    transparent: !0,
    depthWrite: !1,
    side: DoubleSide,
    uniforms: {
      uSightPos: { value: new Vector3() },
      uSightFwd: { value: new Vector3(0, 0, -1) },
      uColor: { value: new Color(1, 0.12, 0.08) },
      uDotRadius: { value: 0.00115 },
      uTime: { value: 0 },
      uBright: { value: 1 },
    },
    vertexShader: `
      varying vec3 vWorldPos; varying vec3 vNormal; varying vec2 vUv;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz; vNormal = normalize(mat3(modelMatrix) * normal); vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform vec3 uSightPos; uniform vec3 uSightFwd; uniform vec3 uColor; uniform float uDotRadius; uniform float uTime; uniform float uBright;
      varying vec3 vWorldPos; varying vec3 vNormal; varying vec2 vUv;
      void main(){
        float s = dot(uSightPos - cameraPosition, uSightFwd);
        vec3 dotPos = cameraPosition + uSightFwd * s;
        float d = length(vWorldPos - dotPos);
        float dotA = smoothstep(uDotRadius, uDotRadius * 0.45, d);
        float glow = exp(-d * d / (uDotRadius * uDotRadius * 9.0)) * 0.55;
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fres = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 3.0);
        vec2 c = vUv - 0.5; float r = length(c) * 2.0;
        float edge = smoothstep(0.82, 1.0, r);
        vec3 tint = vec3(0.25, 0.45, 0.75) * 0.10 + fres * vec3(0.3, 0.5, 0.8) * 0.45;
        float alpha = 0.2 + fres * 0.35 + edge * 0.55;
        vec3 col = tint * (1.0 - edge * 0.7);
        float flick = 0.92 + 0.08 * sin(uTime * 70.0);
        col += uColor * (dotA * 9.0 + glow * 2.5) * flick * uBright;
        gl_FragColor = vec4(col, clamp(alpha + dotA, 0.0, 1.0));
      }`,
  });
}
export const _sightPos = new Vector3();
export const _sightFwd = new Vector3();
export function updateRedDot(i, t, e) {
  (t.getWorldPosition(_sightPos),
    t.getWorldDirection(_sightFwd),
    i.uniforms.uSightPos.value.copy(_sightPos),
    i.uniforms.uSightFwd.value.copy(_sightFwd).negate(),
    (i.uniforms.uTime.value = e));
}
export class MuzzleFlash {
  constructor() {
    ((this.group = new Group()),
      (this.uniforms = {
        uLife: { value: 1 },
        uSeed: { value: 0 },
        uIntensity: { value: 1 },
        uColor: { value: new Color(1, 0.6, 0.2) },
      }));
    const t = new ShaderMaterial({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        side: DoubleSide,
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uLife; uniform float uSeed; uniform float uIntensity; uniform vec3 uColor; varying vec2 vUv;
        ${NOISE_GLSL}
        void main(){
          float u = vUv.x; float v = (vUv.y - 0.5) * 2.0;
          float n = noise2(vec2(u * 5.0 + uSeed * 10.0, v * 3.0 + uSeed * 3.0));
          float n2 = noise2(vec2(u * 12.0 - uSeed * 7.0, v * 6.0));
          float width = (1.0 - u * 0.85) * (0.45 + 0.7 * n) * (1.0 - uLife * 0.5);
          float shape = smoothstep(width, width * 0.25, abs(v));
          float len = 1.0 - smoothstep(0.45 + n * 0.5, 1.0, u);
          float core = smoothstep(width * 0.7, 0.0, abs(v)) * (1.0 - u) * (0.7 + 0.6 * n2);
          vec3 col = mix(uColor, vec3(1.0, 0.95, 0.8), core);
          float a = shape * len * (1.0 - uLife) * (0.7 + 0.3 * n2);
          gl_FragColor = vec4(col * uIntensity * (1.0 + core * 3.0) * a, a);
        }`,
      }),
      e = new ShaderMaterial({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        side: DoubleSide,
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uLife; uniform float uSeed; uniform float uIntensity; uniform vec3 uColor; varying vec2 vUv;
        void main(){
          vec2 c = vUv - 0.5; float r = length(c) * 2.0; float ang = atan(c.y, c.x);
          float spikes = 0.55 + 0.45 * sin(ang * 7.0 + uSeed * 20.0) * sin(ang * 3.0 - uSeed * 9.0);
          float a = smoothstep(1.0, 0.05, r / (0.45 + 0.55 * spikes)) * (1.0 - uLife);
          vec3 col = mix(uColor, vec3(1.0, 0.95, 0.85), smoothstep(0.6, 0.0, r));
          gl_FragColor = vec4(col * uIntensity * (1.0 + smoothstep(0.5, 0.0, r) * 3.0) * a, a);
        }`,
      }),
      n = new PlaneGeometry(1, 1);
    (n.rotateY(Math.PI / 2), n.translate(0, 0, -0.5));
    const s = new Mesh(n, t),
      r = new Mesh(n, t);
    r.rotation.z = Math.PI / 2;
    const a = new Mesh(n, t);
    ((a.rotation.z = Math.PI / 4), a.scale.set(1, 0.7, 0.8));
    const l = new Mesh(new PlaneGeometry(1, 1), e);
    ((l.position.z = -0.02),
      (this.planes = [s, r, a]),
      (this.disc = l),
      (this.inner = new Group()),
      this.inner.add(s, r, a, l),
      this.group.add(this.inner),
      (this.light = new PointLight(16752704, 0, 3, 2)),
      (this.light.position.z = -0.05),
      this.group.add(this.light),
      (this.group.visible = !1),
      (this.timer = 0),
      (this.duration = 0.06),
      (this.intensity = 0));
  }
  fire(t) {
    ((this.group.visible = !0),
      (this.timer = 0),
      (this.duration = t.duration || 0.06),
      (this.uniforms.uSeed.value = Math.random()),
      (this.uniforms.uIntensity.value = t.intensity || 1.6),
      this.uniforms.uColor.value.setRGB(t.color[0], t.color[1], t.color[2]));
    const e = 0.8 + Math.random() * 0.45,
      n = t.length * e,
      s = t.width * e;
    for (const r of this.planes) r.scale.set(1, s, n);
    (this.planes[2].scale.set(1, s * 0.7, n * 0.8),
      this.disc.scale.set(s * 1.4, s * 1.4, 1),
      (this.inner.rotation.z = Math.random() * Math.PI * 2),
      (this.peakLight = t.light || 14),
      (this.light.intensity = this.peakLight),
      (this.intensity = 1));
  }
  update(t) {
    if (!this.group.visible) {
      this.intensity = 0;
      return;
    }
    this.timer += t;
    const e = Math.min(1, this.timer / this.duration);
    ((this.uniforms.uLife.value = e),
      (this.light.intensity = this.peakLight * (1 - e)),
      (this.intensity = 1 - e),
      e >= 1 && ((this.group.visible = !1), (this.intensity = 0)));
  }
}
