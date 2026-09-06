import {
  AddEquation,
  BufferGeometry,
  CustomBlending,
  Float32BufferAttribute,
  HalfFloatType,
  LinearFilter,
  Mesh,
  OneFactor,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderTarget,
} from "three";
import { theme } from "../theme/theme.js";

export const BLOOM_DOWN_FRAG = `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uThreshold; uniform float uKnee; uniform float uPrefilter;
varying vec2 vUv;
vec3 pf(vec3 c){
  float br = max(c.r, max(c.g, c.b));
  float soft = clamp(br - uThreshold + uKnee, 0.0, 2.0 * uKnee);
  soft = soft * soft / (4.0 * uKnee + 1e-4);
  float contrib = max(soft, br - uThreshold) / max(br, 1e-4);
  return c * contrib;
}
vec3 S(vec2 o){ vec3 c = texture2D(tSrc, vUv + o * uTexel).rgb; return uPrefilter > 0.5 ? pf(min(c, vec3(60.0))) : c; }
void main(){
  vec3 a = S(vec2(-2.0,-2.0)), b = S(vec2(0.0,-2.0)), c = S(vec2(2.0,-2.0));
  vec3 d = S(vec2(-2.0, 0.0)), e = S(vec2(0.0, 0.0)), f = S(vec2(2.0, 0.0));
  vec3 g = S(vec2(-2.0, 2.0)), h = S(vec2(0.0, 2.0)), i = S(vec2(2.0, 2.0));
  vec3 j = S(vec2(-1.0,-1.0)), k = S(vec2(1.0,-1.0)), l = S(vec2(-1.0, 1.0)), m = S(vec2(1.0, 1.0));
  vec3 col = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  gl_FragColor = vec4(col, 1.0);
}`;
export const BLOOM_UP_FRAG = `
uniform sampler2D tSrc; uniform vec2 uTexel; uniform float uScale;
varying vec2 vUv;
void main(){
  vec2 t = uTexel * uScale;
  vec3 s = texture2D(tSrc, vUv + vec2(-t.x, -t.y)).rgb + texture2D(tSrc, vUv + vec2(0.0, -t.y)).rgb * 2.0 + texture2D(tSrc, vUv + vec2(t.x, -t.y)).rgb
         + texture2D(tSrc, vUv + vec2(-t.x, 0.0)).rgb * 2.0 + texture2D(tSrc, vUv).rgb * 4.0 + texture2D(tSrc, vUv + vec2(t.x, 0.0)).rgb * 2.0
         + texture2D(tSrc, vUv + vec2(-t.x, t.y)).rgb + texture2D(tSrc, vUv + vec2(0.0, t.y)).rgb * 2.0 + texture2D(tSrc, vUv + vec2(t.x, t.y)).rgb;
  gl_FragColor = vec4(s / 16.0, 1.0);
}`;
export const COMPOSITE_FRAG = `
uniform sampler2D tScene; uniform sampler2D tBloom; uniform vec2 uRes; uniform float uTime;
uniform float uBloom; uniform float uExposure; uniform float uCA; uniform float uVignette; uniform float uGrain;
uniform float uDamage; uniform float uFlash; uniform float uSat; uniform float uContrast; uniform float uRadial; uniform float uDesat;
uniform vec3 uShadowTint;
varying vec2 vUv;
vec3 aces(vec3 x){ const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14; return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0); }
vec3 srgb(vec3 c){ return mix(12.92 * c, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c)); }
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec3 fetch(vec2 uv, vec2 caDir){ return vec3(texture2D(tScene, uv + caDir).r, texture2D(tScene, uv).g, texture2D(tScene, uv - caDir).b); }
void main(){
  vec2 uv = vUv; vec2 c = uv - 0.5; float r2 = dot(c, c);
  float ca = uCA * (0.35 + 2.5 * r2);
  vec2 caDir = c * ca;
  vec3 col;
  if (uRadial > 0.001) {
    float w = uRadial * smoothstep(0.01, 0.3, r2);
    col = vec3(0.0);
    for (int i = 0; i < 7; i++) { float s = 1.0 - w * float(i) / 7.0; col += fetch(0.5 + c * s, caDir); }
    col /= 7.0;
  } else {
    col = fetch(uv, caDir);
  }
  vec3 bloom = texture2D(tBloom, uv).rgb;
  col += bloom * uBloom;
  col *= uExposure;
  float edge = smoothstep(0.05, 0.55, r2 * 2.0);
  float lum = dot(col, vec3(0.3, 0.59, 0.11));
  vec3 dmg = vec3(lum) * vec3(1.3, 0.2, 0.15) + vec3(0.22, 0.0, 0.0) * (0.75 + 0.25 * sin(uTime * 9.0));
  col = mix(col, dmg, clamp(uDamage * edge, 0.0, 1.0));
  col = aces(col);
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uSat * (1.0 - uDesat));
  col = (col - 0.5) * uContrast + 0.5;
  col = mix(col, col * uShadowTint, (1.0 - l) * 0.35);
  col *= 1.0 - uVignette * smoothstep(0.12, 0.95, r2 * 2.6);
  col += (hash(uv * uRes + fract(uTime) * 100.0) - 0.5) * uGrain;
  col += uFlash;
  gl_FragColor = vec4(srgb(clamp(col, 0.0, 1.0)), 1.0);
}`;
export const FULLSCREEN_VERT =
  "varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }";
