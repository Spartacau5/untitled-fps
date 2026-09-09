import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  insertRun,
  sanitizeEntry,
  shouldRecordRun,
  topN,
} from "./leaderboard-core.js";
import { assignVisitor } from "./visitor-store.js";
import { roundKey } from "../games/onslaught/src/core/round.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, ".data", "leaderboard.json");
// One key per round rather than one standing board. A new round reads a key
// that does not exist yet, so the leaderboard resets itself at the deadline
// with no cron to run and nothing to delete - and the previous day's board is
// still there under its own key if you want to look up who won.
const KV_PREFIX = "onslaught:leaderboard:";
// Rounds are kept for a fortnight, then expire on their own.
const ROUND_TTL_S = 14 * 24 * 60 * 60;
const kvKey = (at) => KV_PREFIX + roundKey(at);

function redisEnv() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

async function redisCmd(env, command) {
  const res = await fetch(env.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return res.json();
}

async function redisGet(at) {
  const env = redisEnv();
  const data = await redisCmd(env, ["GET", kvKey(at)]);
  const raw = data.result;
  if (!raw) return [];
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return Array.isArray(parsed) ? parsed : [];
}

async function redisSet(records, at) {
  const env = redisEnv();
  await redisCmd(env, [
    "SET",
    kvKey(at),
    JSON.stringify(records),
    "EX",
    String(ROUND_TTL_S),
  ]);
}

// The dev file store keeps the same shape as Redis - a map of round id to
// board - so local play resets on the deadline exactly like production rather
// than behaving differently from the thing it stands in for.
async function fileAll() {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    if (Array.isArray(parsed)) return {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function fileGet(at) {
  const all = await fileAll();
  const rows = all[roundKey(at)];
  return Array.isArray(rows) ? rows : [];
}

async function fileSet(records, at) {
  const all = await fileAll();
  all[roundKey(at)] = records;
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(all), "utf8");
}

export function backend() {
  return redisEnv() ? "redis" : "file";
}

async function withVisitor(req, payload) {
  try {
    const visitor = await assignVisitor(req);
    return {
      ...payload,
      callsign: visitor.name,
      visitors: visitor.visitors,
      players: visitor.players || 0,
    };
  } catch {
    return { ...payload, callsign: "", visitors: 0, players: 0 };
  }
}

export async function listTop(req, at = Date.now()) {
  const records = redisEnv() ? await redisGet(at) : await fileGet(at);
  return withVisitor(req, {
    backend: backend(),
    entries: topN(records),
    round: roundKey(at),
  });
}

export async function submitRun(body, req, at = Date.now()) {
  const entry = sanitizeEntry(body);
  const load = () => (redisEnv() ? redisGet(at) : fileGet(at));
  const save = (records) =>
    redisEnv() ? redisSet(records, at) : fileSet(records, at);
  let records = await load();
  if (shouldRecordRun(entry)) {
    records = insertRun(records, entry);
    await save(records);
  }
  return withVisitor(req, {
    backend: backend(),
    entries: topN(records),
    you: entry,
  });
}
