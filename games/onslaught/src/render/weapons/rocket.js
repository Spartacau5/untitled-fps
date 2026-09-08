import { CircleGeometry, Euler, Group, Mesh, Object3D, Vector3 } from "three";
import {
  VIEWMODEL_MATS as M,
  box,
  cyl,
  makeLeftHand,
  makeRightHand,
  sphere,
  torus,
} from "./kit.js";

// HAVOC RL-4 — shoulder-fired single tube. The silhouette that says rocket
// launcher is a fat smooth tube with a flared blast cone at the back, a
// shoulder rest, a forward grip slung under it, and an optic sat up on a
// riser. Loaded one rocket at a time, so parts.mag is the round itself.
export function buildRocketModel(lensMaterial) {
  const g = new Group(),
    p = {};

  // Main tube, with reinforcing bands along it.
  g.add(cyl(0.058, 0.058, 0.95, M.polymer2, 0, 0.03, -0.22, "z", 24));
  for (let i = 0; i < 5; i++)
    g.add(torus(0.062, 0.006, M.metalDark, 0, 0.03, -0.6 + i * 0.19));
  // Muzzle collar and the flared venturi at the back, which is the tell.
  g.add(cyl(0.066, 0.062, 0.07, M.metalDark, 0, 0.03, -0.69, "z", 24));
  g.add(cyl(0.058, 0.088, 0.17, M.metalDark, 0, 0.03, 0.31, "z", 24, !0));
  g.add(torus(0.088, 0.007, M.metalDark, 0, 0.03, 0.39));

  // Heat shield over the middle third, standing off the tube on ribs.
  g.add(cyl(0.07, 0.07, 0.34, M.metal, 0, 0.03, -0.12, "z", 20, !0));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(
      box(
        0.01,
        0.01,
        0.34,
        M.metalDark,
        Math.cos(a) * 0.064,
        0.03 + Math.sin(a) * 0.064,
        -0.12,
      ),
    );
  }

  // Shoulder rest and cheek pad on top of the tube.
  g.add(box(0.07, 0.05, 0.2, M.polymer, 0, -0.01, 0.2, 0.012));
  g.add(box(0.086, 0.03, 0.16, M.polymer, 0, 0.078, 0.13, 0.008));

  // Pistol grip, trigger, guard.
  const grip = box(0.034, 0.11, 0.05, M.polymer, 0, -0.062, 0.11, 0.008);
  grip.rotation.x = -0.3;
  g.add(grip);
  g.add(box(0.007, 0.022, 0.009, M.metalLight, 0, -0.02, 0.07));
  g.add(box(0.005, 0.005, 0.058, M.metalDark, 0, -0.034, 0.068));
  // Forward grip under the tube.
  const fore = box(0.034, 0.1, 0.048, M.polymer, 0, -0.05, -0.24, 0.008);
  fore.rotation.x = 0.16;
  g.add(fore);

  // Optic on a riser: this is what the player actually aims with, so it
  // needs a reticle. Without the lens the first build aimed at a bare open
  // tube -- a clean sight picture with nothing in it to aim by. Same
  // construction as the M4's red dot: open tube, ring at each end, and the
  // shared reticle material on a disc at the ocular end.
  //
  // Raise the optic and bring its ocular aft. The matching eye relief keeps
  // the venturi ahead of the camera; the pose guard also covers recoil/reload.
  const optic = new Group();
  optic.position.set(0, 0.04, 0.36);
  g.add(optic);
  optic.add(box(0.03, 0.09, 0.08, M.metalDark, 0, 0.084, -0.19, 0.005));
  optic.add(cyl(0.024, 0.024, 0.16, M.tube, 0, 0.142, -0.19, "z", 24, !0));
  for (const z of [-0.268, -0.112])
    optic.add(cyl(0.027, 0.027, 0.008, M.metalDark, 0, 0.142, z, "z", 24, !0));
  const lens = new Mesh(new CircleGeometry(0.0225, 36), lensMaterial);
  lens.position.set(0, 0.142, -0.118);
  lens.renderOrder = 5;
  optic.add(lens);
  p.lens = lens;
  // Backup iron ahead of the optic, for the silhouette.
  optic.add(box(0.008, 0.012, 0.008, M.metalDark, 0, 0.166, -0.26));
  optic.add(sphere(0.0028, M.white, 0, 0.172, -0.262));

  // The loaded rocket, nose poking out of the tube. This is parts.mag, so the
  // reload animation pulls a spent round and slides a fresh one home.
  const mag = new Group();
  mag.position.set(0, 0.03, -0.7);
  mag.add(cyl(0.05, 0.05, 0.14, M.metalDark, 0, 0, 0.02, "z", 18));
  mag.add(cyl(0.05, 0.014, 0.11, M.orange, 0, 0, -0.1, "z", 18));
  // Fins at the base of the exposed section.
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    mag.add(
      box(
        0.006,
        0.05,
        0.06,
        M.metalDark,
        Math.cos(a) * 0.052,
        Math.sin(a) * 0.052,
        0.06,
      ),
    );
  }
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();
  // Tells WeaponView this part is the round itself, not a magazine: hide it
  // when the tube is empty.
  p.magIsRound = !0;

  // Backblast warning stripe, because a tube like this always has one.
  g.add(box(0.004, 0.03, 0.12, M.orange, 0.058, 0.03, 0.22));

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.03, -0.78);
  g.add(p.muzzle);
  // Nothing is ejected; the anchor is part of the viewmodel contract.
  p.eject = new Object3D();
  p.eject.position.set(0.05, 0.05, 0.16);
  g.add(p.eject);

  // Aim through the ocular, not the middle of the tube: sitting the eye at
  // the tube's centre put half the optic body behind the camera.
  p.sight = new Object3D();
  p.sight.position.set(0, 0.182, 0.242);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.182, -0.502);
  p.keepInFront = true;
  // A launcher is shouldered, not held out front, so its mass sits much
  // further from the eye than a rifle's. At the rifle standoff the tube's
  // rear was 6 cm from the camera and flared across the whole corner while
  // the grip, optic and both hands projected off-screen -- you saw a bare
  // pipe. Pushed out to 0.62 m the tube reads as a tube, and the parts that
  // say "rocket launcher" are the ones actually in shot.
  p.hipOffset = new Vector3(0.13, -0.15, -0.62);
  p.hipRot = new Euler(0.01, 0.05, 0.03);

  p.handR = makeRightHand([0.004, -0.078, 0.124], -0.3);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.002, -0.072, -0.236], [-0.13, -0.33, 0.04]);
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();

  // ---- reload ------------------------------------------------------------
  //
  // Muzzle-loaded, one round at a time, so this cannot be the generic
  // magazine swap: `p.mag` is the rocket itself and it sits in the muzzle,
  // not in a magwell under the receiver. Run through the generic animation it
  // dropped the loaded round 30 cm straight down out of the front of the tube
  // and floated a replacement back up into it.
  //
  // What actually happens: the launcher comes down off the shoulder, the tube
  // is empty (the round left when you fired it), the support hand brings a
  // fresh rocket up to the muzzle from below and forward, slides it aft into
  // the tube fins-last, seats it, and the launcher goes back up.
  const ease = (t) => t * t * (3 - 2 * t),
    span = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));
  p.reloadAnim = (view, l) => {
    // Sell the motion, not the mechanism.
    //
    // A muzzle-loaded tube is the one reload you cannot stage in front of the
    // camera: the round seats a metre out at the far end, off the bottom of
    // the frame, and every attempt to show it sliding home was either
    // invisible or required swinging the launcher so far inboard that the
    // gun just lay across the screen. So the launcher drops out of frame the
    // way a real one comes down off the shoulder, the round changes state
    // down there where the work actually happens, and it comes back up
    // loaded. The player reads "reloading" from the dip and the empty tube,
    // which is all they ever read from it in a game.
    const dip = Math.sin(Math.min(1, l) * Math.PI) ** 0.65;
    (view.animPos.set(0.06 * dip, -0.26 * dip, 0.12 * dip),
      view.animRot.set(-0.62 * dip, 0.3 * dip, -0.42 * dip));

    // Empty until it is loaded, and it loads while the tube is out of shot.
    p.mag.visible = l > 0.55;
    if (!p.mag.visible) {
      // Support hand goes down after the round rather than hanging in space.
      p.handL.position.set(
        p.handLRest.x - 0.05,
        p.handLRest.y - 0.16,
        p.handLRest.z + 0.26,
      );
      return;
    }
    // The last of the push home, finishing just before the tube comes back up
    // into frame, plus a short settle so it does not stop dead.
    const home = ease(span(l, 0.55, 0.74)),
      seat = Math.sin(span(l, 0.74, 0.88) * Math.PI) * 0.014;
    (p.mag.position.set(
      p.magRest.x,
      p.magRest.y,
      p.magRest.z - 0.1 * (1 - home) + seat,
    ),
      (p.mag.rotation.x = 0),
      (p.mag.rotation.z = 0));
    // Hand releases back to the foregrip as the launcher comes up.
    const letGo = ease(span(l, 0.72, 0.95));
    p.handL.position.set(
      p.handLRest.x - 0.05 * (1 - letGo),
      p.handLRest.y - 0.16 * (1 - letGo),
      p.handLRest.z + 0.26 * (1 - letGo),
    );
  };

  return { group: g, parts: p };
}
