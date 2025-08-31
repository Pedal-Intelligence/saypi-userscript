import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioProviders } from '../../src/tts/SpeechModel';
import { ChatbotIdentifier } from '../../src/chatbots/ChatbotIdentifier';

describe('audioProviders', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('matches ChatGPT blob and https sources', () => {
    const p = audioProviders.ChatGPT;
    expect(p.matches('https://chatgpt.com/audio/track.mp3')).toBe(true);
    expect(p.matches('https://chat.openai.com/some/path')).toBe(true);
    expect(p.matches('blob:https://chatgpt.com/4242708c-3c9f-463d-9b6c-0fb1145db1b5')).toBe(true);
    expect(p.matches('blob:https://chat.openai.com/uuid')).toBe(true);
  });

  it('returns ChatGPT as default on chatgpt host', () => {
    const spy = vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('chatgpt');
    expect(audioProviders.getDefault().name).toBe('ChatGPT');
    spy.mockRestore();
  });
});

