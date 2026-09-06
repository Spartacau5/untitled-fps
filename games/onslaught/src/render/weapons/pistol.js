import { Euler, Group, Object3D, Vector3 } from "three";
import {
  VIEWMODEL_MATS as M,
  box,
  cyl,
  makeLeftHand,
  makeRightHand,
  sphere,
} from "./kit.js";

// SIDEWINDER 9 — the sidearm. Compact enough that the slide, not a bolt, is
// the reciprocating part: parts.bolt drives it, so the shared bolt animation
// cycles the slide on every shot.
export function buildPistolModel() {
  const g = new Group(),
    p = {};

  // Frame, dust cover and the barrel poking through the slide.
  g.add(box(0.032, 0.042, 0.185, M.polymer, 0, -0.008, -0.03, 0.005));
  g.add(box(0.03, 0.026, 0.09, M.polymer2, 0, -0.032, -0.075, 0.004));
  g.add(cyl(0.0095, 0.0095, 0.2, M.metalLight, 0, 0.012, -0.075));

  // Slide, with cocking serrations front and rear.
  const slide = new Group();
  slide.position.set(0, 0, 0);
  slide.add(box(0.034, 0.038, 0.2, M.metal, 0, 0.019, -0.04, 0.005));
  slide.add(box(0.026, 0.012, 0.19, M.metalDark, 0, 0.04, -0.04));
  for (let i = 0; i < 6; i++) {
    slide.add(box(0.036, 0.026, 0.004, M.metalDark, 0, 0.019, 0.03 - i * 0.009));
    slide.add(
      box(0.036, 0.02, 0.004, M.metalDark, 0, 0.019, -0.098 - i * 0.009),
    );
  }
  // Ejection port, cut as a recess on the right flank.
  slide.add(box(0.006, 0.02, 0.05, M.metalDark, 0.016, 0.024, -0.02));
  g.add(slide);
  p.bolt = slide;
  p.boltRest = 0;
  p.boltTravel = 0.055;

  // Grip, raked back, with stipple ridges and a baseplate.
  const grip = box(0.031, 0.125, 0.05, M.polymer, 0, -0.095, 0.028, 0.008);
  grip.rotation.x = -0.28;
  g.add(grip);
  for (let i = 0; i < 5; i++)
    g.add(box(0.034, 0.006, 0.03, M.polymer2, 0, -0.06 - i * 0.018, 0.02));
  g.add(box(0.033, 0.008, 0.048, M.metalDark, 0, -0.152, 0.06));

  // Magazine, in the grip: a short throw is enough to read as a mag change.
  const mag = new Group();
  mag.position.set(0, -0.09, 0.026);
  mag.add(box(0.024, 0.115, 0.036, M.metalDark, 0, 0, 0, 0.004));
  mag.add(box(0.03, 0.009, 0.044, M.polymer2, 0, -0.062, 0.004));
  mag.rotation.x = -0.28;
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // Trigger, guard and a slide-stop lever.
  g.add(box(0.006, 0.022, 0.008, M.metalLight, 0, -0.042, -0.012));
  g.add(box(0.005, 0.005, 0.055, M.metalDark, 0, -0.056, -0.03));
  g.add(box(0.005, 0.024, 0.005, M.metalDark, 0, -0.03, -0.056));
  g.add(box(0.006, 0.008, 0.03, M.metalLight, -0.018, -0.006, 0.01));

  // Three-dot irons.
  g.add(box(0.008, 0.012, 0.008, M.metalDark, 0, 0.045, -0.128));
  g.add(sphere(0.0028, M.white, 0, 0.05, -0.129));
  g.add(box(0.024, 0.012, 0.008, M.metalDark, 0, 0.045, 0.032));
  for (const dx of [-0.008, 0.008]) g.add(sphere(0.0022, M.white, dx, 0.048, 0.031));

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.012, -0.19);
  g.add(p.muzzle);
  p.eject = new Object3D();
  p.eject.position.set(0.026, 0.028, -0.02);
  g.add(p.eject);

  p.sight = new Object3D();
  p.sight.position.set(0, 0.047, 0.032);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.047, -0.34);
  p.hipOffset = new Vector3(0.12, -0.105, -0.5);
  p.hipRot = new Euler(0, 0.05, 0.03);

  // Both hands on the gun: the support hand wraps the strong hand rather than
  // holding a handguard, so it sits alongside the grip and slightly back.
  p.handR = makeRightHand([0.004, -0.115, 0.055], -0.28);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.035, -0.115, 0.03], [-0.16, -0.32, 0.24]);
  p.handL.rotation.z = 0.5;
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();
  return { group: g, parts: p };
}
