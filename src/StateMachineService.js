import { interpret } from "xstate";
import { machine } from "./state-machines/SayPiMachine.ts";
import { machine as screenLockMachine } from "./state-machines/ScreenLockMachine.ts";
import { machine as themeToggleMachine } from "./state-machines/ThemeToggleMachine.ts";
import { logger, serializeStateValue } from "./LoggingModule.js";

/**
 * A singleton service that manages the state machine.
 */
class StateMachineService {
  constructor() {
    this.actor = interpret(machine).onTransition((state) => {
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
  }
}

// Singleton
export default new StateMachineService();
