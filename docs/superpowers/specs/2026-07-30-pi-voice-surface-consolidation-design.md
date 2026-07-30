# Absorbing Pi's voice-surface consolidation

**Date:** 2026-07-30
**Status:** approved
**Host DOM verified live:** pi.ai/talk and pi.ai/profile/settings, 2026-07-30, via Claude-in-Chrome against the founder's logged-in session.

## What Pi changed

Pi collapsed two voice surfaces into one. The in-chat voice menu — a pill that
expanded into a card listing Pi's eight voices — is gone. In its place sits a
kebab (`⋯`) at the top-right of the chat column whose popover offers exactly one
control: an auto-read on/off toggle. Voice *selection* now lives only on
`pi.ai/profile/settings` → Voice settings.

Where a user could previously change voice from either location, there is now
one location, and the in-chat surface has been demoted to a mute switch.

### The live DOM

`.saypi-audio-controls` — SayPi's decoration of `audio + div` — still resolves,
but everything inside it changed:

```
div.order-2.w-auto.saypi-audio-controls          (40×40, top-right of the chat column)
  button[aria-label="Chat options"]              ← the kebab
  div#saypi-voice-menu                           ← SayPi's own div, permanently EMPTY
  div[role=menu][aria-label="Chat options"]      ← mounted on open, torn down on close
    div[role=menuitemcheckbox][data-testid="chat-options-auto-read"][aria-checked=true]
      "Turn off auto-read"
```

Observed behaviour of the auto-read item:

- `aria-checked` is `"true"` when auto-read is **on**, `"false"` when off.
- The label reads `"Turn off auto-read"` when on and `"Auto-read"` when off, so
  it describes the *action* in one state and the *setting* in the other. Not a
  usable state signal; `aria-checked` is.
- Clicking it **leaves the popover open**. Closing requires a second click on
  the kebab.
- Pi mirrors the state to `localStorage.isVoiceEnabled` (`"true"` / `"false"`),
  which flips in lockstep with the toggle.

### What broke in SayPi

| Selector | Matches | Consequence |
|---|---|---|
| `Pi.getAudioOutputButtonSelector()` — `.saypi-audio-controls > div > div.relative.flex.justify-end.self-end > div > button` | 0 | **Functional regression.** `#saypi-audio-output-button` is never assigned, so `AudioControlsModule.activateAudioOutput()` and `isAudioOutputEnabled()` silently no-op. Starting a call no longer switches Pi's TTS on. |
| `button[aria-label="Toggle voice menu"]` | 0 | `PiVoiceMenu.observeForMoreVoicesDoor()` / `findLiveVoiceList()` can never fire. The in-chat "More voices" door is dead code. |
| `Pi.getVoiceMenuSelector()` — `div.t-action-m` | 0 (already stale) | `VoiceMenuUIManager` falls through to its *create* branch and injects an empty `<div id="saypi-voice-menu">` into Pi's header, permanently. |

`PiVoiceSettings` on `pi.ai/profile/settings` is **unaffected** — verified live:
eight native `<button>` cards plus SayPi's "More voices…" door, grid selector
still matching 1. It needs no repair, but it now carries the whole burden of
voice choice on Pi.

## Design

### 1. Pi's TTS toggle becomes a capability, not an element

`Chatbot.getAudioOutputButtonSelector(): string` encodes three assumptions:
the control is always in the DOM, a click toggles it, and an SVG `path[d]`
encodes its state. Pi now breaks all three. Claude and ChatGPT still satisfy all
three.

Rather than bend the selector contract to cover a host it no longer describes,
add an optional structural capability — the pattern `BuiltInVoiceProvider`
already establishes in `src/tts/VoiceMenu.ts`:

```ts
// src/chatbots/AudioOutputToggle.ts  (new module, keeps the Chatbot↔Pi graph acyclic)
export interface AudioOutputToggle {
  isAudioOutputEnabled(): boolean;
  setAudioOutputEnabled(enabled: boolean): Promise<void>;
}
export function isAudioOutputToggle(c: Chatbot): c is Chatbot & AudioOutputToggle;
```

`PiAIChatbot` implements it:

- **`isAudioOutputEnabled()`** — read `aria-checked` off
  `[data-testid="chat-options-auto-read"]` if the popover happens to be open;
  otherwise fall back to `localStorage.isVoiceEnabled === "true"`. Neither path
  has a UI side effect.
- **`setAudioOutputEnabled(on)`** — return early when the state already matches.
  Otherwise: click the kebab, poll (≤1s) for the menu item, **re-read
  `aria-checked` from the live element as the authority**, click only if it
  disagrees with the target, and close the kebab in a `finally`.

The read-before-write is the load-bearing part of this design. It is what makes
the `localStorage` fallback safe to be wrong: a stale mirror costs at most one
unnecessary popover open, and can never flip auto-read the wrong way.
`localStorage.isVoiceEnabled` is a private Pi implementation detail — treating it
as an optimisation rather than as truth is what keeps that acceptable.

