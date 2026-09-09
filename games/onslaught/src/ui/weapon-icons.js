// Side-on gun glyphs for the deploy-screen loadout. Same visual language as
// the viewmodels: squared steel, hard edges, a single orange accent. Drawn
// as inline SVG so they stay sharp at any DPI and never need a texture atlas.
//
// Muzzle faces right. viewBox is 64×28 so the row stays short and wide.

const STEEL = "#d7dee3";
const STEEL_DIM = "#9aa4ab";
const STEEL_DARK = "#5c666d";
const ACCENT = "#ff5a1f";

function svg(body) {
  return `<svg class="lo-gun" viewBox="0 0 64 28" width="64" height="28" aria-hidden="true" focusable="false">${body}</svg>`;
}

const ICONS = {
  // SIDEWINDER 9 — short slide, angled grip, undercut guard.
  pistol: svg(`
    <rect x="22" y="8" width="28" height="8" fill="${STEEL}"/>
    <rect x="46" y="9" width="10" height="5" fill="${STEEL_DIM}"/>
    <rect x="24" y="6" width="22" height="3" fill="${STEEL_DARK}"/>
    <rect x="28" y="16" width="7" height="10" fill="${STEEL_DIM}" transform="rotate(14 31.5 21)"/>
    <rect x="30" y="15" width="5" height="3" fill="${STEEL_DARK}"/>
    <rect x="48" y="10" width="3" height="3" fill="${ACCENT}"/>
  `),

  // VK-7 — curved mag, top rail teeth, orange side stripe.
  ar: svg(`
    <rect x="8" y="9" width="38" height="9" fill="${STEEL}"/>
    <rect x="42" y="10" width="16" height="5" fill="${STEEL_DIM}"/>
    <rect x="10" y="6" width="34" height="4" fill="${STEEL_DARK}"/>
    <rect x="12" y="4" width="3" height="3" fill="${STEEL}"/>
    <rect x="18" y="4" width="3" height="3" fill="${STEEL}"/>
    <rect x="24" y="4" width="3" height="3" fill="${STEEL}"/>
    <rect x="30" y="4" width="3" height="3" fill="${STEEL}"/>
    <rect x="22" y="17" width="8" height="10" fill="${STEEL_DIM}" transform="rotate(18 26 22)"/>
    <rect x="14" y="12" width="10" height="2" fill="${ACCENT}"/>
    <rect x="6" y="10" width="5" height="7" fill="${STEEL_DARK}"/>
  `),

  // M4 — straighter mag, shorter barrel, cleaner rail.
  m4: svg(`
    <rect x="10" y="9" width="34" height="8" fill="${STEEL}"/>
    <rect x="40" y="10" width="18" height="5" fill="${STEEL_DIM}"/>
    <rect x="12" y="6" width="30" height="4" fill="${STEEL_DARK}"/>
    <rect x="24" y="17" width="7" height="9" fill="${STEEL_DIM}"/>
    <rect x="6" y="10" width="6" height="7" fill="${STEEL_DARK}"/>
    <rect x="16" y="12" width="8" height="2" fill="${ACCENT}"/>
    <rect x="44" y="8" width="4" height="3" fill="${STEEL}"/>
  `),

  // LONGSHOT DMR — long barrel, optic brick, shallow mag.
  dmr: svg(`
    <rect x="4" y="11" width="34" height="7" fill="${STEEL}"/>
    <rect x="36" y="12" width="24" height="4" fill="${STEEL_DIM}"/>
    <rect x="14" y="5" width="16" height="6" fill="${STEEL_DARK}"/>
    <rect x="18" y="3" width="8" height="3" fill="${STEEL}"/>
    <rect x="20" y="18" width="6" height="7" fill="${STEEL_DIM}"/>
    <rect x="8" y="13" width="6" height="2" fill="${ACCENT}"/>
    <rect x="2" y="12" width="4" height="5" fill="${STEEL_DARK}"/>
  `),

  // WASP-9 SMG — stubby, vertical foregrip, short barrel.
  smg: svg(`
    <rect x="14" y="8" width="30" height="9" fill="${STEEL}"/>
    <rect x="40" y="10" width="14" height="5" fill="${STEEL_DIM}"/>
    <rect x="16" y="5" width="24" height="4" fill="${STEEL_DARK}"/>
    <rect x="24" y="17" width="6" height="9" fill="${STEEL_DIM}"/>
    <rect x="34" y="17" width="4" height="8" fill="${STEEL_DARK}"/>
    <rect x="18" y="12" width="8" height="2" fill="${ACCENT}"/>
    <rect x="10" y="9" width="5" height="7" fill="${STEEL_DARK}"/>
  `),

  // MP5 — SD-ish fat suppressor, folding-stock stub.
  mp5: svg(`
    <rect x="16" y="9" width="26" height="8" fill="${STEEL}"/>
    <rect x="40" y="10" width="18" height="6" fill="${STEEL_DIM}"/>
    <rect x="18" y="6" width="20" height="4" fill="${STEEL_DARK}"/>
    <rect x="26" y="17" width="6" height="9" fill="${STEEL_DIM}"/>
    <rect x="6" y="11" width="12" height="5" fill="${STEEL_DARK}"/>
    <rect x="20" y="12" width="7" height="2" fill="${ACCENT}"/>
  `),

  // HAMMER-12 — tube mag, pump, thick barrel.
  shotgun: svg(`
    <rect x="8" y="10" width="32" height="8" fill="${STEEL}"/>
    <rect x="38" y="11" width="20" height="5" fill="${STEEL_DIM}"/>
    <rect x="18" y="18" width="22" height="4" fill="${STEEL_DARK}"/>
    <rect x="28" y="8" width="10" height="4" fill="${STEEL}"/>
    <rect x="24" y="18" width="7" height="8" fill="${STEEL_DIM}" transform="rotate(8 27.5 22)"/>
    <rect x="12" y="12" width="8" height="2" fill="${ACCENT}"/>
    <rect x="4" y="11" width="6" height="6" fill="${STEEL_DARK}"/>
  `),

  // OVERWATCH LMG — box mag, bipod legs, heavy barrel.
  lmg: svg(`
    <rect x="6" y="9" width="36" height="9" fill="${STEEL}"/>
    <rect x="40" y="10" width="18" height="5" fill="${STEEL_DIM}"/>
    <rect x="10" y="5" width="28" height="5" fill="${STEEL_DARK}"/>
    <rect x="20" y="17" width="12" height="8" fill="${STEEL_DIM}"/>
    <rect x="18" y="22" width="2" height="5" fill="${STEEL_DARK}"/>
    <rect x="30" y="22" width="2" height="5" fill="${STEEL_DARK}"/>
    <rect x="12" y="12" width="10" height="2" fill="${ACCENT}"/>
    <rect x="2" y="10" width="5" height="7" fill="${STEEL_DARK}"/>
  `),

  // MERIDIAN — long rifle, tall scope, bipod.
  sniper: svg(`
    <rect x="2" y="12" width="30" height="6" fill="${STEEL}"/>
    <rect x="30" y="13" width="30" height="4" fill="${STEEL_DIM}"/>
    <rect x="12" y="4" width="18" height="8" fill="${STEEL_DARK}"/>
    <rect x="16" y="2" width="10" height="3" fill="${STEEL}"/>
    <rect x="18" y="18" width="5" height="6" fill="${STEEL_DIM}"/>
    <rect x="14" y="22" width="2" height="5" fill="${STEEL_DARK}"/>
    <rect x="24" y="22" width="2" height="5" fill="${STEEL_DARK}"/>
    <rect x="6" y="13" width="6" height="2" fill="${ACCENT}"/>
  `),

  // HAVOC RL-4 — fat tube, rear vent, grip under.
  rocket: svg(`
    <rect x="4" y="8" width="52" height="10" fill="${STEEL}"/>
    <rect x="52" y="9" width="8" height="8" fill="${STEEL_DIM}"/>
    <rect x="8" y="6" width="12" height="4" fill="${STEEL_DARK}"/>
    <rect x="24" y="18" width="7" height="8" fill="${STEEL_DIM}"/>
    <rect x="14" y="11" width="16" height="3" fill="${ACCENT}"/>
    <rect x="2" y="9" width="4" height="8" fill="${STEEL_DARK}"/>
  `),

  // CINDER-6 — tank on back of receiver, nozzle flare.
  flame: svg(`
    <rect x="12" y="10" width="28" height="9" fill="${STEEL}"/>
    <rect x="38" y="11" width="16" height="6" fill="${STEEL_DIM}"/>
    <rect x="50" y="9" width="8" height="10" fill="${ACCENT}"/>
    <circle cx="20" cy="10" r="7" fill="${STEEL_DARK}"/>
    <circle cx="20" cy="10" r="4" fill="${STEEL_DIM}"/>
    <rect x="26" y="19" width="6" height="7" fill="${STEEL_DIM}"/>
    <rect x="8" y="12" width="5" height="6" fill="${STEEL_DARK}"/>
  `),
};

const FALLBACK = svg(`
  <rect x="12" y="10" width="36" height="8" fill="${STEEL}"/>
  <rect x="44" y="11" width="12" height="5" fill="${STEEL_DIM}"/>
  <rect x="22" y="18" width="6" height="8" fill="${STEEL_DIM}"/>
  <rect x="16" y="12" width="8" height="2" fill="${ACCENT}"/>
`);

export function weaponIcon(key) {
  return ICONS[key] || FALLBACK;
}

// Number badge + gun glyph. The key stays readable for muscle memory; the
// silhouette is what tells the guns apart at a glance.
export function loadoutIcon(key, slot) {
  return `<span class="lo-icon"><span class="lo-slot">${slot}</span>${weaponIcon(key)}</span>`;
}
