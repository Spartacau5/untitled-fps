// Modular architectural detail, built into the same geometry batches as the
// walls. All ground-level trim stays within 8 cm of its supporting collider.
// Canopies and fire escapes have >3 m clearance above playable routes.
export function buildingDetail(view, b, index = 0) {
  const m = view.mats,
    brick = index % 2 === 0;
  const wall = brick ? m.brick : m.limestone;
  view._box(b.w, b.h, b.d, b.x, b.h / 2, b.z, wall);
  view._box(b.w + 0.06, 0.36, b.d + 0.06, b.x, 0.18, b.z, m.granite);
  const side = (yaw, width, x, z) => {
    const cs = Math.cos(yaw),
      sn = Math.sin(yaw);
    const box = (w, h, d, u, y, v, mat) =>
      view._box(w, h, d, x + cs * u + sn * v, y, z - sn * u + cs * v, mat, yaw);
    const sign = (title, sub, w, h, u, y, v, bg, fg) =>
      view._sign(
        title,
        sub,
        w,
        h,
        x + cs * u + sn * v,
        y,
        z - sn * u + cs * v,
        yaw,
        bg,
        fg,
      );
    // Pilasters give the facade real relief and split individual storefronts.
    const bays = Math.max(1, Math.floor(width / 3.2)),
      bay = width / bays;
    for (let i = 0; i <= bays; i++)
      box(0.2, b.h, 0.07, -width / 2 + i * bay, b.h / 2, 0.025, m.limestone);
    for (let i = 0; i < bays; i++) {
      const u = -width / 2 + (i + 0.5) * bay;
      box(bay - 0.28, 0.12, 0.08, u, 2.72, 0.03, m.frame);
      // Glazing is set behind the frames. Lit backplates suggest depth without
      // adding transparent layers or opaque scenery in walkable space.
      box(bay - 0.38, 2.4, 0.016, u, 1.43, 0.012, m.windowInterior);
      box(bay - 0.5, 2.22, 0.022, u, 1.44, 0.028, m.shopGlass);
      for (const du of [-bay * 0.25, 0, bay * 0.25])
        box(0.035, 2.42, 0.05, u + du, 1.43, 0.04, m.frame);
      box(bay - 0.4, 0.035, 0.055, u, 0.75, 0.045, m.frame);
      box(0.055, 0.38, 0.07, u + 0.14, 1.13, 0.046, m.brushed);
      if (i % 2 === 0)
        sign(
          "OPEN",
          "COFFEE / NEWS",
          0.42,
          0.26,
          u - 0.5,
          1.8,
          0.052,
          "#152b28",
          "#dccdae",
        );
      for (let y = 4.2; y + 1.5 < b.h; y += 2.8) {
        const ww = Math.min(1.25, bay - 0.5);
        box(ww + 0.22, 1.8, 0.04, u, y, 0.025, m.frame);
        box(
          ww,
          1.58,
          0.045,
          u,
          y,
          0.046,
          (i + Math.floor(y)) % 4 === 0 ? m.windowWarm : m.windowGlass,
        );
        box(0.045, 1.7, 0.08, u, y, 0.05, m.limestone);
        box(ww + 0.12, 0.045, 0.08, u, y + 0.1, 0.05, m.limestone);
        box(ww + 0.36, 0.13, 0.18, u, y - 0.91, 0.01, m.limestone);
        box(ww + 0.3, 0.16, 0.09, u, y + 0.98, 0.025, m.limestone);
        if ((i + Math.floor(y)) % 3 === 0) {
          box(0.58, 0.34, 0.18, u + 0.22, y - 0.55, 0.01, m.brushed);
          for (let k = 0; k < 6; k++)
            box(
              0.48,
              0.018,
              0.01,
              u + 0.22,
              y - 0.67 + k * 0.046,
              0.106,
              m.frame,
            );
        }
      }
    }
    box(width + 0.1, 0.24, 0.1, 0, 3.05, 0.03, m.limestone);
    box(width + 0.16, 0.24, 0.18, 0, b.h - 0.12, 0.02, m.granite);
    box(width + 0.08, 0.12, 0.1, 0, b.h + 0.055, 0.025, m.limestone);
  };
  side(Math.PI / 2, b.d, b.x + b.w / 2, b.z);
  side(-Math.PI / 2, b.d, b.x - b.w / 2, b.z);
  side(0, b.w, b.x, b.z + b.d / 2);
  side(Math.PI, b.w, b.x, b.z - b.d / 2);
  // Rooftop machinery silhouettes, not a second repetitive box tier.
  view._box(1.7, 0.7, 1.2, b.x, 0.4 + b.h, b.z, m.brushed);
  for (let k = 0; k < 7; k++)
    view._box(1.6, 0.04, 0.035, b.x, 0.79 + b.h, b.z - 0.5 + k * 0.16, m.frame);
}

