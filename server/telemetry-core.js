// Pure shaping and validation for gameplay telemetry. No storage, no network,
// no clock beyond the stamp applied on ingest, so every rule here is testable.
//
// Everything arrives from the client and is therefore untrusted: sizes are
// capped and keys whitelisted so one bad or hostile payload cannot blow up the
// store or smuggle fields through into the export.

export const KEEP = 5000;
export const MAX_WAVES = 80;
export const MAX_EVENT_BYTES = 24576;

const RESULTS = new Set(["dead", "quit", "abandoned", "alive"]);
const STATES = new Set(["menu", "playing", "paused", "dead", "over"]);

const text = (v, max) => String(v ?? "").slice(0, max);
const id = (v, max) => text(v, max).replace(/[^\w-]/g, "");
const int = (v, min = 0) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? Math.max(min, n) : min;
};
const dec = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n * 1000) / 1000 : 0;
};
const iso = (v) => {
  const t = Date.parse(v);
  return Number.isFinite(t) ? new Date(t).toISOString() : "";
};

function countsRow(row, keys) {
  const out = {};
  if (!row || typeof row !== "object") return out;
  for (const k of keys) out[k] = dec(row[k]);
  return out;
}

// Keeps the per-weapon and per-enemy breakdowns but bounded: only known
// numeric fields survive, and the key count is capped so a fabricated payload
// cannot carry an unbounded map.
function table(src, keys, maxKeys = 12) {
  const out = {};
  if (!src || typeof src !== "object") return out;
  for (const k of Object.keys(src).slice(0, maxKeys))
    out[id(k, 24)] = countsRow(src[k], keys);
  return out;
}

const WEAPON_KEYS = [
  "shots",
  "pellets",
  "hits",
  "headshots",
  "kills",
  "damage",
  "reloads",
  "timeHeldS",
];
const ENEMY_KEYS = ["spawned", "killed", "damageDealt", "hitsOnPlayer"];

function summary(s) {
  const src = s && typeof s === "object" ? s : {};
  const result = text(src.result, 16);
  return {
    result: RESULTS.has(result) ? result : "alive",
    wave: int(src.wave),
    score: int(src.score),
    kills: int(src.kills),
    elapsed: dec(src.elapsed),
    accuracy: dec(src.accuracy),
    damageDealt: dec(src.damageDealt),
    damageTaken: dec(src.damageTaken),
    killedBy: src.killedBy ? text(src.killedBy.kind ?? src.killedBy, 24) : "",
    pickups: countsRow(src.pickups, ["collected", "expired"]),
    weapons: table(src.weapons, WEAPON_KEYS),
    enemies: table(src.enemies, ENEMY_KEYS),
    waves: Array.isArray(src.waves)
      ? src.waves
          .slice(0, MAX_WAVES)
          .map((w) =>
            countsRow(w, ["wave", "startedS", "clearedS", "durationS"]),
          )
      : [],
  };
}

function settings(s) {
  return countsRow(s, [
    "sensitivity",
    "fov",
    "master",
    "music",
    "sfx",
    "shake",
  ]);
}

// `at` is supplied by the caller (the store passes its own clock) so this stays
// pure and a test can pin the timestamp.
export function sanitizeEvent(body, { at, visitor = "" } = {}) {
  if (!body || typeof body !== "object") throw new Error("invalid body");
  const type = text(body.type, 16);
  if (type !== "run" && type !== "session") throw new Error("invalid type");

  const base = {
    type,
    at: at || new Date().toISOString(),
    visitor: id(visitor, 64),
    sessionId: id(body.sessionId, 64),
  };

  if (type === "session") {
    const state = text(body.lastState, 16);
    return {
      ...base,
      startedAt: iso(body.startedAt),
      msOnPage: int(body.msOnPage),
      runs: int(body.runs),
      lastState: STATES.has(state) ? state : "",
      lastWave: int(body.lastWave),
    };
  }

  const r = body.record && typeof body.record === "object" ? body.record : null;
  if (!r) throw new Error("invalid record");
  return {
    ...base,
    runId: id(body.runId, 64),
    game: text(r.game, 32),
    seed: int(r.seed),
    startedAt: iso(r.startedAt),
    endedAt: iso(r.endedAt),
    settings: settings(r.settings),
    summary: summary(r.summary),
  };
}

export function insertEvent(records, event, keep = KEEP) {
  const list = Array.isArray(records) ? records.slice() : [];
  list.push(event);
  return list.length > keep ? list.slice(list.length - keep) : list;
}

