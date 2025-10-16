export class SettingsHeader {
  private rendered = false;

  constructor(private readonly root: HTMLElement) {
    if (!root) {
      throw new Error('Settings header root element not found');
    }
  }

  render(): void {
    if (this.rendered) return;

    this.root.innerHTML = `
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
            <span class="label-text hidden" data-i18n="profile">Profile</span>
            <span
              id="profile-status"
              class="ml-2 text-sm text-gray-600"
              data-i18n="notSignedIn"
            >
              Not signed in
            </span>
            <span id="profile-name" class="ml-2 text-normal hidden"></span>
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
    `;

    this.rendered = true;
  }

  destroy(): void {
    if (!this.rendered) return;
    this.root.innerHTML = '';
    this.rendered = false;
  }
}
