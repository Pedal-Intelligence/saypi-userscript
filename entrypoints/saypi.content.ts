import { defineContentScript } from "wxt/utils/define-content-script";
import "../src/saypi.index.js";

const CHATBOT_MATCHES = [
  "https://pi.ai/*",
  "https://claude.ai/*",
  "https://chatgpt.com/*",
  "https://chat.com/*",
  "https://chat.openai.com/*",
];

export default defineContentScript({
  matches: CHATBOT_MATCHES,
  runAt: "document_idle",
  async main() {
    // Script side effects are executed via the top-level import above.
  },
});
