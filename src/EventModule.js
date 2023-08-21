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
    console.log("dispatching event: " + eventName);
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
    var textarea = document.getElementById("saypi-prompt");
    EventModule.simulateTyping(textarea, transcript + " ");
    console.log("Transcript: " + transcript);
  }

  static simulateTyping(element, text) {
    var words = text.split(" ");
    var i = 0;

    const typeWord = () => {
      if (i < words.length) {
        EventModule.setNativeValue(element, element.value + words[i++] + " ");
        requestAnimationFrame(typeWord);
      } else {
        EventModule.dispatchCustomEvent("saypi:autoSubmit");
        //buttonModule.handleAutoSubmit();
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
    dispatchCustomEvent("audio:startRecording");
  }

  static handleTalkMouseUp() {
    dispatchCustomEvent("audio:stopRecording");
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
    this.dispatchCustomEvent("audio:startRecording");
  }

  static handleTalkTouchEnd(button) {
    this.dispatchCustomEvent("audio:stopRecording");
  }

  static setContext(ctx) {
    this.context = ctx;
  }

  static registerOtherAudioButtonEvents(button) {
    // "warm up" the microphone by acquiring it before the user presses the button
    button.addEventListener("mouseenter", () => {
      EventModule.dispatchCustomEvent("audio:setupRecording");
    });
    button.addEventListener("mouseleave", () => {
      EventModule.dispatchCustomEvent("audio:tearDownRecording");
    });
    window.addEventListener("beforeunload", () => {
      EventModule.dispatchCustomEvent("audio:tearDownRecording");
    });
    button.addEventListener("touchcancel", () => {
      EventModule.dispatchCustomEvent("audio:tearDownRecording");
    });
  }

  static registerCustomAudioEventListeners() {
    window.addEventListener("saypi:piReadyToRespond", function (e) {
      if (isSafari()) {
        EventModule.dispatchCustomEvent("saypi:awaitingUserInput");
      }
    });

    window.addEventListener("audio:loading", function (e) {
      // Handle the piSpeaking event, e.g., start an animation or show a UI element.
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

  /* events to direct the audio module to start/stop recording */

  static registerHotkey() {
    let ctrlDown = false;

    document.addEventListener("keydown", (event) => {
      if (event.ctrlKey && event.code === "Space" && !ctrlDown) {
        ctrlDown = true;
        this.dispatchCustomEvent("audio:startRecording");
      }
    });

    document.addEventListener("keyup", (event) => {
      if (ctrlDown && event.code === "Space") {
        ctrlDown = false;
        this.dispatchCustomEvent("audio:stopRecording");
      }
    });
  }
}
