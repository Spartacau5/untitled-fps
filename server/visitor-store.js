import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assignFromMap,
  clientIp,
  hashIp,
  operatorName,
  visitorCount,
} from "./visitor-core.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, ".data", "visitors.json");
const HASH_KEY = "onslaught:visitors";
const SEQ_KEY = "onslaught:visitors:seq";

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

async function fileState() {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { next: 1, byHash: {} };
    return {
      next: Math.max(1, Math.floor(Number(parsed.next) || 1)),
      byHash:
        parsed.byHash && typeof parsed.byHash === "object" ? parsed.byHash : {},
    };
  } catch {
    return { next: 1, byHash: {} };
  }
}

async function fileSet(state) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(state), "utf8");
}

async function redisAssign(ip) {
  const env = redisEnv();
  const hash = hashIp(ip);
  const got = await redisCmd(env, ["HGET", HASH_KEY, hash]);
  const existing = Number(got.result);
  if (Number.isFinite(existing) && existing > 0) {
    const len = await redisCmd(env, ["HLEN", HASH_KEY]);
    return {
      n: existing,
      name: operatorName(existing),
      visitors: Number(len.result) || 0,
    };
  }
  const inc = await redisCmd(env, ["INCR", SEQ_KEY]);
  const n = Math.max(1, Math.floor(Number(inc.result) || 1));
  const set = await redisCmd(env, ["HSETNX", HASH_KEY, hash, String(n)]);
  if (Number(set.result) === 0) {
    const again = await redisCmd(env, ["HGET", HASH_KEY, hash]);
    const won = Number(again.result);
    const len = await redisCmd(env, ["HLEN", HASH_KEY]);
    return {
      n: won,
      name: operatorName(won),
      visitors: Number(len.result) || 0,
    };
  }
  const len = await redisCmd(env, ["HLEN", HASH_KEY]);
  return { n, name: operatorName(n), visitors: Number(len.result) || 0 };
}

export async function assignVisitor(req) {
  const ip = clientIp(req?.headers || {});
  if (redisEnv()) return redisAssign(ip);
  const assigned = assignFromMap(await fileState(), ip);
  if (assigned.created) await fileSet(assigned.state);
  return {
    n: assigned.n,
    name: assigned.name,
    visitors: visitorCount(assigned.state),
  };
}
