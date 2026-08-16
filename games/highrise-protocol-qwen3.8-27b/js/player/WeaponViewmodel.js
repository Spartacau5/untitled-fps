import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { makeConcrete, makeMetal } from '../engine/Textures.js';
import { Spring, Spring2 } from '../core/Spring.js';
import { clamp, lerp, damp, softClamp } from '../core/Easing.js';
import { CFG } from '../core/Config.js';

// F7/R/A/C: detailed AR-15 viewmodel (FDE, M-LOK handguard, PMAG with ribs,
// flip sights, close-mount RED-DOT COLLIMATOR with glass + LED dot,
// collapsible stock, animated bolt carrier).
// Static geometry is merged per material (few draw calls). All motion is
// spring/eased: idle sway, run bob, tac-sprint pump, per-shot recoil jump,
// camera-follow lag (viscosity), strafe drift, heat droop, landing dip,
// slide cant, 3-phase reload choreography with mag swap + bolt rack,
// inspect with bolt catch, dryfire bolt slam.
// C1: the red dot is the aim indicator. The optic's optical axis IS the
// aim line: the ADS pose is SOLVED so the sight anchor (the eye point, on
// the optical axis just behind the rear glass) lands on the camera's
// forward ray — the dot, fixed on the glass, sits on the line of fire by
// construction at any FOV, no pinning, no manual nudge. In hip the gun is
// carried canted and low; the dot rides the glass on the gun body.
const MAG_REST = { x: 0, y: -0.085, z: -0.055 }; // top of mag in magwell
const BOLT_REST = 0;
const DOT_PHYS = new THREE.Vector3(0, 0.063, -0.0125); // dot on the eyepiece glass
// ADS EYE RELIEF — real red-dot geometry: the eye sits ~10 cm behind the
// rear glass. The weapon measures only ~39 cm from the optic to the butt
// plate, so at 10 cm the stock falls BEHIND the camera and never renders;
// the handguard and barrel recede toward the target. (0.57 m was ~5x too
// large: it put the entire stock between the eye and the sight.)
const ADS_EYE_RELIEF = 0.10;
// dot sprite size: physical LED in hip; a tight LED IMAGE seen through the
// lens in ADS (blended by adsLevel in update)
const DOT_SCALE_HIP = 0.020;
const DOT_SCALE_ADS = 0.0045;
// look-lag pivot (reference: viewmodel.js PIVOT) — the gun rotates about a
// point just behind the grip, so flicks arc the muzzle, not the stock
const PIVOT = { x: 0, y: -0.012, z: 0.15 };
// ADS pivot: sits just behind the optic instead of behind the grip. In hip
// the gun is half a metre away and a shoulder-anchored pivot reads great;
// in ADS the eye is ~10 cm from the sight, and rotating about a point 15 cm
// BEHIND the camera swings the whole weapon across the frame. Pivoting near
// the sight turns the same kick into a barrel tip-up, which is what the
// shooter actually sees.
const PIVOT_ADS = { x: 0, y: 0.030, z: 0.020 };
// Hard caps on viewmodel recoil travel, hip → ADS. At 10 cm eye relief the
// gun is ~6x closer to the eye than in hip, so an identical centimetre of
// travel is a ~6x larger move on screen; without these caps sustained fire
// walks the springs up and throws the receiver into the lens.
// ADS caps are CoD-tight: while aiming, recoil the player FEELS comes from
// the camera aim-punch; the weapon itself only ticks — the dot must stay
// readable through a full-auto mag dump.
const KICK_MAX_HIP = 0.10, KICK_MAX_ADS = 0.006;   // push back (m)
const UP_MAX_HIP = 0.07, UP_MAX_ADS = 0.005;       // jump up (m)
const PITCH_MAX_HIP = 0.35, PITCH_MAX_ADS = 0.025; // barrel climb (rad)

