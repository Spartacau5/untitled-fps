import {
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  CanvasTexture,
  PlaneGeometry,
  CylinderGeometry,
  PointLight,
  Group,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { streetMaterial } from "./city/surface-materials.js";
import { buildingDetail, fireEscape, busDetail } from "./city/architecture.js";
import { ArenaView } from "./arena-view.js";
import { MIDTOWN } from "../data/midtown.js";
import { CAMPAIGNS } from "./city/ads.js";
import { facadeTexture } from "./city/textures.js";

// Playable art blockout. Buildings, buses and street furniture follow the
// collision manifest. Fine trim is decorative and stays inside those solids.
export class MidtownView extends ArenaView {
  _materials() {
    // Skip the old arena's unused 1024px wet pavement and shutter textures.
    const mat = (color, roughness = 0.85, metalness = 0) =>
      new MeshStandardMaterial({ color, roughness, metalness });
    const m = (this.mats = {
      dark: mat(0x292b29),
      pillar: mat(0x535551),
      crate: mat(0x5f685e),
      barrier: mat(0x92918a),
      stone: mat(0x9a978c),
      paint: mat(0xb7b5a4),
      yellow: mat(0xc69e3c),
      red: mat(0x864336),
      glass: mat(0x465559, 0.3, 0.22),
      floor: streetMaterial("concrete", 0x8d8e87),
      shedGreen: mat(0x3e4c3b),
      shedGrey: mat(0x737779),
      shedWhite: mat(0xb1b0a6),
      netting: mat(0x3c4b55),
      shrub: mat(0x4e5840),
      shutter: mat(0x797974, 0.7, 0.15),
      emCyan: mat(0x819498),
      emCyanDim: mat(0x7e8685),
      emOrange: new MeshStandardMaterial({
        color: 0xd5ab6c,
        emissive: 0xd79a4a,
        emissiveIntensity: 0.2,
      }),
      emWhite: new MeshStandardMaterial({
        color: 0xd4cdbb,
        emissive: 0xffd9a1,
        emissiveIntensity: 0.4,
      }),
    });
    this.facades = [0, 1, 2, 3].map(
      (i) =>
        new MeshStandardMaterial({
          map: facadeTexture(i),
          roughness: 0.86,
          metalness: 0.05,
        }),
    );
    this.signs = new Map();
    this.ledMats = [];
    this.tickers = [];
    this.boardMaps = new Map();
    this.tickerMap = null;
    m.asphalt = streetMaterial("asphalt", 0x474b4c);
    m.brick = streetMaterial("brick", 0x827067);
    m.limestone = streetMaterial("stone", 0x969186);
    m.granite = streetMaterial("stone", 0x555e62);
    m.brushed = streetMaterial("metal", 0x838c91, { metalness: 0.62 });
    m.wall = streetMaterial("concrete", 0x8e928d);
    m.metal = streetMaterial("metal", 0x65706e, { metalness: 0.22 });
    m.frame = new MeshStandardMaterial({
      color: 0x263036,
      roughness: 0.6,
      metalness: 0.35,
    });
    m.windowGlass = new MeshStandardMaterial({
      color: 0x29424c,
      roughness: 0.19,
      metalness: 0.42,
    });
    m.windowWarm = new MeshStandardMaterial({
      color: 0x594c39,
      roughness: 0.35,
      emissive: 0x967751,
      emissiveIntensity: 0.22,
    });
    m.windowInterior = new MeshStandardMaterial({
      color: 0x262522,
      roughness: 0.9,
    });
    m.shopGlass = new MeshStandardMaterial({
      color: 0x334446,
      roughness: 0.27,
      metalness: 0.25,
    });
    m.tailLamp = new MeshStandardMaterial({
      color: 0x541512,
      roughness: 0.22,
      emissive: 0xff3920,
      emissiveIntensity: 0.5,
    });
  }
  _box(w, h, d, x, y, z, mat, yaw = 0) {
    // Bevels catch grazing light on the props nearest the player's eyes.
    const rounded =
      Math.min(w, h, d) > 0.25 &&
      Math.max(w, h, d) < 13 &&
      [this.mats.paint, this.mats.brushed, this.mats.metal].includes(mat);
    if (!rounded) return super._box(w, h, d, x, y, z, mat, yaw);
    const g = new RoundedBoxGeometry(
      w,
      h,
      d,
      1,
      Math.min(0.045, Math.min(w, h, d) * 0.12),
    );
    // RoundedBoxGeometry is non-indexed, while the other batched primitives
    // are indexed. Normalize it before the shared material batch is merged.
    g.setIndex(
      Array.from({ length: g.attributes.position.count }, (_, i) => i),
    );
    g.rotateY(yaw);
    g.translate(x, y, z);
    this._batch(g, mat);
  }
  _flush() {
    const start = this.scene.children.length;
    super._flush();
    // Only structural masses cast district shadows. Tiny mullions, curb paint
    // and chrome strips do not need a second geometry pass every frame.
    const casters = [
      this.mats.brick,
      this.mats.limestone,
      this.mats.wall,
      this.mats.metal,
      this.mats.paint,
      this.mats.granite,
      this.mats.shedGreen,
      ...(this.facades || []),
    ];
    for (const mesh of this.scene.children.slice(start))
      mesh.castShadow = casters.includes(mesh.material);
  }

  _ground() {
    const m = this.mats;
    // Adjacent strips share y=0 with collision. No coplanar overlapping boxes.
    for (const [left, right, material] of [
      [-45, -27, m.asphalt],
      [-27, -18, m.floor],
      [-18, 18, m.asphalt],
      [18, 27, m.floor],
      [27, 45, m.asphalt],
    ]) {
      const ground = new Mesh(new PlaneGeometry(right - left, 110), material);
      ground.rotation.x = -Math.PI / 2;
      ground.position.x = (left + right) / 2;
      ground.receiveShadow = true;
      ground.name = "midtown-ground";
      ground.userData.span = [left, right];
      this.scene.add(ground);
    }
    // Expansion joints and drainage channels anchor the street at human scale.
    for (const x of [-18, 18]) {
      for (let z = -34; z < 35; z += 1.25)
        this._box(0.22, 0.065, 1.2, x, 0.025, z, m.limestone);
      for (const z of [-22, 0, 22]) {
        this._box(
          0.36,
          0.009,
          0.65,
          x + (x < 0 ? 0.25 : -0.25),
          0.019,
          z,
          m.frame,
        );
        for (let k = 0; k < 8; k++)
          this._box(
            0.34,
            0.012,
            0.025,
            x + (x < 0 ? 0.25 : -0.25),
            0.025,
            z - 0.28 + k * 0.08,
            m.brushed,
          );
      }
    }
    for (const z of [-20, 20]) {
      const cover = new CylinderGeometry(0.56, 0.56, 0.012, 32);
      cover.translate(1, 0.021, z);
      this._batch(cover, m.brushed);
      for (let k = -4; k <= 4; k++)
        this._box(0.72, 0.012, 0.025, 1, 0.03, z + k * 0.1, m.frame);
    }
    for (const z of [-14, 13]) {
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
      buildingDetail(this, b, b.x < 0 ? 0 : 1);
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
    MIDTOWN.solids
      .filter((b) => b.kind !== "facade")
      .forEach((b, index) => {
        if (b.kind === "hoarding") {
          this._box(b.w, b.h, b.d, b.x, b.h / 2, b.z, m.shedGreen);
          this._box(b.w + 0.02, 0.12, b.d + 0.02, b.x, 0.12, b.z, m.limestone);
          for (let x = -2.8; x < 3; x += 1.4)
            this._box(0.075, b.h, b.d + 0.025, b.x + x, b.h / 2, b.z, m.frame);
          for (const side of [-1, 1]) {
            this._box(
              b.w,
              0.13,
              0.035,
              b.x,
              0.85,
              b.z + side * (b.d / 2 + 0.025),
              m.yellow,
            );
            this._sign(
              "MIDTOWN WORKS",
              "PEDESTRIAN ACCESS",
              2.5,
              0.5,
              b.x,
              2.1,
              b.z + side * (b.d / 2 + 0.03),
              side < 0 ? Math.PI : 0,
              "#233f37",
              "#d6cfb8",
            );
          }
          return;
        }
        if (b.kind === "step" || b.kind === "platform") {
          this._box(b.w, b.h - 0.035, b.d, b.x, (b.h - 0.035) / 2, b.z, m.wall);
          for (let z = -b.d / 2 + 0.15; z < b.d / 2; z += 0.3)
            this._box(b.w, 0.035, 0.27, b.x, b.h - 0.0175, b.z + z, m.stone);
          this._box(
            b.w,
            0.08,
            0.02,
            b.x,
            b.h - 0.08,
            b.z + b.d / 2 + 0.015,
            m.yellow,
          );
          return;
        }
        if (b.kind === "bus") {
          this._bus(b);
          busDetail(this, b);
          return;
        }
        if (b.kind === "shop" || b.kind === "theater") {
          buildingDetail(this, b, index);
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
          for (const side of [-1, 1])
            this._sign(
              name,
              b.kind === "theater" ? "TONIGHT ON BROADWAY" : "NEW YORK CITY",
              Math.min(b.d - 1, 6),
              0.72,
              b.x + side * (b.w / 2 + 0.09),
              3.12,
              b.z,
              (side * Math.PI) / 2,
              "#222c2d",
              "#e0d5bd",
            );
          if (b.kind === "theater") {
            this._box(3, 0.19, b.d, -19, 3.65, b.z, m.frame);
            this._box(0.12, 0.55, b.d, -20.45, 3.87, b.z, m.brushed);
            for (let z = -25; z < -10; z += 0.42)
              this._box(0.075, 0.025, 0.075, -20.43, 3.54, z, m.emWhite);
            fireEscape(this, b.x + b.w / 2, b.z, Math.PI / 2, b.h);
          } else if (b.h >= 6)
            fireEscape(this, b.x - b.w / 2, b.z, -Math.PI / 2, b.h);
          return;
        }
        if (b.kind === "lamp") {
          const pole = new CylinderGeometry(0.07, 0.12, b.h, 10);
          pole.translate(b.x, b.h / 2, b.z);
          this._batch(pole, m.brushed);
          this._box(0.5, 0.12, 0.5, b.x, 0.06, b.z, m.granite);
          this._box(0.18, 0.14, 0.62, b.x, b.h, b.z, m.frame);
          this._box(0.13, 0.025, 0.5, b.x, b.h - 0.085, b.z, m.emWhite);
          return;
        }
        const planter = b.kind === "planter";
        this._box(
          b.w,
          b.h,
          b.d,
          b.x,
          b.h / 2,
          b.z,
          planter ? m.granite : m.metal,
        );
        this._box(
          b.w + 0.04,
          0.09,
          b.d + 0.04,
          b.x,
          b.h,
          b.z,
          planter ? m.limestone : m.brushed,
        );
        if (planter) {
          this._box(b.w - 0.18, 0.03, b.d - 0.18, b.x, b.h + 0.01, b.z, m.dark);
          // Small inset planting tufts, all inside the planter footprint.
          for (let k = 0; k < 8; k++)
            this._box(
              0.07,
              0.23 + (k % 3) * 0.07,
              0.07,
              b.x - b.w * 0.4 + k * b.w * 0.1,
              b.h + 0.1,
              b.z + (k % 2 ? 0.15 : -0.15),
              m.shedGreen,
            );
        } else {
          for (let k = 0; k < 9; k++)
            this._box(
              b.w * 0.7,
              0.025,
              0.016,
              b.x,
              b.h * 0.45 + k * 0.07,
              b.z + b.d / 2 + 0.012,
              m.brushed,
            );
          this._sign(
            b.kind === "kiosk" ? "CITY MAP" : "NYC SERVICE",
            "KEEP CLEAR",
            Math.min(b.w - 0.2, 3),
            0.42,
            b.x,
            b.h * 0.85,
            b.z + b.d / 2 + 0.019,
            0,
            "#23343a",
            "#cbd5d5",
          );
        }
      });
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
    const m = this.mats;
    // Shared soft contact shadow. It adds grounding even on the mobile tier;
    // directional shadows still provide the actual building and vehicle shape.
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d"),
      gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    gradient.addColorStop(0, "rgba(6,12,17,.62)");
    gradient.addColorStop(0.65, "rgba(6,12,17,.35)");
    gradient.addColorStop(1, "rgba(6,12,17,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const shadow = new MeshBasicMaterial({
      map: new CanvasTexture(canvas),
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
    for (const b of MIDTOWN.solids.filter((b) => b.kind !== "facade")) {
      const g = new PlaneGeometry(b.w + 1.2, b.d + 1.2);
      g.rotateX(-Math.PI / 2);
      g.rotateY(b.yaw);
      g.translate(b.x, 0.035, b.z);
      const mesh = new Mesh(g, shadow);
      mesh.renderOrder = 1;
      this.scene.add(mesh);
    }
    // Route signage belongs to the district rather than the match rules.
    this._sign(
      "BROADWAY",
      "W 45 ST",
      2.7,
      0.48,
      -8,
      3.4,
      14,
      0,
      "#23503d",
      "#e4e6da",
    );
    this._sign(
      "7 AV",
      "W 45 ST",
      2.7,
      0.48,
      18,
      3.4,
      14,
      0,
      "#23503d",
      "#e4e6da",
    );
    for (const z of [-30, 30]) {
      this._box(1.3, 0.48, 0.04, -26.94, 1.7, z, m.frame, Math.PI / 2);
      this._sign(
        "NO STANDING",
        "ANYTIME",
        0.6,
        0.9,
        -26.89,
        2.1,
        z,
        Math.PI / 2,
        "#d0cabe",
        "#882d27",
      );
    }
  }
  _lights() {
    super._lights();
    this.sun.intensity = 1.75;
    this.scene.children
      .filter((o) => o.isHemisphereLight)
      .forEach((o) => (o.intensity = 1.15));
    this.scene.fog.density = 0.0028;
    // Two restrained local pools under the canopy and the deli awning.
    // Desktop only; avoids placing a point light at every window or billboard.
    if (!this.mobile)
      for (const [x, z, color] of [
        [-20, -18, 0xffc890],
        [-18.1, 3, 0xb9d9d9],
      ]) {
        const light = new PointLight(color, 18, 8, 2);
        light.position.set(x, 3.15, z);
        this.scene.add(light);
      }
  }
  syncMatch() {}
}
