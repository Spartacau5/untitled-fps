import { SLOT_GROUPS } from "../data/weapons.js";

// Bars are relative to the strongest gun in the table for each stat, so they
// compare weapons against each other rather than against absolute numbers the
// player has no feel for.
const STATS = [
  ["DAMAGE", (w) => w.damage * (w.pellets > 1 ? w.pellets : 1)],
  ["FIRE RATE", (w) => w.rpm],
  ["RANGE", (w) => (w.fire === "cone" ? w.coneRange : w.falloffEnd)],
  ["MAGAZINE", (w) => w.magSize],
  ["HANDLING", (w) => 1 / Math.max(0.05, w.weight)],
];

const pct = (v, max) => Math.max(3, Math.round((v / max) * 100));

export function mountArmory(progression, els, onChange) {
  // Peak value per stat across everything, computed once.
  const peaks = STATS.map(([, read]) =>
    SLOT_GROUPS.flatMap((s) => progression.forSlot(s.slot)).reduce(
      (m, w) => Math.max(m, read(w)),
      0,
    ),
  );

  function card(weapon) {
    const locked = !progression.isUnlocked(weapon.key),
      starts = progression.start === weapon.key,
      key = progression.slotOf(weapon.key);
    const bars = STATS.map(
      ([label, read], i) =>
        `<div class="arm-stat"><span>${label}</span><i><b style="width:${pct(read(weapon), peaks[i])}%"></b></i></div>`,
    ).join("");
    return `<button type="button" class="arm-card${starts ? " equipped" : ""}${
      locked ? " locked" : ""
    }" data-key="${weapon.key}"${locked ? " disabled" : ""}>
      <span class="arm-card-head">
        <span class="arm-key">${key || "—"}</span>
        <span class="arm-titles">
          <span class="arm-name">${weapon.name}</span>
          <span class="arm-class">${weapon.class}</span>
        </span>
      </span>
      <span class="arm-stats">${bars}</span>
      <span class="arm-tag">${
        locked
          ? `LOCKED · LEVEL ${weapon.unlockLevel}`
          : starts
            ? "DEPLOYS EQUIPPED"
            : weapon.mode
      }</span>
    </button>`;
  }

  function render() {
    const p = progression.levelProgress;
    els.body.innerHTML =
      `<div class="arm-profile">
        <span class="arm-level">LEVEL ${progression.level}</span>
        <span class="arm-xpbar"><b style="width:${Math.round(p.frac * 100)}%"></b></span>
        <span class="arm-xp">${
          p.span ? `${p.into} / ${p.span} XP` : "MAX LEVEL"
        }</span>
      </div>` +
      `<p class="arm-note">You carry every gun you have unlocked — the number
        beside each is its key. Pick the one you deploy holding.</p>` +
      SLOT_GROUPS.map(
        (group) =>
          `<div class="arm-slot">
            <h3 class="arm-slot-title">${group.label}</h3>
            <div class="arm-grid">${progression
              .forSlot(group.slot)
              .map((w) => card(w))
              .join("")}</div>
          </div>`,
      ).join("");
  }

  els.body.addEventListener("click", (e) => {
    const card = e.target.closest(".arm-card");
    if (!card || card.disabled) return;
    progression.setStart(card.dataset.key);
    render();
    onChange && onChange(progression.loadout, progression.start);
  });

  const open = () => {
    render();
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
  return { open, close, isOpen, render };
}
