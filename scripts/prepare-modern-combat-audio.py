"""Offline report mastering. Requires numpy, scipy, FFmpeg and extracted CC0 sources.

python scripts/prepare-modern-combat-audio.py /path/to/Prepared-SFX-Library
Source archive and attribution: games/onslaught/public/audio/README.md.
No processing or downloads from this script run in the browser.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt

RATE = 32000
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "games/onslaught/public/audio"
CACHE = Path(sys.argv[1])
SOURCE_URL = "https://opengameart.org/sites/default/files/Prepared%20SFX%20Library.7z"
PAGE = "https://opengameart.org/content/the-free-firearm-sound-library"
old_manifest = json.loads((OUT / "manifest.json").read_text())
sources = {}
assets = []


def digest(data):
    return hashlib.sha256(data).hexdigest()


def filtered(x, cutoff, kind):
    return sosfilt(butter(2, cutoff, btype=kind, fs=RATE, output="sos"), x)


def save(key, x, source, **metadata):
    x = np.nan_to_num(x)
    x -= x.mean()
    x *= np.minimum(1, np.arange(len(x)) / 6)  # 0.19 ms, keeps the crack.
    fade = min(len(x), int(RATE * 0.022))
    x[-fade:] *= np.linspace(1, 0, fade) ** 2
    peak = max(1e-6, float(np.max(np.abs(x))))
    pcm = np.rint(x / peak * 22200).astype("<i2")  # -3.38 dBFS headroom.
    pcm[-1] = 0
    path = OUT / f"{key}.wav"
    with wave.open(str(path), "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(pcm.tobytes())
    data = path.read_bytes()
    assets.append(dict(key=key, path=path.name, source=source, bytes=len(data),
                       duration=len(pcm) / RATE, sha256=digest(data), **metadata))


# Two separate discharges from each near-perspective recording. LMG uses AK
# source character; the launcher is original sound design, not a recorded RPG.
specs = [
    ("pistol", "1911/A_42P.wav", [0.945, 5.005], 0.26, 0.12, 21),
    ("smg", "Carl Gustav M45/G_31P.wav", [0.31, 3.5], 0.17, 0.06, 29),
    ("rifle", "AR-15/D_32P.wav", [0.705, 5.65], 0.22, 0.17, 23),
    ("lmg", "AK-47/C_28P.wav", [0.615, 3.26], 0.26, 0.24, 19),
    ("marksman", "Savage 10 .300 Blackout/T_27P.wav", [0.955, 4.97], 0.36, 0.22, 17),
    ("sniper", "Tikka/W_29P.wav", [0.585, 5.67], 0.58, 0.26, 14),
    ("shotgun", "Mossberg/N_30P.wav", [1.7, 4.96], 0.42, 0.27, 16),
]
for family, member, peaks, duration, body, decay in specs:
    path = CACHE / member
    sources[family] = dict(url=SOURCE_URL, member=member, sha256=digest(path.read_bytes()),
                           licenseEvidence=PAGE)
    raw = np.frombuffer(subprocess.check_output([
        "ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(RATE),
        "-f", "f32le", "-"], timeout=30), dtype="<f4").astype(float)
    for variant, approx in zip(["a", "b"], peaks):
        # Search only this known discharge, then remove source leading silence.
        lo, hi = int((approx - 0.06) * RATE), int((approx + 0.06) * RATE)
        window = np.abs(raw[lo:hi])
        onset = lo + np.flatnonzero(window > window.max() * 0.075)[0] - 6
        x = raw[onset:onset + int(duration * RATE)].copy()
        x = filtered(filtered(x, 65, "highpass"), 13500, "lowpass")
        # Recorded low body + dry crack, mastered together offline so every
        # trigger still uses one bounded playback voice and one sample start.
        low = filtered(x, 260, "lowpass")
        low /= max(1e-6, np.max(np.abs(low)))
        x /= max(1e-6, np.max(np.abs(x)))
        t = np.arange(len(x)) / RATE
        x = x + low * body * np.exp(-t * 25)
        x *= np.exp(-np.maximum(t - 0.04, 0) * decay)
        save(f"{family}-{variant}", x, family, start=float(onset / RATE),
             processing=f"65Hz HP, 13.5kHz LP; recorded body {body}; tail decay {decay}/s")

# Preserve provenance of the four handling sources already shipped; remaster
# from their committed first-generation bytes, so rebuilding is idempotent.
for key, length in [("mag-out", 0.14), ("mag-in", 0.12), ("bolt", 0.24), ("click", 0.075)]:
    previous = next(a for a in old_manifest["assets"] if a["key"] == key)
    src = old_manifest["sources"][previous["source"]]
    base = subprocess.check_output(["git", "show", f"8b584b4:games/onslaught/public/audio/{key}.wav"], cwd=ROOT)
    raw = np.frombuffer(base[44:], dtype="<i2").astype(float) / 32768
    start = max(0, int(np.argmax(np.abs(raw))) - int(RATE * 0.008))
    x = np.pad(raw[start:start + int(RATE * length)], (0, int(RATE * length)))[:int(RATE * length)]
    x = filtered(filtered(x, 350, "highpass"), 9000, "lowpass")
    x *= np.exp(-np.arange(len(x)) / RATE * 12)
    sources[f"handling-{key}"] = dict(src, intermediateCommit="8b584b4", intermediateSha256=digest(base))
    save(key, x, f"handling-{key}", processing="tight transient trim; 350Hz HP; 9kHz LP; exponential tail")

# Original short confirmation ticks: filtered noise/metallic partials, no
# downward UI chirp. These are intentionally clearer than world impacts.
sources["authored"] = dict(url="scripts/prepare-modern-combat-audio.py", author="Project-authored DSP",
                            licenseEvidence="Original project asset, CC0")
rng = np.random.default_rng(917)
for key, duration, pitch, weight in [("hit", 0.035, 2350, 0.15), ("hit-head", 0.048, 3300, 0.2),
                                     ("kill", 0.105, 1700, 0.3), ("kill-head", 0.125, 2650, 0.35)]:
    t = np.arange(int(RATE * duration)) / RATE
    noise = filtered(rng.normal(size=len(t)), [1200, 6800], "bandpass")
    x = noise * np.exp(-t * 140) + weight * np.sin(2 * np.pi * pitch * t) * np.exp(-t * 110)
    if key.startswith("kill"):
        x += filtered(rng.normal(size=len(t)), [180, 1300], "bandpass") * 0.8 * np.exp(-t * 45)
    save(key, x, "authored", processing="seeded filtered impact noise, damped fixed-frequency metallic partial")
t = np.arange(int(RATE * 0.46)) / RATE
noise = rng.normal(size=len(t))
x = filtered(noise, [65, 850], "bandpass") * np.exp(-t * 12)
x += filtered(noise, [1200, 6500], "bandpass") * 0.14 * np.exp(-t * 60)
save("launcher", x, "authored", processing="original filtered launch pressure and gas discharge")

(OUT / "manifest.json").write_text(json.dumps(dict(
    collection="Modern combat mix: Free Firearm Sound Library + remastered handling + original feedback",
    sourcePage=PAGE, license="https://creativecommons.org/publicdomain/zero/1.0/",
    licenseEvidence=PAGE, sources=sources, assets=assets,
), indent=2) + "\n")
print(f"{len(assets)} clips / {sum(a['bytes'] for a in assets):,} bytes")
