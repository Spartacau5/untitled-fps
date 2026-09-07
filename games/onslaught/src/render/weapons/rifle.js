import { CircleGeometry, Euler, Group, Mesh, Object3D, Vector3 } from "three";
import {
  VIEWMODEL_MATS,
  box,
  cyl,
  makeLeftHand,
  makeRightHand,
  sphere,
  torus,
} from "./kit.js";

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
  // Steeply curved magazine in two segments with a visible break at the
  // joint. The M4 carries a straight STANAG box, and the magazine is the
  // largest single shape in the hip view, so this is the other half of
  // telling the two rifles apart at a glance. The group origin is unchanged,
  // so magRest and the reload animation are unaffected.
  const n = new Group();
  n.position.set(0, -0.05, -0.02);
  const s = box(
    0.04,
    0.1,
    0.072,
    VIEWMODEL_MATS.polymer2,
    0,
    -0.048,
    0.005,
    0.005,
  );
  ((s.rotation.x = 0.1), n.add(s));
  const s2 = box(
    0.039,
    0.098,
    0.068,
    VIEWMODEL_MATS.polymer2,
    0,
    -0.139,
    0.036,
    0.005,
  );
  ((s2.rotation.x = 0.44), n.add(s2));
  const r = box(0.043, 0.012, 0.072, VIEWMODEL_MATS.metalDark, 0, -0.19, 0.061);
  ((r.rotation.x = 0.44),
    n.add(r),
    n.add(box(0.041, 0.004, 0.069, VIEWMODEL_MATS.orange, 0, -0.036, 0.003)),
    // Rib over the joint, which is what makes the break read as a curve
    // rather than as two boxes that happen to touch.
    n.add(box(0.042, 0.006, 0.064, VIEWMODEL_MATS.metalDark, 0, -0.099, 0.022)),
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
    // Gas tube riding above the barrel with its block, plus a left-side
    // accessory rail and the folding-stock hinge behind it. The gun sits to
    // the right of the camera, so the LEFT flank is the one on screen -- an
    // AR-pattern rifle has nothing out there, and this does.
    t.add(cyl(0.0075, 0.0075, 0.26, VIEWMODEL_MATS.metalDark, 0, 0.056, -0.6)),
    t.add(cyl(0.013, 0.013, 0.028, VIEWMODEL_MATS.metalDark, 0, 0.056, -0.47)),
    t.add(
      box(
        0.006,
        0.022,
        0.14,
        VIEWMODEL_MATS.metalDark,
        -0.032,
        0.05,
        -0.3,
        0.002,
      ),
    ),
    t.add(
      box(
        0.018,
        0.032,
        0.032,
        VIEWMODEL_MATS.metalLight,
        -0.03,
        0.004,
        0.238,
        0.004,
      ),
    ),
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
  // Holographic sight, not a tube red dot. This is the loudest single
  // difference between the VK-7 and the M4 in the hip view: both wore the
  // same ring optic at the same height in the same place, which is most of
  // why they read as one gun. A squared hood over the same glass -- top
  // plate and two side walls, open front and back so the sight picture is
  // untouched. Nothing is added behind the lens: anything spanning y = 0.122
  // aft of it would sit in the middle of the ADS view.
  (t.add(
    box(0.052, 0.006, 0.058, VIEWMODEL_MATS.metalDark, 0, 0.146, -0.07, 0.003),
  ),
    t.add(
      box(
        0.006,
        0.038,
        0.058,
        VIEWMODEL_MATS.metalDark,
        0.023,
        0.127,
        -0.07,
        0.003,
      ),
    ),
    t.add(
      box(
        0.006,
        0.038,
        0.058,
        VIEWMODEL_MATS.metalDark,
        -0.023,
        0.127,
        -0.07,
        0.003,
      ),
    ),
    // Windage and elevation turret on the left wall, and the signature accent.
    t.add(
      box(0.01, 0.014, 0.014, VIEWMODEL_MATS.metalLight, -0.029, 0.13, -0.058),
    ),
    t.add(
      box(0.004, 0.006, 0.03, VIEWMODEL_MATS.accent, 0.0265, 0.146, -0.07),
    ));
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
