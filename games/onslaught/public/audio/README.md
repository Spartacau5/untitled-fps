# Authored FPS audio, revision 3

The two earlier recording-based mixes did not meet the requested game sound direction. This revision replaces their gun and handling assets with authored FPS effects and replaces the ordinary synthesized boot contacts with recorded footfalls. Perceived quality still needs listening approval; this is not a claim of COD, CS:GO or Valorant parity.

## Sources and rights

[Sound credits](credits.html) ship in the game and are linked from the menu and audio preview. [manifest.json](manifest.json) records per-file source members, source/output hashes, licenses and processing.

- **Q009's weapon sounds**, originally for Cube 2: Sauerbraten / SauerEnhanced: [source](https://opengameart.org/content/q009s-weapon-sounds), **CC BY-SA 3.0**. The adapted game-*.wav files remain under that license; the archive's license text ships as Q009-LICENSE.txt.
- Concrete and wood boots by **swuing**, metal footfalls by **Eelke**, edited by **congusbongus** for C-Dogs SDL: [source](https://opengameart.org/content/footsteps-on-different-surfaces), **CC BY 3.0** for the selections used here.
- Four retained project-authored hit/kill confirmations: **CC0**.

| Weapon profile | Authored report family |
| --- | --- |
| Pistol | Q009 pistol |
| SMG, M4, LMG | Q009 minigun, with separate gain/pitch profiles |
| DMR, sniper | Q009 rifle, with separate gain/pitch profiles |
| Shotgun | Q009 shotgun |
| Launcher | Q009 rlauncher |

There are five report families, three variants each, not eight independently recorded weapons. Generic reload handling uses isolated switch/dry-mechanism excerpts, not dedicated recordings for each magazine or bolt.

## Processing and runtime

- **40 WAV clips, 3,270,864 bytes**: 15 reports, five handling clips, 16 footfalls and four feedback clips. Previous gun/handling files are removed from the shipped directory.
- 32 kHz / 16-bit PCM, stereo reports/handling and mono footsteps/feedback. Under 10 MiB decoded at 48 kHz.
- Preserve authored stereo layers and report tails. Only leading near-silence removal, short safety fades, resampling and peak attenuation are applied offline. No aggressive exponential tail gate or added low-frequency thump.
- Player reports have no additional synthetic reverb. Small pitch variation and non-repeating takes prevent identical successive playback. Each player weapon permits three overlapping recorded reports; older voices fade over 12 ms and stop at 14 ms.
- Global limit: 24 active recorded voices plus at most four briefly retiring voices. Player reports and hit confirmations take priority over bot sounds. Stop/session cleanup disconnects both active and retiring nodes.
- Recorded player contacts alternate subtly left/right and scale in level for sprinting. Bots use quieter spatial contacts. Streets and stone platforms use concrete boots; bus roofs use metal contacts. Wood is available in the preview for future surfaces.
- Jump takeoff and landing reuse boot contacts at different levels/rates. Sliding, world impacts and ambience still use the existing synthesized effects.
- Fetch/decode uses two workers, per-file deadlines and a 512 KiB file cap. Loading overlaps renderer warmup, with at most 1.5 seconds additional preparation. The game announces pending/failed audio at match start and preserves per-sound fallback. No fetch, decoding or offline processing occurs in the firing path.
- Damage, recoil simulation, firing cadence, progression and map rules are unchanged.

## Audition

Run `npm run dev` and open `/audio-lab.html` on the Vite address, or that path on a branch preview. Confirm **designed-fps-3 · 40/40 sounds loaded**. The preview disables playback if any file failed so you cannot accidentally approve synthesized substitutes.

Compare singles, five shots, 20-shot sustained sequences, spatial bot exchanges, generic reloads, hit/kill feedback and concrete/metal/wood walking, running and landings. Weapon sequences use game RPM; the 20-shot stress test ignores magazine capacity. Footstep demos use fixed demonstration cadence, while the game uses simulation step events. Stop and selection changes cancel pending events.

Automated checks cover assets, licensing metadata, routing, stereo decoding, overlap limits, cleanup, surface selection and preview scheduling. They do not establish perceived sound quality. Local listening and a full six-bot match are required to judge character and mix balance.

## Rebuild

Extract the [Q009 archive](https://opengameart.org/sites/default/files/q009-sounds.zip) and [footsteps archive](https://opengameart.org/sites/default/files/footsteps_0.zip) outside the repo. With Python, NumPy and FFmpeg:

```bash
python scripts/prepare-game-audio.py /path/to/q009 /path/to/footsteps
```

The script preserves the four committed project-authored feedback clips and imports all replacement sounds. Original archives are offline production dependencies, not player downloads.
