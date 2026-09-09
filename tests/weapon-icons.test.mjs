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

test("loadoutIcon keeps the slot number next to the glyph", () => {
  const html = loadoutIcon("ar", 2);
  assert.match(html, /lo-icon/);
  assert.match(html, />2</);
  assert.match(html, /guns\/ar\.png/);
});
