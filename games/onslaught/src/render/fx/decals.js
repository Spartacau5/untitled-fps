import {
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PlaneGeometry,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from "three";
import { NOISE_GLSL } from "../shaders/noise.glsl.js";

export class Decals {
  constructor(t, e = 320) {
    const n = new PlaneGeometry(1, 1),
      s = new InstancedBufferGeometry();
    (s.setIndex(n.index),
      s.setAttribute("position", n.attributes.position),
      s.setAttribute("uv", n.attributes.uv),
      (this.n = e),
      (this.head = 0),
      (this.dirty = !1),
      (this.pos = new Float32Array(e * 3)),
      (this.quat = new Float32Array(e * 4)),
      (this.info = new Float32Array(e * 4)),
      (this.attrs = {
        aPos: new InstancedBufferAttribute(this.pos, 3),
        aQuat: new InstancedBufferAttribute(this.quat, 4),
        aInfo: new InstancedBufferAttribute(this.info, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(DynamicDrawUsage),
        s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = e), (this.uTime = { value: 0 }));
    const r = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      polygonOffset: !0,
      polygonOffsetFactor: -4,
      polygonOffsetUnits: -4,
      vertexShader: `
        attribute vec3 aPos; attribute vec4 aQuat; attribute vec4 aInfo; uniform float uTime;
        varying vec2 vUv; varying float vType; varying float vAge; varying float vSeed;
        vec3 qrot(vec4 q, vec3 v){ return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
        void main(){
          vUv = uv; vType = aInfo.z; vAge = uTime - aInfo.y; vSeed = aInfo.w;
          if (aInfo.x <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
          vec3 p = aPos + qrot(aQuat, position * aInfo.x);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv; varying float vType; varying float vAge; varying float vSeed;
        ${NOISE_GLSL}
        void main(){
          vec2 c = vUv - 0.5; float r = length(c) * 2.0;
          float n = noise2(c * 10.0 + vSeed * 40.0);
          float fade = 1.0 - smoothstep(40.0, 60.0, vAge);
          vec3 col; float a;
          if (vType < 0.5) {
            float hole = smoothstep(0.45 + n * 0.15, 0.15, r);
            float scorch = smoothstep(1.0, 0.25, r + n * 0.35) * 0.8;
            col = mix(vec3(0.07, 0.065, 0.06), vec3(0.005), hole);
            a = max(hole, scorch);
          } else {
            float n2 = fbm2(c * 5.0 + vSeed * 13.0);
            float body = smoothstep(1.0, 0.2, r + n2 * 0.5);
            float hot = smoothstep(0.75, 0.35, r + n2 * 0.4) * exp(-vAge * 0.9);
            col = mix(vec3(0.03, 0.025, 0.02), vec3(1.0, 0.45, 0.1) * 3.0, hot);
            a = body * 0.85;
          }
          gl_FragColor = vec4(col, a * fade);
        }`,
    });
    ((this.mesh = new Mesh(s, r)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 5),
      t.add(this.mesh),
      (this._q = new Quaternion()),
      (this._q2 = new Quaternion()),
      (this._z = new Vector3(0, 0, 1)));
  }
  add(t, e, n, s, r) {
    const a = this.head;
    ((this.head = (a + 1) % this.n),
      (this.dirty = !0),
      this._q.setFromUnitVectors(this._z, e),
      this._q2.setFromAxisAngle(this._z, Math.random() * Math.PI * 2),
      this._q.multiply(this._q2),
      (this.pos[a * 3] = t.x + e.x * 0.012),
      (this.pos[a * 3 + 1] = t.y + e.y * 0.012),
      (this.pos[a * 3 + 2] = t.z + e.z * 0.012),
      (this.quat[a * 4] = this._q.x),
      (this.quat[a * 4 + 1] = this._q.y),
      (this.quat[a * 4 + 2] = this._q.z),
      (this.quat[a * 4 + 3] = this._q.w),
      (this.info[a * 4] = n),
      (this.info[a * 4 + 1] = r),
      (this.info[a * 4 + 2] = s),
      (this.info[a * 4 + 3] = Math.random()));
  }
  update(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
