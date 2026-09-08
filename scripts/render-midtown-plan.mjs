import { writeFileSync } from "node:fs";
import { MIDTOWN } from "../games/onslaught/src/data/midtown.js";
import { FFA } from "../games/onslaught/src/sim/free-for-all.js";

// Technical plan from the same manifest as rendering, collision and the HUD.
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="940" height="780" viewBox="0 0 940 780">
<rect width="940" height="780" fill="#101b24"/>
<g font-family="Arial,sans-serif">
<text x="42" y="54" fill="#e9f0f2" font-size="30" font-weight="bold">MIDTOWN CROSSING</text>
<text x="42" y="85" fill="#91a9b9" font-size="15">GUN GAME / YOU + 6 OPERATORS / Original NYC-inspired layout</text>
<text x="118" y="164" fill="#a5bcca" font-size="13">N ↑</text>
<g transform="translate(306 421) scale(6.6)">
<rect x="-27" y="-35" width="54" height="70" fill="#1e303c"/>`;
for (const [x, color] of [
  [-22, "#62a58f"],
  [0, "#cbb779"],
  [22, "#679aba"],
])
  svg += `<path d="M${x},-31 L${x},31" stroke="${color}" stroke-width=".6" stroke-dasharray="1.2 1.2" opacity=".45"/>`;
for (const z of [-14, 13])
  svg += `<path d="M-26,${z} H26" stroke="#e1e9e6" stroke-width=".3" stroke-dasharray="1 1" opacity=".4"/>`;
for (const b of MIDTOWN.solids) {
  const color =
    {
      bus: "#b7b9a4",
      planter: "#546e62",
      hoarding: "#4d967d",
      step: "#caa35f",
      platform: "#e9bc67",
    }[b.kind] || "#4a5c69";
  svg += `<rect transform="translate(${b.x} ${b.z}) rotate(${(-b.yaw * 180) / Math.PI})" x="${-b.w / 2}" y="${-b.d / 2}" width="${b.w}" height="${b.d}" fill="${color}" stroke="#8595a0" stroke-width=".12"/>`;
}
for (const s of MIDTOWN.spawns)
  svg += `<circle cx="${s.x}" cy="${s.z}" r=".7" fill="#d4c393"/>`;
svg += `</g><g fill="#deeaec" font-size="17">
<text x="550" y="230" font-weight="bold">THEATER WALK</text><text x="550" y="256" fill="#94acb9" font-size="14">Canopy, service doors, close flank.</text>
<text x="550" y="322" font-weight="bold">BROADWAY</text><text x="550" y="348" fill="#94acb9" font-size="14">Offset buses, crosswalks, central cover.</text>
<text x="550" y="414" font-weight="bold">SEVENTH AVENUE</text><text x="550" y="440" fill="#94acb9" font-size="14">Hotel frontage, medium-range encounters.</text>
<text x="550" y="528" font-size="14">${FFA.target} individual kills / ${FFA.duration / 60}-minute limit</text>
<text x="550" y="557" fill="#94acb9" font-size="14">Dots: candidate respawn positions</text>
<text x="550" y="586" fill="#4d967d" font-size="14">Green: alternating sightline screens</text>
<text x="550" y="615" fill="#e9bc67" font-size="14">Gold: steps and decks, 1.1–1.6 m high</text>
</g><text x="42" y="725" fill="#a8bbc5" font-size="14">54 × 70 m playable footprint / Shared collision and minimap data</text>
<text x="42" y="751" fill="#748e9d" font-size="12">Technical layout, not a visual-fidelity preview or geographic survey.</text></g></svg>`;
writeFileSync(new URL("../docs/midtown-layout.svg", import.meta.url), svg);
