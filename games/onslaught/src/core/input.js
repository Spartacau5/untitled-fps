export class Input {
  constructor(t) {
    ((this.canvas = t),
      (this.keys = new Set()),
      (this.pressed = new Set()),
      (this.mouseDown = [!1, !1, !1]),
      (this.mousePressed = [!1, !1, !1]),
      // Mouse motion accumulated per render frame (look + viewmodel sway).
      (this.dx = 0),
      (this.dy = 0),
      (this.wheel = 0),
      (this.locked = !1),
      (this.sensitivity = 1),
      (this.onLockChange = null),
      (this.onKeyDown = null),
      window.addEventListener("keydown", (e) => {
        e.repeat ||
          (this.keys.add(e.code),
          this.pressed.add(e.code),
          this.onKeyDown && this.onKeyDown(e.code),
          [
            "Space",
            "Tab",
            "KeyW",
            "KeyA",
            "KeyS",
            "KeyD",
            "ShiftLeft",
          ].includes(e.code) && e.preventDefault());
      }),
      window.addEventListener("keyup", (e) => this.keys.delete(e.code)),
      window.addEventListener("blur", () => {
        (this.keys.clear(), (this.mouseDown = [!1, !1, !1]));
      }),
      t.addEventListener("mousedown", (e) => {
        this.locked &&
          ((this.mouseDown[e.button] = !0),
          (this.mousePressed[e.button] = !0),
          e.preventDefault());
      }),
      window.addEventListener("mouseup", (e) => {
        this.mouseDown[e.button] = !1;
      }),
      window.addEventListener("contextmenu", (e) => e.preventDefault()),
      window.addEventListener("mousemove", (e) => {
        this.locked && ((this.dx += e.movementX), (this.dy += e.movementY));
      }),
      window.addEventListener(
        "wheel",
        (e) => {
          this.locked && (this.wheel += Math.sign(e.deltaY));
        },
        { passive: !0 },
      ),
      document.addEventListener("pointerlockchange", () => {
        ((this.locked = document.pointerLockElement === t),
          this.locked || (this.keys.clear(), (this.mouseDown = [!1, !1, !1])),
          this.onLockChange && this.onLockChange(this.locked));
      }),
      document.addEventListener("pointerlockerror", () => {
        this.onLockChange && this.onLockChange(!1);
      }));
  }
  lock() {
    try {
      const t = this.canvas.requestPointerLock({ unadjustedMovement: !0 });
      t &&
        t.catch &&
        t.catch(() => {
          try {
            this.canvas.requestPointerLock();
          } catch {}
        });
    } catch {
      try {
        this.canvas.requestPointerLock();
      } catch {}
    }
  }
  unlock() {
    document.pointerLockElement && document.exitPointerLock();
  }
  key(t) {
    return this.keys.has(t);
  }
  justPressed(t) {
    return this.pressed.has(t);
  }
  // Snapshot of the current input as the sim sees it. This is the only shape
  // the simulation reads, so a headless run (or a network peer) can feed the
  // same object without a DOM.
  frame() {
    const k = (c) => this.keys.has(c),
      jp = (c) => this.pressed.has(c);
    return {
      move: {
        x: (k("KeyD") ? 1 : 0) - (k("KeyA") ? 1 : 0),
        y: (k("KeyW") ? 1 : 0) - (k("KeyS") ? 1 : 0),
      },
      fire: this.mousePressed[0],
      fireHeld: this.mouseDown[0],
      ads: this.mouseDown[2],
      reload: jp("KeyR"),
      sprint: k("ShiftLeft") || k("ShiftRight"),
      jump: jp("Space"),
      crouch: k("KeyC") || k("ControlLeft"),
      crouchPressed: jp("KeyC") || jp("ControlLeft"),
      switchTo: jp("Digit1") ? 0 : jp("Digit2") ? 1 : jp("Digit3") ? 2 : -1,
      swapLast: jp("KeyQ"),
      wheel: this.wheel,
    };
  }
  // Edge-triggered input is consumed by the sim, so it is cleared per tick.
  endTick() {
    (this.pressed.clear(), (this.mousePressed = [!1, !1, !1]), (this.wheel = 0));
  }
  // Look deltas are consumed per render frame.
  endFrame() {
    ((this.dx = 0), (this.dy = 0));
  }
}
