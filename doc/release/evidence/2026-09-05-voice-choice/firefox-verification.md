# Firefox verification, 5 September 2026

Candidate `418ee7190b29469774dcfd81f65ced01ffc8bd37` passed the MV2 development build, the existing advisory smoke, and all seven checks in the supplementary desktop voice journey. Both browser runs used Firefox 155.0.1 with geckodriver 0.37.0 and temporary installation in fresh profiles. This is verification evidence; it does not add or change a CI gate.

The journey observed original HTMLMediaElement playback, advancing currentTime, unmuted volume 1 and no media errors. Unarmed arrows stayed silent. Space previewed Paola (33 languages) while Pi remained Onyx; Enter saved Paola only for Pi; the choice survived reload. Play all advanced through two sample sources and Escape paused playback. Returning to Pi’s own voice removed only Pi’s stored override and survived reload. The page unloaded normally before Firefox quit.

[Structured results](firefox-results.json) record the revision, media progress and preference trace. Screenshots show [preview with Onyx still in use](firefox-preview.png), [the saved Paola choice](firefox-saved-choice.png), and [Pi’s own voice after return](firefox-native-return.png).

The optional 390px Firefox layout probe could not exercise that width: the desktop WebDriver window enforced a 500px minimum. Explicitly activating the settings tab confirmed an actual innerWidth of 500px. No 390px Firefox result is claimed; mobile layout evidence comes from the separate Chrome checks.

The journey used a fail-closed proxy to existing loopback catalog/audio mocks and committed MP3 fixtures. No autoplay preference was relaxed; no production configuration, existing user profile, cookie or token was loaded. No live-host turn or STT/TTS resource was used. It proves media decoding/progression and local settings behavior, not human-audible output, live Pi speech, production auth or microphone capture.

Mozilla’s documented [--allow-system-access](https://firefox-source-docs.mozilla.org/testing/geckodriver/Flags.html#allow-system-access) permission enabled ordinary navigation to our own addon’s settings. It grants Firefox UI-level privileges to the disposable test process; the runner did not use a parent-process context or access another installed extension. It explicitly activates its settings tab and waits for sample measurement/re-sort, using the same readiness condition as the repository’s Chrome harness.

The empty signed-out mock auth response explains “Missing token in response” logs. The stock smoke emitted a script-termination warning only after Marionette stopped listening; the final journey had no extension timeout. Firefox’s own PrivateBrowsingUtils error appeared during shutdown, after passing assertions.

The Chrome artifact’s 424-file digest was identical before and after the Firefox rebuild. No source was edited for this verification. Build command: `npm run e2e:build:firefox` with Node 22.21.1. The supplementary Selenium runner was temporary; exact local commands, attempt attribution and full logs are recorded in `/private/tmp/saypi-firefox-check/final-418ee71.md`.
