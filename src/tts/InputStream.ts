import { Observable, ReplaySubject, Subject } from "rxjs";

export const ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS: number = 8000; // visible for testing
export const TEXT_STABILITY_THRESHOLD_MILLIS: number = 1500; // visible for testing

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
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          console.log(
            `Ending stream on timeout, ${
              ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS / 1000
            }s after last text was passed`
          );
          this.subject.complete(); // Close stream on true timeout
        }, ELEMENT_TEXT_STREAM_TIMEOUT_DURATION_MILLIS);
      },
      complete: () => {
        console.log("Stream completed");
        clearTimeout(this.timeout);
      },
    });
    this.registerObserver();
  }

  private getTextStreamedSoFar(): string {
    return this.emittedValues.join(" ");
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
      console.debug(
        `Batch of ${mutationsList.length} mutations observed, ${timeSinceLastBatch}ms since last batch`
      );
      this.timeOfLastBatch = timeOfBatch;
      let avgIntervalMs = 1000;
      if (timeSinceLastBatch > 0) {
        this.intervalsBetweenBatches.push(timeSinceLastBatch);
        avgIntervalMs =
          this.intervalsBetweenBatches.reduce((a, b) => a + b, 0) /
          this.intervalsBetweenBatches.length;
        console.debug(
          `Average time between batches: ${avgIntervalMs.toFixed(0)}ms`
        );
      }
      for (let m = 0; m < mutationsList.length; m++) {
        const mutation = mutationsList[m];
        if (mutation.type === "childList") {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.nodeType === Node.TEXT_NODE) {
              const textNode = node as Text;
              // with pi.ai, whole sentences are streamed as a list of text node mutations
              const word: string | null = textNode.textContent;
              const sentence = textNode.wholeText; // the sentence is the adjacent contigious text of the node and its siblings
              if (word) {
                this.subject.next(word);
                // all nodes in the sentence end with a ' ', expect for sub-word tokens, and the final word
                const isLastWordInSentence =
                  i === mutation.addedNodes.length - 1 &&
                  m === mutationsList.length - 1;
                if (word.endsWith(" ") || !isLastWordInSentence) {
                  continue;
                } else {
                  console.debug(
                    `"${word}" is the final word in the sentence "${sentence}"`
                  );
                  if (sentence !== this.getTextStreamedSoFar()) {
                    console.warn(
                      `Streamed text "${this.getTextStreamedSoFar()}" does not match sentence "${sentence}"`
                    );
                  }
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
