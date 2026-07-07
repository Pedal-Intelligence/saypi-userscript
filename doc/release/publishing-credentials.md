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

The same credentials (same env var names, same `.env.publish` auto-load) also power the
**read-only** review-status check `npm run release:status` (#529) — see "Checking review
status" in [`README.md`](README.md). That command never uploads or publishes; a store whose
vars are absent is simply reported SKIPPED.

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
create an **OAuth client (Web application)** with redirect `https://developers.google.com/oauthplayground`.
The owning account **must have 2-Step Verification on** or publish returns 403.

### Minting `CWS_REFRESH_TOKEN` (the part you'll redo)

`CWS_CLIENT_ID`, `CWS_CLIENT_SECRET`, and `CWS_REFRESH_TOKEN` must **all come from the same OAuth
client** — a refresh token presented with a *different* client's id/secret fails the token
exchange with **`401 unauthorized_client`** (not `invalid_grant`; that one means expired/revoked).

1. Google Cloud Console → the OAuth client → copy the **Client ID** and download the full
   **Client secret** (the console only shows it masked).
2. Open **https://developers.google.com/oauthplayground** → top-right **⚙️** → tick
   **"Use your own OAuth credentials"** → paste that Client ID + secret.
3. Step 1 → **"Input your own scopes"** → `https://www.googleapis.com/auth/chromewebstore` →
   **Authorize APIs**.
4. Sign in **as the account that owns the extension**. ("Google hasn't verified this app" →
   **Advanced → Go to … (unsafe)** — it's your own client.)
5. Step 2 → **Exchange authorization code for tokens** → copy the **Refresh token** (`1//…`).
6. Put all three (id, secret, refresh token) in `.env.publish`.

If the exchange returns **no refresh token** (only an access token), you've authorized this
client+account before — revoke at https://myaccount.google.com/permissions and redo, or confirm
"Use your own credentials" is ticked (the Playground forces `prompt=consent`).

> ⚠️ **Refresh-token lifetime hinges on the OAuth app's publishing status** (Google Auth Platform
> → **Audience** → *Publishing status*): **"Testing" → the refresh token expires in ~7 days**
> (you'll remint weekly); **"In production" → long-lived** (no inactivity expiry under 6 months).
> For a publishing client you only use yourself, **publish the app to production** so the token
> persists. A working `--dry-run` today does **not** tell you which you have — only this field does.

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
