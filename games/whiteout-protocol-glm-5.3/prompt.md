# WHITEOUT PROTOCOL — CoD-style wave-survival FPS (benchmark prompt v3, arctic variant, real-project edition)

You are an autonomous senior FPS gameplay programmer, animator and technical
artist. Your specialty is game feel: you know why Call of Duty feels crisp
and you can reproduce that crispness in code. Work until the game is done,
not described.

Build a fast, loud, adrenaline-soaked wave-survival FPS. Two things are
the product, everything else exists to serve them:
1. SHOOTING: the weapon must kick, the screen must react, and every
   bullet that lands must be a small explosion of feedback — light,
   particles, blood, flinch, sound, numbers.
2. THE PICTURE: graphics, shaders and effects at "is this really WebGL?"
   level. This game will be judged from a 30-second gameplay video —
   every frame of normal combat must look like a graded cinematic shot.
A mediocre-looking build with perfect systems is a failure; a spectacular
build with a cut corner in a side system is a success. When in doubt
between subtle and punchy — choose punchy, then polish until it is smooth.

## 0. HARD CONSTRAINTS
- C1. A real project, not a single file: Vite + npm, Three.js (exact
  pinned version) + official addons from node_modules. Structure the code
  like a real game codebase — a module per system (input, movement,
  weapon, enemies, fx, audio, ui, ...), no 5000-line monolith. Beyond
  that, use whatever you want — extra libraries, external assets,
  textures, audio, shaders, or fully procedural generation. Your call.
  The only rule: `npm install && npm run dev` must give a running game,
  and `npm run build` must produce a clean production build.
- C2. Single seeded PRNG (seed `0xC0DA`) for all procedural generation and
  spawn logic — two runs look identical.
- C3. Zero console errors or warnings from your own code; no TODOs, dead
  buttons or `alert()`.
- C4. Target 60 FPS on a mainstream desktop GPU at all times, including the
  heaviest wave. Every effect below ships with pooling and caps (section 12).
- C5. Every animation in the game uses proper easing (ease-out on throws
  and kicks, ease-in-out on transitions, snappy overshoot on impacts) or
  spring-damper systems. A single linear lerp visible anywhere is a defect.

## 1. SETTING

Present day, the snowed-in central yard of an arctic research station at
deep dusk. Prefab lab modules with warm frosted windows, shipping
containers, stacked crates and fuel drums, an antenna mast with guy-wires,
snowdrifts, blocks of glacial ice. Overhead a live aurora borealis ripples
across a blue-violet sky; sodium floodlights on masts throw warm pools of
light across the snow; a storm is coming in — ground blizzard streams
powder snow sideways in gusts. Wind is a character: flags and loose tarps
whip and snap, guy-wires sway, powder streams off drift crests, the
floodlights rock slightly so their light pools breathe.

CRITICAL: this is dusk, not night. Snow fills most of the frame and must
read bright blue-white; light pools are warm; the sky is deep but never
black. If a screenshot of the yard looks murky or dark, the lighting is
wrong — the frame's luminance is carried by the snow.

## 2. GRAPHICS AND SPECTACLE — make it look expensive

This is a showcase scene. A player should want to screenshot it.

- G1. Cinematic arctic-dusk lighting: a physically-plausible cold key from
  the sky plus warm sodium floodlight pools (teal-orange grade), fog with
  depth, filmic tone mapping and color grading. The aurora is a living
  shader — two or three layered ribbon curtains that slowly ripple and
  drift, casting a faint green tint onto the snowfield. It must be smooth
  motion and smooth gradients: visible banding or a static aurora texture
  is a defect. The whole frame should read as graded footage, not raw
  WebGL default.
- G2. Materials with real character: wind-packed snow with subtle sparkle
  glints where light pools hit it, scuffed painted metal on containers and
  drums, blue glacial ice with a faked inner translucency, frosted windows
  glowing warm from inside the modules. Normal/roughness variation so
  surfaces catch the floodlights instead of looking flat.
- G3. Post-processing stack: bloom, subtle vignette, chromatic aberration
  on damage/impact, motion blur or camera-driven smear on fast turns, film
  grain dialed low. All of it must switch off cleanly in a `low` quality
  preset if the frame budget is threatened.
