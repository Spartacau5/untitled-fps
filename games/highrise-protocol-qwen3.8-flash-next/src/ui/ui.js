// HIGHRISE PROTOCOL — UI module (U1-U4, D2/D3/D7 HUD-side, damage arcs, tally card).
// DOM only. Polls `state`, consumes `bus` events, springs every HUD change (U1/C5).
//
// Contract deviations (documented):
//  - Consumes bus 'hit:damage' {worldPos, dmg, headshot} — NOT in the catalog. If the
//    weapon never emits it, main can call `ui.damageNumber(...)` directly as a fallback.
//  - Score fly (D7): subscribes to NOTHING — polls state.score diff every frame and
//    spawns '+n' popups itself ('score' {delta} may also be emitted by main; ignored).
//  - Emits bus 'tally:dismissed' when the tally card finishes its auto-dismiss
//    animation. Main may ignore it (phase machine in main is authoritative; the card
//    hides itself either way).
//  - API adds: damageNumber(data), debug(lines), setDebugVisible(v) beyond the contract
//    surface, per the assignment.
//  - state.crosshair = {gap, alpha, spreadPx} is written by weapon (contract); this
//    module reads it defensively (falls back to 1 - ads.blend alpha, small default gap).

import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { Spring } from '../core/spring.js';
import * as E from '../core/easings.js';
import { time } from '../core/time.js';
import { Rng, SEED } from '../core/rng.js';
import { Vector3 } from 'three';

const byId = (id) => document.getElementById(id);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const finite = (v) => Number.isFinite(v);

