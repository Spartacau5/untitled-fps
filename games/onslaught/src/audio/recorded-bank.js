// Bounded, optional PCM sample playback. Shared decoded buffers; no fetches or
// decoding in the firing path. Failed clips fall back individually.
export class RecordedBank {
  constructor(ctx, dry, reverb, { capacity = 24, random = Math.random } = {}) {
    this.ctx = ctx;
    this.dry = dry;
    this.reverb = reverb;
    this.capacity = capacity;
    this.random = random;
    this.buffers = new Map();
    this.voices = new Set();
    this.retiring = new Set();
    this.last = new Map();
  }
  load(urls, fetcher = fetch) {
    if (this.loading) return this.loading;
    this.loading = this._load(urls, fetcher);
    return this.loading;
  }
  async _load(urls, fetcher) {
    const queue = Object.entries(urls);
    const results = [];
    const worker = async () => {
      while (queue.length) {
        const [key, url] = queue.shift();
        const controller = new AbortController();
        let timer;
        try {
          const deadline = new Promise((_, reject) => {
            timer = setTimeout(() => {
              controller.abort();
              reject(new Error("audio timeout"));
            }, 8000);
          });
          const decode = (async () => {
            const response = await fetcher(url, { signal: controller.signal });
            if (!response.ok) throw new Error(`audio ${response.status}`);
            const bytes = await response.arrayBuffer();
            if (bytes.byteLength > 512 * 1024)
              throw new Error("audio size budget");
            return this.ctx.decodeAudioData(bytes);
          })();
          const buffer = await Promise.race([decode, deadline]);
          if (buffer.duration > 3 || ![1, 2].includes(buffer.numberOfChannels))
            throw new Error("audio decode budget");
          this.buffers.set(key, buffer);
          results.push({ key, loaded: true });
        } catch (error) {
          results.push({ key, loaded: false, reason: String(error) });
        } finally {
          clearTimeout(timer);
        }
      }
    };
    await Promise.all([worker(), worker()]);
    return results;
  }
  has(keys) {
    return keys.some((key) => this.buffers.has(key));
  }
  play(
    keys,
    {
      gain = 1,
      pan = 0,
      rate = 1,
      lowpass = 18000,
      delay = 0,
      send = 0.08,
      priority = 1,
      group = keys.join(","),
      groupLimit = this.capacity,
    } = {},
  ) {
    const available = keys.filter((key) => this.buffers.has(key));
    if (!available.length) return false;
    // Inaudible and culled sounds are handled, not synthesized as a fallback.
    if (gain < 0.005 || this.ctx.state === "closed") return true;
    let choices = available.filter((key) => key !== this.last.get(group));
    if (!choices.length) choices = available;
    const key = choices[Math.floor(this.random() * choices.length)];
    this.last.set(group, key);
    // Keep the last shot's authored tail, but fade the oldest overlapping
    // reports during automatic fire. A full burst must not become a tail cloud.
    const siblings = [...this.voices].filter((voice) => voice.group === group);
    if (siblings.length >= Math.max(1, groupLimit)) {
      const oldestLowest = siblings.reduce((a, b) =>
        b.priority < a.priority ? b : a,
      );
      if (oldestLowest.priority > priority) return true;
      this._retire(oldestLowest);
    }
    if (this.voices.size >= this.capacity) {
      let victim;
      for (const voice of this.voices)
        if (!victim || voice.priority < victim.priority) victim = voice;
      if (victim.priority > priority) return true;
      this._retire(victim);
    }
    const ctx = this.ctx,
      time = ctx.currentTime + Math.max(0, delay);
    const source = ctx.createBufferSource(),
      envelope = ctx.createGain();
    const filter = ctx.createBiquadFilter(),
      panner = ctx.createStereoPanner();
    const reverbSend = ctx.createGain();
    const nodes = [source, envelope, filter, panner, reverbSend];
    const buffer = this.buffers.get(key);
    rate = Math.max(0.5, Math.min(2, rate));
    const duration = buffer.duration / rate;
    source.buffer = buffer;
    source.playbackRate.value = rate;
    filter.type = "lowpass";
    filter.frequency.value = Math.max(200, Math.min(18000, lowpass));
    filter.Q.value = 0.5;
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    envelope.gain.setValueAtTime(gain, time);
    envelope.gain.setValueAtTime(gain, time + Math.max(0, duration - 0.02));
    envelope.gain.linearRampToValueAtTime(0, time + duration);
    reverbSend.gain.value = send;
    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(panner);
    panner.connect(this.dry);
    panner.connect(reverbSend);
    reverbSend.connect(this.reverb);
    let cleaned = false;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      this.voices.delete(voice);
      this.retiring.delete(voice);
      for (const node of nodes) node.disconnect();
    };
    const voice = {
      priority,
      group,
      stop: () => {
        source.stop();
        cleanup();
      },
      fade: () => {
        const now = ctx.currentTime;
        const value = envelope.gain.value;
        envelope.gain.cancelScheduledValues(now);
        envelope.gain.setValueAtTime(value, now);
        envelope.gain.linearRampToValueAtTime(0, now + 0.012);
        source.stop(now + 0.014);
      },
    };
    source.onended = cleanup;
    this.voices.add(voice);
    source.start(time);
    source.stop(time + duration);
    return true;
  }
  stop() {
    for (const voice of [...this.voices, ...this.retiring]) voice.stop();
  }
  _retire(voice) {
    // At most four extra sources can be fading out for 14 ms.
    if (this.retiring.size >= 4) this.retiring.values().next().value.stop();
    this.voices.delete(voice);
    this.retiring.add(voice);
    voice.fade();
  }
}
