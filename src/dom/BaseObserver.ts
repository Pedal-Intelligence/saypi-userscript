abstract class BaseObserver {
  protected observer: MutationObserver;
  protected target: Element | null;
  private static warned: Set<string> = new Set();

  constructor(searchRoot: HTMLElement, protected selector: string) {
    if (selector && searchRoot.matches?.(selector)) {
      this.target = searchRoot;
    } else if (selector) {
      this.target = searchRoot.querySelector(selector);
    } else {
      this.target = null;
    }

    this.observer = new MutationObserver(this.callback.bind(this));

    if (!this.target) {
      const key = `${selector}`;
      if (!BaseObserver.warned.has(key)) {
        BaseObserver.warned.add(key);
        console.debug(`Element with selector ${selector} not found (will retry later).`);
      }
    }
  }

  protected abstract callback(
    mutations: MutationRecord[],
    observer: MutationObserver
  ): void;

  public observe(options: MutationObserverInit): void {
    if (this.target) {
      this.observer.observe(this.target, options);
    }
  }

  public disconnect(): void {
    this.observer.disconnect();
  }
}

export { BaseObserver };
