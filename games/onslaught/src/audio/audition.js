import { Audio } from "./audio.js";
import { WEAPONS } from "../data/weapons.js";
import { AUDIO_MIX_VERSION } from "./combat-samples.js";

const audio = new Audio();
audio.groundedCombat = true;
audio.musicOn = false;
audio.ambienceOn = false;
const status = document.querySelector("#status");
document.querySelector("#version").textContent = AUDIO_MIX_VERSION;
const actions = document.querySelectorAll("[data-action]");
const timers = new Set();
let generation = 0;
const later = (ms, action) => {
  const id = setTimeout(() => {
    timers.delete(id);
    action();
  }, ms);
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
  const button = event.currentTarget;
  button.disabled = true;
  status.textContent = "Loading audio…";
  try {
    audio.init();
    audio.resume();
    applyVolume();
    const results = await audio.sampleLoad;
    const failed = results.filter((item) => !item.loaded);
    const count = `${results.length - failed.length}/${results.length} sounds loaded`;
    status.textContent = failed.length
      ? `${AUDIO_MIX_VERSION} · ${count}. Preview unavailable: ${failed.map((item) => item.key).join(", ")}. Reload to retry.`
      : `${AUDIO_MIX_VERSION} · ${count}. Ready to listen.`;
    // Do not let an audition of a failed bank play synthetic substitutes.
    for (const action of actions) action.disabled = failed.length > 0;
    document.querySelector("#stop").disabled = false;
    button.textContent = failed.length ? "Audio incomplete" : "Audio enabled";
  } catch {
    status.textContent =
      "Audio could not start. Check browser audio permissions and try again.";
    button.disabled = false;
  }
});
document.querySelector("#stop").addEventListener("click", stop);
document.querySelector("#weapon").addEventListener("change", stop);
document.querySelector("#surface").addEventListener("change", stop);
for (const button of actions)
  button.addEventListener("click", () => {
    stop();
    audio.resume();
    const run = generation;
    const key = document.querySelector("#weapon").value;
    const action = button.dataset.action;
    const shot = () => {
      if (generation === run) audio.gunshot(key);
    };
    if (action === "single") shot();
    else if (
      action === "burst" ||
      action === "sustain" ||
      action === "exchange"
    ) {
      const cadence = 60000 / WEAPONS.find((weapon) => weapon.key === key).rpm;
      for (let i = 0; i < (action === "sustain" ? 20 : 5); i++)
        later(i * cadence, shot);
      if (action === "exchange")
        for (let i = 0; i < 12; i++)
          later(i * 90, () =>
            audio.robotShot(
              [i % 2 ? -8 : 10, 0, -8 - (i % 3) * 3],
              i % 3 === 0,
            ),
          );
    } else if (action === "walk" || action === "run") {
      const surface = document.querySelector("#surface").value;
      for (let i = 0; i < 12; i++)
        later(i * (action === "run" ? 310 : 480), () =>
          audio.footstep(action === "run" ? 1.25 : 0.85, surface),
        );
    } else if (action === "land") {
      audio.land(1, document.querySelector("#surface").value);
    } else if (action === "reload") {
      audio.magOut();
      later(650, () => audio.magIn());
      later(1050, () => audio.bolt());
    } else if (action === "hit") audio.hitmarker();
    else audio.kill(action === "head");
  });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop();
});
window.addEventListener("pagehide", stop);