export class PostFX {
  constructor(t) {
    this.renderer = t;
    const e = t.getDrawingBufferSize(new Vector2());
    ((this.w = Math.max(2, e.x)),
      (this.h = Math.max(2, e.y)),
      (this.samples = 4),
      (this.sceneRT = new WebGLRenderTarget(this.w, this.h, {
        type: HalfFloatType,
        samples: 4,
        depthBuffer: !0,
        stencilBuffer: !1,
        minFilter: LinearFilter,
        magFilter: LinearFilter,
      })),
      (this.mipCount = 6),
      (this.mips = []));
    for (let s = 0; s < this.mipCount; s++)
      this.mips.push(
        new WebGLRenderTarget(
          Math.max(1, this.w >> (s + 1)),
          Math.max(1, this.h >> (s + 1)),
          {
            type: HalfFloatType,
            depthBuffer: !1,
            minFilter: LinearFilter,
            magFilter: LinearFilter,
          },
        ),
      );
    const n = new BufferGeometry();
    (n.setAttribute(
      "position",
      new Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3),
    ),
      (this.quad = new Mesh(n, null)),
      (this.quad.frustumCulled = !1),
      (this.quadScene = new Scene()),
      this.quadScene.add(this.quad),
      (this.quadCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1)),
      (this.downMat = new ShaderMaterial({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new Vector2() },
          uThreshold: { value: theme.grade.bloomThreshold },
          uKnee: { value: theme.grade.bloomKnee },
          uPrefilter: { value: 0 },
        },
        vertexShader: FULLSCREEN_VERT,
        fragmentShader: BLOOM_DOWN_FRAG,
        depthTest: !1,
        depthWrite: !1,
      })),
      (this.upMat = new ShaderMaterial({
        uniforms: {
          tSrc: { value: null },
          uTexel: { value: new Vector2() },
          uScale: { value: 1 },
        },
        vertexShader: FULLSCREEN_VERT,
        fragmentShader: BLOOM_UP_FRAG,
        depthTest: !1,
        depthWrite: !1,
        blending: CustomBlending,
        blendSrc: OneFactor,
        blendDst: OneFactor,
        blendEquation: AddEquation,
      })),
      (this.u = {
        tScene: { value: null },
        tBloom: { value: null },
        uRes: { value: new Vector2(this.w, this.h) },
        uTime: { value: 0 },
        uBloom: { value: theme.grade.bloom },
        uExposure: { value: theme.grade.exposure },
        uCA: { value: theme.grade.chromatic },
        uVignette: { value: theme.grade.vignette },
        uGrain: { value: theme.grade.grain },
        uDamage: { value: 0 },
        uFlash: { value: 0 },
        uSat: { value: theme.grade.saturation },
        uContrast: { value: theme.grade.contrast },
        uShadowTint: { value: new Vector3(...theme.grade.shadowTint) },
        uRadial: { value: 0 },
        uDesat: { value: 0 },
      }),
      (this.compMat = new ShaderMaterial({
        uniforms: this.u,
        vertexShader: FULLSCREEN_VERT,
        fragmentShader: COMPOSITE_FRAG,
        depthTest: !1,
        depthWrite: !1,
      })));
  }
  // MSAA sample count cannot be changed on a live target, so lowering it means
  // rebuilding. A 4x half-float target at 2160x1218 is the single largest
  // block of GPU memory the game allocates; dropping to 2x roughly halves it.
  setSamples(samples) {
    if (samples === this.samples) return;
    this.samples = samples;
    this.sceneRT.dispose();
    this.sceneRT = new WebGLRenderTarget(this.w, this.h, {
      type: HalfFloatType,
      samples,
      depthBuffer: !0,
      stencilBuffer: !1,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
    });
  }
  setSize(t, e) {
    ((this.w = Math.max(2, t)),
      (this.h = Math.max(2, e)),
      this.sceneRT.setSize(this.w, this.h));
    for (let n = 0; n < this.mipCount; n++)
      this.mips[n].setSize(
        Math.max(1, this.w >> (n + 1)),
        Math.max(1, this.h >> (n + 1)),
      );
    this.u.uRes.value.set(this.w, this.h);
  }
  _pass(t, e) {
    ((this.quad.material = t),
      this.renderer.setRenderTarget(e),
      this.renderer.render(this.quadScene, this.quadCam));
  }
  render(t, e, n, s, r) {
    const a = this.renderer;
    ((this.u.uTime.value = r),
      a.setRenderTarget(this.sceneRT),
      a.clear(!0, !0, !1),
      a.render(t, e),
      n && (a.clearDepth(), a.render(n, s)));
    let l = this.sceneRT,
      o = this.w,
      c = this.h;
    for (let h = 0; h < this.mipCount; h++)
      ((this.downMat.uniforms.tSrc.value = l.texture),
        this.downMat.uniforms.uTexel.value.set(1 / o, 1 / c),
        (this.downMat.uniforms.uPrefilter.value = h === 0 ? 1 : 0),
        this._pass(this.downMat, this.mips[h]),
        (l = this.mips[h]),
        (o = l.width),
        (c = l.height));
    for (let h = this.mipCount - 2; h >= 0; h--) {
      const d = this.mips[h + 1];
      ((this.upMat.uniforms.tSrc.value = d.texture),
        this.upMat.uniforms.uTexel.value.set(1 / d.width, 1 / d.height),
        this._pass(this.upMat, this.mips[h]));
    }
    ((this.u.tScene.value = this.sceneRT.texture),
      (this.u.tBloom.value = this.mips[0].texture),
      this._pass(this.compMat, null));
  }
}
