# Preact UI Component Layer — Design

**Date:** 2026-06-20
**Status:** Approved (design); implementation staged across PRs
**Author:** Autonomous engineering session (Claude)

> **⚠️ POST-IMPLEMENTATION STATUS (2026-06-20): read this as design rationale, not a record of what shipped.** PR1–PR4g shipped (Preact foundation + mount registry, tokens, `<Notice>`, all four settings tabs + header, auth prompts, Tailwind retirement). **The CallButton + voice-menu Preact rewrite and XState→props bridge (the design's PR5/PR6) were DEFERRED** — the founder chose to keep those widgets imperative for now (full rewrite = "Path A", revisited later). Their stated justifications were instead met imperatively: pure geometry extraction (`src/buttons/callButtonGeometry.ts`, #385) and a structural capability guard (`src/tts/VoiceMenu.ts`, #386). Other drift from this doc: the toolchain shipped as **esbuild's automatic JSX runtime, not `@preact/preset-vite` (Babel)**; the shared helper is **`findNoticeInjectionPoint`** (find-only), not `injectNotice(host, vnode)`; the notices render raw into a detached host rather than through the registry; and `AuthPromptUI` was **not** refactored to compose `<Notice>`. **The current, accurate conventions live in [`doc/preact-component-conventions.md`](../preact-component-conventions.md).**

## Why

The extension's UI is built entirely by imperative DOM mutation — **0 `.tsx/.jsx`
files, no UI framework dependency, ~211 `document.createElement` sites in `src/`,
45 `innerHTML` injections, 35 raw-SVG `?raw` imports**, spread across singleton
classes that own and mutate their own DOM subtree. This is the codebase's single
largest maintainability and testability tax. Concretely:

- The "notice/banner" widget skeleton is **logically byte-identical** across three
  modules — `src/ui/AgentModeNoticeModule.ts`, `src/compat/CompatibilityNotificationUI.ts`,
  and `src/auth/AuthPromptUI.ts` — including the `findInjectionPoint` host-selector
  fallback chain, which has **already silently diverged in comments** between copies.
- Widget tests are forced into brittle hacks: `test/buttons/CallButton-arc-rebuild.spec.ts`
  does `Object.create(CallButton.prototype)` + hand-assigns nine private fields;
  `test/tts/VoiceMenu.spec.ts` runs `vi.mock("Pi")` purely to break an import cycle.
- Bug #203 is the textbook hand-rolled-rerender failure: a re-render tore down and
  rebuilt the call-button SVG, destroying the live `#progress-ring` countdown; the
  fix was a hand-written "skip rebuild if same state" guard.
- There is **no design-token layer** (raw hex/rgb literals duplicated across ~20
  flat SCSS files) and **no visual-regression testing anywhere**.
- The settings page imports a **2.9 MB vendored Tailwind v2 dump**
  (`src/popup/tailwind.min.css`, the single largest non-binary asset against
  Firefox AMO's 5 MB limit) for a surface that already ships its own per-tab CSS.

This refactor is justified **on maintainability and testability grounds alone**,
independent of any design tool. As a deliberate downstream bonus, it also leaves
the door open to a future Claude Design sync of the SayPi-owned chrome (see
`doc/specs/` sibling note / project memory `claude-design-fit-evaluation`): Preact
components are compilable, syncable artifacts, whereas an in-house primitive is not.

## Decision: Preact (light-DOM, single primitive)

We adopt **Preact**, rendering into **light DOM** (no Shadow DOM), as the single UI
component primitive. Rationale, verified against the actual repo:

- **Maintainability (clear win):** declarative components + a diffing reconciler
  collapse the triplicated `<Notice>`, retire the by-hand tree construction, and
  prevent the #203 class of bug by construction (the VDOM keeps live nodes across
  re-renders).
- **Testability (moderate win):** prop-driven, independently mountable components
  remove the reason for the `Object.create(prototype)` and cycle-break-mock hacks.
  (Caveat: the deeper root cause — module-level singletons + EventBus coupling —
  is fixed by *injecting props instead of `getInstance()`*, a discipline neither
  tool enforces. The win requires that discipline.)
- **Portability across hosts (conditional lean):** light DOM is mandatory — the
  injected widgets must inherit host CSS to blend in (Shadow DOM would sever that).
  Preact's real edge is that it **forces the adapter inversion**: presentation moves
  into `{anchor, port}`-prop components, letting `src/chatbots/Chatbot.ts` shrink
  from a god-interface that smuggles presentation (`getExtraCallButtonClasses()`,
  `SidebarConfig.createButton`) toward selectors + actions + data. The dominant
  per-host theming mechanism (the `body.claude/pi/chatgpt` cascade) is
  framework-agnostic and unchanged.

**Integration is low-friction (verified):** Preact needs **no `unsafe-eval`** (the
extension CSP at `wxt.config.ts` is already eval-free; JSX→`h()` is a build-time
transform); host CSP restrictions are `media-src`, not `script-src`, and content
scripts run in MV3's isolated world; the repo already renders 100% into light DOM.
Wiring is three steps (`preact` + `@preact/preset-vite`, `plugins:[preact()]` in the
existing `vite()` block, `jsx`/`jsxImportSource` in `tsconfig.json`), JSX is
**opt-in per `.tsx` file** so the 173 existing `.ts/.js` files are untouched, and the
bundle math is **net-negative** (delete 2.9 MB Tailwind, add ~10–12 KB Preact).

Rejected alternatives: **in-house base class** (serves only the present, becomes
integration debt if Claude Design is ever pursued, and gives no declarative
state→DOM binding so #203-class bugs persist); **Lit/web components** (Shadow DOM
isolates from host CSS — the opposite of what injected widgets need).

## Architecture

### Foundation

- Add `preact` (runtime dep) + `@preact/preset-vite` (dev dep) + `@testing-library/preact` (dev dep).
- `wxt.config.ts`: add `plugins: [preact()]` to the existing `vite()` return. **No
  manifest / permissions / content-script-injection-scope change** — verified by
  diffing the generated `manifest.json` before/after (must be byte-identical).
- `tsconfig.json`: add `"jsx": "react-jsx"`, `"jsxImportSource": "preact"`.
- New components live in `.tsx`, tested under **Vitest** (Vite-native, picks up the
  plugin) with `@testing-library/preact`. **Never Jest** for JSX (avoids adding a
  second JSX transform). **Never import Preact into the offscreen document.**

### Mount lifecycle (the load-bearing decision)

Preact's cleanup guarantee is conditional: it only prevents the listener leaks this
repo demonstrably has (`VADStatusIndicator.ts`'s `// TODO: Remove keydown listener`,
`CallButton`'s 9+ unsubscribed EventBus listeners) **if** the unmount path calls
`unmountComponentAtNode`. So the foundation ships a thin `mountInto(container, vnode)` /
`unmountFrom(container)` helper **wired into the existing `Observation`/`bootstrap`
find-decorate-and-removedNodes lifecycle** (`src/chatbots/bootstrap.ts`). Cleanup
becomes wired-once-centrally rather than per-author discipline.

### Token layer

A new `src/styles/tokens.scss` of CSS custom properties consolidating the scattered
brand literals — SayPi green (`#418a2f`, `#24381b`), cream tones, the `rectangles.css`
animation color ramp — as `var(--saypi-*)`. Rules:

- **Owned chrome** (settings, overlays/notices) styles itself from these tokens. This
  is the single artifact a future Claude Design sync consumes.
- **Host-injected widgets** keep borrowing the host's *compiled* utility classes
  (per memory `host-injected-arbitrary-tailwind`: no arbitrary `h-[2.5rem]` values —
  only real host utilities like `h-10`, because the host only compiles its own).
  Tokens live in our stylesheets, never as Tailwind arbitrary values.

### Boundaries

Presentation (host-agnostic, prop-driven Preact components) is separated from
host-coupling (adapters + bootstrap, which keep the brittle selectors). Selector
drift stays in the adapters; nothing here makes the live host DOM an API contract.

## Migration units (each independently shippable)

**Unit A — `<Notice>` (highest ROI, lowest risk).** One `<Notice variant icon onDismiss>`
component + one shared `injectNotice(host, vnode)` helper absorbing the triplicated
`findInjectionPoint`. Migrate agent-mode and compat notices directly; **`AuthPromptUI`
is the exception** — its modal + overlay + focus-trap + benefits list become
`<AuthPrompt>` *composing* `<Notice>`, not collapsing into it.

**Unit B — Settings page → Preact (deletes the 2.9 MB Tailwind dump).** Migrate the
four tabs from `html?raw` + `innerHTML` + manual `querySelector` binding to Preact
components, reusing the existing `TabController`/`TabNavigator` shape (already
prop/callback-driven, well-tested at `TabNavigator.spec.ts`). Audit which Tailwind
utilities the settings HTML actually uses (expected: few — each tab ships its own
CSS), replace with the token layer + bespoke CSS, then **delete the
`import "../../src/popup/tailwind.min.css"` at `entrypoints/settings/index.ts`**.

**Unit C — Mountable injected widgets (the seam; riskiest, done last).** Refactor
`CallButton` and the voice menus so **presentation** is a Preact component taking
props (`state`, `segments`, `hostClasses`, callbacks), while **host-node mutation**
(assigning `#saypi-prompt`, decorating host containers) stays imperative in bootstrap.
Bridge XState→props (subscribe to actor, map state→props, re-render) — which lets us
**delete** the #203 "skip rebuild if same state" guard, because the VDOM diff
preserves the live `#progress-ring` node by construction.

**Out of scope:** in-place host decoration (mutating the host's *own* DOM nodes)
stays imperative — Preact must never own those subtrees. Restyling the injected
widgets (Unit C is "make mountable + extract presentation," not "restyle"). Selector
drift remains an adapter concern.

## Testing strategy

- **Layer 0 (`tsc`):** stays green; JSX type config part of PR1.
- **Layers 1–2 (Vitest):** every new component gets a `@testing-library/preact` unit
  test. `render(<CallButton state=… />)` + assert output DOM replaces the
  `Object.create` + private-field hack and the cycle-break mock. `<Notice>` gets one
  test covering all three variants.
- **Layer 3 (Playwright):** existing decoration E2E + mock host pages stay; stop
  hand-building synthetic widget copies (`pi-action-buttons.e2e.ts`) — mount the
  **real** component (single source of truth). `e2e` is a required CI check.
- **Adapter selector contract tests untouched** (they sit below presentation).

### Visual regression (new — the net has none today)

Add Playwright `toHaveScreenshot()` baselines via a tiny **harness page** that mounts
each Preact component in isolation (cheap, now that components are mountable) — owned
chrome (settings tabs, the three `<Notice>` variants) + injected widgets against
`mock-pi-page.html`/`mock-claude-page.html`. Baselines committed; CI compares. The
harness doubles as the basis for a future Claude Design preview.

## PR staging (small, independently green, revertible — matches merge-on-green workflow)

1. **PR1 — Preact foundation:** deps + `wxt.config.ts`/`tsconfig` wiring +
   `mountInto`/`unmountFrom` helper wired into the bootstrap lifecycle + conventions
   note + this spec + the implementation plan. No behavior change. Includes the
   generated-manifest byte-identity check.
2. **PR2 — Token layer:** `tokens.scss` + migrate a first batch of duplicated brand
   literals to `var(--saypi-*)`. No behavior change.
3. **PR3 — `<Notice>`:** component + migrate all three notice modules (incl.
   `<AuthPrompt>` composition). Highest ROI.
4. **PR4 — Settings → Preact + delete the 2.9 MB Tailwind dump.** Biggest bundle win.
5. **PR5 — Mountable `CallButton`/voice menus + XState→props bridge.** Riskiest; after
   the pattern is proven.
6. **PR6 — Visual-regression harness + baselines.**

PR1 and PR2 are pure enablers. PR3 is the first user-visible win and may swap order
with PR4. Each PR: CI green (`tsc` + Jest + Vitest + `e2e`) **plus an independent
subagent reviewer verdict** posted as a PR comment, then merge (squash + delete
branch).

## Risks

- **Bootstrap unmount wiring (PR1)** is the correctness keystone — get it wrong and
  Preact leaks exactly like vanilla does today. That's why the lifecycle helper is in
  the *first* PR.
- **`wxt.config.ts` edit** — must verify the generated manifest is byte-identical so
  the change stays out of the manifest/permissions/injection-scope high-blast-radius
  category (which would need founder sign-off).
- **Mixed-paradigm window** during migration — bounded by migrating whole surfaces at
  a time and by PR sequencing.
- **`AuthPromptUI` complexity** (modal/focus-trap) — the one notice that needs
  composition, not collapse.
- **Dual test runners** — keep new `.tsx` on Vitest; don't drag Jest into JSX.
- **Per-host borrowed Tailwind classes** are a presentation-side drift surface neither
  paradigm fixes; consolidating them into typed props gives one place to fix drift.
