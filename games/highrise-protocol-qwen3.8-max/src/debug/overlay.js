// ---------------------------------------------------------------------------
// debug/overlay.js — backquote (`) telemetry (P4): FPS, frame ms, draw calls,
// active particles / ragdolls / AI, pool utilization, PRNG seed, LIVE sway
// spring values and ADS floors (K7), restart counter + leak tracking (K6).
// ---------------------------------------------------------------------------
import { SEED } from '../core/rng.js';

export const track = {
  lights: 0,
  audioNodes: 0,
  restarts: 0,
  light() { this.lights++; },
  reset() { this.lights = 0; this.audioNodes = 0; },
};

export class Overlay {
  constructor(ctx) {
    this.ctx = ctx;
    this.visible = false;
    this._t = 0;
    this.el = document.createElement('div');
    this.el.style.cssText = `position:fixed;left:12px;top:12px;z-index:50;pointer-events:none;
      font:11px/1.55 'SF Mono','Consolas',monospace;color:#9fe8a0;background:rgba(6,10,8,.72);
      padding:10px 14px;border:1px solid rgba(120,255,140,.25);white-space:pre;display:none;`;
    document.body.appendChild(this.el);
  }

  toggle() {
    this.visible = !this.visible;
    this.el.style.display = this.visible ? 'block' : 'none';
  }

  update(dt) {
    if (!this.visible) return;
    this._t += dt;
    if (this._t < 0.25) return;
    this._t = 0;
    const ctx = this.ctx;
    const loop = ctx.loop;
    const info = ctx.renderer.info;
    const sway = ctx.sway.debug();
    const shells = ctx.fx.shells.stats();
    const lines = [
      `HIGHRISE TELEMETRY`,
      `fps        ${loop.fps.toFixed(1)}   frame ${loop.frameMs.toFixed(2)} ms`,
      `draw calls ${info.render.calls}   tris ${(info.render.triangles / 1000).toFixed(1)}k`,
      `time scale ${ctx.time.scale.toFixed(3)}`,
      ``,
      `particles  ${ctx.fx.particles.stats()}   decals ${ctx.fx.decals.pool.stats().active}`,
      `shells ${shells.shells}  mags ${shells.mags}   ragdolls ${ctx.ragdolls.stats()}   ai ${ctx.enemies.list.length}`,
      `pool reuse shells:${ctx.fx.shells.pool.stats().reuses} decals:${ctx.fx.decals.pool.stats().reuses}`,
      ``,
      `sway yaw   ${sway.yaw}  vel ${sway.yawV}`,
      `sway pitch ${sway.pitch}   roll ${sway.roll}`,
      `sway muzzle ${sway.muzzle}  turnRate ${sway.rate}`,
      `${ctx.ads.debug()}`,
      `recoil bloom ${ctx.recoil.spreadBloom().toFixed(2)}  shots ${ctx.recoil.shots}`,
      ``,
      `prng seed  0x${SEED.toString(16).toUpperCase()}  draws ${ctx.rng.count}`,
      `restarts   ${track.restarts}   listeners ${ctx.input.trackListenerCount()}  lights ${track.lights}`,
      `audio ctx  ${ctx.audio.bus.ready ? 'live' : 'locked'}  voices ${ctx.audio.bus.voices}`,
    ];
    this.el.textContent = lines.join('\n');
  }
}
