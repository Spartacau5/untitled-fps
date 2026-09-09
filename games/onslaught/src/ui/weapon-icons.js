// Side-on gun art for the deploy-screen loadout. Photoreal renders live in
// /guns/<key>.png; the SVG fallback keeps a cold board readable if an asset
// is ever missing. Muzzle faces right in both.

const STEEL = "#d7dee3";
const STEEL_DIM = "#9aa4ab";
const ACCENT = "#ff5a1f";

function svg(body, cls = "lo-gun lo-gun-fallback") {
  return `<svg class="${cls}" viewBox="0 0 64 28" width="64" height="28" aria-hidden="true" focusable="false">${body}</svg>`;
}

const FALLBACK = svg(`
  <rect x="12" y="10" width="36" height="8" fill="${STEEL}"/>
  <rect x="44" y="11" width="12" height="5" fill="${STEEL_DIM}"/>
  <rect x="22" y="18" width="6" height="8" fill="${STEEL_DIM}"/>
  <rect x="16" y="12" width="8" height="2" fill="${ACCENT}"/>
`);

const LOCK = `<svg class="lo-lock" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H5.5A1.5 1.5 0 0 0 4 11.5v9A1.5 1.5 0 0 0 5.5 22h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 18.5 10H17V7a5 5 0 0 0-5-5zm-3 5a3 3 0 1 1 6 0v3H9V7zm3 8.25a1.75 1.75 0 0 1 .75 3.33V20h-1.5v-1.42A1.75 1.75 0 0 1 12 15.25z"/></svg>`;

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

// Number badge + gun glyph for a carried key. Locked tiles skip the badge and
// show a lock silhouette over the art instead.
export function loadoutIcon(key, { slot = 0, locked = false } = {}) {
  const badge =
    !locked && slot > 0 ? `<span class="lo-slot">${slot}</span>` : "";
  const lock = locked ? LOCK : "";
  return `<span class="lo-icon">${badge}${weaponIcon(key)}${lock}</span>`;
}
