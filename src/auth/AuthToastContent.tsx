/**
 * Auth-prompt toast content (Preact).
 *
 * Faithful render of AuthPromptUI.createToastContent: same classes and the
 * icon (SayPi bubble) + text + sign-in + close structure. The toast element
 * itself, its show/auto-dismiss animation, and the sign-in/dismiss handlers
 * stay in AuthPromptUI; this component is the inner `.saypi-auth-prompt-content`.
 */
export interface AuthToastContentProps {
  /** Raw SVG markup for the brand icon (sized), or null for the emoji fallback. */
  iconSvg: string | null;
  text: string;
  signInLabel: string;
  dismissLabel: string;
  onSignIn: () => void;
  onDismiss: () => void;
}

export function AuthToastContent(props: AuthToastContentProps) {
  return (
    <div class="saypi-auth-prompt-content">
      {props.iconSvg ? (
        <div
          class="saypi-auth-prompt-icon saypi-brand-icon"
          dangerouslySetInnerHTML={{ __html: props.iconSvg }}
        />
      ) : (
        <div class="saypi-auth-prompt-icon saypi-brand-icon">🗣️</div>
      )}
      <div class="saypi-auth-prompt-text">{props.text}</div>
      <button class="saypi-auth-prompt-signin" onClick={props.onSignIn}>
        {props.signInLabel}
      </button>
      <button
        class="saypi-auth-prompt-close"
        aria-label={props.dismissLabel}
        onClick={props.onDismiss}
      >
        ×
      </button>
    </div>
  );
}
