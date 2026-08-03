// ---------------------------------------------------------------------------
// ui/hud.js — minimal, kinetic HUD (Section 9). Every value animates on
// springs: ammo punches, HP drains with a lag ghost, banners slam with
// overshoot. Damage numbers, kill feed, damage arcs, hint card, death and
// pause screens all live here.
// ---------------------------------------------------------------------------
import { Spring, Ease, clamp } from '../core/spring.js';

const CSS = `
.hud-font { font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; color: #f2ede4;
  text-shadow: 0 1px 4px rgba(0,0,0,.6); user-select: none; }
#ammo { position:absolute; right:34px; bottom:30px; text-align:right; }
#ammo .mag { font-size:56px; font-weight:800; letter-spacing:2px; line-height:1; }
#ammo .res { font-size:17px; opacity:.62; letter-spacing:3px; margin-top:2px; }
#ammo.low .mag { color:#ff5a48; }
#reloadbar { position:absolute; right:34px; bottom:104px; width:150px; height:3px;
  background:rgba(255,255,255,.14); opacity:0; }
#reloadbar i { display:block; height:100%; width:0%; background:#ffc46b; }
#hp { position:absolute; left:34px; bottom:34px; width:240px; }
#hp .bar { position:relative; height:10px; background:rgba(255,255,255,.12); overflow:hidden;
  transform: skewX(-14deg); }
#hp .ghost { position:absolute; inset:0; background:#a03428; transform-origin:left; }
#hp .fill { position:absolute; inset:0; background:#e8ddc8; transform-origin:left; }
#hp.low .fill { background:#ff5a48; }
#hp .lbl { font-size:12px; letter-spacing:4px; opacity:.6; margin-bottom:5px; }
#topright { position:absolute; right:34px; top:26px; text-align:right; }
#topright .wave { font-size:15px; letter-spacing:5px; opacity:.85; }
#topright .score { font-size:30px; font-weight:700; letter-spacing:2px; margin-top:2px; }
#killfeed { position:absolute; right:34px; top:96px; text-align:right; font-size:13px; }
#killfeed div { margin-bottom:5px; letter-spacing:1.5px; opacity:0; }
#killfeed b { color:#ffb454; }
#wavebanner { position:absolute; left:50%; top:24%; transform:translate(-50%,-50%) scale(2.4);
  font-size:64px; font-weight:800; letter-spacing:14px; opacity:0; white-space:nowrap;
  color:#ffd9a0; text-shadow: 0 2px 18px rgba(255,140,40,.45), 0 1px 3px rgba(0,0,0,.5); }
#vignette { position:absolute; inset:0; pointer-events:none; opacity:0;
  background: radial-gradient(ellipse at center, transparent 55%, rgba(180,20,10,.55) 100%); }
#arcs { position:absolute; left:50%; top:50%; }
#arcs .arc { position:absolute; left:-60px; top:-60px; width:120px; height:120px;
  border-radius:50%; border:5px solid transparent; border-top-color:rgba(255,80,55,.9); }
#dmgnums { position:absolute; inset:0; overflow:hidden; }
#dmgnums span { position:absolute; font-weight:800; font-size:19px; color:#ffe9c4;
  text-shadow:0 1px 3px rgba(0,0,0,.7); letter-spacing:1px; }
#dmgnums span.crit { color:#ff6a50; font-size:24px; }
#hintcard { position:absolute; left:50%; bottom:12%; transform:translateX(-50%);
  background:rgba(10,10,14,.55); border:1px solid rgba(255,200,130,.25);
  padding:18px 30px; text-align:center; backdrop-filter: blur(4px); }
#hintcard h1 { font-size:22px; letter-spacing:9px; margin:0 0 10px; color:#ffd9a0; font-weight:800; }
#hintcard .row { font-size:13px; letter-spacing:2px; opacity:.85; margin:3px 0; }
#hintcard .go { margin-top:12px; font-size:14px; letter-spacing:4px; color:#ffb454; }
#center-overlay { position:absolute; inset:0; display:flex; align-items:center; justify-content:center;
  background:rgba(6,6,10,.5); pointer-events:auto; flex-direction:column; }
#center-overlay h2 { font-size:40px; letter-spacing:10px; margin:0 0 8px; font-weight:800; }
#center-overlay p { font-size:15px; letter-spacing:4px; opacity:.75; margin:4px 0; }
.hidden { display:none !important; }
`;

