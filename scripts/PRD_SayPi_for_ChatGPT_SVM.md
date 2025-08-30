# PRD: “Say, Pi for ChatGPT” — Restore SVM-like Experience

## Overview
Restore a Standard Voice Mode (SVM)–like experience on ChatGPT’s web app using SayPi’s conversational and TTS pipeline. This gives users a warm, patient, predictable voice UX that mirrors the qualities they loved in SVM, per the #SaveStandardVoice movement.

- Target sites (MVP): chatgpt.com, chat.com. Additional: chat.openai.com and selected openai.com chat surfaces.
- Release: phased; ship Phase 2 by Sept 6 (store submission), GA on Sept 9. Phase 1 earlier as an internal milestone. Versioning: 1.10.x begins the “Say Pi for ChatGPT” track (current: 1.9.5 dictation track).

## Motivation
From “Save Standard Voice” posts (short and long forms):
- Users value SVM’s presence and warmth; longer, reflective responses felt like a companion rather than a tool.
- AVM’s snappier style can feel colder or rushed. Users want continuity and choice in tone/personality.
- SayPi is architecturally similar to SVM and already delivers a patient, interruptible experience; it’s a strong web swap‑in.
- Business clarity: when SayPi services may incur charges (subscriptions or TTS usage), clearly indicate they are from SayPi (third party), not OpenAI—consistent with how we handle Pi.

## Goals
- Enable two‑way voice on ChatGPT with minimal friction.
- Preserve “SVM feel”: patience, predictability, no premature cutoffs, optional early audio.
- Integrate seamlessly into ChatGPT’s UI (colors/type/spacing), without inappropriate copying.
- Provide opt‑in auto “read aloud,” and SayPi streaming TTS as enhancements.
- Lay groundwork for future Focus Mode.

## Non‑Goals
- No backend modifications to ChatGPT.
- No impersonation of OpenAI branding; disclose SayPi for paid features.
- No voice cloning of OpenAI voices without explicit user choice and server‑side support.

## Phases and Scope

### Phase 1 (Internal Milestone): Conversational scaffolding (submit earlier than Sept 6)
- Add ChatGPT to SayPi’s conversational set via `src/chatbots/ChatGPT.ts` (new file).
- Behaviors:
  - Insert a SayPi call button into the ChatGPT composer controls.
  - Treat the ChatGPT editor as the conversation target: insert transcribed text as the user speaks.
  - Submit the prompt when instructed by SayPi (`ConversationMachine.ts` / `ButtonModule.js`).
  - Detect assistant response start/end (no action on it yet).
- R1 voice menu: none. Do not integrate or alter ChatGPT’s voice selector in this phase.

### Phase 2 (Public MVP): Automatic Read Aloud
- Automatically “press” ChatGPT’s native “read aloud” button for the assistant response, when user preference is ON.
- Avoid re‑clicks, handle layout churn, and keep behavior idempotent.
- Preference default OFF.

### Phase 3: Streaming TTS via SayPi (earlier audio)
- Start SayPi streaming TTS as soon as the first token of ChatGPT’s textual response appears.
- Suppress native audio when SayPi streaming is ON (to avoid double audio); default OFF.
- Voice handling:
  - If possible, read the currently selected OpenAI voice (from ChatGPT’s selector) and pass it to our server‑side TTS (requires OpenAI TTS support on SayPi backend).
  - Alternatively (or additionally), offer a SayPi voice set (e.g., ElevenLabs voices) via our own voice menu specifically for ChatGPT (this menu arrives in Phase 3, not in R1).
- Maintain clarity on charges: any TTS usage charges are from SayPi, not OpenAI.

### Phase 4: Focus Mode
- Fullscreen, uncluttered, SVM‑like visuals with gentle bars animation.
- Desktop + mobile, toggle via settings and in‑UI control.

## Functional Requirements

### R1: ChatGPT chatbot integration (Phase 1)
- Implement `src/chatbots/ChatGPT.ts` extending `AbstractChatbot` and implementing `Chatbot`.
  - `getName()` -> "ChatGPT"; `getID()` -> "chatgpt".
  - Prompt editor (from ProseMirror research):
    - Primary: `[data-type="unified-composer"] [contenteditable="true"]#prompt-textarea`.
    - Fallbacks: `.ProseMirror[contenteditable="true"]` within the composer; or hidden fallback textarea `._fallbackTextarea_ebv8s_2[name="prompt-textarea"]` if needed.
  - Controls container for call button:
    - Prefer: composer trailing controls area (`[grid-area="trailing"]` / `.ms-auto` group).
    - Fallback: sibling near `button[data-testid="send-button"]`.
  - Submit strategy:
    - Prefer clicking `button[data-testid="send-button"]`.
    - Fallback: dispatch Enter key in ProseMirror; final fallback: submit the `<form data-type="unified-composer">`.
  - Chat history and response detection:
    - Robust selectors + MutationObserver to detect assistant message rendering, first‑token, and completion.
  - `getContextWindowCapacityCharacters()` safe high value (e.g., 100k) to avoid undue truncation logic.
- Voice menu: none in Phase 1; ChatGPT continues to own its own voice selection.

### R2: Call button + insertion (Phase 1)
- Add a circular call button matching ChatGPT’s and SayPi’s visual language; if the coding assistant has Canva integration, they may pull/adjust house icons.
- Conversational mode text behavior:
  - Replace field content for each submission cycle (no preservation required; that’s dictation behavior).
  - Spacing/punctuation policy follows `ConversationMachine.ts` merging and pacing (the state machine orchestrates; `ChatGPT.ts` does not re‑implement it).
