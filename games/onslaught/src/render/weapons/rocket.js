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
  // The optic sits well forward, over the heat shield. That is not styling:
  // aiming puts the camera at the ocular, and with the optic at the tube's
  // balance point the flared venturi ended up level with the player's face
  // and clipped through the near plane. Nobody puts their eye behind a blast
  // cone, and the frustum test in tests/weapon-models.test.mjs says so too.
  g.add(box(0.03, 0.05, 0.08, M.metalDark, 0, 0.104, -0.19, 0.005));
  g.add(cyl(0.024, 0.024, 0.16, M.tube, 0, 0.142, -0.19, "z", 24, !0));
  for (const z of [-0.268, -0.112])
    g.add(cyl(0.027, 0.027, 0.008, M.metalDark, 0, 0.142, z, "z", 24, !0));
  const lens = new Mesh(new CircleGeometry(0.0225, 36), lensMaterial);
  lens.position.set(0, 0.142, -0.118);
  lens.renderOrder = 5;
  g.add(lens);
  p.lens = lens;
  // Backup iron ahead of the optic, for the silhouette.
  g.add(box(0.008, 0.012, 0.008, M.metalDark, 0, 0.166, -0.26));
  g.add(sphere(0.0028, M.white, 0, 0.172, -0.262));

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
  p.sight.position.set(0, 0.142, -0.118);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.142, -0.132);
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
  return { group: g, parts: p };
}
