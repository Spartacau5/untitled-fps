// HIGHRISE PROTOCOL — world (§1 setting, G1/G2 hooks, E3 surfaces, W1 sheeting, cover/mantle).
// Unfinished high-rise top floor at sunset. Procedural from the seeded rng (C2); static
// geometry merged per material + InstancedMesh clutter; raycastWorld is the single query surface.
// Every entry in `surfaces` has a LOCAL, tight bounding volume (controller builds its wall
// collision AABB cache per-mesh / per-instance from world.surfaces).
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng } from '../core/rng.js';
import { Spring } from '../core/spring.js';
import { bus } from '../core/bus.js';
import { quality } from '../core/quality.js';
import * as E from '../core/easings.js';
import { init as initSky } from './sky.js';

const ARENA_W = 44;             // X extent (m)
const ARENA_D = 34;             // Z extent (m)
const WALL_H = 3.4;             // floor-to-open-stud height of pillars/core walls
const SHEET_N = 6;              // simultaneous sheeting ripples (W1)
const THIN_SURFACES = new Set(['drywall', 'sheeting', 'glass']); // E3 pass-through

// ---------------------------------------------------------------- noise + textures
// Tileable value-noise fbm, one lattice per octave, seeded from `rng`.
class Noise2 {
  constructor(base, oct) {
    this.octs = [];
    for (let o = 0; o < oct; o++) {
      const n = base << o;
      const a = new Float32Array(n * n);
      for (let i = 0; i < a.length; i++) a[i] = rng.next();
      this.octs.push({ n, a });
    }
  }
  fbm(u, v) {
    let sum = 0, amp = 1, tot = 0;
    for (let o = 0; o < this.octs.length; o++) {
      const L = this.octs[o], n = L.n, a = L.a;
      const x = u * n, y = v * n;
      const xi = Math.floor(x), yi = Math.floor(y);
      const xf = x - xi, yf = y - yi;
      const i0 = ((xi % n) + n) % n, j0 = ((yi % n) + n) % n;
      const i1 = (i0 + 1) % n, j1 = (j0 + 1) % n;
      const s = xf * xf * (3 - 2 * xf), t = yf * yf * (3 - 2 * yf);
      const a00 = a[j0 * n + i0], a10 = a[j0 * n + i1];
      const a01 = a[j1 * n + i0], a11 = a[j1 * n + i1];
      const top = a00 + (a10 - a00) * s, bot = a01 + (a11 - a01) * s;
      sum += amp * (top + (bot - top) * t);
      tot += amp; amp *= 0.5;
    }
    return sum / tot;
  }
}

function heightToNormal(h, size, strength) {
  const out = new Uint8ClampedArray(size * size * 4);
  for (let y = 0; y < size; y++) {
    const ym = (y - 1 + size) % size, yp = (y + 1) % size;
    for (let x = 0; x < size; x++) {
      const xm = (x - 1 + size) % size, xp = (x + 1) % size;
      let nx = (h[y * size + xm] + h[ym * size + x] - h[y * size + xp] - h[yp * size + x]) * strength;
      let ny = (h[ym * size + x] + h[y * size + xm] - h[yp * size + x] - h[y * size + xp]) * strength;
      const len = Math.sqrt(nx * nx + ny * ny + 1);
      nx /= len; ny /= len;
      const o = (y * size + x) * 4;
      out[o] = (nx * 0.5 + 0.5) * 255;
      out[o + 1] = (ny * 0.5 + 0.5) * 255;
      out[o + 2] = (1 / len * 0.5 + 0.5) * 255;
      out[o + 3] = 255;
    }
  }
  return out;
}

function canvasTex(cv, { srgb = false, rep = [1, 1] } = {}) {
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rep[0], rep[1]);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function dataTex(arr, size, opts) {
  const cv = document.createElement('canvas');
  cv.width = size; cv.height = size;
  cv.getContext('2d').putImageData(new ImageData(arr, size, size), 0, 0);
  return canvasTex(cv, opts);
}

// Canvas-drawn PBR set: albedo + derived normal + roughness variation (G2).
function materialSet(size, draw, { rep = [1, 1], nStrength = 1.4, rBase = 218, rScale = 18 } = {}) {
  const cv = document.createElement('canvas');
  cv.width = size; cv.height = size;
  const g = cv.getContext('2d');
  const h = new Float32Array(size * size);
  draw(g, h, size);
  const alb = g.getImageData(0, 0, size, size).data.slice();
  const map = dataTex(alb, size, { srgb: true, rep });
  const normalMap = dataTex(heightToNormal(h, size, nStrength), size, { rep });
  const rgh = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const r = Math.max(60, Math.min(255, h[i] * -rScale + rBase));
    rgh[i * 4] = rgh[i * 4 + 1] = rgh[i * 4 + 2] = r; rgh[i * 4 + 3] = 255;
  }
  const roughnessMap = dataTex(rgh, size, { rep });
  return { map, normalMap, roughnessMap };
}

// write one pixel of albedo + its height field
function px(g2, h, size, x, y, r, gb, b, dh) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  h[y * size + x] = dh;
  g2.fillStyle = `rgb(${r | 0},${gb | 0},${b | 0})`;
  g2.fillRect(x, y, 1, 1);
}

function concreteMaps(size, warm) {
  return materialSet(size, (g2, h, S) => {
    const nA = new Noise2(16, 4), nB = new Noise2(4, 3), nH = new Noise2(64, 1), nC = new Noise2(6, 2);
    g2.fillStyle = warm ? '#8f8577' : '#85837f';
    g2.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = x / S, v = y / S;
        const f = nA.fbm(u, v), s = nB.fbm(u, v), p = nH.fbm(u, v);
        const line = Math.abs(nC.fbm(u, v) - 0.5);
        const crack = line < 0.018 ? 1 - line / 0.018 : 0;
        const pit = p > 0.88 ? (p - 0.88) / 0.12 : 0;
        let shade = 0.66 + 0.30 * f + 0.10 * s - 0.30 * crack - 0.26 * pit;
        shade = Math.max(0.18, Math.min(1.06, shade));
        const base = warm ? 150 : 138;
        px(g2, h, S, x, y,
          base * shade * 1.035 + 8,
          base * shade + 8,
          base * shade * 0.925 + 10,
          0.55 * f + 0.25 * s - 0.6 * crack - 0.5 * pit);
      }
    }
    g2.globalAlpha = 0.5;
    for (let i = 0; i < 6; i++) { // formwork tie holes
      g2.fillStyle = '#4c4740';
      g2.beginPath(); g2.arc(rng.range(0, S), rng.range(0, S), rng.range(2, 4), 0, 6.284); g2.fill();
    }
    g2.globalAlpha = 1;
  }, { rep: [6, 6], nStrength: 2.2 });
}

