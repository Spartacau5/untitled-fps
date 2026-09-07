// Which control scheme and render profile this device gets.
//
// Capability, not user-agent. A touchscreen laptop with a mouse attached
// should get the desktop game; a tablet with no pointer should not. `pointer:
// coarse` is the primary signal — it asks the one question that matters, "is
// the primary pointing device imprecise" — and the touch-points check catches
// engines that report a coarse pointer without a real touchscreen.
//
// ?desktop=1 and ?mobile=1 force either way, which is how the mobile build
// gets tested from a desktop browser and how a phone user escapes if the
// detection is wrong for them.
export function isTouchDevice(win = typeof window === "undefined" ? null : window) {
  if (!win) return false;
  const q = new URLSearchParams(win.location?.search || "");
  if (q.get("desktop") === "1") return false;
  if (q.get("mobile") === "1") return true;
  const coarse =
    typeof win.matchMedia === "function" &&
    win.matchMedia("(pointer: coarse)").matches;
  const touchPoints = Number(win.navigator?.maxTouchPoints || 0) > 0;
  return coarse && touchPoints;
}

// Portrait is not a supported orientation: the HUD, the thumb layout and the
// field of view are all built for a landscape frame. Rather than reflow for a
// shape nobody will play in, the game asks to be turned.
export function isPortrait(win = typeof window === "undefined" ? null : window) {
  if (!win) return false;
  if (typeof win.matchMedia === "function")
    return win.matchMedia("(orientation: portrait)").matches;
  return win.innerHeight > win.innerWidth;
}

// Best-effort landscape lock. Support and fullscreen requirements vary by
// browser, so the rotate prompt remains authoritative when locking fails.
export async function lockLandscape(win = typeof window === "undefined" ? null : window) {
  const orientation = win?.screen?.orientation;
  if (!orientation || typeof orientation.lock !== "function") return false;
  try {
    await orientation.lock("landscape");
    return true;
  } catch {
    return false;
  }
}
