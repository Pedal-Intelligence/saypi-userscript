import { Observable, ReplaySubject, Subject } from "rxjs";
import { UserPreferenceModule } from "../prefs/PreferenceModule";

export const STREAM_TIMEOUT: number = 10000; // visible for testing

// Visible for testing
export function getNestedText(node: HTMLElement): string {
  return node.textContent ?? node.innerText ?? "";
}
export interface InputStreamOptions {
  includeInitialText?: boolean;
  delimiter?: string;
}
interface TextContent {
  text: string;
  changed: boolean;
  changedFrom: string | null;
}

class TextItem implements TextContent {
  constructor(
    public text: string,
    public changed: boolean = false,
    public changedFrom: string | null = null
  ) {}
}

class AddedText extends TextItem {
  constructor(public text: string) {
    super(text, false, null);
  }
}

class ChangedText extends TextItem {
  constructor(public text: string, public changedFrom: string) {
    super(text, true, changedFrom);
  }
}

export { TextContent, TextItem, AddedText, ChangedText };

export class LateChangeEvent {
  constructor(
    public msAfterClose: number,
    public completion: Completion,
    public lang: string
  ) {}
}

type Completion = {
  type: "eod" | "timeout" | "disconnect";
  time: number;
};

export abstract class ElementTextStream {
  protected subject: Subject<TextContent>;
  private lateChangeSubject = new Subject<LateChangeEvent>();
  protected observer!: MutationObserver;
  protected timeout: NodeJS.Timeout | undefined = undefined;
  protected emittedValues: TextContent[] = [];
  protected timeOfLastTextChange: number = Date.now();
  protected batchIntervalTimerId: NodeJS.Timeout | null = null;
  protected delimiter: string = "";
  protected languageGuess: string = ""; // the language of the content in the element - guessed from user preferences
  private completionReason: Completion | null = null;
  private completed = false; // whether the stream has completed (reduntant check for subject.closed)

  constructor(
    protected element: HTMLElement,
    { includeInitialText = false, delimiter = "" }: InputStreamOptions = {}
  ) {
    this.delimiter = delimiter;
    UserPreferenceModule.getInstance()
      .getLanguage()
      .then((lang) => {
        this.languageGuess = lang;
      });
    this.subject = new ReplaySubject<TextContent>(); // replay the last value to new subscribers (for initial text)
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
    console.debug(
      "Starting stream on",
      this.element.id ? this.element.id : this.element
    );
    if (includeInitialText) {
      this.emitInitialText(element); // emit the initial text
    }
    this.registerObserver(); // start observing the element for additions
  }

  protected next(value: TextContent): void {
    if (this.closed()) {
      if (this.completionReason) {
        const timeElapsed = Date.now() - this.completionReason.time;
        console.debug(
          `Skipping next event for "${value.text}" because the stream has already completed on ${this.completionReason.type} ${timeElapsed}ms ago`
        );
      } else {
        console.debug(
          `Skipping next event for "${value.text}" because the stream was closed for no reason`
        );
      }
    } else {
      this.subject.next(value);
    }
  }

  protected complete(reason: Completion): void {
    if (this.closed()) {
      console.debug(
        `Cannot complete the stream on ${reason.type} because the stream has already been completed on ${this.completionReason?.type}`
      );
      return;
    }
    this.completionReason = reason;
    console.debug(
      `Completing stream on ${reason.type}`,
      this.element.id ? this.element.id : this.element
    );
    this.subject.complete();
    this.completed = true;
    //this.disconnect(); // stop observing the element - leave open for debugging to see if the stream is still active
  }

  /**
   * Redundant check for the closed property of the subject
   * For some reason, the subject is not closed immediately after calling subject.complete(),
   * so we need to use our own flag to check if the stream is closed.
   * @returns true if the stream is closed, false otherwise
   */
  protected closed(): boolean {
    return this.subject.closed || this.completed;
  }

  private emitInitialText(message: HTMLElement): void {
    const initialText = getNestedText(message);
    // send the initial text to the stream only if it's not empty
    if (initialText) {
      this.next(new AddedText(initialText));
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
      this.complete({ type: "timeout", time: Date.now() });
    }, STREAM_TIMEOUT);
  }

  protected getTextIsStable(): boolean {
    return this.closed();
  }

  protected registerObserver(): void {
    const contentMutationHandler = (mutationsList: MutationRecord[]) => {
      if (this.closed()) {
        const timeSinceCompletion = Date.now() - this.completionReason!.time;
        const warningMessage = `Content changed after the stream has closed. Try increasing the data timeout by at least ${timeSinceCompletion}ms for ${this.languageGuess}.`;
        console.warn(warningMessage);
        const lateChange = new LateChangeEvent(
          timeSinceCompletion,
          this.completionReason!,
          this.languageGuess
        );
        this.lateChangeSubject.next(lateChange);
        this.disconnect();
        return;
      }
      mutationsList.forEach((mutation) => this.handleMutationEvent(mutation));
    };

    this.observer = new MutationObserver(contentMutationHandler);
    this.observer.observe(this.element, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    });
  }

  getStream(): Observable<TextContent> {
    return this.subject.asObservable();
  }

  getLateChangeStream(): Observable<LateChangeEvent> {
    return this.lateChangeSubject.asObservable();
  }

  disconnect(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.observer.disconnect();
    this.lateChangeSubject.complete();
  }

  // For testing purposes
  getObserver(): MutationObserver {
    return this.observer;
  }

  abstract handleMutationEvent(mutation: MutationRecord): void;
}
