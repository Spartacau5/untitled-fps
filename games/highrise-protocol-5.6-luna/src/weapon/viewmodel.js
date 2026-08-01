import * as THREE from "three";
import { Easing } from "../core/spring.js";

export const TUNING = {
  hipPosition: new THREE.Vector3(0.205, -0.18, -0.43), // meters, camera local
  adsPosition: new THREE.Vector3(-0.008, -0.04, -0.34), // meters, native sight center aligned to the camera cross-axis
  hipRotation: new THREE.Vector3(-0.055, -0.075, -0.045), // radians
  adsRotation: new THREE.Vector3(0.0, 0.0, 0.0), // radians, native sight stays level with camera
  sprintPosition: new THREE.Vector3(0.14, -0.23, -0.39), // meters
  sprintRotation: new THREE.Vector3(-0.16, -0.28, -0.48), // radians
  assetYaw: Math.PI / 2, // radians, source FBX forward-axis orientation correction
  assetPitch: 0, // radians, source FBX orientation correction
  assetRoll: 0, // radians, source FBX orientation correction
  assetDrop: -0.02, // meters, keeps the imported rifle in the hands
  adsAnchorDepth: 0.55, // meters, camera-local distance of the muzzle-top aim anchor during ADS
  adsAnchorHeight: -0.012, // meters, keeps the barrel top a hair under the exact screen center
  assetReloadWeight: 0.66, // ratio, preserves the imported rifle silhouette during reload
};

function mat(color, roughness = 0.48, metalness = 0.2, emissive = 0x000000) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, emissive, emissiveIntensity: emissive ? 2.6 : 0 });
}

function getVisibleBounds(root, target = new THREE.Box3()) {
  target.makeEmpty();
  root.updateWorldMatrix(true, true);
  const meshBounds = new THREE.Box3();
  root.traverse((node) => {
    if (!node.isMesh || !node.visible || !node.geometry) return;
    let parent = node.parent;
    while (parent && parent !== root) {
      if (!parent.visible) return;
      parent = parent.parent;
    }
    if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
    if (!node.geometry.boundingBox || node.geometry.boundingBox.isEmpty()) return;
    meshBounds.copy(node.geometry.boundingBox).applyMatrix4(node.matrixWorld);
    target.union(meshBounds);
  });
  return target;
}

export class WeaponViewmodel {
  constructor(camera, systems) {
    this.camera = camera;
    this.systems = systems;
    this.root = new THREE.Group();
    this.poseRoot = new THREE.Group();
    this.weapon = new THREE.Group();
    this.detachedMag = new THREE.Group();
    this.root.add(this.poseRoot);
    this.poseRoot.add(this.weapon);
    this.assetContainer = new THREE.Group();
    this.assetContainer.visible = false;
    this.poseRoot.add(this.assetContainer);
    this.root.add(this.detachedMag);
    camera.add(this.root);
    const fillLight = new THREE.PointLight(0xffd2a1, 1.15, 3.8, 2.1);
    fillLight.position.set(0.18, 0.28, 0.28);
    camera.add(fillLight);
    this.root.remove(this.detachedMag);
    camera.parent?.add(this.detachedMag);
    this.buildRifle();
    this.basePosition = new THREE.Vector3();
    this.baseRotation = new THREE.Vector3();
    this.finalPosition = new THREE.Vector3();
    this.finalRotation = new THREE.Vector3();
    this.previousPosition = new THREE.Vector3();
    this.currentPosition = new THREE.Vector3();
    this.previousRotation = new THREE.Vector3();
    this.currentRotation = new THREE.Vector3();
    this.reloadMagVelocity = new THREE.Vector3();
    this.reloadMagSpin = new THREE.Vector3();
    this.assetRoot = null;
    this.assetMuzzle = null;
    this.assetMagazine = null;
    this.assetSight = null;
    this.assetSightLocal = new THREE.Vector3();
    this.assetAdsOffset = new THREE.Vector3();
    this.assetMixer = null;
  }

