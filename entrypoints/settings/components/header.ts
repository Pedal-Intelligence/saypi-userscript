import { h } from 'preact';
import { mountInto, unmountFrom } from '../../../src/ui/preact/mount';
import { HeaderView } from './HeaderView';

export class SettingsHeader {
  private rendered = false;

  constructor(private readonly root: HTMLElement) {
    if (!root) {
      throw new Error('Settings header root element not found');
    }
  }

  render(): void {
    if (this.rendered) return;
    // Render the header bar with Preact; auth.js binds #auth-button and updates
    // #profile-status / #profile-name by id after this (behaviour unchanged).
    mountInto(this.root, h(HeaderView, {}));
    this.rendered = true;
  }

  destroy(): void {
    if (!this.rendered) return;
    unmountFrom(this.root);
    this.rendered = false;
  }
}
