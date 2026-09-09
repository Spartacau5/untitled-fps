import assert from "node:assert/strict";
import { test } from "node:test";
import { RecordedBank } from "../games/onslaught/src/audio/recorded-bank.js";
import { Audio } from "../games/onslaught/src/audio/audio.js";
import { footstepSurface } from "../games/onslaught/src/audio/footstep-surfaces.js";
import { MIDTOWN } from "../games/onslaught/src/data/midtown.js";

function context() {
  const nodes = [];
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, cancelScheduledValues() {} });
  const node = (kind) => {
    const n = { kind, gain: param(), frequency: param(), Q: param(), pan: param(),
      playbackRate: param(), connect() {}, disconnect() { this.disconnected = true; },
      start(time) { this.started = time; }, stop(time) { this.stopped = time ?? 0; } };
    nodes.push(n); return n;
  };
  return { nodes, currentTime: 10, state: "running",
    createBufferSource: () => node("source"), createGain: () => node("gain"),
    createBiquadFilter: () => node("filter"), createStereoPanner: () => node("pan"),
    decodeAudioData: async () => ({ duration: 0.3, numberOfChannels: 1 }),
  };
}
function bank(capacity = 24) {
  const ctx = context(), b = new RecordedBank(ctx, {}, {}, { capacity, random: () => 0 });
  for (const key of ["a", "b"]) b.buffers.set(key, { duration: 0.3, key });
  return { ctx, b };
}
test("failed samples preserve good clips, loading is reused and concurrency bounded", async () => {
  const { b, ctx } = bank(); b.buffers.clear();
  let active = 0, max = 0, calls = 0;
  const fetcher = async (url) => {
    calls++; active++; max = Math.max(max, active);
    await new Promise((resolve) => setImmediate(resolve)); active--;
    return { ok: url !== "missing", status: 404, arrayBuffer: async () => new ArrayBuffer(10) };
  };
  const promise = b.load({ a: "ok", b: "missing", c: "ok" }, fetcher);
  assert.equal(b.load({}, fetcher), promise);
  const result = await promise;
  assert.equal(calls, 3); assert.ok(max <= 2);
  assert.equal(result.filter((x) => x.loaded).length, 2);
  assert.equal(b.play(["b"]), false);
  assert.equal(b.play(["a"]), true);
  assert.equal(ctx.nodes.filter((n) => n.kind === "source").length, 1);
});
test("voice budget protects player reports, culls quiet sounds and disconnects nodes", () => {
  const { b, ctx } = bank(2);
  b.play(["a"], { priority: 3 });
  b.play(["a"], { priority: 1 });
  b.play(["a"], { priority: 0 });
  assert.equal(ctx.nodes.filter((n) => n.kind === "source").length, 2);
  b.play(["b"], { priority: 3 });
  const sources = ctx.nodes.filter((n) => n.kind === "source");
  assert.equal(b.voices.size, 2);
  assert.equal(b.retiring.size, 1);
  assert.equal(sources[1].stopped, 10.014);
  assert.equal(sources[1].disconnected, undefined);
  sources[1].onended();
  assert.equal(sources[1].disconnected, true);
  assert.equal(b.retiring.size, 0);
  assert.equal(sources[0].disconnected, undefined);
  assert.equal(b.play(["a"], { gain: 0.001 }), true);
  assert.equal(ctx.nodes.filter((n) => n.kind === "source").length, 3);
  sources[0].onended(); assert.equal(b.voices.size, 1);
  b.stop(); b.stop();
  assert.equal(b.voices.size, 0);
  assert.ok(ctx.nodes.every((n) => n.disconnected));
});
test("variants alternate, filters spatialize recordings, delayed foley stops with session", () => {
  const { b, ctx } = bank();
  b.play(["a", "b"]); b.play(["a", "b"]);
  assert.deepEqual(ctx.nodes.filter((n) => n.kind === "source").map((n) => n.buffer.key), ["a", "b"]);
  b.play(["a"], { pan: -0.6, lowpass: 900, delay: 1.9 });
  assert.equal(ctx.nodes.at(-3).frequency.value, 900);
  assert.equal(ctx.nodes.at(-2).pan.value, -0.6);
  assert.equal(ctx.nodes.at(-5).started, 11.9);
  const audio = new Audio(); audio.samples = b;
  audio.endSession(); assert.equal(b.voices.size, 0);
});
test("combat routes recordings with individual fallback and preserves legacy sounds", () => {
  const audio = new Audio(); audio.ctx = { currentTime: 0 }; audio.ready = true; audio.groundedCombat = true;
  const calls = []; let procedural = 0;
  audio.noise = audio.tone = audio.rifleReport = () => procedural++;
  audio.samples = { play(keys, options) { calls.push({ keys, options }); return !keys.includes("game-pistol-a"); } };
  audio.gunshot("m4"); assert.equal(procedural, 0);
  assert.ok(calls.at(-1).options.send < 0.03, "player report stays dry");
  audio.gunshot("pistol"); assert.equal(procedural, 1);
  audio.robotShot([0, 0, -6], true);
  assert.equal(calls.at(-1).options.lowpass, 900);
  assert.equal(calls.at(-1).options.priority, 1);
  assert.ok(calls.at(-1).options.gain < 0.1, "occluded bot does not mask the player");
  for (const method of ["magOut", "magIn", "bolt", "pump", "shellIn", "dryFire", "weaponSwitch"]) audio[method]();
  assert.equal(procedural, 1);
  audio.hitmarker(); assert.deepEqual(calls.at(-1).keys, ["hit"]);
  audio.kill(true); assert.deepEqual(calls.at(-1).keys, ["kill-head"]);
  assert.equal(calls.at(-1).options.priority, 4);
  audio.groundedCombat = false; audio.gunshot("m4"); assert.ok(procedural > 1);
});

