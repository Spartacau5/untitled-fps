import {
  WINNERS,
  formatWinnerDate,
  latestWinners,
} from "../data/winners.js";

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
    if (!String(input.value || "").trim()) return;
    if (isPlaceholderName(input.value)) input.value = assigned;
    savePlayerName(input.value);
    return;
  }
  if (isPlaceholderName(loadPlayerName())) savePlayerName(assigned);
}

export function audienceLine(payload) {
  const visitors = Math.max(
    0,
    Math.floor(Number(payload && payload.visitors) || 0),
  );
  const players = Math.max(
    0,
    Math.floor(Number(payload && payload.players) || 0),
  );
  const noun = (n, one, many) =>
    `${n} UNIQUE ${n === 1 ? one : many}`;
  return `<div class="lb-count"><span>${noun(visitors, "VISITOR", "VISITORS")}</span><span>${noun(players, "PLAYER", "PLAYERS")}</span></div>`;
}

export function renderBoard(el, payload, youName) {
  if (!el) return;
  const entries = (payload && payload.entries) || [];
  const foot = audienceLine(payload);
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
    <table class="lb-table"><thead><tr><th>#</th><th>NAME</th><th>SCORE</th><th></th></tr></thead><tbody>${rows}</tbody></table>${foot}`;
}

// Hall of fame for closed contest days. Newest five only; seeded winners
// cover the nights before the daily board started archiving itself.
export function renderWinners(el, list = WINNERS) {
  if (!el) return;
  const rows = latestWinners(list);
  if (!rows.length) {
    el.innerHTML =
      `<div class="lb-title">HALL OF FAME</div><div class="lb-empty">NO WINNERS YET</div>`;
    return;
  }
  const body = rows
    .map(
      (w) =>
        `<tr><td>${formatWinnerDate(w.date)}</td><td>${escapeHtml(w.name)}</td><td>${Number(w.score).toLocaleString("en-US")}</td><td>${w.wave != null ? `W${w.wave}` : ""}</td></tr>`,
    )
    .join("");
  el.innerHTML = `<div class="lb-title">HALL OF FAME</div>
    <table class="lb-table"><thead><tr><th>DAY</th><th>NAME</th><th>SCORE</th><th></th></tr></thead><tbody>${body}</tbody></table>
    <div class="lb-count"><span>LATEST ${rows.length} WINNER${rows.length === 1 ? "" : "S"}</span></div>`;
}

// Tab switcher on the contest card. Defaults to today's board; winners are
// rendered once up front so flipping tabs never waits on the network.
export function mountContestTabs(root, { winnersEl } = {}) {
  if (!root) return { setTab() {} };
  renderWinners(winnersEl);
  const setTab = (tab) => {
    const next = tab === "winners" ? "winners" : "daily";
    root.dataset.contestTab = next;
    for (const btn of root.querySelectorAll("[data-contest-tab]")) {
      if (!btn.matches("button")) continue;
      const on = btn.dataset.contestTab === next;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-selected", String(on));
    }
    const daily = root.querySelector("#contest-daily");
    const winners = root.querySelector("#contest-winners");
    if (daily) {
      daily.classList.toggle("hidden", next !== "daily");
      daily.hidden = next !== "daily";
    }
    if (winners) {
      winners.classList.toggle("hidden", next !== "winners");
      winners.hidden = next !== "winners";
    }
  };
  root.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-contest-tab]");
    if (!btn || !root.contains(btn)) return;
    setTab(btn.dataset.contestTab);
  });
  setTab(root.dataset.contestTab || "daily");
  return { setTab };
}

export async function fetchBoard() {
  const res = await fetch(API, { cache: "no-store" });
  if (!res.ok) throw new Error("board unavailable");
  return res.json();
}

export async function markPlayed() {
  const res = await fetch("/api/play", { method: "POST", cache: "no-store" });
  if (!res.ok) throw new Error("play mark failed");
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
