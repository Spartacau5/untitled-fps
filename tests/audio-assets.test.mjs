import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { RECORDED_SFX, COMBAT_PROFILES } from "../games/onslaught/src/audio/combat-samples.js";

const root = new URL("../games/onslaught/public/", import.meta.url);

test("combat profiles resolve to intact, bounded local PCM with provenance", () => {
  const manifest = JSON.parse(readFileSync(new URL("audio/manifest.json", root)));
  let bytes = 0;
  assert.equal(manifest.license, "https://creativecommons.org/publicdomain/zero/1.0/");
  assert.equal(manifest.assets.length, Object.keys(RECORDED_SFX).length);
  for (const [key, url] of Object.entries(RECORDED_SFX)) {
    const file = new URL(url.slice(1), root);
    const data = readFileSync(file);
    const asset = manifest.assets.find((a) => a.key === key);
    assert.equal(createHash("sha256").update(data).digest("hex"), asset.sha256);
    assert.ok(manifest.sources[asset.source]?.url.startsWith("https://archive.org/download/"));
    assert.equal(data.subarray(0, 4).toString(), "RIFF", `${key} RIFF header`);
    assert.equal(data.subarray(8, 12).toString(), "WAVE", `${key} WAVE header`);
    assert.equal(data.readUInt16LE(20), 1, `${key} PCM encoding`);
    assert.equal(data.readUInt16LE(34), 16, `${key} 16-bit sample`);
    assert.equal(data.readUInt16LE(22), 1);
    assert.equal(data.readUInt32LE(24), 32000);
    assert.equal(data.readUInt32LE(40), data.length - 44);
    let peak = 0;
    for (let i = 44; i < data.length; i += 2) peak = Math.max(peak, Math.abs(data.readInt16LE(i)));
    assert.ok(peak > 1000 && peak < 26000, `${key}: non-silent with mix headroom`);
    assert.ok(Math.abs(data.readInt16LE(data.length - 2)) < 100, "no hard cut at tail");
    bytes += data.length;
  }
  assert.ok(bytes < 500 * 1024, "total bank download budget");
  for (const key of ["pistol", "smg", "shotgun", "m4", "dmr", "lmg", "sniper", "rocket"])
    for (const clip of COMBAT_PROFILES[key].keys) assert.ok(RECORDED_SFX[clip]);
});
