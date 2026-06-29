/**
 * Mic-permission recovery classification (#437).
 *
 * Turns a `getUserMedia` failure into a first-class, recoverable state with
 * user-facing guidance, so microphone denial is never a dead end. Pure and
 * i18n-key-based so it's unit-testable and reusable both on the permissions
 * page and in the in-call denial path.
 */

export type MicPermissionOutcome =
  | "granted"
  | "denied" // user or policy blocked access (NotAllowedError, SecurityError…)
  | "no-device" // no microphone available (NotFoundError, OverconstrainedError…)
  | "in-use" // device exists but couldn't be opened (NotReadableError, busy…)
  | "unknown";

export interface MicRecovery {
  outcome: MicPermissionOutcome;
  /** i18n key for a short title describing the state. */
  titleKey: string;
  /** i18n key for the body explaining how to recover. */
  bodyKey: string;
  /** Whether re-requesting (a "Try again" button) can help. */
  canRetry: boolean;
}

/** Maps a DOMException name from getUserMedia to a recovery outcome (never "granted"). */
export function classifyMicError(
  errorName: string | undefined
): Exclude<MicPermissionOutcome, "granted"> {
  switch (errorName) {
    case "NotAllowedError":
    case "PermissionDeniedError":
    case "SecurityError":
      return "denied";
    case "NotFoundError":
    case "DevicesNotFoundError":
    case "OverconstrainedError":
    case "ConstraintNotSatisfiedError":
      return "no-device";
    case "NotReadableError":
    case "TrackStartError":
    case "AbortError":
      return "in-use";
    default:
      return "unknown";
  }
}

const RECOVERY: Record<Exclude<MicPermissionOutcome, "granted">, MicRecovery> = {
  denied: {
    outcome: "denied",
    titleKey: "permissions_recoveryDeniedTitle",
    bodyKey: "permissions_recoveryDeniedBody",
    canRetry: true,
  },
  "no-device": {
    outcome: "no-device",
    titleKey: "permissions_recoveryNoDeviceTitle",
    bodyKey: "permissions_recoveryNoDeviceBody",
    canRetry: true,
  },
  "in-use": {
    outcome: "in-use",
    titleKey: "permissions_recoveryInUseTitle",
    bodyKey: "permissions_recoveryInUseBody",
    canRetry: true,
  },
  unknown: {
    outcome: "unknown",
    titleKey: "permissions_recoveryUnknownTitle",
    bodyKey: "permissions_recoveryUnknownBody",
    canRetry: true,
  },
};

/** Describes how to recover from a non-granted outcome. */
export function describeMicRecovery(
  outcome: Exclude<MicPermissionOutcome, "granted">
): MicRecovery {
  return RECOVERY[outcome] ?? RECOVERY.unknown;
}
