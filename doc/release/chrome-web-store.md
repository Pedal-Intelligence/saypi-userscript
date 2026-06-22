# Chrome Web Store — update submission

Item: **Say, Pi** · ID `glhhgglpalmjjkoiigojligncepccdei` · MV3.
Listing: https://chromewebstore.google.com/detail/say-pi/glhhgglpalmjjkoiigojligncepccdei
Facts current 2026-06-20; sources at the bottom.

## Update flow
1. Sign in to the **Developer Dashboard** (`https://chrome.google.com/webstore/devconsole`). **2-Step Verification is required** on the publishing account.
2. Open the **Say, Pi** item → **Package** tab → **Upload New Package** → `dist/saypi.chrome.zip`.
3. The new package's `manifest.json` `version` **must be larger** than the published one, or the upload is rejected.
4. (If listing copy changed) edit Store listing / Privacy practices / Distribution tabs.
5. **Submit for Review.** While in review, users stay on the current version.
6. Publish timing is a checkbox in the submit dialog: leave checked for **auto-publish on approval**, or uncheck to **defer** (then manually publish within 30 days or it reverts to draft).

## Per-version vs listing-level
- **Per-version:** only the package `.zip` + its `version`. That's the sole value that must change each time.
- **Listing-level (carry over unless edited):** name, summary, detailed description, icon, screenshots, promo tiles, category, URLs; the whole Privacy practices tab; Distribution (countries, visibility, rollout).
- **No "What's new" / changelog field exists.** Users never see a changelog here. Fold highlights into the detailed description if you want them visible; otherwise the version just ships.

## Declarations re-confirmed on submit (Privacy practices tab)
Canonical answers live in `doc/WEB_STORE_PERMISSIONS.md`. The tab is sticky but blocking if anything is missing/invalid:
- **Single purpose** (free text).
- **Per-permission justification** for each manifest permission (storage, cookies, offscreen, tabs, audio, contextMenus).
- **Host-permission justification** (`https://api.saypi.ai/*`, `https://www.saypi.ai/*`).
- **Remote code:** select **"No, I am not using remote code."** (MV3 forbids it; our build bundles everything — the onnxruntime `eval` is tree-shaken out.)
- **Data-usage disclosures** (which data types) + **certifications** (not sold; used only for the single purpose; no creditworthiness use).
- **Privacy policy URL:** https://saypi.ai/legal/privacy

## Package & limits
- `.zip` of the **contents** of `.output/chrome-mv3/` with `manifest.json` at the **root** (package-extension.sh does this).
- Version bump mandatory (see above). No practical ZIP-size limit for us (the AMO 5 MB non-binary limit is a *Firefox* constraint, not Chrome).
- Listing limits (only relevant if editing copy): **name ≤ 75**, **summary ≤ 132**, **detailed description ≤ ~16,000** (widely documented; verify on the live field). Screenshots 1280×800 (≥1), small promo tile 440×280, marquee 1400×560 (optional). Assets carry over on an update.

## Review timing
- **Often fast** — frequently within **a few hours to a day** (v1.11.0 published ~1–2h after submission, 2026-06). Occasionally **a few days to ~3 weeks** when broad host permissions / sensitive permissions trigger manual review. Variable; contact developer support if pending >3 weeks.
- Default **auto-publishes on approval** (unless you unchecked it).

## ⚠️ The dev console cannot be browser-automated
Chrome **blocks all extensions from scripting the extensions-gallery domain**
(`chrome.google.com/webstore/*`, incl. the dev console). Navigating Claude-in-Chrome there
returns *"The extensions gallery cannot be scripted."* — this is categorical, not a setup
issue. So the Chrome submission is **either manual (from the packet) or via the API below** —
there is no browser-driving path for Chrome (unlike Edge/AMO, whose dashboards aren't on the
gallery, though those are still gated by the native file-picker / 10 MB upload limit). The
package upload is also a native OS file-picker and the build is ~18 MB, so the upload step
isn't automatable from the browser on any store. Confirmed in the 1.11.0 wet run (2026-06-22).
**API is the only real automation path for Chrome — tracked in #412.**

## Publishing API (future automation phase)
- **V2 API** (`https://chromewebstore.googleapis.com`). **V1 sunsets 2026-10-15** — build on V2.
- **Auth:** OAuth2 — classic client id/secret + refresh token, or a V2 **service account**. Token at `https://oauth2.googleapis.com/token`. Scope `https://www.googleapis.com/auth/chromewebstore`. 2SV required on the account.
- **Endpoints:** `…/upload/v2/publishers/{PUBLISHER_ID}/items/{EXTENSION_ID}:upload` → `…/v2/publishers/{PUBLISHER_ID}/items/{EXTENSION_ID}:publish`; status via `:fetchStatus`; rollout via `:setPublishedDeployPercentage`.
- **Limits:** V2 cannot create items or change visibility (fine — Say, Pi exists). Confirm Google client-library availability when wiring it up.

## Sources
- Update your item — https://developer.chrome.com/docs/webstore/update
- Privacy fields — https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- Review process — https://developer.chrome.com/docs/webstore/review-process
- Listing requirements — https://developer.chrome.com/docs/webstore/program-policies/listing-requirements/
- Using the API / V2 — https://developer.chrome.com/docs/webstore/using-api · https://developer.chrome.com/blog/cws-api-v2
