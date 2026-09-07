import {
  Color,
  CylinderGeometry,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshDepthMaterial,
  MeshStandardMaterial,
  Object3D,
  RGBADepthPacking,
  SphereGeometry,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { lerpAngle } from "../core/mathx.js";
import { ENEMIES, MAX_PER_TYPE } from "../data/enemies.js";
import { rigMetrics } from "../sim/enemies.js";
import { MAX_PROJECTILES } from "../sim/projectiles.js";
import { theme } from "../theme/theme.js";
import { NOISE_GLSL } from "./shaders/noise.glsl.js";
import { wearSnippet } from "./shaders/gunwear.js";

const ZERO_MATRIX = new Matrix4().makeScale(0, 0, 0);

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
    // Ankles. The feet used to be welded to the shins, so they pointed
    // wherever the leg swung and the whole rig read as skating. With a joint
    // here sync() can hold them level through the stride.
    w2 = t(m, 0, -i.legLL, 0),
    x2 = t(g, 0, -i.legLL, 0),
    v = [],
    p = (M, _, L) => v.push({ node: M, geom: _, kind: L }),
    // One bevel segment, not two. Two costs 300 triangles a part against 108,
    // and with 31-36 parts on each of up to 64 robots that was ~500k triangles
    // a frame before the shadow pass doubled it. The bevel radii here are
    // 4-45 mm, so the difference between a chamfer and a two-segment curve is
    // not visible at any distance you fight these things from.
    f = (M, _, L, R, A, C, S = 0.02) => {
      const y = new RoundedBoxGeometry(M, _, L, 1, S);
      return (y.translate(R, A, C), y);
    },
    // A hand: palm, knuckle bar, three fingers and a thumb, merged so the
    // whole thing still costs one instanced mesh. `mirror` puts the thumb on
    // the correct side.
    wrist = -i.armLL,
    handGeom = (mirror) =>
      mergeGeometries(
        [
          f(i.armW * 0.62, 0.085, i.armW * 0.5, 0, wrist - 0.045, 0, 0.012),
          f(i.armW * 0.6, 0.03, i.armW * 0.52, 0, wrist - 0.092, 0, 0.008),
          ...[-1, 0, 1].map((n) =>
            f(
              i.armW * 0.15,
              0.08,
              i.armW * 0.17,
              n * i.armW * 0.2,
              wrist - 0.14,
              0,
              0.006,
            ),
          ),
          f(
            i.armW * 0.14,
            0.06,
            i.armW * 0.15,
            mirror * i.armW * 0.3,
            wrist - 0.08,
            0,
            0.006,
          ),
        ],
        !1,
      ),
    palmGlow = () =>
      f(
        i.armW * 0.26,
        0.014,
        i.armW * 0.2,
        0,
        wrist - 0.045,
        -i.armW * 0.26,
        0.004,
      );
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
    // The face. A brow ridge, two angled eye slots and a vertical grille for a
    // mouth -- the Ultron read. Multi-box features are merged into one
    // geometry each so a face costs three instanced meshes, not nine.
    p(
      a,
      f(
        i.head * 0.92,
        i.head * 0.13,
        0.026,
        0,
        i.head * 0.83,
        -i.head / 2 - 0.004,
        0.005,
      ),
      "head",
    ),
    p(
      a,
      mergeGeometries(
        [-1, 1].map((sx) => {
          const eye = f(
            i.head * 0.3,
            i.head * 0.12,
            0.028,
            sx * i.head * 0.25,
            i.head * 0.63,
            -i.head / 2 - 0.01,
            0.004,
          );
          // Cant the slots inward at the nose, which is what makes a face made
          // of boxes read as a scowl rather than a pair of headlights.
          eye.rotateZ(sx * 0.22);
          eye.translate(0, 0, 0);
          return eye;
        }),
        !1,
      ),
      "headGlow",
    ),
    p(
      a,
      f(
        i.head * 0.52,
        i.head * 0.24,
        0.02,
        0,
        i.head * 0.3,
        -i.head / 2 - 0.006,
        0.004,
      ),
      "headGlow",
    ),
    p(
      a,
      mergeGeometries(
        [0, 1, 2, 3, 4].map((n) =>
          f(
            i.head * 0.045,
            i.head * 0.28,
            0.028,
            (n - 2) * i.head * 0.115,
            i.head * 0.3,
            -i.head / 2 - 0.012,
            0.002,
          ),
        ),
        !1,
      ),
      "head",
    ),
    p(l, f(i.armW, i.armUL, i.armW, 0, -i.armUL / 2, 0), "body"),
    p(o, f(i.armW, i.armUL, i.armW, 0, -i.armUL / 2, 0), "body"),
    p(c, f(i.armW * 0.9, i.armLL, i.armW * 0.9, 0, -i.armLL / 2, 0), "body"),
    p(h, f(i.armW * 0.9, i.armLL, i.armW * 0.9, 0, -i.armLL / 2, 0), "body"),
    // Hands. These were a single glowing cube on the end of each forearm --
    // fine as an "emitter" while the glow was dim, but once the face needed a
    // brighter emissive to read, the cubes lit up like lanterns and the arms
    // ended in two blazing blocks. Metal hands now, with only a small palm
    // plate left glowing.
    p(c, handGeom(-1), "body"),
    p(c, palmGlow(), "glow"),
    p(h, handGeom(1), "body"),
    p(h, palmGlow(), "glow"),
    p(d, f(i.legW, i.legUL, i.legW, 0, -i.legUL / 2, 0), "body"),
    p(u, f(i.legW, i.legUL, i.legW, 0, -i.legUL / 2, 0), "body"),
    p(m, f(i.legW * 0.85, i.legLL, i.legW * 0.85, 0, -i.legLL / 2, 0), "body"),
    p(g, f(i.legW * 0.85, i.legLL, i.legW * 0.85, 0, -i.legLL / 2, 0), "body"),
    p(
      w2,
      f(i.legW, 0.08, i.legW * 1.7, 0, -0.01, -i.legW * 0.35, 0.015),
      "body",
    ),
    p(
      x2,
      f(i.legW, 0.08, i.legW * 1.7, 0, -0.01, -i.legW * 0.35, 0.015),
      "body",
    ),
    p(
      r,
      f(
        i.torso[0] * 0.76,
        0.05,
        0.055,
        0,
        i.torso[1] * 0.8,
        -i.torso[2] / 2,
        0.007,
      ),
      "body",
    ));
  // Articulated alloy joints and dark servo housings replace creature anatomy.
  for (const [node, radius] of [
    [l, i.armW * 0.65],
    [o, i.armW * 0.65],
    [c, i.armW * 0.5],
    [h, i.armW * 0.5],
    [m, i.legW * 0.55],
    [g, i.legW * 0.55],
  ]) {
    const joint = new CylinderGeometry(radius, radius, radius * 1.9, 10);
    joint.rotateZ(Math.PI / 2);
    p(node, joint, "joint");
  }
  for (let j = 0; j < 4; j++)
    p(
      r,
      f(
        i.torso[0] * 0.65,
        0.018,
        0.025,
        0,
        i.torso[1] * 0.22 + j * 0.045,
        i.torso[2] / 2 + 0.013,
        0.004,
      ),
      "joint",
    );
  if (i.spikes) {
    // Heavy unit: compact industrial cooling fins rather than organic spikes.
    for (let j = 0; j < 5; j++)
      p(
        r,
        f(
          0.035,
          0.26,
          0.12,
          (j - 2) * 0.1,
          i.torso[1] * 0.7,
          i.torso[2] / 2 + 0.04,
          0.005,
        ),
        "joint",
      );
  }
  if (i.sac) {
    const battery = new CylinderGeometry(0.2, 0.2, 0.52, 10);
    battery.translate(0, i.torso[1] * 0.55, i.torso[2] / 2 + 0.12);
    p(r, battery, "joint");
    p(
      r,
      f(0.1, 0.24, 0.03, 0, i.torso[1] * 0.55, i.torso[2] / 2 + 0.22, 0.006),
      "glow",
    );
  }
  if (i.tactical) {
    p(h, f(0.12, 0.48, 0.13, 0, -i.armLL - 0.13, -0.03), "joint");
    p(h, f(0.045, 0.3, 0.045, 0, -i.armLL - 0.5, -0.03), "joint");
  }
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
      ankL: w2,
      ankR: x2,
    },
    parts: v,
    ...rigMetrics(i),
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
attribute float aFlash; attribute float aDissolve; varying float vFlash; varying float vDissolve; varying vec3 vWPos; varying vec3 vOPos;`,
          )
          .replace(
            "#include <begin_vertex>",
            `#include <begin_vertex>
        vFlash = aFlash; vDissolve = aDissolve; vOPos = position;
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
varying float vFlash; varying float vDissolve; varying vec3 vWPos; varying vec3 vOPos; uniform float uTime;
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
        // Alloy wear on the body parts only: the glow panels are emissive
        // screens and the depth pass has no albedo to modulate. A single flat
        // roughness across a three-metre robot is the loudest untextured tell
        // there is, so the roughness term matters more than the tint.
        n ||
          e ||
          (s.fragmentShader = s.fragmentShader
            .replace(
              "#include <map_fragment>",
              `#include <map_fragment>
        vec3 op = vOPos;
        float wy = vWPos.y;
        float tint = 1.0;
        float rough = 0.0;
        ${wearSnippet("alloy")}
        diffuseColor.rgb *= clamp(tint, 0.0, 2.0);`,
            )
            .replace(
              "#include <roughnessmap_fragment>",
              `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + rough, 0.05, 1.0);`,
            )),
        n ||
          (s.fragmentShader = s.fragmentShader.replace(
            "#include <emissivemap_fragment>",
            `#include <emissivemap_fragment>
        ${e ? "totalEmissiveRadiance *= 0.75 + 0.35 * sin(uTime * 6.0 + vWPos.x * 3.0 + vWPos.z * 2.0);" : ""}
        totalEmissiveRadiance += vec3(1.0, 0.45, 0.12) * dBurn * 1.4;
        totalEmissiveRadiance += vec3(1.0, 0.95, 0.9) * vFlash * 0.2;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), vFlash * 0.12);`,
          )));
    }),
    (i.customProgramCacheKey = () =>
      "enemy_" + (n ? "depth" : e ? "glow" : "body")),
    i
  );
}

