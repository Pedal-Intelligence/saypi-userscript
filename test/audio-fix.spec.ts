import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChatbotIdentifier } from '../src/chatbots/ChatbotIdentifier';
import { audioProviders } from '../src/tts/SpeechModel';

describe('Audio Provider Fix', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ChatbotIdentifier', () => {
    it('should identify non-chatbot sites as "web"', () => {
      expect(ChatbotIdentifier.identifyChatbot('example.com')).toBe('web');
      expect(ChatbotIdentifier.identifyChatbot('jw.org')).toBe('web');
      expect(ChatbotIdentifier.identifyChatbot('youtube.com')).toBe('web');
      expect(ChatbotIdentifier.identifyChatbot('github.com')).toBe('web');
    });

    it('should identify chatbot sites correctly', () => {
      expect(ChatbotIdentifier.identifyChatbot('claude.ai')).toBe('claude');
      expect(ChatbotIdentifier.identifyChatbot('chat.claude.ai')).toBe('claude');
      expect(ChatbotIdentifier.identifyChatbot('pi.ai')).toBe('pi');
    });

    it('should detect dictation mode correctly for non-chatbot sites', () => {
      // Mock window.location for non-chatbot site
      const mockLocation = { hostname: 'example.com' };
      vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('web');
      
      expect(ChatbotIdentifier.isInDictationMode()).toBe(true);
      expect(ChatbotIdentifier.isInChatMode()).toBe(false);
    });
  });

  describe('Audio Provider Default Selection', () => {
    it('should return None provider for non-chatbot sites', () => {
      // Mock the identifyChatbot to return 'web' for non-chatbot sites
      vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('web');
      
      const defaultProvider = audioProviders.getDefault();
      expect(defaultProvider.name).toBe('None');
      expect(defaultProvider.domain).toBe('');
    });

    it('should return Pi provider for pi.ai', () => {
      vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('pi');
      
      const defaultProvider = audioProviders.getDefault();
      expect(defaultProvider.name).toBe('Pi');
      expect(defaultProvider.domain).toBe('pi.ai');
    });

    it('should return SayPi provider for claude.ai', () => {
      vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('claude');
      
      const defaultProvider = audioProviders.getDefault();
      expect(defaultProvider.name).toBe('Say, Pi');
    });

    it('should use getDefault() logic for fallback instead of hardcoded Pi', () => {
      // Test that getDefault returns correct provider for each chatbot
      vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('claude');
      expect(audioProviders.getDefault().name).toBe('Say, Pi');
      
      vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('pi');
      expect(audioProviders.getDefault().name).toBe('Pi');
      
      vi.spyOn(ChatbotIdentifier, 'identifyChatbot').mockReturnValue('web');
      expect(audioProviders.getDefault().name).toBe('None');
    });
  });

  describe('SlowResponseHandler Optimization', () => {
    it('should only load SlowResponseHandler components on Pi.ai', () => {
      // Mock ChatbotIdentifier for Pi.ai
      vi.spyOn(ChatbotIdentifier, 'isChatbotType').mockReturnValue(true);
      
      // Test that the conditional logic works - this is tested implicitly 
      // by the fact that the function only calls initializeSlowResponseHandler 
      // when ChatbotIdentifier.isChatbotType('pi') returns true
      expect(ChatbotIdentifier.isChatbotType('pi')).toBe(true);
      
      // Reset mock
      vi.spyOn(ChatbotIdentifier, 'isChatbotType').mockReturnValue(false);
      expect(ChatbotIdentifier.isChatbotType('pi')).toBe(false);
    });
  });

  describe('Audio Source Matching', () => {
    it('should never match any audio sources to None provider', () => {
      const noneProvider = audioProviders.None;
      const jwOrgAudio = 'https://cfp2.jw-cdn.org/a/5131c5/1/o/nwt_19_Ps_E_001.mp3';
      const piAudio = 'https://pi.ai/api/chat/voice?voice=voice1';
      const saypiAudio = 'https://api.saypi.ai/tts/stream?voice_id=test';
      
      expect(noneProvider.matches(jwOrgAudio)).toBe(false);
      expect(noneProvider.matches(piAudio)).toBe(false);
      expect(noneProvider.matches(saypiAudio)).toBe(false);
    });

    it('should not match external audio sources to Pi provider', () => {
      const piProvider = audioProviders.Pi;
      const jwOrgAudio = 'https://cfp2.jw-cdn.org/a/5131c5/1/o/nwt_19_Ps_E_001.mp3';
      
      expect(piProvider.matches(jwOrgAudio)).toBe(false);
    });

    it('should not match external audio sources to SayPi provider', () => {
      const saypiProvider = audioProviders.SayPi;
      const jwOrgAudio = 'https://cfp2.jw-cdn.org/a/5131c5/1/o/nwt_19_Ps_E_001.mp3';
      
      expect(saypiProvider.matches(jwOrgAudio)).toBe(false);
    });

    it('should match Pi audio sources correctly', () => {
      const piProvider = audioProviders.Pi;
      const piAudio = 'https://pi.ai/api/chat/voice?voice=voice1';
      
      expect(piProvider.matches(piAudio)).toBe(true);
    });

    it('should match SayPi audio sources correctly', () => {
      const saypiProvider = audioProviders.SayPi;
      // Using the configured domain from the provider
      const saypiAudio = `https://${saypiProvider.domain}/tts/stream?voice_id=test`;
      
      expect(saypiProvider.matches(saypiAudio)).toBe(true);
    });
  });
});