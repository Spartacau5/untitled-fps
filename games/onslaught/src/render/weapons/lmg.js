import { Euler, Group, Object3D, Vector3 } from "three";
import {
  VIEWMODEL_MATS as M,
  box,
  cyl,
  makeLeftHand,
  makeRightHand,
  sphere,
  torus,
} from "./kit.js";

// OVERWATCH — belt-fed and deliberately oversized. The box magazine under the
// receiver and the folded bipod under the barrel are what sell the weight; the
// pose and spring tuning do the rest (weight 1.0 in the weapon table).
export function buildLmgModel() {
  const g = new Group(),
    p = {};

  // Heavy receiver, feed-tray cover and carry handle.
  g.add(box(0.082, 0.088, 0.34, M.metal, 0, 0.03, -0.04, 0.008));
  g.add(box(0.076, 0.03, 0.26, M.metalDark, 0, 0.078, -0.05, 0.005));
  for (let i = 0; i < 8; i++)
    g.add(box(0.078, 0.005, 0.012, M.metal, 0, 0.094, 0.05 - i * 0.032));
  g.add(box(0.016, 0.05, 0.11, M.metalDark, -0.03, 0.125, -0.02, 0.006));
  g.add(box(0.016, 0.05, 0.11, M.metalDark, 0.03, 0.125, -0.02, 0.006));
  g.add(box(0.075, 0.018, 0.12, M.polymer, 0, 0.148, -0.02, 0.006));
  g.add(box(0.002, 0.008, 0.16, M.accent, 0.0415, 0.03, -0.06));
  g.add(box(0.002, 0.008, 0.16, M.accent, -0.0415, 0.03, -0.06));

  // Barrel with a vented heat shield and a slotted flash hider.
  g.add(box(0.05, 0.05, 0.3, M.metalDark, 0, 0.03, -0.36, 0.006));
  for (let i = 0; i < 6; i++)
    for (const dx of [-0.026, 0.026])
      g.add(box(0.002, 0.024, 0.022, M.metal, dx, 0.03, -0.26 - i * 0.038));
  g.add(cyl(0.0135, 0.0135, 0.34, M.metalDark, 0, 0.03, -0.62));
  g.add(cyl(0.019, 0.017, 0.075, M.metalDark, 0, 0.03, -0.8));
  for (let i = 0; i < 4; i++)
    g.add(box(0.044, 0.005, 0.009, M.polymer, 0, 0.03, -0.775 - i * 0.016));

  // Box magazine: heavy, square, and sitting well below the receiver.
  const mag = new Group();
  mag.position.set(0, -0.058, -0.02);
  mag.add(box(0.09, 0.13, 0.19, M.polymer2, 0, -0.07, 0, 0.01));
  mag.add(box(0.094, 0.012, 0.194, M.metalDark, 0, -0.14, 0));
  mag.add(box(0.03, 0.06, 0.005, M.orange, 0, -0.07, -0.098));
  for (let i = 0; i < 3; i++)
    mag.add(box(0.092, 0.006, 0.03, M.metalDark, 0, -0.03 - i * 0.04, 0));
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // Belt stub feeding out of the tray into the receiver.
  for (let i = 0; i < 4; i++)
    g.add(box(0.012, 0.02, 0.011, M.metalLight, 0.045, 0.02 - i * 0.016, -0.02));

  // Bipod, folded back under the barrel.
  for (const dx of [-1, 1]) {
    const leg = box(0.01, 0.16, 0.014, M.metalDark, dx * 0.022, -0.05, -0.42);
    leg.rotation.x = 1.15;
    leg.rotation.z = dx * 0.16;
    g.add(leg);
  }
  g.add(box(0.05, 0.024, 0.03, M.metalDark, 0, 0.004, -0.42));

  // Grip, trigger, stock.
  const grip = box(0.036, 0.115, 0.05, M.polymer, 0, -0.098, 0.086, 0.008);
  grip.rotation.x = -0.3;
  g.add(grip);
  g.add(box(0.007, 0.022, 0.009, M.metalLight, 0, -0.058, 0.042));
  g.add(box(0.005, 0.005, 0.06, M.metalDark, 0, -0.072, 0.04));
  g.add(box(0.062, 0.09, 0.24, M.polymer2, 0, 0.026, 0.25, 0.009));
  g.add(box(0.066, 0.12, 0.028, M.polymer, 0, 0.014, 0.382, 0.006));
  g.add(box(0.05, 0.05, 0.09, M.polymer, 0, 0.075, 0.2, 0.008));

  // Irons sit high to clear the feed cover.
  g.add(box(0.012, 0.02, 0.008, M.metalDark, 0, 0.078, -0.5));
  g.add(sphere(0.003, M.white, 0, 0.088, -0.501));
  g.add(box(0.024, 0.012, 0.02, M.metalDark, 0, 0.166, -0.02));
  g.add(torus(0.0105, 0.002, M.metalDark, 0, 0.176, -0.02));

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.03, -0.845);
  g.add(p.muzzle);
  p.eject = new Object3D();
  p.eject.position.set(0.05, 0.03, 0.02);
  g.add(p.eject);

  const bolt = box(0.03, 0.024, 0.05, M.metalLight, 0.042, 0.05, 0.08);
  g.add(bolt);
  p.bolt = bolt;
  p.boltRest = 0.08;
  p.boltTravel = 0.05;

  p.sight = new Object3D();
  p.sight.position.set(0, 0.176, -0.02);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.176, -0.24);
  p.hipOffset = new Vector3(0.172, -0.192, -0.4);
  p.hipRot = new Euler(0, 0.03, 0.02);

  p.handR = makeRightHand([0.004, -0.115, 0.1], -0.3);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.002, -0.03, -0.34], [-0.14, -0.34, -0.06]);
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();
  return { group: g, parts: p };
}
