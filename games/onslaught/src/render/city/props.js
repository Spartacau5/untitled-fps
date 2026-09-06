import { CylinderGeometry } from "three";

// Street props.
//
// The cover in this arena is load-bearing: sim/arena.js owns the colliders and
// they must not move. Every prop here is built to fill an existing footprint
// exactly -- a scaffold tower inside the 1.7 m pillar square, a hoarding inside
// the 0.56 m barrier slab, a dumpster inside a crate box -- and never overhangs
// it. A prop sticking out past its collider would let the player walk through
// the part that sticks out, which is worse than an honest box.
//
// Builders take `em`, the emitter ArenaView passes in:
//   em.box(w, h, d, x, y, z, material, yaw)
//   em.geo(geometry, material)     for anything that is not a box
//   em.mats                        the shared material table
//
// Positions inside a prop are given in the prop's own local space and turned
// into world space by `place`, which returns the (x, y, z) triple em.box wants
// so it can be spread straight into the call.
function placer(x, z, yaw) {
  const c = Math.cos(yaw),
    s = Math.sin(yaw);
  return (lx, y, lz) => [x + c * lx + s * lz, y, z - s * lx + c * lz];
}

// Scaffolding tower. Midtown is permanently full of these, and a tube frame
// with plank decks reads as a real structure where a smooth column never will.
// Fills the 1.7 x 1.7 x 10 m pillar footprint.
export function scaffoldTower(em, x, z, yaw, height = 10) {
  const m = em.mats,
    at = placer(x, z, yaw),
    leg = 0.72, // inside the 0.85 half-width, so nothing overhangs
    lifts = 5,
    lift = height / lifts;

  // Four standards, with a coupler at every lift.
  for (const lx of [-leg, leg])
    for (const lz of [-leg, leg]) {
      const [wx, , wz] = at(lx, 0, lz);
      const tube = new CylinderGeometry(0.05, 0.05, height, 8);
      tube.translate(wx, height / 2, wz);
      em.geo(tube, m.metal);
      for (let i = 1; i < lifts; i++) {
        const coupler = new CylinderGeometry(0.066, 0.066, 0.15, 8);
        coupler.translate(wx, i * lift, wz);
        em.geo(coupler, m.pillar);
      }
      em.box(0.24, 0.05, 0.24, wx, 0.025, wz, m.metal);
    }

  // Ledgers and transoms at each lift.
  for (let i = 1; i <= lifts; i++) {
    const y = i * lift;
    for (const side of [-leg, leg]) {
      em.box(leg * 2, 0.07, 0.07, ...at(0, y, side), m.metal, yaw);
      em.box(0.07, 0.07, leg * 2, ...at(side, y, 0), m.metal, yaw);
    }
  }

  // Diagonal bracing on the two side faces, alternating up the tower. This is
  // what stops it reading as a cage.
  for (let i = 0; i < lifts; i++) {
    const lean = (i % 2 ? 1 : -1) * 0.63;
    for (const side of [-leg, leg]) {
      const brace = new CylinderGeometry(0.036, 0.036, lift * 1.22, 6);
      brace.rotateX(lean);
      const [wx, , wz] = at(side, 0, 0);
      brace.translate(wx, i * lift + lift / 2, wz);
      em.geo(brace, m.pillar);
    }
  }

  // Timber plank decks on two lifts, with a toe board at the edge.
  for (const i of [2, 4]) {
    const y = i * lift;
    for (let pl = 0; pl < 5; pl++)
      em.box(1.42, 0.05, 0.26, ...at(0, y + 0.06, -0.6 + pl * 0.3), m.crate, yaw);
    em.box(1.46, 0.2, 0.04, ...at(0, y + 0.16, -0.74), m.crate, yaw);
  }

  // Debris netting across the outward face.
  em.box(1.5, height * 0.6, 0.02, ...at(0, height * 0.42, -0.74), m.shutter, yaw);
}

// Construction hoarding: plywood on timber posts with a top rail and a kicker.
// The barrier footprint is long, thin and 2.1 m tall, which is a site fence
// and essentially nothing else.
export function hoarding(em, x, z, yaw, width, height = 2.1) {
  const m = em.mats,
    at = placer(x, z, yaw),
    panels = Math.max(3, Math.round(width / 1.2));

  for (let i = 0; i <= panels; i++)
    em.box(
      0.12,
      height,
      0.16,
      ...at(-width / 2 + (i * width) / panels, height / 2, 0),
      m.crate,
      yaw,
    );
  for (let i = 0; i < panels; i++)
    em.box(
      width / panels - 0.12,
      height - 0.3,
      0.06,
      ...at(-width / 2 + ((i + 0.5) * width) / panels, height / 2 + 0.02, 0),
      i % 2 ? m.crate : m.barrier,
      yaw,
    );
  em.box(width, 0.12, 0.2, ...at(0, height - 0.06, 0), m.crate, yaw);
  em.box(width, 0.18, 0.18, ...at(0, 0.09, 0), m.dark, yaw);

  // A raking brace at each end, clamped back to the ground.
  for (const side of [-1, 1]) {
    const brace = new CylinderGeometry(0.04, 0.04, 1.5, 6);
    brace.rotateX(0.7);
    const [wx, , wz] = at((side * width) / 2 - side * 0.25, 0, 0.42);
    brace.translate(wx, 0.72, wz);
    em.geo(brace, m.metal);
  }
}

// ---- crate-footprint props ------------------------------------------------

