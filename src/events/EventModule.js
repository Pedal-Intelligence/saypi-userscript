import EventBus from "./EventBus.js";
import StateMachineService from "../StateMachineService.js";

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
const END_CALL = "saypi:hangup";
const SESSION_ASSIGNED = "saypi:session:assigned";

/**
 * The EventModule translates events sent on the EventBus to StateMachine events,
 * coordinating interactions between loosely-coupled modules.
 */
export default class EventModule {
  static init() {
    // All the event listeners can be added here
    this.registerStateMachineEvents(StateMachineService.actor);
    this.registerSessionEvents(StateMachineService.analyticsMachineActor);
    // Any other initializations...
  }

  static cleanup() {
    // Remove event listeners if needed, or any other cleanup operations
    window.removeEventListener(
      "saypi:transcribed",
      this.handleTranscriptionResponse
    );
  }

  static typeTextAndSubmit = (element, text, submit) => {
    EventModule.setNativeValue(element, text);
    if (submit) EventBus.emit("saypi:autoSubmit");
  };

  static simulateTyping(element, text, submit = false) {
    element.focus();
    const sentenceRegex = /([.!?。？！]+)/g;
    const tokens = text.split(sentenceRegex).filter(Boolean);
    const sentences = [];
    for (let i = 0; i < tokens.length; i += 2) {
      const sentence = tokens[i] + (tokens[i + 1] || "");
      sentences.push(sentence);
    }
    const typeNextSentenceOrSubmit = () => {
      if (sentences.length === 0) {
        if (submit) EventBus.emit("saypi:autoSubmit");
      } else {
        // Emit the event only after all sentences have been typed
        const nextSentence = sentences.shift();
        EventModule.setNativeValue(element, element.value + nextSentence);
        requestAnimationFrame(typeNextSentenceOrSubmit);
      }
    };
    if (sentences.length === 0) {
      typeTextAndSubmit(element, text, submit);
    } else {
      typeNextSentenceOrSubmit();
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
      SESSION_ASSIGNED,
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
      END_CALL,
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

  static registerSessionEvents(actor) {
    EventBus.on("session:started", () => {
      actor.send("start_session");
    });
    EventBus.on("session:ended", () => {
      actor.send("end_session");
    });
    EventBus.on("session:message-sent", (detail) => {
      actor.send({ type: "send_message", ...detail });
    });
    EventBus.on("session:transcribing", (detail) => {
      actor.send({ type: "transcribing", ...detail });
    });
  }
}
