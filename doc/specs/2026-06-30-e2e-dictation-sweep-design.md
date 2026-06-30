# e2e-dictation-sweep design

## Problem

`e2e-host-sweep` (doc/e2e-host-sweep.md) drives a real voice-conversation turn on
pi.ai/claude.ai/chatgpt.com to catch real-host DOM drift in SayPi's chat integration.
It has no counterpart for **universal dictation** — `UniversalDictationModule.ts`,
the separate code path that injects a floating per-field button into arbitrary
non-chat-host input fields and drives speech-to-text into them. There is no Layer-3
(hermetic) coverage for it either (`e2e/specs/dictation-stt.e2e.ts` and
`synthetic-audio-stt.e2e.ts` both exercise dictation through the pi.ai chat composer,
not `UniversalDictationModule`). The only existing artifact is a manual test fixture,
`test/fixtures/test-dictation.html`, never wired into any automated runner.

## Empirical validation (done before this spec)

Two live Layer-4 (CDP) spikes against the current dev build confirmed the
synthetic-speech primitive (`saypi:dev-feed-speech`) works for universal dictation,
which is NOT activated via `#saypi-callButton` (the chat-host mechanism) but via a
floating `.saypi-dictation-button` injected per focused field:

1. **Local fixture** (`test/fixtures/test-dictation.html`, served over a local static
   HTTP server): focused `#message` textarea → `.saypi-dictation-button:visible`
   appeared → armed synthetic speech → clicked the button → `Dictation Machine
   [TEXTAREA]` ran through VAD → STT (`api.saypi.ai/transcribe`) → the synthetic
   sentence landed in the field. Confirmed visually via screenshot.
2. **Mistral's Le Chat** (`https://chat.mistral.ai/chat`, branded "Vibe" in-product) —
   real, public, reachable with **no login** (one-time "Accept and continue" ToS
   dialog, no sign-in/sign-up required to use the composer). Its composer is a real
   `ProseMirror` contenteditable (`class="ProseMirror"`). Same flow confirmed
   end-to-end: button appeared, transcript landed correctly, screenshot shows
   "Sign in"/"Sign up" still present (never authenticated).

Candidates ruled out for v1: **Character.AI** hard-gates behind a signup wall before
any composer is reachable. **GitHub** issue/PR comment boxes require sign-in for
anonymous users (no usable textarea without auth). **Gemini** only "worked" because
the shared seeded CDP profile already carries a logged-in Google session from prior
unrelated browsing — not a reproducible login-free path, so excluded to avoid an
undocumented auth dependency.

## Non-goals (v1)

