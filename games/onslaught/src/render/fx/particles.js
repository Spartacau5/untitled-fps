import {
  AdditiveBlending,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  NormalBlending,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from "three";
import { rand } from "../../core/mathx.js";
import { NOISE_GLSL } from "../shaders/noise.glsl.js";
import { theme } from "../../theme/theme.js";

export const PARTICLE_VERT = `
attribute vec3 aPos; attribute vec3 aVel; attribute vec2 aTime; attribute vec2 aSize; attribute vec4 aColor; attribute vec4 aMisc;
uniform float uTime;
varying vec2 vUv; varying vec4 vColor; varying float vType; varying float vLife; varying float vSeed;
void main(){
  float t = uTime - aTime.x;
  float life = aTime.y;
  float f = t / max(life, 1e-4);
  vUv = uv; vColor = aColor; vType = aMisc.z; vLife = f; vSeed = fract(aTime.x * 13.37);
  if (t < 0.0 || f > 1.0 || life <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float g = aMisc.x; float k = max(aMisc.y, 0.001); float type = aMisc.z; float extra = aMisc.w;
  vec3 grav = vec3(0.0, -g, 0.0);
  float e = exp(-k * t);
  vec3 p = aPos + (grav / k) * t + (aVel - grav / k) * (1.0 - e) / k;
  vec3 v = grav / k + (aVel - grav / k) * e;
  if (p.y < 0.02) { p.y = 0.02; }
  float size = mix(aSize.x, aSize.y, f);
  vec4 viewPos = viewMatrix * vec4(p, 1.0);
  vec2 offset;
  if (type < 0.5) {
    vec3 vv = (viewMatrix * vec4(v, 0.0)).xyz;
    vec2 d2 = vv.xy; float len = length(d2);
    vec2 axis = len > 1e-4 ? d2 / len : vec2(1.0, 0.0);
    vec2 perp = vec2(-axis.y, axis.x);
    float L = size * (1.0 + extra * len);
    offset = axis * (position.x * L) + perp * (position.y * size);
  } else {
    float ang = extra * t + aTime.x * 7.0;
    float c = cos(ang), s = sin(ang);
    vec2 q = position.xy * size;
    offset = vec2(q.x * c - q.y * s, q.x * s + q.y * c);
  }
  viewPos.xy += offset;
  gl_Position = projectionMatrix * viewPos;
}
`;
export const PARTICLE_FRAG = `
varying vec2 vUv; varying vec4 vColor; varying float vType; varying float vLife; varying float vSeed;
${NOISE_GLSL}
void main(){
  vec2 uv = vUv - 0.5;
  float a;
  vec3 col = vColor.rgb * vColor.a;
  if (vType < 0.5) {
    float dx = abs(uv.x) * 2.0; float dy = abs(uv.y) * 2.0;
    a = 1.0 - smoothstep(0.0, 1.0, dy); a *= a; a *= 1.0 - smoothstep(0.5, 1.0, dx);
    a *= 1.0 - smoothstep(0.5, 1.0, vLife);
  } else if (vType < 1.5) {
    float r = length(uv) * 2.0;
    float n = fbm2(uv * 3.0 + vSeed * 10.0 + vec2(0.0, vLife * 0.6));
    a = smoothstep(1.0, 0.1, r + n * 0.6) * (0.55 + 0.45 * n);
    a *= (1.0 - smoothstep(0.25, 1.0, vLife)) * smoothstep(0.0, 0.08, vLife);
    col *= 0.65 + 0.35 * n;
  } else {
    float r = length(uv) * 2.0;
    a = exp(-r * r * 5.0) + 0.2 * smoothstep(1.0, 0.0, r);
    a *= 1.0 - smoothstep(0.55, 1.0, vLife);
  }
  gl_FragColor = vec4(col, a);
}
`;
export class ParticleBuffer {
  constructor(t, e) {
    const n = new PlaneGeometry(1, 1),
      s = new InstancedBufferGeometry();
    (s.setIndex(n.index),
      s.setAttribute("position", n.attributes.position),
      s.setAttribute("uv", n.attributes.uv),
      (this.n = t),
      (this.head = 0),
      (this.dirty = !1),
      (this.pos = new Float32Array(t * 3)),
      (this.vel = new Float32Array(t * 3)),
      (this.time = new Float32Array(t * 2)),
      (this.size = new Float32Array(t * 2)),
      (this.color = new Float32Array(t * 4)),
      (this.misc = new Float32Array(t * 4)),
      (this.attrs = {
        aPos: new InstancedBufferAttribute(this.pos, 3),
        aVel: new InstancedBufferAttribute(this.vel, 3),
        aTime: new InstancedBufferAttribute(this.time, 2),
        aSize: new InstancedBufferAttribute(this.size, 2),
        aColor: new InstancedBufferAttribute(this.color, 4),
        aMisc: new InstancedBufferAttribute(this.misc, 4),
      }));
    for (const a in this.attrs)
      (this.attrs[a].setUsage(DynamicDrawUsage),
        s.setAttribute(a, this.attrs[a]));
    ((s.instanceCount = t), (this.uTime = { value: 0 }));
    const r = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: !0,
      depthWrite: !1,
      depthTest: !0,
      blending: e ? AdditiveBlending : NormalBlending,
    });
    ((this.mesh = new Mesh(s, r)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = e ? 20 : 19));
  }
  emit(t, e, n, s, r, a, l, o, c, h, d, u, m, g, v, p, f, w) {
    const M = this.head;
    ((this.head = (M + 1) % this.n),
      (this.dirty = !0),
      (this.pos[M * 3] = t),
      (this.pos[M * 3 + 1] = e),
      (this.pos[M * 3 + 2] = n),
      (this.vel[M * 3] = s),
      (this.vel[M * 3 + 1] = r),
      (this.vel[M * 3 + 2] = a),
      (this.time[M * 2] = l),
      (this.time[M * 2 + 1] = o),
      (this.size[M * 2] = c),
      (this.size[M * 2 + 1] = h),
      (this.color[M * 4] = d),
      (this.color[M * 4 + 1] = u),
      (this.color[M * 4 + 2] = m),
      (this.color[M * 4 + 3] = g),
      (this.misc[M * 4] = v),
      (this.misc[M * 4 + 1] = p),
      (this.misc[M * 4 + 2] = f),
      (this.misc[M * 4 + 3] = w));
  }
  flush(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
export class RingSystem {
  constructor(t) {
    const e = new PlaneGeometry(1, 1);
    e.rotateX(-Math.PI / 2);
    const n = new InstancedBufferGeometry();
    (n.setIndex(e.index),
      n.setAttribute("position", e.attributes.position),
      n.setAttribute("uv", e.attributes.uv),
      (this.n = t),
      (this.head = 0),
      (this.dirty = !1),
      (this.pos = new Float32Array(t * 3)),
      (this.time = new Float32Array(t * 2)),
      (this.params = new Float32Array(t * 2)),
      (this.color = new Float32Array(t * 3)),
      (this.attrs = {
        aPos: new InstancedBufferAttribute(this.pos, 3),
        aTime: new InstancedBufferAttribute(this.time, 2),
        aParams: new InstancedBufferAttribute(this.params, 2),
        aColor: new InstancedBufferAttribute(this.color, 3),
      }));
    for (const r in this.attrs)
      (this.attrs[r].setUsage(DynamicDrawUsage),
        n.setAttribute(r, this.attrs[r]));
    ((n.instanceCount = t), (this.uTime = { value: 0 }));
    const s = new ShaderMaterial({
      uniforms: { uTime: this.uTime },
      transparent: !0,
      depthWrite: !1,
      blending: AdditiveBlending,
      vertexShader: `
        attribute vec3 aPos; attribute vec2 aTime; attribute vec2 aParams; attribute vec3 aColor; uniform float uTime;
        varying vec2 vUv; varying float vF; varying vec3 vColor; varying float vThick;
        void main(){
          float f = (uTime - aTime.x) / max(aTime.y, 1e-4);
          vUv = uv; vF = f; vColor = aColor; vThick = aParams.y;
          if (f < 0.0 || f > 1.0 || aTime.y <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
          float ease = 1.0 - pow(1.0 - f, 2.5);
          float R = aParams.x * ease;
          vec3 p = aPos + vec3(position.x * R * 2.0, 0.04, position.z * R * 2.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv; varying float vF; varying vec3 vColor; varying float vThick;
        void main(){
          float r = length(vUv - 0.5) * 2.0;
          float ring = smoothstep(vThick, 0.0, abs(r - 0.92)) + 0.35 * smoothstep(0.92, 0.5, r) * smoothstep(0.0, 0.5, r);
          float a = ring * (1.0 - vF) * (1.0 - vF);
          gl_FragColor = vec4(vColor * a * 2.0, a);
        }`,
    });
    ((this.mesh = new Mesh(n, s)),
      (this.mesh.frustumCulled = !1),
      (this.mesh.renderOrder = 18));
  }
  emit(t, e, n, s, r, a, l, o, c, h) {
    const d = this.head;
    ((this.head = (d + 1) % this.n),
      (this.dirty = !0),
      (this.pos[d * 3] = t),
      (this.pos[d * 3 + 1] = e),
      (this.pos[d * 3 + 2] = n),
      (this.time[d * 2] = s),
      (this.time[d * 2 + 1] = r),
      (this.params[d * 2] = a),
      (this.params[d * 2 + 1] = l),
      (this.color[d * 3] = o),
      (this.color[d * 3 + 1] = c),
      (this.color[d * 3 + 2] = h));
  }
  flush(t) {
    if (((this.uTime.value = t), !!this.dirty)) {
      for (const e in this.attrs) this.attrs[e].needsUpdate = !0;
      this.dirty = !1;
    }
  }
}
export class ParticleSystem {
  constructor(t) {
    ((this.add = new ParticleBuffer(8e3, !0)),
      (this.alpha = new ParticleBuffer(2e3, !1)),
      (this.rings = new RingSystem(48)),
      t.add(this.add.mesh, this.alpha.mesh, this.rings.mesh),
      (this.t = 0),
      (this._ambT = 0));
  }
  update(t, e, n) {
    for (this.t = t, this._ambT += e; this._ambT > 0.05;) {
      this._ambT -= 0.05;
      const s = Math.random() * Math.PI * 2,
        r = rand(2, 22),
        a = n.x + Math.cos(s) * r,
        l = n.z + Math.sin(s) * r,
        o = Math.random() > 0.35;
      this.add.emit(
        a,
        rand(0.2, 6),
        l,
        rand(-0.3, 0.3),
        rand(0.05, 0.3),
        rand(-0.3, 0.3),
        t,
        rand(5, 9),
        rand(0.02, 0.05),
        rand(0.02, 0.05),
        theme.fx.dust[0],
        theme.fx.dust[1],
        theme.fx.dust[2],
        theme.fx.dustAlpha,
        -0.02,
        0.6,
        2,
        0,
      );
    }
    (this.add.flush(t), this.alpha.flush(t), this.rings.flush(t));
  }
  randomInCone(t, e, n) {
    const s = rand(-1, 1),
      r = rand(-1, 1),
      a = rand(-1, 1);
    return (n.set(t.x + s * e, t.y + r * e, t.z + a * e).normalize(), n);
  }
  impactSparks(t, e, n = 14, s = 1) {
    const r = this.t,
      a = new Vector3();
    for (let l = 0; l < n; l++) {
      this.randomInCone(e, 0.9, a);
      const o = rand(2.5, 9) * s,
        c = Math.random() > 0.6;
      this.add.emit(
        t.x,
        t.y,
        t.z,
        a.x * o + e.x,
        a.y * o + 1.5,
        a.z * o + e.z,
        r,
        rand(0.2, 0.6),
        rand(0.015, 0.03),
        0.005,
        theme.fx.sparks[0],
        theme.fx.sparks[1] * (c ? 1 : 0.75),
        theme.fx.sparks[2] * (c ? 1 : 0.4),
        rand(3, 6),
        14,
        rand(1.5, 3),
        0,
        0.05,
      );
    }
    this.add.emit(
      t.x + e.x * 0.03,
      t.y + e.y * 0.03,
      t.z + e.z * 0.03,
      0,
      0,
      0,
      r,
      0.07,
      0.35 * s,
      0.5 * s,
      1,
      0.85,
      0.6,
      5,
      0,
      1,
      2,
      0,
    );
    for (let l = 0; l < 3; l++)
      (this.randomInCone(e, 0.7, a),
        this.alpha.emit(
          t.x + e.x * 0.05,
          t.y + e.y * 0.05,
          t.z + e.z * 0.05,
          a.x * rand(0.6, 1.4),
          a.y * rand(0.6, 1.4) + 0.4,
          a.z * rand(0.6, 1.4),
          r,
          rand(0.6, 1.1),
          rand(0.12, 0.2),
          rand(0.5, 0.8),
          0.55,
          0.52,
          0.48,
          0.55,
          -0.6,
          3.5,
          1,
          rand(-2, 2),
        ));
  }
  fleshBurst(t, e, n = !1, s = [1, 0.42, 0.1]) {
    const r = this.t,
      a = new Vector3(),
      l = n ? 26 : 14;
    for (let o = 0; o < l; o++) {
      a.set(rand(-1, 1), rand(-0.6, 1), rand(-1, 1)).normalize();
      const c = rand(1.5, 6) * (n ? 1.5 : 1);
      this.add.emit(
        t.x,
        t.y,
        t.z,
        e.x * 2.5 + a.x * c,
        1.5 + a.y * c,
        e.z * 2.5 + a.z * c,
        r,
        rand(0.4, 0.9),
        rand(0.04, 0.09),
        0.01,
        s[0],
        s[1],
        s[2],
        rand(3, 6),
        16,
        rand(1, 2.5),
        2,
        0,
      );
    }
    for (let o = 0; o < (n ? 10 : 5); o++) {
      a.set(rand(-1, 1), rand(-0.5, 1), rand(-1, 1)).normalize();
      const c = rand(3, 8);
      this.add.emit(
        t.x,
        t.y,
        t.z,
        e.x * 2 + a.x * c,
        1 + a.y * c,
        e.z * 2 + a.z * c,
        r,
        rand(0.25, 0.5),
        rand(0.02, 0.04),
        0.005,
        s[0],
        s[1] * 0.8,
        s[2],
        4,
        14,
        1.5,
        0,
        0.04,
      );
    }
    this.add.emit(
      t.x,
      t.y,
      t.z,
      0,
      0,
      0,
      r,
      0.08,
      0.3,
      0.55,
      s[0],
      s[1] + 0.3,
      s[2] + 0.2,
      6,
      0,
      1,
      2,
      0,
    );
    for (let o = 0; o < 2; o++)
      this.alpha.emit(
        t.x,
        t.y,
        t.z,
        rand(-0.6, 0.6),
        rand(0.3, 0.9),
        rand(-0.6, 0.6),
        r,
        rand(0.5, 0.9),
        0.15,
        0.6,
        0.15,
        0.06,
        0.02,
        0.7,
        -0.4,
        3,
        1,
        rand(-2, 2),
      );
  }
  deathBurst(t, e, n = 1, s = !1) {
    const r = this.t,
      a = new Vector3(),
      l = Math.floor(50 * n);
    for (let o = 0; o < l; o++) {
      a.set(rand(-1, 1), rand(-0.2, 1), rand(-1, 1)).normalize();
      const c = rand(2, 9) * n;
      this.add.emit(
        t.x,
        t.y + rand(0, 1.2 * n),
        t.z,
        a.x * c,
        a.y * c + 2,
        a.z * c,
        r,
        rand(0.6, 1.6),
        rand(0.03, 0.1) * n,
        0.01,
        e[0],
        e[1],
        e[2],
        rand(3, 7),
        rand(6, 14),
        rand(0.8, 2),
        2,
        0,
      );
    }
    for (let o = 0; o < Math.floor(12 * n); o++) {
      a.set(rand(-1, 1), rand(0, 1), rand(-1, 1)).normalize();
      const c = rand(4, 12) * n;
      this.add.emit(
        t.x,
        t.y + rand(0.3, 1.4 * n),
        t.z,
        a.x * c,
        a.y * c,
        a.z * c,
        r,
        rand(0.3, 0.6),
        rand(0.02, 0.05),
        0.005,
        1,
        0.8,
        0.5,
        5,
        14,
        1.5,
        0,
        0.05,
      );
    }
    for (let o = 0; o < Math.floor(6 * n); o++)
      this.alpha.emit(
        t.x + rand(-0.3, 0.3),
        t.y + rand(0.3, 1.3 * n),
        t.z + rand(-0.3, 0.3),
        rand(-0.8, 0.8),
        rand(0.4, 1.4),
        rand(-0.8, 0.8),
        r,
        rand(0.9, 1.6),
        0.3 * n,
        1.2 * n,
        0.12,
        0.05,
        0.02,
        0.8,
        -0.5,
        2.5,
        1,
        rand(-1.5, 1.5),
      );
    (this.add.emit(
      t.x,
      t.y + 0.9 * n,
      t.z,
      0,
      0,
      0,
      r,
      0.14,
      1.2 * n,
      2.2 * n,
      e[0],
      e[1] + 0.25,
      e[2] + 0.2,
      4,
      0,
      1,
      2,
      0,
    ),
      s &&
        this.add.emit(
          t.x,
          t.y + 1.6 * n,
          t.z,
          0,
          0,
          0,
          r,
          0.2,
          0.5,
          1.4,
          1,
          0.9,
          0.7,
          6,
          0,
          1,
          2,
          0,
        ),
      this.rings.emit(t.x, 0.05, t.z, r, 0.6, 2.2 * n, 0.35, e[0], e[1], e[2]));
  }
  slamWave(t, e) {
    const n = this.t;
    (this.rings.emit(t.x, 0.05, t.z, n, 0.7, e, 0.3, 1, 0.45, 0.15),
      this.rings.emit(
        t.x,
        0.05,
        t.z,
        n + 0.08,
        0.6,
        e * 0.7,
        0.4,
        1,
        0.7,
        0.4,
      ));
    for (let s = 0; s < 40; s++) {
      const r = Math.random() * Math.PI * 2,
        a = rand(3, 8);
      this.add.emit(
        t.x,
        0.1,
        t.z,
        Math.cos(r) * a,
        rand(1, 5),
        Math.sin(r) * a,
        n,
        rand(0.4, 1),
        rand(0.03, 0.07),
        0.01,
        1,
        0.5,
        0.15,
        5,
        12,
        1.5,
        2,
        0,
      );
    }
    for (let s = 0; s < 10; s++) {
      const r = Math.random() * Math.PI * 2;
      this.alpha.emit(
        t.x + Math.cos(r) * 0.5,
        0.2,
        t.z + Math.sin(r) * 0.5,
        Math.cos(r) * 3,
        1.2,
        Math.sin(r) * 3,
        n,
        rand(0.8, 1.4),
        0.4,
        1.6,
        0.35,
        0.3,
        0.25,
        0.7,
        -0.3,
        3,
        1,
        rand(-1, 1),
      );
    }
  }
  // Flamethrower stream.
  //
  // The first version read as tracer fire, not fire: a few hard round glows
  // (type 2) launched at nearly one speed with little drag, so they flew in a
  // straight line as discrete pellets. Real burning fuel does the opposite --
  // it is thrown, decelerates hard against the air, billows outward and rises
  // as it burns out.
  //
  // Three layers, because a particle's colour is fixed for its life and a
  // flame is not one colour: a short white-hot core at the nozzle, an orange
  // body that does the billowing, and a sooty tail that lingers. Speeds are
  // spread widely inside each layer so a tick's worth of particles smears
  // along the jet instead of travelling as a clump.
  flameJet(origin, dir, range = 9.5, spread = 0.16) {
    const now = this.t,
      d = this._jetDir || (this._jetDir = new Vector3());
    // Hot core: fast, small, brief. This is the part that looks like a torch.
    for (let i = 0; i < 3; i++) {
      this.randomInCone(dir, spread * 0.4, d);
      const life = rand(0.1, 0.18),
        speed = (range / life) * rand(0.2, 0.34);
      this.add.emit(
        origin.x, origin.y, origin.z,
        d.x * speed, d.y * speed, d.z * speed,
        now, life,
        rand(0.07, 0.12), rand(0.24, 0.36),
        1, 0.9, 0.55,
        rand(2.6, 3.6),
        -0.4, 5.5, 1, rand(-3, 3),
      );
    }
    // Body: the flame proper. High drag is what turns a projectile into a
    // billow -- these travel most of their distance in the first third of
    // their life and then bloom outward in place.
    for (let i = 0; i < 9; i++) {
      this.randomInCone(dir, spread, d);
      const life = rand(0.3, 0.5),
        // A wide speed spread is what fills the gaps between ticks. Fast
        // enough that the flame front reaches most of the damage cone: with
        // drag k a particle covers v/k * (1 - e^-kt), so the two are tuned
        // together, and a jet that stops short of its own damage range makes
        // players misjudge it.
        speed = (range / life) * rand(0.45, 1.0);
      this.add.emit(
        origin.x, origin.y, origin.z,
        d.x * speed, d.y * speed, d.z * speed,
        now, life,
        rand(0.1, 0.2), rand(0.75, 1.35),
        1, rand(0.34, 0.5), 0.09,
        rand(1.5, 2.4),
        // Negative gravity: hot gas rises as it burns out.
        -1.3, 2.4, 1, rand(-2.5, 2.5),
      );
    }
    // Sooty tail, alpha-blended so it darkens rather than adds. Slower and
    // longer-lived, so the jet leaves something behind.
    for (let i = 0; i < 3; i++) {
      this.randomInCone(dir, spread * 1.5, d);
      const life = rand(0.6, 1.0),
        speed = (range / life) * rand(0.22, 0.45);
      this.alpha.emit(
        origin.x, origin.y, origin.z,
        d.x * speed, d.y * speed, d.z * speed,
        now, life,
        rand(0.16, 0.28), rand(1.1, 1.9),
        0.16, 0.13, 0.12,
        rand(0.16, 0.3),
        -1.8, 1.9, 1, rand(-1.6, 1.6),
      );
    }
  }
  muzzleSmoke(t, e, n = 1) {
    const s = this.t;
    for (let r = 0; r < Math.ceil(2 * n); r++)
      this.alpha.emit(
        t.x,
        t.y,
        t.z,
        e.x * rand(1, 2.5) + rand(-0.3, 0.3),
        e.y * rand(1, 2.5) + 0.6,
        e.z * rand(1, 2.5) + rand(-0.3, 0.3),
        s,
        rand(0.5, 1) * n,
        0.08,
        rand(0.35, 0.6) * n,
        0.5,
        0.48,
        0.45,
        0.45,
        -0.4,
        4,
        1,
        rand(-3, 3),
      );
  }
  spawnFx(t, e) {
    const n = this.t;
    for (let s = 0; s < 24; s++) {
      const r = Math.random() * Math.PI * 2,
        a = rand(0.2, 1);
      this.add.emit(
        t.x + Math.cos(r) * a,
        rand(0, 0.3),
        t.z + Math.sin(r) * a,
        0,
        rand(1.5, 4),
        0,
        n,
        rand(0.6, 1.2),
        rand(0.03, 0.06),
        0.01,
        e[0],
        e[1],
        e[2],
        4,
        -1,
        1.2,
        2,
        0,
      );
    }
    this.rings.emit(t.x, 0.05, t.z, n, 0.8, 1.8, 0.35, e[0], e[1], e[2]);
  }
  trail(t, e, n = 0.12) {
    this.add.emit(
      t.x,
      t.y,
      t.z,
      rand(-0.3, 0.3),
      rand(-0.3, 0.3),
      rand(-0.3, 0.3),
      this.t,
      rand(0.2, 0.4),
      n,
      0.01,
      e[0],
      e[1],
      e[2],
      4,
      0,
      2,
      2,
      0,
    );
  }
  splash(t, e) {
    const n = this.t,
      s = new Vector3();
    for (let r = 0; r < 18; r++) {
      s.set(rand(-1, 1), rand(0.2, 1), rand(-1, 1)).normalize();
      const a = rand(2, 6);
      this.add.emit(
        t.x,
        t.y,
        t.z,
        s.x * a,
        s.y * a,
        s.z * a,
        n,
        rand(0.4, 0.8),
        rand(0.04, 0.08),
        0.01,
        e[0],
        e[1],
        e[2],
        4,
        12,
        1.5,
        2,
        0,
      );
    }
    this.add.emit(
      t.x,
      t.y,
      t.z,
      0,
      0,
      0,
      n,
      0.1,
      0.6,
      1.2,
      e[0],
      e[1],
      e[2],
      5,
      0,
      1,
      2,
      0,
    );
  }
  pickupBurst(t) {
    const e = this.t;
    for (let n = 0; n < 30; n++) {
      const s = Math.random() * Math.PI * 2,
        r = rand(1, 3);
      this.add.emit(
        t.x,
        t.y + 0.3,
        t.z,
        Math.cos(s) * r,
        rand(2, 5),
        Math.sin(s) * r,
        e,
        rand(0.5, 1),
        0.05,
        0.01,
        theme.fx.pickup[0],
        theme.fx.pickup[1],
        theme.fx.pickup[2],
        5,
        8,
        1.5,
        2,
        0,
      );
    }
  }
}
