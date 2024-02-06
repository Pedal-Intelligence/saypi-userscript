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
  session_id: string;
  session_start_time: number;
  message_count: number;
  audio_duration_seconds: number;
  talk_time_seconds: number;
  last_message: {
    speech_start_time: number;
    speech_end_time: number;
    audio_duration_seconds: number;
    talk_time_seconds: number;
  };
}
interface SessionTypestate extends Typestate<SessionContext> {
  states: {
    Idle: {};
    Active: {};
  };
}
type StartSessionEvent = { type: "start_session" };
type TranscriptionEvent = {
  type: "transcribing";
  audio_duration_seconds: number;
  speech_start_time: number;
  speech_end_time: number;
};
type SendMessageEvent = { type: "send_message"; delay_ms: number };
type EndSessionEvent = { type: "end_session" };
type SessionEvent =
  | EndSessionEvent
  | SendMessageEvent
  | TranscriptionEvent
  | StartSessionEvent;

export const machine = createMachine<
  SessionContext,
  SessionEvent,
  SessionTypestate
>(
  {
    context: {
      session_id: "",
      session_start_time: 0,
      message_count: 0,
      audio_duration_seconds: 0,
      talk_time_seconds: 0,
      last_message: {
        speech_start_time: 0,
        speech_end_time: 0,
        audio_duration_seconds: 0,
        talk_time_seconds: 0,
      },
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
                session_id: () => Math.random().toString(36).substring(7),
                session_start_time: () => Date.now(),
                message_count: 0,
                audio_duration_seconds: 0,
                talk_time_seconds: 0,
                last_message: {
                  speech_start_time: 0,
                  speech_end_time: 0,
                  audio_duration_seconds: 0,
                  talk_time_seconds: 0,
                },
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
          transcribing: {
            actions: "rollupTranscription",
          },
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
      notifyEndSession: (context: SessionContext, event: EndSessionEvent) => {
        const durationInMillis = Date.now() - context.session_start_time;
        const durationInMinutes = durationInMillis / 1000 / 60;
        analytics.sendEvent("session_ended", {
          session_id: context.session_id,
          engagement_time_msec: durationInMillis,
          message_count: context.message_count,
          duration_mins: durationInMinutes,
          audio_duration_seconds: context.audio_duration_seconds,
          talk_time_seconds: context.talk_time_seconds,
        });
      },
      notifySendMessage: (context: SessionContext, event: SendMessageEvent) => {
        analytics.sendEvent("message_sent", {
          session_id: context.session_id,
          engagement_time_msec: Date.now() - context.session_start_time,
          delay_msec: event.delay_ms,
        });
      },
      notifyStartSession: (context, event: StartSessionEvent) => {
        const elapsed_ms = 0;
        analytics.sendEvent("session_started", {
          session_id: context.session_id,
          engagement_time_msec: elapsed_ms,
        });
      },
      incrementMessageCount: assign({
        message_count: (context: SessionContext) => {
          return context.message_count + 1;
        },
        talk_time_seconds: (
          context: SessionContext,
          event: SendMessageEvent
        ) => {
          return (
            context.talk_time_seconds + context.last_message.talk_time_seconds
          );
        },
        last_message: (context: SessionContext, event: SendMessageEvent) => {
          // clear last_message on submit
          return {
            speech_start_time: 0,
            speech_end_time: 0,
            audio_duration_seconds: 0,
            talk_time_seconds: 0,
          };
        },
      }),
      rollupTranscription: assign({
        audio_duration_seconds: (
          context: SessionContext,
          event: TranscriptionEvent
        ) => {
          return context.audio_duration_seconds + event.audio_duration_seconds;
        },
        last_message: (context: SessionContext, event: TranscriptionEvent) => {
          const updated_last_message = {
            speech_start_time: context.last_message.speech_start_time,
            speech_end_time: event.speech_end_time,
            audio_duration_seconds: event.audio_duration_seconds,
            talk_time_seconds: 0,
          };
          if (context.last_message.speech_start_time === 0) {
            updated_last_message.speech_start_time = event.speech_start_time;
          }
          updated_last_message.talk_time_seconds =
            (updated_last_message.speech_end_time -
              updated_last_message.speech_start_time) /
            1000;
          return updated_last_message;
        },
      }),
    },
    services: {},
    guards: {},
    delays: {},
  }
);
