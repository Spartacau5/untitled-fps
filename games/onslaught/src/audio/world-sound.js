// Reuse main's unchanged sound definitions for v6-only bot events.
// A per-event receiver keeps distance/pan and gun voice gain off the player.
export function playWorldSound(audio, position, method, args = [], level = 1) {
  if (!audio.ready) return;
  const { gain, pan } = audio.spatial([position.x, position.y, position.z], 3, 45);
  const volume = gain * level;
  if (volume < 0.005) return;
  const voice = Object.create(audio);
  voice.voiceGain = 1;
  voice._voice = function (time, duration, source, options) {
    return audio._voice.call(this, time, duration, source, {
      ...options, gain: (options.gain ?? 1) * volume, pan,
    });
  };
  voice[method](...args);
}
