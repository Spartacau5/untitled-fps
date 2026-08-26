// src/post/post.js — Post agent (G1 filmic base, G3 stack, G4 shafts+motes, G5 OD).
//
// high: EffectComposer (explicit HalfFloatType RT) ->
//   RenderPass(scene,camera) -> UnrealBloomPass(res, 0.55, 0.55, 0.82) ->
//   ONE custom grade ShaderPass (chromatic aberration + 3-tap radial smear +
//   warm-sunset grade: cool teal shadows / warm amber highlights / S-curve +
//   radial vignette + damage red edge + film grain 0.035 + OVERDRIVE edge tint)
//   -> OutputPass (applies renderer ACESFilmic tone mapping once + sRGB).
//   The viewmodel is drawn after the composer as a plain depth-cleared
//   second pass (A5b) into the default framebuffer.
// low (quality.flags.bloom/grade path off): plain renderer.render(scene,camera)
//   + viewmodel pass — zero post cost (G3), composer RTs disposed cleanly on
//   'quality:change' (P2/K6).
//
// Zero per-frame allocations (hoisted scratch), all drivers are springs or
// eased decays (C5), all randomness from the seeded rng (C2).
import {
  Group, Mesh, Vector2, Vector3, Quaternion, Color,
  BufferAttribute, InstancedBufferGeometry, InstancedBufferAttribute,
  CylinderGeometry, ShaderMaterial, CanvasTexture, WebGLRenderTarget,
  DoubleSide, AdditiveBlending, ACESFilmicToneMapping, HalfFloatType, DynamicDrawUsage,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { time } from '../core/time.js';
import { quality } from '../core/quality.js';
import { rng } from '../core/rng.js';
import { Spring } from '../core/spring.js';
import { clamp01 } from '../core/easings.js';

// ---------------------------------------------------------------- grade shader
// Operates on LINEAR HDR (tone mapping + sRGB happen later in OutputPass; a
// custom ShaderMaterial rendering into an RT gets neither chunk injected).
const GradeShader = {
  name: 'HighriseGrade',
  uniforms: {
    tDiffuse: { value: null },
    uTime:  { value: 0 },      // real seconds — grain scroll (K4: not sim time)
    uCA:    { value: 0 },      // chromatic aberration strength (damage/impact/firing)
    uSmear: { value: 0 },      // camera-driven radial smear (yaw rate) 0..1
    uOD:    { value: 0 },      // OVERDRIVE tint 0..1 (G5)
    uDmg:   { value: 0 },      // red damage edge vignette 0..1 (D6)
    uVig:   { value: 0.30 },   // vignette strength (0 when flags.vignette off)
    uGrain: { value: 0.035 },  // film grain, dialed low (0 when flags.grain off)
    uRes:   { value: new Vector2(1920, 1080) }, // drawing-buffer px
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: /* glsl */`
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uCA;
    uniform float uSmear;
    uniform float uOD;
    uniform float uDmg;
    uniform float uVig;
    uniform float uGrain;
    uniform vec2 uRes;

    float hash12(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main() {
      vec2 uv = vUv;
      vec2 d = uv - 0.5;
      float r2 = dot(d, d);                        // 0 center .. ~0.5 corners
      float aspect = uRes.x / max(uRes.y, 1.0);
      vec2 sc = vec2(max(aspect, 1.0), 1.0);       // circularizes the radial field
      vec2 rd = d / sc;
      vec2 dir = rd / max(length(rd), 1e-4);

      // radial smear (G3): cheap 3-tap toward edges, scaled by radius^2 * uSmear
      float sm = uSmear * r2 * 0.14;
      vec3 col;
      if (sm > 0.0008) {
        vec3 base = texture2D(tDiffuse, uv).rgb;
        vec3 t1 = texture2D(tDiffuse, uv + dir * sm).rgb;
        vec3 t2 = texture2D(tDiffuse, uv - dir * sm * 0.5).rgb;
        col = mix(base, (base + t1 + t2) * 0.3333, clamp(uSmear * (0.2 + r2 * 1.5), 0.0, 0.8));
      } else {
        col = texture2D(tDiffuse, uv).rgb;
      }

      // chromatic aberration: per-channel radial offsets, edge-weighted
      float ca = uCA * (0.0009 + 0.0085 * r2);
      if (abs(ca) > 0.0002) {
        col.r = texture2D(tDiffuse, uv + dir * ca).r;
        col.b = texture2D(tDiffuse, uv - dir * ca).b;
      }

      // --- warm-sunset color grade: teal shadows, amber highlights, S-curve.
      vec3 lo = pow(max(col, 0.0), vec3(1.0 / 1.06));              // shadow lift
      float l = dot(lo, vec3(0.299, 0.587, 0.114));
      vec3 hi = col / (col + vec3(0.62)) * 1.62;                   // soft shoulder
      col = mix(lo, hi, smoothstep(0.16, 0.74, l));                // S-curve blend
      col *= vec3(1.042, 1.004, 0.962);                            // amber push
      col = mix(col, col * vec3(0.916, 1.014, 1.074),
                (1.0 - smoothstep(0.02, 0.30, l)) * 0.85);         // teal in shadows
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      col = mix(vec3(lum), col, 1.06);                             // slight saturation

      // radial vignette — cool dark corner falloff
      col = mix(col, col * vec3(0.86, 0.92, 1.02) + vec3(0.012, 0.018, 0.03),
                pow(smoothstep(0.09, 0.56, r2), 1.5) * uVig * 2.2);

      // OVERDRIVE (G5): warm-orange screen-edge glow + extra saturation lift
      float od = clamp(uOD, 0.0, 1.0);
      if (od > 0.002) {
        float edge = pow(smoothstep(0.05, 0.55, r2), 1.4);
        col += vec3(0.85, 0.30, 0.05) * edge * od * 0.35;
        float lum2 = dot(col, vec3(0.2126, 0.7152, 0.0722));
        col = mix(vec3(lum2), col, 1.0 + 0.12 * od);
      }

      // damage: red screen-edge vignette (D6)
      float dm = clamp(uDmg, 0.0, 1.0);
      if (dm > 0.002) {
        float edge = pow(smoothstep(0.04, 0.52, r2), 1.6);
        col = mix(col, col * vec3(1.35, 0.5, 0.42) + vec3(0.16, 0.0, 0.0), edge * dm);
      }

      // film grain (low) + dither against dusk banding
      float g = hash12(floor(gl_FragCoord.xy) + fract(uTime * 0.617) * 431.7) - 0.5;
      col += g * uGrain * (0.65 + 0.35 * (1.0 - clamp(lum, 0.0, 1.0)));
      col += (hash12(gl_FragCoord.xy * 1.7) - 0.5) * (1.0 / 255.0);

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`,
};

// --------------------------------------------------- G4 shaft + mote materials
const SHAFT_H = 15;             // shaft length (local +Y, sun-side tip)
const SHAFT_BASE_R = 3.4;       // floor end: beam fan widening downward (aperture at gap)
const SHAFT_TOP_R = 1.5;        // sun-side tip: narrow, where the light enters
const SHAFT_FAR2 = 58 * 58;     // fade-out distance^2 from camera (horizontal)
const MOTE_COUNTS = [90, 90, 80]; // ~260 instanced dust motes total
const MOTE_TOTAL = MOTE_COUNTS[0] + MOTE_COUNTS[1] + MOTE_COUNTS[2];

function makeShaftUniforms() {
  return {
    uTime:  { value: 0 },
    uInt:   { value: 0 },   // eased sun elevation x camera-vs-sun dot
    uSlant: { value: new Vector2(0.3, 0.15) }, // horizontal sun direction (world xz)
    uColor: { value: new Color(1.0, 0.64, 0.28) },
  };
}

function makeShaftMaterial(uni) {
  return new ShaderMaterial({
    name: 'SunShaft',
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide, // both cone walls add -> fake volumetric scattering core
    uniforms: uni,
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      uniform float uTime;
      uniform float uInt;
      uniform vec2 uSlant;
      uniform vec3 uColor;
      void main() {
        float h = vUv.y;                                   // 0 one tip, 1 other tip
        // soft silhouette edge; both-sided cone walls already boost the center
        float rim = 0.5 + 0.5 * cos(vUv.x * 6.2831853);
        float radial = mix(rim, pow(rim, 2.4), 0.55);
        // dissolve into haze at both tips
        float tips = smoothstep(0.0, 0.34, h) * (1.0 - smoothstep(0.48, 1.0, h));
        // time-varying noise-free gradient scroll along the beam
        float scroll = 0.7 + 0.3 * sin(h * 9.0 - uTime * 0.85 + sin(h * 3.1 + uSlant.x * 3.0) * 1.4);
        float shimmer = 0.92 + 0.08 * sin(uTime * 0.5 + h * 5.0 + uSlant.y * 2.0);
        float alpha = radial * tips * scroll * shimmer * uInt * 0.30;
        // NaN guard: vertices behind the near plane (camera inside the cone)
        // interpolate to NaN vUv; one NaN pixel poisons the whole bloom mip
        // chain (black half-frame). Discard anything non-finite.
        if (!(alpha > 0.0)) discard;
        gl_FragColor = vec4(uColor * (1.0 + 0.4 * h), min(alpha, 1.0));
      }`,
  });
}

function makeMoteMaterial(uni) {
  return new ShaderMaterial({
    name: 'DustMotes',
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    uniforms: uni, // shares uTime/uInt object refs with the parent shaft
    vertexShader: /* glsl */`
      attribute vec3 aOffset;   // live local position inside the beam (CPU-updated)
      attribute vec3 aTint;
      attribute vec2 aData;     // x: base size, y: twinkle phase
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vTint;
      varying float vTw;
      void main() {
        vUv = uv;
        vTint = aTint;
        vTw = 0.5 + 0.5 * sin(uTime * 1.6 + aData.y * 6.2831853);
        float s = aData.x * (0.75 + 0.5 * vTw);
        // billboard the unit quad around the instance offset
        vec4 mv = modelViewMatrix * vec4(aOffset, 1.0);
        mv.xy += position.xy * s;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      varying vec3 vTint;
      varying float vTw;
      uniform sampler2D uMap;
      uniform float uInt;
      void main() {
        float m = texture2D(uMap, vUv).a;
        float a = m * uInt * 0.7;
        if (!(a > 0.0)) discard;   // NaN guard (see SunShaft)
        gl_FragColor = vec4(vTint * (0.55 + 0.45 * vTw), min(a, 1.0));
      }`,
  });
}

// Soft round sprite, generated once (no external assets).
function makeMoteTexture() {
  const c = document.createElement('canvas');
  c.width = 32; c.height = 32;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,243,222,0.55)');
  grad.addColorStop(1, 'rgba(255,238,212,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 32);
  return new CanvasTexture(c);
}
// ---------------------------------------------------------------- tuning
const YAW_FULL = 3.4;      // rad/s saturating the smear
const YAW_START = 0.85;    // dead zone below which no smear
const FIRE_CA_DECAY = 7;   // 1/s eased decay of the firing CA bloom
const CA_DECAY = 8;        // 1/s eased retreat of impact/damage CA pops
const DMG_DECAY = 4.5;     // 1/s eased retreat of the red damage edge
const CA_MAX = 1.2;

// ---------------------------------------------------------------- module
export function init(ctx) {
  const { renderer, scene, camera, vmScene, vmCamera, sun } = ctx;

  // G1 filmic base — applied ONCE: by OutputPass on the high path (renderer
  // skips tone mapping for RT targets, OutputPass reads renderer.toneMapping),
  // by the renderer directly on the low path and the viewmodel pass.
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  // ---- drivers (C5: eased envelopes + springs, no linear lerps) ----
  // CA / damage edge: instant pop on the event frame, exponential ease-out
  // retreat on REAL time (hit-stop-safe, K4) — zero-attack punch is the point.
  let caPop = 0;                                // event-driven CA pops (hit/damage/blast)
  let fireCA = 0;                               // firing CA bloom, faster retreat
  let dmgHold = 0;                              // red damage edge envelope
  // Smooth springs where the source itself is noisy or binary:
  const smearSpring = new Spring(0, 160, 1.0);  // radial smear from yaw rate
  const odSpring = new Spring(0, 42, 0.66);     // OVERDRIVE tint, snappy overshoot in
  const sunElevSpring = new Spring(0.2, 5, 1.0);// eased sun dip (G4)

  const offs = [];
  offs.push(bus.on('hit:marker', (e) => {
    // small visible pop per landed hit, headshot punchier (G3 "impact")
    caPop = Math.min(CA_MAX, caPop + ((e && e.headshot) ? 0.30 : 0.17));
  }));
  offs.push(bus.on('player:damage', () => {
    caPop = CA_MAX;                              // big CA kick
    dmgHold = 1;
  }));
  offs.push(bus.on('explosion', () => {
    caPop = Math.min(CA_MAX, caPop + 0.8);       // big CA kick
    if (dmgHold < 0.5) dmgHold = 0.5;
  }));
  offs.push(bus.on('shot:fire', () => { fireCA = Math.min(1, fireCA + 0.4); }));
  offs.push(bus.on('overdrive:start', () => odSpring.set(1)));
  offs.push(bus.on('overdrive:end', () => odSpring.set(0)));

  // ---- scratch (hoisted — zero per-frame allocations) ----
  const _fwd = new Vector3();
  const _sunDir = new Vector3();
  const _beamUp = new Vector3();
  const _upY = new Vector3(0, 1, 0);
  const _q = new Quaternion();
  const _size = new Vector2();
  let lastYaw = null;
  let grainT = 0;

  // ---------------------------------------------------------------- composer
  let composer = null;
  let renderPass = null;
  let bloomPass = null;
  let gradePass = null;
  let outputPass = null;

  function buildComposer() {
    if (composer) return;
    renderer.getDrawingBufferSize(_size);
    const rt = new WebGLRenderTarget(
      Math.max(1, _size.x), Math.max(1, _size.y), { type: HalfFloatType },
    );
    composer = new EffectComposer(renderer, rt);
    renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    // NOTE: grade runs BEFORE bloom — UnrealBloomPass output carries very
    // large HDR values near the sun, and the grade S-curve on top of those
    // produced a black left half on ANGLE (verified in Chromium). Grading
    // the linear render first, then blooming, keeps the same look.
    gradePass = new ShaderPass(GradeShader);
    composer.addPass(gradePass);
    bloomPass = new UnrealBloomPass(new Vector2(_size.x, _size.y), 0.62, 0.55, 0.75);
    composer.addPass(bloomPass);
    outputPass = new OutputPass(); // MUST stay last: ACES + sRGB to screen
    composer.addPass(outputPass);
    applyFlagUniforms();
    syncSize();
  }

  function disposeComposer() { // P2/K6: release RTs + materials, no leaks
    if (!composer) return;
    composer.dispose();
    if (bloomPass) bloomPass.dispose();
    if (gradePass) gradePass.dispose();
    if (outputPass) outputPass.dispose();
    // RenderPass holds no GPU resources (Pass.dispose is a no-op)
    composer = null; renderPass = null; bloomPass = null; gradePass = null; outputPass = null;
  }

  function applyFlagUniforms() {
    if (!gradePass) return;
    const u = gradePass.uniforms;
    u.uVig.value = quality.flags.vignette ? 0.30 : 0;
    u.uGrain.value = quality.flags.grain ? 0.035 : 0;
    if (!quality.flags.ca) u.uCA.value = 0;
    if (!quality.flags.smear) u.uSmear.value = 0;
  }

  function syncSize() {
    // composer.setSize takes CSS size and multiplies by its own pixel ratio;
    // uRes wants device pixels (matches gl_FragCoord for the grain hash).
    renderer.getSize(_size);
    if (composer) composer.setSize(_size.x, _size.y);
    if (gradePass) {
      const pr = renderer.getPixelRatio();
      gradePass.uniforms.uRes.value.set(_size.x * pr, _size.y * pr);
    }
  }

  // ---------------------------------------------------------------- G4 shafts
  // Anchor positions: ctx.world.sunShaftAnchors (Vector3-like x/z) when the
  // world provides them; else a seeded row ACROSS the sun azimuth (i.e. along
  // the horizontal -sunDir axis, which is where beams through pillar gaps land
  // at sunset), jittered deterministically (C2).
  const anchors = (ctx.world && ctx.world.sunShaftAnchors) || null;
  const floorY = (ctx.world && ctx.world.bounds && Number.isFinite(ctx.world.bounds.floorY))
    ? ctx.world.bounds.floorY : 0;
  const root = new Group();
  root.name = 'post-sunshafts';
  scene.add(root);

  // Horizontal azimuth of the sun at init (updated tilt is per-frame below).
  let rowX = -1; let rowZ = -0.5; // default beam axis if no sun yet
  if (sun && Number.isFinite(sun.position.x)) {
    const len = Math.hypot(sun.position.x, sun.position.z);
    if (len > 1e-3) { rowX = sun.position.x / len; rowZ = sun.position.z / len; }
  }

  const shaftGeo = new CylinderGeometry(SHAFT_TOP_R, SHAFT_BASE_R, SHAFT_H, 20, 1, true);
  const moteTex = makeMoteTexture();
  const shafts = [];
  const shaftCount = anchors ? Math.min(3, anchors.length) : 3;

  for (let i = 0; i < shaftCount; i++) {
    let ax; let az;
    if (anchors) {
      const a = anchors[i];
      ax = (a.x !== undefined) ? a.x : a.position.x;
      az = (a.z !== undefined) ? a.z : a.position.z;
    } else {
      // beams along the horizontal -sunDir axis (down-sun row, where
      // pillar-gap shafts land at sunset), jittered deterministically (C2).
      const t = i - (shaftCount - 1) / 2;
      ax = -t * 12 * rowX + rng.range(-2.5, 2.5);
      az = -t * 12 * rowZ + rng.range(-2.5, 2.5);
    }
    const py = floorY + 0.7 + SHAFT_H / 2;
    const uni = makeShaftUniforms();

    // holder carries the tilt (up-axis toward the sun); children stay centered
    const holder = new Group();
    holder.position.set(ax, floorY + 0.7, az);
    root.add(holder);

    const shaft = new Mesh(shaftGeo, makeShaftMaterial(uni));
    shaft.position.y = SHAFT_H / 2; // holder origin = floor end of the beam
    shaft.renderOrder = 4; // transparent, after opaque world
    holder.add(shaft);
    // motes: one instanced camera-facing quad set per beam, drifting + wrapping
    const n = MOTE_COUNTS[i % MOTE_COUNTS.length];
    const geo = new InstancedBufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array([
      -0.5, -0.5, 0, 0.5, -0.5, 0, 0.5, 0.5, 0, -0.5, 0.5, 0,
    ]), 3));
    geo.setAttribute('uv', new BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]), 2));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    const offArr = new Float32Array(n * 3);
    const velArr = new Float32Array(n * 3);
    const tintArr = new Float32Array(n * 3);
    const dataArr = new Float32Array(n * 2);
    for (let m = 0; m < n; m++) {
      const h = rng.range(0.5, SHAFT_H - 0.5);
      const rad = (SHAFT_BASE_R + (SHAFT_TOP_R - SHAFT_BASE_R) * (h / SHAFT_H)) * 0.8;
      const ang = rng.range(0, Math.PI * 2);
      const r = rad * Math.sqrt(rng.range(0.02, 1));
      offArr[m * 3] = Math.cos(ang) * r;
      offArr[m * 3 + 1] = h - SHAFT_H / 2; // local Y relative to shaft center
      offArr[m * 3 + 2] = Math.sin(ang) * r;
      velArr[m * 3] = rng.range(-0.14, 0.14);
      velArr[m * 3 + 1] = rng.range(0.05, 0.22); // slow upward drift (haze rise)
      velArr[m * 3 + 2] = rng.range(-0.14, 0.14);
      tintArr[m * 3] = rng.range(0.75, 1.0);
      tintArr[m * 3 + 1] = rng.range(0.55, 0.85);
      tintArr[m * 3 + 2] = rng.range(0.32, 0.6);
      dataArr[m * 2] = rng.range(0.03, 0.085);
      dataArr[m * 2 + 1] = rng.range(0, 1);
    }
    const offAttr = new InstancedBufferAttribute(offArr, 3);
    offAttr.setUsage(DynamicDrawUsage);
    geo.setAttribute('aOffset', offAttr);
    geo.setAttribute('aTint', new InstancedBufferAttribute(tintArr, 3));
    geo.setAttribute('aData', new InstancedBufferAttribute(dataArr, 2));
    geo.instanceCount = n;
    const motes = new Mesh(
      geo,
      makeMoteMaterial({ uTime: uni.uTime, uInt: uni.uInt, uMap: { value: moteTex } }),
    );
    motes.position.y = SHAFT_H / 2; // align mote cloud with the beam (holder-local)
    motes.renderOrder = 5;
    motes.frustumCulled = false; // instance offsets live in attributes
    holder.add(motes);

    shafts.push({ holder, mesh: shaft, motes, uni, offAttr, vel: velArr, n });
  }

  function updateMotes(s, dt) {
    const a = s.offAttr.array;
    for (let m = 0; m < s.n; m++) {
      const i3 = m * 3;
      a[i3] += s.vel[i3] * dt;
      a[i3 + 1] += s.vel[i3 + 1] * dt;
      a[i3 + 2] += s.vel[i3 + 2] * dt;
      let y = a[i3 + 1];
      if (y > SHAFT_H / 2 - 0.4) y = -SHAFT_H / 2 + 0.5; // recycle at the tip
      a[i3 + 1] = y;
      const h01 = (y + SHAFT_H / 2) / SHAFT_H;
      const lim = (SHAFT_BASE_R + (SHAFT_TOP_R - SHAFT_BASE_R) * h01) * 0.82;
      if (a[i3] > lim || a[i3] < -lim) a[i3] = -a[i3] * 0.98;   // soft wall wrap
      if (a[i3 + 2] > lim || a[i3 + 2] < -lim) a[i3 + 2] = -a[i3 + 2] * 0.98;
    }
    s.offAttr.needsUpdate = true;
  }

  // ---------------------------------------------------------------- render
  function render() {
    if (composer) {
      composer.render(time.raw > 0 ? time.raw : undefined);
    } else {
      renderer.render(scene, camera);
    }
    // A5b: viewmodel second pass — own near plane / fov, never occluded by
    // world geometry. autoClear is restored to its previous value, not forced.
    const prevAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(vmScene, vmCamera);
    renderer.autoClear = prevAutoClear;
  }

  // ---------------------------------------------------------------- update
  function update(dt) {
    const d = Number.isFinite(dt) && dt > 0 ? dt : 0;
    const raw = Number.isFinite(time.raw) && time.raw > 0 ? time.raw : d;
    grainT += raw;
    if (grainT > 3600) grainT -= 3600;

    // yaw rate (from the actual camera pose, wrap-safe) -> smear target
    camera.getWorldDirection(_fwd);
    const yaw = Math.atan2(_fwd.x, _fwd.z);
    if (lastYaw === null) lastYaw = yaw;
    let dy = yaw - lastYaw;
    if (dy > Math.PI) dy -= Math.PI * 2; else if (dy < -Math.PI) dy += Math.PI * 2;
    lastYaw = yaw;
    const rate = d > 1e-4 ? Math.abs(dy) / d : 0;
    smearSpring.set(clamp01((rate - YAW_START) / (YAW_FULL - YAW_START)));
    smearSpring.update(d);

    // CA: instant pops on events + firing bloom; both retreat exponentially in
    // real time (ease-out, hit-stop-safe — K4). uCA jumps on the event frame so
    // every hit reads, then glides down.
    caPop *= Math.exp(-CA_DECAY * raw);
    fireCA *= Math.exp(-FIRE_CA_DECAY * raw);
    const ca = Math.min(caPop + fireCA * 0.45, CA_MAX);

    // damage red edge: same eased envelope family (D6)
    dmgHold *= Math.exp(-DMG_DECAY * raw);

    // OVERDRIVE belt-and-braces vs missed bus events (state is authoritative)
    const odWant = state.overdrive.active ? 1 : 0;
    if (odSpring.target !== odWant) odSpring.set(odWant);
    odSpring.update(d);
    // grade uniforms
    if (gradePass) {
      const u = gradePass.uniforms;
      u.uTime.value = grainT;
      if (quality.flags.ca) u.uCA.value = ca;
      if (quality.flags.smear) u.uSmear.value = smearSpring.value;
      u.uOD.value = clamp01(odSpring.value);
      u.uDmg.value = clamp01(dmgHold);
    }

    // ---- G4: light shafts + dust motes ----
    const godrays = quality.flags.godrays && shafts.length > 0;
    root.visible = godrays;
    if (godrays) {
      const sy = (sun && Number.isFinite(sun.position.y)) ? sun.position.y : 8;
      sunElevSpring.set(clamp01(sy / 24)); // eased sun dip over the match
      sunElevSpring.update(d);
      const elev = Math.max(sunElevSpring.value, 0.05);
      // horizontal azimuth toward the sun (facing test + slant uniform)
      if (sun) _sunDir.set(sun.position.x - camera.position.x, 0, sun.position.z - camera.position.z);
      else _sunDir.set(-1, 0, -0.5);
      const hl = Math.hypot(_sunDir.x, _sunDir.z);
      if (hl > 1e-4) { _sunDir.x /= hl; _sunDir.z /= hl; }
      // looking toward the sun -> beams brighten through the haze (G4)
      const fh = Math.sqrt(_fwd.x * _fwd.x + _fwd.z * _fwd.z);
      const facing = fh > 1e-4
        ? clamp01(((_fwd.x * _sunDir.x + _fwd.z * _sunDir.z) / fh) * 0.5 + 0.5)
        : 0.5;
      const camX = camera.position.x;
      const camZ = camera.position.z;
      for (let i = 0; i < shafts.length; i++) {
        const s = shafts[i];
        const dx = s.holder.position.x - camX;
        const dz = s.holder.position.z - camZ;
        const d2 = dx * dx + dz * dz;
        // inside the beam volume (or right at its floor anchor) the cone
        // geometry crosses the near plane -> NaN pixels -> poisoned bloom.
        const near = d2 < SHAFT_FAR2 && d2 > 16;
        s.holder.visible = near;
        if (near) {
          // stylized beam: near-vertical, leaning toward the sun's azimuth by
          // an angle that eases with sun elevation (lower sun -> more lean).
          const tilt = 0.18 + (1 - elev) * 0.42;
          const st = Math.sin(tilt);
          _beamUp.set(st * _sunDir.x, Math.cos(tilt), st * _sunDir.z);
          _q.setFromUnitVectors(_upY, _beamUp);
          s.holder.quaternion.copy(_q);
        }
        const showMotes = near && quality.flags.motes;
        s.motes.visible = showMotes;
        s.uni.uInt.value = near ? elev * (0.2 + 0.8 * facing) : 0;
        s.uni.uTime.value = grainT;
        s.uni.uSlant.value.set(_sunDir.x, _sunDir.z);
        if (showMotes) updateMotes(s, d);
      }
    }
  }

  // ---------------------------------------------------------------- resize
  let curDpr = -1;
  function resize(w, h, dpr) {
    let p = (Number.isFinite(dpr) && dpr > 0) ? dpr : quality.dpr();
    p = Math.min(Math.max(p, 0.5), 2); // P2: clamp devicePixelRatio <= 2
    if (p !== curDpr) {
      curDpr = p;
      renderer.setPixelRatio(p);
      if (composer) composer.setPixelRatio(p);
    }
    if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
      renderer.setSize(w, h);
    }
    syncSize();
  }

  function setDamageFlash(x) {
    const v = clamp01(Number.isFinite(x) ? x : 0);
    if (v > 0) {
      if (v > dmgHold) dmgHold = v;             // red edge rides the same envelope
      caPop = Math.min(CA_MAX, Math.max(caPop, v * 0.9)); // CA pop from the flash
    }
  }

  // ---------------------------------------------------------------- quality
  function applyQuality() {
    const wantComposer = !!(quality.flags.bloom && quality.flags.grade);
    if (wantComposer) buildComposer();
    else disposeComposer();
    root.visible = !!(quality.flags.godrays && shafts.length > 0);
  }
  offs.push(bus.on('quality:change', applyQuality));
  applyQuality();
  resize(); // prime dpr/size from current state

  return {
    update,
    render,
    resize,
    setDamageFlash,
    // read-only introspection for the P4 debug overlay
    stats() {
      return {
        mode: quality.mode,
        composer: !!composer,
        _composer: composer,
        shafts: shafts.length,
        motes: MOTE_TOTAL,
        ca: gradePass ? gradePass.uniforms.uCA.value : 0,
        smear: gradePass ? gradePass.uniforms.uSmear.value : 0,
        od: gradePass ? gradePass.uniforms.uOD.value : 0,
        dmg: gradePass ? gradePass.uniforms.uDmg.value : 0,
      };
    },
    // full teardown (match end / hot-reload); per-restart listeners are managed
    // by bus.clear() in core — K6.
    dispose() {
      for (const off of offs) off();
      offs.length = 0;
      disposeComposer();
      moteTex.dispose();
      for (const s of shafts) {
        s.mesh.material.dispose();
        s.motes.material.dispose();
        s.motes.geometry.dispose();
      }
      shafts.length = 0;
      shaftGeo.dispose();
      scene.remove(root);
    },
  };
}
