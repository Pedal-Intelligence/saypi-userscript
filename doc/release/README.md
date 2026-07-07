# Releasing Say, Pi to the web stores

The canonical, version-controlled runbook for publishing a new version of the extension to
the **Chrome Web Store**, **Microsoft Edge Add-ons**, and **Firefox AMO** from one
versioned build. It backs the local `release-extension` Claude skill
(`.claude/skills/release-extension/SKILL.md`, gitignored like all `.claude/` skills) — but
this doc, the scripts, and the config are tracked so the machinery is shared and CI-tested.

Design rationale: [`doc/specs/2026-06-20-release-extension-skill-design.md`](specs/2026-06-20-release-extension-skill-design.md).

## ⛔ Release is founder-only

Per [`AGENTS.md`](../../AGENTS.md): a release is effectively **irreversible once users
auto-update**, and store-submission plumbing is founder-gated.

- **Never autonomous.** Run the read-only steps (`preflight`, `plan`, `packet`) and draft
  copy freely, but **stop at the first mutating/outward gate** and hand off to the founder.
- The tooling **never loads `.env.production`**, bumps, builds, tags, pushes, or submits
  without the founder. `bump`/`build`/`tag`/`finalize` refuse to run without `--yes`.
- **Shipped something bad?** The reverse path is
  [`doc/release/incident-response.md`](incident-response.md) — server-side kill-switch
  first, expedited patch second; escalate to the founder immediately.

## Layout

- `scripts/release.mjs` — gated CLI (below). Shells out to the existing, trusted
  `package-extension.sh` / `npm run source-archive`; does not reimplement the build.
- `scripts/release-lib.mjs` — pure, unit-tested logic (version decision, payload
  categorization, changelog digest, packet rendering). Tests: `test/scripts/release-lib.spec.ts`.