export function fireEscape(v, x, z, yaw, height) {
  const m = v.mats,
    c = Math.cos(yaw),
    s = Math.sin(yaw);
  const box = (w, h, d, u, y, q, mat = m.frame) =>
    v._box(w, h, d, x + c * u + s * q, y, z - s * u + c * q, mat, yaw);
  for (let y = 4; y < height - 1; y += 2.8) {
    box(2.9, 0.09, 0.85, 0, y, 0.48);
    for (const u of [-1.4, 1.4]) box(0.04, 0.95, 0.04, u, y + 0.5, 0.9);
    box(2.9, 0.04, 0.04, 0, y + 0.98, 0.9);
    for (let u = -1.25; u < 1.3; u += 0.22)
      box(0.018, 0.9, 0.018, u, y + 0.49, 0.9);
    for (let k = 0; k < 9; k++)
      box(0.52, 0.025, 0.17, -1.1 + k * 0.23, y + k * 0.3, 0.46);
  }
}

export function busDetail(v, b) {
  const m = v.mats,
    c = Math.cos(b.yaw),
    s = Math.sin(b.yaw);
  const box = (w, h, d, x, y, z, mat) =>
    v._box(w, h, d, b.x + c * x + s * z, y, b.z - s * x + c * z, mat, b.yaw);
  // Panel joints, wipers, glazing mullions and wheel hubs are all small enough
  // to stay in the existing vehicle collision envelope.
  for (const side of [-1, 1]) {
    for (const z of [-4.6, -2, 1.1, 4])
      box(0.018, 0.65, 0.018, side * 1.355, 0.69, z, m.frame);
    for (let z = -4.7; z < 4.8; z += 0.6)
      box(0.02, 0.045, 0.3, side * 1.352, 0.47, z, m.brushed);
    for (const z of [-3.25, 3.25]) {
      box(0.022, 0.44, 0.44, side * 1.347, 0.49, z, m.brushed);
      for (const dz of [-0.13, 0.13])
        box(0.027, 0.06, 0.06, side * 1.36, 0.49, z + dz, m.frame);
    }
    for (const z of [3.6, 4.3])
      box(0.024, 1.8, 0.035, side * 1.359, 1.45, z, m.frame);
  }
  box(2.4, 0.14, 0.06, 0, 0.3, -5.25, m.frame);
  box(2.4, 0.14, 0.06, 0, 0.3, 5.25, m.frame);
  box(0.035, 1.18, 0.04, 0, 1.88, -5.24, m.frame);
  for (const x of [-0.58, 0.58])
    box(0.04, 0.55, 0.04, x, 1.62, -5.245, m.frame);
  box(1.5, 0.17, 2.6, 0, 3.11, 0.5, m.brushed);
  for (let z = -0.65; z < 1.8; z += 0.18)
    box(1.3, 0.025, 0.04, 0, 3.21, z, m.frame);
  for (const x of [-1, 1]) box(0.18, 0.2, 0.035, x, 0.9, 5.26, m.tailLamp);
}