function dumpster(em, x, z, yaw, w, h, d) {
  const m = em.mats,
    at = placer(x, z, yaw);
  em.box(w, h * 0.78, d * 0.94, ...at(0, h * 0.42, 0), m.red, yaw);
  em.box(w * 0.97, h * 0.16, d, ...at(0, h * 0.86, 0), m.dark, yaw);
  // Two lids, the near one sitting slightly open.
  em.box(w * 0.99, 0.08, d * 0.5, ...at(0, h * 0.96, -d * 0.23), m.dark, yaw);
  em.box(w * 0.99, 0.08, d * 0.5, ...at(0, h * 1.0, d * 0.25), m.dark, yaw);
  // Side ribs and the pockets a truck's forks go into.
  for (let i = 0; i < 4; i++)
    em.box(0.06, h * 0.7, d * 0.98, ...at(-w * 0.36 + i * w * 0.24, h * 0.4, 0), m.dark, yaw);
  for (const side of [-1, 1])
    em.box(w * 0.22, 0.14, d * 0.32, ...at(side * w * 0.22, h * 0.16, 0), m.metal, yaw);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const wheel = new CylinderGeometry(0.09, 0.09, 0.07, 10);
      wheel.rotateZ(Math.PI / 2);
      const [wx, , wz] = at(sx * w * 0.38, 0, sz * d * 0.32);
      wheel.translate(wx, 0.09, wz);
      em.geo(wheel, m.dark);
    }
}

// A row of news vending boxes. The cabinet that was here first read as a dark
// cube however much louvred detail went on it -- a plain box painted dark is
// still a plain box. These break the silhouette instead: slanted tops, legs
// underneath, and a lit window each.
function newsBoxes(em, x, z, yaw, w, h, d) {
  const m = em.mats,
    at = placer(x, z, yaw),
    n = w > 1.8 ? 4 : 3,
    bw = (w / n) * 0.88,
    body = h * 0.62,
    legs = h * 0.2;
  const tint = [m.red, m.emCyanDim, m.yellow, m.barrier];
  for (let i = 0; i < n; i++) {
    const lx = -w / 2 + (i + 0.5) * (w / n);
    // Legs.
    for (const sx of [-1, 1])
      em.box(0.06, legs, 0.06, ...at(lx + sx * bw * 0.34, legs / 2, 0), m.dark, yaw);
    // Body and the sloped top, which is the shape that reads at distance.
    em.box(bw, body, d * 0.78, ...at(lx, legs + body / 2, 0), tint[i % tint.length], yaw);
    const lid = h * 0.14;
    em.box(bw * 1.04, lid, d * 0.82, ...at(lx, legs + body + lid / 2, -d * 0.04), m.dark, yaw + 0);
    // Window, and the coin door beneath it.
    em.box(bw * 0.7, body * 0.42, 0.02, ...at(lx, legs + body * 0.66, -d * 0.4), m.glass, yaw);
    em.box(bw * 0.5, body * 0.12, 0.02, ...at(lx, legs + body * 0.24, -d * 0.4), m.metal, yaw);
  }
}

function planter(em, x, z, yaw, w, h, d) {
  const m = em.mats,
    at = placer(x, z, yaw);
  em.box(w, h * 0.82, d, ...at(0, h * 0.41, 0), m.stone, yaw);
  em.box(w * 1.06, h * 0.1, d * 1.06, ...at(0, h * 0.86, 0), m.stone, yaw);
  em.box(w * 0.86, 0.06, d * 0.86, ...at(0, h * 0.9, 0), m.dark, yaw);
  // A shrub at this scale is a mass, not leaves: two offset volumes read
  // better than one, and better than any amount of detail.
  em.box(w * 0.74, h * 0.5, d * 0.68, ...at(0, h * 1.12, 0), m.shrub, yaw);
  em.box(w * 0.52, h * 0.36, d * 0.54, ...at(w * 0.15, h * 1.3, -d * 0.1), m.shrub, yaw + 0.5);
}

function pallets(em, x, z, yaw, w, h, d) {
  const m = em.mats,
    at = placer(x, z, yaw);
  for (const py of [0, h * 0.5]) {
    em.box(w, h * 0.05, d, ...at(0, py + h * 0.025, 0), m.crate, yaw);
    for (let i = 0; i < 3; i++)
      em.box(w, h * 0.06, d * 0.14, ...at(0, py + h * 0.08, -d * 0.36 + i * d * 0.36), m.crate, yaw);
  }
  // Shrink-wrapped load, with a strap round the middle.
  em.box(w * 0.92, h * 0.36, d * 0.92, ...at(0, h * 0.29, 0), m.barrier, yaw);
  em.box(w * 0.92, h * 0.36, d * 0.92, ...at(0, h * 0.79, 0), m.barrier, yaw);
  em.box(w * 0.96, 0.05, d * 0.96, ...at(0, h * 0.6, 0), m.emCyanDim, yaw);
}

const ROTATION = [newsBoxes, planter, pallets];

// Pick a prop for a crate footprint: long and low is a dumpster, the rest
// rotate through the set by index so neighbours differ. Deterministic in crate
// order, so a seed still builds the same square every time.
export function crateProp(em, index, x, z, yaw, w, h, d) {
  const longAndLow = w / h > 1.5 || d / h > 1.5;
  (longAndLow ? dumpster : ROTATION[index % ROTATION.length])(
    em,
    x,
    z,
    yaw,
    w,
    h,
    d,
  );
}
