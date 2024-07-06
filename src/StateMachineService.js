import { interpret } from "xstate";
import { createSayPiMachine } from "./state-machines/SayPiMachine.ts";
import { machine as screenLockMachine } from "./state-machines/ScreenLockMachine.ts";
import { machine as themeToggleMachine } from "./state-machines/ThemeToggleMachine.ts";
import { machine as analyticsMachine } from "./state-machines/SessionAnalyticsMachine.ts";
import { logger, serializeStateValue } from "./LoggingModule.js";
import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { Chatbot } from "./chatbots/Chatbot.ts";

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