export class HUD {
  constructor(root, ctx) {
    this.ctx = ctx;
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    root.innerHTML = `
      <div id="vignette"></div>
      <div id="arcs"></div>
      <div id="dmgnums"></div>
      <div id="ammo" class="hud-font"><div class="mag">30</div><div class="res">/ 270 RESERVE</div></div>
      <div id="reloadbar"><i></i></div>
      <div id="hp" class="hud-font"><div class="lbl">INTEGRITY</div>
        <div class="bar"><div class="ghost"></div><div class="fill"></div></div></div>
      <div id="topright" class="hud-font"><div class="wave">WAVE 1</div><div class="score">0</div></div>
      <div id="killfeed" class="hud-font"></div>
      <div id="wavebanner" class="hud-font">WAVE 1</div>
      <div id="hintcard" class="hud-font">
        <h1>HIGHRISE PROTOCOL</h1>
        <div class="row">WASD MOVE &nbsp;·&nbsp; SHIFT SPRINT &nbsp;·&nbsp; C SLIDE/CROUCH &nbsp;·&nbsp; SPACE JUMP</div>
        <div class="row">LMB FIRE &nbsp;·&nbsp; RMB AIM &nbsp;·&nbsp; R RELOAD &nbsp;·&nbsp; Q/E LEAN</div>
        <div class="row">T AIM SELF-TEST &nbsp;·&nbsp; \` TELEMETRY</div>
        <div class="go">— CLICK TO DEPLOY —</div>
      </div>
      <div id="center-overlay" class="hud-font hidden">
        <h2 id="ov-title">PAUSED</h2>
        <p id="ov-sub">CLICK TO RESUME</p>
      </div>`;

    this.el = {
      ammoMag: root.querySelector('#ammo .mag'),
      ammoBox: root.querySelector('#ammo'),
      ammoRes: root.querySelector('#ammo .res'),
      reloadbar: root.querySelector('#reloadbar'),
      reloadFill: root.querySelector('#reloadbar i'),
      hpBox: root.querySelector('#hp'),
      hpFill: root.querySelector('#hp .fill'),
      hpGhost: root.querySelector('#hp .ghost'),
      wave: root.querySelector('#topright .wave'),
      score: root.querySelector('#topright .score'),
      killfeed: root.querySelector('#killfeed'),
      banner: root.querySelector('#wavebanner'),
      vignette: root.querySelector('#vignette'),
      arcs: root.querySelector('#arcs'),
      dmgnums: root.querySelector('#dmgnums'),
      hint: root.querySelector('#hintcard'),
      overlay: root.querySelector('#center-overlay'),
      ovTitle: root.querySelector('#ov-title'),
      ovSub: root.querySelector('#ov-sub'),
    };

    this.ammoSpring = new Spring(300, 26, 30);
    this.punch = new Spring(420, 20, 0);
    this.hpSpring = new Spring(70, 15, 100);
    this.hpGhost = new Spring(16, 7, 100);   // slow drain ghost
    this.maxHp = 100;
    this.scoreSpring = new Spring(120, 20, 0);
    this.vignetteSpring = new Spring(60, 13, 0);
    this.bannerT = -1;
    this.score = 0;
    this._numPool = [];
    this._arcs = [];
    this._feedRows = [];
    this._hintGone = false;
    this._proj = null; // set by ctx later
  }

  // --- ammo -----------------------------------------------------------------
  setAmmo(mag, reserve) { this.ammoSpring.target = mag; this._reserve = reserve; }
  ammoPunch() { this.punch.impulse(6.5); }
  flashAmmo() { this.el.ammoBox.classList.add('low'); }

