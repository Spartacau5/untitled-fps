// Global mutable game state — the only shared write surface between systems.
// Writers are marked in CONTRACT.md; everyone else reads.
import { Vector3 } from 'three';

export const state = {
  phase: 'menu',            // menu|playing|paused|tally|dead  (killcam is momentary flag)
  godmode: false,
  hp: 100, maxHp: 100,
  noDamageFor: 0,           // seconds since last damage (D6 regen)
  score: 0, kills: 0, deaths: 0,
  wave: 0,                  // current wave number (0 pre-first)
  waveActive: false,
  combo: { count: 0, lastKillAt: -99, best: 0 },
  overdrive: { active: false, timeLeft: 0, cooldownLeft: 0 },
  accuracy: { fired: 0, hit: 0, headshots: 0 },
  firing: false, lastShotAt: -99,
  enemyAlive: 0,
  killcam: false,
  move: {                   // written by controller only
    pos: new Vector3(), vel: new Vector3(),
    yaw: 0, pitch: 0,
    sprint: false, tacsprint: false, slide: false, crouch: false,
    airborne: false, mantle: false, onGround: true,
    speed01: 0,             // normalized ground speed for bob/spread
    fallSpeed: 0, lean: 0,  // -1..1 Q/E
    camY: 1.7,
  },
  ads: { blend: 0, hold: false },   // written by weapon only (A6)
  reload: { active: false, t: 0, total: 2, phase: -1, tactical: false },
  mag: 30, magSize: 30,               // F1 infinite reserve
  reset(newMatch) {
    this.phase = 'playing'; this.hp = this.maxHp; this.noDamageFor = 99;
    this.score = 0; this.kills = 0; this.wave = 0; this.waveActive = false;
    this.combo = { count: 0, lastKillAt: -99, best: 0 };
    this.overdrive = { active: false, timeLeft: 0, cooldownLeft: 0 };
    this.accuracy = { fired: 0, hit: 0, headshots: 0 };
    this.firing = false; this.enemyAlive = 0; this.killcam = false;
    this.mag = this.magSize;
    this.reload = { active: false, t: 0, total: 2, phase: -1, tactical: false };
    this.ads = { blend: 0, hold: false };
    if (newMatch) { this.deaths = 0; }
  },
};
