import { ConeGeometry, Object3D, SphereGeometry } from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { NOISE_GLSL } from "./shaders/noise.glsl.js";

export function buildEnemyRig(i) {
  const t = (M, _, L, R) => {
      const A = new Object3D();
      return (A.position.set(_, L, R), M.add(A), A);
    },
    e = new Object3D(),
    n = i.legUL + i.legLL + 0.06,
    s = t(e, 0, n, 0),
    r = t(s, 0, i.hips[1] * 0.45, 0),
    a = t(r, 0, i.torso[1] + 0.02, 0),
    l = t(r, -i.shoulder, i.torso[1] - 0.06, 0),
    o = t(r, i.shoulder, i.torso[1] - 0.06, 0),
    c = t(l, 0, -i.armUL, 0),
    h = t(o, 0, -i.armUL, 0),
    d = t(s, -i.hips[0] * 0.3, -i.hips[1] * 0.3, 0),
    u = t(s, i.hips[0] * 0.3, -i.hips[1] * 0.3, 0),
    m = t(d, 0, -i.legUL, 0),
    g = t(u, 0, -i.legUL, 0),
    v = [],
    p = (M, _, L) => v.push({ node: M, geom: _, kind: L }),
    f = (M, _, L, R, A, C, S = 0.02) => {
      const y = new RoundedBoxGeometry(M, _, L, 2, S);
      return (y.translate(R, A, C), y);
    };
  if (
    (p(s, f(i.hips[0], i.hips[1], i.hips[2], 0, 0, 0), "body"),
    p(
      r,
      f(i.torso[0], i.torso[1], i.torso[2], 0, i.torso[1] / 2, 0, 0.04),
      "body",
    ),
    p(
      r,
      f(
        i.torso[0] * 0.34,
        i.torso[1] * 0.36,
        0.05,
        0,
        i.torso[1] * 0.56,
        -i.torso[2] / 2 - 0.005,
        0.012,
      ),
      "glow",
    ),
    p(
      r,
      f(
        i.torso[0] * 0.7,
        0.03,
        0.03,
        0,
        i.torso[1] * 0.2,
        -i.torso[2] / 2 - 0.005,
        0.008,
      ),
      "glow",
    ),
    p(
      l,
      f(
        i.armW * 1.6,
        i.armW * 1.1,
        i.armW * 1.6,
        -i.armW * 0.25,
        0.04,
        0,
        0.02,
      ),
      "body",
    ),
    p(
      o,
      f(i.armW * 1.6, i.armW * 1.1, i.armW * 1.6, i.armW * 0.25, 0.04, 0, 0.02),
      "body",
    ),
    p(a, f(i.head, i.head * 1.05, i.head, 0, i.head * 0.55, 0, 0.045), "head"),
    p(
      a,
      f(
        i.head * 0.76,
        i.head * 0.16,
        0.03,
        0,
        i.head * 0.66,
        -i.head / 2 - 0.008,
        0.006,
      ),
      "headGlow",
    ),
    p(l, f(i.armW, i.armUL, i.armW, 0, -i.armUL / 2, 0), "body"),
    p(o, f(i.armW, i.armUL, i.armW, 0, -i.armUL / 2, 0), "body"),
    p(c, f(i.armW * 0.9, i.armLL, i.armW * 0.9, 0, -i.armLL / 2, 0), "body"),
    p(h, f(i.armW * 0.9, i.armLL, i.armW * 0.9, 0, -i.armLL / 2, 0), "body"),
    p(
      c,
      f(i.armW * 0.55, 0.12, i.armW * 0.55, 0, -i.armLL - 0.04, 0, 0.01),
      "glow",
    ),
    p(
      h,
      f(i.armW * 0.55, 0.12, i.armW * 0.55, 0, -i.armLL - 0.04, 0, 0.01),
      "glow",
    ),
    p(d, f(i.legW, i.legUL, i.legW, 0, -i.legUL / 2, 0), "body"),
    p(u, f(i.legW, i.legUL, i.legW, 0, -i.legUL / 2, 0), "body"),
    p(m, f(i.legW * 0.85, i.legLL, i.legW * 0.85, 0, -i.legLL / 2, 0), "body"),
    p(g, f(i.legW * 0.85, i.legLL, i.legW * 0.85, 0, -i.legLL / 2, 0), "body"),
    p(
      m,
      f(i.legW, 0.08, i.legW * 1.7, 0, -i.legLL - 0.01, -i.legW * 0.35, 0.015),
      "body",
    ),
    p(
      g,
      f(i.legW, 0.08, i.legW * 1.7, 0, -i.legLL - 0.01, -i.legW * 0.35, 0.015),
      "body",
    ),
    i.spikes)
  ) {
    const M = [];
    for (let R = 0; R < 5; R++) {
      const A = new ConeGeometry(0.06, 0.3, 6);
      (A.rotateX(-0.9 + (R - 2) * 0.15),
        A.rotateZ((R - 2) * 0.3),
        A.translate(
          (R - 2) * 0.12,
          i.torso[1] * 0.85 + Math.abs(R - 2) * -0.04,
          i.torso[2] / 2 + 0.08,
        ),
        M.push(A));
    }
    p(r, mergeGeometries(M, !1), "body");
    const _ = new ConeGeometry(0.05, 0.22, 6);
    (_.rotateZ(0.9), _.translate(-i.armW * 0.9, 0.08, 0), p(l, _, "body"));
    const L = new ConeGeometry(0.05, 0.22, 6);
    (L.rotateZ(-0.9), L.translate(i.armW * 0.9, 0.08, 0), p(o, L, "body"));
  }
  if (i.sac) {
    const M = new SphereGeometry(0.2, 12, 10);
    (M.scale(1, 1.3, 0.9),
      M.translate(0, i.torso[1] * 0.55, i.torso[2] / 2 + 0.12),
      p(r, M, "glow"));
  }
  const w = n + i.hips[1] * 0.45 + i.torso[1] + 0.02 + i.head * 0.55;
  return {
    root: e,
    n: {
      hips: s,
      torso: r,
      neck: a,
      shL: l,
      shR: o,
      elL: c,
      elR: h,
      legL: d,
      legR: u,
      knL: m,
      knR: g,
    },
    parts: v,
    hipH: n,
    headY: w,
    torsoTop: n + i.hips[1] * 0.45 + i.torso[1],
    torsoBot: n - i.hips[1] * 0.5,
  };
}
export function makeEnemyMaterial(i, t, e, n = !1) {
  return (
    (i.onBeforeCompile = (s) => {
      ((s.uniforms.uTime = t),
        (s.vertexShader = s.vertexShader
          .replace(
            "#include <common>",
            `#include <common>
attribute float aFlash; attribute float aDissolve; varying float vFlash; varying float vDissolve; varying vec3 vWPos;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
        vFlash = aFlash; vDissolve = aDissolve;
        #ifdef USE_INSTANCING
          vWPos = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
        #else
          vWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
        #endif`,
          )),
        (s.fragmentShader = s.fragmentShader
          .replace(
            "#include <common>",
            `#include <common>
varying float vFlash; varying float vDissolve; varying vec3 vWPos; uniform float uTime;
${NOISE_GLSL}`,
          )
          .replace(
            "#include <clipping_planes_fragment>",
            `#include <clipping_planes_fragment>
        float dn = noise3(vWPos * 5.0 + vec3(0.0, uTime * 0.2, 0.0)) * 0.7 + noise3(vWPos * 17.0) * 0.3;
        float dEdge = vDissolve * 1.2 - 0.1;
        if (dn < dEdge) discard;
        float dBurn = smoothstep(dEdge + 0.14, dEdge, dn) * step(0.001, vDissolve);`,
          )),
        n ||
          (s.fragmentShader = s.fragmentShader.replace(
            "#include <emissivemap_fragment>",
            `#include <emissivemap_fragment>
        ${e ? "totalEmissiveRadiance *= 0.75 + 0.35 * sin(uTime * 6.0 + vWPos.x * 3.0 + vWPos.z * 2.0);" : ""}
        totalEmissiveRadiance += vec3(1.0, 0.45, 0.12) * dBurn * 7.0;
        totalEmissiveRadiance += vec3(1.0, 0.95, 0.9) * vFlash * 3.0;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), vFlash * 0.85);`,
          )));
    }),
    (i.customProgramCacheKey = () =>
      "enemy_" + (n ? "depth" : e ? "glow" : "body")),
    i
  );
}
