import { BANDS, weaponsInBand } from "../data/weapons.js";
import { unlockLadder } from "../core/progression.js";

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
    // Three states the player must never confuse: LOCKED (below level),
    // EQUIPPED (this gun holds that number key) and DEPLOYING (equipped AND
    // the gun you spawn holding). Each gets its own card class so the border,
    // key badge and status chip can move together.
    const state = locked
      ? `LOCKED · LEVEL ${weapon.unlockLevel}`
      : starts
        ? `SPAWN · KEY ${key}`
        : equipped
          ? `ON KEY ${key}`
          : "AVAILABLE";
    // The card is a div holding two buttons: nesting one button inside
    // another is invalid, and these are genuinely two different actions.
    return `<div class="arm-card${equipped ? " equipped" : ""}${
      starts ? " deploying" : ""
    }${locked ? " locked" : ""}">
      <button type="button" class="arm-pick" data-act="equip" data-key="${weapon.key}" aria-pressed="${equipped}"${
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
        <span class="arm-tag"
          ><span class="arm-state">${state}</span
          ><span class="arm-mode">${weapon.mode}</span></span
        >
      </button>
      ${
        equipped
          ? `<button type="button" class="arm-start${starts ? " on" : ""}" data-act="start" data-key="${weapon.key}" aria-pressed="${starts}">${
              starts ? "DEPLOYS WITH THIS" : "DEPLOY WITH THIS"
            }</button>`
          : ""
      }
    </div>`;
  }

  // A band the player has not reached is one line in a ladder, not a row of
  // greyed-out cards: what it is, which key it will take, and the level that
  // opens it. Later guns inside open bands are rungs too. The ladder is the
  // road ahead in one glance; the cards are only for what you can touch.
  function ladder() {
    const level = progression.level;
    const rungs = unlockLadder().filter((r) => r.level > level);
    if (!rungs.length)
      return `<div class="arm-ladder"><h3 class="arm-slot-title">COMING UP</h3><div class="arm-rung is-done"><span class="arm-rung-lvl">✓</span><span class="arm-rung-body"><span class="arm-rung-name">EVERY GUN UNLOCKED</span></span></div></div>`;
    const rows = rungs
      .map(
        (r, i) =>
          `<div class="arm-rung${i === 0 ? " is-next" : ""}">
            <span class="arm-rung-lvl">LVL ${r.level}</span>
            <span class="arm-rung-body">
              <span class="arm-rung-name">${r.label}</span>
              <span class="arm-rung-sub">${
                r.kind === "band"
                  ? `OPENS KEY ${r.key} · ${r.weapon}`
                  : `${r.klass} · KEY ${r.key}`
              }</span>
            </span>
            ${i === 0 ? '<span class="arm-rung-tag">NEXT</span>' : ""}
          </div>`,
      )
      .join("");
    return `<div class="arm-ladder"><h3 class="arm-slot-title">COMING UP<em>${rungs.length} TO EARN</em></h3>${rows}</div>`;
  }

  function render() {
    const level = progression.level;
    const open = BANDS.filter((b) => level >= (b.unlockLevel || 1));
    els.body.innerHTML =
      `<p class="arm-note">You carry <b>${open.length}</b> ${
        open.length === 1 ? "gun" : "guns"
      }, one per number key. Guns in the same category share a key: pick the
        one you want on it, then choose which you deploy holding. Level up to
        open more keys.</p>
      <div class="arm-legend">
        <span class="arm-legend-item"
          ><i class="arm-swatch is-deploying"></i>SPAWN GUN</span
        ><span class="arm-legend-item"
          ><i class="arm-swatch is-equipped"></i>ON A NUMBER KEY</span
        ><span class="arm-legend-item"
          ><i class="arm-swatch"></i>AVAILABLE</span
        ><span class="arm-legend-item"
          ><i class="arm-swatch is-locked"></i>LOCKED</span
        >
      </div>` +
      BANDS.map((band, i) => {
        if (level < (band.unlockLevel || 1)) return "";
        const guns = weaponsInBand(band.id);
        return `<div class="arm-slot">
            <h3 class="arm-slot-title">${band.label}<em>KEY ${i + 1}</em></h3>
            <div class="arm-grid">${guns
              .map((w) => card(w, i + 1))
              .join("")}</div>
          </div>`;
      }).join("") +
      ladder();
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
