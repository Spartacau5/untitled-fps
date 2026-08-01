import * as THREE from "three";
import { Spring } from "../core/spring.js";

export const TUNING = {
  rusherHealth: 75, // hp
  gunnerHealth: 100, // hp
  heavyHealth: 220, // hp
  headMultiplier: 2, // ratio
  staggerThreshold: 28, // damage
  corpseSeconds: 6, // seconds
  useImportedAnimation: true, // use the authored clip while we correct its visible face separately
};

const COLORS = { rusher: 0x9e4e43, gunner: 0x4c7881, heavy: 0x8c7250 };

function material(color, metalness = 0.08) { return new THREE.MeshStandardMaterial({ color, roughness: 0.78, metalness }); }

export class Enemy {
  constructor(type, position, seedOffset, callbacks) {
    this.type = type;
    this.group = new THREE.Group();
    this.group.position.copy(position);
    this.seedOffset = seedOffset;
    this.callbacks = callbacks;
    this.velocity = new THREE.Vector3();
    this.toPlayer = new THREE.Vector3();
    this.lookTarget = new THREE.Vector3();
    this.aiDirection = new THREE.Vector3();
    this.aiDesired = new THREE.Vector3();
    this.phase = seedOffset * 3.1;
    this.speed = type === "rusher" ? 3.5 : (type === "gunner" ? 1.65 : 1.1);
    this.health = type === "rusher" ? TUNING.rusherHealth : (type === "gunner" ? TUNING.gunnerHealth : TUNING.heavyHealth);
    this.maxHealth = this.health;
    this.dead = false;
    this.reactionTimer = 0.35 + seedOffset * 0.18;
    this.attackCooldown = 0.8 + seedOffset * 0.25;
    this.hitFlash = new Spring(0, 20, 0.72);
    this.stagger = new Spring(0, 12, 0.74);
    this.flinch = new Spring(0, 14, 0.5);
    this.flashMaterials = [];
    this.hitboxes = [];
    this.plates = [];
    this.visualRoot = null;
    this.visualMixer = null;
    this.visualAction = null;
    this.visualHeadProxy = null;
    this.visualFaceStatic = null;
    this.visualHeadPhase = 0;
    this.build();
    this.attachVisualAsset(callbacks.visualAsset, callbacks.visualAnimations || []);
  }

