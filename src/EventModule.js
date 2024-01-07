import EventBus from "./EventBus.js";
import StateMachineService from "./StateMachineService.js";

const CALL_READY = "saypi:callReady";
const USER_SPEAKING = "saypi:userSpeaking";
const USER_STOPPED_SPEAKING = "saypi:userStoppedSpeaking";
const USER_FINISHED_SPEAKING = "saypi:userFinishedSpeaking";
const PI_THINKING = "saypi:piThinking";
const PI_SPEAKING = "saypi:piSpeaking";
const PI_STOPPED_SPEAKING = "saypi:piStoppedSpeaking";
const PI_FINISHED_SPEAKING = "saypi:piFinishedSpeaking";
const VISIBLE = "saypi:visible";
const AUDIO_DEVICE_CONNECTED = "saypi:audio:connected";
const AUDIO_DEVICE_RECONNECT = "saypi:audio:reconnect";

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
    element.focus();

    // Define a regular expression to match sentence terminators, capturing them
    const sentenceRegex = /([.!?。？！]+)/g;
    const tokens = text.split(sentenceRegex).filter(Boolean);

    // Reassemble sentences with their terminators
    const sentences = [];
    for (let i = 0; i < tokens.length; i += 2) {
      const sentence = tokens[i] + (tokens[i + 1] || "");
      sentences.push(sentence);
    }

    let i = 0;

    const typeSentence = () => {
      if (i < sentences.length) {
        // Type the sentence and its immediate following terminator
        EventModule.setNativeValue(element, element.value + sentences[i++]);
        requestAnimationFrame(typeSentence);
      } else {
        EventBus.emit("saypi:autoSubmit");
      }
    };

    if (sentences.length > 1) {
      // If there are multiple sentences, proceed with sentence-wise typing
      typeSentence();
    } else {
      // If text does not contain recognisable sentence terminators, type it all at once
      EventModule.setNativeValue(element, text);
      EventBus.emit("saypi:autoSubmit");
    }
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

  static registerStateMachineEvents(actor) {
    EventBus.on(CALL_READY, () => {
      actor.send(CALL_READY);
    });
    EventBus.on(USER_SPEAKING, () => {
      actor.send(USER_SPEAKING);
    });

    [
      USER_STOPPED_SPEAKING,
      USER_FINISHED_SPEAKING,
      AUDIO_DEVICE_CONNECTED,
      AUDIO_DEVICE_RECONNECT,
    ].forEach((eventName) => {
      EventBus.on(eventName, (detail) => {
        if (detail) {
          actor.send({ type: eventName, ...detail });
        } else {
          console.warn(`Received ${eventName} without details.`);
        }
      });
    });

    [
      PI_THINKING,
      PI_SPEAKING,
      PI_STOPPED_SPEAKING,
      PI_FINISHED_SPEAKING,
    ].forEach((eventName) => {
      EventBus.on(eventName, () => {
        actor.send(eventName);
      });
    });

    // notify the actor when the tab is visible
    document.addEventListener("visibilitychange", async () => {
      if (document.visibilityState === "visible") {
        actor.send(VISIBLE);
      }
    });
  }
}
