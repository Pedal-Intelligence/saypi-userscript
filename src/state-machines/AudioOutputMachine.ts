import { createMachine, assign, actions } from "xstate";
import EventBus from "../events/EventBus.js";
import { ConnectableObservable } from "rxjs";
const { log } = actions;

type LoadstartEvent = { type: "loadstart"; source: string };
type ChangeProviderEvent = {
  type: "changeProvider";
  provider: "pi.ai" | string; // default or custom provider
};
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
  | ChangeProviderEvent;
export const audioOutputMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EDEAxgBbIB2MACgE5YBuGEYDA2gAwC6ioQllgZ82agJAAPRAA4ATAGYAdAHZVigCwBObZvn7Zs1QBoQAT0QBGeQF9bZtJlwFi+ZWwA2YEp6zIIWHxkBnwefiQQIRExLAlImQRZADZlXXSMzLNLBEUrbjT5ZPljG2L5KwBWSvtHdGw8IgIPCG9ff0Dg0M4rCMFhUXFJRJLtZWKdXS1NYx1NbMRNVVllTSqU+XluTUq17VqQJwbXZq8fWABrDEIAOTApML5JaMG44cRdZW5lm21Kv8q3BSigWCCsCjSGisilU2isyWS1SsByOLia7j8AQwtHaAUgAFswMEIMhguFngNYvFQIl4WNKoptNxEaoDNtZIpkqD8txKqtdEVtKpkrJNIjkQ5DvU0W5lJj2BASGB8YQxJByZEXlT3ghkqYLHI9V8FJVVNxNjZFJsUdLGrL5ZBlAwwAFzCRCJ5kOYNf0YkMEnJll8zfJtEpKqLiiCDUkw-yw0zedxdKobc47c0HRBlB6vdioO60LAwD6opT-TTrFZVJplIpKlVVPlOVUGaDtPW1EztCKDFYU7I08d0XKOo7c+Z80rqArS1qK9IqzW6w3Tc3kq3ozltCllKHk7IG7JkzYapLURmMWPsxOp2QaBP8BQmKgoBQ5+W3gGEEKxgZ0huEaMvWoIKAUaz-EUEY7qKihDjKmbXjmRaQO6nrek8mqftSi5gmK8jKPkVS6EsyScvMMZGHy+5-NC3CKECihweetonFeeLZmAM6ocWYAXOqmG+q8OG0tWtb1o266bty2wEfCyT0WGmwwqa9iStQWDsPAkQXmxFJ+l+lZ4e2fJLHkEGaIxzJnnU6ZsS03j6cJOplMolTFICViWfRpqHqCSwFBy8iVEU7K8humjwZeo5YrQTnat+xQybyaQCskQoimKDZRfZWbxQuiRMSo3z0SUwp6Ka1SghoBFwhGsJeVo7nJDlI5Zk6LoQDkQkJUZiiyFYwalcY6U7KoVWUSKqzERueoKRoNlSnZbVIbecVYQZIkfE2dZbKGwrBfRnKgeNaTEZo9ZlTBrX2qtKEQPlhm4a2fISXqJQwt8W5yB2yizGVOx-OlN2IRxyhcQqj1bWC1SvQ270cmaGjtsKajfHN6Mhsx9hAA */
    context: {
      skip: false,
      autoplay: false,
      provider: "pi.ai",
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
        entry: log(
          (context, event: LoadstartEvent) => `Loading ${event.source}`
        ),
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
      context: {} as { skip: boolean; autoplay: boolean; provider: string },
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
    },
    guards: {
      shouldSkip: (context, event: AudioOutputEvent) => {
        if (event.type === "loadstart") {
          event = event as LoadstartEvent;

          return (
            !audioSourcedFromProvider(event, context.provider) ||
            context.skip === true
          );
        }
        return context.skip === true;
      },
    },
    services: {},
    delays: {},
  }
);
function audioSourcedFromProvider(
  loadstart: LoadstartEvent,
  audioProvider: string
): boolean {
  const domain = new URL(loadstart.source).hostname;
  const match = domain === audioProvider;
  if (!match) {
    console.log(
      `Audio source: ${domain}, Audio provider: ${audioProvider}, skipping.`
    );
  }
  return match;
}
