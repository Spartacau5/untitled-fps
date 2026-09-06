import { CircleGeometry, Euler, Group, Mesh, Object3D, Vector3 } from "three";
import { VIEWMODEL_MATS, box, cyl, makeLeftHand, makeRightHand, sphere, torus } from "./kit.js";

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
