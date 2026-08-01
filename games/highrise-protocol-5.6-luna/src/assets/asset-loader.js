import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

export const TUNING = {
  weaponUrl: "./assets/weapon/model/model.FBX", // local FBX asset
  enemyUrl: "./assets/enemy/source/enemy1final.fbx", // local FBX asset
  weaponLength: 1.35, // meters, normalized viewmodel length
  enemyHeight: 1.9, // meters, normalized world height
};

function configureMaterials(root) {
  root.traverse((node) => {
    if (!node.isMesh) return;
    node.castShadow = true;
    node.receiveShadow = true;
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    for (const material of materials) {
      if (!material) continue;
      if (material.map) material.map.colorSpace = THREE.SRGBColorSpace;
      if (material.emissiveMap) material.emissiveMap.colorSpace = THREE.SRGBColorSpace;
      // The enemy FBX imports its face as a transparent lambert surface in
      // some Three.js revisions. It must remain an opaque, lit character
      // surface in the game; the rifle still owns the only intentional glass.
      if (/face/i.test(node.name || "")) {
        material.transparent = false;
        material.opacity = 1;
        material.alphaTest = 0;
        material.depthWrite = true;
        material.color?.setHex(0xffffff);
      }
      material.needsUpdate = true;
    }
  });
  return root;
}

let activeFbxLoads = 0;
let nativeWarn = null;
const WEIGHT_WARNING = "THREE.FBXLoader: Vertex has more than 4 skinning weights assigned to vertex. Deleting additional weights.";

function loadFbx(loader, url) {
  return new Promise((resolve, reject) => {
    if (activeFbxLoads === 0) {
      nativeWarn = console.warn;
      console.warn = (...args) => { if (args[0] !== WEIGHT_WARNING) nativeWarn(...args); };
    }
    activeFbxLoads += 1;
    const finish = () => {
      activeFbxLoads -= 1;
      if (activeFbxLoads === 0 && nativeWarn) {
        console.warn = nativeWarn;
        nativeWarn = null;
      }
    };
    loader.load(url, (root) => { finish(); resolve(root); }, undefined, (error) => { finish(); reject(error); });
  });
}

function makeLoader(resourcePath) {
  const loader = new FBXLoader();
  loader.setResourcePath(resourcePath);
  // The supplied ACR FBX references baked TGA normals that are not shipped;
  // a neutral texture keeps the loader quiet without another dependency.
  loader.manager.addHandler(/\.tga$/i, { load: () => new THREE.Texture(), setPath() { return this; } });
  return loader;
}

function normalize(root, targetSize, axis) {
  const bounds = new THREE.Box3().setFromObject(root);
  const size = bounds.getSize(new THREE.Vector3());
  const sourceSize = axis === "height" ? size.y : Math.max(size.x, size.y, size.z);
  if (!Number.isFinite(sourceSize) || sourceSize < 1e-4) return root;
  root.scale.setScalar(targetSize / sourceSize);
  return root;
}

export class AssetLibrary {
  constructor() {
    this.weaponLoader = makeLoader("./assets/weapon/model/textures/");
    this.enemyLoader = makeLoader("./assets/enemy/textures/");
    this.weapon = null;
    this.enemy = null;
    this.weaponAnimations = [];
    this.enemyAnimations = [];
    this.loaded = false;
    this.errors = [];
  }

  async load() {
    const results = await Promise.allSettled([
      loadFbx(this.weaponLoader, TUNING.weaponUrl),
      loadFbx(this.enemyLoader, TUNING.enemyUrl),
    ]);
    const [weaponResult, enemyResult] = results;
    if (weaponResult.status === "fulfilled") {
      this.weapon = configureMaterials(normalize(weaponResult.value, TUNING.weaponLength, "length"));
      this.weaponAnimations = this.weapon.animations || [];
    } else {
      this.errors.push(`weapon: ${weaponResult.reason?.message || "load failed"}`);
    }
    if (enemyResult.status === "fulfilled") {
      this.enemy = configureMaterials(normalize(enemyResult.value, TUNING.enemyHeight, "height"));
      this.enemyAnimations = this.enemy.animations || [];
    } else {
      this.errors.push(`enemy: ${enemyResult.reason?.message || "load failed"}`);
    }
    this.loaded = Boolean(this.weapon || this.enemy);
    return this;
  }

  cloneEnemy() {
    return this.enemy ? SkeletonUtils.clone(this.enemy) : null;
  }
}

export function attachAssets(library, { weapon, spawner, state, hud }) {
  library.load().then((loaded) => {
    state.assets.weapon = Boolean(loaded.weapon);
    state.assets.enemy = Boolean(loaded.enemy);
    state.assets.weaponAnimations = loaded.weaponAnimations.length;
    state.assets.enemyAnimations = loaded.enemyAnimations.length;
    state.assets.error = loaded.errors.join(" | ");
    if (loaded.weapon) {
      weapon.applyAsset(loaded.weapon, loaded.weaponAnimations);
      state.assets.weaponNodes = [];
      loaded.weapon.traverse((node) => { if (node.name) state.assets.weaponNodes.push(node.name); });
      state.assets.weaponMagazine = weapon.assetMagazine?.name || "";
      state.assets.weaponSight = weapon.assetSight?.name || "";
      state.assets.weaponMagCandidates = [];
      loaded.weapon.traverse((node) => {
        if (!node.isMesh || !/mag|pmag|clip/i.test(node.name || "")) return;
        const candidateSize = new THREE.Box3().setFromObject(node).getSize(new THREE.Vector3());
        state.assets.weaponMagCandidates.push({ name: node.name, size: [candidateSize.x, candidateSize.y, candidateSize.z] });
      });
      if (weapon.assetMagazine) {
        const magSize = new THREE.Box3().setFromObject(weapon.assetMagazine).getSize(new THREE.Vector3());
        state.assets.weaponMagazineSize = [magSize.x, magSize.y, magSize.z];
      }
    }
    if (loaded.enemy) spawner.setEnemyAsset(() => loaded.cloneEnemy(), loaded.enemyAnimations);
    if (loaded.errors.length) hud.addFeed("MODEL FALLBACK / CHECK ASSETS");
  }).catch((error) => {
    state.assets.error = error?.message || "asset load failed";
    hud.addFeed("MODEL FALLBACK / CHECK ASSETS");
  });
}
