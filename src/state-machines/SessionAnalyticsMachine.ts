import { Typestate } from "@xstate/fsm";
import { createMachine, assign } from "xstate";
import AnalyticsService from "../AnalyticsModule";
import { config } from "../ConfigModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  UserPromptModule,
  AudibleNotificationsModule,
} from "../NotificationsModule";
import EventBus from "../events/EventBus";

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
const userPreferences = UserPreferenceModule.getInstance();

const MESSAGE_COUNT_THRESHOLD = 50; // number of messages to trigger the long running session prompt
const userPrompts = new UserPromptModule();
const audibleNotifications = AudibleNotificationsModule.getInstance();

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
type SendMessageEvent = {
  type: "send_message";
  delay_ms: number;
  wait_time_ms: number;
};
type EndSessionEvent = { type: "end_session" };
type SessionEvent =
  | EndSessionEvent
  | SendMessageEvent
  | TranscriptionEvent
  | StartSessionEvent;

const machine = createMachine<SessionContext, SessionEvent, SessionTypestate>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SzrAlgewHYEEsEMAbATwBc0BjWAOgEkJCwBiWU-AJ1IH0VZ1sA2gAYAuolAAHDOnLZxIAB6IArAGZl1NQEYATAHYtevQDYjagDQhiiHQE4AHNVtDjO5VoAsO1Xo9bbAL4Blrz8uAQk5FTUOBTkAG7MpOz4WLAU7GgARmhYUMJiSCBSMphY8koI9kbUqvamHqqqHsZqysqW1gg6Qh5OLjrGja32tnq9QSGoZXhEZJQ0sQnMKFgQXAC2qPgwBfIlaLLlRZX2yo56o0L2qlpaqkJCynqdiPZa1B6237bqWmceG56SYgUIzCLzaJLNCJJhgNY8aaCUT7aSHMoVFReahCX5GR7nUy2DyvbpCHSfbS3ZR2HSeMZBYIgLAYCBweRg7CzSILVGlOQnRAAWmMpJFIM54TmURo9EYfPRAtAlS8pLsji0uNUtn0Dh0tI8EqRUp5ULiMLACqOmIQem8OLxvnsdls-g6VkQD2MtWUv3sXmMvR0hsZQA */
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
        invoke: {
          src: () => new Promise((resolve) => setTimeout(resolve, 1800000)), // 1800000 milliseconds = 30 minutes
          onDone: {
            target: "Idle",
            actions: "notifyEndSession",
          },
        },
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
              {
                type: "clearLastMessage",
              },
            ],
            target: "Active", // re-entrant transition to reset the timer
          },
          end_session: {
            target: "Idle",
            actions: {
              type: "notifyEndSession",
            },
          },
        },
        after: {
          "7200000": {
            target: "Active",
            cond: {
              type: "longRunningSession",
            },
            description:
              "Prompt the user to confirm that the long running session is not headless.",
            internal: true,
            actions: {
              type: "promptForSessionContinuation",
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
      notifySendMessage: async (
        context: SessionContext,
        event: SendMessageEvent
      ) => {
        const transcriptionMode = await userPreferences.getCachedTranscriptionMode();

        // calculate the real-time factor (RTF)
        const processing_time_ms = event.delay_ms;
        const speech_duration_ms =
          context.last_message.talk_time_seconds * 1000;
        const rtf = processing_time_ms / speech_duration_ms;

        analytics.sendEvent("message_sent", {
          session_id: context.session_id,
          engagement_time_msec: Date.now() - context.session_start_time,
          delay_msec: event.delay_ms,
          wait_time_msec: event.wait_time_ms,
          talk_time_seconds: context.last_message.talk_time_seconds,
          audio_duration_seconds: context.last_message.audio_duration_seconds,
          rtf: rtf,
          transcription_mode: transcriptionMode,
        });
      },
      notifyStartSession: async (context, event: StartSessionEvent) => {
        const transcriptionMode = await userPreferences.getCachedTranscriptionMode();
        const language = await userPreferences.getLanguage();
        const elapsed_ms = 0;
        analytics.sendEvent("session_started", {
          session_id: context.session_id,
          engagement_time_msec: elapsed_ms,
          transcription_mode: transcriptionMode,
          language: language,
        });
        EventBus.emit("saypi:session:assigned", {
          session_id: context.session_id,
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
      }),
      clearLastMessage: assign({
        last_message: () => {
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
            audio_duration_seconds:
              context.last_message.audio_duration_seconds +
              event.audio_duration_seconds,
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
      promptForSessionContinuation: (context: SessionContext, event) => {
        // Prompt the user to confirm that the long running session is not headless
        // This action can be used to trigger a notification or a dialog
        console.log("Prompting user to continue the session");
        const countdown = 60; // duration in seconds
        userPrompts.activityCheck(countdown);
        audibleNotifications.activityCheck(countdown);
      },
    },
    services: {},
    guards: {
      longRunningSession: function (context: SessionContext, event) {
        // Add your guard condition here
        return context.message_count > MESSAGE_COUNT_THRESHOLD;
      },
    },
    delays: {},
  }
);

export {
  machine,
  SessionEvent,
  StartSessionEvent,
  TranscriptionEvent,
  SendMessageEvent,
  EndSessionEvent,
};
