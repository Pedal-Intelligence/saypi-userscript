import { defineContentScript } from "wxt/utils/define-content-script";
import "../src/saypi.index.js";

const CHATBOT_MATCHES = [
  "https://pi.ai/*",
  "https://claude.ai/*",
  "https://chatgpt.com/*",
  "https://chat.com/*",
  "https://chat.openai.com/*",
];

const mode = import.meta.env.MODE;
const isProduction = mode === "production";
const BASE_MATCHES = ["http://*/*", "https://*/*"];
// WXT's dev auto-reloader can't currently handle file:// match patterns, so stick
// to the http/https set during development. Production keeps the same coverage
// we ship today.
const DEVELOPMENT_MATCHES = BASE_MATCHES;

export default defineContentScript({
  matches: isProduction ? BASE_MATCHES : DEVELOPMENT_MATCHES,
  excludeMatches: CHATBOT_MATCHES,
  runAt: "document_idle",
  async main() {
    // Script side effects are executed via the top-level import above.
  },
});
