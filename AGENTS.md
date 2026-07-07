# Repository Guidelines

## Autonomous Engineering Mandate

Since 2026-06-13, saypi-userscript is maintained as an **autonomously engineered product**: Claude Code agents run the full engineering loop under standing authorization from the founder (Ross Cadogan), the same operating model proven on saypi-api and saypi-saas. This section is the constitution for those sessions; the original bootstrap brief is `doc/autonomous-bootstrap.md`. It **complements** — does not replace — the Testing, Commit/PR, and Code-Review rules below.

**Purpose.** Keep the extension improving for its users at founder-level quality and attention to detail — this repo *is* the product the customer touches. Velocity comes from tooling and discipline, never from lowering the bar; here the tooling that must be built first is the **testability net** (see Testability Investment).

**Standing authorization (proceed without asking):**
- Explore the codebase; bring `AGENTS.md`/`CLAUDE.md` to verified reality; remove dead cruft coherently.
- Build the testability layers and their CI wiring — *additive* test/CI changes are explicitly yours to make.
- Triage the backlog with adversarially-verified evidence; file issues per the Issue Authoring Standard.
- Fix issues via fail-first TDD (see Testing Guidelines) in **isolated git worktrees** under `.worktrees/` (see Hard guardrails — sibling agents run concurrently); open small, blast-radius-scoped PRs with full provenance (narrative why/what/verification, `Fixes #N`, Claude Code attribution).
- Review every PR with independent subagent reviewers before merge (multi-lens for the high-blast-radius domains below). GitHub disallows self-approval, so post verdicts as PR comments.
- **Merge your own PRs as soon as the full merge gate passes** — squash + delete branch, no per-PR go-ahead (granted 2026-06-14). "Gate passes" means *both* halves below (CI green **and** a reviewer verdict); high-blast-radius PRs additionally wait for founder sign-off.
- **Close issues at your own discretion** once the deliverable is verified done — prefer tidying up over leaving things open on non-blocking follow-ups; when unsure, close with a summary (granted 2026-06-30).
- **Use the founder's browser** (Claude-in-Chrome MCP / the Layer-4 CDP real-Chrome loops) for verification, testing, and development without per-use permission (granted 2026-06-30). The grant covers verify/test/dev — not outward publishing; store releases stay founder-gated.
- Keep persistent operational memory across sessions. **Durable founder grants belong here, not only in one machine's memory:** when the founder issues a new standing authorization, codify it in this file via PR (with the grant date) so it survives machine and session boundaries — the pattern that installed this constitution.

**Merge gate (default):** CI green (`npm test` — `tsc --noEmit` type-check, **then** Jest **and** Vitest; plus the required `e2e` check) **plus** a reviewer-subagent verdict on the PR. No flake exceptions until a specific chronic flake is documented in an issue with its exact signature.

**High-blast-radius changes — multi-lens adversarial review + founder sign-off before merge:**
- Auth / JWT (`src/JwtManager.ts`, OAuth/PKCE in `src/auth/`).
- Request-contract changes with saypi-api that *require the server (saypi-api/saypi-saas) to also change* (new/changed fields/headers the server must parse, origin/CORS, auth). Backward-compatible *adoption* of a contract the server already supports is normal-gate.
- MV2/MV3 manifest, permissions, or content-script injection scope (`wxt.config.ts`, and the `matches`-bearing shims `entrypoints/saypi.content.ts` / `entrypoints/saypi-universal.content.ts`).

