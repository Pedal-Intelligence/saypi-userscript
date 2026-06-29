/**
 * Renders the first-class mic-permission recovery panel (#437).
 *
 * Separated from the side-effectful permissions page script so it can be
 * unit-tested in JSDOM. Pure DOM construction from a recovery descriptor.
 */
import {
  describeMicRecovery,
  type MicPermissionOutcome,
} from "./micPermissionRecovery";

export interface RecoveryViewOptions {
  translate: (key: string, substitutions?: string) => string;
  onRetry: () => void;
  retryLabelKey?: string;
}

/**
 * Replaces the contents of `container` with a recovery panel (title, body, and
 * — when retrying can help — a "Try again" button) and makes it visible.
 * Returns the container.
 */
export function renderMicRecovery(
  container: HTMLElement,
  outcome: Exclude<MicPermissionOutcome, "granted">,
  opts: RecoveryViewOptions
): HTMLElement {
  const rec = describeMicRecovery(outcome);
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.id = "recovery-title";
  title.textContent = opts.translate(rec.titleKey);

  const body = document.createElement("p");
  body.id = "recovery-body";
  body.textContent = opts.translate(rec.bodyKey);

  container.append(title, body);

  if (rec.canRetry) {
    const btn = document.createElement("button");
    btn.id = "recovery-retry";
    btn.type = "button";
    btn.className = "retry-button";
    btn.textContent = opts.translate(opts.retryLabelKey ?? "permissions_retryButton");
    btn.addEventListener("click", () => opts.onRetry());
    container.append(btn);
  }

  container.hidden = false;
  return container;
}
