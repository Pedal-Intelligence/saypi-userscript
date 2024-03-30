import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { SpeechSynthesisUtteranceRemote } from "../../src/tts/SpeechSynthesisModule";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { ElevenLabsVoice, voices } from "../data/Voices";

jest.mock("./TextToSpeechService");

describe("AudioStreamManager", () => {
  let audioStreamManager: AudioStreamManager;
  let textToSpeechService: TextToSpeechService;
  const mockVoice: ElevenLabsVoice = voices[0];

  beforeEach(() => {
    textToSpeechService = new TextToSpeechService("http://example.com");
    audioStreamManager = new AudioStreamManager(textToSpeechService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create an instance of AudioStreamManager", () => {
    expect(audioStreamManager).toBeInstanceOf(AudioStreamManager);
    it("should create a stream", async () => {
      const mockUtterance: SpeechSynthesisUtteranceRemote = {
        id: "uuid",
        text: "Hello",
        lang: "en-US",
        voice: mockVoice,
        uri: "http://example.com/speak/uuid",
      };
      (textToSpeechService.createSpeech as jest.Mock).mockResolvedValue(
        mockUtterance
      );

      const utterance = await audioStreamManager.createStream(
        "uuid",
        mockVoice,
        "en-US"
      );

      expect(textToSpeechService.createSpeech).toHaveBeenCalledWith(
        "uuid",
        " ",
        { id: "1", name: "Voice 1" },
        "en-US",
        true
      );
      expect(utterance).toEqual(mockUtterance);
    });

    // Add more test cases for other methods in AudioStreamManager
  });
});
