import { buttonModule } from "../ButtonModule";
import { createMachine } from "xstate";
import AnimationModule from "../AnimationModule";
import { isSafari, isMobileView } from "../UserAgentModule";
import {
  uploadAudio,
  handleTranscriptionResponse,
} from "../TranscriptionModule";
import EventBus from "../EventBus";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFiANmAMSpoAOWCArrGAE4DK5YKA1lgHZQDaADAF1EocgHtYWAC5ZRnYSAAeiAMwB2PjmUBOPgDYAjLq379y3QBoQaRPr5atOXaq26ALKoBMy-QA5TAX39LMmw8QhIySgRUADMUeiwAIQJRAGM2SH4hJBAxCWlZeSUEPktrEsDg9FD8IlJ0KMpmVg5uLPk8qRk5HOK1DW09Q2NTCytEVx8PHHddAFZVI2UF3V0+OcqQENxaBmb2Lih6iipd+gAxLixYAAtIfdbeQQ7xLsLexA97Vxw5vlVVMt1Ho5soyohQbpfh55otlJMtHMPJttjgzg9DscoujJKJyCwIBi2s8cp0Cj1QMUPHwfA4pnwzMo7LS5j4weMEB5XBotIs5qy-qtVr4UdUdnQmCwDtwsVRJPQUJxYKkEgAjQ7tUmvclFT7fX7-QELPgg9nlVzzHB8GFIrQ+BkA-mizC4VUpdKQWU0ThutJsTUibXdXUIWw6TSuNSqOa6NnU7zghAAn7qbzWjyqVweJGuZ2hX0eiBe+isCBoAO5IPvSmIVY82OLGF6GnKHyJtbKHAeG0xr4+TwefR53BNKWPL1NXH4+5jjUkwP5YMfUNZqGuLTdi3Z5ZzFyJ3k+HAblxOHyxnwLIdBLZinCjlqYyKnCVEp7ZBdvCmKT40unx3RMnaiJsom66HhmsJfMmMLKMOd5YK+E5YJcnDXHchKzsS76Vou1bfiuMK-N4yjeFo3JAloiZmPoOCePMCwAnoPiTBs16ovKirKmqj4NHKCpKiqWCqpk844Z+IaAYe+i9joJHdoiiZ+AaJr-HwvhsvoGZwRxAncTKT4IDpXFCWA5woFgRAQBWZJLqA5rWrRfILD4F5zK4u6WH0zGHmoYFfJGqwxtp-HGeq+m8YZIWCcJEAAKIALbkJI5aiTZeHFKUHJ8HBKQoBAPEnAg97Sm+Ly4V+xT6KuMwblyujbvye4cs4qiOM4bgxv8+g6D4cEMPQoj0LAxAKLAkgoJIYA4CgMSTfQAAUtgqQAlMcoT9YNsDWVWFWIJl5TZWxt4bUNI1jRNU0zXNi0qXwq2oidW36NhaW7SUiaHdenCiBAcDyNsZXicuAC0kyJsD-a-HBtRgIDOrLlmiaaXMmhzNJvbdn43W5kdLpoi+mFQHDtn4dmDl-IxUysoMqigaYXZ8lm3asussG4-m7oZBAxPpRCdoRr5g7uBesaJoCUL6O1UzeBmTKsVUePFY8PNvYYzG0X8NJ0Qs66gRa0KQaY1J+MFnHRYcKsSVmKOaX5ZFmPMYz2dMAL0aoLn8u5Wg5aIeUW1q5UhsjPl2gi7iZvCYvuUeXxuLMvjufLN5449lsIx4imuD8ksuNLmmAusfX0ANQ04EZ0WmeZllpzWCA6Puiw4DnsZePnctFyXsA4PFWCpLFxeDTX+H1xyJgLG1LjSfYbimGzgRAA */
    id: "sayPi",
    initial: "idle",
    states: {
      idle: {
        description: "Initial state.\nGentle pulsing animation.",
        entry: ["stopAllAnimations", "acquireMicrophone"],
        on: {
          "saypi:userSpeaking": {
            target: "userSpeaking",
          },
          "saypi:safariBlocked": {
            target: "blocked",
            cond: "isSafari",
          },
          "saypi:piSpeaking": {
            target: "piSpeaking",
          },
        },
      },

      userSpeaking: {
        description:
          "User is speaking and being recorded by the microphone.\nWaveform animation.",

        entry: [
          {
            type: "startAnimation",
            params: {
              animation: "userSpeaking",
            },
          },
          "activateTalkButton",
        ],

        exit: [
          {
            type: "stopAnimation",
            params: {
              animation: "userSpeaking",
            },
          },
          "deactivateTalkButton",
        ],

        on: {
          "saypi:userFinishedSpeaking": {
            target: "transcribing",
            cond: "longEnoughForUpload",
          },
          "saypi:userStoppedSpeaking": {
            target: "idle",
            cond: "tooShortForUpload",
          },
          "saypi:transcribing": {
            target: "transcribing",
          },
        },
      },

      blocked: {
        description:
          "Blocking action on Safari.\nUser must press play to hear Pi's response.\nBounce animation.",
        entry: [
          {
            type: "startAnimation",
            params: {
              animation: "paused",
            },
          },
          "showPlayButton",
        ],
        exit: [
          {
            type: "stopAnimation",
            params: {
              animation: "paused",
            },
          },
          "hidePlayButton",
        ],
        on: {
          "saypi:ready": {
            target: "blocked",
            internal: true,
            description: `Enough audio has been buffered to start playback.`,
            actions: "showPlayButton",
          },

          "saypi:unblock": {
            target: "loading",
          },
        },
      },

      piSpeaking: {
        description:
          "Pi's synthesised speech audio is playing.\nPlayful animation.",
        entry: {
          type: "startAnimation",
          params: {
            animation: "piSpeaking",
          },
        },
        exit: {
          type: "stopAnimation",
          params: {
            animation: "piSpeaking",
          },
        },
        on: {
          "saypi:piStoppedSpeaking": {
            target: "idle",
          },
          "saypi:userSpeaking": {
            target: "userSpeaking",
          },
          "saypi:piFinishedSpeaking": {
            target: "idle",
          },
        },
      },

      transcribing: {
        description: "Transcribing audio to text.\nCard flip animation.",
        entry: [
          {
            type: "startAnimation",
            params: {
              animation: "transcribing",
            },
          },
          {
            type: "transcribeAudio",
            params: {},
          },
        ],
        exit: {
          type: "stopAnimation",
          params: {
            animation: "transcribing",
          },
        },
        on: {
          "saypi:transcribed": {
            target: "idle",
            actions: {
              type: "handleTranscriptionResponse",
              params: {},
            },
            description: "Successfully transcribed user audio to text.",
          },

          "saypi:transcribeFailed": {
            target: "#sayPi.errors.transcribeFailed",
            description: "Received an error response from the /transcribe API",
          },

          "saypi:transcribedEmpty": {
            target: "#sayPi.errors.micError",
            description:
              "Received an empty response from the /transcribe API (no speech detected)",
          },
        },
      },

      loading: {
        description: "Pi's audio is loading.",
        entry: {
          type: "startAnimation",
          params: {
            animation: "loading",
          },
        },
        exit: {
          type: "stopAnimation",
          params: {
            animation: "loading",
          },
        },
        on: {
          "saypi:piSpeaking": {
            target: "piSpeaking",
          },
        },
      },

      errors: {
        description: "Error parent state.",

        after: {
          10000: [
            {
              target: "#sayPi.idle",
              actions: [],
              description: "Reset to the idle state and clear errors.",
            },
            {
              internal: false,
            },
          ],
        },

        initial: "transcribeFailed",

        states: {
          transcribeFailed: {
            description: "The /transcribe API responded with an error.",
            type: "final",
            entry: {
              type: "startAnimation",
              params: {
                animation: "error",
              },
            },

            exit: {
              type: "stopAnimation",
              params: {
                animation: "error",
              },
            },
          },

          micError: {
            type: "final",
            description: `No audio input detected`,
            entry: {
              type: "showNotification",
              params: { icon: "muted-microphone" },
            },
            exit: {
              type: "dismissNotification",
              params: {},
            },
          },
        },
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      stopAllAnimations: (context, event) => {
        AnimationModule.stopAllAnimations();
      },

      startAnimation: (context, event, { action }) => {
        AnimationModule.startAnimation(action.params.animation);
      },

      stopAnimation: (context, event, { action }) => {
        AnimationModule.stopAnimation(action.params.animation);
      },

      transcribeAudio: (context, event) => {
        console.log("transcribeAudio", event);
        const audioBlob = event.blob;
        uploadAudio(audioBlob, event.duration);
      },

      handleTranscriptionResponse: (context, event) => {
        console.log("handleTranscriptionResponse", event);
        const transcription = event.text;
        handleTranscriptionResponse(transcription);
      },

      showPlayButton: (context, event) => {
        buttonModule.showPlayButton();
      },

      hidePlayButton: (context, event) => {
        buttonModule.hidePlayButton();
      },

      activateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        talkButton.classList.add("active"); // Add the active class (for Firefox on Android)
      },

      deactivateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        talkButton.classList.remove("active"); // Remove the active class (for Firefox on Android)
      },

      acquireMicrophone: (context, event) => {
        // warmup the microphone on idle in mobile view,
        // since there's no mouseover event to trigger it
        if (isMobileView()) {
          EventBus.emit("audio:setupRecording");
        }
      },

      showNotification: (context, event, { action }) => {
        const icon = action.params.icon;
        const message = action.params.message;
        buttonModule.showNotification({ icon, message });
      },

      dismissNotification: (context, event) => {
        buttonModule.dismissNotification();
      },
    },
    services: {},
    guards: {
      tooShortForUpload: (context, event) => {
        return event.duration < 1000;
      },

      longEnoughForUpload: (context, event) => {
        return event.duration >= 1000;
      },

      isSafari: (context, event) => {
        return isSafari();
      },
    },
    delays: {},
  }
);
