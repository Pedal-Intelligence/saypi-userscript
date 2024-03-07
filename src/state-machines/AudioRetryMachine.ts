import { createMachine } from "xstate";
import EventBus from "../events/EventBus";

const maxRetryAttempts = 5;
const AUDIO_RELOAD_DELAY_MS = 1000; // minimum delay in milliseconds
const AUDIO_LOAD_TIMEOUT_MS = 4000; // time allowed for audio to load before retrying

type RetryContext = {
  delay: number;
  retries: number;
};

export const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AogJzyzwAlkA7CAGzDwGJKtkJYAXZPFgbQAYBdRUAAcssDC2xkBIAB6IALACYANCACeiAIzcA7BoB0ANgUK53ABw7ucgMwGAvnZVpMuAkVIVqePQEkqYWkFKZFUefiQQYVFxLEkI2QQNLW49biMDbgUATgBWI20zORV1BDNtHL0yk0zrHO5uLLMchyd0bHxCEnJ-bz9qWmQAIyIuPikosQkpBKT61PTM3PzC4sQs7QVKjbkNa20snW1alpBndrcuzxpff1oaTrDxkUnY6c1k+YUM7LyFAqK1Joano9tUNEYvtptPZHKc2q5Oh4ejd+gwmKx2KNwkJnjE4qAEmYNFk9DlrLsTNkklllIDSnISQYDDSjNYzAYNIUFCczgj3N0vHoAArBVQYMhQQJoWBgR4RCZ4t6JTkpHIKWqmXQaDZJVYIDZmPRZYlfQraGrGHnwjr8q7eEUhcWSoYjOU46JTeKaHJyCpmBRWDQBjZ7bR6uQFPR-DLWORGJI5dlWlw2y7Ih1iiV3C5uyK4z0E72+yoBnbB9VQvVqw1Q74mMlpL7J86IgXXDNO+iMZhsDi5hUFmTvOaN75LP4rOlQkk7Gl5ayZXZGZt8tOCgAy3c7AGNyEEQiwABaEVBQQ-9-OvL3KkcLH7LAElOQ7PRxjnGRTGZlNFeppEbrcs3uIgLw9K9CxvFJR0WX5-j1bISS0LI2TSHQyTJX8Ln-a5NyYTsXT7MZ5UvfEh0gz4x1gycSljRkGlsQprCyGxkMw1s7T0AAlMA0UwLNeIxQjsTzMDSJmAwcm0SocmY-Yvh9SSDD1JJnz0IN1VyMl2R+NjbWRbjeM7aQMRYMA9GQAAzUy8AACgAQQAVQAER8AB5AB9TicHXVy7Kc9ynO8uyAE0AEoBmtLC228AzAKgUCXjEos-VLIMdArMM6SJUl6m4XZJJyXZ6jMXS13baVIECUUEsVa8fRJXKrF+DluEkvUMkNcEaW0X0fQUCxuVhXk-2i4UKogAZhiEp5RKVerUly310i0Nq6V2LQSxyH1oXNAw5FK7D7XG7MHiI91ErmhkFvqJavhWzKSiXfRrAULbajqV7nwO0ahWOgTeyxGaLrqq7GtulrVpKbrKlyMxaisPb6ocWEyCwCA4CkYaortIHaoggBaJS6UJ67GrJ+ptG+ji+jAXHBwSI4DD0c1yR6woYxMPVcn0dTTEYnY42aIbIvY9NRSdOnwLI9apOhSSXu1IxWo0cNzRBGTbHVN7jVjKnkVwvioElpL9R9aTmPkuHmQUFW6X6zYJOYvLFC0T69cFWK8IlY2lRNCpmvMOQmjZGxlJsI11jKHRYy2wX3fK1AZQgH3r0ULnwS2CtGiY-qzCyZG7CAA */
  context: {
    delay: AUDIO_RELOAD_DELAY_MS,
    retries: 0,
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
    LoadingAfterDelay: {
      description:
        "The audio element is loading the audio source after some delay to resolve the error.",
      on: {
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
        3000: {
          target: "Reloading",
          actions: [{ type: "decreaseDelayAfterTimeout" }],
          description:
            "The audio has failed to load, usually due to a HTTP 400 error on Safari.",
        },
      },
    },
    Reloading: {
      after: {
        RELOAD_DELAY: [
          {
            target: "LoadingAfterDelay",
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
      console.debug("Retrying audio load after timeout...");
      context.delay = Math.max(
        AUDIO_RELOAD_DELAY_MS,
        context.delay - AUDIO_LOAD_TIMEOUT_MS
      );
    },
    forceReload: function (context: RetryContext, event) {
      console.debug(
        `Reloading audio, attempt ${
          context.retries + 1
        } of ${maxRetryAttempts}, after ${context.delay}ms...`,
        event
      );
      EventBus.emit("audio:reload");
    },
    forcePlay: function (context: RetryContext, event) {
      console.debug("Forcing audio to play after successful reload.", event);
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
