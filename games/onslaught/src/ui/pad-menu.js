// Driving the menus from a controller.
//
// The convention here is the one every console has used for twenty years, so
// nobody has to learn it: d-pad or left stick moves, Cross/A confirms,
// Circle/B goes back, left and right work a slider. Options pauses, which the
// Game already owns.
//
// Focus is the DOM's own focus, not a parallel selection model: it is what
// makes click(), tab order and screen readers agree with the stick, and it
// means a mouse and a pad cannot disagree about what is selected.
//
// It is NOT, however, what the player sees. :focus-visible turned out to be
// unusable as the highlight - see `_focus` - so the pad stamps its own class
// and the stylesheet lights that instead.
//
// Direction is spatial, not document order - see `_seek`.

import { NAV_ENTER, NAV_EXIT } from "../core/gamepad.js";

// Held direction repeats like a key: a pause, then a steady rate. The rate
// started at 0.11 s, which is nine items a second - fast enough to overshoot
// anything in a list of eleven. About five and a half is what a console menu
// actually feels like.
const REPEAT_DELAY = 0.45;
const REPEAT_RATE = 0.18;

// How far ahead the other axis has to be before a held diagonal changes lane.
const LANE_MARGIN = 1.4;

// The class the stylesheet lights up. Not :focus-visible; see `_focus`.
const FOCUS_CLASS = "pad-focus";

// Scoring for spatial movement, in pixels.
//
// A sideways drift costs twice what a step in the pushed direction does, so a
// candidate has to be half as far off-axis as it is away in order to win -
// which is what keeps the loadout grid reading as a grid.
const CROSS_COST = 2;
// Something that shares no extent with you across the pushed axis is a worse
// answer than something that does, whatever the raw distance says. Without
// this, "down" inside the left column jumps to a nearer button in the panel
// next door.
const NO_OVERLAP_COST = 4000;
// Boxes that merely touch are still a step apart, so the gate sits a pixel
// below zero rather than at it.
const MIN_STEP = 1;

// Anything a player can operate. Order is DOM order, which is reading order,
// which is the order the eye expects to travel in.
const FOCUSABLE =
  'button:not([disabled]), input[type="range"], input[type="text"], textarea, [tabindex]:not([tabindex="-1"])';

const visible = (el) =>
  !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

