import assert from "node:assert/strict";
import { test } from "node:test";
import { RUNS_KEY, RunLog } from "../games/onslaught/src/core/runlog.js";

const mem = () => {
  const m = new Map();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => m.set(k, v),
    removeItem: (k) => m.delete(k),
  };
};

test("append keeps the newest `cap` records, newest first, and persists", () => {
  const st = mem(),
    log = new RunLog(st, 3);
  for (let i = 1; i <= 5; i++) log.append({ seed: i });
  assert.deepEqual(
    log.list().map((r) => r.seed),
    [5, 4, 3],
  );
  assert.deepEqual(
    new RunLog(st, 3).list().map((r) => r.seed),
    [5, 4, 3],
  );
  assert.ok(st.getItem(RUNS_KEY));
  log.clear();
  assert.deepEqual(log.list(), []);
});

test("tolerates corrupt storage and missing storage", () => {
  const st = mem();
  st.setItem(RUNS_KEY, "[");
  assert.deepEqual(new RunLog(st).list(), []);
  const log = new RunLog(null);
  log.append({ seed: 1 });
  assert.equal(log.list().length, 1);
});
