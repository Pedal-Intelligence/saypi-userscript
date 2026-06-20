// DEV-only: build a MediaStream from a bundled WAV so the VAD pipeline can be
// driven with no live microphone — the key to autonomous voice-turn verification
// in the founder's real browser (Layer 4) and the agent-launched real-host loop
// (Layer 3.5). The resulting stream is handed to MicVAD.new({ stream }), which
// then skips getUserMedia entirely (@ricky0123/vad-web RealTimeVADOptionsWithStream).
// Design: doc/specs/2026-06-20-autonomous-loop-self-reload-and-synthetic-audio-design.md
import { logger } from "../LoggingModule.js";

export interface SyntheticStreamOptions {
  /** Loop the clip for a continuous VAD session (default true). */
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
  source.loop = opts.loop ?? true;
  const destination = ctx.createMediaStreamDestination();
  source.connect(destination);
  source.start();
  logger.debug("[SayPi synthetic-audio] synthetic speech stream created", {
    loop: source.loop,
  });
  return destination.stream;
}
