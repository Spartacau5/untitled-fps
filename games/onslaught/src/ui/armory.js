import { LOADOUT_SIZE, WEAPONS } from "../data/weapons.js";
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

// The roster in the order it opens, so the grid reads as a ladder left to
// right and a newly earned gun lands next to the one before it rather than
// somewhere in the middle of an alphabetical list.
const ROSTER = WEAPONS.slice().sort(
  (a, b) =>
    (a.unlockLevel || 0) - (b.unlockLevel || 0) || a.name.localeCompare(b.name),
);

// You carry three guns and only three. The panel is therefore two halves: the
// rail at the top is what you are taking, and the grid below is everything you
// could take. Picking a slot on the rail then a gun in the grid is the whole
// interaction - there is no drag, and no way to end up with four.
export function mountArmory(progression, els, onChange) {
  // Peak value per stat across every gun, computed once.
  const peaks = STATS.map(([, read]) =>
    ROSTER.reduce((m, w) => Math.max(m, read(w)), 0),
  );
  const byKey = new Map(WEAPONS.map((w) => [w.key, w]));
  // Which key the next grid pick lands on. Kept here rather than in the
  // profile: it is a cursor in a menu, not something worth persisting.
  let slot = 0;
  // Guns the last run opened, marked until the player deploys again.
  let fresh = new Set();

  function rail() {
    const cards = progression.loadout
      .map((key, i) => {
        const w = byKey.get(key);
        const active = i === slot,
          starts = progression.start === key;
        return `<button type="button" class="arm-rail-slot${
          active ? " is-active" : ""
        }${starts ? " is-spawn" : ""}" data-act="slot" data-slot="${i}" aria-pressed="${active}">
          <span class="arm-key">${i + 1}</span>
          <span class="arm-titles">
            <span class="arm-name">${w ? w.name : "EMPTY"}</span>
            <span class="arm-class">${w ? w.class : ""}</span>
          </span>
          <span class="arm-rail-tag">${starts ? "SPAWN" : active ? "EDITING" : ""}</span>
        </button>`;
      })
      .join("");
    // No separate 'deploy with' control any more: you start on key 1, so
    // the way to choose is to put that gun on key 1. One concept instead of
    // two that could disagree.
    return `<div class="arm-rail">
      <h3 class="arm-slot-title">YOUR LOADOUT<em>KEY 1 IS WHAT YOU DEPLOY HOLDING</em></h3>
      <div class="arm-rail-row">${cards}</div>
    </div>`;
  }

  function card(weapon) {
    const locked = !progression.isUnlocked(weapon.key),
      carried = progression.isEquipped(weapon.key),
      on = progression.slotOf(weapon.key),
      starts = progression.start === weapon.key,
      isNew = fresh.has(weapon.key);
    const bars = STATS.map(
      ([label, read], i) =>
        `<span class="arm-stat"><span>${label}</span><i><b style="width:${pct(read(weapon), peaks[i])}%"></b></i></span>`,
    ).join("");
    // Four states the player must never confuse: LOCKED (below level), NEW
    // (just earned and not yet carried), SPAWN/ON KEY n (one of your three),
    // and AVAILABLE. Each gets its own card class so the border, key badge and
    // status chip move together.
    const state = locked
      ? `LOCKED · LEVEL ${weapon.unlockLevel}`
      : starts
        ? `SPAWN · KEY ${on}`
        : carried
          ? `ON KEY ${on}`
          : isNew
            ? "NEW · UNLOCKED"
            : "AVAILABLE";
    // The badge is the number key, so a gun that holds none gets a dot rather
    // than a letter: band initials collide (three guns start with S) and would
    // read as keys that do not exist.
    const badge = carried ? on : locked ? "🔒" : "·";
    return `<div class="arm-card${carried ? " equipped" : ""}${
      starts ? " deploying" : ""
    }${locked ? " locked" : ""}${isNew && !carried ? " is-new" : ""}">
      <button type="button" class="arm-pick" data-act="equip" data-key="${weapon.key}" aria-pressed="${carried}"${
        locked ? " disabled" : ""
      }>
        <span class="arm-card-head">
          <span class="arm-key">${badge}</span>
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
    </div>`;
  }

  // What is still to earn: one line per gun, the level that opens it, and what
  // kind of gun it is. The road ahead in one glance; the cards above are only
  // for what you can touch today.
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
              <span class="arm-rung-sub">${r.klass}</span>
            </span>
            ${i === 0 ? '<span class="arm-rung-tag">NEXT</span>' : ""}
          </div>`,
      )
      .join("");
    return `<div class="arm-ladder"><h3 class="arm-slot-title">COMING UP<em>${rungs.length} TO EARN</em></h3>${rows}</div>`;
  }

  function render() {
    const pool = progression.unlocked.length;
    els.body.innerHTML =
      rail() +
      `<p class="arm-note">You carry <b>${LOADOUT_SIZE}</b> guns, one per number
        key - that never changes. Levelling opens more to choose between:
        <b>${pool}</b> of ${WEAPONS.length} so far.</p>
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
      </div>
      <div class="arm-slot">
        <h3 class="arm-slot-title">ARMORY<em>KEY ${slot + 1} IS SELECTED</em></h3>
        <div class="arm-grid">${ROSTER.map(card).join("")}</div>
      </div>` +
      ladder();
  }

  els.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn || btn.disabled) return;
    const act = btn.dataset.act;
    if (act === "slot") slot = Number(btn.dataset.slot) || 0;
    else if (act === "equip") {
      const key = btn.dataset.key;
      // A gun already on the selected key has nowhere to go; anything else
      // moves onto it, and equip() swaps rather than duplicating.
      //
      // This used to just move the cursor to whatever key a carried gun sat
      // on, which meant a gun you already had could never be moved - and now
      // that key 1 is the gun you deploy holding, being unable to move one
      // onto key 1 would leave no way to choose it at all.
      if (progression.slotOf(key) !== slot + 1) {
        progression.equip(key, slot);
        fresh.delete(key);
      }
    }
    render();
    onChange && onChange(progression.loadout, progression.start);
  });

  const open = () => {
    render();
    els.panel.classList.remove("hidden");
    els.menuMain.classList.add("hidden");
  };
  // Opened from a card on the deploy screen: that card is the key the
  // player means to change, so the panel arrives already pointing at it.
  const openAt = (at) => {
    slot = Math.max(0, Math.min(LOADOUT_SIZE - 1, Math.floor(at) || 0));
    open();
  };
  const close = () => {
    els.panel.classList.add("hidden");
    els.menuMain.classList.remove("hidden");
  };
  const isOpen = () => !els.panel.classList.contains("hidden");
  // The game tells the armory what the last run opened so those guns are
  // findable in a grid that only gets longer.
  const setFresh = (keys) => {
    fresh = new Set(keys || []);
    isOpen() && render();
  };
  els.btnOpen.addEventListener("click", open);
  els.btnBack.addEventListener("click", close);
  return { open, openAt, close, isOpen, render, setFresh };
}
