import { buttonModule } from "./ButtonModule";
import { createMachine } from "xstate";
import AnimationModule from "./AnimationModule";
import { isSafari } from "./UserAgentModule";
import {
  uploadAudio,
  handleTranscriptionResponse,
} from "./TranscriptionModule";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFiANmAMSpoAOWCArrGAE4DK5YKA1lgHZQDaADAF1EocgHtYWAC5ZRnYSAAeiAMwB2PjmUBOPgDYtuvsr4AOZSYBMAGhBpEWrRZyqLu3QEYT7gKzmALKrKAL5BNmTYeIQkZJQI5Ci0YPxCSCBiEtKy8koIahraegZGpubWtoi6qqrOrt4mJjqefH7eIWHoEfhEpOixlMysHNzJ8ulSMnKpOXmaOvqGxmaWNnYIfpY4AW7NXt6+fu5tIOG4iUws7FxQPRRUZwBiXFiwABaQA5fDgqPi41lTiAsBicvncnm09UCK0Q6g07lUum8WncbgsgT2RxOODOHyG1xidzoTEkonILAguKuI1SY0yk1AOQsfG81RMfmUbjZ2kM7mhCAsfg0WgR3kRKO0wt0wVCxw6pyJlO4N1iknoKE4sAAxvQsAAjKnfGm-OnZQHAnCg8FaSHKPm6CwmHCVbYC5TaCzmTFynDxRIQZVUcgEdDUkTGiamhDuPg6TTs1SigJmZHeO1VGpucXRhaqL2YXD9C54gNxLCMElk95Fg0pMMZCMAqPaPwWnyVLwegzuPx8kyqdw4SV1JGGEweaXtfM+svVpUEmgK2e8Q11v70xSA5ms9mc9lFXnlBCZweuBb7FxovMRQuDK4lyiPTjPN4UpehtLh-4MxDuZsW7x+LoWx7A4yyHhyA4uIiUoOoBCJXrgqrqlqOr6nOvRUEhGranqkDvrSDbfrkei6Dg8LAmCDi6H2qaHl4Fp8IxfC1C0or2ghOAEKIKAQHe843p8y61h+9ZfhuTZaC23htqoHbct2abVFBdQNHwTQtCEMqcKIEBwPIJw-KJ645AAtLofImd4g4ODZtk2WOHFdGAhlrpGfhlKsOjVDydTGMoQJaKKHE4kuLkmo2ArqBayhgkBRQtHyLKkY4iJaMo3iFN4QIcb6dAQGFhHiUijrKOyXgtLJHJsnaRg4BYtTWjGakeBYOUzre3AFWJOQollziBOYbhSoxJh2tGZEIoY0nRoxBgcVhKF6lcXXGSo2jKGR6wQS0aWSolbibA17LdmKE6ylOXE8ctRpGZG7j1aR7nuJJHJVH4gWjYe9pWUOJizUC0atJpQA */
    id: "sayPi",
    initial: "idle",
    states: {
      idle: {
        description: "Initial state.\nGentle pulsing animation.",
        entry: "stopAllAnimations",
        on: {
          "saypi:userSpeaking": {
            target: "userSpeaking",
          },
          "saypi:pause": {
            target: "paused",
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

        entry: ["startAnimation", "activateTalkButton"],

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
      paused: {
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
        exit: {
          type: "stopAnimation",
          params: {
            animation: "paused",
          },
        },
        on: {
          "saypi:play": {
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
          "transcribeAudio",
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
            actions: "handleTranscriptionResponse",
            description: "Successfully transcribed user audio to text.",
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
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      stopAllAnimations: (context, event) => {
        AnimationModule.stopAllAnimations();
      },

      startAnimation: (context, event) => {
        console.log("startAnimation", event);
        AnimationModule.startAnimation(event.params.animation);
      },

      stopAnimation: (context, event) => {
        AnimationModule.stopAnimation(event.params.animation);
      },

      transcribeAudio: (context, event) => {
        console.log("transcribeAudio", event);
        const audioBlob = event.params.audioBlob;
        uploadAudio(audioBlob);
      },

      handleTranscriptionResponse: (context, event) => {
        console.log("handleTranscriptionResponse", event);
        const transcription = event.params.text;
        handleTranscriptionResponse(transcription);
      },

      showPlayButton: (context, event) => {
        buttonModule.showPlayButton();
      },

      activateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        talkButton.classList.add("active"); // Add the active class (for Firefox on Android)
      },

      deactivateTalkButton: (context, event) => {
        const talkButton = document.getElementById("saypi-talkButton");
        talkButton.classList.remove("active"); // Remove the active class (for Firefox on Android)
      },
    },
    services: {},
    guards: {
      tooShortForUpload: (context, event) => {
        return event.params.duration < 1000;
      },

      longEnoughForUpload: (context, event) => {
        return event.params.duration >= 1000;
      },

      isSafari: (context, event) => {
        return isSafari();
      },
    },
    delays: {},
  }
);
