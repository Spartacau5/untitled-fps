import { MIDTOWN } from "../data/midtown.js";
import { FFA } from "../sim/free-for-all.js";

export class MatchHUD {
  constructor(hud) {
    document.body.classList.add("tdm-mode", "ffa-mode");
    this.panel = document.createElement("div");
    this.panel.className = "match-panel ffa-panel";
    this.panel.innerHTML = `<div class="match-heading"><span>FREE FOR ALL</span><span data-clock>8:00</span></div><div class="ffa-summary"><b data-you>0</b><span> / ${FFA.target} KILLS</span><span data-rank></span></div><div class="match-objective" data-status></div><table class="ffa-board" aria-label="Individual match leaderboard"><thead><tr><th>#</th><th>OPERATOR</th><th>K</th><th>D</th></tr></thead><tbody>${Array.from({ length: 7 }, (_, i) => `<tr><td>${i + 1}</td><td></td><td>0</td><td>0</td></tr>`).join("")}</tbody></table>`;
    hud.el.hud.appendChild(this.panel);
    this.rows = [...this.panel.querySelectorAll("tbody tr")];
    this.labels = Object.fromEntries(
      ["clock", "you", "rank", "status"].map((key) => [
        key,
        this.panel.querySelector(`[data-${key}]`),
      ]),
    );
    this.map = document.createElement("canvas");
    this.map.width = 216;
    this.map.height = 280;
    this.map.className = "match-map";
    this.map.setAttribute(
      "aria-label",
      "Midtown map. Only your position is shown. North is up.",
    );
    hud.el.hud.appendChild(this.map);
    this.ctx = this.map.getContext("2d");
    this.nextPaint = 0;
  }
  update(world, dt) {
    this.nextPaint -= dt;
    if (this.nextPaint > 0) return;
    this.nextPaint = 0.1;
    const m = world.match,
      p = world.player,
      left = Math.ceil(m.timeLeft),
      ranked = m.leaderboard;
    this.labels.clock.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    this.labels.you.textContent = m.playerScore;
    this.labels.rank.textContent = `#${ranked.findIndex((entry) => entry.id === "blue") + 1} / 7`;
    this.labels.status.textContent = p.dead
      ? `RESPAWN ${Math.max(1, Math.ceil(FFA.respawn - world.deadT))}s`
      : m.spawnShield > 0
        ? "SPAWN PROTECTED"
        : "EVERY OPERATOR IS HOSTILE";
    for (let i = 0; i < ranked.length; i++) {
      const row = this.rows[i],
        entry = ranked[i];
      row.classList.toggle("is-you", entry.id === "blue");
      row.cells[1].textContent = entry.name;
      row.cells[2].textContent = entry.kills;
      row.cells[3].textContent = entry.deaths;
    }
    const c = this.ctx;
    c.clearRect(0, 0, 216, 280);
    c.fillStyle = "rgba(17,21,22,.82)";
    c.fillRect(0, 0, 216, 280);
    c.save();
    c.translate(108, 140);
    c.scale(3.7, 3.7);
    c.strokeStyle = "#5a615d";
    c.lineWidth = 0.25;
    for (const b of MIDTOWN.solids) {
      c.save();
      c.translate(b.x, b.z);
      c.rotate(-b.yaw);
      c.fillStyle = b.kind === "bus" ? "#8a8e7e" : "#424b4a";
      c.fillRect(-b.w / 2, -b.d / 2, b.w, b.d);
      c.strokeRect(-b.w / 2, -b.d / 2, b.w, b.d);
      c.restore();
    }
    if (!p.dead) {
      c.translate(p.pos.x, p.pos.z);
      c.rotate(-p.yaw);
      c.beginPath();
      c.moveTo(0, -1.5);
      c.lineTo(1, 1);
      c.lineTo(0, 0.6);
      c.lineTo(-1, 1);
      c.closePath();
      c.fillStyle = "#f4e5bd";
      c.fill();
    }
    c.restore();
    c.fillStyle = "#c5c7bb";
    c.font = "10px sans-serif";
    c.textAlign = "left";
    c.fillText("N ↑   MIDTOWN", 10, 15);
  }
}
