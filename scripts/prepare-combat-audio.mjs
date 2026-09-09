// Offline-only asset build. Requires curl + FFmpeg; never runs during game boot.
// Usage: node scripts/prepare-combat-audio.mjs /absolute/source-cache
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const cache = resolve(process.argv[2] || ".cache/combat-audio");
const out = new URL("../games/onslaught/public/audio/", import.meta.url);
mkdirSync(cache, { recursive: true });
mkdirSync(out, { recursive: true });
const names = {
  pistol: "PISTOL/GUNPis_Exterior pistol shots with no reverb_CS_USC.flac",
  marksman: "RIFLE/GUNRif_30 30 rifle shots_CS_USC.flac",
  shotgun: "SHOTGUN/GUNShotg_Shotgun_CS_USC.flac",
  launcher: "ARTILLERY/GUNArtl_Bazooka shot_CS_USC.flac",
  bolt: "MECHANISM/GUNMech_Cocking a rifle; indoors_CS_USC.flac",
  magazine: "MECHANISM/GUNMech_Loading a clip into a rifle_CS_USC.flac",
};
const clips = [
  ["pistol", "pistol", 0.01, 0.52],
  ["rifle-a", "marksman", 0.105, 0.32],
  ["rifle-b", "marksman", 3.18, 0.32],
  ["marksman-a", "marksman", 0.105, 1.3],
  ["marksman-b", "marksman", 6.325, 1.3],
  ["shotgun", "shotgun", 0.007, 1.1],
  ["launcher", "launcher", 0.008, 0.65],
  ["mag-out", "magazine", 4.568, 0.4],
  ["mag-in", "magazine", 5.654, 0.4],
  ["bolt", "bolt", 0.56, 0.68],
  ["click", "bolt", 1.105, 0.16],
];
const sha256 = (data) => createHash("sha256").update(data).digest("hex");
const sources = {};
for (const [key, name] of Object.entries(names)) {
  const url = "https://archive.org/download/SSE_Library_GUNS/" + name.split("/").map(encodeURIComponent).join("/");
  const path = resolve(cache, key + ".flac");
  if (!existsSync(path)) execFileSync("curl", ["-L", "--fail", "--max-time", "60", url, "-o", path]);
  sources[key] = { url, sha256: sha256(readFileSync(path)) };
}
const assets = [];
for (const [key, source, start, duration] of clips) {
  // Remove subsonics and hiss, keep the recording's transient, fade the cut tail.
  const filter = `highpass=f=65,lowpass=f=12000,afade=t=in:d=0.001,afade=t=out:st=${duration * 0.65}:d=${duration * 0.35}`;
  const raw = execFileSync("ffmpeg", ["-v", "error", "-ss", String(start), "-i", resolve(cache, source + ".flac"), "-t", String(duration), "-ac", "1", "-ar", "32000", "-af", filter, "-f", "s16le", "-"]);
  let peak = 1;
  for (let i = 0; i < raw.length; i += 2) peak = Math.max(peak, Math.abs(raw.readInt16LE(i)));
  const trim = 24575 / peak; // -2.5 dBFS peak, runtime weapon gains supply headroom.
  for (let i = 0; i < raw.length; i += 2) raw.writeInt16LE(Math.round(raw.readInt16LE(i) * trim), i);
  const header = Buffer.alloc(44);
  header.write("RIFF", 0); header.writeUInt32LE(raw.length + 36, 4); header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22);
  header.writeUInt32LE(32000, 24); header.writeUInt32LE(64000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34);
  header.write("data", 36); header.writeUInt32LE(raw.length, 40);
  const data = Buffer.concat([header, raw]);
  writeFileSync(new URL(key + ".wav", out), data);
  assets.push({ key, path: key + ".wav", source, start, duration, bytes: data.length, sha256: sha256(data), processing: filter + ",peak-normalize=-2.5dBFS" });
}
writeFileSync(new URL("manifest.json", out), JSON.stringify({
  collection: "USC Cinema / Sunset Editorial sound effects, preserved by Craig Smith, archived by Jason Scott",
  sourcePage: "https://archive.org/details/SSE_Library_GUNS",
  license: "https://creativecommons.org/publicdomain/zero/1.0/",
  licenseEvidence: "https://archive.org/metadata/SSE_Library_GUNS",
  sources, assets,
}, null, 2) + "\n");
console.log(`${assets.length} clips, ${assets.reduce((sum, a) => sum + a.bytes, 0)} bytes`);
