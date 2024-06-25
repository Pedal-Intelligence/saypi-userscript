import { Preference, VoicePreference } from "../../src/prefs/PreferenceModule";
import { SpeechSynthesisVoiceRemote } from "../../src/tts/SpeechModel";
import { vi } from "vitest";
import { mockVoices } from "../data/Voices";

export class UserPreferenceModuleMock {
  public static getInstance = vi.fn(() => new UserPreferenceModuleMock());

  public getTranscriptionMode = vi.fn(() =>
    Promise.resolve("balanced" as Preference)
  );
  public getSoundEffects = vi.fn(() => Promise.resolve(true));
  public getAutoSubmit = vi.fn(() => Promise.resolve(true));
  public getLanguage = vi.fn(() => Promise.resolve("en-US"));
  public getTheme = vi.fn(() => Promise.resolve("light"));
  public setTheme = vi.fn(() => Promise.resolve());
  public getDataSharing = vi.fn(() => Promise.resolve(false));
  public getPrefersImmersiveView = vi.fn(() => Promise.resolve(false));
  public hasVoice = vi.fn(() => Promise.resolve(true));
  public getVoice = vi.fn(() =>
    Promise.resolve(mockVoices[0] as SpeechSynthesisVoiceRemote)
  );
  public setVoice = vi.fn(() => Promise.resolve());
  public unsetVoice = vi.fn(() => Promise.resolve());

  private getStoredValue(key: string, defaultValue: any): Promise<any> {
    return new Promise((resolve) => {
      resolve(defaultValue);
    });
  }
}
