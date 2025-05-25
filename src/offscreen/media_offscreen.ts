import { logger } from "../LoggingModule.js";
import { setupMessageListener } from "./media_coordinator";

logger.log("[SayPi Media Offscreen] Script loaded.");

// Set up the global message listener that will route messages to the appropriate handlers
setupMessageListener();

logger.log("[SayPi Media Offscreen] Message listener initialized."); 