- G4. Volumetric floodlight cones made visible by the blowing snow, snow
  motes drifting through the beams, long soft blue shadows across the
  drifts, aurora light subtly shifting the snowfield's tint over the course
  of the match.
- G5. Every violent event is a lighting event: muzzle flash lights the
  snow and the nearest container wall, explosions bloom, OVERDRIVE tints
  the frame. The scene should never look static while combat is happening.
- G6. Custom shaders where they pay, not stock materials everywhere. At
  minimum, written as real GLSL (ShaderMaterial or onBeforeCompile): the
  aurora ribbons (G1), snow sparkle glints that shift as the camera moves,
  tracer streaks with a hot core and soft falloff, heat shimmer over the
  barrel, and the glacial ice's fake inner translucency. Each of these has
  a cheap-looking default — the custom shader is the difference between
  "WebGL demo" and "game trailer".
- G7. Particles are GPU-instanced and everywhere, with pooling and caps:
  blowing snow (persistent, wind-driven), muzzle smoke, impact powder
  bursts, sparks with gravity and bounce, blood mist, explosion debris.
  Sustained combat should fill the air with drifting particulate that
  catches the floodlights.
- G8. Set-piece: fuel drums EXPLODE when shot — fireball with emissive
  core, shockwave ring whipping the blowing snow outward, sparks, black
  scorch + melted dark patch left in the snow, physics impulse that
  ragdolls nearby enemies, and a 1–2 frame white flash of light on the
  whole yard. Place a handful per wave, respawn between waves. This is
  the money shot of the trailer — make it worth slowing down for.

## 3. MOVEMENT — flow like water

Movement is half of game feel. Chaining sprint → slide → jump → ADS must
read as ONE continuous motion with no hitches or dead frames.

- M1. Pointer lock mouse look, WASD, Space jump with real air control and a
  landing dip (camera + weapon sink and recover on touchdown, scaled by
  fall height).
- M2. Sprint (Shift) with weapon lowered to a run pose and +5 FOV kick;
  double-tap Shift = tac-sprint: weapon pumps with the arms, even faster,
  slower ADS out of it. Both transitions fully animated.
- M3. Sprint-slide (Ctrl while sprinting): a real momentum slide with
  camera cant, weapon tilt, a rooster-tail of powder snow kicked up at the
  feet and a hissing slide-on-snow sound; slide-jump preserves momentum.
  Slide into ADS must be seamless and is the coolest thing in the game —
  make it feel like it.
- M4. Crouch (hold Ctrl when not sprinting): smooth ~0.6 m camera drop over
  ~200 ms, half speed, collider shrinks so low cover actually protects,
  tightest spread/recoil state when combined with ADS.
- M5. Lean Q/E: smooth camera tilt + offset; auto-peek — standing close to
  cover while ADS automatically leans around the corner, shooting from
  cover while staying protected.
- M6. Mantle (Space at a waist-high obstacle): quick two-phase vault with
  camera dip and hand-plant weapon-off-screen moment. No climbing animation
  slog — CoD-fast.
- M7. All movement states blend: crouch-slide-lean-ADS combinations never
  snap, fight each other or leave the viewmodel in a broken pose.

## 4. GUNFEEL — the core of the whole build

If you get one section perfect, make it this one. Firing the weapon must
feel violent, heavy and precise at the same time.

- F1. Full-auto rifle, ~700 RPM, hold LMB; 30-round magazine, INFINITE
  reserve ammo — the player never runs dry and never picks ammo up, only
  the magazine ever limits them. HUD shows magazine count and an infinity
  symbol (or similar) for reserve.
- F2. Recoil is the signature: fast punchy kick up and slightly sideways
  per shot, weapon visibly rotates and translates back toward the camera,
  smooth spring recovery, sustained fire climbs a repeatable pattern the
  player can learn and fight. Hip spread cone wider, ADS tight, crouch
  tighter. First shot must feel heavier than the rest.
- F3. Crosshair: 4 lines + dot; blooms while firing/moving, tightens when
  still; fades out fully in ADS.
