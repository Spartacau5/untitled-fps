// ============================================================================
// THE BILLBOARDS
//
// This is the file you edit to change what runs on the boards in the square.
// Nothing else needs touching: arena-view.js reads this list and fills every
// slot from it.
//
// A campaign looks like this:
//
//   {
//     headline: "TWO LINES\nMAX",   // \n breaks the line. Keep it short.
//     subline:  "SMALL PRINT UNDER IT",
//     bg: "#123456",                // panel colour
//     fg: "#ffffff",                // text and artwork colour
//     art: true,                    // adds the glowing radial artwork
//     motion: "pulse",              // see MOTION below, or omit for a still board
//     image: "ads/my-poster.png",   // optional, see IMAGES below
//   }
//
// MOTION — how the panel behaves once it is lit:
//   "pulse"   slow brightness swell, like a backlit vinyl
//   "sweep"   a bright bar wipes across the panel every few seconds
//   "flicker" a failing tube, guttering at irregular intervals
//   "scroll"  the LED scanlines crawl upward
//   omitted   a still, evenly lit panel
//
// IMAGES — drop your own artwork in. Put a PNG or JPG in
// `games/onslaught/public/ads/` and set `image` to its path relative to the
// site root, e.g. "ads/my-poster.png". The folder ships empty; the board
// falls back to the drawn headline if the file is missing, so a typo costs
// you nothing. Landscape art around 2:1 fits the large boards best.
// ============================================================================

export const CAMPAIGNS = [
  {
    id: "after-hours",
    headline: "AFTER\nHOURS",
    subline: "A NEW BROADWAY ORIGINAL",
    bg: "#701e33",
    fg: "#ffd7a2",
    art: true,
    motion: "pulse",
  },
  {
    id: "make-it",
    headline: "MAKE IT\nNEW YORK",
    subline: "THE CITY IS YOURS",
    bg: "#173e69",
    fg: "#83def1",
    art: true,
    motion: "sweep",
  },
  {
    id: "solstice",
    headline: "SOLSTICE",
    subline: "SOUND WITHOUT LIMITS",
    bg: "#58367e",
    fg: "#f4bce8",
    art: true,
    motion: "scroll",
  },
  {
    id: "every-moment",
    headline: "EVERY\nMOMENT",
    subline: "SHOT IN NEW YORK",
    bg: "#14544c",
    fg: "#b6f2c8",
    art: true,
    motion: "pulse",
  },
  {
    id: "north-star",
    headline: "NORTH\nSTAR",
    subline: "THE NEXT CHAPTER",
    bg: "#c55427",
    fg: "#fff1c8",
    art: true,
    motion: "sweep",
  },
  {
    id: "last-call",
    headline: "LAST\nCALL",
    subline: "NINE TILL LATE, EVERY NIGHT",
    bg: "#3d1230",
    fg: "#ff9ecb",
    art: true,
    motion: "flicker",
  },
];

// The tall stacked board on the hero tower behind the square. Four panels,
// bottom to top.
export const TOWER_CAMPAIGNS = [
  {
    id: "times-square",
    headline: "TIMES\nSQUARE",
    subline: "THE CROSSROADS OF NEW YORK",
    bg: "#a32a35",
    fg: "#fff1dc",
    art: true,
    motion: "pulse",
  },
  {
    id: "city-in-motion",
    headline: "CITY\nIN MOTION",
    subline: "SEVEN MILLION STORIES",
    bg: "#163a69",
    fg: "#9edfeb",
    art: true,
    motion: "scroll",
  },
  {
    id: "broadway",
    headline: "BROADWAY",
    subline: "LIVE EVERY NIGHT",
    bg: "#49235b",
    fg: "#f1c2d9",
    art: true,
    motion: "sweep",
  },
  {
    id: "nyc",
    headline: "NYC",
    subline: "MAKE YOURSELF AT HOME",
    bg: "#d78931",
    fg: "#fff0c7",
    art: true,
    motion: "pulse",
  },
];

// Storefront fascia signs on the shop units around the ring. These are shop
// names rather than campaigns, so they stay still.
export const STOREFRONTS = [
  { headline: "BROADWAY\nCOFFEE", bg: "#62312b" },
  { headline: "MIDTOWN\nMARKET", bg: "#172d34" },
  { headline: "NEW YORK\nPIZZA", bg: "#172d34" },
  { headline: "THEATRE\nDISTRICT", bg: "#62312b" },
  { headline: "SEVENTH\nAVENUE", bg: "#172d34" },
  { headline: "CITY\nPHARMACY", bg: "#172d34" },
];

// The crawling ticker strip that runs above the shopfronts, inside the ring.
// Each entry is one message; they are joined into one long scrolling line.
export const TICKER = [
  "MIDTOWN UNDER AUTONOMOUS LOCKDOWN",
  "CIVIL DEFENCE ADVISES SHELTER IN PLACE",
  "BROADWAY PERFORMANCES SUSPENDED UNTIL FURTHER NOTICE",
  "SEVENTH AVENUE CLOSED BETWEEN W 42 AND W 47",
  "CONTAIN THE THREAT — HOLD THE SQUARE",
];

// Where the ticker text is separated. Wide enough to read as a gap at speed.
export const TICKER_SEPARATOR = "   ///   ";
