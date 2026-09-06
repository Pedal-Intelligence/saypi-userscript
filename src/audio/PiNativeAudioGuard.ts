/** Pi's speech endpoint is narrower than all media hosted on pi.ai. */
export function isPiNativeSpeechSource(source: string): boolean {
  try {
    const url = new URL(source);
    return url.origin === "https://pi.ai" && url.pathname === "/api/chat/voice";
  } catch {
    return false;
  }
}

export function audioSource(audio: HTMLAudioElement): string {
  return audio.currentSrc || audio.src || audio.querySelector("source")?.src || "";
}

/** Suppress native speech without taking ownership of other page media. */
export class PiNativeAudioGuard {
  private originalMute = new Map<HTMLAudioElement, boolean>();

  /** An explicit native choice supersedes a stale mute inherited at startup. */
  restoreNative(elements: HTMLAudioElement[]): void {
    for (const audio of elements) {
      if (audio.isConnected && isPiNativeSpeechSource(audioSource(audio))) {
        this.originalMute.delete(audio);
        audio.muted = false;
      }
    }
  }

  reconcile(elements: HTMLAudioElement[], state: {
    customVoice: boolean;
    offscreen: boolean;
    tracked: HTMLAudioElement | null;
    sharedOutput: HTMLAudioElement | null;
  }): void {
    const candidates = new Set([...elements, ...this.originalMute.keys()]);
    for (const audio of candidates) {
      const source = audioSource(audio);
      const native = isPiNativeSpeechSource(source);
      // The empty tracked player is SayPi's bootstrap placeholder. Additional
      // unknown players are classified when their real source starts loading.
      const shouldMute = state.customVoice && state.offscreen && audio.isConnected &&
        (native || (audio === state.tracked && !source));
      if (shouldMute) {
        if (!this.originalMute.has(audio)) this.originalMute.set(audio, audio.muted);
        audio.muted = true;
      } else if (this.originalMute.has(audio)) {
        audio.muted = this.originalMute.get(audio)!;
        this.originalMute.delete(audio);
      }
      // Shared-page playback (Firefox/Safari): pause only the native element,
      // never the shared custom player or the global offscreen output.
      if (state.customVoice && !state.offscreen && native && audio !== state.sharedOutput && !audio.paused) audio.pause();
    }
  }
}
