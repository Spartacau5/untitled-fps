import {
  CylinderGeometry,
  ConeGeometry,
  PlaneGeometry,
  MeshStandardMaterial,
  CanvasTexture,
  SRGBColorSpace,
} from "three";
import { MIDTOWN } from "../../data/midtown.js";

export function districtDetails(view) {
  const m = view.mats;
  // Roof silhouettes sit above the playable buildings and share material batches.
  for (const id of ["hotel", "stage-door", "theater"]) {
    const b = MIDTOWN.solids.find((b) => b.id === id);
    const y = b.h + 2.5;
    const tank = new CylinderGeometry(1.2, 1.2, 2.4, 20);
    tank.translate(b.x, y, b.z);
    view._batch(tank, m.crate);
    const roof = new ConeGeometry(1.3, 0.65, 20);
    roof.translate(b.x, y + 1.5, b.z);
    view._batch(roof, m.frame);
    for (const height of [-0.85, 0, 0.85]) {
      const band = new CylinderGeometry(1.215, 1.215, 0.065, 20, 1, true);
      band.translate(b.x, y + height, b.z);
      view._batch(band, m.brushed);
    }
    for (const x of [-0.85, 0.85])
      for (const z of [-0.85, 0.85])
        view._box(0.09, 1.35, 0.09, b.x + x, b.h + 0.675, b.z + z, m.frame);
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 10)
      view._box(
        0.015,
        2.3,
        0.03,
        b.x + Math.sin(angle) * 1.205,
        y,
        b.z + Math.cos(angle) * 1.205,
        m.dark,
        angle,
      );
  }
  // High traffic signals use existing pole positions, with ample headroom.
  for (const side of [-1, 1]) {
    const x = side * 26.1,
      z = -2;
    view._box(3.6, 0.07, 0.07, x - side * 1.6, 4.4, z, m.frame);
    view._box(0.32, 0.92, 0.24, x - side * 3.2, 4.0, z, m.yellow);
    for (let i = 0; i < 3; i++) {
      const lamp = new CylinderGeometry(0.093, 0.093, 0.026, 12);
      lamp.rotateX(Math.PI / 2);
      lamp.translate(x - side * 3.2, 4.27 - i * 0.27, z - 0.135);
      view._batch(lamp, i === 0 ? m.tailLamp : m.dark);
    }
    // A subway identity sign sits flush against the boundary, not in a lane.
    view._sign(
      "SUBWAY",
      "42 ST / TIMES SQ   N Q R W",
      3.8,
      0.65,
      side * 26.91,
      2.5,
      8,
      (-side * Math.PI) / 2,
      "#151a19",
      "#e5dfc7",
    );
    for (const z0 of [-31, 16, 31]) {
      // Wall-mounted conduit and junction box, all within the collision skin.
      view._box(0.04, 2.8, 0.035, side * 26.97, 1.4, z0, m.brushed);
      view._box(0.065, 0.46, 0.32, side * 26.94, 1.55, z0, m.metal);
    }
  }
  roadWear(view);
}

function roadWear(view) {
  // A small shared decal sheet gives road repairs broken, feathered edges.
  // Repeated quads are merged into one draw; no new collision or dynamic light.
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#454745";
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2,
      r = 49 + Math.sin(i * 7.1) * 7;
    const x = 64 + Math.cos(a) * r,
      y = 64 + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  let seed = 17;
  for (let i = 0; i < 1800; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const x = seed % 128;
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const y = seed % 128;
    ctx.fillStyle = i % 2 ? "#ffffff12" : "#00000016";
    ctx.fillRect(x, y, 1, 1);
  }
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  const material = new MeshStandardMaterial({
    map,
    color: 0x8a8d88,
    roughness: 0.91,
    alphaTest: 0.5,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  for (const [x, z, w, d, yaw] of [
    [-5, -25, 3.1, 1.4, 0.2],
    [6, 5, 1.4, 4.5, -0.2],
    [-5, 19, 2.5, 1.2, -0.3],
    [1, -17, 2, 1, 0.3],
    [0, 29, 2.5, 1.2, 0.1],
  ]) {
    const geometry = new PlaneGeometry(w, d);
    geometry.rotateX(-Math.PI / 2);
    geometry.rotateY(yaw);
    geometry.translate(x, 0.004, z);
    view._batch(geometry, material);
  }
}
