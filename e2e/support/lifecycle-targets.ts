// Pure predicates over CDP Target.TargetInfo records. No Playwright runtime
// import (type-only imports would be erased anyway), so this module is unit-
// testable under Vitest in the `test` gate, independent of the browser specs
// that consume it (which run in the now-required e2e job).

/** The subset of CDP `Target.TargetInfo` these predicates read. */
export interface CdpTargetInfo {
  targetId: string;
  type: string;
  url: string;
}

/**
 * True iff `target` is THIS extension's MV3 background service worker. Chrome
 * reports it as type 'service_worker' with a chrome-extension://<id>/ URL.
 */
export function isExtensionServiceWorkerTarget(target: CdpTargetInfo, extensionId: string): boolean {
  return target.type === "service_worker" && target.url.startsWith(`chrome-extension://${extensionId}/`);
}

/** The extension's service-worker target from a CDP getTargets() list, or undefined. */
export function pickExtensionServiceWorkerTarget(
  targets: CdpTargetInfo[],
  extensionId: string,
): CdpTargetInfo | undefined {
  return targets.find((t) => isExtensionServiceWorkerTarget(t, extensionId));
}
