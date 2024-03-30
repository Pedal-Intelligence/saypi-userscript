import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import axios from "axios";

jest.mock("axios");

describe("TextToSpeechService", () => {
  let textToSpeechService: TextToSpeechService;

  beforeEach(() => {
    textToSpeechService = new TextToSpeechService("http://example.com");
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create an instance of TextToSpeechService", () => {
    expect(textToSpeechService).toBeInstanceOf(TextToSpeechService);
  });

  it("should get voices", async () => {
    const mockVoices = [
      { id: "1", name: "Voice 1" },
      { id: "2", name: "Voice 2" },
    ];
    (axios.get as jest.Mock).mockResolvedValue({ data: mockVoices });

    const voices = await textToSpeechService.getVoices();

    expect(axios.get).toHaveBeenCalledWith("http://example.com/voices");
    expect(voices).toEqual(mockVoices);
  });

  // Add more test cases for other methods in TextToSpeechService
});
