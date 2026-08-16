// K3: pointer lock from user gesture, handle pointerlockerror + Escape
// without breaking input state.
export class Input {
  constructor(dom) {
    this.dom = dom;
    this.keys = {};
    this.mouseDown = { 0: false, 1: false, 2: false };
    this.dx = 0; this.dy = 0;
    this.locked = false;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onLockChange = this._onLockChange.bind(this);
    this._onLockError = this._onLockError.bind(this);
    this._onContext = this._onContext.bind(this);
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('mouseup', this._onMouseUp);
    document.addEventListener('pointerlockchange', this._onLockChange);
    document.addEventListener('pointerlockerror', this._onLockError);
    dom.addEventListener('contextmenu', this._onContext);
    this._lastShiftT = 0;
    this._shiftTap = false;
  }

  requestLock() {
    if (this.locked) return;
    try { this.dom.requestPointerLock(); } catch (e) {}
  }
  exitLock() {
    if (this.locked) document.exitPointerLock?.();
  }

  _onContext(e) { e.preventDefault(); }
  _onLockChange() {
    this.locked = (document.pointerLockElement === this.dom);
  }
  _onLockError() { this.locked = false; }
  _onKeyDown(e) {
    if (e.repeat) return;
    this.keys[e.code] = true;
    // double-tap Shift detection (M2 tac-sprint)
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
      const now = performance.now();
      if (now - this._lastShiftT < 280) this.shiftDouble = true;
      this._lastShiftT = now;
    }
  }
  _onKeyUp(e) { this.keys[e.code] = false; }
  _onMouseMove(e) {
    if (!this.locked) return;
    this.dx += e.movementX;
    this.dy += e.movementY;
  }
  _onMouseDown(e) {
    this.mouseDown[e.button] = true;
  }
  _onMouseUp(e) { this.mouseDown[e.button] = false; }

  // consume accumulated mouse delta (call once per frame)
  readMouse() { const d = { x: this.dx, y: this.dy }; this.dx = 0; this.dy = 0; return d; }
  key(code) { return !!this.keys[code]; }
  consumeShiftDouble() { const v = this.shiftDouble; this.shiftDouble = false; return v; }

  dispose() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mousedown', this._onMouseDown);
    window.removeEventListener('mouseup', this._onMouseUp);
    document.removeEventListener('pointerlockchange', this._onLockChange);
    document.removeEventListener('pointerlockerror', this._onLockError);
    this.dom.removeEventListener('contextmenu', this._onContext);
  }
}
