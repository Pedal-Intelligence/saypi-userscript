# Keeping playback aligned with the selected voice

A voice selected in extension settings reaches an already-open host through
`chrome.storage.onChanged`. That path updates `PreferenceModule` and emits
`userPreferenceChanged`; the former process-local `audio:changeProvider` event
never reached the host. Reply synthesis already read fresh preferences, so Pi
could keep its native output while SayPi synthesized the newly selected voice.
Authentication changes exposed the same missing handoff (#617).

`AudioSelectionSync` belongs to the running `AudioModule`. It attaches before
reading the saved selection, then refreshes on voice-preference and auth events.
`SpeechSynthesisModule.getActiveAudioSelection` applies the same effective-provider
policy used by synthesis and returns the matching voice with it. Only the latest
asynchronous resolution can update the output actor, voice converter, and host
mute ownership. A failed resolution leaves the last known selection intact.

The resolver preserves saved preferences through sign-out and catalog outages.
Pi falls back to native playback while signed out; hosts without a usable native
fallback use no provider. An unresolved saved remote choice retains SayPi
ownership when authenticated, with no stale voice matcher. Playback reconciliation
does not write preferences or change authentication.

Chrome/Edge silence the host player because SayPi output runs offscreen.
Firefox/Safari share the page player, so they stop an incompatible current source
without muting that shared player. Returning to native also stops an old custom
stream offscreen. Canned voice samples remain allowed while a selection resolves. Reapplying an
unchanged selection preserves intentional replays of replies in an older voice.
Offscreen lifecycle forwarding is registered before awaiting the voice catalog,
so playback events cannot disappear during a slow startup lookup.

The fail-first regression net uses the real output actor and AudioModule's apply
and mute methods for startup, storage-shaped events, auth transitions, stale
reads, unavailable voices, failed reads, shared-page playback, preview continuity,
and startup forwarding. The built-extension browser test additionally changes
real extension storage from a separate document while native media advances,
then covers SPA navigation, reload, and return to native playback. It does not
claim an audible real-host sign-out/sign-in or Firefox browser confirmation.

Audio-element insertion/replacement is a distinct lifecycle boundary; this change
does not claim to cover every simultaneously present native player. Store release
and attended real-host confirmation are separate from the hermetic checks.
