/**
 * Mechanical parity guard for #559.
 *
 * `CHAT_APP_HOSTNAMES` duplicates knowledge that really lives in the WXT
 * entrypoints — `entrypoints/saypi.content.ts` decides which origins the CHAT
 * content script is injected into, and `entrypoints/saypi-universal.content.ts`
 * excludes exactly the same set. Both entrypoints import the same
 * `src/saypi.index.js`, so the bundle cannot learn at runtime which script
 * loaded it; the list has to be restated in source that the mode gate can read.
 *
 * Those entrypoint files are founder-gated (a CI path-guard fails any PR that
 * edits them), so this spec reads them from disk and asserts the three lists
 * agree. A future change to the injection scope then breaks a test instead of
 * silently desyncing the mode gate from reality.
 */
import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { CHAT_APP_HOSTNAMES } from "../../src/chatbots/ChatbotIdentifier";

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));

function readEntrypoint(name: string): string {
  return readFileSync(`${repoRoot}entrypoints/${name}`, "utf8");
}

/**
 * Pull the string literals out of the named array declaration. Deliberately
 * dumb: it reads the literal text so that any rewrite of the array (a spread, a
 * computed value, a renamed const) fails loudly rather than being "handled".
 */
function extractArrayLiterals(source: string, constName: string): string[] {
  const match = new RegExp(`${constName}\\s*=\\s*\\[([\\s\\S]*?)\\]`).exec(source);
  if (!match) {
    throw new Error(`Could not find a \`${constName} = [...]\` array literal`);
  }
  return Array.from(match[1].matchAll(/"([^"]+)"/g), (m) => m[1]);
}

/**
 * `https://pi.ai/*` -> `pi.ai`. No normalisation beyond stripping the scheme and
 * path: if someone later writes `https://*.pi.ai/*` the extracted host is the
 * literal `*.pi.ai`, the equality assert fails, and a human decides what the
 * mode gate should do about wildcard subdomains.
 */
function hostOfMatchPattern(pattern: string): string {
  const match = /^https:\/\/([^/]+)\/\*$/.exec(pattern);
  if (!match) {
    throw new Error(
      `Match pattern ${pattern} is not the plain \`https://<host>/*\` shape this guard understands`
    );
  }
  return match[1];
}

/**
 * Does the content-script config field actually USE the const we just parsed?
 *
 * Without this the guard reads a const that nothing is obliged to consume:
 * inline the five patterns into `matches:` (or drop a host from
 * `excludeMatches:`) while leaving `CHATBOT_MATCHES` intact, and all three
 * equality asserts above stay green while the built manifest injects a script
 * somewhere the mode gate doesn't know about — e.g. the chat script running on
 * four of five chat hosts *alongside* the universal one.
 *
 * Deliberately a literal, line-anchored identity check rather than anything
 * clever: `matches: [...CHATBOT_MATCHES, "https://x/*"]` is a divergence too,
 * and it should fail here rather than be "understood".
 */
function fieldReferencesConst(
  source: string,
  field: string,
  constName: string
): boolean {
  return new RegExp(`^\\s*${field}:\\s*${constName}\\s*,?\\s*$`, "m").test(
    source
  );
}

