# Microsoft Edge Add-ons — update submission

Item: **Say, Pi** · MV3 · the **same package as Chrome** (`dist/saypi.edge.zip` is a copy of the Chrome zip).
Dashboard: Microsoft **Partner Center** → Edge program (https://partner.microsoft.com/dashboard/microsoftedge/).
Facts current 2026-06-20; sources at the bottom.

> **Product ID is not recorded in-repo.** Capture it on first run from Partner Center → Extension overview → **Extension identity** (or the GUID in the dashboard URL) and write it into `stores.json` (`stores.edge.id`).

## Update flow
1. Sign in to **Partner Center → Edge**.
2. Select **Say, Pi** → **Packages** → upload `dist/saypi.edge.zip`.
3. Increment the manifest `version` if the package changed.
4. **Publish** → the **Submit your extension** page → optionally add **Notes for certification** → **Publish** again. This starts certification.
5. States: `Update in review` → (`Waiting to publish`) → `In the store`.

## Per-version vs listing-level
- **Read-only, from the manifest:** **name, short description, description** — you cannot edit them in Partner Center; to change them, re-upload a package. (Ours come from `_locales/en/messages.json` → `appName` / `appDescription`.)
- **Listing-level (carry over):** Availability (visibility, markets), Properties (category, website, support), Privacy section, store-listing assets (logo, tiles, screenshots, search terms).
- **No release-notes/changelog field.** Convey "what changed" via **Notes for certification** (optional but recommended for updates).

## Declarations (Privacy section, each submission)
- **Single purpose.**
- **Per-permission justification** (same set as Chrome).
- **Remote code: No** (MV3).
- **Data usage** + certifications, consistent with the privacy policy.
- **Privacy policy URL:** https://saypi.ai/legal/privacy
- _Note:_ the Privacy fields may still appear under **Properties** if the May-2026 dedicated-Privacy-page rollout hasn't reached the account — same fields, different page.

## Package & compatibility — important Edge-specific checks
- Edge accepts the **same MV3 zip** as Chrome. But:
  - **No `update_url`** in the manifest (ours has none — confirm).
  - **The listing must not say "Chrome"** (certification requirement). Name/description come from `messages.json` — grep `appName`/`appDescription` for "Chrome" before packaging.
  - `browser_specific_settings` (a Firefox key) is harmless/ignored.
- **Version bump mandatory** when the package changes.
- **Max size:** no official documented figure; upload-time validation governs. (Our WASM/ONNX binaries are large but fine; the AMO 5 MB *non-binary* limit is a Firefox-only constraint.)

## Limits (only if editing copy)
- Description (listing, per language): **min 250, max 10,000**.
- Search terms: ≤7 terms, ≤30 chars each, ≤21 words total.
- Logo recommended 300×300 (min 128×128); small tile 440×280; large tile 1400×560; screenshots ≤6 at 640×480 or 1280×800.

## Review & go-live
- Certification: **up to 7 business days**.
- **Auto-publishes on approval — there is no manual go-live gate.** Submitting to certification is the irreversible commit point. (Visibility Public/Hidden in Availability is the only release control.)

## Publishing API (future automation phase)
- **Edge Add-ons Update REST API** (CI/CD-oriented; updates only — cannot create products or edit listing metadata). Base `https://api.addons.microsoftedge.microsoft.com`. Enable under Partner Center → Edge → **Publish API**.
- **Auth = v1.1 API key + Client ID** (headers `Authorization: ApiKey $KEY`, `X-ClientID: $CLIENTID`). The old v1 Entra/OAuth2 model **ended 2024-12-31**.
- **Flow:** `POST /v1/products/$productID/submissions/draft/package` (body = zip) → poll `…/operations/$operationID` → `POST /v1/products/$productID/submissions` (body `{ "notes": "…" }`) → poll. A working PowerShell reference script is in the docs.

## Sources
- Update an extension — https://learn.microsoft.com/en-us/microsoft-edge/extensions/update/update-extension
- Publish an extension — https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/publish-extension
- Submission states — https://learn.microsoft.com/en-us/microsoft-edge/extensions/publish/submission-states
- Port a Chrome extension — https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension
- Update REST API — https://learn.microsoft.com/en-us/microsoft-edge/extensions/update/api/using-addons-api
