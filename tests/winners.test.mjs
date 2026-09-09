import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WINNERS,
  WINNERS_SHOWN,
  formatWinnerDate,
  latestWinners,
} from "../games/onslaught/src/data/winners.js";

test("Andylol holds the first three contest nights", () => {
  assert.equal(WINNERS.length, 3);
  assert.ok(WINNERS.every((w) => w.name === "Andylol"));
  assert.deepEqual(
    WINNERS.map((w) => w.date).sort(),
    ["2026-09-06", "2026-09-07", "2026-09-08"],
  );
});

test("latestWinners keeps newest first and caps at five", () => {
  const many = [
    { date: "2026-09-01", name: "A", score: 1 },
    { date: "2026-09-10", name: "B", score: 2 },
    { date: "2026-09-05", name: "C", score: 3 },
    { date: "2026-09-08", name: "D", score: 4 },
    { date: "2026-09-03", name: "E", score: 5 },
    { date: "2026-09-09", name: "F", score: 6 },
  ];
  const top = latestWinners(many, WINNERS_SHOWN);
  assert.equal(top.length, 5);
  assert.deepEqual(
    top.map((w) => w.date),
    ["2026-09-10", "2026-09-09", "2026-09-08", "2026-09-05", "2026-09-03"],
  );
});

test("formatWinnerDate shortens an ISO day for the hall of fame", () => {
  assert.equal(formatWinnerDate("2026-09-08"), "SEP 8");
  assert.equal(formatWinnerDate("2026-12-01"), "DEC 1");
  assert.equal(formatWinnerDate("bad"), "bad");
});

test("renderWinners lists Andylol's crowned nights newest first", async () => {
  const { renderWinners } = await import(
    "../games/onslaught/src/ui/leaderboard.js"
  );
  const el = { innerHTML: "" };
  renderWinners(el);
  assert.match(el.innerHTML, /HALL OF FAME/);
  assert.match(el.innerHTML, /Andylol/);
  assert.match(el.innerHTML, /SEP 8/);
  assert.match(el.innerHTML, /57,438/);
  assert.match(el.innerHTML, /LATEST 3 WINNERS/);
  assert.ok(el.innerHTML.indexOf("SEP 8") < el.innerHTML.indexOf("SEP 6"));
});
