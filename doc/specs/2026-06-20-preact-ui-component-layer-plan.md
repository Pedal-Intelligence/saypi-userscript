# Preact UI Component Layer Implementation Plan

> **⚠️ POST-IMPLEMENTATION STATUS (2026-06-20): PR1–PR4g shipped; the CallButton + voice-menu Preact rewrite (PR5/PR6 here) was DEFERRED.** Those widgets stayed imperative; their goals were met instead by extracting pure logic (`src/buttons/callButtonGeometry.ts`, #385) and a capability guard (`src/tts/VoiceMenu.ts`, #386). The `injectNotice(host, vnode)` helper described below was **not** built — the shipped helper is `findNoticeInjectionPoint` (find-only) and notices render raw into a detached host. For current conventions (not this plan's staging), see [`doc/preact-component-conventions.md`](../preact-component-conventions.md).

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce Preact (light-DOM) as the extension's UI component primitive and migrate the SayPi-owned UI onto it, in independently-shippable PRs, for maintainability + testability (and a future-cheap Claude Design sync).

**Architecture:** A thin light-DOM mount/unmount registry wraps Preact's `render`; new UI is authored as `.tsx` components tested under Vitest; host-injected widgets keep inheriting host CSS (no Shadow DOM) while presentation moves into prop-driven components and host-coupling stays in the adapters. Design: `doc/specs/2026-06-20-preact-ui-component-layer-design.md`.

**Tech Stack:** Preact 10 (esbuild automatic JSX, no Babel preset), WXT/Vite, Vitest + JSDOM, Playwright (E2E + visual regression).

---

## Working conventions (every PR)

- **Worktree isolation:** each PR in its own `.worktrees/<task>` worktree off latest `origin/main`. PR1 uses the existing `.worktrees/preact-foundation` on branch `refactor/preact-foundation`.
- **Branch guard every commit/push:** prefix with `[ "$(git rev-parse --abbrev-ref HEAD)" = "<branch>" ] || exit 1`.
- **Merge gate:** CI green (`npm test` = `tsc` + Jest + Vitest, plus required `e2e`) **plus an independent subagent reviewer verdict posted as a PR comment**. Then squash-merge + delete branch.
- **Commit trailer:** `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **PR body trailer:** `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.
- **Never** edit `.output/`, `.wxt/`, `dist/`, generated `public/`. **Never** load `.env.production`.

---

## PR1 — Preact foundation (no runtime behavior change)

Branch: `refactor/preact-foundation`. Establishes the JSX toolchain + the mount/unmount registry (the cleanup keystone), proven in isolation. Ships the design + this plan.

### Task 0: Commit the design + plan docs

**Files:**
- Create: `doc/specs/2026-06-20-preact-ui-component-layer-design.md` (already written)
- Create: `doc/specs/2026-06-20-preact-ui-component-layer-plan.md` (this file)

- [ ] **Step 1: Commit the docs**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "refactor/preact-foundation" ] || exit 1
git add doc/specs/2026-06-20-preact-ui-component-layer-design.md doc/specs/2026-06-20-preact-ui-component-layer-plan.md
git commit -m "docs(ui): design + plan for Preact UI component layer

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 1: Add Preact + JSX toolchain config

**Files:**
- Modify: `package.json` (add `preact` to dependencies)
- Modify: `tsconfig.json` (add `jsx`, `jsxImportSource`)
- Modify: `wxt.config.ts:491` (add `esbuild` to the `vite()` return)
- Modify: `vitest.config.js` (add `esbuild` jsx + include `.spec.tsx`)

