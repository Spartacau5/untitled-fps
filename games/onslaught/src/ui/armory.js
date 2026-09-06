import { BANDS, weaponsInBand } from "../data/weapons.js";

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
  // Peak value per stat across every gun, computed once.
  const all = BANDS.flatMap((b) => weaponsInBand(b.id));
  const peaks = STATS.map(([, read]) =>
    all.reduce((m, w) => Math.max(m, read(w)), 0),
  );

  function card(weapon, key) {
    const locked = !progression.isUnlocked(weapon.key),
      equipped = progression.isEquipped(weapon.key),
      starts = progression.start === weapon.key;
    const bars = STATS.map(
      ([label, read], i) =>
        `<span class="arm-stat"><span>${label}</span><i><b style="width:${pct(read(weapon), peaks[i])}%"></b></i></span>`,
    ).join("");
    // The card is a div holding two buttons: nesting one button inside
    // another is invalid, and these are genuinely two different actions.
    return `<div class="arm-card${equipped ? " equipped" : ""}${
      locked ? " locked" : ""
    }">
      <button type="button" class="arm-pick" data-act="equip" data-key="${weapon.key}"${
        locked ? " disabled" : ""
      }>
        <span class="arm-card-head">
          <span class="arm-key">${key}</span>
          <span class="arm-titles">
            <span class="arm-name">${weapon.name}</span>
            <span class="arm-class">${weapon.class}</span>
          </span>
        </span>
        <span class="arm-stats">${bars}</span>
        <span class="arm-tag">${
          locked
            ? `LOCKED · LEVEL ${weapon.unlockLevel}`
            : equipped
              ? "EQUIPPED"
              : weapon.mode
        }</span>
      </button>
      ${
        equipped
          ? `<button type="button" class="arm-start${starts ? " on" : ""}" data-act="start" data-key="${weapon.key}">${
              starts ? "DEPLOYS WITH THIS" : "DEPLOY WITH THIS"
            }</button>`
          : ""
      }
    </div>`;
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
      `<p class="arm-note">One gun per number key. Guns in the same category
        share a key, so pick the one you want on it — then choose which of them
        you deploy holding.</p>` +
      BANDS.map((band, i) => {
        const guns = weaponsInBand(band.id);
        return `<div class="arm-slot">
            <h3 class="arm-slot-title">${band.label}<em>KEY ${i + 1}</em></h3>
            <div class="arm-grid">${guns
              .map((w) => card(w, i + 1))
              .join("")}</div>
          </div>`;
      }).join("");
  }

  els.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn || btn.disabled) return;
    if (btn.dataset.act === "equip") progression.equip(btn.dataset.key);
    else progression.setStart(btn.dataset.key);
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
