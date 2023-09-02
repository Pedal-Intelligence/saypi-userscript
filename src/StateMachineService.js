import { interpret } from "xstate";
import { machine } from "./saypiStateMachine";

/**
 * A singleton service that manages the state machine.
 */
class StateMachineService {
  constructor() {
    this.actor = interpret(machine).onTransition((state) => {
      console.log(`Transitioned to state: ${state.value}`);
    });
    this.actor.start();
  }
}

// Singleton
export default new StateMachineService();
