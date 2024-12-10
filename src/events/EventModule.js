import EventBus from "./EventBus.js";
import StateMachineService from "../StateMachineService.js";
import { TextualNotificationsModule } from "../NotificationsModule.ts";

const PROMPT_READY = "saypi:promptReady";
const CALL_READY = "saypi:callReady";
const USER_SPEAKING = "saypi:userSpeaking";
const USER_STOPPED_SPEAKING = "saypi:userStoppedSpeaking";
const USER_FINISHED_SPEAKING = "saypi:userFinishedSpeaking";
const PI_THINKING = "saypi:piThinking";
const PI_WRITING = "saypi:piWriting";
const PI_STOPPED_WRITING = "saypi:piStoppedWriting";
const PI_SPEAKING = "saypi:piSpeaking";
const PI_STOPPED_SPEAKING = "saypi:piStoppedSpeaking";
const PI_FINISHED_SPEAKING = "saypi:piFinishedSpeaking";
const VISIBLE = "saypi:visible";
const AUDIO_DEVICE_CONNECTED = "saypi:audio:connected";
const AUDIO_DEVICE_RECONNECT = "saypi:audio:reconnect";
const END_CALL = "saypi:hangup";
const SESSION_ASSIGNED = "saypi:session:assigned";
const UI_SHOW_NOTIFICATION = "saypi:ui:show-notification";
const MOMENTARY_LISTEN = "saypi:momentaryListen";
const MOMENTARY_PAUSE = "saypi:momentaryPause";
const MOMENTARY_STOP = "saypi:momentaryStop";

/**
 * The EventModule translates events sent on the EventBus to StateMachine events,
 * coordinating interactions between loosely-coupled modules.
 */
export default class EventModule {
  static init() {
    // All the event listeners can be added here
    this.registerStateMachineEvents(StateMachineService.actor);
    this.registerSessionEvents(StateMachineService.analyticsMachineActor);
    this.registerNotifications();
    // Any other initializations...
  }

  static cleanup() {
    // Remove event listeners if needed, or any other cleanup operations
    window.removeEventListener(
      "saypi:transcribed",
      this.handleTranscriptionResponse
    );
  }

  static registerStateMachineEvents(actor) {
    EventBus.on("saypi:ui:content-loaded", () => {
      actor.send(PROMPT_READY);
    });
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
      PI_WRITING,
      PI_STOPPED_WRITING,
      PI_SPEAKING,
      PI_STOPPED_SPEAKING,
      PI_FINISHED_SPEAKING,
      END_CALL,
      MOMENTARY_LISTEN,
      MOMENTARY_PAUSE,
      MOMENTARY_STOP,
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

  static registerNotifications() {
    const textualNotifications = new TextualNotificationsModule();
    EventBus.on(UI_SHOW_NOTIFICATION, (detail) => {
      // detail is a Notification object with a type property
      if (detail.type === "text" && detail.message) {
        // textual notifications have a message property, and an optional icon property
        textualNotifications.showNotification(
          detail.message,
          detail.icon,
          detail.seconds
        );
      }
    });
  }
}