  build() {
    const primary = material(COLORS[this.type]);
    const dark = material(0x10191e, 0.5);
    const flesh = material(0xb47663);
    const make = (geometry, position, mat, hitZone, scale = null) => {
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(...position);
      if (scale) mesh.scale.set(...scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (hitZone) {
        mesh.userData.enemy = this;
        mesh.userData.hitZone = hitZone;
        this.hitboxes.push(mesh);
      }
      this.group.add(mesh);
      return mesh;
    };
    make(new THREE.BoxGeometry(0.62, 0.92, 0.36), [0, 1.12, 0], primary, "body");
    make(new THREE.SphereGeometry(0.25, 12, 8), [0, 1.82, 0], flesh, "head");
    make(new THREE.BoxGeometry(0.16, 0.72, 0.18), [-0.46, 1.12, 0], dark, "body", [1, 0.9, 1]);
    make(new THREE.BoxGeometry(0.16, 0.72, 0.18), [0.46, 1.12, 0], dark, "body", [1, 0.9, 1]);
    make(new THREE.BoxGeometry(0.19, 0.84, 0.22), [-0.19, 0.33, 0], dark, "body");
    make(new THREE.BoxGeometry(0.19, 0.84, 0.22), [0.19, 0.33, 0], dark, "body");
    if (this.type === "heavy") {
      for (const x of [-0.25, 0, 0.25]) {
        const plate = make(new THREE.BoxGeometry(0.18, 0.42, 0.035), [x, 1.2, -0.21], material(0xb59e6e, 0.72), "plate");
        plate.userData.plate = true;
        this.plates.push(plate);
      }
    }
    this.group.traverse((node) => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; } });
    this.collectFlashMaterials(this.group);
  }

  // Hit feedback needs per-enemy material instances: the FBX visual is cloned
  // with shared materials, so clone them once here and register everything
  // that should glow red for the duration of the hit flash.
  collectFlashMaterials(root) {
    root.traverse((node) => {
      if (!node.isMesh || node.userData.plate) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const cloned = materials.map((mat) => {
        if (!mat || this.flashMaterials.includes(mat)) return mat;
        const copy = mat.clone();
        copy.emissive = copy.emissive || new THREE.Color(0x000000);
        this.flashMaterials.push(copy);
        return copy;
      });
      node.material = Array.isArray(node.material) ? cloned : cloned[0];
    });
    for (const mat of this.flashMaterials) {
      mat.emissive.setHex(0xff4632);
      mat.emissiveIntensity = 0;
    }
  }

  attachVisualAsset(root, animations = []) {
    if (!root || this.visualRoot) return false;
    this.group.traverse((node) => {
      if (node.isMesh && !node.userData.plate) node.visible = false;
    });
    this.visualRoot = root;
    const importedFace = root.getObjectByName("face");
    // The supplied face mesh has unstable skin weights in the authored clip;
    // at close range it explodes into oversized teeth and floating head arcs.
    // Keep the FBX body/animation, but use the bounded game head proxy.
    if (importedFace) importedFace.visible = false;
    root.position.set(0, 0, 0);
    // The supplied FBX already faces +Z. Rotating it by PI made every enemy
    // advance with its back toward the player and made the head read as a
    // detached piece while the walk clip was running.
    root.rotation.set(0, 0, 0);
    root.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(root);
    if (Number.isFinite(bounds.min.y)) root.position.y -= bounds.min.y;
    this.group.add(root);
    const sourceFaceMaterial = importedFace?.material ? (Array.isArray(importedFace.material) ? importedFace.material[0] : importedFace.material) : null;
    const faceMaterial = new THREE.MeshStandardMaterial({ color: 0x8a5b47, roughness: 0.82, metalness: 0.02 });
    if (sourceFaceMaterial?.map) {
      faceMaterial.map = sourceFaceMaterial.map;
      faceMaterial.color.setHex(0xffffff);
      faceMaterial.needsUpdate = true;
    }
    const headProxy = new THREE.Mesh(new THREE.SphereGeometry(0.205, 16, 12), faceMaterial);
    headProxy.position.set(0, 1.73, 0.015);
    headProxy.scale.set(0.98, 1.08, 0.94);
    headProxy.castShadow = true;
    headProxy.receiveShadow = true;
    const helmetMaterial = new THREE.MeshStandardMaterial({ color: 0x1a2527, roughness: 0.68, metalness: 0.08 });
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.238, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.56), helmetMaterial);
    helmet.position.set(0, 1.805, 0.01);
    helmet.scale.set(1, 0.82, 0.96);
    helmet.castShadow = true;
    this.group.add(headProxy, helmet);
    headProxy.visible = true;
    helmet.visible = true;
    this.visualHeadProxy = headProxy;
    this.collectFlashMaterials(root);
    this.collectFlashMaterials(headProxy);
    this.collectFlashMaterials(helmet);
    this.visualMixer = TUNING.useImportedAnimation && animations.length ? new THREE.AnimationMixer(root) : null;
    if (this.visualMixer) {
      const clip = animations.find((candidate) => /idle|walk|run|locomotion/i.test(candidate.name)) || animations[0];
      this.visualAction = this.visualMixer.clipAction(clip);
      this.visualAction.play();
    }
    return true;
  }

  update(dt, ai, context) {
    if (this.dead) return;
    ai.update(dt, this, context);
    this.visualMixer?.update(dt);
    this.phase += dt * (1.6 + this.speed * 0.2);
    this.visualHeadPhase += dt * (1.8 + this.speed * 0.24);
    this.group.position.addScaledVector(this.velocity, dt);
    this.group.position.x = THREE.MathUtils.clamp(this.group.position.x, -25, 25);
    this.group.position.z = THREE.MathUtils.clamp(this.group.position.z, -25, 25);
    const target = this.lookTarget.copy(context.player.position).sub(this.group.position);
    target.y = 0;
    if (target.lengthSq() > 0.01) {
      const desiredYaw = Math.atan2(target.x, target.z);
      this.group.rotation.y += Math.atan2(Math.sin(desiredYaw - this.group.rotation.y), Math.cos(desiredYaw - this.group.rotation.y)) * Math.min(1, dt * 8);
    }
    this.hitFlash.target = 0;
    this.stagger.target = 0;
    this.flinch.target = 0;
    this.hitFlash.update(dt);
    this.stagger.update(dt);
    this.flinch.update(dt);
    const glow = Math.max(0, this.hitFlash.value);
    for (const mat of this.flashMaterials) mat.emissiveIntensity = glow * 1.4;
    const walkBob = Math.sin(this.phase) * Math.min(0.06, this.velocity.length() * 0.012);
    this.group.position.y = Math.max(0, walkBob);
    this.group.rotation.z = this.stagger.value;
    // Flinch leans the whole body away from the shot for a few frames.
    this.group.rotation.x = -Math.max(0, this.flinch.value) * 0.13;
    if (this.visualHeadProxy) {
      this.visualHeadProxy.position.y = 1.73 + Math.sin(this.visualHeadPhase * 2.0 + 0.4) * Math.min(0.012, this.velocity.length() * 0.002);
      this.visualHeadProxy.rotation.z = Math.sin(this.visualHeadPhase + 0.7) * 0.025;
    }
  }

  takeDamage(rawDamage, hitZone, direction) {
    if (this.dead) return { damage: 0, killed: false, headshot: false };
    const headshot = hitZone === "head";
    if (this.type === "heavy" && hitZone === "plate") {
      const plate = this.plates.find((candidate) => candidate.visible);
      if (plate) {
        plate.visible = false;
        this.callbacks.onPlateBreak?.(this, plate);
        this.hitFlash.impulse(0.5);
        return { damage: 0, killed: false, headshot: false, plate: true };
      }
    }
    const damage = rawDamage * (headshot ? TUNING.headMultiplier : 1);
    this.health -= damage;
    const power = Math.min(1.6, damage / 26);
    this.hitFlash.impulse(0.9);
    this.flinch.impulse(power * (headshot ? 1.5 : 1));
    this.stagger.impulse((direction?.x || 0) * 0.07 * power);
    if (damage > TUNING.staggerThreshold) this.stagger.impulse((direction?.x || 0) * 0.12);
    // Subtle physical shove along the shot; the AI damping recovers it fast.
    const mass = this.type === "heavy" ? 0.3 : (this.type === "gunner" ? 0.65 : 0.85);
    this.velocity.x += (direction?.x || 0) * power * 1.15 * mass;
    this.velocity.z += (direction?.z || 0) * power * 1.15 * mass;
    if (this.health <= 0) {
      this.dead = true;
      this.callbacks.onDeath?.(this, { headshot, direction });
    }
    return { damage, killed: this.dead, headshot, plate: false };
  }

  dispose() {
    this.visualMixer?.stopAllAction();
    this.visualHeadProxy?.parent?.remove(this.visualHeadProxy);
    this.group.parent?.remove(this.group);
  }
}
