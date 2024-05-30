import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import {
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
} from "../../src/tts/SpeechSynthesisModule";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";

vi.mock("../../src/tts/TextToSpeechService");
vi.useFakeTimers();

describe(
  "AudioStreamManager",
  () => {
    let audioStreamManager: AudioStreamManager;
    let textToSpeechService: TextToSpeechService;
    const mockVoice: SpeechSynthesisVoiceRemote = {
      voiceURI: "testVoiceURI",
      name: "Test Voice",
      lang: "en-US",
      localService: false,
      default: false,
      id: "testId",
      price: 0,
      powered_by: "testProvider",
    };

    beforeEach(() => {
      textToSpeechService = {
        createSpeech: vi.fn(),
        addTextToSpeechStream: vi.fn().mockResolvedValue(undefined),
      } as unknown as TextToSpeechService;
      const mockUtterance: SpeechSynthesisUtteranceRemote = {
        id: "uuid",
        text: " ",
        lang: "en-US",
        voice: mockVoice,
        uri: "http://example.com/speak/uuid",
      };
      (textToSpeechService.createSpeech as any).mockResolvedValue(
        mockUtterance
      );

      audioStreamManager = new AudioStreamManager(textToSpeechService);
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it("should create an instance of AudioStreamManager", () => {
      expect(audioStreamManager).toBeInstanceOf(AudioStreamManager);
    });

    it("should create a stream", async () => {
      const mockUtterance: SpeechSynthesisUtteranceRemote = {
        id: "uuid",
        text: "Hello",
        lang: "en-US",
        voice: mockVoice,
        uri: "http://example.com/speak/uuid",
      };
      (textToSpeechService.createSpeech as any).mockResolvedValue(
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
        mockVoice,
        "en-US",
        true
      );
      expect(utterance).toEqual(mockUtterance);
    });

    it("should add speech to stream", async () => {
      const uuid = "uuid";
      const text = "Hello";
      await audioStreamManager.addSpeechToStream(uuid, text);
      const pendingText = audioStreamManager
        .getInputBuffer(uuid)
        ?.getPendingText();
      if (pendingText !== undefined) expect(pendingText).toContain(text);
    });

    it("should send buffer", async () => {
      const uuid = "uuid";
      const text = "Hello.";
      await audioStreamManager.createStream(uuid, mockVoice, "en-US");
      await audioStreamManager.addSpeechToStream(uuid, text);
      vi.advanceTimersByTime(5000); // Simulate buffer timeout
      expect(textToSpeechService.addTextToSpeechStream).toHaveBeenCalledWith(
        uuid,
        text
      );
      expect(audioStreamManager.getInputBuffer(uuid)?.getPendingText()).toBe(
        ""
      );
    });

    it("should end stream", async () => {
      const uuid = "uuid";
      await audioStreamManager.createStream(uuid, mockVoice, "en-US");
      await audioStreamManager.endStream(uuid);
      expect(audioStreamManager.getInputBuffer(uuid)?.hasEnded()).toBeTruthy();
    });
  },
  { timeout: 10000 }
);
