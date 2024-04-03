import { Observable, Subject } from "rxjs";

export const ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS: number = 10000; // visible for testing

// Visible for testing
export function getNestedText(node: HTMLElement): string {
  return node.textContent ?? node.innerText ?? "";
}

export class ElementTextStream {
  private subject: Subject<string>;
  private observer!: MutationObserver;
  private timeout: NodeJS.Timeout | undefined = undefined;

  constructor(private element: HTMLElement) {
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
              const element = node as HTMLElement;
              const text = getNestedText(element);
              if (text !== "") {
                this.subject.next(text);

                if (this.timeout) {
                  clearTimeout(this.timeout);
                }
                this.timeout = setTimeout(() => {
                  this.subject.complete(); // Close stream on true timeout
                }, ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS);
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
