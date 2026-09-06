// Daily beta-test score contest. The board resets at 9PM ET every night, so
// the window is derived from the clock rather than hard-coded: there is always
// exactly one live round and it always ends at the next 9PM ET.
//
// The deadline is a wall-clock time in one fixed zone, which means the real
// instant it lands on moves by an hour across a DST boundary. That is the
// intent — 9PM in New York stays 9PM in New York — so the offset is resolved
// per-instant through Intl instead of being frozen at UTC-4.
export const CONTEST = {
  prize: "$10",
  zone: "America/New_York",
  zoneLabel: "9PM ET",
  deadlineHour: 21,
};

const partsOf = new Intl.DateTimeFormat("en-US", {
  timeZone: CONTEST.zone,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// The contest zone's wall-clock reading of an instant, as a plain object.
function zoneParts(ms) {
  const out = {};
  for (const p of partsOf.formatToParts(new Date(ms)))
    if (p.type !== "literal") out[p.type] = Number(p.value);
  // Intl renders midnight as hour 24 in some engines; normalise to 0.
  if (out.hour === 24) out.hour = 0;
  return out;
}

// Offset of the contest zone at a given instant, in ms (EDT -> -4h).
function zoneOffset(ms) {
  const p = zoneParts(ms);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - ms;
}

// Inverse of zoneParts: the instant at which the zone's wall clock reads the
// given date and hour. Resolved twice because the offset itself depends on the
// answer, which only matters within an hour of a DST change.
function zoneWallToMs(year, month, day, hour) {
  const naive = Date.UTC(year, month - 1, day, hour);
  let ms = naive - zoneOffset(naive);
  ms = naive - zoneOffset(ms);
  return ms;
}

// End of the round `nowMs` falls in: today's 9PM ET, or tomorrow's if tonight's
// has already passed.
export function roundEnd(nowMs, contest = CONTEST) {
  const p = zoneParts(nowMs);
  let end = zoneWallToMs(p.year, p.month, p.day, contest.deadlineHour);
  if (end <= nowMs)
    end = zoneWallToMs(p.year, p.month, p.day + 1, contest.deadlineHour);
  return end;
}

function pad(n) {
  return n < 10 ? `0${n}` : String(n);
}

// Coarse at a distance, precise near the end: nobody needs seconds twenty
// hours out, and everybody wants them in the last minute.
export function formatRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}H ${pad(m)}M`;
  if (m > 0) return `${m}M ${pad(s)}S`;
  return `${s}S`;
}

// Pure apart from the zone table: takes the clock as an argument so it is
// testable and has no ambient dependency on the host's time.
export function contestState(nowMs, contest = CONTEST) {
  const endMs = roundEnd(nowMs, contest);
  const remainingMs = Math.max(0, endMs - nowMs);
  return {
    endMs,
    remainingMs,
    label: `ENDS IN ${formatRemaining(remainingMs)}`,
  };
}
