# Client-side voice preview playback — implementation record

> The build note for the **"Client preview playback"** phase of the voices
> rollout ([2026-07-03-voices-rollout-handoff.md](2026-07-03-voices-rollout-handoff.md)),
> implementing design §4 of [2026-07-02-voice-selection-ux.md](2026-07-02-voice-selection-ux.md).
> Companion to those docs — they carry the *why*; this carries *what shipped and
> the decisions taken*.

## What this is

Choice by ear: a free ▶ preview affordance on voice rows that auditions a
canned ~2s sample clip, plus the plumbing to play it **without ever talking over
live TTS or an active call**. The whole feature ships **dormant** — the ▶ renders
on zero voices until saypi-api serves a `sample_url` field, exactly the #284
pattern (additive, optional, hidden-when-absent).

## Scope decision (founder, 2026-07-03)

Asked whether to keep this strictly dormant or also fix the pre-existing
select-time double-talk, the founder chose **"Also fix the double-talk now."**
So this change also reroutes the existing `introduceVoice()` audition through
the new gated path: selecting a voice mid-TTS/mid-call is now **suppressed**
rather than talking over live speech. (Accepted trade: select-mid-turn changes
from interrupt to suppress.)

## How it works

**Playback channel.** A preview reuses the existing `audio:load` → `AudioModule`
→ shared `<audio>` element path (the same channel conversation TTS uses — no new
offscreen plumbing, the three hand-synced audio-event lists are untouched). The
new `audio:preview` EventBus signal is content-script-internal.

**The gate (`AudioOutputMachine`, XState v5).** "Never double-talk" is enforced
structurally:

- A `preview` event is handled only in the machine's **resting** states —
  `idle` and `loaded.ended` — so it is silently dropped while `loading` /
  `loaded.ready` / `loaded.playing` (i.e. while audio is loading or playing).
  *(Handling `loaded.ended` too is load-bearing: a finished clip parks the
  machine there, so an idle-only gate would drop the second ▶ tap and the first
  tap after a TTS reply ends — the menu would look broken.)*
- A `callActive` context flag (set/cleared by `callStarted`/`callEnded`, bridged
  from `ConversationMachine`'s `session:started`/`session:ended` — the canonical
  call boundary, **not** the call-button DOM) closes the idle-but-in-a-call gap.
- A permitted preview sets the existing `replaying` flag so its deliberately
  source-mismatched clip is not killed by `shouldSkip`, then emits `audio:load`.

**Surfaces.** The ▶ is its own target, separate from row-select, rendered only
when `voice.sample_url` is present:

- **claude.ai / chatgpt.com** (`ClaudeVoiceMenu.createMenuItem`): the trailing
  checkmark column is wrapped in `.saypi-voice-trailing`; the ▶ (`.saypi-voice-preview`)
  sits beside the checkmark. `e.stopPropagation()` keeps play ≠ select. Styled by
  SayPi-owned SCSS (`voices.scss`) — **no new arbitrary Tailwind** the host might
  not compile (cluster-J trap avoided; the grid template is unchanged).
- **settings Voices tab** (`voices-controller.renderRow`): its own document has
  no machine/call/TTS, so it previews via a single reused `Audio()` element
  (injected as `playPreview` for testability). ▶ appears on current rows too
  (the "Your voice" card previews).
- **pi.ai — DEFERRED** (see below).

**Metered audition (`introduceVoice`).** Kept synthesizing (still metered) but
its *playback* is now gated (`speak(..., preview=true)` / `audio:preview`). The
metered *synthesis* itself is retired later — Phase 2, server-gated on clips
actually existing.

## Deferred

- **Pi menu ▶.** The Pi custom-voice row *is* a `<button>` that gets
  `disabled` on selection, so a ▶ cannot nest — it needs the row restructured
  into a wrapper + sibling button, which touches several fragile Pi-menu
  assumptions (`removeCustomVoiceRows`, `insertBefore`, the pin logic, the
  `nodeName === "BUTTON"` mutation observer — the same area that spawned Patch
  A's Pi7/8 bugs). Since the ▶ is dormant and Pi already gets the gated
  audition-on-select via the reroute, this ships **last** with real-host (Layer
  4 CDP) verification once clips exist. Tracked in a follow-up issue.
- **Keyboard reachability of the in-host ▶** — the Claude menu has no roving
  tabindex model today; v1 is mouse + `aria-label`. Its own backlog item.

## Tests (all unit/contract — the dormant affordance can't be real-host-verified yet)

- `AudioOutputMachine-preview.spec.ts` — the interrupt-safety proof (plays from
  idle/ended + sets replaying; suppressed while loading/playing; dropped during a
  call, allowed after; second-preview-after-ended).
- `AudioModulePreviewWiring.spec.ts` — source-scan guard that the EventBus→actor
  bridge exists with object-form sends (cluster-E, untyped JS seam).
- `voices-controller.spec.tsx`, `ClaudeVoiceMenu-preview.spec.ts` — ▶ gated on
  `sample_url`, separate from select, absent on non-voice rows.
- `VoiceIntroduction.spec.ts`, `SpeechSynthesisModule.spec.ts` — the reroute +
  the `speak` preview flag.

## Phase 2 — DONE (2026-07-04, PR #484)

saypi-api shipped the `sample_url` pipeline (saypi-api #292 / #294, merged **and
deployed** — live `/voices` serves `https://api.saypi.ai/voices/<id>/sample?v=<hash>`,
`200 audio/mpeg`, unauthenticated, ~2s volume-normalized, versioned). So the
feature is no longer dormant, and Phase 2 landed: **`introduceVoice` now plays the
free clip instead of the metered synthesis** whenever a voice carries `sample_url`.
Metered live-TTS survives only as the fallback for clip-less voices (custom
clones); Pi's built-in static intro URLs are unchanged. This closes the
`introduceVoice()` metered-preview quota-burn defect flagged on the post-flip watch
list. Data path verified statically end-to-end (fetch returns `sample_url` verbatim
→ `SayPi.matches()` by hostname → `host_permissions`/CSP accept `api.saypi.ai`);
the remaining check is a Layer-4 (CDP) real-host spot-check on live claude.ai.

## Pending / coordination

- One new i18n key `voicesPreview` (English only) — a founder `npm run translate`
  run is pending (adds to the ~16 keys already awaiting).
- **Pi menu ▶** (see Deferred) still needs the row restructure + Layer-4 verify —
  saypi-userscript #483. Pi voices carry no `sample_url`, so Pi keeps the metered
  fallback audition; the ▶ there is a separate affordance.
- **saypi-api curation manifest** (§5 fields: `featured`/`section`/`recommended`/
  `language`/`sibling_id`/`deprecated` + measured chars-per-minute) — saypi-api
  #293, still open; consumed by future client patches (Patch B/C), blocks nothing
  shipped today.
