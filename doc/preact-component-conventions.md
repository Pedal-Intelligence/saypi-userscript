# Preact UI Component Conventions

SayPi UI is migrating from imperative DOM mutation to Preact components
(design: `doc/specs/2026-06-20-preact-ui-component-layer-design.md`).

- **Author components as `.tsx`.** JSX uses esbuild's automatic runtime
  (`jsxImportSource: "preact"` in `tsconfig.json`, `wxt.config.ts`, and
  `vitest.config.js`); no `import { h }` needed.
- **Render via the registry, never `preact.render` directly:**
  `mountInto(container, <Component .../>)` and `unmountFrom(container)`
  (`src/ui/preact/mount.ts`). For host-driven removals, the bootstrap
  removed-nodes path calls `unmountAllUnder(removedNode)` so component effect
  cleanup runs instead of orphaning listeners.
- **Light DOM only — no Shadow DOM.** Injected widgets must inherit host CSS to
  blend into pi.ai / claude.ai / chatgpt. Owned chrome (settings, notices)
  styles from `src/styles/tokens.scss`.
- **Host-injected widgets borrow the host's *compiled* utility classes only**
  (e.g. `h-10`, never arbitrary `h-[2.5rem]` — hosts compile only their own
  utilities, so arbitrary values resolve to nothing).
- **Test under Vitest** (`*.spec.tsx`); component tests use
  `@testing-library/preact` (added with the first component in PR3 — the mount
  registry itself uses raw Preact). Never Jest for JSX: Jest matches `*.test.js`
  only and has no JSX transform.
- **Never import Preact into the offscreen document** (`entrypoints/offscreen/`),
  which renders no user-visible UI.