  // --- hp ---------------------------------------------------------------------
  setHp(hp) {
    this.hpSpring.target = hp;
    if (hp < this.hpGhost.value - 1) this.hpGhost.target = hp;
    this.vignetteSpring.impulse(3.2);
  }
  healTo(hp) { this.hpSpring.target = hp; this.hpGhost.target = Math.max(this.hpGhost.target, hp); }

  // --- score / wave --------------------------------------------------------------
  addScore(s) { this.score += s; this.scoreSpring.target = this.score; }
  setWave(w) { this.el.wave.textContent = `WAVE ${w}`; }

  waveBanner(n) {
    this.setWave(n);
    this.el.banner.textContent = `WAVE ${n}`;
    this.bannerT = 0;
  }

  // --- kill feed --------------------------------------------------------------------
  killFeed(enemy, headshot) {
    const name = enemy.type.toUpperCase();
    const row = document.createElement('div');
    row.innerHTML = `${name} ${headshot ? '<b>◈ HEADSHOT</b>' : '▸ DOWN'} <b>+${enemy.cfg.score + (headshot ? 50 : 0)}</b>`;
    this.el.killfeed.prepend(row);
    this._feedRows.push({ el: row, t: 0 });
    while (this._feedRows.length > 5) {
      const old = this._feedRows.shift();
      old.el.remove();
    }
  }

  // --- damage numbers ------------------------------------------------------------------
  damageNumber(worldPos, dmg, crit) {
    if (!this._proj) return;
    const p = this._proj(worldPos);
    if (!p) return;
    let span = this._numPool.find((s) => !s.busy);
    if (!span) {
      if (this._numPool.length >= 12) return;
      span = { el: document.createElement('span'), busy: false, t: 0, x: 0, y: 0 };
      this.el.dmgnums.appendChild(span.el);
      this._numPool.push(span);
    }
    span.busy = true; span.t = 0;
    span.x = p.x; span.y = p.y;
    span.el.textContent = crit ? `${dmg} ✦` : `${dmg}`;
    span.el.className = crit ? 'crit' : '';
    span.el.style.opacity = '1';
  }

  // --- damage arcs ------------------------------------------------------------------------
  damageArc(angleRad) {
    const arc = document.createElement('div');
    arc.className = 'arc';
    arc.style.transform = `rotate(${angleRad}rad)`;
    this.el.arcs.appendChild(arc);
    this._arcs.push({ el: arc, t: 0 });
  }

  // --- screens ------------------------------------------------------------------------------
  dismissHint() {
    if (this._hintGone) return;
    this._hintGone = true;
    this.el.hint.style.transition = 'opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)';
    this.el.hint.style.opacity = '0';
    this.el.hint.style.transform = 'translateX(-50%) translateY(24px)';
  }

  showPause(msg) {
    this.el.overlay.classList.remove('hidden');
    this.el.ovTitle.textContent = 'PAUSED';
    this.el.ovSub.textContent = msg || 'CLICK TO RESUME';
  }
  showDeath(score, wave) {
    this.el.overlay.classList.remove('hidden');
    this.el.ovTitle.textContent = 'K.I.A.';
    this.el.ovSub.textContent = `SCORE ${score} — WAVE ${wave} — PRESS ENTER TO REDEPLOY`;
  }
  hideOverlay() { this.el.overlay.classList.add('hidden'); }

  reloadProgress(f) {
    this.el.reloadbar.style.opacity = f > 0 && f < 1 ? '1' : '0';
    this.el.reloadFill.style.width = `${clamp(f, 0, 1) * 100}%`;
  }

