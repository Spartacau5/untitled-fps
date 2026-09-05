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

export function assignFromMap(state, ip) {
  const prev = state && typeof state === "object" ? state : { next: 1, byHash: {} };
  const byHash = { ...(prev.byHash || {}) };
  const hash = hashIp(ip);
  const existing = Number(byHash[hash]);
  if (Number.isFinite(existing) && existing > 0) {
    return {
      state: { next: prev.next || 1, byHash },
      n: existing,
      name: operatorName(existing),
      created: false,
    };
  }
  const n = Math.max(1, Math.floor(Number(prev.next) || 1));
  byHash[hash] = n;
  return {
    state: { next: n + 1, byHash },
    n,
    name: operatorName(n),
    created: true,
  };
}
