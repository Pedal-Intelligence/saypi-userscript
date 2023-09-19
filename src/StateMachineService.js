import { interpret } from "xstate";
import { machine } from "./state-machines/SayPiMachine";
import { serializeStateValue } from "./LoggingModule";

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
        console.log(
          `Say, Pi Machine transitioned from ${fromState} to ${toState} with ${state.event.type}`
        );
        console.log(state.context);
      }
    });
    this.actor.start();
  }
}

// Singleton
export default new StateMachineService();
