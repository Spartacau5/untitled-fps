import assert from "node:assert/strict";
import { test } from "node:test";
import {
  insertRun,
  sanitizeEntry,
  sanitizeName,
  shouldRecordRun,
  topN,
} from "../server/leaderboard-core.js";

test("sanitizeName trims, caps length, and falls back", () => {
  assert.equal(sanitizeName("  Ada  "), "Ada");
  assert.equal(sanitizeName("thisnameiswaytoolongyes"), "thisnameiswaytoo");
  assert.equal(sanitizeName("!!!"), "OPERATOR");
  assert.equal(sanitizeName("<script>"), "script");
  assert.equal(sanitizeName("OPERATOR #7"), "OPERATOR #7");
});

test("sanitizeEntry rejects bad scores and keeps a ranked shape", () => {
  const e = sanitizeEntry({
    name: "Ada",
    score: 1200.9,
    kills: 11,
    wave: 3,
    elapsed: 91.2,
    seed: 42,
  });
  assert.equal(e.score, 1200);
  assert.equal(e.elapsed, 91);
  assert.equal(e.runId, "");
  const withId = sanitizeEntry({
    name: "OPERATOR #1",
    score: 10,
    kills: 1,
    wave: 1,
    elapsed: 8,
    seed: 1,
    runId: "abc-123",
  });
  assert.equal(withId.runId, "abc-123");
  assert.equal(withId.name, "OPERATOR #1");
  assert.throws(() => sanitizeEntry({ score: -1, kills: 0, wave: 0, elapsed: 0, seed: 1 }));
  assert.throws(() => sanitizeEntry({ score: 99e9, kills: 0, wave: 0, elapsed: 0, seed: 1 }));
});

test("insertRun ranks by score then kills and returns top 5 from a longer board", () => {
  let records = [];
  const t0 = 1_700_000_000_000;
  const rows = [
    { name: "A", score: 100, kills: 2, wave: 1, elapsed: 10, seed: 1, at: t0 },
    { name: "B", score: 500, kills: 4, wave: 2, elapsed: 20, seed: 1, at: t0 + 1 },
    { name: "C", score: 500, kills: 9, wave: 2, elapsed: 20, seed: 1, at: t0 + 2 },
    { name: "D", score: 300, kills: 3, wave: 2, elapsed: 15, seed: 1, at: t0 + 3 },
    { name: "E", score: 50, kills: 1, wave: 1, elapsed: 8, seed: 1, at: t0 + 4 },
    { name: "F", score: 800, kills: 12, wave: 4, elapsed: 40, seed: 1, at: t0 + 5 },
  ];
  for (const r of rows) records = insertRun(records, r);
  const top = topN(records, 5);
  assert.deepEqual(
    top.map((r) => r.name),
    ["F", "C", "B", "D", "A"],
  );
  assert.equal(top[0].rank, 1);
  assert.equal(top.length, 5);
});

test("insertRun replaces the same runId with the better score", () => {
  const t0 = 1_700_000_000_000;
  let records = insertRun([], {
    name: "OPERATOR #1",
    score: 400,
    kills: 3,
    wave: 2,
    elapsed: 20,
    seed: 1,
    at: t0,
    runId: "run-a",
  });
  records = insertRun(records, {
    name: "OPERATOR #1",
    score: 900,
    kills: 8,
    wave: 3,
    elapsed: 40,
    seed: 1,
    at: t0 + 1,
    runId: "run-a",
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].score, 900);
  records = insertRun(records, {
    name: "OPERATOR #1",
    score: 100,
    kills: 1,
    wave: 1,
    elapsed: 5,
    seed: 1,
    at: t0 + 2,
    runId: "run-a",
  });
  assert.equal(records.length, 1);
  assert.equal(records[0].score, 900);
});

test("shouldRecordRun skips empty quits and keeps real play", () => {
  assert.equal(shouldRecordRun({ score: 0, kills: 0, elapsed: 0 }), false);
  assert.equal(shouldRecordRun({ score: 0, kills: 0, elapsed: 34 }), false);
  assert.equal(shouldRecordRun({ score: 50, kills: 0, elapsed: 1 }), true);
  assert.equal(shouldRecordRun({ score: 0, kills: 1, elapsed: 1 }), true);
});
