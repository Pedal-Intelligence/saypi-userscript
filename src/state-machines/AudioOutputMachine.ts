import { setup, assign } from "xstate";
import EventBus from "../events/EventBus.js";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  PiSpeechSourceParser,
  SayPiSpeechSourceParser,
  isVoiceSampleUrl,
} from "../tts/SpeechSourceParsers";
import {
  AudioProvider,
  audioProviders,
  MatchableVoice,
  SpeechUtterance,
} from "../tts/SpeechModel";

type LoadstartEvent = { type: "loadstart"; source: string };
type PlayEvent = { type: "play"; source: string };
type SourcedPlaybackEvent = LoadstartEvent | PlayEvent; // { type: string; source: string };
type ChangeProviderEvent = {
  type: "changeProvider";
  provider: AudioProvider; // default or custom provider
};
type ChangeVoiceEvent = {
  type: "changeVoice";
  voice: MatchableVoice | null;
};
type ReplayingAudioEvent = { type: "replaying" };
// A free canned voice-sample audition (design §4). Deliberately carries a
// `source` that mismatches the selected voice/provider; the `preview`
// transition arms `replaying` so `shouldSkip` lets it through.
type PreviewEvent = { type: "preview"; source: string };
// Call-boundary signals (from ConversationMachine's session:* events) that gate
// previews out of an active call even between utterances (idle-but-in-a-call).
type CallStartedEvent = { type: "callStarted" };
type CallEndedEvent = { type: "callEnded" };
type AudioOutputEvent =
  | LoadstartEvent
  | { type: "skipNext" }
  | { type: "loadedmetadata" }
  | PlayEvent
  | { type: "pause" }
  | { type: "ended" }
  | { type: "canplaythrough" }
  | { type: "seeked" }
  | { type: "emptied" }
  | ChangeProviderEvent
  | ChangeVoiceEvent
  | ReplayingAudioEvent
  | PreviewEvent
  | CallStartedEvent
  | CallEndedEvent;

type AudioOutputContext = {
  skip: boolean;
  autoplay: boolean;
  replaying: boolean;
  provider: AudioProvider;
  voice: MatchableVoice | null;
  // True while a voice call is live. A preview must never talk over a call, so
  // it is refused while this is set even though the machine may be idle between
  // the call's own utterances.
  callActive: boolean;
};

