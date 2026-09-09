import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";

test("audio preview schedules real weapon cadence and cancels playback on stop/change", async () => {
  const elements = new Map();
  function element(key) {
    if (!elements.has(key)) elements.set(key, { value: key === "#volume" ? "65" : "m4",
      dataset: { action: key }, listeners: {}, addEventListener(type, fn) { this.listeners[type] = fn; } });
    return elements.get(key);
  }
  const actionKeys = ["single", "burst", "exchange", "reload", "hit", "kill", "head"];
  const document = { hidden: false, querySelector: element, querySelectorAll: () => actionKeys.map(element), addEventListener() {} };
  const scheduled = new Map(), calls = [];
  let timer = 0;
  class Audio {
    constructor() { this.samples = { stop: () => calls.push("stop") }; }
    init() { this.sampleLoad = Promise.resolve([{ loaded: true }]); }
    resume() {}
    setVolumes() {}
    gunshot(key) { calls.push(key); }
    robotShot() { calls.push("bot"); }
  }
  const code = readFileSync(new URL("../games/onslaught/src/audio/audition.js", import.meta.url), "utf8")
    .replace(/^import .+;\n/gm, "");
  vm.runInNewContext(code, { Audio, WEAPONS, document, window: { addEventListener() {} },
    setTimeout(fn, delay) { scheduled.set(++timer, { fn, delay }); return timer; },
    clearTimeout(id) { scheduled.delete(id); } });
  await element("#enable").listeners.click({ currentTarget: element("#enable") });
  assert.equal(element("burst").disabled, false);
  element("burst").listeners.click();
  const expected = 60000 / WEAPONS.find(w => w.key === "m4").rpm;
  assert.deepEqual([...scheduled.values()].map(t => t.delay), [0, expected, expected * 2, expected * 3, expected * 4]);
  for (const [id, t] of [...scheduled]) { scheduled.delete(id); t.fn(); }
  assert.equal(calls.filter(c => c === "m4").length, 5);
  element("exchange").listeners.click(); assert.equal(scheduled.size, 17);
  element("#stop").listeners.click(); assert.equal(scheduled.size, 0);
  element("burst").listeners.click();
  element("#weapon").listeners.change(); assert.equal(scheduled.size, 0);
});