// ---- export helpers ------------------------------------------------------

const RUN_COLUMNS = [
  "at",
  "visitor",
  "sessionId",
  "runId",
  "result",
  "wave",
  "score",
  "kills",
  "elapsed",
  "accuracy",
  "damageDealt",
  "damageTaken",
  "killedBy",
  "seed",
  "game",
  "sensitivity",
  "fov",
];

const SESSION_COLUMNS = [
  "at",
  "visitor",
  "sessionId",
  "startedAt",
  "msOnPage",
  "runs",
  "lastState",
  "lastWave",
];

export function runRow(ev) {
  const s = ev.summary || {};
  const st = ev.settings || {};
  return {
    at: ev.at,
    visitor: ev.visitor,
    sessionId: ev.sessionId,
    runId: ev.runId,
    result: s.result,
    wave: s.wave,
    score: s.score,
    kills: s.kills,
    elapsed: s.elapsed,
    accuracy: s.accuracy,
    damageDealt: s.damageDealt,
    damageTaken: s.damageTaken,
    killedBy: s.killedBy,
    seed: ev.seed,
    game: ev.game,
    sensitivity: st.sensitivity,
    fov: st.fov,
  };
}

export function sessionRow(ev) {
  return {
    at: ev.at,
    visitor: ev.visitor,
    sessionId: ev.sessionId,
    startedAt: ev.startedAt,
    msOnPage: ev.msOnPage,
    runs: ev.runs,
    lastState: ev.lastState,
    lastWave: ev.lastWave,
  };
}

const cell = (v) => {
  const s = v === undefined || v === null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function toCsv(rows, columns) {
  const head = columns.join(",");
  const body = rows.map((r) => columns.map((c) => cell(r[c])).join(","));
  return [head, ...body].join("\n");
}

export function exportCsv(records, type) {
  const runs = type !== "session";
  const cols = runs ? RUN_COLUMNS : SESSION_COLUMNS;
  const rows = (Array.isArray(records) ? records : [])
    .filter((e) => e && e.type === (runs ? "run" : "session"))
    .map((e) => (runs ? runRow(e) : sessionRow(e)));
  return toCsv(rows, cols);
}

// Rolls the raw event log into the numbers worth looking at first: how sticky
// the game is, and where people stop.
export function summarise(records) {
  const list = Array.isArray(records) ? records : [];
  const runs = list.filter((e) => e.type === "run");
  const sessions = list.filter((e) => e.type === "session");
  const visitors = new Set(list.map((e) => e.visitor).filter(Boolean));
  const sessionIds = new Set(list.map((e) => e.sessionId).filter(Boolean));

  const byVisitor = {};
  for (const e of list) {
    if (!e.visitor) continue;
    const v = (byVisitor[e.visitor] ||= {
      sessions: new Set(),
      runs: 0,
      ms: 0,
    });
    if (e.sessionId) v.sessions.add(e.sessionId);
    if (e.type === "run") v.runs += 1;
    if (e.type === "session") v.ms += e.msOnPage || 0;
  }
  const returning = Object.values(byVisitor).filter(
    (v) => v.sessions.size > 1,
  ).length;

  const endedOnWave = {};
  const byResult = {};
  let playtimeS = 0;
  for (const r of runs) {
    const s = r.summary || {};
    playtimeS += s.elapsed || 0;
    byResult[s.result] = (byResult[s.result] || 0) + 1;
    endedOnWave[s.wave] = (endedOnWave[s.wave] || 0) + 1;
  }

  return {
    events: list.length,
    visitors: visitors.size,
    sessions: sessionIds.size,
    runs: runs.length,
    returningVisitors: returning,
    runsPerVisitor: visitors.size
      ? Math.round((runs.length / visitors.size) * 100) / 100
      : 0,
    sessionsPerVisitor: visitors.size
      ? Math.round((sessionIds.size / visitors.size) * 100) / 100
      : 0,
    medianRunS: median(runs.map((r) => (r.summary || {}).elapsed || 0)),
    totalPlaytimeS: Math.round(playtimeS),
    totalOnPageS: Math.round(
      sessions.reduce((a, s) => a + (s.msOnPage || 0), 0) / 1000,
    ),
    byResult,
    endedOnWave,
  };
}

function median(xs) {
  const a = xs.filter((n) => Number.isFinite(n)).sort((x, y) => x - y);
  if (!a.length) return 0;
  const m = a.length >> 1;
  const v = a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  return Math.round(v * 100) / 100;
}
