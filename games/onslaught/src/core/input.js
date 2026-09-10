import { Gamepads, SPRINT_DROP, TURN_RATE } from "./gamepad.js";

// Frames a pad stays 'the input in use' after the last thing it did. Long
// enough to cover a pause and a look round the menu, short enough that
// putting the pad down and reaching for the mouse hands control straight
// back.
const PAD_RECENT = 180;

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
  {
    id: "jump",
    label: "JUMP",
    codes: ["Space"],
    caps: ["SPACE"],
    group: "move",
  },
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

// Controller support rides inside the keyboard backend rather than being a
// fourth one. A player switches between a pad and a mouse mid-session without
// telling anyone, so both feed the same snapshot and whichever they touched
// last is simply the one that moved it. The sim never learns a pad exists.
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
      (this.pad = new Gamepads()),
      // Pad look is a rate, so it is scaled separately from the mouse and
      // gets its own setting; a number tuned for a mouse means nothing on a
      // stick. Set by the Game from Settings.
      (this.padSensitivity = 1),
      // Aiming is a different job from looking around - one is tracking, the
      // other is placing a crosshair - so they get their own numbers rather
      // than one scaled by the zoom. Blended by how far into the sight the
      // player is, so the change is not a step when the gun comes up.
      (this.padAdsSensitivity = 1),
      (this.adsAmount = 0),
      // Sprint is a toggle. See pollPad for what puts it out.
      (this.padSprint = !1),
      (this.padRecent = 0),
      // Set on the Options/Start edge, consumed by the Game.
      (this.padPause = !1),
      // Aim slowdown, written by the Game each frame: 1 is free look, less
      // than 1 means the crosshair is over something. Pad only - a mouse
      // player has not asked for their aim to be touched.
      (this.aimAssist = 1),
      (this.padHeld = null),
      (this.padSlot = -1),
      // null until the first lock resolves; false means the OS pointer
      // acceleration curve is sitting between the mouse and the aim.
      (this.rawInput = null),
      (this.onRawInput = null),
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
  // Pointer lock, asking for unadjusted (raw) movement so the OS acceleration
  // curve does not shape the aim. Chromium honours the option; engines that do
  // not simply ignore it. The outcome is recorded rather than assumed: without
  // raw input two players on the same sensitivity get materially different aim,
  // and nothing anywhere would say so.
  lock() {
    const el = this.canvas;
    let req;
    try {
      req = el.requestPointerLock({ unadjustedMovement: !0 });
    } catch {
      // Engines predating the options form can throw on the argument itself.
      (this._setRaw(!1), this._plainLock());
      return;
    }
    if (req && typeof req.then === "function") {
      req.then(
        () => this._setRaw(!0),
        () => {
          // Raw movement refused, so no lock happened. Ask again plainly.
          (this._setRaw(!1), this._plainLock());
        },
      );
      return;
    }
    // Returned nothing: the options bag was ignored, so the lock is already
    // under way with acceleration applied. Re-requesting would double up.
    this._setRaw(!1);
  }
  _plainLock() {
    try {
      this.canvas.requestPointerLock();
    } catch {}
  }
  _setRaw(v) {
    if (this.rawInput === v) return;
    ((this.rawInput = v), this.onRawInput && this.onRawInput(v));
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
  // Read the pad once per render frame and fold it into the same state the
  // keyboard and mouse write to. Called with the frame's delta because a stick
  // is a rate and a mouse is a distance: holding the stick right for twice as
  // long has to turn you twice as far, which a raw axis value cannot say.
  //
  // Edge buttons land in `pressed`, the same set the keyboard uses, so they
  // are consumed by exactly one simulation tick and survive a render frame
  // that happens to run none.
  pollPad(frameDt) {
    const pad = this.pad;
    if (!pad) return !1;
    const s = pad.poll();
    // Note the Game polls this every frame, not only while playing: the
    // button that pauses has to be able to unpause, and nothing runs during
    // a pause otherwise.
    if (!pad.connected) {
      ((this.padHeld = null), (this.padSprint = !1), (this.padRecent = 0));
      return !1;
    }
    this.padRecent = pad.active ? PAD_RECENT : Math.max(0, this.padRecent - 1);
    pad.edge("pause") && (this.padPause = !0);
    // Sprint toggles on L3 and drops itself the moment it stops making
    // sense: shooting, aiming, or easing off the stick. Deliberately NOT on
    // jump or crouch - those are the sprint-jump-slide chain, and cancelling
    // there would mean re-clicking L3 in the middle of the one movement
    // sequence the toggle exists to make comfortable.
    (pad.edge("sprint") && (this.padSprint = !this.padSprint),
      (s.fire || s.ads || s.move.y < SPRINT_DROP) && (this.padSprint = !1));
    // Convert stick deflection to the mouse-delta units applyLook expects.
    // It multiplies dx by 0.0021 * sensitivity, so dividing that back out
    // leaves TURN_RATE meaning what it says: degrees per second at full tilt.
    // Hipfire and aimed sensitivity are separate settings, mixed by how far
    // the sight is up. applyLook already narrows the look with the zoom; this
    // is the player's say over that, not a replacement for it.
    const a = Math.max(0, Math.min(1, this.adsAmount || 0));
    const sens =
      this.padSensitivity + (this.padAdsSensitivity - this.padSensitivity) * a;
    const deg = TURN_RATE * sens * this.aimAssist * frameDt;
    const perUnit = (deg * Math.PI) / 180 / (0.0021 * (this.sensitivity || 1));
    ((this.dx += s.look.x * perUnit), (this.dy += s.look.y * perUnit));
    // Level buttons: held straight through, since `keys` is read the same way.
    ((this.padHeld = s),
      pad.edge("jump") && this.pressed.add("Pad:jump"),
      pad.edge("reload") && this.pressed.add("Pad:reload"),
      pad.edge("crouch") && this.pressed.add("Pad:crouch"),
      pad.edge("cycleGun") && (this.wheel += 1),
      pad.edge("fire") && (this.mousePressed[0] = !0),
      pad.edge("prevGun") && (this.wheel -= 1),
      pad.edge("nextGun") && (this.wheel += 1));
    const slot = pad.slotEdge();
    if (slot >= 0) this.padSlot = slot;
    return pad.active;
  }
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
    // The pad is folded in here rather than replacing anything, so a player
    // can steer with a stick and still hit R to reload. Movement takes
    // whichever input is pushing harder, so a stick at rest never cancels the
    // keys and a key held never pins the stick to 1.
    const p = this.padHeld;
    const kx = (k("right") ? 1 : 0) - (k("left") ? 1 : 0),
      ky = (k("forward") ? 1 : 0) - (k("back") ? 1 : 0);
    const move =
      p && Math.hypot(p.move.x, p.move.y) > Math.hypot(kx, ky)
        ? { x: p.move.x, y: p.move.y }
        : { x: kx, y: ky };
    if (this.padSlot >= 0 && switchTo < 0) switchTo = this.padSlot;
    return {
      move,
      fire: this.mousePressed[0],
      fireHeld: this.mouseDown[0] || !!(p && p.fire),
      ads: this.mouseDown[2] || !!(p && p.ads),
      reload: jp("reload") || this.pressed.has("Pad:reload"),
      sprint: k("sprint") || (!!p && this.padSprint),
      jump: jp("jump") || this.pressed.has("Pad:jump"),
      crouch: k("crouch") || !!(p && p.crouch),
      crouchPressed: jp("crouch") || this.pressed.has("Pad:crouch"),
      switchTo,
      swapLast: jp("swapLast"),
      wheel: this.wheel,
    };
  }
  // Edge-triggered input is consumed by the sim, so it is cleared per tick.
  // Is a controller the thing the player is actually holding? Used where
  // the answer changes behaviour rather than just a glyph - losing the
  // pointer lock means nothing to someone on a pad, for instance.
  usingPad() {
    return this.padRecent > 0;
  }
  endTick() {
    (this.pressed.clear(),
      (this.mousePressed = [!1, !1, !1]),
      (this.padSlot = -1),
      (this.wheel = 0));
  }
  // Look deltas are consumed per render frame.
  endFrame() {
    ((this.dx = 0), (this.dy = 0));
  }
}
