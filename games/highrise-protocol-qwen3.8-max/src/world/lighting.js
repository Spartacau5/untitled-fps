// ---------------------------------------------------------------------------
// world/lighting.js — golden-hour presentation (Section 8). Low warm sun with
// long shadows, haze fog, gradient sky dome, sun sprite, city silhouette.
// Lighting, contrast and motion do the heavy lifting — geometry stays simple.
// ---------------------------------------------------------------------------
import * as THREE from 'three';

export const TUNING = {
  SUN_COLOR: 0xffbf78,
  SUN_INTENSITY: 3.1,
  SUN_POS: [-34, 21, -20],
  HEMI_SKY: 0xffd9b3,
  HEMI_GROUND: 0x3a342e,
  HEMI_INTENSITY: 0.55,
  FOG_COLOR: 0xdf9f68,
  FOG_NEAR: 55,
  FOG_FAR: 340,
  EXPOSURE: 1.12,
};

export function setupRenderer(renderer) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = TUNING.EXPOSURE;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

export function setupLighting(scene, track) {
  const T = TUNING;
  const sun = new THREE.DirectionalLight(T.SUN_COLOR, T.SUN_INTENSITY);
  sun.position.set(...T.SUN_POS);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -32; sun.shadow.camera.right = 32;
  sun.shadow.camera.top = 32; sun.shadow.camera.bottom = -32;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 110;
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  scene.add(sun.target);
  track.light();

  const hemi = new THREE.HemisphereLight(T.HEMI_SKY, T.HEMI_GROUND, T.HEMI_INTENSITY);
  scene.add(hemi);
  track.light();

  scene.fog = new THREE.Fog(T.FOG_COLOR, T.FOG_NEAR, T.FOG_FAR);

  // --- sky dome: sunset gradient ------------------------------------------------
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color(0x232a48) },
      mid: { value: new THREE.Color(0xb56a4a) },
      horizon: { value: new THREE.Color(0xf5b06a) },
      sunDir: { value: new THREE.Vector3(...T.SUN_POS).normalize() },
    },
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; uniform vec3 sunDir;
      varying vec3 vDir;
      void main() {
        float h = clamp(vDir.y, -0.05, 1.0);
        vec3 col = mix(horizon, mid, smoothstep(0.0, 0.18, h));
        col = mix(col, top, smoothstep(0.12, 0.65, h));
        float sunAmt = pow(max(dot(normalize(vDir), normalize(sunDir)), 0.0), 24.0);
        col += vec3(1.0, 0.72, 0.38) * sunAmt * 0.85;
        float glow = pow(max(dot(normalize(vDir), normalize(sunDir)), 0.0), 4.0);
        col += vec3(0.55, 0.3, 0.12) * glow * 0.35;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(480, 24, 14), skyMat);
  scene.add(sky);

  // --- sun sprite ---------------------------------------------------------------
  const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: sunTexture(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const sd = new THREE.Vector3(...T.SUN_POS).normalize().multiplyScalar(430);
  sunSprite.position.copy(sd);
  sunSprite.scale.setScalar(120);
  scene.add(sunSprite);

  // --- city silhouette (P3: unlit dark boxes, fog does the work) ------------------
  const cityMat = new THREE.MeshBasicMaterial({ color: 0x2a2430 });
  const cityMat2 = new THREE.MeshBasicMaterial({ color: 0x241f2b });
  const cityGeo = new THREE.BoxGeometry(1, 1, 1);
  let s = 12345;
  const rnd = () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), s | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < 46; i++) {
    const ang = (i / 46) * Math.PI * 2 + rnd() * 0.1;
    const radius = 210 + rnd() * 150;
    const h = 14 + rnd() * 66;
    const w = 12 + rnd() * 26;
    const b = new THREE.Mesh(cityGeo, rnd() > 0.5 ? cityMat : cityMat2);
    b.position.set(Math.cos(ang) * radius, h / 2 - 6, Math.sin(ang) * radius);
    b.scale.set(w, h, w * (0.6 + rnd() * 0.8));
    b.rotation.y = rnd() * Math.PI;
    scene.add(b);
  }

  return { sun };
}

function sunTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,238,200,1)');
  grad.addColorStop(0.25, 'rgba(255,200,120,0.75)');
  grad.addColorStop(0.6, 'rgba(255,150,60,0.18)');
  grad.addColorStop(1, 'rgba(255,140,50,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
