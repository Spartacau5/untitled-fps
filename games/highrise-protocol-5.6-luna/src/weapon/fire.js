import * as THREE from "three";

export const TUNING = {
  rpm: 700, // rounds per minute
  magazineSize: 30, // rounds
  reserveAmmo: 9999, // rounds
  hipSpread: 0.026, // normalized screen cone
  adsSpread: 0.006, // normalized screen cone
  crouchSpreadScale: 0.76, // ratio
};

export class FireController {
  constructor({ camera, rng, raycastables, onShot, onReload, onDry }) {
    this.camera = camera;
    this.rng = rng;
    this.raycastables = raycastables;
    this.onShot = onShot;
    this.onReload = onReload;
    this.onDry = onDry;
    this.ammo = TUNING.magazineSize;
    this.reserve = TUNING.reserveAmmo;
    this.accumulator = 60 / TUNING.rpm;
    this.shotIndex = 0;
    this.raycaster = new THREE.Raycaster();
    this.screenPoint = new THREE.Vector2();
  }

  update(dt, input, context) {
    if (input.pressed("KeyR")) this.onReload?.();
    if (context.reloadActive) return;
    this.accumulator += dt;
    const holding = input.mouseHeld(0);
    if (!holding) {
      this.accumulator = Math.min(this.accumulator, 60 / TUNING.rpm);
      return;
    }
    const interval = 60 / TUNING.rpm;
    while (this.accumulator >= interval && this.ammo > 0 && holding) {
      this.accumulator -= interval;
      this.fire(context);
    }
    if (holding && this.ammo <= 0 && this.accumulator >= interval) this.onDry?.();
  }

  stop() { this.accumulator = 60 / TUNING.rpm; }

  fire(context) {
    const ads = context.adsBlend;
    const moving = Math.min(1, context.player.speed / 5.5);
    const crouch = context.player.crouch.value;
    const spread = (TUNING.hipSpread + (TUNING.adsSpread - TUNING.hipSpread) * ads) * (1 + moving * 0.55) * (1 - crouch * (1 - TUNING.crouchSpreadScale));
    this.screenPoint.set(this.rng.signed() * spread, this.rng.signed() * spread);
    this.camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(this.screenPoint, this.camera);
    if (![this.raycaster.ray.origin.x, this.raycaster.ray.origin.y, this.raycaster.ray.origin.z, this.raycaster.ray.direction.x, this.raycaster.ray.direction.y, this.raycaster.ray.direction.z].every(Number.isFinite)) return;
    const hits = this.raycaster.intersectObjects(this.raycastables, true);
    const hit = hits[0] || null;
    const origin = this.raycaster.ray.origin.clone();
    const direction = this.raycaster.ray.direction.clone();
    const shot = { origin, direction, hit, spread, ads, shotIndex: this.shotIndex, ammoBefore: this.ammo, confirmedHit: Boolean(hit?.object?.userData?.hitZone), hitZone: hit?.object?.userData?.hitZone || null };
    this.ammo -= 1;
    this.shotIndex += 1;
    this.onShot?.(shot);
  }

  completeReload() {
    const needed = TUNING.magazineSize - this.ammo;
    const loaded = Math.min(needed, this.reserve);
    this.ammo += loaded;
    this.reserve -= loaded;
    this.shotIndex = 0;
  }

  reset() {
    this.ammo = TUNING.magazineSize;
    this.reserve = TUNING.reserveAmmo;
    this.accumulator = 60 / TUNING.rpm;
    this.shotIndex = 0;
  }
}
