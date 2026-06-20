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
- Merge when gates pass; keep persistent operational memory across sessions.

**Merge gate (default):** CI green (`npm test` — `tsc --noEmit` type-check, **then** Jest **and** Vitest; plus the required `e2e` check) **plus** a reviewer-subagent verdict on the PR. No flake exceptions until a specific chronic flake is documented in an issue with its exact signature.

**High-blast-radius changes — multi-lens adversarial review + founder sign-off before merge:**
- Auth / JWT (`src/JwtManager.ts`, OAuth/PKCE in `src/auth/`).
- Request-contract changes with saypi-api that *require the server (saypi-api/saypi-saas) to also change* (new/changed fields/headers the server must parse, origin/CORS, auth). Backward-compatible *adoption* of a contract the server already supports is normal-gate.
- MV2/MV3 manifest, permissions, or content-script injection scope (`wxt.config.ts`).

**Hard guardrails (defense-in-depth):**
- All changes via PR. Never push to `main`, force-push shared branches, or touch branches/issues/PRs that aren't yours.
- **Concurrent agents — isolate in `.worktrees/`.** Sibling Claude sessions work this repo at the same time (you may see live peers as sibling directories under the gitignored `.worktrees/`). Run every fix in its **own per-task git worktree under `.worktrees/`** — e.g. `git worktree add .worktrees/<task> -b <branch>` — never the shared `main` checkout and never an out-of-repo location (it must stay gitignored and discoverable to peers). Treat another agent's worktree, branch, and uncommitted files as off-limits: never edit, commit to, rebase, or `git worktree remove` them.
- Begin every commit/push command with `[ "$(git rev-parse --abbrev-ref HEAD)" = "<expected-branch>" ] || exit 1` in the same shell invocation. After `gh pr merge`, confirm `gh pr view --json state` is `MERGED`.
- Never hand-edit generated artifacts: `.output/`, `dist/`, `public/` build output, `.wxt/`. Fix the generator or env input instead.
- **Credentials (permanent boundary):** never read, copy, load, or echo `.env.production` or any secret; never run `npm run env:pull` against production. Copy only non-production env files into worktrees; never commit them.
- Gate-weakening (removing/skipping/`.only` tests, relaxing CI triggers/required checks) and any edit to manifest generation, permissions, signing, or store-submission plumbing require founder sign-off.

**Release is founder-only.** **Merging to `main` does NOT reach users.** Production artifacts come from `npm run build` / `build:firefox` and are submitted to the web stores (Chrome Web Store, Firefox AMO) by the founder — store-review-gated and effectively irreversible once users auto-update. Agents may run `npm run build*` *locally for verification only* and stage a release-ready changelog/checklist, but must **never** produce/submit a signed store artifact or load `.env.production` without explicit founder authorization. A bad release is higher, slower-to-reverse customer impact than a server deploy — treat it with more caution.

