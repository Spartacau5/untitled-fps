// Motion for the billboard panels. Injected into the standard material rather
// than driven by redrawing canvases: the square carries around thirty sign
// textures at 1024x512, and re-uploading any of them per frame would cost far
// more than a few lines of GLSL.
//
// Each board's material gets its own uTime uniform, advanced by ArenaView.
// `phase` desynchronises boards sharing a motion so the square does not pulse
// as one animal.

const MOTIONS = {
  // A slow backlit swell.
  pulse: `
    float m = 0.86 + 0.20 * sin(uTime * 0.9 + PHASE);`,
  // A bright bar wiping across the panel every few seconds.
  sweep: `
    float sweepT = fract(uTime * 0.16 + PHASE * 0.13);
    float bar = smoothstep(0.10, 0.0, abs(vLedUv.x - (sweepT * 1.6 - 0.3)));
    float m = 0.92 + bar * 0.85;`,
  // A failing tube. Mostly on, guttering at irregular intervals.
  flicker: `
    float f1 = sin(uTime * 21.0 + PHASE);
    float f2 = sin(uTime * 7.3 + PHASE * 2.1);
    float gut = smoothstep(0.55, 1.0, f1 * f2);
    float m = mix(0.95, 0.28, gut) + 0.06 * sin(uTime * 43.0);`,
  // Scanlines crawling up the panel.
  scroll: `
    float band = fract(vLedUv.y * 26.0 - uTime * 0.55);
    float m = 0.84 + 0.30 * smoothstep(0.0, 0.35, band) * smoothstep(1.0, 0.65, band);`,
};

export function applyLedPanel(material, { motion = "pulse", phase = 0 } = {}) {
  const body = MOTIONS[motion];
  if (!body) return material;
  const uTime = { value: 0 };
  const glsl = body.replace(/PHASE/g, phase.toFixed(3));
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uTime;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec2 vLedUv;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLedUv = uv;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec2 vLedUv;\nuniform float uTime;",
      )
      // Hook the emissive stage: these panels read as lit screens, so the
      // motion belongs on the light they give off, not on their albedo.
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
        ${glsl}
        // The LED grid itself: a fixed dot pitch that survives at distance.
        float dots = 0.92 + 0.08 * cos(vLedUv.x * 620.0) * cos(vLedUv.y * 320.0);
        totalEmissiveRadiance *= max(0.0, m) * dots;`,
      );
  };
  // Without a distinct cache key three.js shares one compiled program across
  // every board, and they would all run the first board's motion.
  material.customProgramCacheKey = () => `led_${motion}_${phase.toFixed(3)}`;
  material.userData.ledTime = uTime;
  return material;
}

// Advance every animated panel. One shared clock keeps boards in step with
// each other; `phase` is what separates them.
export function updateLedPanels(materials, time) {
  for (const m of materials)
    if (m.userData.ledTime) m.userData.ledTime.value = time;
}
