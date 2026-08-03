// ---------------------------------------------------------------------------
// weapon/viewmodel.js — rig, hierarchy, per-frame pose composition (S12).
// One place, one fixed order:
//   base pose -> ADS blend -> movement motion -> look-lag -> recoil -> reload
// No layer fights another; the rig can never end in a broken pose.
// Poses are captured per fixed step and interpolated at render.
// ---------------------------------------------------------------------------
import * as THREE from 'three';
import { Spring, lerp, clamp } from '../core/spring.js';

function smoothstep01(x) { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); }

export const TUNING = {
  HIP_POS: [0.24, -0.245, -0.40],   // base hip pose (camera-local)
  HIP_ROT: [0.015, -0.02, 0.01],
  ADS_POS: [0, -0.078, -0.32],      // sight rides exactly on the eye axis (A2)
  ADS_ROT: [0, 0, 0],
  PIVOT: [0, -0.012, 0.15],         // sway pivot behind the grip (S5)
  RELOAD_MOTION_WEIGHT: 0.55,       // R4: motion keeps running underneath
  RELOAD_SWAY_WEIGHT: 0.68,
  NUDGE_K: 420, NUDGE_D: 24,        // mag-slam nudge (R2.2), ease-out overshoot
};

export class Viewmodel {
  constructor(camera) {
    this.camera = camera;
    this._buildRig();
    this.nudge = new Spring(TUNING.NUDGE_K, TUNING.NUDGE_D, 0);
    this.posePrev = {};
    this.poseCur = {};
    for (const k of this._keys()) { this.posePrev[k] = 0; this.poseCur[k] = 0; }
    this._muzzleWorld = new THREE.Vector3();
    this._v = {}; // reused interpolation buffer (P1: no per-frame alloc)
  }

  _keys() {
    return ['rx', 'ry', 'rz', 'px', 'py', 'pz',
      'sx', 'sy', 'srx', 'sry', 'srz', 'muz',
      'grx', 'gry', 'grz', 'gz', 'gy', 'gx',
      'magOldY', 'magOldRZ', 'magNewY', 'magNewRZ', 'boltZ', 'nudge'];
  }

