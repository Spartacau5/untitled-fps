export const TOP_N = 5;
export const KEEP = 50;
export const MAX_SCORE = 10_000_000;

export function sanitizeName(raw) {
  const s = String(raw ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 16)
    .replace(/[^\w \-]/g, "");
  return s || "OPERATOR";
}

export function sanitizeEntry(body) {
  if (!body || typeof body !== "object") throw new Error("invalid body");
  const score = Math.floor(Number(body.score));
  const kills = Math.floor(Number(body.kills));
  const wave = Math.floor(Number(body.wave));
  const elapsed = Math.floor(Number(body.elapsed));
  const seed = Math.floor(Number(body.seed));
  const check = (n, label) => {
    if (!Number.isFinite(n) || n < 0) throw new Error(`invalid ${label}`);
  };
  check(score, "score");
  check(kills, "kills");
  check(wave, "wave");
  check(elapsed, "elapsed");
  if (!Number.isFinite(seed)) throw new Error("invalid seed");
  if (score > MAX_SCORE) throw new Error("invalid score");
  return {
    name: sanitizeName(body.name),
    score,
    kills,
    wave,
    elapsed,
    seed,
    at: Date.now(),
  };
}

export function insertRun(records, entry) {
  const list = Array.isArray(records) ? records.slice() : [];
  list.push(entry);
  list.sort((a, b) => b.score - a.score || b.kills - a.kills || a.at - b.at);
  return list.slice(0, KEEP);
}

export function topN(records, n = TOP_N) {
  return (Array.isArray(records) ? records : []).slice(0, n).map((r, i) => ({
    rank: i + 1,
    name: r.name,
    score: r.score,
    kills: r.kills,
    wave: r.wave,
    elapsed: r.elapsed,
    seed: r.seed,
  }));
}
