import { createMachine } from "xstate";

const audioInputMachine = createMachine({
  id: "audioInput",
  initial: "released",
  states: {
    released: {
      on: {
        setup: "acquired",
      },
    },
    acquired: {
      initial: "idle",
      states: {
        idle: {
          on: {
            start: "recording",
          },
        },
        recording: {
          on: {
            stop: "stopped",
          },
        },
        stopped: {
          type: "final",
        },
      },
      on: {
        release: "released",
      },
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
});
