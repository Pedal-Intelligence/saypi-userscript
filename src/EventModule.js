import StateMachineService from "./StateMachineService.js";

const USER_SPEAKING = "saypi:userSpeaking";
const USER_STOPPED_SPEAKING = "saypi:userStoppedSpeaking";
const USER_FINISHED_SPEAKING = "saypi:userFinishedSpeaking";
const TRANSCRIBING = "saypi:transcribing";
const PI_SPEAKING = "saypi:piSpeaking";
const PI_STOPPED_SPEAKING = "saypi:piStoppedSpeaking";
const PI_FINISHED_SPEAKING = "saypi:piFinishedSpeaking";
const PAUSE = "saypi:pause";
const READY = "saypi:ready";
const PLAY = "saypi:play";

export default class EventModule {
  static context = window;
  static init() {
    // All the event listeners can be added here
    this.registerStateMachineEvents(StateMachineService.actor);
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
  // TODO: remove duplicated function from AudioModule.js
  static dispatchCustomEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    console.log("dispatching event: " + eventName);
    window.dispatchEvent(event);
  }

  static simulateTyping(element, text) {
    const words = text.split(" ");
    let i = 0;

    const typeWord = () => {
      if (i < words.length) {
        EventModule.setNativeValue(element, element.value + words[i++] + " ");
        requestAnimationFrame(typeWord);
      } else {
        EventModule.dispatchCustomEvent("saypi:autoSubmit");
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

  static registerStateMachineEvents(actor) {
    window.addEventListener(USER_SPEAKING, () => {
      actor.send(USER_SPEAKING);
    });

    [USER_STOPPED_SPEAKING, USER_FINISHED_SPEAKING].forEach((eventName) => {
      window.addEventListener(eventName, (event) => {
        if (event && event.detail) {
          actor.send({ type: eventName, ...event.detail });
        } else {
          console.warn(`Received ${eventName} without details.`);
        }
      });
    });

    window.addEventListener(TRANSCRIBING, () => {
      actor.send(TRANSCRIBING);
    });

    [PI_SPEAKING, PI_STOPPED_SPEAKING, PI_FINISHED_SPEAKING].forEach(
      (eventName) => {
        window.addEventListener(eventName, () => {
          actor.send(eventName);
        });
      }
    );

    [PAUSE, READY, PLAY].forEach((eventName) => {
      window.addEventListener(eventName, () => {
        actor.send(eventName);
      });
    });
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
