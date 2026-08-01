import { Spring } from "../core/spring.js";

export const TUNING = {
  transitionHz: 18, // Hz
  damping: 0.92, // ratio
  lookLagFloor: 0.32, // ratio
  bobFloor: 0.25, // ratio
  breathFloor: 0.35, // ratio
  recoilFloor: 0.61, // ratio
};

export class WeaponADS {
  constructor() { this.spring = new Spring(0, TUNING.transitionHz, TUNING.damping); }
  update(dt, held) {
    this.spring.target = held ? 1 : 0;
    this.spring.update(dt);
    this.spring.value = Math.min(1, Math.max(0, this.spring.value));
    return this.spring.value;
  }
  get blend() { return this.spring.value; }
  get multipliers() {
    return {
      lookLag: Math.max(TUNING.lookLagFloor, 1 - this.blend * (1 - TUNING.lookLagFloor)),
      bob: Math.max(TUNING.bobFloor, 1 - this.blend * (1 - TUNING.bobFloor)),
      breath: Math.max(TUNING.breathFloor, 1 - this.blend * (1 - TUNING.breathFloor)),
      recoil: Math.max(TUNING.recoilFloor, 1 - this.blend * (1 - TUNING.recoilFloor)),
    };
  }
}