- F4. Muzzle flash sprite + 1–2 frame dynamic light that visibly licks the
  snow and the nearest container, tracers, muzzle smoke wisps that linger
  and drift downwind, physically simulated shell ejection — hot brass that
  buries into the snow with a tiny steam puff and metallic tinkles on hard
  surfaces — and a heat shimmer on the barrel during sustained fire.
- F5. World impacts: powder bursts and dark-rimmed craters in snow, sparks
  that stream off containers and the antenna mast, glittering chips and
  spreading cracks in glacial ice, splinters off wooden crates, tarps
  that rip with a canvas puff, frosted window panes that shatter into
  physical shards spilling warm interior light, and fuel drums that
  explode (G8).
- F6. Camera shake tiers: micro on firing, medium on nearby explosion,
  strong directional on taking damage; FOV-kick on sprint start and on
  getting hit. Shake is layered noise, never a random jitter.
- F7. Weapon animation set, all spring/eased: idle sway (breathing), run
  bob, tac-sprint pump, wall-bump pose when hugging geometry, inspect on I
  (turn, tilt, charging-handle flick), slide cant, landing dip.
- F8. Audio: layered synth gunshot (click attack + low-end thump + short
  room tail), distinct enemy weapon report, sonic cracks from near-miss
  bullets, hit tick / kill thock, low-HP heartbeat + audio muffle, all
  through one master bus with soft clipping so full combat never distorts.

## 5. IMPACT ON FLESH — hits must be disgustingly satisfying

Shooting an enemy and shooting a wall must never look or sound similar.
And this arena is white: blood on snow reads like nowhere else — treat
every red decal as a composition element the player will screenshot.

- H1. Blood: directional blood spray bursting from the hit point away from
  the bullet, blood mist puffs, droplets that arc and land as high-contrast
  decals on the snow, crates and container walls, blood pooling under
  bodies with a slightly melted dark rim in the snow, blood trails behind
  wounded enemies dragging through the powder. Headshots produce a bigger,
  wetter burst.
- H2. Layered hit feedback stack: white hit-marker X + tick sound on hit,
  red X + deeper confirm on kill, damage numbers popping off enemies with
  ease-out scale/fade, kill feed sliding in with spring easing, and a 2–3
  frame hit-stop (time briefly at ~0.1×) on every kill for punch.
- H3. Bodies react: directional flinch pushing the limb that was hit,
  stagger on heavy hits, enemies knocked off balance by sustained fire.
  A body soaking bullets without visibly reacting is a defect.
- H4. Headshots one-shot (2× head hitbox) with a distinct wet crack, extra
  ragdoll impulse and an oversized blood burst.
- H5. Deaths are physical: ragdoll tumbles over crates and down snowdrift
  slopes, bodies persist a few seconds then sink away, leaving their blood
  decals behind. Cap active ragdolls, replace oldest.
- H6. Blood decals accumulate through the wave and are cleared between
  waves (or capped oldest-first) so the snowfield tells the story of the
  fight without killing performance.

## 6. RELOAD — choreography showcase

R key, ~2 s, a Call of Duty reload beat for beat:

- R1. Weapon drops and tilts inward toward the camera as the reload starts;
  subtle camera roll follows the weapon through all phases.
- R2. Three distinct phases with synchronized synth sounds: (1) mag-release
  click, empty magazine EJECTED as a separate mesh flying off to the left
  and out of view; (2) fresh mag rises from below-left, slams in with a
  solid thunk, weapon nudges up from the impact; (3) charging handle racked
  — slide part snaps back and forward with a metallic clack.
- R3. Tactical reload (mag not empty) keeps the chambered round and skips
  phase 3; empty reload plays all three. Firing locked during reload;
  sprint cancels reload with a quick abort animation.
- R4. During OVERDRIVE (section 8) reloads play ~30% faster with pitched-up
  sounds — same choreography, more urgency.

## 7. ADS — the sight line is law

This is the #1 place builds fail. The classic failure is shipping ADS as
"the hip-fire viewmodel translated to the center of the screen" — same
mesh, same orientation, same scale, just moved. That is not aiming down
sights and it counts as a broken build. Read all of A1–A9 before writing
any viewmodel code.

The rules below are written to hold for ANY sight you choose to model — a
red dot optic, or bare iron sights (rear notch/aperture + front post). Pick
one and implement it fully; the solve and the tests are identical either
way.

