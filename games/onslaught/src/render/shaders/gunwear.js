import { NOISE_GLSL } from "./noise.glsl.js";

// Surface detail for the first-person viewmodel and the robots.
//
// Object space, not world space. applySurfaceGrime() in surface.js keys off
// world position, which is right for a building and wrong for anything that
// moves: a world-space pattern swims across a gun as you walk. These read
// `position` before any transform, so the wear is machined into the part and
// stays there.
//
// Nothing here costs texture memory. A single flat roughness across a whole
// receiver is the loudest "this is untextured" tell there is, so the roughness
// perturbation matters more than the albedo tint.

const STYLES = {
  // Machined metal: fine turning marks along the bore axis, wear breaking
  // through on edges, a little oil pooling in the low spots.
  metal: `
    float grain = noise3(op * vec3(90.0, 90.0, 320.0));
    float mottle = fbm3(op * 26.0);
    // Edges of a box read as the extremes of local position on each axis, so
    // this brightens corners and leaves flats alone -- the way a carried gun
    // actually wears.
    vec3 ax = abs(normalize(op + 1e-5));
    float edge = smoothstep(0.55, 0.95, max(ax.x, max(ax.y, ax.z)));
    float rub = edge * smoothstep(0.35, 0.75, mottle);
    tint = 0.90 + 0.16 * grain + rub * 0.42;
    rough = -0.14 * rub + 0.13 * (mottle - 0.5);`,
  // Parkerised or blued: darker, flatter, dirtier in the recesses.
  metalDark: `
    float grain = noise3(op * vec3(70.0, 70.0, 240.0));
    float mottle = fbm3(op * 22.0);
    vec3 ax = abs(normalize(op + 1e-5));
    float edge = smoothstep(0.62, 0.98, max(ax.x, max(ax.y, ax.z)));
    float rub = edge * smoothstep(0.45, 0.85, mottle);
    tint = 0.88 + 0.12 * grain + rub * 0.55;
    rough = -0.20 * rub + 0.10 * (mottle - 0.5);`,
  // Moulded polymer: a coarse stipple, and no bright edge wear -- plastic
  // goes shiny and pale where it is handled, not metallic.
  polymer: `
    float stipple = noise3(op * 210.0) * 0.6 + noise3(op * 70.0) * 0.4;
    float handled = smoothstep(0.4, 0.85, fbm3(op * 14.0));
    tint = 0.92 + 0.14 * stipple + handled * 0.10;
    rough = 0.16 * (stipple - 0.5) - 0.12 * handled;`,
  // Glove leather: a fine grain and creasing, always rough.
  glove: `
    float grainF = noise3(op * 260.0);
    float crease = smoothstep(0.55, 0.9, fbm3(op * 34.0));
    tint = 0.90 + 0.12 * grainF - crease * 0.16;
    rough = 0.10 * (grainF - 0.5) + crease * 0.08;`,
  // Painted alloy armour on the robots: panel lines, scuffing, and grime
  // gathering low on the chassis.
  //
  // Two things to keep in mind here. The albedo terms have to average close
  // to 1.0: stacking multiplicative darkening cost the robots half their
  // brightness and turned them into black cut-outs. And `op` is the part's
  // own local space, not the body's -- a thigh's local origin is its own
  // centre -- so the height gradient reads `wy`, the world height the caller
  // supplies, rather than op.y.
  alloy: `
    float grain = noise3(op * 120.0);
    float mottle = fbm3(op * 18.0);
    float seam = smoothstep(0.04, 0.0, abs(fract(op.y * 7.0) - 0.5) - 0.46);
    vec3 ax = abs(normalize(op + 1e-5));
    float edge = smoothstep(0.6, 0.96, max(ax.x, max(ax.y, ax.z)));
    float scuff = edge * smoothstep(0.45, 0.85, mottle);
    float grime = smoothstep(1.2, 0.15, wy) * smoothstep(0.45, 0.85, mottle);
    tint = (0.96 + 0.10 * grain + scuff * 0.20) * (1.0 - 0.12 * seam) * (1.0 - 0.10 * grime);
    rough = -0.16 * scuff + 0.16 * (mottle - 0.5) + 0.20 * grime + 0.12 * seam;`,
};

// Returns the GLSL body for a style, for callers that inject it themselves
// (the enemy material builds one big shader rather than chaining hooks).
export function wearSnippet(style) {
  return STYLES[style] || null;
}

export function applyGunWear(material, style, key) {
  const body = STYLES[style];
  if (!body) return material;
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vOPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvOPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec3 vOPos;\n${NOISE_GLSL}`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
        vec3 op = vOPos;
        float tint = 1.0;
        float rough = 0.0;
        ${body}
        diffuseColor.rgb *= clamp(tint, 0.0, 2.0);`,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + rough, 0.04, 1.0);`,
      );
  };
  // The injected body is STYLES[style] and nothing else, so style is the
  // entire key. Keying per material compiled eight programs for five styles.
  material.customProgramCacheKey = () => `wear_${style}`;
  return material;
}
