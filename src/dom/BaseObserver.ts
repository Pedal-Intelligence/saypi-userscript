import { logger } from "../LoggingModule";

abstract class BaseObserver {
  protected observer: MutationObserver;
  protected target: Element | null;
  private static warned: Set<string> = new Set();

  constructor(searchRoot: HTMLElement, protected selector: string) {
    this.target = BaseObserver.resolveTarget(searchRoot, selector);

    this.observer = new MutationObserver(this.callback.bind(this));

    if (!this.target) {
      const key = `${selector}`;
      if (!BaseObserver.warned.has(key)) {
        BaseObserver.warned.add(key);
        logger.debug(`Element with selector ${selector} not found (will retry later).`);
      }
    }
  }

  // Resolve the element to observe, tolerating invalid selectors. The host DOM
  // can yield class lists with selector-invalid characters (e.g. Tailwind's
  // `lg:pb-8` or `min-h-[calc(100%-60px)]`), which would otherwise throw a
  // SyntaxError from matches()/querySelector(). Never throws.
  private static resolveTarget(
    searchRoot: HTMLElement,
    selector: string
  ): Element | null {
    if (!selector) return null;
    try {
      if (searchRoot.matches?.(selector)) return searchRoot;
      return searchRoot.querySelector(selector);
    } catch (e) {
      logger.error(`BaseObserver received an invalid selector: "${selector}"`, e);
      return null;
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
