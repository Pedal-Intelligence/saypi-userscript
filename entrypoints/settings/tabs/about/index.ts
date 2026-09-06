import { h } from 'preact';
import { browser } from 'wxt/browser';
import type { PublicPath } from 'wxt/browser';
import { TabController } from '../../shared/types';
import { StatusService } from './status-service';
import { mountInto, unmountFrom } from '../../../../src/ui/preact/mount';
import { wireOnboardingLink } from '../../../../src/onboarding/settingsOnboardingLink';
import { AboutPanel } from './AboutPanel';
import './about.css';

export class AboutTab implements TabController {
  private statusService: StatusService | null = null;

  constructor(public container: HTMLElement) {}

  async init(): Promise<void> {
    // Render the panel with Preact, then let StatusService poll the
    // #application-status elements it produces (behaviour unchanged).
    mountInto(this.container, h(AboutPanel, {}));

    // The way back into first-run setup for anyone who closed that tab early
    // (#613). Resolved here rather than in the markup because it points at an
    // extension page, not a website.
    wireOnboardingLink(this.container, {
      getUrl: (path) => browser.runtime.getURL(path as PublicPath),
    });

    this.statusService = new StatusService();
    this.statusService.setupPolling();
  }

  /**
   * Clean up resources when tab is destroyed
   */
  destroy(): void {
    if (this.statusService) {
      this.statusService.stopPolling();
      this.statusService = null;
    }
    unmountFrom(this.container);
  }
}

