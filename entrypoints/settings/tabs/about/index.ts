import { TabController } from '../../shared/types';
import aboutHTML from './about.html?raw';
import './about.css';

export class AboutTab implements TabController {
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    console.info('[AboutTab] Initializing...', { 
      hasContainer: !!this.container,
      htmlLength: aboutHTML?.length || 0,
      htmlType: typeof aboutHTML
    });
    
    this.container.innerHTML = aboutHTML;
    
    console.info('[AboutTab] HTML injected');
    console.info('[AboutTab] ✅ Initialized');
  }
}

