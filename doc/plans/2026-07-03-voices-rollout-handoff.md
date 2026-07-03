# Voices rollout + remaining build — handoff route map

> **Audience:** the agent picking up the voices workstream from here.
> This is the *route map*, not the spec. The spec is
> [2026-07-02-voice-selection-ux.md](2026-07-02-voice-selection-ux.md) (the design —
> all §-references below point into it) and
> [2026-06-21-openai-voices-rollout.md](2026-06-21-openai-voices-rollout.md) (the
> flip sequencing). Read both before building. What this doc adds: where the work
> stands as of 2026-07-03, the rollout order the founder agreed to, and the
> guardrails you should not re-derive or quietly re-open. Within those rails, find
> your own path — the plan deliberately leaves implementation latitude.

## Where things stand (2026-07-03)

- **Patch A (design §10 step 2) is built and merged to `main`** — PR #470 plus the
  tasting-round fixes #476–#480. That's the capped in-host menus,
  pin-current-voice-first, the [HD] chip, the "More voices…" door, and a dedicated
  **Voices** settings tab (its own top-level tab, *not* inside AI Chat — that
  changed post-design). Don't rebuild any of it. Key places: `src/tts/VoiceCuration.ts`
  (curation/caps), `src/chatbots/ClaudeVoiceMenu.ts`, `src/tts/VoiceMenu.ts` (Pi),
  `entrypoints/settings/tabs/voices/`.
