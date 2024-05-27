// src/tts/__mocks__/SpeechSynthesisModule.ts
export class SpeechSynthesisModule {
  getVoice = (voiceId: string) => {
    return {
      id: voiceId,
      name: "Samantha",
      lang: "en",
      localService: false,
      default: false,
      price: 0.3,
      powered_by: "saypi.ai",
      voiceURI: "",
    };
  };
}
