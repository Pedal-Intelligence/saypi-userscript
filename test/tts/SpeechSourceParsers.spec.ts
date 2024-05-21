import { test } from "vitest";
import { PiSpeechSourceParser } from "../../src/tts/SpeechSynthesisModule";

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
