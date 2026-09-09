# Recorded combat samples

Eleven processed clips from the [USC Cinema / Sunset Editorial gun sound archive](https://archive.org/details/SSE_Library_GUNS), preserved by Craig Smith and archived by Jason Scott. These are historic effects recordings, not newly recorded modern weapons. The archive's [item metadata](https://archive.org/metadata/SSE_Library_GUNS) explicitly declares [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) in `metadata.licenseurl` (checked 2026-09-09).

[manifest.json](manifest.json) records each original source URL and SHA-256, clip trim points, processing, output size and output SHA-256. Source descriptions identify pistol, .30-30 rifle, shotgun, bazooka, rifle cocking and clip loading.

| Shipped clips | In-game use |
| --- | --- |
| pistol | Pistol and lighter SMG mix |
| rifle-a, rifle-b | Short alternating assault-rifle/LMG/bot reports |
| marksman-a, marksman-b | Longer DMR/sniper reports |
| shotgun | Shotgun report |
| launcher | Launcher report; explosion remains synthesized |
| mag-out, mag-in | Magazine handling and weapon switch |
| bolt, click | Bolt/pump, shell insertion and dry fire |

The eight weapons have individual mix profiles, with some shared source recordings. Foley clips are edited and repurposed mechanical sounds; they are not recordings of each exact weapon action. Footsteps, ambience, impacts and kill feedback remain authored WebAudio.

Total WAV size: **458,084 bytes**. Mono, 32 kHz, 16-bit PCM; high-pass at 65 Hz, low-pass at 12 kHz, short leading fade, faded tail and approximately -2.5 dBFS peak normalization. Decoded float storage is about 0.9 MiB at 32 kHz or 1.3 MiB at a 48 kHz AudioContext. All playback uses same-origin files, with no runtime third-party requests.

Rebuild offline with `node scripts/prepare-combat-audio.mjs /absolute/source-cache` from the repo root (requires curl and FFmpeg). Original source files stay in that cache, outside the shipped game.

Downloads/decodes run two at a time after the initial audio setup; each clip has an eight-second deadline. No network or decoding work occurs on firing. Each failed or pending clip retains procedural fallback. The recorded voice pool is capped at 24, prioritizes player reports over distant bot foley, applies panning/occlusion filtering and disconnects ended nodes. Session end cancels pending recorded foley as well as active reports.
