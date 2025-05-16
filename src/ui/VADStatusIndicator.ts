export class VADStatusIndicator {
  private container: HTMLElement | null = null;
  private statusElement: HTMLElement | null = null;
  private detailsElement: HTMLElement | null = null;
  private visible: boolean = false;

  constructor() {
    // Delay creation until document.body is available, or ensure it's called appropriately
    if (document.readyState === "complete" || document.readyState === "interactive") {
      this.createElements();
    } else {
      document.addEventListener("DOMContentLoaded", () => this.createElements());
    }
    // Add keyboard shortcut to toggle status display
    document.addEventListener('keydown', (event) => {
      // Alt+Shift+V to toggle status
      if (event.altKey && event.shiftKey && event.key === 'V') {
        this.toggle();
      }
    });
  }

  private createElements(): void {
    if (this.container) return; // Already created

    this.container = document.createElement('div');
    this.container.className = 'saypi-vad-status-indicator'; // Unique class name
    this.container.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: rgba(30, 30, 30, 0.85);
      color: #e0e0e0;
      padding: 10px 15px;
      border-radius: 6px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
      font-size: 13px;
      line-height: 1.4;
      z-index: 2147483647; /* Max z-index */
      display: none; /* Initially hidden */
      flex-direction: column;
      max-width: 280px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;

    this.statusElement = document.createElement('div');
    this.statusElement.className = 'saypi-vad-status-text';
    this.statusElement.style.fontWeight = '600';
    this.statusElement.textContent = 'VAD: Initializing...';
    this.container.appendChild(this.statusElement);

    this.detailsElement = document.createElement('div');
    this.detailsElement.className = 'saypi-vad-status-details';
    this.detailsElement.style.cssText = `
      margin-top: 6px;
      font-size: 11px;
      opacity: 0.75;
      display: none; /* Initially hidden */
    `;
    this.container.appendChild(this.detailsElement);

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.setAttribute('aria-label', 'Close VAD Status');
    closeButton.style.cssText = `
      position: absolute;
      top: 4px;
      right: 4px;
      background: transparent;
      border: none;
      color: #cccccc;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      padding: 2px 6px;
      line-height: 1;
    `;
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); 
        this.hide();
    });
    this.container.appendChild(closeButton);

    document.body.appendChild(this.container);
  }

  public updateStatus(status: string, details: string = ''): void {
    if (!this.statusElement || !this.detailsElement || !this.container) return;

    this.statusElement.textContent = `VAD: ${status}`;
    
    if (details) {
      this.detailsElement.innerHTML = details; // Use innerHTML for potential formatting (e.g., <br>)
      this.detailsElement.style.display = 'block';
    } else {
      this.detailsElement.style.display = 'none';
    }
    
    let statusColor = '#e0e0e0'; // Default white/light gray
    switch (status.toLowerCase()) {
      case 'ready':
      case 'initialized':
        statusColor = '#66bb6a'; // Green
        break;
      case 'listening':
        statusColor = '#e0e0e0'; // Default white/light gray
        break;
      case 'processing':
      case 'speech detected':
        statusColor = '#42a5f5'; // Blue
        break;
      case 'error':
      case 'failed':
        statusColor = '#ef5350'; // Red
        break;
      case 'initializing':
      case 'connecting':
      case 'loading':
        statusColor = '#ffa726'; // Amber
        break;
      case 'stopped':
      case 'destroyed':
          statusColor = '#bdbdbd'; // Grey
          break;
    }
    this.statusElement.style.color = statusColor;
    this.show(); // Ensure it's visible when status updates, unless explicitly hidden by user
  }

  public show(): void {
    if (!this.container) return;
    if (!this.visible) {
      this.container.style.display = 'flex';
      // Trigger transition
      setTimeout(() => {
        if(this.container) {
            this.container.style.opacity = '1';
            this.container.style.transform = 'translateY(0)';
        }
      }, 10);
      this.visible = true;
    }
  }

  public hide(): void {
    if (!this.container) return;
    if (this.visible) {
      this.container.style.opacity = '0';
      this.container.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (this.container && !this.visible) { // Check visible again in case show() was called rapidly
            this.container.style.display = 'none';
        }
      }, 300); // Match transition duration
      this.visible = false;
    }
  }

  public toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  public destroy(): void {
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.statusElement = null;
      this.detailsElement = null;
      this.visible = false;
    }
    // TODO: Remove keydown listener if added to document specific to this instance
  }
} 