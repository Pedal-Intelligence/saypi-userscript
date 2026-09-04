# Returning to Pi’s own voice

Pi’s Voice settings is where people expect a voice choice to take effect. With a
SayPi voice selected, choosing one of Pi’s native cards used to update Pi’s
preference while leaving SayPi in charge of playback. The page now treats that
click as a deliberate return to Pi: Pi keeps its own click handler and selected
card, while SayPi clears its stored voice with `unsetVoice(pi)`.

That existing preference path clears the converter’s selected voice and changes
the audio provider back to Pi. `AudioModule` then releases the host-element mute
used with offscreen playback. No new audio event or provider contract is needed.
Stored native Pi ids are cleared on native card clicks too, so an old persisted
Pi voice cannot override the card just chosen. Native provider identity also
determines whether an override notice belongs on the page; a non-null stored
voice alone does not.

The notice uses Pi’s compiled `text-text-secondary` theme utility rather than
inheriting the grid’s foreground, which was black even in dark mode. A nearby
Change voice button opens SayPi’s catalog. Native cards keep their normal
appearance because they are an active return path, and the notice explains that
choosing one switches playback back to Pi. Both the notice and catalog link are
repaired if Pi replaces its grid children.

The DOM regression suite proves native-provider classification, theme-color
inheritance, direct navigation, native-card click handling, failed persistence,
and replacement-node recovery. The existing audio tests cover provider-based
muting and release. Real-host confirmation belongs to the combined release E2E
pass; this slice itself spends no real-host turns.
