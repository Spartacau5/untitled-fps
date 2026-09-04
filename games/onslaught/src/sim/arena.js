import {
  AdditiveBlending,
  BoxGeometry,
  CircleGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  FogExp2,
  Group,
  HemisphereLight,
  MathUtils,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  OctahedronGeometry,
  PlaneGeometry,
  PointLight,
  ShaderMaterial,
  TorusGeometry,
  Vector3,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { mulberry32 } from "../core/rng.js";
import { ARENA_RADIUS, SUN_DIR, WALL_HEIGHT } from "../data/tuning.js";
import { NOISE_GLSL } from "../render/shaders/noise.glsl.js";
import { theme } from "../theme/theme.js";

export class BoxCollider {
  constructor(t, e, n, s, r, a, l) {
    ((this.cx = t),
      (this.cz = e),
      (this.hx = n),
      (this.hz = s),
      (this.y0 = r),
      (this.y1 = a),
      (this.yaw = l),
      (this.c = Math.cos(l)),
      (this.s = Math.sin(l)),
      (this.r = Math.hypot(n, s)));
  }
  toLocal(t, e) {
    const n = t - this.cx,
      s = e - this.cz;
    return [n * this.c + s * this.s, -n * this.s + s * this.c];
  }
  toWorldDir(t, e) {
    return [t * this.c - e * this.s, t * this.s + e * this.c];
  }
}
export class Arena {
  constructor(t) {
    ((this.scene = t),
      (this.radius = ARENA_RADIUS),
      (this.boxes = []),
      (this.gates = []),
      (this.timeUniform = { value: 0 }),
      (this.portalMats = []),
      (this.rng = mulberry32(1337)),
      (this._tmp = new Vector3()),
      this._build());
  }
  _materials() {
    const t = this.timeUniform;
    this.mats = {
      wall: new MeshStandardMaterial({
        color: 4607322,
        roughness: 0.65,
        metalness: 0.2,
      }),
      dark: new MeshStandardMaterial({
        color: 3488580,
        roughness: 0.75,
        metalness: 0.1,
      }),
      pillar: new MeshStandardMaterial({
        color: 4080976,
        roughness: 0.6,
        metalness: 0.25,
      }),
      crate: new MeshStandardMaterial({
        color: 4475733,
        roughness: 0.7,
        metalness: 0.2,
      }),
      barrier: new MeshStandardMaterial({
        color: 4870491,
        roughness: 0.6,
        metalness: 0.25,
      }),
      emCyan: new MeshStandardMaterial({
        color: 0,
        emissive: 4644095,
        emissiveIntensity: 1.5,
        roughness: 1,
        metalness: 0,
      }),
      emCyanDim: new MeshStandardMaterial({
        color: 0,
        emissive: 2792640,
        emissiveIntensity: 0.8,
        roughness: 1,
        metalness: 0,
      }),
      emOrange: new MeshStandardMaterial({
        color: 0,
        emissive: 16738842,
        emissiveIntensity: 1.6,
        roughness: 1,
        metalness: 0,
      }),
      emWhite: new MeshStandardMaterial({
        color: 0,
        emissive: 16773853,
        emissiveIntensity: 1.2,
        roughness: 1,
        metalness: 0,
      }),
    };
    const e = new MeshStandardMaterial({
      color: 3818064,
      roughness: 0.5,
      metalness: 0.3,
    });
    ((e.onBeforeCompile = (n) => {
      ((n.uniforms.uTime = t),
        (n.vertexShader = n.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWPos;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
          )),
        (n.fragmentShader = n.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
varying vec3 vWPos; uniform float uTime;
${NOISE_GLSL}`,
          )
          .replace(
            "#include <map_fragment>",
            `
          #include <map_fragment>
          vec2 fp = vWPos.xz;
          float fr = length(fp);
          vec2 tile = fp / 3.0;
          vec2 tg = abs(fract(tile) - 0.5);
          float gap = smoothstep(0.462, 0.48, max(tg.x, tg.y));
          vec2 sg = abs(fract(tile * 3.0) - 0.5);
          float sub = smoothstep(0.47, 0.49, max(sg.x, sg.y)) * (1.0 - gap);
          float wear = noise2(fp * 0.7) * 0.6 + noise2(fp * 4.0) * 0.4;
          float grime = smoothstep(0.35, 0.75, fbm2(fp * 0.35 + 3.0));
          vec2 cellId = floor(tile);
          float cellVar = hash21(cellId) * 0.25;
          diffuseColor.rgb *= (0.8 + 0.4 * wear + cellVar) * (1.0 - 0.35 * sub) * (1.0 - 0.45 * grime);
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.015, 0.018, 0.025), gap);
          float ring = smoothstep(0.12, 0.0, abs(fr - (ARENA_RADIUS - 0.9)));
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.02), ring);
        `.replace("ARENA_RADIUS", ARENA_RADIUS.toFixed(1)),
          )
          .replace(
            "#include <roughnessmap_fragment>",
            `
          #include <roughnessmap_fragment>
          roughnessFactor = clamp(roughnessFactor * (0.75 + 0.5 * wear) + gap * 0.4 + grime * 0.3, 0.05, 1.0);
        `,
          )
          .replace(
            "#include <emissivemap_fragment>",
            `
          #include <emissivemap_fragment>
          float pulse = 0.5 + 0.5 * sin(fr * 0.55 - uTime * 2.2);
          pulse = pulse * pulse * pulse;
          float ripple = smoothstep(0.9, 1.0, 1.0 - abs(fract(fr * 0.08 - uTime * 0.07) - 0.5) * 2.0);
          totalEmissiveRadiance += vec3(0.15, 0.75, 1.0) * gap * (0.05 + 0.25 * pulse + 0.3 * ripple);
          totalEmissiveRadiance += vec3(0.2, 0.8, 1.0) * ring * 1.0;
          totalEmissiveRadiance += vec3(1.0, 0.45, 0.15) * smoothstep(0.985, 1.0, hash21(cellId + 0.5)) * (1.0 - gap) * (0.5 + 0.5 * sin(uTime * 3.0 + hash21(cellId) * 20.0)) * 0.35;
        `,
          )));
    }),
      (e.customProgramCacheKey = () => "arenaFloor"),
      (this.mats.floor = e));
  }
  _build() {
    this._materials();
    const t = this.scene,
      e = this.mats,
      n = new PlaneGeometry(240, 240, 1, 1);
    n.rotateX(-Math.PI / 2);
    const s = new Mesh(n, e.floor);
    ((s.receiveShadow = !0), t.add(s));
    const r = new CylinderGeometry(7, 8.5, 0.5, 8, 1, !1);
    r.rotateY(Math.PI / 8);
    const a = new Mesh(r, e.pillar);
    ((a.position.y = 0.25),
      (a.receiveShadow = !0),
      (a.castShadow = !0),
      t.add(a));
    const l = new TorusGeometry(7.05, 0.05, 6, 8);
    (l.rotateX(Math.PI / 2), l.rotateY(Math.PI / 8));
    const o = new Mesh(l, e.emCyan);
    ((o.position.y = 0.5),
      t.add(o),
      this._buildHexTop(),
      this._buildHologram());
    const c = [],
      h = [],
      d = [],
      u = [],
      m = [],
      g = 24;
    for (let z = 0; z < g; z++) {
      const U = (z / g) * Math.PI * 2,
        H = z % 4 === 2,
        k = Math.cos(U) * (ARENA_RADIUS + 0.6),
        G = Math.sin(U) * (ARENA_RADIUS + 0.6),
        q = -U + Math.PI / 2;
      if (H) {
        for (const Y of [-3.4, 3.4]) {
          const it = new BoxGeometry(1.3, WALL_HEIGHT + 0.6, 1.6);
          (it.translate(Y, (WALL_HEIGHT + 0.6) / 2, 0),
            this._place(it, k, G, q),
            c.push(it));
          const vt = new BoxGeometry(0.12, WALL_HEIGHT - 1.5, 0.08);
          (vt.translate(
            Y + (Y < 0 ? 0.66 : -0.66),
            (WALL_HEIGHT - 1.5) / 2 + 0.4,
            -0.8,
          ),
            this._place(vt, k, G, q),
            u.push(vt));
        }
        const O = new BoxGeometry(8.1, 1.6, 1.6);
        (O.translate(0, WALL_HEIGHT - 0.2, 0),
          this._place(O, k, G, q),
          c.push(O));
        const et = new BoxGeometry(5.6, 0.12, 0.08);
        (et.translate(0, WALL_HEIGHT - 1.05, -0.8),
          this._place(et, k, G, q),
          u.push(et));
        const K = new BoxGeometry(8.2, WALL_HEIGHT + 1, 8);
        (K.translate(0, (WALL_HEIGHT + 1) / 2, 4.6),
          this._place(K, k, G, q),
          m.push(K));
        const nt = this._makePortal();
        (nt.position.set(
          Math.cos(U) * (ARENA_RADIUS + 0.2),
          3.9,
          Math.sin(U) * (ARENA_RADIUS + 0.2),
        ),
          (nt.rotation.y = q),
          t.add(nt));
        const _t = new Vector3(-Math.cos(U), 0, -Math.sin(U)),
          Lt = new PointLight(
            theme.lights.gate.color,
            theme.lights.gate.intensity,
            26,
            2,
          );
        (Lt.position.set(
          Math.cos(U) * (ARENA_RADIUS - 2.2),
          3.2,
          Math.sin(U) * (ARENA_RADIUS - 2.2),
        ),
          t.add(Lt),
          this.gates.push({
            pos: new Vector3(
              Math.cos(U) * (ARENA_RADIUS - 1.4),
              0,
              Math.sin(U) * (ARENA_RADIUS - 1.4),
            ),
            dir: _t,
            mat: nt.material,
            light: Lt,
            activity: 0,
            angle: U,
          }));
      } else {
        const O = new BoxGeometry(9.7, WALL_HEIGHT, 1.2);
        (O.translate(0, WALL_HEIGHT / 2, 0),
          this._place(O, k, G, q),
          c.push(O));
        for (const _t of [-3.2, 3.2]) {
          const Lt = new BoxGeometry(0.5, WALL_HEIGHT, 0.4);
          (Lt.translate(_t, WALL_HEIGHT / 2, -0.7),
            this._place(Lt, k, G, q),
            m.push(Lt));
        }
        const et = new BoxGeometry(9.5, 0.09, 0.06);
        (et.translate(0, 3.6, -0.63), this._place(et, k, G, q), h.push(et));
        const K = new BoxGeometry(9.5, 0.06, 0.06);
        (K.translate(0, 0.35, -0.63), this._place(K, k, G, q), d.push(K));
        const nt = new BoxGeometry(9.5, 0.05, 0.06);
        (nt.translate(0, 8.4, -0.63), this._place(nt, k, G, q), d.push(nt));
      }
    }
    const v = (z, U, H = !0) => {
      if (!z.length) return;
      const k = new Mesh(mergeGeometries(z, !1), U);
      return ((k.castShadow = H), (k.receiveShadow = H), t.add(k), k);
    };
    (v(c, e.wall),
      v(m, e.dark),
      v(h, e.emCyan, !1),
      v(d, e.emCyanDim, !1),
      v(u, e.emOrange, !1));
    const p = [],
      f = [];
    for (let z = 0; z < 8; z++) {
      const U = (z / 8) * Math.PI * 2 + Math.PI / 8,
        H = Math.cos(U) * 19,
        k = Math.sin(U) * 19,
        G = new BoxGeometry(1.7, 10, 1.7);
      (G.translate(H, 5, k), p.push(G));
      const q = new BoxGeometry(2.1, 0.5, 2.1);
      (q.translate(H, 10.1, k), p.push(q));
      const O = new BoxGeometry(2.3, 0.35, 2.3);
      (O.translate(H, 0.17, k), p.push(O));
      for (const et of [1.4, 6.8]) {
        const K = new BoxGeometry(1.82, 0.12, 1.82);
        (K.translate(H, et, k), f.push(K));
      }
      (this.boxes.push(new BoxCollider(H, k, 0.85, 0.85, 0, 10, 0)),
        this.boxes.push(new BoxCollider(H, k, 1.15, 1.15, 0, 0.35, 0)));
    }
    v(p, e.pillar);
    for (let z = 0; z < 4; z++) {
      const U = (z / 4) * Math.PI * 2 + Math.PI / 4,
        H = new PointLight(
          theme.lights.perimeter.color,
          theme.lights.perimeter.intensity,
          40,
          2,
        );
      (H.position.set(Math.cos(U) * 27, 6.5, Math.sin(U) * 27), t.add(H));
    }
    v(f, e.emCyan, !1);
    const w = [],
      M = [];
    for (let z = 0; z < 8; z++) {
      const U = (z / 8) * Math.PI * 2,
        H = z % 2 === 0 ? 12.5 : 26,
        k = Math.cos(U) * H,
        G = Math.sin(U) * H,
        q = -U + Math.PI / 2,
        O = z % 2 === 0 ? 4.2 : 5.5,
        et = new RoundedBoxGeometry(O, 2.1, 0.55, 2, 0.06);
      (et.translate(0, 1.05, 0), this._place(et, k, G, q), w.push(et));
      const K = new BoxGeometry(O - 0.6, 0.06, 0.04);
      (K.translate(0, 2, -0.29), this._place(K, k, G, q), M.push(K));
      const nt = new BoxGeometry(O - 0.6, 0.06, 0.04);
      (nt.translate(0, 2, 0.29),
        this._place(nt, k, G, q),
        M.push(nt),
        this.boxes.push(new BoxCollider(k, G, O / 2, 0.28, 0, 2.1, q)));
    }
    (v(w, e.barrier), v(M, e.emOrange, !1));
    const _ = [],
      L = [],
      R = [
        [1.6, 1.6, 1.6],
        [1.2, 1.2, 1.2],
        [2.4, 1.2, 1.2],
        [1.3, 1.3, 1.3],
        [2, 1, 1.4],
      ];
    let A = 0,
      C = 0;
    for (; A < 16 && C < 400;) {
      C++;
      const z = 9 + this.rng() * 22,
        U = this.rng() * Math.PI * 2,
        H = Math.cos(U) * z,
        k = Math.sin(U) * z;
      let G = !0;
      for (const _t of this.gates)
        Math.hypot(H - _t.pos.x, k - _t.pos.z) < 7 && (G = !1);
      for (const _t of this.boxes)
        Math.hypot(H - _t.cx, k - _t.cz) < _t.r + 2.4 && (G = !1);
      if (!G) continue;
      const q = R[Math.floor(this.rng() * R.length)],
        O = this.rng() * Math.PI,
        et = new RoundedBoxGeometry(q[0], q[1], q[2], 2, 0.05);
      (et.translate(0, q[1] / 2, 0), this._place(et, H, k, O), _.push(et));
      const K = new BoxGeometry(q[0] * 0.7, 0.05, 0.03);
      (K.translate(0, q[1] * 0.72, -q[2] / 2 - 0.005),
        this._place(K, H, k, O),
        L.push(K));
      const nt = new BoxGeometry(q[0] * 0.7, 0.05, 0.03);
      (nt.translate(0, q[1] * 0.72, q[2] / 2 + 0.005),
        this._place(nt, H, k, O),
        L.push(nt),
        this.boxes.push(new BoxCollider(H, k, q[0] / 2, q[2] / 2, 0, q[1], O)),
        A++);
    }
    (v(_, e.crate), v(L, (this.rng() > 0.5, e.emCyanDim), !1));
    const S = new DirectionalLight(
      theme.lights.sun.color,
      theme.lights.sun.intensity,
    );
    (S.position.copy(SUN_DIR).multiplyScalar(90),
      (S.castShadow = !0),
      S.shadow.mapSize.set(2048, 2048),
      (S.shadow.camera.left = -44),
      (S.shadow.camera.right = 44),
      (S.shadow.camera.top = 44),
      (S.shadow.camera.bottom = -44),
      (S.shadow.camera.near = 20),
      (S.shadow.camera.far = 180),
      (S.shadow.bias = -6e-4),
      (S.shadow.normalBias = 0.03),
      (S.shadow.radius = 3),
      t.add(S),
      t.add(S.target),
      (this.sun = S));
    const y = new HemisphereLight(
      theme.lights.hemi.sky,
      theme.lights.hemi.ground,
      theme.lights.hemi.intensity,
    );
    t.add(y);
    t.fog = new FogExp2(theme.lights.fog.color, theme.lights.fog.density);
  }
  _place(t, e, n, s) {
    const r = new Matrix4().makeRotationY(s).setPosition(e, 0, n);
    t.applyMatrix4(r);
  }
  _makePortal() {
    const t = new PlaneGeometry(6.4, 7.6),
      e = new ShaderMaterial({
        transparent: !0,
        depthWrite: !1,
        side: DoubleSide,
        blending: AdditiveBlending,
        uniforms: { uTime: this.timeUniform, uActivity: { value: 0 } },
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uTime; uniform float uActivity; varying vec2 vUv;
        ${NOISE_GLSL}
        void main(){
          vec2 p = (vUv - 0.5) * vec2(6.4, 7.6) / 3.4;
          float r = length(p);
          float ang = atan(p.y, p.x);
          float n = fbm3(vec3(p * 1.6 + vec2(0.0, -uTime * 0.6), uTime * 0.25));
          float swirl = 0.5 + 0.5 * sin(ang * 3.0 + r * 7.0 - uTime * 3.5 + n * 5.0);
          float core = smoothstep(1.05, 0.15, r);
          float veins = smoothstep(0.45, 0.6, noise3(vec3(p * 4.0, uTime * 0.8 + n)));
          vec3 col = mix(vec3(0.9, 0.18, 0.03), vec3(1.0, 0.65, 0.2), n) * (0.35 + 0.65 * swirl) * core;
          col += vec3(1.0, 0.5, 0.15) * veins * core * 0.6;
          col += vec3(1.0, 0.85, 0.6) * smoothstep(0.35, 0.0, r) * (0.3 + uActivity);
          float rimA = smoothstep(0.08, 0.0, abs(r - 1.02)) * 0.9;
          col += vec3(1.0, 0.45, 0.12) * rimA;
          col *= 0.35 + uActivity * 0.8 + 0.08 * sin(uTime * 9.0);
          float a = core + rimA;
          gl_FragColor = vec4(col * a, a);
        }
      `,
      });
    return (this.portalMats.push(e), new Mesh(t, e));
  }
  _buildHexTop() {
    const t = new CircleGeometry(6.9, 8);
    (t.rotateX(-Math.PI / 2), t.rotateY(Math.PI / 8));
    const e = new ShaderMaterial({
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        uniforms: { uTime: this.timeUniform },
        vertexShader:
          "varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uTime; varying vec3 vP;
        ${NOISE_GLSL}
        float hexDist(vec2 p){ p = abs(p); return max(dot(p, normalize(vec2(1.0, 1.73))), p.x); }
        vec4 hexCoords(vec2 uv){ vec2 r = vec2(1.0, 1.73); vec2 h = r * 0.5; vec2 a = mod(uv, r) - h; vec2 b = mod(uv - h, r) - h; vec2 gv = dot(a, a) < dot(b, b) ? a : b; float y = 0.5 - hexDist(gv); vec2 id = uv - gv; return vec4(gv, id); }
        void main(){
          vec2 p = vP.xz;
          float rr = length(p);
          vec4 hc = hexCoords(p * 1.1);
          float edge = smoothstep(0.07, 0.0, 0.5 - hexDist(hc.xy));
          float wave = pow(0.5 + 0.5 * sin(rr * 1.4 - uTime * 2.5), 3.0);
          float flick = smoothstep(0.75, 1.0, noise2(hc.zw * 0.35 + uTime * 0.5));
          vec3 col = vec3(0.2, 0.85, 1.0) * (edge * (0.1 + wave * 0.4) + flick * 0.15);
          col += vec3(0.6, 0.95, 1.0) * smoothstep(0.35, 0.0, rr) * (0.4 + 0.3 * sin(uTime * 2.0));
          float a = clamp(edge * 0.9 + flick * 0.5, 0.0, 1.0) * smoothstep(7.0, 6.2, rr);
          gl_FragColor = vec4(col * a, a);
        }
      `,
      }),
      n = new Mesh(t, e);
    ((n.position.y = 0.515), this.scene.add(n));
  }
  _buildHologram() {
    const t = new Group(),
      e = [this.mats.emCyan, this.mats.emCyanDim, this.mats.emWhite];
    for (let s = 0; s < 3; s++) {
      const r = new Mesh(new TorusGeometry(1.1 + s * 0.55, 0.035, 8, 64), e[s]);
      ((r.rotation.x = Math.PI / 2 + (s - 1) * 0.5), t.add(r));
    }
    const n = new Mesh(new OctahedronGeometry(0.45, 0), this.mats.emWhite);
    (t.add(n), t.position.set(0, 4.8, 0), this.scene.add(t), (this.holo = t));
  }
  groundHeight(t, e) {
    const n = Math.hypot(t, e);
    return 0.5 * MathUtils.clamp((8.5 - n) / 1.5, 0, 1);
  }
  resolveCircle(t, e, n, s = 0, r = 1.8, a = 0.35) {
    for (const c of this.boxes) {
      if (s >= c.y1 - a || s + r <= c.y0) continue;
      const h = t - c.cx,
        d = e - c.cz;
      if (h * h + d * d > (c.r + n) * (c.r + n)) continue;
      const [u, m] = c.toLocal(t, e),
        g = c.hx + n - Math.abs(u),
        v = c.hz + n - Math.abs(m);
      if (g <= 0 || v <= 0) continue;
      let p = 0,
        f = 0;
      g < v ? (p = g * Math.sign(u || 1)) : (f = v * Math.sign(m || 1));
      const [w, M] = c.toWorldDir(p, f);
      ((t += w), (e += M));
    }
    const l = Math.hypot(t, e),
      o = ARENA_RADIUS - n - 0.3;
    return (l > o && ((t *= o / l), (e *= o / l)), [t, e]);
  }
  floorAt(t, e, n, s) {
    let r = this.groundHeight(t, e);
    for (const a of this.boxes) {
      if (a.y1 > s + 0.35) continue;
      const [l, o] = a.toLocal(t, e);
      Math.abs(l) <= a.hx + n * 0.6 &&
        Math.abs(o) <= a.hz + n * 0.6 &&
        (r = Math.max(r, a.y1));
    }
    return r;
  }
  raycast(t, e, n) {
    let s = n,
      r = 0,
      a = 1,
      l = 0,
      o = !1;
    if (e.y < -1e-6) {
      const c = -t.y / e.y;
      if (c > 0 && c < s) {
        const h = t.x + e.x * c,
          d = t.z + e.z * c;
        if (Math.hypot(h, d) < 8.5) {
          const m = (0.5 - t.y) / e.y,
            g = Math.hypot(t.x + e.x * m, t.z + e.z * m);
          if (m > 0 && g < 7) ((s = m), (r = 0), (a = 1), (l = 0), (o = !0));
          else {
            const v = (0.25 - t.y) / e.y;
            v > 0 && v < s && ((s = v), (r = 0), (a = 1), (l = 0), (o = !0));
          }
        } else ((s = c), (r = 0), (a = 1), (l = 0), (o = !0));
      }
    }
    for (const c of this.boxes) {
      const [h, d] = c.toLocal(t.x, t.z),
        u = e.x * c.c + e.z * c.s,
        m = -e.x * c.s + e.z * c.c;
      let g = 0,
        v = s,
        p = -1,
        f = !0;
      const w = [
        [h, u, c.hx],
        [t.y - (c.y0 + c.y1) / 2, e.y, (c.y1 - c.y0) / 2],
        [d, m, c.hz],
      ];
      for (let M = 0; M < 3 && f; M++) {
        const [_, L, R] = w[M];
        if (Math.abs(L) < 1e-8) {
          Math.abs(_) > R && (f = !1);
          continue;
        }
        let A = (-R - _) / L,
          C = (R - _) / L;
        if (A > C) {
          const S = A;
          ((A = C), (C = S));
        }
        (A > g && ((g = A), (p = M)), C < v && (v = C), g > v && (f = !1));
      }
      if (!(!f || p < 0 || g <= 0 || g >= s))
        if (((s = g), (o = !0), p === 1))
          ((r = 0), (a = e.y > 0 ? -1 : 1), (l = 0));
        else {
          const M = p === 0 ? -Math.sign(u) : -Math.sign(m),
            [_, L] = p === 0 ? c.toWorldDir(M, 0) : c.toWorldDir(0, M);
          ((r = _), (a = 0), (l = L));
        }
    }
    {
      const c = e.x * e.x + e.z * e.z;
      if (c > 1e-8) {
        const h = 2 * (t.x * e.x + t.z * e.z),
          d = t.x * t.x + t.z * t.z - ARENA_RADIUS * ARENA_RADIUS,
          u = h * h - 4 * c * d;
        if (u > 0) {
          const m = (-h + Math.sqrt(u)) / (2 * c);
          if (m > 0 && m < s) {
            const g = t.y + e.y * m;
            if (g > 0 && g < WALL_HEIGHT + 1) {
              ((s = m), (o = !0));
              const v = t.x + e.x * m,
                p = t.z + e.z * m,
                f = Math.hypot(v, p);
              ((r = -v / f), (a = 0), (l = -p / f));
            }
          }
        }
      }
    }
    return o
      ? {
          dist: s,
          point: new Vector3(t.x + e.x * s, t.y + e.y * s, t.z + e.z * s),
          normal: new Vector3(r, a, l),
        }
      : null;
  }
  update(t, e) {
    ((this.timeUniform.value = t),
      this.holo &&
        ((this.holo.rotation.y += e * 0.4),
        (this.holo.children[0].rotation.z += e * 0.7),
        (this.holo.children[1].rotation.x += e * 0.5),
        (this.holo.children[2].rotation.y -= e * 0.9),
        (this.holo.position.y = 4.8 + Math.sin(t * 0.8) * 0.2)));
    for (const n of this.gates)
      ((n.activity = Math.max(0, n.activity - e * 1.2)),
        (n.mat.uniforms.uActivity.value = n.activity),
        (n.light.intensity =
          40 + n.activity * 120 + Math.sin(t * 7 + n.angle) * 6));
  }
}
