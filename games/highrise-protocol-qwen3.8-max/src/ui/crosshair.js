// ---------------------------------------------------------------------------
// ui/crosshair.js — 4 lines + dot, spring-bloomed (F3). Blooms while firing
// and moving, tightens when still, fades fully in ADS. Nothing teleports.
// ---------------------------------------------------------------------------
import { Spring, clamp } from '../core/spring.js';

export class Crosshair {
  constructor(root) {
    const box = document.createElement('div');
    box.style.cssText = 'position:absolute;left:50%;top:50%;pointer-events:none;';
    box.innerHTML = `
      <div class="ch-dot" style="position:absolute;left:-1.5px;top:-1.5px;width:3px;height:3px;
        background:#fff;border-radius:50%;box-shadow:0 0 3px rgba(0,0,0,.8);"></div>
      <div class="ch-l" style="position:absolute;width:9px;height:2px;background:#fff;
        box-shadow:0 0 3px rgba(0,0,0,.8);"></div>
      <div class="ch-r" style="position:absolute;width:9px;height:2px;background:#fff;
        box-shadow:0 0 3px rgba(0,0,0,.8);"></div>
      <div class="ch-t" style="position:absolute;width:2px;height:9px;background:#fff;
        box-shadow:0 0 3px rgba(0,0,0,.8);"></div>
      <div class="ch-b" style="position:absolute;width:2px;height:9px;background:#fff;
        box-shadow:0 0 3px rgba(0,0,0,.8);"></div>`;
    root.appendChild(box);
    this.box = box;
    this.l = box.querySelector('.ch-l'); this.r = box.querySelector('.ch-r');
    this.t = box.querySelector('.ch-t'); this.b = box.querySelector('.ch-b');
    // bloom spring: kicked per shot, decays — under-damped so it breathes
    this.gap = new Spring(140, 17, 7);
    this.fade = new Spring(120, 20, 1);
  }

  fireImpulse() { this.gap.impulse(16); }

  update(dt, ctx) {
    const move = clamp(ctx.controller.speedH / 9, 0, 1) * 9;
    this.gap.target = 6.5 + move;
    this.gap.update(dt);
    this.fade.target = 1 - ctx.ads.value;
    this.fade.update(dt);

    const g = this.gap.value;
    this.l.style.transform = `translate(${-g - 9}px, -1px)`;
    this.r.style.transform = `translate(${g}px, -1px)`;
    this.t.style.transform = `translate(-1px, ${-g - 9}px)`;
    this.b.style.transform = `translate(-1px, ${g}px)`;
    this.box.style.opacity = `${clamp(this.fade.value, 0, 1)}`;
  }
}
