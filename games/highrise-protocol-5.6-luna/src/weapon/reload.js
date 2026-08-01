import * as THREE from "three";
import { Easing } from "../core/spring.js";

export const TUNING = {
  emptyDuration: 2.0, // seconds
  tacticalDuration: 1.65, // seconds
  dropAngle: -0.42, // radians
  inwardAngle: 0.22, // radians
  dropDistance: 0.12, // meters
  magRiseDistance: 0.16, // meters
};

export class ReloadTimeline {
  constructor() {
    this.active = false;
    this.elapsed = 0;
    this.duration = TUNING.emptyDuration;
    this.empty = true;
    this.events = [];
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
    this.pose = { position: this.position, rotation: this.rotation };
    this.lastElapsed = 0;
  }

  start(ammo, magazineSize) {
    if (this.active) return false;
    this.empty = ammo <= 0;
    this.duration = this.empty ? TUNING.emptyDuration : TUNING.tacticalDuration;
    this.elapsed = 0;
    this.lastElapsed = 0;
    this.active = true;
    this.events.length = 0;
    return true;
  }

  cancel() {
    if (!this.active) return;
    this.events.push("abort");
    this.active = false;
    this.elapsed = 0;
    this.position.set(0, 0, 0);
    this.rotation.set(0, 0, 0);
  }

  update(dt) {
    if (!this.active) {
      this.position.set(0, 0, 0);
      this.rotation.set(0, 0, 0);
      return;
    }
    this.lastElapsed = this.elapsed;
    this.elapsed = Math.min(this.duration, this.elapsed + dt);
    const t = this.elapsed / this.duration;
    const crossed = (at) => this.lastElapsed / this.duration < at && t >= at;
    if (crossed(0.12)) this.events.push("magRelease");
    if (crossed(0.27)) this.events.push("magEject");
    if (crossed(0.57)) this.events.push("magInsert");
    if (this.empty && crossed(0.72)) this.events.push("handleRack");
    if (this.elapsed >= this.duration) {
      this.active = false;
      this.events.push("complete");
    }

    const dropT = Easing.easeOutCubic(Math.min(1, t / 0.18));
    const recoverT = Easing.easeInOutCubic(Math.max(0, Math.min(1, (t - 0.68) / 0.32)));
    const magT = Easing.easeOutBack(Math.max(0, Math.min(1, (t - 0.26) / 0.34)));
    const impact = t > 0.56 && t < 0.66 ? Math.sin(((t - 0.56) / 0.1) * Math.PI) : 0;
    this.position.set(
      -0.055 * dropT + 0.034 * recoverT,
      -TUNING.dropDistance * dropT + TUNING.magRiseDistance * magT + impact * 0.018,
      0.02 * dropT,
    );
    this.rotation.set(
      TUNING.dropAngle * dropT * (1 - recoverT),
      TUNING.inwardAngle * dropT * (1 - recoverT),
      -0.18 * dropT + 0.06 * impact,
    );
  }

  consumeEvents() { const events = this.events.slice(); this.events.length = 0; return events; }
  getPose() { return this.pose; }
}
