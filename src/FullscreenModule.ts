import {
  machine as focusMachine,
  exitFocusMode,
} from "./state-machines/FocusMachine";
import { interpret } from "xstate";
import { isMobileDevice } from "./UserAgentModule";
import { logger } from "./LoggingModule";

const focusActor = interpret(focusMachine);
const tickInterval = 1000;
var ticker: ReturnType<typeof setInterval>;
const userInputEvents = ["mousemove", "click", "keypress"];

function handleUserInput() {
  focusActor.send({ type: "blur" });
}

function startFocusModeListener() {
  focusActor.start();
  ticker = setInterval(() => {
    focusActor.send({ type: "tick", time_ms: tickInterval });
  }, tickInterval);
  // send any click or keypress to reset the inactivity timer
  for (const event of userInputEvents) {
    document.addEventListener(event, handleUserInput);
  }
}

function stopFocusModeListener() {
  focusActor.stop();
  clearInterval(ticker);
  for (const event of userInputEvents) {
    document.removeEventListener(event, handleUserInput);
  }
}

export function enterFullscreen() {
  // Check if the API is available
  if (document.fullscreenEnabled) {
    // Request full-screen mode
    document.documentElement
      .requestFullscreen()
      .then(() => {
        if (!isMobileDevice()) {
          startFocusModeListener();
        }
      })
      .catch((err) => {
        logger.debug(
          `Unable to enter full-screen mode. Maybe starting in mobile view?: ${err.message} (${err.name})`
        );
      });
  } else {
    logger.debug("Fullscreen API is not enabled.");
  }
}

export function exitFullscreen() {
  // Only exit when the API is available AND the document is actually in
  // fullscreen. Without the fullscreenElement guard, the load-time
  // exitImmersiveMode() path (ImmersionService) calls this on every page load,
  // which on a non-active document rejects with "Document not active" (#363).
  // Mirrors the already-guarded Escape-key path in ImmersionService.
  if (document.fullscreenEnabled && document.fullscreenElement) {
    // Request full-screen mode
    document
      .exitFullscreen()
      .then(() => {
        if (!isMobileDevice()) {
          exitFocusMode();
          stopFocusModeListener();
        }
      })
      .catch((err) => {
        logger.debug(
          `Unable to exit full-screen mode. Maybe starting in desktop view?: ${err.message} (${err.name})`
        );
      });
  } else {
    logger.debug("Fullscreen API is not enabled.");
  }
}
