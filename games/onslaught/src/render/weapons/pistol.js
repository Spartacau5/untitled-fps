import { Euler, Group, Object3D, Vector3 } from "three";
import {
  VIEWMODEL_MATS as M,
  box,
  cyl,
  makeLeftHand,
  makeRightHand,
  sphere,
} from "./kit.js";

// SIDEWINDER 9 — the sidearm. A striker-fired service pistol: squared-off
// slide, undercut trigger guard, beavertail, accessory rail under the dust
// cover. The slide is the reciprocating part, so parts.bolt drives it, and
// parts.slideLock holds it open on an empty magazine the way a real one does.
export function buildPistolModel() {
  const g = new Group(),
    p = {};

  // Polymer frame, dust cover, and the accessory rail slots beneath it.
  g.add(box(0.032, 0.042, 0.185, M.polymer, 0, -0.008, -0.03, 0.005));
  g.add(box(0.03, 0.026, 0.09, M.polymer2, 0, -0.032, -0.075, 0.004));
  for (let i = 0; i < 3; i++)
    g.add(box(0.032, 0.004, 0.006, M.polymer, 0, -0.045, -0.05 - i * 0.018));
  // Beavertail, so the frame does not just stop square at the web of the hand.
  const tail = box(0.028, 0.016, 0.038, M.polymer, 0, 0.006, 0.052, 0.007);
  tail.rotation.x = 0.22;
  g.add(tail);
  // Barrel, and the chamber hood showing at the ejection port.
  g.add(cyl(0.0095, 0.0095, 0.2, M.metalLight, 0, 0.012, -0.075));
  g.add(cyl(0.011, 0.011, 0.03, M.metalLight, 0, 0.014, -0.005));

  // Slide. Squared, with wide rear serrations and a shorter front set.
  const slide = new Group();
  slide.add(box(0.034, 0.038, 0.2, M.metal, 0, 0.019, -0.04, 0.005));
  // Flat top with a shallow sight rib down the middle.
  slide.add(box(0.026, 0.012, 0.19, M.metalDark, 0, 0.04, -0.04));
  slide.add(box(0.008, 0.004, 0.16, M.metalDark, 0, 0.046, -0.045));
  for (let i = 0; i < 7; i++)
    slide.add(
      box(0.036, 0.028, 0.005, M.metalDark, 0, 0.019, 0.028 - i * 0.01),
    );
  for (let i = 0; i < 5; i++)
    slide.add(
      box(0.036, 0.022, 0.005, M.metalDark, 0, 0.019, -0.096 - i * 0.01),
    );
  // Ejection port: a recess with a lowered rear wall, on the right flank.
  slide.add(box(0.007, 0.021, 0.052, M.metalDark, 0.015, 0.026, -0.018));
  slide.add(box(0.007, 0.008, 0.006, M.metalLight, 0.015, 0.012, 0.01));
  // Extractor claw.
  slide.add(box(0.006, 0.009, 0.022, M.metalLight, 0.016, 0.026, 0.004, 0.002));

  // Iron sights. There were none: the slide was flat from breech to muzzle
  // with a rib down the middle, so aiming meant staring along a featureless
  // wall of metal with nothing to line up. These ride on the slide so they
  // move with it when it cycles.
  //
  // The sight line sits 10 mm above the slide top rather than level with it.
  // Level, the top face is exactly edge-on and fills the view, which is what
  // made this the hardest gun in the game to aim.
  const REAR_Z = 0.03,
    FRONT_Z = -0.128,
    POST_TOP = 0.062;
  const post = (w, h, x, z) =>
    box(w, h, 0.008, M.metalDark, x, POST_TOP - h / 2, z, 0.001);
  // Rear notch: two blades with a gap you look through.
  (slide.add(post(0.008, 0.015, -0.0085, REAR_Z)),
    slide.add(post(0.008, 0.015, 0.0085, REAR_Z)),
    // Front blade, a shade taller so its tip is what you put on the target.
    slide.add(post(0.006, 0.017, 0, FRONT_Z)));
  // Three-dot, the way almost every pistol marks its sights: two either side
  // of the notch and one on the front blade. Line the three up and you are
  // on target - readable in a fraction of the time an unmarked notch takes.
  for (const [x, z, r] of [
    [-0.0085, REAR_Z - 0.004, 0.0016],
    [0.0085, REAR_Z - 0.004, 0.0016],
    [0, FRONT_Z - 0.003, 0.0019],
  ])
    slide.add(sphere(r, M.accent, x, POST_TOP - 0.005, z));
  g.add(slide);
  p.bolt = slide;
  p.boltRest = 0;
  p.boltTravel = 0.055;
  // Hold the slide open on an empty magazine. See WeaponView._pose.
  p.slideLock = !0;

  // Grip: raked back, with moulded side panels and a texture patch.
  const grip = box(0.031, 0.125, 0.05, M.polymer, 0, -0.095, 0.028, 0.008);
  grip.rotation.x = -0.28;
  g.add(grip);
  for (const dx of [-0.0165, 0.0165])
    g.add(box(0.003, 0.08, 0.04, M.polymer2, dx, -0.09, 0.03, 0.004));
  for (let i = 0; i < 6; i++)
    g.add(box(0.034, 0.005, 0.03, M.polymer2, 0, -0.055 - i * 0.017, 0.019));
  // Magazine well flare and floorplate.
  g.add(box(0.035, 0.01, 0.052, M.polymer2, 0, -0.152, 0.061, 0.004));

  // Magazine.
  const mag = new Group();
  mag.position.set(0, -0.09, 0.026);
  mag.add(box(0.024, 0.115, 0.036, M.metalDark, 0, 0, 0, 0.004));
  mag.add(box(0.03, 0.009, 0.044, M.polymer2, 0, -0.062, 0.004));
  // Witness holes down the spine.
  for (let i = 0; i < 4; i++)
    mag.add(box(0.026, 0.004, 0.006, M.polymer, 0, 0.03 - i * 0.024, -0.019));
  mag.rotation.x = -0.28;
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // Trigger with its safety blade, undercut guard, slide stop, takedown pin.
  g.add(box(0.006, 0.022, 0.008, M.metalLight, 0, -0.042, -0.012));
  g.add(box(0.002, 0.016, 0.003, M.metalDark, 0, -0.044, -0.014));
  g.add(box(0.005, 0.005, 0.058, M.polymer, 0, -0.058, -0.03));
  g.add(box(0.005, 0.026, 0.005, M.polymer, 0, -0.03, -0.057));
  g.add(box(0.006, 0.008, 0.032, M.metalLight, -0.018, -0.006, 0.012, 0.002));
  g.add(cyl(0.005, 0.005, 0.034, M.metalDark, 0, -0.024, -0.028, "x", 12));
  // Ambidextrous magazine release.
  g.add(box(0.008, 0.012, 0.012, M.metalDark, -0.018, -0.038, 0.008, 0.003));

  // Three-dot irons, seated in dovetails.
  g.add(box(0.012, 0.006, 0.01, M.metalDark, 0, 0.043, -0.128));
  g.add(box(0.008, 0.012, 0.008, M.metalDark, 0, 0.049, -0.128));
  g.add(sphere(0.0028, M.white, 0, 0.052, -0.13));
  g.add(box(0.026, 0.006, 0.01, M.metalDark, 0, 0.043, 0.032));
  g.add(box(0.024, 0.012, 0.008, M.metalDark, 0, 0.048, 0.032));
  for (const dx of [-0.008, 0.008])
    g.add(sphere(0.0022, M.white, dx, 0.05, 0.031));

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.012, -0.19);
  g.add(p.muzzle);
  p.eject = new Object3D();
  p.eject.position.set(0.026, 0.028, -0.02);
  g.add(p.eject);

  // Where the eye goes when aiming: through the rear notch, on the sight
  // line, not on the slide. adsOffset is its mirror, which is what puts that
  // point dead centre of the screen.
  // On the post tops (POST_TOP), not partway down the blades: the tips are
  // what you put on a target, so the tips are what belongs at screen centre.
  p.sight = new Object3D();
  p.sight.position.set(0, POST_TOP, REAR_Z);
  g.add(p.sight);
  // Held a little further out than it was, too. A pistol at arm's length
  // leaves room to see past the sights; at 0.34 the slide filled the frame.
  p.adsOffset = new Vector3(0, -0.062, -0.38);
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
