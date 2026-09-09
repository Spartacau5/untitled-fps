// Side-on gun art for the deploy-screen loadout. Photoreal renders live in
// /guns/<key>.png; the SVG fallback keeps a cold board readable if an asset
// is ever missing. Muzzle faces right in both.

const STEEL = "#d7dee3";
const STEEL_DIM = "#9aa4ab";
const STEEL_DARK = "#5c666d";
const ACCENT = "#ff5a1f";

function svg(body) {
  return `<svg class="lo-gun lo-gun-fallback" viewBox="0 0 64 28" width="64" height="28" aria-hidden="true" focusable="false">${body}</svg>`;
}

const FALLBACK = svg(`
  <rect x="12" y="10" width="36" height="8" fill="${STEEL}"/>
  <rect x="44" y="11" width="12" height="5" fill="${STEEL_DIM}"/>
  <rect x="22" y="18" width="6" height="8" fill="${STEEL_DIM}"/>
  <rect x="16" y="12" width="8" height="2" fill="${ACCENT}"/>
`);

const KEYS = [
  "pistol",
  "ar",
  "m4",
  "dmr",
  "smg",
  "mp5",
  "shotgun",
  "lmg",
  "sniper",
  "rocket",
  "flame",
];

export function weaponIcon(key) {
  if (!KEYS.includes(key)) return FALLBACK;
  return `<img class="lo-gun" src="./guns/${key}.png" alt="" width="96" height="54" decoding="async" draggable="false" />`;
}

// Number badge + gun glyph. The key stays readable for muscle memory; the
// render is what tells the guns apart at a glance.
export function loadoutIcon(key, slot) {
  return `<span class="lo-icon"><span class="lo-slot">${slot}</span>${weaponIcon(key)}</span>`;
}
