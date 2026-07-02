# Voice selection at scale — design for growing 3 → 20+ voices without cluttering the UI

> Companion to [2026-06-21-openai-voices-rollout.md](2026-06-21-openai-voices-rollout.md)
> (this doc **is** the "following patch release UI polish" that plan reserved, designed
> ahead of the live look rather than after it). Coordinates with saypi-api #92/#215
> (OpenAI TTS, merged server-side as saypi-api PR #162) and userscript PR #305
> (contributor request: 60dB TTS, notably strong Hindi voices).
>
> Provenance: synthesized 2026-07-01 from a 16-agent research/design exercise —
> 8 research sweeps (ChatGPT, ElevenLabs, reading apps, companions, OS pickers,
> choice-architecture science, tier-pricing UX, novel personalization), 4 independent
> design proposals, 3 judge lenses, 1 completeness critic — cross-checked against
> this codebase. Founder-gated: the open decisions in §7 block parts of the rollout.

## 1. The problem

Today SayPi serves 3 curated ElevenLabs voices (~1000 credits/1k chars). Dormant
behind the API kill-switch sit 10 OpenAI voices at 50 credits/1k — 20x cheaper — and
a contributor wants a third provider (60dB) with cheap Hindi voices. The catalog is
about to grow 4–7x across a 20x price range and multiple languages.

The founding constraints, verbatim from the founder:

- Voices are **manually curated and intentionally few** — no ElevenLabs-style
  bewildering library.
- **Don't shift decision burden onto customers** by abdicating choices we could
  have made well on their behalf — but individual taste and budget deserve real
  choice.
- **Seamless native integration** is a core principle: the voice menus live inside
  the host's page and borrow its look. A voice interface should feel natural, not
  configurable.

The question: how do we maximise user choice while minimising user confusion?

## 2. The answer in one line

**The catalog scales; the menu never does.** Keep the in-host menu permanently
capped at ~5–6 curated rows plus one "More voices…" door; put the full catalog one
click deeper on SayPi-owned surfaces; make choice happen *by ear* (free canned
previews); describe tiers with one word ("HD") and budgets in minutes of speech,
never provider names or credit arithmetic; and let a server-side manifest carry the
founder's curation so the menu can be retuned without a client release.

This is not a compromise position — it's the pattern every surveyed product
converged on (§8). OpenAI auditioned 400+ actors and ships **nine** voices.
ElevenLabs never shows its own 10,000-voice library at the moment of use. The
science agrees: defaults are one of the largest reliable effects in behavioral
science (d=0.68, ~95% of users never change them), and choice overload bites
exactly when options are hard to compare and preferences are unformed — a voice
picker ticks every risk moderator.

## 3. The three-layer surface architecture

Depth increases with distance from the conversation. The host page never gets
heavier than today; it gets lighter.

### Layer 1 — in-host menus (the shortlist)

**claude.ai** (`src/chatbots/ClaudeVoiceMenu.ts`, existing dropdown, same row
anatomy — name, description, accent flag, gender icon):

1. The user's **current voice pinned first** with a checkmark — always, even if it
   is no longer in the featured set. This is the returning-user invariant; it kills
   the most predictable support ticket ("where did my voice go?").
2. Two flagship ElevenLabs rows, each carrying a small **[HD]** chip — the only
   tier mark, rendered via the existing `showPrice = prices.size > 1` gate
   (`ClaudeVoiceMenu.ts:702`), i.e. only when tiers actually coexist.
3. Two-to-three curated OpenAI rows, chip-less. Descriptions shrink to 2–3-word
   vibe descriptors ("bright and friendly") — the ChatGPT vocabulary, served in the
   voice's `description` field.
4. One muted footer line, shown only when tiers coexist: *"HD voices use your
   allowance about 20x faster."* This is the entire in-menu economics story.
5. Final muted row: **"More voices… ›"** → opens extension settings → AI Chat tab.
   `openSettings()` is already imported and wired in this file
   (`ClaudeVoiceMenu.ts:10`, `:565`), so the door is nearly free.

The raw credit chip (`50/1k cr` via `formatPrice`, `ClaudeVoiceMenu.ts:344`) is
**retired from the picker**. Raw credits and per-option multipliers are the
documented confusion pattern (Cursor's 2025 credit-pool backlash and public
apology); credits remain the dashboard ledger's unit only.

**pi.ai** (`src/tts/VoiceMenu.ts` / `PiVoiceMenu`): Pi's native 8 buttons untouched.
Below the existing divider, max 4–5 SayPi rows keeping the current flair mark, a
quiet `HD` suffix on ElevenLabs rows as the only added metadata, and one "More
voices →" row styled like Pi's own settings links. No price chips, no headers with
taglines — Pi is the host that most prizes minimalism, and its anonymous "Pi 1–8"
ontology must not be muddied.

**chatgpt.com**: explicit non-goal. ChatGPT uses native read-aloud; there is no
SayPi picker to grow. The server default and settings surface carry that host alone
until/unless SayPi TTS ships there.

Every row gets a **play affordance** (see §4). Interaction rule: play and select
are *separate* targets. A "first tap previews, second tap selects" scheme violates
the universal dropdown expectation that click = select; first-time users would
click, hear a clip, see nothing change, and conclude the menu is broken.

### Layer 2 — extension settings, AI Chat tab (the shelf)

The "More voices…" destination. Today the AI Chat panel
(`entrypoints/settings/tabs/chat/ChatPanel.tsx`) has zero voice UI; it gains a
"Voices" section:

- **"Your voice" card**: current voice, descriptor, play button, and its stable
  outcome line ("Nova · ≈1 hour of speech each month on Free").
- **The full host catalog** as 2–3 labeled shelves — never a flat list (mere
  categorization measurably improves satisfaction even with barely-informative
  labels): **HD** (3 ElevenLabs; header: "richest sound — uses your allowance ~20x
  faster"), **Everyday** (all 10 OpenAI, including the ones not featured in-host;
  header: "great quality — lasts ~20x longer"), and a collapsed **Languages** shelf
  (60dB Hindi et al. — always present here regardless of locale, so deliberate
  seekers can always find it).
- Each row: ▶ free preview, name, descriptor, flag/gender chips, plan-aware static
  rate ("≈60 min/mo on Free" vs "≈3 min/mo on Free"), and "Use this voice".
- Deferred until demand shows: a "Show in chat menu" pin (the ElevenLabs My-Voices
  mechanic at 1/500th scale). Ship the door first; add pins only if "More voices…"
  click-through demonstrates appetite.

### Layer 3 — saypi.ai dashboard (the library + budget view)

- The usage meter **re-denominated in minutes** with an exchange-rate view:
  "Voice time left this month: ≈41 min in Nova · ≈2 min in Paola (HD)".
- The full cross-host catalog with full-length samples for unhurried browsing.
- Deprecation/migration notices (§5) and any voice-of-the-month archive.
- Live "remaining" countdowns live **only** here — never in the picker (Apple
  removed the macOS battery time-remaining estimate for good reason; pickers get
  stable rates, Netflix-GB/hr style).

## 4. Choice by ear — the canned-preview pipeline

A voice is an experience good: no name, flag, or descriptor substitutes for two
seconds of audio. Every surveyed product that does voice choice well (ChatGPT,
Siri, Google Assistant, ElevenLabs, Speechify) previews instantly and free.

**Mechanic**: `/voices` gains a `sample_url` per voice — a ~2s pre-rendered,
volume-normalized, CDN-static clip ("Hi, I'm Nova."), recorded per-language for
language-shelf voices. The client renders the play affordance **only when
`sample_url` is present**, so the client patch ships ahead of the API asset
pipeline with zero coordination.

**This also fixes an existing defect**: today `introduceVoice()`
(`src/tts/VoiceMenu.ts:278`) previews SayPi voices by synthesizing through the
metered live-TTS path (`createCompletedSpeechStream`, `:311`) — auditioning voices
burns the user's own quota. Free previews must feel free or nobody explores; on the
free tier one browse of a 13-voice menu could otherwise consume a meaningful slice
of the month.

**Wiring constraint**: sample playback must route through the existing
audio-output state machine so a preview never double-talks over live TTS or an
active call. This is XState v5 work, not a detail — read
`src/state-machines/README.md` first. Tap-to-play only; no hover-autoplay (browser
autoplay policy + surprise audio + touch devices).

**Asset discipline**: clips are versioned with the catalog; provider model drift
can make a stale sample mismatch the live voice, which is worse than no sample.

## 5. Curation-as-API — the menu manifest

Promote `GET /voices` from a flat list to a **menu manifest**. Additive fields, all
optional (old clients ignore them via the structural typing that already tolerates
OpenAI's extra `model` field):

| Field | On | Meaning |
|---|---|---|
| `featured` | voice | In the in-host shortlist for this app |
| `section` | voice | Shelf label key (hd / everyday / language) |
| `recommended` | voice | The default for this (host, locale, plan) cohort — server-computed per request, exactly one |
| `sample_url` | voice | Free canned preview clip (§4) |
| `language` | voice | BCP-47 tag driving the gated shelf (§6) |
| `sibling_id` | voice | Founder-curated "everyday sibling" of an HD voice — the Downshift target **and** the deprecation successor |
| `deprecated` | voice | Retirement flag; client remaps only with a visible notice |

This turns the founder's editorial judgment into a runtime object: re-shelve,
re-default, feature a dormant voice for a month, or retire a flop — all
server-side, no store release, and every user's menu stays capped by construction.
It is "curation, not abdication" expressed as the system's data model.

Two client-side invariants the manifest can never override:

1. A user's stored selection always keeps rendering and working, even after
   delisting (grandfathering — scope server-side as "renders for prior selectors
   only", which is far cheaper than per-user price terms).
2. A deprecation remap always shows a one-line notice; **never a silent voice
   swap**. Voice attachment is identity-level (OpenAI learned this reversing the
   Standard Voice retirement under user revolt; Waze's silent mid-drive fallback is
   the same lesson).

**Crucially, the first UI patch needs none of this**: tier is derivable
client-side from `powered_by` + price (confirmed in the rollout plan doc), and the
door uses the already-wired `openSettings()`. The manifest moves the heuristics
server-side *after* value ships.

## 6. Defaults, budget rails, and language

### The default is the product

~95% of users will only ever hear the `recommended` voice. The client adopts it
once, at first TTS activation, persists the selection (existing per-chatbot
`voicePreferences` map in `PreferenceModule`), and never re-adopts on later catalog
changes. The one choice moment is a single dismissible line via the existing Preact
notice surface, after the first spoken reply: *"You're hearing Nova — Say Pi's pick
for you. Hear other voices →"*. No modal, no forced carousel. Existing users are
grandfathered unconditionally to their current selection.

Which voice the free-tier `recommended` points at is **the open founder decision**
(§7.1) — the lever is server-side precisely so the menu work isn't blocked on it.

### The burn-the-month rails

The failure mode to engineer away: a free user (3,000 chars/month) picks an HD
voice without understanding, and one long reply consumes their month.

1. **At choice**: the [HD] chip + the single footer sentence (§3.1).
2. **At commitment**: a free user selecting an HD voice gets the voice instantly
   (no gate, no modal) plus a one-time toast with undo: *"Paola sounds richest —
   your free time runs ~20x faster (≈3 min this month). Keep her · Back to Nova."*
3. **At exhaustion**: the **Downshift**. At ~85% of quota with projected shortfall,
   one notice per cycle: *"You've used most of this month's voice time. Paola:
   ≈40s left · Ash, her everyday sibling: ≈13 min. [Switch to Ash] [Keep Paola]
   [Get more time]"* — with *"Return to Paola when your time renews"* pre-checked.
   The sibling is explicitly a stand-in; the user's chosen voice remains their
   voice. Metering, never gating: every voice stays selectable on every plan
   (ChatGPT tiers by minutes, never by voice list).

Minutes math: "1,000 chars ≈ 1 minute" varies by voice and speaking rate — the
research proposals' own constants disagreed. **Measure chars-per-minute per voice
before printing any absolute number**; rates are static per plan (recomputed only
on plan change), rounded conservatively, always "≈". When plan is unknown (logged
out), fall back to the relative framing ("lasts ~20x longer") — wrong absolute
numbers mislead at the exact moment of trust.

### Language is a shelf, not a tier

Voices carry a `language` tag; the Hindi shelf renders **in-host only when a
relevance signal fires**: browser locale `hi-*`, the user's saved STT/dictation
language (a signal SayPi uniquely already has), or explicit opt-in in settings.
Hindi-locale users get a Hindi `recommended` default and a launch notice written in
Hindi; English-locale users see nothing in-host (the settings Languages shelf and a
"Show all languages" hatch cover diaspora users). The mechanism is generic — a
future Spanish or Tamil provider slots in with zero menu redesign.

### New voices are events, not list growth

The OpenAI flip ships with one one-time notice — *"New voices — your free allowance
goes up to 20x further"* — plus an expiring "New" badge; the menu does not get 4x
longer. Same playbook for any future provider, targeted to the users it's relevant
to (the ChatGPT Advanced-Voice/Santa pattern). A server-optional expiring
"spotlight" slot can later cycle non-featured catalog voices through the menu one
at a time; keep it server-optional, not a public monthly commitment — a stale
spotlight is worse than none.

## 7. Open founder decisions (block parts of the sequence)

1. **The free-tier default voice — the strongest tension in the design.**
   Everyday-voice default maximises speech time (3,000 chars ≈ an hour vs ≈3 min)
   and cuts SayPi's serving COGS ~20x — but with d=0.68 default stickiness it makes
   a commodity voice ("the ChatGPT voice") the sonic identity of SayPi for nearly
   every new user, on a product differentiated by premium curation. Options:
   best-voice-first, most-voice-first, or a hybrid nobody proposed (HD for the
   first N replies, then a transparent step-down). Prerequisites either way: the
   founder ear-picks the single default voice, and **switch-away telemetry exists
   before the default flips** (it mostly doesn't today), or a brand-eroding pick
   goes undetected.
2. **Whether to onboard 60dB at all.** PR #305 is a client routing shim + a spec
   asking us to build the backend. Missing: vendor due diligence (latency, SLA,
   licensing), full-loop Hindi quality (STT accuracy, host-LLM Hindi), and any
   telemetry on Hindi-locale user counts. A third provider is an operational
   commitment, not a menu row; the Alexa lesson is "never list a voice that does
   less." The language-shelf architecture is worth building regardless — it's
   provider-agnostic.
3. **Whether to re-skin OpenAI voice names.** alloy/nova/shimmer are
   ChatGPT-recognizable, and this extension runs on chatgpt.com. Renaming (as
   Paola/Joey already do for ElevenLabs) makes the curation feel like SayPi's and
   enables invisible provider swaps later (Matter swapped its whole TTS vendor and
   users only saw "better voices are here") — but needs an OpenAI ToS check and
   complicates grandfathering.

## 8. What the industry does (evidence base, condensed)

- **ChatGPT**: 400+ auditions → 9 voices; two-word vibe descriptors; instant
  tap-preview; ask-once at first voice use, then the picker hides in settings;
  tiers by minutes/quality, never by catalog; new voices as events (Advanced Voice
  launch, Santa mode). Reversed the Standard-Voice retirement under user grief.
- **ElevenLabs** (the library we don't want to be): moment-of-use picker shows only
  "My Voices"; the 10,000-voice library is a separate Explore destination fronted
  by staff-curated Handpicked Collections + locale-based recommendations; price is
  a filter facet; even they prune (Default voices retiring with named successors).
- **Reading apps** (Speechify/NaturalReader/Matter): one unified list, premium =
  a single glyph (diamond/HD), no per-voice price math; "Recommended" tab first,
  full catalog demoted a level; metered tastes of premium rather than hard locks;
  provider taxonomy invisible. Anti-pattern: Voice Dream re-gated purchased voices
  → community revolt → reversal.
- **Companions** (Sesame: 2 voices, no picker; Pi: 8 anonymous variants of one
  persona; Character.ai: creator picks, user may veto): voice = persona/brand;
  small rosters with strong identity beat catalogs.
- **OS pickers** (Siri: accent → 2–5 voices, tap = hear+select, active choice at
  iOS 14.5 setup; Google: non-ranking color names): two-level disclosure keyed on
  a dimension the user already knows their answer to.
- **Science**: choice overload is conditional but voice pickers hit every
  moderator (Chernev et al. 2015); defaults d=0.68 / ~95% acceptance (Jachimowicz
  et al. 2019); mere categorization improves satisfaction even with uninformative
  labels (Mogilner et al. 2008); "HD" is the one tier word that survives across
  vendors (Google's six coexisting tier names are the anti-pattern); price in
  stable outcome units (Netflix GB/hr), never raw credits (Cursor apology).
- **Anti-patterns**: Alexa's $4.99 celebrity voices (retired 2023, refunded — voices
  don't sell as SKUs); Waze's expiring promo voices + silent mid-task fallback;
  exposing technology generations or provider names to users.

Unverified claims flagged by the critic (directionally plausible, don't cite as
fact without checking): ElevenLabs' specific Default-voice expiry dates; Fish
Audio's "10% competitor engine" blind A/B; the precise dates/drama of ChatGPT's
voice-screen retirement and Standard-Voice reversal; celebrity rosters.

## 9. Novel ideas — adopt, park, reject

**Adopt** (novel; no surveyed product does these): the curation manifest (§5); the
temporary-by-default Downshift with founder-curated siblings (§6); minutes
re-denomination of the quota meter (§3, Layer 3).

**Park** (build later, off the host page, instrumented): **Voice Match** — a
30-second blind taste test (hear two voices say the same line, tap the preferred,
3 rounds, meet your match). Genuine white space: blind voice A/B ships only as
eval tooling (Vapi Humanness Index, Fish Audio routing), never as consumer
onboarding. Mechanically cheap (~8 canned clips of one shared sentence per locale).
But two of three judges flagged that advertising it in first-run shifts the
decision burden back onto users — dashboard/settings feature only, never in-host.
Also park: the spotlight slot (server-optional semantics only), settings pins
(await door click-through data).

**Reject**: per-voice purchases (Alexa), per-row credit chips or multipliers, a
"voice budget" policy radio (Best sound / Balanced / Most speech — a new abstract
knob, exactly the configuration burden the philosophy forbids), provider names or
logos in any picker (the per-message logo in `TTSControlsModule.createTtsLogo`
stays — attribution after the fact, not a choosing dimension), rotating voices
that silently vanish, and any silent voice swap for any reason.

## 10. Sequencing

Builds on the rollout plan's strict order (API flip still gated on Edge v1.11.0+
adoption — see the rollout doc).

1. **(In flight, decided)** Ship the release; flip `OPENAI_TTS_ENABLED`; observe
   the raw 13-voice menus. Add only the one-time "new voices" notice.
2. **Patch A — client-only, no API dependency**: cap + pin-current-first + "More
   voices…" door on Claude (via existing `openSettings()`); [HD] chip replacing
   the credit chip (tier derived locally from `powered_by` + price); footer
   sentence; Pi divider + cap. Settings AI Chat tab gains the shelved catalog
   (relative budget framing until minute-rates are measured). Flat-list renderer
   kept as fallback for host DOM drift; chips/headers reuse host-compiled classes
   or SayPi-owned SCSS (claude.ai compiles only its own Tailwind utilities — known
   repo gotcha).
3. **API workstream (saypi-api)**: `sample_url` asset pipeline (the load-bearing
   unbuilt piece — clips recorded, normalized, CDN-static, versioned); manifest
   fields (`featured`/`section`/`recommended`/`language`/`sibling_id`); measured
   per-voice chars-per-minute rates. Client renders previews/sections from the
   manifest as fields appear (each affordance hidden when its field is absent).
4. **Patch B — defaults + rails**: cohort `recommended` adoption at first TTS
   activation (gated on decision §7.1 + switch-away telemetry existing);
   first-listen notice; commitment toast; Downshift; minutes on settings rows and
   the dashboard meter.
5. **Patch C — language shelf**: gated Hindi shelf + Hindi-targeted launch notice,
   if and when §7.2 resolves to yes.

Every step is independently shippable and additive; no existing user's selected
voice ever changes.

## 11. Cross-cutting requirements the proposals missed

- **Accessibility** (absent from all four proposals; TTS products' most loyal
  constituency): injected menus need ARIA roles + keyboard navigation inside host
  DOMs; no hover-only affordances (touch + screen readers); previews must not
  collide with screen readers; and speech-**rate** control — the #1 TTS
  accessibility feature — is worth its own backlog item.
- **Telemetry vs. extension privacy**: switch-away/click-through instrumentation
  is assumed by every decision loop above and mostly doesn't exist; new tracking
  in a browser extension triggers store-review scrutiny and privacy-policy
  updates. Scope a minimal event counter deliberately.
- **Latency as a curation gate**: time-to-first-audio matters more than timbre in
  conversation; measure per provider and let curation (not users) absorb it.
- **Shortlist composition**: the curated 5–6 need deliberate gender/accent balance
  (the issue that forced Apple's iOS 14.5 Siri change); current example shortlists
  read US-English-default.
