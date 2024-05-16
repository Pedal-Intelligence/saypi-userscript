import axios from "axios";
import {
  SpeechSynthesisUtteranceRemote,
  SpeechSynthesisVoiceRemote,
} from "./SpeechSynthesisModule";

export class TextToSpeechService {
  private sequenceNumbers: { [key: string]: number } = {};

  public async getVoiceById(id: string): Promise<SpeechSynthesisVoiceRemote> {
    const response = await axios.get(`${this.serviceUrl}/voices/${id}`);
    return response.data;
  }

  public async getVoices(): Promise<SpeechSynthesisVoiceRemote[]> {
    const response = await axios.get(`${this.serviceUrl}/voices`);
    return response.data;
  }

  private serviceUrl: string;

  public constructor(serviceUrl: string) {
    this.serviceUrl = serviceUrl;
  }

  public async createSpeech(
    uuid: string,
    text: string,
    voice: SpeechSynthesisVoiceRemote,
    lang: string,
    stream: boolean
  ): Promise<SpeechSynthesisUtteranceRemote> {
    const voice_id = voice.id;
    const data = { voice: voice_id, text: text, lang: lang };
    const baseUri = `${this.serviceUrl}/speak/${uuid}`;
    const queryParams = `voice_id=${voice_id}&lang=${lang}`;
    let uri = stream
      ? `${baseUri}/stream?${queryParams}`
      : `${baseUri}?${queryParams}`;

    const utterance: SpeechSynthesisUtteranceRemote = {
      id: uuid,
      text: text,
      lang: lang,
      voice: voice,
      uri: uri,
    };
    const response = await axios.post(uri, data); // post creates, put updates
    if (![200, 201].includes(response.status)) {
      throw new Error("Failed to synthesize speech");
    }
    return utterance;
  }

  public async addTextToSpeechStream(
    uuid: string,
    text: string
  ): Promise<void> {
    if (!this.sequenceNumbers[uuid]) {
      this.sequenceNumbers[uuid] = 0;
    }
    const sequenceNumber = this.sequenceNumbers[uuid]++;
    const data = { text: text, sequenceNumber: sequenceNumber };
    const uri = `${this.serviceUrl}/speak/${uuid}/stream`;
    const response = await axios.put(uri, data); // post creates, put updates
    if (![200, 201].includes(response.status)) {
      throw new Error("Failed to add text to speech stream");
    }
  }
}
