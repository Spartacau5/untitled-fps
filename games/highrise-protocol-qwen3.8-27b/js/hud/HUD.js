import { Spring } from '../core/Spring.js';

// U1/H2/D3/D7: minimal, kinetic HUD. Every change animates with springs.
export class HUD {
  constructor(root) {
    this.root = root;
    this.el = (id) => document.getElementById(id);
    this.magEl = this.el('ammo-mag');
    this.hpFill = this.el('hp-bar-fill');
    this.hpNum = this.el('hp-num');
    this.waveNum = this.el('wave-num');
    this.scoreNum = this.el('score-num');
    this.comboBox = this.el('combo-box');
    this.comboCount = this.el('combo-count');
    this.comboLabel = this.el('combo-label');
    this.odFill = this.el('overdrive-fill');
    this.killfeed = this.el('killfeed');
    this.multikill = this.el('multikill');
    this.waveBanner = this.el('wave-banner');
    this.dmgDir = this.el('damage-direction');
    this.hitVig = this.el('hit-vignette');
    this.dmgVig = this.el('dmg-vignette');
    this.prompt = this.el('prompt');
    this.godBadge = this.el('god-badge-hud');
    this.hpGodBadge = this.el('hp-god-badge');
    this.enemiesLeft = this.el('enemies-left');

    this.scoreDisplay = 0;
    this.scoreTarget = 0;
    this.hpSpring = new Spring(1, 10, 1.0);
    this._buildCrosshair();
    this._buildHitmarker();
  }