export class PadMenu {
  constructor(doc = typeof document === "undefined" ? null : document) {
    ((this.doc = doc),
      (this.holdX = 0),
      (this.holdY = 0),
      (this.wait = 0),
      // Which way the stick is currently latched, held across frames so it
      // can be released on a different threshold than it was caught on.
      (this.stickX = 0),
      (this.stickY = 0),
      (this.lane = null),
      // The element currently carrying FOCUS_CLASS, so it can be put out
      // again when focus moves on.
      (this.lit = null));
  }
  // The left stick as a menu direction, debounced against its own wobble.
  //
  // Two rules, both about not firing when the player did not ask. A firm
  // push is needed to catch a direction and a real release to let it go, so
  // resting near the threshold cannot rattle; and only one axis is ever
  // live, so a diagonal picks a lane instead of alternating between two.
  _stickNav(move) {
    // move.y is already flipped so forward is +1; down a list is the other
    // way, which is what a player pulling the stick toward them expects.
    const x = move ? move.x : 0,
      y = move ? -move.y : 0;
    const latch = (v, was) => {
      const m = Math.abs(v);
      if (was) return m > NAV_EXIT && Math.sign(v) === was ? was : 0;
      return m > NAV_ENTER ? Math.sign(v) : 0;
    };
    ((this.stickX = latch(x, this.stickX)),
      (this.stickY = latch(y, this.stickY)));
    // One lane at a time, and the lane is sticky too. Comparing the two axes
    // outright swaps lanes the moment they cross, and on a diagonal they cross
    // constantly - a thumb wandering a few degrees either side of 45 flipped
    // between across and down every other frame. The lane only changes when
    // the other axis is clearly ahead.
    if (!this.stickX && !this.stickY) this.lane = null;
    else if (this.stickX && this.stickY) {
      const ax = Math.abs(x),
        ay = Math.abs(y);
      if (!this.lane) this.lane = ax >= ay ? "x" : "y";
      else if (this.lane === "x" && ay > ax * LANE_MARGIN) this.lane = "y";
      else if (this.lane === "y" && ax > ay * LANE_MARGIN) this.lane = "x";
      this.lane === "x" ? (this.stickY = 0) : (this.stickX = 0);
    } else this.lane = this.stickX ? "x" : "y";
    return { x: this.stickX, y: this.stickY };
  }
  // Everything operable inside the panel that is currently on top. Overlay
  // panels (settings, armory, controls) take priority over the menu behind
  // them, so a stick never walks out of an open panel into the page under it.
  targets() {
    const d = this.doc;
    if (!d) return [];
    const menu = d.getElementById("menu");
    if (!menu || menu.classList.contains("hidden")) return [];
    const overlay = ["settings", "armory-panel", "controls-panel"]
      .map((id) => d.getElementById(id))
      .find((el) => el && !el.classList.contains("hidden") && visible(el));
    const root = overlay || menu;
    return [...root.querySelectorAll(FOCUSABLE)].filter(visible);
  }
  // The back button of whatever is open, so Circle has something to press.
  backButton() {
    const d = this.doc;
    if (!d) return null;
    for (const id of [
      "btn-settings-back",
      "btn-armory-back",
      "btn-controls-back",
      "feedback-cancel",
    ]) {
      const el = d.getElementById(id);
      if (el && visible(el) && !el.disabled) return el;
    }
    return null;
  }
  // Focus something, and make it look focused.
  //
  // The looking part needs its own class because :focus-visible does not do
  // the job here, for three separate reasons: a gamepad poll is not an input
  // event, so the browser's own keyboard-versus-pointer heuristic is not
  // watching it; a range input never matches :focus-visible on a programmatic
  // focus at all; and most of this menu had no :focus rule to begin with, so
  // the buttons fell back to the user-agent outline - 1px of near-black on a
  // near-black panel. Focus was moving the whole time. Nobody could see it.
  _focus(el) {
    if (!el) return !1;
    if (this.lit && this.lit !== el) this.lit.classList.remove(FOCUS_CLASS);
    (el.focus(), el.classList.add(FOCUS_CLASS), (this.lit = el));
    return !0;
  }
  // A pad cannot type, so a text field is a dead end to land on by default.
  _isText(el) {
    return (
      !!el &&
      ((el.tagName === "INPUT" && el.type === "text") ||
        el.tagName === "TEXTAREA")
    );
  }
  // Where the first press lands: the primary action, the way a console menu
  // opens with the button you probably came for already selected. Anything
  // but the name field, which happens to be first in the document.
  _default(list) {
    const start = this.doc.getElementById("btn-start");
    if (start && list.includes(start)) return start;
    return list.find((el) => !this._isText(el)) || list[0];
  }
  // The nearest target in a direction, judged by where things are on the
  // glass rather than by their order in the document.
  //
  // Document order is the wrong model for this menu and it is not close. The
  // deploy screen is three panels side by side with a three-wide loadout grid
  // in the left one, which walked as a single eighteen-item strip: "down"
  // from the name field crossed every loadout cell before it reached DEPLOY,
  // "right" did exactly the same thing as "down", and getting from DEPLOY
  // back to a gun meant going up through eleven cells. A player pushing a
  // stick means the direction on the screen.
  _seek(list, from, dx, dy) {
    const A = from.getBoundingClientRect();
    const ax = A.left + A.width / 2,
      ay = A.top + A.height / 2;
    let best = null,
      bestScore = Infinity;
    for (const el of list) {
      if (el === from) continue;
      const B = el.getBoundingClientRect();
      const bx = B.left + B.width / 2,
        by = B.top + B.height / 2;
      // How far along the pushed direction, measured edge to edge: the gap
      // between the two boxes. Centre to centre is the wrong measure and it
      // matters - DEPLOY is wide, and FEEDBACK sits below it and slightly
      // right, so by centres FEEDBACK counts as being to DEPLOY's right when
      // it is really underneath it. By edges the gap comes out negative and
      // it is correctly not a candidate for "right" at all.
      const along = dy
        ? dy > 0
          ? B.top - A.bottom
          : A.top - B.bottom
        : dx > 0
          ? B.left - A.right
          : A.left - B.right;
      if (along < MIN_STEP - 1) continue;
      // Drift off that axis, which centres do measure well.
      const across = Math.abs((bx - ax) * -dy + (by - ay) * dx);
      // Do the two boxes share any extent across that axis - same column for
      // a vertical push, same row for a horizontal one?
      const overlap = dy
        ? Math.min(A.right, B.right) - Math.max(A.left, B.left)
        : Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
      // With no shared extent there is no "straight ahead" to fall back on,
      // so a candidate has to be roughly in the direction pushed rather than
      // away at a steep angle. Generous - about sixty degrees - because this
      // is the only way across to another panel, and being too strict here
      // leaves a control with nowhere to go.
      if (overlap <= 0 && along * 2 < across) continue;
      const score =
        along + across * CROSS_COST + (overlap > 0 ? 0 : NO_OVERLAP_COST);
      if (score < bestScore) ((bestScore = score), (best = el));
    }
    return best;
  }
  // One direction press. Focus stays put at an edge, which is what a console
  // menu does - there is no wrap, because with two axes there is always
  // another way round.
  _move(list, dx, dy) {
    const from = this.doc.activeElement;
    if (!from || !list.includes(from)) return this._focus(this._default(list));
    return this._focus(this._seek(list, from, dx, dy));
  }
  // Sliders are the one control a direction should change rather than leave.
  _isSlider(el) {
    return el && el.tagName === "INPUT" && el.type === "range";
  }
  _nudge(el, dir) {
    const step = +el.step || 1,
      min = +el.min,
      max = +el.max;
    const v = Math.min(max, Math.max(min, (+el.value || 0) + step * dir));
    if (v === +el.value) return;
    ((el.value = String(v)),
      // The panels listen for `input`, which is what a drag fires.
      el.dispatchEvent(new Event("input", { bubbles: !0 })));
  }
  // One frame. `s` is a pad snapshot; returns true if it consumed anything,
  // so the caller can tell whether the pad is driving the menu.
  update(s, dt, edges = {}) {
    const d = this.doc;
    if (!d || !s) return !1;
    const list = this.targets();
    if (!list.length) {
      ((this.holdX = 0),
        (this.holdY = 0),
        (this.wait = 0),
        (this.stickX = 0),
        (this.stickY = 0),
        (this.lane = null));
      return !1;
    }
    const focused = d.activeElement;
    const onSlider = this._isSlider(focused) && list.includes(focused);

    // A direction fires once on the way in, then repeats while it is held.
    // The d-pad is taken as given; the stick is debounced first.
    const stick = this._stickNav(s.move);
    const x = Math.sign(s.navX || 0) || stick.x,
      y = Math.sign(s.navY || 0) || stick.y;
    let stepX = 0,
      stepY = 0;
    if (x !== this.holdX || y !== this.holdY) {
      ((this.holdX = x), (this.holdY = y), (this.wait = REPEAT_DELAY));
      ((stepX = x), (stepY = y));
    } else if (x || y) {
      this.wait -= dt;
      if (this.wait <= 0) {
        ((this.wait = REPEAT_RATE), (stepX = x), (stepY = y));
      }
    }

    let used = !1;
    if (stepY) (this._move(list, 0, stepY), (used = !0));
    else if (stepX) {
      // Left and right belong to a slider when one is focused, and otherwise
      // move across the screen.
      if (onSlider) this._nudge(focused, stepX);
      else this._move(list, stepX, 0);
      used = !0;
    }

    if (edges.confirm) {
      // Confirming a slider would do nothing, so treat it as "move on".
      const el = d.activeElement;
      if (this._isSlider(el)) this._move(list, 0, 1);
      else if (el && list.includes(el)) el.click();
      else this._focus(this._default(list));
      used = !0;
    }
    if (edges.back) {
      const back = this.backButton();
      if (back) (back.click(), (used = !0));
    }
    // While the pad is driving, something is always highlighted. This covers
    // three cases with one rule: the first press of all, picking the pad back
    // up, and - the one worth naming - opening a panel. Confirming SETTINGS
    // leaves focus on the button now hidden behind the overlay, so without
    // this the panel arrived with nothing lit and the player was back to
    // hunting for the highlight they had just been given.
    //
    // A text field is left alone even so: if the player has clicked into the
    // name box, taking it off them mid-word would be its own bug.
    if (!list.includes(d.activeElement) && !this._isText(d.activeElement)) {
      if (this.lit && !list.includes(this.lit))
        (this.lit.classList.remove(FOCUS_CLASS), (this.lit = null));
      this._focus(this._default(list));
    }
    return used;
  }
  // Leaving the menu should not leave a button lit up behind it.
  blur() {
    const d = this.doc;
    if (this.lit) (this.lit.classList.remove(FOCUS_CLASS), (this.lit = null));
    if (d && d.activeElement && d.activeElement.blur) d.activeElement.blur();
    ((this.holdX = 0),
      (this.holdY = 0),
      (this.wait = 0),
      (this.stickX = 0),
      (this.stickY = 0),
      (this.lane = null));
  }
}
