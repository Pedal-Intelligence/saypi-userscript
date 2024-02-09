import { Chatbot } from "./Chatbot";

class PiAIChatbot extends Chatbot {
  getPromptTextInputSelector(): string {
    return "textarea[enterkeyhint]";
  }

  getPromptSubmitButtonSelector(): string {
    return ".pi-submit-button"; // replace with actual submit button selector for pi.ai
  }

  getAudioControlsSelector(): string {
    return "audio + div";
  }

  getAudioOutputButtonSelector(): string {
    // audio button is the last button element in the audio controls container
    return "#saypi-audio-controls > div > div.relative.flex.items-center.justify-end.self-end.p-2 > button";
  }

  getControlPanelSelector(): string {
    return ".flex.items-center.grow";
  }

  getSidePanelSelector(): string {
    return "div.hidden.w-22.flex-col.items-center.gap-1.border-r";
  }
}

export { PiAIChatbot };
