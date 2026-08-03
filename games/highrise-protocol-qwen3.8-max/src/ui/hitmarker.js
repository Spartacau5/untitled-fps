// ---------------------------------------------------------------------------
// ui/hitmarker.js — white X tick on hit, red X on kill (F4). Scale pops with
// easeOutBack; kill markers hit harder and linger a touch longer.
// ---------------------------------------------------------------------------
import { Ease, clamp } from '../core/spring.js';

export class Hitmarker {
  constructor(root) {
    const box = document.createElement('div');
    box.style.cssText = 'position:absolute;left:50%;top:50%;pointer-events:none;opacity:0;';
    let html = '';
    for (let i = 0; i < 4; i++) {
      html += `<div style="position:absolute;width:11px;height:2.5px;background:#fff;
        box-shadow:0 0 4px rgba(0,0,0,.7);"></div>`;
    }
    box.innerHTML = html;
    root.appendChild(box);
    this.box = box;
    this.ticks = [...box.children];
    this.t = -1;
    this.dur = 0.16;
    this.kill = false;
  }

  show(kind, headshot) {
    this.kill = kind === 'kill';
    this.t = 0;
    this.dur = this.kill ? 0.24 : 0.15;
    const color = this.kill ? '#ff4a3c' : '#ffffff';
    for (const el of this.ticks) el.style.background = color;
    if (this.kill && headshot) {
      for (const el of this.ticks) el.style.background = '#ffb454';
    }
  }

  update(dt) {
    if (this.t < 0) return;
    this.t += dt;
    const k = this.t / this.dur;
    if (k >= 1) { this.t = -1; this.box.style.opacity = '0'; return; }
    // snappy pop with overshoot, then fade
    const pop = 1.45 - 0.45 * Ease.outBack(Math.min(k * 2.2, 1));
    const size = this.kill ? 1.25 : 1;
    this.box.style.opacity = `${1 - Ease.inQuad(clamp((k - 0.55) / 0.45, 0, 1))}`;
    const d = 7 * pop;
    const c = Math.SQRT1_2;
    const offs = [
      [-d - 11 * c, -d - 2, 45],
      [d, -d - 2, -45],
      [-d - 11 * c, d, -45],
      [d, d, 45],
    ];
    for (let i = 0; i < 4; i++) {
      this.ticks[i].style.transform =
        `translate(${offs[i][0] * size}px, ${offs[i][1] * size}px) rotate(${offs[i][2]}deg) scale(${size})`;
    }
  }
}
