# Preact UI Component Conventions

SayPi UI is migrating from imperative DOM mutation to Preact components
(design: `doc/specs/2026-06-20-preact-ui-component-layer-design.md`).

- **Author components as `.tsx`.** JSX uses esbuild's automatic runtime
  (`jsxImportSource: "preact"` in `tsconfig.json`, `wxt.config.ts`, and
  `vitest.config.js`); no `import { h }` needed.
- **Mount owned, container-bound UI through the registry:**
  `mountInto(container, <Component .../>)` + `unmountFrom(container)`
  (`src/ui/preact/mount.ts`) — used by the settings tabs/header and the
  body-appended auth overlays, so cleanup is centralized.
  **Exception — injected notices:** the below-composer notice modules
  (`src/ui/AgentModeNoticeModule.ts`, `src/compat/CompatibilityNotificationUI.ts`)
  deliberately call raw `render(<Notice .../>, detachedHost)` and lift
  `firstElementChild`, because their imperative inject / `.visible`-animate /
  dismiss lifecycle needs to own a plain `HTMLElement`. Follow that pattern for
  new notices; use the registry for everything else.
- **Effect cleanup on host removal is NOT yet automatic.** `unmountAllUnder` is
  built and unit-tested but **not** wired into `src/chatbots/bootstrap.ts`
  (deferred). If you mount an injected widget into a node the host SPA can
  remove, call `unmountFrom`/`unmountAllUnder` yourself on removal — nothing
  does it for you yet.
- **Light DOM only — no Shadow DOM.** Injected widgets must inherit host CSS to
  blend into pi.ai / claude.ai / chatgpt. Owned chrome (settings, notices)
  styles from `src/styles/tokens.scss`.
- **Host-injected widgets may use only classes the *specific host* compiles.**
  The rule is per-host, not a blanket ban on arbitrary values — use whatever the
  host's own DOM already emits. On pi.ai, stick to standard utilities (`h-10`,
  not `h-[2.5rem]`: arbitrary values it never compiled resolve to nothing, which
  caused the #350 collapse-to-22px). On claude.ai, arbitrary values like
  `h-[14px]` / `max-h-[280px]` are correct, because Claude's own UI compiles them
  (`src/chatbots/ClaudeVoiceMenu.ts`). When unsure, inspect the live host.
- **Test under Vitest** (`*.spec.tsx`); component tests use
  `@testing-library/preact` (a dev dependency). Never Jest for JSX: Jest matches
  `*.test.js` only and has no JSX transform, so a `*.test.tsx` silently never runs.
- **Never import Preact into the offscreen document** (`entrypoints/offscreen/`),
  which renders no user-visible UI.

## Recipe: add a settings tab

All four tabs follow one shape (exemplar: `entrypoints/settings/tabs/about/`).
The touch-points are non-local — miss one and you get a tab button with the
wrong (default `info`) icon, or a panel that never renders:

1. `entrypoints/settings/tabs/<id>/<Id>Panel.tsx` — the markup as a Preact
   component. **Render-once and byte-faithful:** keep the exact `id`s, classes,
   `data-i18n`, and `data-lucide` the controller binds to. Hold **no** component
   state — the controller owns behaviour (`slider-value` needs the `setSliderValue`
   ref helper, since it has no production reader).
2. `entrypoints/settings/tabs/<id>/index.ts` — a `TabController`
   (`entrypoints/settings/shared/types.ts`) whose `init()` calls
   `mountInto(this.container, h(<Id>Panel, {}))` then wires the rendered DOM by
   `id` (imperative, exactly as the old code did); add a defensive `destroy()`
   that `unmountFrom`s (the orchestrator inits once and never destroys, but keep it).
3. `entrypoints/settings/index.html` — a `<section id="tab-<id>" class="tab-panel hidden">`
   and a sidebar `<button class="tab-button" data-tab="<id>" data-i18n="…">`.
4. `entrypoints/settings/index.ts` — register the controller (`this.tabs.set(...)`).
5. `entrypoints/settings/components/tabs.ts` — add the tab's icon to the
   `iconMap` (a function-local map inside `addIconToButton`; an unlisted tab
   falls back to `info`, so a missing entry shows the *wrong* icon, not none).
6. `_locales/*/messages.json` — i18n entries for any new `data-i18n` keys.
   **Optional:** a missing key keeps the static JSX text
   (`entrypoints/settings/shared/i18n.ts`), so existing panels intentionally ship
   `data-i18n` keys with no locale entry.
7. Test as `test/settings/tabs/<Id>Panel.spec.tsx` (Vitest + `@testing-library/preact`).
   The Layer-3 `e2e/specs/settings.e2e.ts` then exercises the real bootstrap.

## Recipe: add an injected notice

Exemplar: `src/ui/AgentModeNoticeModule.ts`. This is a **different** family from the
body-appended overlay/modal/toast (`src/auth/AuthPromptUI.ts`, which uses the
registry). The lifecycle:

1. `render(h(Notice, { variant, … }), detachedHost)` → take `host.firstElementChild`
   (a plain `HTMLElement` the module then owns). `<Notice>` keys its classes off
   `variant` → `saypi-${variant}-notice*`, so the matching SCSS applies unchanged.
2. Find the anchor with `findNoticeInjectionPoint(chatbotId)`
   (`src/ui/notice/findNoticeInjectionPoint.ts`) and
   `insertAdjacentElement("afterend", …)`. Choose the no-anchor fallback
   deliberately — the exemplars diverge: `AgentModeNoticeModule` logs and bails,
   `CompatibilityNotificationUI` appends to `document.body`.
3. Animate in by adding `.visible` after 50ms; on dismiss remove `.visible`, wait
   300ms, then remove the node; persist dismissal per-key in `localStorage`.