- [ ] **Step 1: Install Preact**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "refactor/preact-foundation" ] || exit 1
npm install preact@^10
```

Expected: `preact` appears in `dependencies` (it is imported by runtime code).

- [ ] **Step 2: Enable JSX in `tsconfig.json`**

Change `compilerOptions` to:

```jsonc
"compilerOptions": {
  "allowJs": true,
  "jsx": "react-jsx",
  "jsxImportSource": "preact",
  "types": ["node", "chrome", "firefox-webext-browser", "vitest/globals"]
},
```

(`jsx`/`jsxImportSource` only affect files containing JSX — i.e. new `.tsx`. The 173 existing `.ts/.js` files are unaffected.)

- [ ] **Step 3: Enable build-side JSX in `wxt.config.ts`**

The `vite()` function (line ~491) currently returns `{ define, resolve, build }`. Add an `esbuild` key:

```ts
vite: () => ({
  define: {
    // ...existing...
  },
  resolve: {
    // ...existing...
  },
  build: {
    // ...existing...
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
}),
```

Do **not** touch the `manifest` block (~443-490) or the `vite:build:extendConfig` / `build:manifestGenerated` hooks.

- [ ] **Step 4: Enable test-side JSX in `vitest.config.js`**

Add top-level `esbuild` and extend `test.include`:

```js
export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "~/": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  test: {
    include: ["**/*.spec.ts", "**/*.spec.tsx"],
    exclude: [...configDefaults.exclude, "e2e/**"],
    globals: true,
    setupFiles: ["test/vitest.setup.js"],
  },
  testTimeout: 10000,
});
```

- [ ] **Step 5: Verify type-check + existing tests unchanged**

Run: `npm run typecheck`
Expected: PASS (no `.tsx` yet, so jsx config is a no-op).

Run: `npm run test:vitest`
Expected: PASS (existing specs unaffected; `.spec.tsx` glob matches nothing yet).

- [ ] **Step 6: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "refactor/preact-foundation" ] || exit 1
git add package.json package-lock.json tsconfig.json wxt.config.ts vitest.config.js
git commit -m "build(ui): add Preact + esbuild automatic-JSX toolchain (opt-in .tsx)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 2: Light-DOM mount/unmount registry (TDD)

**Files:**
- Create: `src/ui/preact/mount.ts`
- Test: `test/ui/preact/mount.spec.tsx`

- [ ] **Step 1: Write the failing test**

Create `test/ui/preact/mount.spec.tsx`:

```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { useLayoutEffect } from "preact/hooks";
import {
  mountInto,
  unmountFrom,
  unmountAllUnder,
  mountedCount,
} from "../../../src/ui/preact/mount";

// Records cleanup synchronously via useLayoutEffect so unmount assertions are
// deterministic without awaiting Preact's deferred (passive) effects.
let cleanupCalls = 0;
function Probe({ label }: { label: string }) {
  useLayoutEffect(() => () => {
    cleanupCalls += 1;
  }, []);
  return <span class="probe">{label}</span>;
}

