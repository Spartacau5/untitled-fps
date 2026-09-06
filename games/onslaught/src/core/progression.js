import { DEFAULT_LOADOUT, WEAPONS } from "../data/weapons.js";

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
const slotOf = (key) => (BY_KEY.get(key) || {}).slot;

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
      (this.loadout = this._sanitize(saved.loadout)));
  }
  // A loadout is always one primary then one sidearm, and every gun in it has
  // to exist and be unlocked. Anything else falls back slot by slot, so an
  // edited or stale save can never leave the player holding nothing.
  _sanitize(loadout) {
    const want = Array.isArray(loadout) ? loadout : [];
    return DEFAULT_LOADOUT.map((fallback, i) => {
      const key = want[i];
      return key &&
        BY_KEY.has(key) &&
        slotOf(key) === slotOf(fallback) &&
        this.isUnlocked(key)
        ? key
        : fallback;
    });
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
  equip(slotIndex, key) {
    if (!BY_KEY.has(key) || !this.isUnlocked(key)) return this.loadout;
    if (slotOf(key) !== slotOf(DEFAULT_LOADOUT[slotIndex])) return this.loadout;
    ((this.loadout = this.loadout.slice()),
      (this.loadout[slotIndex] = key),
      this._save(),
      this._emit());
    return this.loadout;
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
    ((this.xp = 0), (this.loadout = DEFAULT_LOADOUT.slice()), this._save(), this._emit());
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
          JSON.stringify({ xp: this.xp, loadout: this.loadout }),
        );
    } catch {
      // A blocked or full localStorage must not take the run down with it.
    }
  }
}
