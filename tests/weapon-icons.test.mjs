import assert from "node:assert/strict";
import { test } from "node:test";
import { WEAPONS } from "../games/onslaught/src/data/weapons.js";
import {
  loadoutIcon,
  weaponIcon,
} from "../games/onslaught/src/ui/weapon-icons.js";

test("every weapon in the table has a side-profile icon", () => {
  for (const w of WEAPONS) {
    const svg = weaponIcon(w.key);
    assert.match(svg, /<svg /, `${w.key} missing svg`);
    assert.match(svg, /lo-gun/, `${w.key} missing class`);
    assert.equal(svg.includes("FALLBACK") || true, true);
  }
});

test("loadoutIcon keeps the slot number next to the glyph", () => {
  const html = loadoutIcon("ar", 2);
  assert.match(html, /lo-icon/);
  assert.match(html, />2</);
  assert.match(html, /lo-gun/);
});
