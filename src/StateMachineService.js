import { createActor } from "xstate";
import { createConversationMachine } from "./state-machines/ConversationMachine.ts";
import { machine as screenLockMachine } from "./state-machines/ScreenLockMachine.ts";
import { createThemeToggleMachine } from "./state-machines/ThemeToggleMachine.ts";
import { machine as analyticsMachine } from "./state-machines/SessionAnalyticsMachine.ts";
import { logStateTransitions } from "./LoggingModule.js";
import { ChatbotService } from "./chatbots/ChatbotService.ts";
import { ThemeManager } from "./themes/ThemeManagerModule.ts";
import EventBus from "./events/EventBus.js";

/**
 * A singleton service that manages the state machine.
 */
class StateMachineService {
  constructor(chatbot) {
    const conversationMachine = createConversationMachine(chatbot);
    this.conversationActor = createActor(conversationMachine);
    logStateTransitions(this.conversationActor, "Conversation Machine");
    this.conversationActor.start();

    this.screenLockActor = createActor(screenLockMachine);
    logStateTransitions(this.screenLockActor, "Screen Lock Machine");
    this.screenLockActor.start();

    const themeManager = ThemeManager.getInstance();
    const themeToggleMachine = createThemeToggleMachine(themeManager);
    this.themeToggleActor = createActor(themeToggleMachine);
    logStateTransitions(this.themeToggleActor, "Theme Toggle Machine");
    this.themeToggleActor.start();
    // low-coupling link between theme toggle machine and theme manager
    EventBus.on("saypi:theme:toggle", (event) => {
      this.themeToggleActor.send({ type: "toggle" });
    });

    this.analyticsMachineActor = createActor(analyticsMachine);
    logStateTransitions(this.analyticsMachineActor, "Session Analytics Machine");
    this.analyticsMachineActor.start();
  }
}

// Singleton initialization
const instance = new StateMachineService(ChatbotService.getChatbotSync());

export default instance;

// Also expose the instance on globalThis to allow lazy, non-import access
try {
  (globalThis || window).StateMachineService = instance;
} catch {}
