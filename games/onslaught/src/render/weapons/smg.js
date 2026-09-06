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

// WASP-9 — short, light, very fast. Skeleton stock folded alongside the
// receiver and a stubby ported barrel keep the silhouette compact so it reads
// as the close-quarters answer at a glance.
export function buildSmgModel() {
  const g = new Group(),
    p = {};

  // Receiver and rail.
  g.add(box(0.058, 0.062, 0.22, M.metal, 0, 0.028, -0.02, 0.007));
  g.add(box(0.052, 0.048, 0.14, M.metalDark, 0, -0.014, 0.01, 0.005));
  g.add(box(0.022, 0.01, 0.22, M.metalDark, 0, 0.062, -0.02));
  for (let i = 0; i < 6; i++)
    g.add(box(0.024, 0.004, 0.01, M.metal, 0, 0.069, 0.05 - i * 0.03));
  g.add(box(0.002, 0.006, 0.05, M.accent, 0.0295, 0.026, -0.04));
  g.add(box(0.002, 0.006, 0.05, M.accent, -0.0295, 0.026, -0.04));

  // Ported barrel shroud, barrel, and a compensator with two side ports.
  g.add(box(0.046, 0.046, 0.17, M.polymer2, 0, 0.026, -0.2, 0.006));
  for (let i = 0; i < 4; i++)
    for (const dx of [-0.024, 0.024])
      g.add(box(0.002, 0.016, 0.016, M.metalDark, dx, 0.026, -0.15 - i * 0.032));
  g.add(cyl(0.0095, 0.0095, 0.22, M.metalDark, 0, 0.026, -0.24));
  g.add(cyl(0.014, 0.013, 0.045, M.metalLight, 0, 0.026, -0.355));
  for (const dx of [-0.0125, 0.0125])
    g.add(box(0.004, 0.01, 0.02, M.metalDark, dx, 0.03, -0.352));

  // Curved stick magazine: two segments at a slight break, ahead of the grip.
  const mag = new Group();
  mag.position.set(0, -0.04, -0.04);
  const magTop = box(0.032, 0.1, 0.05, M.polymer2, 0, -0.05, 0.004, 0.005);
  magTop.rotation.x = 0.16;
  mag.add(magTop);
  const magBot = box(0.03, 0.085, 0.048, M.polymer2, 0, -0.13, 0.028, 0.005);
  magBot.rotation.x = 0.34;
  mag.add(magBot);
  mag.add(box(0.034, 0.01, 0.05, M.metalDark, 0, -0.172, 0.042));
  mag.add(box(0.031, 0.004, 0.04, M.orange, 0, -0.09, 0.014));
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // Grip, trigger, guard.
  const grip = box(0.03, 0.1, 0.044, M.polymer, 0, -0.082, 0.086, 0.007);
  grip.rotation.x = -0.3;
  g.add(grip);
  for (let i = 0; i < 4; i++)
    g.add(box(0.033, 0.005, 0.028, M.polymer2, 0, -0.05 - i * 0.02, 0.076));
  g.add(box(0.006, 0.018, 0.008, M.metalLight, 0, -0.046, 0.042));
  g.add(box(0.004, 0.004, 0.05, M.metalDark, 0, -0.058, 0.04));

  // Folding skeleton stock, run back along the right of the receiver.
  g.add(box(0.012, 0.012, 0.2, M.metalDark, 0.024, 0.048, 0.16));
  g.add(box(0.012, 0.012, 0.2, M.metalDark, -0.024, 0.048, 0.16));
  g.add(box(0.062, 0.07, 0.02, M.polymer, 0, 0.042, 0.255, 0.005));

  // Irons: hooded post up front, ghost ring at the rear.
  g.add(box(0.01, 0.014, 0.008, M.metalDark, 0, 0.076, -0.31));
  g.add(sphere(0.0026, M.white, 0, 0.082, -0.311));
  g.add(box(0.02, 0.01, 0.018, M.metalDark, 0, 0.072, 0.05));
  g.add(torus(0.008, 0.0016, M.metalDark, 0, 0.079, 0.05));

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.026, -0.385);
  g.add(p.muzzle);
  p.eject = new Object3D();
  p.eject.position.set(0.034, 0.04, -0.02);
  g.add(p.eject);

  const bolt = box(0.026, 0.022, 0.04, M.metalLight, 0.026, 0.05, 0.05);
  g.add(bolt);
  p.bolt = bolt;
  p.boltRest = 0.05;
  p.boltTravel = 0.04;

  p.sight = new Object3D();
  p.sight.position.set(0, 0.079, 0.05);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.079, -0.29);
  p.hipOffset = new Vector3(0.155, -0.155, -0.27);
  p.hipRot = new Euler(0, 0.04, 0.024);

  p.handR = makeRightHand([0.004, -0.098, 0.1], -0.3);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.002, -0.004, -0.2], [-0.13, -0.32, 0.04]);
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();
  return { group: g, parts: p };
}
