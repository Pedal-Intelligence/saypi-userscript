Patient Listening and Variable Submission Delay

Purpose
- Say, Pi aims to be a patient listener that defers taking its turn until the last practical moment. The mechanism below minimizes premature cut‑offs while avoiding unnecessary latency.

Signals
- userStopped: set when microphone VAD fires with audio; stored as `context.timeUserStoppedSpeaking`.
- transcripts: `/transcribe` responses with `text`, `sequenceNumber`, and optional `pFinishedSpeaking` [0..1] and `tempo` [0..1].
- readiness: not speaking, not transcribing, no pending requests.

Timing Model
- File: src/TimerModule.ts:1
  - `initialDelay = maxDelay * pFinishedSpeaking * (1 - tempo)`
  - `finalDelay = max(initialDelay - elapsedSinceStop, 0)`
- `maxDelay` currently 7000 ms.
  - `pFinishedSpeaking` defaults to 1 when absent.
  - `tempo` defaults to 0 (neutral) and is clamped to [0,1].

Where It Runs
- File: src/state-machines/ConversationMachine.ts:1522
  - In `listening.converting.accumulating`, `after: submissionDelay` schedules a transition to `submitting` once `finalDelay` elapses.
  - On entry to `submitting`, the machine immediately transitions to `responding.piThinking`.

Submission Gate (crucial)
- File: src/state-machines/ConversationMachine.ts:1468
- Guard `submissionConditionsMet` requires all of:
  - `autoSubmitEnabled` preference
  - `mustRespond`: discretionary mode off, or context window near capacity, or timeout reached
  - `ready`: not speaking, not transcribing, no pending transcriptions
  - `userHasStoppedSpeaking = (timeUserStoppedSpeaking > 0)`
- This last check prevents old trailing transcripts from triggering 0 ms submits after a new utterance starts.

Design Philosophy
- “Always be listening.” Defer the response to give the user every chance to continue.
- Be conservative with short or high‑tempo utterances (small `initialDelay`), but do not add needless fixed latency.
- Fall back after silence: if the user has stopped long enough (`USER_STOPPED_TIMEOUT_MS = 10s`), submit regardless of scores.

Telemetry and Debugging
- File: src/state-machines/ConversationMachine.ts:1578
  - Logs `submissionDelay` details: `pFinished`, `tempo`, `initialDelay`, `finalDelay`, `scheduledAt`, `nextSubmissionTime`.
- File: src/state-machines/ConversationMachine.ts:1429
  - Logs `submissionTiming` on submit: planned vs. actual wait (jitter).
- Guard logging includes `{ noStopYet: true }` when `timeUserStoppedSpeaking` is 0 to explain skips.
- Enable debug:
  - URL query `?saypi_debug=1`, or `localStorage.setItem('saypi:debug','true')`, or build with `DEBUG_LOGS=true`/`SAYPI_DEBUG=true`.

Tuning Knobs
- `maxDelay` (ConversationMachine) — global cap.
- `pFinishedSpeaking` and `tempo` — upstream features; client clamps tempo and uses neutral default (0) when absent.
- Optional future floor: a tiny minimum delay for near‑instant cases if desired (not enabled by default).
- `USER_STOPPED_TIMEOUT_MS` — submit regardless after prolonged silence.

Tests
- test/timers/calculateDelay.spec.ts — verifies timing math.
- test/TranscriptionModule.tempo-forwarding.spec.ts — ensures server `tempo`/`pFinishedSpeaking` propagate.
- test/state-machines/ConversationMachine-submissionDelay.spec.ts — proves that accumulating holds until the delay elapses and that merges don’t preempt the timer.

Practical Guidance
- If you see premature submits, check logs for `noStopYet: true` (guard blocked) or `finalDelay: 0` with very small `initialDelay`.
- If a provider stops returning `tempo`, the default remains patient (no zeroing due to `(1 - tempo)`), so behavior degrades gracefully.

