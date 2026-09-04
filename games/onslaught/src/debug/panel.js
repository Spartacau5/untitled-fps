import GUI from "lil-gui";

// Live tuning for the post grade and key lights. Mounted only with ?debug.
export function mountDebugPanel(game) {
  const gui = new GUI({ title: "grade" });
  const u = game.postfx.u;
  gui.add(game.grade, "exposure", 0.4, 3, 0.01).name("exposure");
  gui.add(u.uSat, "value", 0, 2, 0.01).name("saturation");
  gui.add(u.uContrast, "value", 0.5, 2, 0.01).name("contrast");
  gui.add(u.uVignette, "value", 0, 1, 0.01).name("vignette");
  gui.add(u.uGrain, "value", 0, 0.2, 0.001).name("grain");
  gui.add(game.grade, "chromatic", 0, 0.02, 0.0005).name("chromatic");
  gui.add(u.uBloom, "value", 0, 0.6, 0.005).name("bloom");
  gui
    .add(game.postfx.downMat.uniforms.uThreshold, "value", 0.5, 4, 0.05)
    .name("bloom threshold");
  gui
    .add(game.renderer, "toneMappingExposure", 0.2, 3, 0.01)
    .name("renderer exposure");
  const sun = game.arenaView.sun;
  if (sun) gui.add(sun, "intensity", 0, 8, 0.05).name("sun");
  gui
    .add(
      {
        dump: () =>
          console.log(
            JSON.stringify(
              {
                exposure: game.grade.exposure,
                saturation: u.uSat.value,
                contrast: u.uContrast.value,
                vignette: u.uVignette.value,
                grain: u.uGrain.value,
                chromatic: game.grade.chromatic,
                bloom: u.uBloom.value,
                bloomThreshold: game.postfx.downMat.uniforms.uThreshold.value,
              },
              null,
              2,
            ),
          ),
      },
      "dump",
    )
    .name("log values");
  gui.domElement.style.zIndex = "50";
  return gui;
}
