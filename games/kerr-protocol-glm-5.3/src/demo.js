// DEMO REEL — added by the operator (Alexey's harness), not by the model.
// Loads only with ?demo in the URL, drives the finished renderer through the
// existing window.__* automation hooks, and touches none of the build's logic.
//
//   ?demo        full reel
//   ?demo=calm   same cuts, no glitch/strobe passages
//   ?demo=hard   glitches everywhere, shortest holds
//
// The pacing is deliberately the pacing of the self-test: hard cuts every few
// hundred milliseconds, parameter slams, and broken-looking frames in between.

const qs = new URLSearchParams(location.search);
const MODE = qs.get('demo') || '1';
const CALM = MODE === 'calm';
const HARD = MODE === 'hard';
const SPEED = HARD ? 0.72 : 1;

const cam = window.__cam;
const R = window.__R;
const setFeat = window.__setFeat;
const setParam = window.__setParam;
const deg = Math.PI / 180;

// Disk temperature is fixed at 14000 K inside the renderer; re-set the uniform
// after the shared block so the reel can swing colour without touching it.
const origSetCommon = R.setCommon.bind(R);
R.setCommon = (p, s, extra) => {
  origSetCommon(p, s, extra);
  if (s.demoTmax) p.f1('uDiskTmax', s.demoTmax);
};

// ---------------------------------------------------------------- chrome
document.getElementById('hud').style.display = 'none';
document.documentElement.style.background = '#000';

const style = document.createElement('style');
style.textContent = `
  #demo-tag {
    position: fixed; left: 22px; bottom: 20px; z-index: 40;
    font: 500 11px/1.6 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .18em; text-transform: uppercase; color: #cfd6e4;
    text-shadow: 0 0 14px rgba(0,0,0,.9); opacity: 0; pointer-events: none;
    white-space: pre;
  }
  #demo-tag.on { opacity: .92; }
  #demo-flash {
    position: fixed; inset: 0; z-index: 45; pointer-events: none;
    background: #dfe6ff; opacity: 0; mix-blend-mode: screen;
  }
  #demo-scan {
    position: fixed; inset: 0; z-index: 41; pointer-events: none; opacity: 0;
    background: repeating-linear-gradient(to bottom,
      rgba(0,0,0,.55) 0 1px, rgba(0,0,0,0) 1px 3px);
  }
  #demo-scan.on { opacity: .8; }
  canvas.gl-split { filter: drop-shadow(3px 0 0 rgba(255,40,40,.75)) drop-shadow(-3px 0 0 rgba(40,140,255,.75)); }
  canvas.gl-hot   { filter: contrast(1.7) saturate(1.5) hue-rotate(-14deg); }
  canvas.gl-cold  { filter: hue-rotate(160deg) saturate(1.35); }
  canvas.gl-invert{ filter: invert(1) hue-rotate(180deg); }
  canvas.gl-shake { animation: dshake 90ms steps(2) infinite; }
  @keyframes dshake {
    0% { transform: translate(0,0); } 50% { transform: translate(-3px,2px); } 100% { transform: translate(2px,-1px); }
  }
`;
document.head.appendChild(style);

const tag = document.createElement('div'); tag.id = 'demo-tag';
const flash = document.createElement('div'); flash.id = 'demo-flash';
const scan = document.createElement('div'); scan.id = 'demo-scan';
document.body.append(tag, flash, scan);
const canvas = document.getElementById('gl');

const say = (text, ms = 700) => {
  tag.textContent = text;
  tag.classList.add('on');
  clearTimeout(say._t);
  say._t = setTimeout(() => tag.classList.remove('on'), ms);
};
const fx = (cls, ms) => {
  if (CALM) return;
  canvas.classList.add(cls);
  setTimeout(() => canvas.classList.remove(cls), ms);
};
const blink = (ms = 90) => {
  if (CALM) return;
  flash.style.opacity = '.55';
  setTimeout(() => { flash.style.opacity = '0'; }, ms);
};