**Testability Investment (the heart of the mandate).** Real behavior lives in third-party DOMs across two browsers and two manifest versions, so full cross-browser E2E is the *last* mile, not the first. Build toward it in layers, each paying off immediately: (1) extract unit-testable core logic out of DOM/Chrome-API coupling (lean on the XState machines in `src/state-machines/`; `@xstate/test` is a dependency); (2) contract-test the `src/chatbots/` platform adapters with **recorded real-DOM fixtures**; (3) headless E2E against a *local mock* chat page wired into CI (WXT also ships `wxt/testing` `fakeBrowser` for this layer; this PR uses Playwright instead — see below); (4) reserve real-site E2E (Claude-in-Chrome) for periodic spot-checks, not a per-PR gate — **this layer is built** (PR #287): an owned `wxt dev` rig (`node scripts/dev-rig.mjs`) hot-reloads a manually-loaded dev extension so an agent can verify edits against real pi.ai/Claude/ChatGPT with no per-edit founder involvement. **Read `doc/autonomous-dev-loop.md` before verifying changes in a live browser** (autonomy model, setup order, the iterate-verify cycle, boundaries). Layer 3 (the headless mock-page harness — Playwright against a *local mock* Pi page + mock saypi-api, incl. fake-audio mic → real WASM-VAD → mock STT paths) is **built** (this PR): a development-mode static build is loaded into headless Chrome with real saypi hostnames redirected to local mock HTTPS servers, asserting both page decoration and a transcript landing in the prompt, wired into CI as a *required* check (promoted from advisory 2026-06-20). **Read `e2e/README.md` before running or extending the headless harness** (run order, architecture, the dual-env gotcha, fixture refresh, local-vs-CI risk split); design rationale is in `doc/specs/2026-06-14-layer3-headless-e2e-design.md`. The L3 follow-on tracked as **#313** is also **built**: `e2e/support/lifecycle.ts` drives the **MV3 service-worker recycle** (CDP `Target.closeTarget`) and **offscreen idle auto-shutdown** (a DEV-only SW hook) deterministically, turning the previously L1-mock-only #307 (idle-recycle false alarm) and #308 (auto-shutdown evicting live ports) bugs into real-browser regression nets (`e2e/specs/sw-recycle.e2e.ts`, `e2e/specs/offscreen-shutdown.e2e.ts`); design in `doc/specs/2026-06-16-issue-313-l3-sw-lifecycle-design.md`, lifecycle-driver notes in `e2e/README.md`. **The real-host loops are now agent-drivable without per-turn founder involvement** (2026-06-20): DEV-only in-extension hooks — `saypi:dev-feed-speech` (synthetic mic, no human speaking) and `saypi:dev-reload` (self-reload, no `chrome://extensions`) — make Layer 4 mostly hands-off; **Layer 4 (CDP)** (`npm run layer4cdp:verify`, `doc/layer4-cdp-real-host-loop.md`) is the robust real-host path: it spawns real Chrome directly + attaches over CDP, loading the extension AND passing Cloudflare **headed** for *every* real host — **pi.ai, claude.ai, chatgpt.com** (a visible window; headless is Cloudflare-walled on all of them). **Layer 3.5** (`npm run layer35:verify`, bundled Chromium) is Cloudflare-fragile against real hosts (the old "pi.ai is Cloudflare-free" note was wrong) — treat it as hermetic-mock-grade. **To drive a full voice turn with no mic on any host, START at `doc/synthetic-voice-turn.md`** (the `saypi:dev-feed-speech` / `saypi:dev-reload` primitive + per-layer how-to). **CLAUDE.md's "Choosing a test layer" guide is the canonical map (Layers 0/1–2/3/3.5/4/4-CDP); prove every change at the lowest layer that can, and reserve the real-host loops for confirmation.**

**Escalate to the founder only for:** product/UX taste calls (what/whether to build), credentials/resources you lack, **store releases**, contract changes that require the server side to change, gate-weakening or release-machinery edits, irreversible actions, or anything risking customer trust. Otherwise proceed. End every session with a handoff: shipped / in-flight / waiting-on-human / built-but-unreleased.

### Issue Authoring Standard
- **Problem:** one-sentence summary of what's wrong.
- **Scope:** which surfaces/flows are affected (and what's explicitly out of scope).
- **Reproduction / verification:** precise, deterministic steps; expected vs actual.
- **Acceptance criteria:** verifiable end states; avoid prescribing implementation.
- **Notes/Hypotheses (optional):** clearly labelled as non-binding.

Keep issues factual; exclude speculative root-cause or solution ideas from the body.

## Project Structure & Module Organization
- `entrypoints/` WXT entry layer. `background.ts`, `saypi.content.ts`, and `saypi-universal.content.ts` are thin shims that import logic from `src/`; `entrypoints/offscreen/` and `entrypoints/settings/` (a substantial multi-file UI) hold their own entry-specific code; `entrypoints/permissions/` is a permissions-request page.
- `src/` TypeScript/ESM source. Content-script bootstrapper: `src/saypi.index.js` (imported by `entrypoints/saypi.content.ts`); background/offscreen logic in `src/svc/` and `src/offscreen/`; shared settings styles/helpers in `src/popup/`; visuals in `src/styles/`; XState machines in `src/state-machines/`; chatbot integrations in `src/chatbots/`.
- `.output/` WXT build output (`.output/chrome-mv3/`, `.output/firefox-mv2/`) — generated, git-ignored, never hand-edited. `public/` holds static assets copied verbatim by WXT (ONNX/WASM/icons), not build artifacts.
- `test/` Tests mirror `src/` and `entrypoints/` (e.g. `test/settings/` ↔ `entrypoints/settings/`). Vitest: `*.spec.ts`; Jest: `*.test.js` only. Common setup in `test/vitest.setup.js` and `test/jest.setup.js`.
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
- Tests live beside feature folder under `test/` with matching names: `FeatureName.spec.ts` or `feature.test.js`.

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
- Vitest for TS unit tests (`*.spec.ts`); Jest for JS/DOM or legacy tests (`*.test.js`)
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
- `CLAUDE.md` — Detailed guide for Claude Code: build commands, architecture, testing patterns, and the canonical **"Choosing a test layer" decision guide** (Layers 0/1–2/3/3.5/4/4-CDP) — start here to pick the right harness.
- `.cursor/` — Cursor IDE rules in `rules/*.mdc` and MCP config in `mcp.json`. These guide agent behavior; no runtime effect.
- Precedence: follow this `AGENTS.md` and build scripts first; treat the agent-specific files as complementary guidance.

## Responding to Code Reviews
- When asked to reply to PR/code review comments, respond to every open/unresolved comment.
- Evaluate feedback critically; don’t assume the reviewer is always correct.
- If the issue is valid and warranted, address it with focused changes (code/tests/docs) and note the fix in your reply.
- If no change is needed, explain why succinctly (reasoning, tradeoffs, or prior context) and acknowledge the reviewer.
- Keep replies respectful, specific, and action‑oriented; link to files/lines (e.g., `src/file.ts:42`) when helpful.
