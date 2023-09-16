import EventBus from "./EventBus.js";
import StateMachineService from "./StateMachineService.js";

const USER_SPEAKING = "saypi:userSpeaking";
const USER_STOPPED_SPEAKING = "saypi:userStoppedSpeaking";
const USER_FINISHED_SPEAKING = "saypi:userFinishedSpeaking";
const PI_SPEAKING = "saypi:piSpeaking";
const PI_STOPPED_SPEAKING = "saypi:piStoppedSpeaking";
const PI_FINISHED_SPEAKING = "saypi:piFinishedSpeaking";
const PAUSE = "saypi:safariBlocked";
const READY = "saypi:ready";
const PLAY = "saypi:play";

export default class EventModule {
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

  static simulateTyping(element, text) {
    const words = text.split(" ");
    let i = 0;

    const typeWord = () => {
      if (i < words.length) {
        EventModule.setNativeValue(element, element.value + words[i++] + " ");
        requestAnimationFrame(typeWord);
      } else {
        EventBus.emit("saypi:autoSubmit");
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
    EventBus.emit("audio:startRecording");
  }

  static handleTalkMouseUp() {
    EventBus.emit("audio:stopRecording");
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
    EventBus.emit("audio:startRecording");
  }

  static handleTalkTouchEnd(button) {
    EventBus.emit("audio:stopRecording");
  }

  static registerOtherAudioButtonEvents(button) {
    // "warm up" the microphone by acquiring it before the user presses the button
    button.addEventListener("mouseenter", () => {
      EventBus.emit("audio:setupRecording");
    });
    button.addEventListener("mouseleave", () => {
      EventBus.emit("audio:tearDownRecording");
    });
    window.addEventListener("beforeunload", () => {
      EventBus.emit("audio:tearDownRecording");
    });
    button.addEventListener("touchcancel", () => {
      EventBus.emit("audio:tearDownRecording");
    });
  }

  static registerStateMachineEvents(actor) {
    EventBus.on(USER_SPEAKING, () => {
      actor.send(USER_SPEAKING);
    });

    [USER_STOPPED_SPEAKING, USER_FINISHED_SPEAKING].forEach((eventName) => {
      EventBus.on(eventName, (detail) => {
        if (detail) {
          actor.send({ type: eventName, ...detail });
        } else {
          console.warn(`Received ${eventName} without details.`);
        }
      });
    });

    [PI_SPEAKING, PI_STOPPED_SPEAKING, PI_FINISHED_SPEAKING].forEach(
      (eventName) => {
        EventBus.on(eventName, () => {
          actor.send(eventName);
        });
      }
    );

    [PAUSE, READY, PLAY].forEach((eventName) => {
      EventBus.on(eventName, () => {
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
        EventBus.emit("audio:startRecording");
      }
    });

    document.addEventListener("keyup", (event) => {
      if (ctrlDown && event.code === "Space") {
        ctrlDown = false;
        EventBus.emit("audio:stopRecording");
      }
    });
  }
}
