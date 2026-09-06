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
