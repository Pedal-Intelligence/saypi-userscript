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
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFiANmAMSpoAOWCArrGAE4DK5YKA1lgHZQDaADAF1EocgHtYWAC5ZRnYSAAeiAMwB2PjmUBOPgDYAjLq379y3QBoQaRPr5atOXaq26ALKoBMy-QA5TAX39LMmw8QhIySgRyFFowfiEkEDEJaVl5JQQ1DW09Q2NTCytEVSMcUo8tH3cfVWVXM0Dg9FD8IlJ0KMpmVg5uBPkUqRk5JMzszR0DIxMzS2sEVx8PHHddAFZSrWVN3V0+daaQENw4phZ2LigOiiozgDEuLFgAC0gey-7BQfFh9LHEJUtK4cOs+Ko6ps+Hp1sp5ohYbpQR4NqV6j4tOsPEcTjgzh8+tdInc6ExJKJyCwIASrgMkkM0qNQJkPHwMThlnwzMo7Bj1j44cUEB5XBotKV1vywXs9r4cS1TqSadwblFJPQUJxYABjehYABGtO+9N+jIygPsILBEJ26hhgoWrg2OD4KKxVS5EMl8swuBicQgqqo5AI6DpIlNI3NCFsOk0DS9ugFrO88IQEJB6m8ro8qlcHixrh9oW6F0JQeiWEY5Mp7zLRsSEdSUYBMfzSNcWg8It0BZ26xcafFPhwXZcTh8SZ8m30xb9VfrKuJNCVi94xqbfyZikBbIcnO5vMxArTnZHudRlQzKOUc5wpd6VwrlEenGeb2pa-DyUj-2ZNnbUFvGUbxgS5TYtDTMx9HKN1NghPRqmnO91U1HU9UNJdOioVCtV1A1IG-BkW3-LJeRwfR1l7HQQO7TE0z8UFoWhdRfAFfRczvAhRBQCAn2XB9PnXRsf2bP8dzbFFVi7Hs+0lQchWcVRHGcNwqPBfQdB8O9-ToQNl3oVgIDQIjf23TI9jFJMKn2fYBR8NN9mUHBuw2KjKlqbtZyOThRAgOB5BOH4xPMxAAFoigWCKXWY2K4vBO82jAYKt2jfM0w49ZNHWSj3O7PxNKLIJjgVPFV0fbgUrNVsC1dJiEOWflclUU9TBciV827fkDlvYrcV0yAqpIiSBxHeo1HzfQaiohzFLMCjVOWbxcx5Q4+tKwTCSG8TMkMapyjBNlPFRTtTydZFL1MVk-BQjU8Iwq5ttCrJ8yyjiz0qBo9io086ohNzVB8ad1lcAcuJ4vjKpNELo0ysaqiWYEM3qNM8yysc3DWXxQbWwIgA */
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
        ],
        exit: [
          {
            type: "stopAnimation",
            params: {
              animation: "paused",
            },
          },
        ],
        on: {
          "saypi:play": {
            target: "loading",
            actions: "hidePlayButton",
          },

          "saypi:ready": {
            target: "paused",
            internal: true,
            description: `Enough audio has been buffered to start playback.`,
            actions: "showPlayButton",
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

      startAnimation: (context, event, { action }) => {
        AnimationModule.startAnimation(action.params.animation);
      },

      stopAnimation: (context, event, { action }) => {
        AnimationModule.stopAnimation(action.params.animation);
      },

      transcribeAudio: (context, event) => {
        console.log("transcribeAudio", event);
        const audioBlob = event.blob;
        uploadAudio(audioBlob);
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
    },
    services: {},
    guards: {
      tooShortForUpload: (context, event) => {
        console.log("tooShortForUpload", event);
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
