import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  FogExp2,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  TorusGeometry,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { damp } from "../core/mathx.js";
import { ARENA_RADIUS, SUN_DIR, WALL_HEIGHT } from "../data/tuning.js";
import { theme } from "../theme/theme.js";
import { createPortalMaterial } from "./portal.js";
import { applySurfaceGrime } from "./shaders/surface.js";
import {
  CAMPAIGNS,
  STOREFRONTS,
  TICKER,
  TICKER_SEPARATOR,
  TOWER_CAMPAIGNS,
} from "./city/ads.js";
import {
  adImageTexture,
  facadeTexture,
  pavementTexture,
  shutterTexture,
  signTexture,
  tickerTexture,
} from "./city/textures.js";
import { applyLedPanel, updateLedPanels } from "./shaders/led.js";

// Gate status lamps: red while the door is sealed, green for exactly as long
// as it is open. Allocated once at module scope — lerping into a scratch Color
// every frame for six gates would churn garbage.
const LAMP_SHUT = new Color(0xff462b);
const LAMP_OPEN = new Color(0x35ff6a);
const LAMP_BODY_SHUT = new Color(0x91372a);
const LAMP_BODY_OPEN = new Color(0x2a9143);

// Times Square-inspired art on the ORIGINAL collision footprint. Solid cover,
// wall segments and gate recesses retain their original dimensions/transforms.
// Skyline and decorative details beyond the boundary are presentation only.
export class ArenaView {
  constructor(scene, arena) {
    this.scene = scene;
    this.gateViews = [];
    this.batches = new Map();
    this._materials();
    this._ground();
    this._boundary(arena);
    this._cover(arena);
    this._skyline();
    this._streetDetails();
    this._lights();
    this._flush();
  }
  _materials() {
    const mat = (color, roughness = 0.8, metalness = 0) =>
      new MeshStandardMaterial({ color, roughness, metalness });
    const a = theme.arena;
    this.mats = {
      wall: mat(a.concrete),
      dark: mat(a.dark, 0.55, 0.45),
      pillar: mat(a.pillar, 0.55, 0.5),
      crate: mat(a.crate, 0.48, 0.65),
      barrier: mat(a.barrier),
      metal: mat(0x333c43, 0.42, 0.75),
      stone: mat(0xaaa9a4),
      paint: mat(0xd8d7cc),
      yellow: mat(0xeab946),
      red: mat(0x9a2830, 0.5),
      glass: mat(0x172b37, 0.23, 0.62),
      floor: new MeshStandardMaterial({
        map: pavementTexture(),
        color: 0xcccccc,
        roughness: 0.78,
      }),
      asphalt: mat(0x303639, 0.94),
      shutter: new MeshStandardMaterial({
        map: shutterTexture(),
        roughness: 0.6,
        metalness: 0.4,
      }),
      emCyan: new MeshStandardMaterial({
        color: 0x233441,
        emissive: 0x94bfd4,
        emissiveIntensity: 0.4,
      }),
      emCyanDim: mat(0xa5adb0, 0.5, 0.3),
      emOrange: new MeshStandardMaterial({
        color: 0xe9ac3e,
        emissive: 0xff9e30,
        emissiveIntensity: 0.3,
      }),
      emWhite: new MeshStandardMaterial({
        color: 0xdfe6ea,
        emissive: 0xe4f2ff,
        emissiveIntensity: 0.65,
      }),
    };
    for (const name of ["wall", "barrier", "stone", "asphalt"])
      applySurfaceGrime(this.mats[name], {
        scale: name === "asphalt" ? 4 : 0.8,
        streaks: name === "asphalt" ? 0 : 0.45,
        key: `city-${name}`,
      });
    this.facades = [0, 1, 2, 3].map(
      (i) =>
        new MeshStandardMaterial({
          map: facadeTexture(i),
          roughness: i === 3 ? 0.4 : 0.78,
          metalness: i === 3 ? 0.3 : 0.08,
        }),
    );
    this.signs = new Map();
    // Materials with a motion shader, advanced together in update().
    this.ledMats = [];
    this.tickers = [];
    // Campaign bitmaps, shared across every board running that campaign.
    this.boardMaps = new Map();
    this.tickerMap = null;
  }
  _box(w, h, d, x, y, z, material, yaw = 0) {
    const geo = new BoxGeometry(w, h, d);
    geo.rotateY(yaw);
    geo.translate(x, y, z);
    this._batch(geo, material);
  }
  _batch(geo, material) {
    if (!this.batches.has(material)) this.batches.set(material, []);
    this.batches.get(material).push(geo);
  }
  _flush() {
    for (const [mat, parts] of this.batches) {
      const mesh = new Mesh(mergeGeometries(parts, false), mat);
      mesh.castShadow = mesh.receiveShadow = true;
      this.scene.add(mesh);
      for (const part of parts) part.dispose();
    }
    this.batches.clear();
  }
  _sign(
    title,
    subtitle,
    w,
    h,
    x,
    y,
    z,
    yaw = 0,
    bg = "#152934",
    fg = "#f2eee0",
    art = false,
  ) {
    const key = [title, subtitle, bg, fg, art].join("|");
    if (!this.signs.has(key)) {
      const map = signTexture(title, subtitle, bg, fg, art);
      this.signs.set(
        key,
        new MeshStandardMaterial({
          map,
          emissiveMap: map,
          emissive: 0xffffff,
          emissiveIntensity: art ? 0.65 : 0.16,
          roughness: 0.62,
          metalness: 0,
        }),
      );
    }
    const geo = new PlaneGeometry(w, h);
    geo.rotateY(yaw);
    geo.translate(x, y, z);
    this._batch(geo, this.signs.get(key));
  }
  // A board running one of the campaigns from city/ads.js. Unlike _sign these
  // are not batched: each carries its own motion shader and its own clock, so
  // they have to stay separate meshes.
  _board(campaign, w, h, x, y, z, yaw = 0, phase = 0) {
    // Draw each campaign once and share the bitmap. Twenty boards run six
    // campaigns, and a 1024x512 RGBA texture with mipmaps is ~2.8 MiB, so
    // redrawing per board cost about 39 MiB of GPU memory for nothing. The
    // material still has to be per-board: each carries its own motion clock.
    if (!this.boardMaps.has(campaign.id))
      this.boardMaps.set(
        campaign.id,
        signTexture(
          campaign.headline,
          campaign.subline || "",
          campaign.bg,
          campaign.fg,
          campaign.art !== false,
        ),
      );
    const map = this.boardMaps.get(campaign.id);
    const mat = new MeshStandardMaterial({
      map,
      emissiveMap: map,
      emissive: 0xffffff,
      emissiveIntensity: 0.72,
      roughness: 0.62,
      metalness: 0,
    });
    // Player artwork replaces the drawn card if the file is there. Swapping
    // both maps keeps the panel lit by its own image.
    if (campaign.image)
      adImageTexture(campaign.image, (tex) => {
        ((mat.map = tex), (mat.emissiveMap = tex), (mat.needsUpdate = !0));
      });
    if (campaign.motion) {
      applyLedPanel(mat, { motion: campaign.motion, phase });
      this.ledMats.push(mat);
    }
    const mesh = new Mesh(new PlaneGeometry(w, h), mat);
    (mesh.position.set(x, y, z), (mesh.rotation.y = yaw), this.scene.add(mesh));
    return mesh;
  }
  // The crawling news strip. One wrapped texture per message, scrolled by
  // offset -- no canvas is ever redrawn.
  _ticker(w, h, x, y, z, yaw, speed = 0.06) {
    // Every strip runs the same message. One bitmap, cloned per strip so each
    // keeps its own offset and repeat -- clones share the underlying image, so
    // eighteen strips cost one upload rather than eighteen.
    if (!this.tickerMap)
      this.tickerMap = tickerTexture(
        TICKER.join(TICKER_SEPARATOR) + TICKER_SEPARATOR,
      );
    const map = this.tickerMap.clone();
    map.needsUpdate = !0;
    // Repeat so the strip reads at a legible size on a wide panel rather than
    // stretching one pass of the text across the whole board.
    map.repeat.set(w / (h * 9), 1);
    const mat = new MeshStandardMaterial({
      map,
      emissiveMap: map,
      emissive: 0xffffff,
      emissiveIntensity: 0.95,
      roughness: 0.55,
      metalness: 0,
    });
    const mesh = new Mesh(new PlaneGeometry(w, h), mat);
    (mesh.position.set(x, y, z), (mesh.rotation.y = yaw), this.scene.add(mesh));
    this.tickers.push({ map, speed });
    return mesh;
  }
  _ground() {
    const m = this.mats;
    const floor = new Mesh(new PlaneGeometry(250, 250), m.floor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
    // Retain the original raised central footprint, surfaced as granite plaza.
    const plinth = new CylinderGeometry(7, 8.5, 0.5, 8);
    plinth.rotateY(Math.PI / 8);
    plinth.translate(0, 0.25, 0);
    this._batch(plinth, m.stone);
    // Flat painted carriageways and crossing markings add no new colliders.
    for (const side of [-1, 1]) {
      this._box(7, 0.006, 60, side * 24, 0.008, 0, m.asphalt);
      this._box(0.1, 0.009, 59, side * 27.2, 0.015, 0, m.paint);
      for (let z = -26; z < 28; z += 7)
        this._box(0.12, 0.01, 3, side * 24, 0.016, z, m.yellow);
      for (const z of [-19, 19])
        for (let i = 0; i < 7; i++)
          this._box(
            6.1,
            0.008,
            0.42,
            side * 24,
            0.022,
            z + i * 0.8 - 2.4,
            m.paint,
          );
    }
    const plaque = new Mesh(
      new PlaneGeometry(5, 2.5),
      new MeshStandardMaterial({
        map: signTexture(
          "TIMES SQUARE",
          "BROADWAY  /  SEVENTH AVENUE",
          "#747879",
          "#e3ddd0",
        ),
        roughness: 0.83,
      }),
    );
    plaque.rotation.x = -Math.PI / 2;
    plaque.position.set(0, 0.506, 0);
    this.scene.add(plaque);
    // Drain grates sit flush with the paving.
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      for (let j = 0; j < 9; j++)
        this._box(
          0.04,
          0.008,
          0.62,
          Math.cos(a) * 30 + j * 0.09,
          0.019,
          Math.sin(a) * 30,
          m.metal,
        );
    }
  }
  _boundary(arena) {
    const m = this.mats;
    let gateIndex = 0;
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12,
        yaw = -a + Math.PI / 2;
      const x = Math.cos(a) * (ARENA_RADIUS + 0.6),
        z = Math.sin(a) * (ARENA_RADIUS + 0.6);
      const local = (lx, ly, lz) => [
        x + Math.cos(yaw) * lx + Math.sin(yaw) * lz,
        ly,
        z - Math.sin(yaw) * lx + Math.cos(yaw) * lz,
      ];
      const box = (w, h, d, lx, ly, lz, mat) =>
        this._box(w, h, d, ...local(lx, ly, lz), mat, yaw);
      const sign = (title, sub, w, h, lx, ly, lz, bg, fg) =>
        this._sign(
          title,
          sub,
          w,
          h,
          ...local(lx, ly, lz),
          yaw + Math.PI,
          bg,
          fg,
        );
      if (i % 4 === 2) {
        for (const side of [-3.4, 3.4])
          box(
            1.3,
            WALL_HEIGHT + 0.6,
            1.6,
            side,
            (WALL_HEIGHT + 0.6) / 2,
            0,
            m.wall,
          );
        box(8.1, 1.6, 1.6, 0, WALL_HEIGHT - 0.2, 0, m.wall);
        box(8.2, WALL_HEIGHT + 1, 8, 0, (WALL_HEIGHT + 1) / 2, 4.6, m.dark);
        // Back of the shallow gate recess: a roll-up service shutter with the
        // spawn portal behind it. The shutter squashes into its housing rather
        // than sliding, which is how a real roll-up stacks its slats, and the
        // portal is only ever visible through the gap it leaves.
        // Depth order out from the arena: shutter, then the portal, then the
        // dark recess box whose front face sits at lz 0.60. The portal has to
        // land between the two — putting it deeper hides it inside the box.
        const SHUTTER_H = 7.1;
        const shutter = new Mesh(new PlaneGeometry(5.5, SHUTTER_H), m.shutter);
        shutter.position.set(...local(0, SHUTTER_H / 2, 0.45));
        shutter.rotation.y = yaw + Math.PI;
        this.scene.add(shutter);
        const portalMat = createPortalMaterial(gateIndex * 3.7);
        // Slightly overfills the opening so no dark seam shows at the jambs.
        const portal = new Mesh(
          new PlaneGeometry(5.6, SHUTTER_H + 0.1),
          portalMat,
        );
        portal.position.set(...local(0, SHUTTER_H / 2, 0.56));
        portal.rotation.y = yaw + Math.PI;
        portal.visible = false;
        this.scene.add(portal);
        // In FRONT of the recess face (lz 0.60), not behind it. Parked inside
        // the box the lamp was sealed in a solid volume, lighting nothing and
        // leaving the whole doorway surround black.
        const portalPos = local(0, 3.4, 0.15);
        sign(
          "SERVICE ACCESS",
          `AUTONOMOUS SYSTEMS / 0${gateIndex + 1}`,
          7.5,
          1.35,
          0,
          8.75,
          -0.83,
          "#26343c",
          "#f4cf71",
        );
        const lampMat = new MeshStandardMaterial({
          color: 0x91372a,
          emissive: 0xff462b,
          emissiveIntensity: 0.5,
        });
        for (const side of [-2.85, 2.85])
          box(0.16, 0.65, 0.13, side, 6.8, -0.88, lampMat);
        this.gateViews.push({
          gate: arena.gates[gateIndex++],
          mat: lampMat,
          shutter,
          shutterTop: SHUTTER_H,
          shutterHalf: SHUTTER_H / 2,
          portal,
          portalMat,
          portalPos,
          // Desynchronises the flicker so six open gates do not pulse as one.
          phase: gateIndex * 1.7,
          // Lamp state, snapped rather than tracked. See update().
          lamp: 0,
        });
      } else {
        box(9.7, WALL_HEIGHT, 1.2, 0, WALL_HEIGHT / 2, 0, m.wall);
        box(8.7, 3.25, 0.08, 0, 2.05, -0.65, m.glass);
        for (const lx of [-4.45, -2.2, 0, 2.2, 4.45])
          box(0.09, 3.65, 0.13, lx, 2.1, -0.72, m.metal);
        box(9.5, 0.28, 0.7, 0, 4.15, -0.83, m.metal);
        box(9.5, 0.1, 0.1, 0, 3.92, -1.1, m.emWhite);
        const shop = STOREFRONTS[i % STOREFRONTS.length];
        sign(
          shop.headline,
          "TIMES SQUARE / NEW YORK",
          8.8,
          2.6,
          0,
          6.25,
          -0.72,
          shop.bg,
          shop.fg || "#eee8d5",
        );
        // A news crawl on the fascia below the shop sign. Inside the ring and
        // at eye level, so it is in frame while you fight rather than being
        // skyline dressing.
        this._ticker(9.2, 0.62, ...local(0, 4.62, -0.95), yaw + Math.PI, 0.05);
        // Masonry cornice, not a glowing arena stripe.
        box(9.7, 0.28, 1.42, 0, 8.86, 0, m.stone);
      }
      const height = 19 + ((i * 13) % 25),
        depth = 10 + (i % 3) * 2;
      box(
        9.7,
        height,
        depth,
        0,
        9 + height / 2,
        depth / 2 + 0.5,
        this.facades[i % 4],
      );
      box(10, 0.4, depth + 0.5, 0, 9 + height, depth / 2 + 0.5, m.stone);
      if (i % 3 !== 2) {
        box(9.4, 7.2, 0.4, 0, 14, -0.25, m.metal);
        this._board(
          CAMPAIGNS[i % CAMPAIGNS.length],
          9,
          6.8,
          ...local(0, 14, -0.48),
          yaw + Math.PI,
          i * 0.83,
        );
      }
    }
  }
  _cover(arena) {
    const m = this.mats;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8,
        x = Math.cos(a) * 19,
        z = Math.sin(a) * 19;
      // Original 1.7 x 10 x 1.7 pillars become steel billboard supports.
      this._box(1.7, 10, 1.7, x, 5, z, m.pillar);
      this._box(2.1, 0.5, 2.1, x, 10.1, z, m.metal);
      this._box(2.3, 0.35, 2.3, x, 0.17, z, m.wall);
      for (const dx of [-0.78, 0.78])
        for (const dz of [-0.78, 0.78])
          this._box(0.13, 9.6, 0.13, x + dx, 5, z + dz, m.metal);
      const yaw = -a - Math.PI / 2;
      this._sign(
        i % 2 ? "W 45 ST" : "BROADWAY",
        "TIMES SQUARE",
        1.5,
        1.05,
        x - Math.cos(a) * 0.87,
        4.8,
        z - Math.sin(a) * 0.87,
        yaw,
        "#164b3a",
        "#e5ede7",
      );
      const ca = (i * Math.PI) / 4,
        radius = i % 2 === 0 ? 12.5 : 26;
      const bx = Math.cos(ca) * radius,
        bz = Math.sin(ca) * radius,
        byaw = -ca + Math.PI / 2,
        width = i % 2 === 0 ? 4.2 : 5.5;
      this._box(width, 2.1, 0.55, bx, 1.05, bz, m.barrier, byaw);
      for (const side of [-1, 1]) {
        this._box(
          width - 0.2,
          0.2,
          0.025,
          bx + Math.sin(byaw) * side * 0.29,
          1.64,
          bz + Math.cos(byaw) * side * 0.29,
          m.yellow,
          byaw,
        );
        this._sign(
          "RESTRICTED",
          "CITY EMERGENCY MANAGEMENT",
          width * 0.74,
          0.8,
          bx + Math.sin(byaw) * side * 0.295,
          0.91,
          bz + Math.cos(byaw) * side * 0.295,
          byaw + (side < 0 ? Math.PI : 0),
          "#343c3e",
          "#eee6ce",
        );
      }
    }
    for (const crate of arena.crates) {
      const [w, h, d] = crate.size;
      this._box(w, h, d, crate.x, h / 2, crate.z, m.crate, crate.yaw);
      for (const side of [-1, 1])
        for (let j = 0; j < 5; j++) {
          const offset = side * (d / 2 + 0.008);
          this._box(
            w * 0.72,
            0.035,
            0.018,
            crate.x + Math.sin(crate.yaw) * offset,
            h * 0.3 + j * 0.11,
            crate.z + Math.cos(crate.yaw) * offset,
            m.metal,
            crate.yaw,
          );
        }
      this._box(
        w + 0.025,
        0.06,
        d + 0.025,
        crate.x,
        h - 0.03,
        crate.z,
        m.metal,
        crate.yaw,
      );
    }
  }
  _skyline() {
    const m = this.mats;
    // Rectilinear setback towers create the Manhattan street canyon beyond
    // the retained ring. Their massing is evocative, not a surveyed replica.
    for (const side of [-1, 1])
      for (let i = 0; i < 7; i++) {
        const x = side * (57 + (i % 2) * 10),
          z = (i - 3) * 25;
        const h = 48 + ((i * 19) % 55);
        this._box(21, h, 21, x, h / 2, z, this.facades[(i + 1) % 4]);
        this._box(17, 9, 17, x, h + 4.5, z, this.facades[i % 4]);
        this._box(18, 0.7, 18, x, h + 9, z, m.stone);
        this._box(6, 3, 5, x, h + 10.5, z, m.metal);
      }
    // A narrow, stacked-sign tower is the signature silhouette at the square.
    const heroZ = -61;
    this._box(18, 82, 18, 0, 41, heroZ, this.facades[1]);
    this._box(13, 16, 13, 0, 90, heroZ, this.facades[1]);
    this._box(10, 0.8, 10, 0, 98, heroZ, m.metal);
    this._box(0.3, 10, 0.3, 0, 103, heroZ, m.metal);
    const ball = new Mesh(new TorusGeometry(1.25, 0.3, 8, 24), m.emWhite);
    ball.position.set(0, 101, heroZ);
    this.scene.add(ball);
    TOWER_CAMPAIGNS.forEach((ad, i) => {
      this._box(19, 13, 0.7, 0, 18 + i * 15, heroZ + 9.2, m.metal);
      this._board(ad, 18.5, 12.5, 0, 18 + i * 15, heroZ + 9.6, 0, i * 2.1);
    });
    // The red seating landmark is behind the closed perimeter, so it does
    // not introduce climbable geometry without corresponding collision.
    for (let i = 0; i < 13; i++)
      this._box(15, 0.3, 0.72, 0, 0.15 + i * 0.3, 45 + i * 0.72, m.red);
    this._sign(
      "THE RED STEPS",
      "DUFFY SQUARE",
      13,
      4,
      0,
      13,
      52,
      Math.PI,
      "#9e2839",
      "#fff2e1",
    );
  }
  _streetDetails() {
    const m = this.mats;
    // Traffic beyond the playable enclosure establishes scale and location.
    for (const side of [-1, 1]) {
      this._box(9, 0.01, 44, side * 27, 0.01, 58, m.asphalt);
      for (let i = 0; i < 3; i++) {
        const x = side * (25 + (i % 2) * 3),
          z = 48 + i * 9;
        this._box(1.85, 0.68, 4.3, x, 0.62, z, m.yellow);
        this._box(1.62, 0.62, 2.25, x, 1.24, z - 0.18, m.glass);
        this._box(1.7, 0.08, 2.3, x, 1.59, z - 0.18, m.yellow);
        this._box(0.6, 0.25, 0.55, x, 1.76, z, m.emWhite);
        for (const dx of [-0.86, 0.86])
          for (const dz of [-1.3, 1.3]) {
            const wheel = new CylinderGeometry(0.33, 0.33, 0.18, 12);
            wheel.rotateZ(Math.PI / 2);
            wheel.translate(x + dx, 0.35, z + dz);
            this._batch(wheel, m.metal);
          }
        for (const dx of [-0.62, 0.62])
          this._box(0.4, 0.15, 0.03, x + dx, 0.75, z + 2.16, m.emWhite);
      }
      for (let i = 0; i < 4; i++) {
        const x = side * 34,
          z = 40 + i * 10;
        this._box(0.18, 8, 0.18, x, 4, z, m.metal);
        this._box(3.6, 0.13, 0.13, x - side * 1.6, 8, z, m.metal);
        this._box(1.1, 0.1, 0.4, x - side * 3, 7.93, z, m.emWhite);
      }
      // Traffic signals hang outside the walls with conventional yellow cases.
      const x = side * 31,
        z = 43;
      this._box(0.18, 7, 0.18, x, 3.5, z, m.metal);
      this._box(5.2, 0.13, 0.13, x - side * 2.4, 7, z, m.metal);
      this._box(0.52, 1.45, 0.43, x - side * 4.4, 6.28, z, m.yellow);
      for (let j = 0; j < 3; j++) {
        const light = new CylinderGeometry(0.16, 0.16, 0.05, 12);
        light.rotateX(Math.PI / 2);
        light.translate(x - side * 4.4, 6.73 - j * 0.45, z - 0.23);
        this._batch(light, j === 0 ? m.red : m.metal);
      }
    }
  }
  _lights() {
    const a = theme.lights;
    const sun = new DirectionalLight(a.sun.color, a.sun.intensity);
    sun.position.copy(SUN_DIR).multiplyScalar(90);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, {
      left: -48,
      right: 48,
      top: 48,
      bottom: -48,
      near: 10,
      far: 210,
    });
    sun.shadow.bias = -0.0006;
    sun.shadow.normalBias = 0.035;
    this.scene.add(sun, sun.target);
    this.sun = sun;
    this.scene.add(
      new HemisphereLight(a.hemi.sky, a.hemi.ground, a.hemi.intensity),
    );
    // Only four unshadowed pools of billboard bounce, independent of enemies.
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const lamp = new PointLight(i % 2 ? 0xffc7a0 : 0x9dbfe8, 65, 40, 2);
      lamp.position.set(Math.cos(angle) * 29, 8, Math.sin(angle) * 29);
      this.scene.add(lamp);
    }
    this.scene.fog = new FogExp2(a.fog.color, a.fog.density);
    // A single roaming spill light serves every portal. Six of them (one per
    // gate) would double the scene's point-light count, and every material
    // pays for each light whether or not it is lit.
    // Short range on purpose: this should pool on the jambs and pavement at
    // the mouth of the gate, not relight the whole block and flatten the night.
    this.portalLight = new PointLight(0xff6a1e, 0, 11, 2);
    this.scene.add(this.portalLight);
  }
  update(time, dt = 1 / 60) {
    // Billboard motion and the news crawl. Both run off the shared clock so
    // the square keeps moving whether or not anything is being shot.
    updateLedPanels(this.ledMats, time);
    for (const t of this.tickers) t.map.offset.x = -time * t.speed;
    let widest = 0;
    let lit = null;
    for (const view of this.gateViews) {
      const gate = view.gate;
      // The lamps report a binary state - sealed or not - so they switch on
      // the shutter leaving and regaining its seated position, not on how far
      // it has travelled. Tracking the travel walked the colour through yellow
      // for the whole of every open and close. Damped hard so the change reads
      // as a switch throwing rather than a hard one-frame cut.
      const seated = gate.open > 0 ? 1 : 0;
      view.lamp = damp(view.lamp, seated, 26, dt);
      view.mat.emissive.copy(LAMP_SHUT).lerp(LAMP_OPEN, view.lamp);
      view.mat.color.copy(LAMP_BODY_SHUT).lerp(LAMP_BODY_OPEN, view.lamp);
      view.mat.emissiveIntensity =
        0.35 +
        gate.activity * (1.2 + 0.2 * Math.sin(time * 8)) +
        view.lamp * 1.1;
      // Squash the shutter into the lintel, keeping its top edge pinned.
      const shut = 1 - gate.open;
      view.shutter.scale.y = Math.max(0.001, shut);
      view.shutter.position.y = view.shutterTop - view.shutterHalf * shut;
      view.shutter.visible = shut > 0.02;
      // Slow, shallow breathing rather than a strobe. The shader carries the
      // fast detail; this is just the overall level.
      const flicker = 0.92 + 0.08 * Math.sin(time * 2.6 + view.phase);
      view.portal.visible = gate.open > 0.01;
      ((view.portalMat.uniforms.uTime.value = time),
        (view.portalMat.uniforms.uOpen.value = gate.open * flicker));
      if (gate.open > widest) ((widest = gate.open), (lit = view));
    }
    if (lit) {
      this.portalLight.position.set(...lit.portalPos);
      this.portalLight.intensity =
        widest * 22 * (0.92 + 0.08 * Math.sin(time * 2.6));
    } else this.portalLight.intensity = 0;
  }
}
