# Returning to Pi’s own voice

Pi’s Voice settings is where people expect a voice choice to take effect. With a
SayPi voice selected, choosing one of Pi’s native cards used to update Pi’s
preference while leaving SayPi in charge of playback. The page now treats that
click as a deliberate return to Pi: Pi keeps its own click handler and selected
card, while SayPi clears its stored voice with `unsetVoice(pi)`.
This explicit native choice also cancels Pi's pending first-install default,
even when no override has been stored yet: signing in later must not replace
the voice the user just chose with Marin. Merely viewing the grid leaves the
pending default intact.

That existing preference path clears the converter’s selected voice and changes
the audio provider back to Pi. `AudioModule` then releases the host-element mute
used with offscreen playback. No new audio event or provider contract is needed.
Stored native Pi ids are cleared on native card clicks too, so an old persisted
Pi voice cannot override the card just chosen. Native provider identity also
determines whether an override notice belongs on the page; a non-null stored
voice alone does not. When the stored id exists but its voice cannot currently
resolve, an authenticated user sees the saved-unavailable notice and Change
voice. A signed-out user instead sees the existing translated sign-in prompt
and a Sign In action leading to Settings, without changing their saved choice.
This also applies when cached remote metadata can still resolve after sign-out:
the saved voice is not currently speaking merely because its name is available.
Initial, auth and
external preference reads share a revision guard, so an older read cannot put a
SayPi notice back after the user has chosen a native voice.

The notice uses Pi’s compiled `text-text-secondary` theme utility rather than
inheriting the grid’s foreground, which was black even in dark mode. A nearby
Change voice button opens SayPi’s catalog. Native cards keep their normal
appearance because they are an active return path, and the notice explains that
choosing one switches playback back to Pi. Both the notice and catalog link are
repaired if Pi replaces its grid children.

The DOM regression suite proves native-provider classification, theme-color
inheritance, direct navigation, native-card click handling, failed persistence,
and replacement-node recovery. The existing audio tests cover provider-based
muting and release. `e2e/specs/pi-voice-settings.e2e.ts` adds a real development
extension and isolated Chromium profile against the local Pi settings fixture:
it verifies real preference writes, native card handling, catalog navigation,
and notice contrast in light/dark themes, sign-in guidance for both resolved and
unresolved saved voices, and a native pick sealing the pending default with no override.
The fixture leaves `/talk` unchanged. Its host-theme attribute is separate
from SayPi's theme classes, and the test asserts the actual background before
measuring contrast so a mislabeled light rendering cannot pass as dark coverage.
This slice spends no real-host turns.