// ---------------------------------------------------------------- driving
const st = window.__demoState || (window.__demoState = {});
const pose = (r, inc, az, fov, { hold = true } = {}) => {
  cam.orbit = null; cam.orbitFn = null;
  cam.sr.x = r; cam.sr.v = 0; cam.tr = r;
  cam.st.x = inc * deg; cam.st.v = 0; cam.tt = inc * deg;
  cam.sp.x = az * deg; cam.sp.v = 0; cam.tp = az * deg;
  cam.sf.x = fov; cam.sf.v = 0; cam.tf = fov;
  if (hold) R.resetHistory();      // skipping the reset leaves a deliberate smear
};
const drift = (r, inc, az, fov) => { cam.tr = r; cam.tt = inc * deg; cam.tp = az * deg; cam.tf = fov; };
const look = (k, v) => setFeat(k, v);
const temp = (K) => setFeat('demoTmax', K);
const spin = (a) => { setParam('spin', a); R.resetHistory(); };

const reset = () => {
  ['gl-split', 'gl-hot', 'gl-cold', 'gl-invert', 'gl-shake'].forEach((c) => canvas.classList.remove(c));
  scan.classList.remove('on');
  look('testGradientSky', 0); look('testStarOn', 0); look('debugDir', 0);
  look('bloomOn', true); look('streakOn', true); look('caOn', true); look('vignetteOn', true);
  look('starsOn', true); look('nebulaOn', true); look('diskOn', true); look('jetOn', true);
  look('grain', 1); look('expMul', 1); look('nebulaBright', 1); look('diskBright', 1);
  temp(14000);
};

// ------------------------------------------------------------------ reel
// Each beat: [milliseconds, function]. Times are the whole point — this is a
// cut reel, not a slideshow.
const P = [
  [26, 82, -40, 54], [21, 88, 12, 52], [9.2, 84, -24, 44], [34, 30, 120, 52],
  [44, 58, 6, 54], [25, 22, -120, 55], [15.5, 88, -70, 48], [30, 78, 200, 56],
  [12, 86, 96, 46], [19, 62, -150, 50], [7.8, 82, 40, 40], [28, 44, 165, 52],
];
// `lap` shifts which pose each beat lands on, so a second pass through the reel
// is not the same footage twice.
let lap = 0;
const shot = (i, extra) => { const p = P[(i + lap * 5) % P.length]; pose(p[0], p[1], p[2], p[3]); if (extra) extra(); };

