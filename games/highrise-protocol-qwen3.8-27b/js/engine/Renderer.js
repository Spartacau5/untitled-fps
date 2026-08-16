import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { Pass } from 'three/addons/postprocessing/Pass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CFG } from '../core/Config.js';

// The viewmodel gets its OWN camera:
//  - near ≈ 0.01: at real ADS eye relief (~10 cm) the receiver/grip sit
//    centimeters from the eye — the world near plane (0.05) would slice
//    them, so the viewmodel gets its own tight near plane;
//  - a FIXED fov, independent of the world zoom: the world zooms 75→55 in
//    ADS while the gun's on-screen size stays constant (like a real sight
//    picture — the sight has its own magnification, the gun doesn't grow).
// World and viewmodel are drawn in ONE buffer pass (this class): the world
// renders first with the world camera (layer 0), then a depth clear, then
// the viewmodel with the vmCamera (layer 1 only) — the viewmodel is always
// the closest thing to the eye, so drawing it on top is correct. Downstream
// passes (bloom/grade/output) see world+viewmodel together: the red dot
// glows through the same bloom/grade stack as the world.
class WorldViewmodelPass extends Pass {
  constructor(scene, worldCamera, vmCamera) {
    super();
    // in-place pass, like RenderPass: writes to readBuffer, no swap
    // (r160 convention: the accumulated image always lives in readBuffer)
    this.needsSwap = false;
    this.scene = scene;
    this.worldCamera = worldCamera;
    this.vmCamera = vmCamera;
  }
  render(renderer, writeBuffer, readBuffer) {
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
    renderer.setClearColor(0x000000, 0); // RenderPass defaults
    renderer.clear(true, true, true);
    // (1) the world — world camera, layer 0 (never sees the viewmodel)
    renderer.render(this.scene, this.worldCamera);
    if (!this.renderToScreen) {
      // (2) the viewmodel — own camera (near 0.01, fixed fov, layer 1),
      // drawn on top with a cleared depth
      renderer.clearDepth();
      renderer.render(this.scene, this.vmCamera);
    }
    renderer.autoClear = oldAutoClear;
  }
}

