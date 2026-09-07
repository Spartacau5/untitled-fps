import { MeshStandardMaterial } from "three";
import { NOISE_GLSL } from "../shaders/noise.glsl.js";

// Metre-scaled PBR surfaces. They stay at the same physical scale on a 2 m
// planter and a 20 m building, instead of stretching one facade bitmap over
// every box. Height affects the lighting normal, not just the base colour.
export function streetMaterial(
  kind,
  color,
  { roughness = 0.8, metalness = 0 } = {},
) {
  const mat = new MeshStandardMaterial({ color, roughness, metalness });
  const code = {
    brick: `
      vec2 cellSize = vec2(.245,.078);
      float row = floor(p.y/cellSize.y);
      vec2 q = vec2(p.x + mod(row,2.0)*cellSize.x*.5,p.y)/cellSize;
      vec2 cell = floor(q), edge = min(fract(q),1.0-fract(q))*cellSize;
      float joint = smoothstep(.002,.009,min(edge.x,edge.y));
      float variation = noise2(cell*4.1);
      float pores = noise2(p*170.0);
      streetHeight = joint*.006 + pores*.0007;
      diffuseColor.rgb *= mix(vec3(.68,.65,.58),vec3(.76+variation*.43),joint);
      diffuseColor.rgb *= .88+pores*.2;
      streetRough = mix(.98,.74+pores*.22,joint);
    `,
    concrete: `
      float fine = noise2(p*155.0), patch = noise2(p*.9);
      float seams = smoothstep(.003,.014,min(abs(fract(p.x/1.3)-.5)*1.3,abs(fract(p.y/.75)-.5)*.75));
      streetHeight = fine*.0015 + seams*.001;
      diffuseColor.rgb *= (.86+patch*.19)*mix(.65,1.0,seams);
      streetRough = .78+fine*.2;
    `,
    asphalt: `
      float aggregate = noise2(p*195.0), wear = noise2(p*.55);
      float patch = smoothstep(.50,.76,noise2(p*.8+8.0));
      streetHeight = aggregate*.0025;
      diffuseColor.rgb *= (.68+aggregate*.5)*(1.0-patch*.23);
      streetRough = mix(.93,.42,patch*.8);
    `,
    stone: `
      float fine = noise2(p*110.0), veins = noise2(vec2(p.x*8.0,p.y*1.7));
      streetHeight = fine*.0008;
      diffuseColor.rgb *= .84+fine*.12+veins*.08;
      streetRough = .67+fine*.2;
    `,
    metal: `
      float grain = noise2(vec2(p.x*160.0,p.y*5.0));
      streetHeight = grain*.00012;
      diffuseColor.rgb *= .91+grain*.15;
      streetRough = .38+grain*.22;
    `,
  }[kind];
  if (!code) throw new Error(`Unknown street material ${kind}`);
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vStreetPos; varying vec3 vStreetNormal;",
      )
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvStreetPos=(modelMatrix*vec4(transformed,1.0)).xyz; vStreetNormal=normalize(mat3(modelMatrix)*normal);",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>\nvarying vec3 vStreetPos; varying vec3 vStreetNormal;\n${NOISE_GLSL}`,
      )
      .replace(
        "#include <map_fragment>",
        `#include <map_fragment>
      vec3 axis=abs(vStreetNormal);
      vec2 p=axis.y>.7?vStreetPos.xz:(axis.x>axis.z?vStreetPos.zy:vStreetPos.xy);
      float streetHeight=0.0,streetRough=roughness;
      ${code}
      float baseStain=(1.0-smoothstep(.0,.65,vStreetPos.y))*(1.0-axis.y);
      diffuseColor.rgb *= 1.0-baseStain*.2;
      `,
      )
      .replace(
        "#include <roughnessmap_fragment>",
        "#include <roughnessmap_fragment>\nroughnessFactor=clamp(streetRough,.08,1.0);",
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
      vec3 sx=dFdx(-vViewPosition),sy=dFdy(-vViewPosition);
      vec3 rx=cross(sy,normal),ry=cross(normal,sx);
      float determinant=dot(sx,rx);
      vec3 surfaceGradient=sign(determinant)*(dFdx(streetHeight)*rx+dFdy(streetHeight)*ry);
      normal=normalize(max(abs(determinant),1e-12)*normal-surfaceGradient);
      `,
      );
  };
  mat.customProgramCacheKey = () => `midtown-surface-v1-${kind}`;
  return mat;
}
