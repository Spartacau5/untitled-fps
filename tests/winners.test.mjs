import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WINNERS,
  WINNERS_SHOWN,
  formatWinnerDate,
  latestWinners,
} from "../games/onslaught/src/data/winners.js";
import {
  crownFromBoard,
  ensureCrowned,
  mergeHall,
} from "../server/winners-core.js";
import { previousRoundKey, roundKey } from "../games/onslaught/src/core/round.js";

const at = (iso) => Date.parse(iso);

test("andylol holds the first two contest nights", () => {
  assert.equal(WINNERS.length, 2);
  assert.ok(WINNERS.every((w) => w.name === "andylol"));
  assert.deepEqual(
    WINNERS.map((w) => w.date).sort(),
    ["2026-09-07", "2026-09-08"],
  );
  assert.equal(WINNERS.find((w) => w.date === "2026-09-07").score, 503150);
  assert.equal(WINNERS.find((w) => w.date === "2026-09-08").score, 1073250);
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

test("renderWinners lists andylol's crowned nights newest first", async () => {
  const { renderWinners } = await import(
    "../games/onslaught/src/ui/leaderboard.js"
  );
  const el = { innerHTML: "" };
  renderWinners(el);
  assert.match(el.innerHTML, /HALL OF FAME/);
  assert.match(el.innerHTML, /andylol/);
  assert.match(el.innerHTML, /SEP 8/);
  assert.match(el.innerHTML, /1,073,250/);
  assert.match(el.innerHTML, /503,150/);
  assert.match(el.innerHTML, /LATEST 2 WINNERS/);
  assert.ok(el.innerHTML.indexOf("SEP 8") < el.innerHTML.indexOf("SEP 7"));
  assert.equal(el.innerHTML.includes("SEP 6"), false);
});

test("previousRoundKey is the day that just closed", () => {
  // Afternoon of Sep 9 ET: current board is Sep 9, previous is Sep 8.
  assert.equal(roundKey(at("2026-09-09T18:00:00Z")), "2026-09-09");
  assert.equal(previousRoundKey(at("2026-09-09T18:00:00Z")), "2026-09-08");
  // Past tonight's deadline: current is Sep 10, previous is Sep 9.
  assert.equal(roundKey(at("2026-09-10T02:00:00Z")), "2026-09-10");
  assert.equal(previousRoundKey(at("2026-09-10T02:00:00Z")), "2026-09-09");
});

test("crownFromBoard takes the highest score on a closed day", () => {
  const entry = crownFromBoard(
    [
      { name: "ACEboii", score: 582275, kills: 10, wave: 21, at: 1 },
      { name: "andylol", score: 1073250, kills: 90, wave: 29, at: 2 },
    ],
    "2026-09-08",
  );
  assert.deepEqual(entry, {
    date: "2026-09-08",
    name: "andylol",
    score: 1073250,
    wave: 29,
  });
  assert.equal(crownFromBoard([], "2026-09-08"), null);
});

test("ensureCrowned adds a closed day once, and skips empty boards", () => {
  const hall = mergeHall(WINNERS, []);
  const first = ensureCrowned(hall, {
    prevKey: "2026-09-09",
    prevBoard: [{ name: "Nova", score: 12000, kills: 40, wave: 4, at: 1 }],
    currentKey: "2026-09-10",
  });
  assert.equal(first.crowned.name, "Nova");
  assert.equal(first.winners[0].date, "2026-09-09");
  assert.equal(first.winners.length, 3);

  const again = ensureCrowned(first.winners, {
    prevKey: "2026-09-09",
    prevBoard: [{ name: "Nova", score: 99999, kills: 1, wave: 1, at: 9 }],
    currentKey: "2026-09-10",
  });
  assert.equal(again.crowned, null);
  assert.equal(again.winners.find((w) => w.date === "2026-09-09").score, 12000);

  const empty = ensureCrowned(hall, {
    prevKey: "2026-09-09",
    prevBoard: [],
    currentKey: "2026-09-10",
  });
  assert.equal(empty.crowned, null);
  assert.equal(empty.winners.length, 2);
});

test("seed nights stay authoritative over a live rewrite of the same day", () => {
  const hall = mergeHall(WINNERS, [
    { date: "2026-09-08", name: "imposter", score: 1, wave: 1 },
    { date: "2026-09-10", name: "Nova", score: 9000, wave: 3 },
  ]);
  assert.equal(hall.find((w) => w.date === "2026-09-08").name, "andylol");
  assert.equal(hall.find((w) => w.date === "2026-09-08").score, 1073250);
  assert.equal(hall.find((w) => w.date === "2026-09-10").name, "Nova");
});