- **Patch A is not yet released to the stores.** The live store builds are all
  ≥v1.11.0 (Edge's review backlog cleared 2026-07-03), which means every
  distributed build contains the provider-mapping crash fix (PR #284). The flip's
  only hard precondition — "no distributed build can crash" — is satisfied.
- **`OPENAI_TTS_ENABLED` is still `false`** on saypi-api. The founder decided
  (2026-07-03) to flip **without waiting** for the Patch A store release, accepting
  the interim cosmetics on live builds.
- **16 new i18n keys are English-only**, pending a founder-run `npm run translate`
  (needs the founder's `OPENAI_API_KEY` env). This gates the Patch A *release*, not
  any development.

## The rollout order (agreed with the founder, 2026-07-03)

1. **Flip `OPENAI_TTS_ENABLED=true` on its own — no other API change in the same
   deploy.** Silent flip; save any "new voices" announcement for after Patch A
   ships. Expected look on the live (pre-Patch-A) builds, so nobody mistakes it for
   breakage: Claude's menu grows to ~20 rows, ChatGPT's to ~13, price chips appear
   on *every* row for the first time (the `showPrice = prices.size > 1` gate
   trips), and Pi's menu lumps the new voices under its generic "custom" flair.
   All accepted. Close saypi-api #215 once live.
2. **Adopt the grandfathering rule immediately.** The kill-switch is a cheap
   rollback only in the first few days, before users commit to OpenAI voices.
   After that, "rollback" must mean *hide from the catalog while continuing to
   serve TTS for already-selected voice IDs* — never a hard retraction that
   silently kills someone's working voice. Same rule forward: treat `/voices` as
   **append-only** (retire via a `deprecated` flag + successor, never by deleting
   an ID) until Patch B's visible-notice deprecation handling exists.
3. **Ship the Patch A store release soon after.** It's the disruption-absorber:
   caps the long menus, and the pin-first invariant means interim adopters of
   non-featured voices see no regression. Only prerequisite is the translate run
   (founder). Release itself is founder-gated — see `doc/release/README.md`.
4. **Land the saypi-api workstream independently** (below) — additive, no user
   impact until a client consumes it.
5. **Change no defaults in this phase.** The flip adds choices; it must not change
   what anyone hears without their asking.

Watch list during the post-flip window: preview quota burn (the `introduceVoice()`
metered-preview defect, amplified by novelty — see below), OpenAI time-to-first-audio
vs ElevenLabs on real turns, the Pi menu's look, and any TTS error spike from
stragglers on old builds (there shouldn't be one).

## The remaining build, phase by phase

Intent over prescription here — each phase says what it's for and what's
load-bearing; the how is yours.

### API workstream (saypi-api repo — *not* this one)

The `sample_url` preview-clip pipeline (design §4; the load-bearing unbuilt
piece), the curation manifest fields (§5: `featured` / `section` / `recommended` /
`language` / `sibling_id` / `deprecated`), and measured per-voice chars-per-minute
rates. Contract discipline is the whole game: every field **additive and
optional**, and the client renders each affordance *only when its field is
present* — that's what lets client and server ship in either order with zero
coordination. Preserve that property. Never change existing field semantics:
`powered_by` is a case-sensitive load-bearing string, and the price field drives
the chip gate.

### Client preview playback (this repo; can precede or follow the asset pipeline)

Render a play affordance when `sample_url` exists. Two constraints that are
design decisions, not details: play and select are *separate* targets (§3 —
tap-to-preview-then-tap-again-to-select breaks the universal dropdown
expectation), and playback must route through the audio-output state machine so a
preview never talks over live TTS or an active call. That's XState v5 territory —
read `src/state-machines/README.md` before touching it. When canned clips exist,
**retire** `introduceVoice()`'s metered live-TTS path (`src/tts/VoiceMenu.ts`
~:278/:311); don't extend it.

### Patch B — defaults + rails (§6, §10 step 4)

Cohort `recommended` adoption at first TTS activation, the first-listen notice,
the commitment toast with undo, the ~85%-quota Downshift, minutes-of-speech
denominations. **Hard gates, in order:** the founder's §7.1 default-voice decision,
and switch-away telemetry existing *first* (it mostly doesn't today — and new
telemetry in an extension needs deliberate minimal scoping for store review and
privacy policy, §11). Until per-voice chars-per-minute is actually measured, print
no absolute minute numbers — relative framing only ("lasts ~20x longer"). Wrong
absolutes at the moment of trust are worse than none.

### Patch C — language shelf (§10 step 5)

Gated entirely on the founder's §7.2 decision about 60dB. The shelf *mechanism*
(locale/STT-signal-gated, provider-agnostic) can be built if it earns its keep,
but do not onboard a provider — that's an operational commitment, not a menu row.

## Signposts around the hardest parts

**Founder-only decisions — do not decide these, and do not build past them
(§7):** (1) the free-tier default voice identity, (2) whether to onboard 60dB at
all, (3) whether to re-skin OpenAI voice names. If one blocks you, stop and ask;
do not pick a "reasonable default" — §7.1 in particular is near-irreversible
(d=0.68 default stickiness).

**Invariants that must survive every change:** the user's current voice pins
first and keeps working forever (grandfathering); never a silent voice swap, for
any reason; every voice stays selectable on every plan (meter, never gate).

**Already rejected — don't reintroduce (§9):** raw credit chips or multipliers in
pickers, provider names/logos in pickers (the per-message logo in
`TTSControlsModule` stays), a budget-policy radio, per-voice purchases, voices
that silently vanish. Parked (don't build unprompted): Voice Match, the spotlight
slot, settings pins.

**The tiebreak when you're unsure (§2):** *the catalog scales; the menu never
does.* Choice happens by ear; tier vocabulary is one word ("HD"); budgets are
minutes, never credits. If a change makes the in-host menu longer, louder, or
more configurable, it's probably wrong.

**Repo process that will bite you if skipped:** every change in its own worktree
under `.worktrees/` (AGENTS.md hard guardrail — this repo has concurrent agents);
fail-first TDD for bug fixes; check `doc/codebase-caution-map.md` before touching
host-DOM, cross-context, i18n-key, or billed/hashed-text zones; every new
user-facing string gets an i18n key (ship English, tell the founder translate is
pending). Menu/curation logic proves at the unit layer (Jest/Vitest, `npm test`);
the real-host look-check goes through Layer 4 CDP (`npm run layer4cdp:verify` —
headed real Chrome; headless is Cloudflare-blocked). Releases, store submissions,
and anything reading `.env.production` are founder-only.

**Cross-repo split:** manifest, clips, measured rates, and server-side
grandfathering live in **saypi-api**. This repo only ever consumes the fields
defensively (absent field ⇒ affordance hidden).
