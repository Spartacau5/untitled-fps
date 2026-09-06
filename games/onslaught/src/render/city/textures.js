import {
  CanvasTexture,
  NoColorSpace,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from "three";

// Authored, local procedural textures. No network requests, stock photos, or
// generated bitmaps. The fixed seed keeps the district identical between runs.
function random(seed = 71) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function canvas(width, height) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return [c, c.getContext("2d")];
}
function texture(c, repeat) {
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}
// Height field -> tangent-space normal map, by Sobel. This is what was
// missing from the ground: with no normal map a paved plaza is one flat
// plane to the lighting, so nothing rakes across the slabs and the whole
// surface reads as a printed photograph rather than stone.
function heightToNormal(heightCanvas, strength = 2.4) {
  const w = heightCanvas.width,
    h = heightCanvas.height,
    src = heightCanvas.getContext("2d").getImageData(0, 0, w, h).data,
    [out, og] = canvas(w, h),
    img = og.createImageData(w, h),
    dst = img.data;
  // Wrapping sample, so the normal map tiles as seamlessly as the albedo.
  const at = (x, y) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx =
          at(x - 1, y - 1) +
          2 * at(x - 1, y) +
          at(x - 1, y + 1) -
          (at(x + 1, y - 1) + 2 * at(x + 1, y) + at(x + 1, y + 1)),
        dy =
          at(x - 1, y - 1) +
          2 * at(x, y - 1) +
          at(x + 1, y - 1) -
          (at(x - 1, y + 1) + 2 * at(x, y + 1) + at(x + 1, y + 1));
      // Normalise (dx, dy, 1/strength) into the 0..1 range a normal map wants.
      const nx = dx * strength,
        ny = dy * strength,
        len = Math.hypot(nx, ny, 1),
        i = (y * w + x) * 4;
      ((dst[i] = ((nx / len) * 0.5 + 0.5) * 255),
        (dst[i + 1] = ((ny / len) * 0.5 + 0.5) * 255),
        (dst[i + 2] = (1 / len) * 0.5 * 255 + 127),
        (dst[i + 3] = 255));
    }
  og.putImageData(img, 0, 0);
  return out;
}

