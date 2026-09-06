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

// MP5A3 — the three tells that make one unmistakable: the cocking-handle tube
// running forward above the barrel with its lever cocked up at 45 degrees, the
// slotted drum rear sight, and the wide "tropical" handguard. 9x19, 800 rpm,
// roller-delayed, which is why it kicks so little for its rate of fire.
export function buildMp5Model() {
  const g = new Group(),
    p = {};

  // Slim stamped receiver, with the trunnion block ahead of it.
  g.add(box(0.05, 0.058, 0.24, M.metalDark, 0, 0.028, -0.02, 0.006));
  g.add(box(0.046, 0.042, 0.1, M.metalDark, 0, -0.012, 0.03, 0.005));
  // Stamped indents down each flank, the mag-well collar, and the receiver
  // end cap the stock rides on.
  for (const dx of [-0.026, 0.026])
    g.add(box(0.002, 0.022, 0.16, M.metal, dx, 0.03, -0.03));
  g.add(box(0.052, 0.026, 0.04, M.metalDark, 0, 0.006, -0.062, 0.006));
  g.add(box(0.048, 0.05, 0.016, M.metalDark, 0, 0.028, 0.104, 0.005));
  // Sling loop off the left of the receiver.
  g.add(box(0.004, 0.02, 0.012, M.metalDark, -0.027, 0.05, 0.06, 0.003));

  // Cocking-handle tube above the barrel, and the lever kicked up at 45.
  g.add(cyl(0.014, 0.014, 0.3, M.metalDark, 0, 0.058, -0.24, "z", 18));
  const bolt = new Group();
  bolt.position.set(0, 0.058, -0.335);
  // The arm rises to the left at 45 degrees off the tube, ending in the
  // paddle you slap. Built as one group so the whole assembly travels.
  const arm = cyl(0.008, 0.008, 0.056, M.metalLight, -0.022, 0.022, 0, "x", 14);
  arm.rotation.z = -0.79;
  bolt.add(arm);
  bolt.add(box(0.02, 0.026, 0.018, M.metalLight, -0.043, 0.043, 0, 0.005));
  // Collar where the arm meets the tube.
  bolt.add(cyl(0.017, 0.017, 0.016, M.metalDark, 0, 0, 0, "z", 16));
  g.add(bolt);
  p.bolt = bolt;
  p.boltRest = -0.335;
  p.boltTravel = 0.05;

  // Barrel and the tri-lug muzzle collar.
  g.add(cyl(0.0095, 0.0095, 0.3, M.metalDark, 0, 0.022, -0.26, "z", 18));
  g.add(cyl(0.013, 0.013, 0.03, M.metalLight, 0, 0.022, -0.4, "z", 18));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    g.add(
      box(0.006, 0.006, 0.02, M.metalDark, Math.cos(a) * 0.012, 0.022 + Math.sin(a) * 0.012, -0.398),
    );
  }

  // Wide tropical handguard, slung under the barrel.
  g.add(box(0.05, 0.05, 0.21, M.polymer, 0, 0.014, -0.25, 0.014));
  for (let i = 0; i < 5; i++)
    g.add(box(0.052, 0.005, 0.016, M.polymer2, 0, -0.008, -0.17 - i * 0.036));

  // Curved 30-round magazine, well forward of the grip.
  const mag = new Group();
  mag.position.set(0, -0.03, -0.06);
  const upper = box(0.03, 0.1, 0.05, M.metalDark, 0, -0.05, 0.006, 0.005);
  upper.rotation.x = 0.14;
  mag.add(upper);
  const lower = box(0.028, 0.086, 0.048, M.metalDark, 0, -0.128, 0.028, 0.005);
  lower.rotation.x = 0.3;
  mag.add(lower);
  mag.add(box(0.032, 0.01, 0.05, M.metal, 0, -0.168, 0.042));
  for (let i = 0; i < 4; i++)
    mag.add(box(0.031, 0.004, 0.04, M.metal, 0, -0.03 - i * 0.03, 0.01));
  g.add(mag);
  p.mag = mag;
  p.magRest = mag.position.clone();

  // Grip, trigger group with its paddle mag release, and the fire selector.
  const grip = box(0.03, 0.098, 0.046, M.polymer, 0, -0.076, 0.078, 0.008);
  grip.rotation.x = -0.3;
  g.add(grip);
  g.add(box(0.006, 0.02, 0.008, M.metalLight, 0, -0.044, 0.038));
  g.add(box(0.004, 0.004, 0.052, M.metalDark, 0, -0.058, 0.036));
  // The paddle behind the magwell, an MP5 signature.
  g.add(box(0.014, 0.03, 0.012, M.metalDark, 0, -0.03, -0.008, 0.004));
  g.add(cyl(0.009, 0.009, 0.022, M.metalDark, -0.028, -0.008, 0.05, "x", 12));

  // Retractable A3 stock: two rails back to a thin buttplate.
  for (const dx of [-0.017, 0.017])
    g.add(box(0.011, 0.011, 0.22, M.metalDark, dx, 0.028, 0.18));
  g.add(box(0.048, 0.062, 0.022, M.polymer, 0, 0.03, 0.29, 0.006));
  g.add(box(0.044, 0.03, 0.03, M.polymer2, 0, 0.03, 0.11, 0.006));

  // Hooded front post and the rotary drum rear.
  g.add(cyl(0.014, 0.014, 0.03, M.tube, 0, 0.058, -0.375, "z", 18, !0));
  g.add(box(0.005, 0.018, 0.006, M.metalDark, 0, 0.052, -0.375));
  g.add(sphere(0.0026, M.white, 0, 0.063, -0.376));
  // The rotary drum: a knurled cylinder with four aperture bosses around it,
  // which is the detail that says MP5 more than anything but the handle.
  g.add(cyl(0.02, 0.02, 0.024, M.metalDark, 0, 0.066, -0.04, "z", 20));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    g.add(
      box(
        0.009,
        0.009,
        0.026,
        M.metal,
        Math.cos(a) * 0.016,
        0.066 + Math.sin(a) * 0.016,
        -0.04,
      ),
    );
  }
  g.add(box(0.026, 0.012, 0.02, M.metalDark, 0, 0.05, -0.04, 0.004));
  g.add(torus(0.0075, 0.0018, M.metalDark, 0, 0.066, -0.051));

  p.muzzle = new Object3D();
  p.muzzle.position.set(0, 0.022, -0.418);
  g.add(p.muzzle);
  p.eject = new Object3D();
  p.eject.position.set(0.03, 0.042, -0.02);
  g.add(p.eject);

  p.sight = new Object3D();
  p.sight.position.set(0, 0.066, -0.051);
  g.add(p.sight);
  p.adsOffset = new Vector3(0, -0.066, -0.2);
  p.hipOffset = new Vector3(0.152, -0.152, -0.27);
  p.hipRot = new Euler(0, 0.042, 0.026);

  p.handR = makeRightHand([0.004, -0.094, 0.092], -0.3);
  g.add(p.handR);
  p.handL = makeLeftHand([-0.002, -0.028, -0.25], [-0.13, -0.32, 0.02]);
  g.add(p.handL);
  p.handLRest = p.handL.position.clone();
  return { group: g, parts: p };
}