// G1/G3: cinematic grade pass — vignette + chromatic aberration + film grain +
// subtle color grading (lift/shadows). All uniforms driven per-frame so damage
// and impact can punch the frame.
const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uVignette: { value: 0.55 },
    uCA: { value: 0.0016 },          // chromatic aberration amount
    uGrain: { value: 0.035 },
    uDamage: { value: 0 },           // 0..1 hit flash
    uOverdrive: { value: 0 },        // 0..1 edge glow tint
    uMotion: { value: 0 },           // camera smear on fast turns
    uHeat: { value: 0 },             // 0..1 barrel heat shimmer (F4)
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uVignette;
    uniform float uCA;
    uniform float uGrain;
    uniform float uDamage;
    uniform float uOverdrive;
    uniform float uMotion;
    uniform float uHeat;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vec2 uv = vUv;
      vec2 center = uv - 0.5;
      float dist = length(center);

      // F4: heat shimmer — subtle vertical wobble near the barrel (bottom center)
      if (uHeat > 0.01) {
        vec2 barrel = uv - vec2(0.5, 0.30);
        float barrelDist = length(barrel / vec2(0.28, 0.22));
        float heatMask = (1.0 - clamp(barrelDist, 0.0, 1.0)) * uHeat;
        uv.x += sin(uv.y * 60.0 + uTime * 22.0) * 0.0016 * heatMask;
        uv.y += cos(uv.x * 50.0 + uTime * 18.0) * 0.0010 * heatMask;
      }

      // Chromatic aberration — scales outward from center, boosted by motion + damage
      float ca = uCA * (0.6 + uMotion * 2.2 + uDamage * 1.6);
      vec2 dir = center * dist;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + dir * ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - dir * ca).b;

      // Filmic-ish grade: gentle S-curve, warm shadows, teal highlights
      col = pow(col, vec3(0.98, 0.99, 1.02));
      col *= 1.02 - 0.02 * dist;                       // vignette
      col = mix(col, col * vec3(1.06, 1.00, 0.92), 0.5 - 0.5 * dist); // warm center
      float vig = smoothstep(0.85, 0.35, dist);
      col *= mix(1.0 - uVignette * 0.5, 1.0, vig);

      // Film grain (low)
      float g = hash(uv * uResolution * 0.5 + uTime) - 0.5;
      col += g * uGrain;

      // Damage hit flash (red edges)
      float dmgMask = smoothstep(0.15, 0.75, dist) * uDamage;
      col += vec3(0.55, 0.02, 0.02) * dmgMask;

      // OVERDRIVE edge glow (warm)
      float odMask = smoothstep(0.4, 0.95, dist) * uOverdrive;
      col += vec3(0.5, 0.22, 0.02) * odMask;

      // motion smear tint
      col = mix(col, col * 1.03, uMotion * 0.4);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export class Renderer {
  constructor(host) {
    this.host = host;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, CFG.perf.pixelRatioCap)); // P2
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;   // G1 filmic
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.domElement = this.renderer.domElement;
    host.appendChild(this.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x3a2418, 0.010);   // G1 warm sunset depth haze

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 400);
    this.scene.add(this.camera);

    // viewmodel camera: synced to the world camera every frame (position,
    // shake, recoil, look) with its own near plane and fixed fov. Layer 1
    // only — it never sees the world, and the world camera never sees the
    // gun. The ADS solve keeps the sight anchor on THIS camera's axis, so
    // the reticle is centered in its projection by construction.
    this.vmFov = 90;
    this.vmCamera = new THREE.PerspectiveCamera(this.vmFov, window.innerWidth / window.innerHeight, 0.01, 50);
    this.vmCamera.layers.set(1); // layer 1 ONLY (bit mask 2)
    this.scene.add(this.vmCamera);

    this.buildComposer();
    this._resize = this.resize.bind(this);
    window.addEventListener('resize', this._resize);
    this.low = CFG.quality.low;
    this.applyQuality();
    this.drawCalls = 0;
    // accumulate draw calls across all composer passes (P4)
    this.renderer.info.autoReset = false;
  }

  buildComposer() {
    this.composer = new EffectComposer(this.renderer);
    // world + viewmodel in one pass (the viewmodel with its own camera),
    // before bloom so the red dot's glow still blooms
    this.composer.addPass(new WorldViewmodelPass(this.scene, this.camera, this.vmCamera));

    // G1/G5: bloom on all emissives
    this.bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.75,   // strength
      0.6,    // radius
      0.72    // threshold
    );
    this.composer.addPass(this.bloom);

    // G1/G3: grade + vignette + CA + grain
    this.grade = new ShaderPass(GradeShader);
    this.composer.addPass(this.grade);

    // Correct sRGB output
    this.composer.addPass(new OutputPass());
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setPixelRatio(Math.min(window.devicePixelRatio, CFG.perf.pixelRatioCap));
  }

  // G3: quality presets switch off cleanly if frame budget threatened.
  applyQuality() {
    if (this.low) {
      this.bloom.enabled = false;
      this.grade.uniforms.uGrain.value = 0.0;
      this.grade.uniforms.uCA.value = 0.0008;
      this.renderer.setPixelRatio(1);
      this.composer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
      this.scene.fog = new THREE.FogExp2(0x3a2418, 0.013);
    } else {
      this.bloom.enabled = true;
      this.grade.uniforms.uGrain.value = 0.035;
      this.grade.uniforms.uCA.value = 0.0016;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, CFG.perf.pixelRatioCap));
      this.composer.setPixelRatio(Math.min(window.devicePixelRatio, CFG.perf.pixelRatioCap));
      this.renderer.shadowMap.enabled = true;
    }
  }

  setLowQuality(on) {
    this.low = on;
    CFG.quality.low = on;
    this.applyQuality();
  }

  // Drive grade uniforms per frame (called by main loop).
  gradeFrame({ time, damage = 0, overdrive = 0, motion = 0, heat = 0 } = {}) {
    const u = this.grade.uniforms;
    u.uTime.value = time;
    u.uDamage.value = damage;
    u.uOverdrive.value = overdrive;
    u.uMotion.value = motion;
    u.uHeat.value = heat;
    u.uResolution.value.set(window.innerWidth, window.innerHeight);
  }

  // Punch chromatic aberration briefly on impact (F6).
  punchCA(amount = 0.012, decay = 0.12) {
    this._caPunch = (this._caPunch || 0) + amount;
    this._caDecay = decay;
  }

  update(dt) {
    if (this._caPunch > 0.0001) {
      this._caPunch *= Math.exp(-dt * (1 / (this._caDecay || 0.12)));
      this.grade.uniforms.uCA.value = 0.0016 + this._caPunch;
    } else {
      this.grade.uniforms.uCA.value = 0.0016;
    }
  }

  render() {
    // The viewmodel is a child of the world camera, so it inherits its
    // transform; the viewmodel CAMERA only needs to share that transform
    // (position + orientation) to project the gun with its own near/fov.
    // Copying world matrices makes the solve's axis alignment exact.
    this.vmCamera.position.copy(this.camera.position);
    this.vmCamera.quaternion.copy(this.camera.quaternion);
    this.vmCamera.updateMatrixWorld();
    this.renderer.info.reset();
    this.composer.render();
    this.drawCalls = this.renderer.info.render.calls;
  }

  resize() {
    const w = window.innerWidth, h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.vmCamera.aspect = w / h;
    this.vmCamera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  }

  // Project a world point to screen space (for self-test A4).
  worldToScreen(point, out = new THREE.Vector2()) {
    const v = point.clone().project(this.camera);
    out.set(
      (v.x * 0.5 + 0.5) * window.innerWidth,
      (-v.y * 0.5 + 0.5) * window.innerHeight
    );
    return out;
  }

  dispose() {
    window.removeEventListener('resize', this._resize);
    this.renderer.dispose();
    this.composer.dispose?.();
  }
}
