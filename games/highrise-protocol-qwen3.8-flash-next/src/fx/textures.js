// FX texture bakery — every map is a CanvasTexture generated once at init from the
// seeded rng (C2). No runtime canvas work, no external assets.
import * as THREE from 'three';
import { rng } from '../core/rng.js';

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  return c;
}

function tex(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 1;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  return t;
}

// Radial soft blob helper (white on transparent — tinted per system / per instance).
function blob(ctx, x, y, r, peak, mid) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(255,255,255,${peak})`);
  g.addColorStop(0.45, `rgba(255,255,255,${mid})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** Soft round puff for additive dust / embers / fireball. */
export function softCircle() {
  const c = canvas(128), ctx = c.getContext('2d');
  blob(ctx, 64, 64, 62, 1, 0.42);
  return tex(c);
}

/** Lumpy multi-blob puff — concrete dust, gypsum clouds (reads less like a lens flare). */
export function puffBlob() {
  const c = canvas(128), ctx = c.getContext('2d');
  blob(ctx, 60, 66, 46, 0.85, 0.4);
  const n = 4;
  for (let i = 0; i < n; i++) {
    const a = rng.range(0, Math.PI * 2), d = rng.range(14, 30);
    blob(ctx, 64 + Math.cos(a) * d, 64 + Math.sin(a) * d, rng.range(16, 28), 0.5, 0.22);
  }
  return tex(c);
}

/** Hot streak, tall in V (sparks, tracer beams). */
export function streakTex() {
  const c = canvas(64);
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.5, 'rgba(255,255,255,1)');
  g.addColorStop(0.82, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(24, 0, 16, 64);
  // soft lateral glow
  const h = ctx.createLinearGradient(0, 0, 64, 0);
  h.addColorStop(0, 'rgba(255,255,255,0)');
  h.addColorStop(0.5, 'rgba(255,255,255,0.35)');
  h.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = h;
  ctx.fillRect(0, 8, 64, 48);
  return tex(c);
}

/** Tracer beam — hot core, tapered ends, vertical = along beam. */
export function tracerTex() {
  const c = canvas(64);
  c.width = 32; c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.32, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.78, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(11, 0, 10, 128);
  const h = ctx.createLinearGradient(0, 0, 32, 0);
  h.addColorStop(0, 'rgba(255,255,255,0)');
  h.addColorStop(0.5, 'rgba(255,255,255,0.28)');
  h.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = h;
  ctx.fillRect(0, 0, 32, 128);
  return tex(c);
}

/** Crumpled paper sheet for W2 gusts. */
export function paperTex() {
  const c = canvas(64);
  c.width = 64; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#d8d2c2';
  ctx.fillRect(8, 6, 48, 52);
  ctx.strokeStyle = 'rgba(90,84,70,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(14, 20); ctx.lineTo(42, 18);
  ctx.moveTo(12, 32); ctx.lineTo(48, 35);
  ctx.moveTo(16, 46); ctx.lineTo(40, 44);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.moveTo(28, 6); ctx.lineTo(24, 58);
  ctx.stroke();
  ctx.globalCompositeOperation = 'destination-out';
  // ragged corner bite so it never reads as a flat quad
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(56, 6); ctx.lineTo(46, 6); ctx.lineTo(56, 16); ctx.closePath();
  ctx.fill();
  return tex(c);
}

// ---------- decal bakes (white ink, tinted by per-variant material color) ----------

function jaggedHole(ctx, cx, cy, r, points, jitter) {
  ctx.beginPath();
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const rr = r * (1 - jitter * 0.5 + rng.next() * jitter);
    const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/** Concrete bullet hole: dark core + dust ring + radial micro-cracks. */
export function bulletHoleTex(cracks) {
  const c = canvas(128), ctx = c.getContext('2d');
  blob(ctx, 64, 64, 58, 0.34, 0.16); // dust halo
  ctx.strokeStyle = 'rgba(40,36,32,0.85)';
  for (let i = 0; i < cracks; i++) {
    const a = rng.range(0, Math.PI * 2);
    const l = rng.range(20, 46);
    ctx.lineWidth = rng.range(0.8, 1.8);
    ctx.beginPath();
    ctx.moveTo(64 + Math.cos(a) * 9, 64 + Math.sin(a) * 9);
    ctx.lineTo(64 + Math.cos(a + rng.gauss() * 0.08) * l, 64 + Math.sin(a + rng.gauss() * 0.08) * l);
    ctx.stroke();
  }
  const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 13);
  g.addColorStop(0, 'rgba(10,9,8,1)');
  g.addColorStop(0.65, 'rgba(18,16,14,0.92)');
  g.addColorStop(1, 'rgba(28,25,22,0)');
  ctx.fillStyle = g;
  jaggedHole(ctx, 64, 64, 13, 12, 0.5);
  ctx.fill();
  return tex(c);
}

/** Metal ding: bright star scuff with dark pinprick. */
export function dingTex() {
  const c = canvas(128), ctx = c.getContext('2d');
  ctx.strokeStyle = 'rgba(230,230,235,0.9)';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + rng.range(-0.2, 0.2);
    ctx.lineWidth = rng.range(1.4, 3);
    ctx.beginPath();
    ctx.moveTo(64 + Math.cos(a) * 7, 64 + Math.sin(a) * 7);
    ctx.lineTo(64 + Math.cos(a) * rng.range(26, 44), 64 + Math.sin(a) * rng.range(26, 44));
    ctx.stroke();
  }
  blob(ctx, 64, 64, 16, 0.65, 0.25);
  ctx.fillStyle = 'rgba(22,20,20,0.95)';
  ctx.beginPath(); ctx.arc(64, 64, 5, 0, Math.PI * 2); ctx.fill();
  return tex(c);
}

