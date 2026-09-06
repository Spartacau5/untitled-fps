// Single source of truth for the game's look. Nothing else hardcodes a color.
// Colors are hex numbers for Three.js and CSS strings for the DOM.
export const GAME_TITLE = "MIDTOWN / LOCKDOWN";

export const theme = {
  strings: {
    title: GAME_TITLE,
    subtitle: "TIMES SQUARE · NEW YORK CITY",
    deploy: "DEPLOY",
    deployingBanner: ["TIMES SQUARE", "CONTAIN THE AUTONOMOUS THREAT"],
  },
  sky: {
    horizon: 0xb9c6d2,
    zenith: 0x466688,
    fog: 0xa9b6c4,
    sun: 0xffeed6,
    dust: 0xb9c1c9,
  },
  lights: {
    sun: { color: 0xffe8ce, intensity: 2.4 },
    hemi: { sky: 0xadc5db, ground: 0x687178, intensity: 1.6 },
    fog: { color: 0xa9b6c4, density: 0.0045 },
    gate: { color: 0xff5a1f, intensity: 40 },
    perimeter: { color: 0xffc98a, intensity: 10 },
    weaponKey: { color: 0xfff0df, intensity: 3.0 },
    weaponHemi: { sky: 0xb7ccdf, ground: 0x92999f, intensity: 1.5 },
    weaponFill: { color: 0xc8d9e8, intensity: 1.0 },
    // The world capture used to be taken from the world origin, which sat on
    // the floor plane and inside the plinth: its lower hemisphere was the
    // underside of the floor, which let sky through and made the probe read
    // far brighter than the district actually is. The capture now happens at
    // eye height and sees real ground, so this compensates for the light
    // that was never really there.
    envIntensity: { world: 1.25, weapon: 0.8 },
  },
  arena: {
    concrete: 0xa5a39c,
    dark: 0x343c43,
    pillar: 0x68737a,
    crate: 0x718079,
    barrier: 0xb6b5ad,
    floor: 0x777e83,
    accentHot: 0xff5a1f,
    accentDim: 0xb23a10,
    hazard: 0xffb020,
    white: 0xfff4e0,
    // GLSL vec3 literals for shaders that bake colors in
    accentHotVec: "vec3(1.0, 0.353, 0.122)",
    hazardVec: "vec3(1.0, 0.69, 0.125)",
  },
  // Polished steel bodies with lit faces. Glow hue is still the thing that
  // tells the three apart at range -- the art pass leans on it -- so they are
  // kept distinct rather than all going sentry-blue: cold blue for the
  // pursuit units, Ultron-Prime red for the heavy, teal for the ranged one.
  enemies: {
    runner: { name: "PURSUIT UNIT", body: 0xc9d1d6, glow: [0.5, 0.82, 1.0] },
    brute: { name: "BREACH UNIT", body: 0x9aa4ab, glow: [1.0, 0.3, 0.1] },
    spitter: {
      name: "SUPPRESSION UNIT",
      body: 0xa9b3b1,
      glow: [0.2, 0.92, 0.9],
    },
  },
  fx: {
    tracer: [1, 0.85, 0.6],
    sparks: [1, 0.92, 0.8],
    pickup: [1, 0.35, 0.12],
    dust: [0.65, 0.7, 0.73],
    dustAlpha: 0.14,
  },
  grade: {
    exposure: 0.96,
    saturation: 0.96,
    contrast: 1.06,
    vignette: 0.12,
    grain: 0.007,
    chromatic: 0.0003,
    bloom: 0.1,
    bloomThreshold: 1.6,
    bloomKnee: 0.5,
    shadowTint: [0.96, 1.0, 1.04],
  },
  ui: {
    ink: "#f3f6f8",
    paper: "rgba(10, 14, 18, 0.92)",
    dim: "rgba(243, 246, 248, 0.72)",
    accent: "#ff5a1f",
    warn: "#d9771b",
    danger: "#ff6b4a",
    fontUi: '"Barlow Condensed", "Arial Narrow", Arial, sans-serif',
    fontTitle: '"Barlow Condensed", "Arial Narrow", Arial, sans-serif',
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
