Patient Listening and Variable Submission Delay

Purpose
- Say, Pi aims to be a patient listener that defers taking its turn until the last practical moment. The mechanism below minimizes premature cut‑offs while avoiding unnecessary latency.

Signals
- userStopped: set when microphone VAD fires with audio; stored as `context.timeUserStoppedSpeaking`.
- transcripts: `/transcribe` responses with `text`, `sequenceNumber`, and optional `pFinishedSpeaking` [0..1] and `tempo` [0..1].
- readiness: not speaking, not transcribing, no pending requests.

Timing Model
- File: src/TimerModule.ts:1
  - `initialDelay = max(maxDelay * (1 - pFinishedSpeaking) * (1 - tempo), MIN_INITIAL_DELAY_MS)`
  - `finalDelay = max(initialDelay - elapsedSinceStop, 0)`
- The wait is patience, spent where the model says the user may NOT be finished: a low
  `pFinishedSpeaking` ("probably mid-sentence") holds the turn open; a high score submits
  promptly. (#521 — the original formula was proportional to p, which the server-side
  endpointing eval (#519) showed cut users off on exactly the utterances the model had
  flagged as unfinished.)
- `maxDelay` currently 7000 ms; `MIN_INITIAL_DELAY_MS` currently 500 ms (a grace window
  against an overconfident score when transcription returns faster than the floor).
  - `pFinishedSpeaking` absent means no signal → treated as 0 (maximum patience).
  - `tempo` defaults to 0 (neutral); both inputs are clamped to [0,1] inside calculateDelay.

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
- Spend patience where the model is unsure the user finished (low `pFinishedSpeaking` → long
  wait); submit promptly when it is confident, but never add needless fixed latency — the
  floor is measured from speech end, so transcription latency usually consumes it.
- High‑tempo speakers get shorter waits: their pauses are shorter, so a fast speaker who
  hasn’t resumed is likely done.
- Fall back after silence: if the user has stopped long enough (`USER_STOPPED_TIMEOUT_MS = 10s`), submit regardless of scores.

Telemetry and Debugging
- File: src/state-machines/ConversationMachine.ts:1578
  - Logs `submissionDelay` details: `pFinished`, `tempo`, `finalDelay`, `scheduledAt`, `nextSubmissionTime`.
- File: src/state-machines/ConversationMachine.ts:1429
  - Logs `submissionTiming` on submit: planned vs. actual wait (jitter).
- Guard logging includes `{ noStopYet: true }` when `timeUserStoppedSpeaking` is 0 to explain skips.
- Enable debug:
  - URL query `?saypi_debug=1`, or `localStorage.setItem('saypi:debug','true')`, or build with `DEBUG_LOGS=true`/`SAYPI_DEBUG=true`.

Tuning Knobs
- `maxDelay` (ConversationMachine) — global cap.
- `MIN_INITIAL_DELAY_MS` (TimerModule) — grace floor on the initial delay; empirical,
  tune against the server-side endpointing eval (#519).
- `pFinishedSpeaking` and `tempo` — upstream features; calculateDelay clamps both and
  defaults absent p to 0 (maximum patience) and absent tempo to 0 (neutral).
- `USER_STOPPED_TIMEOUT_MS` — submit regardless after prolonged silence.

Tests
- test/timers/calculateDelay.spec.ts — verifies timing math.
- test/TranscriptionModule.tempo-forwarding.spec.ts — ensures server `tempo`/`pFinishedSpeaking` propagate.
- test/state-machines/ConversationMachine-submissionDelay.spec.ts — proves that accumulating holds until the delay elapses and that merges don’t preempt the timer.

Practical Guidance
- If you see premature submits, check logs for `noStopYet: true` (guard blocked) or `finalDelay: 0` with a high `pFinished` (the elapsed transcription time consumed the wait).
- If a provider stops returning `pFinishedSpeaking` or `tempo`, the defaults remain patient (absent p → 0, absent tempo → 0), so behavior degrades gracefully.

