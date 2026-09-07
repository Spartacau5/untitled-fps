import { isPortrait, lockLandscape } from "../core/device.js";

export function mountRotatePrompt() {
  document.documentElement.classList.add("touch-mode");
  const el = document.createElement("div");
  el.className = "rotate-prompt";
  el.setAttribute("role", "status");
  el.innerHTML = '<span class="rotate-device" aria-hidden="true">↻</span><h2>ROTATE TO PLAY</h2><p>Turn your device sideways.<br>Unlock screen rotation if needed.</p>';
  document.body.appendChild(el);
  const sync = () => { el.hidden = !isPortrait(); };
  window.addEventListener("resize", sync);
  sync();
  return new Promise((resolve) => {
    const ready = () => {
      if (!isPortrait()) {
        window.removeEventListener("resize", ready);
        resolve();
      }
    };
    window.addEventListener("resize", ready);
    ready();
  });
}

export function mountTouchControls(input, game) {
  const root = document.createElement("div");
  root.className = "touch-controls";
  root.hidden = true;
  root.innerHTML = '<div class="touch-stick"><i></i></div>' +
    [["fire", "FIRE"], ["ads", "AIM"], ["jump", "JUMP"],
     ["crouch", "CROUCH"], ["reload", "RELOAD"], ["weapon", "WEAPON"],
     ["sprint", "AUTO RUN"], ["pause", "PAUSE"]]
      .map(([action, label]) => `<button type="button" data-action="${action}" class="touch-button touch-${action}" aria-label="${label}">${label}</button>`).join("");
  document.body.appendChild(root);
  const stick = root.querySelector(".touch-stick");
  const knob = stick.querySelector("i");
  const pointers = new Map();
  let moveId = null, lookId = null;
  const updateButtons = () => {
    for (const action of ["ads", "sprint"]) {
      const button = root.querySelector(`[data-action="${action}"]`);
      const on = action === "ads" ? input.ads : input.autoSprint;
      button.setAttribute("aria-pressed", String(on));
    }
  };
  input.onActiveChange = (active) => {
    pointers.clear();
    moveId = lookId = null;
    stick.style.display = "none";
    root.hidden = !active;
    updateButtons();
  };
  root.addEventListener("contextmenu", (e) => e.preventDefault());
  root.addEventListener("pointerdown", (e) => {
    if (!input.locked || e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    const action = e.target.closest("button")?.dataset.action;
    if (action === "pause") { game.pause(); return; }
    if (action && [...pointers.values()].some((p) => p.action === action)) return;
    const p = { action, x: e.clientX, y: e.clientY, ox: e.clientX, oy: e.clientY };
    if (!action) {
      if (e.clientX < window.innerWidth / 2 && moveId === null) {
        moveId = e.pointerId;
        stick.style.cssText = `display:block;left:${p.x}px;top:${p.y}px`;
        knob.style.transform = "translate(-50%, -50%)";
      } else if (e.clientX >= window.innerWidth / 2 && lookId === null) lookId = e.pointerId;
      else return;
    } else {
      input.press(action);
      // A fire finger may also aim, unless another finger already owns look.
      if (action === "fire" && lookId === null) lookId = e.pointerId;
    }
    pointers.set(e.pointerId, p);
    root.setPointerCapture(e.pointerId);
    updateButtons();
  });
  root.addEventListener("pointermove", (e) => {
    const p = pointers.get(e.pointerId);
    if (!p || !input.locked) return;
    e.preventDefault();
    if (e.pointerId === moveId) {
      const dx = e.clientX - p.ox, dy = e.clientY - p.oy;
      const distance = Math.hypot(dx, dy), radius = 48;
      const amount = Math.min(1, Math.max(0, (distance - 5) / (radius - 5)));
      input.move = { x: distance ? dx / distance * amount : 0,
        y: distance ? -dy / distance * amount : 0 };
      const scale = Math.min(1, radius / (distance || 1));
      knob.style.transform = `translate(calc(-50% + ${dx * scale}px), calc(-50% + ${dy * scale}px))`;
    }
    if (e.pointerId === lookId) {
      // A half-screen horizontal swipe turns roughly 180 degrees at 1x.
      const scale = Math.PI / (0.0021 * window.innerWidth * 0.5);
      input.dx += (e.clientX - p.x) * scale;
      input.dy += (e.clientY - p.y) * scale;
    }
    p.x = e.clientX; p.y = e.clientY;
  });
  const release = (e) => {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    pointers.delete(e.pointerId);
    if (p.action) input.release(p.action);
    if (e.pointerId === moveId) {
      moveId = null;
      input.move = { x: 0, y: 0 };
      stick.style.display = "none";
    }
    if (e.pointerId === lookId) lookId = null;
  };
  root.addEventListener("pointerup", release);
  root.addEventListener("pointercancel", (e) => {
    release(e);
    if (game.state === "playing") game.pause();
  });
  root.addEventListener("lostpointercapture", release);
  const suspend = () => {
    if (game.state === "playing") game.pause();
    else input.unlock();
  };
  window.addEventListener("blur", suspend);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) suspend();
  });
  window.addEventListener("resize", () => {
    if (isPortrait()) suspend();
    else { input.reset(); input.onActiveChange(input.locked); }
  });
  return {
    enter() {
      if (isPortrait()) return false;
      // Fullscreen/lock may be unavailable or refused. The rotate gate is
      // authoritative, so neither failure prevents landscape browser play.
      try {
        const request = document.documentElement.requestFullscreen;
        if (request && !document.fullscreenElement) {
          Promise.resolve(request.call(document.documentElement))
            .then(() => lockLandscape()).catch(() => {});
        } else void lockLandscape();
      } catch { /* browser-only landscape play remains available */ }
      return true;
    },
  };
}
