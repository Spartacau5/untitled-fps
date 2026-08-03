// ---------------------------------------------------------------------------
// weapon/reload.js — R-key, ~2 s, a keyframed timeline with eased segments.
// Beat-for-beat: drop/tilt -> mag release + eject -> fresh mag slam -> bolt
// rack (empty only). Tactical keeps the chambered round & skips the bolt (R3).
// Sprint cancels with an eased abort; the rig is never stranded mid-pose (R3).
// Look-lag & movement motion keep running underneath at reduced weight (R4).
// ---------------------------------------------------------------------------
import { Spring, Timeline, Ease } from '../core/spring.js';

export const TUNING = {
  MAG_SIZE: 30,
  EMPTY_TIME: 2.05,      // s
  TACTICAL_TIME: 1.55,
  ABORT_K: 260, ABORT_D: 30, // eased abort, quick but never a cut
};

// Channel keyframes: [time, value, ease-into-this-key]
const EMPTY_TRACKS = {
  gx:   [[0, 0], [0.16, -0.052, Ease.outCubic], [1.75, -0.052], [2.05, 0, Ease.inOutCubic]],
  gy:   [[0, 0], [0.16, -0.058, Ease.outCubic], [1.05, -0.046], [1.9, -0.058], [2.05, 0, Ease.inOutCubic]],
  gz:   [[0, 0], [0.16, 0.062, Ease.outCubic], [1.9, 0.062], [2.05, 0, Ease.inOutCubic]],
  grx:  [[0, 0], [0.18, 0.12, Ease.outCubic], [1.9, 0.10], [2.05, 0, Ease.inOutCubic]],
  grz:  [[0, 0], [0.20, 0.18, Ease.outCubic], [1.9, 0.16], [2.05, 0, Ease.inOutCubic]],
  magOldY:  [[0, 0], [0.32, 0], [0.46, -0.36, Ease.inCubic]],
  magOldRZ: [[0, 0], [0.32, 0], [0.46, 0.55, Ease.inCubic]],
  magNewY:  [[0, -0.32], [0.70, -0.32], [1.04, 0.006, Ease.outBack]],
  magNewRZ: [[0, -0.5], [0.70, -0.5], [1.04, 0, Ease.outBack]],
  boltZ: [[0, 0], [1.24, 0], [1.38, 0.055, Ease.outQuad], [1.52, 0.055], [1.64, 0, Ease.inQuad]],
  camRoll: [[0, 0], [0.22, -0.028, Ease.outCubic], [1.9, -0.028], [2.05, 0, Ease.inOutCubic]],
};

const TACTICAL_TRACKS = {
  gx:   [[0, 0], [0.15, -0.05, Ease.outCubic], [1.28, -0.05], [1.55, 0, Ease.inOutCubic]],
  gy:   [[0, 0], [0.15, -0.055, Ease.outCubic], [1.28, -0.055], [1.55, 0, Ease.inOutCubic]],
  gz:   [[0, 0], [0.15, 0.058, Ease.outCubic], [1.28, 0.058], [1.55, 0, Ease.inOutCubic]],
  grx:  [[0, 0], [0.17, 0.11, Ease.outCubic], [1.28, 0.10], [1.55, 0, Ease.inOutCubic]],
  grz:  [[0, 0], [0.19, 0.16, Ease.outCubic], [1.28, 0.15], [1.55, 0, Ease.inOutCubic]],
  magOldY:  [[0, 0], [0.30, 0], [0.42, -0.36, Ease.inCubic]],
  magOldRZ: [[0, 0], [0.30, 0], [0.42, 0.55, Ease.inCubic]],
  magNewY:  [[0, -0.32], [0.66, -0.32], [0.98, 0.006, Ease.outBack]],
  magNewRZ: [[0, -0.5], [0.66, -0.5], [0.98, 0, Ease.outBack]],
  boltZ: [[0, 0]],
  camRoll: [[0, 0], [0.20, -0.026, Ease.outCubic], [1.3, -0.026], [1.55, 0, Ease.inOutCubic]],
};

