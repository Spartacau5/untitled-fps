// Every binding the player can press, in the order the how-to-play screen
// lists them. `frame()` below reads the movement/action codes straight out of
// this table, so the controls screen can never drift from what the game
// actually does. `codes` are KeyboardEvent.code values; `mouse` entries are
// button indices. `caps` are the glyphs the UI draws on a key.
export const BINDINGS = [
  { id: "look", label: "LOOK / AIM", caps: ["MOUSE"], group: "move" },
  { id: "forward", label: "MOVE FORWARD", codes: ["KeyW"], group: "move" },
  { id: "back", label: "MOVE BACK", codes: ["KeyS"], group: "move" },
  { id: "left", label: "MOVE LEFT", codes: ["KeyA"], group: "move" },
  { id: "right", label: "MOVE RIGHT", codes: ["KeyD"], group: "move" },
  {
    id: "sprint",
    label: "SPRINT",
    codes: ["ShiftLeft", "ShiftRight"],
    caps: ["SHIFT"],
    group: "move",
  },
  { id: "jump", label: "JUMP", codes: ["Space"], caps: ["SPACE"], group: "move" },
  {
    id: "crouch",
    label: "CROUCH / SLIDE",
    hint: "slides when you crouch at a sprint",
    codes: ["KeyC", "ControlLeft"],
    caps: ["C", "CTRL"],
    group: "move",
  },
  { id: "fire", label: "FIRE", mouse: 0, caps: ["LMB"], group: "combat" },
  {
    id: "ads",
    label: "AIM DOWN SIGHTS",
    mouse: 2,
    caps: ["RMB"],
    group: "combat",
  },
  { id: "reload", label: "RELOAD", codes: ["KeyR"], group: "combat" },
  { id: "swapLast", label: "QUICK SWAP", codes: ["KeyQ"], group: "combat" },
  {
    id: "slots",
    label: "SELECT WEAPON",
    // One key per carried gun. frame(), the how-to-play screen and the HUD
    // pip row all size themselves off this list, so adding a ninth gun means
    // adding Digit9 here and nowhere else.
    codes: [
      "Digit1",
      "Digit2",
      "Digit3",
      "Digit4",
      "Digit5",
      "Digit6",
      "Digit7",
      "Digit8",
    ],
    caps: ["1", "2", "3", "4", "5", "6", "7", "8"],
    seq: true,
    group: "combat",
  },
  {
    id: "wheel",
    label: "CYCLE WEAPONS",
    caps: ["WHEEL"],
    group: "combat",
  },
  {
    id: "sensitivity",
    label: "SENSITIVITY",
    hint: "lower / raise",
    codes: ["BracketLeft", "BracketRight"],
    caps: ["[", "]"],
    seq: true,
    group: "system",
  },
  { id: "music", label: "TOGGLE MUSIC", codes: ["KeyM"], group: "system" },
  { id: "ambient", label: "TOGGLE AMBIENCE", codes: ["KeyN"], group: "system" },
  { id: "help", label: "HOW TO PLAY", codes: ["KeyH"], group: "system" },
  {
    id: "pause",
    label: "PAUSE",
    codes: ["Escape"],
    caps: ["ESC"],
    group: "system",
  },
];

const BIND = {};
for (const b of BINDINGS) BIND[b.id] = b.codes || [];

// Weapon slot count is whatever the slot binding exposes, so adding a third
// slot back is a one-line change in the table above.
export const WEAPON_SLOT_CODES = BIND.slots;

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
        const typing =
          e.target &&
          (e.target.tagName === "INPUT" ||
            e.target.tagName === "TEXTAREA" ||
            e.target.isContentEditable);
        if (typing) return;
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
    const any = (codes, set) => codes.some((c) => set.has(c)),
      k = (id) => any(BIND[id], this.keys),
      jp = (id) => any(BIND[id], this.pressed);
    let switchTo = -1;
    for (let i = 0; i < WEAPON_SLOT_CODES.length; i++)
      if (this.pressed.has(WEAPON_SLOT_CODES[i])) {
        switchTo = i;
        break;
      }
    return {
      move: {
        x: (k("right") ? 1 : 0) - (k("left") ? 1 : 0),
        y: (k("forward") ? 1 : 0) - (k("back") ? 1 : 0),
      },
      fire: this.mousePressed[0],
      fireHeld: this.mouseDown[0],
      ads: this.mouseDown[2],
      reload: jp("reload"),
      sprint: k("sprint"),
      jump: jp("jump"),
      crouch: k("crouch"),
      crouchPressed: jp("crouch"),
      switchTo,
      swapLast: jp("swapLast"),
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