// Paving: albedo, normal and roughness drawn from one layout so the three
// agree. Slabs are laid on a half-offset running bond rather than a grid --
// a perfect 8x8 grid is one of the things that reads as old.
export function pavementTexture() {
  const S = 1024,
    SLAB = 128,
    [c, g] = canvas(S, S),
    [hc, hg] = canvas(S, S),
    [rc, rg] = canvas(S, S),
    rand = random();

  g.fillStyle = "#6e7375";
  g.fillRect(0, 0, S, S);
  // Height: grout is the low point, slab faces sit proud.
  hg.fillStyle = "#2a2a2a";
  hg.fillRect(0, 0, S, S);
  // Roughness: mid by default. Darker = smoother in a roughness map.
  rg.fillStyle = "#b4b4b4";
  rg.fillRect(0, 0, S, S);

  for (let row = 0; row < S / SLAB; row++) {
    // Half-slab offset on alternate courses breaks the grid read.
    const shift = (row % 2) * (SLAB / 2);
    for (let col = -1; col < S / SLAB + 1; col++) {
      const x = col * SLAB + shift + 2,
        y = row * SLAB + 2,
        w = SLAB - 4,
        v = 104 + Math.floor(rand() * 26);
      g.fillStyle = `rgb(${v},${v + 3},${v + 4})`;
      g.fillRect(x, y, w, w);
      // A worn, slightly polished centre on some slabs -- foot traffic.
      if (rand() > 0.55) {
        g.fillStyle = `rgba(${v + 16},${v + 18},${v + 18},0.5)`;
        g.fillRect(x + 12, y + 12, w - 24, w - 24);
        rg.fillStyle = "#8e8e8e";
        rg.fillRect(x + 14, y + 14, w - 28, w - 28);
      }
      // Height: a proud face with a chamfered edge, so light catches the
      // bevel the way it does on a real kerbstone.
      const grad = hg.createLinearGradient(x, y, x, y + w);
      (grad.addColorStop(0, "#8a8a8a"),
        grad.addColorStop(0.06, "#d2d2d2"),
        grad.addColorStop(0.94, "#d2d2d2"),
        grad.addColorStop(1, "#8a8a8a"));
      hg.fillStyle = grad;
      hg.fillRect(x, y, w, w);
      hg.fillStyle = "rgba(255,255,255,0.10)";
      hg.fillRect(x + 4, y + 4, w - 8, w - 8);
      // Chipped corners on a few slabs.
      if (rand() > 0.82) {
        const cx = x + (rand() > 0.5 ? w - 10 : 2),
          cy = y + (rand() > 0.5 ? w - 10 : 2);
        (hg.fillStyle = "#6a6a6a"), hg.fillRect(cx, cy, 8, 8);
        (g.fillStyle = "rgba(60,62,64,0.45)"), g.fillRect(cx, cy, 8, 8);
      }
    }
  }

  // Cracks. Faint, thin and mostly straight: stone fractures in near-straight
  // runs that jog at an angle, and a wandering curve reads as a drawn squiggle
  // rather than a split slab. Most of the effect belongs in the height field,
  // where the light finds it, not in the albedo.
  for (let i = 0; i < 22; i++) {
    let x = rand() * S,
      y = rand() * S,
      a = rand() * Math.PI * 2;
    (g.strokeStyle = "rgba(52,54,56,0.22)"),
      (hg.strokeStyle = "rgba(52,52,52,0.7)"),
      (g.lineWidth = 0.9),
      (hg.lineWidth = 1.4),
      g.beginPath(),
      hg.beginPath(),
      g.moveTo(x, y),
      hg.moveTo(x, y);
    for (let seg = 0; seg < 5; seg++) {
      // Small angular jogs, not smooth turns.
      ((a += rand() * 0.34 - 0.17),
        (x += Math.cos(a) * 34),
        (y += Math.sin(a) * 34));
      (g.lineTo(x, y), hg.lineTo(x, y));
    }
    (g.stroke(), hg.stroke());
  }

  // Aggregate grain, in albedo and height together so the speckle is felt as
  // well as seen. Two passes with a fixed colour: building a fresh rgba()
  // string per speckle cost ~150 ms of page load, and it was the parse.
  for (const [v, count] of [
    [225, 14000],
    [30, 14000],
  ]) {
    ((g.fillStyle = `rgb(${v},${v},${v})`),
      (hg.fillStyle = `rgb(${v},${v},${v})`));
    for (let i = 0; i < count; i++) {
      const x = rand() * S,
        y = rand() * S,
        w = 1 + rand() * 2;
      ((g.globalAlpha = rand() * 0.15), g.fillRect(x, y, w, 1));
      ((hg.globalAlpha = rand() * 0.09), hg.fillRect(x, y, w, 1));
    }
  }
  ((g.globalAlpha = 1), (hg.globalAlpha = 1));

  // Stains and damp patches, on roughness only: a wet or oiled patch is not
  // a different colour so much as a different gloss.
  for (let i = 0; i < 34; i++) {
    const x = rand() * S,
      y = rand() * S,
      r = 30 + rand() * 130,
      grad = rg.createRadialGradient(x, y, 0, x, y, r);
    (grad.addColorStop(0, `rgba(90,90,90,${0.35 + rand() * 0.3})`),
      grad.addColorStop(1, "rgba(90,90,90,0)"));
    ((rg.fillStyle = grad), rg.beginPath(), rg.arc(x, y, r, 0, 7), rg.fill());
  }

  const map = texture(c, [30, 30]),
    normalMap = texture(heightToNormal(hc, 2.2), [30, 30]),
    roughnessMap = texture(rc, [30, 30]);
  // Only the albedo is colour; the other two are data and must stay linear.
  ((normalMap.colorSpace = NoColorSpace), (roughnessMap.colorSpace = NoColorSpace));
  return { map, normalMap, roughnessMap };
}
export function facadeTexture(style = 0) {
  const [c, g] = canvas(512, 1024),
    rand = random(31 + style);
  const colors = ["#525b63", "#aaa499", "#866a5d", "#334756"];
  g.fillStyle = colors[style % 4];
  g.fillRect(0, 0, 512, 1024);
  for (let row = 0; row < 16; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * 64 + 7,
        y = row * 64 + 8;
      g.fillStyle = "#222b32";
      g.fillRect(x - 2, y - 2, 51, 48);
      const lit = rand() > 0.79;
      const grad = g.createLinearGradient(x, y, x + 48, y + 45);
      grad.addColorStop(0, lit ? "#d4c9aa" : "#69808b");
      grad.addColorStop(1, lit ? "#94856b" : "#263b4a");
      g.fillStyle = grad;
      g.fillRect(x, y, 47, 44);
      g.fillStyle = "rgba(15,20,26,.35)";
      if (rand() > 0.5) g.fillRect(x, y, 47, 10 + rand() * 14);
      g.fillStyle = "#828789";
      g.fillRect(x + 23, y, 1, 44);
      g.fillRect(x, y + 44, 48, 2);
    }
    g.fillStyle = "rgba(0,0,0,.25)";
    g.fillRect(0, row * 64 + 61, 512, 3);
  }
  return texture(c);
}
// A brilliant-cut gem, drawn side-on: table across the top, crown sloping out
// to the girdle, pavilion tapering to the culet, with the facet lines that
// make it read as cut stone rather than a rhombus. Used by advertiser boards
// that want a mark rather than the generic radial art panel.
function drawGemMark(g, cx, cy, size, tint = ["#ffffff", "#f7b8d2", "#7fe3e0"]) {
  const half = size / 2,
    table = size * 0.26,
    crown = size * 0.3,
    pav = size * 0.72;
  const top = cy - crown,
    culet = cy + pav;

  // Body, filled with a gradient running across the stone.
  const grad = g.createLinearGradient(cx - half, top, cx + half, culet);
  (grad.addColorStop(0, tint[0]),
    grad.addColorStop(0.45, tint[1]),
    grad.addColorStop(1, tint[2]));
  (g.beginPath(),
    g.moveTo(cx - table, top),
    g.lineTo(cx + table, top),
    g.lineTo(cx + half, cy),
    g.lineTo(cx, culet),
    g.lineTo(cx - half, cy),
    g.closePath(),
    (g.fillStyle = grad),
    g.fill());

  // Facets. Crown facets fan from the table corners down to the girdle;
  // pavilion facets converge on the culet.
  ((g.strokeStyle = "rgba(255,255,255,0.55)"), (g.lineWidth = size * 0.012));
  g.beginPath();
  (g.moveTo(cx - table, top),
    g.lineTo(cx - half, cy),
    g.moveTo(cx + table, top),
    g.lineTo(cx + half, cy),
    g.moveTo(cx - half, cy),
    g.lineTo(cx + half, cy),
    g.moveTo(cx - table, top),
    g.lineTo(cx - size * 0.16, cy),
    g.moveTo(cx + table, top),
    g.lineTo(cx + size * 0.16, cy),
    g.moveTo(cx - size * 0.16, cy),
    g.lineTo(cx, culet),
    g.moveTo(cx + size * 0.16, cy),
    g.lineTo(cx, culet),
    g.stroke());

  // A bright table face on top, which is where a real stone throws its light.
  (g.beginPath(),
    g.moveTo(cx - table, top),
    g.lineTo(cx + table, top),
    g.lineTo(cx + size * 0.16, cy),
    g.lineTo(cx - size * 0.16, cy),
    g.closePath(),
    (g.fillStyle = "rgba(255,255,255,0.32)"),
    g.fill());
}

