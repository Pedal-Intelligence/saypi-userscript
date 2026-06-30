/**
 * Microphone permission-loss detection (#437 slice 4c).
 *
 * Distinguishes a mic that was *previously granted but is now revoked* (e.g.
 * macOS turning it off after an OS update) from a normal first-time prompt, so
 * the permissions page can show tailored "your access was turned off" recovery
 * copy instead of the generic first-run prompt. Pure + unit-tested; the
 * background service worker persists the flag and drives the routing.
 */

/** Storage key recording that the mic was granted at least once. */
export const MIC_GRANTED_FLAG = "saypi_mic_granted";

/** Query-param value flagging the permissions page as a revoked-access recovery. */
export const REVOKED_REASON = "revoked";

/** True when the mic was granted before but the current state is no longer granted. */
export function detectPermissionLoss(
  previouslyGranted: boolean,
  currentState: string
): boolean {
  return previouslyGranted && currentState !== "granted";
}

/** Adds the revoked-reason marker to the permissions page URL on a loss. */
export function buildPermissionsUrl(baseUrl: string, isLoss: boolean): string {
  if (!isLoss) return baseUrl;
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}reason=${REVOKED_REASON}`;
}

/** Reads the revoked reason from a URL query string, or null. */
export function parsePermissionReason(search: string): typeof REVOKED_REASON | null {
  try {
    const params = new URLSearchParams(search);
    return params.get("reason") === REVOKED_REASON ? REVOKED_REASON : null;
  } catch {
    return null;
  }
}