- A1. Weapon axes come first. The barrel points along the camera forward
  axis (**-Z** in Three.js view space): stock near the camera, muzzle far
  from it. From any pose the weapon must read as a long object receding
  into the frame with visible perspective foreshortening — never as a
  vertical slab standing in front of the lens. If you ever need a 90°
  rotation around X to "make it look right", the mesh construction is
  wrong — fix the mesh, not the rotation.
- A2. The weapon carries three named anchors:
  - `rearSightAnchor` — on the rear element the eye looks through: the
    center of the rear notch/aperture, or the center of the optic's rear
    glass.
  - `frontSightAnchor` — on the element the eye aligns to: the very TIP of
    the front post (its top edge, not the center of its mesh), or the
    emissive dot of the optic.
  - `muzzleAnchor` — at the tip of the barrel; muzzle flash, tracers and
    shell ejection originate here.
  For an optic both sight anchors sit on the optical axis; for irons they
  are physically separated along the receiver. Same two names, same math.
- A3. The ADS transform is SOLVED from the sight line, never hand-tuned.
  Each frame while aiming, compute the weapon's position and rotation such
  that:
  1. the straight line through `rearSightAnchor` → `frontSightAnchor` is
     collinear with the camera forward axis,
  2. the camera sits behind `rearSightAnchor` at a REALISTIC eye relief —
     roughly 8–12 cm in world scale, the distance from a shooter's eye to
     the rear of the sight. Not half a metre. Get this wrong and the whole
     rear half of the weapon ends up in front of the camera (see A5).
  3. the weapon is rolled upright, which fixes the remaining degree of
     freedom.
  This constrains position, yaw and pitch — the sight picture is then
  correct by construction and cannot drift at any FOV. A guessed offset
  vector that "looks about right" is a defect. If anything needs a manual
  nudge to look centered, the solve is wrong.
- A4. Hip and ADS are two DISTINCT POSES, interpolated as full transforms
  (position + rotation + pose offsets), not position alone:
  - Hip: weapon low and offset to the right of screen center, canted
    slightly inward, receiver and body visible, muzzle angled down.
  - ADS: weapon rolled upright and squared to the camera, pulled back
    toward the shoulder, shifted so the SIGHT — not the receiver — is what
    is centered. The player looks THROUGH the gun, so most of the weapon
    body drops below the frame and out of the way. The dominant thing on
    screen is the sight picture, not the gun.
  Screenshots of the two poses must look like two different actions. If
  ADS reads as hip-fire slid to the middle, it is still wrong.
- A5. Nothing may stand between the eye and the sight. In ADS the camera
  looks straight down the weapon's own axis, so any part of the weapon that
  sits BEHIND the sight — stock, buffer tube, receiver, charging handle —
  is on the line of sight and will be seen end-on, as a fat column blocking
  the middle of the screen. Real weapons do not have this problem because
  the eye sits only a few centimetres behind the sight and the stock is
  already past the shooter's cheek. Reproduce that:
  - The butt of the stock must end up BEHIND the camera in ADS (positive Z
    in camera space) and therefore not render at all.
  - No geometry closer to the camera than `rearSightAnchor` may fall inside
    a ±8° cone around the view axis.
  - What remains visible in ADS is the sight itself plus the handguard and
    barrel receding toward the target, occupying roughly the lower third of
    the frame. If a solid block of weapon rises from the bottom edge to the
    reticle, the pose is wrong — no matter what the alignment test says.
- A5b. Because the eye sits close to the weapon, parts of it will cross the
  world near plane. Do not fix this by pushing the weapon away — that
  re-creates the A5 failure. Render the viewmodel in its own pass, with its
  own camera, its own near plane (~0.01) and its own FOV that does not
  track the world FOV. This is the standard FPS solution; use it.
- A6. Hold RMB, hip→ADS over ~150 ms easeInOut with FOV 75→55 in sync;
  sensitivity scales with zoom, recoil/spread reduced, sway suppressed;
  release returns just as fast; firing available at any point of the
  transition. Because the sight line is solved (A3) and not offset,
  changing FOV must not move the aiming point by a single pixel.