This rule has a mechanical half: the **`path-guard` CI check** (`.github/workflows/path-guard.yaml` + `scripts/path-guard-lib.mjs`) fails any PR touching a founder-gated path — auth/JWT, `wxt.config.ts` plus the two content-script entrypoints that carry the injection-scope `matches` arrays (`entrypoints/saypi.content.ts`, `entrypoints/saypi-universal.content.ts`), release machinery, `.github/workflows/`, and the guard itself — unless the PR carries the **`founder-approved` label, which is applied only on actual founder instruction** (issue #530). Honest limitation: agents operate under the founder's GitHub account, so the label is a ritual guarding against a *forgetful or confused* session, not impersonation. The check starts **advisory**; promoting it to a required branch-protection check is itself a gate change requiring founder sign-off.

Beyond this founder-gated set, **`doc/codebase-caution-map.md`** maps the wider *quiet-and-costly* zone — changes that pass CI but break a real host, one browser, billing/speech-cache hashing, or an i18n key across 31 locales — with a verified "looks-mechanical-is-a-trap" catalog and a re-derivation rubric. Consult it (and give those diffs a second adversarial lens) when a change lands in that zone.

**Hard guardrails (defense-in-depth):**
- All changes via PR. Never push to `main`, force-push shared branches, or touch branches/issues/PRs that aren't yours.
- **Concurrent agents — isolate in `.worktrees/`.** Sibling Claude sessions work this repo at the same time (you may see live peers as sibling directories under the gitignored `.worktrees/`). Run every fix in its **own per-task git worktree under `.worktrees/`** — e.g. `git worktree add .worktrees/<task> -b <branch>` — never the shared `main` checkout and never an out-of-repo location (it must stay gitignored and discoverable to peers). Treat another agent's worktree, branch, and uncommitted files as off-limits: never edit, commit to, rebase, or `git worktree remove` them.
- **Claim an issue before working it.** Worktrees prevent file collisions but not duplicated effort: before starting on an issue, check it for a recent claim comment or a linked open PR — those mark it as a sibling's. If it's free, comment that you're taking it (mention your branch name) so peers skip it. A claim with no visible progress (no branch, PR, or follow-up comment) after ~24 h may be treated as abandoned — say so in a comment when taking over.
- Begin every commit/push command with `[ "$(git rev-parse --abbrev-ref HEAD)" = "<expected-branch>" ] || exit 1` in the same shell invocation. After `gh pr merge`, confirm `gh pr view --json state` is `MERGED`.
- Never hand-edit generated artifacts: `.output/`, `dist/`, `public/` build output, `.wxt/`. Fix the generator or env input instead.
- **Credentials (permanent boundary):** never read, copy, load, or echo `.env.production` or any secret; never run `npm run env:pull` against production. Copy only non-production env files into worktrees; never commit them.
- Gate-weakening (removing/skipping/`.only` tests, relaxing CI triggers/required checks) and any edit to manifest generation, permissions, signing, or store-submission plumbing require founder sign-off.

**Release is founder-only.** **Merging to `main` does NOT reach users.** Production artifacts come from `npm run build` / `build:firefox` and are submitted to the web stores (Chrome Web Store, Firefox AMO) by the founder — store-review-gated and effectively irreversible once users auto-update. Agents may run `npm run build*` *locally for verification only* and stage a release-ready changelog/checklist, but must **never** produce/submit a signed store artifact or load `.env.production` without explicit founder authorization. A bad release is higher, slower-to-reverse customer impact than a server deploy — treat it with more caution. **The how-to is `doc/release/README.md`** (the `release-extension` runbook / `scripts/release.mjs`): agents run the read-only steps (`release:plan` → version + changelog digest; `release:packet` → the submission packet) and draft the brand-voice notes; the founder runs the gated `bump`/`build`/`tag`/`finalize`/`submit`. This is a *trust* gate the founder may choose to relax with evidence of harness maturity (propose, don't assume); the credentials boundary above is **permanent** — a security boundary, not a trust gate. **Staged relaxation is GRANTED (founder, 2026-07-07 — PR #538 "All stages approved"): `doc/release/delegation-criteria.md` is in force.** Stage 1 (automated release-candidate prep, read-only) is authorized now; Stages 2–3 (one-click pipeline; patch-scope dispatch with a 24h veto) activate **only when their written evidence bars are met** — the bars are the grant, and every stage keeps the credentials boundary intact (secrets move to environment-scoped CI storage the agent structurally cannot read; check promotions tracked in #554). **If a bad version has already reached users, the runbook is `doc/release/incident-response.md`** (characterize → server-side kill-switch first → expedited patch; agents prepare, the founder submits). That kill-switch must already exist when it is needed: `doc/release/kill-switch-policy.md` defines which changes must ship behind a server-side flag before store release, enforced by the submission packet's kill-switch-coverage check.

**Testability Investment (the heart of the mandate).** Real behavior lives in third-party DOMs across two browsers and two manifest versions, so full cross-browser E2E is the *last* mile, not the first. The strategy is layered: (1) extract unit-testable core logic out of DOM/Chrome-API coupling (lean on the **XState v5** machines in `src/state-machines/` — drive specs through the `createTestActor` seam, conventions in [`src/state-machines/README.md`](src/state-machines/README.md); `@xstate/graph` model-based path testing is tracked in #404); (2) contract-test the `src/chatbots/` platform adapters with **recorded real-DOM fixtures**; (3) headless E2E against a *local mock* chat page wired into CI; (4) reserve real-site E2E for periodic spot-checks, not a per-PR gate. **CLAUDE.md's "Choosing a test layer" guide is the canonical map (Layers 0/1–2/3/3.5/4/4-CDP): prove every change at the lowest layer that can, and reserve the real-host loops for confirmation.** State of the built layers:

- **Layer 3 (headless E2E) — built; a *required* CI check** (promoted from advisory 2026-06-20). Playwright loads a development-mode static build into headless Chrome, redirects real saypi hostnames to local mock HTTPS servers (mock Pi page + mock saypi-api), and drives the fake-audio mic → real WASM-VAD → mock STT path to a transcript in the prompt. It also covers the MV3 lifecycle deterministically (#313): forced service-worker recycle (CDP `Target.closeTarget`) and offscreen idle shutdown (a DEV-only SW hook) — real-browser regression nets for #307/#308 (`e2e/specs/sw-recycle.e2e.ts`, `e2e/specs/offscreen-shutdown.e2e.ts`, driver in `e2e/support/lifecycle.ts`). **Read `e2e/README.md` before running or extending it** (run order, architecture, the dual-env gotcha, fixture refresh, local-vs-CI risk split); design rationale in `doc/specs/2026-06-14-layer3-headless-e2e-design.md` and `doc/specs/2026-06-16-issue-313-l3-sw-lifecycle-design.md`.
- **Layer 4 (real-host loops) — built; agent-drivable without per-turn founder involvement** (since 2026-06-20) via the DEV-only in-extension hooks `saypi:dev-feed-speech` (synthetic mic, no human speaking) and `saypi:dev-reload` (self-reload, no `chrome://extensions`). Two forms: the MCP dev rig (PR #287 — `node scripts/dev-rig.mjs` hot-reloads a manually-loaded dev extension; **read `doc/autonomous-dev-loop.md` before verifying in a live browser**), and **Layer 4 (CDP)** (`npm run layer4cdp:verify`, `doc/layer4-cdp-real-host-loop.md`) — the robust real-host path: it spawns real Chrome directly + attaches over CDP, loading the extension AND passing Cloudflare **headed** for *every* real host — **pi.ai, claude.ai, chatgpt.com** (a visible window; headless is Cloudflare-walled on all of them).
- **Layer 3.5** (`npm run layer35:verify`, bundled Chromium) is Cloudflare-fragile against real hosts (the old "pi.ai is Cloudflare-free" note was wrong) — treat it as hermetic-mock-grade.
- **To drive a full voice turn with no mic on any host, START at `doc/synthetic-voice-turn.md`** (the `saypi:dev-feed-speech` / `saypi:dev-reload` primitive + per-layer how-to).
- **Real-host runs spend real resources.** A Layer-4 verify/sweep turn sends a real message from the founder's accounts (host plan quota, SayPi STT/TTS credits) and leaves a real conversation behind. Run them on-demand with a purpose — never in an unattended loop or cron — and one CDP run at a time (all the CDP harnesses share one seeded profile; there is no lock). Runs are **ledgered and capped** (#533): every `layer4cdp verify` / sweep records to the gitignored `.l4-ledger.json` and refuses past the caps — PROPOSED defaults pending founder confirmation: **6 runs / 12h session, 25 / 7-day week**, founder-adjustable via `SAYPI_L4_CAP_SESSION` / `SAYPI_L4_CAP_WEEK` or the ledger's `caps` block; `SAYPI_L4_CAP_OVERRIDE=1` bypasses a refusal and is **founder-authorized use only**. Details per harness: `doc/e2e-host-sweep.md`, `doc/e2e-dictation-sweep.md`.

**Escalate to the founder only for:** product/UX taste calls (what/whether to build), credentials/resources you lack, **store releases**, contract changes that require the server side to change, gate-weakening or release-machinery edits, irreversible actions, or anything risking customer trust. Otherwise proceed. Escalate **immediately — not in the handoff —** anything that looks like a live user-facing failure of a *shipped* version (see `doc/release/incident-response.md`); everything else batches. End every session with a handoff: shipped / in-flight / waiting-on-human / built-but-unreleased, plus a real-host-spend note (runs performed + purpose — `node scripts/l4-ledger.mjs report` prints it).

**Founder-attention marker (`awaiting-founder`).** Anything blocked on a founder decision or sign-off — a high-blast-radius PR awaiting approval, a governance proposal awaiting a verdict — must carry the **`awaiting-founder` label** (works on issues and PRs alike). Applying it fires `.github/workflows/awaiting-founder-notify.yaml`, which @-mentions the founder so a GitHub notification lands; state *what is being asked* in a comment when you apply it, and remove the label once the founder has decided. Standing queue (check it rather than assuming nothing waits): `gh issue list -R Pedal-Intelligence/saypi-userscript --label awaiting-founder` and `gh pr list -R Pedal-Intelligence/saypi-userscript --label awaiting-founder`, or [the label view](https://github.com/Pedal-Intelligence/saypi-userscript/issues?q=is%3Aopen+label%3Aawaiting-founder).

### Issue Authoring Standard
- **Problem:** one-sentence summary of what's wrong.
- **Scope:** which surfaces/flows are affected (and what's explicitly out of scope).
- **Reproduction / verification:** precise, deterministic steps; expected vs actual.
- **Acceptance criteria:** verifiable end states; avoid prescribing implementation.
- **Notes/Hypotheses (optional):** clearly labelled as non-binding.

Keep issues factual; exclude speculative root-cause or solution ideas from the body.

### Delivery principles (operating lessons)

Distilled from completed initiatives; generalisable, and complementary to the rules above.

- **Decompose epics into thin, independently-shippable slices.** One coherent change per worktree/PR. Ship the highest-value, lowest-risk, least-dependency slice first and land it before starting the next. Don't let a blocked sub-task stall the unblocked ones — flag the blocker (issue/comment) and keep delivering around it. A reviewable multi-PR sequence beats one mega-PR.
- **TDD applies to features, not only bug fixes.** Extract the pure core — formula, gate, classifier, payload/serializer, decision logic — into a dependency-injected module and unit-test it hermetically; keep the imperative integration (Web Audio, `getUserMedia`, `fetch`, DOM injection, schedulers) thin and inject its dependencies (storage, `callApi`, a scheduler/clock, an `acquire()` for the audio graph) so lifecycle and error paths are testable without the real environment. Reserve Layer 3/4 for the irreducibly-real seam. Ground first (Explore the existing seams + conventions) so a change fits rather than reinvents.
- **Don't implement an external/cross-repo contract that is wrong or unsafe for your side — verify, then propose the secure alternative.** Before adopting a contract, `grep` your own code to confirm its assumptions about you (auth model, existing endpoints, identifiers). A browser extension is an untrusted client: never ship a shared secret / API key in the bundle (it is extractable and forgeable) — prefer per-user auth the client already holds (the JWT), with identity derived server-side. Raise security/architecture mismatches as a coordination question rather than coding around them.
- **Attribute every new failure or warning to your change; fix the root cause.** If a previously-clean signal appears — a failing test, an "N errors" line, an unhandled rejection, a new console warning — build a throwaway worktree off `origin/main` and diff before dismissing it as pre-existing. If you introduced it, fix the cause (e.g. the missing `.catch` on a fire-and-forget init promise), not the symptom. **Avoid import-time side effects:** never trigger singleton construction or async init at module top-level — make such access lazy/call-time, or it fires in unrelated tests.
- **Reuse and collapse, don't accrete.** Reach for the existing primitive (a notice lifecycle, an error classifier, a preference) before adding a parallel one. When a change removes the constraint that shaped nearby code (a value now computed at call-time, a field now always present), delete the vestigial structure — finishing the refactor, not scope creep.
- **Close the loop, then close the ticket.** "Done" means verified: full suite green before merge, plus a live or contract check after merge when an integration crosses a boundary you don't control (a curl probe of the deployed endpoint, an authenticated round-trip in the browser, a real-host spot-check). Then tidy up — record the evidence and close the issue rather than leaving it open on a non-blocking follow-up.

## Project Structure & Module Organization
- `entrypoints/` WXT entry layer. `background.ts`, `saypi.content.ts`, and `saypi-universal.content.ts` are thin shims that import logic from `src/`; `entrypoints/offscreen/` and `entrypoints/settings/` (a substantial multi-file UI) hold their own entry-specific code; `entrypoints/permissions/` is a permissions-request page.
- `src/` TypeScript/ESM source. Content-script bootstrapper: `src/saypi.index.js` (imported by `entrypoints/saypi.content.ts`); background/offscreen logic in `src/svc/` and `src/offscreen/`; shared settings/popup styles/helpers in `src/popup/` (the settings tabs themselves are light-DOM Preact `*Panel.tsx` under `entrypoints/settings/`); the Preact UI primitive + mount registry in `src/ui/preact/`; brand tokens in `src/styles/tokens.scss`; visuals in `src/styles/`; XState machines in `src/state-machines/`; chatbot integrations in `src/chatbots/`.
- `.output/` WXT build output (`.output/chrome-mv3/`, `.output/firefox-mv2/`) — generated, git-ignored, never hand-edited. `public/` holds static assets copied verbatim by WXT (ONNX/WASM/icons), not build artifacts.
- `test/` Tests mirror `src/` and `entrypoints/` (e.g. `test/settings/` ↔ `entrypoints/settings/`). Vitest: `*.spec.ts` (and `*.spec.tsx` for Preact components); Jest: `*.test.js` only. Common setup in `test/vitest.setup.js` and `test/jest.setup.js`.
- `_locales/` i18n bundles; `scripts/` build helpers; `doc/` reference. The manifest is generated by WXT from `wxt.config.ts` (the root `manifest.json` is legacy/unused by the WXT build).

## Build, Test, and Development Commands
- `npm run dev` — WXT dev server for Chrome/Edge (MV3) with live reload; runs `predev` first.
- `npm run dev:firefox` — Launches WXT’s Firefox MV2 dev session in a temporary private profile (`wxt --browser firefox --mv2`).
- `npm start` — Serves `public/` at `http://localhost:8080` (HTTPS if `CERT_DIR` is set).
- `npm run build` — Production build (validates i18n, copies ONNX/VAD assets).
- `npm test` — Type-checks (`tsc --noEmit`), then runs Jest and Vitest. `npm run typecheck` type-checks only (needs the generated `.wxt/`). Use `npm run test:vitest:watch` for watch mode.
- `npm run build:firefox` — Build + package for Firefox. Utilities: `npm run copy-onnx`, `npm run translate`, `npm run translate:check`.
- `npm run validate:env` — Check `.env` and `.env.production` for required values (runs automatically before dev/build).

## Coding Style & Naming Conventions
- TypeScript preferred; ES modules only. Strict TS per `tsconfig.json`.
- Indentation: 2 spaces; keep files lint‑clean (ESLint 9 is available; use your editor integration).
- File names: PascalCase for classes/modules (e.g., `TranscriptionModule.ts`), `*Service.ts` for services, state machines in `src/state-machines/`.
- Tests live beside feature folder under `test/` with matching names: `FeatureName.spec.ts` (or `FeatureName.spec.tsx` for Preact components) or `feature.test.js`.

## Testing Guidelines

### Test-Driven Development (TDD) Requirements

**Fail-First TDD Protocol (MANDATORY for bug fixes)**
When fixing bugs, follow this strict protocol:

1. **Reproduce**: Add a failing test that captures the incorrect behavior
2. **Prove failure**: Run the test and confirm it fails for the expected reason
3. **Implement**: Apply the smallest, safest change that satisfies the test
4. **Verify**: Ensure the new test passes and related tests still pass
5. **Document**: Update relevant docs and include rationale in PR description

**Writing Tests**
- **Mock External APIs**: Use Jest/Vitest mocks for Chrome extension APIs
- **Async Tests**: Use `async/await` for async test functions
- **Test Isolation**: Each test should be independent
- **Fixtures**: Use setup/teardown for common test configuration
- **Fail-First**: Write the test BEFORE the fix to capture the bug

**Test Framework & Commands**
- Vitest for TS unit tests (`*.spec.ts`, and `*.spec.tsx` for Preact components); Jest for JS/DOM or legacy tests (`*.test.js`)
- JSDOM is the default env; Chrome APIs are mocked in `test/jest.setup.js` — don't rely on real browser globals
- Add/adjust tests with code changes; keep fast, isolated tests
- Run `npm test` for all tests, `npm run test:vitest:watch` for development

**Extension-Specific Testing**
- Mock Web Audio API for audio input/output testing
- Test VAD (Voice Activity Detection) with mock audio streams
- Use JSDOM for DOM querying and chatbot integration testing
- Test XState state machine transitions and state persistence
- Verify cross-browser compatibility (Firefox vs Chrome, MV2 vs MV3)

## Commit & Pull Request Guidelines
- Project is proprietary; external PRs aren’t accepted. Internal changes only.
- Commits: short, imperative subject; include scope when helpful (e.g., `audio: improve cleanup`); reference issues `#123`.
- PRs: clear description, linked issues, screenshots/GIFs for UI, passing tests, and updated docs/i18n when applicable.

## Security & Configuration Tips
- Never commit secrets. Create local `.env` / `.env.production` from the templates (`.env.example`, `.env.production.example`) and fill in values such as `API_SERVER_URL`, `AUTH_SERVER_URL`. (A 1Password flow exists via `npm run env:pull`; never run it against production.)
- Env values reach the bundle via WXT/`import.meta.env`, validated by `scripts/validate-env.js` (run automatically before dev/build). There is no generated `popup-config.js`.
- For HTTPS dev, set `CERT_DIR` with `localhost.pem` and `localhost-key.pem`.

## Assistant/Agent Docs
- `doc/autonomous-dev-loop.md` — How to run the **Layer 4 real-site dev-verify loop** (`scripts/dev-rig.mjs` + Claude-in-Chrome): autonomy model, setup order, the iterate-verify cycle, the DOM-capture recorder, and boundaries. Read before verifying changes in a live browser.
- `e2e/README.md` — How to run the **Layer 3 headless E2E harness** (`npm run e2e:build && npm run test:e2e`): the build → host-resolver redirect → mock-server → fake-audio architecture, the dual-env gotcha, refreshing the WAV fixture and STT contract, the local-vs-CI risk split, and the required-check posture. Read before running or extending the headless harness.
- **`doc/synthetic-voice-turn.md` — START HERE to drive a full voice turn (VAD → STT → transcript) with no mic on any host.** The `saypi:dev-feed-speech` / `saypi:dev-reload` primitive + the per-layer how-to (Layer 3 hermetic, Layer 4 CDP one-command real host, Layer 4 MCP interactive).
- `doc/layer35-real-host-loop.md` — How to run **Layer 3.5** (`npm run layer35:verify`, bundled Chromium). ⚠️ Cloudflare-fragile against real hosts (pi.ai included serves "Just a moment…" headless) — hermetic-mock-grade; for real-host turns use Layer 4 (CDP).
- `doc/layer4-cdp-real-host-loop.md` — How to run **Layer 4 (CDP)** (`npm run layer4cdp:verify`): an agent-launched real-Chrome-over-CDP loop — the robust real-host path for **pi.ai, claude.ai, chatgpt.com**. Verified working **headed** (visible window, agent-driven per run; headless is Cloudflare-blocked) after a one-time profile setup (`layer4cdp:seed` + Developer-mode/Load-unpacked); `layer4cdp:diagnose` confirms usability.
- `doc/e2e-host-sweep.md` — How to run the **periodic E2E host sweep** (`npm run e2e-host-sweep`): drives a synthetic voice turn on all three hosts over Layer-4 CDP and captures rich evidence (every console message, network failures, per-host selector diagnostics, auth/voice state, screenshots) for a defect hunt — the thorough counterpart to `layer4cdp verify`. Includes the analysis discipline (screenshot-corroborate, attribute-to-SayPi-only, dedup, honest per-host reporting) and the one-time authed+voice-on seed. Backs the local `/e2e-host-sweep` skill.
- `doc/e2e-dictation-sweep.md` — How to run the **E2E dictation sweep** (`npm run e2e-dictation-sweep`): drives a synthetic universal-dictation turn into the local test fixture (plain input/textarea/contenteditable), Mistral's Le Chat (real, login-free, ProseMirror composer — confirmed-working per issue #163), and Grok on x.com (real, requires a one-time manual X sign-in in the seeded profile — not a SayPi chat host, so generic universal dictation only) over the same Layer-4 CDP harness, checking that the transcript lands in the field. No chat concepts (no model/voice select, no TTS, no conversation thread) — activation is the per-field `.saypi-dictation-button`, not `#saypi-callButton`. Backs the local `/e2e-dictation-sweep` skill. The local `/sweep` skill runs this alongside `/e2e-host-sweep` in one combined pass.
- **`doc/release/README.md` — START HERE to cut / ship / publish a release to the web stores** (Chrome Web Store, Edge Add-ons, Firefox AMO). The `release-extension` runbook + `scripts/release.mjs` (npm `release:*` aliases): preflight → **derive the version** (published baseline + payload, never assume package.json) → bump → build (clears stale output + **self-verifies** the artifacts) → draft the changelog in brand voice → generate a per-store **submission packet** → tag/finalize. Founder-only and gated; the heavy step is manual-from-the-packet, OR headless via each store's **publishing API** (`release:submit`, `doc/release/publishing-credentials.md`). Browser-driving the Chrome dev console is impossible (extensions-gallery block) — the API is the only automation path. (The `/release-extension` skill is a local pointer to this doc.)
- `doc/release/incident-response.md` — **What to do when a bad version has already reached users** (stores have no rollback): characterize blast radius → server-side kill-switch/flag via saypi-api first → expedited patch through the normal gates → unpublish only as a founder-decided last resort. Escalate a live incident to the founder immediately, not in the session handoff.
- `doc/codebase-caution-map.md` — **How much care does a change deserve?** The quiet-and-costly rubric + re-derivation procedure for allocating reasoning effort, review depth, model tier, and real-host verification; a verified "looks-mechanical-is-a-trap" catalog grouped by the four fragility lines (host-DOM drift, cross-context wiring, cross-browser/manifest, irreversible release); mid-task escalation triggers; and a dated subsystem-risk snapshot + refactor-candidates list. Read before a change in the reserve zone, and for the second adversarial lens on high-blast-radius diffs.
- `CLAUDE.md` — Detailed guide for Claude Code: build commands, architecture, testing patterns, and the canonical **"Choosing a test layer" decision guide** (Layers 0/1–2/3/3.5/4/4-CDP) — start here to pick the right harness.
- **`doc/preact-component-conventions.md` — Read before touching any UI.** The Preact UI component layer: author `.tsx` with esbuild's automatic JSX runtime; mount owned UI via the `mountInto`/`unmountFrom` registry (`src/ui/preact/mount.ts`) — with the raw-`render` carve-out for injected notices; light-DOM only (no Shadow DOM); the **host-specific** Tailwind-class rule; and step-by-step recipes for adding a settings tab or an injected notice. SayPi-owned chrome is Preact; host-injected widgets stay imperative (extract pure logic — see `src/buttons/callButtonGeometry.ts`).
- `.cursor/` — Cursor IDE rules in `rules/*.mdc` (written May–Oct 2025) and MCP config in `mcp.json`. ⚠️ `build_process.mdc` and `vad_model_loading.mdc` predate the WXT migration and still describe the Webpack-era build (`webpack.config.js`, a hand-maintained `manifest.json`) — don't trust their build/manifest claims; this file and `CLAUDE.md` supersede them. The other rules are broadly current. No runtime effect.
- Precedence: follow this `AGENTS.md` and build scripts first; treat the agent-specific files as complementary guidance. Tracked repo docs also outrank an agent's private session memory — memory is a point-in-time observation, so when a memory note contradicts a tracked doc, re-verify against reality and correct whichever is wrong (usually the memory) instead of silently obeying either.

## Responding to Code Reviews
- When asked to reply to PR/code review comments, respond to every open/unresolved comment.
- Evaluate feedback critically; don’t assume the reviewer is always correct.
- If the issue is valid and warranted, address it with focused changes (code/tests/docs) and note the fix in your reply.
- If no change is needed, explain why succinctly (reasoning, tradeoffs, or prior context) and acknowledge the reviewer.
- Keep replies respectful, specific, and action‑oriented; link to files/lines (e.g., `src/file.ts:42`) when helpful.
