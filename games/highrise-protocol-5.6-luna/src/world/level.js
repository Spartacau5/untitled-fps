import * as THREE from "three";

function standard(color, roughness = 0.84, metalness = 0.02) { return new THREE.MeshStandardMaterial({ color, roughness, metalness }); }

export class Level {
  constructor(scene, collision) {
    this.scene = scene;
    this.collision = collision;
    this.raycastables = [];
    this.build();
  }

  box(size, position, color, surface = "concrete", solid = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), standard(color));
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.surface = surface;
    this.scene.add(mesh);
    if (solid) this.collision.addBox(new THREE.Vector3(...position), new THREE.Vector3(...size));
    this.raycastables.push(mesh);
    return mesh;
  }

  build() {
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), standard(0x475158, 0.92, 0.04));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData.surface = "concrete";
    this.scene.add(floor);
    this.raycastables.push(floor);
    for (const [x, z] of [[-21, -19], [21, -19], [-21, 19], [21, 19], [-6, -13], [6, -13], [-6, 13], [6, 13]]) {
      this.box([0.9, 5.2, 0.9], [x, 2.6, z], 0x596064);
      for (let i = 0; i < 5; i += 1) {
        const rebar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 5.5, 6), standard(0x394a4d, 0.55, 0.7));
        rebar.position.set(x + (i - 2) * 0.13, 2.75, z + 0.46);
        rebar.rotation.z = 0.025 * (i - 2);
        rebar.castShadow = true;
        this.scene.add(rebar);
      }
    }
    this.box([60, 3.4, 0.4], [0, 1.7, -29], 0x3a464b);
    this.box([60, 3.4, 0.4], [0, 1.7, 29], 0x3a464b);
    this.box([0.4, 3.4, 60], [-29, 1.7, 0], 0x3a464b);
    this.box([0.4, 3.4, 60], [29, 1.7, 0], 0x3a464b);
    for (let i = 0; i < 22; i += 1) {
      const height = 2 + (i % 5) * 1.2;
      const width = 0.8 + (i % 4) * 0.7;
      const city = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.6), standard(0x172a34, 1));
      city.position.set(-25 + i * 2.4, height / 2, -35 - (i % 3) * 1.2);
      this.scene.add(city);
    }
  }
}