/** Glass crack: radial star lines, almost clear center. */
export function crackTex() {
  const c = canvas(128), ctx = c.getContext('2d');
  ctx.strokeStyle = 'rgba(235,245,250,0.85)';
  const spokes = 11;
  const pts = [];
  for (let i = 0; i < spokes; i++) pts.push(64 + Math.cos((i / spokes) * Math.PI * 2) * rng.range(50, 62), 64 + Math.sin((i / spokes) * Math.PI * 2) * rng.range(50, 62));
  for (let i = 0; i < spokes; i++) {
    ctx.lineWidth = rng.range(0.8, 1.6);
    ctx.beginPath();
    ctx.moveTo(64, 64);
    // slightly kinked spoke
    const mx = (64 + pts[i * 2]) / 2 + rng.gauss() * 5, my = (64 + pts[i * 2 + 1]) / 2 + rng.gauss() * 5;
    ctx.quadraticCurveTo(mx, my, pts[i * 2], pts[i * 2 + 1]);
    ctx.stroke();
  }
  // one concentric fracture ring
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(235,245,250,0.5)';
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r = 22 + Math.sin(a * 5) * 4 + rng.range(-1.5, 1.5);
    const x = 64 + Math.cos(a) * r, y = 64 + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  blob(ctx, 64, 64, 9, 0.6, 0.2);
  return tex(c);
}

/** Drywall penetration: dark jagged hole + broken chalk rim. */
export function gypsumTex() {
  const c = canvas(128), ctx = c.getContext('2d');
  blob(ctx, 64, 64, 54, 0.42, 0.2); // gypsum dust haze
  ctx.fillStyle = 'rgba(238,238,230,0.9)';
  jaggedHole(ctx, 64, 64, 26, 14, 0.7);
  ctx.fill();
  ctx.fillStyle = 'rgba(16,14,12,0.96)';
  jaggedHole(ctx, 64, 64, 14, 11, 0.6);
  ctx.fill();
  return tex(c);
}

/** Wood splinter hole: elongated dark gash + shaved edges. */
export function woodHoleTex() {
  const c = canvas(128), ctx = c.getContext('2d');
  ctx.strokeStyle = 'rgba(190,150,95,0.9)';
  for (let i = 0; i < 7; i++) {
    const a = rng.range(0, Math.PI * 2);
    ctx.lineWidth = rng.range(2, 4.5);
    ctx.beginPath();
    ctx.moveTo(64 + Math.cos(a) * 10, 64 + Math.sin(a) * 10);
    ctx.lineTo(64 + Math.cos(a) * rng.range(24, 40), 64 + Math.sin(a) * rng.range(24, 40));
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(20,12,6,0.95)';
  jaggedHole(ctx, 64, 64, 12, 9, 0.8);
  ctx.fill();
  return tex(c);
}

/** Plastic sheeting tear: tiny jagged slit. */
export function tearTex() {
  const c = canvas(64), ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(245,245,245,0.75)';
  jaggedHole(ctx, 32, 32, 15, 8, 0.9);
  ctx.fill();
  ctx.globalCompositeOperation = 'destination-out';
  jaggedHole(ctx, 32, 32, 6, 6, 1);
  ctx.fill();
  return tex(c);
}

/** Blood splat variants — white silhouettes tinted per decal (H1/H5). */
export function bloodTex(variant) {
  const c = canvas(128), ctx = c.getContext('2d');
  const cx = 64 + rng.gauss() * 4, cy = 64 + rng.gauss() * 4;
  blob(ctx, cx, cy, variant === 3 ? 40 : 30, 1, 0.95);
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  jaggedHole(ctx, cx, cy, variant === 3 ? 26 : 18, 13, 0.55);
  ctx.fill();
  const satellites = variant === 2 ? 16 : variant === 3 ? 12 : 9;
  for (let i = 0; i < satellites; i++) {
    const a = rng.range(0, Math.PI * 2);
    const d = rng.range(28, 60) * (variant === 1 ? 1.15 : 1);
    blob(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, rng.range(2.5, 7), 0.95, 0.6);
  }
  if (variant === 1 || variant === 3) {
    // smear streak: directional drip tail
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineCap = 'round';
    const a = rng.range(0, Math.PI * 2);
    for (let s = 0; s < 3; s++) {
      const aa = a + rng.gauss() * 0.35;
      ctx.lineWidth = rng.range(3, 7);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(aa) * 16, cy + Math.sin(aa) * 16);
      ctx.lineTo(cx + Math.cos(aa) * rng.range(38, 58), cy + Math.sin(aa) * rng.range(38, 58));
      ctx.stroke();
    }
  }
  return tex(c);
}

/** Small pinhole marker for thin-panel pass-through (E3/drywall). */
export function pinholeTex() {
  const c = canvas(64), ctx = c.getContext('2d');
  blob(ctx, 32, 32, 20, 0.3, 0.12);
  ctx.fillStyle = 'rgba(12,10,9,0.9)';
  ctx.beginPath(); ctx.arc(32, 32, 5.5, 0, Math.PI * 2); ctx.fill();
  return tex(c);
}
