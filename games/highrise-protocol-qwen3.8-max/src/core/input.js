// ---------------------------------------------------------------------------
// core/input.js — pointer lock, keys, and the mouse-delta buffer (K3, K5).
// Raw mouse deltas ACCUMULATE between frames and are consumed at the fixed
// step, so look-lag behaves identically at 60 / 144 / 240 Hz.
// ---------------------------------------------------------------------------

const TUNING = {
  MAX_BUFFER: 400, // px, safety valve against event storms
};

export class Input {
  constructor() {
    this.keys = new Set();
    this._pressed = new Set();
    this._accX = 0; this._accY = 0;       // accumulated raw delta this frame
    this._perX = 0; this._perY = 0;       // per-fixed-step share
    this._steps = 1;
    this._stepNow = 0; this._cachedStep = -1;
    this.fireHeld = false;
    this.adsHeld = false;
    this.locked = false;
    this.started = false;                 // pointer has been locked at least once
    this.dead = false;
    this._gestureCbs = [];
    this._lockCbs = [];
    this._listeners = [];
    this.gestureDone = false;
  }

  _on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    this._listeners.push([target, type, fn, opts]);
  }

  trackListenerCount() { return this._listeners.length; }

  attach(canvas) {
    this.canvas = canvas;
    this._on(window, 'keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code); this._pressed.add(e.code);
      this._gesture();
      if (['Space', 'ControlLeft', 'ControlRight', 'Tab'].includes(e.code)) e.preventDefault();
    });
    this._on(window, 'keyup', (e) => this.keys.delete(e.code));
    this._on(window, 'mousedown', (e) => {
      this._gesture();
      if (!this.locked) return;
      if (e.button === 0) this.fireHeld = true;
      if (e.button === 2) this.adsHeld = true;
    });
    this._on(window, 'mouseup', (e) => {
      if (e.button === 0) this.fireHeld = false;
      if (e.button === 2) this.adsHeld = false;
    });
    this._on(window, 'mousemove', (e) => {
      if (!this.locked) return;
      this._accX = Math.max(-TUNING.MAX_BUFFER, Math.min(TUNING.MAX_BUFFER, this._accX + e.movementX));
      this._accY = Math.max(-TUNING.MAX_BUFFER, Math.min(TUNING.MAX_BUFFER, this._accY + e.movementY));
    });
    this._on(window, 'contextmenu', (e) => e.preventDefault());
    this._on(window, 'blur', () => { this.keys.clear(); this.fireHeld = false; this.adsHeld = false; });

    this._on(document, 'pointerlockchange', () => {
      this.locked = document.pointerLockElement === canvas;
      if (this.locked) this.started = true;
      if (!this.locked) { this.fireHeld = false; this.adsHeld = false; }
      for (const cb of this._lockCbs) cb(this.locked);
    });
    this._on(document, 'pointerlockerror', () => {
      // K3: never break input state — surface a retriable pause overlay.
      this.locked = false;
      for (const cb of this._lockCbs) cb(false);
    });
  }

  _gesture() {
    if (this.gestureDone) return;
    this.gestureDone = true;
    for (const cb of this._gestureCbs) cb();
  }

  onGesture(cb) { this._gestureCbs.push(cb); }
  onLock(cb) { this._lockCbs.push(cb); }

  requestLock() {
    try {
      const p = this.canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => {}); // some browsers reject silently
    } catch { /* retriable via pause overlay */ }
  }

  down(code) { return this.keys.has(code); }
  // Edge-triggered consume: true exactly once per physical press.
  consume(code) {
    if (this._pressed.has(code)) { this._pressed.delete(code); return true; }
    return false;
  }

  // Loop calls this before running N fixed steps for the frame (K5).
  beginSteps(n) {
    this._steps = Math.max(1, n);
    this._perX = this._accX / this._steps;
    this._perY = this._accY / this._steps;
    this._accX = 0; this._accY = 0;
  }

  nextStep() { this._stepNow++; }

  // Same delta object for every consumer within one fixed step.
  mousePerStep() {
    if (this._cachedStep !== this._stepNow) {
      this._cachedStep = this._stepNow;
      this._mdx = this._perX; this._mdy = this._perY;
    }
    return { dx: this._mdx, dy: this._mdy };
  }
}
