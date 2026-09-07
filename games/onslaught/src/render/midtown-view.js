import { Mesh, MeshBasicMaterial, RingGeometry, CylinderGeometry } from "three";
import { ArenaView } from "./arena-view.js";
import { MIDTOWN } from "../data/midtown.js";
import { CAMPAIGNS } from "./city/ads.js";

// Playable art blockout. Buildings, buses and street furniture follow the
// collision manifest. Fine trim is decorative and stays inside those solids.
export class MidtownView extends ArenaView {
  _ground() {
    const m = this.mats;
    this._box(90, 0.2, 110, 0, -0.11, 0, m.asphalt);
    for (const x of [-22, 22]) this._box(10, 0.018, 70, x, -0.002, 0, m.floor);
    for (const z of [-14, 13]) {
      this._box(54, 0.015, 4, 0, 0.003, z, m.floor);
      for (let x = -6; x <= 6; x += 1.25)
        this._box(0.6, 0.012, 3, x, 0.018, z, m.paint);
    }
    for (let z = -32; z < 34; z += 6) {
      this._box(0.1, 0.01, 2.6, -6.5, 0.012, z, m.yellow);
      this._box(0.1, 0.01, 2.6, 6.5, 0.012, z, m.yellow);
    }
  }
  _boundary(arena) {
    this.arena = arena;
    const m = this.mats;
    for (const b of MIDTOWN.solids.filter((b) => b.kind === "facade")) {
      this._box(b.w, b.h, b.d, b.x, b.h / 2, b.z, this.facades[1]);
      this._box(b.w, 0.3, b.d, b.x, 3.7, b.z, m.stone);
    }
    this._sign("W 46 ST", "THEATER DISTRICT", 5, 1.1, -8, 4, -34.95);
    this._sign("W 44 ST", "MIDTOWN CROSSING", 5, 1.1, 8, 4, 34.95, Math.PI);
    // Shallow shop recesses drawn on the boundary, no invisible blocking props.
    for (const side of [-1, 1])
      for (const z of [-25, -12, 1, 14, 27]) {
        this._box(0.035, 2.7, 3.5, side * 26.98, 1.35, z, m.glass);
        this._sign(
          side < 0 ? "STAGE DOOR" : "7 AV MARKET",
          "MIDTOWN / NEW YORK",
          5,
          0.9,
          side * 26.95,
          3.2,
          z,
          (-side * Math.PI) / 2,
        );
      }
  }
  _cover() {
    const m = this.mats;
    for (const b of MIDTOWN.solids.filter((b) => b.kind !== "facade")) {
      if (b.kind === "bus") {
        this._bus(b);
        continue;
      }
      const facade = b.kind === "shop" || b.kind === "theater";
      this._box(
        b.w,
        b.h,
        b.d,
        b.x,
        b.h / 2,
        b.z,
        facade
          ? this.facades[b.kind === "theater" ? 0 : 2]
          : b.kind === "planter"
            ? m.stone
            : m.metal,
      );
      if (facade) {
        this._box(b.w + 0.08, 0.18, b.d + 0.08, b.x, b.h, b.z, m.stone);
        for (const side of [-1, 1]) {
          const x = b.x + side * (b.w / 2 + 0.02);
          this._box(0.03, 2.2, b.d - 2, x, 1.4, b.z, m.glass);
          const name =
            b.kind === "theater"
              ? "THE LYRIC"
              : b.id === "deli"
                ? "46 DELI"
                : b.id === "newsstand"
                  ? "CITY PRESS"
                  : b.id === "hotel"
                    ? "HOTEL ASTER"
                    : "MIDTOWN";
          this._sign(
            name,
            b.kind === "theater"
              ? "TONIGHT / LIVE ON BROADWAY"
              : "NEW YORK CITY",
            b.d - 1,
            0.9,
            x + side * 0.025,
            3,
            b.z,
            (side * Math.PI) / 2,
          );
        }
        if (b.kind === "theater") {
          // Overhead canopy: safe walkable clearance, not chest-high cover.
          this._box(3, 0.16, b.d, -19, 3.6, b.z, m.dark);
          for (let z = -25; z < -10; z += 1)
            this._box(0.1, 0.03, 0.18, -20.4, 3.5, z, m.emWhite);
        }
      } else if (b.kind === "planter") {
        this._box(b.w - 0.2, 0.02, b.d - 0.2, b.x, b.h + 0.01, b.z, m.dark);
      } else {
        this._sign(
          b.kind === "kiosk" ? "CITY MAP" : "NYC SERVICE",
          "KEEP CLEAR",
          Math.min(b.w - 0.2, 3),
          0.65,
          b.x,
          b.h * 0.65,
          b.z + b.d / 2 + 0.015,
        );
      }
    }
  }
  _bus(b) {
    const m = this.mats,
      c = Math.cos(b.yaw),
      s = Math.sin(b.yaw);
    const part = (w, h, d, x, y, z, mat) =>
      this._box(
        w,
        h,
        d,
        b.x + c * x + s * z,
        y,
        b.z - s * x + c * z,
        mat,
        b.yaw,
      );
    part(b.w, 1.12, b.d, 0, 0.7, 0, m.paint);
    part(b.w - 0.05, 1.24, b.d - 0.06, 0, 1.86, 0, m.glass);
    part(b.w, 0.62, b.d, 0, 2.79, 0, m.paint);
    part(b.w + 0.01, 0.22, b.d, 0, 1.14, 0, m.shedGreen);
    for (const side of [-1, 1]) {
      for (let z = -4.6; z < 4.8; z += 1.3)
        part(0.05, 1.3, 0.07, side * 1.35, 1.86, z, m.metal);
      for (const z of [-3.25, 3.25]) {
        const wheel = new CylinderGeometry(0.48, 0.48, 0.18, 16);
        wheel.rotateZ(Math.PI / 2);
        wheel.translate(side * 1.25, 0.49, z);
        wheel.rotateY(b.yaw);
        wheel.translate(b.x, 0, b.z);
        this._batch(wheel, m.dark);
      }
    }
    for (const x of [-0.93, 0.93])
      part(0.3, 0.14, 0.025, x, 0.85, -5.26, m.emWhite);
    const z = -5.27;
    this._sign(
      "M42",
      "CROSSTOWN",
      2.2,
      0.46,
      b.x + s * z,
      2.65,
      b.z + c * z,
      b.yaw + Math.PI,
      "#121a1d",
      "#ffd47c",
    );
  }
  _skyline() {
    const m = this.mats;
    for (const side of [-1, 1])
      for (let i = 0; i < 5; i++) {
        const x = side * (35 + (i % 2) * 3),
          z = -32 + i * 16,
          h = 25 + ((i * 13) % 32);
        this._box(13, h, 14, x, h / 2, z, this.facades[i % 4]);
        this._box(11, 2, 12, x, h + 1, z, m.stone);
        if (i % 2 === 0)
          this._board(
            CAMPAIGNS[i % CAMPAIGNS.length],
            10,
            7,
            x - side * 6.55,
            14,
            z,
            (-side * Math.PI) / 2,
            i,
          );
      }
    this._box(14, 65, 12, 0, 32.5, -47, this.facades[3]);
    this._box(9, 12, 9, 0, 71, -47, this.facades[1]);
    this._board(CAMPAIGNS[1], 12, 8, 0, 18, -40.9);
    this._board(CAMPAIGNS[2], 12, 8, 0, 29, -40.9);
    this._ticker(13, 1, 0, 11, -40.85, 0);
  }
  _streetDetails() {
    this.rings = MIDTOWN.objectives.map((p) => {
      const mesh = new Mesh(
        new RingGeometry(p.radius - 0.09, p.radius, 64),
        new MeshBasicMaterial({
          color: 0x96c8d4,
          transparent: true,
          opacity: 0.65,
          depthWrite: false,
        }),
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(p.x, 0.028, p.z);
      this.scene.add(mesh);
      return mesh;
    });
  }
  syncMatch(match) {
    for (let i = 0; i < this.rings.length; i++) {
      const ring = this.rings[i];
      ring.visible = i === match.index && !match.finished;
      ring.material.color.set(
        match.owner === "player"
          ? 0x79dacc
          : match.owner === "robots"
            ? 0xec806d
            : match.owner === "contested"
              ? 0xf4cb76
              : 0xdde9ed,
      );
    }
  }
}
