import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";
import { AUDIO_MIX_VERSION } from "../games/onslaught/src/audio/combat-samples.js";

for (const failed of [false, true]) test(`audio preview ${failed ? "blocks incomplete banks" : "schedules and cancels weapons and footsteps"}`, async () => {
  const elements = new Map();
  function element(key) {
    if (!elements.has(key)) elements.set(key, { value: key === "#volume" ? "65" : "m4",
      dataset: { action: key }, listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn; } });
    return elements.get(key);
  }
  const actionKeys = ["single", "burst", "sustain", "exchange", "reload", "hit", "kill", "head", "walk", "run", "land"];
  const document = { hidden: false, querySelector: element, querySelectorAll: () => actionKeys.map(element), addEventListener() {} };
  const scheduled = new Map(), calls = [];
  let timer = 0;
  class Audio {
    constructor() { this.samples = { stop: () => calls.push("stop") }; }
    init() { this.sampleLoad = Promise.resolve([{ key: "test-report", loaded: !failed }]); }
    resume() {}
    setVolumes() {}
    gunshot(key) { calls.push(key); }
    robotShot() { calls.push("bot"); }
    footstep(level, surface) { calls.push({ level, surface }); }
    land(level, surface) { calls.push({ land: level, surface }); }
  }
  const code = readFileSync(new URL("../games/onslaught/src/audio/audition.js", import.meta.url), "utf8")
    .replace(/^import .+;\n/gm, "");
  vm.runInNewContext(code, { Audio, WEAPONS, AUDIO_MIX_VERSION, document, window: { addEventListener() {} },
    setTimeout(fn, delay) { scheduled.set(++timer, { fn, delay }); return timer; },
    clearTimeout(id) { scheduled.delete(id); } });
  await element("#enable").listeners.click({ currentTarget: element("#enable") });
  if (failed) {
    assert.equal(element("burst").disabled, true);
    assert.match(element("#status").textContent, /0\/1 sounds loaded/);
    assert.match(element("#status").textContent, /test-report/);
    assert.equal(scheduled.size, 0);
    return;
  }
  assert.equal(element("burst").disabled, false);
  assert.match(element("#status").textContent, /1\/1 sounds loaded/);
  element("burst").listeners.click();
  const expected = 60000 / WEAPONS.find(w => w.key === "m4").rpm;
  assert.deepEqual([...scheduled.values()].map(t => t.delay), [0, expected, expected * 2, expected * 3, expected * 4]);
  for (const [id, t] of [...scheduled]) { scheduled.delete(id); t.fn(); }
  assert.equal(calls.filter(c => c === "m4").length, 5);
  element("exchange").listeners.click(); assert.equal(scheduled.size, 17);
  element("#stop").listeners.click(); assert.equal(scheduled.size, 0);
  element("burst").listeners.click();
  element("#weapon").listeners.change(); assert.equal(scheduled.size, 0);
  element("sustain").listeners.click(); assert.equal(scheduled.size, 20);
  element("#stop").listeners.click(); assert.equal(scheduled.size, 0);
  element("#surface").value = "metal";
  element("run").listeners.click();
  assert.equal(scheduled.size, 12);
  assert.equal([...scheduled.values()][1].delay, 310);
  for (const [id, t] of [...scheduled]) { scheduled.delete(id); t.fn(); }
  assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1))), { level: 1.25, surface: "metal" });
  element("walk").listeners.click();
  element("#surface").listeners.change(); assert.equal(scheduled.size, 0);
  element("land").listeners.click();
  assert.deepEqual(JSON.parse(JSON.stringify(calls.at(-1))), { land: 1, surface: "metal" });
});
