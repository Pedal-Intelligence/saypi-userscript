import { assign, setup, fromPromise } from "xstate";
import { ThemeManager } from "../themes/ThemeManagerModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import { AudibleNotificationsModule } from "../NotificationsModule";

type ThemeContext = {
  theme: string;
};

type ThemeEvent = { type: "toggle" };

export function createThemeToggleMachine(themeManager: ThemeManager) {
  const audible = AudibleNotificationsModule.getInstance();
  const userPreferences = UserPreferenceModule.getInstance();

  const machine = setup({
    types: {
      context: {} as ThemeContext,
      events: {} as ThemeEvent,
    },
    actions: {
      enterDarkMode: () => {
        themeManager.applyDarkMode();
      },
      enterNormalMode: () => {
        themeManager.applyNormalMode();
      },
      saveMode: (_, params: { theme: string }) => {
        userPreferences.setTheme(params.theme);
      },
      soundEffectOn: () => {
        audible.themeOn();
      },
      soundEffectOff: () => {
        audible.themeOff();
      },
    },
    actors: {
      getPreferedTheme: fromPromise(async () => userPreferences.getTheme()),
    },
    guards: {
      preferLight: ({ context }) => context.theme === "light",
      preferDark: ({ context }) => context.theme === "dark",
    },
  }).createMachine({
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
          src: "getPreferedTheme",
          onDone: {
            target: "loaded",
            actions: assign({ theme: ({ event }) => event.output }),
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
            guard: "preferLight",
          },
          {
            target: "Dark mode",
            guard: "preferDark",
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
  });
  return machine;
}
