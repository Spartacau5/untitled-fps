"""Import authored FPS reports and recorded footfalls, preserving source envelopes.
Usage: python scripts/prepare-game-audio.py /path/to/q009 /path/to/footsteps
Requires FFmpeg and NumPy. Credits and licenses live in public/audio/credits.html.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "games/onslaught/public/audio"
GUNS, STEPS = map(Path, sys.argv[1:3])
RATE = 32000
sha = lambda b: hashlib.sha256(b).hexdigest()
prior = json.loads((OUT / "manifest.json").read_text())
# Keep only existing project-authored hit confirmations. Every gun and handling
# source, plus footsteps, now comes from the replacement bank below.
assets = [a for a in prior["assets"] if a["key"] in ["hit", "hit-head", "kill", "kill-head"]]
sources = {a["source"]: prior["sources"][a["source"]] for a in assets}
sources["authored"].update(
    url="https://github.com/Spartacau5/untitled-fps/blob/eb596c99c7b14b9a527b818d7737e845ae3dc5bb/scripts/prepare-modern-combat-audio.py",
    license="https://creativecommons.org/publicdomain/zero/1.0/")
sources["q009"] = dict(author="Q009", url="https://opengameart.org/content/q009s-weapon-sounds",
    download="https://opengameart.org/sites/default/files/q009-sounds.zip",
    license="https://creativecommons.org/licenses/by-sa/3.0/",
    licenseEvidence="https://opengameart.org/content/q009s-weapon-sounds")
for material, author, original in [("boots", "swuing", "https://freesound.org/people/swuing/sounds/38873/"),
                                   ("wood", "swuing", "https://freesound.org/people/swuing/sounds/38876/"),
                                   ("metal", "Eelke", "https://freesound.org/people/Eelke/sounds/462598/")]:
    sources[material] = dict(author=author, editor="congusbongus", original=original,
        url="https://opengameart.org/content/footsteps-on-different-surfaces",
        download="https://opengameart.org/sites/default/files/footsteps_0.zip",
        license="https://creativecommons.org/licenses/by/3.0/",
        licenseEvidence=(STEPS / material / "license.txt").read_text())


def convert(key, path, source, channels=2, start=0, duration=None):
    args = ["ffmpeg", "-v", "error", "-i", str(path)]
    if start: args += ["-ss", str(start)]
    if duration: args += ["-t", str(duration)]
    raw = subprocess.check_output(args + ["-ar", str(RATE), "-ac", str(channels), "-f", "f32le", "-"], timeout=30)
    x = np.frombuffer(raw, "<f4").reshape(-1, channels).copy()
    # Remove only leading digital silence. No exponential gating, EQ thump,
    # pitch shift, or replacement tail: retain the sound designer's mix.
    level = np.max(np.abs(x), axis=1)
    onset = np.flatnonzero(level > max(0.0001, level.max() * 0.002))
    trim = max(0, int(onset[0]) - 8) if len(onset) else 0
    x = x[trim:]
    x[:8] *= np.linspace(0, 1, min(8, len(x)))[:, None]
    fade = min(len(x), int(RATE * (0.012 if duration else 0.004)))
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    peak = max(0.0001, float(np.max(np.abs(x))))
    # Preserve quieter takes; only attenuate files above -3 dBFS.
    x *= min(1, 0.7 / peak)
    pcm = np.rint(x * 32767).astype("<i2")
    path_out = OUT / f"{key}.wav"
    with wave.open(str(path_out), "wb") as f:
        f.setnchannels(channels); f.setsampwidth(2); f.setframerate(RATE); f.writeframes(pcm.tobytes())
    data = path_out.read_bytes()
    assets.append(dict(key=key, path=path_out.name, source=source, member=str(path.relative_to(GUNS if source == "q009" else STEPS)),
        sourceSha256=sha(path.read_bytes()), sha256=sha(data), bytes=len(data), channels=channels,
        duration=len(pcm) / RATE, start=start + trim / RATE,
        processing="32k PCM; leading silence removal; safety fade; peak attenuation only" + ("; isolated mechanism slice" if duration else "")))


for family in ["pistol", "minigun", "rifle", "shotgun", "rlauncher"]:
    for suffix, variant in [("", "a"), ("2", "b"), ("3", "c")]:
        convert(f"game-{family}-{variant}", GUNS / f"{family}{suffix}.ogg", "q009")
convert("game-dry", GUNS / "outofammo.ogg", "q009")
convert("game-switch", GUNS / "weapswitch.ogg", "q009")
# Generic handling uses isolated game foley, rather than historical recordings.
convert("game-mag-out", GUNS / "weapswitch.ogg", "q009", start=0, duration=0.14)
convert("game-mag-in", GUNS / "weapswitch.ogg", "q009", start=0.12, duration=0.18)
convert("game-bolt", GUNS / "outofammo.ogg", "q009")
for material, count in [("boots", 8), ("wood", 4), ("metal", 4)]:
    for i in range(count): convert(f"step-{material}-{i}", STEPS / material / f"{i}.ogg", material, channels=1)
(OUT / "manifest.json").write_text(json.dumps(dict(version="designed-fps-3", collection="Authored FPS + recorded footfalls",
    license="Per source; see credits.html", sources=sources, assets=assets), indent=2) + "\n")
(OUT / "Q009-LICENSE.txt").write_text((GUNS / "license.txt").read_text())
print(f"{len(assets)} assets; {sum(a['bytes'] for a in assets):,} bytes")
