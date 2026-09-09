import assert from "node:assert/strict";
import { test } from "node:test";
import { Audio } from "../games/onslaught/src/audio/audio.js";
import { playWorldSound } from "../games/onslaught/src/audio/world-sound.js";

test("bot playback reuses main's gun layers with spatial gain without changing player audio", () => {
  const audio = new Audio(), calls = [];
  audio.ready = true;
  audio.ctx = { currentTime: 0 };
  audio.spatial = () => ({ gain: 0.5, pan: -0.6 });
  audio._voice = function (_t, _d, _source, options) {
    calls.push({ gain: options.gain * this.voiceGain, pan: options.pan ?? 0 });
  };
  audio.noise = audio.tone = function (time, options) {
    this._voice(time, 0, null, options);
  };
  audio.gunshot("m4");
  const player = calls.splice(0);
  assert.ok(player.length > 0);
  const original = audio._voice;
  playWorldSound(audio, { x: -5, y: 0, z: 0 }, "gunshot", ["m4"], 0.35);
  assert.equal(calls.length, player.length);
  calls.forEach((layer, i) => {
    assert.ok(Math.abs(layer.gain - player[i].gain * 0.175) < 1e-9);
    assert.equal(layer.pan, -0.6);
  });
  assert.equal(audio._voice, original);
  assert.equal(audio.voiceGain, 1);
  calls.length = 0;
  audio.gunshot("m4");
  assert.deepEqual(calls, player);
});

test("unready and distant bots are silent; other bot events call existing main sounds", () => {
  const audio = new Audio();
  let contacts = 0;
  audio.spatial = () => ({ gain: 0, pan: 0 });
  audio.footstep = () => contacts++;
  playWorldSound(audio, {}, "footstep");
  audio.ready = true;
  playWorldSound(audio, {}, "footstep");
  assert.equal(contacts, 0);
  audio.spatial = () => ({ gain: 0.5, pan: 0 });
  playWorldSound(audio, {}, "footstep");
  assert.equal(contacts, 1);
  for (const method of ["magOut", "land", "gunshot"]) assert.equal(typeof audio[method], "function");
});