const REEL = [
  // --- cold open: single frames out of the dark -------------------------
  [420, () => { reset(); look('diskOn', false); look('jetOn', false); look('nebulaOn', false); pose(30, 84, -40, 52); say('KERR  ·  a = 0.900', 900); }],
  [220, () => { look('diskOn', true); blink(60); }],
  [180, () => shot(1)],
  [160, () => { shot(2); fx('gl-split', 160); }],
  [520, () => { shot(0); say('NULL GEODESICS  ·  RK4  ·  400 STEPS', 800); }],

  // --- rapid cuts -------------------------------------------------------
  [300, () => shot(3)], [260, () => shot(4)], [240, () => shot(5)],
  [200, () => { shot(6); temp(21000); }],
  [200, () => { shot(7); temp(9000); }],
  [170, () => { shot(8); temp(26000); fx('gl-hot', 170); }],
  [170, () => { shot(9); temp(6200); }],
  [420, () => { shot(10); temp(14000); say('DISK  4 200 K → 26 000 K', 700); }],
  [140, () => shot(11)], [140, () => shot(2)], [140, () => shot(5)],
  [140, () => { shot(8); blink(50); }],

  // --- glitch burst -----------------------------------------------------
  [110, () => { look('testGradientSky', 1); pose(25, 90, 10, 26); say('LENSING TEST FRAME', 500); }],
  [90,  () => { look('testStarOn', 1); look('testStarDir', [0, 0, -1]); fx('gl-split', 200); }],
  [90,  () => { look('bloomOn', false); look('streakOn', false); scan.classList.add('on'); }],
  [110, () => { look('testGradientSky', 0); look('testStarOn', 0); look('debugDir', 1); }],
  [90,  () => { fx('gl-invert', 120); blink(70); }],
  [130, () => { reset(); shot(6); fx('gl-shake', 400); }],
  [300, () => { shot(0); say('SHADOW  b = 5.196 M', 620); }],

  // --- spin slam: the shadow deforms in hard steps -----------------------
  [260, () => { pose(15.5, 88, -70, 46); spin(0.0); say('SPIN  a = 0.000', 500); }],
  [200, () => { spin(0.25); say('SPIN  a = 0.250', 480); }],
  [200, () => { spin(0.5); say('SPIN  a = 0.500', 480); fx('gl-split', 120); }],
  [200, () => { spin(0.75); say('SPIN  a = 0.750', 480); }],
  [200, () => { spin(0.9); say('SPIN  a = 0.900', 480); }],
  [700, () => { spin(0.999); say('SPIN  a = 0.999  ·  ISCO 1.18 M', 900); blink(80); }],

  // --- breath: one clean frame, let it converge --------------------------
  [1500, () => { reset(); spin(0.9); pose(23.5, 81, -20, 56); say('', 1); }],
  [1400, () => drift(21.5, 79, 26, 55)],

  // --- inclination whip --------------------------------------------------
  [180, () => pose(25, 20, -120, 55)], [180, () => pose(25, 38, -110, 55)],
  [180, () => pose(25, 56, -100, 55)], [180, () => pose(25, 74, -92, 55)],
  [180, () => pose(25, 86, -84, 55)],
  [520, () => { pose(25, 89.4, -78, 55); say('INCLINATION  20° → 89°', 700); }],

  // --- jet + hard glitches ----------------------------------------------
  [420, () => { shot(4); look('jetOn', true); setFeat('jetMul', 16); say('JET  ·  SYNCHROTRON', 620); }],
  [130, () => { fx('gl-cold', 260); shot(3); }],
  [110, () => { look('nebulaOn', false); look('starsOn', false); blink(60); }],
  [110, () => { look('starsOn', true); scan.classList.add('on'); fx('gl-split', 220); }],
  [110, () => { look('diskOn', false); say('DISK OFF', 300); }],
  [110, () => { look('diskOn', true); look('nebulaOn', true); scan.classList.remove('on'); }],
  [160, () => { shot(9); fx('gl-shake', 320); }],
  [160, () => { shot(1); fx('gl-hot', 200); }],

  // --- fall ---------------------------------------------------------------
  [260, () => { reset(); pose(33, 84, 150, 58); say('INFALL', 600); }],
  [220, () => pose(26, 84, 162, 58)],
  [200, () => pose(20, 83, 176, 57)],
  [180, () => pose(15, 83, 188, 55)],
  [170, () => pose(11, 82, 198, 53)],
  [160, () => { pose(8.4, 82, 208, 50); setFeat('expMul', 0.7); }],
  [150, () => { pose(6.2, 81, 218, 46); setFeat('expMul', 0.5); fx('gl-split', 200); }],
  [900, () => { pose(4.4, 80, 228, 42); setFeat('expMul', 0.36); blink(120); say('PHOTON SPHERE', 800); }],
  [1600, () => { reset(); pose(26, 80, -60, 57); say('KERR PROTOCOL  ·  RAW WEBGL2  ·  WRITTEN BY GLM-5.3', 1500); }],
];

// ---------------------------------------------------------------- playback
let idx = -1, next = 0;
const step = (now) => {
  if (now >= next) {
    idx = idx + 1;
    if (idx >= REEL.length) { idx = 0; lap++; }
    const [ms, fn] = REEL[idx];
    try { fn(); } catch (e) { console.warn('demo beat failed', e); }
    next = now + ms * SPEED;
  }
  requestAnimationFrame(step);
};
reset();
requestAnimationFrame((t) => { next = t; step(t); });

// let a viewer bail out into free flight
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'h') document.getElementById('hud').style.display = '';
});
console.log(`demo reel: ${REEL.length} beats, mode "${MODE}" — press H for the HUD`);
