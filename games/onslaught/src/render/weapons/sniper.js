import {
  CircleGeometry,
  Euler,
  Group,
  Mesh,
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
} from "./kit.js";

// Objective glass. Local to this gun: it is the only coated lens in the
// viewmodel, and it wants to read as glass rather than as another metal part.
const SCOPE_GLASS = new MeshStandardMaterial({
  color: 0x0d1a24,
  roughness: 0.08,
  metalness: 0.2,
});

// MERIDIAN — bolt action, one shot at a time, and long enough that the muzzle
// leaves frame at the hip. Takes the shared reticle material so the scope gets
// the same parallax-free dot the rifle's red dot uses.
export function buildSniperModel(lensMaterial) {
  const g = new Group(),
    p = {};

  // Receiver, rail and a chassis that runs the length of the gun.
  g.add(box(0.072, 0.094, 0.4, M.metal, 0, 0.018, -0.06, 0.008));
  g.add(box(0.026, 0.012, 0.44, M.metalDark, 0, 0.07, -0.08));
  for (let i = 0; i < 12; i++)
    g.add(box(0.028, 0.005, 0.012, M.metal, 0, 0.078, 0.12 - i * 0.034));
  g.add(box(0.066, 0.05, 0.2, M.metalDark, 0, -0.036, 0.02, 0.006));
  g.add(box(0.002, 0.01, 0.18, M.accent, 0.0365, 0.024, -0.08));
  g.add(box(0.002, 0.01, 0.18, M.accent, -0.0365, 0.024, -0.08));

  // Skeletonised handguard: two rails with cut-outs between them.
  g.add(box(0.058, 0.056, 0.44, M.polymer2, 0, 0.028, -0.47, 0.007));
  for (let i = 0; i < 9; i++) {
    for (const dx of [-0.03, 0.03])
      g.add(box(0.002, 0.03, 0.024, M.metalDark, dx, 0.028, -0.32 - i * 0.042));
    g.add(box(0.03, 0.002, 0.024, M.metalDark, 0, -0.001, -0.32 - i * 0.042));
  }

  // Heavy fluted barrel and a big three-chamber brake.
  g.add(cyl(0.016, 0.016, 0.5, M.metalDark, 0, 0.03, -0.92, "z", 24));
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(
      box(0.005, 0.005, 0.42, M.metal, Math.cos(a) * 0.015, 0.03 + Math.sin(a) * 0.015, -0.92),
    );
  }
  g.add(cyl(0.026, 0.023, 0.13, M.metalDark, 0, 0.03, -1.22, "z", 24));
  for (let i = 0; i < 3; i++)
    for (const dx of [-0.019, 0.019])
      g.add(box(0.006, 0.03, 0.014, M.metalDark, dx, 0.03, -1.18 - i * 0.035));

  // Detachable box magazine.
  const mag = new Group();
  mag.position.set(0, -0.05, -0.17);
  const body = box(0.044, 0.115, 0.12, M.metalDark, 0, -0.058, 0.006, 0.005);
  body.rotation.x = 0.09;
  mag.add(body);
  const floor = box(0.048, 0.012, 0.124, M.metal, 0, -0.118, 0.018);
  floor.rotation.x = 0.09;
  mag.add(floor);
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // Grip, trigger, adjustable stock with cheek riser.
  const grip = box(0.034, 0.115, 0.05, M.polymer, 0, -0.1, 0.09, 0.008);
  grip.rotation.x = -0.3;
  g.add(grip);
  g.add(box(0.007, 0.024, 0.009, M.metalLight, 0, -0.056, 0.045));
  g.add(box(0.005, 0.005, 0.06, M.metalDark, 0, -0.072, 0.044));
  g.add(box(0.056, 0.078, 0.34, M.polymer2, 0, 0.014, 0.32, 0.009));
  g.add(box(0.06, 0.05, 0.13, M.polymer, 0, 0.066, 0.28, 0.007));
  g.add(box(0.062, 0.13, 0.03, M.polymer, 0, 0.006, 0.48, 0.006));
  g.add(box(0.026, 0.03, 0.05, M.metalDark, 0, -0.05, 0.46, 0.005));

  // Scope: two rings, a long tube, an ocular bell and the reticle lens.
  // The tube and both bells are open-ended and double-sided -- a capped
  // cylinder puts a solid disc between the eye and the reticle, which is
  // exactly what a scope must not do. Same trick as the rifle's red dot.
  // Rings sit under the tube, not through it: at y 0.098 with a 0.042 height
  // they reached up to 0.119 and put a solid block across the sight picture.
  for (const z of [-0.09, 0.11])
    g.add(box(0.028, 0.034, 0.028, M.metalDark, 0, 0.08, z, 0.004));
  // Open-ended so the eye can see down the tube to the reticle, but
  // FRONT-side, not double. A double-sided open tube shows its own lit inner
  // wall from the outside, which made the scope read as a hollow white pipe
  // rather than an optic. Front faces only: solid from outside, see-through
  // along the axis, because the near wall is backface-culled.
  g.add(cyl(0.0205, 0.0205, 0.36, M.metalDark, 0, 0.118, 0.01, "z", 28, !0));
  g.add(cyl(0.026, 0.026, 0.06, M.metalDark, 0, 0.118, -0.185, "z", 28, !0));
  g.add(cyl(0.025, 0.025, 0.07, M.metalDark, 0, 0.118, 0.2, "z", 28, !0));
  // Objective glass, so the front of the scope is not an open hole.
  g.add(cyl(0.0245, 0.0245, 0.004, SCOPE_GLASS, 0, 0.118, -0.209, "z", 28));
  // Elevation and windage turrets, seated on the tube's outer surface rather
  // than sunk into it -- a turret that pokes inside the tube shows up as a
  // block sitting in the middle of the sight picture.
  g.add(cyl(0.013, 0.013, 0.026, M.metalLight, 0, 0.152, 0.01, "y", 16));
  g.add(cyl(0.011, 0.011, 0.022, M.metalLight, 0.031, 0.118, 0.01, "x", 16));

  const lens = new Mesh(new CircleGeometry(0.0225, 40), lensMaterial);
  lens.position.set(0, 0.118, 0.164);
  lens.renderOrder = 5;
  g.add(lens);
  p.lens = lens;

  // Bolt handle, out to the right of the receiver.
  const bolt = new Group();
  bolt.position.set(0, 0.052, 0.06);
  bolt.add(cyl(0.008, 0.008, 0.07, M.metalLight, 0.05, 0, 0, "x", 14));
  bolt.add(cyl(0.015, 0.015, 0.02, M.metalLight, 0.088, 0, 0, "x", 14));
  g.add(bolt);
  p.bolt = bolt;
  p.boltRest = 0.06;
  p.boltTravel = 0.09;

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.03, -1.3);
  g.add(p.muzzle);
  p.eject = new Object3D();
  p.eject.position.set(0.042, 0.05, 0.02);
  g.add(p.eject);

  p.sight = new Object3D();
  p.sight.position.set(0, 0.118, 0.164);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.118, -0.42);
  p.hipOffset = new Vector3(0.152, -0.176, -0.44);
  p.hipRot = new Euler(0, 0.028, 0.018);

  p.handR = makeRightHand([0.004, -0.118, 0.105], -0.3);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.002, -0.026, -0.42], [-0.14, -0.34, -0.12]);
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();
  return { group: g, parts: p };
}
