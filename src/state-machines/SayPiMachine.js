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
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAdFiANmAMSpoAOWCArrGAE4DK5YKA1lgHZQDaADAF1EocgHtYWAC5ZRnYSAAeiAMwB2PjmUBOPgDYAjLq379y3QBoQaRPr5atOXaq26ALKoBMy-QA5TAX39LMmw8QhIySgRyFFowfiEkEDEJaVl5JQQ1DW09Q2NTCytEVSMcUo8tH3cfVWVXM0Dg9FD8IlJ0KMpmVg5uBPkUqRk5JMzszR0DIxMzS2sEVx8PHHddAFZSrWVN3V0+daaQENw4phZ2LigOiiozgDEuLFgAC0gey-7BQfFh9LHEJUtK4cOs+Ko6ps+Hp1sp5ohYbpQR4NqV6j4tOsPEcTjgzh8+tdInc6ExJKJyCwIASrgMkkM0qNQJkPHwMThlnwzMo7Bj1j44cUEB5XBotKV1vywXs9r4cS1TqSadwblFJPQUJxYABjehYABGtO+9N+jIygPsILBEJ26hhgoWrg2OD4KKxVS5EMl8swuBicQgqqo5AI6DpIlNI3NCFsOk0DS9ugFrO88IQEJB6m8ro8qlcHixrh9oX9dEDxIQ9FYEDQ4eSkf+zMQezFSYq+32Ap8af2yhwHjd610lVqA-0xb9WGVRM6wan5Mp7wuhLrDKjAJj+aRri0A6dBZ26xcafFPhwu5cTh8SZ8m3HQWOCpw3WXVyDNCVr6+iQjqXXTeFNkHE5bleUxAU0x3M9c1RSoMxRZQJ2fKcvxnW5oiwR5OGeN5qVQ1cGyZRQbC3UFvGUbxgS5TYtDTMx9HKQcIXUJMlkOB9cXVTUdT1Q0VQrLitV1A1IAIv9G2IrJeRwfQh0qLllAHTE0z8UFoWhdRfAFfRcyQwSeINN8BI1ITeLAe4UCwIgIDEv4iMdV1yglTYfFvdZXCPSxxmqM81CgyoGj2Ic9JMgy+LQtVQuE-VIAAUQAW3ISRa2NX87OjPg0z4JCCFEFAICM2cMOnWyzQ3fRSJ3Pdh1hSVjyFZxVEcZw3CHcF9B0HwkIYehRHoWBiAUWBJBQSQwBwFAADMxvoAAKVl1IAShuUIer62BSv-ST3IcZRlj8Ase1cmSWuWbxcx5djml9HA1v6wbhtG8appm+b1L4ZbcTujb9B-etxKIzIds0fadPWHtRROlwzp0uoDkCB9OFECA4HkE4fgB6MAFoljTLHajU9StKMcUPHva7WnCDH0o3fM0zBzR1lkuSBz8Dqiw4p98VQ6myoAgtHOtdRln5XJVEg0x+wlfMB35A5EM5m7S0gXmtqBqp4z8smaiHbsGrMKGky8WHLqQl9eiuVWJMyQxqnKME2U8VEd0gp1kVg0xWT8ELuOiy2TUxjd6gLGSRSqAKzA2IoHJWCENhctyPK0HK8oK7grcBmwC18qolmBDN6jTPN1nPSo3DWXwPKux8bu+jPozphq7f0FqbSPDwBQVincG+nB9Oi8zLOs+uNx0E9SkNmGLvhxXVvoXr+pweKsG1WL576keALHoUTE2ZqXFk+w3FMBXAiAA */
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
          "saypi:pause": {
            target: "paused",
            cond: "isSafariMobile",
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
        console.log("tooShortForUpload", event);
        return event.duration < 1000;
      },

      longEnoughForUpload: (context, event) => {
        return event.duration >= 1000;
      },

      isSafariMobile: (context, event) => {
        return isSafari() && isMobileView();
      },
    },
    delays: {},
  }
);
