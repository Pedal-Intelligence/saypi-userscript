import {
  KEEP_ALIVE_RATE_WINDOW_MS,
  MAX_KEEP_ALIVES_PER_RATE_WINDOW,
} from "./KeepAliveSettings";

type WarnLogger = (message?: any, ...optionalParams: any[]) => void;

type NowProvider = () => number;

type KeepAliveRateLimiterOptions = {
  warn?: WarnLogger;
  now?: NowProvider;
};

/**
 * Aggregates keep-alive rate limiting logic so the caller can atomically determine
 * whether a keep-alive should be sent and record rate-limit diagnostics.
 */
export class KeepAliveRateLimiter {
  private keepAliveTimestamps: number[] = [];
  private suppressedCount = 0;
  private suppressionStart: number | null = null;
  private lastRollupLog: number | null = null;
  private readonly warn: WarnLogger;
  private readonly now: NowProvider;

  constructor({ warn, now }: KeepAliveRateLimiterOptions = {}) {
    this.warn = warn ?? console.warn;
    this.now = now ?? Date.now;
  }

  /**
   * Attempts to reserve the ability to send a keep-alive for the provided UUID.
   * Returns true if the caller is permitted to send, false if the request should
   * be suppressed to avoid flooding the upstream service.
   */
  acquire(uuid: string): boolean {
    const now = this.now();
    this.prune(now);

    if (this.keepAliveTimestamps.length >= MAX_KEEP_ALIVES_PER_RATE_WINDOW) {
      this.recordSuppressed(uuid, now);
      return false;
    }

    this.flushSuppressed(now, uuid);
    this.keepAliveTimestamps.push(now);
    return true;
  }

  private prune(now: number): void {
    this.keepAliveTimestamps = this.keepAliveTimestamps.filter(
      (timestamp) => now - timestamp < KEEP_ALIVE_RATE_WINDOW_MS
    );
  }

  private recordSuppressed(uuid: string, now: number): void {
    if (this.suppressionStart === null) {
      this.suppressionStart = now;
      this.suppressedCount = 0;
      this.lastRollupLog = null;
    }

    this.suppressedCount += 1;

    if (this.lastRollupLog === null) {
      this.warn(
        `[TTS KeepAlive] Global rate guard activated; suppressing keep-alives (first uuid=${uuid}).`
      );
      this.lastRollupLog = now;
      return;
    }

    if (now - this.lastRollupLog >= KEEP_ALIVE_RATE_WINDOW_MS) {
      const duration = now - (this.suppressionStart ?? now);
      this.warn(
        `[TTS KeepAlive] Still suppressing keep-alives; ${this.suppressedCount} blocked over ${duration}ms (latest uuid=${uuid}).`
      );
      this.lastRollupLog = now;
    }
  }

  private flushSuppressed(now: number, resumedUuid: string): void {
    if (this.suppressionStart === null || this.suppressedCount === 0) {
      return;
    }

    const duration = now - this.suppressionStart;
    this.warn(
      `[TTS KeepAlive] Suppressed ${this.suppressedCount} keep-alives over ${duration}ms before resuming (uuid=${resumedUuid}).`
    );

    this.suppressedCount = 0;
    this.suppressionStart = null;
    this.lastRollupLog = null;
  }
}
