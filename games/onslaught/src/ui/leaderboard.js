const NAME_KEY = "onslaught.playerName";
const API = "/api/leaderboard";

export function isPlaceholderName(name) {
  return (
    !String(name || "").trim() ||
    /^OPERATOR(?: #\d+)?$/i.test(String(name).trim())
  );
}

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

export function applyAssignedCallsign(input, assigned) {
  if (!assigned) return;
  if (input) {
    if (isPlaceholderName(input.value)) input.value = assigned;
    savePlayerName(input.value);
    return;
  }
  if (isPlaceholderName(loadPlayerName())) savePlayerName(assigned);
}

function visitorLine(payload) {
  const n = Math.floor(Number(payload && payload.visitors) || 0);
  if (n <= 0) return "";
  return `<div class="lb-count">${n} UNIQUE OPERATOR${n === 1 ? "" : "S"}</div>`;
}

export function renderBoard(el, payload, youName) {
  if (!el) return;
  const entries = (payload && payload.entries) || [];
  const foot = visitorLine(payload);
  if (!entries.length) {
    el.innerHTML =
      `<div class="lb-title">TOP OPERATORS</div><div class="lb-empty">NO RUNS RECORDED</div>${foot}`;
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
    <table class="lb-table"><thead><tr><th>#</th><th>CALLSIGN</th><th>SCORE</th><th></th></tr></thead><tbody>${rows}</tbody></table>${foot}`;
}

export async function fetchBoard() {
  const res = await fetch(API, { cache: "no-store" });
  if (!res.ok) throw new Error("board unavailable");
  return res.json();
}

export async function submitRun(entry, opts = {}) {
  const body = JSON.stringify(entry);
  const keepalive = !!opts.keepalive;
  if (keepalive && typeof navigator !== "undefined" && navigator.sendBeacon) {
    try {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(API, blob)) return { ok: true };
    } catch {
      /* fall through */
    }
  }
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive,
  });
  if (keepalive) {
    return { ok: res.ok };
  }
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