- `scripts/store-status.mjs` / `scripts/store-status-lib.mjs` — read-only per-store review
  status check (`npm run release:status`, #529; see "Checking review status" below) and the
  credential-freshness check (`npm run release:freshness`, #534; rotation runbook in
  [`publishing-credentials.md`](publishing-credentials.md) § "Rotation & lifetimes").
  Tests: `test/scripts/store-status-lib.spec.ts`, `test/scripts/credential-freshness.spec.ts`.
- `doc/release/stores.json` — single source of truth for store identity + per-store facts.
  Consumed by the packet generator and any future browser-driver / API path.
- `doc/release/{chrome-web-store,edge-addons,firefox-amo}.md` — per-store submission detail.
- `doc/release/version-policy.md` — the derive-don't-assume version rule.
- `doc/release/kill-switch-policy.md` — the **kill-switch-by-default rule**: which changes
  must ship behind a server-side flag before store release (crisp test + the OpenAI-voices
  precedent). The packet's release-level "Kill-switch coverage" check comes from here.
- `doc/release/brand-voice.md` — Say, Pi voice guide for the "what's new" copy.

## Commands

```
node scripts/release.mjs preflight              # read-only: repo/tooling/version state
node scripts/release.mjs plan [--save]          # read-only: derive version + changelog digest
node scripts/release.mjs packet [--version X]   # write dist/submission-packet-v<x>.md
node scripts/release.mjs bump [version] --yes   # founder: set package.json version (no tag)
node scripts/release.mjs build --yes            # founder: build + package all stores (.env.production)
node scripts/release.mjs tag [version] --yes    # founder: create the release tag (local, main only)
node scripts/release.mjs finalize [version] --yes  # founder: push commit + tag (main only)
```

Every command has a first-class npm alias (`npm run release:<cmd>`) for discoverability —
`npm run` lists them. The safe three run directly; the gated four need the `--yes` flag
passed through, e.g. `npm run release:bump -- 1.11.0 --yes`, `npm run release:build -- --yes`
(running them without `--yes` just prints the founder-only gate notice):

```
npm run release:preflight                  # = node scripts/release.mjs preflight
npm run release:plan                       # = … plan
npm run release:packet                     # = … packet
npm run release:bump -- <version> --yes    # = … bump <version> --yes
npm run release:build -- --yes             # = … build --yes  (clears stale output, then self-verifies)
npm run release:verify                     # = … verify  (re-check the built candidates; read-only)
npm run release:tag -- <version> --yes     # = … tag <version> --yes
npm run release:finalize -- <version> --yes  # = … finalize <version> --yes
npm run release:submit -- <store> --dry-run  # ⛔ #412: auth-check a store's publishing API
npm run release:submit -- <store> --yes      # ⛔ #412: headless API submission (founder-only)
npm run release:status                       # read-only: review/publish status per store (#529)
npm run release:freshness                    # read-only: publishing-credential health per store (#534)
```

Run from the **main checkout on `main`** — a real release is cut from main and the build
needs `.env.production`, which is never copied into a worktree.

## Runbook

### 0. Preflight (read-only)
`node scripts/release.mjs preflight`. Confirms on `main`, tree clean, `HEAD == origin/main`,
`node`/`npm`/`jq`/`zip` present, `.env.production` exists (existence only), latest `test.yaml`
green, and prints the version state. Resolve anything blocking first.

### 1. Decide the version ⛔
`node scripts/release.mjs plan`. Derives the version from the **published baseline + the
payload** (never trusting `package.json` blindly — see `version-policy.md`) and prints the
changelog digest. **Present the version + reasoning to the founder; get a yes** (or override).
Then founder-run `node scripts/release.mjs bump <version> --yes` (sets `package.json` +
lockfile, no tag). Reconcile the stale root `manifest.json` if it drifts (legacy, unused by
the WXT build). Commit the bump.

### 2. Build & package ⛔ (founder, loads `.env.production`)
`node scripts/release.mjs build --yes` → **clears stale `.output`/`dist`/`source-code.zip`**,
prints what/where it's building, runs `package-extension.sh chrome edge firefox` +
`source-archive` → `dist/saypi.chrome.zip`, `dist/saypi.edge.zip`, `dist/saypi.firefox.xpi`,
`source-code.zip`, then **auto-verifies** them and **fails the build** if anything is off.
The verification (also runnable standalone via `release:verify`) checks: the version *inside
each archive* matches the target (catches stale builds), Edge≡Chrome, the Firefox MV2 manifest
+ gecko id, **no dev-only `downloads`**, **no secrets in the source zip**, and **permission-set
drift** (would have caught the missing `alarms`/`identity`). This codifies the manual checks
from the 1.11.0 wet run — see `scripts/release-lib.mjs` (`checkChromeManifest` etc.).

### 3. Draft the "what's new" ⛔ (to apply)
`node scripts/release.mjs plan --save` writes the factual digest to
`dist/release-notes-draft-v<x>.md`. Rewrite the **user-facing** items in brand voice
(`brand-voice.md`) into **`_locales/en/release_notes.txt`**; get founder approval. Only AMO
shows this to users; Chrome/Edge have no changelog field. Translate other locales only on
request (`tools/i18n/i18n-translate-release-text.py`).

### 4. Generate the submission packet
`node scripts/release.mjs packet` → `dist/submission-packet-v<x>.md`: one section per store
with the exact upload file, the "what's new" text, the declarations to re-confirm, and a
click-by-click checklist (driven by `stores.json`). The packet opens with a release-level
**Kill-switch coverage** check: every payload change with a user-visible failure mode must be
neutralizable server-side or its residual risk explicitly accepted —
per [`kill-switch-policy.md`](kill-switch-policy.md). Work it before submitting anywhere.

### 5. Submit (founder, per store) ⛔
Work the packet top to bottom — **Chrome → Edge → Firefox**, one versioned build, same day.
Detail + gotchas in `chrome-web-store.md`, `edge-addons.md`, `firefox-amo.md`. Key reminders:
- **Chrome/Edge have no "what's new" field**; **AMO does** (paste the release notes there).
- **Edge** name/description are read-only (from the manifest), must not say "Chrome", and it
  **auto-publishes on approval** (no go-live gate). Capture the **Edge Product ID** into
  `stores.json` on first run.
- **AMO** requires uploading **`source-code.zip`** (+ build steps in Notes for Reviewers);
  the onnxruntime `eval` warning is non-blocking.

**Or — headless via the publishing APIs (#412).** Once credentials are provisioned (one-time, per
`publishing-credentials.md`), skip the dashboards entirely: `release:submit -- <store> --dry-run`
to auth-check, then `release:submit -- <store> --yes` to upload + submit via each store's API
(CWS V2 / Edge v1.1 / AMO `web-ext sign`). Founder-only and irreversible. This is the long-term
"one-button" path; the manual packet above remains the fallback and for any listing-copy changes.

### 6. Finalize ⛔ (founder)
After all stores are submitted: `node scripts/release.mjs tag <version> --yes` then
`finalize <version> --yes`. `tag` resolves the **actual release commit** (the `Version bump
to v<x>` commit whose package.json matches) and tags *that* — not `HEAD`, which concurrent
merges may have moved past — and refuses if it can't find a matching commit. `finalize` pushes
origin/main + the tag, then **cuts the GitHub release** from `_locales/en/release_notes.txt`
(pass `--no-gh-release` to skip; refine the release title/body on GitHub afterward).

## Checking review status (read-only, any time) — #529

`npm run release:status` (= `node scripts/store-status.mjs [--json] [--stall-days N]`)
reports where each store actually stands, so a stalled review is noticed on purpose rather
than incidentally. For every store in `stores.json` it hits **read-only** endpoints with the
same credentials `release:submit` uses (env vars / `.env.publish`,
per [`publishing-credentials.md`](publishing-credentials.md)) and prints a compact table:
live version · review state · last update · a **stall flag**.

- **Chrome:** OAuth token + CWS V2 `:fetchStatus` — published version and any
  `PENDING_REVIEW`/`REJECTED` submitted revision.
- **Edge:** the publish-API credentials probe (catches the ~72-day key expiry) + the public
  product-details endpoint for the live version. Edge's API exposes **no review state**, so
  stalls there are inferred from release lag (below).
- **Firefox (AMO):** JWT-authed v5 addon detail + versions list — live version plus any
  listed version still `unreviewed` in the queue, with its submission date.

**Stall flag** (default threshold 14 days, `--stall-days N`): a submission in review longer
than the threshold, **or** a store whose live version is still behind the latest release tag
even though that release is older than the threshold — the second rule is what catches Edge,
which offers no review-state visibility at all.

Degrades gracefully: a store whose credential env vars are absent is reported **SKIPPED**
(exit 0, no request made) — only a failed check (bad auth/network) exits 1. The tool never
uploads/publishes anything, never reads `.env.production`, and logs env var **names** only.
Intended future use: a scheduled routine that runs this and files an issue on a stall (#525).

## Future: one-click automation via publishing APIs (#412)
The 1.11.0 wet run established that **browser-driving is a dead end for releases:**
- **Chrome's dev console can't be scripted by an extension at all** (extensions-gallery block —
  *"The extensions gallery cannot be scripted"*). Edge Partner Center / AMO aren't on the gallery,
  so they *could* be driven from Chrome, but —
- the package upload is a **native OS file-picker** and the build is ~18 MB (over the in-browser
  10 MB cap), so the actual upload isn't automatable from the browser on **any** store.

So the real path to a (near) one-click, headless release is the **publishing APIs**, consuming the
same `stores.json` + built artifacts: **CWS V2** (OAuth refresh token), **Edge v1.1** (API key +
Client ID), **AMO** `web-ext sign --channel=listed` (JWT, `--upload-source-code`). Each store's API
+ auth model is in its per-store file. Tracked in **#412**.
