import { inject } from "@vercel/analytics";
import { Game } from "./game/game.js";
import { applyThemeCss, applyThemeStrings } from "./theme/theme.js";
import { mountBoot } from "./ui/boot.js";

// Vercel Web Analytics: audience-level numbers (referrers, countries,
// devices) that the in-game telemetry deliberately does not collect. It
// no-ops off Vercel, so local play sends nothing. Injected before the game
// boots so a crash in startup still leaves the visit counted.
inject();

applyThemeCss();
applyThemeStrings();

const canvas = document.getElementById("game");
const boot = mountBoot();

// Startup is staged rather than one synchronous block so the loading screen
// can paint between stages. Building the city and linking its shaders takes
// seconds; without yielding, the bar would jump from 0 to 100 in a single
// frame and the tab would simply hang in between.
(async () => {
  try {
    await boot.step("BUILDING THE SQUARE", 0.18);
    const game = new Game(canvas);
    await boot.step("PREPARING RENDERER", 0.42);
    await game.warmup((value, label) => boot.set(value, label));
    game.startLoop();
    await boot.finish();
    if (new URLSearchParams(location.search).has("debug"))
      import("./debug/panel.js").then((m) => m.mountDebugPanel(window.game));
  } catch (err) {
    console.error(err);
    boot.fail("FAILED TO START");
    const box = document.createElement("div");
    box.style.cssText =
      "position:fixed;left:20px;top:20px;color:#f66;font:14px monospace;z-index:99;white-space:pre-wrap;max-width:90vw";
    box.textContent = "Failed to start: " + (err && err.stack ? err.stack : err);
    document.body.appendChild(box);
  }
})();
