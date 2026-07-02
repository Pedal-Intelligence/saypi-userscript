import { h } from 'preact';
import { TabController } from '../../shared/types';
import { VoicesController } from './voices-controller';
import { mountInto, unmountFrom } from '../../../../src/ui/preact/mount';
import { VoicesPanel } from './VoicesPanel';
import './voices.css';

export class VoicesTab implements TabController {
  private voicesController: VoicesController | null = null;

  constructor(public container: HTMLElement) {}

  async init(): Promise<void> {
    // Render the panel with Preact, then let VoicesController fill the
    // catalog — it loads over the network, so don't block tab init on it.
    mountInto(this.container, h(VoicesPanel, {}));

    this.voicesController = new VoicesController(this.container);
    this.voicesController.init().catch((error) => {
      console.error('Failed to load the voice catalog:', error);
    });
  }

  /**
   * Clean up when the tab is destroyed. Defensive — the orchestrator keeps
   * tabs mounted (init runs once), but unmount the Preact tree if ever called.
   */
  destroy(): void {
    this.voicesController = null;
    unmountFrom(this.container);
  }
}
