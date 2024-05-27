import { Observable, ReplaySubject, Subject } from "rxjs";

export const STREAM_TIMEOUT_MS: number = 8000; // visible for testing
export const TEXT_STABILITY_THRESHOLD_MILLIS: number = 1500; // visible for testing
export const PARAGRAPH_BREAK: string = "\n";

// Visible for testing
export function getNestedText(node: HTMLElement): string {
  return node.textContent ?? node.innerText ?? "";
}

export class ElementTextStream {
  protected subject: Subject<string>;
  protected observer!: MutationObserver;
  protected timeout: NodeJS.Timeout | undefined = undefined;
  protected emittedValues: string[] = [];
  protected timeOfLastTextChange: number = Date.now();
  private timeOfLastBatch: number | null = null;
  private intervalsBetweenBatches: number[] = [];
  protected batchIntervalTimerId: NodeJS.Timeout | null = null;

  constructor(protected element: HTMLElement) {
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
    this.registerObserver(); // start observing the element for additions
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
      console.log(`Stream timed out after ${STREAM_TIMEOUT_MS}ms`);
      this.subject.complete();
    }, STREAM_TIMEOUT_MS);
  }

  private getTextStreamedSoFar(): string {
    return this.emittedValues.join("");
  }

  protected getTextIsStable(): boolean {
    const timeSinceLastTextChange = Date.now() - this.timeOfLastTextChange;
    const textIsStable =
      timeSinceLastTextChange > TEXT_STABILITY_THRESHOLD_MILLIS;
    if (textIsStable) {
      console.log(
        `Text is stable, ${timeSinceLastTextChange}ms after last token`
      );
    }
    return textIsStable;
  }

  protected registerObserver(): void {
    const observerCallback = (mutationsList: MutationRecord[]) => {
      // Clear the timer if it's running
      if (this.batchIntervalTimerId !== null) {
        clearTimeout(this.batchIntervalTimerId);
        this.batchIntervalTimerId = null;
      }
      const timeOfBatch = Date.now();
      if (this.timeOfLastBatch === null) {
        this.timeOfLastBatch = timeOfBatch;
      }
      const timeSinceLastBatch = timeOfBatch - this.timeOfLastBatch;
      this.timeOfLastBatch = timeOfBatch;
      let avgIntervalMs = 1000;
      if (timeSinceLastBatch > 0) {
        this.intervalsBetweenBatches.push(timeSinceLastBatch);
        avgIntervalMs =
          this.intervalsBetweenBatches.reduce((a, b) => a + b, 0) /
          this.intervalsBetweenBatches.length;
      }
      for (let m = 0; m < mutationsList.length; m++) {
        const mutation = mutationsList[m];
        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              // if element is a div, it's a new paragraph
              if (element.tagName === "DIV" && this.emittedValues.length > 0) {
                //this.subject.next(PARAGRAPH_BREAK);
              }
            } else if (node.nodeType === Node.TEXT_NODE) {
              const textNode = node as Text;
              // with pi.ai, whole paragraphs are streamed as a list of text node mutations
              const word: string | null = textNode.textContent;
              const paragraph = textNode.wholeText; // the sentence is the adjacent contigious text of the node and its siblings
              if (word) {
                const isFirstWordInParagraph =
                  i === 0 && paragraph.startsWith(word);
                const isFirstParagraph = this.emittedValues.length === 0;
                const isBlockElement = node.parentElement?.tagName === "DIV";
                if (
                  isFirstWordInParagraph &&
                  !isFirstParagraph &&
                  isBlockElement
                ) {
                  this.subject.next(PARAGRAPH_BREAK + word);
                } else {
                  this.subject.next(word);
                }
                // all nodes in the paragraph end with a ' ', expect for sub-word tokens, and the final word
                const isLastWordInParagraph =
                  i === mutation.addedNodes.length - 1 &&
                  m === mutationsList.length - 1;
                if (word.endsWith(" ") || !isLastWordInParagraph) {
                  continue;
                } else {
                  this.batchIntervalTimerId = setTimeout(() => {
                    console.debug(
                      `Ending stream after ${(2 * avgIntervalMs).toFixed(
                        0
                      )}ms of inactivity`
                    );
                    this.subject.complete();
                  }, 2 * avgIntervalMs);

                  //this.subject.complete();
                  //return; // end early
                }
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

export class SilentElementTextStream extends ElementTextStream {
  private startTime: number | null = null;
  private timeToFirstToken: number | null = null;
  constructor(element: HTMLElement) {
    super(element);
  }

  override registerObserver(): void {
    // register a mutation observer that simply logs mutations
    const observerCallback = (mutationsList: MutationRecord[]) => {
      console.debug(mutationsList.length, "mutations observed");

      const mutationTime = Date.now();
      if (this.startTime === null) {
        this.startTime = mutationTime;
      }
      console.debug(
        `Time since start: ${
          mutationTime - this.startTime
        }ms, Time since first token: ${
          this.timeToFirstToken
            ? mutationTime - this.timeToFirstToken
            : "not found"
        }ms`
      );
      for (let mutation of mutationsList) {
        console.debug(`Type: ${mutation.type}, Target: ${mutation.target}`);
        if (mutation.type === "childList") {
          for (let node of mutation.addedNodes) {
            console.debug("Added node", node);
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              console.debug(element.tagName, "text", getNestedText(element));
            } else if (node.nodeType === Node.TEXT_NODE) {
              const textNode = node as Text;
              console.debug("Text node", textNode.wholeText);
              if (this.timeToFirstToken === null) {
                this.timeToFirstToken = Date.now();
              }
            }
          }
        }
      }
    };
    this.observer = new MutationObserver(observerCallback);
    this.observer.observe(this.element, { childList: true, subtree: true });
  }
}
