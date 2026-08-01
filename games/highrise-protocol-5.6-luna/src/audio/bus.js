export class AudioBus {
  constructor() {
    this.context = null;
    this.master = null;
    this.enabled = true;
  }

  ensure() {
    if (this.context) {
      if (this.context.state === "suspended") this.context.resume();
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) { this.enabled = false; return; }
    this.context = new AudioContextClass();
    this.master = this.context.createGain();
    this.master.gain.value = 0.72;
    const compressor = this.context.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 18;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.002;
    compressor.release.value = 0.12;
    this.master.connect(compressor).connect(this.context.destination);
  }

  tone({ frequency = 440, endFrequency = frequency, duration = 0.08, volume = 0.08, type = "sine", when = 0 }) {
    if (!this.enabled || !this.context || !this.master) return;
    const now = this.context.currentTime + when;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, endFrequency), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gain).connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  noise({ duration = 0.05, volume = 0.05, when = 0 }) {
    if (!this.enabled || !this.context || !this.master) return;
    const length = Math.max(1, Math.floor(this.context.sampleRate * duration));
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) data[i] = Math.sin(i * 12.9898 + duration * 91.7) * (1 - i / length);
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const now = this.context.currentTime + when;
    gain.gain.setValueAtTime(Math.max(0.0001, volume), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.buffer = buffer;
    source.connect(gain).connect(this.master);
    source.start(now);
  }

  setSuspended(value) {
    if (!this.context) return;
    if (value) this.context.suspend(); else this.context.resume();
  }
}
