export class ImpactFX {
  constructor({ particles, decals, rng }) { this.particles = particles; this.decals = decals; this.rng = rng; }

  hit(point, normal, material = "concrete") {
    if (material === "flesh") {
      // Enemy hits: a quick dark-red puff, no world decal (the body moves on).
      this.particles.burst(point, 0x9b2417, 9, 1.7, 0.75, 0.3, this.rng);
      this.particles.burst(point, 0x5c120c, 4, 0.9, 0.9, 0.26, this.rng);
      return;
    }
    const color = material === "metal" ? 0xffc25f : (material === "wood" ? 0xc78d5a : 0xb5c1bb);
    const count = material === "metal" ? 8 : 6;
    this.particles.burst(point, color, count, material === "metal" ? 2.2 : 1.3, 0.6, 0.32, this.rng);
    this.decals.spawn(point, normal, material === "metal" ? 0x513d2a : 0x242a2b, material === "metal" ? 0.55 : 0.85);
  }

  dust(point) { this.particles.burst(point, 0xb1a08a, 7, 0.65, 1.4, 0.7, this.rng); }
}
