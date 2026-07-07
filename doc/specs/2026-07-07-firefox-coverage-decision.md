# Firefox coverage decision: MV2 smoke lane vs MV3 migration — evaluation

- **Date:** 2026-07-07
- **Status:** Recommendation (evaluation deliverable for #527; no implementation in this PR)
- **Author:** Autonomous engineering session (Claude)
- **Issues:** #527 (decision), #291 (Layer 3 follow-on tracker — "Firefox MV2" is its largest open slice)

## Why

Firefox ships as a first-class store target (AMO, `gecko@saypi.ai`) but has **zero browser-level
automated coverage**: the Layer 3 E2E harness (`e2e/`) is Chromium-only because Playwright cannot
load Firefox extensions, and there is no Firefox job in CI (`.github/workflows/` has only
`test.yaml` and `e2e.yaml`). An entire shipped browser rides on unit-test faith plus WXT's
build-time manifest checks. #527 frames the decision: (a) add a Firefox smoke-test lane for the
MV2 build we ship today, or (b) migrate Firefox to MV3 and collapse the dual-manifest burden.

**TL;DR — RECOMMENDATION: (a) land a Firefox MV2 smoke lane now (Selenium 4 + geckodriver
temporary-addon install, headless, advisory CI job); defer the MV3 migration.** The two options
are not substitutes: migration adds no test coverage and is itself a release-risk event that
should not ship blind, while the smoke lane de-risks today's shipped MV2 *and* is a precondition
for ever doing the migration safely. There is no forcing function — Mozilla has no MV2
deprecation timeline and has promised ≥12 months' notice if that changes.

## Current state (repo-grounded)

### How the Firefox build differs today

The dual-manifest burden is real but **small — WXT absorbs nearly all of it**:

- `npm run build:firefox` = `wxt build -b firefox` (`package.json:57`); WXT defaults the
  `firefox` target to MV2, emitting `.output/firefox-mv2/`. Dev mode pins it explicitly:
  `dev:firefox` = `wxt --browser firefox --mv2` (`package.json:22`).
- The only per-target branches in `wxt.config.ts` are permissions: the config factory skips
  `offscreen`/`audio`/`identity` for Firefox (`wxt.config.ts:379-384`), and a
  `build:manifestGenerated` hook strips `offscreen`/`audio` defensively (`wxt.config.ts:429-433`).
  Everything else (MV3-style `action`, `content_security_policy.extension_pages`,
  `web_accessible_resources` objects) is written once in MV3 shape and down-converted to MV2 by
  WXT at build time.
- The release pipeline hard-codes MV2 expectations: `scripts/release-lib.mjs:474-492` verifies
  the built Firefox manifest is `manifest_version: 2` and contains no Chrome-only permissions;
  `scripts/release-publish.mjs:192` submits `.output/firefox-mv2` to AMO; `scripts/release.mjs:120-125`
  requires `jq` for the Firefox packaging step.

### Runtime Firefox-specific handling (would survive either option unchanged)

- **Offscreen is already Chrome-only by design.** `likelySupportsOffscreen()` returns `false` for
  Firefox (`src/UserAgentModule.ts:92-96`), so VAD and audio run in-page on Firefox
  (`src/state-machines/AudioInputMachine.ts:47`, `src/audio/OffscreenAudioBridge.js:56`). Firefox
  MV3 also has no offscreen API (see verified facts), so migration neither requires nor unlocks
  anything here — the in-page fallback carries over as-is.
- **Auth:** Firefox uses a direct JWT-refresh path instead of Chrome's cookie observation
  (`src/svc/background.ts:548-737`, `src/JwtManager.ts:338-340`), with its own 5-minute polling
  interval (`background.ts:737`) and popup-open refresh (`background.ts:1258-1261`).
- **UI/UX branches:** `action`/`browserAction` are already shimmed via a namespace fallback list
  (`src/svc/background.ts:129-143`); Firefox-on-Android opens a tab instead of a popup window
  (`background.ts:77-78`); TTS is disabled on CSP-restrictive hosts per
  `doc/BROWSER_COMPATIBILITY.md:27-28`.

### What an MV3 migration would actually have to change

1. **Background model.** Firefox MV3 uses **event pages** (`background.scripts` +
   `persistent: false`), not service workers. WXT can emit this per-target. The code mostly
   survives non-persistent backgrounds already (it runs in Chrome's MV3 service worker; JWT
   refresh is alarm-driven, `background.ts:151`), but there are persistent-background
   assumptions that only Firefox MV2 currently masks: `setInterval(pollAuthCookie, …)` at
   `src/svc/background.ts:738` and module-level auth state (`lastAuthCookieValue`,
   `lastFirefoxRefreshAttempt`, `background.ts:644-647`) reset whenever an event page is
   suspended. On Firefox MV2 today the background page is persistent, so the 5-minute
   `setInterval` genuinely fires forever; on an MV3 event page it would silently stop.
2. **Host-permission semantics flip.** Firefox MV3 treats `host_permissions` as *optional* —
   users can revoke them at any time, and permissions added in an *update* are **not** granted
   automatically (see fact A4). For a content-script extension whose entire product is injection
   into `pi.ai`/`claude.ai`/`chatgpt.com` (+ `<all_urls>` for universal dictation,
   `entrypoints/saypi-universal.content.ts:14`), this is the single biggest migration risk: the
   code would need `permissions.contains()` checks and a re-prompt UX for the "granted host
   access is gone" state, which has no MV2 equivalent.
3. **Release pipeline updates:** the MV2 assertions in `release-lib.mjs`, the `firefox-mv2`
   output path, `strict_min_version` bump (MV3 needs Firefox 109+, realistically 115+/128 ESR),
   and an AMO submission that changes manifest version (normal review pipeline, but a
   bigger-than-usual diff).

### What CI covers today

`test.yaml` (typecheck + Jest/Vitest, browser-agnostic) and `e2e.yaml` (required; headless
**Chromium** only — the harness's pivotal `--host-resolver-rules` trick at
`e2e/fixtures/launch-args.ts:29` is a Chromium CLI flag, and Playwright cannot install Firefox
extensions at all). Nothing ever starts the Firefox build in a real Firefox.

## Verified facts (2026-07-07, primary sources)

**Firefox MV3/MV2 state:**

| # | Fact | Source |
|---|------|--------|
| A1 | AMO has accepted MV3 since 2022-11-21; MV3 GA in Firefox 109. **MV2 remains fully accepted with no deprecation timeline**; Mozilla promises ≥12 months' notice if that changes (Mar 2024 statement, reaffirmed Feb 2025). | [blog.mozilla.org 2024-03](https://blog.mozilla.org/addons/2024/03/13/manifest-v3-manifest-v2-march-2024-update/), [migration guide](https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/) |
| A2 | Firefox MV3 background = **event pages** (`background.scripts`, non-persistent); `service_worker` is not supported (behind a disabled flag). Cross-browser MV3 manifests declare both; Firefox ignores `service_worker` (coexistence fixed in Fx 121). | [MDN background](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/background) |
| A3 | **No offscreen API in Firefox** (Chrome-only; still a WECG proposal cross-browser). `scripting` parity good (Fx 101+); `declarativeNetRequest` Fx 113+; `storage.session` Fx 115+. | [Chrome offscreen ref](https://developer.chrome.com/docs/extensions/reference/api/offscreen), [w3c/webextensions#170](https://github.com/w3c/webextensions/issues/170) |
| A4 | Firefox MV3 `host_permissions` are **optional/revocable**. Since Fx 127 they are shown and granted at install, **but host permissions added by an extension update are NOT auto-granted** (bug 1893232), and users can revoke anytime → `permissions.contains()` checks required. | [MDN host_permissions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/host_permissions), [Fx 127 notes](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/127) |

**Smoke-lane tooling:**

| # | Fact | Source |
|---|------|--------|
| B5 | **Playwright: still no Firefox extension support**, and none coming — maintainers closed the request as out of scope (2024-12-03). Community bridge `playwright-webextext` exists (installs temporary add-ons over Firefox's remote protocol). | [playwright#7297](https://github.com/microsoft/playwright/issues/7297), [playwright-webextext](https://github.com/ueokande/playwright-webextext) |
| B6 | **Selenium 4 + geckodriver can install a temporary (unsigned) extension into a live headless Firefox**: JS `driver.installAddon(path, /*temporary=*/true)`, Python `install_addon(dir, temporary=True)`; headless via the `-headless` browser arg. | [selenium.dev Firefox docs](https://www.selenium.dev/documentation/webdriver/browsers/firefox/) |
| B7 | `web-ext` is alive (v10.4.0, 2026-06-12) and `web-ext run` loads unsigned temporary add-ons (headless via `--arg=-headless`), but it is a watch-mode dev server, not a test runner — usable, awkward for CI assertions. | [web-ext releases](https://github.com/mozilla/web-ext/releases), [web-ext#1337](https://github.com/mozilla/web-ext/issues/1337) |
| B8 | WebDriver BiDi has a `webExtension.install` command; **Firefox implements it since Fx 137**. Selenium convenience wrappers in progress. | [BiDi spec](https://w3c.github.io/webdriver-bidi/), [bugzilla 1934551](https://bugzilla.mozilla.org/show_bug.cgi?id=1934551) |
| B9 | GitHub Actions `ubuntu-24.04` ships Firefox (152.x) + geckodriver (0.37) preinstalled; they were briefly dropped from the image once in 2024, so pinning via `browser-actions/setup-firefox` is the robust choice. | [runner-images readme](https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md), [runner-images#10374](https://github.com/actions/runner-images/issues/10374) |

**Store review:** no primary source documents extra AMO review depth for an MV2→MV3 update
(every update passes validation + possible human review anyway); the concrete MV3 tripwires are
CSP remote-code rules and the userScripts policy. Treat "MV3 update triggers deeper review" as
unconfirmed — but the *user-facing* permission-semantics flip (A4) is confirmed and is the real
store-channel risk.

## The options

### Option A — Firefox MV2 smoke lane (recommended)

A separate, initially **advisory** CI workflow (`e2e-firefox.yaml`) that:

1. Builds the shipped target: `wxt build -b firefox --mode development` → `.output/firefox-mv2-dev`
   (dev mode for parity with the Chromium harness's static dev build; the MV2 manifest shape is
   identical to what `release-lib.mjs` verifies).
2. Launches **headless Firefox via `selenium-webdriver` + geckodriver** and installs the build as
   a **temporary add-on** (`driver.installAddon(path, true)` — no signing needed; fact B6).
3. Asserts the cheapest high-value signals:
   - the extension loads (background starts, no manifest rejection — temporary-install failure is
     itself the assertion);
   - the **universal dictation content script decorates a `localhost` fixture page**
     (`.saypi-dictation-button` appears next to a focused input). This needs *no* DNS trickery:
     `saypi-universal.content.ts` matches `http://*/*` (line 14), so a plain local static page is
     in-scope — the existing `e2e/` mock-server pieces can be reused nearly verbatim.
4. (Slice 2) Chat-host decoration against the existing `e2e/support/mock-pi-page.html`: Firefox's
   equivalent of `--host-resolver-rules` is the `network.dns.localDomains` pref (resolve listed
   hostnames to loopback) plus Selenium's `acceptInsecureCerts` capability for the harness's
   self-signed HTTPS mocks — same mock servers, different redirect knob.

**Why Selenium over the alternatives:** Playwright is a dead end (B5); `web-ext run` is a dev
server, not an assertion harness (B7); raw BiDi `webExtension.install` (B8) is the
forward-looking path but Selenium wraps geckodriver's Addons commands today with a stable API.
`playwright-webextext` would let us stay inside the Playwright harness, but it is a small
community shim on an unofficial protocol — a heavier bet than one `selenium-webdriver` dev-dep
for a deliberately tiny lane.

- **Effort:** ~1–2 sessions for slice 1 (workflow + install + dictation-decoration assert),
  ~1 session for the mock-Pi slice. No product code changes.
- **Coverage gained:** the exact artifact we ship to AMO boots in the exact browser it ships to;
  manifest/build regressions (the `release-lib.mjs` checks only inspect JSON — this actually
  *runs* it), background startup, content-script injection + DOM decoration on Firefox's Gecko
  DOM. Voice pipeline (fake mic → VAD → STT) is *not* in slice 1; the in-extension synthetic-mic
  hook (`saypi:dev-feed-speech`, DEV builds) is browser-agnostic and could extend the lane to a
  full STT turn later — noted as a stretch slice, not a commitment.
- **Risk/cost:** CI ~2–3 min/job; flake risk moderate (new browser automation stack) — hence
  advisory first, promoted to required only after a green streak, exactly like the `e2e` job's
  own promotion (2026-06-20, #337 precedent).
- **What it does NOT buy:** it does not reduce the dual-manifest maintenance cost (which is,
  per the Current state section, already small).

### Option B — migrate Firefox to MV3

- **Effort:** moderate code-side (WXT flag flip + `background` declared for event pages + fixing
  the `background.ts:738` persistent-interval assumption + a host-permission
  `permissions.contains()`/re-prompt UX) but **high verification burden**: every Firefox auth,
  lifecycle, and injection path needs re-testing — *and we currently have no Firefox test lane to
  do that with*, which is the circularity at the heart of this decision.
- **Coverage gained:** none. Migration is a product change, not a test.
- **What it buys:** deletes the ~10 lines of per-target permissions branching and the MV2
  release-verify variant; aligns both targets on one manifest version; pre-empts a hypothetical
  future MV2 sunset that Mozilla has explicitly not scheduled (A1).
- **Risk:** the host-permission semantics flip (A4) can silently strip content-script access for
  existing users on update — for this extension that is "the product stops working" severity;
  event-page suspension changes background timing behavior that Firefox MV2's persistent page
  currently masks; an AMO submission with a manifest-version change during an already-slow review
  channel (Edge's v1.11.0 review is the live cautionary tale in this repo's release notes).
  Firefox MV3 still has no offscreen API (A3), so the one architectural gap MV3 could have
  closed stays open regardless.

## Recommendation

**Do Option A now; explicitly defer Option B.** Rationale, in order of weight:

1. **The options are complements, and A is a prerequisite for B.** An MV3 migration shipped with
   zero Firefox browser-level coverage would be the exact failure mode #527 exists to close, at
   maximum stakes. Any future migration should land *behind* the smoke lane this decision
   creates.
2. **No forcing function.** Mozilla supports MV2 indefinitely with a promised 12-month runway
   (A1). Chrome-style urgency does not transfer.
3. **The dual-manifest burden is already amortized.** WXT owns the transform; the repo-side cost
   is a small permissions branch plus release checks that exist and pass. Option B's payoff is
   deleting ~10 lines and a verify variant; its downside is a plausible product outage for every
   Firefox user (A4).
4. **The lane is cheap and the tooling is proven.** Temporary-addon install into headless Firefox
   is a documented, stable Selenium/geckodriver feature (B6), runners ship Firefox (B9), and the
   first assertion (universal dictation on `localhost`) needs no new mock infrastructure.

**Revisit trigger for Option B:** Mozilla announcing an MV2 deprecation timeline, an MV3-only
Firefox capability we need, or AMO policy pressure. When triggered, the migration should be a
spike issue with the smoke lane (by then ideally including the mock-Pi and synthetic-STT slices)
as its acceptance gate, plus a dedicated host-permission re-prompt UX work item.

## First slice breakdown (issues to file for the chosen path)

1. **Firefox smoke lane v1 (the "first landed step" per #527's acceptance criteria).**
   Advisory `e2e-firefox` workflow: build `firefox-mv2` in dev mode; `selenium-webdriver` +
   geckodriver (pinned via `browser-actions/setup-firefox`); temporary-install the build into
   headless Firefox; assert install succeeds and `.saypi-dictation-button` decorates a focused
   input on a localhost fixture page; upload screenshots/logs on failure. Docs: a short
   `e2e-firefox/README.md` + a pointer from `e2e/README.md`.
2. **Chat-host decoration slice.** Reuse `e2e/support/mock-servers.ts` + `mock-pi-page.html`
   via `network.dns.localDomains` + `acceptInsecureCerts`; assert `#saypi-callButton` decorates
   the mock Pi page in Firefox.
3. **Promote to required** after a stable green streak (mirror the `e2e` job's promotion
   criteria: five consecutive first-attempt-green runs on distinct non-docs PRs).
4. **(Stretch, separate decision)** Synthetic voice turn on Firefox via `saypi:dev-feed-speech`
   against the mock STT endpoint — would make the lane cover the in-page (non-offscreen) VAD
   path, which no other layer exercises in any browser.
5. **Tracker hygiene:** update #291's "Firefox MV2" slice to link this decision + issue 1, and
   record the Option B revisit trigger on #527 when closing it.