export function init(ctx) {
  // ------------------------------------------------------------------ refs
  const hud = byId('hud');
  const ammoEl = byId('ammo');
  const magEl = ammoEl && ammoEl.querySelector('.mag');
  const reserveEl = ammoEl && ammoEl.querySelector('.reserve');
  const healthEl = byId('health');
  const hpFill = healthEl && healthEl.querySelector('.fill');
  const waveNum = byId('wave-num');
  const scoreNum = byId('score-num');
  const comboEl = byId('combo');
  const comboCnt = comboEl && comboEl.querySelector('.cnt');
  const killfeedEl = byId('killfeed');
  const announcerEl = byId('announcer');
  const bannerEl = byId('wavebanner');
  const crosshairEl = byId('crosshair');
  const ch = crosshairEl ? {
    up: crosshairEl.querySelector('.up'),
    dn: crosshairEl.querySelector('.dn'),
    lf: crosshairEl.querySelector('.lf'),
    rt: crosshairEl.querySelector('.rt'),
    dot: crosshairEl.querySelector('.dot'),
  } : null;
  const hitmarkerEl = byId('hitmarker');
  const vignetteEl = byId('dmgvignette');
  const odglowEl = byId('odglow');
  const dmgdirsEl = byId('dmgdirs');
  const promptEl = byId('prompt');
  const godBadge = byId('god-badge');
  const scoreflyEl = byId('scorefly'); // template for pooled clones; hidden as-is
  const startEl = byId('start');
  const btnStart = byId('btn-start');
  const btnGod = byId('btn-god');
  const pauseEl = byId('pause');
  const btnResume = byId('btn-resume');
  const btnQuit = byId('btn-quit');
  const tallyEl = byId('tally');
  const tallyCard = byId('tally-card');
  const tallyTitle = byId('tally-title');
  const tallyRows = byId('tally-rows');
  const deadEl = byId('dead');
  const deadStats = byId('dead-stats');
  const btnRetry = byId('btn-retry');
  const hintEl = byId('controls-hint');
  const debugEl = byId('debug');

  let viewW = window.innerWidth || 1;
  let viewH = window.innerHeight || 1;
  window.addEventListener('resize', () => {
    viewW = window.innerWidth || 1;
    viewH = window.innerHeight || 1;
  });

  const showEl = (el) => { if (el) el.classList.remove('hidden'); return el; };
  const hideEl = (el) => { if (el) el.classList.add('hidden'); return el; };
  const resolve = (elOrId) => (typeof elOrId === 'string' ? byId(elOrId) : elOrId);

  // transform/opacity-only writes, guarded so we don't re-spam identical style strings
  const put = (el, key, val) => {
    if (!el) return;
    if (el['$' + key] === val) return;
    el['$' + key] = val;
    if (key === 'tf') el.style.transform = val;
    else el.style.opacity = val;
  };

  // ------------------------------------------------------------------ scratch
  const _v = new Vector3();
  const _dir = new Vector3();
  const _right = new Vector3();
  const _up = new Vector3();
  // Own RNG stream (C2: seeded, deterministic) so UI jitter never pollutes the
  // shared world-spawn stream.
  const urng = new Rng(SEED ^ 0x5117);

  // ------------------------------------------------------------------ springs
  const ammoPunch = new Spring(1, 320, 0.55);   // U1: shot punch w/ overshoot
  const hpS = new Spring(1, 140, 0.9);          // smooth drain + refill
  const gapS = new Spring(0, 260, 0.7);         // crosshair bloom
  const chAlphaS = new Spring(1, 220, 1);
  const comboPop = new Spring(1, 300, 0.5);     // D2 juicy pop
  const comboFade = new Spring(0, 60, 1);
  const promptS = new Spring(0, 200, 1);        // U3 fade in/out
  const dmgS = new Spring(0, 90, 0.7);          // vignette hit pulse
  const odS = new Spring(0, 40, 0.9);           // overdrive glow
  const vgnOx = new Spring(50, 60, 0.8);        // directional vignette bg-position %
  const vgnOy = new Spring(50, 60, 0.8);

  // health fill scales from its left edge; ammo punches from its right edge
  if (hpFill) hpFill.style.transformOrigin = 'left center';
  if (magEl) magEl.style.transformOrigin = 'right center';
  if (scoreflyEl) hideEl(scoreflyEl); // keep the template hidden; clones are real popups

  // ------------------------------------------------------------------ tween state
  // Single-slot eased tweens (announcer, banner, hitmarker, tally card, hint).
  // t < 0 = idle; t >= 0 = running (seconds accumulated in real time).
  const hitT = { t: -1, dur: 0.18, kill: false, hs: false };
  const annT = { t: -1, inD: 0.18, hold: 0.9, outD: 0.45 };
  const banT = { t: -1, inD: 0.26, hold: 1.6, outD: 0.5 };
  const talT = { t: -1, phase: 0 };             // 0 = in, 1 = hold, 2 = out
  const hintT = { t: -1, out: false, dismissed: false };

  let comboTimer = 0;
  let odTimer = 0;
  let realClock = 0;                            // real-time accumulator for UI pulses
  let lastMag = -1;
  let lastMagColor = '\u0000';
  let lastWave = -1;
  let lastScore = state.score;
  let lastPhase = '';
  const scoreTween = { from: 0, to: 0, t: -1, dur: 0.5 };
  let promptText = null;

  // ------------------------------------------------------------------ pools (P1)
  // Damage numbers: 24 pooled absolute divs, oldest-first reuse.
  const dmgPool = [];
  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;left:0;top:0;font-weight:800;font-size:20px;color:#fff;' +
      'opacity:0;text-shadow:0 2px 6px rgba(0,0,0,.85);pointer-events:none;' +
      'font-variant-numeric:tabular-nums;will-change:transform,opacity;';
    el.$t = -1; el.$dur = 0.9; el.$x = 0; el.$y = 0;
    if (hud) hud.appendChild(el);
    dmgPool.push(el);
  }
  let dmgIdx = 0;

  // Score fly popups (D7): 6 pooled, rise toward the topbar counter.
  const flyPool = [];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement('div');
    el.style.cssText = 'position:absolute;left:0;top:0;font-size:22px;font-weight:800;color:#fff;' +
      'opacity:0;text-shadow:0 2px 8px rgba(0,0,0,.8);pointer-events:none;will-change:transform,opacity;';
    el.$t = -1; el.$sx = 0;
    if (hud) hud.appendChild(el);
    flyPool.push(el);
  }
  let flyIdx = 0;

  // Damage direction arcs (U2): 4 pooled triangles orbiting the crosshair at 120 px.
  const arcPool = [];
  for (let i = 0; i < 4; i++) {
    const el = document.createElement('div');
    el.className = 'arc';
    const tri = document.createElement('div');
    tri.style.cssText = 'position:absolute;left:44px;top:0px;width:0;height:0;' +
      'border-left:16px solid transparent;border-right:16px solid transparent;' +
      'border-bottom:26px solid rgba(255,59,48,.95);';
    el.appendChild(tri);
    el.style.opacity = '0';
    el.$ang = 0;
    el.$fade = new Spring(0, 8, 0.9);           // spring fade-out ~1.5 s
    if (dmgdirsEl) dmgdirsEl.appendChild(el);
    arcPool.push(el);
  }
  let arcIdx = 0;

  // Kill feed (U1): spring slide-in from right, cap 5, auto-fade after 4 s.
  const feedItems = [];                          // { el, x:Spring, o:Spring, age, dying }

  // ------------------------------------------------------------------ behaviors
  function fireAmmoPunch() {
    ammoPunch.snap(1.34).set(1);
  }

  function showHitmarker(kill, headshot) {
    if (!hitmarkerEl) return;
    hitT.t = 0;
    hitT.kill = !!kill;
    hitT.hs = !!headshot;
    hitT.dur = kill ? 0.24 : 0.18;              // kill variant bigger/longer
    hitmarkerEl.classList.toggle('kill', !!kill);
  }

  function announce(text) {
    if (!announcerEl) return;
    announcerEl.textContent = text;
    annT.t = 0;
  }

  function banner(title, sub) {
    if (!bannerEl) return;
    bannerEl.innerHTML = '';
    const span = document.createElement('span');
    span.textContent = title;
    bannerEl.appendChild(span);
    if (sub) {
      const small = document.createElement('small');
      small.textContent = sub;
      bannerEl.appendChild(small);
    }
    banT.t = 0;
  }

  function killFeed(entry) {
    if (!killfeedEl) return;
    const hs = typeof entry === 'object' && entry ? !!entry.headshot : false;
    const text = typeof entry === 'string' ? entry : (hs ? 'HEADSHOT' : 'ELIMINATED');
    while (feedItems.length >= 5) {
      const old = feedItems.shift();
      if (old.el.parentNode) old.el.parentNode.removeChild(old.el);
    }
    const el = document.createElement('div');
    el.className = hs ? 'kf hs' : 'kf';
    el.textContent = text;
    killfeedEl.appendChild(el);
    const x = new Spring(70, 260, 0.7).set(0);  // slide in from the right, overshoot
    const o = new Spring(0, 160, 1).set(1);
    feedItems.push({ el, x, o, age: 0, dying: false });
  }

  function damageNumber(data) {
    if (!data || !hud || !ctx || !ctx.camera) return;
    const wp = data.worldPos || data.point;
    if (!wp || !finite(wp.x) || !finite(wp.y) || !finite(wp.z)) return;
    const el = dmgPool[dmgIdx];
    dmgIdx = (dmgIdx + 1) % dmgPool.length;     // oldest-first reuse at cap
    const hs = !!data.headshot;
    const dmg = Math.max(1, Math.round(data.dmg || 0));
    el.textContent = hs ? `${dmg} ✸` : String(dmg);
    el.style.color = hs ? '#ffb347' : '#fff';
    el.style.fontSize = hs ? '27px' : '20px';
    _v.set(wp.x, wp.y, wp.z).project(ctx.camera);
    if (_v.z > 1 || _v.z < -1) { el.$t = -1; put(el, 'o', '0'); return; } // behind camera → hide
    el.$x = clamp((_v.x * 0.5 + 0.5) * viewW + urng.range(-14, 14), 8, Math.max(8, viewW - 60));
    el.$y = clamp((-_v.y * 0.5 + 0.5) * viewH + urng.range(-8, 8), 40, Math.max(40, viewH - 40));
    el.$t = 0;
  }

  function scoreFly(delta) {
    if (!hud) return;
    const el = flyPool[flyIdx];
    flyIdx = (flyIdx + 1) % flyPool.length;
    el.textContent = `+${Math.round(delta)}`;
    el.$sx = viewW * 0.5 + urng.range(-110, 110);
    el.$sy = viewH * (0.50 + urng.range(-0.035, 0.055));
    el.$t = 0;
  }

  function damageArc(from) {
    if (!dmgdirsEl || !ctx || !ctx.camera || !from) return;
    const el = arcPool[arcIdx];
    arcIdx = (arcIdx + 1) % arcPool.length;
    const cam = ctx.camera;
    _dir.copy(from).sub(cam.position);
    if (_dir.lengthSq() < 1e-6) return;
    _right.setFromMatrixColumn(cam.matrixWorld, 0);
    _up.setFromMatrixColumn(cam.matrixWorld, 1);
    // clockwise angle from screen-up toward screen-right → CSS rotate(deg)
    el.$ang = Math.atan2(_dir.dot(_right), _dir.dot(_up)) * (180 / Math.PI);
    el.$fade.snap(1).set(0);
    // directional vignette: bias the radial gradient center toward the attacker
    const rad = el.$ang * (Math.PI / 180);
    vgnOx.set(50 + Math.sin(rad) * 18);
    vgnOy.set(50 - Math.cos(rad) * 18);
    dmgS.snap(0.95).set(0);
  }

  function refreshGodBadge() {
    if (btnGod) {
      btnGod.textContent = state.godmode ? 'GOD MODE: ON' : 'GOD MODE: OFF';
      btnGod.classList.toggle('on', !!state.godmode);
    }
    if (godBadge) {
      if (state.godmode && state.phase !== 'menu') showEl(godBadge);
      else hideEl(godBadge);
    }
    if (state.godmode) hpS.snap(1).set(1);
  }

  function prompt(text) {
    const t = text || '';
    if (t === promptText) return;
    promptText = t;
    if (t && promptEl) promptEl.innerHTML = t; // trusted internal strings only (<b>KEY</b> markup)
    promptS.set(t ? 1 : 0);
  }

  function tally(stats) {
    if (!tallyRows) return;
    const s = stats || {};
    let acc = finite(s.accuracy) ? s.accuracy
      : (finite(s.fired) && s.fired > 0 ? s.hit / s.fired
        : (state.accuracy.fired > 0 ? state.accuracy.hit / state.accuracy.fired : 0));
    if (acc > 1) acc = acc / 100;               // tolerate percent input
    const kills = finite(s.kills) ? s.kills : state.kills;
    const hsCount = finite(s.headshots) ? s.headshots : state.accuracy.headshots;
    const hsPct = kills > 0 ? clamp(hsCount / kills, 0, 1) : 0;
    const best = finite(s.bestCombo) ? s.bestCombo : state.combo.best;
    const score = finite(s.score) ? s.score : state.score;
    if (tallyTitle) tallyTitle.textContent = `WAVE ${state.wave} CLEARED`;
    tallyRows.innerHTML = '';
    const rows = [
      ['ACCURACY', `${Math.round(clamp(acc, 0, 1) * 100)}%`],
      ['HEADSHOT %', `${Math.round(hsPct * 100)}%`],
      ['KILLS', String(kills)],
      ['BEST COMBO', `×${best}`],
      ['SCORE', String(score)],
    ];
    for (let i = 0; i < rows.length; i++) {
      const row = document.createElement('div');
      row.className = 'row';
      const lab = document.createElement('span');
      lab.textContent = rows[i][0];
      const val = document.createElement('b');
      val.textContent = rows[i][1];
      row.appendChild(lab);
      row.appendChild(val);
      tallyRows.appendChild(row);
    }
    talT.t = 0;
    talT.phase = 0;
    if (tallyEl) tallyEl.classList.remove('hidden');
  }

  // ------------------------------------------------------------------ screens
  function onScreen(phase) {
    const menu = phase === 'menu';
    const playing = phase === 'playing';
    if (startEl) startEl.classList.toggle('hidden', !menu);
    if (hud) hud.classList.toggle('hidden', !playing);
    if (pauseEl) pauseEl.classList.toggle('hidden', phase !== 'paused');
    // D7: tally is an overlay ON the live game — it never pauses simulation.
    if (tallyEl && phase !== 'playing') { tallyEl.classList.add('hidden'); talT.t = -1; }
    if (deadEl) {
      if (phase === 'dead') {
        if (deadStats) {
          deadStats.innerHTML = '';
          const acc = state.accuracy.fired > 0
            ? Math.round((state.accuracy.hit / state.accuracy.fired) * 100) : 0;
          const lines = [
            `SCORE ${state.score}`,
            `WAVE ${state.wave} · KILLS ${state.kills}`,
            `ACCURACY ${acc}%`,
          ];
          for (let i = 0; i < lines.length; i++) {
            const d = document.createElement('div');
            d.textContent = lines[i];
            deadStats.appendChild(d);
          }
        }
        showEl(deadEl);
      } else hideEl(deadEl);
    }
    // U3: hint shows on each new playing entry until first input dismisses it;
    // re-armed when returning to menu (next match is a fresh run).
    if (playing && !hintT.dismissed) {
      if (hintT.t < 0 || hintT.out) { hintT.t = 0; hintT.out = false; }
      showEl(hintEl);
    } else if (!playing && phase !== 'paused') {
      hintT.t = -1; hintT.out = false;
      hideEl(hintEl);
    }
    if (menu) {
      hintT.dismissed = false;
      promptText = null;
      promptS.snap(0);
      if (promptEl) put(promptEl, 'o', '0');
    }
    refreshGodBadge();
  }

  function bindScreens(handlers) {
    const h = handlers || {};
    if (btnStart) btnStart.addEventListener('click', () => {
      if (typeof h.onStart === 'function') h.onStart(state.godmode);
    });
    if (btnGod) btnGod.addEventListener('click', () => {
      state.godmode = !state.godmode;           // U4: chosen pre-match, applies whole match
      refreshGodBadge();
    });
    if (btnResume) btnResume.addEventListener('click', () => {
      if (typeof h.onResume === 'function') h.onResume();
    });
    if (btnQuit) btnQuit.addEventListener('click', () => {
      if (typeof h.onQuit === 'function') h.onQuit();
    });
    if (btnRetry) btnRetry.addEventListener('click', () => {
      if (typeof h.onRetry === 'function') h.onRetry();
    });
    return api;
  }

  function debug(lines) {
    if (!debugEl) return;
    debugEl.textContent = Array.isArray(lines) ? lines.join('\n') : String(lines);
  }

  function setDebugVisible(v) {
    if (!debugEl) return;
    debugEl.classList.toggle('hidden', !v);
  }

  // ------------------------------------------------------------------ bus wiring
  const offs = [];
  offs.push(bus.on('shot:fire', fireAmmoPunch));
  offs.push(bus.on('hit:marker', (d) => showHitmarker(d && d.kill, d && d.headshot)));
  offs.push(bus.on('hit:damage', damageNumber));               // non-catalog, see header
  offs.push(bus.on('kill', (d) => killFeed({ headshot: d && d.headshot })));
  offs.push(bus.on('combo', (d) => {
    const n = d && finite(d.count) ? d.count : state.combo.count;
    if (comboCnt) comboCnt.textContent = `×${n}`;
    comboPop.snap(n >= 2 ? 1.55 : 1.35).set(1);
    comboFade.set(1);
    comboTimer = 4;                                             // D2 4 s chain window
    if (n === 2) announce('DOUBLE KILL');                       // D3
    else if (n === 3) announce('TRIPLE KILL');
    else if (n >= 4) announce('RAMPAGE');
  }));
  offs.push(bus.on('overdrive:start', () => {
    announce('OVERDRIVE');
    odTimer = 2;
    odS.set(1);
  }));
  offs.push(bus.on('overdrive:end', () => { odTimer = 0; odS.set(0); }));
  offs.push(bus.on('wave:start', (d) => banner(`WAVE ${d && finite(d.n) ? d.n : state.wave}`, 'INCOMING')));
  offs.push(bus.on('wave:cleared', (d) => banner(`WAVE ${d && finite(d.n) ? d.n : state.wave} CLEARED`, '')));
  offs.push(bus.on('player:damage', (d) => {
    if (state.godmode) return;                                  // U4: zero damage → no HUD harm
    if (d && d.from) damageArc(d.from);
    else dmgS.snap(0.9).set(0);
  }));
  offs.push(bus.on('game:phase', (d) => { if (d && d.phase) onScreen(d.phase); }));
  const dismissHint = () => {
    if (hintEl && !hintEl.classList.contains('hidden') && !hintT.out && hintT.t >= 0) {
      hintT.out = true;
      hintT.dismissed = true;
      hintT.t = 0;
    }
  };
  offs.push(bus.on('input:any', dismissHint));
  offs.push(bus.on('shot:fire', dismissHint));
  let sensHideT = 0;
  offs.push(bus.on('sens:change', (v) => {
    prompt(`MOUSE SENS ×${(+v).toFixed(2)}`);
    sensHideT = 1.2;
  }));
  // (tick-down lives in update(): sensHideT)

  // ------------------------------------------------------------------ update
  function update(dt) {
    // UI animates on REAL time (hit-stop/slow-mo must not freeze the HUD) — K4-safe.
    const rdt = clamp(finite(time.raw) ? time.raw : (finite(dt) ? dt : 0), 0, 0.05);
    realClock += rdt;
    if (sensHideT > 0) { sensHideT -= rdt; if (sensHideT <= 0) prompt(''); }

    // phase transitions not routed via bus (defensive: main may set state.phase directly)
    if (state.phase !== lastPhase) { lastPhase = state.phase; onScreen(state.phase); }

    // --- ammo (U1: punch on shot, color by count)
    ammoPunch.update(rdt);
    if (magEl) {
      if (state.mag !== lastMag) {
        lastMag = state.mag;
        magEl.textContent = String(state.mag);
        const c = state.mag <= 3 ? '#ff3b30' : state.mag <= 7 ? '#ffb347' : '';
        if (c !== lastMagColor) { lastMagColor = c; magEl.style.color = c; }
      }
      put(magEl, 'tf', `scale(${ammoPunch.value.toFixed(3)})`);
    }
    if (reserveEl && reserveEl.textContent !== '∞') reserveEl.textContent = '∞';

    // --- health (U1: smooth drain AND refill; godmode pinned full)
    const hpTarget = state.godmode ? 1 : clamp(finite(state.hp) ? state.hp / (state.maxHp || 1) : 1, 0, 1);
    hpS.set(hpTarget).update(rdt);
    if (hpFill) put(hpFill, 'tf', `scaleX(${clamp(hpS.value, 0, 1.2).toFixed(4)})`);

    // --- topbar wave + score count-up (easeOutCubic 0.5 s)
    if (state.wave !== lastWave) {
      lastWave = state.wave;
      if (waveNum) waveNum.textContent = String(Math.max(1, state.wave));
    }
    if (state.score !== lastScore) {
      const delta = state.score - lastScore;
      lastScore = state.score;
      if (delta > 0) scoreFly(delta);
      if (scoreNum) {
        scoreTween.from = Number(scoreNum.textContent) || 0;
        scoreTween.to = state.score;
        scoreTween.t = 0;
      }
    }
    if (scoreNum && scoreTween.t >= 0) {
      scoreTween.t += rdt;
      const p = clamp(scoreTween.t / scoreTween.dur, 0, 1);
      const v = Math.round(scoreTween.from + (scoreTween.to - scoreTween.from) * E.easeOutCubic(p));
      if (scoreNum.textContent !== String(v)) scoreNum.textContent = String(v);
      if (p >= 1) scoreTween.t = -1;
    }

    // --- crosshair (weapon writes state.crosshair; ui reads + spring-smooths; ADS → gone)
    const xc = state.crosshair;
    const gapT = xc && finite(xc.gap) ? xc.gap : 4;
    const alphaT = xc && finite(xc.alpha) ? xc.alpha : clamp(1 - state.ads.blend, 0, 1);
    gapS.set(gapT).update(rdt);
    chAlphaS.set(alphaT).update(rdt);
    if (ch) {
      const g = clamp(gapS.value, 0, 60);
      put(ch.up, 'tf', `translate(-1px, ${(-(g + 9)).toFixed(1)}px)`);
      put(ch.dn, 'tf', `translate(-1px, ${g.toFixed(1)}px)`);
      put(ch.lf, 'tf', `translate(${(-(g + 9)).toFixed(1)}px, -1px)`);
      put(ch.rt, 'tf', `translate(${g.toFixed(1)}px, -1px)`);
      put(ch.dot, 'tf', `scale(${(0.6 + 0.4 * clamp(g / 10, 0, 1)).toFixed(2)})`);
    }
    if (crosshairEl) put(crosshairEl, 'o', clamp(chAlphaS.value, 0, 1).toFixed(2));

    // --- hitmarker (scale-in + out eased ~180 ms; kill variant bigger, red via .kill)
    if (hitmarkerEl && hitT.t >= 0) {
      hitT.t += rdt;
      const p = clamp(hitT.t / hitT.dur, 0, 1);
      const peak = hitT.kill ? 1.45 : (hitT.hs ? 1.2 : 1);
      let s, o;
      if (p < 0.35) {
        s = peak * (0.55 + 0.45 * E.easeOutBack(p / 0.35, 2.2));
        o = '1';
      } else {
        const q = (p - 0.35) / 0.65;
        s = peak * (1 - E.easeInQuad(q) * 0.45);
        o = (1 - E.easeInOutCubic(q)).toFixed(2);
      }
      put(hitmarkerEl, 'tf', `scale(${s.toFixed(3)})`);
      put(hitmarkerEl, 'o', o);
      if (p >= 1) { hitT.t = -1; put(hitmarkerEl, 'o', '0'); }
    }

    // --- combo (D2: pop spring, hide after 4 s window)
    if (comboEl) {
      if (comboTimer > 0) {
        comboTimer -= rdt;
        if (comboTimer <= 0) comboFade.set(0);
      }
      comboPop.update(rdt);
      comboFade.update(rdt);
      const o = clamp(comboFade.value, 0, 1);
      put(comboEl, 'o', o.toFixed(2));
      if (o > 0.001) put(comboEl, 'tf', `translateX(-50%) scale(${clamp(comboPop.value, 0, 2).toFixed(3)})`);
    }

    // --- announcer (D3: slam easeOutBack, hold 0.9 s, ease-in-out fade)
    if (announcerEl && annT.t >= 0) {
      annT.t += rdt;
      const tHold = annT.inD + annT.hold, tOut = tHold + annT.outD;
      let o, s;
      if (annT.t < annT.inD) {
        const q = annT.t / annT.inD;
        o = E.easeOutQuad(q).toFixed(2);
        s = 1.7 - 0.7 * E.easeOutBack(q, 2.4);
      } else if (annT.t < tHold) {
        o = '1'; s = 1;
      } else if (annT.t < tOut) {
        const q = (annT.t - tHold) / annT.outD;
        o = (1 - E.easeInOutCubic(q)).toFixed(2);
        s = 1 + 0.06 * E.easeInQuad(q);
      } else { o = '0'; s = 1; annT.t = -1; }
      put(announcerEl, 'o', o);
      put(announcerEl, 'tf', `translate(-50%,-50%) scale(${s.toFixed(3)})`);
    }

    // --- wave banner (D1: slam ~1.4→1 spring overshoot)
    if (bannerEl && banT.t >= 0) {
      banT.t += rdt;
      const tHold = banT.inD + banT.hold, tOut = tHold + banT.outD;
      let o, s;
      if (banT.t < banT.inD) {
        const q = banT.t / banT.inD;
        o = E.easeOutQuad(q).toFixed(2);
        s = 1.4 - 0.4 * E.easeOutBack(q, 2.6);
      } else if (banT.t < tHold) {
        o = '1'; s = 1;
      } else if (banT.t < tOut) {
        const q = (banT.t - tHold) / banT.outD;
        o = (1 - E.easeInOutCubic(q)).toFixed(2);
        s = 1 - 0.05 * E.easeInQuad(q);
      } else { o = '0'; s = 1; banT.t = -1; }
      put(bannerEl, 'o', o);
      put(bannerEl, 'tf', `translate(-50%,-50%) scale(${s.toFixed(3)})`);
    }

    // --- vignette (damage pulse spring + low-HP<30 pulsing; directional offset)
    if (vignetteEl) {
      dmgS.update(rdt);
      vgnOx.update(rdt); vgnOy.update(rdt);
      const lowHp = (state.godmode || state.phase !== 'playing') ? 0
        : (state.hp < 30 ? clamp(1 - state.hp / 30, 0, 1) * (0.16 + 0.12 * Math.sin(realClock * 5.2)) : 0);
      const v = clamp(Math.max(dmgS.value, lowHp), 0, 1);
      put(vignetteEl, 'o', v.toFixed(3));
      if (v > 0.01) {
        const bp = `${vgnOx.value.toFixed(0)}% ${vgnOy.value.toFixed(0)}%`;
        if (vignetteEl.$bp !== bp) { vignetteEl.$bp = bp; vignetteEl.style.backgroundPosition = bp; }
      }
    }

    // --- overdrive glow (~2 s pulse on 'overdrive:start', faint while active)
    if (odglowEl) {
      if (odTimer > 0) {
        odTimer -= rdt;
        if (odTimer <= 0) odS.set(0);
      }
      odS.update(rdt);
      let o;
      if (odTimer > 0) {
        const u = clamp(1 - odTimer / 2, 0, 1);
        o = odS.value * (0.35 + 0.25 * Math.sin(u * Math.PI * 6)) * E.easeOutCubic(clamp(u * 8, 0, 1));
      } else if (state.overdrive.active) {
        o = 0.16;
      } else {
        o = 0;
      }
      put(odglowEl, 'o', clamp(o, 0, 1).toFixed(3));
    }

    // --- damage numbers pool (ease-out rise + fade ~0.9 s)
    for (let i = 0; i < dmgPool.length; i++) {
      const el = dmgPool[i];
      if (el.$t < 0) continue;
      el.$t += rdt;
      const p = clamp(el.$t / el.$dur, 0, 1);
      if (p >= 1) { el.$t = -1; put(el, 'o', '0'); continue; }
      const rise = E.easeOutCubic(p) * 52;
      const s = p < 0.15 ? E.easeOutBack(p / 0.15, 2.2) : 1;
      const o = 1 - E.easeInQuad(clamp((p - 0.35) / 0.65, 0, 1));
      put(el, 'tf', `translate(${el.$x.toFixed(0)}px, ${(el.$y - rise).toFixed(0)}px) scale(${clamp(s, 0, 1.6).toFixed(2)})`);
      put(el, 'o', o.toFixed(2));
    }

    // --- score fly popups (D7: rise toward topbar counter, ease-out, fade)
    for (let i = 0; i < flyPool.length; i++) {
      const el = flyPool[i];
      if (el.$t < 0) continue;
      el.$t += rdt;
      const p = clamp(el.$t / 0.85, 0, 1);
      if (p >= 1) { el.$t = -1; put(el, 'o', '0'); continue; }
      const ex = E.easeOutCubic(p);
      const x = el.$sx + (viewW * 0.5 - el.$sx) * ex;
      const y = el.$sy + (46 - el.$sy) * ex;
      put(el, 'tf', `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`);
      put(el, 'o', p < 0.7 ? '1' : (1 - E.easeInQuad((p - 0.7) / 0.3)).toFixed(2));
    }

    // --- kill feed items (spring slide, auto-fade after 4 s)
    for (let i = feedItems.length - 1; i >= 0; i--) {
      const it = feedItems[i];
      it.age += rdt;
      if (it.age > 4 && !it.dying) { it.dying = true; it.o.set(0); it.x.set(24); }
      it.x.update(rdt); it.o.update(rdt);
      put(it.el, 'tf', `translateX(${it.x.value.toFixed(1)}px)`);
      put(it.el, 'o', clamp(it.o.value, 0, 1).toFixed(2));
      if (it.dying && it.o.value < 0.02) {
        if (it.el.parentNode) it.el.parentNode.removeChild(it.el);
        feedItems.splice(i, 1);
      }
    }

    // --- damage arcs (U2: rotate to attacker, spring fade-out ~1.5 s)
    for (let i = 0; i < arcPool.length; i++) {
      const el = arcPool[i];
      el.$fade.update(rdt);
      const o = clamp(el.$fade.value, 0, 1);
      put(el, 'o', o.toFixed(2));
      if (o > 0.01) put(el, 'tf', `rotate(${el.$ang.toFixed(1)}deg)`);
    }

    // --- prompt (U3: fade in/out)
    promptS.update(rdt);
    if (promptEl) put(promptEl, 'o', clamp(promptS.value, 0, 1).toFixed(2));

    // --- controls hint (U3: eased in; eased out on first input)
    if (hintEl && hintT.t >= 0) {
      hintT.t += rdt;
      if (!hintT.out) {
        const p = clamp(hintT.t / 0.3, 0, 1);
        put(hintEl, 'o', E.easeOutCubic(p).toFixed(2));
      } else {
        const p = clamp(hintT.t / 0.45, 0, 1);
        put(hintEl, 'o', (1 - E.easeInOutCubic(p)).toFixed(2));
        if (p >= 1) { hintT.t = -1; hintT.dismissed = true; hideEl(hintEl); }
      }
    }

    // --- tally card (D7: scale .6→1 easeOutBack + fade ~450 ms, hold 2.4 s, ease-out dismiss)
    if (tallyCard && talT.t >= 0) {
      talT.t += rdt;
      if (talT.phase === 0) {
        const p = clamp(talT.t / 0.45, 0, 1);
        put(tallyCard, 'tf', `scale(${(0.6 + 0.4 * E.easeOutBack(p, 2.0)).toFixed(3)})`);
        put(tallyCard, 'o', E.easeOutQuad(p).toFixed(2));
        if (p >= 1) { talT.phase = 1; talT.t = 0; }
      } else if (talT.phase === 1) {
        if (talT.t > 2.4) { talT.phase = 2; talT.t = 0; }
      } else {
        const p = clamp(talT.t / 0.4, 0, 1);
        put(tallyCard, 'o', (1 - E.easeOutCubic(p)).toFixed(2));
        put(tallyCard, 'tf', `scale(${(1 - 0.08 * E.easeInQuad(p)).toFixed(3)})`);
        if (p >= 1) {
          talT.t = -1;
          if (tallyEl) tallyEl.classList.add('hidden');
          bus.emit('tally:dismissed');
        }
      }
    }
  }

  // K6: allow main to tear down listeners across restarts (optional; idempotent).
  function dispose() {
    for (let i = 0; i < offs.length; i++) offs[i]();
  }

  const api = {
    update,
    show: (el) => showEl(resolve(el)),
    hide: (el) => hideEl(resolve(el)),
    prompt,
    banner,
    announce,
    killFeed,
    tally,
    onScreen,
    refreshGodBadge,
    bindScreens,
    damageNumber,
    debug,
    setDebugVisible,
    dispose,
  };

  // initial screen state + god badge text
  lastPhase = state.phase || 'menu';
  onScreen(lastPhase);
  refreshGodBadge();
  return api;
}
