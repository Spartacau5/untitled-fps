import * as THREE from 'three';
import { rng } from '../core/PRNG.js';

// G2: procedural textures with real character — rough concrete, scratched
// metal, dusty glass, wood. Generated once, reused. No external assets (C1).
function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}
function toTexture(c, srgb = true, repeat = [1, 1]) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  return t;
}
function noise(g, w, h, alpha, scale) {
  const img = g.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rng.next() - 0.5) * 255 * scale;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
    d[i + 3] = 255 * alpha;
  }
  g.putImageData(img, 0, 0);
}

export function makeConcrete(base = '#8b8781', repeat = [2, 2]) {
  const [c, g] = canvas(512, 512);
  g.fillStyle = base;
  g.fillRect(0, 0, 512, 512);
  // blotches
  for (let i = 0; i < 40; i++) {
    const x = rng.next() * 512, y = rng.next() * 512, r = rng.range(20, 90);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    const dark = rng.chance(0.5);
    grd.addColorStop(0, dark ? 'rgba(60,58,54,0.25)' : 'rgba(200,196,188,0.18)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // stains / streaks
  for (let i = 0; i < 24; i++) {
    const x = rng.next() * 512;
    g.strokeStyle = `rgba(50,48,44,${rng.range(0.03, 0.12)})`;
    g.lineWidth = rng.range(1, 4);
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x + rng.range(-30, 30), 512); g.stroke();
  }
  // fine grain
  noise(g, 512, 512, 0.5, 0.06);
  return toTexture(c, true, repeat);
}

export function makeWood(repeat = [1, 1]) {
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#7a5a34';
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 12; i++) {
    const x = rng.next() * 256;
    g.strokeStyle = `rgba(60,40,20,${rng.range(0.1, 0.4)})`;
    g.lineWidth = rng.range(1, 3);
    g.beginPath();
    g.moveTo(x, 0);
    for (let y = 0; y <= 256; y += 16) g.lineTo(x + Math.sin(y * 0.1 + i) * 6, y);
    g.stroke();
  }
  // nail holes
  for (let i = 0; i < 10; i++) {
    g.fillStyle = 'rgba(30,20,10,0.6)';
    g.beginPath(); g.arc(rng.next() * 256, rng.next() * 256, 2, 0, 7); g.fill();
  }
  noise(g, 256, 256, 0.5, 0.08);
  return toTexture(c, true, repeat);
}

export function makeMetal(base = '#9aa0a8', repeat = [1, 1]) {
  const [c, g] = canvas(256, 256);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  // scratches
  for (let i = 0; i < 60; i++) {
    const x = rng.next() * 256, y = rng.next() * 256;
    g.strokeStyle = rng.chance(0.5) ? 'rgba(255,255,255,0.15)' : 'rgba(20,20,25,0.2)';
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + rng.range(-30, 30), y + rng.range(-6, 6)); g.stroke();
  }
  // rust patches
  for (let i = 0; i < 16; i++) {
    const x = rng.next() * 256, y = rng.next() * 256, r = rng.range(4, 20);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(120,60,20,0.3)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  noise(g, 256, 256, 0.5, 0.05);
  return toTexture(c, true, repeat);
}

export function makeDrywall(repeat = [2, 1]) {
  const [c, g] = canvas(256, 128);
  g.fillStyle = '#cfcac0';
  g.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 20; i++) {
    g.fillStyle = `rgba(150,145,135,${rng.range(0.05, 0.15)})`;
    g.fillRect(rng.next() * 256, rng.next() * 128, rng.range(10, 40), rng.range(10, 40));
  }
  // torn edge line
  g.strokeStyle = 'rgba(120,115,105,0.4)';
  g.lineWidth = 2;
  g.beginPath();
  for (let x = 0; x <= 256; x += 8) g.lineTo(x, 4 + Math.sin(x * 0.3) * 2);
  g.stroke();
  noise(g, 256, 128, 0.4, 0.05);
  return toTexture(c, true, repeat);
}

