# Sub-project B: Layer 3.5 — agent-launched real-host loop — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps
> use checkbox (`- [ ]`) syntax. Builds on Sub-project A (merged in #338).

**Goal:** A standalone, agent-driven loop that launches its OWN Chrome (Playwright
`launchPersistentContext`) against the *real* hosts, loads the built extension via
`--load-extension` (self-reloadable, no `chrome://extensions`), feeds the in-extension
synthetic audio source (no human at the mic), and carries real auth via a
founder-seeded persistent profile.

**Architecture:** A node runner (`scripts/layer35.mjs`, like `dev-rig.mjs`) imports
Playwright directly. Its pure logic — CLI parse, profile-dir resolution, Chrome arg
assembly — lives in `scripts/layer35-lib.mjs` and is unit-tested (mirrors
`dev-rig-lib.mjs`). It is deliberately SEPARATE from the hermetic Layer-3 Playwright
fixture and is **never** added to the required CI e2e run — it hits the real internet.

**Tech Stack:** Node ESM, Playwright (`chromium.launchPersistentContext`), the
Sub-project A synthetic-audio hook (`__saypiOffscreenTestHooks.feedSyntheticSpeech`).

**Boundary (by design):** the authenticated real-host turn needs the founder to seed
the profile ONCE (`layer35.mjs seed` → log in). After that the agent runs
`layer35.mjs verify` unattended. Real hosts are flaky/rate-limited; this is an
on-demand spot-check, not CI.

---

## File structure

- `scripts/layer35-lib.mjs` (create) — pure: `parseLayer35Args`, `resolveProfileDir`,
  `buildRealHostChromeArgs`.
- `scripts/layer35.mjs` (create) — standalone runner (`seed` / `verify` / `--self-test`).
- `test/scripts/layer35-lib.spec.ts` (create) — unit tests for the pure lib.
- `package.json` (modify) — `layer35:seed`, `layer35:verify` scripts.
- `doc/layer35-real-host-loop.md` (create) — usage + founder-seeding guide.
- `CLAUDE.md` / `e2e/README.md` (modify) — add the Layer 3.5 row/pointer.

---

## Task 1: Pure lib + unit tests

**Files:**
- Create: `scripts/layer35-lib.mjs`
- Test: `test/scripts/layer35-lib.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
// test/scripts/layer35-lib.spec.ts
import { describe, it, expect } from "vitest";
import {
  parseLayer35Args,
  resolveProfileDir,
  buildRealHostChromeArgs,
} from "../../scripts/layer35-lib.mjs";

describe("parseLayer35Args", () => {
  it("parses the seed subcommand", () => {
    expect(parseLayer35Args(["seed"])).toMatchObject({ command: "seed" });
  });
  it("parses verify with a url and headed flag", () => {
    expect(parseLayer35Args(["verify", "https://pi.ai/talk", "--headed"])).toMatchObject({
      command: "verify",
      url: "https://pi.ai/talk",
      headed: true,
    });
  });
  it("defaults verify url and headless", () => {
    const a = parseLayer35Args(["verify"]);
    expect(a.command).toBe("verify");
    expect(a.headed).toBe(false);
    expect(typeof a.url).toBe("string");
  });
  it("flags an unknown command", () => {
    expect(parseLayer35Args(["frobnicate"]).command).toBe("unknown");
  });
});

describe("resolveProfileDir", () => {
  it("prefers the env override", () => {
    expect(resolveProfileDir({ SAYPI_L35_PROFILE_DIR: "/tmp/p" }, "/home/u")).toBe("/tmp/p");
  });
  it("defaults under the home config dir", () => {
    expect(resolveProfileDir({}, "/home/u")).toBe("/home/u/.config/saypi-e2e-profile");
  });
});

describe("buildRealHostChromeArgs", () => {
  const args = buildRealHostChromeArgs({
    extensionDir: "/abs/.output/chrome-mv3-dev",
    wavPath: "/abs/speech.wav",
    headless: true,
  });
  it("loads exactly the one unpacked extension", () => {
    expect(args).toContain("--disable-extensions-except=/abs/.output/chrome-mv3-dev");
    expect(args).toContain("--load-extension=/abs/.output/chrome-mv3-dev");
  });
  it("does NOT mock DNS (real hosts) and does NOT disable TLS", () => {
    expect(args.some((a) => a.startsWith("--host-resolver-rules="))).toBe(false);
    expect(args).not.toContain("--ignore-certificate-errors");
  });
  it("keeps a fake-audio fallback even though the synthetic source is primary", () => {
    expect(args).toContain("--use-fake-device-for-media-stream");
    expect(args).toContain(`--use-file-for-fake-audio-capture=/abs/speech.wav`);
  });
  it("omits --headless when headed", () => {
    const headed = buildRealHostChromeArgs({ extensionDir: "/x", wavPath: "/w", headless: false });
    expect(headed).not.toContain("--headless=new");
  });
});
```

- [ ] **Step 2: Run, verify fail** — `npm run test:vitest -- layer35-lib` → FAIL.

- [ ] **Step 3: Implement `scripts/layer35-lib.mjs`**

```js
// scripts/layer35-lib.mjs
// Pure helpers for the Layer 3.5 real-host runner (scripts/layer35.mjs). Kept
// dependency-free so they unit-test like scripts/dev-rig-lib.mjs.
import { join } from "node:path";

const DEFAULT_VERIFY_URL = "https://pi.ai/talk";

/** Parse argv (without node/script) into a command descriptor. */
export function parseLayer35Args(argv) {
  const [command, ...rest] = argv;
  const positional = rest.filter((a) => !a.startsWith("--"));
  const flags = new Set(rest.filter((a) => a.startsWith("--")));
  if (command === "seed") {
    return { command: "seed", headed: true };
  }
  if (command === "verify") {
    return {
      command: "verify",
      url: positional[0] ?? DEFAULT_VERIFY_URL,
      headed: flags.has("--headed"),
      noTurn: flags.has("--no-turn"),
    };
  }
  if (command === "self-test" || command === "--self-test") {
    return { command: "self-test", headed: false };
  }
  return { command: "unknown" };
}

/** Resolve the persistent profile dir: env override, else under the home config dir. */
export function resolveProfileDir(env = {}, home = "") {
  if (env.SAYPI_L35_PROFILE_DIR) return env.SAYPI_L35_PROFILE_DIR;
  return join(home, ".config", "saypi-e2e-profile");
}

/**
 * Chrome args for the real-host loop. UNLIKE the hermetic Layer-3 builder, there
 * are NO --host-resolver-rules (real DNS) and NO --ignore-certificate-errors
 * (real TLS). --load-extension is kept (self-reloadable). Fake-audio flags stay as
 * a fallback; the in-extension synthetic source is the primary mic.
 */
export function buildRealHostChromeArgs({ extensionDir, wavPath, headless = true }) {
  const args = [
    `--disable-extensions-except=${extensionDir}`,
    `--load-extension=${extensionDir}`,
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
    `--use-file-for-fake-audio-capture=${wavPath}`,
    "--no-sandbox",
    "--autoplay-policy=no-user-gesture-required",
  ];
  if (headless) args.push("--headless=new");
  return args;
}
```

- [ ] **Step 4: Run, verify pass** — `npm run test:vitest -- layer35-lib` → PASS.

- [ ] **Step 5: Commit** — `feat(layer35): pure lib (cli parse, profile dir, real-host args)`.

## Task 2: The runner

**Files:**
- Create: `scripts/layer35.mjs`
- Modify: `package.json`

- [ ] **Step 1: Implement `scripts/layer35.mjs`** — a standalone runner:
  - `seed`: launch a HEADED persistent context at the profile dir, open the target
    host, and wait (founder logs in, then Ctrl-C). No extension needed for seeding,
    but loading it is harmless.
  - `verify [url]`: launch a persistent context at the profile dir with
    `buildRealHostChromeArgs` + `--load-extension`; wait for the SW; navigate to the
    url; assert SayPi decorated (`#saypi-callButton`); unless `--no-turn`, arm the
    synthetic source on the SW
    (`serviceWorker.evaluate(id => self.__saypiOffscreenTestHooks.feedSyntheticSpeech(id), tabId)`),
    start a call, and report whether a transcript landed. Exit non-zero on failure.
  - `self-test`: launch headless at a TEMP profile dir, load the extension, open
    `about:blank`, assert the SW is present, exit 0. Hermetic (no network) — proves
    the launch + extension-load glue.
  - Pre-flight: assert `.output/chrome-mv3-dev` exists (point the founder at
    `npm run e2e:build`).
  Build identity, freshness, and the synthetic-speech WAV reuse the same assets as
  Layer 3 (`e2e/fixtures/audio/speech-16k-mono.wav`).

- [ ] **Step 2:** Add to `package.json` scripts:
  `"layer35:seed": "node scripts/layer35.mjs seed"`,
  `"layer35:verify": "node scripts/layer35.mjs verify"`.

- [ ] **Step 3: Verify the glue** — `node scripts/layer35.mjs self-test` (after
  `npm run e2e:build`). Expect: SW detected, exit 0.

- [ ] **Step 4: Commit** — `feat(layer35): standalone real-host runner (seed/verify/self-test)`.

## Task 3: Docs

**Files:**
- Create: `doc/layer35-real-host-loop.md`
- Modify: `CLAUDE.md` (test-layer section), `e2e/README.md` (pointer)

- [ ] Document: what Layer 3.5 is and is not; the one-time founder seed
  (`npm run e2e:build` then `npm run layer35:seed`, log into each host); the agent
  loop (`npm run layer35:verify`); the profile dir + `SAYPI_L35_PROFILE_DIR`
  override; that the profile holds real session cookies so it stays OUTSIDE the repo
  and is never uploaded; and that this is on-demand, not CI.
- [ ] Add a "Layer 3.5" note to the CLAUDE.md test-layer list, between Layer 3 and 4.
- [ ] Commit — `docs(layer35): document the real-host loop + founder seeding`.

---

## Self-review notes

- **Spec coverage:** Unit 3 (real DNS, persistent profile, --load-extension, synthetic
  mic) → Tasks 1–2; founder-seeded auth → `seed` subcommand + docs (Task 3).
- **Not in CI:** Layer 3.5 is a standalone script, never added to `test:e2e`/required
  checks — it reaches the real internet. Stated in docs + plan.
- **Verifiable-by-agent:** the pure lib (required gate) and the hermetic `self-test`
  (launch + extension-load glue). The authenticated real-host turn needs the founder's
  seeded profile by design — documented, not asserted in CI.
- **Profile-dir secret:** holds real cookies → outside the repo, git-ignored default,
  never uploaded. Stated in Task 3.
