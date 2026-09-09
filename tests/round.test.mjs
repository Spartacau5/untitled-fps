import assert from "node:assert/strict";
import { test } from "node:test";
import {
  ROUND,
  previousRoundKey,
  roundEnd,
  roundKey,
} from "../games/onslaught/src/core/round.js";

const at = (iso) => Date.parse(iso);

test("a round always ends at the next deadline in the contest zone", () => {
  // 14:00 ET -> tonight's 21:00 ET, which is 01:00Z the next day under EDT.
  assert.equal(
    roundEnd(at("2026-09-08T18:00:00Z")),
    at("2026-09-09T01:00:00Z"),
  );
  // 22:00 ET is past it, so the round is tomorrow's.
  assert.equal(
    roundEnd(at("2026-09-09T02:00:00Z")),
    at("2026-09-10T01:00:00Z"),
  );
  // Exactly on the deadline the round has already rolled; never zero-length.
  const onTheHour = at("2026-09-09T01:00:00Z");
  assert.ok(roundEnd(onTheHour) > onTheHour);
});

test("the deadline stays 9PM local across the DST change", () => {
  // EDT (UTC-4)
  assert.equal(
    roundEnd(at("2026-10-15T12:00:00Z")),
    at("2026-10-16T01:00:00Z"),
  );
  // EST (UTC-5), after the 1 Nov 2026 change
  assert.equal(
    roundEnd(at("2026-11-10T12:00:00Z")),
    at("2026-11-11T02:00:00Z"),
  );
});

test("the round id is the local date the round closes on", () => {
  assert.equal(roundKey(at("2026-09-08T18:00:00Z")), "2026-09-08");
  // One minute past the deadline belongs to the next day's board.
  assert.equal(roundKey(at("2026-09-09T01:01:00Z")), "2026-09-09");
  // Just before it still belongs to the old one.
  assert.equal(roundKey(at("2026-09-09T00:59:00Z")), "2026-09-08");
});

test("ids roll cleanly across month and year ends", () => {
  assert.equal(roundKey(at("2026-10-01T02:30:00Z")), "2026-10-01");
  assert.equal(roundKey(at("2027-01-01T03:30:00Z")), "2027-01-01");
});

test("every instant of a day maps to exactly one round", () => {
  const seen = new Set();
  const start = at("2026-09-08T05:00:00Z");
  for (let h = 0; h < 24; h++) seen.add(roundKey(start + h * 3600e3));
  // A 24 hour sweep crosses exactly one deadline, so exactly two ids.
  assert.equal(seen.size, 2);
});

test("the zone is configurable without touching the maths", () => {
  const utc = { ...ROUND, zone: "America/New_York", deadlineHour: 0 };
  // Midnight ET is 04:00Z under EDT.
  assert.equal(
    roundEnd(at("2026-09-08T18:00:00Z"), utc),
    at("2026-09-09T04:00:00Z"),
  );
});

test("previousRoundKey names the board that closed most recently", () => {
  assert.equal(previousRoundKey(at("2026-09-09T18:00:00Z")), "2026-09-08");
  assert.equal(previousRoundKey(at("2026-09-10T02:00:00Z")), "2026-09-09");
});
