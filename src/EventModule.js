import ButtonModule from "./ButtonModule";
export default class EventModule {
  static handleAudioEvents() {
    window.addEventListener(
      "saypi:transcribed",
      EventModule.handleTranscriptionResponse
    );
  }

  static handleTranscriptionResponse(transcriptionEvent) {
    var transcript = transcriptionEvent.detail.text;
    var textarea = document.getElementById("prompt");
    EventModule.simulateTyping(textarea, transcript + " ");
    console.log("Transcript: " + transcript);
  }

  static simulateTyping(element, text) {
    const buttonModule = new ButtonModule();
    var words = text.split(" ");
    var i = 0;

    const typeWord = () => {
      if (i < words.length) {
        EventModule.setNativeValue(element, element.value + words[i++] + " ");
        requestAnimationFrame(typeWord);
      } else {
        buttonModule.handleAutoSubmit();
      }
    };

    typeWord();
  }

  static setNativeValue(element, value) {
    let lastValue = element.value;
    element.value = value;
    let event = new Event("input", { target: element, bubbles: true });
    // React 15
    event.simulated = true;
    // React 16-17
    let tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
  }
}
