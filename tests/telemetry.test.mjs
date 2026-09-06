import assert from "node:assert/strict";
import { test } from "node:test";
import {
  exportCsv,
  insertEvent,
  sanitizeEvent,
  summarise,
  toCsv,
} from "../server/telemetry-core.js";

const AT = "2026-09-06T01:00:00.000Z";

const runBody = (over = {}) => ({
  type: "run",
  sessionId: "sess-1",
  runId: "run-1",
  record: {
    game: "1.2.3",
    seed: 42,
    startedAt: "2026-09-06T00:50:00.000Z",
    endedAt: "2026-09-06T00:55:00.000Z",
    settings: { sensitivity: 1.4, fov: 95, master: 0.9 },
    summary: {
      result: "dead",
      wave: 5,
      score: 19050,
      kills: 97,
      elapsed: 232.5,
      accuracy: 0.4123,
      damageDealt: 900,
      damageTaken: 310,
      killedBy: { kind: "brute" },
      pickups: { collected: 3, expired: 1 },
      weapons: { ar: { shots: 120, hits: 50, kills: 9, timeHeldS: 88.25 } },
      enemies: { husk: { spawned: 40, killed: 38 } },
      waves: [{ wave: 1, startedS: 0, clearedS: 30, durationS: 30 }],
      ...over,
    },
  },
});

test("a run event keeps the stats worth studying", () => {
  const ev = sanitizeEvent(runBody(), { at: AT, visitor: "abc123" });
  assert.equal(ev.type, "run");
  assert.equal(ev.at, AT);
  assert.equal(ev.visitor, "abc123");
  assert.equal(ev.summary.result, "dead");
  assert.equal(ev.summary.wave, 5);
  assert.equal(ev.summary.killedBy, "brute");
  assert.equal(ev.summary.weapons.ar.shots, 120);
  assert.equal(ev.summary.enemies.husk.killed, 38);
  assert.equal(ev.summary.waves.length, 1);
  assert.equal(ev.settings.sensitivity, 1.4);
});

test("the client cannot choose its own identity or timestamp", () => {
  const ev = sanitizeEvent(
    { ...runBody(), at: "1999-01-01T00:00:00.000Z", visitor: "someone-else" },
    { at: AT, visitor: "real-hash" },
  );
  assert.equal(ev.at, AT);
  assert.equal(ev.visitor, "real-hash");
});

test("unknown fields and junk results are dropped, not stored", () => {
  const body = runBody();
  body.record.summary.evil = "<script>";
  body.record.summary.result = "winner";
  body.record.summary.weapons.ar.evil = 1;
  const ev = sanitizeEvent(body, { at: AT });
  assert.equal(ev.summary.evil, undefined);
  assert.equal(ev.summary.weapons.ar.evil, undefined);
  // An unrecognised result falls back rather than being persisted verbatim.
  assert.equal(ev.summary.result, "alive");
});

test("oversized wave arrays are capped", () => {
  const body = runBody();
  body.record.summary.waves = Array.from({ length: 500 }, (_, i) => ({
    wave: i,
  }));
  assert.equal(sanitizeEvent(body, { at: AT }).summary.waves.length, 80);
});

test("session events carry where the player stopped", () => {
  const ev = sanitizeEvent(
    {
      type: "session",
      sessionId: "sess-1",
      startedAt: "2026-09-06T00:40:00.000Z",
      msOnPage: 540000,
      runs: 3,
      lastState: "playing",
      lastWave: 4,
    },
    { at: AT, visitor: "abc" },
  );
  assert.equal(ev.type, "session");
  assert.equal(ev.msOnPage, 540000);
  assert.equal(ev.runs, 3);
  assert.equal(ev.lastState, "playing");
  assert.equal(ev.lastWave, 4);
});

test("a bogus lastState is blanked rather than trusted", () => {
  const ev = sanitizeEvent(
    { type: "session", sessionId: "s", lastState: "cheating" },
    { at: AT },
  );
  assert.equal(ev.lastState, "");
});

test("bad payloads are rejected", () => {
  assert.throws(() => sanitizeEvent(null, { at: AT }), /invalid body/);
  assert.throws(() => sanitizeEvent({ type: "nope" }, { at: AT }), /invalid type/);
  assert.throws(() => sanitizeEvent({ type: "run" }, { at: AT }), /invalid record/);
});

test("the log keeps the newest events once it is full", () => {
  let list = [];
  for (let i = 0; i < 12; i++) list = insertEvent(list, { type: "run", i }, 10);
  assert.equal(list.length, 10);
  assert.equal(list[0].i, 2);
  assert.equal(list[9].i, 11);
});

test("csv escapes separators and quotes", () => {
  const csv = toCsv([{ a: 'say "hi", ok', b: 1 }], ["a", "b"]);
  assert.equal(csv, 'a,b\n"say ""hi"", ok",1');
});

test("csv export splits runs from sessions", () => {
  const records = [
    sanitizeEvent(runBody(), { at: AT, visitor: "v1" }),
    sanitizeEvent(
      { type: "session", sessionId: "sess-1", msOnPage: 1000, runs: 1 },
      { at: AT, visitor: "v1" },
    ),
  ];
  const runs = exportCsv(records, "run").split("\n");
  assert.equal(runs.length, 2);
  assert.match(runs[0], /^at,visitor,sessionId,runId,result,wave/);
  assert.match(runs[1], /dead/);
  const sessions = exportCsv(records, "session").split("\n");
  assert.equal(sessions.length, 2);
  assert.match(sessions[1], /1000/);
});

test("summarise answers the stickiness questions", () => {
  const mk = (visitor, sessionId, wave, result) =>
    sanitizeEvent(
      {
        ...runBody({ wave, result }),
        sessionId,
      },
      { at: AT, visitor },
    );
  const records = [
    mk("v1", "s1", 3, "dead"),
    mk("v1", "s1", 5, "dead"),
    mk("v1", "s2", 2, "quit"),
    mk("v2", "s3", 4, "abandoned"),
    sanitizeEvent(
      { type: "session", sessionId: "s1", msOnPage: 600000, runs: 2 },
      { at: AT, visitor: "v1" },
    ),
  ];
  const s = summarise(records);
  assert.equal(s.visitors, 2);
  assert.equal(s.sessions, 3);
  assert.equal(s.runs, 4);
  // v1 played across two sessions; v2 only one.
  assert.equal(s.returningVisitors, 1);
  assert.equal(s.runsPerVisitor, 2);
  assert.equal(s.byResult.dead, 2);
  assert.equal(s.byResult.quit, 1);
  assert.equal(s.byResult.abandoned, 1);
  assert.equal(s.endedOnWave[3], 1);
  assert.equal(s.endedOnWave[5], 1);
  assert.equal(s.totalOnPageS, 600);
});
