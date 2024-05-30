import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import axios from "axios";
import { mockVoices } from "../data/Voices";

vi.mock("axios");

describe("TextToSpeechService", () => {
  let textToSpeechService: TextToSpeechService;
  const mockVoice = mockVoices[0];

  beforeEach(() => {
    textToSpeechService = new TextToSpeechService("http://example.com");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create an instance of TextToSpeechService", () => {
    expect(textToSpeechService).toBeInstanceOf(TextToSpeechService);
  });

  it("should get voices", async () => {
    (axios.get as any).mockResolvedValue({ data: mockVoices });

    const voices = await textToSpeechService.getVoices();

    expect(axios.get).toHaveBeenCalledWith("http://example.com/voices");
    expect(voices).toEqual(mockVoices);
  });

  it("should get voice by ID", async () => {
    (axios.get as any).mockResolvedValue({ data: mockVoice });

    const voice = await textToSpeechService.getVoiceById(mockVoice.id);

    expect(axios.get).toHaveBeenCalledWith(
      `http://example.com/voices/${mockVoice.id}`
    );
    expect(voice).toEqual(mockVoice);
  });

  it("should create speech", async () => {
    const mockUtterance = {
      id: "uuid",
      text: "Hello",
      lang: "en-US",
      voice: mockVoice,
      uri: `http://example.com/speak/uuid?voice_id=${mockVoice.id}&lang=en-US`,
    };
    (axios.post as any).mockResolvedValue({ status: 200, data: mockUtterance });

    const utterance = await textToSpeechService.createSpeech(
      "uuid",
      "Hello",
      mockVoice,
      "en-US",
      false
    );

    expect(axios.post).toHaveBeenCalledWith(
      `http://example.com/speak/uuid?voice_id=${mockVoice.id}&lang=en-US`,
      { voice: mockVoice.id, text: "Hello", lang: "en-US" }
    );
    expect(utterance).toEqual(mockUtterance);
  });

  it("should add text to speech stream", async () => {
    (axios.post as any).mockResolvedValue({ status: 200 });
    (axios.put as any).mockResolvedValue({ status: 200 });

    await textToSpeechService.addTextToSpeechStream("uuid", "Hello");

    expect(axios.put).toHaveBeenCalledWith(
      "http://example.com/speak/uuid/stream",
      { sequenceNumber: 0, text: "Hello" }
    );
  });
});
