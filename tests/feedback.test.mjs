import assert from "node:assert/strict";
import { test } from "node:test";
import {
  KEEP,
  insertNote,
  sanitizeNote,
} from "../server/feedback-core.js";

test("sanitizeNote requires a message and optional name", () => {
  const n = sanitizeNote({ name: "  Ada  ", message: "  guns feel great  " });
  assert.equal(n.name, "Ada");
  assert.equal(n.message, "guns feel great");
  assert.ok(n.at > 0);
  const anon = sanitizeNote({ message: "jump is floaty" });
  assert.equal(anon.name, "");
  assert.throws(() => sanitizeNote({ name: "Ada", message: "   " }));
  assert.throws(() => sanitizeNote({}));
});

test("sanitizeNote caps length and strips junk", () => {
  const n = sanitizeNote({
    name: "<script>hello-world!!!!",
    message: "x".repeat(3000),
  });
  assert.equal(n.name.length <= 16, true);
  assert.equal(n.message.length, 2000);
  assert.equal(n.name.includes("<"), false);
});

test("insertNote keeps newest first and caps the log", () => {
  let records = [];
  for (let i = 0; i < KEEP + 5; i++)
    records = insertNote(records, {
      name: "A",
      message: "n" + i,
      at: 1000 + i,
    });
  assert.equal(records.length, KEEP);
  assert.equal(records[0].message, "n" + (KEEP + 4));
  assert.equal(records[KEEP - 1].message, "n5");
});
