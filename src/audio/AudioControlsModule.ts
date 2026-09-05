import EventBus from "../events/EventBus";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import { getAudioOutputToggle } from "../chatbots/AudioOutputToggle";

export default class AudioControlsModule {
  activateAudioInput(enable: boolean): void {
    if (enable) {
      const callButton = document.getElementById("saypi-callButton");
      if (callButton) {
        callButton.click();
      }
    }
  }

  activateAudioOutput(enable: boolean): void {
    if (!enable) return;

    // Hosts whose audio toggle is a behaviour rather than a decoratable element
    // own the mechanics themselves (Pi, whose control now lives inside a
    // popover it mounts on demand). Everyone else keeps the click-the-decorated-
    // button path.
    const toggle = getAudioOutputToggle(ChatbotIdentifier.identifyChatbot());
    if (toggle) {
      if (toggle.isAudioOutputEnabled()) return;
      this.skipNextIfHostReplaysLastMessage();
      // Fire-and-forget: both callers (a ConversationMachine action and
      // SubmitErrorHandler) are synchronous, and a drifted host surface should
      // degrade quietly rather than surface an unhandled rejection.
      toggle.setAudioOutputEnabled(true).catch((error) => {
        console.error("Failed to enable the host's audio output", error);
      });
      return;
    }

    if (!this.isAudioOutputEnabled()) {
      const audioOutputButton = document.getElementById(
        "saypi-audio-output-button"
      );
      if (audioOutputButton) {
        this.skipNextIfHostReplaysLastMessage();
        audioOutputButton.click();
      }
    }
  }

  /**
   * Pi.ai auto-plays the last message when audio output is enabled, which we
   * want to prevent when starting a call in an existing thread. Don't skip on
   * new/empty chats or during page navigation.
   */
  private skipNextIfHostReplaysLastMessage(): void {
    const chatbotId = ChatbotIdentifier.identifyChatbot();
    if (chatbotId === "pi" && this.hasChatHistory()) {
      EventBus.emit("audio:skipNext");
    }
  }

  private hasChatHistory(): boolean {
    // Check if there are any assistant messages in the chat history
    const assistantMessages = document.querySelectorAll(".assistant-message");
    return assistantMessages.length > 0;
  }

  isAudioOutputEnabled(): boolean {
    const toggle = getAudioOutputToggle(ChatbotIdentifier.identifyChatbot());
    if (toggle) {
      return toggle.isAudioOutputEnabled();
    }

    const svgPathElement = document.querySelector(
      "#saypi-audio-output-button svg path"
    );
    const svgPath = svgPathElement ? svgPathElement.getAttribute("d") : null;
    // TODO: validate the activePath (is it missing a character?)
    const activePath =
      "M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z";
    return svgPath === activePath;
  }

}
