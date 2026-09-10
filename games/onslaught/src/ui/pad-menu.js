// Driving the menus from a controller.
//
// The convention here is the one every console has used for twenty years, so
// nobody has to learn it: d-pad or left stick moves, Cross/A confirms,
// Circle/B goes back, left and right work a slider. Options pauses, which the
// Game already owns.
//
// Focus is the DOM's own focus, not a parallel selection model. That means the
// existing :focus-visible styling lights up for free, screen readers follow
// along, and clicking with a mouse and moving with a stick cannot disagree
// about what is selected.

import { NAV_ENTER, NAV_EXIT } from "../core/gamepad.js";

// Held direction repeats like a key: a pause, then a steady rate. The rate
// started at 0.11 s, which is nine items a second - fast enough to overshoot
// anything in a list of eleven. About five and a half is what a console menu
// actually feels like.
const REPEAT_DELAY = 0.45;
const REPEAT_RATE = 0.18;

// How far ahead the other axis has to be before a held diagonal changes lane.
const LANE_MARGIN = 1.4;

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
      (this.lane = null));
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
  _move(list, dir) {
    const at = list.indexOf(this.doc.activeElement);
    // Nothing focused yet, or focus left the panel: start at the top.
    const next =
      at < 0
        ? dir > 0
          ? 0
          : list.length - 1
        : (at + dir + list.length) % list.length;
    list[next] && list[next].focus();
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
    if (stepY) (this._move(list, stepY), (used = !0));
    else if (stepX) {
      // Left and right belong to a slider when one is focused, and otherwise
      // are just another way to walk the list.
      if (onSlider) this._nudge(focused, stepX);
      else this._move(list, stepX);
      used = !0;
    }

    if (edges.confirm) {
      // Confirming a slider would do nothing, so treat it as "move on".
      const el = d.activeElement;
      if (this._isSlider(el)) this._move(list, 1);
      else if (el && list.includes(el)) el.click();
      else list[0] && list[0].focus();
      used = !0;
    }
    if (edges.back) {
      const back = this.backButton();
      if (back) (back.click(), (used = !0));
    }
    // Somewhere to start from, so the first press is a move and not a hunt.
    if (!list.includes(d.activeElement) && (stepX || stepY || edges.confirm))
      list[0].focus();
    return used;
  }
  // Leaving the menu should not leave a button lit up behind it.
  blur() {
    const d = this.doc;
    if (d && d.activeElement && d.activeElement.blur) d.activeElement.blur();
    ((this.holdX = 0),
      (this.holdY = 0),
      (this.wait = 0),
      (this.stickX = 0),
      (this.stickY = 0),
      (this.lane = null));
  }
}
