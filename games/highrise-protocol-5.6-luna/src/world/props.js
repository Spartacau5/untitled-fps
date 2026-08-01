import * as THREE from "three";
import { Spring } from "../core/spring.js";

function material(color, roughness = 0.76, metalness = 0.05, transparent = false) { return new THREE.MeshStandardMaterial({ color, roughness, metalness, transparent, opacity: transparent ? 0.46 : 1, side: transparent ? THREE.DoubleSide : THREE.FrontSide }); }

export class WorldProps {
  constructor(scene, collision, rng) {
    this.scene = scene;
    this.collision = collision;
    this.rng = rng;
    this.sheets = [];
    this.flames = [];
    this.raycastables = [];
    this.sheetAccumulator = 0;
    this.build();
  }

  register(mesh, surface) {
    mesh.userData.surface = surface;
    this.raycastables.push(mesh);
  }

  box(size, position, color, options = {}) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, options.roughness ?? 0.78, options.metalness ?? 0.04));
    mesh.position.set(...position);
    if (options.rotationY) mesh.rotation.y = options.rotationY;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);
    if (options.solid !== false) this.collision.addBox(new THREE.Vector3(...position), new THREE.Vector3(...size), options);
    this.register(mesh, options.surface || "concrete");
    return mesh;
  }

  build() {
    for (const [x, z] of [[-10, 4], [9, -2], [-16, -11], [15, 11]]) this.buildPallet(x, z);
    this.box([1.2, 2.4, 0.16], [-5.5, 1.2, -5.5], 0xc9c2ae, { low: false, surface: "wood" });
    this.box([1.2, 2.4, 0.16], [-4.05, 1.2, -5.5], 0xb5afa0, { low: false, surface: "wood" });
    this.buildCrateCluster(4.4, 4.6);
    this.buildCrateCluster(-13.2, 15.5, 0.6);
    this.buildCrateCluster(19.5, -6.5, 0.8);
    for (const [x, z] of [[-2.4, 8.4], [10.8, -7.2], [-13.5, -1.3], [6.2, -16.5], [17.5, 2.4]]) this.buildSheet(x, z);
    const beamMat = material(0x3b4c4f, 0.42, 0.58);
    for (let i = 0; i < 16; i += 1) {
      const angle = this.rng.range(-0.08, 0.08);
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 2.2, 6), beamMat);
      beam.rotation.z = Math.PI / 2 + angle;
      beam.rotation.y = this.rng.range(-0.3, 0.3);
      beam.position.set(this.rng.range(-24, 24), 0.18, this.rng.range(-24, 24));
      this.scene.add(beam);
    }
    // Oil drum clusters, some tipped over.
    this.buildDrums(-8, -8, 3, true);
    this.buildDrums(12.5, 6.5, 2, false);
    this.buildDrums(18, -14, 2, true);
    this.buildDrums(-20, 9, 2, false);
    // Concrete jersey barriers.
    this.buildBarrier(-3.2, 1.8, 0.5);
    this.buildBarrier(8.2, -12.4, -0.25);
    this.buildBarrier(-14.5, 7.8, 1.35);
    this.buildBarrier(2.5, -9.5, 0.1);
    // Sandbag emplacements.
    this.buildSandbags(3.2, -3.8, 0.35);
    this.buildSandbags(-11.5, 12.8, -0.5);
    this.buildSandbags(13.5, 13.8, 1.2);
    // Cable spools.
    this.buildSpool(16.2, 15.4, false);
    this.buildSpool(-19.2, 2.6, true);
    this.buildSpool(-6.5, -17.5, false);
    // Scattered bricks and rubble near the pillars.
    const brickMat = material(0x8a5a44, 0.9);
    const rubbleMat = material(0x5c6468, 0.95);
    for (const [px, pz] of [[-6, -13], [6, -13], [-6, 13], [6, 13], [-21, -19], [21, 19]]) {
      const count = 4 + Math.floor(this.rng.range(0, 3));
      for (let i = 0; i < count; i += 1) {
        const brick = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.11, 0.12), this.rng.range(0, 1) > 0.4 ? brickMat : rubbleMat);
        brick.position.set(px + this.rng.range(-1.6, 1.6), 0.055, pz + this.rng.range(-1.6, 1.6));
        brick.rotation.y = this.rng.range(0, Math.PI);
        brick.castShadow = true;
        brick.receiveShadow = true;
        this.scene.add(brick);
      }
    }
    // Burn barrels: warm flickering light sources that keep the night alive.
    this.buildBurnBarrel(5.2, 8.6);
    this.buildBurnBarrel(-17.5, -16.5);
  }

  buildDrums(x, z, count, withTipped) {
    const colors = [0x6d5a35, 0x704a42, 0x4e6058];
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + this.rng.range(0, 1);
      const dx = x + Math.cos(angle) * (i === 0 ? 0 : 0.75);
      const dz = z + Math.sin(angle) * (i === 0 ? 0 : 0.75);
      const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.92, 14), material(colors[i % colors.length], 0.52, 0.55));
      drum.position.set(dx, 0.46, dz);
      drum.rotation.y = this.rng.range(0, Math.PI);
      drum.castShadow = true;
      drum.receiveShadow = true;
      this.scene.add(drum);
      this.collision.addBox(new THREE.Vector3(dx, 0.46, dz), new THREE.Vector3(0.64, 0.92, 0.64), { low: true });
      this.register(drum, "metal");
    }
    if (withTipped) {
      const tipped = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, 0.92, 14), material(0x5d4a3a, 0.6, 0.45));
      tipped.rotation.z = Math.PI / 2;
      tipped.rotation.y = this.rng.range(0, Math.PI);
      tipped.position.set(x + 1.15, 0.31, z - 0.7);
      tipped.castShadow = true;
      tipped.receiveShadow = true;
      this.scene.add(tipped);
      this.collision.addBox(new THREE.Vector3(x + 1.15, 0.31, z - 0.7), new THREE.Vector3(0.95, 0.62, 0.7), { low: true });
      this.register(tipped, "metal");
    }
  }

  buildBarrier(x, z, rotationY) {
    const concrete = material(0x9aa0a2, 0.88);
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.52, 0.62), concrete);
    base.position.set(x, 0.26, z);
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.55, 0.3), concrete);
    top.position.set(x, 0.78, z);
    for (const mesh of [base, top]) {
      mesh.rotation.y = rotationY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
      this.register(mesh, "concrete");
    }
    // Axis-aligned collision hull that covers the rotated footprint.
    const cos = Math.abs(Math.cos(rotationY));
    const sin = Math.abs(Math.sin(rotationY));
    this.collision.addBox(
      new THREE.Vector3(x, 0.53, z),
      new THREE.Vector3(cos * 2.1 + sin * 0.62, 1.06, sin * 2.1 + cos * 0.62),
      { low: true },
    );
  }

  buildSandbags(x, z, rotationY) {
    const bag = material(0x7a7154, 0.96);
    const cos = Math.cos(rotationY);
    const sin = Math.sin(rotationY);
    for (let row = 0; row < 2; row += 1) {
      const count = 4 - row;
      for (let i = 0; i < count; i += 1) {
        const along = (i - (count - 1) / 2) * 0.62;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.26, 0.4), bag);
        mesh.position.set(x + cos * along, 0.14 + row * 0.27, z - sin * along);
        mesh.rotation.y = rotationY + this.rng.range(-0.12, 0.12);
        mesh.rotation.z = this.rng.range(-0.03, 0.03);
        mesh.scale.set(1, 1, 1.1 - row * 0.12);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
        this.register(mesh, "concrete");
      }
    }
    this.collision.addBox(new THREE.Vector3(x, 0.34, z), new THREE.Vector3(Math.abs(cos) * 2.5 + Math.abs(sin) * 0.5, 0.68, Math.abs(sin) * 2.5 + Math.abs(cos) * 0.5), { low: true });
  }

  buildSpool(x, z, standing) {
    const wood = material(0x8a6a4a, 0.85);
    const core = material(0x6a4f36, 0.9);
    const spool = new THREE.Group();
    const discA = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 16), wood);
    const discB = discA.clone();
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.62, 12), core);
    discA.position.y = 0.35;
    discB.position.y = -0.35;
    spool.add(discA, discB, axle);
    if (standing) {
      spool.rotation.z = Math.PI / 2;
      spool.position.set(x, 0.55, z);
    } else {
      spool.position.set(x, 0.39, z);
    }
    spool.traverse((node) => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; this.register(node, "wood"); } });
    this.scene.add(spool);
    this.collision.addBox(new THREE.Vector3(x, 0.55, z), new THREE.Vector3(1.1, 1.1, 1.1), { low: true });
  }

  buildCrateCluster(x, z, scale = 1) {
    const colors = [0xd56f48, 0xe0ab56, 0xb08b52];
    const s = 0.72 * scale;
    this.box([s, s, s], [x, s / 2, z], colors[0], { low: true, surface: "wood" });
    this.box([s, s, s], [x + s + 0.06, s / 2, z + 0.15], colors[1], { low: true, surface: "wood" });
    this.box([s * 0.86, s * 0.86, s * 0.86], [x + s * 0.5, s + s * 0.43, z + 0.06], colors[2], { low: true, surface: "wood", rotationY: 0.4 });
  }

  buildPallet(x, z) {
    const wood = material(0x73533b, 0.94);
    for (let i = 0; i < 4; i += 1) {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 0.28), wood);
      plank.position.set(x, 0.15 + (i % 2) * 0.16, z + (i - 1.5) * 0.36);
      plank.rotation.y = i % 2 ? 0.03 : -0.02;
      plank.castShadow = true;
      plank.receiveShadow = true;
      this.scene.add(plank);
      this.register(plank, "wood");
    }
    this.collision.addBox(new THREE.Vector3(x, 0.35, z), new THREE.Vector3(2.8, 0.7, 1.25), { low: true });
  }

  buildSheet(x, z) {
    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.4, 8, 5), material(0xd8d2c0, 0.9, 0, true));
    sheet.position.set(x, 1.2, z);
    sheet.rotation.y = this.rng.range(-0.2, 0.2);
    sheet.userData.base = sheet.geometry.attributes.position.array.slice();
    sheet.userData.phase = this.rng.range(0, Math.PI * 2);
    this.scene.add(sheet);
    this.sheets.push(sheet);
  }

  buildBurnBarrel(x, z) {
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.3, 0.98, 14, 1, true), material(0x2c2320, 0.65, 0.5));
    drum.material.side = THREE.DoubleSide;
    drum.position.set(x, 0.49, z);
    drum.castShadow = true;
    drum.receiveShadow = true;
    this.scene.add(drum);
    this.collision.addBox(new THREE.Vector3(x, 0.49, z), new THREE.Vector3(0.66, 0.98, 0.66), { low: true });
    this.register(drum, "metal");
    const ember = new THREE.Mesh(
      new THREE.CylinderGeometry(0.27, 0.27, 0.06, 12),
      new THREE.MeshStandardMaterial({ color: 0xff8636, emissive: 0xff6a1f, emissiveIntensity: 2.4, roughness: 1 }),
    );
    ember.position.set(x, 0.88, z);
    this.scene.add(ember);
    const light = new THREE.PointLight(0xff8636, 2.1, 9, 2);
    light.position.set(x, 1.35, z);
    this.scene.add(light);
    this.flames.push({ light, ember, phase: this.rng.range(0, Math.PI * 2) });
  }

  update(dt, time) {
    for (const flame of this.flames) {
      const flicker = Math.sin(time * 11.7 + flame.phase) * 0.28 + Math.sin(time * 27.3 + flame.phase * 2.1) * 0.18 + Math.sin(time * 5.1 + flame.phase) * 0.22;
      flame.light.intensity = 2.1 + flicker;
      flame.ember.material.emissiveIntensity = 2.4 + flicker * 0.9;
    }
    this.sheetAccumulator += dt;
    if (this.sheetAccumulator < 1 / 30) return;
    this.sheetAccumulator = 0;
    for (const sheet of this.sheets) {
      const positions = sheet.geometry.attributes.position;
      const base = sheet.userData.base;
      for (let i = 0; i < positions.count; i += 1) {
        const x = base[i * 3];
        const y = base[i * 3 + 1];
        positions.setZ(i, Math.sin(time * 1.6 + sheet.userData.phase + x * 1.8 + y * 0.7) * 0.07 * (0.3 + (x + 1.4) / 2.8));
      }
      positions.needsUpdate = true;
      sheet.geometry.computeVertexNormals();
    }
  }
}
