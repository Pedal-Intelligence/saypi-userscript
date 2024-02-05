import { Typestate } from "@xstate/fsm";
import { createMachine, assign } from "xstate";
import AnalyticsService from "../AnalyticsModule";
import { config } from "../ConfigModule";

interface ValidatedConfig {
  GA_MEASUREMENT_ID: string;
  GA_API_SECRET: string;
  GA_ENDPOINT: string;
}

function validateConfig(
  config: Record<string, string | undefined>
): ValidatedConfig {
  if (!config.GA_MEASUREMENT_ID) {
    throw new Error("GA_MEASUREMENT_ID is not set");
  }
  if (!config.GA_API_SECRET) {
    throw new Error("GA_API_SECRET is not set");
  }
  if (!config.GA_ENDPOINT) {
    throw new Error("GA_ENDPOINT is not set");
  }
  return {
    GA_MEASUREMENT_ID: config.GA_MEASUREMENT_ID,
    GA_API_SECRET: config.GA_API_SECRET,
    GA_ENDPOINT: config.GA_ENDPOINT,
  };
}

const valid_config = validateConfig(config);
const analytics = new AnalyticsService(
  valid_config.GA_MEASUREMENT_ID,
  valid_config.GA_API_SECRET,
  valid_config.GA_ENDPOINT
);

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
        const durationInMillis = Date.now() - context.startTimestamp;
        const durationInMinutes = durationInMillis / 1000 / 60;
        console.log(
          `Session ended after ${durationInMinutes.toFixed(1)} mins with ${
            context.messageCount
          } messages sent.`
        );
        analytics.sendEvent("session_end", {
          session_id: context.sessionID,
          message_count: context.messageCount,
          duration_mins: durationInMinutes,
          engagement_time_msec: durationInMillis,
        });
      },
      notifySendMessage: (context: SessionContext, event) => {
        console.log("Message sent", context.messageCount);
        analytics.sendEvent("message_sent", {
          session_id: context.sessionID,
          engagement_time_msec: Date.now() - context.startTimestamp,
        });
      },
      notifyStartSession: (context, event) => {
        console.log("Session started");
        const elapsed_ms = Date.now() - context.startTimestamp;
        analytics.sendEvent("session_start", {
          session_id: context.sessionID,
          engagement_time_msec: elapsed_ms,
        });
      },
      incrementMessageCount: assign({
        messageCount: (context: SessionContext) => {
          console.log("Message number ", context.messageCount + 1, " sent");
          return context.messageCount + 1;
        },
      }),
    },
    services: {},
    guards: {},
    delays: {},
  }
);
