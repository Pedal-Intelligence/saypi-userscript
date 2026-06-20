// DEV-only self-reload bridge. Lets the autonomous Layer-4 verify loop reload the
// unpacked extension from the page (which it CAN reach via the Claude-in-Chrome
// MCP) instead of chrome://extensions (which it cannot — see doc/autonomous-dev-loop.md).
// chrome.runtime.reload() re-reads an unpacked extension from disk (Chrome treats
// the reload as an update). Stripped from production via the import.meta.env.DEV
// guards at the call sites. Design: doc/specs/2026-06-20-autonomous-loop-self-reload-and-synthetic-audio-design.md
import { logger } from "../LoggingModule.js";

export const DEV_RELOAD_EVENT = "saypi:dev-reload";
export const DEV_RELOAD_RESULT_EVENT = "saypi:dev-reload-result";
export const DEV_RELOAD_MESSAGE = "__SAYPI_DEV_RELOAD__";

/**
 * Content-script side. The page main world (reachable by the MCP `javascript_tool`)
 * dispatches `saypi:dev-reload` on `window`; the content script (isolated world)
 * shares the same DOM EventTarget, so it hears the event and relays a runtime
 * message — which also wakes a slept MV3 service worker.
 */
export function installDevReloadBridge(): void {
  window.addEventListener(DEV_RELOAD_EVENT, () => {
    try {
      chrome.runtime.sendMessage({ type: DEV_RELOAD_MESSAGE }, (result) => {
        // The SW reloads immediately, so this callback may never fire; report
        // best-effort so the page-side probe can observe an outcome.
        window.dispatchEvent(
          new CustomEvent(DEV_RELOAD_RESULT_EVENT, { detail: result ?? { ok: true } }),
        );
      });
    } catch (err) {
      logger.warn("[SayPi dev-reload] bridge failed", err);
      window.dispatchEvent(
        new CustomEvent(DEV_RELOAD_RESULT_EVENT, { detail: { ok: false, error: String(err) } }),
      );
    }
  });
  logger.debug("[SayPi dev-reload] bridge installed");
}

type SwMessageHandler = (message: any, sender: any, sendResponse: (r: any) => void) => boolean;

/**
 * Service-worker side. Returns (and registers) a `chrome.runtime.onMessage`
 * handler that reloads the extension on the bridge message. Best-effort: a
 * truly wedged SW that won't wake still needs the founder's one-click reload.
 */
export function registerDevReloadHandler(): SwMessageHandler {
  const handler: SwMessageHandler = (message, _sender, sendResponse) => {
    if (message?.type !== DEV_RELOAD_MESSAGE) return false;
    logger.info("[SayPi dev-reload] reloading extension on request");
    try {
      sendResponse({ ok: true });
    } catch {
      /* the port may already be closing as we reload */
    }
    chrome.runtime.reload();
    return true;
  };
  chrome.runtime.onMessage.addListener(handler);
  return handler;
}
