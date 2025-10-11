import { defineContentScript } from "wxt/utils/define-content-script";

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
const DEVELOPMENT_MATCHES = ["file://*/*", ...BASE_MATCHES];

export default defineContentScript({
  matches: isProduction ? BASE_MATCHES : DEVELOPMENT_MATCHES,
  excludeMatches: CHATBOT_MATCHES,
  runAt: "document_idle",
  async main() {
    await import("../src/saypi.index.js");
  },
});
