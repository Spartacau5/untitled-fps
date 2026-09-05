import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { insertNote, sanitizeNote } from "./feedback-core.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, ".data", "feedback.json");
const KV_KEY = "onslaught:feedback:v1";

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

function headerToken(req) {
  const h = req?.headers || {};
  const raw =
    h["x-feedback-token"] ||
    h["X-Feedback-Token"] ||
    h["authorization"] ||
    h["Authorization"] ||
    "";
  return String(Array.isArray(raw) ? raw[0] : raw).replace(/^Bearer\s+/i, "");
}

export function canList(req) {
  if (!redisEnv()) return true;
  const expected = process.env.FEEDBACK_ADMIN_TOKEN;
  if (!expected) return false;
  const got = headerToken(req);
  return got.length > 0 && got === expected;
}

export async function listNotes(req) {
  if (!canList(req)) {
    const err = new Error("unauthorized");
    err.status = 401;
    throw err;
  }
  const records = redisEnv() ? await redisGet() : await fileGet();
  return { backend: backend(), entries: records };
}

export async function submitNote(body) {
  const entry = sanitizeNote(body);
  if (redisEnv()) {
    const records = insertNote(await redisGet(), entry);
    await redisSet(records);
    return { ok: true, backend: "redis" };
  }
  const records = insertNote(await fileGet(), entry);
  await fileSet(records);
  return { ok: true, backend: "file" };
}
