import { vi } from "vitest";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechSynthesisModule";
import { voices as mockVoices } from "../data/Voices";

export const createMockUserPreferenceModule = () => ({
  getTranscriptionMode: vi.fn(() => Promise.resolve("balanced")),
  getSoundEffects: vi.fn(() => Promise.resolve(true)),
  getAutoSubmit: vi.fn(() => Promise.resolve(true)),
  getLanguage: vi.fn(() => Promise.resolve("en-US")),
  getTheme: vi.fn(() => Promise.resolve("light")),
  setTheme: vi.fn(() => Promise.resolve()),
  getDataSharing: vi.fn(() => Promise.resolve(false)),
  getPrefersImmersiveView: vi.fn(() => Promise.resolve(false)),
  hasVoice: vi.fn(() => Promise.resolve(true)),
  getVoice: vi.fn(() =>
    Promise.resolve(mockVoices[0] as SpeechSynthesisVoiceRemote)
  ),
  setVoice: vi.fn(() => Promise.resolve()),
  unsetVoice: vi.fn(() => Promise.resolve()),
});
