import {
  BANDS,
  DEFAULT_START,
  LOADOUT_SIZE,
  STARTER_LOADOUT,
  WEAPONS,
} from "../data/weapons.js";

export const STORAGE_KEY = "onslaught.profile.v1";

// Cumulative XP to reach a level. Mildly quadratic, tuned arcade-easy: a strong
// first run levels you, and the roster is open in an evening or three rather
// than gated behind a grind.
export const MAX_LEVEL = 50;
export function xpForLevel(level) {
  const n = Math.max(0, level - 1);
  return 1200 * n + 300 * n * n;
}
export function levelForXp(xp) {
  let level = 1;
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level++;
  return level;
}

// Kills are the whole of it, plus a bonus per wave cleared that grows with
// depth. Score is deliberately not part of this: it is the thing you compete on
// daily, and letting it feed unlocks would mean the leaderboard and the armory
// pulled in the same direction and a good run counted twice.
export const XP_PER_KILL = 12;
export const XP_PER_WAVE = 25;
export function xpForRun({ kills = 0, wave = 0 } = {}) {
  const cleared = Math.max(0, Math.floor(wave));
  const waveBonus = (XP_PER_WAVE * cleared * (cleared + 1)) / 2;
  return Math.max(0, Math.round(Math.max(0, kills) * XP_PER_KILL + waveBonus));
}

const BAND_LABEL = new Map(BANDS.map((b) => [b.id, b.label]));

// The road ahead, as rungs. Every gun past the starting three is one rung -
// there is no band step any more, because a band no longer owns a key; what you
// earn is another gun for the pool your three slots draw from.
//
// Built from the weapon table so the menu, the rank bar and the armory all
// describe the same ladder, and a tuning change to one unlockLevel moves all
// three at once.
export function unlockLadder() {
  return WEAPONS.filter((w) => (w.unlockLevel || 1) > 1)
    .map((w) => ({
      level: w.unlockLevel || 1,
      kind: "weapon",
      key: w.key,
      band: w.band,
      label: w.name,
      weapon: w.name,
      klass: BAND_LABEL.get(w.band) || "",
    }))
    .sort((a, b) => a.level - b.level || a.label.localeCompare(b.label));
}

// The first rung above a level, or null once the roster is open.
export function nextUnlock(level) {
  return unlockLadder().find((r) => r.level > level) || null;
}

// Rungs crossed by moving from one level to another - what a debrief lists.
export function unlocksBetween(from, to) {
  return unlockLadder().filter((r) => r.level > from && r.level <= to);
}

const BY_KEY = new Map(WEAPONS.map((w) => [w.key, w]));