  // --- per-frame spring animation ---------------------------------------------------------------
  update(dt) {
    this.ammoSpring.update(dt);
    this.punch.update(dt);
    this.hpSpring.update(dt);
    this.hpGhost.update(dt);
    this.scoreSpring.update(dt);
    this.vignetteSpring.update(dt);

    const magShown = Math.round(this.ammoSpring.value);
    this.el.ammoMag.textContent = magShown;
    this.el.ammoRes.textContent = `/ ${this._reserve ?? 0} RESERVE`;
    const sc = 1 + this.punch.value * 0.03;
    this.el.ammoMag.style.transform = `scale(${sc})`;
    if (magShown > 5) this.el.ammoBox.classList.remove('low');

    const hp = clamp(this.hpSpring.value, 0, this.maxHp);
    this.el.hpFill.style.transform = `scaleX(${hp / this.maxHp})`;
    this.el.hpGhost.style.transform = `scaleX(${clamp(this.hpGhost.value, 0, this.maxHp) / this.maxHp})`;
    this.el.hpBox.classList.toggle('low', hp < 0.35 * this.maxHp);

    this.el.score.textContent = Math.round(this.scoreSpring.value);
    this.el.vignette.style.opacity = clamp(this.vignetteSpring.value * 0.14 + (hp < 0.35 * this.maxHp && hp > 0 ? 0.22 + Math.sin(performance.now() * 0.006) * 0.08 : 0), 0, 0.85);

    // banner slam: easeOutBack in, hold, fade out
    if (this.bannerT >= 0) {
      this.bannerT += dt;
      const t = this.bannerT;
      let op = 1, scale = 1;
      if (t < 0.42) {
        const k = t / 0.42;
        scale = 2.4 - 1.4 * Ease.outBack(k);
        op = Ease.outCubic(k);
      } else if (t > 1.7 && t < 2.3) {
        op = 1 - Ease.inQuad((t - 1.7) / 0.6);
      } else if (t >= 2.3) { op = 0; this.bannerT = -1; }
      this.el.banner.style.opacity = op;
      this.el.banner.style.transform = `translate(-50%,-50%) scale(${scale})`;
    }

    // damage numbers: rise + ease-out fade
    for (const s of this._numPool) {
      if (!s.busy) continue;
      s.t += dt;
      const k = s.t / 0.75;
      if (k >= 1) { s.busy = false; s.el.style.opacity = '0'; continue; }
      const rise = Ease.outCubic(k) * 46;
      const scl = 1 + Ease.outBack(Math.min(k * 3, 1)) * 0.25;
      s.el.style.transform = `translate(${s.x}px, ${s.y - rise}px) scale(${scl})`;
      s.el.style.opacity = `${1 - Ease.inQuad(k)}`;
    }

    // damage arcs fade
    for (let i = this._arcs.length - 1; i >= 0; i--) {
      const a = this._arcs[i];
      a.t += dt;
      const k = a.t / 1.2;
      if (k >= 1) { a.el.remove(); this._arcs.splice(i, 1); continue; }
      a.el.style.opacity = `${1 - Ease.inQuad(k)}`;
    }

    // kill feed rows: slide in with overshoot, fade after 3 s
    for (let i = this._feedRows.length - 1; i >= 0; i--) {
      const r = this._feedRows[i];
      r.t += dt;
      if (r.t < 0.35) {
        const k = Ease.outBack(r.t / 0.35);
        r.el.style.opacity = `${Math.min(r.t / 0.12, 1)}`;
        r.el.style.transform = `translateX(${(1 - k) * 46}px)`;
      } else if (r.t > 3) {
        const f = clamp((r.t - 3) / 0.5, 0, 1);
        r.el.style.opacity = `${1 - f}`;
        if (f >= 1) { r.el.remove(); this._feedRows.splice(i, 1); }
      }
    }
  }

  reset(score = 0, hp = 100, mag = 30, reserve = 270) {
    this.score = score;
    this.scoreSpring.set(0);
    this.ammoSpring.set(mag);
    this._reserve = reserve;
    this.maxHp = Math.max(hp, 1);
    this.hpSpring.set(hp); this.hpGhost.set(hp);
    this.vignetteSpring.set(0);
    this.bannerT = -1;
    this.el.banner.style.opacity = '0';
    for (const r of this._feedRows) r.el.remove();
    this._feedRows.length = 0;
    for (const s of this._numPool) { s.busy = false; s.el.style.opacity = '0'; }
    for (const a of this._arcs) a.el.remove();
    this._arcs.length = 0;
    this.el.killfeed.innerHTML = '';
    this.hideOverlay();
    this.reloadProgress(0);
  }
}
