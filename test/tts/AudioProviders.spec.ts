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

  describe('retrieveProviderByEngine', () => {
    it('maps OpenAI value-tier voices to the SayPi provider (issue #215/#92)', () => {
      // OpenAI TTS is streamed from api.saypi.ai like ElevenLabs, so it is a
      // SayPi-served voice from the client's perspective.
      expect(audioProviders.retrieveProviderByEngine('OpenAI')).toBe(audioProviders.SayPi);
    });

    it('still maps the known ElevenLabs and inflection.ai engines', () => {
      expect(audioProviders.retrieveProviderByEngine('ElevenLabs')).toBe(audioProviders.SayPi);
      expect(audioProviders.retrieveProviderByEngine('inflection.ai')).toBe(audioProviders.Pi);
    });

    it('maps 60dB voices to the SayPi provider (server-side proxy of api.60db.ai)', () => {
      // 60dB TTS is streamed from api.saypi.ai over the same ?voice_id= stream
      // contract as ElevenLabs/OpenAI, so 60dB is a SayPi-served voice from the
      // client's perspective. Explicit case (not the default fallback) so it
      // routes without emitting the "unrecognised provider" warning.
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(audioProviders.retrieveProviderByEngine('60dB')).toBe(audioProviders.SayPi);
      expect(warn).not.toHaveBeenCalled();
      warn.mockRestore();
    });

    it('falls back to SayPi (and warns) instead of throwing on an unrecognised provider', () => {
      // Regression guard for #215/#92: an unknown powered_by used to throw,
      // crashing the synchronous voice-selection path. It must now degrade.
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(() => audioProviders.retrieveProviderByEngine('SomeFutureProvider')).not.toThrow();
      expect(audioProviders.retrieveProviderByEngine('SomeFutureProvider')).toBe(audioProviders.SayPi);
      expect(warn).toHaveBeenCalled();
      warn.mockRestore();
    });
  });
});

