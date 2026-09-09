// Pure hall-of-fame rules. The store loads boards and persists; this file
// only decides who gets crowned and how the seed and live crowns merge.

export function sanitizeWinner(raw) {
  if (!raw || typeof raw !== "object") return null;
  const date = String(raw.date || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const score = Math.floor(Number(raw.score));
  const wave = Math.floor(Number(raw.wave));
  const name = String(raw.name || "")
    .trim()
    .slice(0, 16);
  if (!name || !Number.isFinite(score) || score < 0) return null;
  return {
    date,
    name,
    score,
    wave: Number.isFinite(wave) && wave >= 0 ? wave : 0,
  };
}

// Seed nights are authoritative (founding winners). Live crowns fill every
// other closed day. Newest first.
export function mergeHall(seed, crowned) {
  const byDate = new Map();
  for (const raw of Array.isArray(crowned) ? crowned : []) {
    const w = sanitizeWinner(raw);
    if (w) byDate.set(w.date, w);
  }
  for (const raw of Array.isArray(seed) ? seed : []) {
    const w = sanitizeWinner(raw);
    if (w) byDate.set(w.date, w);
  }
  return [...byDate.values()].sort((a, b) => b.date.localeCompare(a.date));
}

// Top of a closed day's board, or null when nobody played.
export function crownFromBoard(records, date) {
  const list = Array.isArray(records) ? records : [];
  if (!list.length || !date) return null;
  const top = list.slice().sort(
    (a, b) =>
      (b.score || 0) - (a.score || 0) ||
      (b.kills || 0) - (a.kills || 0) ||
      (a.at || 0) - (b.at || 0),
  )[0];
  return sanitizeWinner({
    date,
    name: top.name,
    score: top.score,
    wave: top.wave,
  });
}

// Append the previous round's #1 once that round has closed and is not yet
// in the hall. Empty days stay empty — no phantom winners.
export function ensureCrowned(winners, { prevKey, prevBoard, currentKey }) {
  const hall = Array.isArray(winners) ? winners.slice() : [];
  if (!prevKey || prevKey === currentKey) return { winners: hall, crowned: null };
  if (hall.some((w) => w && w.date === prevKey))
    return { winners: hall, crowned: null };
  const entry = crownFromBoard(prevBoard, prevKey);
  if (!entry) return { winners: hall, crowned: null };
  return {
    winners: mergeHall(
      [],
      [entry, ...hall.filter((w) => w.date !== prevKey)],
    ),
    crowned: entry,
  };
}