test("sustained fire bounds overlapping tails and stop flushes fading sources", () => {
  const { b, ctx } = bank();
  for (let i = 0; i < 100; i++) {
    b.play(["a", "b"], { priority: 3, group: "player", groupLimit: 3 });
    assert.ok(b.voices.size <= 3);
    assert.ok(b.retiring.size <= 4);
  }
  const created = ctx.nodes.length;
  b.play(["a"], { priority: 1, group: "player", groupLimit: 3 });
  assert.equal(ctx.nodes.length, created, "lower priority cannot steal a report within its group");
  b.stop();
  assert.equal(b.voices.size + b.retiring.size, 0);
  assert.ok(ctx.nodes.every(n => n.disconnected));
});

test("loader accepts designed stereo reports and rejects oversized decoded audio", async () => {
  const { b, ctx } = bank(); b.buffers.clear();
  let count = 0;
  ctx.decodeAudioData = async () => ({ duration: ++count === 1 ? 2.7 : 3.1, numberOfChannels: 2 });
  const results = await b.load({ report: "/report", bad: "/bad" }, async () => ({
    ok: true, arrayBuffer: async () => new ArrayBuffer(10),
  }));
  assert.equal(results.filter(r => r.loaded).length, 1);
  assert.equal(b.buffers.get("report").numberOfChannels, 2);
  assert.equal(b.buffers.has("bad"), false);
});

test("recorded contacts vary sides, scale with speed, and route surface without synthesis", () => {
  const audio = new Audio(); audio.ready = true; audio.groundedCombat = true;
  audio.ctx = { currentTime: 0 };
  const calls = [];
  audio.samples = { play(keys, options) { calls.push({ keys, options }); return true; } };
  audio.noise = audio.tone = () => assert.fail("recordings must not layer procedural footfalls");
  audio.footstep(0.85, "boots"); audio.footstep(1.25, "boots");
  assert.ok(calls[1].options.gain > calls[0].options.gain);
  assert.equal(calls[1].options.pan, -calls[0].options.pan);
  assert.equal(calls[0].keys.length, 8);
  audio.land(1, "metal"); assert.ok(calls.at(-1).keys.every(k => k.startsWith("step-metal")));
  audio.robotFootstep([0, 0, -5], "wood");
  assert.ok(calls.at(-1).keys.every(k => k.startsWith("step-wood")));
  assert.equal(calls.at(-1).options.priority, 1);
  audio.jump();
});

test("metal footsteps follow rotated bus roofs without leaking to the street or stone decks", () => {
  const bus = MIDTOWN.solids.find(s => s.kind === "bus");
  assert.equal(footstepSurface({ x: bus.x, z: bus.z, y: 0 }), "boots");
  assert.equal(footstepSurface({ x: bus.x, z: bus.z, y: bus.h }), "metal");
  // Rotate a point near the end of the roof from local to world coordinates.
  assert.equal(footstepSurface({ x: bus.x + Math.sin(bus.yaw) * 4,
    z: bus.z + Math.cos(bus.yaw) * 4, y: bus.h }), "metal");
  assert.equal(footstepSurface({ x: bus.x + 5, z: bus.z, y: bus.h }), "boots");
  const deck = MIDTOWN.solids.find(s => s.kind === "platform");
  assert.equal(footstepSurface({ x: deck.x, z: deck.z, y: deck.h }), "boots");
});
