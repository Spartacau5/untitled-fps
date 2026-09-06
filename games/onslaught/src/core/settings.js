export const STORAGE_KEY = "onslaught.settings.v1";

export const DEFAULTS = {
  // 2 high, 1 balanced, 0 performance. Drives render scale, the scene
  // target's MSAA and the shadow map -- the three things that actually cost
  // frames on a weak GPU. See Game._applyQuality.
  quality: 2,
  sensitivity: 1,
  fov: 80,
  master: 0.9,
  music: 1,
  sfx: 1,
  shake: 1,
};

export const RANGES = {
  quality: { min: 0, max: 2, step: 1 },
  sensitivity: { min: 0.2, max: 3, step: 0.1 },
  fov: { min: 70, max: 110, step: 1 },
  master: { min: 0, max: 1, step: 0.05 },
  music: { min: 0, max: 1, step: 0.05 },
  sfx: { min: 0, max: 1, step: 0.05 },
  shake: { min: 0, max: 1.5, step: 0.1 },
};

const snap = (key, v) => {
  const r = RANGES[key],
    c = Math.min(r.max, Math.max(r.min, v));
  return +(Math.round((c - r.min) / r.step) * r.step + r.min).toFixed(4);
};

// Persisted user preferences. Presentation-only: the sim never reads these,
// so a setting can never change what a seed produces.
export class Settings {
  constructor(
    storage = typeof localStorage === "undefined" ? null : localStorage,
  ) {
    ((this.storage = storage),
      (this.listeners = []),
      (this.values = { ...DEFAULTS }));
    let raw = null;
    try {
      raw = storage && storage.getItem(STORAGE_KEY);
    } catch {
      raw = null;
    }
    if (raw) {
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
      if (parsed && typeof parsed === "object")
        for (const k in DEFAULTS)
          typeof parsed[k] === "number" &&
            Number.isFinite(parsed[k]) &&
            (this.values[k] = snap(k, parsed[k]));
    }
  }
  all() {
    return { ...this.values };
  }
  get(key) {
    return this.values[key];
  }
  set(key, value) {
    if (!(key in DEFAULTS)) throw new Error(`Unknown setting: ${key}`);
    const v = snap(key, +value);
    if (v === this.values[key]) return v;
    ((this.values[key] = v), this._save());
    for (const fn of this.listeners) fn(key, v, this.values);
    return v;
  }
  reset() {
    for (const k in DEFAULTS) this.set(k, DEFAULTS[k]);
  }
  onChange(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((f) => f !== fn);
    };
  }
  _save() {
    try {
      this.storage &&
        this.storage.setItem(STORAGE_KEY, JSON.stringify(this.values));
    } catch {
      // Quota exceeded or private mode: keep the value in memory only.
    }
  }
}