- Submit on SayPi “submit” signal.

### R3: Response monitoring (Phase 1)
- Detect assistant response start (first visible token) and end (stream finished) with MutationObserver.
- Emit internal events for later phases; no audio action yet.

### R4: Preferences
- Place ChatGPT-specific preferences under the "AI Chat" tab or a new "ChatGPT" tab.
- Toggles (default OFF):
  - Auto press native Read Aloud on ChatGPT. [Phase 2]
  - Use SayPi streaming TTS for ChatGPT responses. [Phase 3]
  - Focus Mode for ChatGPT. [Phase 4]

### R5: Phase 2 — Native Read Aloud
- If enabled, click the message’s “read aloud” button once per response when it appears.
- Suppress if SayPi streaming TTS is ON (Phase 3) to avoid double audio.

### R6: Phase 3 — SayPi Streaming TTS
- Implement `ChatGPTResponse extends AssistantResponse` with a streaming parser similar to `PiTextStream`/`ClaudeTextBlockCapture`:
  - Detect first token rapidly and stream deltas reliably.
  - Filter out tool UIs/code blocks using a blocked class/tag set (modeled after `Claude` handling).
- Start SayPi audio within ~250ms of first token when enabled.
- Voice selection behavior:
  - Path A: Read OpenAI’s selected voice (if available) and instruct server‑side TTS to use it (requires server OpenAI TTS support).
  - Path B: Provide a SayPi voice selector scoped to ChatGPT responses, presenting our voices (e.g., ElevenLabs). Clear indication of SayPi billing context.
- Suppress native audio to prevent overlap when streaming is enabled.

### R7: Phase 4 — Focus Mode
- Provide a detachable overlay (no permanent DOM mutation) for immersive SVM‑like interface with minimal controls.

## Acceptance Criteria

### Phase 1 (Internal)
- On chatgpt.com and chat.com:
  - SayPi call button appears in composer controls.
  - Starting a call inserts transcribed text into the ProseMirror editor; conversation flow submits on signal.
  - Assistant response lifecycle (start/end) detected and logged; no audio taken.
  - No console errors; re‑binds survive route changes.

### Phase 2 (Public MVP)
- With “Auto press native Read Aloud” enabled, the native “read aloud” plays exactly once per response; suppressed if SayPi streaming is ON.

### Phase 3
- With “SayPi streaming TTS” enabled, audio begins within ~250ms of first token; no double audio; code/tool UI excluded from TTS; voice handling honors Path A/B; charges clearly marked as SayPi’s where relevant.

### Phase 4
- Focus Mode toggles on/off; immersive UI works on desktop and mobile; exit restores original view.

## Design Notes and Options
- Composer insertion (ProseMirror): prefer `execCommand('insertText', ...)`; fallback to selection + `beforeinput`/`input` dispatch; last resort DOM node insertion with input event.
- Response detection: MutationObserver on assistant message container; length growth + attribute heuristics; fallback polling if needed.
- Control insertion: trailing control group first, fallback near send button; rely on `DOMObserver` for route changes.
- Audio policy: initial call provides the user gesture; never overlap native with SayPi streaming; streaming default OFF.
- Billing clarity: any SayPi charges (subscription, TTS usage) are clearly labeled “Say, Pi,” separate from OpenAI.

## Technical Specs
- New: `src/chatbots/ChatGPT.ts` with:
  - `ChatGPTChatbot extends AbstractChatbot`
  - `ChatGPTPrompt extends AbstractUserPrompt`
  - `ChatGPTResponse extends AssistantResponse`
- Route detection: `isChatablePath(path)` for ChatGPT chat URLs.
- Manifest/update script: ensure matches for chatgpt.com and chat.com (MVP); add others later.
- Preferences: add three toggles (default OFF) under "AI Chat" or new "ChatGPT" tab.

## Metrics of Success
- Phase 2 (public MVP): ≥95% successful prompt submissions; auto read‑aloud triggers reliably with no double audio when streaming is OFF.
- Phase 3: ≥90% audio starts within 250ms; <1% double‑audio incidents; high stability across DOM churn.

## Risks and Mitigations
- DOM churn: implement layered selectors, MutationObserver re‑binds, and tests against captured HTML fixtures.
- Store review timing: submit by Sept 6; keep unpacked signed build as contingency.
- Autoplay: rely on user call gesture; expose toggles OFF by default.
- Performance: scope observers and disconnect when idle; no heavy polling unless required.

## Testing Strategy
- Unit/integration:
  - Composer fixture (`doc/editors/chatgpt/prompt-composer-editor-prosemirror.html`) to validate selection, insertion, submit.
  - Streaming parser unit tests for first‑token and deltas; filter exclusions.
- Manual:
  - Chrome desktop + Android: dictation->conversation, auto read‑aloud (Phase 2), streaming TTS (Phase 3), and Focus Mode.
- Regression:
  - Ensure Pi and Claude paths unaffected.

## Rollout Plan
- Phase 1 (internal) ready prior to Sept 6.
- Phase 2 submission by Sept 6 (public MVP as v1.10.0), GA on Sept 9.
- Phase 3 as v1.10.1+ after server OpenAI TTS mapping and/or SayPi voice menu for ChatGPT.
- Phase 4 as v1.10.x minor following feedback.

## Open Items (tracked for Phase 3)
- Implement server‑side OpenAI TTS support to honor ChatGPT‑selected voice, and/or expose SayPi voice set with clear SayPi billing.
- Confirm any additional domains beyond MVP.
