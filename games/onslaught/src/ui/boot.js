// Loading screen.
//
// The markup lives in index.html rather than being created here, so it is on
// screen at first paint - about 200 ms in - instead of after the bundle has
// parsed and the city has been built. That is the whole point: the work behind
// it takes seconds, and without something to look at the tab is simply blank.
//
// Progress is reported against real work, not a timer. The bar only moves when
// a stage has genuinely finished.
const EASE_MS = 220;

export function mountBoot(doc = document) {
  const root = doc.getElementById("boot");
  if (!root) return nullBoot();
  const fill = doc.getElementById("boot-fill"),
    pct = doc.getElementById("boot-pct"),
    step = doc.getElementById("boot-step");
  let shown = 0;

  const paint = (v, label) => {
    shown = Math.max(shown, Math.min(1, v));
    if (fill) fill.style.transform = `scaleX(${shown})`;
    if (pct) pct.textContent = `${Math.round(shown * 100)}%`;
    if (label && step) step.textContent = label;
  };

  // Hands the frame back so the bar actually repaints before the next stage
  // blocks the thread. Without this every stage would land in one frame and
  // the bar would jump straight from 0 to 100.
  const yieldFrame = () =>
    new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)));

  return {
    async step(label, value) {
      (paint(value, label), await yieldFrame());
    },
    set: paint,
    async finish() {
      (paint(1, "READY"), await yieldFrame());
      root.classList.add("is-done");
      // Let the panels part before the element stops taking up space.
      await new Promise((r) => setTimeout(r, EASE_MS + 260));
      (root.classList.add("hidden"), root.setAttribute("aria-hidden", "true"));
    },
    // A failed boot should not leave the player staring at a frozen bar.
    fail(message) {
      (paint(1, "FAILED"), root.classList.add("is-failed"));
      if (step) step.textContent = message || "FAILED TO START";
    },
  };
}

function nullBoot() {
  const noop = async () => {};
  return { step: noop, set: () => {}, finish: noop, fail: () => {} };
}
