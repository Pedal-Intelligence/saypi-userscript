import { setup, assign, fromPromise } from "xstate";
import AnalyticsService from "../AnalyticsModule";
import { config } from "../ConfigModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import {
  UserPromptModule,
  AudibleNotificationsModule,
} from "../NotificationsModule";
import EventBus from "../events/EventBus";
import { logger } from "../LoggingModule";

interface ValidatedConfig {
  GA_MEASUREMENT_ID: string;
  GA_API_SECRET: string;
  GA_ENDPOINT: string;
}

const REQUIRED_ANALYTICS_KEYS = [
  "GA_MEASUREMENT_ID",
  "GA_API_SECRET",
  "GA_ENDPOINT",
] as const;

/**
 * Resolve the analytics (Google Analytics) config without ever throwing.
 *
 * Telemetry is a non-essential, fire-and-forget concern, so a missing or blank
 * GA_* value must NEVER abort content-script bootstrap (#292). When any required
 * value is absent we log a loud warning (useful in dev) and return null; the
 * caller then runs with analytics disabled while the rest of the extension —
 * decoration, call button, voice — keeps working (graceful degradation).
 */
export function resolveAnalyticsConfig(
  config: Record<string, string | undefined>
): ValidatedConfig | null {
  const missing = REQUIRED_ANALYTICS_KEYS.filter((key) => !config[key]);
  if (missing.length > 0) {
    logger.warn(
      `[SessionAnalytics] Analytics disabled — missing config: ${missing.join(
        ", "
      )}. The extension will run normally without telemetry.`
    );
    return null;
  }
  return {
    GA_MEASUREMENT_ID: config.GA_MEASUREMENT_ID!,
    GA_API_SECRET: config.GA_API_SECRET!,
    GA_ENDPOINT: config.GA_ENDPOINT!,
  };
}

const analyticsConfig = resolveAnalyticsConfig(config);
const analytics = analyticsConfig
  ? new AnalyticsService(
      analyticsConfig.GA_MEASUREMENT_ID,
      analyticsConfig.GA_API_SECRET,
      analyticsConfig.GA_ENDPOINT
    )
  : null;
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

const machine = setup({
  types: {
    context: {} as SessionContext,
    events: {} as SessionEvent,
  },
  actors: {
    sessionTimeout: fromPromise(
      () =>
        new Promise<void>((resolve) => setTimeout(resolve, 1800000)) // 1800000 milliseconds = 30 minutes
    ),
  },
  actions: {
    notifyEndSession: ({ context }) => {
      const durationInMillis = Date.now() - context.session_start_time;
      const durationInMinutes = durationInMillis / 1000 / 60;
      analytics?.sendEvent("session_ended", {
        session_id: context.session_id,
        engagement_time_msec: durationInMillis,
        message_count: context.message_count,
        duration_mins: durationInMinutes,
        audio_duration_seconds: context.audio_duration_seconds,
        talk_time_seconds: context.talk_time_seconds,
      });
    },
    notifySendMessage: async ({ context, event }) => {
      const sendEvent = event as SendMessageEvent;
      const transcriptionMode =
        await userPreferences.getCachedTranscriptionMode();

      // calculate the real-time factor (RTF)
      const processing_time_ms = sendEvent.delay_ms;
      const speech_duration_ms = context.last_message.talk_time_seconds * 1000;
      const rtf = processing_time_ms / speech_duration_ms;

      analytics?.sendEvent("message_sent", {
        session_id: context.session_id,
        engagement_time_msec: Date.now() - context.session_start_time,
        delay_msec: sendEvent.delay_ms,
        wait_time_msec: sendEvent.wait_time_ms,
        talk_time_seconds: context.last_message.talk_time_seconds,
        audio_duration_seconds: context.last_message.audio_duration_seconds,
        rtf: rtf,
        transcription_mode: transcriptionMode,
      });
    },
    notifyStartSession: async ({ context }) => {
      const transcriptionMode =
        await userPreferences.getCachedTranscriptionMode();
      const language = await userPreferences.getLanguage();
      const elapsed_ms = 0;
      analytics?.sendEvent("session_started", {
        session_id: context.session_id,
        engagement_time_msec: elapsed_ms,
        transcription_mode: transcriptionMode,
        language: language,
      });
      EventBus.emit("saypi:session:assigned", {
        session_id: context.session_id,
      });
    },
    seedSession: assign({
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
    incrementMessageCount: assign({
      message_count: ({ context }) => context.message_count + 1,
      talk_time_seconds: ({ context }) =>
        context.talk_time_seconds + context.last_message.talk_time_seconds,
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
      audio_duration_seconds: ({ context, event }) => {
        const tx = event as TranscriptionEvent;
        return context.audio_duration_seconds + tx.audio_duration_seconds;
      },
      last_message: ({ context, event }) => {
        const tx = event as TranscriptionEvent;
        const updated_last_message = {
          speech_start_time: context.last_message.speech_start_time,
          speech_end_time: tx.speech_end_time,
          audio_duration_seconds:
            context.last_message.audio_duration_seconds +
            tx.audio_duration_seconds,
          talk_time_seconds: 0,
        };
        if (context.last_message.speech_start_time === 0) {
          updated_last_message.speech_start_time = tx.speech_start_time;
        }
        updated_last_message.talk_time_seconds =
          (updated_last_message.speech_end_time -
            updated_last_message.speech_start_time) /
          1000;
        return updated_last_message;
      },
    }),
    promptForSessionContinuation: () => {
      // Prompt the user to confirm that the long running session is not headless
      // This action can be used to trigger a notification or a dialog
      console.log("Prompting user to continue the session");
      const countdown = 60; // duration in seconds
      userPrompts.activityCheck(countdown);
      audibleNotifications.activityCheck(countdown);
    },
  },
  guards: {
    longRunningSession: ({ context }) =>
      context.message_count > MESSAGE_COUNT_THRESHOLD,
  },
}).createMachine({
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
          actions: ["seedSession", "notifyStartSession"],
        },
      },
    },
    Active: {
      description:
        "The state representing an active session. Messages can be sent and received.",
      invoke: {
        src: "sessionTimeout",
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
            "incrementMessageCount",
            "notifySendMessage",
            "clearLastMessage",
          ],
          target: "Active",
          // re-entrant transition to reset the 30-min invoke timer. In v5 a
          // self-transition only stops/restarts invocations when reenter:true
          // (this preserves the v4 external-self-transition behavior).
          reenter: true,
        },
        end_session: {
          target: "Idle",
          actions: "notifyEndSession",
        },
      },
      after: {
        "7200000": {
          target: "Active",
          guard: "longRunningSession",
          description:
            "Prompt the user to confirm that the long running session is not headless.",
          actions: "promptForSessionContinuation",
        },
      },
    },
  },
});

export {
  machine,
  SessionEvent,
  StartSessionEvent,
  TranscriptionEvent,
  SendMessageEvent,
  EndSessionEvent,
};
