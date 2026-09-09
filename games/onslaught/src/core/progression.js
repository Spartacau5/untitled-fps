import {
  BANDS,
  DEFAULT_PICKS,
  DEFAULT_START,
  WEAPONS,
  weaponsInBand,
} from "../data/weapons.js";

export const STORAGE_KEY = "onslaught.profile.v1";

// Cumulative XP to reach a level. Mildly quadratic, tuned arcade-easy: the
// first unlock lands inside a few runs and the whole roster opens in an
// evening or three, rather than gating firepower behind a grind.
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
// depth. Score is deliberately not part of this: it is the thing you compete
// on daily, and letting it feed unlocks would mean the leaderboard and the
// armory pulled in the same direction and a good run counted twice.
export const XP_PER_KILL = 12;
export const XP_PER_WAVE = 25;
export function xpForRun({ kills = 0, wave = 0 } = {}) {
  const cleared = Math.max(0, Math.floor(wave));
  const waveBonus = (XP_PER_WAVE * cleared * (cleared + 1)) / 2;
  return Math.max(0, Math.round(Math.max(0, kills) * XP_PER_KILL + waveBonus));
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
      (this.picks = this._sanitizePicks(saved.picks)),
      (this.start = this._sanitizeStart(saved.start)));
  }
  // Bands you have reached the level for, in band order, so each keeps a fixed
  // number key whichever gun you put there. A new profile is three guns; the
  // rest appear on the keys beneath as they unlock.
  get bands() {
    const level = this.level;
    return BANDS.filter((b) => level >= (b.unlockLevel || 1));
  }
  get loadout() {
    return this.bands.map((b) => this.picks[b.id]);
  }
  // A pick has to exist, be unlocked, and actually belong to its band. Any
  // that does not falls back to the first unlocked gun in that band, so an
  // edited or stale save can never leave a key holding nothing.
  _sanitizePicks(picks) {
    const want = picks && typeof picks === "object" ? picks : {};
    return Object.fromEntries(
      BANDS.map((b) => {
        const key = want[b.id],
          def = BY_KEY.get(key);
        if (def && def.band === b.id && this.isUnlocked(key))
          return [b.id, key];
        const open = weaponsInBand(b.id).find((w) => this.isUnlocked(w.key));
        return [b.id, open ? open.key : weaponsInBand(b.id)[0].key];
      }),
    );
  }
  // Put a gun on its band's key.
  equip(key) {
    const def = BY_KEY.get(key);
    if (!def || !this.isUnlocked(key)) return this.loadout;
    ((this.picks = { ...this.picks, [def.band]: key }),
      // If the gun that was deploying just got benched, deploy with its
      // replacement rather than a gun the player is no longer carrying.
      this.loadout.includes(this.start) || (this.start = key),
      this._save(),
      this._emit());
    return this.loadout;
  }
  // The gun a run begins on. Must exist, be unlocked, and be one you carry;
  // an edited or stale save falls back rather than starting you empty-handed.
  _sanitizeStart(key) {
    return key && this.loadout.includes(key) && this.isUnlocked(key)
      ? key
      : this.loadout.includes(DEFAULT_START)
        ? DEFAULT_START
        : this.loadout[0];
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
  // Whether this gun is the one currently holding its band's key.
  isEquipped(key) {
    const def = BY_KEY.get(key);
    return !!def && this.picks[def.band] === key;
  }
  // Choose the gun you deploy holding. Deliberately does not reorder the
  // loadout: the number keys stay put so picking a new favourite does not
  // move every other gun.
  setStart(key) {
    if (!this.loadout.includes(key)) return this.start;
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
    ((this.xp = 0),
      (this.picks = { ...DEFAULT_PICKS }),
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
            picks: this.picks,
            start: this.start,
          }),
        );
    } catch {
      // A blocked or full localStorage must not take the run down with it.
    }
  }
}
