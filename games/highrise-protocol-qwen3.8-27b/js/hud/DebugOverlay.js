// P4: ` debug overlay — FPS, frame ms, draw calls, active particles/ragdolls/
// AI, pool utilization, PRNG seed.
import { SEED } from '../core/PRNG.js';

export class DebugOverlay {
  constructor() {
    this.el = document.getElementById('debug');
    this.visible = false;
    this.fps = 0;
    this.frameMs = 0;
    this._acc = 0; this._n = 0;
  }
  toggle() {
    this.visible = !this.visible;
    this.el.classList.toggle('hidden', !this.visible);
    return this.visible;
  }
  frame(dt) {
    if (!this.visible) return;
    this._acc += dt; this._n++;
    this.frameMs = dt * 1000;
    if (this._acc >= 0.4) {
      this.fps = this._n / this._acc;
      this._acc = 0; this._n = 0;
    }
  }
  set(data) {
    if (!this.visible) return;
    const fps = Math.round(this.fps);
    const col = fps < 30 ? '#ff5a5a' : fps < 50 ? '#ffce7a' : '#7dffb0';
    this.el.innerHTML = `
      <b>FPS</b> <span style="color:${col}">${fps}</span> &nbsp; <b>ms</b> ${this.frameMs.toFixed(2)}
      <br><b>draw calls</b> ${data.drawCalls}
      <br><b>particles</b> ${data.particles}
      <br><b>shells</b> ${data.shells}
      <br><b>decals</b> ${data.decals}
      <br><b>ragdolls</b> ${data.ragdolls}
      <br><b>AI alive</b> ${data.ai}
      <br><b>tracers</b> ${data.tracers}
      <br><b>pool util</b> ${data.poolUtil}
      <br><b>seed</b> 0x${SEED.toString(16).toUpperCase()}
      <br><b>timeScale</b> ${data.timeScale}
      <br><b>fov</b> ${data.fov}
      <br><b>quality</b> ${data.quality}`;
  }
}
