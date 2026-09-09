import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { RECORDED_SFX, COMBAT_PROFILES, FOOTSTEP_KEYS, AUDIO_MIX_VERSION } from "../games/onslaught/src/audio/combat-samples.js";

const root = new URL("../games/onslaught/public/", import.meta.url);
test("audio assets retain provenance, stereo reports and bounded PCM without shipping obsolete banks", () => {
  const manifest = JSON.parse(readFileSync(new URL("audio/manifest.json", root)));
  let bytes = 0, decoded = 0;
  assert.equal(manifest.version, AUDIO_MIX_VERSION);
  assert.equal(manifest.sources.q009.license, "https://creativecommons.org/licenses/by-sa/3.0/");
  assert.equal(manifest.assets.length, Object.keys(RECORDED_SFX).length);
  assert.deepEqual(readdirSync(new URL("audio/", root)).filter(f => f.endsWith(".wav")).sort(),
    manifest.assets.map(a => a.path).sort());
  for (const [key, url] of Object.entries(RECORDED_SFX)) {
    const data = readFileSync(new URL(url.slice(1), root));
    const asset = manifest.assets.find(a => a.key === key);
    assert.equal(createHash("sha256").update(data).digest("hex"), asset.sha256);
    assert.equal(data.length, asset.bytes);
    const source = manifest.sources[asset.source];
    assert.ok(source?.url && source.license && source.licenseEvidence);
    assert.equal(data.subarray(0, 4).toString(), "RIFF");
    assert.equal(data.subarray(8, 12).toString(), "WAVE");
    assert.equal(data.readUInt16LE(20), 1);
    assert.equal(data.readUInt16LE(34), 16);
    const channels = data.readUInt16LE(22);
    assert.equal(channels, key.startsWith("game-") ? 2 : 1);
    assert.equal(data.readUInt32LE(24), 32000);
    assert.equal(data.readUInt32LE(40), data.length - 44);
    assert.ok(data.length <= 512 * 1024);
    const duration = (data.length - 44) / (32000 * channels * 2);
    assert.ok(duration > 0 && duration <= 3);
    let peak = 0;
    for (let i = 44; i < data.length; i += 2) peak = Math.max(peak, Math.abs(data.readInt16LE(i)));
    assert.ok(peak > 100 && peak < 26000, key + ": signal with peak headroom");
    for (let channel = 0; channel < channels; channel++)
      assert.ok(Math.abs(data.readInt16LE(data.length - 2 * (channel + 1))) < 100, key + ": faded tail");
    bytes += data.length;
    decoded += duration * 48000 * channels * 4;
  }
  assert.ok(bytes < 4 * 1024 * 1024, "download budget");
  assert.ok(decoded < 10 * 1024 * 1024, "decoded budget at 48 kHz");
  const hash = key => manifest.assets.find(a => a.key === key).sha256;
  for (const family of ["pistol", "minigun", "rifle", "shotgun", "rlauncher"])
    assert.equal(new Set(["a", "b", "c"].map(take => hash("game-" + family + "-" + take))).size, 3);
  for (const keys of Object.values(FOOTSTEP_KEYS)) assert.ok(new Set(keys.map(hash)).size >= 4);
  for (const key of ["pistol", "smg", "shotgun", "m4", "dmr", "lmg", "sniper", "rocket"])
    for (const clip of COMBAT_PROFILES[key].keys) assert.ok(RECORDED_SFX[clip]);
});
