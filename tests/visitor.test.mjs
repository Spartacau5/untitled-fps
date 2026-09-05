import assert from "node:assert/strict";
import { test } from "node:test";
import {
  assignFromMap,
  clientIp,
  hashIp,
  operatorName,
  visitorCount,
} from "../server/visitor-core.js";
import { isPlaceholderName } from "../server/leaderboard-core.js";

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
