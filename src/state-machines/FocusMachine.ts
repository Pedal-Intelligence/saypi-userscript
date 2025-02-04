import { createMachine, assign } from "xstate";

export function enterFocusMode() {
  // add focus class to the body
  document.body.classList.add("focus");
}

export function exitFocusMode() {
  // remove focus class from the body
  document.body.classList.remove("focus");
}

const THRESHOLD_INACTIVITY_TIME_MS = 10000; // Define the threshold value

type FocusContext = {
  inactivityTime: number;
};
type TickEvent = { type: "tick"; time_ms: number };
type BlurEvent = { type: "blur" };
type PauseEvent = { type: "pause" };
type ResumeEvent = { type: "resume" };

export const machine = createMachine<FocusContext>(
  {
    context: {
      inactivityTime: 0,
    },
    id: "focusMachine",
    initial: "Idle",
    states: {
      Idle: {
        description:
          "The machine is not in focus mode and is waiting for user inactivity.",
        after: {
          "11000": {
            target: "#focusMachine.Focused",
            cond: "isInactiveLongEnough",
            actions: [],
          },
        },
        exit: "resetInactivityTime",
        on: {
          blur: {
            target: "Idle",
            actions: "resetInactivityTime",
          },
          tick: {
            actions: "incrementInactivityTime",
          },
          pause: {
            target: "Paused"
          }
        },
      },
      Paused: {
        description:
          "The machine is not waiting for user activity",
        on: {
          resume: {
            actions: "resetInactivityTime",
            target: "#focusMachine",
          },
        },
      },
      Focused: {
        description:
          "The machine is in focus mode, not responding to user inputs except to exit focus mode.",
        entry: "focusAction",
        exit: ["blurAction"],
        on: {
          blur: {
            target: "Idle",
            actions: "resetInactivityTime",
          },
        },
      },
    },
    schema: {
      events: {} as BlurEvent | TickEvent,
      context: {} as FocusContext,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      resetInactivityTime: assign({
        inactivityTime: 0,
      }),
      incrementInactivityTime: assign({
        inactivityTime: (context: FocusContext, event: TickEvent) => {
          return (context.inactivityTime += event.time_ms);
        },
      }),
      focusAction: () => {
        enterFocusMode();
      },
      blurAction: () => {
        exitFocusMode();
      },
    },
    services: {},
    guards: {
      isInactiveLongEnough: (context: FocusContext, event) => {
        return context.inactivityTime >= THRESHOLD_INACTIVITY_TIME_MS;
      },
    },
    delays: {},
  }
);
