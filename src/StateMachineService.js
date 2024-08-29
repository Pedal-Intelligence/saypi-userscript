import { interpret } from "xstate";
import { createSayPiMachine } from "./state-machines/SayPiMachine.ts";
import { machine as screenLockMachine } from "./state-machines/ScreenLockMachine.ts";
import { createThemeToggleMachine } from "./state-machines/ThemeToggleMachine.ts";
import { machine as analyticsMachine } from "./state-machines/SessionAnalyticsMachine.ts";
import { logger, serializeStateValue } from "./LoggingModule.js";
import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { ThemeManager } from "./themes/ThemeManagerModule.ts";
import EventBus from "./events/EventBus.js";

/**
 * A singleton service that manages the state machine.
 */
class StateMachineService {
  constructor(chatbot) {
    const conversationMachine = createSayPiMachine(chatbot);
    this.actor = interpret(conversationMachine).onTransition((state) => {
      if (state.changed) {
        const fromState = state.history
          ? serializeStateValue(state.history.value)
          : "N/A";
        const toState = serializeStateValue(state.value);
        logger.debug(
          `Say, Pi Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
        );
      }
    });
    this.actor.start();

    this.screenLockActor = interpret(screenLockMachine).onTransition(
      (state) => {
        if (state.changed) {
          const fromState = state.history
            ? serializeStateValue(state.history.value)
            : "N/A";
          const toState = serializeStateValue(state.value);
          logger.debug(
            `Screen Lock Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
          );
        }
      }
    );
    this.screenLockActor.start();

    const themeManager = ThemeManager.getInstance();
    const themeToggleMachine = createThemeToggleMachine(themeManager);
    this.themeToggleActor = interpret(themeToggleMachine).onTransition(
      (state) => {
        if (state.changed) {
          const fromState = state.history
            ? serializeStateValue(state.history.value)
            : "N/A";
          const toState = serializeStateValue(state.value);
          logger.debug(
            `Theme Toggle Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
          );
        }
      }
    );
    this.themeToggleActor.start();
    // low-coupling link between theme toggle machine and theme manager
    EventBus.on("saypi:theme:toggle", (event) => {
      this.themeToggleActor.send("toggle");
    });

    this.analyticsMachineActor = interpret(analyticsMachine).onTransition(
      (state) => {
        if (state.changed) {
          const fromState = state.history
            ? serializeStateValue(state.history.value)
            : "N/A";
          const toState = serializeStateValue(state.value);
          logger.debug(
            `Session Analytics Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
          );
        }
      }
    );
    this.analyticsMachineActor.start();
  }
}

// Singleton
const chatbot = ChatbotService.getChatbot();
export default new StateMachineService(chatbot);
