import {
  Euler,
  Group,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import {
  VIEWMODEL_MATS as M,
  box,
  cyl,
  makeLeftHand,
  makeRightHand,
  sphere,
  torus,
  tube,
} from "./kit.js";

// The pilot flame at the nozzle. Local to this gun rather than in the shared
// kit: it is the only thing in the viewmodel meant to sit above the bloom
// threshold, so it reads as a live burner even before the trigger is pulled.
const PILOT = new MeshStandardMaterial({
  color: 0,
  emissive: 0xff7a1e,
  emissiveIntensity: 2.6,
  roughness: 0.5,
  metalness: 0,
});
const TANK = new MeshStandardMaterial({
  color: 0x7a3b22,
  roughness: 0.55,
  metalness: 0.55,
});

// CINDER-6 — a stream weapon, so there is no bolt, no ejection port and no
// magazine well. The twin pressure tanks are parts.mag: a reload swaps tanks,
// and the shared magazine animation drops and reseats them.
export function buildFlameModel() {
  const g = new Group(),
    p = {};

  // Body: a squat pressure housing rather than a receiver.
  g.add(box(0.078, 0.084, 0.24, M.metalDark, 0, 0.012, -0.02, 0.01));
  g.add(box(0.07, 0.03, 0.2, M.metal, 0, 0.058, -0.03, 0.006));
  for (let i = 0; i < 5; i++)
    g.add(box(0.074, 0.006, 0.014, M.metal, 0, 0.074, 0.04 - i * 0.036));

  // Regulator block, valve wheel and a pressure gauge on the left flank.
  g.add(box(0.03, 0.05, 0.05, M.metal, -0.05, 0.03, 0.03, 0.005));
  g.add(torus(0.021, 0.005, M.metalLight, -0.066, 0.03, 0.03));
  g.add(cyl(0.017, 0.017, 0.012, M.metalLight, 0.05, 0.03, 0.03, "x", 20));
  g.add(cyl(0.013, 0.013, 0.004, M.white, 0.057, 0.03, 0.03, "x", 20));

  // Nozzle assembly: a heat shroud, the burner tube, and the pilot ring.
  g.add(cyl(0.03, 0.03, 0.26, M.metalDark, 0, 0.03, -0.26, "z", 22));
  for (let i = 0; i < 5; i++)
    g.add(torus(0.032, 0.004, M.metal, 0, 0.03, -0.16 - i * 0.05));
  g.add(cyl(0.014, 0.014, 0.34, M.metalLight, 0, 0.03, -0.3, "z", 20));
  g.add(cyl(0.026, 0.021, 0.055, M.metalDark, 0, 0.03, -0.46, "z", 22));
  // Three pilot jets around the muzzle, plus the flame they hold.
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    const x = Math.cos(a) * 0.021,
      y = 0.03 + Math.sin(a) * 0.021;
    g.add(box(0.007, 0.007, 0.035, M.metalDark, x, y, -0.455));
    g.add(sphere(0.0055, PILOT, x, y, -0.482));
  }
  g.add(torus(0.021, 0.0035, PILOT, 0, 0.03, -0.487));

  // Twin fuel tanks slung under the body, with end caps and a strap.
  const mag = new Group();
  mag.position.set(0, -0.052, 0.02);
  for (const dx of [-0.032, 0.032]) {
    mag.add(cyl(0.03, 0.03, 0.26, TANK, dx, -0.05, 0.02, "z", 20));
    mag.add(cyl(0.032, 0.032, 0.018, M.metalDark, dx, -0.05, -0.108, "z", 20));
    mag.add(cyl(0.032, 0.032, 0.018, M.metalDark, dx, -0.05, 0.148, "z", 20));
    mag.add(box(0.012, 0.008, 0.11, M.orange, dx, -0.021, 0.02));
  }
  mag.add(box(0.086, 0.012, 0.03, M.metalDark, 0, -0.05, -0.05));
  mag.add(box(0.086, 0.012, 0.03, M.metalDark, 0, -0.05, 0.09));
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // Feed hose looping from the tanks up into the regulator.
  g.add(tube([0.032, -0.09, -0.09], [0.03, -0.02, -0.05], 0.009, 0.009, M.tube));
  g.add(tube([0.03, -0.02, -0.05], [0.012, 0.02, -0.06], 0.009, 0.009, M.tube));
  g.add(tube([-0.032, -0.09, -0.09], [-0.03, -0.01, -0.02], 0.009, 0.009, M.tube));

  // Grip and trigger, plus a forward grip on the shroud for the support hand.
  const grip = box(0.036, 0.115, 0.052, M.polymer, 0, -0.096, 0.076, 0.008);
  grip.rotation.x = -0.3;
  g.add(grip);
  for (let i = 0; i < 4; i++)
    g.add(box(0.039, 0.006, 0.03, M.polymer2, 0, -0.062 - i * 0.02, 0.066));
  g.add(box(0.007, 0.022, 0.009, M.metalLight, 0, -0.054, 0.034));
  g.add(box(0.005, 0.005, 0.058, M.metalDark, 0, -0.07, 0.032));
  const fore = box(0.034, 0.1, 0.05, M.polymer, 0, -0.05, -0.22, 0.008);
  fore.rotation.x = 0.14;
  g.add(fore);

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.03, -0.5);
  g.add(p.muzzle);
  // Nothing is ejected, but the viewmodel contract expects the anchor.
  p.eject = new Object3D();
  p.eject.position.set(0.04, 0.04, -0.02);
  g.add(p.eject);

  p.sight = new Object3D();
  p.sight.position.set(0, 0.082, -0.1);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.082, -0.14);
  p.hipOffset = new Vector3(0.162, -0.166, -0.34);
  p.hipRot = new Euler(0, 0.038, 0.026);

  p.handR = makeRightHand([0.004, -0.112, 0.09], -0.3);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.002, -0.072, -0.216], [-0.13, -0.33, 0.04]);
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();
  return { group: g, parts: p };
}