function metalMaps(size) {
  return materialSet(size, (g2, h, S) => {
    const nA = new Noise2(24, 3), nH = new Noise2(64, 1);
    g2.fillStyle = '#565a5f';
    g2.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = x / S, v = y / S;
        const f = nA.fbm(u, v), p = nH.fbm(u, v);
        const rust = f > 0.66 ? (f - 0.66) * 2.4 : 0;
        const shade = 0.72 + 0.28 * f;
        px(g2, h, S, x, y,
          (92 + rust * 70) * shade,
          (95 + rust * 34) * shade,
          (101 - rust * 30) * shade,
          0.4 * f + 0.4 * (p - 0.5) - rust * 0.3);
      }
    }
    for (let i = 0; i < 46; i++) { // scratches
      const y = rng.range(0, S), x0 = rng.range(0, S), len = rng.range(14, 150);
      g2.strokeStyle = rng.next() < 0.5 ? 'rgba(190,195,200,0.35)' : 'rgba(24,26,30,0.4)';
      g2.lineWidth = rng.range(0.5, 1.6);
      g2.beginPath(); g2.moveTo(x0, y); g2.lineTo(x0 + len, y + rng.range(-2, 2)); g2.stroke();
    }
  }, { rep: [3, 3], nStrength: 1.6, rBase: 178 });
}

function woodMaps(size) {
  return materialSet(size, (g2, h, S) => {
    const nA = new Noise2(8, 3), nH = new Noise2(64, 2);
    g2.fillStyle = '#8a6a45';
    g2.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = x / S, v = y / S;
        const rings = (v * 7 + nA.fbm(u, v) * 3.5) % 1;
        const dark = Math.pow(Math.abs(rings - 0.5) * 2, 7);
        const fine = nH.fbm(u, v);
        let shade = 0.86 + 0.22 * fine - 0.4 * dark + 0.08 * (nA.fbm(u * 0.5, v * 0.5) - 0.5);
        shade = Math.max(0.3, Math.min(1.15, shade));
        px(g2, h, S, x, y, 148 * shade, 112 * shade, 74 * shade, -dark * 0.7 + fine * 0.25);
      }
    }
    g2.strokeStyle = 'rgba(30,20,12,0.45)'; g2.lineWidth = 2;
    for (let i = 0; i < 3; i++) { // board joints
      const x = (i + 1) * S / 3.4;
      g2.beginPath(); g2.moveTo(x, 0); g2.lineTo(x + rng.range(-6, 6), S); g2.stroke();
    }
  }, { rep: [2, 2], nStrength: 1.8, rBase: 235 });
}

function drywallMaps(size) {
  return materialSet(size, (g2, h, S) => {
    const nH = new Noise2(64, 2), nB = new Noise2(4, 2);
    g2.fillStyle = '#cfc9bc';
    g2.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = x / S, v = y / S;
        const f = nH.fbm(u, v), s = nB.fbm(u, v);
        const roll = Math.sin(u * Math.PI * 14) * 0.015;
        const shade = 0.9 + 0.09 * (f - 0.5) + 0.06 * (s - 0.5) + roll;
        px(g2, h, S, x, y, 214 * shade, 208 * shade, 194 * shade, 0.5 * f + roll * 6);
      }
    }
  }, { rep: [2, 3], nStrength: 0.9, rBase: 242 });
}

function glassMaps(size) {
  return materialSet(size, (g2, h, S) => {
    const nA = new Noise2(8, 3), nH = new Noise2(48, 2);
    g2.fillStyle = '#39494e';
    g2.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = x / S, v = y / S;
        const d = nA.fbm(u, v * 0.55 + 0.004 * nH.fbm(u, v)); // dust drifts downward
        const p = nH.fbm(u, v);
        const dust = Math.max(0, d - 0.52) * 1.9 + (p > 0.9 ? 0.3 : 0);
        px(g2, h, S, x, y, 62 + dust * 118, 78 + dust * 106, 84 + dust * 82, d * 0.18 + p * 0.1);
      }
    }
  }, { rep: [2, 2], nStrength: 0.5, rBase: 120 });
}

function plasticNormal(size) {
  const cv = document.createElement('canvas');
  cv.width = size; cv.height = size;
  const h = new Float32Array(size * size);
  const nA = new Noise2(10, 3), nH = new Noise2(64, 2);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      const fold = Math.sin(u * 12.6 + nA.fbm(u, v) * 5) * 0.5 + 0.5;
      h[y * size + x] = fold * 0.6 + nH.fbm(u, v) * 0.4;
    }
  }
  cv.getContext('2d').putImageData(new ImageData(heightToNormal(h, size, 0.9), size, size), 0, 0);
  return canvasTex(cv, { rep: [2, 2] });
}

// ---------------------------------------------------------------- geometry helpers
function boxAt(w, h, d, x, y, z, ry = 0) {
  const g = new THREE.BoxGeometry(w, h, d);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  return g;
}
// diagonal brace built in local XY, rotated to sit across the scaffold face
function braceGeo(x0, y0, x1, y1, th) {
  const dx = x1 - x0, dy = y1 - y0;
  const g = new THREE.BoxGeometry(Math.hypot(dx, dy), th, th);
  g.rotateZ(Math.atan2(dy, dx));
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, 0);
  return g;
}

