import { setup, assign } from "xstate";

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
type FocusEvent = BlurEvent | TickEvent;

export const machine = setup({
  types: {
    context: {} as FocusContext,
    events: {} as FocusEvent,
  },
  actions: {
    resetInactivityTime: assign({
      inactivityTime: 0,
    }),
    // v5: update context immutably via assign rather than mutating the shared
    // definition context in place (the old `context.inactivityTime += ...`
    // leaked across interpreted actors). Each actor is now isolated.
    incrementInactivityTime: assign({
      inactivityTime: ({ context, event }) => {
        const tick = event as TickEvent;
        return context.inactivityTime + tick.time_ms;
      },
    }),
    focusAction: () => {
      enterFocusMode();
    },
    blurAction: () => {
      exitFocusMode();
    },
  },
  guards: {
    isInactiveLongEnough: ({ context }) => {
      return context.inactivityTime >= THRESHOLD_INACTIVITY_TIME_MS;
    },
  },
}).createMachine({
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
          guard: "isInactiveLongEnough",
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
});
