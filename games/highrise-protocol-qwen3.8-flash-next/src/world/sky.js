// HIGHRISE PROTOCOL — sky (§1, G1/G4 backdrop): gradient sunset dome, low sun disc + halo,
// two-layer instanced city silhouette with lit windows, drifting haze bands. All randomness
// from the seeded rng (C2). Exposes sky.state = { sunDir, sunScreen, intensity } for post/godrays.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { rng } from '../core/rng.js';

const CITY_Y0 = -150;   // ground line far below the floor: only distant tops show at the horizon

export function init(ctx) {
  const skyGroup = new THREE.Group();
  skyGroup.name = 'sky';
  skyGroup.frustumCulled = false;
  ctx.scene.add(skyGroup);

  // sun lives in the -X/-Z quadrant (open edge), dipping over the match
  const sunDir = new THREE.Vector3(-0.46, 0.26, -0.85).normalize();
  const state = {
    sunDir,                                  // live unit vector toward the sun
    sunScreen: new THREE.Vector2(0.5, 0.5),  // 0..1 screen UV; negative = off-screen/behind
    intensity: 1,                            // 0..1 glow weight (dips with the sun)
  };

  // ---------------------------------------------------------------- gradient dome
  const domeUniforms = {
    uSunDir: { value: sunDir },
    uHorizon: { value: new THREE.Color(0xffa45c) },
    uZenith: { value: new THREE.Color(0x16233f) },
    uGround: { value: new THREE.Color(0x191318) },
    uSunTint: { value: new THREE.Color(0xffcf9a) },
    uExposure: { value: 1 },
    uTime: { value: 0 },
  };
  const domeMat = new THREE.ShaderMaterial({
    uniforms: domeUniforms,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uSunDir; uniform vec3 uHorizon; uniform vec3 uZenith;
      uniform vec3 uGround; uniform vec3 uSunTint; uniform float uExposure;
      uniform float uTime;
      varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        float up = clamp(d.y, -1.0, 1.0);
        vec3 col = mix(uGround, uHorizon, pow(clamp(1.0 - abs(up) * 2.6, 0.0, 1.0), 1.6));
        col = mix(col, uZenith, pow(clamp(up, 0.0, 1.0), 0.55));
        float sd = max(dot(d, uSunDir), 0.0);
        col += uSunTint * (pow(sd, 6.0) * 0.30 + pow(sd, 64.0) * 0.65 + pow(sd, 512.0) * 1.2) * uExposure;
        // slow procedural cloud banding catching the low light
        float band = sin(d.x * 7.0 + d.z * 4.0 + d.y * 11.0 + uTime * 0.012) * 0.5 + 0.5;
        band *= sin(d.x * 3.0 - d.z * 5.0 + uTime * 0.006) * 0.5 + 0.5;
        col += uSunTint * band * 0.05 * pow(sd, 2.0) * clamp(1.0 - abs(up - 0.10) * 3.5, 0.0, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(480, 32, 18), domeMat);
  dome.renderOrder = -10;
  skyGroup.add(dome);

  // ---------------------------------------------------------------- sun disc + halo
  function radialSprite(stops) {
    const S = 128;
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    const g = cv.getContext('2d');
    const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    for (let i = 0; i < stops.length; i++) gr.addColorStop(stops[i][0], stops[i][1]);
    g.fillStyle = gr;
    g.fillRect(0, 0, S, S);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  const matDisc = new THREE.SpriteMaterial({
    map: radialSprite([[0, 'rgba(255,252,240,1)'], [0.3, 'rgba(255,226,172,1)'],
      [0.55, 'rgba(255,170,90,0.4)'], [1, 'rgba(255,140,60,0)']]),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  });
  const matHalo = new THREE.SpriteMaterial({
    map: radialSprite([[0, 'rgba(255,198,132,0.6)'], [0.4, 'rgba(255,150,70,0.18)'],
      [1, 'rgba(255,120,50,0)']]),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
  });
  const halo = new THREE.Sprite(matHalo);
  halo.renderOrder = -9;
  const disc = new THREE.Sprite(matDisc);
  disc.renderOrder = -8;
  const sunAnchor = new THREE.Object3D();
  sunAnchor.add(halo, disc);
  skyGroup.add(sunAnchor);

  // ---------------------------------------------------------------- city silhouette layers
  // Opaque basic boxes drawn before the additive haze → near buildings correctly punch
  // through the far layer and occlude the sinking sun disc.
  function cityLayer(count, rMin, rMax, hMin, hMax, baseHex, order, winOrder) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    geo.translate(0, 0.5, 0); // grow from the ground line
    const im = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ color: baseHex, fog: false }), count);
    im.renderOrder = order;
    const dummy = new THREE.Object3D();
    const winGeos = [];
    for (let i = 0; i < count; i++) {
      const a = rng.range(0, Math.PI * 2);
      const r = rng.range(rMin, rMax);
      const w = rng.range(6, 16), d = rng.range(6, 16);
      const h = rng.range(hMin, hMax);
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const yaw = rng.range(0, Math.PI / 2);
      dummy.position.set(x, CITY_Y0, z);
      dummy.rotation.set(0, yaw, 0);
      dummy.scale.set(w, h, d);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
      // lit windows: sparse quads proud of the box faces
      const cols = Math.max(2, Math.floor(w / 1.8)), rows = Math.max(2, Math.floor(h / 2.3));
      const ca = Math.cos(yaw), sa = Math.sin(yaw);
      for (let cix = 0; cix < cols; cix++) {
        for (let ri = 0; ri < rows; ri++) {
          if (rng.next() > 0.1) continue;
          const lx = (cix / (cols - 1) - 0.5) * w * 0.72;
          const ly = h * (0.08 + (ri / (rows - 1)) * 0.84);
          const face = ri % 2 === 0 ? d / 2 + 0.08 : -(d / 2 + 0.08);
          const g = new THREE.PlaneGeometry(0.55, 0.8);
          g.rotateY(yaw + (face > 0 ? 0 : Math.PI));
          g.translate(x + lx * ca + face * sa, CITY_Y0 + ly, z - lx * sa + face * ca);
          winGeos.push(g);
        }
      }
    }
    im.instanceMatrix.needsUpdate = true;
    im.computeBoundingSphere();
    skyGroup.add(im);
    if (winGeos.length) {
      const merged = mergeGeometries(winGeos, false);
      for (let i = 0; i < winGeos.length; i++) winGeos[i].dispose();
      const nV = merged.attributes.position.count;
      const colors = new Float32Array(nV * 3);
      const warm = new THREE.Color(0xffc48a);
      let vi = 0;
      while (vi < nV) {
        const t = 0.3 + rng.range(0, 0.7);
        for (let k = 0; k < 4 && vi < nV; k++, vi++) {
          colors[vi * 3] = warm.r * t; colors[vi * 3 + 1] = warm.g * t; colors[vi * 3 + 2] = warm.b * t;
        }
      }
      merged.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      merged.computeBoundingSphere();
      const wins = new THREE.Mesh(merged, new THREE.MeshBasicMaterial({
        vertexColors: true, fog: false, blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false,
      }));
      wins.renderOrder = winOrder;
      skyGroup.add(wins);
    }
  }
  cityLayer(110, 160, 340, 70, 150, 0x33405e, -7, -6); // far, hazier blue-grey
  cityLayer(70, 70, 130, 60, 120, 0x202a40, -5, -4);   // near, darker

  // ---------------------------------------------------------------- haze bands (atmospheric depth)
  function hazeTex() {
    const S = 128;
    const cv = document.createElement('canvas');
    cv.width = S; cv.height = S;
    const g = cv.getContext('2d');
    for (let i = 0; i < 200; i++) {
      const x = rng.range(0, S), y = rng.range(0, S), r = rng.range(6, 30);
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, 'rgba(255,255,255,0.15)');
      gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    const t2 = new THREE.CanvasTexture(cv);
    t2.wrapS = t2.wrapT = THREE.RepeatWrapping;
    return t2;
  }
  const haze = [];
  for (let i = 0; i < 3; i++) {
    const tex = hazeTex();
    tex.repeat.set(4 + i, 0.7);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(560, 30 + i * 16),
      new THREE.MeshBasicMaterial({
        map: tex, color: i === 0 ? 0xffb27a : 0xc9a08a, transparent: true,
        opacity: 0.3 - i * 0.07, depthWrite: false, fog: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    m.renderOrder = -3 + i;
    m.userData.dist = 150 + i * 45;
    skyGroup.add(m);
    haze.push(m);
  }

  // ---------------------------------------------------------------- update
  let t = 0;
  function update(dt, elapsed, sun) {
    t += Number.isFinite(dt) ? Math.min(dt, 0.05) : 0;
    if (sun) sunDir.copy(sun); // world owns the dip; mirror it for consumers

    // dip factor: 1 = high golden, 0 = ember near the horizon
    const dip = THREE.MathUtils.clamp((sunDir.y - 0.05) / 0.21, 0, 1);
    sunAnchor.position.copy(sunDir).multiplyScalar(420);
    const grow = 1 + (1 - dip) * 0.85; // disc fattens as it dips
    disc.scale.set(28 * grow, 28 * grow, 1);
    halo.scale.set(120 * grow, 120 * grow, 1);
    matHalo.opacity = 0.5 + (1 - dip) * 0.34;
    state.intensity = 0.45 + 0.55 * dip;

    // dome response to the dip
    domeUniforms.uExposure.value = 0.6 + 0.55 * (1 - dip) * (1 - dip);
    domeUniforms.uHorizon.value.setRGB(1.0, 0.62 + dip * 0.13, 0.33 + dip * 0.12);
    domeUniforms.uZenith.value.setRGB(0.085 + (1 - dip) * 0.06, 0.135, 0.245);
    domeUniforms.uTime.value = t;

    // haze bands stand between the city layers on the sun azimuth, squared up to the
    // camera (group-local billboards about Y), drifting with a layered-sine wind
    const hx = sunDir.x, hz2 = sunDir.z;
    for (let i = 0; i < haze.length; i++) {
      const band = haze[i];
      const dist = band.userData.dist;
      band.position.set(hx * dist, -4 - i * 10, hz2 * dist);
      band.rotation.set(0, Math.atan2(-hx, -hz2), 0); // plane +Z faces the eye at group origin
      const off = band.material.map.offset;
      off.x = t * 0.004 * (1 + i * 0.5) + 0.02 * Math.sin(t * 0.05 + i);
      off.y = 0.5 + Math.sin(t * 0.021 + i * 1.3) * 0.04;
    }
    skyGroup.position.copy(ctx.camera.position); // shell follows the eye

    // sun screen position for post/godrays — allocation-free projection of the eye→sun
    // direction through the camera's own matrices (group offset cancels: sky tracks eye)
    const cam = ctx.camera;
    const e = cam.matrixWorldInverse.elements, p = cam.projectionMatrix.elements;
    const lx = sunAnchor.position.x, ly = sunAnchor.position.y, lz = sunAnchor.position.z;
    const vx = e[0] * lx + e[4] * ly + e[8] * lz;   // rotation-only view transform
    const vy = e[1] * lx + e[5] * ly + e[9] * lz;
    const vz = e[2] * lx + e[6] * ly + e[10] * lz;
    const cw = -vz;
    if (cw > 1e-4) {
      const sx = (p[0] * vx) / cw, sy = (p[5] * vy) / cw;
      if (Number.isFinite(sx) && Number.isFinite(sy)) state.sunScreen.set(0.5 + 0.5 * sx, 0.5 + 0.5 * sy);
      else state.sunScreen.set(-2, -2);
    } else state.sunScreen.set(-2, -2); // behind camera → off-screen sentinel
    void elapsed;
  }

  return { group: skyGroup, state, update };
}
