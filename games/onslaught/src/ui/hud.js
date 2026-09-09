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
      slotRow: t("wpn-slots"),
      slots: [],
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
      settingsNote: t("settings-note"),
      settingsBack: t("btn-settings-back"),
      settingsReset: t("btn-settings-reset"),
      btnArmory: t("btn-armory"),
      armoryPanel: t("armory-panel"),
      armoryBody: t("armory-body"),
      armoryBack: t("btn-armory-back"),
      loadoutCards: t("loadout-cards"),
      loadoutNext: t("loadout-next"),
      rank: t("rank"),
      rankLevel: t("rank-level"),
      rankFill: t("rank-fill"),
      rankXp: t("rank-xp"),
      rankNext: t("rank-next"),
      xpAward: t("xp-award"),
      btnRunDetails: t("btn-run-details"),
      runDetails: t("run-details"),
      menuGrid: t("menu-grid"),
      btnControls: t("btn-controls"),
      controlsPanel: t("controls-panel"),
      controlsBody: t("controls-body"),
      controlsBack: t("btn-controls-back"),
      controlsSummary: t("controls-summary"),
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
    // Sniper optic. The reticle is drawn twice - a soft light halo beneath a
    // dark core - so it stays readable against bright pavement and dark
    // interiors alike; a single dark hairline vanishes on either.
    this.scope = document.createElement("div");
    this.scope.className = "scope-overlay hidden";
    this.scope.setAttribute("aria-hidden", "true");
    this.scope.innerHTML = `<div class="scope-aperture"><svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"><g fill="none" stroke="#e8f0ef" stroke-opacity=".34" stroke-linecap="round"><path d="M200 54V184 M200 216V346 M54 200H184 M216 200H346 M100 195v10 M140 197v6 M260 197v6 M300 195v10 M195 100h10 M197 140h6 M197 260h6 M195 300h10" stroke-width="3.2"/><path d="M200 0V54 M200 346V400 M0 200H54 M346 200H400" stroke-width="7.5"/></g><g fill="none" stroke="#080c0c" stroke-linecap="round"><path d="M200 54V184 M200 216V346 M54 200H184 M216 200H346 M100 195v10 M140 197v6 M260 197v6 M300 195v10 M195 100h10 M197 140h6 M197 260h6 M195 300h10" stroke-width="1.15"/><path d="M200 0V54 M200 346V400 M0 200H54 M346 200H400" stroke-width="5"/></g><circle cx="200" cy="200" r="1.7" fill="#d8402f"/></svg></div>`;
    this.el.hud.prepend(this.scope);
    this._scopeT = 0;
    // The debrief's stat tables sit behind one button. The result and the
    // reward are what a player wants to see; the tables are for the ones who
    // want to know why.
    this.el.btnRunDetails &&
      this.el.btnRunDetails.addEventListener("click", () => {
        const open = this.el.runDetails.classList.toggle("hidden");
        this.el.btnRunDetails.setAttribute("aria-expanded", String(!open));
        this.el.btnRunDetails.textContent = open
          ? "RUN DETAILS"
          : "HIDE DETAILS";
      });
  }
  // Which of the three menu layouts the shell is showing. CSS reads it.
  setMenuMode(mode) {
    this.el.menu && (this.el.menu.dataset.mode = mode);
  }
  // The always-on progression strip. Called on load and whenever the profile
  // changes; the fill animates in CSS so a run's XP is seen landing, and a
  // level crossed gets a flash the player will catch in the corner of an eye.
  setRank(progression, { levelUp = false } = {}) {
    const el = this.el;
    if (!el.rank) return;
    const p = progression.levelProgress,
      next = progression.nextUnlock();
    (this._set("rankLevel", el.rankLevel, `LEVEL ${progression.level}`),
      this._set(
        "rankXp",
        el.rankXp,
        p.span ? `${p.into} / ${p.span} XP` : "MAX LEVEL",
      ),
      this._set(
        "rankNext",
        el.rankNext,
        next
          ? `NEXT · ${next.kind === "band" ? `${next.label} ON KEY ${next.key}` : next.label} · LEVEL ${next.level}`
          : "ROSTER COMPLETE",
      ));
    const w = (Math.max(0, Math.min(1, p.frac)) * 100).toFixed(1) + "%";
    this.cache.rankW !== w &&
      ((this.cache.rankW = w), (el.rankFill.style.width = w));
    if (levelUp) {
      el.rank.classList.remove("is-up");
      void el.rank.offsetWidth;
      el.rank.classList.add("is-up");
    }
  }
  showRank(t) {
    this.el.rank && this.el.rank.classList.toggle("hidden", !t);
  }
  // The debrief's reward block: what the run earned, and anything it opened.
  xpAward(award, unlocks = []) {
    const el = this.el.xpAward;
    if (!el) return;
    if (!award) {
      el.classList.add("hidden");
      return;
    }
    const rows = unlocks
      .map(
        (r) =>
          `<div class="award-unlock"><b>UNLOCKED</b> ${r.label}${
            r.kind === "band" ? ` · KEY ${r.key}` : ` · ${r.klass}`
          }</div>`,
      )
      .join("");
    el.innerHTML =
      `<div class="award-xp">+${award.gained.toLocaleString("en-US")} XP</div>` +
      (award.levelsGained > 0
        ? `<div class="award-level">LEVEL ${award.level - award.levelsGained} <i>→</i> LEVEL ${award.level}</div>`
        : "") +
      rows;
    el.classList.toggle("is-up", award.levelsGained > 0);
    el.classList.remove("hidden");
  }
  // Continuous, not a toggle: the caller passes how far the optic has taken
  // over and the CSS reads it as a custom property, so the glass irises in with
  // the rifle instead of appearing in one frame.
  setScope(amount) {
    const t = Math.max(0, Math.min(1, amount || 0));
    if (this._scopeT === t) return;
    this._scopeT = t;
    (this.scope.style.setProperty("--scope", t.toFixed(3)),
      this.scope.classList.toggle("hidden", t <= 0.001));
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
      this.el.runDetails && this.el.runDetails.classList.add("hidden"),
      this.el.btnRunDetails &&
        (this.el.btnRunDetails.classList.add("hidden"),
        (this.el.btnRunDetails.textContent = "RUN DETAILS"),
        this.el.btnRunDetails.setAttribute("aria-expanded", "false")),
      this.xpAward(null),
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
      this.el.runActions.classList.remove("hidden"),
      this.el.btnRunDetails && this.el.btnRunDetails.classList.remove("hidden"));
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
  // One pip per carried weapon, rebuilt when the loadout changes rather than
  // fixed in markup, so the row always matches what the number keys do.
  setSlots(count) {
    if (!this.el.slotRow || this.el.slots.length === count) return;
    this.el.slotRow.innerHTML = "";
    this.el.slots = [];
    for (let i = 0; i < count; i++) {
      const pip = document.createElement("span");
      ((pip.className = "slot"), (pip.textContent = String(i + 1)));
      (this.el.slotRow.appendChild(pip), this.el.slots.push(pip));
    }
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
