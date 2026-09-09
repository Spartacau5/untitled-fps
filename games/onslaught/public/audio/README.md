# Modern combat audio

This mix replaces the first v6 historical gunshot bank after playtest feedback. It aims for a dry, immediate modern-shooter report: distinct source character, recorded low-body reinforcement, short tails and less aggressive bus compression. It is not Call of Duty audio or a claim of matching its production quality.

## Sources

Fourteen gunshot clips use seven near-perspective recordings from [The Free Firearm Sound Library](https://opengameart.org/content/the-free-firearm-sound-library), by **Ben Jaszczak, Brian Nelson, Kevin Heras and Matthew Nanney**. The source page explicitly releases the library under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/). Its included Prepared Master Sheet identifies the weapons and microphone perspectives. Each family uses two separate discharges.

| Game family | Recorded source |
| --- | --- |
| Pistol | 1911 .45 |
| SMG / MP5 mix | Carl Gustav M45 9 mm |
| M4 / assault rifle | AR-15 5.56 |
| LMG mix | AK-47 7.62x39 |
| DMR mix | Savage Model 10 .300 Blackout |
| Sniper mix | Tikka T3 .30-06 |
| Shotgun | Mossberg Model 190 12 gauge |

These are designed weapon-family mixes. The LMG does not have a dedicated belt-fed recording. The launcher and four hit/kill ticks are original synthesized effects, released as CC0.

The four handling clips retain their [USC Cinema / Sunset Editorial archive](https://archive.org/details/SSE_Library_GUNS) provenance, now recut and filtered for shorter mechanical transients. That archive's [metadata](https://archive.org/metadata/SSE_Library_GUNS) declares CC0. Their original first-generation bytes are reproducibly read from commit `8b584b4`; exact source and intermediate hashes remain in the manifest.

[manifest.json](manifest.json) records source archive members, URLs, hashes, trim points, mastering, output hashes and sizes. No original third-party archive is shipped in the game. No runtime third-party request is needed.

## Mix and runtime

- **23 mono WAV clips, 377,844 bytes total**, versus 458,084 bytes in the previous bank.
- 32 kHz / 16-bit PCM, approximately -3.38 dBFS sample peaks. About 0.72 MiB decoded at 32 kHz, or 1.08 MiB at 48 kHz.
- Gunshots start within 12 ms and contain over 90% of their energy in the first 100 ms. The recording's low-frequency body is layered offline, so firing still starts one bounded voice.
- Two different discharges alternate per ballistic family. Runtime pitch variation is only ±0.4%, preserving weapon identity.
- Player reverb send reduced from 0.07 to 0.015; bot report gain reduced from 0.58 to 0.3. Bot occlusion remains spatially filtered.
- Master compression moves from -16 dB threshold / 5:1 / 2 ms attack to -6 dB / 3:1 / 12 ms. This gives the transient more room before compression; actual headphone balance still needs listening QA.
- Existing two-worker loading, per-clip timeouts/fallbacks, 24 recorded-voice limit and session cleanup remain. Hit/kill feedback gets higher playback priority.
- Gun damage, firing cadence, recoil simulation, progression and map rules do not change. Sound still starts on the same shot event as visual recoil.

## Audition

After `npm run dev`, open `/audio-lab.html` on the displayed local address. The page uses the actual game Audio class and weapon RPM data for single shots, five-shot sequences, spatial bot exchanges, reloads and hit/kill feedback. It also ships in the production build for branch previews.

The cloud browser blocks localhost here. The build and automated tests verify routing, assets, cadence and cancellation; they do not establish perceived quality. Use the audition page and then a full match to judge the mix.

## Rebuild

Download the [Prepared SFX Library archive](https://opengameart.org/sites/default/files/Prepared%20SFX%20Library.7z) and extract it outside the repo. With Python, NumPy, SciPy and FFmpeg installed, run:

```bash
python scripts/prepare-modern-combat-audio.py "/path/to/Prepared SFX Library"
```

Retain git history containing `8b584b4` for the handling source bytes. The approximately 194 MiB source archive is an offline production dependency, never a player download.
