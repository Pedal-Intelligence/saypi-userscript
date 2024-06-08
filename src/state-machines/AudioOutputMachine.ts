import { createMachine, assign, actions } from "xstate";
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
  SpeechUtterance,
} from "../tts/SpeechModel";
const { log } = actions;

type LoadstartEvent = { type: "loadstart"; source: string };
type ChangeProviderEvent = {
  type: "changeProvider";
  provider: AudioProvider; // default or custom provider
};
type ReplayingAudioEvent = { type: "replaying" };
type AudioOutputEvent =
  | LoadstartEvent
  | { type: "skipNext" }
  | { type: "loadedmetadata" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "ended" }
  | { type: "canplaythrough" }
  | { type: "seeked" }
  | { type: "emptied" }
  | ChangeProviderEvent
  | ReplayingAudioEvent;
export const audioOutputMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EDEAxgBbIB2MACgE5YBuGEYDA2gAwC6ioQllgZ82agJAAPRAA4ATAGYAdAHZVigCwBObZvn7Zs1QBoQAT0QBGeQF9bZtJlwFi+ZWwA2YEp6zIIWHxkBnwefiQQIRExLAlImQRZADZlXXSMzLNLBEUrbjT5ZPljG2L5KwBWSvtHdGw8IgIPCG9ff0Dg0M4rCMFhUXFJRJLtZWKdXS1NYx1NbMRNVVllTSqU+XluTUq17VqQJwbXZq8fWABrDEIAOTApML5JaMG44cRdZW5lm21Kv8q3BSigWCCsCjSGisilU2isyWS1SsByOLia7j8AQwtHaAUgAFswMEIMhguFngNYvFQIl4WNKoptNxEaoDNtZIpkqD8txKqtdEVtKpkrJNIjkQ5DvU0W5lJj2BASGB8YQxJByZEXlT3ghkqYLHI9V8FJVVNxNjZFJsUdLGrL5ZBlAwwAFzCRCJ5kOYNf0YkMEnJll8zfJtEpKqLiiCDUkw-yw0zedxdKobc47c0HRBlB6vdioO60LAwD6opT-TTrFZVJplIpKlVVPlOVUGaDtPW1EztCKDFYU7I08d0XKOo7c+Z80rqArS1qK9IqzW6w3Tc3kq3ozltCllKHk7IG7JkzYapLURmMWPsxOp2QaBP8BQmKgoBQ5+W3gGEEKxgZ0huEaMvWoIKAUaz-EUEY7qKihDjKmbXjmRaQO6nrek8mqftSi5gmK8jKPkVS6EsyScvMMZGHy+5-NC3CKECihweetonFeeLZmAM6ocWYAXOqmG+q8OG0tWtb1o266bty2wEfCyT0WGmwwqa9iStQWDsPAkQXmxFJ+l+lZ4e2fJLHkEGaIxzJnnU6ZsS03j6cJOplMolTFICViWfRpqHqCSwFBy8iVEU7K8humjwZeo5YrQTnat+xQybyaQCskQoimKDZRfZWbxQuiRMSo3z0SUwp6Ka1SghoBFwhGsJeVo7nJDlI5Zk6LoQDkQkJUZiiyFYwalcY6U7KoVWUSKqzERueoKRoNlSnZbVIbecVYQZIkfE2dZbKGwrBfRnKgeNaTEZo9ZlTBrX2qtKEQPlhm4a2fISXqJQwt8W5yB2yizGVOx-OlN2IRxyhcQqj1bWC1SvQ270cmaGjtsKajfHN6Mhsx9hAA */
    context: {
      skip: false,
      autoplay: false,
      replaying: false,
      provider: audioProviders.Pi,
    },
    id: "audioOutput",
    initial: "idle",
    on: {
      changeProvider: {
        internal: true,
        actions: assign((context, event) => {
          return {
            ...context,
            provider: event.provider,
          };
        }),
      },
      replaying: {
        internal: true,
        actions: assign((context, event) => {
          return {
            ...context,
            replaying: true,
          };
        }),
      },
    },
    states: {
      idle: {
        on: {
          loadstart: [
            {
              target: "idle",
              cond: "shouldSkip",
              internal: true,
              description: `Skip this track.`,
              actions: [
                assign((context, event) => {
                  return {
                    ...context,
                    skip: false,
                  };
                }),
                {
                  type: "skipCurrent",
                },
              ],
            },
            {
              target: "loading",
            },
          ],
          skipNext: {
            target: "idle",
            internal: true,
            description: `Do not play the next track.`,
            actions: assign((context, event) => {
              return {
                ...context,
                skip: true,
              };
            }),
          },
        },
      },
      loading: {
        entry: [
          { type: "notifySpeechStart" },
          assign((context, event) => {
            return {
              ...context,
              replaying: false,
            };
          }),
        ],
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
              canplaythrough: {
                internal: true,
              },
            },
          },
          paused: {
            on: {
              play: {
                target: "playing",
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
    schema: {
      events: {} as AudioOutputEvent,
      context: {} as {
        skip: boolean;
        autoplay: boolean;
        replaying: boolean;
        provider: AudioProvider;
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      emitEvent: (context, event, { action }) => {
        EventBus.emit(action.params.eventName);
      },
      skipCurrent: (context, event) => {
        // send a message back to the audio module to stop playback
        EventBus.emit("audio:skipCurrent");
        console.log("Skipping current audio track.");
      },
      notifySpeechStart: (context, event: LoadstartEvent) => {
        const speech = getSpeechFromAudioSource(event.source).then((speech) => {
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
      shouldSkip: (context, event: AudioOutputEvent) => {
        const shouldSkip = context.skip === true;

        if (event.type === "loadstart") {
          event = event as LoadstartEvent;

          const isNotReplaying = !context.replaying;
          const isSourceMismatch = !context.provider.matches(event.source);

          return (isNotReplaying && isSourceMismatch) || shouldSkip;
        }

        return shouldSkip;
      },
    },
    services: {},
    delays: {},
  }
);

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
