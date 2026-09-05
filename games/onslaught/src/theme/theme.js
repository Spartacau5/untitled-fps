// Single source of truth for the game's look. Nothing else hardcodes a color.
// Colors are hex numbers for Three.js and CSS strings for the DOM.
export const GAME_TITLE = "UNTITLED ARENA";

export const theme = {
  strings: {
    title: GAME_TITLE,
    subtitle: "HOLD THE LINE",
    deploy: "DEPLOY",
    deployingBanner: ["DEPLOYING", "HOLD THE ARENA"],
  },
  sky: {
    horizon: 0xeadfcb,
    zenith: 0x6e9bc4,
    fog: 0xd8cbb3,
    sun: 0xfff1d6,
    dust: 0xe0d2b8,
  },
  lights: {
    sun: { color: 0xfff0d8, intensity: 3.2 },
    hemi: { sky: 0x8fb3d9, ground: 0xb89c72, intensity: 0.9 },
    fog: { color: 0xd8cbb3, density: 0.0035 },
    gate: { color: 0xff5a1f, intensity: 40 },
    perimeter: { color: 0xffc98a, intensity: 10 },
    weaponKey: { color: 0xfff0d8, intensity: 2.2 },
    weaponHemi: { sky: 0x8fb3d9, ground: 0xb89c72, intensity: 1.0 },
    weaponFill: { color: 0xffd9b0, intensity: 0.6 },
    envIntensity: { world: 0.7, weapon: 0.8 },
  },
  arena: {
    concrete: 0x9a9184,
    dark: 0x6b655c,
    pillar: 0xb3aa9a,
    crate: 0xc7a36b,
    barrier: 0xd9d2c5,
    floor: 0x8f8778,
    accentHot: 0xff5a1f,
    accentDim: 0xb23a10,
    hazard: 0xffb020,
    white: 0xfff4e0,
    // GLSL vec3 literals for shaders that bake colors in
    accentHotVec: "vec3(1.0, 0.353, 0.122)",
    hazardVec: "vec3(1.0, 0.69, 0.125)",
  },
  enemies: {
    runner: { body: 0x14100e, glow: [1.0, 0.42, 0.0] },
    brute: { body: 0x1a120e, glow: [1.0, 0.16, 0.0] },
    spitter: { body: 0x201a14, glow: [0.78, 1.0, 0.23] },
  },
  fx: {
    tracer: [1, 0.85, 0.6],
    sparks: [1, 0.92, 0.8],
    pickup: [1, 0.35, 0.12],
    dust: [0.91, 0.86, 0.77],
    dustAlpha: 0.35,
  },
  grade: {
    exposure: 1.05,
    saturation: 0.96,
    contrast: 1.16,
    vignette: 0.18,
    grain: 0.02,
    chromatic: 0.002,
    bloom: 0.08,
    bloomThreshold: 1.6,
    bloomKnee: 0.5,
    shadowTint: [1.04, 0.98, 0.92],
  },
  ui: {
    ink: "#141210",
    paper: "rgba(245, 238, 225, 0.86)",
    dim: "rgba(20, 18, 16, 0.6)",
    accent: "#ff5a1f",
    warn: "#d9771b",
    danger: "#b8231c",
    fontUi: '"Barlow Condensed", "Arial Narrow", Arial, sans-serif',
    fontTitle:
      '"Big Shoulders Stencil Text", "Impact", "Arial Black", sans-serif',
  },
};

export function applyThemeCss(root = document.documentElement) {
  const u = theme.ui;
  root.style.setProperty("--ui", u.ink);
  root.style.setProperty("--paper", u.paper);
  root.style.setProperty("--dim", u.dim);
  root.style.setProperty("--accent", u.accent);
  root.style.setProperty("--warn", u.warn);
  root.style.setProperty("--danger", u.danger);
  root.style.setProperty("--font-ui", u.fontUi);
  root.style.setProperty("--font-title", u.fontTitle);
}

export function applyThemeStrings(doc = document) {
  const s = theme.strings;
  doc.title = s.title;
  const set = (sel, text) => {
    const el = doc.querySelector(sel);
    if (el) el.textContent = text;
  };
  set(".title", s.title);
  set(".subtitle", s.subtitle);
  set("#btn-start", s.deploy);
}
