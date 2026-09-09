import { Audio } from "./audio.js";
import { WEAPONS } from "../data/weapons.js";

const audio = new Audio();
audio.groundedCombat = true;
audio.musicOn = false;
audio.ambienceOn = false;
const status = document.querySelector("#status");
const actions = document.querySelectorAll("[data-action]");
const timers = new Set();
let generation = 0;
const later = (ms, action) => {
  const id = setTimeout(() => { timers.delete(id); action(); }, ms);
  timers.add(id);
};
function stop() {
  generation++;
  for (const id of timers) clearTimeout(id);
  timers.clear();
  audio.samples?.stop();
}
const volume = document.querySelector("#volume");
function applyVolume() {
  document.querySelector("#level").textContent = `${volume.value}%`;
  audio.setVolumes({ master: Number(volume.value) / 100, sfx: 1, music: 0 });
}
volume.addEventListener("input", applyVolume);
document.querySelector("#enable").addEventListener("click", async (event) => {
  event.currentTarget.disabled = true;
  status.textContent = "Loading audio…";
  audio.init(); audio.resume(); applyVolume();
  // Audio creation is gesture-bound; optional PCM preparation lands after paint.
  while (!audio.sampleLoad) await new Promise((resolve) => setTimeout(resolve, 20));
  const results = await audio.sampleLoad;
  const failed = results.filter((item) => !item.loaded).length;
  status.textContent = failed ? `${failed} sounds could not load. Their fallback is active.` : "Ready. Choose a weapon and listen.";
  for (const button of actions) button.disabled = false;
  document.querySelector("#stop").disabled = false;
  document.querySelector("#enable").textContent = "Audio enabled";
});
document.querySelector("#stop").addEventListener("click", stop);
document.querySelector("#weapon").addEventListener("change", stop);
for (const button of actions) button.addEventListener("click", () => {
  stop(); audio.resume();
  const run = generation;
  const key = document.querySelector("#weapon").value;
  const action = button.dataset.action;
  const shot = () => { if (generation === run) audio.gunshot(key); };
  if (action === "single") shot();
  else if (action === "burst" || action === "exchange") {
    const cadence = 60000 / WEAPONS.find((weapon) => weapon.key === key).rpm;
    for (let i = 0; i < 5; i++) later(i * cadence, shot);
    if (action === "exchange") for (let i = 0; i < 12; i++)
      later(i * 90, () => audio.robotShot([i % 2 ? -8 : 10, 0, -8 - i % 3 * 3], i % 3 === 0));
  } else if (action === "reload") {
    audio.magOut(); later(650, () => audio.magIn()); later(1050, () => audio.bolt());
  } else if (action === "hit") audio.hitmarker();
  else audio.kill(action === "head");
});
document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
window.addEventListener("pagehide", stop);