export function signTexture(
  title,
  subtitle = "",
  background = "#17252e",
  foreground = "#f3f1e7",
  art = false,
) {
  const [c, g] = canvas(1024, 512);
  g.fillStyle = background;
  g.fillRect(0, 0, 1024, 512);
  if (art === "gem") {
    // Advertiser board: a lit stone on a dark ground, which is how a jewelry
    // brand actually buys a screen in a square like this.
    const glow = g.createRadialGradient(724, 250, 8, 724, 250, 430);
    (glow.addColorStop(0, "#2a2036"),
      glow.addColorStop(0.55, background),
      glow.addColorStop(1, "#08070c"));
    ((g.fillStyle = glow), g.fillRect(0, 0, 1024, 512));
    drawGemMark(g, 748, 214, 236);
  } else if (art) {
    const grad = g.createRadialGradient(810, 220, 5, 760, 230, 440);
    grad.addColorStop(0, foreground);
    grad.addColorStop(0.3, background);
    grad.addColorStop(1, "#060c18");
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 512);
    g.save();
    g.translate(785, 255);
    g.rotate(-0.32);
    for (let i = 0; i < 8; i++) {
      g.strokeStyle = foreground;
      g.globalAlpha = 0.6 - i * 0.055;
      g.lineWidth = 4;
      g.strokeRect(-115 - i * 15, -110 - i * 15, 230 + i * 30, 220 + i * 30);
    }
    g.restore();
  }
  g.fillStyle = foreground;
  g.font = "600 24px Arial";
  g.fillText(art ? "NEW YORK / BROADWAY" : "MIDTOWN MANHATTAN", 48, 54);
  g.font = "900 105px Arial";
  const lines = title.split("\n");
  lines.forEach((line, i) =>
    g.fillText(line, 44, 190 + i * 112, art ? 640 : 930),
  );
  g.font = "500 29px Arial";
  g.fillText(subtitle, 48, 451, 920);
  g.fillRect(48, 476, 120, 4);
  // Subtle LED pixel rows, baked once rather than a full-screen shader.
  g.fillStyle = "rgba(0,0,0,.1)";
  for (let y = 0; y < 512; y += 4) g.fillRect(0, y, 1024, 1);
  return texture(c);
}
export function shutterTexture() {
  const [c, g] = canvas(256, 512);
  g.fillStyle = "#555f66";
  g.fillRect(0, 0, 256, 512);
  for (let y = 0; y < 512; y += 12) {
    g.fillStyle = "#303940";
    g.fillRect(0, y, 256, 2);
    g.fillStyle = "#758089";
    g.fillRect(0, y + 3, 256, 1);
  }
  return texture(c);
}

