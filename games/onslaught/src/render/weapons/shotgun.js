import { CircleGeometry, Euler, Group, Mesh, Object3D, Vector3 } from "three";
import { VIEWMODEL_MATS, box, cyl, makeLeftHand, makeRightHand, sphere, torus } from "./kit.js";

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
