import { describe, it, beforeAll, beforeEach, expect, vi } from "vitest";
import * as ApiClient from "../src/ApiClient";
import { ChatbotService } from "../src/chatbots/ChatbotService";

// Mock ApiClient.callApi to capture the request
vi.mock("../src/ApiClient", () => ({
  callApi: vi.fn(),
}));

// Avoid bootstrapping analytics machine via StateMachineService in this unit test
vi.mock("../src/StateMachineService.js", () => ({
  default: { conversationActor: { send: vi.fn() } }
}));

// Mock usage analytics modules
vi.mock("../src/usage/ClientIdManager", () => ({
  getClientId: vi.fn().mockResolvedValue("test-client-id-abc"),
}));
vi.mock("../src/usage/VersionManager", () => ({
  getExtensionVersion: vi.fn().mockReturnValue("1.2.3-test"),
}));

// Mock preferences to control language and flags
vi.mock("../src/prefs/PreferenceModule", () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getCachedLanguage: () => "en-US",
      getCachedTranscriptionMode: () => null,
      getCachedDiscretionaryMode: () => false,
      getCachedRemoveFillerWords: () => false,
    }),
  },
}));

// Mock chatbot service
vi.mock("../src/chatbots/ChatbotService", () => ({
  ChatbotService: {
    getChatbot: vi.fn(),
  },
}));

// Minimal config mock
vi.mock("../src/ConfigModule.js", () => ({
  config: { apiServerUrl: "http://api.example.com" },
}));

describe("TranscriptionModule form data analytics fields", () => {
  let uploadAudioWithRetry: any;

  beforeAll(async () => {
    ({ uploadAudioWithRetry } = await import("../src/TranscriptionModule"));
  });
  beforeEach(() => {
    vi.clearAllMocks();
    // chatbot id
    (ChatbotService.getChatbot as any).mockResolvedValue({
      getID: () => "mockbot",
      getNickname: () => Promise.resolve(null),
      getName: () => "Mock Bot",
    });
  });

  it("includes clientId, app, language, version in form data", async () => {
    const audioBlob = new Blob(["test"], { type: "audio/webm" });
    // Capture FormData.append calls
    const appended: Array<[string, any, any?]> = [];
    const originalAppend = (FormData.prototype as any).append;
    (FormData.prototype as any).append = function(key: string, value: any, filename?: any) {
      appended.push([key, value, filename]);
      if (typeof filename !== 'undefined') {
        return originalAppend.call(this, key, value, filename);
      }
      return originalAppend.call(this, key, value);
    };
    // Mock API to return OK with required JSON
    const responseJson = { text: "ok", sequenceNumber: 1 };
    (ApiClient.callApi as any).mockResolvedValue(
      new Response(JSON.stringify(responseJson), { status: 200 })
    );

    await uploadAudioWithRetry(audioBlob, 1000, {});

    const call = (ApiClient.callApi as any).mock.calls[0];
    // URL should have lowercased app and valid language when present
    expect(call[0]).toMatch(/^http:\/\/api\.example\.com\/transcribe\?(.+)?$/);
    const url = new URL(call[0]);
    expect(url.searchParams.get("app")).toBe("mockbot");
    expect(url.searchParams.get("language")).toBe("en-US");

    // Body should be FormData including our analytics fields
    expect(call[1].body instanceof FormData).toBe(true);
    // Validate via captured append calls to avoid JSDOM FormData quirks
    const asMap = new Map(appended.map(([k, v]) => [k, v]));
    expect(asMap.get("clientId")).toBe("test-client-id-abc");
    expect(asMap.get("version")).toBe("1.2.3-test");
    expect(asMap.get("app")).toBe("mockbot");
    expect(asMap.get("language")).toBe("en-US");
    // Restore append
    (FormData.prototype as any).append = originalAppend;
  });
});


