export class GunAudio {
  constructor(bus) { this.bus = bus; }
  shot() {
    this.bus.tone({ frequency: 1250, endFrequency: 720, duration: 0.035, volume: 0.035, type: "square" });
    this.bus.tone({ frequency: 86, endFrequency: 42, duration: 0.16, volume: 0.24, type: "sawtooth" });
    this.bus.noise({ duration: 0.11, volume: 0.16 });
    this.bus.tone({ frequency: 210, endFrequency: 120, duration: 0.28, volume: 0.04, type: "triangle", when: 0.025 });
  }
  enemyReport() {
    this.bus.tone({ frequency: 170, endFrequency: 74, duration: 0.22, volume: 0.1, type: "sawtooth" });
    this.bus.noise({ duration: 0.13, volume: 0.06 });
  }
  dry() { this.bus.tone({ frequency: 180, endFrequency: 120, duration: 0.06, volume: 0.08, type: "square" }); }
  hit() { this.bus.tone({ frequency: 980, endFrequency: 640, duration: 0.075, volume: 0.09, type: "square" }); }
  kill() { this.bus.tone({ frequency: 240, endFrequency: 72, duration: 0.22, volume: 0.15, type: "triangle" }); }
  plate() { this.bus.tone({ frequency: 820, endFrequency: 210, duration: 0.18, volume: 0.13, type: "square" }); }
}
