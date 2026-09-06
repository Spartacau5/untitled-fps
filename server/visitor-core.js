import { createHash } from "node:crypto";

export function normalizeIp(raw) {
  const first = String(raw || "")
    .split(",")[0]
    .trim();
  if (!first) return "";
  return first.startsWith("::ffff:") ? first.slice(7) : first;
}

export function clientIp(headers = {}) {
  const pick = (key) => {
    const v = headers[key] ?? headers[key.toLowerCase()];
    return Array.isArray(v) ? v[0] : v;
  };
  return normalizeIp(
    pick("x-forwarded-for") ||
      pick("x-real-ip") ||
      pick("x-vercel-forwarded-for") ||
      "",
  );
}

export function hashIp(ip) {
  const n = normalizeIp(ip) || "unknown";
  return createHash("sha256").update(`onslaught:${n}`).digest("hex");
}

export function operatorName(n) {
  return `OPERATOR #${Math.floor(Number(n))}`;
}

export function visitorCount(state) {
  return Object.keys(state?.byHash || {}).length;
}

export function playerCount(state) {
  return Object.keys(state?.players || {}).length;
}

function baseState(state) {
  const prev = state && typeof state === "object" ? state : {};
  return {
    next: prev.next || 1,
    byHash: { ...(prev.byHash || {}) },
    players: { ...(prev.players || {}) },
  };
}

export function assignFromMap(state, ip) {
  const nextState = baseState(state);
  const hash = hashIp(ip);
  const existing = Number(nextState.byHash[hash]);
  if (Number.isFinite(existing) && existing > 0) {
    return {
      state: nextState,
      n: existing,
      name: operatorName(existing),
      created: false,
    };
  }
  const n = Math.max(1, Math.floor(Number(nextState.next) || 1));
  nextState.byHash[hash] = n;
  nextState.next = n + 1;
  return {
    state: nextState,
    n,
    name: operatorName(n),
    created: true,
  };
}

export function markPlayerFromMap(state, ip) {
  const nextState = baseState(state);
  const hash = hashIp(ip);
  if (nextState.players[hash]) {
    return { state: nextState, created: false };
  }
  nextState.players[hash] = 1;
  return { state: nextState, created: true };
}
