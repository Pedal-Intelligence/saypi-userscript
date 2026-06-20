import { h } from 'preact';
import { TabController } from '../../shared/types';
import { StatusService } from './status-service';
import { mountInto, unmountFrom } from '../../../../src/ui/preact/mount';
import { AboutPanel } from './AboutPanel';
import './about.css';

export class AboutTab implements TabController {
  private statusService: StatusService | null = null;

  constructor(public container: HTMLElement) {}

  async init(): Promise<void> {
    // Render the panel with Preact, then let StatusService poll the
    // #application-status elements it produces (behaviour unchanged).
    mountInto(this.container, h(AboutPanel, {}));

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

