import { describe, it, beforeAll, beforeEach, expect, vi } from 'vitest';
import * as ApiClient from '../src/ApiClient';

// Mock ApiClient.callApi to control the response
vi.mock('../src/ApiClient', () => ({
  callApi: vi.fn(),
}));

// Avoid bootstrapping analytics machine via StateMachineService
const sendMock = vi.fn();
vi.mock('../src/StateMachineService.js', () => ({
  default: { conversationActor: { send: sendMock } },
}));

// Mock prefs used by uploadAudio
vi.mock('../src/prefs/PreferenceModule', () => ({
  UserPreferenceModule: {
    getInstance: () => ({
      getCachedLanguage: () => 'en-US',
      getCachedTranscriptionMode: () => null,
      getCachedDiscretionaryMode: () => false,
      getCachedRemoveFillerWords: () => false,
    }),
  },
}));

// Mock chatbot service
vi.mock('../src/chatbots/ChatbotService', () => ({
  ChatbotService: {
    getChatbot: vi.fn().mockResolvedValue({
      getID: () => 'mockbot',
      getNickname: () => Promise.resolve(null),
      getName: () => 'Mock Bot',
    }),
  },
}));

// Minimal config mock
vi.mock('../src/ConfigModule.js', () => ({
  config: { apiServerUrl: 'http://api.example.com' },
}));

describe('TranscriptionModule forwards tempo and pFinishedSpeaking', () => {
  let uploadAudioWithRetry: any;

  beforeAll(async () => {
    ({ uploadAudioWithRetry } = await import('../src/TranscriptionModule'));
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes tempo and pFinishedSpeaking in saypi:transcribed event payload', async () => {
    const audioBlob = new Blob(['test'], { type: 'audio/webm' });
    const responseJson = {
      text: 'I need a moment to...',
      tempo: 0.8611111111111112,
      pFinishedSpeaking: 0.2,
      sequenceNumber: 7,
    };
    (ApiClient.callApi as any).mockResolvedValue(
      new Response(JSON.stringify(responseJson), { status: 200 })
    );

    await uploadAudioWithRetry(audioBlob, 1500, {});

    // Find the call that sent the transcribed event
    const calls = sendMock.mock.calls.filter((c) => c[0] === 'saypi:transcribed');
    expect(calls.length).toBe(1);
    const payload = calls[0][1];
    expect(payload).toMatchObject({
      text: responseJson.text,
      sequenceNumber: responseJson.sequenceNumber,
      tempo: responseJson.tempo,
      pFinishedSpeaking: responseJson.pFinishedSpeaking,
    });
  });
});

