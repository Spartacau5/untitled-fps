function buttonMask(button) {
  // PointerEvent.buttons follows the DOM bit layout: left=1, right=2, middle=4.
  if (button === 0) return 1;
  if (button === 2) return 2;
  if (button === 1) return 4;
  return 1 << button;
}

export class Input {
  constructor(domElement) {
    this.domElement = domElement;
    this.keys = new Set();
    this.mouse = { dx: 0, dy: 0 };
    this.frameMouse = { dx: 0, dy: 0 };
    this.buttons = new Set();
    this.pointerButtons = 0;
    this.pointerInputSeen = false;
    this.fallbackAds = false;
    this.blockFireUntilRelease = false;
    this.justPressedButtons = new Set();
    this.justPressed = new Set();
    this.pointerLocked = false;
    this.pointerLockFailed = false;
    this.pointerLockTimer = 0;
    this.lastPointer = { x: 0, y: 0 };
    this.firstInput = false;
    this.listeners = [];
    this.onFirstInput = null;
    this.onMouseUp = null;
    this.onPointerLockChange = null;
    this.bind();
  }

  bind() {
    const on = (target, type, handler, options) => {
      target.addEventListener(type, handler, options);
      this.listeners.push(() => target.removeEventListener(type, handler, options));
    };
    on(window, "keydown", (event) => {
      if (!this.keys.has(event.code)) this.justPressed.add(event.code);
      this.keys.add(event.code);
      this.markInput();
      if (["Space", "Tab"].includes(event.code)) event.preventDefault();
    });
    on(window, "keyup", (event) => this.keys.delete(event.code));
    on(window, "mousedown", (event) => {
      this.buttons.add(event.button);
      if (event.button === 2) {
        if (this.pointerLockFailed) this.fallbackAds = true;
      }
      this.justPressedButtons.add(event.button);
      this.lastPointer.x = event.clientX;
      this.lastPointer.y = event.clientY;
      this.markInput();
      if (document.pointerLockElement !== this.domElement) {
        const request = this.domElement.requestPointerLock?.();
        request?.catch?.(() => { this.pointerLockFailed = true; });
        clearTimeout(this.pointerLockTimer);
        this.pointerLockTimer = setTimeout(() => {
          if (!this.pointerLocked) {
            this.pointerLockFailed = true;
            if (this.buttons.has(2) || (this.pointerButtons & buttonMask(2))) this.fallbackAds = true;
          }
        }, 250);
      }
    });
    on(window, "mouseup", (event) => {
      this.buttons.delete(event.button);
      if (event.button === 0) {
        this.blockFireUntilRelease = false;
        this.justPressedButtons.delete(0);
      }
      this.onMouseUp?.(event.button);
      if (event.button === 2 && this.pointerLockFailed) this.fallbackAds = false;
    });
    on(window, "pointerdown", (event) => {
      this.pointerInputSeen = true;
      this.pointerButtons = Number.isFinite(event.buttons) && event.buttons > 0
        ? event.buttons
        : buttonMask(event.button);
      // Keep a per-button latch as the authoritative state.  Some browsers
      // report a partial `event.buttons` mask while another mouse button is
      // already down; using that mask directly turns LMB+RMB into a one-shot
      // trigger.  Pointer down/up events are stable for every button.
      this.buttons.add(event.button);
      if (event.button === 2 && this.pointerLockFailed) this.fallbackAds = true;
      if (this.domElement.setPointerCapture && event.pointerId !== undefined) {
        try { this.domElement.setPointerCapture(event.pointerId); } catch {}
      }
    });
    on(window, "pointerup", (event) => {
      this.pointerInputSeen = true;
      // `buttons === 0` is the authoritative release state. The old `||`
      // fallback kept bit 0 set forever when a left-button pointerup arrived.
      this.pointerButtons = Number.isFinite(event.buttons)
        ? event.buttons
        : (this.pointerButtons & ~buttonMask(event.button));
      this.buttons.delete(event.button);
      if (event.button === 0) {
        this.blockFireUntilRelease = false;
        this.justPressedButtons.delete(0);
      }
      this.onMouseUp?.(event.button);
      if (event.button === 2) {
        if (this.pointerLockFailed) this.fallbackAds = false;
      }
    });
    on(window, "pointercancel", () => {
      this.pointerInputSeen = true;
      this.releasePointerState(true);
    });
    on(window, "contextmenu", (event) => {
      event.preventDefault();
      if (!this.pointerLocked && this.pointerLockFailed) this.releasePointerState(true);
    });
    on(window, "mousemove", (event) => {
      if (document.pointerLockElement === this.domElement || this.pointerLockFailed) {
        const dx = event.movementX || event.clientX - this.lastPointer.x;
        const dy = event.movementY || event.clientY - this.lastPointer.y;
        this.mouse.dx += dx;
        this.mouse.dy += dy;
      }
      this.lastPointer.x = event.clientX;
      this.lastPointer.y = event.clientY;
    });
    on(document, "pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === this.domElement;
      if (this.pointerLocked) {
        clearTimeout(this.pointerLockTimer);
        this.pointerLockFailed = false;
        this.fallbackAds = false;
      } else {
        // Escape, tab switching and browser pointer-lock failures can skip a
        // mouseup. Never let a stale physical button keep the rifle firing.
        this.releasePointerState(true);
      }
      this.onPointerLockChange?.(this.pointerLocked);
    });
    on(document, "pointerlockerror", () => {
      clearTimeout(this.pointerLockTimer);
      this.pointerLocked = false;
      this.pointerLockFailed = true;
      if (this.buttons.has(2) || (this.pointerButtons & buttonMask(2))) this.fallbackAds = true;
    });
    on(window, "mouseleave", () => {
      if (!this.pointerLocked) this.releasePointerState(true);
    });
    on(window, "blur", () => {
      this.keys.clear();
      this.releasePointerState(true);
      this.fallbackAds = false;
    });
  }

  releasePointerState(clearPress = false) {
    this.buttons.clear();
    this.pointerButtons = 0;
    this.fallbackAds = false;
    this.blockFireUntilRelease = false;
    if (clearPress) this.justPressedButtons.clear();
    if (clearPress) this.onMouseUp?.(0);
  }

  markInput() {
    if (!this.firstInput) {
      if (this.buttons.has(0)) this.blockFireUntilRelease = true;
      this.firstInput = true;
      this.onFirstInput?.();
    }
  }

  held(code) { return this.keys.has(code); }
  pressed(code) { return this.justPressed.has(code); }
  mouseHeld(button) {
    if (button === 0 && this.blockFireUntilRelease) return false;
    if (button === 2 && this.pointerLockFailed) {
      return this.buttons.has(2) || this.fallbackAds;
    }
    return this.buttons.has(button);
  }
  mousePressed(button) {
    if (button === 0 && this.blockFireUntilRelease) return false;
    // A release can arrive between fixed steps. Do not let the one-frame
    // press latch create a delayed round after the physical button is up.
    return this.buttons.has(button) && this.justPressedButtons.has(button);
  }
  consumeMouse() {
    this.frameMouse.dx = this.mouse.dx;
    this.frameMouse.dy = this.mouse.dy;
    this.mouse.dx = 0;
    this.mouse.dy = 0;
    return this.frameMouse;
  }
  endFixedStep() {
    this.justPressed.clear();
    this.justPressedButtons.clear();
  }
  dispose() { clearTimeout(this.pointerLockTimer); this.listeners.splice(0).forEach((remove) => remove()); }
}
