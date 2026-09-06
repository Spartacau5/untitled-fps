import { contestState } from "./contest.js";
import { theme } from "../theme/theme.js";

export class HUD {
  constructor() {
    const t = (e) => document.getElementById(e);
    ((this.el = {
      hud: t("hud"),
      crosshair: t("crosshair"),
      hitmarker: t("hitmarker"),
      dmg: t("dmg-indicators"),
      hpFill: t("hp-fill"),
      wave: t("st-wave"),
      enemies: t("st-enemies"),
      kills: t("st-kills"),
      wpnName: t("wpn-name"),
      ammoMag: t("ammo-mag"),
      ammoRes: t("ammo-res"),
      slots: [t("slot-1"), t("slot-2"), t("slot-3")],
      fireMode: t("fire-mode"),
      score: t("score"),
      feed: t("feed"),
      banner: t("banner"),
      bannerMain: t("banner-main"),
      bannerSub: t("banner-sub"),
      hint: t("hint"),
      popups: t("popups"),
      lowhp: t("lowhp"),
      menu: t("menu"),
      btnStart: t("btn-start"),
      pauseActions: t("pause-actions"),
      btnRestart: t("btn-restart"),
      btnExitMenu: t("btn-exit-menu"),
      btnSettings: t("btn-settings"),
      settings: t("settings"),
      settingsRows: t("settings-rows"),
      settingsBack: t("btn-settings-back"),
      settingsReset: t("btn-settings-reset"),
      btnControls: t("btn-controls"),
      controlsPanel: t("controls-panel"),
      controlsBody: t("controls-body"),
      controlsBack: t("btn-controls-back"),
      menuMain: t("menu-main"),
      menuStats: t("menu-stats"),
      runSummary: t("run-summary"),
      runActions: t("run-actions"),
      btnDlRun: t("btn-dl-run"),
      btnDlAll: t("btn-dl-all"),
      playerName: t("player-name"),
      prize: t("prize"),
      prizeClock: t("prize-clock"),
      leaderboard: t("leaderboard"),
      title: document.querySelector(".title"),
      subtitle: document.querySelector(".subtitle"),
    }),
      (this.cache = {}),
      (this.hmT = 0),
      (this.hmOpacity = 0),
      (this.bannerT = 0),
      (this.hintT = 0),
      (this.w = window.innerWidth),
      (this.h = window.innerHeight),
      window.addEventListener("resize", () => {
        ((this.w = window.innerWidth), (this.h = window.innerHeight));
      }));
  }
  _set(t, e, n) {
    this.cache[t] !== n && ((this.cache[t] = n), (e.textContent = n));
  }
  show(t) {
    this.el.hud.classList.toggle("hidden", !t);
  }
  setPauseActions(t) {
    this.el.pauseActions && this.el.pauseActions.classList.toggle("hidden", !t);
  }
  // Prize bar lives in the shared menu shell, so the same element serves the
  // main menu and the game-over screen without a second copy to maintain.
  setContest(nowMs) {
    const el = this.el.prize;
    if (!el) return;
    (el.classList.remove("hidden"),
      this._set("prizeClock", this.el.prizeClock, contestState(nowMs).label));
  }
  showMenu(
    t,
    e = theme.strings.title,
    n = theme.strings.deploy,
    s = null,
    r = theme.strings.subtitle,
  ) {
    (this.setPauseActions(false),
      this.el.runSummary && this.el.runSummary.classList.add("hidden"),
      this.el.runActions && this.el.runActions.classList.add("hidden"),
      this.el.menu.classList.toggle("hidden", !t),
      t &&
        ((this.el.title.textContent = e),
        (this.el.btnStart.textContent = n),
        (this.el.subtitle.textContent = r),
        s
          ? ((this.el.menuStats.innerHTML = s),
            this.el.menuStats.classList.remove("hidden"))
          : this.el.menuStats.classList.add("hidden")));
  }
  runSummary(record) {
    const s = record.summary,
      pct = (x) => Math.round(x * 100) + "%",
      secs = (x) => (x == null ? "—" : x.toFixed(0) + "s");
    const weapons = Object.entries(s.weapons)
      .filter(([, w]) => w.shots > 0)
      .map(
        ([k, w]) =>
          `<tr><td>${k.toUpperCase()}</td><td>${pct(w.pellets ? w.hits / w.pellets : 0)}</td><td>${w.kills}</td><td>${secs(w.timeHeldS)}</td></tr>`,
      )
      .join("");
    const enemies = Object.entries(s.enemies)
      .filter(([, e]) => e.spawned > 0)
      .map(
        ([k, e]) =>
          `<tr><td>${k.toUpperCase()}</td><td>${e.killed}/${e.spawned}</td><td>${Math.round(e.damageDealt)}</td></tr>`,
      )
      .join("");
    const waves = s.waves
      .map(
        (w) =>
          `<tr><td>W${w.wave}</td><td>${w.count}</td><td>${secs(w.durationS)}</td></tr>`,
      )
      .join("");
    this.el.runSummary.innerHTML = `
    <div class="rs-head">ACCURACY ${pct(s.accuracy)} · HEADSHOTS ${pct(s.headshotRate)} · DAMAGE TAKEN ${Math.round(s.damageTaken)}${s.killedBy ? ` · KILLED BY ${s.killedBy.kind.toUpperCase()}` : ""}</div>
    <div class="rs-grid">
      <table><thead><tr><th>WEAPON</th><th>ACC</th><th>KILLS</th><th>HELD</th></tr></thead><tbody>${weapons}</tbody></table>
      <table><thead><tr><th>HOSTILE</th><th>KILLED</th><th>DMG TO YOU</th></tr></thead><tbody>${enemies}</tbody></table>
      <table><thead><tr><th>WAVE</th><th>COUNT</th><th>TIME</th></tr></thead><tbody>${waves}</tbody></table>
    </div>`;
    (this.el.runSummary.classList.remove("hidden"),
      this.el.runActions.classList.remove("hidden"));
  }
  setCrosshair(t, e) {
    const n = t.toFixed(1) + "px";
    this.cache.gap !== n &&
      ((this.cache.gap = n), this.el.crosshair.style.setProperty("--gap", n));
    const s = e ? "1" : "0";
    this.cache.chv !== s &&
      ((this.cache.chv = s), (this.el.crosshair.style.opacity = s));
  }
  hitmarker(t) {
    const e = this.el.hitmarker;
    ((e.className = "hitmarker " + t),
      (this.hmOpacity = 1),
      (e.style.opacity = "1"),
      (this.hmT = t === "hit" ? 0.1 : 0.2),
      (e.style.transform = t === "hit" ? "scale(1)" : "scale(1.4)"));
  }
  setAmmo(t, e, n) {
    (this._set("mag", this.el.ammoMag, String(t)),
      this._set("res", this.el.ammoRes, String(e)));
    const s =
      "ammo-mag" +
      (t === 0
        ? " empty"
        : t <= Math.max(1, Math.floor(n * 0.25))
          ? " low"
          : "");
    this.cache.magCls !== s &&
      ((this.cache.magCls = s), (this.el.ammoMag.className = s));
  }
  setWeapon(t, e, n) {
    (this._set("wname", this.el.wpnName, t),
      this._set("wmode", this.el.fireMode, e),
      this.el.slots.forEach((s, r) => s.classList.toggle("active", r === n)));
  }
  setHealth(t, e) {
    const n = Math.max(0, Math.min(1, t / e)),
      s = (n * 100).toFixed(1) + "%";
    this.cache.hp !== s &&
      ((this.cache.hp = s),
      (this.el.hpFill.style.width = s),
      this.el.hpFill.classList.toggle("low", n < 0.35),
      (this.el.lowhp.style.opacity =
        n < 0.5 ? String((1 - n * 2) * 0.85) : "0"));
  }
  setStats(t, e, n, s) {
    (this._set("wave", this.el.wave, String(t)),
      this._set("en", this.el.enemies, String(e)),
      this._set("kills", this.el.kills, String(n)),
      this._set("score", this.el.score, s.toLocaleString("en-US")));
  }
  banner(t, e, n, s = !1) {
    ((this.el.bannerMain.textContent = t),
      (this.el.bannerSub.textContent = e),
      this.el.bannerMain.classList.toggle("danger", s),
      this.el.banner.classList.add("show"),
      (this.bannerT = n));
  }
  hint(t, e = !1, n = 2) {
    ((this.el.hint.textContent = t),
      this.el.hint.classList.toggle("warn", e),
      this.el.hint.classList.add("show"),
      (this.hintT = n));
  }
  popup(t, e, n, s = "") {
    const r = document.createElement("div");
    ((r.className = "popup " + s),
      (r.textContent = t),
      (r.style.left = e - this.w / 2 + "px"),
      (r.style.top = n - this.h / 2 + "px"),
      this.el.popups.appendChild(r),
      setTimeout(() => r.remove(), 950));
  }
  feed(t, e = "") {
    const n = document.createElement("div");
    for (
      n.className = "feed-item " + e,
        n.textContent = t,
        this.el.feed.prepend(n);
      this.el.feed.children.length > 6;
    )
      this.el.feed.lastChild.remove();
    setTimeout(() => {
      ((n.style.transition = "opacity 0.5s"),
        (n.style.opacity = "0"),
        setTimeout(() => n.remove(), 500));
    }, 3500);
  }
  damageFrom(t) {
    const e = document.createElement("div");
    ((e.className = "dmg-ind"),
      (e.style.transform = `rotate(${t}rad)`),
      this.el.dmg.appendChild(e),
      setTimeout(() => {
        ((e.style.transition = "opacity 0.4s"),
          (e.style.opacity = "0"),
          setTimeout(() => e.remove(), 400));
      }, 500));
  }
  update(t) {
    (this.hmT > 0
      ? (this.hmT -= t)
      : this.hmOpacity > 0 &&
        ((this.hmOpacity = Math.max(0, this.hmOpacity - t * 7)),
        (this.el.hitmarker.style.opacity = String(this.hmOpacity))),
      this.bannerT > 0 &&
        ((this.bannerT -= t),
        this.bannerT <= 0 && this.el.banner.classList.remove("show")),
      this.hintT > 0 &&
        ((this.hintT -= t),
        this.hintT <= 0 && this.el.hint.classList.remove("show")));
  }
}
