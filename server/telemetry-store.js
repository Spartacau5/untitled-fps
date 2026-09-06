import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  KEEP,
  MAX_EVENT_BYTES,
  exportCsv,
  insertEvent,
  sanitizeEvent,
  summarise,
} from "./telemetry-core.js";
import { clientIp, hashIp } from "./visitor-core.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, ".data", "telemetry.json");
const KV_KEY = "onslaught:telemetry:v1";

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

// A Redis LIST, appended with RPUSH, rather than a JSON blob read back and
// rewritten. Two beacons fire together on pagehide - the abandoned run and the
// session summary - and a read-modify-write loses one of them to the race.
// RPUSH is atomic, so concurrent writers cannot clobber each other.
async function redisList() {
  const data = await redisCmd(redisEnv(), ["LRANGE", KV_KEY, 0, -1]);
  const raw = Array.isArray(data.result) ? data.result : [];
  const out = [];
  for (const item of raw) {
    try {
      out.push(typeof item === "string" ? JSON.parse(item) : item);
    } catch {
      /* skip a corrupt row rather than failing the whole export */
    }
  }
  return out;
}

async function redisAppend(event) {
  const env = redisEnv();
  await redisCmd(env, ["RPUSH", KV_KEY, JSON.stringify(event)]);
  await redisCmd(env, ["LTRIM", KV_KEY, -KEEP, -1]);
}

async function fileGet() {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function fileSet(records) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(records), "utf8");
}

// The file backend still has to read-modify-write, so appends are chained
// through one promise to keep concurrent requests from overwriting each other.
let fileQueue = Promise.resolve();
function fileAppend(event) {
  fileQueue = fileQueue.then(async () => {
    await fileSet(insertEvent(await fileGet(), event));
  });
  return fileQueue;
}

export function backend() {
  return redisEnv() ? "redis" : "file";
}

function headerToken(req) {
  const h = req?.headers || {};
  const direct = h["x-telemetry-token"] || h["x-feedback-token"] || "";
  const auth = String(h.authorization || h.Authorization || "");
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return String(direct || bearer).trim();
}

// Read access is gated the same way the feedback inbox is: without a token
// configured the export stays shut rather than defaulting open. This log is
// per-player behaviour and should never be world-readable.
function canRead(req) {
  const expected =
    process.env.TELEMETRY_ADMIN_TOKEN || process.env.FEEDBACK_ADMIN_TOKEN;
  if (!expected) return false;
  const got = headerToken(req);
  return got.length > 0 && got === expected;
}

function unauthorized() {
  const err = new Error("unauthorized");
  err.status = 401;
  return err;
}

// Players are identified by a salted hash of their IP, never the address
// itself, so the log can answer "same person?" without storing who they are.
export async function recordEvent(body, req) {
  const raw = JSON.stringify(body ?? {});
  if (raw.length > MAX_EVENT_BYTES) throw new Error("invalid payload size");
  const event = sanitizeEvent(body, {
    at: new Date().toISOString(),
    visitor: hashIp(clientIp(req?.headers || {})).slice(0, 16),
  });
  await (redisEnv() ? redisAppend(event) : fileAppend(event));
  return { ok: true };
}

export async function listEvents(req) {
  if (!canRead(req)) throw unauthorized();
  const records = redisEnv() ? await redisList() : await fileGet();
  return {
    backend: backend(),
    count: records.length,
    stats: summarise(records),
    events: records,
  };
}

export async function statsOnly(req) {
  if (!canRead(req)) throw unauthorized();
  const records = redisEnv() ? await redisList() : await fileGet();
  return {
    backend: backend(),
    count: records.length,
    stats: summarise(records),
  };
}

export async function exportEvents(req, type) {
  if (!canRead(req)) throw unauthorized();
  const records = redisEnv() ? await redisList() : await fileGet();
  return exportCsv(records, type);
}
