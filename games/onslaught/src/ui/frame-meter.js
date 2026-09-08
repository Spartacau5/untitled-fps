// Opt-in local diagnostic (?perf). No network telemetry or per-frame DOM writes.
export function frameSummary(samples) {
  const sorted = samples
    .filter((n) => n > 0 && Number.isFinite(n))
    .sort((a, b) => a - b);
  if (!sorted.length) return { fps: 0, p95: 0 };
  return {
    fps: 1000 / (sorted.reduce((a, b) => a + b, 0) / sorted.length),
    p95: sorted[Math.ceil(sorted.length * 0.95) - 1],
  };
}
export class FrameMeter {
  constructor() {
    this.samples = [];
    this.elapsed = 0;
    this.el = document.createElement("output");
    this.el.className = "frame-meter";
    this.el.setAttribute("aria-label", "Rendering performance");
    document.body.append(this.el);
  }
  sample(ms, info) {
    if (!(ms > 0) || document.hidden) return;
    this.samples.push(ms);
    if (this.samples.length > 120) this.samples.shift();
    this.elapsed += ms;
    if (this.elapsed < 500) return;
    this.elapsed = 0;
    const { fps, p95 } = frameSummary(this.samples);
    this.el.textContent = `${Math.round(fps)} FPS · P95 ${p95.toFixed(1)} ms · ${info.render.calls} draws · ${info.memory.textures} textures`;
  }
}
