// The daily round boundary, shared by the client clock and the server's
// leaderboard so the countdown a player sees and the board they are scored on
// can never disagree.
//
// The deadline is a wall-clock time in one fixed zone. The real instant it
// lands on therefore moves by an hour across a DST change, which is the intent:
// 9PM in New York stays 9PM in New York. The offset is resolved per-instant
// through Intl rather than frozen at UTC-4.
//
// Pure: every entry point takes the clock as an argument, so it is testable and
// has no ambient dependency on the host's time.
export const ROUND = {
  zone: "America/New_York",
  zoneLabel: "9PM ET",
  deadlineHour: 21,
};

const partsOf = new Intl.DateTimeFormat("en-US", {
  timeZone: ROUND.zone,
  hour12: false,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

// The zone's wall-clock reading of an instant, as a plain object.
function zoneParts(ms) {
  const out = {};
  for (const p of partsOf.formatToParts(new Date(ms)))
    if (p.type !== "literal") out[p.type] = Number(p.value);
  // Intl renders midnight as hour 24 in some engines; normalise to 0.
  if (out.hour === 24) out.hour = 0;
  return out;
}

// Offset of the zone at a given instant, in ms (EDT -> -4h).
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

// End of the round `nowMs` falls in: today's deadline, or tomorrow's if
// today's has already passed.
export function roundEnd(nowMs, round = ROUND) {
  const p = zoneParts(nowMs);
  let end = zoneWallToMs(p.year, p.month, p.day, round.deadlineHour);
  if (end <= nowMs)
    end = zoneWallToMs(p.year, p.month, p.day + 1, round.deadlineHour);
  return end;
}

// Stable id for the round an instant belongs to, as the local date the round
// closes on: "2026-09-09". The leaderboard is stored under this, so a new round
// simply reads an empty key and the board resets itself with no job to run and
// nothing to delete.
export function roundKey(nowMs, round = ROUND) {
  const p = zoneParts(roundEnd(nowMs, round) - 1000);
  const mm = String(p.month).padStart(2, "0");
  const dd = String(p.day).padStart(2, "0");
  return `${p.year}-${mm}-${dd}`;
}
