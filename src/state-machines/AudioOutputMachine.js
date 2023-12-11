import { createMachine, assign } from "xstate";
import EventBus from "../EventBus.js";

export const audioOutputMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7A8qgLgA4EB0GEANmAMQVbISz7IBO+A2gAwC6iohWWBnzYAdnxAAPRAEYAHAFYSANmWdOygEzyALAE5NAZk4KANCACeswzpIyZehcoU6dAdmP2dAX2-m0mLgExPgkdAwYolC09BCQALZgzBDIzFy8SCACQiJY4pnSCAqa5lYIbpp6JIY1NW7KDoYylb7+6Nh4RKThcRDUYPGEIpDpEtnCYhKFMpwkcp76em5ynJqcxiWWiIZymiSaRjsKJqqax4atIAEdwd2xkCQsYAwW1IQUyBajmeO5+aCFeqzBRNM56HQyEE6XalRANZTVWquGQQzg6LSXa5BLqhHoPd6fSLRQhoWBgb78QQTPJTWTrWaOQyaOQyZzNNwyNywhDOKpaY4o+q6QwKTHtbEhML3CAkAkWIn9US9ClZKl-WkIGbGEiM5mshTszncjmzZoCoUOTicsWBTqSvEyuUKgDGyFEcvwAAsWFhUFBPSrfpMCog5NCSMsZIYGgo9Io0XpuS5bGd1FG3HGlj4-FdxXa7gx8aTIG8Pl8eGM1cGAdZ5BH1vJOLs3Ot9Ny1FUzVaHPZli4bTccVLCzKwEqS2SwABrEYVn5VmkhzX0nUgvVszQcrlbcqqEjqA+b4pMg0DiWkchUaiwKcYQgAOTAkg4c8pOWrUkQAFoUVVjDUDD0Qw3B0f9NjKTlbHsdRXAUORwWjTRlF8HNRCwOJ4EyLF83wSt30XGsEB-JZqnWQxAOA0D1nAxBZibGpN2ZNF3Dg8i3DPHCyEoMA8Opf5PwQHQaIQOQ3BIVjakUJp5CQjjblxWIiV49UlzBfYFGWepVAaOQYR3NY9hAvRjL0exmgM5Cc2w+Th16ZSP0KbQlBBZotBbeRWW5HQnAjY4TFAjloTWdirLzGyHUeZ4IDKN8+I1JDDHE0E3KtFllCTAx1IPTgOVUBR+1C21wulWUyyU+d8P4wpFCUcicqA7z5gOdKd1jKo3D81llH0ajNDkocIpJVAyQgeyCIElF7FXJl5itK1TJ0dtOXreZY1E1kmT0fr7RKsc7IquKl0mmRpuZTx5pRY11HEiEW1UeD8scFDvCAA */
    context: {
      autoplay: false,
      skip: false,
    },
    id: "audioOutput",
    initial: "idle",
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
      skipCurrent: (context, event) => {
        // send a message back to the audio module to stop playback
        EventBus.emit("audio:skipCurrent");
      },
    },
    guards: {
      shouldSkip: (context) => {
        return context.skip === true;
      },
    },
    services: {},
    delays: {},
  }
);
