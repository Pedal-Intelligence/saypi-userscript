/**
 * Mode selection must follow the *chat-app origins the chat content script is
 * actually injected into*, not the registrable domain.
 *
 * Background (#559): `identifyChatbot()` deliberately collapses a hostname to its
 * registrable domain ("claude.ai" in "chat.claude.ai"), so every `*.pi.ai`
 * subdomain answers "pi". The chat content script, however, is registered only
 * for the exact chat-app origins (`https://pi.ai/*`, …). On a non-chat subdomain
 * — e.g. `hey.pi.ai`, Pi's marketing splash, where every logged-out pi.ai visitor
 * now lands — the *universal* content script is the one that loads, and it then
 * took the chat branch: chat machinery booting on a page with no chat, while
 * universal dictation suppressed itself (`isExcludedSite()` → `isInChatMode()`).
 *
 * The gates below are therefore keyed on the exact chat-app hostnames.
 * `identifyChatbot()`/`getAppId()` are deliberately left alone — they feed the
 * `app` field of API calls (attribution), which must keep saying "pi" on any
 * pi.ai property.
 */
import { describe, expect, test, vi } from "vitest";
import {
  ChatbotIdentifier,
  CHAT_APP_HOSTNAMES,
  type ChatbotId,
} from "../../src/chatbots/ChatbotIdentifier";

/**
 * Drive the real `window.location` path rather than a test-only argument, so
 * these assertions exercise what the extension actually reads at runtime.
 */
function withHostname<T>(hostname: string | null, fn: () => T): T {
  const spy = vi
    .spyOn(
      ChatbotIdentifier as unknown as { getGlobalLocation: () => Location | null },
      "getGlobalLocation"
    )
    .mockReturnValue(
      hostname === null ? null : ({ hostname } as unknown as Location)
    );
  try {
    return fn();
  } finally {
    spy.mockRestore();
  }
}

/** Every chat-app origin the chat content script is registered for. */
const CHAT_HOSTS = [
  "pi.ai",
  "claude.ai",
  "chatgpt.com",
  "chat.com",
  "chat.openai.com",
];

/** Hosts that must get ordinary universal dictation, not chat mode. */
const DICTATION_HOSTS = [
  "hey.pi.ai", // the reported bug: Pi's marketing splash, no chat UI at all
  "www.pi.ai",
  "help.claude.ai",
  "www.chat.com",
  "openai.com",
  "example.com",
  "saypi.ai",
  "localhost",
  // The extension service worker's own scope: `chrome-extension://<id>/`, whose
  // hostname is the 32-char id. It has a host, so it is NOT the "no location"
  // carve-out below — it is an ordinary non-chat host, as it was before #559.
  "abcdefghijklmnopabcdefghijklmnop",
];

describe("chat mode is gated on the chat-app origins (#559)", () => {
  test("hey.pi.ai is a dictation page, not a chat page", () => {
    withHostname("hey.pi.ai", () => {
      expect(ChatbotIdentifier.isInChatMode()).toBe(false);
      expect(ChatbotIdentifier.isInDictationMode()).toBe(true);
    });
  });

  test.each(CHAT_HOSTS)("%s is a chat page", (hostname) => {
    withHostname(hostname, () => {
      expect(ChatbotIdentifier.isInChatMode()).toBe(true);
      expect(ChatbotIdentifier.isInDictationMode()).toBe(false);
    });
  });

  test.each(DICTATION_HOSTS)("%s is a dictation page", (hostname) => {
    withHostname(hostname, () => {
      expect(ChatbotIdentifier.isInChatMode()).toBe(false);
      expect(ChatbotIdentifier.isInDictationMode()).toBe(true);
    });
  });

  /**
   * The two gates partition the web. Narrowing only one of them would drop
   * hey.pi.ai into NEITHER mode — the extension would do nothing there, a worse
   * bug than the one being fixed.
   */
  test.each([...CHAT_HOSTS, ...DICTATION_HOSTS])(
    "%s lands in exactly one mode",
    (hostname) => {
      withHostname(hostname, () => {
        expect(ChatbotIdentifier.isInChatMode()).not.toBe(
          ChatbotIdentifier.isInDictationMode()
        );
      });
    }
  );

  /**
   * Carve-out, deliberate and pre-existing: a context with no `location` binding
   * at all has no page to be in a mode for, so BOTH gates stay false. This is
   * not a hole in the partition above — it is the "no host" case, and today's
   * behaviour (`identifyChatbot()` → undefined → both gates false) is preserved
   * verbatim. It is NOT the extension service worker: that resolves to its own
   * `chrome-extension://<id>/` scope, which has a hostname and therefore lands
   * in dictation mode (covered by the DICTATION_HOSTS row for a dotless host).
   */
  test("no location means neither mode", () => {
    withHostname(null, () => {
      expect(ChatbotIdentifier.isInChatMode()).toBe(false);
      expect(ChatbotIdentifier.isInDictationMode()).toBe(false);
    });
  });
});

describe("attribution is untouched by the mode gate (#559)", () => {
  const expectations: Array<[string, ChatbotId]> = [
    ["pi.ai", "pi"],
    ["hey.pi.ai", "pi"], // still attributed to Pi — only the MODE changes
    ["www.pi.ai", "pi"],
    ["claude.ai", "claude"],
    ["help.claude.ai", "claude"],
    ["chatgpt.com", "chatgpt"],
    ["chat.com", "chatgpt"],
    ["www.chat.com", "chatgpt"],
    ["chat.openai.com", "chatgpt"],
    ["openai.com", "web"],
    ["example.com", "web"],
    ["saypi.ai", "web"],
    ["localhost", "web"],
  ];

  test.each(expectations)("identifyChatbot(%s) is still %s", (hostname, id) => {
    expect(ChatbotIdentifier.identifyChatbot(hostname)).toBe(id);
  });

  test.each(expectations)("getAppId() on %s is still %s", (hostname, id) => {
    withHostname(hostname, () => {
      expect(ChatbotIdentifier.getAppId()).toBe(id);
    });
  });
});

describe("the chat-app hostname list is exported for the parity check", () => {
  test("it is the five chat-app origins", () => {
    expect([...CHAT_APP_HOSTNAMES].sort()).toEqual([...CHAT_HOSTS].sort());
  });
});
