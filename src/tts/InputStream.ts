import { Observable, Subject } from "rxjs";

export class ElementTextStream {
  private subject: Subject<string>;
  private observer!: MutationObserver;

  constructor(private element: HTMLElement, private timeout: number = 3000) {
    this.subject = new Subject<string>();
    this.registerObserver();
    this.startTimeout();
  }

  private registerObserver(): void {
    const observerCallback = (mutationsList: MutationRecord[]) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            // Use duck typing to check if the node has an innerText property (standard type guard is not reliable under our tests)
            const element = node as HTMLElement; // unsafe until checked
            if (typeof element.innerText !== "undefined") {
              this.subject.next(element.innerText);
            }
          }
        }
      }
    };

    this.observer = new MutationObserver(observerCallback);
    this.observer.observe(this.element, { childList: true, subtree: true });
  }

  private startTimeout(): void {
    setTimeout(() => {
      this.observer.disconnect();
      this.subject.complete();
    }, this.timeout);
  }

  getStream(): Observable<string> {
    return this.subject.asObservable();
  }

  disconnect(): void {
    this.observer.disconnect();
    this.subject.complete();
  }

  // For testing purposes
  getObserver(): MutationObserver {
    return this.observer;
  }
}
