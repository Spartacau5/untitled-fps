import { ACESFilmicToneMapping, SRGBColorSpace } from "three";

// No render targets, bloom pyramid or fullscreen passes are allocated here.
export class DirectRenderer {
  constructor(renderer) {
    this.renderer = renderer;
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    this.u = Object.fromEntries(
      ["uDamage", "uRadial", "uCA", "uFlash", "uExposure", "uDesat"]
        .map((name) => [name, { value: name === "uExposure" ? 1 : 0 }]),
    );
  }
  setSamples() {}
  setSize() {}
  render(scene, camera, weaponScene, weaponCamera) {
    const r = this.renderer;
    r.toneMappingExposure = this.u.uExposure.value;
    r.setRenderTarget(null);
    r.clear();
    r.render(scene, camera);
    if (weaponScene) {
      r.clearDepth();
      r.render(weaponScene, weaponCamera);
    }
  }
}
