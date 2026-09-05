export const RUNS_KEY = "onslaught.runs.v1";

// Local history of finished runs so balance decisions can use many runs.
export class RunLog {
  constructor(
    storage = typeof localStorage === "undefined" ? null : localStorage,
    cap = 30,
  ) {
    ((this.storage = storage), (this.cap = cap), (this.records = []));
    try {
      const raw = storage && storage.getItem(RUNS_KEY);
      const p = raw && JSON.parse(raw);
      Array.isArray(p) && (this.records = p);
    } catch {
      this.records = [];
    }
  }
  list() {
    return this.records.slice();
  }
  append(record) {
    (this.records.unshift(record),
      this.records.length > this.cap && (this.records.length = this.cap),
      this._save());
  }
  clear() {
    ((this.records = []), this._save());
  }
  _save() {
    try {
      this.storage && this.storage.setItem(RUNS_KEY, JSON.stringify(this.records));
    } catch {
      /* quota: keep in memory */
    }
  }
}
