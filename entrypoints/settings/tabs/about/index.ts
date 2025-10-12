import { TabController } from '../../shared/types';
import aboutHTML from './about.html?raw';
import './about.css';

export class AboutTab implements TabController {
  constructor(public container: HTMLElement) {}
  
  async init(): Promise<void> {
    this.container.innerHTML = aboutHTML;
    
    // Status polling logic is handled by status.js (Phase 3 will extract it)
    
    // Icons will be initialized globally after all tabs are set up
    // replaceI18n() will be called globally as well
  }
}

