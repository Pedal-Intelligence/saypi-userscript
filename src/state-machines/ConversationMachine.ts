import {
  setup,
  assign,
} from "xstate";
import AnimationModule from "../AnimationModule.js";
import {
  AudibleNotificationsModule,
  TextualNotificationsModule,
  VisualNotificationsModule,
} from "../NotificationsModule";
import {
  uploadAudioWithRetry,
  isTranscriptionPending,
  clearPendingTranscriptions,
} from "../TranscriptionModule";
import { TranscriptMergeService } from "../TranscriptMergeService";
import EventBus from "../events/EventBus.js";
import { calculateDelay } from "../TimerModule";
import AudioControlsModule from "../audio/AudioControlsModule";
import { requestWakeLock, releaseWakeLock } from "../WakeLockModule";
import { UserPreferenceModule } from "../prefs/PreferenceModule";
import getMessage from "../i18n";
import { Chatbot, UserPrompt } from "../chatbots/Chatbot";
import { ImmersionStateChecker } from "../ImmersionServiceLite";
import TranscriptionErrorManager from "../error-management/TranscriptionErrorManager";
import { logger } from "../LoggingModule";
import { ChatbotIdentifier } from "../chatbots/ChatbotIdentifier";
import { postTurnOutcome } from "../TurnOutcomeModule";

type ConversationTranscribedEvent = {
  type: "saypi:transcribed";
  text: string;
  sequenceNumber: number;
  pFinishedSpeaking?: number;
  tempo?: number;
  merged?: number[];
  responseAnalysis?: {
    shouldRespond: boolean;
  };
};

type ConversationSpeechStoppedEvent = {
  type: "saypi:userStoppedSpeaking";
  duration: number;
  blob?: Blob;
  captureTimestamp?: number;
  clientReceiveTimestamp?: number;
  handlerTimestamp?: number;
};

type ConversationAudioConnectedEvent = {
  type: "saypi:audio:connected";
  deviceId: string;
  deviceLabel: string;
};
type ConversationAudioReconnectEvent = {
  type: "saypi:audio:reconnect";
  deviceId: string;
  deviceLabel: string;
};
type ConversationSessionAssignedEvent = {
  type: "saypi:session:assigned";
  session_id: string;
};

type ConversationUserPreferenceChangedEvent = {
  type: "userPreferenceChanged";
  discretionaryMode?: boolean;
  voiceId?: string;
  audioProvider?: string;
};

type ConversationEvent =
  | { type: "saypi:userSpeaking" }
  | ConversationSpeechStoppedEvent
  | { type: "saypi:userFinishedSpeaking" }
  | ConversationTranscribedEvent
  | { type: "saypi:transcribeFailed" }
  | { type: "saypi:transcribedEmpty" }
  | { type: "saypi:piThinking" }
  | { type: "saypi:piSpeaking" }
  | { type: "saypi:piStoppedSpeaking" }
  | { type: "saypi:piFinishedSpeaking" }
  | { type: "saypi:interrupt" }
  | { type: "saypi:submit" }
  | { type: "saypi:promptReady" }
  | { type: "saypi:call" }
  | { type: "saypi:callReady" }
  | { type: "saypi:callFailed" }
  | { type: "saypi:hangup" }
  | { type: "saypi:visible" }
  | ConversationAudioConnectedEvent
  | ConversationAudioReconnectEvent
  | ConversationSessionAssignedEvent
  | { type: "saypi:piWriting" }
  | { type: "saypi:piStoppedWriting" }
  | ConversationUserPreferenceChangedEvent;

// Snapshot of the correlation data captured at the moment of auto-submit, used
// to emit a turn-outcome event once the resume window closes (issue #505). Taken
// at submit time because the transcript buffer is cleared on `listening` exit.
interface PendingTurnOutcome {
  submittedAt: number;            // epoch ms, our clock
  sessionId?: string;
  lastSequenceNumber?: number;    // the endpointing decision point
  pFinishedSpeaking?: number;     // score from the last /transcribe response
  lastSpeechEndedAt: number;      // when the user stopped speaking (timeUserStoppedSpeaking)
  app?: string;                   // pi / claude / chatgpt
  isMaintenance: boolean;         // suppressed buffer flush — excluded from the eval
}

interface ConversationContext {
  transcriptions: Record<number, string>;
  isTranscribing: boolean; // duplicate of state.matches("listening.converting.transcribing")
  lastState: "inactive" | "listening";
  userIsSpeaking: boolean; // duplicate of state.matches("listening.recording.userSpeaking")
  timeUserStoppedSpeaking: number;
  defaultPlaceholderText: string;
  sessionId?: string;
  shouldRespond?: boolean; // should Pi respond the next time the user finishes speaking?
  isMaintainanceMessage?: boolean; // is the current message a maintainance message?
  lastSequenceNumber?: number; // highest sequenceNumber seen this turn (endpointing decision point)
  lastPFinishedSpeaking?: number; // pFinishedSpeaking of that same /transcribe response
  pendingTurnOutcome?: PendingTurnOutcome | null; // snapshot for the in-flight turn's outcome event
}

function isContextWindowApproachingCapacity(transcriptions: Record<number, string>): boolean {
  // Calculate total length of all transcriptions
  const totalLength = Object.values(transcriptions).reduce((sum, text) => sum + text.length, 0);
  // Consider capacity approaching if total length exceeds 90% of the context window
  const CAPACITY_THRESHOLD = chatbot.getContextWindowCapacityCharacters() * 0.9;
  return totalLength > CAPACITY_THRESHOLD;
}

// time at which the user's prompt is scheduled to be submitted
// retained for submission-timing diagnostics (see submissionDelay logging)
var nextSubmissionTime = Date.now();

// most recent enforced delay while waiting for additional user input
// captured here for analytics events
var lastSubmissionDelay = 0;
// timestamp when the most recent submission was scheduled
var lastSubmissionScheduledAt = 0;

const audibleNotifications = AudibleNotificationsModule.getInstance();
const textualNotifications = new TextualNotificationsModule();
const visualNotifications = new VisualNotificationsModule();
const audioControls = new AudioControlsModule();
const userPreferences = UserPreferenceModule.getInstance();

const mergeService = new TranscriptMergeService();
userPreferences.getDiscretionaryMode().then((discretionaryModeEnabled) => {
  const cachedValue = userPreferences.getCachedDiscretionaryMode();
  if (cachedValue !== discretionaryModeEnabled) {
    console.warn("Cache is not ready yet. Wait a moment before querying preferences.");
  }
});

function shouldAlwaysRespond(): boolean {
  const discretionaryModeEnabled = userPreferences.getCachedDiscretionaryMode();
  return !discretionaryModeEnabled;
}

let chatbot: Chatbot;
function getPromptOrNull(): UserPrompt | null {
  if (!chatbot) {
    console.error("Chatbot not initialized when requested by state machine.");
  }
  const promptElement = document.getElementById("saypi-prompt");
  if (chatbot && promptElement) {
    return chatbot.getPrompt(promptElement);
  }
  console.warn("Prompt element not found when requested by state machine.");
  return null;
}
function getChatbotDefaultPlaceholder(): string {
  if (!chatbot) {
    console.error("Chatbot not initialized when requested by state machine.");
  }
  const promptElement = document.getElementById("saypi-prompt");
  if (chatbot && promptElement) {
    return chatbot.getPrompt(promptElement).getDefaultPlaceholderText();
  }
  console.warn("Prompt element not found when requested by state machine.");
  // TODO assign the default placeholder text on "saypi:ui:content-loaded" event
  // 1. EventModule handles "saypi:ui:content-loaded" event (checkmark)
  // 2. Sends "saypi:prompt-ready" event to the state machine (checkmark)
  // 3. State machine assigns the default placeholder text to the context, as an internal state transition from "inactive" to "inactive" (checkmark)
  return "";
}

