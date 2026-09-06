# Gunsmith — deferred design

Status: **not built.** The gun-choice half shipped; attachments did not.
This is here so the decision and the research behind it do not have to be
re-derived.

## What shipped

Guns are grouped into **bands**, one band per number key (`BANDS` in
`src/data/weapons.js`). Guns in the same band compete for that key — the M4 and
the VK-7 are both key 1, the MP5 and the Wasp-9 are both key 5 — and the armory
picks which one holds each key. A separate choice picks which gun you deploy
holding.

That is the Counter-Strike half of the idea: restrict what you take in, and
make the choice before the match rather than during it.

## What was deferred

Per-gun attachments. Decided: **gated by account level**, using the XP curve
already in `src/core/progression.js`.

## The two reference models

**Call of Duty — Gunsmith + Create-a-Class.** Nine attachment categories
(muzzle, barrel, optic, stock, laser, underbarrel, magazine, rear grip, perk),
of which **five can be equipped at once**. The important part is that every
attachment has an explicit *downside* as well as an upside, shown as opposing
stat bars — a longer barrel buys range and costs handling. That tension is what
makes a build a decision instead of a lookup. Attachments unlock by using the
gun. Finished builds are saved as named classes you pick before deploying.

**Counter-Strike 2 — loadout + buy economy.** No attachments at all. You choose
a limited set of guns per category (rifles get five slots, fifteen weapons
total), locked once the match starts, and then buy from that set with round
money. The decision is *which guns you can reach for*, not how they are
configured.

Sources:
[MP5 specifications](https://en.wikipedia.org/wiki/Heckler_%26_Koch_MP5),
[CS2 loadout system](https://dignitas.gg/articles/the-new-cs2-loadout-system-explained)

## How attachments would fit this codebase

The one thing to get right is the sim boundary. Weapon stats are read by
`sim/weapons.js` out of a plain def object, and a run has to stay reproducible
from its seed. So:

- **Resolve, don't mutate.** Add a pure `resolveWeapon(baseKey, attachmentIds)`
  in `data/` that returns a new frozen def: base stats plus each attachment's
  deltas, applied in a fixed order. Never edit an entry in `WEAPONS`.
- **Attachments are part of the run, not a setting.** `captureRun` already
  records the loadout; it would need to record the attachments too, or a replay
  of the same seed diverges. Settings live in presentation precisely so they
  cannot do this — attachments cannot follow that rule, because they change
  what the seed produces.
- **`resolveLoadout` is already the seam.** It maps keys to defs; it would map
  keys to *resolved* defs instead. Nothing downstream needs to know.
- **The viewmodel would need attachment points.** Every gun already exposes
  `parts.sight`, `parts.muzzle` and `parts.mag`; an optic or a suppressor is a
  model parented to one of those, and `adsOffset` recomputed from the new sight
  height. `tests/weapon-models.test.mjs` already enforces that the sight lands
  in front of the camera, which is the invariant an optic swap would break.

## Sketch of the slots

Five equipped at once, drawn from:

| Slot | Trades |
| --- | --- |
| Optic | Zoom and sight picture against ADS speed |
| Muzzle | Recoil and flash against handling |
| Barrel | Range and bullet velocity against handling and ADS speed |
| Underbarrel | Recoil control against movement speed |
| Magazine | Capacity against reload time and handling |

Every one needs a real downside. Attachments that are pure upgrades collapse
into a single correct build and stop being a decision — which is the whole
reason to build the system.

## Unlocking

Account level, off `Progression.level`. The gate already exists and is already
exercised: `unlockLevel` on a weapon is read by `Progression.isUnlocked`, and
a locked gun drops out of the key order rather than leaving a dead key.
Attachments would use the same field and the same code path.
