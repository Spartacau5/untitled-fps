import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULTS,
  RANGES,
  STORAGE_KEY,
  Settings,
} from "../games/onslaught/src/core/settings.js";

const memStorage = (init = {}) => {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
  };
};

test("defaults when storage is empty", () => {
  const s = new Settings(memStorage());
  assert.deepEqual(s.all(), DEFAULTS);
});

test("set clamps to range, snaps to step, persists and notifies", () => {
  const st = memStorage(),
    s = new Settings(st),
    seen = [];
  s.onChange((k, v) => seen.push([k, v]));
  s.set("fov", 500);
  s.set("sensitivity", 0.05);
  s.set("shake", 0.749);
  assert.equal(s.get("fov"), RANGES.fov.max);
  assert.equal(s.get("sensitivity"), RANGES.sensitivity.min);
  assert.equal(s.get("shake"), 0.7);
  assert.deepEqual(
    seen.map(([k]) => k),
    ["fov", "sensitivity", "shake"],
  );
  assert.deepEqual(new Settings(st).all(), s.all());
  assert.ok(st.getItem(STORAGE_KEY));
});

test("corrupt or partial storage falls back per key; unknown keys dropped", () => {
  assert.deepEqual(
    new Settings(memStorage({ [STORAGE_KEY]: "{nope" })).all(),
    DEFAULTS,
  );
  const s = new Settings(
    memStorage({
      [STORAGE_KEY]: JSON.stringify({ fov: 100, bogus: 1, music: "x" }),
    }),
  );
  assert.equal(s.get("fov"), 100);
  assert.equal(s.get("music"), DEFAULTS.music);
  assert.equal(s.get("bogus"), undefined);
});

test("set with unknown key throws; reset restores defaults", () => {
  const s = new Settings(memStorage());
  assert.throws(() => s.set("nope", 1));
  s.set("fov", 95);
  s.reset();
  assert.deepEqual(s.all(), DEFAULTS);
});

test("works with no storage at all", () => {
  const s = new Settings(null);
  s.set("fov", 90);
  assert.equal(s.get("fov"), 90);
});
