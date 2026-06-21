import { setup, assign } from "xstate";
import EventBus from "../events/EventBus.js";
import { SpeechSynthesisModule } from "../tts/SpeechSynthesisModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  PiSpeechSourceParser,
  SayPiSpeechSourceParser,
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
  | ReplayingAudioEvent;

type AudioOutputContext = {
  skip: boolean;
  autoplay: boolean;
  replaying: boolean;
  provider: AudioProvider;
  voice: MatchableVoice | null;
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
