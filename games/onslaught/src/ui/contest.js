import { ROUND, roundEnd } from "../core/round.js";

// Daily score contest. The board resets at the same instant this clock counts
// down to - both read the shared round boundary in core/round.js, so the
// countdown a player sees and the board the server scores them on cannot drift
// apart.
export const CONTEST = {
  prize: "$10",
  zone: ROUND.zone,
  zoneLabel: ROUND.zoneLabel,
  deadlineHour: ROUND.deadlineHour,
};

export { roundEnd };

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
