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
});
