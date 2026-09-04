import { Game } from "./game/game.js";
import { applyThemeCss, applyThemeStrings } from "./theme/theme.js";

applyThemeCss();
applyThemeStrings();

const canvas = document.getElementById("game");
try {
  new Game(canvas);
  if (new URLSearchParams(location.search).has("debug"))
    import("./debug/panel.js").then((m) => m.mountDebugPanel(window.game));
} catch (err) {
  console.error(err);
  const box = document.createElement("div");
  box.style.cssText =
    "position:fixed;left:20px;top:20px;color:#f66;font:14px monospace;z-index:99;white-space:pre-wrap;max-width:90vw";
  box.textContent = "Failed to start: " + (err && err.stack ? err.stack : err);
  document.body.appendChild(box);
}
