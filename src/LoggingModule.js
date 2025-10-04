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
    // Default to quiet unless explicitly enabled via env/flag
    this.debugMode = false;
    
    // Simple duplicate suppression window (ms)
    this.dedupeWindowMs = 2000;
    this._lastLog = new Map(); // key -> timestamp
    
    // Bind original console methods to preserve call stack
    this._console = {
      log: console.log.bind(console),
      debug: console.debug.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console),
      group: console.group.bind(console),
      groupEnd: console.groupEnd.bind(console)
    };

    // Auto-configure debug mode from environment or runtime flags
    try {
      const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
      const envDebug = env.DEBUG_LOGS === 'true' || env.SAYPI_DEBUG === 'true';
      const urlDebug = (typeof window !== 'undefined' && typeof window.location !== 'undefined')
        ? (window.location.search || '').includes('saypi_debug=1')
        : false;
      const lsDebug = (typeof window !== 'undefined' && window.localStorage)
        ? window.localStorage.getItem('saypi:debug') === 'true'
        : false;
      if (envDebug || urlDebug || lsDebug) {
        this.debugMode = true;
      }
    } catch (_) {
      // Ignore environment probing errors
    }
  }

  setDebugMode(enabled) {
    this.debugMode = enabled;
  }

  isDebugEnabled() {
    return this.debugMode;
  }

  _buildKey(level, args) {
    const first = args && args.length ? args[0] : '';
    const base = typeof first === 'string' ? first : JSON.stringify(first);
    return `${level}:${base}`;
  }

  _shouldEmit(level, args) {
    // Avoid suppressing errors/warnings
    if (level === 'error' || level === 'warn') return true;
    const key = this._buildKey(level, args);
    const now = Date.now();
    const last = this._lastLog.get(key) || 0;
    if (now - last < this.dedupeWindowMs) {
      return false;
    }
    this._lastLog.set(key, now);
    return true;
  }

  _formatArgs(args) {
    return args.map(arg => 
      typeof arg === 'object' && arg !== null && !(arg instanceof Error) ? JSON.stringify(arg, null, 2) : arg
    );
  }

  log(...args) {
    if (!this._shouldEmit('log', args)) return;
    this._console.log(`[${this.prefix}]`, ...this._formatArgs(args));
  }

  debug(...args) {
    if (this.debugMode && this._shouldEmit('debug', args)) {
      this._console.debug(`[${this.prefix} DEBUG]`, ...this._formatArgs(args));
    }
  }

  info(...args) { // Alias for log
    if (!this._shouldEmit('info', args)) return;
    this._console.info(`[${this.prefix} INFO]`, ...this._formatArgs(args));
  }

  warn(...args) {
    this._console.warn(`[${this.prefix} WARNING]`, ...this._formatArgs(args));
  }

  error(...args) {
    this._console.error(`[${this.prefix} ERROR]`, ...this._formatArgs(args));
  }

  group(label) {
    this._console.group(`[${this.prefix}] ${label}`);
  }

  groupEnd() {
    this._console.groupEnd();
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