export function makeConcreteNormal(base = '#8b8781') {
  // Cheap "normal-ish" variation: we bake a subtle bump map instead (used as bumpMap).
  const [c, g] = canvas(256, 256);
  g.fillStyle = '#808080';
  g.fillRect(0, 0, 256, 256);
  noise(g, 256, 256, 1.0, 0.25);
  return toTexture(c, false, [2, 2]);
}

// ---- AAA-grade procedural texture pack (shared by environment + enemies) ----

// Large rooftop concrete: tile seams, cracks, oil stains, painted hazard
// stripe, tire scuffs, drain grate. Use with repeat [4,4] on the floor.
export function makeRoofFloor() {
  const S = 1024;
  const [c, g] = canvas(S, S);
  g.fillStyle = '#57534c';
  g.fillRect(0, 0, S, S);
  // large tonal patches
  for (let i = 0; i < 60; i++) {
    const x = rng.next() * S, y = rng.next() * S, r = rng.range(40, 220);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, rng.chance(0.5) ? 'rgba(70,66,60,0.22)' : 'rgba(150,144,134,0.14)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // oil / water stains
  for (let i = 0; i < 14; i++) {
    const x = rng.next() * S, y = rng.next() * S, r = rng.range(18, 70);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(20,18,16,0.35)');
    grd.addColorStop(0.7, 'rgba(30,26,22,0.18)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  // tile seams (2x2 grid of big slabs)
  g.strokeStyle = 'rgba(28,26,24,0.8)';
  g.lineWidth = 5;
  for (let i = 0; i <= 2; i++) {
    g.beginPath(); g.moveTo((S / 2) * i, 0); g.lineTo((S / 2) * i, S); g.stroke();
    g.beginPath(); g.moveTo(0, (S / 2) * i); g.lineTo(S, (S / 2) * i); g.stroke();
  }
  // cracks
  g.strokeStyle = 'rgba(25,23,21,0.55)';
  for (let i = 0; i < 26; i++) {
    g.lineWidth = rng.range(1, 2.5);
    g.beginPath();
    let x = rng.next() * S, y = rng.next() * S;
    g.moveTo(x, y);
    const steps = rng.int(4, 10);
    for (let s2 = 0; s2 < steps; s2++) {
      x += rng.range(-60, 60); y += rng.range(-60, 60);
      g.lineTo(x, y);
    }
    g.stroke();
  }
  // painted yellow hazard stripe along one seam (faded)
  g.save();
  g.globalAlpha = 0.5;
  g.fillStyle = '#b8912a';
  g.fillRect(0, S / 2 - 26, S, 26);
  g.restore();
  // tire scuffs (dark arcs)
  g.strokeStyle = 'rgba(25,23,20,0.3)';
  for (let i = 0; i < 10; i++) {
    g.lineWidth = rng.range(6, 14);
    const x = rng.next() * S, y = rng.next() * S;
    g.beginPath();
    g.arc(x, y, rng.range(60, 160), rng.next() * 6, rng.next() * 2 + 0.5);
    g.stroke();
  }
  // drain grate
  {
    const gx = S * 0.78, gy = S * 0.22;
    g.fillStyle = '#2a2825';
    g.fillRect(gx - 34, gy - 34, 68, 68);
    g.strokeStyle = '#151312';
    g.lineWidth = 5;
    for (let i = -2; i <= 2; i++) {
      g.beginPath(); g.moveTo(gx - 28, gy + i * 12); g.lineTo(gx + 28, gy + i * 12); g.stroke();
    }
  }
  noise(g, S, S, 0.5, 0.08);
  return toTexture(c, true, [4, 4]);
}

// Cloth weave for uniforms (bump + albedo base)
export function makeFabric(base = '#3a4048') {
  const [c, g] = canvas(256, 256);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  // weave
  g.globalAlpha = 0.16;
  for (let y = 0; y < 256; y += 4) {
    g.fillStyle = (y / 4) % 2 ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
    g.fillRect(0, y, 256, 2);
  }
  for (let x = 0; x < 256; x += 4) {
    g.fillStyle = (x / 4) % 2 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.3)';
    g.fillRect(x, 0, 2, 256);
  }
  g.globalAlpha = 1;
  noise(g, 256, 256, 0.6, 0.07);
  return toTexture(c, true, [3, 3]);
}

// Subtle multi-color camo blotches
export function makeCamo(colors = ['#4a4a3a', '#2e3230', '#5a5344', '#23262a']) {
  const [c, g] = canvas(256, 256);
  g.fillStyle = colors[0];
  g.fillRect(0, 0, 256, 256);
  for (let i = 1; i < colors.length; i++) {
    g.fillStyle = colors[i];
    for (let b = 0; b < 22; b++) {
      const x = rng.next() * 256, y = rng.next() * 256, r = rng.range(10, 34);
      g.beginPath();
      g.ellipse(x, y, r, r * rng.range(0.5, 1), rng.next() * 3, 0, 7);
      g.fill();
    }
  }
  noise(g, 256, 256, 0.5, 0.06);
  return toTexture(c, true, [2, 2]);
}

// Brushed metal with panel seams + rivets
export function makeMetalPanel(base = '#8a9099') {
  const [c, g] = canvas(256, 256);
  g.fillStyle = base;
  g.fillRect(0, 0, 256, 256);
  // brushed streaks
  for (let i = 0; i < 90; i++) {
    const y = rng.next() * 256;
    g.strokeStyle = rng.chance(0.5) ? 'rgba(255,255,255,0.08)' : 'rgba(20,22,26,0.1)';
    g.lineWidth = rng.range(1, 2);
    g.beginPath(); g.moveTo(0, y); g.lineTo(256, y + rng.range(-3, 3)); g.stroke();
  }
  // panel seam
  g.strokeStyle = 'rgba(20,22,26,0.5)';
  g.lineWidth = 3;
  g.strokeRect(6, 6, 244, 244);
  // rivets
  g.fillStyle = 'rgba(230,235,240,0.5)';
  for (const [x, y] of [[16, 16], [240, 16], [16, 240], [240, 240], [128, 16], [128, 240]]) {
    g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill();
  }
  noise(g, 256, 256, 0.4, 0.05);
  return toTexture(c, true, [1, 1]);
}

// Emissive window grid for city buildings (used as emissiveMap)
export function makeWindowGrid(cols = 10, rows = 22, lit = 0.45) {
  const W = 128, H = 256;
  const [c, g] = canvas(W, H);
  g.fillStyle = '#05070c';
  g.fillRect(0, 0, W, H);
  const cw = W / cols, rh = H / rows;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      if (!rng.chance(lit)) continue;
      const warm = rng.chance(0.75);
      g.fillStyle = warm
        ? `rgba(255,${190 + rng.int(0, 40)},${110 + rng.int(0, 40)},${rng.range(0.5, 0.95)})`
        : `rgba(${140 + rng.int(0, 40)},${190 + rng.int(0, 40)},255,${rng.range(0.4, 0.8)})`;
      g.fillRect(col * cw + 2, r * rh + 2, cw - 4, rh - 4);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Diagonal yellow/black hazard stripes
export function makeHazard(yellow = '#c8a02a', dark = '#23252a') {
  const [c, g] = canvas(128, 128);
  g.fillStyle = dark;
  g.fillRect(0, 0, 128, 128);
  g.fillStyle = yellow;
  for (let i = -128; i < 256; i += 32) {
    g.beginPath();
    g.moveTo(i, 0); g.lineTo(i + 16, 0); g.lineTo(i + 16 + 128, 128); g.lineTo(i + 128, 128);
    g.closePath(); g.fill();
  }
  noise(g, 128, 128, 0.4, 0.06);
  const t = toTexture(c, true, [2, 1]);
  return t;
}

// Radial glow sprite texture (for muzzle flash, lights, particles).
export function makeGlow(color = 'rgba(255,220,160,1)') {
  const [c, g] = canvas(128, 128);
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, color);
  grd.addColorStop(0.3, color.replace(/1\)$/, '0.6)'));
  grd.addColorStop(1, color.replace(/[\d.]+\)$/, '0)'));
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  return toTexture(c);
}