  // The HUD root is hidden on the start/death screens and shown for play.
  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }

  _buildCrosshair() {
    // F3: 4 lines + dot. Blooms while firing/moving, tightens when still.
    this.cross = document.createElement('div');
    this.cross.id = 'crosshair';
    this.cross.style.cssText = 'position:absolute;left:50%;top:50%;pointer-events:none;z-index:12;';
    this.crossLines = [];
    const mk = (w, h, x, y, r) => {
      const d = document.createElement('div');
      d.style.cssText = `position:absolute;background:#fff;width:${w}px;height:${h}px;left:${x}px;top:${y}px;transform:rotate(${r}deg) translate(-50%,-50%);box-shadow:0 0 3px rgba(0,0,0,0.8);`;
      this.cross.appendChild(d);
      this.crossLines.push(d);
      return d;
    };
    // top, bottom, left, right
    mk(3, 12, 0, 0, 0);    // will reposition
    mk(3, 12, 0, 0, 0);
    mk(12, 3, 0, 0, 0);
    mk(12, 3, 0, 0, 0);
    // dot
    this.crossDot = document.createElement('div');
    this.crossDot.style.cssText = 'position:absolute;background:#fff;width:3px;height:3px;left:0;top:0;transform:translate(-50%,-50%);';
    this.cross.appendChild(this.crossDot);
    this.root.appendChild(this.cross);
  }

  _buildHitmarker() {
    // H2: 4 diagonal ticks in an X around the crosshair — white on hit,
    // pink on head hit, RED on kill (lingers a bit longer).
    this.hitmark = document.createElement('div');
    this.hitmark.style.cssText = 'position:absolute;left:50%;top:50%;pointer-events:none;z-index:13;opacity:0;';
    this.hitmarkInner = document.createElement('div');
    this.hitmarkInner.style.cssText = 'position:relative;width:32px;height:32px;transform:translate(-50%,-50%);';
    this._hmTicks = [];
    for (let i = 0; i < 4; i++) {
      const d = document.createElement('div');
      const ang = (45 + i * 90);
      d.style.cssText = `position:absolute;left:50%;top:50%;width:4px;height:11px;background:#fff;transform-origin:center;transform:translate(-50%,-50%) rotate(${ang}deg) translateY(-11px);box-shadow:0 0 4px rgba(0,0,0,0.6);`;
      this.hitmarkInner.appendChild(d);
      this._hmTicks.push(d);
    }
    this.hitmark.appendChild(this.hitmarkInner);
    this.root.appendChild(this.hitmark);
    this._hm = { t: 0, dur: 0.25, s0: 1.2, active: false, color: '#ffffff' };
  }

  // F3: update crosshair bloom each frame. gap in px, opacity for ADS fade.
  updateCrosshair(gap, opacity) {
    const [t, b, l, r] = this.crossLines;
    t.style.transform = `translate(-50%,-50%) translateY(${-gap}px)`;
    b.style.transform = `translate(-50%,-50%) translateY(${gap}px)`;
    l.style.transform = `translate(-50%,-50%) translateX(${-gap}px)`;
    r.style.transform = `translate(-50%,-50%) translateX(${gap}px)`;
    this.cross.style.opacity = String(opacity);
  }

  // H2: white X on hit, pink on head hit, red X (bigger, longer) on kill.
  hitMarker(isKill, isHead) {
    const color = isKill ? '#ff3b3b' : (isHead ? '#ff8080' : '#ffffff');
    this._hm.t = 0;
    this._hm.dur = isKill ? 0.4 : 0.25;
    this._hm.s0 = isKill ? 1.5 : 1.2;
    this._hm.active = true;
    this._hm.color = color;
    for (const d of this._hmTicks) d.style.background = color;
    this.hitmarkInner.style.transform = `translate(-50%,-50%) scale(${this._hm.s0})`;
    this.hitmark.style.opacity = '1';
  }

  // How many enemies (alive + still spawning) remain in the current wave.
  setEnemies(n) {
    this.enemiesLeft.textContent = n > 0 ? `${n} HOSTILE${n === 1 ? '' : 'S'}` : 'AREA CLEAR';
  }

  punchAmmo(mag) {
    this.magEl.textContent = String(mag);
    this.magEl.classList.remove('punch');
    void this.magEl.offsetWidth;
    this.magEl.classList.add('punch');
  }

  setHp(hp, max, god) {
    this.hpSpring.target = hp / max;
    this.hpNum.textContent = String(Math.ceil(hp));
    this.hpNum.style.color = god ? '#ffe08a' : (hp < 30 ? '#ff5a5a' : '#fff');
  }

  setWave(n) { this.waveNum.textContent = String(n); }

  addScore(amount) { this.scoreTarget += amount; }

  showCombo(n) {
    this.comboBox.classList.remove('hidden');
    this.comboCount.textContent = String(n);
    this.comboCount.classList.remove('pop');
    void this.comboCount.offsetWidth;
    this.comboCount.classList.add('pop');
  }
  hideCombo() { this.comboBox.classList.add('hidden'); }
  setOverdriveFill(f) { this.odFill.style.width = (f * 100) + '%'; }

  killFeed(text, isHead, pts) {
    const d = document.createElement('div');
    d.className = 'kf-item';
    d.innerHTML = `<span>${isHead ? '<span class="kf-hs">✦</span> ' : ''}${text}</span><span class="kf-pts">+${pts}</span>`;
    this.killfeed.appendChild(d);
    requestAnimationFrame(() => d.classList.add('show'));
    setTimeout(() => { d.classList.remove('show'); setTimeout(() => d.remove(), 300); }, 3500);
    // cap feed
    while (this.killfeed.children.length > 6) this.killfeed.firstChild.remove();
  }

  showMultikill(text) {
    this.multikill.textContent = text;
    this.multikill.classList.remove('show');
    void this.multikill.offsetWidth;
    this.multikill.classList.remove('hidden');
    this.multikill.classList.add('show');
  }

  showWaveBanner(n, sub = '') {
    this.waveBanner.innerHTML = `<div class="wb-main">WAVE ${n}</div><div class="wb-sub">${sub}</div>`;
    this.waveBanner.classList.remove('show');
    void this.waveBanner.offsetWidth;
    this.waveBanner.classList.remove('hidden');
    this.waveBanner.classList.add('show');
  }

  // U2: damage direction indicator arc.
  damageDirection(angleRad) {
    this.dmgDir.classList.remove('hidden');
    this.dmgDir.style.transform = `translate(-50%,-50%) rotate(${angleRad}rad)`;
    this.dmgDir.style.opacity = '1';
    this._dmgT = 0.5;
  }
  hitVignetteFlash() {
    this.hitVig.style.opacity = '0.7';
    this._hitVigT = 0.2;
  }

  showPrompt(text) {
    this.prompt.textContent = text;
    this.prompt.classList.add('show');
  }
  hidePrompt() { this.prompt.classList.remove('show'); }

  setGod(on) {
    this.godBadge.classList.toggle('hidden', !on);
    this.hpGodBadge.classList.toggle('hidden', !on);
  }

  // per-frame: spring score, hp bar, decay damage indicators
  update(dt) {
    this.scoreDisplay += (this.scoreTarget - this.scoreDisplay) * Math.min(1, dt * 8);
    if (Math.abs(this.scoreTarget - this.scoreDisplay) < 1) this.scoreDisplay = this.scoreTarget;
    this.scoreNum.textContent = String(Math.round(this.scoreDisplay));
    // hp bar
    this.hpSpring.update(dt);
    this.hpFill.style.width = (this.hpSpring.value * 100) + '%';
    // hitmarker: quick scale-punch then fade
    if (this._hm.active) {
      this._hm.t += dt;
      const p = this._hm.t / this._hm.dur;
      if (p >= 1) { this._hm.active = false; this.hitmark.style.opacity = '0'; }
      else {
        this.hitmark.style.opacity = String(1 - p * p);
        const s = 1 + (this._hm.s0 - 1) * Math.max(0, 1 - p * 2.5);
        this.hitmarkInner.style.transform = `translate(-50%,-50%) scale(${s})`;
      }
    }
    // damage dir decay
    if (this._dmgT > 0) {
      this._dmgT -= dt;
      this.dmgDir.style.opacity = String(Math.max(0, this._dmgT / 0.5));
      if (this._dmgT <= 0) this.dmgDir.classList.add('hidden');
    }
    if (this._hitVigT > 0) {
      this._hitVigT -= dt;
      this.hitVig.style.opacity = String(Math.max(0, this._hitVigT / 0.2) * 0.7);
    }
    // low-hp vignette (driven by main)
  }

  setLowHp(on) { this._lowHp = on; }
  updateLowHp(dt, hp) {
    if (this._lowHp) {
      const p = 0.5 + 0.5 * Math.sin(performance.now() * 0.005);
      this.dmgVig.style.opacity = String(0.3 + 0.3 * p);
    } else {
      this.dmgVig.style.opacity = String(Math.max(0, 1 - hp / 30) * 0.4);
    }
  }

  dispose() {
    this.cross.remove();
    this.hitmark.remove();
  }
}
