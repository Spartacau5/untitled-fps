// Crowned daily contest winners, newest first. The hall of fame shows the
// latest five; older rows stay here so nothing is lost when the list grows.
//
// andylol took the first two nights of the $10 contest. Later nights are
// crowned automatically from each closed day's board (see winners-core.js).

export const WINNERS = [
  {
    date: "2026-09-08",
    name: "andylol",
    score: 1073250,
    wave: 29,
  },
  {
    date: "2026-09-07",
    name: "andylol",
    score: 503150,
    wave: 17,
  },
];

export const WINNERS_SHOWN = 5;

// Newest first, capped. Pure so the menu and the tests share one cut.
export function latestWinners(list = WINNERS, limit = WINNERS_SHOWN) {
  return (Array.isArray(list) ? list : [])
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, Math.max(0, limit));
}

// "2026-09-08" → "SEP 8". Short enough for a narrow column; the year is
// implied by the contest being current.
export function formatWinnerDate(iso) {
  const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return String(iso || "");
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const month = months[Number(m[2]) - 1] || m[2];
  return `${month} ${Number(m[3])}`;
}
