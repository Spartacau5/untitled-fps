import { BINDINGS } from "../core/input.js";

// Every glyph on this screen comes from core/input.js BINDINGS, which frame()
// also reads. Rebind a key there and this screen follows on the next load.
const GROUPS = [
  ["move", "MOVEMENT"],
  ["combat", "COMBAT"],
  ["system", "SYSTEM"],
];

const BRIEF = [
  [
    "OBJECTIVE",
    "Hold the square. Robots breach through the six shutter gates — clear a wave to bring on the next.",
  ],
  [
    "SCORING",
    "Headshots pay more, and kills chain into a streak multiplier that decays if you go quiet.",
  ],
  [
    "STAYING ALIVE",
    "Sprint, then crouch to slide. Aiming down sights tightens your spread hard. Reload in cover.",
  ],
];

// KeyW -> W, Digit1 -> 1. Anything the table spells out in `caps` wins, since
// ShiftLeft/ShiftRight is one SHIFT key to a player even though the browser
// reports two codes.
function capsFor(binding) {
  if (binding.caps) return binding.caps;
  return (binding.codes || []).map((code) =>
    code.replace(/^Key/, "").replace(/^Digit/, "").toUpperCase(),
  );
}

const MOUSE_CAPS = new Set(["LMB", "RMB", "WHEEL", "MOUSE"]);

// The one-line crib along the foot of the deploy screen: only what a first
// run needs, in the order a first run needs it. Each entry is a binding id or
// an explicit set of caps, so the keys shown come from the same table the game
// reads -- change a binding and this follows. WASD has no single binding, and
// the weapon entry is filled in per loadout (1-3 on a fresh profile, not 1-8).
// Everything else - sensitivity, music, ambience - lives in HOW TO PLAY.
const SUMMARY = [
  [["forward", "left", "back", "right"], "move", "WASD"],
  ["sprint", "sprint"],
  ["jump", "jump"],
  ["crouch", "slide"],
  ["fire", "fire"],
  ["ads", "aim"],
  ["reload", "reload"],
  ["slots", "weapons", "$SLOTS"],
  ["pause", "pause"],
];

const byId = new Map(BINDINGS.map((b) => [b.id, b]));

// Caps for one summary entry: an override string, one binding's caps, or
// several bindings' caps run together (the weapon slots plus the wheel).
// A binding with alternatives contributes only its first key -- the crib says
// C, not "C CTRL"; the full panel is where both are listed.
function summaryCaps(ref, override) {
  if (override) return override;
  const ids = Array.isArray(ref) ? ref : [ref];
  return ids
    .map((id) => {
      const b = byId.get(id);
      if (!b) return "";
      const caps = capsFor(b);
      return b.seq ? caps.join(" ") : caps[0] || "";
    })
    .filter(Boolean)
    .join(" / ");
}

// Renders the crib into the deploy screen. Kept next to the full panel so the
// two can never disagree about what a key does. `carried` sizes the weapon
// keys to the loadout; the touch build has no keys and gets its own line.
export function renderControlSummary(el, { carried = 0, mobile = false } = {}) {
  if (!el) return;
  if (mobile) {
    el.innerHTML =
      "<b>LEFT THUMB</b> move &nbsp;·&nbsp; <b>RIGHT THUMB</b> look &nbsp;·&nbsp; <b>AUTO RUN</b> on &nbsp;·&nbsp; tap <b>AIM</b> for sights &nbsp;·&nbsp; hold <b>FIRE</b>";
    return;
  }
  const slots = carried > 1 ? `1&ndash;${carried}` : carried === 1 ? "1" : "";
  el.innerHTML = SUMMARY.map(([ref, label, override]) => {
    const caps =
      override === "$SLOTS"
        ? [slots, summaryCaps("wheel")].filter(Boolean).join(" / ")
        : summaryCaps(ref, override);
    return `<span><b>${caps}</b> ${label}</span>`;
  }).join('<span class="controls-sep">·</span>');
}

export function mountControls(els) {
  renderControlSummary(els.summary, { mobile: els.mobile });
  const groups = GROUPS.map(([group, heading]) => {
    const items = BINDINGS.filter((b) => b.group === group)
      .map((b) => {
        const caps = capsFor(b);
        if (!caps.length) return "";
        const keys = caps
          .map(
            (c) =>
              `<kbd class="ctrl-key${MOUSE_CAPS.has(c) ? " ctrl-key-mouse" : ""}">${c}</kbd>`,
          )
          .join(b.seq ? "" : '<span class="ctrl-or">/</span>');
        const hint = b.hint ? `<em class="ctrl-hint">${b.hint}</em>` : "";
        return `<div class="ctrl-row"><span class="ctrl-keys">${keys}</span><span class="ctrl-label">${b.label}${hint}</span></div>`;
      })
      .join("");
    return `<div class="ctrl-group"><h3 class="ctrl-heading">${heading}</h3>${items}</div>`;
  }).join("");

  const brief = BRIEF.map(
    ([k, v]) => `<div class="ctrl-brief-row"><b>${k}</b><span>${v}</span></div>`,
  ).join("");

  els.body.innerHTML =
    `<div class="ctrl-brief">${brief}</div><div class="ctrl-cols">${groups}</div>`;

  if (els.mobile) {
    els.body.innerHTML = `<div class="ctrl-brief">${brief}</div><div class="ctrl-brief"><p>Drag the left half to move, and the right half to look. You can drag FIRE to aim while shooting.</p><p>Tap AIM to toggle sights. Hold CROUCH to crouch or slide while running. Tap JUMP, RELOAD or WEAPON to act or cycle your equipped guns.</p><p>AUTO RUN starts on and yields while aiming or firing. Tap it to walk. PAUSE opens the menu; rotating upright or leaving the page pauses play.</p></div>`;
  }
  const open = () => {
    els.panel.classList.remove("hidden");
    els.menuMain.classList.add("hidden");
  };
  const close = () => {
    els.panel.classList.add("hidden");
    els.menuMain.classList.remove("hidden");
  };
  const isOpen = () => !els.panel.classList.contains("hidden");
  els.btnOpen.addEventListener("click", open);
  els.btnBack.addEventListener("click", close);
  return { open, close, isOpen, toggle: () => (isOpen() ? close() : open()) };
}
