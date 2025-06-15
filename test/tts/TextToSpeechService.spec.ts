import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { mockVoices } from "../data/Voices";
import { audioProviders } from "../../src/tts/SpeechModel";
import * as ApiClient from "../../src/ApiClient";
import { Chatbot } from "../../src/chatbots/Chatbot";
import { ChatbotIdentifier } from "../../src/chatbots/ChatbotIdentifier";

// Mock the callApi function
vi.mock("../../src/ApiClient", () => ({
  callApi: vi.fn(),
}));

describe("TextToSpeechService", () => {
  let textToSpeechService: TextToSpeechService;
  const mockVoice = mockVoices[0];

  beforeEach(() => {
    // Ensure ChatbotIdentifier returns 'pi' for these tests regardless of host
    vi.spyOn(ChatbotIdentifier, "getAppId").mockReturnValue("pi");
    textToSpeechService = new TextToSpeechService("http://example.com");
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create an instance of TextToSpeechService", () => {
    expect(textToSpeechService).toBeInstanceOf(TextToSpeechService);
  });

  it("should get voices", async () => {
    const mockResponse = new Response(JSON.stringify(mockVoices), { status: 200 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    const voices = await textToSpeechService.getVoices();

    expect(ApiClient.callApi).toHaveBeenCalledWith("http://example.com/voices?app=pi");
    expect(voices).toEqual(mockVoices);
  });

  it("should get voice by ID", async () => {
    const mockResponse = new Response(JSON.stringify(mockVoice), { status: 200 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    const voice = await textToSpeechService.getVoiceById(mockVoice.id);

    expect(ApiClient.callApi).toHaveBeenCalledWith(
      `http://example.com/voices/${mockVoice.id}`
    );
    expect(voice).toEqual(mockVoice);
  });

  it("should create speech", async () => {
    const expectedSpeech = {
      id: "uuid",
      lang: "en-US",
      voice: mockVoice,
      uri: `http://example.com/speak/uuid?voice_id=${mockVoice.id}&lang=en-US&app=mockbot`,
      provider: audioProviders.SayPi,
    };
    const mockResponse = new Response(JSON.stringify(expectedSpeech), { status: 200 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    const mockChatbot = {
      getID: vi.fn().mockReturnValue("mockbot"),
    } as unknown as Chatbot;

    const actualSpeech = await textToSpeechService.createSpeech(
      "uuid",
      "Hello",
      mockVoice,
      "en-US",
      false,
      mockChatbot
    );

    const call = (ApiClient.callApi as any).mock.calls[0];
    expect(call[0]).toBe(`http://example.com/speak/uuid?voice_id=${mockVoice.id}&lang=en-US&app=mockbot`);
    expect(JSON.parse(call[1].body)).toEqual({ voice: mockVoice.id, text: "Hello", lang: "en-US", sequenceNumber: 0 });
    expect(call[1].method).toBe("POST");
    expect(call[1].headers).toEqual({ "Content-Type": "application/json" });
    expect(actualSpeech).toEqual(expectedSpeech);
  });

  it("should add text to speech stream", async () => {
    const mockResponse = new Response(null, { status: 200 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    await textToSpeechService.addTextToSpeechStream("uuid", "Hello");

    const call = (ApiClient.callApi as any).mock.calls[0];
    expect(call[0]).toBe("http://example.com/speak/uuid/stream");
    expect(JSON.parse(call[1].body)).toEqual({ text: "Hello", sequenceNumber: 1 });
    expect(call[1].method).toBe("PUT");
    expect(call[1].headers).toEqual({ "Content-Type": "application/json" });
  });

  it("should throw error when voice request fails", async () => {
    const mockResponse = new Response(null, { status: 404 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    await expect(textToSpeechService.getVoiceById("nonexistent")).rejects.toThrow(
      "Failed to get voice: 404"
    );
  });

  it("should throw error when speech synthesis fails", async () => {
    const mockResponse = new Response(null, { status: 500 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    await expect(
      textToSpeechService.createSpeech("uuid", "Hello", mockVoice, "en-US", false)
    ).rejects.toThrow("Failed to synthesize speech");
  });
});
