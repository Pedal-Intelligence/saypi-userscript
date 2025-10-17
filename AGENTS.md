# Repository Guidelines

## Project Structure & Module Organization
- `src/` TypeScript/ESM source. Entry: `src/saypi.index.js`; background/offscreen in `src/svc/` and `src/offscreen/`; UI in `src/popup/`, visuals in `src/styles/`, chatbot integrations in `src/chatbots/`.
- `public/` Webpack output (e.g., `saypi.user.js`, `offscreen/*.js`, `permissions/*`). Do not edit generated files.
- `test/` Tests mirror `src/`. Vitest: `*.spec.ts`; Jest: `*.test.js`. Common setup in `test/vitest.setup.js` and `test/jest.setup.js`.
- `_locales/` i18n bundles; `scripts/` build helpers; `doc/` reference; `manifest.json` extension metadata.

## Build, Test, and Development Commands
- `npm run dev` — WXT dev server for Chrome/Edge (MV3) with live reload; runs `predev` first.
- `npm run dev:firefox` — Launches WXT’s Firefox MV2 dev session in a temporary private profile (`wxt --browser firefox --mv2`).
- `npm start` — Serves `public/` at `http://localhost:8080` (HTTPS if `CERT_DIR` is set).
- `npm run build` — Production build (validates i18n, copies ONNX/VAD assets).
- `npm test` — Runs Jest and Vitest. Use `npm run test:vitest:watch` for watch mode.
- `npm run build:firefox` — Build + package for Firefox. Utilities: `npm run copy-onnx`, `npm run translate`, `npm run translate:check`.
- `npm run validate:env` — Check `.env` and `.env.production` for required values (runs automatically before dev/build).

## Coding Style & Naming Conventions
- TypeScript preferred; ES modules only. Strict TS per `tsconfig.json`.
- Indentation: 2 spaces; keep files lint‑clean (ESLint 9 is available; use your editor integration).
- File names: PascalCase for classes/modules (e.g., `TranscriptionModule.ts`), `*Service.ts` for services, state machines in `src/state-machines/`.
- Tests live beside feature folder under `test/` with matching names: `FeatureName.spec.ts` or `feature.test.js`.

## Testing Guidelines
- Vitest for TS unit tests (`*.spec.ts`); Jest for JS/DOM or legacy tests (`*.test.js`).
- JSDOM is the default env; Chrome APIs are mocked in `test/jest.setup.js` — don’t rely on real browser globals.
- Add/adjust tests with code changes; keep fast, isolated tests.

## Commit & Pull Request Guidelines
- Project is proprietary; external PRs aren’t accepted. Internal changes only.
- Commits: short, imperative subject; include scope when helpful (e.g., `audio: improve cleanup`); reference issues `#123`.
- PRs: clear description, linked issues, screenshots/GIFs for UI, passing tests, and updated docs/i18n when applicable.

## Security & Configuration Tips
- Never commit secrets. Create local `.env` / `.env.production` from the templates (`.env.example`, `.env.production.example`) and fill in values such as `API_SERVER_URL`, `AUTH_SERVER_URL`.
- `webpack` generates `src/popup/popup-config.js` from env — don’t edit it manually.
- For HTTPS dev, set `CERT_DIR` with `localhost.pem` and `localhost-key.pem`.

## Assistant/Agent Docs
- `CLAUDE.md` — Detailed guide for Claude Code: build commands, architecture, testing patterns.
- `.cursor/` — Cursor IDE rules in `rules/*.mdc` and MCP config in `mcp.json` (Task Master server). These guide agent behavior; no runtime effect.
- `.windsurfrules` — Windsurf agent rules for task-driven dev workflow (Task Master CLI usage).
- `.roo/` and `.roomodes` — Roo agent rules and mode definitions (boomerang/architect/debug/test). Use for delegation and task orchestration.
- `.taskmasterconfig` — Task Master model and defaults. Pairs with rules above for planning/expansion.
- Precedence: follow this `AGENTS.md` and build scripts first; treat the agent-specific files as complementary guidance.

## Responding to Code Reviews
- When asked to reply to PR/code review comments, respond to every open/unresolved comment.
- Evaluate feedback critically; don’t assume the reviewer is always correct.
- If the issue is valid and warranted, address it with focused changes (code/tests/docs) and note the fix in your reply.
- If no change is needed, explain why succinctly (reasoning, tradeoffs, or prior context) and acknowledge the reviewer.
- Keep replies respectful, specific, and action‑oriented; link to files/lines (e.g., `src/file.ts:42`) when helpful.
