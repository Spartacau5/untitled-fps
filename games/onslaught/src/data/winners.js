// Crowned daily contest winners, newest first. The hall of fame shows the
// latest five; older rows stay here so nothing is lost when the list grows.
//
// Andylol took the first three nights of the $10 contest before the board
// switched to a clean daily reset with the progression update.

export const WINNERS = [
  {
    date: "2026-09-08",
    name: "Andylol",
    score: 57438,
    wave: 8,
  },
  {
    date: "2026-09-07",
    name: "Andylol",
    score: 40900,
    wave: 7,
  },
  {
    date: "2026-09-06",
    name: "Andylol",
    score: 28975,
    wave: 6,
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
