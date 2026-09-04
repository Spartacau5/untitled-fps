import {
  AdditiveBlending,
  BoxGeometry,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Euler,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  PointLight,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector3,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { damp, easeOutCubic, rand, smooth01 } from "../core/mathx.js";
import {
  VM_ADS_OFFSET,
  VM_HIP_OFFSET,
  VM_SPRINT_OFFSET,
} from "../data/weapons.js";
import { EV_EJECT, EV_JUMP, EV_LAND, EV_SHOT } from "../sim/events.js";
import { NOISE_GLSL } from "./shaders/noise.glsl.js";

export const VIEWMODEL_MATS = {
  metal: new MeshStandardMaterial({
    color: 4014409,
    roughness: 0.38,
    metalness: 0.9,
  }),
  metalDark: new MeshStandardMaterial({
    color: 1711394,
    roughness: 0.46,
    metalness: 0.92,
  }),
  metalLight: new MeshStandardMaterial({
    color: 6054508,
    roughness: 0.32,
    metalness: 0.92,
  }),
  polymer: new MeshStandardMaterial({
    color: 1118741,
    roughness: 0.84,
    metalness: 0.1,
  }),
  polymer2: new MeshStandardMaterial({
    color: 1974566,
    roughness: 0.72,
    metalness: 0.2,
  }),
  accent: new MeshStandardMaterial({
    color: 0,
    emissive: 6222591,
    emissiveIntensity: 1.4,
    roughness: 0.5,
    metalness: 0,
  }),
  orange: new MeshStandardMaterial({
    color: 0,
    emissive: 16742938,
    emissiveIntensity: 1.4,
    roughness: 0.5,
    metalness: 0,
  }),
  white: new MeshStandardMaterial({
    color: 0,
    emissive: 16777215,
    emissiveIntensity: 4,
    roughness: 0.5,
    metalness: 0,
  }),
  glove: new MeshStandardMaterial({
    color: 1776672,
    roughness: 0.9,
    metalness: 0.05,
  }),
  sleeve: new MeshStandardMaterial({
    color: 2369325,
    roughness: 0.95,
    metalness: 0.02,
  }),
  tube: new MeshStandardMaterial({
    color: 1711394,
    roughness: 0.46,
    metalness: 0.92,
    side: DoubleSide,
  }),
};
export function box(i, t, e, n, s = 0, r = 0, a = 0, l = 0) {
  const o =
      l > 0 ? new RoundedBoxGeometry(i, t, e, 2, l) : new BoxGeometry(i, t, e),
    c = new Mesh(o, n);
  return (c.position.set(s, r, a), c);
}
export function cyl(i, t, e, n, s = 0, r = 0, a = 0, l = "z", o = 18, c = !1) {
  const h = new CylinderGeometry(i, t, e, o, 1, c);
  l === "z" ? h.rotateX(Math.PI / 2) : l === "x" && h.rotateZ(Math.PI / 2);
  const d = new Mesh(h, n);
  return (d.position.set(s, r, a), d);
}
export function sphere(i, t, e, n, s) {
  const r = new Mesh(new SphereGeometry(i, 12, 10), t);
  return (r.position.set(e, n, s), r);
}
export function tube(i, t, e, n, s) {
  const r = new Vector3(...i),
    a = new Vector3(...t),
    l = r.distanceTo(a),
    o = new CylinderGeometry(n, e, l, 14),
    c = new Mesh(o, s),
    h = a.clone().sub(r).normalize();
  return (
    c.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), h),
    c.position.copy(r).lerp(a, 0.5),
    c
  );
}
export function torus(i, t, e, n, s, r) {
  const a = new TorusGeometry(i, t, 8, 24),
    l = new Mesh(a, e);
  return (l.position.set(n, s, r), l);
}
export function makeRightHand(i, t = -0.3) {
  const e = new Group();
  (e.add(box(0.05, 0.085, 0.052, VIEWMODEL_MATS.glove, 0.004, 0, 0.026, 0.014)),
    e.add(
      box(0.05, 0.072, 0.028, VIEWMODEL_MATS.glove, 0, -0.012, -0.022, 0.01),
    ));
  for (let n = 0; n < 4; n++)
    e.add(
      box(
        0.05,
        0.014,
        0.03,
        VIEWMODEL_MATS.glove,
        0,
        0.02 - n * 0.017,
        -0.026,
        0.005,
      ),
    );
  return (
    e.add(
      box(0.018, 0.045, 0.02, VIEWMODEL_MATS.glove, -0.03, 0.03, 0.01, 0.006),
    ),
    e.add(
      tube(
        [0.01, -0.05, 0.05],
        [0.11, -0.3, 0.38],
        0.036,
        0.055,
        VIEWMODEL_MATS.sleeve,
      ),
    ),
    e.position.set(i[0], i[1], i[2]),
    (e.rotation.x = t),
    e
  );
}
export function makeLeftHand(i, t = [-0.13, -0.34, 0.24]) {
  const e = new Group();
  (e.add(
    box(0.05, 0.048, 0.088, VIEWMODEL_MATS.glove, -0.004, -0.032, 0, 0.014),
  ),
    e.add(
      box(0.02, 0.06, 0.084, VIEWMODEL_MATS.glove, 0.03, -0.004, 0, 0.008),
    ));
  for (let n = 0; n < 4; n++)
    e.add(
      box(
        0.016,
        0.028,
        0.017,
        VIEWMODEL_MATS.glove,
        0.036,
        0.025,
        -0.03 + n * 0.02,
        0.005,
      ),
    );
  return (
    e.add(
      box(0.02, 0.05, 0.028, VIEWMODEL_MATS.glove, -0.034, -0.002, 0.02, 0.007),
    ),
    e.add(tube([-0.01, -0.05, 0.02], t, 0.036, 0.055, VIEWMODEL_MATS.sleeve)),
    e.position.set(i[0], i[1], i[2]),
    e
  );
}
export function buildRifleModel(i) {
  const t = new Group(),
    e = {};
  (t.add(box(0.068, 0.07, 0.25, VIEWMODEL_MATS.metal, 0, 0.035, -0.03, 0.008)),
    t.add(
      box(0.062, 0.056, 0.17, VIEWMODEL_MATS.metalDark, 0, -0.025, 0, 0.006),
    ),
    t.add(box(0.024, 0.012, 0.25, VIEWMODEL_MATS.metalDark, 0, 0.076, -0.03)));
  for (let h = 0; h < 7; h++)
    t.add(
      box(0.026, 0.005, 0.012, VIEWMODEL_MATS.metal, 0, 0.084, 0.07 - h * 0.03),
    );
  (t.add(box(0.03, 0.018, 0.02, VIEWMODEL_MATS.metalLight, 0, 0.05, -0.15)),
    t.add(box(0.002, 0.008, 0.06, VIEWMODEL_MATS.accent, 0.0355, 0.03, -0.05)),
    t.add(
      box(0.002, 0.008, 0.06, VIEWMODEL_MATS.accent, -0.0355, 0.03, -0.05),
    ));
  const n = new Group();
  n.position.set(0, -0.05, -0.02);
  const s = box(
    0.04,
    0.17,
    0.07,
    VIEWMODEL_MATS.polymer2,
    0,
    -0.085,
    0.008,
    0.005,
  );
  ((s.rotation.x = 0.13), n.add(s));
  const r = box(0.043, 0.012, 0.074, VIEWMODEL_MATS.metalDark, 0, -0.17, 0.03);
  ((r.rotation.x = 0.13),
    n.add(r),
    n.add(box(0.041, 0.004, 0.071, VIEWMODEL_MATS.orange, 0, -0.06, 0.006)),
    t.add(n),
    (e.mag = n),
    (e.magRest = n.position.clone()));
  const a = box(
    0.032,
    0.105,
    0.046,
    VIEWMODEL_MATS.polymer,
    0,
    -0.1,
    0.078,
    0.007,
  );
  ((a.rotation.x = -0.32),
    t.add(a),
    t.add(box(0.006, 0.02, 0.008, VIEWMODEL_MATS.metalLight, 0, -0.06, 0.035)),
    t.add(box(0.004, 0.004, 0.06, VIEWMODEL_MATS.metalDark, 0, -0.072, 0.03)),
    t.add(cyl(0.017, 0.017, 0.2, VIEWMODEL_MATS.metalDark, 0, 0.022, 0.2)),
    t.add(box(0.046, 0.085, 0.13, VIEWMODEL_MATS.polymer, 0, 0, 0.31, 0.008)),
    t.add(
      box(0.05, 0.11, 0.025, VIEWMODEL_MATS.polymer2, 0, -0.004, 0.375, 0.006),
    ),
    t.add(
      box(0.056, 0.058, 0.3, VIEWMODEL_MATS.polymer2, 0, 0.034, -0.31, 0.008),
    ));
  for (let h = 0; h < 9; h++)
    t.add(
      box(
        0.062,
        0.005,
        0.012,
        VIEWMODEL_MATS.metalDark,
        0,
        0.065,
        -0.18 - h * 0.03,
      ),
    );
  for (let h = 0; h < 5; h++)
    (t.add(
      box(
        0.002,
        0.02,
        0.028,
        VIEWMODEL_MATS.metalDark,
        0.029,
        0.03,
        -0.22 - h * 0.04,
      ),
    ),
      t.add(
        box(
          0.002,
          0.02,
          0.028,
          VIEWMODEL_MATS.metalDark,
          -0.029,
          0.03,
          -0.22 - h * 0.04,
        ),
      ));
  (t.add(box(0.002, 0.005, 0.2, VIEWMODEL_MATS.accent, 0.0292, 0.048, -0.31)),
    t.add(cyl(0.011, 0.011, 0.3, VIEWMODEL_MATS.metal, 0, 0.034, -0.6)),
    t.add(cyl(0.015, 0.015, 0.03, VIEWMODEL_MATS.metalDark, 0, 0.034, -0.48)),
    t.add(cyl(0.016, 0.0145, 0.07, VIEWMODEL_MATS.metalDark, 0, 0.034, -0.77)));
  for (let h = 0; h < 3; h++)
    t.add(
      box(
        0.036,
        0.004,
        0.008,
        VIEWMODEL_MATS.polymer,
        0,
        0.034,
        -0.75 - h * 0.015,
      ),
    );
  ((e.muzzle = new Object3D()),
    e.muzzle.position.set(0, 0.034, -0.805),
    t.add(e.muzzle));
  const l = box(0.03, 0.026, 0.05, VIEWMODEL_MATS.metalLight, 0, 0.058, 0.1);
  (t.add(l),
    (e.bolt = l),
    (e.boltRest = 0.1),
    (e.boltTravel = 0.045),
    (e.eject = new Object3D()),
    e.eject.position.set(0.04, 0.045, -0.03),
    t.add(e.eject),
    t.add(
      box(0.03, 0.02, 0.05, VIEWMODEL_MATS.metalDark, 0, 0.093, -0.07, 0.004),
    ),
    t.add(
      box(0.012, 0.012, 0.014, VIEWMODEL_MATS.metalDark, 0, 0.108, -0.055),
    ));
  const o = cyl(
    0.02,
    0.02,
    0.036,
    VIEWMODEL_MATS.tube,
    0,
    0.122,
    -0.07,
    "z",
    28,
    !0,
  );
  (t.add(o),
    t.add(
      cyl(
        0.0225,
        0.0225,
        0.006,
        VIEWMODEL_MATS.metalDark,
        0,
        0.122,
        -0.089,
        "z",
        28,
        !0,
      ),
    ),
    t.add(
      cyl(
        0.0225,
        0.0225,
        0.006,
        VIEWMODEL_MATS.metalDark,
        0,
        0.122,
        -0.051,
        "z",
        28,
        !0,
      ),
    ),
    t.add(box(0.008, 0.006, 0.012, VIEWMODEL_MATS.orange, 0, 0.104, -0.075)));
  const c = new Mesh(new CircleGeometry(0.0195, 36), i);
  return (
    c.position.set(0, 0.122, -0.068),
    (c.renderOrder = 5),
    t.add(c),
    (e.lens = c),
    (e.sight = new Object3D()),
    e.sight.position.set(0, 0.122, -0.068),
    t.add(e.sight),
    (e.adsOffset = new Vector3(0, -0.122, -0.2)),
    (e.hipOffset = new Vector3(0.165, -0.165, -0.31)),
    (e.hipRot = new Euler(0, 0.035, 0.02)),
    (e.handR = makeRightHand([0.004, -0.11, 0.09])),
    t.add(e.handR),
    (e.handL = makeLeftHand([-0.002, -0.006, -0.3], [-0.13, -0.33, -0.02])),
    t.add(e.handL),
    (e.handLRest = e.handL.position.clone()),
    { group: t, parts: e }
  );
}
export function buildShotgunModel() {
  const i = new Group(),
    t = {};
  (i.add(box(0.058, 0.088, 0.24, VIEWMODEL_MATS.metal, 0, 0.022, -0.02, 0.008)),
    i.add(box(0.062, 0.04, 0.12, VIEWMODEL_MATS.metalDark, 0, -0.02, 0, 0.006)),
    i.add(
      box(0.002, 0.03, 0.08, VIEWMODEL_MATS.metalDark, 0.0295, 0.03, -0.02),
    ),
    i.add(box(0.002, 0.006, 0.09, VIEWMODEL_MATS.orange, -0.0295, 0.04, -0.03)),
    i.add(cyl(0.0125, 0.0125, 0.62, VIEWMODEL_MATS.metalDark, 0, 0.06, -0.43)),
    i.add(cyl(0.0115, 0.0115, 0.52, VIEWMODEL_MATS.metal, 0, 0.014, -0.38)),
    i.add(cyl(0.015, 0.015, 0.024, VIEWMODEL_MATS.metalDark, 0, 0.014, -0.65)),
    i.add(box(0.03, 0.062, 0.02, VIEWMODEL_MATS.metalDark, 0, 0.037, -0.6)),
    i.add(cyl(0.0145, 0.0145, 0.04, VIEWMODEL_MATS.metalLight, 0, 0.06, -0.73)),
    (t.muzzle = new Object3D()),
    t.muzzle.position.set(0, 0.06, -0.755),
    i.add(t.muzzle));
  const e = new Group();
  (e.position.set(0, 0.014, -0.34),
    e.add(box(0.05, 0.052, 0.16, VIEWMODEL_MATS.polymer2, 0, 0, 0, 0.01)));
  for (let a = 0; a < 5; a++)
    e.add(
      box(0.054, 0.006, 0.01, VIEWMODEL_MATS.metalDark, 0, 0, -0.06 + a * 0.03),
    );
  (i.add(e), (t.pump = e), (t.pumpRest = -0.34), (t.pumpTravel = 0.085));
  const n = box(
    0.05,
    0.1,
    0.25,
    VIEWMODEL_MATS.polymer,
    0,
    -0.018,
    0.255,
    0.01,
  );
  ((n.rotation.x = 0.06),
    i.add(n),
    i.add(
      box(0.056, 0.12, 0.03, VIEWMODEL_MATS.polymer2, 0, -0.03, 0.38, 0.006),
    ),
    i.add(box(0.04, 0.008, 0.16, VIEWMODEL_MATS.orange, 0, 0.04, 0.24)));
  const s = box(
    0.035,
    0.1,
    0.05,
    VIEWMODEL_MATS.polymer,
    0,
    -0.09,
    0.085,
    0.007,
  );
  ((s.rotation.x = -0.35),
    i.add(s),
    i.add(box(0.006, 0.02, 0.008, VIEWMODEL_MATS.metalLight, 0, -0.055, 0.04)),
    i.add(box(0.004, 0.004, 0.06, VIEWMODEL_MATS.metalDark, 0, -0.066, 0.04)),
    i.add(box(0.012, 0.012, 0.03, VIEWMODEL_MATS.metalDark, 0, 0.072, -0.7)),
    i.add(sphere(0.005, VIEWMODEL_MATS.white, 0, 0.081, -0.7)),
    i.add(box(0.022, 0.01, 0.024, VIEWMODEL_MATS.metalDark, 0, 0.07, -0.1)));
  const r = torus(0.0095, 0.0018, VIEWMODEL_MATS.metalDark, 0, 0.081, -0.1);
  return (
    i.add(r),
    i.add(
      box(0.003, 0.012, 0.004, VIEWMODEL_MATS.metalDark, 0.0128, 0.078, -0.1),
    ),
    i.add(
      box(0.003, 0.012, 0.004, VIEWMODEL_MATS.metalDark, -0.0128, 0.078, -0.1),
    ),
    (t.sight = new Object3D()),
    t.sight.position.set(0, 0.081, -0.1),
    i.add(t.sight),
    (t.adsOffset = new Vector3(0, -0.081, -0.14)),
    (t.hipOffset = new Vector3(0.17, -0.18, -0.3)),
    (t.hipRot = new Euler(0, 0.04, 0.03)),
    (t.eject = new Object3D()),
    t.eject.position.set(0.035, 0.03, -0.03),
    i.add(t.eject),
    (t.handR = makeRightHand([0.004, -0.1, 0.1], -0.35)),
    i.add(t.handR),
    (t.handL = makeLeftHand([-0.002, -0.028, 0], [-0.12, -0.33, 0.28])),
    e.add(t.handL),
    (t.handLRest = t.handL.position.clone()),
    { group: i, parts: t }
  );
}
export function buildDmrModel() {
  const i = new Group(),
    t = {};
  (i.add(box(0.07, 0.09, 0.32, VIEWMODEL_MATS.metal, 0, 0.02, -0.05, 0.008)),
    i.add(box(0.024, 0.012, 0.32, VIEWMODEL_MATS.metalDark, 0, 0.071, -0.05)));
  for (let l = 0; l < 9; l++)
    i.add(
      box(
        0.026,
        0.005,
        0.012,
        VIEWMODEL_MATS.metal,
        0,
        0.079,
        0.08 - l * 0.032,
      ),
    );
  (i.add(
    box(0.064, 0.05, 0.15, VIEWMODEL_MATS.metalDark, 0, -0.03, 0.02, 0.006),
  ),
    i.add(box(0.002, 0.01, 0.12, VIEWMODEL_MATS.orange, 0.0355, 0.03, -0.06)),
    i.add(box(0.002, 0.01, 0.12, VIEWMODEL_MATS.orange, -0.0355, 0.03, -0.06)),
    i.add(
      box(0.064, 0.068, 0.38, VIEWMODEL_MATS.polymer2, 0, 0.032, -0.41, 0.008),
    ));
  for (let l = 0; l < 8; l++)
    (i.add(
      box(
        0.002,
        0.03,
        0.02,
        VIEWMODEL_MATS.metalDark,
        0.033,
        0.03,
        -0.28 - l * 0.04,
      ),
    ),
      i.add(
        box(
          0.002,
          0.03,
          0.02,
          VIEWMODEL_MATS.metalDark,
          -0.033,
          0.03,
          -0.28 - l * 0.04,
        ),
      ),
      i.add(
        box(
          0.03,
          0.002,
          0.02,
          VIEWMODEL_MATS.metalDark,
          0,
          -0.003,
          -0.28 - l * 0.04,
        ),
      ));
  (i.add(box(0.002, 0.004, 0.3, VIEWMODEL_MATS.accent, 0.0332, 0.055, -0.4)),
    i.add(cyl(0.013, 0.013, 0.48, VIEWMODEL_MATS.metalDark, 0, 0.036, -0.82)),
    i.add(cyl(0.022, 0.019, 0.1, VIEWMODEL_MATS.metalDark, 0, 0.036, -1.06)));
  for (let l = 0; l < 4; l++)
    i.add(
      box(
        0.05,
        0.005,
        0.01,
        VIEWMODEL_MATS.polymer,
        0,
        0.036,
        -1.03 - l * 0.018,
      ),
    );
  ((t.muzzle = new Object3D()),
    t.muzzle.position.set(0, 0.036, -1.115),
    i.add(t.muzzle));
  const e = new Group();
  e.position.set(0, -0.04, -0.15);
  const n = box(
    0.042,
    0.13,
    0.1,
    VIEWMODEL_MATS.metalDark,
    0,
    -0.065,
    0.006,
    0.005,
  );
  ((n.rotation.x = 0.1), e.add(n));
  const s = box(0.045, 0.012, 0.104, VIEWMODEL_MATS.metal, 0, -0.13, 0.02);
  ((s.rotation.x = 0.1),
    e.add(s),
    i.add(e),
    (t.mag = e),
    (t.magRest = e.position.clone()));
  const r = box(
    0.034,
    0.105,
    0.05,
    VIEWMODEL_MATS.polymer,
    0,
    -0.1,
    0.07,
    0.007,
  );
  ((r.rotation.x = -0.3),
    i.add(r),
    i.add(box(0.006, 0.02, 0.008, VIEWMODEL_MATS.metalLight, 0, -0.06, 0.03)),
    i.add(box(0.004, 0.004, 0.06, VIEWMODEL_MATS.metalDark, 0, -0.075, 0.03)),
    i.add(box(0.05, 0.11, 0.3, VIEWMODEL_MATS.polymer, 0, -0.012, 0.29, 0.01)),
    i.add(
      box(0.046, 0.032, 0.15, VIEWMODEL_MATS.polymer2, 0, 0.06, 0.27, 0.008),
    ),
    i.add(
      box(0.056, 0.125, 0.03, VIEWMODEL_MATS.polymer2, 0, -0.02, 0.445, 0.006),
    ));
  const a = new Group();
  return (
    a.position.set(0, 0.048, 0.03),
    a.add(
      cyl(0.006, 0.006, 0.045, VIEWMODEL_MATS.metalLight, 0.055, 0, 0, "x"),
    ),
    a.add(sphere(0.011, VIEWMODEL_MATS.metalLight, 0.08, 0, 0)),
    i.add(a),
    (t.bolt = a),
    (t.boltRest = 0.03),
    (t.boltTravel = 0.07),
    (t.eject = new Object3D()),
    t.eject.position.set(0.04, 0.05, 0),
    i.add(t.eject),
    i.add(box(0.016, 0.012, 0.03, VIEWMODEL_MATS.metalDark, 0, 0.082, -0.76)),
    i.add(
      box(0.0045, 0.024, 0.0045, VIEWMODEL_MATS.metalDark, 0, 0.099, -0.76),
    ),
    i.add(sphere(0.0028, VIEWMODEL_MATS.white, 0, 0.1115, -0.76)),
    i.add(
      cyl(
        0.0175,
        0.0175,
        0.02,
        VIEWMODEL_MATS.tube,
        0,
        0.105,
        -0.76,
        "z",
        24,
        !0,
      ),
    ),
    i.add(box(0.032, 0.012, 0.03, VIEWMODEL_MATS.metalDark, 0, 0.078, -0.17)),
    i.add(box(0.014, 0.024, 0.016, VIEWMODEL_MATS.metalDark, 0, 0.094, -0.17)),
    i.add(torus(0.0125, 0.0025, VIEWMODEL_MATS.metalDark, 0, 0.1115, -0.17)),
    (t.sight = new Object3D()),
    t.sight.position.set(0, 0.1115, -0.17),
    i.add(t.sight),
    (t.adsOffset = new Vector3(0, -0.1115, -0.08)),
    (t.hipOffset = new Vector3(0.16, -0.165, -0.28)),
    (t.hipRot = new Euler(0, 0.03, 0.02)),
    (t.handR = makeRightHand([0.004, -0.115, 0.085])),
    i.add(t.handR),
    (t.handL = makeLeftHand([-0.002, -0.01, -0.4], [-0.13, -0.34, -0.1])),
    i.add(t.handL),
    (t.handLRest = t.handL.position.clone()),
    { group: i, parts: t }
  );
}
export function makeRedDotMaterial() {
  return new ShaderMaterial({
    transparent: !0,
    depthWrite: !1,
    side: DoubleSide,
    uniforms: {
      uSightPos: { value: new Vector3() },
      uSightFwd: { value: new Vector3(0, 0, -1) },
      uColor: { value: new Color(1, 0.12, 0.08) },
      uDotRadius: { value: 0.00115 },
      uTime: { value: 0 },
      uBright: { value: 1 },
    },
    vertexShader: `
      varying vec3 vWorldPos; varying vec3 vNormal; varying vec2 vUv;
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz; vNormal = normalize(mat3(modelMatrix) * normal); vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform vec3 uSightPos; uniform vec3 uSightFwd; uniform vec3 uColor; uniform float uDotRadius; uniform float uTime; uniform float uBright;
      varying vec3 vWorldPos; varying vec3 vNormal; varying vec2 vUv;
      void main(){
        float s = dot(uSightPos - cameraPosition, uSightFwd);
        vec3 dotPos = cameraPosition + uSightFwd * s;
        float d = length(vWorldPos - dotPos);
        float dotA = smoothstep(uDotRadius, uDotRadius * 0.45, d);
        float glow = exp(-d * d / (uDotRadius * uDotRadius * 9.0)) * 0.55;
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float fres = pow(1.0 - abs(dot(normalize(vNormal), viewDir)), 3.0);
        vec2 c = vUv - 0.5; float r = length(c) * 2.0;
        float edge = smoothstep(0.82, 1.0, r);
        vec3 tint = vec3(0.25, 0.45, 0.75) * 0.10 + fres * vec3(0.3, 0.5, 0.8) * 0.45;
        float alpha = 0.2 + fres * 0.35 + edge * 0.55;
        vec3 col = tint * (1.0 - edge * 0.7);
        float flick = 0.92 + 0.08 * sin(uTime * 70.0);
        col += uColor * (dotA * 9.0 + glow * 2.5) * flick * uBright;
        gl_FragColor = vec4(col, clamp(alpha + dotA, 0.0, 1.0));
      }`,
  });
}
export const _sightPos = new Vector3();
export const _sightFwd = new Vector3();
export function updateRedDot(i, t, e) {
  (t.getWorldPosition(_sightPos),
    t.getWorldDirection(_sightFwd),
    i.uniforms.uSightPos.value.copy(_sightPos),
    i.uniforms.uSightFwd.value.copy(_sightFwd).negate(),
    (i.uniforms.uTime.value = e));
}
export class MuzzleFlash {
  constructor() {
    ((this.group = new Group()),
      (this.uniforms = {
        uLife: { value: 1 },
        uSeed: { value: 0 },
        uIntensity: { value: 1 },
        uColor: { value: new Color(1, 0.6, 0.2) },
      }));
    const t = new ShaderMaterial({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        side: DoubleSide,
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uLife; uniform float uSeed; uniform float uIntensity; uniform vec3 uColor; varying vec2 vUv;
        ${NOISE_GLSL}
        void main(){
          float u = vUv.x; float v = (vUv.y - 0.5) * 2.0;
          float n = noise2(vec2(u * 5.0 + uSeed * 10.0, v * 3.0 + uSeed * 3.0));
          float n2 = noise2(vec2(u * 12.0 - uSeed * 7.0, v * 6.0));
          float width = (1.0 - u * 0.85) * (0.45 + 0.7 * n) * (1.0 - uLife * 0.5);
          float shape = smoothstep(width, width * 0.25, abs(v));
          float len = 1.0 - smoothstep(0.45 + n * 0.5, 1.0, u);
          float core = smoothstep(width * 0.7, 0.0, abs(v)) * (1.0 - u) * (0.7 + 0.6 * n2);
          vec3 col = mix(uColor, vec3(1.0, 0.95, 0.8), core);
          float a = shape * len * (1.0 - uLife) * (0.7 + 0.3 * n2);
          gl_FragColor = vec4(col * uIntensity * (1.0 + core * 3.0) * a, a);
        }`,
      }),
      e = new ShaderMaterial({
        uniforms: this.uniforms,
        transparent: !0,
        depthWrite: !1,
        blending: AdditiveBlending,
        side: DoubleSide,
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: `
        uniform float uLife; uniform float uSeed; uniform float uIntensity; uniform vec3 uColor; varying vec2 vUv;
        void main(){
          vec2 c = vUv - 0.5; float r = length(c) * 2.0; float ang = atan(c.y, c.x);
          float spikes = 0.55 + 0.45 * sin(ang * 7.0 + uSeed * 20.0) * sin(ang * 3.0 - uSeed * 9.0);
          float a = smoothstep(1.0, 0.05, r / (0.45 + 0.55 * spikes)) * (1.0 - uLife);
          vec3 col = mix(uColor, vec3(1.0, 0.95, 0.85), smoothstep(0.6, 0.0, r));
          gl_FragColor = vec4(col * uIntensity * (1.0 + smoothstep(0.5, 0.0, r) * 3.0) * a, a);
        }`,
      }),
      n = new PlaneGeometry(1, 1);
    (n.rotateY(Math.PI / 2), n.translate(0, 0, -0.5));
    const s = new Mesh(n, t),
      r = new Mesh(n, t);
    r.rotation.z = Math.PI / 2;
    const a = new Mesh(n, t);
    ((a.rotation.z = Math.PI / 4), a.scale.set(1, 0.7, 0.8));
    const l = new Mesh(new PlaneGeometry(1, 1), e);
    ((l.position.z = -0.02),
      (this.planes = [s, r, a]),
      (this.disc = l),
      (this.inner = new Group()),
      this.inner.add(s, r, a, l),
      this.group.add(this.inner),
      (this.light = new PointLight(16752704, 0, 3, 2)),
      (this.light.position.z = -0.05),
      this.group.add(this.light),
      (this.group.visible = !1),
      (this.timer = 0),
      (this.duration = 0.06),
      (this.intensity = 0));
  }
  fire(t) {
    ((this.group.visible = !0),
      (this.timer = 0),
      (this.duration = t.duration || 0.06),
      (this.uniforms.uSeed.value = Math.random()),
      (this.uniforms.uIntensity.value = t.intensity || 1.6),
      this.uniforms.uColor.value.setRGB(t.color[0], t.color[1], t.color[2]));
    const e = 0.8 + Math.random() * 0.45,
      n = t.length * e,
      s = t.width * e;
    for (const r of this.planes) r.scale.set(1, s, n);
    (this.planes[2].scale.set(1, s * 0.7, n * 0.8),
      this.disc.scale.set(s * 1.4, s * 1.4, 1),
      (this.inner.rotation.z = Math.random() * Math.PI * 2),
      (this.peakLight = t.light || 14),
      (this.light.intensity = this.peakLight),
      (this.intensity = 1));
  }
  update(t) {
    if (!this.group.visible) {
      this.intensity = 0;
      return;
    }
    this.timer += t;
    const e = Math.min(1, this.timer / this.duration);
    ((this.uniforms.uLife.value = e),
      (this.light.intensity = this.peakLight * (1 - e)),
      (this.intensity = 1 - e),
      e >= 1 && ((this.group.visible = !1), (this.intensity = 0)));
  }
}

// First-person viewmodel. Reads sim Weapons/Player state each frame and derives
// the pose; reacts to sim events for kicks, flash and bolt motion. Owns every
// spring and animation value — none of this feeds back into the sim.
export class WeaponView {
  constructor(cam) {
    ((this.cam = cam),
      (this.rig = new Group()),
      cam.add(this.rig),
      (this.redDotMat = makeRedDotMaterial()),
      (this.models = [
        buildRifleModel(this.redDotMat),
        buildShotgunModel(),
        buildDmrModel(),
      ]));
    for (const r of this.models) (this.rig.add(r.group), (r.group.visible = !1));
    ((this.shown = 0),
      (this.models[0].group.visible = !0),
      (this.flash = new MuzzleFlash()),
      this.models[0].parts.muzzle.add(this.flash.group),
      (this.boltT = [0, 0, 0]),
      (this.swayPos = new Vector3()),
      (this.swayPosV = new Vector3()),
      (this.swayRot = new Vector3()),
      (this.swayRotV = new Vector3()),
      (this.kickPos = new Vector3()),
      (this.kickPosV = new Vector3()),
      (this.kickRot = new Vector3()),
      (this.kickRotV = new Vector3()),
      (this.moveOff = new Vector3()),
      (this.moveRot = new Vector3()),
      (this.animPos = new Vector3()),
      (this.animRot = new Vector3()),
      (this._v = new Vector3()),
      (this._up = new Vector3()),
      (this.muzzleWorld = new Vector3()));
  }
  get model() {
    return this.models[this.shown];
  }
  get parts() {
    return this.model.parts;
  }
  _show(i) {
    (this.model.parts.muzzle.remove(this.flash.group),
      (this.model.group.visible = !1),
      (this.shown = i),
      (this.model.group.visible = !0),
      this.model.parts.muzzle.add(this.flash.group),
      this._restParts(this.model.parts));
  }
  _restParts(t) {
    (t.mag &&
      (t.mag.position.copy(t.magRest),
      t.mag.rotation.set(0, 0, 0),
      (t.mag.visible = !0)),
      t.handL && t.handLRest && t.handL.position.copy(t.handLRest),
      t.pump && (t.pump.position.z = t.pumpRest));
  }
  reset() {
    for (const v of [
      this.swayPos,
      this.swayPosV,
      this.swayRot,
      this.swayRotV,
      this.kickPos,
      this.kickPosV,
      this.kickRot,
      this.kickRotV,
      this.animPos,
      this.animRot,
    ])
      v.set(0, 0, 0);
    this.boltT.fill(0);
    for (const m of this.models) this._restParts(m.parts);
  }
  // World position of the current weapon's ejection port.
  ejectWorld(out) {
    return this.parts.eject.getWorldPosition(out);
  }
  onEvent(ev, sim) {
    if (ev.type === EV_SHOT) {
      const n = ev.def,
        p = 1 - ev.ads * 0.4;
      ((this.kickPos.z += n.kickBack * p),
        (this.kickPos.y += n.kickUp * p),
        (this.kickRot.x += n.kickPitch * p * rand(0.8, 1.2)),
        (this.kickRot.y += rand(-1, 1) * n.kickYaw),
        (this.kickRot.z += rand(-1, 1) * n.kickRoll * p),
        this.flash.fire(n.flash),
        n.key === "ar" && (this.boltT[ev.index] = 1));
    } else if (ev.type === EV_EJECT) ev.bolt && (this.boltT[sim.current] = 1);
    else if (ev.type === EV_LAND)
      ((this.swayPosV.y -= ev.strength * 0.75),
        (this.swayRotV.x -= ev.strength * 3.2),
        (this.swayRotV.z += rand(-1, 1) * ev.strength * 0.8));
    else if (ev.type === EV_JUMP)
      ((this.swayPosV.y += 0.28), (this.swayRotV.x += 0.9));
  }
  sync(sim, player, input, dt, time) {
    this.shown !== sim.current && this._show(sim.current);
    for (let i = 0; i < 3; i++)
      this.boltT[i] = Math.max(
        0,
        this.boltT[i] - dt / (sim.weapons[i].def.boltAnimTime || 0.1),
      );
    const w = sim.weapon;
    (this._animSwitch(sim),
      w.reloading ? this._animReload(w, dt) : this._restParts(this.parts),
      w.reloading || sim.switching || this.animPos.set(0, 0, 0),
      w.reloading || sim.switching || this.animRot.set(0, 0, 0),
      this._pose(sim, player, input, dt, time),
      this.cam.updateMatrixWorld(!0),
      this.parts.muzzle.getWorldPosition(this.muzzleWorld),
      this.parts.lens && updateRedDot(this.redDotMat, this.parts.sight, time),
      this.flash.update(dt));
  }
  _animSwitch(sim) {
    const e = sim.switching;
    if (!e) return;
    const s =
        sim.weapon.def.switchTime * (e.phase === "down" ? 0.4 : 0.6),
      r =
        e.phase === "down"
          ? easeOutCubic(e.t / s)
          : 1 - easeOutCubic(e.t / s);
    (this.animPos.set(0.04 * r, -0.28 * r, 0.02 * r),
      this.animRot.set(-0.7 * r, 0.15 * r, 0.25 * r));
  }
  _animReload(t, e) {
    const s = t.reload,
      r = t.def,
      a = this.parts;
    if (r.key === "shotgun") {
      let u = 1;
      if (s.phase === "intro") u = easeOutCubic(s.t / r.reloadIntro);
      else if (s.phase === "shells") {
        const m = s.shellT / r.reloadTime,
          g = Math.sin(Math.min(1, m) * Math.PI);
        a.handL.position.copy(a.handLRest).lerp(VM_ADS_OFFSET, g);
      } else
        ((u = 1 - easeOutCubic(s.t / r.reloadOutro)),
          a.handL.position.copy(a.handLRest));
      (this.animPos.set(0.03 * u, -0.03 * u, 0.01 * u),
        this.animRot.set(0.12 * u, -0.2 * u, 0.55 * u));
      return;
    }
    const l = s.t / s.dur,
      o = Math.sin(Math.min(1, l) * Math.PI);
    (this.animPos.set(-0.015 * o, -0.05 * o, 0.015 * o),
      this.animRot.set(-0.28 * o, 0.2 * o, -0.5 * o));
    let c = 0,
      h = !0,
      d = 0;
    if (l >= 0.15 && l < 0.42) {
      const u = easeOutCubic((l - 0.15) / 0.27);
      ((c = -0.3 * u), (d = -0.5 * u));
    } else if (l >= 0.42 && l < 0.5) ((h = !1), (c = -0.3));
    else if (l >= 0.5 && l < 0.76) {
      const u = 1 - easeOutCubic((l - 0.5) / 0.26);
      ((c = -0.3 * u), (d = -0.25 * u));
    }
    if (
      (a.mag.position.set(a.magRest.x, a.magRest.y + c, a.magRest.z + c * 0.35),
      (a.mag.rotation.x = d),
      (a.mag.visible = h),
      a.handL && a.handLRest)
    ) {
      const u = l > 0.08 && l < 0.82,
        m = u ? a.mag.position.x - 0.01 : a.handLRest.x,
        g = u ? a.mag.position.y - 0.09 : a.handLRest.y,
        v = u ? a.mag.position.z + 0.03 : a.handLRest.z,
        p = 1 - Math.exp(-22 * e);
      ((a.handL.position.x += (m - a.handL.position.x) * p),
        (a.handL.position.y += (g - a.handL.position.y) * p),
        (a.handL.position.z += (v - a.handL.position.z) * p));
    }
    l > 0.8 && l < 0.9 && (this.boltT[this.shown] = 1);
  }
  _pose(sim, n, e, t, s) {
    const r = sim.weapon,
      a = r.def,
      l = this.parts,
      o = sim.adsSmooth,
      c = smooth01(sim.sprintBlend),
      h = a.weight,
      d = 1 - o * 0.88,
      u = MathUtils.lerp(0.012, 0.022, h) * d,
      m = MathUtils.lerp(0.0028, 0.0055, h) * d;
    ((this.swayRotV.y += -e.dx * u),
      (this.swayRotV.x += -e.dy * u),
      (this.swayRotV.z += e.dx * u * 0.35),
      (this.swayPosV.x += -e.dx * m),
      (this.swayPosV.y += e.dy * m * 0.6));
    const g = MathUtils.lerp(180, 90, h),
      v = 2 * Math.sqrt(g) * MathUtils.lerp(0.8, 0.55, h),
      p = MathUtils.lerp(230, 120, h),
      f = 2 * Math.sqrt(p) * 0.7;
    (this._spring(this.swayRot, this.swayRotV, g, v, t, 0.16),
      this._spring(this.swayPos, this.swayPosV, p, f, t, 0.07),
      this._spring(
        this.kickRot,
        this.kickRotV,
        330,
        2 * Math.sqrt(330) * 0.55,
        t,
        0.5,
      ),
      this._spring(
        this.kickPos,
        this.kickPosV,
        330,
        2 * Math.sqrt(330) * 0.6,
        t,
        0.25,
      ));
    const w = n.localVel,
      M = 1 - o * 0.8;
    ((this.moveOff.x = damp(this.moveOff.x, -w.x * 0.0055 * M, 7, t)),
      (this.moveOff.y = damp(
        this.moveOff.y,
        MathUtils.clamp(-w.y * 0.004, -0.03, 0.03) * M,
        7,
        t,
      )),
      (this.moveOff.z = damp(this.moveOff.z, w.z * 0.004 * M, 7, t)),
      (this.moveRot.z = damp(this.moveRot.z, -w.x * 0.012 * M, 7, t)),
      (this.moveRot.x = damp(
        this.moveRot.x,
        MathUtils.clamp(w.y * 0.012, -0.08, 0.08) * M,
        7,
        t,
      )),
      (this.moveRot.y = damp(this.moveRot.y, -w.x * 0.006 * M, 7, t)));
    const _ = n.bobPhase,
      L = n.bobAmt * (n.sprinting ? 2.4 : 1) * (1 - o * 0.9),
      R = Math.sin(_) * 0.011 * L,
      A = Math.sin(_ * 2) * 0.007 * L - 0.002 * L,
      C = Math.sin(_) * 0.02 * L,
      S = Math.cos(_ * 2) * 0.008 * L,
      y = a.key === "dmr" ? 0.0012 : 4e-4,
      P =
        Math.sin(s * 0.9) * 0.0012 * (1 - o * 0.6) + o * Math.sin(s * 1.3) * y,
      z = Math.sin(s * 1.5) * 9e-4 * (1 - o * 0.6) + o * Math.cos(s * 0.9) * y,
      U = this._v.copy(l.hipOffset).lerp(l.adsOffset, o),
      H = l.hipRot,
      k =
        U.x +
        VM_HIP_OFFSET.x * c +
        this.swayPos.x +
        this.moveOff.x +
        R +
        P +
        this.kickPos.x +
        this.animPos.x,
      G =
        U.y +
        VM_HIP_OFFSET.y * c +
        this.swayPos.y +
        this.moveOff.y +
        A +
        z +
        this.kickPos.y +
        this.animPos.y,
      q =
        U.z +
        VM_HIP_OFFSET.z * c +
        this.swayPos.z +
        this.moveOff.z +
        this.kickPos.z +
        this.animPos.z,
      O =
        H.x * (1 - o) +
        VM_SPRINT_OFFSET.x * c +
        this.swayRot.x +
        this.moveRot.x +
        S +
        this.kickRot.x +
        this.animRot.x,
      et =
        H.y * (1 - o) +
        VM_SPRINT_OFFSET.y * c +
        this.swayRot.y +
        this.moveRot.y +
        this.kickRot.y +
        this.animRot.y,
      K =
        H.z * (1 - o) +
        VM_SPRINT_OFFSET.z * c +
        this.swayRot.z +
        this.moveRot.z +
        C +
        this.kickRot.z +
        this.animRot.z;
    if (
      (this.rig.position.set(k, G, q),
      this.rig.rotation.set(O, et, K),
      l.bolt &&
        (l.bolt.position.z = l.boltRest + this.boltT[this.shown] * l.boltTravel),
      l.pump)
    )
      if (r.pumping) {
        const nt = Math.min(1, r.pumpT / a.pumpTime);
        l.pump.position.z = l.pumpRest + Math.sin(nt * Math.PI) * l.pumpTravel;
      } else l.pump.position.z = l.pumpRest;
    l.lens && (this.redDotMat.uniforms.uBright.value = 0.7 + o * 0.5);
  }
  _spring(t, e, n, s, r, a) {
    ((e.x += (-n * t.x - s * e.x) * r),
      (e.y += (-n * t.y - s * e.y) * r),
      (e.z += (-n * t.z - s * e.z) * r),
      (t.x = MathUtils.clamp(t.x + e.x * r, -a, a)),
      (t.y = MathUtils.clamp(t.y + e.y * r, -a, a)),
      (t.z = MathUtils.clamp(t.z + e.z * r, -a, a)));
  }
}
