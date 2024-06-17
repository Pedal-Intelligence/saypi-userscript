import {
  PiSpeech,
  SayPiSpeech,
  SpeechSynthesisVoiceRemote,
  SpeechUtterance,
} from "./SpeechModel";
import { SpeechSynthesisModule } from "./SpeechSynthesisModule";

interface SpeechSourceParser {
  parse(source: string): Promise<SpeechUtterance> | SpeechUtterance;
}

class PiSpeechSourceParser implements SpeechSourceParser {
  lang: string;

  constructor(default_lang: string = "en") {
    this.lang = default_lang;
  }

  public parse(source: string): SpeechUtterance {
    let url;
    try {
      url = new URL(source);
    } catch (_) {
      throw new Error(`Invalid source: ${source} is not a valid URL.`);
    }

    const params = url.searchParams;
    const messageSid = params.get("messageSid");
    const voiceId = params.get("voice");

    if (!messageSid || !voiceId) {
      throw new Error(
        `Invalid source: ${source} does not contain required parameters.`
      );
    }

    const voiceNumber = voiceId.slice(-1);

    const theVoice: SpeechSynthesisVoiceRemote = {
      id: voiceId,
      name: `Pi ${voiceNumber}`,
      lang: this.lang,
      localService: false,
      default: true,
      price: 0,
      powered_by: "inflection.ai",
      voiceURI: "", // inflection.ai doesn't provide this
    };

    return new PiSpeech(messageSid, this.lang, theVoice, source);
  }
}

class SayPiSpeechSourceParser implements SpeechSourceParser {
  private voiceModule: SpeechSynthesisModule;
  public constructor(voiceModule: SpeechSynthesisModule) {
    this.voiceModule = voiceModule;
  }

  /**
   * Matches URLs like https://api.saypi.ai/speak/5dbec6ff-9ee8-43fa-a9c1-e6bd51e9dfc6/stream?voice_id=ig1TeITnnNlsJtfHxJlW&lang=en-GB
   * @param source URL of the audio source
   * @returns SpeechUtterance
   */
  public async parse(source: string): Promise<SpeechUtterance> {
    let url;
    try {
      url = new URL(source);
    } catch (_) {
      throw new Error(`Invalid source: ${source} is not a valid URL.`);
    }

    const pathSegments = url.pathname.split("/");
    const speakIndex = pathSegments.indexOf("speak");
    const streamIndex = pathSegments.indexOf("stream");

    if (
      speakIndex === -1 ||
      streamIndex === -1 ||
      streamIndex <= speakIndex + 1
    ) {
      throw new Error(
        `Invalid source: ${source} is not a streaming speech URL.`
      );
    }

    const speechId = pathSegments[speakIndex + 1];
    const params = url.searchParams;
    const voiceId = params.get("voice_id");
    const lang = params.get("lang");

    if (!voiceId) {
      throw new Error(
        `Invalid source: ${source} does not contain required parameters: voice_id`
      );
    }

    const theVoice: SpeechSynthesisVoiceRemote =
      await this.voiceModule.getVoiceById(voiceId);

    return new SayPiSpeech(speechId, lang || "", theVoice, source);
  }
}
export { PiSpeechSourceParser, SayPiSpeechSourceParser };
