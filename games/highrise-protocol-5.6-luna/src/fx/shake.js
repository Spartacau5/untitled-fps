import * as THREE from "three";

export class ShakeFX {
  constructor(camera) { this.camera = camera; }
  fire(strength = 0.014, direction = new THREE.Vector3(0.2, 0.7, 0)) { this.camera.addShake(strength, direction); }
  damage(strength = 0.08, direction = new THREE.Vector3()) { this.camera.addShake(strength, direction); }
  hit(strength = 0.028) { this.camera.addShake(strength, new THREE.Vector3(0.2, 0.5, 0.15)); }
}
