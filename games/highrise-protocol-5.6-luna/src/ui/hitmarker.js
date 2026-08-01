import { Easing, Spring } from "../core/spring.js";

export class Hitmarker {
  constructor(root, rng) {
    this.root = root;
    this.rng = rng;
    this.active = [];
    this.max = 24;
  }

  show({ kill = false, damage = 0, headshot = false }) {
    const marker = document.createElement("div");
    marker.className = `hitmarker ${kill ? "kill" : ""}`;
    marker.innerHTML = kill ? "✕" : "×";
    marker.style.setProperty("--x", `${this.rng.range(-18, 18).toFixed(1)}px`);
    marker.style.setProperty("--y", `${this.rng.range(-12, 12).toFixed(1)}px`);
    this.root.appendChild(marker);
    const number = document.createElement("div");
    number.className = `damage-number ${headshot ? "headshot" : ""}`;
    number.textContent = `${Math.round(damage)}`;
    number.style.setProperty("--x", `${this.rng.range(-40, 40).toFixed(1)}px`);
    number.style.setProperty("--y", `${this.rng.range(-17, 17).toFixed(1)}px`);
    this.root.appendChild(number);
    this.active.push({ marker, number, life: 0.36, maxLife: 0.36, scale: new Spring(0.65, 18, 0.68) });
    if (this.active.length > this.max) this.remove(this.active[0]);
  }

  remove(item) { item.marker.remove(); item.number.remove(); this.active.splice(this.active.indexOf(item), 1); }

  update(dt) {
    for (let index = this.active.length - 1; index >= 0; index -= 1) {
      const item = this.active[index];
      item.life -= dt;
      item.scale.target = item.life > item.maxLife - 0.06 ? 1.12 : 1;
      item.scale.update(dt);
      const progress = 1 - item.life / item.maxLife;
      const opacity = Math.max(0, 1 - progress);
      const rise = Easing.easeOutCubic(progress) * 24;
      item.marker.style.opacity = String(opacity);
      item.marker.style.transform = `translate(calc(-50% + var(--x)), calc(-50% + var(--y) - ${rise}px)) scale(${item.scale.value})`;
      item.number.style.opacity = String(opacity);
      item.number.style.transform = `translate(calc(-50% + var(--x)), calc(-50% + var(--y) - ${rise * 1.4}px)) scale(${item.scale.value})`;
      if (item.life <= 0) this.remove(item);
    }
  }
}
