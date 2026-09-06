import EventBus from "../events/EventBus";
import type { AudioProvider, MatchableVoice } from "../tts/SpeechModel";

export type AudioSelection = {
  provider: AudioProvider;
  voice: (MatchableVoice & { id: string }) | null;
};

/** The playback owner reads current state; events only tell it to read again. */
export class AudioSelectionSync {
  private revision = 0;
  private started = false;
  private nativeVoiceRequested = false;

  constructor(private readonly deps: {
    hostId: string;
    resolve: () => Promise<AudioSelection>;
    apply: (selection: AudioSelection, intent: { nativeVoiceRequested: boolean }) => void;
    onError: (error: unknown) => void;
  }) {}

  start(): Promise<void> {
    if (!this.started) {
      this.started = true;
      EventBus.on("userPreferenceChanged", (detail: {
        voicePreferences?: unknown;
        voiceId?: unknown;
        voiceChatbotId?: string;
        nativeVoiceRequested?: boolean;
      } | undefined) => {
        if (!detail || (detail.voicePreferences === undefined && detail.voiceId === undefined)) return;
        if (detail.voiceChatbotId && detail.voiceChatbotId !== this.deps.hostId) return;
        if (detail.nativeVoiceRequested) this.nativeVoiceRequested = true;
        else if (detail.voiceId != null) this.nativeVoiceRequested = false;
        void this.refresh();
      });
      EventBus.on("saypi:auth:status-changed", () => { void this.refresh(); });
    }
    // A provider notification sent before audio was ready cannot be replayed.
    // Resolve the saved choice after attaching, including on startup retries.
    return this.refresh();
  }

  private async refresh(): Promise<void> {
    const revision = ++this.revision;
    try {
      const selection = await this.deps.resolve();
      if (revision === this.revision) {
        const nativeVoiceRequested = this.nativeVoiceRequested;
        this.nativeVoiceRequested = false;
        this.deps.apply(selection, { nativeVoiceRequested });
      }
    } catch (error) {
      if (revision === this.revision) this.deps.onError(error);
    }
  }
}