- A7. Sight picture — keep the view open. Whatever sight you model, the
  player must still see the target:
  - Optic: thin circular housing, completely clear window, small emissive
    red dot, world visible all around the reticle.
  - Irons: rear notch/aperture cut noticeably WIDER than realistic and the
    front post noticeably THINNER than realistic, so the sight frames the
    target instead of burying it in metal. Front post and rear element get
    a subtle emissive or high-contrast tip so the eye can find the aiming
    point against a dark or busy background.
  Either way, no part of the weapon may occlude the center of the screen
  above the aiming point.
- A8. Shots land exactly where the sight points: every bullet raycasts from
  camera center along forward with the current spread cone; sight picture,
  ray and decal always agree.
- A9. SELF-TEST (T key), THREE independent checks, run for FOV 75/65/55,
  log PASS/FAIL per FOV per check to console, working without pointer lock.
  All three are mandatory — the first two can pass on a completely unusable
  sight picture, and the third is the one that catches it:
  1. **Ray alignment** — actually cast the gun ray into the world, take the
     real hit point, project it to screen space, assert within 1 px of
     screen center. Projecting an anchor is NOT this test; the ray must be
     fired and must hit something.
  2. **Sight projection** — project `frontSightAnchor` to screen space and
     assert it is within 2 px of screen center, and that `rearSightAnchor`
     projects within 2 px of it as well (the two must visually stack).
  3. **Sight-line clearance** — walk the viewmodel's vertices (or per-part
     bounding boxes). For every one closer to the camera than
     `rearSightAnchor`, assert its angular offset from the view axis is
     greater than 8°. Also assert the stock's rearmost point is behind the
     camera. Log the worst offender's part name and angle on failure. This
     is what proves the player can actually see the target.
  If any check fails, fix the weapon transform solve and the ADS pose —
  never "correct" it by biasing the raycast, nudging the decal, or hiding
  geometry only during the test.

## 8. ACTION SYSTEMS — the drive

- D1. Waves escalate: each wave adds enemies, tighter pushes and a faster
  ambient music pulse. Short breather between waves with a wave banner
  slamming in (spring overshoot).
- D2. Killstreak meter: kills within 4 s of each other chain a combo
  (HUD counter with juicy pop animation). At 5-chain trigger OVERDRIVE:
  6 seconds of 0.85× world time, tighter spread, glowing tracers, faster
  reloads (R4), music layer kicks in, subtle screen-edge glow. Earned
  power fantasy, on a cooldown.
- D3. Multikill announcements: DOUBLE KILL / TRIPLE KILL / RAMPAGE text
  slamming in with scale-overshoot easing and a synth sting — visible but
  not screen-hogging.
- D4. Last kill of every wave: 1.5 s slow-mo kill-cam — camera detaches
  and orbits the final ragdoll before snapping back. Seamless in and out.
- D5. Dynamic music: procedural layered soundtrack (WebAudio — kick,
  hats, bass pulse, pad) that ramps intensity with wave number, active
  enemy count and combo state, and drops to a low pad between waves.
  Music ducks slightly under gunfire so the mix stays readable.
- D6. Health regen: no damage for 4 s → smooth regen; red screen-edge
  vignette and heartbeat fade as health returns; any damage resets the
  delay. Cover play must be viable against pushes.
- D7. Score with popup numbers flying to the HUD counter, headshot bonus,
  end-of-wave tally (accuracy, headshot %, best combo) on an animated
  card.

## 9. ENEMIES — dramatic targets

- E1. Three types, all simple humanoids with personality, in dark arctic
  assault gear with small retro-reflective strips that catch the
  floodlights — they must read as crisp silhouettes against the snow, never
  as unlit black blobs: Rusher (fast, melee ice-axe swing, lunges), Gunner
  (takes cover behind containers and crate stacks, leans out to fire,
  suppresses), Heavy (slow, armored — armor PLATES that visibly fly off
  under fire, sparking, before health damage starts).
- E2. AI loop: spawn → advance using cover → peek/fire with reaction
  delay → push aggressively when the player reloads or is low (they can
  hear dry fire and reload sounds) → flank if the player camps.
