# Voice release closeout — 5 September 2026

The release review identified a bounded finishing pass: preserve voice choices through outages, make returning to Pi straightforward, and help listeners settle on a voice without teaching them a player first. The founder approved implementing that direction and preparing PRs for review on 5 September. The catalog, soundprints, pitch ordering, comparison and curation stay in place.

## Choice and listening

The studio leads with the voice selected for the current assistant. Listening never changes that selection. Play marks remain visible before hover; the focused voice offers **Use for Pi/Claude**, and a successful save gets a visible confirmation and an announcement through the existing stable live region. A failed write leaves the previous voice selected and offers a retry through the same button.

Listening options contain the arrow-play preference, heard count and keyboard help. Play all and comparison remain directly available. The HD allowance explanation becomes visible when an HD voice is focused, as well as under the HD filter. It says that HD uses more monthly allowance and that samples are free: current server source includes both 1,000- and 2,000-credit HD variants against 50-credit everyday voices, so one “20×” figure was inaccurate.

The current-voice summary derives from the saved provider, independently of filtering. A voice outside the filtered rows still gets its name and native return action; only its jump-to-row button disappears. A catalog outage keeps the saved-unavailable explanation and native return accessible even when no list can be drawn.

Voice preferences refresh on return to the tab, window focus, storage notifications and revisiting an assistant. Catalog and sample measurements stay cached. A revision token rejects stale reads, and notifications received while a save is pending are replayed afterward so another document’s newer choice cannot be overwritten by an obsolete success display.

Phone layouts give more space to voice names and keep the current marker readable. Translated Use labels wrap, duplicate-name descriptions remain visible, and neither controls nor rows may overflow the viewport.

## Verification and release boundaries

Fail-first regressions cover save failure, native return, catalog-outage recovery, stale reads, external changes, filtering, and stable live announcements. Existing layout/keyboard/copy tests continue to run; obsolete assertions about the old toolbar hierarchy were updated to the approved behavior.

`e2e/specs/voices-release.e2e.ts` runs the built extension in an isolated Chromium profile against local mock hosts. Its fixture opts into the browser’s default autoplay policy. A gestureless ordinary-page negative control must fail with NotAllowedError; real media playing/timeupdate events then prove that user-started samples and sequences progress. It covers Escape, comparison without commitment, keyboard commitment, host isolation, reopening, cross-document changes, and 320/390/1280px geometry. Color-scheme requests test the settings surface in both OS modes; the settings shell itself remains light. Pi’s separate host-fixture tests assert actual light and dark rendered colors.

The final candidate combines the preference fix (PR #608), Pi return fix (PR #607), and this studio pass. A separate candidate evidence record will identify exact commits and final full-suite/browser outcomes. Browser automation and DOM/ARIA assertions do not substitute for a real screen-reader pass. Production packaging, release-risk acceptance (#544), version bump and store submission remain outside these review PRs.

The studio’s local layout and interaction code has no remote off switch. Existing catalog/sample withdrawal can neutralize individual voices or previews but cannot repair local controls. That residual risk must be explicitly assessed in the final submission packet under the existing kill-switch policy; this document does not accept it on the founder’s behalf.