// One long strip of amber text for the crawling ticker above the shopfronts.
// The texture wraps in X and the material scrolls its offset, so the message
// runs continuously without ever redrawing the canvas.
export function tickerTexture(message, fg = "#ffb648", bg = "#0d1216") {
  const height = 64;
  // Measure first so the strip is exactly as wide as the text: any slack
  // would show up as a gap every time the message came round.
  const [probe, pg] = canvas(8, 8);
  pg.font = "700 40px Arial";
  const width = Math.max(512, Math.ceil(pg.measureText(message).width));
  probe.width = probe.height = 0;

  const [c, g] = canvas(width, height);
  g.fillStyle = bg;
  g.fillRect(0, 0, width, height);
  g.font = "700 40px Arial";
  g.fillStyle = fg;
  g.textBaseline = "middle";
  g.fillText(message, 0, height / 2 + 1);
  // The same baked LED rows the boards use, so the strip belongs to them.
  g.fillStyle = "rgba(0,0,0,.22)";
  for (let y = 0; y < height; y += 3) g.fillRect(0, y, width, 1);
  const t = texture(c);
  t.wrapS = RepeatWrapping;
  return t;
}

// Artwork the player dropped into games/onslaught/public/ads/. Returns null
// synchronously and calls onLoad if the file turns up, so a missing or
// misspelled path leaves the drawn board in place instead of a blank panel.
export function adImageTexture(path, onLoad) {
  const loader = new TextureLoader();
  return loader.load(
    path,
    (t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      onLoad && onLoad(t);
    },
    undefined,
    () => {
      // Missing artwork is a normal state -- the folder ships empty.
    },
  );
}
