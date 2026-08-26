export class Bus {
  constructor() { this._m = new Map(); }
  on(name, fn) {
    let s = this._m.get(name);
    if (!s) { s = new Set(); this._m.set(name, s); }
    s.add(fn);
    return () => this.off(name, fn);
  }
  off(name, fn) { const s = this._m.get(name); if (s) s.delete(fn); }
  emit(name, data) {
    const s = this._m.get(name);
    if (!s) return;
    for (const fn of [...s]) fn(data);
  }
  clear() { this._m.clear(); }
}
export const bus = new Bus();