// Persisted player profile: XP, level, and the three guns you carry.
// Presentation side by design - the sim is handed a loadout, it never reads
// this. Storage is injected so tests can run it without a browser.
export class Progression {
  constructor(
    storage = typeof localStorage === "undefined" ? null : localStorage,
  ) {
    ((this.storage = storage), (this.listeners = []));
    let saved = null;
    try {
      const raw = storage && storage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch {
      saved = null;
    }
    if (!saved || typeof saved !== "object") saved = {};
    ((this.xp = Number.isFinite(saved.xp) && saved.xp > 0 ? saved.xp : 0),
      (this.slots = this._sanitizeSlots(saved.slots)),
      (this.start = this._sanitizeStart(saved.start)));
  }

  // The three guns you deploy with, in key order.
  get loadout() {
    return this.slots.slice();
  }

  // Every gun the current level has opened, in unlock order. This is the pool
  // the three slots are filled from.
  get unlocked() {
    return WEAPONS.filter((w) => this.isUnlocked(w.key)).sort(
      (a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0),
    );
  }

  // A slot has to hold a gun that exists and is unlocked, and no gun may hold
  // two slots. Anything that fails falls back to the first unlocked gun not
  // already carried, so an edited or stale save can never leave a key empty or
  // the same rifle on two of them.
  _sanitizeSlots(slots) {
    const want = Array.isArray(slots) ? slots : STARTER_LOADOUT;
    const out = [];
    for (let i = 0; i < LOADOUT_SIZE; i++) {
      const key = want[i],
        def = BY_KEY.get(key);
      if (def && this.isUnlocked(key) && !out.includes(key)) {
        out.push(key);
        continue;
      }
      const fallback =
        STARTER_LOADOUT.find((k) => !out.includes(k) && this.isUnlocked(k)) ||
        WEAPONS.find((w) => this.isUnlocked(w.key) && !out.includes(w.key));
      out.push(fallback ? fallback.key || fallback : STARTER_LOADOUT[i]);
    }
    return out;
  }

  // Put a gun in a slot. If it is already carried elsewhere the two swap, so
  // reordering never silently drops one of the three.
  equip(key, slot = 0) {
    const def = BY_KEY.get(key);
    const at = Math.max(0, Math.min(LOADOUT_SIZE - 1, Math.floor(slot) || 0));
    if (!def || !this.isUnlocked(key)) return this.loadout;
    const next = this.slots.slice();
    const existing = next.indexOf(key);
    if (existing === at) return this.loadout;
    if (existing >= 0) next[existing] = next[at];
    next[at] = key;
    ((this.slots = next),
      // If the gun that was deploying just got benched, deploy with whatever
      // replaced it rather than a gun you are no longer carrying.
      this.slots.includes(this.start) || (this.start = this.slots[at]),
      this._save(),
      this._emit());
    return this.loadout;
  }

  // The gun a run begins on. Must exist, be unlocked, and be one you carry; an
  // edited or stale save falls back rather than starting you empty-handed.
  _sanitizeStart(key) {
    if (key && this.slots.includes(key) && this.isUnlocked(key)) return key;
    return this.slots.includes(DEFAULT_START) ? DEFAULT_START : this.slots[0];
  }

  get level() {
    return levelForXp(this.xp);
  }

  // Progress through the current level, for the XP bar.
  get levelProgress() {
    const l = this.level;
    if (l >= MAX_LEVEL) return { into: 0, span: 0, frac: 1 };
    const base = xpForLevel(l),
      next = xpForLevel(l + 1);
    return {
      into: this.xp - base,
      span: next - base,
      frac: (this.xp - base) / (next - base),
    };
  }

  isUnlocked(key) {
    const def = BY_KEY.get(key);
    return !!def && this.level >= (def.unlockLevel || 0);
  }

  // The next rung at this level, for the rank strip and the loadout screen.
  nextUnlock() {
    return nextUnlock(this.level);
  }

  // The level a locked gun opens at, for the armory to show what it costs.
  unlockLevelOf(key) {
    const def = BY_KEY.get(key);
    return def ? def.unlockLevel || 0 : 0;
  }

  // Weapons for one slot type, in unlock order, so the armory can list them.
  forSlot(slot) {
    return WEAPONS.filter((w) => w.slot === slot).sort(
      (a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0),
    );
  }

  isEquipped(key) {
    return this.slots.includes(key);
  }

  // Choose the gun you deploy holding. Deliberately does not reorder the
  // loadout: the number keys stay put so picking a new favourite does not move
  // the other two.
  setStart(key) {
    if (!this.slots.includes(key)) return this.start;
    ((this.start = key), this._save(), this._emit());
    return this.start;
  }

  // Which key selects a gun mid-run, 1-based, or 0 if it is not carried.
  slotOf(key) {
    return this.slots.indexOf(key) + 1;
  }

  // Bank a finished run. Returns what was earned so the debrief can show it,
  // including any levels crossed and anything they opened.
  addRun(summary) {
    const gained = xpForRun(summary),
      before = this.level;
    this.xp += gained;
    const after = this.level;
    (this._save(), this._emit());
    return {
      gained,
      level: after,
      levelsGained: after - before,
      unlocks: unlocksBetween(before, after),
    };
  }

  reset() {
    ((this.xp = 0),
      (this.slots = STARTER_LOADOUT.slice()),
      (this.start = DEFAULT_START),
      this._save(),
      this._emit());
  }

  onChange(fn) {
    this.listeners.push(fn);
  }

  _emit() {
    for (const fn of this.listeners) fn(this);
  }

  _save() {
    try {
      this.storage &&
        this.storage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            xp: this.xp,
            slots: this.slots,
            start: this.start,
          }),
        );
    } catch {
      // A blocked or full localStorage must not take the run down with it.
    }
  }
}
