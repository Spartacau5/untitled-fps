import {
  BackSide,
  BoxGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Vector3,
} from "three";

export const DISTRICT_LOOK = {
  sun: new Vector3(-0.48, 0.56, -0.68).normalize(),
  sky: {
    horizon: 0xc6c7bf,
    zenith: 0x758996,
    fog: 0xb0babd,
    sun: 0xffe2b3,
    dust: 0xb4bbb9,
  },
  grade: {
    exposure: 0.91,
    saturation: 0.93,
    contrast: 1.04,
    vignette: 0.1,
    grain: 0.003,
    chromatic: 0.00012,
    bloom: 0.12,
  },
};

// A small, static lighting proxy captures a street canyon, warm shops and
// billboard reflections. No render of the full level and no per-frame probe.
export function districtReflectionScene() {
  const scene = new Scene();
  const materials = [];
  const material = (color, intensity = 1, side) => {
    const m = new MeshBasicMaterial({
      color: new Color(color).multiplyScalar(intensity),
      ...(side === undefined ? {} : { side }),
    });
    materials.push(m);
    return m;
  };
  const sky = new Mesh(
    new SphereGeometry(90, 16, 8),
    material(0xb7c4ca, 1.1, BackSide),
  );
  scene.add(sky);
  const ground = new Mesh(new PlaneGeometry(160, 160), material(0x4e5352));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.6;
  scene.add(ground);
  const brick = material(0x61594f),
    glass = material(0x53616a);
  const warm = material(0xffcb8d, 2),
    cool = material(0xc9e4e8, 1.6);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const h = 17 + i * 6,
        z = -30 + i * 20;
      const building = new Mesh(
        new BoxGeometry(10, h, 15),
        i % 2 ? glass : brick,
      );
      building.position.set(side * 20, h / 2 - 1.6, z);
      scene.add(building);
      const shop = new Mesh(new PlaneGeometry(10, 1.2), warm);
      shop.position.set(side * 14.9, 1.1, z);
      shop.rotation.y = (-side * Math.PI) / 2;
      scene.add(shop);
      const board = new Mesh(new PlaneGeometry(9, 6), i % 2 ? cool : warm);
      board.position.set(side * 14.8, 12, z);
      board.rotation.y = (-side * Math.PI) / 2;
      scene.add(board);
    }
  }
  return {
    scene,
    dispose() {
      scene.traverse((o) => o.geometry?.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
