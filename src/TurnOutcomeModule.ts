import { callApi } from "./ApiClient";
import { config } from "./ConfigModule";
import { logger } from "./LoggingModule.js";

/**
 * Turn-outcome reporting for the endpointing (turn-detection) eval — issue #505.
 *
 * After SayPi auto-submits an endpointing-driven prompt, a "resume window" runs
 * from the submit until the assistant's response starts. The only non-circular
 * ground truth for "did the user actually finish their turn?" is whether the
 * user started speaking again inside that window (a resume = we cut them off).
 * This module POSTs that observation to the SayPi API so the server can score
 * how good `pFinishedSpeaking` is at deciding when a turn ended.
 *
 * The payload is deliberately **text-free** (privacy): booleans, timestamps, a
 * sequence number and an optional score only — never transcript content. See
 * saypi-api PR #310 (endpoint) and `docs/llm/endpointing-turn-signal-spec.md`
 * (PR #309) for the server-side contract and rationale.
 */
export interface TurnOutcomeInput {
  /** Correlation key — the same session id sent on /transcribe. */
  sessionId?: string;
  /** sequenceNumber of the last utterance in the turn (the endpointing decision point). */
  lastSequenceNumber?: number;
  /** Only "auto" turns are scored; manual sends never reach this module. */
  trigger?: "auto" | "manual";
  /** Did the user start speaking again inside the resume window? */
  userResumed: boolean;
  /** When SayPi submitted the prompt (epoch ms, our clock). */
  submittedAt: number;
  /** Window close: TTS start, or reply-text-appears if TTS is off (epoch ms); null if it never started. */
  responseStartedAt: number | null;
  /** If the user resumed, when (epoch ms); null otherwise. */
  resumedAt: number | null;
  /** VAD speech-offset of the final clip — the moment the user actually stopped (epoch ms). */
  lastSpeechEndedAt: number | null;
  /** Optional — the score from the last /transcribe response. */
  pFinishedSpeaking?: number | null;
  /** Optional — pi / claude / chatgpt, for filtering. */
  app?: string | null;
}

function toIso(ms: number | null | undefined): string | null {
  return ms == null ? null : new Date(ms).toISOString();
}

/**
 * Fire-and-forget POST of a single turn-outcome event. Never awaited, never
 * retried, never throws to the caller: a dropped event just leaves that turn to
 * the server-side fallback — the UX must not depend on it.
 *
 * Skips entirely when the correlation keys (session id, sequence number) are
 * absent, since the server has nothing to join the event to.
 */
export function postTurnOutcome(input: TurnOutcomeInput): void {
  if (!input.sessionId || input.lastSequenceNumber == null) {
    logger.debug(
      "[TurnOutcome] skipping post — missing correlation key",
      { hasSession: !!input.sessionId, seq: input.lastSequenceNumber }
    );
    return;
  }

  const body = {
    session_id: input.sessionId,
    last_sequence_number: input.lastSequenceNumber,
    trigger: input.trigger ?? "auto",
    user_resumed: input.userResumed,
    submitted_at: toIso(input.submittedAt),
    response_started_at: toIso(input.responseStartedAt),
    resumed_at: toIso(input.resumedAt),
    last_speech_ended_at: toIso(input.lastSpeechEndedAt),
    p_finished_speaking: input.pFinishedSpeaking ?? null,
    app: input.app ?? null,
  };

  try {
    void callApi(`${config.apiServerUrl}/turn-outcome`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((err) => {
      logger.debug("[TurnOutcome] post failed (ignored)", err);
    });
  } catch (err) {
    logger.debug("[TurnOutcome] post threw (ignored)", err);
  }
}