// Instanced skeletal rigs + projectile pool, posed each frame from sim state.
//
export class EnemyView {
  constructor(scene, { tactical = false } = {}) {
    this.tactical = tactical;
    ((this.scene = scene), (this.uTime = { value: 0 }), (this.types = {}));
    for (const a in ENEMIES) this._buildType(ENEMIES[a]);
    this._buildProjectiles();
  }
  _buildType(t) {
    const colors = theme.enemies[t.key],
      e = buildEnemyRig({ ...t.proportions, tactical: this.tactical }),
      n = new Float32Array(MAX_PER_TYPE),
      s = new Float32Array(MAX_PER_TYPE),
      r = makeEnemyMaterial(
        new MeshStandardMaterial({
          color: colors.body,
          roughness: 0.36,
          metalness: 0.72,
        }),
        this.uTime,
        !1,
      ),
      a = makeEnemyMaterial(
        new MeshStandardMaterial({
          color: 0,
          emissive: new Color(...colors.glow),
          // Above the 1.6 bloom threshold, so the eye slots actually throw
          // light instead of just being pale paint. A lit face in a dark head
          // is most of the read.
          emissiveIntensity: 2.1,
          roughness: 0.6,
          metalness: 0,
        }),
        this.uTime,
        !0,
      ),
      l = [];
    const jointMat = makeEnemyMaterial(
      new MeshStandardMaterial({
        color: 0x252e34,
        roughness: 0.46,
        metalness: 0.85,
      }),
      this.uTime,
      false,
    );
    for (const o of e.parts) {
      const c = o.kind === "glow" || o.kind === "headGlow",
        h = new InstancedBufferAttribute(n, 1),
        d = new InstancedBufferAttribute(s, 1);
      (h.setUsage(DynamicDrawUsage),
        d.setUsage(DynamicDrawUsage),
        o.geom.setAttribute("aFlash", h),
        o.geom.setAttribute("aDissolve", d));
      const u = new InstancedMesh(
        o.geom,
        c ? a : o.kind === "joint" ? jointMat : r,
        MAX_PER_TYPE,
      );
      (u.instanceMatrix.setUsage(DynamicDrawUsage),
        (u.frustumCulled = !1),
        (u.castShadow = !c),
        (u.receiveShadow = !c),
        (u.count = 0),
        (u.customDepthMaterial = makeEnemyMaterial(
          new MeshDepthMaterial({ depthPacking: RGBADepthPacking }),
          this.uTime,
          !1,
          !0,
        )),
        this.scene.add(u),
        l.push({ mesh: u, part: o, fa: h, da: d }));
    }
    this.types[t.key] = { def: t, rig: e, meshes: l, flash: n, dissolve: s };
  }
  _buildProjectiles() {
    const t = new SphereGeometry(0.17, 12, 10),
      e = new MeshStandardMaterial({
        color: 0x264b6d,
        emissive: 0x439edb,
        emissiveIntensity: 4.5,
        roughness: 0.4,
      });
    ((this.projMesh = new InstancedMesh(t, e, MAX_PROJECTILES)),
      this.projMesh.instanceMatrix.setUsage(DynamicDrawUsage),
      (this.projMesh.frustumCulled = !1),
      (this.projMesh.count = 0),
      this.scene.add(this.projMesh),
      (this._pm = new Matrix4()));
  }
  // alpha interpolates prev→current tick for positions and yaw.
  // Enemy shadow casting, toggled by the graphics setting. At a full wave the
  // robots are about 84 extra draw calls and 410k extra triangles a frame, so
  // this is the single biggest thing the Performance tier can give back.
  setShadows(on) {
    for (const k in this.types)
      for (const m of this.types[k].meshes)
        if (m.part.kind !== "glow" && m.part.kind !== "headGlow")
          ((m.mesh.castShadow = on), (m.mesh.receiveShadow = on));
  }
  sync(enemies, projectiles, alpha, time) {
    this.uTime.value = time;
    for (const t in this.types) {
      const e = this.types[t],
        n = e.rig,
        s = n.n,
        r = e.def.proportions;
      let a = 0;
      for (const l of enemies.list) {
        if (l.type !== t || a >= MAX_PER_TYPE) continue;
        const o = l.scale,
          c = l.squash;
        (n.root.position.lerpVectors(l.prevPos, l.pos, alpha),
          n.root.rotation.set(
            l.toppleX,
            lerpAngle(l.prevYaw, l.yaw, alpha),
            l.toppleZ,
          ),
          n.root.scale.set(o * (1 + c * 0.6), o * (1 - c), o * (1 + c * 0.6)));
        const h = l.phase,
          d = l.moveBlend,
          // Charge reads off speed rather than a state flag, so it eases in
          // and out on its own. The sim gives the brute a 10 m/s charge
          // against a 3.7 m/s walk, but the leg cadence saturates well before
          // that -- without this a charging three-metre robot animates
          // exactly like one out for a stroll.
          chg =
            l.def.chargeSpeed > l.def.speed
              ? Math.min(
                  1,
                  Math.max(
                    0,
                    (Math.hypot(l.vel.x, l.vel.z) - l.def.speed) /
                      (l.def.chargeSpeed - l.def.speed),
                  ),
                )
              : 0,
          // Idle. Everything above is gated on moveBlend, so a stopped robot
          // used to freeze mid-A-pose; a planted spitter was a statue.
          idle = 1 - d,
          it = time + l.id * 0.7,
          // 0.95 rad is 54 degrees of hip swing. A straight leg swung that
          // far shortens by legLen*(1-cos) = 0.36 m, and the pelvis has to
          // drop by all of it to keep the foot down -- which is why the old
          // gait either floated both feet or squatted 32 cm a step. Real hip
          // flexion in a walk is about 25 degrees; the charge boost buys the
          // extra travel a sprint genuinely has.
          stride = 0.5 + chg * 0.45,
          u = Math.sin(h) * stride * d,
          m = Math.sin(h + Math.PI) * stride * d;
        // ---------------------------------------------------------------
        // Skeletal pose. Two sign rules drive everything below, and every
        // joint that read wrong was one of them applied backwards.
        //
        // 1. Nodes whose geometry hangs DOWN from them -- shL/shR, elL/elR,
        //    legL/legR, knL/knR -- swing toward -Z, the model's FRONT, on a
        //    POSITIVE rotation.x. So +x is flexion (forward), -x extension.
        // 2. Nodes whose geometry stands UP from them -- torso, neck -- are
        //    the mirror image: -x pitches the chest and the head FORWARD.
        //
        // Joint limits are the other half of it. Shoulders and hips swing
        // both ways; elbows and knees are hinges that fold ONE way only --
        // the forearm folds forward (elL/elR.rotation.x >= 0), the shin
        // folds backward (knL/knR.rotation.x <= 0). Nothing below may cross
        // those, and that is what makes the rig read as a skeleton instead
        // of a bag of boxes. None of this is robot-specific: the only
        // robot-flavoured values are the posture constants (r.lean, shBase,
        // elBase, armAmp), which is exactly where a zombie would differ.
        // ---------------------------------------------------------------
        //
        // Knees flex BACKWARD, peaking just after toe-off and straightening
        // again by heel strike. The old term was positive with a +0.1 floor,
        // i.e. a permanently hyperextended, bird-jointed leg.
        const kfL = Math.max(0, -Math.sin(h - 0.9)) * 1.15 * d + 0.06,
          kfR = Math.max(0, -Math.sin(h + Math.PI - 0.9)) * 1.15 * d + 0.06,
          // How far the hip sits above the ankle for a leg swung to `a` with
          // its knee folded by `kf`. Closed form, so pelvis height can be
          // solved rather than approximated.
          legReach = (a, kf) =>
            r.legUL * Math.cos(a) + r.legLL * Math.cos(a - kf),
          // The reach n.hipH was authored against: legs down, resting flex.
          restReach = r.legUL + r.legLL * Math.cos(0.06),
          // Drop the pelvis by exactly what the longer -- i.e. planted -- leg
          // loses. The standing foot then holds ONE height for the whole
          // cycle instead of pumping through the pavement. Anchored at rest,
          // so a standing unit is still exactly n.hipH tall and stays
          // registered with the hitboxes the sim derives from that number.
          stand = Math.max(legReach(u, kfL), legReach(m, kfR)) - restReach;
        ((s.legL.rotation.x = u),
          (s.legR.rotation.x = m),
          (s.knL.rotation.x = -kfL),
          (s.knR.rotation.x = -kfR),
          // Hold the feet level against the leg and knee above them instead
          // of letting them trail the shin.
          (s.ankL.rotation.x = -(u + s.knL.rotation.x) * 0.72),
          (s.ankR.rotation.x = -(m + s.knR.rotation.x) * 0.72),
          (s.hips.position.y =
            n.hipH +
            stand -
            (1 - d) * 0.02 +
            Math.sin(it * 1.7) * 0.008 * idle),
          // Weight shifts ONTO the stance leg. legL sits at -x and carries
          // the body through h = PI, so the shift is cos(h): the old sin(h)
          // was a quarter cycle out and leaned onto the airborne leg.
          (s.hips.position.x = Math.cos(h) * 0.03 * d),
          // The pelvis leads with the SWINGING leg while the ribcage
          // counter-rotates against it. Both signs were flipped before, so
          // the pelvis twisted toward the planted foot and the two nearly
          // cancelled instead of reading as a gait.
          (s.hips.rotation.y = -Math.sin(h) * 0.12 * d));
        // Torso pitch: negative is the forward hunch (rule 2). This term was
        // positive, so every unit stood up and rocked BACKWARD -- worst on a
        // charge, where +chg*0.45 fought the sim's own -0.15 lean-in and won.
        // attackLean is sim state and is not touched; the view simply reads
        // it in the same "negative is forward" sense, which makes a windup
        // rear the chest back and the strike pitch it onto the blow.
        const hunch = -(r.lean * d + 0.08 + chg * 0.45),
          aLean = -l.attackLean;
        ((s.torso.rotation.x = hunch + aLean),
          (s.torso.rotation.y =
            Math.sin(h) * 0.16 * d + Math.sin(it * 0.8) * 0.05 * idle),
          // The trunk lists toward the stance leg, in phase with the hips.
          (s.torso.rotation.z = -Math.cos(h) * 0.05 * d),
          // The neck counter-rotates so the head stays level and the eyes
          // stay on the player through the hunch, the charge and the attack.
          (s.neck.rotation.x = -hunch * 0.75 - aLean * 0.6),
          // A stopped unit sweeps its head, looking for you.
          (s.neck.rotation.y = Math.sin(it * 0.63) * 0.4 * idle));
        let g = 0,
          v = 0;
        if (l.state === "attack") {
          const p = l.def;
          // The sim lands the hit at t = windup. The strike therefore has to
          // be at FULL extension by then, not starting there: the first
          // version ramped the swing after windup, so the arm was at its most
          // retracted at the moment of contact and the player took damage and
          // only then watched the arm move. Purely a presentation fix -- the
          // sim's timing, damage and determinism are untouched.
          //
          // Pull back over the first 62% of the windup, snap through over the
          // rest so the blow arrives on the beat, then recover over the swing.
          const pull = p.windup * 0.62;
          if (l.t < pull) ((g = l.t / pull), (v = 0));
          else if (l.t < p.windup)
            ((g = 1 - (l.t - pull) / (p.windup - pull)),
              (v = (l.t - pull) / (p.windup - pull)));
          else
            ((g = 0),
              (v = Math.max(
                0,
                1 - (l.t - p.windup) / Math.max(0.12, p.swing * 0.7),
              )));
        }
        // ---- Arms -------------------------------------------------------
        // Shoulders swing CONTRALATERALLY with the legs: legL is sin(h), so
        // the left arm is sin(h + PI). That much was already right; every
        // constant around it was not.
        const reach = r.armsForward ? 1 : 0,
          // A reaching unit holds its arms out and lets them bob; a hanging
          // unit swings them from the shoulder.
          armAmp = (reach ? 0.24 : 0.5) + chg * 0.3,
          swL = Math.sin(h + Math.PI) * armAmp * d,
          swR = Math.sin(h) * armAmp * d,
          // Cancel most of the torso's pitch so the arms hang plumb from
          // the shoulder instead of riding forward with the chest they hang
          // off -- including through the attack lean, so a slam drives the
          // hands DOWN AND FORWARD rather than flinging them out behind.
          hang = -(hunch + aLean) * 0.85,
          // Resting shoulder flexion. `armsForward` now does what its name
          // says: +1.12 rad puts the upper arms out in front. It used to be
          // -1.35, which is 77 degrees BEHIND the body -- the reason the one
          // unit flagged "arms forward" walked with its hands behind its back.
          shBase = reach ? 1.12 : 0,
          // A resting elbow is never straight, and it folds further as the
          // arm swings forward. The old -0.6 constant was 34 degrees of
          // hyperextension and -g*0.5 took it to 63 during a windup.
          elBase = (reach ? 0.5 : 0.22) + chg * 0.35,
          // Windup (g) cocks the arm -- a reacher draws it back and folds it
          // to the chest, a hanger hauls it up overhead. The strike (v)
          // drives the elbow straight and throws the shoulder through, so
          // v = 1 is full extension: the frame the sim lands the hit on.
          shX =
            shBase +
            hang +
            g * (reach ? -0.75 : 1.7) +
            v * (reach ? 0.62 : 0.3),
          elX = elBase + g * (reach ? 0.7 : 1.05) - v * (reach ? 0.45 : 0.2),
          // Abduction. Negative rotation.z lifts the LEFT arm away from the
          // body, since shL sits at -x. The old +0.35/-0.35 pair pulled both
          // arms across the chest and buried the elbows in the torso box.
          abd = 0.13 + g * 0.3 + chg * 0.12,
          // Carrying angle: the forearm sits a few degrees outboard of the
          // upper arm, which is what keeps the hands clear of the hips on
          // the back half of the swing.
          carry = 0.16;
        ((s.shL.rotation.x = shX + swL),
          (s.shR.rotation.x = shX + swR),
          (s.shL.rotation.z = -abd + Math.max(0, swL) * 0.12 + v * 0.1),
          (s.shR.rotation.z = abd - Math.max(0, swR) * 0.12 - v * 0.1),
          // Clamped at the hinge stop so no combination of blend inputs can
          // ever invert an elbow again.
          (s.elL.rotation.x = Math.max(0.04, elX + Math.max(0, swL) * 0.5)),
          (s.elR.rotation.x = Math.max(0.04, elX + Math.max(0, swR) * 0.5)),
          (s.elL.rotation.z = -carry),
          (s.elR.rotation.z = carry),
          l.tactical && (s.shR.rotation.set(0.4, 0, 0.1), s.elR.rotation.set(1.05, 0, 0), s.shL.rotation.set(0.5, 0, -0.1), s.elL.rotation.set(0.9, 0, 0)),
          n.root.updateMatrixWorld(!0));
        for (const p of e.meshes) {
          const f =
            l.headless &&
            (p.part.kind === "head" || p.part.kind === "headGlow");
          p.mesh.setMatrixAt(a, f ? ZERO_MATRIX : p.part.node.matrixWorld);
        }
        ((e.flash[a] = l.flash), (e.dissolve[a] = l.dissolve), a++);
      }
      for (const l of e.meshes)
        ((l.mesh.count = a),
          (l.mesh.instanceMatrix.needsUpdate = !0),
          (l.fa.needsUpdate = !0),
          (l.da.needsUpdate = !0));
    }
    let n = 0;
    for (const s of projectiles.list) {
      if (!s.active) continue;
      (this._pm.makeTranslation(s.pos.x, s.pos.y, s.pos.z),
        this.projMesh.setMatrixAt(n++, this._pm));
    }
    ((this.projMesh.count = n),
      (this.projMesh.instanceMatrix.needsUpdate = !0));
  }
}
