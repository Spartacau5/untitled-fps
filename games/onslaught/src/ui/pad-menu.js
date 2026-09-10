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

// Held direction repeats like a key: a pause, then a steady rate. Without it a
// stick either steps once per push or sprints down a list uncontrollably.
const REPEAT_DELAY = 0.42;
const REPEAT_RATE = 0.11;

// Anything a player can operate. Order is DOM order, which is reading order,
// which is the order the eye expects to travel in.
const FOCUSABLE =
  'button:not([disabled]), input[type="range"], input[type="text"], textarea, [tabindex]:not([tabindex="-1"])';

const visible = (el) =>
  !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

export class PadMenu {
  constructor(doc = typeof document === "undefined" ? null : document) {
    ((this.doc = doc), (this.holdX = 0), (this.holdY = 0), (this.wait = 0));
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
      ((this.holdX = 0), (this.holdY = 0), (this.wait = 0));
      return !1;
    }
    const focused = d.activeElement;
    const onSlider = this._isSlider(focused) && list.includes(focused);

    // A direction fires once on the way in, then repeats while it is held.
    const x = Math.sign(s.navX || 0),
      y = Math.sign(s.navY || 0);
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
    ((this.holdX = 0), (this.holdY = 0), (this.wait = 0));
  }
}
