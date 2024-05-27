import { test, vi } from "vitest";
import { SpeechSynthesisModule } from "../../src/tts/SpeechSynthesisModule";
import { TextToSpeechService } from "../../src/tts/TextToSpeechService";
import { AudioStreamManager } from "../../src/tts/AudioStreamManager";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";
import {
  PiSpeechSourceParser,
  SayPiSpeechSourceParser,
} from "../../src/tts/SpeechSourceParsers";

vi.mock("../../src/tts/SpeechSynthesisModule", () => {
  return {
    SpeechSynthesisModule: vi.fn().mockImplementation(() => {
      return {
        getVoiceById: vi.fn().mockImplementation((voiceId: string) => {
          return {
            id: voiceId,
            name: "Samantha",
            lang: "en",
            localService: false,
            default: false,
            price: 0.3,
            powered_by: "saypi.ai",
            voiceURI: "",
          };
        }),
      };
    }),
  };
});

test("PiSpeechSourceParser should parse the URL correctly", async ({
  expect,
}) => {
  const source =
    "https://pi.ai/api/chat/voice?mode=eager&voice=voice1&messageSid=neBP3hiXCNapu3BYFztb6";
  const parser = new PiSpeechSourceParser("en");

  const result = parser.parse(source);

  expect(result).toEqual({
    id: "neBP3hiXCNapu3BYFztb6",
    text: "",
    lang: "en",
    uri: source,
    voice: {
      id: "voice1",
      name: "Pi 1",
      lang: "en",
      localService: false,
      default: true,
      price: 0,
      powered_by: "inflection.ai",
      voiceURI: "",
    },
  });
});

test("PiSpeechSourceParser should throw an error if the URL is invalid", async ({
  expect,
}) => {
  const source = "invalid-url";
  const parser = new PiSpeechSourceParser("en");

  expect(() => parser.parse(source)).toThrowError(
    `Invalid source: ${source} is not a valid URL.`
  );
});

test("SayPiSpeechSourceParser should parse the URL correctly", async ({
  expect,
}) => {
  const source =
    "https://localhost:5001/speak/48e3c44b-ceb5-4052-a639-2e2f1466002e/stream?voice_id=ig1TeITnnNlsJtfHxJlW&lang=en-GB";
  const mockVoiceModule = new SpeechSynthesisModule(
    {} as TextToSpeechService,
    {} as AudioStreamManager,
    {} as UserPreferenceModule
  );
  const parser = new SayPiSpeechSourceParser(mockVoiceModule);
  const result = await parser.parse(source);
  expect(result).toEqual({
    id: "48e3c44b-ceb5-4052-a639-2e2f1466002e",
    text: "",
    lang: "en-GB",
    uri: source,
    voice: {
      id: "ig1TeITnnNlsJtfHxJlW",
      name: "Samantha",
      lang: "en",
      localService: false,
      default: false,
      price: 0.3,
      powered_by: "saypi.ai",
      voiceURI: "",
    },
  });
});
