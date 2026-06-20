/**
 * Settings header bar (Preact).
 *
 * Faithful render of the former SettingsHeader template string: same element
 * ids, classes, `data-i18n` / `data-i18n-attr` keys, and the `data-icon` logo
 * placeholder — so auth.js (which binds `#auth-button` and updates
 * `#profile-status` / `#profile-name` / `#unauthenticated-message` by id) and
 * the orchestrator's i18n + static-icon passes are untouched.
 *
 * The dead `text-normal` class is dropped (not a Tailwind v2 utility — it never
 * styled anything).
 */
export function HeaderView() {
  return (
    <div id="profile" class="profile-banner">
      <div class="flex items-center w-full">
        <a
          href="https://www.saypi.ai"
          id="saypi-logo-link"
          data-i18n-attr="title:dashboardLinkTitle"
          title="Open Say, Pi Dashboard"
          target="_blank"
        >
          <img class="logo mr-2" data-icon="bubble-green.svg" alt="Say, Pi" />
        </a>
        <div class="flex items-center flex-grow">
          <span class="label-text hidden" data-i18n="profile">
            Profile
          </span>
          <span
            id="profile-status"
            class="ml-2 text-sm text-gray-600"
            data-i18n="notSignedIn"
          >
            Not signed in
          </span>
          <span id="profile-name" class="ml-2 hidden"></span>
          <span class="header-divider" aria-hidden="true"></span>
          <span
            id="unauthenticated-message"
            class="unauthenticated-inline hidden"
            data-i18n="quotaUnauthenticatedMessage"
          >
            Log in to access voice generation and other premium features
          </span>
        </div>
        <button
          id="auth-button"
          class="control px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          data-i18n="signIn"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
