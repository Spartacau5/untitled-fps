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

export function mountControls(els) {
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