function mergedMesh(geos, material, name, surface, cast = true, receive = true) {
  const merged = mergeGeometries(geos, false);
  for (let i = 0; i < geos.length; i++) geos[i].dispose();
  merged.computeBoundingSphere();
  const m = new THREE.Mesh(merged, material);
  m.name = name;
  m.userData.surface = surface;
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

// ---------------------------------------------------------------- module
export function init(ctx) {
  const group = new THREE.Group();
  group.name = 'world';
  ctx.scene.add(group);

  // ---------- materials ----------
  const concreteTex = concreteMaps(256, true);
  const wallTex = concreteMaps(192, false);
  const metalTex = metalMaps(256);
  const woodTex = woodMaps(256);
  const dryTex = drywallMaps(192);
  const glassTex = glassMaps(256);

  const matFloor = new THREE.MeshStandardMaterial({
    map: concreteTex.map, normalMap: concreteTex.normalMap, roughnessMap: concreteTex.roughnessMap,
    color: 0xb8b0a2, roughness: 1, metalness: 0.02, normalScale: new THREE.Vector2(1.3, 1.3),
  });
  const matConcrete = new THREE.MeshStandardMaterial({
    map: wallTex.map, normalMap: wallTex.normalMap, roughnessMap: wallTex.roughnessMap,
    color: 0xc2b9ab, roughness: 1, metalness: 0.02, normalScale: new THREE.Vector2(1.15, 1.15),
  });
  const matMetal = new THREE.MeshStandardMaterial({
    map: metalTex.map, normalMap: metalTex.normalMap, roughnessMap: metalTex.roughnessMap,
    color: 0x8d9298, roughness: 1, metalness: 0.72,
  });
  const matRebar = new THREE.MeshStandardMaterial({
    map: metalTex.map, normalMap: metalTex.normalMap, roughnessMap: metalTex.roughnessMap,
    color: 0x77584a, roughness: 1, metalness: 0.85,
  });
  const matWood = new THREE.MeshStandardMaterial({
    map: woodTex.map, normalMap: woodTex.normalMap, roughnessMap: woodTex.roughnessMap,
    color: 0xc79a66, roughness: 0.92, metalness: 0,
  });
  const matDrywall = new THREE.MeshStandardMaterial({
    map: dryTex.map, normalMap: dryTex.normalMap, roughnessMap: dryTex.roughnessMap,
    color: 0xe4ded1, roughness: 1, metalness: 0,
  });
  const matGlass = new THREE.MeshStandardMaterial({
    map: glassTex.map, normalMap: glassTex.normalMap, roughnessMap: glassTex.roughnessMap,
    color: 0x9fc6c9, transparent: true, opacity: 0.34, roughness: 1, metalness: 0.05,
    side: THREE.DoubleSide, depthWrite: false,
  });
  const matPaint = new THREE.MeshStandardMaterial({
    map: metalTex.map, normalMap: metalTex.normalMap, roughnessMap: metalTex.roughnessMap,
    roughness: 1, metalness: 0.1,
  });
  matPaint.normalScale = new THREE.Vector2(0.55, 0.55);

  // ---------- W1: plastic sheeting — wind sway + bullet ripples in the vertex stage ----------
  const sheetImpulseP = [];
  for (let i = 0; i < SHEET_N; i++) sheetImpulseP.push(new THREE.Vector3(0, -999, 0));
  const sheetImpulseT = new Float32Array(SHEET_N).fill(99);
  const sheetUniforms = {
    uTime: { value: 0 },
    uWind: { value: new THREE.Vector2(0, -1) },
    uGust: { value: 1 },
    uAmp: { value: 0 },
    uImpulseP: { value: sheetImpulseP },
    uImpulseT: { value: sheetImpulseT },
    uSunDir: { value: new THREE.Vector3(-0.46, 0.26, -0.85).normalize() },
  };
  const matSheet = new THREE.MeshPhongMaterial({
    color: 0xcfd6d8, specular: 0xffd8a8, shininess: 46,
    normalMap: plasticNormal(192),
    transparent: true, opacity: 0.66, side: THREE.DoubleSide, emissive: 0x24221f,
  });
  matSheet.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, sheetUniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float aPhase;
        attribute float aHang;
        uniform float uTime;
        uniform vec2 uWind;
        uniform float uGust;
        uniform float uAmp;
        uniform vec3 uImpulseP[${SHEET_N}];
        uniform float uImpulseT[${SHEET_N}];
        varying float vDisp;
        varying vec3 vWorldN;`)
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
        float hang = clamp(aHang, 0.0, 1.0);
        float hang2 = hang * hang;
        float ph = aPhase;
        float sway = sin(position.x * 1.9 + uTime * 2.1 + ph) * 0.55
                   + sin(position.x * 4.6 - uTime * 3.3 + ph * 1.7) * 0.25
                   + sin(position.y * 2.6 + uTime * 1.35 + ph) * 0.2;
        float slopeX = (cos(position.x * 1.9 + uTime * 2.1 + ph) * 1.045
                      + cos(position.x * 4.6 - uTime * 3.3 + ph * 1.7) * 1.15) * 0.16 * hang2 * uGust;
        vec4 swp = modelMatrix * vec4(position, 1.0);
        float rip = 0.0;
        for (int i = 0; i < ${SHEET_N}; i++) {
          float tt = uImpulseT[i];
          if (tt < 1.7) {
            float dd = distance(swp.xyz, uImpulseP[i]);
            rip += sin(dd * 26.0 - tt * 21.0) * exp(-dd * 5.0) * exp(-tt * 3.0);
          }
        }
        vDisp = (sway * 0.16 + rip * uAmp * 0.5) * hang2 * uGust;
        objectNormal = normalize(objectNormal + vec3(-slopeX - rip * uAmp * hang2 * 2.0, 0.0, 0.0));
        vWorldN = normalize(mat3(modelMatrix) * objectNormal);`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        transformed.z += vDisp;
        transformed.x += sin(uTime * 1.5 + ph * 0.6) * 0.05 * hang * uWind.x * uGust;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uSunDir;
        varying float vDisp;
        varying vec3 vWorldN;`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>
        float back = pow(max(dot(normalize(vWorldN), uSunDir), 0.0), 3.0);
        float rippleK = clamp(abs(vDisp) * 7.0, 0.0, 1.0);
        gl_FragColor.rgb += vec3(1.0, 0.74, 0.48) * (back * 0.42 + rippleK * 0.25);`);
  };

  const sheets = [];
  function makeSheet(w, h, x, y, z, ry) {
    const geo = new THREE.PlaneGeometry(w, h, 10, 12);
    const nV = geo.attributes.position.count;
    const aPhase = new Float32Array(nV);
    const aHang = new Float32Array(nV);
    const pos = geo.attributes.position.array;
    const ph0 = rng.range(0, 6.283);
    for (let i = 0; i < nV; i++) {
      aPhase[i] = ph0 + pos[i * 3] * 0.4;
      aHang[i] = 1 - (pos[i * 3 + 1] + h / 2) / h; // 0 at the top batten, 1 at the free hem
    }
    geo.setAttribute('aPhase', new THREE.BufferAttribute(aPhase, 1));
    geo.setAttribute('aHang', new THREE.BufferAttribute(aHang, 1));
    const mesh = new THREE.Mesh(geo, matSheet);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    mesh.userData.surface = 'sheeting';
    mesh.castShadow = false; // semi-transparent + vertex-displaced: shadows would lie
    mesh.receiveShadow = true;
    group.add(mesh);
    sheets.push({
      mesh,
      center: new THREE.Vector3(x, y, z),
      right: new THREE.Vector3(Math.cos(ry), 0, -Math.sin(ry)),
      normal: new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry)),
      halfW: w / 2, halfH: h / 2,
    });
    return mesh;
  }

  // ---------- build lists ----------
  const metalGeos = [];   // window frames along the core wall (one thin plane merge)
  const glassPanes = [];
  const raycastTargets = [];
  const cover = [];
  const mantles = [];
  const dummy = new THREE.Object3D();

  // Floor slab
  const floor = mergedMesh([boxAt(ARENA_W, 0.4, ARENA_D, 0, -0.2, 0)], matFloor, 'floor', 'concrete', false, true);
  group.add(floor);
  raycastTargets.push(floor);

  // Pillars on a rough jittered grid — InstancedMesh (unit box scaled per pillar) so the
  // controller's per-instance AABB cache gets tight boxes, one draw call for all shafts.
  const pillarSpots = [];
  const gx = [-15, -7.5, 0, 7.5, 15], gz = [-10.5, -2, 6.5];
  for (let ix = 0; ix < gx.length; ix++) {
    for (let iz = 0; iz < gz.length; iz++) {
      if (gz[iz] === -10.5 && gx[ix] === 0) continue;       // open sunset sightline
      if (gz[iz] === 6.5 && Math.abs(gx[ix]) < 4) continue; // core-wall junction clear
      const x0 = gx[ix] + rng.range(-0.9, 0.9);
      const z0 = gz[iz] + rng.range(-0.7, 0.7);
      const w = rng.range(0.66, 0.86);
      pillarSpots.push({ x: x0, z: z0, w, ry: rng.range(-0.12, 0.12) });
    }
  }
  const unitBox = new THREE.BoxGeometry(1, 1, 1);
  unitBox.translate(0, 0.5, 0);
  const pillarsIM = new THREE.InstancedMesh(unitBox, matConcrete, pillarSpots.length);
  pillarsIM.name = 'pillars';
  pillarsIM.userData.surface = 'concrete';
  pillarsIM.castShadow = true;
  pillarsIM.receiveShadow = true;
  for (let i = 0; i < pillarSpots.length; i++) {
    const p = pillarSpots[i];
    dummy.position.set(p.x, 0, p.z);
    dummy.rotation.set(0, p.ry, 0);
    dummy.scale.set(p.w, WALL_H, p.w);
    dummy.updateMatrix();
    pillarsIM.setMatrixAt(i, dummy.matrix);
    // (footing pads omitted: they would merge into the core-wall mesh and bloat its AABB)
  }
  pillarsIM.instanceMatrix.needsUpdate = true;
  pillarsIM.computeBoundingSphere();
  group.add(pillarsIM);
  raycastTargets.push(pillarsIM);

  // Back core wall (+Z) with window openings glowing with sunset — one wall-plane merge
  const wallZ = 16.55;
  const winCenters = [-16, -8, 0, 8, 16];
  const sillY = 0.95, headY = 2.55;
  const coreGeos = [boxAt(ARENA_W, sillY, 0.45, 0, sillY / 2, wallZ),
    boxAt(ARENA_W, WALL_H - headY, 0.45, 0, (WALL_H + headY) / 2, wallZ)];
  const mull = [-22, -17.6, -14.4, -9.6, -6.4, -1.6, 1.6, 6.4, 9.6, 14.4, 17.6, 22];
  for (let i = 0; i < mull.length; i += 2) {
    coreGeos.push(boxAt(mull[i + 1] - mull[i], WALL_H, 0.45, (mull[i] + mull[i + 1]) / 2, WALL_H / 2, wallZ));
  }
  for (const wx of winCenters) {
    const fw = 3.2, fh = headY - sillY;
    metalGeos.push(boxAt(fw + 0.16, 0.09, 0.14, wx, sillY, wallZ));
    metalGeos.push(boxAt(fw + 0.16, 0.09, 0.14, wx, headY, wallZ));
    metalGeos.push(boxAt(0.09, fh, 0.14, wx - fw / 2, (sillY + headY) / 2, wallZ));
    metalGeos.push(boxAt(0.09, fh, 0.14, wx + fw / 2, (sillY + headY) / 2, wallZ));
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(fw - 0.05, fh - 0.05), matGlass);
    pane.position.set(wx, (sillY + headY) / 2, wallZ);
    pane.userData.surface = 'glass';
    group.add(pane);
    glassPanes.push(pane);
  }

  // Side stub walls of the unfinished core
  const stubTopY = 2.45;
  const stubLeft = mergedMesh([boxAt(0.45, stubTopY, 9.6, -21.75, stubTopY / 2, 11.9)], matConcrete, 'stub-wall-left', 'concrete');
  const stubRight = mergedMesh([boxAt(0.45, stubTopY, 9.6, 21.75, stubTopY / 2, 11.9)], matConcrete, 'stub-wall-right', 'concrete');
  group.add(stubLeft, stubRight);
  raycastTargets.push(stubLeft, stubRight);

  // Parapet ring on the open edges — one tight chunk per side
  const paraFront = [boxAt(ARENA_W, 1.12, 0.4, 0, 0.56, -16.8), boxAt(ARENA_W + 0.4, 0.1, 0.55, 0, 1.16, -16.8)];
  const paraLeft = [boxAt(0.4, 1.12, 24.6, -21.8, 0.56, -4.4)];
  const paraRight = [boxAt(0.4, 1.12, 24.6, 21.8, 0.56, -4.4)];
  const edgeBeam = mergedMesh([boxAt(ARENA_W, 0.34, 0.12, 0, -0.45, -16.98)], matMetal, 'slab-edge-beam', 'metal'); // form left in place
  group.add(edgeBeam);
  raycastTargets.push(edgeBeam);

  // Rebar bundles: pillar tops, wall-top dowels, floor-edge patches
  const rebarItems = [];
  const bundle = (x, y, z, n, len, spread, tiltMax) => {
    for (let i = 0; i < n; i++) {
      const a = rng.range(0, 6.283), r = Math.sqrt(rng.next()) * spread;
      rebarItems.push({
        x: x + Math.cos(a) * r, y: y + len / 2, z: z + Math.sin(a) * r,
        tilt: rng.range(0, tiltMax), ta: rng.range(0, 6.283), l: len * rng.range(0.75, 1.25),
      });
    }
  };
  for (const p of pillarSpots) bundle(p.x, WALL_H, p.z, 4, 0.5, 0.2, 0.18);
  for (let i = 0; i < 10; i++) bundle(-21.75, stubTopY, 7.4 + i * 0.9, 3, 0.42, 0.1, 0.14);
  for (let i = 0; i < 10; i++) bundle(21.75, stubTopY, 7.4 + i * 0.9, 3, 0.42, 0.1, 0.14);
  for (let i = 0; i < 5; i++) bundle(rng.range(-20, 20), 0, rng.range(-16.2, -15.4), 8, rng.range(0.5, 0.85), 0.28, 0.35);
  bundle(-20.5, 0, 3.5, 10, 0.7, 0.45, 0.5);
  bundle(19.5, 0, -12, 10, 0.7, 0.45, 0.5);

  const rebarGeo = new THREE.CylinderGeometry(0.017, 0.021, 1, 5, 1);
  const rebarIM = new THREE.InstancedMesh(rebarGeo, matRebar, rebarItems.length);
  rebarIM.name = 'rebar';
  rebarIM.userData.surface = 'metal';
  rebarIM.castShadow = true;
  {
    const eul = new THREE.Euler();
    for (let i = 0; i < rebarItems.length; i++) {
      const it = rebarItems[i];
      eul.set(Math.cos(it.ta) * it.tilt, 0, Math.sin(it.ta) * it.tilt);
      dummy.position.set(it.x, it.y, it.z);
      dummy.quaternion.setFromEuler(eul);
      dummy.scale.set(1, it.l, 1);
      dummy.updateMatrix();
      rebarIM.setMatrixAt(i, dummy.matrix);
    }
  }
  rebarIM.instanceMatrix.needsUpdate = true;
  rebarIM.computeBoundingSphere();
  group.add(rebarIM);
  raycastTargets.push(rebarIM);

  // Pallets (instanced merged pallet) — tall stacks are mantle ledges + hard cover
  const palParts = [
    boxAt(1.2, 0.022, 0.09, 0, 0.145, -0.42),
    boxAt(1.2, 0.022, 0.09, 0, 0.145, 0),
    boxAt(1.2, 0.022, 0.09, 0, 0.145, 0.42),
    boxAt(1.16, 0.02, 1.0, 0, 0, 0),
  ];
  for (let ix = -1; ix <= 1; ix++) {
    for (let iz = -1; iz <= 1; iz++) palParts.push(boxAt(0.1, 0.11, 0.1, ix * 0.52, 0.065, iz * 0.42));
  }
  const palGeo = mergeGeometries(palParts, false);
  for (const g of palParts) g.dispose();
  palGeo.computeBoundingSphere();
  const PAL_STEP = 0.165;
  const palletSpots = [
    { x: -10.5, z: 3.2, r: rng.range(-0.3, 0.3), stack: 1 },
    { x: 5.2, z: -6.5, r: rng.range(-0.3, 0.3), stack: 7 },
    { x: 12.5, z: 1.5, r: rng.range(-0.3, 0.3), stack: 1 },
    { x: -3.5, z: -12.8, r: rng.range(-0.3, 0.3), stack: 6 },
    { x: -16.5, z: -11.5, r: rng.range(-0.3, 0.3), stack: 1 },
    { x: 17, z: -7, r: rng.range(-0.3, 0.3), stack: 6 },
  ];
  let palletTotal = 0;
  for (const s of palletSpots) palletTotal += s.stack;
  const palletIM = new THREE.InstancedMesh(palGeo, matWood, palletTotal);
  palletIM.name = 'pallets';
  palletIM.userData.surface = 'wood';
  palletIM.castShadow = true;
  palletIM.receiveShadow = true;
  {
    let idx = 0;
    for (const s of palletSpots) {
      for (let k = 0; k < s.stack; k++) {
        dummy.position.set(s.x, k * PAL_STEP, s.z);
        dummy.rotation.set(0, s.r + k * rng.range(-0.06, 0.06), 0);
        dummy.scale.setScalar(1);
        dummy.updateMatrix();
        palletIM.setMatrixAt(idx++, dummy.matrix);
      }
      if (s.stack >= 5) {
        const top = (s.stack - 1) * PAL_STEP + 0.17;
        mantles.push({
          min: { center: new THREE.Vector3(s.x, top / 2, s.z), half: new THREE.Vector3(0.74, top / 2, 0.64) },
          top,
        });
        const side = new THREE.Vector3(-s.x, 0, -s.z).normalize();
        cover.push({ pos: new THREE.Vector3(s.x, top * 0.7, s.z), side, type: 'crate', taken: null, radius: 1.2 });
      }
    }
  }
  palletIM.instanceMatrix.needsUpdate = true;
  palletIM.computeBoundingSphere();
  group.add(palletIM);
  raycastTargets.push(palletIM);

  // Crates — cover + waist-high mantles
  const crateParts = [
    boxAt(0.98, 0.98, 0.98, 0, 0.49, 0),
    boxAt(1.02, 0.07, 0.1, 0, 0.3, 0.5), boxAt(1.02, 0.07, 0.1, 0, 0.7, 0.5),
    boxAt(1.02, 0.07, 0.1, 0, 0.3, -0.5), boxAt(1.02, 0.07, 0.1, 0, 0.7, -0.5),
    boxAt(0.1, 0.07, 1.02, 0.5, 0.5, 0), boxAt(0.1, 0.07, 1.02, -0.5, 0.5, 0),
  ];
  const crateGeo = mergeGeometries(crateParts, false);
  for (const g of crateParts) g.dispose();
  crateGeo.computeBoundingSphere();
  const crateSpots = [
    { x: -5.5, z: 9.5 }, { x: -4.6, z: 9.2 }, { x: 10.5, z: -4 },
    { x: 15.5, z: 8.5 }, { x: -12.5, z: -6.5 },
  ];
  const cratesIM = new THREE.InstancedMesh(crateGeo, matWood, crateSpots.length);
  cratesIM.name = 'crates';
  cratesIM.userData.surface = 'wood';
  cratesIM.castShadow = true;
  cratesIM.receiveShadow = true;
  for (let i = 0; i < crateSpots.length; i++) {
    const s = crateSpots[i];
    const sc = rng.range(0.94, 1.08);
    const ry = rng.range(-0.5, 0.5);
    dummy.position.set(s.x, 0.49 * sc, s.z);
    dummy.rotation.set(0, ry, 0);
    dummy.scale.setScalar(sc);
    dummy.updateMatrix();
    cratesIM.setMatrixAt(i, dummy.matrix);
    const hh = 0.52 * sc;
    mantles.push({
      min: { center: new THREE.Vector3(s.x, hh, s.z), half: new THREE.Vector3(0.58 * sc, hh, 0.58 * sc) },
      top: 1.01 * sc,
    });
    const side = new THREE.Vector3(-s.x, 0, -s.z);
    if (side.lengthSq() < 1e-4) side.set(0, 0, -1);
    cover.push({ pos: new THREE.Vector3(s.x, 0.75, s.z), side: side.normalize(), type: 'crate', taken: null, radius: 1.15 });
  }
  cratesIM.instanceMatrix.needsUpdate = true;
  cratesIM.computeBoundingSphere();
  group.add(cratesIM);
  raycastTargets.push(cratesIM);

  // Drywall: leaning rows (thin cover) + flat stacks (mantles) — separate tight meshes
  const panelW = 1.2, panelH = 2.44, panelT = 0.028;
  const dryRows = [
    { x: -17.8, z: 1.5, r: 0.06 },
    { x: 14.5, z: 10.8, r: -0.08 },
  ];
  for (const row of dryRows) {
    const geos = [];
    for (let i = 0; i < 6; i++) {
      const g = new THREE.BoxGeometry(panelT, panelH, panelW);
      g.translate(0, panelH / 2 - 0.02, 0); // pivot at the floor line
      g.rotateX(0.13);                      // leaning against the wall behind
      g.rotateY(row.r);
      g.translate(row.x, 0, row.z + (i - 2.5) * 0.24);
      geos.push(g);
    }
    const m = mergedMesh(geos, matDrywall, 'drywall-row', 'drywall');
    group.add(m);
    raycastTargets.push(m);
    const side = new THREE.Vector3(-row.x, 0, -row.z).normalize();
    cover.push({ pos: new THREE.Vector3(row.x, 1.1, row.z), side, type: 'drywall', taken: null, radius: 1.6 });
  }
  const flatStacks = [{ x: 2.5, z: -10 }, { x: -9.5, z: -15 }];
  for (const s of flatStacks) {
    const geos = [];
    const n = 28;
    for (let i = 0; i < n; i++) {
      geos.push(boxAt(panelW + 0.1, panelT, panelW * 2,
        s.x + rng.range(-0.02, 0.02), 0.18 + i * (panelT + 0.004), s.z, rng.range(-0.03, 0.03)));
    }
    const m = mergedMesh(geos, matDrywall, 'drywall-stack', 'drywall');
    group.add(m);
    raycastTargets.push(m);
    const top = 0.18 + n * (panelT + 0.004);
    mantles.push({
      min: { center: new THREE.Vector3(s.x, top / 2, s.z), half: new THREE.Vector3(0.72, top / 2, 1.32) },
      top,
    });
    const side = new THREE.Vector3(-s.x, 0, -s.z).normalize();
    cover.push({ pos: new THREE.Vector3(s.x, top + 0.35, s.z), side, type: 'drywall', taken: null, radius: 1.7 });
  }

  // Paint buckets (instanced, per-instance tint)
  const bucketGeo = new THREE.CylinderGeometry(0.19, 0.165, 0.35, 14, 1);
  const bucketSpots = [
    { x: -16.9, z: 3.4 }, { x: -15.9, z: 3.9 }, { x: -16.6, z: 4.5 },
    { x: 13.7, z: 11.6 }, { x: 14.4, z: 11.1 },
    { x: 6.5, z: 12.5 }, { x: -6.8, z: -9.2 }, { x: -7.4, z: -8.5 },
  ];
  const bucketsIM = new THREE.InstancedMesh(bucketGeo, matPaint, bucketSpots.length);
  bucketsIM.name = 'buckets';
  bucketsIM.userData.surface = 'paint';
  bucketsIM.castShadow = true;
  {
    const c = new THREE.Color();
    const palette = [0xe8e2d4, 0xd8ded9, 0xb7c4c9, 0xa93b26, 0xe0d9c8, 0xcfd6c4, 0x8fa3ad, 0xd9b23a];
    for (let i = 0; i < bucketSpots.length; i++) {
      const s = bucketSpots[i];
      const tipped = rng.next() < 0.18;
      dummy.position.set(s.x + rng.range(-0.1, 0.1), tipped ? 0.16 : 0.175, s.z + rng.range(-0.1, 0.1));
      dummy.rotation.set(tipped ? rng.range(0.9, 1.25) : 0, rng.range(0, 6.28), 0);
      dummy.scale.setScalar(rng.range(0.95, 1.08));
      dummy.updateMatrix();
      bucketsIM.setMatrixAt(i, dummy.matrix);
      bucketsIM.setColorAt(i, c.setHex(palette[i % palette.length]));
    }
    if (bucketsIM.instanceColor) bucketsIM.instanceColor.needsUpdate = true;
  }
  bucketsIM.instanceMatrix.needsUpdate = true;
  bucketsIM.computeBoundingSphere();
  group.add(bucketsIM);
  raycastTargets.push(bucketsIM);

  // Scaffold frames with sheeting hung off them near the open sunset edge (W1).
  // Each frame is its OWN merged mesh → tight AABB for the controller.
  const scaffoldSpots = [
    { x: -12, z: -14.2, ry: 0.15 }, { x: -1.5, z: -14.6, ry: -0.1 }, { x: 9.5, z: -14.1, ry: 0.22 },
  ];
  const tube = 0.055, scW = 2.0, scD = 1.2, scH = 2.72;
  for (const s of scaffoldSpots) {
    const ca = Math.cos(s.ry), sa = Math.sin(s.ry);
    const geos = [];
    const put = (lx, ly, lz, w, h, d) =>
      geos.push(boxAt(w, h, d, s.x + lx * ca + lz * sa, ly, s.z - lx * sa + lz * ca, s.ry));
    for (const [lx, lz] of [[-scW / 2, -scD / 2], [scW / 2, -scD / 2], [scW / 2, scD / 2], [-scW / 2, scD / 2]]) {
      put(lx, scH / 2, lz, tube, scH, tube);
    }
    for (const y of [scH - 0.05, 1.35]) {
      put(0, y, -scD / 2, scW, tube, tube);
      put(0, y, scD / 2, scW, tube, tube);
      put(-scW / 2, y, 0, tube, tube, scD);
      put(scW / 2, y, 0, tube, tube, scD);
    }
    const b = braceGeo(-scW / 2, 0.06, scW / 2, scH - 0.12, tube);
    b.rotateY(s.ry);
    b.translate(s.x, 0, s.z);
    geos.push(b);
    const frame = mergedMesh(geos, matMetal, 'scaffold', 'metal');
    group.add(frame);
    raycastTargets.push(frame);
    // sheet hung from the top rail on the face toward the open edge (local −Z side)
    const shW = scW - 0.2, shH = 2.3, lz = -(scD / 2 + 0.06);
    makeSheet(shW, shH, s.x + sa * lz, scH - shH / 2 - 0.02, s.z + ca * lz, s.ry);
  }

  // Free-standing glass panes leaning on racks (rack posts = tight per-rack merge)
  const rackSpots = [{ x: -19.2, z: -6.5, ry: 0.9 }, { x: -2.5, z: 12.8, ry: 0.12 }];
  for (const r of rackSpots) {
    const ca = Math.cos(r.ry), sa = Math.sin(r.ry);
    const postGeos = [];
    for (let i = 0; i < 3; i++) {
      const off = (i - 1) * 0.32;
      const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 2.15), matGlass);
      pane.position.set(r.x + ca * off, 1.06, r.z - sa * off);
      pane.rotation.order = 'YXZ';
      pane.rotation.y = r.ry;
      pane.rotation.x = -0.12; // leaning back against the rack
      pane.userData.surface = 'glass';
      group.add(pane);
      glassPanes.push(pane);
    }
    for (const i of [-1, 1]) {
      postGeos.push(boxAt(0.06, 1.9, 0.06, r.x + ca * (i * 0.65), 0.95, r.z - sa * (i * 0.65)));
    }
    const rack = mergedMesh(postGeos, matMetal, 'glass-rack', 'metal');
    group.add(rack);
    raycastTargets.push(rack);
  }

  // Cover points from a spread of pillars — protected side faces the arena center
  for (let i = 0; i < pillarSpots.length; i++) {
    if (i % 2 === 1) continue;
    const p = pillarSpots[i];
    const side = new THREE.Vector3(-p.x, 0, -p.z);
    if (side.lengthSq() < 1e-4) side.set(0, 0, -1);
    cover.push({ pos: new THREE.Vector3(p.x, 0.95, p.z), side: side.normalize(), type: 'pillar', taken: null, radius: 1.3 });
  }

  // ---------- merge & add static chunks (all locally tight boxes) ----------
  const wallsMesh = mergedMesh(coreGeos, matConcrete, 'concrete-core', 'concrete');
  group.add(wallsMesh);
  raycastTargets.push(wallsMesh);
  const metalMesh = mergedMesh(metalGeos, matMetal, 'metal-frames', 'metal');
  group.add(metalMesh);
  raycastTargets.push(metalMesh);
  {
    const front = mergedMesh(paraFront, matConcrete, 'parapet-front', 'concrete');
    const left = mergedMesh(paraLeft, matConcrete, 'parapet-left', 'concrete');
    const right = mergedMesh(paraRight, matConcrete, 'parapet-right', 'concrete');
    group.add(front, left, right);
    raycastTargets.push(front, left, right);
  }
  for (const s of sheets) raycastTargets.push(s.mesh);
  for (const p of glassPanes) raycastTargets.push(p);

  // Rubble chips — visual garnish, deliberately NOT a raycast/collision target
  const chipGeo = new THREE.IcosahedronGeometry(0.13, 0);
  const rubbleN = 60;
  const rubbleIM = new THREE.InstancedMesh(chipGeo, matConcrete, rubbleN);
  rubbleIM.name = 'rubble';
  rubbleIM.receiveShadow = true;
  for (let i = 0; i < rubbleN; i++) {
    dummy.position.set(rng.range(-21, 21), rng.range(0.02, 0.06), rng.range(-16.2, 15.8));
    dummy.rotation.set(rng.range(0, 3), rng.range(0, 3), rng.range(0, 3));
    dummy.scale.set(rng.range(0.4, 1.5), rng.range(0.3, 0.8), rng.range(0.5, 1.3));
    dummy.updateMatrix();
    rubbleIM.setMatrixAt(i, dummy.matrix);
  }
  rubbleIM.instanceMatrix.needsUpdate = true;
  rubbleIM.computeBoundingSphere();
  group.add(rubbleIM);

  // God-ray shaft anchors (G4): gaps between pillar columns where beams can land.
  // Read by post if present; purely advisory x/z pairs on the floor.
  const sunShaftAnchors = [];
  for (let i = 0; i < pillarSpots.length - 1; i += 2) {
    const a = pillarSpots[i], b2 = pillarSpots[i + 1];
    sunShaftAnchors.push({ x: (a.x + b2.x) / 2, z: (a.z + b2.z) / 2 });
  }

  // ---------- enemies attach point ----------
  const enemiesGroup = new THREE.Group();
  enemiesGroup.name = 'enemies';
  ctx.scene.add(enemiesGroup);

  // ---------- raycast ----------
  const raycaster = new THREE.Raycaster();
  const UP = new THREE.Vector3(0, 1, 0);
  const results = [];
  const queryTargets = [];
  const enemyList = [];
  const scratchV = new THREE.Vector3();

  function collectEnemy(o) {
    if (o.isMesh && o.userData && o.userData.enemy && o.visible !== false) enemyList.push(o);
  }

  // Fresh enemy hitbox list (contract accessor + raycast feeder).
  function enemyHitMeshes() {
    enemyList.length = 0;
    const en = ctx.enemies;
    if (en && typeof en.hitMeshes === 'function') {
      const list = en.hitMeshes();
      if (list) for (let i = 0; i < list.length; i++) if (list[i] && list[i].visible !== false) enemyList.push(list[i]);
      return enemyList;
    }
    for (let i = 0; i < enemiesGroup.children.length; i++) enemiesGroup.children[i].traverse(collectEnemy);
    return enemyList;
  }

  function hitMeshes() {
    const em = enemyHitMeshes();
    const out = new Array(em.length);
    for (let i = 0; i < em.length; i++) out[i] = em[i];
    return out;
  }

  function raycastWorld(origin, dir, maxDist = 120, opts) {
    results.length = 0;
    raycaster.set(origin, dir);
    raycaster.near = 0;
    raycaster.far = maxDist > 0 ? maxDist : 120;
    queryTargets.length = 0;
    if (!(opts && opts.noEnemies === true)) {
      const em = enemyHitMeshes();
      for (let i = 0; i < em.length; i++) queryTargets.push(em[i]);
    }
    for (let i = 0; i < raycastTargets.length; i++) {
      const m = raycastTargets[i];
      if (m.visible) queryTargets.push(m);
    }
    const hits = raycaster.intersectObjects(queryTargets, false); // dist-sorted ascending
    const all = !!(opts && opts.allHits);
    for (let i = 0; i < hits.length; i++) {
      const h = hits[i];
      const ud = h.object.userData || {};
      const surface = ud.enemy ? 'body' : (ud.surface || 'concrete');
      h.dist = h.distance;
      h.surface = surface;
      h.enemy = ud.enemy || null;
      h.part = ud.part || null;
      if (h.normal) {
        // r170 delivers intersection.normal in object-local space; rotate to world
        // and re-orient toward the shooter (DoubleSide planes can hit backfaces).
        h.normal.transformDirection(h.object.matrixWorld);
        if (h.normal.dot(raycaster.ray.direction) > 0) h.normal.negate();
      } else {
        h.normal = UP.clone();
      }
      results.push(h);
      // default stops at the first blocker; allHits (E3) passes through thin surfaces
      // and continues until the first solid blocker, which is included as the next entry.
      if (!all || !THIN_SURFACES.has(surface)) break;
    }
    return results;
  }

  // ---------- W1: bullet impulses on sheeting ----------
  const ripAmp = new Spring(0, 55, 0.6);
  let nextSlot = 0;
  function sheetingHit(point) {
    if (!point) return false;
    let best = null, bestScore = Infinity;
    for (let i = 0; i < sheets.length; i++) {
      const s = sheets[i];
      const dx = point.x - s.center.x, dy = point.y - s.center.y, dz = point.z - s.center.z;
      if (Math.abs(dy) > s.halfH + 0.8) continue;
      const along = dx * s.right.x + dz * s.right.z;
      const across = Math.abs(dx * s.normal.x + dz * s.normal.z);
      if (Math.abs(along) > s.halfW + 0.5 || across > 1.1) continue;
      const score = across + Math.abs(along) * 0.02;
      if (score < bestScore) { bestScore = score; best = s; }
    }
    if (!best) return false;
    const slot = nextSlot % SHEET_N; nextSlot++;
    sheetImpulseP[slot].set(point.x, point.y, point.z);
    sheetImpulseT[slot] = 0;
    ripAmp.impulse(9);
    return true;
  }

  // ---------- glass breakage (F5; fx inits after world — guard for null) ----------
  function glassBreak(object) {
    if (!object || !object.userData || object.userData.surface !== 'glass') return true;
    if (object.userData.broken) return true;
    object.userData.broken = true;
    object.visible = false; // raycastWorld filters invisible → bullets pass through after
    const fx = ctx.fx;
    scratchV.copy(object.position); // group sits at origin → local == world
    if (fx) {
      if (typeof fx.shatter === 'function') fx.shatter(scratchV, UP, object);
      else if (typeof fx.impact === 'function') fx.impact(scratchV, UP, 'glass', 1.4);
    }
    bus.emit('glass:break', { point: scratchV }); // audio.js listens → glass sfx (single play)
    return true; // thin — damage passes through (E3)
  }

  // ---------- sun / sky (G1/G4: dip handled here) ----------
  const sky = initSky(ctx);
  ctx.sky = sky; // post/godrays may read ctx.sky.state or api.sky.state
  const sunDir = new THREE.Vector3();
  const SUN_R = 104;
  const fogA = new THREE.Color(0x5a4636), fogB = new THREE.Color(0x442e2a);
  const sunA = new THREE.Color(0xffb56b), sunB = new THREE.Color(0xff7f3f);

  let sunK = 0;
  function applySun(e) {
    const el = THREE.MathUtils.lerp(0.26, 0.05, e);          // elevation: golden → ember
    const az = THREE.MathUtils.lerp(-2.06, -2.46, e);        // sweeping toward the open (-Z) edge
    const cosEl = Math.cos(el);
    ctx.sun.position.set(Math.cos(az) * SUN_R * cosEl, Math.sin(el) * SUN_R, Math.sin(az) * SUN_R * cosEl);
    ctx.sun.target.position.set(0, 0.5, 0);
    ctx.sun.target.updateMatrixWorld();
    sunDir.copy(ctx.sun.position).normalize();
    ctx.sun.color.copy(sunA).lerp(sunB, e);
    ctx.sun.intensity = 3.1 - 1.15 * e;
    if (ctx.scene.fog) { // fog-light tweaks as the sun dips
      ctx.scene.fog.color.copy(fogA).lerp(fogB, e);
      ctx.scene.fog.density = 0.011 + 0.006 * e;
    }
    sheetUniforms.uSunDir.value.copy(sunDir);
  }
  applySun(0);

  // P4/quality: shed expensive shadow casters in low mode
  bus.on('quality:change', () => {
    const shadows = quality.flags.shadows !== false;
    palletIM.castShadow = shadows;
    rebarIM.castShadow = shadows;
    cratesIM.castShadow = shadows;
    bucketsIM.castShadow = shadows;
    pillarsIM.castShadow = shadows;
  });

  let animT = 0;
  function update(dt, elapsed, k) {
    if (typeof k === 'number' && Number.isFinite(k)) sunK = Math.max(0, Math.min(1, k));
    applySun(E.easeInOutCubic(sunK));
    sky.update(dt, elapsed, sunDir);

    animT += dt;
    sheetUniforms.uTime.value = animT;
    // layered gust envelope (sum of slow sines — never linear drift)
    const gust = 0.72 + 0.28 * Math.sin(animT * 0.37) * Math.sin(animT * 0.13 + 1.7)
      + 0.12 * Math.sin(animT * 1.11);
    sheetUniforms.uGust.value = Math.max(0.25, gust);
    ripAmp.update(dt);
    sheetUniforms.uAmp.value = Math.max(0, ripAmp.value);
    const wa = 0.4 * Math.sin(animT * 0.05) + 0.25 * Math.sin(animT * 0.017);
    sheetUniforms.uWind.value.set(Math.sin(wa) * 0.6, -Math.cos(wa) * 0.98);
    for (let i = 0; i < SHEET_N; i++) {
      if (sheetImpulseT[i] < 90) sheetImpulseT[i] += dt;
    }
  }

  group.updateMatrixWorld(true);

  return {
    update,
    raycastWorld,
    surfaces: raycastTargets,   // live single raycast target list (static + thin blockers)
    enemiesGroup,
    hitMeshes,
    cover,
    mantles,
    sheetingHit,
    glassBreak,
    bounds: { minX: -21.4, maxX: 21.4, minZ: -16.4, maxZ: 16.1, floorY: 0 },
    resetProps() {                       // K6/C2: restore shattered panes per match
      for (const p of glassPanes) { p.visible = true; if (p.userData) p.userData.broken = false; }
      ctx.fx?.resetGlass?.();
    },
    sky,                        // extra hook: post reads sky.state {sunDir, sunScreen, intensity}
    scene: ctx.scene,           // extra: siblings attach transient meshes (enemies debris)
    sunShaftAnchors,            // extra: G4 god-ray landing spots (x/z on the floor)
  };
}
