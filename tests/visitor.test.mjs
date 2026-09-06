import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assignFromMap,
  clientIp,
  hashIp,
  markPlayerFromMap,
  operatorName,
  playerCount,
  visitorCount,
} from "../server/visitor-core.js";
import { isPlaceholderName } from "../server/leaderboard-core.js";
import { audienceLine } from "../games/onslaught/src/ui/leaderboard.js";
import {
  contestState,
  formatRemaining,
  roundEnd,
} from "../games/onslaught/src/ui/contest.js";

test("clientIp uses the first x-forwarded-for hop", () => {
  assert.equal(
    clientIp({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }),
    "203.0.113.9",
  );
  assert.equal(clientIp({ "x-real-ip": "198.51.100.4" }), "198.51.100.4");
  assert.equal(
    clientIp({ "x-forwarded-for": "::ffff:203.0.113.9" }),
    "203.0.113.9",
  );
  assert.equal(clientIp({}), "");
});

test("the same IP always gets the same operator number", () => {
  let state = { next: 1, byHash: {} };
  const a = assignFromMap(state, "203.0.113.9");
  state = a.state;
  const again = assignFromMap(state, "203.0.113.9");
  assert.equal(a.n, 1);
  assert.equal(a.name, "OPERATOR #1");
  assert.equal(again.n, 1);
  assert.equal(again.created, false);
  assert.equal(visitorCount(again.state), 1);
});

test("a new IP gets the next operator number", () => {
  let state = { next: 1, byHash: {} };
  const a = assignFromMap(state, "203.0.113.9");
  const b = assignFromMap(a.state, "198.51.100.4");
  assert.equal(b.n, 2);
  assert.equal(b.name, "OPERATOR #2");
  assert.equal(visitorCount(b.state), 2);
  assert.notEqual(hashIp("203.0.113.9"), hashIp("198.51.100.4"));
});

test("operatorName is OPERATOR #n", () => {
  assert.equal(operatorName(12), "OPERATOR #12");
});

test("blank and default OPERATOR names are placeholders", () => {
  assert.equal(isPlaceholderName(""), true);
  assert.equal(isPlaceholderName("OPERATOR"), true);
  assert.equal(isPlaceholderName("operator #7"), true);
  assert.equal(isPlaceholderName("Ada"), false);
  assert.equal(isPlaceholderName("OPERATOR-X"), false);
});

test("a visit does not count as a player until they start a match", () => {
  const visited = assignFromMap({ next: 1, byHash: {} }, "203.0.113.9");
  assert.equal(visitorCount(visited.state), 1);
  assert.equal(playerCount(visited.state), 0);
  const played = markPlayerFromMap(visited.state, "203.0.113.9");
  assert.equal(played.created, true);
  assert.equal(playerCount(played.state), 1);
  assert.equal(visitorCount(played.state), 1);
  const again = markPlayerFromMap(played.state, "203.0.113.9");
  assert.equal(again.created, false);
  assert.equal(playerCount(again.state), 1);
});

test("a second IP can visit without becoming a player", () => {
  const a = assignFromMap({ next: 1, byHash: {} }, "203.0.113.9");
  const b = assignFromMap(a.state, "198.51.100.4");
  const played = markPlayerFromMap(b.state, "203.0.113.9");
  assert.equal(visitorCount(played.state), 2);
  assert.equal(playerCount(played.state), 1);
});

test("audienceLine shows unique visitors and unique players", () => {
  const html = audienceLine({ visitors: 1, players: 0 });
  assert.match(html, /1 UNIQUE VISITOR</);
  assert.match(html, /0 UNIQUE PLAYERS/);
  assert.match(audienceLine({ visitors: 2, players: 1 }), /2 UNIQUE VISITORS/);
  assert.match(audienceLine({ visitors: 2, players: 1 }), /1 UNIQUE PLAYER</);
});

const ET = (iso) => Date.parse(iso);

test("the daily round always ends at the next 9PM ET", () => {
  // 22:00 ET Sat -> tonight's deadline has passed, so the round ends Sunday.
  assert.equal(
    roundEnd(ET("2026-09-06T02:00:00Z")),
    ET("2026-09-07T01:00:00Z"),
  );
  // 20:59 ET the same evening still belongs to that day's round.
  assert.equal(
    roundEnd(ET("2026-09-06T00:59:00Z")),
    ET("2026-09-06T01:00:00Z"),
  );
  // Exactly on the deadline the round has rolled over, never zero-length.
  const onTheHour = ET("2026-09-06T01:00:00Z");
  assert.equal(roundEnd(onTheHour), ET("2026-09-07T01:00:00Z"));
  assert.ok(roundEnd(onTheHour) > onTheHour);
});

test("the deadline stays 9PM ET across the DST boundary", () => {
  // EDT (UTC-4): 9PM ET is 01:00Z the next day.
  assert.equal(
    roundEnd(ET("2026-10-15T12:00:00Z")),
    ET("2026-10-16T01:00:00Z"),
  );
  // EST (UTC-5), after the 1 Nov 2026 change: 9PM ET is 02:00Z the next day.
  assert.equal(
    roundEnd(ET("2026-11-10T12:00:00Z")),
    ET("2026-11-11T02:00:00Z"),
  );
});

test("a round is never longer than a day and never negative", () => {
  for (const hour of [0, 5, 13, 20, 21, 23]) {
    const now = ET(`2026-09-09T${String(hour).padStart(2, "0")}:30:00Z`);
    const state = contestState(now);
    assert.ok(state.remainingMs > 0, `positive at ${hour}Z`);
    assert.ok(state.remainingMs <= 86400e3, `within a day at ${hour}Z`);
    assert.match(state.label, /^ENDS IN /);
  }
});

test("remaining time gets finer as the deadline approaches", () => {
  assert.equal(formatRemaining(20 * 3600e3 + 5 * 60e3), "20H 05M");
  assert.equal(formatRemaining(2 * 3600e3), "2H 00M");
  assert.equal(formatRemaining(3 * 60e3 + 7e3), "3M 07S");
  assert.equal(formatRemaining(42e3), "42S");
  assert.equal(formatRemaining(0), "0S");
  assert.equal(formatRemaining(-5000), "0S");
});
