// Gamepad reading, mapping and feel.
//
// Browsers normalise Xbox, DualShock 4 and DualSense to the W3C "standard
// mapping": a fixed button and axis layout, which is why one table below
// covers all three. A pad that reports something else still works - the same
// indices are what almost every controller sends anyway - it just has not
// promised to.
//
// Everything here is a pure function of a gamepad snapshot except the class at
// the foot of the file, so the deadzone and the response curve can be tested
// without hardware and without a browser.

// Standard mapping. The bottom face button is index 0 on every pad, which is
// why "A on Xbox, Cross on PlayStation" is one number and not a branch.
export const PAD = {
  CROSS: 0, // A / Cross      - jump
  CIRCLE: 1, // B / Circle     - back / cancel
  SQUARE: 2, // X / Square     - reload
  TRIANGLE: 3, // Y / Triangle   - cycle to the next gun
  L1: 4,
  R1: 5,
  L2: 6, // analog          - aim down sight
  R2: 7, // analog          - fire
  SHARE: 8,
  OPTIONS: 9,
  L3: 10, // stick click     - sprint (hold)
  R3: 11, // stick click     - crouch
  DPAD_UP: 12,
  DPAD_DOWN: 13,
  DPAD_LEFT: 14,
  DPAD_RIGHT: 15,
};
export const AXIS = { LX: 0, LY: 1, RX: 2, RY: 3 };

// A trigger is analog. This is where it counts as pressed - low enough that a
// light pull fires, high enough that the slack at rest never does.
export const TRIGGER_POINT = 0.35;

// Sticks rest slightly off centre and worn ones rest a long way off. Radial,
// not per-axis: a square deadzone lets a stick pushed diagonally register
// while the same deflection straight up does not, which reads as the stick
// catching on the diagonals.
export const DEADZONE = 0.14;

// Degrees per second at full deflection, before the player's sensitivity
// setting. Slow enough to hold an aim, fast enough to spin on a flanker.
export const TURN_RATE = 210;

// Toggled sprint drops when the left stick stops asking to go forward. Set
// below a light push so easing off does not cancel it, but above nothing, so
// letting go entirely does.
export const SPRINT_DROP = 0.4;

// How far a stick has to lean before it counts as a menu direction. Higher
// than the look deadzone: a nudge that should only aim must not also step
// through a list.
export const NAV_POINT = 0.55;

// Stick response. Linear sticks make fine aim impossible because the first
// millimetre of travel is already a third of your turn rate; a cubic-ish
// curve spends most of the throw on small corrections and saves the top end
// for whipping round. 2.4 is between COD's and Apex's defaults.
export const CURVE = 2.4;

// Clamp a stick to its live range: nothing inside the deadzone, and the
// remainder rescaled so the first live millimetre starts from zero rather
// than jumping to the deadzone value.
export function applyDeadzone(x, y, dead = DEADZONE) {
  const mag = Math.hypot(x, y);
  if (mag <= dead) return { x: 0, y: 0, mag: 0 };
  const live = Math.min(1, (mag - dead) / (1 - dead));
  return { x: (x / mag) * live, y: (y / mag) * live, mag: live };
}

// Shape a deadzoned stick for looking. Magnitude is curved; direction is not,
// so a diagonal stays a diagonal.
export function lookCurve(x, y, curve = CURVE) {
  const mag = Math.hypot(x, y);
  if (mag <= 0) return { x: 0, y: 0 };
  const shaped = Math.pow(mag, curve);
  return { x: (x / mag) * shaped, y: (y / mag) * shaped };
}

const pressed = (b) => !!b && (typeof b === "object" ? b.pressed : b > 0.5);
const value = (b) => (!b ? 0 : typeof b === "object" ? b.value : b);

// One gamepad, read into the shape the rest of the game speaks. Buttons come
// back as plain booleans; the two triggers also carry their analog value, in
// case a later pass wants a pull-to-walk or a variable-tension trigger.
export function readPad(gp, { deadzone = DEADZONE } = {}) {
  const b = gp.buttons || [],
    a = gp.axes || [];
  const ax = (i) => (typeof a[i] === "number" ? a[i] : 0);
  const move = applyDeadzone(ax(AXIS.LX), ax(AXIS.LY), deadzone);
  const rawLook = applyDeadzone(ax(AXIS.RX), ax(AXIS.RY), deadzone);
  const look = lookCurve(rawLook.x, rawLook.y);
  const l2 = value(b[PAD.L2]),
    r2 = value(b[PAD.R2]);
  return {
    // Forward is +y for the game and -y on a stick, so this flips once here
    // rather than at every call site.
    move: { x: move.x, y: -move.y },
    look,
    l2,
    r2,
    ads: l2 >= TRIGGER_POINT || pressed(b[PAD.L2]),
    fire: r2 >= TRIGGER_POINT || pressed(b[PAD.R2]),
    sprint: pressed(b[PAD.L3]),
    crouch: pressed(b[PAD.R3]),
    jump: pressed(b[PAD.CROSS]),
    reload: pressed(b[PAD.SQUARE]),
    // Cycles forward through the carried guns, wrapping at the end.
    cycleGun: pressed(b[PAD.TRIANGLE]),
    // Confirm and cancel. Cross/A and Circle/B are the same two indices on
    // both families, and the same two roles in almost every console menu.
    confirm: pressed(b[PAD.CROSS]),
    back: pressed(b[PAD.CIRCLE]),
    // Options on PlayStation, Menu on Xbox - the same index on both.
    pause: pressed(b[PAD.OPTIONS]),
    // Menu movement. The d-pad and the left stick both drive it, so a
    // player can use whichever is already under their thumb.
    navX:
      (pressed(b[PAD.DPAD_RIGHT]) ? 1 : 0) -
      (pressed(b[PAD.DPAD_LEFT]) ? 1 : 0) +
      (Math.abs(move.x) > NAV_POINT ? Math.sign(move.x) : 0),
    navY:
      (pressed(b[PAD.DPAD_DOWN]) ? 1 : 0) -
      (pressed(b[PAD.DPAD_UP]) ? 1 : 0) +
      (Math.abs(move.y) > NAV_POINT ? Math.sign(move.y) : 0),
    prevGun: pressed(b[PAD.L1]),
    nextGun: pressed(b[PAD.R1]),
    slots: [
      pressed(b[PAD.DPAD_LEFT]),
      pressed(b[PAD.DPAD_UP]),
      pressed(b[PAD.DPAD_RIGHT]),
    ],
  };
}

