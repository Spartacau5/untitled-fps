import { MIDTOWN, TDM } from "../data/midtown.js";
export class MatchHUD {
  constructor(hud) {
    document.body.classList.add("tdm-mode");
    this.panel = document.createElement("div");
    this.panel.className = "match-panel";
    this.panel.innerHTML = `<div class="match-heading"><span>MIDTOWN CROSSING</span><span>TEAM DEATHMATCH</span></div><div class="match-score"><span class="friendly">BLUE <b data-you>0</b></span><span data-clock>8:00</span><span class="hostile"><b data-robots>0</b> RED</span></div><div class="match-progress"><i data-blue></i><i data-red></i></div><div class="match-objective" data-point></div><div class="match-next" data-next></div>`;
    hud.el.hud.appendChild(this.panel);
    this.map = document.createElement("canvas");
    this.map.width = 216;
    this.map.height = 280;
    this.map.className = "match-map";
    this.map.setAttribute(
      "aria-label",
      "Midtown map: player and allies. North is up. Enemies are not revealed.",
    );
    hud.el.hud.appendChild(this.map);
    this.ctx = this.map.getContext("2d");
    this.labels = Object.fromEntries(
      ["you", "robots", "clock", "blue", "red", "point", "next"].map((k) => [
        k,
        this.panel.querySelector(`[data-${k}]`),
      ]),
    );
    this.nextPaint = 0;
  }
  update(world, dt) {
    const m = world.match,
      p = world.player,
      l = this.labels;
    l.you.textContent = m.playerScore;
    l.robots.textContent = m.robotScore;
    const left = Math.ceil(m.timeLeft);
    l.clock.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    l.blue.style.width = `${(m.playerScore / TDM.target) * 50}%`;
    l.red.style.width = `${(m.robotScore / TDM.target) * 50}%`;
    l.point.textContent = p.dead
      ? `RESPAWNING IN ${Math.max(1, Math.ceil(TDM.respawn - world.deadT))}`
      : `FIRST TO ${TDM.target} · ${world.kills} KILLS / ${m.deaths} DEATHS`;
    l.next.textContent =
      m.spawnShield > 0
        ? "SPAWN PROTECTION"
        : "YOU + 2 ALLIES · FRIENDLY FIRE OFF";
    this.nextPaint -= dt;
    if (this.nextPaint > 0) return;
    this.nextPaint = 0.1;
    const c = this.ctx;
    c.clearRect(0, 0, 216, 280);
    c.fillStyle = "rgba(9,17,23,.88)";
    c.fillRect(0, 0, 216, 280);
    c.save();
    c.translate(108, 140);
    c.scale(3.7, 3.7);
    c.strokeStyle = "#344b56";
    c.lineWidth = 0.25;
    for (const b of MIDTOWN.solids) {
      c.save();
      c.translate(b.x, b.z);
      c.rotate(-b.yaw);
      c.fillStyle = b.kind === "bus" ? "#78908e" : "#3d4b55";
      c.fillRect(-b.w / 2, -b.d / 2, b.w, b.d);
      c.strokeRect(-b.w / 2, -b.d / 2, b.w, b.d);
      c.restore();
    }
    for (const ally of world.enemies.list) {
      if (ally.team !== "blue" || ally.state === "die") continue;
      c.beginPath();
      c.arc(ally.pos.x, ally.pos.z, 0.7, 0, Math.PI * 2);
      c.fillStyle = "#83d5ef";
      c.fill();
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
      c.fillStyle = "#fff";
      c.fill();
    }
    c.restore();
    c.fillStyle = "#b9cbd2";
    c.font = "10px sans-serif";
    c.textAlign = "left";
    c.fillText("N ↑   MIDTOWN", 10, 15);
  }
}
