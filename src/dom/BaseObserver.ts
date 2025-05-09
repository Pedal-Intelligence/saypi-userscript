abstract class BaseObserver {
  protected observer: MutationObserver;
  protected target: Element | null;

  constructor(searchRoot: HTMLElement, protected selector: string) {
    if (searchRoot.matches(selector)) {
      this.target = searchRoot;
    } else {
      this.target = searchRoot.querySelector(selector);
    }

    this.observer = new MutationObserver(this.callback.bind(this));

    if (!this.target) {
      console.warn(`Element with selector ${selector} not found.`);
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
