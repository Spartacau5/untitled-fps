import {
  CanvasTexture,
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
export function pavementTexture() {
  const [c, g] = canvas(1024, 1024),
    rand = random();
  g.fillStyle = "#737878";
  g.fillRect(0, 0, 1024, 1024);
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++) {
      const v = 112 + Math.floor(rand() * 20);
      g.fillStyle = `rgb(${v},${v + 3},${v + 4})`;
      g.fillRect(x * 128 + 2, y * 128 + 2, 124, 124);
      g.strokeStyle = "#929797";
      g.strokeRect(x * 128 + 3, y * 128 + 3, 122, 122);
    }
  // Aggregate speckle. This used to build a fresh `rgba(...)` string and
  // assign fillStyle 95,000 times, which cost ~150 ms of the page load on its
  // own -- the parse, not the fill. Two passes with a fixed colour and a
  // globalAlpha sweep give the same grain for a fraction of the work.
  for (const [v, count] of [
    [225, 16000],
    [30, 16000],
  ]) {
    g.fillStyle = `rgb(${v},${v},${v})`;
    for (let i = 0; i < count; i++) {
      g.globalAlpha = rand() * 0.15;
      g.fillRect(rand() * 1024, rand() * 1024, 1 + rand() * 2, 1);
    }
  }
  g.globalAlpha = 1;
  return texture(c, [30, 30]);
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
  if (art) {
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
    g.fillText(line, 44, 190 + i * 112, art ? 700 : 930),
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
