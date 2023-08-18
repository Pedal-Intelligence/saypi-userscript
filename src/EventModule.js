import ButtonModule from "./ButtonModule";
export default class EventModule {
  static context = window;
  static init() {
    // All the event listeners can be added here
    this.handleAudioEvents();
    // Any other initializations...
  }

  static cleanup() {
    // Remove event listeners if needed, or any other cleanup operations
    window.removeEventListener(
      "saypi:transcribed",
      this.handleTranscriptionResponse
    );
  }

  // Dispatch Custom Event
  // TODO: remove duplicated function from transcriber.js
  static dispatchCustomEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }

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

  static handleTalkMouseDown() {
    EventModule.idPromptTextArea();
    this.context.startRecording();
  }

  static handleTalkMouseUp() {
    if (typeof this.context?.stopRecording === "function") {
      this.context.stopRecording();
    }
  }

  static handleTalkDoubleClick(button) {
    // Toggle the CSS classes to indicate the mode
    button.classList.toggle("autoSubmit");
    if (button.getAttribute("data-autosubmit") === "true") {
      button.setAttribute("data-autosubmit", "false");
      console.log("autosubmit disabled");
    } else {
      button.setAttribute("data-autosubmit", "true");
      console.log("autosubmit enabled");
    }
  }

  static handleTalkTouchStart(button, e) {
    e.preventDefault();
    EventModule.idPromptTextArea();
    this.context.startRecording();
    button.classList.add("active");
  }

  static handleTalkTouchEnd(button) {
    button.classList.remove("active");
    this.context.stopRecording();
  }

  static setContext(ctx) {
    this.context = ctx;
  }

  static idPromptTextArea() {
    var textarea = document.getElementById("prompt");
    if (!textarea) {
      // Find the first <textarea> element and give it an id
      var textareaElement = document.querySelector("textarea");
      if (textareaElement) {
        textareaElement.id = "prompt";
      } else {
        console.warn("No <textarea> element found");
      }
    }
  }

  static registerOtherAudioButtonEvents(button) {
    // "warm up" the microphone by acquiring it before the user presses the button
    button.addEventListener("mouseenter", () => {
      EventModule.dispatchCustomEvent("saypi:requestSetupRecording");
    });
    button.addEventListener("mouseleave", () => {
      EventModule.dispatchCustomEvent("saypi:requestTearDownRecording");
    });
    window.addEventListener("beforeunload", () => {
      EventModule.dispatchCustomEvent("saypi:requestTearDownRecording");
    });
    button.addEventListener("touchcancel", () => {
      button.classList.remove("active"); // Remove the active class (for Firefox on Android)
      EventModule.dispatchCustomEvent("saypi:requestTearDownRecording");
    });
  }

  static registerCustomAudioEventListeners() {
    window.addEventListener("saypi:piReadyToRespond", function (e) {
      console.log("piReadyToRespond event received by UI script");
      if (isSafari()) {
        EventModule.dispatchCustomEvent("saypi:awaitingUserInput");
      }
    });

    window.addEventListener("saypi:piSpeaking", function (e) {
      // Handle the piSpeaking event, e.g., start an animation or show a UI element.
      console.log("piSpeaking event received by UI script");
      if (isSafari()) {
        EventModule.dispatchCustomEvent("saypi:receivedUserInput");
      }
    });
  }

  // TODO: dedupe this function from transcriber.js
  // where should it live?
  static isSafari() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }
}
