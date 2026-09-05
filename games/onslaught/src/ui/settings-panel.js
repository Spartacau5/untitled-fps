import { DEFAULTS, RANGES } from "../core/settings.js";

const LABELS = {
  sensitivity: ["SENSITIVITY", (v) => v.toFixed(1)],
  fov: ["FIELD OF VIEW", (v) => v.toFixed(0) + "°"],
  master: ["MASTER VOLUME", (v) => Math.round(v * 100) + "%"],
  music: ["MUSIC", (v) => Math.round(v * 100) + "%"],
  sfx: ["EFFECTS", (v) => Math.round(v * 100) + "%"],
  shake: ["SCREEN SHAKE", (v) => Math.round(v * 100) + "%"],
};

export function mountSettingsPanel(settings, els) {
  const inputs = {};
  for (const key in DEFAULTS) {
    const r = RANGES[key],
      [label, fmt] = LABELS[key],
      row = document.createElement("label");
    row.className = "settings-row";
    row.innerHTML = `<span class="settings-k">${label}</span><input type="range" min="${r.min}" max="${r.max}" step="${r.step}"><span class="settings-v"></span>`;
    const input = row.querySelector("input"),
      val = row.querySelector(".settings-v");
    const show = (v) => {
      input.value = String(v);
      val.textContent = fmt(v);
    };
    show(settings.get(key));
    input.addEventListener("input", () => show(settings.set(key, +input.value)));
    els.rows.appendChild(row);
    inputs[key] = show;
  }
  settings.onChange((k, v) => inputs[k] && inputs[k](v));
  const open = () => {
    els.panel.classList.remove("hidden");
    els.menuMain.classList.add("hidden");
  };
  const close = () => {
    els.panel.classList.add("hidden");
    els.menuMain.classList.remove("hidden");
  };
  els.btnOpen.addEventListener("click", open);
  els.btnBack.addEventListener("click", close);
  els.btnReset.addEventListener("click", () => settings.reset());
  return { open, close, isOpen: () => !els.panel.classList.contains("hidden") };
}
