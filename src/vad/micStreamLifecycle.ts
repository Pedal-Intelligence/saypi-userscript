import type { MicVAD, RealTimeVADOptions } from "@ricky0123/vad-web";

/**
 * Microphone ownership for MicVAD, shared by both VAD clients (offscreen `vad_handler.ts`
 * and in-page `OnscreenVADClient.ts`).
 *
 * vad-web 0.0.27 changed who owns the mic. In 0.0.24, `MicVAD.new()` opened the mic and the
 * audio graph, `pause()`/`start()` only toggled frame processing, and the mic stayed open
 * until `destroy()`. From 0.0.27 on, `pause()` stops the mic tracks and `start()` calls
 * `getUserMedia` again, and `new()` starts listening immediately unless `startOnLoad` is
 * false.
 *
 * Adopting that would change the product. The conversation pauses the VAD while the
 * assistant speaks, so every turn would re-open the mic: a first-word clip while
 * getUserMedia settles, a flickering mic indicator, and on Firefox (in-page capture) a
 * possible permission re-prompt per turn. So we keep 0.0.24's contract:
 *
 *  - we open the mic ourselves at initialize, so a permission error still surfaces there;
 *  - `pauseStream`/`resumeStream` keep that same stream open across pause/resume;
 *  - `startOnLoad: false`, so nothing is processed before the client's `start()`;
 *  - the client stops the tracks on destroy (vad-web no longer does, because the stream is
 *    ours).
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

export function openMicStream(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);
}

/** MicVAD options that hold `stream` open for the VAD's lifetime (see module doc). */
export function heldStreamOptions(
  stream: MediaStream
): Pick<RealTimeVADOptions, "startOnLoad" | "getStream" | "pauseStream" | "resumeStream"> {
  return {
    startOnLoad: false,
    getStream: async () => stream,
    pauseStream: async () => {},
    resumeStream: async () => stream,
  };
}

export function releaseMicStream(stream: MediaStream | null | undefined): void {
  stream?.getTracks().forEach((track) => track.stop());
}

/**
 * `MicVAD.destroy()` is async since 0.0.29 and rejects if the VAD was never started (it
 * reads audio nodes that only exist after `start()`). Teardown must not throw either way.
 */
export async function destroyMicVad(vad: MicVAD, onError?: (error: unknown) => void): Promise<void> {
  try {
    await vad.destroy();
  } catch (error) {
    onError?.(error);
  }
}
