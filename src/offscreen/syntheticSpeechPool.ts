// DEV-only: the pool of pre-baked synthetic-speech clips a voice TURN can be fed
// when there's no human at the mic. One clip is chosen at random per turn so the
// transcript the real STT submits to the assistant varies run-to-run instead of
// repeating one canned line (and so it addresses the *assistant*, not the SayPi
// input layer). The clips are committed WAVs — CI can't synthesize speech — and
// are regenerated on macOS via `node scripts/generate-synthetic-speech.mjs`, which
// owns the phrase text. Keep this list in lock-step with that script's phrase
// count; `test/offscreen/syntheticSpeechPool.spec.ts` asserts every entry exists
// on disk.

/**
 * Extension-relative paths (resolve with `chrome.runtime.getURL` /
 * `getExtensionURL`) to the committed synthetic-speech clips. Numbered 01..NN to
 * match the generator's output order; entry 01 is also mirrored to the canonical
 * single-file fallbacks (`audio/synthetic-speech.wav`,
 * `e2e/fixtures/audio/speech-16k-mono.wav`).
 */
export const SYNTHETIC_SPEECH_CLIPS: readonly string[] = [
  "audio/synthetic-speech/01.wav",
  "audio/synthetic-speech/02.wav",
  "audio/synthetic-speech/03.wav",
  "audio/synthetic-speech/04.wav",
  "audio/synthetic-speech/05.wav",
  "audio/synthetic-speech/06.wav",
  "audio/synthetic-speech/07.wav",
  "audio/synthetic-speech/08.wav",
];

/**
 * Pick one clip from the pool. `rng` is injectable for deterministic tests;
 * defaults to `Math.random`. Returns an extension-relative WAV path.
 */
export function pickSyntheticSpeechClip(rng: () => number = Math.random): string {
  const index = Math.min(
    SYNTHETIC_SPEECH_CLIPS.length - 1,
    Math.max(0, Math.floor(rng() * SYNTHETIC_SPEECH_CLIPS.length)),
  );
  return SYNTHETIC_SPEECH_CLIPS[index];
}
