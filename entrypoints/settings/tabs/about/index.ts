import { TabController } from '../../shared/types';
import { StatusService } from './status-service';
import aboutHTML from './about.html?raw';
import './about.css';

export class AboutTab implements TabController {
  private statusService: StatusService | null = null;

  constructor(public container: HTMLElement) {}

  async init(): Promise<void> {
    console.info('[AboutTab] Initializing...', {
      hasContainer: !!this.container,
      htmlLength: aboutHTML?.length || 0,
      htmlType: typeof aboutHTML
    });

    this.container.innerHTML = aboutHTML;

    console.info('[AboutTab] HTML injected');

    // Initialize status service
    this.statusService = new StatusService();
    this.statusService.setupPolling();

    console.info('[AboutTab] ✅ Initialized');
  }

  /**
   * Clean up resources when tab is destroyed
   */
  destroy(): void {
    if (this.statusService) {
      this.statusService.stopPolling();
    }
  }
}

