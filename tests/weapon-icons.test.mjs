import assert from "node:assert/strict";
import { test } from "node:test";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";
import {
  loadoutIcon,
  weaponIcon,
} from "../games/onslaught/src/ui/weapon-icons.js";

test("every weapon in the table has a side-profile icon asset", () => {
  for (const w of WEAPONS) {
    const html = weaponIcon(w.key);
    assert.match(html, /guns\/.+\.png/, `${w.key} missing png`);
  }
});

test("loadoutIcon keeps the slot number on a carried gun", () => {
  const html = loadoutIcon("ar", { slot: 2 });
  assert.match(html, /lo-icon/);
  assert.match(html, />2</);
  assert.match(html, /guns\/ar\.png/);
  assert.doesNotMatch(html, /lo-lock/);
});

test("loadoutIcon shows a lock silhouette when locked", () => {
  const html = loadoutIcon("sniper", { locked: true });
  assert.match(html, /lo-lock/);
  assert.doesNotMatch(html, /lo-slot/);
});
