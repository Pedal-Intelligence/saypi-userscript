import { createMachine, assign } from "xstate";

const EventBus = window.EventBus;

export const audioOutputMachine = createMachine(
  {
    context: {
      autoplay: false,
    },
    id: "audioOutput",
    initial: "idle",
    states: {
      idle: {
        on: {
          loadstart: {
            target: "loading",
          },
        },
      },
      loading: {
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
            exit: [
              {
                type: "emitEvent",
                params: {
                  eventName: "saypi:piStoppedSpeaking",
                },
              },
            ],
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
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      emitEvent: (context, event, { action }) => {
        EventBus.emit(action.params.eventName);
      },
    },
    guards: {},
    services: {},
    delays: {},
  }
);
