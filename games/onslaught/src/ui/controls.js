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

// The three-line crib on the deploy screen. Each entry is either a binding id
// or an explicit set of caps, so the keys shown here come from the same table
// the game reads -- change a binding and this follows. WASD has no single
// binding, and the weapon row folds the slot keys together with the wheel.
const SUMMARY = [
  [
    [["forward", "left", "back", "right"], "move", "WASD"],
    ["sprint", "sprint"],
    ["jump", "jump"],
    ["crouch", "slide / crouch"],
  ],
  [
    ["fire", "fire"],
    ["ads", "aim down sights"],
    ["reload", "reload"],
    [["slots", "wheel"], "weapons"],
  ],
  [
    ["sensitivity", "sensitivity"],
    ["music", "music"],
    ["ambient", "ambient"],
    ["pause", "pause"],
  ],
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
// two can never disagree about what a key does.
export function renderControlSummary(el) {
  if (!el) return;
  el.innerHTML = SUMMARY.map(
    (row) =>
      "<div>" +
      row
        .map(
          ([ref, label, override]) =>
            `<b>${summaryCaps(ref, override)}</b> ${label}`,
        )
        .join(" &nbsp;·&nbsp; ") +
      "</div>",
  ).join("");
}

export function mountControls(els) {
  renderControlSummary(els.summary);
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
