import { defineBackground } from "wxt/utils/define-background";

export default defineBackground({
  type: "module",
  async main() {
    await import("../src/svc/background.ts");
  },
});
