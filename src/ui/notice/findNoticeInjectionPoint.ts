/**
 * Find the element AFTER which a below-composer SayPi notice should be inserted.
 *
 * Shared by AgentModeNoticeModule and CompatibilityNotificationUI, which both
 * previously carried a byte-identical copy of this logic. Prefers the universal
 * `#saypi-chat-ancestor`, then falls back to per-host composer selectors.
 * Returns null when nothing matches (callers handle their own fallback).
 */
export function findNoticeInjectionPoint(chatbotId: string): HTMLElement | null {
  // Primary approach: the universal chat ancestor if available.
  const chatAncestor = document.querySelector(
    "#saypi-chat-ancestor",
  ) as HTMLElement | null;
  if (chatAncestor) {
    return chatAncestor;
  }

  // Fall back to chatbot-specific selectors.
  switch (chatbotId) {
    case "chatgpt":
      return document.querySelector(
        'form[data-type="unified-composer"]',
      ) as HTMLElement | null;

    case "claude":
      return document.querySelector("fieldset.w-full") as HTMLElement | null;

    case "pi":
      return (
        (document.querySelector("#saypi-prompt-controls-container")
          ?.parentElement as HTMLElement | null) ||
        (document.querySelector(".saypi-prompt-container") as HTMLElement | null)
      );

    default:
      // Generic fallback - look for any prompt container.
      return (
        (document.querySelector("#saypi-prompt-controls-container")
          ?.parentElement as HTMLElement | null) ||
        (document.querySelector(".saypi-prompt-container") as HTMLElement | null) ||
        (document.querySelector(
          'form[data-type="unified-composer"]',
        ) as HTMLElement | null)
      );
  }
}
