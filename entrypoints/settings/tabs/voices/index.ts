import { h } from 'preact';
import { TabController } from '../../shared/types';
import { VoicesController } from './voices-controller';
import { mountInto, unmountFrom } from '../../../../src/ui/preact/mount';
import { VoicesPanel } from './VoicesPanel';
import './voices.css';

/**
 * One-shot host hint from a "voices/<host>" deep link (the in-host menus'
 * "More voices…" doors) — set by the settings bootstrap before loadTab, so
 * the studio opens scoped to the host the user came from.
 */
let initialHostHint: string | null = null;
export function setInitialVoicesHost(host: string): void {
  initialHostHint = host;
}
function consumeInitialVoicesHost(): string | null {
  const host = initialHostHint;
  initialHostHint = null;
  return host;
}

export class VoicesTab implements TabController {
  private voicesController: VoicesController | null = null;

  constructor(public container: HTMLElement) {}

  async init(): Promise<void> {
    // Render the panel with Preact, then let VoicesController fill the
    // studio — it loads over the network, so don't block tab init on it.
    mountInto(this.container, h(VoicesPanel, {}));

    this.voicesController = new VoicesController(this.container, undefined, {
      initialHost: consumeInitialVoicesHost(),
    });
    this.voicesController.init().catch((error) => {
      console.error('Failed to load the voice studio:', error);
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
