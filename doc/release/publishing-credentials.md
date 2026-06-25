# Publishing-API credentials & submission (#412)

`node scripts/release.mjs submit <chrome|edge|firefox>` submits a built artifact to a store's
**publishing API** — no dashboard, no browser. This is the headless alternative to the manual
packet. It's **founder-only and irreversible**: a real submit publishes to a live store, so it
requires `--yes`; `--dry-run` only auth-checks (no upload/publish).

> ⚠️ **Browser-driving is impossible** for Chrome (extensions-gallery block) and file-picker-gated
> everywhere — the API is the only real automation path. See `chrome-web-store.md`.

Credentials are **never** stored in the repo. Provide them as **environment variables** at submit
time. The easiest way: drop them in a local, gitignored **`.env.publish`** at the repo root
(`KEY=value` per line) — `submit` **auto-loads that file** into `process.env`, so no manual
`source` is needed. Already-exported shell vars (or your CI secret store) take precedence over the
file. The tool reads only `process.env` and `.env.publish`; it **never** reads `.env.production`,
and it logs only the *names* of the keys it loaded — never their values.

## Usage

```bash
# Always dry-run first (auth check only — safe, no upload/publish):
npm run release:submit -- chrome  --dry-run
npm run release:submit -- edge    --dry-run
npm run release:submit -- firefox --dry-run

# Real submission (founder-only; publishes to the live store):
npm run release:submit -- chrome  --yes
npm run release:submit -- edge    --yes
npm run release:submit -- firefox --yes
```

Requires the built artifacts (`release:build` first): `dist/saypi.chrome.zip`,
`dist/saypi.edge.zip`, `.output/firefox-mv2/` + `source-code.zip`. Release notes are read from
`_locales/en/release_notes.txt` (AMO version notes) automatically.

## 🟢 Chrome Web Store — env vars

| Env var | What it is |
|---|---|
| `CWS_EXTENSION_ID` | `glhhgglpalmjjkoiigojligncepccdei` (the item id) |
| `CWS_PUBLISHER_ID` | your publisher id — Developer Dashboard → Account settings (NEW: V2 requires it) |
| `CWS_CLIENT_ID` / `CWS_CLIENT_SECRET` | OAuth2 client (Google Cloud Console → Credentials) |
| `CWS_REFRESH_TOKEN` | long-lived refresh token (one-time, below) |

**One-time setup:** Google Cloud Console → new project → **enable the Chrome Web Store API** →
create an **OAuth client (Web application)** with redirect `https://developers.google.com/oauthplayground`
→ OAuth Playground (use your own creds) → authorize scope `https://www.googleapis.com/auth/chromewebstore`
**signed in as the account that owns the extension** → exchange for a **refresh token**. The owning
account **must have 2-Step Verification on** or publish returns 403. (Flow: `using-api` guide.)

API V2 (`chromewebstore.googleapis.com`) is current; V1 sunsets 2026-10-15. V2 can't create items or
change visibility (fine — Say, Pi exists).

## 🔵 Microsoft Edge Add-ons — env vars

| Env var | What it is |
|---|---|
| `EDGE_PRODUCT_ID` | `824c36fe-fd03-4656-8d32-67b0ae2cbdad` |
| `EDGE_API_KEY` | API key — Partner Center → Edge → **Publish API** → Create API credentials |
| `EDGE_CLIENT_ID` | Client ID (same page) |

**Auth is v1.1** (header `Authorization: ApiKey <key>`, `X-ClientID: <id>`); the old v1 Entra/OAuth
model ended 2024-12-31. ⚠️ **API keys expire every ~72 days** — a `401` means "rotate the key in
Partner Center." Edge has **no deferred publish**: a real submit goes straight to certification.

## 🟠 Firefox AMO — env vars

| Env var | What it is |
|---|---|
| `WEB_EXT_API_KEY` | AMO JWT **issuer** (e.g. `user:12345:67`) |
| `WEB_EXT_API_SECRET` | AMO JWT **secret** |

Create both at `https://addons.mozilla.org/developers/addon/api/key/`. Submission uses
`web-ext sign --channel=listed` (already a devDependency) and signs from **`.output/firefox-mv2/`**
(the build dir — `web-ext sign` rebuilds from source, it does not take the prebuilt `.xpi`).
`--upload-source-code=source-code.zip` satisfies the minified-build source requirement; build steps
go into the reviewer notes automatically. Listed submissions enter the AMO review queue (not
instantly public). Ensure `.output/firefox-mv2/manifest.json` carries `gecko@saypi.ai`.

## How `--dry-run` checks each store
- **Chrome:** real OAuth token exchange + a read-only `fetchStatus` (prints the current published version).
- **Edge:** a credentials probe (a poll-URL GET with a dummy operation id — `401` = bad key, else accepted). Edge has no read-only status endpoint, so this is the safest check short of uploading. (Caveat: a wrong `EDGE_PRODUCT_ID` returns `404`, which the probe treats as "creds accepted" — it only surfaces on the real upload.)
- **Firefox:** confirms the JWT env vars are present and `web-ext` runs (`web-ext sign` itself submits, so it isn't invoked in a dry run).

## Status
The machinery is built + unit-tested (`scripts/release-publish.mjs`, `scripts/release-lib.mjs`).
The remaining steps are founder-only: provision the credentials above, then `--dry-run` each store,
then run a real `--yes` submission on the next release. Tracked in **#412**.
