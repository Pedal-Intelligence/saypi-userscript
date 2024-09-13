import { createMachine, assign } from "xstate";
import EventBus from "../events/EventBus";
import {
  MatchableVoice,
  PiAIVoice,
  PiSpeech,
  VoiceFactory,
} from "../tts/SpeechModel";
import { PiAIChatbot } from "../chatbots/Pi";
import { PiSpeechSourceParser } from "../tts/SpeechSourceParsers";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

type ConversionContext = {
  voice: MatchableVoice | null;
};
type ChangeVoiceEvent = {
  type: "changeVoice";
  voice: MatchableVoice;
};
type LoadstartEvent = {
  type: "loadstart";
  source: string;
};
type VoiceConverterEvent = ChangeVoiceEvent | LoadstartEvent;
const pi: PiAIChatbot = new PiAIChatbot();
const prefs = UserPreferenceModule.getInstance();

export const voiceConverterMachine = createMachine({
  context: {
    voice: null,
  },
  id: "voiceConverter",
  initial: "idle",
  description:
    'This machine loads audio in a "restored" voice (i.e. Pi 7 or Pi 8) when the user has requested one of those voices but Pi starts to load a different voice (i.e. Pi 1-6) instead.',
  schema: {
    context: {} as ConversionContext,
    events: {} as VoiceConverterEvent,
  },
  states: {
    idle: {
      on: {
        changeVoice: {
          target: "voiceSelected",
          actions: assign({
            // ...
          }),
          cond: {
            type: "restoredVoice",
          },
        },
      },
      description:
        "The initial state where the machine waits for user actions.",
    },
    voiceSelected: {
      on: {
        changeVoice: [
          {
            target: "voiceSelected",
            cond: "restoredVoice",
            actions: "assignVoice",
          },
          {
            target: "idle",
          },
        ],
        loadstart: {
          target: "voiceSelected",
          actions: {
            type: "convertSpeechToSelectedVoice",
          },
          cond: {
            type: "voiceMismatch",
          },
          description:
            "Speech starts to load, but the speaker's voice does not match the selected voice.",
        },
      },
      description:
        "State where a restored voice has been selected by the user.",
    },
  },
  predictableActionArguments: true,
  preserveActionOrder: true,
}).withConfig({
  actions: {
    convertSpeechToSelectedVoice: function (
      context: ConversionContext,
      event: VoiceConverterEvent
    ) {
      const parser = new PiSpeechSourceParser();
      if (event.type === "loadstart" && parser.matches(event.source)) {
        const speechSource = event.source;
        const speech = parser.parse(speechSource);
        prefs.getVoice().then((voice) => {
          if (voice) {
            const newSpeech = new PiSpeech(
              speech.id,
              speech.lang,
              voice,
              speech.uri
            );
            EventBus.emit("audio:load", { source: newSpeech.uri });
          }
        });
      }
    },
    assignVoice: assign({
      voice: function (context: ConversionContext, event: VoiceConverterEvent) {
        if (event.type === "changeVoice") {
          return event.voice;
        }
        return null;
      },
    }),
  },
  guards: {
    restoredVoice: function (
      context: ConversionContext,
      event: VoiceConverterEvent
    ) {
      if (event.type === "changeVoice") {
        const selectedVoice = event.voice;
        const restoredVoices = pi.getExtraVoices();
        for (let i = 0; i < restoredVoices.length; i++) {
          if (selectedVoice.matchesId(restoredVoices[i].id)) {
            return true;
          }
        }
        return false;
      }
      return false;
    },
    voiceMismatch: function (
      context: ConversionContext,
      event: VoiceConverterEvent
    ) {
      if (event.type !== "loadstart") {
        return false;
      }

      const loadstartEvent = event as LoadstartEvent;
      const speechSource = loadstartEvent.source;

      function isVoiceMatch(voice: MatchableVoice | null, source: string) {
        return voice && voice.matchesSource(source);
      }

      return !isVoiceMatch(context.voice, speechSource);
    },
  },
});
