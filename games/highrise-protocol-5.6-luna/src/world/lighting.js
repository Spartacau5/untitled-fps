import * as THREE from "three";

export function buildLighting(scene) {
  scene.background = new THREE.Color(0x0d1c27);
  scene.fog = new THREE.FogExp2(0x1b3036, 0.014);
  const hemi = new THREE.HemisphereLight(0x9ed1db, 0x302a27, 1.35);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffbd78, 3.25);
  sun.position.set(-19, 25, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -32;
  sun.shadow.camera.right = 32;
  sun.shadow.camera.top = 32;
  sun.shadow.camera.bottom = -32;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 80;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x6b9fc5, 0.4);
  fill.position.set(20, 8, -18);
  scene.add(fill);
  const sunCanvas = document.createElement("canvas");
  sunCanvas.width = 128;
  sunCanvas.height = 128;
  const sunContext = sunCanvas.getContext("2d");
  const sunGradient = sunContext.createRadialGradient(64, 64, 4, 64, 64, 64);
  sunGradient.addColorStop(0, "rgba(255,238,177,0.95)");
  sunGradient.addColorStop(0.22, "rgba(255,194,112,0.6)");
  sunGradient.addColorStop(1, "rgba(255,145,70,0)");
  sunContext.fillStyle = sunGradient;
  sunContext.fillRect(0, 0, 128, 128);
  const sunTexture = new THREE.CanvasTexture(sunCanvas);
  const sunDisc = new THREE.Sprite(new THREE.SpriteMaterial({ map: sunTexture, color: 0xffffff, transparent: true, opacity: 0.52, depthWrite: false, blending: THREE.AdditiveBlending }));
  sunDisc.position.set(-28, 19, -32);
  sunDisc.scale.setScalar(7.5);
  scene.add(sunDisc);
  return { sun, hemi, fill };
}