  buildRifle() {
    const dark = mat(0x4c646a, 0.34, 0.74, 0x061016);
    const polymer = mat(0x506367, 0.7, 0.12, 0x03090c);
    const accent = mat(0x9aaba8, 0.28, 0.8);
    const box = (size, position, material, rotation = null) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      if (rotation) mesh.rotation.set(...rotation);
      this.weapon.add(mesh);
      return mesh;
    };
    box([0.19, 0.18, 0.52], [0, 0, -0.05], dark);
    box([0.15, 0.13, 0.27], [0, -0.035, -0.39], polymer);
    box([0.14, 0.12, 0.29], [0, 0.025, 0.34], polymer, [0, 0.03, 0]);
    box([0.095, 0.18, 0.18], [0, -0.13, 0.19], polymer, [0.18, 0, 0]);
    box([0.11, 0.22, 0.13], [0, -0.14, -0.06], polymer, [0.12, 0, 0]);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.72, 12), dark);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, -0.75);
    this.weapon.add(barrel);
    const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.13, 12), accent);
    muzzle.rotation.x = Math.PI / 2;
    muzzle.position.set(0, 0.02, -1.12);
    this.weapon.add(muzzle);
    const mag = box([0.11, 0.27, 0.16], [0, -0.24, -0.02], polymer, [0.22, 0, 0]);
    mag.userData.isMagazine = true;
    this.magazine = mag;
    this.weapon.userData.muzzle = muzzle;

    const glove = mat(0x0c1518, 0.92, 0.02);
    const handA = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), glove);
    handA.scale.set(1.2, 0.75, 1.4);
    handA.position.set(0.15, -0.2, -0.43);
    this.weapon.add(handA);
    const handB = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 8), glove);
    handB.scale.set(1.1, 0.8, 1.35);
    handB.position.set(-0.115, -0.15, -0.29);
    this.weapon.add(handB);
    this.weapon.scale.setScalar(0.72);
  }

  applyAsset(root, animations = []) {
    if (!root) return false;
    this.assetContainer.clear();
    this.assetContainer.visible = true;
    this.weapon.visible = false;
    this.assetRoot = root;
    let namedMuzzle = null;
    root.traverse((node) => {
      const name = (node.name || "").toLowerCase();
      // The Sketchfab file is a presentation scene, not a game-ready weapon:
      // strip the turntable floor and loose duplicate accessories from the
      // first-person hierarchy.
      if (/ground|floor|platform|turntable|display/.test(name)
        || /^bullet\d*$/i.test(node.name || "")
        || /^(pmag|scope|foregrip|suppresor)\d+$/i.test(node.name || "")) {
        node.visible = false;
      }
      // The supplied Scope is a sealed presentation prop, not a usable sight:
      // remove it and aim from a physical post attached to the native rail.
      if (/^scope(?:001)?$/i.test(node.name || "")) node.visible = false;
      if (!namedMuzzle && node.isMesh && node.visible && /^suppresor$/i.test(node.name || "")) namedMuzzle = node;
    });
    root.rotation.set(TUNING.assetPitch, TUNING.assetYaw, TUNING.assetRoll);
    root.position.set(0, 0, 0);
    root.updateMatrixWorld(true);
    const bounds = getVisibleBounds(root);
    if (bounds.isEmpty()) return false;
    const center = bounds.getCenter(new THREE.Vector3());
    root.position.set(-center.x, -center.y + TUNING.assetDrop, -center.z);
    this.assetContainer.add(root);
    root.updateMatrixWorld(true);
    const size = bounds.getSize(new THREE.Vector3());
    this.assetMuzzle = new THREE.Object3D();
    if (namedMuzzle) {
      // Container-local AABB of the muzzle device, independent of the camera
      // orientation at load time: geometry bounds through the relative matrix.
      this.assetContainer.updateWorldMatrix(true, false);
      namedMuzzle.updateWorldMatrix(true, false);
      const toContainer = new THREE.Matrix4().copy(this.assetContainer.matrixWorld).invert().multiply(namedMuzzle.matrixWorld);
      if (!namedMuzzle.geometry.boundingBox) namedMuzzle.geometry.computeBoundingBox();
      const muzzleBounds = new THREE.Box3().copy(namedMuzzle.geometry.boundingBox).applyMatrix4(toContainer);
      this.assetMuzzle.position.copy(muzzleBounds.getCenter(new THREE.Vector3()));
      // Aim anchor = top of the muzzle device, i.e. where a front sight post
      // would sit. During ADS this point is pinned to the screen center.
      this.assetSight = namedMuzzle;
      this.assetSightLocal.set(
        (muzzleBounds.min.x + muzzleBounds.max.x) * 0.5,
        muzzleBounds.max.y,
        (muzzleBounds.min.z + muzzleBounds.max.z) * 0.5,
      );
    } else {
      // No identifiable muzzle: aim along the top-front of the visible bounds
      // (the rifle points down -Z in container space after the yaw correction).
      // `bounds` was measured before centering, so re-express it relative to
      // the centered container: point - center + drop.
      const frontZ = bounds.min.z - center.z + 0.04;
      this.assetMuzzle.position.set(0, TUNING.assetDrop, frontZ);
      this.assetSight = this.assetMuzzle;
      this.assetSightLocal.set(0, bounds.max.y - center.y + TUNING.assetDrop, frontZ);
    }
    // ADS pose keeps the rifle exactly parallel to the camera; the container
    // is only translated so the aim anchor lands on the camera axis.
    this.assetAdsOffset.set(
      -TUNING.adsPosition.x - this.assetSightLocal.x,
      TUNING.adsAnchorHeight - TUNING.adsPosition.y - this.assetSightLocal.y,
      -TUNING.adsAnchorDepth - TUNING.adsPosition.z - this.assetSightLocal.z,
    );
    this.assetContainer.add(this.assetMuzzle);
    if (globalThis.__highriseState?.assets) {
      const visibleBounds = getVisibleBounds(root);
      const visibleCenter = visibleBounds.getCenter(new THREE.Vector3());
      globalThis.__highriseState.assets.weaponAim = {
        sightLocal: [this.assetSightLocal.x, this.assetSightLocal.y, this.assetSightLocal.z],
        adsOffset: [this.assetAdsOffset.x, this.assetAdsOffset.y, this.assetAdsOffset.z],
        anchorDepth: TUNING.adsAnchorDepth,
        bounds: [size.x, size.y, size.z],
        visibleCenter: [visibleCenter.x, visibleCenter.y, visibleCenter.z],
        muzzleLocal: [this.assetMuzzle.position.x, this.assetMuzzle.position.y, this.assetMuzzle.position.z],
      };
    }
    const namedMagazine = [];
    root.traverse((node) => {
      const name = (node.name || "").toLowerCase();
      if (!this.assetMagazine && /mag|pmag|clip/.test(name) && node.isMesh) namedMagazine.push(node);
    });
    this.assetMagazine = namedMagazine[0] || null;
    this.assetMixer = animations.length ? new THREE.AnimationMixer(root) : null;
    if (this.assetMixer) this.assetMixer.clipAction(animations[0]).play();
    return true;
  }

  triggerReloadEvent(event) {
    if (event === "magEject") {
      const source = this.assetMagazine || this.magazine;
      const detached = source.clone(true);
      const worldPosition = source.getWorldPosition(new THREE.Vector3());
      const worldQuaternion = source.getWorldQuaternion(new THREE.Quaternion());
      const worldScale = source.getWorldScale(new THREE.Vector3());
      const sourceScale = source.scale.clone();
      detached.position.set(0, 0, 0);
      detached.quaternion.identity();
      detached.scale.set(1, 1, 1);
      detached.position.copy(worldPosition);
      detached.quaternion.copy(worldQuaternion);
      detached.scale.copy(worldScale).divide(sourceScale);
      this.detachedMag.add(detached);
      detached.userData.life = 0.65;
      detached.userData.velocity = new THREE.Vector3(-1.1, 0.65, 0.5);
      detached.userData.spin = new THREE.Vector3(6, 3, 2);
      source.visible = false;
    }
    if (event === "magInsert") (this.assetMagazine || this.magazine).visible = true;
    if (event === "complete" || event === "abort") (this.assetMagazine || this.magazine).visible = true;
  }

  updateDetachedMags(dt) {
    for (let i = this.detachedMag.children.length - 1; i >= 0; i -= 1) {
      const mag = this.detachedMag.children[i];
      mag.userData.life -= dt;
      mag.userData.velocity.y -= 4.8 * dt;
      mag.position.addScaledVector(mag.userData.velocity, dt);
      mag.rotation.x += mag.userData.spin.x * dt;
      mag.rotation.y += mag.userData.spin.y * dt;
      mag.rotation.z += mag.userData.spin.z * dt;
      if (mag.position.y < -0.17) {
        mag.position.y = -0.17;
        mag.userData.velocity.y *= -0.42;
        mag.userData.velocity.x *= 0.72;
        mag.userData.velocity.z *= 0.72;
      }
      if (mag.userData.life <= 0) this.detachedMag.remove(mag);
    }
  }

  update(dt, context) {
    this.assetMixer?.update(dt);
    const adsBlend = context.adsBlend;
    const sprintBlend = context.player.sprint.value;
    const adsEase = Easing.easeInOutCubic(adsBlend);
    const sprintEase = Easing.easeOutCubic(sprintBlend);
    this.basePosition.set(
      TUNING.hipPosition.x + (TUNING.adsPosition.x - TUNING.hipPosition.x) * adsEase + (TUNING.sprintPosition.x - TUNING.hipPosition.x) * sprintEase,
      TUNING.hipPosition.y + (TUNING.adsPosition.y - TUNING.hipPosition.y) * adsEase + (TUNING.sprintPosition.y - TUNING.hipPosition.y) * sprintEase,
      TUNING.hipPosition.z + (TUNING.adsPosition.z - TUNING.hipPosition.z) * adsEase + (TUNING.sprintPosition.z - TUNING.hipPosition.z) * sprintEase,
    );
    this.baseRotation.set(
      TUNING.hipRotation.x + (TUNING.adsRotation.x - TUNING.hipRotation.x) * adsEase + (TUNING.sprintRotation.x - TUNING.hipRotation.x) * sprintEase,
      TUNING.hipRotation.y + (TUNING.adsRotation.y - TUNING.hipRotation.y) * adsEase + (TUNING.sprintRotation.y - TUNING.hipRotation.y) * sprintEase,
      TUNING.hipRotation.z + (TUNING.adsRotation.z - TUNING.hipRotation.z) * adsEase + (TUNING.sprintRotation.z - TUNING.hipRotation.z) * sprintEase,
    );

    const motion = this.systems.motion.getPose();
    const sway = this.systems.sway.getPose();
    const recoil = this.systems.recoil.getPose();
    const reload = this.systems.reload.getPose();
    const reloadWeight = this.systems.reload.active || this.systems.reload.elapsed > 0
      ? (this.assetRoot ? TUNING.assetReloadWeight : 0.92)
      : 0;
    const moveWeight = 1 - reloadWeight * 0.32;
    this.finalPosition.copy(this.basePosition)
      .addScaledVector(motion.position, moveWeight)
      .add(sway.position)
      .add(recoil.position)
      .addScaledVector(reload.position, reloadWeight);
    this.finalRotation.copy(this.baseRotation)
      .addScaledVector(motion.rotation, moveWeight)
      .add(sway.rotation)
      .add(recoil.rotation)
      .addScaledVector(reload.rotation, reloadWeight);
    if (this.assetRoot) {
      // Use one immutable ADS pivot. Pose springs remain on poseRoot, so
      // sway/recoil move the complete native model instead of being cancelled
      // by a per-frame sight recenter that could cause drift or jitter. The
      // rifle stays parallel to the camera; only the translation blends in.
      this.assetContainer.position.copy(this.assetAdsOffset).multiplyScalar(adsEase);
    }
    this.previousPosition.copy(this.currentPosition);
    this.previousRotation.copy(this.currentRotation);
    this.currentPosition.copy(this.finalPosition);
    this.currentRotation.copy(this.finalRotation);
    this.poseRoot.position.copy(this.currentPosition);
    this.poseRoot.rotation.set(this.currentRotation.x, this.currentRotation.y, this.currentRotation.z);
    this.updateDetachedMags(dt);
  }

  render(alpha) {
    const t = THREE.MathUtils.clamp(alpha, 0, 1);
    const eased = t * t * (3 - 2 * t);
    this.poseRoot.position.set(
      this.previousPosition.x + (this.currentPosition.x - this.previousPosition.x) * eased,
      this.previousPosition.y + (this.currentPosition.y - this.previousPosition.y) * eased,
      this.previousPosition.z + (this.currentPosition.z - this.previousPosition.z) * eased,
    );
    this.poseRoot.rotation.set(
      this.previousRotation.x + (this.currentRotation.x - this.previousRotation.x) * eased,
      this.previousRotation.y + (this.currentRotation.y - this.previousRotation.y) * eased,
      this.previousRotation.z + (this.currentRotation.z - this.previousRotation.z) * eased,
    );
  }

  getMuzzleWorldPosition(target = new THREE.Vector3()) {
    return (this.assetMuzzle || this.weapon.userData.muzzle).getWorldPosition(target);
  }

  getEjectionWorldPosition(target = new THREE.Vector3(), adsBlend = 0) {
    // The supplied FBX does not expose a dependable ejection-port pivot. Keep
    // the casing spawn attached to the camera-space receiver position so it
    // stays beside the native rifle in both hip fire and ADS.
    const blend = THREE.MathUtils.clamp(adsBlend, 0, 1);
    target.set(
      0.2 - blend * 0.03,
      -0.08 + blend * 0.06,
      -0.68,
    );
    return this.camera.localToWorld(target);
  }
}
