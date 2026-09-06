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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, ".data", "leaderboard.json");
const KV_KEY = "onslaught:leaderboard:alltime";

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

async function redisGet() {
  const env = redisEnv();
  const data = await redisCmd(env, ["GET", KV_KEY]);
  const raw = data.result;
  if (!raw) return [];
  const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  return Array.isArray(parsed) ? parsed : [];
}

async function redisSet(records) {
  const env = redisEnv();
  await redisCmd(env, ["SET", KV_KEY, JSON.stringify(records)]);
}

async function fileGet() {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fileSet(records) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(records), "utf8");
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

export async function listTop(req) {
  const records = redisEnv() ? await redisGet() : await fileGet();
  return withVisitor(req, { backend: backend(), entries: topN(records) });
}

export async function submitRun(body, req) {
  const entry = sanitizeEntry(body);
  const load = () => (redisEnv() ? redisGet() : fileGet());
  const save = (records) => (redisEnv() ? redisSet(records) : fileSet(records));
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
