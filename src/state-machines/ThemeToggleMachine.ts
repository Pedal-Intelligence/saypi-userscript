import { assign, createMachine } from "xstate";
import { applyDarkMode, applyNormalMode } from "../ThemeModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { AudibleNotificationsModule } from "../NotificationsModule";

const audible = new AudibleNotificationsModule();

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcAWYC2YAqB7KUANmAHSG4CGEAlgHZQDEA2gAwC6ioADrrNctVy1OIAB6IAzCwAsJAGwAmaQE5lAdjkTlStdICsAGhABPSdLkllLRdK1yAjHr1yAHAF83RtJhz4ipcio6RiZ7DiQQHj4BIRFxBClZG1UNLR19I1MEe3tlEjUFOScXWxYXAoU9Dy90LDwCYhIAOVwAJwwKQgACDFwIMAZkP2JWcO5efkFhCPj7FkKSBRd7BV17FVW5NUzEZZIVVVVK45dC6pBvOuHSABEKVoBrHr6BoYawUZEoydiZxDmciQShI1C4JEsZGoJHIdtk1GpLHoJCspA4tMo9NIPJ4QLQXvAIpdfO8vhMYtNQPEALQwkyIKl6SyHZks5QSc5E+r+MiUGj0UnRKZxRDSBSwuZ5JzKFwpMqg6QuKo4znXZptDrdXr9AU-Clif72Er5FjIpEKexbFjbOnZPZbZSuaTSexqB2ndzK2rE7l3R7PbURb7k4UINRWxZ6FgsewSErqGQuWEY-KFZxW5Qu3JKbFuIA */
    context: {
      theme: "light",
    },
    id: "themeToggle",
    initial: "loading",
    states: {
      loading: {
        description: "Determining the initial theme mode.",
        invoke: {
          id: "getPreferedTheme",
          src: () => UserPreferenceModule.getTheme(),
          onDone: {
            target: "loaded",
            actions: assign({ theme: (context, event) => event.data }),
          },
          onError: {
            target: "Normal mode",
          },
        },
      },
      loaded: {
        description: "The initial theme mode has been determined.",
        always: [
          {
            target: "Normal mode",
            cond: "preferLight",
          },
          {
            target: "Dark mode",
            cond: "preferDark",
          },
        ],
      },
      "Normal mode": {
        description: "The UI is in normal (default) mode with a light theme.",
        entry: "enterNormalMode",
        on: {
          toggle: {
            target: "Dark mode",
            actions: [
              {
                type: "saveMode",
                params: {
                  theme: "dark",
                },
              },
              {
                type: "soundEffectOn",
              },
            ],
          },
        },
      },
      "Dark mode": {
        description: "The UI is in dark mode with a dark theme.",
        entry: "enterDarkMode",
        on: {
          toggle: {
            target: "Normal mode",
            actions: [
              {
                type: "saveMode",
                params: {
                  theme: "light",
                },
              },
              {
                type: "soundEffectOff",
              },
            ],
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
      enterDarkMode: (context, event) => {
        applyDarkMode();
      },
      enterNormalMode: (context, event) => {
        applyNormalMode();
      },
      saveMode: (context, event, { action }) => {
        UserPreferenceModule.setTheme(action.params.theme);
      },
      soundEffectOn: () => {
        audible.themeOn();
      },
      soundEffectOff: () => {
        audible.themeOff();
      },
    },
    services: {},
    guards: {
      preferLight: (context) => context.theme === "light",
      preferDark: (context) => context.theme === "dark",
    },
    delays: {},
  }
);
