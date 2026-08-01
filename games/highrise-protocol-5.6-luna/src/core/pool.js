export class Pool {
  constructor({ create, reset, max = 64 }) {
    this.create = create;
    this.reset = reset;
    this.max = max;
    this.items = [];
    this.active = [];
    this.stamp = 0;
  }

  acquire() {
    let item = this.items.find((candidate) => !candidate.active);
    if (!item && this.items.length < this.max) {
      item = this.create();
      item.active = false;
      item.poolAge = 0;
      this.items.push(item);
    }
    if (!item) {
      item = this.active[0];
      for (let index = 1; index < this.active.length; index += 1) {
        if (this.active[index].poolStamp < item.poolStamp) item = this.active[index];
      }
      this.reset?.(item);
    }
    item.active = true;
    item.poolAge = 0;
    item.poolStamp = this.stamp;
    this.stamp += 1;
    if (!this.active.includes(item)) this.active.push(item);
    return item;
  }

  release(item) {
    if (!item) return;
    item.active = false;
    const index = this.active.indexOf(item);
    if (index >= 0) this.active.splice(index, 1);
    this.reset?.(item);
  }

  updateAges(dt) { for (const item of this.active) item.poolAge += dt; }
  get size() { return this.items.length; }
  get activeCount() { return this.active.length; }
}
