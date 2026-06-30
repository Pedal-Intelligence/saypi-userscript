/**
 * Below-composer notice — the single presentational component behind SayPi's
 * dismissible banners (agent-mode notice, compatibility notice).
 *
 * Class names are templated from `variant` (`saypi-agent-notice*` /
 * `saypi-compat-notice*`) so the existing per-variant SCSS applies unchanged —
 * this is a structure-faithful replacement for the imperative DOM the modules
 * used to build by hand. Rendered into the host's light DOM (no Shadow DOM) so
 * it inherits host styling. Orchestration (show/hide animation, dismissal
 * persistence, injection) stays in the owning module; this component is pure
 * presentation plus the close-button callback.
 */
export interface NoticeProps {
  /** Drives the class prefix and which stylesheet applies. */
  variant: "agent" | "compat" | "speed";
  /** Optional root data attribute (e.g. `data-chatbot` / `data-issue-key`). */
  dataAttr?: { name: string; value: string };
  /** Raw SVG markup for the icon (already carrying its class + size), or null. */
  iconSvg: string | null;
  /** Emoji shown when `iconSvg` is null. */
  iconFallback: string;
  /** Rich HTML body (e.g. message with links); rendered as live markup. */
  bodyHtml?: string;
  /** Plain-text body; rendered escaped. Used when `bodyHtml` is absent. */
  bodyText?: string;
  /** Accessible label for the × close button. */
  dismissLabel: string;
  /** Called when the × close button is clicked. */
  onDismiss: () => void;
}

export function Notice(props: NoticeProps) {
  const p = `saypi-${props.variant}-notice`;

  // Apply the data attribute imperatively to keep the root typed as a plain div
  // (the attribute name is dynamic per variant).
  const applyDataAttr = (el: HTMLDivElement | null) => {
    if (el && props.dataAttr) {
      el.setAttribute(props.dataAttr.name, props.dataAttr.value);
    }
  };

  return (
    <div class={p} ref={applyDataAttr}>
      <div class={`${p}-content`}>
        {props.iconSvg ? (
          <div
            class={`${p}-icon`}
            dangerouslySetInnerHTML={{ __html: props.iconSvg }}
          />
        ) : (
          <div class={`${p}-icon`}>{props.iconFallback}</div>
        )}

        {props.bodyHtml != null ? (
          <div
            class={`${p}-text`}
            dangerouslySetInnerHTML={{ __html: props.bodyHtml }}
          />
        ) : (
          <div class={`${p}-text`}>{props.bodyText}</div>
        )}

        <button
          class={`${p}-close`}
          aria-label={props.dismissLabel}
          onClick={props.onDismiss}
        >
          ×
        </button>
      </div>
    </div>
  );
}
