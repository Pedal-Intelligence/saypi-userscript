import { logger } from "../LoggingModule.js";
import {
  KEEP_ALIVE_INTERVAL_MS,
  MAX_KEEP_ALIVES_PER_TOOL_USE,
} from "./KeepAliveSettings";

export interface KeepAliveControllerOptions {
  sendKeepAlive: (uuid: string) => Promise<boolean>;
  warn?: (message?: any, ...optionalParams: any[]) => void;
  debug?: (message?: any, ...optionalParams: any[]) => void;
}

export class StreamKeepAliveController {
  private readonly sendKeepAlive: (uuid: string) => Promise<boolean>;
  private readonly warn: (message?: any, ...optionalParams: any[]) => void;
  private readonly debug: (message?: any, ...optionalParams: any[]) => void;

  private keepAliveTimers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private activeKeepAlive: Set<string> = new Set();
  private lastKeepAliveSent: Map<string, number> = new Map();
  private keepAliveCounts: Map<string, number> = new Map();
  private globalKeepAliveEvents: number[] = [];

  constructor({ sendKeepAlive, warn, debug }: KeepAliveControllerOptions) {
    this.sendKeepAlive = sendKeepAlive;
    this.warn = warn ?? logger.warn.bind(logger);
    this.debug = debug ?? logger.debug.bind(logger);
  }

  start(uuid: string, toolName?: string): void {
    if (!this.activeKeepAlive.has(uuid) && this.activeKeepAlive.size > 0) {
      const existing = Array.from(this.activeKeepAlive).join(", ");
      this.warn(
        `[TTS KeepAlive] Another keep-alive is active (${existing}); stopping it before starting ${uuid}`
      );
      for (const activeUuid of Array.from(this.activeKeepAlive)) {
        this.stop(activeUuid);
      }
    }

    if (this.activeKeepAlive.has(uuid)) {
      return;
    }

    this.activeKeepAlive.add(uuid);
    this.keepAliveCounts.set(uuid, 0);

    this.debug(
      `[TTS KeepAlive] Starting keep-alive for ${uuid}${
        toolName ? ` (${toolName})` : ""
      }`
    );
    this.dispatch(uuid, false);

    const timer = setInterval(() => {
      this.dispatch(uuid, true);
    }, KEEP_ALIVE_INTERVAL_MS);
    this.keepAliveTimers.set(uuid, timer);
  }

  stop(uuid: string): void {
    const timer = this.keepAliveTimers.get(uuid);
    if (timer) {
      clearInterval(timer);
      this.keepAliveTimers.delete(uuid);
    }
    if (this.activeKeepAlive.delete(uuid)) {
      this.debug(`[TTS KeepAlive] Stopped keep-alive for ${uuid}`);
    }
    this.lastKeepAliveSent.delete(uuid);
    this.keepAliveCounts.delete(uuid);
  }

  isActive(uuid: string): boolean {
    return this.activeKeepAlive.has(uuid);
  }

  private dispatch(uuid: string, fromTimer: boolean): void {
    if (!this.activeKeepAlive.has(uuid)) {
      this.warn(
        `[TTS KeepAlive] Ignoring keep-alive send for inactive stream ${uuid}`
      );
      return;
    }

    const now = Date.now();
    const lastSent = this.lastKeepAliveSent.get(uuid);
    const minimumInterval = KEEP_ALIVE_INTERVAL_MS * 0.8;

    if (lastSent && now - lastSent < minimumInterval) {
      this.warn(
        `[TTS KeepAlive] Detected rapid keep-alive cadence for ${uuid} (Δ=${
          now - lastSent
        }ms); halting keep-alive.`
      );
      this.stop(uuid);
      return;
    }

    const keepAliveCount = this.keepAliveCounts.get(uuid) ?? 0;
    if (keepAliveCount >= MAX_KEEP_ALIVES_PER_TOOL_USE) {
      this.warn(
        `[TTS KeepAlive] Keep-alive limit (${MAX_KEEP_ALIVES_PER_TOOL_USE}) reached for ${uuid}; halting keep-alive.`
      );
      this.stop(uuid);
      return;
    }

    if (!this.shouldAllowGlobalKeepAlive(now, uuid)) {
      return;
    }

    this.keepAliveCounts.set(uuid, keepAliveCount + 1);
    this.lastKeepAliveSent.set(uuid, now);
    this.globalKeepAliveEvents.push(now);

    void this.sendKeepAlive(uuid).then((success) => {
      if (!success && fromTimer) {
        this.warn(
          `[TTS KeepAlive] Upstream keep-alive call failed for ${uuid}; stopping timer.`
        );
        this.stop(uuid);
      }
    });
  }

  private shouldAllowGlobalKeepAlive(now: number, uuid: string): boolean {
    this.pruneGlobalKeepAliveEvents(now);

    if (this.globalKeepAliveEvents.length >= 1) {
      const lastGlobalSend =
        this.globalKeepAliveEvents[this.globalKeepAliveEvents.length - 1];
      const delta = now - lastGlobalSend;
      this.warn(
        `[TTS KeepAlive] Global keep-alive rate exceeded by ${uuid} (Δ=${delta}ms); halting active timers.`
      );
      for (const activeUuid of Array.from(this.activeKeepAlive)) {
        this.stop(activeUuid);
      }
      return false;
    }

    return true;
  }

  private pruneGlobalKeepAliveEvents(now: number): void {
    this.globalKeepAliveEvents = this.globalKeepAliveEvents.filter(
      (timestamp) => now - timestamp < KEEP_ALIVE_INTERVAL_MS
    );
  }
}
