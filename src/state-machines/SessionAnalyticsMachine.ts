import { Typestate } from "@xstate/fsm";
import { createMachine, assign } from "xstate";

interface SessionContext {
  sessionID: string;
  startTimestamp: number;
  messageCount: number;
}
interface SessionTypestate extends Typestate<SessionContext> {
  states: {
    Idle: {};
    Active: {};
  };
}
type StartSessionEvent = { type: "start_session" };
type SendMessageEvent = { type: "send_message" };
type EndMessageEvent = { type: "end_session" };
type SessionEvent = EndMessageEvent | SendMessageEvent | StartSessionEvent;

export const machine = createMachine<
  SessionContext,
  SessionEvent,
  SessionTypestate
>(
  {
    context: {
      sessionID: "",
      startTimestamp: 0,
      messageCount: 0,
    },
    id: "sessionAnalytics",
    initial: "Idle",
    states: {
      Idle: {
        description:
          "The state when no session is active. Awaiting the start of a new session.",
        on: {
          start_session: {
            target: "Active",
            actions: [
              assign({
                sessionID: () => Math.random().toString(36).substring(7),
                startTimestamp: () => Date.now(),
                messageCount: 0,
              }),
              {
                type: "notifyStartSession",
              },
            ],
          },
        },
      },
      Active: {
        description:
          "The state representing an active session. Messages can be sent and received.",
        on: {
          send_message: {
            actions: [
              {
                type: "incrementMessageCount",
              },
              {
                type: "notifySendMessage",
              },
            ],
          },
          end_session: {
            target: "Idle",
            actions: {
              type: "notifyEndSession",
            },
          },
        },
      },
    },
    schema: {
      events: {} as SessionEvent,
      context: {} as SessionContext,
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      notifyEndSession: (context: SessionContext, event) => {
        const duration = Date.now() - context.startTimestamp;
        const durationInMinutes = duration / 1000 / 60;
        console.log(
          `Session ended after ${durationInMinutes.toFixed(1)} mins with ${
            context.messageCount
          } messages sent.`
        );
      },
      notifySendMessage: (context, event) => {},
      notifyStartSession: (context, event) => {
        console.log("Session started");
      },
      incrementMessageCount: (
        context: SessionContext,
        event: SendMessageEvent
      ) => {
        console.log("Message sent");
        assign({
          messageCount: (context: SessionContext) => context.messageCount + 1,
        });
      },
    },
    services: {},
    guards: {},
    delays: {},
  }
);
