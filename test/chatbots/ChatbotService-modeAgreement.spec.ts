/**
 * The concrete chatbot and the mode gate must never disagree (#559).
 *
 * `getChatbotSync()` used to pick the implementation with its own SUBSTRING
 * hostname test (`hostname.includes("pi.ai")`), derived from nothing the mode
 * gate could see. That was harmless only while `isInChatMode()` was *also*
 * domain-shaped — both said "pi" on `hey.pi.ai`, so they agreed by accident.
 * Narrowing the mode gate to the exact chat-app hosts removed that accident: the
 * page ran universal dictation while holding a `PiAIChatbot`, and the two
 * disagreed about what the page was.
 *
 * That is not cosmetic. `constructTranscriptionFormData()` appends a `nickname`
 * field whenever `chatbot.getNickname()` differs from `chatbot.getName()` — with
 * a `PiAIChatbot` that is the user's configured Pi nickname, so the *same*
 * dictation carried a field on `hey.pi.ai` that it does not carry on any other
 * dictation site. `buildUsageMetadata()` likewise prefers `chatbot.getID()` over
 * `ChatbotIdentifier.getAppId()`.
 *
 * So the implementation is now derived from the same predicate as the mode: not
 * a chat-app host ⇒ `WebDictationChatbot`, otherwise switch on the identified
 * chatbot. This spec pins both halves — the five real chat hosts resolve exactly
 * as they did before, and every other host (chat-adjacent subdomains included)
 * agrees with `isInDictationMode()`.
 */
import { describe, expect, test, vi } from "vitest";
import { ChatbotService } from "../../src/chatbots/ChatbotService";
import { ChatbotIdentifier } from "../../src/chatbots/ChatbotIdentifier";
import { PiAIChatbot } from "../../src/chatbots/Pi";
import { ClaudeChatbot } from "../../src/chatbots/Claude";
import ChatGPTChatbot from "../../src/chatbots/ChatGPT";
import { WebDictationChatbot } from "../../src/chatbots/Web";
import { UserPreferenceModule } from "../../src/prefs/PreferenceModule";

/**
 * Drive the hostname through the one seam both the mode gate and the service
 * read. Note what this canNOT do: stub `window.location.hostname` itself —
 * jsdom defines it as a non-configurable own accessor, so it is `localhost` for
 * the whole run. That unstubbability is precisely why the old
 * `window.location.hostname` routing had no unit coverage; routing through
 * `ChatbotIdentifier` is what makes this assertable at Layer 1 at all.
 */
function withHostname<T>(hostname: string, fn: () => T): T {
  const spy = vi
    .spyOn(
      ChatbotIdentifier as unknown as {
        getGlobalLocation: () => Location | null;
      },
      "getGlobalLocation"
    )
    .mockReturnValue({ hostname } as unknown as Location);
  try {
    return fn();
  } finally {
    spy.mockRestore();
  }
}

/** The five chat-app hosts — these must resolve exactly as they did before. */
const CHAT_HOST_EXPECTATIONS: Array<[string, new () => unknown]> = [
  ["pi.ai", PiAIChatbot],
  ["claude.ai", ClaudeChatbot],
  ["chatgpt.com", ChatGPTChatbot],
  ["chat.com", ChatGPTChatbot],
  ["chat.openai.com", ChatGPTChatbot],
];

/**
 * Hosts that must get the dictation chatbot. The first four are the regression:
 * every one of them contains a chat-host substring, so the old routing handed
 * them a chat implementation while the mode gate said dictation.
 */
const DICTATION_HOSTS = [
  "hey.pi.ai", // the reported bug
  "www.pi.ai",
  "help.claude.ai",
  "www.chat.com",
  "openai.com",
  "example.com",
  "localhost",
];

describe("the chatbot implementation follows the mode gate (#559)", () => {
  test("hey.pi.ai gets the dictation chatbot, not Pi's", () => {
    withHostname("hey.pi.ai", () => {
      const chatbot = ChatbotService.getChatbotSync();
      expect(chatbot).toBeInstanceOf(WebDictationChatbot);
      expect(chatbot.getID()).toBe("web");
    });
  });

  test.each(CHAT_HOST_EXPECTATIONS)(
    "%s still gets its own chatbot implementation",
    (hostname, expected) => {
      withHostname(hostname, () => {
        expect(ChatbotService.getChatbotSync()).toBeInstanceOf(expected);
      });
    }
  );

  test.each(DICTATION_HOSTS)("%s gets the dictation chatbot", (hostname) => {
    withHostname(hostname, () => {
      expect(ChatbotService.getChatbotSync()).toBeInstanceOf(
        WebDictationChatbot
      );
    });
  });

  /**
   * The invariant the whole finding is about: whatever the host, "am I in
   * dictation mode?" and "am I holding the dictation chatbot?" are the same
   * question. A future host added to one list but not the other breaks here.
   */
  test.each([...CHAT_HOST_EXPECTATIONS.map(([h]) => h), ...DICTATION_HOSTS])(
    "%s cannot disagree with its own mode",
    (hostname) => {
      withHostname(hostname, () => {
        const isDictationChatbot =
          ChatbotService.getChatbotSync() instanceof WebDictationChatbot;
        expect(isDictationChatbot).toBe(ChatbotIdentifier.isInDictationMode());
      });
    }
  );
});

describe("nickname leakage on a chat-adjacent host (#559)", () => {
  /**
   * The concrete consequence, asserted at the seam `constructTranscriptionFormData()`
   * reads: on `hey.pi.ai` the chatbot's nickname must equal its name, so the
   * `nickname` form field is never appended — identical to dictation anywhere
   * else. With a `PiAIChatbot` the two differ as soon as the user has set a Pi
   * nickname, and the field rides along.
   */
  test("nickname equals the default name, so no nickname field is sent", async () => {
    // A STORED nickname is what makes this discriminating. Without one,
    // AbstractChatbots.getNickname() falls back to getName() for every
    // implementation, so a PiAIChatbot would satisfy these assertions too and the
    // test would pass with the fix reverted. WebDictationChatbot overrides
    // getNickname() to ignore preferences entirely — that is the difference being
    // pinned here.
    const prefs = UserPreferenceModule.getInstance();
    const stored = vi
      .spyOn(prefs, "getNickname")
      .mockResolvedValue("Piper" as never);
    try {
      const chatbot = withHostname("hey.pi.ai", () =>
        ChatbotService.getChatbotSync()
      );
      await expect(chatbot.getNickname()).resolves.toBe(chatbot.getName());
      await expect(chatbot.hasNickname()).resolves.toBe(false);

      // Guard against the assertions above going vacuous again: with the chat-host
      // implementation the stored nickname does ride along, which is exactly the
      // field that used to leak out of hey.pi.ai.
      const piChatbot = new PiAIChatbot();
      await expect(piChatbot.getNickname()).resolves.toBe("Piper");
      await expect(piChatbot.hasNickname()).resolves.toBe(true);
    } finally {
      stored.mockRestore();
    }
  });
});
