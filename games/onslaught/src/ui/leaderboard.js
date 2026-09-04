const NAME_KEY = "onslaught.playerName";
const API = "/api/leaderboard";

export function loadPlayerName() {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function savePlayerName(name) {
  const n = String(name || "")
    .trim()
    .slice(0, 16);
  try {
    localStorage.setItem(NAME_KEY, n);
  } catch {
    /* private mode */
  }
  return n;
}

export function renderBoard(el, payload, youName) {
  if (!el) return;
  const entries = (payload && payload.entries) || [];
  if (!entries.length) {
    el.innerHTML =
      '<div class="lb-title">TOP OPERATORS</div><div class="lb-empty">NO RUNS RECORDED</div>';
    return;
  }
  const rows = entries
    .map((r) => {
      const you =
        youName && r.name.toLowerCase() === youName.toLowerCase() ? " you" : "";
      return `<tr class="${you}"><td>${r.rank}</td><td>${escapeHtml(r.name)}</td><td>${r.score.toLocaleString("en-US")}</td><td>W${r.wave}</td></tr>`;
    })
    .join("");
  el.innerHTML = `<div class="lb-title">TOP OPERATORS</div>
    <table class="lb-table"><thead><tr><th>#</th><th>CALLSIGN</th><th>SCORE</th><th></th></tr></thead><tbody>${rows}</tbody></table>`;
}

export async function fetchBoard() {
  const res = await fetch(API, { cache: "no-store" });
  if (!res.ok) throw new Error("board unavailable");
  return res.json();
}

export async function submitRun(entry) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "submit failed");
  return data;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
