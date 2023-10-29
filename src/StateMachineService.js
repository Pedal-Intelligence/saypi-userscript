import { interpret } from "xstate";
import { machine } from "./state-machines/SayPiMachine.ts";
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
  }
}

// Singleton
export default new StateMachineService();
