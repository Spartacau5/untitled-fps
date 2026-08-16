// HIGHRISE PROTOCOL — entry point. Boots the game and starts the loop.
import { Game } from './systems/Game.js';

function boot() {
  try {
    const game = new Game();
    window.__game = game;
    game.loop();
    console.log('%cHIGHRISE PROTOCOL', 'color:#ff5a2c;font-size:16px;font-weight:bold;');
    console.log('%cGunfeel is the whole game. Press T for aim self-test, ` for debug.', 'color:#888;');
  } catch (err) {
    console.error('[BOOT] Failed to start:', err);
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;color:#ff5a5a;font-family:monospace;background:#0a0c10;z-index:999;white-space:pre-wrap;padding:20px;';
    el.textContent = 'BOOT ERROR\n' + (err && err.stack ? err.stack : String(err));
    document.body.appendChild(el);
  }
}

// Run after DOM ready (script is module/defer anyway).
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