const OUT_KEYS = ['gx', 'gy', 'gz', 'grx', 'grz', 'magOldY', 'magOldRZ',
  'magNewY', 'magNewRZ', 'boltZ', 'camRoll'];

export class Reload {
  constructor() {
    this._emptyTL = new Timeline(EMPTY_TRACKS);
    this._tactTL = new Timeline(TACTICAL_TRACKS);
    this.state = 'idle';            // idle | running | abort
    this.tactical = false;
    this.t = 0;
    this.weight = new Spring(TUNING.ABORT_K, TUNING.ABORT_D, 0);
    this.cur = this._blank();
    this._evQ = [];
  }

  _blank() {
    const o = { w: 0 };
    for (const k of OUT_KEYS) o[k] = 0;
    return o;
  }

  reset() {
    this.state = 'idle'; this.t = 0; this.weight.set(0);
    this.cur = this._blank(); this._evQ.length = 0;
  }

  get active() { return this.state === 'running'; }
  get locking() { return this.state === 'running'; } // fire locked while running (R3)

  start(tactical, ammoInMag) {
    if (this.state === 'running') return false;
    this.state = 'running';
    this.tactical = tactical;
    this.t = 0;
    this.weight.set(0);
    this.weight.target = 1;
    this._evQ.length = 0;
    const ejectT = tactical ? 0.42 : 0.46;
    const slamT = tactical ? 0.98 : 1.04;
    this._evQ.push({ t: 0.02, ev: 'release' });
    this._evQ.push({ t: ejectT, ev: 'eject' });
    this._evQ.push({ t: slamT, ev: 'slam' });
    if (!tactical) this._evQ.push({ t: 1.30, ev: 'boltBack' }, { t: 1.64, ev: 'boltHome' });
    this._evQ.push({ t: (tactical ? TUNING.TACTICAL_TIME : TUNING.EMPTY_TIME) - 0.02, ev: 'done' });
    this._pendingAmmo = { tactical, ammoInMag };
    return true;
  }

  abort() {
    if (this.state !== 'running') return;
    this.state = 'abort';
    this.weight.target = 0;   // eased return to neutral — never stranded (R3)
  }

  cameraRoll() { return this.cur.camRoll * this.cur.w; }

  // dt: fixed step. ctrl used for sprint-cancel. Returns events for audio/fx.
  update(dt, ctrl, viewmodel) {
    const events = [];
    // R3: sprint cancels the reload with a quick eased abort.
    if (this.state === 'running' && (ctrl.sprinting || ctrl.sliding)) this.abort();

    if (this.state === 'running') {
      this.t += dt;
      while (this._evQ.length && this.t >= this._evQ[0].t) {
        const e = this._evQ.shift();
        events.push(e.ev);
        if (e.ev === 'slam') viewmodel.magSlam();
        if (e.ev === 'done') { this.state = 'idle'; this.weight.target = 0; }
      }
    }
    this.weight.update(dt);

    if (this.state === 'abort' && this.weight.value < 0.03 && Math.abs(this.weight.vel) < 0.1) {
      this.state = 'idle'; this.t = 0;
    }

    const tl = this.tactical ? this._tactTL : this._emptyTL;
    if (this.state === 'idle' && this.weight.value < 0.01) {
      this.cur = this._blank();
    } else {
      tl.sample(this.t, this.cur);
      this.cur.w = this.weight.value;
      for (const k of OUT_KEYS) this.cur[k] *= this.weight.value;
    }
    return events;
  }

  // Ammo bookkeeping at reload END (called by fire.js on 'done').
  resolveAmmo(reserve) {
    const { tactical, ammoInMag } = this._pendingAmmo || { tactical: true, ammoInMag: 0 };
    if (tactical) {
      const need = TUNING.MAG_SIZE - ammoInMag;
      const take = Math.min(need, reserve);
      return { mag: ammoInMag + take, reserve: reserve - take };
    }
    const take = Math.min(TUNING.MAG_SIZE, reserve);
    return { mag: take, reserve: reserve - take };
  }
}
