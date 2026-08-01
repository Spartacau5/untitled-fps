export class ReloadAudio {
  constructor(bus) { this.bus = bus; }
  magRelease() { this.bus.tone({ frequency: 680, endFrequency: 360, duration: 0.055, volume: 0.09, type: "square" }); }
  magEject() { this.bus.tone({ frequency: 410, endFrequency: 160, duration: 0.12, volume: 0.08, type: "triangle" }); }
  magInsert() { this.bus.tone({ frequency: 105, endFrequency: 55, duration: 0.17, volume: 0.18, type: "sawtooth" }); }
  handleRack() { this.bus.tone({ frequency: 980, endFrequency: 250, duration: 0.16, volume: 0.12, type: "square" }); }
  abort() { this.bus.tone({ frequency: 240, endFrequency: 150, duration: 0.08, volume: 0.05, type: "triangle" }); }
}