// Is anything on this pad being touched? Used to decide whether a controller
// is the thing the player is currently holding, so prompts can follow them
// between pad and keyboard without a setting.
export function padActive(s) {
  return (
    // navX/navY first: the d-pad is how someone drives a menu, and DOWN in
    // particular belongs to no other field here - without it, pressing down on
    // a fresh menu did not count as touching the pad, so the navigation that
    // reads this flag gated itself off and the first press did nothing.
    !!s.navX ||
    !!s.navY ||
    Math.hypot(s.move.x, s.move.y) > 0 ||
    Math.hypot(s.look.x, s.look.y) > 0 ||
    s.ads ||
    s.fire ||
    s.sprint ||
    s.crouch ||
    s.jump ||
    s.reload ||
    s.cycleGun ||
    s.confirm ||
    s.back ||
    s.pause ||
    s.prevGun ||
    s.nextGun ||
    s.slots.some(Boolean)
  );
}

const EMPTY = {
  move: { x: 0, y: 0 },
  look: { x: 0, y: 0 },
  l2: 0,
  r2: 0,
  ads: !1,
  fire: !1,
  sprint: !1,
  crouch: !1,
  jump: !1,
  reload: !1,
  cycleGun: !1,
  confirm: !1,
  back: !1,
  pause: !1,
  navX: 0,
  navY: 0,
  prevGun: !1,
  nextGun: !1,
  slots: [!1, !1, !1],
};

// Live pad state with edge detection. Buttons arrive as levels, and the sim
// wants edges for jump, reload and crouch, so those are diffed here against
// the previous poll.
export class Gamepads {
  constructor(nav = typeof navigator === "undefined" ? null : navigator) {
    ((this.nav = nav),
      (this.state = { ...EMPTY }),
      (this.prev = { ...EMPTY }),
      // Which pad we are listening to. The first one with anything pressed
      // wins and keeps winning until it disconnects, so a second controller
      // sitting on a desk cannot fight the one in someone's hands.
      (this.index = -1),
      (this.connected = !1),
      (this.active = !1),
      (this.deadzone = DEADZONE));
  }
  _pads() {
    if (!this.nav || !this.nav.getGamepads) return [];
    try {
      return this.nav.getGamepads() || [];
    } catch {
      // Some browsers throw here when the page is not focused.
      return [];
    }
  }
  // Read every connected pad once. Returns the merged snapshot.
  poll() {
    const pads = this._pads();
    let chosen = null;
    // Stay on the pad we were already using if it is still there.
    if (this.index >= 0 && pads[this.index]) chosen = pads[this.index];
    for (let i = 0; i < pads.length && !chosen; i++) {
      const gp = pads[i];
      if (!gp || !gp.connected) continue;
      const s = readPad(gp, { deadzone: this.deadzone });
      if (padActive(s)) ((chosen = gp), (this.index = i));
    }
    // Nothing in hand yet: still report the first connected pad so the UI can
    // say a controller is plugged in before anyone touches it.
    if (!chosen)
      for (let i = 0; i < pads.length && !chosen; i++)
        if (pads[i] && pads[i].connected)
          ((chosen = pads[i]), (this.index = i));
    this.prev = this.state;
    this.state = chosen
      ? readPad(chosen, { deadzone: this.deadzone })
      : { ...EMPTY };
    ((this.connected = !!chosen),
      (this.active = this.connected && padActive(this.state)));
    if (!chosen) this.index = -1;
    return this.state;
  }
  // True on the poll a button goes down, and not again until it comes back up.
  edge(name) {
    return !!this.state[name] && !this.prev[name];
  }
  slotEdge() {
    for (let i = 0; i < this.state.slots.length; i++)
      if (this.state.slots[i] && !this.prev.slots[i]) return i;
    return -1;
  }
}
