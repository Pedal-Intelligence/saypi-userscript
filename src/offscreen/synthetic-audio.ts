// DEV-only: build a MediaStream from a bundled WAV so the VAD pipeline can be
// driven with no live microphone — the key to autonomous voice-turn verification
// in the founder's real browser (Layer 4) and the agent-launched real-host loop
// (Layer 3.5). The resulting stream is handed to MicVAD.new({ stream }), which
// then skips getUserMedia entirely (@ricky0123/vad-web RealTimeVADOptionsWithStream).
// Design: doc/specs/2026-06-20-autonomous-loop-self-reload-and-synthetic-audio-design.md
import { logger } from "../LoggingModule.js";

export interface SyntheticStreamOptions {
  /**
   * Loop the clip continuously (default FALSE = one-shot). One-shot is what you want
   * for a voice TURN: the clip plays once, then silence, so the VAD sees an
   * end-of-speech gap and `userStoppedSpeaking` fires → STT submits. With loop:true
   * the clip replays back-to-back with no trailing silence, so end-of-speech never
   * fires and nothing is transcribed (#349). Only set true for a continuous VAD
   * session that doesn't need a transcript.
   */
  loop?: boolean;
  /** Injectable for unit tests; defaults to the global AudioContext. */
  AudioContextClass?: typeof AudioContext;
  /** Injectable for unit tests; defaults to the global fetch. */
  fetchImpl?: typeof fetch;
}

/**
 * Decode `clipUrl` (an extension-relative WAV URL) and return a live MediaStream
 * carrying its audio, produced via a Web Audio graph
 * (AudioBufferSourceNode → MediaStreamAudioDestinationNode).
 */
export async function createSyntheticSpeechStream(
  clipUrl: string,
  opts: SyntheticStreamOptions = {},
): Promise<MediaStream> {
  const Ctx = opts.AudioContextClass ?? AudioContext;
  const doFetch = opts.fetchImpl ?? fetch;
  const ctx = new Ctx();
  const response = await doFetch(clipUrl);
  const encoded = await response.arrayBuffer();
  const buffer = await ctx.decodeAudioData(encoded);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = opts.loop ?? false;
  const destination = ctx.createMediaStreamDestination();
  source.connect(destination);
  // A freshly created AudioContext can be 'suspended' when there's no user gesture
  // (the offscreen document, and notably the real Layer-4 browser, which has no
  // --autoplay-policy override). Without resuming, the graph runs silently and the
  // VAD never fires. Resume before starting so the synthetic clip actually plays.
  await ctx.resume();
  source.start();
  logger.debug("[SayPi synthetic-audio] synthetic speech stream created", {
    loop: source.loop,
  });
  return destination.stream;
}

/**
 * Latch the offscreen VAD reads when (re)initializing. When `enabled`, the VAD is
 * fed `clipUrl` instead of the live microphone. Lives here (not in vad_handler) so
 * the decision stays unit-testable without importing onnxruntime-web.
 */
export interface SyntheticAudioLatch {
  enabled: boolean;
  clipUrl: string;
  loop: boolean;
}

/**
 * Pure decision used by `initializeVAD`: when the latch is on, build a synthetic
 * stream from its clip; otherwise return undefined so vad-web opens the mic.
 */
export async function resolveVadStream(
  latch: SyntheticAudioLatch,
  factory: typeof createSyntheticSpeechStream = createSyntheticSpeechStream,
): Promise<MediaStream | undefined> {
  if (!latch.enabled) return undefined;
  return factory(latch.clipUrl, { loop: latch.loop });
}
