# e2e-firefox — advisory Firefox MV2 smoke lane

The first landed slice of the **Firefox coverage decision** (#527) — see
[doc/specs/2026-07-07-firefox-coverage-decision.md](../doc/specs/2026-07-07-firefox-coverage-decision.md)
for the full evaluation (MV2 smoke lane vs MV3 migration) and why this lane
exists. It is deliberately **separate from `e2e/`** (the Chromium Layer-3
harness): Playwright cannot load Firefox extensions, so this lane uses
**selenium-webdriver 4 + geckodriver** instead, and keeps its own tiny,
dependency-free harness rather than sharing the Playwright one.

## What it proves (and doesn't)

One smoke, one assertion chain: the exact `.output/firefox-mv2-dev` artifact
(same MV2 shape we ship to AMO, built in development mode like the Chromium
harness's static dev build) **temporary-installs into a real headless Firefox**,
the background starts, the universal dictation content script
(`entrypoints/saypi-universal.content.ts`, matches `http://*/*`) injects into a
plain-HTTP localhost fixture page, and a focused text field gets a visible
`.saypi-dictation-button`.

- Manifest rejection, bundle-load errors, content-script injection breakage on
  Gecko, and decoration regressions all fail the smoke.
- **Not covered (yet):** chat-host decoration (needs the mock-Pi slice —
  `network.dns.localDomains` + `acceptInsecureCerts`, slice 2 in the decision
  doc) and the voice pipeline (fake mic → VAD → STT — stretch slice).

## Run it locally

```bash
npm run e2e:build:firefox   # wxt build -b firefox --mv2 -m development → .output/firefox-mv2-dev
npm run test:e2e:firefox    # node e2e-firefox/smoke.mjs
```

Needs a Firefox install (set `FIREFOX_BIN=/path/to/firefox` to pick a specific
binary; otherwise Selenium finds the system one). **geckodriver needs no manual
install**: Selenium Manager (bundled with `selenium-webdriver`) downloads a
matching driver on first run, or an existing one on `PATH` is used.

On failure the script writes `e2e-firefox/artifacts/` (page HTML, screenshot,
last decoration-probe state) — CI uploads that directory as a failure artifact.

## CI status: ADVISORY

The [`e2e-firefox` workflow](../.github/workflows/e2e-firefox.yaml) runs on
every PR and push to `main` but is **not a required status check** — a red run
is a signal, not a merge block. Promotion to required follows the same bar the
Chromium `e2e` job cleared (2026-06-20): five consecutive first-attempt-green
runs on distinct, non-docs-only PRs.

## Notes / gotchas

- **Temporary add-on install is by PATH, not by upload.** The smoke sends
  geckodriver's `install addon` command with `path` = the unpacked build dir
  (the about:debugging "Load Temporary Add-on" mechanism), **not**
  `driver.installAddon(dir, true)`. The latter base64-zips the directory and
  geckodriver stages it as a temp XPI that does not reliably survive for later
  loads: on Firefox 140 ESR the background loads but every content-script
  injection then fails with `NS_ERROR_FILE_ACCESS_DENIED` ("Unable to load
  script: moz-extension://…/saypi-universal.js") — the first CI run caught
  exactly this. Path-based install works on 140 ESR and 152; it needs no
  signing (`xpinstall.signatures.required=false` is still set defensively) and
  requires geckodriver + Firefox on the same host as the script (true locally
  and on CI).
- **Diagnosability:** `devtools.console.stdout.content=true` plus geckodriver
  stdio inheritance stream the extension's console (background + content
  script) into the smoke's own output — a content-script crash shows up in the
  CI log instead of an opaque "button never appeared".
- **Hermetic-ish:** Firefox has no `--host-resolver-rules`; the
  `network.dns.localDomains` pref resolves the bundle's real hostnames
  (`api.saypi.ai`, …) to loopback so nothing leaves the machine and fail-soft
  bootstrap (#292) is exercised on Firefox too. Unlike the Chromium harness
  there is no `MAP * ~NOTFOUND` fail-closed sinkhole — an unlisted host would
  resolve normally, which is acceptable for an advisory smoke but should be
  revisited when the mock-Pi slice lands.
- The build script (`scripts/e2e-firefox-build.mjs`) mirrors
  `scripts/e2e-build.mjs`, including the never-bare-`wxt build` rule (a bare
  build loads `.env.production`) and a manifest guard adapted for MV2
  (`content_security_policy` is a plain string in MV2).
