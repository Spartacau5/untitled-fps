import { Spring, damp } from "../core/spring.js";
import { Crosshair } from "./crosshair.js?v=20260802-1";
import { Hitmarker } from "./hitmarker.js";

export class HUD {
  constructor(container, rng) {
    this.root = document.createElement("div");
    this.root.id = "hud";
    this.root.innerHTML = `
      <div class="hud-top"><div><div class="hud-label">WAVE</div><div id="wave-value" class="hud-value">00</div></div><div><div class="hud-label">SCORE</div><div id="score-value" class="hud-value">000000</div></div></div>
      <div id="health-wrap"><div id="health-bar"></div><div id="health-text">HP 100</div></div>
      <div id="ammo"><div id="weapon-name">ACR / 700 RPM</div><div id="ammo-mag">30</div><div id="ammo-reserve">9999 RESERVE</div></div>
      <div id="wave-banner"><div class="eyebrow">THREAT ESCALATION</div><div class="title">WAVE 01</div></div>
      <div id="kill-feed"></div>
      <div id="hint">CLICK TO DEPLOY &nbsp; · &nbsp; WASD MOVE &nbsp; · &nbsp; SHIFT SPRINT &nbsp; · &nbsp; CTRL CROUCH &nbsp; · &nbsp; RMB ADS &nbsp; · &nbsp; LMB FIRE<br>SPACE JUMP &nbsp; · &nbsp; R RELOAD &nbsp; · &nbsp; T AIM SELF-TEST &nbsp; · &nbsp; BACKQUOTE DEBUG</div>
      <div id="damage-vignette"></div>
      <div id="damage-arc"></div>
      <div id="pause"><div id="pause-card"><strong>POINTER LOCK LOST</strong><span>Click the arena to resume</span></div></div>
      <div id="death-card"><div class="death-inner"><strong>SIGNAL LOST</strong><span>PRESS ENTER TO REDEPLOY</span></div></div>`;
    container.appendChild(this.root);
    this.crosshair = new Crosshair(this.root);
    this.hitmarker = new Hitmarker(this.root, rng);
    this.waveValue = this.root.querySelector("#wave-value");
    this.scoreValue = this.root.querySelector("#score-value");
    this.ammoMag = this.root.querySelector("#ammo-mag");
    this.ammoReserve = this.root.querySelector("#ammo-reserve");
    this.healthBar = this.root.querySelector("#health-bar");
    this.healthText = this.root.querySelector("#health-text");
    this.banner = this.root.querySelector("#wave-banner");
    this.bannerTitle = this.root.querySelector(".title");
    this.feed = this.root.querySelector("#kill-feed");
    this.hint = this.root.querySelector("#hint");
    this.pause = this.root.querySelector("#pause");
    this.death = this.root.querySelector("#death-card");
    this.vignette = this.root.querySelector("#damage-vignette");
    this.damageArc = this.root.querySelector("#damage-arc");
    this.ammoPunch = new Spring(1, 18, 0.68);
    this.health = new Spring(100, 10, 0.88);
    this.vignetteSpring = new Spring(0, 9, 0.8);
    this.damageArcSpring = new Spring(0, 15, 0.72);
    this.bannerSpring = new Spring(0, 12, 0.72);
    this.bannerTimer = 0;
    this.score = 0;
    this.lastAmmo = 30;
  }

  update(dt, state) {
    this.health.target = state.health;
    this.health.update(dt);
    this.healthBar.style.transform = `scaleX(${Math.max(0, this.health.value / 100)})`;
    this.healthText.textContent = `HP ${Math.ceil(Math.max(0, this.health.value))}`;
    this.ammoMag.textContent = String(state.ammo);
    this.ammoReserve.textContent = `${state.reserve} RESERVE`;
    if (state.ammo < this.lastAmmo) this.ammoPunch.impulse(0.85);
    this.lastAmmo = state.ammo;
    this.ammoPunch.target = 1;
    this.ammoPunch.update(dt);
    this.ammoMag.style.transform = `scale(${1 + Math.max(0, this.ammoPunch.value - 1) * 0.25})`;
    this.waveValue.textContent = String(state.wave).padStart(2, "0");
    this.scoreValue.textContent = String(this.score).padStart(6, "0");
    this.vignetteSpring.target = state.damageFlash ? 1 : 0;
    this.vignetteSpring.update(dt);
    this.vignette.style.opacity = String(this.vignetteSpring.value);
    this.damageArcSpring.target = 0;
    this.damageArcSpring.update(dt);
    this.damageArc.style.opacity = String(this.damageArcSpring.value);
    this.crosshair.update(dt, { moving: Math.min(1, state.speed / 6), firing: state.firing, adsBlend: state.adsBlend });
    this.hitmarker.update(dt);
    if (this.bannerTimer > 0) this.bannerTimer -= dt;
    this.bannerSpring.target = this.bannerTimer > 0 ? 1 : 0;
    this.bannerSpring.update(dt);
    const bannerY = (1 - this.bannerSpring.value) * -28;
    this.banner.style.opacity = String(this.bannerSpring.value);
    this.banner.style.transform = `translate(-50%, ${bannerY}px) scale(${0.88 + this.bannerSpring.value * 0.12})`;
  }

  showWave(wave) { this.bannerTitle.textContent = `WAVE ${String(wave).padStart(2, "0")}`; this.bannerTimer = 2.5; }
  addScore(value) { this.score += value; }
  showHit(data) { this.hitmarker.show(data); this.crosshair.punch(); }
  showDamage(direction = { x: 0, z: 1 }) {
    const angle = Math.atan2(direction.x, direction.z) * 180 / Math.PI;
    this.damageArc.style.setProperty("--angle", `${angle}deg`);
    this.damageArcSpring.impulse(1.1);
  }
  addFeed(text, kill = false) {
    const entry = document.createElement("div");
    entry.className = "feed-entry";
    entry.textContent = `${kill ? "✕" : "•"} ${text}`;
    this.feed.prepend(entry);
    requestAnimationFrame(() => entry.classList.add("show"));
    setTimeout(() => entry.remove(), 2800);
  }
  hideHint() { this.hint.classList.add("hidden"); }
  setPaused(value) { this.pause.classList.toggle("show", value); }
  showDeath(value) { this.death.classList.toggle("show", value); }
}
