// Unified input state. Pointer lock handled defensively (K3).
import { bus } from './bus.js';

class Input {
  constructor() {
    this.keys = new Set();
    this.lmb = false; this.rmb = false;
    this.dx = 0; this.dy = 0;            // accumulated mouse delta (px), consumed each frame
    this.locked = false;
    this.lockPending = false;
    this.shiftTapTimes = [];
    this.consumed = { forward: 0, right: 0 };
    this.sensitivity = parseFloat(localStorage.getItem('hrp.sens')) || 1;   // wheel-tunable, persisted
    this.enabled = true;
    this._bind();
  }
  _bind() {
    window.addEventListener('keydown', (e) => {
      if (!e.repeat && (e.code === 'ShiftLeft' || e.code === 'ShiftRight')) {
        const now = performance.now();
        const t = this.shiftTapTimes;
        if (t.length && now - t[t.length - 1] < 260) { t.length = 0; this._tacSprint(); }
        else t.push(now);
        if (t.length > 3) t.shift();
      }
      this.keys.add(e.code);
      bus.emit('input:any');
      if (['Space', 'Tab', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => { this.keys.clear(); this.lmb = this.rmb = false; });
    window.addEventListener('mousedown', (e) => {
      bus.emit('input:any');
      if (!this.locked) return;
      if (e.button === 0) this.lmb = true;
      if (e.button === 2) this.rmb = true;
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.lmb = false;
      if (e.button === 2) this.rmb = false;
    });
    window.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.dx += e.movementX || 0;
      this.dy += e.movementY || 0;
    });
    window.addEventListener('wheel', (e) => {
      if (!this.locked) return;
      e.preventDefault();
      const f = e.deltaY < 0 ? 1.1 : 0.9;
      this.sensitivity = Math.min(4, Math.max(0.15, this.sensitivity * f));
      try { localStorage.setItem('hrp.sens', String(this.sensitivity)); } catch (_) { /* private mode */ }
      bus.emit('sens:change', this.sensitivity);
    }, { passive: false });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === document.body || !!document.pointerLockElement;
      this.lockPending = false;
      if (!this.locked) { this.keys.clear(); this.lmb = this.rmb = false; }
      bus.emit('pointerlock', this.locked);
    });
    document.addEventListener('pointerlockerror', () => {
      this.lockPending = false; this.locked = false;
      bus.emit('pointerlock:error');
    });
  }
  _tacSprint() { bus.emit('input:tacsprint'); }
  down(code) { return this.keys.has(code); }
  get forward() { return (this.down('KeyW') ? 1 : 0) - (this.down('KeyS') ? 1 : 0); }
  get strafe() { return (this.down('KeyD') ? 1 : 0) - (this.down('KeyA') ? 1 : 0); }
  consumeMouse() { const d = { x: this.dx, y: this.dy }; this.dx = 0; this.dy = 0; return d; }
  requestLock(el) {
    if (this.locked || this.lockPending) return;
    // NOTE: deliberately NOT requesting { unadjustedMovement: true } — on macOS
    // that disables the OS pointer response curve, and raw 1:1 counts read as
    // heavy/laggy mouse look. Native acceleration keeps flicks snappy (M1).
    try {
      const p = (el || document.body).requestPointerLock();
      if (p && p.catch) p.catch(() => { /* K3: pointerlockerror handler covers it */ });
      this.lockPending = true;
    } catch (_) {
      try { (el || document.body).requestPointerLock(); this.lockPending = true; }
      catch (__) { this.lockPending = false; bus.emit('pointerlock:error'); }
    }
  }
  exitLock() { if (document.pointerLockElement) document.exitPointerLock(); }
}
export const input = new Input();