// C1: red-dot LED glow — hot core falling off into a soft red halo.
function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const gr = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0.00, 'rgba(255,205,195,1)');
  gr.addColorStop(0.10, 'rgba(255,70,58,1)');
  gr.addColorStop(0.26, 'rgba(255,32,28,0.95)');
  gr.addColorStop(0.45, 'rgba(255,12,12,0.40)');
  gr.addColorStop(0.72, 'rgba(255,0,0,0.10)');
  gr.addColorStop(1.00, 'rgba(255,0,0,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export class WeaponViewmodel {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.group = new THREE.Group();
    camera.add(this.group);
    scene.add(camera); // ensure camera in graph for children

    // materials: FDE tan polymer, black polymer/steel, scratchy steel
    this.matFDE = new THREE.MeshStandardMaterial({
      map: makeConcrete('#c9a06a', [2, 2]), color: 0xf2d9b8,
      metalness: 0.12, roughness: 0.55, emissive: 0x14100a, emissiveIntensity: 0.45,
    });
    this.matDark = new THREE.MeshStandardMaterial({
      map: makeConcrete('#23262b', [2, 2]), color: 0xb8bcc4,
      metalness: 0.35, roughness: 0.45, emissive: 0x07080a, emissiveIntensity: 0.5,
    });
    this.matMetal = new THREE.MeshStandardMaterial({
      map: makeMetal('#a7adb6', [1, 1]), color: 0xffffff,
      metalness: 0.92, roughness: 0.32, emissive: 0x101216, emissiveIntensity: 0.5,
    });
    this.matMag = new THREE.MeshStandardMaterial({
      map: makeConcrete('#26292e', [2, 2]), color: 0xc8ccd4,
      metalness: 0.2, roughness: 0.6, emissive: 0x07080a, emissiveIntensity: 0.4,
    });
    // collimator glass (C1): the player looks THROUGH it, so it must read
    // as clear coated glass, not a frosted panel. Low opacity, no emissive
    // (emissive on a transparent element is what turns the window into a
    // milky rectangle), faint cool tint only.
    this.matGlass = new THREE.MeshPhysicalMaterial({
      color: 0xdff0f7, metalness: 0, roughness: 0.02,
      transparent: true, opacity: 0.07,
      clearcoat: 0.5, clearcoatRoughness: 0.03,
      side: THREE.DoubleSide, depthWrite: false,
    });
    // optic housing: gunmetal, a touch brighter than the gun's black so
    // the sight reads as a separate installed component
    this.matSight = new THREE.MeshStandardMaterial({
      map: makeConcrete('#4a5058', [2, 2]), color: 0xb4bcc8,
      metalness: 0.45, roughness: 0.42, emissive: 0x101318, emissiveIntensity: 0.28,
    });

    // muzzle anchor (must exist before _build uses it)
    this.muzzleLocal = new THREE.Vector3(0, 0, -0.815);
    this._build();

    // ---- SIGHT ANCHORS (named, rest frame) ----
    // rearSightAnchor: the point where the shooter's eye must sit to see
    // the reticle — centered on the optic's optical axis (y 0.063 = bore
    // line + ads offset), just behind the rear (eyepiece) glass. The ADS
    // solve aims THIS point at the camera. frontSightAnchor: the optical
    // axis at the front glass — the two must stack on the aim line.
    // They live on the root (rest frame), so the solve is stable and the
    // gun's transient motion (look-lag / kick) composes on top.
    this.rearSightAnchor = new THREE.Object3D();
    this.rearSightAnchor.name = 'rearSightAnchor';
    this.rearSightAnchor.position.set(0, 0.063, -0.014); // optical axis, eyepiece glass
    this.group.add(this.rearSightAnchor);
    this.frontSightAnchor = new THREE.Object3D();
    this.frontSightAnchor.name = 'frontSightAnchor';
    this.frontSightAnchor.position.set(0, 0.063, -0.066); // optical axis, front glass
    this.group.add(this.frontSightAnchor);
    this.sightAnchor = this.rearSightAnchor; // solve-facing alias
    // ---- MUZZLE ANCHOR (named): the tip of the barrel (rest frame) ----
    this.muzzleAnchor = new THREE.Object3D();
    this.muzzleAnchor.name = 'muzzleAnchor';
    this.muzzleAnchor.position.copy(this.muzzleLocal);
    this.group.add(this.muzzleAnchor);

    // ---- ADS POSE: SOLVED from the rear sight anchor, never hand-typed
    // (see _solveADS). Eye relief is real red-dot geometry (ADS_EYE_RELIEF
    // ≈ 0.10 m) — at this distance the stock ends up behind the camera.
    this.adsPos = new THREE.Vector3();
    this.adsQuat = new THREE.Quaternion();
    this.eyeRelief = ADS_EYE_RELIEF;
    this._v1 = new THREE.Vector3();
    this._v2 = new THREE.Vector3();
    this._qA = new THREE.Quaternion();
    this._solveADS();
    // ---- HIP POSE: a different pose, not a translation of the ADS pose —
    // carried low, offset right, canted inward, muzzle angled down,
    // body/receiver visible. ADS: rolled upright, squared to the camera,
    // the optic — not the receiver — centered, most of the body dropped
    // below the frame. The blend interpolates FULL transforms (position +
    // rotation), so hip and ADS read as two distinct actions.
    this.hipPos = new THREE.Vector3(0.25, -0.24, -0.56);
    this.hipQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.10, 0.06, 0.09));
    this._qBase = new THREE.Quaternion();
    this._qMotion = new THREE.Quaternion();
    this._eMotion = new THREE.Euler();

    // recoil springs: the gun visibly JUMPS on every shot — barrel climbs up
    // (pitch), pushes back toward the camera (z), and leaps up (y), then
    // springs back with a slight under-damped bounce.
    this.kick = new Spring(0, 180, 0.65);      // z offset (back)
    this.pitchKick = new Spring(0, 180, 0.55); // x rotation up (barrel climb)
    this.kickUp = new Spring(0, 180, 0.6);     // y offset (whole gun jumps up)
    this.rollSpring = new Spring2(0, 0, 300, 1.0);
    // bolt carrier micro-hop on every cycle (gas-driven bolt bounce)
    this.boltHop = new Spring(0, 400, 0.7);

    // ---- LOOK-LAG INERTIA (reference: sway.js) — the core of a "normal"
    // view. The camera leads directly; the gun is a heavy object that
    // TRAILS: raw mouse deltas feed underdamped springs (zeta < 1 => the
    // gun overshoots and micro-bounces as it catches up). A softer muzzle
    // spring whips the barrel, a roll spring banks the gun into turns, and
    // a positional spring sells the mass shift. In ADS the springs get
    // stiffer/damped and the amplitude is floored at 30% — the sight
    // trails and catches up faster; motion may shrink, it may never die.
    const L = CFG.lookLag;
    this.llYaw = new Spring(0, L.yaw.k, L.yaw.zeta);
    this.llPitch = new Spring(0, L.pitch.k, L.pitch.zeta);
    this.llMuzzle = new Spring(0, L.muzzle.k, L.muzzle.zeta);
    this.llRoll = new Spring(0, L.roll.k, L.roll.zeta);
    this.llPosX = new Spring(0, L.pos.k, L.pos.zeta);
    this._llRate = 0;                       // smoothed turn rate (rad/s)
    this._llOut = { yaw: 0, pitch: 0, roll: 0, muzzle: 0, x: 0, y: 0 };
    // strafe drift: gun leans with lateral velocity, sprung (delayed)
    this.strafeFollow = new Spring(0, 110, 0.8);
    // red-dot brightness pop when ADS engages (decays in update)
    this.adsPulse = 0;

    // reload state
    this.reload = null; // {phase, t, tactical, _f1.._f6}
    this.inspectT = -1;
    this.cant = 0;
    this.time = 0;
    this.onEvent = null; // (name) => sound, wired by Weapon
    this._snap = null;   // abort-return pose capture
    this._pose = { px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0, boltZ: 0,
                   mag1V: true, mag2V: false, mag2x: 0, mag2y: 0, mag2rx: 0, mag2rz: 0 };
    this._tmpPos = new THREE.Vector3();
  }

  // ADS pose solve — the reticle sits on the optical axis BY CONSTRUCTION.
  // The sight anchor must land on the camera's forward ray at the intended
  // eye relief, with the weapon's forward axis parallel to the camera
  // forward. The group is a child of the camera, so the pose is expressed
  // in camera space (eye = origin, camera forward = (0,0,-1)).
  _solveADS() {
    const camFwd = this._v1.set(0, 0, -1);
    // weapon forward in the group's rest frame: the model is built with
    // the barrel along -Z (stock near the eye at +Z, muzzle far at -Z)
    const gunFwd = this._v2.set(0, 0, -1);
    // (1) rotation: align the weapon forward with the camera forward
    this._qA.setFromUnitVectors(gunFwd, camFwd);
    // (2) position: sightAnchor (rotated into the ADS frame) on the ray
    //     at eye relief
    this.adsPos.copy(camFwd).multiplyScalar(this.eyeRelief)
      .sub(this._v2.copy(this.sightAnchor.position).applyQuaternion(this._qA));
    this.adsQuat.copy(this._qA);
  }

  // Place the rotation pivot for this frame (hip → ADS) and hang the recoil
  // offsets off it. swayG holds the pivot, gunG cancels it, so the pair is
  // transform-neutral at rest — moving the pivot never moves the weapon,
  // it only changes what rotations do to it.
  _applyPivot(a01, upV = 0, backV = 0) {
    const px = lerp(PIVOT.x, PIVOT_ADS.x, a01);
    const py = lerp(PIVOT.y, PIVOT_ADS.y, a01);
    const pz = lerp(PIVOT.z, PIVOT_ADS.z, a01);
    this.swayG.position.set(px, py, pz);
    this.gunG.position.set(-px, -py + upV, -pz + backV);
  }

  // ---- geometry helpers (accumulate transformed primitive geoms) ----
  _box(arr, w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
    const g = new THREE.BoxGeometry(w, h, d);
    if (rx) g.rotateX(rx);
    if (ry) g.rotateY(ry);
    if (rz) g.rotateZ(rz);
    g.translate(x, y, z);
    arr.push(g);
  }
  _cyl(arr, rt, rb, len, x, y, z, rx = 0, ry = 0, rz = 0, seg = 12) {
    const g = new THREE.CylinderGeometry(rt, rb, len, seg);
    if (rz) g.rotateZ(rz);
    if (ry) g.rotateY(ry);
    if (rx) g.rotateX(rx);
    g.translate(x, y, z);
    arr.push(g);
  }
  _torus(arr, R, r, x, y, z, rx = 0, ry = 0, rz = 0) {
    const g = new THREE.TorusGeometry(R, r, 8, 18);
    if (rx) g.rotateX(rx);
    if (ry) g.rotateY(ry);
    if (rz) g.rotateZ(rz);
    g.translate(x, y, z);
    arr.push(g);
  }

  _build() {
    // ---- rig hierarchy (reference: viewmodel.js S12) ----
    // group  (root):  base pose + movement motion + look-lag mass shift
    //  └ swayG:  look-lag rotation about PIVOT (behind the grip)
    //     └ gunG:  recoil kick (barrel climb + punch back)
    //        └ whipG:  muzzle whip (softest spring, visible barrel whip)
    //  └ dot:  red-dot sprite (child of whipG, FIXED on the eyepiece
    //          glass). In ADS the solved root pose puts the optical axis
    //          on the camera's forward ray, so the dot is on the line of
    //          fire by construction — no per-frame pinning.
    this.swayG = new THREE.Group();
    this.swayG.position.set(PIVOT.x, PIVOT.y, PIVOT.z);
    this.group.add(this.swayG);
    this.gunG = new THREE.Group();
    this.gunG.position.set(-PIVOT.x, -PIVOT.y, -PIVOT.z);
    this.swayG.add(this.gunG);
    this.whipG = new THREE.Group();
    this.gunG.add(this.whipG);

    const fde = [], dark = [], steel = [], sight = [];
    const B = Math.PI / 2;

    // ================= FDE (tan) =================
    // upper + lower receivers
    this._box(fde, 0.054, 0.048, 0.24, 0, 0.024, -0.01);   // upper receiver
    this._box(fde, 0.050, 0.040, 0.055, 0, 0.020, -0.155); // upper front
    this._box(fde, 0.054, 0.055, 0.18, 0, -0.028, 0.015);  // lower receiver
    this._box(fde, 0.058, 0.052, 0.13, 0, -0.062, -0.055); // magwell
    // pistol grip (raked back)
    this._box(fde, 0.036, 0.100, 0.052, 0, -0.105, 0.062, -0.30);
    this._box(fde, 0.030, 0.018, 0.040, 0, -0.066, 0.048, -0.30); // grip ramp
    // buffer tube collar
    this._box(fde, 0.042, 0.042, 0.032, 0, -0.005, 0.115);
    // collapsible stock (Magpul-CTR style)
    this._box(fde, 0.030, 0.072, 0.140, 0, -0.002, 0.270, -0.06); // body
    this._box(fde, 0.028, 0.022, 0.110, 0, 0.042, 0.260, -0.06);  // cheek riser
    this._box(fde, 0.024, 0.016, 0.090, 0, -0.048, 0.270, -0.06); // lower web
    // M-LOK handguard
    this._box(fde, 0.060, 0.016, 0.440, 0, 0.040, -0.360);  // top rail
    this._box(fde, 0.060, 0.016, 0.440, 0, -0.040, -0.360); // bottom
    this._box(fde, 0.005, 0.072, 0.440, 0.0305, 0, -0.360); // side plate R
    this._box(fde, 0.005, 0.072, 0.440, -0.0305, 0, -0.360);// side plate L
    // gas block
    this._box(fde, 0.032, 0.032, 0.024, 0, 0, -0.560);

    // ================= DARK (black) =================
    // M-LOK slots (two staggered rows per side)
    for (const s of [1, -1]) {
      for (const z of [-0.22, -0.34, -0.46])
        this._box(dark, 0.004, 0.010, 0.056, s * 0.0328, -0.006, z);
      for (const z of [-0.28, -0.40])
        this._box(dark, 0.004, 0.010, 0.056, s * 0.0328, 0.018, z);
    }
    // Picatinny teeth: upper receiver + handguard
    {
      let z = -0.125;
      while (z < 0.11) { this._box(dark, 0.046, 0.006, 0.011, 0, 0.051, z); z += 0.017; }
      z = -0.155;
      while (z < -0.575) { this._box(dark, 0.046, 0.006, 0.011, 0, 0.051, z); z += 0.017; }
    }
    // backup iron sights — FOLDED FLAT (an optic is mounted; deployed
    // irons would sit exactly on the optical axis and block the center of
    // the red-dot window — the "hump" bug). Low-profile nubs on the rail.
    this._box(dark, 0.030, 0.008, 0.022, 0, 0.048, -0.545); // front base, folded
    this._box(dark, 0.034, 0.008, 0.030, 0, 0.048, -0.115); // rear base, folded
    // collimator (C1) — close-mount red dot, eyepiece TOWARD the player,
    // window centered on the aim line (y 0.063 = bore line + ads offset).
    // Open tube: the player looks through the eyepiece window, down the
    // bore, and out the front window at the scene (depth cue). The dot
    // image sits on the eyepiece glass.
    this._box(sight, 0.040, 0.007, 0.056, 0, 0.0455, -0.040);            // foot clamp on the rail
    // tube — open bore 4.6 x 2.6 cm, centered on the aim line (y 0.063).
    // The window is deliberately wider than a realistic optic: the player
    // must SEE the target, and a scale-accurate tube at 10 cm eye relief
    // reads as a peephole. Walls stay thin for the same reason.
    this._box(sight, 0.060, 0.007, 0.052, 0, 0.0795, -0.040);            // tube — top wall
    this._box(sight, 0.060, 0.007, 0.052, 0, 0.0465, -0.040);            // tube — bottom wall
    this._box(sight, 0.007, 0.033, 0.052, -0.0265, 0.0630, -0.040);      // tube — left wall
    this._box(sight, 0.007, 0.033, 0.052, 0.0265, 0.0630, -0.040);       // tube — right wall
    this._box(sight, 0.054, 0.006, 0.044, 0, 0.0865, -0.040);            // top cover
    // eyepiece frame (player side) — thin lip flush with the tube walls,
    // the opening IS the bore: a clean wide window
    this._box(sight, 0.060, 0.004, 0.006, 0, 0.0780, -0.014);            // eyepiece frame — top
    this._box(sight, 0.060, 0.004, 0.006, 0, 0.0480, -0.014);            // eyepiece frame — bottom
    this._box(sight, 0.005, 0.034, 0.006, -0.0275, 0.0630, -0.014);      // eyepiece frame — left
    this._box(sight, 0.005, 0.034, 0.006, 0.0275, 0.0630, -0.014);       // eyepiece frame — right
    // front frame (target side)
    this._box(sight, 0.060, 0.004, 0.006, 0, 0.0780, -0.066);            // front frame — top
    this._box(sight, 0.060, 0.004, 0.006, 0, 0.0480, -0.066);            // front frame — bottom
    this._box(sight, 0.005, 0.034, 0.006, -0.0275, 0.0630, -0.066);      // front frame — left
    this._box(sight, 0.005, 0.034, 0.006, 0.0275, 0.0630, -0.066);       // front frame — right
    // NOTE: no backing disc behind the front element. A solid disc there
    // plugs the tube and is why the sight used to look like frosted glass.
    this._cyl(sight, 0.005, 0.005, 0.007, 0.0335, 0.0630, -0.030, 0, 0, B);   // windage turret R
    this._cyl(sight, 0.005, 0.005, 0.007, -0.0335, 0.0630, -0.030, 0, 0, B);  // windage turret L
    this._cyl(sight, 0.005, 0.005, 0.007, 0, 0.0925, -0.040);            // elevation turret
    // trigger guard + trigger
    this._box(dark, 0.006, 0.052, 0.007, 0, -0.072, -0.092);
    this._box(dark, 0.006, 0.006, 0.052, 0, -0.098, -0.066);
    this._box(dark, 0.008, 0.030, 0.011, 0, -0.075, -0.052, 0.3);
    // stock details
    this._box(dark, 0.028, 0.088, 0.012, 0, -0.002, 0.345, -0.06); // butt plate
    this._box(dark, 0.004, 0.030, 0.060, 0.017, -0.008, 0.280);    // cutout R
    this._box(dark, 0.004, 0.030, 0.060, -0.017, -0.008, 0.280);   // cutout L
    this._cyl(dark, 0.007, 0.007, 0.006, 0.018, 0.020, 0.210, 0, 0, B); // adj button R
    this._cyl(dark, 0.007, 0.007, 0.006, -0.018, 0.020, 0.210, 0, 0, B); // adj button L
    // sling mount
    this._torus(dark, 0.013, 0.0045, 0, -0.048, -0.500, B);
    // forward assist + ejection port cover (right side, seen on lag swings)
    this._box(dark, 0.007, 0.014, 0.024, 0.0305, 0.008, -0.160);
    this._box(dark, 0.004, 0.008, 0.016, 0.0350, 0.008, -0.160);
    this._box(dark, 0.003, 0.032, 0.055, 0.0285, 0.020, -0.060);
    // flash hider slots
    this._box(dark, 0.003, 0.003, 0.030, 0, 0.0165, -0.783);
    this._box(dark, 0.003, 0.003, 0.030, 0, -0.0165, -0.783);
    this._box(dark, 0.003, 0.003, 0.030, 0.0165, 0, -0.783);
    this._box(dark, 0.003, 0.003, 0.030, -0.0165, 0, -0.783);
    // receiver pins (full width)
    this._cyl(dark, 0.004, 0.004, 0.058, 0, 0.015, -0.115, 0, 0, B);
    this._cyl(dark, 0.004, 0.004, 0.058, 0, -0.015, 0.070, 0, 0, B);
    this._cyl(dark, 0.004, 0.004, 0.054, 0, -0.050, -0.020, 0, 0, B);
    // mag release + bolt catch levers
    this._cyl(dark, 0.006, 0.006, 0.010, 0.030, -0.040, -0.075, 0, 0, B);
    this._box(dark, 0.005, 0.008, 0.020, 0.030, 0.006, 0.015);

    // ================= STEEL =================
    this._cyl(steel, 0.013, 0.013, 0.190, 0, 0, -0.665, B);       // barrel
    this._cyl(steel, 0.0165, 0.0165, 0.055, 0, 0, -0.783, B);     // flash hider
    this._cyl(steel, 0.019, 0.019, 0.150, 0, -0.005, 0.185, B);   // buffer tube
    this._cyl(steel, 0.011, 0.013, 0.020, 0, 0, -0.560, B);       // gas block core

    // ---- merged static meshes (few draw calls), NAMED for diagnostics
    // (the A4 sight-line clearance check logs the offending part) ----
    const mk = (arr, mat, name) => {
      const merged = mergeGeometries(arr, false);
      const m = new THREE.Mesh(merged, mat);
      m.name = name;
      m.castShadow = false; m.receiveShadow = false;
      this.whipG.add(m); // whole gun rides the whip node (reference)
      for (const g of arr) g.dispose();
      return m;
    };
    this.meshFDE = mk(fde, this.matFDE, 'FDE body');
    this.meshDark = mk(dark, this.matDark, 'dark details');
    this.meshSteel = mk(steel, this.matMetal, 'barrel/steel');
    this.meshSight = mk(sight, this.matSight, 'sight housing');

    // ---- animated: magazine (PMAG with ribs, origin at mag top) ----
    const magG = [];
    this._box(magG, 0.052, 0.130, 0.090, 0, -0.065, 0);
    for (const y of [-0.035, -0.07, -0.105, -0.14])
      this._box(magG, 0.055, 0.008, 0.092, 0, y, 0); // ribs
    this._box(magG, 0.050, 0.014, 0.086, 0, -0.140, 0); // base plate
    this._box(magG, 0.040, 0.012, 0.030, 0, -0.005, -0.028); // feed lips
    const magMerged = mergeGeometries(magG, false);
    this.mag = new THREE.Mesh(magMerged, this.matMag);
    for (const g of magG) g.dispose();
    this.mag.position.set(MAG_REST.x, MAG_REST.y, MAG_REST.z);
    this.whipG.add(this.mag);
    // spare mag (ejects / rises from below)
    this.mag2 = this.mag.clone();
    this.mag2.visible = false;
    this.whipG.add(this.mag2);

    // ---- animated: bolt carrier + charging handle (racks on reload) ----
    const boltG = [];
    this._box(boltG, 0.030, 0.034, 0.110, 0, 0.034, -0.020);   // carrier body
    this._box(boltG, 0.020, 0.020, 0.020, 0, 0.034, -0.082);   // bolt nose
    this._box(boltG, 0.016, 0.014, 0.050, 0, 0.052, 0.015);    // handle
    this._box(boltG, 0.008, 0.008, 0.020, 0.014, 0.052, 0.015);
    this._box(boltG, 0.008, 0.008, 0.020, -0.014, 0.052, 0.015);
    const boltMerged = mergeGeometries(boltG, false);
    this.bolt = new THREE.Mesh(boltMerged, this.matMetal);
    for (const g of boltG) g.dispose();
    this.bolt.position.z = BOLT_REST;
    this.whipG.add(this.bolt);

    // ---- collimator glass (C1): eyepiece + front elements, one mesh ----
    // Flat panes matched to the rectangular bore — a round disc inside a
    // rectangular tube leaves clipped edges that read as a dirty lens.
    const glass = [];
    this._box(glass, 0.046, 0.026, 0.0012, 0, 0.0630, -0.0140);  // eyepiece element
    this._box(glass, 0.046, 0.026, 0.0012, 0, 0.0630, -0.0660);  // front element
    const glassMerged = mergeGeometries(glass, false);
    this.glassMesh = new THREE.Mesh(glassMerged, this.matGlass);
    for (const g of glass) g.dispose();
    this.whipG.add(this.glassMesh);

    this.mag.name = 'magazine';
    this.mag2.name = 'spare magazine';
    this.bolt.name = 'bolt carrier';
    this.glassMesh.name = 'sight glass';
    // ---- opaque occluder parts for the A4 sight-line clearance check
    // (the glass is transparent — you look THROUGH it — and the dot is
    // the reticle itself; both are excluded by design)
    this.sightParts = [this.meshFDE, this.meshDark, this.meshSteel,
      this.meshSight, this.mag, this.bolt];
    // ---- red dot (C1): glowing LED FIXED on the eyepiece glass.
    // Billboarded sprite so it always reads as a flat reticle image. Its
    // position never changes after build — the sight, not the dot, moves
    // (solved ADS pose + look-lag + kick), so the dot can never be a
    // decoupled HUD sticker.
    this.dot = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeDotTexture(),
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, toneMapped: false,
    }));
    this.dot.scale.set(0.020, 0.020, 1);
    this.dot.position.copy(DOT_PHYS);
    this.whipG.add(this.dot);

    // muzzle anchor (dynamic — tracks the whip for flash/tracers)
    this.muzzle = new THREE.Object3D();
    this.muzzle.name = 'muzzle';
    this.muzzle.position.copy(this.muzzleLocal);
    this.whipG.add(this.muzzle);

    // ---- render layer: the WHOLE viewmodel (incl. dot + glass) lives on
    // LAYER 1. The world camera (layer 0) never draws it; a dedicated
    // viewmodel pass with its own camera (near 0.01, fixed fov,
    // independent of the world zoom) renders it on top every frame
    // (see Renderer.ViewmodelPass).
    this.group.traverse((o) => o.layers.set(1));
  }

  // World position of the muzzle (for flash / tracers).
  muzzleWorld(out) { return this.muzzle.getWorldPosition(out); }

  startReload(tactical) {
    this.reload = { phase: 1, t: 0, tactical, _f1: 0, _f2: 0, _f3: 0, _f4: 0, _f5: 0, _f6: 0 };
  }
  // Sprint-cancel (R3): capture the current pose and ease it back over
  // ~160ms — no frozen frame, no stuck bolt.
  cancelReload() {
    if (!this.reload) return;
    const ro = this._reloadPose();
    this._snap = {
      px: ro.px, py: ro.py, pz: ro.pz,
      rx: ro.rx, ry: ro.ry, rz: ro.rz,
      boltZ: ro.boltZ, t: 0,
    };
    this.reload = null;
  }
  // Empty-chamber bolt slam (dryfire).
  dryfireBolt() { this.boltHop.addImpulse(-2.2); }

  startInspect() { if (this.inspectT < 0) this.inspectT = 0; }

  // r: player. dt = scaled (choreography), rawDt = real time (springs/feel).
  update(rawDt, dt, player, adsLevel, firingHeat) {
    this.time += rawDt;
    const r = this.reload;
    this.adsL = adsLevel;
    const a = adsLevel;

    // base hip→ADS (A1: ~150ms): blend FULL transforms — hip and ADS are
    // two different poses (carried/canted vs squared/optic-centered), not
    // a translation. The ADS pose is re-solved from the sight anchor each
    // frame (inputs are constant; the solve is cheap and self-healing).
    this._solveADS();
    const a01 = clamp(a, 0, 1);
    const basePos = this._tmpPos.lerpVectors(this.hipPos, this.adsPos, a01);
    this._qBase.slerpQuaternions(this.hipQuat, this.adsQuat, a01);

    // idle sway (breathing) — suppressed in ADS (a can overshoot >1)
    const breathe = Math.max(0, 1 - a) * (0.5 + firingHeat * 0.5);
    const swayX = Math.sin(this.time * 1.6) * 0.004 * breathe;
    const swayY = Math.cos(this.time * 1.2) * 0.005 * breathe;
    const swayZ = Math.sin(this.time * 0.9) * 0.002 * breathe;

    // hip↔ADS lift: mid-transition the gun swoops up a beat higher and
    // settles — the transition reads as a motion, not a fade
    const arc = a * (1 - a) * 4;
    // held-aim micro-breathing (kicks in over the last 30% of the transition)
    const ab = Math.max(0, (a - 0.7) / 0.3);

    // run bob — scaled by horizontal speed
    const spd = Math.hypot(player.vel.x, player.vel.z);
    const bobAmt = clamp(spd / 9, 0, 1.4) * (1 - a) * (player.onGround ? 1 : 0.3);
    const bobT = this.time * (spd * 1.4 + 2);
    const bobY = Math.sin(bobT * 2) * 0.012 * bobAmt;
    const bobX = Math.cos(bobT) * 0.008 * bobAmt;
    // tac-sprint pump (M2): weapon pumps with the arms, even faster
    const tacPump = player.tac ? Math.sin(bobT * 2.4) * 0.02 : 0;

    // slide cant (F7)
    this.cant += ((player.sliding ? -0.12 : 0) - this.cant) * Math.min(1, rawDt * 8);

    // landing dip (M1): weapon sinks and recovers
    const dip = player.landDip * 0.6;

    // recoil kick (spring)
    this.kick.update(rawDt);
    this.pitchKick.update(rawDt);
    this.kickUp.update(rawDt);
    this.boltHop.update(rawDt);
    // ADS: extra pull-to-zero on the barrel climb → controlled, faster
    // recovery while aiming (pleasant, not mushy). Exponential form so
    // the decay rate is frame-rate independent.
    if (a > 0.5) {
      this.pitchKick.value *= Math.exp(-7 * (a - 0.5) * 2 * rawDt);
    }

    // ---- look-lag inertia (reference: sway.js) — the camera leads, the
    // gun TRAILS: this frame's actual look deltas drive velocity impulses
    // into underdamped springs. Fast flick => dramatic drag + overshoot;
    // slow tracking => near-imperceptible drift. In ADS the springs get
    // stiffer/damped (faster, tighter catch-up) and amplitude floors at
    // 30% — the sight picture stays alive, never a locked tripod.
    const L = CFG.lookLag;
    const kMul = 1 + L.adsKMul * a01;
    const dMul = 1 + L.adsDMul * a01;
    // mirror the reference's k*damping scaling onto (stiffness, zeta)
    const tune = (s, ref) => { s.stiffness = ref.k * kMul; s.zeta = ref.zeta * dMul / Math.sqrt(kMul); };
    tune(this.llYaw, L.yaw); tune(this.llPitch, L.pitch);
    tune(this.llMuzzle, L.muzzle); tune(this.llRoll, L.roll); tune(this.llPosX, L.pos);
    const lyd = player.lookYawDelta, lpd = player.lookPitchDelta;
    this.llYaw.addImpulse(lyd * L.yaw.impulse);
    this.llPitch.addImpulse(lpd * L.pitch.impulse);
    this.llMuzzle.addImpulse(lyd * L.muzzle.impulse + lpd * L.muzzle.impulse * 0.6);
    // smoothed turn rate drives the bank-into-turn
    const instRate = Math.abs(lyd) > 1e-7 ? lyd / rawDt : 0;
    this._llRate = damp(this._llRate, clamp(instRate, -30, 30), L.roll.rateSmooth, rawDt);
    this.llRoll.target = softClamp(-this._llRate * L.roll.rateGain, L.roll.max);
    // positional mass shift follows the yaw drag
    this.llPosX.target = -this.llYaw.value * L.pos.gainX;
    this.llYaw.update(rawDt); this.llPitch.update(rawDt); this.llMuzzle.update(rawDt);
    this.llRoll.update(rawDt); this.llPosX.update(rawDt);
    // outputs: soft-clamped travel (tanh knee), ADS-floored amplitude
    const swayScale = clamp(lerp(1, L.adsFloor, a01), L.adsFloor, 1);
    const ll = this._llOut;
    ll.yaw = -softClamp(this.llYaw.value, L.yaw.max) * L.yaw.gain * swayScale;
    ll.pitch = -softClamp(this.llPitch.value, L.pitch.max) * L.pitch.gain * swayScale;
    ll.roll = this.llRoll.value * swayScale;
    ll.muzzle = -softClamp(this.llMuzzle.value, L.muzzle.max) * L.muzzle.gain * swayScale;
    ll.x = this.llPosX.value * swayScale;
    ll.y = -Math.abs(this.llPitch.value) * L.pos.gainY * swayScale;

    // strafe drift: gun leans with lateral velocity, sprung (delayed)
    const rvx = Math.cos(player.yaw), rvz = -Math.sin(player.yaw);
    const proj = player.vel.x * rvx + player.vel.z * rvz;
    this.strafeFollow.target = clamp(proj / 9, -1, 1) * 0.05 * (1 - a * 0.7);
    this.strafeFollow.update(rawDt);

    // sustained fire: hot barrel droops and jitters
    const droop = -firingHeat * 0.03 + firingHeat * Math.sin(this.time * 33.0) * 0.004;
    const hotRoll = firingHeat * Math.sin(this.time * 21.0) * 0.003;

    // ---- reload choreography / abort-return ----
    let ro = null;
    if (r) {
      this._updateReload(dt);   // advances state, fires sound events
      ro = this._reloadPose();
    } else if (this._snap) {
      this._snap.t += rawDt;
      const p = clamp(this._snap.t / 0.16, 0, 1);
      const sm = 1 - p * p * (3 - 2 * p); // smoothstep out
      ro = this._pose;
      ro.px = this._snap.px * sm; ro.py = this._snap.py * sm; ro.pz = 0;
      ro.rx = this._snap.rx * sm; ro.ry = this._snap.ry * sm; ro.rz = this._snap.rz * sm;
      ro.boltZ = this._snap.boltZ * sm;
      ro.mag1V = true; ro.mag2V = false;
      ro.mag2x = 0; ro.mag2y = 0; ro.mag2rx = 0; ro.mag2rz = 0;
      if (p >= 1) this._snap = null;
    }

    // ---- compose (fixed layer order, reference S12) ----
    // root: base pose -> movement motion -> look-lag mass shift -> reload
    // Positional motion is authored for the hip pose, where the gun is
    // ~0.56 m from the eye. In ADS it is ~0.09 m away, so the SAME
    // millimetre of travel swings the reticle ~6x further across the
    // screen. Scale positional motion by that ratio in ADS: the sight
    // picture stays as calm as the hip pose looks, while rotations keep
    // their full amplitude (their angular effect is distance-independent).
    const posScale = lerp(1, 0.16, a01);
    let px = basePos.x + (swayX + bobX + tacPump + this.strafeFollow.value
      + Math.sin(this.time * 0.7 + 1.3) * 0.0012 * ab + ll.x) * posScale;
    let py = basePos.y + (swayY + bobY - dip
      + arc * 0.02 + Math.sin(this.time * 1.1) * 0.0016 * ab + ll.y) * posScale;
    let pz = basePos.z + swayZ * posScale;
    // motion deltas only — the base pose (hip canted → ADS squared) comes
    // from the blended quaternions below
    let rx = tacPump * 1.5 + droop
      + arc * 0.04 + Math.sin(this.time * 0.9 + 0.5) * 0.0018 * ab;
    let ry = swayZ * 2;
    let rz = this.cant + swayX * 1.5 + this.strafeFollow.value * 0.9 + hotRoll
      + arc * 0.07 + Math.sin(this.time * 1.3 + 2.1) * 0.0015 * ab;

    if (ro) {
      px += ro.px; py += ro.py; pz += ro.pz;
      rx += ro.rx; ry += ro.ry; rz += ro.rz;
    }

    // ---- inspect (F7): turn, tilt, bolt caught back (ejection-port view) ----
    let inspectBolt = 0;
    if (this.inspectT >= 0) {
      this.inspectT += rawDt;
      const p = clamp(this.inspectT / 1.6, 0, 1);
      const e = Math.sin(p * Math.PI); // up and back
      px -= 0.12 * e; py += 0.06 * e; pz += 0.1 * e;
      ry += 0.5 * e; rz += 0.3 * e; rx += -0.2 * e;
      inspectBolt = 0.045 * e;
      if (p >= 1) this.inspectT = -1;
    }

    this.group.position.set(px, py, pz);
    // full-transform blend: base pose (hip→ADS) x motion deltas
    this._eMotion.set(rx, ry, rz);
    this._qMotion.setFromEuler(this._eMotion);
    this.group.quaternion.copy(this._qMotion).multiply(this._qBase);
    // sway: look-lag rotation about the stock pivot
    this.swayG.rotation.set(ll.pitch, ll.yaw, ll.roll);
    // gun: recoil kick — barrel climbs, gun twists with the side kick,
    // slams back into the shoulder and jumps up. Travel is hard-capped and
    // the pivot slides toward the optic as ADS engages, so aiming stays
    // readable no matter how long the trigger is held.
    const kPitch = clamp(this.pitchKick.value,
      -lerp(PITCH_MAX_HIP, PITCH_MAX_ADS, a01), lerp(PITCH_MAX_HIP, PITCH_MAX_ADS, a01));
    const kBack = clamp(this.kick.value,
      -lerp(KICK_MAX_HIP, KICK_MAX_ADS, a01), lerp(KICK_MAX_HIP, KICK_MAX_ADS, a01));
    const kUp = clamp(this.kickUp.value,
      -lerp(UP_MAX_HIP, UP_MAX_ADS, a01), lerp(UP_MAX_HIP, UP_MAX_ADS, a01));
    this.gunG.rotation.set(kPitch, this.rollSpring.x.value * (1 - a01 * 0.6), 0);
    this._applyPivot(a01, kUp, kBack);
    // whip: the softest spring — visible barrel whip on flicks
    this.whipG.rotation.set(ll.muzzle, ll.muzzle * 0.4, 0);

    // magazine transforms
    this.mag.visible = ro ? ro.mag1V : true;
    this.mag2.visible = ro ? ro.mag2V : false;
    this.mag2.position.set(
      MAG_REST.x + (ro ? ro.mag2x : 0),
      MAG_REST.y + (ro ? ro.mag2y : 0),
      MAG_REST.z
    );
    this.mag2.rotation.x = ro ? ro.mag2rx : 0;
    this.mag2.rotation.z = ro ? ro.mag2rz : 0;

    // bolt carrier: pose (rack) + per-shot hop + inspect catch
    this.bolt.position.z = (ro ? ro.boltZ : 0) + this.boltHop.value + inspectBolt;

    // ---- red dot (C1): fixed on the eyepiece glass (DOT_PHYS) — NO
    // pinning, NO nudge. In ADS the solved pose puts the optical axis on
    // the camera's forward ray, so the dot is on the line of fire by
    // construction at any FOV. It flinches with the gun's kick and
    // look-lag like a real sight (where the dot points, the next bullet
    // goes). In hip it rides the glass on the carried gun.
    this.adsPulse *= Math.exp(-rawDt * 10);
    const shimmer = Math.sin(this.time * 21.0) * 0.02 * (0.4 + a01);
    this.dot.material.opacity = clamp(0.35 + a01 * 0.55 + this.adsPulse * 0.6 + shimmer, 0, 1);
    // LED image size: a physical LED in hip, the tight image seen through
    // the lens in ADS (the eye is now ~10 cm behind the glass)
    const ds = lerp(DOT_SCALE_HIP, DOT_SCALE_ADS, a01);
    this.dot.scale.set(ds, ds, 1);
  }

  // Advance reload state; fire exact-beat sound events. Phase times (s):
  // P1 mag-out 0.5 → P2 mag-in 0.6 → P3 bolt 0.5. Tactical skips P3.
  _updateReload(dt) {
    const r = this.reload;
    if (!r) return;
    r.t += dt;
    const emit = (n) => { if (this.onEvent) this.onEvent(n); };
    if (r.phase === 1) {
      if (!r._f1 && r.t > 0.05) { r._f1 = 1; emit('magRelease'); }
      if (!r._f2 && r.t > 0.18) { r._f2 = 1; emit('magEject'); }
      if (r.t > 0.5) { r.phase = 2; r.t -= 0.5; } // carry the remainder
    } else if (r.phase === 2) {
      if (!r._f3 && r.t > 0.42) { r._f3 = 1; emit('magInsert'); }
      if (r.t > 0.6) {
        if (r.tactical) this.reload = null;
        else { r.phase = 3; r.t -= 0.6; } // carry the remainder
      }
    } else if (r.phase === 3) {
      if (!r._f4 && r.t > 0.10) { r._f4 = 1; emit('boltBack'); }
      if (!r._f5 && r.t > 0.32) { r._f5 = 1; emit('boltFwd'); }
      if (!r._f6 && r.t > 0.45) { r._f6 = 1; emit('reloadDone'); this.reload = null; }
    }
  }

  // Current reload pose (mutates this._pose; no allocation).
  _reloadPose() {
    const o = this._pose;
    o.px = 0; o.py = 0; o.pz = 0; o.rx = 0; o.ry = 0; o.rz = 0; o.boltZ = 0;
    o.mag1V = true; o.mag2V = false;
    o.mag2x = 0; o.mag2y = 0; o.mag2rx = 0; o.mag2rz = 0;
    const r = this.reload;
    if (!r) return o;
    const e = (t, d) => clamp(t / d, 0, 1);
    const sm = (x) => x * x * (3 - 2 * x);
    if (r.phase === 1) {
      // tip down-left, drop, present the magwell
      const p = e(r.t, 0.5), ev = sm(p);
      o.py = -0.055 * ev; o.rz = -0.16 * ev; o.rx = -0.05 * ev; o.ry = 0.05 * ev;
      if (r.t < 0.18) {
        // mag still seated
        o.mag1V = true; o.mag2V = false;
      } else {
        // mag pops out and tumbles down
        o.mag1V = false; o.mag2V = true;
        const m = e(r.t - 0.18, 0.32);
        o.mag2x = -0.26 * m;
        o.mag2y = -0.40 * m * m; // accelerating fall
        o.mag2rx = 1.5 * m;
        o.mag2rz = -0.55 * m;
      }
    } else if (r.phase === 2) {
      // hold the down-left stance; spare mag rises and slams home at t=0.42
      o.py = -0.055; o.rz = -0.16; o.rx = -0.05; o.ry = 0.05;
      if (r.t < 0.42) {
        const mi = e(r.t, 0.42), mie = mi * mi; // accelerating insertion
        o.mag1V = false; o.mag2V = true;
        o.mag2x = -0.26 + 0.26 * mie;
        o.mag2y = -0.40 + 0.40 * mie;
        o.mag2rx = 1.5 * (1 - mie);
        o.mag2rz = -0.55 * (1 - mie);
      } else {
        // slams in: old mag is gone (hidden), new mag shown in its place;
        // weapon kicks up slightly on the impact
        o.mag1V = true; o.mag2V = false;
        const k = Math.sin(e(r.t - 0.42, 0.18) * Math.PI);
        o.py += 0.018 * k; o.rz += 0.025 * k;
      }
    } else if (r.phase === 3) {
      // return to neutral; rack the bolt back, pause, snap forward
      const p = e(r.t, 0.5), ev = sm(p);
      o.py = -0.055 * (1 - ev); o.rz = -0.16 * (1 - ev);
      o.rx = -0.05 * (1 - ev); o.ry = 0.05 * (1 - ev);
      if (r.t <= 0.10) o.boltZ = 0;
      else if (r.t <= 0.22) o.boltZ = 0.06 * sm(e(r.t - 0.10, 0.12));
      else if (r.t <= 0.32) o.boltZ = 0.06;
      else o.boltZ = 0.06 * (1 - sm(e(r.t - 0.32, 0.08)));
    }
    return o;
  }

  // Fire impulse (F2): the gun JUMPS — barrel climbs up, whole viewmodel
  // pushes back and leaps up, then springs back with a bounce.
  // first=true → heavier. ADS keeps the climb but kills the wild parts:
  // no big jump-up, less shoulder roll, faster recovery (see update()).
  fireKick(first, sideSign, adsLevel = 0) {
    const a = clamp(adsLevel, 0, 1);
    const mul = first ? 1.6 : 1.0;
    // In ADS the weapon barely moves — CoD sells aimed recoil through the
    // camera aim-punch, not the viewmodel. Keep a tick of barrel climb for
    // life and drop everything else to near zero.
    this.pitchKick.addImpulse(3.0 * mul * (1 - a * 0.72));
    this.kick.addImpulse(1.5 * mul * (1 - a * 0.94));
    this.kickUp.addImpulse(1.1 * mul * (1 - a * 0.92));
    this.rollSpring.impulse(sideSign * 0.3 * mul * (1 - a * 0.75), 0);
    this.boltHop.addImpulse(0.8);          // bolt carrier bounce
  }

  // Re-sync after a match reset (kick springs + look-lag springs).
  resetKick() {
    this.kick.set(0);
    this.pitchKick.set(0);
    this.kickUp.set(0);
    this.rollSpring.set(0, 0);
    this.boltHop.set(0);
    this.strafeFollow.set(0);
    this._resetLookLag();
    this._snap = null;
  }
  resetFollow(yaw, pitch) { this._resetLookLag(); }
  _resetLookLag() {
    this.llYaw.set(0); this.llPitch.set(0); this.llMuzzle.set(0);
    this.llRoll.set(0); this.llPosX.set(0);
    this._llRate = 0;
    this.swayG.rotation.set(0, 0, 0);
    this.whipG.rotation.set(0, 0, 0);
    this.gunG.rotation.set(0, 0, 0);
    this._applyPivot(clamp(this.adsL || 0, 0, 1));
  }

  // A4 self-test: hold the solved ADS pose with all inner motion at rest.
  holdADSForTest() {
    this.adsL = 1;
    this.resetKick();
    this.group.position.copy(this.adsPos);
    this.group.quaternion.copy(this.adsQuat);
    this.swayG.rotation.set(0, 0, 0);
    this.gunG.rotation.set(0, 0, 0);
    this.whipG.rotation.set(0, 0, 0);
    this._applyPivot(1);
    this.bolt.position.z = BOLT_REST;
    this.group.updateMatrixWorld(true);
  }

  get adsLvl() { return this.adsL || 0; }
  dispose() {
    this.camera.remove(this.group);
  }
}
