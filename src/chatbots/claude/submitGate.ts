/**
 * Guards Claude's synthetic-Enter submit against a turn-taking race (issue #488).
 *
 * SayPi submits a voice turn by dispatching a synthetic `Enter` keydown on the
 * composer (`ClaudeChatbot.simulateFormSubmit`). Claude's composer only submits
 * when its send control is in *send* mode; while a previous response is still
 * streaming the control is in *stop* mode and the Enter is silently dropped —
 * the transcript is stranded in the composer and Claude never replies. Fast
 * turn-taking (voice-off, or generally no TTS-playback dwell) lets
 * `ConversationMachine` return to `listening` soon enough that the next Enter
 * can land mid-generation.
 *
 * So before dispatching we check whether Claude is mid-generation; if it is, we
 * poll until it settles (bounded by `maxWaitMs`) and dispatch then. If it never
 * settles within the budget we dispatch anyway — best-effort, no worse than the
 * pre-fix behaviour, and it avoids stranding the turn forever.
 */

// Claude marks an actively-streaming assistant response with
// `data-is-streaming="true"` and flips it to `"false"` on completion. This is
// the same load-bearing signal `ClaudeResponse.dataIsStreaming` keys on, and it
// is exactly what gates the composer's send-vs-stop control.
const STREAMING_SELECTOR = '[data-is-streaming="true"]';

/** True while any Claude assistant response is actively streaming. */
export function isClaudeGenerating(doc: Document = document): boolean {
  return doc.querySelector(STREAMING_SELECTOR) !== null;
}

export interface SubmitWhenIdleOptions {
  /** Whether Claude is currently generating a response. */
  isGenerating: () => boolean;
  /** Performs the actual submit (e.g. dispatch the Enter keydown). */
  submit: () => void;
  /** Schedules a deferred check. Injectable for tests; defaults to setTimeout. */
  schedule?: (callback: () => void, ms: number) => void;
  /** Clock, injectable for tests; defaults to Date.now. */
  now?: () => number;
  /** How often to re-check while Claude is still generating. */
  pollIntervalMs?: number;
  /** Upper bound on how long to defer before dispatching best-effort. */
  maxWaitMs?: number;
}

const DEFAULT_POLL_INTERVAL_MS = 250;
// Claude answers can run long; wait generously before giving up and dispatching
// best-effort. The common case (composer already idle) never waits at all.
const DEFAULT_MAX_WAIT_MS = 30000;

/**
 * Submit as soon as Claude is idle. Dispatches synchronously when Claude is
 * already idle; otherwise polls until generation stops (or the wait budget is
 * exhausted, at which point it dispatches anyway rather than drop the turn).
 */
export function dispatchSubmitWhenIdle(options: SubmitWhenIdleOptions): void {
  const {
    isGenerating,
    submit,
    schedule = (callback, ms) => {
      setTimeout(callback, ms);
    },
    now = () => Date.now(),
    pollIntervalMs = DEFAULT_POLL_INTERVAL_MS,
    maxWaitMs = DEFAULT_MAX_WAIT_MS,
  } = options;

  if (!isGenerating()) {
    submit();
    return;
  }

  const startedAt = now();
  const poll = () => {
    if (!isGenerating()) {
      submit();
      return;
    }
    if (now() - startedAt >= maxWaitMs) {
      console.warn(
        `Claude still generating after ${maxWaitMs}ms; dispatching submit anyway (issue #488).`
      );
      submit();
      return;
    }
    schedule(poll, pollIntervalMs);
  };

  console.debug(
    "Deferring Claude submit: a previous response is still streaming (issue #488)."
  );
  schedule(poll, pollIntervalMs);
}
