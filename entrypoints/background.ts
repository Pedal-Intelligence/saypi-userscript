import { defineBackground } from "wxt/utils/define-background";
import "../src/svc/background.ts";

export default defineBackground({
  type: "module",
  main() {
    // Background logic executes via the side-effect import above.
  },
});