  _mat(color, metal = 0.75, rough = 0.4) {
    return new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rough });
  }

  _buildRig() {
    // albedos kept light enough to read against the sunset backlight (P2);
    // metalness low because there is no env map to reflect
    const gunmetal = this._mat(0x454c56, 0.45, 0.42);
    const dark = this._mat(0x2a2e34, 0.35, 0.6);
    const polymer = this._mat(0x33383f, 0.12, 0.82);
    const skin = this._mat(0xb98a63, 0.02, 0.85);
    const sleeve = this._mat(0x30363d, 0.05, 0.9);

    const root = new THREE.Group();
    const sway = new THREE.Group();
    sway.position.set(...TUNING.PIVOT);
    const gun = new THREE.Group();
    gun.position.set(-TUNING.PIVOT[0], -TUNING.PIVOT[1], -TUNING.PIVOT[2]);
    const muzzleGroup = new THREE.Group();
    root.add(sway); sway.add(gun); gun.add(muzzleGroup);
    this.root = root; this.swayGroup = sway; this.gun = gun; this.muzzleGroup = muzzleGroup;

    const B = (w, h, d, m) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);

    // receiver + rail
    const receiver = B(0.055, 0.075, 0.30, gunmetal); muzzleGroup.add(receiver);
    const rail = B(0.032, 0.014, 0.34, dark); rail.position.set(0, 0.045, -0.02); muzzleGroup.add(rail);
    // barrel + muzzle device
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.0105, 0.0115, 0.34, 10), gunmetal);
    barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 0.014, -0.31); muzzleGroup.add(barrel);
    const muzzle = B(0.027, 0.032, 0.055, dark); muzzle.position.set(0, 0.014, -0.495); muzzleGroup.add(muzzle);
    // handguard
    const hg = B(0.052, 0.056, 0.21, gunmetal); hg.position.set(0, 0.006, -0.20); muzzleGroup.add(hg);
    // stock + cheek riser
    const stock = B(0.05, 0.085, 0.17, polymer); stock.position.set(0, -0.012, 0.22); muzzleGroup.add(stock);
    const cheek = B(0.042, 0.028, 0.10, polymer); cheek.position.set(0, 0.035, 0.20); muzzleGroup.add(cheek);
    // grip
    const grip = B(0.036, 0.095, 0.05, polymer);
    grip.position.set(0, -0.08, 0.07); grip.rotation.x = 0.28; muzzleGroup.add(grip);
    // trigger guard
    const tg = B(0.03, 0.012, 0.075, dark); tg.position.set(0, -0.052, 0.02); muzzleGroup.add(tg);

    // magazine (old + new, for reload choreography)
    this.magOld = new THREE.Group();
    const m1 = B(0.044, 0.155, 0.062, this._mat(0x2c3038, 0.7, 0.45));
    const m1b = B(0.046, 0.03, 0.064, dark); m1b.position.y = -0.08;
    this.magOld.add(m1, m1b);
    this.magOld.position.set(0, -0.115, -0.02); this.magOld.rotation.x = 0.14;
    muzzleGroup.add(this.magOld);
    this.magNew = this.magOld.clone();
    this.magNew.visible = false;
    muzzleGroup.add(this.magNew);

    // bolt / charging handle
    this.bolt = new THREE.Group();
    const bh = B(0.018, 0.016, 0.05, dark);
    const bk = B(0.014, 0.03, 0.014, dark); bk.position.set(0, -0.012, 0.02);
    this.bolt.add(bh, bk);
    this.bolt.position.set(0.02, 0.052, 0.10);
    muzzleGroup.add(this.bolt);

    // red-dot sight: thin ring housing + clear window (A2). Dot itself is a
    // camera-anchored sprite so it can never drift off the boresight axis.
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.030, 0.0042, 8, 24), dark);
    ring.position.set(0, 0.088, 0.01); muzzleGroup.add(ring);
    const glass = new THREE.Mesh(
      new THREE.CircleGeometry(0.027, 20),
      new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.055, depthWrite: false })
    );
    glass.position.set(0, 0.088, 0.01); muzzleGroup.add(glass);
    const mount = B(0.02, 0.03, 0.06, dark); mount.position.set(0, 0.06, 0.01); muzzleGroup.add(mount);

    // hands + forearms (move with the gun as one mass)
    const rHand = B(0.052, 0.06, 0.062, skin); rHand.position.set(0, -0.095, 0.075); muzzleGroup.add(rHand);
    const rArm = B(0.05, 0.05, 0.24, sleeve);
    rArm.position.set(0.05, -0.13, 0.20); rArm.rotation.set(0.35, -0.25, 0); muzzleGroup.add(rArm);
    const lHand = B(0.056, 0.05, 0.075, skin); lHand.position.set(0, -0.035, -0.185); muzzleGroup.add(lHand);
    const lArm = B(0.048, 0.048, 0.26, sleeve);
    lArm.position.set(-0.09, -0.075, -0.09); lArm.rotation.set(0.15, 0.55, 0.1); muzzleGroup.add(lArm);

    // muzzle flash anchor + ejection port anchor + camera-anchored red dot
    this.muzzleAnchor = new THREE.Object3D();
    this.muzzleAnchor.position.set(0, 0.014, -0.53);
    muzzleGroup.add(this.muzzleAnchor);
    this.portAnchor = new THREE.Object3D();
    this.portAnchor.position.set(0.03, 0.055, -0.04);
    muzzleGroup.add(this.portAnchor);

    this.dot = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeDotTexture(), transparent: true, opacity: 0, depthTest: false, depthWrite: false,
    }));
    this.dot.scale.setScalar(0.0075);
    this.dot.position.set(0, 0, -0.34);
    this.dot.renderOrder = 999;
    this.camera.add(this.dot);
    this.camera.add(root);
  }

  magSlam() { this.nudge.impulse(1.9); }

  getMuzzleWorld(out) { return this.muzzleAnchor.getWorldPosition(out); }
  getPortWorld(out) { return this.portAnchor.getWorldPosition(out); }

  // Fixed-step pose capture. ctx: weapon systems (already updated this step).
  update(dt, ctx) {
    const T = TUNING;
    const ads = ctx.ads.value;
    const adsE = ads * ads * (3 - 2 * ads); // smoothstep on the blend
    const rel = ctx.reload.cur;
    const motionW = 1 - (1 - T.RELOAD_MOTION_WEIGHT) * rel.w;
    const swayW = 1 - (1 - T.RELOAD_SWAY_WEIGHT) * rel.w;
    const mo = ctx.motion.out;
    const sw = ctx.sway.out;
    const kick = ctx.recoil.gunKick();

    this.nudge.update(dt);
    const p = this.poseCur;
    // 1. base pose -> 2. ADS blend
    p.px = lerp(T.HIP_POS[0], T.ADS_POS[0], adsE);
    p.py = lerp(T.HIP_POS[1], T.ADS_POS[1], adsE);
    p.pz = lerp(T.HIP_POS[2], T.ADS_POS[2], adsE);
    p.rx = lerp(T.HIP_ROT[0], T.ADS_ROT[0], adsE);
    p.ry = lerp(T.HIP_ROT[1], T.ADS_ROT[1], adsE);
    p.rz = lerp(T.HIP_ROT[2], T.ADS_ROT[2], adsE);
    // 3. movement motion (reduced under reload, R4)
    p.px += mo.x * motionW; p.py += mo.y * motionW; p.pz += mo.z * motionW;
    p.rx += mo.rx * motionW; p.ry += mo.ry * motionW; p.rz += mo.rz * motionW;
    // reload offsets ride on top of the root (choreography layer, S12 last)
    p.px += rel.gx; p.py += rel.gy + this.nudge.value; p.pz += rel.gz;
    p.rx += rel.grx; p.rz += rel.grz;
    // 4. look-lag (S1-S5): rotation about the stock pivot + mass shift
    p.srx = sw.pitch * swayW; p.sry = sw.yaw * swayW; p.srz = sw.roll * swayW;
    p.sx = sw.x * swayW; p.sy = sw.y * swayW;
    p.muz = sw.muzzle * swayW;
    // 5. recoil (separate from camera kick, F2)
    p.grx = kick.pitch; p.gry = kick.yaw; p.grz = kick.roll * 0.35;
    p.gz = kick.z; p.gy = 0; p.gx = 0;
    // 6. reload timeline articulation
    p.magOldY = rel.magOldY; p.magOldRZ = rel.magOldRZ;
    p.magNewY = rel.magNewY; p.magNewRZ = rel.magNewRZ;
    p.boltZ = rel.boltZ;
    p.nudge = this.nudge.value;
    // red dot fades in as the sight reaches the eye (A2)
    this.dot.material.opacity = smoothstep01((ads - 0.55) / 0.4) * 0.95;
  }

  // Interpolated apply at render (C7).
  compose(alpha) {
    const a = this.posePrev, b = this.poseCur;
    const v = this._v;
    for (const k in b) v[k] = a[k] + (b[k] - a[k]) * alpha;
    this.root.position.set(v.px, v.py, v.pz);
    this.root.rotation.set(v.rx, v.ry, v.rz);
    this.swayGroup.position.set(TUNING.PIVOT[0] + v.sx, TUNING.PIVOT[1] + v.sy, TUNING.PIVOT[2]);
    this.swayGroup.rotation.set(v.srx, v.sry, v.srz);
    this.muzzleGroup.rotation.set(v.muz, v.muz * 0.4, 0);
    this.gun.rotation.set(v.grx, v.gry, v.grz);
    this.gun.position.set(-TUNING.PIVOT[0] + v.gx, -TUNING.PIVOT[1] + v.gy + v.nudge, -TUNING.PIVOT[2] + v.gz);
    this.magOld.position.y = -0.115 + v.magOldY;
    this.magOld.rotation.set(0.14, 0, v.magOldRZ);
    this.magNew.position.y = -0.115 + v.magNewY;
    this.magNew.rotation.set(0.14, 0, v.magNewRZ);
    this.bolt.position.z = 0.10 + v.boltZ;
    // swap prev for the next frame
    const t = this.posePrev; this.posePrev = this.poseCur; this.poseCur = t;
  }

  resetPose() {
    for (const k of this._keys()) { this.posePrev[k] = 0; this.poseCur[k] = 0; }
    this.nudge.set(0);
  }
}

function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255,64,54,1)');
  grad.addColorStop(0.18, 'rgba(255,40,30,0.95)');
  grad.addColorStop(0.4, 'rgba(255,40,30,0.28)');
  grad.addColorStop(1, 'rgba(255,40,30,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
