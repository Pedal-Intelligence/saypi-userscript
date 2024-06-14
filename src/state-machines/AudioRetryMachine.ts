import { createMachine } from "xstate";
import EventBus from "../events/EventBus";

const maxRetryAttempts = 5;
const AUDIO_RELOAD_DELAY_MS = 1500; // minimum delay in milliseconds
const AUDIO_LOAD_TIMEOUT_MS = 4000; // time allowed for audio to load before retrying - also update in WaitingWhileLoading state

type RetryContext = {
  delay: number;
  retries: number;
  startTime: number; // time of the first retry
};

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AogJzyzwAlkA7CAGzDwDoBJKsAYgAdLkBPAbQAYBdRKFZZYGAC7YyQkAA9EARgAsATgBMtXlt4AOFQFY1KpUoUAaEJ0T6FC2mt4qAbGrVKA7ArWeFAZgC+-hZomLgERKQU1HSM1MzIAEZE4nyCSCAiYpJY0unyCMrqmtp6hsamFlYIDry07qoq7iq+Or5OTr5KToHB6Nj4hCTkTDFMzDSDqTKZElIy+YUa2roGRibmlohqNvb62k1NKn46PSAh-eFDUTQMY2AAtqySkFPpM9m5oAvKGr4qOoZ9MYdO5DE5KoglI57A59K0WoYFMZ3KdzmFBpERrc4rAsKg8ABjMAAYQAFuQYBBXsJRLMcvNFLwlPo6ntHE59O4jFp9BDqk47O4nPUlGoBQZhSpUX10RFhtFaAAFDicDBkKBsNCwMDUjK0j4MgpClmgpq8PYS-QdPk6Xi+eyOfSqJQtPRHaWhAZy650ZVcNUaxLJXXvOZ5LbKJyaJ2gpyNFa8cGbBC+LnFLSuby2v68FFBM4yr1XLF+1Xq8aXEP6sNfCNdaMeK3xvSJvmijRs826epqPRKD0XDHym6lgPjCgvATTav08NGpxKWgKBdeFw6HSiwx8q2CxweeqdXxwgey4sK0flh5PDCTtI0rI1uSKJwA+zOFRHF-GNpt5SsjlHqmtgfic+ZokWmIKgA6sgszqlBpIYNQAAyWDIJg5aUGhECQPcYDiOhyAEVWD6zrWBSqEsJSrOUGxVAC9ruHuRxqAoALCqBvSepckE3DBcFQAhSFgKh6FjgS5DsFw4ikoQqBQKSJF0p8T4UUUyylGsFTJgoWg6LQApwkehiqPoLQnhBw50PxkjwYhKHYWOExEEpBpzos6YrGU6x8rYrSaK45quDYHJchZPFWbQNkBkJDlieWQZ4CkU5vDOKkLJRnmabRvlqL49qGA4tobmaoLhUOPpRbBtmCfZImOeWsiwAR4hgLQyAAGatXgAAUUJaAAlPEhYRZV0V2cJokYVArmPhl6nUd52lVF4G4Baxe7rJyUpgSNFVYgASmAWHxRqJ04RAeEERARHILNZGqax+gsts7itM9vjeCobbuPayxNB45p-L95Xeodx0NRqElkFJnAyXJCn3elEbPbsb3GZ9TR8gu7i0FCHStLwxzbKDZ43Ed51jk1LVtZ13U9QdODIQA8gAggAIgA+uzTOswAmkN4GjeDlPqkjhqsQYBlKK0OgOF4QK+L5zKCjL7RGL2RO6KTvF0BTkPMNTRG011NAM0zbNczzyH84Le1gwq+undwCh3nqpHI9UkYNrGzYqK2yY6HYDT-EiG42I4OuRYqWqQGwKri3O22ebmYpuK0ajY3LeNAqoCi-envgKFHlUx6g2oQPESRJYn5HJ8sqcuDLn2+e0Ki0EetreDLXJvZxBbcft56x5Xzl4LXqn1-9afN5nOmeO3AK2lauhHhrJcliP4yPM8VIpfeymGlP+wzxn27QiYnh6J9xh7JyG-D+Xce4viRJkhSt7Th7R9NCnXJN2fZMbQ7AfihDLK0qZ-j1ECPmMgWAcLwHSELIeNAv6HznAAWiTFULBKcG7aA-PoB+NxYhgDQW5ciukgS0E5HaDoukujmm3LpAyv1hRMgBNyfuyCHYjhVAGchc1FDX3TF4Ww2wm7uGxh0B0BhfBMjKN+Yh1lqoxTqlNARqVv5zgMCyDSrg26cikTpF09p2LqAFO4N6fgdpcUHLwvWENTqCIevkbYOgoyvTYf7UwRMs61CPOUZoC4zJ+GUUqEeLjPailbjsOhTR5FFzYu0GB-ggA */
  context: {
    delay: AUDIO_RELOAD_DELAY_MS,
    retries: 0,
    startTime: 0,
  },
  id: "audioErrorHandler",
  initial: "Idle",
  states: {
    Idle: {
      on: {
        play: {
          target: "Playing",
        },
        abort: {
          target: "Reloading",
        },
        error: {
          target: "Reloading",
        },
        emptied: {
          target: "Idle",
          actions: {
            type: "resetRetryCounter",
          },
        },
        sourceChanged: {
          actions: {
            type: "resetRetryCounter",
          },
          description: "The audio source has changed to load a new audio file.",
        },
      },
      description: "The audio element is idle and ready to play audio.",
    },
    Playing: {
      on: {
        pause: {
          target: "Paused",
        },
        abort: {
          target: "Reloading",
        },
        error: {
          target: "Reloading",
        },
        ended: {
          target: "Idle",
        },
        emptied: {
          target: "Idle",
          actions: {
            type: "resetRetryCounter",
          },
        },
      },
      description: "The audio is currently playing.",
    },
    WaitingWhileLoading: {
      description:
        "Following a reload command, we're waiting for the audio to load. Will finish in a successful load (partial or complete), error, or timeout event.",
      on: {
        loadedmetadata: {
          target: "Playing",
          actions: [
            {
              type: "resetRetryCounter",
            },
            {
              type: "forcePlay",
            },
          ],
          description: "The audio has partially loaded and is ready to play.",
        },
        canplaythrough: {
          target: "Playing",
          actions: [
            {
              type: "resetRetryCounter",
            },
            {
              type: "forcePlay",
            },
          ],
          description:
            "The audio has loaded successfully and is ready to play.",
        },
        error: {
          target: "Reloading",
        },
        abort: {
          target: "Reloading",
        },
      },
      after: {
        4000: {
          target: "Reloading",
          actions: [{ type: "decreaseDelayAfterTimeout" }],
          description:
            "The audio has failed to load, usually due to a HTTP 400 error on Safari.",
        },
      },
    },
    Reloading: {
      on: {
        loadedmetadata: {
          target: "Playing",
          actions: [
            {
              type: "resetRetryCounter",
            },
            {
              type: "forcePlay",
            },
          ],
          description:
            "While waiting to reload, the audio has partially loaded and is ready to play.",
        },
        canplaythrough: {
          target: "Playing",
          actions: [
            {
              type: "resetRetryCounter",
            },
            {
              type: "forcePlay",
            },
          ],
          description:
            "While waiting to reload, the audio has loaded successfully and is ready to play.",
        },
      },
      after: {
        RELOAD_DELAY: [
          {
            target: "WaitingWhileLoading",
            cond: "retriesRemaining",
            actions: [
              { type: "forceReload" },
              {
                type: "increaseDelay",
              },
              { type: "incrementRetryCounter" },
            ],
          },
          {
            target: "Idle",
            cond: "maxRetriesReached",
          },
        ],
      },
      description:
        "The audio element has encountered an error or abort event and is attempting to reload after a delay.",
    },
    Paused: {
      on: {
        play: {
          target: "Playing",
        },
        abort: {
          target: "Reloading",
        },
        error: {
          target: "Reloading",
        },
        emptied: {
          target: "Idle",
          actions: {
            type: "resetRetryCounter",
          },
        },
        sourceChanged: {
          target: "Idle",
          actions: {
            type: "resetRetryCounter",
          },
          description: "The audio source has changed to load a new audio file.",
        },
      },
      description:
        "The audio is paused and can be played again or reloaded if there is an error.",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
}).withConfig({
  actions: {
    resetRetryCounter: function (context: RetryContext, event) {
      console.debug("Resetting retry counter...");
      context.retries = 0;
      context.delay = AUDIO_RELOAD_DELAY_MS;
    },
    incrementRetryCounter: function (context: RetryContext, event) {
      context.retries++;
    },
    increaseDelay: function (context: RetryContext, event) {
      context.delay = context.delay * 2;
    },
    decreaseDelayAfterTimeout: function (context: RetryContext, event) {
      console.debug(
        `Audio load timed out after ${AUDIO_LOAD_TIMEOUT_MS}ms. Trying again...`
      );
      context.delay = Math.max(
        AUDIO_RELOAD_DELAY_MS,
        context.delay - AUDIO_LOAD_TIMEOUT_MS
      );
    },
    forceReload: function (context: RetryContext, event) {
      console.debug(
        `Reloading audio, attempt ${
          context.retries + 1
        } of ${maxRetryAttempts}...`
      );
      EventBus.emit("audio:reload");
      if (context.retries === 0) {
        context.startTime = new Date().getTime();
      }
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - context.startTime;
      console.debug(
        `Time elapsed since first retry: ${
          timeElapsed / 1000
        }s, current delay: ${context.delay}ms`
      );
    },
    forcePlay: function (context: RetryContext, event) {
      console.debug("Starting audio after successful reload.", event);
      // how long did it take to reload and play?
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - context.startTime;
      console.debug(
        `Time taken to reload and start audio: ${timeElapsed / 1000} seconds`
      );
      EventBus.emit("audio:output:play");
    },
  },
  guards: {
    retriesRemaining: function (context: RetryContext, event) {
      return context.retries < maxRetryAttempts;
    },
    maxRetriesReached: function (context: RetryContext, event) {
      return context.retries >= maxRetryAttempts;
    },
  },
  delays: {
    RELOAD_DELAY: function (context: RetryContext, event) {
      return context.delay;
    },
  },
});