export const audioOutputMachine = setup({
  types: {
    context: {} as AudioOutputContext,
    events: {} as AudioOutputEvent,
  },
  actions: {
    // v5: context is updated via assign (immutably) rather than mutating the
    // shared definition context in place, so each interpreted actor is isolated.
    setProvider: assign({
      provider: ({ event }) => (event as ChangeProviderEvent).provider,
    }),
    setVoice: assign({
      voice: ({ event }) => (event as ChangeVoiceEvent).voice,
    }),
    setReplaying: assign({
      replaying: true,
    }),
    clearReplaying: assign({
      replaying: false,
    }),
    clearSkip: assign({
      skip: false,
    }),
    setSkip: assign({
      skip: true,
    }),
    setCallActive: assign({
      callActive: true,
    }),
    clearCallActive: assign({
      callActive: false,
    }),
    // Kick the actual load on the same channel live TTS uses. The real
    // <audio> `loadstart` then advances the machine (rest -> loading);
    // `replaying` (armed by the preview transition) keeps the mismatched
    // sample from being skipped. This reuses the machine-wide `replaying`
    // exemption, which assumes the NEXT loadstart is this preview's own — safe
    // because a preview is only reachable from a resting state (nothing else is
    // loading a track to race it), and `loading.entry` clears the flag at once.
    startPreview: ({ event }) => {
      EventBus.emit("audio:load", { url: (event as PreviewEvent).source });
    },
    emitEvent: (_, params: { eventName: string }) => {
      EventBus.emit(params.eventName);
    },
    skipCurrent: ({ context, event }) => {
      // send a message back to the audio module to stop playback
      EventBus.emit("audio:skipCurrent");
      const source = (event as LoadstartEvent).source;
      console.log(
        `Audio is provided by ${context.provider.name}. Skipping current audio track ${source}`
      );
    },
    notifySpeechStart: ({ event }) => {
      const source = (event as LoadstartEvent).source;
      getSpeechFromAudioSource(source).then((speech) => {
        if (speech) {
          EventBus.emit("saypi:tts:speechStreamStarted", speech);
          console.debug(
            `Pi started speaking as ${speech.voice.name} by ${speech.voice.powered_by}`
          );
        }
      });
    },
  },
  guards: {
    notCallActive: ({ context }) => !context.callActive,
    shouldSkip: ({ context, event }) => {
      const shouldSkip = context.skip === true;

      if (event.type === "loadstart" || event.type === "play") {
        const sourcedEvent = event as SourcedPlaybackEvent;
        const src = sourcedEvent.source;
        // If no source URL is available (e.g., WebRTC/MediaStream via srcObject),
        // never skip based on provider/voice matching. Allow native playback.
        if (!src || typeof src !== "string" || src.trim() === "") {
          return shouldSkip; // only honor explicit skip flag
        }

        const isNotReplaying = !context.replaying;
        const isVoiceMismatch =
          context.voice && !context.voice.matchesSource(src);
        const isProviderMismatch = !context.provider.matches(src);
        const isSourceMismatch = isVoiceMismatch || isProviderMismatch;

        return (isNotReplaying && isSourceMismatch) || shouldSkip;
      }

      return shouldSkip;
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EDEAxgBbIB2MACgE5YBuGEYDA2gAwC6ioQllgZ82agJAAPRAA4ATAGYAdAHZVigCwBObZvn7Zs1QBoQAT0QBGeQF9bZtJlwFi+ZWwA2YEp6zIIWHxkBnwefiQQIRExLAlImQRZADZlXXSMzLNLBEUrbjT5ZPljG2L5KwBWSvtHdGw8IgIPCG9ff0Dg0M4rCMFhUXFJRJLtZWKdXS1NYx1NbMRNVVllTSqU+XluTUq17VqQJwbXZq8fWABrDEIAOTApML5JaMG44cRdZW5lm21Kv8q3BSigWCCsCjSGisilU2isyWS1SsByOLia7j8AQwtHaAUgAFswMEIMhguFngNYvFQIl4WNKoptNxEaoDNtZIpkqD8txKqtdEVtKpkrJNIjkQ5DvU0W5lJj2BASGB8YQxJByZEXlT3ghkqYLHI9V8FJVVNxNjZFJsUdLGrL5ZBlAwwAFzCRCJ5kOYNf0YkMEnJll8zfJtEpKqLiiCDUkw-yw0zedxdKobc47c0HRBlB6vdioO60LAwD6opT-TTrFZVJplIpKlVVPlOVUGaDtPW1EztCKDFYU7I08d0XKOo7c+Z80rqArS1qK9IqzW6w3Tc3kq3ozltCllKHk7IG7JkzYapLURmMWPsxOp2QaBP8BQmKgoBQ5+W3gGEEKxgZ0huEaMvWoIKAUaz-EUEY7qKihDjKmbXjmRaQO6nrek8mqftSi5gmK8jKPkVS6EsyScvMMZGHy+5-NC3CKECihweetonFeeLZmAM6ocWYAXOqmG+q8OG0tWtb1o266bty2wEfCyT0WGmwwqa9iStQWDsPAkQXmxFJ+l+lZ4e2fJLHkEGaIxzJnnU6ZsS03j6cJOplMolTFICViWfRpqHqCSwFBy8iVEU7K8humjwZeo5YrQTnat+xQybyaQCskQoimKDZRfZWbxQuiRMSo3z0SUwp6Ka1SghoBFwhGsJeVo7nJDlI5Zk6LoQDkQkJUZiiyFYwalcY6U7KoVWUSKqzERueoKRoNlSnZbVIbecVYQZIkfE2dZbKGwrBfRnKgeNaTEZo9ZlTBrX2qtKEQPlhm4a2fISXqJQwt8W5yB2yizGVOx-OlN2IRxyhcQqj1bWC1SvQ270cmaGjtsKajfHN6Mhsx9hAA */
  context: {
    skip: false,
    autoplay: false,
    replaying: false,
    provider: audioProviders.getDefault(),
    voice: null,
    callActive: false,
  },
  id: "audioOutput",
  initial: "idle",
  on: {
    changeProvider: {
      actions: "setProvider",
    },
    changeVoice: {
      actions: "setVoice",
    },
    replaying: {
      actions: "setReplaying",
    },
    callStarted: {
      actions: "setCallActive",
    },
    callEnded: {
      actions: "clearCallActive",
    },
  },
  states: {
    idle: {
      on: {
        loadstart: [
          {
            target: "idle",
            guard: "shouldSkip",
            description: `Skip this track.`,
            actions: ["clearSkip", "skipCurrent"],
          },
          {
            target: "loading",
          },
        ],
        play: [
          {
            target: "idle",
            guard: "shouldSkip",
            description: `Skip this track when play is requested of an already loaded track. (navigation from another page to talk page)`,
            actions: ["clearSkip", "skipCurrent"],
          },
          {
            target: "loading",
          },
        ],
        skipNext: {
          target: "idle",
          description: `Do not play the next track.`,
          actions: "setSkip",
        },
        // A preview is allowed from every RESTING state — idle here, plus the
        // non-playing `loaded` substates (ready/paused/ended below). It is
        // deliberately ABSENT from `loading` and `loaded.playing`, where the
        // event is unhandled and dropped, so a preview can never talk over
        // audio that is loading or playing. `notCallActive` closes the
        // resting-but-in-a-call gap. Internal (no target): the ensuing real
        // `loadstart` advances the machine, exempted from shouldSkip by the
        // armed `replaying` flag; `clearSkip` stops a lingering skip (armed to
        // suppress Pi auto-play) from swallowing an intentional audition.
        preview: {
          guard: "notCallActive",
          actions: ["clearSkip", "setReplaying", "startPreview"],
        },
      },
    },
    loading: {
      entry: ["notifySpeechStart", "clearReplaying"],
      on: {
        loadedmetadata: {
          target: "loaded",
        },
      },
    },
    loaded: {
      initial: "ready",
      states: {
        ready: {
          description:
            "Audio has loaded and is ready to start playing (further buffering may be required to reach the end).",
          entry: {
            type: "emitEvent",
            params: {
              eventName: "saypi:ready",
            },
          },
          on: {
            play: {
              target: "playing",
            },
            // Resting state (loaded, not yet playing) — allow previews. See idle.
            preview: {
              guard: "notCallActive",
              actions: ["clearSkip", "setReplaying", "startPreview"],
            },
          },
        },
        playing: {
          entry: {
            type: "emitEvent",
            params: {
              eventName: "saypi:piSpeaking",
            },
          },
          exit: {
            type: "emitEvent",
            params: {
              eventName: "saypi:piStoppedSpeaking",
            },
          },
          on: {
            pause: {
              target: "paused",
            },
            ended: {
              target: "ended",
            },
            canplaythrough: {},
          },
        },
        paused: {
          on: {
            play: [
              {
                target: "paused",
                guard: "shouldSkip",
                actions: ["clearSkip", "skipCurrent"],
              },
              {
                target: "playing",
              },
            ],
            // A paused reply is not audible — allow previews (and the intro on a
            // mid-turn voice change). Otherwise pausing TTS would dead-end the
            // voice menu. See idle.
            preview: {
              guard: "notCallActive",
              actions: ["clearSkip", "setReplaying", "startPreview"],
            },
          },
        },
        ended: {
          entry: {
            type: "emitEvent",
            params: {
              eventName: "saypi:piFinishedSpeaking",
            },
          },
          on: {
            seeked: {
              target: "ready",
              description:
                "An ended track is seeked back to earlier in the track.",
            },
            // A finished track parks the machine here (not idle), so a preview
            // must also be reachable from `ended` — otherwise the SECOND ▶ tap
            // (or the first tap after a TTS reply ends) would be silently
            // dropped and the menu would look broken. Same guard/actions as
            // idle; nothing is audible in `ended`, so it never double-talks.
            preview: {
              guard: "notCallActive",
              actions: ["clearSkip", "setReplaying", "startPreview"],
            },
          },
        },
      },
      on: {
        emptied: {
          target: "idle",
        },
      },
    },
  },
});

async function getSpeechFromAudioSource(
  source: string
): Promise<SpeechUtterance | null> {
  try {
    if (audioProviders.Pi.matches(source)) {
      const userPreferences = UserPreferenceModule.getInstance();
      const userLang = await userPreferences.getLanguage();
      return new PiSpeechSourceParser(userLang).parse(source);
    } else if (audioProviders.SayPi.matches(source)) {
      // A canned preview clip (…/voices/<id>/sample) is a static audio file with
      // no transcript — not a streaming-speech source. The `audioProviders.SayPi`
      // gate matches by hostname alone, so it also catches these; skip resolution
      // silently rather than let the stream parser throw "is not a streaming
      // speech URL" and log a spurious error on every ▶ preview / voice audition.
      if (isVoiceSampleUrl(source)) return null;
      return await new SayPiSpeechSourceParser(
        SpeechSynthesisModule.getInstance()
      ).parse(source);
    }
  } catch (error) {
    console.error(
      `Failed to get speech from audio source: ${(error as Error).message}`
    );
  }
  return null;
}
