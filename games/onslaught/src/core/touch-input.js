// Touch actions use the same snapshots as keyboard input. Edges survive until
// a simulation tick consumes them; look motion is consumed once per frame.
export class TouchInput {
  constructor() {
    this.sensitivity = 1;
    this.locked = false;
    this.onLockChange = null;
    this.onActiveChange = null;
    this.reset();
  }
  reset() {
    this.move = { x: 0, y: 0 };
    this.held = new Set();
    this.pressed = new Set();
    this.ads = false;
    this.autoSprint = true;
    this.dx = this.dy = 0;
  }
  lock() {
    this.reset();
    this.locked = true;
    this.onActiveChange?.(true);
  }
  unlock() {
    this.locked = false;
    this.reset();
    this.onActiveChange?.(false);
  }
  press(action) {
    if (!this.locked) return;
    if (action === "ads") this.ads = !this.ads;
    else if (action === "sprint") this.autoSprint = !this.autoSprint;
    else {
      this.held.add(action);
      this.pressed.add(action);
    }
  }
  release(action) { this.held.delete(action); }
  frame() {
    const active = this.locked;
    const held = (a) => active && this.held.has(a);
    const edge = (a) => active && this.pressed.has(a);
    return {
      move: active ? { ...this.move } : { x: 0, y: 0 },
      fire: edge("fire"), fireHeld: held("fire"),
      ads: active && this.ads, reload: edge("reload"),
      sprint: active && this.autoSprint && !this.ads && !held("fire"),
      jump: edge("jump"), crouch: held("crouch"),
      crouchPressed: edge("crouch"), switchTo: -1,
      swapLast: false, wheel: edge("weapon") ? 1 : 0,
    };
  }
  endTick() { this.pressed.clear(); }
  endFrame() { this.dx = this.dy = 0; }
}
