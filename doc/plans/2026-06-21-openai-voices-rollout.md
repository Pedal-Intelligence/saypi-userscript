# OpenAI TTS voices — activation & rollout plan

> Coordinates with **saypi-api #215** (client-side contract dependency for #92,
> "Add OpenAI TTS provider"). This doc is the userscript-side record of the agreed
> sequencing and the deferred UI work. Founder-gated; not an autonomous task.

**Status as of 2026-06-21:** client regression fix is **merged to `main`**
(PR #284, commit `6abcd5d`), dormant. API kill-switch `OPENAI_TTS_ENABLED` is
**forced `false`** in production (Heroku `saypi-api` v256), so `/voices` returns
only the 3 ElevenLabs voices today. Nothing is live to users yet. saypi-api #215
stays **open** until the build ships and the switch flips.

## Decision (founder, 2026-06-21)

Ship the regression fix in the next client release. Then turn OpenAI voices on in
production, observe the real UX, and roll any UI polish into the **following patch
release**. We accept a cosmetically-imperfect first impression in exchange for
faster activation and real production visuals to design against. The only hard
requirement before activation is "no crash," and that is already satisfied.

## What's already done (the only must-ship piece)

The blocking bug: `src/tts/SpeechModel.ts` → `retrieveProviderByEngine` mapped a
voice to an audio provider by its `powered_by` string and **threw** on anything it
didn't recognise. When the API served `powered_by="OpenAI"`, selecting such a voice
hit an uncaught throw in the synchronous `setVoice` / `notifyAudioVoiceSelection`
paths — crashing voice selection on the released extension.

Fixed (PR #284):
- `case "OpenAI": return audioProviders.SayPi;` — OpenAI voices stream from
  `api.saypi.ai` via the same `?voice_id=` contract as ElevenLabs, so they're
  SayPi-served client-side.
- `default:` now **warns and falls back to SayPi** instead of throwing, so a future
  API-added provider can't crash an old build the same way.
- Unit tests: `test/tts/AudioProviders.spec.ts` pins the OpenAI mapping and the
  no-longer-throwing default.

The change is additive and **dormant** — the new case is never exercised until the
API actually serves OpenAI voices. Safe to release ahead of the API flip.

Contract (confirmed against live API in #215): exact string is `powered_by="OpenAI"`
(case-sensitive). There is **no** `tier`/`value_tier` field and none is planned;
value tier is derived from `powered_by` + `price_per_thousand_chars_in_credits`
(OpenAI = 50 cr/1k vs ElevenLabs ~1000 cr/1k). OpenAI voices carry an extra `model`
field, ignored by the client's structural typing.

## Rollout sequence (strict order — API flip MUST be last)

1. [x] Client provider mapping merged to `main` (PR #284).
2. [ ] **Release the client build to the stores** (Chrome / Edge / Firefox) — uses
       the `release-extension` skill. This is the current gate.
3. [ ] **Confirm rollout** has propagated to users' browsers (store review + update).
4. [ ] **Flip `OPENAI_TTS_ENABLED=true`** on saypi-api (currently forced `false`).
       OpenAI voices now appear in `/voices`. Observe live UX.
5. [ ] Close saypi-api #215.
6. [ ] **Following patch release** — UI polish (see below), informed by the live look.

Why the order matters in exactly one direction: if the API flips before the fixed
build is live, users still on the old build crash on OpenAI voice selection. The
reverse is harmless — the new client code stays dormant while the switch is off.

## What the live UX will look like (so we know what we're observing)

10 OpenAI voices, server-defined (`alloy, ash, ballad, coral, echo, fable, nova,
onyx, sage, shimmer`). They appear in the **existing** voice menus, not a separate
section. Per host:

- **Claude / ChatGPT** (`src/chatbots/ClaudeVoiceMenu.ts`): each voice is a row with
  name + optional chips (accent flag, gender icon, **price**) + description. The
  price chip appears only when prices vary across the set (`showPrice = prices.size
  > 1`) — which becomes true once OpenAI (50 cr/1k) and ElevenLabs coexist, so OpenAI
  rows show `50/1k cr` and read as the cheaper "value" option. **No provider
  logo/badge in the menu rows.**
- **Pi.ai** (`src/tts/VoiceMenu.ts`): simpler. Voices split into "default" vs
  "custom" by the server `voice.default` flag (NOT by provider); custom voices get a
  generic SayPi flair logo. **No OpenAI-vs-ElevenLabs distinction, no price chip.**
  Most likely to look off — watch this menu first.
- **Message playback controls** (`src/tts/TTSControlsModule.ts` `createTtsLogo`) DO
  draw the per-provider logo from `icons/logos/<engine>.svg`; `openai.svg` exists, so
  the OpenAI mark shows under a spoken message — just not in the picker.

## Deferred UI work (follow-up patch — confirm against live look first)

- Provider badge/logo in the menu rows (the `openai.svg` asset already exists).
- Explicit value-tier styling/labelling rather than relying on the price chip alone.
- Pi.ai menu grouping/badging for OpenAI voices (the `default`/`custom` split is the
  weak spot there).

## Test coverage gap (known, accepted for now)

Covered: the provider-mapping crash fix (unit). NOT covered: any menu render with an
OpenAI voice — every fixture (`test/data/Voices.ts`) is ElevenLabs-only; no `/voices`
fixture contains OpenAI entries. The "won't crash" claim is well-tested; the "looks
and plays correctly" claim is not. If we want to close this before step 4, add an
OpenAI `/voices` fixture + a Claude-menu render test (price chip appears, selection
routes to SayPi provider). Founder opted to observe in production instead.
