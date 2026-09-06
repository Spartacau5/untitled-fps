import {
  DEFAULT_LOADOUT,
  DEFAULT_START,
  WEAPONS,
} from "../data/weapons.js";

export const STORAGE_KEY = "onslaught.profile.v1";

// Cumulative XP needed to reach a level. Quadratic, so early levels arrive
// quickly and later ones stretch out. Level 1 is where everyone starts.
export const MAX_LEVEL = 50;
export function xpForLevel(level) {
  const n = Math.max(0, level - 1);
  return 200 * n + 60 * n * n;
}
export function levelForXp(xp) {
  let level = 1;
  while (level < MAX_LEVEL && xp >= xpForLevel(level + 1)) level++;
  return level;
}

// What a finished run is worth. Score dominates, with kills and depth adding
// enough that a short aggressive run still pays.
export function xpForRun({ score = 0, kills = 0, wave = 0 } = {}) {
  return Math.max(0, Math.round(score / 10) + kills * 2 + wave * 25);
}

const BY_KEY = new Map(WEAPONS.map((w) => [w.key, w]));

// Persisted player profile: XP, level and the chosen loadout. Presentation
// side by design — the sim is handed a loadout, it never reads this. Storage
// is injected so tests can run it without a browser.
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
      (this.start = this._sanitizeStart(saved.start)));
  }
  // Every unlocked gun is carried, in table order, so each keeps a fixed
  // number key. Locked guns drop out rather than leaving a dead key.
  get loadout() {
    const carried = DEFAULT_LOADOUT.filter((k) => this.isUnlocked(k));
    return carried.length ? carried : [DEFAULT_LOADOUT[0]];
  }
  // The gun a run begins on. Must exist, be unlocked, and be one you carry;
  // an edited or stale save falls back rather than starting you empty-handed.
  _sanitizeStart(key) {
    return key && BY_KEY.has(key) && this.isUnlocked(key)
      ? key
      : DEFAULT_START;
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
  // Weapons for one slot, in unlock order, so the armory can list them.
  forSlot(slot) {
    return WEAPONS.filter((w) => w.slot === slot).sort(
      (a, b) => (a.unlockLevel || 0) - (b.unlockLevel || 0),
    );
  }
  // Choose the gun you deploy holding. Deliberately does not reorder the
  // loadout: the number keys stay put so picking a new favourite does not
  // move every other gun.
  setStart(key) {
    if (!BY_KEY.has(key) || !this.isUnlocked(key)) return this.start;
    ((this.start = key), this._save(), this._emit());
    return this.start;
  }
  // Which key selects a gun mid-run, 1-based, or 0 if it is not carried.
  slotOf(key) {
    return this.loadout.indexOf(key) + 1;
  }
  // Bank a finished run. Returns what was earned so the debrief can show it,
  // including any levels crossed.
  addRun(summary) {
    const gained = xpForRun(summary),
      before = this.level;
    ((this.xp += gained), this._save(), this._emit());
    return { gained, level: this.level, levelsGained: this.level - before };
  }
  reset() {
    ((this.xp = 0), (this.start = DEFAULT_START), this._save(), this._emit());
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
          JSON.stringify({ xp: this.xp, start: this.start }),
        );
    } catch {
      // A blocked or full localStorage must not take the run down with it.
    }
  }
}