describe("chat-app hostname parity with the content-script injection scope", () => {
  const chatMatches = extractArrayLiterals(
    readEntrypoint("saypi.content.ts"),
    "CHATBOT_MATCHES"
  );
  const universalExcludes = extractArrayLiterals(
    readEntrypoint("saypi-universal.content.ts"),
    "CHATBOT_MATCHES"
  );

  test("the parse actually found the patterns", () => {
    // Guards against the vacuous pass where a broken regex makes every
    // toEqual() below compare nothing against nothing.
    expect(chatMatches.length).toBeGreaterThan(0);
    expect(universalExcludes.length).toBeGreaterThan(0);
    expect(CHAT_APP_HOSTNAMES.length).toBe(chatMatches.length);
  });

  test("the chat content script is injected into exactly CHAT_APP_HOSTNAMES", () => {
    expect(chatMatches.map(hostOfMatchPattern).sort()).toEqual(
      [...CHAT_APP_HOSTNAMES].sort()
    );
  });

  test("the universal content script excludes exactly CHAT_APP_HOSTNAMES", () => {
    expect(universalExcludes.map(hostOfMatchPattern).sort()).toEqual(
      [...CHAT_APP_HOSTNAMES].sort()
    );
  });

  test("the parsed const is the one the injection config actually uses", () => {
    // The `matches` of the chat script and the `excludeMatches` of the universal
    // one are the two fields that must stay pinned to the parsed const; the
    // universal script's own `matches` is the `isProduction` ternary over the
    // http/https catch-all and is not this guard's business.
    expect(
      fieldReferencesConst(
        readEntrypoint("saypi.content.ts"),
        "matches",
        "CHATBOT_MATCHES"
      )
    ).toBe(true);
    expect(
      fieldReferencesConst(
        readEntrypoint("saypi-universal.content.ts"),
        "excludeMatches",
        "CHATBOT_MATCHES"
      )
    ).toBe(true);
  });
});

/**
 * Non-vacuity proof for the check above, run against synthetic sources.
 *
 * The review asked for this to be demonstrated by temporarily editing an
 * entrypoint and watching the guard go red. `entrypoints/*.content.ts` are
 * founder-gated (CI's path-guard fails any PR that touches them), so the
 * divergences are reproduced here as source strings instead — which also makes
 * the demonstration permanent coverage rather than a one-off manual experiment.
 */
describe("fieldReferencesConst catches the divergences the equality asserts miss", () => {
  const inlined = `
const CHATBOT_MATCHES = ["https://pi.ai/*"];
export default defineContentScript({
  matches: ["https://pi.ai/*", "https://evil.example/*"],
});
`;
  const spread = `
const CHATBOT_MATCHES = ["https://pi.ai/*"];
export default defineContentScript({
  matches: [...CHATBOT_MATCHES, "https://evil.example/*"],
});
`;
  const renamed = `
const CHATBOT_MATCHES = ["https://pi.ai/*"];
const ACTUAL_MATCHES = ["https://pi.ai/*"];
export default defineContentScript({
  matches: ACTUAL_MATCHES,
});
`;
  const dropped = `
const CHATBOT_MATCHES = ["https://pi.ai/*"];
export default defineContentScript({
  matches: BASE_MATCHES,
});
`;
  const faithful = `
const CHATBOT_MATCHES = ["https://pi.ai/*"];
export default defineContentScript({
  matches: CHATBOT_MATCHES,
  excludeMatches: CHATBOT_MATCHES,
});
`;

  test.each([
    ["patterns inlined into the field", inlined],
    ["const spread into a wider array", spread],
    ["field pointed at a different const", renamed],
    ["field no longer references it at all", dropped],
  ])("rejects: %s", (_label, source) => {
    expect(fieldReferencesConst(source, "matches", "CHATBOT_MATCHES")).toBe(
      false
    );
  });

  test("accepts the faithful shape, for both fields", () => {
    expect(fieldReferencesConst(faithful, "matches", "CHATBOT_MATCHES")).toBe(
      true
    );
    expect(
      fieldReferencesConst(faithful, "excludeMatches", "CHATBOT_MATCHES")
    ).toBe(true);
  });

  test("`matches` does not accidentally satisfy `excludeMatches`", () => {
    // The field name is a substring of the other, so an unanchored pattern would
    // let a file that only declares `excludeMatches` pass the `matches` check.
    const excludeOnly = `
export default defineContentScript({
  excludeMatches: CHATBOT_MATCHES,
});
`;
    expect(fieldReferencesConst(excludeOnly, "matches", "CHATBOT_MATCHES")).toBe(
      false
    );
  });
});