// Define a constant for the timeout (in milliseconds) for the user stopped speaking event
const USER_STOPPED_TIMEOUT_MS = 10000;

// Safety-net timeout for the piThinking state. piThinking normally exits the
// moment Pi starts writing (saypi:piWriting) or speaking (saypi:piSpeaking).
// Those signals depend on host-specific DOM detection (e.g. PiTextStream), which
// can break if the chat host's response markup drifts — leaving the prompt
// frozen on "$chatbot$ is thinking…" even though Pi has already answered. This
// fallback guarantees the UI recovers (and the placeholder is restored) instead
// of staying stuck forever. It is generous so it never fires during a normal,
// promptly-detected response — it only rescues a genuine detection miss.
const PI_THINKING_TIMEOUT_MS = 15000;

const machine = setup({
  types: {
    context: {} as ConversationContext,
    events: {} as ConversationEvent,
  },
  actions: {
    stopAllAnimations: () => {
      AnimationModule.stopAllAnimations();
    },

    startAnimation: (_, params: { animation: string }) => {
      AnimationModule.startAnimation(params.animation);
    },

    stopAnimation: (_, params: { animation: string }) => {
      AnimationModule.stopAnimation(params.animation);
    },

    transcribeAudio: ({ context, event }) => {
      const e = event as ConversationSpeechStoppedEvent;
      const audioBlob = e.blob;
      if (audioBlob) {
        uploadAudioWithRetry(
          audioBlob,
          e.duration,
          context.transcriptions,
          context.sessionId,
          3, // default maxRetries
          e.captureTimestamp,
          e.clientReceiveTimestamp,
          undefined, // inputType - not used in conversation mode
          undefined, // inputLabel - not used in conversation mode
          undefined  // onSequenceNumber - no target switching in conversation mode
        );
        EventBus.emit("session:transcribing", {
          audio_duration_seconds: e.duration / 1000,
          speech_end_time: Date.now(), // bit hacky, as it assumes the audio is transcribed immediately
          speech_start_time: Date.now() - e.duration,
          captureTimestamp: e.captureTimestamp,
          clientReceiveTimestamp: e.clientReceiveTimestamp,
          handlerTimestamp: e.handlerTimestamp
        });
      }
    },

    // v5: context is updated via assign (immutably) rather than mutating the
    // shared definition context in place. In v4 this action mutated the singleton
    // context object directly (context.transcriptions[seq] = ...), which leaked
    // across interpreted actors. The assign form keeps each actor isolated.
    handleTranscriptionResponse: assign(({ context, event }) => {
      const e = event as ConversationTranscribedEvent;
      const transcription = e.text;
      const sequenceNumber = e.sequenceNumber;
      const shouldRespondToThis = e.responseAnalysis?.shouldRespond;
      logger.debug(`Partial transcript [${sequenceNumber}]: ${transcription} [${shouldRespondToThis ? "respond" : "don\\'t respond"}]`);

      const transcriptions = { ...context.transcriptions };

      if (transcription && transcription.trim() !== "") {
        transcriptions[sequenceNumber] = transcription;
        TranscriptionErrorManager.recordAttempt(true); // Record success
      } else {
        // This case should ideally be handled by saypi:transcribedEmpty if the API guarantees it,
        // but as a fallback, we can record a failure here if text is empty.
        // However, the primary failure recording for empty will be on the saypi:transcribedEmpty event transition.
      }

      if (e.merged) {
        e.merged.forEach((mergedSequenceNumber) => {
          delete transcriptions[mergedSequenceNumber];
        });
      }

      // Persist the endpointing decision point for the turn-outcome event (#505):
      // the highest sequence number seen this turn and the pFinishedSpeaking of
      // that same /transcribe response, kept together so the reported score and
      // sequence number always describe the same utterance. Guarding on the
      // highest seq keeps them consistent even if responses arrive out of order.
      const prevSeq = context.lastSequenceNumber ?? -1;
      const isNewestSeq = sequenceNumber >= prevSeq;

      return {
        transcriptions,
        shouldRespond: shouldRespondToThis ?? shouldAlwaysRespond(),
        lastSequenceNumber: isNewestSeq ? sequenceNumber : context.lastSequenceNumber,
        lastPFinishedSpeaking: isNewestSeq ? e.pFinishedSpeaking : context.lastPFinishedSpeaking,
      };
    }),

    acquireMicrophone: () => {
      // warmup the microphone on idle in mobile view,
      // since there's no mouseover event to trigger it
      if (ImmersionStateChecker.isViewImmersive()) {
        EventBus.emit("audio:setupRecording");
      }
    },

    setupRecording: () => {
      // differs from acquireMicrophone in that it's user-initiated
      EventBus.emit("audio:setupRecording");
    },

    startRecording: () => {
      EventBus.emit("audio:startRecording");
    },

    pauseRecording: () => {
      EventBus.emit("audio:input:stop");
    },

    pauseRecordingIfInterruptionsNotAllowed: () => {
      const handsFreeInterrupt =
        userPreferences.getCachedAllowInterruptions();
      if (!handsFreeInterrupt) {
        EventBus.emit("audio:input:stop");
      }
    },

    resumeRecording: ({ context }) => {
      if (context.lastState === "listening") {
        // only resume recording if we were already listening
        EventBus.emit("audio:startRecording");
      }
    },

    stopRecording: () => {
      EventBus.emit("audio:stopRecording");
      EventBus.emit("audio:tearDownRecording");
    },

    reconnectAudio: () => {
      EventBus.emit("audio:input:reconnect");
    },

    dismissNotification: () => {
      textualNotifications.hideNotification();
    },

    showNotification: (_, params: { icon: string; message: string }) => {
      textualNotifications.showNotification(params.message, params.icon);
    },

    notifyAudioConnected: ({ event }) => {
      const e = event as ConversationAudioConnectedEvent;
      const deviceLabel = e.deviceLabel;
      const message = getMessage("audioConnected", deviceLabel);
      textualNotifications.showNotification(message, "microphone");
    },

    notifyAudioReconnecting: ({ event }) => {
      const e = event as ConversationAudioReconnectEvent;
      const deviceLabel = e.deviceLabel;
      const message = getMessage("audioReconnecting", deviceLabel);
      textualNotifications.showNotification(message, "microphone-switch");
    },

    acknowledgeUserInput: () => {
      visualNotifications.listeningStopped();
      audibleNotifications.listeningStopped();
    },

    listenPrompt: () => {
      const nickname = userPreferences.getCachedNickname() || chatbot.getName();
      const normalMode = shouldAlwaysRespond();
      const message = getMessage(normalMode ? "assistantIsListening" : "assistantIsListeningAttentively", nickname);
      if (message) {
        getPromptOrNull()?.setMessage(message);
      }
    },
    callStartingPrompt: () => {
      // Show the "call starting" placeholder. (#403) Previously this also tried to
      // back up the user's draft into defaultPlaceholderText via a discarded
      // assign() — which never ran, and would have been wrong anyway:
      // defaultPlaceholderText is the PLACEHOLDER (restored via setMessage in
      // clearPrompt), so a backed-up draft would have reappeared as greyed-out
      // placeholder text rather than editable content. Removed the dead code; a
      // real "preserve draft across a call" feature would need its own field +
      // setDraft restore, not this path.
      const message = getMessage("callStarting");
      if (message) {
        getPromptOrNull()?.setMessage(message);
      }
    },
    thinkingPrompt: () => {
      const nickname = userPreferences.getCachedNickname() || chatbot.getName();
      const message = getMessage("assistantIsThinking", nickname);
      if (message) {
        const promptEditor = getPromptOrNull();
        if (promptEditor) {
          promptEditor.setMessage(message);
        } else {
          logger.warn("[ConversationMachine] [thinkingPrompt] no prompt editor found");
        }
      }
    },
    writingPrompt: () => {
      const nickname = userPreferences.getCachedNickname() || chatbot.getName();
      const message = getMessage("assistantIsWriting", nickname);
      if (message) {
        getPromptOrNull()?.setMessage(message);
      }
    },
    speakingPrompt: () => {
      const handsFreeInterrupt =
        userPreferences.getCachedAllowInterruptions();

      const nickname = userPreferences.getCachedNickname() || chatbot.getName();
      const message = handsFreeInterrupt
        ? getMessage("assistantIsSpeaking", nickname)
        : getMessage(
            "assistantIsSpeakingWithManualInterrupt",
            nickname
          );
      if (message) {
        getPromptOrNull()?.setMessage(message);
      }
    },
    interruptingPiPrompt: () => {
      const nickname = userPreferences.getCachedNickname() || chatbot.getName();
      const message = getMessage(
        "userStartedInterrupting",
        nickname
      );
      if (message) {
        getPromptOrNull()?.setMessage(message);
      }
    },
    clearPrompt: ({ context }) => {
      const prompt = getPromptOrNull();
      if (prompt) {
        //prompt.clear(); // has side effects
        prompt.setMessage(context.defaultPlaceholderText);
      }
    },
    draftPrompt: ({ context }) => {
      const text = mergeService
        .mergeTranscriptsLocal(context.transcriptions)
        .trim();
      if (text) getPromptOrNull()?.setDraft(text);
    },

    mergeAndSubmitTranscript: ({ context }) => {
      const text = mergeService
        .mergeTranscriptsLocal(context.transcriptions)
        .trim();
      if (text) getPromptOrNull()?.setFinal(text, context.isMaintainanceMessage);
    },

    callIsStarting: () => {
      // buttonModule.callStarting();
    },
    callFailedToStart: () => {
      // buttonModule.callInactive();
      audibleNotifications.callFailed();
    },
    callNotStarted: () => {
      //if (buttonModule) {
        // buttonModule may not be available on initial load
        // buttonModule.callInactive();
      //}
    },
    callHasStarted: () => {
      // buttonModule.callActive();
      audibleNotifications.callStarted();
      EventBus.emit("session:started");
    },
    callInterruptible: () => {
      // buttonModule.callInterruptible();
    },
    callInterruptibleIfListening: ({ context }) => {
      if (context.lastState === "listening") {
        // buttonModule.callInterruptible();
      }
    },
    callContinues: () => {
      // buttonModule.callActive();
    },
    callHasEnded: () => {
      visualNotifications.listeningStopped();
      // buttonModule.callInactive();
      audibleNotifications.callEnded();
      EventBus.emit("session:ended");
    },
    callHasErrors: () => {
      // buttonModule.callError();
    },
    callHasNoErrors: () => {
      // buttonModule.callActive();
    },
    disableCallButton: () => {
      // buttonModule.disableCallButton();
    },
    enableCallButton: () => {
      // buttonModule.enableCallButton();
    },
    cancelCountdownAnimation: () => {
      visualNotifications.listeningStopped();
    },
    activateAudioOutput: () => {
      audioControls.activateAudioOutput(true);
    },
    requestWakeLock: () => {
      requestWakeLock();
    },
    releaseWakeLock: () => {
      releaseWakeLock();
    },
    notifySentMessage: ({ context }) => {
      const delay_ms = Date.now() - context.timeUserStoppedSpeaking;
      const submission_delay_ms = lastSubmissionDelay;
      EventBus.emit("session:message-sent", {
        delay_ms: delay_ms,
        wait_time_ms: submission_delay_ms,
      });
    },
    notifyPiSpeaking: () => {
      EventBus.emit("saypi:piSpeaking");
    },
    // Snapshot the turn's correlation data at auto-submit — the moment the resume
    // window opens (#505). Taken here because the transcript buffer and the
    // per-turn sequence/score fields are cleared on `listening` exit, which runs
    // immediately after this state's `always` transition into `responding`.
    openTurnOutcome: assign(({ context }) => {
      const seqs = Object.keys(context.transcriptions).map(Number);
      const lastSequenceNumber =
        context.lastSequenceNumber ?? (seqs.length ? Math.max(...seqs) : undefined);
      const pending: PendingTurnOutcome = {
        submittedAt: Date.now(),
        sessionId: context.sessionId,
        lastSequenceNumber,
        pFinishedSpeaking: context.lastPFinishedSpeaking,
        lastSpeechEndedAt: context.timeUserStoppedSpeaking,
        app: ChatbotIdentifier.getAppId(),
        isMaintenance: !!context.isMaintainanceMessage,
      };
      return { pendingTurnOutcome: pending };
    }),
    // Close the resume window and report the outcome (#505). Fired on the single
    // transition that leaves `responding.piThinking`, so exactly once per turn.
    // Maintenance messages (suppressed buffer flushes) are excluded from the eval.
    emitTurnOutcome: (
      { context },
      params: { kind: "response-started" | "resumed" | "no-response" }
    ) => {
      const pending = context.pendingTurnOutcome;
      if (!pending || pending.isMaintenance) {
        return;
      }
      const now = Date.now();
      postTurnOutcome({
        sessionId: pending.sessionId,
        lastSequenceNumber: pending.lastSequenceNumber,
        trigger: "auto",
        userResumed: params.kind === "resumed",
        submittedAt: pending.submittedAt,
        responseStartedAt: params.kind === "response-started" ? now : null,
        resumedAt: params.kind === "resumed" ? now : null,
        lastSpeechEndedAt: pending.lastSpeechEndedAt,
        pFinishedSpeaking: pending.pFinishedSpeaking ?? null,
        app: pending.app ?? null,
      });
    },
    // Drop any in-flight turn-outcome snapshot (#505). `pendingTurnOutcome` means
    // "an auto-submitted turn awaiting its outcome", so entering `responding`
    // by a path that is NOT our own auto-submit (the `saypi:piThinking` handler)
    // must clear it — otherwise a subsequent response-start would re-emit a stale
    // prior-turn snapshot as if it were a fresh auto-submit.
    clearPendingTurnOutcome: assign({ pendingTurnOutcome: null }),
    clearPendingTranscriptionsAction: () => {
      // discard in-flight transcriptions. Called after a successful submission
      clearPendingTranscriptions();
    },
    clearTranscriptsAction: assign({
      transcriptions: () => ({}),
      shouldRespond: () => shouldAlwaysRespond(), // reset response trigger for next message
      lastSequenceNumber: () => undefined, // reset endpointing decision point for next turn (#505)
      lastPFinishedSpeaking: () => undefined,
    }),
    updatePreferences: assign({ shouldRespond: () => shouldAlwaysRespond() }),
    setMaintainanceFlag: assign(({ context }) => {
      const timeoutReached = isTimeoutReached(context);
      const mustRespond = mustRespondToMessage(context);
      const shouldRespond = shouldAlwaysRespond() || context.shouldRespond;
      const shouldSetFlag = mustRespond && !shouldRespond;
      logger.debug(shouldSetFlag
        ? `Setting maintainance flag due to ${timeoutReached ? "timeout reached" : "context window approaching capacity"}`
        : "Clearing maintainance flag since below context window capacity and timeout threshold"
      );
      return {
        isMaintainanceMessage: shouldSetFlag
      };
    }),
    suppressResponseEarlyWhenMaintainance: ({ context }) => {
      if (context.isMaintainanceMessage) {
        // these actions can be performed early, before the message is fully written
        EventBus.emit("saypi:tts:skipCurrent");
        logger.debug("Skipping speech generation due to this being a maintainance message");
      }
    },
    suppressWrittenResponseWhenMaintainance: ({ context }) => {
      if (context.isMaintainanceMessage) {
        EventBus.emit("saypi:ui:hide-message");
        logger.debug("Hiding message due to this being a maintainance message");
      }
    },
    suppressSpokenResponseWhenMaintainance: ({ context }) => {
      if (context.isMaintainanceMessage) {
        EventBus.emit("saypi:ui:hide-message"); // send again to ensure the message is hidden
        EventBus.emit("audio:skipCurrent");
        logger.debug("Skipping speech due to this being a maintainance message");
      }
    },
    // Reset the maintenance-message flag on exit of `responding` (#403). Previously
    // this built an assign() and discarded it, so the flag was never cleared here
    // and only got recomputed on the next submit via setMaintainanceFlag.
    clearMaintainanceFlag: assign({ isMaintainanceMessage: false }),
    pauseAudio: () => {
      logger.debug("[ConversationMachine] [pauseAudio] Pausing audio for user interruption");
      EventBus.emit("audio:output:pause");
    },
    resumeAudio: () => {
      EventBus.emit("audio:output:resume");
    },
    recordTranscriptionFailure: () => {
      TranscriptionErrorManager.recordAttempt(false);
    },
    showOrSuppressAudioInputErrorHint: () => {
      if (TranscriptionErrorManager.shouldShowUserHint()) {
        const nickname = userPreferences.getCachedNickname() || chatbot.getName();
        const displayForSeconds = 10;
        textualNotifications.showNotification(getMessage("audioInputError", nickname), "microphone-muted", displayForSeconds);
        TranscriptionErrorManager.reset();
      } else {
        // Optionally, log that the hint was suppressed, or do nothing.
        logger.debug("Transcription failure hint suppressed due to low error rate.");
      }
    },
    logSubmissionTiming: () => {
      try {
        const now = Date.now();
        const actualWait = now - lastSubmissionScheduledAt;
        const jitter = actualWait - lastSubmissionDelay;
        logger.debug(
          "[ConversationMachine] submissionTiming:",
          JSON.stringify({
            scheduledAt: lastSubmissionScheduledAt,
            plannedDelay: lastSubmissionDelay,
            actualWait,
            jitter,
            now,
            nextSubmissionTime,
          })
        );
      } catch {}
    },
  },
  guards: {
    hasAudio: ({ event }) => {
      if (event.type === "saypi:userStoppedSpeaking") {
        const e = event as ConversationSpeechStoppedEvent;
        return e.blob !== undefined && e.duration > 0;
      }
      return false;
    },
    hasNoAudio: ({ event }) => {
      if (event.type === "saypi:userStoppedSpeaking") {
        const e = event as ConversationSpeechStoppedEvent;
        return (
          e.blob === undefined ||
          e.blob.size === 0 ||
          e.duration === 0
        );
      }
      return false;
    },
    submissionConditionsMet: ({ context, event }, _params) => {
      void event;
      const autoSubmitEnabled = userPreferences.getCachedAutoSubmit();
      const mustRespond = mustRespondToMessage(context);
      const ready = provisionallyReadyToSubmit(context);
      const userHasStoppedSpeaking = context.timeUserStoppedSpeaking > 0;
      const timeSinceStoppedSpeaking = Date.now() - context.timeUserStoppedSpeaking;

      /* start debug logging */
      const criteria = [];
      if (isTimeoutReached(context)) {
        criteria.push("timeout reached");
      }
      if (context.shouldRespond) {
        criteria.push("response trigger");
      }
      if (isContextWindowApproachingCapacity(context.transcriptions)) {
        criteria.push("context window approaching capacity");
      }
      let reason = criteria.length > 0 ? criteria.join(", ") : "no thresholds met";
      if (mustRespond) {
        reason = reason + (ready ? " and ready to submit" : " but not ready to submit");
        logger.debug(`Submission needed because ${reason}`);
      } else {
        if (context.timeUserStoppedSpeaking > 0) {
          reason = reason + ` (time since stopped speaking: ${timeSinceStoppedSpeaking / 1000} seconds)`;
        }
        const noStopYet = !userHasStoppedSpeaking;
        logger.debug(`Submission not needed because ${reason}`, { noStopYet, tUSS: context.timeUserStoppedSpeaking, context });
      }
      /* end debug logging */

      return mustRespond && autoSubmitEnabled && ready && userHasStoppedSpeaking;
    },
    wasListening: ({ context }) => {
      return context.lastState === "listening";
    },
    wasInactive: ({ context }) => {
      return context.lastState === "inactive";
    },
    interruptionsAllowed: () => {
      const allowInterrupt = userPreferences.getCachedAllowInterruptions();
      return allowInterrupt;
    },
    interruptionsNotAllowed: () => {
      const allowInterrupt = userPreferences.getCachedAllowInterruptions();
      return !allowInterrupt;
    },
  },
  delays: {
    submissionDelay: ({ context, event }) => {
      // check if the event is a transcription event
      if (event.type !== "saypi:transcribed") {
        return 0;
      }
      const e = event as ConversationTranscribedEvent;

      const maxDelay = 7000; // 7 second max submission delay (lowered from 8s in v1.6.0)

      // Defaulting and clamping of pFinishedSpeaking/tempo live in calculateDelay
      // (absent score → maximum patience; absent tempo → neutral).
      const scheduledAt = Date.now();
      const timeElapsed = scheduledAt - context.timeUserStoppedSpeaking;
      const finalDelay = calculateDelay(
        context.timeUserStoppedSpeaking,
        e.pFinishedSpeaking,
        e.tempo,
        maxDelay
      );

      if (finalDelay > 0) {
        logger.debug(
          "Waiting for",
          (finalDelay / 1000).toFixed(1),
          "seconds before submitting"
        );
      }

      // ideally we would use the current state to determine if we're ready to submit,
      // but we don't have access to the state here, so we'll use the provisional readyToSubmit
      const ready = provisionallyReadyToSubmit(context);
      if (finalDelay > 0 && ready) {
        visualNotifications.listeningTimeRemaining(finalDelay / 1000);
      }

      nextSubmissionTime = scheduledAt + finalDelay;

      // Capture the delay for analytics events
      lastSubmissionDelay = finalDelay;
      lastSubmissionScheduledAt = scheduledAt;

      // Detailed debug to correlate measured vs expected
      try {
        logger.debug(
          "[ConversationMachine] submissionDelay:",
          JSON.stringify({
            seq: (e as any).sequenceNumber,
            pFinished: e.pFinishedSpeaking,
            tempo: e.tempo,
            maxDelay,
            timeUserStoppedSpeaking: context.timeUserStoppedSpeaking,
            scheduledAt,
            timeElapsed,
            finalDelay,
            nextSubmissionTime,
          })
        );
      } catch {}

      return finalDelay;
    },
  },
}).createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SwIYE8AKBLAxAV1jACcMiwAzYsAOwGMwBhACxWpggG0AGAXUVAAOAe1hYALliHV+IAB6IuAGhBoFAXzXLUmLADos1FLQkA3MDm0CsCAUSEBbAWIBKYFBDTc+SEMNESpGXkEAGYAdgAOAE5dMKiwrhCAFgAmADYAVgikjIzlVQQARkKUrl0IiOSoiOLqwviNLXRsfUNjLDMLdCsEWhQAG36vGT9xSWkfYKiU-MQopJiUrLCUsNyliK4wxpBtFoMjU3NLaysAZQE3AGsDKGGfUYCJ0GCk4ozYqLSojMSQjJKeRUiEKyRC5RCaTChQi0K4GTC4R2ez0fUGZzEKCIEjYXTQPTR-Vc7k8vBGIjGgUmiBySV0hSS2SyFSScTiQIKjI+SSSaRSqyihTShS4SUhyOaqIG-QxWJxUDxPRYbDwAnuggpTyCiAiM2BRS4P10v1h-0RaTSXEKGQlOl0hNl2NuiushIAYigsP1IOrfJrxtqEDy6QymRVsmyfrMilFwRkQlFEwDRTUE7aWg7MU7cbJYJixGBdChyAWiAAKUpcKsASjxGeljvlvceAepQYyIcZOXDrPiUf1yTKiZCgNWmUyNs0u0lun6WDzNGdJxsWAAKkwDDc2M3-VSXogQpDwWyq1lvmkkvDo4eMml6RUocVYVCkum9HOF9Ql91TlgLtdbh3fxW33UJ-mPeJTwic9Lw5A8SjCXQ3l+FYfhSSpKjfWd5wLL9cWXEx5ywAAjb0gMpZ45BBC0ImNM8akyflshCaNrXSWJoi+MIEiWQEsI-XDv3xawUDwCBJF6KRqDAYwfTJB5d0o4IhV5XQE15GDYziVixTKQ8X3U8JeUKficMXfCfwQUTxKEBAyFoKSZLEcitTbFTEMYnJRSrIVkmveNEMhBjqi83lTM-ISekIWBRCkKyYqwKBpM4eSNWAvcqKKC86QWfkeUfaD4mvHkh2tQoEjCS9QWtcLBLYXR7KEIhxIs4SEGVKBVRckDMpvCCEnhQqLyvfVK3BEJ4XWBMEyWV8pxRbCIvqxrmtuXRqCEMR-xQLcFWXAhiDdAx5yYSBtt27qMuCPrPgGs8vlg6N+VFXQLQWf4Ig7XUQlq8yoAamSmpa-6Nq2y4dsi6wDqIc7ANSv10qUkE-l0FIhQFVYrUtCInsNO9piieFvlKdJtnmmcBL+gGHNW+rodh1qenpsQhAES4IAZu54ZbK6dQZY10MiRkRTenHRvqRCCZU35knjNJfrw-6VuB3R6fB3aXQQZnWfZzmOEKbw0oowMajpDJBeyGouFFp6GUQ1JBRFaEYUteXybtSnFftKQzGzf6jFoPB7DwfoUHlHAICkQsDBMIQrkLexiBgAB5JwsHsHCsFoS6kYNLIkLCTIFmKVIlj1Ap0KFCE0gqBIR1WCIFbWhzqF9+Ui1oQPg9D8PiDsIhdAEHvyCa+xdETogU7TjO8yznPAxFDIYgZHIEWSa0qxY0aVnGypvi4TZWRSVkm-qlu27WgOg5DsPIYQMQiFYWBaCIEi5MNhHjbbeJwTR2FKkqomKEYQnoIg+LGUUjIJqWlZD9d2LRPbNx9sQduV9u630ZtYB+T8X5vw9F6d+5JEaBjRuxBM2QJy-GqFvCuw1dCCgWITSqKQvhwKaB7MyXtz4oMvp3a+Pc77YOoM-V+xFIAAFFHBiFJB-HmudSF3nIbyXIVDKhPU2HeN4CxIigjRhaMm7CEGcKQa3Hh9U0E33DrmfMhZiyljLCUKsXBawLUQWfZBfsO5d0sXDWRilAxKH1FwU--1uGeIsQInMeYw62JLMQMssA8DERnrFagAARMAoc0AuIpsY9xpjwl8PQU2bm-i3JvEQn-RES86hcDRteTe9JMh-FBJECak5DHvjyaEjx7dEnJPEOHeebZ9L9SgjBEaBQRzcXoQyQmpRCZZBCd7Ap7chEiJIoIx+wjcFiJSn44hbZ4x0iqWsQ8ADRTqKroeCqiRoJWzmp0xadUemrLWus3ZWycGiLAPg70+yiFf1Asc1GMJuLxhCBcpIT15gnMJqCGawp4QGOnBwparyL71Q+aIr5OyfkQEkU4GRgLXLAuSKC2EZzIXhEuQOOpd4WFVlWAsXU6EOmoqMei3QfcmqyjEAQblRB+6wBwNYmJRY4nll+DWOsXSuU8phvmAVCrYDDNAiwlI4IoR9iTAiTYNDEBLDiEhOZsIuKavFPAvQZBYDCGoMDTWHUuqlMOaBN41pPjfBlv8QErFrS0UvHXfkDI+TlSwjau1Dr9qEBhurXxJKeqvBuUhaY3ZzbRH+HBUIYpwSGiPtjTVCxw1wEjWtKwHrtIeQ1vmLcLqgWZVZHU+h2RpgHz-pCBp3xYjC0TPlaojcrUA1tVIFW5aNzUA1suKwAB1V+JSDn1teDxZtuU20wg7QOY+KRUaMjRo7NGYpi3DvtWWv8Na9qWXOCzNmZ1z1qsynya8FRt38kLvENGkJUiPI5daktI7T2c01lenWt6ALbgNgm3mQZ3iep+H8AESw-VbHoVsRI3YLyCjdk8iN-76rVrAxetqVgjpflgKdDmd662ksyuba8sZt0rHBSKeEmqOxHtLXhs9BHNZqwI-e4I8YjSfUTDUBE0JcjXnSLRBhsYJrWh9d+haOGT2ccA8uAwpYiCqmclRxNiAl6sl0HU3UuRRObHLgeJF9IJroX7YifK7HcP-XwxDTBCANN920-rBd1HgihsKMaNIkIFksITFmzNZRQTGbs8kMKg7lOjqwLOsYbmXMXV01BgKelIQFuthhyTMITWMjiPycISz4t-pU85pLc6q1-mvezZL87IO5xWE+kcsQxxilLqKeYjmqu6AAO6enlG6Jq2BVxCAxKzNTl76sgYo3xjLudAkFGCRV49KthspagGNkga4pvXsA2KgsEr7HSpyXaBLa1tujfGwd6bAg9bLYCdGdb2HKsq2hgASWoJp7Td9tY3sW65rmPm9MICy2pHLba8sLGvAmO89zg2lBbQOj7m21o-b+55tObmge6zvRBhSrrMq6mvFCJHpCIysjiP8DQU4NoQDgDIFELXAwAFoV7Rg5wsMo0rDRLxWMfC8KKFoHHaGYdnIy1gBdSPUdGw5yogP1AhcakJKrWxhNorCmY5S3Gl26izQY0ZGYVyhTIQpoghMN5lDnXweeXlzU4pe6bsjFGWcrA3JPF2Gq7emuIQW96y5VwUbXtEqyMeMiw2knvAa0xBptTmtvlKatopUZIuo1jMltuhekcQrdIu4lCOPNMvsxuTz73z8FEIB9YcHgEofDWGm3ZHn1obqjcWWWE+UKfEC87FgUDnsJjROKCrGX4Klu+9N4d4yJUA+8IEFB8P++r7NgINQgFhHrGUHxCEayoJlB1uIxWY-6-SM5iF71XiH5UvjlBKMVnk3EhRpBhebV6zSGQJgL9BafbysVtkNliJvcjZq8Ywm8t9pgV9OIER3JExlkFU+UCBF9j4W9zZEChVeUlVqCVV6CWFGCxRmDwhWCK55cisfhuIaVoh2VXFyCkCBCKCmpqDsU8FPR-l6CZklEsCWDcDhRwRkI-gRx3VFNcl5U+DFUw5lUbDqCM5aBxEbDdDApMDxCcCnpmDZlfhSg65pl+tgZF8B8edNVa8nFC5KgqwndLCrtPtT0K0J1QDP5wCc17ZU0sh00J9wtqp6FqheJDRphgEgiANz1F8sgm1cpohUNnp+wplBZrNRRERNhqh4xSjOMmsUi5FAxtEAtN4JoVhYR-Drx6gygWV+QgtUghYsMf0h0ON-pbtbg9sJtDsZtyib8oNVsDwEhaIosakShPoFg4iWhrs6YY1ft-s8cF9Njc5GRohXpD5GVrRRcEd0DYtERDwShEwtgGc1AgA */
    context: {
      transcriptions: {},
      isTranscribing: false,
      lastState: "inactive",
      userIsSpeaking: false,
      timeUserStoppedSpeaking: 0,
      defaultPlaceholderText: "",
      shouldRespond: shouldAlwaysRespond(),
      isMaintainanceMessage: false,
    },
    id: "conversation",
    initial: "inactive",
    states: {
      inactive: {
        description: "Idle state, not listening or speaking. Privacy mode.",
        entry: [
          {
            type: "callNotStarted",
          },
        ],
        exit: assign({
          lastState: "inactive",
        }),
        on: {
          "saypi:promptReady": {
            actions: [
              assign({
                defaultPlaceholderText: () =>
                  getChatbotDefaultPlaceholder(),
              }),
            ],
            description: `Update the context when the prompt area has been loaded in the UI.`,
          },
          "saypi:call": {
            target: "#conversation.callStarting",
            description:
              'Place a "call" to Pi.\nAttempts to start the microphone and begin active listening.',
          },
          "saypi:piSpeaking": {
            target: "#conversation.responding.piSpeaking",
          },
        },
      },

      callStarting: {
        description: "Call is starting. Waiting for microphone to be acquired.",
        entry: [
          {
            type: "callIsStarting",
          },
          {
            type: "setupRecording",
          },
          {
            type: "callStartingPrompt",
          }
        ],
        exit: [
          {
            type: "clearPrompt",
          },
          {
            type: "updatePreferences",
          }
        ],
        on: {
          "saypi:callReady": {
            target: "#conversation.listening.recording",
            actions: [
              {
                type: "callHasStarted",
              },
              {
                type: "startRecording",
              },
              {
                type: "activateAudioOutput",
              },
              {
                type: "requestWakeLock",
              }
            ],
            description: "VAD microphone is ready.\nStart it recording.",
          },
          "saypi:hangup": {
            target: "inactive",
            description: "Call was cancelled before it started.",
            actions: [
              {
                type: "callFailedToStart",
              },
            ],
          },
          "saypi:callFailed": {
            target: "inactive",
            description:
              "VAD microphone failed to start.\nAudio device not available.",
            actions: [
              {
                type: "callFailedToStart",
              },
            ],
          },
        },
        after: {
          "20000": {
            target: "inactive",
            description:
              "Call failed to start after 20 seconds. Is the microphone available?",
            actions: [
              {
                type: "callFailedToStart",
              },
            ],
          },
        },
      },

      listening: {
        description:
          "Actively listening for user input. Simultaneously recording and transcribing user speech. Gentle pulsing animation.",
        entry: [
          {
            type: "stopAllAnimations",
          },
          {
            type: "acquireMicrophone",
          },
          assign({ 
            timeUserStoppedSpeaking: 0  // Reset when starting fresh listening session
          }),
        ],
        exit: [
          {
            type: "clearTranscriptsAction",
          },
          {
            type: "clearPendingTranscriptionsAction",
          },
          {
            type: "clearPrompt",
          },
          assign({ lastState: "listening" }),
        ],
        states: {
          recording: {
            description:
              "Microphone is on and VAD is actively listening for user speech.",
            initial: "notSpeaking",
            entry: [
              {
                type: "startAnimation",
                params: {
                  animation: "glow",
                },
              },
              {
                type: "listenPrompt",
              },
            ],
            exit: [
              {
                type: "stopAnimation",
                params: {
                  animation: "glow",
                },
              },
              {
                type: "clearPrompt",
              },
            ],
            states: {
              notSpeaking: {
                description:
                  "Microphone is recording but no speech is detected.",
                on: {
                  "saypi:userFinishedSpeaking": {
                    target: "#conversation.inactive",
                  },
                  "saypi:userSpeaking": {
                    target: "userSpeaking",
                  },
                },
              },
              userSpeaking: {
                description:
                  "User is speaking and being recorded by the microphone.\nWaveform animation.",
                entry: [
                  {
                    type: "startAnimation",
                    params: {
                      animation: "userSpeaking",
                    },
                  },
                  assign({ 
                    userIsSpeaking: true,
                    timeUserStoppedSpeaking: 0  // Reset when new speech begins (aggressive, as this speech could be invalidated later with stopSpeaking - no audio)
                  }),
                  {
                    type: "cancelCountdownAnimation",
                  },
                ],
                exit: {
                  type: "stopAnimation",
                  params: {
                    animation: "userSpeaking",
                  },
                },
                on: {
                  "saypi:userStoppedSpeaking": [
                    {
                      target: [
                        "notSpeaking",
                        "#conversation.listening.converting.transcribing",
                      ],
                      guard: "hasAudio",
                      actions: [
                        assign({
                          userIsSpeaking: false,
                          timeUserStoppedSpeaking: () => new Date().getTime(),
                        }),
                        {
                          type: "transcribeAudio",
                        },
                      ],
                    },
                    {
                      target: "notSpeaking",
                      guard: "hasNoAudio",
                    },
                  ],
                },
              },
            },
            on: {
              "saypi:hangup": {
                target: "#conversation.inactive",
                actions: [
                  {
                    type: "stopRecording",
                  },
                  {
                    type: "callHasEnded",
                  },
                  {
                    type: "releaseWakeLock",
                  },
                  assign({ timeUserStoppedSpeaking: 0 })  // Clear on call end
                ],
                description:
                  'Disable the VAD microphone.\n    Aka "call" Pi.\n    Stops active listening.',
              },
            },
          },

          converting: {
            initial: "accumulating",
            states: {
              accumulating: {
                description:
                  "Accumulating and assembling audio transcriptions into a cohesive prompt.\nSubmits a prompt when a threshold is reached.",
                after: {
                  submissionDelay: {
                    target: "submitting",
                    guard: "submissionConditionsMet",
                    description: "Submit combined transcript to Pi after waiting for user to stop speaking.",
                  },
                  [USER_STOPPED_TIMEOUT_MS]: { // Uses the constant as the delay duration
                    target: "submitting",
                    guard: "submissionConditionsMet",
                    description: "Submit combined transcript to Pi after a prolonged period of user not speaking.",
                  },
                },
                entry: {
                  type: "draftPrompt",
                },
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    // v5: same-target transitions are internal by default. v4
                    // treated this as an external self-transition, re-running the
                    // entry (draftPrompt) to redraft from the newly accumulated
                    // transcript. reenter:true preserves that.
                    reenter: true,
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description:
                      "Transcribed speech to text (out of sequence response).",
                  },
                  "saypi:transcribeFailed": {
                    target:
                      "#conversation.listening.errorStatus.errors.transcribeFailed",
                    description:
                      "Out of sequence error response from the /transcribe API",
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
                  },
                  "saypi:transcribedEmpty": {
                    target: "#conversation.listening.errorStatus.errors.micError",
                    description:
                      "Out of sequence empty response from the /transcribe API",
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
                  },
                },
              },
              submitting: {
                description: "Submitting prompt to Pi.",
                entry: [
                  {
                    type: "setMaintainanceFlag",
                  },
                  {
                    type: "logSubmissionTiming",
                  },
                  {
                    type: "mergeAndSubmitTranscript",
                  },
                  {
                    type: "notifySentMessage",
                  },
                  {
                    type: "setMaintainanceFlag",
                  },
                  {
                    type: "openTurnOutcome",
                  }
                ],
                exit: ["acknowledgeUserInput"],
                always: "#conversation.responding.piThinking",
              },
              transcribing: {
                description:
                  "Transcribing audio to text.\nCard flip animation.",
                entry: [
                  {
                    type: "startAnimation",
                    params: {
                      animation: "transcribing",
                    },
                  },
                  assign({ isTranscribing: true }),
                ],
                exit: [
                  {
                    type: "stopAnimation",
                    params: {
                      animation: "transcribing",
                    },
                  },
                  assign({ isTranscribing: false }),
                ],
                on: {
                  "saypi:transcribed": {
                    target: "accumulating",
                    actions: {
                      type: "handleTranscriptionResponse",
                    },
                    description: "Successfully transcribed user audio to text.",
                  },
                  "saypi:transcribeFailed": {
                    target: [
                      "accumulating",
                      "#conversation.listening.errorStatus.errors.transcribeFailed",
                    ],
                    description:
                      "Received an error response from the /transcribe API",
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
                  },
                  "saypi:transcribedEmpty": {
                    target: [
                      "accumulating",
                      "#conversation.listening.errorStatus.errors.micError",
                    ],
                    description:
                      "Received an empty response from the /transcribe API (no speech detected)",
                    actions: {
                      type: "recordTranscriptionFailure"
                    }
                  },
                },
              },
            },
          },

          errorStatus: {
            description: `Handles non-fatal errors during recording and transcription.`,
            initial: "normal",
            states: {
              normal: {
                description: "The system is not exhibiting any errors.",
              },
              errors: {
                description: `Non-fatal transcription or recording errors. A compound (NOT parallel) state so the two error leaves are mutually exclusive — a /transcribe failure must not also trigger the mic-error hint, and vice-versa (#311). Every transition into this state targets a leaf explicitly, so 'initial' is only a formal requirement.`,
                initial: "transcribeFailed",
                entry: {
                  type: "callHasErrors",
                },
                exit: {
                  type: "callHasNoErrors",
                },
                after: {
                  "5000": [
                    {
                      target: "#conversation.listening.errorStatus.normal",
                      actions: [],
                      description:
                        "Reset to the normal state and clear errors.",
                    },
                  ],
                },
                states: {
                  transcribeFailed: {
                    description: "The /transcribe API responded with an error.",
                    entry: {
                      type: "startAnimation",
                      params: {
                        animation: "error",
                      },
                    },
                    exit: {
                      type: "stopAnimation",
                      params: {
                        animation: "error",
                      },
                    },
                    type: "final",
                  },

                  micError: {
                    description: "No audio input detected",
                    entry: {
                      type: "showOrSuppressAudioInputErrorHint",
                    },
                    exit: {
                      type: "dismissNotification",
                    },
                    type: "final",
                  },
                },
              },
            },
          },
        },
        on: {
          "saypi:piThinking": {
            target: "#conversation.responding.piThinking",
            actions: [
              {
                type: "acknowledgeUserInput",
              },
              {
                // Not our auto-submit path — discard any stale turn snapshot (#505).
                type: "clearPendingTurnOutcome",
              },
            ],
          },
          "saypi:piSpeaking": {
            target: "#conversation.responding.piSpeaking",
          },
          "saypi:visible": {
            actions: {
              type: "requestWakeLock",
            },
          },
          "saypi:audio:connected": {
            actions: {
              type: "notifyAudioConnected",
            },
          },
          "saypi:audio:reconnect": {
            actions: [
              {
                type: "notifyAudioReconnecting",
              },
              {
                type: "reconnectAudio",
              },
            ],
          },
          "saypi:session:assigned": {
            actions: assign({
              sessionId: ({ event }) =>
                (event as ConversationSessionAssignedEvent).session_id,
            }),
          },
        },
        type: "parallel",
      },

      responding: {
        initial: "piThinking",
        on: {
          "saypi:hangup": {
            target: "inactive",
            actions: [
              {
                type: "callHasEnded",
              },
              {
                type: "releaseWakeLock",
              },
              {
                type: "stopRecording",
              },
            ],
            description: "End call while Pi is speaking.",
          },
          "saypi:userSpeaking": {
            target: "#conversation.responding.userInterrupting",
            guard: {
              type: "interruptionsAllowed",
            },
          },
        },
        entry: [
          {
            type: "disableCallButton",
          },
          {
            type: "suppressResponseEarlyWhenMaintainance",
          },
        ],
        exit: [
          {
            type: "enableCallButton",
          },
          {
            type: "clearMaintainanceFlag",
          }
        ],
        description:
          "Pi is responding. Text is being generated or synthesised speech is playing or waiting to play.",
        states: {
          piThinking: {
            on: {
              // Resume-window CLOSE (#505). v1 closes on the FIRST response signal
              // to leave piThinking — piWriting (text) or piSpeaking (TTS). With
              // TTS on the order is piThinking->piWriting->piSpeaking, so v1 closes
              // at text-appear rather than the spec's preferred TTS-start; this
              // slightly under-counts resumes in the text-shown-not-yet-spoken gap.
              // Deliberate v1 simplification (founder-approved) — spec-fidelity is
              // tracked in #510. Emitting on the single piThinking exit keeps it to
              // exactly one event per turn.
              "saypi:piSpeaking": {
                target: "piSpeaking",
                actions: {
                  type: "emitTurnOutcome",
                  params: { kind: "response-started" },
                },
              },
              "saypi:piWriting": {
                target: "piWriting",
                actions: {
                  type: "emitTurnOutcome",
                  params: { kind: "response-started" },
                },
              },
              // The user resumed speaking before the response started — a
              // false finish (we cut them off). Captured only when interruptions
              // are enabled (the default); this is the same transition the parent
              // `responding` region uses, with the outcome emit attached. (#505)
              "saypi:userSpeaking": {
                target: "#conversation.responding.userInterrupting",
                guard: {
                  type: "interruptionsAllowed",
                },
                actions: {
                  type: "emitTurnOutcome",
                  params: { kind: "resumed" },
                },
              },
            },
            after: {
              [PI_THINKING_TIMEOUT_MS]: [
                {
                  target: "#conversation.listening",
                  guard: {
                    type: "wasListening",
                  },
                  // Window close: the response never started. (#505)
                  actions: {
                    type: "emitTurnOutcome",
                    params: { kind: "no-response" },
                  },
                  description:
                    "Fallback: Pi's response was never detected as written/spoken (e.g. host DOM drift broke completion detection). Recover the call's listening state instead of staying stuck on 'thinking', and restore the prompt placeholder via the exit action.",
                },
                {
                  target: "#conversation.inactive",
                  guard: {
                    type: "wasInactive",
                  },
                  actions: {
                    type: "emitTurnOutcome",
                    params: { kind: "no-response" },
                  },
                  description:
                    "Fallback when Pi was responding outside a call: return to inactive and restore the placeholder.",
                },
              ],
            },
            entry: [
              {
                type: "startAnimation",
                params: {
                  animation: "piThinking",
                },
              },
              {
                type: "thinkingPrompt",
              },
            ],
            exit: [
              {
                type: "stopAnimation",
                params: {
                  animation: "piThinking",
                },
              },
              {
                type: "clearPrompt",
              },
            ],
            description:
              "Pi is contemplating its response.\nThinking animation.",
          },
          piSpeaking: {
            on: {
              "saypi:piStoppedSpeaking": [
                {
                  target: "#conversation.listening",
                  guard: {
                    type: "wasListening",
                  },
                },
                {
                  target: "#conversation.inactive",
                  guard: {
                    type: "wasInactive",
                  },
                },
              ],
              "saypi:piFinishedSpeaking": {
                target: "#conversation.listening",
              },
              "saypi:userSpeaking": {
                target: "userInterrupting",
                guard: {
                  type: "interruptionsAllowed",
                },
                actions: {
                  type: "pauseAudio",
                },
                description:
                  "The user starting speaking while Pi was speaking.",
              },
              "saypi:interrupt": [
                {
                  target: "waitingForPiToStopSpeaking",
                  description: `The user has forced an interruption, i.e. tapped to interrupt Pi, during a call.`,
                  actions: "pauseAudio",
                  guard: "wasListening",
                },
                {
                  target: "#conversation.inactive",
                  description: `The user forced an interruption, i.e. tapped to interrupt Pi, outside of a call.`,
                  actions: "pauseAudio",
                },
              ],
            },
            entry: [
              {
                type: "callInterruptibleIfListening",
              },
              {
                type: "startAnimation",
                params: {
                  animation: "piSpeaking",
                },
              },
              {
                type: "speakingPrompt",
              },
              {
                type: "pauseRecordingIfInterruptionsNotAllowed",
              },
              {
                type: "suppressSpokenResponseWhenMaintainance",
              },
              {
                type: "notifyPiSpeaking",
              },
            ],
            exit: [
              {
                type: "stopAnimation",
                params: {
                  animation: "piSpeaking",
                },
              },
              {
                type: "clearPrompt",
              },
              {
                type: "resumeRecording",
              },
              {
                type: "callContinues",
              },
            ],
            description:
              "Pi's synthesised speech audio is playing.\nPlayful animation.",
          },
          piWriting: {
            on: {
              "saypi:piSpeaking": {
                target: "piSpeaking",
              },
              "saypi:piStoppedWriting": {
                target: "#conversation.listening",
                actions: {
                  type: "suppressWrittenResponseWhenMaintainance",
                },
              },
            },
            entry: {
              type: "writingPrompt",
            },
            exit: {
              type: "clearPrompt",
            },
            description: "Pi's text response is being streamed to the page.",
          },
          waitingForPiToStopSpeaking: {
            on: {
              "saypi:piStoppedSpeaking": {
                target: "userInterrupting",
              },
            },
            after: {
              500: {
                target: "userInterrupting",
                description: "Fallback transition after 500ms if piStoppedSpeaking event does not fire.",
              },
            },
            description: "Interrupt requested. Waiting for Pi to stop speaking before recording.",
          },
          userInterrupting: {
            on: {
              "saypi:userStoppedSpeaking": [
                {
                  target: "piSpeaking",
                  actions: {
                    type: "resumeAudio",
                  },
                  guard: {
                    type: "hasNoAudio",
                  },
                  description: "User speech cancelled (i.e. was non-speech).",
                },
                {
                  target: [
                    "#conversation.listening.converting.transcribing",
                    "#conversation.listening.recording.notSpeaking",
                  ],
                  guard: {
                    type: "hasAudio",
                  },
                  actions: [
                    assign({
                      userIsSpeaking: false,
                      timeUserStoppedSpeaking: () => new Date().getTime(),
                    }),
                    {
                      type: "transcribeAudio",
                    },
                  ],
                  description: "User has spoken.",
                },
              ],
            },
            entry: [
              {
                type: "interruptingPiPrompt",
              },
              {
                type: "startAnimation",
                params: {
                  animation: "glow",
                },
              },
            ],
            exit: [
              {
                type: "clearPrompt",
              },
              {
                type: "stopAnimation",
                params: {
                  animation: "glow",
                },
              },
            ],
            description:
              "The user is speaking during Pi's response, and may wish to interrupt.",
          },
        },
      },
    },
    on: {
      "userPreferenceChanged": {
        actions: assign({
          shouldRespond: ({ context, event }) => {
            const e = event as ConversationUserPreferenceChangedEvent;
            // Update shouldRespond based on discretionary mode if it was changed
            console.debug("userPreferenceChanged", e);
            if (e.discretionaryMode !== undefined) {
              return !e.discretionaryMode; // shouldRespond is true when discretionary mode is false
            }
            return context.shouldRespond; // keep existing value if discretionary mode wasn't changed
          }
        })
      }
    },
  }
);
function readyToSubmitOnAllowedState(
  allowedState: boolean,
  context: ConversationContext
): boolean {
  const empty = Object.keys(context.transcriptions).length === 0;
  const pending = isTranscriptionPending();
  const ready = allowedState && !empty && !pending;
  return ready;
}
function provisionallyReadyToSubmit(context: ConversationContext): boolean {
  const allowedState = !(context.userIsSpeaking || context.isTranscribing); // we don't have access to the state, so we read from a copy in the context (!DRY)
  return readyToSubmitOnAllowedState(allowedState, context);
}
function isTimeoutReached(context: ConversationContext): boolean {
  // If timeUserStoppedSpeaking hasn't been updated yet, there's no timeout.
  if (context.timeUserStoppedSpeaking === 0) {
    return false;
  }
  const timeSinceStoppedSpeaking = Date.now() - context.timeUserStoppedSpeaking;
  return timeSinceStoppedSpeaking > USER_STOPPED_TIMEOUT_MS;
}

function mustRespondToMessage(context: ConversationContext): boolean {
  const timeoutReached = isTimeoutReached(context);
  if (timeoutReached) {
    const timeSinceStoppedSpeaking = Date.now() - context.timeUserStoppedSpeaking;
    console.info("Must respond due to timeout - user stopped speaking", timeSinceStoppedSpeaking/1000, "seconds ago");
  }
  return context.shouldRespond || isContextWindowApproachingCapacity(context.transcriptions) || timeoutReached;
}

export function createConversationMachine(bot: Chatbot) {
  chatbot = bot;
  return machine;
}
