import { createMachine } from "xstate";
import { setDarkMode, setNormalMode } from "../ThemeModule";

export const machine = createMachine(
  {
    context: {
      theme: "normal",
    },
    id: "themeToggle",
    initial: "Normal mode",
    states: {
      "Normal mode": {
        description: "The UI is in normal mode with a light theme.",
        on: {
          toggle: {
            target: "Dark mode",
            actions: {
              type: "setDarkMode",
            },
          },
        },
      },
      "Dark mode": {
        description: "The UI is in dark mode with a dark theme.",
        on: {
          toggle: {
            target: "Normal mode",
            actions: {
              type: "setNormalMode",
            },
          },
        },
      },
    },
    schema: {
      events: {} as { type: "toggle" },
      context: {} as { theme: string },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      setDarkMode: (context, event) => {
        setDarkMode();
      },
      setNormalMode: (context, event) => {
        setNormalMode();
      },
    },
    services: {},
    guards: {},
    delays: {},
  }
);
