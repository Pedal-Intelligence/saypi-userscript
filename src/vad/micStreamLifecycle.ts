import { MicVAD, type RealTimeVADOptions } from "@ricky0123/vad-web";

/**
 * Audio ownership for MicVAD, shared by both VAD clients (offscreen `vad_handler.ts` and
 * in-page `OnscreenVADClient.ts`).
 *
 * vad-web 0.0.27 moved a lot into the library's first `start()`. In 0.0.24, `MicVAD.new()`
 * opened the mic, created the AudioContext and built the audio graph (worklet or
 * ScriptProcessor); `pause()`/`start()` only toggled frame processing; and the mic stayed
 * open until `destroy()`. From 0.0.27 on:
 *  - `pause()` stops the mic tracks and `start()` calls getUserMedia again;
 *  - the AudioContext and audio graph are built lazily by the first `start()`;
 *  - `new()` starts listening immediately unless `startOnLoad` is false.
 *
 * Taking those defaults would change the product. The conversation pauses the VAD while the
 * assistant speaks, so every turn would reopen the mic: a first-word clip while getUserMedia
 * settles, a flickering mic indicator, and on Firefox (in-page capture) possibly a permission
 * re-prompt per turn. A failure while building the graph would also surface on some later
 * start, and it leaves vad-web stuck in "initializing": later starts resolve as if they had
 * worked, and `destroy()` throws before it can release anything.
 *
 * So we keep 0.0.24's contract:
 *  - we open the mic and create the AudioContext ourselves at initialize (`openVadAudio`), so
 *    a permission error surfaces there and we can always close what we opened;
 *  - `createWarmMicVad` runs one start→pause at initialize, so the graph is built (and any
 *    failure reported) there, and each later start only reconnects the held stream;
 *  - `pauseStream`/`resumeStream` keep that same stream open across pause/resume;
 *  - `releaseVadAudio` stops the tracks and closes the context on destroy (vad-web does
 *    neither for a stream and context it didn't create).
 */

/** The constraints vad-web has always requested: mono, with the browser's voice processing on. */
export const MIC_CONSTRAINTS: MediaStreamConstraints = {
  audio: {
    channelCount: 1,
    echoCancellation: true,
    autoGainControl: true,
    noiseSuppression: true,
  },
};

/** The mic (or DEV synthetic) stream and the AudioContext a MicVAD runs on. */
export interface VadAudio {
  stream: MediaStream;
  audioContext: AudioContext;
}

/**
 * Open the mic, or adopt `stream` (the DEV synthetic source), and create the AudioContext.
 * If creating the context fails, a mic we opened is released.
 */
export async function openVadAudio(stream?: MediaStream): Promise<VadAudio> {
  const held = stream ?? (await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS));
  try {
    return { stream: held, audioContext: new AudioContext() };
  } catch (error) {
    if (!stream) releaseTracks(held);
    throw error;
  }
}

/** MicVAD options that run on `audio` and hold its stream open (see module doc). */
export function heldAudioOptions(
  audio: VadAudio
): Pick<RealTimeVADOptions, "startOnLoad" | "audioContext" | "getStream" | "pauseStream" | "resumeStream"> {
  return {
    startOnLoad: false,
    audioContext: audio.audioContext,
    getStream: async () => audio.stream,
    pauseStream: async () => {},
    resumeStream: async () => audio.stream,
  };
}

/**
 * `MicVAD.new` on `audio`, followed by one start→pause so the audio graph is built now, as
 * `new()` did in 0.0.24, rather than on the first real `start()`. The instance comes back
 * paused. If warming fails, the instance is destroyed and the error rethrown; `audio` stays
 * the caller's to release.
 */
export async function createWarmMicVad(
  options: Partial<RealTimeVADOptions>,
  audio: VadAudio
): Promise<MicVAD> {
  const vad = await MicVAD.new({ ...options, ...heldAudioOptions(audio) });
  try {
    await vad.start();
    await vad.pause();
  } catch (error) {
    await destroyMicVad(vad);
    throw error;
  }
  return vad;
}

/** Stop the tracks and close the AudioContext. Safe to call with null. */
export function releaseVadAudio(audio: VadAudio | null | undefined): void {
  if (!audio) return;
  releaseTracks(audio.stream);
  void audio.audioContext.close().catch(() => {});
}

function releaseTracks(stream: MediaStream): void {
  stream.getTracks().forEach((track) => track.stop());
}

/**
 * `MicVAD.destroy()` is async since 0.0.29 and rejects if the audio graph was never built.
 * Teardown must not throw either way.
 */
export async function destroyMicVad(vad: MicVAD, onError?: (error: unknown) => void): Promise<void> {
  try {
    await vad.destroy();
  } catch (error) {
    onError?.(error);
  }
}
