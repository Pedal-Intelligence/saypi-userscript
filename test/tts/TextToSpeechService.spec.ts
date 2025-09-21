import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import type { SpyInstance } from "vitest";
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

// Mock the usage analytics modules
vi.mock("../../src/usage/ClientIdManager");
vi.mock("../../src/usage/VersionManager");

describe("TextToSpeechService", () => {
  let textToSpeechService: TextToSpeechService;
  const mockVoice = mockVoices[0];
  let getAppIdSpy: SpyInstance;

  beforeEach(async () => {
    // Ensure ChatbotIdentifier returns 'pi' for these tests regardless of host
    getAppIdSpy = vi.spyOn(ChatbotIdentifier, "getAppId").mockReturnValue("pi");
    
    // Mock the usage analytics functions
    const { getClientId } = await import("../../src/usage/ClientIdManager");
    const { getExtensionVersion } = await import("../../src/usage/VersionManager");
    vi.mocked(getClientId).mockResolvedValue("test-client-id-12345");
    vi.mocked(getExtensionVersion).mockReturnValue("1.0.0-test");
    
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

  it("omits app query parameter when no app id is available", async () => {
    const mockResponse = new Response(JSON.stringify(mockVoices), { status: 200 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    getAppIdSpy.mockReturnValueOnce(undefined as any);

    const voices = await textToSpeechService.getVoices();

    expect(ApiClient.callApi).toHaveBeenCalledWith("http://example.com/voices");
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
    
    // Updated expectation to include usage analytics metadata
    const requestBody = JSON.parse(call[1].body);
    expect(requestBody).toEqual({
      voice: mockVoice.id,
      text: "Hello",
      lang: "en-US",
      sequenceNumber: 0,
      clientId: "test-client-id-12345",
      version: "1.0.0-test",
      app: "mockbot"
    });
    
    expect(call[1].method).toBe("POST");
    expect(call[1].headers).toEqual({ "Content-Type": "application/json" });
    expect(actualSpeech).toEqual(expectedSpeech);
  });

  it("omits app metadata when app id cannot be resolved", async () => {
    const expectedSpeech = {
      id: "uuid",
      lang: "en-US",
      voice: mockVoice,
      uri: `http://example.com/speak/uuid?voice_id=${mockVoice.id}&lang=en-US`,
      provider: audioProviders.SayPi,
    };
    const mockResponse = new Response(JSON.stringify(expectedSpeech), { status: 200 });
    (ApiClient.callApi as any).mockResolvedValue(mockResponse);

    getAppIdSpy.mockReturnValueOnce(undefined as any).mockReturnValueOnce(undefined as any);

    const actualSpeech = await textToSpeechService.createSpeech(
      "uuid",
      "Hello",
      mockVoice,
      "en-US",
      false
    );

    const call = (ApiClient.callApi as any).mock.calls[0];
    expect(call[0]).toBe(`http://example.com/speak/uuid?voice_id=${mockVoice.id}&lang=en-US`);

    const requestBody = JSON.parse(call[1].body);
    expect(requestBody).toEqual({
      voice: mockVoice.id,
      text: "Hello",
      lang: "en-US",
      sequenceNumber: 0,
      clientId: "test-client-id-12345",
      version: "1.0.0-test",
    });

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
