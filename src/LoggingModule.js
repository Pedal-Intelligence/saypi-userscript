export function serializeStateValue(stateValue) {
  if (typeof stateValue === "string") {
    return stateValue;
  }
  if (typeof stateValue === 'object' && stateValue !== null) {
    return Object.keys(stateValue)
      .map((key) => {
        const nestedValue = stateValue[key];
        if (typeof nestedValue === 'object' && nestedValue !== null) {
          return `${key}:{${serializeStateValue(nestedValue)}}`;
        } 
        return `${key}:${nestedValue}`;
      })
      .join(",");
  }
  return String(stateValue);
}

class Logger {
  constructor(prefix = "SayPi") {
    this.prefix = prefix;
    // TODO: Make debugMode configurable, e.g., via storage or a global flag
    this.debugMode = true; // Default to true for easier development, can be changed
  }

  setDebugMode(enabled) {
    this.debugMode = enabled;
  }

  _formatArgs(args) {
    return args.map(arg => 
      typeof arg === 'object' && arg !== null && !(arg instanceof Error) ? JSON.stringify(arg, null, 2) : arg
    );
  }

  log(...args) {
    console.log(`[${this.prefix}]`, ...this._formatArgs(args));
  }

  debug(...args) {
    if (this.debugMode) {
      console.debug(`[${this.prefix} DEBUG]`, ...this._formatArgs(args));
    }
  }

  info(...args) { // Alias for log
    console.info(`[${this.prefix} INFO]`, ...this._formatArgs(args));
  }

  warn(...args) {
    console.warn(`[${this.prefix} WARNING]`, ...this._formatArgs(args));
  }

  error(...args) {
    console.error(`[${this.prefix} ERROR]`, ...this._formatArgs(args));
  }

  group(label) {
    console.group(`[${this.prefix}] ${label}`);
  }

  groupEnd() {
    console.groupEnd();
  }

  reportError(error, context = {}, additionalMessage = "") {
    const errorMessage = additionalMessage ? `${additionalMessage}: ${error.message || String(error)}` : (error.message || String(error));
    const errorInfo = {
      message: errorMessage,
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
      prefix: this.prefix,
    };

    this.error(errorMessage, "Context:", context, "Stack:", error.stack);

    try {
      chrome.runtime.sendMessage({
        type: "LOG_ERROR_REPORT", // Changed type to be more specific
        error: errorInfo,
        origin: "logger-reportError" // Identify the source of this message
      }).catch(e => {
        // This catch is for sendMessage itself failing (e.g. if background isn't ready)
        console.error("[Logger] Failed to send error report to background:", e, errorInfo);
      });
    } catch (e) {
      // Catch synchronous errors from sendMessage, though less common
      console.error("[Logger] Synchronous error sending error report to background:", e, errorInfo);
    }
    return errorInfo;
  }
}

// Export a single instance of the logger
export const logger = new Logger("SayPi");

// Example usage (optional, for testing):
// logger.setDebugMode(true);
// logger.debug("This is a debug message", { a: 1 });
// logger.info("This is an info message");
// logger.warn("This is a warning");
// try {
//   throw new Error("Test error for reporting");
// } catch (e) {
//   logger.reportError(e, { customContext: "Test context" }, "Caught an exception");
// }
