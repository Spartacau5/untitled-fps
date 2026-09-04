import {
  AdditiveBlending,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
} from "three";
import { theme } from "../../theme/theme.js";

export class Tracers {
  constructor(t, e = 160) {
    const n = new PlaneGeometry(1, 1, 1, 1),
      s = new InstancedBufferGeometry();
    (s.setIndex(n.index),
      s.setAttribute("position", n.attributes.position),
      s.setAttribute("uv", n.attributes.uv),
      (this.n = e),
      (this.head = 0),
      (this.dirty = !1),
      (this.start = new Float32Array(e * 3)),
      (this.end = new Float32Array(e * 3)),
      (this.time = new Float32Array(e * 3)),
      (this.color = new Float32Array(e * 4)),
      (this.attrs = {
        aStart: new InstancedBufferAttribute(this.start, 3),
        aEnd: new InstancedBufferAttribute(this.end, 3),
        aTime: new InstancedBufferAttribute(this.time, 3),
        aColor: new InstancedBufferAttribute(this.color, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(DynamicDrawUsage),
        s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = e), (this.uTime = { value: 0 }));
    const r = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      blending: AdditiveBlending,
      vertexShader: `
        attribute vec3 aStart; attribute vec3 aEnd; attribute vec3 aTime; attribute vec4 aColor;
        uniform float uTime;
        varying vec2 vUv; varying vec4 vColor; varying float vFade;
        void main(){
          float t = uTime - aTime.x;
          vec3 seg = aEnd - aStart;
          float total = length(seg);
          float speed = total / max(aTime.y, 1e-4);
          float headD = t * speed;
          float trail = aTime.z;
          vUv = uv; vColor = aColor; vFade = 1.0;
          if (t < 0.0 || headD > total + trail || aTime.y <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
          vec3 dir = seg / max(total, 1e-4);
          float h = min(headD, total);
          float tl = clamp(headD - trail, 0.0, total);
          vec3 head = aStart + dir * h;
          vec3 tail = aStart + dir * tl;
          vec3 p = mix(tail, head, uv.x);
          vec3 toCam = cameraPosition - p;
          vec3 side = normalize(cross(dir, toCam));
          p += side * (uv.y - 0.5) * aColor.w;
          vFade = 1.0 - smoothstep(total, total + trail, headD);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv; varying vec4 vColor; varying float vFade;
        void main(){
          float w = 1.0 - abs(vUv.y - 0.5) * 2.0;
          float core = pow(w, 4.0);
          float along = smoothstep(0.0, 0.35, vUv.x) * (0.4 + 0.6 * smoothstep(0.35, 1.0, vUv.x));
          float headGlow = smoothstep(0.85, 1.0, vUv.x) * w;
          vec3 col = vColor.rgb * (core * 2.5 + w * 0.6 + headGlow * 3.0) * along;
          gl_FragColor = vec4(col * vFade, (core + 0.3 * w) * along * vFade);
        }`,
    });
    ((this.mesh = new Mesh(s, r)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 21),
      t.add(this.mesh));
  }
  fire(t, e, n, s = 320, r = 0.035, a = 4, l = theme.fx.tracer) {
    const o = this.head;
    ((this.head = (o + 1) % this.n), (this.dirty = !0));
    const c = t.distanceTo(e);
    ((this.start[o * 3] = t.x),
      (this.start[o * 3 + 1] = t.y),
      (this.start[o * 3 + 2] = t.z),
      (this.end[o * 3] = e.x),
      (this.end[o * 3 + 1] = e.y),
      (this.end[o * 3 + 2] = e.z),
      (this.time[o * 3] = n),
      (this.time[o * 3 + 1] = c / s),
      (this.time[o * 3 + 2] = a),
      (this.color[o * 4] = l[0]),
      (this.color[o * 4 + 1] = l[1]),
      (this.color[o * 4 + 2] = l[2]),
      (this.color[o * 4 + 3] = r));
  }
  update(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
