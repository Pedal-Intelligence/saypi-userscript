# Firefox Add-ons (AMO) — update submission

Item: **Say, Pi** · **MV2** Firefox build (`wxt build -b firefox`) packaged as `dist/saypi.firefox.xpi`.
gecko id `gecko@saypi.ai` · slug `say-pi` · listed add-on.
Developer Hub: https://addons.mozilla.org/developers/ · Listing: https://addons.mozilla.org/firefox/addon/say-pi/
Facts current 2026-06-20; sources at the bottom.

## Update flow
1. Sign in to the **Developer Hub**.
2. Open the **Say, Pi** add-on (upload from its own page so AMO treats it as an *update*; the `gecko@saypi.ai` id also binds it to the listing).
3. **Upload New Version** → `dist/saypi.firefox.xpi` (`.zip`/`.xpi`, max 200 MB).
4. **addons-linter validates automatically** — errors block, warnings don't (see below).
5. Distribution = **Listed**; select compatible applications.
6. **Source-code prompt = Yes** → upload `source-code.zip` (mandatory, see below).
7. Enter per-version metadata: **Release Notes** + **Notes for Reviewers**.
8. **Submit.** Signed & published (auto) within ~24h, or longer if selected for manual review; Firefox then auto-updates installed copies.

## Source code is MANDATORY for us
- AMO requires source submission when code is minified/bundled/transpiled — WXT's Vite/Rollup build triggers this.
- Upload `source-code.zip` (we generate it via `npm run source-archive` = `git archive HEAD`). It ships the **committed human-readable sources** (not the build output), including the **lockfile** (`package-lock.json`) and the repo's `README.md` / `CLAUDE.md` (which carry the build commands). AMO requires build instructions — **restate the exact steps in Notes for Reviewers** (Node ≥22 / npm ≥10, `npm ci && npm run build:firefox`) as the operational source of truth, since the archive has no dedicated build-README at its root.
- The reviewer **rebuilds from your instructions and diffs against the shipped package — it must match.** Build tools must be open-source and locally runnable.
- ⚠️ **Reproducibility caveat:** `.env.production` values are baked into the build via `import.meta.env`, so a reviewer cannot reproduce byte-for-byte without them. This is the trickiest part of an AMO release — confirm how it's handled (provide non-secret build-time values / explain in Notes for Reviewers) if the reviewer queries a diff.
- Default reviewer env: Ubuntu 24.04, **Node 24.x / npm 11.x** — state our `engines` (Node ≥22 / npm ≥10) and the exact command (`npm ci && npm run build:firefox`) in the README/notes.

## Per-version vs listing-level
- **Per-version:** Release Notes (user-facing, optional — this is the one store with a real changelog field), Notes for Reviewers (private, optional but recommended), the source archive, compatibility range.
- **Listing-level (carry over):** name, slug, summary, description, categories (≤2 Firefox + ≤2 Android), tags, screenshots, icon, support info, license, privacy policy.
- Numeric character limits for the notes fields aren't published — verify on the form if truncating in automation.

## Validation (addons-linter)
- **Errors block; warnings don't.** Manifest schema problems are errors.
- Our **onnxruntime `eval()` warning is a non-blocking warning** (a `DANGEROUS_EVAL`/`UNSAFE_VAR_ASSIGNMENT`-class finding from a third-party lib, tree-shaken out of the ship build). If it surfaces, **explain it in Notes for Reviewers** so manual review isn't slowed.

## Review & go-live
- "Up to 24h to sign & publish, **longer if selected for manual review**" (manual queues historically a few days). All add-ons remain subject to later manual review.

## Publishing API / tooling (future automation phase)
- **`web-ext sign --channel=listed`** (we have `web-ext@^8.5.0`). Since v8 it performs the full submission via AMO API v5. For an already-listed add-on, `--channel=listed` adds a new version to the existing listing.
- **Auth:** AMO JWT issuer + secret from `https://addons.mozilla.org/developers/addon/api/key` → env `WEB_EXT_API_KEY` / `WEB_EXT_API_SECRET`.
- **Source upload via API:** `--upload-source-code=source-code.zip` (env `WEB_EXT_UPLOAD_SOURCE_CODE`) satisfies the source requirement non-interactively. Release notes via `--amo-metadata`.
- gecko id `gecko@saypi.ai` must be present in the MV2 manifest so the upload maps to the `say-pi` listing.

## Sources
- Submitting an add-on — https://extensionworkshop.com/documentation/publish/submitting-an-add-on/
- Source code submission — https://extensionworkshop.com/documentation/publish/source-code-submission/
- Signing & distribution — https://extensionworkshop.com/documentation/publish/signing-and-distribution-overview/
- web-ext command reference — https://extensionworkshop.com/documentation/develop/web-ext-command-reference/
- addons-linter rules — https://github.com/mozilla/addons-linter/blob/master/docs/rules.md
