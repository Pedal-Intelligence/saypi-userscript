import { Observable, Subject } from "rxjs";

export class ElementTextStream {
  private subject: Subject<string>;
  private observer!: MutationObserver;
  private timeout: NodeJS.Timeout | undefined = undefined;

  constructor(
    private element: HTMLElement,
    private timeoutDurationMillis: number = 5000
  ) {
    this.subject = new Subject<string>();
    this.registerObserver();
  }

  private registerObserver(): void {
    const observerCallback = (mutationsList: MutationRecord[]) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            // Filter for element type nodes
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Use text content instead of inner text to include hidden text
              const element = node as HTMLElement;
              if (element.textContent !== null) {
                this.subject.next(element.textContent);

                if (this.timeout) {
                  clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                  this.subject.complete(); // Close stream on true timeout
                }, this.timeoutDurationMillis);
              }
            }
          }
        }
      }
    };

    this.observer = new MutationObserver(observerCallback);
    this.observer.observe(this.element, { childList: true, subtree: true });
  }

  getStream(): Observable<string> {
    return this.subject.asObservable();
  }

  disconnect(): void {
    if (this.timeout) {
      // Clear timeout if it exists
      clearTimeout(this.timeout);
    }
    this.observer.disconnect();
    this.subject.complete();
  }

  // For testing purposes
  getObserver(): MutationObserver {
    return this.observer;
  }
}
