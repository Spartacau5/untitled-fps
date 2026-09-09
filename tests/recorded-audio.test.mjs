import assert from "node:assert/strict";
import { test } from "node:test";
import { RecordedBank } from "../games/onslaught/src/audio/recorded-bank.js";
import { Audio } from "../games/onslaught/src/audio/audio.js";

function context() {
  const nodes = [];
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {} });
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
  assert.equal(sources[1].disconnected, true);
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
  audio.samples = { play(keys, options) { calls.push({ keys, options }); return !keys.includes("pistol-a"); } };
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
