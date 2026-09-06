import { CircleGeometry, Euler, Group, Mesh, Object3D, Vector3 } from "three";
import {
  VIEWMODEL_MATS as M,
  box,
  cyl,
  makeLeftHand,
  makeRightHand,
  sphere,
} from "./kit.js";

// M4A1 — flat-top carbine. The silhouette people recognise is the full-length
// top rail with no carry handle, the round ribbed handguard, the buffer tube
// running straight back into a six-position sliding stock, and the A2
// birdcage. Chambered 5.56, 30-round STANAG, gas-operated.
export function buildM4Model(lensMaterial) {
  const g = new Group(),
    p = {};

  // Upper and lower receiver, with the magwell flared under the ejection port.
  g.add(box(0.062, 0.068, 0.26, M.metal, 0, 0.034, -0.03, 0.007));
  g.add(box(0.058, 0.054, 0.16, M.metalDark, 0, -0.024, 0.005, 0.006));
  // Brass deflector and forward assist, the two bumps behind the port.
  g.add(box(0.014, 0.026, 0.03, M.metal, 0.031, 0.042, 0.05, 0.006));
  g.add(cyl(0.009, 0.009, 0.026, M.metalDark, 0.03, 0.02, 0.06, "z", 14));
  // Ejection port cover, closed.
  g.add(box(0.004, 0.026, 0.062, M.metalDark, 0.031, 0.038, -0.005, 0.003));

  // Flat-top rail: an unbroken run of teeth from the receiver to the gas block.
  g.add(box(0.024, 0.011, 0.44, M.metalDark, 0, 0.072, -0.14));
  for (let i = 0; i < 15; i++)
    g.add(box(0.026, 0.005, 0.012, M.metal, 0, 0.079, 0.06 - i * 0.031));

  // Round ribbed handguard with heat-shield ribs, plus the delta ring.
  g.add(cyl(0.031, 0.031, 0.3, M.polymer2, 0, 0.03, -0.31, "z", 20));
  for (let i = 0; i < 9; i++)
    g.add(cyl(0.0325, 0.0325, 0.008, M.polymer, 0, 0.03, -0.19 - i * 0.031, "z", 20));
  g.add(cyl(0.036, 0.036, 0.022, M.metalDark, 0, 0.03, -0.17, "z", 20));

  // Gas block with the front sight base, barrel, and the A2 birdcage.
  g.add(box(0.03, 0.05, 0.045, M.metalDark, 0, 0.046, -0.475, 0.004));
  g.add(box(0.012, 0.036, 0.012, M.metalDark, 0, 0.086, -0.475));
  g.add(sphere(0.0032, M.white, 0, 0.104, -0.476));
  g.add(cyl(0.0105, 0.0105, 0.24, M.metalDark, 0, 0.03, -0.6, "z", 20));
  g.add(cyl(0.0155, 0.0155, 0.05, M.metalDark, 0, 0.03, -0.735, "z", 20));
  // The birdcage's slots.
  for (let i = 0; i < 4; i++)
    g.add(box(0.034, 0.004, 0.009, M.polymer, 0, 0.03, -0.722 - i * 0.011));

  // STANAG magazine: a straight body with the classic slight curve at the base.
  const mag = new Group();
  mag.position.set(0, -0.048, 0.005);
  const body = box(0.036, 0.15, 0.062, M.polymer2, 0, -0.075, 0.004, 0.005);
  body.rotation.x = 0.11;
  mag.add(body);
  const floor = box(0.04, 0.012, 0.066, M.metalDark, 0, -0.152, 0.022);
  floor.rotation.x = 0.11;
  mag.add(floor);
  for (let i = 0; i < 3; i++)
    mag.add(box(0.038, 0.005, 0.058, M.polymer, 0, -0.04 - i * 0.036, 0.004));
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // A2 pistol grip with its finger swell, trigger and guard.
  const grip = box(0.03, 0.105, 0.046, M.polymer, 0, -0.09, 0.082, 0.008);
  grip.rotation.x = -0.31;
  g.add(grip);
  g.add(box(0.033, 0.02, 0.03, M.polymer, 0, -0.05, 0.062, 0.008));
  g.add(box(0.006, 0.02, 0.008, M.metalLight, 0, -0.05, 0.032));
  g.add(box(0.004, 0.004, 0.058, M.metalDark, 0, -0.064, 0.03));
  g.add(box(0.004, 0.02, 0.005, M.metalDark, 0, -0.04, 0.058));
  // Safety selector and magazine release on the left flank.
  g.add(cyl(0.008, 0.008, 0.02, M.metalDark, -0.031, -0.014, 0.05, "x", 12));
  g.add(box(0.012, 0.016, 0.016, M.metalDark, 0.032, -0.012, 0.01, 0.004));

  // Buffer tube and the six-position stock riding on it.
  g.add(cyl(0.018, 0.018, 0.24, M.metalDark, 0, 0.028, 0.19, "z", 18));
  for (let i = 0; i < 6; i++)
    g.add(box(0.006, 0.007, 0.008, M.metal, 0, 0.047, 0.11 + i * 0.03));
  g.add(box(0.05, 0.062, 0.16, M.polymer, 0, 0.024, 0.24, 0.008));
  g.add(box(0.044, 0.09, 0.05, M.polymer, 0, 0.004, 0.19, 0.008));
  g.add(box(0.052, 0.108, 0.024, M.polymer2, 0, 0.014, 0.325, 0.006));
  // Sling loop on the stock.
  g.add(box(0.03, 0.024, 0.008, M.metalDark, 0, 0.062, 0.28, 0.004));

  // Charging handle latch poking out the back of the upper.
  const bolt = box(0.036, 0.014, 0.03, M.metalLight, 0, 0.062, 0.098, 0.004);
  g.add(bolt);
  p.bolt = bolt;
  p.boltRest = 0.098;
  p.boltTravel = 0.042;

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.03, -0.765);
  g.add(p.muzzle);
  p.eject = new Object3D();
  p.eject.position.set(0.038, 0.04, -0.005);
  g.add(p.eject);

  // Red dot on the flat-top rail, which is how these are actually carried.
  g.add(box(0.03, 0.026, 0.036, M.metalDark, 0, 0.09, -0.06, 0.004));
  g.add(cyl(0.019, 0.019, 0.05, M.tube, 0, 0.117, -0.06, "z", 26, !0));
  for (const z of [-0.086, -0.034])
    g.add(cyl(0.0215, 0.0215, 0.006, M.metalDark, 0, 0.117, z, "z", 26, !0));
  const lens = new Mesh(new CircleGeometry(0.0185, 36), lensMaterial);
  lens.position.set(0, 0.117, -0.058);
  lens.renderOrder = 5;
  g.add(lens);
  p.lens = lens;

  p.sight = new Object3D();
  p.sight.position.set(0, 0.117, -0.058);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.117, -0.2);
  p.hipOffset = new Vector3(0.163, -0.163, -0.3);
  p.hipRot = new Euler(0, 0.034, 0.02);

  p.handR = makeRightHand([0.004, -0.106, 0.086], -0.31);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.002, -0.006, -0.29], [-0.13, -0.33, -0.02]);
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();
  return { group: g, parts: p };
}