describe("preact light-DOM mount registry", () => {
  beforeEach(() => {
    cleanupCalls = 0;
    document.body.innerHTML = "";
  });

  it("renders component output into the container", () => {
    const container = document.createElement("div");
    mountInto(container, <Probe label="hello" />);
    expect(container.querySelector(".probe")?.textContent).toBe("hello");
    expect(mountedCount()).toBe(1);
    unmountFrom(container);
  });

  it("unmounts: clears DOM and runs effect cleanup", () => {
    const container = document.createElement("div");
    mountInto(container, <Probe label="x" />);
    expect(cleanupCalls).toBe(0);
    unmountFrom(container);
    expect(container.querySelector(".probe")).toBeNull();
    expect(cleanupCalls).toBe(1);
    expect(mountedCount()).toBe(0);
  });

  it("unmountFrom is idempotent", () => {
    const container = document.createElement("div");
    mountInto(container, <Probe label="x" />);
    unmountFrom(container);
    unmountFrom(container);
    expect(cleanupCalls).toBe(1);
    expect(mountedCount()).toBe(0);
  });

  it("unmountAllUnder tears down trees nested under a removed host node", () => {
    const host = document.createElement("div");
    const widgetContainer = document.createElement("div");
    host.appendChild(widgetContainer);
    document.body.appendChild(host);

    mountInto(widgetContainer, <Probe label="nested" />);
    expect(mountedCount()).toBe(1);

    unmountAllUnder(host);
    expect(cleanupCalls).toBe(1);
    expect(mountedCount()).toBe(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test:vitest -- mount.spec`
Expected: FAIL — cannot resolve `../../../src/ui/preact/mount`.

- [ ] **Step 3: Implement the registry**

Create `src/ui/preact/mount.ts`:

```ts
import { render, type ComponentChild } from "preact";

/**
 * Light-DOM Preact mount registry.
 *
 * Tracks every container we render a Preact tree into so that unmount is
 * idempotent and the bootstrap find/decorate lifecycle can tear down any tree
 * under a host node the SPA removed (unmountAllUnder), running each component's
 * effect cleanup instead of orphaning its listeners. Preact 10 unmounts and
 * runs hook cleanup when you render `null` into a container, so we do not need
 * preact/compat's unmountComponentAtNode.
 */
const mountedContainers = new Set<Element>();

/** Render `vnode` into `container`; remember the container for cleanup. */
export function mountInto(container: Element, vnode: ComponentChild): void {
  render(vnode, container);
  mountedContainers.add(container);
}

/** Unmount any Preact tree previously mounted into `container`. Idempotent. */
export function unmountFrom(container: Element): void {
  if (!mountedContainers.has(container)) return;
  render(null, container);
  mountedContainers.delete(container);
}

/**
 * Unmount every tracked container that is `node` or a descendant of it. Call
 * from the bootstrap removed-nodes path so host-driven DOM removals trigger
 * Preact cleanup.
 */
export function unmountAllUnder(node: Node): void {
  for (const container of [...mountedContainers]) {
    if (node === container || node.contains(container)) {
      unmountFrom(container);
    }
  }
}

/** Number of currently mounted containers (diagnostics + tests). */
export function mountedCount(): number {
  return mountedContainers.size;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test:vitest -- mount.spec`
Expected: PASS (4 tests).

- [ ] **Step 5: Run the full required gate**

Run: `npm test`
Expected: PASS (`tsc` + Jest + Vitest all green).

- [ ] **Step 6: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "refactor/preact-foundation" ] || exit 1
git add src/ui/preact/mount.ts test/ui/preact/mount.spec.tsx
git commit -m "feat(ui): light-DOM Preact mount/unmount registry with cleanup

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 3: Developer conventions note

**Files:**
- Create: `doc/preact-component-conventions.md`

- [ ] **Step 1: Write the conventions note**

Create `doc/preact-component-conventions.md`:

```markdown
# Preact UI Component Conventions

SayPi UI is migrating from imperative DOM mutation to Preact components.

- **Author components as `.tsx`.** JSX uses the automatic runtime
  (`jsxImportSource: "preact"`); no `import { h }` needed.
- **Render via the registry**, never `preact.render` directly:
  `mountInto(container, <Component .../>)` and `unmountFrom(container)`
  (`src/ui/preact/mount.ts`). For host-driven removals, the bootstrap
  removed-nodes path calls `unmountAllUnder(removedNode)`.
- **Light DOM only — no Shadow DOM.** Injected widgets must inherit host CSS.
  Owned chrome (settings, notices) styles from `src/styles/tokens.scss`.
- **Host-injected widgets borrow the host's *compiled* utility classes only**
  (e.g. `h-10`, never arbitrary `h-[2.5rem]` — hosts compile only their own).
- **Test under Vitest** (`.spec.tsx`) with `@testing-library/preact`. Never
  Jest for JSX (Jest matches `*.test.js` only and has no JSX transform).
- **Never import Preact into the offscreen document** (`entrypoints/offscreen/`).
```

- [ ] **Step 2: Commit**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "refactor/preact-foundation" ] || exit 1
git add doc/preact-component-conventions.md
git commit -m "docs(ui): Preact component authoring conventions

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

### Task 4: Build verification + manifest byte-identity, then open PR

- [ ] **Step 1: Confirm the generated manifest is unchanged**

Build on this branch and on a clean `origin/main`, then diff the manifests:

```bash
# this branch
npx wxt build 2>/dev/null; cp .output/chrome-mv3/manifest.json /tmp/manifest.branch.json
# baseline from the main checkout (a sibling worktree at repo root)
( cd ../.. && npx wxt build 2>/dev/null && cp .output/chrome-mv3/manifest.json /tmp/manifest.main.json )
diff /tmp/manifest.main.json /tmp/manifest.branch.json && echo "MANIFEST IDENTICAL"
```

Expected: `MANIFEST IDENTICAL` (no differences). This proves the `wxt.config.ts` edit is confined to the Vite/esbuild transform and does **not** change the manifest / permissions / content-script injection scope — so it is **not** a high-blast-radius change requiring founder sign-off.
Fallback if the prod build needs unavailable env: document that the only `wxt.config.ts` edit is the `esbuild` key inside `vite()`, outside the `manifest` block and outside every manifest-affecting hook, and have the reviewer subagent confirm from the diff.

- [ ] **Step 2: Push and open the PR**

```bash
[ "$(git rev-parse --abbrev-ref HEAD)" = "refactor/preact-foundation" ] || exit 1
git push -u origin refactor/preact-foundation
gh pr create --title "feat(ui): Preact UI component-layer foundation" --body "$(cat <<'EOF'
## Why
First step of the UI component-layer refactor (design: `doc/specs/2026-06-20-preact-ui-component-layer-design.md`). The extension builds all UI by imperative DOM mutation (~211 createElement sites, a triplicated Notice, brittle private-field widget tests, bug #203). This PR lays the Preact foundation; no runtime behavior changes.

## What
- Add `preact` + esbuild automatic-JSX toolchain (opt-in `.tsx`; 173 existing `.ts/.js` files untouched; Jest stays clear of JSX).
- `src/ui/preact/mount.ts`: light-DOM `mountInto`/`unmountFrom`/`unmountAllUnder` registry — the cleanup keystone, so host-driven DOM removals run Preact effect cleanup instead of orphaning listeners.
- Conventions note + design/plan docs.

## Verification
- `npm test` green (tsc + Jest + Vitest); 4 new mount-registry tests.
- Generated `manifest.json` byte-identical vs `main` (see Task 4) — confirms this is **not** a manifest/permissions/injection-scope change.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Independent subagent review + merge on green** (see "Per-PR review & merge" below).

---

## Roadmap: PR2–PR6

These build on the merged foundation. **Each gets its own detailed bite-sized plan written just-in-time** when it starts (against the then-current `main`), because their concrete steps depend on the merged primitives and would otherwise be speculative. Summaries + acceptance criteria:

### PR2 — Token layer (no behavior change)
- Create `src/styles/tokens.scss` (CSS custom properties): SayPi green (`#418a2f`, `#24381b`), cream tones, the `rectangles.css` animation color ramp, as `var(--saypi-*)`.
- Import it once in the content-script style entry (`src/saypi.index.js`) and the settings entry.
- Migrate a first batch of duplicated literals to `var(--saypi-*)`.
- **Acceptance:** tokens defined + imported; a batch of literals replaced; `npm test` green; no visual change (verify against existing E2E).

### PR3 — `<Notice>` component (highest ROI)
- Add `@testing-library/preact` (dev dep — first real component test).
- `src/ui/Notice.tsx`: `<Notice variant icon onDismiss children>` + one shared `injectNotice(host, vnode)` absorbing the triplicated `findInjectionPoint` (currently duplicated in `AgentModeNoticeModule.ts:223`, `CompatibilityNotificationUI.ts:233`).
- Migrate `AgentModeNoticeModule` + `CompatibilityNotificationUI` to render `<Notice>`; refactor `AuthPromptUI` into `<AuthPrompt>` *composing* `<Notice>` (keeps its modal/overlay/focus-trap).
- **First build of a `.tsx`** — verify the wxt/esbuild JSX transform works in the real build (the foundation only proved tsc + Vitest JSX).
- **Acceptance:** one `<Notice>` replaces three skeletons; component unit test covers all variants; `findInjectionPoint` exists once; `npm test` + `e2e` green.

### PR4 — Settings → Preact + delete the 2.9 MB Tailwind dump
- Migrate the four settings tabs from `html?raw` + `innerHTML` to Preact components, reusing `TabController`/`TabNavigator`.
- Audit which Tailwind utilities the settings HTML uses; replace with `tokens.scss` + bespoke CSS; **delete `import "../../src/popup/tailwind.min.css"` (`entrypoints/settings/index.ts:15`)** and the 2.9 MB file.
- **Acceptance:** settings renders identically; Tailwind dump deleted; bundle measurably smaller; settings component tests pass; `npm test` green.

### PR5 — Mountable `CallButton` / voice menus + XState→props bridge (riskiest)
- Extract `CallButton` + voice-menu **presentation** into Preact components taking props (`state`, `segments`, `hostClasses`, callbacks); keep host-node mutation imperative in bootstrap.
- Wire `unmountAllUnder` into the bootstrap removed-nodes path (`src/chatbots/bootstrap.ts:60-94`) — first real consumer of the cleanup keystone.
- Bridge XState→props; **delete** the bug-#203 "skip rebuild if same state" guard (VDOM diff preserves the live `#progress-ring`).
- Replace the private-field test hacks (`CallButton-arc-rebuild.spec.ts`, `VoiceMenu.spec.ts`) with prop-driven component tests.
- **Acceptance:** widgets render/behave identically on all hosts (Layer 3 E2E + Layer 4 spot-check); no listener leaks; #203 regression test passes without the manual guard; `npm test` + `e2e` green.

### PR6 — Visual-regression harness + baselines
- A harness page mounting each Preact component in isolation; Playwright `toHaveScreenshot()` baselines for owned chrome (settings tabs, `<Notice>` variants) + injected widgets against `mock-pi-page.html`/`mock-claude-page.html`.
- **Acceptance:** baselines committed; CI compares; harness reusable as a future Claude Design preview.

---

## Per-PR review & merge (applies to every PR)

1. After CI is green, dispatch an **independent subagent reviewer** (multi-lens if the PR touches a high-blast-radius surface — none of PR1–PR6 touch auth/manifest-semantics/server-contract, but PR4/PR5 touch content-script behavior, so review decoration carefully).
2. Post the reviewer verdict as a PR comment (GitHub disallows self-approval).
3. Address blocking findings; re-run gate.
4. Merge (squash + delete branch) once CI green + mergeable + reviewer approves. Confirm `gh pr view --json state` is `MERGED`.

---

## Self-review (writing-plans)

- **Spec coverage:** foundation (PR1), tokens (PR2), `<Notice>` consolidation (PR3), settings + Tailwind deletion (PR4), mountable widgets + XState bridge + #203 (PR5), visual regression (PR6) — every spec section maps to a PR. Mount-lifecycle keystone is in PR1; its first call-site is PR5 (documented).
- **Placeholder scan:** PR1 tasks contain complete code + exact commands. PR2–6 are deliberately roadmap-level (each gets its own detailed plan), not placeholder steps inside a task.
- **Type consistency:** `mountInto`/`unmountFrom`/`unmountAllUnder`/`mountedCount` names are used consistently across the test, implementation, conventions note, and PR5 wiring reference.
- **Known verification boundary:** PR1 proves JSX for `tsc` + Vitest; the WXT *build*-side JSX transform is first exercised by a runtime `.tsx` in PR3 (called out in PR3 acceptance).
