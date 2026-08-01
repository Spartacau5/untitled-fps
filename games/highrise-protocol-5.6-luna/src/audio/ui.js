export class UIAudio {
  constructor(bus) { this.bus = bus; this.heartbeatTimer = 0; }
  wave() { this.bus.tone({ frequency: 440, endFrequency: 880, duration: 0.22, volume: 0.07, type: "triangle" }); }
  click() { this.bus.tone({ frequency: 620, endFrequency: 420, duration: 0.045, volume: 0.04, type: "square" }); }
  heartbeat(dt, lowHealth) {
    if (!lowHealth) { this.heartbeatTimer = 0; return; }
    this.heartbeatTimer -= dt;
    if (this.heartbeatTimer <= 0) {
      this.heartbeatTimer = 0.62;
      this.bus.tone({ frequency: 72, endFrequency: 42, duration: 0.11, volume: 0.06, type: "sine" });
      this.bus.tone({ frequency: 64, endFrequency: 38, duration: 0.12, volume: 0.045, type: "sine", when: 0.16 });
    }
  }
}