`AudioControlsModule` prefers the capability when the live chatbot
(`ChatbotService.getChatbotSync()`) exposes it, and otherwise keeps today's
`#saypi-audio-output-button` click path verbatim — Claude and ChatGPT are
untouched. `activateAudioOutput()` keeps its `void` return (both callers are
fire-and-forget: an XState action in `ConversationMachine` and
`SubmitErrorHandler`), kicking the promise off with a logged `.catch`. The
existing Pi-only `audio:skipNext` emit stays: Pi still auto-plays the last
message when auto-read comes on.

### 2. Retire the in-chat voice menu

Make the in-chat menu an optional capability rather than something every host
must fake. `getVoiceMenuSelector` and `getVoiceMenu` become optional on
`Chatbot`; `VoiceMenuUIManager.findAndDecorateVoiceMenu` returns `notFound` when
either is absent, instead of falling through to its create branch. Pi drops
both, so **nothing is injected into Pi's header** and the permanently-empty
`<div id="saypi-voice-menu">` stops existing.

Making the members optional also lets `Web.ts` drop its two throwing stubs,
which existed only because the members were mandatory.

Consequent deletions:

- The `PiVoiceMenu` class: `restyleVoiceMenuControls`, `observeForMoreVoicesDoor`,
  `findLiveVoiceList`, and its `getCustomVoiceCap` override.
- `buildMoreVoicesDoor`'s `"div"` branch (`role="button"`, `tabIndex`, keydown
  handler). Only `PiVoiceSettings` survives and its cards are `<button>`s, so the
  helper collapses to button-only.
- `#saypi-voice-menu-controls.saypi-provided-voice` in `src/styles/voices.scss` —
  reachable only from the deleted `restyleVoiceMenuControls`. The
  `#saypi-voice-menu` rules stay; `claude.scss` uses them.
- `src/chatbots/PiVoiceMenu.ts` is renamed to `PiVoiceSettings.ts`, since
  `PiVoiceSettings` is the only class left in it.

Voice choice on Pi still reaches users through two surfaces SayPi already owns
and that are verified working: the "Voice settings" button SayPi injects into
Pi's sidebar, and the "More voices…" door on Pi's own Voice settings page.

### 3. Keep the sweep honest

`DIAGS.pi` in `scripts/e2e-host-sweep-lib.mjs` counts `#saypi-voice-menu`, which
after this change correctly reads 0 — precisely the false-drift trap #560/#563
were about. Re-point it at what the adapter now depends on: the presence of
`button[aria-label="Chat options"]`, and whether the auto-read item is reachable.

## Testing

Layer 1–2 (the required merge gate), fail-first per the repo's TDD protocol:

- **`test/chatbots/Pi-AudioOutputToggle.spec.ts`** (new), against a fixture built
  from the real popover markup: off→on opens the kebab and clicks; on→on is a
  no-op with no popover open; a popover that never mounts degrades without
  throwing; the kebab ends closed on every path including the failure path; a
  stale `localStorage` mirror that disagrees with the live `aria-checked` does
  not produce a wrong toggle.
- **`test/audio/AudioControlsModule.spec.ts`** — extend: dispatch prefers the
  capability when present, falls back to `#saypi-audio-output-button` when not.
- **`test/chatbots/Pi-AudioControlsSelector.spec.ts`** — rewrite. Its premise
  (that Pi exposes a decoratable audio-output button) is obsolete.
- **`test/chatbots/PiVoiceMenu-curation.spec.ts`** and
  **`PiVoiceMenu-more-voices-door.spec.ts`** — delete with the surface.
- **`test/chatbots/VoiceMenu-preference-sync.spec.ts`** — the
  `PiVoiceMenu reacts to settings-page voice changes (#475)` block tests
  *GridVoiceSelector* preference sync, not anything Pi-specific. Move it onto a
  `GridVoiceSelector` test double so the invariant survives the surface's removal
  rather than being deleted alongside it.

Layer 4 (CDP, live pi.ai) to close the loop, since the whole change rests on
host DOM that only the real host can confirm: prove the toggle actually drives
Pi's auto-read state, and that SayPi injects nothing into Pi's header.

## Flagged, deliberately not fixed here

- **`PI_MENU_CAP` and `GridVoiceSelector`'s capping machinery lose their only
  production consumer** when Pi's `getCustomVoiceCap` override goes.
  `PiVoiceMenu` was the sole production override; the base returns `null`
  (uncapped) and Pi's settings grid stays uncapped. The capability remains live
  and independently tested in `VoiceCuration.spec.ts` and
  `GridVoiceSelector.spec.ts`, and Pi's settings grid could plausibly want it
  back. Removing it is a wider refactor than this change earns — filed as a
  follow-up issue instead.
- **`SubmitErrorHandler.initAudioOutputListener`** stops tracking auto-read on
  Pi. It already does today (the button is already never decorated), and the
  handler has been disabled since v1.6.0. Pre-existing, not introduced here.
