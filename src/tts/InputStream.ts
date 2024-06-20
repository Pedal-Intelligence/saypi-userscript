import { Observable, ReplaySubject, Subject } from "rxjs";

export const STREAM_TIMEOUT_MS: number = 10000; // visible for testing
const graceForAdditionalChanges = 1000;

// Visible for testing
export function getNestedText(node: HTMLElement): string {
  return node.textContent ?? node.innerText ?? "";
}
export interface InputStreamOptions {
  includeInitialText?: boolean;
  delimiter?: string;
}

export class ElementTextStream {
  protected subject: Subject<string>;
  protected observer!: MutationObserver;
  protected timeout: NodeJS.Timeout | undefined = undefined;
  protected emittedValues: string[] = [];
  protected timeOfLastTextChange: number = Date.now();
  protected batchIntervalTimerId: NodeJS.Timeout | null = null;
  protected delimiter: string = "";

  constructor(
    protected element: HTMLElement,
    { includeInitialText = false, delimiter = "" }: InputStreamOptions = {}
  ) {
    this.delimiter = delimiter;
    this.subject = new ReplaySubject<string>(1000); // buffer should be long enough to handle the longest text (4k characters)
    // subscribe to keep track of emitted values
    this.subject.subscribe((value) => this.emittedValues.push(value));
    // subscribe to keep track of timeouts
    this.subject.subscribe({
      next: () => {
        this.timeOfLastTextChange = Date.now();
        this.resetStreamTimeout();
      },
      complete: () => {
        clearTimeout(this.timeout);
      },
    });
    this.resetStreamTimeout(); // set the initial timeout
    if (includeInitialText) {
      this.emitInitialText(element); // emit the initial text
    }
    this.registerObserver(); // start observing the element for additions
  }

  private emitInitialText(message: HTMLElement): void {
    const initialText = getNestedText(message);
    // send the initial text to the stream only if it's not empty
    if (initialText) {
      this.subject.next(initialText);
    }
  }

  /**
   * The stream will complete if no new text is streamed for a certain duration.
   * This method resets the timeout.
   */
  private resetStreamTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      console.debug(
        `Stream ended on timeout out after ${STREAM_TIMEOUT_MS}ms since last token`
      );
      this.subject.complete();
    }, STREAM_TIMEOUT_MS);
  }

  protected getTextIsStable(): boolean {
    return this.subject.closed;
  }

  protected registerObserver(): void {
    let lastParagraphAdded = this.element.querySelectorAll("div")?.item(0);
    let spansAdded = 0;
    let spansRemoved = 0;
    let spansReplaced = 0;
    let stillChanging = false;

    const framerMutation = (mutation: MutationRecord) => {
      if (mutation.type === "childList") {
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const node = mutation.removedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.tagName === "SPAN") {
              spansRemoved++;
            }
          }
        }
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          stillChanging = true;
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            if (element.tagName === "SPAN") {
              spansAdded++;
              console.debug("span added", element.textContent);
            } else if (element.tagName === "DIV") {
              const paragraph = element as HTMLDivElement;
              lastParagraphAdded = paragraph;
              console.debug("paragraph added", paragraph.textContent);
            }
          } else if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const content = textNode.textContent;
            console.debug("text node added", textNode.textContent);
            this.subject.next(content || "");
            spansReplaced++;
            // we're finished when the paragraph has no more preliminary content
            const paragraph = textNode.parentElement;
            const spansRemaining =
              paragraph?.querySelectorAll("span")?.length || 0;
            const isFinalParagraph = paragraph === lastParagraphAdded;

            if (
              spansReplaced >= spansRemoved &&
              spansReplaced >= spansAdded &&
              spansRemaining === 0 &&
              isFinalParagraph
            ) {
              stillChanging = false;
              // complete soon if not still changing
              setTimeout(() => {
                if (!stillChanging) {
                  this.subject.complete();
                }
              }, graceForAdditionalChanges);
            }
          }
        }
      } else if (mutation.type === "characterData") {
        const textNode = mutation.target as Text;
        const content = textNode.textContent;
        console.debug(
          `text node content changed from "${mutation.oldValue}" to "${content}"`
        );
      }
    };

    const framerCallback = (mutationsList: MutationRecord[]) => {
      mutationsList.forEach((mutation) => framerMutation(mutation));
    };

    this.observer = new MutationObserver(framerCallback);
    this.observer.observe(this.element, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    });
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
    if (!this.subject.closed) {
      this.subject.complete();
    }
  }

  // For testing purposes
  getObserver(): MutationObserver {
    return this.observer;
  }
}