- The right-click "Start Dictation with Say, Pi" context-menu activation path (a
  second documented way to start dictation, per the test fixture's instructions) —
  not exercised; native context menus aren't practically driveable over CDP/Playwright
  without an extension-side test hook, and the button-click path already proves the
  underlying mechanism.
- Cross-field auto-switch (focusing a different field while dictation is active).
- Lexical/Slate/Quill editor-strategy coverage — no login-free site using those
  frameworks was found in this pass. Documented as a follow-up target, not built now.
- Model/voice selection, TTS, "assistant replied" detection — none of these exist in
  dictation; the verification model is intentionally much simpler than the chat sweep.

## Architecture

A sibling to `e2e-host-sweep`, not an extension of it — the two have incompatible
success models (multi-turn conversation + TTS vs. single-field-value landed) and
sharing one script would mean threading chat-only branches through dictation runs.

```
scripts/
  layer4cdp-lib.mjs              (existing, reused as-is: CDP launch, profile,
                                   Cloudflare detection, clean shutdown)
  e2e-dictation-sweep-lib.mjs    (new: pure helpers — TARGETS table, evidence
                                   shaping, transcript-match logic — unit-testable)
  e2e-dictation-sweep.mjs        (new: orchestration — mirrors e2e-host-sweep.mjs's
                                   shape: spawn Chrome, iterate targets, write
                                   evidence.json + summary.json, screenshots)

doc/
  e2e-dictation-sweep.md          (new: tracked runbook, mirrors
                                    doc/e2e-host-sweep.md's structure)

.claude/skills/e2e-dictation-sweep/SKILL.md   (new: LOCAL ONLY, gitignored — per the
                                                repo's existing skill-authoring
                                                convention; machinery/docs are
                                                tracked, the skill pointer is not)

package.json: add "e2e-dictation-sweep": "node scripts/e2e-dictation-sweep.mjs"
```

## Targets (v1)

An explicit, documented array in `e2e-dictation-sweep-lib.mjs` — the extension point
for adding sites later (comment points at GH issue #163, "Universal Dictation
Platform Support Roadmap", as the source of truth for what's confirmed-working vs.
known-broken):

```js
export const TARGETS = [
  {
    key: "fixture",
    label: "local test fixture",
    url: null, // served locally by the harness itself
    dismissModal: null,
    fields: [
      { selector: "#name", type: "input", label: "Name (plain input)" },
      { selector: "#message", type: "textarea", label: "Message (textarea)" },
      { selector: ".contenteditable-field", type: "contenteditable", label: "Rich Text Editor (plain contenteditable)" },
    ],
  },
  {
    key: "mistral",
    label: "Mistral Le Chat",
    url: "https://chat.mistral.ai/chat",
    dismissModal: { role: "button", name: /accept and continue/i },
    fields: [
      { selector: "[contenteditable='true'].ProseMirror, [contenteditable='true']", type: "contenteditable", label: "Composer (ProseMirror)" },
    ],
  },
];
```

## Per-field flow

No chat concepts (no model/voice select, no TTS, no conversation thread). For each
target, then each field on that target:

1. Navigate to the target's URL (skip for the fixture — harness serves it). Dismiss
   `dismissModal` if configured and present.
2. Click/focus the field selector.
3. Wait for `.saypi-dictation-button:visible` (timeout → recorded failure: "no
   dictation button appeared for this field" — this is itself evidence, not a skip).
4. Screenshot (`NN-focused.png`).
5. Arm `saypi:dev-feed-speech` (`{loop:false}`), click the visible dictation button.
6. Poll the field's `.value` (input/textarea) or `.textContent` (contenteditable)
   for the known synthetic-speech transcript text, up to 30s.
7. Screenshot (`NN-final.png`). Capture console messages (split SayPi vs. host, same
   `saypiErrors`/`hostErrors` distinction as the host sweep) and failed network
   requests matching the same filter as `e2e-host-sweep.mjs`.
8. Write per-field evidence: `{target, field, decorated, buttonAppeared,
   transcriptLanded, transcriptText, saypiErrors, consoleErrors, netFailures}`.

A run-level `summary.json` aggregates all target/field results, mirroring
`e2e-host-sweep.mjs`'s `summary.json` shape (one entry per field, not per host).

## Analysis & filing discipline

Same discipline as `doc/e2e-host-sweep.md`: corroborate with screenshots, attribute
failures to SayPi only, no padding to hit a target finding count — a clean sweep is
reported clean-with-evidence, not stretched into manufactured findings. One addition
specific to dictation: GH issue #163 is the existing roadmap/known-broken-sites
list — a finding that matches an already-logged known-broken site/behavior there is
not novel; comment on/update #163 instead of filing a duplicate `bug` issue. Only
genuine regressions on already-confirmed-working sites/fields, or new findings on the
v1 fixture (which has no prior failure history), get a fresh issue.

## Testing

- `e2e-dictation-sweep-lib.mjs`'s pure helpers (target table shape validation,
  transcript-match logic, evidence shaping) get Vitest unit tests, same pattern as
  `layer4cdp-lib.mjs`'s existing unit tests.
- The orchestration script itself (`e2e-dictation-sweep.mjs`) is validated by actually
  running it against the live Chrome/CDP harness — same as `e2e-host-sweep.mjs`, this
  is Layer-4 only, not unit-testable in isolation, and not part of CI.
