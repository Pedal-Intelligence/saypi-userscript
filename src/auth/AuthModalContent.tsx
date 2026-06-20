/**
 * Auth-prompt modal content (Preact), soft + full variants.
 *
 * Faithful render of AuthPromptUI.createModalContent: same classes, the
 * `#saypi-auth-title` id (referenced by the modal's `aria-labelledby`), the
 * "Say, Pi" brand header, the sized brand icon, title/description, the
 * full-variant benefits list, and the sign-in / maybe-later buttons. The modal
 * + overlay elements, show animation, and focus trap stay in AuthPromptUI.
 */
export interface AuthModalContentProps {
  variant: "soft" | "full";
  /** Raw SVG markup for the brand icon (sized), or null for the emoji fallback. */
  iconSvg: string | null;
  title: string;
  description: string;
  /** Benefit lines; rendered only for the full variant. */
  benefits: string[];
  signInLabel: string;
  laterLabel: string;
  dismissLabel: string;
  onSignIn: () => void;
  onDismiss: () => void;
}

export function AuthModalContent(props: AuthModalContentProps) {
  return (
    <div class="saypi-auth-modal-content">
      <button
        class="saypi-auth-modal-close"
        aria-label={props.dismissLabel}
        onClick={props.onDismiss}
      >
        ×
      </button>

      <div class="saypi-auth-modal-brand">Say, Pi</div>

      {props.iconSvg ? (
        <div
          class="saypi-auth-modal-icon saypi-brand-icon"
          dangerouslySetInnerHTML={{ __html: props.iconSvg }}
        />
      ) : (
        <div class="saypi-auth-modal-icon saypi-brand-icon">🗣️</div>
      )}

      <h2 id="saypi-auth-title" class="saypi-auth-modal-title">
        {props.title}
      </h2>
      <p class="saypi-auth-modal-description">{props.description}</p>

      {props.variant === "full" && (
        <ul class="saypi-auth-modal-benefits">
          {props.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      )}

      <div class="saypi-auth-modal-buttons">
        <button class="saypi-auth-modal-signin" onClick={props.onSignIn}>
          {props.signInLabel}
        </button>
        <button class="saypi-auth-modal-later" onClick={props.onDismiss}>
          {props.laterLabel}
        </button>
      </div>
    </div>
  );
}
