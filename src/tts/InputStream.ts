import { Observable, ReplaySubject, Subject } from "rxjs";

export const STREAM_TIMEOUT_MS: number = 8000; // visible for testing
export const TEXT_STABILITY_THRESHOLD_MILLIS: number = 1500; // visible for testing

// Visible for testing
export function getNestedText(node: HTMLElement): string {
  return node.textContent ?? node.innerText ?? "";
}
export interface InputStreamOptions {
  includeInitialText?: boolean;
  delimiter?: string;
  inactivityFactor?: number;
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
  protected inactivityFactor: number = 3;
  protected delimiter: string = "";

  constructor(
    protected element: HTMLElement,
    {
      includeInitialText = false,
      delimiter = "",
      inactivityFactor = 3,
    }: InputStreamOptions = {}
  ) {
    this.delimiter = delimiter;
    this.inactivityFactor = inactivityFactor;
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
        console.debug("Clearing timeout on stream completion");
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
      console.debug(`Streaming text began with "${initialText}"`);
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
      console.log(
        `Stream ended on timeout out after ${STREAM_TIMEOUT_MS}ms since last token`
      );
      this.subject.complete();
    }, STREAM_TIMEOUT_MS);
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
    const clearBatchIntervalTimer = () => {
      if (this.batchIntervalTimerId !== null) {
        clearTimeout(this.batchIntervalTimerId);
        this.batchIntervalTimerId = null;
      }
    };

    const updateBatchTiming = () => {
      const timeOfBatch = Date.now();
      if (this.timeOfLastBatch === null) {
        this.timeOfLastBatch = timeOfBatch;
      }
      const timeSinceLastBatch = timeOfBatch - this.timeOfLastBatch;
      this.timeOfLastBatch = timeOfBatch;
      if (timeSinceLastBatch > 0) {
        this.intervalsBetweenBatches.push(timeSinceLastBatch);
      }
      return (
        this.intervalsBetweenBatches.reduce((a, b) => a + b, 0) /
          this.intervalsBetweenBatches.length || 1000
      );
    };

    const handleElementNode = (
      element: HTMLElement,
      isFirstParagraph: boolean,
      avgIntervalMs: number
    ) => {
      if (this.delimiter && !isFirstParagraph) {
        this.subject.next(this.delimiter);
      }
      return; // skip element content for now
      const paragraph = getNestedText(element);
      if (paragraph) {
        handleText(
          paragraph,
          true,
          isFirstParagraph,
          true,
          true,
          avgIntervalMs
        );
      }
    };

    const handleTextNode = (
      textNode: Text,
      isFirstWordInParagraph: boolean,
      isFirstParagraph: boolean,
      isBlockElement: boolean,
      isLastWordInParagraph: boolean,
      avgIntervalMs: number
    ) => {
      const word: string | null = textNode.textContent || null;
      if (word) {
        handleText(
          word,
          isFirstWordInParagraph,
          isFirstParagraph,
          isBlockElement,
          isLastWordInParagraph,
          avgIntervalMs
        );
      }
    };

    const handleText = (
      word: string,
      isFirstWordInParagraph: boolean,
      isFirstParagraph: boolean,
      isBlockElement: boolean,
      isLastWordInParagraph: boolean,
      avgIntervalMs: number
    ) => {
      if (word) {
        this.subject.next(word);
        if (isLastWordInParagraph && !word.endsWith(" ")) {
          // end of paragraph increases likelihood that this is the end of the response
          this.batchIntervalTimerId = setTimeout(() => {
            console.log(
              `Stream ended on ${word} after ${(
                this.inactivityFactor * avgIntervalMs
              ).toFixed(0)}ms of inactivity`
            );
            this.subject.complete();
          }, this.inactivityFactor * avgIntervalMs);
        }
      }
    };

    const handleMutation = (
      mutation: MutationRecord,
      avgIntervalMs: number
    ) => {
      if (mutation.type === "childList") {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const isFirstParagraph = this.emittedValues.length === 0;

          const node = mutation.addedNodes[i];
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).tagName === "DIV"
          ) {
            handleElementNode(
              node as HTMLElement,
              isFirstParagraph,
              avgIntervalMs
            );
          } else if (node.nodeType === Node.TEXT_NODE) {
            const textNode = node as Text;
            const paragraph = textNode.wholeText;
            const isFirstWordInParagraph =
              i === 0 && paragraph.startsWith(textNode.textContent || "");
            const isBlockElement = node.parentElement?.tagName === "DIV";
            const isLastWordInParagraph = i === mutation.addedNodes.length - 1;
            handleTextNode(
              textNode,
              isFirstWordInParagraph,
              isFirstParagraph,
              isBlockElement,
              isLastWordInParagraph,
              avgIntervalMs
            );
          }
        }
      }
    };

    const observerCallback = (mutationsList: MutationRecord[]) => {
      clearBatchIntervalTimer();
      const avgIntervalMs = updateBatchTiming();
      mutationsList.forEach((mutation) =>
        handleMutation(mutation, avgIntervalMs)
      );
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