- E3. Thin-cover penetration: wooden crates and hanging tarps are
  shoot-through with reduced damage and a puff of splinters or canvas
  fibers; containers, drums and glacial ice are not.

## 10. ALIVE WORLD

- W1. Flags and loose tarps whip in the wind and react to bullets;
  guy-wires sway and hum.
- W2. Ground-blizzard gusts occasionally roll through the yard, the aurora
  slowly shifts overhead, the player's breath fogs in the cold on a calm
  beat, distant generator hum + wind ambient bed under everything.

## 11. HUD AND START SCREEN

- U1. Minimal and kinetic: ammo (big, punches on shot, infinity symbol for
  reserve), HP bar with smooth drain/refill, wave + score, combo counter,
  kill feed. Every HUD change animates with springs — nothing teleports.
- U2. Damage direction indicator arcs; hit vignette directional too.
- U3. Contextual prompts (mantle) that fade in/out; controls hint card at
  start that dismisses on first input.
- U4. Start screen before the match with a START button and a GOD MODE
  toggle button. With GOD MODE on, the player takes zero damage and cannot
  die (HP bar shown as locked/full, a small persistent GOD MODE badge on
  the HUD). Everything else plays normally. The state is chosen before the
  match and applies for that whole match; restart returns to this screen.

## 12. PERFORMANCE

- P1. Object pools for bullets, shells, particles, decals, blood, damage
  numbers; hard caps with oldest-first reuse; zero per-frame allocations
  in hot loops; instancing for debris/snow/blood.
- P2. Clamp devicePixelRatio ≤ 2; correct resize; tab-visibility pauses
  simulation and audio cleanly.
- P3. Keep dynamic lights few (muzzle, explosion, floodlights); everything
  else faked or emissive.
- P4. Backquote (`) debug overlay: FPS, frame ms, draw calls, active
  particles/ragdolls/AI, pool utilization, PRNG seed.

## 13. KNOWN PITFALLS — do not fail on these

- K1. AudioContext only after first user gesture; one master gain with
  soft clip; no autoplay warnings.
- K2. Pin the exact three version in package.json and keep the lockfile;
  actually start the dev server and load the page once early — a broken
  import or version mismatch is the #1 black-screen cause.
- K3. Pointer Lock from a user gesture; handle `pointerlockerror` and
  Escape without breaking input state; pause overlay, never a freeze.
- K4. Clamp delta time (tab switch), guard NaN in springs and slow-mo
  time-scale math (hit-stop + OVERDRIVE + kill-cam can stack — resolve
  time-scale through ONE manager, never multiply ad hoc).
- K5. Z-fighting on decals (bullet holes and blood): polygonOffset or
  micro-offsets.
- K6. Restart (after death / new match) must not leak listeners, lights,
  or audio nodes — verify by watching the debug overlay across 3
  restarts.

## 14. PROCESS AND ACCEPTANCE

First ship a minimal playable loop (move, shoot, one enemy type, one wave,
death/restart). Then iterate in priority order: gunfeel → graphics,
shaders and spectacle (all of section 2) → flesh impact and blood →
movement flow → reload/ADS → action systems → enemies → alive world →
HUD polish.

If you have to cut, cut from the bottom of this list, never the top:
lean/auto-peek (M5), mantle (M6), kill-cam (D4), end-of-wave tally card
(D7) and enemy flanking (E2's last step) are all sacrificable; nothing in
sections 2, 4 or 5 is. Downgrading a visual from "custom shader" to
"stock material" counts as a cut — it goes to the same bottom of the
queue.

If you have the ability to open and drive a real browser, do it: play
several full waves including death and OVERDRIVE, watch the console, run
the T self-test, and fix everything you find. If you have a tool that lets
you look at screenshots, use it relentlessly — judge your own frames like
a technical art director and fix what looks cheap. If you cannot see the
game at all, say so explicitly and instead self-review the code against
every requirement ID below. Either way, do not stop at a plan.

All C/G/M/F/H/R/A/D/E/W/U/P/K requirements are individually checkable —
they are your definition of done.

Finish with a short report:
1. Project layout (one line per module: what it owns) and the exact
   commands to install, run and build.
2. Full control scheme.
3. Requirement IDs fully met / partially met / cut.
4. The main trade-offs you consciously took and why.
