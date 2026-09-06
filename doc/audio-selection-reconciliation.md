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

Pi audio-element insertion and replacement also reconcile ownership. Discovery
includes a directly added audio node and every player in an added subtree, then
binds at most one connected candidate per batch. Retired players lose SayPi's
listeners and assigned ID without losing host-owned media that remains connected.

`PiNativeAudioGuard` suppresses only `https://pi.ai/api/chat/voice` sources (plus
the empty tracked bootstrap player). Chrome holds all those native players muted
and restores each original mute value when custom ownership ends or a player
changes to unrelated media. Capture-phase media events cover sources assigned
after insertion. Suppressed native lifecycle events do not reach the custom
output actor, whose skip transition would otherwise stop the real SayPi speech.

Firefox/Safari pause only automatic native speech. The shared SayPi output remains
bound through buffering and paused states as well as playback. An explicit reply
replay loaded by SayPi may carry an older native Pi URL; that shared output keeps
its lifecycle events and is exempt from autoplay suppression. That exemption
belongs to the explicit shared load: stopping, completing or removing it releases
ownership; an intentional pause or source-replacement emptied event does not. The browser test
now proves three native players continue advancing silently, then become audible
again when the override is cleared. It covers direct and nested same-batch
insertion; the runtime tests additionally cover replacement, retired listeners,
source changes, unrelated media and shared-page replay/resume.

Store release and attended real-host confirmation remain separate from these
hermetic checks.


## Explicit return to Pi (#624)

“Use Pi’s own voice” is a playback request, not merely removal of a preference.
`PreferenceModule` marks a local explicit unset, or an actual removal of the
current host's saved key in `storage.onChanged`, as `nativeVoiceRequested`.
Startup, auth fallback and writes for other hosts do not carry that intent.
`AudioSelectionSync` preserves the pending request across a concurrent auth read;
a newer explicit custom choice cancels it.

The Pi audio owner first waits for an active offscreen stream or preview to stop,
keeping native players suppressed throughout the wait. Duplicate notifications
share one pending restore attempt. It then releases native mute bits even if an older runtime left
them muted, resets output skip/replay state while retaining the call flag, and
uses the existing `PiAutoRead` control to enable host speech. It resumes only the
current loaded, unfinished native reply. If Firefox is still bound to its old
custom player, it binds a retained native reply first. Ended and unrelated media
are not started. After the asynchronous host control, it rechecks the current
selection and player so a newer custom choice wins.

Canceled offscreen events are ignored until a new explicit load or reload opens
playback again; both commands use the same load implementation. This prevents a
late custom event from stopping restored native speech without discarding the
next custom voice's lifecycle. It is not a new cross-context generation protocol.

The built-browser regression uses actual Settings selection and native-return
buttons, starting with a loaded, muted, paused native player. It verifies real
playback time advances with mute off and positive volume, on the same document,
with Pi auto-read initially both on and off; selecting custom again suppresses it.
This proves browser playback eligibility and progression, not an attended audible
check in a user's installed tab. A rebuilt extension does not replace JavaScript
already injected in an open page; stale installed runtimes require separate
update verification before attributing their behavior to current source.
